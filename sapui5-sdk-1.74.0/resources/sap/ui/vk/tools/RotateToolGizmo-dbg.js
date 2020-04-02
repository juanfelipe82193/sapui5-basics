/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.RotateToolGizmo
sap.ui.define([
	"jquery.sap.global",
	"../threejs/thirdparty/three",
	"./Gizmo",
	"./RotateToolGizmoRenderer",
	"./RotatableAxis",
	"./CoordinateSystem",
	"./AxisColours"
], function(
	jQuery,
	threejs,
	Gizmo,
	RotateToolGizmoRenderer,
	RotatableAxis,
	CoordinateSystem,
	AxisColours
) {
	"use strict";

	/**
	 * Constructor for a new RotateToolGizmo.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Provides handles for object rotation tool
	 * @extends sap.ui.vk.tools.Gizmo
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.ui.vk.tools.RotateToolGizmo
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RotateToolGizmo = Gizmo.extend("sap.ui.vk.tools.RotateToolGizmo", /** @lends sap.ui.vk.tools.RotateToolGizmo.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	RotateToolGizmo.prototype.init = function() {
		if (Gizmo.prototype.init) {
			Gizmo.prototype.init.apply(this);
		}

		this._createEditingForm(String.fromCharCode(176), 84); // degrees sign
		this._gizmoIndex = -1;
		this._handleIndex = -1;
		this._value = 0; // in radians

		this._viewport = null;
		this._tool = null;
		this._sceneGizmo = new THREE.Scene();
		this._gizmo = new THREE.Group();
		this._touchAreas = new THREE.Group();
		this._sceneGizmo.add(this._gizmo);
		this._axis = RotatableAxis.All;
		this._coordinateSystem = CoordinateSystem.World;
		this._nodes = [];
		this._matViewProj = new THREE.Matrix4();
		this._gizmoSize = 96;
		this._gizmoRotation = new THREE.Vector3(); // in degrees

		function createGizmoCircle(axis, color, radius, segments) {
			var geometry = new THREE.TorusBufferGeometry(radius, 1 / 96, 4, segments);
			if (axis === 0) {
				geometry.rotateY(Math.PI / 2);
			} else if (axis === 1) {
				geometry.rotateX(Math.PI / 2);
			}
			var circle = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: color, transparent: true }));
			circle.matrixAutoUpdate = false;
			circle.userData.color = color;

			return circle;
		}

		function createTouchCircle(axis, radius, segments) {
			var geometry = new THREE.TorusBufferGeometry(radius, 16 / 96, 4, segments);
			if (axis === 0) {
				geometry.rotateY(Math.PI / 2);
			} else if (axis === 1) {
				geometry.rotateX(Math.PI / 2);
			}
			return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ opacity: 0.2, transparent: true }));
		}

		// create 3 circles
		for (var i = 0; i < 3; i++) {
			this._gizmo.add(createGizmoCircle(i, AxisColours[ [ "x", "y", "z" ][ i ] ], 1, 128));
			this._touchAreas.add(createTouchCircle(i, 1, 24));
		}

		this._gizmo.add(new THREE.AxesHelper(0.75));

		var arcMaterial = new THREE.MeshBasicMaterial({ color: 0x0080FF, opacity: 0.5, transparent: true, side: THREE.DoubleSide });
		this._arcMesh = new THREE.Mesh(new THREE.Geometry(), arcMaterial);
		this._arcMesh.drawMode = THREE.TriangleFanDrawMode;
		this._arcMesh.visible = false;
		this._gizmo.add(this._arcMesh);

		this._axisTitles = this._createAxisTitles();
		this._sceneGizmo.add(this._axisTitles);
	};

	RotateToolGizmo.prototype.hasDomElement = function() {
		return true;
	};

	// set rotatable axis
	// NOT apply to screen coordinate system
	RotateToolGizmo.prototype.setAxis = function(value) {
		this._axis = value;
		var RotatableAxises = [ RotatableAxis.All, RotatableAxis.X, RotatableAxis.Y, RotatableAxis.Z ];
		if (this._coordinateSystem !== CoordinateSystem.Screen) {
			for (var i = 0; i < 3; i++) {
				if (value !== RotatableAxis.All && RotatableAxises[ i + 1 ] !== value) {
					this._gizmo.children[ i ].visible = this._touchAreas.children[ i ].visible = false;
				} else {
					this._gizmo.children[ i ].visible = this._touchAreas.children[ i ].visible = true;
				}
			}
		}
	};

	RotateToolGizmo.prototype.setCoordinateSystem = function(coordinateSystem) {
		this._coordinateSystem = coordinateSystem;
		var screenSystem = coordinateSystem === CoordinateSystem.Screen;
		if (screenSystem) {
			this._gizmo.children[ 0 ].visible = this._gizmo.children[ 1 ].visible = false;
			this._touchAreas.children[ 0 ].visible = this._touchAreas.children[ 1 ].visible = false;
			this._gizmo.children[ 2 ].visible = this._touchAreas.children[ 2 ].visible = true;
		} else {
			this._gizmo.children[ 0 ].visible = this._touchAreas.children[ 0 ].visible = this._axis === RotatableAxis.All || this._axis === RotatableAxis.X;
			this._gizmo.children[ 1 ].visible = this._touchAreas.children[ 1 ].visible = this._axis === RotatableAxis.All || this._axis === RotatableAxis.Y;
			this._gizmo.children[ 2 ].visible = this._touchAreas.children[ 2 ].visible = this._axis === RotatableAxis.All || this._axis === RotatableAxis.Z;
		}
		this._axisTitles.visible = !screenSystem;
		this._gizmoIndex = this._handleIndex = -1;
	};

	RotateToolGizmo.prototype.show = function(viewport, tool) {
		this._viewport = viewport;
		this._tool = tool;
		this._nodes.length = 0;
		this._updateSelection(viewport._viewStateManager);
	};

	RotateToolGizmo.prototype.hide = function() {
		this._viewport = null;
		this._tool = null;
		this._gizmoIndex = this._handleIndex = -1;
		this._updateEditingForm(false);
	};

	RotateToolGizmo.prototype.getGizmoCount = function() {
		if (this._coordinateSystem === CoordinateSystem.Local) {
			return this._nodes.length;
		} else {
			return this._nodes.length > 0 ? 1 : 0;
		}
	};

	RotateToolGizmo.prototype.getTouchObject = function(i) {
		if (this._nodes.length === 0) {
			return null;
		}

		this._updateGizmoObjectTransformation(this._touchAreas, i);

		return this._touchAreas;
	};

	RotateToolGizmo.prototype.getGizmoObject = function() {
		return this._nodes.length > 0 ? this._gizmo : null;
	};

	RotateToolGizmo.prototype.highlightHandle = function(index, hoverMode) {
		for (var i = 0; i < 3; i++) {// circles
			var arrow = this._gizmo.children[ i ];
			var color = i === index ? 0xFFFF00 : arrow.userData.color;
			arrow.material.color.setHex(color); // circle color
			// arrow.material.opacity = (i === index || hoverMode) ? 1 : 0.35;
			arrow.material.opacity = index === -1 || i === index ? 1 : 0.35;
			// arrow.material.transparent = !hoverMode;
			arrow.material.visible = hoverMode || i === index;

			var axisTitle = this._axisTitles.children[i];
			axisTitle.material.color.setHex(color);
			axisTitle.material.opacity = index === -1 || i === index ? 1 : 0.35;
			axisTitle.material.visible = hoverMode || i === index;
		}
	};

	RotateToolGizmo.prototype.selectHandle = function(index, gizmoIndex) {
		this._gizmoIndex = gizmoIndex;
		this._handleIndex = index;
		this._value = 0;
		this._viewport.setShouldRenderFrame();
	};

	RotateToolGizmo.prototype.beginGesture = function() {
		this._matOrigin = this._gizmo.matrixWorld.clone();
		this._nodes.forEach(function(nodeInfo) {
			nodeInfo.node.parent.updateMatrixWorld(true);
			nodeInfo.matOrigin = nodeInfo.node.matrixWorld.clone();
			nodeInfo.matLocalOrigin = nodeInfo.node.matrix.clone();
			nodeInfo.matParentInv = new THREE.Matrix4().getInverse(nodeInfo.node.parent.matrixWorld);
			nodeInfo.quaternion = nodeInfo.node.quaternion.clone();
		});
	};

	RotateToolGizmo.prototype.endGesture = function() {
		this._arcMesh.visible = false;
		this._tool.fireRotated({ x: this._gizmoRotation.x, y: this._gizmoRotation.y, z: this._gizmoRotation.z });
	};

	RotateToolGizmo.prototype._rotate = function(euler) {
		this._gizmoRotation.set(THREE.Math.radToDeg(euler.x), THREE.Math.radToDeg(euler.y), THREE.Math.radToDeg(euler.z));

		var quat = new THREE.Quaternion();
		if (this._coordinateSystem === CoordinateSystem.Local) {
			quat.setFromEuler(euler);
			this._nodes.forEach(function(nodeInfo) {
				nodeInfo.node.quaternion.copy(nodeInfo.quaternion).multiply(quat);
				nodeInfo.node.matrixWorldNeedsUpdate = true;
			});

			// this._viewport._updateBoundingBoxesIfNeeded();
		} else {
			euler = euler.toArray();
			for (var i = 0; i < 3; i++) {
				var angle = euler[ i ];
				if (angle) {
					var axisIndex = euler[ 3 ].charCodeAt(i) - 88; // 88 = char code of 'X'
					if (axisIndex >= 0 && axisIndex < 3) {
						var axis = new THREE.Vector3().setFromMatrixColumn(this._matOrigin, axisIndex).normalize();
						var matRotate = new THREE.Matrix4().makeRotationAxis(axis, angle);
						var pos = new THREE.Vector3().setFromMatrixPosition(this._matOrigin);
						matRotate.setPosition(pos.sub(pos.clone().applyMatrix4(matRotate)));

						for (var ni = 0, nc = this._nodes.length; ni < nc; ni++) {
							var nodeInfo = this._nodes[ni];
							if (!nodeInfo.ignore) {
								var node = nodeInfo.node;
								node.position.setFromMatrixPosition(nodeInfo.matOrigin).applyMatrix4(matRotate).applyMatrix4(nodeInfo.matParentInv);

								var scale = new THREE.Vector3().setFromMatrixScale(nodeInfo.matOrigin);
								var localAxis = axis.clone().transformDirection(new THREE.Matrix4().getInverse(nodeInfo.matOrigin)).multiply(scale).normalize();
								quat.setFromAxisAngle(localAxis, angle);
								node.quaternion.copy(nodeInfo.quaternion).multiply(quat);
								node.matrixWorldNeedsUpdate = true;
							}
						}
					}
				}
			}
		}

		this._recalculateJoints(this._viewport._getViewStateManagerThreeJS());

		this._viewport.setShouldRenderFrame();
	};

	RotateToolGizmo.prototype._setRotationAxisAngle = function(axisIndex, angle1, angle2) {
		var deltaAngle = this._value = (angle2 - angle1) % (Math.PI * 2);

		var euler = new THREE.Euler();
		euler[ [ "x", "y", "z" ][ axisIndex ] ] = deltaAngle;

		if (this._tool.fireEvent("rotating", { x: THREE.Math.radToDeg(euler.x), y: THREE.Math.radToDeg(euler.y), z: THREE.Math.radToDeg(euler.z) }, true)) {
			this._rotate(euler);

			// update arc mesh
			var vertices = [ 0, 0, 0 ];
			var dir = new THREE.Vector3();
			var i1 = (axisIndex + 1) % 3,
				i2 = (axisIndex + 2) % 3;
			var n = Math.max(Math.ceil(Math.abs(deltaAngle) * 64 / Math.PI), 1);
			deltaAngle *= this._coordinateSystem === CoordinateSystem.Local ? -1 : 1;
			for (var i = 0; i <= n; i++) {
				var a = angle1 + deltaAngle * (i / n);
				dir.set(0, 0, 0).setComponent(i1, Math.cos(a)).setComponent(i2, Math.sin(a));
				vertices.push(dir.x, dir.y, dir.z);
			}

			this._arcMesh.geometry = new THREE.BufferGeometry().addAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
			this._arcMesh.visible = true;
		}
	};

	RotateToolGizmo.prototype.rotate = function(x, y, z) {
		this.beginGesture();
		this._rotate(new THREE.Euler(THREE.Math.degToRad(x || 0), THREE.Math.degToRad(y || 0), THREE.Math.degToRad(z || 0)));
		this._value += THREE.Math.degToRad([ x, y, z ][ this._handleIndex ] || 0);
	};

	RotateToolGizmo.prototype._getValueLocaleOptions = function() {
		return { useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 2 };
	};

	RotateToolGizmo.prototype.getValue = function() {
		return THREE.Math.radToDeg(this._value);
	};

	RotateToolGizmo.prototype.setValue = function(value) {
		if (this._gizmoIndex >= 0 && this._handleIndex >= 0 && this._handleIndex < 3) {
			value = THREE.Math.degToRad(value);
			this.beginGesture();
			var euler = new THREE.Euler();
			euler[ [ "x", "y", "z" ][ this._handleIndex ] ] = value - this._value;
			this._rotate(euler);
			this.endGesture();
			this._value = value;
		}
	};

	RotateToolGizmo.prototype.expandBoundingBox = function(boundingBox) {
		if (this._viewport) {
			this._expandBoundingBox(boundingBox, this._viewport.getCamera().getCameraRef(), this._viewport._getLayers());
		}
	};

	RotateToolGizmo.prototype.handleSelectionChanged = function(event) {
		if (this._viewport) {
			if (this._tool.getEnableSnapping()) {
				this._tool.getDetector().setSource(this._viewport._viewStateManager);
			}
			this._updateSelection(this._viewport._viewStateManager);
			this._gizmoIndex = this._handleIndex = -1;
		}
	};

	RotateToolGizmo.prototype._getLevelingQuaternion = function(quat, objectIndex) {
		quat.set(0, 0, 0, 1);
		switch (this._coordinateSystem) {
			case CoordinateSystem.Local:
				quat.setFromRotationMatrix(this._nodes[objectIndex].node.parent.matrixWorld);
				break;

			case CoordinateSystem.Screen:
				quat.copy(this._viewport.getCamera().getCameraRef().quaternion);
				break;

			case CoordinateSystem.Custom:
				var anchorPoint = this._getAnchorPoint();
				if (anchorPoint) {
					quat.copy(anchorPoint.quaternion);
				}
				break;

			default: break;
		}

		return false;
	};

	RotateToolGizmo.prototype._getObjectSize = function(objectIndex) {
		var boundingBox = new THREE.Box3();
		if (this._nodes.length === 1) {
			this._nodes[0].node._expandBoundingBox(boundingBox, this._viewport._getLayers(), false);
		} else if (this._coordinateSystem === CoordinateSystem.Local) {
			this._nodes[0].node._expandBoundingBox(boundingBox, this._viewport._getLayers(), false);
		}
		if (boundingBox.isEmpty()) {
			return 0;
		}
		var size = new THREE.Vector3();
		boundingBox.getSize(size);
		return size.length();
	};

	RotateToolGizmo.prototype._updateGizmoTransformation = function(i, camera) {
		var scale = this._updateGizmoObjectTransformation(this._gizmo, i);
		this._updateAxisTitles(this._axisTitles, this._gizmo, camera, this._gizmoSize - 12, scale);
	};

	RotateToolGizmo.prototype._getEditingFormPosition = function() {
		var scale = this._updateGizmoObjectTransformation(this._gizmo, this._gizmoIndex);
		var direction = new THREE.Vector3().setFromMatrixColumn(this._gizmo.matrixWorld, this._handleIndex).normalize();
		return direction.clone().multiplyScalar((this._gizmoSize - 12) * scale).add(this._gizmo.position).applyMatrix4(this._matViewProj);
	};

	RotateToolGizmo.prototype.render = function() {
		jQuery.sap.assert(this._viewport && this._viewport.getMetadata().getName() === "sap.ui.vk.threejs.Viewport", "Can't render gizmo without sap.ui.vk.threejs.Viewport");

		if (this._nodes.length > 0) {
			var renderer = this._viewport.getRenderer(),
				camera = this._viewport.getCamera().getCameraRef();

			this._matViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

			renderer.clearDepth();

			for (var i = 0, l = this.getGizmoCount(); i < l; i++) {
				this._updateGizmoTransformation(i, camera);
				renderer.render(this._sceneGizmo, camera);
			}
		}

		this._updateEditingForm(this._nodes.length > 0 && this._gizmoIndex >= 0 && this._handleIndex >= 0 && this._handleIndex < 3, this._handleIndex);
	};

	return RotateToolGizmo;

});
