import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chaoscaptain.app',
  appName: 'Chaos Captain',
  webDir: 'dist',
  server: {
    url: 'https://chaos-captain.lovable.app',
    cleartext: true
  }
};

export default config;
