/* globals QUnit */
	QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/comp/smartfilterbar/FilterProvider", "sap/ui/core/util/MockServer", "sap/ui/model/odata/v2/ODataModel", "sap/ui/model/odata/ODataMetaModel"
], function(FilterProvider, MockServer, ODataModel, ODataMetaModel) {
	"use strict";

	var oMockServer;

	function startMockServer() {
		oMockServer = new MockServer({
			rootUri: "/odataFake/"
		});
		// configure
		MockServer.config({
			autoRespond: true,
			autoRespondAfter: 1000
		});
		oMockServer.simulate("./sample/smartfilterbar_types/mockserver/metadata.xml");
		oMockServer.start();
	}

	function stopMockServer() {
		oMockServer.stop();
	}

	QUnit.module("sap.ui.comp.smartfilterbar.FilterProviderDates", {
		before: function() {

			startMockServer();

			this.oModel = new ODataModel("/odataFake/");
// this.oModel.metadataLoaded().then(function() {
// // QUnit.start();
// }.bind(this));
		},
		after: function() {
			this.oModel.destroy();
			stopMockServer();
		},
		beforeEach: function(assert) {

		},
		afterEach: function() {
			// this.oFilterProvider.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {

		var done = assert.async();

		Promise.all([
			this.oModel.metadataLoaded(), this.oModel.getMetaModel().loaded()
		]).then(function() {
			FilterProvider._createFilterProvider({
				entitySet: "ZEPM_C_SALESORDERITEMQUERYResults",
				model: this.oModel
			}).then(function(oFilterProvider) {
				assert.ok(oFilterProvider);

				oFilterProvider.destroy();
				done();
			});
		}.bind(this));

	});

	QUnit.test("Date fields", function(assert) {

		var nCount, done = assert.async();

		Promise.all([
			this.oModel.metadataLoaded(), this.oModel.getMetaModel().loaded()
		]).then(function() {
			FilterProvider._createFilterProvider({
				entitySet: "ZEPM_C_SALESORDERITEMQUERYResults",
				model: this.oModel
			}).then(function(oFilterProvider) {
				assert.ok(oFilterProvider);

				var aFieldNames = [
					"DATE_SINGLE", "DATE_MULTIPLE", "DATE_INTERVAL", "DATE_AUTO"
				];
				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "Date.Group") {
						nCount = 0;
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name) >= 0) {
								nCount++;

								assert.ok(!oField.control);
								oField.fCreateControl(oField);
								assert.ok(oField.control);
								delete oField.fCreateControl;

								switch (oField.filterRestriction) {
									case "single":
										assert.ok(oField.control.isA("sap.m.DatePicker"));
										break;
									case "interval":
										assert.ok(oField.control.isA("sap.m.DatePicker"));
										break;
									case "multiple":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
									case "auto":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
								}
							}
						});

						assert.equal(nCount, 4);
					}
				});

				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "Date.Group") {
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name)) {
								assert.ok(oField.control);
								oField.control.destroy();
							}
						});
					}
				});

				oFilterProvider.destroy();
				done();
			});
		}.bind(this));

	});

	QUnit.test("Time fields", function(assert) {

		var nCount, done = assert.async();

		Promise.all([
			this.oModel.metadataLoaded(), this.oModel.getMetaModel().loaded()
		]).then(function() {
			FilterProvider._createFilterProvider({
				entitySet: "ZEPM_C_SALESORDERITEMQUERYResults",
				model: this.oModel
			}).then(function(oFilterProvider) {
				assert.ok(oFilterProvider);

				var aFieldNames = [
					"TIME_SINGLE", "TIME_MULTIPLE", "TIME_INTERVAL", "TIME_AUTO"
				];
				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "Time.Group") {
						nCount = 0;
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name) >= 0) {
								nCount++;

								assert.ok(!oField.control);
								oField.fCreateControl(oField);
								assert.ok(oField.control);
								delete oField.fCreateControl;

								switch (oField.filterRestriction) {
									case "single":
										assert.ok(oField.control.isA("sap.m.TimePicker"));
										break;
									case "interval":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
									case "multiple":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
									case "auto":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
								}
							}
						});

						assert.equal(nCount, 4);
					}
				});

				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "Time.Group") {
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name)) {
								assert.ok(oField.control);
								oField.control.destroy();
							}
						});
					}
				});

				oFilterProvider.destroy();
				done();
			});
		}.bind(this));

	});

	QUnit.test("StringDate fields", function(assert) {

		var nCount, done = assert.async();

		Promise.all([
			this.oModel.metadataLoaded(), this.oModel.getMetaModel().loaded()
		]).then(function() {
			FilterProvider._createFilterProvider({
				entitySet: "ZEPM_C_SALESORDERITEMQUERYResults",
				model: this.oModel
			}).then(function(oFilterProvider) {
				assert.ok(oFilterProvider);

				var aFieldNames = [
					"STRINGDATE_SINGLE", "STRINGDATE_MULTIPLE", "STRINGDATE_INTERVAL", "STRINGDATE_AUTO"
				];
				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "StringDate.Group") {
						nCount = 0;
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name) >= 0) {
								nCount++;

								assert.ok(!oField.control);
								oField.fCreateControl(oField);
								assert.ok(oField.control);
								delete oField.fCreateControl;

								switch (oField.filterRestriction) {
									case "single":
										assert.ok(oField.control.isA("sap.m.DatePicker"));
										break;
									case "interval":
										assert.ok(oField.control.isA("sap.m.DatePicker"));
										break;
									case "multiple":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
									case "auto":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
								}
							}
						});

						assert.equal(nCount, 4);
					}
				});

				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "StringDate.Group") {
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name)) {
								assert.ok(oField.control);
								oField.control.destroy();
							}
						});
					}
				});

				oFilterProvider.destroy();
				done();
			});
		}.bind(this));

	});

	QUnit.test("DateTimeOffset fields", function(assert) {

		var nCount, done = assert.async();

		Promise.all([
			this.oModel.metadataLoaded(), this.oModel.getMetaModel().loaded()
		]).then(function() {
			FilterProvider._createFilterProvider({
				entitySet: "ZEPM_C_SALESORDERITEMQUERYResults",
				model: this.oModel
			}).then(function(oFilterProvider) {
				assert.ok(oFilterProvider);

				var aFieldNames = [
					"DTOFFSET_SINGLE", "DTOFFSET_MULTIPLE", "DTOFFSET_INTERVAL", "DTOFFSET_AUTO"
				];
				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "DTOffset.Group") {
						nCount = 0;
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name) >= 0) {
								nCount++;

								assert.ok(!oField.control);
								oField.fCreateControl(oField);
								assert.ok(oField.control);
								delete oField.fCreateControl;

								switch (oField.filterRestriction) {
									case "single":
										assert.ok(oField.control.isA("sap.m.DateTimePicker"));
										break;
									case "interval":
										assert.ok(oField.control.isA("sap.m.Input"));
										break;
									case "multiple":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
									case "auto":
										assert.ok(oField.control.isA("sap.m.MultiInput"));
										break;
								}
							}
						});

						assert.equal(nCount, 4);
					}
				});

				oFilterProvider.getFilterBarViewMetadata().forEach(function(oGroup) {
					if (oGroup.groupName === "DTOffset.Group") {
						oGroup.fields.forEach(function(oField) {
							if (aFieldNames.indexOf(oField.name)) {
								assert.ok(oField.control);
								oField.control.destroy();
							}
						});
					}
				});

				oFilterProvider.destroy();
				done();
			});
		}.bind(this));

	});

	QUnit.start();

});