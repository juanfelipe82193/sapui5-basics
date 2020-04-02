/* global sap */
/**
 *
 * @param {string} [sConfigChange] optional. Controls what config version to be returned. When undefined function returns main object oConfig.
 * @returns {*}
 */
sap.ui.define([], function(){
	'use strict';

	function getSampleConfiguration(sConfigChange) {
		'use strict';
		var oConfig = {
			analyticalConfigurationName: "configForTesting",
			steps: [{
				type: "step", // optional
				id: "stepTemplate1",
				request: "requestTemplate1",
				binding: "bindingTemplate1",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				},
				longTitle: { // optional
					type: "label", // optional
					kind: "text",
					key: "longTitleTest"
				},
				thumbnail: {
					type: "thumbnail",
					leftUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftUpper"
					},
					leftLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftLower"
					},
					rightUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightUpper"
					},
					rightLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightLower"
					}
				}
			}, {
				type: "step", // optional
				id: "stepTemplate2",
				request: "requestTemplate2",
				binding: "bindingTemplate2",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				},
				longTitle: { // optional
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				},
				thumbnail: {
					type: "thumbnail",
					leftUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate2LeftUpper"
					},
					leftLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate2LeftLower"
					},
					rightUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate2RightUpper"
					},
					rightLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate2RightLower"
					}
				}
			}, {
				type: "step", // optional
				id: "stepTemplate3",
				request: "requestTemplate3",
				binding: "bindingTemplate3",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				},
				longTitle: { // optional
					type: "label", // optional
					kind: "text",
					key: "longTitleTest"
				},
				navigationTargets: [{
					id: 'nav-MM',
					type: 'navigationTarget'
				}],
				thumbnail: {
					type: "thumbnail",
					leftUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftUpper"
					},
					leftLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftLower"
					},
					rightUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightUpper"
					},
					rightLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightLower"
					}
				}
			}, {
				type: "step", // optional
				id: "stepTemplateComponent1",
				request: "requestTemplate1",
				binding: "bindingTemplateCompound1",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				},
				longTitle: { // optional
					type: "label", // optional
					kind: "text",
					key: "longTitleTest"
				},
				thumbnail: {
					type: "thumbnail",
					leftUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftUpper"
					},
					leftLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftLower"
					},
					rightUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightUpper"
					},
					rightLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightLower"
					}
				}
			}, {
				type: "step", // optional
				id: "stepTemplateComponent2",
				request: "requestTemplate1",
				binding: "bindingTemplateCompound2",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				},
				longTitle: { // optional
					type: "label", // optional
					kind: "text",
					key: "longTitleTest"
				},
				thumbnail: {
					type: "thumbnail",
					leftUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftUpper"
					},
					leftLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1LeftLower"
					},
					rightUpper: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightUpper"
					},
					rightLower: {
						type: "label", // optional
						kind: "text",
						key: "localTextReferenceStepTemplate1RightLower"
					}
				}
			}, {
				type: "step", // optional
				id: "step0",
				request: "requestTemplate1",
				binding: "bindingTemplateSameRepresentationTypesDifferentRepresentations",
				title: {
					type: "label", // optional
					kind: "text",
					key: "titleStep0"
				}
			}, {
				type: "hierarchicalStep",
				id: "hierarchicalStepWithoutSelectableProperty",
				hierarchyProperty: "HierarchyProperty",
				request: "requestTemplate1",
				binding: "hierarchicalBinding1",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				}
			}, {
				type: "hierarchicalStep",
				id: "hierarchicalStepId",
				hierarchyProperty: "hierarchyProperty",
				request: "hierarchicalRequestTemplate1",
				binding: "hierarchicalBinding",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				}
			}, {
				type: "hierarchicalStep",
				id: "nonHierarchicalStepId",
				hierarchyProperty: "nonHierarchyProperty",
				request: "hierarchicalRequestTemplate1",
				binding: "bindingTemplateInitialStep",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				}
			}, {
				type: "step",
				id: "stepWithRequiredFilterOptions",
				request: "requestTemplate1",
				binding: "bindingTemplateWithRequiredFilterOptions",
				title: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2"
				}
			}],
			requests: [{
				type: "request",
				id: "requestTemplate1",
				service: "dummy.xsodata",
				entityType: "EntityType1",
				selectProperties: ["PropertyOne", "PropertyTwo"]
			}, {
				type: "request",
				id: "requestTemplate2",
				service: "dummy.xsodata",
				entityType: "entityTypeWithParams",
				selectProperties: ["PropertyOne", "PropertyTwo"]
			}, {
				type: "request",
				id: "requestTemplate3",
				service: "dummy.xsodata",
				entityType: "EntityType3",
				selectProperties: ["PropertyOne", "PropertyTwo"]
			}, {
				type: "request",
				id: "hierarchicalRequestTemplate1",
				service: "test/hierarchy.xsodata",
				entityType: "EntityType1",
				selectProperties: ["PropertyOne", "PropertyTwo"]
			}], // steps
			bindings: [{
				type: "binding",
				id: "bindingTemplate1",
				requiredFilters: ["Customer"], // set of filters required to uniquely identify rows selection
				representations: [{
					type: "representation",
					id: "representationId1",
					label: {
						type: "label",
						kind: "text",
						key: "representationText1"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						id: 'double1',
						type: "parameter",
						sRepresentationType: "RepresentationTestDouble"
					}
				}, {
					type: "representation",
					id: "representationId2",
					label: {
						type: "label",
						kind: "text",
						key: "representationText2"
					},
					representationTypeId: "representationTypeId2",
					parameter: {
						type: "parameter",
						sRepresentationType: "Representation2TestDouble"
					}
				}, {
					type: "representation",
					id: "representationId3",
					//label is missing on purpose
					representationTypeId: "representationTypeId3",
					parameter: {
						type: "parameter",
						sRepresentationType: "Representation2TestDouble"
					}
				}, {
					type: "representation",
					id: "representationId4",
					label: {
						type: "label",
						kind: "text",
						key: "representationText4"
					},
					representationTypeId: "representationTypeId3",
					parameter: {
						type: "parameter",
						sRepresentationType: "Representation2TestDouble",
						sort: {
							sortField: "CreditAmtInDisplayCrcy_E",
							descending: true
						}
					}
				}]
				// representations
			}, {
				type: "binding",
				id: "bindingTemplate2",
				requiredFilters: ["stringProperty"], // set of filters required to uniquely identify rows selection
				representations: [{
					type: "representation",
					id: "representationId1",
					label: {
						type: "label",
						kind: "text",
						key: "representationText1"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						id: 'double1',
						sRepresentationType: "Representation2TestDouble"
					}
				}]
			}, {
				type: "binding",
				id: "hierarchicalBinding",
				requiredFilters: ["hierarchyPropertyNodeID"],
				representations: []
			}, {
				type: "binding",
				id: "hierarchicalBinding1",
				requiredFilters: [],
				representations: []
			}, {
				type: "binding",
				id: "bindingTemplate3",
				requiredFilters: ["Customer"], // set of filters required to uniquely identify rows selection
				representations: [{
					type: "representation",
					id: "representationId2",
					label: {
						type: "label",
						kind: "text",
						key: "representationText2"
					},
					representationTypeId: "representationTypeId2",
					parameter: {
						type: "parameter",
						sRepresentationType: "Representation2TestDouble"
					}
				}, {
					type: "representation",
					id: "representationId1",
					label: {
						type: "label",
						kind: "text",
						key: "representationText1"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						sRepresentationType: "RepresentationTestDouble"
					}
				}]
				// representations
			}, {
				type: "binding",
				id: "bindingTemplateInitialStep",
				requiredFilters: [], // set of filters required to uniquely identify rows selection
				representations: []
				// representations
			}, {
				type: "binding",
				id: "bindingTemplateCompound1",
				requiredFilters: ['SAPClient', 'CoArea'], // set of filters required to uniquely identify rows selection
				representations: [{
					type: "representation",
					id: "representationId1",
					label: {
						type: "label",
						kind: "text",
						key: "representationText1"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						sRepresentationType: "RepresentationTestDouble"
					}
				}]
				// representations
			}, {
				type: "binding",
				id: "bindingTemplateCompound2",
				requiredFilters: ['SAPClient', 'CoArea', 'Project'], // set of filters required to uniquely identify rows selection
				representations: [{
					type: "representation",
					id: "representationId1",
					label: {
						type: "label",
						kind: "text",
						key: "representationText1"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						sRepresentationType: "RepresentationTestDouble"
					}
				}]
				// representations
			}, {
				type: "binding",
				id: "bindingTemplateSameRepresentationTypesDifferentRepresentations",
				requiredFilters: [], // set of filters required to uniquely identify rows selection
				representations: [{
					type: "representation",
					id: "representationId1",
					label: {
						type: "label",
						kind: "text",
						key: "representationText1"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						sRepresentationType: "RepresentationTestDouble"
					}
				}, {
					type: "representation",
					id: "representationId2",
					label: {
						type: "label",
						kind: "text",
						key: "representationText2"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						sRepresentationType: "RepresentationTestDouble"
					}
				}]
				// representations
			}, {
				type: "binding",
				id: "bindingTemplateWithRequiredFilterOptions",
				requiredFilters: ["filterProperty"],
				requiredFilterOptions: {
					labelDiplsayOption: "Text",
					fieldDesc: {
						"type": "label",
						"kind": "text",
						"key": "filter property text key"
					}
				},
				representations: [{
					id: "representationId1",
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						sRepresentationType: "RepresentationTestDouble"
					}
				}]
			}],// bindings
			categories: [{
				type: "category", // optional
				id: "categoryTemplate1",
				label: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2" // key
				},
				steps: [{
					type: "step",
					id: "stepTemplate1"
				}, {
					type: "step",
					id: "stepTemplate2"
				}, {
					type: "hierarchicalStep",
					id: "hierarchicalStepId"
				}]
			}, {
				type: "category", // optional
				id: "categoryTemplate2",
				label: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2" // key
				},
				steps: [{
					type: "step",
					id: "stepTemplate2"
				}]
			}, {
				type: "category", // optional
				id: "categoryTemplate3",
				label: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2" // key
				},
				steps: [{
					type: "step",
					id: "stepTemplate3"
				}, {
					type: "step",
					id: "stepTemplateComponent1"
				}, {
					type: "step",
					id: "stepTemplateComponent2"
				}]
			}, {
				type: "category", // optional
				id: "initial",
				label: {
					type: "label", // optional
					kind: "text",
					key: "localTextReference2" // key
				},
				steps: [{
					type: "step",
					id: "step0"
				}]
			}], // categories
			representationTypes: [{
				type: "representationType", // optional
				id: "representationTypeId1",
				picture: "sap-icon://line-chart",
				constructor: "sap.apf.testhelper.doubles.Representation",
				label: { // optional
					type: "label", // optional
					kind: "text",
					key: "Text1" // key
				}
			}, {
				type: "representationType", // optional
				id: "representationTypeId2",
				constructor: "sap.apf.testhelper.doubles.Representation",
				picture: "sap-icon://vertical-bar-chart-2",
				label: { // optional
					type: "label", // optional
					kind: "text",
					key: "Text2" // key
				}
			}, {
				type: "representationType", // optional
				id: "representationTypeId3",
				constructor: "sap.apf.testhelper.doubles.Representation",
				picture: "sap-icon://bar-chart",
				label: { // optional
					type: "label", // optional
					kind: "text",
					key: "Text2" // key
				}
			}, {
				type: "representationType", // optional
				id: "representationTypeInitialStep",
				constructor: "sap.apf.testhelper.doubles.Representation",
				picture: "sap-icon://table-chart"
			}],
			navigationTargets: [{
				id: 'nav-SD',
				semanticObject: "DaysSalesOutstanding",
				action: "analyzeDSO",
				parameters: [{
					key: "key",
					value: "value"
				}]

			}, {
				id: 'nav-MM',
				semanticObject: "DaysPayablesOutstanding",
				action: "analyzeDPO",
				isStepSpecific: true
			}],
			configHeader: {
				"Application": "12345",
				"ApplicationName": "APF Application",
				"SemanticObject": "SemObj",
				"AnalyticalConfiguration": "67890",
				"AnalyticalConfigurationName": "APF Configuration",
				"UI5Version": "1.XX.XX",
				"CreationUTCDateTime": "/Date(1423809274738)/",
				"LastChangeUTCDateTime": "/Date(1423809274738)/"
			}
		};

		function initialStepRepresentation() {
			var i;
			var oRepresentation = {
				type: "representation",
				id: "representationIdInitial",
				label: {
					type: "label",
					kind: "text",
					key: "representationTextInitial"
				},
				representationTypeId: "representationTypeInitialStep",
				parameter: {
					type: "parameter",
					sRepresentationType: "RepresentationInitialStepTestDouble"
				}
			};
			for (i = 0; i < oConfig.bindings.length; i++) {
				if (oConfig.bindings[i].id === "bindingTemplateInitialStep") {
					oConfig.bindings[i].representations.push(oRepresentation);
					return oConfig;
				}
			}
			return oConfig;
		}

		function representationWithoutId() {
			var i;
			var oRepresentation = {
				type: "representation",
				representationTypeId: "representationTypeId1",
				parameter: {
					id: 'double1',
					type: "parameter",
					sRepresentationType: "RepresentationTestDouble"
				}
			};
			for (i = 0; i < oConfig.bindings.length; i++) {
				if (oConfig.bindings[i].id === "bindingTemplate1") {
					oConfig.bindings[i].representations.push(oRepresentation);
					return oConfig;
				}
			}
			return oConfig;
		}

		function representationsWithDuplicatedtIds() {
			var i;
			var oRepresentation = {
				type: "representation",
				representationTypeId: "representationTypeId1",
				id: "representationId1",
				parameter: {
					id: 'double1',
					type: "parameter",
					sRepresentationType: "RepresentationTestDouble"
				}
			};
			for (i = 0; i < oConfig.bindings.length; i++) {
				if (oConfig.bindings[i].id === "bindingTemplate1") {
					oConfig.bindings[i].representations.push(oRepresentation);
					return oConfig;
				}
			}
			return oConfig;
		}

		function initialStepRepresentationWithoutRequestForInitialStep() {
			var config = initialStepRepresentation();
			var i;
			for (i = 0; i < config.bindings.length; i++) {
				if (config.steps[i].id === "initialStep") {
					config.steps[i].request = undefined;
					return config;
				}
			}
		}

		function filterMapping() {
			var oStep = {
				id: "stepFilterMapping",
				binding: "bindingTemplate1",
				request: "requestTemplate1",
				filterMapping: {
					requestForMappedFilter: "requestFilterMapping",
					target: ["targetProperty1", "targetProperty2"],
					keepSource: "false"
				},
				categories: [{
					type: "category", // optional
					id: "categoryTemplate1"
				}]
			};
			var oRequest = {
				type: "request",
				id: "requestFilterMapping",
				service: "serviceForFilterMapping.xsodata",
				entityType: "entitytypeForFilterMapping",
				selectProperties: ["selectProperty1", "selectProperty2"]
			};
			oConfig.requests.push(oRequest);
			oConfig.steps.push(oStep);
			return oConfig;
		}

		function filterMappingKeepSource() {
			var oStep = {
				id: "stepFilterMappingKeepSource",
				binding: "bindingTemplate1",
				request: "requestTemplate1",
				filterMapping: {
					requestForMappedFilter: "requestFilterMapping",
					target: ["targetProperty1", "targetProperty2"],
					keepSource: "true"
				},
				categories: [{
					type: "category", // optional
					id: "categoryTemplate1"
				}]
			};
			var oRequest = {
				type: "request",
				id: "requestFilterMapping",
				service: "serviceForFilterMapping.xsodata",
				entityType: "entitytypeForFilterMapping",
				selectProperties: ["selectProperty1", "selectProperty2"]
			};
			oConfig.requests.push(oRequest);
			oConfig.steps.push(oStep);
			return oConfig;
		}

		function filterMappingOneTarget() {
			var oStep = {
				id: "stepFilterMappingKeepSource",
				binding: "bindingTemplate1",
				request: "requestTemplate1",
				filterMapping: {
					requestForMappedFilter: "requestFilterMapping",
					target: ["targetProperty1"],
					keepSource: "true"
				},
				categories: [{
					type: "category", // optional
					id: "categoryTemplate1"
				}]
			};
			var oRequest = {
				type: "request",
				id: "requestFilterMapping",
				service: "serviceForFilterMapping.xsodata",
				entityType: "entitytypeForFilterMapping",
				selectProperties: ["selectProperty1", "selectProperty2"]
			};
			oConfig.requests.push(oRequest);
			oConfig.steps.push(oStep);
			return oConfig;
		}

		function twoFilterMappingSteps() {
			var oStep1 = {
				id: "stepFilterMapping",
				binding: "bindingTemplate1",
				request: "requestTemplate1",
				filterMapping: {
					requestForMappedFilter: "requestFilterMappingRegion",
					target: ["Region"],
					keepSource: "false"
				},
				categories: [{
					type: "category", // optional
					id: "categoryTemplate1"
				}]
			};
			var oRequest1 = {
				type: "request",
				id: "requestFilterMappingRegion",
				service: "serviceForFilterMapping.xsodata",
				entityType: "entitytypeForFilterMapping",
				selectProperties: ["Region"]
			};
			var oStep2 = {
				id: "stepFilterMappingKeepSource",
				binding: "bindingTemplate1",
				request: "requestTemplate1",
				filterMapping: {
					requestForMappedFilter: "requestFilterMappingTown",
					target: ["Town"],
					keepSource: "true"
				},
				categories: [{
					type: "category", // optional
					id: "categoryTemplate1"
				}]
			};
			var oRequest2 = {
				type: "request",
				id: "requestFilterMappingTown",
				service: "serviceForFilterMapping.xsodata",
				entityType: "entitytypeForFilterMapping",
				selectProperties: ["Town"]
			};
			oConfig.requests.push(oRequest1);
			oConfig.requests.push(oRequest2);
			oConfig.steps.push(oStep1);
			oConfig.steps.push(oStep2);
			return oConfig;
		}

		function secondServiceDocument() {
			var oRequest = {
				type: "request",
				id: "secondServiceDocument",
				service: "secondServiceDocument.xsodata",
				entityType: "entitytypeForSecondServiceDocument",
				selectProperties: ["selectProperty1", "selectProperty2"]
			};
			oConfig.requests.push(oRequest);
			return oConfig;
		}

		function addTwoFacetFilters() {
			var facetFilters = [{
				type: "facetFilter",
				id: "filterIdA",
				property: 'property1',
				valueHelpRequest: 'valueHelpRequestProperty1',
				filterResolutionRequest: 'filterResolutionRequestProperty1',
				multiSelection: false,
				preselectionDefaults: [1, 2, 3],
				preselectionFunction: undefined,
				label: {
					type: 'label',
					kind: 'text',
					key: 'property1'
				}
			}, {
				type: "facetFilter",
				id: "filterIdB",
				property: 'property2',
				valueHelpRequest: 'valueHelpRequestProperty2',
				filterResolutionRequest: 'filterResolutionRequestProperty2',
				multiSelection: false,
				preselectionDefaults: ['A', 'B', 'C'],
				preselectionFunction: undefined,
				label: {
					type: 'label',
					kind: 'text',
					key: 'property1'
				}
			}];
			oConfig.facetFilters = facetFilters;
			return oConfig;
		}

		function addSmartFilterBar() {
			oConfig.smartFilterBar = {
				type: "smartFilterBar",
				id: "SmartFilterBar-1",
				service: "/test/service",
				entityType: "testEntityType"
			};
			return oConfig;
		}

		function wrongRepresentationConstructor() {
			oConfig.representationTypes[2].constructor = "sap.apf.testhelper.doubles.anyObjectButNoFunction";
			return oConfig;
		}

		function malformedStepAssignmentForCategory() {
			oConfig.categories[0].steps.push({
				type: "step",
				id2: "step0"
			});
			return oConfig;
		}

		function notExistingStepAssignedToCategory() {
			oConfig.categories[0].steps.push({
				type: "step",
				id: "idForNotExistingStep"
			});
			return oConfig;
		}

		switch (sConfigChange) {
			case "initialStepRepresentation":
				return initialStepRepresentation();
			case "representationWithoutId":
				return representationWithoutId();
			case "representationsWithDuplicatedtIds":
				return representationsWithDuplicatedtIds();
			case "initialStepRepresentationWithoutRequestForInitialStep":
				return initialStepRepresentationWithoutRequestForInitialStep();
			case "filterMapping":
				return filterMapping();
			case "filterMappingKeepSource":
				return filterMappingKeepSource();
			case "twoFilterMappingSteps":
				return twoFilterMappingSteps();
			case "wrongRepresentationConstructor":
				return wrongRepresentationConstructor();
			case "secondServiceDocument":
				return secondServiceDocument();
			case "addTwoFacetFilters":
				return addTwoFacetFilters();
			case "addSmartFilterBar":
				return addSmartFilterBar();
			case "malformedStepAssignmentForCategory":
				return malformedStepAssignmentForCategory();
			case "notExistingStepAssignedToCategory":
				return notExistingStepAssignedToCategory();
			case "filterMappingOneTarget":
				return filterMappingOneTarget();
			default:
				return oConfig;
		}
	}
	/*BEGIN_COMPATIBILITY*/
	sap.apf.testhelper.config.getSampleConfiguration = getSampleConfiguration;
	/*END_COMPATIBILITY*/

	return {
		getSampleConfiguration: getSampleConfiguration
	}; // static
}, true /* global_export*/);