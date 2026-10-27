// GENERATED FILE — do not edit by hand.
//
// Source:  openapi.json (API version 1.0.0)
// Rebuild: python3 scripts/generate-types.py
//
// Every interface below mirrors one `components.schemas` entry of the PuntersEdge
// OpenAPI document. A field marked optional here is one the API declares optional:
// racing data is scraped from bookmakers that each publish a different subset, so
// `barrier?: number` means some books genuinely do not report a barrier, not that
// the schema is sloppy. Check before you read.

/* eslint-disable */

export interface AcceptancesOut {
  /** Meeting day, Australia/Sydney calendar date. */
  date: string;
  /**
   * 'past', 'today' or 'future', relative to the Australia/Sydney date. On 'past' this card is a
   * FROZEN SNAPSHOT: acceptances are collected for today and forward only, so a meeting still
   * showing acceptances_published false will never fill in and the scratching set can never
   * converge. On 'today'/'future' the next collection pass CAN add acceptances and scratchings,
   * every two hours — but that is not a promise that a meeting converges. Racing Australia stops
   * listing a meeting once it is UNDERWAY, so a meeting's rows stop advancing around 12:15-14:15
   * AEST while its own races are still running to 17:00-19:30. Log-verified 2026-09-09: the
   * 02:15Z pass discovered all six of that day's meetings, the 04:15Z pass discovered one, the
   * 06:15Z pass discovered none. The in-band signal is per meeting, not per day — watch its own
   * as_of and scratching_sheet_as_of: a stamp that stops moving while later passes land on other
   * meetings is a meeting that has gone underway, not a quiet one. From that point race-day
   * movement is on /v1/racing/changes, not here.
   */
  date_status: string;
  meeting_count: number;
  race_count: number;
  /**
   * Acceptance rows on this card — scratched runners and emergencies INCLUDED. A floor, not a
   * guarantee, wherever a race reports runner_set_status other than 'checks_passed'.
   */
  runner_count: number;
  /**
   * Rows flagged as an emergency acceptance. NULL unless every meeting with rows on this card
   * has emergency_data 'parsed' — see completeness. A FLOOR, not an exact figure, wherever a
   * race reports runner_set_status other than 'checks_passed': it counts only the acceptance
   * rows this card holds.
   */
  emergency_count?: number | null;
  /**
   * runner_count minus emergency_count: the DECLARED field, i.e. the acceptances that are not
   * emergencies. NULL when emergency_count is. A FLOOR wherever a race reports runner_set_status
   * other than 'checks_passed'.
   */
  declared_count?: number | null;
  /**
   * Sheet rows MATCHED to an acceptance row this card holds — NOT every scratching Racing
   * Australia lists. A sheet row with no acceptance row here is not counted; it appears in that
   * race's missing_runners with scratched true. Measured 2026-09-08: Townsville R6 has
   * scratching_data 'parsed' and scratched_count 0 while the sheet holds #4 Five Star King and
   * #9 Kickoff, so the true figure is at least 2. Read it as a FLOOR wherever a race reports
   * runner_set_status other than 'checks_passed'; that race's runner_set_note states the bound.
   * NULL unless every meeting with rows on this card has scratching_data 'parsed' — a meeting
   * with no sheet cannot be said to have nobody scratched.
   */
  scratched_count?: number | null;
  /**
   * runner_count minus scratched_count. A RECONCILIATION number against the sheet, NOT a field
   * size: it still includes emergencies, which run only if promoted. A FLOOR wherever a race
   * reports runner_set_status other than 'checks_passed'. NULL when scratched_count is.
   */
  unscratched_count?: number | null;
  /**
   * Rows that are scratched AND not emergencies. Like scratched_count it counts only sheet rows
   * MATCHED to an acceptance row held here, so it is a FLOOR wherever a race reports
   * runner_set_status other than 'checks_passed'. NULL unless BOTH emergency_data and
   * scratching_data are 'parsed' for every meeting with rows.
   */
  declared_scratched_count?: number | null;
  /**
   * declared_count minus declared_scratched_count: the horses expected to jump barring an
   * emergency promotion, which Racing Australia does not publish. It is the number to render as
   * the field ONLY where every race behind it reports runner_set_status 'checks_passed'.
   * Anywhere else it is a FLOOR — render it as 'at least N', never as an exact field: a runner
   * Racing Australia lists that this card does not hold, and that is not on the scratching
   * sheet, may well be jumping. Measured 2026-09-08: Townsville R5 is 'gap_detected' with
   * saddlecloth #6 unaccounted for and published 11. The race's runner_set_note states the
   * bound. NULL unless BOTH facts are known everywhere.
   */
  declared_remaining_count?: number | null;
  /**
   * Newest RA scrape backing the meetings actually returned, UTC — computed after the venue
   * filter.
   */
  as_of?: string | null;
  /**
   * The first meeting day (Australia/Sydney) this store holds an acceptance card for, read from
   * the tables on every call — never a constant. Every day from here up to three days ahead is
   * served; an earlier `date` is a free 422 naming this same day. Until 2026-09-29 the reference
   * tables were deleted three days after each meeting, so the store begins at the oldest day
   * that survived that (2026-09-26) and grows by one day per day. Null only when the store could
   * not be read, and then the older 3-day rule applies.
   */
  coverage_from?: string | null;
  /** What could and could not be verified about this card. */
  completeness: Record<string, unknown>;
  meetings: Record<string, unknown>[];
  note: string;
}

export interface AccountEventOut {
  id: number;
  /** When the change was written, ISO 8601 UTC. */
  at: string;
  /** The key the change applied to: this key, or one of this account's team keys. */
  api_key_id?: string | null;
  /** Who made it: stripe, console, admin, cron, internal_provision or system. */
  actor: string;
  /**
   * What changed, e.g. plan_change, credits_override, key_rotate, key_mint, team_key_mint,
   * team_key_revoke, overage_toggle, provision.
   */
  action: string;
  /** The route, billing event or scheduled job that made the change. */
  source: string;
  /**
   * The account's state before the change (plan, active, credit fields, label, IP rule count,
   * billing ids, overage switch).
   */
  before?: Record<string, unknown> | null;
  /** The same fields after it. */
  after?: Record<string, unknown> | null;
  /** The X-Request-Id of the API call, or the billing event id, that made the change. */
  request_id?: string | null;
  note?: string | null;
}

export interface AccountEventsOut {
  /**
   * false while the change history is not yet being kept for this deployment; `events` is then
   * empty.
   */
  available: boolean;
  count: number;
  events: AccountEventOut[];
}

export interface ArchiveCoverageOut {
  archive_from: string | null;
  archive_to: string | null;
  rows: number;
  races: number;
  bookmakers: number;
  is_closing_line_pct: number;
  open_is_baseline_pct: number;
  resulted_races_pct: number;
  results_from: string | null;
  settleable_races: number;
  settleable_resulted_pct: number;
  results_scope: string;
  venue_split_suspect_rows: number;
  name_fragment_suspect_rows: number;
  /**
   * Rows of runners the result marked scratched (flag from 2026-09-28; hidden from
   * /closing-lines by default).
   */
  scratched_rows?: number;
  /**
   * Rows whose race appears to duplicate another race record (duplicate_suspect). Null where the
   * archive does not carry the flag. Added 2026-10-19.
   */
  duplicate_suspect_rows?: number | null;
  /**
   * Rows that pass the recommended modelling filter: is_closing_line AND NOT scratched AND NOT
   * venue_split_suspect AND NOT name_fragment_suspect AND NOT duplicate_suspect (an absent flag
   * counts as false). Added 2026-10-19.
   */
  backtest_ready_rows?: number;
  /** backtest_ready_rows as a share of rows. Added 2026-10-19. */
  backtest_ready_pct?: number;
  /**
   * is_closing_line either side of 2026-09-29, the first card on which a steady close can be
   * confirmed: from then a row also counts as a closing line when the book was still quoting the
   * same price inside 300 seconds of the jump; before it, only a price change inside those 300
   * seconds counted, so a price that sat still for the last minutes reads as a last-seen close.
   * One row per period: {period, from|to, rows, closing_rows, closing_pct, basis}. Added
   * 2026-10-19.
   */
  closing_by_period?: Record<string, unknown>[];
  /**
   * Of the rows that are genuine closing lines (is_closing_line, not scratched), the share
   * carrying consensus_close_prob — the market's margin-free probability stored at the close
   * (columns from 2026-10-05, backfilled to the archive floor).
   */
  consensus_close_pct?: number;
  /**
   * Of the rows whose race has a result, excluding runners the result marked scratched, the
   * share carrying a finish_position. Measured, not promised: AU thoroughbreds and greyhounds
   * carry every finisher's position (from 2026-09-14), AU harness and NZ the full field from
   * 2026-10-04 and the placegetters only before it.
   */
  finish_position_pct?: number;
  by_category: Record<string, unknown>[];
  /** Days the by_bookmaker rates and the two result-join gaps are measured over, ending now. */
  window_days?: number;
  /** Start of that window, UTC. */
  window_from?: string | null;
  /**
   * One row per bookmaker over the window: {bookmaker_key, rows, closing_pct, baseline_pct}.
   * closing_pct is the share of that book's rows with is_closing_line; baseline_pct the share
   * with open_is_baseline. Books differ widely, so filter on the flags rather than trusting the
   * aggregate.
   */
  by_bookmaker?: Record<string, unknown>[];
  /**
   * AU and NZ archive races in the window that started at least 3 hours ago (the denominator of
   * races_without_result).
   */
  settleable_races_in_window?: number;
  /** Of settleable_races_in_window, races with no result row at all. */
  races_without_result?: number;
  /**
   * Of races_without_result, races whose result exists under a different race_id (category, a
   * start within two minutes and the venue's first word match). Added 2026-10-19.
   */
  races_result_unlinked?: number;
  /**
   * AU and NZ results in the window that started at least 3 hours ago (the denominator of
   * results_without_race).
   */
  results_in_window?: number;
  /** Of results_in_window, results with no archive race (no closing line at any served book). */
  results_without_race?: number;
  /** One line per gap and rate above, saying exactly what is counted. */
  definitions?: Record<string, string>;
}

export interface BackfillStatusOut {
  job_id: string;
  submitted_at?: string | null;
  total: number;
  done: number;
  queued: number;
  failed: number;
  /** 3 per horse delivered so far. */
  credits_charged: number;
  /**
   * True when your remaining credits are below the cost of one horse, which pauses collection
   * until they reset or you upgrade.
   */
  credits_blocked: boolean;
  /** Horses ahead of this job's oldest waiting row, across all jobs. */
  queue_position?: number | null;
  estimated_ready?: string | null;
  /** Completed rows you have not yet read. */
  ready_to_collect: number;
  /**
   * Whether Racing Australia is answering form reads at all. Added 2026-09-21 and purely
   * additive: nothing else on this response, and nothing about billing or the queue, changed
   * with it.
   */
  upstream: UpstreamBlock;
}

export interface BackfillSubmitIn {
  /**
   * Horse names, `pe:` horse_refs or `ra:` entry codes, in any mix. Max 500 per call. A name and
   * its horse_ref resolve identically, against acceptances and archived results; an `ra:` code
   * pins one meeting's entry.
   */
  horses: string[];
  /** Your own tag for this batch, echoed back on status. */
  label?: string | null;
}

export interface BackfillSubmitOut {
  job_id: string;
  label?: string | null;
  /** Horses accepted and waiting on the worker. */
  queued: number;
  /**
   * Horses we already hold a fresh copy of — matched on the HORSE, so a page collected under any
   * of its Racing Australia codes counts. Collectable immediately, still billed at 3 credits
   * each.
   */
  already_stored: number;
  /** Already queued for you; not queued twice. */
  duplicates: number;
  /** Names we have never seen on our own feeds. */
  not_found?: string[];
  /** Names matching several horses. Re-submit with the runner_ref you meant. */
  ambiguous?: Record<string, unknown>[];
  /** UTC estimate for the last horse, from the worker's measured pace. */
  estimated_ready?: string | null;
}

export interface BestOddsEventOut {
  id: string;
  sport_key: string;
  home_team: string | null;
  away_team: string | null;
  commence_time: string;
  selections: Record<string, unknown>[];
  arb_exists: boolean;
  arb_profit_pct: number;
  data_age_seconds?: number | null;
  freshest_age_seconds?: number | null;
  stale?: boolean;
  stale_bookmakers?: string[];
}

export interface BestPricesOut {
  id: string;
  sport_key: string;
  home_team: string | null;
  away_team: string | null;
  commence_time: string;
  selections: Record<string, unknown>[];
}

export interface BulkCatalogueOut {
  datasets: BulkDatasetOut[];
  formats?: string[];
  day_plans: string;
  month_plans: string;
  credits: Record<string, number>;
  schedule: string;
  notes?: string[];
}

export interface BulkDatasetOut {
  name: string;
  title: string;
  description: string;
  grain: string;
  /**
   * Bumped whenever the dataset's columns change. Compare it with the value your loader was
   * written against.
   */
  schema_version?: number | null;
  /**
   * Date of the last change to the rules that decide this dataset's rows or values. Files
   * generated before that date were made under the earlier rules.
   */
  dataset_version?: string | null;
  /** What is withheld, quarantined or flagged in this dataset, and why. */
  source_notes?: string[];
  /** Column order of every file in this dataset, read from the newest file's sidecar. */
  columns?: string[];
  available_from: string;
  /** Daily files, oldest first. Business and above. */
  days?: BulkFileOut[];
  /** Monthly bundles, oldest first. Platform and above. */
  months?: BulkFileOut[];
}

export interface BulkFileOut {
  period: string;
  /** day (YYYY-MM-DD, Sydney meeting date) or month (YYYY-MM). */
  kind: string;
  rows?: number | null;
  generated_at?: string | null;
  /** Size per format: parquet, csv (gzip). */
  bytes?: Record<string, number>;
  /** Digest per format; also the ETag. */
  sha256?: Record<string, string>;
  url: string;
  /**
   * The column-set version this file was written under. Null on files written before versioning
   * began (2026-10-13).
   */
  schema_version?: number | null;
  /** The rules date this file was written under (see the dataset's dataset_version). */
  dataset_version?: string | null;
  /**
   * How many times this file has changed after it was first published; /v1/bulk/restatements
   * lists each one with its reason.
   */
  restatements?: number;
}

export interface ChangedRaceOut {
  /**
   * Stable race identifier — the same id /v1/racing/next-to-go, /v1/racing/price-history and
   * /v1/racing/results use.
   */
  race_id: string;
  venue?: string | null;
  race_number?: number | null;
  /** horse, greyhound or harness. */
  category?: string | null;
  /** ISO country code, or null while the meeting is unresolved. */
  country?: string | null;
  /**
   * Advertised start, UTC. It is revised as the meeting firms, and a revision bumps this race
   * into the feed.
   */
  start_time: string;
  /**
   * Set when the race row is created and revised exactly once, if at all: to 'abandoned' when
   * Racing Australia posts an official abandoned, postponed or transferred notice for the
   * meeting — that revision bumps every runner of the race into this feed (2026-09-06).
   * Otherwise it reads 'open' for every race here. It is not a live market-state signal — do not
   * poll this endpoint for it.
   */
  status?: string | null;
  /**
   * Betting-market state (OPEN, SUSPENDED, CLOSED). Reported by PointsBet, which sends CLOSED
   * when it shuts its book at the jump, and by the Betfair Exchange, which is withheld from
   * customer responses pending a data licence — so a value last written by the exchange reads
   * null for customers. Same shape as /v1/racing/events.
   */
  market_status?: string | null;
  /**
   * True once the market is in-play. Exchange-only — bookmakers do not run racing in-play — so
   * it carries the same licence hold as `market_status` and reads null for customers.
   */
  inplay?: boolean | null;
  /**
   * UTC time the market was FIRST seen shut. Poll-observed and set once — see /v1/racing/events
   * for the full semantics. Served when a BOOKMAKER reported the transition; null for customers
   * when the exchange was the only feed that saw it. Null never means the market stayed open.
   */
  market_closed_at?: string | null;
  /**
   * UTC time the race was FIRST seen in-play — the actual off, as opposed to `start_time`, which
   * is advertised and moves. Exchange-only, so null for customer plans.
   */
  inplay_at?: string | null;
  /**
   * Which feed's market state produced `market_closed_at` / `inplay_at` — 'pointsbetau' or
   * 'betfair_ex_au'. Set once, with the first stamp, and null whenever those stamps are
   * withheld.
   */
  market_state_source?: string | null;
  /**
   * The COMPLETE current scratchings for this race, merged across every book that reports one —
   * not a delta, so a runner leaving the list is visible as an absence. Greyhound cards also
   * carry box-vacancy placeholders here (a literal '....' or 'Vacant Box'), which name an empty
   * box rather than a withdrawn runner; match on `number` and treat a name from that set as a
   * vacant box.
   */
  scratchings?: Record<string, unknown>[];
  /**
   * UTC instant of the most recent logged track-condition, weather or rail transition for this
   * race's meeting (2026-09-05). Null when nothing has changed since we began watching it. Read
   * it with `track_condition`: the value says WHAT, this says WHEN.
   */
  track_condition_changed_at?: string | null;
  /**
   * The race's CURRENT track condition, not a change log — a poller diffing against what it
   * holds sees a condition change the same way it sees a scratching. Null where no source
   * reports it.
   */
  track_condition?: string | null;
  /** Current weather for the meeting, same read-as-current rule as track_condition. */
  weather?: string | null;
  /**
   * Runner prices that moved inside the window. An empty list means this race arrived on the
   * race-level arm alone — expected, and explained in the endpoint description.
   */
  changed_runners?: ChangedRunnerOut[];
}

export interface ChangedRunnerOut {
  /** Runner name as the bookmaker publishes it. */
  name: string;
  /** Saddlecloth / rug number, where the book supplies one. */
  number?: number | null;
  /** Bookmaker this price belongs to. */
  bookmaker_key: string;
  /** Current fixed win price at this bookmaker. */
  win_price?: number | null;
  /**
   * Current fixed place price. A place-only move does not advance `updated_at` — see the
   * endpoint description.
   */
  place_price?: number | null;
  /** Current Top 2 (first-two) price at this bookmaker, where quoted. */
  top2_price?: number | null;
  /** Current Top 3 price at this bookmaker, where quoted. */
  top3_price?: number | null;
  /** Current Top 4 price at this bookmaker, where quoted. */
  top4_price?: number | null;
  /**
   * UTC instant this runner's win or lay price last CHANGED at this bookmaker. Not the last
   * poll: ingest carries this timestamp forward while the price is steady.
   */
  updated_at: string;
  /**
   * Opens this bookmaker's betslip with this runner's fixed WIN selected. Plus and above.
   * Present only for the books with a runner-level route (unibet, tab, ladbrokes_au, neds) — see
   * /v1/racing/next-to-go for the per-book table and the daily check behind it.
   */
  betslip_win_url?: string | null;
  /**
   * Same, fixed PLACE. Null when the book has a win link but is not quoting the place; on TAB it
   * is the same one-shot URL as the win link.
   */
  betslip_place_url?: string | null;
  /**
   * True for Ladbrokes and Neds: those URLs open the native app and redirect to the app-download
   * page in a desktop browser.
   */
  betslip_app_only?: boolean | null;
  /**
   * Your own link for betslip_win_url, built through the link templates stored with PUT
   * /v1/link-templates. Absent when your account stores none, or there is nothing to link.
   */
  betslip_win_link?: string | null;
  /**
   * Your own link for betslip_place_url, built the same way. Absent when there is nothing to
   * link.
   */
  betslip_place_link?: string | null;
}

export interface ChecklistStep {
  id: string;
  label: string;
  state: string;
  at?: string | null;
  detail?: string | null;
}

/**
 * One archived series: a race, a runner and a bookmaker. Field order is the CSV column order.
 * Every field is nullable in the schema; the ones described as "never null" are always set on
 * a served row.
 */
