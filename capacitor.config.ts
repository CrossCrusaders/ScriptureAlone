import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.scripturealone.crosscrusaders',
  appName: 'Scripture Alone',
  webDir: 'dist',
  bundledWebRuntime: false,
  hideLogs: true,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
