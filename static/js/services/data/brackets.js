"use strict";

angular.module("marchmadness")
    .factory("bracketsService", function($http, $q) {
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
            return $http.get("./data/brackets.json").then(returnData).then(cache);
        }

        return {
            get: get
        };
    });