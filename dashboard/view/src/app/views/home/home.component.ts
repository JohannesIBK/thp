import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  constructor() {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  }
}
