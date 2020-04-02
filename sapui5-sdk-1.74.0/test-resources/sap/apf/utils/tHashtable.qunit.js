/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery sinon */
sap.ui.define("sap/apf/utils/tHashtable", [
	"sap/apf/utils/hashtable",
	"sap/apf/testhelper/doubles/messageHandler"
], function(Hashtable, DoubleMessageHandler){
	'use strict';
	QUnit.module("Modul Hashtable", {
		beforeEach : function(assert) {
			this.oMsgHandler = new DoubleMessageHandler().raiseOnCheck();
		},
		afterEach : function(assert) {
			this.user = null;
		}
	});
	QUnit.test("wrong arguments", function(assert) {
		assert.expect(3);
		var oHT = new Hashtable(this.oMsgHandler);
		var i;
		for(i = 0; i < 7; i++) {
			oHT.setItem(i, "item" + i);
		}
		assert.equal(oHT.getNumberOfItems(), 7, "WHEN setItem called n times THEN getNumberOfItems returns n");
		assert.throws(function() {
			oHT.setItem("flummy");
		}, Error, "missing argument -> must throw error to pass");
		assert.throws(function() {
			oHT.getItem();
		}, Error, "missing argument in getItem -> must throw error to pass");
	});
	QUnit.test("add/setting items", function(assert) {
		var oHT = new Hashtable(this.oMsgHandler);
		var i;
		for(i = 0; i < 100; i++) {
			oHT.setItem(i, "item" + i);
		}
		var aKeys = oHT.getKeys();
		assert.equal(aKeys.length, 100);
		var val = oHT.getItem(99);
		assert.equal(val, "item" + 99);
	});
	QUnit.test("remove item", function(assert) {
		var oHT = new Hashtable(this.oMsgHandler);
		oHT.setItem(1, "1");
		oHT.removeItem(1);
		var oItem = oHT.getItem(1);
		assert.equal(oItem, undefined, "item really removed");
	});
	QUnit.test("remove item", function(assert) {
		var oHT = new Hashtable(this.oMsgHandler);
		oHT.setItem(1, "1");
		oHT.removeItem(222222);
		var aKeys = oHT.getKeys();
		assert.deepEqual(aKeys, [ "1" ], "only the default key contained, that was not removed");
	});
	QUnit.test("identity and reset", function(assert) {
		var oItem;
		var oHT = new Hashtable(this.oMsgHandler);
		oHT.setItem("flummy", {
			k : 1,
			j : 2
		});
		oHT.setItem("flummy_1", {
			k : 2,
			j : 2
		});
		oItem = oHT.getItem("flummy");
		assert.equal(oItem.k, 1, "got item with right key and property");
		// reset
		oHT.setItem("flummy", {
			k : 9,
			j : 2
		});
		oItem = oHT.getItem("flummy");
		assert.equal(oItem.k, 9, "got item with right key and property");
		assert.equal(oHT.getNumberOfItems(), 2, "number of items as expected");
		oHT.reset();
		assert.equal(oHT.getNumberOfItems(), 0, "number of items are 0 after reset");
		oItem = oHT.getItem("flummy");
		assert.equal(oItem, undefined, "no more item after reset");
		var bHasItem = oHT.hasItem("flummy");
		assert.equal(bHasItem, false, "no more item after reset 2");
	});
	QUnit.test("each function", function(assert) {
		var i;
		function testEachKeyItemIdentical(key, item) {
			assert.equal(key, item, "key and item are equal");
		}
		function testEachItemHasDoubleKeyValue(key, item) {
			assert.equal(key * 2, item, "key and item are equal");
		}
		var oHT = new Hashtable(this.oMsgHandler);
		for(i = 0; i < 10; i++) {
			oHT.setItem(i, i);
		}
		oHT.each(testEachKeyItemIdentical);
		oHT = new Hashtable(this.oMsgHandler);
		for(i = 0; i < 10; i++) {
			oHT.setItem(i, i * 2);
		}
		oHT.each(testEachItemHasDoubleKeyValue);
	});
	function retrieveOrderedValues(hashtable) {
		var retrieved = [];
		hashtable.forEachOrdered(function(key, value) {
			retrieved.push(value);
		});
		return retrieved;
	}
	function retrieveOrderedKeys(hashtable) {
		var retrieved = [];
		hashtable.forEachOrdered(function(key, value) {
			retrieved.push(key);
		});
		return retrieved;
	}
	function getTheTestKeys() {
		return [ "hugo", "otto", "mara", "anna" ];
	}
	function fillHashtable(hashtable) {
		var list = getTheTestKeys();
		var index = 0;
		list.forEach(function(name) {
			//            hashtable.setItem(name, ++index + "--value");
			hashtable.setItem(name, ++index);
		});
		return list;
	}
	QUnit.test("item order - keys via ordering iterator", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		fillHashtable(hashtable);
		assert.equal(retrieveOrderedKeys(hashtable).length, getTheTestKeys().length, "WHEN n setItems THEN same number of keys by forEachOrdered");
		var countMatches = 0;
		hashtable.getKeys().forEach(function(key) {
			hashtable.forEachOrdered(function(orderedKey) {
				if (key === orderedKey) {
					countMatches += 1;
				}
			});
		});
		assert.equal(countMatches, getTheTestKeys().length, "each hash key must be part of the iterated order hash keys.");
	});
	QUnit.test("item order", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		var keyList = fillHashtable(hashtable);
		var removed;
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 1, 2, 3, 4 ], "WHEN setItem THEN retrieval in order of input");
		hashtable.removeItem(keyList[0]);
		hashtable.setItem(keyList[0], 1);
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 2, 3, 4, 1 ], "WHEN removeItem first position THEN retrieval in order of input");
		hashtable.removeItem(keyList[3]);
		hashtable.setItem(keyList[3], 4);
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 2, 3, 1, 4 ], "WHEN removeItem some position THEN retrieval in order of input");
		hashtable.removeItem(keyList[3]);
		hashtable.setItem(keyList[3], 4);
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 2, 3, 1, 4 ], "WHEN removeItem last position THEN retrieval in order of input");
		hashtable.removeItem(keyList[0]);
		hashtable.setItem(keyList[0], 77);
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 2, 3, 4, 77 ], "WHEN removeItem some position and new value THEN retrieval in order of input, independent of value");
		removed = hashtable.removeItem(keyList[0]);
		assert.equal(removed, 77, "key existing");
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 2, 3, 4 ], "WHEN removeItem some position and new value THEN retrieval in order of input, independent of value");
		removed = hashtable.removeItem(keyList[0]);
		assert.equal(removed, undefined, "indicates key not existing");
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 2, 3, 4 ], "WHEN removeItem some THEN retrieval in order of input without removed");
		removed = hashtable.removeItem(keyList[1]);
		assert.equal(removed, 2, "indicates key existing");
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 3, 4 ], "WHEN removeItem some THEN retrieval in order of input without removed");
		removed = hashtable.removeItem(keyList[2]);
		assert.equal(removed, 3, "indicates key existing");
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 4 ], "WHEN removeItem some THEN retrieval in order of input without removed");
		removed = hashtable.removeItem(keyList[3]);
		assert.equal(removed, 4, "indicates key existing");
		assert.deepEqual(retrieveOrderedValues(hashtable), [], "WHEN removeItem some THEN retrieval in order of input without removed");
		hashtable.setItem(keyList[0], 77);
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 77 ], "WHEN setItem after removeItem to empty THEN retrieval in order of input, independent of value");
		hashtable.setItem(keyList[0], 77);
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 77 ], "WHEN setItem twice THEN idempotent");
		hashtable.setItem(keyList[1], 333);
		assert.deepEqual(retrieveOrderedValues(hashtable), [ 77, 333 ], "WHEN 2x setItem after removeItem to empty THEN retrieval in order of input, independent of value");
		hashtable.reset();
		assert.deepEqual(retrieveOrderedValues(hashtable), [], "WHEN reset THEN forEachOrdered empty");
	});
	function pairInfo(beforeKey, sourceKey) {
		return " --- beforeKey=" + beforeKey + "  sourceKey=" + sourceKey;
	}
	// move one key and then reverse the move
	function oneTest(assert, beforeKey, sourceKey, hashtable) {
		var sourceValue = hashtable.getItem(sourceKey);
		var sourceIndex = retrieveOrderedKeys(hashtable).indexOf(sourceKey), targetIndex = retrieveOrderedKeys(hashtable).indexOf(beforeKey);
		var before4Reverse;
		var returnedIndex;
		if (sourceIndex + 1 < retrieveOrderedKeys(hashtable).length) {
			before4Reverse = retrieveOrderedKeys(hashtable)[sourceIndex + 1];
		}
		returnedIndex = hashtable.moveBefore(beforeKey, sourceKey);
		if (sourceIndex < targetIndex) {
			assert.equal(returnedIndex, targetIndex - 1, "WHEN moveBefore THEN returned is new index of sourceKey " + pairInfo(beforeKey, sourceKey));
		} else {
			assert.equal(returnedIndex, targetIndex, "WHEN moveBefore THEN returned is new index of sourceKey " + pairInfo(beforeKey, sourceKey));
		}
		assert.equal(retrieveOrderedKeys(hashtable)[returnedIndex], sourceKey, "WHEN moveBefore THEN key is moved");
		assert.equal(retrieveOrderedKeys(hashtable).indexOf(sourceKey), returnedIndex, "WHEN moveBefore THEN return index of sourceKey in iterator");
		assert.equal(retrieveOrderedValues(hashtable)[returnedIndex], sourceValue, "WHEN moveBefore THEN key is moved and associated value still the same");
		// reverse operation
		if (sourceIndex + 1 < retrieveOrderedKeys(hashtable).length) {
			returnedIndex = hashtable.moveBefore(before4Reverse, sourceKey);
			assert.equal(returnedIndex, sourceIndex, "WHEN reversed THEN old and new position are equal" + pairInfo(beforeKey, sourceKey) + "  before4Reverse=" + before4Reverse + "  sourceIndex=" + sourceIndex);
			assert.equal(retrieveOrderedKeys(hashtable)[sourceIndex], sourceKey, "WHEN moveBefore reversed THEN key iy back on old position");
			assert.equal(retrieveOrderedValues(hashtable)[sourceIndex], sourceValue, "WHEN moveBefore reversed THEN key is back and associated value still the same");
		}
	}
	QUnit.test("moveBefore", function(assert) {
		var that = this;
		// test all pairs of moves on one reference list
		var hashtable;
		getTheTestKeys().forEach(function(beforeIteratedKey) { // ["hugo", "otto", "mara", "anna"];
			getTheTestKeys().forEach(function(moved) {
				hashtable = new Hashtable(that.oMsgHandler);
				fillHashtable(hashtable);
				oneTest(assert, beforeIteratedKey, moved, hashtable);
			});
		});
		hashtable = new Hashtable(that.oMsgHandler);
		hashtable.setItem("mira", "mira-value");
		assert.equal(hashtable.moveBefore("mira", "mira"), 0, "WHEN move on single element THEN no effect, no error");
		hashtable = new Hashtable(that.oMsgHandler);
		assert.equal(hashtable.moveBefore("mira", "mira"), undefined, "WHEN move on empty hash THEN no effect, no error");
		hashtable = new Hashtable(that.oMsgHandler);
		fillHashtable(hashtable);
		assert.equal(hashtable.moveBefore("otto", "zilch"), undefined, "WHEN move on empty hash THEN no effect, no error");
		assert.equal(hashtable.moveBefore("otto", undefined), undefined, "WHEN move on empty hash THEN no effect, no error");
		assert.equal(hashtable.moveBefore(undefined, "otto"), undefined, "WHEN move on empty hash THEN no effect, no error");
	});
	QUnit.test("reset when ordering", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		var counter = 0;
		fillHashtable(hashtable);
		hashtable.reset();
		hashtable.forEachOrdered(function(key) {
			++counter;
		});
		assert.equal(counter, 0, "WHEN reset THEN forEachOrdered never applies the function");
	});
	QUnit.test("getKeysOrdered", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		fillHashtable(hashtable);
		assert.equal(hashtable.getKeysOrdered().length, getTheTestKeys().length, "WHEN getKeysOrdered THEN return all keys");
		assert.deepEqual(hashtable.getKeysOrdered(), retrieveOrderedKeys(hashtable), "WHEN getKeysOrdered THEN ordered keys");
	});
	QUnit.test("forEachOrdered", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		fillHashtable(hashtable);
		hashtable.forEachOrdered(function(key, value) {
			assert.equal(hashtable.hasItem(key), true, "WHEN forEachOrdered THEN the key is in hash");
			assert.deepEqual(value, hashtable.getItem(key), "WHEN forEachOrdered THEN the value is the hashed value");
		});
	});
	QUnit.test("moveToEnd", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		assert.equal(hashtable.moveToEnd("mara"), undefined, "GIVEN hashtable empty WHEN moveToEnd THEN return undefined");
		hashtable.setItem("mara", "mara-value");
		assert.equal(hashtable.moveToEnd("mara"), hashtable.getKeys().length - 1, "GIVEN hashtable 1 element WHEN moveToEnd THEN return @ end");
		hashtable.setItem("otto", "otto-value");
		assert.equal(hashtable.getKeysOrdered().length, 2, "indeed 2");
		assert.equal(hashtable.moveToEnd("mara"), hashtable.getKeys().length - 1, "WHEN moveToEnd THEN return @ end");
		assert.equal(hashtable.moveToEnd("mara"), hashtable.getKeys().length - 1, "WHEN moveToEnd twice THEN return @ end");
		assert.equal(hashtable.moveToEnd("otto"), hashtable.getKeys().length - 1, "WHEN moveToEnd another one THEN return @ end");
		hashtable.setItem("ida", "ida-value");
		hashtable.removeItem("otto");
		assert.equal(hashtable.moveToEnd("otto"), undefined, "WHEN otto removed THEN moveToEnd return undefined");
	});
	QUnit.test("moveItemPositionUpOrDown - negative distance", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		var i = 0;
		for(i = 0; i < 10; i++) {
			hashtable.setItem(i, {
				value : i
			});
		}
		var keys = hashtable.getKeysOrdered();
		assert.equal(keys[1], 1, "Key 1 has original position");
		assert.equal(keys[9], 9, "Key 9 has original position");
		var pos = hashtable.moveUpOrDown(9, -2);
		assert.equal(pos, 7, "expected position");
		keys = hashtable.getKeysOrdered();
		assert.equal(keys[7], 9, "Key has moved the position");
		assert.equal(keys[9], 8, "Key 8 has switched to last position");
		hashtable.moveUpOrDown(1, -2);
		keys = hashtable.getKeysOrdered();
		assert.equal(keys[0], 1, "Key has moved to the first position");
		assert.equal(keys[4], 4, "Original position for item 4");
		hashtable.moveUpOrDown(4, -1);
		keys = hashtable.getKeysOrdered();
		assert.equal(keys[3], 4, "Original position for item 4");
	});
	QUnit.test("moveItemPositionUpOrDown - positive distance", function(assert) {
		var hashtable = new Hashtable(this.oMsgHandler);
		var i = 0;
		for(i = 0; i < 10; i++) {
			hashtable.setItem(i, {
				value : i
			});
		}
		var keys = hashtable.getKeysOrdered();
		assert.equal(keys[1], 1, "Key 1 has original position");
		assert.equal(keys[6], 6, "Key 6 has original position");
		var pos = hashtable.moveUpOrDown(6, 2);
		assert.equal(pos, 8, "Expected position");
		keys = hashtable.getKeysOrdered();
		assert.equal(keys[8], 6, "Key has moved the position");
		assert.equal(keys[7], 8, "Key 8 has expected position");
		assert.equal(keys[6], 7, "Key 7 has expected position");
		assert.equal(keys[4], 4, "Key 4 has expected position");
		hashtable.moveUpOrDown(4, 1);
		keys = hashtable.getKeysOrdered();
		assert.equal(keys[5], 4, "Key 4 has expected position");
	});
});