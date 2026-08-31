# Data policy

1. Never silently merge observations from different SlaveVoyages editions.
2. Every refresh records the source URL, source byte count, SHA-256 hash, generation time and schema version.
3. Imputed and observed values must remain distinguishable. SlaveVoyages documentation notes that several voyage variables are imputed; the dashboard must not present imputed estimates as directly observed facts.
4. The browser consumes the normalized static projection only.
5. A failed refresh leaves the last committed valid dataset untouched.
6. Derived statistics must declare the source fields and transformation used.
