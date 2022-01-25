import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ITeam, ITeamsPlayersResponse } from "../types/team.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TeamService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAllTeams(): Observable<ITeam[]> {
    return this.http
      .get<ITeam[]>(`${environment.url}/teams`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  getAllTeamsWithPlayers(): Observable<ITeamsPlayersResponse> {
    return this.http
      .get<ITeamsPlayersResponse>(`${environment.url}/teams/players`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  createTeam(uuids: string[]): Observable<ITeam> {
    return this.http
      .put<ITeam>(`${environment.url}/teams`, { uuids }, { headers: { Authorization: this.authService.token }, withCredentials: true })
      .pipe();
  }

  saveTeam(id: number, uuids: string[]): Observable<ITeam> {
    return this.http
      .put<ITeam>(
        `${environment.url}/teams/${id}`,
        { uuids },
        { headers: { Authorization: this.authService.token }, withCredentials: true },
      )
      .pipe();
  }

  deleteTeam(tournamentId: string, teamId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/teams/${teamId}`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  disqualifyTeam(teamId: number, reason: string): Observable<ITeam> {
    return this.http
      .delete<ITeam>(`${environment.url}/teams/qualify/${teamId}`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
        params: { reason },
      })
      .pipe();
  }

  qualifyTeam(teamId: number): Observable<ITeam> {
    return this.http
      .patch<ITeam>(
        `${environment.url}/teams/qualify/${teamId}`,
        {},
        {
          headers: { Authorization: this.authService.token },
          withCredentials: true,
        },
      )
      .pipe();
  }

  update(tournamentId: string): Observable<void> {
    return this.http.post<void>(
      `${environment.url}/tournament/${tournamentId}/teams/update`,
      {},
      {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      },
    );
  }
}
