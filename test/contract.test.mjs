/**
 * Contract test: every request this SDK can make must exist in the API's OpenAPI document.
 *
 * WHY. The two ways an SDK silently lies are a path typo and a parameter-name typo. Neither
 * fails loudly: a wrong path is a 404 only at runtime, and a wrong parameter name is worse —
 * FastAPI ignores unknown query parameters, so `odds_format=american` returns a cheerful 200
 * full of decimal odds. No unit test with a stubbed fetch can catch that, because the stub
 * happily accepts whatever the client sends.
 *
 * So this suite drives every client method through a recording fetch, then checks the URL it
 * produced against the schema: the path template must exist, and every query parameter must be
 * one the server declares for that operation.
 *
 * It runs offline against the checked-in openapi.json when one is present, and fetches the live
 * document otherwise. A failure here means the SDK and the API have drifted — fix the SDK, or
 * regenerate types if the API moved on purpose.
 */
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

import { PuntersEdge } from "../dist/esm/index.js";

const SPEC_URL = "https://api.puntersedge.online/openapi.json";
const LOCAL_SPEC = new URL("../openapi.json", import.meta.url);

let spec;

before(async () => {
  if (existsSync(LOCAL_SPEC)) {
    spec = JSON.parse(readFileSync(LOCAL_SPEC, "utf8"));
  } else {
    const res = await fetch(SPEC_URL);
    spec = await res.json();
  }
});

/** Match a concrete path against the spec's templates: /v1/sports/afl/odds -> /v1/sports/{sport_key}/odds */
function matchPath(pathname) {
  if (spec.paths[pathname]) return pathname;
  const parts = pathname.split("/");
  for (const template of Object.keys(spec.paths)) {
    const tparts = template.split("/");
    if (tparts.length !== parts.length) continue;
    const ok = tparts.every((t, i) => (t.startsWith("{") && t.endsWith("}")) || t === parts[i]);
    if (ok) return template;
  }
  return null;
}

function declaredParams(template, method) {
  const op = spec.paths[template]?.[method.toLowerCase()];
  if (!op) return null;
  return new Set((op.parameters ?? []).filter((p) => p.in === "query").map((p) => p.name));
}

/**
 * Every client method, called with every option it accepts.
 *
 * The options are deliberately exhaustive rather than realistic: the point is to make the client
 * emit every parameter name it is capable of emitting, so a mis-mapped one is caught.
 */
