import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { ActivateTournamentRequestComponent } from "../../components/activate-tournament-request/activate-tournament-request.component";
import { ManageTeamComponent } from "../../components/manage-team/manage-team.component";
import { ResetRoundComponent } from "../../components/reset-round/reset-round.component";
import { AuthService } from "../../services/auth.service";
import { PhaseService } from "../../services/phase.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { PermissionEnum, TeamManageResponse } from "../../types/enums";
import { IPhase, IPhaseEntry } from "../../types/phase.interface";
import { IStats } from "../../types/stats.interface";
import { ITeamWithPlayers, ITeamWithStats } from "../../types/team.interface";
import { ITournament } from "../../types/tournament.interface";
import { MatTableDataSourceWithCustomSort } from "../../utils/sort-table-data-source";
import { playerNameString } from "../../utils/utils";

@Component({
  selector: "app-management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
})
export class ManagementComponent implements OnInit {
  tournament!: ITournament;
  phases: IPhase[] = [];
  teams: ITeamWithPlayers[] = [];
  tableData = new MatTableDataSourceWithCustomSort<ITeamWithStats>([]);
  columns = ["names", "group", "points", "edit"];
  loaded = 0;
  playerNameString = playerNameString;

  private sort!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly statsService: StatsService,
    private readonly phaseService: PhaseService,
    private readonly teamService: TeamService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly location: Location,
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

  setDataSourceAttributes() {
    this.tableData.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  selectTab(index: number): void {
    this.tableData.data = [];
    const phase = this.phases[index];

    if (!phaseStats) {
      this.statsService.fetchStats(phase.acronym).subscribe({
        next: (stats) => {
          if (stats.length) {
            for (const stat of stats) {
              let map = this.stats.get(stat.phase);
              if (map === null) {
                this.stats.set(stat.phase, new Map<number, IStats[]>());
                map = this.stats.get(stat.phase);
              }
              if (!map) continue;

              const team = map.get(stat.teamId) || [];
              team.push(stat);
              map.set(stat.teamId, team);
            }
          } else {
            this.stats.set(phase.acronym, new Map<number, IStats[]>());
          }
          setTimeout(() => this.selectTab(index), 500);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, "OK", { duration: 3000 });
        },
      });
    } else {
      const relations = this.relations.filter((r) => r.phase === phase.acronym);

      const teams: ITeamWithStats[] = [];

      for (let team of this.teams) {
        const entry = relations.find((r) => r.teamId === team.id);
        const stats = phaseStats!.get(team.id) || [];
        let points = 0;
        for (const stat of stats) {
          points += stat.points;
        }

        if (entry) {
          teams.push({ ...team, group: entry.group, points });
        }
      }

      this.tableData.data = teams;
    }
  }

  updateLoaded(): void {
    this.loaded++;

    if (this.loaded === 2) {
      this.selectTab(0);
    }
  }

  editTeam(team: ITeamWithPlayers, phase: IPhase): void {
    const dialog = this.dialog.open(ManageTeamComponent, { data: { team, phase, tournament: this.tournament }, minWidth: "80vw" });

    dialog.afterClosed().subscribe((result) => {
      if (!result) return;

      const { action, data }: { action: TeamManageResponse; data: any } = result;

      if (action === TeamManageResponse.DISQUALIFIED) {
        let disqualifiedTeam = this.teams.find((t) => t.id === data.id)!;
        disqualifiedTeam.disqualified = true;

        this.teams = [...this.teams.filter((t) => t.id !== data.id), disqualifiedTeam];
        this.selectTab(this.phases.indexOf(phase));
      } else if (action === TeamManageResponse.LOG_CHANGE) {
        const stats = this.stats.get(phase.acronym);
        if (stats) {
          stats.set(team.id, data);
          this.selectTab(this.phases.indexOf(phase));
        }
      } else if (action === TeamManageResponse.QUALIFIED) {
        let disqualifiedTeam = this.teams.find((t) => t.id === data.id)!;
        disqualifiedTeam.disqualified = false;

        this.teams = [...this.teams.filter((t) => t.id !== data.id), disqualifiedTeam];
        this.selectTab(this.phases.indexOf(phase));
      }
    });
  }

  openResetRoundDialog(): void {
    const dialog = this.dialog.open(ResetRoundComponent, { data: this.tournament });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.loaded--;
        this.fetchPhases();
      }
    });
  }

  openActivateTournamentRequest(): void {
    const dialog = this.dialog.open(ActivateTournamentRequestComponent);

    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(["/tournament"], { queryParams: { activate: true } }).then();
      } else {
        this.location.back();
      }
    });
  }

  fetchTournament(): void {
    this.tournamentService.getTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;

        for (const phase of tournament.phases) {
          this.phases.push(phase);
        }

        if (!tournament.active) this.openActivateTournamentRequest();
        else {
          this.fetchTeams();
          this.fetchPhases();
        }
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

  fetchTeams(): void {
    this.teamService.getAllTeamsWithPlayers().subscribe({
      next: ({ teams, players }) => {
        const _teams = [];
        let _players = players;

        for (const team of teams) {
          const teamWithPlayers: ITeamWithPlayers = {
            ...team,
            players: players.filter((p) => p.team === team.id),
          };
          _players = _players.filter((p) => p.team !== team.id);
          _teams.push(teamWithPlayers);
        }

        this.teams = _teams;
        this.updateLoaded();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
