import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { TournamentService } from "../../services/tournament.service";

@Component({
  selector: "app-delete-tournament",
  templateUrl: "./delete-tournament.component.html",
  styleUrls: ["./delete-tournament.component.scss"],
})
export class DeleteTournamentComponent {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly dialogRef: MatDialogRef<DeleteTournamentComponent>,
    private readonly snackBar: MatSnackBar,
  ) {}

  deleteTournament() {
    this.tournamentService.delete().subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
