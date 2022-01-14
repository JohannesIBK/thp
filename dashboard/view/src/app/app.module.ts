import { DragDropModule } from "@angular/cdk/drag-drop";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ActivateTournamentRequestComponent } from "./components/activate-tournament-request/activate-tournament-request.component";
import { ActivateTournamentComponent } from "./components/activate-tournament/activate-tournament.component";
import { AddLogComponent } from "./components/add-log/add-log.component";
import { AddPlayerTeamComponent } from "./components/add-player-team/add-player-team.component";
import { AddPlayerComponent } from "./components/add-player/add-player.component";
import { AddPlayersCsvComponent } from "./components/add-players-csv/add-players-csv.component";
import { CreateTournamentRequestComponent } from "./components/create-tournament-request/create-tournament-request.component";
import { CreateTournamentComponent } from "./components/create-tournament/create-tournament.component";
import { CreateUserComponent } from "./components/create-user/create-user.component";
import { DeleteTournamentComponent } from "./components/delete-tournament/delete-tournament.component";
import { DeleteUserComponent } from "./components/delete-user/delete-user.component";
import { DisqualifyTeamComponent } from "./components/disqualify-team/disqualify-team.component";
import { EditTournamentComponent } from "./components/edit-tournament/edit-tournament.component";
import { ManageTeamComponent } from "./components/manage-team/manage-team.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { QualifyTeamComponent } from "./components/qualify-team/qualify-team.component";
import { ResetRoundComponent } from "./components/reset-round/reset-round.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { TeamSiteDisabledComponent } from "./components/team-site-disabled/team-site-disabled.component";
import { TeamsUploadPreviewComponent } from "./components/teams-upload-preview/teams-upload-preview.component";
import { JwtRefreshInterceptor } from "./services/jwt-refresh.interceptor";
import { ChangePasswordComponent } from "./views/change-password/change-password.component";
import { ClientComponent } from "./views/client/client.component";
import { HomeComponent } from "./views/home/home.component";
import { LoginComponent } from "./views/login/login.component";
import { ManagementComponent } from "./views/management/management.component";
import { PhasesComponent } from "./views/phases/phases.component";
import { PlayersComponent } from "./views/players/players.component";
import { TeamsComponent } from "./views/teams/teams.component";
import { TournamentComponent } from "./views/tournament/tournament.component";
import { UsersComponent } from "./views/users/users.component";
import { EditUserComponent } from "./components/edit-user/edit-user.component";

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
    ClientComponent,
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
    AddPlayersCsvComponent,
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
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtRefreshInterceptor, multi: true }, MatIconRegistry],
  bootstrap: [AppComponent],
})
export class AppModule {}
