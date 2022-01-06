import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IPhaseEntry, IPhaseEntryCreate } from "../types/phase.interface";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class PhaseService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAllRelations(): Observable<IPhaseEntry[]> {
    return this.http
      .get<IPhaseEntry[]>(`${environment.url}/phase/entry`, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }

  saveEntry(entry: IPhaseEntryCreate): Observable<IPhaseEntry> {
    return this.http
      .post<IPhaseEntry>(`${environment.url}/phase/entry`, entry, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }

  deleteEntry(id: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/phase/entry/${id}`, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }

  deleteEntries(id: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/phase/entries/${id}`, {
        withCredentials: true,
        headers: { Authorization: this.authService.token },
      })
      .pipe();
  }
}
