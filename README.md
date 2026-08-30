# autorob.github.io

Course site for AutoRob — Agentic Edition (Michigan Robotics 380/511, EECS 367), served at
[autorob.org](https://autorob.org).

Built with [MkDocs](https://www.mkdocs.org/) and the [Material](https://squidfunk.github.io/mkdocs-material/)
theme; lecture slides are authored as [reveal.js](https://revealjs.com/) decks via
[`reveal-md`](https://github.com/webpro/reveal-md).

## Local development

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

## Building

```bash
mkdocs build --strict
npm ci
node scripts/build-slides.mjs
```

See `slides/_template/AUTHORING.md` for the lecture-slide authoring workflow, and
`scripts/sync_project1_content.sh` for how Project 1 content is synced from
[`autorob_agentic`](https://github.com/odestcj/autorob_agentic).
