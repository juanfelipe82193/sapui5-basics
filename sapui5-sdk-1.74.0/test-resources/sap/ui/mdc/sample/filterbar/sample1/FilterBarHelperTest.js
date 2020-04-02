/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the filterbar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/mdc/odata/v4/FilterBarDelegate"
], function(FilterBarDelegate) {
	"use strict";

	var ODataFilterBarTestHelper = Object.assign({}, FilterBarDelegate);

	ODataFilterBarTestHelper.fetchProperties = function(oFilterBar) {
		return new Promise(function(fResolve) {
			FilterBarDelegate.fetchProperties(oFilterBar).then(function(aProperties) {
				aProperties.some(function(oProperty) {
					if (oProperty.name === "SupplierID") {
						oProperty.fieldHelp = "FVH01";
						return true;
					}
					return false;
				});

				aProperties.some(function(oProperty) {
					if (oProperty.name === "ProductID") {
						oProperty.fieldHelp = "FVH02";
						return true;
					}
					return false;
				});

				aProperties.push({
					name: "$search",
					type: "Edm.String",  // TODO: maybe use type as indicator for searchfield
					filterExpression: "SingleValue",
					visible: true
				});

				fResolve(aProperties);
			});
		});
	};
	return ODataFilterBarTestHelper;
});