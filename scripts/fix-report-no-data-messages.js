// One-shot codemod for Format-Reports error handling.
//
// PROBLEM (user-reported, two parts):
//   1. Empty result sets were shown to the user as "Failed to load the X
//      report" — looks like a server failure when it's actually just zero
//      rows.
//   2. Real server / network errors were also shown as "Failed to load the
//      X report" — a hardcoded boilerplate that hides WHAT actually broke.
//      The user wants the actual backend / axios error to surface.
//
// FIX: rewrite each report page's `} catch { showErr(...) }` so it:
//
//   * If the HTTP status is 404 or 204 → toast
//       "No Data Found" / "No data found for the selected filters."
//     (This is a UX wording change only — backends that return 404 on
//     "no records" still show no-data to the user without code edits.)
//
//   * Otherwise → toast
//       "Fetch Failed" / <best-available error message>
//     where the message is taken in this preference order:
//       (1) err.response.data.message    (Spring default error body)
//       (2) err.response.data.error      (alternative field some
//                                         controllers use)
//       (3) err.response.data.errorMessage / error_description
//       (4) err.message                  (axios message,
//                                         e.g. "Network Error",
//                                         "Request failed with status 500")
//       (5) the original hardcoded text from the file (kept as a
//           guaranteed fallback so the user always sees SOMETHING).
//
// The original hardcoded string (eg. "Failed to load the ADS Chawki
// report." or the backtick variant `Failed to load the ${friendlyTitle}
// report.`) is preserved as that final fallback.
//
// Run from project root:  node scripts/fix-report-no-data-messages.js

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "src", "pages");

// Matches a bare `} catch {` OR `} catch (anyName) {` block whose body is a
// single showErr/errAlert call with the "Fetch Failed" / "Failed to load …"
// pair. Whitespace tolerant. The message capture group accepts both
// double-quoted strings and backtick template literals, so reports that
// embed a `${friendlyTitle}` keep their dynamic behaviour as the final
// fallback.
const CATCH_BLOCK = /\}\s*catch\s*(?:\(\s*[A-Za-z_$][\w$]*\s*\))?\s*\{\s*(showErr|errAlert)\s*\(\s*"Fetch Failed"\s*,\s*((?:"Failed to load[^"]*")|(?:`Failed to load[^`]*`))\s*\)\s*;?\s*\}/g;

let scanned = 0;
let changed = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith(".js")) {
      processFile(full);
    }
  }
}

function processFile(file) {
  scanned += 1;
  const original = fs.readFileSync(file, "utf8");
  const rewritten = original.replace(CATCH_BLOCK, (_match, helperName, originalMsg) => {
    return `} catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          ${helperName}("No Data Found", "No data found for the selected filters.");
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          ${helperName}("Fetch Failed", backendMsg || err?.message || ${originalMsg});
        }
      }`;
  });

  if (rewritten !== original) {
    fs.writeFileSync(file, rewritten, "utf8");
    changed += 1;
    console.log("rewrote:", path.relative(ROOT, file));
  }
}

walk(ROOT);
console.log(`\nDone. Scanned ${scanned} .js files, rewrote ${changed}.`);
