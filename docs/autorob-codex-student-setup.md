# The `autorob-codex` agent — student setup

This guide sets up **`autorob-codex`**: a copy of the [Codex CLI](https://developers.openai.com/codex)
that is dedicated to your AUTOROB coursework. It authenticates with the U-M
GPT Toolkit API key your course staff gave you, keeps its configuration and
history completely separate from any personal Codex you might use, and runs from
one command: `autorob-codex`.

**Time:** about 10 minutes. **No admin rights, no separate account, no `sudo`.**

**Never** put the API key into a file you commit, a prompt, a screenshot, a
chat message, an issue, or a shell command argument. It belongs in exactly one
place, which step 6 creates for you.

---

## 1. What you're building

`autorob-codex` is not a different program. It is the same `codex` binary,
pointed at a **separate configuration directory** (`~/.autorob-codex`) by a small
launcher script. That directory holds its own API key, model settings, and
session history, so it never mixes with a personal `~/.codex`.

| | personal `codex` | `autorob-codex` |
|---|---|---|
| Config dir (`CODEX_HOME`) | `~/.codex` | `~/.autorob-codex` |
| Model auth | your ChatGPT sign-in, or a personal key | U-M GPT Toolkit API key in `~/.autorob-codex/auth.json` |
| Model provider | OpenAI (default) | `toolkit` → `https://api.toolkit.umgpt.umich.edu/v1` |
| Session history / memory | your normal settings | off — nothing retained between sessions |
| Command you run | `codex` | `autorob-codex` |

If you have never used Codex before, you simply won't have the left column.
That's fine — nothing here touches or requires it.

---

## 2. Prerequisites

- **Operating system:** macOS (Intel or Apple Silicon) or Linux. On Windows, do
  everything below **inside WSL2** (Ubuntu) — a native PowerShell/CMD setup is
  not covered here.
- **Node.js 20 or newer** (this gives you `npm`). Check with `node --version`.
  - **macOS:** `brew install node` (needs [Homebrew](https://brew.sh)), or use
    [nvm](https://github.com/nvm-sh/nvm).
  - **Linux / WSL2:** use [nvm](https://github.com/nvm-sh/nvm) — the `nodejs`
    package in most distributions is too old. After installing nvm:
    `nvm install --lts`.
  - You can skip Node entirely if you use the standalone installer in step 3.
- **Your Toolkit API key** — your course staff will give this to you. It starts
  with `sk-`. Treat it exactly like a password (see [§10](#10-safety-hygiene)).
- **Your AUTOROB project directory** — wherever your `Makefile` and source live,
  for example `~/autorob/my-project`. This guide uses that as the example path;
  substitute your own everywhere it appears.

---

## 3. Install the Codex CLI

Pick **one**:

```bash
# Option A — npm (works anywhere Node.js does)
npm install -g @openai/codex

# Option B — standalone installer, no Node.js required (macOS / Linux / WSL2)
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# Option C — Homebrew (macOS)
brew install --cask codex
```

Confirm it is installed and on your `PATH`:

```bash
codex --version      # expect 0.149.x or newer
```

If you get `codex: command not found`:

- **Option A (npm):** run `npm prefix -g`; its `bin` subdirectory must be on your
  `PATH`.
- **Option B (standalone):** it installs to `~/.local/bin`. Step 8 adds that
  directory to your `PATH` — do that step now, then re-check.

---

## 4. Create the isolated Codex home

```bash
mkdir -p ~/.autorob-codex
```

That directory *is* the isolation. Everything `autorob-codex` does — key, config,
logs, sessions — stays inside it.

---

## 5. Write the configuration

Create `~/.autorob-codex/config.toml` with this content:

```toml
# autorob-codex — dedicated Codex config for AUTOROB coursework.
# A personal ~/.codex/config.toml, if you have one, is NOT touched by this.

model_provider         = "toolkit"
model                  = "gpt-5.6-terra"
model_reasoning_effort = "high"

# The agent may read and edit files inside your project directory on its own,
# but must ask before running any shell command or touching anything outside it.
approval_policy = "on-request"
sandbox_mode    = "workspace-write"

[model_providers.toolkit]
name                 = "UM GPT Toolkit"
base_url             = "https://api.toolkit.umgpt.umich.edu/v1"
requires_openai_auth = true   # send the key from auth.json as the bearer token

# Keep the agent's footprint local: no cross-session history or memory.
[history]
persistence = "none"

[memories]
use_memories      = false
generate_memories = false

# Trust your project directory so you aren't re-prompted on every launch.
# CHANGE THIS PATH to the absolute path of the AUTOROB project you're working on.
[projects."/home/you/autorob/my-project"]
trust_level = "trusted"
```

Two things to edit:

1. **`[projects."..."]`** — replace `/home/you/autorob/my-project` with the real
   absolute path to your project. Run `echo "$HOME/autorob/my-project"` (adjust
   for your layout) to get the exact string; on macOS your home is `/Users/you`.
   Getting this wrong is harmless — it just means one extra trust prompt the
   first time.
2. **`model`** — `gpt-5.6-terra` is the expected Toolkit model. If step 7 returns
   a "model not found" or "not authorized" error, ask course staff which model ID
   your key may use and change it here.

---

## 6. Add the API key

The key goes in on **standard input only** — never as a command argument, never
into a file. Paste this block; it prompts you, hides what you type, and hands the
key straight to Codex:

```bash
stty -echo
printf 'Paste your Toolkit API key, then press Enter: '
IFS= read -r AUTOROB_KEY
stty echo; printf '\n'
printf '%s' "$AUTOROB_KEY" | CODEX_HOME="$HOME/.autorob-codex" codex login --with-api-key
unset AUTOROB_KEY
```

This writes `~/.autorob-codex/auth.json`, permissions `0600` (only you can read
it), containing:

```json
{ "auth_mode": "apikey", "OPENAI_API_KEY": "..." }
```

---

## 7. Test it works

```bash
# Validate config + key + provider in one shot (makes one real Toolkit request):
CODEX_HOME="$HOME/.autorob-codex" codex exec --skip-git-repo-check --strict-config 'reply with exactly: ok'
```

- Prints `ok` → everything works. Continue to step 8.
- `unknown configuration field ...` or a TOML parse error → a typo in
  `config.toml`; fix it (the message gives the line number) and re-run.
- `401` / `invalid api key` → the key wasn't pasted correctly; redo step 6.
- model error → see the `model` note in step 5.

Two more checks:

```bash
# Auth is an API key, not a ChatGPT login:
CODEX_HOME="$HOME/.autorob-codex" codex login status
#   -> Logged in using an API key - sk-...

# Your personal Codex (if any) is untouched:
ls ~/.codex 2>/dev/null && echo "(personal codex still has its own config)" \
                        || echo "(no personal codex — that's fine)"
```

---

## 8. Install the `autorob-codex` launcher

```bash
mkdir -p ~/.local/bin
cat > ~/.local/bin/autorob-codex <<'EOF'
#!/usr/bin/env bash
# autorob-codex — Codex CLI scoped to AUTOROB coursework.
# Config, API key and history live in $CODEX_HOME below, separate from ~/.codex.
set -euo pipefail

export CODEX_HOME="${AUTOROB_CODEX_HOME:-$HOME/.autorob-codex}"

if [[ ! -f "$CODEX_HOME/config.toml" ]]; then
  echo "autorob-codex: $CODEX_HOME is not set up — see autorob-codex-student-setup.md" >&2
  exit 1
fi

# Optional: if AUTOROB_PROJECT_DIR is set, start there unless already inside it.
if [[ -n "${AUTOROB_PROJECT_DIR:-}" ]]; then
  proj="${AUTOROB_PROJECT_DIR%/}"
  [[ "$PWD/" == "$proj"/* ]] || cd "$proj"
fi

# Never let a personal key in the environment override the Toolkit key.
exec env -u OPENAI_API_KEY -u OPENAI_BASE_URL codex "$@"
EOF
chmod 700 ~/.local/bin/autorob-codex
```

Make sure `~/.local/bin` is on your `PATH`:

```bash
case ":$PATH:" in *":$HOME/.local/bin:"*) echo "on PATH" ;; *) echo "NOT on PATH" ;; esac
```

If it says **NOT**, add this line to your shell startup file, then open a new
terminal:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

- **Linux / WSL2** (bash): put it in `~/.profile` (or `~/.bashrc`).
- **macOS** (zsh, the default shell): put it in `~/.zprofile` (or `~/.zshrc`).

Confirm the launcher resolves and runs:

```bash
command -v autorob-codex                       # -> ~/.local/bin/autorob-codex
autorob-codex exec --skip-git-repo-check 'reply with exactly: ok'    # -> ok
```

---

## 9. Daily use

```bash
cd ~/autorob/my-project
autorob-codex                     # interactive session, rooted in this directory
```

Other forms:

```bash
autorob-codex "why does make test fail?"
autorob-codex exec 'summarize what changed in the last commit'   # one-shot, no UI
autorob-codex resume                                             # continue a past session
```

**Optional** — jump straight to your project from anywhere. Add to `~/.profile`
(or `~/.zprofile` on macOS):

```bash
export AUTOROB_PROJECT_DIR="$HOME/autorob/my-project"
```

Then a bare `autorob-codex` always starts in your project directory.

**What the agent can do**, with the settings from step 5:

- **On its own:** read and edit files inside your project directory.
- **Asks first:** running any shell command (`make`, `git`, `python`, …), editing
  files outside the project, network access.
- To let it run commands without a prompt for a session, start it with
  `autorob-codex --approve-for-me` (it still cannot leave the project directory).
  Only do this while you are watching it.

---

## 10. Safety & hygiene

- **The key is a shared credential.** Anyone who has it can spend against the
  course's Toolkit account as you. Never paste it into prompts, chats,
  screenshots, issues, or commits.
- **It lives in exactly one file:** `~/.autorob-codex/auth.json` (mode `0600`).
  Don't copy it elsewhere. If your project directory ever contains a
  `.autorob-codex/` folder, add that to `.gitignore`.
- **`codex login status` prints a fragment of the key** — don't share that output
  either.
- **Rotating the key** (if it leaks, or when staff ask): get the new key and
  re-run step 6. Nothing else changes.
- **`git` still runs as you.** `autorob-codex` does not change your Git identity
  or credentials. With `approval_policy = "on-request"` it asks before running
  `git` at all — read those prompts; don't approve a `git push` you didn't
  intend.
- **Cost:** every request is billed to the course Toolkit account. Don't leave
  `autorob-codex exec` running in a loop.

---

## 11. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `codex: command not found` | Install directory not on `PATH`. npm: `npm prefix -g`/`bin`. Standalone: `~/.local/bin` (step 8). |
| `autorob-codex: ... is not set up` | Launcher ran before step 4/5. Create `~/.autorob-codex/config.toml`. |
| `unknown configuration field` | Typo in `config.toml`; the message gives the line. Compare against step 5. |
| `401` / `invalid api key` | Key mistyped in step 6, or it has been rotated. Redo step 6. |
| `model ... not found` / `not authorized` | Your key can't use `gpt-5.6-terra`. Ask staff for the right model ID; set it in `config.toml`. |
| Agent seems to use ChatGPT or a personal account | You ran `codex`, not `autorob-codex` — or `CODEX_HOME` didn't take. Check `autorob-codex login status`. |
| A command the agent runs fails with a permission error | The `workspace-write` sandbox. Approve the prompt, or run the command yourself outside the agent. Do **not** switch to `danger-full-access`. |
| Need a deeper look | `CODEX_HOME="$HOME/.autorob-codex" codex doctor` |
