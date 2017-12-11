
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
				places:1
			}
		},		
		placePanel: {
			fields: {
				userId:1
			}
		},
		friendPanel: {
			fields: {
				places:1
			}
		},		
		userPanel: {
			fields: {
				places:1
			}
		}	
	},
	settings: {
		"robots": {
			"startUpdate": false,
			"delayUpdate": 1000,
			"prefix": "bot_",
		}
	}
});
