import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CsvService {
  constructor() {}

  csvToArray(data: string, delimiter: string = ","): unknown | null {
    const headers = data
      .slice(0, data.indexOf("\n"))
      .split(delimiter)
      .map((h) => h.toLowerCase());

    if (headers[0] === "username" && headers[1] === "group") {
      let rows = data
        .slice(data.indexOf("\n") + 1)
        .split("\n")
        .filter((r) => r.length);

      return rows.map((row) => {
        const values = row.split(delimiter);
        return headers.reduce(function (object: any, header, index) {
          if (header === "username") {
            object[header.toLowerCase()] = values[index].split(" ");
          } else {
            object[header.toLowerCase()] = values[index].split(" ")[0];
          }
          return object;
        }, {});
      });
    }
    return null;
  }
}
