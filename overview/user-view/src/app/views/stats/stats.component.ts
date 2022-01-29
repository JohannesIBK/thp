import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { ApiService } from "../../services/api.service";
import { SocketService } from "../../services/socket.service";
import { ITeam, ITeamWithData } from "../../types/team.interface";
import { ITournament } from "../../types/tournament.interface";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit {
  teams: ITeam[] = [];
  currentTeams: ITeamWithData[] = [];
  groupTeams: ITeamWithData[] = [];
  groups = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  tournament!: ITournament;
  loaded = false;
  update = new Subject<void>();

  constructor(
    private readonly socketService: SocketService,
    private readonly apiService: ApiService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.apiService.fetchTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;
        this.fetchData();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  subscribeToStats() {
    this.socketService.connectSocket();
    this.socketService.onMessage().subscribe((stat) => {
      const internalTeam = this.currentTeams.find((t) => t.team.id === stat.team.id);
      if (internalTeam) {
        internalTeam.team.stats.push(stat);
        const points = internalTeam.points.get(stat.round) || 0;
        internalTeam.points.set(stat.round, points + stat.points);

        this.update.next();
      } else if (stat.team?.players?.length) {
        // only scrims
        const team = { ...stat.team };

        stat.team = { id: team.id } as ITeam;
        team.stats = [stat];

        const points = new Map<number, number>();
        const data = { team, points, group: "A" };
        points.set(stat.round, stat.points);

        this.teams.push(stat.team);
        this.groupTeams.push(data);
        this.currentTeams.push(data);
        this.update.next();
      }
    });
  }

  selectGroup(index: number) {
    if (this.tournament.scrims) this.groupTeams = this.currentTeams;
    else this.groupTeams = this.currentTeams.filter((t) => t.group === this.groups[index]);
    this.update.next();
  }

  selectTab(index: number): void {
    const phase = this.tournament.phases[index];
    const teams: ITeamWithData[] = [];

    for (let team of this.teams) {
      const entry = team.entries.find((e) => e.phase === phase.acronym);

      if (entry) {
        const stats = team.stats.filter((s) => s.phase === phase.acronym);
        const points = new Map<number, number>();

        for (const stat of stats) {
          const round = points.get(stat.round) || 0;
          points.set(stat.round, round + stat.points);
        }

        teams.push({ team, points, group: entry.group });
      }
    }

    this.currentTeams = teams;
    this.selectGroup(0);
  }

  fetchData(): void {
    this.apiService.fetchData().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.selectTab(0);

        this.subscribeToStats();
        this.loaded = true;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message);
      },
    });
  }

  counter(index: number): Array<number> {
    return Array.from(Array(index).keys());
  }
}
