sap.ui.require([
	"sap/ui/comp/variants/VariantManagement",
	"sap/ui/comp/variants/VariantItem",
	"sap/ui/model/json/JSONModel",
	"sap/m/App",
	"sap/m/Page",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/Toolbar",
	"sap/m/Button",
	"sap/ui/layout/VerticalLayout",
	"sap/ui/core/ValueState"
	],
	function(
		VariantManagement,
		VariantItem,
		JSONModel,
		App,
		Page,
		MessageToast,
		Text,
		Toolbar,
		Button,
		VerticalLayout,
		ValueState
	) {
	"use strict";

	//global noshow flag
	var _noShow = true;
	// create and add app
	var app = new App("myApp", {initialPage:"variantPage"});
	app.placeAt("body");

	var fOriginalGetTransport = VariantManagement.prototype._getFlTransportSelection;

	var fMockGetTransport = function() {
		return ({
			selectTransport: function(o, s, e, b) {

				var oEvent = {
					mParameters: {
						selectedPackage: "/UIF/LREP_HOME_CONTENT",
						selectedTransport: "U31K000001"
					},
					getParameters: function() {
						return this.mParameters;
					}
				};
				s(oEvent);
			}
		});
	};
	var bBackendEnabled = false;
	VariantManagement.prototype._getFlTransportSelection = fMockGetTransport;
	// variantManangement Data
	var variantData = {
		variant: [
			{
				text: "Accounts by Name",
				key: "ABN",
				exe: false,
				readOnly: true,
				global: true,
				trans: "",
				pack: "/SAP/WHATEVER",
				namespace: "com.sap.lrep",
				accessOptions: "R",
				labelReadOnly: true
			}, {
				text: "My Accounts last Week",
				key: "MALW",
				exe: true,
				readOnly: false,
				global: false,
				trans: "",
				pack: "$TMP",
				namespace: "com.sap.lrep",
				accessOptions: "RWD",
				labelReadOnly: false
			}, {
				text: "Line Items by Contact",
				key: "005056AB1D001ED49686ADC6098EE24E",
				exe: false,
				readOnly: false,
				global: true,
				trans: "",
				pack: "/UIF/LREP_HOME_CONTENT",
				namespace: "com.sap.lrep",
				accessOptions: "RWD",
				labelReadOnly: false
			}, {
				text: "Line Items by Rep",
				key: "LIBR",
				exe: false,
				readOnly: false,
				global: true,
				trans: "",
				pack: "$TMP",
				namespace: "com.sap.lrep",
				accessOptions: "RWD",
				labelReadOnly: false
			}, {
				text: "Line Items by Res",
				key: "LIBRS",
				exe: false,
				readOnly: false,
				global: true,
				trans: "",
				pack2: "/UIF/LREP_HOME_CONTENT",
				pack: "/UIF/LREP_PROVIDER",
				namespace: "com.sap.lrep",
				accessOptions: "RWD",
				labelReadOnly: false
			}, {
				text: "Line Items by Ref",
				key: "LIBRSA",
				exe: false,
				readOnly: false,
				global: true,
				trans: "",
				pack: "/UIF/LREP_HOME_CONTENT",
				namespace: "com.sap.lrep",
				accessOptions: "RD",
				labelReadOnly: true
			}, {
				text: "My Variant",
				key: "MV",
				exe: true,
				readOnly: false,
				global: false,
				trans: "",
				pack: "$TMP",
				namespace: "com.sap.lrep",
				accessOptions: "RWD",
				labelReadOnly: false
			}
		]
	};

	var itemVariantTemplate = new VariantItem({
		text: "{text}",
		key: "{key}",
		executeOnSelection: "{exe}",
		readOnly: "{readOnly}",
		global: "{global}",
		lifecycleTransportId: "{trans}",
		lifecyclePackage: "{pack}",
		namespace: "{namespace}",
		accessOptions: "{accessOptions}",
		labelReadOnly: "{labelReadOnly}"
	});

	function bindVariantData(data, itemTemplate, variantManagement) {
		var oModel = new JSONModel();
		// set the data for the model
		oModel.setData(data);
		// set the model to the list
		variantManagement.setModel(oModel);

		// bind Aggregation
		variantManagement.bindAggregation("variantItems", "/variant", itemTemplate);
	}

	// variantManangement control
	var vm = new VariantManagement({
		_getFlTransportSelection: function() {
//			debugger;
			return {
				selectTransport: fMockGetTransport
			};
		},
		save: function(event) {
			var params = event.getParameters();
			var sMessage = "New Name: " + params.name + "\n Default: " + params.def + "\n Overwrite: " + params.overwrite + "\n Selected Item Key: " + params.key + "\n Execute: " + params.exe + "\n Create Tile: " + params.tile + "\n Global: " + params.global + "\n Package: " + params.lifecyclePackage + "\n Transport: " + params.lifecycleTransportId;
			MessageToast.show(sMessage, {
				duration: 3000, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true
			// default
			});
		},
		manage: function(event) {
			var params = event.getParameters();
			var renamed = params.renamed;
			var deleted = params.deleted;
			var defaultKey = params.def;
			var exed = params.exe;

			var sMessage = "renamed: \n";
			for (var h = 0; h < renamed.length; h++) {
				sMessage += renamed[h].key + "=" + renamed[h].name + "\n";
			}
			sMessage += "\n\ndeleted: ";
			for (var f = 0; f < deleted.length; f++) {
				sMessage += deleted[f] + ",";
			}
			sMessage += "\n\nexed: ";
			for (var e = 0; e < exed.length; e++) {
				sMessage += exed[e].key + "=" + exed[e].exe + "\n";
			}
			sMessage += "\ndefault: " + defaultKey;
			var aItems = vm.getVariantItems();
			for (var ii = 0; ii < aItems.length; ii++) {
/* eslint-disable no-alert */
				alert(aItems[ii].getKey() + ":" + aItems[ii].getLifecyclePackage() + ":" + aItems[ii].getLifecycleTransportId());
/* eslint-enable no-alert */
			}
			MessageToast.show(sMessage, {
				duration: 3000, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true
			// default
			});

		},
		select: function(event) {
			var params = event.getParameters();
			var sMessage = "New Variant Selected: " + params.key;
			if (_noShow == false) {
				MessageToast.show(sMessage, {
					duration: 3000, // default
					width: "15em", // default
					my: "center top", // default
					at: "center top", // default
					of: window, // default
					offset: "0 0", // default
					collision: "fit fit", // default
					onClose: null, // default
					autoClose: true, // default
					animationTimingFunction: "ease", // default
					animationDuration: 1000, // default
					closeOnBrowserNavigation: true
				// default
				});
			}
		},
		enabled: false,
		showExecuteOnSelection: true,
		showCreateTile: true,
		showShare: true,
		lifecycleSupport: true
	});

	//vm.createDefaultVariantEntry();

	//init VariantManagement
	bindVariantData(variantData, itemVariantTemplate, vm);
	//vm.setInitialSelectionKey("MV");
	//vm.setInitialSelectionKey("ABN");
	vm.setDefaultVariantKey("MALW");
	vm.setEnabled(true);
	vm.setVisible(true);
	//create empty Variant Management Control
	var oEmptyVM = new VariantManagement({
		save: function(event) {
			var params = event.getParameters();
			var sMessage = "New Name: " + params.name + "\nDefault: " + params.def + "\nOverwrite:" + params.overwrite + "\nSelected Item Key: " + params.key;
			MessageToast.show(sMessage, {
				duration: 3000, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true
			// default
			});
		},
		manage: function(event) {
			var params = event.getParameters();
			var renamed = params.renamed;
			var deleted = params.deleted;
			var defaultKey = params.defaultKey;
			var sMessage = "renamed: \n";
			for (var h = 0; h < renamed.length; h++) {
				sMessage += renamed[h].key + "=" + renamed[h].name + "\n";
			}
			sMessage += "\n\ndeleted: ";
			for (var f = 0; f < deleted.length; f++) {
				sMessage += deleted[f] + ",";
			}
			sMessage += "\ndefault: " + defaultKey;

			MessageToast.show(sMessage, {
				duration: 3000, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true
			// default
			});
		},
		select: function(event) {
			var params = event.getParameters();
			var sMessage = "New Variant Selected: " + params.key;
			if (_noShow == false) {
				MessageToast.show(sMessage, {
					duration: 3000, // default
					width: "15em", // default
					my: "center top", // default
					at: "center top", // default
					of: window, // default
					offset: "0 0", // default
					collision: "fit fit", // default
					onClose: null, // default
					autoClose: true, // default
					animationTimingFunction: "ease", // default
					animationDuration: 1000, // default
					closeOnBrowserNavigation: true
				// default
				});
			}
		}
	});

	var oEmptyVM2 = new VariantManagement({
		showExecuteOnSelection: true,
		showCreateTile: true,
		showShare: true,
		lifecycleSupport: true
	});
	oEmptyVM2._setBackwardCompatibility(false);
	// create and add a page with texts
	var page = new Page("variantPage", {

		showNavButton: true,
		title: "Account Line Items",
		headerContent: [
		//				                vm
		],
		content: [
			new VerticalLayout({
				content: [
					new Text({
						text: "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
					}), new Toolbar({
						content: [
							vm
						]
					}), new Text({
						text: "xxx(12rem)xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
						width: "12rem",
						wrapping: false
					}), new Button({
						text: "ClearVariantSelection",
						press: function(oEvent) {
							vm.clearVariantSelection();
						}
					}), new Button({
						text: "SetInitialSelection",
						press: function(oEvent) {
							vm.setInitialSelectionKey("ABN");
						}
					}), new Button({
						text: "DestroyallItemsandRepopulate",
						press: function(oEvent) {
							bindVariantData(variantData, itemVariantTemplate, vm);
						}
					}), new Button({
						text: "GetVariantSelection",
						press: function(oEvent) {
							var sMessage = "Variant Selection key: " + vm.getSelectionKey();
							MessageToast.show(sMessage, {
								duration: 3000, // default
								width: "15em", // default
								my: "center center", // default
								at: "center center", // default
								of: window, // default
								offset: "0 0", // default
								collision: "fit fit", // default
								onClose: null, // default
								autoClose: true, // default
								animationTimingFunction: "ease", // default
								animationDuration: 1000, // default
								closeOnBrowserNavigation: true
							// default
							});
						}
					}), new Button({
						text: "Toggle Visible",
						press: function(oEvent) {
							var bVisible = vm.getVisible();
							vm.setVisible(!bVisible);
						}
					}), new Button({
						text: "Toggle enabled",
						press: function(oEvent) {
							var bEnabled = vm.getEnabled();
							vm.setEnabled(!bEnabled);
						}
					}), new Button({
						text: "Set Modified",
						press: function(oEvent) {
							vm.currentVariantSetModified(true);
						}
					}), new Button({
						text: "Toggle Compact Mode",
						press: function(oEvent) {
							if (page.hasStyleClass("sapUiSizeCompact")) {
								page.removeStyleClass("sapUiSizeCompact");
							} else {
								page.addStyleClass("sapUiSizeCompact");
							}
						}
					}), new Button({
						text: "Enable Transport Backend",
						press: function(oEvent) {
//							debugger;
							if (!bBackendEnabled) {
								this.setText("Enable Transport Mock");
								vm._getFlTransportSelection = fOriginalGetTransport;
							} else {
								this.setText("Enable Transport Backend");
								vm._getFlTransportSelection = fMockGetTransport;
							}
							bBackendEnabled = !bBackendEnabled;
						}
					}), new Button({
						text: "ToggleErrorState",
						press: function(oEvent) {
							if (vm.getValueState() == ValueState.Error) {
								vm.setValueState(ValueState.None);
							} else {
								vm.setValueState(ValueState.Error);
								vm.setValueStateText("VM not configured correctly" + new Date().toString());
							}
						}
					}), new Button({
						text: "Enable Manual Key Entry",
						press: function(oEvent) {
							if (vm.bManualVariantKey) {
								vm._enableManualVariantKey(false);
								this.setText("Enable Manual Key Entry");
							} else {
								vm._enableManualVariantKey(true);
								this.setText("Disable Manual Key Entry");
							}
						}
					}), new Button({
						text: "Enable Execute on Select for Standard Entry",
						press: function(oEvent) {
							if (vm.bExecuteOnSelectForStandard) {
								vm._executeOnSelectForStandardVariant(false);
								this.setText("Enable Execute on Select for Standard Entry");
							} else {
								vm._executeOnSelectForStandardVariant(true);
								this.setText("Disable Execute on Select for Standard Entry");
							}
						}
					}), new Button({
						text: "Replace text for Standard Entry",
						press: function(oEvent) {
							if (vm.getStandardItemText() == "") {
								vm.setStandardItemText("SuperStandardVariant");
								this.setText("SetStandard Entry Text");
							} else {
								vm.setStandardItemText("");
								this.setText("Replace text for Standard Entry");
							}
						}
					}),

					oEmptyVM, oEmptyVM2
				]
			})
		]
	});
	page.addStyleClass("sapUiSizeCompact");

	app.addPage(page);

	_noShow = false;
});