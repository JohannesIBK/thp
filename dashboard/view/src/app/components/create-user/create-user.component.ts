import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators as V } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "../../services/user.service";
import { Permission } from "../../types/enums";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent {
  loading = false;
  Permission = Permission;
  username = new FormControl("", [V.required, V.minLength(3), V.maxLength(16)]);
  password = new FormControl("", [V.required, V.minLength(8)]);
  permission = new FormControl(Permission.USER, [V.required]);
  form = new FormGroup({
    username: this.username,
    password: this.password,
    permission: this.permission,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly userPermission: Permission,
    private readonly dialogRef: MatDialogRef<CreateUserComponent>,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
  ) {}

  createUser(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.userService.createUser(this.form.value).subscribe({
      next: (user) => {
        this.dialogRef.close(user);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }
}
