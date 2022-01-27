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
import { IPhase } from "../../types/phase.interface";
import { ITeamFullData, ITeamStats } from "../../types/team.interface";
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
  teams: ITeamFullData[] = [];
  tableData = new MatTableDataSourceWithCustomSort<ITeamStats<ITeamFullData>>([]);
  columns = ["names", "group", "points", "edit"];
  loaded = false;
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
    const teams: ITeamStats<ITeamFullData>[] = [];

    for (let team of this.teams) {
      const entry = team.entries.find((e) => e.phase === phase.acronym);

      if (entry) {
        const stats = team.stats.filter((s) => s.phase === phase.acronym);
        let points = 0;

        for (const stat of stats) {
          points += stat.points;
        }

        teams.push({ team, group: entry.group, points });
      }
    }

    this.tableData.data = teams;
  }

  editTeam(team: ITeamFullData, phase: IPhase): void {
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
        team.stats = result;
      } else if (action === TeamManageResponse.QUALIFIED) {
        const disqualifiedTeam = this.teams.find((t) => t.id === data.id)!;
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
        this.loaded = false;
        this.fetchTeams();
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
        }
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

  fetchTeams(): void {
    this.teamService.getAllTeamData().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.selectTab(0);
        this.loaded = true;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
