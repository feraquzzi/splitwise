import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.femi.splitpay',
  appName: 'Splitpay',
  webDir: 'build',

  server: {
    url: 'https://splitwise-zhfz.vercel.app',
    cleartext: true
  }
};

export default config;
