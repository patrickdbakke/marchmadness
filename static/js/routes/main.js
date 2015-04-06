'use strict';

angular.module('marchmadness')
	.config(function configureStates($logProvider, $stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/bracket');
		$stateProvider
			.state('root', {
				abstract:true,
				templateUrl:'views/page.html',
				controller: 'BracketCtrl',
				url: '',
				resolve: {
                    brackets: ['bracketsService', function(bracketsService){
                        return bracketsService.get();
                    }],
                    games: ['gamesService', function(gamesService){
                        return gamesService.get();
                    }],
                    teams: ['teamsService', function(teamsService){
                        return teamsService.get();
                    }],
                    tooltipTemplate: ['$templateCache', function($templateCache){
                        return $templateCache.get('views/tooltip.html');
                    }],
                }
			})
			.state('root.bracket', {
				url:'/bracket',
				views: {
					'header@root': {
						templateUrl:'views/header.html',
					},
					'content@root': {
						templateUrl:'views/content.html',
					},
					'footer@root': {
						templateUrl:'views/footer.html',
					},
				}
			});
	});