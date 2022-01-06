import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ICreateStats, IStats } from "../types/stats.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class StatsService {
  constructor(private readonly authService: AuthService, readonly http: HttpClient) {}

  fetchAllStats(): Observable<IStats[]> {
    return this.http
      .get<IStats[]>(`${environment.url}/stats`, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }

  fetchStats(phase: string): Observable<IStats[]> {
    return this.http
      .get<IStats[]>(`${environment.url}/stats/phase/${phase}`, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }

  fetchTeamStats(phase: string, teamId: number, round?: number): Observable<IStats[]> {
    return this.http
      .post<IStats[]>(
        `${environment.url}/stats/team/${phase}`,
        {
          id: teamId,
          round,
        },
        {
          withCredentials: true,
          headers: { Authorization: this.authService.token },
        },
      )
      .pipe();
  }

  addTeamLog(payload: ICreateStats): Observable<IStats[]> {
    return this.http
      .put<IStats[]>(`${environment.url}/stats`, payload, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }

  resetRound(phase: string, round: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/stats/${phase}/${round}`, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }
}
