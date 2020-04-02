/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.internal.ActionBar.
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/Control",
	"sap/ui/core/CustomData",
	"sap/ui/commons/Image",
	"sap/ui/commons/MenuButton",
	"sap/ui/commons/Menu",
	"sap/ui/commons/MenuItem",
	"./ActionBarRenderer"
], function(
	landviszLibrary,
	Control,
	CustomData,
	Image,
	MenuButton,
	Menu,
	MenuItem,
	ActionBarRenderer
) {
	"use strict";

	// shortcut for sap.landvisz.ActionType
	var ActionType = landviszLibrary.ActionType;

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;


	/**
	 * Constructor for a new internal/ActionBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A control that render actions of a system
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.landvisz.internal.ActionBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ActionBar = Control.extend("sap.landvisz.internal.ActionBar", /** @lends sap.landvisz.internal.ActionBar.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * label for action
			 */
			actionLabel : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Property that determines the size of the entity rendered
			 */
			renderingSize : {type : "sap.landvisz.EntityCSSSize", group : "Dimension", defaultValue : EntityCSSSize.Regular},

			/**
			 * source for the icon rendered
			 */
			iconSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

			/**
			 * type of the action
			 */
			actionType : {type : "sap.landvisz.ActionType", group : "Data", defaultValue : ActionType.NORMAL},

			/**
			 * data of menu items and sub items
			 */
			menuData : {type : "object", group : "Data", defaultValue : null},

			/**
			 * Tooltip for the action
			 */
			actionTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * property to enable/disable actions
			 */
			enable : {type : "boolean", group : "Identification", defaultValue : true},

			/**
			 * new type of view is loaded while performing the action.
			 */
			changeView : {type : "boolean", group : "Identification", defaultValue : false}
		},
		aggregations : {

			/**
			 * aggregation for menu items
			 */
			menu : {type : "sap.ui.commons.Menu", multiple : true, singularName : "menu"}
		},
		events : {

			/**
			 * click on the action bar
			 */
			select : {}
		}
	}});


	ActionBar.prototype.init = function() {
		this.initializationDone = false;
		this.lastButton = false;
		this.selectedItem;
		this.systemId = "";
	};

	ActionBar.prototype.exit = function() {
		this.customAction && this.customAction.destroy();
		this.oActToolBar && this.oActToolBar.destroy();
		this.oToolBarBtn && this.oToolBarBtn.destroy();
	};

	ActionBar.prototype.initControls = function() {
		var customActionHdrID = this.getId();
		this.oToolBarBtn;
		this.oActToolBar;

		if (!this.customActionIcon && this.getIconSrc() && this.getIconSrc() != "")
			this.customActionIcon = new Image(customActionHdrID
					+ "-CLVCustomActionImg");
		if (!this.menuButton)
			this.menuButton = new MenuButton(customActionHdrID + '-'
					+ "MenuButton");
	};

	ActionBar.prototype.onclick = function(oEvent) {
		if (this.getEnable() == false)
			oEvent.preventDefault();
		else
			this.fireSelect();
	};



	/**
	 * Handles the sapenter event does not bubble
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ActionBar.prototype.onsapenter = function(oEvent) {
			if (this.getEnable() == false)
			oEvent.preventDefault();
		else
			this.fireSelect();
	};

	/**
	 * Handles the sapenter event does not bubble
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ActionBar.prototype.nsapenter = function(oEvent) {
		if (this.getEnable() == false)
			oEvent.preventDefault();
		else
			this.fireSelect();
	};

	ActionBar.prototype.getSelectedItem = function() {
		return this.selectedItem;
	};

	ActionBar.prototype.getSystemId = function() {
		return this.systemId;
	};

	ActionBar.prototype.setSelectedItemSubAction = function(subActions) {
		var menuData = this.getMenuData();
		var subMenu = this._addSubActions(menuData, subActions);
	};

	ActionBar.prototype._addSubActions = function(menuData,subMenu) {
		for ( var i = 0; i < menuData.length; i++) {
			if (this.selectedItem.getText() == menuData[i].text) {
				menuData[i].subActions = subMenu;
				return;
			}
	//		if (menuData[i].subActions && menuData[i].subActions.length > 0) {
	//			this._addSubActions(menuData[i].subActions, subMenu)
	//		}
		}
	};

	ActionBar.prototype._createMenu = function(menuSubAction) {
		var menuItem = null;
		var menuItemObj = null;
		var menu = new Menu();
		menu.addStyleClass("sapLandviszMenuItemBorber");
		for ( var i = 0; i < menuSubAction.length; i++) {
			menuItemObj = menuSubAction[i];
			menuItem = new MenuItem({
				text : menuItemObj.text,
				tooltip : menuItemObj.tooltip
			});
			if (menuItemObj.customdata) {
				var customData = new CustomData({
					key : menuItemObj.customdata,
				});

				menuItem.addCustomData(customData);
			}
			menu.addItem(menuItem);
			if (menuItemObj.subActions && menuItemObj.subActions.length > 0) {
				var subMenu = this._createMenu(menuItemObj.subActions)
				menuItem.setSubmenu(subMenu);
			}
		}

		return menu;
	};

	return ActionBar;

});