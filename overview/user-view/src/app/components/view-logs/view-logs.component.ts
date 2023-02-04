import { Component, Inject } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { IPhase } from "../../types/phase.interface";

import { IStats } from "../../types/stats.interface";

@Component({
  selector: "app-view-logs",
  templateUrl: "./view-logs.component.html",
  styleUrls: ["./view-logs.component.scss"],
})
export class ViewLogsComponent {
  tableData: IStats[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: { stats: IStats[]; phase: IPhase }) {
    this.tableData = data.stats;
  }

  selectTab(index: number): void {
    this.tableData = this.data.stats.filter((s) => s.round === index);
  }

  toTimeString(time: string): string {
    return "";
  }

  counter(index: number): Array<number> {
    return Array.from(Array(index).keys());
  }
}
