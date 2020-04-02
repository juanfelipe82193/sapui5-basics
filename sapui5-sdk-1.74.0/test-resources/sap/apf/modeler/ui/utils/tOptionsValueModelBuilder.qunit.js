/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/optionsValueModelBuilder"
], function(optionsValueModelBuilder){
	'use strict';
	var prepareModelSpy;
	QUnit.module("tests for optionsValueModelBuilder apis ", {
		beforeEach : function() {
			prepareModelSpy = sinon.spy(optionsValueModelBuilder, "prepareModel");
		},
		afterEach : function() {
			prepareModelSpy.restore();
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(optionsValueModelBuilder, 'then object exists');
	});
	QUnit.test('when array is input', function(assert) {
		// arrange
		var input = [ "1", "2" ];
		// act
		var output = optionsValueModelBuilder.convert(input);
		var Objects = [ {
			key : "1",
			name : "1"
		}, {
			key : "2",
			name : "2"
		} ];
		var expectedOutput = {
			Objects : Objects
		};
		// assert
		assert.deepEqual(output.getData(), expectedOutput, " then correct json model is formulated");
		assert.strictEqual(prepareModelSpy.calledOnce, true, "then prepare model function is called");
		assert.deepEqual(prepareModelSpy.getCall(0).args[0], Objects, "then preparemodel function is called with correct array");
		assert.strictEqual(prepareModelSpy.getCall(0).args[1], undefined, "then preparemodel function is not called with any model limit since its not defined");
	});
	QUnit.test('when array is null', function(assert) {
		// arrange
		var input = null;
		// act
		var output = optionsValueModelBuilder.convert(input);
		// assert
		assert.deepEqual(output, undefined, " then a model is not formed");
		assert.strictEqual(prepareModelSpy.calledOnce, false, "then prepare model function is not called since input is null");
	});
	QUnit.test('when some values of the array are null', function(assert) {
		// arrange
		var input = [ "1", null, "2" ];
		// act
		var output = optionsValueModelBuilder.convert(input);
		var Objects = [ {
			key : "1",
			name : "1"
		}, {
			key : "2",
			name : "2"
		} ];
		var expectedOutput = {
			Objects : Objects
		};
		// assert
		assert.deepEqual(output.getData(), expectedOutput, " then correct json model is formulated");
		assert.strictEqual(prepareModelSpy.calledOnce, true, "then prepare model function is called");
		assert.deepEqual(prepareModelSpy.getCall(0).args[0], Objects, "then preparemodel function is called with correct array");
		assert.strictEqual(prepareModelSpy.getCall(0).args[1], undefined, "then preparemodel function is not called with any model limit since its not defined");
	});
	QUnit.test('when user defined model size is given', function(assert) {
		// arrange
		var input = [ "1", "2" ];
		// act
		var output = optionsValueModelBuilder.convert(input, 2);
		var Objects = [ {
			key : "1",
			name : "1"
		}, {
			key : "2",
			name : "2"
		} ];
		var expectedOutput = {
			Objects : Objects
		};
		// assert
		assert.deepEqual(output.getData(), expectedOutput, " then correct json model is formulated");
		assert.deepEqual(output.iSizeLimit, 2, "then user defined size limit is set to the model");
		assert.strictEqual(prepareModelSpy.calledOnce, true, "then prepare model function is called");
		assert.deepEqual(prepareModelSpy.getCall(0).args[0], Objects, "then preparemodel function is called with correct array");
		assert.strictEqual(prepareModelSpy.getCall(0).args[1], 2, "then preparemodel function is called with correct model size limit");
	});
	QUnit.test('when key and text are different and input is an object', function(assert) {
		// arrange
		var input = [ "key", {
			key : "key",
			name : "name"
		} ];
		// act
		var output = optionsValueModelBuilder.convert(input, 2);
		var Objects = [ {
			key : "key",
			name : "key"
		}, {
			key : "key",
			name : "name"
		} ];
		var expectedOutput = {
			Objects : Objects
		};
		// assert
		assert.deepEqual(output.getData(), expectedOutput, "then correct json model is formulated");
		assert.deepEqual(output.iSizeLimit, 2, "then user defined size limit is set to the model");
		assert.strictEqual(prepareModelSpy.calledOnce, true, "then prepare model function is called");
		assert.deepEqual(prepareModelSpy.getCall(0).args[0], Objects, "then preparemodel function is called with correct array");
		assert.strictEqual(prepareModelSpy.getCall(0).args[1], 2, "then preparemodel function is called with correct model size limit");
	});
	QUnit.test('when preparemodel function is called and user defined model size is specified', function(assert) {
		// arrange
		var input = [ {
			key : "1",
			name : "1"
		}, {
			key : "2",
			name : "2"
		} ];
		// act
		var output = optionsValueModelBuilder.prepareModel(input, 2);
		var expectedOutput = {
			Objects : input
		};
		// assert
		assert.deepEqual(output.getData(), expectedOutput, " then correct json model is formulated");
		assert.deepEqual(output.iSizeLimit, 2, "then user defined size limit is set to the model");
	});
	QUnit.test('when preparemodel function is called and user defined model size is not specified', function(assert) {
		// arrange
		var input = [ {
			key : "1",
			name : "1"
		}, {
			key : "2",
			name : "2"
		} ];
		// act
		var output = optionsValueModelBuilder.prepareModel(input);
		var expectedOutput = {
			Objects : input
		};
		// assert
		assert.deepEqual(output.getData(), expectedOutput, " then correct json model is formulated");
		assert.deepEqual(output.iSizeLimit, 500, "then default size limit is set to the model");
	});
});