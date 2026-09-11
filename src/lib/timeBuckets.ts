export type TimeBucket = {
  id: string;
  label: string;
  short: string;
  /** minutes from midnight, inclusive */
  from: number;
  /** minutes from midnight, exclusive */
  to: number;
};

export const TIME_BUCKETS: TimeBucket[] = [
  { id: "night", label: "12am – 6am", short: "12–6a", from: 0, to: 360 },
  { id: "morning", label: "6am – 12pm", short: "6a–12p", from: 360, to: 720 },
  { id: "afternoon", label: "12pm – 6pm", short: "12–6p", from: 720, to: 1080 },
  { id: "evening", label: "6pm – 12am", short: "6p–12a", from: 1080, to: 1440 },
];

export function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
