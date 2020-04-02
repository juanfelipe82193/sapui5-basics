/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * @namespace Provides utitlity functions for OPA tests
 * @name sap.ui.comp.qunit.personalization.test.Util
 * @author SAP SE
 * @version 1.74.0
 * @private
 * @since 1.30.0
 */
sap.ui.define([
	'sap/ui/base/Object',
	'sap/m/library'
], function(
	BaseObject,
	MLibrary
) {
	"use strict";

	var Util = BaseObject.extend("sap.ui.comp.qunit.personalization.opaTests.Util", /** @lends sap.ui.comp.qunit.personalization.opaTests.Util.prototype */
	{});

	Util.getRemoveButtonTooltipOf = function(sPanelType) {
		switch (sPanelType) {
			case sap.m.P13nPanelType.sort:
				return Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_REMOVE_SORT_TOOLTIP");
			case sap.m.P13nPanelType.filter:
				return Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_REMOVE_FILTER_TOOLTIP");
			case sap.m.P13nPanelType.group:
				return Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_REMOVE_GROUP_TOOLTIP");
			default:
				return "";
		}

	};

	Util.getNavigationItem = function(oNavigationControl, sPanelName) {
		if (!oNavigationControl || sPanelName === "") {
			return null;
		}
		var oNavigationItem = null;
		if (sap.ui.Device.system.phone) {
			oNavigationControl.getItems().some(function(oNavigationItem_) {
				if (oNavigationItem_.getTitle() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		} else {
			oNavigationControl.getButtons().some(function(oNavigationItem_) {
				if (oNavigationItem_.getText() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		}
		return oNavigationItem;
	};

	Util.getTextFromResourceBundle = function(sLibraryName, sTextKey) {
		var oCore = sap.ui.test.Opa5.getWindow().sap.ui.getCore();
		return oCore.getLibraryResourceBundle(sLibraryName).getText(sTextKey);
	};
	Util.getTextOfChartType = function(sChartType) {
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");
		return oBundle.getText("info/" + sChartType);
	};

	return Util;
}, /* bExport= */true);
