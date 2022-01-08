import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSourceWithCustomSort } from "../../sort-table-data-source";
import { IStats } from "../../types/stats.interface";

@Component({
  selector: "app-view-logs",
  templateUrl: "./view-logs.component.html",
  styleUrls: ["./view-logs.component.scss"],
})
export class ViewLogsComponent {
  tableData = new MatTableDataSourceWithCustomSort<IStats>([]);
  columns = ["reason", "points"];

  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: IStats[]) {
    this.tableData.data = data;
  }
}
