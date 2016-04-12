(function () {

	'use strict';

	require('angular');
	require('angular-ui-router');
	require('angular-animate');
	
	var mainCtrl = require('./controllers/main');
	var skillCtrl = require('./controllers/skill');

	var skillDirective = require('./directives/skill');

	angular.module('SampleApp', ['ui.router','ngAnimate'])

	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider) {
			$urlRouterProvider.otherwise("profile");
			//
			// Now set up the states
			$stateProvider
				.state('app', {
					url: "/",
					templateUrl: "./js/view/app.html",
					controller: 'MainController'
				})
				.state('app.profile', {
					url: "profile",
					templateUrl: "./js/view/profile.html"
				})
				.state('app.skill', {
					url: "skill",
					templateUrl: "./js/view/skill.html",
					controller: 'SkillController'
				})
				.state('app.edu', {
					url: "edu",
					templateUrl: "./js/view/edu.html"
				})
				.state('app.experience', {
					url: "experience",
					templateUrl: "./js/view/experience.html"
				})
				.state('app.porfolio', {
					url: "porfolio",
					templateUrl: "./js/view/porfolio.html"
				})
				.state('app.reference', {
					url: "reference",
					templateUrl: "./js/view/reference.html"
				})
				.state('app.contact', {
					url: "contact",
					templateUrl: "./js/view/contact.html"
				})
				;

			$locationProvider.html5Mode(true);
		}
	])

	//Load controller
	.controller('MainController', ['$scope', '$state', mainCtrl])
	.controller('SkillController', ['$scope', skillCtrl])

	.directive('skillItem', ['$parse', skillDirective])
	;

}());