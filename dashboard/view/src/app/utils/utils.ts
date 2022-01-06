import { IPlayer } from "../types/player.interface";

export function dynamicSort(property: string): any {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a: any, b: any) => {
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function playerNameString(players: IPlayer[]): string {
  return players.map((p) => p.name).join(", ") || "Keine Spieler";
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
