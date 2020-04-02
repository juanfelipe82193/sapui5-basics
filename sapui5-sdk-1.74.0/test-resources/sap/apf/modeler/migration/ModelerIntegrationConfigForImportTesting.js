var configForTesting = {
	"applicationTitle" : {
		"type" : "label",
		"kind" : "text",
		"key" : "54A8B5D447205764E10000000A445B6D"
	},
	"steps" : [ {
		"type" : "step",
		"description" : "Revenue by Sales Organization",
		"request" : "request-for-Step-25",
		"binding" : "binding-for-Step-25",
		"id" : "Step-25",
		"title" : {
			"type" : "label",
			"kind" : "text",
			"key" : "54A8B69B47205764E10000000A445B6D"
		},
		"categories" : [ {
			"type" : "category",
			"id" : "Category-1"
		} ],
		"longTitle" : {
			"type" : "label",
			"kind" : "text",
			"key" : "00000000000000000000000000000000"
		}
	}, {
		"type" : "step",
		"description" : "Revenue",
		"request" : "request-for-Step-2",
		"binding" : "binding-for-Step-2",
		"id" : "Step-2",
		"title" : {
			"type" : "label",
			"kind" : "text",
			"key" : "5463C1AF0C93EF66E10000000A154CDB"
		},
		"categories" : [ {
			"type" : "category",
			"id" : "Category-1"
		} ]
	} ],
	requests : [ {
		"type" : "request",
		"id" : "request-for-Step-25",
		"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		"entitySet" : "WCARevenueQuery",
		"selectProperties" : [ "SalesOrganization", "SalesOrganizationName", "DisplayCurrencyDecimals", "RevenueAmountInDisplayCrcy_E.CURRENCY", "RevenueAmountInDisplayCrcy_E" ]
	}, {
		"type" : "request",
		"id" : "request-for-Step-2",
		"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		"entitySet" : "WCARevenueQuery",
		"selectProperties" : [ "DisplayCurrency", "DisplayCurrencyDecimals", "RevenueAmountInDisplayCrcy_E.CURRENCY", "RevenueAmountInDisplayCrcy_E" ]
	} ],
	bindings : [ {
		"type" : "binding",
		"id" : "binding-for-Step-25",
		"requiredFilters" : [ "SalesOrganization" ],
		"representations" : [ {
			"id" : "Step-25-Representation-1",
			"representationTypeId" : "ColumnChart",
			"parameter" : {
				"dimensions" : [ {
					"fieldName" : "SalesOrganization",
					"kind" : "xAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "54A8B69347205764E10000000A445B6D"
					}
				} ],
				"measures" : [ {
					"fieldName" : "RevenueAmountInDisplayCrcy_E",
					"kind" : "yAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "5463BFCF0C93EF66E10000000A154CDB"
					}
				} ],
				"alternateRepresentationTypeId" : "TableRepresentation",
				"width" : {},
				"orderby" : [ {
					"property" : "RevenueAmountInDisplayCrcy_E",
					"ascending" : false
				} ]
			},
			"thumbnail" : {
				"type" : "thumbnail",
				"leftUpper" : {
					"type" : "label",
					"kind" : "text",
					"key" : "5463BFD20C93EF66E10000000A154CDB"
				},
				"rightLower" : {
					"type" : "label",
					"kind" : "text",
					"key" : "54A8B6A047205764E10000000A445B6D"
				}
			}
		},

		{
			"id" : "Step-25-Representation-2",
			"representationTypeId" : "ColumnChart",
			"parameter" : {
				"dimensions" : [ {
					"fieldName" : "SalesOrganization",
					"kind" : "xAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "54A8B69347205764E10000000A445B6D"
					}
				} ],
				"measures" : [ {
					"fieldName" : "RevenueAmountInDisplayCrcy_E",
					"kind" : "yAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "5463BFCF0C93EF66E10000000A154CDB"
					}
				} ],
				"alternateRepresentationTypeId" : "TableRepresentation",
				"width" : {},
				"orderby" : [ {
					"property" : "SalesOrganization",
					"ascending" : true
				} ]
			},
			"thumbnail" : {
				"type" : "thumbnail",
				"leftUpper" : {
					"type" : "label",
					"kind" : "text",
					"key" : "5463BFD20C93EF66E10000000A154CDB"
				},
				"rightLower" : {
					"type" : "label",
					"kind" : "text",
					"key" : "54A8B6A047205764E10000000A445B6D"
				}
			}
		} ]
	}, {
		"type" : "binding",
		"id" : "binding-for-Step-2",
		"requiredFilters" : [],
		"representations" : [ {
			"id" : "Step-2-Representation-1",
			"representationTypeId" : "ColumnChart",
			"parameter" : {
				"dimensions" : [ {
					"fieldName" : "DisplayCurrency",
					"kind" : "xAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "5463A2A11A2F3DEAE10000000A445B6D"
					}
				} ],
				"measures" : [ {
					"fieldName" : "RevenueAmountInDisplayCrcy_E",
					"kind" : "yAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "5463BFCF0C93EF66E10000000A154CDB"
					}
				} ],
				"alternateRepresentationTypeId" : "TableRepresentation",
				"width" : {}
			},
			"thumbnail" : {
				"type" : "thumbnail",
				"leftUpper" : {
					"type" : "label",
					"kind" : "text",
					"key" : "5463BFD20C93EF66E10000000A154CDB"
				}
			}
		} ]
	} ],

	"categories" : [ {
		"type" : "category",
		"description" : "All Steps",
		"id" : "Category-1",
		"label" : {
			"type" : "label",
			"kind" : "text",
			"key" : "54A8AEC047205764E10000000A445B6D"
		}
	} ],

	"facetFilters" : [],
	"navigationTargets" : [],
	"representationTypes" : [],

	"configHeader" : {
		"Application" : "54529684BA632664E10000000A154CDB",
		"ApplicationName" : "Test",
		"SemanticObject" : "FioriApplication",
		"AnalyticalConfiguration" : "54880B076289A95EE10000000A445B6D",
		"AnalyticalConfigurationName" : "APF Demo Configuration - Revenue Analysis",
		"UI5Version" : "1.27.0-SNAPSHOT",
		"CreationUTCDateTime" : "/Date(1418303737436)/",
		"LastChangeUTCDateTime" : "/Date(1421685436413)/"
	}
};