sap.ui.define("sap/apf/utils/tFilterIdHandler", [
	"sap/apf/utils/filterIdHandler",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/utils/filter"
], function(FilterIdHandler, DoubleMessageHandler, Filter){
	'use strict';
	function commonSetup(testEnv) {
		testEnv.setContextSpy = function(filter) {
			this.forwardedFilter = filter;
		};
		testEnv.messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
		testEnv.createEmptyFilter = function() {
			return new Filter(this.messageHandler);
		};
		testEnv.createFilterA = function() {
			var filter = new Filter(this.messageHandler);
			filter.getTopAnd().addExpression({
				name : 'A',
				operator : 'EQ',
				value : 'alpha'
			});
			return filter;
		};
		testEnv.createFilterA308 = function() {
			var filter = new Filter(this.messageHandler);
			filter.getTopAnd().addExpression({
				name : 'A',
				operator : 'EQ',
				value : 'A308'
			});
			return filter;
		};
		testEnv.createFilterB = function() {
			var filter = new Filter(this.messageHandler);
			filter.getTopAnd().addExpression({
				name : 'B',
				operator : 'EQ',
				value : 'beta'
			});
			return filter;
		};
		testEnv.createFilterC = function() {
			var filter = new Filter(this.messageHandler);
			filter.getTopAnd().addExpression({
				name : 'C',
				operator : 'EQ',
				value : 'gamma'
			});
			return filter;
		};
		testEnv.inject = {
			functions : {
				setRestrictionByProperty : function(filter) {
					testEnv.setCalledWith = filter;
				},
				getRestrictionByProperty : function(property) {
					testEnv.getCalledWith = property;
				}
			},
			instances : {
				messageHandler : testEnv.messageHandler
			}
		};
		testEnv.filterIdHandler = new FilterIdHandler(testEnv.inject);
	}
	QUnit.module('Add, update & retrieve by numeric internal ID', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('Basic add and get', function(assert) {
		var id = this.filterIdHandler.add(this.createFilterA());
		assert.equal(this.setCalledWith.getInternalFilter().toUrlParam(), '(A%20eq%20%27alpha%27)', 'StartFilterHandler set called with correct property name');
		this.filterIdHandler.get(id);
		assert.equal(this.getCalledWith, 'A', 'StartFilterHandler gets called with correct property name');
	});
	QUnit.test('Basic add and update', function(assert) {
		var id = this.filterIdHandler.add(this.createFilterA());
		assert.equal(this.setCalledWith.getInternalFilter().toUrlParam(), '(A%20eq%20%27alpha%27)', 'StartFilterHandler set called with correct property name');
		this.filterIdHandler.update(id, this.createFilterA308());
		this.filterIdHandler.get(id);
		assert.equal(this.getCalledWith, 'A', 'StartFilterHandler gets called with correct property name');
		assert.equal(this.setCalledWith.getInternalFilter().toUrlParam(), '(A%20eq%20%27A308%27)', 'filter value updated to "A308"');
		assert.deepEqual(this.filterIdHandler.getAllInternalIds(), [1], 'only generated ID === 1');
	});
	QUnit.test('first update with numeric ID is an error', function(assert) {
		this.filterIdHandler.update(1, this.createFilterA());
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5100', 'parameter 0 is forbidden'); 
		assert.equal(this.messageHandler.spyResults.putMessage.aParameters[0], 'Passed invalid numeric identifier during update of path filter', 'Correct Message text'); 
	});
	QUnit.test('Get with unknown identifier leads to error', function(assert) {
		this.filterIdHandler.add(this.createFilterA());
		this.filterIdHandler.add(this.createFilterB());
		assert.throws(function() {
			this.filterIdHandler.get(0); // boundary condition
		}, 'Error because of passing an identifier to get that has not been returned by add before');
		assert.throws(function() {
			this.filterIdHandler.get(3); // boundary condition
		}, 'Error because of passing an identifier to get that has not been returned by add before');
	});
	QUnit.test('Each add returns different identifier', function(assert) {
		var id1 = this.filterIdHandler.add(this.createEmptyFilter());
		var id2 = this.filterIdHandler.add(this.createEmptyFilter());
		assert.notEqual(id1, id2, 'Different identifiers expected for each add on same instance.');
	});
	QUnit.test('Wrong identifier: Update leads to error', function(assert) {
		this.filterIdHandler.add(this.createFilterA());
		this.filterIdHandler.add(this.createFilterB());
		
		this.filterIdHandler.update(0, this.createFilterC());
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5100', 'parameter 0 is forbidden'); 
		assert.equal(this.messageHandler.spyResults.putMessage.aParameters[0], 'Passed invalid numeric identifier during update of path filter', 'Correct Message text'); 
		
		this.filterIdHandler.update(3, this.createFilterC());
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, '5100', 'unknown numeric id parameter is forbidded'); 
		assert.equal(this.messageHandler.spyResults.putMessage[1].aParameters[0], 'Passed invalid numeric identifier during update of path filter', 'Correct Message text'); 
		
		this.filterIdHandler.update({}); // object forbidden
		assert.equal(this.messageHandler.spyResults.putMessage[2].code, '5100', 'parameter object is forbidden'); 
		assert.equal(this.messageHandler.spyResults.putMessage[2].aParameters[0].indexOf('falsity') > -1, true, 'message contains falsity'); 

		this.filterIdHandler.update(''); // empty string forbidden
		assert.equal(this.messageHandler.spyResults.putMessage[3].code, '5100', 'empty string forbidden'); 
		assert.equal(this.messageHandler.spyResults.putMessage[3].aParameters[0].indexOf('falsity') > -1, true, 'message contains falsity'); 

		this.filterIdHandler.update(undefined); // undefined forbidden
		assert.equal(this.messageHandler.spyResults.putMessage[4].code, '5100', 'undefined forbidden'); 
		assert.equal(this.messageHandler.spyResults.putMessage[4].aParameters[0].indexOf('falsity') > -1, true, 'message contains falsity'); 

		this.filterIdHandler.update(null); // null forbidden
		assert.equal(this.messageHandler.spyResults.putMessage[5].code, '5100', 'null	 forbidden'); 
		assert.equal(this.messageHandler.spyResults.putMessage[5].aParameters[0].indexOf('falsity') > -1, true, 'message contains falsity');

		assert.equal(this.messageHandler.spyResults.putMessage[6], undefined, 'no more errors'); 
	});
	QUnit.test('Updating with same ID but different property leads to error', function(assert) {
		var id = this.filterIdHandler.add(this.createFilterA());
		this.filterIdHandler.update(id, this.createFilterC());
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5100', 'Message logged'); 
		assert.equal(this.messageHandler.spyResults.putMessage.aParameters[0], 'Updating filter with different property not allowed', 'Correct Message text'); 

	});
	QUnit.module('Retrieval of internally generated IDs', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('All created IDs returned', function(assert) {
		this.filterIdHandler.add(this.createFilterA());
		this.filterIdHandler.add(this.createFilterB());
		this.filterIdHandler.add(this.createFilterC());
		assert.deepEqual(this.filterIdHandler.getAllInternalIds(), [ 1, 2, 3 ], 'All internally generated IDs returned in array');
	});
	QUnit.test('Copy of internal structure returned', function(assert) {
		var responseFirstCall;
		var responseSecondCall;
		this.filterIdHandler.add(this.createFilterA());
		this.filterIdHandler.add(this.createFilterB());
		responseFirstCall = this.filterIdHandler.getAllInternalIds();
		responseSecondCall = this.filterIdHandler.getAllInternalIds();
		assert.notEqual(responseSecondCall, responseFirstCall, 'Multiple calls return different instances so that internal state cannot be influenced from outside');
	});
	QUnit.module('Update & retrieve by external ID of type string', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('Basic update and get', function(assert) {
		this.filterIdHandler.update('propertyOneName', this.createFilterA());
		assert.equal(this.setCalledWith.getInternalFilter().toUrlParam(), '(A%20eq%20%27alpha%27)', 'StartFilterHandler set called with correct property name');
		this.filterIdHandler.get('propertyOneName');
		assert.equal(this.getCalledWith, 'A', 'StartFilterHandler get called with correct property name');
	});
	QUnit.test('Get with unknown identifier leads to error', function(assert) {
		this.filterIdHandler.update('propertyOne', this.createFilterA());
		this.filterIdHandler.update('propertyThree', this.createFilterC());
		assert.throws(function() {
			this.filterIdHandler.get('propertyTwo');
		}, 'Error because of passing an identifier that has not been set before');
	});
	QUnit.test('Update with empty string as ID is an error', function(assert) {
		this.filterIdHandler.update('', this.createFilterA());
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5100', 'null	 forbidden'); 
		assert.equal(this.messageHandler.spyResults.putMessage.aParameters[0].indexOf('falsity') > -1, true, 'message contains falsity');
	});
	QUnit.test('Get with empty string as ID is an error', function(assert) {
		assert.throws(function() {
			this.filterIdHandler.get('');
		}, 'same case as unknown identifier');
	});
	QUnit.module('Serializing and deserializing filter id to property name assignments', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('Serialize delivers expected result', function(assert) {
		var expectedSerializedObject = {
			propertyThree : 'C',
			'1' : 'A',
			'2' : 'B'
		};
		this.filterIdHandler.update('propertyThree', this.createFilterC());
		this.filterIdHandler.add(this.createFilterA());
		this.filterIdHandler.add(this.createFilterB());
		assert.deepEqual(this.filterIdHandler.serialize(), expectedSerializedObject, 'Serialize works as expected');
	});
	QUnit.test('Deserialize delivers expected result', function(assert) {
		var serializedObject = {
			propertyThree : 'C',
			1 : 'A',
			2 : 'B'
		};
		this.filterIdHandler.deserialize(serializedObject);
		this.filterIdHandler.get('propertyThree');
		assert.equal(this.getCalledWith, 'C', 'StartFilterHandler get called with correct property name');
		this.filterIdHandler.get(2);
		assert.equal(this.getCalledWith, 'B', 'StartFilterHandler get called with correct property name');
	});
	QUnit.test('Deserialize sets counter that does not conflict with existing internal IDs', function(assert) {
		var idThree, serializedState, otherFilterIdHandler;
		var idOne = this.filterIdHandler.add(this.createFilterA());
		var idTwo = this.filterIdHandler.add(this.createFilterB());
		serializedState = this.filterIdHandler.serialize();
		otherFilterIdHandler = new FilterIdHandler(this.inject);
		otherFilterIdHandler.deserialize(serializedState);
		idThree = otherFilterIdHandler.add(this.createFilterC());
		assert.notEqual(idThree, idOne, 'New ID in deserialized state different from 1st ID');
		assert.notEqual(idThree, idTwo, 'New ID in deserialized state different from 2nd ID');
	});
	QUnit.test('Deserialize called with undefined', function(assert) {
		assert.expect(0);
		var filterIdHandler = new FilterIdHandler(this.inject);
		try{
			filterIdHandler.deserialize(undefined);
		}catch(error){
			assert.ok(false, 'Deserialize called with undefined does not throw exception');
		}
	});
	QUnit.module('Limitation of supported filter', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('Supported Filter - conjunction over a single term: opertor EQ', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addExpression({
			name: 'A',
			operator: 'EQ',
			value: '1'
		});
		this.filterIdHandler.add(filter);
		this.filterIdHandler.update('filterId', filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged using method add or update'); 
	});
	QUnit.test('Supported Filter - conjunction over a single term: opertor LE', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addExpression({
			name: 'A',
			operator: 'LE',
			value: '1'
		});
		this.filterIdHandler.add(filter);
		this.filterIdHandler.update('filterId', filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged using method add or update'); 
	});
	QUnit.test('Supported Filter - conjunction over a single term: opertor GE', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addExpression({
			name: 'A',
			operator: 'GE',
			value: '1'
		});
		this.filterIdHandler.add(filter);
		this.filterIdHandler.update('filterId', filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged using method add or update'); 
	});
	QUnit.test('Supported Filter - empty Filter', function(assert) {
		var filter = this.createEmptyFilter();
		this.filterIdHandler.add(filter);
		this.filterIdHandler.update('filterId', filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged'); 
	});
	QUnit.test('Supported filter - filter contains conjunction with GE and LE', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd()
		.addExpression({
			name : 'A',
			operator : 'GE',
			value : '1'
		})
		.addExpression({
			name : 'A',
			operator : 'LE',
			value : '2'
		});
		this.filterIdHandler.add(filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged in add'); 
		this.filterIdHandler.update('filterId', filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged in update'); 
	});
	QUnit.test('Supported filter - filter contains disjunction of EQ', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addOr()
		.addExpression({
			name : 'A',
			operator : 'EQ',
			value : '1'
		})
		.addExpression({
			name : 'A',
			operator : 'EQ',
			value : '2'
		});
		this.filterIdHandler.add(filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged in add'); 
		this.filterIdHandler.update('filterId', filter);
		assert.ok(!this.messageHandler.spyResults.putMessage, 'No message logged in update'); 
	});
	QUnit.test('Unsupported Filter - conjunction over a single term: opertor LT', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addExpression({
			name: 'A',
			operator: 'LT',
			value: '1'
		});
		this.filterIdHandler.add(filter);
		this.filterIdHandler.update('filterId', filter);
		assert.equal(this.messageHandler.spyResults.putMessage[0].code, '5301', 'Message logged using method add'); 
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, '5301', 'Message logged using method update'); 
	});
	QUnit.test('Unsupported filter - filter contains more than one property', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addOr()
		.addExpression({
			name : 'PropertyOne',
			operator : 'EQ',
			value : 'valueA'
		})
		.addExpression({
			name : 'PropertyTwo',
			operator : 'EQ',
			value : 'valueB'
		});

		this.filterIdHandler.add(filter);
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5301', 'Message logged in add'); 
		this.filterIdHandler.update('filterId', filter);
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, '5301', 'Message logged in update'); 
	});
	QUnit.test('Unsupported filter - filter contains wrong operator in conjunction', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd()
		.addExpression({
			name : 'A',
			operator : 'GE',
			value : '1'
		})
		.addExpression({
			name : 'A',
			operator : 'BT',
			value : '2',
			high: '3'
		});
		this.filterIdHandler.add(filter);
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5301', 'Message logged in add'); 
		this.filterIdHandler.update('filterId', filter);
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, '5301', 'Message logged in update'); 
	});
	QUnit.test('Unsupported filter - filter contains wrong operator in disjunction', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addOr()
		.addExpression({
			name : 'A',
			operator : 'LT',
			value : '1'
		})
		.addExpression({
			name : 'A',
			operator : 'EQ',
			value : '2'
		});
		this.filterIdHandler.add(filter);
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5301', 'Message logged in add'); 
		this.filterIdHandler.update('filterId', filter);
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, '5301', 'Message logged in update'); 
	});
	QUnit.test('Unsupported filter - filter contains wrong LE and GE in disjunction', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addOr()
		.addExpression({
			name : 'A',
			operator : 'GE',
			value : '1'
		})
		.addExpression({
			name : 'A',
			operator : 'LE',
			value : '2'
		});
		this.filterIdHandler.add(filter);
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5301', 'Message logged in add'); 
		this.filterIdHandler.update('filterId', filter);
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, '5301', 'Message logged in update'); 
	});
	QUnit.test('Unsupported filter - filter contains AND and OR', function(assert) {
		var filter = this.createEmptyFilter();
		filter.getTopAnd().addExpression({
			name: 'A',
			operator: 'EQ',
			value: '3'
		});
		filter.getTopAnd().addOr()
		.addExpression({
			name : 'A',
			operator : 'EQ',
			value : '1'
		})
		.addExpression({
			name : 'A',
			operator : 'EQ',
			value : '2'
		});
		this.filterIdHandler.add(filter);
		assert.equal(this.messageHandler.spyResults.putMessage.code, '5301', 'Message logged in add'); 
		this.filterIdHandler.update('filterId', filter);
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, '5301', 'Message logged in update'); 
	});
});