export interface ClosingLineRow {
  /** Race id; joins /v1/racing/results and /v1/racing/markets. Never null. */
  race_id?: string | null;
  /** Advertised start, UTC, ISO 8601 with Z. Never null. */
  start_time?: string | null;
  /** Meeting date, YYYY-MM-DD, Australian Eastern calendar. Never null. */
  meeting_date_aet?: string | null;
  /** Venue name as the books list it. Never null. */
  venue?: string | null;
  /** Race number at the meeting. */
  race_number?: number | null;
  /** horse, harness or greyhound. */
  category?: string | null;
  /** Two-letter country code. */
  country?: string | null;
  /** Normalised runner name; the runner's key within the race. Never null. */
  runner_key?: string | null;
  /** Runner name as published. Never null. */
  runner_name?: string | null;
  /** Saddlecloth (box for greyhounds). */
  runner_number?: number | null;
  /** Bookmaker key. Never null. */
  bookmaker_key?: string | null;
  /** Win price at the first observation of the series. */
  open_win_price?: number | null;
  /** Seconds to the jump at the first observation. */
  open_secs_to_jump?: number | null;
  /**
   * FLAG. True when the series began at the 60-minute window entry, so open_win_price is a
   * market open; false when the book joined mid-window. Never null.
   */
  open_is_baseline?: boolean | null;
  /** Win price at the last observation before the jump. */
  close_win_price?: number | null;
  /** Exchange lay price at the close; null for customers (exchange rows are withheld). */
  close_lay_price?: number | null;
  /** Seconds to the jump at the last observation. */
  close_secs_to_jump?: number | null;
  /**
   * FLAG. True when the last observation was within 300 seconds of the jump: a genuine closing
   * line. False rows carry a last-seen price. Never null.
   */
  is_closing_line?: boolean | null;
  /** Price points in the series. Never null. */
  points_observed?: number | null;
  /**
   * Finishing position where the result publishes one. Null does NOT mean the runner lost; read
   * result_status.
   */
  finish_position?: number | null;
  /** The race's result status; null when the race has no result. */
  result_status?: string | null;
  /**
   * FLAG. The row may belong to a race the feed split across two venue spellings. Excluded by
   * default. Never null.
   */
  venue_split_suspect?: boolean | null;
  /** FLAG companion. The other race_id of a suspected venue split. */
  venue_split_peer_race_id?: string | null;
  /**
   * FLAG. The runner name looks like a fragment of another runner's name. Excluded by default.
   * Never null.
   */
  name_fragment_suspect?: boolean | null;
  /** Canonical venue id from the venue registry. */
  venue_id?: string | null;
  /** Canonical venue site from the venue registry. */
  venue_site?: string | null;
  /** Registry id for the runner on race day (ra:, grv:, grsa:). */
  runner_ref?: string | null;
  /** Horse identity across meetings (pe:<name>); thoroughbreds only. */
  horse_ref?: string | null;
  /**
   * FLAG. The result marked this runner scratched, yet a book kept pricing it. Excluded by
   * default. On harness and NZ rows false means not known. Never null.
   */
  scratched?: boolean | null;
  /** Place price at the first observation (from 2026-09-29). */
  open_place_price?: number | null;
  /** Place price at the last observation (from 2026-09-29). */
  close_place_price?: number | null;
  /** When the runner was scratched, UTC, as the board stamped it (from 2026-09-29). */
  scratched_at?: string | null;
  /** Same Race Multi Top 2 price at the first observation. */
  open_top2_price?: number | null;
  /** Same Race Multi Top 3 price at the first observation. */
  open_top3_price?: number | null;
  /** Same Race Multi Top 4 price at the first observation. */
  open_top4_price?: number | null;
  /** Same Race Multi Top 2 price at the last observation. */
  close_top2_price?: number | null;
  /** Same Race Multi Top 3 price at the last observation. */
  close_top3_price?: number | null;
  /** Same Race Multi Top 4 price at the last observation. */
  close_top4_price?: number | null;
  /** Market consensus probability at the close, margin removed. */
  consensus_close_prob?: number | null;
  /** The price consensus_close_prob corresponds to. */
  consensus_close_price?: number | null;
  /** Books the closing consensus rests on. */
  books_in_consensus_close?: number | null;
  /** Consensus price at the 60-minute open. */
  consensus_open_price?: number | null;
  /** Books the opening consensus rests on. */
  books_in_consensus_open?: number | null;
  /**
   * FLAG. The row's race appears to duplicate another race record (the same race filed twice);
   * duplicate_of_race_id names the other. The key is absent until the archive carries the flag.
   */
  duplicate_suspect?: boolean | null;
  /** FLAG companion. The race_id this row's race duplicates. Absent until the archive carries it. */
  duplicate_of_race_id?: string | null;
  /**
   * Meeting date in the venue's own time zone, YYYY-MM-DD. For GB and IE racing key on race_id
   * or (venue, meeting_date_local, race_number). Absent until the archive carries it.
   */
  meeting_date_local?: string | null;
}

export interface ClosingLinesOut {
  rows_returned: number;
  /** Rows matching the filter before limit/offset */
  total_rows: number;
  limit: number;
  offset: number;
  /**
   * Earliest start_time in the whole archive. The archive only grows; this is its true floor as
   * of right now, not a promise.
   */
  archive_from?: string | null;
  /** Set when the caller's plan clamps the lookback. NULL means the full archive was searched. */
  window_days?: number | null;
  /**
   * Rows in the matching set that have a result_status. Published because result coverage is
   * thin and growing (5.3% of archived races on 2026-08-18) — do not assume a NULL
   * finish_position means the runner lost. It means no position was published for the runner:
   * harness and NZ results named the placegetters only before 2026-10-04 and carry the full
   * field from then, while AU thoroughbred and greyhound results position every finisher (from
   * 2026-09-14).
   */
  resulted_rows: number;
  rows: ClosingLineRow[];
}

export interface ClvBetIn {
  /** Your own id for this bet, echoed back unchanged. */
  ref?: string | null;
  /**
   * The race_id from /v1/racing/next-to-go, /events, /results or the archive. The most reliable
   * way to name a race; use venue + meeting_date + race_number only when you do not hold it.
   */
  race_id?: string | null;
  /** Venue name as our feeds spell it (case-insensitive). Needs meeting_date and race_number. */
  venue?: string | null;
  race_number?: number | null;
  /** AET meeting date, YYYY-MM-DD. */
  meeting_date?: string | null;
  /**
   * Registry id as served on /results and the archive — ra:<horsecode> or grv:<dogId>. Exact
   * match; the most reliable way to name a runner.
   */
  runner_ref?: string | null;
  /** Saddlecloth number. */
  runner_number?: number | null;
  /**
   * Runner name; matched the same way the feeds match names (case, punctuation and country
   * suffixes ignored).
   */
  runner_name?: string | null;
  /**
   * bookmaker_key the bet was struck with. When given, `clv_pct` is measured against THAT book's
   * closing price and `close_book` is filled; when absent, against the market reference chosen
   * by `reference`.
   */
  bookmaker?: string | null;
  /** Decimal odds you took. */
  price: number;
  /** Stake for the P&L line. Defaults to one flat unit. */
  stake?: number;
}

export interface ClvBetOut {
  ref?: string | null;
  /**
   * True when the race AND the runner were found in the archive. False rows carry `reason` and
   * no numbers.
   */
  resolved: boolean;
  /**
   * race_not_found · race_ambiguous · runner_not_found · runner_ambiguous · bookmaker_withheld ·
   * no_closing_line · no_closing_line_for_book.
   */
  reason?: string | null;
  race_id?: string | null;
  venue?: string | null;
  race_number?: number | null;
  runner_key?: string | null;
  runner_name?: string | null;
  runner_number?: number | null;
  runner_ref?: string | null;
  bookmaker?: string | null;
  price_taken: number;
  stake: number;
  /** The named bookmaker's closing win price, when it recorded a closing line. */
  close_book?: number | null;
  /** Highest closing win price across books. */
  close_best?: number | null;
  /** Median closing win price across books. */
  close_median?: number | null;
  /** Books with a closing line for this runner. */
  books_at_close?: number;
  /**
   * The close `clv_pct` is measured against: close_book when a bookmaker was named and priced
   * the close, else the market reference.
   */
  close_reference?: number | null;
  /** (price_taken / close_reference − 1) × 100. Positive means you beat the close. */
  clv_pct?: number | null;
  beat_close?: boolean | null;
  finish_position?: number | null;
  /** final · interim · null (not yet resulted). */
  result_status?: string | null;
  /**
   * On a final result: true for the winner, false for every other runner — including one with no
   * published position, since results list placegetters only. Null until final, and null when
   * the result records no winner.
   */
  won?: boolean | null;
  /** stake × (price − 1) on a win, −stake on a loss, null until the result is final. */
  pnl?: number | null;
}

export interface ClvIn {
  /** Up to 200 bets per request. */
  bets: ClvBetIn[];
  /**
   * The market close used when a bet names no bookmaker, and reported as close_best /
   * close_median on every bet regardless: `best` is the highest closing win price across books,
   * `median` the median.
   */
  reference?: string;
}

export interface ClvOut {
  reference: string;
  /** Earliest race day the archive holds; bets before it cannot resolve. */
  archive_floor?: string | null;
  summary: ClvSummaryOut;
  bets: ClvBetOut[];
  notes?: string[];
}

export interface ClvSummaryOut {
  bets: number;
  resolved: number;
  unresolved: number;
  /** Bets with a closing line to measure against. */
  scored: number;
  avg_clv_pct?: number | null;
  median_clv_pct?: number | null;
  beat_close?: number;
  beat_close_rate_pct?: number | null;
  /** Scored-or-resolved bets with a final result. */
  resulted?: number;
  wins?: number;
  win_rate_pct?: number | null;
  staked?: number | null;
  pnl?: number | null;
  roi_pct?: number | null;
}

export interface ConnectorHealthOut {
  connector: string;
  last_ok: string | null;
  last_poll?: string | null;
  status: string;
  records_written: number;
  message?: string | null;
}

export interface ConsensusBookOut {
  bookmaker: string;
  runners_priced: number;
  /** Σ 1/price × 100 over the runners this book priced; null below two. */
  overround_pct?: number | null;
  age_seconds?: number | null;
  last_update?: string | null;
  refresh_tier?: string;
  stale?: boolean;
  /** Whether this book entered the consensus. */
  included: boolean;
  /** Why not: stale · partial_field · single_runner. */
  reason?: string | null;
}

export interface ConsensusExclusionOut {
  bookmaker: string;
  reason: string;
  age_seconds?: number | null;
  runners_priced?: number | null;
}

export interface ConsensusMarketOut {
  median_overround_pct?: number | null;
  /**
   * Σ 1/best_price × 100 over the runners with a consensus. Under 100 means the best prices
   * across the included books beat the field.
   */
  best_price_market_pct?: number | null;
  median_runner_spread_pct?: number | null;
  /**
   * The sum of the per-runner medians before the field was scaled to one. Close to 1.0 when the
   * books agree on the field; printed so the scaling is visible rather than silent.
   */
  consensus_sum_before_normalisation?: number | null;
  /** Runners a complete-field book prices; books quoting fewer are excluded as partial_field. */
  field_size?: number | null;
}

export interface ConsensusMethodOut {
  /** power (the default) or multiplicative. */
  normalisation?: string;
  aggregation?: string;
  renormalised?: boolean;
  stale_rule?: string;
  field_rule?: string;
  min_books?: number;
  include_stale?: boolean;
}

export interface ConsensusOut {
  race: ConsensusRaceOut;
  method: ConsensusMethodOut;
  books_quoting: number;
  books_in_consensus: number;
  books_excluded?: ConsensusExclusionOut[];
  bookmakers?: ConsensusBookOut[];
  market: ConsensusMarketOut;
  runners?: ConsensusRunnerOut[];
  /**
   * Placeholder prices left out of the consensus quote by quote, on the rule
   * /v1/racing/best-odds uses: a long price at least four times the median of three or more
   * other books on the same runner.
   */
  excluded_quotes?: Record<string, unknown>[];
  scratchings?: Record<string, unknown>[];
  note?: string | null;
}

export interface ConsensusQuoteOut {
  bookmaker: string;
  price: number;
  /** This book's probability for the runner after its own margin is removed by the stated method. */
  no_vig_prob?: number | null;
  age_seconds?: number | null;
}

export interface ConsensusRaceOut {
  race_id: string;
  venue?: string | null;
  race_number?: number | null;
  category?: string | null;
  country?: string | null;
  start_time?: string | null;
  /** Negative once the race has jumped. */
  secs_to_jump?: number | null;
  /**
   * The race's own refresh rule — live inside three hours of the jump, card beyond it. Each
   * book's tier is on its own entry.
   */
  refresh_tier?: string;
  /** upcoming · jumped. */
  status?: string;
  as_of: string;
}

export interface ConsensusRunnerOut {
  /** Saddlecloth (box for greyhounds), voted across the books. */
  number?: number | null;
  name?: string | null;
  /**
   * Registry id where known: ra:<code> for a thoroughbred (Racing Australia's code, new each
   * day), grv:/grsa: for a dog.
   */
  runner_ref?: string | null;
  /** pe:<name>, the stable thoroughbred identity. Null off AU thoroughbreds. */
  horse_ref?: string | null;
  scratched?: boolean;
  /** Included books quoting this runner. */
  books?: number;
  /**
   * The market's implied probability for this runner after margin is removed from every included
   * book and the books are combined by median, renormalised so the field sums to one. Null when
   * fewer than `min_books` included books quote the runner. It describes the market, not the
   * outcome.
   */
  consensus_prob?: number | null;
  /** 1 / consensus_prob. */
  consensus_price?: number | null;
  median_price?: number | null;
  mean_price?: number | null;
  /** Highest price among the included books. */
  best_price?: number | null;
  best_bookmaker?: string | null;
  worst_price?: number | null;
  /** best / worst - 1, in percent. */
  price_spread_pct?: number | null;
  /**
   * best_price / consensus_price - 1, in percent. Negative is normal: every quoted price carries
   * margin, so the best quote usually sits below the market's margin-free price (about -20 % on
   * a 130 % greyhound market). It turns positive only when one book prices a runner above the
   * panel's margin-free view. Not a value judgement.
   */
  best_vs_consensus_pct?: number | null;
  freshest_age_seconds?: number | null;
  oldest_age_seconds?: number | null;
  quotes?: ConsensusQuoteOut[];
}

export interface ExoticsOut {
  source?: string;
  /** The result's own status: interim or final. An interim dividend can still move. */
  status?: string | null;
  dividends?: Record<string, unknown>[];
}

export interface FieldFormOut {
  /**
   * Our race_id. Null on an acceptance-only answer (`card_source: acceptances`): the race is on
   * Racing Australia's card but no bookmaker has framed it yet, and every AU book frames a race
   * 16 hours before its jump.
   */
  race_id?: string | null;
  venue?: string | null;
  race_number?: number | null;
  /** Scheduled start, UTC. Null on an acceptance-only answer; see `start_time_local`. */
  start_time?: string | null;
  /**
   * Racing Australia's published start on the venue's own clock ('1:35PM'). Set on an
   * acceptance-only answer.
   */
  start_time_local?: string | null;
  /** Sydney calendar date of the meeting; the London date for a British or Irish race. */
  meeting_date?: string | null;
  race_name?: string | null;
  distance_m?: number | null;
  /** As the live card or the result carries it. */
  track_condition?: string | null;
  /**
   * The live race's status while it is open; the result's (`interim`/`final`) once it has been
   * run.
   */
  race_status?: string | null;
  /**
   * `live` -- the field came from the live card; `results` -- the race has been run, its live
   * rows are gone, and the field is the settled result's; `acceptances` -- no bookmaker has
   * framed the race yet (or no live field is held), and the field is Racing Australia's
   * acceptance card.
   */
  card_source: string;
  /**
   * True when Racing Australia's acceptance card for this race was found and folded in: every
   * accepted runner (emergencies aside) is in `runners`, named as RA names it.
   */
  acceptances_folded?: boolean;
  /**
   * This race's start, UTC. Every run and every figure below is from BEFORE this instant, so a
   * race already run answers with what was knowable at the jump and never with its own result.
   * On an acceptance-only answer, Sydney midnight opening the meeting day.
   */
  form_as_at?: string | null;
  /** The `runs` limit this answer was built with. */
  runs_per_runner: number;
  runners_total: number;
  /**
   * Runners with at least one start held (`runs_total` of 1 or more). A runner whose only held
   * rows are scratchings is not counted.
   */
  runners_with_runs: number;
  runners: FieldRunner[];
  source: RunsSourceBlock;
}

export interface FieldRunner {
  /** Saddlecloth number on this race's card. */
  number?: number | null;
  /** The horse's name as the card (or the result) spells it. */
  name: string;
  /**
   * `pe:<name>` -- the identity the runs were gathered on, the same value every thoroughbred
   * surface publishes. Pass it to /v1/racing/horses/runs or /v1/racing/horses/form for the
   * one-horse view.
   */
  horse_ref?: string | null;
  /**
   * The Racing Australia code this runner carries on the live card or the result -- on race day
   * the join to /v1/racing/next-to-go, /v1/racing/acceptances and /v1/racing/results. Not a
   * horse identity: Racing Australia issues a new code for the same horse each day. Null when
   * the card did not carry one.
   */
  runner_ref?: string | null;
  /**
   * Barrier drawn for THIS race, as the card publishes it (the stall draw on a British or Irish
   * card).
   */
  barrier?: number | null;
  /** Rider declared for THIS race. */
  jockey?: string | null;
  trainer?: string | null;
  /**
   * Weight allotted for THIS race, as the card publishes it; a British or Irish card's stones
   * and pounds converted to kg, one decimal.
   */
  weight_kg?: number | null;
  /**
   * The horse's age as the card prints it. British and Irish cards (William Hill, Betway)
   * publish it; the Australian books do not, so it is null on an AU race.
   */
  age?: number | null;
  /**
   * The rating the card prints: on a British or Irish race the Racing Post rating as William
   * Hill's card carries it. Null when no card we read publishes one (every AU race).
   */
  rating?: number | null;
  /**
   * True when the card has scratched the horse. It stays in the field so the runners match what
   * the acceptances published.
   */
  scratched?: boolean;
  /**
   * Racing Australia's last-ten figures for the horse, as its acceptance card prints them; on a
   * British or Irish race the form figures the bookmaker's card prints (William Hill, Betway).
   * Null when no card lists this runner, or lists no figures.
   */
  last10?: string | null;
  /**
   * The horse's last start as Racing Australia's acceptance card gives it, YYYY-MM-DD, including
   * starts older than `source.coverage_from`: a runner with `runs_total` 0 and a last start
   * before that floor has history we do not hold (read it with /v1/racing/horses/form). Null
   * with `last10` null: the card shows no previous start.
   */
  last_start_date?: string | null;
  /**
   * STARTS we hold for this horse before this race's start: runs with `status` `ran`, the same
   * count as `stats.starts`. A scratching is not a start. 0 is honest: no start held -- a first
   * starter, or a horse whose starts predate `source.coverage_from` (on an Australian race
   * `last_start_date` tells the two apart). Before 2026-10-13 this counted every held row,
   * scratchings included, so a horse scratched before its debut read 1 or more: on 2026-10-12,
   * 442 of the 31,163 horses in the store held scratchings and no start. That count is
   * `held_rows_total`.
   */
  runs_total: number;
  /**
   * Every row we hold for this horse before this race's start: its starts plus its scratchings
   * (rows whose `status` is not `ran`). `runs` is drawn from these rows, so a horse with
   * `runs_total` 0 can still carry `runs` entries -- its scratchings. Measured on 2026-10-12,
   * 61,719 of the store's 282,639 rows (21.8%) were scratchings.
   */
  held_rows_total: number;
  /** Over every held run before this race, not just the `runs` returned; starts only. */
  stats: HorseRunsStats;
  /**
   * Newest first, at most `runs` of them, every one before this race's start. Scratchings are
   * included and read `status: scratched`.
   */
  runs: HorseRunRow[];
}

