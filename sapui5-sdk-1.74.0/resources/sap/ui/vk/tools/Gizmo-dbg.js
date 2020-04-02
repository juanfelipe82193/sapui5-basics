/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides base for all gizmo controls sap.ui.vk.tools namespace.
sap.ui.define([
	"../library",
	"sap/m/library",
	"sap/m/Input",
	"sap/m/Label",
	"sap/ui/core/library",
	"sap/ui/core/Control",
	"./CoordinateSystem",
	"./AxisColours",
	"./ToolNodeSet"
], function(
	vkLibrary,
	mLibrary,
	Input,
	Label,
	coreLibrary,
	Control,
	CoordinateSystem,
	AxisColours,
	ToolNodeSet
) {
	"use strict";

	// shortcut for sap.m.InputType
	var InputType = mLibrary.InputType;

	/**
	 * Constructor for base of all Gizmo Controls.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Provides buttons to hide or show certain sap.ui.vk controls.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.vk.tools.Gizmo
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Gizmo = Control.extend("sap.ui.vk.tools.Gizmo", /** @lends sap.ui.vk.tools.Gizmo.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	Gizmo.prototype.hasDomElement = function() {
		return true;
	};

	Gizmo.prototype._createAxisTitles = function(size, fontSize, drawCircle) {
		size = size || 32;
		fontSize = fontSize || 20;
		function createTextMesh(text, color) {
			var canvas = document.createElement("canvas");
			canvas.width = canvas.height = size * window.devicePixelRatio;
			var ctx = canvas.getContext("2d");

			var halfSize = canvas.width * 0.5;
			ctx.font = "Bold " + fontSize * window.devicePixelRatio + "px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			// draw shadow
			ctx.fillStyle = "#000";
			ctx.globalAlpha = 0.5;
			ctx.filter = "blur(3px)";
			ctx.fillText(text, halfSize + 1, halfSize + 1);
			// draw text
			ctx.fillStyle = "#fff";
			ctx.globalAlpha = 1;
			ctx.filter = "blur(0px)";
			ctx.fillText(text, halfSize, halfSize);

			if (drawCircle) {// draw circle border
				ctx.beginPath();
				ctx.arc(halfSize, halfSize, halfSize - window.devicePixelRatio, 0, 2 * Math.PI, false);
				ctx.closePath();
				ctx.lineWidth = window.devicePixelRatio * 2;
				ctx.strokeStyle = "#fff";
				ctx.stroke();
			}

			var texture = new THREE.Texture(canvas);
			texture.needsUpdate = true;

			var material = new THREE.MeshBasicMaterial({
				map: texture,
				color: color,
				transparent: true,
				alphaTest: 0.05,
				premultipliedAlpha: true,
				side: THREE.DoubleSide
			});

			var mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
			mesh.userData.color = color;
			return mesh;
		}

		var group = new THREE.Group();
		group.add(createTextMesh("X", AxisColours.x));
		group.add(createTextMesh("Y", AxisColours.y));
		group.add(createTextMesh("Z", AxisColours.z));
		return group;
	};

	Gizmo.prototype._extractBasis = function(matrix) {
		var basis = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
		matrix.extractBasis(basis[ 0 ], basis[ 1 ], basis[ 2 ]);
		basis[ 0 ].normalize(); basis[ 1 ].normalize(); basis[ 2 ].normalize();
		return basis;
	};

	Gizmo.prototype._updateAxisTitles = function(obj, gizmo, camera, distance, scale) {
		var basis = this._extractBasis(gizmo.matrixWorld);

		obj.children.forEach(function(child, i) {
			child.position.copy(basis[ i ]).multiplyScalar(distance.constructor === THREE.Vector3 ? distance.getComponent(i) : distance);
			child.quaternion.copy(camera.quaternion);
		});

		obj.position.copy(gizmo.position);
		obj.scale.setScalar(scale);
	};

	if (this._viewport && this._viewport._viewStateManager) {
		this._updateSelection(this._viewport._viewStateManager);
		this._viewport.setShouldRenderFrame();
	}

	Gizmo.prototype._updateSelection = function(viewStateManager) {
		var nodes = [];
		if (this._tool) {
			if (this._tool.getNodeSet() === ToolNodeSet.Highlight) {
				viewStateManager.enumerateSelection(function(nodeRef) {
					nodes.push({ node: nodeRef });
				});
			} else {
				viewStateManager.enumerateOutlinedNodes(function(nodeRef) {
					nodes.push({ node: nodeRef });
				});
			}
		}
		if (this._nodes.length === nodes.length && this._nodes.every(function(v, i) { return nodes[ i ].node === v.node; })) {
			return false;
		}

		this._nodes = nodes;

		nodes.forEach(function(nodeInfo) {
			nodeInfo.ignore = false; // multiple transformation fix (parent transformation + child transformation)
			var parent = nodeInfo.node.parent;
			while (parent && !nodeInfo.ignore) {
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (nodes[ i ].node === parent) {
						nodeInfo.ignore = true;
						break;
					}
				}
				parent = parent.parent;
			}
		});

		return true;
	};

	Gizmo.prototype._recalculateJoints = function(viewStateManager) {
		var updatedNodes = [];
		this._nodes.forEach(function(nodeInfo) {
			updatedNodes.push(nodeInfo.node);
		});
		viewStateManager._recalculateJointsForNodes(updatedNodes);
	};

	Gizmo.prototype._getAnchorPoint = function() {
		return this._viewport ? this._viewport._anchorPoint : null;
	};

	Gizmo.prototype._getSelectionCenter = function(target) {
		if (this._nodes.length === 1) {
			target.setFromMatrixPosition(this._nodes[ 0 ].node.matrixWorld);
		} else {
			target.setScalar(0);
			if (this._nodes.length > 0) {
				var center = new THREE.Vector3();
				this._nodes.forEach(function(nodeInfo) {
					var node = nodeInfo.node;
					if (node.userData.boundingBox) {
						node.userData.boundingBox.getCenter(center);
						target.add(center.applyMatrix4(node.matrixWorld));
					} else {
						target.add(center.setFromMatrixPosition(node.matrixWorld));
					}
				});
				target.multiplyScalar(1 / this._nodes.length);
			}
		}
	};

	Gizmo.prototype._getGizmoScale = function(position) {
		var renderer = this._viewport.getRenderer();
		var camera = this._viewport.getCamera().getCameraRef();
		var pos4 = new THREE.Vector4();
		pos4.copy(position).applyMatrix4(this._matViewProj);
		return pos4.w * 2 / (renderer.getSize().width * camera.projectionMatrix.elements[ 0 ]);
	};

	Gizmo.prototype._updateGizmoObjectTransformation = function(obj, i) {
		var camera = this._viewport.getCamera().getCameraRef();
		var anchorPoint = this._getAnchorPoint();
		var node;
		if (anchorPoint && this._coordinateSystem === CoordinateSystem.Custom) {
			obj.position.copy(anchorPoint.position);
			obj.quaternion.copy(anchorPoint.quaternion);
		} else if (this._coordinateSystem === CoordinateSystem.Local) {
			node = this._nodes[ i ].node;
			node.matrixWorld.decompose(obj.position, obj.quaternion, obj.scale);
		} else if (this._nodes.length > 0) {
			this._getSelectionCenter(obj.position);

			if (this._coordinateSystem === CoordinateSystem.Screen) {
				obj.quaternion.copy(camera.quaternion);
			} else {// CoordinateSystem.World
				obj.quaternion.set(0, 0, 0, 1);
			}
		}

		var scale = this._getGizmoScale(obj.position);
		obj.scale.setScalar(this._gizmoSize * scale);

		if (node) {
			var basis = this._extractBasis(node.matrixWorld);
			obj.matrix.makeBasis(basis[ 0 ], basis[ 1 ], basis[ 2 ]);
			obj.matrix.scale(obj.scale);
			obj.matrix.copyPosition(node.matrixWorld);
			obj.matrixAutoUpdate = false;
		} else {
			obj.matrixAutoUpdate = true;
		}

		obj.updateMatrixWorld(true);
		return scale;
	};

	Gizmo.prototype._expandBoundingBox = function(boundingBox, camera, layers) {
		var gizmoCount = this.getGizmoCount();
		if (gizmoCount > 0) {
			this._matViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); // used in _updateGizmoTransformation()
			for (var i = 0; i < gizmoCount; i++) {
				this._updateGizmoTransformation(i, camera);
				this._sceneGizmo._expandBoundingBox(boundingBox, layers, false);
			}
		}
	};

	Gizmo.prototype._createEditingForm = function(units, width) {
		this._label = new sap.m.Label({}).addStyleClass("sapUiVkTransformationToolEditLabel");
		this._units = new sap.m.Label({ text: units }).addStyleClass("sapUiVkTransformationToolEditUnits");

		this._input = new Input({
			width: width + "px",
			type: InputType.Number,
			maxLength: 10,
			textAlign: coreLibrary.TextAlign.Right,
			change: function(event) {
				this.setValue(event.getParameter("value"));
			}.bind(this)
		});

		this._editingForm = new sap.m.HBox({
			items: [
				this._label,
				this._input,
				this._units
			]
		}).addStyleClass("sapUiSizeCompact");

		this._editingForm.onkeydown =  this._editingForm.ontap = this._editingForm.ontouchstart = function(event) {
			event.setMarked(); // disable the viewport events under the editing form
		};
	};

	Gizmo.prototype._getValueLocaleOptions = function() {
		return { useGrouping: false };
	};

	Gizmo.prototype._updateEditingForm = function(active, axisIndex) {
		var domRef = this.getDomRef();
		if (domRef) {
			if (active && this._tool && this._tool.getShowEditingUI()) {
				this._label.setText([ "X", "Y", "Z" ][ axisIndex ]);
				this._label.rerender();
				var labelDomRef = this._label.getDomRef();
				if (labelDomRef) {
					labelDomRef.style.color = new THREE.Color(AxisColours[[ "x", "y", "z" ][ axisIndex ]]).getStyle();
				}

				this._lastEditValue = this.getValue();
				this._input.setValue(this._lastEditValue.toLocaleString("fullwide", this._getValueLocaleOptions()));

				var position = this._getEditingFormPosition();
				var gizmoPosition = this._gizmo.position.clone().applyMatrix4(this._matViewProj).sub(position);
				var viewportRect = this._viewport.getDomRef().getBoundingClientRect();
				var formRect = domRef.getBoundingClientRect();

				var dx = Math.sign(gizmoPosition.x) * formRect.width;
				var dy = formRect.height * 0.5;
				var x = THREE.Math.clamp(viewportRect.width * (position.x * 0.5 + 0.5) + Math.sign(gizmoPosition.x) * -20, Math.max(dx, 0), viewportRect.width + Math.min(dx, 0));
				var y = THREE.Math.clamp(viewportRect.height * (position.y * -0.5 + 0.5), dy, viewportRect.height - dy);

				domRef.style.left = Math.round(x) + "px";
				domRef.style.top = Math.round(y) + "px";
				domRef.style.transform = "translate(" + (gizmoPosition.x < 0 ? "0%" : "-100%") + ", -50%)";

				domRef.style.display = "block";
			} else {
				domRef.style.display = "none";
			}
		}
	};

	return Gizmo;
});
