/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/SideEffectUtil"
	],
	function(
			SideEffectUtil
	) {
	"use strict";

	var oEntitySet = {
			"name": "SalesOrder",
			"entityType": "COLLE.SalesOrderType",
			"extensions": [
				{
					"name": "searchable",
					"value": "true",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "content-version",
					"value": "1",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}
			],
			"sap:searchable": "true",
			"sap:content-version": "1",
			"com.sap.vocabularies.Common.v1.DraftRoot": {
				"ActivationAction": {
					"String": "COLLE.COLLE_Entities/SalesOrderActivation"
				},
				"EditAction": {
					"String": "COLLE.COLLE_Entities/SalesOrderEdit"
				},
				"ValidationFunction": {
					"String": "COLLE.COLLE_Entities/SalesOrderValidation"
				},
				"PreparationAction": {
					"String": "COLLE.COLLE_Entities/SalesOrderPreparation"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#D_CENTRAL_ADMIN_DATA": {
				"SourceEntities": {
					"Collection": [
						{
							"NavigationPropertyPath": "Item/ScheduleLine"
						}, {
							"NavigationPropertyPath": "Item"
						}, {
							"NavigationPropertyPath": ""
						}
					]
				},
				"EffectTypes": {
					"EnumMember": "ValueChange"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#D_ADMINISTRATIVE_DATA": {
				"SourceEntities": {
					"Collection": [
						{
							"NavigationPropertyPath": "Item/ScheduleLine"
						}, {
							"NavigationPropertyPath": "Item"
						}, {
							"NavigationPropertyPath": ""
						}
					]
				},
				"EffectTypes": {
					"EnumMember": "ValueChange"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#D_DURABLE_LOCK_CLEANUP_SUCC_SAVE": {
				"SourceEntities": {
					"Collection": [
						{
							"NavigationPropertyPath": "Item/ScheduleLine"
						}, {
							"NavigationPropertyPath": "Item"
						}, {
							"NavigationPropertyPath": ""
						}
					]
				},
				"EffectTypes": {
					"EnumMember": "ValueChange"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#D_DURABLE_LOCK_CLEANUP_DELETE": {
				"SourceEntities": {
					"Collection": [
						{
							"NavigationPropertyPath": ""
						}
					]
				},
				"EffectTypes": {
					"EnumMember": "ValueChange"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#D_DURABLE_LOCK_CLEANUP_CLEANUP": {
				"SourceEntities": {
					"Collection": [
						{
							"NavigationPropertyPath": "Item/ScheduleLine"
						}, {
							"NavigationPropertyPath": "Item"
						}, {
							"NavigationPropertyPath": ""
						}
					]
				},
				"EffectTypes": {
					"EnumMember": "ValueChange"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#D_DURABLE_LOCK_CLEANUP_FAIL_SAVE": {
				"SourceEntities": {
					"Collection": [
						{
							"NavigationPropertyPath": "Item/ScheduleLine"
						}, {
							"NavigationPropertyPath": "Item"
						}, {
							"NavigationPropertyPath": ""
						}
					]
				},
				"EffectTypes": {
					"EnumMember": "ValueChange"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#V_FOREIGN_KEY_CC": {
				"SourceProperties": [
					{
						"PropertyPath": "CurrencyCode"
					}
				],
				"TargetProperties": [
					{
						"PropertyPath": "CurrencyCode"
					}
				],
				"EffectTypes": {
					"EnumMember": "ValidationMessage"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#V_MANDATORY_ATTRIBUTES": {
				"SourceProperties": [
					{
						"PropertyPath": "TaxAmount"
					}, {
						"PropertyPath": "NetAmount"
					}, {
						"PropertyPath": "GrossAmount"
					}, {
						"PropertyPath": "CurrencyCode"
					}, {
						"PropertyPath": "BusinessPartnerID"
					}
				],
				"TargetProperties": [
					{
						"PropertyPath": "TaxAmount"
					}, {
						"PropertyPath": "NetAmount"
					}, {
						"PropertyPath": "GrossAmount"
					}, {
						"PropertyPath": "CurrencyCode"
					}, {
						"PropertyPath": "BusinessPartnerID"
					}
				],
				"EffectTypes": {
					"EnumMember": "ValidationMessage"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#V_FOREIGN_KEY_BP": {
				"SourceProperties": [
					{
						"PropertyPath": "BusinessPartnerID"
					}
				],
				"TargetProperties": [
					{
						"PropertyPath": "BusinessPartnerID"
					}
				],
				"EffectTypes": {
					"EnumMember": "ValidationMessage"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#V_DURABLE_LOCK_REACQUIRE": {
				"EffectTypes": {
					"EnumMember": "ValidationMessage"
				}
			},
			"com.sap.vocabularies.Common.v1.SideEffects#V_CHECK_NEW_DRAFT_AUTHORITY": {
				"EffectTypes": {
					"EnumMember": "ValidationMessage"
				}
			}
		};

	var oEntityType = {
			"name": "SalesOrderType",
			"key": {
				"propertyRef": [{
					"name": "ActiveSalesOrderID"
				},
				{
					"name": "SalesOrderDraftUUID"
				}]
			},
			"property": [{
				"name": "ActiveSalesOrderID",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "10",
				"extensions": [{
					"name": "label",
					"value": "Sales Order ID (Active Document)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Sales Order ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Sales Order Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Sales Order ID (Active Document)",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Sales Order ID (Active Document)"
				},
				"sap:heading": "Sales Order ID",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Sales Order ID"
				},
				"sap:quickinfo": "EPM: Sales Order Number",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Sales Order Number"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "SalesOrderDraftUUID",
				"type": "Edm.Guid",
				"nullable": "false",
				"extensions": [{
					"name": "label",
					"value": "Draft (Technical ID)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Draft (Technical ID)",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Draft (Technical ID)"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "ApprovalComment",
				"type": "Edm.String",
				"maxLength": "80",
				"extensions": [{
					"name": "label",
					"value": "Comment",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "COMMENT",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Comment",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Comment"
				},
				"sap:heading": "COMMENT",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "COMMENT"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "Approved",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Approval Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Data element for domain BOOLE: TRUE (='X') and FALSE (=' ')",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Approval Status",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Approval Status"
				},
				"sap:quickinfo": "Data element for domain BOOLE: TRUE (='X') and FALSE (=' ')",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Data element for domain BOOLE: TRUE (='X') and FALSE (=' ')"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "BillingStatus",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Confirmation Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Sales Order Confirmation Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Sales Order Confirmation Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "value-list",
					"value": "fixed-values",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Confirmation Status",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Confirmation Status"
				},
				"sap:heading": "Sales Order Confirmation Status",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Sales Order Confirmation Status"
				},
				"sap:quickinfo": "EPM: Sales Order Confirmation Status",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Sales Order Confirmation Status"
				},
				"sap:value-list": "fixed-values",
				"com.sap.vocabularies.Common.v1.ValueList": {
					"CollectionPath": {
						"String": "BillingStatus"
					},
					"SearchSupported": {
						"Bool": "true"
					},
					"Parameters": [{
						"LocalDataProperty": {
							"PropertyPath": "BillingStatus"
						},
						"ValueListProperty": {
							"String": "Status"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					},
					{
						"ValueListProperty": {
							"String": "Description"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			},
			{
				"name": "BusinessPartnerID",
				"type": "Edm.String",
				"maxLength": "10",
				"extensions": [{
					"name": "field-control",
					"value": "UxBusinessPartnerID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Business Partner ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Business Partner ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:field-control": "UxBusinessPartnerID",
				"com.sap.vocabularies.Common.v1.FieldControl": {
					"Path": "UxBusinessPartnerID"
				},
				"sap:label": "Business Partner ID",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Business Partner ID"
				},
				"sap:quickinfo": "EPM: Business Partner ID",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Business Partner ID"
				},
				"com.sap.vocabularies.Common.v1.ValueList": {
					"CollectionPath": {
						"String": "BusinessPartner"
					},
					"SearchSupported": {
						"Bool": "true"
					},
					"Parameters": [{
						"LocalDataProperty": {
							"PropertyPath": "BusinessPartnerID"
						},
						"ValueListProperty": {
							"String": "BusinessPartnerID"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					},
					{
						"ValueListProperty": {
							"String": "CompanyName"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			},
			{
				"name": "CreationDateTime",
				"type": "Edm.DateTimeOffset",
				"precision": "7",
				"extensions": [{
					"name": "label",
					"value": "Created At",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Delivery Time for Schedule Line",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Schedule Line Delivery Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Created At",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Created At"
				},
				"sap:heading": "Delivery Time for Schedule Line",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Delivery Time for Schedule Line"
				},
				"sap:quickinfo": "EPM: Schedule Line Delivery Date",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Schedule Line Delivery Date"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "CreationUserName",
				"type": "Edm.String",
				"maxLength": "12",
				"extensions": [{
					"name": "label",
					"value": "Created By",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Created By",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Created By"
				},
				"sap:heading": "User Name",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "User Name"
				},
				"sap:quickinfo": "User Name",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "User Name"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "CurrencyCode",
				"type": "Edm.String",
				"maxLength": "5",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "Key for the currency in which the amounts are managed in the system.",
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
				"sap:semantics": "currency-code",
				"com.sap.vocabularies.Common.v1.ValueList": {
					"CollectionPath": {
						"String": "Currency"
					},
					"SearchSupported": {
						"Bool": "true"
					},
					"Parameters": [{
						"LocalDataProperty": {
							"PropertyPath": "CurrencyCode"
						},
						"ValueListProperty": {
							"String": "Currency"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					},
					{
						"ValueListProperty": {
							"String": "CurrencyName"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			},
			{
				"name": "DeliveryStatus",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Ordering Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Sales Order Ordering Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Sales Order Ordering Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "value-list",
					"value": "fixed-values",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Ordering Status",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Ordering Status"
				},
				"sap:heading": "Sales Order Ordering Status",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Sales Order Ordering Status"
				},
				"sap:quickinfo": "EPM: Sales Order Ordering Status",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Sales Order Ordering Status"
				},
				"sap:value-list": "fixed-values",
				"com.sap.vocabularies.Common.v1.ValueList": {
					"CollectionPath": {
						"String": "DeliveryStatus"
					},
					"SearchSupported": {
						"Bool": "true"
					},
					"Parameters": [{
						"LocalDataProperty": {
							"PropertyPath": "DeliveryStatus"
						},
						"ValueListProperty": {
							"String": "Status"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					},
					{
						"ValueListProperty": {
							"String": "Description"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			},
			{
				"name": "DraftAdministrativeDataUUID",
				"type": "Edm.Guid",
				"extensions": [{
					"name": "label",
					"value": "Draft (Technical ID)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Draft (Technical ID)",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Draft (Technical ID)"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "GrossAmount",
				"type": "Edm.Decimal",
				"precision": "16",
				"scale": "3",
				"extensions": [{
					"name": "unit",
					"value": "CurrencyCode",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Gross Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Total Gross Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Total Gross Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:unit": "CurrencyCode",
				"sap:label": "Gross Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Gross Amount"
				},
				"sap:heading": "Total Gross Amount",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Total Gross Amount"
				},
				"sap:quickinfo": "EPM: Total Gross Amount",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Total Gross Amount"
				},
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CurrencyCode"
				}
			},
			{
				"name": "IsActiveEntity",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Is Active Entity",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Is active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Draft - Indicator - Is active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Is Active Entity",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Is Active Entity"
				},
				"sap:heading": "Is active document",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Is active document"
				},
				"sap:quickinfo": "Draft - Indicator - Is active document",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Draft - Indicator - Is active document"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "HasActiveEntity",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Has Active Entity",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Has active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Draft - Indicator - Has active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Has Active Entity",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Has Active Entity"
				},
				"sap:heading": "Has active document",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Has active document"
				},
				"sap:quickinfo": "Draft - Indicator - Has active document",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Draft - Indicator - Has active document"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "HasDraftEntity",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Has Draft Entity",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Has draft document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "Draft - Indicator - Has draft document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Has Draft Entity",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Has Draft Entity"
				},
				"sap:heading": "Has draft document",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Has draft document"
				},
				"sap:quickinfo": "Draft - Indicator - Has draft document",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "Draft - Indicator - Has draft document"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "LastChangedDateTime",
				"type": "Edm.DateTimeOffset",
				"precision": "7",
				"concurrencyMode": "Fixed",
				"extensions": [{
					"name": "label",
					"value": "Last Changed At",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Delivery Time for Schedule Line",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Schedule Line Delivery Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Last Changed At",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Last Changed At"
				},
				"sap:heading": "Delivery Time for Schedule Line",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Delivery Time for Schedule Line"
				},
				"sap:quickinfo": "EPM: Schedule Line Delivery Date",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Schedule Line Delivery Date"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "LastChangedUserName",
				"type": "Edm.String",
				"maxLength": "12",
				"extensions": [{
					"name": "label",
					"value": "Last Changed By",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Last Changed By",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Last Changed By"
				},
				"sap:heading": "User Name",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "User Name"
				},
				"sap:quickinfo": "User Name",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "User Name"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "LifecycleStatus",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "text",
					"value": "LifecycleStatusCode/Description",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Lifecycle Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Sales Order Lifecycle Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Sales Order Lifecycle Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "value-list",
					"value": "fixed-values",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:text": "LifecycleStatusCode/Description",
				"com.sap.vocabularies.Common.v1.Text": {
					"Path": "LifecycleStatusCode/Description"
				},
				"sap:label": "Lifecycle Status",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Lifecycle Status"
				},
				"sap:heading": "Sales Order Lifecycle Status",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Sales Order Lifecycle Status"
				},
				"sap:quickinfo": "EPM: Sales Order Lifecycle Status",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Sales Order Lifecycle Status"
				},
				"sap:value-list": "fixed-values",
				"com.sap.vocabularies.Common.v1.ValueList": {
					"CollectionPath": {
						"String": "LifecycleStatus"
					},
					"SearchSupported": {
						"Bool": "true"
					},
					"Parameters": [{
						"LocalDataProperty": {
							"PropertyPath": "LifecycleStatus"
						},
						"ValueListProperty": {
							"String": "Status"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					},
					{
						"ValueListProperty": {
							"String": "Description"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			},
			{
				"name": "NetAmount",
				"type": "Edm.Decimal",
				"precision": "16",
				"scale": "3",
				"extensions": [{
					"name": "unit",
					"value": "CurrencyCode",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Net Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Total Net Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Total Net Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:unit": "CurrencyCode",
				"sap:label": "Net Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Net Amount"
				},
				"sap:heading": "Total Net Amount",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Total Net Amount"
				},
				"sap:quickinfo": "EPM: Total Net Amount",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Total Net Amount"
				},
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CurrencyCode"
				}
			},
			{
				"name": "OpportunityID",
				"type": "Edm.String",
				"maxLength": "35",
				"extensions": [{
					"name": "label",
					"value": "Opportunity ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Opportunity ID for SoD IDoc processing",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Opportunity ID",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Opportunity ID"
				},
				"sap:quickinfo": "EPM: Opportunity ID for SoD IDoc processing",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Opportunity ID for SoD IDoc processing"
				}
			},
			{
				"name": "SalesOrderID",
				"type": "Edm.String",
				"maxLength": "10",
				"extensions": [{
					"name": "label",
					"value": "Sales Order ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Sales Order Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:label": "Sales Order ID",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Sales Order ID"
				},
				"sap:quickinfo": "EPM: Sales Order Number",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Sales Order Number"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "TaxAmount",
				"type": "Edm.Decimal",
				"precision": "16",
				"scale": "3",
				"extensions": [{
					"name": "unit",
					"value": "CurrencyCode",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "label",
					"value": "Tax Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Total Tax Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "EPM: Total Tax Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:unit": "CurrencyCode",
				"sap:label": "Tax Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Tax Amount"
				},
				"sap:heading": "Total Tax Amount",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Total Tax Amount"
				},
				"sap:quickinfo": "EPM: Total Tax Amount",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "EPM: Total Tax Amount"
				},
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CurrencyCode"
				}
			},
			{
				"name": "UxUpdatableEntity",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Updateable",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
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
				"sap:label": "Updateable",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Updateable"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "UxDeletableEntity",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Deletable",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
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
				"sap:label": "Deletable",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Deletable"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			},
			{
				"name": "UxBusinessPartnerID",
				"type": "Edm.Byte",
				"extensions": [{
					"name": "label",
					"value": "Business Partner Control",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
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
				"sap:label": "Business Partner Control",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Business Partner Control"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			}],
			"navigationProperty": [{
				"name": "BillingStatusCode",
				"relationship": "COLLE.SalesOrderToBillingStatusType",
				"fromRole": "FromRole_SalesOrderToBillingStatusType",
				"toRole": "ToRole_SalesOrderToBillingStatusType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "DeliveryStatusCode",
				"relationship": "COLLE.SalesOrderToDeliveryStatusType",
				"fromRole": "FromRole_SalesOrderToDeliveryStatusType",
				"toRole": "ToRole_SalesOrderToDeliveryStatusType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "LifecycleStatusCode",
				"relationship": "COLLE.SalesOrderToLifecycleStatusType",
				"fromRole": "FromRole_SalesOrderToLifecycleStatusType",
				"toRole": "ToRole_SalesOrderToLifecycleStatusType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "DraftAdministrativeData",
				"relationship": "COLLE.SalesOrderToDraftAdministrativeDataType",
				"fromRole": "FromRole_SalesOrderToDraftAdministrativeDataType",
				"toRole": "ToRole_SalesOrderToDraftAdministrativeDataType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "BusinessPartner",
				"relationship": "COLLE.SalesOrderToBusinessPartnerType",
				"fromRole": "FromRole_SalesOrderToBusinessPartnerType",
				"toRole": "ToRole_SalesOrderToBusinessPartnerType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "Currency",
				"relationship": "COLLE.SalesOrderToCurrencyType",
				"fromRole": "FromRole_SalesOrderToCurrencyType",
				"toRole": "ToRole_SalesOrderToCurrencyType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "Item",
				"relationship": "COLLE.SalesOrderToItemType",
				"fromRole": "FromRole_SalesOrderToItemType",
				"toRole": "ToRole_SalesOrderToItemType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "Ux",
				"relationship": "COLLE.SalesOrderToUxType",
				"fromRole": "FromRole_SalesOrderToUxType",
				"toRole": "ToRole_SalesOrderToUxType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			},
			{
				"name": "SiblingEntity",
				"relationship": "COLLE.SalesOrderToSiblingEntityType",
				"fromRole": "FromRole_SalesOrderToSiblingEntityType",
				"toRole": "ToRole_SalesOrderToSiblingEntityType",
				"extensions": [{
					"name": "filterable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}],
				"sap:filterable": "false"
			}],
			"extensions": [{
				"name": "label",
				"value": "Sales Order",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			},
			{
				"name": "content-version",
				"value": "1",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:label": "Sales Order",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Sales Order"
			},
			"sap:content-version": "1",
			"namespace": "COLLE",
			"$path": "/dataServices/schema/0/entityType/9",
			"com.sap.vocabularies.Common.v1.SemanticKey": [{
				"PropertyPath": "ActiveSalesOrderID"
			}]
	};

		var oComplexType = {
			"name": "ValidationResult",
			"property": [{
				"name": "IsValid",
				"type": "Edm.Boolean",
				"nullable": "false",
				"extensions": [{
					"name": "label",
					"value": "TRUE",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "heading",
					"value": "Flag",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
					"name": "quickinfo",
					"value": "General Flag",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				},
				{
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
				"sap:label": "TRUE",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "TRUE"
				},
				"sap:heading": "Flag",
				"com.sap.vocabularies.Common.v1.Heading": {
					"String": "Flag"
				},
				"sap:quickinfo": "General Flag",
				"com.sap.vocabularies.Common.v1.QuickInfo": {
					"String": "General Flag"
				},
				"sap:creatable": "false",
				"sap:updatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false",
				"Org.OData.Core.V1.Computed": {
					"Bool": "true"
				}
			}],
			"namespace": "COLLE",
			"$path": "/dataServices/schema/0/complexType/0"
		};

		QUnit.module("sap.ui.comp.odata.SideEffects", {
			beforeEach: function() {
				this.oSideEffects = new SideEffectUtil({
					getBindingContext: function() {
						return {
							getPath: function() {
								return "/Dummy(1)";
							}
						};
					}
				});
			},
			afterEach: function() {
				this.oSideEffects.destroy();
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oSideEffects);
		});

		QUnit.test("getFieldGroupIDs", function(assert) {
			var oMetaData, oView, aIDs;

			oMetaData = {
				entitySet: oEntitySet,
				entityType: oEntityType,
				property: {

				},
				path: "TaxAmount"
			};

			oView = {
				getCustomData: function() {
					return [
						{
							getKey: function() {
								return "dummyKey";
							},
							getValue: function() {
								return "dummyValue";
							}
						}
					];
				},
				data: function(sKey) {
					if (sKey === "dummyKey") {
						return "dummyValue";
					}

					return null;
				},
				addCustomData: function() {}
			};

			aIDs = this.oSideEffects.getFieldGroupIDs(oMetaData, oView);
			assert.ok(aIDs[0]);

			oMetaData.entitySet = {};
			oMetaData.entityType = oEntitySet;
			aIDs = this.oSideEffects.getFieldGroupIDs(oMetaData, oView);
			assert.ok(aIDs[0]);

			oMetaData.entitySet = {};
			oMetaData.entityType = oEntityType;
			aIDs = this.oSideEffects.getFieldGroupIDs(oMetaData, oView);
			assert.ok(!aIDs);
		});

		QUnit.test("getFieldGroupID for complex type", function(assert) {
			var oMetaData, oView, aIDs;

			oMetaData = {
				entitySet: {},
				entityType: {},
				property: {
					property: {},

					parents: [oEntitySet],
					complex: true,
					typePath: "TaxAmount"
				},
				path: "TaxAmount"
			};

			oView = {
				getCustomData: function() {
					return [
						{
							getKey: function() {
								return "dummyKey";
							},
							getValue: function() {
								return "dummyValue";
							}
						}
					];
				},
				data: function() {
					return "dummyValue";
				},
				addCustomData: function() {}
			};

			aIDs = this.oSideEffects.getFieldGroupIDs(oMetaData, oView);
			assert.ok(!aIDs);
		});

		QUnit.test("_toTypePath", function(assert) {
			var sPath = this.oSideEffects._toTypePath("Dummy/IsValid", oComplexType);
			assert.equal(sPath, "ValidationResult/IsValid");
		});

		QUnit.test("createUUID", function(assert) {
			var sUUID = this.oSideEffects.createUUID();
			assert.ok(sUUID);
		});

		QUnit.test("Shall be destructible", function(assert) {
			this.oSideEffects.destroy();
			assert.ok(this.oSideEffects);
		});

		QUnit.start();

});