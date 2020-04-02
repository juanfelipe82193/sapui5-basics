/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control EntityAction.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/Image",
	"./EntityActionRenderer"
], function(landviszLibrary, Control, Image, EntityActionRenderer) {
	"use strict";


	/**
	 * Constructor for a new internal/EntityAction.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to specify entity actions
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.EntityAction
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var EntityAction = Control.extend("sap.landvisz.internal.EntityAction", /** @lends sap.landvisz.internal.EntityAction.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * Tooltip for the internal action
			 */
			actionTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Source of the icon
			 */
			iconSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

			/**
			 * rendering size of the control
			 */
			renderingSize : {type : "string", group : "Dimension", defaultValue : null}
		},
		events : {

			/**
			 * on click fire press
			 */
			press : {}
		}
	}});

	EntityAction.prototype.init = function() {
		this.initializationDone = false;
	};

	EntityAction.prototype.exit = function() {

		this.entityActionIcon && this.entityActionIcon.destroy();
		this.style = "";
		this.entityMaximized
	};

	EntityAction.prototype.initControls = function() {

		var oNavigationAreaID = this.getId();
		this.entityActionIcon && this.entityActionIcon.destroy();
		this.entityActionIcon = new Image(oNavigationAreaID
				+ "-CLVEntityActionImg");

	};

	EntityAction.prototype.press = function(oEvent) {
		this.fireSelect();
	};

	EntityAction.prototype.onclick = function(oEvent) {
		this.firePress();
	};

	return EntityAction;

});