export interface ForgotPasswordIn {
  email: string;
}

export interface GreyhoundFieldOut {
  race_id: string;
  venue?: string | null;
  race_number?: number | null;
  /** Scheduled start, UTC. */
  start_time?: string | null;
  /** Sydney calendar date of the meeting; the London date for a British or Irish race. */
  meeting_date?: string | null;
  race_name?: string | null;
  distance_m?: number | null;
  track_condition?: string | null;
  /**
   * The live race's status while it is open; the result's (`interim`/`final`) once it has been
   * run.
   */
  race_status?: string | null;
  /**
   * `live` -- the field came from the live card; `results` -- the race has been run, its live
   * rows are gone, and the field is the settled result's.
   */
  card_source: string;
  /**
   * This race's start, UTC. Every run and figure below is from BEFORE this instant, so a race
   * already run answers with what was knowable at the jump, never its own result.
   */
  form_as_at?: string | null;
  runs_per_runner: number;
  runners_total: number;
  /**
   * Runners with at least one start held (`runs_total` of 1 or more). A runner whose only held
   * rows are scratchings or unused reserves is not counted.
   */
  runners_with_runs: number;
  runners: GreyhoundFieldRunner[];
  source: GreyhoundFieldSource;
}

export interface GreyhoundFieldRunner {
  /** Rug number on this race's card. */
  number?: number | null;
  /** The dog's name as the card (or the result) spells it. */
  name: string;
  /**
   * The identity the runs were grouped on (letters and digits). Pass it, or the name, as `dog`
   * to /v1/racing/greyhounds/form or /stats for the one-dog view.
   */
  name_key: string;
  /**
   * Trap drawn for THIS race: the book's draw where it gives one, else the rug number (on a
   * British or Irish card the two are the same number).
   */
  box?: number | null;
  trainer?: string | null;
  /**
   * The card's form figures as the bookmaker prints them (William Hill and PointsBet on British
   * and Irish cards; PointsBet on Australian ones). Null on a race answered from its result.
   */
  form?: string | null;
  /** True when the card has scratched the dog, or it is an unused reserve. It stays in the field. */
  scratched?: boolean;
  /**
   * Registry id (grv:/grsa:) carried by a settled Australian result; null on a live card and on
   * every British or Irish race.
   */
  runner_ref?: string | null;
  /**
   * STARTS we hold for this dog BEFORE this race's start: runs with `status` `ran`, the same
   * count as `stats.starts`. A scratching or an unused reserve is not a start. 0 is honest: a
   * first starter, or a record older than `source.coverage_from`. Before 2026-10-13 this counted
   * every held row; that count is `held_rows_total`.
   */
  runs_total: number;
  /**
   * Every row we hold for this dog before this race's start: its starts plus its scratchings and
   * unused reserves (rows whose `status` is not `ran`). `runs` is drawn from these rows, so a
   * dog with `runs_total` 0 can still carry `runs` entries. Measured 2026-10-13: 6,247 of the AU
   * store's 103,553 rows were not starts.
   */
  held_rows_total: number;
  /** Over every held run before this race; starts only. */
  stats: GreyhoundFieldStats;
  /**
   * Newest first, at most `runs` of them, every one before this race's start. Scratchings and
   * unused reserves are included and say so in `status`.
   */
  runs: GreyhoundRun[];
}

/**
 * The field view's source block: the per-dog one plus `note`. A subclass, so the per-dog
 * routes' published shape does not change.
 */
export interface GreyhoundFieldSource {
  /**
   * Where the data comes from: our own collection of published AU greyhound results, Victorian
   * tracks via FastTrack (runner_ref grv:) and every other state via the national results pages
   * (runner_ref grsa:). Runs on or after `results_from` are races we settled ourselves; earlier
   * runs are the same pages read back by our history collector. Refreshed hourly. On a British
   * or Irish race (/v1/racing/greyhounds/field, from 2026-10-12) `region` reads GB-IE and the
   * runs are our own GB/IE results from PointsBet's settled race card, read live.
   */
  feed?: string;
  region?: string;
  sport?: string;
  /** Sydney date of the OLDEST run in the store. A dog's record here starts here. */
  coverage_from?: string;
  /**
   * Sydney date our own settled results begin. A run on or after it has `origin: results` and a
   * `result_id` that joins to /v1/racing/results; an earlier one has `origin: history` and does
   * not.
   */
  results_from?: string;
  /** Sydney date of the latest race in the store. */
  coverage_to?: string | null;
  /**
   * Which of our collectors can contribute a run: `fasttrack` = Victorian tracks, `grsa` = every
   * other state.
   */
  collectors?: string[];
  /** The store is rebuilt from our results at :58 each hour, after both collectors have written. */
  refreshed_hourly?: boolean;
  /**
   * Set on a British or Irish race: GB/IE positions are placings, so a `ran` run with a null
   * position was not placed. Null on an Australian race.
   */
  note?: string | null;
}

export interface GreyhoundFieldStats {
  starts: number;
  wins: number;
  /** Finishes in the first three, wins included. */
  places: number;
  win_pct: number;
  place_pct: number;
}

export interface GreyhoundFormOut {
  /** The dog's name as our results spell it. */
  dog: string;
  /** The identity the runs were grouped on (letters and digits). */
  name_key: string;
  /** Every registry id seen for this name, across both collectors. */
  runner_refs: string[];
  /**
   * STARTS we hold for this dog since `source.coverage_from`: runs with `status` `ran`, the same
   * count as /v1/racing/greyhounds/stats `overall.starts`. A scratching or an unused reserve is
   * not a start. Before 2026-10-13 this counted every held row; that count is `held_rows_total`.
   */
  runs_total: number;
  /**
   * Every row we hold for this dog since `source.coverage_from`: its starts plus its scratchings
   * and unused reserves (rows whose `status` is not `ran`). `runs` is the newest `limit` of
   * these rows. Measured 2026-10-13: 6,247 of the store's 103,553 rows were not starts, and 102
   * of its 12,191 dogs held rows but no start.
   */
  held_rows_total: number;
  runs: GreyhoundRun[];
  source: SourceBlock;
}

export interface GreyhoundRun {
  /** Sydney calendar date of the race; the London date on a British or Irish run. */
  date?: string | null;
  /** Scheduled start, UTC. */
  start_time?: string | null;
  venue?: string | null;
  race_number?: number | null;
  distance_m?: number | null;
  race_name?: string | null;
  track_condition?: string | null;
  box?: number | null;
  /** Rug number; equals box for a starter. */
  number?: number | null;
  /**
   * Finishing place. Null when the dog did not run (see `status`) or did not complete the
   * course. On a British or Irish run the positions are placings, so null with `status: ran`
   * means not placed (see `source.note` on /v1/racing/greyhounds/field).
   */
  position?: number | null;
  /** `ran`, `scratched`, or `reserve` (a rug 9/10 reserve that never got a box). */
  status?: string | null;
  /**
   * Lengths behind the winner as the source printed it; the winner's own row carries the winning
   * margin on Victorian tracks and null elsewhere.
   */
  margin?: string | null;
  /** The dog's own finish time in seconds. */
  time_s?: number | null;
  /**
   * First sectional in seconds, as the source page printed it. Null where it printed none — a
   * reserve that never started has none, and some tracks publish no sectionals at all.
   */
  first_split_s?: number | null;
  /**
   * Second sectional in seconds. Null on every Victorian run: FastTrack publishes one split, not
   * two.
   */
  second_split_s?: number | null;
  /**
   * Race-day weight in kilograms. Null where the page prints no weight — Western Australian
   * meetings mostly print none (measured 2026-09-28 over 2026-09-13..28: Cannington 2.5%,
   * Mandurah 15.4%, Northam 68.7% of runs).
   */
  weight_kg?: number | null;
  /**
   * Position in running as TEXT, one digit per in-running mark ("21" = 2nd then 1st at the
   * marks; the finish is not a mark). Victorian runs: FastTrack's own PIR column. Other states,
   * since 2026-09-29: the national page's In Race Positions card, which only some tracks print —
   * measured 2026-09-28 over the 158 national races of 2026-09-27..28: NSW 79.6%, QLD 79.0%, WA
   * 100% of runs, SA and TAS about 0% (no card at Angle Park, Gawler, Launceston, Rockhampton or
   * Temora). The two sources' marks are not the same points on a track: compare PIR within one
   * source. Null where the page printed none.
   */
  pir?: string | null;
  /**
   * The race's grade in the SOURCE'S OWN WORDS — "M", "4/5", "FFA" on the national pages, a race
   * type like "Tier 3 - Maiden" on FastTrack. The two vocabularies are NOT mapped onto each
   * other and must not be compared across states. Null on runs whose field was stored before
   * 2026-09-21.
   */
  grade?: string | null;
  /** The winner's time in the same race, so `time_s - win_time_s` is the deficit. */
  win_time_s?: number | null;
  /** Official starting price, decimal return on $1. Null = unknown, never zero. */
  sp?: number | null;
  dead_heat?: boolean;
  trainer?: string | null;
  /** Dogs that ran in that race. */
  field_size?: number | null;
  /** Registry id of the dog as the collector for that track numbers it: grv:<id> or grsa:<id>. */
  runner_ref?: string | null;
  /**
   * `fasttrack` or `grsa` — which collector wrote the race; `pointsbetau` on a British or Irish
   * run.
   */
  source?: string | null;
  /**
   * `results` — the race is one we settled and serve on /v1/racing/results; `history` — the race
   * was read back off the same official results page by our history collector and has no results
   * row.
   */
  origin?: string | null;
  /**
   * Id of the /v1/racing/results row this run came from. On an `origin: history` run it is a
   * synthetic `hist:…` id that joins to nothing.
   */
  result_id?: string | null;
}

export interface GreyhoundStatRow {
  /** Set when `by` includes track. */
  track?: string | null;
  /** Set when `by` includes distance. */
  distance_m?: number | null;
  /** Set when `by` includes box. */
  box?: number | null;
  /**
   * Set when `by` includes grade: the race's grade in the source's own words ("5", "M", "4/5"
   * nationally; a race type like "Grade 5" or "Mixed 4/5" on FastTrack). The two vocabularies
   * are NOT mapped onto each other, so compare rows within one source. A run stored with no
   * grade groups under null.
   */
  grade?: string | null;
  /**
   * Runs with status `ran` — scratchings and unused reserves are excluded from every figure
   * here.
   */
  starts: number;
  wins: number;
  /** Finishes in the first three, wins included. */
  places: number;
  win_pct: number;
  place_pct: number;
  /** Over the runs with a recorded time. */
  avg_time_s?: number | null;
  best_time_s?: number | null;
  /**
   * Mean first sectional over the runs in this group that carry one. Null when none does — the
   * count behind it is not `starts`, because some tracks publish no sectionals.
   */
  avg_first_split_s?: number | null;
  /** Mean official starting price over the runs that carry one. */
  avg_sp?: number | null;
  /** Sydney date of the most recent run in the group. */
  last_start?: string | null;
}

export interface GreyhoundStatsOut {
  dog: string;
  name_key: string;
  runner_refs: string[];
  /** The dimensions the rows are grouped by, in the order given. */
  by: string[];
  /** One row per distinct combination, most starts first. */
  rows: GreyhoundStatRow[];
  /** The same figures over every run since `source.coverage_from`. */
  overall: GreyhoundStatRow;
  source: SourceBlock;
}

export interface HorseCandidate {
  /**
   * A Racing Australia code for this horse. `candidates` is always empty: a name resolves to one
   * horse. See `ambiguous`.
   */
  runner_ref: string;
  runner_name?: string | null;
  /** Most recent date this ref appeared on our feeds (acceptance or result). */
  last_seen?: string | null;
  /** Where it was seen: acceptances or results. */
  source: string;
}

export interface HorseCareer {
  starts?: number | null;
  wins?: number | null;
  seconds?: number | null;
  thirds?: number | null;
  /** Career prizemoney, whole AUD. */
  prizemoney?: number | null;
  /** Total bonus (e.g. BOBS), whole AUD. */
  bonus?: number | null;
  min_dist_win_m?: number | null;
  max_dist_win_m?: number | null;
  /**
   * RA's own career splits, keyed first_up, second_up, firm, good, soft, heavy, synthetic — plus
   * track, distance and track_distance when RA renders them. Each value is
   * starts/wins/seconds/thirds.
   */
  splits?: Record<string, SplitRecord>;
}

export interface HorseFormOut {
  horse_name?: string | null;
  /**
   * The HORSE: `pe:<name>`, the registered name folded to letters and digits. The same value on
   * /v1/racing/results runners and placings, the live board, the closing-line and price-path
   * archives, /v1/racing/horses/runs and the form backfill — and accepted as `horse` here. This
   * is the key to join a horse across meetings.
   */
  horse_ref?: string | null;
  /**
   * The Racing Australia code the page was read under — the most recent code we hold for the
   * horse. Racing Australia issues a new code for the same horse each day, so it is not a horse
   * identity — `horse_ref` is.
   */
  runner_ref?: string | null;
  /**
   * ALWAYS FALSE since 2026-09-21, and kept only so that callers reading it do not break. A name
   * now resolves to one horse: several ra: codes under one name are the ordinary case (they are
   * entry codes), not two horses. `candidates` is empty with it.
   */
  ambiguous: boolean;
  candidates?: HorseCandidate[];
  profile?: HorseProfile | null;
  career?: HorseCareer | null;
  runs?: HorseRun[];
  source?: HorseSource | null;
}

export interface HorseProfile {
  /** As published, e.g. '4yo Bay Gelding'. */
  age_sex?: string | null;
  dob?: string | null;
  sire?: string | null;
  dam?: string | null;
  status?: string | null;
  trainer?: string | null;
  trainer_location?: string | null;
  owners?: string | null;
  colours?: string | null;
  /** As published, date and gear, e.g. '20-Aug-2026, Blinkers, First Time, ...'. */
  last_gear_change?: string | null;
}

export interface HorseRun {
  date?: string | null;
  /**
   * Venue name. Set when `source.feed` is 'puntersedge_results'; RA's own page gives the
   * compressed `track` code instead and leaves this null.
   */
  venue?: string | null;
  /**
   * Set on a run that came from OUR OWN collected results rather than RA's page: every run when
   * `source.feed` is 'puntersedge_results', and the newer runs added on top of a stored RA copy
   * (`source.own_runs_added`). 'results' (our own settled results), 'history' (collected
   * afterwards from RA's results page) or 'tabtouch' (the TABtouch results backfill). Null on a
   * run read from RA's page.
   */
  origin?: string | null;
  /** RA's compressed track code as published ('W FM' is Warwick Farm, 'RAND' Randwick). */
  track?: string | null;
  /** RA meeting code; every runner in the same meeting shares it. */
  meet_code?: string | null;
  race_number?: number | null;
  /**
   * True for an unofficial run, a barrier trial or a jump-out: $0 prize, 0kg weights and no
   * market are how RA publishes them. Not a race start; RA's `career` does not count them.
   * Jump-outs read false before 2026-10-26.
   */
  trial: boolean;
  /**
   * 'barrier_trial' or 'jump_out' when `trial` is true (RA's T and J flags in `result_raw`),
   * else null.
   */
  trial_kind?: string | null;
  position?: number | null;
  field_size?: number | null;
  /** The position cell as published, kept for rows that don't parse to a number. */
  result_raw?: string | null;
  distance_m?: number | null;
  /** Condition word: Firm, Good, Soft, Heavy, Synthetic. */
  going?: string | null;
  /** The number after the condition (Soft7 -> 7). Null where RA prints none. */
  going_rating?: number | null;
  /** RA's official class string for that race: 'MDN-SW', 'CTRY MDN', 'BM64', '3Y MDN-TRL'. */
  race_class?: string | null;
  prize_total?: number | null;
  /** This horse's cut, when RA shows it. */
  prize_won?: number | null;
  jockey?: string | null;
  /** RA's stable jockey code, consistent across every page that names the same rider. */
  jockey_code?: string | null;
  /**
   * Trainer of the day for THIS run, filled from our own results archive — RA's form table never
   * names the trainer per run. Populated for runs from 2026-09-01 onward (the archive's
   * full-runner floor) and NULL before that; `profile.trainer` is the horse's current trainer,
   * which is usually but not always the same person.
   */
  trainer?: string | null;
  weight_kg?: number | null;
  barrier?: number | null;
  /** Official race time in seconds. */
  time_s?: number | null;
  /** The published closing sectional's distance, usually 600. */
  sectional_distance_m?: number | null;
  sectional_time_s?: number | null;
  /** Margin in lengths. On this horse's own win it is the winning margin over the runner-up. */
  margin_l?: number | null;
  /** Position in running at the published marks (800m/400m). */
  pir?: RunPIR[];
  /** The published price path, opening quote through SP, oldest first. */
  prices?: number[];
  /** Starting price — the last entry of `prices`. */
  sp?: number | null;
  /**
   * The two nearest finishers RA lists (2nd and 3rd on this horse's win; the winner and
   * runner-up otherwise), each with its own ra: code.
   */
  placegetters?: RunPlacegetter[];
}

