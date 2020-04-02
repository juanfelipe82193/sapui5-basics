/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
/* global Promise */
sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/fe/core/actions/messageHandling",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/fe/core/actions/sticky",
		"sap/base/Log",
		"sap/m/Text",
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/HashChanger",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/BusyLocker"
	],
	function(
		ControllerExtension,
		messageHandling,
		XMLTemplateProcessor,
		XMLPreprocessor,
		Fragment,
		sticky,
		Log,
		Text,
		Button,
		Dialog,
		JSONModel,
		HashChanger,
		CommonUtils,
		BusyLocker
	) {
		"use strict";

		// TODO: we are not able to extend the transaction controllerExtension and can't create instances of any
		// controllerExtension within this controllerExtension - therefore as a first workaround we rely on the
		// existence of this.base.transaction and this.base.routing

		var sFragmentName = "sap.fe.core.controls.field.DraftPopOverAdminData",
			oPopoverFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
			mUIStateModels = {};

		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.EditFlow", {
			/**
			 * Performs a task in sync with other tasks created via this function.
			 * Returns the task promise chain.
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.EditFlow#syncTask
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @static
			 * @param {Promise|function} [vTask] Optional, a promise or function to be executed and waitFor
			 * @returns {Promise} Promise resolves with ???
			 *
			 * @sap-restricted
			 * @final
			 */
			syncTask: function(vTask) {
				var fnNewTask;
				if (vTask instanceof Promise) {
					fnNewTask = function() {
						return vTask;
					};
				} else if (typeof vTask === "function") {
					fnNewTask = vTask;
				}

				this._pTasks = this._pTasks || Promise.resolve();
				if (!!fnNewTask) {
					this._pTasks = this._pTasks.then(fnNewTask).catch(function() {
						return Promise.resolve();
					});
				}

				return this._pTasks;
			},

			/**
			 * Create new document
			 * @function
			 * @name createDocument
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {Promise|sap.ui.model.odata.v4.ODataListBinding} vListBinding  ODataListBinding object or a promise that resolve to it
			 * @param {map} [mParameters] Optional, can contain the following attributes:
			 * @param {String} creationMode the creation mode to be used
			 *                    NewPage - the created document is shown in a new page, depending on metadata Sync, Async or Deferred is used
			 *                    Sync - the creation is triggered, once the document is created the navigation is done
			 *                    Async - the creation and the navigation to the instance is done in parallel
			 *                    Deferred - the creation is done at the target page
			 *                    Inline - The creation is done inline (in a table)
			 *                    CreationRow - The creation is done with the special creation row
			 * @param {Object} creationRow instance of the creation row (TODO: get rid but use list bindings only)
			 * @returns {String} the draft admin owner string to be shown
			 */
			createDocument: function(vListBinding, mParameters) {
				var that = this;

				function handleSideEffects(oListBinding, oCreationPromise) {
					oCreationPromise.then(function(oNewContext) {
						var oBindingContext = that.base.getView().getBindingContext();

						// if there are transient contexts, we must avoid requesting side effects
						// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
						// if list binding is refreshed, transient contexts might be lost
						if (!CommonUtils.hasTransientContext(oListBinding)) {
							that.requestSideEffects(oListBinding.getPath(), oBindingContext);
						}
					});
				}

				return this.syncTask().then(function() {
					return new Promise(function(resolve, reject) {
						var oGetListBinding, sProgrammingModel, oListBinding, oModel;

						mParameters = mParameters || {};

						if (typeof vListBinding === "object") {
							// we already get a list binding use this one
							oGetListBinding = Promise.resolve(vListBinding);
						} else {
							throw new Error("Binding object expected");
						}

						oGetListBinding
							.then(function(listBinding) {
								oListBinding = listBinding;
								oModel = oListBinding.getModel();
								var sCreationMode = mParameters.creationMode;

								// TODO: we will delete this once the UI change for the SD app is created and delivered
								// fow now get the inplace creation mode from the manifest, TODO: shall be a UI change
								if (
									(!sCreationMode || sCreationMode === "NewPage") &&
									that.base.getView().getViewData()._creationMode === "Inplace"
								) {
									sCreationMode = "Inline";
								}

								return that.base.transaction.getProgrammingModel(oListBinding).then(function(programmingModel) {
									sProgrammingModel = programmingModel;
									if (sCreationMode && sCreationMode !== "NewPage") {
										// use the passed creation mode
										return sCreationMode;
									} else {
										// we need to determine the creation mode
										switch (sProgrammingModel) {
											case "Draft":
											case "Sticky":
												// NewAction is not yet supported for NavigationProperty collection
												if (!oListBinding.isRelative()) {
													var oMetaModel = oModel.getMetaModel(),
														sPath = oListBinding.getPath(),
														// if NewAction with parameters is present, then creation is 'Deferred'
														// in the absence of NewAction or NewAction with parameters, creation is async
														sNewAction =
															sProgrammingModel === "Draft"
																? oMetaModel.getObject(
																		sPath + "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction"
																  )
																: oMetaModel.getObject(
																		sPath +
																			"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction"
																  ),
														aParameters =
															(sNewAction &&
																oMetaModel.getObject("/" + sNewAction + "/@$ui5.overload/0/$Parameter")) ||
															[];
													// binding parameter (eg: _it) is not considered
													if (aParameters.length > 1) {
														return "Deferred";
													}
												}
												return "Async";

											case "NonDraft":
												// TODO: to be checked - for now create them now and then navigate we might also switch to async
												return "Sync";
										}
									}
								});
							})
							.then(function(sCreationMode) {
								var oCreation,
									mArgs,
									oCreationRow = mParameters.creationRow,
									oCreationRowContext,
									oValidationCheck = Promise.resolve();

								if (sCreationMode !== "Deferred") {
									if (sCreationMode === "CreationRow") {
										// prefill data from creation row
										mParameters.data = mParameters.creationRow.getBindingContext().getObject();
										oCreationRowContext = oCreationRow.getBindingContext();
										oValidationCheck = that.checkForValidationErrors(oCreationRowContext);
									}
									if (sCreationMode === "CreationRow" || sCreationMode === "Inline") {
										// in case the creation failed we keep the failed context
										mParameters.keepTransientContextOnFailed = true;
										// busy handling shall be done locally only
										mParameters.busyMode = "Local";

										if (sCreationMode === "CreationRow") {
											// currently the mdc table would also lock the creation row - therefore don't
											// lock at all for now
											mParameters.busyMode = "None";
										}
										if (sCreationMode === "Inline") {
											// As the transient lines are not fully implemented and some input from UX is missing
											// we deactivate it for Inline and keep it only for the CreationRow which is anyway
											// not yet final
											mParameters.keepTransientContextOnFailed = false;
										}
										// take care on message handling, draft indicator (in case of draft)
										// Attach the create sent and create completed event to the object page binding so that we can react
										that.handleCreateEvents(oListBinding);
									}

									oCreation = oValidationCheck.then(function() {
										return that.base.transaction.createDocument(oListBinding, mParameters);
									});
								}

								var oNavigation = new Promise(function(resolve) {
									switch (sCreationMode) {
										case "Deferred":
											that.base.routing
												.navigateForwardToContext(oListBinding, {
													deferredContext: true,
													noHistoryEntry: mParameters.noHistoryEntry,
													editable: true
												})
												.then(function() {
													resolve();
												});
											break;
										case "Async":
											that.base.routing
												.navigateForwardToContext(oListBinding, {
													asyncContext: oCreation,
													noHistoryEntry: mParameters.noHistoryEntry,
													editable: true
												})
												.then(function() {
													resolve();
												});
											break;
										case "Sync":
											mArgs = {
												noHistoryEntry: mParameters.noHistoryEntry,
												editable: true
											};
											if (sProgrammingModel == "Sticky") {
												mArgs.transient = true;
											}
											oCreation.then(function(oNewDocumentContext) {
												that.base.routing.navigateForwardToContext(oNewDocumentContext, mArgs).then(function() {
													resolve();
												});
											});
											break;
										case "Inline":
											handleSideEffects(oListBinding, oCreation);
											resolve();
											break;
										case "CreationRow":
											// the creation row shall be cleared once the validation check was successful and
											// therefore the POST can be sent async to the backend
											oValidationCheck.then(function() {
												var oCreationRowListBinding = oCreationRowContext.getBinding(),
													oNewTransientContext;

												handleSideEffects(oListBinding, oCreation);

												oNewTransientContext = oCreationRowListBinding.create();
												oCreationRow.setBindingContext(oNewTransientContext);

												// this is needed to avoid console errors TO be checked with model colleagues
												oCreationRowContext.created().then(undefined, function() {
													Log.trace("transient fast creation context deleted");
												});
												oCreationRowContext.delete("$direct");
											});
											resolve();
											break;
									}
								});
								var oLocalUIModel = that.base.getView().getModel("localUI");
								if (sProgrammingModel === "Sticky") {
									oLocalUIModel.setProperty("/sessionOn", true);
								}
								if (oCreation) {
									Promise.all([oCreation, oNavigation]).then(function(aParams) {
										var oNewDocumentContext = aParams[0];
										if (oNewDocumentContext) {
											that.base.routing.setUIStateDirty();

											if (sProgrammingModel === "Sticky") {
												that._handleStickyOn(oNewDocumentContext);
											}
										}
										resolve();
									}, reject);
								} else {
									// resolve directly
									resolve();
								}
							});
					});
				});
			},

			editDocument: function(oContext) {
				var that = this;
				this.base.transaction.editDocument(oContext).then(function(oNewDocumentContext) {
					that.base.transaction.getProgrammingModel(oContext).then(function(sProgrammingModel) {
						var bNoHashChange;

						if (sProgrammingModel === "Sticky") {
							var oLocalUIModel = that.base.getView().getModel("localUI");
							oLocalUIModel.setProperty("/sessionOn", true);
							that._handleStickyOn(oNewDocumentContext);
							bNoHashChange = true;
						}

						if (oNewDocumentContext !== oContext) {
							that.handleNewContext(oNewDocumentContext, true, bNoHashChange, true, true, true);
						}
					});
				});
			},

			saveDocument: function(oContext) {
				var that = this;

				// first of all wait until all key-match-requests are done
				return (
					this.syncTask()
						// submit any open changes if there any (although there are validation/parse errors)
						.then(this._submitOpenChanges.bind(this, oContext))
						// check if there are any validation/parse errors
						.then(this.checkForValidationErrors.bind(this, oContext))
						// and finally if all user changes are submitted and valid save the document
						.then(this.base.transaction.saveDocument.bind(this.base.transaction, oContext))
						.then(function(oActiveDocumentContext) {
							return that.base.transaction.getProgrammingModel(oContext).then(function(sProgrammingModel) {
								var bNoHashChange;

								if (sProgrammingModel === "Sticky") {
									// Without creating a new context, there is no GET for header data with navigation properties
									var oLocalUIModel = that.base.getView().getModel("localUI");
									oLocalUIModel.setProperty("/sessionOn", false);
									var oHiddenBinding = oActiveDocumentContext
										.getModel()
										.bindContext(oActiveDocumentContext.getPath(), undefined, { $$groupId: "$auto" });
									oActiveDocumentContext = oHiddenBinding.getBoundContext();

									that._handleStickyOff(oContext);

									if (oContext.getPath() === oActiveDocumentContext.getPath()) {
										bNoHashChange = true;
									}
								}

								if (oActiveDocumentContext !== oContext) {
									that.handleNewContext(oActiveDocumentContext, true, bNoHashChange, false, true, false);
								}
							});
						})
				);
			},

			cancelDocument: function(oContext, mParameters) {
				var that = this;

				this.syncTask()
					.then(this.base.transaction.cancelDocument.bind(this.base.transaction, oContext, mParameters))
					.then(function(oActiveDocumentContext) {
						that.base.transaction.getProgrammingModel(oContext).then(function(sProgrammingModel) {
							var bNoHashChange;

							if (sProgrammingModel === "Sticky") {
								var oLocalUIModel = that.base.getView().getModel("localUI");
								oLocalUIModel.setProperty("/sessionOn", false);
								that._handleStickyOff(oContext);
								bNoHashChange = true;
								// Setting back the visibility property of related apps model to previous value (before edit). INCIDENT ID : 1980354940
								var oRelatedAppsModel = that.getView().getModel("relatedAppsModel");
								oRelatedAppsModel.setProperty("/visibility", oRelatedAppsModel.getProperty("/visibilityBeforeEdit"));
							}

							//in case of a new document, the value of hasActiveEntity is returned. navigate back.
							if (!oActiveDocumentContext) {
								that.base.routing.setUIStateDirty();
								that.base.routing.navigateBackFromContext(oContext);
							} else {
								//active context is returned in case of cancel of existing document
								that.handleNewContext(oActiveDocumentContext, true, bNoHashChange, false, true, true);
							}
						});
					});
			},

			requestSideEffects: function(sNavigationProperty, oBindingContext) {
				var oMetaModel = this.base
						.getView()
						.getModel()
						.getMetaModel(),
					sBaseEntityType = "/" + oMetaModel.getObject(oMetaModel.getMetaPath(oBindingContext.getPath()))["$Type"],
					oAnnotations = oMetaModel.getObject(sBaseEntityType + "@"),
					aSideEffects = Object.keys(oAnnotations).filter(function(sAnnotation) {
						return sAnnotation.indexOf("@com.sap.vocabularies.Common.v1.SideEffects") > -1;
					}),
					aSideEffectsToRequest = [],
					aPathExpressions,
					aPropertiesToRequest = [],
					aEntitiesToRequest = [],
					oContextForSideEffects;
				// gather side effects which need to be requested
				aSideEffects.forEach(function(sSideEffect) {
					var oSideEffect = oAnnotations[sSideEffect];
					// if the navigation property is a source entity for any side effect
					if (oSideEffect.SourceEntities) {
						oSideEffect.SourceEntities.forEach(function(oSourceEntity) {
							if (oSourceEntity["$NavigationPropertyPath"] === sNavigationProperty) {
								aSideEffectsToRequest.push(sSideEffect);
							}
						});
					}
					// if at least one of the source properties belongs to the entity type via navigation property
					if (oSideEffect.SourceProperties && aSideEffectsToRequest.indexOf(sSideEffect) === -1) {
						oSideEffect.SourceProperties.forEach(function(oSourceProperty) {
							if (
								aSideEffectsToRequest.indexOf(sSideEffect) === -1 &&
								oSourceProperty["$PropertyPath"].indexOf(sNavigationProperty + "/") === 0
							) {
								aSideEffectsToRequest.push(sSideEffect);
							}
						});
					}
				});
				// assemble the path expressions to be GET from each side effect to be requested
				aSideEffectsToRequest.forEach(function(sSideEffect) {
					var aAdditionalPathExpressions = [],
						oSideEffect = oAnnotations[sSideEffect],
						aTargetProperties = oSideEffect.TargetProperties || [],
						aTargetEntities = oSideEffect.TargetEntities || [];
					// remove duplicate properties
					aTargetProperties = aTargetProperties
						.map(function(oPathExpression) {
							return oPathExpression["$PropertyPath"];
						})
						.filter(function(sPath) {
							return aPropertiesToRequest.indexOf(sPath) < 0;
						});
					// get additional text association values for the properties
					aTargetProperties.forEach(function(sPath) {
						var oTextAnnotation = oMetaModel.getObject(sBaseEntityType + "/" + sPath + "@com.sap.vocabularies.Common.v1.Text");
						if (oTextAnnotation && oTextAnnotation["$Path"]) {
							aAdditionalPathExpressions.push(oTextAnnotation["$Path"]);
						}
					});
					// remove duplicate entities
					aTargetEntities = aTargetEntities
						.map(function(oPathExpression) {
							return oPathExpression["$NavigationPropertyPath"];
						})
						.filter(function(sPath) {
							return aEntitiesToRequest.indexOf(sPath) < 0;
						});
					// add to list of paths to be requested
					aPropertiesToRequest = aPropertiesToRequest.concat(aTargetProperties).concat(aAdditionalPathExpressions);
					aEntitiesToRequest = aEntitiesToRequest.concat(aTargetEntities);
				});
				// gather all unique paths to request in the format of '$PropertyPath' and '$NavigationPropertyPath'
				aPathExpressions = aPropertiesToRequest
					.map(function(sPath) {
						return { "$PropertyPath": sPath };
					})
					.concat(
						aEntitiesToRequest.map(function(sPath) {
							return { "$NavigationPropertyPath": sPath };
						})
					);
				// request
				if (aPathExpressions.length) {
					// we need the correct context to request side effects
					// if there are dependent bindings, it may result in duplicate GET requests
					// the binding of the context on which we requestSideEffects must have $$patchWithoutSideEffects true
					oContextForSideEffects = CommonUtils.getContextForSideEffects(oBindingContext);
					oContextForSideEffects.requestSideEffects(aPathExpressions);
				}
			},
			deleteSingleDocument: function(oContext, mParameters) {
				var that = this;

				this._deleteDocumentTransaction(oContext, mParameters).then(function() {
					// Single objet deletion is triggered from an OP header button (not from a list)
					// --> Mark UI dirty and navigate back to dismiss the OP
					that.base.routing.setUIStateDirty();
					that.base.routing.navigateBackFromContext(oContext);
				});
			},

			deleteMultipleDocuments: function(oContext, mParameters) {
				var that = this;

				this._deleteDocumentTransaction(oContext, mParameters).then(function() {
					// Multiple object deletion is triggered from a list

					// First clear the selection in the table as it's not valid any more
					var oTable = that.getView().byId(mParameters.controlId);
					if (oTable && oTable.isA("sap.ui.mdc.Table")) {
						// This shall always be true, be let's be defensive
						oTable.clearSelection();
					}

					// Then require side-effects
					var oBindingContext = that.base.getView().getBindingContext();
					if (oBindingContext && Array.isArray(oContext)) {
						// oContext shall be an array, but let's be defensive
						var oListBinding = oContext[0].getBinding();
						// if there are transient contexts, we must avoid requesting side effects
						// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
						// if list binding is refreshed, transient contexts might be lost
						if (!CommonUtils.hasTransientContext(oListBinding)) {
							that.requestSideEffects(oListBinding.getPath(), oBindingContext);
						}
					}

					// Finally, check if the current state can be impacted by the deletion, i.e. if there's
					// an OP displaying a deleted object. If yes navigate back to dismiss the OP
					var oNavHelper = CommonUtils.getAppComponent(that.base.getView())._oNavigationHelper;
					var bImpacted = false;
					for (var index = 0; !bImpacted && index < oContext.length; index++) {
						if (oNavHelper.isCurrentStateImpactedBy(oContext[index].getPath())) {
							bImpacted = true;
							that.base.routing.navigateBackFromContext(oContext[index]);
						}
					}
				});
			},

			_deleteDocumentTransaction: function(oContext, mParameters) {
				var that = this,
					oLocalUIModel = this.base.getView().getModel("localUI");

				mParameters = mParameters || {};

				return this.syncTask()
					.then(this.base.transaction.deleteDocument.bind(this.base.transaction, oContext, mParameters, oLocalUIModel))
					.then(function() {
						var oLocalUIModel = that.base.getView().getModel("localUI");
						oLocalUIModel.setProperty("/sessionOn", false);
					});
			},

			applyDocument: function(oContext) {
				var that = this,
					oUIModel = this.base.getView().getModel("ui");

				BusyLocker.lock(oUIModel);

				return this._submitOpenChanges(oContext)
					.then(function() {
						BusyLocker.unlock(oUIModel);
						messageHandling.showUnboundMessages();
						that.base.routing.navigateBackFromContext(oContext);
						return true;
					})
					.catch(function(err) {
						var aCustomMessages = [];
						aCustomMessages.push({
							text: that.base.transaction.getText("SAPFE_APPLY_ERROR"),
							type: "Error"
						});
						BusyLocker.unlock(oUIModel);
						messageHandling.showUnboundMessages(aCustomMessages);
						return false;
					});
			},

			_submitOpenChanges: function(oContext) {
				var oModel = oContext.getModel();

				// we submit all our known update batch groups
				var aPromises = [];
				aPromises.push(oModel.submitBatch("$auto"));
				aPromises.push(oModel.submitBatch("$auto.associations"));

				return Promise.all(aPromises).then(function() {
					if (oModel.hasPendingChanges("$auto") || oModel.hasPendingChanges("$auto.associations")) {
						// the submit was not successful
						return Promise.reject("submit of open changes failed");
					}
				});
			},

			_handleStickyOn: function(oContext) {
				var oAppComponent = CommonUtils.getAppComponent(this.base.getView());
				if (!this.bStickyOn) {
					this.bStickyOn = true;

					// That's a very first version to support sub pages in sticky but this needs to be improved
					// once the routing is refactored.
					var sRootObject = HashChanger.getInstance().getHash(),
						sHashTracker = sRootObject;

					if (sap.ushell) {
						this.fnDirtyStateProvider = function() {
							var sTargetHash = HashChanger.getInstance().getHash(),
								bDirty;
							if (oAppComponent.getNavigationHelper().isCurrentHashTransient()) {
								//if building history is running we may exit temporaly from the object Page until history fully rebuilt
								bDirty = false;
							} else if (sHashTracker === sTargetHash) {
								// the hash didn't change so either the user attempts to refresh or to leave the app
								bDirty = true;
							} else if (sTargetHash !== "" && sRootObject.indexOf(sTargetHash.split("/")[0]) === 0) {
								// the user attempts to navigate within the root object
								// sTargetHash will be "" when user return to FLP or LR, in that code should go in else and bDirty should be true
								sHashTracker = sTargetHash;
								bDirty = false;
							} else {
								// the user attempts to navigate within the app, for example back to the list report
								bDirty = true;
							}

							if (bDirty) {
								// the FLP doesn't call the dirty state provider anymore once it's dirty, as they can't
								// change this due to compatibility reasons we set it back to not-dirty
								setTimeout(function() {
									sap.ushell.Container.setDirtyFlag(false);
								}, 0);
							}

							return bDirty;
						};

						sap.ushell.Container.registerDirtyStateProvider(this.fnDirtyStateProvider);
					}

					var i18nModel = this.base.getView().getModel("sap.fe.i18n"),
						that = this;

					this.fnHandleSessionTimeout = function() {
						// remove transient messages since we will showing our own message
						messageHandling.removeBoundTransitionMessages();
						messageHandling.removeUnboundTransitionMessages();

						var oDialog = new Dialog({
							title: "{sap.fe.i18n>OBJECT_PAGE_SESSION_EXPIRED_DIALOG_TITLE}",
							state: "Warning",
							content: new Text({ text: "{sap.fe.i18n>OBJECT_PAGE_SESSION_EXPIRED_DIALOG_MESSAGE}" }),
							beginButton: new Button({
								text: "{sap.fe.i18n>SAPFE_OK}",
								type: "Emphasized",
								press: function() {
									// remove sticky handling after navigation since session has already been terminated
									that._handleStickyOff();
									that.base.routing.navigateBackFromContext(oContext);
								}
							}),
							afterClose: function() {
								oDialog.destroy();
							}
						});
						oDialog.addStyleClass("sapUiContentPadding");
						oDialog.setModel(i18nModel, "sap.fe.i18n");
						that.base.getView().addDependent(oDialog);
						oDialog.open();
					};
					// handle session timeout
					this.base
						.getView()
						.getModel()
						.attachSessionTimeout(this.fnHandleSessionTimeout);

					this.fnStickyDiscard = function() {
						var sCurrentHash = HashChanger.getInstance().getHash();
						// either current hash is empty so the user left the app or he navigate away from the object
						if (!sCurrentHash || sRootObject.indexOf(sCurrentHash.split("/")[0]) === -1) {
							sticky.discardDocument(oContext);
							that._handleStickyOff();
						}
					};
					this.base.routing.attachOnAfterNavigation(this.fnStickyDiscard);
				}
			},
			_handleStickyOff: function() {
				if (sap.ushell) {
					if (this.fnDirtyStateProvider) {
						sap.ushell.Container.deregisterDirtyStateProvider(this.fnDirtyStateProvider);
						this.fnDirtyStateProvider = null;
					}
				}

				if (this.base.getView().getModel() && this.fnHandleSessionTimeout) {
					this.base
						.getView()
						.getModel()
						.detachSessionTimeout(this.fnHandleSessionTimeout);
				}

				this.base.routing.detachOnAfterNavigation(this.fnStickyDiscard);
				this.fnStickyDiscard = null;

				this.bStickyOn = false;
			},

			handleNewContext: function(oContext, bNoHistoryEntry, bNoHashChange, bEditable, bPersistOPScroll, bUseHash) {
				this.base.routing.setUIStateDirty();

				this.base.routing.navigateToContext(oContext, {
					noHistoryEntry: bNoHistoryEntry,
					noHashChange: bNoHashChange,
					editable: bEditable,
					bPersistOPScroll: bPersistOPScroll,
					useHash: bUseHash
				});
			},

			/**
			 * Invokes an action - bound/unbound and sets the page dirty
			 * @function
			 * @static
			 * @name sap.fe.core.controllerextensions.EditFlow.onCallAction
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {string} sActionName The name of the action to be called
			 * @param {map} [mParameters] contains the following attributes:
			 * @param {sap.ui.model.odata.v4.Context} [mParameters.contexts] contexts Mandatory for a bound action, Either one context or an array with contexts for which the action shall be called
			 * @param {sap.ui.model.odata.v4.ODataModel} [mParameters.model] oModel Mandatory for an unbound action, An instance of an OData v4 model
			 * @sap-restricted
			 * @final
			 **/
			onCallAction: function(sActionName, mParameters) {
				var that = this;

				return this.syncTask()
					.then(that.base.transaction.onCallAction.bind(that.base.transaction, sActionName, mParameters))
					.then(function() {
						/*
					 We set the (upper) pages to dirty after an execution of an action
					 TODO: get rid of this workaround
					 This workaround is only needed as long as the model does not support the synchronization.
					 Once this is supported we don't need to set the pages to dirty anymore as the context itself
					 is already refreshed (it's just not reflected in the object page)
					 we explicitly don't call this method from the list report but only call it from the object page
					 as if it is called in the list report it's not needed - as we anyway will remove this logic
					 we can live with this
					 we need a context to set the upper pages to dirty - if there are more than one we use the
					 first one as they are anyway siblings
					 */
						if (mParameters.contexts) {
							that.base.routing.setUIStateDirty();
						}
					});
			},

			/**
			 * Method to format the text of draft admin owner
			 * @function
			 * @name formatDraftOwnerText
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {String} sDraftInProcessByUser DraftInProcessByUser property of Draft DraftAdministrativeData
			 * @param {String} sDraftInProcessByUserDesc DraftInProcessByUserDesc property of Draft DraftAdministrativeData
			 * @param {String} sDraftLastChangedByUser DraftLastChangedByUser property of Draft DraftAdministrativeData
			 * @param {String} sDraftLastChangedByUserDesc DraftLastChangedByUserDesc property of Draft DraftAdministrativeData
			 * @param {String} sFlag flag to differanciate between the point of method calls
			 * @returns {String} the draft admin owner string to be shown
			 */
			formatDraftOwnerText: function(
				sDraftInProcessByUser,
				sDraftInProcessByUserDesc,
				sDraftLastChangedByUser,
				sDraftLastChangedByUserDesc,
				sFlag
			) {
				var sDraftOwnerDescription = "";

				var sUserDescription =
					sDraftInProcessByUserDesc || sDraftInProcessByUser || sDraftLastChangedByUserDesc || sDraftLastChangedByUser;
				if (sFlag) {
					sDraftOwnerDescription += sDraftInProcessByUser
						? this.base.transaction.getText("DRAFTINFO_GENERIC_LOCKED_OBJECT_POPOVER_TEXT") + " "
						: this.base.transaction.getText("DRAFTINFO_LAST_CHANGE_USER_TEXT") + " ";
				}
				sDraftOwnerDescription += sUserDescription
					? this.base.transaction.getText("DRAFTINFO_OWNER", [sUserDescription])
					: this.base.transaction.getText("DRAFTINFO_ANOTHER_USER");
				return sDraftOwnerDescription;
			},

			formatDraftOwnerTextInline: function(
				sDraftInProcessByUser,
				sDraftLastChangedByUser,
				sDraftInProcessByUserDesc,
				sDraftLastChangedByUserDesc
			) {
				return this.formatDraftOwnerText(
					sDraftInProcessByUser,
					sDraftInProcessByUserDesc,
					sDraftLastChangedByUser,
					sDraftLastChangedByUserDesc,
					false
				);
			},
			formatDraftOwnerTextInPopover: function(
				sDraftInProcessByUser,
				sDraftLastChangedByUser,
				sDraftInProcessByUserDesc,
				sDraftLastChangedByUserDesc
			) {
				return this.formatDraftOwnerText(
					sDraftInProcessByUser,
					sDraftInProcessByUserDesc,
					sDraftLastChangedByUser,
					sDraftLastChangedByUserDesc,
					true
				);
			},

			/**
			 * Method to be executed on click of the link
			 * @function
			 * @name onDraftLinkPressed
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {Event} oEvent event object passed from the click event
			 * @param {String} sEntitySet Name of the entity set for on the fly templating
			 */
			onDraftLinkPressed: function(oEvent, sEntitySet) {
				var that = this,
					oButton = oEvent.getSource(),
					oBindingContext = oButton.getBindingContext(),
					oView = this.base.getView(),
					oMetaModel = oView.getModel().getMetaModel(),
					oController = oView.getController(),
					fnOpenPopover = function() {
						var oPopoverDraftInfoModel = that._oPopover.getModel("draftInfo");
						oPopoverDraftInfoModel.setProperty("/bIsActive", oBindingContext.getProperty("IsActiveEntity"));
						oPopoverDraftInfoModel.setProperty("/bHasDraft", oBindingContext.getProperty("HasDraftEntity"));
						that._oPopover.getModel().bindContext(oBindingContext.getPath(), undefined, { $$groupId: "$auto" });
						that._oPopover.openBy(oButton);
					};
				if (!this._oPopover || !this._oPopover.oPopup) {
					Promise.resolve(
						that._oFragment ||
							XMLPreprocessor.process(
								oPopoverFragment,
								{ name: sFragmentName },
								{
									bindingContexts: {
										entitySet: oMetaModel.createBindingContext("/" + sEntitySet)
									},
									models: {
										entitySet: oMetaModel
									}
								}
							)
					)
						.then(function(oFragment) {
							//Remember as we can't template the same fragment twice
							that._oFragment = oFragment;
							return Fragment.load({ definition: oFragment, controller: oController });
						})
						.then(function(oPopover) {
							that._oPopover = oPopover;
							oView.addDependent(that._oPopover);
							var oPopoverDraftInfoModel = new JSONModel({
								bIsActive: undefined,
								bHasDraft: undefined
							});
							that._oPopover.setModel(oPopoverDraftInfoModel, "draftInfo");
							fnOpenPopover();
						});
				} else {
					fnOpenPopover();
				}
			},

			/**
			 * Method to be executed on click of the close button of the draft admin data popover
			 * @function
			 * @name closeDraftAdminPopover
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 */
			closeDraftAdminPopover: function() {
				this._oPopover.close();
			},

			/**
			 * handles the patch event: shows messages and in case of draft updates draft indicator
			 * @function
			 * @name handlePatchEvents
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {Object} oBinding odata context binding object
			 */
			handlePatchEvents: function(oBinding) {
				// TODO: the draft indicator shall be handled in the transaction controller
				var oTransactionStateModel = this.transactionStateModel;

				oTransactionStateModel.setProperty("/draftStatus", "Clear");
				var that = this;
				return that.base.transaction.getProgrammingModel(oBinding).then(function(sProgrammingModel) {
					// temp coding only, oBinding can be both a context or a binding context, get the binding
					// we will get rid of this once the model supports
					oBinding = (oBinding.getBinding && oBinding.getBinding()) || oBinding;
					oBinding.attachEvent("patchSent", function() {
						that.base.transaction.handleDocumentModifications();
						// for the time being until the model does the synchronization we set the context to dirty
						// therefore the list report is refreshed. once the model does the synchronization this coding
						// needs to be removed
						that.base.routing.setUIStateDirty();
						if (sProgrammingModel === "Draft") {
							oTransactionStateModel.setProperty("/draftStatus", "Saving");
						}
					});
					oBinding.attachEvent("patchCompleted", function(event) {
						if (sProgrammingModel === "Draft") {
							oTransactionStateModel.setProperty("/draftStatus", event.getParameter("success") ? "Saved" : "Clear");
						}
						messageHandling.showUnboundMessages();
					});
				});
			},

			/**
			 * handles the create event: shows messages and in case of draft updates draft indicator
			 * @function
			 * @name handleCreateEvents
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {Object} oBinding odata list binding object
			 */
			handleCreateEvents: function(oBinding) {
				var oTransactionStateModel = this.transactionStateModel;

				oTransactionStateModel.setProperty("/draftStatus", "Clear");
				var that = this;
				return that.base.transaction.getProgrammingModel(oBinding).then(function(sProgrammingModel) {
					oBinding = (oBinding.getBinding && oBinding.getBinding()) || oBinding;
					oBinding.attachEvent("createSent", function() {
						that.base.transaction.handleDocumentModifications();
						if (sProgrammingModel === "Draft") {
							oTransactionStateModel.setProperty("/draftStatus", "Saving");
						}
					});
					oBinding.attachEvent("createCompleted", function(event) {
						if (sProgrammingModel === "Draft") {
							oTransactionStateModel.setProperty("/draftStatus", event.getParameter("success") ? "Saved" : "Clear");
						}
						messageHandling.showUnboundMessages();
					});
				});
			},

			/**
			 * handles the errors from the table in list report and object page
			 * @function
			 * @name handleErrorOfTable
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {Object} oEvent Event object
			 */
			handleErrorOfTable: function(oEvent) {
				if (oEvent.getParameter("error")) {
					// show the unbound messages but with a timeout as the messages are otherwise not yet in the message model
					setTimeout(messageHandling.showUnboundMessages, 0);
				}
			},

			/**
			 * Method to retrieve the UI State Model (public API of the model to be described)
			 * @function
			 * @name getUIStateModel
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @returns {sap.ui.model.json.JSONModel} One-Way-Binding UI State Model
			 */
			getUIStateModel: function() {
				/*
					some states are handled by the transaction controller. in the usage of the edit flow controller
					they are to be considered globally for all edit flow controllers. due to this reason the edit flow
					controller takes care that only one global edit state model is created and shared between all
					instances of the edit flow and transaction controllers for this app
					But: there are also states that are managed by the edit flow controller (like the creation mode)
					For now the assumption is they are to be considered as locally. There might be the need of a
					global edit flow state as well in the future.
					As this is hard to understand for a consumer this method returns one local state model that always
					syncs the settings from the	global but also contains the local setting and if needed later also
					the global edit flow state model so every consumer can just bind this UI State model
					without the need to understand the internals. there is no sync back so never change any setting
					from the transaction state model in	the edit flow model state model
				 */

				var sAppComponentId,
					that = this;

				if (!this.editFlowStateModel) {
					sAppComponentId = CommonUtils.getAppComponent(this.base.getView()).getId();

					// check if globally model already created
					if (!mUIStateModels[sAppComponentId]) {
						mUIStateModels[sAppComponentId] = this.base.transaction.getUIStateModel();
					} else {
						// pass the UI State model to the transaction controller
						this.base.transaction.setUIStateModel(mUIStateModels[sAppComponentId]);
					}

					// store for easier access
					this.transactionStateModel = mUIStateModels[sAppComponentId];

					// create a local state model as a copy of the global state model
					this.editFlowStateModel = new JSONModel(this.transactionStateModel.getData());

					// always sync the settings from the transaction state model into the edit flow
					this.transactionStateModel.bindList("/").attachChange(function() {
						var bCreateMode = that.editFlowStateModel.getProperty("/createMode");
						that.editFlowStateModel.setJSON(that.transactionStateModel.getJSON());
						that.editFlowStateModel.setProperty("/createMode", bCreateMode);
					});
				}
				return this.editFlowStateModel;
			},

			/**
			 * The method decided if a document is to be shown in display or edit mode
			 * @function
			 * @name computeEditMode
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {sap.ui.model.odata.v4.Context} context The context to be displayed / edited
			 * @returns {Promise} Promise resolves once the edit mode is computed
			 */
			computeEditMode: function(oContext) {
				var that = this;

				return new Promise(function(resolve, reject) {
					var oEditFlowStateModel = that.getUIStateModel(),
						oTransactionStateModel = that.transactionStateModel;

					that.base.transaction.getProgrammingModel(oContext).then(function(sProgrammingModel) {
						if (sProgrammingModel === "Draft") {
							oContext.requestObject("IsActiveEntity").then(function(bIsActiveEntity) {
								if (bIsActiveEntity === false) {
									// in case the document is draft set it in edit mode
									oTransactionStateModel.setProperty("/editable", "Editable");
									oContext.requestObject("HasActiveEntity").then(function(bHasActiveEntity) {
										// the create mode is only relevant for the local state model
										if (bHasActiveEntity) {
											oEditFlowStateModel.setProperty("/createMode", false);
										} else {
											oEditFlowStateModel.setProperty("/createMode", true);
										}
										resolve();
									});
								} else {
									// active document, stay on display mode
									oTransactionStateModel.setProperty("/editable", "Display");
									resolve();
								}
							});
						} else {
							// in sticky or non-draft nothing to be computed
							resolve();
						}
					});
				});
			},

			/**
			 * Sets the edit mode
			 * @function
			 * @name setEditMode
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {String} editMode
			 * @param {Boolean} createMode flag to identify the creation mode
			 */
			setEditMode: function(sEditMode, bCreationMode) {
				var oEditFlowStateModel = this.getUIStateModel(),
					oTransactionStateModel = this.transactionStateModel;

				if (sEditMode) {
					// the edit mode has to be set globally
					oTransactionStateModel.setProperty("/editable", sEditMode);
				}

				if (bCreationMode !== undefined) {
					// the creation mode is only relevant for the local state model
					oEditFlowStateModel.setProperty("/createMode", bCreationMode);
				}
			},

			/**
			 * Checks if there are validation (parse) errors for controls bound to a given context
			 * @function
			 * @name hasValidationError
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {sap.ui.model.odata.v4.Context} context which should be checked
			 * @returns {Promise} Promise resolves if there are no validation errors and rejects if there are any
			 */

			checkForValidationErrors: function(oContext) {
				return this.syncTask().then(function() {
					var sPath = oContext.getPath(),
						aMessages = sap.ui
							.getCore()
							.getMessageManager()
							.getMessageModel()
							.getData(),
						oControl,
						oMessage;

					for (var i = 0; i < aMessages.length; i++) {
						oMessage = aMessages[i];
						if (oMessage.validation) {
							oControl = sap.ui.getCore().byId(oMessage.getControlId());
							if (
								oControl &&
								oControl.getBindingContext() &&
								oControl
									.getBindingContext()
									.getPath()
									.indexOf(sPath) === 0
							) {
								return Promise.reject("validation errors exist");
							}
						}
					}
				});
			}
		});

		return Extension;
	}
);
