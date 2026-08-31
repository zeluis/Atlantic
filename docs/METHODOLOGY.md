# SlaveVoyages Atlas methodology

Raw source fields are immutable. Normalized, decoded, and dashboard-derived
fields are additive.

Evidence classes:
- data: documented/source values
- imputed: inferred/calculated by SlaveVoyages
- derived: calculated by this application

Five-digit geographic codes are decoded non-destructively into broad region,
specific region, and place/port components.

Each refresh records source URL/hash, record count, pipeline version, schema
version, and artifact hashes.
