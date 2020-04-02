/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/controllerextensions/Transaction",
		"sap/fe/core/controllerextensions/Routing",
		"sap/fe/core/controllerextensions/FlexibleColumnLayout",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/ui/model/odata/v4/ODataListBinding",
		"sap/fe/macros/field/FieldRuntime",
		"sap/base/Log",
		"sap/base/util/merge",
		"sap/fe/core/CommonUtils",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/macros/CommonHelper",
		"sap/m/MessageBox",
		"sap/fe/core/BusyLocker",
		"sap/fe/navigation/NavigationHelper"
	],
	function(
		Controller,
		JSONModel,
		Transaction,
		Routing,
		Fcl,
		EditFlow,
		ODataListBinding,
		FieldRuntime,
		Log,
		merge,
		CommonUtils,
		SelectionVariant,
		CommonHelper,
		MessageBox,
		BusyLocker,
		NavigationHelper
	) {
		"use strict";

		var iMessages;

		return Controller.extend("sap.fe.templates.ObjectPage.ObjectPageController", {
			transaction: Transaction,
			routing: Routing,
			fcl: Fcl,
			editFlow: EditFlow,

			onInit: function() {
				//var oObjectPage = this.byId("fe::op");
				this.getView().setModel(this.editFlow.getUIStateModel(), "ui");
				this.getView().setModel(
					new JSONModel({
						sessionOn: false
					}),
					"localUI"
				);

				// Adding model to store related apps data
				var oRelatedAppsModel = new JSONModel({
					visibility: false,
					items: null,
					visibilityBeforeEdit: false
				});

				this.getView().setModel(oRelatedAppsModel, "relatedAppsModel");

				//Attaching the event to make the subsection context binding active when it is visible.

				/*
			oObjectPage.attachEvent("subSectionEnteredViewPort", function(oEvent) {
				var oObjectPage = oEvent.getSource();
				var oSubSection = oEvent.getParameter("subSection");
				oObjectPage.getHeaderTitle().setBindingContext(undefined);
				oObjectPage.getHeaderContent()[0].setBindingContext(undefined);//The 0 is used because header content will have only one content (FlexBox).
				oSubSection.setBindingContext(undefined);
			});
			*/
			},

			getTableBinding: function(oTable) {
				return oTable && oTable._getRowBinding();
			},

			onBeforeBinding: function(oContext, mParameters) {
				// TODO: we should check how this comes together with the transaction controllerExtension, same to the change in the afterBinding
				var that = this,
					aTables = this._findTables(),
					oFastCreationRow,
					bCreateMode,
					oObjectPage = this.byId("fe::op"),
					oBinding = mParameters.listBinding;

				if (
					oObjectPage.getBindingContext() &&
					oObjectPage.getBindingContext().hasPendingChanges() &&
					!(
						oObjectPage
							.getBindingContext()
							.getModel()
							.hasPendingChanges("$auto") ||
						oObjectPage
							.getBindingContext()
							.getModel()
							.hasPendingChanges("$auto.associations")
					)
				) {
					/* 	In case there are pending changes for the creation row and no others we need to reset the changes
						TODO: this is just a quick solution, this needs to be reworked
				 	*/

					oObjectPage
						.getBindingContext()
						.getBinding()
						.resetChanges();
				}

				// For now we have to set the binding context to null for every fast creation row
				// TODO: Get rid of this coding or move it to another layer - to be discussed with MDC and model
				for (var i = 0; i < aTables.length; i++) {
					oFastCreationRow = aTables[i].getCreationRow();
					if (oFastCreationRow) {
						oFastCreationRow.setBindingContext(null);
					}
				}

				if (mParameters && mParameters.editable) {
					if (oContext === null) {
						// currently having no context means we are in the create mode
						// TODO: the create mode logic has to be refactored - the mode shall be set by the transaction controller
						bCreateMode = true;
					}

					// the page shall be immediately in the edit mode to avoid flickering
					this.editFlow.setEditMode("Editable", bCreateMode);
				} else {
					// currently there is no other place removing the create mode so we set it by default to false
					// TODO: this should be also improved, see comment above
					if (this.getView().getViewData().viewLevel === 1) {
						this.editFlow.setEditMode("Display", false);
					} else {
						this.editFlow.setEditMode(undefined, false);
					}
				}

				// Srcoll to present Section so that bindings are enabled during navigation through paginator buttons, as there is no view rerendering/rebind
				var fnScrollToPresentSection = function(oEvent) {
					if (!mParameters.bPersistOPScroll) {
						oObjectPage.setSelectedSection(null);
						oObjectPage.detachModelContextChange(fnScrollToPresentSection);
					}
				};

				oObjectPage.attachModelContextChange(fnScrollToPresentSection);

				//Set the Binding for Paginators using ListBinding ID
				if (oBinding && oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
					var oPaginator = that.byId("fe::paginator");
					if (oPaginator) {
						oPaginator.setListBinding(oBinding);
					}
				}

				if (!mParameters.editable) {
					var oLocalUIModel = this.getView().getModel("localUI");
					if (oLocalUIModel.getProperty("/sessionOn") === true) {
						oLocalUIModel.setProperty("/sessionOn", false);
					}
				}

				//Setting the context binding to inactive state for all object page components.
				/*
			oObjectPage.getHeaderTitle().setBindingContext(null);
			oObjectPage.getHeaderContent()[0].setBindingContext(null);//The 0 is used because header content will have only one content (FlexBox).
			oObjectPage.getSections().forEach(function(oSection){
				oSection.getSubSections().forEach(function(oSubSection){
					oSubSection.setBindingContext(null);
				});
			});
			*/
			},

			onAfterBinding: function(oBindingContext, mParameters) {
				var oObjectPage = this.byId("fe::op"),
					that = this,
					oModel = oBindingContext.getModel(),
					aTables = this._findTables(),
					oFinalUIState;

				// TODO: this is only a temp solution as long as the model fix the cache issue and we use this additional
				// binding with ownRequest
				oBindingContext = oObjectPage.getBindingContext();

				// Compute Edit Mode
				oFinalUIState = this.editFlow.computeEditMode(oBindingContext);

				// TODO: this should be moved into an init event of the MDC tables (not yet existing) and should be part
				// of any controller extension
				function enableFastCreationRow(oTable, oListBinding) {
					var oFastCreationRow = oTable.getCreationRow(),
						oFastCreationListBinding,
						oFastCreationContext;

					if (oFastCreationRow) {
						oFinalUIState.then(function() {
							if (oFastCreationRow.getVisible()) {
								oFastCreationListBinding = oModel.bindList(oListBinding.getPath(), oListBinding.getContext(), [], [], {
									$$updateGroupId: "doNotSubmit",
									$$groupId: "doNotSubmit"
								});
								oFastCreationContext = oFastCreationListBinding.create();
								oFastCreationRow.setBindingContext(oFastCreationContext);

								// this is needed to avoid console
								oFastCreationContext.created().then(undefined, function() {
									Log.trace("transient fast creation context deleted");
								});
							}
						});
					}
				}

				// should be called only after binding is ready hence calling it in onAfterBinding
				oObjectPage._triggerVisibleSubSectionsEvents();

				// this should not be needed at the all
				function handleTableModifications(oTable) {
					var oBinding = that.getTableBinding(oTable);
					that.editFlow.handlePatchEvents(oBinding);
					// Inform macro field to handle patch events for failed side effects fallback
					FieldRuntime.handlePatchEvents(oBinding);
					enableFastCreationRow(oTable, oBinding);
				}

				// take care on message handling, draft indicator (in case of draft)
				//Attach the patch sent and patch completed event to the object page binding so that we can react
				this.editFlow.handlePatchEvents(oBindingContext).then(function() {
					// same needs to be done for the tables as well
					aTables.forEach(function(oTable) {
						oTable.done().then(handleTableModifications);
					});
				});

				// Inform macro field to handle patch events for failed side effects fallback
				FieldRuntime.handlePatchEvents(oBindingContext);
			},

			onPageReady: function(mParameters) {
				if (mParameters && mParameters.navBack && mParameters.lastFocusControl) {
					var oView = this.getView();
					var oFocusControl = oView.byId(mParameters.lastFocusControl.controlId);
					if (oFocusControl) {
						oFocusControl.applyFocusInfo(mParameters.lastFocusControl.focusInfo);
						return;
					}
				}
				var oObjectPage = this.byId("fe::op");
				// set the focus to the first action button, or to the first editable input if in editable mode
				var isInDisplayMode = oObjectPage.getModel("ui").getProperty("/editable") === "Display";
				var firstElementClickable;
				if (isInDisplayMode) {
					var aActions = oObjectPage.getHeaderTitle().getActions();
					if (aActions.length) {
						firstElementClickable = aActions.find(function(action) {
							// do we need && action.mProperties["enabled"] ?
							return action.mProperties["visible"];
						});
						if (firstElementClickable) {
							firstElementClickable.focus();
						}
					}
				} else {
					var firstEditableInput = oObjectPage._getFirstEditableInput();
					if (firstEditableInput) {
						firstEditableInput.focus();
					}
				}
			},
			getPageTitleInformation: function() {
				var that = this;

				return new Promise(function(resolve, reject) {
					var oObjectPage = that.byId("fe::op");
					var oTitleInfo = { title: "", subtitle: "", intent: "", icon: "" };

					var iObjectPageTitleIndex = oObjectPage.getCustomData().findIndex(function(oCustomData) {
						return oCustomData.mProperties.key === "ObjectPageTitle";
					});

					var iObjectPageSubtitleIndex = oObjectPage.getCustomData().findIndex(function(oCustomData) {
						return oCustomData.mProperties.key === "ObjectPageSubtitle";
					});

					if (oObjectPage.getCustomData()[iObjectPageTitleIndex].mProperties.value) {
						oTitleInfo.title = oObjectPage.getCustomData()[iObjectPageTitleIndex].mProperties.value;
					}

					if (
						iObjectPageSubtitleIndex > -1 &&
						oObjectPage.getCustomData()[iObjectPageSubtitleIndex].getBinding("value") !== undefined
					) {
						oObjectPage
							.getCustomData()
							[iObjectPageSubtitleIndex].getBinding("value")
							.requestValue()
							.then(function(sValue) {
								oTitleInfo.subtitle = sValue;
								resolve(oTitleInfo);
							})
							.catch(function() {
								reject();
							});
					} else {
						resolve(oTitleInfo);
					}
				});
			},

			executeHeaderShortcut: function(sId) {
				var sButtonId = this.getView().getId() + "--" + sId,
					oButton = this.byId("fe::op")
						.getHeaderTitle()
						.getActions()
						.find(function(oElement) {
							return oElement.getId() === sButtonId;
						});
				this._pressButton(oButton);
			},

			executeFooterShortcut: function(sId) {
				var sButtonId = this.getView().getId() + "--" + sId,
					oButton = this.byId("fe::op")
						.getFooter()
						.getContent()
						.find(function(oElement) {
							return oElement.getMetadata().getName() === "sap.m.Button" && oElement.getId() === sButtonId;
						});
				this._pressButton(oButton);
			},

			getFooterVisiblity: function(oEvent) {
				iMessages = oEvent.getParameter("iMessageLength");
				var oLocalUIModel = this.getView().getModel("localUI");
				iMessages > 0
					? oLocalUIModel.setProperty("/showMessageFooter", true)
					: oLocalUIModel.setProperty("/showMessageFooter", false);
			},

			showMessagePopover: function(oMessageButton) {
				var oMessagePopover = oMessageButton.oMessagePopover,
					oItemBinding = oMessagePopover.getBinding("items");
				if (oItemBinding.getLength() > 0) {
					oMessagePopover.openBy(oMessageButton);
				}
			},

			saveDocument: function(oContext) {
				var that = this;
				return this.editFlow
					.saveDocument(oContext)
					.then(function() {
						var oMessageButton = that.getView().byId("MessageButton");
						var oDelegateOnAfter = {
							onAfterRendering: function(oEvent) {
								that.showMessagePopover(oMessageButton);
								oMessageButton.removeEventDelegate(that._oDelegateOnAfter);
								delete that._oDelegateOnAfter;
							}
						};
						that._oDelegateOnAfter = oDelegateOnAfter;
						oMessageButton.addEventDelegate(oDelegateOnAfter, that);
					})
					.catch(function(err) {
						var oMessageButton = that.getView().byId("MessageButton");
						if (oMessageButton) {
							that.showMessagePopover(oMessageButton);
						}
					});
			},

			_updateRelatedApps: function() {
				var oObjectPage = this.byId("fe::op");
				this.transaction.getProgrammingModel(oObjectPage.getBindingContext()).then(function(programmingModel) {
					var oUIModelData = oObjectPage.getModel("ui").getData();
					var oRelatedAppsModel = oObjectPage.getModel("relatedAppsModel");
					// Hide related apps button in edit/create mode for sticky apps. INCIDENT ID : 1980354940
					if (programmingModel === "Sticky" && (oUIModelData.createMode || oUIModelData.editable === "Editable")) {
						oRelatedAppsModel.setProperty("/visibilityBeforeEdit", oRelatedAppsModel.getProperty("/visibility"));
						oRelatedAppsModel.setProperty("/visibility", false);
					} else {
						if (CommonUtils.resolveStringtoBoolean(oObjectPage.data("showRelatedApps"))) {
							CommonUtils.updateRelatedAppsDetails(oObjectPage);
						}
					}
				});
			},

			_pressButton: function(oButton) {
				// if button is enabled and visible fire press event on this button
				if (oButton && oButton.getVisible() && oButton.getEnabled()) {
					oButton.firePress();
				}
			},

			//TODO: This is needed for two workarounds - to be removed again
			_findTables: function() {
				var oObjectPage = this.byId("fe::op"),
					aTables = [];

				function findTableInSubSection(aParentElement, aSubsection) {
					for (var element = 0; element < aParentElement.length; element++) {
						var oParent = aParentElement[element].getAggregation("items") && aParentElement[element].getAggregation("items")[0],
							oElement = oParent && oParent.getAggregation("content");

						if (oElement && oElement.isA("sap.ui.mdc.Table")) {
							aTables.push(oElement);
							if (
								oElement.getType().isA("sap.ui.mdc.table.GridTableType") &&
								!aSubsection.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer")
							) {
								aSubsection.addStyleClass("sapUxAPObjectPageSubSectionFitContainer");
							}
						}
					}
				}

				var aSections = oObjectPage.getSections();
				for (var section = 0; section < aSections.length; section++) {
					var aSubsections = aSections[section].getSubSections();
					for (var subSection = 0; subSection < aSubsections.length; subSection++) {
						findTableInSubSection(aSubsections[subSection].getBlocks(), aSubsections[subSection]);
						findTableInSubSection(aSubsections[subSection].getMoreBlocks(), aSubsections[subSection]);
					}
				}

				return aTables;
			},

			_mergePageAndLineContext: function(oPageContext, oLineContext) {
				var oMixedContext = merge({}, oPageContext, oLineContext),
					oSelectionVariant = NavigationHelper.mixAttributesAndSelectionVariant(oMixedContext, new SelectionVariant());
				return oSelectionVariant;
			},

			handlers: {
				onDataRequested: function(oEvent) {
					// TODO: this is a temporary solution to keep the OP busy until data is received and bound to the object page
					// should be removed once POST with $select and $expand is supported
					var oNavContainer = CommonUtils.getAppComponent(this.getView()).getRootControl();
					BusyLocker.lock(oNavContainer);
				},
				onDataReceived: function(oEvent) {
					// TODO: this is a temporary solution to remove the Navigation Container's busy after data has been bound to object page.
					// should be removed once POST with $select and $expand is supported
					var sErrorDescription = oEvent && oEvent.getParameter("error");
					var oNavContainer = CommonUtils.getAppComponent(this.getView()).getRootControl();
					BusyLocker.unlock(oNavContainer);
					var that = this;
					if (sErrorDescription) {
						// TODO: in case of 404 the text shall be different
						sap.ui
							.getCore()
							.getLibraryResourceBundle("sap.fe.core", true)
							.then(function(oResourceBundle) {
								that.routing.navigateToMessagePage(oResourceBundle.getText("SAPFE_DATA_RECEIVED_ERROR"), {
									title: oResourceBundle.getText("SAPFE_ERROR"),
									description: sErrorDescription,
									navContainer: oNavContainer
								});
							});
					} else {
						this._updateRelatedApps();
					}
				},
				onFieldValueChange: function(oEvent) {
					this.editFlow.syncTask(oEvent.getParameter("promise"));
					FieldRuntime.handleChange(oEvent);
				},
				onRelatedAppsItemPressed: function(oEvent) {
					var aCustomData = oEvent.getSource().getCustomData(),
						oPageContext = oEvent.getSource().getBindingContext(),
						targetSemObject,
						targetAction,
						targetParams;

					for (var i = 0; i < aCustomData.length; i++) {
						var key = aCustomData[i].getKey();
						var value = aCustomData[i].getValue();
						if (key == "targetSemObject") {
							targetSemObject = value;
						} else if (key == "targetAction") {
							targetAction = value;
						} else if (key == "targetParams") {
							targetParams = value;
						}
					}

					targetParams = NavigationHelper.removeSensitiveData(oPageContext, targetParams);

					var oNavArguments = {
						target: {
							semanticObject: targetSemObject,
							action: targetAction
						},
						params: targetParams
					};

					sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oNavArguments);
				},
				/**
				 * Invokes an action - bound/unbound and sets the page dirty
				 * @function
				 * @static
				 * @param {string} sActionName The name of the action to be called
				 * @param {map} [mParameters] contains the following attributes:
				 * @param {sap.ui.model.odata.v4.Context} [mParameters.contexts] contexts Mandatory for a bound action, Either one context or an array with contexts for which the action shall be called
				 * @param {sap.ui.model.odata.v4.ODataModel} [mParameters.model] oModel Mandatory for an unbound action, An instance of an OData v4 model
				 * @sap-restricted
				 * @final
				 **/
				onCallAction: function(oView, sActionName, mParameters) {
					var oController = oView.getController();
					var that = oController;
					return oController.editFlow
						.onCallAction(sActionName, mParameters)
						.then(function() {
							var oMessageButton = that.getView().byId("MessageButton");
							if (oMessageButton.isActive()) {
								that.showMessagePopover(oMessageButton);
							} else if (iMessages) {
								that._oDelegateOnAfter = {
									onAfterRendering: function(oEvent) {
										that.showMessagePopover(oMessageButton);
										oMessageButton.removeEventDelegate(that._oDelegateOnAfter);
										delete that._oDelegateOnAfter;
									}
								};
								oMessageButton.addEventDelegate(that._oDelegateOnAfter, that);
							}
						})
						.catch(function(err) {
							var oMessageButton = that.getView().byId("MessageButton");
							if (oMessageButton) {
								that.showMessagePopover(oMessageButton);
							}
						});
				},
				onDataFieldForIntentBasedNavigation: function(oController, sSemanticObject, sAction, aLineContext, bRequiresContext) {
					var oSelectionVariant;
					var mPageContextData = {};
					var mLineContextData = {};
					if (bRequiresContext || aLineContext) {
						//If requirescontext is true then only consider passing contexts
						if (
							oController
								.getView()
								.getAggregation("content")[0]
								.getBindingContext()
						) {
							mPageContextData = NavigationHelper.removeSensitiveData(
								oController
									.getView()
									.getAggregation("content")[0]
									.getBindingContext()
							); // In OP we will always pass pagecontext when requirescontext is true
						}
						if (aLineContext) {
							if (aLineContext.length > 1) {
								var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates");
								// needs to be fetched via i18n
								MessageBox.error(oResourceBundle.getText("NAVIGATION_DISABLED_MULTIPLE_CONTEXTS"), {
									//Multiple line contexts is not supported yet
									title: "Error"
								});
								return;
							} else if (aLineContext.length === 1) {
								mLineContextData = NavigationHelper.removeSensitiveData(aLineContext[0]); // Line context is considered if a context is selected in the table and also requirescontext is true
							}
						}
						// If Line context exists then we merge it with page context and pass it and if line context does not exist then we pass only page context
						oSelectionVariant = oController._mergePageAndLineContext(mPageContextData, mLineContextData);
					}
					CommonHelper.navigateToExternalApp(oController.getView(), oSelectionVariant, sSemanticObject, sAction);
				},
				/**
				 * Triggers an outbound navigation on Chevron Press
				 * @param {string} outboundTarget name of the outbound target (needs to be defined in the manifest)
				 * @param {sap.ui.model.odata.v4.Context} Context that contain the data for the target app
				 * @returns {Promise} Promise which is resolved once the navigation is triggered (??? maybe only once finished?)
				 */
				onChevronPressNavigateOutBound: function(oController, sOutboundTarget, oContext) {
					var oOutbounds = oController.routing.getOutbounds(),
						oSelectionVariant,
						oDisplayOutbound = oOutbounds[sOutboundTarget],
						mPageContextData = NavigationHelper.removeSensitiveData(
							oController
								.getView()
								.getAggregation("content")[0]
								.getBindingContext()
						);
					var mLineContextData = NavigationHelper.removeSensitiveData(oContext);
					if (oDisplayOutbound) {
						if (oContext) {
							oSelectionVariant = oController._mergePageAndLineContext(mPageContextData, mLineContextData);
						}
						CommonHelper.navigateToExternalApp(
							oController.getView(),
							oSelectionVariant,
							oDisplayOutbound.semanticObject,
							oDisplayOutbound.action,
							CommonHelper.showNavigateErrorMessage
						);

						return Promise.resolve();
					} else {
						throw new Error("outbound target " + sOutboundTarget + " not found in cross navigation definition of manifest");
					}
				}
			}
		});
	}
);
