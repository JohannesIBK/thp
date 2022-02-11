import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Socket, io } from "socket.io-client";
import { StatsEntity } from "../database/stats.entity";
import { IConfig } from "../types/config.interface";

@Injectable()
export class SocketService {
  socket: Socket;

  constructor(private readonly configService: ConfigService<IConfig, true>) {
    this.socket = io(this.configService.get("VIEW_SERVER"), { path: "/api/live-stats" });
  }

  sendStats(stats: StatsEntity): void {
    this.socket.emit("receive-stats", stats);
  }
}
