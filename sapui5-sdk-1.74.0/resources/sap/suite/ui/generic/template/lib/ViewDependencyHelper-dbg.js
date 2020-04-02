sap.ui.define(["sap/ui/base/Object", "sap/suite/ui/generic/template/js/AnnotationHelper", "sap/suite/ui/generic/template/lib/testableHelper", "sap/base/util/extend"],
		function(BaseObject, AnnotationHelper, testableHelper, extend) {
	"use strict";

	// Class for dealing with view dependencies
	function getMethods(oTemplateContract) {

		function setAllPagesDirty(aExcludeComponentIds){
			aExcludeComponentIds = aExcludeComponentIds || [];
			for (var sId in oTemplateContract.componentRegistry){
				if (aExcludeComponentIds.indexOf(sId) === -1){
					var oComponentRegistryEntry = oTemplateContract.componentRegistry[sId];
					oComponentRegistryEntry.oComponent.setIsRefreshRequired(true);
				}
			}
		}

		/*
		 * Sets parent page to dirty
		 * @param {Object} oComponent - the component which parent shall be set to dirty
		 * @param {String} sEntitySet - only this entity set is set to dirty
		 * @param {Integer} iLevel - Number of components to be set as dirty
		 */
		function setParentToDirty(oComponent, sEntitySet, iLevel) {
			var oParentRouteConfig, oParent, mComponentRegistry = oTemplateContract.componentRegistry;

			// find current view and search its parent
			var sMyId = oComponent.getId();
			var oComponentRegistryEntry = oTemplateContract.componentRegistry[sMyId];
			var oRouteConfig = oComponentRegistryEntry.routeConfig;
			if (oRouteConfig){
				if (oRouteConfig.viewLevel === 0) {
					return false;
				} else {
					for (var sComponentId in mComponentRegistry){
						if (sComponentId !== sMyId){
							oParentRouteConfig = mComponentRegistry[sComponentId].routeConfig;
							if (oParentRouteConfig && oParentRouteConfig.viewLevel === (oRouteConfig.viewLevel - 1) && (oRouteConfig.viewLevel === 1 || oParentRouteConfig.entitySet === oRouteConfig.parentEntitySet)) {
								oParent = mComponentRegistry[sComponentId].oComponent;
								setMeToDirty(oParent, sEntitySet);
								if (!iLevel || iLevel > 1) {
									var iSubLevel;
									iSubLevel = iLevel && iLevel - 1;
									setParentToDirty(oParent, undefined, iSubLevel);
								}
								// there could be more components with the same entity set on the parent level - not yet supported due to unique ID concept but will be replaced once we have the component hierarchy/
								break;
							}
						}
					}
				}
			}
		}


		/*
		 * Sets the specified page to dirty
		 * @param {Object} oComponent - the component that shall be set to dirty
		 * @param {String} sEntitySet - only this navigation property is set to dirty
		 */
		function setMeToDirty(oComponent, sEntitySet) {
			if (sEntitySet) {
				var oRegistryEntry = oTemplateContract.componentRegistry[oComponent.getId()];
				var mRefreshInfos = oRegistryEntry.mRefreshInfos;
				mRefreshInfos[sEntitySet] = true;
				if (oRegistryEntry.utils.isComponentActive()){
					oRegistryEntry.utils.refreshBinding();
				}
			} else if (oComponent.setIsRefreshRequired){
				oComponent.setIsRefreshRequired(true);
			}
		}


		/*
		 * get children - temporarily added, to be refactored
		 *
		 */
		function getChildren(oComponent) {
			var aChildren = [];
			var oRouteConfig = oTemplateContract.componentRegistry[oComponent.getId()].routeConfig;
			for (var sOtherComponentID in oTemplateContract.componentRegistry) {
				var oOtherRegistryEntry = oTemplateContract.componentRegistry[sOtherComponentID];
				var oOtherComponentRouteConfig = oOtherRegistryEntry.routeConfig;
				if (oRouteConfig.viewLevel + 1 === oOtherComponentRouteConfig.viewLevel
					&& oRouteConfig.entitySet === oOtherComponentRouteConfig.parentEntitySet) {
					aChildren.push(oOtherRegistryEntry.oComponent);
				}
			}
			return aChildren;
		}

		/*
		 * get successors - temporarily added, to be refactored
		 *
		 */
		function getSuccessors(oComponent) {
			var aSuccessors = [];
			var aChildren = getChildren(oComponent);
			for (var i = 0; i < aChildren.length; i++){
				aSuccessors = aSuccessors.concat(getSuccessors(aChildren[i]));
			}
			return aSuccessors.concat(aChildren);
		}

		/*
		 * Unbind all children components
		 * @param {Object} oComponent - the component which children should be unbinded
		 * @param {boolean} bAndMe - information whether the provided component itself is also affected
		 */
		function unbindChildren(oComponent, bAndMe) {
			var aSuccessors = getSuccessors(oComponent);
			if (bAndMe){
				aSuccessors.push(oComponent);
			}
			for (var i = 0; i < aSuccessors.length; i++) {
				oTemplateContract.componentRegistry[aSuccessors[i].getId()].utils.unbind();
			}
		}

		/*
		 * Sets the root page to dirty
		 *
		 */
		function setRootPageToDirty() {
			if (oTemplateContract.rootContainer){
				var oInstance = oTemplateContract.rootContainer.getComponentInstance();
				if (oInstance && typeof oInstance.setIsRefreshRequired === "function") {
						oInstance.setIsRefreshRequired(true);
				}
			}
		}

		// Expose selected private functions to unit tests
		/* eslint-disable */
		var setParentToDirty = testableHelper.testable(setParentToDirty, "setParentToDirty");
		/* eslint-enable */

		return {
			setAllPagesDirty: setAllPagesDirty,
			setParentToDirty: setParentToDirty,
			setMeToDirty: setMeToDirty,
			unbindChildren: unbindChildren,
			setRootPageToDirty: setRootPageToDirty
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.ViewDependencyHelper", {
		constructor: function(oTemplateContract) {
			extend(this, getMethods(oTemplateContract));
		}
	});
});
