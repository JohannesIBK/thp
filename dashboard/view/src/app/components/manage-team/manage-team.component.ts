import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TeamManageResponse } from "../../types/enums";
import { IPhase } from "../../types/phase.interface";
import { IStats } from "../../types/stats.interface";
import { ITeam } from "../../types/team.interface";
import { ngCounter } from "../../utils/utils";
import { AddLogComponent } from "../add-log/add-log.component";
import { DisqualifyTeamComponent } from "../disqualify-team/disqualify-team.component";
import { QualifyTeamComponent } from "../qualify-team/qualify-team.component";

@Component({
  selector: "app-manage-team",
  templateUrl: "./manage-team.component.html",
  styleUrls: ["./manage-team.component.scss"],
})
export class ManageTeamComponent implements OnInit {
  stats: IStats[] = [];
  tableData = new MatTableDataSource<IStats>();
  columns = ["reason", "points"];
  loading = false;
  ngCounter = ngCounter;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: { team: ITeam; phase: IPhase },
    public dialogRef: MatDialogRef<ManageTeamComponent>,
    private readonly statsService: StatsService,
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.statsService.fetchTeamStats(this.data.phase.acronym, this.data.team.id).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.selectTab(0);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  selectTab(index: number): void {
    this.tableData.data = this.stats.filter((s) => s.round === index);
  }

  closeReturnData(): any {
    if (this.stats.length) {
      return { action: TeamManageResponse.LOG_CHANGE, data: this.stats };
    }

    return null;
  }

  openDisqualifyDialog(): void {
    const dialog = this.dialog.open(DisqualifyTeamComponent, { data: this.data.team.id });

    dialog.afterClosed().subscribe((result: ITeam | false) => {
      if (result) {
        this.dialogRef.close(result);
      }
    });
  }

  openQualifyDialog(): void {
    const dialog = this.dialog.open(QualifyTeamComponent, { data: this.data.team.id });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(result);
      }
    });
  }

  openAddLogDialog(): void {
    const dialog = this.dialog.open(AddLogComponent, { data: { teamId: this.data.team.id, phase: this.data.phase } });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(result);
      }
    });
  }
}
