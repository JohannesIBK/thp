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

  sendStats(data: { stats: StatsEntity; team?: TeamEntity | null }): void {
    console.log("Send data: ", data);
    this.socket.emit("receive-stats", data);
  }
}
