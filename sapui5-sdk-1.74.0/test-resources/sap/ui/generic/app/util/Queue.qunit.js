/*global QUnit */
sap.ui.define(
	["sap/ui/generic/app/util/Queue"],
	function(Queue) {
		"use strict";
		QUnit.module("sap.ui.generic.app.util.Queue", {
			beforeEach: function() {
				this.oQueue = new Queue(5);
			},
			afterEach: function() {
				this.oQueue.destroy();
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oQueue);
		});

		QUnit.test("enqueue on empty queue shall execute item immediately", function(assert) {
			var done = assert.async();
			var bFunc = false, fFunc = function() {
				bFunc = true;
			};

			this.oQueue.enqueue(fFunc).then(function(oResult) {
				assert.ok(bFunc);
				//assert.equal(that.oQueue._aQueue.length, 0);
				done();
			}, function(oResult) {
				assert.ok(false);
				done();
			});
		});

		QUnit.test("enqueue on full queue shall reject the promise", function(assert) {
			var done = assert.async();
			var oQueue, bFunc = false, fFunc = function() {
				bFunc = true;
			};

			oQueue = new Queue(0);
			oQueue.enqueue(fFunc).then(function(oResult) {
				assert.ok(false);
				done();
			}, function(oResult) {
				assert.ok(!bFunc);
				assert.ok(oResult.message);
				done();
			});
			oQueue.destroy();
		});

		QUnit.test("enqueue on unrestricted queue shall never reject the promise", function(assert) {
			var done = assert.async();
			var oQueue, bFunc = false, fFunc = function() {
				bFunc = true;
			};

			oQueue = new Queue();
			oQueue.enqueue(fFunc).then(function(oResult) {
				assert.ok(bFunc);
				done();
			}, function(oResult) {
				assert.ok(false);
				done();
			});
			oQueue.destroy();
		});

		QUnit.test("_cancel shall reject the promise", function(assert) {
			var done = assert.async();
			var bFunc = false, fFunc, oItem;

			fFunc = function() {
				bFunc = true;
			};
			oItem = {
				fn: fFunc
			};
			oItem.jqdeferred = jQuery.Deferred();
			oItem.defer = new Promise(function (fulfill, reject) {
				oItem.jqdeferred.then(fulfill, reject);
			});
			oItem.wait = oItem.defer.then(fFunc);
			this.oQueue._aQueue.push(oItem);

			oItem.defer.then(function(oResult) {
				assert.ok(false);
				done();
			}, function(oResult) {
				assert.ok(!bFunc);
				assert.ok(oResult.message);
				done();
			});
			this.oQueue._cancel();
		});

		QUnit.test("execution of two items", function(assert) {
			var done = assert.async();
			var bFunc1 = false, oItem = {
				fn: function() {}
			};
			oItem.jqdeferred = jQuery.Deferred();
			oItem.defer = new Promise(function (fulfill, reject) {
				oItem.jqdeferred.then(fulfill, reject);
			});
			oItem.wait = oItem.defer.then(oItem.fn);
			this.oQueue._aQueue.push(oItem);

			this.oQueue.enqueue(function() {
				bFunc1 = true;
			}).then(function() {
				assert.ok(bFunc1);
				done();
			}, function() {
				assert.ok(false);
				done();
			});

			this.oQueue._execNext();
		});

		QUnit.test("Shall be destructible", function(assert) {
			this.oQueue.destroy();
			assert.ok(this.oQueue);
			assert.equal(this.oQueue._aQueue.length, 0);
		});
	}
);