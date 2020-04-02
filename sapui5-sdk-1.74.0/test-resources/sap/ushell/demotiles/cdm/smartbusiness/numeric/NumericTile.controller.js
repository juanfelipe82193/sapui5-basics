sap.ui.define(["jquery.sap.global"], function(jQuery) {
	"use strict";
	sap.ui.controller("sap.ushell.demotiles.cdm.smartbusiness.numeric.NumericTile", {

		/* global ssuite */

		onInit: function () {
//			var oCdmConfig = ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(this.getOwnerComponent()) || {};
//			var tileProperties = oCdmConfig.tileProperties;
//			var additionalParams = oCdmConfig.additionalAppParameters;
//			var evalId = tileProperties.evaluationId;

//			if (oChip.preview) {
//				oChip.preview.setTargetUrl("#FioriApplication-createSBKPIEvaluationS4HANA");
//				oChip.preview.setPreviewTitle(chipBag.getText("title"));
//			}
		},

		onPress : function() {
			var oComponent = this.getView().getModel("component");
			// Disabling the update schedulers for the selected tile
			oComponent._localData = oComponent._localData || {};
			if (oComponent._localData.delayedUpdateCacheIdentifier){
				jQuery.sap.clearDelayedCall(oComponent._localData.delayedUpdateCacheIdentifier);
				oComponent._localData.delayedUpdateCacheIdentifier = null;
			}
			oComponent._localData.cacheRefreshRequired = true;
			var oCdmConfig = ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(oComponent) || {};
			var tileProperties = oCdmConfig.tileProperties;
			var additionalParams = oCdmConfig.additionalAppParameters;
			var sTargetUrl = oCdmConfig.navigation_target_url;
			// if additional parameters are configured send them also | except EvaluationId, CatalogId, ChipId and TileType
			// all properties are sent since this is reserved for sending the evaluation id to the drilldown application

			var urlParams = {EvaluationId : tileProperties.evaluationId};
			var addParamsForAppState = [];
			if (additionalParams && additionalParams instanceof Object) {
				jQuery.each(additionalParams, function(sProperty, sValue) {
					if (sProperty !== "EvaluationId" && sProperty !== "CatalogId" && sProperty !== "ChipId"
							&& sProperty !== "TileType") {
						urlParams[sProperty] = sValue;
						addParamsForAppState.push({PropertyName : sProperty, PropertyValue : sValue});
					}
				});
			}

			var oIntent = sap.ushell.Container.getService("URLParsing").parseShellHash(sTargetUrl);

//			var appStateKey = null;
//			if (chipBag.getProperty("isDataStoredAsAppState", null) == 'true') {
//				appStateKey = chipBag.getProperty("personalizationAppStateKey");
//				this.changeHashNavToOtherSSBApp(tileProperties.semanticObject, tileProperties.semanticAction, urlParams,
//						appStateKey);
//			} else {
				// create appstatepayload
			var appStatePayload = jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.fetchStartupParameters, this)(
						oComponent, urlParams, tileProperties);
				// Create empty app state and save the payload in that.
				var appNavSrv = sap.ushell && sap.ushell.Container
						&& sap.ushell.Container.getService("CrossApplicationNavigation");
				var appState = appNavSrv.createEmptyAppState(this.getView().getModel('component'));
				// If target applicaiton is ssb runtime pass data as iapp else xapp
				if (sTargetUrl.indexOf('analyzeSBKPIDetailsS4HANA') > -1) {
					// Add basic information to appstatepayload which we were placing in URL
					appStatePayload.EvaluationId = [tileProperties.evaluationId];
					appStatePayload.TileType = ['NT'];
					// check if chipId and CatalogId is stored as part of the tile properties - else send the required
					// tileconfiguration as part of the url
					var isSSBPersonalizedTile = !!tileProperties.isSSBPersonalizedTile;
					if (tileProperties.catalogId && tileProperties.instanceId && !isSSBPersonalizedTile) {
						appStatePayload.CatalogId = [tileProperties.catalogId];
						appStatePayload.ChipId = [tileProperties.instanceId];
					} else {
						var oTitle = ssuite.smartbusiness.tiles.lib.Util.prototype.getTitleSubtitle(oComponent);
						appStatePayload.TileConfig = [JSON.stringify({
							Title : oTitle.Title
						})];
					}
					// Add tile caching paramters from chip bag into appstate
					if (tileProperties.cacheMaxAge)
						appStatePayload.CacheMaxAge = tileProperties.cacheMaxAge;
					if (tileProperties.cacheMaxAgeUnit)
						appStatePayload.CacheMaxAgeUnit = tileProperties.cacheMaxAgeUnit;
					// Add additional params to appstate
					appStatePayload.AdditionalParameters = addParamsForAppState;
					// Flag to specify if URL parameters need to be considered (appstate tolerance user story)
					appStatePayload.IsURLParametersConsidered = true;
					if (!isSSBPersonalizedTile) {
						/**
						 * Dont pass OptionalFilters in appstate as SelectOptions if target app is SSB Runtime.
						 * If passed they would appear as facet filters in Runtime.
						 */
						delete appStatePayload.SelectOptions;
					}
					appState.setData(appStatePayload);
					appState.save().fail(function(errorMessage) {
						jQuery.sap.log.error("saving of application state failed" + errorMessage);
					});
					// TODO Parse sTargetUrl
					this.changeHashNavToOtherSSBApp(oIntent.semanticObject, oIntent.action, urlParams,
							appState.getKey());
				} else {
					// Just passing the standard data in xappstate for other apps
					appState.setData({
						selectionVariant : appStatePayload
					});
					appState.save().fail(function(errorMessage) {
						jQuery.sap.log.error("saving of application state failed" + errorMessage);
					});
					// TODO Parse sTargetUrl
					this.navToOtherSSBApp(oIntent.semanticObject, oIntent.action, urlParams, appState
							.getKey());
				}
//			}
		},

		/**
		 * forms the hash for navigation | hashParameters (string) includes EvaluationId, CatalogId, ChipId, TileType,
		 * personalized thresholds and tile specific additional parameters | filterContext (string) - in case of
		 * personalized Tile saved filters will be formed as context string - format is /dim1=val1/dim1=val2/dim2=val1
		 */
		navToOtherSSBApp : function(semanticObject, action, hashParameters, filterContext) {
			try {
				sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
					target : {
						semanticObject : semanticObject,
						action : action
					},
					params : hashParameters,
					appStateKey : filterContext
				});
			} catch (exception) {
				jQuery.sap.log.error("navToOtherSSBApp", "Navigation to external application failed - exception : "
						+ exception.message);
			}
		},

		/**
		 * combines all the hash parameters that needs to be sent to the target application separated by &
		 */
		formHashParameters : function(oParams) {
			var hashParameters = "";
			if (oParams) {
				jQuery.each(oParams, function(sProperty, sValue) {
					if (hashParameters)
						hashParameters = hashParameters + "&";
					hashParameters = hashParameters + encodeURIComponent(sProperty) + "=" + encodeURIComponent(sValue);
				});
			}
			return hashParameters;
		},

		/**
		 * forms the hash for navigation | hashParameters (string) includes EvaluationId, CatalogId, ChipId, TileType,
		 * personalized thresholds and tile specific additional parameters | filterContext (string) - in case of
		 * personalized Tile saved filters will be formed as context string - format is /dim1=val1/dim1=val2/dim2=val1
		 */
		changeHashNavToOtherSSBApp : function(semanticObject, action, params, appStateKey) {
			var hashParameters = this.formHashParameters(params);
			var filterContext = '/sap-iapp-state=' + appStateKey;
			try {
				var hash = "#";
				hash += semanticObject + "-" + action;
				if (hashParameters)
					hash += "?" + hashParameters;
				if (filterContext) {
					hash += "&" + filterContext;
				}
				if (!(sap.ui.core.routing)) {
					jQuery.sap.require("sap.ui.core.routing");
				}
				var hashChanger = new sap.ui.core.routing.HashChanger();
				hashChanger.setHash(hash);
			} catch (exception) {
				jQuery.sap.log.error("navToOtherSSBApp", "Navigation to external application failed - exception : "
						+ exception.message);
			}
		},

		timeStampRefresh : function(oEvent) {
			var oComponent = oEvent.getSource().getModel("component");
			if (oComponent._localData.delayedUpdateCacheIdentifier) {
				jQuery.sap.clearDelayedCall(oComponent._localData.delayedUpdateCacheIdentifier);
				oComponent._localData.delayedUpdateCacheIdentifier = null;
			}
			oComponent.updateCacheDataFromBackend(true);
		}

	});
});
