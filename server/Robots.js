/**
 * https://github.com/node-geojson/geojson-random
 * random.position(bbox?)
 * random.polygon(count, num_vertices, max_radial_length, bbox)
 * random.lineString(count, num_vertices, max_length, max_rotation, bbox)
 */
GeojsonRandom = Npm.require('geojson-random');
//simplifyGeometry = Npm.require('simplify-geometry');
//simplified is not more good result! :(

//TODO Users.after.remove(function(userId, user) {
//
Meteor.startup(function() {
	if(K.settings.robots.startUpdate)
		K.Admin.call('startRobotsMove');
});

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
		
		var bbox = K.Util.geo.bufferLoc(loc, 100, true),
			maxLen = K.Util.geo.meters2rad(100),
			maxRot = K.Util.geo.deg2rad(80),
			maxPoints = 100;
		
		bbox = K.Util.geo.reverseBbox(bbox);
		bbox = K.Util.geo.plainBbox(bbox);

		var geojson = GeojsonRandom.lineString(1, maxPoints, maxLen, maxRot, bbox);

		//var coords = geojson.features[0].geometry.coordinates;
		//geojson.features[0].geometry.coordinates = simplifyGeometry(coords,0.002);

		return geojson;
	},
	/**
	 * update robot's properties: location, checkin, onlineoffline
	 * @return {[type]} [description]
	 */
	update: function() {
		//console.log('Robots: update locations...');
		//var bbox = K.Util.geo.bufferLoc(loc, 100, true)
		//var places = K.findPlacesByBBox(bbox);
		/*
			auto accept friend request!
		 */
		if(_.random(1,5)>4)//generate random time
		{
			Users.find({isRobot: 1, usersReceive: {$ne: []} }).forEach(function(robot) {
				
				_.map(robot.usersReceive, function(id) {
					var user = Users.findOne(id);
					
					K.updateFriendship(robot._id, user._id);
				});
			});
		}

		if(_.random(1,5)>3)//generate random time
		{
			Users.find({isRobot: 1, checkin: {$ne: null} }).forEach(function(robot) {
				
				K.removeCheckin(robot.checkin, robot._id);


				Users.update(robot._id, {$set: {status: 'online'}});
			});
		}

		K.Robots.tracks.find({}).forEach(function(track) {
		//Users.find({isRobot: 1}).forEach(function(track) {

			var coords = track.geojson.features[0].geometry.coordinates,
				arrived = track.indexLoc >= (coords.length-1),
				inc = 1,
				//TODO change inc
				indexLoc = arrived ? 0 : (track.indexLoc+inc),
				newLoc = coords[indexLoc].reverse();

			//console.log('Robots: update ', indexLoc, newLoc);
			if(track.userId) {
				var up = Users.update({
					_id: track.userId,
					checkin: null
				}, {
					$set: {
						loc: newLoc
					}
				});
				
				if(up) {

					K.Robots.tracks.update({userId: track.userId}, {
						$set: {
							indexLoc: indexLoc
						}
					});
				}
			}
			else if(track.placeId) {
				Places.update(track.placeId, {
					$set: {
						loc: newLoc
					}
				});

				K.Robots.tracks.update({placeId: track.placeId}, {
					$set: {
						indexLoc: indexLoc
					}
				});
			}
		});
	}	
};