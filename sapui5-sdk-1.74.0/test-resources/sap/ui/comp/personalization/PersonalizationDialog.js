sap.ui.require([
	'sap/ui/core/library',
	'sap/ui/base/Object',
	'test/sap/ui/comp/personalization/PersonalizationDialogHelper',
	'test/sap/ui/comp/personalization/Util',
	'sap/ui/comp/personalization/Util',
	'sap/ui/rta/RuntimeAuthoring',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/m/CheckBox',
	'sap/ui/comp/smartvariants/PersonalizableInfo',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/comp/state/UIState',
	'sap/m/Text',
	'sap/ui/comp/personalization/ChartWrapper',
	'sap/m/Table',
	'sap/m/Page',
	'sap/m/App',
	'sap/m/Toolbar',
	'sap/m/MultiComboBox',
	'sap/m/Button',
	'sap/m/Carousel',
	'sap/m/Panel',
	'sap/ui/core/Item',
	'sap/ui/core/UIComponent',
	'sap/ui/core/ComponentContainer',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/base/util/merge'
], 	function(coreLibrary, Object, PersonalizationDialogHelper, Util, PersonalizationUtil, RuntimeAuthoring, FakeLrepConnectorLocalStorage,
	CheckBox, PersonalizableInfo, PersController, UIState, Text, ChartWrapper, Table, Page, App, Toolbar, MultiComboBox, Button,
	Carousel, Panel, Item, UIComponent, ComponentContainer, JSONModel, ODataModel, merge) {
	"use strict";

	var PersonalizationDialog = Object.extend("test.sap.ui.personalization.PersonalizationDialog", /** @lends "test.sap.ui.personalization.PersonalizationDialog.prototype */
	{
		constructor: function() {
			this.init();
		}
	});

	PersonalizationDialog.prototype.init = function() {
		// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
		FakeLrepConnectorLocalStorage.enableFakeConnector();
		FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();

		this.aPathOfIgnoredColumns = [
			"GUID"
		];
		this.oANAData = {
			rootUri: "/mockserver/",
			metadataUrl: "../../../../../test-resources/sap/ui/comp/personalization/mockserver/metadata.xml",
			mockdataSettings: "../../../../../test-resources/sap/ui/comp/personalization/mockserver/",
			entitySet: "ProductCollection"
		};
		Util.startMockServer(this.oANAData);

		this.oPersistentData = {};

		this.aTableConfigs = [
			{
				type: "ANATable",
				createTableMethod: "createAnalyticalTable",
				createColumnsMapMethod: "createAnalyticalColumnsMap",
				lazyMode: true
			}, {
				type: "UITable",
				createTableMethod: "createUITable",
				createColumnsMapMethod: "createUITableColumnsMap",
				lazyMode: true
			}, {
				type: "MTable",
				createTableMethod: "createMTable",
				createColumnsMapMethod: "createMTableColumnsMap",
				lazyMode: true
			}
		];
		this.oTable2ControllerMap = {};

		this.oCheckBoxPartionReset = new CheckBox({
			text: "Show Variant Management",
			selected: true,
			select: function() {
				this.createTables();
				this.updatePageContent();
			}.bind(this)
		});

		PersonalizationDialog.createVariants();
		this.createTables();

		this.createApp();
	};

	PersonalizationDialog.setDirtyFlag = function(bIsChanged, oTable) {
		var oSmartVariant = sap.ui.getCore().byId(PersonalizationDialogHelper.getVariantManagementIdOfTable(oTable));
		oSmartVariant.currentVariantSetModified(bIsChanged);
	};
	PersonalizationDialog.prototype.onRequestColumns = function(oEvent) {
		var aColumnKeys = oEvent.getParameter("columnKeys");
		var oTable = oEvent.oSource.getTable();

		var oColumnKey2ColumnMap = {};
		for ( var sTableType in this.oTable2ControllerMap) {
			if (this.oTable2ControllerMap[sTableType].table === oTable) {
				oColumnKey2ColumnMap = Util[this.oTable2ControllerMap[sTableType].config.createColumnsMapMethod](oTable.getModel(), aColumnKeys, this.oANAData.entitySet);
				if (sTableType === "MTable") {
					for (var i = 0; i < aColumnKeys.length; i++) {
						var sColumnKey = aColumnKeys[i];
						oTable.addColumn(oColumnKey2ColumnMap[sColumnKey]);
						oTable._itemsTemplate.addCell(new Text({
							text: "{" + sColumnKey + "}"
						}));
					}
					oTable.bindItems({
						path: "/" + this.oANAData.entitySet,
						template: oTable._itemsTemplate
					});
				}

				this.oTable2ControllerMap[sTableType].controller.addColumns(oColumnKey2ColumnMap);
				break;
			}
		}
	};
	PersonalizationDialog.prototype.onAfterP13nModelDataChange = function(oEvent) {
		this.oPersistentData = oEvent.getParameter("persistentData");
		var oPersistentDataChangeType = oEvent.getParameter("persistentDataChangeType");
		var oTable = oEvent.oSource.getTable();

		if (oTable instanceof ChartWrapper) {
			PersonalizationDialog.setDirtyFlag(PersonalizationUtil.hasChangedType(oPersistentDataChangeType), oTable.getChartObject());
		} else if (oTable instanceof Table) {
			PersonalizationDialog.setDirtyFlag(PersonalizationUtil.hasChangedType(oPersistentDataChangeType), oTable);
		} else {
			PersonalizationDialog.setDirtyFlag(PersonalizationUtil.hasChangedType(oPersistentDataChangeType), oTable);
		}

		Util.updateSortererFromP13nModelDataChange(oTable, this.oPersistentData);
		Util.updateFiltererFromP13nModelDataChange(oTable, this.oPersistentData);
	};

	PersonalizationDialog.prototype.initVariantManagement = function(sTableType) {
		var oSmartVariant = sap.ui.getCore().byId(PersonalizationDialogHelper.getVariantManagementIdOfTable(this.oTable2ControllerMap[sTableType].table));
		var oControl = this.oTable2ControllerMap[sTableType].panel;
		if (!oSmartVariant || !oControl) {
			return;
		}
		oControl.fetchVariant = function() {
			return merge({}, this.oPersistentData);
		}.bind(this);
		oControl.applyVariant = function(oVariantJSON) {
			this.oTable2ControllerMap[sTableType].controller.setPersonalizationData(jQuery.isEmptyObject(oVariantJSON) ? null : merge({}, oVariantJSON));
			//				setDirtyFlag(false, oTable2ControllerMap[sTableType].table);
		}.bind(this);
		oSmartVariant.attachSave(function() {
			this.oTable2ControllerMap[sTableType].controller.setPersonalizationData(this.oPersistentData);
			//				setDirtyFlag(false, oTable2ControllerMap[sTableType].table);
		}.bind(this));
		oControl.mProperties["persistencyKey"] = "PKeyPersonalizationDialog";
		oControl.getMetadata()._mAllProperties["persistencyKey"] = {
			type: "string",
			name: "persistencyKey"
		};
		oControl._fnDummy = function() {
		};
		oSmartVariant.addPersonalizableControl(new PersonalizableInfo({
			type: "table",
			keyName: "persistencyKey",
			dataSource: "TODO",
			control: oControl
		}));
		oSmartVariant.initialise(oControl._fnDummy, oControl);
	};

	PersonalizationDialog.prototype.createTables = function() {

		var fnCreatePersonalizationController = function(oTable, bResetToInitialTableState, bLazyMode) {
			return new PersController({
				table: oTable,
				resetToInitialTableState: bResetToInitialTableState,
				columnKeys: bLazyMode ? Util.getColumnKeysOrderedFromODataModel(oTable.getModel(), this.oANAData.entitySet) : undefined,
				requestColumns: bLazyMode ? this.onRequestColumns.bind(this) : function() {
				},
				afterP13nModelDataChange: this.onAfterP13nModelDataChange.bind(this),
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: this.aPathOfIgnoredColumns,
						payload: {
							visibleItemsThreshold: 10
						}
					},
					sort: {
						visible: true,
						ignoreColumnKeys: this.aPathOfIgnoredColumns
					},
					filter: {
						visible: true,
						ignoreColumnKeys: this.aPathOfIgnoredColumns
					},
					group: {
						visible: true,
						ignoreColumnKeys: this.aPathOfIgnoredColumns
					}
				}
			});
		}.bind(this);

		this.aTableConfigs.forEach(function(oTableConfig) {
			var bShowVariantManagement = this.oCheckBoxPartionReset.getSelected();
			if (!this.oTable2ControllerMap[oTableConfig.type]) {
				this.oTable2ControllerMap[oTableConfig.type] = {
					table: undefined,
					controller: undefined,
					panel: undefined,
					config: oTableConfig
				};
			}
			this.oTable2ControllerMap[oTableConfig.type].table = PersonalizationDialogHelper[oTableConfig.createTableMethod]("", this.oANAData, oTableConfig.lazyMode, bShowVariantManagement, function() {
				this.oTable2ControllerMap[oTableConfig.type].controller.openDialog();
			}.bind(this), function() {
				this.oTable2ControllerMap[oTableConfig.type].controller.openDialog({
					sort: {
						visible: true
					}
				});
			}.bind(this), function() {
				this.oTable2ControllerMap[oTableConfig.type].controller.openDialog({
					filter: {
						visible: true
					}
				});
			}.bind(this), function() {
				this.oTable2ControllerMap[oTableConfig.type].controller.openDialog({
					columns: {
						visible: true
					}
				});
			}.bind(this), function() {
				this.oTable2ControllerMap[oTableConfig.type].controller.openDialog({
					group: {
						visible: true
					}
				});
			}.bind(this), function() {
				var fnGetUiState = function() {
					var oSmartVariant = sap.ui.getCore().byId(PersonalizationDialogHelper.getVariantManagementIdOfTable(this.oTable2ControllerMap[oTableConfig.type].table));
					var oUIStateP13n = this.oTable2ControllerMap[oTableConfig.type].controller.getDataSuiteFormatSnapshot();
					return new UIState({
						presentationVariant: {
							SortOrder: oUIStateP13n ? oUIStateP13n.SortOrder : [],
							GroupBy: oUIStateP13n ? oUIStateP13n.GroupBy : [],
							Total: oUIStateP13n ? oUIStateP13n.Total : [],
							Visualizations: oUIStateP13n ? oUIStateP13n.Visualizations : []
						},
						selectionVariant: {
							SelectOptions: oUIStateP13n ? oUIStateP13n.SelectOptions : []
						},
						variantName: oSmartVariant.getCurrentVariantId()
					});
				}.bind(this);
				var fnSetUiState = function(oUiState) {
					var oControl = this.oTable2ControllerMap[oTableConfig.type].panel;
					var oSmartVariant = sap.ui.getCore().byId(PersonalizationDialogHelper.getVariantManagementIdOfTable(this.oTable2ControllerMap[oTableConfig.type].table));
					var oPersistentDataVariant = oUiState.getVariantName() ? oSmartVariant.getVariantContent(oControl, oUiState.getVariantName()) : {};
					this.oTable2ControllerMap[oTableConfig.type].controller.setDataSuiteFormatSnapshot(merge({}, oUiState.getPresentationVariant(), oUiState.getSelectionVariant()), oPersistentDataVariant);
				}.bind(this);
				Util.openDialogDataSuiteFormat(fnGetUiState, fnSetUiState);
			}.bind(this), function() {
				Util.openDialogPersistentData(this.oPersistentData);
			}.bind(this));
			if (this.oTable2ControllerMap[oTableConfig.type] && this.oTable2ControllerMap[oTableConfig.type].table) {
				this.oTable2ControllerMap[oTableConfig.type].table.getModel().getMetaModel().loaded().then(function(){
					this.oTable2ControllerMap[oTableConfig.type].controller = fnCreatePersonalizationController(
						this.oTable2ControllerMap[oTableConfig.type].table,
						!bShowVariantManagement, oTableConfig.lazyMode
					);
				}.bind(this));
			}

		}.bind(this));
	};

	PersonalizationDialog.prototype.updatePageContent = function() {
		this.oPage.getContent().forEach(function(oPageContent) {
			for ( var sTableType in this.oTable2ControllerMap) {
				if (this.oTable2ControllerMap[sTableType].panel === oPageContent) {
					oPageContent.destroyContent();
					oPageContent.addContent(this.oTable2ControllerMap[sTableType].table);
					return;
				}
			}
		}.bind(this));
	};

	PersonalizationDialog.prototype.createApp = function() {

		sap.ui.jsview("ViewName", {
			createContent: function() {
				var oMultiComboBox;
				var oAppPage = new Page({
					headerContent: [
						new Toolbar({
							content: [
								oMultiComboBox = new MultiComboBox({
									placeholder: "Exclude columns",
									items: {
										path: "JSON>/ColumnKeys",
										template: new Item({
											key: "{JSON>columnKey}",
											text: "{JSON>label}"
										})
									},
									selectionFinish: function(oEvent) {
										for ( var sTableType in this.oTable2ControllerMap) {
											this.oTable2ControllerMap[sTableType].controller.addToSettingIgnoreColumnKeys(oEvent.getParameter("selectedItems").map(function(oItem) {
												return oItem.getKey();
											}));
										}
									}.bind(this)
								}), new Button({
									text: "RTA",
									press: function() {
										var oRuntimeAuthoring = new RuntimeAuthoring({
											rootControl: sap.ui.getCore().byId("IDView"),
											stop: function() {
												oRuntimeAuthoring.destroy();
											}
										});
										oRuntimeAuthoring.start();
									}
								}), new CheckBox({
									text: "compact Mode",
									selected: true,
									select: function() {
										jQuery("#myApp").toggleClass("sapUiSizeCompact");
									}
								}), this.oCheckBoxPartionReset
							]
						})
					],
					content: [
						new Carousel({
							pages: [
								this.oPage = new Page({
									content: [
										this.oTable2ControllerMap.MTable ? this.oTable2ControllerMap.MTable.panel = new Panel({
											headerText: "sap.m.Table",
											expandable: true,
											expanded: true
										}) : undefined, this.oTable2ControllerMap.ANATable ? this.oTable2ControllerMap.ANATable.panel = new Panel({
											headerText: "sap.ui.table.AnalyticalTable",
											expandable: true,
											expanded: true
										}) : undefined, this.oTable2ControllerMap.UITable ? this.oTable2ControllerMap.UITable.panel = new Panel({
											headerText: "sap.ui.table.Table",
											expandable: true,
											expanded: true
										}) : undefined
									]
								})
							]
						})
					]
				});
				var oModel = new ODataModel(this.oANAData.rootUri);
				oModel.getMetaModel().loaded().then(function(){
					oMultiComboBox.setModel(new JSONModel({
						ColumnKeys: Util.getColumnKeysAndLabelsFromODataModel(oModel, this.oANAData.entitySet)
					}), "JSON");

					this.updatePageContent();
				}.bind(this));

				return oAppPage;
			}.bind(this)
		});

		var MyPersonalizationDialog = UIComponent.extend("MyPersonalizationDialog.Component", {
			createContent: function() {
				var oApp = new App("myApp");
				oApp.addPage(sap.ui.view({
					id: "IDView",
					viewName: "ViewName",
					type: coreLibrary.mvc.ViewType.JS
				}));
				return oApp;
			}
		});

		var oComponentContainer = new ComponentContainer();
		oComponentContainer.setComponent(new MyPersonalizationDialog());
		oComponentContainer.placeAt("body");

		this.initVariantManagement("ANATable");
		this.initVariantManagement("UITable");
		this.initVariantManagement("MTable");

		jQuery(window.document).ready(function() {
			jQuery("#myApp").toggleClass("sapUiSizeCompact");
		});
	};

	PersonalizationDialog.createVariants = function() {
		FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_personalizationDialog00_table", {
			changeType: "table",
			conditions: {},
			content: {
				columns: {
					columnsItems: [
						{
							columnKey: "Description",
							visible: true
						}, {
							columnKey: "Quantity",
							visible: false
						}
					]
				},
				dimeasure: {
					dimeasureItems: [
						{
							columnKey: "Quantity",
							visible: false
						}, {
							columnKey: "Description",
							visible: true
						}
					]
				}
			},
			context: "",
			creation: "2018-01-27T22:10:29.555Z",
			dependentSelector: {},
			fileName: "id_personalizationDialog00_table",
			fileType: "variant",
			layer: "USER",
			namespace: "apps/personalizationDialog/changes/",
			originalLanguage: "EN",
			packageName: "",
			reference: "MyPersonalizationDialog.Component",
			selector: {
				persistencyKey: "PKeyPersonalizationDialog"
			},
			support: {
				generator: "Change.createInitialFileContent",
				sapui5Version: "1.53.0-SNAPSHOT",
				service: "",
				user: ""
			},
			texts: {
				variantName: {
					type: "XFLD",
					value: "Column"
				}
			},
			validAppVersions: {
				creation: "",
				from: ""
			}
		});
		FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_personalizationDialog01_table", {
			changeType: "table",
			conditions: {},
			content: {
				sort: {
					sortItems: [
						{
							columnKey: "Category",
							operation: "Ascending"
						}, {
							columnKey: "Price",
							operation: "Descending"
						}
					]
				}
			},
			context: "",
			creation: "2018-01-27T22:10:29.555Z",
			dependentSelector: {},
			fileName: "id_personalizationDialog01_table",
			fileType: "variant",
			layer: "USER",
			namespace: "apps/personalizationDialog/changes/",
			originalLanguage: "EN",
			packageName: "",
			reference: "MyPersonalizationDialog.Component",
			selector: {
				persistencyKey: "PKeyPersonalizationDialog"
			},
			support: {
				generator: "Change.createInitialFileContent",
				sapui5Version: "1.53.0-SNAPSHOT",
				service: "",
				user: ""
			},
			texts: {
				variantName: {
					type: "XFLD",
					value: "Sort"
				}
			},
			validAppVersions: {
				creation: "",
				from: ""
			}
		});
		FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_personalizationDialog02_table", {
			changeType: "table",
			conditions: {},
			content: {
				filter: {
					filterItems: [
						{
							columnKey: "Price",
							exclude: false,
							operation: "LT",
							value1: "100"
						}, {
							columnKey: "Price",
							exclude: false,
							operation: "GT",
							value1: "1000"
						}
					]
				}
			},
			context: "",
			creation: "2018-01-27T22:10:29.555Z",
			dependentSelector: {},
			fileName: "id_personalizationDialog02_table",
			fileType: "variant",
			layer: "USER",
			namespace: "apps/personalizationDialog/changes/",
			originalLanguage: "EN",
			packageName: "",
			reference: "MyPersonalizationDialog.Component",
			selector: {
				persistencyKey: "PKeyPersonalizationDialog"
			},
			support: {
				generator: "Change.createInitialFileContent",
				sapui5Version: "1.53.0-SNAPSHOT",
				service: "",
				user: ""
			},
			texts: {
				variantName: {
					type: "XFLD",
					value: "Filter"
				}
			},
			validAppVersions: {
				creation: "",
				from: ""
			}
		});
		FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_personalizationDialog03_table", {
			changeType: "table",
			conditions: {},
			content: {
				group: {
					groupItems: [
						{
							columnKey: "Category",
							operation: "Ascending"
						}, {
							columnKey: "Name",
							operation: "Ascending"
						}
					]
				}
			},
			context: "",
			creation: "2018-01-27T22:10:29.555Z",
			dependentSelector: {},
			fileName: "id_personalizationDialog03_table",
			fileType: "variant",
			layer: "USER",
			namespace: "apps/personalizationDialog/changes/",
			originalLanguage: "EN",
			packageName: "",
			reference: "MyPersonalizationDialog.Component",
			selector: {
				persistencyKey: "PKeyPersonalizationDialog"
			},
			support: {
				generator: "Change.createInitialFileContent",
				sapui5Version: "1.53.0-SNAPSHOT",
				service: "",
				user: ""
			},
			texts: {
				variantName: {
					type: "XFLD",
					value: "Group"
				}
			},
			validAppVersions: {
				creation: "",
				from: ""
			}
		});
		FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_personalizationDialog04_table", {
			changeType: "table",
			conditions: {},
			content: {
				columns: {
					columnsItems: [
						{
							columnKey: "GUID",
							visible: true
						}
					]
				}
			},
			context: "",
			creation: "2018-01-27T22:10:29.555Z",
			dependentSelector: {},
			fileName: "id_personalizationDialog04_table",
			fileType: "variant",
			layer: "USER",
			namespace: "apps/personalizationDialog/changes/",
			originalLanguage: "EN",
			packageName: "",
			reference: "MyPersonalizationDialog.Component",
			selector: {
				persistencyKey: "PKeyPersonalizationDialog"
			},
			support: {
				generator: "Change.createInitialFileContent",
				sapui5Version: "1.53.0-SNAPSHOT",
				service: "",
				user: ""
			},
			texts: {
				variantName: {
					type: "XFLD",
					value: "GUID as Ignored Column"
				}
			},
			validAppVersions: {
				creation: "",
				from: ""
			}
		});
	};

	new PersonalizationDialog();
	return PersonalizationDialog;
}, /* bExport= */true);
