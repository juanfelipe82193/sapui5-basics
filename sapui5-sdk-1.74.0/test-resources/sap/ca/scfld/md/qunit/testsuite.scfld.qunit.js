sap.ui.define(function () {
	"use strict";

	return {
		name : "Test suite for Fiori sap.ca Scaffolding",
		defaults : {
			group : "Scaffolding",
			qunit : {
				version : 1
			},
			sinon : {
				version : 1
			},
			ui5 : {
				language : "en-US",
				rtl : false,
				"xx-waitForTheme" : true
			}
		},
		tests : {
			"app/BarOverflow" : {},
			"app/HeaderFooter" : {},
			"controller/ScfldMasterController" : {}
		}
	};
});
