/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/landvisz/library",
	"sap/ui/core/CustomData",
	"sap/ui/commons/Menu",
	"sap/ui/commons/MenuItem",
], function(landviszLibrary, CustomData, Menu, MenuItem) {
	"use strict";

	// shortcut for sap.landvisz.ActionType
	var ActionType = landviszLibrary.ActionType;

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	/**
	 * ActionBar renderer.
	 * @namespace
	 */
	var ActionBarRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager that can be used for writing to the render
	 *            output buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ActionBarRenderer.render = function(oRm, oControl) {
		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;
			var renderSize = oControl.getRenderingSize();
			var topParentCSS;
			var sizeCSS = "sapLandviszActionText";
			var iconCSS = "sapLandviszActionIcon";
			var alignCSS = "sapLandviszActionAlign";
	//				oRm.addClass(alignCSS);
	//				oRm.writeClasses();

			if (renderSize == EntityCSSSize.Small) {
				topParentCSS = "sapLandviszActionAlignSmall";
			}
			else if (renderSize == EntityCSSSize.RegularSmall) {
				topParentCSS = "sapLandviszActionAlignRegularSmall";
			}
			else if (renderSize == EntityCSSSize.Regular) {
				topParentCSS = "sapLandviszActionAlignRegular";
			}

			oRm.write("<div");
			oRm.writeControlData(oControl);

			oRm.addClass(alignCSS);
			oRm.addClass(topParentCSS);
			if(oControl.getEnable()){
				oRm.addClass("enable");
				oRm.writeAttributeEscaped("tabIndex","0");
			}else{
				oRm.addClass("disable");
				oRm.writeAttributeEscaped("tabIndex","-1");
			}

			if (oControl.getActionType() == ActionType.MENU) {
				oRm.write(" style='");
				oRm.write("border:0px;");
				oRm.write("padding : 0px;");
				oRm.write("'");
				oRm.addClass("sapLandviszActionIndex");
			}
			oRm.writeClasses();
			oRm.write(">");

			if (oControl.getActionType() == ActionType.NORMAL) {
				oRm.write("<div style='padding:0 2px'");
				oRm.writeAttributeEscaped("id",oControl.getId() + "Action");
				oRm.writeAttributeEscaped("title",oControl.getActionTooltip());
				oRm.write(">");

				var src = oControl.getIconSrc();
				if (src && src != ""){
					oControl.customActionIcon.setSrc(oControl.getIconSrc());
					oControl.customActionIcon.addStyleClass(iconCSS);
					oRm.renderControl(oControl.customActionIcon);
				}
				oRm.write("<div");
				oRm.writeAttributeEscaped("id",oControl.getId() + "Action_text");
				oRm.addClass(sizeCSS);
				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(oControl.getActionLabel());
				oRm.write("</div>");

				oRm.write("</div>");

				//put disable overlay
				if(!oControl.getEnable()){
					oRm.write("<div");
					oRm.writeAttributeEscaped("id",oControl.getId() + "Action_Disable");
					oRm.addClass("sapLandviszActionDisable");
					oRm.writeClasses();
					oRm.write("/>");
				}
			}else if (oControl.getActionType() == ActionType.MENU) {
				this._renderSubMenu(oRm, oControl);

				if (renderSize == EntityCSSSize.Small) {
					oControl.menuButton.addStyleClass("sapLandviszSmallSizeMenuItem");
					oControl.menuButton.removeStyleClass("sapLandviszMenuItem");
					oControl.menuButton.setHeight("20px")
				} else if (renderSize == EntityCSSSize.Regular
						|| renderSize == EntityCSSSize.Medium
						|| renderSize == EntityCSSSize.Large
						|| renderSize == EntityCSSSize.RegularSmall) {
					oControl.menuButton.addStyleClass("sapLandviszMenuItem");
					oControl.menuButton.removeStyleClass("sapLandviszSmallSizeMenuItem");
					oControl.menuButton.setHeight("28px");
				}
				oControl.menuButton.setEnabled(oControl.getEnable());
				oControl.menuButton.setText(oControl.getActionLabel());
				oControl.menuButton.setTooltip(oControl.getActionTooltip());
				oRm.renderControl(oControl.menuButton);
			}
			oRm.write("</div>");
		}
	};

	ActionBarRenderer._renderSubMenu = function(oRm, oControl) {

		var menus = oControl.getMenuData();

		var oMainMenu = new Menu();
		oMainMenu.attachItemSelect(function(oEvent) {
			oControl.selectedItem = oEvent.mParameters.item;
			if(oControl.getChangeView() == false)
				oControl.$().click();
			else
				oControl.fireEvent("changeView");
		});

		oMainMenu.addStyleClass("sapLandviszMenuItem");
		oMainMenu.addStyleClass("sapLandviszMenuItemBorber");
		var subMenu;
		var menuItemObj = null;
		var menuItem = null;
		if (menus && menus.length > 0) {
			for ( var i = 0; i < menus.length; i++) {
				menuItemObj = menus[i];
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
				oMainMenu.addItem(menuItem);
				if (menuItemObj.subActions && menuItemObj.subActions.length > 0) {
					var subMenu = oControl._createMenu(menuItemObj.subActions)
					menuItem.setSubmenu(subMenu);
				}
			}
		}
		oControl.menuButton.setMenu(oMainMenu);
	};

	return ActionBarRenderer;

}, /* bExport = */ true);
