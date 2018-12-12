
Kepler.User.include({

	classMarker: function() {
		this._dep.depend();
		
		var cats = '';
		
		if(this.getCats)
			cats = _.map(this.getCats(), function(c) {
				return 'cat-user-'+c;
			}).join(' ');

		return 'marker-user '+ cats + (this.isRobot ? ' marker-robot' : '');
	},

	loadRobotTrack: function() {
		
		var self = this;

		K.Admin.call('loadRobotTrack', self.id, function(err, track) {
			
			if(track) {
				K.Map.addGeojson(track.geojson, {
					style: {
						color: self.color || '#f0f',
						opacity:0.5,
						weight:6
					}
				});
			}
		});
	},
	loadRobotLoc: function() {
		
		if(this.loc)
			L.circleMarker(this.loc, {
				radius: 5,
				fillColor: this.color || '#f0f',
				fillOpacity:1,
				weight:0
			}).addTo(K.Map.layers.users);
	}
});
