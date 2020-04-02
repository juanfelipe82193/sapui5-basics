sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/ui/export/Spreadsheet',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, MockServer, Spreadsheet, ODataModel) {
	'use strict';

	return Controller.extend('sap.ui.export.sample.formatting.Spreadsheet', {

		onInit: function() {
			var oModel, oView;

			this._sServiceUrl = './localService';

			this._oMockServer = new MockServer({
				rootUri: this._sServiceUrl + "/"
			});

			var sPath = sap.ui.require.toUrl('sap/ui/export/sample/localService');
			this._oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata');
			this._oMockServer.start();

			oModel = new ODataModel(this._sServiceUrl);

			oView = this.getView();
			oView.setModel(oModel);
		},

		formatter: function(sKey) {
			switch (sKey) {
				case 'a':
					return 'Free shipping';
				case 'b':
					return 'Premium shipping';
				case 'c':
					return 'Express shipping';
			}
		},

		createColumnConfig: function() {
			var aCols = [];

			/* 1. Add a simple text column */
			aCols.push({
				label: 'Text',
				type: 'string',
				property: 'SampleString',
				width: 20,
				wrap: true
			});

			/* 2. Add a concatenated text column */
			aCols.push({
				label: 'Concatenated Text',
				type: 'string',
				property: ['SampleString', 'SampleCurrency'],
				template: 'The company {0} accepts {1}'
			});

			/* 3. Add a simple Integer column */
			aCols.push({
				label: 'Integer',
				type: 'number',
				property: 'SampleInteger',
				scale: 0
			});

			/* 4. Add a simple Decimal column */
			aCols.push({
				label: 'Decimal',
				type: 'number',
				property: 'SampleDecimal',
				width: 25
			});

			/* 5. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (scale=0)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 0
			});

			/* 6. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (scale=2)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 2
			});

			/* 7. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (delimiter)',
				type: 'number',
				property: 'SampleDecimal',
				delimiter: true,
				width: 25
			});

			/* 8. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (UoM)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 3,
				unit: 'kg'
			});

			/* 9. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (UoM property)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 2,
				unitProperty: 'SampleCurrency'
			});

			/* 10. Add a simple Date column */
			aCols.push({
				label: 'Date',
				type: 'date',
				property: 'SampleDate'
			});

			/* 11. Add an islamic Date column */
			aCols.push({
				label: 'Date (calendar=islamic)',
				type: 'date',
				property: 'SampleDate',
				calendar: 'islamic'
			});

			/* 12. Add a japanese Date column */
			aCols.push({
				label: 'Date (calendar=japanese)',
				type: 'date',
				property: 'SampleDate',
				calendar: 'japanese'
			});

			/* 13. Add a simple DateTime column */
			aCols.push({
				label: 'DateTime',
				type: 'datetime',
				property: 'SampleDate'
			});

			/* 14. Add a simple Time column */
			aCols.push({
				label: 'Time',
				type: 'time',
				property: 'SampleDate'
			});

			/* 15. Add a custom Date column */
			aCols.push({
				label: 'Date (format)',
				type: 'date',
				property: 'SampleDate',
				format: 'dd-mm-yyyy h:mm:ss AM/PM',
				width: 25
			});

			/* 16. Add a custom Date column */
			aCols.push({
				label: 'DateString',
				type: 'date',
				property: 'SampleDateString',
				inputFormat: 'yyyymmdd',
				width: 25
			});

			/* 17. Add a simple Currency column */
			aCols.push({
				label: 'Currency',
				type: 'currency',
				property: 'SampleDecimal',
				unitProperty: 'SampleCurrency',
				displayUnit: true,
				width: 15
			});

			/* 18. Add a simple Boolean column */
			aCols.push({
				label: 'Boolean',
				type: 'boolean',
				property: 'SampleBoolean'
			});

			/* 19. Add a custom Boolean column */
			aCols.push({
				label: 'Boolean (custom)',
				type: 'boolean',
				property: 'SampleBoolean',
				trueValue: 'AVAILABLE',
				falseValue: 'OUT OF STOCK'
			});

			/* 20. Add an Enumeration column */
			aCols.push({
				label: 'Enumeration',
				type: 'enumeration',
				property: 'SampleEnumeration',
				valueMap: {
					'a': 'Free shipping',
					'b': 'Premium shipping',
					'c': 'Express shipping'
				},
				width: 15,
				textAlign: 'center'
			});

			/* 21. Add an BigNumber column */
			aCols.push({
				label: 'BigNumber',
				type: 'bignumber',
				property: 'SampleBigNumber',
				delimiter: true,
				width: 25
			});

			return aCols;
		},

		onExport: function() {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId('exportTable');
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');

			aCols = this.createColumnConfig();

			var oModel = oRowBinding.getModel();

			oSettings = {
				workbook: { columns: aCols },
				dataSource: {
					type: 'odata',
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: this._sServiceUrl,
					headers: oModel.getHeaders ? oModel.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: true // Default for ODataModel V2
				},
				worker: false // We need to disable worker because we are using a Mockserver as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		},

		onExit: function() {
			this._oMockServer.stop();
		}
	});
});
