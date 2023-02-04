import { Component, Inject } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { ITeamUploadData } from "../../types/team.interface";

@Component({
  selector: "app-teams-upload-preview",
  templateUrl: "./teams-upload-preview.component.html",
  styleUrls: ["./teams-upload-preview.component.sass"],
})
export class TeamsUploadPreviewComponent {
  teams = new MatTableDataSource<ITeamUploadData>([]);
  tableColumns = ["username", "groups"];

  constructor(@Inject(MAT_DIALOG_DATA) private data: ITeamUploadData[]) {
    this.teams.data = data;
  }
}
