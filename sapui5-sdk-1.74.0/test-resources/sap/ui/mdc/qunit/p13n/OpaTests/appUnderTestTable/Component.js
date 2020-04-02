/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/core/sample/common/Component', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(CommonComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return CommonComponent.extend("AppUnderTestTable.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {
			CommonComponent.prototype.init.apply(this, arguments);
			FakeLrepConnectorLocalStorage.enableFakeConnector();
		}

	});
});
