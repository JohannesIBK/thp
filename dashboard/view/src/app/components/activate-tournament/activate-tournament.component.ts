import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { TournamentService } from "../../services/tournament.service";

@Component({
  selector: "app-activate-tournament",
  templateUrl: "./activate-tournament.component.html",
  styleUrls: ["./activate-tournament.component.scss"],
})
export class ActivateTournamentComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ActivateTournamentComponent>,
    private readonly tournamentService: TournamentService,
    private readonly snackBar: MatSnackBar,
  ) {}

  activateTournament() {
    this.tournamentService.activate().subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
