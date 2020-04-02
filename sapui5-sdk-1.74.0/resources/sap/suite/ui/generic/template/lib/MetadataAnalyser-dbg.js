sap.ui.define(["sap/ui/base/Object",
   "sap/suite/ui/generic/template/lib/testableHelper",
   "sap/base/util/extend"
], function(BaseObject, testableHelper, extend){
	"use strict";

	// -----------------------------------------------------------------|| Class Information ||----------------------------------------------------------------------------------//
	//
	// This file is intended to do all the operations on Metadata of the application.
	// All the logic which extracts property from different entity set or parse Metadata to extract relevant information should be written here.
	//
	//																		||To Be Done||
	//
	// There are many function and code lines in ChangeHandlerUtils.js which perform operations, which are intended to perfrom via this library.
	// In future we must Refactor ChangeHandlerUtils.js and bring common logics here , so that we can centralize the operation of interaction with metadata in our framework.
	// Also, we should enhance this class and make it as a singleton class and it's object should be instantiated when the application intially starts.
	//
	// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

	var oMetaModel = null;

	function getMethods() {

		/**
		 * Retrieve the all the properties of the EntitySet. .
		 * @param: {string} Name of the EntitySet.
		 *
		 * @return: {array} Array of properties in the EntitySet
		 */
		function getPropertyOfEntitySet(sEntitySet) {
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
			return oEntityType.property ? Array.from(oEntityType.property) : [] ;
		}

		/**
		 * Extract properties of parameter EntitySet with other relevant informations.
		 * @param: {object} instance of controller which is active currently.
		 * @param: {string} Name of the EntitySet which has Parameter Entityset in association.
		 *
		 * @return: {object} Contains name of Parameter EntitySet, keys of Parameter EntitySet and Name of Navigation property.
		 */
		function getParametersByEntitySet(sEntitySet) {
			var oResult = {
				entitySetName: null,
				parameters: [],
				navPropertyName: null
			};
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
			var aNavigationProperties = oEntityType.navigationProperty;

			if (!aNavigationProperties){
				return oResult;
			}
			// filter the parameter entityset for extracting it's key and it's entityset name
			aNavigationProperties.filter(function (oNavProperty) {
				var oNavigationEntitySet = oMetaModel.getODataAssociationEnd(oEntityType, oNavProperty.name);
				var oNavigationEntityType = oMetaModel.getODataEntityType(oNavigationEntitySet.type);
				if (oNavigationEntityType["sap:semantics"] === "parameters" && oNavigationEntityType.key) {
					oResult.entitySetName = oMetaModel.getODataAssociationSetEnd(oEntityType, oNavProperty.name).entitySet;
					for (var i = 0; i < oNavigationEntityType.key.propertyRef.length; i++) {
						oResult.parameters.push(oNavigationEntityType.key.propertyRef[i].name);
					}
					var aSubNavigationProperties = oNavigationEntityType.navigationProperty;
					// Parameter entityset must have association back to main entityset.
					var bBackAssociationPresent = aSubNavigationProperties.some(function (oSubNavigationProperty) {
						var sSubNavigationEntityType = oMetaModel.getODataAssociationEnd(oNavigationEntityType, oSubNavigationProperty.name).type;
						sSubNavigationEntityType === oEntitySet.entityType ? oResult.navPropertyName = oSubNavigationProperty.name : Function.prototype();
						return oResult.navPropertyName;
					});

					return bBackAssociationPresent && oResult.navPropertyName && oResult.entitySetName;
				}
				return false;
			});
			return oResult;
		}
		return {
			getParametersByEntitySet: getParametersByEntitySet,
			getPropertyOfEntitySet: getPropertyOfEntitySet
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.MetaDataAnalyser", {
		constructor: function(oController) {
			var oComponent = oController.getOwnerComponent();
			oMetaModel = oComponent.getAppComponent().getModel().getMetaModel();
			extend(this, (testableHelper.testableStatic(getMethods, "MetaDataAnalyser"))(oController));
		}
	});

});
