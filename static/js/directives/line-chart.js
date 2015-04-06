'use strict';


// this code needs improvement. 
// need to reorganize the graphing into it's own library, 
// instead of having it interwove with application specific stuff

// pls don't judge it in the mean time. 

angular.module('marchmadness')
    .directive('lineChart', function configureStates() {
        var colors = [
            0x369EAD, 0xC24642, 0x7F6084, 0x86B402, 0xA2D1CF, 0xC8B631, 0x6DBCEB, 0x52514E, 0x4F81BC, 0xA064A1, 0xF79647
        ];
        colors = [
            0xf44336, 0x555555, 0xFFEB3B, 0x1976D2, 0x4CAF50, 0xffffff, 0xE91E63, 0xCDDC39, 0x673AB7, 0x03A9F4, 0xFFC107, 0xFF9800, 
        ];
        function makeLine(dataset){
            var geometry = new THREE.Geometry();
            geometry.dynamic = true;
            for(var i = 0; i < dataset.datapoints.length - 1; i++){
                var datapoint1 = dataset.datapoints[i];
                var datapoint2 = dataset.datapoints[i + 1];
                var v1 = new THREE.Vector3(datapoint1.x, datapoint1.y, 0);
                var v2 = new THREE.Vector3(datapoint2.x, datapoint2.y, 0);
                var v3 = new THREE.Vector3(datapoint2.x, datapoint2.y, 1);
                var v4 = new THREE.Vector3(datapoint1.x, datapoint1.y, 1);
                var v1b = new THREE.Vector3(datapoint1.x, datapoint1.y - 0.01 * dataset.averages.y, 0);
                var v2b = new THREE.Vector3(datapoint2.x, datapoint2.y - 0.01 * dataset.averages.y, 0);
                var v3b = new THREE.Vector3(datapoint2.x, datapoint2.y - 0.01 * dataset.averages.y, 1);
                var v4b = new THREE.Vector3(datapoint1.x, datapoint1.y - 0.01 * dataset.averages.y, 1);
                geometry.vertices.push(v1);
                geometry.vertices.push(v2);
                geometry.vertices.push(v3);
                geometry.vertices.push(v4);
                geometry.vertices.push(v1b);
                geometry.vertices.push(v2b);
                geometry.vertices.push(v3b);
                geometry.vertices.push(v4b);
                geometry.faces.push( new THREE.Face3( 0 + i*8, 1 + i*8, 2 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 0 + i*8, 2 + i*8, 3 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 4 + i*8, 5 + i*8, 6 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 4 + i*8, 6 + i*8, 7 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 0 + i*8, 4 + i*8, 1 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 0 + i*8, 1 + i*8, 5 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 3 + i*8, 7 + i*8, 2 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 2 + i*8, 6 + i*8, 7 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 2 + i*8, 6 + i*8, 1 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 6 + i*8, 5 + i*8, 1 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 0 + i*8, 4 + i*8, 7 + i*8 ) );
                geometry.faces.push( new THREE.Face3( 0 + i*8, 3 + i*8, 7 + i*8 ) );
            }
            geometry.computeFaceNormals();
            return geometry;
        }
        return {
            restrict: 'A',
            templateUrl: 'views/line-chart.html',
            link: function link($scope, $element){
                var chart = {}, 
                    renderer, 
                    projector = new THREE.Projector(), 
                    needsRender = true;
                var $width = $element[0].clientWidth,
                    $height = $element[0].clientHeight,
                    $tooltip = angular.element('<div/>').addClass('tooltip');
                $element.append($tooltip);
                var wheelDelta = 0;
                var throttle = 50;
                $element.on('mousewheel', function(event){
                    wheelDelta += event.wheelDelta;
                    if(Math.abs(wheelDelta) >= throttle){
                        wheelDelta = 0;
                        var direction = Math.abs(event.wheelDelta)/event.wheelDelta;
                        _.each(chart.scene.children, function(object){
                            if (typeof object.datapoint !== 'undefined') {
                                object.position.z = (((object.position.z - $scope.datasets.length / 2) + $scope.datasets.length * 5 + 1 * direction) % $scope.datasets.length) - $scope.datasets.length / 2;
                            }
                        });
                        needsRender = true;
                        return false;
                    }
                });
                var mousemove = function(e) {
                    var vector = new THREE.Vector3(
                        ( e.offsetX / $width ) * 2 - 1,
                      - ( e.offsetY / $height ) * 2 + 1,
                        0.5
                    );
                    projector.unprojectVector( vector, chart.camera );
                    var ray = new THREE.Raycaster(chart.camera.position, vector.sub( chart.camera.position ).normalize() );
                    var intersects = ray.intersectObjects( chart.scene.children );
                    if (intersects.length > 0) {
                        var set = intersects[0].object.dataset;
                        var nearest = null;
                        var nearestDistance = Number.MAX_VALUE;
                        _.each(set.datapoints, function(datapoint){
                            var distance = Math.abs(datapoint.x - (intersects[0].point.x + set.datapoints.length / 2));
                            if(distance < nearestDistance){
                                nearest = datapoint;
                                nearestDistance = distance;
                            }
                        });
                        if(nearest && nearest.datapoint && nearest.datapoint.game){
                            showTooltip(nearest, e.offsetX, e.offsetY);
                        }
                    } else {
                        // $tooltip.removeClass('visible');
                    }
                };
                $element.on('mousemove', mousemove);
                $scope.activeBracket = null;
                function showTooltip(datapoint, x, y){
                    console.log(datapoint);
                    $tooltip.css('left', x + 'px');
                    $tooltip.css('top', y + 'px');
                    $tooltip.addClass('visible');
                    $tooltip.empty();
                    $tooltip.html($scope.template(datapoint));
                    $scope.activeBracket = datapoint.dataset;
                    $scope.$digest();
                }
                renderer = new THREE.WebGLRenderer({antialias: true});
                $element.append(renderer.domElement);

                function draw() {
                    renderer.setSize( $width, $height );
                    chart.scene = new THREE.Scene();
                    var viewAngle = 80;
                    var aspect = $width / $height;
                    var near    = 1;
                    var far    = 1000;
                    chart.lines = [];
                    
                    var directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
                    directionalLight.position.z = 3;
                    chart.scene.add( directionalLight );

                    var transformedData = [];

                    var maximalX = Number.MIN_VALUE, maximalY = Number.MIN_VALUE;
                    var sumationX = 0;
                    var sumationY = 0;
                    var minimalX = Number.MAX_VALUE, minimalY = Number.MAX_VALUE;

                    _.each($scope.datasets, function(dataset, i){
                        var sumX = 0, sumY = 0;
                        var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
                        var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
                        transformedData.push({
                            name: dataset.name,
                            datapoints: _.map(dataset.datapoints, function(datapoint){
                                var y = datapoint.y;
                                var x = datapoint.x;
                                sumX += x;
                                sumY += y;
                                sumationX += x;
                                sumationY += y;
                                maxX = Math.max(maxX, x);
                                maxY = Math.max(maxY, y);
                                minX = Math.min(minX, x);
                                minY = Math.min(minY, y);
                                maximalX = Math.max(maximalX, x);
                                maximalY = Math.max(maximalY, y);
                                minimalX = Math.min(minimalX, x);
                                minimalY = Math.min(minimalY, y);
                                return {x: x, y: y, z: i, datapoint: datapoint, dataset: dataset};
                            }),
                            averages: {
                                x: sumX / dataset.datapoints.length,
                                y: sumY / dataset.datapoints.length,
                                z: $scope.datasets.length/2
                            },
                            maxs: {
                                x: maxX,
                                y: maxY,
                            },
                            mins: {
                                x: minX,
                                y: minY,
                            }
                        });
                    });

                    _.each(transformedData, function(dataset, index){
                        var geometry = makeLine(dataset);
                        var shader = new THREE.MeshLambertMaterial( { color: colors[index % colors.length] , side: THREE.DoubleSide} );
                        var object = new THREE.Mesh( geometry, shader );
                        object.position.x = -1 * sumationX / (dataset.datapoints.length * $scope.datasets.length);
                        object.position.y = -1 * sumationY / (dataset.datapoints.length * $scope.datasets.length);
                        object.position.z = -1 * $scope.datasets.length/2 + index;
                        object.dataset = dataset;
                        chart.scene.add(object);
                        chart.lines.push(object);
                    });

                    chart.camera = new THREE.PerspectiveCamera( viewAngle, aspect, near, far );
                    chart.scene.add( chart.camera );
                    
                    function mainViewpoint(){
                        chart.camera.position.x = Math.sin(-Math.PI / 4) * Math.max(maximalY, maximalX);
                        chart.camera.position.y = Math.cos(Math.PI / 4) * Math.max(maximalY, maximalX);
                        chart.camera.position.z = Math.cos(Math.PI / 4) * Math.max(maximalY, maximalX);
                        chart.camera.lookAt({x:0, y:0, z:0});
                    }
                    function headOnViewpoint(){
                        chart.camera.position.x = Math.sin(-Math.PI / 4) * Math.max(maximalY, maximalX);
                        chart.camera.position.y = Math.cos(Math.PI / 2) * Math.max(maximalY, maximalX);
                        chart.camera.position.z = Math.cos(Math.PI / 2) * Math.max(maximalY, maximalX);
                        chart.camera.lookAt({x:0, y:0, z:0});
                    }
                    function topDownViewpoint(){
                        chart.camera.position.x = maximalX/2;
                        chart.camera.position.y = Math.cos(Math.PI * 0) * Math.max(maximalY, maximalX);
                        chart.camera.position.z = 0;
                        chart.camera.lookAt({x:0, y:0, z:0});
                    }
                    topDownViewpoint();
                    mainViewpoint();
                    headOnViewpoint();
                    requestAnimationFrame( animate);
                }
                function animate() {
                    requestAnimationFrame( animate );
                    if(needsRender){
                        renderer.render( chart.scene, chart.camera );
                    }
                    needsRender = false;
                }
                needsRender = true;
                draw();
            }
        };
    });