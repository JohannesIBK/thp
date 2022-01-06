import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
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
