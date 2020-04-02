jQuery.sap.declare('sap.apf.testhelper.config.configurationForIntegrationTesting');
sap.apf.testhelper.config.getConfigurationForIntegrationTesting = function() {
	return {
		"steps": [{
			"type": "step",
			"id": "stepTemplate1",
			"request": "CompanyCodeQueryResults",
			"binding": "bindingTemplate3",
			"title": {
				"type": "label",
				"kind": "text",
				"key": "localTextReference2"
			},
			"picture": "resources/images/start.png",
			"hoverPicture": "resources/images/start.png",
			"longTitle": {
				"type": "label",
				"kind": "text",
				"key": "longTitleTest"
			},
			"thumbnail": {
				"type": "thumbnail",
				"leftUpper": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1LeftUpper"
				},
				"leftLower": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1LeftLower"
				},
				"rightUpper": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1RightUpper"
				},
				"rightLower": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1RightLower"
				}
			}
		},
		{
			"type": "step",
			"id": "stepInitial",
			"request": "CompanyCodeQueryResults",
			"binding": "bindingInitialStep",
			"title": {
				"type": "label",
				"kind": "text",
				"key": "localTextReference2"
			},
			"picture": "resources/images/start.png",
			"hoverPicture": "resources/images/start.png",
			"longTitle": {
				"type": "label",
				"kind": "text",
				"key": "longTitleTest"
			},
			"thumbnail": {
				"type": "thumbnail",
				"leftUpper": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1LeftUpper"
				},
				"leftLower": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1LeftLower"
				},
				"rightUpper": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1RightUpper"
				},
				"rightLower": {
					"type": "label",
					"kind": "text",
					"key": "localTextReferenceStepTemplate1RightLower"
				}
			}
		}],
		"requests": [{
			"type": "request",
			"id": "WCAClearedReceivablesQuery",
			"entityType": "WCAClearedReceivableQuery",
			"service": "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			"selectProperties": ["SAPClient",
			"CompanyCode",
			"Customer",
			"CustomerName",
			"CustomerCountryName"]
		},
		{
			"type": "request",
			"id": "CompanyCodeQueryResults",
			"entityType": "CompanyCodeQuery",
			"service": "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			"selectProperties": ["SAPClient",
			"CompanyCode",
			"Currency",
			"CurrencyShortName"]
		}],
		"bindings": [{
			"type": "binding",
			"id": "bindingTemplate1",
			"requiredFilters": ["CompanyCode",
			"SAPClient"],
			"representations": [{
				"type": "representation",
				"id": "representationId1",
				"label": {
					"type": "label",
					"kind": "text",
					"key": "representationText1"
				},
				"representationTypeId": "representationTypeId1",
				"parameter": {
					"type": "parameter",
					"sRepresentationType": "RepresentationTestDouble"
				}
			}]
		},
		{
			"type": "binding",
			"id": "bindingTemplate2",
			"requiredFilters": ["SAPClient"],
			"representations": [{
				"type": "representation",
				"id": "representationId1",
				"label": {
					"type": "label",
					"kind": "text",
					"key": "representationText1"
				},
				"representationTypeId": "representationTypeId1",
				"parameter": {
					"type": "parameter",
					"sRepresentationType": "RepresentationTestDouble"
				}
			}]
		},
		{
			"type": "binding",
			"id": "bindingTemplate3",
			"requiredFilters": ["SAPClient",
			"CompanyCode"],
			"representations": [{
				"type": "representation",
				"id": "representationId1",
				"label": {
					"type": "label",
					"kind": "text",
					"key": "representationText1"
				},
				"representationTypeId": "representationTypeId1",
				"parameter": {
					"type": "parameter",
					"sRepresentationType": "RepresentationTestDouble"
				}
			}]
		},
		{
			"type": "binding",
			"id": "bindingInitialStep",
			"requiredFilters": ["SAPClient"],
			"representations": [{
				"type": "representation",
				"id": "representationIdInitialStep",
				"label": {
					"type": "label",
					"kind": "text",
					"key": "representationTextInitialStep"
				},
				"representationTypeId": "representationInitialStep",
				"parameter": {
					"type": "parameter",
					"sRepresentationType": "RepresentationInitialStepTestDouble"
				}
			}]
		}],
		"categories": [{
			"type": "category",
			"id": "categoryTemplate1",
			"label": {
				"type": "label",
				"kind": "text",
				"key": "localTextReference2"
			},
			"steps": [{
				"type": "step",
				"id": "stepTemplate1"
			}]
		}],
		"representationTypes": [{
			"type": "representationType",
			"id": "representationTypeId1",
			"constructor": "sap.apf.testhelper.doubles.Representation",
			"picture": "resources/images/geomap-dsobycountry.png",
			"hoverPicture": "resources/images/geomap-dsobycountry-hover.png",
			"label": {
				"type": "label",
				"kind": "text",
				"key": "Text1"
			}
		}]
	};
};
