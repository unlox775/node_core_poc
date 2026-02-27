#!/usr/bin/env node
/**
 * Converts a unified diff (git patch) to markdown with human-editable instructions.
 * Usage: node bin/patch-to-markdown.js <path-to-patch>
 * Output: writes to <patch-dir>/phase4-manual-patch.md
 */

const fs = require("fs");
const path = require("path");

const patchPath = process.argv[2];
if (!patchPath || !fs.existsSync(patchPath)) {
  console.error("Usage: node bin/patch-to-markdown.js <path-to-phase4.patch>");
  process.exit(1);
}

const content = fs.readFileSync(patchPath, "utf8");
const outPath = path.join(path.dirname(patchPath), "phase4-manual-patch.md");

function parsePatch(text) {
  const files = [];
  const blocks = text.split(/(?=^diff --git )/m).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n");
    const header = lines[0];
    if (!header.startsWith("diff --git ")) continue;

    const match = header.match(/diff --git [ab]\/(.+) [ab]\//);
    const filePath = match ? match[1] : "";

    let isNewFile = false;
    let oldPath = "",
      newPath = "";
    let hunks = [];
    let i = 1;

    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("--- ")) {
        oldPath = line.slice(4).trim();
        if (oldPath === "/dev/null") isNewFile = true;
      } else if (line.startsWith("+++ ")) {
        newPath = line.slice(4).trim();
      } else if (line.startsWith("@@ ")) {
        const hunkMatch = line.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/);
        if (hunkMatch) {
          const [, oldStart, oldCount, newStart, newCount, ctx] = hunkMatch;
          hunks.push({
            oldStart: parseInt(oldStart, 10),
            oldCount: parseInt(oldCount || "1", 10),
            newStart: parseInt(newStart, 10),
            newCount: parseInt(newCount || "1", 10),
            context: ctx.trim(),
            removals: [],
            additions: [],
            contextBefore: [],
          });
        }
        i++;
        break;
      }
      i++;
    }

    let curHunk = hunks[hunks.length - 1];
    let oldLine = curHunk ? curHunk.oldStart : 0;
    let newLine = curHunk ? curHunk.newStart : 0;

    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("diff --git ")) {
        i--;
        break;
      }
      if (line.startsWith("@@ ")) {
        const hunkMatch = line.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/);
        if (hunkMatch) {
          const [, oStart, oCnt, nStart, nCnt, ctx] = hunkMatch;
          curHunk = {
            oldStart: parseInt(oStart, 10),
            oldCount: parseInt(oCnt || "1", 10),
            newStart: parseInt(nStart, 10),
            newCount: parseInt(nCnt || "1", 10),
            context: ctx.trim(),
            removals: [],
            additions: [],
            contextBefore: [],
          };
          hunks.push(curHunk);
          oldLine = curHunk.oldStart;
          newLine = curHunk.newStart;
        }
        i++;
        continue;
      }
      if (!curHunk) {
        i++;
        continue;
      }
      if (line.startsWith("-") && !line.startsWith("---")) {
        curHunk.removals.push({ lineNum: oldLine, text: line.slice(1) });
        oldLine++;
      } else if (line.startsWith("+") && !line.startsWith("+++")) {
        curHunk.additions.push({ lineNum: newLine, text: line.slice(1) });
        newLine++;
      } else if (line.startsWith(" ")) {
        curHunk.contextBefore.push(line.slice(1));
        oldLine++;
        newLine++;
      }
      i++;
    }

    files.push({ filePath, isNewFile, hunks });
  }

  return files;
}

function toMarkdown(files) {
  const parts = [];
  parts.push("# Phase 4: Manual Patch Instructions");
  parts.push("");
  parts.push("If you prefer to apply the changes manually instead of `git apply`, follow these edits.");
  parts.push("Line numbers and context help you locate each change.");
  parts.push("");

  const lang = (p) => {
    if (p.endsWith(".ts") || p.endsWith(".tsx")) return "typescript";
    if (p.endsWith(".prisma")) return "prisma";
    if (p.endsWith(".js") || p.endsWith(".jsx")) return "javascript";
    return "";
  };

  for (const { filePath, isNewFile, hunks } of files) {
    const shortPath = filePath.replace(/^packages\/[^/]+\//, "");
    const codeLang = lang(shortPath);
    const fence = codeLang ? "```" + codeLang : "```";
    parts.push(`## File: \`${shortPath}\``);
    parts.push("");

    if (isNewFile) {
      const addLines = hunks.flatMap((h) => h.additions.map((a) => a.text));
      parts.push("**Create this file** with the following content:");
      parts.push("");
      parts.push(fence);
      parts.push(addLines.join("\n"));
      parts.push("```");
      parts.push("");
      continue;
    }

    for (let idx = 0; idx < hunks.length; idx++) {
      const h = hunks[idx];
      const editNum = hunks.length > 1 ? ` (edit ${idx + 1}/${hunks.length})` : "";
      const lineRef = h.oldStart;
      const anchor =
        h.contextBefore.length > 0 ? h.contextBefore[h.contextBefore.length - 1].trim() : null;

      parts.push(`### Edit${editNum}: around line ${lineRef}`);
      if (anchor) {
        parts.push(`**After the line** containing \`${anchor.length > 60 ? anchor.slice(0, 57) + "..." : anchor}\`:`);
      }
      parts.push("");

      if (h.removals.length > 0 && h.additions.length > 0) {
        parts.push("**Replace:**");
        parts.push(fence);
        parts.push(...h.removals.map((r) => r.text));
        parts.push("```");
        parts.push("");
        parts.push("**With:**");
        parts.push(fence);
        parts.push(...h.additions.map((a) => a.text));
        parts.push("```");
      } else if (h.removals.length > 0) {
        parts.push("**Remove these lines:**");
        parts.push(fence);
        parts.push(...h.removals.map((r) => r.text));
        parts.push("```");
      } else if (h.additions.length > 0) {
        parts.push("**Add these lines:**");
        parts.push(fence);
        parts.push(...h.additions.map((a) => a.text));
        parts.push("```");
      }
      parts.push("");
    }
  }

  return parts.join("\n");
}

const files = parsePatch(content);
const md = toMarkdown(files);
fs.writeFileSync(outPath, md);
console.log(`Wrote ${outPath}`);