export interface HorseRunRow {
  /**
   * Sydney calendar date of the race; the London date for a British or Irish race
   * (/v1/racing/form, 2026-10-12).
   */
  date?: string | null;
  /** Scheduled start, UTC. */
  start_time?: string | null;
  venue?: string | null;
  race_number?: number | null;
  distance_m?: number | null;
  race_name?: string | null;
  /** As published for the meeting, e.g. 'Good 4'. */
  track_condition?: string | null;
  /** Saddlecloth number. */
  number?: number | null;
  /** Barrier. Null on a scratching — a runner that never jumped has no barrier. */
  box?: number | null;
  /**
   * Finishing place. Null when the horse did not start (see `status`) or started and did not
   * finish (see `abnormal`).
   */
  position?: number | null;
  /** `ran` or `scratched`, exactly as /v1/racing/results publishes it. */
  status?: string | null;
  /**
   * Racing Australia's own Finish cell whenever it is not a number, passed through verbatim
   * (Fell, PulledUp, TailedOff, LR, FF, LP, and 'SB' for scratched at the barrier). THERE IS NO
   * CLOSED LIST — an unseen code reaches you unchanged. Read it with `status`.
   */
  abnormal?: string | null;
  /** Lengths behind the winner as RA printed it ('0.75L'); null where it prints none. */
  margin?: string | null;
  /**
   * The horse's own time in seconds, which RA publishes for the WINNER only: since 29 September
   * 2026 a position-1 run carries the race time from RA's race header (the same value as
   * `race_time_s`); every other run's is null, because RA's results table prints no per-runner
   * time and a beaten horse's time is not the race time. Null on runs stored before then until
   * that meeting is re-read.
   */
  time_s?: number | null;
  /** Official starting price, decimal return on $1. Null = unknown, never zero. */
  sp?: number | null;
  /** RA's favouritism marker: 'F' favourite, 'EF' equal favourite; null otherwise. */
  sp_note?: string | null;
  dead_heat?: boolean;
  /** Trainer of the day for THIS run, as the result published it. */
  trainer?: string | null;
  /** Rider of the day for THIS run. */
  jockey?: string | null;
  /** Horses that ran in that race. */
  field_size?: number | null;
  /**
   * Allotted weight in kg, as RA's results page prints it. Kept since 28 September 2026. On
   * origin tabtouch runs, and on runs from 10 August to 27 September 2026 whose result lacked
   * one, it is the weight TABtouch's race page printed for the starter. Null on a scratching and
   * where neither source had one.
   */
  weight_kg?: number | null;
  /**
   * Weight the horse actually carried, printed by RA only when it differs from the allotted
   * weight ('58kg (cd 56kg)'): usually an apprentice's claim (under), sometimes a rider's
   * overweight (over), so do not assume the sign. Null when RA printed none; read
   * coalesce(carried_kg, weight_kg) for what was carried.
   */
  carried_kg?: number | null;
  /**
   * The race's class as RA's own leading conditions term -- 'Maiden', 'BenchMark 64', 'Class 1',
   * 'Group 1' -- mechanical, never inferred, on runs stored since 28 September 2026 and on
   * origin history runs. On origin tabtouch runs, and on runs from 10 August to 27 September
   * 2026, it is TABtouch's class line as printed -- 'BM58 HCP', 'MDN-SW', 'GROUP 1 3UP HCP' --
   * so normalise the two wordings before comparing classes across runs. Null where neither
   * source had one.
   */
  race_class?: string | null;
  /**
   * The race's winning time in seconds, from RA's race header ('Time: 0:58.69' -> 58.69). The
   * same on every run of that race. Kept since 29 September 2026: null on a run stored before
   * then until that meeting is re-read.
   */
  race_time_s?: number | null;
  /**
   * The race's last-600m time in seconds, from the same header ('Last 600m: 0:34.49' -> 34.49)
   * -- the leader's closing sectional as RA times it, a RACE figure, not this horse's own. Kept
   * since 29 September 2026.
   */
  last_600m_s?: number | null;
  /**
   * Total prize money of the race in AUD, from RA's prize line ('Of $30,000.'). Kept since 29
   * September 2026.
   */
  prize_total?: number | null;
  /**
   * Place money this horse won in AUD, read off the same prize line by its finishing place ('1st
   * $15,000, 2nd $5,300, ...'); dead-heaters share the places they tie for equally. 0 for a
   * finish outside the places RA lists as paid; null for a horse with no finishing place
   * (scratched, fell) or a race whose prize line was not read. Excludes bonuses and welfare-fund
   * amounts. Kept since 29 September 2026.
   */
  prize_won?: number | null;
  /**
   * The Racing Australia code our results collector published for this run, from race day — the
   * same value on the matching /v1/racing/results runner and in the archives for that race.
   * Racing Australia issues a new code for the same horse each day, so it differs from run to
   * run: group a horse's runs on `horse_ref`, not on this.
   */
  runner_ref?: string | null;
  /**
   * The horse this run belongs to: `pe:<name>`, the registered name folded to letters and
   * digits. Identical on every run of the same horse, and the same value /v1/racing/results
   * runners and placings, the live board, the closing-line and price-path archives and
   * /v1/racing/horses/form carry — the key that joins a horse across meetings, where
   * `runner_ref` joins the rows about one race.
   */
  horse_ref?: string | null;
  /**
   * Id of the /v1/racing/results row this run came from. A run with origin 'history' or
   * 'tabtouch' carries a synthetic 'hist:...' id that joins to /v1/racing/results on nothing.
   */
  result_id?: string | null;
  /**
   * 'results' -- from our own settled results (/v1/racing/results). 'history' -- collected
   * afterwards from Racing Australia's results page for a race held before our live results
   * began: same fields, no /v1/racing/results row behind it. 'tabtouch' -- collected afterwards
   * from TABtouch's public race page for a race older than Racing Australia's results pages
   * reach (about fifteen months back): number, rider, barrier, weight, trainer and the first
   * four placings, so position null there means unplaced; no margin, time or sp.
   */
  origin?: string | null;
}

export interface HorseRunsOut {
  /** The horse's name as our results spell it. */
  horse: string;
  /** The identity the runs were grouped on (letters and digits). */
  name_key: string;
  /**
   * `name_key` as the identifier every thoroughbred surface publishes: `pe:<name_key>`. Pass it
   * back here, or to /v1/racing/horses/form, and read it off /v1/racing/results runners and
   * placings, the live board and the closing-line and price-path archives to gather one horse
   * across meetings.
   */
  horse_ref?: string | null;
  /**
   * Every Racing Australia horsecode our results published under this name, sorted. Several is
   * normal, not an error — see `runs[].runner_ref`.
   */
  runner_refs: string[];
  /**
   * STARTS held for this horse since `source.coverage_from`: runs with `status` `ran`, the same
   * count as `stats.starts`. A scratching is not a start. Before 2026-10-13 this counted every
   * held row, scratchings included; that count is `held_rows_total`.
   */
  runs_total: number;
  /**
   * Every row held for this horse since `source.coverage_from`, scratchings included. `runs` is
   * the newest `limit` of THESE rows, so page on this, not on `runs_total`. Measured on
   * 2026-10-12, 61,719 of the store's 282,639 rows (21.8%) were scratchings.
   */
  held_rows_total: number;
  runs: HorseRunRow[];
  /** Over EVERY held run, not just the ones returned. */
  stats: HorseRunsStats;
  source: RunsSourceBlock;
}

export interface HorseRunsStats {
  /**
   * Runs with status `ran` — scratchings are excluded from every figure here. Equal to
   * `runs_total` since 2026-10-13; `held_rows_total` counts the scratchings too, which is why it
   * can be higher.
   */
  starts: number;
  wins: number;
  /** Finishes in the first three, wins included. */
  places: number;
  win_pct: number;
  place_pct: number;
}

export interface HorseSource {
  /**
   * 'racing_australia' -- Racing Australia's own form page (profile, career, full run lines).
   * 'puntersedge_results' -- RA was not serving this horse's page and no stored copy existed, so
   * `runs` is the horse's record in OUR OWN collected results instead; `profile` and `career`
   * are then null, and `note` says what the runs cover.
   */
  feed?: string;
  /**
   * Set with feed 'puntersedge_results': what these runs are, and what they are not. Also set
   * when `own_runs_added` is above 0.
   */
  note?: string | null;
  region?: string;
  sport?: string;
  /**
   * UTC time this horse's page was last read from RA. With feed 'puntersedge_results' (since
   * 2026-10-26; null before): the UTC time these runs were read from our own results store,
   * which is rebuilt hourly — `coverage_to` says how far it reaches.
   */
  fetched_at?: string | null;
  /**
   * True when RA could not be reached just now and this is the stored copy served past its
   * six-hour refresh window. Runs the horse has had since that copy was read are added from our
   * own results — see `own_runs_added`.
   */
  stale?: boolean;
  /**
   * Runs from OUR OWN collected results added at the top of `runs` because they are newer than
   * the stored RA page (each carries `venue` and `origin`; RA fields we do not collect are
   * null). `career` and `profile` are still as of `fetched_at` and do not include them. 0 when
   * the page is current.
   */
  own_runs_added?: number;
  /** Feed 'puntersedge_results' only: Sydney date of the latest race in our own results store. */
  coverage_to?: string | null;
}

export interface IntelOut {
  race: IntelRaceOut;
  /**
   * Whether the 60-minute capture window is open for this race, when its first tick landed, and
   * which marks could be evaluated.
   */
  window?: Record<string, unknown>;
  method: Record<string, unknown>;
  /**
   * Race level: best-price market percentage now and at T-15 / T-60, the favourite now and at
   * T-10, and the books behind the consensus.
   */
  market?: Record<string, unknown>;
  /**
   * One object per runner, favourite first: consensus at each mark with high and low,
   * time-anchored moves, breadth, first mover and the signal class.
   */
  runners?: Record<string, unknown>[];
  scratchings?: Record<string, unknown>[];
  note?: string | null;
}

export interface IntelRaceOut {
  race_id: string;
  venue?: string | null;
  race_number?: number | null;
  category?: string | null;
  country?: string | null;
  start_time?: string | null;
  secs_to_jump?: number | null;
  /** upcoming · jumped. */
  status?: string;
  as_of: string;
}

export interface KeyResendIn {
  email: string;
}

export interface LinesArbOut {
  event_id: string;
  sport_key: string;
  home_team: string | null;
  away_team: string | null;
  commence_time: string;
  market_type: string;
  opportunities: Record<string, unknown>[];
}

export interface MarketBestOut {
  number?: number | null;
  name?: string | null;
  runner_ref?: string | null;
  price: number;
  bookmaker: string;
}

export interface MarketBookOut {
  key: string;
  runners_quoted: number;
  /**
   * Sum of 1/price across this book's quoted runners, as a percentage. Null when fewer than two
   * runners are quoted, where the figure would describe nothing.
   */
  overround_pct?: number | null;
  /** Newest price change this book made on this race, UTC. */
  observed_at?: string | null;
  runners?: MarketRunnerOut[];
}

export interface MarketOut {
  /** win · place · top2 · top3 · top4. */
  market: string;
  /**
   * Runners the bet covers: 1 for win, the race's places_paid for place, 2/3/4 for the Same Race
   * Multi legs. Null when the race never reported places_paid.
   */
  places?: number | null;
  bookmakers?: MarketBookOut[];
  best?: MarketBestOut[];
  /**
   * Quotes kept out of `best` (since 2026-10-20) by the same rules as /v1/racing/best-odds
   * `suspect_win`: each entry is number, name, bookmaker, price, and either `consensus` alone (a
   * placeholder price, 4x or more the median of the other books) or a `reason` (pre_scratching,
   * book_under_round, book_not_repriced) with the figure behind it. The quote itself is still
   * listed under `bookmakers`.
   */
  suspect?: Record<string, unknown>[];
}

export interface MarketRunnerOut {
  /** Saddlecloth number (box for greyhounds). */
  number?: number | null;
  name?: string | null;
  /** Registry id — ra:<horsecode> or grv:<dogId> — where one is known. */
  runner_ref?: string | null;
  /** pe:<name>, the stable thoroughbred identity. Null off AU thoroughbreds. */
  horse_ref?: string | null;
  price: number;
  /**
   * The book's own page for this race. Present while the market is open (source is live); null
   * on a race answered from the stored close, which keeps the prices and the runner identities
   * but not the links.
   */
  source_url?: string | null;
  /**
   * Your own link for this price: source_url built through the link templates stored with PUT
   * /v1/link-templates (since 2026-10-14). Absent when your account stores none, or there is
   * nothing to link.
   */
  source_link?: string | null;
}

export interface MarketSummaryOut {
  rows_returned: number;
  /** Rows matching the filter before limit/offset. */
  total_rows: number;
  limit: number;
  offset: number;
  /**
   * Earliest start_time in the table. The summary is built from the 45-day tick store, so it
   * begins where that store stood when the job first ran.
   */
  summary_from?: string | null;
  /** Set when the caller's plan clamps the lookback. NULL means the whole table. */
  window_days?: number | null;
  rows: Record<string, unknown>[];
}

export interface MarketingIn {
  opt_in: boolean;
}

export interface MarketsOut {
  race: RaceHeadOut;
  markets?: MarketOut[];
  exotics?: ExoticsOut | null;
  note?: string | null;
  /**
   * Per book and runner, the fields the book publishes beside its prices (since 2026-09-29):
   * open_price (the book's own opening price), flucs (its fluctuations, most recent first),
   * tote_win / tote_place (its tote dividends by product code; PROV is an indicative pre-race
   * dividend), boost_price / boost_type, and the exchange fields. Each entry carries bookmaker,
   * number, name, runner_ref, seen_at (UTC, when the fields were read) and only the fields that
   * book carries.
   */
  quote_detail?: Record<string, unknown>[];
  /**
   * The race's scratched runners: name, number, barrier, scratched_at (the scratching book's own
   * time, UTC), vacant for an empty box. Read from the open race while it is live and from the
   * capture taken at the jump once it has been purged (from 2026-09-29).
   */
  scratchings?: Record<string, unknown>[];
  /**
   * Per book and runner, the book's tote approximates at fixed marks before the jump (since
   * 2026-10-06): points at 3600, 1800, 900, 600, 300, 180, 120 and 60 seconds, each the first
   * read the capture saw at or inside its mark: mark_seconds, read_at (UTC), secs_to_jump, and
   * tote_win / tote_place by product code (PROV is an indicative pre-race dividend). The last
   * read before the jump is tote_win / tote_place in quote_detail.
   */
  tote_series?: Record<string, unknown>[];
  /**
   * Per book and scratched runner (since 2026-10-06): reported_at, the first time that book's
   * own feed listed the scratching; book_scratched_at, the scratch time the book itself states,
   * where it carries one; first_quoted_at / last_quoted_at, when that book's feed still carried
   * a win price for the runner after the race's scratchings named it, to the minute, with
   * last_quoted_win (for a book that flags the scratching itself, recorded once at the flag: its
   * price at the scratching). All UTC. Never served as a price.
   */
  book_scratchings?: Record<string, unknown>[];
}

export interface MoverOut {
  venue: string | null;
  race_number: number | null;
  category: string | null;
  country: string | null;
  start_time: string;
  mins_to_jump?: number | null;
  runner: string;
  number?: number | null;
  direction: string;
  open_price: number;
  current_price: number;
  move_pct: number;
  /** Books with a price for this runner, including ones we have never observed move. */
  books_quoting: number;
  /**
   * Books with two or more captured prices — the only ones that can evidence a move. The
   * consensus and the `min_books` gate use THIS count, not `books_quoting`.
   */
  books_with_history: number;
  books_firming: number;
  books_drifting: number;
  /**
   * Books whose captured price has not moved, including books seen only once. books_firming +
   * books_drifting + books_unchanged == books_quoting.
   */
  books_unchanged: number;
  bookmakers: Record<string, unknown>[];
}

export interface NextRaceOut {
  race_id: string;
  source_id: string | null;
  venue: string | null;
  /**
   * Stable slug for this venue spelling ('sandown-hillside'). Spelling variants of one venue
   * share one id.
   */
  venue_id?: string | null;
  /** Canonical display name for venue_id ('Sandown Hillside'). */
  venue_canonical?: string | null;
  /**
   * Physical-complex key: tracks sharing one venue complex share one site ('sandown' covers
   * Sandown, Sandown Hillside, Sandown Lakeside and the Sandown Park greyhound track).
   */
  venue_site?: string | null;
  race_number: number | null;
  category: string | null;
  start_time: string;
  country: string | null;
  race_name?: string | null;
  distance_m?: number | null;
  track_condition?: string | null;
  weather?: string | null;
  /**
   * Places the race pays, as the bookmaker supplying it states. For British and Irish races this
   * is the each-way terms' place count (2 or 3, 4 on a 16-plus handicap) and the UK books'
   * place_price is derived from the same terms; for Australian races it is the quoted place
   * market's count. Null when no bookmaker on the race supplies it.
   */
  places_paid?: number | null;
  /**
   * UTC instant of the most recent logged track-condition, weather or rail transition for this
   * race's meeting — Racing Australia's re-published rating or a bookmaker's race page moving
   * between two of our polls. Null when nothing has changed since we began watching the meeting.
   * /v1/racing/track-conditions serves the sequence.
   */
  track_condition_changed_at?: string | null;
  /**
   * The first term of RA's official conditions line for this race ('BenchMark 64', 'Maiden',
   * 'Group 1'). AU thoroughbred only; null elsewhere.
   */
  race_class?: string | null;
  /**
   * RA's official conditions line, verbatim — class, race type, minimum weight, age/sex
   * restrictions, claiming allowances.
   */
  conditions?: string | null;
  /** Total advertised prize for the race, whole units of `prize_currency` (AUD). */
  prize_total?: number | null;
  /**
   * ISO 4217 currency of `prize_total` ('AUD'). Null exactly when `prize_total` is null. Added
   * 2026-10-26.
   */
  prize_currency?: string | null;
  /** Rail position for the meeting, as RA publishes it ('+3m Entire'). AU thoroughbred only. */
  rail?: string | null;
  /**
   * Racing Australia's own name for the course this race runs on, verbatim: 'Hillside' at
   * Sandown, 'Randwick' vs the Kensington inner course, 'Main' elsewhere. Combine with
   * venue_site to tell dual-course meetings apart. AU thoroughbred only; null elsewhere.
   */
  track_name?: string | null;
  /**
   * UTC time at which the market was FIRST seen shut — the book stopped taking bets on this
   * race. Poll-observed: this is the first poll that saw the state, not the exact instant, so it
   * lands up to one polling pass after it, and passes are most frequent in the minutes before
   * the jump. Set once: a market that flickers SUSPENDED -> OPEN -> SUSPENDED keeps the FIRST
   * suspension. TWO SOURCES report market state. PointsBet closes its book at the real jump —
   * measured 2026-09-03 over 9 live races followed across their jump, 0.2 to 1.4 minutes AFTER
   * the advertised start on AU/NZ cards — and the Betfair Exchange reports it while it quotes
   * the market, which is until about two minutes before the jump. `market_state_source` names
   * the one that produced this value. Exchange-sourced stamps are withheld from customer plans,
   * so a race seen shut only by the exchange reads null. Bookmaker-sourced stamps are served to
   * everybody. Null also means no feed observed a transition — it never means the market stayed
   * open.
   */
  market_closed_at?: string | null;
  /**
   * UTC time at which the race was FIRST seen in-play — the actual off, as opposed to
   * `start_time`, which is the ADVERTISED off and moves. Same poll-observed, set-once semantics
   * as `market_closed_at`, and withheld on the same source rule. Reported by the Betfair
   * Exchange only: bookmakers do not run racing in-play, so a bookmaker feed says when it CLOSED
   * its book, not when the race went. For a race the exchange has stopped quoting,
   * `market_closed_at` from a bookmaker is the closest measured instant to the off.
   */
  inplay_at?: string | null;
  /**
   * Which feed's market state produced `market_closed_at` / `inplay_at` on this race —
   * 'pointsbetau' for the bookmaker, 'betfair_ex_au' for the exchange. Set once, alongside the
   * first stamp. Null when no transition has been observed, and null for customer plans whenever
   * the stamps themselves are withheld, so a non-null value here is always the provenance of
   * values you can see.
   */
  market_state_source?: string | null;
  scratchings?: Record<string, unknown>[];
  runners: Record<string, unknown>[];
  /**
   * North American tote odds for this race, from TVG's public race board (US and Canadian
   * thoroughbred, quarter horse and harness), or null. A tote is a pool, not a bookmaker, so it
   * sits here and never in a runner's `bookmakers`, best_win or any bookmaker count. `runners[]`
   * carries per betting interest `morning_line` (the track's line, set before betting) and
   * `win_odds` (the host tote's current odds-to-1), each as TVG sends it ('5/2') and as a
   * decimal price (`morning_line_decimal`, `win_decimal` = 1 + odds, so 5/2 is 3.5), plus
   * `win_pool`, that runner's WIN pool money in USD. `win_odds` is null until the WIN pool opens
   * (`pools_open`) and on a scratched runner. Pre-race the odds are an estimate of the win
   * payoff: a tote pays what the pool pays when it closes. `status` is open, off or official;
   * `final` marks the odds the race settled on (read once it is official). `read_at` is our read
   * of TVG. Null on a race no TVG race links to, which is every race outside the US and Canada.
   * Added 2026-10-27.
   */
  tote?: Record<string, unknown> | null;
  /**
   * Age in seconds of the OLDEST bookmaker quote in this race — the staleness you are exposed to
   * if you act on any price here. Since 2026-08-15 this is the worst leg, not the freshest;
   * `freshest_age_seconds` carries the best-case figure.
   */
  data_age_seconds?: number | null;
  /** Age in seconds of the freshest bookmaker quote in this race. */
  freshest_age_seconds?: number | null;
  /**
   * Which refresh rule this race is on, and therefore what the race-level `stale` means. `live`
   * = inside 3 hours of the jump: books re-price it on every 8-20s poll, and `stale` fires past
   * 120 seconds. `card` = further out: books re-price it about every 15 minutes so a full day
   * fits inside their rate limits, and `stale` fires past 1800 seconds. Every published quote
   * carries ITS OWN `refresh_tier`, and it can be `card` on a `live` race: Betr's upstream
   * rate-limits us, so that book stops re-pricing every poll 30 minutes before the jump rather
   * than 3 hours (PlayUp, on a 6-requests-a-minute budget, at 6 minutes), and its quotes between
   * there and 3 hours are refreshed every 5-15 minutes, published as `card`, and judged against
   * 1800 seconds (since 2026-09-07; before that they were marked stale). A book's tier is never
   * tighter than its race's. `age_seconds` is the TRUE age in every case — only the threshold
   * changes.
   */
  refresh_tier?: string;
  /**
   * True when the oldest contributing bookmaker is older than this race's `refresh_tier`
   * threshold — 120s on `live`, 1800s on `card`. It does NOT mean the whole race is dead — read
   * `stale_bookmakers` and each bookmaker's own `stale`/`age_seconds`.
   */
  stale?: boolean;
  /**
   * Bookmaker keys in this race whose quote is older than the `refresh_tier` threshold (120s
   * live, 1800s card).
   */
  stale_bookmakers?: string[];
  cached?: boolean | null;
  cache_age_seconds?: number | null;
}

