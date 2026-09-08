import data from "@/content/stats.json";

export type Stat = { value: number; suffix?: string; label: string };

export const stats: Stat[] = data.stats;
