sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
		"use strict";

		return UIComponent.extend("sap.rules.ui.sample.TextRule.Component", {

			metadata: {
				"rootView": "sap.rules.ui.sample.TextRule.Page",
				"dependencies": {
					"libs": {
						"sap.ui.core": {},
						"sap.m": {},
						"sap.ui.layout": {},
						"sap.rules.ui": {}
					}
				},
				config: {
					sample: {
						stretch: true,
						files: [
							"Page.view.xml",
							"Page.controller.js",
							"localService/vocabulary/mockdata/metadata.xml",
							"localService/vocabulary/mockdata/Vocabularies.json",
							"localService/vocabulary/mockdata/Associations.json",
							"localService/vocabulary/mockdata/Attributes.json",
							"localService/vocabulary/mockdata/DataObjects.json",
							"localService/vocabulary/mockdata/Rules.json",
							"localService/vocabulary/mockdata/ValueHelps.json",
							"localService/rule/mockdata/metadata.xml",
							"localService/rule/mockdata/Rules.json",
							"localService/rule/mockdata/TextRuleResultExpressions.json",
							"localService/rule/mockdata/TextRuleResults.json",
							"localService/rule/mockdata/TextRuleConditions.json",
							"localService/rule/mockdata/TextRules.json",
							"localService/rule/mockdata/Projects.json",
							"localService/rule/mockdata/RuleServices.json",
							"localService/rule/mockdata/RulesetRules.json",
							"localService/rule/mockdata/RulesetRuleServices.json",
							"localService/rule/mockdata/Rulesets.json",
							"localService/rule/mockdata/responses.json"
						] 
					}
				}

			}

		});

	});