export interface OnboardingIn {
  route?: string | null;
  skipped?: boolean;
}

export interface OnboardingOut {
  route?: string | null;
  route_label?: string | null;
  route_source?: string | null;
  skipped?: boolean;
  routes: Record<string, unknown>;
  checklist: ChecklistStep[];
  complete: boolean;
  rules: Record<string, unknown>;
}

export interface OverageIn {
  /**
   * true lets this account run past its monthly allowance, up to the ceiling, and be invoiced
   * for the excess. false restores the hard 402 at the allowance.
   */
  enabled: boolean;
}

export interface OverageOut {
  enabled: boolean;
  eligible: boolean;
  rate_per_1000_cents: number;
  max_credits: number;
  ceiling: number;
  credits_over_this_period: number;
  estimated_cents_this_period: number;
  plan: string;
  credits_limit: number;
  credits_used: number;
}

export interface PasswordLoginIn {
  email: string;
  password: string;
}

export interface PremiershipOut {
  role: string;
  season_start_year?: number | null;
  /** Echo of the filter; null when a name search crossed all states. */
  state?: string | null;
  scope?: string | null;
  name?: string | null;
  rows?: PremiershipRow[];
  source: PremiershipSource;
}

export interface PremiershipRow {
  /** AUS is the national table — RA's own combined leaderboard, not a sum of the state rows. */
  state: string;
  /** RA's split: all, metro, provincial, country or picnic. */
  scope: string;
  /** Position in RA's table, 1-20. */
  rank: number;
  name: string;
  /**
   * RA's stable code from the row's engagement link — the same namespace as trainer_code on
   * acceptance data and jockey_code on /v1/racing/horses/form runs, so rows join on identity,
   * not name spelling.
   */
  ra_code?: string | null;
  /** Wins. REAL, not int: dead heats appear as halves in some tables (RA prints 23½). */
  firsts?: number | null;
  seconds?: number | null;
  thirds?: number | null;
  fourths?: number | null;
  fifths?: number | null;
  /** Season prize money, AUD. */
  prize_money?: number | null;
  /** RA's own figure, percent. */
  strike_rate?: number | null;
  starts?: number | null;
  /** Start of the window this row measures (RA seasons run 1 Aug to 31 Jul). */
  period_from?: string | null;
  /**
   * End of the measured window. On the running season this is the day RA rendered the table,
   * which makes it the per-row freshness stamp: rows from a table scraped two nights ago carry
   * that day, not today.
   */
  period_to?: string | null;
}

export interface PremiershipSource {
  feed?: string;
  region?: string;
  sport?: string;
  /**
   * UTC time of the newest row served in this response. For the usual single-table lookup (a
   * `state` + `scope`) every row comes from one scrape, so this IS that table's age. A `name`
   * search spans tables scraped on different nights, so there read it as the freshest of them
   * and use `period_to` for the age of each individual row.
   */
  scraped_at?: string | null;
  /**
   * RA publishes each premiership as a top-20 table. Absence from `rows` means outside the top
   * 20, never inactivity.
   */
  top_n?: number;
}

export interface PriceHistoryOut {
  race_id: string;
  venue: string | null;
  venue_id?: string | null;
  venue_canonical?: string | null;
  venue_site?: string | null;
  race_number: number | null;
  category: string | null;
  country: string | null;
  start_time: string;
  points_returned: number;
  truncated: boolean;
  /**
   * Start time of the earliest race this endpoint can answer for. Since 2026-09-01 races older
   * than the ~45-day live window are served from the permanent archive, so this floor is fixed
   * at capture start (2026-08-04) and history only deepens.
   */
  history_from?: string | null;
  runners: Record<string, unknown>[];
}

export interface PricePathsOut {
  rows_returned: number;
  /** Points matching the filter before limit/offset */
  total_points: number;
  limit: number;
  offset: number;
  archive_from?: string | null;
  rows: Record<string, unknown>[];
}

export interface RaceEventOut {
  race_id: string;
  venue: string | null;
  venue_id?: string | null;
  venue_canonical?: string | null;
  venue_site?: string | null;
  race_number: number | null;
  category: string | null;
  start_time: string;
  country: string | null;
  race_name?: string | null;
  distance_m?: number | null;
  track_condition?: string | null;
  weather?: string | null;
  /**
   * The first term of RA's official conditions line ('BenchMark 64', 'Maiden', 'Group 1'). AU
   * thoroughbred only.
   */
  race_class?: string | null;
  /** RA's official conditions line, verbatim. */
  conditions?: string | null;
  /** Total advertised prize, whole units of `prize_currency` (AUD). */
  prize_total?: number | null;
  /**
   * ISO 4217 currency of `prize_total` ('AUD'). Null exactly when `prize_total` is null. Added
   * 2026-10-26.
   */
  prize_currency?: string | null;
  /** Rail position for the meeting, as RA publishes it. */
  rail?: string | null;
  /**
   * RA's own name for the course this race runs on ('Hillside', 'Randwick', 'Main'). AU
   * thoroughbred only; null elsewhere.
   */
  track_name?: string | null;
  /**
   * UTC instant of the most recent logged track-condition, weather or rail transition for this
   * race's meeting; null when nothing has changed since we began watching it. The sequence is on
   * /v1/racing/track-conditions.
   */
  track_condition_changed_at?: string | null;
  /**
   * Set when the race row is created and revised exactly once, if at all: to 'abandoned' when
   * Racing Australia posts an official abandoned, postponed or transferred notice for the
   * meeting (2026-09-06). Otherwise it reads 'open' for every race in this window. It is not a
   * live market-state signal - /v1/racing/results carries the settled status (interim, final,
   * abandoned).
   */
  status?: string | null;
  /**
   * Scratched runners for this race: {name, number, barrier, scratched_at, late, emergency}.
   * `scratched_at` (UTC) is the book's own stamp where it sends one (Ladbrokes, Neds, BetRight)
   * and Racing Australia's official scratching sheet otherwise (AU thoroughbreds, read
   * two-hourly); absent when neither knows. `late` marks a late scratching, `emergency` an
   * emergency that did not gain a start. Merged across every book that reports one. Greyhound
   * cards also carry box-vacancy placeholders here (a literal '....' or 'Vacant Box'), which are
   * the reporting book naming an empty box rather than a withdrawn runner; match on `number` and
   * treat a name from that set as a vacant box.
   */
  scratchings?: Record<string, unknown>[];
  /**
   * Betting-market state (OPEN, SUSPENDED, CLOSED). Reported by PointsBet, which sends CLOSED
   * when it shuts its book at the jump, and by the Betfair Exchange, which is withheld from
   * customer responses pending a data licence — so a value last written by the exchange reads
   * null. Most races are quoted by both: the exchange holds the state until about two minutes
   * before the jump, PointsBet reports the close.
   */
  market_status?: string | null;
  /**
   * True once the market is in-play. Exchange-only — bookmakers do not run racing in-play — so
   * it carries the same licence hold as `market_status` and reads null for customers.
   */
  inplay?: boolean | null;
  /**
   * UTC time at which the market was FIRST seen shut — the book stopped taking bets on this
   * race. Poll-observed: this is the first poll that saw the state, not the exact instant, so it
   * lands up to one polling pass after it, and passes are most frequent in the minutes before
   * the jump. Set once: a market that flickers SUSPENDED -> OPEN -> SUSPENDED keeps the FIRST
   * suspension. TWO SOURCES report market state. PointsBet closes its book at the real jump —
   * measured 2026-09-03 over 9 live races followed across their jump, 0.2 to 1.4 minutes AFTER
   * the advertised start on AU/NZ cards — and the Betfair Exchange reports it while it quotes
   * the market, which is until about two minutes before the jump. `market_state_source` names
   * the one that produced this value. Exchange-sourced stamps are withheld from customer plans,
   * so a race seen shut only by the exchange reads null. Bookmaker-sourced stamps are served to
   * everybody. Null also means no feed observed a transition — it never means the market stayed
   * open.
   */
  market_closed_at?: string | null;
  /**
   * UTC time at which the race was FIRST seen in-play — the actual off, as opposed to
   * `start_time`, which is the ADVERTISED off and moves. Same poll-observed, set-once semantics
   * as `market_closed_at`, and withheld on the same source rule. Reported by the Betfair
   * Exchange only: bookmakers do not run racing in-play, so a bookmaker feed says when it CLOSED
   * its book, not when the race went. For a race the exchange has stopped quoting,
   * `market_closed_at` from a bookmaker is the closest measured instant to the off.
   */
  inplay_at?: string | null;
  /**
   * Which feed's market state produced `market_closed_at` / `inplay_at` on this race —
   * 'pointsbetau' for the bookmaker, 'betfair_ex_au' for the exchange. Set once, alongside the
   * first stamp. Null when no transition has been observed, and null for customer plans whenever
   * the stamps themselves are withheld, so a non-null value here is always the provenance of
   * values you can see.
   */
  market_state_source?: string | null;
  /**
   * TVG's race key (tvg_<track>_<date>_<n>) on a US or Canadian race, the same key
   * /v1/racing/tote and /v1/racing/results use; it stays the same when a bookmaker starts
   * pricing a tote-only race and `race_id` changes to the priced race's. Null outside North
   * America and on a priced race TVG has not linked. Added 2026-10-27.
   */
  tote_race_id?: string | null;
  /**
   * True on a North American race no bookmaker prices: it comes from TVG's race board, its
   * `race_id` is TVG's race key (tvg_<track>_<date>_<n>, the key /v1/racing/tote and
   * /v1/racing/results use), and price-history and next-to-go have nothing for it. Listed only
   * when `country` names US or CA, and only for the current US race day (TVG's board). False on
   * every other race. Added 2026-10-27.
   */
  tote_only?: boolean;
}

export interface RaceHeadOut {
  race_id: string;
  venue?: string | null;
  race_number?: number | null;
  category?: string | null;
  country?: string | null;
  start_time?: string | null;
  places_paid?: number | null;
  /** upcoming · jumped · resulted. */
  status: string;
  /**
   * live (read from the open market) or closes (read from the stored last observation before the
   * jump).
   */
  source: string;
}

