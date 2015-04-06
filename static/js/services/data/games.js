"use strict";

angular.module("marchmadness")
    .factory("gamesService", function($http, $q) {
        function returnData(response) {
            return response.data;
        }
        var cachedData = false;
        function cache(data){
            cachedData = data;
            return data;
        }
        function get() {
            if(cachedData){
                return $q.when(cachedData);
            }
            return $http.get("./data/games.json")
                .then(returnData)
                .then(calculatePermutations)
                .then(cache);
        }
        function calculatePermutations(games){
            function getPossibleParticipants(game){
                var possibleParticipants = [];
                if(game.round === 1){
                    return game.participants;
                }
                _.each(games, function(otherGame){
                    if(otherGame.round === game.round - 1 && (_.contains(otherGame.possibleParticipants, game.participants[0]) || _.contains(otherGame.possibleParticipants, game.participants[1]) || _.contains(game.participants, 'Unknown'))){
                        possibleParticipants = possibleParticipants.concat(otherGame.possibleParticipants);
                    }
                });
                return possibleParticipants;
            }
            var rounds = [1, 2, 3, 4, 5, 6, 7];
            _.each(rounds,function(round){
                _.each(games, function(game){
                    if(game.round === round){
                        game.possibleParticipants = getPossibleParticipants(game);
                    }
                });
            });
            return games;
        }

        return {
            get: get
        };
    });