import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chaoscaptain.app',
  appName: 'Chaos Captain',
  webDir: 'dist',
  server: {
    url: 'YOUR_PREVIEW_URL_HERE',
    cleartext: true
  }
};

export default config;
