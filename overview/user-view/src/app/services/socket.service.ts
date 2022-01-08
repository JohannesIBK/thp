import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { environment } from "../../environments/environment";
import { IStats } from "../types/stats.interface";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket!: Socket;
  constructor() {}

  connectSocket(): void {
    this.socket = io(environment.url, { path: "/api/live-stats", withCredentials: true });
    this.socket.connect();
  }

  onMessage(): Observable<IStats> {
    return new Observable((observer) => {
      this.socket.on("stats", (stats: IStats) => {
        observer.next(stats);
      });
    });
  }
}
