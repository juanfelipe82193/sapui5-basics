/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/

// Provides control sap.ui.vk.threejs.ViewportGestureHandler.
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/EventProvider",
	"./PerspectiveCamera",
	"./OrthographicCamera",
	"./thirdparty/three",
	"../getResourceBundle"
], function(jQuery,
	EventProvider,
	PerspectiveCamera,
	OrthographicCamera,
	threeJs,
	getResourceBundle
) {
	"use strict";

	var ViewportGestureHandler = EventProvider.extend("sap.ui.vk.threejs.ViewportGestureHandler", {
		metadata: {
		},
		constructor: function(viewport) {
			this._matProj = null;
			this._viewport = viewport;
			this._rect = null;
			this._evt = {
				x: 0,
				y: 0,
				z: 0,
				d: 0,
				initd: 0
			};
			this._gesture = false;
			this._viewport.attachEvent("resize", this, this._onresize);
			this._nomenu = false;

			// camera control
			var ThreeJsCameraController = function(vp) {

				var viewport = vp;

				// target of interaction
				var gestureTarget = new THREE.Vector3(); // center of interaction
				var zoomTarget = new THREE.Vector2();

				// turn table const
				var ANGLE_EPSILON = 0.001;
				var MIN_PITCH = -Math.PI / 2 + ANGLE_EPSILON;
				var MAX_PITCH = Math.PI / 2 - ANGLE_EPSILON;

				this.isTurnTableMode = true; // true by default
				this._timeIntervalForCameraAnimation = 500; // millisecond, time interval for one camera moving animation
				this._startTimeForCameraAnimation = 0;  // update count during camera moving animation
				this._newCamera = null;
				this._oldCamera = null;

				this._animationType = null;    // for hiring corresponding event at the end of animation, e.g. "zooming"

				this._zoomedNodeRef = null;   // for firing nodeZoomed event
				this._isZoomIn = true;			// for firing nodeZoomed event

				this.beginGesture = function(x, y) {
					var scene = viewport.getScene();
					if (scene == null) {
						return;
					}
					var sceneRef = scene.getSceneRef();
					var camera = viewport.getCamera().getCameraRef();

					var size = viewport.getRenderer().getSize();
					zoomTarget.x = x / size.width * 2 - 1;
					zoomTarget.y = y / size.height * -2 + 1;

					viewport._gesturePoint = { x: x, y: y };
					var hit = viewport.hitTest(x, y, sceneRef, camera);
					if (hit) {
						gestureTarget.copy(hit.point);
					} else {
						/*
						* TODO:
						* Maybe get the center of the scene from somewhere instead of calculating this everytime.
						*/
						var boundingBox = new THREE.Box3();
						sceneRef._expandBoundingBox(boundingBox, viewport._getLayers(), true);
						if (!boundingBox.isEmpty()) {
							boundingBox.getCenter(gestureTarget);
						} else {
							gestureTarget.setScalar(0);
						}
					}
				};

				this.endGesture = function() {
				};

				this.pan = function(dx, dy) {
					if (viewport.getFreezeCamera() || viewport.getCamera() == null){
						return;
					}

					if (dx === 0 && dy === 0) {
						return;
					}

					var camera = viewport.getCamera().getCameraRef();
					var size = viewport.getRenderer().getSize();

					if (camera.view && camera.view.enabled) { // Redline mode is activated
						camera.view.offsetX -= dx * camera.zoom * camera.view.width / camera.view.fullWidth;
						camera.view.offsetY -= dy * camera.zoom * camera.view.height / camera.view.fullHeight;
						camera.updateProjectionMatrix();
					} else {
						var offset = gestureTarget.clone().project(camera);
						offset.x -= dx * 2 / size.width;
						offset.y += dy * 2 / size.height;
						offset.unproject(camera).sub(gestureTarget);
						camera.position.add(offset);
						camera.updateMatrixWorld();
					}
					viewport.fireCameraChanged({
						position: camera.position.toArray()
					});
				};

				this.rotate = function(dx, dy, isTurnTableMode) {
					if (viewport.getFreezeCamera() || viewport.getCamera() == null){
						return;
					}

					if (isTurnTableMode !== undefined) {
						this.isTurnTableMode = isTurnTableMode;
					}

					if (dx === 0 && dy === 0) {
						return;
					}

					var camera = viewport.getCamera().getCameraRef(),
						deltaYaw = dx * -0.01,
						deltaPitch = dy * -0.01;

					var origin = camera.position.clone().sub(gestureTarget);
					var lookDir = new THREE.Vector3(),
						upDir = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1).normalize(),
						rightDir = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).normalize();
					camera.getWorldDirection(lookDir);
					lookDir.normalize();
					var rotationX = new THREE.Quaternion(),
						rotationY = new THREE.Quaternion();

					if (this.isTurnTableMode) {
						var sceneUpDir = new THREE.Vector3(0, 1, 0);
						rightDir.crossVectors(lookDir, sceneUpDir).normalize();
						upDir.crossVectors(rightDir, lookDir);
						var pitch = Math.atan2(lookDir.y, Math.sqrt(lookDir.x * lookDir.x + lookDir.z * lookDir.z));
						rotationX.setFromAxisAngle(sceneUpDir, deltaYaw); // Y-axis for now
						rotationY.setFromAxisAngle(rightDir, THREE.Math.clamp(deltaPitch, MIN_PITCH - pitch, MAX_PITCH - pitch));
					} else {
						rotationX.setFromAxisAngle(upDir, deltaYaw);
						rotationY.setFromAxisAngle(rightDir, deltaPitch);
					}

					rotationX.multiply(rotationY); // put them together

					// apply rotation
					origin.applyQuaternion(rotationX);
					lookDir.applyQuaternion(rotationX);
					upDir.applyQuaternion(rotationX);

					origin.add(gestureTarget);

					// update camera
					camera.position.copy(origin);
					camera.up.copy(upDir);
					camera.lookAt(origin.add(lookDir));
					camera.updateMatrixWorld();
					viewport.fireCameraChanged({
						position: camera.position.toArray(),
						quaternion: camera.quaternion.toArray()
					});
				};

				this.zoom = function(zoomFactorScaler) {
					if (zoomFactorScaler === 0 || zoomFactorScaler === 1 || viewport.getFreezeCamera() ||
						viewport.getCamera() === null || viewport.getScene() === null){
						return;
					}

					var camera = viewport.getCamera().getCameraRef();
					var delta = new THREE.Vector3();

					if (!camera.userData.isRedlineActivated) {
						var zoomOutLimit = 100; // zoom out limit to 100px
						var boundingBox = new THREE.Box3();
						var boundingBoxSize = new THREE.Vector3();
						viewport.getScene().getSceneRef()._expandBoundingBox(boundingBox, viewport._getLayers(), true);
						boundingBox.applyMatrix4(camera.matrixWorldInverse);
						boundingBox.min.z = Math.max(boundingBox.min.z, camera.near);
						boundingBox.max.z = Math.max(boundingBox.max.z, camera.near);
						boundingBox.applyMatrix4(camera.projectionMatrix);
						boundingBox.getSize(boundingBoxSize);
						var viewpostSize = viewport.getRenderer().getSize();
						var sx = boundingBoxSize.x * viewpostSize.width * 0.5;
						var sy = boundingBoxSize.y * viewpostSize.height * 0.5;
						if (sx < zoomOutLimit && sy < zoomOutLimit && zoomFactorScaler < 1) {
							return;
						}
					}

					if (camera.isPerspectiveCamera) {
						if (camera.view && camera.view.enabled) { // Redline mode is activated
							var size = viewport.getDomRef();
							var x = viewport._gesturePoint.x / size.clientWidth;
							var y = viewport._gesturePoint.y / size.clientHeight;
							var f = 1 / zoomFactorScaler;
							camera.view.offsetX += x * camera.view.width;
							camera.view.offsetY += y * camera.view.height;
							camera.view.width *= f;
							camera.view.height *= f;
							camera.view.offsetX -= x * camera.view.width;
							camera.view.offsetY -= y * camera.view.height;
						} else {
							// Calculate how much to move camera to achieve zoom and apply this calculation to the camera position
							delta.set(zoomTarget.x, zoomTarget.y, 1).unproject(camera);
							delta.sub(new THREE.Vector3(zoomTarget.x, zoomTarget.y, -1).unproject(camera));

							var moveDistance = gestureTarget.clone().sub(camera.position).length() * (1 - 1 / zoomFactorScaler);
							delta.setLength(moveDistance);
							camera.position.add(delta);
						}
					} else if (camera.isOrthographicCamera) {
						delta.set(zoomTarget.x, zoomTarget.y, 1).unproject(camera);
						delta.sub(new THREE.Vector3(0, 0, 1).unproject(camera));
						delta.multiplyScalar(1 - 1 / zoomFactorScaler);

						camera.zoom *= zoomFactorScaler;
						camera.position.add(delta);
					} else {
						jQuery.sap.log.error(getResourceBundle().getText("VIEWPORTGESTUREHANDLER_MSG_UNSUPPORTEDCAMERATYPE"));
					}

					camera.updateProjectionMatrix();
					camera.updateMatrixWorld();
					var params = { position: camera.position.toArray() };
					if (camera.isOrthographicCamera) {
						params.zoom = camera.zoom;
					}
					viewport.fireCameraChanged(params);
				};

				this.animateCameraUpdate = function() {
					if (this._newCamera === null || this._oldCamera === null) {
						return;
					}

					if (viewport.getCamera() == null) {
						// This means that camera is destroyed (scene set to null) while active camera was still animating
						this._newCamera = null;
						this._oldCamera = null;
						return;
					}

					function smootherStep(edge0, edge1, x) {
						// Scale, and clamp x to 0..1 range
						x = THREE.Math.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
						// Evaluate polynomial
						return x * x * x * (x * (x * 6 - 15) + 10);
					}

					var interpolateCoeff = Math.min((Date.now() - this._startTimeForCameraAnimation) / this._timeIntervalForCameraAnimation, 1);
					interpolateCoeff = smootherStep(0, 1, interpolateCoeff);

					var camera = viewport.getCamera().getCameraRef();

					if (camera.isOrthographicCamera && this._newCamera.isOrthographicCamera && this._oldCamera.isOrthographicCamera) {
						camera.left = THREE.Math.lerp(this._oldCamera.left, this._newCamera.left, interpolateCoeff);
						camera.right = THREE.Math.lerp(this._oldCamera.right, this._newCamera.right, interpolateCoeff);
						camera.top = THREE.Math.lerp(this._oldCamera.top, this._newCamera.top, interpolateCoeff);
						camera.bottom = THREE.Math.lerp(this._oldCamera.bottom, this._newCamera.bottom, interpolateCoeff);
						camera.zoom = THREE.Math.lerp(this._oldCamera.zoom, this._newCamera.zoom, interpolateCoeff);
					}

					if (camera.isPerspectiveCamera && this._newCamera.isPerspectiveCamera && this._oldCamera.isPerspectiveCamera) {
						camera.fov = THREE.Math.lerp(this._oldCamera.fov, this._newCamera.fov, interpolateCoeff);
						camera.aspect = THREE.Math.lerp(this._oldCamera.aspect, this._newCamera.aspect, interpolateCoeff);
					}

					camera.far = THREE.Math.lerp(this._oldCamera.far, this._newCamera.far, interpolateCoeff);
					camera.near = THREE.Math.lerp(this._oldCamera.near, this._newCamera.near, interpolateCoeff);

					camera.updateProjectionMatrix();

					camera.position.lerpVectors(this._oldCamera.position, this._newCamera.position, interpolateCoeff);
					camera.scale.lerpVectors(this._oldCamera.scale, this._newCamera.scale, interpolateCoeff);

					camera.up.lerpVectors(this._oldCamera.up, this._newCamera.up, interpolateCoeff);
					var oldDirection = this._oldCamera.getWorldDirection(new THREE.Vector3());
					var newDirection = this._newCamera.getWorldDirection(new THREE.Vector3());
					var targetDirection = new THREE.Vector3().lerpVectors(oldDirection, newDirection, interpolateCoeff);
					camera.lookAt(targetDirection.add(camera.position));

					if (interpolateCoeff === 1) {
						this._newCamera = null;
						this._oldCamera = null;
						if (this._animationType === "zooming" && this._zoomedNodeRef) {
							viewport.fireNodeZoomed({
								zoomed: this._zoomedNodeRef,
								isZoomIn: this._isZoomIn
							});
						}
						viewport.cameraUpdateCompleted({
							position: camera.position.toArray(),
							quaternion: camera.quaternion.toArray()
						});
					}

					viewport.fireCameraChanged({
						position: camera.position.toArray(),
						quaternion: camera.quaternion.toArray()
					});
				};

				this.zoomObject = function(nodeRef, isIn, timeInterval) {
					if (viewport.getScene() == null) {
						return;
					}

					var boundingBox = new THREE.Box3();
					(isIn && nodeRef ? nodeRef : viewport.getScene().getSceneRef())._expandBoundingBox(boundingBox, viewport._getLayers(), true);
					this.zoomBox(boundingBox, 0, timeInterval, nodeRef, isIn);
				};

				this.zoomBox = function(boundingBox, margin, timeInterval, nodeRef, isIn) {
					this._zoomedNodeRef = nodeRef;
					this._isZoomIn = isIn;
					this._animationType = "zooming";

					var camera = viewport.getCamera().getCameraRef();
					var size = new THREE.Vector3();
					boundingBox.getSize(size);
					if (size.lengthSq() === 0) {
						return; // ignore empty bounding box
					}
					var dir = new THREE.Vector3();
					camera.getWorldDirection(dir);
					dir.multiplyScalar(size.length());
					var newTarget = new THREE.Vector3();
					boundingBox.getCenter(newTarget);

					var boxVertices = [ new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
					new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z),
					new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
					new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),
					new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),
					new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),
					new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
					new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z) ];

					var matViewProj = new THREE.Matrix4(),
						projectVector = new THREE.Vector3();
					function insideFrustum(camera) {
						matViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
						for (var i in boxVertices) {
							projectVector.copy(boxVertices[i]).applyMatrix4(matViewProj);
							if (projectVector.x < -1.0 || projectVector.x > 1.0 || projectVector.y < -1.0 || projectVector.y > 1.0) {
								return false;
							}
						}
						return true;
					}

					this._newCamera = camera.clone();
					this._newCamera.position.copy(newTarget).sub(dir);
					this._newCamera.updateMatrixWorld(true);

					if (camera.isPerspectiveCamera) {
						// adjust origin to make the object inside frustum
						while (!insideFrustum(this._newCamera)) {
							this._newCamera.position.sub(dir);
							this._newCamera.updateMatrixWorld(true);
						}

						// fine tuning the origin position
						var step = 10;
						var vPos1 = this._newCamera.position.clone();
						var vPos2 = newTarget.clone();
						for (var nj = 0; nj < step; nj++) {
							this._newCamera.position.copy(vPos1).add(vPos2).multiplyScalar(0.5);
							this._newCamera.updateMatrixWorld(true);
							if (insideFrustum(this._newCamera)) {
								vPos1.copy(this._newCamera.position);
							} else {
								vPos2.copy(this._newCamera.position);
							}
						}
						this._newCamera.position.copy(vPos1).sub(newTarget).multiplyScalar(margin).add(vPos1);
						this._newCamera.updateMatrixWorld(true);
					}

					if (camera.isOrthographicCamera) {
						var projectBox = new THREE.Box2();
						boxVertices.forEach(function(vertex) {
							projectVector = vertex.project(this._newCamera);
							projectBox.expandByPoint(new THREE.Vector2(projectVector.x, projectVector.y));
						}.bind(this));

						this._newCamera.zoom /= Math.max(projectBox.getSize().x, projectBox.getSize().y) * 0.5 * (1 + margin);
						this._newCamera.updateProjectionMatrix();
					}

					this._startTimeForCameraAnimation = Date.now();
					this._timeIntervalForCameraAnimation = timeInterval !== undefined ? timeInterval : 500;
				};

				this.prepareForCameraUpdateAnimation = function(){
					this._oldCamera = viewport.getCamera().getCameraRef().clone();
				};

				this.startAnimatingCameraUpdate = function(timeInterval, pauseWhenNoCameraChange) {
					var camera = viewport.getCamera().getCameraRef();

					if (!this._oldCamera) {
						return 0;
					}

					var notEqualCamera = false;
					var tolerance = 0.0001;

					if (camera.isOrthographicCamera && this._oldCamera.isOrthographicCamera) {
						if (Math.abs(camera.left - this._oldCamera.left) > tolerance ||
							Math.abs(camera.right - this._oldCamera.right) > tolerance ||
							Math.abs(camera.top - this._oldCamera.top) > tolerance ||
							Math.abs(camera.bottom - this._oldCamera.bottom) > tolerance ||
							Math.abs(camera.zoom - this._oldCamera.zoom) > tolerance) {
								notEqualCamera = true;
						}
					} else if (camera.isPerspectiveCamera && this._oldCamera.isPerspectiveCamera) {
						if (Math.abs(camera.fov - this._oldCamera.fov) > tolerance ||
							Math.abs(camera.aspect - this._oldCamera.aspect) > tolerance) {
								notEqualCamera = true;
						}
					}

					if (!notEqualCamera) {
						if (Math.abs(camera.position.x - this._oldCamera.position.x) > tolerance ||
							Math.abs(camera.position.y - this._oldCamera.position.y) > tolerance ||
							Math.abs(camera.position.z - this._oldCamera.position.z) > tolerance ||
							Math.abs(camera.scale.x - this._oldCamera.scale.x) > tolerance ||
							Math.abs(camera.scale.y - this._oldCamera.scale.y) > tolerance ||
							Math.abs(camera.scale.z - this._oldCamera.scale.z) > tolerance ||
							Math.abs(camera.quaternion.x - this._oldCamera.quaternion.x) > tolerance ||
							Math.abs(camera.quaternion.y - this._oldCamera.quaternion.y) > tolerance ||
							Math.abs(camera.quaternion.z - this._oldCamera.quaternion.z) > tolerance ||
							Math.abs(camera.quaternion.w - this._oldCamera.quaternion.w) > tolerance) {
								notEqualCamera = true;
						}
					}

					if (!notEqualCamera) {
						if (!pauseWhenNoCameraChange) {// If we are playing a procedure we want camera to update regardless, but if we are playing a single view we do not
							viewport.cameraUpdateCompleted({
								position: camera.position.toArray(),
								quaternion: camera.quaternion.toArray()
							});
							return 0;
						} else {
							timeInterval = 500;
						}
					}

					this._newCamera = viewport.getCamera().getCameraRef().clone();
					this._timeIntervalForCameraAnimation = timeInterval !== undefined ? timeInterval : 500;
					this._startTimeForCameraAnimation = Date.now();

					return timeInterval;
				};
			};

			this._cameraController = new ThreeJsCameraController(viewport);
		}
	});

	ViewportGestureHandler.prototype._activateRedline = function() {
		var camera = this._viewport.getCamera().getCameraRef();
		camera.userData.isRedlineActivated = true;
		if (camera.isPerspectiveCamera) {
			var domRef = this._viewport.getDomRef();
			camera.setViewOffset(domRef.clientWidth, domRef.clientHeight, 0, 0, domRef.clientWidth, domRef.clientHeight);
		}
	};

	ViewportGestureHandler.prototype._deactivateRedline = function() {
		var camera = this._viewport.getCamera().getCameraRef();
		camera.userData.isRedlineActivated = false;
		camera.clearViewOffset();
	};

	ViewportGestureHandler.prototype.destroy = function() {
		this._viewport = null;
		this._rect = null;
		this._evt = null;
		this._gesture = false;
	};

	ViewportGestureHandler.prototype._getOffset = function(obj) {
		var rectangle = obj.getBoundingClientRect();
		var p = {
			x: rectangle.left + window.pageXOffset,
			y: rectangle.top + window.pageYOffset
		};
		return p;
	};

	ViewportGestureHandler.prototype._inside = function(event) {
		if (this._rect === null || true) {
			var id = this._viewport.getIdForLabel();
			var domobj = document.getElementById(id);
			if (!domobj) {
				return false;
			}

			var o = this._getOffset(domobj);
			this._rect = {
				x: o.x,
				y: o.y,
				w: domobj.offsetWidth,
				h: domobj.offsetHeight
			};
		}

		return (event.x >= this._rect.x && event.x <= this._rect.x + this._rect.w && event.y >= this._rect.y && event.y <= this._rect.y + this._rect.h);
	};

	ViewportGestureHandler.prototype._onresize = function(event) {
		this._gesture = false;
		this._rect = null;
	};

	ViewportGestureHandler.prototype.beginGesture = function(event) {
		if (this._inside(event) && !this._gesture) {
			this._gesture = true;

			var x = event.x - this._rect.x,
				y = event.y - this._rect.y;

			this._evt.x = x;
			this._evt.y = y;
			this._evt.d = event.d;
			this._evt.initd = event.d;
			this._evt.avgd = event.d;
			this._evt.avgx = 0;
			this._evt.avgy = 0;

			jQuery.sap.log.debug("Loco: beginGesture: " + x + ", " + y);

			this._cameraController.beginGesture(x, y);

			event.handled = true;

			if (document.activeElement) {
				try {
					document.activeElement.blur();
				} catch (e) {
					// IE can have error calling blur() in fullscreen mode
				}
			}

			var domobj = document.getElementById(this._viewport.getIdForLabel());
			domobj.focus();
		}
		this._nomenu = false;
	};

	ViewportGestureHandler.prototype.move = function(event) {
		if (this._gesture) {
			var x = event.x - this._rect.x,
				y = event.y - this._rect.y;
			var dx = x - this._evt.x;
			var dy = y - this._evt.y;
			var dd = event.d - this._evt.d;

			this._evt.x = x;
			this._evt.y = y;
			this._evt.d = event.d;

			this._evt.avgx = this._evt.avgx * 0.99 + dx * 0.01;
			this._evt.avgy = this._evt.avgy * 0.99 + dy * 0.01;

			var z = 1.0;

			if (this._evt.initd > 0) {
				z = 1.0 + dd * (1.0 / this._evt.initd);
			} else if (event.n === 2) {
				if (event.points[ 0 ].y > event.points[ 1 ].y) {
					z = 1.0 - dd * 0.005;
					if (z < 0.333) {
						z = 0.333;
					}
				} else {
					z = 1.0 + dd * 0.005;
					if (z > 3) {
						z = 3;
					}
				}
			}

			// Zoom smoothing
			if (this._evt.initd > 0) {
				var avgdist = Math.sqrt(this._evt.avgx * this._evt.avgx + this._evt.avgy * this._evt.avgy);

				jQuery.sap.log.debug("AvgDist: " + avgdist);
				if ((Math.abs(event.d - this._evt.avgd) / this._evt.avgd) < (avgdist / 10)) {
					z = 1.0;
				}
			}

			z = THREE.Math.clamp(z, 0.88, 1.12); // restriction of zoom because of Pinch on Macbook trackpad

			// Weighted average threshold
			this._evt.avgd = this._evt.avgd * 0.97 + event.d * 0.03;

			switch (event.n) {
				case 1:
					jQuery.sap.log.debug("Loco: Rotate: " + (dx) + ", " + (dy));

					this._cameraController.rotate(dx, dy);
					break;

				case 2:
					jQuery.sap.log.debug("Loco: Pan: " + (dx) + ", " + (dy));
					if (z != 0 && z != 1.0) {
						jQuery.sap.log.debug("Loco: Zoom: " + (z));
					}

					this._cameraController.pan(dx, dy);

					if (dx < 10 && dy < 10 && z != 0 && z != 1.0) {
						this._cameraController.zoom(z);
					}

					break;
				default:
					break;
			}

			this._nomenu = true;
			event.handled = true;
		}
	};

	ViewportGestureHandler.prototype.endGesture = function(event) {
		if (this._gesture) {
			var x = event.x - this._rect.x,
				y = event.y - this._rect.y;

			jQuery.sap.log.debug("Loco: endGesture: " + x + ", " + y);

			this._cameraController.endGesture();

			this._gesture = false;
			event.handled = true;
		}
	};

	ViewportGestureHandler.prototype.click = function(event) {
		if (this._inside(event) && event.buttons <= 1) {
			var x = event.x - this._rect.x,
				y = event.y - this._rect.y;
			jQuery.sap.log.debug("Loco: click: " + (x) + ", " + (y));

			if (this._viewport) {
				this._viewport.tap(x, y, false);
			}

			event.handled = true;
		}
	};

	ViewportGestureHandler.prototype.doubleClick = function(event) {
		if (this._inside(event) && event.buttons <= 1) {
			var x = event.x - this._rect.x,
				y = event.y - this._rect.y;
			jQuery.sap.log.debug("Loco: doubleClick: " + (x) + ", " + (y));
			if (this._viewport) {
				this._viewport.tap(x, y, true);
			}

			event.handled = true;
		}
	};

	ViewportGestureHandler.prototype.contextMenu = function(event) {
		if (this._inside(event) || this._nomenu || event.buttons === 5) {
			this._nomenu = false;

			event.handled = true;
		}
	};

	ViewportGestureHandler.prototype.keyEventHandler = function(event) {
	};

	ViewportGestureHandler.prototype.getViewport = function() {
		return this._viewport;
	};

	ViewportGestureHandler.prototype.activateCamera = function(camera, timeInterval, pauseWhenNoCameraChange, notAnimateCameraChange) {
		var realTimeInterval = 0;
		this._cameraController.prepareForCameraUpdateAnimation();
		if (this._viewport.getCamera().getCameraRef().isPerspectiveCamera != camera.isPerspectiveCamera) {
			this._viewport.setCamera(camera.isPerspectiveCamera ? new PerspectiveCamera() : new OrthographicCamera());
		}
		this._viewport.getCamera().getCameraRef().copy(camera);
		var size = this._viewport.getRenderer().getSize();
		this._viewport.getCamera().update(size.width, size.height);
		if (!notAnimateCameraChange) {
			realTimeInterval = this._cameraController.startAnimatingCameraUpdate(timeInterval, pauseWhenNoCameraChange);
		} else {
			this._viewport.cameraUpdateCompleted({
				position: camera.position.toArray(),
				quaternion: camera.quaternion.toArray()
			});
		}
		return realTimeInterval;
	};

	ViewportGestureHandler.prototype.setView = function(quaternion, timeInterval) {
		this._cameraController.prepareForCameraUpdateAnimation();
		var camera = this._viewport.getCamera().getCameraRef();
		if (quaternion) {
			camera.quaternion.copy(quaternion);
			camera.updateMatrixWorld();
			camera.up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
			this._cameraController.zoomObject(null, false, timeInterval);
		} else {
			camera.copy(this._viewport._homeCamera ? this._viewport._homeCamera : new PerspectiveCamera().getCameraRef());
			var size = this._viewport.getRenderer().getSize();
			this._viewport.getCamera().update(size.width, size.height);
			this._cameraController.startAnimatingCameraUpdate(timeInterval);
		}
		return this;
	};

	ViewportGestureHandler.prototype.zoomTo = function(boundingBox, quaternion, margin, timeInterval, nodeRef, isIn) {
		this._cameraController.prepareForCameraUpdateAnimation();
		if (quaternion) {
			var camera = this._viewport.getCamera().getCameraRef();
			camera.quaternion.copy(quaternion);
			camera.updateMatrixWorld();
			camera.up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
		}
		this._cameraController.zoomBox(boundingBox, margin, timeInterval, nodeRef, isIn);
		return this;
	};

	ViewportGestureHandler.prototype.zoomObject = function(nodeRef, isIn, timeInterval) {
		this._cameraController.prepareForCameraUpdateAnimation();
		this._cameraController.zoomObject(nodeRef, isIn, timeInterval);
		return this;
	};

	ViewportGestureHandler.prototype.animateCameraUpdate = function() {
		this._cameraController.animateCameraUpdate();
	};

	ViewportGestureHandler.prototype.prepareForCameraUpdateAnimation = function() {
		this._cameraController.prepareForCameraUpdateAnimation();
	};

	ViewportGestureHandler.prototype.startAnimatingCameraUpdate = function(timeInterval) {
		this._cameraController.startAnimatingCameraUpdate(timeInterval);
	};

	return ViewportGestureHandler;
});
