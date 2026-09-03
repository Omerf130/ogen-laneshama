"use client";

import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { LeadStatusBadge } from "@/components/admin/dashboard/LeadStatusBadge/LeadStatusBadge";
import { formatDashboardDate } from "@/lib/admin/dashboard/format-dashboard-date";
import { LEAD_STATUS_LABELS } from "@/lib/admin/dashboard/lead-status";
import type { AdminLead } from "@/types/admin-lead";
import type { LeadStatus } from "@/types/db/persistence";
import styles from "./LeadsListManager.module.scss";

type LeadsListManagerProps = {
  initialLeads: AdminLead[];
};

type StatusFilter = "ALL" | LeadStatus;

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "CLOSED",
  "ARCHIVED",
];

function getStatusFilterLabel(filter: StatusFilter): string {
  if (filter === "ALL") {
    return "הכל";
  }

  return LEAD_STATUS_LABELS[filter];
}

export function LeadsListManager({ initialLeads }: LeadsListManagerProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialLeads.filter((lead) => {
      if (statusFilter === "ALL") {
        if (lead.status === "ARCHIVED") {
          return false;
        }
      } else if (lead.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        lead.name.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    });
  }, [initialLeads, search, statusFilter]);

  return (
    <div className={styles.manager}>
      <div className={styles.toolbar}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="סינון לפי סטטוס"
        >
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={statusFilter === filter}
              className={
                statusFilter === filter ? styles.tabActive : styles.tab
              }
              onClick={() => setStatusFilter(filter)}
            >
              {getStatusFilterLabel(filter)}
            </button>
          ))}
        </div>

        <label className={styles.searchWrap}>
          <Search size={16} aria-hidden="true" className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש לפי שם, טלפון או אימייל"
            aria-label="חיפוש פניות"
          />
        </label>
      </div>

      <p className={styles.count}>{filteredLeads.length} פניות</p>

      {filteredLeads.length === 0 ? (
        <p className={styles.empty}>לא נמצאו פניות התואמות את הסינון.</p>
      ) : (
        <>
          <div className={styles.desktopOnly}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">שם</th>
                    <th scope="col">טלפון</th>
                    <th scope="col">אימייל</th>
                    <th scope="col">תאריך</th>
                    <th scope="col">סטטוס</th>
                    <th scope="col">
                      <span className={styles.srOnly}>פעולה</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className={styles.nameCell}>{lead.name}</td>
                      <td>{lead.phone}</td>
                      <td className={styles.emailCell}>{lead.email}</td>
                      <td>{formatDashboardDate(lead.createdAt)}</td>
                      <td>
                        <LeadStatusBadge status={lead.status} />
                      </td>
                      <td className={styles.actionCell}>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className={styles.actionLink}
                          aria-label={`צפייה בפנייה של ${lead.name}`}
                        >
                          <Eye size={16} aria-hidden="true" />
                          צפייה
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ul className={`${styles.mobileOnly} ${styles.cardList}`}>
            {filteredLeads.map((lead) => (
              <li key={lead.id} className={styles.card}>
                <div className={styles.cardMain}>
                  <p className={styles.cardName}>{lead.name}</p>
                  <p className={styles.cardMeta}>{lead.phone}</p>
                  <p className={styles.cardMeta}>{lead.email}</p>
                  <p className={styles.cardMeta}>
                    {formatDashboardDate(lead.createdAt)}
                  </p>
                </div>
                <div className={styles.cardFooter}>
                  <LeadStatusBadge status={lead.status} />
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className={styles.actionLink}
                    aria-label={`צפייה בפנייה של ${lead.name}`}
                  >
                    <Eye size={16} aria-hidden="true" />
                    צפייה
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
