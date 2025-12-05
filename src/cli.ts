#!/usr/bin/env node
import { BASE_CSV_PATH, loadRegions } from "./data";
import { fetchForecast, printForecast } from "./forecast";
import { malangSnapshot } from "./malang";
import { printRegions, searchRegions } from "./search";

const DEFAULT_QUERY = "malang";

async function main() {
    const args = process.argv.slice(2);
    const regions = loadRegions(BASE_CSV_PATH);
    const index = new Map(regions.map((r) => [r.code, r]));

    const cmd = args[0];

    if (cmd === "search") {
        const query = args[1] ?? DEFAULT_QUERY;
        const limitArg = args.find((v) => v.startsWith("--limit="));
        const limit = limitArg ? Number(limitArg.split("=")[1]) : 25;
        console.log(`Hasil pencarian untuk "${query}" (maks ${limit}):`);
        const matches = searchRegions(regions, query, limit);
        printRegions(matches, index);
        return;
    }

    if (cmd === "fetch") {
        const adm4 = args[1];
        if (!adm4) {
            console.error("Gunakan: bmkg fetch <adm4>");
            process.exit(1);
        }
        console.log(`Mengambil prakiraan BMKG untuk ${adm4}...`);
        const { lokasi, forecasts } = await fetchForecast(adm4);
        console.log(
            `${lokasi?.desa ?? "-"}, ${lokasi?.kecamatan ?? "-"}, ${lokasi?.kotkab ?? "-"}, ${lokasi?.provinsi ?? "-"}`,
        );
        printForecast(adm4, forecasts);
        console.log("Sumber data: BMKG (api.bmkg.go.id)");
        return;
    }

    if (cmd === "malang") {
        malangSnapshot(regions, index);
        return;
    }

    console.log(
        `Tidak ada perintah, menampilkan fokus Malang dan pencarian default "${DEFAULT_QUERY}".`,
    );
    malangSnapshot(regions, index);
    console.log("\nPencarian cepat:");
    const matches = searchRegions(regions, DEFAULT_QUERY, 40);
    printRegions(matches, index);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
