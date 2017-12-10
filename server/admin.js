
if(K.Admin)
K.Admin.methods({
	loadRandomTrack: function(loc) {
		
		if(!K.Admin.isMe()) return null;
		
		console.log('Robots: loadRandomTrack', loc);

		return K.Robots.randomTrackByLoc(loc);
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
				username: username,
				userId: userId,
				indexLoc: 0,
				geojson: K.Robots.randomTrackByLoc(loc)
			});
		}

		console.log('Robots: insertRobot', username, userId);

		return userId;
	},
	removeRobot: function(username) {
		
		if(!K.Admin.isMe()) return null;

		K.Admin.call('removeUser', K.settings.public.robots.prefix+username);
		K.Robots.tracks.remove({username: username});
	}
});
