import { IPlayer } from "../types/player.interface";

export function playerNameString(players: IPlayer[]): string {
  return players.map((p) => p.name).join(", ") || "Keine Spieler";
}

export function ngCounter(index: number): Array<number> {
  return Array.from(Array(index).keys());
}

export function addDashesToUUID(uuid: string): string {
  return (
    uuid.substring(0, 8) +
    "-" +
    uuid.substring(8, 12) +
    "-" +
    uuid.substring(12, 16) +
    "-" +
    uuid.substring(16, 20) +
    "-" +
    uuid.substring(20)
  );
}
