/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/* global hasher */
sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/controllerextensions/Transaction",
		"sap/fe/core/controllerextensions/Routing",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/fe/macros/field/FieldRuntime",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/AnnotationHelper",
		"sap/fe/core/actions/messageHandling",
		"sap/base/Log",
		"sap/base/util/ObjectPath",
		"sap/fe/navigation/SelectionVariant",
		"sap/m/MessageBox",
		"sap/fe/core/CommonUtils",
		"sap/fe/navigation/NavigationHelper"
		//"sap/fe/core/controllerextensions/AppState" The AppState is currently deactivated
	],
	function(
		Controller,
		JSONModel,
		Transaction,
		Routing,
		EditFlow,
		FieldRuntime,
		CommonHelper,
		AnnotationHelper,
		messageHandling,
		Log,
		ObjectPath,
		SelectionVariant,
		MessageBox,
		CommonUtils,
		NavigationHelper
	) {
		"use strict";

		/*
	 This coding is deactivated as the FLP does not yet support dynamic tiles for OData v4 - activate once
	 the FLP supports OData v4 as well
	 This coding needs to be adapted to the refactoring then for example ListBindingInfo shall be used
	 instead of the ListBinding

	 function fnCreateRequestUrl(oBinding, sPath, oContext, aUrlParams, bBatch){
	 // create the url for the service
	 var sNormalizedPath,
	 aAllUrlParameters = [],
	 sUrl = "";

	 if (sPath && sPath.indexOf('?') !== -1 ) {
	 sPath = sPath.substr(0, sPath.indexOf('?'));
	 }

	 if (!oContext && !jQuery.sap.startsWith(sPath,"/")) {
	 jQuery.sap.log.fatal(oBinding + " path " + sPath + " must be absolute if no Context is set");
	 }

	 sNormalizedPath = oBinding.getModel().resolve(sPath, oContext);

	 //An extra / is present at the end of the sServiceUrl, taking the normalized url from index 1
	 if (!bBatch) {
	 sUrl = oBinding.getModel().sServiceUrl + sNormalizedPath.substr(1);
	 } else {
	 sUrl = sNormalizedPath.substr(sNormalizedPath.indexOf('/') + 1);
	 }

	 if (aUrlParams) {
	 aAllUrlParameters = aAllUrlParameters.concat(aUrlParams);
	 }

	 if (aAllUrlParameters && aAllUrlParameters.length > 0) {
	 sUrl += "?" + aAllUrlParameters.join("&");
	 }
	 return sUrl;
	 }

	 function fnGetDownloadUrl(oBinding) {
	 var aParams = [];

	 if (oBinding.sFilterParams) {
	 aParams.push(oBinding.sFilterParams);
	 }

	 if (oBinding.sCustomParams) {
	 aParams.push(oBinding.sCustomParams);
	 }

	 if (oBinding.mParameters) {
	 if (oBinding.mParameters.$count) {
	 aParams.push("$count="+oBinding.mParameters.$count);
	 }

	 if (oBinding.mParameters.$filter) {
	 aParams.push("$filter=("+oBinding.mParameters.$filter.replace(/'/g,"%27").replace(/ /g,"%20")+")");
	 }

	 if (oBinding.mParameters.$select) {
	 aParams.push("$select="+oBinding.mParameters.$select.replace(/'/g,"%27").replace(/,/g,"%2c"));
	 }

	 // we can skip the $expand for now as the count shall be the same to avoid unnecessary read requests in the backend
	 // if (oBinding.mParameters.$expand) {
	 // 	aParams.push("$expand="+oBinding.mParameters.$expand.replace(/'/g,"%27").replace(/\//g,"%2f"));
	 // }

	 // we set $top to 0 to avoid that any data is requested - we are only interested in the count
	 aParams.push("$top=0");
	 }

	 var sPath = oBinding.getModel().resolve(oBinding.sPath,oBinding.oContext);

	 if (sPath) {
	 return fnCreateRequestUrl(oBinding,sPath, null, aParams);
	 }
	 }*/

		return Controller.extend("sap.fe.templates.ListReport.ListReportController", {
			transaction: Transaction,
			routing: Routing,
			editFlow: EditFlow,
			//appState : AppState, The AppState is currently deactivated

			// TODO: get rid of this
			// it's currently needed to show the transient messages after the table request fails
			// we assume that the table should show those messages in the future
			messageHandling: messageHandling,

			onInit: function() {
				// set filter bar to disabled until app state is loaded
				// TODO: there seems to be a big in the filter layout - to be checked
				//this.oFilterBar.setEnabled(false);

				// disable for now - TODO: enable with actions again
				//this.setShareModel();

				// store the controller for later use
				// Set internal UI model and model from transaction controller
				this.getView().setModel(new JSONModel(), "sap.fe.templates.ListReport");
				this.getView().setModel(this.editFlow.getUIStateModel(), "ui");
				this.getView().setModel(
					new JSONModel({
						sessionOn: false
					}),
					"localUI"
				);

				// Store conditions from filter bar
				// this is later used before navigation to get conditions applied on the filter bar
				this.filterBarConditions = {};
				// request a new appState Model for the view
				/*
			 // The AppState is currently deactivated
			this.appState.requestAppStateModel(this.getView().getId()).then(function(oAppStateModel){
				that.getView().setModel(oAppStateModel, "sap.fe.appState");

				// This is only a workaround as the controls do not yet support binding the appState
				var oAppState = oAppStateModel.getData();
				if (oAppState && oAppState.filterBar) {
					// an app state exists, apply it
					that.applyAppStateToFilterBar().then(function () {
						// enable filterbar once the app state is applied
						that.oFilterBar.setEnabled(true);
					});
				} else {
					that.oFilterBar.setEnabled(true);
				}

				// attach to further app state changed
				//oAppStateModel.bindList("/").attachChange(that.applyAppStateToFilterBar.bind(that));
			});
			*/
			},
			onExit: function() {
				var oView = this.getView();
				oView.getModel("sap.fe.templates.ListReport").destroy();
				oView.getModel("ui").destroy();
				oView.getModel("localUI").destroy();
				delete this.filterBarConditions;
				delete this._oListReportControl;
			},
			onAfterBinding: function(oBindingContext, mParameters) {
				if (this.routing.isUIStateDirty()) {
					var oTableBinding = this.getTableBinding();
					if (oTableBinding) {
						oTableBinding.refresh();
					}
					this.routing.setUIStateProcessed();
				}
			},

			onPageReady: function(mParameters) {
				var oView = this.getView();
				// set the focus to the first action button, or to the first editable input if in editable mode
				if (mParameters && mParameters.lastFocusControl) {
					var oFocusControl = oView.byId(mParameters.lastFocusControl.controlId);
					if (oFocusControl) {
						oFocusControl.applyFocusInfo(mParameters.lastFocusControl.focusInfo);
					}
				}
			},

			getPageTitleInformation: function() {
				var that = this;
				return new Promise(function(resolve, reject) {
					var oTitleInfo = { title: "", subtitle: "", intent: "", icon: "" };
					oTitleInfo.title = that
						.getView()
						.getContent()[0]
						.data().ListReportTitle;
					oTitleInfo.subtitle = that
						.getView()
						.getContent()[0]
						.data().ListReportSubtitle;
					resolve(oTitleInfo);
				});
			},

			_getTableControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("reportTableId");
			},

			_getTableControl: function() {
				if (!this._oListReportControl) {
					this._oListReportControl = this.getView().byId(this._getTableControlId());
				}
				return this._oListReportControl;
			},

			_initializeTableBinding: function() {
				var oTableControl = this._getTableControl();
				if (!this._bBindingInitialized) {
					if (!oTableControl) {
						this.getView().attachEventOnce("modelContextChange", this.initializeTableBinding, this);
					} else {
						oTableControl.done().then(oTableControl.rebindTable.bind(oTableControl));
						this._bBindingInitialized = true;
					}
				}
			},

			getTableBinding: function() {
				var oTableControl = this._getTableControl(),
					oBinding = oTableControl && oTableControl._getRowBinding();

				if (!oBinding) {
					this._initializeTableBinding();
				}
				return oBinding;
			},

			_getMergedContext: function(oContext, filterBarConditions) {
				var oFilterBarSV, oSelectionVariant;
				oFilterBarSV = NavigationHelper.addConditionsToSelectionVariant(new SelectionVariant(), filterBarConditions);
				oSelectionVariant = NavigationHelper.mixAttributesAndSelectionVariant(oContext.getObject(), oFilterBarSV);
				return NavigationHelper.removeSensitiveData(oContext, oSelectionVariant);
			},

			// This is only a workaround as the filterBar does not yet support binding the appState
			/*
		 // The AppState is currently deactivated
		createAppStateFromFilterBar: function () {
			var sFilterBarAppState = this.oFilterBar.getAppState();

			if (!sFilterBarAppState) {
				// no app state exists and filter bar does not have any app state relevant changes, there is
				// no need to generate an app state
				return;
			}

			var oAppState = {
				filterBar: sFilterBarAppState
			};

			this.getView().getModel("sap.fe.appState").setData(oAppState);
		},

		// This is only a workaround as the filterBar does not yet support binding the appState
		applyAppStateToFilterBar: function () {
			var	oAppState = this.getView().getModel("sap.fe.appState").getData();

			if (oAppState && oAppState.filterBar) {
				return this.oFilterBar.setAppState(oAppState.filterBar);
			}
		},
		*/

			setShareModel: function() {
				// TODO: deactivated for now - currently there is no _templPriv anymore, to be discussed
				// this method is currently not called anymore from the init method

				var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
				//var oManifest = this.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");
				//var sBookmarkIcon = (oManifest && oManifest.icons && oManifest.icons.icon) || "";

				//shareModel: Holds all the sharing relevant information and info used in XML view
				var oShareInfo = {
					bookmarkTitle: document.title, //To name the bookmark according to the app title.
					bookmarkCustomUrl: function() {
						var sHash = hasher.getHash();
						return sHash ? "#" + sHash : window.location.href;
					},
					/*
				 To be activated once the FLP shows the count - see comment above
				 bookmarkServiceUrl: function() {
				 //var oTable = oTable.getInnerTable(); oTable is already the sap.fe table (but not the inner one)
				 // we should use table.getListBindingInfo instead of the binding
				 var oBinding = oTable.getBinding("rows") || oTable.getBinding("items");
				 return oBinding ? fnGetDownloadUrl(oBinding) : "";
				 },*/
					isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive()
				};

				var oTemplatePrivateModel = this.getOwnerComponent().getModel("_templPriv");
				oTemplatePrivateModel.setProperty("/listReport/share", oShareInfo);
			},

			handlers: {
				onShareListReportActionButtonPress: function(oEvent) {
					var oGetResourceBundle = this.getView()
						.getModel("sap.fe.i18n")
						.getResourceBundle();
					if (!this._oShareActionButton) {
						this._oShareActionButton = sap.ui.xmlfragment("sap.fe.templates.ListReport.ShareSheet", {
							shareEmailPressed: function() {
								oGetResourceBundle.then(function(oBundle) {
									sap.m.URLHelper.triggerEmail(
										null,
										oBundle.getText("SAPFE_EMAIL_SUBJECT", [document.title]),
										document.URL
									);
								});
							},
							//TODO: JAM integration to be implemented
							shareJamPressed: function() {}
						});
						this.getView().addDependent(this._oShareActionButton);
					}
					this._oShareActionButton.openBy(oEvent.getSource());
				},
				onFiltersChanged: function(oEvent) {
					// TODO this is a workaround for missing MDC delegate functionality
					var oFilterBar = oEvent.getSource(),
						sListBindingName = oFilterBar.data("listBindingNames"),
						oMdcTable = this.getView().byId(sListBindingName);

					if (oMdcTable && oMdcTable.isTableBound() && !oMdcTable._oTable.getShowOverlay()) {
						// TODO use of internal member!!
						oMdcTable._oTable.setShowOverlay(true);
						oMdcTable
							._getRowBinding()
							.attachEventOnce("dataReceived", oMdcTable._oTable.setShowOverlay.bind(oMdcTable._oTable, false));
					}
				},
				onSearch: function(oEvent) {
					var oBinding = this.getTableBinding(),
						oFilterBar = oEvent.getSource(),
						oFilters = oFilterBar.getFilters(),
						sSearch = oFilterBar.getSearch() || undefined;

					// store filter bar conditions to use later while navigation
					this.filterBarConditions = oEvent.getParameter("conditions");

					CommonHelper.filterAggregation(oBinding, oFilters, sSearch);
				},
				onFieldValueChange: function(oEvent) {
					this.editFlow.syncTask(oEvent.getParameter("promise"));
					FieldRuntime.handleChange(oEvent);
				},
				onDataFieldForIntentBasedNavigation: function(oController, sSemanticObject, sAction, vContext) {
					// 1. Also consider FilterBar conditions
					// 2. convert them into SV
					// 3. Merge both oContext and SV from FilterBar (2)
					// if there is no FilterBar conditions then simply use oContext to create a SelectionVariant
					var oSelectionVariant;
					if (vContext) {
						if (vContext.length > 1) {
							var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates");
							// needs to be fetched via i18n
							MessageBox.error(oResourceBundle.getText("NAVIGATION_DISABLED_MULTIPLE_CONTEXTS"), {
								title: "Error"
							});
							return;
						} else if (vContext.length === 1) {
							oSelectionVariant = oController._getMergedContext(vContext[0], oController.filterBarConditions);
						}
					}

					CommonHelper.navigateToExternalApp(oController.getView(), oSelectionVariant, sSemanticObject, sAction);
				},
				/**
				 * Triggers an outbound navigation on Chevron Press
				 * @param {string} outboundTarget name of the outbound target (needs to be defined in the manifest)
				 * @param {sap.ui.model.odata.v4.Context} Context that contain the data for the target app
				 * @returns {Promise} Promise which is resolved once the navigation is triggered (??? maybe only once finished?)
				 *
				 * @sap-restricted
				 * @final
				 */
				onChevronPressNavigateOutBound: function(oController, sOutboundTarget, oContext) {
					var oOutbounds = oController.routing.getOutbounds(),
						oSelectionVariant,
						oDisplayOutbound = oOutbounds[sOutboundTarget];
					if (oDisplayOutbound) {
						if (oContext) {
							oSelectionVariant = oController._getMergedContext(oContext, oController.filterBarConditions);
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