function calls(pe) {
  const racingFilters = { categories: ["horse", "harness"], country: ["AU", "NZ"], includeUnresolved: true };
  const archive = {
    from: "2026-08-01", to: "2026-09-01", venue: "Randwick", bookmakers: ["tab"],
    category: "horse", country: "AU", raceId: "r1", includeFlagged: true, limit: 10, offset: 0,
  };
  return [
    // racing
    ["racing.nextToGo", () => pe.racing.nextToGo({ ...racingFilters, numRaces: 5, bookmakers: ["tab", "sportsbet"], venue: ["Randwick"] })],
    ["racing.events", () => pe.racing.events({ ...racingFilters, hoursAhead: 6 })],
    ["racing.bestOdds", () => pe.racing.bestOdds({ ...racingFilters, numRaces: 5, bookmakers: "tab" })],
    ["racing.movers", () => pe.racing.movers({ ...racingFilters, direction: "firming", minMovePct: 5, minBooks: 3, maxMinsToJump: 30, limit: 20 })],
    ["racing.results", () => pe.racing.results({ hoursBack: 24, date: "2026-09-01", categories: "horse", venue: "Rosehill", country: "AU", status: "final", limit: 10, offset: 0 })],
    ["racing.resultsCoverage", () => pe.racing.resultsCoverage({ days: 7 })],
    ["racing.priceHistory", () => pe.racing.priceHistory({ raceId: "r1", venue: "Randwick", raceNumber: 3, date: "2026-09-01", bookmakers: ["tab"], includePoints: true, maxPoints: 500 })],
    ["racing.changes", () => pe.racing.changes({ since: "2026-09-01T00:00:00Z", ...racingFilters })],
    ["racing.closingLines", () => pe.racing.closingLines({ ...archive, date: undefined, closingOnly: true, resultedOnly: true })],
    ["racing.closingLinesCoverage", () => pe.racing.closingLinesCoverage()],
    ["racing.pricePaths", () => pe.racing.pricePaths({ ...archive, date: undefined })],
    ["racing.venues", () => pe.racing.venues()],
    ["racing.acceptances", () => pe.racing.acceptances({ date: "2026-09-01", venue: "Moe" })],
    ["racing.trackConditions", () => pe.racing.trackConditions({ date: "2026-09-01", venue: "Belmont" })],
    ["racing.jockeyStats", () => pe.racing.jockeyStats({ name: "Bowman", state: "NSW", scope: "metro", season: "current" })],
    ["racing.trainerStats", () => pe.racing.trainerStats({ name: "Waller", state: "AUS", scope: "all", season: "previous" })],
    ["racing.closingLinesCsv", () => pe.racing.closingLinesCsv({ date: "2026-09-01" })],
    ["racing.pricePathsCsv", () => pe.racing.pricePathsCsv({ date: "2026-09-01" })],
    ["racing.clv", () => pe.racing.clv({ bets: [{ race_id: "r1", runner_ref: "ra:x", price: 3.5, stake: 10 }], reference: "best" })],
    ["racing.markets", () => pe.racing.markets({ raceId: "r1", venue: "Randwick", meetingDate: "2026-09-01", raceNumber: 3, country: "AU", bookmakers: ["tab"], markets: ["win", "top4"] })],
    ["racing.consensus", () => pe.racing.consensus({ raceId: "r1", venue: "Randwick", meetingDate: "2026-09-01", raceNumber: 3, country: "AU", method: "power", bookmakers: ["tab"], minBooks: 2, includeStale: false })],
    ["racing.intelligence", () => pe.racing.intelligence({ raceId: "r1", venue: "Randwick", meetingDate: "2026-09-01", raceNumber: 3, country: "AU", minBooks: 2 })],
    ["racing.intelligenceScan", () => pe.racing.intelligenceScan({ window: "60m", minMovePct: 10, minBooks: 3, direction: "firming", signalClass: "steam", country: "AU", categories: ["horse"], limit: 20 })],
    ["racing.marketSummary", () => pe.racing.marketSummary({ from: "2026-08-01", to: "2026-09-01", venue: "Randwick", category: "horse", categories: ["horse"], country: "AU", raceId: "r1", signalClass: "firm", limit: 10, offset: 0 })],
    ["racing.form", () => pe.racing.form({ raceId: "r1", venue: "Randwick", meetingDate: "2026-09-01", raceNumber: 3, runs: 5 })],
    ["racing.tote", () => pe.racing.tote({ date: "2026-10-27", country: ["US", "CA"], status: "open", raceId: "r1", sourceRaceId: "tvg_SAR_2026-10-27_7", history: true })],
    // racing / form
    ["racing.horses.form", () => pe.racing.horses.form("Winx")],
    ["racing.horses.runs", () => pe.racing.horses.runs("Winx", { limit: 20 })],
    ["racing.horses.submitBackfill", () => pe.racing.horses.submitBackfill({ horses: ["Winx"] })],
    ["racing.horses.cancelBackfill", () => pe.racing.horses.cancelBackfill("job1")],
    ["racing.horses.backfillStatus", () => pe.racing.horses.backfillStatus("job1")],
    ["racing.horses.backfillResults", () => pe.racing.horses.backfillResults("job1", { limit: 50, offset: 0 })],
    ["racing.greyhounds.form", () => pe.racing.greyhounds.form("Fernando Bale", { limit: 20 })],
    ["racing.greyhounds.stats", () => pe.racing.greyhounds.stats("Fernando Bale", { by: ["track", "box"] })],
    ["racing.greyhounds.field", () => pe.racing.greyhounds.field({ raceId: "r1", venue: "Sandown Park", meetingDate: "2026-09-01", raceNumber: 3, runs: 5 })],
    // sports
    ["sports.list", () => pe.sports.list()],
    ["sports.odds", () => pe.sports.odds("afl", { markets: ["h2h", "totals"], bookmakers: ["tab"], competition: "NRLW", includeUnknownCompetition: true, oddsFormat: "decimal", maxAgeMinutes: 60 })],
    ["sports.bestOdds", () => pe.sports.bestOdds("afl")],
    ["sports.oddsHistory", () => pe.sports.oddsHistory("afl", { from: "2026-08-01", to: "2026-09-01", bookmakers: ["tab"], market: "h2h", offset: 0 })],
    ["sports.oddsMovements", () => pe.sports.oddsMovements("afl", { since: "2026-09-01T00:00:00Z", bookmakers: ["tab"], market: "h2h", minDelta: 0.1 })],
    ["sports.results", () => pe.sports.results("afl", { season: 2026, competition: "AFLW", finalOnly: true, linkedOnly: true, limit: 20 })],
    ["sports.closingLines", () => pe.sports.closingLines("nrl", { from: "2026-08-01", to: "2026-09-01", bookmakers: ["tab"] })],
    // arb
    ["arb.sports", () => pe.arb.sports({ sportKey: "afl", maxAgeMinutes: 60, minProfitPct: 1 })],
    ["arb.lines", () => pe.arb.lines({ sportKey: "afl", maxAgeMinutes: 60, minProfitPct: 1 })],
    ["arb.bestPrices", () => pe.arb.bestPrices({ sportKey: "afl", maxAgeMinutes: 60 })],
    // account
    ["account.usage", () => pe.account.usage()],
    ["account.usageAnalytics", () => pe.account.usageAnalytics({ days: 30, period: "billing" })],
    ["account.keyInfo", () => pe.account.keyInfo()],
    ["account.billingPortal", () => pe.account.billingPortal()],
    ["account.rotateKey", () => pe.account.rotateKey({ immediate: true })],
    ["account.setIpWhitelist", () => pe.account.setIpWhitelist(["1.2.3.4"])],
    ["account.overage", () => pe.account.overage()],
    ["account.setOverage", () => pe.account.setOverage(true)],
    ["account.teamKeys", () => pe.account.teamKeys()],
    ["account.mintTeamKey", () => pe.account.mintTeamKey({ label: "worker", monthly_cap: 5000 })],
    ["account.updateTeamKey", () => pe.account.updateTeamKey("k1", { label: "Jo's laptop" })],
    ["account.revokeTeamKey", () => pe.account.revokeTeamKey("k1")],
    ["account.referral", () => pe.account.referral()],
    ["account.setReferralPayout", () => pe.account.setReferralPayout({ reward_type: "credits" })],
    // bulk
    ["bulk.datasets", () => pe.bulk.datasets({ dataset: "closing_lines" })],
    ["bulk.restatements", () => pe.bulk.restatements({ since: "2026-10-01", dataset: "closing_lines", limit: 10 })],
    ["bulk.download", () => pe.bulk.download("closing_lines", "2026-09-01", { format: "csv", ifNoneMatch: '"abc"' })],
    // webhooks
    ["webhooks.create", () => pe.webhooks.create({ url: "https://example.com/hook", events: ["race.odds_open"] })],
    ["webhooks.list", () => pe.webhooks.list()],
    ["webhooks.delete", () => pe.webhooks.delete("wh1")],
    ["webhooks.deliveries", () => pe.webhooks.deliveries("wh1")],
    ["webhooks.test", () => pe.webhooks.test("wh1")],
    ["webhooks.replay", () => pe.webhooks.replay("wh1", { since: "2026-10-27T00:00:00Z", status: "failed" })],
    ["webhooks.resume", () => pe.webhooks.resume("wh1")],
    ["webhooks.rotateSecret", () => pe.webhooks.rotateSecret("wh1")],
    // health + sandbox
    ["health.connectors", () => pe.health.connectors()],
    ["health.connectorDetail", () => pe.health.connectorDetail({ staleAfterS: 300, coverageStaleAfterS: 21600, includeSports: true })],
    ["health.uptime", () => pe.health.uptime()],
    ["demo.nextToGo", () => pe.demo.nextToGo()],
    ["demo.bestOdds", () => pe.demo.bestOdds({ sport: "afl" })],
  ];
}

