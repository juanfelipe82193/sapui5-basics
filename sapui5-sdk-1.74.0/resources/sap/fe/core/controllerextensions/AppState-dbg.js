/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/HashChanger",
		"sap/fe/core/controllerextensions/AppState",
		"sap/fe/core/CommonUtils"
	],
	function(ControllerExtension, JSONModel, HashChanger, AppState, CommonUtils) {
		"use strict";

		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension} for AppState Handling
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.AppState
		 *
		 * @sap-restricted
		 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
		 * @since 1.54.0
		 */
		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.AppState", {
			/**
			 * initialize the app state handling
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.AppState#initializeAppState
			 * @memberof sap.fe.core.controllerextensions.AppState
			 * @static
			 * @param {sap.ui.core.Component} application component owning the routing
			 *
			 * @sap-restricted
			 * @final
			 */
			initializeAppState: function(oAppComponent) {
				var that = this;
				var oRouter = oAppComponent.getRouter();

				// create an app container in the singleton map
				var oAppContainer = (AppState.mAppContainer[oAppComponent.getId()] = {
					appStateModels: {}
				});

				/* as the cross app state is not yet defined and supported the crossappstate coding is kept but deactivated
				 oAppContainer.oCrossAppStatePromise = new jQuery.Deferred(); // Done when startup CrossAppState has been transferred into the model
				 sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(oAppComponent).done(function (oStartupCrossAppState) {
				 that._updateAppStateModel(oAppContainer.oAppStateModel, oStartupCrossAppState);
				 oAppContainer.oCrossAppStatePromise.resolve();
				 });
				 */

				oAppContainer.oInnerAppStatePromise = new jQuery.Deferred(); // Done when above and startup InnerAppState transferred into the model

				oRouter.attachRouteMatched(function(oEvent) {
					// the query name is static now but can be also a parameter in the future
					var mQueryParameters = oEvent.getParameters().arguments["?query"];
					var sAppStateKey = mQueryParameters && mQueryParameters["sap-iapp-state"];

					if (sAppStateKey) {
						// Route contains an appstate
						if (oAppContainer.oAppState && sAppStateKey === oAppContainer.oAppState.getKey()) {
							// the app state was set by the app
							oAppContainer.oInnerAppStatePromise.resolve();
							sAppStateKey = undefined;
						}

						if (sAppStateKey) {
							// we must apply the inner App State *after* treating CrossAppState (x-app-state)
							// oTemplateContract.oCrossAppStatePromise.done(function () { <- deactivated for now
							sap.ushell.Container.getService("CrossApplicationNavigation")
								.getAppState(oAppComponent, sAppStateKey)
								.done(function(oStartupInnerAppState) {
									oAppContainer.oAppState = oStartupInnerAppState;
									that._updateAppStateModels(oAppContainer, oStartupInnerAppState);
									oAppContainer.oInnerAppStatePromise.resolve();
								});
							//});
						}
					} else {
						// no inner appstate in this route
						oAppContainer.oInnerAppStatePromise.resolve();

						if (oAppContainer.oAppState) {
							// the app had an app state but navigated back to a route without appstate, we need to clean up the appstate
							oAppContainer.oAppState = null;
							that._updateAppStateModels(oAppContainer, null);
						}
					}
				});
			},

			/**
			 * cleans up the app state handling
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.AppState#cleanupAppState
			 * @memberof sap.fe.core.controllerextensions.AppState
			 * @static
			 * @param {sap.ui.core.Component} application component owning the routing
			 *
			 * @sap-restricted
			 * @final
			 */
			cleanupAppState: function(oAppComponent) {
				if (AppState.mAppContainer[oAppComponent.getId()]) {
					delete AppState.mAppContainer[oAppComponent.getId()];
				}
			},

			/**
			 * creates (if not yet done) a new app state model for a given ID and returns it
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.AppState#requestAppStateModel
			 * @memberof sap.fe.core.controllerextensions.AppState
			 * @static
			 * @param {string} Id of the appState model
			 * @returns {Promise} Promise which is resolved with the appState model once created and filled
			 *
			 * @sap-restricted
			 * @final
			 */

			requestAppStateModel: function(sId) {
				var that = this;
				var oAppContainer = this._getAppContainer(),
					oAppStateData;

				return oAppContainer.oInnerAppStatePromise.then(function() {
					if (!oAppContainer.appStateModels[sId]) {
						oAppContainer.appStateModels[sId] = new JSONModel(null, true);
						oAppContainer.appStateModels[sId].bindList("/").attachChange(that._updateAppState.bind(that, sId));
					}

					if (oAppContainer.oAppState) {
						oAppStateData = oAppContainer.oAppState.getData();
						if (oAppStateData && oAppStateData[sId]) {
							// appState already has data for this model so update it immediately
							oAppContainer.appStateModels[sId].setData(oAppStateData[sId]);
						}
					}

					return oAppContainer.appStateModels[sId];
				});
			},

			/* Private */
			_updateAppState: function(sId) {
				var oAppStateData = {};
				var oAppContainer = this._getAppContainer();
				var oNewData = oAppContainer.appStateModels[sId].getJSON();

				if (oAppContainer.oAppState) {
					oAppStateData = oAppContainer.oAppState.getData() || {};
				}

				if (oAppStateData && oAppStateData[sId] && oAppStateData[sId] === oNewData) {
					// there's no change so no need to update the appstate
					return;
				}

				oAppContainer.oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(
					this._getOwnerComponent()
				);
				var oHashChanger = this._getHashChanger();

				// for now we anyway have only the sap-iapp-state in the hash parameters so keep it simple - at a later point of
				// time we should provide an util to set/remove only specific parameters without touching the others
				var sCurrentHash = oHashChanger.getAppHash();
				var aParts = sCurrentHash.split("?");
				var sAppHash = aParts[0];
				sAppHash += "?sap-iapp-state=" + oAppContainer.oAppState.getKey();
				oHashChanger.replaceHash(sAppHash);

				oAppStateData[sId] = oNewData;
				oAppContainer.oAppState.setData(oAppStateData);
				return oAppContainer.oAppState.save();
			},

			_getHashChanger: function() {
				if (!this.oHashChanger) {
					this.oHashChanger = HashChanger.getInstance();
				}
				return this.oHashChanger;
			},

			_getOwnerComponent: function() {
				// this.base does not have the getOwnerComponent - as a workaround we get the view and again
				// the controller to access the owner component
				return CommonUtils.getAppComponent(this.base.getView());
			},

			_updateAppStateModels: function(oAppContainer, oAppState) {
				var oData = (oAppState && oAppState.getData()) || {};
				for (var p in oAppContainer.appStateModels) {
					if (oData && oData[p]) {
						oAppContainer.appStateModels[p].setData(oData[p]);
					} else {
						// clear the data for this appState model as there's currently no data available
						oAppContainer.appStateModels[p].setData(null);
					}
				}
			},

			_getAppContainer: function() {
				return AppState.mAppContainer[this._getOwnerComponent().getId()];
			}
		});

		// a Singleton map that contains an app container for each application component
		AppState.mAppContainer = {};

		return Extension;
	}
);
