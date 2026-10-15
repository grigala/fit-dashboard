import { Activity } from "../types";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "../lib/i18n";
import { enableChartWheelPageScroll } from "../lib/chartScroll";
import { formatDateShort, parseActivityMetadata, parseUtcDate } from "./Utils";

type Props = {
    activities: Activity[];
    theme: "light" | "dark";
}

export function OverviewActivityVo2Max({activities, theme}: Props) {
    const {t} = useTranslation();
    const activities_with_metadata = activities.filter(activity => activity.metadata_json !== null);
    const running = activities_with_metadata.filter(activity => activity.sport === "running");
    const cycling = activities_with_metadata.filter(activity => activity.sport === "cycling");

    const isDark = theme === "dark";
    const axisColor = isDark ? "#8899b8" : "#64748b";
    const gridLine = isDark ? "rgba(100, 140, 220, 0.08)" : "rgba(0, 0, 0, 0.06)";

    const tooltipBg = isDark ? "rgba(14, 22, 45, 0.95)" : "rgba(255, 255, 255, 0.95)";
    const tooltipBorder = isDark ? "rgba(100, 140, 220, 0.2)" : "rgba(0, 0, 0, 0.08)";
    const tooltipText = isDark ? "#e2e8f4" : "#0f172a";

    const tooltipStyle = {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        textStyle: {color: tooltipText, fontSize: 12},
    };

    const runningData = running.map((a) => [parseUtcDate(a.start_ts_utc).getTime(), parseActivityMetadata(a.metadata_json)?.activity_metrics?.vo2_max ?? 0]);
    const cyclingData = cycling.map((a) => [parseUtcDate(a.start_ts_utc).getTime(), parseActivityMetadata(a.metadata_json)?.activity_metrics?.vo2_max ?? 0]);

    const vo2Option = {
        tooltip: {
            trigger: "axis",
            ...tooltipStyle,
            formatter: (params: any[]) => {
                const p = params?.[0];
                const dateMs = Number(p?.value?.[0] ?? 0);
                const dateStr = dateMs ? formatDateShort(new Date(dateMs).toISOString()) : "";
                let html = `<div style="margin-bottom:4px;"><strong>${dateStr}</strong></div>`;
                for (const row of params) {
                    if (row.value?.[1] !== null && row.value?.[1] !== undefined && row.value?.[1] !== 0) {
                        html += `<div>${row.marker} ${row.seriesName}: <strong>${Number(row.value[1]).toFixed(2)} ${t("insights.vo2")}</strong></div>`;
                    }
                }
                return html;
            },
        },
        legend: {textStyle: {color: axisColor, fontSize: 12}, top: 0},
        grid: {left: 50, right: 16, top: 42, bottom: 46},
        xAxis: {
            type: "time",
            axisLabel: {color: axisColor, fontSize: 11},
            axisLine: {lineStyle: {color: gridLine}},
            splitLine: {show: false},
        },
        yAxis: {
            type: "value",
            name: t("insights.vo2"),
            scale: true,
            nameTextStyle: {color: axisColor, fontSize: 11},
            axisLabel: {color: axisColor, fontSize: 11},
            splitLine: {lineStyle: {color: gridLine}},
        },
        series: [
            {
                name: t("insights.runningVo2"),
                type: "line",
                smooth: false,
                showSymbol: true,
                lineStyle: {width: 2, color: "#38bdf8"},
                areaStyle: {color: isDark ? "rgba(56, 189, 248, 0.1)" : "rgba(56, 189, 248, 0.15)"},
                data: runningData.filter(([, v]) => v !== 0),
            },
            {
                name: t("insights.cyclingVo2"),
                type: "line",
                smooth: false,
                showSymbol: true,
                lineStyle: {width: 2, color: "#f97316"},
                areaStyle: {color: isDark ? "rgba(249, 115, 22, 0.1)" : "rgba(249, 115, 22, 0.15)"},
                data: cyclingData.filter(([, v]) => v !== 0),
            },
        ],
    };

    return (
        <div className="panel overview-weekly-trend-panel">
            <h3>{t("trend.vo2max")}</h3>
            <div className="overview-weekly-trend-chart">
                <ReactECharts option={vo2Option} onChartReady={enableChartWheelPageScroll} notMerge style={{height: 280, width: "100%"}}/>
            </div>
        </div>
    );
}