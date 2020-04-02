/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
/* global jQuery, sap */
jQuery.sap.declare("sap.apf.ui.representations.treeTable");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.ui.utils.formatter");
jQuery.sap.require("sap.apf.modeler.ui.utils.constants");
jQuery.sap.require("sap.apf.ui.representations.BaseUI5ChartRepresentation");
jQuery.sap.require("sap.apf.ui.representations.utils.paginationDisplayOptionHandler");
jQuery.sap.require("sap.ui.table.TreeTable");
(function() {
	'use strict';
	function getFilterTextProperty(oTreeTableInstance){
		return oTreeTableInstance.metadata.getPropertyMetadata(oTreeTableInstance.requiredFilter).text;
	}
	function getFilterKeyDisplayProperty(oTreeTableInstance) {
		return oTreeTableInstance.oTreeTableControlObject.parameters.treeAnnotationProperties.hierarchyNodeExternalKeyFor;
	}
	function getSelectionMode(sRequiredFilter, metadata) {
		if (sRequiredFilter) {
			if (metadata.getPropertyMetadata(sRequiredFilter)["filter-restriction"] === "single-value") {
				return sap.ui.table.SelectionMode.Single;
			}
			return sap.ui.table.SelectionMode.MultiToggle;
		}
		return sap.ui.table.SelectionMode.None;
	}
	function _createTreeTableAndBindColumns(aTreeTableColumns, oStepTitle, oTreeTableInstance) {
		var oTreeTable;
		var formatCellValue = function(columnValueToBeFormatted) {
			return function(columnValue) {
				if (oTreeTableInstance.metadata !== undefined) {
					var formatedColumnValue;
					if (columnValue) {
						formatedColumnValue = oTreeTableInstance.oFormatter.getFormattedValue(columnValueToBeFormatted, columnValue);
						if (formatedColumnValue !== undefined) {
							return formatedColumnValue;
						}
					}
				}
				return columnValue;
			};
		};
		oTreeTable = new sap.ui.table.TreeTable({ // Creating tree table
			showNoData : false,
			title : oStepTitle,
			enableSelectAll : false,
			visibleRowCountMode : sap.ui.table.VisibleRowCountMode.Auto
		});
		oTreeTable.setLayoutData(new sap.m.FlexItemData({
			growFactor : 1
		}));
		oTreeTable.addStyleClass("sapUiSizeCompact");
		oTreeTable.setSelectionMode(getSelectionMode(oTreeTableInstance.requiredFilter, oTreeTableInstance.metadata));
		var aColumnForTreeTable = [], oColumnText, oTreeColumn;
		aTreeTableColumns.name.forEach(function(columnName, nColumnIndex) {
			oColumnText = new sap.m.Text().bindText(aTreeTableColumns.value[nColumnIndex], formatCellValue(aTreeTableColumns.value[nColumnIndex]), sap.ui.model.BindingMode.OneWay);
			oTreeColumn = new sap.ui.table.Column({
				label : new sap.m.Label({
					text : columnName
				}),
				template : oColumnText,
				tooltip : columnName
			});
			aColumnForTreeTable.push(oTreeColumn);
		});
		aColumnForTreeTable.forEach(function(column) { //Adding all columns to tree table.
			oTreeTable.addColumn(column);
		});
		oTreeTableInstance.oTreeTableModel.attachBatchRequestCompleted(function() { //Once the batch request is completed, busy indicator is set to false
			if (oTreeTableInstance.oApi.getUiApi().getLayoutView().getController() && oTreeTableInstance.oApi.getUiApi().getLayoutView().getController().byId("stepContainer")) {
				oTreeTableInstance.oApi.getUiApi().getLayoutView().getController().byId("stepContainer").getContent()[0].byId("idStepLayout").setBusy(false);
			}
			_alignMeasureColumn(oTreeTableInstance, oTreeTable, aTreeTableColumns);
			if (oTreeTableInstance.oRepresentationFilterHandler.getFilterValues().length > 0) {
				_markSelectionInTree(oTreeTableInstance);
			} else {
				oTreeTableInstance.oTreeTable.clearSelection();
			}
		});
		oTreeTableInstance.oTreeTableModel.attachBatchRequestSent(function(oEvent) {
			if (oTreeTableInstance.oApi.getUiApi().getLayoutView().getController() && oTreeTableInstance.oApi.getUiApi().getLayoutView().getController().byId("stepContainer")) {
				oTreeTableInstance.oApi.getUiApi().getLayoutView().getController().byId("stepContainer").getContent()[0].byId("idStepLayout").setBusy(true);
			}
		});
		oTreeTable.setModel(oTreeTableInstance.oTreeTableModel); // set model to tree table
		oTreeTable.bindRows(oTreeTableInstance.oTreeTableControlObject);
		return oTreeTable;
	}
	function _markSelectionInTree(oTreeTableInstance) {
		var aTreetableRows = oTreeTableInstance.oTreeTable.getRows();
		oTreeTableInstance.oTreeTable.clearSelection();
		setTimeout(function() {
			aTreetableRows.forEach(function(row, index) {
				var bindingContext = row.getBindingContext();
				if (bindingContext) {
					var sRequiredFilterAvailable = bindingContext.getProperty(oTreeTableInstance.requiredFilter);
					oTreeTableInstance.oRepresentationFilterHandler.getFilterValues().forEach(function(filter) {
						if (sRequiredFilterAvailable === filter) {
							oTreeTableInstance.oTreeTable.addSelectionInterval(index, index);
						}
					});
				}
			});
		}, 1);
	}
	function _alignMeasureColumn(oTreeTableInstance, oTreeTable, aTreeTableColumns) {
		if (oTreeTableInstance.metadata !== undefined) {
			for(var fieldIndex = 0; fieldIndex < aTreeTableColumns.name.length; fieldIndex++) {
				var oMetadata = oTreeTableInstance.metadata.getPropertyMetadata(aTreeTableColumns.value[fieldIndex]);
				if (oMetadata["aggregation-role"] === "measure") {
					var measureCol = oTreeTable.getColumns()[fieldIndex];
					measureCol.setHAlign(sap.ui.core.HorizontalAlign.End);
				}
			}
		}
	}
	function _updateFiltersInTreetable(oTreetableInstance, currentSelectedItemIndex) {
		var sCurrentModifiedFilter = oTreetableInstance.oTreeTable.getContextByIndex(currentSelectedItemIndex).getProperty(oTreetableInstance.requiredFilter);
		var sSelectionMode = oTreetableInstance.oTreeTable.getSelectionMode(oTreetableInstance.requiredFilter);
		var bIsSelected = oTreetableInstance.oTreeTable.isIndexSelected(currentSelectedItemIndex);
		var sDisplayTextForFilter = oTreetableInstance.oTreeTable.getContextByIndex(currentSelectedItemIndex).getProperty(getFilterTextProperty(oTreetableInstance));
		var sDisplayKeyForFilter = oTreetableInstance.oTreeTable.getContextByIndex(currentSelectedItemIndex).getProperty(getFilterKeyDisplayProperty(oTreetableInstance));
		oTreetableInstance.oPaginationDisplayOptionHandler.createDisplayValueLookupForPaginatedFilter(sCurrentModifiedFilter, sDisplayTextForFilter, sDisplayKeyForFilter);
		var aUI5ChartHelperFilterValues = oTreetableInstance.oRepresentationFilterHandler.getFilterValues();
		if (bIsSelected) {
			aUI5ChartHelperFilterValues = _updateFilterOnSelection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHelperFilterValues);
		} else {
			aUI5ChartHelperFilterValues = _updateFilterOnDeselection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHelperFilterValues);
		}
		_updateUI5Filters(oTreetableInstance, aUI5ChartHelperFilterValues);
	}
	function _clearFilters(oTreetableInstance) {
		oTreetableInstance.oRepresentationFilterHandler.clearFilters();
	}
	function _getUniqueFilters(aFilterValues) {
		return aFilterValues.filter(function(item, nIndex, array) {
			return array.indexOf(item) === nIndex;
		});
	}
	function _updateFilterOnSelection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHeleprFilterValues) {
		if (sSelectionMode === sap.ui.table.SelectionMode.Single) {
			aUI5ChartHeleprFilterValues = [ sCurrentModifiedFilter ];
		} else {
			aUI5ChartHeleprFilterValues.push(sCurrentModifiedFilter);
		}
		return _getUniqueFilters(aUI5ChartHeleprFilterValues);
	}
	function _updateFilterOnDeselection(oTreetableInstance, sSelectionMode, sCurrentModifiedFilter, aUI5ChartHeleprFilterValues) {
		if (sSelectionMode === sap.ui.table.SelectionMode.Single) {
			aUI5ChartHeleprFilterValues = [];
		} else {
			var indexOfDeselectedItem = aUI5ChartHeleprFilterValues.indexOf(sCurrentModifiedFilter);// if item is deselected, find the index of item and remove it from array
			if (indexOfDeselectedItem !== -1) {
				aUI5ChartHeleprFilterValues.splice(indexOfDeselectedItem, 1);
			}
		}
		return aUI5ChartHeleprFilterValues;
	}
	function _updateUI5Filters(oTreetableInstance, aUI5ChartHeleprFilterValues) {
		_clearFilters(oTreetableInstance);
		oTreetableInstance.oRepresentationFilterHandler.updateFilterFromSelection(aUI5ChartHeleprFilterValues);
		oTreetableInstance.oApi.selectionChanged();
	}
	/**
	* @description creates the column structure for the table which has the name and value. Also appends the unit of the column in the header of the table.
	* returns oColumnData - oColumnData has name and value of each column which has to be formed in the table.
	*                 e.g. oColumnData = {
	*                                      name : ["column1","column2"],
	*                                      value :["value1","value2"] 
	*                                     }
	*/
	function _getColumnFromProperties(oTreeTableInstance) {
		var oColumnData = {
			name : [],
			value : []
		};
		var aPropertiesForTreeTableColumns = oTreeTableInstance.oParameters.hierarchicalProperty.concat(oTreeTableInstance.oParameters.properties);
		aPropertiesForTreeTableColumns.forEach(function(property, index) {
			var fieldName = property.fieldName;
			var defaultLabel = oTreeTableInstance.metadata.getPropertyMetadata(fieldName).label || oTreeTableInstance.metadata.getPropertyMetadata(fieldName).name;// read the label of the property 
			if (property.kind === sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.HIERARCHIALCOLUMN) {
				if (property.labelDisplayOption === "text") {
					fieldName = oTreeTableInstance.metadata.getPropertyMetadata(oTreeTableInstance.oTreeTableControlObject.parameters.treeAnnotationProperties.hierarchyNodeFor).text;
				} else {
					fieldName = oTreeTableInstance.oTreeTableControlObject.parameters.treeAnnotationProperties.hierarchyNodeExternalKeyFor;
				}
			}
			oColumnData.name[index] = property.fieldDesc === undefined || !oTreeTableInstance.oApi.getTextNotHtmlEncoded(property.fieldDesc).length ? defaultLabel : oTreeTableInstance.oApi.getTextNotHtmlEncoded(property.fieldDesc);
			oColumnData.value[index] = fieldName;
		});
		return oColumnData;
	}
	/**
	* @class treeTable constructor.
	* @param oApi,oParameters
	* defines parameters required for chart such as Dimension/Measures.
	* @returns treeTable object
	*/
	sap.apf.ui.representations.treeTable = function(oApi, oParameters) {
		var that = this;
		that.oParameters = oParameters;
		that.requiredFilter = that.oParameters.requiredFilters[0];
		that.oKeyTextLookup = {};
		that.type = sap.apf.ui.utils.CONSTANTS.representationTypes.TREE_TABLE_REPRESENTATION;
		sap.apf.ui.representations.BaseUI5ChartRepresentation.apply(that, [oApi, oParameters]);
		that.oPaginationDisplayOptionHandler = new sap.apf.ui.representations.utils.PaginationDisplayOptionHandler();
		that._selectRowInTreeTable = function(oEvent) { //mark the selection in tree table and update the filter values
			var isUserInteraction = oEvent.getParameter("userInteraction");
			var currentSelectedItemIndex = oEvent.getParameter("rowIndex"); // store the current selected item for which selection event is triggered
			if (!isUserInteraction || currentSelectedItemIndex === undefined || currentSelectedItemIndex === null) {
				return;
			}
			_updateFiltersInTreetable(that, currentSelectedItemIndex);
		};
		that.handleRowSelectionInTreeTable = function(oEvent) { // wrap so that we still can spy on the function
			that._selectRowInTreeTable(oEvent);
		};
	};
	sap.apf.ui.representations.treeTable.prototype = Object.create(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype);
	sap.apf.ui.representations.treeTable.prototype.constructor = sap.apf.ui.representations.treeTable; // Set the constructor property to refer to tree table
	/**
	* @method getMainContent
	* @param oStepTitle - title of the main chart 
	* @description draws Main chart into the Chart area
	*/
	sap.apf.ui.representations.treeTable.prototype.getMainContent = function(oStepTitle) {
		if (!this.oTreeTable) {
			var aTreeTableColumns = _getColumnFromProperties(this);
			this.oTreeTable = _createTreeTableAndBindColumns(aTreeTableColumns, oStepTitle, this);
			this.oTreeTable.attachRowSelectionChange(this.handleRowSelectionInTreeTable.bind(this));
		}
		return new sap.m.VBox({
			fitContainer : true,
			items : [ this.oTreeTable ]
		});
	};
	sap.apf.ui.representations.treeTable.prototype.getSelections = function() {
		var oSelectionItem = [], oTreeTableInstance = this, sSelectionText;
		this.oRepresentationFilterHandler.getFilterValues().forEach(function(selection) {
				sSelectionText = oTreeTableInstance.oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter(selection, oTreeTableInstance.parameter.requiredFilterOptions, oTreeTableInstance.requiredFilter,
					oTreeTableInstance.oFormatter, oTreeTableInstance.metadata);
				oSelectionItem.push({
					id : selection,
					text : sSelectionText
				});
			});
		return oSelectionItem;
	};
	/**
	* @method removeAllSelection
	* @description removes all Selection from tree table
	*/
	sap.apf.ui.representations.treeTable.prototype.removeAllSelection = function() {
		this.oRepresentationFilterHandler.clearFilters();
		this.oTreeTable.clearSelection();
		this.oApi.selectionChanged();
	};
	/**
	* @method getFilter
	* @description Returns the filter from the selection
	* @returns {sap.apf.utils.Filter} Filter
	*/
	sap.apf.ui.representations.treeTable.prototype.getFilter = function() {
		var filter = this.oApi.createFilter();
		var oAddedOrCondition = filter.getTopAnd().addOr('exprssionOr');
		this.oRepresentationFilterHandler.getFilterValues().forEach(function(filterValue) {
			var oFilterExpression = {
				id : filterValue,
				name : this.requiredFilter,
				operator : "EQ",
				value : filterValue
			};
			oAddedOrCondition.addExpression(oFilterExpression);
		}.bind(this));
		return filter;
	};
	/**
	* @method setFilterValues
	* @description Sets Filter values from the selection validation request
	* @param {String []} aValues - FilterValues
	*/
	sap.apf.ui.representations.treeTable.prototype.setFilterValues = function(aValues) {
		var oTreetableInstance = this, aFilterValues = [];
		var sRequiredFilter = oTreetableInstance.requiredFilter;
		oTreetableInstance.oRepresentationFilterHandler.clearFilters();
		aValues.forEach(function(value) {
			var filterValue = value[sRequiredFilter];
			var textValue = value[getFilterTextProperty(oTreetableInstance)];
			var keyDisplayValue = value[getFilterKeyDisplayProperty(oTreetableInstance)];
			oTreetableInstance.oPaginationDisplayOptionHandler.createDisplayValueLookupForPaginatedFilter(filterValue, textValue, keyDisplayValue);
			aFilterValues.push(filterValue);
		});
		oTreetableInstance.oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
	};
	/**
	* @method updateTreetable
	* @param controlObject - object for the tree table 
	* @param oModel - model for tree table
	* @param _bindTreeFunction - call back function to bind the properties of tree table
	* @param oMetaData -  metadata for tree table
	* @description updates the current tree table with updated control properties and model
	*/
	sap.apf.ui.representations.treeTable.prototype.updateTreetable = function(controlObject, oModel, oMetadata, bFilterChanged) {
		this.oTreeTableModel = oModel;
		this.oTreeTableControlObject = controlObject;
		this.metadata = oMetadata;
		this.oFormatter = new sap.apf.ui.utils.formatter({ // formatter for the value formatting
			getEventCallback : this.oApi.getEventCallback.bind(this.oApi),
			getTextNotHtmlEncoded : this.oApi.getTextNotHtmlEncoded,
			getExits : this.oApi.getExits()
		}, this.metadata);
		if (this.oTreeTable && bFilterChanged) {
			this.oTreeTable.bindRows(this.oTreeTableControlObject);
		}
	};
	/**
	* @method getPrintContent
	* @param oStepTitle - title of the step
	* @description gets the printable content of the representation
	*/
	sap.apf.ui.representations.treeTable.prototype.getPrintContent = function(oStepTitle) {
		var oTreeTableForPrint = this.oTreeTable.clone();
		var oPrintObject = {
			oRepresentation : oTreeTableForPrint
		};
		return oPrintObject;
	};
	sap.apf.ui.representations.treeTable.prototype.getSelectedFilterPropertyLabel = function(sRequiredFilter) {
		return this.metadata.getPropertyMetadata(sRequiredFilter)["hierarchy-node-for"];
	};
	/**
	* @method destroy
	* @description Destroying instance level variables
	*/
	sap.apf.ui.representations.treeTable.prototype.destroy = function() {
		if (this.oParameters) {
			this.oParameters = null;
		}
		if (this.oTreeTableModel) {
			this.oTreeTableModel = null;
		}
		if (this.oTreeTableControlObject) {
			this.oTreeTableControlObject = null;
		}
		if (this.oTreeTable){
			this.oTreeTable.destroy();
		}
		if (this.metadata) {
			this.metadata = null;
		}
		if (this.oRepresentationFilterHandler) {
			this.oRepresentationFilterHandler = null;
		}
		sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype.destroy.call(this);
	};
}());
