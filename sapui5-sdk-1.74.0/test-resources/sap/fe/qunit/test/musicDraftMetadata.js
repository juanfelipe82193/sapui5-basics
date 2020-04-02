sap.ui.define([], function() {
	"use strict";
	return {
		"$Version": "4.0",
		"$Reference": {
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_UI',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["com.sap.vocabularies.UI.v1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_COMMUNICATION',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["com.sap.vocabularies.Communication.v1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_COMMON',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["com.sap.vocabularies.Common.v1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_MEASURES',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Measures.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_CORE',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Core.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_CAPABILITIES',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Capabilities.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_AGGREGATION',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Aggregation.V1."]
			},
			"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_VALIDATION',Version='0001',SAP__Origin='LOCAL')/$value": {
				"$Include": ["Org.OData.Validation.V1."]
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.": {
			"$kind": "Schema",
			"$Annotations": {
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/PersonUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "Full Name",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "_Person/FormattedName"
					},
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/FromYear": {
					"@com.sap.vocabularies.Common.v1.Label": "From Year",
					"@com.sap.vocabularies.Common.v1.IsDigitSequence": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Year",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Year"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/ToYear": {
					"@com.sap.vocabularies.Common.v1.Label": "To Year",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$Path": "__FieldControl/ToYear"
					},
					"@com.sap.vocabularies.Common.v1.IsDigitSequence": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Year",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Year"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/HasDraftEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has Draft",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has draft document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/ActiveUUID": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID serving as key (parent key, root key)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/DraftEntityCreationDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/DraftEntityLastChangeDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/HasActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/IsActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Is active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Is active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/__FieldControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/__OperationControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container/AssignedPersons": {
					"@com.sap.vocabularies.Common.v1.DraftNode": {
						"ValidationFunction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ValidationFunction",
						"PreparationAction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PreparationAction"
					},
					"@com.sap.vocabularies.Common.v1.DraftActivationVia": ["SAP__self.Container/Artists"],
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.FilterRestrictions": {
						"NonFilterableProperties": [
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.SortRestrictions": {
						"NonSortableProperties": [
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Person Assignment",
					"@com.sap.vocabularies.UI.v1.HeaderInfo": {
						"TypeName": "Person Assignment",
						"TypeNamePlural": "Person Assignments",
						"Title": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "_Person/FormattedName"
							}
						}
					},
					"@com.sap.vocabularies.Common.v1.Messages": {
						"$Path": "SAP__Messages"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType/PersonUUID": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "FormattedName"
					},
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID-Based Model: Person"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container/Persons": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/ArtistUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "Artist UUID",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "Name"
					},
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/Name": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.Common.v1.Label": "Artist Name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Artist Name"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/CountryOfOrigin": {
					"@com.sap.vocabularies.Common.v1.Label": "Country of Origin",
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "CountryOfOrigin_Text"
					},
					"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
						"$EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
					},
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/i_aivs_countrycode/0001;ps='srvd-sadl_gw_appmusicdr_definition-0001';va='com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.et-c_mdbu_v4_artisttp.countryoforigin'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.Heading": "Country Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Country Code"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/CountryOfOrigin_Text": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Label": "Long name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Country Name (Max. 50 Characters)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/RegionOfOrigin": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "RegionOfOrigin_Text"
					},
					"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
						"$EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
					},
					"@com.sap.vocabularies.Common.v1.ValueListReferences": [
						"../../../../srvd_f4/sap/i_aivs_region/0001;ps='srvd-sadl_gw_appmusicdr_definition-0001';va='com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.et-c_mdbu_v4_artisttp.regionoforigin'/$metadata"
					],
					"@com.sap.vocabularies.Common.v1.Label": "Region Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Country Code"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/RegionOfOrigin_Text": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Label": "Description"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/FoundingYear": {
					"@com.sap.vocabularies.Common.v1.Label": "Year of Founding",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.IsDigitSequence": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Year",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Year"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/BreakupYear": {
					"@com.sap.vocabularies.Common.v1.Label": "Year of Break-up",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$Path": "__FieldControl/BreakupYear"
					},
					"@com.sap.vocabularies.Common.v1.IsDigitSequence": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Year",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Year"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/CreatedAt": {
					"@com.sap.vocabularies.Common.v1.Label": "Created At",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Long Form (YYYYMMDDhhmmssmmmuuun)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/CreatedBy": {
					"@com.sap.vocabularies.Common.v1.Label": "Created By",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "User Name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "User Name"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/ChangedAt": {
					"@com.sap.vocabularies.Common.v1.Label": "Changed At",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "Time Stamp",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UTC Time Stamp in Long Form (YYYYMMDDhhmmssmmmuuun)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/ChangedBy": {
					"@com.sap.vocabularies.Common.v1.Label": "Changed By",
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Heading": "User Name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "User Name"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/HasDraftEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has Draft",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has draft document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/ActiveUUID": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID serving as key (parent key, root key)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/DraftEntityCreationDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/DraftEntityLastChangeDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/HasActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/IsActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Is active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Is active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/__FieldControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/__OperationControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container/Artists": {
					"@com.sap.vocabularies.Common.v1.DraftRoot": {
						"ValidationFunction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ValidationFunction",
						"PreparationAction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PreparationAction",
						"EditAction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.EditAction",
						"ActivationAction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ActivationAction"
					},
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.FilterRestrictions": {
						"NonFilterableProperties": [
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.SortRestrictions": {
						"NonSortableProperties": [
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					},
					"@Org.OData.Core.V1.OptimisticConcurrency": {
						"$PropertyPath": "ChangedAt"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Artist",
					"@com.sap.vocabularies.Common.v1.SemanticKey": [
						{
							"$PropertyPath": "Name"
						}
					],
					"@com.sap.vocabularies.UI.v1.Facets": [
						{
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "General Information",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Identification"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Publications",
							"Target": {
								"$AnnotationPath": "_Publication/@com.sap.vocabularies.UI.v1.LineItem"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Assigned Persons",
							"Target": {
								"$AnnotationPath": "_PersAssign/@com.sap.vocabularies.UI.v1.LineItem"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.HeaderInfo": {
						"TypeName": "Artist",
						"TypeNamePlural": "Artists",
						"Title": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Name"
							}
						}
					},
					"@com.sap.vocabularies.UI.v1.Identification": [
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
							"Label": "Break Up",
							"Action":
								"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.com_sap_gateway_srvd_sadl_gw_appmusicdr_definition_v0001_Entities/BREAK_UP",
							"InvocationGrouping": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Name"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "CountryOfOrigin"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "RegionOfOrigin"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "FoundingYear"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "BreakupYear"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.LineItem": [
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Name"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
							"Label": "Break Up",
							"Action":
								"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.com_sap_gateway_srvd_sadl_gw_appmusicdr_definition_v0001_Entities/BREAK_UP",
							"InvocationGrouping": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "My Country",
							"Value": {
								"$Path": "CountryOfOrigin"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
							"Label": "Reunion",
							"Action":
								"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.com_sap_gateway_srvd_sadl_gw_appmusicdr_definition_v0001_Entities/REUNION",
							"InvocationGrouping": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "RegionOfOrigin"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "FoundingYear"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
							"Label": "Change Country",
							"Action":
								"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.com_sap_gateway_srvd_sadl_gw_appmusicdr_definition_v0001_Entities/MOVE_COUNTRY",
							"InvocationGrouping": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "BreakupYear"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.PresentationVariant": {
						"SortOrder": [
							{
								"$Type": "com.sap.vocabularies.Common.v1.SortOrderType",
								"Property": {
									"$PropertyPath": "Name"
								},
								"Descending": false
							}
						]
					},
					"@com.sap.vocabularies.UI.v1.SelectionFields": [
						{
							"$PropertyPath": "Name"
						},
						{
							"$PropertyPath": "ArtistUUID"
						},
						{
							"$PropertyPath": "CountryOfOrigin"
						},
						{
							"$PropertyPath": "RegionOfOrigin"
						},
						{
							"$PropertyPath": "FoundingYear"
						},
						{
							"$PropertyPath": "BreakupYear"
						},
						{
							"$PropertyPath": "_Publication/Name"
						}
					],
					"@com.sap.vocabularies.Common.v1.Messages": {
						"$Path": "SAP__Messages"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/TitleUUID": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "Name"
					},
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/Name": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Title Name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Title Name"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/Genre": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.IsDigitSequence": true,
					"@com.sap.vocabularies.Common.v1.Label": "Genre Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Genre Code"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/Length": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Title Length",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Title Length",
					"@Org.OData.Measures.V1.Unit": {
						"$Path": "LengthUnit"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/LengthUnit": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Label": "Length Unit",
					"@com.sap.vocabularies.Common.v1.Heading": "Title Length Unit",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Title Length Unit"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/Price": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$Path": "__FieldControl/Price"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Price",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Price",
					"@Org.OData.Measures.V1.ISOCurrency": {
						"$Path": "CurrencyCode"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/CurrencyCode": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.Common.v1.Label": "Currency Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Currency Code"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/HasDraftEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has Draft",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has draft document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/ActiveUUID": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID serving as key (parent key, root key)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/DraftEntityCreationDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/DraftEntityLastChangeDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/HasActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/IsActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Is active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Is active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/__FieldControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/__OperationControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container/Titles": {
					"@com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PreparationAction",
						"ValidationFunction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ValidationFunction"
					},
					"@com.sap.vocabularies.Common.v1.DraftActivationVia": ["SAP__self.Container/Artists"],
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.FilterRestrictions": {
						"NonFilterableProperties": [
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.SortRestrictions": {
						"NonSortableProperties": [
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType": {
					"@com.sap.vocabularies.Common.v1.Label": "Title",
					"@com.sap.vocabularies.Common.v1.SemanticKey": [
						{
							"$PropertyPath": "Name"
						}
					],
					"@com.sap.vocabularies.UI.v1.Facets": [
						{
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "General Information",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Identification"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Contributors",
							"Target": {
								"$AnnotationPath": "_Contribution/@com.sap.vocabularies.UI.v1.LineItem"
							}
						},
						{
							"Target@Org.OData.Core.V1.Messages": [
								{
									"code": "SY-530",
									"message": "An exception was raised",
									"severity": "error"
								}
							],
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Songtext",
							"Target": "UI.FACET$3$"
						}
					],
					"@com.sap.vocabularies.UI.v1.HeaderInfo": {
						"TypeName": "Title",
						"TypeNamePlural": "Title",
						"Title": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Name"
							}
						}
					},
					"@com.sap.vocabularies.UI.v1.Identification": [
						{
							"Action@Org.OData.Core.V1.Messages": [
								{
									"message": "ERROR: Mandatory Value for Action not found",
									"severity": "error"
								}
							],
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
							"Label": "Add contributor",
							"Action": "",
							"InvocationGrouping": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.Messages": {
						"$Path": "SAP__Messages"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/CreatedByUser": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "CreatedByUserDescription"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created By"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/LastChangedByUser": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "LastChangedByUserDescription"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed By"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/InProcessByUser": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "InProcessByUserDescription"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process By"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType": {
					"@com.sap.vocabularies.Common.v1.Label": "Draft Administration Data"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container/DraftAdministrativeData": {
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": true,
						"UnsupportedExpressions": {
							"$EnumMember":
								"Org.OData.Capabilities.V1.SearchExpressions/AND Org.OData.Capabilities.V1.SearchExpressions/OR Org.OData.Capabilities.V1.SearchExpressions/NOT Org.OData.Capabilities.V1.SearchExpressions/group Org.OData.Capabilities.V1.SearchExpressions/phrase"
						}
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/ContributorUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "Artist Name",
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/HasDraftEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has Draft",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has draft document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/ActiveUUID": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID serving as key (parent key, root key)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/DraftEntityCreationDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/DraftEntityLastChangeDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/HasActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/IsActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Is active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Is active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/__OperationControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container/ArtistContributions": {
					"@com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PreparationAction",
						"ValidationFunction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ValidationFunction"
					},
					"@com.sap.vocabularies.Common.v1.DraftActivationVia": ["SAP__self.Container/Artists"],
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.FilterRestrictions": {
						"NonFilterableProperties": [
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.SortRestrictions": {
						"NonSortableProperties": [
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.InsertRestrictions": {
						"Insertable": false
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType": {
					"@com.sap.vocabularies.Common.v1.Label": "Contribution",
					"@com.sap.vocabularies.UI.v1.HeaderInfo": {
						"TypeName": "Contribution",
						"TypeNamePlural": "Contributions",
						"Title": {
							"Value@Org.OData.Core.V1.Messages": [
								{
									"code": "SADL_GW_EXP_VOCAN-001",
									"message":
										"Property '_Contributor' of annotation 'UI.HEADERINFO.TITLE' in proj./view 'ArtistContributions' not found",
									"severity": "error"
								}
							],
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": ""
						}
					},
					"@com.sap.vocabularies.Common.v1.Messages": {
						"$Path": "SAP__Messages"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/PublicationUUID": {
					"@com.sap.vocabularies.Common.v1.Text": {
						"$Path": "Name"
					},
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/Type": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.IsDigitSequence": true,
					"@com.sap.vocabularies.Common.v1.Label": "Publication Type",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Publication Type"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/Name": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Publication",
					"@com.sap.vocabularies.Common.v1.Heading": "Publication Name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Publication Name"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/ReleaseDate": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$Path": "__FieldControl/ReleaseDate"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Date",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Date"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/Price": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Price",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Price",
					"@Org.OData.Measures.V1.ISOCurrency": {
						"$Path": "CurrencyCode"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/CurrencyCode": {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
					},
					"@com.sap.vocabularies.Common.v1.Label": "Currency Code",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Currency Code"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/HasDraftEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has Draft",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has draft document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/ActiveUUID": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Key",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID serving as key (parent key, root key)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/DraftEntityCreationDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/DraftEntityLastChangeDateTime": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/HasActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Has active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Has active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/IsActiveEntity": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Is active",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Draft - Indicator - Is active document"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/__EntityControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/__FieldControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/__OperationControl": {
					"@Org.OData.Core.V1.Computed": true,
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container/Publications": {
					"@com.sap.vocabularies.Common.v1.DraftNode": {
						"ValidationFunction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ValidationFunction",
						"PreparationAction": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PreparationAction"
					},
					"@com.sap.vocabularies.Common.v1.DraftActivationVia": ["SAP__self.Container/Artists"],
					"@Org.OData.Capabilities.V1.SearchRestrictions": {
						"Searchable": false
					},
					"@Org.OData.Capabilities.V1.FilterRestrictions": {
						"NonFilterableProperties": [
							{
								"$PropertyPath": "__EntityControl"
							},
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.SortRestrictions": {
						"NonSortableProperties": [
							{
								"$PropertyPath": "__EntityControl"
							},
							{
								"$PropertyPath": "__FieldControl"
							},
							{
								"$PropertyPath": "__OperationControl"
							}
						]
					},
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": {
							"$Path": "__EntityControl/Deletable"
						}
					},
					"@Org.OData.Capabilities.V1.UpdateRestrictions": {
						"QueryOptions": {
							"SelectSupported": true
						}
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType": {
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						"Deletable": true
					},
					"@com.sap.vocabularies.Common.v1.Label": "Publication",
					"@com.sap.vocabularies.Common.v1.SemanticKey": [
						{
							"$PropertyPath": "Name"
						}
					],
					"@com.sap.vocabularies.UI.v1.Facets": [
						{
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "General Information",
							"Target": {
								"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Identification"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"Label": "Titles",
							"Target": {
								"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.LineItem"
							}
						}
					],
					"@com.sap.vocabularies.UI.v1.HeaderInfo": {
						"TypeName": "Publication",
						"TypeNamePlural": "Publications",
						"Title": {
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Value": {
								"$Path": "Name"
							}
						}
					},
					"@com.sap.vocabularies.UI.v1.LineItem": [
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "column1",
							"Value": {
								"$Path": "Type"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
							"Label": "column2",
							"Value": {
								"$Path": "Type"
							}
						},
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataField",
							"Label": "column3",
							"Value": {
								"$Path": "Type"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.Messages": {
						"$Path": "SAP__Messages"
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container": {
					"@Org.OData.Aggregation.V1.ApplySupported": {
						"Transformations": ["aggregate", "groupby", "filter"],
						"Rollup": {
							"$EnumMember": "None"
						}
					}
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType/SAP__Messages": {
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/SAP__Messages": {
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/SAP__Messages": {
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/SAP__Messages": {
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/SAP__Messages": {
					"@com.sap.vocabularies.UI.v1.HiddenFilter": true,
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@Org.OData.Core.V1.Computed": true
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/DraftUUID": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft (Technical ID)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/DraftEntityType": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Entity ID"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/DraftAccessType": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Access Type"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/ProcessingStartDateTime": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process Since"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/DraftIsKeptByUser": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Is Kept By User"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/EnqueueStartDateTime": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Locked Since"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/DraftIsCreatedByMe": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created By Me"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/DraftIsLastChangedByMe": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed By Me"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/DraftIsProcessedByMe": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process By Me"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/CreatedByUserDescription": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created By (Description)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/LastChangedByUserDescription": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed By (Description)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/InProcessByUserDescription": {
					"@com.sap.vocabularies.UI.v1.Hidden": true,
					"@com.sap.vocabularies.Common.v1.Label": "Draft In Process By (Description)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/AssignmentUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType/ArtistUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType/LastName": {
					"@com.sap.vocabularies.Common.v1.Label": "Last Name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Last Name"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType/FirstName": {
					"@com.sap.vocabularies.Common.v1.Label": "First Name",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: First Name"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType/FormattedName": {
					"@com.sap.vocabularies.Common.v1.Label": "Text",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "Text, 255 Characters"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType/DateOfBirth": {
					"@com.sap.vocabularies.Common.v1.Label": "Date",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Date"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType/DateOfDeath": {
					"@com.sap.vocabularies.Common.v1.Label": "Date",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "AIS: Date"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/PublicationUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType/ArtistUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/CreationDateTime": {
					"@com.sap.vocabularies.Common.v1.Label": "Draft Created On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType/LastChangeDateTime": {
					"@com.sap.vocabularies.Common.v1.Label": "Draft Last Changed On"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/ContributionUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/TitleUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType/ArtistUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				},
				"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType/ArtistUUID": {
					"@com.sap.vocabularies.Common.v1.Label": "UUID",
					"@com.sap.vocabularies.Common.v1.QuickInfo": "UUID in X form (binary)"
				}
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType": {
			"$kind": "EntityType",
			"$Key": ["AssignmentUUID", "IsActiveEntity"],
			"AssignmentUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"ArtistUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"PersonUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"FromYear": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 4
			},
			"ToYear": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 4
			},
			"HasDraftEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"ActiveUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"DraftEntityCreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftEntityLastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"HasActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"IsActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"__FieldControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsControl"
			},
			"__OperationControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsOperationControl"
			},
			"SAP__Messages": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.SAP__Message",
				"$Nullable": false
			},
			"DraftAdministrativeData": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType"
			},
			"SiblingEntity": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType"
			},
			"_Artist": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
				"$Nullable": false
			},
			"_Person": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType"
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType": {
			"$kind": "EntityType",
			"$Key": ["PersonUUID"],
			"PersonUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"LastName": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"FirstName": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"FormattedName": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"DateOfBirth": {
				"$kind": "Property",
				"$Type": "Edm.Date"
			},
			"DateOfDeath": {
				"$kind": "Property",
				"$Type": "Edm.Date"
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType": {
			"$kind": "EntityType",
			"$Key": ["ArtistUUID", "IsActiveEntity"],
			"ArtistUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"Name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"CountryOfOrigin": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"CountryOfOrigin_Text": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 50
			},
			"RegionOfOrigin": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"RegionOfOrigin_Text": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 20
			},
			"FoundingYear": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 4
			},
			"BreakupYear": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 4
			},
			"CreatedAt": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"CreatedBy": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"ChangedAt": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"ChangedBy": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"HasDraftEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"ActiveUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"DraftEntityCreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftEntityLastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"HasActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"IsActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"__FieldControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsControl"
			},
			"__OperationControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsOperationControl"
			},
			"SAP__Messages": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.SAP__Message",
				"$Nullable": false
			},
			"DraftAdministrativeData": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType"
			},
			"SiblingEntity": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType"
			},
			"_PersAssign": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType"
			},
			"_Publication": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType"
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType": {
			"$kind": "EntityType",
			"$Key": ["TitleUUID", "IsActiveEntity"],
			"TitleUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"PublicationUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"ArtistUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"Name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"Genre": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"Length": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": 2
			},
			"LengthUnit": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"Price": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": "variable"
			},
			"CurrencyCode": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 5
			},
			"HasDraftEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"ActiveUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"DraftEntityCreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftEntityLastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"HasActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"IsActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"__FieldControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesControl"
			},
			"__OperationControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesOperationControl"
			},
			"SAP__Messages": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.SAP__Message",
				"$Nullable": false
			},
			"DraftAdministrativeData": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType"
			},
			"SiblingEntity": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType"
			},
			"_Artist": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
				"$Nullable": false
			},
			"_Contribution": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType"
			},
			"_Publication": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType": {
			"$kind": "EntityType",
			"$Key": ["DraftUUID"],
			"DraftUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"DraftEntityType": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 30
			},
			"CreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"CreatedByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"LastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"LastChangedByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"DraftAccessType": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 1
			},
			"ProcessingStartDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"InProcessByUser": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 12
			},
			"DraftIsKeptByUser": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"EnqueueStartDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftIsCreatedByMe": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"DraftIsLastChangedByMe": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"DraftIsProcessedByMe": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"CreatedByUserDescription": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 80
			},
			"LastChangedByUserDescription": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 80
			},
			"InProcessByUserDescription": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 80
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType": {
			"$kind": "EntityType",
			"$Key": ["ContributionUUID", "IsActiveEntity"],
			"ContributionUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"TitleUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"ArtistUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"ContributorUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"HasDraftEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"ActiveUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"DraftEntityCreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftEntityLastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"HasActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"IsActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"__OperationControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsOperationControl"
			},
			"SAP__Messages": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.SAP__Message",
				"$Nullable": false
			},
			"DraftAdministrativeData": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType"
			},
			"SiblingEntity": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType"
			},
			"_Artist": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
				"$Nullable": false
			},
			"_Title": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType": {
			"$kind": "EntityType",
			"$Key": ["PublicationUUID", "IsActiveEntity"],
			"PublicationUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"ArtistUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"Type": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 3
			},
			"Name": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 255
			},
			"ReleaseDate": {
				"$kind": "Property",
				"$Type": "Edm.Date"
			},
			"Price": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 13,
				"$Scale": "variable"
			},
			"CurrencyCode": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$MaxLength": 5
			},
			"HasDraftEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"ActiveUUID": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"DraftEntityCreationDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"DraftEntityLastChangeDateTime": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7
			},
			"HasActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"IsActiveEntity": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"__EntityControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.EntityControl"
			},
			"__FieldControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsControl"
			},
			"__OperationControl": {
				"$kind": "Property",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsOperationControl"
			},
			"SAP__Messages": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.SAP__Message",
				"$Nullable": false
			},
			"DraftAdministrativeData": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType"
			},
			"SiblingEntity": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType"
			},
			"_Artist": {
				"$kind": "NavigationProperty",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
				"$Nullable": false
			},
			"_Title": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType"
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsControl": {
			"$kind": "ComplexType",
			"ToYear": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsControl": {
			"$kind": "ComplexType",
			"BreakupYear": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesControl": {
			"$kind": "ComplexType",
			"Price": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsControl": {
			"$kind": "ComplexType",
			"ReleaseDate": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsOperationControl": {
			"$kind": "ComplexType",
			"PREPARATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"VALIDATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsOperationControl": {
			"$kind": "ComplexType",
			"ACTIVATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"BREAK_UP": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"EDIT": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"MOVE_COUNTRY": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"PREPARATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"REUNION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"VALIDATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesOperationControl": {
			"$kind": "ComplexType",
			"PREPARATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"VALIDATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsOperationControl": {
			"$kind": "ComplexType",
			"PREPARATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"VALIDATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsOperationControl": {
			"$kind": "ComplexType",
			"PREPARATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"VALIDATION": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.EntityControl": {
			"$kind": "ComplexType",
			"Deletable": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.SAP__Message": {
			"$kind": "ComplexType",
			"code": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"message": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"numericSeverity": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false
			},
			"target": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"transition": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			}
		},
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PreparationAction": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "SideEffectsQualifier",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType",
					"$Nullable": false
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "SideEffectsQualifier",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType",
					"$Nullable": false
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "SideEffectsQualifier",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType",
					"$Nullable": false
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "SideEffectsQualifier",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType",
					"$Nullable": false
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "SideEffectsQualifier",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.REUNION": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
						"$Name": "_it",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
						"$Name": "_it",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.MOVE_COUNTRY": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "Countryoforigin",
						"$Nullable": false,
						"$MaxLength": 3
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.EditAction": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
						"$Name": "_it",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Boolean",
						"$Name": "PreserveChanges",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ActivationAction": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "_it",
				"$Parameter": [
					{
						"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
						"$Name": "_it",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
					"$Nullable": false
				}
			}
		],
		"com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container": {
			"$kind": "EntityContainer",
			"ArtistContributions": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistContributionsType",
				"$NavigationPropertyBinding": {
					"DraftAdministrativeData": "DraftAdministrativeData",
					"SiblingEntity": "ArtistContributions",
					"_Artist": "Artists",
					"_Title": "Titles"
				}
			},
			"Artists": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.ArtistsType",
				"$NavigationPropertyBinding": {
					"DraftAdministrativeData": "DraftAdministrativeData",
					"SiblingEntity": "Artists",
					"_PersAssign": "AssignedPersons",
					"_Publication": "Publications"
				}
			},
			"AssignedPersons": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.AssignedPersonsType",
				"$NavigationPropertyBinding": {
					"DraftAdministrativeData": "DraftAdministrativeData",
					"SiblingEntity": "AssignedPersons",
					"_Artist": "Artists",
					"_Person": "Persons"
				}
			},
			"DraftAdministrativeData": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.DraftAdministrativeDataType"
			},
			"Persons": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PersonsType"
			},
			"Publications": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.PublicationsType",
				"$NavigationPropertyBinding": {
					"DraftAdministrativeData": "DraftAdministrativeData",
					"SiblingEntity": "Publications",
					"_Artist": "Artists",
					"_Title": "Titles"
				}
			},
			"Titles": {
				"$kind": "EntitySet",
				"$Type": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.TitlesType",
				"$NavigationPropertyBinding": {
					"DraftAdministrativeData": "DraftAdministrativeData",
					"SiblingEntity": "Titles",
					"_Artist": "Artists",
					"_Contribution": "ArtistContributions",
					"_Publication": "Publications"
				}
			}
		},
		"$EntityContainer": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.Container"
	};
});
