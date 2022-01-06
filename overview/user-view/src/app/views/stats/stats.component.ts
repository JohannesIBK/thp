import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../api.service";
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
  stats = new Map<string, Map<number, IStats[]> | null>();
  relations: IPhaseEntry[] = [];
  tableData = new MatTableDataSourceWithCustomSort<ITeamWithStats>([]);
  groups = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  tournament!: ITournament;
  loaded = false;
  columns = ["name", "points"];

  constructor(private readonly apiService: ApiService, private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.apiService.fetchTournament().subscribe({
      next: (tournament) => {
        this.tournament = tournament;

        for (const phase of tournament.phases) {
          this.stats.set(phase.acronym, null);
        }

        this.fetchData();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  playerNameString(players: IPlayer[]): string {
    return players.map((p) => p.name).join(", ") || "Keine Spieler";
  }

  selectGroup(index: number) {
    this.tableData.data = [];
    this.tableData.data = this.currentTeams.filter((t) => t.group === this.groups[index]);
  }

  selectTab(index: number): void {
    this.tableData.data = [];
    const phase = this.tournament.phases[index];
    const phaseStats = this.stats.get(phase.acronym);

    if (!phaseStats) {
      this.currentTeams = [];
      this.selectGroup(0);
      return;
    }

    const relations = this.relations.filter((r) => r.phase === phase.acronym);
    const teams: ITeamWithStats[] = [];

    for (let team of this.teams) {
      const entry = relations.find((r) => r.teamId === team.id);
      const stats = phaseStats!.get(team.id) || [];
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
