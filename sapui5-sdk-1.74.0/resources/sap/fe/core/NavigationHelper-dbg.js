/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
/* global Promise */
sap.ui.define(
	[
		"sap/base/Log",
		"sap/ui/base/Object",
		"sap/ushell/components/applicationIntegration/AppLifeCycle",
		"sap/ui/core/routing/HashChanger",
		"sap/ui/base/EventProvider"
	],
	function(Log, BaseObject, AppLifeCycle, HashChanger, EventProvider) {
		"use strict";

		var enumState = {
			EQUAL: 0,
			COMPATIBLE: 1,
			ANCESTOR: 2,
			DIFFERENT: 3
		};

		return BaseObject.extend("sap.fe.core.NavigationHelper", {
			bIsRebuildHistoryRunning: false,
			bIsCurrentHashTransient: false,
			bIsComputingTitleHierachy: false,

			init: function(oAppComponent) {
				this._oRouter = oAppComponent.getRouter();

				this._oManagedHistory = [];
				// Save the name of the app (including startup parameters) for rebuilding full hashes later
				this._sFlpAppName = sap.ushell.Container.getService("URLParsing").splitHash(window.location.hash).shellPart;

				var sCurrentAppHash = this._oRouter.getHashChanger().getHash();

				this._oManagedHistory.push(this._extractStateFromHash(sCurrentAppHash));

				//Add applicationEntryPoint properties has flags to the first Application page in the history
				history.replaceState(Object.assign({ feLevel: 0 }, history.state), null, window.location);
			},

			/**
			 * Navigates to a specific hash
			 *
			 * @function
			 * @name sap.fe.core.NavigationHelper#navToHash
			 * @memberof sap.fe.core.NavigationHelper
			 * @static
			 * @param {String} sHash to be navigated to
			 *
			 * @sap-restricted
			 */
			navToHash: function(sHash) {
				this._pushNewState(this._extractStateFromHash(sHash));
				return this._rebuildBrowserHistory(sHash);
			},

			/**
			 * Navigates to a route with parameters
			 *
			 * @param {String} sRouteName to be navigated to
			 * @param {map} oParameters parameters for the navigation
			 *
			 * @sap-restricted
			 */
			navTo: function(sRouteName, oParameters) {
				var sHash = this._oRouter.getURL(sRouteName, oParameters);
				return this.navToHash(sHash);
			},

			/**
			 * Exits from the current app by navigating back until
			 * we get out of the app
			 */
			exitFromApp: function() {
				function exitAsync() {
					if (history.state.feLevel === undefined) {
						history.back();
					} else {
						window.removeEventListener("popstate", exitAsync);
						history.go(-history.state.feLevel - 1);
					}
				}

				//history.state.feLevel can be undefined if deeplink is used without switching to another application
				if (history.state.feLevel === undefined) {
					this._disableEventOnHashChange();
					window.addEventListener("popstate", exitAsync);
					history.back();
				} else {
					// Go back 1 step more than the current feLevel
					history.go(-history.state.feLevel - 1);
				}
			},

			/**
			 * Checks whether a given hash can have an impact on the current state
			 * i.e. if the hash is equal, compatible or an ancestor of the current state
			 *
			 * @param {*} sHash true if there's an impact
			 */
			isCurrentStateImpactedBy: function(sHash) {
				var oState = this._extractStateFromHash(sHash);
				return this._compareCacheStates(oState, this._oManagedHistory[this._oManagedHistory.length - 1]) !== enumState.DIFFERENT;
			},

			computeTitleHierarchy: function(oData) {
				// oView, oAppComponent) {
				var that = this;
				var oView = oData.oView;
				var oAppComponent = oData.oAppComponent;
				if (this.bIsComputingTitleHierachy == true) {
					Log.warning("computeTitleHierarchy already running ... Add this call to the pool");
					if (!this.computeHistoryHierarchyPool) {
						this.computeHistoryHierarchyPool = [];
					}
					this.computeHistoryHierarchyPool.push(oData);
				}

				this.bIsComputingTitleHierachy = true;
				var oCurrentPage = oView.getParent();

				if (oCurrentPage && oCurrentPage.getPageTitleInformation) {
					oCurrentPage
						.getPageTitleInformation()
						.then(function(oTitleInfo) {
							var oHistory = that._oManagedHistory.slice(0);
							var sDestinationLocationHash = location.hash;
							if (that._oRouter.getHashChanger().getHash() === "" && location.hash.indexOf("&/") === -1) {
								sDestinationLocationHash += "&/";
							}
							var aHistory = [];
							var oTmpHistory;
							var sCurrentFullHash;
							var aParts = [];
							var sTmp = "";
							var _sTmp = "";
							var aValues = [];

							// build the Title Hierarchy for Deep Link case
							// bTitleHierarchyForceDeepLink is used to stay in deep link calculation mode
							if (
								that.bTitleHierarchyForceDeepLink === true ||
								(oHistory.length === 1 && that._oRouter.getHashChanger().getHash() !== "")
							) {
								var _intent;
								var oModel = oAppComponent.getModel();
								that.bTitleHierarchyForceDeepLink = true;
								aParts = sDestinationLocationHash.split("/").filter(Boolean);
								aParts.slice(1, aParts.length).forEach(function(item) {
									_sTmp = oModel
										.getMetaModel()
										.getObject(
											"/$EntityContainer/" +
												(sTmp += item.split("(")[0] + "/") +
												"$Type@com.sap.vocabularies.UI.v1.HeaderInfo/TypeName"
										);
									if (_sTmp !== undefined) {
										aValues.push(_sTmp);
									}
								});

								for (var m = 0; m < aParts.length; m++) {
									oTmpHistory = {};
									_intent = "";
									if (m === 0) {
										oTmpHistory.oTitleInfo = {
											title: oAppComponent.getMetadata().getManifestEntry("sap.app").title || "",
											subtitle: oAppComponent.getMetadata().getManifestEntry("sap.app").appSubTitle || "",
											intent: aParts[0].endsWith("&") ? aParts[0].substr(0, aParts[0].length - 1) : aParts[0],
											icon: ""
										};
										aHistory.push(oTmpHistory);
									} else {
										for (var index = 0; index <= m; index++) {
											_intent += aParts[index] + (index !== m ? "/" : "");
										}
										oTmpHistory.oTitleInfo = {
											title: aValues[m - 1] || "",
											subtitle: "",
											intent: _intent,
											icon: ""
										};
										if (aValues[m - 1] === oTitleInfo.title) {
											// current page - subtitle is displayed
											oTmpHistory.oTitleInfo.subtitle = oTitleInfo.subtitle;
										}
										aHistory.push(oTmpHistory);
									}
								}
								if (aParts.length === 1) {
									// main page
									aHistory[0] = {};
								}
								return { history: aHistory, titleinfo: oTitleInfo };
							} else {
								// Build the Title Hierarchy for regular cases
								for (var i = 0; i < oHistory.length; i++) {
									sCurrentFullHash = "#" + oHistory[i].hash;
									if (sCurrentFullHash === sDestinationLocationHash) {
										oTitleInfo.intent = sDestinationLocationHash;
										oHistory[i].oTitleInfo = oTitleInfo;
										if (oHistory.length !== 1 && that._oRouter.getHashChanger().getHash() !== "") {
											aHistory.push(oHistory[i]);
										}
										return { history: aHistory, titleinfo: oTitleInfo };
									} else {
										if (oHistory[i].hash.split("/").length === 2 && oHistory[i].hash.split("/")[1] === "") {
											oHistory[i].oTitleInfo = {
												title: oAppComponent.getMetadata().getManifestEntry("sap.app").title || "",
												subtitle: "",
												intent: "#" + oHistory[i].hash,
												icon: ""
											};
										} else {
											if (oHistory[i].oTitleInfo === undefined) {
												oHistory[i].oTitleInfo = oTitleInfo;
											}
										}
									}
									if (oHistory.length > 1) {
										aHistory.push(oHistory[i]);
									}
								}
							}
						})
						.then(function(oData) {
							var oShellServiceFactory = sap.ui.core.service.ServiceFactoryRegistry.get(
								"sap.ushell.ui5service.ShellUIService"
							);
							var oShellServicePromise =
								(oShellServiceFactory &&
									oData.history &&
									oData.titleinfo &&
									oShellServiceFactory.createInstance({
										scopeObject: oAppComponent,
										scopeType: "component"
									})) ||
								Promise.reject();
							oShellServicePromise.catch(function() {
								Log.warning("No ShellService available");
							});
							var aHistory = oData.history === undefined ? [] : oData.history;
							var oTitleInfo = oData.titleinfo === undefined ? {} : oData.titleinfo;
							oShellServicePromise.then(
								function(oService) {
									var _aHierarchy = [];
									var oHistoryReverse = aHistory.reverse();
									for (var i = 0; i < oHistoryReverse.length; i++) {
										if (i > 0) {
											if (oHistoryReverse[i].oTitleInfo.title != oHistoryReverse[i - 1].oTitleInfo.title) {
												_aHierarchy.push(oHistoryReverse[i].oTitleInfo);
											}
										} else {
											_aHierarchy.push(oHistoryReverse[i].oTitleInfo);
										}
									}
									oService.setHierarchy([]);
									oService.setTitle(oTitleInfo.title);
									if (!(oTitleInfo.intent.split("/").length === 2 && oTitleInfo.intent.split("/")[1] === "")) {
										oService.setHierarchy(_aHierarchy);
									}
									that.bIsComputingTitleHierachy = false;
									if (that.computeHistoryHierarchyPool && that.computeHistoryHierarchyPool.length > 0) {
										var oData = that.computeHistoryHierarchyPool[0];
										that.computeHistoryHierarchyPool.shift();
										that.computeTitleHierarchy(oData);
									}
								},
								function(oError) {
									Log.warning("No ShellService available");
								}
							);
						})
						.catch(function(oError) {
							Log.error("computeTitleHierarchy: Error while updating Title Hierarchy");
						});
				}
			},

			isCurrentHashTransient: function() {
				return this.bIsCurrentHashTransient;
			},

			/**
			 * Builds a state from a hash
			 *
			 * @param {sHash} sHash the hash to be used as entry
			 * @returns {state} the state
			 *
			 * @sap-restricted
			 */
			_extractStateFromHash: function(sHash) {
				var oState = {
					keys: []
				};

				var sHashNoParams = sHash.split("?")[0];
				var sTokens = sHashNoParams.split("/");
				sTokens.forEach(function(sToken) {
					var regexKey = /[^\(\)]+\([^\(\)]+\)/; // abc(def)
					if (regexKey.test(sToken)) {
						// We have a key for an object
						sToken = sToken.substring(0, sToken.length - 1); // remove trailing ')'
						var newKey = { keyID: sToken.split("(")[0] };
						var keyValues = sToken.split("(")[1].split(",");
						if (keyValues.length > 1) {
							keyValues.forEach(function(value) {
								var kv = value.split("=");
								newKey[kv[0]] = kv[1];
							});
						} else {
							newKey["ID"] = sToken.split("(")[1];
						}
						oState.keys.push(newKey);
					}
				});

				var aLayout = sHash.match(/\?.*layout=([^&]*)/);
				oState.sLayout = aLayout && aLayout.length > 1 ? aLayout[1] : null;
				if (oState.sLayout === "MidColumnFullScreen") {
					oState.screenMode = 1;
				} else if (oState.sLayout === "EndColumnFullScreen") {
					oState.screenMode = 2;
				} else {
					oState.screenMode = 0;
				}

				oState.hash = this._sFlpAppName + "&/" + sHash;

				return oState;
			},

			/**
			 * Adds a new state into the internal history structure
			 * Makes sure this new state is added after an ancestor
			 *
			 * @function
			 * @name sap.fe.core.NavigationHelper#_pushNewState
			 * @memberof sap.fe.core.NavigationHelper
			 * @param {*} oNewState : the new state to be added
			 *
			 * @sap-restricted
			 * @final
			 *
			 */
			_pushNewState: function(oNewState) {
				// In case the user has navigated back in the browser history, we need to remove
				// the states ahead in history and make sure the top state corresponds to the current page
				// We can only do that if we know at which level we are
				if (history.state && history.state.feLevel) {
					while (this._oManagedHistory.length > 0 && this._oManagedHistory.length > history.state.feLevel + 1) {
						this._oManagedHistory.pop();
					}
				}

				// Then we remove all states that are not ancestors of the new state
				while (
					this._oManagedHistory.length > 0 &&
					this._compareCacheStates(this._oManagedHistory[this._oManagedHistory.length - 1], oNewState) !== enumState.ANCESTOR
				) {
					this._oManagedHistory.pop();
				}

				// Now we can push the state at the top of the internal history
				this._oManagedHistory.push(oNewState);
			},

			/**
			 * disable the routing by calling the router stop method
			 *
			 * @function
			 * @name sap.fe.core.NavigationHelper#_disableEventOnHashChange
			 * @memberof sap.fe.core.NavigationHelper
			 *
			 * @sap-restricted
			 * @final
			 */
			_disableEventOnHashChange: function() {
				this._oRouter.stop();
				this.bIsCurrentHashTransient = true;
			},

			/**
			 * enable the routing by calling the router initialize method
			 *
			 * @function
			 * @name sap.fe.core.NavigationHelper#_enableEventOnHashChange
			 * @memberof sap.fe.core.NavigationHelper
			 * @param {Array} [bIgnoreCurrentHash] ignore the last hash event triggered before the router has initialized
			 *
			 * @sap-restricted
			 * @final
			 */
			_enableEventOnHashChange: function(bIgnoreCurrentHash) {
				this._oRouter.initialize(bIgnoreCurrentHash);
				this.bIsCurrentHashTransient = false;
			},

			/**
			 * rebuilds the browser history from the app root page
			 *
			 * @function
			 * @name sap.fe.core.NavigationHelper#_rebuildBrowserHistory
			 * @memberof sap.fe.core.NavigationHelper
			 * @param {String} [sNewHash] the current hash that needs to be added at the end of history and displayed
			 *
			 * @sap-restricted
			 * @final
			 */
			_rebuildBrowserHistory: function(sNewHash) {
				if (HashChanger.getInstance().getHash() === sNewHash) {
					return Promise.resolve();
				}
				var that = this;
				return new Promise(function(resolve, reject) {
					// The condition below prevents the "parallel" execution of the _rebuildBrowserHistory and force to execute if sequentially by using a pool
					if (that.bIsRebuildHistoryRunning === true) {
						Log.warning("_rebuildBrowserHistory already running ... Add this call to the pool");
						if (!that.rebuildHistoryPool) {
							that.rebuildHistoryPool = [];
						}
						that.rebuildHistoryPool.push(sNewHash);
						return;
					}
					that.bIsRebuildHistoryRunning = true;

					function rebuild() {
						//we should normalized the value of the hash in the history for the Home App
						if (that._oManagedHistory[0].hash.indexOf("&/") === -1) {
							that._oManagedHistory[0].hash += "&/";
						}
						if (that._oManagedHistory.length > 1) {
							var oState = Object.assign({}, history.state);
							oState.sap = Object.assign({}, history.state.sap);

							// Add intermediate hashes without triggering reload
							var index = 1;
							while (index < that._oManagedHistory.length - 1) {
								oState.sap.history = oState.sap.history.slice();
								oState.sap.history.push(that._oManagedHistory[index].hash);
								history.pushState(Object.assign(oState, { feLevel: index }), null, "#" + that._oManagedHistory[index].hash);
								index++;
							}

							// Add last hash
							that._enableEventOnHashChange(true);
							if (HashChanger.getInstance().getHash() === sNewHash) {
								HashChanger.getInstance().setHash("---");
								HashChanger.getInstance().replaceHash(sNewHash);
							} else {
								HashChanger.getInstance().setHash(sNewHash);
							}
							oState.sap.history = oState.sap.history.slice();
							oState.sap.history.push(that._oManagedHistory[index].hash);
							history.replaceState(
								Object.assign(oState, { feLevel: that._oManagedHistory.length - 1 }),
								null,
								"#" + that._oManagedHistory[index].hash
							);
						} else {
							// as  HashChanger object  stores the current window.location.hash internally
							//we need first to reset this internal record  with a default value using replaceHash
							HashChanger.getInstance().replaceHash("---");
							that._enableEventOnHashChange(true);
							HashChanger.getInstance().replaceHash(sNewHash);
							history.replaceState(Object.assign(history.state, { feLevel: 0 }), null);
						}
						that.bIsRebuildHistoryRunning = false;
						//execute the defered calls of _rebuildBrowserHistory in case of "parallel" executions detected
						if (that.rebuildHistoryPool && that.rebuildHistoryPool.length > 0) {
							that._rebuildBrowserHistory(that.rebuildHistoryPool[0]);
							that.rebuildHistoryPool.shift();
						}

						resolve();
					}

					// Async call of rebuild(), in order to let all notifications and events get processed
					function rebuildAsync() {
						if (history.state.feLevel === 0) {
							window.removeEventListener("popstate", rebuildAsync);
							rebuild();
						} else {
							history.back();
						}
					}

					that._disableEventOnHashChange();

					//history.state.feLevel can be undefined if deeplink is used without switching to another application
					if (history.state.feLevel === undefined) {
						window.addEventListener("popstate", rebuildAsync);
						history.back();
					} else if (history.state.feLevel !== 0) {
						// Call rebuild when the navigation back is done
						// Asynchronous call to ensure all events/notifications have been processed before
						window.addEventListener("popstate", rebuildAsync);
						history.go(-history.state.feLevel);
					} else {
						// Call rebuild immediately (no back nav required)
						rebuild();
					}
				});
			},

			/**
			 * Compares 2 states
			 *
			 * @param {*} oState1
			 * @param {*} oState2
			 * @returns {comparison} The result of the comparison:
			 *        - enumState.EQUAL if oState1 and oState2 are equal
			 *        - enumState.COMPATIBLE if oState1 and oState2 are compatible
			 *        - enumState.ANCESTOR if oState1 is an ancestor of oState2
			 *        - enumState.DIFFERENT if the 2 states are different
			 */

			_compareCacheStates: function(oState1, oState2) {
				// First compare object keys
				if (oState1.keys.length > oState2.keys.length) {
					return enumState.DIFFERENT;
				}
				var equal = true;
				var index;
				for (index = 0; equal && index < oState1.keys.length; index++) {
					if (oState1.keys[index].keyID !== oState2.keys[index].keyID || oState1.keys[index].ID !== oState2.keys[index].ID) {
						equal = false;
					}
				}
				if (!equal) {
					// Some objects keys are different
					return enumState.DIFFERENT;
				}

				// All keys from oState1 are in oState2 --> check if ancestor
				if (oState1.keys.length < oState2.keys.length || oState1.screenMode < oState2.screenMode) {
					return enumState.ANCESTOR;
				}
				if (oState1.screenMode > oState2.screenMode) {
					return enumState.DIFFERENT; // Not sure this case can happen...
				}

				// At this stage, the 2 states have the same object keys (in the same order) and same screenmode
				// They can be either compatible or equal
				for (index = 0; equal && index < oState1.keys.length; index++) {
					if (oState1.keys[index].IsActiveEntity !== oState2.keys[index].IsActiveEntity) {
						equal = false;
					}
				}

				if (!equal || oState1.sLayout !== oState2.sLayout) {
					return enumState.COMPATIBLE;
				} else {
					return enumState.EQUAL;
				}
			}
		});
	}
);
