/* global QUnit, sinon */
sap.ui.define([
	'sap/ui/export/ExportUtils',
	'sap/ui/qunit/QUnitUtils',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (ExportUtils, QUnitUtils, MockServer, ODataModel, Filter, FilterOperator) {
	'use strict';

	/* Create mock server */
	var sPath = sap.ui.require.toUrl('sap/ui/export/mock');

	/* Default config for export settings */
	var oDefaultConfig = {
		fileName: 'Standard',
		fileType: [
			{
				key: 'xlsx',
				text: 'Microsoft Excel Workbook (*.xlsx)'
			}
		],
		selectedFileType: 'xlsx',
		splitCells: false,
		includeFilterSettings: false,
		addDateTime: false
	};

	var oMockServer = new MockServer({
		rootUri: './localService/'
	});

	oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata');

	QUnit.module('ExportUtils', {
		beforeEach: function() {
			oMockServer.start();
		},
		afterEach: function () {
			oMockServer.stop();
		}
	});

	QUnit.test('interceptUrl', function (assert) {
		var sUrl1 = 'http://www.sap.com';
		var sUrl2 = 'http://www.sap.de';

		var done = assert.async();

		assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, 'No Interception done when no Interceptservice available');

		var oFakeInterceptService = {
			getInstance: function() {return null;}
		};
		sap.ui.define(ExportUtils._INTERCEPTSERVICE, [], function() {
			return oFakeInterceptService;
		});

		sap.ui.require([ExportUtils._INTERCEPTSERVICE], function() {

			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, 'No Interception done when Interceptservice has no instance');

			oFakeInterceptService.getInstance = function() {return oFakeInterceptService;};
			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, 'No Interception done when Interceptservice has no interceptUrl function');

			oFakeInterceptService.interceptUrl = function(sUrl) {
				return sUrl2;
			};
			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl2, 'Interception done when Interceptservice has interceptUrl function');

			done();

		});

	});

	QUnit.test('getExportSettingsViaDialog - with default configuration', function(assert) {
		var done = assert.async();

		ExportUtils.getExportSettingsViaDialog(null, null, function(oExportSettingsDialog) {

			assert.ok(oExportSettingsDialog.isOpen(), 'Export Settings Dialog is open');

			var oExportButton = oExportSettingsDialog.getBeginButton();
			oExportButton.firePress();
			assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
		}).then(function(oUserConfig) {
			assert.deepEqual(oUserConfig, oDefaultConfig, 'Promise returned with default export config data');
			done();
		});
	});

	QUnit.test('getExportSettingsViaDialog - with custom configuration', function(assert) {
		var done = assert.async();

		var oCustomConfig = {
			fileName: 'Products',
			addDateTime: true
		};

		ExportUtils.getExportSettingsViaDialog(oCustomConfig, null, function(oExportSettingsDialog) {
			var oModelData = oExportSettingsDialog.getModel().getData();
			var oExportButton = oExportSettingsDialog.getBeginButton();

			assert.equal(oModelData.fileName, 'Products', 'Custom config for file name applied to the export settings dialog');
			assert.ok(oModelData.addDateTime, 'Add date time config applied to export settings dialog');

			oExportButton.firePress();
			assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
		}).then(function(oUserConfig) {
			assert.notDeepEqual(oUserConfig, oDefaultConfig, 'Default config is overwritten with custom config');
			done();
		});
	});

	QUnit.test('getExportSettingsViaDialog - for file name input validation', function(assert) {
		var done = assert.async();

		ExportUtils.getExportSettingsViaDialog(null, null, function(oExportSettingsDialog) {
			var sLongFileName = 'This is a very very very very very very very very very very long file name, which exceed 100 characters';
			var oInput = sap.ui.getCore().byId(oExportSettingsDialog.getId() + '-fileName');
			var oExportButton = oExportSettingsDialog.getBeginButton();
			var oCancelButton = oExportSettingsDialog.getEndButton();
			var $oInput = oInput.$('inner');

			oInput.focus();
			// input validation for invalid file name
			$oInput.focus().val('Products?').trigger('input');

			assert.equal(oInput.getValueState(), 'Error', 'Invalid character found');
			assert.ok(!oExportButton.getEnabled(), 'Export button disabled as there is invalid user input');

			// input validation for very long file name which is over 100 characters
			$oInput.focus().val(sLongFileName).trigger('input');
			assert.ok(oExportButton.getEnabled(), 'Export button is enabled, but warning message is also show to the user');
			assert.equal(oInput.getValueState(), 'Warning', 'Warning text show to user for long file name');

			oCancelButton.firePress();
		}).catch(function(oResolve) {
			assert.notOk(oResolve, 'No settings are provided when dialog was canceled');

			done();
		});
	});

	QUnit.test('parseFilterConfiguration', function (assert) {
		var done = assert.async();

		var oModel = new ODataModel('./localService', true);
		var oListBinding = oModel.bindList('/Users');

		var filterArray = [
			new Filter({
				path: 'Currency',
				operator: FilterOperator.EQ,
				value1: 'EUR'
			}),
			new Filter({
				path: 'Active',
				operator: FilterOperator.EQ,
				value1: true
			}),
			new Filter({
				path: 'Salary',
				operator: FilterOperator.BT,
				value1: 5000,
				value2: 10000
			}),
			new Filter({
				path: 'Firstname',
				operator: FilterOperator.NotStartsWith,
				value1: 'A'
			})
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: filterArray,
			and: true
		}));

		ExportUtils.parseFilterConfiguration(oListBinding).then(function(result) {
			assert.ok(result.items.length == filterArray.length, 'The amount of parsed entries is equal to the amount of filter settings');
			filterArray.forEach(function(oFilter, nIndex) {
				assert.ok(result.items.some(function(oEntry) {
					return oEntry.key === oFilter.sPath
						&& oEntry.value.indexOf(oFilter.oValue1 || oFilter.oValue2) > -1;
				}), 'Filter no. ' + (nIndex + 1) + ' is contained in the result');
			});

			done();
		});
	});

	QUnit.test('parseFilterConfiguration for exclude multi-filter', function (assert) {
		var done = assert.async();
		var sKey = 'Currency';
		var oModel = new ODataModel('./localService', true);
		var oListBinding = oModel.bindList('/Users');

		var filterArray = [
			new Filter([
				new Filter({
					path: sKey,
					operator: FilterOperator.NE,
					value1: ''
				}),
				new Filter({
					path: sKey,
					operator: FilterOperator.NE,
					value1: 'USD'
				})
			], true)
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: filterArray,
			and: true
		}));

		ExportUtils.parseFilterConfiguration(oListBinding).then(function(result) {
			assert.ok(result.items.length != filterArray.length, 'The amount of parsed entries may not always be equal to the amount of filter settings');
			assert.ok(result.items.length === 2);
			assert.equal(result.items[0].key, sKey);
			assert.ok(result.items[0].value.indexOf('!=') > -1);
			assert.equal(result.items[1].key, sKey);
			assert.ok(result.items[1].value.indexOf('!=') > -1);
			done();
		});
	});

	QUnit.test('parseFilterConfiguration without filters', function(assert) {
		var done = assert.async();
		var oModel = new ODataModel('./localService', true);
		var oListBinding = oModel.bindList('/Users');

		// Still works for ListBinding without filters
		ExportUtils.parseFilterConfiguration(oListBinding).then(function(result) {
			assert.ok(result.items.length == 0, 'No exception when binding has no filters');
			done();
		});
	});

	QUnit.test('parseFilterConfiguration with column label callback', function(assert) {
		var fnDone, oModel, oListBinding, fnResolveColumnLabel, oFilterArray;

		fnDone = assert.async();
		oModel = new ODataModel('./localService', true);
		oListBinding = oModel.bindList('/Users');
		fnResolveColumnLabel = function(sProperty) {
			return sProperty + 'Label';
		};

		oFilterArray = [
			new Filter({
				path: 'Currency',
				operator: FilterOperator.EQ,
				value1: 'EUR'
			}),
			new Filter({
				path: 'Active',
				operator: FilterOperator.EQ,
				value1: true
			}),
			new Filter({
				path: 'Salary',
				operator: FilterOperator.BT,
				value1: 5000,
				value2: 10000
			}),
			new Filter({
				path: 'Firstname',
				operator: FilterOperator.NotStartsWith,
				value1: 'A'
			})
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: oFilterArray,
			and: true
		}));


		ExportUtils.parseFilterConfiguration(oListBinding, fnResolveColumnLabel).then(function(result) {
			oFilterArray.forEach(function(oFilter, nIndex) {

				assert.ok(result.items.some(function(oEntry) {
					return oEntry.key === fnResolveColumnLabel(oFilter.sPath);
				}), 'Column label of Filter no. ' + (nIndex + 1) + ' is contained in the result');
			});

			fnDone();
		});
	});

	QUnit.test('Check for cloud service if unavailable', function(assert) {
		var done = assert.async();

		ExportUtils.getCloudExportService().catch(function() {
			assert.ok(true, 'The promise was rejected');

			done();
		});
	});

	QUnit.test('Check for targets if cloud service is unavailable', function(assert) {
		var done = assert.async();

		/* Replace sap.ushell.Container#getService implementation to simulate that the service is not available */
		sap.ushell = {
			Container: {
				getServiceAsync: function(sName) {
					return Promise.reject();
				}
			}
		};

		ExportUtils.getAvailableCloudExportTargets().then(function(targets) {
			assert.ok(targets instanceof Array, 'Targets are provided as Array');
			assert.equal(targets.length, 0, 'The Array is empty');

			done();
		}).catch(function(error) {
			assert.ok(false, 'The catch clause should never be executed.');
			done();
		});
	});

	QUnit.test('Retrieve cloud export service and targets', function(assert) {
		var fakeService, done = assert.async();

		fakeService = {
			getSupportedTargets: function() {
				return [{
					target: 'GoogleSheets',
					name: 'Google Sheets',
					description: 'GSuite Sheets Application'
				}, {
					target: 'ExcelOnline',
					name: 'Excel Online',
					description: 'Microsoft Office 365 Excel'
				}];
			}
		};

		/* Register a fake shell container - sap.ui.define is not possible (only once per file) */
		sap.ushell = {
			Container: {
				getServiceAsync: function(sName) {
					return sName === 'ProductivityIntegration' ? Promise.resolve(fakeService) : Promise.reject();
				}
			}
		};

		assert.ok(sap.ushell.Container, 'The global instance of sap.ushell.Container is available');
		assert.ok(sap.ushell.Container.getServiceAsync, 'Function getServiceAsync is available');

		ExportUtils.getAvailableCloudExportTargets().then(function(value) {
			assert.ok(value instanceof Array, 'Targets are provided as Array');
			assert.ok(value.length > 0, 'The Array length is greater 0');

			done();
		});
	});
});
