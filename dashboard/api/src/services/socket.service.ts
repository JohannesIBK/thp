import { Injectable } from "@nestjs/common";
import { Socket, io } from "socket.io-client";
import { StatsEntity } from "../database/stats.entity";
import { TeamEntity } from "../database/team.entity";

@Injectable()
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io("http://localhost:3210", { path: "/api/live-stats" });
  }

  sendStats(stats: StatsEntity, team?: TeamEntity): void {
    this.socket.emit("receive-stats", stats, team);
  }
}
