// src/lib/notes.ts
import { Browser } from '@capacitor/browser';
import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';

export async function openConnectToNotes() {
  // Opens your iCloud Shortcut so the user can install it
  const url = "https://www.icloud.com/shortcuts/d5e655c0e0e345908656aa098a81a1e2";
  
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  } else {
    window.open(url, "_blank");
  }
}

export async function addToAppleNotes(text: string) {
  const encoded = encodeURIComponent(text ?? "");
  const url =
    `shortcuts://x-callback-url/run-shortcut` +
    `?name=Chaos%20Captain%20to%20Notes` +
    `&input=${encoded}`;

  try {
    if (Capacitor.isNativePlatform()) {
      // Use AppLauncher for custom URL schemes on native platforms
      await AppLauncher.openUrl({ url });
    } else {
      // Fallback for web
      window.open(url, "_system");
    }
  } catch (error) {
    console.error("Error opening Apple Notes:", error);
    throw error;
  }
}
