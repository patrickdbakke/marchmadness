'use strict';

angular.module('marchmadness')
    .constant('COLORS', {
        brandBlue: 'rgba(0, 126, 255, 1)',
        blue: 'rgba(0, 126, 255, 1)',
        brandRed: 'rgb(210, 0, 0)',
        white: 'white',
        green: 'rgba(0, 204, 30, 1)',
        red: 'rgb(255, 78, 67)',
        black: 'black',

        graphAxis: "#2c3e50",
        chart: "transparent",
        distribution: "transparent",

        facebook: 'rgba(59, 89, 152, 1)',
        voice: '#438BFA',
        hangouts: 'rgba(95, 177, 66, 1)',
    })
    .constant('SOCIAL_URLS', {
        github: "https://github.com/patrickdbakke",
        linkedin: "https://www.linkedin.com/in/patrickdbakke"
    })
    .config(function disableScrolling($uiViewScrollProvider) {
        $uiViewScrollProvider.useAnchorScroll();
    })
    .config(function(AnalyticsProvider) {
        AnalyticsProvider.setAccount('UA-56509240-1');
        AnalyticsProvider.trackPages(true);
        AnalyticsProvider.useAnalytics(true);
        AnalyticsProvider.trackPrefix('aboutme');
    });
