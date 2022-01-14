import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ICreateUserPayload, IUser } from "../types/user.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAll(): Observable<IUser[]> {
    return this.http
      .get<IUser[]>(`${environment.url}/user`, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  createUser(payload: ICreateUserPayload): Observable<IUser> {
    return this.http
      .put<IUser>(`${environment.url}/user`, payload, {
        headers: { Authorization: this.authService.token },
        withCredentials: true,
      })
      .pipe();
  }

  editUser(payload: IUser): Observable<IUser> {
    return this.http
      .patch<IUser>(`${environment.url}/user/${payload.id}`, payload, {
        headers: {
          Authorization: this.authService.token,
        },
        withCredentials: true,
      })
      .pipe();
  }

  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/user/${id}`, {
        headers: {
          Authorization: this.authService.token,
        },
        withCredentials: true,
      })
      .pipe();
  }
}
