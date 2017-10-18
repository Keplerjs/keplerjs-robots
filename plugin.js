
K.Plugin({
	name: 'robots',
/*	templates: {
	},*/
	schemas: {
		user: {
			isRobot: 1
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
	/*settings: {
		public: {
		}
	}*/
});
