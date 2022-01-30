import { HttpErrorResponse } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddPlayerComponent } from "../../components/add-player/add-player.component";
import { AuthService } from "../../services/auth.service";
import { MojangService } from "../../services/mojang.service";
import { PlayerService } from "../../services/player.service";
import { TournamentService } from "../../services/tournament.service";
import { PermissionEnum } from "../../types/enums";
import { IPlayer } from "../../types/player.interface";
import { ITournament } from "../../types/tournament.interface";

@Component({
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.scss"],
})
export class PlayersComponent implements OnInit {
  players: IPlayer[] = [];
  tournament!: ITournament;
  loaded = false;
  dialogIsOpen = false;
  filter = "";
  filteredPlayers: IPlayer[] = [];

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly mojangService: MojangService,
    private readonly playerService: PlayerService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.token) {
      this.fetchPlayers();
    } else {
      this.authService.user.subscribe(() => {
        this.fetchPlayers();
      });
    }
  }

  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (event.key === "+" && !this.dialogIsOpen) {
      this.openAddPlayerDialog();
    }
  }

  applyFilter() {
    const filter = this.filter.trim().toLowerCase();

    if (filter === "") {
      this.filteredPlayers = this.players;
    } else {
      this.filteredPlayers = this.players.filter(
        (p) => p.name.trim().toLowerCase().includes(filter) || p.uuid.includes(filter) || p.team?.toString() === filter,
      );
    }
  }

  fetchPlayers(): void {
    this.tournamentService.getTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;

        this.playerService.getAllPlayers().subscribe({
          next: (players) => {
            this.players = players;
            this.applyFilter();
            this.loaded = true;
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, "OK", { duration: 3000 });
          },
        });
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

  openAddPlayerDialog(): void {
    this.dialogIsOpen = true;
    const dialog = this.dialog.open(AddPlayerComponent);

    dialog.afterClosed().subscribe((result: IPlayer | null) => {
      if (result) {
        const request =
          this.tournament.teamSize === 1 ? this.playerService.addPlayersAsTeam([result]) : this.playerService.addPlayer(result);
        request.subscribe({
          next: (players) => {
            this.players = players;
            this.applyFilter();
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, "OK", { duration: 3000 });
          },
        });
      }

      this.dialogIsOpen = false;
    });
  }

  deletePlayer(uuid: string): void {
    this.playerService.deletePlayer(uuid).subscribe({
      next: () => {
        this.players = this.players.filter((p) => p.uuid !== uuid);
        this.applyFilter();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
