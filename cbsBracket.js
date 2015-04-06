'use strict';
var regions = [1, 2, 3, 4, 5];
var bracket = {};
_.each(regions, function(region){
    _.each([1, 2, 3, 4, 5, 6], function(round){
        _.each($("#" + region).find("#roundContainer" + round).find(".teamContainer").find(".teamName"), function(teamDom){
            if(typeof bracket[teamDom.innerHTML] === "undefined"){
                bracket[teamDom.innerHTML] = 1;
            } else {
                bracket[teamDom.innerHTML]++;
            }
        });
    });
});
bracket[$("#winningTeamPick")[0].innerHTML]++;
console.log(JSON.stringify(bracket));


var games = [];
$(".data").find(".row1, .row2").each(function(j, row){
    var participant1 = $(row).find("a").eq(0).html();
    var participant2 = $(row).find("a").eq(1).html();
    var parts = $(row).find('[align="left"]')[0].childNodes;
    var time = parseInt($(row).find(".gmtTimeUpdated").attr("data-gmt"));
    if(time >= 1426781700){
        var score1 = 0, score2 = 0;
        if(parts && parts[2] && parts[4]){
            score1 = parseInt(parts[2].textContent);
            score2 = parseInt(parts[4].textContent);
        }
        var winner = null;
        if(score1 && score2){
            winner = score1 > score2 ? participant1 : participant2;
        }

        var round = 1;
        for(var i = 0; i< games.length; i++){
            if(games[i].winner === participant1){
                round++;
            }
        }
        games.push({
            participants: [participant1, participant2],
            time: time,
            winner: winner,
            score: score1 ? score1 + ' to ' + score2: undefined,
            round:round
        });
    }
});
JSON.stringify(games);