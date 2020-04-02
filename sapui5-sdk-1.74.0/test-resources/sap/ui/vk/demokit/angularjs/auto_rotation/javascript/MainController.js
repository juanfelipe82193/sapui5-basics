//Defining the contents of the controller
function MainController($scope) {

	$scope.file = null;

	$scope.loadFile = function(file, viewer) {
		console.log(file);
		console.log(viewer);
		if (file) {
			var contentResource = new sap.ui.vk.ContentResource({
				source: file,
				sourceType: "vds",
				sourceId: "abc"
			});
			viewer.destroyContentResources();
			viewer.addContentResource(contentResource);
		}
	};

	//instantiating the Viewer control
	$scope.viewer = new sap.ui.vk.Viewer({
		id: "viewerInstance",
		width: "100%",
		height: "525px"
	});
	$scope.viewer.placeAt("viewer-container");

	//initializing the default spped and the setInterval ID
	var speed = 2;
	var rotationInterval;

	//This is the function that rotates the model.
	//It's fired when you press the PLAY button
	$scope.startRotation = function () {
		var viewport = $scope.viewer.getViewport();
		if (viewport) {
			viewport.beginGesture(1, 1);
			clearInterval(rotationInterval);
			rotationInterval = setInterval(function () {
				viewport.rotate(speed, 0);
			}, 10);
		}
	};

	$scope.stopRotation = function () {
		clearInterval(rotationInterval);
	};

	$scope.increaseSpeed = function () {
		speed += 0.5;
	};

	$scope.decreaseSpeed = function () {
		if (speed > 0.5) {
			speed -= 0.5;
		}
	};
}

//Injecting the controller
angular.module("rotateApp").controller("MainController", MainController);