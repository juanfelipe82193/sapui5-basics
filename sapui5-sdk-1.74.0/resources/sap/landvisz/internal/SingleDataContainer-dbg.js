/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control SingleDataContainer.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/Image",
	"sap/ui/commons/Label",
	"./SingleDataContainerRenderer"
], function(landviszLibrary, Control, Image, Label, SingleDataContainerRenderer) {
	"use strict";


	/**
	 * Constructor for a new internal/SingleDataContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control that shows all the tabs separately for a better view
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.SingleDataContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SingleDataContainer = Control.extend("sap.landvisz.internal.SingleDataContainer", /** @lends sap.landvisz.internal.SingleDataContainer.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * header of the tab
			 */
			header : {type : "string", group : "Data", defaultValue : null},

			/**
			 * rendering size of the system
			 */
			renderingSize : {type : "string", group : "Dimension", defaultValue : null}
		},
		aggregations : {

			/**
			 * properties that are aggregated to the data container region of tabs
			 */
			properties : {type : "sap.ui.core.Control", multiple : true, singularName : "property"}
		},
		events : {

			/**
			 * called when Single view model is closed
			 */
			closed : {}
		}
	}});


	SingleDataContainer.prototype.init = function() {
		this.initializationDone = false;
		this.isModelOpen = false;
	};

	SingleDataContainer.prototype.exit = function() {
	};

	SingleDataContainer.prototype.initControls = function() {

		var oNavigationAreaID = this.getId();
		if (!this.headerLabel)
			this.headerLabel = new Label(oNavigationAreaID
					+ "-CLVHeaderLabel");
		if (!this.closeIcon)
			this.closeIcon = new Image(oNavigationAreaID
					+ "-CLVSMVClose");

	};

	/**
	 * returns true if show all option is open
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	SingleDataContainer.prototype.isOpen = function() {
		return this.isModelOpen;
	};

	SingleDataContainer.prototype.onclick = function(oEvent) {

		if (oEvent.target.id == "closeVM") {
			jQuery(oEvent.currentTarget).hide("slow");
			this.isModelOpen = false;
			this.fireClosed();

		} else {
			oEvent.stopImmediatePropagation();
		}
	};

	return SingleDataContainer;

});
