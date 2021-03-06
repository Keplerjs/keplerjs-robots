var version = '1.7.0';

Package.describe({
  version: version,
  name: 'keplerjs:robots',
  summary: 'keplerjs plugin to create various robot users to test interactions on the platform',
  git: "https://github.com/Keplerjs/Kepler.git"
});

Npm.depends({
  "geojson-random": "0.4.0",
  //"simplify-geometry": "0.0.2"
});

Package.onUse(function(api) {
  api.use([
    'keplerjs:core@'+version,
    'keplerjs:categories@'+version
  ]);

  api.versionsFrom("1.5.1");

  api.addFiles([
    'plugin.js',
    'i18n/it.js',
    'i18n/en.js',
    'i18n/de.js',
    'i18n/es.js',
    'i18n/fr.js'
  ]);

  api.addFiles([
    'client/stylesheets/icons.css',
    'client/views/panels.html',
    'client/Robots.js',
    'client/User_robots.js',
    'client/Place_robots.js'
  ],'client');

  api.addFiles([
    'server/Robots.js',
    'server/admin.js',
    'server/users.js',
  ],'server');

  api.addAssets('assets/images/sprite.svg', 'client');
  api.addAssets('assets/images/avatar_robot.svg', 'client');

});
