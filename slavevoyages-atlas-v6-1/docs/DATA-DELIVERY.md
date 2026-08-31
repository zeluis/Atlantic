# v0.8 data delivery

The browser should not ship the raw 274-variable CSV. GitHub Actions converts the authoritative CSV into a compact canonical projection and deterministic JSON chunks (2,000 records per chunk).

The browser then:

1. loads the manifest;
2. downloads chunks in deterministic order;
3. stores records in IndexedDB;
4. reuses the IndexedDB snapshot when the source SHA-256 is unchanged;
5. sends the records to a Web Worker for analytical queries;
6. caches fetched chunks in the Service Worker for subsequent offline sessions.

The published dataset remains static and versioned. There is no runtime dependency on the SlaveVoyages API.

## Source
The official downloads page documents the 2019 expanded CSV as 36,108 voyages and 274 variables. The pinned URL in `data/source.json` is the direct CSV endpoint; if the upstream endpoint changes, update it deliberately and retain the resulting source hash in `data/manifest.json`.
