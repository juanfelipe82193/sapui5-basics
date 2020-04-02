/*global QUnit,sinon*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/commons/demo/tutorial/controller/Startpage.controller",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(jQuery, StartpageController) {
	"use strict";

	QUnit.module("Launchpad Controller - formatJSONDate formatter", {
		beforeEach: function() {
			this.oController = new StartpageController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("JSON date is formatted to local date string", function(assert) {
		assert.equal(this.oController.formatJSONDate("2016-12-06T00:00:00.000Z"), new Date("2016-12-06T00:00:00.000Z").toLocaleDateString(), "Formatted as local date string");
	});

	QUnit.module("Launchpad Controller - formatNumber formatter", {
		beforeEach: function() {
			this.oController = new StartpageController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.module("Launchpad Controller - getProgress formatter", {
		beforeEach: function() {
			this.oController = new StartpageController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("should return 0 if nodes are undefined", function(assert) {
		var aNodes = null;
		var oResult = this.oController.getProgress(aNodes);
		assert.equal(oResult, 0, "0 is returned");
	});

	QUnit.test("should return 0 in nodes collection empty", function(assert) {
		var aNodes = [];
		var oResult = this.oController.getProgress(aNodes);
		assert.equal(oResult, 0, "0 is returned");
	});

	QUnit.test("should return 0 if no node with positive state defined", function(assert) {
		var aNodes = [{ state: "unknown" }, { state: "unknown" }];
		var oResult = this.oController.getProgress(aNodes);
		assert.equal(oResult, 0, "0 is returned");
	});

	QUnit.test("should return 50 if one of two nodes has the state \"Positive\"", function(assert) {
		var aNodes = [{ state: "unknown" }, { state: "Positive" }];
		var oResult = this.oController.getProgress(aNodes);
		assert.equal(oResult, 50, "50 is returned");
	});

	QUnit.test("should return 100 if all nodes have the state \"Positive\"", function(assert) {
		var aNodes = [{ state: "Positive" }, { state: "Positive" }];
		var oResult = this.oController.getProgress(aNodes);
		assert.equal(oResult, 100, "100 is returned");
	});

	QUnit.module("Launchpad Controller - onInit hook", {
		beforeEach: function() {
			this.oController = new StartpageController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("Init method creates model", function(assert) {
		this.oController.getView = function() {
			return {
				setModel: setModel
			};
		};
		this.oController.onInit();

		function setModel(model, name) {
			assert.equal(model.getMetadata().getName(), "sap.ui.model.json.JSONModel", "JSON model created");
			assert.equal(name, "news", "JSON model under name 'news' assigned");
		}
	});

	QUnit.module("Launchpad Controller - getEntityCount formatter", {
		beforeEach: function() {
			this.oController = new StartpageController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("'0' returned in case no parameter is provided", function(assert) {
		assert.equal(this.oController.getEntityCount(), 0);
	});

	QUnit.test("'1' returned in case one entry is inside the array", function(assert) {
		assert.equal(this.oController.getEntityCount(["TestData"]), 1);
	});

	QUnit.module("Launchpad Controller - onTilePressed event handler", {
		beforeEach: function() {
			function getResourceBundle() {
				return jQuery.sap.resources({ url: "../../i18n/i18n.properties" });
			}

			this.oController = new StartpageController();
			this.oController.getOwnerComponent = function() {
				return {
					getModel: function() {
						return {
							getResourceBundle: getResourceBundle
						};
					}
				};
			};
			this.getHeader = function() {
				return "Header";
			};
			this.getSubheader = function() {
				return "Subheader";
			};
			this.oEventMock = {
				getSource: function() {
					return {
						getHeader: this.getHeader,
						getSubheader: this.getSubheader
					};
				}.bind(this)
			};
			this.oSpy = sinon.spy(sap.m.MessageToast, "show");
		},
		afterEach: function() {
			this.oController.destroy();
			this.oSpy.restore();
		}
	});

	QUnit.test("If header and subheader are present, only header is part of the message toast text", function(assert) {
		this.oController.onTilePressed(this.oEventMock);
		assert.ok(this.oSpy.calledWith("The tile \"Header\" is clicked"), "MessageToast shown with correct text");
	});

	QUnit.test("If only Subheader is present, only Subheader is part of the message toast text", function(assert) {
		this.getHeader = function() {
			return null;
		};
		this.oController.onTilePressed(this.oEventMock);
		assert.ok(this.oSpy.calledWith("The tile \"Subheader\" is clicked"), "MessageToast shown with correct text");
	});

	QUnit.test("If nothing is present, the message toast contains generic text", function(assert) {
		this.getHeader = function() {
			return null;
		};
		this.getSubheader = function() {
			return null;
		};
		this.oController.onTilePressed(this.oEventMock);
		assert.ok(this.oSpy.calledWith("A tile is clicked"), "MessageToast shown with correct text");
	});

});
