import type { ActivityMetadata } from "../types";


export function parseActivityMetadata(raw?: string): ActivityMetadata | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as ActivityMetadata;
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        return null;
    }
}

export function formatDateShort(input: string): string {
    const date = parseUtcDate(input);
    if (Number.isNaN(date.getTime())) return input;
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).replace(/^(\d{2}\s+[A-Za-z]{3})\s+(\d{4})$/, "$1, $2");
}

export function parseUtcDate(input: string): Date {
    const trimmed = input.trim();
    const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
    const hasZone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(normalized);
    return new Date(hasZone ? normalized : `${normalized}Z`);
}


// Format MM:SS or HH:MM:SS
export function formatRelTime(ms: number): string {
    const totalSec = Math.floor(Math.max(0, ms) / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatAbsTime(baseTimestampMs: number, relMs: number): string {
    const absolute = new Date(baseTimestampMs + Math.max(0, relMs));
    const hh = String(absolute.getHours()).padStart(2, "0");
    const mm = String(absolute.getMinutes()).padStart(2, "0");
    const ss = String(absolute.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}

export function calculateLapMarkers(lapTimestampsUtc: string[], t0: number) {
    return lapTimestampsUtc
        .slice(1)
        .map((ts, idx) => {
            const parsed = Date.parse(ts);
            if (!Number.isFinite(parsed)) return null;
            const relMs = parsed - t0;
            if (relMs < 0) return null;
            return {xAxis: relMs, name: `Lap ${idx + 1}`};
        })
        .filter((m): m is { xAxis: number; name: string } => m !== null);
}