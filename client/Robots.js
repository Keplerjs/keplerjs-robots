
Kepler.Robots = {
	loadRandomTrack: function() {
		
		var loc = K.Map.getCenter();

		K.Admin.call('loadRandomTrack', loc, function(err, data) {
			if(data) {
				K.Map.addGeojson(data, {
					style: {color: '#f0f', weight:3, opacity:1 }
				});
			}
		});
	},
	insertRobot: function(username, cat) {

		var loc = K.Map.getCenter();

		K.Admin.call('insertRobot', username, loc, cat, function(err, userId) {
			if(userId) {
				K.userById(userId);
			}
		});
	},
	insertRobotPlace: function(name, cat) {

		var loc = K.Map.getCenter();

		K.Admin.call('insertRobotPlace', name, loc, cat, function(err, placeId) {
			if(placeId) {
				K.placeById(placeId);
			}
		});
	}	
};