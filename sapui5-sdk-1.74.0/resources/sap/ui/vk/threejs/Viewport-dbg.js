/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.threejs.Viewport.
sap.ui.define([
	"jquery.sap.global",
	"../Core",
	"../ViewportBase",
	"sap/ui/core/ResizeHandler",
	"sap/ui/events/KeyCodes",
	"../Loco",
	"./thirdparty/three",
	"../ContentConnector",
	"../ViewStateManager",
	"./ViewportGestureHandler",
	"./OrthographicCamera",
	"./PerspectiveCamera",
	"./NodesTransitionHelper",
	"../Messages",
	"sap/ui/base/ManagedObjectObserver",
	"./ViewportRenderer",
	"../CameraProjectionType",
	"../CameraFOVBindingType",
	"../VisibilityMode",
	"../ZoomTo",
	"../SelectionMode",
	"../RenderMode",
	"../getResourceBundle",
	"../cssColorToColor",
	"../ViewStateManager",
	"./ViewStateManager",
	"./Scene",
	"./ContentDeliveryService"
], function(
	jQuery,
	vkCore,
	ViewportBase,
	ResizeHandler,
	KeyCodes,
	Loco,
	threeJs,
	ContentConnector,
	ViewStateManager,
	ViewportGestureHandler,
	OrthographicCamera,
	PerspectiveCamera,
	NodesTransitionHelper,
	Messages,
	ManagedObjectObserver,
	ViewportRenderer,
	CameraProjectionType,
	CameraFOVBindingType,
	VisibilityMode,
	ZoomTo,
	SelectionMode,
	RenderMode,
	getResourceBundle,
	cssColorToColor,
	VkViewStateManager,
	ThreeJSViewStateManager,
	Scene,
	ContentDeliveryService
) {
		"use strict";

		/**
		 *  Constructor for a ThreeJs viewport.
		 *
		 * @class Provides a base class control for three js canvas.
		 *
		 * @public
		 * @author SAP SE
		 * @version 1.74.0
		 * @extends sap.ui.vk.ViewportBase
		 * @alias sap.ui.vk.threejs.Viewport
		 */
		var Viewport = ViewportBase.extend("sap.ui.vk.threejs.Viewport", /** @lends sap.ui.vk.threejs.Viewport.prototype  */ {
			metadata: {
				library: "sap.ui.vk",

				events: {
					cameraChanged: {
						parameters: {
							/**
							 * Returns a new camera position.
							 */
							position: "float[]",
							/**
							 * Returns a new camera rotation quaternion.
							 */
							quaternion: "float[]",
							/**
							 * Returns a new camera orthographic zoom factor.
							 */
							zoom: "float"
						},
						enableEventBubbling: true
					},
					frameRenderingFinished: {
					}
				}
			}
		});

		var basePrototype = Viewport.getMetadata().getParent().getClass().prototype;

		// Bug in three.js, original code: buffer[ offset ] = this.node[ this.propertyName ]
		THREE.PropertyBinding.prototype.GetterByBindingType[0] = function(buffer, offset) {

			buffer[ offset ] = this.targetObject[ this.propertyName ];
		};

		Viewport.prototype.init = function() {

			if (basePrototype.init) {
				basePrototype.init.call(this);
			}

			this._resizeListenerId = null;
			this._renderLoopRequestId = 0;
			this._renderLoopFunction = this._renderLoop.bind(this);
			this._shouldRenderFrame = true;
			this._clippingPlanes = [];

			this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this._renderer.setPixelRatio(window.devicePixelRatio);
			this._renderer.setSize(1, 1); // set dummy size, resize event will correct this later
			this._renderer.shadowMap.enabled = true;

			this._camera = new PerspectiveCamera();


			var backgroundColorTop = new THREE.Vector4();
			var backgroundColorBottom = new THREE.Vector4();
			this._updateColor(backgroundColorTop, this.getBackgroundColorTop());
			this._updateColor(backgroundColorBottom, this.getBackgroundColorBottom());
			this._checkBackgroundColor();

			this._backgroundMaterial = new THREE.ShaderMaterial({
				uniforms: {
					topColor: { value: backgroundColorTop },
					bottomColor: { value: backgroundColorBottom }
				},

				vertexShader: [
					"varying float vPos;",
					"void main() {",
					"	gl_Position = vec4(position, 1.0);",
					"	vPos = position.y * -0.5 + 0.5;",
					"}"
				].join("\n"),

				fragmentShader: [
					"uniform vec4 topColor;",
					"uniform vec4 bottomColor;",
					"varying float vPos;",
					"void main() {",
					"	gl_FragColor = mix(topColor, bottomColor, vPos);",
					"}"
				].join("\n"),

				side: THREE.DoubleSide,
				depthTest: false,
				depthWrite: false,
				blending: THREE.NoBlending
			});

			var backgroundGeometry = new THREE.Geometry();
			backgroundGeometry.vertices.push(
				new THREE.Vector3(-1, 1, 0),
				new THREE.Vector3(1, 1, 0),
				new THREE.Vector3(-1, -1, 0),
				new THREE.Vector3(1, -1, 0)
			);
			backgroundGeometry.faces.push(new THREE.Face3(0, 2, 1), new THREE.Face3(1, 2, 3));

			this._backgroundCamera = new THREE.Camera();
			this._backgroundScene = new THREE.Scene();
			this._backgroundScene.add(new THREE.Mesh(backgroundGeometry, this._backgroundMaterial));

			this._xrayColor1 = new THREE.Vector4(0, 0.75, 1, 0.45);
			this._xrayColor2 = new THREE.Vector4(0, 0, 1, 0);
			this._xrayMaterial = new THREE.ShaderMaterial({
				uniforms: {
					color1: { value: this._xrayColor1 },
					color2: { value: this._xrayColor2 }
				},

				vertexShader: [
					"#include <clipping_planes_pars_vertex>",
					"varying vec3 vNormal;",
					"void main() {",
					"#include <begin_vertex>",
					"#include <project_vertex>",
					"#include <clipping_planes_vertex>",
					"#include <beginnormal_vertex>",
					"#include <defaultnormal_vertex>",
					"	vNormal = normalize( transformedNormal );",
					"}"
				].join("\n"),

				fragmentShader: [
					"#include <clipping_planes_pars_fragment>",
					"uniform vec4 color1;",
					"uniform vec4 color2;",
					"varying vec3 vNormal;",
					"void main() {",
					"#include <clipping_planes_fragment>",
					"	gl_FragColor = mix(color1, color2, abs(normalize(vNormal).z));",
					"}"
				].join("\n"),

				side: THREE.DoubleSide,
				// depthTest: false,
				depthWrite: false,
				depthFunc: THREE.LessDepth,
				blending: THREE.NormalBlending,
				clipping: true,
				transparent: true
			});

			this._viewportGestureHandler = new ViewportGestureHandler(this);

			this._loco = new Loco(this);
			this._loco.addHandler(this._viewportGestureHandler, -1);

			this._zoomedObject = null;

			this._cdsLoader = null;

			this.attachCameraChanged(function(event) {
				this.setShouldRenderFrame();
			});

			// We'll use observer to detect scene changes in order to refresh screen
			this._sceneObserver = new ManagedObjectObserver(this.setShouldRenderFrame.bind(this));

			this._currentViewIndex = 0;
			this._currentView = null;

			vkCore.getEventBus().subscribe("sap.ui.vk", "viewStateApplied", this._onViewApplied, this);
		};

		Viewport.prototype.cameraUpdateCompleted = function(params) {

			this.fireViewFinished({ viewIndex: this._currentViewIndex });
		};

		Viewport.prototype.exit = function() {
			vkCore.getEventBus().unsubscribe("sap.ui.vk", "viewStateApplied", this._onViewApplied, this);


			this._loco.removeHandler(this._viewportGestureHandler);
			this._viewportGestureHandler.destroy();

			if (this._resizeListenerId) {
				ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}

			this._stopRenderLoop();

			this.setScene(null);
			this.setCamera(null);
			this._renderer = null;
			this._backgroundCamera = null;
			this._backgroundMaterial = null;
			this._backgroundScene = null;
			this._loco = null;
			this._viewportGestureHandler = null;

			if (this._cdsLoader) {
				this._cdsLoader.detachSceneUpdated(this._handleCdsSceneUpdate, this);
			}

			if (basePrototype.exit) {
				basePrototype.exit.call(this);
			}
		};

		/**
		 * Starts the render loop.
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @private
		 */
		Viewport.prototype._startRenderLoop = function() {
			if (!this._renderLoopRequestId) {
				this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction);
			}
			return this;
		};

		/**
		 * Stops the render loop.
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @private
		 */
		Viewport.prototype._stopRenderLoop = function() {
			if (this._renderLoopRequestId) {
				window.cancelAnimationFrame(this._renderLoopRequestId);
				this._renderLoopRequestId = 0;
			}
			return this;
		};



		Viewport.prototype.setBackgroundColorTop = function(value) {
			basePrototype.setBackgroundColorTop.call(this, value);

			if (this._backgroundMaterial !== null){
				this._updateColor(this._backgroundMaterial.uniforms.topColor.value, value);
				this._checkBackgroundColor();
			}

			return this;
		};

		Viewport.prototype.setBackgroundColorBottom = function(value) {
			basePrototype.setBackgroundColorBottom.call(this, value);

			if (this._backgroundMaterial !== null){
				this._updateColor(this._backgroundMaterial.uniforms.bottomColor.value, value);
				this._checkBackgroundColor();
			}
			return this;
		};

		Viewport.prototype.setClippingPlanes = function(clippingPlanes) {
			this._clippingPlanes = clippingPlanes;
			return this;
		};

		Viewport.prototype.onBeforeRendering = function() {
			if (this._resizeListenerId) {
				ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}

			this._stopRenderLoop();
		};

		Viewport.prototype.onAfterRendering = function() {
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

		Viewport.prototype._handleResize = function(event) {

			if (!this._camera || !this._renderer) {
				// nothing to do
				return false;
			}

			var width = event.size.width;
			var height = event.size.height;

			if (this._camera) {
				this._camera.update(width, height);
			}

			this._renderer.setSize(width, height);

			this.fireResize({
				size: {
					width: width,
					height: height
				}
			});

			this.setShouldRenderFrame();

			return true;

		};

		/**
		* Attaches the scene to the Viewport for rendering.
		* @param {sap.ui.vk.threejs.Scene} scene The scene to attach to the Viewport.
		* @returns {sap.ui.vk.threejs.Viewport}<code>this</code> to allow method chaining.
		* @deprecated Since version 1.50.0.
		* @public
		*/
		Viewport.prototype.setScene = function(scene) {
			this._scene = scene;
			this._homeCamera = null;    // remove previous home camera

			this._sceneObserver.disconnect();

			var nativeScene = this._getNativeScene();
			if (nativeScene) {
				// When doubleSided property in scene changes we want to refresh screen
				this._sceneObserver.observe(this._scene, { properties: [ "doubleSided" ] });

				// we create the scene and assume we have lights. Grab 1st one so we do 'CAD optimize light'
				// Basically light at your eye position
				var group;
				for (var i = 0; i < nativeScene.children.length; i++) {
					group = nativeScene.children[ i ];
					if (group.private && group.name === "DefaultLights" && group.children.length) {
						if (group.children[0] instanceof THREE.PointLight) {
							this._eyePointLight = group.children[0];
						}
					}
				}
			}

			this.setShouldRenderFrame();

			return this;
		};

		/**
		* Gets the Viewport Scene
		* @returns {sap.ui.vk.threejs.Scene} returns Scene
		* @public
		*/
		Viewport.prototype.getScene = function() {
			return this._scene;
		};

		Viewport.prototype._getNativeScene = function() {
			return this._scene ? this._scene.getSceneRef() : null;
		};

		Viewport.prototype._getNativeCamera = function() {
			return this._camera ? this._camera.getCameraRef() : null;
		};

		/**
		* Sets the camera for the Viewport
		* @param {sap.ui.vk.Camera} camera parameter
		* @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		* @public
		*/
		Viewport.prototype.setCamera = function(camera) {

			if (basePrototype.setCamera) {
				basePrototype.setCamera.call(this, camera);
			}

			var cam = this.getCamera();
			if (cam && this._renderer) {
				var size = this._renderer.getSize();
				cam.update(size.width, size.height);

				if (!this._homeCamera && cam.getCameraRef()) {
					this._homeCamera = cam.getCameraRef().clone(); // set home camera
				}
			}

			this.setShouldRenderFrame();

			return this;
		};

		Viewport.prototype.getRenderer = function() {
			return this._renderer;
		};

		Viewport.prototype._getViewStateManagerThreeJS = function() {
			if (this._viewStateManager) {
				if (this._viewStateManager instanceof ThreeJSViewStateManager) {
					return this._viewStateManager;
				}
				if (this._viewStateManager instanceof VkViewStateManager &&
					this._viewStateManager._implementation instanceof ThreeJSViewStateManager) {
					return this._viewStateManager._implementation;
				}
			}
			return null;
		};

		Viewport.prototype._getLayers = function() {
			var vsm = this._getViewStateManagerThreeJS();
			return vsm ? vsm._layers : null;
		};

		Viewport.prototype._updateBoundingBoxesIfNeeded = function() {
			var vsm = this._getViewStateManagerThreeJS();
			if (vsm) {
				vsm._updateBoundingBoxesIfNeeded();
			}
		};

		/**
		 * @param {THREE.Vector4} destColor The destination color object.
		 * @param {number} cssColor The sap.ui.core.CSSColor color to be decomposed into RGBA.
		 * @private
		 */
		Viewport.prototype._updateColor = function(destColor, cssColor) {
			var color = cssColorToColor(cssColor);
			destColor.color = new THREE.Color(color.red / 255, color.green / 255, color.blue / 255);
			destColor.alpha = color.alpha;
			destColor.x = destColor.color.r * destColor.alpha;
			destColor.y = destColor.color.g * destColor.alpha;
			destColor.z = destColor.color.b * destColor.alpha;
			destColor.w = destColor.alpha;
		};

		Viewport.prototype._checkBackgroundColor = function() {
			var colorTop = this.getBackgroundColorTop();
			if (colorTop === this.getBackgroundColorBottom()) {
				if (this._backgroundColor === null) {
					this._backgroundColor = new THREE.Vector4();
				}

				this._updateColor(this._backgroundColor, colorTop);
			} else {
				this._backgroundColor = null;
			}

			this.setShouldRenderFrame();
		};

		Viewport.prototype._handleCdsSceneUpdate = function() {
			this.setShouldRenderFrame();
		};

		/**
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @protected
		 */
		Viewport.prototype.setShouldRenderFrame = function() {
			this._shouldRenderFrame = true;
			return this;
		};

		/**
		 * @returns {bool} It returns <code>true</code> or <code>false</code> whether the frame should be rendered or not.
		*/
		Viewport.prototype.shouldRenderFrame = function() {
			return this._shouldRenderFrame;
		};

		// Override the generated method to suppress invalidation.
		Viewport.prototype.setRenderMode = function(renderMode) {
			this.setProperty("renderMode", renderMode, true);

			if (this._scene) {
				switch (renderMode) {
					case RenderMode.LineIllustration:
					case RenderMode.ShadedIllustration:
					case RenderMode.SolidOutline:
						this._scene._createOutlineGeometry(renderMode);
						break;
					default:
						this._scene._hideOutlineGeometry();
						break;
				}
			}

			this.setShouldRenderFrame();
			return this;
		};

		/**
		* Performs a screen-space hit test and gets the hit node reference, it must be called between beginGesture() and endGesture()
		*
		* @param {int} x: x coordinate in viewport to perform hit test
		* @param {int} y: y coordinate in viewport to perform hit test
		* @returns {object} object under the viewport coordinates (x, y).
		*/
		Viewport.prototype.hitTest = function(x, y) {
			var nativeScene = this._getNativeScene();
			var nativeCamera = this._getNativeCamera();
			if (!nativeCamera || !nativeScene) {
				return null;
			}

			var element = this._renderer.domElement;
			var mouse = new THREE.Vector2((x  - element.clientLeft) / element.clientWidth * 2 - 1,
				(element.clientTop - y) / element.clientHeight * 2 + 1);
			var raycaster = new THREE.Raycaster();

			var layers = this._getLayers();
			raycaster.setFromCamera(mouse, nativeCamera);

			if (this._clippingPlanes) {
				for (var pi in this._clippingPlanes) {
					var plane = this._clippingPlanes[ pi ];
					var dist = plane.distanceToPoint(raycaster.ray.origin),
						t = -dist / plane.normal.dot(raycaster.ray.direction);
					if (t > 0) {
						if (dist < 0) {
							raycaster.near = Math.max(raycaster.near, t);
						} else {
							raycaster.far = Math.min(raycaster.far, t);
						}
					} else if (dist < 0) {
						return null;
					}
				}
			}

			var intersects = raycaster.intersectObjects(nativeScene.children, true);
			if (intersects) {
				for (var i in intersects) {
					var result = intersects[ i ];
					var object = result.object;

					// search for the first closed parent node
					var parent = object.parent;
					while (parent) {
						if (parent.userData.closed) {
							object = parent;
						}
						parent = parent.parent;
					}

					// skip "skipIt" and unnamed nodes
					while (object.parent && (object.userData.skipIt || (object.layers === object.parent.layers))) {
						object = object.parent;
					}

					if (object.layers.test(layers) && !object.isBillboard && !object.isDetailView) {
						result.object = object;
						return result;
					}
				}
			}

			return null;
		};

		/**
		 * Executes a click or tap gesture.
		 *
		 * @param {int} x The tap gesture's x-coordinate.
		 * @param {int} y The tap gesture's y-coordinate.
		 * @param {boolean} isDoubleClick Indicates whether the tap gesture should be interpreted as a double-click. A value of <code>true</code> indicates a double-click gesture, and <code>false</code> indicates a single click gesture.
		 * @returns {sap.ui.vk.threejs.Viewport} this
		 */
		Viewport.prototype.tap = function(x, y, isDoubleClick) {

			if (!isDoubleClick) {
				if (this._viewStateManager) {
					var hit = this.hitTest(x, y); // NB: pass (x, y) in CSS pixels, hitTest will convert them to device pixels.

					var node = hit && hit.object;

					// if (node && node.userData.billboard) {
					// 	var link = node.userData.billboard.getLink();
					// 	if (link) {
					// 		window.open(link);
					// 		return this;
					// 	}
					// }

					var parameters = {
						picked: node ? [ node ] : []
					};
					this.fireNodesPicked(parameters);

					if (this.getSelectionMode() === SelectionMode.Exclusive) {
						this.exclusiveSelectionHandler(parameters.picked);
					} else if (this.getSelectionMode() === SelectionMode.Sticky) {
						this.stickySelectionHandler(parameters.picked);
					}

					if (node !== null) {
						this.fireNodeClicked({ nodeRef: node, x: x, y: y }, true, true);
					}
				}
			} else if (!this.getFreezeCamera()){
				var hitForDB = this.hitTest(x, y);

				if (hitForDB && (this._zoomedObject === null || this._zoomedObject !== hitForDB.object)) {// doubleclick on new object
					this._zoomedObject = hitForDB.object;
					this._viewportGestureHandler.zoomObject(this._zoomedObject, true);
				} else { // doubleclick on previously doubleclicked object, or on empty space
					this._viewportGestureHandler.zoomObject(this._zoomedObject, false);
					this._zoomedObject = null;
				}
			}
			return this;
		};

		////////////////////////////////////////////////////////////////////////
		// Keyboard handling begins.

		var offscreenPosition = { x: -2, y: -2 };
		var rotateDelta = 2;
		var panDelta = 5;

		Viewport.prototype.onkeydown = function(event) {
			if (!event.isMarked()) {
				var cameraController;
				switch (event.keyCode) {
					case KeyCodes.ARROW_LEFT:
					case KeyCodes.ARROW_RIGHT:
					case KeyCodes.ARROW_UP:
					case KeyCodes.ARROW_DOWN:
						if (event.ctrlKey || event.altKey || event.metaKey) {
							break;
						}
						var delta = { x: 0, y: 0 };
						switch (event.keyCode) {
							case KeyCodes.ARROW_LEFT:  delta.x = -1; break;
							case KeyCodes.ARROW_RIGHT: delta.x = +1; break;
							case KeyCodes.ARROW_UP:    delta.y = -1; break;
							case KeyCodes.ARROW_DOWN:  delta.y = +1; break;
							default: break;
						}
						cameraController = this._viewportGestureHandler._cameraController;
						cameraController.beginGesture(offscreenPosition.x, offscreenPosition.y);
						if (event.shiftKey) {
							cameraController.pan(panDelta * delta.x, panDelta * delta.y);
						} else {
							cameraController.rotate(rotateDelta * delta.x, rotateDelta * delta.y, true);
						}
						cameraController.endGesture();
						this.setShouldRenderFrame();
						event.preventDefault();
						event.stopPropagation();
						break;

					case 189: // KeyCodes.MINUS is not returning 189
					case KeyCodes.PLUS:
					case KeyCodes.NUMPAD_MINUS:
					case KeyCodes.NUMPAD_PLUS:
						cameraController = this._viewportGestureHandler._cameraController;
						cameraController.beginGesture(this.$().width() / 2, this.$().height() / 2);
						cameraController.zoom(event.keyCode === KeyCodes.PLUS || event.keyCode === KeyCodes.NUMPAD_PLUS ? 1.02 : 0.98);
						cameraController.endGesture();
						this.setShouldRenderFrame();
						event.preventDefault();
						event.stopPropagation();
						break;

					default: break;
				}
			}
		};

		// Keyboard handling ends.
		////////////////////////////////////////////////////////////////////////

		Viewport.prototype._handleVisibilityChanged =
		Viewport.prototype._handleOpacityChanged =
		Viewport.prototype._handleTintColorChanged =
		Viewport.prototype._handleHighlightColorChanged =
		Viewport.prototype._handleTransformationChanged =
		Viewport.prototype._handleOutlineColorChanged =
		Viewport.prototype._handleOutlineWidthChanged =
			function(event) {
				this.setShouldRenderFrame();
			};

		Viewport.prototype._handleOutliningChanged =
		Viewport.prototype._handleSelectionChanged =
			function(event) {
				var tools = this.getTools();
				for (var i = 0; i < tools.length; i++) { // loop over all oTools
					var tool = sap.ui.getCore().byId(tools[ i ]); // get control for associated control
					var gizmo = tool.getGizmoForContainer(this);
					if (gizmo && gizmo.handleSelectionChanged) {
						gizmo.handleSelectionChanged(event);
					}
				}
				this.setShouldRenderFrame();
			};

		Viewport.prototype.setSelectionRect = function(rect) {
			this.setShouldRenderFrame();

			if (!rect) {
				this._selectionRect = null;
				return;
			}

			var size = this._renderer.getSize();
			var x1 = (rect.x1 / size.width) * 2 - 1,
				y1 = (rect.y1 / size.height) * -2 + 1,
				x2 = (rect.x2 / size.width) * 2 - 1,
				y2 = (rect.y2 / size.height) * -2 + 1;

			if (!this._selectionRect) {
				var geom = new THREE.Geometry();
				geom.vertices.push(
					new THREE.Vector3(x1, y2, -1),
					new THREE.Vector3(x2, y2, -1),
					new THREE.Vector3(x2, y1, -1),
					new THREE.Vector3(x1, y1, -1)
				);
				this._selectionRect = new THREE.LineLoop(geom, new THREE.LineBasicMaterial({ color: 0xC0C000, linewidth: window.devicePixelRatio }));
			} else {
				var vertices = this._selectionRect.geometry.vertices;
				vertices[ 0 ].set(x1, y2, -1);
				vertices[ 1 ].set(x2, y2, -1);
				vertices[ 2 ].set(x2, y1, -1);
				vertices[ 3 ].set(x1, y1, -1);
				this._selectionRect.geometry.verticesNeedUpdate = true;
			}
		};

		Viewport.prototype._renderLoop = function() {
			if (!this._renderer || !this.getDomRef()) {
				// break render loop
				this._renderLoopRequestId = 0;
				return;
			}

			if (this._viewportGestureHandler) {
				this._viewportGestureHandler.animateCameraUpdate();
			}

			if (this.getCamera()) {
				// move light to eye position
				var nativeCamera = this._getNativeCamera();
				if (this._eyePointLight && nativeCamera) {
					this._eyePointLight.position.copy(nativeCamera.position);
				}
				if (this.getCamera().getIsModified()) {
					this.getCamera().setIsModified(false);
					this._shouldRenderFrame = true;
				}
			}

			if (this._shouldRenderFrame) {
				var vsm = this._getViewStateManagerThreeJS();
				if (vsm) {
					vsm._updateJointNodes();
				}

				this._shouldRenderFrame = false;
				this.render();
			}

			this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction); // request next frame
		};

		var viewportSize = new THREE.Vector2();
		function _updateDynamicObjects(renderer, camera, scene) {
			var rendererSize = renderer.getSize();
			viewportSize.set(rendererSize.width, rendererSize.height);

			// update billboars, callouts, lock to viewport nodes, etc
			scene.children.forEach(function(root) {
				if (root.userData._vkDynamicObjects) {
					root.userData._vkDynamicObjects.forEach(function(object) {
						if (object.layers.test(camera.layers)) {
							object._vkUpdate(renderer, camera, viewportSize);
						}
					});
				}
			});
		}

		function _renderDetailViews(renderer, camera, scene, boundingBox, eyePointLight) {
			scene.children.forEach(function(root) {
				if (root.userData._vkDetailViews) {
					root.userData._vkDetailViews.sort(function(a, b) {
						return a.renderOrder - b.renderOrder;
					});
					root.userData._vkDetailViews.forEach(function(detailView) {
						if (detailView.node.layers.test(camera.layers)) {
							detailView.detailView._render(renderer, camera, scene, boundingBox, eyePointLight);
						}
					});
				}
			});
		}

		Viewport.prototype.render = function() {
			var renderer = this._renderer;
			if (!renderer) {
				return;
			}

			var nativeScene = this._getNativeScene();
			var nativeCamera = this._getNativeCamera();
			if (!nativeScene || !nativeCamera) {
				return;
			}

			var layers = this._getLayers(); // visibility layers
			nativeCamera.layers.mask = layers ? layers.mask : (1 | 0);

			var tools = this.getTools();
			var vsm = this._getViewStateManagerThreeJS();
			var i, tool, gizmo, boundingBox;

			// Re-calculate clipping planes if necessary
			if (this._camera.getUsingDefaultClipPlanes() || (nativeCamera.isOrthographicCamera && this._camera.getZoomNeedRecalculate())) {
				boundingBox = this._scene._computeBoundingBox(layers, false);
				if (vsm) {// expand the bounding box with selected objects because they can be invisible
					vsm._selectedNodes.forEach(function(node) {
						node._expandBoundingBox(boundingBox, null, false);
					});
				}
				if (!boundingBox.isEmpty()) {
					if (nativeCamera.isOrthographicCamera && this._camera.getZoomNeedRecalculate()) {
						this._camera.adjustZoom(boundingBox);
					}

					if (this._camera.getUsingDefaultClipPlanes()) {
						for (i = 0; i < tools.length; i++) { // loop over all oTools
							tool = sap.ui.getCore().byId(tools[ i ]); // get control for associated control
							gizmo = tool.getGizmoForContainer(this);
							if (gizmo && gizmo.expandBoundingBox) {
								gizmo.expandBoundingBox(boundingBox);
							}
						}

						this._camera.adjustClipPlanes(boundingBox);
					}
				}
			}

			_updateDynamicObjects(renderer, nativeCamera, nativeScene);
			renderer.clippingPlanes = this._clippingPlanes;

			switch (this.getRenderMode()) {
				case RenderMode.XRay:
					if (vsm) {
						var lightNode = nativeScene.children[ nativeScene.children.length - 1 ].clone();
						vsm._selectedNodes.forEach(function(node) {
							if (node.layers.test(nativeCamera.layers)) {
								node.add(lightNode);
								renderer.render(node, nativeCamera);
								renderer.autoClear = false;
								node.remove(lightNode);
							}
						});
					}
					nativeScene.overrideMaterial = this._xrayMaterial;
					break;
				case RenderMode.LineIllustration:
				case RenderMode.ShadedIllustration:
				case RenderMode.SolidOutline:
					this._scene._outlineMaterial.linewidth = this._renderer.getPixelRatio();
					break;
				default: break;
			}

			// Apply background
			renderer.autoClear = this._backgroundColor != null;
			if (renderer.autoClear) {
				renderer.setClearColor(this._backgroundColor.color, this._backgroundColor.alpha);
			} else {
				renderer.render(this._backgroundScene, this._backgroundCamera);
			}

			if (this.getRenderMode() === RenderMode.XRay) {
				renderer.autoClear = false;
			}

			renderer.render(nativeScene, nativeCamera);

			renderer.autoClear = false;
			renderer.clippingPlanes = [];
			nativeScene.overrideMaterial = null;

			_renderDetailViews(renderer, nativeCamera, nativeScene, boundingBox, this._eyePointLight);

			if (vsm) {
				var boundingBoxesScene = vsm._boundingBoxesScene;
				if (boundingBoxesScene) {
					vsm._updateBoundingBoxes();
					renderer.render(boundingBoxesScene, nativeCamera);
				}
			}

			for (i = 0; i < tools.length; i++) { // loop over all oTools
				tool = sap.ui.getCore().byId(tools[ i ]); // get control for associated control
				gizmo = tool.getGizmoForContainer(this);
				if (gizmo && gizmo.render) {
					gizmo.render(this);
				}
			}

			if (this._selectionRect) {
				renderer.render(this._selectionRect, this._backgroundCamera);
			}

			if (vsm) {
				vsm._renderOutline(renderer, nativeScene, nativeCamera);
			}

			if (vsm) {
				if (vsm._playTransitionHighlight()) {
					this._shouldRenderFrame = true;
				}

				if (vsm._playHighlight()) {
					this._shouldRenderFrame = true;
				}
			}

			this.fireFrameRenderingFinished();
		};

		/**
		 * Returns viewport content as an image of desired size.
		 *
		 * @param {int} width Requested image width in pixels. Allowed values are 8 to 2048, default is 16
		 * @param {int} height Requested image height in pixels. Allowed values are 8 to 2048, default is 16
		 * @param {string} topColor The sap.ui.core.CSSColor to be used for top background color
		 * @param {string} bottomColor The sap.ui.core.CSSColor to be used for bottom background color
		 * @param {boolean} includeSelection Include selected nodes
		 * @returns {string} Base64 encoded PNG image
		 * @public
		 */
		Viewport.prototype.getImage = function(width, height, topColor, bottomColor, includeSelection) {
			var nativeScene = this._getNativeScene();
			if (!nativeScene) {
				return null;
			}

			width = Math.min(width || 16, 2048);
			height = Math.min(height || 16, 2048);

			this._imageCanvas = this._imageCanvas || document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");

			var renderer = new THREE.WebGLRenderer({
				canvas: this._imageCanvas,
				preserveDrawingBuffer: true,
				antialias: true,
				alpha: true
			});
			renderer.setSize(width, height);

			// Remember background colors
			var currentBKTop = this.getBackgroundColorTop();
			var currentBKBottom = this.getBackgroundColorBottom();

			if (topColor && !bottomColor) {
				// If only top color is provided use it as a solid color
				renderer.setClearColor(topColor, 1);
			} else if (!topColor && bottomColor) {
				// If only bottom color is provided use it as a solid color
				renderer.setClearColor(bottomColor, 1);
			} else {
				if (topColor && bottomColor) {
					this.setBackgroundColorTop(topColor);
					this.setBackgroundColorBottom(bottomColor);
				}

				renderer.render(this._backgroundScene, this._backgroundCamera);
				renderer.autoClear = false;
			}

			document.body.appendChild(renderer.domElement);

			var vpCamera = this.getCamera();
			var camera = vpCamera instanceof PerspectiveCamera ? new PerspectiveCamera() : new OrthographicCamera();
			camera.getCameraRef().copy(vpCamera.getCameraRef());
			camera.update(width, height);

	// remove selection for snapshot
			var selectedNodes = [];
			var vsm = this._getViewStateManagerThreeJS();
			if (!includeSelection){
				if (vsm !== null) {
					// make copy of current nodes selected
					vsm.enumerateSelection(function(node) {
						selectedNodes.push(node);
					});

					// unselect selected nodes
					vsm.setSelectionState(selectedNodes, false, false, true);
				}
			}

			// capture snapshot
			renderer.render(nativeScene, camera.getCameraRef());
			var imageData = renderer.getContext().canvas.toDataURL();

			if (vsm !== null && selectedNodes.length > 0) {
				// add selection back for nodes that were originally selected
				vsm.setSelectionState(selectedNodes, true, false, true);
			}

			document.body.removeChild(renderer.domElement);
			renderer.dispose();

			if (currentBKBottom && topColor) {
				this.setBackgroundColorBottom(currentBKBottom);
			}
			if (currentBKTop && bottomColor) {
				this.setBackgroundColorTop(currentBKTop);
			}
			return imageData;
		};

		Viewport.prototype._setContent = function(content) {
			var scene;
			var camera;

			if (content) {
				scene = content;
				if (!(scene instanceof Scene)) {
					scene = null;
				}
				camera = content.camera;
				if (!(camera instanceof OrthographicCamera || camera instanceof PerspectiveCamera)) {
					camera = new PerspectiveCamera();
				}

				if (camera instanceof OrthographicCamera) {
					// if camera is behind centre, move it to the front, so light can be placed properly
					var boundingBox = new THREE.Box3();
					var nativeScene = scene.getSceneRef();
					if (nativeScene) {
						nativeScene._expandBoundingBox(boundingBox, this._getLayers(), true);
					}
					var centre = boundingBox.getCenter();
					var dir = camera.getTargetDirection();
					var pos = camera.getPosition();
					var dir1 = [ centre.x - pos[0], centre.y - pos[1], centre.z - pos[2] ];

					var projection = dir1[0] * dir[0] + dir1[1] * dir[1] + dir1[2] * dir[2];
					if (projection < 0) {
						var scale = boundingBox.getSize().length() / 2;
						scale -= projection;

						pos[0] -= dir[0] * scale;
						pos[1] -= dir[1] * scale;
						pos[2] -= dir[2] * scale;
						camera.setPosition(pos);
					}
				}

				var i;
				// if cds loaded this content, we need to attach some event for refreshing
				// this is because cds can update content after the scene is loaded
				// as cds streaming information from the server
				if (content.loaders) {
					for (i = 0; i < content.loaders.length; i++) {
						if (content.loaders[i] instanceof ContentDeliveryService) {
							this._cdsLoader = content.loaders[i]; // grab 1st one as we can only have one cds with scene atm
							this._cdsLoader.attachSceneUpdated(this._handleCdsSceneUpdate, this);
							break;
						}
					}
				}

				if (content.builders) {
					for (i = 0; i < content.builders.length; i++) {
						content.builders[i]._fireSceneUpdated = this.setShouldRenderFrame.bind(this);
						content.builders[i]._fireLoadingFinished = function(event) {
							this.setRenderMode(this.getRenderMode());
						}.bind(this);
					}
				}
			}

			this.setScene(scene);

			if (camera) { // camera is optional so only set it if exist
				this.setCamera(camera);
			}

			if (content) {
				if (content.backgroundTopColor !== undefined) { // hex color
					this.setBackgroundColorTop(new THREE.Color(content.backgroundTopColor).getStyle());
				}

				if (content.backgroundBottomColor !== undefined) { // hex color
					this.setBackgroundColorBottom(new THREE.Color(content.backgroundBottomColor).getStyle());
				}

				if (content.renderMode !== undefined) { // sap.ui.vk.RenderMode
					this.setRenderMode(content.renderMode);
				}
			}
		};

		Viewport.prototype._onAfterUpdateContentConnector = function() {
			this._setContent(this._contentConnector.getContent());
		};

		Viewport.prototype._onBeforeClearContentConnector = function() {

			if (basePrototype._onBeforeClearContentConnector) {
				basePrototype._onBeforeClearContentConnector.call(this);
			}
			this.setScene(null);
		};

		Viewport.prototype._handleContentReplaced = function(event) {
			var content = event.getParameter("newContent");
			this._setContent(content);
		};

		Viewport.prototype._onAfterUpdateViewStateManager = function() {
		};

		Viewport.prototype._onBeforeClearViewStateManager = function() {
		};

		ContentConnector.injectMethodsIntoClass(Viewport);
		ViewStateManager.injectMethodsIntoClass(Viewport);

		/**
		* Get current view -  remembered when activateView function is called
		*
		* @returns {sap.ui.vk.View} Current view
		* @public
		*/
		Viewport.prototype.getCurrentView = function() {
			return this._currentView;
		};

		Viewport.prototype._onViewApplied = function(channel, eventId, event) {
			if (event.source != this._getViewStateManagerThreeJS()) {
				return;
			}

			this._ignoreAnimationPosition = event.ignoreAnimationPosition;

			this.activateView(event.view,  event.playViewGroup, event.notAnimateCameraChange);
		};

		Viewport.prototype._activateSingleView = function(view, playViewGroup, notAnimateCameraChange) {

			var viewGroups = this._scene.getViewGroups();
			var that = this;
			if (viewGroups){

				viewGroups.forEach(function(viewGroup){
					viewGroup.getViews().forEach(function(modelView){
						if (modelView === view){
							that._currentViewIndex = viewGroup.getViews().indexOf(modelView);
						}
					});
				});
			}

			this.fireViewActivated({ viewIndex: this._currentViewIndex, view: view });
			vkCore.getEventBus().publish("sap.ui.vk", "viewActivated", {
				source: this,
				view: view,
				viewIndex: this._currentViewIndex
			});

			this._currentView = view;

			if (view.topColor !== undefined) { // hex color
				this.setBackgroundColorTop(new THREE.Color(view.topColor).getStyle());
			}

			if (view.bottomColor !== undefined) { // hex color
				this.setBackgroundColorBottom(new THREE.Color(view.bottomColor).getStyle());
			}

			if (view.renderMode !== undefined) { // sap.ui.vk.RenderMode
				this.setRenderMode(view.renderMode);
			}

			var camera = view.getCamera();

			var nativeScene = this._getNativeScene();

			if (camera) {
				var nativeCamera = camera.getCameraRef();
				if (nativeCamera.type === "OrthographicCamera" && nativeScene) {
					// if camera is behind centre, move it to the front, so light can be placed properly
					var pos = camera.getPosition();
					var scene = this.getScene();
					if (scene) {
						var boundingBox = new THREE.Box3();
						if (nativeScene) {
							nativeScene._expandBoundingBox(boundingBox, this._getLayers(), true);
						}
						var centre = boundingBox.getCenter();
						var dir = camera.getTargetDirection();
						var dir1 = [ centre.x - pos[0], centre.y - pos[1], centre.z - pos[2] ];

						var projection = dir1[0] * dir[0] + dir1[1] * dir[1] + dir1[2] * dir[2];
						if (projection < 0) {
							var scale = boundingBox.getSize().length() / 2;
							scale -= projection;

							pos[0] -= dir[0] * scale;
							pos[1] -= dir[1] * scale;
							pos[2] -= dir[2] * scale;
						}
					}
					camera.setPosition(pos);
				}
			}

			var vsm = this._getViewStateManagerThreeJS();

			var timeInterval = 2000;
			if (view.flyToTime != null) {
				timeInterval = view.flyToTime;
			}

			var timeIntervalCameraChange = 0;
			if (camera) {
				var pauseWhenNoCameraChange = playViewGroup && !view.hasAnimation();

				timeIntervalCameraChange = this._viewportGestureHandler.activateCamera(camera.getCameraRef(), timeInterval, pauseWhenNoCameraChange, notAnimateCameraChange);
			}

			var timeIntervalForTransition = 0;
			if (!notAnimateCameraChange) {
				if (timeIntervalCameraChange > 0) {
					timeIntervalForTransition = vsm._startTransitionHighlight(timeIntervalCameraChange, view);
				} else {
					timeIntervalForTransition = vsm._startTransitionHighlight(timeInterval, view);
				}
			}

			var realTimeInterval = timeIntervalForTransition > timeIntervalCameraChange ? timeIntervalForTransition : timeIntervalCameraChange;

			setTimeout(function() {
				if (vsm) {
					vsm.fireReadyForAnimation({
						view: view,
						ignoreAnimationPosition: this._ignoreAnimationPosition
					});

					vkCore.getEventBus().publish("sap.ui.vk", "readyForAnimation", {
						source: vsm,
						view: view,
						ignoreAnimationPosition: this._ignoreAnimationPosition
					});
					vsm._startHighlight();
				}
			}.bind(this), realTimeInterval);
		};

		/**
		* Reset current view to its inital status
		*
		* @returns {sap.ui.vk.threejs.Viewport} returns this
		* @private
		* @since 1.67.0
		*/
		Viewport.prototype.resetCurrentView = function() {

			if (!this._currentView) {
				return this;
			}

			this._getViewStateManagerThreeJS()._resetNodesMaterialAndOpacityByCurrenView(this._currentView);
			this._getViewStateManagerThreeJS()._resetNodesStatusByCurrenView(this._currentView, true, true);

			this.setShouldRenderFrame();

			return this;
		};

		/**
		* Activates the view based on view object passed
		* @param {sap.ui.vk.View} view View object definition
		* @param {boolean} playViewGroup true if view activation is part of playing view group
		* @param {boolean} notAnimateCameraChange true if not animating the change of camera
		* @returns {sap.ui.vk.threejs.Viewport} returns this
		* @public
		* @since 1.52.0
		*/
		Viewport.prototype.activateView = function(view, playViewGroup, notAnimateCameraChange) {
			this._activateSingleView(view, playViewGroup, notAnimateCameraChange);
			return this;
		};

		/**
		 * Zooms the scene to a bounding box created from a particular set of nodes.
		 * @param {sap.ui.vk.ZoomTo|sap.ui.vk.ZoomTo[]} what What set of nodes to zoom to.
		 * @param {any} nodeRef Is used if what == (sap.ui.vk.ZoomTo.Node || ZoomTo.NodeSetIsolation)
		 * @param {float} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
		 * @param {float} margin Margin. Set to 0 to zoom to the entire screen.
		 * @returns {sap.ui.vk.Viewport} this
		 * @public
		 */
		Viewport.prototype.zoomTo = function(what, nodeRef, crossFadeSeconds, margin) {
			var nativeScene = this._getNativeScene();
			var nativeCamera = this._getNativeCamera();
			if (!nativeCamera || !nativeScene) {
				return this;
			}

			margin = margin || 0;
			var boundingBox = new THREE.Box3();
			var quaternion = null;
			var node = null;
			(Array.isArray(what) ? what : [ what ]).forEach(function(what) {
				switch (what) {
					case ZoomTo.All:
						nativeScene._expandBoundingBox(boundingBox, null, true);
						break;
					case ZoomTo.Visible:
						nativeScene._expandBoundingBox(boundingBox, this._getLayers(), true);
						break;
					case ZoomTo.Selected:
						var vsm = this._getViewStateManagerThreeJS();
						if (vsm) {
							vsm.enumerateSelection(function(nodeRef) {
								nodeRef._expandBoundingBox(boundingBox, null, true);
							});
						}
						break;
					case ZoomTo.Node:
						if (!nodeRef) {
							return this;
						}
						node = nodeRef;
						if (Array.isArray(nodeRef)) {
							nodeRef.forEach(function(nodeRef) {
								nodeRef._expandBoundingBox(boundingBox, null, true);
							});
						} else {
							nodeRef._expandBoundingBox(boundingBox, null, true);
						}
						break;
					case ZoomTo.Restore:
						jQuery.sap.log.error(getResourceBundle().getText("VIEWPORT_MSG_RESTORENOTIMPLEMENTED"));
						return this;
					case ZoomTo.NodeSetIsolation:
						jQuery.sap.log.error(getResourceBundle().getText("VIEWPORT_MSG_NODESETISOLATIONNOTIMPLEMENTED"));
						return this;
					case ZoomTo.RestoreRemoveIsolation:
						jQuery.sap.log.error(getResourceBundle().getText("VIEWPORT_MSG_RESTOREREMOVEISOLATIONNOTIMPLEMENTED"));
						return this;
					case ZoomTo.ViewLeft:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
						break;
					case ZoomTo.ViewRight:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
						break;
					case ZoomTo.ViewTop:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
						break;
					case ZoomTo.ViewBottom:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
						break;
					case ZoomTo.ViewBack:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
						break;
					case ZoomTo.ViewFront:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
						break;
					default:
						break;
				}
			}.bind(this));

			if (!boundingBox.isEmpty()) {
				this._viewportGestureHandler.zoomTo(boundingBox, quaternion, margin, crossFadeSeconds * 1000, node, node !== null);
			}
			return this;
		};

		Viewport.prototype.pan = function(dx, dy) {
			this._viewportGestureHandler._cameraController.pan(dx, dy);
		};

		Viewport.prototype.rotate = function(dx, dy){
			this._viewportGestureHandler._cameraController.rotate(dx, dy);
		};

		Viewport.prototype.zoom = function(dy) {
			this._viewportGestureHandler._cameraController.zoom(dy);
		};

		/**
		 * Retrieves information about the current camera view in the scene, and saves the information in a JSON-like object.
		 * The information can then be used at a later time to restore the scene to the same camera view using the
		 * {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} method.<br/>
		 * @param {object}         [query]                       Query object which indicates what information to be retrieved.
		 * @param {boolean|object} [query.camera=true]           Indicator to retrieve camera information.
		 * @param {boolean}        [query.camera.matrices=false] Indicator to retrieve camera view and projection matrices.
		 * @param {boolean}        [query.camera.useTransitionCamera=false] Indicator to retrieve the transition camera properties instead of regular one's.
		 * @param {boolean|object} [query.visibility=false]      Indicator to retrieve visibility information.
		 * @param {sap.ui.vk.VisibilityMode} [query.visibility.mode=sap.ui.vk.VisibilityMode.Complete]
		 *                                                       Indicator to retrieve the complete visibility definition or just the difference.
		 * @returns {object} JSON-like object which holds the current view information. See {@link sap.ui.vk.Viewport#setViewInfo setViewInfo}.
		 *                   In addition to properties defined in {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} the output from
		 *                   {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} contains camera view and projection matrices
		 * <pre>
		 *   {
		 *     ...
		 *     camera: {
		 *       ...
		 *       matrices: {
		 *         view:       [number, ...],
		 *         projection: [number, ...],
		 *       }
		 *       ...
		 *     },
		 *     ...
		 *   }
		 * </pre>
		 * @public
		 */
		Viewport.prototype.getViewInfo = function(query) {
			var viewInfo = {};

			if (query == null) {
				query = {};
			}

			if (query.camera == null) {
				query.camera = true;
			}

			var nativeCamera = this._getNativeCamera();

			if (query.camera && nativeCamera) {
				var rotation = nativeCamera.rotation.clone();
				rotation.reorder("YXZ");

				viewInfo.camera = {
					rotation: {
						yaw:   THREE.Math.radToDeg(rotation.y),
						pitch: THREE.Math.radToDeg(rotation.x),
						roll:  THREE.Math.radToDeg(rotation.z)
					},
					position: {
						x: nativeCamera.position.x,
						y: nativeCamera.position.y,
						z: nativeCamera.position.z
					},
					projectionType: nativeCamera.isOrthographicCamera ? CameraProjectionType.Orthographic : CameraProjectionType.Perspective,
					bindingType: CameraFOVBindingType.Vertical
				};

				var view = nativeCamera.view;
				if (view && view.enabled) { // Perspective camera RedLine mode is activated
					viewInfo.camera.view = {
						fullWidth: view.fullWidth,
						fullHeight: view.fullHeight,
						offsetX: view.offsetX,
						offsetY: view.offsetY,
						width: view.width,
						height: view.height
					};
				}

				if (viewInfo.camera.projectionType === CameraProjectionType.Perspective) {
					viewInfo.camera.fieldOfView = nativeCamera.fov; // perspective camera defines Field of View
				} else if (viewInfo.camera.projectionType === CameraProjectionType.Orthographic) {
					viewInfo.camera.zoomFactor = nativeCamera.zoom; // orthographic defines Zoom Factor
				}

				if (query.camera.matrices) {
					viewInfo.camera.matrices = {
						view: nativeCamera.matrixWorldInverse.elements.slice(),
						projection: nativeCamera.projectionMatrix.elements.slice()
					};
				}
			}

			if (query.visibility && this._viewStateManager) {
				var visibilityMode = query.visibility.mode == null ? VisibilityMode.Complete : query.visibility.mode;
				viewInfo.visibility = {
					mode: visibilityMode
				};
				if (visibilityMode === VisibilityMode.Complete) {
					var allVisibility = this._viewStateManager.getVisibilityComplete();
					viewInfo.visibility.visible = allVisibility.visible;
					viewInfo.visibility.hidden = allVisibility.hidden;
				} else if (this._viewStateManager.getShouldTrackVisibilityChanges()) {
					viewInfo.visibility.changes = this._viewStateManager.getVisibilityChanges();
				} else {
					jQuery.sap.log.warning(getResourceBundle().getText(Messages.VIT32.summary), Messages.VIT32.code, "sap.ui.vk.threejs.Viewport");
				}
			}

			return viewInfo;
		};

		/**
		 * Sets the current scene to use the camera view information acquired from the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
		 * Internally, the <code>setViewInfo</code> method activates certain steps at certain animation times,
		 * and then changes the camera position, rotation and field of view (FOV) / zoom factor.
		 * @param {object}   viewInfo                             A JSON-like object containing view information acquired using
		 *                                                        the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
		 * @param {object}   [viewInfo.camera]                    A JSON-like object containing the camera information.
		 * @param {object}   viewInfo.camera.rotation             Rotation defined in {@link https://en.wikipedia.org/wiki/Aircraft_principal_axes Aircraft principal axes}.
		 * @param {float}    viewInfo.camera.rotation.yaw         Angle around the vertical axis in degrees.
		 * @param {float}    viewInfo.camera.rotation.pitch       Angle around the lateral axis in degrees.
		 * @param {float}    viewInfo.camera.rotation.roll        Angle around the longitudinal axis in degrees.
		 * @param {object}   viewInfo.camera.position             Position defined in 3-dimensional space.
		 * @param {float}    viewInfo.camera.position.x           X coordinate.
		 * @param {float}    viewInfo.camera.position.y           Y coordinate.
		 * @param {float}    viewInfo.camera.position.z           Z coordinate.
		 * @param {sap.ui.vk.CameraFOVBindingType} viewInfo.camera.bindingType Camera field of view binding type.
		 * @param {sap.ui.vk.CameraProjectionType} viewInfo.camera.projectionType Camera projection type.
		 * @param {float}    viewInfo.camera.fieldOfView          Camera field of view in degrees. Applicable only to perspective cameras.
		 * @param {float}    viewInfo.camera.zoomFactor           Camera zoom factor. Applicable only to orthographic cameras.
		 * @param {object}   [viewInfo.animation]                 A JSON-like object containing the animation information.
		 * @param {string}   [viewInfo.animation.stepVeId]        Step VE ID. If it is omitted then procedure and step indices are used.
		 * @param {int}      [viewInfo.animation.procedureIndex]  Procedure index in the list of procedures.
		 * @param {int}      [viewInfo.animation.stepIndex]       Step index in the list of steps in the procedure.
		 * @param {float}    [viewInfo.animation.animationTime=0] Time at which to activate the step.
		 * @param {object}   [viewInfo.visibility]                A JSON-like object containing the visibility information.
		 * @param {sap.ui.vk.VisibilityMode} viewInfo.visibility.mode If the mode equals to {@link sap.ui.vk.VisibilityMode.Complete complete}
		 *                                                        then the visible and hidden fields are defined. If the mode
		 *                                                        equals {@link sap.ui.vk.VisibilityMode.Differences differences} then
		 *                                                        the changes field is defined.
		 * @param {string[]} viewInfo.visibility.visible          List of Ids of visible nodes.
		 * @param {string[]} viewInfo.visibility.hidden           List of Ids of hidden nodes.
		 * @param {string[]} viewInfo.visibility.changes          List of Ids of nodes with inverted visibility.
		 * @param {float}    [flyToDuration=0]                    Fly-to animation duration in seconds.
		 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
		 * @public
		 */
		Viewport.prototype.setViewInfo = function(viewInfo, flyToDuration) {
			var nativeCamera = this._getNativeCamera();

			if (viewInfo.camera && nativeCamera) {
				var viCamera = viewInfo.camera;
				var newCamera = viCamera.projectionType === CameraProjectionType.Orthographic ? new THREE.OrthographicCamera() : new THREE.PerspectiveCamera();
				newCamera.userData = nativeCamera.userData;
				newCamera.aspect = nativeCamera.aspect;
				newCamera.position.copy(viCamera.position);
				var rotation = viCamera.rotation;
				newCamera.quaternion.setFromEuler(new THREE.Euler(THREE.Math.degToRad(rotation.pitch), THREE.Math.degToRad(rotation.yaw), THREE.Math.degToRad(rotation.roll), "YXZ"));
				newCamera.fov = viCamera.fieldOfView || newCamera.fov;
				newCamera.zoom = viCamera.zoomFactor || newCamera.zoom;

				if (nativeCamera.view && nativeCamera.view.enabled) { // Perspective camera RedLine mode is activated
					var view = viCamera.view || nativeCamera.view;
					newCamera.setViewOffset(view.fullWidth, view.fullHeight, view.offsetX, view.offsetY, view.width, view.height);
					newCamera.aspect = view.fullWidth / view.fullHeight;
					newCamera.zoom = Math.min(newCamera.aspect, 1);
				}

				this._viewportGestureHandler.activateCamera(newCamera, (flyToDuration || 0) * 1000);
			}

			// restoring the visibility state
			if (viewInfo.visibility) {
				var nodeHierarchy = this._viewStateManager.getNodeHierarchy(),
					veIdToNodeRefMap = new Map(),
					allNodeRefs = nodeHierarchy.findNodesByName();

				allNodeRefs.forEach(function(nodeRef) {
					// create node proxy based on dynamic node reference
					var nodeProxy = nodeHierarchy.createNodeProxy(nodeRef);
					var veId = nodeProxy.getVeId();
					// destroy the node proxy
					nodeHierarchy.destroyNodeProxy(nodeProxy);
					if (veId) {
						// push the ve id to either visible/hidden array
						veIdToNodeRefMap.set(veId, nodeRef);
					}
				});

				switch (viewInfo.visibility.mode) {
					case VisibilityMode.Complete:
						var visibleVeIds = viewInfo.visibility.visible,
							hiddenVeIds = viewInfo.visibility.hidden;

						visibleVeIds.forEach(function(veId) {
							this._viewStateManager.setVisibilityState(veIdToNodeRefMap.get(veId), true, false);
						}, this);

						hiddenVeIds.forEach(function(veId) {
							this._viewStateManager.setVisibilityState(veIdToNodeRefMap.get(veId), false, false);
						}, this);
						break;

					case VisibilityMode.Differences:
						this._viewStateManager.resetVisibility();
						viewInfo.visibility.changes.forEach(function(veId) {
							var nodeRef = veIdToNodeRefMap.get(veId);
							// reverting the visibility for this particular node
							if (nodeRef) {
								this._viewStateManager.setVisibilityState(nodeRef, !this._viewStateManager.getVisibilityState(nodeRef), false);
							}
						}, this);
						break;

					default:
						jQuery.sap.log.error(getResourceBundle().getText(Messages.VIT28.summary), Messages.VIT28.code, "sap.ui.vk.threejs.Viewport");
						break;
				}
			}

			this.setShouldRenderFrame();

			return this;
		};

		/**
		 * Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
		 *
		 * @param {function} command The command to be executed.
		 * @returns {sap.ui.vk.threejs.Viewport} returns this
		 * @public
		 */
		Viewport.prototype.queueCommand = function(command) {
			if (this instanceof Viewport) {
				command();
			}
			return this;
		};

		/**
		 * Gets position and size of the viewport square.
		 * The information can be used for making calculations when restoring Redlining elements.
		 * @returns {object} The information in this object:
		 *   <ul>
		 *     <li><b>left</b> - The x coordinate of the top-left corner of the square.</li>
		 *     <li><b>top</b> - The y coordinate of the top-left corner of the square.</li>
		 *     <li><b>sideLength</b> - The length of the square.</li>
		 *   </ul>
		 * @public
		 */
		Viewport.prototype.getOutputSize = function() {
			var boundingClientRect = this.getDomRef().getBoundingClientRect();
			var viewportWidth = boundingClientRect.width;
			var viewportHeight = boundingClientRect.height;
			var relevantDimension;

			relevantDimension = Math.min(viewportWidth, viewportHeight);

			return {
				 left: (viewportWidth - relevantDimension) / 2,
				 top: (viewportHeight - relevantDimension) / 2,
				 sideLength: relevantDimension
			};
		};

		return Viewport;
});
