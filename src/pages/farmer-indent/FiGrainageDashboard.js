import { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Icon } from "../../components";
import { useFiStore, fiActions, grainageFarmers, todayIso, unitName } from "./fiData";
import { FiPage, FI_BASE, Tile } from "./fiUi";

const UNIT_COLORS = ["#1e67a8", "#0f766e", "#6d28d9", "#0369a1", "#b45309", "#15803d", "#3b8dd6"];

// Tiles as in the reference portal dashboard; every tile opens the matching list.
function FiGrainageDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const s = useFiStore();
  const farmers = useMemo(() => grainageFarmers(s), [s]);
  const active = s.indents.filter((i) => !i.cancelled);
  const month = format(new Date(), "yyyy-MM");
  const sumDfls = (list) => list.reduce((n, i) => n + i.dflsOrdered, 0);

  const today = active.filter((i) => i.indentDate === todayIso());
  const thisMonth = active.filter((i) => i.indentDate.startsWith(month));
  const notAssigned = active.filter((i) => i.status !== "assigned");
  const units = [...new Set(active.map((i) => i.unitId))];
  const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
  const go = (path, params) => navigate(`${FI_BASE}/${path}${params ? `?${new URLSearchParams(params)}` : ""}`);

  return (
    <FiPage
      title={t("Grainage Dashboard")}
      subtitle={t("Indents and DFLs of your grainage at a glance")}
      actions={<>
        <Button className="fi-btn fi-btn-white" onClick={() => fiActions.reload()}><Icon name="reload" /> {t("Refresh")}</Button>
        <Button className="fi-btn fi-btn-white" onClick={() => go("indents")}><Icon name="plus" /> {t("Add Indent")}</Button>
      </>}
    >
      <div className="fi-tiles">
        <Tile icon="users" label={t("Total Farmers")} value={fmt(farmers.length)} onClick={() => go("farmer-list")} />
        <Tile icon="inbox" label={t("Today's Indents")} value={fmt(sumDfls(today))} sub={`${today.length} ${t("indents")}`} color="#0369a1" onClick={() => go("indents", { period: "today", tab: "all" })} />
        <Tile icon="mail" label={t("Month's Indents")} value={fmt(sumDfls(thisMonth))} sub={`${thisMonth.length} ${t("indents")}`} color="#6d28d9" onClick={() => go("indents", { period: "month", tab: "all" })} />
        <Tile icon="arrow-right" label={t("All Time Indents")} value={fmt(sumDfls(active))} sub={`${active.length} ${t("indents")}`} color="#0d4f8a" onClick={() => go("indents", { tab: "all" })} />

        {units.map((u, i) => {
          const list = active.filter((x) => x.unitId === u);
          return <Tile key={u} icon={u.startsWith("DIRECT") ? "arrow-right" : "inbox"} color={UNIT_COLORS[i % UNIT_COLORS.length]}
            label={`${t("Indents")} ${unitName(list[0])}`} value={fmt(sumDfls(list))} sub={`${list.length} ${t("indents")}`}
            onClick={() => go("indents", { unit: u, tab: "all" })} />;
        })}

        <Tile icon="arrow-right" label={t("Assigned DFLs")} value={fmt(s.totals.dfls)} sub={`${fmt(s.totals.sales)} ${t("issues")}`} color="#0f766e" onClick={() => go("assigned-dfls")} />
        <Tile icon="arrow-right" label={t("Not Assigned DFLs")} value={fmt(sumDfls(notAssigned))} sub={`${notAssigned.length} ${t("indents")}`} color="#b45309" onClick={() => go("indents", { tab: "open" })} />
        <Tile icon="inbox" label={`${t("Grainage")} (${s.grainage?.name || "–"})`} value={fmt(sumDfls(active))} sub={`${active.length} ${t("indents")}`} color="#1e67a8" onClick={() => go("indents", { tab: "all" })} />

        {units.filter((u) => thisMonth.some((x) => x.unitId === u)).map((u, i) => {
          const list = thisMonth.filter((x) => x.unitId === u);
          return <Tile key={`m-${u}`} icon="arrow-right" color={UNIT_COLORS[(i + 3) % UNIT_COLORS.length]}
            label={`${t("Month Indents")} ${unitName(list[0])}`} value={fmt(sumDfls(list))} sub={`${list.length} ${t("indents")}`}
            onClick={() => go("indents", { unit: u, period: "month", tab: "all" })} />;
        })}
      </div>
    </FiPage>
  );
}

export default FiGrainageDashboard;
