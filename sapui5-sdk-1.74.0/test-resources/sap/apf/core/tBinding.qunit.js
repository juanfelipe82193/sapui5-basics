/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2016 SAP SE. All rights reserved
 */
/*global sap, jQuery, QUnit, sinon */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require("sap.apf.ui.representations.representationInterface");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.binding");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.testhelper.config.sampleConfiguration");
jQuery.sap.require("sap.apf.testhelper.doubles.coreApi");
jQuery.sap.require("sap.apf.testhelper.doubles.apfApi");
jQuery.sap.require("sap.apf.testhelper.doubles.Representation");
jQuery.sap.require("sap.apf.testhelper.doubles.configurationFactory");
jQuery.sap.require("sap.apf.testhelper.odata.sampleServiceData");
jQuery.sap.require("sap.apf.core.constants");


(function() {
	'use strict';

	function commonSetupBinding(oContext, afterGetFilter) {
		var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		var exits = {
			binding: {
				afterGetFilter: afterGetFilter
			}
		};
		oContext.oMessageHandler = oMessageHandler;
		oContext.oSampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : oMessageHandler
			},
			exits: exits
		}).doubleMessaging();
		oContext.oApi = new sap.apf.testhelper.doubles.ApfApi({
			instances : {
				messageHandler : oContext.oMessageHandler,
				coreApi : oContext.oCoreApi
			}
		}).doubleStandardMethods().doubleCreateRepresentation();
		oContext.oConfigurationFactory = new sap.apf.testhelper.doubles.ConfigurationFactory({
			instances : {
				messageHandler : oMessageHandler,
				coreApi : oContext.oCoreApi
			},
			exits: exits
		}).supportLoadAndCreateBinding();
	}
	//TODO: The test double is overwritten. Sinon is used in all this test cases. If all other tests use sinon instead of the double, this code can be moved to the double file.
	QUnit.module('Binding template1 & representation info', {
		beforeEach : function(assert) {
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			commonSetupBinding(this);
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function() {
				return sinon.stub(new RepresentationInterface());
			};
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		}
	});
	QUnit.test('Binding.getRepresentationInfo()', function(assert) {
		var aRepresentationInfo = this.oBinding.getRepresentationInfo();
		assert.ok(this.oBinding, "Binding object available");
		assert.equal(aRepresentationInfo[0].representationId, "representationId1", "First representation info has correct representationId");
		assert.equal(aRepresentationInfo[0].parameter.id, "double1", "Parameter information included");
		assert.equal(aRepresentationInfo[0].representationLabel.key, "representationText1", "First representation info has correct representationLabel.key");
		assert.equal(aRepresentationInfo[0].hasOwnProperty("id"), false, "First representation info has no id");
		assert.equal(aRepresentationInfo[0].hasOwnProperty("constructor"), false, "First representation info has no constructor");
		assert.equal(aRepresentationInfo[0].hasOwnProperty("type"), false, "First representation info has no type");
		assert.equal(aRepresentationInfo[2].hasOwnProperty("representationLabel"), false, "Third representation info has no representationLabel");
	});
	QUnit.test('Binding.getRequiredFilter()', function(assert) {
		assert.deepEqual(this.oBinding.getRequiredFilters(),["Customer"], "Required filters returned");
	});
	QUnit.test('getRepresentationInfo and RepresentationSwitch is working correctly if representations have same representation type', function(assert) {
		var oBinding = this.oConfigurationFactory.createBinding("bindingTemplateSameRepresentationTypesDifferentRepresentations");
		var aRepresentationInfo = oBinding.getRepresentationInfo();
		assert.equal(aRepresentationInfo[0].representationId, "representationId1", "Correct representationId for first returned representation info object expected");
		assert.equal(aRepresentationInfo[1].representationId, "representationId2", "Correct representationId for second returned representation info object expected");
		oBinding.setSelectedRepresentation(aRepresentationInfo[1].representationId);
		var oRepresentationInfo = oBinding.getSelectedRepresentationInfo();
		assert.equal(oRepresentationInfo.representationId, aRepresentationInfo[1].representationId, "RepresentationSwitch works correctly");
	});
	QUnit.test('Binding.getRepresentationInfo() clones array and info', function(assert) {
		var aRepresentationInfo1 = this.oBinding.getRepresentationInfo();
		aRepresentationInfo1[0] = undefined;
		var aRepresentationInfo2 = this.oBinding.getRepresentationInfo();
		assert.notEqual(aRepresentationInfo1[0], aRepresentationInfo2[0], "arrays independent");
		assert.ok(aRepresentationInfo1[1].representationId, "representationId1 defined");
		assert.equal(aRepresentationInfo1[1].representationId, aRepresentationInfo2[1].representationId, "same before side effect");
		aRepresentationInfo1[1].representationId = undefined;
		assert.ok(aRepresentationInfo1[1].representationId === undefined, "representationId1 affected");
		assert.ok(aRepresentationInfo2[1].representationId !== undefined, "representationId2 not affected");
	});
	QUnit.test('getSelectedRepresentationInfo', function(assert) {
		var oRepresentationInfo = this.oBinding.getSelectedRepresentationInfo(); // default: the first one in array
		assert.ok(oRepresentationInfo, "returns object");
		assert.equal(oRepresentationInfo.representationId, "representationId1", "is first one");
	});
	QUnit.test('getSelectedRepresentationInfo is cloned', function(assert) {
		var oRepresentationInfo1 = this.oBinding.getSelectedRepresentationInfo(); // default: the first one in array
		var oRepresentationInfo2 = this.oBinding.getSelectedRepresentationInfo();
		assert.equal(oRepresentationInfo1.representationId, oRepresentationInfo2.representationId, "eq .representationId");
		oRepresentationInfo1.representationId = undefined;
		assert.ok(oRepresentationInfo2.representationId, "no side effect");
		assert.equal(oRepresentationInfo1.label.key, oRepresentationInfo2.label.key, "eq .label.key");
		oRepresentationInfo1.label.key = undefined;
		assert.ok(oRepresentationInfo2.label.key, "no side effect");
	});
	QUnit.module('Binding template2 & representationType', {
		beforeEach : function(assert) {
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			commonSetupBinding(this);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		}
	});
	QUnit.test('alternateRepresentationType correctly passed to constructor of Representation', function(assert) {
		var alternateRepresentationType = {
			type : "representationType",
			id : "listRepresentationTypeId",
			constructor : "sap.apf.ui.somethingThatNeedsToBeDefinedByUI"
		};
		var RepresentationInterface = sap.apf.ui.representations.representationInterface;
		this.oSampleConfiguration.representationTypes.push(alternateRepresentationType);
		this.oSampleConfiguration.bindings[1].representations[0].parameter.alternateRepresentationTypeId = "listRepresentationTypeId";
		this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
		sap.apf.testhelper.doubles.Representation = function(oApi, oParameter) {
			assert.equal(oParameter.alternateRepresentationType, alternateRepresentationType, "AlternateRepresentationType correctly passed to constructor");
			return sinon.stub(new RepresentationInterface());
		};
		this.oConfigurationFactory.createBinding("bindingTemplate2");
	});
	QUnit.test("WHEN destroy on binding is called", function(assert) {
		this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
		var binding = this.oConfigurationFactory.createBinding("bindingTemplate1");
		var representationSpys = [];
		var representationInfo = binding.getRepresentationInfo();
		representationInfo.forEach(function(representationInfo) {
			binding.setSelectedRepresentation(representationInfo.representationId);
			representationSpys.push(sinon.spy(binding.getSelectedRepresentation(), "destroy"));
		});
		binding.destroy();
		representationSpys.forEach(function(representation) {
			assert.ok(representation.calledOnce, "THEN destroy of the representation was called");
		});
	});
	QUnit.module('RepresentationTypes with bindingTemplateInitialStep', {
		beforeEach : function(assert) {
			commonSetupBinding(this);
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function() {
				return sinon.stub(new RepresentationInterface());
			};
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplateInitialStep");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		}
	});
	QUnit.test('GetSelectedRepresentation on empty array', function(assert) {
		var oSelectedRepresentation = this.oBinding.getSelectedRepresentation();
		assert.notEqual(oSelectedRepresentation instanceof sap.apf.testhelper.doubles.Representation, true, "getSelectedRepresentation() dosn't throw error on empty array");
		assert.equal(oSelectedRepresentation, undefined, "undefined returend");
	});
	QUnit.test('getRepresentationInfo empty', function(assert) {
		var oRepresentationInfo = this.oBinding.getRepresentationInfo();
		assert.ok(oRepresentationInfo, "RepresentationInfo is defined");
		assert.equal(oRepresentationInfo.length, 0, "RepresentationInfo is an empty array");
	});
	QUnit.test('getSelectedRepresentationInfo where no representations are defined', function(assert) {
		assert.throws(function() {
			this.oBinding.getSelectedRepresentationInfo();
		}, "successfully thrown, index not in array boundaries");
	});
	QUnit.module("Representation switch", {
		beforeEach : function(assert) {
			commonSetupBinding(this);
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function(oApi, oParameter) {
				return sinon.stub(new RepresentationInterface(oApi, oParameter));
			};
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		}
	});
	QUnit.test("WHEN a representation switch happens THEN setData will be called", function(assert) {
		var aData = [ {
			a : 1
		}, {
			b : 2
		} ];
		var oMetadata = {
			type : "localMetadataDouble"
		};
		var oParam = {
			data : aData,
			metadata : oMetadata
		};
		var oSelectedRepresentationTemplate = this.oBinding.getSelectedRepresentationInfo();
		var aRepresentationTemplates = this.oBinding.getRepresentationInfo();
		this.oBinding.setData(oParam);
		var oSelectedRepresentation = this.oBinding.getSelectedRepresentation();
		this.oBinding.setSelectedRepresentation(aRepresentationTemplates[1].representationId);
		assert.ok(this.oBinding.getSelectedRepresentation().setData.withArgs(aData, oMetadata).called, "setData is called");
		this.oBinding.setSelectedRepresentation(oSelectedRepresentationTemplate.representationId);
		assert.ok(oSelectedRepresentation.setData.withArgs(aData, oMetadata).called, "setData is called");
	});
	QUnit.test("WHEN a representation switch happens THEN onChartSwitch will be called", function(assert) {
		assert.expect(1);
		var aData = [ {
			a : 1
		}, {
			b : 2
		} ];
		var oMetadata = {
			type : "localMetadataDouble"
		};
		var oParam = {
			data : aData,
			metadata : oMetadata
		};
		var aRepresentationTemplates = this.oBinding.getRepresentationInfo();
		this.oBinding.setData(oParam);
		var oSelectedRepresentation = this.oBinding.getSelectedRepresentation();
		oSelectedRepresentation.onChartSwitch = function() {
			assert.ok(true, "was called");
		};
		this.oBinding.setSelectedRepresentation(aRepresentationTemplates[1].representationId);
	});
	QUnit.test('Switching to a representation and back', function(assert) {
		var oSelectedRepresentation1 = this.oBinding.getSelectedRepresentation();
		var aRepresentationTemplates = this.oBinding.getRepresentationInfo();
		this.oBinding.setSelectedRepresentation(aRepresentationTemplates[1].representationId);
		var oSelectedRepresentation2 = this.oBinding.getSelectedRepresentation();
		assert.notEqual(oSelectedRepresentation1, oSelectedRepresentation2, "Switched representation.");
		this.oBinding.setSelectedRepresentation(aRepresentationTemplates[0].representationId);
		var oSelectedRepresentation3 = this.oBinding.getSelectedRepresentation();
		assert.equal(oSelectedRepresentation1, oSelectedRepresentation3, "Switched back to first representation.");
	});
	QUnit.module("Representation instatiation", {
		beforeEach : function(assert) {
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function(oApi, oParameter) {
				return sinon.stub(new RepresentationInterface(oApi, oParameter));
			};
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		},
		setupBinding : function(assert) {
			this.oSampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oApi = new sap.apf.testhelper.doubles.ApfApi({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			}).doubleStandardMethods().doubleCreateRepresentation();
			this.oConfigurationFactory = new sap.apf.testhelper.doubles.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			}).supportLoadAndCreateBinding();
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
		}
	});
	QUnit.test('WHEN a representation is created THEN the requried filters are given to the constructor', function(assert) {
		var oOriginalRequiredFilters = sap.apf.testhelper.config.getSampleConfiguration().bindings[0].requiredFilters;
		sap.apf.testhelper.doubles.Representation = function(oApi, oParameter) {
			assert.deepEqual(oParameter.requiredFilters, oOriginalRequiredFilters, "Filter correctly passed to constructor");
			return sinon.stub(new sap.apf.ui.representations.representationInterface(oApi, oParameter));
		};
		this.setupBinding(assert);
	});
	QUnit.test('WHEN a representation is created THEN the parameters are given to the constructor', function(assert) {
		var property;
		var oOriginalParameters = sap.apf.testhelper.config.getSampleConfiguration().bindings[0].representations[0].parameter;
		sap.apf.testhelper.doubles.Representation = function(oApi, oParameter) {
			assert.ok(oParameter, "instance variable parameter exists");
			assert.equal(oParameter.type, "parameter", "value for the property type was set correct");
			for (property in oOriginalParameters) {
				if (oOriginalParameters.hasOwnProperty(property)) {
					assert.ok(oParameter[property]);
				}
			}
			return sinon.stub(new sap.apf.ui.representations.representationInterface());
		};
		this.setupBinding();
	});
	QUnit.test('getRequestOptions are returned to Binding', function(assert) {
		this.setupBinding();
		var oSelectedRepresentation = this.oBinding.getSelectedRepresentation();
		oSelectedRepresentation.getRequestOptions.returns({
			top : undefined
		});
		var oRequestOptions = this.oBinding.getRequestOptions();
		assert.ok(oRequestOptions, "got RequestOptions");
		assert.equal(oRequestOptions.top, undefined, "top option not set");
		oSelectedRepresentation.getRequestOptions.returns({
			paging : {
				inlineCount : true
			}
		});
		oRequestOptions = this.oBinding.getRequestOptions();
		assert.equal(oRequestOptions.paging.inlineCount, true, "option inlinecount returned as expected");
		var oExpected = {
			paging : {
				top : 20,
				skip : 10,
				inlineCount : true
			}
		};
		oSelectedRepresentation.getRequestOptions.returns(oExpected);
		oRequestOptions = this.oBinding.getRequestOptions();
		assert.deepEqual(oRequestOptions, oExpected, "all request options returned as expected");
	});
	QUnit.test('filterChanged boolean forwarded to representation.getRequestOptions(<boolean>)', function(assert) {
		this.setupBinding();
		var filterChanged = true; 
		
		var oSelectedRepresentation = this.oBinding.getSelectedRepresentation();

		this.oBinding.getRequestOptions(filterChanged);
		assert.strictEqual(oSelectedRepresentation.getRequestOptions.getCall(0).args[0], true, 'representation.getRequestOptions called with true');
		
		filterChanged = false;
		this.oBinding.getRequestOptions(filterChanged);
		assert.strictEqual(oSelectedRepresentation.getRequestOptions.getCall(1).args[0], false, 'representation.getRequestOptions called with false');
	});
	QUnit.module('Representation change', {
		beforeEach : function(assert) {
			commonSetupBinding(this);
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function() {
				return sinon.stub(new RepresentationInterface());
			};
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
			this.aDataResponse = sap.apf.testhelper.odata.getSampleServiceData("EntityType1").data;
			this.oBinding.setData({
				data : this.aDataResponse
			});
			this.oRepresentationInfo1 = this.oBinding.getRepresentationInfo()[0];
			this.oRepresentationInfo2 = this.oBinding.getRepresentationInfo()[1];
			this.oRepresentationInfo3 = this.oBinding.getRepresentationInfo()[2];
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		},
		setSelectedRepresentation : function(sRepresentationId) {
			this.oBinding.setSelectedRepresentation(sRepresentationId);
			return this.oBinding.getSelectedRepresentation();
		},
		assertFilterA : function(assert, sMessage) {
			var filterResult = this.oBinding.getFilter().getFilterTerms();
			assert.equal(filterResult.length, 2, sMessage);
		},
		assertFilterB : function(assert, sMessage) {
			var filterResult = this.oBinding.getFilter().getFilterTerms();
			assert.equal(filterResult.length, 4, sMessage);
		},
		assertFilterC : function(assert, sMessage) {
			var filterResult = this.oBinding.getFilter().getFilterTerms();
			assert.equal(filterResult.length, 1, sMessage);
		},
		assertNoRestrictionByFilter : function(assert, sMessage) {
			var filterResult = this.oBinding.getFilter().getFilterTerms();
			assert.equal(filterResult.length, 11, sMessage);
		}
	});
	QUnit.test("No filter restriction if adoption fails and selected representation has no filter", function(assert) {
		var oRepresentation1 = this.oBinding.getSelectedRepresentation();
		oRepresentation1.getSelectionAsArray.returns([ 1, 2 ]);
		var oRepresentation2 = this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		oRepresentation2.getSelectionAsArray.returns([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]);
		this.setSelectedRepresentation(this.oRepresentationInfo1.representationId);
		this.assertFilterA(assert, "Filter of first representation expected");
		assert.ok(oRepresentation2.adoptSelection.withArgs(oRepresentation1).called, "adopt Selection on Representation 2 called.");
		this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		this.assertNoRestrictionByFilter(assert, "No Filter restriction expected");
	});
	QUnit.test("Selection from first remains active if selection can be adopted by second", function(assert) {
		var oRepresentation1 = this.oBinding.getSelectedRepresentation();
		var aIndicesOfSelectedData = [ 1, 2 ];
		oRepresentation1.getSelectionAsArray.returns(aIndicesOfSelectedData);
		var oRepresentation2 = this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		oRepresentation2.getSelectionAsArray.returns(aIndicesOfSelectedData);
		this.setSelectedRepresentation(this.oRepresentationInfo1.representationId);
		assert.ok(oRepresentation2.adoptSelection.withArgs(oRepresentation1).called, "adopt Selection on Representation 2 called.");
		this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		this.assertFilterA(assert, "Filter set for first representation expected");
	});
	QUnit.test("Selection from first remains active after adopting selections twice", function(assert) {
		var oRepresentation1 = this.oBinding.getSelectedRepresentation();
		var aIndicesOfSelectedData = [ 1, 2 ];
		oRepresentation1.getSelectionAsArray.returns(aIndicesOfSelectedData);
		var oRepresentation2 = this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		oRepresentation2.getSelectionAsArray.returns(aIndicesOfSelectedData);
		var oRepresentation3 = this.setSelectedRepresentation(this.oRepresentationInfo3.representationId);
		oRepresentation3.getSelectionAsArray.returns(aIndicesOfSelectedData);
		this.setSelectedRepresentation(this.oRepresentationInfo1.representationId);
		assert.ok(oRepresentation2.adoptSelection.withArgs(oRepresentation1).called, "adopt Selection on Representation 2 called.");
		assert.ok(oRepresentation3.adoptSelection.withArgs(oRepresentation2).called, "adopt Selection on Representation 3 called.");
		this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		this.setSelectedRepresentation(this.oRepresentationInfo3.representationId);
		this.assertFilterA(assert, "Filter of first representation expected");
	});
	QUnit.test("Selection on second becomes active once set", function(assert) {
		var oRepresentation1 = this.oBinding.getSelectedRepresentation();
		var aIndicesOfSelectedData = [ 1, 2 ];
		oRepresentation1.getSelectionAsArray.returns(aIndicesOfSelectedData);
		var oRepresentation2 = this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		oRepresentation2.getSelectionAsArray.returns(aIndicesOfSelectedData);
		this.setSelectedRepresentation(this.oRepresentationInfo1.representationId);
		this.assertFilterA(assert, "Filter of first representation expected");
		assert.ok(oRepresentation2.adoptSelection.withArgs(oRepresentation1).called, "adopt Selection on Representation 2 called.");
		this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		this.assertFilterA(assert, "Filter from first representation adopted");
		oRepresentation2.getSelectionAsArray.returns([ 1, 2, 3, 4 ]);
		this.assertFilterB(assert, "Filter of second representation expected");
	});
	QUnit.test("Selection on third becomes active once set", function(assert) {
		var oRepresentation1 = this.oBinding.getSelectedRepresentation();
		var aIndicesOfSelectedData = [ 1, 2 ];
		oRepresentation1.getSelectionAsArray.returns(aIndicesOfSelectedData);
		var oRepresentation2 = this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		oRepresentation2.getSelectionAsArray.returns(aIndicesOfSelectedData);
		var oRepresentation3 = this.setSelectedRepresentation(this.oRepresentationInfo3.representationId);
		oRepresentation3.getSelectionAsArray.returns(aIndicesOfSelectedData);
		this.setSelectedRepresentation(this.oRepresentationInfo1.representationId);
		this.assertFilterA(assert, "Filter of first representation expected");
		assert.ok(oRepresentation2.adoptSelection.withArgs(oRepresentation1).called, "adopt Selection on Representation 2 called.");
		this.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		this.assertFilterA(assert, "Filter from first representation adopted by second");
		assert.ok(oRepresentation3.adoptSelection.withArgs(oRepresentation2).called, "adopt Selection on Representation 3 called.");
		this.setSelectedRepresentation(this.oRepresentationInfo3.representationId);
		this.assertFilterA(assert, "Filter from first representation adopted by third");
		oRepresentation3.getSelectionAsArray.returns([ 1 ]);
		this.assertFilterC(assert, "Filter of third representation expected");
	});
	QUnit.module("Serialization / deserialization", {
		beforeEach : function(assert) {
			commonSetupBinding(this);
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function(oApi, oParameter) {
				var stub = sinon.stub(new RepresentationInterface(oApi, oParameter));
				stub.serialize.returns("SerializedStub");
				return stub;
			};
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
			this.oRepresentationInfo2 = this.oBinding.getRepresentationInfo()[1];
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		}
	});
	QUnit.test("Serialize and deserialize a binding", function(assert) {
		var oExpectedSerializableBinding = {
			selectedRepresentation : "SerializedStub",
			selectedRepresentationId : "representationId2"
		};
		this.oBinding.setSelectedRepresentation(this.oRepresentationInfo2.representationId);
		var oSerializableBinding = this.oBinding.serialize();
		assert.deepEqual(oSerializableBinding, oExpectedSerializableBinding, "Binding serialized as expected");
		this.oNewBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
		this.oNewBinding.deserialize(oSerializableBinding);
		assert.deepEqual(this.oNewBinding.serialize(), oSerializableBinding, "Binding deserialized as expected");
	});
	QUnit.module("Convert sort to orderby", {
		beforeEach : function(assert) {
			commonSetupBinding(this);
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			var that = this;
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			sap.apf.testhelper.doubles.Representation = function(oApfApi, oParameter) {
				that.oParameter = oParameter;
				return sinon.stub(new RepresentationInterface());
			};
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
		}
	});
	QUnit.test("Convert sort to orderby", function(assert) {
		var input = {
			sort : {
				sortField : "CreditAmtInDisplayCrcy_E",
				descending : true
			}
		}, expected = {
			orderby : [ {
				property : "CreditAmtInDisplayCrcy_E",
				ascending : false
			} ]
		}, result;
		result = this.oBinding.convertSortToOrderBy(input);
		assert.deepEqual(result, expected, "Converted as expected");
	});
	QUnit.test("Convert sort to orderby - integration", function(assert) {
		this.oBinding.setSelectedRepresentation("representationId4");
		assert.ok(this.oParameter.orderby, "An orderby property has been added to the parameter information");
		assert.ok(!this.oParameter.sort, "The parameter information does not have a sort information any more");
	});

	QUnit.module("Injection of exit binding.afterGetFilter", {
	});
	function setupForExitInjection(context, exitFunction) {
		commonSetupBinding(context, exitFunction);
		context.oConfigurationFactory.loadConfig(sampleBinding());
		sap.apf.testhelper.doubles.Representation = function(oApfApi, oParameter) {
			context.oParameter = oParameter;
			return sinon.stub(new sap.apf.ui.representations.representationInterface());
		};
		context.oBinding = context.oConfigurationFactory.createBinding("bindingTemplate1");
	}
	QUnit.test("WHEN not injected afterGetFilter", function(assert) {
		setupForExitInjection(this);
		var filterResult = this.oBinding.getFilter();

		assert.equal(filterResult instanceof sap.apf.core.utils.Filter, true, "THEN getFilter unchanged");
	});
	QUnit.test("WHEN afterGetFilter is injected", function(assert) {
		setupForExitInjection(this, function(filter) {
			return {
				filter: filter,
				result: 42
				};
		});
		var filterResult = this.oBinding.getFilter();

		assert.notStrictEqual(filterResult.filter, undefined, "THEN getFilter is modified by running afterGetFilter");
		assert.strictEqual(filterResult.filter instanceof sap.apf.core.utils.Filter, true, "THEN getFilter is modified by running afterGetFilter");
		assert.strictEqual(filterResult.result, 42, "THEN getFilter is modified by running afterGetFilter");
	});
	QUnit.test("WHEN afterGetFilter is injected", function(assert) {
		var done = assert.async();
		setupForExitInjection(this, function(oFilter, selectedRepresentation, oCoreApi, oBindingConfig, oContextInfo) {
			assert.strictEqual(oBindingConfig.id, sampleBinding().bindings[0].id, "THEN binding configuration is passed to exit");
			assert.ok(selectedRepresentation instanceof sap.apf.ui.representations.representationInterface, "THEN selected representation is passed to exit");
			assert.ok(oCoreApi instanceof sap.apf.testhelper.doubles.CoreApi, "THEN oCoreApi is passed to exit");
			assert.ok((oContextInfo.entityType && oContextInfo.service), "THEN oContextInfo ist passed to exit");
			done();
		});
		var oContextInfo = {
			entityType : "entityType",
			service : "serviceURL"
		};
		this.oBinding.getFilter(oContextInfo);
	});
	QUnit.module('Binding template1 & setData to representation', {
		beforeEach : function(assert) {
			var that = this;
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			commonSetupBinding(this);
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function(api, configuration) {
				var stub = sinon.stub(new RepresentationInterface());
				stub.setData = function(data, metadata, count, selectionValidation){
					that.data = data;
					that.metadata = metadata;
					that.count = count;
					that.selectionValidation = selectionValidation;
				};
				stub.updateTreetable = function(controlObject, oModel, entityTypeMetadata, bFilterChanged){
					that.controlObject = controlObject;
					that.oModel = oModel;
					that.entityTypeMetadata = entityTypeMetadata;
					that.bFilterChanged = bFilterChanged;
				};
				stub.setFilterValues = function(aValues){
					that.filterValues = aValues;
				};
				stub.getSortedSelections = function(){
					return "SortedSelections";
				};
				return stub;
			};
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplate1");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		}
	});
	QUnit.test('Hands over correct data', function(assert) {
		this.oBinding.setData({
			data: [ {
				a : 1
			}, {
				b : 2
			} ],
			metadata: {
				type : "localMetadataDouble"
			},
			count: 42, 
			selectionValidation : "selectionValidation"
		});
		assert.deepEqual(this.data, [ {
				a : 1
			}, {
				b : 2
			} ], "Data set");
		assert.deepEqual(this.metadata, {
			type: "localMetadataDouble"
		}, "Metadata set");
		assert.strictEqual(this.count, 42, "Count set");
		assert.strictEqual(this.selectionValidation, "selectionValidation", "Selection validation handed over to representation");
	});
	QUnit.test('When count is not provided in oDataResponse', function(assert) {
		this.oBinding.setData({
			data: [ {
				a : 1
			}, {
				b : 2
			} ],
			metadata: {
				type : "localMetadataDouble"
			}
		});
		assert.strictEqual(this.count, undefined, "Count set as undefined");
	});
	QUnit.test('Update Treetable', function(assert) {
		this.oBinding.updateTreetable("controlObject", "oModel", "entityTypeMetadata", true);
		assert.strictEqual(this.controlObject, "controlObject", "controlObject handed over to representation");
		assert.strictEqual(this.oModel, "oModel", "oModel handed over to representation");
		assert.strictEqual(this.entityTypeMetadata, "entityTypeMetadata", "entityTypeMetadata handed over to representation");
		assert.strictEqual(this.bFilterChanged, true, "filterChanged handed over to representation");
	});
	QUnit.test('Set filter values', function(assert) {
		this.oBinding.setFilterValues(["1001"]);
		assert.deepEqual(this.filterValues, ["1001"], "Filter values handed over to representation");
	});
	QUnit.test('Get Selections from represetation', function(assert) {
		assert.deepEqual(this.oBinding.getSortedSelections(), "SortedSelections", "Correct data from chart returned");
	});
	function sampleBinding() {
		return {
			bindings: [{
				type: "binding",
				id: "bindingTemplate1",
				requiredFilters: ["stringProperty"], // set of filters required to uniquely identify rows selection
				representations: [{
					type: "representation",
					id: "representationId1",
					label: {
						type: "label1",
						kind: "text1",
						key: "representationText1"
					},
					representationTypeId: "representationTypeId1",
					parameter: {
						type: "parameter",
						id: 'double1',
						sRepresentationType: "Representation1TestDouble"
					}
				}]
			}],
			representationTypes: [{
				type: "representationType", // optional
				id: "representationTypeId1",
				picture: "sap-icon://line-chart",
				constructor: "sap.apf.testhelper.doubles.Representation",
				label: { // optional
					type: "label2", // optional
					kind: "text2",
					key: "TextKey2" // key
				}
			}]
		};
	}
	QUnit.module('Required Filter Options', {
		beforeEach : function(assert) {
			var that = this;
			var RepresentationInterface = sap.apf.ui.representations.representationInterface;
			commonSetupBinding(this);
			this.oConfigurationFactory.loadConfig(this.oSampleConfiguration);
			this.representationbackup = sap.apf.testhelper.doubles.Representation;
			sap.apf.testhelper.doubles.Representation = function(oApi, oParameters) {
				assert.deepEqual(oParameters.requriedFilterOptions, that.expectedRequiredFilterOptions, "Required Filter Options passed to representation");
				var stub = sinon.stub(new RepresentationInterface());
				return stub;
			};
			this.oBinding = this.oConfigurationFactory.createBinding("bindingTemplateWithRequiredFilterOptions");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.doubles.Representation = this.representationbackup;
		}
	});
	QUnit.test("Get Required Filter Options", function(assert){
		assert.expect(2);
		this.expectedRequiredFilterOptions = {
			labelDiplsayOption : "Text",
			fieldDesc: { 
				"type": "label",
				"kind": "text",
				"key": "filter property text key"
			}
		};
		assert.deepEqual(this.oBinding.getRequiredFilterOptions(), this.expectedRequiredFilterOptions, "Expected Object returned");
	});
}());
