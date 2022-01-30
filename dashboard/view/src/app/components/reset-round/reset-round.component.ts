import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators as V } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StatsService } from "../../services/stats.service";
import { ITournament } from "../../types/tournament.interface";

@Component({
  selector: "app-reset-round",
  templateUrl: "./reset-round.component.html",
  styleUrls: ["./reset-round.component.scss"],
})
export class ResetRoundComponent {
  loading = false;
  phaseSelect = new FormControl(null, [V.required]);
  roundSelect = new FormControl(null, [V.required]);
  form = new FormGroup({
    phase: this.phaseSelect,
    round: this.roundSelect,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly tournament: ITournament,
    private readonly dialogRef: MatDialogRef<ResetRoundComponent>,
    private readonly statsService: StatsService,
    private readonly snackBar: MatSnackBar,
  ) {}

  resetRound(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.statsService.resetRound(this.phaseSelect.value, this.roundSelect.value).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
        this.loading = false;
      },
    });
  }

  counter(): Array<number> {
    if (this.phaseSelect.invalid) return new Array(0);
    return Array.from(Array(this.tournament.phases.find((p) => p.acronym === this.phaseSelect.value)!.rounds).keys());
  }
}
