jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.core.hierarchicalStep");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');

(function() {
	'use strict';
	var emptyCallback = function(){};
	function commonSetup(assert){
		var that = this;
		this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
		this.coreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : this.messageHandler
			}
		}).doubleMessaging();
		this.coreApi.getAnnotationsForService = function(service){
			return ["annotation1", "annotation2"];
		};
		this.coreApi.getStartParameterFacade = function() {
			return {
				getSapSystem : function() { return that.sapSystem; }
			};
		};
		this.coreApi.getTextNotHtmlEncoded = function(id) {
			return "text:" + id;
		};
		this.coreApi.getMetadata = function(service) {
			return jQuery.Deferred().resolve({
				type : "metadataStub",
				getHierarchyAnnotationsForProperty : function(entitySet, property){
					if(property === "hierarchyProperty"){
						var hierarchyAnnotations = {
							hierarchyLevelFor: "hierarchyPropertyLevel",
							hierarchyParentNodeFor: "hierarchyPropertyParentNode",
							hierarchyNodeFor: "hierarchyPropertyNodeID",
							hierarchyDrillStateFor: "hierarchyPropertyDrilldownState"
						};
						if(that.externalNodeIDAvailable === true){
							hierarchyAnnotations.hierarchyNodeExternalKeyFor = "hierarchyPropertyNodeExternal";
						}
						return hierarchyAnnotations;
					}
					return {
						code: 5072,
						type: "messageObject"
					};
				}, 
				getUriComponents : function(){
					return {
						entitySet: "entitySet",
						navigationProperty : "navigationProperty"
					};
				}, 
				getFilterableProperties : function(){
					return ["FilterableProperty", "hierarchyPropertyNodeID"];
				},
				getFilterablePropertiesAndParameters : function(){
					return ["FilterableProperty", "hierarchyPropertyNodeID", "Parameter"];
				},
				getParameterEntitySetKeyProperties : function(){
					return [];
				},
				getPropertyMetadata : function(entitySet, property){
					if(that.textAvailable){
						return {
							"sap:text" : "hierarchyPropertyNodeText",
							"sap:label" : "label:" + property
						};
					} 
					return {"sap:label" : "label:" + property};
				}
			});
		};
		sinon.stub(sap.apf.core, "Binding",function(){
			that.updateTreeTableCounter = 0;
			this.getFilter = function(){
				return that.selectionFilter || new sap.apf.core.utils.Filter(that.messageHandler);
			};
			this.updateTreetable = function(controlObject, odataModel, entityTypeMetadata, bFilterChanged){
				that.updateTreeTableCounter++;
				that.updateTreeTableParameters = {
						controlObject : controlObject,
						odataModel : odataModel,
						entityTypeMetadata : entityTypeMetadata,
						bFilterChanged: bFilterChanged
				};
			};
			this.setFilterValues = function(aValues){
				if(that.expectedFilterValuesSetToRepresentation ){
					assert.deepEqual(aValues, that.expectedFilterValuesSetToRepresentation, "Correct values set to Binding/Representation");
				}
			};
			this.getRequestOptions = function(){
				return {
					orderby : that.orderby
				};
			};
			this.getSortedSelections = function(){
				return [];
			};
		});
		this.getEntityTypeMetadataStub = sinon.stub(this.coreApi, "getEntityTypeMetadata", function (service, entitySet){
			return {type : "entityTypeMetadata"};
		});
		this.configurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
		this.configurationFactory = new sap.apf.core.ConfigurationFactory({
			instances : {
				messageHandler : this.messageHandler,
				coreApi : this.coreApi
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			}
		});
		this.configurationFactory.loadConfig(this.configurationTemplate);
		this.originalRequest = sap.apf.core.Request;
		this.requestCounter = 0;
		sap.apf.core.Request = function(inject, config) {
			if(that.expectedSelectionValidationRequestConfig && config.id === "SelectionValidationRequest"){
				assert.deepEqual(config, that.expectedSelectionValidationRequestConfig, "Request created with correct configuration");
			}
			this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
				that.requestCounter++;
				if(that.expectedFilterString){
					assert.deepEqual(oFilter.toUrlParam(), that.expectedFilterString, "Request sent with correct filter");
				}
				if(that.requestAnswer){
					fnCallback({
						data : that.requestAnswer
					});
				} else {
					var data = [{
						hierarchyPropertyNodeID : "1001"
					}];
					if(config.selectProperties.indexOf("hierarchyPropertyNodeText") > -1){
						data[0].hierarchyPropertyNodeText = "Customer 1";
					}
					if(config.selectProperties.indexOf("hierarchyPropertyNodeExternal") > -1){
						data[0].hierarchyPropertyNodeExternal = "1001";
					}
					fnCallback({
						data : data
					});
				}
			};
		};
		this.generateOdataPathStub = sinon.stub(sap.apf.core.utils.uriGenerator, "generateOdataPath", function (){
			return "path";
		});
		this.cumulativeFilter = new sap.apf.core.utils.Filter(this.messageHandler, "FilterableProperty", "EQ", 1); 
		this.cumulativeFilter.addAnd("NotFilterableProperty", "EQ", 1);
		this.cumulativeFilter.addAnd("Parameter", "EQ", 1);
		this.cumulativeFilter2 = new sap.apf.core.utils.Filter(this.messageHandler, "FilterableProperty2", "EQ", 2); 
	}
	function commonTearDown(){
		sap.apf.core.Binding.restore();
		sap.apf.core.Request = this.originalRequest;
		this.generateOdataPathStub.restore();
		this.getEntityTypeMetadataStub.restore();
	}
	QUnit.module("General", {
		beforeEach : function(assert) {
			commonSetup.call(this, assert);
		},
		afterEach : function(assert) {
			commonTearDown.call(this);
		}
	});
	QUnit.test("Create new instance", function(assert) {
		var hStep = this.configurationFactory.createStep("hierarchicalStepId");
		assert.strictEqual(hStep.type, "hierarchicalStep", "Correct type");
		assert.ok(hStep.getRepresentationInfo, "Method getRepresentationInfo inherited");
	});
	QUnit.module("Update", {
		beforeEach : function(assert) {
			commonSetup.call(this, assert);
			this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		},
		afterEach : function(assert) {
			commonTearDown.call(this);
		}
	});
	QUnit.test("OData Model", function(assert) {
		this.hStep.update(this.cumulativeFilter, emptyCallback); 
		var firstOdataModel = this.updateTreeTableParameters.odataModel;
		assert.ok(firstOdataModel instanceof sap.ui.model.odata.v2.ODataModel, "OData model instantiated");
		assert.strictEqual(firstOdataModel.sServiceUrl, "test/hierarchy.xsodata", "OData model contains correct service URL");
		assert.deepEqual(firstOdataModel.sAnnotationURI, ["annotation1", "annotation2"], "OData model contains correct annotation URIs");

		this.hStep.update(this.cumulativeFilter2, emptyCallback); 
		assert.equal(firstOdataModel, this.updateTreeTableParameters.odataModel, "OData model cached");
	});
	QUnit.test("WHEN sap-system is set", function(assert) {
		this.sapSystem = "myERP";
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, emptyCallback); 
		var firstOdataModel = this.updateTreeTableParameters.odataModel;
		assert.strictEqual(firstOdataModel.sServiceUrl, "test/hierarchy.xsodata;o=myERP", "OData model contains correct service URL");
	});
	QUnit.test("ControlObject.filters for Treetable", function(assert) {
		this.hStep.update(this.cumulativeFilter, emptyCallback);

		var expectedFilter = new sap.ui.model.Filter({
			path: "FilterableProperty",
			operator: "EQ",
			value1: 1
		});
		assert.deepEqual(this.updateTreeTableParameters.controlObject.filters[0], expectedFilter , "Expected filter containing only filterable properties handed over as part of controlObject");
	});
	QUnit.test("ControlObject.filters for Treetable if no applicable filter for request", function(assert) {
		this.hStep.update(new sap.apf.core.utils.Filter(this.messageHandler), emptyCallback);
		assert.strictEqual(this.updateTreeTableParameters.controlObject.filters, undefined, "No filter handed over as part of controlObject");
	});
	QUnit.test("ControlObject constants for Treetable", function(assert) {
		this.hStep.update(this.cumulativeFilter, emptyCallback);
		assert.strictEqual(this.updateTreeTableParameters.controlObject.parameters.operationMode, sap.ui.model.odata.OperationMode.Server , "OperationMode set correctly");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.parameters.useServerSideApplicationFilters, true , "Server side filtering activated");
	});
	QUnit.test("ControlObject path for Treetable", function(assert) {
		this.hStep.update(this.cumulativeFilter, emptyCallback);
		assert.equal(this.generateOdataPathStub.getCall(0).args[0], this.messageHandler, "First argument for generateOdataPathStub() is message handler instance");
		assert.strictEqual(this.generateOdataPathStub.getCall(0).args[1].type, "metadataStub", "Second argument for generateOdataPathStub() is metadata instance");
		assert.strictEqual(this.generateOdataPathStub.getCall(0).args[2], "EntityType1", "Third argument for generateOdataPathStub() is entity type");
		assert.equal(this.generateOdataPathStub.getCall(0).args[3].toUrlParam(), "((FilterableProperty%20eq%201)%20and%20(NotFilterableProperty%20eq%201)%20and%20(Parameter%20eq%201))", "Fourth argument for generateOdataPathStub() is the correct filter");
		assert.equal(this.generateOdataPathStub.getCall(0).args[4], "navigationProperty", "Fifth argument for generateOdataPathStub() is navigation property");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.path, "/path" , "Path set correctly");
	});
	QUnit.test("ControlObject path is allways provided even if paramters didn't change for Treetable", function(assert) {
		function callback (){
			this.hStep.setData({}, this.filterForRequest); // emulate path update
		}
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		assert.strictEqual(this.updateTreeTableParameters.controlObject.path, "/path" , "Path set correctly");

		this.hStep.update(new sap.apf.core.utils.Filter(this.messageHandler), emptyCallback);
		assert.strictEqual(this.updateTreeTableParameters.controlObject.path, "/path" , "Path is provided again");
	});
	QUnit.test("ControlObject annotations for Treetable", function(assert) {
		this.hStep.update(this.cumulativeFilter, emptyCallback);
		var expectedAnnotationObject = {
				hierarchyLevelFor: "hierarchyPropertyLevel",
				hierarchyParentNodeFor: "hierarchyPropertyParentNode",
				hierarchyNodeFor: "hierarchyPropertyNodeID",
				hierarchyDrillStateFor: "hierarchyPropertyDrilldownState"
		};
		assert.deepEqual(this.updateTreeTableParameters.controlObject.parameters.treeAnnotationProperties, expectedAnnotationObject, "Expected annotations handed over to treeTable");
	});
	QUnit.test("ControlObject select for Treetable", function(assert) {
		this.hStep.update(this.cumulativeFilter, emptyCallback);
		assert.deepEqual(this.updateTreeTableParameters.controlObject.parameters.select, "hierarchyProperty,hierarchyPropertyLevel,hierarchyPropertyParentNode,hierarchyPropertyNodeID,hierarchyPropertyDrilldownState,PropertyOne,PropertyTwo", "Expected result handed over to treeTable");
	});
	QUnit.test("Callback", function(assert) {
		var callback = function () {
			assert.ok(true, "Callback function handed over to binding");
		};
		this.hStep.update(this.cumulativeFilter, callback);
	});
	QUnit.test("EntityTypeMetadata", function(assert) {
		var callback = function () {};
		this.hStep.update(this.cumulativeFilter, callback);
		
		assert.deepEqual(this.updateTreeTableParameters.entityTypeMetadata, {type : "entityTypeMetadata"}, "EntityTypeMetadata handed over to binding");
		assert.equal(this.getEntityTypeMetadataStub.getCall(0).args[0], "test/hierarchy.xsodata", "getEntityTypeMetadata called with correct service");
		assert.equal(this.getEntityTypeMetadataStub.getCall(0).args[1], "EntityType1", "getEntityTypeMetadata called with correct entity set");
	});
	QUnit.test("Update tree table when filter isn't changed", function(assert) {
		var counter = 0;
		var callback = function () {
			counter++;
			this.hStep.setData({}, this.filterForRequest); //emulate path update logic
		}.bind(this);

		this.hStep.update(this.cumulativeFilter, callback);
		assert.equal(this.updateTreeTableCounter, 1, "Update treetable called");
		assert.strictEqual(this.updateTreeTableParameters.bFilterChanged, true, "Update treetable called with filterChanged = true");
		assert.equal(counter, 1, "Callback called");
		this.hStep.update(this.cumulativeFilter, callback);
		assert.equal(this.updateTreeTableCounter, 2, "Update treetable called again");
		assert.equal(counter, 2, "Callback called");
		assert.strictEqual(this.updateTreeTableParameters.bFilterChanged, false, "Update treetable called with filterChanged = false");
	});
	QUnit.test("Update tree table is called when parameter has changed", function(assert) {
		var counter = 0;
		var callback = function () {
			counter++;
			this.hStep.setData({}, this.filterForRequest); //emulate path update logic
		}.bind(this);
		var cumulativeFilterWithAdditionalParameter = this.cumulativeFilter.copy().addAnd("Parameter", "eq", "2");
		this.hStep.update(this.cumulativeFilter, callback);
		assert.equal(this.updateTreeTableCounter, 1, "Update treetable called");
		assert.equal(counter, 1, "Callback called");
		this.hStep.update(cumulativeFilterWithAdditionalParameter, callback);
		assert.equal(this.updateTreeTableCounter, 2, "Update treetable not called again");
		assert.equal(counter, 2, "Callback called");
	});
	QUnit.module("Sorting", {
		beforeEach : function(assert) {
			commonSetup.call(this, assert);
			this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		},
		afterEach : function(assert) {
			commonTearDown.call(this);
		}
	});
	QUnit.test("Sorting without orderby", function(assert){
		this.hStep.update(new sap.apf.core.utils.Filter(this.messageHandler), emptyCallback);
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter, undefined, "No sorting provided");
	});
	QUnit.test("Sorting with empty array for orderby", function(assert){
		this.orderby = [];
		this.hStep.update(new sap.apf.core.utils.Filter(this.messageHandler), emptyCallback);
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter, undefined, "No sorting provided");
	});
	QUnit.test("Sorting with one orderby", function(assert){
		this.orderby = [{
			ascending: true,
			property: "property1"
		}];
		this.hStep.update(new sap.apf.core.utils.Filter(this.messageHandler), emptyCallback);
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter.length, 1, "One sorting object provided");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter[0].sPath, "property1", "Correct property1");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter[0].bDescending, false, "Property1 is descending");
	});
	QUnit.test("Sorting with two orderby properties", function(assert){
		this.orderby = [{
			ascending: true,
			property: "property1"
		},{
			ascending: false,
			property: "property2"
		}];
		this.hStep.update(new sap.apf.core.utils.Filter(this.messageHandler), emptyCallback);
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter.length, 2, "One sorting object provided");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter[0].sPath, "property1", "Correct property1");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter[0].bDescending, false, "Property1 is ascending");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter[1].sPath, "property2", "Correct property2");
		assert.strictEqual(this.updateTreeTableParameters.controlObject.sorter[1].bDescending, true, "Property2 is descending");
	});
	QUnit.module("Error Handling", {
		beforeEach : function(assert) {
			commonSetup.call(this, assert);
		},
		afterEach : function(assert) {
			commonTearDown.call(this);
		}
	});
	QUnit.test("If hierarchyProperty has no hierarchyAnnotations", function(assert) {
		this.hStep = this.configurationFactory.createStep("nonHierarchicalStepId");
		assert.equal(this.messageHandler.spyResults.putMessage.code, 5072, "Fatal error thrown");
	});
	QUnit.module("SelectionValidationRequest", {
		beforeEach : function(assert) {
			commonSetup.call(this, assert);
		},
		afterEach : function(assert) {
			commonTearDown.call(this);
		}
	});
	QUnit.test("Request sent on update call", function(assert) {
		assert.expect(4);
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1001");
		this.expectedFilterString = "((FilterableProperty%20eq%201)%20and%20(hierarchyPropertyNodeID%20eq%20%271001%27))";
		this.expectedSelectionValidationRequestConfig = {
				"entityType": "EntityType1",
				"id": "SelectionValidationRequest",
				"selectProperties": ["hierarchyPropertyNodeID"],
				"service": "test/hierarchy.xsodata",
				"type": "request"
		};
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 1, "One request sent");
			assert.ok(true, "Callback called");
		}
	});
	QUnit.test("Buffering on two update path calls", function(assert) {
		assert.expect(4);
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1001");
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 1, "One request sent");
			assert.ok(true, "Callback called");
			this.hStep.update(this.cumulativeFilter, secondCallback.bind(this));
			function secondCallback(){
				assert.strictEqual(this.requestCounter, 1, "No additional request sent");
				assert.ok(true, "Callback called");
			}
		}
	});
	QUnit.test("Request not sent when selection is empty", function(assert) {
		assert.expect(2);
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler);
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 0, "No request sent");
			assert.ok(true, "Callback called");
		}
	});
	QUnit.test("Request sent with only the nodeID from selection", function(assert) {
		assert.expect(3);
		this.expectedFilterString = "(hierarchyPropertyNodeID%20eq%20%271001%27)";
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1001");
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1"), callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 1, "One request sent");
			assert.ok(true, "Callback called");
		}
	});
	QUnit.test("When server answers with values that were previously not selected", function(assert){
		assert.expect(3);
		this.requestAnswer = [{
			hierarchyPropertyNodeID : "1001"
		},{
			hierarchyPropertyNodeID : "1002"
		},{
			hierarchyPropertyNodeID : "1003"
		},{
			hierarchyPropertyNodeID : "1004"
		}];
		this.expectedFilterValuesSetToRepresentation = [{
			hierarchyPropertyNodeID : "1001"
		},{
			hierarchyPropertyNodeID : "1002"
		}];
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1001").addAnd("hierarchyPropertyNodeID", "eq", "1002");
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 1, "One request sent");
			assert.ok(true, "Callback called");
		}
	});
	QUnit.test("SelectionValidationRequest with Text property available", function(assert){
		assert.expect(4);
		this.textAvailable = true;
		this.expectedFilterValuesSetToRepresentation = [{
			hierarchyPropertyNodeID : "1001",
			hierarchyPropertyNodeText: "Customer 1"
		}];
		this.expectedSelectionValidationRequestConfig = {
			"entityType": "EntityType1",
			"id": "SelectionValidationRequest",
			"selectProperties": ["hierarchyPropertyNodeID", "hierarchyPropertyNodeText"],
			"service": "test/hierarchy.xsodata",
			"type": "request"
		};
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1001").addAnd("hierarchyPropertyNodeID", "eq", "1002");
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 1, "One request sent");
			assert.ok(true, "Callback called");
		}
	});
	QUnit.test("SelectionValidationRequest with external node Id available", function(assert){
		assert.expect(4);
		this.externalNodeIDAvailable = true;
		this.expectedFilterValuesSetToRepresentation = [{
			hierarchyPropertyNodeID : "1001",
			hierarchyPropertyNodeExternal : "1001"
		}];
		this.expectedSelectionValidationRequestConfig = {
			"entityType": "EntityType1",
			"id": "SelectionValidationRequest",
			"selectProperties": ["hierarchyPropertyNodeID", "hierarchyPropertyNodeExternal"],
			"service": "test/hierarchy.xsodata",
			"type": "request"
		};
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1001").addAnd("hierarchyPropertyNodeID", "eq", "1002");
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 1, "One request sent");
			assert.ok(true, "Callback called");
		}
	});
	QUnit.test("SelectionValidationRequest with external node Id and text available", function(assert){
		assert.expect(4);
		this.textAvailable = true;
		this.externalNodeIDAvailable = true;
		this.expectedFilterValuesSetToRepresentation = [{
			hierarchyPropertyNodeID : "1001",
			hierarchyPropertyNodeExternal : "1001",
			hierarchyPropertyNodeText: "Customer 1"
		}];
		this.expectedSelectionValidationRequestConfig = {
				"entityType": "EntityType1",
				"id": "SelectionValidationRequest",
				"selectProperties": ["hierarchyPropertyNodeID", "hierarchyPropertyNodeText", "hierarchyPropertyNodeExternal"],
				"service": "test/hierarchy.xsodata",
				"type": "request"
		};
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", "1001").addAnd("hierarchyPropertyNodeID", "eq", "1002");
		this.hStep = this.configurationFactory.createStep("hierarchicalStepId");
		this.hStep.update(this.cumulativeFilter, callback.bind(this));
		function callback(){
			assert.strictEqual(this.requestCounter, 1, "One request sent");
			assert.ok(true, "Callback called");
		}
	});
	QUnit.module("AdjustCumulativeFilter", {
		beforeEach : function(assert) {
			commonSetup.call(this, assert);
		},
		afterEach : function(assert) {
			commonTearDown.call(this);
		}
	});
	QUnit.test("With selectable property and selection", function(assert) {
		this.selectionFilter = new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", 2);
		var hStep = this.configurationFactory.createStep("hierarchicalStepId");
		var newCumulativeFilter = hStep.adjustCumulativeFilter(new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", 1).addAnd("Property", "eq", 1));
		assert.strictEqual(newCumulativeFilter.toUrlParam(), "(Property%20eq%201)", "Selectable node id removed from cumulative filter");
	});
	QUnit.test("With selectable property without selection", function(assert) {
		var hStep = this.configurationFactory.createStep("hierarchicalStepId");
		var newCumulativeFilter = hStep.adjustCumulativeFilter(new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", 1).addAnd("Property", "eq", 1));
		assert.strictEqual(newCumulativeFilter.toUrlParam(), "((hierarchyPropertyNodeID%20eq%201)%20and%20(Property%20eq%201))", "Cumulative filter not adjusted");
	});
	QUnit.test("With without selectable property", function(assert) {
		var hStep = this.configurationFactory.createStep("hierarchicalStepWithoutSelectableProperty");
		var newCumulativeFilter = hStep.adjustCumulativeFilter(new sap.apf.core.utils.Filter(this.messageHandler, "hierarchyPropertyNodeID", "eq", 1).addAnd("Property", "eq", 1));
		assert.strictEqual(newCumulativeFilter.toUrlParam(), "((hierarchyPropertyNodeID%20eq%201)%20and%20(Property%20eq%201))", "Cumulative filter not adjusted");
	});
	QUnit.module("Get filter information", {
		beforeEach : function(assert) {
			commonSetup.call(this, assert);
		},
		afterEach : function() {
			commonTearDown.call(this);
		}
	});
	QUnit.test("For Hierarchical Step", function(assert) {
		var activeStep = this.configurationFactory.createStep("hierarchicalStepId");
		var hStep = this.configurationFactory.createStep("hierarchicalStepId");
		hStep.getFilterInformation(activeStep, 0).done(function(filterInformation){
			assert.deepEqual(filterInformation, [{
				"infoIcon" : false,
				"infoText" : undefined,
				"warningIcon" : true,
				"warningText": "text:nothingSelected",
				"filterValues": [],
				"selectablePropertyLabel": "label:hierarchyPropertyNodeID",
				"text": "text:localTextReference2",
				"stepIndex" : 0
			}], "Filter Information for hierarchical Step returned");
		});
	});
}());