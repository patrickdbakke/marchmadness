'use strict';

angular.module('marchmadness')
	.directive('bracket', function configureStates($window) {
		function makeLine(datapoints){
			var geometry = new THREE.Geometry();
			for(var i = 0; i < datapoints.length - 1; i++){
				var datapoint1 = datapoints[i];
				var datapoint2 = datapoints[i + 1];
				geometry.vertices.push(new THREE.Vector3(datapoint1.x, datapoint1.y - 0, datapoint1.z));
				geometry.vertices.push(new THREE.Vector3(datapoint2.x, datapoint2.y - 0, datapoint2.z));
				geometry.vertices.push(new THREE.Vector3(datapoint2.x, datapoint2.y - 1, datapoint2.z));
				geometry.vertices.push(new THREE.Vector3(datapoint1.x, datapoint1.y - 1, datapoint1.z));
				geometry.vertices.push(new THREE.Vector3(datapoint1.x, datapoint1.y - 0, datapoint1.z - 0.01));
				geometry.vertices.push(new THREE.Vector3(datapoint2.x, datapoint2.y - 0, datapoint2.z - 0.01));
				geometry.vertices.push(new THREE.Vector3(datapoint2.x, datapoint2.y - 1, datapoint2.z - 0.01));
				geometry.vertices.push(new THREE.Vector3(datapoint1.x, datapoint1.y - 1, datapoint1.z - 0.01));
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
			templateUrl: 'views/bracket.html',
			link: function link($scope, $element){
				var chart = {
						scene: new THREE.Scene(),
						lines: [],
					}, 
					controls,
					renderer = new THREE.WebGLRenderer({antialias: true}), 
					// projector = new THREE.Projector(), 
					needsRender = true;
				
				var rounds = [1, 2, 3, 4, 5, 6],
					maxRounds = 6,
					data = {},
					gameWidth = 2.5,
					totalWidth = (gameWidth + 1) * (maxRounds + 0.5) * 2,
					totalHeight = (Math.pow(2, maxRounds) / 2 / 2) + 2;

				var $width,
					$height,
					$tooltip = angular.element('<div/>').addClass('tooltip');
				$element.append($tooltip);
				$element.append(renderer.domElement);
				
				function addLight(){
					var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
					directionalLight.position.z = 3;
					chart.scene.add( directionalLight );
				}

				function addData(){
					_.each(rounds, function(round){
						var gameNum = 0;
						var roundVerticalPadding = (Math.pow(2, round - 1) - 1) / 2;
						_.each($scope.games, function(game){
							if(game.round === round){
								_.each(game.predictedParticipants, function(participant, i){
									data[participant] = data[participant] || {
										datapoints: [],
										name: participant,
										color: $scope.teams[participant].colors[0],
									};
									var gameOffset = ((Math.pow(2, maxRounds - round + 1)) - gameNum - 1) * Math.pow(2, round - 1);
									if(gameNum >= (Math.pow(2, maxRounds - round))){
										if((gameNum % (Math.pow(2, maxRounds - round))) >= (Math.pow(2, maxRounds - round - 1))){
											data[participant].datapoints.push({
												x: 1 * (maxRounds + 0.5) * (gameWidth + 1) - (round - 1) * (gameWidth + 1),
												y: -1 * Math.pow(2, maxRounds - 2) + 0 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
											data[participant].datapoints.push({
												x: 1 * (maxRounds + 0.5) * (gameWidth + 1) - ((round - 1) * (gameWidth + 1) + gameWidth),
												y: -1 * Math.pow(2, maxRounds - 2) + 0 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
										} else {
											data[participant].datapoints.push({
												x: 1 * (maxRounds + 0.5) * (gameWidth + 1) - (round - 1) * (gameWidth + 1),
												y: -1 * Math.pow(2, maxRounds - 2) + 2 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
											data[participant].datapoints.push({
												x: 1 * (maxRounds + 0.5) * (gameWidth + 1) - ((round - 1) * (gameWidth + 1) + gameWidth),
												y: -1 * Math.pow(2, maxRounds - 2) + 2 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
										}
									} else {
										if((gameNum % (Math.pow(2, maxRounds - round))) >= (Math.pow(2, maxRounds - round - 1))){
											data[participant].datapoints.push({
												x: -1 * (maxRounds + 0.5) * (gameWidth + 1) + ((round - 1) * (gameWidth + 1)),
												y: -3 * Math.pow(2, maxRounds - 2) + 0 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
											data[participant].datapoints.push({
												x: -1 * (maxRounds + 0.5) * (gameWidth + 1) + ((round - 1) * (gameWidth + 1) + gameWidth),
												y: -3 * Math.pow(2, maxRounds - 2) + 0 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
										} else{
											data[participant].datapoints.push({
												x: -1 * (maxRounds + 0.5) * (gameWidth + 1) + ((round - 1) * (gameWidth + 1)),
												y: -3 * Math.pow(2, maxRounds - 2) + 2 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
											data[participant].datapoints.push({
												x: -1 * (maxRounds + 0.5) * (gameWidth + 1) + ((round - 1) * (gameWidth + 1) + gameWidth),
												y: -3 * Math.pow(2, maxRounds - 2) + 2 + gameOffset + roundVerticalPadding, 
												z: (round - 1) * -0.5,
											});
										}
									}
									gameNum++;
								});
							}
						});
					});

					_.each(data, function(dataset){
						var geometry = makeLine(dataset.datapoints);
						var shader = new THREE.MeshLambertMaterial( { color: dataset.color , side: THREE.DoubleSide, transparent:true, opacity: 1});
						var object = new THREE.Mesh( geometry, shader );
						object.dataset = dataset;
						chart.scene.add(object);
						chart.lines.push(object);
					});
				}
				function removeData(){
					_.each(chart.lines, function(line){
						chart.scene.remove(line);
					});
					chart.lines = [];
					data = {};
				}

				function addCamera(){
					chart.camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000 );
					chart.scene.add( chart.camera );
					fitToScreen();
				}

				function fitToScreen(){
					$width = $element[0].clientWidth;
					$height = $element[0].clientHeight;
					renderer.setSize($width, $height);
					var vertical_FOV = chart.camera.fov * (Math.PI/ 180);
					var horizontal_FOV = 2 * Math.atan (Math.tan (vertical_FOV/2));

					var distance_vertical = totalHeight / (2 * Math.tan(vertical_FOV/2));
					var distance_horizontal = totalWidth / (2 * Math.tan(horizontal_FOV/2));
					var z_distance = distance_vertical >= distance_horizontal? distance_vertical : distance_horizontal;

					chart.camera.position.z = z_distance;
					chart.camera.position.y = 0 ;
					chart.camera.position.x = 0;
					chart.camera.scale.y = 0.747;

					chart.camera.rotation.x = 0;
					chart.camera.rotation.y = 0;
					chart.camera.rotation.z = 0;
					needsRender = true;
				}
				$scope.$watch('games', function(){
					removeData();
					addData();
					needsRender = true;
				}, true);

				function animate() {
					if(controls){
						controls.update();
					}
					requestAnimationFrame( animate );
					if(needsRender){
						renderer.render( chart.scene, chart.camera );
					}
					needsRender = false;
				}
				angular.element($window).on('resize', fitToScreen);

				addLight();
				addData();
				addCamera();
				// controls = new THREE.OrbitControls(chart.camera, renderer.domElement);
				requestAnimationFrame(animate);
			}
		};
	});