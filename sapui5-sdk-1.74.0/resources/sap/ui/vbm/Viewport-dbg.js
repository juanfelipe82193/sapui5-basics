/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

sap.ui.define([
	"sap/ui/core/Control",
	"jquery.sap.global",
	"sap/ui/core/ResizeHandler",
	"./adapter3d/thirdparty/three",
	"./adapter3d/thirdparty/OrbitControls",
	"./adapter3d/Utilities",
	"./library"
], function (Control, jQuery, ResizeHandler, THREE, OrbitControls, Utilities, library) {
	"use strict";

	var thisModule	= "sap.ui.vbm.Viewport";
	var log			= jQuery.sap.log;

	/**
	 *  Constructor for a new three js viewport for Adapter3D.
	 *
	 * @class Provides a control for three js canvas.
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.core.Control
	 * @alias sap.ui.vbm.Viewport
	 */
	var Viewport = Control.extend("sap.ui.vbm.Viewport", /** @lends sap.ui.vbm.Viewport.prototype **/ {
		metadata: {
			library: "sap.ui.vbm",

			properties: {
				/**
				 * Viewport width
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},
				/**
				 * Viewport height
				 */
				height: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},
				/**
				 * Camera history length (read only)
				 */
				cameraHistoryLength: {
					type: "int",
					defaultValue: 0
				},
				/**
				 * Camera history position
				 */
				cameraHistoryPos: {
					type: "int"
				}
			},
			events: {
				/**
				 * This event is fired when camera positioning changed
				 */
				cameraChange: {
					parameters: {
						/**
						 * Current position in camera history
						 */
						historyPos: {
							type: "int"
						},
						/**
						 * Camera history length
						 */
						historyLength: {
							type: "int"
						}
					}
				}
			}
		}
	});

	var EPS = 0.000001;
	var FLY_TO_LENGTH = 0.6;
	var MAP_PLANE_SIZE = 50.0;

	var basePrototype = Viewport.getMetadata().getParent().getClass().prototype;

	Viewport.prototype.init = function () {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}
		this._resizeListenerId = null;
		this._renderLoopRequestId = 0;
		this._renderLoopFunction = this._renderLoop.bind(this);

		this._renderer = new THREE.WebGLRenderer({antialias: true});
		this._renderer.setPixelRatio(window.devicePixelRatio);
		this._renderer.shadowMap.enabled = true;
		this._renderer.domElement.tabIndex = -1;
		this._renderer.domElement.id = this.getId() + "-canvas"; // give canvas Id so it can be found and used in custom app

		this._scene = new THREE.Scene();
		this._root = new THREE.Group();

		this._root.scale.set(-1, 1, 1); // mirror entire geometry along X to reflect differences between ActiveX coordinate system and ThreeJS coordinate system
		this._root.rotateX(THREE.Math.degToRad(90)); // and rotate also to make sure Y is up so OrbitControls is working fine
		this._scene.add(this._root);

		// debug: Show scene axes, X - red, Y - green, Z - blue
		// this._scene.add(new THREE.AxisHelper(10));

		// create artificial (invisible) map plane for actions subscriptions (right click on a map)
		this._mapPlane = new THREE.Mesh(new THREE.PlaneGeometry(MAP_PLANE_SIZE, MAP_PLANE_SIZE, 1, 1), new THREE.MeshBasicMaterial({color: 0x207bad, side: THREE.DoubleSide, visible: false}));
		this._mapPlane.name = "MapPlane";
		this._mapPlane.visible = false; // disable standard hittest
		this._root.add(this._mapPlane);
		// debug: Show map plane
		// this._mapPlane.material.visible = true;

		this._scene.background = new THREE.Color( 'white' ); // set background as in ActiveX version

		var ambientLight = new THREE.AmbientLight(0x202020, 1);
		this._scene.add(ambientLight);

		// CAD optimized, fixed light #1
		var light_1 = new THREE.DirectionalLight(0x333333, 1);
		light_1.position.set(0, 0, -1);
		this._scene.add(light_1);

		// CAD optimized, fixed light #2
		var light_2 = new THREE.DirectionalLight(0x51515b, 1);
		light_2.position.set(-2, -1.1, 2.5);
		this._scene.add(light_2);

		// CAD optimized, fixed light #3
		var light_3 = new THREE.DirectionalLight(0x5b5b5b, 2);
		light_3.position.set(2, 1.5, 0.5);
		this._scene.add(light_3);

		// light from camera
		this._light = new THREE.DirectionalLight(0xEEEEEE, 1);
		this._lightPos = new THREE.Vector3(0, 0, 0);
		this._scene.add(this._light);

		this._camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 2000);
		this._scene.add(this._camera);
		this._camera.position.set(0, 30, 30);
		this._camera.lookAt(new THREE.Vector3(0, 0, 0));

		this._cameraHome;
		this._flyToRequestId;
		this._resetTimerId;
		this._cameraHistory = [];
		this._cameraChangeEvent = {};  // object to reuse

		this._cameraController = new OrbitControls(this._camera, this._renderer.domElement);
		this._cameraController.addEventListener("end", this._cameraEnd.bind(this));
		this._cameraController.addEventListener("change", this._cameraUpdate.bind(this));
		this._cameraController.update();
	};

	Viewport.prototype.exit = function () {
		if (this._resizeListenerId) {
			ResizeHandler.deregister(this._resizeListenerId);
			this._resizeListenerId = null;
		}
		this._stopRenderLoop();

		this._scene = null;
		this._camera = null;
		this._renderer = null;

		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
	};

	Viewport.prototype.getRoot = function() {
		return this._root;
	};

	Viewport.prototype.getScene = function() {
		return this._scene;
	};

	Viewport.prototype.getCamera = function() {
		return this._camera;
	};

	Viewport.prototype.getCameraHistoryLength = function() {
		return this._cameraHistory.length;
	};

	Viewport.prototype.setCameraHistoryLength = function() {
		log.error("cameraHistoryLength is read only property", thisModule);
		return this;
	};

	Viewport.prototype.setCameraHistoryPos = function(pos) {
		if (this._cameraHistory.length > 0 && pos >= 0 && pos < this._cameraHistory.length) {
			if (pos !== this.getCameraHistoryPos()) {
				this.setProperty("cameraHistoryPos", pos, true);
				delete this._cameraHistory[pos].tag; // remove if exists
				this._fireCameraChange();
				this._flyTo(this._cameraController.saveState(), this._cameraHistory[pos], FLY_TO_LENGTH);
			}
		}
		return this;
	};

	Viewport.prototype.applyCameraHome = function(flyTo) {
		if (this._cameraHome) {
			this._applyCamera(this._cameraHome, flyTo);
		}
	};

	// Three JS world coordinate to screen coordinate
	Viewport.prototype.worldToScreen = function(point) {
		var element = this.getDomRef();

		if (!element) { //no rendered yet -> cannot reproject
			return undefined;
		}
		var rect = element.getBoundingClientRect();
		var camera = this.getCamera();
		var matViewProj = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, new THREE.Matrix4().getInverse(camera.matrixWorld));
		var sp = point.clone().applyMatrix4(matViewProj);
		var x = Math.floor((+sp.x * 0.5 + 0.5) * rect.width  + 0.5);
		var y = Math.floor((-sp.y * 0.5 + 0.5) * rect.height + 0.5);

		return new THREE.Vector2(x, y);
	};

	Viewport.prototype.onBeforeRendering = function() {
		if (this._resizeListenerId) {
			ResizeHandler.deregister(this._resizeListenerId);
			this._resizeListenerId = null;
		}
		this._stopRenderLoop();
	};

	Viewport.prototype.onAfterRendering = function () {
		var domRef = this.getDomRef();
		domRef.appendChild(this._renderer.domElement);

		this._resizeListenerId = ResizeHandler.register(this, this._handleResize.bind(this));

		this._handleResize({
			size: {
				width: domRef.clientWidth,
				height: domRef.clientHeight
			}
		});
		this._startRenderLoop();
	};

	Viewport.prototype._handleResize = function (event) {
		if (!this._camera || !this._renderer) {
			return false;
		}
		var width = event.size.width;
		var height = event.size.height;

		if (this._camera) {
			this._camera.aspect = width / height;
			this._camera.updateProjectionMatrix();
		}
		this._renderer.setSize(width, height, false);
	};

	Viewport.prototype._startRenderLoop = function () {
		if (!this._renderLoopRequestId) {
			this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction);
		}
		return this;
	};

	Viewport.prototype._stopRenderLoop = function() {
		if (this._renderLoopRequestId) {
			window.cancelAnimationFrame(this._renderLoopRequestId);
			this._renderLoopRequestId = 0;
		}
		return this;
	};

	Viewport.prototype._renderLoop = function () {
		this._cameraController.update();
		// update direction of light based on camera
		this._camera.getWorldDirection(this._lightPos);
		this._lightPos.negate();
		this._light.position.copy(this._lightPos);
		this._renderer.render(this._scene, this._camera);
		this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction);
	};

	// cubic easing out formula
	function easeOutCubic(time, start, end, total) {
		return start + end * ((time = time / total - 1) * time * time + 1);
	}

	function flyToAnimation(context) {
		var time = Math.min((Date.now() - context.when) / 1000, context.length); //delta time in seconds

		// cubic ease out for target
		var target = context.tempTarget;
		target.x = easeOutCubic(time, context.from.target.x, context.to.target.x - context.from.target.x, context.length);
		target.y = easeOutCubic(time, context.from.target.y, context.to.target.y - context.from.target.y, context.length);
		target.z = easeOutCubic(time, context.from.target.z, context.to.target.z - context.from.target.z, context.length);

		// cubic ease out for distance
		var distance = easeOutCubic(time, context.distanceFrom, context.distanceTo - context.distanceFrom, context.length);
		// cubic ease out for angle
		var angle = easeOutCubic(time, 0, context.angle, context.length);
		// rotate pos vector using axis and computed angle
		var pos = context.tempPos.copy(context.dir).applyAxisAngle(context.axis, angle).multiplyScalar(distance).add(target);

		this._cameraController.reset({
			position: pos,
			target: target,
			zoom: 1.0
		});

		if (time < context.length) {
			this._flyToRequestId = window.requestAnimationFrame(flyToAnimation.bind(this, context)); // continue animation
		} else {
			this._flyToRequestId = undefined;
		}
	}

	Viewport.prototype._flyTo = function(from, to, length) {
		// initiate fly-to animation
		var dirTo = to.position.clone().sub(to.target);
		var dirFrom = from.position.clone().sub(from.target);
		var lengthTo = dirTo.length();
		var lengthFrom = dirFrom.length();
		var angle = Math.acos(Utilities.clamp(dirFrom.dot(dirTo) / (lengthTo * lengthFrom), -1, 1)); // can get sometimes tiny greater than 1

		var context = {
			to: to,
			from: from,
			when: Date.now(),
			length: length,
			angle: angle,
			axis: dirFrom.clone().cross(dirTo).normalize(),
			distanceTo: lengthTo,
			distanceFrom: lengthFrom,
			dir: dirFrom.normalize(),
			tempPos: new THREE.Vector3(), // to avoid vector creation every frame
			tempTarget: new THREE.Vector3() // to avoid vector creation every frame
		};
		if (this._flyToRequestId) {
			window.cancelAnimationFrame(this._flyToRequestId);
		}
		this._flyToRequestId = window.requestAnimationFrame(flyToAnimation.bind(this, context));
	};

	Viewport.prototype._cameraEnd = function (event) {
		// camera updated by mouse/touch device
		var state = this._cameraController.saveState();
		var pos = this.getCameraHistoryPos();
		var current = pos >= 0 ? this._cameraHistory[pos] : undefined;
		// to avoid history flooding
		if (current == undefined || state.target.distanceToSquared(current.target) > EPS || state.position.distanceToSquared(current.position) > EPS) {
			this._pushCameraChange(state);
		}
	};

	function resetStateTag() {
		// reset tag for the last state in history
		if (this._cameraHistory.length > 0) {
			delete this._cameraHistory[this._cameraHistory.length - 1].tag;
		}
		this._resetTimerId = undefined;
	}

	Viewport.prototype._cameraUpdate = function (event) {
		// camera updated by keyboard
		if (event.tag) {
			if (this._resetTimerId) {
				window.clearTimeout(this._resetTimerId);
			}
			this._resetTimerId = window.setTimeout(resetStateTag.bind(this), 500);

			var state = this._cameraController.saveState();
			var pos = this.getCameraHistoryPos();

			state.tag = event.tag;
			var current = pos >= 0 ? this._cameraHistory[pos] : {};
			// if same key code then overwrite last camera state (combining multiple key press events)
			if (state.tag && state.tag === current.tag) {
				this._cameraHistory[pos] = state;
			} else {
				this._pushCameraChange(state);
			}
		}
	};

	Viewport.prototype._fireCameraChange = function () {
		this._cameraChangeEvent.historyPos = this.getCameraHistoryPos();
		this._cameraChangeEvent.historyLength = this._cameraHistory.length;
		this.fireCameraChange(this._cameraChangeEvent);
	};

	Viewport.prototype._pushCameraChange = function (state) {
		var pos = this.getCameraHistoryPos();
		this._cameraHistory.splice(pos >= 0 ? pos + 1 : 0, this._cameraHistory.length);
		this._cameraHistory.push(state);
		this.setProperty("cameraHistoryPos", this._cameraHistory.length - 1, true);
		this._fireCameraChange();
	};

	// accessible internally only
	Viewport.prototype._setCameraHome = function(state) {
		this._cameraHome = state;
	};

	Viewport.prototype._applyCamera = function(state, flyTo) {
		var current = this._cameraController.saveState();
		// to avoid history flooding
		if (state.target.distanceToSquared(current.target) > EPS || state.position.distanceToSquared(current.position) > EPS) {
			this._pushCameraChange(state);
			if (flyTo) {
				this._flyTo(this._cameraController.saveState(), state, FLY_TO_LENGTH);
			} else {
				this._cameraController.reset(state);
			}
		}
	};

	// private helper
	Viewport.prototype._getCameraState = function() {
		return this._cameraController.saveState();
	};

	// private helper
	Viewport.prototype._mapPlaneIntersect = function(raycaster) {
		this._mapPlane.visible = true;
		var out = raycaster.intersectObjects([this._mapPlane], false);
		this._mapPlane.visible = false;
		return out;
	};

	return Viewport;
});
