import type { LeadStatus } from "@/types/db/persistence";

export type DashboardMetricNumber = {
  kind: "number";
  value: number;
};

export type DashboardMetricUnavailable = {
  kind: "unavailable";
  display: "—";
  hint?: string;
};

export type DashboardMetricValue =
  | DashboardMetricNumber
  | DashboardMetricUnavailable;

export type DashboardLeadSummary = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
};

export type AdminDashboardData = {
  totalLeads: DashboardMetricNumber;
  homepageVisitors: DashboardMetricValue;
  homepageVisitorsThisWeek: DashboardMetricValue;
  newLeads: DashboardMetricNumber;
  recentLeads: DashboardLeadSummary[];
};
