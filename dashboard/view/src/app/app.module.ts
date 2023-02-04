import { DragDropModule } from "@angular/cdk/drag-drop";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ActivateTournamentRequestComponent } from "./components/activate-tournament-request/activate-tournament-request.component";
import { ActivateTournamentComponent } from "./components/activate-tournament/activate-tournament.component";
import { AddLogComponent } from "./components/add-log/add-log.component";
import { AddPlayerTeamComponent } from "./components/add-player-team/add-player-team.component";
import { AddPlayerComponent } from "./components/add-player/add-player.component";
import { CreateTournamentRequestComponent } from "./components/create-tournament-request/create-tournament-request.component";
import { CreateTournamentComponent } from "./components/create-tournament/create-tournament.component";
import { CreateUserComponent } from "./components/create-user/create-user.component";
import { DeleteTournamentComponent } from "./components/delete-tournament/delete-tournament.component";
import { DeleteUserComponent } from "./components/delete-user/delete-user.component";
import { DisabledScrimsComponent } from "./components/disabled-scrims/disabled-scrims.component";
import { DisqualifyTeamComponent } from "./components/disqualify-team/disqualify-team.component";
import { EditTournamentComponent } from "./components/edit-tournament/edit-tournament.component";
import { EditUserComponent } from "./components/edit-user/edit-user.component";
import { ManageTeamComponent } from "./components/manage-team/manage-team.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { QualifyTeamComponent } from "./components/qualify-team/qualify-team.component";
import { ResetRoundComponent } from "./components/reset-round/reset-round.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { TeamSiteDisabledComponent } from "./components/team-site-disabled/team-site-disabled.component";
import { TeamsUploadPreviewComponent } from "./components/teams-upload-preview/teams-upload-preview.component";
import { JwtRefreshInterceptor } from "./services/jwt-refresh.interceptor";
import { ChangePasswordComponent } from "./views/change-password/change-password.component";
import { HomeComponent } from "./views/home/home.component";
import { LoginComponent } from "./views/login/login.component";
import { ManagementComponent } from "./views/management/management.component";
import { PhasesComponent } from "./views/phases/phases.component";
import { PlayersComponent } from "./views/players/players.component";
import { TeamsComponent } from "./views/teams/teams.component";
import { TournamentComponent } from "./views/tournament/tournament.component";
import { UsersComponent } from "./views/users/users.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    TeamsComponent,
    TournamentComponent,
    LoginComponent,
    UsersComponent,
    ChangePasswordComponent,
    CreateTournamentComponent,
    TeamsUploadPreviewComponent,
    SpinnerComponent,
    CreateTournamentRequestComponent,
    DeleteTournamentComponent,
    ActivateTournamentComponent,
    EditTournamentComponent,
    PlayersComponent,
    AddPlayerComponent,
    AddPlayerTeamComponent,
    PhasesComponent,
    ManagementComponent,
    ActivateTournamentRequestComponent,
    ManageTeamComponent,
    DisqualifyTeamComponent,
    AddLogComponent,
    QualifyTeamComponent,
    CreateUserComponent,
    DeleteUserComponent,
    TeamSiteDisabledComponent,
    ResetRoundComponent,
    EditUserComponent,
    DisabledScrimsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    MatSnackBarModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatExpansionModule,
    FormsModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSortModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    DragDropModule,
    MatTabsModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtRefreshInterceptor, multi: true }, MatIconRegistry],
  bootstrap: [AppComponent],
})
export class AppModule {}
