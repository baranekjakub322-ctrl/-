// Sprawdza, że uruchom_wszystko.sh propaguje błędy: wstrzyknięty test, który kończy się kodem 1, musi dać kod wyjścia != 0
// i komunikat NIEPOWODZENIE (nigdy "wszystkie ... zaliczone"). Używa tymczasowego katalogu wyników, żeby nie nadpisać prawdziwych.
import { spawnSync } from "node:child_process";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import { makeReporter, finish } from "./lib.mjs";
const rep = makeReporter("skrypt_bledy"); const { ok } = rep;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "v20-"));
const bad = path.join(tmp, "zly.mjs"); fs.writeFileSync(bad, "console.log('test celowo oblany'); process.exit(1);");
const r = spawnSync("bash", ["uruchom_wszystko.sh"], { cwd: root, env: { ...process.env, WYNIKI: path.join(tmp, "w"), EXTRA_TEST: bad, TESTS_ONLY_LIGHT: "1" }, encoding: "utf8", timeout: 900000 });
ok(r.status !== 0, "skrypt kończy się kodem != 0 przy oblanym teście", `status ${r.status}`);
ok(/NIEPOWODZENIE/.test(r.stdout) && !/wszystkie \d+ zestawy testów zaliczone/.test(r.stdout), "raport końcowy nie twierdzi sukcesu");
ok(/zly/.test(r.stdout), "oblany test jest wymieniony w podsumowaniu");
const r2 = spawnSync("bash", ["uruchom_wszystko.sh"], { cwd: root, env: { ...process.env, WYNIKI: path.join(tmp, "w2"), EXTRA_TEST: path.join(tmp, "nie_ma.mjs"), TESTS_ONLY_LIGHT: "1" }, encoding: "utf8", timeout: 900000 });
ok(r2.status !== 0 && /brak pliku/.test(r2.stderr + r2.stdout), "brakujący plik testu jest błędem, a nie pominięciem");
finish(rep);
