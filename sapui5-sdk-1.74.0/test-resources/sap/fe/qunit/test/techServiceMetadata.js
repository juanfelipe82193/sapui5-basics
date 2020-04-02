sap.ui.define([], function() {
	"use strict";
	return {
		"$Version": "4.0",
		"$Reference": {
			"http://docs.oasis-open.org/odata/odata/v4.0/cs02/vocabularies/Org.OData.Core.V1.xml": {
				"$Include": ["Org.OData.Core.V1."],
				"@Org.OData.Core.V1.Description": "Reference annotation"
			}
		},
		"com.odata.v4.technical.scenario.": {
			"$kind": "Schema",
			"@Org.OData.Core.V1.Description": "Schema annotation",
			"$Annotations": {
				"com.odata.v4.technical.scenario.ENString/String3": {
					"@Org.OData.Core.V1.Description": "Member annotation"
				},
				"com.odata.v4.technical.scenario.ENString": {
					"@Org.OData.Core.V1.Description": "EnumType annotation"
				},
				"com.odata.v4.technical.scenario.TDString": {
					"@Org.OData.Core.V1.Description": "TypeDefinition annotation"
				},
				"com.odata.v4.technical.scenario.ETTwoKeyNav/PropertyInt16": {
					"@Org.OData.Core.V1.Description": "Property annotation"
				},
				"com.odata.v4.technical.scenario.ETTwoKeyNav/NavPropertyETKeyNavOne": {
					"@Org.OData.Core.V1.Description": "NavigationProperty annotation"
				},
				"com.odata.v4.technical.scenario.ETTwoKeyNav": {
					"@Org.OData.Core.V1.Description": "EntityType annotation"
				},
				"com.odata.v4.technical.scenario.CTPrim": {
					"@Org.OData.Core.V1.Description": "ComplexType annotation"
				},
				"com.odata.v4.technical.scenario.TermBinary": {
					"@Org.OData.Core.V1.Description": "Term annotation"
				},
				"com.odata.v4.technical.scenario.Container/ESAnnotated": {
					"@Org.OData.Core.V1.Description": "EntitySet annotation"
				},
				"com.odata.v4.technical.scenario.Container/AIRTString": {
					"@Org.OData.Core.V1.Description": "ActionImport annotation"
				},
				"com.odata.v4.technical.scenario.Container/FINRTInt16": {
					"@Org.OData.Core.V1.Description": "FunctionImport annotation"
				},
				"com.odata.v4.technical.scenario.Container/SI": {
					"@Org.OData.Core.V1.Description": "Singleton annotation"
				},
				"com.odata.v4.technical.scenario.Container": {
					"@Org.OData.Core.V1.Description": "EntityContainer annotation"
				},
				"com.odata.v4.technical.scenario.ETAnnotated/PropertyString": {
					"@com.odata.v4.technical.scenario.TermBinary": {
						"$Binary": "T0RhdGE="
					},
					"@com.odata.v4.technical.scenario.TermBoolean": true,
					"@com.odata.v4.technical.scenario.TermDate": {
						"$Date": "2000-01-01"
					},
					"@com.odata.v4.technical.scenario.TermDateTimeOffset": {
						"$DateTimeOffset": "2000-01-01T16:00:00.123-09:00"
					},
					"@com.odata.v4.technical.scenario.TermDecimal": {
						"$Decimal": "3.14"
					},
					"@com.odata.v4.technical.scenario.TermDuration": {
						"$Duration": "P11DT23H59M59.999999999999S"
					},
					"@com.odata.v4.technical.scenario.TermDouble": 3.14,
					"@com.odata.v4.technical.scenario.TermEnum": {
						"$EnumMember": "com.odata.v4.technical.scenario.ENString/String1 com.odata.v4.technical.scenario.ENString/String3"
					},
					"@com.odata.v4.technical.scenario.TermGuid": {
						"$Guid": "21EC2020-3AEA-1069-A2DD-08002B30309D"
					},
					"@com.odata.v4.technical.scenario.TermInt64": 42,
					"@com.odata.v4.technical.scenario.TermString": "Annotation string",
					"@com.odata.v4.technical.scenario.TermTimeOfDay": {
						"$TimeOfDay": "21:45:00"
					},
					"@com.odata.v4.technical.scenario.TermBoolean#QualifierNot": {
						"$Not": {
							"$Path": "PropertyBoolean"
						}
					},
					"@com.odata.v4.technical.scenario.TermBoolean#QualifierAnd": {
						"@Org.OData.Core.V1.Description": "And annotation",
						"$And": [
							{
								"$Path": "PropertyBoolean"
							},
							{
								"$Path": "NavPropertyETAllPrimOne/PropertyBoolean"
							}
						]
					},
					"@com.odata.v4.technical.scenario.TermBoolean#QualifierGt": {
						"@Org.OData.Core.V1.Description": "Gt annotation",
						"$Gt": [
							{
								"$Path": "PropertyInt16"
							},
							20
						]
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierAnnotationPath": {
						"$AnnotationPath": "PropertyString/@com.odata.v4.technical.scenario.TermString"
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierApply": {
						"@Org.OData.Core.V1.Description": "Apply annotation",
						"$Apply": ["Annotation", "String"],
						"$Function": "odata.concat"
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierCast": {
						"@Org.OData.Core.V1.Description": "Cast annotation",
						"$Cast": {
							"$Path": "PropertyInt16"
						},
						"$Type": "Edm.String"
					},
					"@com.odata.v4.technical.scenario.CollTermString": ["Annotation", "String"],
					"@com.odata.v4.technical.scenario.TermString#QualifierIf": {
						"@Org.OData.Core.V1.Description": "If annotation",
						"$If": [
							{
								"$Or": [
									{
										"$And": [
											{
												"$Gt": [
													{
														"$Path": "PropertyInt16"
													},
													10
												]
											},
											{
												"$Lt": [
													{
														"$Path": "PropertyInt16"
													},
													20
												]
											}
										]
									},
									{
										"$Not": {
											"$Path": "PropertyBoolean"
										}
									}
								]
							},
							"Fulfilled",
							"Rejected"
						]
					},
					"@com.odata.v4.technical.scenario.TermBoolean#QualifierIsOf": {
						"@Org.OData.Core.V1.Description": "IsOf annotation",
						"$IsOf": {
							"$Path": "PropertyBoolean"
						},
						"$Type": "Edm.Boolean"
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierLabeledElement": {
						"@Org.OData.Core.V1.Description": "LabeledElement annotation",
						"$LabeledElement": {
							"$Path": "NavPropertyETAllPrimOne/PropertyString"
						},
						"$Name": "LabeledElementName"
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierLabeledElementReference": {
						"$LabeledElementReference": "com.odata.v4.technical.scenario.LabeledElementName"
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierNull": {
						"@Org.OData.Core.V1.Description": "Null annotation",
						"$Null": null
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierPropertyPath": {
						"$PropertyPath": "NavPropertyETAllPrimOne/PropertyString"
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierNavigationPropertyPath": {
						"$NavigationPropertyPath": "NavPropertyETAllPrimOne/NavPropertyETTwoPrimOne"
					},
					"@com.odata.v4.technical.scenario.TermCTTwoPrim": {
						"PropertyInt16@Org.OData.Core.V1.Description": "PropertyValue annotation",
						"@Org.OData.Core.V1.Description": "Record annotation",
						"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
						"PropertyInt16": 123,
						"PropertyString": "String property"
					},
					"@com.odata.v4.technical.scenario.TermString#QualifierUrlRef": {
						"$UrlRef": "http://host/wiki/HowToUse"
					}
				}
			}
		},
		"com.odata.v4.technical.scenario.ENString": {
			"$kind": "EnumType",
			"$IsFlags": true,
			"$UnderlyingType": "Edm.Int16",
			"String1": 1,
			"String2": 2,
			"String3": 4
		},
		"com.odata.v4.technical.scenario.TDString": {
			"$kind": "TypeDefinition",
			"$UnderlyingType": "Edm.String",
			"$MaxLength": 15
		},
		"com.odata.v4.technical.scenario.ETAnnotated": {
			"$kind": "EntityType",
			"$Key": ["PropertyString"],
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"PropertyBoolean": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16"
			},
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String"
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			},
			"CollPropertyComp": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			},
			"NavPropertyETAllPrimOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETAllPrim"
			},
			"NavPropertyETAllPrimMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETAllPrim"
			}
		},
		"com.odata.v4.technical.scenario.ETAllPrim": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"PropertyBoolean": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"PropertyByte": {
				"$kind": "Property",
				"$Type": "Edm.Byte"
			},
			"PropertySByte": {
				"$kind": "Property",
				"$Type": "Edm.SByte"
			},
			"PropertyInt32": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"PropertyInt64": {
				"$kind": "Property",
				"$Type": "Edm.Int64"
			},
			"PropertySingle": {
				"$kind": "Property",
				"$Type": "Edm.Single"
			},
			"PropertyDouble": {
				"$kind": "Property",
				"$Type": "Edm.Double"
			},
			"PropertyDecimal": {
				"$kind": "Property",
				"$Type": "Edm.Decimal"
			},
			"PropertyBinary": {
				"$kind": "Property",
				"$Type": "Edm.Binary"
			},
			"PropertyDate": {
				"$kind": "Property",
				"$Type": "Edm.Date"
			},
			"PropertyDateTimeOffset": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"PropertyDuration": {
				"$kind": "Property",
				"$Type": "Edm.Duration"
			},
			"PropertyGuid": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"PropertyTimeOfDay": {
				"$kind": "Property",
				"$Type": "Edm.TimeOfDay"
			},
			"PropertyStream": {
				"$kind": "Property",
				"$Type": "Edm.Stream",
				"$Nullable": false
			},
			"NavPropertyETTwoPrimOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoPrim"
			},
			"NavPropertyETTwoPrimMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoPrim"
			}
		},
		"com.odata.v4.technical.scenario.ETAllPrimDefaultValues": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false,
				"$DefaultValue": "32767"
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false,
				"$DefaultValue": "abc"
			},
			"PropertyBoolean": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false,
				"$DefaultValue": "true"
			},
			"PropertyByte": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false,
				"$DefaultValue": "255"
			},
			"PropertySByte": {
				"$kind": "Property",
				"$Type": "Edm.SByte",
				"$Nullable": false,
				"$DefaultValue": "127"
			},
			"PropertyInt32": {
				"$kind": "Property",
				"$Type": "Edm.Int32",
				"$Nullable": false,
				"$DefaultValue": "2147483647"
			},
			"PropertyInt64": {
				"$kind": "Property",
				"$Type": "Edm.Int64",
				"$Nullable": false,
				"$DefaultValue": "9223372036854775807"
			},
			"PropertySingle": {
				"$kind": "Property",
				"$Type": "Edm.Single",
				"$Nullable": false,
				"$DefaultValue": "1.23"
			},
			"PropertyDouble": {
				"$kind": "Property",
				"$Type": "Edm.Double",
				"$Nullable": false,
				"$DefaultValue": "3.1415926535897931"
			},
			"PropertyDecimal": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Nullable": false,
				"$DefaultValue": "123.0123456789",
				"$Scale": 10
			},
			"PropertyBinary": {
				"$kind": "Property",
				"$Type": "Edm.Binary",
				"$Nullable": false,
				"$DefaultValue": "T0RhdGE"
			},
			"PropertyDate": {
				"$kind": "Property",
				"$Type": "Edm.Date",
				"$Nullable": false,
				"$DefaultValue": "2016-06-27"
			},
			"PropertyDateTimeOffset": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Nullable": false,
				"$DefaultValue": "2016-06-27T14:52:23.123Z"
			},
			"PropertyDuration": {
				"$kind": "Property",
				"$Type": "Edm.Duration",
				"$Nullable": false,
				"$DefaultValue": "P12DT23H59M59.999S"
			},
			"PropertyGuid": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false,
				"$DefaultValue": "01234567-89ab-cdef-0123-456789abcdef"
			},
			"PropertyTimeOfDay": {
				"$kind": "Property",
				"$Type": "Edm.TimeOfDay",
				"$Nullable": false,
				"$DefaultValue": "07:59:59.999"
			},
			"PropertyEnumString": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.ENString",
				"$Nullable": false,
				"$DefaultValue": "String1"
			},
			"PropertyDefString": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.TDString",
				"$Nullable": false,
				"$DefaultValue": "CustomString"
			}
		},
		"com.odata.v4.technical.scenario.ETCollAllPrim": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"CollPropertyBoolean": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Boolean"
			},
			"CollPropertyByte": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Byte"
			},
			"CollPropertySByte": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.SByte"
			},
			"CollPropertyInt16": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"CollPropertyInt32": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int32"
			},
			"CollPropertyInt64": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int64"
			},
			"CollPropertySingle": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Single"
			},
			"CollPropertyDouble": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Double"
			},
			"CollPropertyDecimal": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Decimal"
			},
			"CollPropertyBinary": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Binary"
			},
			"CollPropertyDate": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Date",
				"$Nullable": false
			},
			"CollPropertyDateTimeOffset": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.DateTimeOffset",
				"$Nullable": false
			},
			"CollPropertyDuration": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Duration",
				"$Nullable": false
			},
			"CollPropertyGuid": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Guid"
			},
			"CollPropertyTimeOfDay": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.TimeOfDay"
			}
		},
		"com.odata.v4.technical.scenario.ETTwoPrim": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"NavPropertyETAllPrimOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETAllPrim"
			},
			"NavPropertyETAllPrimMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETAllPrim"
			}
		},
		"com.odata.v4.technical.scenario.ETMixPrimCollComp": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String"
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			},
			"CollPropertyComp": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			}
		},
		"com.odata.v4.technical.scenario.ETTwoKeyTwoPrim": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16", "PropertyString"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			}
		},
		"com.odata.v4.technical.scenario.ETMixEnumDefCollComp": {
			"$kind": "EntityType",
			"$Key": ["PropertyEnumString", "PropertyDefString"],
			"PropertyEnumString": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.ENString",
				"$Nullable": false
			},
			"PropertyDefString": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.TDString",
				"$Nullable": false
			},
			"CollPropertyEnumString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ENString"
			},
			"CollPropertyDefString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.TDString"
			},
			"PropertyCompMixedEnumDef": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTMixEnumDef"
			},
			"CollPropertyCompMixedEnumDef": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTMixEnumDef"
			}
		},
		"com.odata.v4.technical.scenario.ETBase": {
			"$kind": "EntityType",
			"$BaseType": "com.odata.v4.technical.scenario.ETTwoPrim",
			"AdditionalPropertyString_5": {
				"$kind": "Property",
				"$Type": "Edm.String"
			}
		},
		"com.odata.v4.technical.scenario.ETTwoBase": {
			"$kind": "EntityType",
			"$BaseType": "com.odata.v4.technical.scenario.ETBase",
			"AdditionalPropertyString_6": {
				"$kind": "Property",
				"$Type": "Edm.String"
			}
		},
		"com.odata.v4.technical.scenario.ETAllKey": {
			"$kind": "EntityType",
			"$Key": [
				"PropertyString",
				"PropertyBoolean",
				"PropertyByte",
				"PropertySByte",
				"PropertyInt16",
				"PropertyInt32",
				"PropertyInt64",
				"PropertyDecimal",
				"PropertyDate",
				"PropertyDateTimeOffset",
				"PropertyDuration",
				"PropertyGuid",
				"PropertyTimeOfDay"
			],
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"PropertyBoolean": {
				"$kind": "Property",
				"$Type": "Edm.Boolean",
				"$Nullable": false
			},
			"PropertyByte": {
				"$kind": "Property",
				"$Type": "Edm.Byte",
				"$Nullable": false
			},
			"PropertySByte": {
				"$kind": "Property",
				"$Type": "Edm.SByte",
				"$Nullable": false
			},
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyInt32": {
				"$kind": "Property",
				"$Type": "Edm.Int32",
				"$Nullable": false
			},
			"PropertyInt64": {
				"$kind": "Property",
				"$Type": "Edm.Int64",
				"$Nullable": false
			},
			"PropertyDecimal": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Nullable": false
			},
			"PropertyDate": {
				"$kind": "Property",
				"$Type": "Edm.Date",
				"$Nullable": false
			},
			"PropertyDateTimeOffset": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Nullable": false
			},
			"PropertyDuration": {
				"$kind": "Property",
				"$Type": "Edm.Duration",
				"$Nullable": false
			},
			"PropertyGuid": {
				"$kind": "Property",
				"$Type": "Edm.Guid",
				"$Nullable": false
			},
			"PropertyTimeOfDay": {
				"$kind": "Property",
				"$Type": "Edm.TimeOfDay",
				"$Nullable": false
			}
		},
		"com.odata.v4.technical.scenario.ETCompAllPrim": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTAllPrim"
			}
		},
		"com.odata.v4.technical.scenario.ETCompCollAllPrim": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTCollAllPrim"
			}
		},
		"com.odata.v4.technical.scenario.ETCompComp": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTCompComp"
			}
		},
		"com.odata.v4.technical.scenario.ETCompCollComp": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTCompCollComp"
			}
		},
		"com.odata.v4.technical.scenario.ETMedia": {
			"$kind": "EntityType",
			"$HasStream": true,
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			}
		},
		"com.odata.v4.technical.scenario.ETFourKeyAlias": {
			"$kind": "EntityType",
			"$Key": [
				"PropertyInt16",
				{
					"KeyAlias1": "PropertyComp/PropertyInt16"
				},
				{
					"KeyAlias2": "PropertyComp/PropertyString"
				},
				{
					"KeyAlias3": "PropertyCompComp/PropertyComp/PropertyString"
				}
			],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
				"$Nullable": false
			},
			"PropertyCompComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTCompComp",
				"$Nullable": false
			}
		},
		"com.odata.v4.technical.scenario.ETServerSidePaging": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			}
		},
		"com.odata.v4.technical.scenario.ETAllNullable": {
			"$kind": "EntityType",
			"$Key": ["PropertyKey"],
			"PropertyKey": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16"
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"PropertyBoolean": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"PropertyByte": {
				"$kind": "Property",
				"$Type": "Edm.Byte"
			},
			"PropertySByte": {
				"$kind": "Property",
				"$Type": "Edm.SByte"
			},
			"PropertyInt32": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"PropertyInt64": {
				"$kind": "Property",
				"$Type": "Edm.Int64"
			},
			"PropertySingle": {
				"$kind": "Property",
				"$Type": "Edm.Single"
			},
			"PropertyDouble": {
				"$kind": "Property",
				"$Type": "Edm.Double"
			},
			"PropertyDecimal": {
				"$kind": "Property",
				"$Type": "Edm.Decimal"
			},
			"PropertyBinary": {
				"$kind": "Property",
				"$Type": "Edm.Binary"
			},
			"PropertyDate": {
				"$kind": "Property",
				"$Type": "Edm.Date"
			},
			"PropertyDateTimeOffset": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset"
			},
			"PropertyDuration": {
				"$kind": "Property",
				"$Type": "Edm.Duration"
			},
			"PropertyGuid": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"PropertyTimeOfDay": {
				"$kind": "Property",
				"$Type": "Edm.TimeOfDay"
			},
			"PropertyStream": {
				"$kind": "Property",
				"$Type": "Edm.Stream"
			},
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String"
			},
			"CollPropertyBoolean": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Boolean"
			},
			"CollPropertyByte": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Byte"
			},
			"CollPropertySByte": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.SByte"
			},
			"CollPropertyInt16": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int16"
			},
			"CollPropertyInt32": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int32"
			},
			"CollPropertyInt64": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int64"
			},
			"CollPropertySingle": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Single"
			},
			"CollPropertyDouble": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Double"
			},
			"CollPropertyDecimal": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Decimal"
			},
			"CollPropertyBinary": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Binary"
			},
			"CollPropertyDate": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Date"
			},
			"CollPropertyDateTimeOffset": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.DateTimeOffset"
			},
			"CollPropertyDuration": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Duration"
			},
			"CollPropertyGuid": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Guid"
			},
			"CollPropertyTimeOfDay": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.TimeOfDay"
			}
		},
		"com.odata.v4.technical.scenario.ETKeyNav": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"PropertyCompNav": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTNavFiveProp"
			},
			"PropertyCompAllPrim": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTAllPrim"
			},
			"PropertyCompTwoPrim": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			},
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String"
			},
			"CollPropertyInt16": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int16"
			},
			"CollPropertyComp": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTPrimComp"
			},
			"PropertyCompCompNav": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTCompNav"
			},
			"NavPropertyETTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$Nullable": false
			},
			"NavPropertyETTwoKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$Partner": "NavPropertyETKeyNavOne"
			},
			"NavPropertyETKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav"
			},
			"NavPropertyETKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav"
			},
			"NavPropertyETMediaOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETMedia"
			},
			"NavPropertyETMediaMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETMedia"
			}
		},
		"com.odata.v4.technical.scenario.ETTwoKeyNav": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16", "PropertyString"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTPrimComp",
				"$Nullable": false
			},
			"PropertyCompNav": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTBasePrimCompNav",
				"$Nullable": false
			},
			"CollPropertyComp": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTPrimComp"
			},
			"CollPropertyCompNav": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTNavFiveProp"
			},
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String"
			},
			"PropertyCompTwoPrim": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			},
			"NavPropertyETKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
				"$ReferentialConstraint": {
					"PropertyInt16": "PropertyInt16",
					"PropertyInt16@Org.OData.Core.V1.Description": "ReferentialConstraint annotation"
				}
			},
			"NavPropertyETKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav"
			},
			"NavPropertyETTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
			},
			"NavPropertyETTwoKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
			},
			"NavPropertySINav": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
			}
		},
		"com.odata.v4.technical.scenario.ETBaseTwoKeyNav": {
			"$kind": "EntityType",
			"$BaseType": "com.odata.v4.technical.scenario.ETTwoKeyNav",
			"PropertyDate": {
				"$kind": "Property",
				"$Type": "Edm.Date"
			},
			"NavPropertyETBaseTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav"
			},
			"NavPropertyETTwoBaseTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoBaseTwoKeyNav"
			}
		},
		"com.odata.v4.technical.scenario.ETTwoBaseTwoKeyNav": {
			"$kind": "EntityType",
			"$BaseType": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
			"PropertyGuid": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"NavPropertyETBaseTwoKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav"
			}
		},
		"com.odata.v4.technical.scenario.ETKeyNavCont": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"PropertyCompNavCont": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTNavCont"
			},
			"NavPropertyETTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$ContainsTarget": true
			},
			"NavPropertyETTwoKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$ContainsTarget": true
			},
			"NavPropertyETTwoKeyNavContOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNavCont"
			},
			"NavPropertyETTwoKeyNavContMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNavCont"
			}
		},
		"com.odata.v4.technical.scenario.ETTwoKeyNavCont": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16", "PropertyString"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			},
			"NavPropertyETKeyNavContOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETKeyNavCont",
				"$ContainsTarget": true
			},
			"NavPropertyETKeyNavContMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETKeyNavCont",
				"$ContainsTarget": true
			}
		},
		"com.odata.v4.technical.scenario.ETCompMixPrimCollComp": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyMixedPrimCollComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTMixPrimCollComp"
			}
		},
		"com.odata.v4.technical.scenario.ETKeyPrimNav": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"NavPropertyETKeyPrimNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETKeyPrimNav"
			}
		},
		"com.odata.v4.technical.scenario.ETAllGeography": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyPoint": {
				"$kind": "Property",
				"$Type": "Edm.GeographyPoint"
			},
			"PropertyLineString": {
				"$kind": "Property",
				"$Type": "Edm.GeographyLineString"
			},
			"PropertyPolygon": {
				"$kind": "Property",
				"$Type": "Edm.GeographyPolygon"
			},
			"PropertyMultiPoint": {
				"$kind": "Property",
				"$Type": "Edm.GeographyMultiPoint"
			},
			"PropertyMultiLineString": {
				"$kind": "Property",
				"$Type": "Edm.GeographyMultiLineString"
			},
			"PropertyMultiPolygon": {
				"$kind": "Property",
				"$Type": "Edm.GeographyMultiPolygon"
			},
			"PropertyCollection": {
				"$kind": "Property",
				"$Type": "Edm.GeographyCollection"
			}
		},
		"com.odata.v4.technical.scenario.ETAllGeometry": {
			"$kind": "EntityType",
			"$Key": ["PropertyInt16"],
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyPoint": {
				"$kind": "Property",
				"$Type": "Edm.GeometryPoint"
			},
			"PropertyLineString": {
				"$kind": "Property",
				"$Type": "Edm.GeometryLineString"
			},
			"PropertyPolygon": {
				"$kind": "Property",
				"$Type": "Edm.GeometryPolygon"
			},
			"PropertyMultiPoint": {
				"$kind": "Property",
				"$Type": "Edm.GeometryMultiPoint"
			},
			"PropertyMultiLineString": {
				"$kind": "Property",
				"$Type": "Edm.GeometryMultiLineString"
			},
			"PropertyMultiPolygon": {
				"$kind": "Property",
				"$Type": "Edm.GeometryMultiPolygon"
			},
			"PropertyCollection": {
				"$kind": "Property",
				"$Type": "Edm.GeometryCollection"
			}
		},
		"com.odata.v4.technical.scenario.CTPrim": {
			"$kind": "ComplexType",
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16"
			}
		},
		"com.odata.v4.technical.scenario.CTAllPrim": {
			"$kind": "ComplexType",
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"PropertyBinary": {
				"$kind": "Property",
				"$Type": "Edm.Binary"
			},
			"PropertyBoolean": {
				"$kind": "Property",
				"$Type": "Edm.Boolean"
			},
			"PropertyByte": {
				"$kind": "Property",
				"$Type": "Edm.Byte"
			},
			"PropertyDate": {
				"$kind": "Property",
				"$Type": "Edm.Date"
			},
			"PropertyDateTimeOffset": {
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 12
			},
			"PropertyDecimal": {
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 11,
				"$Scale": 5
			},
			"PropertySingle": {
				"$kind": "Property",
				"$Type": "Edm.Single"
			},
			"PropertyDouble": {
				"$kind": "Property",
				"$Type": "Edm.Double"
			},
			"PropertyDuration": {
				"$kind": "Property",
				"$Type": "Edm.Duration"
			},
			"PropertyGuid": {
				"$kind": "Property",
				"$Type": "Edm.Guid"
			},
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16"
			},
			"PropertyInt32": {
				"$kind": "Property",
				"$Type": "Edm.Int32"
			},
			"PropertyInt64": {
				"$kind": "Property",
				"$Type": "Edm.Int64"
			},
			"PropertySByte": {
				"$kind": "Property",
				"$Type": "Edm.SByte"
			},
			"PropertyTimeOfDay": {
				"$kind": "Property",
				"$Type": "Edm.TimeOfDay",
				"$Precision": 12
			},
			"PropertyStream": {
				"$kind": "Property",
				"$Type": "Edm.Stream",
				"$Nullable": false
			}
		},
		"com.odata.v4.technical.scenario.CTCollAllPrim": {
			"$kind": "ComplexType",
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String"
			},
			"CollPropertyBoolean": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Boolean"
			},
			"CollPropertyByte": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Byte"
			},
			"CollPropertySByte": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.SByte"
			},
			"CollPropertyInt16": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int16"
			},
			"CollPropertyInt32": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int32"
			},
			"CollPropertyInt64": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Int64"
			},
			"CollPropertySingle": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Single"
			},
			"CollPropertyDouble": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Double"
			},
			"CollPropertyDecimal": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Decimal"
			},
			"CollPropertyBinary": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Binary"
			},
			"CollPropertyDate": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Date"
			},
			"CollPropertyDateTimeOffset": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.DateTimeOffset"
			},
			"CollPropertyDuration": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Duration"
			},
			"CollPropertyGuid": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.Guid"
			},
			"CollPropertyTimeOfDay": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.TimeOfDay"
			}
		},
		"com.odata.v4.technical.scenario.CTTwoPrim": {
			"$kind": "ComplexType",
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16",
				"$Nullable": false
			},
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String",
				"$Nullable": false
			}
		},
		"com.odata.v4.technical.scenario.CTMixPrimCollComp": {
			"$kind": "ComplexType",
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16"
			},
			"CollPropertyString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "Edm.String"
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			},
			"CollPropertyComp": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			}
		},
		"com.odata.v4.technical.scenario.CTMixEnumDef": {
			"$kind": "ComplexType",
			"PropertyEnumString": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.ENString"
			},
			"PropertyDefString": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.TDString"
			},
			"CollPropertyEnumString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ENString"
			},
			"CollPropertyDefString": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.TDString"
			}
		},
		"com.odata.v4.technical.scenario.CTBase": {
			"$kind": "ComplexType",
			"$BaseType": "com.odata.v4.technical.scenario.CTTwoPrim",
			"AdditionalPropString": {
				"$kind": "Property",
				"$Type": "Edm.String"
			}
		},
		"com.odata.v4.technical.scenario.CTTwoBase": {
			"$kind": "ComplexType",
			"$BaseType": "com.odata.v4.technical.scenario.CTBase"
		},
		"com.odata.v4.technical.scenario.CTCompComp": {
			"$kind": "ComplexType",
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			}
		},
		"com.odata.v4.technical.scenario.CTCompCollComp": {
			"$kind": "ComplexType",
			"CollPropertyComp": {
				"$kind": "Property",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
			}
		},
		"com.odata.v4.technical.scenario.CTPrimComp": {
			"$kind": "ComplexType",
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16"
			},
			"PropertyComp": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTAllPrim"
			}
		},
		"com.odata.v4.technical.scenario.CTNavFiveProp": {
			"$kind": "ComplexType",
			"PropertyInt16": {
				"$kind": "Property",
				"$Type": "Edm.Int16"
			},
			"NavPropertyETTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
			},
			"NavPropertyETTwoKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
			},
			"NavPropertyETMediaOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETMedia"
			},
			"NavPropertyETMediaMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETMedia"
			}
		},
		"com.odata.v4.technical.scenario.CTBasePrimCompNav": {
			"$kind": "ComplexType",
			"$BaseType": "com.odata.v4.technical.scenario.CTPrimComp",
			"NavPropertyETTwoKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
			},
			"NavPropertyETTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
			},
			"NavPropertyETKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav"
			},
			"NavPropertyETKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav"
			}
		},
		"com.odata.v4.technical.scenario.CTTwoBasePrimCompNav": {
			"$kind": "ComplexType",
			"$BaseType": "com.odata.v4.technical.scenario.CTBasePrimCompNav"
		},
		"com.odata.v4.technical.scenario.CTCompNav": {
			"$kind": "ComplexType",
			"PropertyString": {
				"$kind": "Property",
				"$Type": "Edm.String"
			},
			"PropertyCompNav": {
				"$kind": "Property",
				"$Type": "com.odata.v4.technical.scenario.CTNavFiveProp"
			}
		},
		"com.odata.v4.technical.scenario.CTNavCont": {
			"$kind": "ComplexType",
			"NavPropertyETKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
				"$ContainsTarget": true
			},
			"NavPropertyETKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
				"$ContainsTarget": true
			},
			"NavPropertyETTwoKeyNavOne": {
				"$kind": "NavigationProperty",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$ContainsTarget": true
			},
			"NavPropertyETTwoKeyNavMany": {
				"$kind": "NavigationProperty",
				"$isCollection": true,
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$ContainsTarget": true
			}
		},
		"com.odata.v4.technical.scenario.BAETTwoKeyNavRTETTwoKeyNavParam": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "ParameterETTwoKeyNav/NavPropertyETTwoKeyNavOne",
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "ParameterETTwoKeyNav",
						"$Nullable": false,
						"@Org.OData.Core.V1.Description": "Parameter annotation"
					},
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"@Org.OData.Core.V1.Description": "ReturnType annotation"
				},
				"@Org.OData.Core.V1.Description": "Action annotation",
				"@Org.OData.Core.V1.Description@Org.OData.Core.V1.Description": "Annotation annotation"
			}
		],
		"com.odata.v4.technical.scenario.BATDStringRTTDString": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "ParameterTDString",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.TDString"
				}
			}
		],
		"com.odata.v4.technical.scenario.BATDStringRTCollTDString": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "ParameterTDString",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.TDString"
				}
			}
		],
		"com.odata.v4.technical.scenario.BA_RTETTwoKeyNav": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "ParameterETTwoKeyNav",
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "ParameterETTwoKeyNav",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
						"$Name": "ParameterETKeyNav",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAESAllPrimRTETAllPrim": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
						"$Name": "ParameterESAllPrim",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETAllPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAESTwoKeyNavRTESTwoKeyNav": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "ParameterETTwoKeyNav",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAESTwoKeyNavRTESKeyNav": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$EntitySetPath": "ParameterETTwoKeyNav/NavPropertyETKeyNavMany",
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "ParameterETTwoKeyNav",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETKeyNav"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAETBaseTwoKeyNavRTETBaseTwoKeyNav": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
						"$Name": "ParameterETTwoKeyNav",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAETTwoBaseTwoKeyNavRTETBaseTwoKeyNav": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoBaseTwoKeyNav",
						"$Name": "ParameterETTwoBaseTwoKeyNav",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAETAllPrimRT": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
						"$Name": "ParameterETAllPrim",
						"$Nullable": false
					}
				]
			}
		],
		"com.odata.v4.technical.scenario.BAESAllPrimRT": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
						"$Name": "ParameterETAllPrim",
						"$Nullable": false
					}
				]
			}
		],
		"com.odata.v4.technical.scenario.BAETTwoPrimRTString": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "ParameterETTwoPrim",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.String"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAETTwoPrimRTCollString": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "ParameterETTwoPrim",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "Edm.String"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAETTwoPrimRTCTAllPrim": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "ParameterETTwoPrim",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTAllPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAETTwoPrimRTCollCTAllPrim": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "ParameterETTwoPrim",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.CTAllPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario.BAETCompAllPrimRTETCompAllPrim": [
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETCompAllPrim",
						"$Name": "ParameterETCompAllPrim",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETCompAllPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario._A_RTTimeOfDay_": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterAny",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterAny",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			},
			{
				"$kind": "Action",
				"$IsBound": true,
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int32",
						"$Name": "ParameterAny",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			}
		],
		"com.odata.v4.technical.scenario.UAResetData": [
			{
				"$kind": "Action",
				"$ReturnType": {
					"$Type": "Edm.Boolean"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTString": [
			{
				"$kind": "Action",
				"$ReturnType": {
					"$Type": "Edm.String"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTTDString": [
			{
				"$kind": "Action",
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.TDString"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTCollTDString": [
			{
				"$kind": "Action",
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.TDString"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTCollStringTwoParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16"
					},
					{
						"$Type": "Edm.Duration",
						"$Name": "ParameterDuration"
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "Edm.String"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTCTTwoPrimParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTCollCTTwoPrimParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16"
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTETTwoKeyTwoPrimParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16"
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyTwoPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTCollETKeyNavParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16"
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETKeyNav"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTETAllPrimParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Date",
						"$Name": "ParameterDate"
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETAllPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario.UARTCollETAllPrimParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay"
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETAllPrim"
				}
			}
		],
		"com.odata.v4.technical.scenario.UART": [
			{
				"$kind": "Action"
			}
		],
		"com.odata.v4.technical.scenario.UARTParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16"
					}
				]
			}
		],
		"com.odata.v4.technical.scenario.UARTTwoParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16"
					},
					{
						"$Type": "Edm.Duration",
						"$Name": "ParameterDuration"
					}
				]
			}
		],
		"com.odata.v4.technical.scenario.UARTByteNineParam": [
			{
				"$kind": "Action",
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ENString",
						"$Name": "ParameterEnum"
					},
					{
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "ParameterDef"
					},
					{
						"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
						"$Name": "ParameterComp"
					},
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "ParameterETTwoPrim"
					},
					{
						"$isCollection": true,
						"$Type": "Edm.Byte",
						"$Name": "CollParameterByte"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ENString",
						"$Name": "CollParameterEnum"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "CollParameterDef"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
						"$Name": "CollParameterComp"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "CollParameterETTwoPrim"
					}
				],
				"$ReturnType": {
					"$Type": "Edm.Byte"
				}
			}
		],
		"com.odata.v4.technical.scenario.UFNRTInt16": [
			{
				"$kind": "Function",
				"$ReturnType": {
					"$Type": "Edm.Int16"
				},
				"@Org.OData.Core.V1.Description": "Function annotation"
			}
		],
		"com.odata.v4.technical.scenario.UFCRTETKeyNav": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTETTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTETTwoKeyNavParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTETTwoKeyNavParamCTTwoPrim": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
						"$Name": "ParameterCTTwoPrim",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTString_": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.String"
				}
			},
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.String"
				}
			}
		],
		"com.odata.v4.technical.scenario._FC_RTTimeOfDay_": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			},
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterAny",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			},
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int32",
						"$Name": "ParameterAny",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			},
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			},
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterAny",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			},
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.TimeOfDay",
						"$Name": "ParameterTimeOfDay",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int32",
						"$Name": "ParameterAny",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.TimeOfDay"
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollETTwoKeyNavParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTString": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$Type": "Edm.String",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollDecimal": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "Edm.Decimal",
					"$Nullable": false,
					"$Precision": 12,
					"$Scale": 5
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTDecimal": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$Type": "Edm.Decimal",
					"$Nullable": false,
					"$Precision": 12,
					"$Scale": 5
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollStringTwoParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "Edm.String",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollString": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "Edm.String",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCTAllPrimTwoParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTAllPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCTTwoPrimTwoParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollCTTwoPrimTwoParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString"
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCTTwoPrim": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollCTTwoPrim": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTETMedia": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETMedia",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollETMedia": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETMedia",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFNRTCollETMixPrimCollCompTwoParam": [
			{
				"$kind": "Function",
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETMixPrimCollComp",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTETAllPrimTwoParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollETMixPrimCollCompTwoParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					},
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETMixPrimCollComp",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFNRTCollCTNavFiveProp": [
			{
				"$kind": "Function",
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.CTNavFiveProp"
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollETKeyNavContParam": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.Int16",
						"$Name": "ParameterInt16",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETKeyNavCont",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTTDString": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.TDString",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFCRTCollTDString": [
			{
				"$kind": "Function",
				"$IsComposable": true,
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.TDString",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.UFNRTByteNineParam": [
			{
				"$kind": "Function",
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ENString",
						"$Name": "ParameterEnum"
					},
					{
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "ParameterDef"
					},
					{
						"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
						"$Name": "ParameterComp"
					},
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "ParameterETTwoPrim"
					},
					{
						"$isCollection": true,
						"$Type": "Edm.Byte",
						"$Name": "CollParameterByte"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ENString",
						"$Name": "CollParameterEnum"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "CollParameterDef"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
						"$Name": "CollParameterComp"
					},
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
						"$Name": "CollParameterETTwoPrim"
					}
				],
				"$ReturnType": {
					"$Type": "Edm.Byte"
				}
			}
		],
		"com.odata.v4.technical.scenario.BFC_RTESTwoKeyNav_": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$EntitySetPath": "BindingParam/NavPropertyETTwoKeyNavMany",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			},
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			},
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCStringRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "Edm.String",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCETBaseTwoKeyNavRTETTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESBaseTwoKeyNavRTESBaseTwoKey": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFNESAllPrimRTCTAllPrim": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTAllPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTCTTwoPrim": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTCollCTTwoPrim": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTString": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.String",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFNESTwoKeyNavRTString": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.String",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTCollString": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "Edm.String",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCETTwoKeyNavRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$EntitySetPath": "BindingParam/NavPropertyETTwoKeyNavOne",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCETBaseTwoKeyNavRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCSINavRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCETBaseTwoKeyNavRTESBaseTwoKey": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCCollStringRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "Edm.String",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCCTPrimCompRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.CTPrimComp",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCCTPrimCompRTESBaseTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.CTPrimComp",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCCollCTPrimCompRTESAllPrim": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.CTPrimComp",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESKeyNavRTETKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCETKeyNavRTETKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$EntitySetPath": "BindingParam/NavPropertyETKeyNavOne",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCETTwoKeyNavRTETTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCETTwoKeyNavRTCTTwoPrim": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTCTNavFiveProp": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.CTNavFiveProp",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTCollCTNavFiveProp": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.CTNavFiveProp",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTCollDecimal": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "Edm.Decimal",
					"$Nullable": false,
					"$Precision": 12,
					"$Scale": 5
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESTwoKeyNavRTStringParam": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					},
					{
						"$Type": "com.odata.v4.technical.scenario.CTTwoPrim",
						"$Name": "ParameterComp",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "Edm.String",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESKeyNavRTETKeyNavParam": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCCTPrimCompRTETTwoKeyNavParam": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.CTPrimComp",
						"$Name": "BindingParam",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCESKeyNavRTESTwoKeyNav": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$EntitySetPath": "BindingParam/NavPropertyETTwoKeyNavMany",
				"$IsComposable": true,
				"$Parameter": [
					{
						"$isCollection": true,
						"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
						"$Name": "BindingParam",
						"$Nullable": false
					},
					{
						"$Type": "Edm.String",
						"$Name": "ParameterString",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCTDStringRTTDString": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$Type": "com.odata.v4.technical.scenario.TDString",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.BFCTDStringRTCollTDString": [
			{
				"$kind": "Function",
				"$IsBound": true,
				"$IsComposable": true,
				"$Parameter": [
					{
						"$Type": "com.odata.v4.technical.scenario.TDString",
						"$Name": "BindingParam",
						"$Nullable": false
					}
				],
				"$ReturnType": {
					"$isCollection": true,
					"$Type": "com.odata.v4.technical.scenario.TDString",
					"$Nullable": false
				}
			}
		],
		"com.odata.v4.technical.scenario.TermBinary": {
			"$kind": "Term",
			"$Type": "Edm.Binary"
		},
		"com.odata.v4.technical.scenario.TermBoolean": {
			"$kind": "Term",
			"$Type": "Edm.Boolean"
		},
		"com.odata.v4.technical.scenario.TermDate": {
			"$kind": "Term",
			"$Type": "Edm.Date"
		},
		"com.odata.v4.technical.scenario.TermDateTimeOffset": {
			"$kind": "Term",
			"$Type": "Edm.DateTimeOffset",
			"$Precision": 3
		},
		"com.odata.v4.technical.scenario.TermDecimal": {
			"$kind": "Term",
			"$Type": "Edm.Decimal"
		},
		"com.odata.v4.technical.scenario.TermDuration": {
			"$kind": "Term",
			"$Type": "Edm.Duration"
		},
		"com.odata.v4.technical.scenario.TermDouble": {
			"$kind": "Term",
			"$Type": "Edm.Double"
		},
		"com.odata.v4.technical.scenario.TermEnum": {
			"$kind": "Term",
			"$Type": "com.odata.v4.technical.scenario.ENString"
		},
		"com.odata.v4.technical.scenario.TermGuid": {
			"$kind": "Term",
			"$Type": "Edm.Guid"
		},
		"com.odata.v4.technical.scenario.TermInt64": {
			"$kind": "Term",
			"$Type": "Edm.Int64"
		},
		"com.odata.v4.technical.scenario.TermString": {
			"$kind": "Term",
			"$Type": "Edm.String"
		},
		"com.odata.v4.technical.scenario.TermTimeOfDay": {
			"$kind": "Term",
			"$Type": "Edm.TimeOfDay"
		},
		"com.odata.v4.technical.scenario.CollTermString": {
			"$kind": "Term",
			"$isCollection": true,
			"$Type": "Edm.String"
		},
		"com.odata.v4.technical.scenario.TermCTTwoPrim": {
			"$kind": "Term",
			"$Type": "com.odata.v4.technical.scenario.CTTwoPrim"
		},
		"com.odata.v4.technical.scenario.Container": {
			"$kind": "EntityContainer",
			"ESAnnotated": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAnnotated",
				"$NavigationPropertyBinding": {
					"NavPropertyETAllPrimOne": "ESAllPrim",
					"NavPropertyETAllPrimMany": "ESAllPrim"
				}
			},
			"ESAllPrim": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
				"$NavigationPropertyBinding": {
					"NavPropertyETTwoPrimOne": "ESTwoPrim",
					"NavPropertyETTwoPrimMany": "ESTwoPrim"
				}
			},
			"ESCollAllPrim": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETCollAllPrim"
			},
			"ESTwoPrim": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETTwoPrim",
				"$NavigationPropertyBinding": {
					"NavPropertyETAllPrimOne": "ESAllPrim",
					"NavPropertyETAllPrimMany": "ESAllPrim"
				}
			},
			"ESMixPrimCollComp": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETMixPrimCollComp"
			},
			"ESMixEnumDefCollComp": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETMixEnumDefCollComp"
			},
			"ESBase": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETBase"
			},
			"ESTwoBase": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETTwoBase"
			},
			"ESTwoKeyTwoPrim": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyTwoPrim"
			},
			"ESAllKey": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAllKey"
			},
			"ESCompAllPrim": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETCompAllPrim"
			},
			"ESCompCollAllPrim": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETCompCollAllPrim"
			},
			"ESCompComp": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETCompComp"
			},
			"ESCompCollComp": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETCompCollComp"
			},
			"ESMedia": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETMedia"
			},
			"ESFourKeyAlias": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETFourKeyAlias"
			},
			"ESInvisible": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAllPrim",
				"$IncludeInServiceDocument": false
			},
			"ESServerSidePaging": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETServerSidePaging"
			},
			"ESAllNullable": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAllNullable"
			},
			"ESKeyNav": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETKeyNav",
				"$NavigationPropertyBinding": {
					"NavPropertyETKeyNavOne": "ESKeyNav",
					"NavPropertyETKeyNavMany": "ESKeyNav",
					"NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"NavPropertyETMediaOne": "ESMedia",
					"NavPropertyETMediaMany": "ESMedia",
					"PropertyCompNav/NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"PropertyCompNav/NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"PropertyCompNav/NavPropertyETMediaOne": "ESMedia",
					"PropertyCompNav/NavPropertyETMediaMany": "ESMedia",
					"PropertyCompCompNav/PropertyCompNav/NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"PropertyCompCompNav/PropertyCompNav/NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"PropertyCompCompNav/PropertyCompNav/NavPropertyETMediaOne": "ESMedia",
					"PropertyCompCompNav/PropertyCompNav/NavPropertyETMediaMany": "ESMedia",
					"Namespace1_Alias.ETKeyNav/PropertyCompNav/NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"Namespace1_Alias.ETKeyNav/PropertyCompNav/NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"PropertyCompNav/Namespace1_Alias.CTNavFiveProp/NavPropertyETTwoKeyNavMany": "ESTwoKeyNav"
				}
			},
			"ESTwoKeyNav": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$NavigationPropertyBinding": {
					"NavPropertyETKeyNavOne": "ESKeyNav",
					"NavPropertyETKeyNavMany": "ESKeyNav",
					"NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"PropertyCompNav/NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"PropertyCompNav/NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"PropertyCompNav/NavPropertyETKeyNavOne": "ESKeyNav",
					"PropertyCompNav/NavPropertyETKeyNavMany": "ESKeyNav",
					"CollPropertyCompNav/NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"CollPropertyCompNav/NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"CollPropertyCompNav/NavPropertyETMediaOne": "ESMedia",
					"CollPropertyCompNav/NavPropertyETMediaMany": "ESMedia",
					"Namespace1_Alias.ETBaseTwoKeyNav/NavPropertyETTwoBaseTwoKeyNavOne": "ESBaseTwoKeyNav",
					"NavPropertySINav": "SINav"
				}
			},
			"ESBaseTwoKeyNav": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETBaseTwoKeyNav",
				"$NavigationPropertyBinding": {
					"NavPropertyETKeyNavMany": "ESKeyNav"
				}
			},
			"ESTwoBaseTwoKeyNav": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETTwoBaseTwoKeyNav"
			},
			"ESCompMixPrimCollComp": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETCompMixPrimCollComp"
			},
			"ESKeyNavCont": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETKeyNavCont",
				"$NavigationPropertyBinding": {
					"NavPropertyETTwoKeyNavOne/NavPropertyETKeyNavOne": "ESKeyNav",
					"NavPropertyETTwoKeyNavMany/NavPropertyETKeyNavOne": "ESKeyNav",
					"NavPropertyETTwoKeyNavContOne": "ESTwoKeyNavCont",
					"NavPropertyETTwoKeyNavContMany": "ESTwoKeyNavCont",
					"PropertyCompNavCont/NavPropertyETKeyNavOne/NavPropertyETKeyNavOne": "ESKeyNav",
					"PropertyCompNavCont/NavPropertyETKeyNavMany/NavPropertyETKeyNavOne": "ESKeyNav",
					"PropertyCompNavCont/NavPropertyETTwoKeyNavOne/NavPropertyETKeyNavOne": "ESKeyNav",
					"PropertyCompNavCont/NavPropertyETTwoKeyNavMany/NavPropertyETKeyNavOne": "ESKeyNav"
				}
			},
			"ESTwoKeyNavCont": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNavCont",
				"$NavigationPropertyBinding": {
					"NavPropertyETKeyNavContOne/NavPropertyETTwoKeyNavContOne": "ESTwoKeyNavCont",
					"NavPropertyETKeyNavContMany/NavPropertyETTwoKeyNavContOne": "ESTwoKeyNavCont",
					"NavPropertyETKeyNavContOne/NavPropertyETTwoKeyNavOne/NavPropertyETKeyNavOne": "ESKeyNav",
					"NavPropertyETKeyNavContMany/NavPropertyETTwoKeyNavMany/NavPropertyETKeyNavOne": "ESKeyNav"
				}
			},
			"ESAllPrimDefaultValues": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAllPrimDefaultValues"
			},
			"ESAllGeography": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAllGeography"
			},
			"ESAllGeometry": {
				"$kind": "EntitySet",
				"$Type": "com.odata.v4.technical.scenario.ETAllGeometry"
			},
			"AIResetData": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UAResetData"
			},
			"AIRTString": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTString"
			},
			"AIRTTDString": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTTDString"
			},
			"AIRTCollTDString": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTCollTDString"
			},
			"AIRTCollStringTwoParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTCollStringTwoParam"
			},
			"AIRTCTTwoPrimParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTCTTwoPrimParam"
			},
			"AIRTCollCTTwoPrimParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTCollCTTwoPrimParam"
			},
			"AIRTETTwoKeyTwoPrimParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTETTwoKeyTwoPrimParam"
			},
			"AIRTCollETKeyNavParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTCollETKeyNavParam"
			},
			"AIRTESAllPrimParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTETAllPrimParam",
				"$EntitySet": "ESAllPrim"
			},
			"AIRTCollESAllPrimParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTCollETAllPrimParam",
				"$EntitySet": "ESAllPrim"
			},
			"AIRT": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UART"
			},
			"AIRTParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTParam"
			},
			"AIRTTwoParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTTwoParam"
			},
			"AIRTByteNineParam": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario.UARTByteNineParam"
			},
			"AIRTTimeOfDay": {
				"$kind": "ActionImport",
				"$Action": "com.odata.v4.technical.scenario._A_RTTimeOfDay_"
			},
			"FICRTTDString": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTTDString",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollTDString": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollTDString",
				"$IncludeInServiceDocument": true
			},
			"FINRTInt16": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFNRTInt16",
				"$IncludeInServiceDocument": true
			},
			"FINInvisibleRTInt16": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFNRTInt16"
			},
			"FINInvisible2RTInt16": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFNRTInt16"
			},
			"FICRTETKeyNav": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTETKeyNav"
			},
			"FICRTESTwoKeyNav": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTETTwoKeyNav",
				"$EntitySet": "ESTwoKeyNav"
			},
			"FICRTETTwoKeyNavParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTETTwoKeyNavParam",
				"$IncludeInServiceDocument": true
			},
			"FICRTString_": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTString_",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollStringTwoParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollStringTwoParam",
				"$IncludeInServiceDocument": true
			},
			"FICRTCTAllPrimTwoParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCTAllPrimTwoParam",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollETMixPrimCollCompTwoParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollETMixPrimCollCompTwoParam",
				"$IncludeInServiceDocument": true
			},
			"FINRTCollETMixPrimCollCompTwoParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFNRTCollETMixPrimCollCompTwoParam",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollCTTwoPrim": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollCTTwoPrim",
				"$IncludeInServiceDocument": true
			},
			"FICRTESMedia": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTETMedia",
				"$EntitySet": "ESMedia",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollESMedia": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollETMedia",
				"$EntitySet": "ESMedia",
				"$IncludeInServiceDocument": true
			},
			"FICRTCTTwoPrimTwoParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCTTwoPrimTwoParam",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollCTTwoPrimTwoParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollCTTwoPrimTwoParam",
				"$IncludeInServiceDocument": true
			},
			"FICRTCTTwoPrim": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCTTwoPrim",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollString": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollString",
				"$IncludeInServiceDocument": true
			},
			"FICRTString": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTString",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollESTwoKeyNavParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollETTwoKeyNavParam",
				"$EntitySet": "ESTwoKeyNav",
				"$IncludeInServiceDocument": true
			},
			"FINRTCollCTNavFiveProp": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFNRTCollCTNavFiveProp",
				"$IncludeInServiceDocument": true
			},
			"FICRTCollESKeyNavContParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFCRTCollETKeyNavContParam",
				"$EntitySet": "ESKeyNavCont",
				"$IncludeInServiceDocument": true
			},
			"FINRTByteNineParam": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario.UFNRTByteNineParam"
			},
			"FIC_RTTimeOfDay_": {
				"$kind": "FunctionImport",
				"$Function": "com.odata.v4.technical.scenario._FC_RTTimeOfDay_",
				"$IncludeInServiceDocument": true
			},
			"SI": {
				"$kind": "Singleton",
				"$Type": "com.odata.v4.technical.scenario.ETTwoPrim"
			},
			"SINav": {
				"$kind": "Singleton",
				"$Type": "com.odata.v4.technical.scenario.ETTwoKeyNav",
				"$NavigationPropertyBinding": {
					"NavPropertyETTwoKeyNavMany": "ESTwoKeyNav",
					"NavPropertyETTwoKeyNavOne": "ESTwoKeyNav",
					"NavPropertyETKeyNavOne": "ESKeyNav"
				}
			},
			"SIMedia": {
				"$kind": "Singleton",
				"$Type": "com.odata.v4.technical.scenario.ETMedia"
			}
		},
		"$EntityContainer": "com.odata.v4.technical.scenario.Container"
	};
});
