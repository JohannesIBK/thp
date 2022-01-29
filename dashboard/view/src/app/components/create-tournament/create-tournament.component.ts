import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators as V } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IPhase } from "../../types/phase.interface";

@Component({
  selector: "app-create-tournament",
  templateUrl: "./create-tournament.component.html",
  styleUrls: ["./create-tournament.component.scss"],
})
export class CreateTournamentComponent {
  phases: IPhase[] = [];
  columns = ["name", "acronym", "rounds", "description", "teams", "groups", "delete"];
  columnNames: Record<string, string> = {
    name: "Name",
    acronym: "Kürzel",
    description: "Beschreibung",
    rounds: "Runden",
    teams: "Teams",
    delete: "Löschen",
    groups: "Gruppen",
  };

  name = new FormControl(null, [V.required, V.minLength(3), V.maxLength(64)]);
  teamSize = new FormControl(null, [V.required, V.min(1), V.max(4)]);
  scrims = new FormControl(false);

  phaseName = new FormControl(null, [V.required, V.minLength(2), V.maxLength(32)]);
  phaseAcronym = new FormControl(null, [V.required, V.minLength(1), V.maxLength(16)]);
  phaseRounds = new FormControl(null, [V.required, V.min(1), V.max(16)]);
  phaseTeams = new FormControl(null, [V.required, V.min(2), V.max(128)]);
  phaseGroups = new FormControl(null, [V.required, V.min(1), V.max(20)]);

  infoForm = new FormGroup({
    name: this.name,
    teamSize: this.teamSize,
  });

  phaseForm = new FormGroup({
    name: this.phaseName,
    rounds: this.phaseRounds,
    acronym: this.phaseAcronym,
    teams: this.phaseTeams,
    groups: this.phaseGroups,
    scrims: this.scrims,
  });

  constructor(private readonly snackBar: MatSnackBar) {}

  get validPhaseForm(): boolean {
    return this.phaseForm.valid;
  }

  selectScrims(value: boolean) {
    if (value) {
      this.teamSize.setValue(1);
      this.phaseForm.disable();
      this.teamSize.disable();
    } else {
      this.teamSize.enable();
      this.phaseForm.enable();
    }
  }

  get isValidForm(): boolean {
    if (this.scrims.value) {
      return this.infoForm.valid;
    } else {
      return this.infoForm.valid && this.phases.length > 0;
    }
  }

  addPhase() {
    if (this.phaseForm.valid) {
      if (this.phases.find((p) => p.name.toLowerCase() === this.phaseName.value.toLowerCase())) {
        this.snackBar.open("Der Name wird bereits verwendet.", "OK", { duration: 3000 });
        return;
      }

      if (this.phases.find((p) => p.acronym.toLowerCase() === this.phaseAcronym.value.toLowerCase())) {
        this.snackBar.open("Das Kürzel wird bereits verwendet.", "OK", { duration: 3000 });
        return;
      }

      this.phases = [
        ...this.phases,
        {
          name: this.phaseName.value,
          rounds: this.phaseRounds.value,
          acronym: this.phaseAcronym.value,
          teams: this.phaseTeams.value,
          groups: this.phaseGroups.value,
        },
      ];

      this.phaseForm.reset();
    }
  }

  removePhase(code: string) {
    this.phases = this.phases.filter((r) => r.acronym.toLowerCase() !== code.toLowerCase());
  }

  getData() {
    let phases = this.phases;
    if (this.scrims.value) {
      phases = [{ name: "Scrims", acronym: "scrims", rounds: 1, teams: 512, groups: 1 }];
    }

    return {
      name: this.name.value,
      teamSize: this.teamSize.value,
      phases,
      scrims: this.scrims.value || false,
    };
  }
}
