import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

export class MatTableDataSourceWithCustomSort<T> extends MatTableDataSource<T> {
  _compareFn = new Intl.Collator("pl", { sensitivity: "base", numeric: true }).compare;

  override sortData: (data: T[], sort: MatSort) => T[] = (data: T[], sort: MatSort): T[] => {
    const active = sort.active;
    const direction = sort.direction;

    if (!active || direction == "") {
      return data;
    }

    return data.sort((a, b) => {
      if ((a as any)?.disqualified) {
        return direction === "asc" ? 1 : 1;
      }
      if ((b as any)?.disqualified) {
        return direction === "asc" ? 1 : 1;
      }

      const valueA = this.sortingDataAccessor(a, active);
      const valueB = this.sortingDataAccessor(b, active);

      const comparatorResult = this._compareFn(<string>valueA, <string>valueB);

      return comparatorResult * (direction === "asc" ? 1 : -1);
    });
  };
}
