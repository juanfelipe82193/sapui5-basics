/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the HighlightPlayer class.
sap.ui.define([
	"sap/ui/base/Object",
	"./thirdparty/three",
	"../HighlightDisplayState"
], function(
	BaseObject,
	threeJs,
	HighlightDisplayState
) {
	"use strict";

	/**
	 * Constructor for a new highlight player.
	 *
	 * @class Provides the player for highlight animations.
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.base.Object
	 * @alias sap.ui.vk.threejs.HighlightPlayer
	 * @experimental Since 1.67.0 This class is experimental and might be modified or removed in future versions.
	 */
	var HighlightPlayer = BaseObject.extend("sap.ui.vk.threejs.HighlightPlayer", /** @lends sap.ui.vk.three.HighlightPlayer.prototype */ {

		constructor: function() {
			this._state = HighlightDisplayState.stopped;
			this._startTime = 0;
			this._timeElapsed = 0;
			this._highlightsNodesMap = new Map();
		}
	});

	/*
	Reset player with highlights and associated nodes specified in a view
	*/
	HighlightPlayer.prototype.reset = function(view, scene) {
		this.stop();
		this._highlightsNodesMap.clear();
		this._state = HighlightDisplayState.stopped;
		if (view && scene) {
			var highlightIdNodesMap = view.getHighlightIdNodesMap();

			var that = this;
			highlightIdNodesMap.forEach(function(value, key) {
				var highlight = scene.getHighlight(key);
				that.addHighlights(highlight, value);
			});
		}

		return this;
	};

	HighlightPlayer.prototype.setViewStateManager = function(vsm) {
		this._viewStateManager = vsm;
	};

	HighlightPlayer.prototype.addHighlights = function(highlight, nodes) {

		if (!highlight || !nodes || !nodes.length) {
			return;
		}

		var getAllMeshNodes = function(nodes, meshNodes) {
			if (!nodes || !nodes.length) {
				return;
			}
			for (var i = 0;  i < nodes.length; i++) {
				var node = nodes[i];
				if (node.type === "Mesh") {
					meshNodes.push(node);
				}
				getAllMeshNodes(node.children, meshNodes);
			}
		};

		var meshes = [];
		getAllMeshNodes(nodes, meshes);
		if (meshes.length) {
			this._highlightsNodesMap.set(highlight, meshes);
		}
	};

	/*
	Start playing highlight
	*/
	HighlightPlayer.prototype.start = function(time){

		if (this._state === HighlightDisplayState.pausing) {
			this._startTime = time - this._timeElapsed;
		} else {
			this._startTime = time;
			this._timeElapsed = 0;
		}
		this._state = HighlightDisplayState.playing;
	};

	/*
	Play highlight, return true if highlight is not finished
	*/
	HighlightPlayer.prototype.play = function(time){
		if (this._state !== HighlightDisplayState.playing) {
			return false;
		}
		this._timeElapsed = time - this._startTime;

		var that = this;

		var isCompleted = true;
		var stillChanging = false;
		this._highlightsNodesMap.forEach(function(nodes, highlight) {
			var result = highlight.getColour(that._timeElapsed / 1000.0);
			var ni;
			if (result !== undefined) {
				for (ni = 0; ni < nodes.length; ni++) {

					if (!stillChanging && nodes[ni].userData.highlightingColor !== result.colour) {
						stillChanging = true;
					}
					nodes[ni].userData.highlightingColor = result.colour;
					nodes[ni]._vkUpdateMaterialColor();
				}

				if (!result.isCompleted) {
					isCompleted = false;
				}
			}

			result = highlight.getOpacity(that._timeElapsed / 1000.0);
			if (result !== undefined) {
				if (that._viewStateManager && result.opacity > 0 && highlight.isFadeOut()) {
					that._viewStateManager.setVisibilityState(nodes, true, false);
				}

				for (ni = 0; ni < nodes.length; ni++) {
					if (!stillChanging && nodes[ni].userData.opacity !== result.opacity) {
						stillChanging = true;
					}
					nodes[ni].userData.opacity = result.opacity;
					nodes[ni]._vkUpdateMaterialOpacity();
				}

				if (that._viewStateManager && result.opacity === undefined && highlight.getLastOpacity() < 0.000001 && highlight.isFadeOut()) {
					that._viewStateManager.setVisibilityState(nodes, false, false);
				}

				if (!result.isCompleted) {
					isCompleted = false;
				}
			}
		});

		if (isCompleted) {
			this._state = HighlightDisplayState.stopped;
		}

		return !isCompleted || stillChanging;
	};

	/*
	Play highlight
	*/
	HighlightPlayer.prototype.stop = function(time){

		this._timeElapsed = 0;
		this._startTime = 0;
		var that = this;
		this._highlightsNodesMap.forEach(function(nodes, highlight) {
			for (var ni = 0; ni < nodes.length; ni++) {
				delete nodes[ni].userData.highlightingColor;
				nodes[ni]._vkUpdateMaterialColor();
				delete nodes[ni].userData.opacity;
				nodes[ni]._vkUpdateMaterialOpacity();

				if (that._viewStateManager && highlight.isFadeOut()) {
					that._viewStateManager.setVisibilityState(nodes, false, false);
				}
			}
		});

		this._state = HighlightDisplayState.stopped;

		return this;
	};

	/*
	Play highlight
	*/
	HighlightPlayer.prototype.pause = function(time){
		if (this._state === HighlightDisplayState.stopped) {
			return this;
		}
		this._timeElapsed = time - this._startTime;

		this._state = HighlightDisplayState.pausing;

		return this;
	};

	return HighlightPlayer;
});