export interface RaceResultOut {
  /**
   * Race id, joinable to /v1/racing/price-history and (while the race is still open)
   * /v1/racing/next-to-go. Null if the race cannot be resolved in the price-history store.
   */
  race_id?: string | null;
  /** Start time of the earliest result currently retained. */
  coverage_from?: string | null;
  venue: string | null;
  venue_id?: string | null;
  venue_canonical?: string | null;
  venue_site?: string | null;
  race_number: number | null;
  category: string | null;
  country: string | null;
  start_time: string;
  race_name?: string | null;
  distance_m?: number | null;
  track_condition?: string | null;
  /**
   * Track condition word, normalised: Good, Soft, Heavy, Firm, Fast, Synthetic. Parsed from
   * `track_condition` with the same helper /v1/racing/horses/form uses, so the two surfaces
   * agree. Null when `track_condition` is null or unparseable; `track_condition` remains the raw
   * string exactly as the source published it.
   */
  going?: string | null;
  /**
   * Numeric going rating 1-12 (the 4 in 'Good (4)'), or null. NULL IS THE MAJORITY CASE, not an
   * exception for two rare words: most stored conditions are a bare word carrying no number at
   * all. Measured 2026-09-10 across all 5,579 stored results, a bare 'Good' is 3,954 rows (71%)
   * and yields null, so a rating is present on roughly 29% of rows — greyhound and other
   * non-thoroughbred meetings publish an unrated word as a rule. A rating is never guessed from
   * the word ('Synthetic', 67 rows, and 'Firm', 0 rows, never carry one). Separately, 205 rows
   * store the four-character STRING 'None' in `track_condition`: `going` and `going_rating` are
   * both null on those, while `track_condition` still serves that literal string, because
   * `track_condition` is the raw source value passed through untouched.
   */
  going_rating?: number | null;
  weather?: string | null;
  /**
   * Places the race paid, from the bookmakers' own terms at the close: for British and Irish
   * races the each-way place count (2 or 3, 4 on a 16-plus handicap) of the UK-licensed books,
   * for Australian and New Zealand races the Australian books' place market, for South African
   * races the South African books'. It is the count most of those books paid; a tie takes the
   * lower count, the standard terms. A book running an extra-place offer is visible in
   * `places_paid_by_book`. It is the bookmakers' terms, not an official placings figure. Null
   * when no book on the race gave terms, or the result is not linked to a race_id.
   */
  places_paid?: number | null;
  /**
   * {bookmaker_key: places} for every book on the race that gave terms at the close, including
   * books outside the race's own region (an Australian book quoting a British race pays its own
   * terms). Null exactly when `places_paid` is null.
   */
  places_paid_by_book?: Record<string, number> | null;
  /**
   * The first term of Racing Australia's official conditions line ('BenchMark 64', 'Maiden',
   * 'Group 1'), the same value the race card carried. AU thoroughbred only, from the 2026-09-26
   * card; null elsewhere. No source we hold publishes race class for British or Irish races.
   */
  race_class?: string | null;
  /**
   * Racing Australia's official conditions line, verbatim. AU thoroughbred only, from the
   * 2026-09-26 card; null elsewhere.
   */
  conditions?: string | null;
  /**
   * Total advertised prize for the race, whole units of `prize_currency`. AU thoroughbred only
   * (Racing Australia), from the 2026-09-26 card; null elsewhere.
   */
  prize_total?: number | null;
  /** ISO 4217 currency of `prize_total` ('AUD'). Null exactly when `prize_total` is null. */
  prize_currency?: string | null;
  /**
   * interim | final | abandoned. `interim` until the placings have been stable for 30 minutes,
   * then `final`. `abandoned` (2026-09-06) is a race that did NOT run: Racing Australia's
   * official Abandoned & Transferred Meetings notice for that venue and date, applied to every
   * race of the meeting — placings are empty and runners null. Settle only against `final`;
   * treat `abandoned` as a void for settlement purposes.
   */
  status: string;
  /**
   * Only on `abandoned` rows: RA's own word for the non-run — "abandoned", "postponed", or
   * "transferred to <venue>". A postponed or transferred meeting did not run at THIS venue on
   * THIS date; if it ran elsewhere or later it appears as its own result.
   */
  status_note?: string | null;
  /**
   * The placegetters: {position, number, name, win_price, place_price, sp, sp_note, horse_ref}.
   * `win_price` and `place_price` are the SETTLING BOOKMAKER'S FIXED prices. `horse_ref` (added
   * 2026-09-21) is the same `pe:<name>` horse identity the `runners` entries carry, derived at
   * serve time from the name on the placing and present on every placing — null off
   * thoroughbred. It is the key that joins this placing to the same horse on another meeting;
   * `runner_ref` on the matching `runners` entry joins the rows about this race and will not,
   * because Racing Australia issues a new code for the same horse each day. `sp` is the OFFICIAL
   * STARTING PRICE as a decimal return on a $1 stake (4.6 means $4.60), null where it is unknown
   * — never 0. It is the settling market's own price, not our consensus and not a bookmaker's
   * fixed price: thoroughbred SP comes from the Racing Australia results table, greyhound SP
   * from our own collection of published results (Victorian tracks via FastTrack, every other
   * state via the national results pages, both from 2026-09-13), and HARNESS SP IS ALWAYS NULL —
   * no source we hold publishes it. `sp_note` carries Racing Australia's favouritism marker on
   * thoroughbred runners ('F' favourite, 'EF' equal favourite) and is null everywhere else.
   * Coverage RE-MEASURED 2026-09-08 over the whole retained store, counting only rows whose
   * `status` is `ran` (a barrier scratching is not a starter and its price is not in this
   * denominator): 88.6% of thoroughbred starters carry `sp` (2,105 of 2,375); on the greyhound
   * races collected since 2026-09-13, 2,054 of 2,077 Victorian starters do (98.9%) and 4233 of
   * 4596 of the other states' starters do (92.1%), both measured 2026-09-20. The Racing
   * Australia block that held thoroughbred SP at 0% when this was last measured on 2026-09-03
   * has lifted and the collector has been landing meetings since. A null `sp` is unknown, never
   * zero — RA prints no SP at all on some rows. On placings, `sp` is copied from the matching
   * `runners` entry when the response is built, so the two can never disagree. On a race with no
   * `runners` payload the `sp` and `sp_note` KEYS ARE ABSENT from each placing — not present and
   * null. The copy step is what creates them and it is skipped when there is nothing to copy
   * from, so a schema-validating consumer sees a different object shape, not a null: read them
   * with `.get()`. The keys are deliberately NOT normalised in, because adding them here would
   * change the shipped payload of every COMPLETE race too, and nothing may move under a customer
   * mid-integration. `field_status` tells you which case you are in before you look.
   */
  placings?: Record<string, unknown>[];
  /**
   * One entry per runner: {number, box, name, position, status, abnormal, margin, time_s,
   * dead_heat}. Presence in this list is NOT proof the runner started. `status` is what says so,
   * and `status` is what you settle on. ⚠️ COVERAGE. Read `field_status` on the row FIRST — it
   * is the per-race answer, and it is what separates a field that has not been filled yet from
   * one that never will be. Two different facts live here. (1) WHETHER THERE IS A FIELD AT ALL.
   * Measured 2026-09-10 across the whole retained store — 5,577 results, 2,902 of them serving
   * `runners: null`: AU greyhound carried a field on 2,360 of 3,219 races, AU thoroughbred on
   * 315 of 1,104, and AU harness, NZ thoroughbred and NZ harness on none, as no collector
   * covered those three codes then. Since 2026-10-04 TAB New Zealand fills them (`field_source:
   * tabnz`, hourly, seven-day window) and has replaced the board copies described next wherever
   * it could match the race; /v1/racing/results/coverage gives the current share per day, code
   * and venue. FROM 2026-09-29 harness and NZ fields come from the pre-race board (origin:
   * board): driver, trainer, barrier, form; positions only for placegetters; no times, SP or
   * margins. Such a field is copied from the live board when the result is first written, before
   * the board is purged 10 minutes after the jump, so a race whose result landed after the purge
   * still has none. On these entries `"origin": "board"` is set on every entry, `box` holds the
   * barrier (as on thoroughbred entries), `jockey` is the harness DRIVER, `weight_kg` and `form`
   * are what the board showed, `status` is `scratched` for a runner the race's scratchings or
   * `deductions` name and `ran` otherwise, and `position` is set for placegetters ONLY — a null
   * `position` on an `origin: board` entry means 'not a placegetter, or not known', never 'did
   * not finish'. Inside the two supported codes it is not a clean ramp either: each is filled by
   * a scheduled pass, and where that pass cannot match a race with certainty it writes nothing
   * rather than another race's field, so past the fill window 104 of 2,201 AU greyhound races
   * (4.7%) and 44 of 288 AU thoroughbred races (15.3%) keep `runners: null` for good —
   * `field_status: unavailable`, and polling them will not help. `runners` is JSON null in every
   * one of these cases and has never once been an empty array (0 empty arrays in the whole
   * store, measured the same day), so `runners is None` is a safe test and an empty field is not
   * a shape you have to handle. (2) THE SHAPE OF A FIELD THAT IS PRESENT, which is where the
   * 2026-09-08 date belongs. An AU thoroughbred field WRITTEN from 2026-09-08 carries every
   * starter plus every runner Racing Australia printed as scratched; one written before that
   * date carries STARTERS ONLY, because the collector dropped RA's scratched rows and a stored
   * field is never rewritten. Measured 2026-09-08, all 244 thoroughbred fields stored at that
   * point were the old shape and 198 of them publish a `deductions` row for a horse absent from
   * `runners`. So on an older race `deductions` is the list of scratchings and `runners` is the
   * starters; do not read a short `runners` array as a small field. Greyhound fields have
   * carried the whole field since greyhound collection began on the 2026-08-21 Sydney card — but
   * 859 AU greyhound races carry no field at all, which is question (1) and not this one.
   * `position` is the finishing position for every runner that completed the race — not just the
   * placegetters — and is null whenever there is none: the runner did not start, or it started
   * and did not finish (except on an `origin: board` entry, which carries placegetters'
   * positions only — see above). `status` is ran | scratched | late_scratching | reserve (an
   * emergency that never got a start). `abnormal` is the official reason cell, passed through
   * VERBATIM from the source — on AU thoroughbred it is Racing Australia's own Finish cell
   * whenever that cell is not a number. THERE IS NO CLOSED LIST OF CODES and you should not
   * write a match statement that assumes one: the source invents them, and a code nobody here
   * has seen before will reach you unchanged rather than be dropped or renamed. Everything
   * stored to date, with counts as at 2026-09-14: Fell (101), TailedOff (32), SB (25), PulledUp
   * (8), FF (1, Rosehill R4 on 2026-09-12), LP (1). Treat `abnormal` as the authoritative
   * explanation for a missing `position`, and treat an unfamiliar value as a did-not-finish
   * unless `status` says otherwise — which is exactly what this API does: only codes PROVEN to
   * mean the runner never left the barrier flip `status` to `scratched`, and that list currently
   * holds one entry, 'SB'. Anything else stays `ran`, deliberately, because misreading a starter
   * as a non-starter turns a losing bet into a refund. It carries TWO families that settle in
   * OPPOSITE directions, so read it with `status` and never alone. (1) A DID-NOT-FINISH reason
   * on a row whose `status` is `ran` — Fell, PulledUp, Disqualified, TailedOff, StayedInBox, FF
   * and LP are the ones seen so far: the runner started and simply has no finishing position,
   * and a bet on it lost. (2) A DID-NOT-START reason on a row whose `status` is `scratched` —
   * 'SB', Racing Australia's code for scratched at the barrier: the runner was taken out of the
   * market before the jump, so `position` is null, it is in no `placings` entry, and bets on it
   * were refunded while the rest of the race was deducted. An 'SB' row may still carry `sp` —
   * the last price Racing Australia printed for it, kept rather than blanked because it is a
   * real market fact about the withdrawn runner. It is NOT the basis of the deduction, and you
   * must never derive one from the other: `sp` comes from RA's results table while a deduction
   * is struck by the settling bookmaker, and they do not agree. Measured 2026-09-08 across all
   * five stored 'SB' rows that carry a price, 1/`sp` equals the published win deduction on NONE
   * of them — Varejao, Sunshine Coast R4 2026-09-06, saddlecloth 5, withdrawn about 2 minutes 20
   * before the jump: `sp` 3.70, so 1/3.70 is 0.27 in the dollar, against a published
   * `deductions` row of 0.18 win and 0.15 place; Dubai Dancer, Warrnambool R5: 1/5.50 is 0.18
   * against a published 0.10. Settle from `deductions`, which is authoritative. None of the five
   * carries a `position` or a `margin`. Telling a barrier scratching from one made days earlier
   * is CODE-SPECIFIC, and the two collectors do not spell it the same way — do not write one
   * rule across categories. On AU thoroughbred (Racing Australia) both are `status: scratched`,
   * and `abnormal` is the discriminator ONLY in one direction: a barrier scratching carries
   * 'SB'; every other scratching carries `abnormal` null. Both carry their saddlecloth `number`,
   * both carry `box` null (the runner has no barrier it jumped from — RA prints 0 there and we
   * do not pass that sentinel on), and an ordinary scratching carries `sp` null while an 'SB'
   * may carry one. So `abnormal == 'SB'` identifies a barrier scratching; `abnormal` null tells
   * you only that it was not one, not how early it happened — use `deductions[].scratched_at`
   * for that. On greyhound (our own collection since 2026-09-13: FastTrack for Victorian tracks,
   * the national results pages for every other state) `abnormal` is null on every scratching and
   * `status` carries three values: `ran`, `scratched` (merged in from our own `deductions`, so
   * it never says how late), and `reserve` for a rug 9/10 reserve that never got a box.
   * `late_scratching` was the retired interim feed's greyhound-only value — a thoroughbred
   * barrier scratching does NOT use it — and it is no longer emitted; `scratched` does not carry
   * identical meaning in the two codes. `deductions` carries `scratched_at` for either, and is
   * the one cross-code way to see how close to the jump a runner came out. `dead_heat` is true
   * on each runner sharing a position. IDENTITY. `runner_ref` (`ra:<code>`) is the code Racing
   * Australia published for this runner on race day. It is the same value on the closing-line,
   * price-path and markets archives, on the live board on race day, and on
   * /v1/racing/acceptances once that day's field has been read, so it joins this runner across
   * every endpoint for this race. Racing Australia issues a new code for the same horse each
   * day, so it is not a horse identity: the same horse carries a different `ra:` code at each
   * meeting. `horse_ref` (`pe:<name>`) is: the registered name folded to letters and digits
   * (trailing country parenthetical off), the same value on results, the live board, the
   * closing-line and price-path archives, /v1/racing/horses/form, /v1/racing/horses/runs and the
   * backfill, and it is the key to join a horse across meetings. It is derived at serve time
   * from the name on the row, never stored, so every historical row carries it. On every racing
   * code since 2026-10-16 — greyhound and harness runners carried a null before that and now
   * carry the same `pe:<name>` fold, which for them is the only identity that joins a runner to
   * itself across meetings. On GREYHOUNDS `runner_ref` IS the dog: `grv:<id>` for Victorian
   * tracks as FastTrack numbers the dog and `grsa:<id>` elsewhere as the national results pages
   * number it — per-dog registry ids that DO persist across meetings, in two namespaces, so a
   * dog racing in both is two refs until mapped. `runner_ref` is null while a code's registry
   * source is not yet wired. `trainer` and `jockey` come from the same official results source
   * and may be null where that source is not yet live for the code. GREYHOUND-ONLY, ADDITIVE
   * FROM 2026-09-21, five measured columns the results pages print. `first_split_s` is the first
   * sectional in seconds exactly as the source page printed it, null where the page printed
   * none. `second_split_s` is the second sectional, and is null on EVERY Victorian run because
   * FastTrack publishes one split and not two. `weight_kg` is the greyhound's race-day weight in
   * kilograms, null where the page carries no weight column at all — Western Australian meetings
   * carry none (0 of 36 runner rows sampled 2026-09-21). `pir` is position-in-running text
   * passed through as a STRING and never a number ("21" means 2nd at the first mark then 1st at
   * the second): FastTrack's own column on Victorian runs and, since 2026-09-29, the national
   * page's In Race Positions card elsewhere, which only some tracks print (see
   * /v1/racing/greyhounds/form `pir` for the per-state rates) — the marks are each site's own,
   * so compare PIR within one source; null where the page printed none. `weather` (added
   * 2026-09-29) is the meeting's weather in the national page's OWN words ("Fine", "Light
   * showers", "Overcast"), stamped on every entry of the field exactly as `grade` is; null on
   * Victorian (FastTrack) fields, which print none, and ABSENT on fields written before it
   * existed — measured 2026-09-29, 170 of the 2,012 stored greyhound fields carry it, from the
   * 2026-09-27 card on. It is not on /v1/racing/greyhounds/form. `grade` is the race's grade in
   * the SOURCE'S OWN WORDS — "M", "4/5" or "FFA" on the national pages, a race type such as
   * "Tier 3 - Maiden" on FastTrack — and the two vocabularies are NOT mapped onto each other, so
   * do not compare a Victorian grade with an interstate one. ⚠️ A STORED FIELD IS NEVER
   * REWRITTEN, so a greyhound field written before 2026-09-21 carries none of these five keys AT
   * ALL — absent, not null — and no thoroughbred field carries them in any era: read them with
   * `.get()`. Measured on 46 freshly read race pages on 2026-09-21, a grade appeared on 46/46
   * races and 362/362 runner rows, a first split on 288/362 and a weight on 295/362; the rows
   * without them are overwhelmingly rug 9/10 reserves, which never started and for which the
   * page prints nothing. `sp` is the OFFICIAL STARTING PRICE as a decimal return on a $1 stake
   * (4.6 means $4.60), null where it is unknown — never 0. It is the settling market's own
   * price, not our consensus and not a bookmaker's fixed price: thoroughbred SP comes from the
   * Racing Australia results table, greyhound SP from our own collection of published results
   * (Victorian tracks via FastTrack, every other state via the national results pages, both from
   * 2026-09-13), and HARNESS SP IS ALWAYS NULL — no source we hold publishes it. `sp_note`
   * carries Racing Australia's favouritism marker on thoroughbred runners ('F' favourite, 'EF'
   * equal favourite) and is null everywhere else. Coverage RE-MEASURED 2026-09-08 over the whole
   * retained store, counting only rows whose `status` is `ran` (a barrier scratching is not a
   * starter and its price is not in this denominator): 88.6% of thoroughbred starters carry `sp`
   * (2,105 of 2,375); on the greyhound races collected since 2026-09-13, 2,054 of 2,077
   * Victorian starters do (98.9%) and 4233 of 4596 of the other states' starters do (92.1%),
   * both measured 2026-09-20. The Racing Australia block that held thoroughbred SP at 0% when
   * this was last measured on 2026-09-03 has lifted and the collector has been landing meetings
   * since. A null `sp` is unknown, never zero — RA prints no SP at all on some rows. Null
   * `runners` means the full field is not available for this race — never an empty field; every
   * AU and NZ code carries one (AU thoroughbred, AU greyhound, AU harness, NZ harness, NZ
   * thoroughbred). `placings` remains the source for the settling bookmaker's own fixed prices,
   * and now also carries `sp` copied from here.
   */
  runners?: Record<string, unknown>[] | null;
  /**
   * Why `runners` is or is not there, per race — the field a caller was missing when `runners:
   * null` was the only signal and it collapsed several different futures into one. SIX values.
   * `complete`: `runners` is present. It is set whenever a field is stored, including on an
   * abandoned race that unexpectedly carries one, so `field_status == 'complete'` is a safe gate
   * before parsing. An AU harness result settled between 2026-09-29 and 2026-10-04 that the TAB
   * New Zealand pass could not match may still hold the PRE-RACE BOARD copy — every entry
   * `origin: board`, `field_source` null, positions for placegetters only and no times, SP or
   * margins — so check `origin` before treating it like a collected field. On GB and IE
   * thoroughbred (from 2026-10-06) `complete` means Betway's field (`field_source: betway_uk`,
   * every entry `origin: betway_uk`): every runner with its starting price in `sp` and
   * `sp_fraction` and a `position` wherever Betway publishes one — every finisher on the British
   * races measured; on the Irish ones Betway ranks the first four first and the rest of the
   * order within about 25 minutes of the off, which the interim result picks up, so until then
   * an unplaced Irish starter is `ran` with `position` null — and non-runners as `scratched`; no
   * margins, times, barriers, jockeys or dividends, and no Rule 4 figure on the deductions. On
   * AU harness, NZ harness and NZ thoroughbred (from 2026-10-04) `complete` means the TAB New
   * Zealand field (`field_source: tabnz`, every entry `origin: tabnz`): the full finishing order
   * with margins in lengths, each runner's time (NZ racing only — TAB New Zealand publishes no
   * times on Australian races), barrier and gate, driver in `jockey` (gallops add `weight_kg`,
   * the total carried), trainer, scratchings with `scratched_at`, and TAB New Zealand's own pool
   * win and place dividends on the placegetters; `sp` is null because TAB NZ publishes no
   * official starting price. A board copy written before 2026-10-04 is replaced by the first
   * pass. On ZA thoroughbred (from 2026-10-15) `complete` means the Ambernet settled race card
   * (`field_source: easybet_za`; each entry's `origin` is the book it was read from, easybet_za
   * or topbet_za): every runner, with a `position` on the runners the book ranks (the placed
   * runners; unplaced starters stay `ran` with `position` null), jockey and trainer, non-runners
   * as `scratched`; no margins, times, SP or dividends, and no deduction figure on the
   * deductions. On US and Canadian racing (from 2026-08-01) `complete` means TVG's official
   * results (`field_source: tvg`): the official finishing order, `number` = the betting interest
   * (a coupled entry's runners share one) and `program` = the printed number, scratched runners
   * as `scratched`; no margins, times, trainers or SP — the tote dividends are on `dividends`
   * (product US-TOTE) and per $1 on the placings. `pending`: a collector exists for this code
   * and the pass that NORMALLY fills this race has not been yet; `field_note` names the UTC
   * instant by which it will have run. `overdue`: that pass has been and gone without writing a
   * field, but the collector still selects this row as a candidate and keeps re-attempting it —
   * this state is NOT terminal. For AU greyhound the hourly pass for its state (FastTrack for
   * Victoria, the national results pages elsewhere) re-reads every field-less race inside its
   * seven-day window, and so does the hourly TAB New Zealand pass for AU harness, NZ harness and
   * NZ thoroughbred; for AU thoroughbred a bounded re-fetch reaches six days but is run by hand
   * rather than on a schedule. Most rows that reach `overdue` stay null, so do not build on a
   * field arriving — but do not write the race off either, and `field_note` gives the horizon.
   * `unavailable`: no scheduled pass still selects this row. Its collector's own candidate
   * window closed at the instant in `field_note` and no field was written — the pass either
   * never matched the race or refused an ambiguous match, which it does rather than write
   * another race's field. `unsupported`: no collector exists for this category/country. Since
   * 2026-10-04 that is only a foreign race that appears because an AU book listed the meeting:
   * AU harness, NZ harness and NZ thoroughbred (1,254 of the 5,577 stored results on 2026-09-10)
   * all gained their TAB New Zealand collector that day — and no amount of waiting will produce
   * one. `not_applicable`: the race did not run (abandoned, postponed or transferred) and
   * carries no field, so there is nothing to collect. TRANSITIONS, stated explicitly because
   * acting on the wrong one costs you data. The scheduled progression is pending -> overdue ->
   * unavailable, one direction only. It is bounded at every step by a collector's own window
   * rather than by hope: a race can sit matched-and-never-resulted forever (The Gardens,
   * 2026-09-05, 12 races), and an open-ended `pending` would have you polling it forever. Any of
   * those three becomes `complete` the moment a field is written, AND THAT INCLUDES
   * `unavailable` — nothing un-writes a `runners` array, so a collector re-run by hand, a
   * widened window or a late upstream publication can still fill a row we have stopped
   * scheduling passes for. So `unavailable` means 'nothing further is scheduled', never 'this
   * can never arrive'; if you reconcile, re-read rather than caching it as final. `unsupported`
   * and `not_applicable` are properties of the racing code and of the race itself, not of a
   * schedule, and do not change on their own.
   */
  field_status?: string;
  /**
   * Which collector owns `runners` for this race: `racing_australia` (AU thoroughbred),
   * `fasttrack` (AU greyhound at Victorian tracks) and `grsa` (AU greyhound everywhere else),
   * the last two our own collection, or null where no collector exists — including a `complete`
   * AU harness row settled between 2026-09-29 and 2026-10-04 whose `runners` is still the
   * pre-race board copy (`origin: board`), which no collector owns; `tabnz` (TAB New Zealand)
   * owns AU harness, NZ harness and NZ thoroughbred; `betway_uk` (Betway's settlement feed) owns
   * GB and IE thoroughbred from 2026-10-06; `pointsbetau` (PointsBet's settled race card) owns
   * GB and IE greyhound from 2026-10-12. Set on `pending`, `overdue`, `unavailable` and
   * `complete` rows alike — it names who WOULD fill the field, not who did.
   */
  field_source?: string | null;
  /**
   * Prose for the non-`complete` states: which pass fills this code, when its normal pass for
   * this race has been and gone, how long the collector keeps re-attempting the row, or that the
   * code has no source at all. Null on `complete`. Written for a human reading a response —
   * branch on `field_status`, never on this text.
   */
  field_note?: string | null;
  /**
   * Added 2026-10-20, additive. Result and field completeness in one object, so a caller does
   * not have to combine `status` and `field_status` itself. `state` is one of four values:
   * `provisional` (the result is not final yet), `final_placings` (final placings, and dividends
   * where the settling book declares them, but no full field — `field_status` says whether one
   * is still coming), `complete_full_field` (final, and `runners` holds the whole field) and
   * `not_run` (abandoned, postponed or transferred). `result_final` is `status == 'final'`;
   * `result_source` names the feed that settled the race (`betright`, `pointsbetau`,
   * `betway_uk`, `ambernet_za`, `racing_australia` for an abandonment, or null when unknown).
   * For a race whose field is not in yet: `field_pending` / `field_overdue` mirror
   * `field_status`, `field_due_by` is when the pass that normally fills it will have run,
   * `overdue_since` is that same instant once it has passed, `retrying` is true while a
   * scheduled pass still re-attempts the row and `retry_until` is the collector's retry horizon.
   * `source_refused_since` (UTC) is set while the field's source is refusing our collector for
   * this race (FastTrack for Victorian greyhounds since 2026-10-13).
   * `last_successful_collection_at` is the field collector's latest served run where the
   * collector records one (FastTrack only; null for every other source). The four `state` values
   * are counted per lane by /v1/racing/results/coverage (`result_completeness`). Read it with
   * `.get()`.
   */
  completeness?: Record<string, unknown> | null;
  /**
   * Added 2026-10-22, additive. What this result holds, one part at a time, so a missing full
   * field is never read as a missing result. `placings`: `final` (status final, placings present
   * — settle on these), `provisional` (placings present, result not final yet), `pending` (no
   * placings on the row yet) or `not_applicable` (the race did not run). `dividends`:
   * `available` (at least one straight or exotic dividend in `dividends`), `pending` (none yet
   * on a result that is not final), `not_published` (none, and none is coming: the settling feed
   * publishes no dividends — GB and IE greyhounds, GB and IE thoroughbreds and South African
   * thoroughbreds — or the final result declared none) or `not_applicable`. `full_field` (the
   * whole finishing order in `runners`): `available`; `pending_collection` (a collector still
   * re-attempts this race — `field_status` `pending` or `overdue`; poll no faster than hourly);
   * `source_unavailable` (the only published source of this field is refusing our collector —
   * today that can only be FastTrack, for Victorian greyhounds; the date is
   * `completeness.source_refused_since`, and `field_sources_refused` on the coverage endpoint
   * lists every refusing source; the field fills on the next served pass if access returns, and
   * placings and dividends are unaffected); `not_collected` (no scheduled pass still selects the
   * race and none was written — `field_status` `unavailable`); `no_supported_source` (no
   * full-field collector exists for this country and code — `field_status` `unsupported`);
   * `not_applicable` (the race did not run). What a stored field contains per source is on
   * `field_status`. Every value is counted per lane by /v1/racing/results/coverage
   * (`availability`). New values may be added; treat an unknown one like `pending`. Read it with
   * `.get()`.
   */
  availability?: Record<string, string> | null;
  /**
   * Scratched runners and the deduction applied to bets already struck. `win` and `place` are
   * fractions of the dollar in the range 0-1 (0.34 = 34 cents in the dollar), as published by
   * the settling bookmaker.
   */
  deductions?: Record<string, unknown>[];
  /**
   * Dividends declared for the race. `straight` holds one row per placegetter per product:
   * {position, number, name, market ('WIN' or 'PLC'), product, amount}. `exotics` holds one row
   * per exotic product: {type, code ('QN', 'EX', 'TF', 'FF'), selection, product, amount}, where
   * `selection` is the winning saddlecloth numbers in finishing order, e.g. '5,1'. Every
   * `amount` is the return on a $1 stake, the same convention as the odds fields — a 'FIXED'
   * straight dividend equals that runner's own settled fixed price. `product` names the settling
   * pool: 'FIXED' is the bookmaker's own price, the rest are tote products (SP, MIDDIV, VIC,
   * RD+, BT+SP). A product that declared no dividend is omitted rather than returned as 0.
   * Exotic dividends are only declared once the race fully settles, a few minutes after the
   * placings, so a just-resulted race can carry `straight` while `exotics` is still empty — it
   * fills in on a later poll. `multi_race` (from 2026-09-29) holds the meeting-level products —
   * Quaddie, Giant 6, Daily Double and the like — on the race that is the product's FINAL leg
   * and on no other race: one row per declared pool, {code (the book's own, e.g. 'RC-QUADDIE'),
   * type ('Quaddie'), product ('VIC', 'BT', ...), selection (the winning saddlecloth in each
   * leg, in leg order, e.g. '1,4,2,11'), amount (the return on $1), legs (the race numbers the
   * product spans, e.g. [7, 8, 9, 10])}. Each row is published as the settling book declares it:
   * Rosehill R10 on 2026-09-26 closed the Quaddie (R7-R10, $128.40 VIC and BT), a Giant 6
   * (R5-R10, $544.40 VIC) and a second Giant 6 row whose selection names five legs, at $1.00. A
   * result stored before 2026-09-29 carries NO `multi_race` key at all — read it with `.get()` —
   * and on a newer row it is a list, empty when the race closes no product. `straight_types` is
   * the book's raw list of product codes, retained for backwards compatibility. `note` (rare,
   * from 2026-10-03) is a plain-text caveat on the dividends, absent on almost every race: e.g.
   * Randwick R1 on 2026-10-03, where the settling book paid on the first horse past the post and
   * a protest then changed the official placings, so these dividends name a different winner
   * from `placings`. Read it with `.get()`.
   */
  dividends?: Record<string, unknown> | null;
  /**
   * NSW harness sectional times, or null. Present on AU harness races at NSW tracks once Harness
   * Racing NSW has published the meeting's Sectional Times sheet, usually a few days after the
   * meeting, and it has been matched to this race by venue, Sydney date, race number and the
   * winner's saddlecloth. Race level: `gross_time_s` (the winning time), `mile_rate_s`,
   * `lead_time_s` (null where none was taken), `quarters_s` (the leader's four quarters, in
   * order), `distance_m`. `runners` lists every starter by saddlecloth `number` with `name`,
   * `position` (the official placing; dead heats share it and set `dead_heat`), `margin_m`
   * (metres behind the winner), `time_s` (the runner's own time), `behind_800m_m` and
   * `wide_800m`, `behind_400m_m` and `wide_400m` (metres behind the leader and how many horses
   * wide, at the 800 m and the 400 m), and `q3_s` and `q4_s` (the runner's own third and fourth
   * quarters). `source` is `hrnsw` and `source_url` is the sheet it was read from. Times are in
   * seconds and distances in metres. Read it with `.get()`.
   */
  sectionals?: Record<string, unknown> | null;
  resulted_at?: string | null;
  /**
   * UTC time at which the market was FIRST seen shut — the book stopped taking bets on this
   * race. Poll-observed: this is the first poll that saw the state, not the exact instant, so it
   * lands up to one polling pass after it, and passes are most frequent in the minutes before
   * the jump. Set once: a market that flickers SUSPENDED -> OPEN -> SUSPENDED keeps the FIRST
   * suspension. TWO SOURCES report market state. PointsBet closes its book at the real jump —
   * measured 2026-09-03 over 9 live races followed across their jump, 0.2 to 1.4 minutes AFTER
   * the advertised start on AU/NZ cards — and the Betfair Exchange reports it while it quotes
   * the market, which is until about two minutes before the jump. `market_state_source` names
   * the one that produced this value. Exchange-sourced stamps are withheld from customer plans,
   * so a race seen shut only by the exchange reads null. Bookmaker-sourced stamps are served to
   * everybody. Null also means no feed observed a transition — it never means the market stayed
   * open. Copied from the live race row when the result is written; that row is deleted 10
   * minutes after the jump and results land a median 4.9 minutes after the start, so a late
   * result keeps null.
   */
  market_closed_at?: string | null;
  /**
   * UTC time at which the race was FIRST seen in-play — the actual off, as opposed to
   * `start_time`, which is the ADVERTISED off and moves. Same poll-observed, set-once semantics
   * as `market_closed_at`, and withheld on the same source rule. Reported by the Betfair
   * Exchange only: bookmakers do not run racing in-play, so a bookmaker feed says when it CLOSED
   * its book, not when the race went. For a race the exchange has stopped quoting,
   * `market_closed_at` from a bookmaker is the closest measured instant to the off. Copied from
   * the live race row when the result is written; that row is deleted 10 minutes after the jump
   * and results land a median 4.9 minutes after the start, so a late result keeps null.
   */
  inplay_at?: string | null;
  /**
   * Which feed's market state produced `market_closed_at` / `inplay_at` on this race —
   * 'pointsbetau' for the bookmaker, 'betfair_ex_au' for the exchange. Set once, alongside the
   * first stamp. Null when no transition has been observed, and null for customer plans whenever
   * the stamps themselves are withheld, so a non-null value here is always the provenance of
   * values you can see.
   */
  market_state_source?: string | null;
  /**
   * Other race_ids that identify this same race. When books disagreed about a race's venue
   * spelling, card or start, it can have been listed under two race_ids; the price history (and
   * /v1/racing/next-to-go while it was open) may carry either. Both keep working: this result is
   * returned for `race_id=` with either id, and every alias is listed here. Empty for almost
   * every race.
   */
  race_id_aliases?: string[];
}

