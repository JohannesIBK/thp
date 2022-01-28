import { Injectable } from "@nestjs/common";
import { io, Socket } from "socket.io-client";
import { StatsEntity } from "../database/stats.entity";

@Injectable()
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io("http://localhost:3210", { path: "/api/live-stats" });
  }

  sendStats(stats: StatsEntity): void {
    this.socket.emit("receive-stats", stats);
  }
}
