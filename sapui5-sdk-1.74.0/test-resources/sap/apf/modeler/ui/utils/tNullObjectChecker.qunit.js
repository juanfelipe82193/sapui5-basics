/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/nullObjectChecker"
], function(nullObjectChecker){
	'use strict';
	QUnit.module("null object checker api's tests ");
	QUnit.test('when initialization', function(assert) {
		assert.ok(nullObjectChecker, 'then object exists'); //eslint-disable-line no-invalid-this
	});
	QUnit.test('when object is undefined', function(assert) {
		// arrange
		var obj;
		// act
		var res = nullObjectChecker.checkIsNotUndefined(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is not undefined', function(assert) {
		// arrange
		var obj = 5;
		// act
		var res = nullObjectChecker.checkIsNotUndefined(obj);
		//assert
		assert.strictEqual(res, true, "then the checker returned true");
	});
	QUnit.test('when object is null', function(assert) {
		// arrange
		var obj = null;
		// act
		var res = nullObjectChecker.checkIsNotNull(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is not null', function(assert) {
		// arrange
		var obj = 5;
		// act
		var res = nullObjectChecker.checkIsNotNull(obj);
		//assert
		assert.strictEqual(res, true, "then the checker returned true");
	});
	QUnit.test('when object is blank', function(assert) {
		// arrange
		var obj = "";
		// act
		var res = nullObjectChecker.checkIsNotBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is not blank', function(assert) {
		// arrange
		var obj = 5;
		// act
		var res = nullObjectChecker.checkIsNotBlank(obj);
		//assert
		assert.strictEqual(res, true, "then the checker returned true");
	});
	QUnit.test('when object is null or blank', function(assert) {
		// arrange
		var obj = "";
		// act
		var res = nullObjectChecker.checkIsNotNullOrBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is null or blank', function(assert) {
		// arrange
		var obj = null;
		// act
		var res = nullObjectChecker.checkIsNotNullOrBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is neither null or blank', function(assert) {
		// arrange
		var obj = 5;
		// act
		var res = nullObjectChecker.checkIsNotNullOrBlank(obj);
		//assert
		assert.strictEqual(res, true, "then the checker returned false");
	});
	QUnit.test('when object is null or undefined', function(assert) {
		// arrange
		var obj = null;
		// act
		var res = nullObjectChecker.checkIsNotNullOrUndefined(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is null or undefined', function(assert) {
		// arrange
		var obj;
		// act
		var res = nullObjectChecker.checkIsNotNullOrUndefined(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is neither null or undefined', function(assert) {
		// arrange
		var obj = 5;
		// act
		var res = nullObjectChecker.checkIsNotNullOrUndefined(obj);
		//assert
		assert.strictEqual(res, true, "then the checker returned false");
	});
	QUnit.test('when object is blank or undefined', function(assert) {
		// arrange
		var obj = "";
		// act
		var res = nullObjectChecker.checkIsNotUndefinedOrBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is blank or undefined', function(assert) {
		// arrange
		var obj;
		// act
		var res = nullObjectChecker.checkIsNotUndefinedOrBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is neither blank or undefined', function(assert) {
		// arrange
		var obj = 5;
		// act
		var res = nullObjectChecker.checkIsNotUndefinedOrBlank(obj);
		//assert
		assert.strictEqual(res, true, "then the checker returned false");
	});
	QUnit.test('when object is blank or undefined or null', function(assert) {
		// arrange
		var obj = "";
		// act
		var res = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is blank or undefined or null', function(assert) {
		// arrange
		var obj;
		// act
		var res = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is blank or undefined or null', function(assert) {
		// arrange
		var obj = null;
		// act
		var res = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(obj);
		//assert
		assert.strictEqual(res, false, "then the checker returned false");
	});
	QUnit.test('when object is none of blank or undefined or null', function(assert) {
		// arrange
		var obj = 5;
		// act
		var res = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(obj);
		//assert
		assert.strictEqual(res, true, "then the checker returned false");
	});
	QUnit.test('when object is of type array and is empty', function(assert) {
		// arrange
		var obj = [];
		// act
		var res = nullObjectChecker.checkIsNotBlank(obj);
		// assert
		assert.strictEqual(res, false, "then checker returned false");
	});
	QUnit.test('when object is of type array and is not empty', function(assert) {
		// arrange
		var obj = [ 5 ];
		// act
		var res = nullObjectChecker.checkIsNotBlank(obj);
		// assert
		assert.strictEqual(res, true, "then checker returned true");
	});
	QUnit.test('when object is of type object and is empty', function(assert) {
		// arrange
		var obj = {};
		// act
		var res = nullObjectChecker.checkIsNotBlank(obj);
		// assert
		assert.strictEqual(res, false, "then checker returned false");
	});
	QUnit.test('when object is of type object and is not empty', function(assert) {
		// arrange
		var obj = {
			"key" : "name"
		};
		// act
		var res = nullObjectChecker.checkIsNotBlank(obj);
		// assert
		assert.strictEqual(res, true, "then checker returned true");
	});
});