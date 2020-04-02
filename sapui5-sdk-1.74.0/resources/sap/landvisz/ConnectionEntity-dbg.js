/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.ConnectionEntity.
sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/internal/LinearRowField",
	"sap/ui/core/Control",
	"sap/ui/core/HTML",
	"sap/ui/core/Popup",
	"sap/ui/commons/Image",
	"sap/ui/commons/Label",
	"sap/ui/commons/layout/VerticalLayout",
	"sap/ui/ux3/ToolPopup",
	"./ConnectionEntityRenderer"
], function(
	landviszLibrary,
	LinearRowField,
	Control,
	HTML,
	Popup,
	Image,
	Label,
	VerticalLayout,
	ToolPopup,
	ConnectionEntityRenderer
) {
	"use strict";

	// shortcut for sap.ui.core.Popup.Dock
	var Dock = Popup.Dock;

	// shortcut for sap.landvisz.ConnectionType
	var ConnectionType = landviszLibrary.ConnectionType;

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	// shortcut for sap.landvisz.DependencyType
	var DependencyType = landviszLibrary.DependencyType;

	// shortcut for sap.landvisz.ViewType
	var ViewType = landviszLibrary.ViewType;

	/**
	 * Constructor for a new ConnectionEntity.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Connection Entity of Dependency view
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.ConnectionEntity
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ConnectionEntity = Control.extend("sap.landvisz.ConnectionEntity", /** @lends sap.landvisz.ConnectionEntity.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * id of connection Entity
			 */
			connectionId : {type : "string", group : "Data", defaultValue : null},

			/**
			 * size of connection Entity
			 */
			size : {type : "string", group : "Data", defaultValue : null},

			/**
			 * type of a connection Entity
			 */
			type : {type : "sap.landvisz.ConnectionType", group : "Identification", defaultValue : null},

			/**
			 * ID which links the entities
			 */
			linkId : {type : "string", group : "Data", defaultValue : null},

			/**
			 * link header data that is shared with in the entities
			 */
			linkedHeader : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip for dependency type icon
			 */
			dependencyTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * to show the overlay for highlightig
			 */
			showOverlay : {type : "boolean", group : "Data", defaultValue : true}
		},
		aggregations : {

			/**
			 * Linear row field renderer for connection Entity
			 */
			connectionData : {type : "sap.landvisz.internal.LinearRowField", multiple : true, singularName : "connectionData"}
		}
	}});

	ConnectionEntity.prototype.init = function() {

		this.viewType;
		this.top = 0;
		this.left = 0;
		this.width = 0;
		this.height = 90;

		this.innerTop = 0;
		this.innerLeft = 0;
		this.innerWidth = 0;
		this.innerHeight = 0;
		this.holdDisplay = false;
		this.initializationDone = false;
		//this.holdByClick = false;

		//	this.attachBrowserEvent("mouseenter", function(event) {
		//		alert("test");
		//	});

	};

	ConnectionEntity.prototype.initControls = function() {

		if (!this.oVLayoutRows)
			this.oVLayoutRows = new VerticalLayout(this
					.getId()
					+ "-ConnectionRowVLayout");
		if (!this.connectionLabel)
			this.connectionLabel = new Label(this.getId()
					+ "-connectionLabel");
		if (!this.connectionImage)
			this.connectionImage = new Image(this.getId()
					+ "-connectionImage");

		if (!this.oVLayoutCallout)
			this.oVLayoutCallout = new VerticalLayout(this
					.getId()
					+ "-calloutVLayout");

		if (!this.oVLayoutToolPopup)
			this.oVLayoutToolPopup = new VerticalLayout(this
					.getId()
					+ "-toolPopupVLayout");

		if (!this.calloutLabel)
			this.calloutLabel = new Label(this.getId()
					+ "-calloutLabel");
		if (!this.toolPopup) {
			this.toolPopup = new ToolPopup(this.getId() + "toolpopup");
			this.toolPopup.addContent(this.oVLayoutToolPopup);
		}


		if (this.getType() == ConnectionType.ProductSystem)
			this.oVLayoutToolPopup
					.addStyleClass("sapLandviszCalloutPS productSystemPopup");
		if (this.getType() == ConnectionType.TechnicalSystem)
			this.oVLayoutToolPopup
					.addStyleClass("sapLandviszCalloutPS technicalSystemPopup");
		if (this.getType() == ConnectionType.MobileSolution)
			this.oVLayoutToolPopup
					.addStyleClass("sapLandviszCalloutPS mobileSolutionPopup");
		this.toolPopup.addStyleClass("sapLandviszCalloutPS");


		if(this.getSize() == EntityCSSSize.Small)
			this.oVLayoutToolPopup.addStyleClass("sapLandviszCalloutRowFieldSmall");
		else
			this.oVLayoutToolPopup.addStyleClass("sapLandviszCalloutRowField");

	};

	ConnectionEntity.prototype.onclick = function(oEvent) {

		if (oEvent.target.id == this.getId() + "connectionRow")
			oEvent.srcControl.holdDisplay = !oEvent.srcControl.holdDisplay;
		else
			this.holdDisplay = !this.holdDisplay;
		if(this.holdDisplay){
			if (this.viewType == DependencyType.NETWORK_VIEW) {
				var id = jQuery(document.getElementById(this.getId() + "connectionRow"));
				this.toolPopup.setOpener(id);
				if (!this.toolPopup.isOpen()) {
					this.toolPopup.setPosition(Dock.CenterBottom,
							Dock.CenterTop, id, "-10 0", "fit");
					var popup = jQuery(document.getElementById(this.getId() + "toolpopup"));
					this.toolPopup.open();
				}
			}
			this.fireEvent("connectionMouseover");
		}
	}

	ConnectionEntity.prototype.onmouseenter = function(oEvent) {

		if (this.viewType == ViewType.SOLUTION_VIEW)
			oEvent.stopImmediatePropagation();
		else if (oEvent.target.id == this.getId() + "connectionRow") {
			var holdDisplayTrue = false;
			var thisElementHold = false;
			for(var i = 0 ; i < this.getParent().getConnectionEntities().length ; i++){
				if(this.getParent().getConnectionEntities()[i].holdDisplay == true){
					if(this.getParent().getConnectionEntities()[i].getId() == this.getId()){
						holdDisplayTrue = true;
						thisElementHold = true;
					}else{
						holdDisplayTrue = true;
					}
				}
			}
			if((!holdDisplayTrue) || (thisElementHold && holdDisplayTrue)){
				if (this.viewType == DependencyType.NETWORK_VIEW) {
				var id = jQuery(document.getElementById(this.getId() + "connectionRow"));
				this.toolPopup.setOpener(id);
				if (!this.toolPopup.isOpen()) {
					this.toolPopup.setPosition(Dock.CenterBottom,
							Dock.CenterTop, id, "-10 0", "fit");
					var popup = jQuery(document.getElementById(this.getId() + "toolpopup"));
					this.toolPopup.open();
				}
			}
		}
		if (this.getShowOverlay() == true && this.getLinkId() && ""!=this.getLinkId())
			this.fireEvent("connectionMouseover");
		}

	}
	ConnectionEntity.prototype.onmouseleave = function(oEvent) {

		if (this.viewType == ViewType.SOLUTION_VIEW)
			oEvent.stopImmediatePropagation();
		else {
			if (this.holdDisplay == false && this.toolPopup.isOpen()) {
				this.toolPopup.close();
				//			this.oControl.fireEvent("connectionHover");
			}
			if (this.getLinkId() && ""!=this.getLinkId())
			this.fireEvent("connectionMouseout");
			//		if (oEvent.srcElement.id != this.getId() + "connectionRow") {
			//			oEvent.srcControl = this;
			//			this.fireEvent("on" + oEvent.eventType, oEvent);
			//
			//		}
		}
	};

	ConnectionEntity.prototype.onAfterRendering = function() {

		var that = this;
		jQuery(document.getElementById(this.getId() + "connectionRow")).mouseleave(
				function(oEvent) {
					that.onmouseleave(oEvent);
				});

		jQuery(document.getElementById(this.getId() + "connectionRow")).mouseenter(
				function(oEvent) {
					that.onmouseenter(oEvent);
				});

	};

	return ConnectionEntity;

});
