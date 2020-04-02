/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control EntityCustomAction.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"./EntityCustomActionRenderer"
], function(landviszLibrary, Control, EntityCustomActionRenderer) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	/**
	 * Constructor for a new internal/EntityCustomAction.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to render custom actions of visualization control
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.EntityCustomAction
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var EntityCustomAction = Control.extend("sap.landvisz.internal.EntityCustomAction", /** @lends sap.landvisz.internal.EntityCustomAction.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * name of the custom action
			 */
			customAction : {type : "string", group : "Data", defaultValue : null},

			/**
			 * rendering size of the control
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : EntityCSSSize.Regular}
		},
		events : {

			/**
			 * click on the action bar
			 */
			select : {}
		}
	}});

	EntityCustomAction.prototype.init = function(){

	this.initializationDone = false;

	this.lastButton = false;

	};

	EntityCustomAction.prototype.exit = function() {

			this.customAction && this.customAction.destroy();

	};

	EntityCustomAction.prototype.initControls = function() {

	var customActionHdrID = this.getId();


	};


	EntityCustomAction.prototype.select = function(oEvent) {
		this.fireSelect();
	};

	EntityCustomAction.prototype.onclick = function(oEvent) {
		this.fireSelect();
	};

	return EntityCustomAction;

});
