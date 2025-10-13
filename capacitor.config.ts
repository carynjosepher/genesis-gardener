import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chaoscaptain.app',
  appName: 'Chaos Captain',
  webDir: 'dist',
  server: {
    url: 'https://8f01d337-6d97-4202-89ba-b7d120c6f8b0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
