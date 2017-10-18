
GeojsonRandom = Npm.require('geojson-random');

Kepler.Robots = {
	randomPathByLoc: function(loc) {
		
		var bbox = K.Util.geo.bufferLoc(loc, 1000, true);
		
		bbox = K.Util.geo.reverseBbox(bbox);
		
		bbox = K.Util.geo.plainBbox(bbox);

		return GeojsonRandom.lineString(1, 100, K.Util.geo.meters2rad(1000), null, bbox);
	}
};

Meteor.methods({
	loadRandomPath: function(loc) {
		
		console.log('loadRandomPath', loc);

		return K.Robots.randomPathByLoc(loc);
	}
});