import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TeamService } from "../../services/team.service";
import { TeamManageResponse } from "../../types/enums";

@Component({
  selector: "app-disqualify-team",
  templateUrl: "./qualify-team.component.html",
  styleUrls: ["./qualify-team.component.scss"],
})
export class QualifyTeamComponent {
  loading = false;

  constructor(
    private readonly dialogRef: MatDialogRef<QualifyTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly teamId: number,
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
  ) {}

  qualifyTeam(): void {
    this.loading = true;
    this.teamService.qualifyTeam(this.teamId).subscribe({
      next: (team) => {
        this.dialogRef.close({ action: TeamManageResponse.QUALIFIED, data: team });
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
