import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { Router } from "@angular/router";
import { DisabledScrimsComponent } from "../../components/disabled-scrims/disabled-scrims.component";
import { TeamSiteDisabledComponent } from "../../components/team-site-disabled/team-site-disabled.component";
import { AuthService } from "../../services/auth.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { PermissionEnum } from "../../types/enums";
import { IPlayer } from "../../types/player.interface";
import { ITeam } from "../../types/team.interface";
import { ITournament } from "../../types/tournament.interface";
import { playerNameString } from "../../utils/utils";

@Component({
  selector: "app-index",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
})
export class TeamsComponent implements OnInit {
  tournament!: ITournament;
  currentTeam?: ITeam;
  currentTeamCopy?: ITeam;
  players: IPlayer[] = [];
  filteredPlayers: IPlayer[] = [];
  teams: ITeam[] = [];
  filteredTeams: ITeam[] = [];
  loaded = false;
  saved = true;
  saving = false;
  playerNameString = playerNameString;
  teamSearch = "";
  filter = "";

  constructor(
    private readonly tournamentService: TournamentService,
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

  drop(event: CdkDragDrop<IPlayer[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.saved = false;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  canAddPlayerToTeam(): () => boolean {
    return (): boolean => !!this.currentTeam && this.currentTeam?.players.length < this.tournament.teamSize;
  }

  addTeam(): void {
    if (this.currentTeam && this.currentTeam.players.length && !this.saved) this.resetPlayerList();
    this.currentTeam = { disqualified: false, players: [], members: 0, id: -1 };
    this.currentTeamCopy = { ...this.currentTeam };
  }

  enableSaveButton(): boolean {
    return !!this.currentTeam && this.currentTeam.players.length === this.tournament.teamSize;
  }

  resetPlayerList(): void {
    if (!this.currentTeam) return;
    this.players = [...this.players, ...this.currentTeam.players];
    this.applyFilter();
  }

  applyFilter() {
    if (this.filter.trim() === "") {
      this.filteredPlayers = this.players;
    } else {
      this.filteredPlayers = this.players.filter((p) => p.name.trim().toLowerCase().includes(this.filter.trim().toLowerCase()));
    }
  }

  applySelectFilter() {
    const filter = this.teamSearch.trim().toLowerCase();

    if (filter === "") {
      this.filteredTeams = this.teams;
    } else {
      this.filteredTeams = this.teams.filter((t) => t.players.find((p) => p.name.toLowerCase().includes(filter)));
    }
  }

  selectNewTeam({ value }: { value: ITeam | undefined }) {
    if (value?.id === -1) this.resetPlayerList();
    if (this.currentTeam?.players.length) {
      for (const player of this.currentTeam.players) {
        if (!this.currentTeamCopy!.players.find((p) => p.uuid === player.uuid)) {
          this.players = [...this.players, player];
          this.applyFilter();
        }
      }
    } else if (this.currentTeam?.players.length === 0) {
      if (this.currentTeam.id >= 0) this.deleteTeam(this.currentTeam.id);
      else {
        this.teams = this.teams.filter((t) => t.id !== -1);
        this.applySelectFilter();
      }
    }
    this.currentTeam = value;
    this.currentTeamCopy = value;
  }

  saveCurrentTeam(): void {
    if (!this.currentTeam) return;
    if (this.currentTeam.players.length !== this.tournament.teamSize) {
      this.resetPlayerList();
      return;
    }

    this.saving = true;
    let req;

    if (this.currentTeam.id === -1) {
      req = this.teamService.createTeam(this.currentTeam.players.map((p) => p.uuid));
    } else {
      req = this.teamService.saveTeam(
        this.currentTeam.id,
        this.currentTeam.players.map((p) => p.uuid),
      );
    }

    req.subscribe({
      next: (team) => {
        this.teams = [...this.teams, team];
        this.applySelectFilter();

        this.currentTeam = undefined;
        this.currentTeamCopy = undefined;
        this.addTeam();
        this.saving = false;
        this.saved = true;
      },
    });
  }

  fetchTeams(): void {
    this.teamService.getTeams().subscribe({
      next: ({ teams, players }) => {
        this.teams = teams;
        this.players = players;

        this.applySelectFilter();
        this.applyFilter();
        this.loaded = true;
      },
    });
  }

  deleteTeam(teamId: number) {
    this.teamService.deleteTeam(this.tournament.id, teamId).subscribe({
      next: () => {
        const team = this.teams.find((t) => t.id === teamId);
        if (team && team.players.length) {
          this.players = [...this.players, ...team.players];
          this.applyFilter();
        }

        this.teams = this.teams.filter((t) => t.id !== teamId);
        this.applySelectFilter();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  fetchTournament(): void {
    this.tournamentService.getTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;
        if (tournament.scrims) {
          this.dialog.open(DisabledScrimsComponent);
          return;
        }
        if (tournament.teamSize == 1) {
          this.dialog.open(TeamSiteDisabledComponent);
          return;
        } else this.fetchTeams();
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
}
