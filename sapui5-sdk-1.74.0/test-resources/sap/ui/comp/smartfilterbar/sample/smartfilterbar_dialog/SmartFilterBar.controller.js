sap.ui.define([
	"sap/ui/thirdparty/jquery", 'sap/ui/model/odata/ODataUtils', 'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/ui/layout/form/Form', 'sap/ui/layout/form/FormContainer', 'sap/ui/layout/form/FormElement', 'sap/ui/layout/form/ResponsiveGridLayout', 'sap/ui/core/util/MockServer', "sap/ui/generic/app/navigation/service/NavigationHandler", "sap/ui/generic/app/navigation/service/SelectionVariant", 'sap/ui/comp/state/UIState', 'sap/ui/comp/filterbar/VariantConverterFrom'
], function(jQuery, ODataUtils, Controller, MessageToast, Form, FormContainer, FormElement, ResponsiveGridLayout, MockServer, NavigationHandler, SelectionVariant, UIState, VariantConverterFrom) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar_dialog.SmartFilterBar", {

		onInit: function() {
			var oModel, oView;

			var sResourceUrl;
			sResourceUrl = "smartfilterbar_dialog/i18n/i18n.properties";
			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: sResourceUrl,
				bundleLocale: sLocale
			});
			this.getView().setModel(oResourceModel, "@i18n");

			var oMockServer = new MockServer({
				rootUri: "/foo/"
			});
			this._oMockServer = oMockServer;
			var sMockdataUrl = jQuery.sap.getResourcePath("sap/ui/comp/sample/smartfilterbar_dialog/mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"ZEPM_C_SALESORDERITEMQUERYResults", "ZEPM_C_SALESORDERITEMQUERY", "VL_FV_XFELD", "VL_SH_H_T001", "VL_SH_H_CATEGORY"
				]
			});
			oMockServer.start();

			oModel = new sap.ui.model.odata.v2.ODataModel("/foo", {
				json: true,
				annotationURI: jQuery.sap.getResourcePath("sap/ui/comp/sample/smartfilterbar_dialog/mockserver") + "/annotations.xml"
			});

			// oModel.setCountSupported(false);
			oView = this.getView();
			// oView.setModel(oModel);

			var oComp = this.getOwnerComponent();
			oComp.setModel(oModel);

			this._oFilterBar = sap.ui.getCore().byId(oView.getId() + "--smartFilterBar");

			this._oOutputParam = sap.ui.getCore().byId(oView.getId() + "--outputAreaParam");
			this._oOutputFilters = sap.ui.getCore().byId(oView.getId() + "--outputAreaFilters");

			this._oOutputDataSuite = sap.ui.getCore().byId(oView.getId() + "--outputAreaDataSuite");
			this._oOutputValueTexts = sap.ui.getCore().byId(oView.getId() + "--outputAreaValueTexts");

			this._outputAreaToSelectionVariant = sap.ui.getCore().byId(oView.getId() + "--outputAreaToSelectionVariant");
			this._outputAreaFromSelectionVariant = sap.ui.getCore().byId(oView.getId() + "--outputAreaFromSelectionVariant");

			this._oStatusText = sap.ui.getCore().byId(oView.getId() + "--statusText");

			this._sApiLevel = null;
			this._bStrictMode = true;
		},

		triggerClearMeasures: function(oEvent) {
			var oInnerAppState = {}, oUiState, oRouter = {}, oAppState, oNavService, oNonMeasureData;

			oNavService = {
				toExternal: function() {
				},
				createEmptyAppState: function() {
					return oAppState;
				},
				isNavigationSupported: function(oNav) {

					var oMyDeferred = jQuery.Deferred();
					oMyDeferred.resolve([
						{
							supported: true
						}
					]);
					return oMyDeferred;
				}
			};

			sap.ui.generic.app.navigation.service.NavigationHandler.prototype._getRouter = function() {
				return oRouter;
			};
			sap.ui.generic.app.navigation.service.NavigationHandler.prototype._getAppNavigationService = function() {
				return oNavService;
			};

			oUiState = this._oFilterBar.getUiState();

			oInnerAppState.selectionVariant = oUiState.getSelectionVariant();
			oInnerAppState.valueTexts = oUiState.getValueTexts();

			var oNavigationHandler = new NavigationHandler(this);
			oNonMeasureData = oNavigationHandler._removeMeasureBasedInformation(oInnerAppState);

			this._oOutputDataSuite.setValue(JSON.stringify(oNonMeasureData.selectionVariant));
			this._oOutputValueTexts.setValue(JSON.stringify(oNonMeasureData.valueTexts));
		},

		triggerIsSensitiveCheck: function(oEvent) {
			var oInnerAppState = {}, oUiState, oRouter = {}, oAppState, oNavService, oSensData;

			oAppState = {
				getKey: function() {
					return "key";
				},
				setData: function(oData) {
					oSensData = oData;
				},
				save: function() {
					var oMyDeferred = jQuery.Deferred();
					oMyDeferred.resolve("");
					return oMyDeferred;
				}
			};
			oNavService = {
				toExternal: function() {
				},
				createEmptyAppState: function() {
					return oAppState;
				},
				isNavigationSupported: function(oNav) {

					var oMyDeferred = jQuery.Deferred();
					oMyDeferred.resolve([
						{
							supported: true
						}
					]);
					return oMyDeferred;
				}
			};

			sap.ui.generic.app.navigation.service.NavigationHandler.prototype._getRouter = function() {
				return oRouter;
			};
			sap.ui.generic.app.navigation.service.NavigationHandler.prototype._getAppNavigationService = function() {
				return oNavService;
			};

			oUiState = this._oFilterBar.getUiState();

			oInnerAppState.selectionVariant = oUiState.getSelectionVariant();
			oInnerAppState.valueTexts = oUiState.getValueTexts();

			var oNavigationHandler = new NavigationHandler(this);
			oNavigationHandler.storeInnerAppState(oInnerAppState).then(function(oData) {

				// this._setDataSuiteFormat(oSensData.selectionVariant, JSON.stringify(oSensData.valueTexts));

				this._oOutputDataSuite.setValue(JSON.stringify(oSensData.selectionVariant));
				this._oOutputValueTexts.setValue(JSON.stringify(oSensData.valueTexts));
			}.bind(this));
		},


		onDialogCancel: function(oEvent) {
			this._doOutput("Cancel pressed!");
		},
		onDialogSearch: function(oEvent) {
			this._doOutput("Search pressed!");
		},
		onDialogClosed: function(oEvent) {
			this._doOutput(oEvent.getParameter("context"));
		},

		onDialogOpened: function(oEvent) {
			var aContent = this._oFilterBar.getFilterDialogContent();

			var oToolbar = new sap.m.Toolbar();
			oToolbar.addContent(new sap.m.Button({
				text: "Switch",
				press: function() {
					this._toggle();
				}.bind(this)
			}));

			var oForm = new Form({
				layout: new ResponsiveGridLayout({
					columnsL: 1,
					columnsM: 1
				})
			});
			oForm.setToolbar(oToolbar);
			var oFormContainer = new FormContainer({
				title: "Different Content"
			});
			var oFormElement = new FormElement({
				label: "Test",
				fields: [
					new sap.m.Button({
						text: "Simulate LiveMode change",
						press: function() {
							this._oFilterBar.search();
						}.bind(this)
					})
				]
			});
			oFormContainer.addFormElement(oFormElement);

			oForm.addFormContainer(oFormContainer);

			this._oFilterBar.addFilterDialogContent(oForm);

			aContent[0].setToolbar(oToolbar.clone());

			/*
			 * this._oFilterBar.setContentWidth(600); this._oFilterBar.setContentHeight(360); this._oFilterBar.addFilterDialogContent(aContent[1]);
			 */
			this._oFilterBar.addFilterDialogContent(aContent[0]);
		},

		_toggle: function() {
			var aContent = this._oFilterBar.getFilterDialogContent();
			if (aContent && (aContent.length === 2)) {
				if (aContent[0].getVisible()) {
					aContent[0].setVisible(false);
					aContent[1].setVisible(true);
				} else {
					aContent[0].setVisible(true);
					aContent[1].setVisible(false);
				}
			}
		},

		_getDataSuiteFormat: function() {
			var oUIState = this._oFilterBar.getUiState();
			var oDataSuite = oUIState.getSelectionVariant();
			var oValueTexts = oUIState.getValueTexts();

			return {
				selectionVariant: JSON.stringify(oDataSuite),
				valueTexts: JSON.stringify(oValueTexts)
			};
		},

		_setDataSuiteFormat: function(oData, sValueTexts) {

			var oUiState = new UIState({
				selectionVariant: oData,
				valueTexts: sValueTexts ? JSON.parse(sValueTexts) : null
			});

			var oObj = {
				strictMode: this._bStrictMode,
				replace: true
			};

			this._oFilterBar.setUiState(oUiState, oObj);
		},

		onSearchForFilters: function(oEvent) {
			this._doOutput("Search triggered with filters: '" + oEvent.getParameters().newValue);
		},

		printFilters: function(aFilters) {
			var oFilterProvider = this._oFilterBar._oFilterProvider;

			var sText = ODataUtils._createFilterParams(aFilters, oFilterProvider._oParentODataModel.oMetadata, oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType));

			return decodeURI(sText);

		},

		onSearch: function(oEvent) {
			this._doOutput("Search triggered");

			var sParamBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oOutputParam.setValue(sParamBinding);

			var sFilters = this.printFilters(this._oFilterBar.getFilters());
			this._oOutputFilters.setValue(sFilters);

			var oDataSuite = this._getDataSuiteFormat();
			this._oOutputDataSuite.setValue(oDataSuite.selectionVariant);
			this._oOutputValueTexts.setValue(oDataSuite.valueTexts);

			this._outputAreaToSelectionVariant.setValue("");
			// this._outputAreaFromSelectionVariant.setValue("");
		},

		onClear: function(oEvent) {
			this._doOutput("Clear pressed!");
		},

		onRestore: function(oEvent) {
			this._doOutput("Restore pressed!");
		},

		onCancel: function(oEvent) {
			this._doOutput("Cancel pressed!");
		},

		onExit: function() {
			this._oMockServer.stop();
		},

		onBeforeRebindTable: function(oEvent) {

			var oAnalyticalBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oTable.setTableBindingPath(oAnalyticalBinding);
		},

		toggleAPILevel: function(oEvent) {

			var sText, oButton = this.getView().byId("toggleAPILevel");

			if (!oButton) {
				return;
			}

			if (this._sApiLevel === "13.0") {
				this._sApiLevel = null;
				sText = "Current: Parameter Only";
			} else {
				this._sApiLevel = "13.0";
				sText = "Current: Single Value Filters";
			}

			oButton.setText(sText);

		},

		toggleStrictMode: function() {
			var oButton = this.getView().byId("toggleStrictMode");

			if (!oButton) {
				return;
			}

			if (this._bStrictMode) {
				oButton.setText("Mode: non strict");
			} else {
				oButton.setText("Mode: strict");
			}

			this._bStrictMode = !this._bStrictMode;

		},

		toggleErrorMode: function() {
			var oVM = this.getView().byId("__SVM01");

			if (!oVM) {
				return;
			}

			oVM.setInErrorState(!oVM.getInErrorState());

		},

		toggleShowGoOnFB: function() {

			this._oFilterBar.setShowGoOnFB(!this._oFilterBar.getShowGoOnFB());
		},

		toggleUseToolbar: function() {

			this._oFilterBar.setUseToolbar(!this._oFilterBar.getUseToolbar());

		},

		toggleUpdateMode: function() {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!oButton) {
				return;
			}

			var bLiveMode = this._oFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}

			this._oFilterBar.setLiveMode(!bLiveMode);
		},

		onCreateToSelectionVariant: function() {

			var sTextAreaText = this._oOutputDataSuite.getValue();

			this._outputAreaToSelectionVariant.setValue("");
			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = new SelectionVariant(sTextAreaText);

				this._outputAreaToSelectionVariant.setValue(oSelVariant.toJSONString());
			}
		},

		onCreatetFromSelectionVariant: function() {
			var sPayload, oDataSuite = {}, sTextAreaText = this._outputAreaToSelectionVariant.getValue();
			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = JSON.parse(sTextAreaText);

				oDataSuite.SelectionVariant = oSelVariant;
				if (oSelVariant.Parameters) {
					oDataSuite.Parameters = oSelVariant.Parameters;
				}
				if (oSelVariant.SelectOptions) {
					oDataSuite.SelectOptions = oSelVariant.SelectOptions;
				}

				this._setDataSuiteFormat(oDataSuite.SelectionVariant, this._oOutputValueTexts.getValue());

				oDataSuite = this._getDataSuiteFormat();

				var oConverter = new VariantConverterFrom();
				var oContent = oConverter.convert(oDataSuite.selectionVariant, this._oFilterBar, this._bStrictMode);
				if (oContent && oContent.payload) {
					sPayload = UIState.enrichWithValueTexts(oContent.payload, oDataSuite.sValueTexts);
				}

				this._outputAreaFromSelectionVariant.setValue(sPayload);

				if (oDataSuite.selectionVariant !== this._oOutputDataSuite.getValue()) {
					this._outputAreaFromSelectionVariant.setValueState("Error");
				} else {
					this._outputAreaFromSelectionVariant.setValueState("None");
				}

			}
		},

		onAssignedFiltersChanged: function(oEvent) {
			if (this._oFilterBar) {
				var sText = this._oFilterBar.retrieveFiltersWithValuesAsText();
				this._oStatusText.setText(sText);
			}
		},

		_doOutput: function(sText) {
			try {
				MessageToast.show(sText);
			} catch (ex) {
				// Do Nothing...
			}
		}

	});
});
