/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.ScaleToolGizmo
sap.ui.define([
	"jquery.sap.global",
	"../threejs/thirdparty/three",
	"./Gizmo",
	"./ScaleToolGizmoRenderer",
	"./CoordinateSystem",
	"./AxisColours"
], function(
	jQuery,
	threejs,
	Gizmo,
	ScaleToolGizmoRenderer,
	CoordinateSystem,
	AxisColours
) {
	"use strict";

	/**
	 * Constructor for a new ScaleToolGizmo.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Provides handles to scale objects
	 * @extends sap.ui.vk.tools.Gizmo
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.ui.vk.tools.ScaleToolGizmo
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ScaleToolGizmo = Gizmo.extend("sap.ui.vk.tools.ScaleToolGizmo", /** @lends sap.ui.vk.tools.ScaleToolGizmo.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	ScaleToolGizmo.prototype.init = function() {
		if (Gizmo.prototype.init) {
			Gizmo.prototype.init.apply(this);
		}

		this._createEditingForm(null, 64);
		this._gizmoIndex = -1;
		this._handleIndex = -1;

		this._viewport = null;
		this._tool = null;
		this._nonUniformScaleEnabled = false;
		this._sceneGizmo = new THREE.Scene();
		var light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
		light.position.set(1, 3, 2);
		this._sceneGizmo.add(light);
		this._sceneGizmo.add(new THREE.AmbientLight(0xFFFFFF, 0.5));
		this._gizmo = new THREE.Group();
		this._touchAreas = new THREE.Group();
		this._sceneGizmo.add(this._gizmo);
		// this._sceneGizmo.add(this._touchAreas);
		this._gizmoScale = new THREE.Vector3().setScalar(1);
		this._coordinateSystem = CoordinateSystem.World;
		this._nodes = [];
		this._matViewProj = new THREE.Matrix4();
		this._gizmoSize = 96;

		var arrowLength = 96,
			boxSize = 16 / arrowLength,
			touchBoxSize = 48 / arrowLength;

		function createGizmoBox(dir, color, touchAreas) {
			var m = new THREE.Matrix4().makeBasis(new THREE.Vector3(dir.y, dir.z, dir.x), dir, new THREE.Vector3(dir.z, dir.x, dir.y));
			var boxGeometry = new THREE.BoxBufferGeometry(boxSize, boxSize, boxSize);
			boxGeometry.applyMatrix(m);
			var material = new THREE.MeshLambertMaterial({ color: color, transparent: true });
			var box = new THREE.Mesh(boxGeometry, material);
			box.userData.color = color;

			if (dir) {
				box.position.copy(dir);
				var lineRadius = 1 / arrowLength;
				var lineGeometry = new THREE.CylinderBufferGeometry(lineRadius, lineRadius, 1, 4);
				m.setPosition(dir.clone().multiplyScalar(-0.5));
				lineGeometry.applyMatrix(m);
				var line = new THREE.Mesh(lineGeometry, material);
				line.renderOrder = 1;
				box.add(line);
				m.setPosition(dir); // set touch box position
			}

			var touchGeometry = new THREE.BoxBufferGeometry(touchBoxSize, touchBoxSize, touchBoxSize);
			touchGeometry.applyMatrix(m);
			touchAreas.add(new THREE.Mesh(touchGeometry, material));

			return box;
		}

		function createGizmoTriangle(a, b, touchAreas) {
			var lineGeometry = new THREE.BufferGeometry();
			var vertices = new Float32Array(6);
			vertices[ a ] = vertices[ b + 3 ] = 0.7;
			lineGeometry.addAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
			var colors = new Float32Array(6);
			colors[ a ] = colors[ b + 3 ] = 1;
			lineGeometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
			var line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, transparent: true, linewidth: window.devicePixelRatio }));
			line.userData.colors = colors;

			var triangleGeometry = new THREE.Geometry();
			var v1 = new THREE.Vector3().setComponent(a, 0.7);
			var v2 = new THREE.Vector3().setComponent(b, 0.7);
			triangleGeometry.vertices.push(new THREE.Vector3(), v1, v2);
			triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
			var triangle = new THREE.Mesh(triangleGeometry, new THREE.MeshBasicMaterial({ color: 0xFFFF00, opacity: 0.5, transparent: true, side: THREE.DoubleSide, visible: false }));
			triangle.renderOrder = 1;
			line.add(triangle);

			touchAreas.add(triangle.clone());

			return line;
		}

		// create 3 boxes
		this._gizmo.add(createGizmoBox(new THREE.Vector3(1, 0, 0), AxisColours.x, this._touchAreas));
		this._gizmo.add(createGizmoBox(new THREE.Vector3(0, 1, 0), AxisColours.y, this._touchAreas));
		this._gizmo.add(createGizmoBox(new THREE.Vector3(0, 0, 1), AxisColours.z, this._touchAreas));

		// create 3 triangles
		this._gizmo.add(createGizmoTriangle(1, 2, this._touchAreas));
		this._gizmo.add(createGizmoTriangle(2, 0, this._touchAreas));
		this._gizmo.add(createGizmoTriangle(0, 1, this._touchAreas));

		// create box in the center
		boxSize -= 0.1 / arrowLength; // z-fighting fix
		var boxMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0, transparent: true });
		this._gizmo.add(new THREE.Mesh(new THREE.BoxBufferGeometry(boxSize, boxSize, boxSize), boxMaterial));
		this._touchAreas.add(new THREE.Mesh(new THREE.BoxBufferGeometry(touchBoxSize, touchBoxSize, touchBoxSize), new THREE.MeshBasicMaterial()));

		this._axisTitles = this._createAxisTitles();
		this._sceneGizmo.add(this._axisTitles);

		this._updateGizmoPartVisibility();
	};

	ScaleToolGizmo.prototype.hasDomElement = function() {
		return true;
	};

	ScaleToolGizmo.prototype._updateGizmoPartVisibility = function() {
		var screenSystem = this._coordinateSystem === CoordinateSystem.Screen;
		var gizmoObjects = this._gizmo.children,
			touchObjects = this._touchAreas.children;
		gizmoObjects[ 2 ].visible = touchObjects[ 2 ].visible = !screenSystem;
		gizmoObjects[ 3 ].visible = gizmoObjects[ 4 ].visible = touchObjects[ 3 ].visible = touchObjects[ 4 ].visible = !screenSystem && this._nonUniformScaleEnabled;
		gizmoObjects[ 5 ].visible = touchObjects[ 5 ].visible = this._nonUniformScaleEnabled;
		this._axisTitles.children[ 2 ].visible = !screenSystem;
	};

	ScaleToolGizmo.prototype.setCoordinateSystem = function(coordinateSystem) {
		this._coordinateSystem = coordinateSystem;
		this._gizmoIndex = this._handleIndex = -1;
		this._updateGizmoPartVisibility();
	};

	ScaleToolGizmo.prototype.setNonUniformScaleEnabled = function(value) {
		this._nonUniformScaleEnabled = !!value;
		this._updateGizmoPartVisibility();
	};

	ScaleToolGizmo.prototype.show = function(viewport, tool) {
		this._viewport = viewport;
		this._tool = tool;
		this._nodes.length = 0;
		this._updateSelection(viewport._viewStateManager);
	};

	ScaleToolGizmo.prototype.hide = function() {
		this._viewport = null;
		this._tool = null;
		this._gizmoIndex = this._handleIndex = -1;
		this._updateEditingForm(false);
	};

	ScaleToolGizmo.prototype.getGizmoCount = function() {
		if (this._coordinateSystem === CoordinateSystem.Local) {
			return this._nodes.length;
		} else {
			return this._nodes.length > 0 ? 1 : 0;
		}
	};

	ScaleToolGizmo.prototype.getTouchObject = function(i) {
		if (this._nodes.length === 0) {
			return null;
		}

		this._updateGizmoObjectTransformation(this._touchAreas, i);

		return this._touchAreas;
	};

	var arrowHighlighting = [ 1, 2, 4, 6, 5, 3 ];

	ScaleToolGizmo.prototype.highlightHandle = function(index, hoverMode) {
		var highlightAll = (index === 6) || (index >= 0 && !this._nonUniformScaleEnabled);
		var i, obj;
		for (i = 0; i < 3; i++) {// arrows
			obj = this._gizmo.children[ i ];
			var highlight = highlightAll || (arrowHighlighting[index] & (1 << i));
			var color = highlight ? 0xFFFF00 : obj.userData.color;
			obj.material.color.setHex(color); // arrow line color
			obj.children[ 0 ].material.color.setHex(color); // arrow cone color
			obj.children[ 0 ].material.opacity = obj.material.opacity = highlight || hoverMode ? 1 : 0.35;

			var axisTitle = this._axisTitles.children[i];
			axisTitle.material.color.setHex(color);
			axisTitle.material.opacity = highlight || hoverMode ? 1 : 0.35;
		}

		for (i = 3; i < 6; i++) {// triangles
			obj = this._gizmo.children[ i ];
			var colorAttr = obj.geometry.attributes.color;
			colorAttr.copyArray(highlightAll || i === index ? [ 1, 1, 0, 1, 1, 0 ] : obj.userData.colors);
			colorAttr.needsUpdate = true;
			obj.material.opacity = hoverMode || i === index ? 1 : 0.35;
			obj.children[ 0 ].material.visible = i === index;
		}

		obj = this._gizmo.children[ 6 ];
		obj.material.color.setHex(highlightAll ? 0xFFFF00 : 0xC0C0C0);
		obj.material.opacity = highlightAll || hoverMode ? 1 : 0.35;
	};

	ScaleToolGizmo.prototype.selectHandle = function(index, gizmoIndex) {
		this._gizmoIndex = gizmoIndex;
		this._handleIndex = index;
		this._viewport.setShouldRenderFrame();
	};

	ScaleToolGizmo.prototype.beginGesture = function() {
		this._matOrigin = this._gizmo.matrixWorld.clone();
		this._nodes.forEach(function(nodeInfo) {
			nodeInfo.scaleOrigin = nodeInfo.node.scale.clone();
			nodeInfo.matOrigin = nodeInfo.node.matrixWorld.clone();
			nodeInfo.matParentInv = new THREE.Matrix4().getInverse(nodeInfo.node.parent.matrixWorld);
		});
	};

	ScaleToolGizmo.prototype.endGesture = function() {
		this._tool.fireScaled({ x: this._gizmoScale.x, y: this._gizmoScale.y, z: this._gizmoScale.z });
		this._gizmoScale.setScalar(1);
	};

	ScaleToolGizmo.prototype._scale = function(scale) {
		this._gizmoScale.copy(scale);

		if (this._coordinateSystem === CoordinateSystem.Local) {
			this._nodes.forEach(function(nodeInfo) {
				nodeInfo.node.scale.copy(nodeInfo.scaleOrigin).multiply(scale);
				nodeInfo.node.matrixWorldNeedsUpdate = true;
			});

			// this._viewport._updateBoundingBoxesIfNeeded();
		} else {
			var matScale = this._matOrigin.clone().scale(scale).multiply(new THREE.Matrix4().getInverse(this._matOrigin));

			this._nodes.forEach(function(nodeInfo) {
				if (!nodeInfo.ignore) {
					var node = nodeInfo.node;
					node.matrixWorld.multiplyMatrices(matScale, nodeInfo.matOrigin);
					node.matrix.multiplyMatrices(nodeInfo.matParentInv, node.matrixWorld);
					node.matrix.decompose(node.position, new THREE.Quaternion(), node.scale);
					node.matrixWorldNeedsUpdate = true;
				}
			});
		}

		this._recalculateJoints(this._viewport._getViewStateManagerThreeJS());

		this._viewport.setShouldRenderFrame();
	};

	ScaleToolGizmo.prototype.scale = function(x, y, z) {
		this.beginGesture();
		this._scale(new THREE.Vector3(x, y, z));
	};

	ScaleToolGizmo.prototype._setScale = function(scale) {
		if (this._tool.fireEvent("scaling", { x: scale.x, y: scale.y, z: scale.z }, true)) {
			this._scale(scale);
		}
	};

	ScaleToolGizmo.prototype.getValue = function() {
		var value = 1;
		if (this._gizmoIndex >= 0 && this._handleIndex >= 0 && this._handleIndex < 3) {
			switch (this._coordinateSystem) {
				case CoordinateSystem.World:
					if (this._nodes.length === 1) {
						value = new THREE.Vector3().setFromMatrixColumn(this._nodes[0].node.matrixWorld, this._handleIndex).length();
					}
					break;

				case CoordinateSystem.Local:
					value = this._nodes[this._gizmoIndex].node.scale.getComponent(this._handleIndex);
					break;

				default: break;
			}
		}
		return value;
	};

	ScaleToolGizmo.prototype.setValue = function(value) {
		if (this._gizmoIndex >= 0 && this._handleIndex >= 0 && this._handleIndex < 3) {
			this.beginGesture();
			var scale = new THREE.Vector3(1, 1, 1);
			if (this._nonUniformScaleEnabled) {
				scale.setComponent(this._handleIndex, value / this._lastEditValue);
			} else {
				scale.setScalar(value / this._lastEditValue);
			}
			this._scale(scale);
			this.endGesture();
		}
	};

	ScaleToolGizmo.prototype.expandBoundingBox = function(boundingBox) {
		if (this._viewport) {
			this._expandBoundingBox(boundingBox, this._viewport.getCamera().getCameraRef(), this._viewport._getLayers());
		}
	};

	ScaleToolGizmo.prototype.handleSelectionChanged = function(event) {
		if (this._viewport) {
			if (this._tool.getEnableSnapping()) {
				this._tool.getDetector().setSource(this._viewport._viewStateManager);
			}
			this._updateSelection(this._viewport._viewStateManager);
			this._gizmoIndex = this._handleIndex = -1;
		}
	};

	ScaleToolGizmo.prototype._getObjectScale = function(objectIndex) {
		if (this._nodes.length === 1) {
			return this._nodes[0].node.scale;
		} else if (this._coordinateSystem === CoordinateSystem.Local) {
			return this._nodes[objectIndex].node.scale;
		}
		return new THREE.Vector3(1, 1, 1);
	};

	ScaleToolGizmo.prototype._getObjectSize = function(objectIndex) {
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

	ScaleToolGizmo.prototype._updateGizmoTransformation = function(gi, camera) {
		var scale = this._updateGizmoObjectTransformation(this._gizmo, gi);
		this._updateAxisTitles(this._axisTitles, this._gizmo, camera, this._gizmoSize + 30, scale);
	};

	ScaleToolGizmo.prototype._getEditingFormPosition = function() {
		var scale = this._updateGizmoObjectTransformation(this._gizmo, this._gizmoIndex);
		var direction = new THREE.Vector3().setFromMatrixColumn(this._gizmo.matrixWorld, this._handleIndex).normalize();
		return direction.clone().multiplyScalar((this._gizmoSize + 18) * scale).add(this._gizmo.position).applyMatrix4(this._matViewProj);
	};

	ScaleToolGizmo.prototype.render = function() {
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

	return ScaleToolGizmo;
});
