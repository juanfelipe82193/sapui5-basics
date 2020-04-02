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
				aProperties.forEach(function(oProperty) {
					if (oProperty.maxConditions === -1) {
						oProperty.fieldHelp = "FVH_Multi";
					}
				});

				aProperties.some(function(oProperty) {
					if (oProperty.name === "ProductID") {
						oProperty.fieldHelp = "FVH02";
						return true;
					}
					return false;
				});

				var oBasicSearchProperty = {
						name: "$search",
						type: "sap.ui.model.odata.type.String",
						maxConditions: 1,
						visible: true
				};

				oBasicSearchProperty.baseType = FilterBarDelegate._getDataType(oBasicSearchProperty);

				aProperties.push(oBasicSearchProperty);

				fResolve(aProperties);
			});
		});
	};
	return ODataFilterBarTestHelper;
});