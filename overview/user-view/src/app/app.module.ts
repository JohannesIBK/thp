import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { HomeComponent } from "./views/home/home.component";
import { StatsComponent } from "./views/stats/stats.component";
import { ViewLogsComponent } from "./components/view-logs/view-logs.component";
import { UserLogComponent } from "./components/user-log/user-log.component";

@NgModule({
  declarations: [HomeComponent, StatsComponent, NavbarComponent, AppComponent, SpinnerComponent, ViewLogsComponent, UserLogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatRippleModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
