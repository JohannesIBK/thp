import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { ICacheMinecraftUser, IMinecraftUser, MojangResponse } from "../types/mojang.interface";
import { addDashesToUUID } from "../utils/utils";

@Injectable({
  providedIn: "root",
})
export class MojangService {
  constructor(private readonly http: HttpClient) {}

  /*
   * Gets a player's data from the local storage.
   * If the uuid is not cached it tries fetching it from the api
   */
  getByCache(username: string): Observable<IMinecraftUser | null> {
    const data = localStorage.getItem(username.toLowerCase());

    if (data) {
      const player = JSON.parse(data) as ICacheMinecraftUser;

      // Check if cache is newer than two weeks
      if (new Date().getSeconds() - new Date(player.cached_at).getSeconds() <= 1209600) {
        return of({ name: player.name, uuid: player.uuid });
      }
    }

    // if not found in cache, try querying through the api
    return this.getByQuery(username);
  }

  /*
   * Fetches a player through the Mojang API.
   * Has the advantage to have no rate limit and to be slightly faster
   */
  getByQuery(username: string): Observable<IMinecraftUser | null> {
    return this.http.get<MojangResponse | null>(`https://api.mojang.com/users/profiles/minecraft/${username}`).pipe(
      map((res) => {
        if (res) {
          localStorage.setItem(res.name.toLowerCase(), JSON.stringify({ uuid: res.id, cached_at: new Date(), name: res.name }));

          return {
            name: res.name,
            uuid: addDashesToUUID(res.id),
          };
        }

        return null;
      }),
    );
  }
}
