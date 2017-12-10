
GeojsonRandom = Npm.require('geojson-random');

//TODO Users.after.remove(function(userId, user) {


//TODO startup if(!K.settings.public.robots.updateLoc) {


Kepler.Robots = {

	timer: null,
	
	tracks: new Mongo.Collection('robots_tracks'),

	randomPathByLoc: function(loc) {
		
		var bbox = K.Util.geo.bufferLoc(loc, 1000, true);
		
		bbox = K.Util.geo.reverseBbox(bbox);
		bbox = K.Util.geo.plainBbox(bbox);

		return GeojsonRandom.lineString(1, 100, K.Util.geo.meters2rad(1000), null, bbox);
	},

	updateLoc: function() {

		console.log('Robots: update locations...');

		//TODO define var that swtich simulation play stop

		var cur = K.Robots.tracks.find({}).forEach(function(doc) {

			var coords = doc.geojson.features[0].geometry.coordinates,
				inc = 1,
				//TODO change inc
				indexLoc = doc.indexLoc >= (coords.length-1) ? 0 : (doc.indexLoc+inc),
				newLoc = coords[indexLoc].reverse();

			console.log('Robots: updateLoc ', doc.userId, indexLoc, newLoc);

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

if(K.Admin)
K.Admin.methods({
	loadRandomPath: function(loc) {
		
		if(!K.Admin.isMe()) return null;
		
		console.log('Robots: loadRandomPath', loc);

		return K.Robots.randomPathByLoc(loc);
	},
	startRobotsMove: function() {
		
		K.Robots.timer = Meteor.setInterval(K.Robots.updateLoc, 1000);
	},
	stopRobotsMove: function() {

		Meteor.clearInterval(K.Robots.timer);
	},	
	insertRobot: function(username, loc) {

		if(!K.Admin.isMe()) return null;

		username = K.settings.public.robots.prefix + username;
		
		var userId = Accounts.createUser({
			username: username,
			password: username+username,
			//email: username+'@example.com',
			isRobot: 1,
			name: username,
			status: 'online',
			loc: loc
		});

		if(userId) {
			K.updateFriendship(this.userId, userId);

			K.Robots.tracks.insert({
				userId: userId,
				indexLoc: 0,
				geojson: K.Robots.randomPathByLoc(loc)
			});
		}

		console.log('Robots: insertRobot', username, userId);

		return userId;
	}
});
