import { Location } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-team-site-disabled",
  templateUrl: "./team-site-disabled.component.html",
  styleUrls: ["./team-site-disabled.component.scss"],
})
export class TeamSiteDisabledComponent {
  constructor(private readonly location: Location) {}

  closeDialog(): void {
    this.location.back();
  }
}
