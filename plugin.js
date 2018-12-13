
K.Plugin({
	name: 'robots',
	templates: {
		panelUser: {
			'panelUser_robots': {order: -10}
		},
		markerPlace: {
			'markerPlace_robots': {order: -10}
		}		
	},
	schemas: {
		place: {
			isRobot: 0
		},
		user: {
			isRobot: 0
		}
	},
	filters: {
		currentUser: {
			fields: {
				isRobot:1
			}
		},
		friendPanel: {
			fields: {
				isRobot:1
			}
		},
		friendItem: {
			fields: {
				isRobot:1
			}
		},
		userPanel: {
			fields: {
				isRobot:1
			}
		},
		userItem: {
			fields: {
				isRobot:1
			}
		},
		placePanel: {
			fields: {
				isRobot:1
			}
		},		
		placeItem: {
			fields: {
				isRobot:1
			}
		}
	},
	settings: {
		"robots": {
			"startUpdate": false,
			"delayUpdate": 2000,
			"prefix": "robot.",
		}
	}
});
