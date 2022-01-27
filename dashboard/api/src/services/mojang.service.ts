import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable()
export class MojangService {
  constructor(private readonly http: HttpService) {}

  async getPlayerUUID(name: string): Promise<{ name: string; id: string } | null> {
    try {
      const res = await lastValueFrom(
        this.http.post<{ name: string; id: string }[]>("https://api.mojang.com/profiles/minecraft", [name], {
          headers: { "Content-Type": "application/json" },
        }),
      );

      return res.data[0];
    } catch (e) {
      return null;
    }
  }
}
