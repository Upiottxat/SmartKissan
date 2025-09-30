const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAppComponentFactory(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Add tools namespace if not present
    if (!androidManifest.manifest['$']['xmlns:tools']) {
      androidManifest.manifest['$']['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Add tools:replace to the application tag
    const applicationTag = androidManifest.manifest.application[0];
    applicationTag['$']['tools:replace'] = 'android:appComponentFactory';

    return config;
  });
};
