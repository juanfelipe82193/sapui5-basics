/* SAP APF Analysis Path Framework
* 
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare("sap.apf.ui.representations.table");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require('sap.apf.ui.utils.formatter');
jQuery.sap.require("sap.apf.ui.representations.utils.paginationHandler");
jQuery.sap.require("sap.apf.ui.representations.BaseUI5ChartRepresentation");
jQuery.sap.require("sap.apf.ui.representations.utils.paginationDisplayOptionHandler");
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("sap.ui.table.Table");
jQuery.sap.require("sap.ui.table.Column");
jQuery.sap.require("sap.ui.core.CustomData");
jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.core.Icon");
jQuery.sap.require("sap.ui.layout.VerticalLayout");
jQuery.sap.require("sap.m.Text");
jQuery.sap.require("sap.m.Label");
jQuery.sap.require("sap.m.Button");
jQuery.sap.require("sap.m.HBox");
jQuery.sap.require("sap.m.VBox");
jQuery.sap.require("sap.m.ScrollContainer");
jQuery.sap.require('sap.ui.export.Spreadsheet');
jQuery.sap.require("sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport");
jQuery.sap.require("sap.ui.export.EdmType");
jQuery.sap.require("sap.m.Dialog");
(function() {
	'use strict';
	//select the items in the table which are passed as parameter
	function _selectItemsInTable(tableControl, aSelectedItems) {
		aSelectedItems.forEach(function(item) {
			tableControl.addSelectionInterval(item, item);
		});
	}
	function _attachEvent(oControl) {
		oControl.loadAllButton.attachEvent("setFocusOnLoadAllButtonEvent", oControl.loadAllButton.setFocusOnLoadAllButton);
	}
	function _validateFilters(oTableInstance, sRequiredFilterProperty) {
		if (oTableInstance.bIsAlternateRepresentation && oTableInstance.oApi.getActiveStep()) { //read filters from corresponding chart of alternate table
			oTableInstance.oApi.getActiveStep().getSelectedRepresentation().oRepresentationFilterHandler.getFilterValues().forEach(function(aFilter) {
				if (oTableInstance.aFiltersInTable.indexOf(aFilter) === -1) {
					oTableInstance.aFiltersInTable.push(aFilter);
				}
			});
		}
		if ((sRequiredFilterProperty && oTableInstance.oParameter.top) || oTableInstance.oParameter.isAlternateRepresentation) {
			oTableInstance.aFiltersInTable = _getAllFilterInTable(oTableInstance, sRequiredFilterProperty);
		}
	}
	//get all the filters in the table based on the required filter
	function _getAllFilterInTable(oTableInstance, sRequiredFilterProperty) {
		var aFiltersInTable = [];
		oTableInstance.aFiltersInTable.forEach(function(filter) {
			oTableInstance.aDataResponse.forEach(function(item) { // selection in table which are based on the result filter values
				var reqFilterValue = item[sRequiredFilterProperty];
				if (reqFilterValue == filter && aFiltersInTable.indexOf(filter) === -1) {
					aFiltersInTable.push(filter);
				}
			});
		});
		return aFiltersInTable;
	}
	//toggles the selection based on the event.
	function _getToggledSelection(oTableInstance, sRequiredFilter, aCurrentSelectedItem) {
		var sCurrentRequiredFilter = oTableInstance.tableControl.getContextByIndex(aCurrentSelectedItem[0]).getProperty(sRequiredFilter);
		if ((oTableInstance.tableControl.isIndexSelected(aCurrentSelectedItem[0])) && (oTableInstance.aFiltersInTable.indexOf(sCurrentRequiredFilter)) === -1) {
			oTableInstance.aFiltersInTable.push(sCurrentRequiredFilter); // if new item is selected, add it to the new added filter array
		} else {
			var indexOfToggledItem = oTableInstance.aFiltersInTable.indexOf(sCurrentRequiredFilter);
			if (indexOfToggledItem !== -1) { // if item is deselected, find the index of item and remove it from array
				oTableInstance.aFiltersInTable.splice(indexOfToggledItem, 1);
			}
		}
	}
	//update the filter 
	function _updateFilters(oTableInstance, aCombinedFilterValues) {
		_clearFilters(oTableInstance); // clear the filters first, so that older values are not retained on filter values
		oTableInstance.aFiltersInTable = aCombinedFilterValues;
		oTableInstance.oApi.getActiveStep().getSelectedRepresentation().oRepresentationFilterHandler.updateFilterFromSelection(aCombinedFilterValues);
		oTableInstance.oApi.selectionChanged();
	}
	//clear the filters
	function _clearFilters(oTableInstance) {
		oTableInstance.oRepresentationFilterHandler.clearFilters();
		oTableInstance.oApi.getActiveStep().getSelectedRepresentation().oRepresentationFilterHandler.clearFilters();
		oTableInstance.aValidatedFilter = [];
		oTableInstance.aFiltersInTable = [];
	}
	/* rules:
	* - load all button does not show up in table with configured top n
	* - same holds for count information (12 of 100 records)
	*/
	function createTitlebarForTable(oController, stepTitle, actualNumberOfRecords, bNotLoadAll, width) {
		var numberOfAllRecords = oController.nDataResponseCount || 0;
		var buttonBox, titleText;
		var text = oController.oApi.getTextNotHtmlEncoded("buttonTextExport");
		var exportButton = new sap.m.Button({
			text : text,
			press : function() {
				if(oController.aDataResponse.length > 10000) {
					//open dialog
						var self = oController;
						self.newOpenDialog = new sap.m.Dialog({
							type : sap.m.DialogType.Message,
							title : oController.oApi.getTextNotHtmlEncoded("warningTitle"),
							state: 'Warning',
							content : new sap.m.Text({
							//text : "You are exporting " + oController.aDataResponse.length + " cells to Excel. Exporting large amounts of data may lead to a browser out of memory exception, which will result in the loss of your current analysis path.To avoid losing your work, save your analysis path before exporting.\n\n Are you sure you want to export your data?",
								text: oController.oApi.getTextNotHtmlEncoded("exportWarning"),							}),
							beginButton : new sap.m.Button({
								text : oController.oApi.getTextNotHtmlEncoded("warningExport"),
								press : function() {
									oController.exportExcel(stepTitle);
									self.newOpenDialog.close();
									}
								}),
							endButton : new sap.m.Button({
								text : oController.oApi.getTextNotHtmlEncoded("warningCancel"),
								press : function() {
									self.newOpenDialog.close();
								}
							}),
							afterClose : function() {
								self.oUiApi.getLayoutView().setBusy(false);
								self.newOpenDialog.destroy();
							}
						});
						self.newOpenDialog.open();
				}else {
					oController.exportExcel(stepTitle);
				}
			}
		}).addStyleClass("sapUiTinyMarginBeginEnd");
		oController.titleControl = new sap.m.Title({
			level : sap.ui.core.TitleLevel.H1
		}).addStyleClass("sapUiTinyMarginBegin").addStyleClass("sapUiTinyMarginTop");
		if (oController.aDataResponse.length === 0){
			exportButton.setEnabled(false);
		}
		if (width){ //if width is set, the table is created for preview content in the modeler, no buttons in the title then
			titleText = oController.title;
		} else if (oController.oParameter.top) {//no loadAll-Button if topN is configured for table,
			buttonBox = new sap.m.HBox({
				items : [ exportButton ]
			});
			titleText = oController.title;
		} else if (bNotLoadAll){ // no loadAll-Button if notLoadAll is configured for table (e.g. in case of alternate representation)
			buttonBox = new sap.m.HBox({
				items : [ exportButton ]
			});
			titleText = oController.oApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords", [ oController.title, actualNumberOfRecords, actualNumberOfRecords ]); // comment: this code was written under the assumption that the chart that turns into alternate representation already contains all available data (count of loaded data === count of total data)
		} else {
			text = oController.oApi.getTextNotHtmlEncoded("buttonTextLoadAll");
			if (oController.loadAllButton === undefined) {
				oController.loadAllButton = new sap.m.Button({
					text : text,
					press : oController.loadAll.bind(oController)
				});
				oController.loadAllButton.setFocusOnLoadAllButton = function() {
					this.focus();
					this.detachEvent("setFocusOnLoadAllButtonEvent", this.setFocusOnLoadAllButton);
				};
			}
			buttonBox = new sap.m.HBox({
				items : [ oController.loadAllButton, exportButton ]
			});
			titleText = oController.oApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords", [ oController.title, actualNumberOfRecords, numberOfAllRecords ]);
			oController.loadAllButton.addAriaLabelledBy(oController.titleControl);
		}
		exportButton.addAriaLabelledBy(oController.titleControl);
		oController.titleControl.setText(titleText);
		var hbox = new sap.m.HBox({
			alignItems : "Start",
			justifyContent : "SpaceBetween",
			items : [ oController.titleControl, buttonBox ]
		});
		return hbox;
	}
	//creates the table and binds the columns to it. Also formats the cell value based on the metadata.
	function _createTableAndBindColumns(tableColumns, oStepTitle, oTableInstance, width) {
		var formatCellValue = function(index) {
			return function(columnValue) {
				if (oTableInstance.metadata !== undefined) {
					var formatedColumnValue;
					if (tableColumns.value[index] && columnValue) {
						formatedColumnValue = oTableInstance.oFormatter.getFormattedValueAsString(tableColumns.value[index], columnValue);
						if (formatedColumnValue !== undefined) {
							return formatedColumnValue;
						}
					}
				}
				return columnValue;
			};
		};
		var oTable = new sap.ui.table.Table({
			title : oStepTitle,
			showNoData : false,
			enableSelectAll : false,
			visibleRowCountMode : sap.ui.table.VisibleRowCountMode.Auto
		});
		if(width){
			oTable.setWidth(width + "px");
		}
		oTable.setLayoutData(new sap.m.FlexItemData({
			growFactor : 1
		}));
		if (sap.ui.Device.system.desktop) {
			oTable.addStyleClass("sapUiSizeCompact");
		}
		var aRequiredFilter = oTableInstance.oParameter.requiredFilters;
		var selectionMode = (aRequiredFilter && (aRequiredFilter.length > 0)) ? "MultiToggle" : "None";
		oTable.setSelectionMode(selectionMode);
		//Adding the columns headers ,column data to table and custom data for view setting dialog.
		var columnForDataTable = [], oControl, oColumn, customDataForColumnText;
		for(var indexTableColumn = 0; indexTableColumn < tableColumns.name.length; indexTableColumn++) {
			oControl = new sap.m.Text({
				wrapping: false
			});
			oControl.bindText(tableColumns.value[indexTableColumn], formatCellValue(indexTableColumn), sap.ui.model.BindingMode.OneWay);
			oControl.bindProperty("tooltip", tableColumns.value[indexTableColumn], formatCellValue(indexTableColumn));
			oColumn = new sap.ui.table.Column({
				label : new sap.m.Label({
					text : tableColumns.name[indexTableColumn],
					tooltip :  tableColumns.name[indexTableColumn]
				}),
				template : oControl
			});
			customDataForColumnText = new sap.ui.core.CustomData({
				value : {
					text : tableColumns.name[indexTableColumn],
					key : tableColumns.value[indexTableColumn]
				}
			});
			if(width){ //set Min width for columns in case of preview in modeler
				oColumn.setMinWidth(125);
			}
			oColumn.addCustomData(customDataForColumnText);
			columnForDataTable.push(oColumn);
		}
		//Adding all columns to table.
		var aColumns;
		aColumns = columnForDataTable;
		aColumns.forEach(function(column) {
			oTable.addColumn(column);
		});
		if (columnForDataTable.length > 10) {
			oTable.getColumns().forEach(function(oColumn) { // Columns > 10, horizontal scroll should come in table
				oColumn.setWidth("125px");// since the chart width is 1000px ,hence setting the columns  width based on it.
			});
		}
		//Create a JSONModel, fill in the data and bind the Table to this model.
		var oModelForTable = new sap.ui.model.json.JSONModel();
		oModelForTable.setSizeLimit(10000);
		var aTableData = oTableInstance.getData();
		oModelForTable.setData({
			tableData : aTableData
		});
		oTable.setModel(oModelForTable);
		oTable.bindRows("/tableData");
		if (oTableInstance.metadata !== undefined) {
			for(var fieldIndex = 0; fieldIndex < tableColumns.name.length; fieldIndex++) {
				var oMetadata = oTableInstance.metadata.getPropertyMetadata(tableColumns.value[fieldIndex]);
				if (oMetadata["aggregation-role"] === "measure") {
					var measureCol = oTable.getColumns()[fieldIndex];
					measureCol.setHAlign(sap.ui.core.HorizontalAlign.End);
				}
			}
		}
		return oTable;
	}
	/**
	* @description creates the column structure for the table which has the name and value. Also appends the unit of the column in the header of the table.
	* returns oColumnData - oColumnData has name and value of each column which has to be formed in the table.
	*                 e.g. oColumnData = {
	*                                      name : ["column1","column2"],
	*                                      value :["value1","value2"] 
	*                                     }
	*/
	function _getColumnFromProperties(oTableInstance) {
		var aTableData = oTableInstance.getData();
		var aProperties = [], nTableDataCount;
		var oColumnData = {
			name : [],
			value : []
		};
		aProperties = oTableInstance.oParameter.dimensions.concat(oTableInstance.oParameter.measures).length ? oTableInstance.oParameter.dimensions.concat(oTableInstance.oParameter.measures) : oTableInstance.parameter.properties; // read the table properties if available , else Concatenate dimensions & measures
		if (aTableData.length !== 0) {
			for(var i = 0; i < aProperties.length; i++) {
				oColumnData.value[i] = aProperties[i].fieldName;
				var defaultLabel = oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).label || oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).name;// read the label of the property and assign it to the column
				var sUnitValue = "";
				if (oTableInstance.metadata !== undefined && oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).unit !== undefined) {
					var sUnitReference = oTableInstance.metadata.getPropertyMetadata(aProperties[i].fieldName).unit; // read the unit of the data in one column
					sUnitValue = oTableInstance.getData()[0][sUnitReference]; // take value of unit from first data set
					for(nTableDataCount = 0; nTableDataCount < oTableInstance.getData().length; nTableDataCount++) {
						if (sUnitValue !== oTableInstance.getData()[nTableDataCount][sUnitReference]) {
							sUnitValue = undefined;
							break;
						}
					}
					oColumnData.name[i] = aProperties[i].fieldDesc === undefined || !oTableInstance.oApi.getTextNotHtmlEncoded(aProperties[i].fieldDesc).length ? defaultLabel : oTableInstance.oApi.getTextNotHtmlEncoded(aProperties[i].fieldDesc);
					if (sUnitValue !== undefined && sUnitValue !== "") {
						oColumnData.name[i] = oTableInstance.oApi.getTextNotHtmlEncoded("displayUnit", [ oColumnData.name[i], sUnitValue ]); // append the unit to the label 
					}
				} else { // if there is no unit, just display the label of the column
					oColumnData.name[i] = aProperties[i].fieldDesc === undefined || !oTableInstance.oApi.getTextNotHtmlEncoded(aProperties[i].fieldDesc).length ? defaultLabel : oTableInstance.oApi.getTextNotHtmlEncoded(aProperties[i].fieldDesc);
				}
			}
		}
		return oColumnData;
	}
	function _getSelectedSortItemById(oViewSettingDialog) {
		var sSortItemKey;
		var oSelectedSortItem = oViewSettingDialog.getSelectedSortItem();
		oViewSettingDialog.getSortItems().forEach(function(oSortItem) {
			if (oSortItem.getId() === oSelectedSortItem) {
				sSortItemKey = oSortItem.getKey();
			}
		});
		return sSortItemKey;
	}
	/**
	* @class table constructor.
	* @param oApi,oParameters
	* defines parameters required for chart such as Dimension/Measures.
	* @returns table object
	*/
	sap.apf.ui.representations.table = function(oApi, oParameters) {
		this.oViewSettingDialog = undefined;
		this.aDataResponse = [];// getData in the base class reads the value of data response from this
		this.aValidatedFilter = [];
		this.aFiltersInTable = [];
		this.oParameter = oParameters;
		this.orderby = oParameters.orderby;
		this.omitTopAndSkipOptionsForNextPathUpdate = false;
		sap.apf.ui.representations.BaseUI5ChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.alternateRepresentation = oParameters.alternateRepresentationType;
		this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION; //the type is read from step toolbar and step container
		this.oPaginationHandler = new sap.apf.ui.representations.utils.PaginationHandler(this);//initialize the pagination handler
		this.oPaginationDisplayOptionHandler = new sap.apf.ui.representations.utils.PaginationDisplayOptionHandler();

		/**
		 * read the filters and select the rows in table.
		 * Also read the selected items where selection is enabled, creates the filters from selections
		 */
		this._drawSelection = function (oEvent) {
			var aRequiredFilter = this.oParameter.requiredFilters;
			var sRequiredFilterProperty = aRequiredFilter && (aRequiredFilter.length > 0) ? aRequiredFilter[0] : undefined; //read the required filter from the internal filter or the required filters (when table is created, the internal filter wont be available)
			var isUserInteraction = oEvent.getParameter("userInteraction");
			var aCurrentSelectedItem = oEvent.getParameter("rowIndices"); // store the current selected item for which selection event is triggered
			if (!isUserInteraction || aCurrentSelectedItem.length === 0) {
				return;
			}
			if (oEvent.getSource().getFocusDomRef() && oEvent.getSource().getFocusDomRef().offsetTop !== 0) { //if row is selected, get the scroll position
				this.nFirstVisibleRow = this.tableControl.getFirstVisibleRow();
			}
			_getToggledSelection(this, sRequiredFilterProperty, aCurrentSelectedItem);
			var aCombinedFilterValues = jQuery.unique(this.aFiltersInTable);
			_updateFilters(this, aCombinedFilterValues);
		};
		/**
		 * The event handler cannot be accessed and a spy put. Hence this function is a wrapper for the function that can be observed/spied.
		 * Also read the selected items where selection is enabled, creates the filters from selections
		 */
		this._handleSelectionEvent = function (oEvent) {
			this._drawSelection(oEvent);
		};
		/** get all selected items in the table based on the required filter
		 *  @param {sap.apf.ui.representations.table}
		 *  @param {string}
		 *  @returns {number[]}
		 */
		this._getSelectedIndicesInTable = function(sRequiredFilterProperty) {
			var that = this;
			var aSelectedIndex = [];
			that.aDataResponse.forEach(function(item, index) { // selection in table which are based on the result filter values
				var reqFilterValue = item[sRequiredFilterProperty];
				if (that.aFiltersInTable.indexOf(reqFilterValue) !== -1) {
					aSelectedIndex.push(index);
				}
			});
			return aSelectedIndex;
		};
	};
	sap.apf.ui.representations.table.prototype = Object.create(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype);
	sap.apf.ui.representations.table.prototype.constructor = sap.apf.ui.representations.table;// Set the "constructor" property to refer to table
	/**
	* @method setData
	* @param aDataResponse - Response from oData service
	* @param metadata - Metadata of the oData service
	* @description Public API which Fetches the data from oData service and updates the selection if present
	*/
	sap.apf.ui.representations.table.prototype.setData = function(aDataResponse, metadata, nDataResponseCount, aValidatedFilters) {
		var self = this;
		var sRequiredFilterProperty, sDisplayTextForRequiredFilter;
		if (!metadata) {
			var oMessageObject = this.oApi.createMessageObject({
				code : "6004",
				aParameters : [ this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		this.metadata = metadata;
		this.oFormatter = new sap.apf.ui.utils.formatter({ // formatter for the value formatting
			getEventCallback : this.oApi.getEventCallback.bind(this.oApi),
			getTextNotHtmlEncoded : this.oApi.getTextNotHtmlEncoded,
			getExits : this.oApi.getExits()
		}, this.metadata, this.aDataResponse);
		if (this.oParameter.requiredFilters.length > 0) {
			sRequiredFilterProperty = this.oParameter.requiredFilters[0];
			sDisplayTextForRequiredFilter = metadata.getPropertyMetadata(sRequiredFilterProperty).text;
		}
		if (!this.oParameter.isAlternateRepresentation) {
			if (sRequiredFilterProperty) {
				this.aValidatedFilter = [];
				if (aValidatedFilters && aValidatedFilters.length > 0) {
					aValidatedFilters.forEach(function(filter) {
						self.aValidatedFilter.push(filter[sRequiredFilterProperty]);
						self.oPaginationDisplayOptionHandler.createDisplayValueLookupForPaginatedFilter(filter[sRequiredFilterProperty], filter[sDisplayTextForRequiredFilter]);
					});
					self.aFiltersInTable = self.aValidatedFilter;
				} else {
					self.aFiltersInTable = [];
				}
			}
			var requestOptions = this.getRequestOptions();
			var skip = requestOptions.paging && requestOptions.paging.skip;
			this.nDataResponseCount = nDataResponseCount;
			if (skip === undefined || skip === 0) { //if data is getting fetched for the first time and no data has to be skipped
				this.aDataResponse = aDataResponse; // For new table, read only 100 data set
			} else { //if pagination is triggered , only 99 data has to be fetched and appended to the existing data set
				aDataResponse.map(function(dataRow) {
					self.aDataResponse.push(dataRow); // for pagination , append the data to the existing data set
				});
			}
			if (!this.oParameter.top && this.titleControl) {
				var actualNumberOfRecords = (this.aDataResponse && this.aDataResponse.length) || 0;
				var titleText = this.oApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords", [ this.title, actualNumberOfRecords, nDataResponseCount ]);
				this.titleControl.setText(titleText);
			}
		} else { //for alternate table, replace the whole data set
			this.aDataResponse = aDataResponse;
		}
		if (sDisplayTextForRequiredFilter) {
			this.aDataResponse.forEach(function(dataRow) {
				self.oPaginationDisplayOptionHandler.createDisplayValueLookupForPaginatedFilter(dataRow[sRequiredFilterProperty], dataRow[sDisplayTextForRequiredFilter]);
			});
		}
	};
	sap.apf.ui.representations.table.prototype.getFilter = function() {
		this.filter = this.oRepresentationFilterHandler.createFilterFromSelectedValues(this.aFiltersInTable);
		return this.filter;
	};
	sap.apf.ui.representations.table.prototype.getSelections = function() {
		var oTableInstance = this, oSelectionObject = [], sSelectionText;
		var sRequiredFilterProperty = oTableInstance.parameter.requiredFilters[0];
		_validateFilters(oTableInstance, sRequiredFilterProperty);
		oTableInstance.aFiltersInTable.forEach(function(selection) {
			sSelectionText = oTableInstance.oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter(selection, oTableInstance.parameter.requiredFilterOptions, sRequiredFilterProperty, oTableInstance.oFormatter, oTableInstance.metadata);
			oSelectionObject.push({
				id : selection,
				text : sSelectionText
			});
		});
		return oSelectionObject;
	};
	/**
	* @method markSelectionInTable
	* @description Public API which is called after rendering of table and also after pagination to mark the selection
	*/
	sap.apf.ui.representations.table.prototype.markSelectionInTable = function(bIsCalledFromTable) {
		var sRequiredFilterProperty = this.oParameter.requiredFilters ? this.oParameter.requiredFilters[0] : undefined;
		if (sRequiredFilterProperty) {
			var aSelectedIndicesInTable = this._getSelectedIndicesInTable(sRequiredFilterProperty);
			if (this.oParameter.isAlternateRepresentation) {
				var aSelectedIndicesInSortedTable = [];
				var aSortedIndicesInAlternateTable = this.tableControl.getBinding().aIndices;
				aSelectedIndicesInTable.forEach(function(selectedItem) {
					aSelectedIndicesInSortedTable.push(aSortedIndicesInAlternateTable.indexOf(selectedItem));
				});
				aSelectedIndicesInTable = aSelectedIndicesInSortedTable;
			}
			this.tableControl.clearSelection();
			if (aSelectedIndicesInTable.length > 0) { //  if there are any filters ,mark the selection in table filter values
				_selectItemsInTable(this.tableControl, aSelectedIndicesInTable);
			}
		}
	};
	sap.apf.ui.representations.table.prototype.getRequestOptions = function(bFilterChanged, isAlternateRep) {
		this.bIsAlternateRepresentation = isAlternateRep;
		if (bFilterChanged) { // When the filter is changed, then paging option is reset to default.
			this.oPaginationHandler.resetPaginationOption();
		}
		var requestObj = {
			paging : {},
			orderby : []
		};
		if (bFilterChanged) {
			this.omitTopAndSkipOptionsForNextPathUpdate = false;
		}
		if (this.omitTopAndSkipOptionsForNextPathUpdate) {
			requestObj.paging = {
				inlineCount : true
			};
		} else if (!this.bIsAlternateRepresentation) {
			requestObj.paging = this.oPaginationHandler.getPagingOption(this.oParameter.top);
		}
		//table can have the sort property defined in the parameter or the sort property can be changed from view setting dialog
		if (this.orderby) {
			requestObj.orderby = this.orderby;
		}
		if (this.oViewSettingDialog) {
			var sSortProperty = _getSelectedSortItemById(this.oViewSettingDialog);
			if (sSortProperty) {
				var oSortOptionFromViewSetting = {
					property : _getSelectedSortItemById(this.oViewSettingDialog),
					ascending : !this.oViewSettingDialog.getSortDescending()
				};
				this.orderby = [ oSortOptionFromViewSetting ];
				requestObj.orderby = [ oSortOptionFromViewSetting ];//if the sort property is changed from view setting
			}
		}
		return requestObj;
	};
	/**
	* @method resetPaginationForTable
	* @description calls the method from pagination handler to resets the paging option to default when there filter change in the path 
	*/
	sap.apf.ui.representations.table.prototype.resetPaginationForTable = function() {
		this.omitTopAndSkipOptionsForNextPathUpdate = false;
		this.oPaginationHandler.resetPaginationOption();
	};
	/**
	* @method getMainContent
	* @param oStepTitle - title of the main chart
	* @param width - width of the main chart
	* @param height - height of the main chart       
	* @description draws Main chart into the Chart area
	*/
	sap.apf.ui.representations.table.prototype.getMainContent = function(oStepTitle, width, height) {
		var self = this;
		var aTableData = this.getData();
		this.title = oStepTitle;
		var tableFields = this.oParameter.dimensions.concat(this.oParameter.measures).length ? this.oParameter.dimensions.concat(this.oParameter.measures) : this.oParameter.properties; // read the table properties if available , else Concatenate dimensions & measures
		var tableColumns = _getColumnFromProperties(this);
		var oMessageObject;
		if (!oStepTitle) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "title", this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		if (tableFields.length === 0) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "dimensions", oStepTitle ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		if (!aTableData || aTableData.length === 0) {
			oMessageObject = this.oApi.createMessageObject({
				code : "6000",
				aParameters : [ oStepTitle ]
			});
			this.oApi.putMessage(oMessageObject);
		}
		var titleLineControl;
		if (this.oParameter.isAlternateRepresentation) {
			titleLineControl = createTitlebarForTable(this, oStepTitle, aTableData.length, true, width); // no LoadAll-Button in alternate representation
		} else {
			titleLineControl = createTitlebarForTable(this, oStepTitle, aTableData.length, false, width);
		}
		this.tableControl = _createTableAndBindColumns(tableColumns, titleLineControl, this, width);
		this.tableControl.addAriaLabelledBy(titleLineControl.getItems()[0]);

		this.tableControl.addEventDelegate({//Event delegate to bind pagination action
			onAfterRendering : function() {
				if (self.oParameter) {
					self.markSelectionInTable(true);
					if(self.loadAllButton){
						self.loadAllButton.fireEvent("setFocusOnLoadAllButtonEvent");
					}
					//if top N not is provided and table is not an alternate representation, attach the pagination event
					if (!self.oParameter.top && !self.oParameter.isAlternateRepresentation && self.nDataResponseCount > 100) {
						self.oPaginationHandler.attachPaginationOnTable(self);
					}
				}
			}
		});
		this.tableControl.attachRowSelectionChange(this._handleSelectionEvent.bind(this));
		this.oLoadMoreLink = new sap.m.Link({// load more link should be shown for the mobile devices
			text : this.oApi.getTextNotHtmlEncoded("moreIcon"),
			visible : false
		});
		var vbox = new sap.m.VBox({
			fitContainer : true,
			items : [ this.tableControl, this.oLoadMoreLink ]
		}).addStyleClass("tableRepresentation");
		if(height){
			vbox.setHeight(height + "px");
		}
		return vbox;
	};
	/**
	* @method getThumbnailContent
	* @description draws Thumbnail for the current chart
	* @returns thumbnail object for column
	*/
	sap.apf.ui.representations.table.prototype.getThumbnailContent = function() {
		var oThumbnailContent;
		var aTableData = this.getData();
		var oIconForAlternateRep = this.oParameter.isAlternateRepresentation ? "sap-icon://table-view" : "sap-icon://table-chart";
		if (aTableData !== undefined && aTableData.length !== 0) {
			var oTableIcon = new sap.ui.core.Icon({
				src : oIconForAlternateRep,
				size : "70px"
			}).addStyleClass('thumbnailTableImage');
			oThumbnailContent = oTableIcon;
		} else {
			var noDataText = new sap.m.Text({
				text : this.oApi.getTextNotHtmlEncoded("noDataText")
			}).addStyleClass('noDataText');
			oThumbnailContent = new sap.ui.layout.VerticalLayout({
				content : noDataText
			});
		}
		return oThumbnailContent;
	};
	/**
	* @method removeAllSelection
	* @description removes all Selection from Chart
	*/
	sap.apf.ui.representations.table.prototype.removeAllSelection = function() {
		_clearFilters(this);
		this.tableControl.clearSelection();
		this.oApi.selectionChanged();
	};
	/**
	* @method getPrintContent
	* @param oStepTitle
	* title of the step
	* @description gets the printable content of the representation
	*/
	sap.apf.ui.representations.table.prototype.getPrintContent = function(oStepTitle) {
		var oPrintTable = this.tableControl.clone();
		oPrintTable.getColumns().forEach(function(column) {
			column.setWidth("auto");
			column.getTemplate().setWrapping(true);
		});
		var aSelecetdIndices = this.tableControl.getSelectedIndices();
		oPrintTable.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);
		oPrintTable.setVisibleRowCount(oPrintTable.getModel().getData().tableData.length);
		//To highlight selected rows in printlayout table (Because checkboxes are not visible in printlayout)
		oPrintTable.onAfterRendering = function() {
			aSelecetdIndices.forEach(function(index) {
				oPrintTable.getRows()[index].getDomRef().classList.add('sapTableSelectionForPrint');
			});
		};
		var oPrintObject = {
			oRepresentation : oPrintTable
		};
		return oPrintObject;
	};
	sap.apf.ui.representations.table.prototype.getViewSettingDialog = function() {
		if (!this.oViewSettingDialog) {
			var oViewData = {
				oTableInstance : this
			};
			var oViewSetting = new sap.ui.view({
				type : sap.ui.core.mvc.ViewType.JS,
				viewName : "sap.apf.ui.reuse.view.viewSetting",
				viewData : oViewData
			});
			this.oViewSettingDialog = oViewSetting.getContent()[0];
			this.oViewSettingDialog.addStyleClass("sapUiSizeCompact");
		}
		return this.oViewSettingDialog;
	};
	/**
	* load all data, when data in table is paged - show paging / top options away
	*/
	sap.apf.ui.representations.table.prototype.loadAll = function() {
		this.omitTopAndSkipOptionsForNextPathUpdate = true;
		if (this.loadAllButton) {
			_attachEvent(this);
		}
		this.oApi.selectionChanged();
	};
	/**
	* export the data to excel
	*/
	sap.apf.ui.representations.table.prototype.exportExcel = function(stepTitle) {
		var that = this;
		function createColumnInfoForSpreadSheet() {
			var columnProperties = _getColumnFromProperties(that);
			var columns = [];
			var i, columnInfo;
			for(i = 0; i < columnProperties.value.length; i++) {
				columnInfo = sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport(columnProperties.value[i], that.metadata);
				columnInfo.property = columnProperties.value[i];
				columnInfo.label = columnProperties.name[i];
				columns.push(columnInfo);
			}
			return columns;
		}
		var data = this.getData();
		var columns = createColumnInfoForSpreadSheet();
		var mSettings = {
			workbook : {
				columns : columns
			},
			dataSource : data,
			fileName : stepTitle + ".xlsx"
		};
		var spreadsheet = new sap.ui.export.Spreadsheet(mSettings);
		spreadsheet.build();
	};
	sap.apf.ui.representations.table.prototype.onChartSwitch = function() {
		this.resetPaginationForTable();
	};
	/**
	* @method destroy
	* @description Destroying instance level variables
	*/
	sap.apf.ui.representations.table.prototype.destroy = function() {
		if (this.orderby) {
			this.orderby = null;
		}
		if (this.oParameter) {
			this.oParameter = null;
		}
		if (this.oViewSettingDialog) {
			this.oViewSettingDialog.destroy();
		}
		if (this.aDataResponse) {
			this.aDataResponse = null;
		}
		if (this.aValidatedFilter) {
			this.aValidatedFilter = [];
		}
		if (this.aFiltersInTable) {
			this.aFiltersInTable = [];
		}
		sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype.destroy.call(this);
	};
}());
