import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TeamSiteDisabledComponent } from "../../components/team-site-disabled/team-site-disabled.component";
import { AuthService } from "../../services/auth.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { Permission } from "../../types/enums";
import { IPlayer } from "../../types/player.interface";
import { ITeamWithPlayers } from "../../types/team.interface";
import { ITournament } from "../../types/tournament.interface";
import { playerNameString } from "../../utils/utils";

@Component({
  selector: "app-index",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
})
export class TeamsComponent implements OnInit {
  tournament!: ITournament;
  currentTeam?: ITeamWithPlayers;
  currentTeamCopy?: ITeamWithPlayers;
  players: IPlayer[] = [];
  teams: ITeamWithPlayers[] = [];
  loaded = false;
  saving = false;
  playerNameString = playerNameString;

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
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  canAddPlayerToTeam(): () => boolean {
    return (): boolean => !!this.currentTeam && this.currentTeam?.players.length < this.tournament.teamSize;
  }

  addTeam(): void {
    if (this.currentTeam?.players.length) this.resetPlayerList();
    this.currentTeam = { disqualified: false, players: [], members: 0, id: -1 };
    this.currentTeamCopy = { ...this.currentTeam };
  }

  enableSaveButton(): boolean {
    return !!this.currentTeam && this.currentTeam.players.length === this.tournament.teamSize;
  }

  resetPlayerList(): void {
    if (!this.currentTeam) return;
    this.players = [...this.players, ...this.currentTeam.players];
  }

  selectNewTeam({ value }: { value: ITeamWithPlayers | undefined }) {
    if (value?.id === -1) this.resetPlayerList();
    if (this.currentTeam?.players.length) {
      for (const player of this.currentTeam.players) {
        if (!this.currentTeamCopy!.players.find((p) => p.uuid === player.uuid)) {
          this.players = [...this.players, player];
        }
      }
    } else if (this.currentTeam?.players.length === 0) {
      if (this.currentTeam.id >= 0) this.deleteTeam(this.currentTeam.id);
      else this.teams = this.teams.filter((t) => t.id !== -1);
    }
    this.currentTeam = value;
    this.currentTeamCopy = value;
  }

  saveCurrentTeam(): void {
    if (!this.currentTeam) return;
    if (this.currentTeam.players.length !== this.tournament.teamSize) this.resetPlayerList();

    this.saving = true;
    this.teamService.createTeam(this.currentTeam.players.map((p) => p.uuid)).subscribe({
      next: () => {
        this.fetchTeams();
        this.currentTeam = undefined;
        this.currentTeamCopy = undefined;
        this.saving = false;
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
        this.players = _players;
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
        }

        this.teams = this.teams.filter((t) => t.id !== teamId);
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
        if (tournament.teamSize == 1) {
          this.dialog.open(TeamSiteDisabledComponent);
        } else this.fetchTeams();
      },
      error: async (error: HttpErrorResponse) => {
        if (error.status === 404) {
          if (this.authService.rawUser?.permission === Permission.ADMIN) {
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
}
