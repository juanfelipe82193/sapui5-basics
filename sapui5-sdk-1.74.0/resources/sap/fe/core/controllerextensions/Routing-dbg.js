/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/mvc/ControllerExtension",
		"sap/m/MessagePage",
		"sap/m/Link",
		"sap/m/MessageBox",
		"sap/ui/core/routing/HashChanger",
		"sap/base/Log",
		"sap/fe/core/CommonUtils",
		"sap/ui/base/BindingParser",
		"sap/fe/core/BusyLocker"
	],
	function(
		Filter,
		FilterOperator,
		ControllerExtension,
		MessagePage,
		Link,
		MessageBox,
		HashChanger,
		Log,
		CommonUtils,
		BindingParser,
		BusyLocker
	) {
		"use strict";

		// used across controller extension instances
		var oUseContext,
			bDeferredContext,
			oAsyncContext,
			bTargetEditable,
			bPersistOPScroll,
			aOnAfterNavigation = [],
			sCurrentRoute,
			oLastFocusOnRoutes = {},
			sBindingTarget,
			bExitOnNavigateBackToRoot,
			aSemanticKeys = [],
			oEntityType,
			oDraft,
			fnNoOp = function() {
				Log.debug("target binding of custom page or re-use component: " + sBindingTarget);
			};

		var enumUIState = {
			CLEAN: 0,
			PROCESSED: 1,
			DIRTY: 2
		};

		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension} for routing and navigation
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.Routing
		 *
		 * @sap-restricted
		 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
		 * @since 1.54.0
		 */
		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.Routing", {
			/**
			 * Navigates to a context
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#navigateToContext
			 * @memberof sap.fe.core.controllerextensions.Routing
			 * @static
			 * @param {sap.ui.model.odata.v4.Context} context to be navigated to
			 * @param {map} [mParameters] Optional, can contain the following attributes:
			 * @param {boolean} [mParameters.noHistoryEntry] Navigate without creating a history entry
			 * @param {boolean} [mParameters.noHashChange] Navigate to the context without changing the URL
			 * @param {boolean} [mParameters.useCanonicalPath] Use canonical path
			 * @param {Promise} [mParameters.asyncContext] The context is created async, navigate to (...) and
			 *                    wait for Promise to be resolved and then navigate into the context
			 * @param {Boolean} [mParameters.deferredContext] The context shall be created deferred at the target page
			 * @param {Boolean} [mParameters.editable] The target page shall be immediately in the edit mode to avoid flickering
			 * @param {Boolean} [mParameters.bPersistOPScroll] The bPersistOPScroll will be used for scrolling to first tab
			 * @param {integer} [mParameters.updateFCLLevel] +1 if we add a column in FCL, -1 to remove a column, 0 to stay on the same column
			 * @param {boolean} [mParameters.useHash] For Semantic Bookmarking load the context without changing the hash when true
			 * @returns {Promise} Promise which is resolved once the navigation is triggered
			 *
			 * @sap-restricted
			 * @final
			 */

			navigateToContext: function(oContext, mParameters) {
				mParameters = mParameters || {};
				var oNavContainer = this._getOwnerComponent().getRootControl(),
					oViewData = this.getView().getViewData(),
					sPath,
					sTargetRoute,
					oParameters = null,
					oResourceBundle,
					oRouteDetail,
					that = this;

				if (mParameters.targetPath && oViewData.navigation) {
					oRouteDetail = oViewData.navigation[mParameters.targetPath].detail;
					sTargetRoute = oRouteDetail.route;

					if (oRouteDetail.parameters) {
						oParameters = this.prepareParameters(oRouteDetail.parameters, sTargetRoute, oContext);
					}
				}
				// store context
				if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding")) {
					if (mParameters.asyncContext) {
						// the context is either created async (Promise)
						mParameters.asyncContext.then(function(oContext) {
							// once the context is returned we navigate into it
							that.navigateToContext(oContext, {
								noHistoryEntry: true,
								noHashChange: mParameters.noHashChange,
								useCanonicalPath: mParameters.useCanonicalPath,
								editable: mParameters.editable,
								bPersistOPScroll: mParameters.bPersistOPScroll,
								updateFCLLevel: mParameters.updateFCLLevel
							});
						});

						// store async context context in singleton
						oAsyncContext = mParameters.asyncContext;
					} else if (mParameters.deferredContext) {
						bDeferredContext = true;
					} else {
						// Navigate to a list binding not yet supported
						throw "navigation to a list binding is not yet supported";
					}
				} else {
					if (oContext.getBinding() && oContext.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")) {
						if (CommonUtils.hasTransientContext(oContext.getBinding())) {
							oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

							MessageBox.show(oResourceBundle.getText("NAVIGATION_DISABLED_MESSAGE"), {
								icon: MessageBox.Icon.WARNING,
								title: oResourceBundle.getText("NAVIGATION_DISABLED_TITLE"),
								actions: [MessageBox.Action.CLOSE],
								details: oResourceBundle.getText("TRANSIENT_CONTEXT_DESCRIPTION"),
								contentWidth: "100px"
							});
							return;
						}
					}

					// Navigate to a context binding
					oUseContext = oContext;
				}

				bTargetEditable = mParameters.editable;
				bPersistOPScroll = mParameters.bPersistOPScroll;

				if (mParameters.noHashChange) {
					// there should be no URL change and therefore also no real navigation so just update the context
					this._bindTargetPage(oNavContainer.getCurrentPage(), null, null, true);
					return;
				}

				if (mParameters.useCanonicalPath) {
					sPath = oContext.getCanonicalPath();
				} else if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding") && oContext.isRelative()) {
					sPath = oContext.getHeaderContext().getPath();
				} else {
					sPath = oContext.getPath();
				}

				var oNavHelper = this._getOwnerComponent().getNavigationHelper();

				if (mParameters.updateFCLLevel === -1) {
					// When navigating back from a context, we need to remove the last component of the path
					var regex = new RegExp("/[^/]*$");
					sPath = sPath.replace(regex, "");

					//current context is wrong as we previously modify the sPath
					oUseContext = null;

					// If sPath is empty, we're supposed to navigate to the first page of the app
					// Check if we need to exit from the app instead
					if (sPath.length === 0 && bExitOnNavigateBackToRoot) {
						oNavHelper.exitFromApp();
						return;
					}
				}
				var sHash = HashChanger.getInstance().getHash();
				var oFcl = this._getOwnerComponent().getFcl();

				if (mParameters.asyncContext || mParameters.deferredContext) {
					// the context is deferred or async, we add (...) to the path
					sPath += "(...)";
				} else if (
					aSemanticKeys &&
					aSemanticKeys.length &&
					oDraft &&
					sHash.split("/").length === 1 &&
					sHash.indexOf("(...)") === -1 &&
					sPath !== "" &&
					!oFcl.isFclEnabled()
				) {
					var sEntitySet =
						(oContext && oContext.getPath().substring(0, oContext.getPath().indexOf("("))) ||
						sHash.substring(0, sHash.indexOf("("));
					var sTempPath = "";
					while (sEntitySet.indexOf("/") === 0) {
						sEntitySet = sEntitySet.substr(1);
					}
					if (oViewData.viewLevel === 0) {
						sTempPath = this._createHash(aSemanticKeys, sEntitySet, oContext);
					} else if (oViewData.viewLevel === 1 && sHash !== "") {
						//TODO: sHash != "" check should be removed once the issue of adding empty hash is resolved during creation
						if (mParameters.useHash) {
							sTempPath = sHash;
						} else if (oContext && oContext.getPath().split("/").length <= 2) {
							sTempPath = this._createHash(aSemanticKeys, sEntitySet, oContext);
						}
					}

					if (sTempPath !== "") {
						if (sHash === sTempPath) {
							this._bindTargetPage(oNavContainer.getCurrentPage(), null, null, true);
							return;
						} else if (sTempPath === undefined) {
							// Whenever the context does not contain the semantic key values it would return sTempPath as undefined
							// and we fallback to technical keys implementation unless its during cancel action
							if (mParameters.useHash) {
								// Sometimes during cancel the context might not contain the semantic key values, then we directly call bindTargetPage instead of falling back to technical keys
								this._bindTargetPage(oNavContainer.getCurrentPage(), null, null, true);
								return;
							}
						} else {
							sPath = sTempPath;
						}
					}
				}

				if (oFcl.isFclEnabled()) {
					var FCLLevel = oViewData.FCLLevel;
					if (mParameters.updateFCLLevel) {
						FCLLevel += mParameters.updateFCLLevel;
					}
					// Calculate the next layout based on the view level and path
					var sLayout;
					if (oRouteDetail && oRouteDetail.layout) {
						// A layout is specified in the manifest --> use it as a proposal
						sLayout = oFcl.getFCLLayout(FCLLevel, sPath, oRouteDetail.layout);
					} else {
						sLayout = oFcl.getFCLLayout(FCLLevel, sPath);
					}

					sPath += "?layout=" + sLayout;
				}

				// remove extra '/' at the beginning of path
				while (sPath.indexOf("/") === 0) {
					sPath = sPath.substr(1);
				}

				// TODO: what about the appState? Currently this one is just overwritten
				if (sTargetRoute && oParameters !== null) {
					this._getOwnerComponent()
						.getRouter()
						.navTo(sTargetRoute, oParameters);
				} else if (mParameters.transient && mParameters.editable == true) {
					sPath = sPath.indexOf("(...)") > -1 ? sPath : sPath + "?i-action=create"; // adding the hash query parameter
				}

				return oNavHelper.navToHash(sPath);
			},

			/**
			 * Will take a parameters map [k: string] : ComplexBindingSyntax
			 * and return a map where the binding syntax is resolved to the current model.
			 * Additionally, relative path are supported
			 *
			 * @param mParameters
			 * @param sTargetRoute
			 * @param oContext
			 * @returns {{}}
			 */
			prepareParameters: function(mParameters, sTargetRoute, oContext) {
				var oParameters;
				try {
					var sContextPath = oContext.getPath();
					var aContextPathParts = sContextPath.split("/");
					oParameters = Object.keys(mParameters).reduce(function(oReducer, sParameterKey) {
						var sParameterMappingExpression = mParameters[sParameterKey];
						// We assume the defined parameters will be compatible with a binding expression
						var oParsedExpression = BindingParser.complexParser(sParameterMappingExpression);
						var aParts = oParsedExpression.parts || [oParsedExpression];
						var aResolvedParameters = aParts.map(function(oPathPart) {
							var aRelativeParts = oPathPart.path.split("../");
							// We go up the current context path as many times as necessary
							var aLocalParts = aContextPathParts.slice(0, aContextPathParts.length - aRelativeParts.length + 1);
							aLocalParts.push(aRelativeParts[aRelativeParts.length - 1]);
							return oContext.getObject(aLocalParts.join("/"));
						});
						if (oParsedExpression.formatter) {
							oReducer[sParameterKey] = oParsedExpression.formatter.apply(this, aResolvedParameters);
						} else {
							oReducer[sParameterKey] = aResolvedParameters.join("");
						}
						return oReducer;
					}, {});
				} catch (error) {
					Log.error("Could not parse the parameters for the navigation to route " + sTargetRoute);
					oParameters = undefined;
				}
				return oParameters;
			},

			/**
			 * Navigates 1 "level before" a given context
			 * The target level is defined by removing the last segment from the context passed as parameter
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#navigateBackFromContext
			 * @memberof sap.fe.core.controllerextensions.Routing
			 *
			 * @param {*} oContext The context used as starting point
			 * @param {*} mParameters Same as in navigateToContext
			 * @returns {Promise} Promise which is resolved once the navigation is triggered
			 */

			navigateBackFromContext: function(oContext, mParameters) {
				mParameters = mParameters || {};
				mParameters.updateFCLLevel = -1;

				return this.navigateToContext(oContext, mParameters);
			},

			/**
			 * Navigates to a given context, which is supposed to be deeper than the current one
			 * In the case of an FCL layout, this means we shall add another column to the right for the navigation
			 * In the case of a fullscreen layout, the result is the same as navigateToContext
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#navigateForwardToContext
			 * @memberof sap.fe.core.controllerextensions.Routing
			 *
			 * @param {*} oContext The context to navigate to
			 * @param {*} mParameters Same as in navigateToContext
			 * @returns {Promise} Promise which is resolved once the navigation is triggered
			 */

			navigateForwardToContext: function(oContext, mParameters) {
				mParameters = mParameters || {};
				mParameters.updateFCLLevel = 1;

				return this.navigateToContext(oContext, mParameters);
			},

			/*
			 * Reset Breadcrumb links
			 *
			 * @function
			 * @param {sap.ui.model.odata.v4.Context} [oContext] context of parent control
			 * @param {array} [aLinks] array of breadcrumb links {sap.m.Link}
			 * @description Used when context of the objectpage changes.
			 *              This event callback is attached to modelContextChange
			 *              event of the Breadcrumb control to catch context change.
			 *              Then element binding and hrefs are updated for each Link.
			 *
			 * @sap-restricted
			 * @experimental
			 */
			setBreadcrumbLinks: function(oContext, aLinks) {
				if (aLinks.length && oContext !== null) {
					if (oContext === undefined && aLinks[0].getBindingContext() !== null) {
						// To stop the bindingcontext from parent to propagate to the links on change of parent's context
						aLinks.forEach(function(oLink) {
							oLink.setBindingContext(null);
						});
						return;
					} else if (oContext && oContext.getPath()) {
						var sNewPath = oContext.getPath();
						// Checking if links are already created
						var sLinkPath =
							aLinks[aLinks.length - 1].getElementBinding() && aLinks[aLinks.length - 1].getElementBinding().getPath();
						if (sLinkPath && sNewPath.indexOf(sLinkPath) > -1) {
							return;
						}

						var sAppSpecificHash = HashChanger.getInstance().hrefForAppSpecificHash("");
						var sPath = "",
							aPathParts = sNewPath.split("/");

						sAppSpecificHash = sAppSpecificHash.split("/")[0];
						aPathParts.shift();
						aPathParts.splice(-1, 1);
						for (var i = 0; i < aLinks.length; i++) {
							var oLink = aLinks[i];
							sPath = sPath + "/" + aPathParts[i];
							oLink.setHref(sAppSpecificHash + sPath);
							oLink.bindElement({
								path: sPath,
								parameters: {
									$$groupId: "$auto.associations" // GroupId might be changed in future
								}
							});
						}
					}
				}
			},

			/**
			 * Creates and navigates a message page to show an error
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#navigateToContext
			 * @memberof sap.fe.core.controllerextensions.Routing
			 * @static
			 * @param {string} errorMessage A human readable error message
			 * @param {map} [mParameters] Optional, can contain the following attributes:
			 * @param {sap.m.NavContainer} [mParameters.navContainer] Instance of a sap.m.NavContainer if not specified the method expects tha owner component of the view to be the navigation container
			 * @param {string} [mParameters.description] A human readable description of the error
			 * @param {string} [mParameters.technicalMessage] Technical Message
			 * @param {string} [mParameters.technicalDetails] Further technical details
			 * @returns {Promise} Promise which is resolved once the navigation is triggered (??? maybe only once finished?)
			 *
			 * @sap-restricted
			 * @final
			 */
			navigateToMessagePage: function(sErrorMessage, mParameters) {
				if (
					HashChanger.getInstance()
						.getHash()
						.indexOf("i-action=create") > -1
				) {
					var oAppComponent = this._getOwnerComponent();
					var sEntitySet = this.getEntitySet(oAppComponent);
					var sHash = sEntitySet + "(...)";
					var oNavHelper = this._getOwnerComponent().getNavigationHelper();
					oNavHelper.navToHash(sHash);
					return;
				}
				var oNavContainer = mParameters.navContainer || this._getOwnerComponent().getRootControl();

				if (!this.oMessagePage) {
					this.oMessagePage = new MessagePage({
						showHeader: false,
						icon: "sap-icon://message-error"
					});

					oNavContainer.addPage(this.oMessagePage);
				}

				this.oMessagePage.setText(sErrorMessage);

				if (mParameters.technicalMessage) {
					this.oMessagePage.setCustomDescription(
						new Link({
							text: mParameters.description || mParameters.technicalMessage,
							press: function() {
								MessageBox.show(mParameters.technicalMessage, {
									icon: MessageBox.Icon.ERROR,
									title: mParameters.title,
									actions: [MessageBox.Action.OK],
									defaultAction: MessageBox.Action.OK,
									details: mParameters.technicalDetails || "",
									contentWidth: "60%"
								});
							}
						})
					);
				} else {
					this.oMessagePage.setDescription(mParameters.description || "");
				}

				oNavContainer.to(this.oMessagePage);
			},

			/**
			 * This sets the UI state as dirty, meaning bindings have to be refreshed
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#setUIStateDirty
			 * @memberof sap.fe.core.controllerextensions.Routing
			 *
			 * @sap-restricted
			 * @final
			 */
			setUIStateDirty: function() {
				Extension.flagUIState = enumUIState.DIRTY;
			},

			/**
			 * This sets the UI state as processed, meaning is can be reset to clean after all bindings are refreshed
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#setUIStateProcessed
			 * @memberof sap.fe.core.controllerextensions.Routing
			 *
			 * @sap-restricted
			 * @final
			 */
			setUIStateProcessed: function() {
				Extension.flagUIState = enumUIState.PROCESSED;
			},

			/**
			 * Resets the UI state to the initial state
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#resetUIState
			 * @memberof sap.fe.core.controllerextensions.Routing
			 *
			 * @sap-restricted
			 * @final
			 */
			resetUIState: function() {
				Extension.flagUIState = enumUIState.CLEAN;
			},

			/**
			 * Returns true if the UI state is not clean, meaning bindings have to be refreshed
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#isUIStateDirty
			 * @memberof sap.fe.core.controllerextensions.Routing
			 *
			 * @sap-restricted
			 * @final
			 */

			isUIStateDirty: function() {
				return Extension.flagUIState !== enumUIState.CLEAN;
			},

			/**
			 * Cleans the UI state if it has been processed, i.e. bindings have been properly refreshed
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#cleanProcessedUIState
			 * @memberof sap.fe.core.controllerextensions.Routing
			 *
			 * @sap-restricted
			 * @final
			 */
			cleanProcessedUIState: function() {
				if (Extension.flagUIState === enumUIState.PROCESSED) {
					Extension.flagUIState = enumUIState.CLEAN;
				}
			},

			/**
			 * This initializes and extends the routing as well as the attaching to hash changes
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.Routing#initializeRouting
			 * @memberof sap.fe.core.controllerextensions.Routing
			 * @static
			 * @param {sap.ui.core.Component} application component owning the routing
			 *
			 * @sap-restricted
			 * @final
			 */
			initializeRouting: function(oAppComponent) {
				var that = this;
				return new Promise(function(resolve, reject) {
					var oRouter = oAppComponent.getRouter(),
						fnRouteMatched,
						sEntitySet = that.getEntitySet(oAppComponent),
						sPath,
						oComponentData = oAppComponent.getComponentData(),
						oStartUpParameters = oComponentData && oComponentData.startupParameters,
						oModel = oAppComponent.getModel(),
						bHasStartUpParameters = oStartUpParameters !== undefined && Object.keys(oStartUpParameters).length !== 0;

					var oNavContainer = oAppComponent.getRootControl();

					// as the controller extension and it's globals are used across apps we have to reset them
					oUseContext = null;
					bDeferredContext = false;
					oAsyncContext = null;
					bTargetEditable = false;
					bPersistOPScroll = null;
					aOnAfterNavigation = [];
					bExitOnNavigateBackToRoot = false;
					that.resetUIState();
					var aPromises = [];
					aPromises.push(oModel.getMetaModel().requestObject("/$EntityContainer/" + sEntitySet + "/"));
					aPromises.push(oModel.getMetaModel().requestObject("/$EntityContainer/" + sEntitySet + "/@"));
					aPromises.push(oModel.getMetaModel().requestObject("/$EntityContainer/" + sEntitySet + "@"));

					oRouter.attachBeforeRouteMatched(function() {
						// save last focus info on this page
						if (sCurrentRoute && sap.ui.getCore().getCurrentFocusedControlId()) {
							oLastFocusOnRoutes[sCurrentRoute] = {
								controlId: sap.ui.getCore().getCurrentFocusedControlId(),
								focusInfo: sap.ui
									.getCore()
									.byId(sap.ui.getCore().getCurrentFocusedControlId())
									.getFocusInfo()
							};
							if (oNavContainer && oNavContainer.getCurrentPage && oNavContainer.getCurrentPage()) {
								var oComponentInstance = oNavContainer.getCurrentPage().getComponentInstance();
								if (oComponentInstance && oComponentInstance.setFocusInformation) {
									oComponentInstance.setFocusInformation(oLastFocusOnRoutes[sCurrentRoute]);
								}
							}
						}
						BusyLocker.lock(oNavContainer);
					});

					fnRouteMatched = function(oEvent) {
						var mArguments = oEvent.getParameters().arguments,
							sTarget = "",
							sKey,
							bDeferred;

						// save the current page to match it with last focus info before navigating
						sCurrentRoute = oEvent.getParameter("name");

						that.fireOnAfterNavigation();

						var oNavContainer = oAppComponent.getRootControl();

						// if the root control is a NavContainer, it is set to busy when navigateToContext
						// handler to reset the busy state is attached once here

						BusyLocker.unlock(oNavContainer);

						if (Object.keys(mArguments).length > 0) {
							// get route pattern and remove query part
							var sTargetBindingPattern;
							if (
								oEvent.getParameter("view").getComponentInstance &&
								oEvent.getParameter("view").getComponentInstance() &&
								oEvent.getParameter("view").getComponentInstance().getBindingContextPattern
							) {
								sTargetBindingPattern = oEvent
									.getParameter("view")
									.getComponentInstance()
									.getBindingContextPattern();
							}
							sTarget = sTargetBindingPattern || oEvent.getParameters().config.pattern;
							// 	the query name is static now but can be also a parameter in the future
							sTarget = sTarget.replace(":?query:", "");

							for (var p in mArguments) {
								sKey = mArguments[p];
								if (sKey === "...") {
									bDeferred = true;
									// Sometimes in preferredMode = create, the edit button is shown in background when the
									// action parameter dialog shows up, setting bTargetEditable passes editable as true
									// to onBeforeBinding in _bindTargetPage function
									bTargetEditable = true;
								}
								sTarget = sTarget.replace("{" + p + "}", sKey);
							}
							// the binding target is always absolute
							if (sTarget && sTarget[0] !== "/") {
								sTarget = "/" + sTarget;
							}
						}
						var aTargets = oEvent.getParameter("config").target;
						if (oAppComponent.getFcl().isFclEnabled() && typeof aTargets === "object" && aTargets.length) {
							// Update FCL levels for each view
							oAppComponent.getFcl().updateFCLLevels(aTargets, oEvent.getParameter("views"));

							// We have more than one target
							aTargets.forEach(function(sTargetName, iIndex) {
								var oTargetConfiguration = oAppComponent.getFcl().getTargetAggregation()[sTargetName];
								if (oTargetConfiguration.pattern !== undefined) {
									sTarget = oAppComponent.getFcl().buildBindingContext(oTargetConfiguration.pattern, mArguments);
								}

								var oTargetContainer = oEvent.getParameter("views")[iIndex];

								if (oTargetContainer != null) {
									that._bindTargetPage(oTargetContainer, sTarget, bDeferred, false, true);
								} else {
									throw new Error(
										"No Container found for target " + sTargetName + "(Please check the Router configuration)"
									);
								}
							});
						} else {
							that._bindTargetPage(oNavContainer.getCurrentPage(), sTarget, bDeferred, false);
						}

						that.cleanProcessedUIState(); // Reset UI state only when all bindings have been refreshed

						//check if current hash has been set by getNavigationHelper().navToHash function
						if (history.state && history.state.feLevel !== undefined) {
							that.waitForRightMostViewReady(oEvent)
								.then(function(oView) {
									var oAppComponent = CommonUtils.getAppComponent(oView);
									var oNavHelper = oAppComponent.getNavigationHelper();
									var oData = { oView: oView, oAppComponent: oAppComponent };
									oNavHelper.computeTitleHierarchy(oData);
								})
								.catch(function() {
									Log.error("An error occurs while computing the title hierarchy");
								});
						} else {
							var _sHash = HashChanger.getInstance().getHash();
							HashChanger.getInstance().setHash("---");
							oAppComponent.getNavigationHelper().navToHash(_sHash);
						}
					};

					Promise.all(aPromises)
						.then(function(aValues) {
							oEntityType = aValues[0];
							var oAnnotations = aValues[1];
							oDraft =
								aValues[2]["@com.sap.vocabularies.Common.v1.DraftRoot"] ||
								aValues[2]["@com.sap.vocabularies.Common.v1.DraftNode"];
							var aTechnicalKeys = oEntityType["$Key"];
							aSemanticKeys = oAnnotations["@com.sap.vocabularies.Common.v1.SemanticKey"];
							if (bHasStartUpParameters) {
								if (
									oStartUpParameters.preferredMode &&
									oStartUpParameters.preferredMode[0] === "create" &&
									!HashChanger.getInstance().getHash()
								) {
									if (sEntitySet) {
										sPath = sEntitySet + "(...)";
									} else {
										Log.error("Cannot handle this App");
									}
									HashChanger.getInstance().replaceHash(sPath);
									oRouter.attachRouteMatched(fnRouteMatched);
									bExitOnNavigateBackToRoot = true;
									oRouter.initialize();
									resolve();
								} else {
									var sHash;
									if (aSemanticKeys && aSemanticKeys.length && oStartUpParameters[aSemanticKeys[0].$PropertyPath]) {
										sHash = that._createHash(aSemanticKeys, sEntitySet, oStartUpParameters);
									} else if (aTechnicalKeys && oStartUpParameters[aTechnicalKeys[0]]) {
										sHash = that._createHash(aTechnicalKeys, sEntitySet, oStartUpParameters);
									}
									if (sHash) {
										HashChanger.getInstance().replaceHash(sHash);
									}
									oRouter.attachRouteMatched(fnRouteMatched);
									oRouter.initialize();
									resolve();
								}
							} else {
								oRouter.attachRouteMatched(fnRouteMatched);
								oRouter.initialize();
								resolve();
							}
						})
						.catch(function(oError) {
							Log.error("Metadata not loaded");
						});
				});
			},

			_bindTargetPage: function(oTargetControl, sTarget, bDeferred, bNoHashChange, bIsFcl) {
				var oTargetInstance = oTargetControl.getComponentInstance
						? oTargetControl.getComponentInstance()
						: oTargetControl.getController(),
					fnOnBeforeBinding = (oTargetInstance.onBeforeBinding || fnNoOp).bind(oTargetInstance),
					fnOnAfterBinding = (oTargetInstance.onAfterBinding || fnNoOp).bind(oTargetInstance),
					oBindingContext,
					sBindingContextPath,
					oExistingParentBinding,
					oParentBinding,
					oParentListBinding,
					that = this;

				function fnGetSemantickeysFilter() {
					if (aSemanticKeys && aSemanticKeys.length) {
						var aFilters = [];
						var aValues = [];
						var sHash = HashChanger.getInstance().getHash();
						sHash = sHash.split("?")[0]; //remove any hash query params if they exist.
						if (oUseContext) {
							var oValue;
							for (var i = 0; i < aSemanticKeys.length; i++) {
								oValue = oUseContext.getObject(aSemanticKeys[i].$PropertyPath);
								if (oValue) {
									aValues.push(oValue);
								} else {
									return undefined;
								}
							}
						} else {
							aValues = sHash.substring(sHash.indexOf("(") + 1, sHash.length - 1).split(",");
						}
						for (var j = 0; j < aSemanticKeys.length; j++) {
							var sProperty = aSemanticKeys[j].$PropertyPath;
							var sValue;
							if (aValues.length === 1) {
								sValue = aValues[0];
							} else {
								sValue = aValues[j].split("=")[1];
							}
							if (sValue.indexOf("'") === 0 && sValue.lastIndexOf("'") === sValue.length - 1) {
								// slicing the quotes from the value
								sValue = sValue.substr(1, sValue.length - 2);
							}
							aFilters.push(new Filter(sProperty, FilterOperator.EQ, sValue));
						}
						if (oDraft) {
							var oDraftFilter = new Filter({
								filters: [
									new Filter("IsActiveEntity", "EQ", false),
									new Filter("SiblingEntity/IsActiveEntity", "EQ", null)
								],
								and: false
							});
							aFilters.push(oDraftFilter);
						}
						var oCompleteFilter = new Filter(aFilters, true);
						return oCompleteFilter;
					}
				}

				function fnBindContextToTargetPage() {
					if (!bNoHashChange) {
						oBindingContext = oTargetControl.getBindingContext();
						sBindingContextPath = oBindingContext && oBindingContext.getPath();
						oExistingParentBinding = oBindingContext && oBindingContext.getBinding();
						oParentBinding = oUseContext && oUseContext.getBinding();
					}

					if (
						bNoHashChange ||
						sBindingContextPath !== sTarget ||
						(oUseContext && oExistingParentBinding !== oParentBinding && !bIsFcl)
					) {
						if (sTarget || bNoHashChange) {
							if (!oUseContext || oUseContext.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")) {
								// TODO: This is just a workaround once model changes caching sParentListBinding has to be removed
								//Passing the parentBinding Id to the OP controller
								oParentListBinding = oUseContext && oUseContext.getBinding();
								// there's no context, the user refreshed the page or used a bookmark, we need to
								// create a new context with the path from the URL
								// as setting the context with a return value context currently doesn't work we
								// also create a new context in this case - to be discussed with v4 model team
								var oHiddenBinding = oTargetControl
									.getModel()
									.bindContext(sTarget, undefined, { $$patchWithoutSideEffects: true, $$groupId: "$auto" });
								oUseContext = oHiddenBinding.getBoundContext();

								if (that.isUIStateDirty()) {
									// TODO: as a workaround we invalidate the model cache while the app is dirty
									// as the manage model sets the parent in an async task and the request side effects
									// relies on the parent relationship we have to set a timeout 0
									setTimeout(function() {
										that._refreshBindingContext(oBindingContext);
									}, 0);
								}
							}

							oBindingContext = oUseContext;
							fnOnBeforeBinding(oBindingContext, {
								editable: bTargetEditable,
								listBinding: oParentListBinding,
								bPersistOPScroll: bPersistOPScroll
							});

							oTargetControl.setBindingContext(oBindingContext);
							// TODO: This is just a workaround once model changes caching sParentListBinding has to be removed
							fnOnAfterBinding(oBindingContext);
							oUseContext = null;
						} else if (sTarget === "") {
							fnOnBeforeBinding(null);
							fnOnAfterBinding(null);
						}
					} else if (that.isUIStateDirty()) {
						// TODO: this is just a first workaround. Once the model supports synchronization this is not needed anymore
						that._refreshBindingContext(oBindingContext);
					}
				}

				sBindingTarget = oTargetControl.getComponent ? oTargetControl.getComponent() : oTargetControl.getControllerName();

				if (bDeferred) {
					// TODO: set empty context to be checked with model colleagues

					// pass the parameters to the onbeforebinding
					fnOnBeforeBinding(null, { editable: bTargetEditable });

					if (bDeferredContext || !oAsyncContext) {
						// either the context shall be created in the target page (deferred Context) or it shall
						// be created async but the user refreshed the page / bookmarked this URL
						// TODO: currently the target component creates this document but we shall move this to
						// a central place
						if (oTargetInstance && oTargetInstance.createDeferredContext) {
							oTargetInstance.createDeferredContext(sTarget);
						}
					}

					oAsyncContext = null;
					bDeferredContext = false;

					if (oTargetControl.getBindingContext() && oTargetControl.getBindingContext().hasPendingChanges()) {
						/* TODO: this is just a quick solution, this needs to be reworked
                                there are still pending changes that were not yet removed. ideally the user should be asked for
                                before he is leaving the page. we will work on this with another backlog item. For now remove the
                                pending changes to avoid the model raises errors and the object page is at least bound
                             */
						oTargetControl
							.getBindingContext()
							.getBinding()
							.resetChanges();
					}

					// remove the context to avoid showing old data
					oTargetControl.setBindingContext(null);

					return false;
				}
				var sHash = HashChanger.getInstance().getHash();
				if (aSemanticKeys && aSemanticKeys.length && sHash.split("/").length === 1 && sTarget !== "" && !bIsFcl) {
					// If context exists then we fetch the semantic key values from it else we use Hash to get semantic key values
					// and make a call via listbinding to fetch the context
					if (!oUseContext) {
						var oCompleteFilter = fnGetSemantickeysFilter();
						var oListBinding = oTargetControl
							.getModel()
							.bindList("/" + sHash.substring(0, sHash.indexOf("(")), undefined, undefined, oCompleteFilter);
						oListBinding.requestContexts().then(function(oContexts) {
							if (oContexts && oContexts.length) {
								sTarget = oContexts[0].getPath();
							}
							fnBindContextToTargetPage();
						});
					} else {
						sTarget = oUseContext.getPath();
						fnBindContextToTargetPage();
					}
				} else {
					fnBindContextToTargetPage();
				}
			},

			/* TODO: get rid of this once provided by the model
					a refresh on the binding context does not work in case a creation row with a transient context is
					used. also a requestSideEffects with an empty path would fail due to the transient context
					therefore we get all dependent bindings (via private model method) to determine all paths and then
					request them
				 */
			_refreshBindingContext: function(oBindingContext) {
				var aNavigationPropertyPaths = [],
					aPropertyPaths = [],
					aSideEffects = [],
					oContextForSideEffects;

				var getBindingPaths = function(oBinding) {
					var aDependentBindings,
						sPath = oBinding.getPath();

					if (oBinding.isA("sap.ui.model.odata.v4.ODataContextBinding")) {
						if (sPath === "") {
							// now get the dependent bindings
							aDependentBindings = oBinding.getDependentBindings();
							// ask the dependent bindings (and only those with the specified groupId
							if (aDependentBindings.length > 0) {
								for (var i = 0; i < aDependentBindings.length; i++) {
									getBindingPaths(aDependentBindings[i]);
								}
							}
						} else {
							if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
								aNavigationPropertyPaths.push(sPath);
							}
						}
					} else if (oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
						if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
							aNavigationPropertyPaths.push(sPath);
						}
					} else if (oBinding.isA("sap.ui.model.odata.v4.ODataPropertyBinding")) {
						if (aPropertyPaths.indexOf(sPath) === -1) {
							aPropertyPaths.push(sPath);
						}
					}
				};

				// binding of the context must have $$PatchWithoutSideEffects true, this bound context may be needed to be fetched from the dependent binding
				oContextForSideEffects = CommonUtils.getContextForSideEffects(oBindingContext);

				getBindingPaths(oContextForSideEffects.getBinding());

				for (var i = 0; i < aNavigationPropertyPaths.length; i++) {
					aSideEffects.push({
						$NavigationPropertyPath: aNavigationPropertyPaths[i]
					});
				}
				for (var i = 0; i < aPropertyPaths.length; i++) {
					aSideEffects.push({
						$PropertyPath: aPropertyPaths[i]
					});
				}

				oContextForSideEffects.requestSideEffects(aSideEffects);
			},

			attachOnAfterNavigation: function(fnHandler) {
				aOnAfterNavigation.push(fnHandler);
			},

			detachOnAfterNavigation: function(fnHandler) {
				for (var i = 0; i < aOnAfterNavigation.length; i++) {
					if (aOnAfterNavigation[i] === fnHandler) {
						aOnAfterNavigation.splice(i, 1);
					}
				}
			},

			fireOnAfterNavigation: function() {
				for (var i = 0; i < aOnAfterNavigation.length; i++) {
					aOnAfterNavigation[i]();
				}
			},

			getOutbounds: function() {
				if (!this.outbounds) {
					// in the future we might allow setting the outbounds from outside
					if (!this.manifest) {
						// in the future we might allow setting the manifest from outside
						// as a fallback we try to get the manifest from the view's owner component

						this.manifest = this._getOwnerComponent()
							.getMetadata()
							.getManifest();
					}
					this.outbounds =
						this.manifest["sap.app"] &&
						this.manifest["sap.app"].crossNavigation &&
						this.manifest["sap.app"].crossNavigation.outbounds;
				}

				return this.outbounds;
			},

			_getOwnerComponent: function() {
				// this.base does not have the getOwnerComponent - as a workaround we get the view and again
				// the controller to access the owner component
				return CommonUtils.getAppComponent(this.base.getView());
			},
			getEntitySet: function(oAppComponent) {
				var sEntitySet;
				var oManifest = oAppComponent.getManifest();
				var aRoutes = oManifest["sap.ui5"].routing.routes;
				var oTargets = oManifest["sap.ui5"].routing.targets;
				var sPattern;
				for (var i = 0; i < aRoutes.length; i++) {
					sPattern = aRoutes[i].pattern;
					if (sPattern === "" || ":?query:") {
						sEntitySet =
							oTargets[aRoutes[i].target].options &&
							oTargets[aRoutes[i].target].options.settings &&
							oTargets[aRoutes[i].target].options.settings.entitySet;
						return sEntitySet;
					}
				}
				if (!oAppComponent.getFcl().isFclEnabled(oAppComponent)) {
					//This check is made to make sure we only handle sap.fe.templates.ObjectPage but not a blankcanvas.Currently we only handle scenarios where LR entityset is same as OP entityset but in future we might have remove this when we have to handle usecase when entityset of LR and OP is not same
					for (var j = 0; j < aRoutes.length; j++) {
						sPattern = aRoutes[i].pattern;
						if (
							(sPattern !== "" || ":?query:") &&
							(oTargets[aRoutes[j].target].options &&
								oTargets[aRoutes[j].target].options.settings &&
								oTargets[aRoutes[j].target].options.settings.entitySet === sEntitySet) &&
							oTargets[aRoutes[j].target].name === "sap.fe.templates.ObjectPage"
						) {
							return sEntitySet;
						}
					}
				}
				if (sEntitySet == undefined) {
					if (aRoutes.length === 1) {
						sEntitySet = aRoutes[0].pattern.split("(")[0];
						return sEntitySet;
					}
				}
			},
			_createHash: function(aKeys, sEntitySet, oContextOrStartupParams) {
				var sPath = sEntitySet + "(";
				var sKey, oValue;
				var oET = this._getEntityType();
				if (aKeys.length === 1) {
					sKey = aKeys[0].$PropertyPath || aKeys[0];
					oValue =
						oContextOrStartupParams.isA && oContextOrStartupParams.isA("sap.ui.model.odata.v4.Context")
							? oContextOrStartupParams.getObject(sKey)
							: oContextOrStartupParams[sKey][0];
					if (oValue) {
						sPath = oET[sKey].$Type === "Edm.String" ? sPath + "'" + oValue + "'" : sPath + oValue;
					} else {
						sPath = undefined;
					}
				} else {
					for (var i = 0; i < aKeys.length; i++) {
						sKey = aKeys[i].$PropertyPath || aKeys[i];
						oValue = oContextOrStartupParams.getObject
							? oContextOrStartupParams.getObject(sKey)
							: oContextOrStartupParams[sKey][0];
						if (oValue) {
							sPath = oET[sKey].$Type === "Edm.String" ? sPath + sKey + "='" + oValue + "'" : sPath + sKey + "=" + oValue;
							if (i !== aKeys.length - 1) {
								sPath = sPath + ",";
							}
						} else {
							sPath = undefined;
							break;
						}
					}
				}
				if (sPath) {
					sPath = sPath + ")";
					return sPath;
				}
				return undefined;
			},
			_getEntityType: function() {
				return oEntityType || null;
			},

			/**
			 * function waiting for the Right most view to be ready
			 * @name sap.fe.core.controllerextensions.routing#waitForRightMostViewReady
			 * @memberof sap.fe.core.controllerextensions.routing
			 * @param {*} oEvent reference an Event parameter coming from routeMatched event
			 */
			waitForRightMostViewReady: function(oEvent) {
				return new Promise(function(resolve, reject) {
					var aContainers = oEvent.getParameter("views");
					var oViewCtr = aContainers[aContainers.length - 1].getComponentInstance();
					var oView = oViewCtr.getRootControl();
					if (oViewCtr.isPageReady()) {
						resolve(oView);
					} else {
						oViewCtr.attachEventOnce("pageReady", function() {
							resolve(oView);
						});
					}
				});
			}
		});
		// TODO: get rid of this dirty logic once model supports synchronization
		// as long as it doesn't we park the dirty state into one singleton
		Extension.flagUIState = enumUIState.CLEAN;

		return Extension;
	}
);
