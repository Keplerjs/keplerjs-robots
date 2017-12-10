/**
 * https://github.com/node-geojson/geojson-random
 * random.position(bbox?)
 * random.polygon(count, num_vertices, max_radial_length, bbox)
 * random.lineString(count, num_vertices, max_length, max_rotation, bbox)
 */
GeojsonRandom = Npm.require('geojson-random');

//TODO Users.after.remove(function(userId, user) {
//TODO startup if(!K.settings.public.robots.updateLoc) {

Kepler.Robots = {

	timer: null,
	
	//TODO use cache for store tracks
	//
	tracks: new Mongo.Collection('robots_tracks'),

	/**
	 * create a random track
	 * @param  {[type]} loc [description]
	 * @return {[type]}     [description]
	 */
	randomTrackByLoc: function(loc) {
		
		var bbox = K.Util.geo.bufferLoc(loc, 500, true);
		
		bbox = K.Util.geo.reverseBbox(bbox);
		bbox = K.Util.geo.plainBbox(bbox);

		return GeojsonRandom.lineString(1, 100, K.Util.geo.meters2rad(500), null, bbox);
	},

	updateLoc: function() {

		//console.log('Robots: update locations...');

		//TODO define var that swtich simulation play stop

		var cur = K.Robots.tracks.find({});

		cur.forEach(function(doc) {

			var coords = doc.geojson.features[0].geometry.coordinates,
				inc = 1,
				//TODO change inc
				indexLoc = doc.indexLoc >= (coords.length-1) ? 0 : (doc.indexLoc+inc),
				newLoc = coords[indexLoc].reverse();

			//console.log('Robots: updateLoc ', indexLoc, newLoc);

			Users.update(doc.userId, {
				$set: {
					loc: newLoc
				}
			});

			K.Robots.tracks.update({userId: doc.userId}, {
				$set: {
					indexLoc: indexLoc
				}
			});
		});
	}	
};