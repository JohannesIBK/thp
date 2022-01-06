import { Component } from "@angular/core";
import { CsvService } from "../../services/csv.service";
import { ITeamUploadData } from "../../types/team.interface";

@Component({
  selector: "app-add-players-csv",
  templateUrl: "./add-players-csv.component.html",
  styleUrls: ["./add-players-csv.component.scss"],
})
export class AddPlayersCsvComponent {
  constructor(private readonly csvService: CsvService) {}

  fileUpload($event: any): void {
    const file = $event.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = (e: any) => {
      const text = e.target.result;
      const data = this.csvService.csvToArray(text) as ITeamUploadData[];
    };
  }
}
