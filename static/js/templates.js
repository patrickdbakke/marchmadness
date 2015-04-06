angular.module('templates-marchmadness', ['views/bracket.html', 'views/content.html', 'views/footer.html', 'views/header.html', 'views/line-chart.html', 'views/page.html', 'views/tooltip.html']);

angular.module("views/bracket.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/bracket.html",
    "");
}]);

angular.module("views/content.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/content.html",
    "<div class=\"full\">\n" +
    "	<div class=\"half\" style=\"border-right: 1px solid white;background: #3F51B5;\">\n" +
    "		<div line-chart id=\"lineChart\"></div>\n" +
    "	</div>\n" +
    "	<div class=\"half right\">\n" +
    "		<div bracket id=\"bracket\" class=\"full\"></div>\n" +
    "		<div class=\"rounds\">\n" +
    "			<div class=\"round\" ng-repeat=\"round in [1]\" ng-class=\"'round'+round\">\n" +
    "				<div class=\"game\" ng-repeat=\"game in games | filter:{round:round}\">\n" +
    "					<div>\n" +
    "						<span class=\"team\">\n" +
    "							<span class=\"name\" style=\"background-color:{{game.teams[0].colors[0]}};color:{{game.teams[0].colors[1]}};\">{{game.participants[0]}}</span>\n" +
    "						</span>\n" +
    "						<span class=\"team\">\n" +
    "							<span class=\"name\" style=\"background-color:{{game.teams[1].colors[0]}};color:{{game.teams[1].colors[1]}};\">{{game.participants[1]}}</span>\n" +
    "						</span>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("views/footer.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/footer.html",
    "<div>\n" +
    "</div>");
}]);

angular.module("views/header.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/header.html",
    "<div>\n" +
    "</div>");
}]);

angular.module("views/line-chart.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/line-chart.html",
    "<div></div>");
}]);

angular.module("views/page.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/page.html",
    "<div class=\"full\">\n" +
    "	<div ui-view=\"header\" class=\"\" id=\"header\"></div>\n" +
    "	<div ui-view=\"content\" class=\"full\" id=\"content\"></div>\n" +
    "	<div ui-view=\"footer\" class=\"\" id=\"footer\"></div>\n" +
    "</div>");
}]);

angular.module("views/tooltip.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/tooltip.html",
    "<div class=\"tooltipContent\">\n" +
    "	<div class=\"author\">{{dataset.name}}'s bracket</div>\n" +
    "	<!-- <div class=\"game\">\n" +
    "		<span class=\"team\">\n" +
    "			<span class=\"name\">{{datapoint.game.participants[0]}}</span>\n" +
    "			<span class=\"score\">{{datapoint.scores[0]}}</span>\n" +
    "		</span>\n" +
    "		<span class=\"team\">\n" +
    "			<span class=\"name\">{{datapoint.game.participants[1]}}</span>\n" +
    "			<span class=\"score\">{{datapoint.scores[1]}}</span>\n" +
    "		</span>\n" +
    "	</div> -->\n" +
    "</div>");
}]);
