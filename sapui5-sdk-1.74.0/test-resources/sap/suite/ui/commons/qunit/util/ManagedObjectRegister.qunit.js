sap.ui.define("sap.suite.ui.commons.qunit.util.ManagedObjectRegister", [
	"sap/suite/ui/commons/util/ManagedObjectRegister",
	"sap/ui/base/ManagedObject",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ManagedObjectRegister, ManagedObject) {
	var FakeManagedObject = ManagedObject.extend("sap.suite.ui.commons.util.ManagedObjectRegisterTest.FakeManagedObject", {
		constructor: function() {
			ManagedObject.apply(this, arguments);
		}
	});

	QUnit.module("ManagedObjectRegisterTest");

	QUnit.test("Getter is defined.", function (assert) {
		var register = new ManagedObjectRegister();
		register.register("Test", new FakeManagedObject());
		assert.equal(typeof register.getTest, "function", "Getter wasn't defined.");
		register.destroyAll();
	});

	QUnit.test("Lazy initialization.", function (assert) {
		var register = new ManagedObjectRegister();
		var constructorCalled = false;
		register.register("Test", function () {
			constructorCalled = true;
			return new FakeManagedObject();
		});
		assert.equal(typeof register.getTest, "function", "Getter wasn't defined.");
		assert.equal(constructorCalled, false, "Value was initialized before calling getter.");
		register.getTest();
		assert.equal(constructorCalled, true, "Value wasn't initialized by getter.");
		constructorCalled = false;
		register.getTest();
		assert.equal(constructorCalled, false, "Factory was called twice on singe value.");
		register.destroyAll();
	});

	QUnit.test("Destroy all.", function (assert) {
		var register = new ManagedObjectRegister();
		var fakeObject = new FakeManagedObject();
		assert.equal(typeof fakeObject.bIsDestroyed, "undefined", "New object shouldn't be destroyed.");
		register.register("Test", fakeObject);
		register.destroyAll();
		assert.equal(fakeObject.bIsDestroyed, true, "Destroy wasn't called.");
	});

	QUnit.test("Destroy object.", function (assert) {
		var register = new ManagedObjectRegister();
		var fakeObject = new FakeManagedObject();
		assert.equal(typeof fakeObject.bIsDestroyed, "undefined", "New object shouldn't be destroyed.");
		register.register("Test", fakeObject);
		assert.equal(typeof register.getTest, "function", "Getter wasn't defined.");
		register.destroyObject("Test");
		assert.equal(typeof register.getTest, "undefined", "Getter was removed.");
		assert.equal(fakeObject.bIsDestroyed, true, "Destroy wasn't called.");
	});

	QUnit.test("Newly registered object destroyed predecessor.", function (assert) {
		var register = new ManagedObjectRegister();
		var factoryId = 0;
		register.register("Test", function () {
			factoryId = 1;
			return new FakeManagedObject();
		});
		register.register("Test", function () {
			factoryId = 2;
			return new FakeManagedObject();
		});
		var fakeObject = register.getTest();
		assert.equal(factoryId, 2, "Wrong factory function was called.");
		register.register("Test", function () {
			return new FakeManagedObject();
		});
		register.getTest();
		assert.equal(fakeObject.bIsDestroyed, true, "Predecessor should have been destroyed.");
		register.destroyAll();
	});

});