export interface RacingBestOddsOut {
  race_id: string;
  venue: string | null;
  race_number: number | null;
  category: string | null;
  country: string | null;
  start_time: string;
  race_name?: string | null;
  track_condition?: string | null;
  market_percentage?: number | null;
  books_compared: number;
  scratchings?: Record<string, unknown>[];
  /** Age in seconds of the OLDEST bookmaker quote behind this race. */
  data_age_seconds?: number | null;
  freshest_age_seconds?: number | null;
  /**
   * Which refresh rule this race is on, and therefore what the race-level `stale` means. `live`
   * = inside 3 hours of the jump: books re-price it on every 8-20s poll, and `stale` fires past
   * 120 seconds. `card` = further out: books re-price it about every 15 minutes so a full day
   * fits inside their rate limits, and `stale` fires past 1800 seconds. Every published quote
   * carries ITS OWN `refresh_tier`, and it can be `card` on a `live` race: Betr's upstream
   * rate-limits us, so that book stops re-pricing every poll 30 minutes before the jump rather
   * than 3 hours (PlayUp, on a 6-requests-a-minute budget, at 6 minutes), and its quotes between
   * there and 3 hours are refreshed every 5-15 minutes, published as `card`, and judged against
   * 1800 seconds (since 2026-09-07; before that they were marked stale). A book's tier is never
   * tighter than its race's. `age_seconds` is the TRUE age in every case — only the threshold
   * changes.
   */
  refresh_tier?: string;
  stale?: boolean;
  stale_bookmakers?: string[];
  cached?: boolean | null;
  cache_age_seconds?: number | null;
  runners: Record<string, unknown>[];
}

export interface RacingChangesOut {
  /**
   * Send this back as `since` on your next poll. Deliberately set back 30 seconds from the
   * server clock so no in-flight write is skipped — the feed is at-least-once, not exactly-once.
   */
  server_time: string;
  races?: ChangedRaceOut[];
}

export interface ResetPasswordIn {
  token: string;
  new_password: string;
}

export interface RestatementOut {
  id: number;
  dataset: string;
  period: string;
  /** day or month. */
  period_kind: string;
  /** When the changed file was published (UTC). */
  at: string;
  /**
   * orphan_merge: the archive folded a duplicate race record onto the race that was run, which
   * moved or removed rows in this period. regeneration: any other change, most often late
   * results or late closing lines inside the three-night settle window.
   */
  reason: string;
  /** Rows in the earlier file and not in this one. */
  rows_removed?: number | null;
  /**
   * Rows present in both whose values changed. Null where the dataset has no row key or the file
   * was too large to diff; rows_removed and rows_added are then the net row delta.
   */
  rows_changed?: number | null;
  /** Rows in this file and not in the earlier one. */
  rows_added?: number | null;
  /** csv sha256 of the file replaced. */
  sha256_before?: string | null;
  /** csv sha256 of the file that replaced it. */
  sha256_after?: string | null;
  /** Row counts before and after, the diff method, and for orphan_merge the merges counted. */
  detail?: Record<string, unknown>;
}

export interface RestatementsOut {
  restatements: RestatementOut[];
  count: number;
  notes?: string[];
}

export interface ResultsCoverageOut {
  /** When these counts were computed (UTC). */
  as_of: string;
  /** How many Sydney days the window spans, ending today. */
  days: number;
  /** First Sydney date counted (inclusive). */
  from_day: string;
  /**
   * Last Sydney date counted — today in Sydney, so it is a PART day and its races are mostly
   * `pending`.
   */
  to_day: string;
  /**
   * Start time of the earliest result retained anywhere in the store, the same value
   * /v1/racing/results puts on every row. ONE GLOBAL VALUE: it is the oldest Australian card,
   * and it is not when any other lane began — South African results, for instance, start months
   * later. Read `results_floors` for the per-lane answer.
   */
  coverage_from?: string | null;
  /**
   * From when a RESULT exists at all, per country and category, MEASURED from the store rather
   * than typed (2026-10-17): `country`, `category`, `from` (the date of the earliest stored
   * result for that lane, the race's OWN date — so a Great Britain, Ireland or South Africa lane
   * is named by its own card, not by the Sydney day it fell on; `from_day` and `to_day` above
   * are Sydney days, which is a different question) and `results` (how many it holds). This is
   * the figure to read before settling or scoring a lane. It is NOT `coverage_from`, which is
   * one global value — the earliest result anywhere, currently an Australian card — and so says
   * nothing about when a newer lane began. It is NOT `field_floors` either: that is when the
   * FULL FIELD began, which can be later than the result. Australian thoroughbreds have results
   * from 2026-08-15 and fields only from 2026-09-01, so neither value can be inferred from the
   * other. A lane absent from this list has no result in the store at any date: races in it are
   * priced and archived but cannot be settled here, which is true of every country outside
   * Australia, New Zealand, Great Britain, Ireland and South Africa.
   */
  results_floors?: Record<string, unknown>[];
  /**
   * Machine-readable twin of `field_scope` (2026-10-15): one row per country and category that
   * has a full-field collector — `country`, `category`, `field_source` (the machine value
   * `field_source` carries on /v1/racing/results), `source_name` and `from` (the earliest Sydney
   * card a stored field exists for, measured). Codes outside this list hold placegetters only.
   */
  field_floors?: Record<string, unknown>[];
  /**
   * Every stored result in the window, all codes and all states. races == complete + pending +
   * overdue + unavailable + unsupported + not_applicable, always.
   */
  races: number;
  /** Races carrying a `runners` field. */
  complete: number;
  /** A collector exists and the pass that normally fills the race has not been yet. */
  pending: number;
  /**
   * That pass has been and gone with no field written, but the collector still re-attempts the
   * row. NOT a terminal state — see `field_status` on /v1/racing/results for the horizons.
   */
  overdue: number;
  /** Past the collector's own retry horizon: no scheduled pass still selects the row. */
  unavailable: number;
  /** No collector has ever existed for the code. */
  unsupported: number;
  /**
   * The race did not run (abandoned, postponed or transferred) and has no field — nothing to
   * collect, not a gap.
   */
  not_applicable: number;
  /**
   * races - unsupported - not_applicable: the races in this window that could carry a field at
   * all. It is the denominator of `supported_complete_pct`, published so that a null percentage
   * is readable as 0-of-0 rather than guessed at.
   */
  collectable: number;
  /**
   * complete / races as a percentage, across the whole window including codes that can never
   * carry a field. NULL — not 0.0 — when `races` is 0. An empty window has no coverage figure,
   * and 0.0 there is a fabricated number that reads as total failure: a `days=1` window called
   * between Sydney midnight and the day's first result is empty on most days (the median first
   * result of a Sydney day lands at 10:50 local), so this is an ordinary case and not a corner.
   */
  complete_pct?: number | null;
  /**
   * complete / collectable: the figure to read if you only care about the codes we collect
   * fields for. The raw `complete_pct` is dragged down by stored races in codes that had no
   * collector before 2026-10-04 (AU harness and both NZ codes, 1,254 rows as at 2026-09-10). An
   * AU harness result still carrying the 2026-09-29..10-04 pre-race board copy (`origin: board`)
   * counts as complete AND collectable here, so on such a window separate them with
   * `by_category`. NULL — not 0.0 — when `collectable` is 0, which happens on an empty window or
   * one holding only foreign races. If you alert on this figure, treat null as 'no data' and
   * never as 'zero coverage'.
   */
  supported_complete_pct?: number | null;
  /**
   * One row per country + category over the window: {country, category, field_source, races,
   * complete, pending, overdue, unavailable, unsupported, not_applicable}, which sum to `races`,
   * plus four keys added 2026-10-19 that are NOT part of that sum: `result_final` (races whose
   * result is final — placings, and dividends where the book publishes them, are in; this is
   * independent of the full field), `overdue_source_refused` (the part of `overdue` whose source
   * is currently refusing our collector, see `field_sources_refused`), `oldest_overdue_age_h`
   * (hours since the start of the oldest `overdue` race, null when none) and `refused_since`
   * (UTC, set while this row's source refuses us). Since 2026-10-20 each row also carries
   * `result_completeness` {provisional, final_placings, complete_full_field, not_run}, a
   * separate partition that also sums to the row's `races`.
   */
  by_category: Record<string, unknown>[];
  /**
   * One row per Sydney day + country + category, newest first, with the same counts. This is the
   * day-by-day answer to 'is yesterday finished yet'.
   */
  by_day: Record<string, unknown>[];
  /**
   * Venue-days still missing a field in a code we DO collect: {day, venue, venue_id, category,
   * country, settled} plus every counter above (races, complete, pending, overdue, unavailable,
   * unsupported, not_applicable), which sum to `races` exactly. Ordered worst first: most
   * `unavailable`, then the biggest outstanding shortfall, then oldest day. `settled` is true
   * when nothing on that venue-day can still fill (no `pending`, no `overdue`) — that is the
   * difference between a genuine terminal gap and a card simply still in progress, and without
   * it a day mid-fill outranks a real one. A venue-day is listed when complete + not_applicable
   * < races: an abandoned card has nothing to collect and is NOT a shortfall. A venue-day whose
   * only gap is `unsupported` is deliberately absent — it would be most of the list and it is
   * already counted above. Capped at 200 entries; `venues_incomplete_truncated` says when the
   * cap bit.
   */
  venues_incomplete: Record<string, unknown>[];
  venues_incomplete_truncated?: boolean;
  /** Prose: which codes are collected, from when, and what the never-collected codes are. */
  field_scope: string;
  /** AU and NZ closing-line archive races that started in this window at least 3 hours ago. */
  archive_races_in_window?: number;
  /**
   * Of archive_races_in_window, races with no result row at all: a price history with nothing to
   * settle it against. Not counted in `races`, which counts stored results only.
   */
  archive_races_without_result?: number;
  /**
   * Of archive_races_without_result, races for which a result DOES exist but under a different
   * race_id (matched on category, a start within two minutes and the venue's first word — 'Mt
   * Gambier' = 'Mount Gambier'). A join on race_id misses them; a join on venue, date and start
   * time finds them. The rest of archive_races_without_result have no result at all — typically
   * a race abandoned after it was priced, or a meeting the results feed never published. Added
   * 2026-10-19; null when not computed.
   */
  archive_races_result_unlinked?: number | null;
  /**
   * How many priced races join to a stored result, over the same window and population as
   * `archive_races_in_window`: `window` {from, to, min_age_hours, countries};
   * `eligible_priced_races`; and five counts that always sum to it -- `joined_by_race_id` (a
   * result carries the race's own race_id), `joined_via_alias` (the race was listed under two
   * race_ids and its result is reachable through the other one; /v1/racing/results?race_id=
   * resolves either), `unjoined_with_candidate` (a result exists under another race_id and meets
   * the matching rules, but is not linked yet), `held_for_review` (a result under another
   * race_id is close but the evidence is ambiguous or weak, so it is never linked automatically)
   * and `no_stored_result` (no result near the race at all: typically a race abandoned without
   * an official notice, or one the results source never published). `join_rate_pct` =
   * (joined_by_race_id + joined_via_alias) / eligible_priced_races, null when the window is
   * empty. `by_cause` breaks the alias, candidate and review counts down by why the race had two
   * ids; `definition` states each count in one line. Null when not computed. Matching rules:
   * same racing code, country, venue and local meeting date, start within 10 minutes, AND the
   * same race number or at least 80% of the result's runners in the priced field; venue and
   * start time alone never link a race.
   */
  result_join?: Record<string, unknown> | null;
  /**
   * Added 2026-10-20: the window's races by RESULT completeness — `provisional`,
   * `final_placings`, `complete_full_field`, `not_run`, the `completeness.state` values on
   * /v1/racing/results. A SECOND partition of the same races, alongside the field states:
   * provisional + final_placings + complete_full_field + not_run == races, always, and every
   * `by_category` and `by_day` row carries the same object summing to its own `races`.
   * `complete_full_field` is final AND carrying a field, so it can be smaller than `complete`
   * (which counts a field on any row).
   */
  result_completeness?: Record<string, number>;
  /**
   * Full-field sources currently refusing our collector (2026-10-19): one row per source with
   * `field_source`, `source_name`, `http_status`, `refused_since` (the first refused run of the
   * current streak, UTC) and `checked_at` (the latest run). Races of that source whose fill fell
   * inside the refusal stay `overdue` and then `unavailable` and say so in `field_note`; their
   * placings and deductions are unaffected. Empty when every source is serving.
   */
  field_sources_refused?: Record<string, unknown>[];
  /**
   * Added 2026-10-22: the window's races counted by each part of `availability` on
   * /v1/racing/results — `placings` {final, provisional, pending, not_applicable}, `dividends`
   * {available, pending, not_published, not_applicable} and `full_field` {available,
   * pending_collection, source_unavailable, not_collected, no_supported_source, not_applicable}.
   * THREE MORE PARTITIONS of the same races: each part's values sum to `races`, always, and
   * every `by_category`, `by_day` and `venues_incomplete` row carries the same object summing to
   * its own `races`. They sit beside the field states and do not replace them:
   * `full_field.available` == `complete`, and `pending_collection` + `source_unavailable` +
   * `not_collected` == pending + overdue + unavailable. `full_field.source_unavailable` with
   * `placings.final` is the count of races you can settle whose full finishing order is held
   * back by a refusing source (see `field_sources_refused`).
   */
  availability?: Record<string, Record<string, number>>;
}

export interface RevealIn {
  password?: string | null;
}

