
Package.describe({
  name: 'keplerjs:robots',
  summary: 'keplerjs plugin to create various robot users to test interactions on the platform',
  version: "1.3.3",
  git: "https://github.com/Keplerjs/Kepler.git"
});

Npm.depends({
  "geojson-random": "0.4.0",
  //"simplify-geometry": "0.0.2"
});

Package.onUse(function(api) {

  api.versionsFrom("1.5.1");

  api.use([
    'keplerjs:core@1.2.3'
  ]);

  api.addFiles([
    'plugin.js',
  ]);

  api.addFiles([
    //'client/views/panels.html',
    //'client/views/panels.js',
    'client/Robots.js',
    'client/User_robots.js'
  ],'client');

  api.addFiles([
    'server/Robots.js',
    'server/admin.js',
    'server/users.js',
  ],'server');

});