test("every SDK call maps to a real operation with real parameter names", async () => {
  const seen = [];
  const pe = new PuntersEdge({
    apiKey: "pe_contract_test",
    fetch: async (url, init) => {
      seen.push({ url: new URL(url), method: init.method });
      return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
    },
  });

  const failures = [];

  for (const [name, invoke] of calls(pe)) {
    seen.length = 0;
    await invoke();
    assert.equal(seen.length, 1, `${name} made ${seen.length} requests, expected 1`);
    const { url, method } = seen[0];

    const template = matchPath(url.pathname);
    if (!template) {
      failures.push(`${name}: no operation for ${method} ${url.pathname}`);
      continue;
    }

    const declared = declaredParams(template, method);
    if (declared === null) {
      failures.push(`${name}: ${template} has no ${method} operation`);
      continue;
    }

    for (const param of url.searchParams.keys()) {
      if (!declared.has(param)) {
        failures.push(
          `${name}: sends "${param}", which ${method} ${template} does not declare ` +
          `(it declares: ${[...declared].sort().join(", ") || "nothing"})`,
        );
      }
    }
  }

  assert.deepEqual(failures, [], "\n  " + failures.join("\n  ") + "\n");
});

test("the SDK covers the read surface a customer is sold", async () => {
  // Endpoints deliberately left off the client. Price ingestion is for our own scrapers, key
  // creation is admin-only, `keys/resend` and `signup` belong to the website's email and
  // checkout flows, `data-quality/*` is an internal audit surface, and `demo/book-sport` exists
  // to differentiate SEO pages rather than to be programmed against. If one of these ever
  // becomes a customer feature, add it here AND to the client, so the omission stays a decision
  // rather than an oversight.
  const DELIBERATE_OMISSIONS = new Set([
    "/v1/ingest/{bookmaker_key}",
    "/v1/ingest/sports/{bookmaker_key}",
    "/v1/keys",
    "/v1/keys/resend",
    "/v1/signup",
    "/v1/data-quality/audit/run",
    "/v1/data-quality/audit/latest",
    "/v1/data-quality/audit/{run_id}/results",
    "/v1/data-quality/summary",
    "/v1/demo/book-sport",
    // The key console's sign-in flow (`login/*`, `logout`, `keys/reveal`) belongs to the
    // website: it authenticates a browser session by email, not a key, and nothing
    // programmatic needs it.
    "/v1/login/request",
    "/v1/login/exchange",
    "/v1/logout",
    "/v1/keys/reveal",
    // The account console (2026-10): sign-in by password, onboarding, insights, marketing
    // preferences, sample files, the upgrade link, link templates and embeddable widgets are the
    // website's own surfaces, driven by a browser session, not by an API key in a program.
    "/v1/account",
    "/v1/account/events",
    "/v1/account/insights",
    "/v1/account/marketing",
    "/v1/account/onboarding",
    "/v1/account/password",
    "/v1/account/samples/{kind}",
    "/v1/billing/upgrade-link",
    "/v1/link-templates",
    "/v1/login",
    "/v1/logout/all",
    "/v1/password/forgot",
    "/v1/password/reset",
    "/v1/widgets",
    "/v1/widgets/{widget_id}",
  ]);

  const reached = [];
  const pe = new PuntersEdge({
    apiKey: "pe_contract_test",
    fetch: async (url) => {
      reached.push(new URL(url).pathname);
      return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
    },
  });
  for (const [, invoke] of calls(pe)) await invoke();

  const covered = new Set();
  for (const p of reached) {
    const t = matchPath(p);
    if (t) covered.add(t);
  }

  const missing = Object.keys(spec.paths)
    .filter((p) => !covered.has(p) && !DELIBERATE_OMISSIONS.has(p))
    .sort();

  assert.deepEqual(missing, [], `endpoints with no SDK method:\n  ${missing.join("\n  ")}`);
});

