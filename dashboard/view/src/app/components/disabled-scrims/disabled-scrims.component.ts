import { Location } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-disabled-scrims",
  templateUrl: "./disabled-scrims.component.html",
  styleUrls: ["./disabled-scrims.component.scss"],
})
export class DisabledScrimsComponent {
  constructor(private readonly location: Location) {}

  closeDialog(): void {
    this.location.back();
  }
}
