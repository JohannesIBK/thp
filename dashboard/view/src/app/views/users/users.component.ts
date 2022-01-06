import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { CreateUserComponent } from "../../components/create-user/create-user.component";
import { DeleteUserComponent } from "../../components/delete-user/delete-user.component";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Permission } from "../../types/enums";
import { IUser } from "../../types/user.interface";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  currentUser?: IUser;
  loaded = false;
  Permission = Permission;
  users = new MatTableDataSource<IUser>([]);
  displayedColumns = ["username", "permission", "remove"];

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {
    this.users.filterPredicate = (data: IUser, filterValue: string) => {
      if ("user".startsWith(filterValue)) {
        return data.permission === Permission.USER;
      } else if ("admin".startsWith(filterValue)) {
        return data.permission === Permission.ADMIN;
      } else if ("helper".startsWith(filterValue)) {
        return data.permission === Permission.HELPER;
      }

      return data.username.toLowerCase().startsWith(filterValue);
    };
  }

  ngOnInit(): void {
    if (this.authService.token) {
      this.fetchUsers();
      this.currentUser = this.authService.rawUser!;
    } else {
      this.authService.user.subscribe((user) => {
        this.currentUser = user;
        this.fetchUsers();
      });
    }
  }

  openCreateUserDialog(): void {
    const dialog = this.dialog.open(CreateUserComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.users.data = [...this.users.data, result];
      }
    });
  }

  openDeleteUserDialog(userId: string): void {
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

  permissionToName(permission: Permission): string {
    switch (permission) {
      case Permission.ADMIN:
        return "Admin";
      case Permission.HEAD:
        return "Head-Admin";
      case Permission.HELPER:
        return "Helper";
      case Permission.USER:
        return "User";
      default:
        return "";
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }
}
