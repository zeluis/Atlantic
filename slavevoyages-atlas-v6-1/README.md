# SlaveVoyages Data Atlas — v1.0

A zero-runtime-dependency, offline-first research interface for the SlaveVoyages Trans-Atlantic Slave Trade Database.

## Runtime architecture

- Static HTML/CSS/JavaScript only.
- No React, Vue, Svelte, D3, Chart.js, Leaflet, CDN, analytics SDK, or runtime API dependency.
- IndexedDB stores the local voyage projection.
- A Web Worker performs filtering and aggregation off the main thread.
- Service Worker caches the application shell and published static artifacts.
- GitHub Actions refreshes the dataset and deploys GitHub Pages.

## Data policy

The repository may contain a bootstrap placeholder so the UI can be opened before the first successful source refresh. It is explicitly not presented as historical SlaveVoyages data. Configure the repository variable `SV_SOURCE_URL` with the exact authoritative SlaveVoyages CSV endpoint before production data refresh.

The ingestion pipeline records the source SHA-256 and release metadata. It normalizes only fields defined by `data/schema.json`; it does not invent missing observations.

## Local development

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

## GitHub Pages

Repository Settings → Pages → Build and deployment → Source: GitHub Actions.

## Refresh

Set repository variable `SV_SOURCE_URL`. Run **Refresh SlaveVoyages dataset** manually once to establish the first authoritative snapshot. Scheduled refreshes then run weekly.

## Offline behavior

First visit requires connectivity to download the published dataset. After synchronization, voyage records are available from IndexedDB while offline. The service worker supplies the application shell offline.

## v1.1 authoritative ingestion

The default refresh target is the official SlaveVoyages expanded Trans-Atlantic CSV listed on its downloads page: `tastdb-exp-2019.csv`. The pipeline preserves the complete source-column set, promotes dashboard fields, records SHA-256 provenance, validates voyage IDs and numeric ranges, builds deterministic chunks and indexes, and emits a metric registry separating observed from imputed quantities.
