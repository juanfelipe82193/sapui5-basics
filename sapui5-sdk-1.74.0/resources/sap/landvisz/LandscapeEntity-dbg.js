/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control LandscapeEntity.
sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/EntityConstants",
	"sap/landvisz/internal/EntityAction",
	"sap/landvisz/internal/IdentificationBar",
	"sap/landvisz/internal/ModelingStatus",
	"sap/ui/core/Control",
	"sap/ui/core/Icon",
	"sap/ui/commons/Dialog",
	"sap/ui/commons/Image",
	"sap/ui/commons/Label",
	"sap/ui/commons/layout/HorizontalLayout",
	"sap/ui/commons/layout/VerticalLayout",
	"sap/ui/commons/TabStrip",
	"./LandscapeEntityRenderer"
], function(
	landviszLibrary,
	EntityConstants,
	EntityAction,
	IdentificationBar,
	ModelingStatusControl,
	Control,
	Icon,
	Dialog,
	Image,
	Label,
	HorizontalLayout,
	VerticalLayout,
	TabStrip,
	LandscapeEntityRenderer
) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	// shortcut for sap.landvisz.ModelingStatus
	var ModelingStatusEnum = landviszLibrary.ModelingStatus;


	/**
	 * Constructor for a new LandscapeEntity.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control to render the system
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.LandscapeEntity
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LandscapeEntity = Control.extend("sap.landvisz.LandscapeEntity", /** @lends sap.landvisz.LandscapeEntity.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * name of the system
			 */
			systemName : {type : "string", group : "Data", defaultValue : null},

			/**
			 * type of the system rendered
			 */
			type : {type : "sap.landvisz.LandscapeObject", group : "Data", defaultValue : null},

			/**
			 * text of qualifier icon
			 */
			qualifierText : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip for qualifier icon
			 */
			qualifierTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * text of the qualifier that specifies the server
			 */
			qualifierType : {type : "string", group : "Data", defaultValue : null},

			/**
			 * rendering size of a system
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : EntityCSSSize.Regular},

			/**
			 * default state of the system
			 */
			defaultState : {type : "string", group : "Data", defaultValue : null},

			/**
			 * description of the identification region
			 */
			description : {type : "string", group : "Data", defaultValue : null},

			/**
			 * actions of entity
			 */
			actions : {type : "object", group : "Data", defaultValue : null},

			/**
			 * Modeling status of the entity
			 */
			systemStatus : {type : "sap.landvisz.ModelingStatus", group : "Data", defaultValue : ModelingStatusEnum.NORMAL},

			/**
			 * tooltip for modelling status
			 */
			statusTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Width of the show all view
			 */
			explodeViewWidth : {type : "sap.ui.core.CSSSize", group : "Data", defaultValue : null},

			/**
			 * Height of the show all view
			 */
			explodeViewHeight : {type : "sap.ui.core.CSSSize", group : "Data", defaultValue : null},

			/**
			 * determines the visiblity of custom actions
			 */
			showCustomActions : {type : "boolean", group : "Identification", defaultValue : true},

			/**
			 * determines the visiblity of entityactions
			 */
			showEntityActions : {type : "boolean", group : "Data", defaultValue : true},

			/**
			 * System entity ID
			 */
			systemId : {type : "string", group : "Identification", defaultValue : null},

			/**
			 * Icon source of the state of entity
			 */
			stateIconSrc : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip of modelling status icon
			 */
			stateIconTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Type of a soution component/deployment type entity
			 */
			componentType : {type : "sap.landvisz.ComponentType", group : "Identification", defaultValue : null},

			/**
			 * Tooltip for component type
			 */
			componentTypeTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Systems count in the track
			 */
			trackSystemCount : {type : "string", group : "Misc", defaultValue : null}
		},
		aggregations : {

			/**
			 * aggregations for data container
			 */
			dataContainers : {type : "sap.landvisz.internal.DataContainer", multiple : true, singularName : "dataContainer"},

			/**
			 * aggregation on action bar control
			 */
			actionBar : {type : "sap.landvisz.internal.ActionBar", multiple : true, singularName : "actionBar"},

			/**
			 * Modeling status icon
			 */
			entityStatus : {type : "sap.ui.commons.Image", multiple : false}
		},
		events : {

			/**
			 * fires an event on hovering over identification system icon
			 */
			mouseOverIdenIcon : {},

			/**
			 * fires an event on clicking the modelling status
			 */
			statusSelect : {},

			/**
			 * Fired when info Icon of track entity clicked
			 */
			trackInfoPress : {}
		}
	}});

	LandscapeEntity.prototype.init = function() {
		this.initializationDone = false;
		this.top = 0;
		this.explodeViewClosed = true;
		this.left = 0;
		this.oHLayout = null;
		this.firstTime = true;
		var sCurrentTheme = sap.ui.getCore().getConfiguration().getTheme();
		this.internalEvent = false;
		this.showMax = true;
		this._imgResourcePath = sap.ui.resource('sap.landvisz',
				'themes/base/img/framework/');
		this._imgFolderPath = "16x16/";
		this.maxIconSrc = this._imgResourcePath + this._imgFolderPath
				+ "maximize_enable_dark.png";
		this.restoreIconSrc = this._imgResourcePath + this._imgFolderPath
				+ "restore_enable_dark.png";
		this.smvIconSrc = this._imgResourcePath + +this._imgFolderPath
				+ "openshowall_enable_dark.png";
		this.smvCollapseIconSrc = this._imgResourcePath + +this._imgFolderPath
				+ "closeshowall_enable_dark.png";

		this.entityAction;
		this.entityActionArray = new Array();

		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
		this.SHOW_ALL_TEXT = oBundle.getText("SHOW_ALL");
		this.COLLAPSE_TEXT = oBundle.getText("COLLAPSE_EXPLODE_VIEW");
		this.MAXIMIZE_TEXT = oBundle.getText("MAXIMIZE");
		this.RESTORE_TEXT = oBundle.getText("RESTORE");
		this.NEXT = oBundle.getText("NEXT");
		this.PREVIOUS = oBundle.getText("PREVIOUS");

		this.createActionButtons(this.SHOW_ALL_TEXT, "showAll", this.smvIconSrc);
		this.createActionButtons(this.COLLAPSE_TEXT, "collapseAll",
				this.smvCollapseIconSrc);
		this.createActionButtons(this.MAXIMIZE_TEXT, "max", this.maxIconSrc);
		this.createActionButtons(this.RESTORE_TEXT, "restore", this.restoreIconSrc);

		this.dialogArray = new Array();
		this.propertyArray = new Array();
		this.expVisible = false;
		this.showMiniNavigation = true;
		this.hasNavigationEvent = false;
		this.hasEntityEvent = false;
		this.containerEvent = false;
		this.maxEnabled = true;
		this.sViewWidth = 0;
		this.sViewHeight = 0;
		this.viewType = "";
		this.showOverlay = false;
		this.overlayFilter = "";
		this.oDialog = new Dialog({
			modal : false,
		});

		this.previousClicked = false;
		this.display = "block";
	};

	LandscapeEntity.prototype.exit = function() {
		this.oHLayout && this.oHLayout.destroy();
		this.oVLayout && this.oVLayout.destroy();
	};

	LandscapeEntity.prototype.createActionButtons = function(tooltip,
			id, iconURI) {
		var identificationHdrID = this.getId();
		this.entityAction = new EntityAction(
				identificationHdrID + id + "EntityAction");
		this.entityAction.setActionTooltip(tooltip);
		this.entityActionArray.push(this.entityAction);

	};

	/**
	 * Create the composite parts out of the current settings. Called by the
	 * renderer just before rendering
	 *
	 * @private
	 */
	LandscapeEntity.prototype.initControls = function() {

		var identificationHdrID = this.getId();

		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
		if (!this.oVLayout)
			this.oVLayout = new VerticalLayout(
					identificationHdrID + "-CLVEntityVLayout");
		if (!this.oVLayoutContainer)
			this.oVLayoutContainer = new VerticalLayout(
					identificationHdrID + "-CLVEntityVLayoutContainer");
		if (!this.oVLayoutProperties)
			this.oVLayoutProperties = new VerticalLayout(
					identificationHdrID + "-CLVEntityVLayoutProperties");
		if (!this.oHLayout)
			this.oHLayout = new HorizontalLayout(
					identificationHdrID + "CLVEntityHLayout");
		if (!this.oIdnBar)
			this.oIdnBar = new IdentificationBar(
					identificationHdrID + "-CLVEntityIdnRegion");
		if (!this.modelStatus)
			this.modelStatus = new ModelingStatusControl(
					identificationHdrID + "-CLVEntityModelingStatus");
		if (!this.propertyHeaders)
			this.propertyHeaders = new Array();
		this.selectedIndex = 0;
		this.dataContainer;
		this.headerBtn;
		this.navItem;
		this.isAggregated;
		if (!this.oHLayoutMiniNavigation)
			this.oHLayoutMiniNavigation = new HorizontalLayout(
					identificationHdrID + "CLVEntityMiniNavigationHLayout");

		if (!this.oHLayoutAction)
			this.oHLayoutAction = new HorizontalLayout(
					identificationHdrID + "CLVEntityActions");

		if (!this.oHLayoutAllAction)
			this.oHLayoutAllAction = new HorizontalLayout(
					identificationHdrID + "CLVEntityAllActions");

		this.smvContainer;
		this.containerWidth;
		this.oToolBarBtn;
		this.visibleTabCount = 0;

		// changes for tab renderer
		if (!this.entityHeader)
			this.entityHeader = new TabStrip(identificationHdrID
					+ "-CLVTabStrip");

		if (!this.oHeadersLayout)
			this.oHeadersLayout = new HorizontalLayout(
					identificationHdrID + "-CLVHeadersLayout");

		if (!this.previousIcon)
			this.nextIcon = new Image(identificationHdrID
					+ "-NextImage");
		if (!this.previousIcon)
			this.previousIcon = new Image(identificationHdrID
					+ "-PreviousImage");

		if (!this.oSingleHeaderLayout)
			this.oSingleHeaderLayout = new HorizontalLayout(
					identificationHdrID + "-oSingleHeaderLayout");
		if (!this.oSingleHeaderLabel)
			this.oSingleHeaderLabel = new Label(identificationHdrID
					+ "-oSingleHeaderLabel");

		if (!this.oVLayoutOverlay)
			this.oVLayoutOverlay = new VerticalLayout(
					identificationHdrID + "-vlayoutOverlay");
		this.nextEnabled = false;
		this.previousEnable = false;

		this.entityMaximized;

		var that = this;
						this.infoIcon = new Icon({src:"sap-icon://hint",
														  press: function(){
															  that.fireTrackInfoPress();
														  }
														}).addStyleClass('trackInfoIcon');

	};
	// LandscapeEntity.prototype.select = function(oEvent) {
	// this.fireSelect();
	// };

	LandscapeEntity.prototype.onclick = function(oEvent) {
		// if (EntityConstants.internalEvent == true) {
		//   EntityConstants.internalEvent = false;
		//   this.fireSelect();
		// }
		//
		if (oEvent.srcControl.getTooltip() == this.MAXIMIZE_TEXT)
			this.display = "none";
		else
			this.display = "block";
	};

	/**
	 * Rerendering handling
	 *
	 * @private
	 */
	LandscapeEntity.prototype.onAfterRendering = function() {

		setTimeout(function() {
			var smv = jQuery(document.getElementById("SMV"));
			var smvChild;
			if (smv && smv.length > 0) {
				for ( var i = 0; i < smv[0].children.length; i++) {
					// smv[0].children[i].show('slow');
					smvChild = jQuery(smv[0].children[i]);
					smvChild.show(700);

				}
			}
		}, 800);
		if (this.entityMaximized == true) {

		var mininavigationmaxWidth = this.containerWidth - 2;
		this.oHLayoutMiniNavigation.$()
					.css({
						width :  mininavigationmaxWidth,
					});

			var propHeight = this.sViewHeight - 32 - 41;
			var propWidth = this.sViewWidth - 33 - 100;
			this.$("CLVEntityVLayoutProperties")
					.css({
						height : propHeight,
						width : propWidth,
						"display" : this.display
					});
		}
		var layoutWidth = this.containerWidth;
		if (this.entityMaximized != true)
			layoutWidth = (layoutWidth * 12);
		var headerLayout = this.oHeadersLayout.$();

		headerLayout.css({
			width : layoutWidth,
		});

		var navigationTabs = this.oHeadersLayout.getContent();
		var navTab;
		var navTabHtml;
		if (navigationTabs && navigationTabs.length > 1) {

			for ( var i = 0; i < navigationTabs.length; i++) {
				navTab = navigationTabs[i];
				navTabHtml = navTab.$();
				if (navTab.inDisplay == true) {
					navTabHtml.show();
				} else
					navTabHtml.hide();
			}
		}

		var tabs = this.getDataContainers();
		var tab;
		var tabHtml;
		if (tabs && tabs.length > 1) {

			for ( var i = 0; i < tabs.length; i++) {
				tab = tabs[i];
				tabHtml = tab.$();
				if (tab.inDisplay == true) {
					tabHtml.show(700);
				} else
					tabHtml.hide(500);
			}
		}
		this.previousClicked = false;
	};

	return LandscapeEntity;

});
