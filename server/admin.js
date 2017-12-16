
if(K.Admin)
K.Admin.methods({
	loadRandomTrack: function(loc) {
		
		if(!K.Admin.isMe()) return null;
		
		console.log('Admin: loadRandomTrack', loc);

		return K.Robots.randomTrackByLoc(loc);
	},
	loadRobotTrack: function(userId) {
		
		if(!K.Admin.isMe()) return null;
		
		console.log('Admin: loadRobotTrack', userId);

		return K.Robots.tracks.findOne({userId: userId});
	},	
	startRobotsMove: function() {
		K.Robots.timer = Meteor.setInterval(K.Robots.update, K.settings.robots.delayUpdate);
	},
	stopRobotsMove: function() {

		Meteor.clearInterval(K.Robots.timer);
	},	

	insertRobot: function(username, loc) {

		if(!K.Admin.isMe()) return null;
		
		var user = Meteor.user();

		loc = loc || 
			  K.Util.getPath(user,'loclast') || 
			  K.Util.getPath(user,'settings.map.center');

		var bbox = K.Util.geo.bufferLoc(loc, 500, true);

		username = K.settings.robots.prefix + username;
		
		var robotId = Accounts.createUser({
			isRobot: 1,
			username: username,
			name: username,
			password: K.Util.randomString(),
			//email: username+'@example.com',
			status: 'online',
			loc: loc
		});

		if(robotId)
		{
			//add robot to all users's friends list
			K.updateFriendshipRobotUsers(robotId);

			switch(_.random(1,3)) {

				case 1:
					var place = _.sample(K.findPlacesByBBox(bbox).fetch());
					if(place) {
						K.insertCheckin(place._id, robotId);
					}
				break;
				case 2:
					K.Robots.tracks.insert({
						username: username,
						userId: robotId,
						indexLoc: 0,
						geojson: K.Robots.randomTrackByLoc(loc)
					});
				break;
				default:
					Users.update(robotId, {
						$set: {
							loc: K.Util.geo.randomLoc(bbox)
						}
					})
			}
		}

		console.log('Admin: insertRobot', username);

		return robotId;
	},
	removeRobot: function(username) {
		
		if(!K.Admin.isMe()) return null;

		K.Admin.call('removeUser', username);
		K.Robots.tracks.remove({username: username});

		console.log('Admin: removeRobot', username);
	},
	removeAllRobots: function() {
		
		if(!K.Admin.isMe()) return null;

		Users.find({isRobot:1}).forEach(function(user) {
			K.Admin.call('removeUser', user.username);
		});
		K.Robots.tracks.remove({});		

		console.log('Admin: removeAllRobots');
	}
});
