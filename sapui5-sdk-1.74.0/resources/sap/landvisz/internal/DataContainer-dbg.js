/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control DataContainer.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/commons/layout/VerticalLayout",
	"sap/ui/ux3/NavigationItem",
	"./DataContainerRenderer"
], function(
	landviszLibrary,
	Control,
	VerticalLayout,
	NavigationItem,
	DataContainerRenderer
) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;


	/**
	 * Constructor for a new internal/DataContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control that renders the data container section in a system
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.DataContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DataContainer = Control.extend("sap.landvisz.internal.DataContainer", /** @lends sap.landvisz.internal.DataContainer.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * Text of Navigation Header
			 */
			header : {type : "string", group : "Data", defaultValue : null},

			/**
			 * selected property of data header
			 */
			selected : {type : "boolean", group : "Identification", defaultValue : true},

			/**
			 * rendering size of the control
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : EntityCSSSize.Regular},

			/**
			 * type of landscape object
			 */
			type : {type : "sap.landvisz.LandscapeObject", group : "Identification", defaultValue : null}
		},
		aggregations : {

			/**
			 * test
			 */
			properties : {type : "sap.ui.core.Control", multiple : true, singularName : "property"}
		},
		events : {

			/**
			 * the action to be carried out on selection of a tab
			 */
			select : {}
		}
	}});

	DataContainer.prototype.init = function(){
	this.initializationDone = false;
	this.firstItem = false;
	this.lastItem = true;
	this.width;
	this.hasChangeEvent = false;
	this.visible = true;
	this.inDisplay = true;
	};

	DataContainer.prototype.exit = function() {
		this.navItem && this.navItem.destroy();
		this.oNavBar && this.navItem.destroy();
	};

	DataContainer.prototype.initControls = function() {

	var navigationItemHdrID = this.getId();
		if(!this.oVLayoutContainer)
		this.oVLayoutContainer = new VerticalLayout(navigationItemHdrID + "-CLVEntityVLayoutContainer");

	this.navItem && this.navItem.destroy();
	this.navItem = new NavigationItem(navigationItemHdrID + "-CLVItemHeader");

	};

	DataContainer.prototype.select = function(oEvent) {
		alert('selected');
	};

	DataContainer.prototype.onclick = function(oEvent) {
	 this.fireEvent("itemsChanged"); //private event used in DropdownBox
	};


	DataContainer.prototype.onsapenter = function(oEvent) {
		this.fireEvent("itemsChanged");
	};

	return DataContainer;

});
