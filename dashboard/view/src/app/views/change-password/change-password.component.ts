import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { UntypedFormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.sass"],
})
export class ChangePasswordComponent {
  hide = true;
  hide1 = true;
  hide2 = true;

  oldPW = new UntypedFormControl("", [Validators.required]);
  newPW = new UntypedFormControl("", [Validators.required, Validators.minLength(8)]);
  newPWRetry = new UntypedFormControl("", [Validators.required, Validators.minLength(8)]);

  constructor(private snackbar: MatSnackBar, private router: Router, private readonly authService: AuthService) {}

  changePW(): void {
    if (this.oldPW.invalid || this.newPW.invalid || this.newPWRetry.invalid) {
      return;
    }

    if (this.newPW.value !== this.newPWRetry.value) {
      this.snackbar.open("Die neuen Passwörter stimmen nicht überein.", "OK");
      return;
    }

    this.authService.changePassword(this.oldPW.value, this.newPW.value).subscribe({
      next: () => {
        this.snackbar.open("Das Passwort wurde erfolgreich geändert.", "OK");
      },
      error: (error: HttpErrorResponse) => {
        this.snackbar.open(error.error.message, "OK");
      },
    });
  }
}
