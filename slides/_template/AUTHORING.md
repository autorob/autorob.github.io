# Converting a Keynote lecture to reveal.js

This is a per-lecture, hand-authoring workflow, not an automated converter — no `.key` source
files exist for any past AutoRob lecture (only PDF exports under `docs/assets/lectures/`), so
there's no reliable automated Keynote → Markdown path. Budget roughly one retyping pass per
lecture, done alongside the archived PDF.

## Steps

1. Copy `slides/_template/slides.md` and its `assets/` folder into a new directory,
   `slides/lectureNN-<slug>/` (stub directories for all past lectures already exist under
   `slides/`).
2. Open the archived PDF for that lecture (`docs/assets/lectures/autorob_NN_*.pdf`) side by side
   with your editor.
3. Retype each Keynote slide as a `---`-separated section in `slides.md`. Titles become `##`
   headings; bullets become Markdown lists; code snippets become fenced code blocks.
4. Put per-lecture images in `slides/lectureNN-<slug>/assets/` and reference them with relative
   paths (`![](assets/diagram.png)`) — `reveal-md --static-dirs` carries this folder into the
   build output.
5. Update the "Slides" column for this lecture in `docs/lectures/index.md` to link to
   `/slides/lectureNN-<slug>/` instead of "not yet converted."

## Mapping Keynote effects to reveal.js

| Keynote effect | reveal.js equivalent | Notes |
| --- | --- | --- |
| Dissolve | `data-transition="fade"` | Direct equivalent |
| Push | `data-transition="slide"` (default) | Direct equivalent |
| Cube | `data-transition="convex"` or `"none"` | No exact 3D-cube equivalent; pick whichever reads better |
| Magic Move | **Auto-Animate**, not a transition | See below |
| Build In (bullets appearing) | `.fragment` class | See below |

### Magic Move → Auto-Animate

Split the one Keynote "morphing" slide into two or more consecutive slides, each written as a
raw `<section data-auto-animate>` block (reveal-md supports mixing raw HTML `<section>` blocks
with Markdown `---`-separated slides). Give every element that should visually morph a matching
`data-id` across those sections, and only change the properties that should animate (position,
size, text, color) between them — reveal.js will animate the difference automatically. See the
three-slide "Magic Move demo" in `slides.md` in this directory for a working example.

### Builds / bullet reveals

Mark list items (or any element) with `<!-- .element: class="fragment" -->` immediately after
them to make them appear one at a time on click, matching Keynote's "Build In."

### Speaker notes

Keynote presenter notes become a `Note:` block at the end of a slide's Markdown — see the first
slide of `slides.md` in this directory.

## Previewing

```bash
npm ci
npx reveal-md slides/lectureNN-<slug>/slides.md
```

## Building

`npm run slides:build` (or `node scripts/build-slides.mjs`) builds every lecture under `slides/`
(except `_template`) into `site/slides/<lecture-dir>/`, merging into MkDocs' build output. Always
run `mkdocs build` first — it wipes and regenerates `site/` from scratch, so the slide build must
run second.
