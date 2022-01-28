import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Sort } from "@angular/material/sort";
import { ViewLogsComponent } from "../../components/view-logs/view-logs.component";
import { ApiService } from "../../services/api.service";
import { SocketService } from "../../services/socket.service";
import { IPhase } from "../../types/phase.interface";
import { IPlayer } from "../../types/player.interface";
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
  sortedTeams: ITeamWithData[] = [];
  groupTeams: ITeamWithData[] = [];
  groups = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  tournament!: ITournament;
  loaded = false;
  columns = new Map<string, string[]>();
  lastSort?: Sort;

  constructor(
    private readonly socketService: SocketService,
    private readonly apiService: ApiService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.apiService.fetchTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;

        for (const phase of tournament.phases) {
          const cols = ["name", "pointsAll"];
          for (let i = 0; i < phase.rounds; i++) {
            cols.push(`points${i}`);
          }

          this.columns.set(phase.acronym, cols);
        }

        this.fetchData();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  sortData(sort: Sort) {
    const teams = this.groupTeams.slice();
    const sortBy = sort.active.split("_")[0];
    const round = parseInt(sort.active.split("_")[1]);
    const isAsc = sort.direction === "desc";
    this.lastSort = { active: sort.active, direction: sort.direction };

    this.sortedTeams = teams.sort((a, b) => {
      switch (sortBy) {
        case "players":
          return compare(this.playerNameString(a.team.players), this.playerNameString(b.team.players), isAsc);
        case "pointsAll":
          return compare(this.getPointsSum(a.points), this.getPointsSum(b.points), isAsc);
        case "points":
          return compare(a.points.get(round) || 0, b.points.get(round) || 0, isAsc);
        default:
          return 0;
      }
    });
  }

  openViewLogComponent(phase: IPhase, team: ITeam): void {
    this.dialog.open(ViewLogsComponent, {
      data: { stats: team.stats.filter((s) => s.phase === phase.acronym), phase },
      width: "90vw",
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

        if (this.lastSort) this.sortData(this.lastSort);
      } else if (stat.team?.players?.length) {
        const team = { ...stat.team };

        stat.team = { id: team.id } as ITeam;
        team.stats = [stat];

        // only scrims
        const points = new Map<number, number>();
        const data = { team, points, group: "A" };
        points.set(stat.round, stat.points);

        this.teams.push(stat.team);
        this.groupTeams.push(data);
        this.currentTeams.push(data);
        if (this.lastSort) this.sortData(this.lastSort);
      }
    });
  }

  playerNameString(players: IPlayer[]): string {
    return players.map((p) => p.name).join(", ") || "Keine Spieler";
  }

  selectGroup(index: number) {
    this.groupTeams = this.currentTeams.filter((t) => t.group === this.groups[index]);
    this.sortedTeams = this.currentTeams;
    this.sortData({ active: "pointsAll", direction: "asc" });
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

  getPointsSum(points: Map<number, number>): number {
    let sum = 0;

    for (const point of points.values()) {
      sum += point;
    }

    return sum;
  }

  counter(index: number): Array<void> {
    return new Array(index);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
