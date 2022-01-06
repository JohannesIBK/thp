import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICreatePlayer, IPlayer } from "../types/player.interface";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAllPlayers(): Observable<IPlayer[]> {
    return this.http
      .get<IPlayer[]>(`${environment.url}/player`, { headers: { Authorization: this.authService.token }, withCredentials: true })
      .pipe();
  }

  addPlayer(player: ICreatePlayer): Observable<IPlayer[]> {
    return this.http
      .put<IPlayer[]>(`${environment.url}/player`, player, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  addPlayersAsTeam(players: ICreatePlayer[]): Observable<IPlayer[]> {
    return this.http.put<IPlayer[]>(
      `${environment.url}/player/team`,
      { players },
      {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      },
    );
  }

  deletePlayer(uuid: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/player/${uuid}`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }
}
