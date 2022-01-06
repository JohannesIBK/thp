import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ICreateTournamentPayload, ITournament } from "../types/tournament.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TournamentService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getTournament(): Observable<ITournament> {
    return this.http
      .get<ITournament>(`${environment.url}/tournament`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  create(payload: ICreateTournamentPayload): Observable<ITournament> {
    return this.http
      .put<ITournament>(`${environment.url}/tournament`, payload, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  delete(): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/tournament/`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  activate(): Observable<void> {
    return this.http
      .patch<void>(
        `${environment.url}/tournament/activate`,
        {},
        {
          headers: {
            Authorization: this.authService.token,
          },
        },
      )
      .pipe();
  }
}
