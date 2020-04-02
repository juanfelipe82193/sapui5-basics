/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([], function() {
	"use strict";

	/**
	 * Streaming protocol commands.
	 *
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.Totara.Command
	 * @private
	 */
	var Command = {
		addClientLog: "addClientLog",
		getAnnotation: "getAnnotation",
		getDynamicView: "getDynamicView",
		getGeometry: "getGeometry",
		getHighlightStyle: "getHighlightStyle",
		getImage: "getImage",
		getMaterial: "getMaterial",
		getMesh: "getMesh",
		getScene: "getScene",
		getSequence: "getSequence",
		getTrack: "getTrack",
		getTree: "getTree",
		getView: "getView",
		getViewGroups: "getViewGroups",
		notifyError: "notifyError",
		notifyFinishedTree: "notifyFinishedTree",
		notifyFinishedView: "notifyFinishedView",
		requestScene: "requestScene",
		setAnnotation: "setAnnotation",
		setCamera: "setCamera",
		setGeometry: "setGeometry",
		setHighlightStyle: "setHighlightStyle",
		setImage: "setImage",
		setMaterial: "setMaterial",
		setMesh: "setMesh",
		setScene: "setScene",
		setPlayback: "setPlayback",
		setSequence: "setSequence",
		setStreamingToken: "setStreamingToken",
		setTrack: "setTrack",
		setTree: "setTree",
		setTreeNode: "setTreeNode",
		setView: "setView",
		setViewGroup: "setViewGroup",
		setViewNode: "setViewNode",
		timestamp: "timestamp",
		performanceTiming: "performanceTiming"
	};

	return Command;
});
