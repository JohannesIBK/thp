import { Component, OnInit } from "@angular/core";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { PermissionEnum } from "../../types/enums";
import { IUser } from "../../types/user.interface";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  user?: IUser;
  Permission = PermissionEnum;

  constructor(private readonly authService: AuthService, private readonly snackBar: MatSnackBar, private readonly router: Router) {}

  ngOnInit(): void {
    this.authService.getToken().subscribe({
      next: () => {},
      error: () => {},
    });

    this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
      error: () => {},
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.token = null;
        this.authService.user = null;
        this.router.navigate([""]).then();
      },
      error: () => {
        this.snackBar.open("Ein Fehler beim ausloggen ist aufgetreten", "OK", { duration: 3000 });
      },
    });
  }
}
