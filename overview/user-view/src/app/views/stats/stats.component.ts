import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { ViewLogsComponent } from "../../components/view-logs/view-logs.component";
import { ApiService } from "../../services/api.service";
import { SocketService } from "../../services/socket.service";
import { MatTableDataSourceWithCustomSort } from "../../sort-table-data-source";
import { IPhaseEntry } from "../../types/phase.interface";
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
  tableData = new MatTableDataSourceWithCustomSort<ITeamWithStats>([]);
  groups = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  tournament!: ITournament;
  loaded = false;
  updates = false;
  columns = ["name", "points"];

  private sort!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

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
        }

        this.fetchData();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  setDataSourceAttributes() {
    this.tableData.sort = this.sort;
  }

  openViewLogComponent(phase: string, teamId: number): void {
    const stats = this.stats.get(phase)!;
    const logs = stats.get(teamId);
    if (!logs) return;

    this.dialog.open(ViewLogsComponent, { data: logs, width: "90vw" });
  }

  subscribeToStats() {
    this.socketService.connectSocket();
    this.updates = true;
    this.socketService.onMessage().subscribe((stats) => {
      const map = this.stats.get(stats.phase);
      if (map) {
        const teamStats = map.get(stats.teamId) || [];
        teamStats.push(stats);
        map.set(stats.teamId, teamStats);
      }

      let team = this.currentTeams.find((t) => t.id === stats.teamId);
      if (team) {
        team.points = team.points + stats.points;
        this.teams = [...this.teams.filter((t) => t.id !== stats.teamId), team];
      }
    });
  }

  playerNameString(players: IPlayer[]): string {
    return players.map((p) => p.name).join(", ") || "Keine Spieler";
  }

  selectGroup(index: number) {
    this.tableData.data = [];
    this.tableData.data = this.currentTeams.sort();
    if (index === 0) {
      this.tableData.data = this.currentTeams;
      this.tableData.data.sort((a, b) => b.points - a.points);
    } else {
      this.tableData.data = this.currentTeams.filter((t) => t.group === this.groups[index - 1]);
      this.tableData.data.sort((a, b) => b.points - a.points);
    }
  }

  selectTab(index: number): void {
    this.tableData.data = [];
    const phase = this.tournament.phases[index];
    const phaseStats = this.stats.get(phase.acronym);

    const relations = this.relations.filter((r) => r.phase === phase.acronym);
    const teams: ITeamWithStats[] = [];

    for (let team of this.teams) {
      const entry = relations.find((r) => r.teamId === team.id);
      let stats: IStats[] = [];
      if (phaseStats) stats = phaseStats.get(team.id) || [];
      let points = 0;
      for (const stat of stats) {
        points += stat.points;
      }

      if (entry) {
        teams.push({ ...team, group: entry.group, points });
      }
    }

    teams.sort((a, b) => b.points - a.points);

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
        this.subscribeToStats();
        this.loaded = true;

        this.selectTab(0);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message);
      },
    });
  }

  counter(index: number): Array<void> {
    return new Array(index);
  }
}
