import { isToday, isYesterday, differenceInDays } from "date-fns";
import type { Notifica, TimeGroup } from "./types";

const GROUP_ORDER: TimeGroup[] = ["Oggi", "Ieri", "Questa settimana", "Precedenti"];

function getTimeGroup(date: Date): TimeGroup {
  if (isToday(date)) return "Oggi";
  if (isYesterday(date)) return "Ieri";
  if (differenceInDays(new Date(), date) <= 7) return "Questa settimana";
  return "Precedenti";
}

export function groupNotificationsByTime(
  notifications: Notifica[],
): [TimeGroup, Notifica[]][] {
  const groups = new Map<TimeGroup, Notifica[]>();

  for (const n of notifications) {
    const group = getTimeGroup(n.timestamp);
    const list = groups.get(group);
    if (list) {
      list.push(n);
    } else {
      groups.set(group, [n]);
    }
  }

  return GROUP_ORDER
    .filter((g) => groups.has(g))
    .map((g) => [g, groups.get(g)!]);
}
