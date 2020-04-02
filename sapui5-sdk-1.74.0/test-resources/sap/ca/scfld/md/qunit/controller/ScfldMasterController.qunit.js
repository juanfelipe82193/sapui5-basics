/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.define([
	"sap/ca/scfld/md/controller/ScfldMasterController",
	"sap/m/GroupHeaderListItem",
	"sap/m/List",
	"sap/m/ObjectListItem"
], function (ScfldMasterController, GroupHeaderListItem, List, ObjectListItem) {
	"use strict";
	/*global QUnit */

///////////////
//Testing Module - Init
////////////////
	QUnit.module("Init ScfldMasterController");
    var oScfldMasterController;
// require ScfldMasterController
    QUnit.test("New", function (assert) {
        oScfldMasterController = new ScfldMasterController();
        assert.ok(oScfldMasterController, "Controller is initialized.");
    });

//QUnit.test("onInit", function() {
//	oScfldMasterController.onInit();
//	ok(oScfldMasterController, "onInit() is called.");
//});

///////////////
//Testing Module for ApplySearchPattern
////////////////
    QUnit.module("ApplySearchPattern");

    QUnit.test("Empty List", function (assert) {
        if (oScfldMasterController) {
            //overwrite getList method
            var oList = new List("list");
            oScfldMasterController.getList = function () {
                return oList;
            };

            //overwrite applySearchPatternToListItem, check only title text
            oScfldMasterController.applySearchPatternToListItem = function (oItem, sFilterPattern) {
                if (typeof oItem.getProperty("title") == "string") {
                    if (oItem.getProperty("title").toLowerCase().indexOf(sFilterPattern) != -1) {
                        return true;
                    }
                }
                return false;
            };

            oList = oScfldMasterController.getList();
            assert.ok(oList, "getList()");

            var iCount = oScfldMasterController.applySearchPattern("");
            assert.ok(iCount == 0, "search term = '', iCount = " + iCount);
        }
    });

    QUnit.test("List mit items", function (assert) {
        function readListGroupHeaderItemHelper(oItems, iHeaderPosition, bVisible) {
            assert.ok(oItems[iHeaderPosition] instanceof GroupHeaderListItem, "Get " + iHeaderPosition + ". Group Header");
            assert.ok(oItems[iHeaderPosition].getVisible() === bVisible, (bVisible === true) ? "visible" : "in-visible");
        }
        function readListGroupHeaders(oScfldMasterController, bVisible0, bVisible11, bVisible16) {
            var oItems = oScfldMasterController.getList().getItems();

            readListGroupHeaderItemHelper(oItems, 0, bVisible0);
            readListGroupHeaderItemHelper(oItems, 11, bVisible11);
            readListGroupHeaderItemHelper(oItems, 16, bVisible16);
        }

        if (oScfldMasterController) {
            //set the list
            var oHeaderListItem = new GroupHeaderListItem({title: "No Priority", count: 10});
            oScfldMasterController.getList().addItem(oHeaderListItem);
            var oObjectListItem = new ObjectListItem({
                title: "jjkk",
                number: "0,00",
                numberUnit: "AUD",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "check",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "tech7",
                number: "19K",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "djdb",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "this",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "Vhv",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "jy3_1",
                number: "0,00",
                numberUnit: "AUD",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "tech5",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "tech1",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "chekc1344",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);

            oHeaderListItem = new GroupHeaderListItem({title: "Very High", count: 4});
            oScfldMasterController.getList().addItem(oHeaderListItem);
            oObjectListItem = new ObjectListItem({
                title: "fio_1",
                number: "0,00",
                numberUnit: "AUD",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "tech6",
                number: "0,00",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "Hchage",
                number: "676K",
                numberUnit: "BRL",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "check123577586",
                number: "10M",
                numberUnit: "USD",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);

            oHeaderListItem = new GroupHeaderListItem({title: "High", count: 3});
            oScfldMasterController.getList().addItem(oHeaderListItem);
            oObjectListItem = new ObjectListItem({
                title: "tech2",
                number: "166K",
                numberUnit: "INR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "tech4",
                number: "55K",
                numberUnit: "EUR",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);
            oObjectListItem = new ObjectListItem({
                title: "nameji",
                number: "0,00",
                numberUnit: "AUD",
                type: "Active"
            });
            oScfldMasterController.getList().addItem(oObjectListItem);

            var iCount = oScfldMasterController.applySearchPattern("");
            assert.ok(iCount > 0, "search term = '', iCount = " + iCount);
            readListGroupHeaders(oScfldMasterController, true, true, true);

            iCount = oScfldMasterController.applySearchPattern("techxxxx");
            assert.ok(iCount === 0, "search term = 'techxxxx', iCount = " + iCount);
            readListGroupHeaders(oScfldMasterController, false, false, false);

            iCount = oScfldMasterController.applySearchPattern("tech");
            assert.ok(iCount === 6, "search term = 'tech', iCount = " + iCount);
            readListGroupHeaders(oScfldMasterController, true, true, true);

            iCount = oScfldMasterController.applySearchPattern("tech1");
            assert.ok(iCount === 1, "search term = 'tech1', iCount = " + iCount);
            readListGroupHeaders(oScfldMasterController, true, false, false);

            iCount = oScfldMasterController.applySearchPattern("tech2");
            assert.ok(iCount === 1, "search term = 'tech2', iCount = " + iCount);
            readListGroupHeaders(oScfldMasterController, false, false, true);

            iCount = oScfldMasterController.applySearchPattern("tech");
            assert.ok(iCount === 6, "search term = 'tech', iCount = " + iCount);
            readListGroupHeaders(oScfldMasterController, true, true, true);

            iCount = oScfldMasterController.applySearchPattern("");
            assert.ok(iCount === 17, "search term = '', iCount = " + iCount);
            readListGroupHeaders(oScfldMasterController, true, true, true);
        }
    });
});
