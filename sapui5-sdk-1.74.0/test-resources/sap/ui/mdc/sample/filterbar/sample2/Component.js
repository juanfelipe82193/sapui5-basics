/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/UIComponent', "sap/ui/core/mvc/ViewType", 'sap/ui/fl/FakeLrepConnectorLocalStorage',  "sap/ui/model/odata/OperationMode", "sap/ui/model/odata/v4/ODataModel", 'sap/ui/core/mvc/View'
], function(jQuery, UIComponent, ViewType, FakeLrepConnectorLocalStorage, OperationMode, ODataModel, View) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.sample.filterbar.sample2.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {

			FakeLrepConnectorLocalStorage.enableFakeConnector();
			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function() {
			UIComponent.prototype.exit.apply(this, arguments);
			FakeLrepConnectorLocalStorage.disableFakeConnector();
		},
		createContent: function() {
			this._bCalled = true;
			return this.oView;
		},
		_addContent: function(oView) {
			this.oView = oView;
			if (this._bCalled) {
				this.setAggregation("rootControl", oView);
			}
		}
	});
});
