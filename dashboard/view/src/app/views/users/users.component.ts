import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { CreateUserComponent } from "../../components/create-user/create-user.component";
import { DeleteUserComponent } from "../../components/delete-user/delete-user.component";
import { EditUserComponent } from "../../components/edit-user/edit-user.component";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { PermissionEnum } from "../../types/enums";
import { IUser } from "../../types/user.interface";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  currentUser!: IUser;
  loaded = false;
  permissionEnum = PermissionEnum;
  users = new MatTableDataSource<IUser>([]);
  displayedColumns = ["username", "permission", "edit", "remove"];

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.authService.token) {
      this.currentUser = this.authService.rawUser!;
      this.fetchUsers();
    } else {
      this.authService.user.subscribe((user) => {
        this.currentUser = user;
        this.fetchUsers();
      });
    }
  }

  openCreateUserDialog(): void {
    const dialog = this.dialog.open(CreateUserComponent, { data: this.currentUser.permission });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.users.data = [...this.users.data, result];
      }
    });
  }

  openDeleteUserDialog(userId: number): void {
    const dialog = this.dialog.open(DeleteUserComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.users.data = this.users.data.filter((u) => u.id !== userId);
          },
          error: (error: HttpErrorResponse) => {
            this.snackbar.open(error.error.message, "OK", { duration: 3000 });
          },
        });
      }
    });
  }

  openEditUserDialog(user: IUser): void {
    const dialog = this.dialog.open(EditUserComponent, { data: { user, currentUser: this.currentUser } });

    dialog.afterClosed().subscribe((result: IUser | null) => {
      if (result) {
        this.users.data = [...this.users.data.filter((u) => u.id !== result.id), result];
      }
    });
  }

  fetchUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.data = users;
        this.loaded = true;
      },
      error: (error: HttpErrorResponse) => {
        this.snackbar.open(error.error.message, "OK", { duration: 3000 });
      },
    });
  }

  permissionToName(permission: PermissionEnum): string {
    switch (permission) {
      case PermissionEnum.ADMIN:
        return "Admin";
      case PermissionEnum.HEAD:
        return "Site-Admin";
      case PermissionEnum.TOURNAMENT_HELPER:
        return "Turnier-Helfer";
      case PermissionEnum.USER:
        return "User";
      case PermissionEnum.SCRIMS_HELPER:
        return "Scrims-Helfer";
      default:
        return "";
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }
}
