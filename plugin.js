
K.Plugin({
	name: 'robots',
/*	templates: {
	},*/
	schemas: {
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
		userPanel: {
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
