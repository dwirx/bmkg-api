import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import type { Level, Region } from "./types";

const BASE_CSV_URL = new URL("../base.csv", import.meta.url);
export const BASE_CSV_PATH = fileURLToPath(BASE_CSV_URL);

export function detectLevel(code: string): Level {
    const segments = code.split(".");
    switch (segments.length) {
        case 1:
            return "provinsi";
        case 2:
            return "kotkab";
        case 3:
            return "kecamatan";
        case 4:
            return "desa";
        default:
            return "unknown";
    }
}

export function loadRegions(filePath: string = BASE_CSV_PATH): Region[] {
    const resolved = filePath.startsWith("/")
        ? filePath
        : path.join(process.cwd(), filePath);
    const raw = readFileSync(resolved, "utf8");
    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [code, ...rest] = line.split(",");
            const name = rest.join(",").trim();
            const cleanCode = code.trim();
            return { code: cleanCode, name, level: detectLevel(cleanCode) };
        });
}
