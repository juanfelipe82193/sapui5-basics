sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function(AnnotationHelper) {
		"use strict";
		
	// formatter called at templating time to decide whether the 'Multiple views in Single Table' feature should be realized via a SegmentedButton or a Select.
	function useSegmentedButton(oManifestPart) {
		var iCount = 0;
		for (var i in oManifestPart) {
			if (oManifestPart.hasOwnProperty(i)) {
				++iCount;
				if (iCount > 3) {
					return false;
				}
			}
		}
		return true;
	}

	function useSegmentedButtonInOP(oFacet, oSections) {
		var oManifestPart = oSections && oSections["sections"] && oSections["sections"][sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(oFacet)];
		var oVariants = oManifestPart && oManifestPart.quickVariantSelection && oManifestPart.quickVariantSelection.variants;
		var iCount = 0;
		for (var i in oVariants) {
			if (oVariants.hasOwnProperty(i)) {
				++iCount;
				if (iCount > 3) {
					return false;
				}
			}
		}
		return true;
	}

	// Formatter called at templating time to create the runtime binding for the text on the items
	function getTextForItem(oInterface, oQuickVariantSelection, oItemDef) {
		// in case of multi entity sets, counts have to be shown by default
		var bDifferentEntitySets = false;
		var bShowCountsForDifferentEntitySets = false;
		if (oItemDef && oItemDef.entitySet) {
			bDifferentEntitySets = true;
		}
		if (bDifferentEntitySets) {
			bShowCountsForDifferentEntitySets = oQuickVariantSelection.showCounts === false ? false : true;
		}
		if (oQuickVariantSelection.showCounts || bShowCountsForDifferentEntitySets) {
			return "{path: '_templPriv>/listReport/multipleViews/items/" + oItemDef.key + "', formatter: '._templateFormatters.formatItemTextForMultipleView'}";
		}
		return AnnotationHelper.getIconTabFilterText(oInterface.getInterface(0), oItemDef);
	}
	getTextForItem.requiresIContext = true;

	function getTextForItemObjectPage(oInterface, oSections, oItemDef, oFacet, oTemp) {
		var oCurrentSection, oQuickVariantSelection;
		var sId = sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(oFacet);
		oCurrentSection = oSections[sId];
		oQuickVariantSelection = oCurrentSection && oCurrentSection.quickVariantSelection;
		if (oQuickVariantSelection && oQuickVariantSelection.showCounts){
			//return "{= ._templateFormatters.formatItemTextForMultipleView('" + sId + "', ${_templPriv>/objectPage/multipleViews/" + sId + "/items/" + oItemDef.key + "})}";
			return "{path: '_templPriv>/objectPage/multipleViews/" + sId + "/items/" + oItemDef.key + "', formatter: '._templateFormatters.formatItemTextForMultipleView'}";
		}
		return AnnotationHelper.getIconTabFilterText(oInterface, oItemDef, oTemp);
	}
	getTextForItemObjectPage.requiresIContext = true;

	function getVisibleForTableTabs(oTabItem) {
		return "{= ${_templPriv>/listReport/multipleViews/mode} !== 'multi' || ${_templPriv>/listReport/multipleViews/selectedKey} === '" + (oTabItem && oTabItem.key) + "' }";
	}

	function hasQuickVariantSelectionInObjectPageSection(oFacet, oSections) {
		var oSettings; // contains properties of sections in object page
		if (oSections && oSections.sections) {
			oSettings = oSections.sections[sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(oFacet)];
		}
		return (oSettings && oSettings.quickVariantSelection ? true : false);
	}

	function isCurrentSection(oItem, oFacet, oSections) {
		return (oSections[sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(oFacet)] === oItem) ? true : false;
	}

	function getSelectedKeyBinding(oFacet) {
		return "{_templPriv>/objectPage/multipleViews/" + sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(oFacet) + "/selectedKey}";
	}

	return {
		useSegmentedButton: useSegmentedButton,
		useSegmentedButtonInOP: useSegmentedButtonInOP,
		getTextForItem: getTextForItem,
		getVisibleForTableTabs: getVisibleForTableTabs,
		hasQuickVariantSelectionInObjectPageSection: hasQuickVariantSelectionInObjectPageSection,
		isCurrentSection: isCurrentSection,
		getTextForItemObjectPage: getTextForItemObjectPage,
		getSelectedKeyBinding: getSelectedKeyBinding
	};
}, /* bExport= */ true);