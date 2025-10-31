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
  console.log("addToAppleNotes called with text length:", text?.length);
  
  // Check if running on a real device vs simulator
  const platform = Capacitor.getPlatform();
  console.log("Platform:", platform);
  
  if (platform === 'ios' && Capacitor.isNativePlatform()) {
    // Check if we can open the shortcuts app (this will fail in simulator)
    try {
      const canOpen = await AppLauncher.canOpenUrl({ url: 'shortcuts://' });
      console.log("Can open shortcuts app:", canOpen);
      
      if (!canOpen.value) {
        throw new Error("Shortcuts app not available. This feature requires a real iOS device, not the simulator.");
      }
    } catch (checkError) {
      console.error("Cannot access shortcuts app:", checkError);
      throw new Error("This feature only works on real iOS devices, not in the simulator. Please test on a physical device.");
    }
  }
  
  const encoded = encodeURIComponent(text ?? "");
  const url =
    `shortcuts://x-callback-url/run-shortcut` +
    `?name=Chaos%20Captain%20to%20Notes` +
    `&input=${encoded}`;

  console.log("Shortcut URL:", url.substring(0, 100) + "...");
  console.log("Is native platform:", Capacitor.isNativePlatform());

  try {
    if (Capacitor.isNativePlatform()) {
      console.log("Using AppLauncher to open shortcut");
      await AppLauncher.openUrl({ url });
      console.log("AppLauncher.openUrl completed");
    } else {
      console.log("Using window.open fallback");
      window.open(url, "_system");
    }
  } catch (error) {
    console.error("Error opening Apple Notes:", error);
    throw error;
  }
}
