/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control HeaderList.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"./HeaderListRenderer"
], function(landviszLibrary, Control, HeaderListRenderer) {
	"use strict";


	/**
	 * Constructor for a new internal/HeaderList.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to render headers of a control
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.HeaderList
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HeaderList = Control.extend("sap.landvisz.internal.HeaderList", /** @lends sap.landvisz.internal.HeaderList.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * ToolTip for headers
			 */
			headerTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Size of the headers
			 */
			entitySize : {type : "string", group : "Dimension", defaultValue : null},

			/**
			 * to select/deselect a header
			 */
			selected : {type : "boolean", group : "Identification", defaultValue : false},

			/**
			 * type of system
			 */
			type : {type : "sap.landvisz.LandscapeObject", group : "Identification", defaultValue : null}
		},
		events : {

			/**
			 * Event triggered when header is clicked
			 */
			press : {}
		}
	}});

	HeaderList.prototype.init = function() {

		this.initializationDone = false;
		this.lastBtn = true;
		this.onFocus = true;
		this.inDisplay = false;

	};

	HeaderList.prototype.exit = function() {

		this.customAction && this.customAction.destroy();
		this.oToolBarBtn && this.oToolBarBtn.destroy();
		this.oActToolBar && this.oActToolBar.destroy();

	};

	HeaderList.prototype.initControls = function() {
		this.oToolBarBtn;
		this.oActToolBar;
		this.oHLayoutBtn;
		this.parentContainer;
		this.headerWidth;
		this.btnEventController;

	};

	/**
	 * Rerendering handling
	 *
	 * @private
	 */

	HeaderList.prototype.press = function(oEvent) {
		this.firePress();
	};

	HeaderList.prototype.onclick = function(oEvent) {
		this.firePress();
	};

	/**
	 * Handles the sapenter event does not bubble
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	HeaderList.prototype.onsapenter = function(oEvent) {
		this.firePress();
	};

	return HeaderList;

});
