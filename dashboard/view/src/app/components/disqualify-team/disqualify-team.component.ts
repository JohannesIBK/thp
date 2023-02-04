import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { UntypedFormControl, Validators as V } from "@angular/forms";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { TeamService } from "../../services/team.service";
import { TeamManageResponse } from "../../types/enums";

@Component({
  selector: "app-disqualify-team",
  templateUrl: "./disqualify-team.component.html",
  styleUrls: ["./disqualify-team.component.scss"],
})
export class DisqualifyTeamComponent {
  loading = false;
  reasonInput = new UntypedFormControl("", [V.required, V.maxLength(512)]);

  constructor(
    private readonly dialogRef: MatDialogRef<DisqualifyTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly teamId: number,
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
  ) {}

  disqualifyTeam(): void {
    if (this.reasonInput.invalid) return;

    this.loading = true;
    this.teamService.disqualifyTeam(this.teamId, this.reasonInput.value).subscribe({
      next: (team) => {
        this.dialogRef.close({ action: TeamManageResponse.DISQUALIFIED, data: team });
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
