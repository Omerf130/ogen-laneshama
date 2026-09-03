import "server-only";

import { ensureDbConnection } from "@/lib/db/repositories/shared";
import { LeadModel } from "@/lib/db/models/lead.model";
import {
  countHomepageVisitors,
  countHomepageVisitorsLast7Days,
} from "@/lib/db/repositories/homepage-visitor.repository";
import type { LeadStatus } from "@/types/db/persistence";
import type {
  AdminDashboardData,
  DashboardLeadSummary,
  DashboardMetricUnavailable,
} from "@/types/admin-dashboard";

const ANALYTICS_UNAVAILABLE_HINT =
  "הנתונים נאספים החל מהפעלת המדידה.";

function unavailableAnalyticsMetric(): DashboardMetricUnavailable {
  return {
    kind: "unavailable",
    display: "—",
    hint: ANALYTICS_UNAVAILABLE_HINT,
  };
}

export async function getDashboardData(): Promise<AdminDashboardData> {
  await ensureDbConnection();

  const [totalLeads, newLeads, recentLeadDocs, homepageVisitors, homepageVisitorsLast7Days] =
    await Promise.all([
      LeadModel.countDocuments().exec(),
      LeadModel.countDocuments({ status: "NEW" }).exec(),
      LeadModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name phone email status createdAt")
        .lean()
        .exec(),
      countHomepageVisitors().catch(() => null),
      countHomepageVisitorsLast7Days().catch(() => null),
    ]);

  const recentLeads: DashboardLeadSummary[] = recentLeadDocs.map((lead) => ({
    id: lead._id.toString(),
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    status: lead.status as LeadStatus,
    createdAt: lead.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  return {
    totalLeads: { kind: "number", value: totalLeads },
    homepageVisitors:
      homepageVisitors === null
        ? unavailableAnalyticsMetric()
        : { kind: "number", value: homepageVisitors },
    homepageVisitorsLast7Days:
      homepageVisitorsLast7Days === null
        ? unavailableAnalyticsMetric()
        : { kind: "number", value: homepageVisitorsLast7Days },
    newLeads: { kind: "number", value: newLeads },
    recentLeads,
  };
}
