/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/model/json/JSONModel",
		"sap/f/FlexibleColumnLayoutSemanticHelper",
		"sap/fe/core/CommonUtils",
		"sap/ui/core/Component"
	],
	function(ControllerExtension, JSONModel, FlexibleColumnLayoutSemanticHelper, CommonUtils, Component) {
		"use strict";

		// used across controller extension instances
		var oRouter,
			currentRouteName = "",
			currentArguments = {};

		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension} for Flexible control Layout
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.FlexibleColumnLayout
		 *
		 **/
		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.ContextManager", {
			oTargetsAggregation: {},
			mTargetsFromRoutePattern: {},

			/**
			 * check if the Flexible column Layout is enabled for the component
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.flexibleColumnLayout#isFclEnabled
			 * @memberof sap.fe.core.controllerextensions.flexibleColumnLayout
			 * @static
			 * @param {object} oAppComponent instance of the Appcomponent
			 * @returns {Boolean} true or false
			 *
			 * @sap-restricted
			 * @final
			 */
			isFclEnabled: function(oAppComponent) {
				if (oAppComponent) {
					return oAppComponent.getRouter().isA("sap.f.routing.Router");
				} else if (oRouter) {
					return oRouter.isA("sap.f.routing.Router");
				} else if (
					this.base !== undefined &&
					this.base
						.getView()
						.getController()
						.getOwnerComponent()
						.getRouter()
				) {
					return this.base
						.getView()
						.getController()
						.getOwnerComponent()
						.getRouter()
						.isA("sap.f.routing.Router");
				}
				return false;
			},

			/**
			 * Initialize the object oTargetsAggregation that defines for each route the relevant aggregation and pattern
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#initializeTargetAggregation
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @function
			 * @param {object} [oAppComponent] ref to the AppComponent
			 */
			initializeTargetAggregation: function(oAppComponent) {
				var oManifest = oAppComponent.getManifest();
				var oTargets = oManifest["sap.ui5"].routing.targets;
				var that = this;
				Object.keys(oTargets).forEach(function(sTargetName) {
					var oTarget = oTargets[sTargetName];
					if (oTarget.controlAggregation) {
						that.oTargetsAggregation[sTargetName] = {
							aggregation: oTarget.controlAggregation,
							pattern: oTarget.contextPattern
						};
					} else {
						that.oTargetsAggregation[sTargetName] = {
							aggregation: "page",
							pattern: null
						};
					}
				});
			},

			/**
			 * Initializes the mapping between a route (identifed as its pattern) and the corresponding targets
			 * @name sap.fe.controllerextensions.FlexibleColumnLayout#_initializeRoutesInformation
			 * @memberof sap.fe.controllerextensions.FlexibleColumnLayout
			 * @function
			 * @param {object} [oAppComponent] ref to the AppComponent
			 */

			_initializeRoutesInformation: function(oAppComponent) {
				var oManifest = oAppComponent.getManifest();
				var aRoutes = oManifest["sap.ui5"].routing.routes;
				var that = this;
				aRoutes.forEach(function(route) {
					that.mTargetsFromRoutePattern[route.pattern] = route.target;
				});
			},

			/**
			 * return the binding context as a string
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#buildBindingContext
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @function
			 * @param {string} [sPattern] string representation of the route pattern
			 * @param {array} [mParameters] array of parrameter to be replaced in the sPattern
			 * @returns {string} binding context
			 *
			 * @sap-restricted
			 */
			buildBindingContext: function(sPattern, mParameters) {
				if (sPattern.length === 0) {
					return "";
				}
				var sBindingContext = sPattern;
				var iFirstVarIndex = sPattern.indexOf("{");
				if (iFirstVarIndex != -1) {
					var iFirstVarEndIndex = sPattern.indexOf("}");
					var sFirstVarName = sPattern.substr(iFirstVarIndex + 1, iFirstVarEndIndex - iFirstVarIndex - 1);
					sBindingContext = sPattern.substr(0, iFirstVarIndex) + mParameters[sFirstVarName];
					sBindingContext += this.buildBindingContext(sPattern.substr(iFirstVarEndIndex + 1), mParameters);
				}
				return sBindingContext;
			},

			/**
			 * getter for oTargetsAggregation array
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#getTargetAggregation
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @function
			 * @returns {array} return the oTargetsAggregation array
			 *
			 * @sap-restricted
			 */
			getTargetAggregation: function() {
				return this.oTargetsAggregation;
			},

			/**
			 * initialize the FCL controller extention
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#initializeFcl
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @param {*} oAppComponent reference to the appComponent
			 * @param {*} oFcl reference to the FCL Component
			 */
			initializeFcl: function(oAppComponent, oFcl) {
				if (this.isFclEnabled(oAppComponent)) {
					this.oManifest = oAppComponent.getManifest();
					this.oFcl = oFcl;
					oRouter = oAppComponent.getRouter();
					this.oModel = new JSONModel();
					this.oNavigationHelper = oAppComponent.getNavigationHelper();
					oAppComponent.setModel(this.oModel, "fcl");
					this.oFcl.bindProperty("layout", "fcl>/layout");

					oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
					oRouter.attachRouteMatched(this.onRouteMatched, this);
					this.oFcl.attachStateChange(this.onStateChanged, this);
					this.oFcl.attachAfterEndColumnNavigate(this.onStateChanged, this);
					this.initializeTargetAggregation(oAppComponent);
					this._initializeRoutesInformation(oAppComponent);
				} else {
					oRouter = null;
				}
			},
			/**
			 * function triggered by the router RouteMatched event
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#onRouteMatched
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @param {*} oEvent referent to the event received
			 */
			onRouteMatched: function(oEvent) {
				var sRouteName = oEvent.getParameter("name");

				this._updateUIstateForEachviews();
				// Save the current/previous routes and arguments
				currentRouteName = sRouteName;
				currentArguments = oEvent.getParameter("arguments");
			},

			/**
			 * function triggered by the FCL StateChanged event
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#onStateChanged
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @param {*} oEvent referent to the event received
			 */
			onStateChanged: function(oEvent) {
				var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow");
				if (currentArguments !== undefined) {
					if (!currentArguments["query"]) {
						currentArguments["query"] = {};
					}
					currentArguments["query"].layout = oEvent.getParameter("layout");
				}
				this._updateUIstateForEachviews();

				// Replace the URL with the new layout if a navigation arrow was used
				if (bIsNavigationArrow) {
					//oRouter.navTo(currentRouteName, currentArguments, true);
					this.oNavigationHelper.navTo(currentRouteName, currentArguments);
				}
			},

			/**
			 *
			 */
			// beginColumn , midColumn, endColumn,
			_updateUIstateForEachviews: function() {
				var that = this;
				this._getAllCurrentViews().forEach(function(oView) {
					that._updateUIStateForView(oView);
				});
			},

			_updateUIStateForView: function(oView) {
				var oUIState = this.getHelper().getCurrentUIState();
				var oFclColName = ["beginColumn", "midColumn", "endColumn"];
				var FCLLevel = oView.getViewData().FCLLevel;

				var viewColumn = oFclColName[FCLLevel <= 2 ? FCLLevel : 2];
				if (!oView.getModel("fclhelper")) {
					oView.setModel(new JSONModel(), "fclhelper");
				}
				if (FCLLevel > 2) {
					oUIState.actionButtonsInfo.endColumn.exitFullScreen = null;
					oUIState.actionButtonsInfo.endColumn.closeColumn = null;
				}

				// Unfortunately, the FCLHelper doesn't provide actionButton values for the first column
				// so we have to add this info manually
				oUIState.actionButtonsInfo.beginColumn = { fullScreen: null, exitFullScreen: null, closeColumn: null };

				oView.getModel("fclhelper").setProperty("/actionButtonsInfo", Object.assign({}, oUIState.actionButtonsInfo[viewColumn]));
			},

			/**
			 * get all active views in FCL component
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#_getAllCurrentViews
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @returns {array} return views
			 *
			 * @sap-restricted
			 */

			_getAllCurrentViews: function() {
				var oViews = [];

				var oContainer;
				if ((oContainer = this.oFcl.getCurrentEndColumnPage()) !== undefined) {
					if (oContainer.isA("sap.ui.core.ComponentContainer")) {
						oViews.push(Component.get(oContainer.getComponent()).getRootControl());
					} else {
						oViews.push(oContainer);
					}
				}
				if ((oContainer = this.oFcl.getCurrentMidColumnPage()) !== undefined) {
					if (oContainer.isA("sap.ui.core.ComponentContainer")) {
						oViews.push(Component.get(oContainer.getComponent()).getRootControl());
					} else {
						oViews.push(oContainer);
					}
				}
				if ((oContainer = this.oFcl.getCurrentBeginColumnPage()) !== undefined) {
					if (oContainer.isA("sap.ui.core.ComponentContainer")) {
						oViews.push(Component.get(oContainer.getComponent()).getRootControl());
					} else {
						oViews.push(oContainer);
					}
				}
				return oViews;
			},

			/**
			 * return a referent to the AppComponent using the controlerExtention mechanisms (this.base)
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#_getOwnerComponent
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @returns {state} reference to the AppComponent
			 *
			 * @sap-restricted
			 */
			_getOwnerComponent: function() {
				return CommonUtils.getAppComponent(this.base.getView());
			},

			/**
			 * function triggered by the router BeforeRouteMatched event
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#onBeforeRouteMatched
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @param {*} oEvent referent to the event received
			 */
			onBeforeRouteMatched: function(oEvent) {
				var oQueryParams = oEvent.getParameters().arguments["?query"];
				var sLayout = oQueryParams ? oQueryParams.layout : null;

				// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
				if (!sLayout) {
					var oNextUIState = this.getHelper().getNextUIState(0);
					sLayout = oNextUIState.layout;
				}

				// Check if the layout if compatible with the number of targets
				// This should always be the case for normal navigation, just needed in case
				// the URL has been manually modified
				var aTargets = oEvent.getParameter("config").target;
				sLayout = this._correctLayoutForTargets(sLayout, aTargets);

				// Update the layout of the FlexibleColumnLayout
				if (sLayout) {
					this.oModel.setProperty("/layout", sLayout);
				}
			},

			/**
			 * Helper for the FCL Component
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#getHelper
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @returns {object} instance of a semantic helper
			 */
			getHelper: function() {
				var oParams = jQuery.sap.getUriParameters(),
					oSettings = {
						defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
						defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
						mode: oParams.get("mode"),
						initialColumnsCount: oParams.get("initial"),
						maxColumnsCount: oParams.get("max")
					};
				return FlexibleColumnLayoutSemanticHelper.getInstanceFor(this.oFcl, oSettings);
			},

			/**
			 * Triggers navigation when entering in fullscreen mode
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#handleFullScreen
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @param {*} oEvent Event sent to the function
			 *
			 * @sap-restricted
			 * @final
			 */
			handleFullScreen: function(oEvent) {
				var sNextLayout = oEvent
					.getSource()
					.getModel("fclhelper")
					.getProperty("/actionButtonsInfo/fullScreen");
				if (!currentArguments["query"]) {
					currentArguments["query"] = {};
				}
				currentArguments["query"].layout = sNextLayout;
				//oRouter.navTo(currentRouteName, currentArguments);
				this._getOwnerComponent()
					.getNavigationHelper()
					.navTo(currentRouteName, currentArguments);
			},

			/**
			 * Triggers navigation when exit from fullscreen mode
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#handleExitFullScreen
			 * @memberof sap.fe.core.controllerextensions.lexibleFlexibleColumnLayoutColumnLayout
			 * @param {*} oEvent Event sent to the function
			 *
			 * @sap-restricted
			 * @final
			 */
			handleExitFullScreen: function(oEvent) {
				var sNextLayout = oEvent
					.getSource()
					.getModel("fclhelper")
					.getProperty("/actionButtonsInfo/exitFullScreen");
				if (!currentArguments["query"]) {
					currentArguments["query"] = {};
				}
				currentArguments["query"].layout = sNextLayout;
				//oRouter.navTo(currentRouteName, currentArguments);
				this._getOwnerComponent()
					.getNavigationHelper()
					.navTo(currentRouteName, currentArguments);
			},

			/**
			 * Triggers navigation when closing a FCL column
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.FlexibleColumnLayout#handleClose
			 * @memberof sap.fe.core.controllerextensions.FlexibleColumnLayout
			 * @param {*} oEvent Event sent to the function
			 *
			 * @sap-restricted
			 * @final
			 */
			handleClose: function(oEvent) {
				var oContext = oEvent.getSource().getBindingContext();
				this.base.routing.navigateBackFromContext(oContext);
			},

			/**
			 * Updates the FCL level information for all views corresponding to an array of targets
			 *
			 * @function
			 * @name sap.fe.controllerextensions.FlexibleColumnLayout#updateFCLLevels
			 * @memberof sap.fe.controllerextensions.FlexibleColumnLayout
			 * @param {*} aTargetNames Array of target names
			 * @param {*} aContainers Array of corresponding view containers
			 */
			updateFCLLevels: function(aTargetNames, aContainers) {
				var oView;
				if (aTargetNames.length == 1 && this.getTargetAggregation()[aTargetNames[0]].aggregation === "endColumnPages") {
					// Only 1 view in the last column : FCLLevel forced to 3 (fullscreen)
					oView = aContainers[0].getComponentInstance().getRootControl();
					oView.getViewData().FCLLevel = 3;
					this._updateUIStateForView(oView);
				} else {
					for (var index = 0; index < aTargetNames.length; index++) {
						var sTargetName = aTargetNames[index];
						var oTargetConfiguration = this.getTargetAggregation()[sTargetName];
						oView = aContainers[index].getComponentInstance().getRootControl();

						switch (oTargetConfiguration.aggregation) {
							case "beginColumnPages":
								oView.getViewData().FCLLevel = 0;
								break;

							case "midColumnPages":
								oView.getViewData().FCLLevel = 1;
								break;

							default:
								oView.getViewData().FCLLevel = 2;
						}

						this._updateUIStateForView(oView);
					}
				}
			},

			/**
			 * Calculates the FCL layout for a given FCL level and a target hash
			 * @param {*} iNextFCLLevel
			 * @param {*} sHash
			 * @param {*} sProposedLayout (optional) proposed layout
			 */
			getFCLLayout: function(iNextFCLLevel, sHash, sProposedLayout) {
				// First, ask the FCL helper to calculate the layout in nothing is proposed
				if (!sProposedLayout) {
					sProposedLayout = this.getHelper().getNextUIState(iNextFCLLevel).layout;
				}

				// Then change this value if necessary, based on the number of targets
				var oRoute = oRouter.getRouteByHash(sHash + "?layout=" + sProposedLayout);
				var aTargets = this.mTargetsFromRoutePattern[oRoute.getPattern()];

				return this._correctLayoutForTargets(sProposedLayout, aTargets);
			},

			/**
			 * Checks whether a given FCL layout is compatible with an array of targets
			 *
			 * @param {*} sProposedLayout Proposed value for the FCL layout
			 * @param {*} aTargets Array of target names used for checking
			 * @returns the corrected layout
			 */
			_correctLayoutForTargets: function(sProposedLayout, aTargets) {
				var allAllowedLayouts = {
					"2": ["TwoColumnsMidExpanded", "TwoColumnsBeginExpanded", "MidColumnFullScreen"],
					"3": [
						"ThreeColumnsMidExpanded",
						"ThreeColumnsEndExpanded",
						"ThreeColumnsMidExpandedEndHidden",
						"ThreeColumnsBeginExpandedEndHidden",
						"MidColumnFullScreen",
						"EndColumnFullScreen"
					]
				};

				if (!aTargets) {
					// Defensive, just in case...
					return sProposedLayout;
				} else if (aTargets.length > 1) {
					// More than 1 target: just simply check from the allowed values
					var aLayouts = allAllowedLayouts[aTargets.length];
					if (aLayouts.indexOf(sProposedLayout) < 0) {
						// The proposed layout isn't compatible with the number of columns
						// --> Ask the helper for the default layout for the number of columns
						sProposedLayout = aLayouts[0]; //this.getHelper().getNextUIState(aTargets.length - 1).layout;
					}
				} else {
					// Only one target
					switch (this.getTargetAggregation()[aTargets[0]].aggregation) {
						case "beginColumnPages":
							sProposedLayout = "OneColumn";
							break;

						case "midColumnPages":
							sProposedLayout = "MidColumnFullScreen";
							break;

						default:
							sProposedLayout = "EndColumnFullScreen";
							break;
					}
				}

				return sProposedLayout;
			}
		});

		return Extension;
	}
);
