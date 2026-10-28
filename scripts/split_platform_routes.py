# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(r"C:\Dev\vinverse\vinverse-ui\src")
plat = (ROOT / "pages" / "Platform.jsx").read_text(encoding="utf-8")
lines = plat.splitlines()

# helpers: lines 7-267 (0-index 6:268) — OPENER through deriveProjectPatch inclusive
helpers = "\n".join(lines[6:268])
chat_panel = "\n".join(lines[268:304])
overview = "\n".join(lines[304:398])

(ROOT / "platform").mkdir(exist_ok=True)
(ROOT / "pages" / "platform").mkdir(exist_ok=True)

# Fix helper exports
helpers_js = helpers
# ensure export keywords
for name in [
    "OPENER",
]:
    helpers_js = helpers_js.replace("const OPENER =", "export const OPENER =", 1)
for name in [
    "makeOpenerMessages",
    "emptyDetails",
    "titleFromText",
    "extractListItems",
    "deriveProjectPatch",
]:
    helpers_js = helpers_js.replace(f"function {name}", f"export function {name}", 1)

# starterProjects is const — export it
helpers_js = helpers_js.replace("const starterProjects =", "export const starterProjects =", 1)

(ROOT / "platform" / "projectModel.js").write_text(helpers_js + "\n", encoding="utf-8")

(ROOT / "platform" / "ChatPanel.jsx").write_text(
    "export " + chat_panel + "\n", encoding="utf-8"
)

# ProjectOverview uses Link? check - if not, fine
overview_src = overview
if "Link" in overview_src and "import" not in overview_src[:80]:
    overview_src = 'import { Link } from "react-router-dom";\n\n' + overview_src
(ROOT / "platform" / "ProjectOverview.jsx").write_text(
    "export " + overview_src + "\n", encoding="utf-8"
)

print("model/chat/overview written")
print("starterProjects export ok", "export const starterProjects" in helpers_js)
