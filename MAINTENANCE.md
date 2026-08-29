# Maintenance

Paul Gould is the accountable owner for this repository. HollyHR reviews
dependency updates weekly and performs a human example review whenever the
public API, hosted MCP write contract or official SDK changes.

This repository is not a separately versioned package. `main` is the supported
example set, and every executable change must pass the repository check before
merge. Examples pin immutable SDK dependencies and move forward only after the
corresponding public package is published and verified.

If an example cannot be kept accurate and safe, HollyHR will remove it or mark
the repository read-only rather than leave an apparently supported workflow to
decay.
