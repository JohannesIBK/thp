import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators as V } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  hidePassword = true;
  username = new FormControl("", [V.required, V.minLength(3), V.maxLength(16)]);
  password = new FormControl("", [V.required, V.minLength(8)]);

  form = new FormGroup({ username: this.username, password: this.password });

  constructor(
    private readonly http: HttpClient,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  login(): void {
    if (this.form.invalid) return;

    this.authService.login(this.username.value, this.password.value).subscribe({
      next: () => {
        this.router.navigate([""]).then();
      },
      error: () => {
        this.snackbar.open("Username oder Passwort falsch!");
      },
    });
  }
}
