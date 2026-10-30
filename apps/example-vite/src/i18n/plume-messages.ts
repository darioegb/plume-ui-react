import type { TFunction } from "i18next";
import type { PlumeMessages } from "plume-ui-react";

export function plumeMessages(t: TFunction): PlumeMessages {
  return {
    alert: { dismiss: t("plume.alert.dismiss") },
    avatar: {
      away: t("plume.avatar.away"),
      busy: t("plume.avatar.busy"),
      offline: t("plume.avatar.offline"),
      online: t("plume.avatar.online"),
    },
    avatarGroup: {
      overflow: (hidden) => t("plume.avatarGroup.overflow", { hidden }),
    },
    breadcrumb: { breadcrumb: t("plume.breadcrumb.breadcrumb") },
    button: { busy: t("plume.button.busy") },
    datePicker: {
      apply: t("plume.datePicker.apply"),
      calendar: t("plume.datePicker.calendar"),
      cancel: t("plume.datePicker.cancel"),
      format: (format) => t("plume.datePicker.format", { format }),
      nextMonth: t("plume.datePicker.nextMonth"),
      nextYears: t("plume.datePicker.nextYears"),
      openCalendar: t("plume.datePicker.openCalendar"),
      previousMonth: t("plume.datePicker.previousMonth"),
      previousYears: t("plume.datePicker.previousYears"),
    },
    input: { reveal: t("plume.input.reveal") },
    navbarToggle: { label: t("plume.navbarToggle.label") },
    overlayClose: { label: t("plume.overlayClose.label") },
    paginator: {
      first: t("plume.paginator.first"),
      last: t("plume.paginator.last"),
      next: t("plume.paginator.next"),
      page: (page, current) =>
        t(current ? "plume.paginator.pageCurrent" : "plume.paginator.page", {
          page,
        }),
      pageSize: t("plume.paginator.pageSize"),
      pagination: t("plume.paginator.pagination"),
      previous: t("plume.paginator.previous"),
      summary: (from, to, total) =>
        t("plume.paginator.summary", { from, to, total }),
    },
    select: {
      clear: t("plume.select.clear"),
      empty: t("plume.select.empty"),
      overflow: (hidden) => t("plume.select.overflow", { hidden }),
      remove: (label) => t("plume.select.remove", { label }),
      search: t("plume.select.search"),
    },
    sidebarToggle: { label: t("plume.sidebarToggle.label") },
    table: { loading: t("plume.table.loading") },
    textarea: {
      count: (current, max) =>
        max === undefined
          ? t("plume.textarea.count", { current })
          : t("plume.textarea.countMax", { current, max }),
      remaining: (remaining) =>
        t("plume.textarea.remaining", { count: remaining }),
    },
    toast: {
      dismiss: t("plume.toast.dismiss"),
      region: t("plume.toast.region"),
    },
  };
}
