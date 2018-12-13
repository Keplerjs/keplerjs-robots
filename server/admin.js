
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

			if(cat==='bus') {
				K.Robots.tracks.insert({
					username: username,
					userId: robotId,
					indexLoc: 0,
					geojson: K.Robots.randomTrackByLoc(loc)
				});
			}
			else {

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
		}

		console.log('Admin: insertRobot', username);

		return robotId;
	},
	insertRobotPlace: function(name, loc, cat) {

		if(!K.Admin.isMe()) return null;
		
		var user = Meteor.user();

		loc = loc || 
			  K.Util.getPath(user,'loclast') || 
			  K.Util.getPath(user,'settings.map.center');

		var bbox = K.Util.geo.bufferLoc(loc, 500, true);

		name = K.settings.robots.prefix + name;

		var place = _.deepExtend({}, K.schemas.place, {
			name: K.Util.sanitize.name(name),
			isRobot: 1,
			userId: user._id,
			loc: loc,
			source: {
				type: 'robots'
			}
		});

		if(cat) {
		 	place.cats = [cat];
		}

		var placeId = Places.insert(place);

		if(placeId)
		{
			K.Robots.tracks.insert({
				name: name,
				cats: [cat] || null,
				placeId: placeId,
				indexLoc: 0,
				geojson: K.Robots.randomTrackByLoc(loc)
			});
		}

		console.log('Admin: insertRobotPlace', name);

		return placeId;
	},
	removeRobot: function(username) {
		
		if(!K.Admin.isMe()) return null;

		K.Admin.call('removeUser', username);
		K.Robots.tracks.remove({username: username});

		console.log('Admin: removeRobot', username);
	},
	removeRobotPlace: function(name) {
		
		if(!K.Admin.isMe()) return null;

		K.Admin.call('removePlace', name);
		K.Robots.tracks.remove({name: name});

		console.log('Admin: removeRobotPlace', name);
	},	
	removeAllRobotsCat: function(cat) {
		
		if(!K.Admin.isMe()) return null;

		Users.find({isRobot:1, cats: cat}).forEach(function(user) {
			K.Admin.call('removeUser', user.username);
		});
		Places.find({isRobot:1, cats: cat}).forEach(function(place) {
			K.Admin.call('removePlace', place._id);
		});
		K.Robots.tracks.remove({cats: cat});	

		console.log('Admin: removeAllRobots');
	},
	cleanAllRobotsCheckins: function() {
		
		if(!K.Admin.isMe()) return null;

		Places.find({isRobot:1}).forEach(function(place) {
			if(place)
			K.Admin.call('cleanPlaceCheckins', place.name);
		});
		
		console.log('Admin: cleanAllRobotsCheckins');
	}
});
