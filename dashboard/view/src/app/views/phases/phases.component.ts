import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { Router } from "@angular/router";
import { DisabledScrimsComponent } from "../../components/disabled-scrims/disabled-scrims.component";
import { AuthService } from "../../services/auth.service";
import { PhaseService } from "../../services/phase.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { PermissionEnum } from "../../types/enums";
import { IEntryCreate, IPhase } from "../../types/phase.interface";
import { ITeamFullData, ITeamWithEntryAndStats } from "../../types/team.interface";
import { ITournament } from "../../types/tournament.interface";
import { playerNameString } from "../../utils/utils";

@Component({
  selector: "app-phases",
  templateUrl: "./phases.component.html",
  styleUrls: ["./phases.component.scss"],
})
export class PhasesComponent implements OnInit {
  tournament!: ITournament;
  phase?: IPhase;
  showStatsFor: IPhase | 0 = 0;
  teams: ITeamFullData[] = [];
  rankedTeams = new Map<string, ITeamWithEntryAndStats[]>();
  teamStats = new Map<string, Map<number, number>>();
  unrankedTeams: ITeamWithEntryAndStats[] = [];
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  loaded = false;
  playerNameString = playerNameString;

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly phaseService: PhaseService,
    private readonly statsService: StatsService,
    private readonly authService: AuthService,
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.token) {
      this.fetchTournament();
    } else {
      this.authService.user.subscribe(() => {
        this.fetchTournament();
      });
    }
  }

  canAddPlayerToPhase(group: string): () => boolean {
    const teams = this.rankedTeams.get(group)!;
    return (): boolean => teams.length < this.phase!.teams;
  }

  /**
   * Handles the drag and drop logic
   * @param {CdkDragDrop<ITeamWithEntryAndStats[]>} event
   */
  drop(event: CdkDragDrop<ITeamWithEntryAndStats[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const data = event.item.data as ITeamWithEntryAndStats;

      // Checks if the team has been moved to the all teams d&d. If yes delete the entry else create a new
      if (event.container.id !== "all") this.saveEntry(data, event.container.id);
      else if (data.entry) this.deleteEntry(data);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * Returns the group names for the current phase
   * @return {string[]}
   */
  getGroups(): string[] {
    if (!this.phase) return [];

    const groups = [];

    for (let i = 0; i < this.phase.groups; i++) {
      groups.push(this.alphabet[i]);
    }

    return groups;
  }

  getCols(): number {
    if (!this.phase) return 1;
    return this.phase.groups + 1;
  }

  getConnectedGroups(): string[] {
    return ["all", ...this.getGroups()];
  }

  insertPlayers(): void {
    if (!this.phase) return;

    function getRandomGroup() {
      return groups[Math.round(Math.floor(Math.random() * groups.length))];
    }

    let groups: string[] = [];
    for (let i = 0; i < this.phase.groups; i++) {
      groups.push(this.alphabet[i]);
    }

    this.unrankedTeams.sort((a, b) => b.points - a.points);

    for (const [group, teams] of this.rankedTeams.entries()) {
      if (teams.length === this.phase.teams) {
        groups = groups.filter((g) => g !== group);
      }
    }

    for (const team of this.unrankedTeams) {
      const group = getRandomGroup();
      let newEntry: IEntryCreate;

      newEntry = {
        phase: this.phase!.acronym,
        group: group,
        teamId: team.team.id,
      };

      this.saveEntry(team, group, true);
    }
  }

  /**
   * Returns the stats for a team
   * @param {string} phase
   * @return {Map<number, number>}
   */
  getTeamStats(phase: string): Map<number, number> {
    const phaseTeamStats = this.teamStats.get(phase);
    if (phaseTeamStats) return phaseTeamStats;

    const stats = new Map<number, number>();

    for (const team of this.teams) {
      let points = 0;

      for (const stat of team.stats) {
        if (stat.phase === phase) {
          points += stat.points;
        }
      }

      stats.set(team.id, points);
    }

    this.teamStats.set(phase, stats);
    return stats;
  }

  changeStatsView(): void {
    this.selectPhase({ value: this.phase! });
  }

  selectPhase({ value }: { value: IPhase }) {
    this.rankedTeams.clear();
    this.unrankedTeams = [];

    for (let i = 0; i < value.groups; i++) {
      this.rankedTeams.set(this.alphabet[i], []);
    }

    let stats;

    if (typeof this.showStatsFor === "number") stats = this.getTeamStats(value.acronym);
    else stats = this.getTeamStats(this.showStatsFor.acronym);

    for (let team of this.teams) {
      const entry = team.entries.find((r) => r.phase === value.acronym);

      if (entry) {
        const teams = this.rankedTeams.get(entry.group)!;
        this.rankedTeams.set(entry.group, [...teams, { team, entry: entry.id, points: stats.get(team.id)! }]);
      } else {
        this.unrankedTeams.push({ team, points: stats.get(team.id)!, entry });
      }
    }

    this.unrankedTeams.sort((a, b) => b.points - a.points);
  }

  /**
   * Resets all entries for the currently selected phase
   */
  resetPhaseEntries(): void {
    if (!this.phase) return;

    this.phaseService.deleteEntries(this.phase.acronym).subscribe({
      next: () => {
        // remove the entry from every team
        for (const team of this.teams) {
          team.entries = team.entries.filter((e) => e.phase !== this.phase?.acronym);
        }

        if (this.phase) {
          this.selectPhase({ value: this.phase });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  /**
   * Removes a team from a group in a phase
   * @param {ITeamWithEntryAndStats} entry
   */
  deleteEntry(entry: ITeamWithEntryAndStats) {
    this.phaseService.deleteEntry(entry.entry!).subscribe({
      next: () => {
        // remove the entry from the array
        entry.team.entries = entry.team.entries.filter((e) => e.id !== entry.entry);

        // update teams
        if (this.phase) {
          this.selectPhase({ value: this.phase });
        }
      },
    });
  }

  /**
   * Adds a team to a group in a phase
   * @param {ITeamWithEntryAndStats} data
   * @param {string} group
   * @param {boolean} add If the team should be added to the array
   */
  saveEntry(data: ITeamWithEntryAndStats, group: string, add = false): void {
    this.phaseService
      .saveEntry({
        id: data.entry,
        phase: this.phase!.acronym,
        group,
        teamId: data.team.id,
      })
      .subscribe({
        next: (newEntry) => {
          // update the team with the new data
          data.team.entries.push(newEntry);
          data.entry = newEntry.id;

          if (add) {
            const teams = this.rankedTeams.get(group)!;
            teams.push(data);

            this.unrankedTeams = this.unrankedTeams.filter((t) => t.team.id !== data.team.id);
            this.rankedTeams.set(group, teams);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, "OK", { duration: 3000 });
        },
      });
  }

  /**
   * Fetches the tournament from the backend
   */
  fetchTournament(): void {
    this.tournamentService.getTournament().subscribe({
      next: (tournament) => {
        if (tournament.scrims) {
          this.dialog.open(DisabledScrimsComponent);
          return;
        }

        this.tournament = tournament;
        this.fetchTeams();
      },
      error: async (error: HttpErrorResponse) => {
        if (error.status === 404) {
          const permission = this.authService.rawUser?.permission;
          if (permission && permission >= PermissionEnum.ADMIN) {
            await this.router.navigate(["tournament"]);
          } else {
            await this.router.navigate(["/"]);
          }
        } else {
          this.snackBar.open(error.error.message, "OK", { duration: 3000 });
        }
      },
    });
  }

  /**
   * Fetches the teams from the backend
   */
  fetchTeams(): void {
    this.teamService.getAllTeamData().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loaded = true;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
