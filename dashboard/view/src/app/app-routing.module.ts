import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChangePasswordComponent } from "./views/change-password/change-password.component";
import { ClientComponent } from "./views/client/client.component";
import { HomeComponent } from "./views/home/home.component";
import { LoginComponent } from "./views/login/login.component";
import { TeamsComponent } from "./views/teams/teams.component";
import { TournamentComponent } from "./views/tournament/tournament.component";
import { UsersComponent } from "./views/users/users.component";
import { PlayersComponent } from "./views/players/players.component";
import { PhasesComponent } from "./views/phases/phases.component";
import { ManagementComponent } from "./views/management/management.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "teams", component: TeamsComponent },
  { path: "tournament", component: TournamentComponent },
  { path: "login", component: LoginComponent },
  { path: "user", component: UsersComponent },
  { path: "change-password", component: ChangePasswordComponent },
  { path: "client", component: ClientComponent },
  { path: "players", component: PlayersComponent },
  { path: "phases", component: PhasesComponent },
  { path: "management", component: ManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
