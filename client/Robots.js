
Kepler.Robots = {
	loadRandomPath: function() {
		
		var loc = K.Map.getCenter();

		K.Admin.call('loadRandomPath', loc, function(err, data) {
			if(data) {
				K.Map.addGeojson(data, {
					style: {color: '#f0f', weight:3, opacity:1 }
				});
			}
		});
	},
	insertRobot: function(username) {
		
		var loc = K.Map.getCenter();

		K.Admin.call('insertRobot', username, loc, function(err, userId) {
			if(userId) {
				K.userById(userId)
			}
		});
	}	
};