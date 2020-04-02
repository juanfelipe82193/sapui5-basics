jQuery.sap.declare('sap.apf.modeler.migration.TesthelperConfigConfigurationForIntegrationTesting');
var ConfigurationForIntegrationTesting = (function() {
	return {
		steps : [ {
			type : "step", // optional
			id : "stepTemplate1",
			request : "CompanyCodeQueryResults",
			binding : "bindingTemplate3",
			title : {
				type : "label", // optional
				kind : "text",
				key : "localTextReference2"
			},
			picture : "resources/images/start.png",
			hoverPicture : "resources/images/start.png",
			longTitle : { // optional
				type : "label", // optional
				kind : "text",
				key : "longTitleTest"
			},
			thumbnail : {
				type : "thumbnail",
				leftUpper : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1LeftUpper"
				},
				leftLower : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1LeftLower"
				},
				rightUpper : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1RightUpper"
				},
				rightLower : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1RightLower"
				}
			},
			categories : [ {
				type : "category", // optional
				id : "categoryTemplate1"
			} ]
		}, {
			type : "step", // optional
			id : "stepInitial",
			request : "CompanyCodeQueryResults",
			binding : "bindingInitialStep",
			title : {
				type : "label", // optional
				kind : "text",
				key : "localTextReference2"
			},
			picture : "resources/images/start.png",
			hoverPicture : "resources/images/start.png",
			longTitle : { // optional
				type : "label", // optional
				kind : "text",
				key : "longTitleTest"
			},
			thumbnail : {
				type : "thumbnail",
				leftUpper : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1LeftUpper"
				},
				leftLower : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1LeftLower"
				},
				rightUpper : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1RightUpper"
				},
				rightLower : {
					type : "label", // optional
					kind : "text",
					key : "localTextReferenceStepTemplate1RightLower"
				}
			},
			categories : [ {
				type : "category", // optional
				id : "initial"
			} ]
		} ],
		requests : [ {
			type : "request",
			id : "WCAClearedReceivablesQuery",
			entityType : "WCAClearedReceivableQuery",
			service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			selectProperties : [ 'SAPClient', 'CompanyCode', 'Customer', 'CustomerName', 'CustomerCountryName' ]
		}, {
			type : "request",
			id : "CompanyCodeQueryResults",
			entityType : "CompanyCodeQuery",
			service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
			selectProperties : [ 'SAPClient', 'CompanyCode', 'Currency', 'CurrencyShortName' ]
		} ],
		bindings : [ {
			type : "binding",
			id : "bindingTemplate1",
			requiredFilters : [ 'CompanyCode', 'SAPClient' ], // set of filters required to uniquely identify rows/selection
			representations : [ {
				type : "representation",
				id : "representationId1",
				label : {
					type : "label",
					kind : "text",
					key : "representationText1"
				},
				representationTypeId : "representationTypeId1",
				parameter : {
					type : "parameter",
					sRepresentationType : "RepresentationTestDouble"
				}
			} ]
		//representations
		}, {
			type : "binding",
			id : "bindingTemplate2",
			requiredFilters : [ 'SAPClient' ], // set of filters required to uniquely identify rows/selection
			representations : [ {
				type : "representation",
				id : "representationId1",
				label : {
					type : "label",
					kind : "text",
					key : "representationText1"
				},
				representationTypeId : "representationTypeId1",
				parameter : {
					type : "parameter",
					sRepresentationType : "RepresentationTestDouble"
				}
			} ]
		//representations
		}, {
			type : "binding",
			id : "bindingTemplate3",
			requiredFilters : [ 'SAPClient', 'CompanyCode' ],
			representations : [ {
				type : "representation",
				id : "representationId1",
				label : {
					type : "label",
					kind : "text",
					key : "representationText1"
				},
				representationTypeId : "representationTypeId1",
				parameter : {
					type : "parameter",
					sRepresentationType : "RepresentationTestDouble"
				}
			} ]
		//representations
		}, {
			type : "binding",
			id : "bindingInitialStep",
			requiredFilters : [ 'SAPClient' ], // set of filters required to uniquely identify rows/selection
			representations : [ {
				type : "representation",
				id : "representationIdInitialStep",
				label : {
					type : "label",
					kind : "text",
					key : "representationTextInitialStep"
				},
				representationTypeId : "representationInitialStep",
				parameter : {
					type : "parameter",
					sRepresentationType : "RepresentationInitialStepTestDouble"
				}
			} ]
		//representations
		} ],// bindings
		categories : [ {
			type : "category", // optional
			id : "categoryTemplate1",
			label : {
				type : "label", // optional
				kind : "text",
				key : "localTextReference2" // key
			}
		} ], // categories
		representationTypes : [ {
			type : "representationType", // optional
			id : "representationTypeId1",
			constructor : "sap.apf.testhelper.doubles.Representation",
			picture : "resources/images/geomap-dsobycountry.png",
			hoverPicture : "resources/images/geomap-dsobycountry-hover.png",
			label : {
				type : "label", // optional
				kind : "text",
				key : "Text1" // key
			}
		} ]
	};
})();