export interface RewardIn {
  /** `cash` or `credits`. */
  reward_type: string;
  /**
   * Where a cash remittance should go, if it differs from the account email. Ignored for
   * `credits`.
   */
  payout_email?: string | null;
  /**
   * Requested referral code, first call only. 3-24 characters, lowercase letters, digits and
   * hyphens. Ignored once a code has been issued — a code that changes is a dead link on
   * somebody's blog.
   */
  code?: string | null;
}

export interface RunPIR {
  /** Metres from the finish, e.g. 800. */
  at_m: number;
  position: number;
}

export interface RunPlacegetter {
  position: number;
  name: string;
  /**
   * That horse's ra: code from that meeting. Racing Australia issues a new code each day, so to
   * look the horse up here pass its name.
   */
  runner_ref?: string | null;
  weight_kg?: number | null;
}

export interface RunsSourceBlock {
  /**
   * Where the data comes from: our own collection of published AU thoroughbred results (Racing
   * Australia's results pages, read hourly by our results collector), flattened to one row per
   * horse per race and refreshed hourly. Not Racing Australia's form page — that is
   * /v1/racing/horses/form.
   */
  feed?: string;
  region?: string;
  sport?: string;
  /**
   * The first complete card in the store. A horse's record here starts here — it is not a
   * career.
   */
  coverage_from?: string;
  /** Sydney date of the latest race in the store. */
  coverage_to?: string | null;
  /**
   * Which of our collectors can contribute a run. AU thoroughbred results come from one: the
   * Racing Australia results pages.
   */
  collectors?: string[];
  /** The store is rebuilt from our own results at :59 each hour, after the results pass. */
  refreshed_hourly?: boolean;
}

export interface ScanOut {
  as_of: string;
  window_minutes: number;
  races_scanned: number;
  filters: Record<string, unknown>;
  method: Record<string, unknown>;
  /** Runners that cleared the filters, largest move first, each with its race header. */
  results?: Record<string, unknown>[];
  cached?: boolean;
}

export interface SetPasswordIn {
  new_password: string;
  current_password?: string | null;
}

export interface SourceBlock {
  /**
   * Where the data comes from: our own collection of published AU greyhound results, Victorian
   * tracks via FastTrack (runner_ref grv:) and every other state via the national results pages
   * (runner_ref grsa:). Runs on or after `results_from` are races we settled ourselves; earlier
   * runs are the same pages read back by our history collector. Refreshed hourly. On a British
   * or Irish race (/v1/racing/greyhounds/field, from 2026-10-12) `region` reads GB-IE and the
   * runs are our own GB/IE results from PointsBet's settled race card, read live.
   */
  feed?: string;
  region?: string;
  sport?: string;
  /** Sydney date of the OLDEST run in the store. A dog's record here starts here. */
  coverage_from?: string;
  /**
   * Sydney date our own settled results begin. A run on or after it has `origin: results` and a
   * `result_id` that joins to /v1/racing/results; an earlier one has `origin: history` and does
   * not.
   */
  results_from?: string;
  /** Sydney date of the latest race in the store. */
  coverage_to?: string | null;
  /**
   * Which of our collectors can contribute a run: `fasttrack` = Victorian tracks, `grsa` = every
   * other state.
   */
  collectors?: string[];
  /** The store is rebuilt from our results at :58 each hour, after both collectors have written. */
  refreshed_hourly?: boolean;
}

export interface SplitRecord {
  starts: number;
  wins: number;
  seconds: number;
  thirds: number;
}

export interface SportOddsEventOut {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string | null;
  away_team: string | null;
  competition?: string | null;
  bookmakers: Record<string, unknown>[];
  odds_format?: string | null;
  fetched_at?: string | null;
  data_age_seconds?: number | null;
  freshest_age_seconds?: number | null;
  stale?: boolean;
  stale_bookmakers?: string[];
  cached?: boolean | null;
  cache_age_seconds?: number | null;
  canonical_event_id?: string | null;
  data_quality?: Record<string, unknown> | null;
}

export interface SportOut {
  key: string;
  title: string;
  group: string | null;
  active: boolean;
  cached?: boolean | null;
  cache_age_seconds?: number | null;
  canonical_event_id?: string | null;
  data_quality?: Record<string, unknown> | null;
}

export interface SportResultOut {
  sport_key: string;
  /**
   * The league's own name for the competition, verbatim ('Telstra Premiership', '2026 NAB AFLW
   * Season').
   */
  competition?: string | null;
  season?: number | null;
  /** The league's round label ('Round 27', 'Grand Final'). */
  round_title?: string | null;
  /**
   * The LEAGUE's spelling, which is not always a bookmaker's: the NRL publishes nicknames
   * ('Roosters'), and AFLW clubs carry no '(W)' suffix here. Read `event_id` to join to the
   * fixture you have prices for.
   */
  home_team: string;
  away_team: string;
  /**
   * Null until the league calls the match final — never 0 for an unplayed or abandoned fixture.
   * For AFL this is the total (20.12 -> 132); `detail` keeps goals and behinds, which the total
   * cannot express.
   */
  home_score?: number | null;
  away_score?: number | null;
  /**
   * `final` once the league says so; otherwise the league's own word for the state ('upcoming',
   * 'unconfirmed_teams'), carried through rather than mapped, so a postponed fixture is never
   * read as a result.
   */
  status: string;
  /** Scheduled kick-off, UTC. */
  start_time?: string | null;
  venue?: string | null;
  /**
   * The code's own scoring and state as the league published it. AFL carries {goals, behinds,
   * totalScore, superGoals} per side.
   */
  detail?: Record<string, unknown> | null;
  /**
   * The fixture in GET /v1/sports/{sport_key}/odds this result belongs to, or null when it could
   * not be tied to one CONFIDENTLY. Null is common and is not a defect: we keep the whole league
   * season, while the odds feed holds only the fixtures we currently price. A null also appears
   * where two of our fixtures matched equally well, in which case nothing is guessed — see
   * `match_note`.
   */
  event_id?: string | null;
  /**
   * How the result reached its fixture: `exact` (both team names identical once normalised),
   * `fuzzy` (matched through the same name-matching the odds feed uses to unify bookmakers), `no
   * candidate fixture`, or `ambiguous: N ...` where two fixtures matched and neither was chosen.
   */
  match_note?: string | null;
  /** Which league published it: `nrl` or `afl`. */
  source: string;
}

export interface SportsArbOut {
  event_id: string;
  sport_key: string;
  home_team: string | null;
  away_team: string | null;
  commence_time: string;
  is_arb: boolean;
  arb_pct: number;
  optimal_stakes: Record<string, unknown>[];
  max_overlay_pct: number;
  selections: Record<string, unknown>[];
}

export interface TeamKeyIn {
  /**
   * What this key is for — 'results worker', 'Jo's laptop'. Shown in the pool view and in your
   * usage breakdown.
   */
  label: string;
  /**
   * Optional. The most credits THIS key may spend per month, hard, inside the account's shared
   * pool — between 1 and the plan's own monthly allowance. Omit it (or send null) and the key
   * may spend the whole pool. Caps reset with the pool on the 1st.
   */
  monthly_cap?: number | null;
}

export interface TeamKeyListOut {
  plan: string;
  allowance: number;
  keys_in_use: number;
  pool_credits_used: number;
  pool_credits_limit: number;
  pool_credits_remaining: number;
  max_monthly_cap?: number;
  primary: TeamKeyOut;
  team: TeamKeyOut[];
}

export interface TeamKeyMintOut {
  key_id: string;
  /**
   * The team key. Shown ONCE; it is stored hashed and cannot be recovered — only revoked and
   * re-minted.
   */
  api_key: string;
  label: string;
  plan: string;
  /** Keys this account may hold, primary included. */
  allowance: number;
  keys_in_use: number;
  pool_credits_limit: number;
  pool_credits_used: number;
  monthly_cap?: number | null;
  /** The largest cap this plan accepts — its own monthly allowance. */
  max_monthly_cap?: number;
}

export interface TeamKeyOut {
  key_id: string;
  key_hint: string;
  label: string | null;
  plan: string;
  created_at?: string | null;
  last_used_at?: string | null;
  period_calls?: number;
  period_credits?: number;
  /** This key's hard per-month credit cap, or null for no cap. */
  monthly_cap?: number | null;
  /**
   * Credits charged against this key's own counter this period. That is the number the cap is
   * checked against; it stays 0 on an uncapped team key, whose spending is only ever charged to
   * the pool row. Use period_credits for what an uncapped key has spent.
   */
  key_credits_used?: number;
}

/**
 * Both fields are optional; only the ones PRESENT in the body are written. `monthly_cap: null`
 * is meaningful (remove the cap) and must not read as "unchanged", so the handler asks
 * model_fields_set which keys the caller actually sent rather than inferring intent from a
 * None that pydantic would produce either way.
 */
export interface TeamKeyPatchIn {
  /** New label for this key. Omit to leave it alone. */
  label?: string | null;
  /**
   * Optional. The most credits THIS key may spend per month, hard, inside the account's shared
   * pool — between 1 and the plan's own monthly allowance. Omit it (or send null) and the key
   * may spend the whole pool. Caps reset with the pool on the 1st. Send null to REMOVE an
   * existing cap; omit the field entirely to leave the cap as it is.
   */
  monthly_cap?: number | null;
}

export interface ToteBoardOut {
  date: string;
  source?: string;
  /** The first race date held. */
  coverage_from?: string | null;
  races: ToteRaceOut[];
  note: string;
}

export interface ToteRaceOut {
  /**
   * TVG's race key, tvg_<track>_<date>_<n>; the same key /v1/racing/results files the result
   * under.
   */
  source_race_id: string;
  /**
   * The priced race this is, as next-to-go and price-history name it; null while no bookmaker
   * prices the race.
   */
  race_id?: string | null;
  /** TVG's spelling of the track. */
  venue: string;
  track_code: string;
  country: string;
  category: string;
  race_number: number;
  /** US Eastern race date. */
  race_date: string;
  /** TVG's post time, UTC. */
  post_time: string;
  /**
   * North American tote odds for this race, from TVG's public race board (US and Canadian
   * thoroughbred, quarter horse and harness), or null. A tote is a pool, not a bookmaker, so it
   * sits here and never in a runner's `bookmakers`, best_win or any bookmaker count. `runners[]`
   * carries per betting interest `morning_line` (the track's line, set before betting) and
   * `win_odds` (the host tote's current odds-to-1), each as TVG sends it ('5/2') and as a
   * decimal price (`morning_line_decimal`, `win_decimal` = 1 + odds, so 5/2 is 3.5), plus
   * `win_pool`, that runner's WIN pool money in USD. `win_odds` is null until the WIN pool opens
   * (`pools_open`) and on a scratched runner. Pre-race the odds are an estimate of the win
   * payoff: a tote pays what the pool pays when it closes. `status` is open, off or official;
   * `final` marks the odds the race settled on (read once it is official). `read_at` is our read
   * of TVG. Null on a race no TVG race links to, which is every race outside the US and Canada.
   * Added 2026-10-27.
   */
  tote: Record<string, unknown>;
  /**
   * How this race's tote odds moved, oldest first: one point per read in which the win odds or
   * the WIN pool changed, from an hour before post until the race is official, the last point
   * being the `final` read. Each point carries `read_at` (our read of TVG), `secs_to_post`
   * (TVG's post time minus read_at; negative once the race is past post, as US races often go
   * late), `status`, the race's `win_pool`, and per live betting interest `number`, `win_odds`
   * (odds-to-1), `win_decimal` and its `win_pool`. Scratched runners are left out. Null unless
   * history=true; empty for a race read before 2026-10-27 or whose pools never opened in the
   * window. Added 2026-10-27.
   */
  history?: Record<string, unknown>[] | null;
}

export interface TrackConditionsOut {
  /** Meeting day, Australia/Sydney calendar date. */
  date: string;
  meetings: Record<string, unknown>[];
  note: string;
  /**
   * The first meeting day (Australia/Sydney) this store holds anything for -- the earlier of the
   * change log's first day and Racing Australia's meeting block's first day, computed from the
   * tables on every call, never a constant. Any `date` from here up to three days ahead is
   * served; an earlier one is a free 422 naming this same day. Null only if the store could not
   * be read, and then the pre-2026-09-29 rule (7 days back) applies.
   */
  coverage_from?: string | null;
  /**
   * The first meeting day Racing Australia's own meeting block (the `racing_australia` values in
   * `current`: rail, track type, penetrometer, the official rating) is held for. Earlier than
   * this the change log alone answers: until 2026-09-29 the block was deleted three days after
   * each meeting, so a day before this date is NOT one on which RA published nothing -- its
   * block is simply gone. Computed like coverage_from.
   */
  official_block_from?: string | null;
}

export interface UpstreamBlock {
  /**
   * `ok` when Racing Australia is answering form reads, `walled` when it is serving its
   * bot-protection challenge to every fresh read and nothing can be collected.
   */
  state: string;
  /**
   * UTC time of the first refusal in the current streak, null when `state` is `ok`. This is the
   * field that tells you a stalled queue is hours old rather than minutes.
   */
  walled_since?: string | null;
  /** How long the current streak has run, in hours, null when `state` is `ok`. */
  walled_hours?: number | null;
  /** One sentence saying what that means for this job, in plain words. */
  note: string;
}

export interface UsageOut {
  plan: string;
  account_email_masked?: string | null;
  password_set?: boolean | null;
  billing_attached?: boolean | null;
  credits_used: number;
  credits_limit: number;
  credits_remaining: number;
  /**
   * When this key's credit counter was LAST set to zero, in UTC, written without an offset (read
   * it as ending in Z). Despite the name this is the start of the current period, not the next
   * reset; it equals period_start, which is the clearer field to use.
   */
  reset_at: string | null;
  /**
   * Start of the current credit period, in UTC, written without an offset (read it as ending in
   * Z). For a key created part-way through a month this is the moment the key was created; after
   * that it is the monthly reset.
   */
  period_start?: string | null;
  /**
   * 00:00 UTC on the 1st of next month, written without an offset (read it as ending in Z).
   * Calculated, not stored: the reset job starts at that time and finishes a few seconds later,
   * so a request in the first seconds of a month can still count against the old period.
   */
  next_reset_at?: string | null;
  burn_rate_per_day?: number;
  projected_month_end_credits?: number;
  projected_exhaustion_date?: string | null;
  warning?: string | null;
  upgrade?: Record<string, unknown> | null;
  all_time?: Record<string, unknown>;
  all_time_by_endpoint?: Record<string, unknown>[];
  usage_by_endpoint?: Record<string, unknown>[];
  recent_activity?: Record<string, unknown>[];
  usage_by_endpoint_period?: Record<string, unknown>[];
  recent_activity_period?: Record<string, unknown>[];
  pool?: Record<string, unknown> | null;
  overage?: Record<string, unknown>;
  credits_remaining_with_overage?: number;
  plans?: Record<string, Record<string, unknown>>;
}

export interface VenueOut {
  venue_id: string;
  venue_canonical: string | null;
  venue_site: string | null;
  country: string | null;
  categories: string[];
  spellings: string[];
}

export interface WebhookAttempt {
  attempt: number;
  started_at: string | null;
  finished_at: string | null;
  status_code: number | null;
  error: string | null;
  latency_ms: number | null;
}

export interface WebhookCreate {
  /**
   * HTTPS endpoint that receives the POST, on port 443 or 8443. Plain http://, a host that does
   * not resolve, and a host that resolves to a private, loopback, link-local or other non-public
   * address are rejected with 422. At most 5 subscriptions per API key (409 beyond that).
   */
  url: string;
  /**
   * Events to subscribe to. Three events have live producers: `arb.opportunity` (a cross-book
   * arb opened), `race.odds_open` and `race.result`. `race.odds_open`: the first bookmaker
   * prices for a race just landed — fires once per race, so you can fetch the card on push
   * instead of schedule-polling. Since the early-market lanes of 2026-09-01 it fires HOURS
   * ahead, not minutes: measured over the 48h to 2026-09-03 11:00 UTC, the first price landed a
   * median 10.1h before the jump on AU thoroughbreds, 5.3h on greyhounds, 6.8h on harness -
   * typically overnight or early morning for the day's card, from one or two early books; the
   * full board fills inside about an hour of the jump. `race.result` (from 2026-10-13): a race's
   * result just went `final` — fires once per race, carrying the race (`race_id`, `result_id`,
   * venue, race number, start, country, category), the placings ({position, name, number,
   * horse_ref}), the `dividends` where the settling source declares them, and `source`.
   * `race_id` is the id race.odds_open and /v1/racing/next-to-go carried for the race, and is
   * null on the rare result we could not link to a priced race (10 of 2,038 final results in the
   * 7 days to 2026-10-12); `result_id` is always set. A result goes final once its placings have
   * been stable for 30 minutes, and the event follows within about five minutes of that:
   * measured over the 3 days to 2026-10-12, results went final a median 36 minutes after the
   * advertised start on AU and NZ races (p90 39), 38 on British and Irish thoroughbreds, and
   * about 4 on British and Irish greyhounds, whose source publishes the result already final. It
   * is the same row /v1/racing/results serves, so settle on it exactly as you would on that
   * endpoint. `odds.change` is delivered solely by POST /v1/webhooks/{id}/test. `market.suspend`
   * was withdrawn on 2026-10-13 — it never had a producer — and is now refused with 422.
   */
  events?: string[];
  /**
   * Only deliver arb.opportunity when the theoretical edge is at least this percentage. Omit for
   * every opportunity.
   */
  min_edge_pct?: number | null;
  /**
   * Only deliver events for these sports. Sport keys as returned by GET /v1/sports; racing
   * events (arbs, race.odds_open and race.result) arrive as racing_horse, racing_greyhound or
   * racing_harness. Omit for all sports.
   */
  sports?: string[] | null;
}

export interface WebhookDeliveryResponse {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: unknown | null;
  /**
   * delivered (receiver answered 2xx) or failed (every attempt refused or the answer was final,
   * see `error`). Rows written before 2026-09-03 read `pending`.
   */
  status?: string;
  /** POST attempts made for this row: at most 2, or at most 6 when the delivery queue is enabled. */
  attempt_count?: number;
  status_code: number | null;
  error: string | null;
  delivered_at: string | null;
  /** Per-attempt detail, only with `include=attempts`. */
  attempts?: WebhookAttempt[] | null;
}

export interface WebhookReplayResponse {
  id: string;
  /** Events queued for re-delivery by this call. */
  requeued: number;
  since: string;
  status: string;
  max_per_call: number;
}

export interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
  min_edge_pct?: number | null;
  sports?: string[] | null;
  is_active: boolean;
  created_at: string | null;
  last_delivery_at: string | null;
  failure_count: number;
  secret?: string | null;
  delivery_entitled?: boolean;
  delivery_paused_reason?: string | null;
  paused_at?: string | null;
  paused_reason?: string | null;
}

export interface WebhookResumeResponse {
  id: string;
  resumed: boolean;
  /** The `odds.change` probe queued to confirm the endpoint answers. */
  probe_event_id?: string | null;
}

export interface WebhookRotateResponse {
  id: string;
  secret: string;
  /** Until then every delivery is also signed with the previous secret. */
  previous_secret_expires_at: string;
}

export interface WidgetIn {
  /** What this widget is for — 'homepage next-to-go', 'AFL page'. Shown in GET /v1/widgets. */
  label: string;
  /**
   * Theme, links, allowed_origins, defaults, title, show_updated and max_fills_per_hour. Every
   * field is optional; the response carries the normalised document that is actually stored.
   */
  config?: Record<string, unknown> | null;
}

export interface WidgetPatchIn {
  label?: string | null;
  /**
   * FULL replacement after validation, not a merge — send the whole config back with your change
   * in it, or omit the field to leave the stored one alone.
   */
  config?: Record<string, unknown> | null;
}

export interface _ReauthIn {
  password?: string | null;
}
