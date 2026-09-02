const dashboardDateFormatter = new Intl.DateTimeFormat("he-IL", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatDashboardDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;

  return dashboardDateFormatter.format(date);
}
