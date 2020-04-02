/* global QUnit*/
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/comp/personalization/SelectionController', 'sap/ui/comp/personalization/ChangeType'

], function(SelectionController, ChangeType) {
	'use strict';

	var oEmpty = {
		selection: {
			selectionItems: []
		}
	};
	var oA = {
		selection: {
			selectionItems: [
				{
					columnKey: "name",
					visible: true
				}
			]
		}
	};
	var oAx = {
		selection: {
			selectionItems: [
				{
					columnKey: "name",
					visible: false
				}
			]
		}
	};
	var oB = {
		selection: {
			selectionItems: [
				{
					columnKey: "country",
					visible: false
				}
			]
		}
	};
	var oBx = {
		selection: {
			selectionItems: [
				{
					columnKey: "country",
					visible: true
				}
			]
		}
	};
	var oAB = {
		selection: {
			selectionItems: [
				{
					columnKey: "name",
					visible: true
				}, {
					columnKey: "country",
					visible: false
				}
			]
		}
	};
	var oBA = {
		selection: {
			selectionItems: [
				{
					columnKey: "country",
					visible: false
				}, {
					columnKey: "name",
					visible: true

				}
			]
		}
	};
	QUnit.module("Properties", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable to check that selectioncontroller exist", function(assert) {
		assert.ok(new SelectionController(), "Could not instantiate SelectionController");
	});

	QUnit.test("getUnionData", function(assert) {
		// system under test
		var oSelectionController = new SelectionController();

		// arrange

		// act

		// assertions
		assert.deepEqual(oSelectionController.getUnionData({}, {}), null, "change: {} UNION {} = null");

		assert.deepEqual(oSelectionController.getUnionData(oA, oA), oA, "no change: A UNION A = A");
		assert.deepEqual(oSelectionController.getUnionData(oA, null), oA, "no change: A UNION null = A");
		assert.deepEqual(oSelectionController.getUnionData(oA, oEmpty), oA, "change: A UNION [] = A");
		assert.deepEqual(oSelectionController.getUnionData(oEmpty, oA), oEmpty, "change: [] UNION A = []");
		assert.deepEqual(oSelectionController.getUnionData(oA, {}), oA, "no change: A UNION {} = A");
		assert.deepEqual(oSelectionController.getUnionData({}, oA), oA, "change: {} UNION A = A");
		assert.deepEqual(oSelectionController.getUnionData(oA, {
			sort: {}
		}), oA, "no change: A UNION {sort} = A");
		assert.deepEqual(oSelectionController.getUnionData(oA, oAx), oAx, "change: A UNION A' = A'");
		assert.deepEqual(oSelectionController.getUnionData(oA, oB), oA, "change: A UNION B = A");
		assert.deepEqual(oSelectionController.getUnionData(oA, oAB), oA, "change: A UNION (A, B) = A");
		assert.deepEqual(oSelectionController.getUnionData(oAB, oAB), oAB, "change: (A, B) UNION (A, B) = (A, B)");
		assert.deepEqual(oSelectionController.getUnionData(oAB, oBA), oAB, "change: (A, B) UNION (B, A) = (A, B)");

		// cleanup
		oSelectionController.destroy();
	});

	QUnit.test("getChangeData", function(assert) {
		// system under test
		var oSelectionController = new SelectionController();

		// arrange

		// act

		// assertions
		// ------ no changes --------------------------------------------------------------
		assert.deepEqual(oSelectionController.getChangeData(oA, oA), null);
		assert.deepEqual(oSelectionController.getChangeData(oA, oAx), oA);
		assert.deepEqual(oSelectionController.getChangeData(oA, null), null);
		assert.deepEqual(oSelectionController.getChangeData(oA, {}), null);
		assert.deepEqual(oSelectionController.getChangeData(oEmpty, oA), null);
		assert.deepEqual(oSelectionController.getChangeData(oA, {
			selection: {}
		}), null);
		assert.deepEqual(oSelectionController.getChangeData(oA, oAB), null);
		assert.deepEqual(oSelectionController.getChangeData(oAB, oBA), null);
		assert.deepEqual(oSelectionController.getChangeData(oAB, oAB), null);

		// ------ changes --------------------------------------------------------------
		assert.deepEqual(oSelectionController.getChangeData(oA, oB), oA);
		assert.deepEqual(oSelectionController.getChangeData(oAx, oBA), oAx);
		assert.deepEqual(oSelectionController.getChangeData(oA, oEmpty), oA);
		assert.deepEqual(oSelectionController.getChangeData(oAB, oBx), oAB);

		// ------ ??? --------------------------------------------------------------
		assert.deepEqual(oSelectionController.getChangeData({
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}, {
						columnKey: "city",
						visible: true
					}
				]
			}
		}), null);

		assert.deepEqual(oSelectionController.getChangeData({
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: undefined
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}
				]
			}
		}), null);

		// cleanup
		oSelectionController.destroy();
	});

	QUnit.test("getChangeType", function(assert) {
		// system under test
		var oSelectionController = new SelectionController();

		assert.deepEqual(oSelectionController.getChangeType(oA, oA), ChangeType.Unchanged);
		assert.deepEqual(oSelectionController.getChangeType(oA, {}), ChangeType.Unchanged);
		assert.deepEqual(oSelectionController.getChangeType(oA, oAx), ChangeType.ModelChanged);

		// cleanup
		oSelectionController.destroy();
	});

	QUnit.test("_isSemanticEqual", function(assert) {
		// system under test
		var oSelectionController = new SelectionController();
		// arrange

		// act

		// assert
		assert.ok(!oSelectionController._isSemanticEqual({
			selection: {
				selectionItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "B"
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "A"
					}
				]
			}
		}));
		assert.ok(oSelectionController._isSemanticEqual({
			selection: {
				selectionItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "B"
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "B"
					}, {
						columnKey: "A"
					}
				]
			}
		}));
		assert.ok(!oSelectionController._isSemanticEqual({
			selection: {
				selectionItems: [
					{
						columnKey: "A",
						visible: false
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "A"
					}
				]
			}
		}));
		assert.ok(oSelectionController._isSemanticEqual({
			selection: {
				selectionItems: []
			}
		}, {
			selection: {
				selectionItems: []
			}
		}));
		assert.ok(!oSelectionController._isSemanticEqual({
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}, {
						columnKey: "city",
						visible: false
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: false
					}, {
						columnKey: "city",
						visible: true
					}
				]
			}
		}));
		assert.ok(oSelectionController._isSemanticEqual({
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}, {
						columnKey: "city",
						visible: true
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}, {
						columnKey: "city",
						visible: true
					}
				]
			}
		}));
		assert.ok(!oSelectionController._isSemanticEqual({
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}, {
						columnKey: "city",
						visible: true
					}
				]
			}
		}, {
			selection: {
				selectionItems: [
					{
						columnKey: "name",
						visible: true
					}
				]
			}
		}));

		// cleanup
		oSelectionController.destroy();
	});

	QUnit.start();

});