import { Component, Input, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Sort } from "@angular/material/sort";
import { Subject } from "rxjs";
import { IPhase } from "../../types/phase.interface";
import { IPlayer } from "../../types/player.interface";
import { ITeam, ITeamWithData } from "../../types/team.interface";
import { ViewLogsComponent } from "../view-logs/view-logs.component";

@Component({
  selector: "app-stats-table",
  templateUrl: "./stats-table.component.html",
  styleUrls: ["./stats-table.component.scss"],
})
export class StatsTableComponent implements OnInit {
  @Input() teams!: ITeamWithData[];
  @Input() phase!: IPhase;
  @Input() update!: Subject<void>;
  lastSort?: Sort;
  shownTeams: ITeamWithData[] = [];

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.sortData({ active: "pointsAll", direction: "desc" });

    this.update.subscribe(() => {
      if (this.lastSort) this.sortData(this.lastSort);
    });
  }

  openViewLogComponent(phase: IPhase, team: ITeam): void {
    this.dialog.open(ViewLogsComponent, {
      data: { stats: team.stats.filter((s) => s.phase === phase.acronym), phase },
      width: "90vw",
    });
  }

  playerNameString(players: IPlayer[]): string {
    return players.map((p) => p.name).join(", ") || "Keine Spieler";
  }

  getPointsSum(points: Map<number, number>): number {
    let sum = 0;

    for (const point of points.values()) {
      sum += point;
    }

    return sum;
  }

  counter(index: number): Array<number> {
    return Array.from(Array(index).keys());
  }

  sortData(sort: Sort) {
    const teams = this.teams.slice();
    const sortBy = sort.active.split("_")[0];
    const round = parseInt(sort.active.split("_")[1]);
    const isAsc = sort.direction === "asc";
    this.lastSort = { active: sort.active, direction: sort.direction };

    this.shownTeams = teams.sort((a, b) => {
      switch (sortBy) {
        case "players":
          return compare(this.playerNameString(a.team.players), this.playerNameString(b.team.players), isAsc);
        case "pointsAll":
          return compare(this.getPointsSum(a.points), this.getPointsSum(b.points), isAsc);
        case "points":
          return compare(a.points.get(round) || 0, b.points.get(round) || 0, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
