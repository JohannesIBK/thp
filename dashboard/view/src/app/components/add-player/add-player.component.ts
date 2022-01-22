import { Component } from "@angular/core";
import { MojangService } from "../../services/mojang.service";
import { FormControl, Validators as V } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-player",
  templateUrl: "./add-player.component.html",
  styleUrls: ["./add-player.component.scss"],
})
export class AddPlayerComponent {
  name = new FormControl("", [V.required, V.maxLength(32), V.minLength(2)]);
  loading = false;

  constructor(
    private readonly mojangService: MojangService,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<AddPlayerComponent>,
  ) {}

  addPlayer(): void {
    if (this.name.invalid) return;

    this.loading = true;
    this.mojangService.getByQuery(this.name.value).subscribe({
      next: (player) => {
        this.loading = false;
        if (player) {
          this.dialogRef.close({ name: player.name, uuid: player.uuid });
        } else {
          this.snackBar.open("Der Spieler wurde nicht gefunden", "OK", { duration: 3000 });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(`Ein Problem mit der Mojang API ist aufgetreten. Code: ${error.status}`);
      },
    });
  }
}
