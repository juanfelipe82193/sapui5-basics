/* global QUnit */
sap.ui.define([
	"sap/ui/mdc/flexibility/Table.flexibility", "sap/ui/fl/write/api/ChangesWriteAPI", "sap/ui/core/util/reflection/JsControlTreeModifier", "sap/ui/core/UIComponent", "sap/ui/core/ComponentContainer", "sap/ui/mdc/TableDelegate"
], function(TableFlexHandler, ChangesWriteAPI, JsControlTreeModifier, UIComponent, ComponentContainer, TableDelegate) {
	'use strict';

	sap.ui.getCore().loadLibrary("sap.ui.fl");
	var UIComp = UIComponent.extend("test", {
		metadata: {
			manifest: {
				"sap.app": {
					"id": "",
					"type": "application"
				}
			}
		},
		createContent: function() {
			// store it in outer scope
			var oView = sap.ui.view({
				async: false,
				type: "XML",
				id: this.createId("view"),
				viewContent: '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns="sap.ui.mdc" xmlns:mdcTable="sap.ui.mdc.table"><Table id="myTable"><columns><mdcTable:Column id="myTable--column0" header="column 0" dataProperties="column0"><m:Text text="{column0}" id="myTable--text0" /></mdcTable:Column><mdcTable:Column id="myTable--column1" header="column 1" dataProperties="column1"><m:Text text="{column1}" id="myTable--text1" /></mdcTable:Column><mdcTable:Column id="myTable--column2" header="column 2" dataProperties="column2"><m:Text text="{column2}" id="myTable--text2" /></mdcTable:Column></columns></Table></mvc:View>'
			});
			return oView;
		}
	});

	function createRemoveChangeDefinition() {
		return {
			"changeType": "removeColumn",
			"selector": {
				"id": "comp---view--myTable"
			},
			"content": {
				"id": "comp---view--myTable--column1",
				"name": "column1",
				"idIsLocal": false
			}
		};
	}

	function createAddChangeDefinition(sProperty) {
		return {
			"changeType": "addColumn",
			"selector": {
				"id": "comp---view--myTable"
			},
			"content": {
				"name": sProperty
			}
		};
	}

	function fetchProperties() {
		return Promise.resolve([
			{
				name: "column0"
			}, {
				name: "column1"
			}, {
				name: "column2"
			}, {
				name: "SomePropertyName"
			}
		]);
	}

	QUnit.module("Basic functionality with JsControlTreeModifier", {
		beforeEach: function() {
			this.oUiComponent = new UIComp("comp");

			// Place component in container and display
			this.oUiComponentContainer = new ComponentContainer({
				component: this.oUiComponent,
				async: false
			});
			this.oUiComponentContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oView = this.oUiComponent.getRootControl();
			this.oTable = this.oView.byId('myTable');
			this.oColumn1 = this.oView.byId('myTable--column1');
			// Implement required Delgate APIs
			this._orgFn = TableDelegate.fetchProperties;
			TableDelegate.fetchProperties = fetchProperties;
		},
		afterEach: function() {
			this.oUiComponentContainer.destroy();
			TableDelegate.fetchProperties = this._orgFn;
			delete this._orgFn;
		}
	});

	QUnit.test('RemoveColumn - applyChange & revertChange on a js control tree', function(assert) {
		var done = assert.async();
		var oContent = createRemoveChangeDefinition();
		oContent.index = 0;
		return ChangesWriteAPI.create({
			changeSpecificData: oContent,
			selector: this.oTable
		}).then(function(oChange) {
			var oChangeHandler = TableFlexHandler["removeColumn"].changeHandler;
			assert.strictEqual(oChange.getContent().hasOwnProperty("index"), false, "remove changes do not require the index");
			assert.strictEqual(this.oColumn1.getId(), this.oTable.getAggregation('columns')[1].getId(), "column has not been changed");
			assert.strictEqual(this.oTable.getColumns().length, 3);

			// Test apply
			oChangeHandler.applyChange(oChange, this.oTable, {
				modifier: JsControlTreeModifier,
				appComponent: this.oUiComponent,
				view: this.oView
			}).then(function() {
				assert.notEqual(this.oColumn1.getId(), this.oTable.getAggregation('columns')[1].getId(), "column has been removed successfully");
				assert.strictEqual(this.oTable.getColumns().length, 2);

				// Test revert
				oChangeHandler.revertChange(oChange, this.oTable, {
					modifier: JsControlTreeModifier,
					appComponent: this.oUiComponent,
					view: this.oView
				}).then(function() {
					assert.strictEqual(this.oColumn1.getId(), this.oTable.getAggregation('columns')[1].getId(), "column has been restored successfully");
					assert.strictEqual(this.oTable.getColumns().length, 3);
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test('AddColumn - applyChange & revertChange on a js control tree', function(assert) {
		var done = assert.async();
		var sPropertyName = "SomePropertyName";
		return ChangesWriteAPI.create({
			changeSpecificData: createAddChangeDefinition(sPropertyName),
			selector: this.oTable
		}).then(function(oChange) {
			var oChangeHandler = TableFlexHandler["addColumn"].changeHandler;
			assert.strictEqual(this.oTable.getColumns().length, 3);
			// Test apply
			oChangeHandler.applyChange(oChange, this.oTable, {
				modifier: JsControlTreeModifier,
				appComponent: this.oUiComponent,
				view: this.oView
			}).then(function() {
				assert.strictEqual(this.oTable.getColumns()[3].getId(), "comp---view--myTable--" + sPropertyName, "column has been added successfully");
				assert.strictEqual(this.oTable.getColumns().length, 4);

				// Test revert
				oChangeHandler.revertChange(oChange, this.oTable, {
					modifier: JsControlTreeModifier,
					appComponent: this.oUiComponent,
					view: this.oView
				}).then(function() {
					assert.strictEqual(this.oTable.getColumns().length, 3);
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
});
