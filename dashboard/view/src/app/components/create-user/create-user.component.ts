import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators as V } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "../../services/user.service";
import { PermissionEnum } from "../../types/enums";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent {
  loading = false;
  PermissionEnum = PermissionEnum;
  username = new UntypedFormControl("", [V.required, V.minLength(3), V.maxLength(16)]);
  password = new UntypedFormControl("", [V.required, V.minLength(8)]);
  permission = new UntypedFormControl(PermissionEnum.USER, [V.required]);
  form = new UntypedFormGroup({
    username: this.username,
    password: this.password,
    permission: this.permission,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly userPermission: PermissionEnum,
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
