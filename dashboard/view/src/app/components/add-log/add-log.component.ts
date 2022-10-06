import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators as V } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StatsService } from "../../services/stats.service";
import { TeamManageResponse } from "../../types/enums";
import { IPhase } from "../../types/phase.interface";
import { ngCounter } from "../../utils/utils";

@Component({
  selector: "app-add-log",
  templateUrl: "./add-log.component.html",
  styleUrls: ["./add-log.component.scss"],
})
export class AddLogComponent {
  loading = false;
  pointsInput = new UntypedFormControl(0, [V.required, V.max(10), V.min(-10)]);
  reasonInput = new UntypedFormControl("", [V.required, V.minLength(1), V.maxLength(128)]);
  roundSelect = new UntypedFormControl(null, [V.required]);
  ngCounter = ngCounter;

  form = new UntypedFormGroup({
    points: this.pointsInput,
    reason: this.reasonInput,
    round: this.roundSelect,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: { phase: IPhase; teamId: number },
    private readonly dialogRef: MatDialogRef<AddLogComponent>,
    private readonly statsService: StatsService,
    private readonly snackBar: MatSnackBar,
  ) {}

  saveLog(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.statsService
      .addTeamLog({
        teamId: this.data.teamId,
        phase: this.data.phase.acronym,
        points: this.pointsInput.value,
        reason: this.reasonInput.value,
        round: this.roundSelect.value,
      })
      .subscribe({
        next: (stats) => {
          this.dialogRef.close({ action: TeamManageResponse.LOG_CHANGE, data: stats });
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, "OK", { duration: 3000 });
          this.loading = false;
        },
      });
  }
}
