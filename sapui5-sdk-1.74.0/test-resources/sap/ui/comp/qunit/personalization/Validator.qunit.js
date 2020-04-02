/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/comp/library',
	'sap/ui/comp/personalization/Validator'

], function(compLibrary, Validator) {
	'use strict';

	QUnit.module("sap.ui.comp.personalization.Validator: checkGroupAndColumns", {
		beforeEach: function() {
			this.oGroupControllerStub = sinon.stub();
			this.oColumnsControllerStub = sinon.stub();
			this.oSetting = {
				group: {
					controller: this.oGroupControllerStub
				},
				columns: {
					controller: this.oColumnsControllerStub
				}
			};
			this.oColumnKey2ColumnMap = {
				country: {},
				name: {}
			};
			this.oPersistentDataTotal = {
				columns: {},
				group: {}
			};
		},
		afterEach: function() {
		}
	});

	QUnit.test("with sap.ui.table.Table", function(assert) {
		var done = assert.async();
		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.Table, this.oSetting, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group and column selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(true);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(true);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group and column not selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(false);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(false);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group not selected and column selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(false);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(true);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oSetting, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, []);
			done();
		});
	});

	QUnit.test("with sap.ui.table.AnalyticalTable: group selected and column not selected", function(assert) {
		this.oGroupControllerStub.isGroupSelected = sinon.stub().returns(true);
		this.oColumnsControllerStub.isColumnSelected = sinon.stub().returns(false);
		var done = assert.async();

		// act
		var aResult = [];
		Validator.checkGroupAndColumns(compLibrary.personalization.TableType.AnalyticalTable, this.oSetting, this.oColumnKey2ColumnMap, this.oPersistentDataTotal, aResult).then(function() {
			// assertions
			assert.deepEqual(aResult, [
				{
					columnKey: "country",
					messageText: sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION"),
					messageType: "Warning",
					panelTypes: [
						"group", "columns"
					]
				}, {
					columnKey: "name",
					messageText: sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION"),
					messageType: "Warning",
					panelTypes: [
						"group", "columns"
					]
				}
			]);
			done();
		});
	});

	QUnit.start();

});