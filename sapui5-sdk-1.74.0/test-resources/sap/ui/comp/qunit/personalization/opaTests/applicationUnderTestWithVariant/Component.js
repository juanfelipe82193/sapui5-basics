sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"sap/ui/core/util/MockServer",
	'sap/chart/library' // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
], function(
	UIComponent,
	FakeLrepConnectorLocalStorage,
	MockServer,
	chartLib // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
) {
	"use strict";

	return UIComponent.extend("applicationUnderTestWithVariant.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			this.oMockServer = new MockServer({
				rootUri: "/applicationUnderTestWithVariant/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();

			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();
			// Save Variant
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant00_table", {
				changeType: "table",
				conditions: {},
				content: {
					sort: {
						sortItems: [
							{
								columnKey: "Name",
								operation: "Ascending"
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant00_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "SortByName"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant01_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								visible: true,
								index: 0
							},
							{
								columnKey: "Date",
								visible: true
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant01_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "PriceAtFirstAndDateAtLast"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});

			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant02_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						fixedColumnCount: 1,
						columnsItems: [
							{
								columnKey: "Name",
								width: "161px"
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant02_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility01"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant03_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Category",
								index: 0
							},
							{
								columnKey: "Name",
								index: 1
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant03_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility02"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant04_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Category",
								index: 0
							},
							{
								columnKey: "Name",
								index: 1,
								visible: false
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant04_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility03"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant05_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Bool",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							},
							{
								columnKey: "Price",
								index: 10
							},
							{
								columnKey: "Status",
								index: 11
							},
							{
								columnKey: "CurrencyCode",
								index: 12
							},
							{
								columnKey: "Width",
								index: 13
							},
							{
								columnKey: "Depth",
								index: 14
							},
							{
								columnKey: "Height",
								index: 15
							},
							{
								columnKey: "DimUnit",
								index: 16
							},
							{
								columnKey: "Date",
								index: 17
							},
							{
								columnKey: "Time",
								index: 18
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant05_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility04"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant06_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Bool",
								index: 0,
								visible: true
							},
							{
								columnKey: "Name",
								index: 1
							},
							{
								columnKey: "Category",
								index: 2
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							},
							{
								columnKey: "Price",
								index: 10
							},
							{
								columnKey: "Status",
								index: 11
							},
							{
								columnKey: "CurrencyCode",
								index: 12
							},
							{
								columnKey: "Width",
								index: 13
							},
							{
								columnKey: "Depth",
								index: 14
							},
							{
								columnKey: "Height",
								index: 15
							},
							{
								columnKey: "DimUnit",
								index: 16
							},
							{
								columnKey: "Date",
								index: 17
							},
							{
								columnKey: "Time",
								index: 18
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant06_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility05"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant07_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant07_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility06"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant08_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant08_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility07"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant09_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 0,
								visible: true
							},
							{
								columnKey: "Name",
								index: 1
							},
							{
								columnKey: "Category",
								index: 2
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant09_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility08"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant10_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 2,
								visible: true
							},
							{
								columnKey: "ProductId",
								index: 3
							},
							{
								columnKey: "Description",
								index: 4
							},
							{
								columnKey: "SupplierName",
								index: 5
							},
							{
								columnKey: "Quantity",
								index: 6
							},
							{
								columnKey: "UoM",
								index: 7
							},
							{
								columnKey: "WeightMeasure",
								index: 8
							},
							{
								columnKey: "WeightUnit",
								index: 9
							}
						]
					},
					sort: {sortItems: []}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant10_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility09"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant11_table", {
				changeType: "table",
				conditions: {},
				content: {
					columns: {
						columnsItems: [
							{
								columnKey: "Price",
								index: 0,
								visible: true
							},
							{
								columnKey: "Bool",
								index: 2,
								visible: true
							},
							{
								columnKey: "Name",
								index: 3,
								visible: false
							},
							{
								columnKey: "ProductId",
								index: 4
							},
							{
								columnKey: "Description",
								index: 5
							},
							{
								columnKey: "SupplierName",
								index: 6
							},
							{
								columnKey: "Quantity",
								index: 7
							},
							{
								columnKey: "UoM",
								index: 8
							},
							{
								columnKey: "WeightMeasure",
								index: 9
							},
							{
								columnKey: "WeightUnit",
								index: 10
							},
							{
								columnKey: "Status",
								index: 11
							},
							{
								columnKey: "CurrencyCode",
								index: 12
							},
							{
								columnKey: "Width",
								index: 13
							},
							{
								columnKey: "Depth",
								index: 14
							},
							{
								columnKey: "Height",
								index: 15
							},
							{
								columnKey: "DimUnit",
								index: 16
							},
							{
								columnKey: "Date",
								index: 17
							},
							{
								columnKey: "Time",
								index: 18
							}
						]
					},
					filter: {
						filterItems: [
							{
								columnKey: "Price",
								operation: "LT",
								exclude: false,
								value1: "100",
								value2: ""
							}
						]
					},
					sort: {
						sortItems: [
							{
								columnKey: "Name",
								operation: "Ascending"
							}
						]
					},
					group: {
						groupItems: [{
							columnKey: "Category",
							operation: "GroupAscending",
							showIfGrouped: true
						}]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant11_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Compatibility10"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant12_table", {
				changeType: "table",
				conditions: {},
				content: {
					group: {
						groupItems: [{
							columnKey: "Category",
							operation: "GroupAscending",
							showIfGrouped: true
						}, {
							columnKey: "Name",
							operation: "GroupAscending",
							showIfGrouped: true
						}]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant12_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Grouped Category and Name"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestWithVariant13_table", {
				changeType: "table",
				conditions: {},
				content: {
					group: {
						groupItems: [{
							columnKey: "Name",
							operation: "GroupAscending",
							showIfGrouped: true
						}, {
							columnKey: "Category",
							operation: "GroupAscending",
							showIfGrouped: true
						}]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestWithVariant13_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestWithVariant/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestWithVariant.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestWithVariant"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Grouped Name and Category"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});
			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			this.oMockServer.stop();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
