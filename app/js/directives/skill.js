module.exports = function($parse) {
	return {
	  	restrict: "E",
	  	// replace: true,
	  	transclude: true,
	  	scope: {
            name: '@',
            value: '@'
        },
	  	templateUrl: './js/directives/skill.html'
   };
};