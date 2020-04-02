/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/generic/app/ApplicationController"
], function(ODataModel, ApplicationController) {
	"use strict";


	var oEntitySet =
		{
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
			"Common.SideEffects#D_CENTRAL_ADMIN_DATA": {
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
			"Common.SideEffects#D_ADMINISTRATIVE_DATA": {
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
			"Common.SideEffects#D_DURABLE_LOCK_CLEANUP_SUCC_SAVE": {
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
			"Common.SideEffects#D_DURABLE_LOCK_CLEANUP_DELETE": {
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
			"Common.SideEffects#D_DURABLE_LOCK_CLEANUP_CLEANUP": {
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
			"Common.SideEffects#D_DURABLE_LOCK_CLEANUP_FAIL_SAVE": {
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
			"Common.SideEffects#V_FOREIGN_KEY_CC": {
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
			"Common.SideEffects#V_FOREIGN_KEY_BP": {
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
			"Common.SideEffects#V_DURABLE_LOCK_REACQUIRE": {
				"EffectTypes": {
					"EnumMember": "ValidationMessage"
				}
			},
			"Common.SideEffects#V_CHECK_NEW_DRAFT_AUTHORITY": {
				"EffectTypes": {
					"EnumMember": "ValidationMessage"
				}
			}
		};

	var oEntityType =
		{
			"name": "SalesOrderType",
			"key": {
				"propertyRef": [{
					"name": "ActiveSalesOrderID"
				}, {
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
				}, {
					"name": "heading",
					"value": "Sales Order ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "EPM: Sales Order Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "SalesOrderDraftUUID",
				"type": "Edm.Guid",
				"nullable": "false",
				"extensions": [{
					"name": "label",
					"value": "Draft (Technical ID)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "ApprovalComment",
				"type": "Edm.String",
				"maxLength": "80",
				"extensions": [{
					"name": "label",
					"value": "Comment",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "COMMENT",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "Approved",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Approval Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "Data element for domain BOOLE: TRUE (='X') and FALSE (=' ')",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "BillingStatus",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Confirmation Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Sales Order Confirmation Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "EPM: Sales Order Confirmation Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
					}, {
						"ValueListProperty": {
							"String": "Description"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			}, {
				"name": "BusinessPartnerID",
				"type": "Edm.String",
				"maxLength": "10",
				"extensions": [{
					"name": "field-control",
					"value": "UxBusinessPartnerID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "label",
					"value": "Business Partner ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
					}, {
						"ValueListProperty": {
							"String": "CompanyName"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			}, {
				"name": "CreationDateTime",
				"type": "Edm.DateTimeOffset",
				"precision": "7",
				"extensions": [{
					"name": "label",
					"value": "Created At",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Delivery Time for Schedule Line",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "EPM: Schedule Line Delivery Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "CreationUserName",
				"type": "Edm.String",
				"maxLength": "12",
				"extensions": [{
					"name": "label",
					"value": "Created By",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
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
					}, {
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
				}, {
					"name": "heading",
					"value": "Crcy",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "Currency Key",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
					}, {
						"ValueListProperty": {
							"String": "CurrencyName"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			}, {
				"name": "DeliveryStatus",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Ordering Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Sales Order Ordering Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "EPM: Sales Order Ordering Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
					}, {
						"ValueListProperty": {
							"String": "Description"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			}, {
				"name": "DraftAdministrativeDataUUID",
				"type": "Edm.Guid",
				"extensions": [{
					"name": "label",
					"value": "Draft (Technical ID)",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "GrossAmount",
				"type": "Edm.Decimal",
				"precision": "16",
				"scale": "3",
				"extensions": [{
					"name": "unit",
					"value": "CurrencyCode",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "label",
					"value": "Gross Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Total Gross Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "IsActiveEntity",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Is Active Entity",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Is active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "Draft - Indicator - Is active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "HasActiveEntity",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Has Active Entity",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Has active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "Draft - Indicator - Has active document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "HasDraftEntity",
				"type": "Edm.Boolean",
				"extensions": [{
					"name": "label",
					"value": "Has Draft Entity",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Has draft document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "Draft - Indicator - Has draft document",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "LastChangedDateTime",
				"type": "Edm.DateTimeOffset",
				"precision": "7",
				"concurrencyMode": "Fixed",
				"extensions": [{
					"name": "label",
					"value": "Last Changed At",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Delivery Time for Schedule Line",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "EPM: Schedule Line Delivery Date",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "LastChangedUserName",
				"type": "Edm.String",
				"maxLength": "12",
				"extensions": [{
					"name": "label",
					"value": "Last Changed By",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "User Name",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "LifecycleStatus",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "text",
					"value": "LifecycleStatusCode/Description",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "label",
					"value": "Lifecycle Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Sales Order Lifecycle Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "EPM: Sales Order Lifecycle Status",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
					}, {
						"ValueListProperty": {
							"String": "Description"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}]
				}
			}, {
				"name": "NetAmount",
				"type": "Edm.Decimal",
				"precision": "16",
				"scale": "3",
				"extensions": [{
					"name": "unit",
					"value": "CurrencyCode",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "label",
					"value": "Net Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Total Net Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "OpportunityID",
				"type": "Edm.String",
				"maxLength": "35",
				"extensions": [{
					"name": "label",
					"value": "Opportunity ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "SalesOrderID",
				"type": "Edm.String",
				"maxLength": "10",
				"extensions": [{
					"name": "label",
					"value": "Sales Order ID",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "EPM: Sales Order Number",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "TaxAmount",
				"type": "Edm.Decimal",
				"precision": "16",
				"scale": "3",
				"extensions": [{
					"name": "unit",
					"value": "CurrencyCode",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "label",
					"value": "Tax Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Total Tax Amount",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "UxUpdatableEntity",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Updateable",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "UxDeletableEntity",
				"type": "Edm.String",
				"maxLength": "1",
				"extensions": [{
					"name": "label",
					"value": "Deletable",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
				"name": "UxBusinessPartnerID",
				"type": "Edm.Byte",
				"extensions": [{
					"name": "label",
					"value": "Business Partner Control",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "updatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "sortable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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


	var oImport =
		{
			"name": "SalesOrderPreparation",
			"returnType": "COLLE.SalesOrderType",
			"entitySet": "SalesOrder",
			"httpMethod": "POST",
			"parameter": [{
				"name": "ActiveSalesOrderID",
				"type": "Edm.String",
				"mode": "In",
				"maxLength": "10"
			}, {
				"name": "SalesOrderDraftUUID",
				"type": "Edm.Guid",
				"mode": "In",
				"documentation": [{
					"text": null,
					"extensions": [{
						"name": "Summary",
						"value": "UUID",
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}, {
						"name": "LongDescription",
						"value": null,
						"attributes": [],
						"children": [],
						"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
					}]
				}]
			}, {
				"name": "SideEffectsQualifier",
				"type": "Edm.String",
				"mode": "In",
				"nullable": "true"
			}],
			"extensions": [{
				"name": "action-for",
				"value": "COLLE.SalesOrderType",
				"namespace": "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:action-for": "COLLE.SalesOrderType"
		};

	var oView, bClientValidationError;

	QUnit.module("sap.ui.generic.app.ApplicationController", {
		beforeEach: function () {
			bClientValidationError = false;
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oModel.bUseBatch = true;
			this.oModel.getMetaModel = function () {
				return {
					getODataEntitySet: function () {
						return oEntitySet;
					},
					getODataEntityType: function () {
						return oEntityType;
					},
					getODataFunctionImport: function () {
						return oImport;
					}
				};
			};
			oView = {
				fFunc: null,
				getBindingContext: function () {
					return {
						getPath: function () {
							return "/MockPath";
						},
						getModel: function() {
							return this.oModel;
						}.bind(this)
					};
				}.bind(this),
				attachValidateFieldGroup: function (fFn) {
					this.fFunc = fFn;
				},
				getCustomData: function () {
					var oData = {
						getKey: function () {
							return "1";
						},
						getValue: function () {
							return JSON.parse("{\"name\":\"com.sap.vocabularies.Common.v1.SideEffects#V_MANDATORY_ATTRIBUTES\",\"originType\":\"entitySet\",\"originName\":\"SalesOrder\",\"context\":\"/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')\"}");
						}
					};

					return [
						oData
					];
				},
				getControlsByFieldGroupId: function () {
					var oControl = {
						setBusy: function () {

						},

						getParent: function () {
							return {
								checkClientError: function () {
									return bClientValidationError;
								}
							};
						}
					};

					return [oControl];
				},
				data: function (sKey) {
					if (sKey === "1") {
						var oID = JSON.parse("{\"name\":\"com.sap.vocabularies.Common.v1.SideEffects#V_MANDATORY_ATTRIBUTES\",\"originType\":\"entitySet\",\"originName\":\"SalesOrder\",\"context\":\"/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')\"}");
						oID.contextObject = this.getBindingContext().getModel().getContext();
						return oID;
					}
					return null;
				}
			};

			this.oController = new ApplicationController(this.oModel, oView);
		},
		afterEach: function () {
			this.oController.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.oController);
	});

	QUnit.test("getTransactionController", function (assert) {
		assert.ok(this.oController.getTransactionController());
	});

	QUnit.test("field group validation event successful", function (assert) {
		var done = assert.async();
		var bSubmit = false, aIDs, oID = JSON.parse("{\"name\":\"com.sap.vocabularies.Common.v1.SideEffects#V_MANDATORY_ATTRIBUTES\",\"originType\":\"entitySet\",\"originName\":\"SalesOrder\",\"context\":\"/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')\"}");

		this.oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};

			p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		this.oModel.submitChanges = function (p1) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		this.oModel.getContext = function () {
			return {
				getPath: function () {
					return "/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')";
				},
				getObject: function () {
					return null;
				},
				getModel: function() {
					return this.oModel;
				}.bind(this)
			};
		}.bind(this);

		this.oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		this.oModel.hasPendingChanges = function () {
			return true;
		};
		oID.contextObject = this.oModel.getContext();
		aIDs = [{
			uuid: "1",
			objid: oID
		}];
		this.oController._onValidateFieldGroup(aIDs, oView).then(function (oResult) {
			assert.ok(bSubmit);
			done();
		}, function (oResult) {
			assert.ok(false);
			done();
		});
	});

	QUnit.test("field group validation event successful (2)", function (assert) {
		var bFunction = false, oEvent = {
			mParameters: {
				fieldGroupIds: ["1"]
			}
		};

		this.oModel.hasPendingChanges = function () {
			return true;
		};
		this.oModel.getContext = function () {
			return {
				getPath: function () {
					return "/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')";
				},
				getObject: function () {
					return null;
				},
				getModel: function() {
					return this.oModel;
				}.bind(this)
			};
		}.bind(this);

		this.oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		this.oModel.callFunction = function (p1, p2) {
			bFunction = true;
			return p2.success({
				"mockresponse": true
			});
		};

		// Enhance oView with local getBindingContext
		oView.getBindingContext = function () {
			return {
				getPath: function () {
					return "/MockPath";
				},
				getModel: function() {
					return this.oModel;
				}.bind(this)
			};
		}.bind(this);

		oView.fFunc(oEvent);
		assert.ok(bFunction);
	});

	QUnit.test("field group validation event successful with global side effect", function (assert) {
		var done = assert.async();
		var oSideEffect, bSubmit = false, bRefresh = false, aIDs, oID = JSON.parse("{\"name\":\"com.sap.vocabularies.Common.v1.SideEffects#V_MANDATORY_ATTRIBUTES\",\"originType\":\"entitySet\",\"originName\":\"SalesOrder\",\"context\":\"/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')\"}");

		this.oModel.refresh = function () {
			bRefresh = true;
		};
		this.oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};

			p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		this.oModel.submitChanges = function (p1) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		this.oModel.getContext = function () {
			return {
				getPath: function () {
					return "/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')";
				},
				getObject: function () {
					return null;
				},
				getModel: function () {
					return this.oModel;
				}.bind(this)
			};
		}.bind(this);

		this.oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		this.oModel.hasPendingChanges = function () {
			return true;
		};

		// make the side effect global
		oSideEffect = this.oModel.getMetaModel().getODataEntitySet("SalesOrder")["com.sap.vocabularies.Common.v1.SideEffects#V_MANDATORY_ATTRIBUTES"];
		oSideEffect.TargetProperties = [];

		oID.contextObject = this.oModel.getContext();
		aIDs = [{
			uuid: "1",
			objid: oID
		}];

		this.oController._onValidateFieldGroup(aIDs, oView).then(function (oResult) {
			assert.ok(bSubmit);
			assert.ok(bRefresh);
			done();
		}, function (oResult) {
			assert.ok(false);
			done();
		});
	});

	QUnit.test("field group validation event rejected", function (assert) {
		var oEvent = {
			mParameters: {
				fieldGroupIds: ["2"]
			}
		};

		oView.fFunc(oEvent);
		assert.ok(true);
	});

	QUnit.test("field group validation event fails because of client errors", function (assert) {
		bClientValidationError = true;
		var done = assert.async();
		var bSubmit = false, bNoFunction = true, aIDs, oID = JSON.parse("{\"name\":\"com.sap.vocabularies.Common.v1.SideEffects#V_MANDATORY_ATTRIBUTES\",\"originType\":\"entitySet\",\"originName\":\"SalesOrder\",\"context\":\"/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')\"}");

		this.oModel.callFunction = function (p1, p2) {
			bNoFunction = false;
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};

			p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		this.oModel.submitChanges = function (p1) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		this.oModel.getContext = function () {
			return {
				getPath: function () {
					return "/SalesOrder(ActiveSalesOrderID='500000026',SalesOrderDraftUUID=guid'00505691-2EC5-1EE4-BC92-BEE8299361FB')";
				},
				getObject: function () {
					return null;
				}
			};
		};
		this.oModel.hasPendingChanges = function () {
			return true;
		};

		aIDs = [{
			uuid: "1",
			objid: oID
		}];
		this.oController._onValidateFieldGroup(aIDs, oView).then(function (oResult) {
			assert.ok(bSubmit);
			assert.ok(bNoFunction);
			done();
		}, function (oResult) {
			assert.ok(false);
			done();
		});
	});

	QUnit.test("propertyChanged shall trigger submitChanges", function (assert) {
		var done = assert.async(), bSubmit = false;

		this.oModel.submitChanges = function (p1) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		this.oModel.hasPendingChanges = function () {
			return true;
		};

		this.oController.propertyChanged("mockProperty", null).then(function (oResult) {
			//assert.ok(oController._oGroupChanges["dummyID"]);
			assert.ok(bSubmit);
			done();
		}, function (oResult) {
			assert.ok(false);
			done();
		});
	});

	QUnit.test("invokeActions", function (assert) {
		var done = assert.async();
		var oController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.bUseBatch = true;
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.hasPendingChanges = function () {
			return true;
		};
		oModel.refresh = function () { };
		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};
			p2.success({
				"mockdata": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.createBindingContext = function (p1, p2, p3, p4) {
			return p4({
				"path": "/MockKey(1)"
			});
		};
		oModel.createKey = function () {
			return {};
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oController = new ApplicationController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.invokeActions("/MockEditAction", [oContext], { urlParameters: {} }).then(function (aResult) {
			assert.equal(aResult.length, 1, "One executed action should result in one context");
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("invokeActions with multiple contexts", function (assert) {
		var done = assert.async();
		var oController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.bUseBatch = true;
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.hasPendingChanges = function () {
			return true;
		};
		oModel.refresh = function () { };
		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};
			p2.success({
				"mockdata": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.createBindingContext = function (p1, p2, p3, p4) {
			return p4({
				"path": "/MockKey(1)"
			});
		};
		oModel.createKey = function () {
			return {};
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oController = new ApplicationController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.invokeActions("/MockEditAction", [oContext, oContext], { urlParameters: {} }).then(function (aResult) {
			assert.equal(aResult.length, 2, "Two executed actions should result in two contexts");
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("invokeActions with multiple contexts - all-or-nothing", function (assert) {
		var done = assert.async();
		var oController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.bUseBatch = true;
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": [],
				"allOrNothing": true
			})
		});
		oModel.hasPendingChanges = function () {
			return true;
		};
		oModel.refresh = function () { };
		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};
			p2.success({
				"mockdata": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.createBindingContext = function (p1, p2, p3, p4) {
			return p4({
				"path": "/MockKey(1)"
			});
		};
		oModel.createKey = function () {
			return {};
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oController = new ApplicationController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.invokeActions("/MockEditAction", [oContext, oContext], { urlParameters: {} }).then(function (aResult) {
			assert.equal(aResult.length, 2, "Two executed actions should result in two contexts");
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("invokeActions fails", function (assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.bUseBatch = true;
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.hasPendingChanges = function () {
			return true;
		};
		oModel.refresh = function () { };
		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};
			p2.error({
				"message": "MockError",
				"mockdata": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.error({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.createBindingContext = function (p1, p2, p3, p4) {
			return p4({
				"path": "/MockKey(1)"
			});
		};
		oModel.createKey = function () {
			return {};
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oController = new ApplicationController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.invokeActions("/MockEditAction", [oContext], { urlParameters: {} }).then(function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function (aResult) {
			assert.equal(aResult.length, 1, "One action should result in one error context");
			assert.ok(bSubmit);
			oController.destroy();
			done();
		});
	});

	QUnit.test("invokeActions returned promise resolves with correct response order", function (assert) {
		var done = assert.async();
		var oController, oModel, oContext1, oContext2, oContext3, oContext4;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.refresh = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };

		oController = new ApplicationController(oModel);
		oController._getChangeSetFunc = function () {
			return function () { return "Test"; };
		};
		oController.triggerSubmitChanges = function () {
			return new Promise(function (resolve, reject) {
				resolve({ promise: "triggerSubmitChanges" });
			});
		};
		oController._invokeAction = function (sFunctionName, oContext, changeSet) {
			return new Promise(function (resolve, reject) {
				setTimeout(function () {
					resolve(oContext);
				}, oContext.resolveTime);
			});
		};

		oContext1 = { name: "Action1", resolveTime: 1000 };
		oContext2 = { name: "Action2", resolveTime: 500 };
		oContext3 = { name: "Action3", resolveTime: 600 };
		oContext4 = { name: "Action4", resolveTime: 100 };

		oController.invokeActions("Action", [oContext1, oContext2, oContext3, oContext4]).then(function (oResult) {
			assert.equal(oResult[0].actionContext, oContext1, "Context1 on correct position");
			assert.equal(oResult[1].actionContext, oContext2, "Context2 on correct position");
			assert.equal(oResult[2].actionContext, oContext3, "Context3 on correct position");
			assert.equal(oResult[3].actionContext, oContext4, "Context4 on correct position");
			oController.destroy();
			done();
		}, function (aResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("invokeActions some resolve, some reject", function (assert) {
		var done = assert.async();
		var oController, oModel, oContext1, oContext2, oContext3, oContext4;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.refresh = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };

		oController = new ApplicationController(oModel);
		oController._getChangeSetFunc = function () {
			return function () { return "Test"; };
		};
		oController.triggerSubmitChanges = function () {
			return new Promise(function (resolve, reject) {
				resolve({ promise: "triggerSubmitChanges" });
			});
		};
		oController._invokeAction = function (sFunctionName, oContext, changeSet) {
			return new Promise(function (resolve, reject) {
				if (oContext.resolve) {
					resolve(oContext);
				} else {
					reject(oContext);
				}
			});
		};

		oContext1 = { name: "Action1", resolve: false };
		oContext2 = { name: "Action2", resolve: true };
		oContext3 = { name: "Action3", resolve: false };
		oContext4 = { name: "Action4", resolve: true };

		oController.invokeActions("Action", [oContext1, oContext2, oContext3, oContext4]).then(function (oResult) {
			assert.ok(oResult[0].error, "Context1 not successfull");
			assert.ok(!oResult[1].error, "Context2 successfull");
			assert.ok(oResult[2].error, "Context3 not successfull");
			assert.ok(!oResult[3].error, "Context4 successfull");
			oController.destroy();
			done();
		}, function (aResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("invokeActions all reject", function (assert) {
		var done = assert.async();
		var oController, oModel, oContext1, oContext2, oContext3, oContext4;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.refresh = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };

		oController = new ApplicationController(oModel);
		oController._getChangeSetFunc = function () {
			return function () { return "Test"; };
		};
		oController.triggerSubmitChanges = function () {
			return new Promise(function (resolve, reject) {
				reject({ promise: "triggerSubmitChanges" });
			});
		};
		oController._invokeAction = function (sFunctionName, oContext, changeSet) {
			return new Promise(function (resolve, reject) {
				if (oContext.resolve) {
					resolve(oContext);
				} else {
					reject(oContext);
				}
			});
		};

		oContext1 = { name: "Action1", resolve: false };
		oContext2 = { name: "Action2", resolve: false };
		oContext3 = { name: "Action3", resolve: false };
		oContext4 = { name: "Action4", resolve: false };

		oController.invokeActions("Action", [oContext1, oContext2, oContext3, oContext4]).then(function (oResult) {
			assert.ok(false, "invokeActions should not resolve");
			oController.destroy();
			done();
		}, function (aResult) {
			assert.ok(aResult[0].error, "Context1 not successfull");
			assert.ok(aResult[1].error, "Context2 not successfull");
			assert.ok(aResult[2].error, "Context3 not successfull");
			assert.ok(aResult[3].error, "Context4 not successfull");
			oController.destroy();
			done();
		});
	});

	QUnit.test("invokeActions without context", function (assert) {
		var done = assert.async();
		var oController, oModel;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.refresh = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});

		oModel.setDefaultBindingMode = function () { };
		oModel.setRefreshAfterChange = function () { };
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.createEntry = function (p1, p2) { };

		oController = new ApplicationController(oModel);
		oController._getChangeSetFunc = function () {
			return function () { return "Test"; };
		};
		oController.triggerSubmitChanges = function () {
			return new Promise(function (resolve, reject) {
				resolve({});
			});
		};
		oController._invokeAction = function (sFunctionName, oContext, changeSet) {
			return new Promise(function (resolve, reject) {
				resolve({});
			});
		};

		oController.invokeActions("Action", []).then(function (oResult) {
			assert.ok(true, "invokeActions should resolve");
			oController.destroy();
			done();
		}
		);
	});

	QUnit.test("Shall be destructible", function (assert) {
		this.oController.destroy();
		assert.ok(this.oController);
	});
});