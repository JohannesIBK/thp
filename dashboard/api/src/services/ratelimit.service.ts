import { Injectable } from "@nestjs/common";

@Injectable()
export class RatelimitService {
  points = 1;

  consumePoint(): boolean {
    setInterval(() => {
      this.points = Math.min(this.points++, 1);
    }, 300_000);

    if (this.points >= 1) {
      this.points--;
      return true;
    }

    return false;
  }
}
