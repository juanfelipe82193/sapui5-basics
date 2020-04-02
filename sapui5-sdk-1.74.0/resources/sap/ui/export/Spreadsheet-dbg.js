/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
		'jquery.sap.global',
		'./library',
		'./ExportDialog',
		'sap/ui/base/EventProvider',
		'sap/ui/Device',
		'sap/ui/export/SpreadsheetExport',
		'sap/base/Log',
		'sap/base/assert',
		'sap/ui/export/ExportUtils'
	],
	function(jQuery, library, ExportDialog, EventProvider, Device, SpreadsheetExport, Log, assert, ExportUtils) {
		'use strict';

		/*global Blob */

		/**
		 * Creates a new spreadsheet export object. Use this object to build and download a spreadsheet file in Office Open XML Spreadsheet format from tabular data.
		 * This functionality is normally used together with UI5 tables.
		 *
		 *
		 * <h3>Overview</h3>
		 * The class builds a spreadsheet in an Office Open XML Spreadsheet format using tabular data from a specified data source.
		 * Data is retrieved and the document is built asynchronously in a worker thread of the browser.
		 * The status of the process is visually presented to the user in a progress dialog that can be suppressed.
		 * The user can cancel the process with the Cancel button of the dialog.
		 *
		 *
		 * This class provides a low level API for spreadsheet export. The {@link sap.ui.comp.smarttable.SmartTable} control implements it internally and provides the export
		 * functionality out of the box. For special cases, please refer to details below.
		 *
		 *
		 * Optional features:
		 * <ul>
		 *   <li>Suppress the progress dialog.</li>
		 *   <li>Suppress worker and run the document generation process in a main thread.</li>
		 *   <li>Configure the exported file name.</li>
		 * </ul>
		 *
		 *
		 * <h3>Export settings object</h3>
		 * Export settings should be provided in the constructor as an <code>mSettings</code> property map with the following fields:
		 * <ul>
		 *   <li><code>workbook</code> - Spreadsheet properties object
		 *   <ul>
		 *       <li><code>workbook.columns</code> - Array of column configurations. Each column configuration is an object with the following fields:
		 *       <ul>
		 *         <li><code>label</code> (string) - Column header text</li>
		 *         <li><code>property</code> (string) - Field name or Array of field names in the data source feed</li>
		 *         <li><code>type</code> (string) - Optional data type of the field. See {@link sap.ui.export.EdmType} for the list of supported types.
		 *             If this property is omitted, the property is processed as a string field.</li>
		 *         <li><code>width</code> (number) - Optional width of the column in characters. There is no 1:1 correspondence between
		 *           character widths in the exported spreadsheet and CSS units.The width of one character
		 *           is approximately 0.5em in CSS units, depending on the fonts that are
		 *           used in the table and in the resulting spreadsheet. The default value is 10 characters.</li>
		 *         <li><code>textAlign</code> (string) - Horizontal alignment of cell contents. The following values of the CSS <code>text-align</code>
		 *           property are accepted: <code>[left, right, center, begin, end]</code>. If not specified, the columns are
		 *           horizontally aligned based on the property type.</li>
		 *         <li><code>scale</code> (number) - Number of digits after decimal point for numeric values</li>
		 *         <li><code>delimiter</code> (boolean) - Set to <code>true</code> to display thousands separators in numeric values.
		 *           The default value is <code>false</code>.</li>
		 *         <li><code>unit</code> (string) - Text to display as the unit of measurement or currency next to the numeric value.
		 *           It is treated as a string and has no influence on the value itself. For example, a value of 150 with the unit "%" is still 150
		 *           and not 1.5, as a user may expect.</li>
		 *         <li><code>unitProperty</code> (string) - Name of the data source field that contains the unit/currency text</li>
		 *         <li><code>displayUnit</code> (boolean) - The property applies to currency values only and defines if the currency is shown in the column.
		 *           The default value is <code>true</code>.</li>
		 *         <li><code>trueValue</code> (string) - Textual representation of a boolean type that has the value <code>true</code></li>
		 *         <li><code>falseValue</code> (string) - Textual representation of a boolean type that has the value <code>false</code></li>
		 *         <li><code>template</code> (string) - Formatting template that supports indexed placeholders within curly brackets</li>
		 *         <li><code>inputFormat</code> (string) - Formatting template for string formatted dates</li>
		 *         <li><code>valueMap</code> (string) - Mapping object or Map containing the values that should be mapped to a particular key</li>
		 *         <li><code>wrap</code> (boolean) - Indicates if wrapping is enabled for this particular column</li>
		 *      </ul>
		 *      </li>
		 *      <li><code>workbook.context</code> - Context object that will be applied to the generated file. It may contain the following fields:</li>
		 *      <ul>
		 *          <li><code>application</code> (string) - The application that creates the XLSX document (default: "SAP UI5")</li>
		 *          <li><code>version</code> (string) - Application version that creates the XLSX document (default: "1.74.0")</li>
		 *          <li><code>title</code> (string) - Title of the XLSX document (NOT the filename)</li>
		 *          <li><code>modifiedBy</code> (string) - User context for the XLSX document</li>
		 *          <li><code>sheetName</code> (string) - The label of the data sheet</li>
		 *          <li><code>metaSheetName</code> (string) - The label of the metadata sheet. The sheet will not be shown unless metadata entries are provided</li>
		 *          <li><code>metainfo</code> (Array) - An Array of metadata groups. Each group has a name property and an items Array which contains key/value pairs</li>
		 *      </ul>
		 *      <li><code>workbook.hierarchyLevel</code> - Name of the property that contains the hierarchy level information of each line item</li>
		 *   </ul>
		 *   <li><code>dataSource</code> - Source of spreadsheet data. It can be a JSON array with row data,
		 *      an URL or an OData properties object with the following fields:
		 *      <ul>
		 *         <li><code>type</code> (string) - Type of the data source. Currently, only OData is supported and the value have to be set to <code>"odata"</code>.</li>
		 *         <li><code>dataUrl</code> (string) - URL to table data on the server, including all select, filter, and search query parameters</li>
		 *         <li><code>serviceUrl</code> (string) - URL to the OData service. The parameter is required for OData batch requests.</li>
		 *         <li><code>count</code> (number) - Count of available records on the server</li>
		 *         <li><code>useBatch</code> (boolean) - Set to <code>true</code> if OData batch requests are used to fetch the spreadsheet data.
		 *            In this case, <code>serviceUrl</code> and <code>headers</code> have to be specified, too.</li>
		 *         <li><code>headers</code> (object) - Map of HTTP request header properties. They should correspond to the HTTP request headers that are
		 *            used to obtain table data for display in the browser.</li>
		 *         <li><code>sizeLimit</code> (number) - Maximal allowed number of records that can be obtained from the service in a single request</li>
		 *      </ul>
		 *   </li>
		 *   <li><code>count</code> (number) - The maximal number of records to export. If not specified, all data from the data source is fetched.</li>
		 *   <li><code>worker</code> (boolean) - Run export process in a worker thread. Set to <code>false</code> to disable worker and run export
		 *        in a main thread. This is needed, for example, if a mock server is used to provide spreadsheet data.<br>
		 *        <b>Note:</b> In case of a strict content security policy, it is not always possible to create an export worker.
		 *        In this case, export runs in a main thread disregarding the <code>worker</code> value.</li>
		 *   <li><code>fileName</code> (string) - Optional file name for the exported file. If not specified, the spreadsheet is exported as <code>export.xlsx</code>.</li>
		 *   <li><code>showProgress</code> (boolean) - Set to <code>false</code> to suppress the progress dialog</li>
		 * </ul>
		 *
		 *
		 * <h3>Usage</h3>
		 * To start export, create a new <code>sap.ui.export.Spreadsheet</code> object and call the <code>build</code> method.
		 * Column configuration, data source, and export settings must be provided in the constructor.
		 * The <code>build</code> method opens a progress dialog and starts an asynchronous export process.
		 * The export process fetches data rows from the data source, builds a spreadsheet in-browser in a worker thread, and finally downloads the document
		 * to the client.
		 *
		 *
		 * Example:
		 * <pre>
		 *   var oSpreadsheet = new sap.ui.export.Spreadsheet(mSettings);
		 *   oSpreadsheet.build();
		 * </pre>
		 *
		 *
		 * Optionally, you can attach <code>onprogress</code> event listeners to be notified about the
		 * export progress and follow the completion status of the returned <code>Promise</code>.
		 *
		 *
		 * Example:
		 * <pre>
		 *   var oSpreadsheet = new sap.ui.export.Spreadsheet(mSettings);
		 *   oSpreadsheet.onprogress = function(iValue) {
		 *   	{@link sap.base.Log#debug Log.debug}("Export: %" + iValue + " completed");
		 *   };
		 *   oSpreadsheet.build()
		 *     .then( function() { {@link sap.base.Log#debug Log.debug}("Export is finished"); })
		 *     .catch( function(sMessage) { {@link sap.base.Log#error Log.error}("Export error: " + sMessage); });
		 * </pre>
		 *
		 *
		 * Example of column configuration:
		 * <pre>
		 *   var aColumns = [];
		 *   aColumns.push({
		 *   	label: "Name",
		 *   	property: "name"
		 *   });
		 *   aColumns.push({
		 *     label: "Salary",
		 *     property: "salary",
		 *     type: "number",
		 *     scale: 2
		 *   });
		 *
		 *   var mSettings = {
		 *     workbook: {
		 *       columns: aColumns,
		 *       context: {
		 *         application: 'Debug Test Application',
		 *         version: '1.74.0',
		 *         title: 'Some random title',
		 *         modifiedBy: 'John Doe',
		 *         metaSheetName: 'Custom metadata',
		 *         metainfo: [
		 *           {
		 *             name: 'Grouped Properties',
		 *             items: [
		 *               { key: 'administrator', value: 'Foo Bar' },
		 *               { key: 'user', value: 'John Doe' },
		 *               { key: 'server', value: 'server.domain.local' }
		 *             ]
		 *           },
		 *           {
		 *             name: 'Another Group',
		 *             items: [
		 *               { key: 'property', value: 'value' },
		 *               { key: 'some', value: 'text' },
		 *               { key: 'fu', value: 'bar' }
		 *             ]
		 *           }
		 *         ]
		 *       },
		 *       hierarchyLevel: 'level'
		 *     },
		 *     dataSource: mDataSource,
		 *     fileName: "salary.xlsx"
		 *   };
		 *   var oSpreadsheet = new sap.ui.export.Spreadsheet(mSettings);
		 *   oSpreadsheet.build();
		 * </pre>

		 *
		 * <h3>Limitations</h3>
		 * For a complete list of limitations, see:
		 * {@link topic:2c641481649f44de9c1c22c9c3c49d13 Spreadsheet limitations}
		 *
		 *
		 * You can export only the primitive cell data types that are listed in {@link sap.ui.export.EdmType}.
		 * Icons, images, check boxes, and complex controls in UI5 table cells are not supported.
		 *
		 *
		 * Custom formatters in data binding are not supported.
		 *
		 *
		 * The size of an exported table is limited by available browser
		 * memory. Export of large data sets can lead to memory overflow
		 * errors. Therefore, do not use <code>sap.ui.export.Spreadsheet</code>
		 * with data tables containing more than 2,000,000 table cells
		 * on desktop computers and more than 100,000 cells on mobile
		 * devices. Consider a specialized export solution in such cases.
		 * For example, MS Excel® can import spreadsheets from an OData
		 * services directly, without any UI.
		 *
		 *
		 * The export process runs in a worker thread whenever possible.
		 * However, code injection to native XMLHttpRequest events is not
		 * available in the worker environment. Therefore, the
		 * <code>worker</code> parameter in export settings should be set
		 * to <code>false</code> if the application uses a mock server to
		 * fetch table data.
		 *
		 *
		 * For exporting hierarchy level information, the maximum
		 * hierarchy depth is 8. This limitation results from the Office
		 * Open XML standard and the programs that can open such files.
		 * The sap.ui.export.Spreadsheet allows you to export more
		 * hierarchy levels although they might not be displayed
		 * correctly when opening the generated file if the hierarchy
		 * depth exceeds the value of 8.
		 *
		 * The column configuration must contain at least one column to
		 * execute the export process. If there is no column configured,
		 * the export will be canceled.
		 *
		 * If the export is used within a table, any row that is showing
		 * aggregated data (i.E. sum row) will not be exported.
		 *
		 *
		 * @param {Object} mSettings - Export settings
		 * @param {Object} mSettings.workbook - Spreadsheet properties
		 * @param {Array} mSettings.workbook.columns - Column configuration
		 * @param {Object} mSettings.workbook.context - Export context that will be applied to the exported file
		 * @param {string} [mSettings.workbook.context.application] - Application that created this XLSX
		 * @param {string} [mSettings.workbook.context.version] - Application version that was used to create this XLSX
		 * @param {string} [mSettings.workbook.context.title] - Title of the XLSX document (NOT the file name)
		 * @param {string} [mSettings.workbook.context.modifiedBy] - User context for the exported document
		 * @param {string} [mSettings.workbook.context.sheetName] - The name of the data sheet that will be shown in Excel
		 * @param {string} [mSettings.workbook.context.metaSheetName] - The name of the metadata sheet that will be shown in Excel
		 * @param {Array} [mSettings.workbook.context.metainfo] - Optional Metadata that will be displayed in the additional Metadata Sheet
		 * @param {string} [mSettings.workbook.hierarchyLevel] - Optional name of the property that contains hierarchy level information
		 * @param {string | Object | Array | sap.ui.model.ListBinding | sap.ui.model.TreeBinding} mSettings.dataSource - Source of spreadsheet data.
		 * 	      A JSON array, data source properties map, sap.ui.model.ListBinding, sap.ui.model.TreeBinding or
		 *        URL to an OData source can be provided. For example, <code>"someUrl"</code> is an equivalent to
		 *        <code>{dataUrl:"someUrl", type:"OData"}</code>. An instance of sap.ui.model.ListBinding or
		 *        sap.ui.model.TreeBinding either has to implement a #getDownloadUrl() function or needs to be a ClientListBinding.
		 *        <b>Note:</b> sap.ui.model.ClientTreeBinding is not supported.
		 * @param {number} [mSettings.count] - The maximal number of records to export
		 * @param {boolean} [mSettings.worker=true] - Run export process in a worker thread. Set to <code>false</code> to disable worker and run export
		 *        in a main thread. This is needed, for example, if a mock server is used to provide spreadsheet data.<br>
		 *        <b>Note:</b> In case of a strict content security policy, it is not always possible to create an export worker.
		 *        In this case, export runs in a main thread disregarding the <code>worker</code> value.
		 * @param {string} [mSettings.fileName="export.xlsx"] - Optional file name for the exported file
		 * @param {boolean} [mSettings.showProgress=true] - Set to <code>false</code> to suppress the progress dialog
		 *
		 * @constructor The <code>sap.ui.export.Spreadsheet</code> class allows you to export table data from a UI5 application to a spreadsheet file.
		 *
		 * @author SAP SE
		 * @version 1.74.0
		 *
		 * @since 1.50
		 * @name sap.ui.export.Spreadsheet
		 * @see {@link topic:2691788a08fc43f7bf269ea7c6336caf Spreadsheet}
		 * @public
		 */
		var Spreadsheet = EventProvider.extend('sap.ui.export.Spreadsheet', {

			constructor: function(mSettings) {
				EventProvider.call(this, mSettings);

				/* Default settings */
				this._mSettings = {
					fileName: 'Export',
					showProgress: true,
					worker: true
				};

				/* Only apply supported properties */
				['count', 'dataSource', 'fileName', 'showProgress', 'workbook', 'worker'].forEach(function(sProperty) {
					if (typeof mSettings[sProperty] !== 'undefined') {
						this._mSettings[sProperty] = sProperty !== 'dataSource' ? mSettings[sProperty] : this.processDataSource(mSettings[sProperty]);
					}
				}.bind(this));
			}
		});

		/**
		 * The <code>beforeExport</code> event is fired just before the export process is started.
		 *
		 * @name sap.ui.export.Spreadsheet#beforeExport
		 * @event
		 * @param {sap.ui.base.Event} oEvent
		 * @param {sap.ui.base.EventProvider} oEvent.getSource
		 * @param {object} oEvent.getParameters
		 *
		 * @param {ArrayBuffer} oEvent.getParameter.exportSettings - Contains export-related configuration
		 *
		 * @since 1.74
		 * @public
		 */

		/**
		 * Attaches event handler <code>fnFunction</code> to the {@link sap.ui.export.Spreadsheet#event:beforeExport}
		 * event of this <code>sap.ui.export.Spreadsheet</code>.</br>
		 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener</code> if specified,
		 * otherwise it will be bound to this <code>sap.ui.export.Spreadsheet</code> itself.</br>
		 * This event is fired just before the export process is started.
		 *
		 * @param {object} [oData] An application-specific payload object that will be passed to the event handler along with the event object when firing the event
		 * @param {function} fnHandler The function to be called when the event occurs
		 * @param {object} [oListener] Context object to call the event handler with. Defaults to the <code>sap.ui.export.Spreadsheet</code> instance itself
		 *
		 * @returns {sap.ui.export.Spreadsheet} Reference to <code>this</code> in order to allow method chaining
		 *
		 * @name sap.ui.export.Spreadsheet#attachBeforeExport
		 * @function
		 * @since 1.74
		 * @public
		 */
		Spreadsheet.prototype.attachBeforeExport = function(oData, fnHandler, oListener) {
			return this.attachEvent('beforeExport', oData, fnHandler, oListener);
		};

		/**
		 * Detaches event handler <code>fnFunction</code> from the {@link sap.ui.export.Spreadsheet#event:beforeExport}
		 * event of this <code>sap.ui.export.Spreadsheet</code>.</br>
		 * The passed function and listener object must match the ones used for event registration.
		 *
		 * @param {function} fnHandler The function to be called when the event occurs
		 * @param {object} [oListener] Context object on which the given function had to be called
		 *
		 * @returns {sap.ui.export.Spreadsheet} Reference to <code>this</code> in order to allow method chaining
		 *
		 * @name sap.ui.export.Spreadsheet#detachBeforeExport
		 * @function
		 * @since 1.74
		 * @public
		 */
		Spreadsheet.prototype.detachBeforeExport = function(fnHandler, oListener) {
			return this.detachEvent('beforeExport', fnHandler, oListener);
		};

		/**
		 * The <code>beforeSave</code> event is fired just before the generated file is saved to the file system.
		 *
		 * @name sap.ui.export.Spreadsheet#beforeSave
		 * @event
		 * @param {sap.ui.base.Event} oEvent
		 * @param {sap.ui.base.EventProvider} oEvent.getSource
		 * @param {object} oEvent.getParameters
		 *
		 * @param {ArrayBuffer} oEvent.getParameter.data The data parameter contains the generated file
		 *
		 * @since 1.61
		 * @public
		 */

		/**
		 * Attaches event handler <code>fnFunction</code> to the {@link sap.ui.export.Spreadsheet#event:beforeSave}
		 * event of this <code>sap.ui.export.Spreadsheet</code>.</br>
		 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener</code> if specified,
		 * otherwise it will be bound to this <code>sap.ui.export.Spreadsheet</code> itself.</br>
		 * This event is fired just before the generated file is saved to the file system.
		 *
		 * @param {object} [oData] An application-specific payload object that will be passed to the event handler along with the event object when firing the event
		 * @param {function} fnHandler The function to be called when the event occurs
		 * @param {object} [oListener] Context object to call the event handler with. Defaults to this <code>sap.ui.export.Spreadsheet</code> itself
		 *
		 * @returns {sap.ui.export.Spreadsheet} Reference to <code>this</code> in order to allow method chaining
		 *
		 * @function
		 * @name sap.ui.export.Spreadsheet#attachBeforeSave
		 * @since 1.61
		 * @public
		 */
		Spreadsheet.prototype.attachBeforeSave = function(oData, fnHandler, oListener) {
			return this.attachEvent('beforeSave', oData, fnHandler, oListener);
		};

		/**
		 * Detaches event handler <code>fnFunction</code> from the {@link sap.ui.export.Spreadsheet beforeSave}
		 * event of this <code>sap.ui.export.Spreadsheet</code>.</br>
		 * The passed function and listener object must match the ones used for event registration.
		 *
		 * @param {function} fnHandler The function to be called, when the event occurs
		 * @param {object} [oListener] Context object on which the given function had to be called
		 *
		 * @returns {sap.ui.export.Spreadsheet} Reference to <code>this</code> in order to allow method chaining
		 *
		 * @function
		 * @name sap.ui.export.Spreadsheet#detachBeforeSave
		 * @since 1.61
		 * @public
		 */
		Spreadsheet.prototype.detachBeforeSave = function(fnHandler, oListener) {
			return this.detachEvent('beforeSave', fnHandler, oListener);
		};

		/**
		 * Cleans up the internal structures and removes all event handlers.
		 *
		 * The object must not be used anymore after destroy was called.
		 *
		 * @see sap.ui.base.Object#destroy
		 * @public
		 */
		Spreadsheet.prototype.destroy = function() {
			EventProvider.prototype.destroy.apply(this, arguments);

			this.cancel();
			this.bIsDestroyed = true;
		};


		/**
		 * Cancels a running export process. This method does nothing if no export is running.
		 *
		 * @returns {Spreadsheet} - Reference to <code>this</code> in order to allow method chaining
		 *
		 * @function
		 * @name sap.ui.export.Spreadsheet#cancel
		 * @since 1.52
		 * @public
		 */
		Spreadsheet.prototype.cancel = function() {
			if (this.process) {
				this.process.cancel();
				this.process = null;
			}

			return this;
		};


		/**
		 * Progress callback. The function is called when the progress status changes.
		 *
		 * @function
		 * @param {number} iProgress - A number between 0 and 100 indicates the export progress in percent
		 *
		 * @name sap.ui.export.Spreadsheet#onprogress
		 */
		Spreadsheet.prototype.onprogress = function(iProgress) {
			Log.debug('Spreadsheet export: ' + iProgress + '% loaded.');
		};

		/**
		 * Creates a valid dataSource configuration
		 *
		 * @param {sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oBinding - A subclass of sap.ui.model.ListBinding or sap.ui.model.TreeBinding
		 * @returns {Object} - Valid data source configuration built upon the ListBinding
		 */
		var createDataSourceFromBinding = function(oBinding) {
			/**
			 * Use empty array as default in case of <code>ListBinding</code> is not of type
			 * ClientListBinding and does not provide a getDownloadUrl function
			 */
			var oDataSource = [];

			/**
			 * If <code>ClientListBinding</code>, we use the binding path to receive the data from the underlying model
			 */
			if (oBinding.isA('sap.ui.model.ClientListBinding')) {
				var aData = oBinding.getModel().getProperty(oBinding.getPath());

				oDataSource = (aData instanceof Array) ? aData : [];
			}

			if (oBinding.isA('sap.ui.model.ClientTreeBinding')) {
				Log.error('Unable to create dataSource configuration due to not supported Binding: ' + oBinding.getMetadata().getName());
			}

			/**
			 * All other <code>Bindings</code> need to provide a downloadUrl
			 */
			if (typeof oBinding.getDownloadUrl == 'function') {
				var oModel = oBinding.getModel();
				var sDataUrl = oBinding.getDownloadUrl("json");
				var sServiceUrl = oModel.sServiceUrl;

				sDataUrl = ExportUtils.interceptUrl(sDataUrl);
				sServiceUrl = ExportUtils.interceptUrl(sServiceUrl);

				oDataSource = {
					type: "odata",
					dataUrl: sDataUrl,
					serviceUrl: sServiceUrl,
					headers: oModel.getHeaders(),
					count: oBinding.getTotalSize ? oBinding.getTotalSize() : oBinding.getLength(),
					useBatch: oModel.isA('sap.ui.model.odata.v4.ODataModel') || oModel.bUseBatch
				};
			}

			return oDataSource;
		};

		/**
		 * Sets the data source configuration that will be used for exporting the data. If the passed parameter is null,
		 * the call will be ignored.
		 *
		 * @param {Array|Object|sap.ui.model.ListBinding|sap.ui.model.TreeBinding} oDataSource - Possible types are a plain
		 *        string that contains an URL of an OData service, an array of JSON objects, a data source configuration,
		 *        a sap.ui.model.ListBinding or sap.ui.model.TreeBinding
		 * @returns {Object} - Valid dataSource object
		 *
		 * @since 1.73
		 * @public
		 */
		Spreadsheet.prototype.processDataSource = function(oDataSource) {
			var mDataSource = null;
			var sDataSourceType = typeof oDataSource;

			if (!oDataSource) {
				return;
			}

			if (sDataSourceType == 'string') {
				return {
					dataUrl: oDataSource,
					type: 'odata',
					useBatch: false
				};
			}

			if (sDataSourceType != 'object') {
				Log.error('Spreadsheet#setDataSource: Unable to apply data source of type ' + sDataSourceType);

				return;
			}

			if (oDataSource instanceof Array || oDataSource.dataUrl) {
				mDataSource = oDataSource;
			}

			if (oDataSource.isA && (oDataSource.isA('sap.ui.model.ListBinding') || oDataSource.isA('sap.ui.model.TreeBinding'))) {
				mDataSource = createDataSourceFromBinding(oDataSource);
			}

			return mDataSource;
		};

		/**
		 * Map of accepted EDM types in lower case.
		 *
		 * @private
		 */
		var mPrimitiveTypes = (function() {
			var result = {};
			for (var key in library.EdmType) {
				result[key.toLowerCase()] = key;
			}
			return result;
		})();

		var ERROR_MSG_PREFIX = 'Spreadsheet export: ';

		/**
		 * Validates and normalizes export parameters.
		 *
		 * @function
		 * @param {Object} mParameters - Export parameters object
		 *
		 * @private
		 */
		function validateParameters(mParameters) {

			var pre = ERROR_MSG_PREFIX;
			var odata = 'odata';
			var sExtension = '.xlsx';
			var count = mParameters.count || 1;
			var sourceType;

			// Exported file name
			mParameters.fileName = mParameters.fileName || 'export';
			if (!mParameters.fileName.endsWith(sExtension)) {
				mParameters.fileName += sExtension;
			}

			// Data source
			assert(mParameters.dataSource, pre + 'data source is not specified.');
			var dataSource =  mParameters.dataSource;
			if (typeof dataSource === 'string') {
				mParameters.dataSource = {dataUrl : dataSource, type: odata, count: count};
				mParameters.count = count;
			} else if (Array.isArray(dataSource)) {
				mParameters.dataSource = {data: dataSource, type: 'array'};
			} else if (dataSource && dataSource.dataUrl) {
				sourceType = (dataSource.type || odata).toLowerCase();
				assert([odata].indexOf(sourceType) >= 0, pre + 'unsupported data source type.');
				mParameters.dataSource.type = sourceType;
				if (dataSource.useBatch) {
					assert(dataSource.serviceUrl, pre + 'serviceUrl is required for OData batch requests.');
					assert(dataSource.headers, pre + 'model.headers is required for OData batch requests.');
				}
			}

			// Check sizeLimit
			var sizeLimit = mParameters.dataSource.sizeLimit;
			if (sourceType === odata && (!sizeLimit || isNaN(sizeLimit))) {
				sizeLimit = Math.round(count / 1000) * 200; // try to load data in 5 steps, but each step should be at least 200 rows;
				sizeLimit = Math.min(10000, Math.max(sizeLimit, 200));
				Log.info(pre + 'dataSource.sizeLimit is not provided. sizeLimit is set to ' + sizeLimit);
				mParameters.dataSource.sizeLimit = sizeLimit;
			}

			// Column configurations
			var spreadsheetConfig = mParameters && mParameters.workbook;
			assert(spreadsheetConfig && Array.isArray(spreadsheetConfig.columns), pre + 'column configuration is not provided. Export is not possible');

			spreadsheetConfig.columns.forEach(function(col) {

				assert(col, pre + 'column configuration is not provided. Export is not possible.');
				assert(col.property, pre + 'column property is not provided. The column is not exported.');
				assert(col.label, pre + 'column label is not provided.');
				col.label = col.label || (col.property instanceof Array ? col.property[0] : col.property) || '';

				// Width
				var width = col.width;
				if (typeof width === 'string') {
					var sWidth = width.toLowerCase();
					width = parseFloat(sWidth);
					if (sWidth.indexOf('em') > 0) {
						width = width * 2;
					} else if (sWidth.indexOf('px') > 0) {
						width = width / 8;
					}
				}
				if (isNaN(width) || width < 1) {
					width = 10;
				}
				if (col.label.length < 30) {
					width = Math.max(col.label.length, width);
				}
				col.width = Math.round(width);

				// Property type
				if (col.type) {
					col.type = col.type.toLowerCase();
					if (!mPrimitiveTypes[col.type]) {
						Log.warning(pre + 'unsupported column property type ' + col.type + '. Type is reverted to "string".');
						col.type = '';
					}
					if (col.type === 'currency' && !col.unitProperty) {
						Log.warning(pre + 'missing unit property for currency column. Type is reverted to "string".');
						col.type = '';
					}
				}

				// Scale parameter for numeric types
				var scale = col.scale;
				if (col.type === 'number' && isNaN(scale) && scale !== 'variable') {
					Log.warning(pre + 'scale parameter for numerical column configuration is missing.');
				}
				if (typeof scale === 'string') {
					scale = parseInt(scale);
				}
				if (isNaN(scale)) {
					scale = null;
				}
				col.scale = scale;

				// Text align
				var textAlign = (col.textAlign + '').toLowerCase();

				/* Map the values begin & end according to RTL */
				if (['begin', 'end'].indexOf(textAlign) > -1) {
					var mappedAlignment = ['left', 'right'];

					textAlign = (sap.ui.getCore().getConfiguration().getRTL() ? mappedAlignment.reverse() : mappedAlignment)[['begin', 'end'].indexOf(textAlign)];
				}
				if (textAlign !== '' && ['left','right','center', 'begin', 'end'].indexOf(textAlign) == -1) {
					Log.warning(pre + 'incorrect column alignment property: ' + textAlign + '. Default alignment is used.');
					textAlign = '';
				}
				col.textAlign = textAlign;
			});
		}


		/**
		 * Loads data from the backend, builds and saves the resulting spreadsheet file. You can use the <code>cancel</code> method to stop a running export.
		 *
		 * @function
		 * @returns {Promise} Promise object. You may use it to track the result of the export process.
		 *
		 * @name sap.ui.export.Spreadsheet#build
		 * @public
		 */
		Spreadsheet.prototype.build = function() {
			var oSpreadsheet = this;

			var mParameters = this._mSettings;

			if (this.bIsDestroyed) {
				var sMessage = ERROR_MSG_PREFIX + 'Cannot trigger build - the object has been destroyed';

				Log.error(sMessage);
				return Promise.reject(sMessage);
			}

			this.fireEvent('beforeExport', {exportSettings: mParameters}, false, false);

			validateParameters(mParameters);

			return new Promise(function (fnResolve, fnReject) {

				var progressDialog;
				var sizeLimit = Device.system.desktop ? 2000000 : 100000; // 2.000.000 cells on desktop and 100.000 otherwise
				var nRows = mParameters.dataSource.count;
				var nColumns = mParameters.workbook.columns.length;

				function onmessage(message) {

					if (!isNaN(message.progress)) {
						if (progressDialog) {
							progressDialog.updateStatus(message.progress);
						}
						oSpreadsheet.onprogress(message.progress);
					}

					if (message.finish) {
						oSpreadsheet.process = null;

						if (!message.data) {
							fnReject('Spreadsheet export: The process was canceled');
							return;
						}

						var executeDefaultAction = oSpreadsheet.fireEvent('beforeSave', {
							data: message.data
						}, true, true);

						/*
						 * Keep the progress dialog open for 1 second to avoid
						 * screen flickering in case of extremely fast exports
						 */
						if (progressDialog) {
							window.setTimeout(progressDialog.finish, 1000);
						}

						if (executeDefaultAction) {
							ExportUtils.saveAsFile(new Blob([message.data], {
								type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
							}), mParameters.fileName);
						}

						fnResolve();
					}

					if (typeof message.error != 'undefined') {
						oSpreadsheet.process = null;

						if (progressDialog) {
							progressDialog.finish();
						}

						fnReject(message.error);
						ExportDialog.showErrorMessage(message.error);
					}
				}

				function startExport() {
					if (!mParameters.showProgress) {
						if (oSpreadsheet.process) {
							fnReject('Cannot start export: the process is already running');
							return;
						}

						oSpreadsheet.process = SpreadsheetExport.execute(mParameters, onmessage);
						return;
					}

					// Show progress dialog
					ExportDialog.getProgressDialog().then(function(oDialogResolve) {
						progressDialog = oDialogResolve;

						if (oSpreadsheet.process) {
							fnReject('Cannot start export: the process is already running');
							return;
						}

						progressDialog.oncancel = function() {
							return oSpreadsheet.process && oSpreadsheet.process.cancel();
						};

						progressDialog.open();

						// Start export once the dialog is present
						oSpreadsheet.process = SpreadsheetExport.execute(mParameters, onmessage);
					});
				}

				// When there are no columns --> don't trigger the export
				if (nColumns <= 0) {
					// Consider showing a dialog to the end users instead of just this error!
					fnReject('No columns to export.');
				} else if (nRows * nColumns > sizeLimit) {
					// Show warning and execute
					ExportDialog.showWarningDialog({rows: nRows, columns: nColumns})
						.then( startExport )
						.catch( function() {
							fnReject('Export cancelled by the user.');
						});
				} else {
					startExport();
				}

			});
		};

		return Spreadsheet;

	});
