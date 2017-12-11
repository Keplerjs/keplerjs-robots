
if(K.Admin)
K.Admin.methods({
	loadRandomTrack: function(loc) {
		
		if(!K.Admin.isMe()) return null;
		
		console.log('Robots: loadRandomTrack', loc);

		return K.Robots.randomTrackByLoc(loc);
	},
	loadRobotTrack: function(username) {
		
		if(!K.Admin.isMe()) return null;
		
		console.log('Robots: loadRobotTrack', username);

		return K.Robots.tracks.findOne({username: username});
	},	
	startRobotsMove: function() {
		K.Robots.timer = Meteor.setInterval(K.Robots.updateLoc, K.settings.robots.delayUpdate);
	},
	stopRobotsMove: function() {

		Meteor.clearInterval(K.Robots.timer);
	},	
	insertRobot: function(username, loc) {

		if(!K.Admin.isMe()) return null;

		loc = loc || 
			  K.Util.getPath(Meteor.user(),'loclast') || 
			  K.Util.getPath(Meteor.user(),'settings.map.center');

		username = K.settings.robots.prefix + username;
		
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

		console.log('Robots: insertRobot', username);

		return userId;
	},
	removeRobot: function(username) {
		
		if(!K.Admin.isMe()) return null;

		K.Admin.call('removeUser', username);
		K.Robots.tracks.remove({username: username});

		console.log('Robots: removeRobot', username);
	},
	removeAllRobots: function() {
		
		if(!K.Admin.isMe()) return null;

		Users.find({isRobot:1}).forEach(function(user) {
			K.Admin.call('removeUser', user.username);
		});
		K.Robots.tracks.remove({});		

		console.log('Robots: removeAllRobots');
	}
});
