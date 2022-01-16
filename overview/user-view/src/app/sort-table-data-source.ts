import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ITeamWithStats } from "./types/team.interface";

export class MatPointsTableSort extends MatTableDataSource<ITeamWithStats> {
  override sortData: (data: ITeamWithStats[], sort: MatSort) => ITeamWithStats[] = (
    data: ITeamWithStats[],
    sort: MatSort,
  ): ITeamWithStats[] => {
    const active = sort.active;
    const direction = sort.direction;

    if (!active || direction == "") {
      return data;
    }

    return data.sort((a: ITeamWithStats, b: ITeamWithStats) => {
      if ((a as any)?.disqualified || (b as any)?.disqualified) {
        return direction === "asc" ? 1 : 1;
      }

      let pointsA = 0;
      let pointsB = 0;

      const toSort = active.slice(6);
      if (toSort === "All") {
        for (const points of a.points.values()) {
          pointsA += points;
        }

        for (const points of b.points.values()) {
          pointsB += points;
        }
      } else {
        const index = parseInt(toSort);

        pointsA = a.points.get(index) || 0;
        pointsB = b.points.get(index) || 0;
      }

      return (pointsA - pointsB) * (direction === "asc" ? 1 : -1);
    });
  };
}
