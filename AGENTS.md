# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **Jekyll** static site (the "Jekyll Now" style theme) hosted on
GitHub Pages at https://kwanwaipang.github.io. Blog posts live in `_posts/` as Markdown
files named `YYYY-MM-DD-title.md`. There is no separate backend or database.

### Dependencies
- Ruby 3.2 (installed system-wide) + Bundler.
- Gems are declared in `Gemfile` (the `github-pages` gem, which pins Jekyll and the
  supported plugins to the same versions GitHub Pages uses in production).
- The update script runs `bundle install`, which installs gems into `.bundle-gems/`
  (a dot-prefixed dir so Jekyll ignores it) via the committed `.bundle/config`.

### Non-obvious caveats
- `_config.yml` defines its own `exclude:` list, which **overrides** Jekyll's default
  excludes. That is why gems are installed to a dot-prefixed directory (`.bundle-gems/`)
  rather than the conventional `vendor/bundle/` — otherwise Jekyll would try to build the
  gem sources and fail. Do not move the bundle path back to `vendor/bundle` without also
  adding `vendor` to the `exclude:` list.
- Always run Jekyll through Bundler: `bundle exec jekyll ...` (a bare `jekyll` is not on PATH).

### Common commands (run from the repo root)
- Serve with live reload (dev): `bundle exec jekyll serve --host 0.0.0.0 --port 4000`
  then open http://localhost:4000/. New/edited posts under `_posts/` auto-regenerate.
- Build: `bundle exec jekyll build` (output in `_site/`).
- Health/config check (closest thing to a lint): `bundle exec jekyll doctor`.

### Notes
- There is no automated test suite; verification is done by building/serving and
  visually confirming pages render.
- The sibling `blog_media` repo only hosts static media assets referenced by posts;
  it has no build/run step.
