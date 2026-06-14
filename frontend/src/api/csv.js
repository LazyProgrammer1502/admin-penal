// Turn an array of objects into a CSV file and trigger a browser download.
// No library needed — we build the text, wrap it in a Blob, and "click" a link.
export function exportToCsv(filename, rows) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);

  // Any value containing a comma, quote, or newline must be quoted, and inner
  // quotes doubled — otherwise the CSV columns break.
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");

  // A Blob is an in-memory file; createObjectURL gives it a temporary URL we
  // can point an <a download> at, then revoke to free memory.
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
