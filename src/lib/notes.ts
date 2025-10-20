// src/lib/notes.ts
export function openConnectToNotes() {
  // Opens your iCloud Shortcut so the user can install it
  // (must open externally on iOS device)
  window.open(
    "https://www.icloud.com/shortcuts/d5e655c0e0e345908656aa098a81a1e2",
    "_blank"
  );
}

export function addToAppleNotes(text: string) {
  const encoded = encodeURIComponent(text ?? "");
  const url =
    `shortcuts://x-callback-url/run-shortcut` +
    `?name=Chaos%20Captain%20to%20Notes` +
    `&input=${encoded}`;

  // Important: open externally so iOS hands off to Shortcuts
  window.open(url, "_system"); // many Capacitor shells map "_system" to external
}
