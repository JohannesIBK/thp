import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { PhaseService } from "../../services/phase.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { PermissionEnum } from "../../types/enums";
import { IPhase, IPhaseEntry, IPhaseEntryCreate } from "../../types/phase.interface";
import { IStats } from "../../types/stats.interface";
import { ITeamWithEntry, ITeamWithEntryAndStats } from "../../types/team.interface";
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
  relations: IPhaseEntry[] = [];
  teams: ITeamWithEntry[] = [];
  logs: IStats[] = [];
  rankedTeams = new Map<string, ITeamWithEntryAndStats[]>();
  teamStats = new Map<string, Map<number, number>>();
  unrankedTeams: ITeamWithEntryAndStats[] = [];
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  loaded = 0;
  playerNameString = playerNameString;

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly phaseService: PhaseService,
    private readonly statsService: StatsService,
    private readonly authService: AuthService,
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
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

  drop(event: CdkDragDrop<ITeamWithEntryAndStats[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const data = event.item.data as ITeamWithEntry;

      if (event.container.id !== "all") {
        let newEntry: IPhaseEntryCreate;

        newEntry = {
          id: data.entry,
          phase: this.phase!.acronym,
          group: event.container.id,
          teamId: data.id,
        };

        this.saveEntry(newEntry);
      } else if (data.entry) this.deleteEntry(data.entry);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

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

  sortTeams() {
    this.unrankedTeams.sort((a, b) => b.points - a.points);

    for (const team of this.rankedTeams.values()) {
      team.sort((a, b) => b.points - a.points);
    }
  }

  async insertPlayers(): Promise<void> {
    if (!this.phase) return;

    function getRandomGroup() {
      return groups[Math.random() * (groups.length - 1)];
    }

    let groups: string[] = [];
    for (let i = 0; i < this.phase.groups; i++) {
      groups.push(this.alphabet[i]);
    }

    this.sortTeams();

    for (const [group, teams] of this.rankedTeams.entries()) {
      if (teams.length === this.phase.teams) {
        groups = groups.filter((g) => g !== group);
      }
    }

    for (const team of this.unrankedTeams) {
      const group = getRandomGroup();
      let newEntry: IPhaseEntryCreate;

      newEntry = {
        phase: this.phase!.acronym,
        group: group,
        teamId: team.id,
      };

      const res = await this.saveEntry(newEntry);
      if (res) {
        const teams = this.rankedTeams.get(group)!;
        if (teams.length === this.phase.groups) {
          groups = groups.filter((g) => g !== group);
        }
      }
    }
  }

  getTeamStats(phase: string): Map<number, number> {
    const phaseStats = this.teamStats.get(phase);
    if (phaseStats) return phaseStats;

    const stats = new Map<number, number>();
    for (const team of this.teams) {
      const logs = this.logs.filter((l) => l.teamId === team.id && l.phase === phase);
      let points = 0;

      for (const log of logs) points += log.points;
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

    const relations = this.relations.filter((r) => r.phase === value.acronym);
    let stats;

    if (typeof this.showStatsFor === "number") stats = this.getTeamStats(value.acronym);
    else stats = this.getTeamStats(this.showStatsFor.acronym);

    for (let team of this.teams) {
      const entry = relations.find((r) => r.teamId === team.id);
      if (entry) {
        const teams = this.rankedTeams.get(entry.group)!;
        this.rankedTeams.set(entry.group, [...teams, { ...team, entry: entry.id, points: stats.get(team.id)! }]);
      } else {
        this.unrankedTeams.push({ ...team, points: stats.get(team.id)! });
      }
    }
  }

  deletePhaseEntries(): void {
    if (!this.phase) return;
    const acronym = this.phase.acronym;

    this.phaseService.deleteEntries(acronym).subscribe({
      next: () => {
        this.relations = this.relations.filter((e) => e.phase !== acronym);
        if (this.phase) this.selectPhase({ value: this.phase });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  deleteEntry(id: number) {
    this.phaseService.deleteEntry(id).subscribe({
      next: () => {
        this.relations = this.relations.filter((e) => e.id !== id);
        if (this.phase) this.selectPhase({ value: this.phase });
      },
    });
  }

  async saveEntry(entry: IPhaseEntryCreate): Promise<IPhaseEntry | undefined> {
    try {
      const responseEntry = await lastValueFrom(this.phaseService.saveEntry(entry));
      this.relations = [...this.relations.filter((e) => e.id !== entry.id), responseEntry];
      if (this.phase) this.selectPhase({ value: this.phase });

      return responseEntry;
    } catch (error: any) {
      this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      return;
    }
  }

  fetchTournament(): void {
    this.tournamentService.getTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;
        this.fetchTeams();
        this.fetchPhases();
        this.fetchStats();
      },
      error: async (error: HttpErrorResponse) => {
        if (error.status === 404) {
          if (this.authService.rawUser?.permission === PermissionEnum.ADMIN) {
            await this.router.navigate(["tournaments"]);
          } else {
            await this.router.navigate(["/"]);
          }
        } else {
          this.snackBar.open(error.error.message, "OK", { duration: 3000 });
        }
      },
    });
  }

  fetchStats(): void {
    this.statsService.fetchAllStats().subscribe({
      next: (stats) => {
        this.logs = stats;
        this.loaded++;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  fetchTeams(): void {
    this.teamService.getAllTeamsWithPlayers().subscribe({
      next: ({ teams, players }) => {
        const _teams = [];
        let _players = players;

        for (const team of teams) {
          const teamWithPlayers: ITeamWithEntry = {
            ...team,
            players: players.filter((p) => p.team === team.id),
          };
          _players = _players.filter((p) => p.team !== team.id);
          _teams.push(teamWithPlayers);
        }

        this.teams = _teams;
        this.loaded++;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  fetchPhases(): void {
    this.phaseService.getAllRelations().subscribe({
      next: (entities) => {
        this.relations = entities;
        this.loaded++;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
