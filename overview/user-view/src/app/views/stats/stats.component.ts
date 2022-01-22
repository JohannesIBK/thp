import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Sort } from "@angular/material/sort";
import { ViewLogsComponent } from "../../components/view-logs/view-logs.component";
import { ApiService } from "../../services/api.service";
import { SocketService } from "../../services/socket.service";
import { IPhase, IPhaseEntry } from "../../types/phase.interface";
import { IPlayer } from "../../types/player.interface";
import { IStats } from "../../types/stats.interface";
import { ITeamWithPlayers, ITeamWithStats } from "../../types/team.interface";
import { ITournament } from "../../types/tournament.interface";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit {
  teams: ITeamWithPlayers[] = [];
  currentTeams: ITeamWithStats[] = [];
  stats = new Map<string, Map<number, IStats[]>>();
  relations: IPhaseEntry[] = [];
  sortedTeams: ITeamWithStats[] = [];
  groupTeams: ITeamWithStats[] = [];
  groups = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  tournament!: ITournament;
  loaded = false;
  columns = new Map<string, string[]>();

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
          this.stats.set(phase.acronym, new Map());

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

    this.sortedTeams = teams.sort((a, b) => {
      switch (sortBy) {
        case "players":
          return compare(this.playerNameString(a.players), this.playerNameString(b.players), isAsc);
        case "pointsAll":
          return compare(this.getPointsSum(a.points), this.getPointsSum(b.points), isAsc);
        case "points":
          return compare(a.points.get(round) || 0, b.points.get(round) || 0, isAsc);
        default:
          return 0;
      }
    });
  }

  openViewLogComponent(phase: IPhase, teamId: number): void {
    const stats = this.stats.get(phase.acronym)!;
    const logs = stats.get(teamId);
    if (!logs) return;

    this.dialog.open(ViewLogsComponent, { data: { stats: logs, phase }, width: "90vw" });
  }

  subscribeToStats() {
    this.socketService.connectSocket();
    this.socketService.onMessage().subscribe((stats) => {
      const map = this.stats.get(stats.phase);
      if (map) {
        const teamStats = map.get(stats.teamId) || [];
        teamStats.push(stats);
        map.set(stats.teamId, teamStats);
      }

      let team = this.currentTeams.find((t) => t.id === stats.teamId);
      if (team) {
        const roundStats = team.points.get(stats.round) || 0;
        team.points.set(stats.round, roundStats + stats.points);
        this.teams = [...this.teams.filter((t) => t.id !== stats.teamId), team];
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
    const phaseStats = this.stats.get(phase.acronym);

    const relations = this.relations.filter((r) => r.phase === phase.acronym);
    const teams: ITeamWithStats[] = [];

    for (let team of this.teams) {
      const entry = relations.find((r) => r.teamId === team.id);

      if (entry) {
        let stats: IStats[] = [];
        if (phaseStats) stats = phaseStats.get(team.id) || [];
        const points = new Map<number, number>();

        for (let i = 0; i < stats.length; i++) {
          const stat = stats[i];

          const round = points.get(stat.round) || 0;
          points.set(stat.round, round + stat.points);
        }

        teams.push({ group: entry.group, points, players: team.players, id: team.id, disqualified: team.disqualified });
      }
    }

    this.currentTeams = teams;
    this.selectGroup(0);
  }

  fetchData(): void {
    this.apiService.fetchData().subscribe({
      next: ({ players, teams, relations, stats }) => {
        const _teams = [];
        let _players = players;

        for (const team of teams) {
          const teamWithPlayers: ITeamWithPlayers = {
            ...team,
            players: players.filter((p) => p.team === team.id),
          };
          _players = _players.filter((p) => p.team !== team.id);
          _teams.push(teamWithPlayers);
        }

        for (const stat of stats) {
          let map = this.stats.get(stat.phase);
          if (map === null) {
            this.stats.set(stat.phase, new Map<number, IStats[]>());
            map = this.stats.get(stat.phase);
          }
          if (!map) continue;

          const team = map.get(stat.teamId) || [];
          team.push(stat);
          map.set(stat.teamId, team);
        }

        this.teams = _teams;
        this.relations = relations;
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
