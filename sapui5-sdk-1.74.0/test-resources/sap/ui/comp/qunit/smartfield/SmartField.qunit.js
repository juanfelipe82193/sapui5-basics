/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/core/library",
	"sap/ui/comp/library",
	"sap/ui/core/Control",
	"sap/m/DateTimePicker",
	"sap/m/Input",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/Select",
	"sap/ui/core/Wrapping",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/JSONControlFactory",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/comp/smartfield/type/DateTimeOffset",
	"sap/ui/comp/smartfield/type/String",
	"sap/ui/comp/smartfield/type/TextArrangementString",
	"sap/ui/comp/smartfield/ControlContextType",
	"sap/ui/comp/smartfield/Configuration",
	"test-resources/sap/ui/comp/qunit/smartfield/data/TestModel.data"

], 	function(
	coreLibrary,
	compLibrary,
	Control,
	DateTimePicker,
	Input,
	Text,
	TextArea,
	Select,
	Wrapping,
	ODataModel,
	ODataMetaModel,
	JSONModel,
	ParseException,
	ValidateException,
	SmartField,
	JSONControlFactory,
	ODataControlFactory,
	DateTimeOffset,
	StringType,
	TextArrangementString,
	ControlContextType,
	Configuration,
	TestModelDataSet

) {
	"use strict";

	var ValueState = coreLibrary.ValueState;
	var ControlType = compLibrary.smartfield.ControlType;
	var DisplayBehaviour = compLibrary.smartfield.DisplayBehaviour;

	var fnPatchSetContentAggregation = function(oControl, fnHandler) {
		oControl.__origSetAggregation = oControl.__origSetAggregation || oControl.setAggregation;
		oControl.setAggregation = function(sAggregation) {
			if (sAggregation === "_content") {
				return fnHandler.call(this);
			} else {
				return this.__origSetAggregation.apply(this, arguments);
			}
		};
	};

	var fnPatchGetContentAggregation = function(oControl, fnHandler) {
		oControl.__origGetAggregation = oControl.__origGetAggregation || oControl.getAggregation;
		oControl.getAggregation = function(sAggregation) {
			if (sAggregation === "_content") {
				return fnHandler.call(this);
			} else {
				return this.__origGetAggregation.apply(this, arguments);
			}
		};
	};

	var oTestEntitySet = {
		"name": "Project",
		"entityType": "ZMEY_SRV.Project_Type",
		"extensions": [{
			"name": "pageable",
			"value": "false",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		},
			{
				"name": "addressable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "content-version",
				"value": "1",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable-path",
				"value": "Properties/EntityUpdatable",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
		"sap:pageable": "false",
		"Org.OData.Capabilities.V1.SkipSupported": {
			"Bool": "false"
		},
		"Org.OData.Capabilities.V1.TopSupported": {
			"Bool": "false"
		},
		"sap:addressable": "false",
		"sap:content-version": "1",
		"sap:updatable-path": "Properties/EntityUpdatable",
		"Org.OData.Capabilities.V1.UpdateRestrictions": {
			"Updatable": {
				"Path": "Properties/EntityUpdatable"
			}
		},
		"Org.OData.Capabilities.V1.SearchRestrictions": {
			"Searchable": {
				"Bool": "false"
			}
		},
		"Org.OData.Capabilities.V1.FilterRestrictions": {
			"NonFilterableProperties": [{
				"PropertyPath": "ID"
			},
				{
					"PropertyPath": "Name"
				},
				{
					"PropertyPath": "Description"
				},
				{
					"PropertyPath": "StartDate"
				},
				{
					"PropertyPath": "StartTime"
				},
				{
					"PropertyPath": "StartDateTime"
				},
				{
					"PropertyPath": "Amount"
				},
				{
					"PropertyPath": "AmountCurrency"
				},
				{
					"PropertyPath": "Quantity"
				},
				{
					"PropertyPath": "QuantityUnit"
				},
				{
					"PropertyPath": "Description_Required"
				},
				{
					"PropertyPath": "Description_ReadOnly"
				},
				{
					"PropertyPath": "Description_Hidden"
				},
				{
					"PropertyPath": "Description_FC"
				},
				{
					"PropertyPath": "StartDate_Required"
				},
				{
					"PropertyPath": "StartDate_ReadOnly"
				},
				{
					"PropertyPath": "StartDate_Hidden"
				},
				{
					"PropertyPath": "StartDate_FC"
				},
				{
					"PropertyPath": "EntityUpdatable_FC"
				},
				{
					"PropertyPath": "Released"
				},
				{
					"PropertyPath": "ReleaseActionEnabled_FC"
				},
				{
					"PropertyPath": "BigInteger"
				}]
		},
		"Org.OData.Capabilities.V1.SortRestrictions": {
			"NonSortableProperties": [{
				"PropertyPath": "ID"
			},
				{
					"PropertyPath": "Name"
				},
				{
					"PropertyPath": "Description"
				},
				{
					"PropertyPath": "StartDate"
				},
				{
					"PropertyPath": "StartTime"
				},
				{
					"PropertyPath": "StartDateTime"
				},
				{
					"PropertyPath": "Amount"
				},
				{
					"PropertyPath": "AmountCurrency"
				},
				{
					"PropertyPath": "Quantity"
				},
				{
					"PropertyPath": "QuantityUnit"
				},
				{
					"PropertyPath": "Description_Required"
				},
				{
					"PropertyPath": "Description_ReadOnly"
				},
				{
					"PropertyPath": "Description_Hidden"
				},
				{
					"PropertyPath": "Description_FC"
				},
				{
					"PropertyPath": "StartDate_Required"
				},
				{
					"PropertyPath": "StartDate_ReadOnly"
				},
				{
					"PropertyPath": "StartDate_Hidden"
				},
				{
					"PropertyPath": "StartDate_FC"
				},
				{
					"PropertyPath": "EntityUpdatable_FC"
				},
				{
					"PropertyPath": "Released"
				},
				{
					"PropertyPath": "ReleaseActionEnabled_FC"
				},
				{
					"PropertyPath": "BigInteger"
				}]
		}
	};

	var oTestEntityType = {
		"name": "Project_Type",
		"key": {
			"propertyRef": [{
				"name": "ID"
			}]
		},
		"property": [{
			"name": "ID",
			"type": "Edm.Int32",
			"nullable": "false",
			"extensions": [{
				"name": "creatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "updatable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:creatable": "false",
			"sap:updatable": "false",
			"sap:sortable": "false",
			"sap:filterable": "false",
			"Org.OData.Core.V1.Computed": {
				"Bool": "true"
			}
		},
		{
			"name": "Name",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "24",
			"extensions": [{
				"name": "field-control",
				"value": "Properties/Name_FC",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Name",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:field-control": "Properties/Name_FC",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "Properties/Name_FC"
			},
			"sap:label": "Name",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Name"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
		{
			"name": "Description",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "80",
			"extensions": [{
				"name": "field-control",
				"value": "Description_FC",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "label",
				"value": "Description",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "filterable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:field-control": "Description_FC",
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"Path": "Description_FC"
			},
			"sap:label": "Description",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Description"
			},
			"sap:sortable": "false",
			"sap:filterable": "false"
		},
			{
				"name": "StartDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"extensions": [{
					"name": "display-format",
					"value": "Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "field-control",
					"value": "StartDate_FC",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Start Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:display-format": "Date",
				"sap:field-control": "StartDate_FC",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"Path": "StartDate_FC"
				},
				"sap:label": "Start Date",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Date"
				},
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartTime",
				"type": "Edm.Time",
				"precision": "0",
				"extensions": [{
					"name": "label",
					"value": "Start Time",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Start Time",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Time"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"Path": "StartDate_FC"
				}
			},
			{
				"name": "StartDateTime",
				"type": "Edm.DateTimeOffset",
				"precision": "0",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "The UTC timestamp is the date and time relative to the UTC (Universal coordinated time).",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": "To normalize local times in a UTC time stamp and make them comparable, they must be converted using their time zone and the ABAP command convert.\nAlthough the time zone for the conversion can be fetched from customizing or master data, you should save it redundantly.\nThe internal structure of the UTC time stamp is logically divided into a date and time part in packed number format <YYYYMMDDhhmmss>. There is also a high resolution UTC time stamp (10^-7 seconds).",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "label",
					"value": "Start Date and Time",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Time Stamp",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Start Date and Time",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Date and Time"
				},
				"sap:heading": "Time Stamp",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Time Stamp"
				},
				"sap:quickinfo": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "UTC Time Stamp in Short Form (YYYYMMDDhhmmss)"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"If": [{
						"Path": "Released"
					},
					{
						"Int": "1"
					},
					{
						"Int": "3"
					}]
				}
			},
			{
				"name": "StartDateStr",
				"type": "Edm.String",
				"precision": "0",
				"extensions": [{
					"name": "semantics",
					"value": "yearmonthday",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Start Date (via Semantics)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:semantics": "yearmonthday",
				"sap:label": "Start Date",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Start Date"
				},
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Amount",
				"type": "Edm.Decimal",
				"nullable": "false",
				"precision": "11",
				"scale": "2",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Price for external processing.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": null,
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "unit",
					"value": "AmountCurrency",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "label",
						"value": "Price",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:unit": "AmountCurrency",
				"sap:label": "Price",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Price"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "AmountCurrency"
				}
			},
			{
				"name": "AmountCurrency",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "5",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Currency key for amounts in the system.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": null,
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "label",
					"value": "Currency",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "heading",
						"value": "Crcy",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Currency Key",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "semantics",
						"value": "currency-code",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:label": "Currency",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Currency"
				},
				"sap:heading": "Crcy",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Crcy"
				},
				"sap:quickinfo": "Currency Key",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Currency Key"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"sap:semantics": "currency-code"
			},
			{
				"name": "Quantity",
				"type": "Edm.Decimal",
				"nullable": "false",
				"precision": "13",
				"scale": "3",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Total quantity (including scrap) to be produced in this order.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": null,
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "unit",
					"value": "QuantityUnit",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "label",
						"value": "Quantity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "heading",
						"value": "Total order quantity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "quickinfo",
						"value": "Total order quantity",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "sortable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:unit": "QuantityUnit",
				"sap:label": "Quantity",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Quantity"
				},
				"sap:heading": "Total order quantity",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Total order quantity"
				},
				"sap:quickinfo": "Total order quantity",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Total order quantity"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Measures.V1.Unit": {
					"Path": "QuantityUnit"
				}
			},
			{
				"name": "QuantityUnit",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "3",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Unit of measure in which stocks of the material are managed. The system converts all the quantities you enter in other units of measure (alternative units of measure) to the base unit of measure.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					},
					{
						"name": "LongDescription",
						"value": "You define the base unit of measure and also alternative units of measure and their conversion factors in the material master record.\nSince all data is updated in the base unit of measure, your entry is particularly important for the conversion of alternative units of measure. A quantity in the alternative unit of measure can only be shown precisely if its value can be shown with the decimal places available. To ensure this, please note the following:\nThe base unit of measure is the unit satisfying the highest necessary requirement for precision.\nThe conversion of alternative units of measure to the base unit should result in simple decimal fractions (not, for example, 1/3 = 0.333...).\nInventory Management\nIn Inventory Management, the base unit of measure is the same as the stockkeeping unit.\nServices\nServices have units of measure of their own, including the following:\nService unit\nUnit of measure at the higher item level. The precise quantities of the individual services are each at the detailed service line level.\nBlanket\nUnit of measure at service line level for services to be provided once only, and for which no precise quantities can or are to be specified.",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}],
				"extensions": [{
					"name": "label",
					"value": "Unit",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "BUn",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Base Unit of Measure",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "semantics",
					"value": "unit-of-measure",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Unit",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Unit"
				},
				"sap:heading": "BUn",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "BUn"
				},
				"sap:quickinfo": "Base Unit of Measure",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Base Unit of Measure"
				},
				"sap:sortable": "false",
				"sap:filterable": "false",
				"sap:semantics": "unit-of-measure"
			},
			{
				"name": "Description_Required",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
					{
						"name": "filterable",
						"value": "false",
						"namespace": "http://www.sap.com/Protocols/SAPData"
					}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Description_ReadOnly",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Description_Hidden",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "Description_FC",
				"type": "Edm.Byte",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "StartDate_Required",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartDate_ReadOnly",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartDate_Hidden",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:sortable": "false",
				"sap:filterable": "false"
			},
			{
				"name": "StartDate_FC",
				"type": "Edm.Byte",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "EntityUpdatable_FC",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "Released",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "ReleaseActionEnabled_FC",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "BigInteger",
				"type": "Edm.Int64",
				"nullable": "false",
				"extensions": [{
					"name": "label",
					"value": "Big Integer",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Big Integer",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Big Integer"
				},
				"sap:sortable": "false",
				"sap:filterable": "false"
			}],
		"navigationProperty": [{
			"name": "Properties",
			"relationship": "ZMEY_SRV.ProjectProperties",
			"fromRole": "FromRole_ProjectProperties",
			"toRole": "ToRole_ProjectProperties"
		},
		{
			"name": "Tasks",
			"relationship": "ZMEY_SRV.ProjectTask",
			"fromRole": "FromRole_ProjectTask",
			"toRole": "ToRole_ProjectTask"
		}],
		"extensions": [{
			"name": "content-version",
			"value": "1",
			"namespace": "http://www.sap.com/Protocols/SAPData"
		}],
		"sap:content-version": "1",
		"namespace": "ZMEY_SRV",
		"$path": "/dataServices/schema/0/entityType/0"
	};

	var oTestProperty = {
		"property": {
			"name": "Name",
			"type": "Edm.String",
			"nullable": "false",
			"maxLength": "24",
			"extensions": [
				{
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Document Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Accounting Document Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}
			]
		},
		"extensions": {
			"sap:label": {
				"name": "label",
				"value": "Document Number",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			"sap:quickinfo": {
				"name": "filterable",
				"value": "Accounting Document Number",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			"sap:sortable": {
				"name": "sortable",
				"value": "false",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}
		},
		"typePath": "Name"
	};

	QUnit.module("sap.ui.comp.smartfield.SmartField", {
		beforeEach: function() {
			function findIndex(aArray, vExpectedPropertyValue, sPropertyName) {
				var iIndex = -1;

				sPropertyName = sPropertyName || "name";
				jQuery.each(aArray || [], function (i, oObject) {
					if (oObject[sPropertyName] === vExpectedPropertyValue) {
						iIndex = i;
						return false; // break
					}
				});

				return iIndex;
			}

			function getObject1(oModel, sArrayName, sQualifiedName, bAsPath) {
				var vResult = bAsPath ? undefined : null,
					iSeparatorPos,
					sNamespace,
					sName;

				sQualifiedName = sQualifiedName || "";
				iSeparatorPos = sQualifiedName.lastIndexOf(".");
				sNamespace = sQualifiedName.slice(0, iSeparatorPos);
				sName = sQualifiedName.slice(iSeparatorPos + 1);
				jQuery.each(oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
					if (oSchema.namespace === sNamespace) {
						jQuery.each(oSchema[sArrayName] || [], function (j, oThing) {
							if (oThing.name === sName) {
								vResult = bAsPath ? oThing.$path : oThing;
								return false; // break
							}
						});
						return false; // break
					}
				});

				return vResult;
			}

			this.oSmartField = new SmartField();
			this.oSmartField.getModel = function(sName) {
				var oModel;

				if (!sName) {
					oModel = sinon.createStubInstance(ODataModel);
					oModel.getServiceMetadata = function() {
						return TestModelDataSet.TestModel;
					};
					oModel.getMetaModel = function() {
						var oStub = sinon.createStubInstance(ODataMetaModel);
						oStub.oModel = new JSONModel(TestModelDataSet.TestModel);
						oStub.oData = TestModelDataSet.TestModel;
						oStub.getObject = function(sPath) {
							var oNode, aParts = sPath.split("/"), iIndex = 0;
							if (!aParts[0]) {
								// absolute path starting with slash
								oNode = this.oData;
								iIndex++;
							}
							while (oNode && aParts[iIndex]) {
								oNode = oNode[aParts[iIndex]];
								iIndex++;
							}
							return oNode;
						};
						oStub.getODataEntityContainer = function(bAsPath) {
							var vResult = bAsPath ? undefined : null;

							jQuery.each(this.oModel.getObject("/dataServices/schema") || [], function (i, oSchema) {
								var j = findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

								if (j >= 0) {
									vResult = bAsPath
										? "/dataServices/schema/" + i + "/entityContainer/" + j
										: oSchema.entityContainer[j];
									return false; //break
								}
							});

							return vResult;
						};
						oStub.getODataEntitySet = function(sName, bAsPath) {
							var k,
							oEntityContainer = this.getODataEntityContainer(),
							vResult = bAsPath ? undefined : null;

							if (oEntityContainer) {
								k = findIndex(oEntityContainer.entitySet, sName);
								if (k >= 0) {
									vResult = bAsPath
										? oEntityContainer.$path + "/entitySet/" + k
										: oEntityContainer.entitySet[k];
								}
							}

							return vResult;
						};
						oStub.getODataEntityType = function (sQualifiedName, bAsPath) {
							return getObject1(this.oModel, "entityType", sQualifiedName, bAsPath);
						};
						oStub.getODataProperty = function (oType, vName, bAsPath) {
							var i,
							aParts = jQuery.isArray(vName) ? vName : [vName],
							oProperty = null,
							sPropertyPath;

							while (oType && aParts.length) {
								i = findIndex(oType.property, aParts[0]);
								if (i < 0) {
									break;
								}

								aParts.shift();
								oProperty = oType.property[i];
								sPropertyPath = oType.$path + "/property/" + i;

								if (aParts.length) {
									// go to complex type in order to allow drill-down
									oType = this.getODataComplexType(oProperty.type);
								}
							}

							return bAsPath ? sPropertyPath : oProperty;
						};
						oStub.getODataComplexType = function (sQualifiedName, bAsPath) {
							return getObject1(this.oModel, "complexType", sQualifiedName, bAsPath);
						};
						oStub.loaded = function() {
							return Promise.resolve();
						};
						return oStub;
					};
					oModel.bindContext = function() {
						return {
							attachChange : function() {

							},
							attachEvents : function() {

							},
							initialize : function() {

							},
							getContext : function() {
								return null;
							}
						};
					};
					oModel.bindProperty = function() {
						return {
							setType : function() {

							},
							setFormatter : function() {

							},
							setBindingMode : function() {

							},
							attachChange : function() {

							},
							attachEvents : function() {

							},
							initialize : function() {

							},
							updateRequired : function() {
								return false;
							},
							detachChange : function() {

							},
							detachEvents : function() {

							},
							setContext : function() {

							}
						};
					};

					oModel.oMetadata = {
						bLoaded : true
					};
				}

				return oModel;
			};
			this.oSmartField.getBindingContext = function() {
				return {
					sPath : "/Project(71)",
					getPath: function() {
						return "/Project(71)";
					},
					getObject: function() {
						return {};
					}
				};
			};
			this.oSmartField.mBindingInfos["value"] = {
				parts : [ {
					model : undefined,
					path : "ID"
				}]
			};
		},
		afterEach: function() {

		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oSmartField);
		assert.ok(!this.oSmartField.isContextTable());
	});

	QUnit.test("onAfterRendering", function(assert) {
		var sID;
		this.oSmartField._oFactory = {
			getMetaData: function() {
				return {
					property: {
						property: {}
					}
				};
			}
		};
		this.oSmartField._getView = function() {
			return {};
		};
		this.oSmartField.getInnerControls = function() {
			var oID = {
				setFieldGroupIds: function(aIDs) {
					sID = aIDs[0];
				}
			};

			return [ oID ];
		};
		this.oSmartField._oSideEffects.getFieldGroupIDs = function() {
			return [ "dummyID" ];
		};

		this.oSmartField.onAfterRendering();
		assert.equal(sID, "dummyID");
	});

	QUnit.test("updateBindingContext - no params", function(assert) {
		var done = assert.async(),
				bBind = false;

		this.oSmartField.bindProperty = function() {
			bBind = true;
		};

		this.oSmartField.updateBindingContext();

		// creates a new job to be executed after the meta model promise is resolved
		setTimeout(function() {
			assert.equal(bBind, true);
			done();
		}, 0);
	});

	QUnit.test("updateBindingContext - bSkipLocal set and model name", function(assert) {
		this.oSmartField.updateBindingContext(true, false, "model");
		assert.ok(this.oSmartField);
	});

	QUnit.test("_init", function(assert) {
		this.oSmartField._init();
		assert.ok(this.oSmartField);
	});

	QUnit.test("updateBindingContext - changed entity set", function(assert) {
		this.spy(this.oSmartField, "_createFactory");
		this.oSmartField.updateBindingContext();
		assert.ok(this.oSmartField._createFactory.calledOnce, "Factory created");

		this.oSmartField.getBindingContext = function() {
			return {
				sPath : "/Customer(2)",
				getPath: function() {
					return "/Customer(2)";
				}
			};
		};

		this.oSmartField.updateBindingContext();
		assert.ok(this.oSmartField._createFactory.calledTwice, "Factory recreated");
	});

	QUnit.test("_init with unbound value", function(assert) {
		this.stub(this.oSmartField, "getBindingPath").returns(null);
		this.spy(this.oSmartField, "_createFactory");
		this.oSmartField._init();
		assert.ok(this.oSmartField);
		assert.ok(!this.oSmartField._createFactory.called);

		this.oSmartField.setUrl("some.url");
		this.oSmartField._init();
		assert.ok(this.oSmartField._createFactory.called);
	});

	QUnit.test("Smartfield test getComputedTextLabel method", function(assert) {

		// Arrange
		var oSmartField = this.oSmartField,
			sCustomTextLabel = "Custom Text Label",
			sTextLabel = "Annotation text label";

		// Act
		oSmartField._sAnnotationLabel = sTextLabel;

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sTextLabel, "text label is same as from metadata");

		// Act
		oSmartField.setTextLabel(sCustomTextLabel);

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sCustomTextLabel, "text label set manually takes preference over " +
			"the one coming from metadata");
	});

	QUnit.test("Smartfield with textLabel set in xml view", function(assert) {

		// Arrange
		var oSmartField = this.oSmartField,
			sCustomTextLabel = "Custom Text Label";

		// Act
		oSmartField.setTextLabel(sCustomTextLabel);

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sCustomTextLabel, "has custom text label");

		// Act
		oSmartField._sAnnotationLabel = "Annotation text label";

		// Assert
		assert.equal(oSmartField.getComputedTextLabel(), sCustomTextLabel, "text label set manually is not overridden by metadata");
	});

	QUnit.test("_createFactory for JSON model", function(assert) {
		var oModel, oInfo, oFactory;

		oModel = sinon.createStubInstance(JSONModel);
		oInfo = {
			parts : [ {
				model : "modelname",
				path : "value"
			}],
			model : "modelname"
		};

		oFactory = this.oSmartField._createFactory(null, oModel, oInfo);
		assert.equal(oFactory instanceof JSONControlFactory, true);

		oFactory.destroy();
	});

	QUnit.test("_createFactory for OData model - without configuration", function(assert) {
		var oModel = this.oSmartField.getModel();
		var sBindingPath = this.oSmartField.getBindingPath("value");
		var oFactory = this.oSmartField._createFactory(null, oModel, sBindingPath);
		assert.equal(oFactory instanceof ODataControlFactory, true);
		oFactory.destroy();
	});

	QUnit.test("_createFactory for OData model - with configuration", function(assert) {
		var oModel = this.oSmartField.getModel();
		var sBindingPath = this.oSmartField.getBindingPath("value");
		var oFactory = this.oSmartField._createFactory(null, oModel, sBindingPath, {
			configdata: {
				model: undefined,
				path: "Description",
				entitySet: "Project"
			}
		});
		assert.equal(oFactory instanceof ODataControlFactory, true);

		oFactory.destroy();
	});

	QUnit.test("_createFactory no params", function(assert) {
		var oModel, oInfo, oFactory;

		this.oSmartField.getBindingContext = function() {
			return null;
		};
		oFactory = this.oSmartField._createFactory(null, oModel, oInfo);
		assert.equal(!oFactory, true);
	});

	QUnit.test("updateBindingContext for JSON model", function(assert) {
		var oModel, oFactory;

		oModel = sinon.createStubInstance(JSONModel);
		oFactory = new JSONControlFactory(oModel, this.oSmartField, { model : null, path : "value" });

		this.oSmartField._oFactory = oFactory;
		assert.equal(!this.oSmartField._oControl.current, true);

		this.oSmartField.updateBindingContext();
		assert.equal(this.oSmartField._oControl.current, "edit");

		oFactory.destroy();
	});

	QUnit.test("updateBindingContext - only model name", function(assert) {
		this.oSmartField.updateBindingContext(false, false, "model");
		assert.ok(this.oSmartField);
	});

	QUnit.test("setVisible", function(assert) {
		var oReturn;

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				setProperty : function(sName, oValue) {
					assert.equal(sName, "visible");
					assert.equal(oValue, true);
				}
			};
		});

		oReturn = this.oSmartField.setVisible(true);
		assert.equal(this.oSmartField.getProperty("visible"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("setValue", function(assert) {
		var oReturn = this.oSmartField.setValue(true);
		assert.equal(this.oSmartField.getProperty("value"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("getValue with callback set", function(assert) {
		this.oSmartField._oValue["edit"] = function() {
			return "theValue";
		};
		this.oSmartField.setValue(true);
		assert.equal(this.oSmartField.getValue(), "theValue");

	});

	QUnit.test("getValue without callback set", function(assert) {
		this.oSmartField.setValue(true);
		assert.equal(this.oSmartField.getValue(), true);

	});

	QUnit.test("setEntitySet", function(assert) {
		var oReturn, fFound = function(oParam) {
			assert.equal(oParam.mParameters.entitySet, "Project");
		};
		this.oSmartField.attachEntitySetFound(fFound);
		oReturn = this.oSmartField.setEntitySet("Project");
		assert.equal(this.oSmartField.getProperty("entitySet"), "Project");
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("_getMode shall return display_uom", function(assert) {
		var sMode;

		this.oSmartField.data = function() {
			return null;
		};
		this.stub(this.oSmartField, "getProperty").withArgs("uomEditState").returns(0);
		this.oSmartField.getControlContext = function() {
			return "responsiveTable";
		};

		sMode = this.oSmartField.getMode();
		assert.equal(sMode, "display_uom");
	});

	QUnit.test("_toggleInnerControlIfRequired - smart field not initialized", function(assert) {
		this.oSmartField._toggleInnerControlIfRequired();
		assert.equal(!this.oSmartField._oControl["edit"], true);
	});

	QUnit.test("_toggleInnerControlIfRequired with creation and setting of edit control", function(assert) {
		var iContent = 0, oControl, sUOM = "the unit of measure", fCheck1, fCheck2;

		fCheck1 = function() {};
		fCheck2 = function() {};
		oControl = {
			control : {	},
			params : {
				getValue: function() {
					return "theValue";
				},
				uom: function() {
					return sUOM;
				},
				uomset: function(sValue) {
					sUOM = sValue;
				},
				checks: [ fCheck1, fCheck2 ]
			}
		};

		this.oSmartField._oFactory = {
			createControl : function() {
				return oControl;
			}
		};
		fnPatchSetContentAggregation(this.oSmartField, function() {
			iContent++;
		});

		this.oSmartField._toggleInnerControlIfRequired();
		assert.equal(this.oSmartField._oControl["edit"], oControl.control);
		assert.equal(this.oSmartField._oControl.current, "edit");
		assert.equal(this.oSmartField._oValue["edit"](), "theValue");
		assert.equal(this.oSmartField._oValue.uom(), "the unit of measure");

		// now set the uom.
		this.oSmartField._oValue.uomset("the new unit of measure");
		assert.equal(this.oSmartField._oValue.uom(), "the new unit of measure");
	});

	QUnit.test("_getEntitySet", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return {
				getPath: function() {
					return "/Project(id1='71' id2='abcd')";
				}
			};
		};
		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "Project");
	});

	QUnit.test("_getEntitySet with entityset", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return {
				sPath : "/Project(id1='71' id2='abcd')"
			};
		};
		this.oSmartField.setEntitySet("dummy");
		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "dummy");
	});

	QUnit.test("_getEntitySet with nothing specified", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return {
				getPath: function() {
					return "";
				}
			};
		};

		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "");
	});

	QUnit.test("_getEntitySet with nothing specified", function(assert) {
		var sSet;

		this.oSmartField.getBindingContext = function() {
			return null;
		};

		sSet = this.oSmartField._getEntitySet();
		assert.equal(sSet, "");
	});

	QUnit.test("getDataType for JSON model", function(assert) {
		this.oSmartField._oFactory = null;
		assert.equal(this.oSmartField.getDataType(), null);
	});

	QUnit.test("getDataType for JSON model", function(assert) {
		this.oSmartField._oFactory = {
			getDataProperty: function() {
				return {
					property : {
						type: "Edm.String"
					}
				};
			}
		};

		assert.equal(this.oSmartField.getDataType(), "Edm.String");
	});

	QUnit.test("getDataType from Property", function(assert) {
		this.oSmartField._oFactory = {};
		this.oSmartField.getJsonType = function() {
			return "JSON.String";
		};

		assert.equal(this.oSmartField.getDataType(), "JSON.String");
	});

	QUnit.test("getDataType no model set", function(assert) {
		this.oSmartField._oFactory = null;
		assert.equal(this.oSmartField.getDataType(), null);
	});

	QUnit.test("getDataProperty getDataProperty not implemented on factory", function(assert) {
		this.oSmartField._oFactory = {
			getDataProperty: function() {
				return {
					"id": "id"
				};
			}
		};

		assert.equal(this.oSmartField.getDataProperty().id, "id");
	});

	QUnit.test("getDataProperty getDataProperty not implemented on factory", function(assert) {
		this.oSmartField._oFactory = {};
		assert.equal(this.oSmartField.getDataProperty(), null);
	});

	QUnit.test("getDataProperty nothing set", function(assert) {
		this.oSmartField._oFactory = null;
		assert.equal(this.oSmartField.getDataProperty(), null);
	});

	QUnit.test("getUnitOfMeasure with unit of measure set.", function(assert) {
		this.oSmartField._oValue.uom = function() {
			return "the unit of measure";
		};

		assert.equal(this.oSmartField.getUnitOfMeasure(), "the unit of measure");
	});

	QUnit.test("getUnitOfMeasure no unit of measure set.", function(assert) {
		this.oSmartField._oValue.uom = null;
		assert.equal(this.oSmartField.getUnitOfMeasure(), null);
	});

	QUnit.test("setUnitOfMeasure", function(assert) {
		var sValue;

		this.oSmartField._oValue.uomset = function(oValue) {
			sValue = oValue;
		};

		this.oSmartField.setUnitOfMeasure("newValue");
		assert.equal(sValue, "newValue");
	});

	QUnit.test("setUnitOfMeasure - invalid input", function(assert) {
		var sValue = null;

		this.oSmartField._oValue.uomset = function(oValue) {
			sValue = oValue;
		};

		this.oSmartField.setUnitOfMeasure();
		assert.equal(sValue, null);
	});

	QUnit.test("setWidth", function(assert) {
		var sValue;

		this.oSmartField.getAggregation = function(sWidth) {
			return {
				setWidth: function(sWidth) {
					sValue = sWidth;
				},
				getMetadata: function () {
					return {
						getName: function() {
							return "sap.m.Input";
						}
					};
				},
				isA: function() {
					return false;
				}
			};
		};

		this.oSmartField.setWidth("100px");
		assert.equal(sValue, "100px");
	});

	QUnit.test("setSimpleClientError", function(assert) {
		this.oSmartField.setSimpleClientError(true);
		assert.equal(this.oSmartField._oError.bComplex, false);
		assert.equal(this.oSmartField._oError.bFirst, true);
		assert.equal(this.oSmartField._oError.bSecond, false);
	});

	QUnit.test("setComplexClientErrorFirstOperand", function(assert) {
		this.oSmartField.setComplexClientErrorFirstOperand(true);
		assert.equal(this.oSmartField._oError.bComplex, true);
		assert.equal(this.oSmartField._oError.bFirst, true);
		assert.equal(this.oSmartField._oError.bSecond, false);
	});

	QUnit.test("setComplexClientErrorSecondOperand", function(assert) {
		this.oSmartField.setComplexClientErrorSecondOperand(true);
		assert.equal(this.oSmartField._oError.bComplex, true);
		assert.equal(this.oSmartField._oError.bFirst, false);
		assert.equal(this.oSmartField._oError.bSecond, true);
	});

	QUnit.test("setComplexClientErrorSecondOperand", function(assert) {
		var oParent = {
			_oError: {
				bComplex: false,
				bFirst: false,
				bSecond: true
			},
			setComplexClientErrorSecondOperand: function(bError) {
				this._oError.bComplex = true;
				this._oError.bSecond = bError;
			}
		};

		this.oSmartField.getParent = function() {
			return {
				getParent: function() {
					return oParent;
				}
			};
		};

		this.oSmartField.setComplexClientErrorSecondOperandNested(true);
		assert.equal(oParent._oError.bComplex, true);
		assert.equal(oParent._oError.bFirst, false);
		assert.equal(oParent._oError.bSecond, true);
	});

	QUnit.test("_hasClientError", function(assert) {
		this.oSmartField._oError.bComplex = true;
		this.oSmartField._oError.bSecond = true;
		assert.equal(this.oSmartField._hasClientError(), true);

		this.oSmartField._oError.bComplex = false;
		assert.equal(this.oSmartField._hasClientError(), false);
	});

	QUnit.test("getFocusDomRef for empty Smartfield", function(assert) {
		var oRef = this.oSmartField.getFocusDomRef();
		assert.ok(!oRef);
	});

	QUnit.test("getFocusDomRef hosting another control", function(assert) {
		var oRef, oControl = {
			getMetadata: function() {
				return {
					_sClassName: "test"
				};
			},
			getFocusDomRef: function() {
				return "dummy-focus";
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return oControl;
		});
		oRef = this.oSmartField.getFocusDomRef();

		assert.equal(oRef, "dummy-focus");
	});

	QUnit.test("getInnerControls", function(assert) {
		var aControls, oControl = {
			getMetadata: function() {
				return {
					_sClassName: "test"
				};
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return oControl;
		});

		// test simple control.
		aControls = this.oSmartField.getInnerControls();
		assert.ok(aControls[0] === oControl);

		//test complex control.
		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.strictEqual(aControls.length, 0);

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [ {} ];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.strictEqual(aControls.length, 1);

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [ {}, {
						getAggregation: function() {
							return 1;
						},
						getContent: function() {
							return 1;
						}
					} ];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls.length, 2);
		assert.equal(aControls[1], 1);

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [ {}, {
						getAggregation: function() {
							return null;
						},
						getContent: function() {
							return null;
						}
					} ];
				}
			};
		});

		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls.length, 1);
	});

	QUnit.test("_getInnerControls for SmartLink", function(assert) {
		var aControls, oControl = {
			getMetadata: function() {
				return {
					_sClassName: "sap.ui.comp.navpopover.SmartLink"
				};
			},
			getAggregation: function() {
				return "test";
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return oControl;
		});

		// test existing nested control.
		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls[0], "test");

		oControl.getAggregation = function() {
			return null;
		};
		aControls = this.oSmartField.getInnerControls();
		assert.equal(aControls.length, 1);
		assert.equal(aControls[0], oControl);
	});

	QUnit.test("_checkErrors", function(assert) {
		var bParse = false;
		var bValidate = false;
		var oInput1 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "test";
					}
				};
			}
		};

		//check unknown control
		this.oSmartField._checkErrors(oInput1, { checkClientErrorsOnly: true });
		assert.strictEqual(bParse, false);

		// check sap.m.Input: no exception
		var oInput2 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getValue: function() {

			},
			getBinding: function() {
				return {
					setExternalValue: function() {

					},
					getValue: function() {
						return "";
					},
					getType: function() {

					},
					hasValidation: function(){
						return true;
					}
				};
			},
			fireValidationSuccess: function() {}
		};

		var oInput2FireValidationSuccessSpy = this.spy(oInput2, "fireValidationSuccess");

		this.oSmartField._checkErrors(oInput2, { checkClientErrorsOnly: true });
		assert.strictEqual(bParse, false);
		assert.strictEqual(bValidate, false);
		assert.strictEqual(oInput2FireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');


		// check sap.m.Input: ParseException
		var oInput3 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getValue: function() {

			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function(){
								throw new ParseException();
							},
							validateValue: function() {
								throw new ValidateException();
							},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					}
				};
			},
			fireParseError: function() {
				bParse = true;
			},
			fireValidationSuccess: function() {}
		};
		var oInput3FireValidationSuccessSpy = this.spy(oInput3, "fireValidationSuccess");


		this.oSmartField._checkErrors(oInput3, { checkClientErrorsOnly: true });
		assert.equal(bParse, true);
		assert.equal(bValidate, false);
		assert.strictEqual(oInput3FireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');

		//check sap.m.Input: ValidationException
		bParse = false;
		var oInput4 = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getValue: function() {

			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function(){
							},
							validateValue: function() {
								throw new ValidateException();
							},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					}
				};
			},
			fireValidationError: function() {
				bValidate = true;
			},
			fireValidationSuccess: function() {}
		};
		var oInput4FireValidationSuccessSpy = this.spy(oInput4, "fireValidationSuccess");
		this.oSmartField._checkErrors(oInput4, { checkClientErrorsOnly: true });
		assert.equal(bValidate, true);
		assert.equal(bParse, false);
		assert.strictEqual(oInput4FireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
	});

	// BCP: 1880161112
	QUnit.test("it should parse and validate the value of the underlying DateTimePicker control", function(assert) {

		// system under test
		var oDateTimePicker = new DateTimePicker();
		var oType = new DateTimeOffset();

		// arrange
		var oParseValueFunctionSpy = this.spy(oType, "parseValue");
		var oValidateValueFunctionSpy = this.spy(oType, "validateValue");
		this.stub(oDateTimePicker, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {},
			hasValidation: function(){
				return true;
			},
			sInternalType: "string"
		});

		// act
		this.oSmartField._checkErrors(oDateTimePicker, { checkClientErrorsOnly: true });

		// assert
		assert.strictEqual(oParseValueFunctionSpy.callCount, 1);
		assert.strictEqual(oValidateValueFunctionSpy.callCount, 1);

		// cleanup
		oDateTimePicker.destroy();
	});

	// BCP: 1880414348
	QUnit.test("it should parse and validate the value of the underlying Select control", function(assert) {

		// system under test
		var oSelect = new Select();
		var oType = new StringType();

		// arrange
		var oParseValueFunctionSpy = this.spy(oType, "parseValue");
		var oValidateValueFunctionSpy = this.spy(oType, "validateValue");
		this.stub(oSelect, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {},
			hasValidation: function(){
				return true;
			},
			sInternalType: "string"
		});

		// act
		this.oSmartField._checkErrors(oSelect, { checkClientErrorsOnly: true });

		// assert
		assert.strictEqual(oParseValueFunctionSpy.callCount, 1);
		assert.strictEqual(oValidateValueFunctionSpy.callCount, 1);

		// cleanup
		oSelect.destroy();
	});

	// BCP: 1880176672
	QUnit.test('calling the checkClientError() method should fire the "parseError" event with the expected parameters', function(assert) {

		// system under test
		var oInput = new Input({
			value: ""
		});
		var oType = new StringType();

		// arrange
		this.stub(oType, "parseValue").callsFake(function(sValue, sSourceType) {
			throw new ParseException("Parse exception");
		});
		this.stub(oInput, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {
				return "previous value";
			},
			sInternalType: "string"
		});

		var oFireValidateErrorSpy = this.spy(oInput, "fireParseError");

		// act
		this.oSmartField._checkErrors(oInput, { checkClientErrorsOnly: true });

		// assert
		var mParameters = oFireValidateErrorSpy.args[0][0] || {};
		assert.ok(mParameters.element === oInput);
		assert.ok(mParameters.type === oType);
		assert.strictEqual(mParameters.property, "value");
		assert.strictEqual(mParameters.newValue, "");
		assert.strictEqual(mParameters.oldValue, "previous value");
		assert.strictEqual(mParameters.exception.name, "ParseException");
		assert.strictEqual(mParameters.message, "Parse exception");

		// cleanup
		oInput.destroy();
		oType.destroy();
	});

	// BCP: 1880176672
	QUnit.test('calling the checkClientError() method should fire the "validateError" event with the expected parameters', function(assert) {

		// system under test
		var oInput = new Input({
			value: ""
		});
		var oType = new StringType();

		// arrange
		this.stub(oType, "validateValue").callsFake(function(sValue, sSourceType) {
			throw new ValidateException("Validate exception");
		});
		this.stub(oInput, "getBinding").returns({
			getType: function() {
				return oType;
			},
			getValue: function() {
				return "previous value";
			},
			sInternalType: "string"
		});

		var oFireValidateErrorSpy = this.spy(oInput, "fireValidationError");

		// act
		this.oSmartField._checkErrors(oInput, { checkClientErrorsOnly: true });

		// assert
		var mParameters = oFireValidateErrorSpy.args[0][0] || {};
		assert.ok(mParameters.element === oInput);
		assert.ok(mParameters.type === oType);
		assert.strictEqual(mParameters.property, "value");
		assert.strictEqual(mParameters.newValue, "");
		assert.strictEqual(mParameters.oldValue, "previous value");
		assert.strictEqual(mParameters.exception.name, "ValidateException");
		assert.strictEqual(mParameters.message, "Validate exception");

		// cleanup
		oInput.destroy();
		oType.destroy();
	});

	QUnit.test("it should skip the validation of the text input field value if the type is async and checkClientErrorsOnly=true", function(assert) {

		// arrange
		var oTextInput = new Input();
		var oFormatOptions = {
			textArrangement: "idAndDescription"
		};
		var oConstraints = {
			nullable: true
		};
		var oSettings = {
			keyField: "ID",
			descriptionField: "Text",
			onBeforeValidateValue: function(sValue, mSettings) {
				var aData = [{
					ID: "SS",
					Text: "Soundstation"
				}];
				mSettings.success(aData);
			}
		};
		var oType = new TextArrangementString(oFormatOptions, oConstraints, oSettings);
		var oParseSpy = this.spy(oType, "parseValue");
		var oValidateSpy = this.spy(oType, "validateValue");
		this.stub(oTextInput, "getBinding").returns({
			getType: function() {
				return oType;
			},
			sInternalType: "string"
		});

		// act
		this.oSmartField._checkErrors(oTextInput, { checkClientErrorsOnly: true });

		// assert
		assert.strictEqual(oParseSpy.callCount, 0);
		assert.strictEqual(oValidateSpy.callCount, 0);
		assert.strictEqual(this.oSmartField._oError.bFirst, true);

		// cleanup
		oType.destroy();
		oTextInput.destroy();
	});

	QUnit.test("checkClientError", function(assert) {
		var that = this;

		var oControl = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function() {},
							validateValue: function() {
								that.oSmartField._oError.bFirst = true;
								throw new ValidateException();
							},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					}
				};
			},
			getValue: function() {
				return null;
			},
			fireValidationError: function() {}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [
						oControl
					];
				}
			};
		});

		// no errors in display mode
		this.oSmartField.setEditable(false);
		var bError = this.oSmartField.checkClientError();
		assert.equal(bError, false);

		// we already have found an error.
		this.oSmartField.setEditable(true);
		this.oSmartField._oError.bFirst = true;
		bError = this.oSmartField.checkClientError();
		assert.equal(bError, true);

		// simulate finding an error.
		this.oSmartField._oError.bFirst = false;
		bError = this.oSmartField.checkClientError();
		assert.equal(bError, true);
	});

	QUnit.test("checkClientError with handleSuccess", function(assert) {
		// arrange
		var that = this;
		var oControl = {
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.m.Input";
					}
				};
			},
			getBinding: function() {
				return {
					sInternalType: "string",
					getType: function() {
						return {
							parseValue: function() {},
							validateValue: function() {},
							isA: function() {
								return false;
							}
						};
					},
					getValue: function() {
						return "";
					},
					hasValidation: function(){
						return true;
					}
				};
			},
			getValue: function() {
				return null;
			},
			fireValidationError: function() {},
			fireValidationSuccess: function() {
				that.oSmartField._oError.bFirst = false;
			}
		};

		fnPatchGetContentAggregation(this.oSmartField, function() {
			return {
				getMetadata: function() {
					return {
						_sClassName: "sap.m.HBox"
					};
				},
				getItems: function() {
					return [
						oControl
					];
				}
			};
		});

		this.oSmartField._oError.bFirst = true;

		// act
		var bError = this.oSmartField.checkClientError();
		// assert
		assert.equal(bError, true);

		// act
		bError = this.oSmartField.checkClientError({});
		// assert
		assert.equal(bError, true);

		// act
		bError = this.oSmartField.checkClientError({handleSuccess: false});
		// assert
		assert.equal(bError, true);

		// act
		bError = this.oSmartField.checkClientError({handleSuccess: true});
		// assert
		assert.equal(bError, false);

		// arrange
		var fnFireValidationSuccessSpy = this.spy(Control.prototype, "fireValidationSuccess");
		// act
		bError = this.oSmartField.checkClientError({handleSuccess: false});
		// assert
		assert.equal(bError, false);
		assert.strictEqual(fnFireValidationSuccessSpy.callCount, 0);
	});

	QUnit.test("attachVisibleChanged", function(assert) {
		var bVisible = true, fChange = function(oParam) {
			bVisible = oParam.getParameter("visible");
		};

		this.oSmartField.attachVisibleChanged(fChange);
		this.oSmartField.setVisible(false);
		assert.equal(bVisible, false);
	});

	QUnit.test("_getMaxSeverity", function(assert) {
		var oChild1, oChild2, iMax;

		oChild1 = {
			getValueState: function() {
				return "Success";
			}
		};
		oChild2 = {
			getValueState: function() {
				return "Error";
			}
		};

		iMax = this.oSmartField._getMaxSeverity([ oChild1, {}, oChild2, {} ]);
		assert.equal(iMax, 2);
	});

	QUnit.test("getValueStateText", function(assert) {
		var oChild1, oChild2;

		oChild1 = {
			getValueState: function() {
				return "Success";
			},
			getValueStateText: function() {
				return "SuccessText";
			}
		};
		oChild2 = {
			getValueState: function() {
				return "Error";
			},
			getValueStateText: function() {
				return "ErrorText";
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};

		assert.equal(this.oSmartField.getValueStateText(), "ErrorText");

		this.oSmartField.setValueStateText("test");
		this.oSmartField.getInnerControls = function() {
			return [];
		};
		assert.equal(this.oSmartField.getValueStateText(), "test");
	});

	QUnit.test("getValueState", function(assert) {
		var oChild1, oChild2;

		oChild1 = {
			getValueState: function() {
				return "Success";
			}
		};
		oChild2 = {
			getValueState: function() {
				return "Error";
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};
		assert.equal(this.oSmartField.getValueState(), "Error");

		this.oSmartField.getInnerControls = function() {
			return [];
		};
		assert.equal(this.oSmartField.getValueState(), "None");
	});

	QUnit.test("setValueState", function(assert) {
		var oState;

		var oChild1 = {
			getValueState: function() {
				return "Success";
			},
			setValueState: function(sState) {
				oState = sState;
			}
		};
		var oChild2 = {
			getValueState: function() {
				return "Error";
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};

		this.oSmartField.setValueState(ValueState.Error);
		assert.strictEqual(oState, ValueState.Error);
		assert.strictEqual(this.oSmartField.checkClientError(), true);
		assert.strictEqual(this.oSmartField.getValueState(), ValueState.Error);
	});

	QUnit.test("setValueStateText", function(assert) {
		var oState;

		var oChild1 = {
			getValueState: function() {
				return "Success";
			},
			setValueStateText: function(sState) {
				oState = sState;
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "";
					}
				};
			}
		};
		var oChild2 = {
			getValueState: function() {
				return "Error";
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "";
					}
				};
			}
		};
		this.oSmartField.getInnerControls = function() {
			return [ oChild1, oChild2 ];
		};

		this.oSmartField.setValueStateText("Error");
		assert.equal(oState, "Error");
		assert.equal(this.oSmartField.checkClientError(), false);
	});

	QUnit.test("exit method", function(assert) {
		var bDestroy = false;
		this.oSmartField._oFactory = {
			destroy: function() {
				bDestroy = true;
			}
		};

		this.oSmartField.exit();
		assert.ok(this.oSmartField);
		assert.equal(bDestroy, true);
	});

	QUnit.test("exit method destroys inner edit control in display mode", function(assert) {
		var bEditControlDestroyed = false;
		var bDisplayControlDestroyed = false;

		this.oSmartField._oControl.edit = {
			destroy: function() {
				bEditControlDestroyed = true;
			}
		};
		this.oSmartField._oControl.display = {
			destroy: function() {
				bDisplayControlDestroyed = true;
			}
		};

		this.oSmartField.setEditable(false);
		this.oSmartField.exit();

		assert.ok(bEditControlDestroyed, "in display mode, inner edit control has to be destroyed explicitly");
		assert.ok(!bDisplayControlDestroyed, "in display mode, inner display control should only be destroyed via content aggregation");
	});

	QUnit.test("exit method destroys inner display control in edit mode", function(assert) {
		var bEditControlDestroyed = false;
		var bDisplayControlDestroyed = false;

		this.oSmartField._oControl.edit = {
			destroy: function() {
				bEditControlDestroyed = true;
			},
			getParent: function() {
				return {};
			}
		};

		this.oSmartField._oControl.display = {
			destroy: function() {
				bDisplayControlDestroyed = true;
			}
		};

		this.oSmartField._oControl.current = "edit";
		this.oSmartField.destroy();

		assert.ok(!bEditControlDestroyed, "in edit mode, inner edit control should only be destroyed via content aggregation");
		assert.ok(bDisplayControlDestroyed, "in edit mode, inner display control has to be destroyed explicitly");
	});

	QUnit.test("Can be destroyed", function(assert) {
		var bDestroy = false;
		this.oSmartField._oFactory = {
			destroy: function() {
				bDestroy = true;
			}
		};

		this.oSmartField.destroy();
		assert.ok(this.oSmartField);
		assert.equal(bDestroy, true);
	});

	QUnit.test("create control", function(assert) {
		this.oSmartField._oFactory = sinon.createStubInstance(ODataControlFactory);
		this.oSmartField._oFactory.bPending = false;
		this.stub(this.oSmartField, "_createControlIfRequired");
		this.oSmartField.setEditable(true);
		assert.ok(this.oSmartField._createControlIfRequired.calledOnce, "SmartField is editable, create control should have been called");
		this.oSmartField._createControlIfRequired.reset();
		this.oSmartField.data("configdata", { configdata: true });
		this.oSmartField.setEditable(false);
		assert.ok(!this.oSmartField._createControlIfRequired.calledOnce, "SmartField is not editable, create control should not have been called");
		assert.equal(this.oSmartField._oControl.current, "display");
	});

	QUnit.test("refreshDataState shall set _checkCreated to true", function(assert) {
		var oState = {
			isLaundering: function() {
				return true;
			}
		};

		this.oSmartField.getBindingContext = function() {
			return {
				getObject: function() {
					return {
						__metadata: {
							created: true
						}
					};
				}
			};
		};

		this.oSmartField.refreshDataState("value", oState);
		assert.ok(this.oSmartField._checkCreated);
	});

	QUnit.test("refreshDataState shall remove _checkCreated", function(assert) {
		var oState = {
			isLaundering: function() {
				return false;
			},
			isDirty: function() {
				return false;
			}
		};

		this.oSmartField.getBindingContext = function() {
			return {
				getObject: function() {
					return {
						__metadata: {
							created: true
						}
					};
				}
			};
		};
		this.oSmartField._checkCreated = true;
		this.oSmartField._oFactory = {
			rebindOnCreated : function() {

			}
		};
		this.oSmartField.refreshDataState("value", oState);
		assert.ok(!this.oSmartField._checkCreated);
	});

	QUnit.test("toggle between edit/display, with value and without value", function(assert) {
		var oEditControl = new Input();
		var oDisplayControl = new Text();
		var oInnerControl = oDisplayControl;
		this.oSmartField._oFactory = sinon.createStubInstance(ODataControlFactory);
		this.oSmartField._oFactory.createControl = function() {
			return {
				control: oInnerControl
			};
		};
		this.oSmartField.data("configdata", { configdata: true});

		this.oSmartField.setEditable(false);
		this.oSmartField.setValue("");

		assert.ok(!this.oSmartField.getContent(), "empty value, not editable => smartField's content has to be empty");
		assert.equal(this.oSmartField._oControl.current, "display");

		oInnerControl = oEditControl;
		this.oSmartField.setEditable(true);
		this.oSmartField.setValue("dummy");
		assert.ok(this.oSmartField.getContent() === oEditControl, "contains value, editable => smartField's content has to contain editControl");
		assert.equal(this.oSmartField._oControl.current, "edit");

		oInnerControl = oDisplayControl;
		this.oSmartField.setEditable(false);
		assert.ok(this.oSmartField.getContent() === oDisplayControl, "contains value, not editable => smartField's content has to contain display control");
		assert.equal(this.oSmartField._oControl.current, "display");

		this.oSmartField.setValue("");
		assert.ok(!this.oSmartField.getContent(), "empty value, not editable => smartField's content has to be empty");

		oInnerControl = oEditControl;
		this.oSmartField.setEditable(true);

		assert.ok(this.oSmartField.getContent() === oEditControl, "empty value, editable => smartField's content has to contain edit control");
		assert.equal(this.oSmartField._oControl.current, "edit");
	});

	// BCP: 1770145312
	QUnit.test("it should destroy the inner control", function(assert) {

		// arrange
		this.oSmartField._oControl.display = new Control();
		this.oSmartField._oControl.display_uom = new Control();
		this.oSmartField._oControl.edit = new Control();
		var oDestroySpy = this.spy(Control.prototype, "destroy");

		// act
		this.oSmartField._destroyFactory();

		// assert
		assert.strictEqual(oDestroySpy.callCount, 3);
		assert.strictEqual(this.oSmartField._oControl.display, null);
		assert.strictEqual(this.oSmartField._oControl.display_uom, null);
		assert.strictEqual(this.oSmartField._oControl.edit, null);
	});

	QUnit.test("getSupportedAnnotationPaths shall return complete paths", function(assert) {
		var oModel, aResult;

		oModel = sinon.createStubInstance(ODataMetaModel);
		oModel.getODataEntityType = function() {
			return oTestEntityType;
		};
		oModel.getODataProperty = function() {
			return oTestProperty;
		};

		aResult = SmartField.getSupportedAnnotationPaths(oModel, oTestEntitySet, "Description");
		assert.equal(aResult[0], "Properties/EntityUpdatable");
	});

	QUnit.test("getSupportedAnnotationPaths shall return only navigation properties", function(assert) {
		var oModel, aResult, oPropertiesSet, oPropertiesType;
		oPropertiesSet = {"name":"ProjectFC","entityType":"ZMEY_SRV.ProjectFC_Type","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"deletable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"pageable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"addressable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"content-version","value":"1","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","Org.OData.Capabilities.V1.InsertRestrictions":{"Insertable":{"Bool":"false"}},"sap:updatable":"false","Org.OData.Capabilities.V1.UpdateRestrictions":{"Updatable":{"Bool":"false"}},"sap:deletable":"false","Org.OData.Capabilities.V1.DeleteRestrictions":{"Deletable":{"Bool":"false"}},"sap:pageable":"false","Org.OData.Capabilities.V1.SkipSupported":{"Bool":"false"},"Org.OData.Capabilities.V1.TopSupported":{"Bool":"false"},"sap:addressable":"false","sap:content-version":"1","Org.OData.Capabilities.V1.SearchRestrictions":{"Searchable":{"Bool":"false"}},"Org.OData.Capabilities.V1.FilterRestrictions":{"NonFilterableProperties":[{"PropertyPath":"ID"},{"PropertyPath":"Description_FC"},{"PropertyPath":"Name_FC"},{"PropertyPath":"StartDate_FC"},{"PropertyPath":"EntityUpdatable"}]},"Org.OData.Capabilities.V1.SortRestrictions":{"NonSortableProperties":[{"PropertyPath":"ID"},{"PropertyPath":"Description_FC"},{"PropertyPath":"Name_FC"},{"PropertyPath":"StartDate_FC"},{"PropertyPath":"EntityUpdatable"}]}};
		oPropertiesType = {"name":"ProjectFC_Type","key":{"propertyRef":[{"name":"ID"}]},"property":[{"name":"ID","type":"Edm.Int32","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"Description_FC","type":"Edm.Byte","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"Name_FC","type":"Edm.Byte","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"StartDate_FC","type":"Edm.Byte","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}},{"name":"EntityUpdatable","type":"Edm.Boolean","nullable":"false","extensions":[{"name":"creatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"updatable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"sortable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"},{"name":"filterable","value":"false","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:creatable":"false","sap:updatable":"false","sap:sortable":"false","sap:filterable":"false","Org.OData.Core.V1.Computed":{"Bool":"true"}}],"extensions":[{"name":"content-version","value":"1","namespace":"http://www.sap.com/Protocols/SAPData"}],"sap:content-version":"1","namespace":"ZMEY_SRV","$path":"/dataServices/schema/0/entityType/2"};

		oModel = sinon.createStubInstance(ODataMetaModel);
		oModel.getODataEntityType = function(sType) {
			if (sType === "ZMEY_SRV.Project_Type") {
				return oTestEntityType;
			}

			return oPropertiesType;
		};
		oModel.getODataEntitySet = function() {
			return oPropertiesSet;
		};
		oModel.getODataProperty = function() {
			return oTestProperty;
		};
		oModel.getODataAssociationSetEnd = function() {
			return {"entitySet":"ProjectFC","role":"ToRole_ProjectProperties"};
		};
		aResult = SmartField.getSupportedAnnotationPaths(oModel, oTestEntitySet, "Description", true);

		assert.equal(aResult[0], "Properties");
	});

	QUnit.test("addAssociation shall propagate aria label to inner controls", function(assert) {
		var sLabel;

		this.oSmartField.getInnerControls = function() {
			var oInnerControl = {
				addAriaLabelledBy: function(sId){
					sLabel = sId;
				}
			};
			return [oInnerControl];
		};

		this.oSmartField.addAssociation("ariaLabelledBy", "textXYZ");
		assert.equal(sLabel, "textXYZ");
	});

	QUnit.test("it should not throw an error when the .destroy() method is called twice", function(assert) {
		this.oSmartField.destroy();
		this.oSmartField.destroy();
		assert.ok(true);
	});

	// BCP: 1680344532
	QUnit.test("it should propagate the value of the wrapping property to the inner control in display mode", function(assert) {

		// system under test
		var oText = new Text();
		var oSmartField = new SmartField({
			wrapping: true
		});

		// arrange
		oSmartField.setContent(oText);

		// act
		oSmartField.setWrapping(false);

		// assert
		assert.strictEqual(oText.getWrapping(), false);

		// cleanup
		oText.destroy();
		oSmartField.destroy();
	});

	// BCP: 1780008081
	QUnit.test("it should not throw an exception when the value of the wrapping property is propagated to a" +
				"sap.m.TextArea inner control in display mode (test case 1)", function(assert) {

		// system under test
		var oTextArea = new TextArea();
		var oSmartField = new SmartField({
			wrapping: true
		});

		// arrange
		oSmartField.setContent(oTextArea);

		// act
		oSmartField.setWrapping(false);

		// assert
		assert.strictEqual(oSmartField.getWrapping(), false);
		assert.strictEqual(oTextArea.getWrapping(), Wrapping.None);

		// cleanup
		oSmartField.destroy();
	});

	// BCP 1780008081
	QUnit.test("it should not throw an exception when the value of the wrapping property is propagated to a" +
				"sap.m.TextArea inner control in display mode (test case 2)", function(assert) {

		// system under test
		var oTextArea = new TextArea();
		var oSmartField = new SmartField({
			wrapping: false
		});

		// arrange
		oSmartField.setContent(oTextArea);

		// act
		oSmartField.setWrapping(true);

		// assert
		assert.strictEqual(oSmartField.getWrapping(), true);
		assert.strictEqual(oTextArea.getWrapping(), Wrapping.Soft);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the visibleChanged event", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			visible: true
		});

		// arrange
		var fnFireVisibleChangedSpy = this.spy(oSmartField, "fireVisibleChanged");

		// act
		oSmartField.setVisible(false);

		// assert
		assert.strictEqual(fnFireVisibleChangedSpy.callCount, 1);
		assert.strictEqual(fnFireVisibleChangedSpy.args[0][0].visible, false);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the visibleChanged event only once", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			visible: false
		});

		// arrange
		var fnFireVisibleChangedSpy = this.spy(oSmartField, "fireVisibleChanged");

		// act
		oSmartField.setVisible(true);
		oSmartField.setVisible(true);

		// assert
		assert.strictEqual(fnFireVisibleChangedSpy.callCount, 1);
		assert.strictEqual(fnFireVisibleChangedSpy.args[0][0].visible, true);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the editableChanged event", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: true
		});

		// arrange
		var fnFireEditableChangedSpy = this.spy(oSmartField, "fireEditableChanged");

		// act
		oSmartField.setEditable(false);

		// assert
		assert.strictEqual(fnFireEditableChangedSpy.callCount, 1);
		assert.strictEqual(fnFireEditableChangedSpy.args[0][0].editable, false);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the editableChanged event only once", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: false
		});

		// arrange
		var fnFireEditableChangedSpy = this.spy(oSmartField, "fireEditableChanged");

		// act
		oSmartField.setEditable(true);
		oSmartField.setEditable(true);

		// assert
		assert.strictEqual(fnFireEditableChangedSpy.callCount, 1);
		assert.strictEqual(fnFireEditableChangedSpy.args[0][0].editable, true);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the contextEditable event", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: true
		});

		// arrange
		var fnFireContextEditableChangedSpy = this.spy(oSmartField, "fireContextEditableChanged");

		// act
		oSmartField.setContextEditable(false);

		// assert
		assert.strictEqual(fnFireContextEditableChangedSpy.callCount, 1);
		assert.strictEqual(fnFireContextEditableChangedSpy.args[0][0].editable, false);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should fire the contextEditable event only once", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			editable: true
		});

		// arrange
		var fnFireContextEditableChangedSpy = this.spy(oSmartField, "fireContextEditableChanged");

		// act
		oSmartField.setContextEditable(false);
		oSmartField.setContextEditable(false);

		// assert
		assert.strictEqual(fnFireContextEditableChangedSpy.callCount, 1);
		assert.strictEqual(fnFireContextEditableChangedSpy.args[0][0].editable, false);

		// cleanup
		oSmartField.destroy();
	});

	// BCP: 1780147285
	QUnit.test("it should propagate the value of the showSuggestion property to the inner control in edit mode", function(assert) {

		// arrange
		var oInput = new Input();
		this.oSmartField._init();
		this.stub(this.oSmartField.getControlFactory(), "_createValueHelp").returns(undefined);
		this.oSmartField.setShowSuggestion(false);
		this.oSmartField.setContent(oInput);

		// act
		this.oSmartField.setShowSuggestion(true);

		// assert
		assert.strictEqual(oInput.getShowSuggestion(), true);

		// cleanup
		this.oSmartField.destroy();
	});

	// BCP: 1780147285
	QUnit.test("it should propagate the value of the showValueHelp property to the inner control in edit mode", function(assert) {

		// arrange
		var oInput = new Input();
		this.oSmartField._init();
		this.stub(this.oSmartField.getControlFactory(), "_createValueHelp").returns(undefined);
		this.oSmartField.setShowValueHelp(false);
		this.oSmartField.setContent(oInput);

		// act
		this.oSmartField.setShowValueHelp(true);

		// assert
		assert.strictEqual(oInput.getShowValueHelp(), true);

		// cleanup
		this.oSmartField.destroy();
	});

	// BCP: 0020751295 0000236582 2017
	QUnit.test('it should map the "mandatory" property to the hosted inner control as "required"', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			mandatory: false
		});
		var oInputHosted = new Input({
			required: false
		});

		// arrange
		oSmartField.setContent(oInputHosted);

		// act
		oSmartField.setMandatory(true);

		// assert
		assert.strictEqual(oSmartField.getMandatory(), true);
		assert.strictEqual(oInputHosted.getRequired(), true);

		// cleanup
		oSmartField.destroy();
	});

	// BCP: 1880222106
	QUnit.test("it should propagate the value of the required property to the underlying text input controls" , function(assert) {

		// system under test
		var oInput1 = new Input({
			required: false
		});
		var oInput2 = new Input({
			required: false
		});

		// arrange
		this.stub(this.oSmartField, "getInnerControls").returns([
			oInput1, oInput2
		]);

		// act
		this.oSmartField._setPropertyOnControls("required" , true);

		// assert
		assert.strictEqual(oInput1.getRequired(), true);
		assert.strictEqual(oInput2.getRequired(), true);

		// cleanup
		oInput1.destroy();
		oInput2.destroy();
	});

	QUnit.test("it should return true when the control is displayed in the form context", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			controlContext: ControlContextType.Form
		});

		// assert
		assert.strictEqual(oSmartField.isFormContextType(), true);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should return false when the control is not displayed in the form context", function(assert) {

		// system under test
		var oSmartField = new SmartField();

		// assert
		assert.strictEqual(oSmartField.isFormContextType(), false);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should propagate the value of the tooltip aggregation to the underlying control", function(assert) {

		// arrange
		var oInput = new Input();
		this.oSmartField.setContent(oInput);
		var sTooltip = "lorem ipsum";

		// act
		this.oSmartField.setTooltip(sTooltip);

		// assert
		assert.strictEqual(oInput.getTooltip(), sTooltip);

		// cleanup
		this.oSmartField.destroy();
	});

	QUnit.test("it should forward .bindProperty() function call to Control.prototype.bindProperty() (test case 1)", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "ProductID" };
		var oBindPropertySpy = this.spy(Control.prototype, "bindProperty");

		// act
		var oReturn = oSmartField.bindProperty("placeholder", oBindingInfo);

		// assert
		assert.ok(oBindPropertySpy.calledOnce);
		assert.ok(oReturn === oSmartField, "it should return this to allow method chaining");

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should forward .bindProperty() function call to Control.prototype.bindProperty() (test case 2)", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "ProductID" };
		var oBindPropertySpy = this.spy(Control.prototype, "bindProperty");
		this.stub(oSmartField, "isPropertyInitial").withArgs("value").returns(true);

		// act
		var oReturn = oSmartField.bindProperty("value", oBindingInfo);

		// assert
		assert.ok(oBindPropertySpy.calledOnce);
		assert.ok(oReturn === oSmartField, "it should return this to allow method chaining");

		// cleanup
		oSmartField.destroy();
	});

	// BCP: 1880503798
	QUnit.test("it should destroy the control factory, inner controls and create a new inner control when the " +
	           "binding path changes (test case 1)", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "ProductID" };
		var oDestroyFactorySpy = this.spy(oSmartField, "_destroyFactory");
		var oInitSpy = this.spy(oSmartField, "_init");
		this.stub(oSmartField, "isPropertyInitial").withArgs("value").returns(false);
		this.stub(oSmartField, "getBindingPath").withArgs("value").returns("CategoryID");
		this.stub(Control.prototype, "bindProperty").callsFake(function(sPropertyName, oBindingInfo) {
			oSmartField.getBindingPath.restore();
			this.stub(oSmartField, "getBindingPath").withArgs("value").returns("ProductID");

			// assert
			assert.strictEqual(sPropertyName, "value");
			assert.strictEqual(oBindingInfo.path, "ProductID");
		}.bind(this));

		// act
		var oReturn = oSmartField.bindProperty("value", oBindingInfo);

		// assert
		assert.ok(oReturn === oSmartField, "it should return this to allow method chaining");
		assert.ok(oDestroyFactorySpy.calledOnce);
		assert.ok(oInitSpy.calledOnce);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should destroy the control factory, inner controls and create a new inner control when the " +
	           "binding context changes (test case 2)", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oBindingInfo = { path: "SalesOrderID" };
		var oDestroyFactorySpy = this.spy(oSmartField, "_destroyFactory");
		var oInitSpy = this.spy(oSmartField, "_init");
		this.stub(oSmartField, "isPropertyInitial").withArgs("value").returns(false);
		this.stub(oSmartField, "getBindingPath").withArgs("value").returns("SalesOrderID");
		this.stub(oSmartField, "getBindingContext").returns({
			getPath: function() {
				return "/SalesOrderSet('0500000000')";
			}
		});
		this.stub(Control.prototype, "bindProperty").callsFake(function(sPropertyName, oBindingInfo) {
			oSmartField.getBindingContext.restore();
			this.stub(oSmartField, "getBindingContext").returns({
				getPath: function() {
					return "/SalesOrderSet('0500000001')";
				}
			});

			// assert
			assert.strictEqual(sPropertyName, "value");
			assert.strictEqual(oBindingInfo.path, "SalesOrderID");
		}.bind(this));

		// act
		var oReturn = oSmartField.bindProperty("value", oBindingInfo);

		// assert
		assert.ok(oReturn === oSmartField, "it should return this to allow method chaining");
		assert.ok(oDestroyFactorySpy.calledOnce);
		assert.ok(oInitSpy.calledOnce);

		// cleanup
		oSmartField.destroy();
	});

	QUnit.test("it should forward function calls to .unBindProperty() to inner controls", function(assert) {

		// system under test
		var oInput = new Input();
		var oText = new Text();

		// arrange
		var oInputUnbindPropertySpy = this.spy(oInput, "unbindProperty");
		var oTextUnbindPropertySpy = this.spy(oText, "unbindProperty");
		this.stub(this.oSmartField, "getAllInnerControls").returns([
			oInput, oText
		]);

		// act
		var oReturn = this.oSmartField.unbindProperty("value");

		// assert
		assert.ok(oInputUnbindPropertySpy.calledOnceWithExactly("value", undefined));
		assert.ok(oTextUnbindPropertySpy.calledOnceWithExactly("text", undefined));
		assert.ok(oReturn === this.oSmartField, "It should return this to allow method chaining");

		// cleanup
		oInput.destroy();
		oText.destroy();
	});

	QUnit.test("it should return all inner controls", function(assert) {

		// arrange
		var oText = new Text();
		var oInput = new Input();
		this.oSmartField._oControl = { // mimic the SmartField control internal data structure
			current: "display",
			display: oText,
			display_uom: null,
			edit: oInput
		};

		// act
		var aControls = this.oSmartField.getAllInnerControls();

		// assert
		assert.strictEqual(aControls.length, 2);
		assert.ok(aControls[0] === oText);
		assert.ok(aControls[1] === oInput);

		// cleanup
		oText.destroy();
		oInput.destroy();
	});

	QUnit.test('it should toggle the inner UOM field when calling the "setUomEditable" method and the "uomEditable" ' +
				'property is not bound', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomEditable: true
		});
		var oUomSmartField = new SmartField({
			editable: true
		});

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);

		// act
		var oReturn = oSmartField.setUomEditable(false);

		// assert
		assert.strictEqual(oSmartField.getUomEditable(), false);
		assert.ok(oSmartField === oReturn);
		assert.strictEqual(oUomSmartField.getEditable(), false);

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	QUnit.test('it should toggle the inner UOM field when calling the "setUomEnabled" method and the "uomEnabled" ' +
				'property is not bound', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomEnabled: true
		});
		var oUomSmartField = new SmartField({
			enabled: true
		});

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);

		// act
		var oReturn = oSmartField.setUomEnabled(false);

		// assert
		assert.strictEqual(oSmartField.getUomEnabled(), false);
		assert.ok(oSmartField === oReturn);
		assert.strictEqual(oUomSmartField.getEnabled(), false);

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	// BCP: 1870386724
	QUnit.test('it should show/hide the inner UOM field when calling the "setUomVisible" method and the "uomVisible" ' +
				'property is not bound', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomVisible: true
		});
		var oUomSmartField = new SmartField({
			visible: true
		});

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);

		// act
		var oReturn = oSmartField.setUomVisible(false);

		// assert
		assert.strictEqual(oSmartField.getUomVisible(), false);
		assert.ok(oSmartField === oReturn);
		assert.strictEqual(oUomSmartField.getVisible(), false);

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	// BCP: 1880664737
	QUnit.test('it should toggle the "smartFieldPaddingRight" CSS style class of the amount field when ' +
	           'the currency field is set to invisible', function(assert) {

		// system under test
		var oSmartField = new SmartField({
			uomVisible: true
		});

		var oUomSmartField = new SmartField({
			visible: true
		});

		var oMeasureField = new Input();

		// arrange
		this.stub(oSmartField, "_getEmbeddedSmartField").returns(oUomSmartField);
		oSmartField._oFactory = sinon.createStubInstance(ODataControlFactory);
		oSmartField._oFactory.oMeasureField = oMeasureField;

		// act + assert
		oSmartField.setUomVisible(false);
		assert.notOk(oMeasureField.hasStyleClass("smartFieldPaddingRight"));
		oSmartField.setUomVisible(true);
		assert.ok(oMeasureField.hasStyleClass("smartFieldPaddingRight"));

		// cleanup
		oSmartField.destroy();
		oUomSmartField.destroy();
	});

	QUnit.test("setEnabled", function(assert) {
		var oReturn = this.oSmartField.setEnabled(true);
		assert.equal(this.oSmartField.getProperty("enabled"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("setEditable", function(assert) {
		var oReturn = this.oSmartField.setEditable(true);
		assert.equal(this.oSmartField.getProperty("editable"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	QUnit.test("setContextEditable", function(assert) {
		var oReturn = this.oSmartField.setContextEditable(true);
		assert.equal(this.oSmartField.getProperty("contextEditable"), true);
		assert.equal(this.oSmartField, oReturn);
	});

	// BCP: 1780483007
	QUnit.module("toggling inner controls via .setEditable() and .setContextEditable()", {
		beforeEach: function() {

			// system under test
			this.oSmartField = new SmartField({
				editable: true,
				contextEditable: true,
				enabled: true
			});

			this.oText = new Text();

			// arrange to mimic an SmartField control internal data structure
			this.oSmartField._oControl = {
				current: "display",
				display: this.oText,
				display_uom: null,
				edit: null
			};

			this.oSmartField.mBindingInfos = {
				editable: {},
				contextEditable: {}
			};
		},
		afterEach: function() {

			// cleanup
			this.oText.destroy();
			this.oSmartField.destroy();
			this.oText = null;
			this.oSmartField = null;
		}
	});

	QUnit.test("it should not toggle the current displayed inner control when the bound entity is deleted (test case 1)", function(assert) {
		// by default the editable property is set to true

		// arrange
		this.stub(this.oSmartField, "getBindingContext").returns(null);
		this.stub(this.oSmartField, "getBindingInfo").withArgs("editable").returns({
			skipModelUpdate: 1
		});
		var oToggleControlSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act mimic a model update
		this.oSmartField.setEditable(false);

		// assert
		assert.strictEqual(oToggleControlSpy.callCount, 0, "it should not toggle the inner control");
	});

	QUnit.test("it should not toggle the current displayed inner control when the bound entity is deleted (test case 2)", function(assert) {
		// by default the contextEditable property is set to true

		// arrange
		this.stub(this.oSmartField, "getBindingContext").returns({
			getObject: function() {
				return; // return undefined to simulate a deleted entity
			}
		});

		this.stub(this.oSmartField, "getBindingInfo").withArgs("contextEditable").returns({
			skipModelUpdate: 1
		});
		var oToggleControlSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act mimic a model update
		this.oSmartField.setContextEditable(false);

		// assert
		assert.strictEqual(oToggleControlSpy.callCount, 0, "it should not toggle the inner control");
	});

	QUnit.test("it should toggle the current displayed inner control (test case 1)", function(assert) {
		// by default the editable property is set to true

		// arrange
		this.oSmartField._oControl = {
			current: undefined,
			display: undefined,
			display_uom: undefined,
			edit: undefined
		};

		var oToggleControlSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act
		this.oSmartField.setEditable(false);

		// assert
		assert.strictEqual(oToggleControlSpy.callCount, 1, "it should toggle the inner control");
	});

	QUnit.test("it should toggle the current displayed inner control (test case 2)", function(assert) {

		// arrange
		this.stub(this.oSmartField, "getBindingInfo").withArgs("contextEditable").returns({
			skipModelUpdate: 0
		});

		var oToggleControlSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act
		this.oSmartField.setEditable(false);

		// assert
		assert.strictEqual(oToggleControlSpy.callCount, 1, "it should toggle the inner control");
	});

	QUnit.module("checkValuesValidity", {
		beforeEach: function() {

			// system under test
			this.oSmartField = new SmartField();

			// arrange
			this.oInnerInput = new Input();
			this.oType = new StringType();
			this.stub(this.oSmartField, "getInnerControls").returns([
				this.oInnerInput
			]);
			this.stub(this.oInnerInput, "getValue").returns("Lorem");
			this.stub(this.oInnerInput, "getBinding").withArgs("value").returns({
				getType: function() {
					return this.oType;
				}.bind(this),
				getValue: function() {
					return "Lorem";
				},
				getDataState: function() {
					return {
						getValue: function() {
							return "Lorem";
						},
						isControlDirty: function() {
							return false;
						}
					};
				},
				hasValidation: function(){
					return true;
				},
				sInternalType: "string"
			});
		},
		afterEach: function() {

			// cleanup
			this.oType.destroy();
			this.oInnerInput.destroy();
			this.oSmartField.destroy();
			this.oType = null;
			this.oInnerInput = null;
			this.oSmartField = null;
		}
	});

	QUnit.test("checkValuesValidity should return a fulfilled promise object when the control is in display", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oSmartField, "getMode").returns("display");
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 1)", function(assert) {
		var done = assert.async();

		// arrange
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 2)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve("Ipsum");
			});
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).then(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 3)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				setTimeout(function() {
					fnResolve("Ipsum");
				}, 100);
			});
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).then(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 4)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve();
			});
		});

		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve();
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 5)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				setTimeout(function() {
					fnResolve();
				}, 100);
			});
		});

		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {
				setTimeout(function() {
					fnResolve();
				}, 100);
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	// BCP: 1970321980
	QUnit.test("checkValuesValidity should return a fulfilled Promise object (test case 6)", function(assert) {
		var done = assert.async();

		// arrange
		this.oType.async = true;
		var oParseValueSpy = this.spy(this.oType, "parseValue");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(true);
		}).catch(function() {
			assert.ok(false);
		}).then(function() {
			assert.strictEqual(oParseValueSpy.callCount, 0, 'it should not unnecessary call the "parseValue" method ' +
            'of an async binding data type to prevent an unnecessary HTTP request to be sent in case the value was already validated (not dirty)');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'it should fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 1)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnReject(new ParseException());
			});
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 0, 'it should not fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 1, 'it should fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 2)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "parseValue").callsFake(function(vValue, sSourceType) {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve();
			});
		});

		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {

				setTimeout(function() {
					fnReject(new ValidateException());
				}, 100);
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 1, 'it should fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 3)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "validateValue").callsFake(function(aValue) {
			return new Promise(function(fnResolve, fnReject) {

				setTimeout(function() {
					fnReject(new ValidateException());
				}, 100);
			});
		});

		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireValidationErrorSpy.callCount, 1, 'it should fire a "validationError" event');
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	QUnit.test("checkValuesValidity should return a rejected Promise object (test case 4)", function(assert) {
		var done = assert.async();

		// arrange
		this.stub(this.oType, "validateValue").callsFake(function(vValue, sSourceType) {
			throw new ValidateException("Lorem Ipsum");
		});
		var oFireValidationErrorSpy = this.spy(this.oInnerInput, "fireValidationError");
		var oFireParseErrorSpy = this.spy(this.oInnerInput, "fireParseError");
		var oFireValidationSuccessSpy = this.spy(this.oInnerInput, "fireValidationSuccess");

		// act
		var oPromise = this.oSmartField.checkValuesValidity();

		// assert
		oPromise.then(function() {
			assert.ok(false);
		}).catch(function() {
			assert.ok(true);
		}).finally(function() {
			assert.strictEqual(oFireParseErrorSpy.callCount, 0, 'it should not fire a "parseError" event');
			assert.strictEqual(oFireValidationErrorSpy.callCount, 1, 'it should fire a "validationError" event');
			assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'it should not fire a "validationSuccess" event');
			done();
		});
	});

	// BCP: 0020751295 0000179434 2019
	QUnit.module("toggling inner controls via .setConfiguration()", {
		beforeEach: function() {

			// system under test
			this.oSmartField = new SmartField();
			this.oInput = new Input();

			// arrange
			this.oSmartField.setContent(this.oInput);
		},
		afterEach: function() {

			// cleanup
			this.oInput.destroy();
			this.oInput = null;
			this.oSmartField.destroy();
			this.oSmartField = null;
		}
	});

	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 1)", function(assert) {

		// arrange
		var oConfig = new Configuration({
			controlType: ControlType.dropDownList
		});

		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act
		var oReturn = this.oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(oReturn === this.oSmartField);
		assert.ok(oConfig === this.oSmartField.getConfiguration());

		// cleanup
		oConfig.destroy();
	});

	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 2)", function(assert) {

		// system under test
		var oConfig = new Configuration({
			controlType: ControlType.dropDownList
		});

		var oSmartField = new SmartField({
			configuration: oConfig
		});

		var oInput = new Input();

		// arrange
		oSmartField.setContent(oInput);
		var oDestroyInnerControls = this.spy(oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(oSmartField, "_toggleInnerControlIfRequired");

		// act
		var oReturn = oSmartField.setConfiguration(null);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(oReturn === oSmartField);
		assert.ok(this.oSmartField.getConfiguration() === null);

		// cleanup
		oConfig.destroy();
		oInput.destroy();
		oSmartField.destroy();
	});

	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 3)", function(assert) {

		// arrange
		var oConfig = new Configuration({
			displayBehaviour: DisplayBehaviour.descriptionOnly
		});

		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act
		var oReturn = this.oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(oConfig === this.oSmartField.getConfiguration());
		assert.ok(oReturn === this.oSmartField);

		// cleanup
		oConfig.destroy();
	});


	QUnit.test("it should toggle the inner control when the configuration aggregation changes (test case 4)", function(assert) {

		// arrange
		var oConfig = new Configuration({
			displayBehaviour: DisplayBehaviour.descriptionOnly
		});

		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");
		this.oSmartField.setConfiguration(oConfig);

		// act
		var oReturn = this.oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 1);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 1);
		assert.ok(this.oSmartField.getConfiguration() === oConfig);
		assert.ok(oReturn === this.oSmartField);

		// cleanup
		oConfig.destroy();
	});

	QUnit.test("it should NOT toggle the inner control when the configuration aggregation changes", function(assert) {

		// arrange
		var oDestroyInnerControls = this.spy(this.oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(this.oSmartField, "_toggleInnerControlIfRequired");

		// act, notice that the current configuration value before invoking this method is null
		var oReturn = this.oSmartField.setConfiguration(null);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 0);
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 0);
		assert.ok(this.oSmartField.getConfiguration() === null);
		assert.ok(oReturn === this.oSmartField);
	});

	QUnit.test("it should NOT toggle the inner control when the configuration aggregation changes and " +
				"the inner controls are not created", function(assert) {

		// system under test
		var oSmartField = new SmartField();

		// arrange
		var oConfig = new Configuration({
			displayBehaviour: DisplayBehaviour.descriptionOnly
		});
		var oDestroyInnerControls = this.spy(oSmartField, "_destroyControls");
		var oToggleInnerControlsSpy = this.spy(oSmartField, "_toggleInnerControlIfRequired");

		var oReturn = oSmartField.setConfiguration(oConfig);

		// assert
		assert.strictEqual(oDestroyInnerControls.callCount, 0, "inner controls should be created async after the meta model is loaded");
		assert.strictEqual(oToggleInnerControlsSpy.callCount, 0, "inner controls should be created async after the meta model is loaded");
		assert.ok(oSmartField.getConfiguration() === oConfig);
		assert.ok(oReturn === oSmartField);

		// cleanup
		oConfig.destroy();
		oSmartField.destroy();
	});

	QUnit.start();
});
