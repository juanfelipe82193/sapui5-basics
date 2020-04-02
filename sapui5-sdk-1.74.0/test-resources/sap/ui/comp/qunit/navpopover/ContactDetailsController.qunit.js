/* global QUnit, sinon*/

sap.ui.require([
	"sap/m/Text",
	"sap/m/Title",
	"sap/m/Label",
	"sap/m/Link",
	"sap/ui/comp/navpopover/ContactDetailsController",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/VBox"

], function (
	Text,
	Title,
	Label,
	Link,
	ContactDetailsController,
	MockServer,
	ODataModel,
	JSONModel,
	VBox
) {
	"use strict";

	var oMockServer;
	var startMockServer = function() {
		oMockServer = new MockServer({
			rootUri: "/odataFake/"
		});
		// configure
		MockServer.config({
			autoRespond: true,
			autoRespondAfter: 1000
		});
		oMockServer.simulate(
			"test-resources/sap/ui/comp/qunit/navpopover/mockserverQUnit/metadataContactDetailsController.xml",
			"test-resources/sap/ui/comp/qunit/navpopover/mockserverQUnit/"
		);
		oMockServer.start();

		return oMockServer;
	};

	var stopMockServer = function() {
		oMockServer.stop();
		oMockServer.destroy();
	};


	QUnit.module("sap.ui.comp.navpopover.ContactDetailsController", {
		beforeEach: function () {
			startMockServer();
			this.oContactDetailsController = new ContactDetailsController();
			this.oContactDetailsController.setModel(new ODataModel("/odataFake"));
		},
		afterEach: function () {
			stopMockServer();
			this.oContactDetailsController.destroy();
		}
	});

	QUnit.test("addProperty2ExpandAndSelect", function (assert) {

		// act failed positive -----------------------------------------------------------------------------------------
		var aExpands = [];
		var aSelects = [];
		this.oContactDetailsController.addProperty2ExpandAndSelect("", { fn: { Path: "ProductId" } }, "/ProductCollection('38094020.0')", aExpands, aSelects);
		assert.equal(aExpands.length, 0);
		assert.equal(aSelects.length, 0);

		aExpands = [];
		aSelects = [];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", {}, "/ProductCollection('38094020.0')", aExpands, aSelects);
		assert.deepEqual(aExpands, []);
		assert.deepEqual(aSelects, []);

		aExpands = [];
		aSelects = [];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "ProductId" } }, null, aExpands, aSelects);
		assert.deepEqual(aExpands, []);
		assert.deepEqual(aSelects, []);

		aExpands = [];
		aSelects = [];
		var bCaught = false;
		try {
			this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "ProductId" } }, "ProductCollection('38094020.0')", aExpands, aSelects);
		} catch (oError) {
			bCaught = true;
		}
		assert.ok(bCaught);
		assert.deepEqual(aExpands, []);
		assert.deepEqual(aSelects, []);

		// act -----------------------------------------------------------------------------------------
		aExpands = [];
		aSelects = [];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "" } }, "/ProductCollection('38094020.0')", aExpands, aSelects);
		assert.deepEqual(aExpands, []);
		assert.deepEqual(aSelects, []);

		aExpands = [];
		aSelects = [];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "ProductId" } }, "/ProductCollection('38094020.0')", aExpands, aSelects);
		assert.deepEqual(aExpands, []);
		assert.deepEqual(aSelects, ["ProductId"]);

		aExpands = [];
		aSelects = [];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "SupplierId" } }, "/ProductCollection('38094020.0')/to_Supplier", aExpands, aSelects);
		assert.deepEqual(aExpands, ["to_Supplier"]);
		assert.deepEqual(aSelects, ["to_Supplier/SupplierId"]);

		aExpands = [];
		aSelects = [];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "to_Address/AddressId" } }, "/ProductCollection('38094020.0')/to_Supplier", aExpands, aSelects);
		assert.deepEqual(aExpands, ["to_Supplier/to_Address"]);
		assert.deepEqual(aSelects, ["to_Supplier/to_Address/AddressId"]);

		// act additional -----------------------------------------------------------------------------------------
		aExpands = ["to_Supplier"];
		aSelects = ["to_Supplier/SupplierId"];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "FormattedName" } }, "/ProductCollection('38094020.0')/to_Supplier", aExpands, aSelects);
		assert.deepEqual(aExpands, ["to_Supplier"]);
		assert.deepEqual(aSelects, ["to_Supplier/SupplierId", "to_Supplier/FormattedName"]);

		aExpands = ["to_Address"];
		aSelects = ["to_Address/AddressId"];
		this.oContactDetailsController.addProperty2ExpandAndSelect("fn", { fn: { Path: "SupplierId" } }, "/ProductCollection('38094020.0')/to_Supplier", aExpands, aSelects);
		assert.deepEqual(aExpands, ["to_Address", "to_Supplier"]);
		assert.deepEqual(aSelects, ["to_Address/AddressId", "to_Supplier/SupplierId"]);
	});

	QUnit.test("isPropertyHidden", function (assert) {
		var that = this;
		var done1 = assert.async();
		var done2 = assert.async();
		var done3 = assert.async();
		this.oContactDetailsController.bindElement({
			path: "/ProductCollection('38094020.0')",
			events: {
				dataReceived: function () {
					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "").then(function (sPath) {
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/HiddenPropertyProduct"), true);
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/ProductId"), false);
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/Dummy"), false);
						done1();
					});
					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/HiddenPropertySupplier"), true);
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/SupplierId"), false);
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/Dummy"), false);
						done2();
					});
					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "SupplierCollection", "1234567890.0").then(function (sPath) {
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/HiddenPropertySupplier"), true);
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/SupplierId"), false);
						assert.equal(that.oContactDetailsController.isPropertyHidden(sPath + "/Dummy"), false);
						done3();
					});
				}
			}
		});
	});

	QUnit.test("getContactDetailsContainers", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.bindElement({
			path: "/ProductCollection('38094020.0')",
			events: {
				dataReceived: function () {
					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "").then(function (sPath) {
						var aSimpleForms = that.oContactDetailsController.getContactDetailsContainers(sPath);
						assert.equal(aSimpleForms.length, 1);
						assert.ok(aSimpleForms[0]);
						assert.equal(aSimpleForms[0].getContent().length, 3);
						assert.ok(aSimpleForms[0].getContent()[0] instanceof Title);
						assert.ok(aSimpleForms[0].getContent()[1] instanceof Label);
						assert.ok(aSimpleForms[0].getContent()[2] instanceof Text);

						done();
					});
				}
			}
		});
	});

	QUnit.test("getBindingPath4ContactAnnotation", function (assert) {
		var that = this;

		var done = assert.async();
		var oContactDetailsController = new ContactDetailsController();
		oContactDetailsController.setModel(new JSONModel({ ProductCollection: { ProductId: "38094020.0" } }));
		oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			assert.equal(sPath, null);
			oContactDetailsController.destroy();
			done();
		});

		var done1 = assert.async();
		var done2 = assert.async();
		var done3 = assert.async();
		var done4 = assert.async();
		var done5 = assert.async();
		var done6 = assert.async();
		var done7 = assert.async();
		var done8 = assert.async();
		var done9 = assert.async();
		this.oContactDetailsController.bindElement({
			path: "/ProductCollection('38094020.0')",
			events: {
				dataReceived: function () {
					that.oContactDetailsController.getBindingPath4ContactAnnotation().then(function (sPath) {
						assert.equal(sPath, null, "invalide input parameter");
						done1();
					});
					that.oContactDetailsController.getBindingPath4ContactAnnotation(null, null, null).then(function (sPath) {
						assert.equal(sPath, null, "invalide input parameter");
						done2();
					});
					that.oContactDetailsController.getBindingPath4ContactAnnotation("dummy", undefined, undefined).then(function (sPath) {
						assert.equal(sPath, null, "invalide input parameter");
						done3();
					});

					that.oContactDetailsController.getBindingPath4ContactAnnotation("/,,,USd,-multiple-units-not-dereferencable", "to_Supplier", undefined).then(function (sPath) {
						assert.equal(sPath, null, "invalide input parameter");
						done7();
					});

					// Note: Is 'navigationProperty' equal to an empty string then the related entity type is the current one
					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", undefined, undefined).then(function (sPath) {
						assert.equal(sPath, null, "navigationProperty is not set");
						done8();
					});

					// Note: Is 'navigationProperty' equal to an empty string then the related entity type is the current one
					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "dummy", undefined).then(function (sPath) {
						assert.equal(sPath, null, "navigationProperty does not exist");
						done9();
					});

					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "", undefined).then(function (sPath) {
						assert.equal(sPath, "/ProductCollection('38094020.0')", "Contact annotation of the current EntityType");
						done4();
					});

					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier", undefined).then(function (sPath) {
						assert.equal(sPath, "/ProductCollection('38094020.0')/to_Supplier", "Contact annotation via navigation property of the current EntityType");
						done5();
					});

					that.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "SupplierCollection", "1234567890.0").then(function (sPath) {
						assert.equal(sPath, "/SupplierCollection('1234567890.0')", "Contact annotation of a foreign EntityType");
						done6();
					});
				}
			}
		});
	});

	QUnit.module("sap.ui.comp.navpopover.ContactDetailsController: _addEmails", {
		beforeEach: function () {
			startMockServer();
			this.oContactDetailsController = new ContactDetailsController();
			this.oContactDetailsController.setModel(new ODataModel("/odataFake"));

			this.oObserverStub = sinon.stub();
			this.oObserverStub.observe = sinon.stub();
			this.aContent = [];
			this.aExpands = [];
			this.aSelects = [];
		},
		afterEach: function () {
			stopMockServer();
			this.oContactDetailsController.destroy();
		}
	});
	QUnit.test("single", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addEmails({
				email: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					address: { Path: "EmailAddress1" } //2. info@neweconomy.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/home" },
					address: { Path: "EmailAddressHome" } // john.doe@gmx.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/preferred" },
					address: { Path: "EmailAddress2" } //1. john.doe@neweconomy.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					address: { Path: "HiddenPropertySupplier" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 2);
							assert.equal(oContainer.$().find("a")[0].text, "john.doe@neweconomy.com");
							assert.equal(oContainer.$().find("a")[1].text, "info@neweconomy.com");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/EmailAddress2", "to_Supplier/EmailAddress1", "to_Supplier/HiddenPropertySupplier"]);
			assert.equal(that.aContent.length, 4);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
		});
	});

	QUnit.test("with several 'work'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addEmails({
				email: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					address: { Path: "EmailAddress2" } // john.doe@neweconomy.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					address: { Path: "EmailAddress1" } // info@neweconomy.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work com.sap.vocabularies.Communication.v1.ContactInformationType/home" },
					address: { Path: "EmailAddressHome" } // john.doe@gmx.com
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 3);
							assert.equal(oContainer.$().find("a")[0].text, "john.doe@neweconomy.com");
							assert.equal(oContainer.$().find("a")[1].text, "info@neweconomy.com");
							assert.equal(oContainer.$().find("a")[2].text, "john.doe@gmx.com");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/EmailAddress2", "to_Supplier/EmailAddress1", "to_Supplier/EmailAddressHome"]);
			assert.equal(that.aContent.length, 6);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
		});
	});

	QUnit.test("with several 'preferred'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addEmails({
				email: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/preferred" },
					address: { Path: "EmailAddress1" } // info@neweconomy.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/preferred" },
					address: { Path: "EmailAddress2" } // john.doe@neweconomy.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/preferred com.sap.vocabularies.Communication.v1.ContactInformationType/home" },
					address: { Path: "EmailAddressHome" } // john.doe@gmx.com
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 3);
							assert.equal(oContainer.$().find("a")[0].text, "info@neweconomy.com");
							assert.equal(oContainer.$().find("a")[1].text, "john.doe@neweconomy.com");
							assert.equal(oContainer.$().find("a")[2].text, "john.doe@gmx.com");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/EmailAddress1", "to_Supplier/EmailAddress2", "to_Supplier/EmailAddressHome"]);
			assert.equal(that.aContent.length, 6);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
		});
	});

	QUnit.test("mixed with 'preferred'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addEmails({
				email: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					address: { Path: "EmailAddress1" } // info@neweconomy.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/home com.sap.vocabularies.Communication.v1.ContactInformationType/preferred" },
					address: { Path: "EmailAddressHome" } // john.doe@gmx.com
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work com.sap.vocabularies.Communication.v1.ContactInformationType/preferred" },
					address: { Path: "EmailAddress2" } // john.doe@neweconomy.com
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 3);
							assert.equal(oContainer.$().find("a")[0].text, "john.doe@gmx.com");
							assert.equal(oContainer.$().find("a")[1].text, "john.doe@neweconomy.com");
							assert.equal(oContainer.$().find("a")[2].text, "info@neweconomy.com");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/EmailAddressHome", "to_Supplier/EmailAddress2", "to_Supplier/EmailAddress1"]);
			assert.equal(that.aContent.length, 6);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
		});
	});

	QUnit.module("sap.ui.comp.navpopover.ContactDetailsController: _addTels", {
		beforeEach: function () {
			startMockServer();
			this.oContactDetailsController = new ContactDetailsController();
			this.oContactDetailsController.setModel(new ODataModel("/odataFake"));

			this.oObserverStub = sinon.stub();
			this.oObserverStub.observe = sinon.stub();
			this.aContent = [];
			this.aExpands = [];
			this.aSelects = [];
		},
		afterEach: function () {
			stopMockServer();
			this.oContactDetailsController.destroy();
		}
	});
	QUnit.test("single", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/fax" },
					uri: { Path: "FaxNumber" } //3. "+001 6101 34869-9"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work" },
					uri: { Path: "PhoneNumber" } //1. "+001 6101 34869-0"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell" },
					uri: { Path: "MobileNumber1" } //2. "+0049 175 123456"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "MobileNumber2" } //4. "+0049 175 123457"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/home" },
					uri: { Path: "PhoneNumberHome" } // "+0049 175 9876543"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "HiddenPropertySupplier" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 4);
							assert.equal(oContainer.$().find("a")[0].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[1].text, "+0049 175 123456");
							assert.equal(oContainer.$().find("a")[2].text, "+001 6101 34869-9");
							assert.equal(oContainer.$().find("a")[3].text, "+0049 175 123457");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/PhoneNumber", "to_Supplier/MobileNumber1", "to_Supplier/FaxNumber", "to_Supplier/MobileNumber2", "to_Supplier/HiddenPropertySupplier"]);
			assert.equal(that.aContent.length, 8);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
			assert.ok(that.aContent[6] instanceof Label);
			assert.ok(that.aContent[7] instanceof Link);
		});
	});

	QUnit.test("with several 'work'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work" },
					uri: { Path: "PhoneNumber" } // "+001 6101 34869-0"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell" },
					uri: { Path: "MobileNumber1" } // "+0049 175 123456"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work com.sap.vocabularies.Communication.v1.PhoneType/home" },
					uri: { Path: "PhoneNumberHome" } // "+0049 175 9876543"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work" },
					uri: { Path: "MobileNumber2" } // "+0049 175 123457"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 4);
							assert.equal(oContainer.$().find("a")[0].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[1].text, "+0049 175 9876543");
							assert.equal(oContainer.$().find("a")[2].text, "+0049 175 123457");
							assert.equal(oContainer.$().find("a")[3].text, "+0049 175 123456");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/PhoneNumber", "to_Supplier/PhoneNumberHome", "to_Supplier/MobileNumber2", "to_Supplier/MobileNumber1"]);
			assert.equal(that.aContent.length, 8);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
			assert.ok(that.aContent[6] instanceof Label);
			assert.ok(that.aContent[7] instanceof Link);
		});
	});

	QUnit.test("with several 'cell'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell com.sap.vocabularies.Communication.v1.PhoneType/home" },
					uri: { Path: "PhoneNumberHome" } // "+0049 175 9876543"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell" },
					uri: { Path: "MobileNumber1" } // "+0049 175 123456"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell" },
					uri: { Path: "MobileNumber2" } // "+0049 175 123457"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work" },
					uri: { Path: "PhoneNumber" } // "+001 6101 34869-0"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();
			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 4);
							assert.equal(oContainer.$().find("a")[0].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[1].text, "+0049 175 9876543");
							assert.equal(oContainer.$().find("a")[2].text, "+0049 175 123456");
							assert.equal(oContainer.$().find("a")[3].text, "+0049 175 123457");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/PhoneNumber", "to_Supplier/PhoneNumberHome", "to_Supplier/MobileNumber1", "to_Supplier/MobileNumber2"]);
			assert.equal(that.aContent.length, 8);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
			assert.ok(that.aContent[6] instanceof Label);
			assert.ok(that.aContent[7] instanceof Link);
		});
	});

	QUnit.test("with several 'fax'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/fax" },
					uri: { Path: "FaxNumber" } // "+001 6101 34869-9"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/fax" },
					uri: { Path: "MobileNumber2" } // "+0049 175 123457"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work" },
					uri: { Path: "PhoneNumber" } // "+001 6101 34869-0"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/fax com.sap.vocabularies.Communication.v1.PhoneType/home" },
					uri: { Path: "PhoneNumberHome" } // "+0049 175 9876543"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 4);
							assert.equal(oContainer.$().find("a")[0].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[1].text, "+001 6101 34869-9");
							assert.equal(oContainer.$().find("a")[2].text, "+0049 175 123457");
							assert.equal(oContainer.$().find("a")[3].text, "+0049 175 9876543");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/PhoneNumber", "to_Supplier/FaxNumber", "to_Supplier/MobileNumber2", "to_Supplier/PhoneNumberHome"]);
			assert.equal(that.aContent.length, 8);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
			assert.ok(that.aContent[6] instanceof Label);
			assert.ok(that.aContent[7] instanceof Link);
		});
	});

	QUnit.test("'work' mixed with 'preferred'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work" },
					uri: { Path: "PhoneNumber" } //2. "+001 6101 34869-0"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "MobileNumber1" } //1. "+0049 175 123456"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/home com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "PhoneNumberHome" } //3. "+0049 175 9876543"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 3);
							assert.equal(oContainer.$().find("a")[0].text, "+0049 175 123456");
							assert.equal(oContainer.$().find("a")[1].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[2].text, "+0049 175 9876543");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/MobileNumber1", "to_Supplier/PhoneNumber", "to_Supplier/PhoneNumberHome"]);
			assert.equal(that.aContent.length, 6);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
		});
	});

	QUnit.test("'cell' mixed with 'preferred'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell" },
					uri: { Path: "PhoneNumber" } //2. "+001 6101 34869-0"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "MobileNumber1" } //1. "+0049 175 123456"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/home com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "PhoneNumberHome" } //3. "+0049 175 9876543"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 3);
							assert.equal(oContainer.$().find("a")[0].text, "+0049 175 123456");
							assert.equal(oContainer.$().find("a")[1].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[2].text, "+0049 175 9876543");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/MobileNumber1", "to_Supplier/PhoneNumber", "to_Supplier/PhoneNumberHome"]);
			assert.equal(that.aContent.length, 6);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
		});
	});

	QUnit.test("'fax' mixed with 'preferred'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/fax" },
					uri: { Path: "PhoneNumber" } //2. "+001 6101 34869-0"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/fax com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "MobileNumber1" } //1. "+0049 175 123456"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/home com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "PhoneNumberHome" } //3. "+0049 175 9876543"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 3);
							assert.equal(oContainer.$().find("a")[0].text, "+0049 175 123456");
							assert.equal(oContainer.$().find("a")[1].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[2].text, "+0049 175 9876543");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/MobileNumber1", "to_Supplier/PhoneNumber", "to_Supplier/PhoneNumberHome"]);
			assert.equal(that.aContent.length, 6);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
		});
	});

	QUnit.test("mixed with 'preferred'", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addTels({
				tel: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/fax" },
					uri: { Path: "FaxNumber" } //6. "+001 6101 34869-9"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell" },
					uri: { Path: "MobileNumber1" } //4. "+0049 175 123456"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "MobileNumber2" } //3. "+0049 175 123457"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/cell com.sap.vocabularies.Communication.v1.PhoneType/home" },
					uri: { Path: "PhoneNumberHome" } //5. "+0049 175 9876543"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work com.sap.vocabularies.Communication.v1.PhoneType/preferred" },
					uri: { Path: "PhoneNumber" } //1. "+001 6101 34869-0"
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.PhoneType/work com.sap.vocabularies.Communication.v1.PhoneType/home" },
					uri: { Path: "PhoneNumberHome" } //2. "+0049 175 9876543"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("a").length, 6);
							assert.equal(oContainer.$().find("a")[0].text, "+001 6101 34869-0");
							assert.equal(oContainer.$().find("a")[1].text, "+0049 175 9876543");
							assert.equal(oContainer.$().find("a")[2].text, "+0049 175 123457");
							assert.equal(oContainer.$().find("a")[3].text, "+0049 175 123456");
							assert.equal(oContainer.$().find("a")[4].text, "+0049 175 9876543");
							assert.equal(oContainer.$().find("a")[5].text, "+001 6101 34869-9");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/PhoneNumber", "to_Supplier/PhoneNumberHome", "to_Supplier/MobileNumber2", "to_Supplier/MobileNumber1", "to_Supplier/PhoneNumberHome", "to_Supplier/FaxNumber"]);
			assert.equal(that.aContent.length, 12);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Link);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Link);
			assert.ok(that.aContent[4] instanceof Label);
			assert.ok(that.aContent[5] instanceof Link);
			assert.ok(that.aContent[6] instanceof Label);
			assert.ok(that.aContent[7] instanceof Link);
			assert.ok(that.aContent[8] instanceof Label);
			assert.ok(that.aContent[9] instanceof Link);
			assert.ok(that.aContent[10] instanceof Label);
			assert.ok(that.aContent[11] instanceof Link);
		});
	});

	QUnit.module("sap.ui.comp.navpopover.ContactDetailsController: _addAddresses", {
		beforeEach: function () {
			startMockServer();
			this.oContactDetailsController = new ContactDetailsController();
			this.oContactDetailsController.setModel(new ODataModel("/odataFake"));

			this.oObserverStub = sinon.stub();
			this.oObserverStub.observe = sinon.stub();
			this.aContent = [];
			this.aExpands = [];
			this.aSelects = [];
		},
		afterEach: function () {
			stopMockServer();
			this.oContactDetailsController.destroy();
		}
	});
	QUnit.test("single", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "to_Supplier").then(function (sPath) {
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					street: { Path: "to_Address/Street" } //2. "V800 E 3rd St."
				}, {
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/preferred" },
					street: { Path: "to_Address/City" } //1. "Los Angeles"
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);


			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("span").length, 4);
							assert.equal(oContainer.$().find("span")[0].textContent, sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_CONTACT_SECTION_ADR"));
							assert.equal(oContainer.$().find("span")[1].textContent, "Los Angeles");
							assert.equal(oContainer.$().find("span")[2].textContent, sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_CONTACT_SECTION_ADR"));
							assert.equal(oContainer.$().find("span")[3].textContent, "800 E 3rd St.");
							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});

			assert.deepEqual(that.aExpands, ["to_Supplier/to_Address"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/to_Address/City", "to_Supplier/to_Address/Street"]);
			assert.equal(that.aContent.length, 4);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Text);
			assert.ok(that.aContent[2] instanceof Label);
			assert.ok(that.aContent[3] instanceof Text);
		});
	});

	QUnit.test("annotation parts", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "").then(function (sPath) {
			// act 'street'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					street: { Path: "to_Supplier/to_Address/Street" },
					code: { Path: "HiddenPropertyProduct" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			assert.deepEqual(that.aExpands, ["to_Supplier/to_Address"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/to_Address/Street", "HiddenPropertyProduct"]);
			assert.equal(that.aContent.length, 2);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Text);

			// act 'code'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					code: { Path: "to_Supplier/to_Address/PostalCode" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			assert.deepEqual(that.aExpands, ["to_Supplier/to_Address"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/to_Address/PostalCode"]);
			assert.equal(that.aContent.length, 2);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Text);

			// act 'locality'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					locality: { Path: "to_Supplier/to_Address/City" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			assert.deepEqual(that.aExpands, ["to_Supplier/to_Address"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/to_Address/City"]);
			assert.equal(that.aContent.length, 2);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Text);

			// act 'region'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					region: { Path: "to_Supplier/to_Address/State" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			assert.deepEqual(that.aExpands, ["to_Supplier/to_Address"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/to_Address/State"]);
			assert.equal(that.aContent.length, 2);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Text);

			// act 'country'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					country: { Path: "to_Supplier/to_Address/Country" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			assert.deepEqual(that.aExpands, ["to_Supplier/to_Address"]);
			assert.deepEqual(that.aSelects, ["to_Supplier/to_Address/Country"]);
			assert.equal(that.aContent.length, 2);
			assert.ok(that.aContent[0] instanceof Label);
			assert.ok(that.aContent[1] instanceof Text);

			done();
		});
	});

	QUnit.test("formatting all", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "").then(function (sPath) {
			// act 'street'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					country: { Path: "to_Supplier/to_Address/Country" },
					code: { Path: "to_Supplier/to_Address/PostalCode" },
					street: { Path: "to_Supplier/to_Address/Street" },
					region: { Path: "to_Supplier/to_Address/State" },
					locality: { Path: "to_Supplier/to_Address/City" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("span").length, 2);
							assert.equal(oContainer.$().find("span")[0].textContent, sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_CONTACT_SECTION_ADR"));
							assert.equal(oContainer.$().find("span")[1].textContent, "800 E 3rd St., 90013 Los Angeles, CA, USA");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});
		});
	});

	QUnit.test("formatting partially", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "").then(function (sPath) {
			// act 'street'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					code: { Path: "to_Supplier/to_Address/PostalCode" },
					street: { Path: "to_Supplier/to_Address/Street" },
					region: { Path: "to_Supplier/to_Address/State" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("span").length, 2);
							assert.equal(oContainer.$().find("span")[0].textContent, sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_CONTACT_SECTION_ADR"));
							assert.equal(oContainer.$().find("span")[1].textContent, "800 E 3rd St., 90013, CA");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});
		});
	});

	QUnit.test("formatting partially", function (assert) {
		var that = this;
		var done = assert.async();
		this.oContactDetailsController.getBindingPath4ContactAnnotation("/ProductCollection('38094020.0')", "").then(function (sPath) {
			// act 'street'
			that.aExpands = [];
			that.aSelects = [];
			that.aContent = [];
			that.oContactDetailsController._addAddresses({
				adr: [{
					type: { EnumMember: "com.sap.vocabularies.Communication.v1.ContactInformationType/work" },
					code: { Path: "to_Supplier/to_Address/PostalCode" },
					street: { Path: "to_Supplier/to_Address/Street" },
					region: { Path: "to_Supplier/to_Address/State" }
				}]
			}, sPath, that.aExpands, that.aSelects, that.aContent, that.oObserverStub);

			var oContainer = new VBox({ items: that.aContent });
			oContainer.setModel(that.oContactDetailsController.getModel());
			oContainer.placeAt("content");
			sap.ui.getCore().applyChanges();

			oContainer.bindContext({
				path: "/ProductCollection('38094020.0')",
				parameters: { expand: that.aExpands.join(","), select: that.aSelects.join(",") },
				events: {
					change: function () {
						oContainer.invalidate();
						setTimeout(function () {
							assert.equal(oContainer.$().find("span").length, 2);
							assert.equal(oContainer.$().find("span")[0].textContent, sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_CONTACT_SECTION_ADR"));
							assert.equal(oContainer.$().find("span")[1].textContent, "800 E 3rd St., 90013, CA");

							done();
							oContainer.destroy();
						}, 0);
					}
				}
			});
		});
	});

	QUnit.start();
});