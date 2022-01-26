import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ITeam } from "../types/team.interface";
import { ITournament } from "../types/tournament.interface";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  fetchTournament(): Observable<ITournament> {
    return this.http.get<ITournament>(`${environment.url}/api/stats/tournament`).pipe();
  }

  fetchData(): Observable<ITeam[]> {
    return this.http.get<ITeam[]>(`${environment.url}/api/stats/data`).pipe();
  }
}
