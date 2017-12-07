

GeojsonRandom = Npm.require('geojson-random');

Kepler.Robots = {
	randomPathByLoc: function(loc) {
		
		var bbox = K.Util.geo.bufferLoc(loc, 1000, true);
		
		bbox = K.Util.geo.reverseBbox(bbox);
		
		bbox = K.Util.geo.plainBbox(bbox);

		return GeojsonRandom.lineString(1, 100, K.Util.geo.meters2rad(1000), null, bbox);
	}
};

if(K.Admin)
K.Admin.methods({
	loadRandomPath: function(loc) {
		
		if(!K.Admin.isMe()) return null;

		console.log('loadRandomPath', loc);

		return K.Robots.randomPathByLoc(loc);
	},
	insertRobot: function(usernames) {

		if(!K.Admin.isMe()) return null;

		var prefix = K.settings.public.robots.prefix;

		usernames = _.isArray(usernames) ? usernames : [usernames];

		for(var i in usernames) {

			var username = prefix + usernames[i];
			
			var userId = Accounts.createUser({
				name: username,
				username: username,
				password: username+username,
				email: username+'@example.com'
			});

			if(userId)
				K.updateFriendship(this.userId, userId);
		}
	},
});


