/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/

// Provides the ViewStateManager class.
sap.ui.define([
	"../Core",
	"../ContentConnector",
	"../ViewStateManagerBase",
	"./thirdparty/three",
	"../cssColorToColor",
	"../colorToCSSColor",
	"../abgrToColor",
	"../colorToABGR",
	"./Scene",
	"../ObjectType",
	"../RotationType",
	"./NodesTransitionHelper",
	"./OutlineRenderer",
	"./HighlightPlayer",
	"../HighlightDisplayState",
	"../Highlight"
], function(
	vkCore,
	ContentConnector,
	ViewStateManagerBase,
	three,
	cssColorToColor,
	colorToCSSColor,
	abgrToColor,
	colorToABGR,
	Scene,
	ObjectType,
	RotationType,
	NodesTransitionHelper,
	OutlineRenderer,
	HighlightPlayer,
	HighlightDisplayState,
	Highlight
) {
	"use strict";

	var VisibilityTracker;

	/**
	* Constructor for a new ViewStateManager.
	*
	* @class
	* Manages the visibility and selection states of nodes in the scene.
	*
	* @param {string} [sId] ID for the new ViewStateManager object. Generated automatically if no ID is given.
	* @param {object} [mSettings] Initial settings for the new ViewStateManager object.
	* @public
	* @author SAP SE
	* @version 1.74.0
	* @extends sap.ui.vk.ViewStateManagerBase
	* @alias sap.ui.vk.threejs.ViewStateManager
	* @since 1.32.0
	*/
	var ViewStateManager = ViewStateManagerBase.extend("sap.ui.vk.threejs.ViewStateManager", /** @lends sap.ui.vk.threejs.ViewStateManager.prototype */ {
		metadata: {
		}
	});

	var basePrototype = ViewStateManager.getMetadata().getParent().getClass().prototype;

	ViewStateManager.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}

		this._channel = 0;
		this._layers = new THREE.Layers();
		this._layers.set(this._channel);
		this._nodeHierarchy = null;
		this._nodeStates = new Map();
		this._selectedNodes = new Set(); // a collection of selected nodes for quick access,
		// usually there are not many selected objects,
		// so it is OK to store them in a collection.
		this._outlineRenderer = new OutlineRenderer(1.0);
		this._outlinedNodes = new Set();
		this.setOutlineColor("rgba(255, 0, 255, 1.0)");
		this.setOutlineWidth(1.0);

		this._visibilityTracker = new VisibilityTracker();

		this._showSelectionBoundingBox = true;
		this._boundingBoxesScene = new THREE.Scene();
		this._selectionColor = new THREE.Color(0xC0C000);

		this.setHighlightColor("rgba(255, 0, 0, 1.0)");

		this._joints = [];
		this._customPositionedNodes = new Set();

		this._nodesTransitionHelper = new NodesTransitionHelper();
		this._nodesTransitionHelper.setViewStateManager(this);

		this._highlightPlayer = new HighlightPlayer();
		this._transitionHighlightPlayer = new HighlightPlayer();

		vkCore.getEventBus().subscribe("sap.ui.vk", "activateView", this._onViewActivated, this);
	};

	ViewStateManager.prototype.exit = function() {
		vkCore.getEventBus().unsubscribe("sap.ui.vk", "activateView", this._onViewActivated, this);
	};

	////////////////////////////////////////////////////////////////////////
	// Content connector handling begins.
	ViewStateManager.prototype._setContent = function(content) {
		var scene = null;
		if (content && content instanceof Scene) {
			scene = content;
		}
		this._setScene(scene);

		if (scene) {
			var initialView = scene.getInitialView();
			if (initialView) {
				this._currentView = initialView;
				this._resetNodesMaterialAndOpacityByCurrenView(this._currentView);
			}
		}
	};

	ViewStateManager.prototype._onAfterUpdateContentConnector = function() {
		this._setContent(this._contentConnector.getContent());
	};

	ViewStateManager.prototype._onBeforeClearContentConnector = function() {
		this._setScene(null);
	};

	// Content connector handling ends.
	////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////
	// Node hierarchy handling begins.

	ViewStateManager.prototype._handleContentReplaced = function(event) {
		var content = event.getParameter("newContent");
		this._setContent(content);
	};

	ViewStateManager.prototype._setScene = function(scene) {
		this._boundingBoxesScene = new THREE.Scene();
		this._setNodeHierarchy(scene ? scene.getDefaultNodeHierarchy() : null);
		if (scene) {
			scene.setViewStateManager(this);
		}
		this._scene = scene;
		return this;
	};

	ViewStateManager.prototype._setNodeHierarchy = function(nodeHierarchy) {
		var oldNodeHierarchy = this._nodeHierarchy;

		if (this._nodeHierarchy) {
			this._nodeHierarchy = null;
			this._nodeStates.clear();
			this._selectedNodes.clear();
			this._outlinedNodes.clear();
			this._visibilityTracker.clear();
		}

		if (nodeHierarchy) {
			this._nodeHierarchy = nodeHierarchy;

			this._nodeHierarchy.attachNodeReplaced(this._handleNodeReplaced, this);
			this._nodeHierarchy.attachNodeUpdated(this._handleNodeUpdated, this);

			this._initialState = { visible: [], hidden: [] };
			var that = this;

			var allNodeRefs = nodeHierarchy.findNodesByName();
			allNodeRefs.forEach(function(nodeRef) {
				(nodeRef.layers.test(that._layers) ? that._initialState.visible : that._initialState.hidden).push(nodeRef);
			});

			this.fireVisibilityChanged({
				visible: this._initialState.visible,
				hidden: this._initialState.hidden
			});
		}

		if (nodeHierarchy !== oldNodeHierarchy) {
			this.fireNodeHierarchyReplaced({
				oldNodeHierarchy: oldNodeHierarchy,
				newNodeHierarchy: nodeHierarchy
			});
		}

		return this;
	};

	ViewStateManager.prototype._handleNodeReplaced = function(event) {
		var replacedNodeRef = event.getParameter("ReplacedNodeRef");
		var replacementNodeRef = event.getParameter("ReplacementNodeRef");

		if (this.getSelectionState(replacedNodeRef)){
			this.setSelectionState(replacementNodeRef, true);
			this.setSelectionState(replacedNodeRef, false);
		}
	};

	ViewStateManager.prototype._handleNodeUpdated = function(event) {
		var nodeRef = event.getParameter("nodeRef");

		if (this.getSelectionState(nodeRef)){
			this.setSelectionState(nodeRef, false);
			this.setSelectionState(nodeRef, true);
		}
	};

	ViewStateManager.prototype._renderOutline = function(renderer, scene, camera) {
		var c = abgrToColor(this._outlineColorABGR);
		var color = new THREE.Color(c.red / 255.0, c.green / 255.0, c.blue / 255.0);
		this._outlineRenderer.render(renderer, scene, camera, Array.from(this._outlinedNodes), color, this._jointCollection);
	};

	// Node hierarchy handling ends.
	////////////////////////////////////////////////////////////////////////

	/**
	* Gets the NodeHierarchy object associated with this ViewStateManager object.
	* @returns {sap.ui.vk.NodeHierarchy} The node hierarchy associated with this ViewStateManager object.
	* @public
	*/
	ViewStateManager.prototype.getNodeHierarchy = function() {
		return this._nodeHierarchy;
	};

	/**
	* Gets the visibility changes in the current ViewStateManager object.
	* @returns {string[]} The visibility changes are in the form of an array. The array is a list of node VE ids which suffered a visibility changed relative to the default state.
	* @public
	*/
	ViewStateManager.prototype.getVisibilityChanges = function() {
		return this.getShouldTrackVisibilityChanges() ? this._visibilityTracker.getInfo(this.getNodeHierarchy()) : null;
	};

	ViewStateManager.prototype.getVisibilityComplete = function() {
		var nodeHierarchy = this.getNodeHierarchy(),
			allNodeRefs = nodeHierarchy.findNodesByName(),
			visible = [],
			hidden = [];

		allNodeRefs.forEach(function(nodeRef) {
			// create node proxy based on dynamic node reference
			var nodeProxy = nodeHierarchy.createNodeProxy(nodeRef);
			var veId = nodeProxy.getVeId();
			// destroy the node proxy
			nodeHierarchy.destroyNodeProxy(nodeProxy);
			if (veId) {
				// push the ve id to either visible/hidden array
				if (this.getVisibilityState(nodeRef)) {
					visible.push(veId);
				} else {
					hidden.push(veId);
				}
			}
		}, this);

		return {
			visible: visible,
			hidden: hidden
		};
	};

	ViewStateManager.prototype.resetVisibility = function() {
		this.setVisibilityState(this._initialState.visible, true, false);
		this.setVisibilityState(this._initialState.hidden, false, false);
		this._visibilityTracker.clear();
	};

	/**
	* Gets the visibility state of nodes.
	*
	* If a single node is passed to the method then a single visibility state is returned.<br/>
	* If an array of nodes is passed to the method then an array of visibility states is returned.
	*
	* @param {any|any[]} nodeRefs The node reference or the array of node references.
	* @returns {boolean|boolean[]} A single value or an array of values where the value is <code>true</code> if the node is visible, <code>false</code> otherwise.
	* @public
	*/
	ViewStateManager.prototype.getVisibilityState = function(nodeRefs) {
		var layers = this._layers;
		return Array.isArray(nodeRefs) ?
			nodeRefs.map(function(nodeRef) { return nodeRef.layers.test(layers); }) :
			nodeRefs.layers.test(layers); // NB: The nodeRefs argument is a single nodeRef.
	};

	/**
	* Sets the visibility state of the nodes.
	* @param {any|any[]} nodeRefs The node reference or the array of node references.
	* @param {boolean|boolean[]} visible The new visibility state or array of states of the nodes.
	* @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	* @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	* @public
	*/
	ViewStateManager.prototype.setVisibilityState = function(nodeRefs, visible, recursive) {
		// normalize parameters to have array of nodeRefs and array of visibility values
		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [ nodeRefs ];
		}

		// check if we got an array of booleans as visibility change
		var isBulkChange = Array.isArray(visible);

		var recursiveVisibility = [];
		var allNodeRefs = nodeRefs;

		if (recursive) {
			allNodeRefs = [];
			nodeRefs.forEach(function(nodeRef, idx) {
				var collected = this._collectNodesRecursively(nodeRef);
				allNodeRefs = allNodeRefs.concat(collected);

				var length = recursiveVisibility.length;
				recursiveVisibility.length = length + collected.length;
				recursiveVisibility.fill(isBulkChange ? visible[idx] : visible, length);
			}, this);
		} else if (!isBulkChange) {
			// not recursive, visible is a scalar
			recursiveVisibility.length = allNodeRefs.length;
			recursiveVisibility.fill(visible);
		} else {
			// not recursive, visible is an array
			recursiveVisibility = visible;
		}

		// filter out unchanged visibility and duplicate nodes
		var changedVisibility = [];
		var usedNodeRefs = new Set();
		var layers = this._layers, channel = this._channel;
		var changed = allNodeRefs.filter(function(nodeRef, index) {
			if (usedNodeRefs.has(nodeRef)) {
				return false;
			}

			usedNodeRefs.add(nodeRef);

			var changed = nodeRef ? nodeRef.layers.test(layers) != recursiveVisibility[index] : false;
			if (changed) {
				changedVisibility.push(recursiveVisibility[index]);
			}

			return changed;
		}, this);

		if (changed.length > 0) {

			var eventParameters = {
				visible: [],
				hidden: []
			};

			changed.forEach(function(nodeRef, idx) {
				if (changedVisibility[ idx ]) {
					nodeRef.layers.enable(channel);
					eventParameters.visible.push(nodeRef);
				} else {
					nodeRef.layers.disable(channel);
					eventParameters.hidden.push(nodeRef);
				}
			}, this);

			if (this.getShouldTrackVisibilityChanges()) {
				changed.forEach(this._visibilityTracker.trackNodeRef, this._visibilityTracker);
			}

			this.fireVisibilityChanged(eventParameters);
		}
		return this;
	};

	/**
	* Enumerates IDs of the selected nodes.
	*
	* @param {function} callback A function to call when the selected nodes are enumerated. The function takes one parameter of type <code>string</code>.
	* @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	* @public
	*/
	ViewStateManager.prototype.enumerateSelection = function(callback) {
		this._selectedNodes.forEach(callback);
		return this;
	};

	/**
	* Enumerates IDs of the outlined nodes.
	*
	* @param {function} callback A function to call when the outlined nodes are enumerated. The function takes one parameter of type <code>string</code>.
	* @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	* @public
	*/
	ViewStateManager.prototype.enumerateOutlinedNodes = function(callback) {
		this._outlinedNodes.forEach(callback);
		return this;
	};

	/**
	* Gets the selection state of the node.
	*
	* If a single node reference is passed to the method then a single selection state is returned.<br/>
	* If an array of node references is passed to the method then an array of selection states is returned.
	*
	* @param {any|any[]} nodeRefs The node reference or the array of node references.
	* @returns {boolean|boolean[]} A single value or an array of values where the value is <code>true</code> if the node is selected, <code>false</code> otherwise.
	* @public
	*/
	ViewStateManager.prototype.getSelectionState = function(nodeRefs) {
		var selectionSet = this._selectedNodes;
		function isSelected(nodeRef) {
			return selectionSet.has(nodeRef);
		}

		return Array.isArray(nodeRefs) ?
			nodeRefs.map(isSelected) : isSelected(nodeRefs); // NB: The nodeRefs argument is a single nodeRef.
	};

	ViewStateManager.prototype._isAChild = function(childNodeRef, nodeRefs) {
		var ancestor = childNodeRef.parent;
		while (ancestor) {
			if (nodeRefs.has(ancestor)) {
				return true;
			}
			ancestor = ancestor.parent;
		}
		return false;
	};

	ViewStateManager.prototype._AddBoundingBox = function(nodeRef) {
		if (nodeRef.userData.boundingBox === undefined) {
			nodeRef.userData.boundingBox = new THREE.Box3();
			nodeRef._vkCalculateObjectOrientedBoundingBox();
		}

		if (!nodeRef.userData.boundingBox.isEmpty() && this._boundingBoxesScene && nodeRef.userData.boxHelper === undefined) {
			var boxHelper = new THREE.Box3Helper(nodeRef.userData.boundingBox, 0xffff00);
			boxHelper.material.color = this._selectionColor;
			this._boundingBoxesScene.add(boxHelper);
			boxHelper.parent = nodeRef;
			nodeRef.userData.boxHelper = boxHelper;
		}
	};

	ViewStateManager.prototype._RemoveBoundingBox = function(nodeRef) {
		if (nodeRef.userData.boundingBox !== undefined) {
			delete nodeRef.userData.boundingBox;
		}

		if (nodeRef.userData.boxHelper !== undefined){
			this._boundingBoxesScene.remove(nodeRef.userData.boxHelper);
			delete nodeRef.userData.boxHelper;
		}
	};

	ViewStateManager.prototype._updateBoundingBoxesIfNeeded = function() {
		var updateSet = new Set();
		this._selectedNodes.forEach(function(nodeRef) {
			var parent = nodeRef.parent;
			while (parent) {
				if (this._selectedNodes.has(parent)) {
					updateSet.add(parent); // need to update parent bounding box
				}
				parent = parent.parent;
			}
		}.bind(this));

		updateSet.forEach(function(nodeRef) {
			nodeRef._vkCalculateObjectOrientedBoundingBox();
		});
	};

	ViewStateManager.prototype._updateBoundingBoxes = function() {
		this._selectedNodes.forEach(function(nodeRef) {
			if (nodeRef.userData.boundingBox) {
				nodeRef._vkCalculateObjectOrientedBoundingBox();
			}
		});
	};


	/**
	 * Sets if showing the bounding box when nodes are selected
	 *
	 * @param {boolean} val <code>true</code> if bounding boxes of selected nodes are shown, <code>false</code> otherwise.
	 * @public
	 */
	ViewStateManager.prototype.setShowSelectionBoundingBox = function(val){
		this._showSelectionBoundingBox  = val;
		if (this._showSelectionBoundingBox){
			this._selectedNodes.forEach(function(node){this._AddBoundingBox(node); }.bind(this));
		} else {
			this._selectedNodes.forEach(function(node){this._RemoveBoundingBox(node); }.bind(this));
		}

		this.fireSelectionChanged({
			selected: this._selectedNodes,
			unselected: []
		});
	};

	/**
	 * Gets if showing the bounding box when nodes are selected
	 *
	 * @returns {boolean} <code>true</code> if bounding boxes of selected nodes are shown, <code>false</code> otherwise.
	 * @public
	 */
	ViewStateManager.prototype.getShowSelectionBoundingBox = function(){
		return this._showSelectionBoundingBox;
	};

	ViewStateManager.prototype._isAncestorSelected = function(nodeRef) {
		nodeRef = nodeRef.parent;
		while (nodeRef) {
			if (this._selectedNodes.has(nodeRef)) {
				return true;
			}

			nodeRef = nodeRef.parent;
		}

		return false;
	};

	ViewStateManager.prototype._updateHighlightColor = function(nodeRef, parentSelected) {
		var selected = parentSelected || this._selectedNodes.has(nodeRef);

		nodeRef.userData.highlightColor = selected ? this._highlightColorABGR : undefined;
		nodeRef._vkUpdateMaterialColor();
		var children = nodeRef.children;
		for (var i = 0, l = children.length; i < l; i++) {
			var userData = children[i].userData;
			if (userData && userData.objectType === ObjectType.Hotspot){
				continue;
			}
			this._updateHighlightColor(children[i], selected);
		}
	};

	/**
	* Sets the selection state of the nodes.
	* @param {any|any[]} nodeRefs The node reference or the array of node references.
	* @param {boolean} selected The new selection state of the nodes.
	* @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	* @param {boolean} blockNotification The flag to suppres selectionChanged event.
	* @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	* @deprecated Since version 1.56.3.
	* @public
	*/
	ViewStateManager.prototype.setSelectionState = function(nodeRefs, selected, recursive, blockNotification) {
		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [ nodeRefs ];
		}

		nodeRefs = (recursive || this.getRecursiveSelection() ? this._collectNodesRecursively(nodeRefs) : nodeRefs).filter(function(value, index, self) {
			return self.indexOf(value) === index;
		});

		if (this.getRecursiveSelection() && !selected) {
			nodeRefs = this._nodeHierarchy._appendAncestors(nodeRefs);
		}

		var changed = nodeRefs.filter(function(nodeRef) {
			return this._selectedNodes.has(nodeRef) !== selected;
		}, this);

		if (changed.length > 0) {
			changed.forEach(function(nodeRef) {
				if (nodeRef) {
					this._selectedNodes[ selected ? "add" : "delete" ](nodeRef);
					if (this._showSelectionBoundingBox) {
						this[ selected ? "_AddBoundingBox" : "_RemoveBoundingBox" ](nodeRef);
					}
				}
			}, this);

			// we need to update this._selectedNodes before updating nodes highlight color
			changed.forEach(function(nodeRef) {
				if (nodeRef) {
					this._updateHighlightColor(nodeRef, selected || this._isAncestorSelected(nodeRef));
				}
			}, this);

			if (!blockNotification) {
				this.fireSelectionChanged({
					selected: selected ? changed : [],
					unselected: selected ? [] : changed
				});
			}
		}

		return this;
	};

	/**
	 * Sets or resets the selection state of the nodes.
	 * @param {any|any[]} selectedNodeRefs The node reference or the array of node references of selected nodes.
	 * @param {any|any[]} unselectedNodeRefs The node reference or the array of node references of unselected nodes.
	 * @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	 * @param {boolean} blockNotification The flag to suppres selectionChanged event.
	 * @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	 * @public
	 */
	ViewStateManager.prototype.setSelectionStates = function(selectedNodeRefs, unselectedNodeRefs, recursive, blockNotification) {
		if (!Array.isArray(selectedNodeRefs)) {
			selectedNodeRefs = [ selectedNodeRefs ];
		}

		if (!Array.isArray(unselectedNodeRefs)) {
			unselectedNodeRefs = [ unselectedNodeRefs ];
		}

		selectedNodeRefs = (recursive || this.getRecursiveSelection() ? this._collectNodesRecursively(selectedNodeRefs) : selectedNodeRefs);
		unselectedNodeRefs = (recursive || this.getRecursiveSelection() ? this._collectNodesRecursively(unselectedNodeRefs) : unselectedNodeRefs);

		if (this.getRecursiveSelection()) {
			unselectedNodeRefs = this._nodeHierarchy._appendAncestors(unselectedNodeRefs, selectedNodeRefs);
		}

		var selected = selectedNodeRefs.filter(function(nodeRef) {
			return this._selectedNodes.has(nodeRef) === false;
		}, this);

		var unselected = unselectedNodeRefs.filter(function(nodeRef) {
			return this._selectedNodes.has(nodeRef) === true;
		}, this);

		if (selected.length > 0 || unselected.length > 0) {
			selected.forEach(function(nodeRef) {
				this._selectedNodes.add(nodeRef);
				this._updateHighlightColor(nodeRef, true);
				if (this._showSelectionBoundingBox) {
					this._AddBoundingBox(nodeRef);
				}
			}, this);

			unselected.forEach(function(nodeRef) {
				this._selectedNodes.delete(nodeRef);
				if (this._showSelectionBoundingBox) {
					this._RemoveBoundingBox(nodeRef);
				}
			}, this);

			// we need to remove all unselected nodes from this._selectedNodes before updating unselected nodes highlight color
			unselected.forEach(function(nodeRef) {
				this._updateHighlightColor(nodeRef, this._isAncestorSelected(nodeRef));
			}, this);

			if (!blockNotification) {
				this.fireSelectionChanged({
					selected: selected,
					unselected: unselected
				});
			}
		}

		return this;
	};

		/**
	 * Sets the outline color
	 * @param {sap.ui.vk.CSSColor|string|int} color           The new outline color. The value can be defined as a string
	 *                                                        in the CSS color format or as an integer in the ABGR format. If <code>null</code>
	 *                                                        is passed then the tint color is reset and the node's own tint color should be used.
	 * @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	 * @public
	 */
	ViewStateManager.prototype.setOutlineColor = function(color) {
		switch (typeof color) {
			case "number":
				this._outlineColorABGR = color;
				break;
			case "string":
				if (sap.ui.core.CSSColor.isValid(color)) {
					this._outlineColorABGR = colorToABGR(cssColorToColor(color));
				}
				break;
			default:
				return this;
		}

		this.fireOutlineColorChanged({
			outlineColor: colorToCSSColor(abgrToColor(this._outlineColorABGR)),
			outlineColorABGR: this._outlineColorABGR
		});

		return this;
	};


	/**
	 * Gets the outline color
	 *
	 * @param {boolean}         [inABGRFormat=false] This flag indicates to return the outline color in the ABGR format,
	 *                                               if it equals <code>false</code> then the color is returned in the CSS color format.
	 * @returns {sap.ui.core.CSSColor|string|int}
	 *                                               A single value or an array of values. Value <code>null</code> means that
	 *                                               the node's own tint color should be used.
	 * @public
	 */
	ViewStateManager.prototype.getOutlineColor = function(inABGRFormat) {
		return inABGRFormat ? this._outlineColorABGR : colorToCSSColor(abgrToColor(this._outlineColorABGR));
	};


	/**
	 * Gets the outlining state of the node.
	 *
	 * If a single node reference is passed to the method then a single outlining state is returned.<br/>
	 * If an array of node references is passed to the method then an array of outlining states is returned.
	 *
	 * @param {any|any[]} nodeRefs The node reference or the array of node references.
	 * @returns {boolean|boolean[]} A single value or an array of values where the value is <code>true</code> if the node is selected, <code>false</code> otherwise.
	 * @public
	 */
	ViewStateManager.prototype.getOutliningState = function(nodeRefs) {
		var outliningSet = this._outlinedNodes;
		function isOutlined(nodeRef) {
			return outliningSet.has(nodeRef);
		}

		return Array.isArray(nodeRefs) ?
			nodeRefs.map(isOutlined) : isOutlined(nodeRefs); // NB: The nodeRefs argument is a single no
	};


	/**
	 * Sets or resets the outlining state of the nodes.
	 * @param {any|any[]} outlinedNodeRefs The node reference or the array of node references of outlined nodes.
	 * @param {any|any[]} unoutlinedNodeRefs The node reference or the array of node references of un-outlined nodes.
	 * @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	 * @param {boolean} blockNotification The flag to suppres outlineChanged event.
	 * @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	 * @public
	 */
	ViewStateManager.prototype.setOutliningStates = function(outlinedNodeRefs, unoutlinedNodeRefs, recursive, blockNotification) {
		if (!Array.isArray(outlinedNodeRefs)) {
			outlinedNodeRefs = [ outlinedNodeRefs ];
		}

		if (!Array.isArray(unoutlinedNodeRefs)) {
			unoutlinedNodeRefs = [ unoutlinedNodeRefs ];
		}

		outlinedNodeRefs = (recursive || this.getRecursiveOutlining() ? this._collectNodesRecursively(outlinedNodeRefs) : outlinedNodeRefs);
		unoutlinedNodeRefs = (recursive || this.getRecursiveOutlining() ? this._collectNodesRecursively(unoutlinedNodeRefs) : unoutlinedNodeRefs);

		if (this.getRecursiveOutlining()) {
			unoutlinedNodeRefs = this._nodeHierarchy._appendAncestors(unoutlinedNodeRefs, outlinedNodeRefs);
		}

		var outlined = outlinedNodeRefs.filter(function(nodeRef) {
			return this._outlinedNodes.has(nodeRef) === false;
		}, this);

		var unoutlined = unoutlinedNodeRefs.filter(function(nodeRef) {
			return this._outlinedNodes.has(nodeRef) === true;
		}, this);

		if (outlined.length > 0 || unoutlined.length > 0) {
			outlined.forEach(function(nodeRef) {
				this._outlinedNodes.add(nodeRef);
			}, this);

			unoutlined.forEach(function(nodeRef) {
				this._outlinedNodes.delete(nodeRef);
			}, this);

			if (!blockNotification) {
				this.fireOutliningChanged({
					outlined: outlined,
					unoutlined: unoutlined
				});
			}
		}

		return this;
	};

	/**
	 * Sets the outline width
	 * @function
	 * @param {float} width           			width of outline
	 * @returns {sap.ui.vk.ViewStateManager} 	<code>this</code> to allow method chaining.
	 * @public
	 */
	ViewStateManager.prototype.setOutlineWidth = function(width) {
		this._outlineWidth = width;
		this._outlineRenderer.setOutlineWidth(width);
		this.fireOutlineWidthChanged({
			width: width
		});
		return this;
	};

	/**
	 * Gets the outline width
	 * @function
	 * @returns {float} width of outline
	 * @public
	 */
	ViewStateManager.prototype.getOutlineWidth = function() {
		return this._outlineWidth;
	};

	ViewStateManager.prototype._collectNodesRecursively = function(nodeRefs) {
		var result = [],
			that = this;

		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [ nodeRefs ];
		}

		nodeRefs.forEach(function collectChildNodes(nodeRef) {
			result.push(nodeRef);
			that._nodeHierarchy.enumerateChildren(nodeRef, collectChildNodes, false, true);
		});
		return result;
	};

	/**
	* Gets the opacity of the node.
	*
	* A helper method to ensure the returned value is either <code>float</code> or <code>null</code>.
	*
	* @param {any} nodeRef The node reference.
	* @returns {float|null} The opacity or <code>null</code> if no opacity set.
	* @private
	*/
	ViewStateManager.prototype._getOpacity = function(nodeRef) {
		return nodeRef.userData.opacity !== undefined ? nodeRef.userData.opacity : null;
	};

	/**
	* Gets the opacity of the node.
	*
	* If a single node is passed to the method then a single value is returned.<br/>
	* If an array of nodes is passed to the method then an array of values is returned.
	*
	* @param {any|any[]}	nodeRefs	The node reference or the array of node references.
	* @returns {float|float[]} A single value or an array of values. Value <code>null</code> means that the node's own opacity should be used.
	* @public
	*/
	ViewStateManager.prototype.getOpacity = function(nodeRefs) {
		if (Array.isArray(nodeRefs)) {
			return nodeRefs.map(this._getOpacity, this);
		} else {
			return this._getOpacity(nodeRefs); // NB: The nodeRefs argument is a single nodeRef.
		}
	};

	/**
	* Sets the opacity of the nodes.
	*
	* @param {any|any[]}               nodeRefs          The node reference or the array of node references.
	* @param {float|float[]|null}      opacity           The new opacity of the nodes. If <code>null</code> is passed then the opacity is reset
	*                                                    and the node's own opacity should be used.
	* @param {boolean}         [recursive=false] This flag is not used, as opacity is always recursively applied to the offspring nodes by multiplcation
	* @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	* @public
	*/
	ViewStateManager.prototype.setOpacity = function(nodeRefs, opacity, recursive) {
		// normalize parameters to have array of nodeRefs and array of visibility values
		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [ nodeRefs ];
		}

		// check if we got an array as opacity
		var isBulkChange = Array.isArray(opacity);

		if (opacity == null) {
			opacity = undefined;
		} else if (isBulkChange) {
			opacity.forEach(function(value, idx) {
				if (value == null) {
					opacity[idx] = undefined;
				}
			});
		}

		var recursiveOpacity = [];
		var allNodeRefs = nodeRefs;

		if (!isBulkChange) {
			// not recursive, opacity is a scalar
			recursiveOpacity.length = allNodeRefs.length;
			recursiveOpacity.fill(opacity);
		} else {
			// not recursive, opacity is an array
			recursiveOpacity = opacity;
		}

		// filter out unchanged opacity and duplicate nodes
		var changedOpacity = [];
		var usedNodeRefs = new Set();
		var changed = allNodeRefs.filter(function(nodeRef, index) {
			if (usedNodeRefs.has(nodeRef)) {
				return false;
			}

			usedNodeRefs.add(nodeRef);

			var changed = nodeRef ? nodeRef.userData.opacity !== recursiveOpacity[index] : false;
			if (changed) {
				changedOpacity.push(recursiveOpacity[index]);
			}

			return changed;
		}, this);

		if (changed.length > 0) {
			changed.forEach(function(nodeRef, idx) {
				nodeRef._vkSetOpacity(changedOpacity[idx], this._jointCollection);
			}, this);

			var eventParameters = {
				changed: changed,
				opacity: isBulkChange ? changedOpacity : changedOpacity[0]
			};

			this.fireOpacityChanged(eventParameters);
		}

		return this;
	};

	/**
	* Gets the tint color of the node in the ABGR format.
	*
	* A helper method to ensure that the returned value is either <code>int</code> or <code>null</code>.
	*
	* @param {any} nodeRef The node reference.
	* @returns {int|null} The color in the ABGR format or <code>null</code> if no tint color is set.
	* @private
	*/
	ViewStateManager.prototype._getTintColorABGR = function(nodeRef) {
		return nodeRef.userData.tintColor !== undefined ? nodeRef.userData.tintColor : null;
	};

	/**
	* Gets the tint color in the CSS color format.
	*
	* A helper method to ensure that the returned value is either {@link sap.ui.core.CSSColor} or <code>null</code>.
	*
	* @param {any} nodeRef The node reference.
	* @returns {sap.ui.core.CSSColor|null} The color in the CSS color format or <code>null</code> if no tint color is set.
	* @private
	*/
	ViewStateManager.prototype._getTintColor = function(nodeRef) {
		return nodeRef.userData.tintColor !== undefined ?
			colorToCSSColor(abgrToColor(nodeRef.userData.tintColor)) : null;
	};

	/**
	* Gets the tint color of the node.
	*
	* If a single node reference is passed to the method then a single value is returned.<br/>
	* If an array of node references is passed to the method then an array of values is returned.
	*
	* @param {any|any[]}       nodeRefs             The node reference or the array of node references.
	* @param {boolean}         [inABGRFormat=false] This flag indicates to return the tint color in the ABGR format,
	*                                               if it equals <code>false</code> then the color is returned in the CSS color format.
	* @returns {sap.ui.core.CSSColor|sap.ui.core.CSSColor[]|int|int[]}
	*                                               A single value or an array of values. Value <code>null</code> means that
	*                                               the node's own tint color should be used.
	* @public
	*/
	ViewStateManager.prototype.getTintColor = function(nodeRefs, inABGRFormat) {
		var getTintColorMethodName = inABGRFormat ? "_getTintColorABGR" : "_getTintColor";
		if (Array.isArray(nodeRefs)) {
			return nodeRefs.map(this[ getTintColorMethodName ], this);
		} else {
			return this[ getTintColorMethodName ](nodeRefs); // NB: The nodeRefs argument is a single nodeRef.
		}
	};

	/**
	* Sets the tint color of the nodes.
	* @param {any|any[]}                   nodeRefs          The node reference or the array of node references.
	* @param {sap.ui.vk.CSSColor|int|sap.ui.vk.CSSColor[]|int[]|null} tintColor The new tint color of the nodes.
	*                                                        The value can be defined as a string in the CSS color format or as an integer in the ABGR format or
	*                                                        it could be array of these values. If <code>null</code>
	*                                                        is passed then the tint color is reset and the node's own tint color should be used.
	* @param {boolean}                     [recursive=false] This flag indicates if the change needs to propagate recursively to child nodes.
	* @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	* @public
	*/
	ViewStateManager.prototype.setTintColor = function(nodeRefs, tintColor, recursive) {
		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [ nodeRefs ];
		}

		var toABGR = function(color) {
			var result = null;
			switch (typeof color) {
				case "number":
					result = color;
					break;
				case "string":
					if (sap.ui.core.CSSColor.isValid(color)) {
						result = colorToABGR(cssColorToColor(color));
					}
					break;
				default:
					result = undefined; // The color is invalid, reset it to null.
					break;
			}

			return result;
		};

		// check if we got an array as tink color
		var isBulkChange = Array.isArray(tintColor);

		var recursiveColor = [];
		var allNodeRefs = nodeRefs;

		if (recursive) {
			allNodeRefs = [];
			nodeRefs.forEach(function(nodeRef, idx) {
				var collected = this._collectNodesRecursively(nodeRef);
				allNodeRefs = allNodeRefs.concat(collected);

				var length = recursiveColor.length;
				recursiveColor.length = length + collected.length;
				recursiveColor.fill(isBulkChange ? tintColor[idx] : tintColor, length);
			}, this);
		} else if (!isBulkChange) {
			// not recursive, opacity is a scalar
			recursiveColor.length = allNodeRefs.length;
			recursiveColor.fill(tintColor);
		} else {
			// not recursive, opacity is an array
			recursiveColor = tintColor;
		}

		// filter out unchanged opacity and duplicate nodes
		var changedColor = [];
		var usedNodeRefs = new Set();
		var changed = allNodeRefs.filter(function(nodeRef, index) {
			if (usedNodeRefs.has(nodeRef)) {
				return false;
			}

			usedNodeRefs.add(nodeRef);
			var changed = nodeRef ? nodeRef.userData.tintColor !== toABGR(recursiveColor[index]) : false;
			if (changed) {
				changedColor.push(recursiveColor[index]);
			}

			return changed;
		}, this);

		if (changed.length > 0) {
			var changedABGR = [];
			changed.forEach(function(nodeRef, idx) {
				var color = toABGR(changedColor[idx]);
				nodeRef._vkSetTintColor(color);
				changedABGR.push(color);
			}, this);

			var eventParameters = {
				changed: changed,
				tintColor: isBulkChange ? changedColor : changedColor[0],
				tintColorABGR: isBulkChange ? changedABGR : changedABGR[0]
			};

			this.fireTintColorChanged(eventParameters);
		}

		return this;
	};

	/**
	* Sets the default highlighting color
	* @param {sap.ui.vk.CSSColor|string|int} color           The new highlighting color. The value can be defined as a string
	*                                                        in the CSS color format or as an integer in the ABGR format. If <code>null</code>
	*                                                        is passed then the tint color is reset and the node's own tint color should be used.
	* @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	* @public
	*/
	ViewStateManager.prototype.setHighlightColor = function(color) {

		switch (typeof color) {
			case "number":
				this._highlightColorABGR = color;
				break;
			case "string":
				if (sap.ui.core.CSSColor.isValid(color)) {
					this._highlightColorABGR = colorToABGR(cssColorToColor(color));
				}
				break;
			default:
				return this;
		}

		if (this._selectedNodes.size > 0) {
			this._selectedNodes.forEach(function(nodeRef) {
				this._updateHighlightColor(nodeRef, true);
			}, this);
		}

		this.fireHighlightColorChanged({
			highlightColor: colorToCSSColor(abgrToColor(this._highlightColorABGR)),
			highlightColorABGR: this._highlightColorABGR
		});

		return this;
	};


	/**
	* Gets the default highlighting color
	*
	* @param {boolean}         [inABGRFormat=false] This flag indicates to return the highlighting color in the ABGR format,
	*                                               if it equals <code>false</code> then the color is returned in the CSS color format.
	* @returns {sap.ui.core.CSSColor|string|int}
	*                                               A single value or an array of values. Value <code>null</code> means that
	*                                               the node's own tint color should be used.
	* @public
	*/
	ViewStateManager.prototype.getHighlightColor = function(inABGRFormat) {
		return inABGRFormat ? this._highlightColorABGR : colorToCSSColor(abgrToColor(this._highlightColorABGR));
	};


	/**
	 * Gets the decomposed node local transformation matrix.
	 *
	 * @param {any|any[]} nodeRef The node reference or array of nodes.
	 * @returns {any|any[]} object that contains <code>translation</code>, <code>scale</code> and <code>quaternion</code> components.
	 * @private
	 */
	ViewStateManager.prototype.getTransformation = function(nodeRef) {
		var getData = function(node) {
			return {
				translation: this.getTranslation(node),
				quaternion: this.getRotation(node, RotationType.Quaternion),
				scale: this.getScale(node)
			};
		}.bind(this);

		if (!Array.isArray(nodeRef)) {
			return getData(nodeRef);
		}

		var result = [];
		nodeRef.forEach(function(node) {
			result.push(getData(node));
		});

		return result;
	};

	/**
	 * Gets the node transformation translation component.
	 *
	 * @param {any|any[]} nodeRef The node reference or array of nodes.
	 * @returns {float[]|Array<Array<float>>} A translation component of node's transformation matrix or array of components.
	 * @private
	 */
	ViewStateManager.prototype.getTranslation = function(nodeRef) {
		var getComponent = function(node) {
			return !node.userData.position ? node.position.toArray() : node.userData.position.toArray();
		};

		if (!Array.isArray(nodeRef)) {
			return getComponent(nodeRef);
		}

		var result = [];
		nodeRef.forEach(function(node) {
			result.push(getComponent(node));
		});

		return result;
	};

	/**
	 * Gets the node transformaton scale component.
	 *
	 * @param {any|any[]} nodeRef The node reference or array of nodes.
	 * @returns {float[]|Array<Array<float>>} A scale component of node's transformation matrix or array of components.
	 * @private
	 */
	ViewStateManager.prototype.getScale = function(nodeRef) {
		var getComponent = function(node) {
			return !node.userData.scale ? node.scale.toArray() : node.userData.scale.toArray();
		};

		if (!Array.isArray(nodeRef)) {
			return getComponent(nodeRef);
		}

		var result = [];
		nodeRef.forEach(function(node) {
			result.push(getComponent(node));
		});

		return result;
	};

	/**
	 * Gets the node transformation rotation component.
	 *
	 * @param {any|any[]} nodeRef The node reference or array of nodes.
	 * @param {sap.ui.vk.RotationType} rotationType Rotation representation type.
	 * @returns {float[]|Array<Array<float>>} A rotation component of node's transformation matrix or array of components in specified format.
	 * @private
	 */
	ViewStateManager.prototype.getRotation = function(nodeRef, rotationType) {
		var getComponent = function(node) {
			var quaternion = !node.userData.quaternion ? node.quaternion : node.userData.quaternion;
			var result;
			switch (rotationType) {
				case RotationType.AngleAxis:
					if (quaternion.w > 1) {
						quaternion.normalize();
					}

					var angle = 2 * Math.acos(quaternion.w);
					var x;
					var y;
					var z;
					var s = Math.sqrt(1 - quaternion.w * quaternion.w); // assuming quaternion normalised then w is less than 1, so term always positive.
					if (s < 0.0001) { // test to avoid divide by zero, s is always positive due to sqrt
						// if s close to zero then direction of axis not important
						x = 1;
						y = 0;
						z = 0;
					} else {
						x = quaternion.x / s; // normalise axis
						y = quaternion.y / s;
						z = quaternion.z / s;
					}

					result = [ x, y, z, angle ];
					break;
				case RotationType.Euler:
					var euler = new THREE.Euler();
					euler.setFromQuaternion(quaternion);

					result = euler.toArray();
					break;
				default:
					result = quaternion.toArray();
			}
			return result;
		};

		if (!Array.isArray(nodeRef)) {
			return getComponent(nodeRef);
		}

		var result = [];
		nodeRef.forEach(function(node) {
			result.push(getComponent(node));
		});

		return result;

	};

	/**
	 * Sets the node transformation components.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManager#setTransformation
	 * @param {any|any[]} nodeRefs The node reference or array of node references.
	 * @param {any|any[]} transformations Node's transformation matrix components or array of such.
	 * 									  Each object should contain exactly one of angleAxis, euler or quaternion components.
	 * @param {float[]} transformation.translation translation component.
	 * @param {float[]} transformation.scale scale component.
	 * @param {float[]} [transformation.angleAxis] rotation component as angle-axis, or
	 * @param {float[]} [transformation.euler] rotation component as Euler angles, or
	 * @param {float[]} [transformation.quaternion] rotation component as quaternion.
	 * @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	 * @private
	 */
	ViewStateManager.prototype.setTransformation = function(nodeRefs, transformations) {
		var isBulkChange = Array.isArray(nodeRefs);

		if (!Array.isArray(nodeRefs)) {
			nodeRefs = [ nodeRefs ];
		}

		var eventParameters = {
			changed: [],
			transformation: []
		};

		var getTransformParametersForEvent = function(node) {
			return {
				position: node.position.toArray(),
				quaternion: node.quaternion.toArray(),
				scale: node.scale.toArray()
			};
		};

		if (!transformations) {

			nodeRefs.forEach(function(nodeRef) {
				if (nodeRef.userData.position && nodeRef.userData.quaternion && nodeRef.userData.scale) {
					nodeRef.position = nodeRef.userData.position;
					nodeRef.quaternion = nodeRef.userData.quaternion;
					nodeRef.scale = nodeRef.userData.scale;

					delete nodeRef.userData.position;
					delete nodeRef.userData.quaternion;
					delete nodeRef.userData.scale;
				}

				this._customPositionedNodes.delete(nodeRef);

				eventParameters.changed.push(nodeRef);
				eventParameters.transformation.push(getTransformParametersForEvent(nodeRef));
			}, this);

		} else {

			if (!Array.isArray(transformations)) {
				transformations = [ transformations ];
			}

			nodeRefs.forEach(function(nodeRef, idx) {
				if (!(nodeRef.userData.position || nodeRef.userData.quaternion || nodeRef.userData.scale)) {
					nodeRef.userData.position = nodeRef.position.clone();
					nodeRef.userData.quaternion = nodeRef.quaternion.clone();
					nodeRef.userData.scale = nodeRef.scale.clone();
				}

				var transformation = transformations[idx];

				nodeRef.position.fromArray(transformation.translation);

				nodeRef.scale.fromArray(transformation.scale);

				if (transformation.quaternion) {
					nodeRef.quaternion.fromArray(transformation.quaternion);
				} else if (transformation.angleAxis) {
					var axis = new THREE.Vector3(transformation.angleAxis[0], transformation.angleAxis[1], transformation.angleAxis[2]);
					nodeRef.quaternion.setFromAxisAngle(axis, transformation.angleAxis[3]);
				} else if (transformation.euler) {
					var euler = new THREE.Euler();
					euler.fromArray(transformation.euler[0], transformation.euler[1], transformation.euler[2], transformation.euler[3]);
					nodeRef.quaternion.setFromEuler(euler);
				}

				this._customPositionedNodes.add(nodeRef);

				eventParameters.changed.push(nodeRef);
				eventParameters.transformation.push(getTransformParametersForEvent(nodeRef));
			}, this);
		}

		if (!isBulkChange) {
			eventParameters.changed = eventParameters.changed[0];
			eventParameters.transformation = eventParameters.transformation[0];
		}

		this.fireTransformationChanged(eventParameters);

		return this;
	};

	/**
	 * Retrieves list of current joints
	 * @returns {any[]} array of joints or <code>undefined</code>
	 * @see sap.ui.vk.AnimationSequence.setJoint for joint definition
	 *
	 * @private
	 */
	ViewStateManager.prototype.getJoints = function() {
		return this._jointCollection;
	};

	/**
	 * Sets list of current joints
	 * @param {any[]} joints Array of joint objects or <code>undefined</code>.
	 * @see sap.ui.vk.AnimationSequence.setJoint for joint definition
	 * @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	 *
	 * @private
	 */
	ViewStateManager.prototype.setJoints = function(joints) {
		this._jointCollection = [];

		if (!joints) {
			return this;
		}

		var jointSet = new Set();
		var jointMap = new Map();
		joints.forEach(function(joint) {
			jointSet.add(joint.node);
			jointMap.set(joint.node, joint);
		});

		while (jointSet.size > 0) {
			var node = jointSet.values().next().value;
			jointSet.delete(node);
			var joint = jointMap.get(node);
			var jointSequence = [ joint ];

			var intermediateNodes = [];
			var ancestor = joint.parent;
			while (ancestor) {
				joint = jointMap.get(ancestor);
				if (joint !== undefined) {
					if (jointSet.delete(ancestor)) {
						jointSequence.push(joint);
					}

					if (intermediateNodes.length > 0) {
						joint.nodesToUpdate = joint.nodesToUpdate || [];
						while (intermediateNodes.length > 0) {
							var imNode = intermediateNodes.pop();
							if (joint.nodesToUpdate.indexOf(imNode) >= 0) {
								break;
							}
							joint.nodesToUpdate.push(imNode); // add intermediate node
						}
					}

					intermediateNodes.length = 0;
					ancestor = joint.parent;
				} else {
					intermediateNodes.push(ancestor);
					ancestor = ancestor.parent;
				}
			}

			while (jointSequence.length > 0) {
				this._jointCollection.push(jointSequence.pop());
			}
		}

		return this;
	};

	var jointPosition = new THREE.Vector3();
	var jointQuaternion = new THREE.Quaternion();
	var jointScale = new THREE.Vector3();
	ViewStateManager.prototype._updateJointNodes = function() {
		if (this._jointCollection && this._jointCollection.length > 0) {
			this._jointCollection.forEach(function(joint) {
				var node = joint.node;

				// Since we will use object's world matrices below ensure they are up to date.
				joint.parent.updateMatrixWorld(true);
				node.updateMatrixWorld(true);

				node.matrix.compose(jointPosition.fromArray(joint.translation), jointQuaternion.fromArray(joint.quaternion), jointScale.fromArray(joint.scale));
				node.matrixWorld.multiplyMatrices(joint.parent.matrixWorld, node.matrix);
				node.matrix.getInverse(node.parent.matrixWorld).multiply(node.matrixWorld);
				node.matrix.decompose(node.position, node.quaternion, node.scale);
				node.matrixWorldNeedsUpdate = false;
				if (joint.nodesToUpdate) {// update dependent intermediate nodes
					joint.nodesToUpdate.forEach(function(subnode) {
						if (subnode.matrixAutoUpdate) { subnode.updateMatrix(); }
						subnode.matrixWorld.multiplyMatrices(subnode.parent.matrixWorld, subnode.matrix);
						subnode.matrixWorldNeedsUpdate = false;
					});
				}
			});
		}
	};

	ViewStateManager.prototype._recalculateJointsForNodes = function(nodes) {
		if (this._jointCollection && this._jointCollection.length > 0) {
			var jointMap = new Map();
			this._jointCollection.forEach(function(joint) {
				jointMap.set(joint.node, joint);
			});
			var matrix = new THREE.Matrix4();
			nodes.forEach(function(node) {
				var joint = jointMap.get(node);
				if (joint) {
					node.updateMatrixWorld();
					joint.parent.updateMatrixWorld();
					matrix.getInverse(joint.parent.matrixWorld).multiply(node.matrixWorld);
					var jointPosition = new THREE.Vector3();
					var jointQuaternion = new THREE.Quaternion();
					var jointScale = new THREE.Vector3();
					matrix.decompose(jointPosition, jointQuaternion, jointScale);
					jointPosition.toArray(joint.translation);
					jointQuaternion.toArray(joint.quaternion);
					jointScale.toArray(joint.scale);
				}
			});
		}
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Moved from Viewport class: view activation - related
	//
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	ViewStateManager.prototype._updateMaterialInNode = function(nodeInfo) {

		var node = nodeInfo.target;

		var i, child;
		if (node && node.children) {
			for (i = 0; i < node.children.length; i++) {
				child = node.children[i];
				if (child.userData && (child.userData.animatedOpacity || child.userData.animatedColor)) {
					child._vkUpdateMaterialColor();
					child._vkUpdateMaterialOpacity();
					if (child.userData.animatedOpacity) {
						child.material.transparent = true;
					}
				}
			}
		}

		var oldMaterialId = node.userData.materialId;
		var oldOpacity = node.userData.opacity;

		node.userData.materialId = nodeInfo.materialId;
		node.userData.opacity = nodeInfo.opacity;

		var reAssignMaterial = false;
		if (oldMaterialId === undefined) {
			if (node.userData.materialId !== undefined) {
				reAssignMaterial = true;
			}
		} else if (oldMaterialId !== node.userData.materialId) {
			reAssignMaterial = true;
		}

		var resetOpacity = false;
		if (oldOpacity === undefined) {
			if (node.userData.opacity !== undefined || node.userData.animatedOpacity) {
				resetOpacity = true;
			}
		} else if (oldOpacity !== node.userData.opacity) {
			resetOpacity = true;
		}

		if (!reAssignMaterial && !resetOpacity) {
			 return;
		}

		var nodeMaterial  = null;
		if (node.userData.materialId) {
			var vkMaterial = this._scene.getMaterial(node.userData.materialId);
			if (vkMaterial) {
				nodeMaterial = vkMaterial.getMaterialRef();
			}
		}

		if (node && node.children) {
			for (i = 0; i < node.children.length; i++) {
				child = node.children[i];
				if (nodeMaterial) {
					child.material = nodeMaterial;
					child.userData.materialId = nodeInfo.materialId;
				} else if (child.userData && child.userData.initialMaterialId){
					var vkMeshMaterial = this._scene.getMaterial(child.userData.initialMaterialId);
					if (vkMeshMaterial) {
						var meshMaterial = vkMeshMaterial.getMaterialRef();
						child.material = meshMaterial;
						child.userData.materialId = child.userData.initialMaterialId;
					}
				}

				if (child.material && child.material.userData) {
					child.userData.originalMaterial = child.material;
					child.material = child.material.clone();
					if (node.userData.opacity !== undefined) {
						child.userData.opacity = node.userData.opacity;
						child.material.opacity *= child.userData.opacity;
						child.material.transparent = child.material.opacity < 0.99;
					}

					if (child.userData.animatedOpacity) {
						child.material.transparent = true;
					}
				}
			}
		}
	};

	ViewStateManager.prototype._resetNodesStatusByCurrenView = function(view, setVisibility, animationNodeTransition) {

		function arrayToMatrixThree(array) {
			return new THREE.Matrix4().set(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9], array[10], array[11], 0, 0, 0, 1);
		}

		var nodeHierarchy = this.getNodeHierarchy();
		if (nodeHierarchy) {

			var playbacks;
			if (view) {
				playbacks = view.getPlaybacks();
			}

			var nodeInfo = view.getNodeInfos();

			if (nodeInfo) {  // for totaraLoader
				this._nodesTransitionHelper.clear();
				var transforms = {
					nodeRefs: [],
					positions: []
				};
				var newPosition = new THREE.Vector3();
				var newRotation = new THREE.Quaternion();
				var newScale = new THREE.Vector3();

				nodeInfo.forEach(function(node) {
					if (node.target === null) {
						return;
					}

					function equalMatrices(matrix1, matrix2, error){
						for (var ei = 0; ei < matrix1.elements.length; ei++){
							if (Math.abs(matrix1.elements[ei] - matrix2.elements[ei]) > error){
								return false;
							}
						}
						return true;
					}

					if (node.transform) {
						var newMatrix = arrayToMatrixThree(node.transform);
						if (!equalMatrices(newMatrix, node.target.matrix, 1e-6)){
							// Transition node to its view position as it differs from original node position
							if ((!playbacks || !playbacks.length) && animationNodeTransition) {
								// If view does not have animations then we will perform an interpolation animation for node transform
								var nodeProxy = nodeHierarchy.createNodeProxy(node.target);
								this._nodesTransitionHelper.setNodeForDisplay(nodeProxy, newMatrix);
							} else {

								newMatrix.decompose(newPosition, newRotation, newScale);
								transforms.nodeRefs.push(node.target);
								transforms.positions.push({
									translation: newPosition.toArray(),
									quaternion: newRotation.toArray(),
									scale: newScale.toArray()
								});
							}
						}
					} else if (node.scale && node.rotate && node.translate) {
						transforms.nodeRefs.push(node.target);
						transforms.positions.push({
							translation: node.translate.slice(),
							quaternion: node.rotate.slice(),
							scale: node.scale.slice()
						});
					}
				}.bind(this));

				if (view.userData && view.userData.nodeStartDataByAnimation) {
					view.userData.nodeStartDataByAnimation.forEach(function(data, nodeRef) {
						if (data.translate && data.rotate && data.scale) {
							transforms.nodeRefs.push(nodeRef);
							transforms.positions.push({
								translation: data.translate.slice(),
								quaternion: data.rotate.slice(),
								scale: data.scale.slice()
							});
						}
					}, this);
				}

				if (transforms.nodeRefs.length) {
					this.setTransformation(transforms.nodeRefs, transforms.positions);
				}

				if (setVisibility) {
					// Apply nodes visibility for the current view
					var nodeVisible = [];
					var nodeInvisible = [];
					nodeInfo.forEach(function(info) {
						(info.visible ? nodeVisible : nodeInvisible).push(info.target);
					});

					// Hide all root nodes. The roots that have visible nodes will be made visible when these nodes visibility changes.
					this.setVisibilityState(nodeHierarchy.getChildren()[0].children, false, true);
					this.setVisibilityState(nodeVisible, true, false);
					this.setVisibilityState(nodeInvisible, false, false);

					this._startViewChangeNodeTransition();

					// TODO

				}
			}
		}

	};

	ViewStateManager.prototype._startViewChangeNodeTransition = function() {

		this._nodesTransitionHelper.startDisplay(500);

		var displaying = true;

		this._nodesTransitionHelper.attachEventOnce("displayed", function() {
			displaying = false;
		});

		var display = function() {
			if (displaying) {
				this._nodesTransitionHelper.displayNodesMoving();
				window.requestAnimationFrame(display);
			}
		}.bind(this);

		window.requestAnimationFrame(display);
	};

	ViewStateManager.prototype._resetNodesMaterialAndOpacityByCurrenView = function(view) {

		if (!view) {
			return;
		}

		var nodeInfo = view.getNodeInfos();

		if (nodeInfo) {  // for totaraLoader
			nodeInfo.forEach(function(node) {
				if (node.target === null) {
					return;
				}

				this._updateMaterialInNode(node);
			}.bind(this));
		}
	};

	ViewStateManager.prototype._onViewActivated = function(channel, eventId, event) {
		var viewManager = this.getViewManager();
		if (!viewManager || event.source.getId() !== viewManager) {
			return;
		}
		this.activateView(event.view, false, event.playViewGroup, event.notAnimateCameraChange);
	};

	/**
	 * Activate specified view
	 *
	 * @param {sap.ui.vk.View} view view object definition
	 * @param {boolean} ignoreAnimationPosition when set to true, initial animation state is not applied to the view
	 * @param {boolean} playViewGroup true if view activation is part of playing view group
	 * @param {boolean} notAnimateCameraChange do not animate the change of camera
	 * @returns {sap.ui.vk.ViewStateManager} return this
	 * @private
	 */
	ViewStateManager.prototype.activateView = function(view, ignoreAnimationPosition, playViewGroup, notAnimateCameraChange) {

		this.fireViewStateApplying({
			view: view
		});

		// remove joints
		this.setJoints(undefined);

		this._customPositionedNodes.clear();

		this._resetNodesMaterialAndOpacityByCurrenView(view);
		this._resetTransitionHighlight(view);
		this._resetNodesStatusByCurrenView(view, true, true);
		this._highlightPlayer.reset(view, this._scene);

		this.fireViewStateApplied({
			view: view,
			ignoreAnimationPosition: ignoreAnimationPosition,
			notAnimateCameraChange: notAnimateCameraChange,
			playViewGroup: playViewGroup
		});

		vkCore.getEventBus().publish("sap.ui.vk", "viewStateApplied", {
			source: this,
			view: view,
			ignoreAnimationPosition: ignoreAnimationPosition,
			notAnimateCameraChange: notAnimateCameraChange,
			playViewGroup: playViewGroup
		});

		return this;
	};

	/**
	 * Set highlight display state.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setHighlightDisplayState
	 * @param {sap.ui.vk.HighlightDisplayState} state for playing highlight - playing, pausing, and stopped
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */
	ViewStateManager.prototype.setHighlightDisplayState = function(state) {

		if (state === HighlightDisplayState.playing) {
			this._highlightPlayer.start((new Date()).getTime());
		} else if (state === HighlightDisplayState.stopped) {
			this._highlightPlayer.stop();
		} else if (state === HighlightDisplayState.pausing) {
			this._highlightPlayer.pause((new Date()).getTime());
		}

		this.fireHighlightColorChanged({
			highlightColor: colorToCSSColor(abgrToColor(this._highlightColorABGR)),
			highlightColorABGR: this._highlightColorABGR
		});
		return this;
	};

	ViewStateManager.prototype._startHighlight = function() {

		this._highlightPlayer.start((new Date()).getTime());
		return this;
	};

	ViewStateManager.prototype._playHighlight = function() {

		return this._highlightPlayer.play((new Date()).getTime());
	};

	ViewStateManager.prototype._resetTransitionHighlight = function(view) {
		this._transitionHighlightPlayer.reset();
		this._transitionHighlightPlayer.fadeInNodes = [];
		this._transitionHighlightPlayer.fadeOutNodes = [];
		this._transitionHighlightPlayer.setViewStateManager(this);

		var nodeInfos = view.getNodeInfos();
		if (!nodeInfos) {
			return;
		}

		var getAllMeshNodes = function(nodes, meshNodes, nodesToExclude) {
			if (!nodes || !nodes.length) {
				return;
			}
			for (var i = 0;  i < nodes.length; i++) {
				var node = nodes[i];
				if (node.type === "Mesh" && (!nodesToExclude || (nodesToExclude && !nodesToExclude.includes(node)))) {
					meshNodes.push(node);
				}
				getAllMeshNodes(node.children, meshNodes, nodesToExclude);
			}
		};

		var fadeOutNodes = [];
		var fadeInNodes = [];

		var that = this;
		nodeInfos.forEach(function(info) {
			var node = info.target;

			var visible = node.layers.test(that._layers);

			if (visible && !info.visible) {
				fadeOutNodes.push(node);
			}

			if (!visible && info.visible) {
				fadeInNodes.push(node);
			}
		});

		getAllMeshNodes(fadeInNodes, this._transitionHighlightPlayer.fadeInNodes);
		getAllMeshNodes(fadeOutNodes, this._transitionHighlightPlayer.fadeOutNodes, this._transitionHighlightPlayer.fadeInNodes);
	};

	ViewStateManager.prototype._startTransitionHighlight = function(timeInterval) {
		var fadeInNodes = this._transitionHighlightPlayer.fadeInNodes;
		var fadeOutNodes = this._transitionHighlightPlayer.fadeOutNodes;

		if (fadeInNodes && fadeInNodes.length) {
			var fadeInHighlight = new Highlight("FadeIn", { duration: timeInterval / 500.0,
															opacities: [ 0.0, 1.0 ],
															cycles: 1 });
			this._transitionHighlightPlayer.addHighlights(fadeInHighlight, fadeInNodes);
		}

		if (fadeOutNodes && fadeOutNodes.length) {
			var fadeOutHighlight = new Highlight("FadeOut", { duration: timeInterval / 500.0,
															opacities: [ 1.0, 0.0 ],
															cycles: 1,
															fadeOut: true });
			this._transitionHighlightPlayer.addHighlights(fadeOutHighlight, fadeOutNodes);
		}

		if ((fadeInNodes && fadeInNodes.length) || (fadeOutNodes && fadeOutNodes.length)) {
			this._transitionHighlightPlayer.start((new Date()).getTime());
			this._transitionHighlightPlayer.play((new Date()).getTime());
			return timeInterval;
		} else {
			return 0;
		}

		return 0;
	};

	ViewStateManager.prototype._playTransitionHighlight = function() {

		return this._transitionHighlightPlayer.play((new Date()).getTime());
	};

	////////////////////////////////////////////////////////////////////////////
	// BEGIN: VisibilityTracker

	// Visibility Tracker is an object which keeps track of visibility changes.
	// These changes will be used in Viewport getViewInfo/setViewInfo
	VisibilityTracker = function() {
		// all visibility changes are saved in a Set. When a node changes visibility,
		// we add that id to the Set. When the visibility is changed back, we remove
		// the node reference from the set.
		this._visibilityChanges = new Set();
	};

	// It returns an object with all the relevant information about the node visibility
	// changes. In this case, we need to retrieve a list of all nodes that suffered changes
	// and an overall state against which the node visibility changes is applied.
	// For example: The overall visibility state is ALL VISIBLE and these 2 nodes changed state.
	VisibilityTracker.prototype.getInfo = function(nodeHierarchy) {
		// converting the collection of changed node references to ve ids
		var changedNodes = [];
		this._visibilityChanges.forEach(function(nodeRef) {
			// create node proxy based on dynamic node reference
			var nodeProxy = nodeHierarchy.createNodeProxy(nodeRef);
			var veId = nodeProxy.getVeId();
			// destroy the node proxy
			nodeHierarchy.destroyNodeProxy(nodeProxy);
			if (veId) {
				changedNodes.push(veId);
			} else {
				changedNodes.push(nodeHierarchy.getScene().nodeRefToPersistentId(nodeRef));
			}
		});

		return changedNodes;
	};

	// It clears all the node references from the _visibilityChanges set.
	// This action can be performed for example, when a step is activated or
	// when the nodes are either all visible or all not visible.
	VisibilityTracker.prototype.clear = function() {
		this._visibilityChanges.clear();
	};

	// If a node suffers a visibility change, we check if that node is already tracked.
	// If it is, we remove it from the list of changed nodes. If it isn't, we add it.
	VisibilityTracker.prototype.trackNodeRef = function(nodeRef) {
		if (this._visibilityChanges.has(nodeRef)) {
			this._visibilityChanges.delete(nodeRef);
		} else {
			this._visibilityChanges.add(nodeRef);
		}
	};

	// END: VisibilityTracker
	////////////////////////////////////////////////////////////////////////////

	ContentConnector.injectMethodsIntoClass(ViewStateManager);

	return ViewStateManager;
});
