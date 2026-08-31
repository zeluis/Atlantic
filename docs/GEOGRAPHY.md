# v0.5 Geographic intelligence

SlaveVoyages states that geographical variables use five-digit codes: the first digit identifies a broad region, digits two and three a specific region, and digits four and five a place/port. The expanded data can contain special historical-jurisdiction cases where a region is not mechanically identical to the place-code hierarchy.

The production model therefore retains both the original geographic code and explicit source regional variables. Coordinates must be attached only through an auditable geographic mapping; modern-name geocoding must not silently replace historical locations.

The current route map contains **bootstrap coordinates only** so that the UI can be exercised without external mapping libraries. They are not a claim that these five demonstration routes represent the full dataset.
