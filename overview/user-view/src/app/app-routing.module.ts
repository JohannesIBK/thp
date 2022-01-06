import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./views/home/home.component";
import { StatsComponent } from "./views/stats/stats.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "stats", component: StatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
