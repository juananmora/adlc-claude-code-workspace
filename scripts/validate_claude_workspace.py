#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

def frontmatter(path: Path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{path}: missing opening YAML frontmatter")
    end = text.find("\n---", 4)
    if end == -1:
        raise ValueError(f"{path}: missing closing YAML frontmatter")
    raw = text[4:end].strip()
    body = text[end+4:].strip()
    data = {}
    current = None
    for line in raw.splitlines():
        if not line.strip():
            continue
        if re.match(r"^[A-Za-z0-9_-]+:", line):
            k, v = line.split(":", 1)
            current = k.strip()
            v = v.strip()
            if v:
                data[current] = v.strip('"').strip("'")
            else:
                data[current] = []
        elif line.strip().startswith("- ") and current:
            if not isinstance(data.get(current), list):
                data[current] = []
            data[current].append(line.strip()[2:].strip('"').strip("'"))
    return data, body

def check_agent(path: Path):
    data, body = frontmatter(path)
    for required in ("name", "description"):
        if required not in data or not data[required]:
            raise ValueError(f"{path}: missing required field '{required}'")
    if not re.fullmatch(r"[a-z0-9-]+", data["name"]):
        raise ValueError(f"{path}: agent name must be lowercase letters, numbers and hyphens: {data['name']}")
    if not body:
        raise ValueError(f"{path}: empty markdown body/system prompt")
    if "tools" in data and "Skill" in str(data["tools"]):
        raise ValueError(f"{path}: do not list Skill under tools; use the skills frontmatter field")

def check_skill(path: Path):
    data, body = frontmatter(path)
    if "description" not in data or not data["description"]:
        raise ValueError(f"{path}: skills should include description")
    if "name" in data and not re.fullmatch(r"[a-z0-9-]{1,64}", data["name"]):
        raise ValueError(f"{path}: skill name must be lowercase letters, numbers and hyphens, max 64 chars")
    if not body:
        raise ValueError(f"{path}: empty markdown body")

def main():
    agents = list((ROOT / ".claude" / "agents").rglob("*.md"))
    skills = list((ROOT / ".claude" / "skills").rglob("SKILL.md"))
    if not agents:
        raise ValueError("No agents found under .claude/agents")
    if not skills:
        raise ValueError("No skills found under .claude/skills/<skill-name>/SKILL.md")
    for p in agents:
        check_agent(p)
    for p in skills:
        check_skill(p)
    print(f"OK: {len(agents)} agents and {len(skills)} skills validated")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
