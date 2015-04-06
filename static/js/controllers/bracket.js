'use strict';

angular.module('marchmadness')
	.controller('BracketCtrl', function ($scope, games, brackets, tooltipTemplate, teams) {
		$scope.datasets = [];
		$scope.template = function(datapoint){
			datapoint.datapoint.scores = datapoint.datapoint.game.score.split(' to ');
			return _.template(tooltipTemplate, {
                interpolate: /\{\{(.+?)\}\}/g
            })(datapoint);
		};
		$scope.teams = teams;
		function sortByRanking(participant1, participant2){
			var team1val = 0;
			var team2val = 0;
			if(teams[participant1]){
				team1val = teams[participant1].regionId;
			}
			if(teams[participant2]){
				team2val = teams[participant2].regionId;
			}
			if(team1val === team2val){
				if(teams[participant1]){
					team1val = teams[participant1].position;
				}
				if(teams[participant2]){
					team2val = teams[participant2].position;
				}
			}
			return team1val - team2val;
		}
		games = _.map(games, function(game){
			game.participants = game.participants.sort(sortByRanking);
			game.teams = _.map(game.participants, function(team){
				return teams[team];
			});
			return game;
		});
		function addTreeIds(){
			var rounds = [7, 6, 5, 4, 3, 2, 1];
            function getTreeIds(game){
                if(game.round >= 6){
                    return '0';
                }
                if(game.round === 5){
                    console.log(game);
                }
                for(var i = 0;i < games.length; i++){
                    var otherGame = games[i];
                    if(otherGame.round === game.round + 1){
                        if((_.contains(otherGame.possibleParticipants, game.possibleParticipants[0]))){
                            if(otherGame.participants && otherGame.participants[0] && otherGame.participants[0] !== 'Unknown'){
                                if(_.contains(game.possibleParticipants, otherGame.participants[0])){
                                    return otherGame.treeIds + teams[game.participants[0]].regionId + '0';
                                } else {
                                    return otherGame.treeIds + teams[game.participants[0]].regionId + '1';
                                }
                            } else {
                                return otherGame.treeIds + teams[game.participants[0]].regionId + 'u';
                            }
                        }
                    }
                }
            }
            _.each(rounds,function(round){
                _.each(games, function(game){
                    if(game.round === round){
                        game.treeIds = getTreeIds(game);
                    }
                });
            });
		}
		addTreeIds();
		$scope.games = _.sortBy(games, 'treeIds');

		_.each(brackets, function(bracketObj){
			var sum = 0;
			var data = _.map(games, function(game, index){
				var correct = false;
				if(game.winner && bracketObj.bracket[game.winner] >= game.round + 1){
					sum += Math.pow(2, game.round - 1);
					correct = true;
				}
				var predicted = [];
				_.each(bracketObj.bracket, function(value, team){
					if(value >= game.round && _.contains(game.possibleParticipants, team)){
						predicted.push(team);
					}
				});

				return {
					x: index + 1,
					y: sum,
					game: game,
					correct: correct,
					predicted: predicted,
					bracket: bracketObj
				};
			});
			data.unshift({
				x: 0,
				y:0,
			});
			$scope.datasets.push({
				name: bracketObj.name,
				datapoints: data
			});
		});

		$scope.selectBracket = function selectBracket(bracketName){
			if (bracketName === 'correct') {
				_.each($scope.games, function(game){
					game.predictedParticipants = _.clone(game.participants);
				});
			} else {
				var selectedBracket = _.map(_.find(brackets, {name: bracketName}).bracket, function(round, team){
					return {
						team: team,
						round: round
					};
				});

				_.each($scope.games, function(game){
					var predictedForRound = _.map(_.filter(selectedBracket, function(bracketGame){
						return bracketGame.round >= game.round;
					}), function(bracket){
						return bracket.team;
					});
					game.predictedParticipants = _.intersection(game.possibleParticipants, predictedForRound).sort(sortByRanking);
				});
			}
		}
		$scope.selectBracket('correct');
	});