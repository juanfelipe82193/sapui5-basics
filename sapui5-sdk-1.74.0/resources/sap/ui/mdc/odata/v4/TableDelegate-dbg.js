/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/mdc/TableDelegate"
], function(TableDelegate) {
	"use strict";
	/**
	 * Helper class for sap.ui.mdc.Table.
	 * <h3><b>Note:</b></h3>
	 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.odata.v4.TableDelegate
	 */
	var ODataTableDelegate = Object.assign({}, TableDelegate);
	/**
	 * Fetches the relevant metadata for the table and returns property info array
	 *
	 * @param {Object} oTable - instance of the mdc Table
	 * @returns {Array} array of property info
	 */
	ODataTableDelegate.fetchProperties = function(oTable) {
		var oMetadataInfo = oTable.getDelegate().payload, aProperties = [], oPropertyInfo, oObj, sEntitySetPath, oModel, oMetaModel, oPropertyAnnotations;
		sEntitySetPath = "/" + oMetadataInfo.collectionName;
		oModel = oTable.getModel(oMetadataInfo.model);
		oMetaModel = oModel.getMetaModel();
		return Promise.all([
			oMetaModel.requestObject(sEntitySetPath + "/"), oMetaModel.requestObject(sEntitySetPath + "@")
		]).then(function(aResults) {
			var oEntityType = aResults[0], mEntitySetAnnotations = aResults[1];
			// TODO: Filter restrictions
			var aSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {};
			var aNonSortableProperties = (aSortRestrictions["NonSortableProperties"] || []).map(function(oCollection) {
				return oCollection["$PropertyPath"];
			});

			for ( var sKey in oEntityType) {
				oObj = oEntityType[sKey];
				if (oObj && oObj.$kind === "Property") {
					// TODO: Enhance with more properties as used in MetadataAnalyser and check if this should be made async
					oPropertyAnnotations = oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@");
					oPropertyInfo = {
						name: sKey,
						label: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"],
						description: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] && oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path,
						maxLength: oObj.$MaxLength,
						precision: oObj.$Precision,
						scale: oObj.$Scale,
						type: oObj.$Type,
						sortable: aNonSortableProperties.indexOf(sKey) == -1,
						filterable: true
					};
					aProperties.push(oPropertyInfo);
				}
			}
			return aProperties;
		});
	};

	/**
	 * Checks the binding of the table and rebinds it if required.
	 *
	 * @param {Object} oMDCTable The MDC table instance
	 * @param {Object} oRowBindingInfo The row binding info of the table
	 * @param {string} sSearchText The basic search text
	 */
	ODataTableDelegate.rebindTable = function(oMDCTable, oRowBindingInfo, sSearchText) {
		if (sSearchText) {
			// add basic search parameter as expected by v4.ODataListBinding
			oRowBindingInfo.parameters.$search = sSearchText;
		}
		TableDelegate.rebindTable(oMDCTable, oRowBindingInfo);
	};

	return ODataTableDelegate;
});