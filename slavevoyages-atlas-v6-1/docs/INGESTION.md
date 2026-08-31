# v0.6 authoritative ingestion

SlaveVoyages publishes downloadable Trans-Atlantic database editions and a codebook. The official downloads page documents the expanded 2019 edition as 36,108 voyages and 274 variables and provides CSV/SPSS downloads; the 2023 codebook defines data, imputed and geographic variables.

Set the repository variable `SV_SOURCE_URL` to the exact authoritative CSV endpoint selected for a release. The pipeline does not guess a URL or substitute a third-party mirror.

Refresh: acquire -> SHA-256 -> detect CSV format -> resolve only schema-approved fields -> normalize -> validate -> write static snapshot -> commit.

A failed validation exits before commit, leaving the last valid snapshot in GitHub Pages.
