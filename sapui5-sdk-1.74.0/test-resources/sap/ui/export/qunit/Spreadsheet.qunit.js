/*global QUnit, sinon */
sap.ui.define([
	'sap/ui/core/util/MockServer',
	'sap/ui/export/Spreadsheet',
	'sap/ui/export/ExportDialog',
	'sap/ui/export/ExportUtils',
	'sap/ui/thirdparty/sinon-qunit' /* Sinon itself already part of MockServer */
], function (MockServer, Spreadsheet, ExportDialog, ExportUtils, SinonQUnit) {
	'use strict';

	var aCols, fnOnSave, oMockServer, oSpreadsheet, mSettings, mModuleConfig, sPath;

	var sEventId = 'beforeSave';
	ExportUtils.saveAsFile = function(blob, sFilename) {
		console.log('ExportUtils.saveAsFile called with ' + blob.size + ' bytes of data and filename ' + sFilename);
		return fnOnSave && fnOnSave();
	};

	// create mock server
	sPath = sap.ui.require.toUrl('sap/ui/export/mock');

	oMockServer = new MockServer({
		rootUri: './localService/'
	});

	oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata');

	aCols = [
		{ /* 1. Add a simple text column */
			label: 'Text',
			type: 'wrong type',
			property: 'SampleString',
			textAlign: 'wrong value',
			width: '10em'
		},
		{ /* 2. Add a simple Integer column */
			label: 'Integer',
			type: 'number',
			property: 'SampleInteger',
			scale: 0
		},
		{ /* 3. Add a simple Decimal column */
			label: 'Decimal',
			type: 'number',
			property: 'SampleDecimal'
		},
		{/* 4. Add a custom Decimal column */
			label: 'Decimal (scale=0)',
			type: 'number',
			property: 'SampleDecimal',
			scale: 0
		},
		{/* 5. Add a custom Decimal column */
			label: 'Decimal (scale=2)',
			type: 'number',
			property: 'SampleDecimal',
			scale: '2'
		},
		{/* 6. Add a custom Decimal column */
			label: 'Decimal (delimiter)',
			type: 'number',
			property: 'SampleDecimal',
			delimiter: true
		},
		{/* 7. Add a simple Date column */
			label: 'Date',
			type: 'date',
			property: 'SampleDate'
		},
		{/* 8. Add an islamic Date column */
			label: 'Date (calendar=islamic)',
			type: 'date',
			property: 'SampleDate',
			calendar: 'islamic'
		},
		{/* 8. Add a japanese Date column */
			label: 'Date (calendar=japanese)',
			type: 'date',
			property: 'SampleDate',
			calendar: 'japanese'
		},
		{/* 9. Add a simple DateTime column */
			label: 'DateTime',
			type: 'datetime',
			property: 'SampleDate'
		},
		{/* 10. Add a simple Time column */
			label: 'Time',
			type: 'time',
			property: 'SampleDate'
		},
		{/* 11. Add a custom Date column */
			label: 'Date (format)',
			type: 'date',
			property: 'SampleDate',
			format: 'dd-mm-yyyy h:mm:ss AM/PM'
		},
		{/* 12. Add a simple Currency column */
			label: 'Currency',
			type: 'currency',
			property: 'SampleDecimal',
			unitProperty: 'SampleCurrency',
			displayUnit: true
		},
		{/* 13. Add a Currency column without unitProperty */
			label: 'Currency',
			type: 'currency',
			property: 'SampleDecimal',
			width: '50px'
		}
	];

	mSettings = {
		workbook: { columns: aCols },
		dataSource: {
			type: 'oData',
			dataUrl: './localService/Elements',
			count: 10,
			useBatch: true,
			sizeLimit: 100
		},
		showProgress: true,
		worker: false // We need to disable worker because we are using a Mockserver as OData Service
	};

	mModuleConfig = {
		beforeEach: function() {
			oMockServer.start();
		},
		afterEach: function () {
			fnOnSave = null;
			oMockServer.stop();
		}
	};


	QUnit.module('Integration', mModuleConfig);

	QUnit.test('Successful', function (assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();

		oSpreadsheet = new Spreadsheet(mSettings);
		oSpreadsheet.onprogress = sinon.spy();

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.ok(oSpreadsheet.onprogress.callCount > 1, 'onprogress was called several times');
			done();
		});
	});

	QUnit.test('Worker', function (assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.worker = true;
		settings.dataSource.dataUrl = '/' + window.location.pathname.split('/')[1] + '/' + sPath + '/mockdata/Elements.json';

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.ok(oSpreadsheet.onprogress.callCount > 1, 'onprogress was called several times');
		}).finally(done);
	});

	QUnit.test('Silent run', function (assert) {
		assert.expect(2);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.showProgress = false;

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created in a silent mode');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
		}).finally(done);
	});

	QUnit.test('dataSource as String', function (assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.dataSource = settings.dataSource.dataUrl;

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.ok(oSpreadsheet.onprogress.callCount > 0, 'onprogress was called several times');
		}).finally(done);
	});

	QUnit.test('dataSource as Array', function (assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var data = oMockServer.getEntitySetData('Elements');

		settings.dataSource = data.slice();

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.ok(oSpreadsheet.onprogress.callCount > 1, 'onprogress was called several times');
		}).finally(done);
	});

	QUnit.test('#processDataSource', function(assert) {
		var done = assert.async();
		var oFakeModel = {
			bUseBatch: true,
			sServiceUrl: '/sample/path/',
			getHeaders: function() { return []; },
			getProperty: function(sPath) { return [{ test:'entry' }]; },
			isA: function(sName) { return sName == 'sap.ui.model.odata.V2.ODataModel'; }
		};
		var aWorkingBindings = [
			{
				isA: function(sName) { return sName == 'sap.ui.model.ListBinding'; },
				getDownloadUrl: function() { return '/sample/path/to/service'; },
				getModel: function() { return oFakeModel; },
				getTotalSize: function() { return 10; }
			},
			{
				isA: function(sName) { return sName == 'sap.ui.model.ListBinding' || sName == 'sap.ui.model.ClientListBinding'; },
				getModel: function() { return oFakeModel; },
				getPath: function() { return '/dummy/path'; }
			},
			{
				isA: function(sName) { return sName == 'sap.ui.model.TreeBinding'; },
				getDownloadUrl: function() { return '/sample/path/to/service'; },
				getModel: function() { return oFakeModel; },
				getTotalSize: function() { return 10; }
			}
		];

		oSpreadsheet = new Spreadsheet({});

		aWorkingBindings.forEach(function(oBinding) {
			var mDataSource = oSpreadsheet.processDataSource(oBinding);

			assert.ok(mDataSource instanceof Object, 'DataSource was processed');
			if (mDataSource instanceof Array) {
				assert.ok(mDataSource.length > 0, 'Data was obtained from client binding');
			} else {
				assert.ok(mDataSource.dataUrl, 'DataSource was converted successfully');
			}
		});

		done();
	});

	QUnit.test('Negative', function (assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.dataSource.dataUrl = './localService/Dummy';

		oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The negative test did not fail');
		}).catch(function() {
			assert.ok(true, 'The spreadsheet was aborted');
			assert.ok(!fnOnSave.called, 'File was not saved');
			assert.ok(oSpreadsheet.onprogress.callCount == 1, 'onprogress was called once');

			// close the error message dialog
			var dialogElement = document.getElementsByClassName('sapMMessageBoxError')[0];
			var dialog = sap.ui.getCore().byId(dialogElement && dialogElement.id);
			dialog && dialog.close();
		}).finally(done);
	});

	QUnit.test('Do not run in parallel', function (assert) {
		assert.expect(2);
		var doneFirst = assert.async();

		oSpreadsheet = new Spreadsheet(mSettings);
		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The first run was successful');
			doneFirst();
		});

		/**
		 * Succeeds if first run is already finished and fails if
		 * first run is still pending
		 */
		oSpreadsheet.build().catch(function() {
			assert.ok(true, 'The second run was aborted');
		});
	});

	QUnit.test('Cancel API', function (assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();

		oSpreadsheet = new Spreadsheet(mSettings);

		oSpreadsheet.onprogress = sinon.spy(function(progress){
			if (progress > 0) {
				oSpreadsheet.cancel(); // cancel after 50%
			}
		});

		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The process has finished successfully although it was canceled');
			done();
		}).catch(function() {
			window.setTimeout(function() {
				jQuery('.sapMDialog').each(function() {
					var oDialog = jQuery(this).control(0);
					if (oDialog && oDialog.finish) {
						oDialog.finish();
					}
				});

				assert.ok(true, 'The process has finished');
				assert.ok(fnOnSave.callCount == 0, 'File was not saved');
				assert.ok(oSpreadsheet.onprogress.callCount == 2, 'onprogress was called two times');
				done();
			}, 1000);
		});
	});

	QUnit.test('Cancel during JSON export', function (assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var data = oMockServer.getEntitySetData('Elements');

		settings.dataSource = data.slice();

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy(function(progress){
			if (progress > 0) {
				oSpreadsheet.cancel(); // cancel after 50%
			}
		});

		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The process has finished successfully although it was canceled');
			done();
		}).catch(function() {
			window.setTimeout(function() {
				jQuery('.sapMDialog').each(function() {
					var oDialog = jQuery(this).control(0);
					if (oDialog && oDialog.finish) {
						oDialog.finish();
					}
				});

				assert.ok(true, 'The process has finished');
				assert.ok(fnOnSave.callCount == 0, 'File was not saved');
				assert.ok(oSpreadsheet.onprogress.callCount == 2, 'onprogress was called two times');
				done();
			}, 1000);
		});
	});

	QUnit.test('Cancel if column configuration contains no columns', function (assert) {
		assert.expect(2);
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.workbook.columns = [];

		oSpreadsheet = new Spreadsheet(settings);

		fnOnSave = sinon.spy();
		oSpreadsheet.onprogress = sinon.spy();

		oSpreadsheet.build().catch(function(sMessage) {
			assert.ok(fnOnSave.callCount == 0, 'File was not saved');
			assert.ok(true, 'The execution was aborted: ' + sMessage);
		}).finally(done);
	});


	QUnit.module('Events', mModuleConfig);

	QUnit.test('beforeSave - attach event', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var oSpreadsheet = new Spreadsheet(mSettings);

		oSpreadsheet.attachBeforeSave(function(oEvent) {
			assert.ok(true, 'Event handler was called');
		});

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet generation finished successfully');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
		}).finally(done);
	});

	QUnit.test('beforeSave - detach event', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();

		var oSpreadsheet = new Spreadsheet(mSettings);
		var fHandler = function(oEvent) {
			assert.ok(false, 'Event handler should not be called');
			oEvent.preventDefault();
		};

		oSpreadsheet.attachBeforeSave(fHandler);
		assert.ok(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener attached');

		oSpreadsheet.detachBeforeSave(fHandler);
		assert.notOk(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener detached');

		oSpreadsheet.build().then(function() {
			assert.ok(fnOnSave.calledOnce, 'File was saved');
		}).finally(done);
	});

	QUnit.test('beforeSave - Prevent default', function(assert) {
		assert.expect(2);
		fnOnSave = sinon.spy();
		var done = assert.async();

		oSpreadsheet = new Spreadsheet(mSettings);

		oSpreadsheet.attachBeforeSave(function(oEvent) {
			oEvent.preventDefault();
		});

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet generation finished successfully');
			assert.ok(fnOnSave.callCount == 0, 'File was not saved');
		}).finally(done);
	});

	QUnit.test('beforeSave - Event parameters', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();

		oSpreadsheet = new Spreadsheet(mSettings);

		oSpreadsheet.attachBeforeSave(function(oEvent) {
			var data = oEvent.getParameter('data');

			assert.ok(data, 'The generated spreadsheet is attached to the event');
			assert.ok(data instanceof ArrayBuffer, 'The attached data is an instance of ArrayBuffer');
		});

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet generation finished successfully');
		}).finally(done);
	});

	QUnit.test('beforeExport - attach event', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oSpreadsheet = new Spreadsheet(mSettings);

		oSpreadsheet.attachBeforeExport(function(oEvent) {
				assert.ok(true, 'Event handler was called');
		}).build().finally(done);
	});

	QUnit.test('beforeExport - detach event', function(assert) {
		assert.expect(0);
		var done = assert.async();
		var oSpreadsheet = new Spreadsheet(mSettings);
		var fnHandler = function(oEvent) {
			assert.ok(false, 'Event handler was called although event was unregistered');
		};

		oSpreadsheet
			.attachBeforeExport(fnHandler)
			.detachBeforeExport(fnHandler)
			.build()
			.finally(done);
	});

	QUnit.test('beforeExport - Event parameters', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var oSpreadsheet = new Spreadsheet(mSettings);
		var fnHandler = function(oEvent) {
			assert.ok(true, 'Event handler was called');
			assert.ok(oEvent, 'Event object present');
			assert.ok(oEvent.getParameter('exportSettings'), 'ExportSettings available as event parameter');
		};

		oSpreadsheet
			.attachBeforeExport(fnHandler)
			.build()
			.finally(done);
	});

	QUnit.module('General', mModuleConfig);

	QUnit.test('destroy', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();

		oSpreadsheet = new Spreadsheet(mSettings);

		oSpreadsheet.attachBeforeSave(function(oEvent) { /* Do something */ });
		assert.ok(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener attached');

		oSpreadsheet.destroy();
		assert.notOk(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener detached');

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The spreadsheet was generated although the object was destroyed');
		}).catch(function() {
			assert.ok(true, 'The build cannot be triggered because the object was already destroyed');
		}).finally(done);
	});

	QUnit.test('Close progress dialog delayed', function(assert) {
		assert.expect(1);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var oDialog, nStart, nDuration, fnFinish;

		oSpreadsheet = new Spreadsheet(mSettings);
		oSpreadsheet.attachBeforeSave(function() {
			oDialog = jQuery(jQuery('.sapMDialog')[0]).control(0);
			nStart = Date.now();

			fnFinish = oDialog.finish;

			oDialog.finish = function() {
				nDuration = Date.now() - nStart;
				assert.ok(nDuration >= 1000, 'The progress dialog was closed with a delay of ' + nDuration + ' ms');

				fnFinish();
				done();
			};
		});

		/* The actual process needs to be delayed to ensure that all previous progress dialogs have been closed */
		window.setTimeout(function() {
			oSpreadsheet.build();
		}, 1000);
	});
});
