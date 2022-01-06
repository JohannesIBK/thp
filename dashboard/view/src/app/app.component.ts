import { Component } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"],
})
export class AppComponent {
  constructor(public matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass("material-icons-round");
  }
}