/**
 * The credit cost a method's doc comment claims must match what the API charges.
 *
 * WHY THIS TEST EXISTS. Getting this wrong is invisible and always harmful in the same
 * direction: a reader budgets from the doc comment, and an understated figure means they run
 * out earlier than they planned. It shipped once already — `closingLinesCsv` and
 * `pricePathsCsv` said "same 5 credits" when CSV is billed at 20. The spec had said
 * "Cost: 5 credits (JSON) / 20 credits (CSV)" all along; a regex that grabbed the first
 * number found only half of it.
 *
 * So the claim is checked against the OPERATION'S OWN description, and the two archive
 * endpoints are checked against the right half of it.
 */
test("every stated credit cost matches what the API charges", async () => {
  const source = readFileSync(new URL("../src/client.ts", import.meta.url), "utf8");

  /** "Class.method" -> the credits figure its doc comment claims, where it states one. Keyed by
   *  the enclosing class as well as the method, because two classes may share a method name
   *  with different costs (racing.results is 2 credits, sports.results is 1). */
  const claimed = new Map();
  // A class declaration, or a doc comment followed by a method signature. Non-greedy so each
  // comment binds to the method immediately after it.
  const re = /^\s*(?:export\s+)?class\s+([A-Za-z]+)|\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*\n\s*(?:readonly\s+)?([a-zA-Z]+)\s*\(/gm;
  let cls = "";
  for (const [, klass, comment, method] of source.matchAll(re)) {
    if (klass) { cls = klass; continue; }
    const m = comment.match(/\*{0,2}(\d+)\*{0,2}\s+credits?\b/i);
    if (m) claimed.set(cls + "." + method, Number(m[1]));
    else if (/\bfree\b/i.test(comment) && /credit/i.test(comment)) claimed.set(cls + "." + method, 0);
  }
  /** "racing.horses.runs" -> the claim under HorsesAPI.runs; "sports.results" -> SportsAPI.results. */
  const claimFor = (qualified) => {
    const parts = qualified.split(".");
    const method = parts.pop();
    const owner = parts.pop();
    const key = owner.charAt(0).toUpperCase() + owner.slice(1) + "API." + method;
    if (claimed.has(key)) return claimed.get(key);
    const same = [...claimed].filter(([k]) => k.endsWith("." + method));
    return same.length === 1 ? same[0][1] : undefined;
  };

  assert.ok(claimed.size > 20, `only found ${claimed.size} cost claims — did the doc format change?`);

  // Drive each method to learn which operation it hits. `current` is assigned in the loop
  // and read by the fetch closure; capturing the loop binding directly would be a temporal
  // dead zone error, since the client is constructed before the loop exists.
  const pathFor = new Map();
  let current = null;
  const pe = new PuntersEdge({
    apiKey: "pe_contract_test",
    fetch: async (url) => {
      pathFor.set(current, new URL(url).pathname);
      return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
    },
  });
  for (const [name, invoke] of calls(pe)) {
    current = name;
    await invoke();
  }

  const failures = [];

  for (const [qualified, pathname] of pathFor) {
    const method = qualified.split(".").pop();
    const claim = claimFor(qualified);
    if (claim === undefined) continue;

    const template = matchPath(pathname);
    const desc = spec.paths[template]?.get?.description ?? "";
    if (!desc) continue;

    // "Cost: 5 credits (JSON) / 20 credits (CSV)" -> pick the half this method uses.
    const tagged = [...desc.matchAll(/(\d+)\s*credits?\s*\((JSON|CSV)\)/gi)];
    let expected;
    if (tagged.length) {
      const want = method.endsWith("Csv") ? "CSV" : "JSON";
      expected = Number(tagged.find((t) => t[2].toUpperCase() === want)?.[1]);
    } else {
      const plain = desc.match(/(\d+)\s*credits?/i);
      if (!plain) continue;
      // A per-market cost has no single figure; the doc comment says so in prose.
      if (/per market/i.test(desc)) continue;
      expected = Number(plain[1]);
    }

    if (Number.isFinite(expected) && claim !== expected) {
      failures.push(
        `${qualified}: the doc comment says ${claim} credits, ` +
        `the API charges ${expected} (${template})`,
      );
    }
  }

  assert.deepEqual(failures, [], "\n  " + failures.join("\n  ") + "\n");
});
