import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ILoginResponse, IUser } from "../types/user.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  rawUser: IUser | null = null;
  private accessToken: string | null;
  private readonly userSubject: Subject<IUser | null>;

  constructor(private readonly http: HttpClient) {
    this.accessToken = null;
    this.userSubject = new Subject<IUser | null>();
  }

  get token(): string {
    if (this.accessToken) return `Bearer ${this.accessToken}`;
    return null as any;
  }

  set token(token: string | null) {
    this.accessToken = token;
  }

  // @ts-ignore
  get user(): Subject<IUser> {
    return this.userSubject as Subject<IUser>;
  }

  set user(user: IUser | null) {
    this.rawUser = user;
    this.userSubject.next(user);
  }

  getToken(): Observable<IUser> {
    return this.http.get<ILoginResponse>(`${environment.url}/user/token`, { withCredentials: true }).pipe(
      map((payload) => {
        this.token = payload.token;

        const user = this.parseJwt(payload.token);
        this.user = user;

        return user;
      }),
    );
  }

  login(username: string, password: string): Observable<IUser> {
    return this.http.post<ILoginResponse>(`${environment.url}/user/login`, { username, password }, { withCredentials: true }).pipe(
      map((payload) => {
        this.token = payload.token;

        const user = this.parseJwt(payload.token);
        this.user = user;

        return user;
      }),
    );
  }

  logout(): Observable<void> {
    return this.http
      .delete<void>(`${environment.url}/user/logout`, {
        headers: { Authorization: this.token },
        responseType: "text" as any,
      })
      .pipe();
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(
      `${environment.url}/user/change-password`,
      {
        old: oldPassword,
        new: newPassword,
      },
      {
        headers: { Authorization: this.token },
        withCredentials: true,
      },
    );
  }

  parseJwt(token: string): IUser {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  }
}
