/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control ModelingStatus.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/Image",
	"./ModelingStatusRenderer"
], function(landviszLibrary, Control, Image, ModelingStatusRenderer) {
	"use strict";


	/**
	 * Constructor for a new internal/ModelingStatus.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Modeling Status of entity
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.ModelingStatus
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ModelingStatus = Control.extend("sap.landvisz.internal.ModelingStatus", /** @lends sap.landvisz.internal.ModelingStatus.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * status determines the state of the system namely correct, warning, error
			 */
			status : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Tooltip for status that determines the state of the system namely correct, warning, error
			 */
			statusTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * icon source for status
			 */
			stateIconSrc : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip for the icon
			 */
			stateIconTooltip : {type : "any", group : "Data", defaultValue : null}
		}
	}});

	ModelingStatus.prototype.init = function() {
		this.initializationDone = false;
		this._imgResourcePath = sap.ui.resource('sap.landvisz',
				'themes/base/img/status/')
		this._imgFolderPath;
		this.renderSize;
		if (!this.statusImage)
			this.statusImage = new Image(this.getId()
					+ "-CLVEntityStatusImage");
	};

	ModelingStatus.prototype.exit = function() {

		this.statusImage && this.statusImage.destroy();
	};

	ModelingStatus.prototype.initControls = function() {
		var oNavigationAreaID = this.getId();
		if (!this.statusImage)
			this.statusImage = new Image(oNavigationAreaID
					+ "-CLVEntityStatusImage");

		if (!this.stateImage)
			this.stateImage = new Image(oNavigationAreaID
					+ "-EntityStateImage");

		this.entityMaximized;
	};

	//ModelingStatus.prototype.onclick = function(oEvent) {
	//	this.fireEvent("statusSelected"); //private event used when option clicked
	//};

	return ModelingStatus;

});
