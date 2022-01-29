import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators as V } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "../../services/user.service";
import { PermissionEnum } from "../../types/enums";
import { IUser } from "../../types/user.interface";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
})
export class EditUserComponent {
  username: FormControl;
  permission: FormControl;
  form: FormGroup;
  PermissionEnum = PermissionEnum;
  loading = false;
  currentUser: IUser;
  user: IUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: { user: IUser; currentUser: IUser },
    private readonly dialogRef: MatDialogRef<EditUserComponent>,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.currentUser = data.currentUser;
    this.user = data.user;

    this.username = new FormControl(this.user.username, [V.minLength(3), V.maxLength(16)]);
    this.permission = new FormControl(this.user.permission);

    this.form = new FormGroup({
      username: this.username,
      permission: this.permission,
    });
  }

  editUser(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const data: Record<string, any> = {};
    if (this.form.value.username.toLowerCase() !== this.user.username) {
      data["username"] = this.form.value.username.toLowerCase();
    }

    if (this.form.value.permission !== this.user.permission && this.user.id !== this.currentUser.id) {
      data["permission"] = this.form.value.permission;
    }

    this.userService.editUser(this.user.id!, data as any).subscribe({
      next: (user) => {
        this.dialogRef.close(user);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, "OK", { duration: 3000 });
        this.loading = false;
      },
    });
  }

  canEditUser() {
    return !(
      this.form.valid &&
      (this.user.username !== this.username.value.toLowerCase() || this.permission.value !== this.user.permission)
    );
  }
}
