/*/
 * Created on 23.11.2018. 
 * Copyright(c) 2018 SAP SE 
 */
/*global sap */

sap.ui.define([
	'sap/base/Log'
], function(sapLog) {
	'use strict';

	function step1(){
		return {
			type:"step",
			id: "step1",
			binding: "binding1",
			request: "request1",
			title: {
				kind: "text",
				key: "stepTextKey1"
			},
			categories: []
		};
	}
	function binding1(){
		return {
			type:"binding",
			id: "binding1",
			requiredFilters: [],
			representations: [{
				id: "representationId1",
				representationTypeId: "representationTypeId1",
				parameter: {
					"dimensions": [],
					"measures": [],
					"properties": []
				},
				"width": {},
				"orderby": []
			}]
		};
	}
	function request1(){
		return {
			type:"request",
			id: "request1",
			entityType : "hugo",
			service : "otto"
		};
	}
	function representationType1(){
		return {
			id: "representationTypeId1",
			picture: "sap-icon://line-chart",
			constructor: "sap.apf.testhelper.doubles.Representation"
		}
	}
	function getConfigurationById(id){
		switch (id){
			case step1().id:
				return step1();
			case request1().id:
				return request1();
			case binding1().id:
				return binding1();
			case representationType1().id:
				return representationType1();
			default:
				sapLog.error("TEST: getConfigurationById undefined id: " + id);
				return null;
		}
	}

	function createMessageHandler(){
		return {
			setTextResourceHandler: function() {
			},
			check: function(condition, text) {
				if (!condition) {
					sapLog.error(text);
				}
			},
			createMessageObject: function(oConfig) {
				return oConfig;
			},
			putMessage: function(oMessageObject) {
				if (oMessageObject.code === "6001"
				|| oMessageObject.code === "6002"){
					return;
				}
				sapLog.error(" sap.ui.fixture.CoreInstance.putMessage: "
					+ oMessageObject.code + "  " + oMessageObject.aParameters.toString());
			}
		}
	}

	function createInjectForCore(testContext){
		return {
			coreProbe: function(references) {
				testContext.coreReferences = references;
			},
			instances: {
				messageHandler: createMessageHandler(),
				startParameter: {
					getSapSystem: function() {
					},
					isLrepActive: function() {// ResourcePathHandler does not load a configuration.
						return false;
					}
				},
				datajs: {// capture any potential request
					"origin": "coreInject.instances.datajs"
				}
			},
			constructors: {
				Persistence: function() {// non Persistence, capture
					return {
						"origin": "coreInject.constructors.sendGetInBatch.callbackAfterRequest"
					};
				},
				Request: function() {
					this.sendGetInBatch = function(oFilterForRequest, callbackAfterRequest){
						callbackAfterRequest({
							"origin": "coreInject.constructors.sendGetInBatch.callbackAfterRequest"
						});
					};
				}
			}
		};
	}

	function createRepresentation(/*sPath, oConfig*/) {
		return {
			getFilterMethodType: function(){
				return {
					"origin": "createRepresentation.getFilterMethodType"
				};
			}
		};
	}
	return {
		createMessageHandler: createMessageHandler,
		getConfigurationById: getConfigurationById,
		createInjectForCore: createInjectForCore,
		createRepresentation: createRepresentation
	};
});
