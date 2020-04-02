// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ovp.Card
 */
sap.ui.define([
    "sap/ovp/app/Component",
    "sap/ovp/cards/CommonUtils",
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "test-resources/sap/ovp/mockservers"
], function (appComponent, CommonUtils, utils, OVPCardAsAPIUtils, mockservers) {
    "use strict";
    /* jQuery, sap */

    /**
     * This is a hack, as the namespace 'sap.ovp.demo' when run in the qunit results in wrong resource prefix
     * so i change now manually - to continue work. consult Aviad what causes this so we could remove this.
     */
    //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
    /*jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
     jQuery.sap.require("sap.ovp.cards.OVPCardAsAPIUtils");
     jQuery.sap.require("sap.ovp.cards.CommonUtils");*/
    var utils = utils;
    var oController;
    var CardController;
    var OVPCardAsAPIUtils = OVPCardAsAPIUtils;
    var CommonUtils = CommonUtils;

    module("sap.ovp.cards.Table", {
        /**
         * This method is called before each test
         */
        setup: function () {
            //jQuery.sap.require("sap.ovp.test.mockservers");
            oController = new sap.ui.controller("sap.ovp.cards.table.Table");
            CardController = new sap.ui.controller("sap.ovp.cards.generic.Card");
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
            mockservers.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            mockservers.close();
        }
    });

    test("Table Card Test - testing Parameterized EntitySet - Valid Parameterized configuration (annotations & card settings)- formatItems should parse it correctly", function () {
        var cardTestData = {
            card: {
                "id": "card_1",
                "model": "salesShare",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant",
                    "entitySet": "SalesShare"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesShare,
                rootUri: utils.odataRootUrl_salesShare,
                annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml"
            },
            expectedResult: {
                Body: {
                    List: {
                        itemsAggregationBinding: "{path: '/SalesShareParameters(P_Currency=%27EUR%27,P_Country=%27IN%27)/Results', length: 5}"
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var tableNodeXml = sap.ovp.test.qunit.cards.utils.getTableItemsNode(cardXml);
                ok(tableNodeXml !== undefined, "Existence check to XML Node of List");

                var itemsAggregationValue = tableNodeXml.getAttribute('items');
                ok(itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding, "Table XML items-aggregation's value Includes the Parameterized-Entity-Set");
            });
        });
    });


    test("Table Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - No Selection Variant in card settings, Valid Selection Variant in Annotations", function () {
        var cardTestData = {
            card: {
                "id": "card_2",
                "model": "salesShare",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "entitySet": "SalesShare"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesShare,
                rootUri: utils.odataRootUrl_salesShare,
                annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml"
            },
            expectedResult: {
                Body: {
                    List: {
                        itemsAggregationBinding: "{path: '/SalesShare', length: 5}"
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var tableNodeXml = sap.ovp.test.qunit.cards.utils.getTableItemsNode(cardXml);
                ok(tableNodeXml !== undefined, "Existence check to XML Node of List");

                var itemsAggregationValue = tableNodeXml.getAttribute('items');
                ok(itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding, "Table XML items-aggregation's value Includes the Parameterized-Entity-Set");
            });
        });
    });


    test("Table Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - Invalid Selection Variant value in card settings, Valid Selection Variant annotations", function () {
        var cardTestData = {
            card: {
                "id": "card_3",
                "model": "salesShare",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariantInvalidValue",
                    "entitySet": "SalesShare"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesShare,
                rootUri: utils.odataRootUrl_salesShare,
                annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml"
            },
            expectedResult: {
                Body: {
                    List: {
                        itemsAggregationBinding: "{path: '/SalesShare', length: 5}"
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var tableNodeXml = sap.ovp.test.qunit.cards.utils.getTableItemsNode(cardXml);
                ok(tableNodeXml !== undefined, "Existence check to XML Node of List");

                var itemsAggregationValue = tableNodeXml.getAttribute('items');
                ok(itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding, "Table XML items-aggregation's value Includes the Parameterized-Entity-Set");
            });
        });
    });


    test("Table Test - simple card", function () {
        var cardTestData = {
            card: {
                "id": "card_4",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderLineItemSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "Item"
                            },
                            {
                                text: "Product ID"
                            },
                            {
                                text: "Quantity"
                            }
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'SalesOrderID'.*\}/},
                                    {text: /\{path: *'ProductID'.*\}/},
                                    {text: /\{path: *'Quantity'.*\}/}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });

    test("Table Test - semantic object check for smartlink", function () {
        var cardTestData = {
            card: {
                "id": "card_4a",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderLineItemSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'SalesOrderID'.*\}/},
                                    {text: /\{path: *'ProductID'.*\}/, semanticObject: "OVP"},
                                    {text: /\{path: *'Quantity'.*\}/}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableSemanticObjectValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });

    test("Table Test - Contact annotation check", function () {
        var cardTestData = {
            card: {
                "id": "card_contact_annotation_test",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderSet",
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#TableContactAnnotaionTest"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        items: {
                            ColumnListItem: {
                                cells: [
                                    {quickViewElement: "true"}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableContactAnnotationValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });

    test("Table Test - center alignment check for table card", function () {
        var cardTestData = {
            card: {
                "id": "card_4b",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderSet",
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#TableCenterAlignmentTest"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        items: {
                            ColumnListItem: {
                                cells: [
                                    {className: "textAlignCenter sapOvpObjectNumber"}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableCenterAlignment(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });

    test("Table Test - data point with 'sap:text' attribute", function () {
        var cardTestData = {
            card: {
                "id": "card_5",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "ProductSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "Product ID"
                            },
                            {
                                text: "Category"
                            },
                            {
                                text: "Weight"
                            }
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'ProductID'.*\}/},
                                    {number: /\{path: *'MeasureUnit'.*\}/, state: "None"},
                                    {text: /\{path: *'Category'.*\}/}
                                ]
                            }
                        }
                    }
                }
            }
        };
        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });

    test("Table Test -  Quicklink for Table", function () {
        var cardTestData = {
            card: {
                "id": "card_029",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderLineItemSet",
                    "showLineItemDetail": true,
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#QuickLinkTest"

                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_Table.xml"
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                ok(utils.getTableItemsNode(cardXml), "Basic XML check - see that there is a cells node");
                ok(utils.tableQuickNodeExists(cardXml), "Check if the Quick View is present");
            });
        });
    });

    test("Table Test - Flexibility of columns", function () {
        var cardTestData = {
            card: {
                "id": "card_6",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "ProductSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "Product ID"
                            },
                            {
                                text: "Weight"
                            },
                            {
                                text: "Category"
                            }
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'ProductID'.*\}/},
                                    {number: /\{path: *'MeasureUnit'.*\}/, state: "None"},
                                    {text: /\{path: *'Category'.*\}/}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateFlexibleTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });

    test("Table Test - one data field with empty mapping", function () {
        var cardTestData = {
            card: {
                "id": "card_7",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_lineItemSet_1_dataFields_emptyMapping.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "Customer"
                            },
                            {
                                text: "Order ID"
                            },
                            {
                                text: "Gross Amt."
                            }
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'CustomerName'.*\}/},
                                    {text: /\{path: *'SalesOrderID'.*\}/},
                                    {text: null}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });

    test("Table Test - use annotationPath with FieldGroup", function () {
        var cardTestData = {
            card: {
                "id": "card_8",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderLineItemSet",
                    "annotationPath": "com.sap.vocabularies.UI.v1.FieldGroup#ForCard/Data"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "SalesOrderID"
                            },
                            {
                                text: "Time Stamp"
                            },
                            {
                                text: "Gross Amt."
                            }
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'SalesOrderID'.*\}/},
                                    {text: /\{path: *'DeliveryDate'.*\}/},
                                    {text: /\{path: *'GrossAmount'.*\}/}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });
    /*             test("Table Card Test - Counter in header exists only if all items are not displayed", function(){
     var cardTestData = {
     card: {
     "id": "card_9",
     "model": "salesOrder",
     "template": "sap.ovp.cards.table",
     "settings": {
     "title": "New Sales Orders",
     "subTitle": "Today",
     "entitySet": "SalesOrderSet",
     "category": "Sales Order Line Items - Table",
     }
     },
     dataSource: {
     baseUrl: utils.odataBaseUrl_salesOrder,
     rootUri: utils.odataRootUrl_salesOrder,
     annoUri: utils.testBaseUrl + "data/annotations.xml"
     }
     };

     var oModel = utils.createCardModel(cardTestData);
     stop();
     oModel.getMetaModel().loaded().then(function () {

     //start the async test
     start();

     var oView = utils.createCardView(cardTestData, oModel);
     var oController = oView.getController();
     var oItemsBinding = oController.getCardItemsBinding();
     oItemsBinding.getLength = function () {
     return 6;
     };
     oItemsBinding.getCurrentContexts = function () {
     return [1, 2, 3];
     };

     oController.onAfterRendering();
     //CreateData Change event
     oItemsBinding.fireDataReceived();

     var footerString = oView.byId("ovpCountFooter").getText();
     ok(footerString.match(/3{1} .* 6{1}$/));

     });
     }); */

    test("Table Card Test - Counter in header exists only if all items are not displayed", function () {
        var cardTestData = {
            card: {
                "id": "card_81",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "title": "New Sales Orders",
                    "subTitle": "Today",
                    "entitySet": "SalesOrderSet",
                    "category": "Sales Order Line Items - Table"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);
            oView.loaded().then(function (oView) {
                start();
                var oController = oView.getController();
                var oItemsBinding = oController.getCardItemsBinding();
                oItemsBinding.getLength = function () {
                    return 6;
                };
                oItemsBinding.getCurrentContexts = function () {
                    return [1, 2, 3];
                };

                oController.onAfterRendering();
                //CreateData Change event
                oItemsBinding.fireDataReceived();

                var footerString = oView.byId("ovpCountHeader").getText();
                ok(footerString.match(/3{1} .* 6{1}$/));

            });

        });
        //expect(0);
    });
    test("Table Card Test - Counter in header does not exists if all the items are displayed", function () {
        var cardTestData = {
            card: {
                "id": "card_82",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "title": "New Sales Orders",
                    "subTitle": "Today",
                    "entitySet": "SalesOrderSet",
                    "category": "Sales Order Line Items - Table"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);
            oView.loaded().then(function (oView) {
                start();
                var oController = oView.getController();
                var oItemsBinding = oController.getCardItemsBinding();
                oItemsBinding.getLength = function () {
                    return 3;
                };
                oItemsBinding.getCurrentContexts = function () {
                    return [1, 2, 3];
                };

                oController.onAfterRendering();
                //CreateData Change event
                oItemsBinding.fireDataReceived();
                var footerString = oView.byId("ovpCountHeader").getText();
                ok(footerString.match(""));
            });
        });
        //expect(0);
    });
    /*test("Table Card Test - Counter in header is 0 in case of no data ( 0 of 0 scenario)", function(){
     var cardTestData = {
     card: {
     "id": "card_83",
     "model": "salesOrder",
     "template": "sap.ovp.cards.table",
     "settings": {
     "title": "New Sales Orders",
     "subTitle": "Today",
     "entitySet": "SalesOrderSet",
     "category": "Sales Order Line Items - Table"
     }
     },
     dataSource: {
     baseUrl: utils.odataBaseUrl_salesOrder,
     rootUri: utils.odataRootUrl_salesOrder,
     annoUri: utils.testBaseUrl + "data/annotations.xml"
     }
     };

     var oModel = utils.createCardModel(cardTestData);
     stop();
     oModel.getMetaModel().loaded().then(function () {

     var oView = utils.createCardView(cardTestData, oModel);
     oView.loaded().then(function (oView) {
     start();
     var oController = oView.getController();
     var oItemsBinding = oController.getCardItemsBinding();
     oItemsBinding.getLength = function () {
     return 0;
     };
     oItemsBinding.getCurrentContexts = function () {
     return [];
     };

     oController.onAfterRendering();
     //CreateData Change event
     oItemsBinding.fireDataReceived();
     var footerString = oView.byId("ovpCountHeader").getText();
     ok(footerString.match("0"));
     });
     });
     //expect(0);
     });*/


    test("Table Card Test - navigation from line item", function () {
        var cardTestData = {
            card: {
                "id": "card_10",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "entitySet": "SalesOrderLineItemSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);
            oView.loaded().then(function (oView) {
                start();
                var oController = oView.getController();
                var doIntentBasedNavigationStub = sinon.stub(oController, "doNavigation");
                var oBindingContext = {id: "bindingcontext"};
                var oEvent = {
                    getSource: function () {
                        return {
                            getBindingContext: function () {
                                return oBindingContext;
                            }
                        }
                    }
                }
                oController.onColumnListItemPress(oEvent);
                equal(doIntentBasedNavigationStub.callCount, 1, "doIntentBasedNavigationStub call count");
                deepEqual(doIntentBasedNavigationStub.args[0][0], oBindingContext, "doIntentBasedNavigationStub conetxt parameter");
                equal(doIntentBasedNavigationStub.args[0][1].label, "Navigation from line item", "doIntentBasedNavigationStub intent parameter");
            });
        });
    });


    asyncTest("image card Screen reader test", function () {
        var cardTestData = {
            card: {
                "id": "card_11",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderLineItemSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "Item"
                            },
                            {
                                text: "Product ID"
                            },
                            {
                                text: "Quantity"
                            }
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'SalesOrderID'.*\}/},
                                    {text: /\{path: *'ProductID'.*\}/},
                                    {text: /\{path: *'Quantity'.*\}/}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);
            oView.loaded().then(function (oView) {
                var testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
                oView.placeAt('testContainer');
                oView.rerender();
                oView.onAfterRendering = function () {
                    //start the async test
                    start();

                    var cardHtml = oView.getDomRef();
                    var cardListContent = testContainer.find(".sapMList");
                    ok(cardListContent.attr("aria-label") == sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("tableCard"), "Table Card type is accessble");
                    oView.destroy();
                };
            });
        });
    });


    test("Table Card Test - annotation with expand", function () {
        var cardTestData = {
            card: {
                "id": "card_12",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Sales Order Line Items - Table",
                    "entitySet": "SalesOrderLineItemSet",
                    "annotationPath": "com.sap.vocabularies.UI.v1.FieldGroup#ToTestExpand/Data"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    Table: {
                        columns: [
                            {
                                text: "SalesOrderID"
                            },
                            {
                                text: "Time Stamp"
                            },
                            {
                                text: "ProductId"
                            }
                        ],

                        items: {
                            ColumnListItem: {
                                cells: [
                                    {text: /\{path: *'SalesOrderID'.*\}/},
                                    {text: /\{path: *'DeliveryDate'.*\}/},
                                    {text: /\{path: *'ToProduct\/ProductID'.*\}/}
                                ]
                            }
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedTableRes = cardTestData.expectedResult.Body.Table;

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");

                // specific XML property binding value test
                ok(utils.validateTableXmlValues(cardXml, cardCfg, expectedTableRes), "Table XML Values");
            });
        });
    });


    test("Card Test - Full annotations - With KPI Header with DP, Filter And Selection", function () {
        var cardTestData = {
            card: {
                "id": "card_13",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "listFlavor": "bar",
                    "listType": "extended",
                    "entitySet": "SalesOrderSet",
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml"
            },
            expectedResult: {
                Header: {
                    KPI: {
                        number: true,
                        headerTitleContent: "Sales Orders Amounts by Status",
                        numberAggregateNumberContent: {
                            filters: [
                                [
                                    '"path":"GrossAmount"',
                                    '"operator":"BT"',
                                    '"value1":"0"',
                                    '"value2":"800000"'
                                ]
                            ]
                        },
                        numberNumericContentValue: /\{path:'GrossAmount'.*\,/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: true,
                        sortByContent: "By Lifecycle Descript., Delivery Description",
                        filterBy: true
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
            });
        });
    });


    test("Card Test - Full annotations - With KPI Header with DP and Filter-By Values (No SortBy)", function () {
        var cardTestData = {
            card: {
                "id": "card_14",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "listFlavor": "bar",
                    "listType": "extended",
                    "entitySet": "SalesOrderSet",
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml"
            },
            expectedResult: {
                Header: {
                    KPI: {
                        number: true,
                        headerTitleContent: "Sales Orders Amounts by Status",
                        numberAggregateNumberContent: {
                            filters: [
                                [
                                    '"path":"GrossAmount"',
                                    '"operator":"BT"',
                                    '"value1":"0"',
                                    '"value2":"800000"'
                                ]
                            ]
                        },
                        numberNumericContentValue: /\{path:'GrossAmount'.*\,/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: false,
                        filterBy: true
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
            });
        });
    });

    test("Card Test - Full annotations - With KPI Header with DP And Sort (No Filter-By-values)", function () {
        var cardTestData = {
            card: {
                "id": "card_15",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "showSortingInHeader": true,
                    "showFilterInHeader": false,
                    "listFlavor": "bar",
                    "listType": "extended",
                    "entitySet": "SalesOrderSet",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml"
            },
            expectedResult: {
                Header: {
                    KPI: {
                        number: true,
                        headerTitleContent: "Sales Orders Amounts by Status",
                        numberAggregateNumberContent: {
                            filters: []
                        },
                        numberNumericContentValue: /\{parts:\s*\[(\{path:\s*'\w+'\}\s*\,*\s*)+\]/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: true,
                        sortByContent: "By Lifecycle Descript., Delivery Description",
                        filterBy: false
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
            });
        });
    });

    test("Card Test - Full annotations - With KPI Header with NO DP but with Filter And Selection", function () {
        var cardTestData = {
            card: {
                "id": "card_16",
                "model": "salesOrder",
                "template": "sap.ovp.cards.table",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "listFlavor": "bar",
                    "listType": "extended",
                    "entitySet": "SalesOrderSet",
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotationsKPI.xml"
            },
            expectedResult: {
                Header: {}
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card.settings;

                // validate KPI Header
                var expectedHeaderRes = cardTestData.expectedResult.Header;
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // basic table XML structure tests
                ok(utils.tableNodeExists(cardXml), "Basic XML check - see that there is a Table node");
                ok(utils.tableColumnsNodeExists(cardXml), "Basic XML check - see that there is a columns node");
                ok(utils.tableItemsNodeExists(cardXml), "Basic XML check - see that there is a items node");
                ok(utils.tableColumnListItemNodeExists(cardXml), "Basic XML check - see that there is a ColumnListItem node");
                ok(utils.tableCellsNodeExists(cardXml), "Basic XML check - see that there is a cells node");
            });
        });
    });
    function testResizeCard(oController, lengthVal, card) {
        var classList = {
            remove: function () {
                return ["sapMFlexItem", "sapOvpCardContentContainer", "sapOvpWrapper"];
            },
            add: function () {
                return ["sapMFlexItem", "sapOvpContentHidden", "sapOvpCardContentContainer", "sapOvpWrapper"];
            }
        };
        oController.cardId = card;
        oController.oDashboardLayoutUtil = {
            getCardDomId: function () {
                return "mainView--ovpLayout--" + oController.cardId;
            }
        };
        oController.getCardItemBindingInfo = function () {
            return {length: lengthVal}
        };
        oController.getCardItemsBinding = function () {
            return {
                refresh: function () {
                    return true;
                }
            }
        };
        oController.getHeaderHeight = function () {
            return 82;
        };
        oController.getView = function () {
            return {
                byId: function (arg) {
                    if (arg && (arg === "ovpTable")) {
                        return oTable

                    } else if (arg && (arg === "ovpCardContentContainer")) {
                        return {
                            getDomRef: function () {
                                return {
                                    classList: classList,
                                    style: {
                                        height: ""
                                    }
                                }
                            }
                        }
                    }
                },
                $: function () {
                    return null;
                }
            }
        }
    }

    function getCardProp() {

        return {
            newCardLayout: {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            },
            cardSizeProperties: {
                dropDownHeight: 0,
                itemHeight: 111
            }
        };
    }

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    test("Card Test - Testing card item binding info", function () {
        oController.getView = function () {
            return {
                byId: function (arg) {
                    if (arg && (arg === "ovpTable")) {
                        return {
                            getBindingInfo: function (arg) {
                                if (arg && (arg === "items")) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                    } else {
                        return {
                            getBindingInfo: function () {
                                return false;
                            }
                        }
                    }
                }
            }
        };
        var expectedResult = true;
        deepEqual(oController.getCardItemBindingInfo() == true, expectedResult);
    });

    test("Card Test - Testing card item binding info", function () {
        var tableData = {
            "results": [
                {
                    "BusinessProcess": "FI"
                }]
        };
        var oTable = new sap.m.Table({
            id: "ovpTable",
            headerText: "JavaScript",
            inset: true
        });
        var oTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Label({
                    text: "{test>BusinessProcess}"
                })]
        });
        var model = new sap.ui.model.json.JSONModel();
        model.setData(tableData);
        oTable.setModel(model, "test");
        oTable.bindItems("test>/results", oTemplate);
        oController.getView = function () {
            return {
                byId: function () {
                    return oTable;
                }
            }
        };
        ok(oController.getCardItemBindingInfo().path == "/results", "To check the items path");
        oTable.destroy();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  End of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for onItemPress Function
     *  ------------------------------------------------------------------------------
     */

    test("table Card Test - On Content click of OVP Cards used as an API in other Applications", function () {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return true;
        });
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked", function () {
            return undefined;
        });
        oController.checkAPINavigation = function () {
            return 1;
        };
        var actualValue = oController.onColumnListItemPress();
        ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  Test Cases for OnContact Details Press
     *  ------------------------------------------------------------------------------
     */


    test("Table Card Test - navigation from contact details", function () {
        var oBindingContext = {
            getPath: function () {
                return "/BusinessPartnerSet('0100000004')"
            }
        };
        var oPopover = [new sap.m.Popover({
            title: "Sample Popover"
        })
        ];

        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            }
                        }
                    }
                }
            }
        };
        var openByStub = sinon.stub(oPopover[0], "openBy");
        openByStub.returns(null);
        oController.onContactDetailsLinkPress(oEvent);
        ok(oPopover[0].mObjectBindingInfos.undefined.path === "/BusinessPartnerSet('0100000004')", "Binding path is fetched for Popover");
    });


    test("Table Card Test - navigation from contact details When binding context is null", function () {
        var oBindingContext = null;
        var oPopover = [new sap.m.Popover({
            title: "Sample Popover"
        })
        ];
        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            }
                        }
                    }
                }
            }
        };
        var actualValue = oController.onContactDetailsLinkPress(oEvent);
        ok(actualValue === undefined, "Function returns undefined if the binding context is null");
    });

    /**
     *  ------------------------------------------------------------------------------
     *  Test Cases for OnAfterRendering Details Press
     *  ------------------------------------------------------------------------------
     */

    test("Card Test - onAfterRendering, when Layout type is resizable", function () {
        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (path) {
                    if (path == "/layoutDetail") {
                        return "resizable";
                    }
                }
            }
        }
        var getOwnercomponent = sinon.stub(CardController.__proto__, "getOwnerComponent", function () {
            return {
                getComponentData: function () {
                    return {
                        cardId: "card_10"
                    }
                }
            };
        });
        oController.cardId = "card056";
        oController.oDashboardLayoutUtil = {
            ROW_HEIGHT_PX: 16,
            CARD_BORDER_PX: 8,
            dashboardLayoutModel: {
                getCardById: function (id) {
                    return {
                        dashboardLayout: {
                            headerHeight: 82,
                            autoSpan: false,
                            rowSpan: 12,
                            showOnlyHeader: true
                        }
                    }
                }
            },
            getCardDomId: function () {
                return "mainView--ovpLayout--card056";
            }
        }
        oController.getHeaderHeight = function () {
            return 98;
        }
        var testContainer = jQuery('<div id="mainView--ovpLayout--card056" class="sapOvpWrapper1" style="height:320px; width:1500px"><div class="sapOvpWrapper"></div></div>').appendTo('body');
        jQuery('#container').append(testContainer);

        var onAfterRenderingStub = sinon.stub(CardController.__proto__, "onAfterRendering", function () {
            return undefined;
        });

        var checkIfAPIIsUsedStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return false;
        });

        oController.onAfterRendering();
        onAfterRenderingStub.restore();
        checkIfAPIIsUsedStub.restore();
        var actualValue1 = document.getElementById('mainView--ovpLayout--card056').getElementsByClassName('sapOvpWrapper')[0].style.height;
        var actualValue2 = document.getElementById('mainView--ovpLayout--card056').classList;
        var expectedValue1 = "79px";
        var expectedValue2 = "sapOvpMinHeightContainer";
        ok(actualValue1 === expectedValue1, "setting the height in SapOvpWrapper class");
        deepEqual(actualValue2[1], expectedValue2, "added height container class");
        getOwnercomponent.restore();
    });

});

