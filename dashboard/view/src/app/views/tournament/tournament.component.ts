import { animate, state, style, transition, trigger } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { lastValueFrom } from "rxjs";
import { CreateTournamentComponent } from "../../components/create-tournament/create-tournament.component";
import { AuthService } from "../../services/auth.service";
import { TournamentService } from "../../services/tournament.service";
import { IPhase } from "../../types/phase.interface";
import { ITournament } from "../../types/tournament.interface";
import { CreateTournamentRequestComponent } from "../../components/create-tournament-request/create-tournament-request.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ActivateTournamentComponent } from "../../components/activate-tournament/activate-tournament.component";
import { DeleteTournamentComponent } from "../../components/delete-tournament/delete-tournament.component";

@Component({
  selector: "app-tournament",
  templateUrl: "./tournament.component.html",
  styleUrls: ["./tournament.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class TournamentComponent implements OnInit {
  loaded = false;
  tournament?: ITournament;
  phases: IPhase[] = [];

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly snackbar: MatSnackBar,
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

  async downloadBackup(): Promise<void> {
    const file = (await lastValueFrom(this.tournamentService.getBackup())) as any;

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.setAttribute("download", "backup.sql");
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  openRequestDialog(): void {
    const dialogRef = this.dialog.open(CreateTournamentRequestComponent);

    dialogRef.afterClosed().subscribe((createTournament: boolean) => {
      if (createTournament) {
        this.openCreateDialog();
      } else {
        this.router.navigate(["/"]).then();
      }
    });
  }

  /*
   * Opens the dialog to create the tournament and handles the response
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTournamentComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.tournamentService.create(result).subscribe({
          next: (tournament) => {
            this.tournament = tournament;
            this.sortPhases();
            this.loaded = true;
          },
          error: (error: HttpErrorResponse) => {
            this.snackbar.open(error.error.message, "OK", { duration: 3000 });
          },
        });
      }
    });
  }

  openActivateDialog(): void {
    const dialogRef = this.dialog.open(ActivateTournamentComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loaded = false;
        this.fetchTournament();
      }
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteTournamentComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.tournament = undefined;
        this.loaded = false;
        this.fetchTournament();
      }
    });
  }

  fetchTournament(): void {
    this.tournamentService.getTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;
        this.sortPhases();
        this.loaded = true;

        if (!tournament.active)
          this.route.queryParams.subscribe((params) => {
            if (params.activate) {
              this.openActivateDialog();
              // remove query params
              this.router.navigate([]).then();
            }
          });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.openRequestDialog();
        } else {
          this.snackbar.open(error.error.message, "OK", {});
        }
      },
    });
  }

  sortPhases() {
    if (!this.tournament) return;

    this.phases = this.tournament.phases.sort((a, b) => b.teams * b.groups - a.teams * a.groups);
  }
}
