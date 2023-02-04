import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators as V } from "@angular/forms";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { MojangService } from "../../services/mojang.service";
import { IPlayer } from "../../types/player.interface";
import { ITournament } from "../../types/tournament.interface";

@Component({
  selector: "app-add-player-teams",
  templateUrl: "./add-player-team.component.html",
  styleUrls: ["./add-player-team.component.scss"],
})
export class AddPlayerTeamComponent {
  loading = false;
  players: IPlayer[] = [];
  names: Record<number, UntypedFormControl> = {};
  form: UntypedFormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<AddPlayerTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly tournament: ITournament,
    private readonly mojangService: MojangService,
    private readonly snackBar: MatSnackBar,
  ) {
    for (let i = 0; i < tournament.teamSize; i++) {
      this.names[i] = new UntypedFormControl("", [V.required, V.minLength(3), V.maxLength(16)]);
    }

    this.form = new UntypedFormGroup(this.names);
  }

  addPlayers(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const players = [];

    for (const key in this.names) {
      players.push(this.names[key].value);
    }

    this.resolvePlayers(players);
  }

  resolvePlayers(players: string[]): void {
    if (!players.length) {
      this.dialogRef.close(players);
    }

    const name = players[0];

    this.mojangService.getByCache(name).subscribe({
      next: (player) => {
        if (player) {
          this.players.push({ name: player.name, uuid: player.uuid });
          players.shift();
          this.resolvePlayers(players);
        } else {
          this.snackBar.open(`Der Spieler ${name} wurde nicht gefunden`, "OK", { duration: 3000 });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(`Ein Problem mit der Mojang API ist aufgetreten. Code: ${error.status}`);
      },
    });
  }
}
