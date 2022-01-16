import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { IPhase } from "../../types/phase.interface";
import { IStats } from "../../types/stats.interface";

@Component({
  selector: "app-view-logs",
  templateUrl: "./view-logs.component.html",
  styleUrls: ["./view-logs.component.scss"],
})
export class ViewLogsComponent {
  tableData = new MatTableDataSource<IStats>([]);
  columns = ["reason", "points"];

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: { stats: IStats[]; phase: IPhase }) {
    this.tableData.data = data.stats;
  }

  selectTab(index: number): void {
    this.tableData.data = this.data.stats.filter((s) => s.round === index);
  }

  counter(i: number): Array<number> {
    return new Array(i);
  }
}
