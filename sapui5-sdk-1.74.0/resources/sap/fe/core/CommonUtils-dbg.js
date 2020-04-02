/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/ui/core/mvc/View", "sap/ui/core/Component"], function(View, Component) {
	"use strict";

	function fnGetParentViewOfControl(oControl) {
		while (oControl && !(oControl instanceof View)) {
			oControl = oControl.getParent();
		}
		return oControl;
	}

	function fnHasTransientContexts(oListBinding) {
		var bHasTransientContexts = false;
		oListBinding.getCurrentContexts().forEach(function(oContext) {
			if (oContext && oContext.isTransient()) {
				bHasTransientContexts = true;
			}
		});
		return bHasTransientContexts;
	}

	function fnGetContextForSideFfects(oContext) {
		var aBindings = oContext.getBinding().getDependentBindings();
		return (aBindings && aBindings[0].isPatchWithoutSideEffects() && aBindings[0].getBoundContext()) || oContext;
	}

	function fnUpdateRelatedAppsDetails(oObjectPageLayout) {
		var oUshellContainer = sap.ushell && sap.ushell.Container;
		var oXApplNavigation = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");
		var oURLParsing = oUshellContainer && oUshellContainer.getService("URLParsing");
		var oParsedUrl = oURLParsing && oURLParsing.parseShellHash(document.location.hash);
		var sCurrentSemObj = oParsedUrl.semanticObject; // Current Semantic Object
		var sCurrentAction = oParsedUrl.action; // Current Action
		var oMetaModel = oObjectPageLayout.getModel().getMetaModel();
		var oBindingContext = oObjectPageLayout.getBindingContext();
		var oPath = oBindingContext && oBindingContext.getPath();
		var oMetaPath = oMetaModel.getMetaPath(oPath);
		// Semantic Key Vocabulary
		var sSemanticKeyVocabulary = oMetaPath + "/" + "@com.sap.vocabularies.Common.v1.SemanticKey";
		//Semantic Keys
		var aSemKeys = oMetaModel.getObject(sSemanticKeyVocabulary);
		// Unavailable Actions
		var aSemUnavailableActs = oMetaModel.getObject(
			oMetaPath + "/" + "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"
		);
		var oEntry = oBindingContext.getObject();
		var oParam = {};
		if (oEntry) {
			if (aSemKeys && aSemKeys.length > 0) {
				for (var j = 0; j < aSemKeys.length; j++) {
					var sSemKey = aSemKeys[j].$PropertyPath;
					if (!oParam[sSemKey]) {
						oParam[sSemKey] = [];
						oParam[sSemKey].push(oEntry[sSemKey]);
					}
				}
			} else {
				// fallback to Technical Keys if no Semantic Key is present
				var aTechnicalKeys = oMetaModel.getObject(oMetaPath + "/$Type/$Key");
				for (var key in aTechnicalKeys) {
					var sObjKey = aTechnicalKeys[key];
					if (!oParam[sObjKey]) {
						oParam[sObjKey] = [];
						oParam[sObjKey].push(oEntry[sObjKey]);
					}
				}
			}
		}

		var oLinksDeferred = oXApplNavigation.getLinks({
			semanticObject: sCurrentSemObj,
			params: oParam
		});

		oLinksDeferred.done(function(aLinks) {
			// Sorting the related app links alphabetically
			aLinks.sort(function(oLink1, oLink2) {
				if (oLink1.text < oLink2.text) {
					return -1;
				}
				if (oLink1.text > oLink2.text) {
					return 1;
				}
				return 0;
			});
			if (aLinks && aLinks.length > 0) {
				var aItems = [];
				//Skip same application from Related Apps
				for (var i = 0; i < aLinks.length; i++) {
					var oLink = aLinks[i];
					var sIntent = oLink.intent;
					var sAction = sIntent.split("-")[1].split("?")[0];
					if (
						sAction !== sCurrentAction &&
						(!aSemUnavailableActs || (aSemUnavailableActs && aSemUnavailableActs.indexOf(sAction) === -1))
					) {
						aItems.push({
							text: oLink.text,
							targetSemObject: sIntent.split("#")[1].split("-")[0],
							targetAction: sAction.split("~")[0],
							targetParams: oParam
						});
					}
				}
				// If no app in list, related apps button will be hidden
				oObjectPageLayout.getModel("relatedAppsModel").setProperty("/visibility", aItems.length > 0);
				oObjectPageLayout.getModel("relatedAppsModel").setProperty("/items", aItems);
			} else {
				oObjectPageLayout.getModel("relatedAppsModel").setProperty("/visibility", false);
			}
		});
	}

	function fnResolveStringtoBoolean(sValue) {
		if (sValue === "true" || sValue === true) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Retrieves the main component associated with a given control / view
	 * @param {sap.ui.base.ManagedObject} oControl a managed object
	 */
	function getAppComponent(oControl) {
		var oOwner = Component.getOwnerComponentFor(oControl);
		if (!oOwner) {
			return oControl;
		} else {
			return getAppComponent(oOwner);
		}
	}

	return {
		getParentViewOfControl: fnGetParentViewOfControl,
		hasTransientContext: fnHasTransientContexts,
		getContextForSideEffects: fnGetContextForSideFfects,
		updateRelatedAppsDetails: fnUpdateRelatedAppsDetails,
		resolveStringtoBoolean: fnResolveStringtoBoolean,
		getAppComponent: getAppComponent
	};
});
