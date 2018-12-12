
var avatarUrl = '/packages/keplerjs_robots/assets/images/avatar_robot.svg';

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

	insertRobot: function(username, loc, cat) {

		if(!K.Admin.isMe()) return null;
		
		var user = Meteor.user();

		loc = loc || 
			  K.Util.getPath(user,'loclast') || 
			  K.Util.getPath(user,'settings.map.center');

		var bbox = K.Util.geo.bufferLoc(loc, 500, true);

		username = K.settings.robots.prefix + username;
		var userObj = {
			isRobot: 1,
			username: username,
			avatar: avatarUrl,
			name: username,
			password: K.Util.randomString(),
			//email: username+'@example.com',
			status: 'online',
			loc: loc
		};

		if(cat) {
		 	userObj.cats = [cat];
		}

		var robotId = Accounts.createUser(userObj);

		if(robotId)
		{
			//add robot to all users's friends list
			K.updateFriendshipRobotUsers(robotId);

			switch(_.random(0,3)) {

				case 0:
				case 1:
					K.Robots.tracks.insert({
						username: username,
						userId: robotId,
						indexLoc: 0,
						geojson: K.Robots.randomTrackByLoc(loc)
					});
				break;
				case 2:
					var place = _.sample(K.findPlacesByBBox(bbox).fetch());
					if(place) {
						K.insertCheckin(place._id, robotId);
					}
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
