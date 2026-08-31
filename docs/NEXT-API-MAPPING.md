# API mapping

The current SlaveVoyages API exposes OpenAPI documentation and voyage endpoints including `/voyage/`, `/voyage/{voyage_id}`, `/voyage/aggregations/`, `/voyage/aggroutes/`, `/voyage/dataframes/`, `/voyage/geotree/`, `/voyage/lineandbarcharts/`, `/voyage/piecharts/`, `/voyage/SummaryStats/`, and `/voyage/VoyageDownload/`.

The first production ingestion stage uses the documented downloadable expanded CSV because it provides a stable bulk snapshot suitable for GitHub Actions and offline publication. The API layer should be added next as a separate adapter after pinning the exact OpenAPI request/response schema and pagination semantics.
