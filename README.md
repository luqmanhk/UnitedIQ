# UnitedIQ

An independent Manchester United-inspired recruitment decision lab. A complete vertical slice: recruitment dashboard → searchable scouting directory → explainable profiles and comparison → budget-constrained transfer plan. All football data is fictional. No live market or AI prediction claims.

## Stack and setup

Next.js App Router page and route conventions, TypeScript, Tailwind CSS 4, Recharts, Lucide, React 19. This repository is the portable native Next.js source, ready for local development and Vercel. The separately published ChatGPT Sites demo uses a Cloudflare adapter.

Node 24+ recommended (native TypeScript stripping runs the tests).

```sh
npm install
npm run dev:next
npm test
npx tsc --noEmit
npm run build:vercel
npm run start:next
```

## Open in VS Code

```sh
git clone https://github.com/luqmanhk/UnitedIQ.git
cd UnitedIQ
npm install
code UnitedIQ.code-workspace
```

Run `npm run dev` in the VS Code terminal, then open http://localhost:3000. Press F5 to start the Next.js debugger, or use Terminal → Run Task for development, tests, typechecking and production builds. Requires Node.js 24+ and Git. If the `code` command is unavailable on macOS, open VS Code, press Cmd+Shift+P and choose “Shell Command: Install code command in PATH”, or use File → Open Folder.

The published ChatGPT Sites demo and this GitHub repository are separate deployment targets; pushing here does not automatically update that demo. Import this repository into Vercel to deploy GitHub changes automatically.

### Vercel

Import this repository into Vercel, select **Next.js**, and use the included `vercel.json`: build `npm run build:vercel`, output `.next`, install `npm install`. No environment variables, database or secrets are needed. A normal Node deployment can use `next start` after `next build`. Sites deployment is a separate Cloudflare adapter build, not a native Next server deployment.

## Structure

- `app/page.tsx`: recruitment dashboard.
- `app/scouting/page.tsx`: search, position and fee filters, up to three-player comparison, detailed profiles.
- `app/simulator/page.tsx`: budget, recruitment priorities and configurable role limits.
- `app/api/players/route.ts`: scored directory (`GET`, optional validated `priority`).
- `app/api/simulate/route.ts`: validated optimization (`POST`).
- `lib/types.ts`: typed player schema, role and strategy types.
- `lib/scoring.ts`: pure position-relative normalization and weighted scoring.
- `lib/optimizer.ts`: exact feasible subset selection and deterministic greedy baseline.
- `data/players.json`: 16 curated fictional profiles, four each at ST, CM, CB and RW.
- `tests/engine.test.ts`: scoring isolation, shrinkage, constraints, greedy counterexample, deterministic results and empty/ineligible cases.

Example calculation request:

```sh
curl -X POST http://localhost:3000/api/simulate \
  -H 'Content-Type: application/json' \
  -d '{"budget":100,"priority":"balanced","needs":{"ST":1,"CM":1,"CB":1,"RW":0}}'
```

Budget must be a finite number from 0 to 500 (EUR millions). Each positional limit must be an integer from 0 to 2. Invalid/malformed input returns HTTP 400 and a message. Budget includes transfer fees only; no wages or add-ons.

## Methodology

1. All metrics are higher-is-better per-90 rates: goals, assists, progressive actions, tackles and successful duels. Eligible comparison peers have at least 450 minutes and share the exact position.
2. A statistic's mid-rank percentile is `100 * (number below + 0.5 * number equal) / peer count`. Tied values share a percentile. The player is included in their own reference group. No peers gives a neutral 50.
3. Weighted metric percentiles produce the raw performance score.

| Role | Goals | Assists | Progression | Tackles | Duels |
| --- | ---: | ---: | ---: | ---: | ---: |
| ST | 50% | 15% | 10% | 5% | 20% |
| CM | 10% | 20% | 40% | 20% | 10% |
| CB | 5% | 5% | 20% | 30% | 40% |
| RW | 30% | 30% | 30% | 5% | 5% |

4. Sample guardrail: `reliability = min(minutes / 1800, 1)`. Adjusted performance = `50 + (raw - 50) * reliability`. Fewer than 900 minutes receives a small-sample warning in the directory and profile. Under 450 minutes is excluded from the optimizer.
5. Youth score = `clamp((32 - age) / 14 * 100, 0, 100)`. Balanced is 85% adjusted performance + 15% youth; win-now is 100% adjusted performance; development is 65% adjusted performance + 35% youth. Scores are rounded to one decimal. Age preference is a configurable heuristic in code, not evidence of future potential.
6. The exact optimizer enumerates all feasible subsets of the 16-player universe (at most 65,536 subsets), respecting fee sum, no duplicate IDs and per-position maxima. Utility is the sum of `100 + strategy score` per signing. This rewards coverage while retaining quality trade-offs; it does not guarantee filling every role first. Equal utility prefers lower cost; remaining ties use stable traversal. Unfilled roles are explicitly reported.
7. Baseline sorts by `(100 + score) / fee`, then ID, greedily takes affordable signings within role caps. It is deterministic but not generally optimal. Tests contain a case where it loses to exact selection. Both objectives and baseline cost appear beside the result.

## Data and attribution

Every name, affiliation, age, season label, minute total, rate and estimated fee in the seed file is synthetic and illustrative, authored for UnitedIQ. Any coincidental resemblance to a real person or club is unintended. “2025/26” is merely a scenario label and must not be read as a historical or current record. Fees are fictional EUR-million scenario inputs, not market valuations. Each record includes feeSource, dataSource and dataConfidence. No external football dataset is used or attributed. Icons use Lucide (ISC); charts use Recharts (MIT); platform dependencies retain their own licenses. The interface uses original CSS graphics and initials, no club crest or player photography. Not affiliated with or endorsed by Manchester United Football Club.

## Limitations

Only four peers per position make percentiles coarse. “Fit” is shorthand for the declared weighted heuristic, not measured tactical fit. No league-strength, possession, team context, injury, medical, contract, wage, availability, work permit or scouting-video model exists. No real United squad diagnosis is made. Samples and fixtures are synthetic, and confidence is illustrative. Missing metrics are not supported by the current schema; production ingestion must validate complete records rather than silently treating missing fields as zero. Score normalization assumes one consistent season and rate definition. Exact enumeration is deliberately suitable only for the tiny MVP and must be replaced for a large dataset. The UI is stateless between routes; compare lists and simulator inputs reset on navigation. No authentication or persistence is needed for the local-data MVP.

## Verification

`npm test` runs six deterministic engine tests. `npx tsc --noEmit` checks all application types. Build both deployment targets when changing platform-specific code. Browser-check the flow through search, comparison, profile, and simulation; test a zero budget and empty needs. No commercial data sources or external APIs are called.

## Next steps

Add licensed, timestamped real data and schema validation; support unknown fees/statistics explicitly; expand positional roles and season selectors; adjust for league/team context; incorporate wages and availability constraints; add persisted shortlists; replace subset enumeration with multiple-choice knapsack or integer programming; validate rankings against scouting judgments and historical outcomes. Add API contract and browser regression tests before widening scope.
