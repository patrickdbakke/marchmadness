"use strict";

angular.module("marchmadness")
    .factory("teamsService", function($http, $q) {
        function returnData(response) {
            return response.data;
        }
        var cachedData = false;
        function cache(data){
            cachedData = data;
            return data;
        }
        var rankingsToPositions = {
            p1: 1,
            p16:2,
            p8: 3,
            p9: 4,
            p5: 5,
            p12:6,
            p4: 7,
            p13:8,
            p6: 9,
            p11:10,
            p3: 11,
            p14:12,
            p7: 13,
            p10:14,
            p2: 15,
            p15:15 
        }
        function calculatePositions(teams){
            _.each(teams, function(team){
                team.position = rankingsToPositions['p' + team.ranking];
                return team;
            });
            return teams;
        }
        var regionsToIds = {
            Midwest: 1,
            West: 2,
            East: 3,
            South: 4,
        }
        function calculateRegionIds(teams){
            _.each(teams, function(team){
                team.regionId = regionsToIds[team.region];
                return team;
            });
            return teams;
        }
        function get() {
            if(cachedData){
                return $q.when(cachedData);
            }
            return $http.get("./data/teams.json")
                .then(returnData)
                .then(calculatePositions)
                .then(calculateRegionIds)
                .then(cache);
        }

        return {
            get: get
        };
    });