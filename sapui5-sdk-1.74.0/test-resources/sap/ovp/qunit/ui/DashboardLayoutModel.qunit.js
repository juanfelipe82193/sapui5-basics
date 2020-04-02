sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global",
    "sap/ovp/cards/CommonUtils",
    "/sap/ovp/ui/DashboardLayoutModel"
],function (utils, mockservers, jquery, CommonUtils, DashboardLayoutModel) {
            "use strict";
            /* module, ok, test, jQuery, sap */
            //jQuery.sap.require("DashboardLayoutModel");
            //jQuery.sap.require("sap.ovp.app.Component");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //jQuery.sap.require("sap/ui/Device");
            //jQuery.sap.require("sap/ovp/cards/CommonUtils");

            var utils = utils,
                    Device = sap.ui.Device,
                    CommonUtils = CommonUtils;
            var oComponent, oModel;
            var iDashboardWidth = jQuery(window).width();

            module("DashboardLayoutModel", {
                /**
                 * This method is called before each test
                 */
                setup: function () {
                    //jQuery.sap.require("sap.ovp.test.mockservers");
                    mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
                },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                teardown: function () {
                }
            });

            test("DashboardLayoutModel Constructor Test", function () {
                //create DashboardLayoutModel object with initial configuration
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
                }
                ok(this.dashboardLayoutModel.iColCount === 5, "initial column count should be 5");
                ok(this.dashboardLayoutModel.iCardBorderPx === 8, "initial card border should be 8px");
                ok(this.dashboardLayoutModel.iRowHeightPx === 16, "initial row height should be 16px");
            });

            test("setColCount function test", function () {
                //create DashboardLayoutModel object with column count 10
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", 10, 16, 8);
                }
                ok(this.dashboardLayoutModel.iColCount === 10, "column count should be 10");
            });

            test("getColCount function test", function () {
                //create DashboardLayoutModel object with column count 4
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", 4, 16, 8);
                }
                ok(this.dashboardLayoutModel.getColCount() === 4, "column count should be 4");
            });

            test("getCardById function test", function () {
                //create DashboardLayoutModel object with initial configuration
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
                }
                this.dashboardLayoutModel.aCards = [{
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "dashboardLayout": {
                        "autoSpan": true,
                        "colSpan": 1,
                        "column": 1,
                        "containerLayout": "resizable",
                        "headerHeight": 82,
                        "height": "192px",
                        "iCardBorderPx": 8,
                        "iRowHeightPx": 16,
                        "itemHeight": 64,
                        "left": "0px",
                        "maxColSpan": 1,
                        "noOfItems": 3,
                        "row": 1,
                        "rowSpan": 12,
                        "showOnlyHeader": false,
                        "top": "0px",
                        "visible": true,
                        "width": "380px"
                    },
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "defaultSpan": {rows: 3, cols: 1},
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "listType": "condensed",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                }];
                ok(this.dashboardLayoutModel.getCardById("card001") === this.dashboardLayoutModel.aCards[0], "should return the card with id card001");
            });

            test("getLayoutVariants4Pers function test", function () {
                //create DashboardLayoutModel object with initial configuration
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
                }
                this.dashboardLayoutModel.oLayoutVars = [{
                    "id": "card001",
                    "selectedKey": undefined,
                    "visibility": true,
                    "dashboardLayout": {
                        "C4": {
                            "autoSpan": true,
                            "col": 1,
                            "colSpan": 1,
                            "maxColSpan": 1,
                            "noOfItems": 3,
                            "row": 1,
                            "rowSpan": 12,
                            "showOnlyHeader": false
                        }
                    }
                }];
                ok(JSON.stringify(this.dashboardLayoutModel.getLayoutVariants4Pers()) === JSON.stringify(this.dashboardLayoutModel.oLayoutVars), "should return the card layout variant for personalization");
            });

            test("_mergeLayoutVariants function test", function () {
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
                }
                var oSourceObject = {},
                        oDestinationObject = {
                            "rowSpan": 12,
                            "colSpan": 1,
                            "maxColSpan": 1,
                            "noOfItems": 5,
                            "autoSpan": true,
                            "row": 1,
                            "col": 1,
                            "showOnlyHeader": true
                        };
                this.dashboardLayoutModel._mergeLayoutVariants(oSourceObject, oDestinationObject);
                ok(oDestinationObject.rowSpan === oSourceObject.rowSpan, "source object rowSpan should be equal to destination object rowSpan");
                ok(oDestinationObject.colSpan === oSourceObject.colSpan, "source object colSpan should be equal to destination object colSpan");
                ok(oDestinationObject.maxColSpan === oSourceObject.maxColSpan, "source object maxColSpan should be equal to destination object maxColSpan");
                ok(oDestinationObject.noOfItems === oSourceObject.noOfItems, "source object noOfItems should be equal to destination object noOfItems");
                ok(oDestinationObject.autoSpan === oSourceObject.autoSpan, "source object autoSpan should be equal to destination object autoSpan");
                ok(oDestinationObject.row === oSourceObject.row, "source object row should be equal to destination object row");
                ok(oDestinationObject.col === oSourceObject.column, "source object column should be equal to destination object column");
                ok(oDestinationObject.showOnlyHeader === oSourceObject.showOnlyHeader, "source object showOnlyHeader should be equal to destination object showOnlyHeader");
            });

            test("_getDefaultCardItemHeightAndCount function test for list card", function () {
                //create DashboardLayoutModel object with initial configuration
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
                }
                var oCardProperties = {
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "dashboardLayout": {},
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "defaultSpan": {rows: 3, cols: 1},
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "listType": "condensed",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                };
                var densityStyle = sinon.stub(sap.ovp.cards.CommonUtils, "_setCardpropertyDensityAttribute", function () {
                    return "compact"
                });
                var oReturnedObject = this.dashboardLayoutModel._getDefaultCardItemHeightAndCount(oCardProperties);
                ok(oReturnedObject.headerHeight == 82, "header height should be 82");
                ok(oReturnedObject.itemHeight == 64, "item height should be 82");
                ok(oReturnedObject.noOfItems == 5, "number of items should be 5");
                densityStyle.restore();
            });

            test("_setCardSpanFromDefault function test for list card with defaultSpan", function () {
                //create DashboardLayoutModel object with initial configuration
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
                }
                var oCardProperties = {
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "dashboardLayout": {},
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "defaultSpan": {rows: 3, cols: 1, showOnlyHeader: true},
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "listType": "condensed",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                };
                this.dashboardLayoutModel._setCardSpanFromDefault(oCardProperties);
                ok(oCardProperties.dashboardLayout.hasOwnProperty("autoSpan") && oCardProperties.dashboardLayout.autoSpan === false, "it should add property autoSpan in dashboardLayout object with value false");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("colSpan") && oCardProperties.dashboardLayout.colSpan === 1, "it should add property colSpan in dashboardLayout object with value 1");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("headerHeight") && oCardProperties.dashboardLayout.headerHeight === 82, "it should add property headerHeight in dashboardLayout object with value 82");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("itemHeight") && oCardProperties.dashboardLayout.itemHeight === 64, "it should add property itemHeight in dashboardLayout object with value 64");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("maxColSpan") && oCardProperties.dashboardLayout.maxColSpan === 1, "it should add property maxColSpan in dashboardLayout object with value 1");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("noOfItems") && oCardProperties.dashboardLayout.noOfItems === 0, "it should add property noOfItems in dashboardLayout object with value 0");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("rowSpan") && oCardProperties.dashboardLayout.rowSpan === 7, "it should add property rowSpan in dashboardLayout object with value 7");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("showOnlyHeader") && oCardProperties.dashboardLayout.showOnlyHeader === true, "it should add property showOnlyHeader in dashboardLayout object with value true");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("visible") && oCardProperties.dashboardLayout.visible === true, "it should add property visible in dashboardLayout object with value true");
            });

            test("_setCardSpanFromDefault function test for table card without defaultSpan", function () {
                //create DashboardLayoutModel object with initial configuration
                if (!this.dashboardLayoutModel) {
                    this.dashboardLayoutModel = new DashboardLayoutModel("", null, 16, 8);
                }
                var oCardProperties = {
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.table",
                    "dashboardLayout": {},
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                };
                this.dashboardLayoutModel._setCardSpanFromDefault(oCardProperties);
                ok(oCardProperties.dashboardLayout.hasOwnProperty("autoSpan") && oCardProperties.dashboardLayout.autoSpan === true, "it should add property autoSpan in dashboardLayout object with value true");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("colSpan") && oCardProperties.dashboardLayout.colSpan === 1, "it should add property colSpan in dashboardLayout object with value 1");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("headerHeight") && oCardProperties.dashboardLayout.headerHeight === 82, "it should add property headerHeight in dashboardLayout object with value 82");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("itemHeight") && oCardProperties.dashboardLayout.itemHeight === 62, "it should add property itemHeight in dashboardLayout object with value 64");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("maxColSpan") && oCardProperties.dashboardLayout.maxColSpan === 1, "it should add property maxColSpan in dashboardLayout object with value 1");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("noOfItems") && oCardProperties.dashboardLayout.noOfItems === 5, "it should add property noOfItems in dashboardLayout object with value 5");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("rowSpan") && oCardProperties.dashboardLayout.rowSpan === 12, "it should add property rowSpan in dashboardLayout object with value 12");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("showOnlyHeader") && oCardProperties.dashboardLayout.showOnlyHeader === false, "it should add property showOnlyHeader in dashboardLayout object with value false");
                ok(oCardProperties.dashboardLayout.hasOwnProperty("visible") && oCardProperties.dashboardLayout.visible === true, "it should add property visible in dashboardLayout object with value true");
            });

        });