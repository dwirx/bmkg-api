export type Level = "provinsi" | "kotkab" | "kecamatan" | "desa" | "unknown";

export type Region = {
    code: string;
    name: string;
    level: Level;
};

export type ForecastEntry = {
    local_datetime?: string;
    utc_datetime?: string;
    weather_desc?: string;
    t?: number;
    hu?: number;
    ws?: number;
    vs_text?: string;
};

export type ForecastResponse = {
    lokasi: Record<string, unknown>;
    forecasts: ForecastEntry[];
};
