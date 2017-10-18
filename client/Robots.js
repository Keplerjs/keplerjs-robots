
Kepler.Robots = {
	loadRandomPath: function() {
		Meteor.call('loadRandomPath', K.Map.getCenter(), function(err, data) {
			if(data) {
				K.Map.addGeojson(data, {
					style: {color: '#f0f', weight:3, opacity:1 }
				});
			}
		});
	}
};