
Template.panelUser_robots.onRendered(function() {
	//PATCH
	if(this.data.isRobot) {
		$(this.firstNode)
		.parents('.panel-body')
		.find('.icon-avatar-default')
		.attr('src','/packages/keplerjs_robots/assets/images/avatar_robot.svg');
	}
});
