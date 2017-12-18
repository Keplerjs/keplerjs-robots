
/**
 * add all robots in the user's friends
 * @param  {[type]} userId [description]
 * @return {[type]}        [description]
 */
K.updateFriendshipRobots = function(userId) {
	
	var robots = Users.find({isRobot: 1}).fetch(),
		ids = _.pluck(robots,'_id');

	var userIds = _.without(ids, userId);

	Users.update(userId, {
		$addToSet: {
			friends: {
				$each: userIds
			}
		}
	});
};


/**
 * add robot to the all user's friends list
 * @param  {[type]} userId [description]
 * @return {[type]}        [description]
 */
K.updateFriendshipRobotUsers = function(robotId) {

	Users.update({_id: {$ne: robotId} }, {
		$addToSet: {
			friends: robotId
		}
	}, { multi: true });
};

Users.after.insert(function(userId, user) {

	K.updateFriendshipRobots(user._id);

});
