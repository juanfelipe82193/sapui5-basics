// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ovp.Card
 */
sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ovp/cards/AnnotationHelper",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/CommonUtils"
], function (utils, mockservers, AnnotationHelper, OVPCardAsAPIUtils, CommonUtils) {
    "use strict";
    /* jQuery, sap */

    /**
     * This is a hack, as the namespace 'sap.ovp.demo' when run in the qunit results in wrong resource prefix
     * so i change now manually - to continue work. consult Aviad what causes this so we could remove this.
     */
    //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
    //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
    //jQuery.sap.require("sap.ui.core.format.NumberFormat");
    //jQuery.sap.require("sap.ovp.cards.AnnotationHelper");
    //jQuery.sap.require("sap.ovp.cards.OVPCardAsAPIUtils");
    //jQuery.sap.require("sap.ovp.cards.CommonUtils");

    var utils = utils;
    var AnnotationHelper = AnnotationHelper;
    var OVPCardAsAPIUtils = OVPCardAsAPIUtils;
    var CommonUtils = CommonUtils;
    var testContainer;
    var oController;
    var CardController;

    module("sap.ovp.cards.List", {
        /**
         * This method is called before each test
         */
        setup: function () {
            //jQuery.sap.require("sap.ovp.test.mockservers");
            mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
            mockservers.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
            oController = new sap.ui.controller("sap.ovp.cards.list.List");
            CardController = new sap.ui.controller("sap.ovp.cards.generic.Card");
            var workingArea = '<div id="root">' + '<div id="container"> </div>' + '</div>';
            jQuery('body').append(workingArea);
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            mockservers.close();
            jQuery(testContainer).remove();
            oController.destroy();
        }
    });

    test("Card Test - testing Parameterized EntitySet - Valid Parameterized configuration (annotations & card settings)- formatItems should parse it correctly", function () {
        var cardTestData = {
            card: {
                "id": "card_1",
                "model": "salesShare",
                "template": "sap.ovp.cards.list",
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

                var listNodeXml = sap.ovp.test.qunit.cards.utils.getListItemsNode(cardXml);
                ok(listNodeXml !== undefined, "Existence check to XML Node of List");

                var itemsAggregationValue = listNodeXml.getAttribute('items');
                ok(itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding, "List XML items-aggregation's value Includes the Parameterized-Entity-Set");
            });
        });
    });


    test("Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - No Selection Variant in card settings, Valid Selection Variant in Annotations", function () {
        var cardTestData = {
            card: {
                "id": "card_2",
                "model": "salesShare",
                "template": "sap.ovp.cards.list",
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

                var listNodeXml = sap.ovp.test.qunit.cards.utils.getListItemsNode(cardXml);
                ok(listNodeXml !== undefined, "Existence check to XML Node of List");

                var itemsAggregationValue = listNodeXml.getAttribute('items');
                ok(itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding, "List XML items-aggregation's value Includes the Parameterized-Entity-Set");
            });
        });
    });


    test("Card Test - testing Parameterized EntitySet - Invalid Parameterized configuration - Invalid Selection Variant value in card settings, Valid Selection Variant annotations", function () {
        var cardTestData = {
            card: {
                "id": "card_3",
                "model": "salesShare",
                "template": "sap.ovp.cards.list",
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

                var listNodeXml = sap.ovp.test.qunit.cards.utils.getListItemsNode(cardXml);
                ok(listNodeXml !== undefined, "Existence check to XML Node of List");

                var itemsAggregationValue = listNodeXml.getAttribute('items');
                ok(itemsAggregationValue == cardTestData.expectedResult.Body.List.itemsAggregationBinding, "List XML items-aggregation's value Includes the Parameterized-Entity-Set");
            });
        });
    });

    test("Card Test - Full annotations - With Entity Path - Header Config No Properties - with listType=extended", function () {
        var cardTestData = {
            card: {
                "id": "card_4",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "extended",
                    "entitySet": "SalesOrderLineItemSet",
                    "type": "sap.ovp.cards.list.List"
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
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\} *\/ *\{*ItemPosition.*\}/,
                            number: /\{*Quantity.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*GrossAmount.*\}/,
                                    state: "None"
                                },
                                {
                                    text: /\{*NetAmount.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*ProductID.*\}/
                                },
                                {
                                    text: /\{*DeliveryDate.*\}/
                                }]
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full annotations - With Entity Path - Header Config No Properties - NO listType (check default is ObjectListItem)", function () {
        var cardTestData = {
            card: {
                "id": "card_5",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "entitySet": "SalesOrderLineItemSet",
                    "type": "sap.ovp.cards.list.List"
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
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\} *\/ *\{*ItemPosition.*\}/,
                            description: /\{*ProductID.*\}/,
                            info: /\{*Quantity.*\}/,
                            infoState: "None"
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });


    test("Card Test - Full annotations - With Entity Path - Header Config No Properties - listType=condensed", function () {
        var cardTestData = {
            card: {
                "id": "card_6",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "condensed",
                    "entitySet": "SalesOrderLineItemSet",
                    "type": "sap.ovp.cards.list.List"
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
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\} *\/ *\{*ItemPosition.*\}/,
                            description: /\{*ProductID.*\}/,
                            info: /\{*Quantity.*\}/,
                            infoState: "None"
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });


    test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=extended", function () {
        var cardTestData = {
            card: {
                "id": "card_7",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "extended",
                    "entitySet": "ProductSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: { // e.g. no header properties in the XML
                    title: undefined,
                    subTitle: undefined,
                    category: undefined
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*ProductID.*\}/,
                            number: /\{*MeasureUnit.*\}/,
                            numberState: "None",
                            ObjectStatus: [{
                                text: /\{*Name.*\}/,
                                state: "None"
                            }],
                            ObjectAttribute: [{
                                text: /\{*Category.*\}/
                            }]
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


                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=extended", function () {
        var cardTestData = {
            card: {
                "id": "card_8",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "extended",
                    "entitySet": "ProductSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: { // e.g. no header properties in the XML
                    title: undefined,
                    subTitle: undefined,
                    category: undefined
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*ProductID.*\}/,
                            number: /\{*MeasureUnit.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*Name.*\}/,
                                    state: "None"
                                },
                                {
                                    text: /\{*Price.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*Category.*\}/
                                },
                                {
                                    text: /\{*SupplierName.*\}/
                                }
                            ]
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


                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Sort By Importance - listType=extended", function () {
        var cardTestData = {
            card: {
                "id": "card_9",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "extended",
                    "entitySet": "BusinessPartnerSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: { // e.g. no header properties in the XML
                    title: undefined,
                    subTitle: undefined,
                    category: undefined
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*BusinessPartnerID.*\}/,
                            number: /\{*CurrencyCode.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*PhoneNumber.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*CompanyName.*\}.*\{*LegalForm.*\}/
                                },
                                {
                                    text: /\{*BusinessPartnerRole.*\}/
                                }
                            ]
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


                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=condensed, listFlavor=bar", function () {
        var cardTestData = {
            card: {
                "id": "card_10",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Sales Orders - listType = Condensed Bar List",
                    "title": "Bar List Card",
                    "description": "",
                    "listType": "condensed",
                    "listFlavor": "bar",
                    "entitySet": "ProductSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        CustomListItem: {
                            title: /\{*ProductID.*\}/,
                            progressIndicator: /\{*Price.*\}/,
                            firstDataPoint: /\{*Price.*\}/,
                            SecondDataPoint: /\{*MeasureUnit.*\}/
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full Annotations - No Entity Path - Header Config No Properties - listType=extended, listFlavor=bar", function () {
        var cardTestData = {
            card: {
                "id": "card_11",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Sales Orders - listType = Extended Bar List",
                    "title": "Bar List Card",
                    "description": "",
                    "listType": "extended",
                    "listFlavor": "bar",
                    "entitySet": "ProductSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml"
            },
            expectedResult: {
                Header: { // e.g. no header properties in the XML
                },
                Body: {
                    List: {
                        CustomListItem: {
                            firstDataFiled: /\{*ProductID.*\}/,
                            secondDataFiled: /\{*Category.*\}/,
                            progressIndicator: /\{*Price.*\}/,
                            firstDataPoint: /\{*Price.*\}/,
                            secondDataPoint: /\{*MeasureUnit.*\}/,
                            thirdDataPoint: /\{*Depth.*\}/
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


                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Without third data point annotations - No Entity Path - Header Config No Properties - listType=extended, listFlavor=bar", function () {
        var cardTestData = {
            card: {
                "id": "card_12",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Sales Orders - listType = Extended Bar List",
                    "title": "Bar List Card",
                    "description": "",
                    "listType": "extended",
                    "listFlavor": "bar",
                    "entitySet": "SalesOrderSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml"
            },
            expectedResult: {
                Header: { // e.g. no header properties in the XML
                },
                Body: {
                    List: {
                        CustomListItem: {
                            firstDataFiled: /\{*SalesOrderID.*\}/,
                            secondDataFiled: /\{*CustomerName.*\}/,
                            progressIndicator: /\{*GrossAmount.*\}/,
                            firstDataPoint: /\{*GrossAmount.*\}/,
                            secondDataPoint: /\{*LifecycleStatus.*\}/
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


                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - semantic object and contact annotation check - listType=extended, listFlavor=bar", function () {
        var cardTestData = {
            card: {
                "id": "card_barlist_smartlink",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Sales Orders - listType = Extended Bar List",
                    "title": "Bar List Card",
                    "description": "",
                    "listType": "extended",
                    "listFlavor": "bar",
                    "entitySet": "SalesOrderSet",
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#BarListSmartLinkTest"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: { // e.g. no header properties in the XML
                },
                Body: {
                    List: {
                        CustomListItem: {
                            firstDataFieldSemanticObject: "OVP",
                            secondDataFieldSemanticObject: "OVP",
                            firstContactAnnotationQuickViewElement: "true"
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


                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateBarListSmartLinkValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit", function () {
        var oView, oController, oSavePromise,
            cardTestData = {
                card: {
                    "id": "card_13",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "settings": {
                        "category": "Sales Orders - listType = Condensed Bar List",
                        "title": "Bar List Card",
                        "description": "",
                        "listType": "condensed",
                        "listFlavor": "bar",
                        "entitySet": "ProductSetWithPercentage"
                    }
                },
                dataSource: {
                    baseUrl: utils.odataBaseUrl_salesOrder,
                    rootUri: utils.odataRootUrl_salesOrder,
                    annoUri: utils.testBaseUrl + "data/annotations.xml"
                },
                expectedResult: {}
            };

        var oModel = utils.createCardModel(cardTestData);
        stop();

        oModel.getMetaModel().loaded().then(function () {
            oView = utils.createCardView(cardTestData, oModel);

            oView.loaded().then(function (oView) {
                oController = oView.getController();
                oController.getOwnerComponent = function () {
                    return new sap.ui.core.UIComponent()
                };
                start();

                ok(oController.returnBarChartValue(70) == '70', "value is returned with no change");
            });

        });
    });

    test("List Card Test - use annotationPath with FieldGroup", function () {
        var cardTestData = {
            card: {
                "id": "card_14",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "extended",
                    "entitySet": "SalesOrderLineItemSet",
                    "type": "sap.ovp.cards.list.List",
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
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\}/,
                            number: /\{*GrossAmount.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*Quantity.*\}/,
                                    state: "None"
                                },
                                {
                                    text: /\{*NetAmount.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*DeliveryDate.*\}/
                                },
                                {
                                    text: /\{*ProductID.*\}/
                                }]
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("List Card Test - Counter in header exists only if all items are not displayed", function () {
        var cardTestData = {
            card: {
                "id": "card_16",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "title": "Reorder Soon",
                    "subTitle": "Less than 10 in stock",
                    "listType": "extended",
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
    });
    test("List Card Test - Counter in header does not exists if all the items are displayed", function () {
        var cardTestData = {
            card: {
                "id": "card_165",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "title": "Reorder Soon",
                    "subTitle": "Less than 10 in stock",
                    "listType": "extended",
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
    });

    test("List Card Test - navigation from line item", function () {
        var cardTestData = {
            card: {
                "id": "card_162",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
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
                //start();
                var oController = oView.getController();
                var doIntentBasedNavigationStub = sinon.stub(oController, "doNavigation");
                var oBindingContext = {id: "bindingcontext"};
                var oEvent = {
                    getSource: function () {
                        return {
                            getBindingContext: function () {
                                return oBindingContext;
                            },
                            getType: function () {
                                return "Active";
                            },
                            setType: function () {
                                return "Inactive";
                            }
                        }
                    }
                };
                oController.onListItemPress(oEvent);
                equal(doIntentBasedNavigationStub.callCount, 1, "doIntentBasedNavigationStub call count");
                deepEqual(doIntentBasedNavigationStub.args[0][0], oBindingContext, "doIntentBasedNavigationStub conetxt parameter");
                equal(doIntentBasedNavigationStub.args[0][1].label, "Navigation from line item", "doIntentBasedNavigationStub intent parameter");
                start();
            });
        });
    });

    test("List Card Test - navigation to url from line item", function () {
        var cardTestData = {
            card: {
                "id": "card_17",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "entitySet": "BusinessPartnerSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_for_url_navigation.xml"
            }
        };
        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {
                oModel.read("/BusinessPartnerSet");
            }
        );
        var functionWasAlreadyCalled;
        oModel.attachBatchRequestCompleted(function () {
            if (functionWasAlreadyCalled) {
                return;
            }
            functionWasAlreadyCalled = true;

            var oView = utils.createCardView(cardTestData, oModel);
            oView.loaded().then(function (oView) {
                start();
                var oController = oView.getController();
                var doNavigationStub = sinon.stub(oController, "doNavigation");
                var oBindingContext = oModel.createBindingContext("/BusinessPartnerSet('0100000000')");
                var oEvent = {
                    getSource: function () {
                        return {
                            getBindingContext: function () {
                                return oBindingContext;
                            },
                            getType: function () {
                                return "Active";
                            },
                            setType: function () {
                                return "Inactive";
                            }
                        }
                    }
                };
                oController.onListItemPress(oEvent);
                equal(doNavigationStub.callCount, 1, "doNavigationStub call count");
                deepEqual(doNavigationStub.args[0][0], oBindingContext, "doNavigationStub conetxt parameter");
                equal(doNavigationStub.args[0][1].label, "Link to", "doNavigationStub parameter");
                equal(doNavigationStub.args[0][1].url, "https://www.google.de/maps/place/%27Dietmar-Hopp-Allee%27,%27Walldorf%27", "doNavigationStub parameter");
            });
        });

    });

    test("List Card Screen reader attribute test", function () {
        var cardTestData = {
            card: {
                "id": "card_18",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "extended",
                    "entitySet": "SalesOrderLineItemSet",
                    "type": "sap.ovp.cards.list.List"
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
                    List: {
                        ListItem: {
                            title: /\{path: *'SalesOrderID'.*\} *\/ *\{path: *'ItemPosition'.*\}/,
                            number: /\{path: *'Quantity'.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{path: *'GrossAmount'.*\}/,
                                    state: "None"
                                },
                                {
                                    text: /\{path: *'NetAmount'.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{path: *'ProductID'.*\}/
                                },
                                {
                                    text: /\{path: *'DeliveryDate'.*\}/
                                }]
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
                oView.placeAt('testContainer');
                oView.onAfterRendering = function () {
                    var cardHtml = oView.getDomRef();
                    var cardListContent = testContainer.find(".sapMList");
                    var cardListFooter = testContainer.find(".sapOvpCardFooter ");

                    //start the async test
                    start();

                    //Check list
                    ok(cardListContent.attr("aria-label") == sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("listCard"), "List Card type is accessble");

                    //Check footer
                    //ok(cardListFooter.attr("role") == "heading", "footer role is define");
                    oView.destroy();
                };
            });
        });
    });

    test("Bar Chart Card Screen Reader attribute test", function () {
        var cardTestData = {
            card: {
                "id": "card_19",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Sales Orders - listType = Condensed Bar List",
                    "title": "Bar List Card",
                    "description": "",
                    "listType": "condensed",
                    "listFlavor": "bar",
                    "entitySet": "ProductSet"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    List: {
                        CustomListItem: {
                            title: /\{path: *'ProductID'.*\}/,
                            progressIndicator: /\{path: *'Price'.*\}/,
                            firstDataPoint: /\{path: *'Price'.*\}/,
                            SecondDataPoint: /\{path: *'WeightMeasure'.*\}/
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
                oView.placeAt('testContainer');

                oView.onAfterRendering = function () {
                    //start the async test
                    start();

                    var cardHtml = oView.getDomRef();
                    var jqView = testContainer.find("#" + oView.sId);
                    var cardListContent = jqView.find(".sapMList");

                    ok(cardListContent.attr("aria-label") == sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("barChartCard"), "Bar Chart Card type is accessble");
                    oView.destroy();
                };
            });
        });
    });

    test("List Card Test - annotation with expand", function () {
        var cardTestData = {
            card: {
                "id": "card_20",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "listType": "condensed",
                    "entitySet": "SalesOrderSet",
                    "type": "sap.ovp.cards.list.List",
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ToTestExpand"
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
                    List: {
                        ListItem: {
                            title: /\{*ToBusinessPartner\/EmailAddress.*\}/,
                            description: /\{*SalesOrderID.*\}/,
                            info: /\{*CustomerName.*\}/,
                            infoState: "None"
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;

                // basic list XML structure tests
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full annotations - With KPI Header with DP, Filter And Selection", function () {
        var cardTestData = {
            card: {
                "id": "card_21",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "listType": "extended",
                    "entitySet": "SalesOrderSet",
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#line",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#line",
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
                        numberNumericContentValue: /\{parts:\s*\[(\{path:\s*'w+'\}\s*\,*\s*)+\]/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: true,
                        sortByContent: "By Lifecycle Descript., Delivery Description",
                        filterBy: true
                    }
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{path: *'SalesOrderID'.*\}/,
                            number: /\{path: *'LifecycleStatus'.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{path: *'GrossAmount'.*\}/,
                                    state: /\{path: *'GrossAmount'.*\}/
                                },
                                {
                                    text: /\{path: *'LifecycleStatus'.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{path: *'CustomerName'.*\}/
                                },
                                {
                                    text: /\{path: *'NetAmount'.*\}/
                                }]
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;
                var expectedHeaderRes = cardTestData.expectedResult.Header;


                // basic list XML structure tests and KPI
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full annotations - With KPI Header with DP and Filter-By Values (No SortBy)", function () {
        var cardTestData = {
            card: {
                "id": "card_22",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "listType": "extended",
                    "entitySet": "SalesOrderSet",
                    "showSortingInHeader": false,
                    "showFilterInHeader": true,
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#line",
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
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{path: *'SalesOrderID'.*\}/,
                            number: /\{path: *'LifecycleStatus'.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{path: *'GrossAmount'.*\}/,
                                    state: /\{path: *'GrossAmount'.*\}/
                                },
                                {
                                    text: /\{path: *'LifecycleStatus'.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{path: *'CustomerName'.*\}/
                                },
                                {
                                    text: /\{path: *'NetAmount'.*\}/
                                }]
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;
                var expectedHeaderRes = cardTestData.expectedResult.Header;

                // basic list XML structure tests and KPI
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full annotations - With KPI Header with DP And Sort (No Filter-By-values)", function () {
        var cardTestData = {
            card: {
                "id": "card_23",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "listType": "extended",
                    "showSortingInHeader": true,
                    "showFilterInHeader": false,
                    "entitySet": "SalesOrderSet",
                    "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#line",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#line",
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
                            filters: []
                        },
                        numberNumericContentValue: /\{parts:\s*\[(\{path:\s*'\w+'\}\s*\,*\s*)+\]/,
                        numberUOM: /\{path: *'CurrencyCode'.*\}/,
                        sortBy: true,
                        sortByContent: "By Lifecycle Descript., Delivery Description",
                        filterBy: false
                    }
                },
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\}/,
                            number: /\{*LifecycleStatus.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*GrossAmount.*\}/,
                                    state: /\{*GrossAmount.*\}/
                                },
                                {
                                    text: /\{*LifecycleStatus.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*CustomerName.*\}/
                                },
                                {
                                    text: /\{*NetAmount.*\}/
                                }]
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;
                var expectedHeaderRes = cardTestData.expectedResult.Header;

                // basic list XML structure tests and KPI
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });

    test("Card Test - Full annotations - With KPI Header with NO DP but with Filter And Selection", function () {
        var cardTestData = {
            card: {
                "id": "card_24",
                "model": "salesOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "category": "Contract Monitoring",
                    "title": "Contract Expiry, Consumption and Target Value",
                    "description": "",
                    "listType": "extended",
                    "entitySet": "SalesOrderSet",
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line",
                    "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#line",
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
                Header: {},
                Body: {
                    List: {
                        ListItem: {
                            title: /\{*SalesOrderID.*\}/,
                            number: /\{*LifecycleStatus.*\}/,
                            numberState: "None",
                            ObjectStatus: [
                                {
                                    text: /\{*GrossAmount.*\}/,
                                    state: /\{*GrossAmount.*\}/
                                },
                                {
                                    text: /\{*LifecycleStatus.*\}/,
                                    state: "None"
                                }
                            ],
                            ObjectAttribute: [
                                {
                                    text: /\{*CustomerName.*\}/
                                },
                                {
                                    text: /\{*NetAmount.*\}/
                                }]
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

                var cardCfg = cardTestData.card.settings;
                var expectedListRes = cardTestData.expectedResult.Body.List;
                var expectedHeaderRes = cardTestData.expectedResult.Header;


                // basic list XML structure tests and KPI
                ok(utils.listNodeExists(cardXml), "Basic XML check - see that there is a List node");
                ok(utils.listItemsNodeExists(cardXml, cardCfg), "Basic XML check - see that there is a items node");
                ok(utils.validateOvpKPIHeader(cardXml, expectedHeaderRes), "Header KPI Check");

                // specific XML property binding value test
                ok(utils.validateListXmlValues(cardXml, cardCfg, expectedListRes), "List XML Values");
            });
        });
    });
    /**
     *  ------------------------------------------------------------------------------
     *  Start of test cases to update minMaxModel and barChart value
     *  ------------------------------------------------------------------------------
     */
    function genericFunctions(oController, value) {
        oController.minMaxModel.setData = function (val) {
            return null;
        };
        oController.minMaxModel.refresh = function () {
            return true;
        }

        oController.getEntityType = function () {
            return {
                $path: "/dataServices/schema/0/entityType/1",
                "com.sap.vocabularies.UI.v1.LineItem": [
                    {
                        Label: {String: "Unit Price"},
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                        Target: {AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Price"}

                    }
                ]
            }
        }
        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (val) {
                    return "com.sap.vocabularies.UI.v1.LineItem";
                }
            }
        }
        oController.getMetaModel = function () {
            return {
                createBindingContext: function (val) {
                }
            }

        }

        oController.getView = function () {
            return {
                byId: function (val) {
                    return {
                        getBinding: function (items) {
                            return {
                                getCurrentContexts: function () {
                                    return [
                                        {Price: value}
                                    ]
                                }
                            }
                        }
                    }
                }

            }

        }
        oController.getModel = function () {
            return {
                getOriginalProperty: function (val1, val2) {
                    return value;
                }
            }
        }

    }

    test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit when value is greater then zero", function () {

        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 100
            };
        };
        ok(oController.returnBarChartValue(70) == 70, "show minimal value in negative");
    });

    test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit when max Value is Zero,Min Value very less and Values is zero", function () {

        oController._updateMinMaxModel = function () {
            return {
                minValue: -11,
                maxValue: 0
            };
        };
        ok(oController.returnBarChartValue(0) == -0.1, "show minimal value in negative");
    });

    test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit  when max Value is Zero,Min Value very less and Values is zero", function () {

        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 11
            };
        };
        ok(oController.returnBarChartValue(0) == 0.1, "show minimal value in positive");
    });

    test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit  when both Max is equal to zero and min is equal to zero", function () {

        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 0
            };
        };
        ok(oController.returnBarChartValue(0) == 0, "Show value as it is.");
    });

    test("Card List Controller Test- Update min and max value in case of Data Point has Percentage Unit", function () {
        var expectedResult = {
            minValue: 0,
            maxValue: 100
        }
        genericFunctions(oController, "");
        var oFirstDataPointPercentageUnitStub = sinon.stub(AnnotationHelper, "isFirstDataPointPercentageUnit", function () {
            return true;
        });
        var actualResult = oController._updateMinMaxModel(undefined);
        deepEqual(actualResult, expectedResult, "Show value with percentage");
        oFirstDataPointPercentageUnitStub.restore();
    });

    test("Card List Controller Test- return BarChart Value when First Data Point is not Percentage Unit, when max value is very high", function () {
        genericFunctions(oController, "1650.0");
        var expectedResult = {
            minValue: 0,
            maxValue: 1650
        }
        var oFirstDataPointPercentageUnitStub = sinon.stub(AnnotationHelper, "isFirstDataPointPercentageUnit", function () {
            return false;
        });
        var oGetFirstDataPointValueStub = sinon.stub(AnnotationHelper, "getFirstDataPointValue", function () {
            return "Price";
        });

        var actualResult = oController._updateMinMaxModel(undefined);
        deepEqual(actualResult, expectedResult, "Show min and max value");
        oFirstDataPointPercentageUnitStub.restore();
        oGetFirstDataPointValueStub.restore();
    });

    test("Card List Controller Test- return BarChart Value when First Data Point is not Percentage Unit, when min value is very less", function () {
        genericFunctions(oController, "-20");
        var expectedResult = {
            minValue: -20,
            maxValue: 0
        }
        var oFirstDataPointPercentageUnitStub = sinon.stub(AnnotationHelper, "isFirstDataPointPercentageUnit", function () {
            return false;
        });
        var oGetFirstDataPointValueStub = sinon.stub(AnnotationHelper, "getFirstDataPointValue", function () {
            return "Price";
        });

        var actualResult = oController._updateMinMaxModel(undefined);
        deepEqual(actualResult, expectedResult, "Show min and max value");
        oFirstDataPointPercentageUnitStub.restore();
        oGetFirstDataPointValueStub.restore();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  End of test cases to update minMaxModel and barChart value
     *  ------------------------------------------------------------------------------
     */

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for resize cards
     *  ------------------------------------------------------------------------------
     */
    function testResizeCard(oController, lengthVal, card) {
        var classList = {
            remove: function () {
                return ["sapMFlexItem", "sapOvpCardContentContainer", "sapOvpWrapper"];
            },
            add: function () {
                return ["sapMFlexItem", "sapOvpContentHidden", "sapOvpCardContentContainer", "sapOvpWrapper"];
            }
        }
        oController.cardId = card;
        oController.oDashboardLayoutUtil = {
            getCardDomId: function () {
                return "mainView--ovpLayout--" + oController.cardId;
            }
        }
        oController.getCardItemBindingInfo = function () {
            return {length: lengthVal}
        }
        oController.getCardItemsBinding = function () {
            return {
                refresh: function () {
                    return true;
                }
            }
        }
        oController.getHeaderHeight = function () {
            return 82;
        }
        oController.getView = function () {
            return {
                byId: function (id) {
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
            }
        }
        oController._updateMinMaxModel = function (val) {
            return {
                minValue: 0,
                maxValue: 100
            };
        };
        oController.minMaxModel.refresh = function () {
            return true;
        }
    }

    test("Card Test - resize card, when showOnlyHeader is false, No change in number of rows", function () {

        var newCardLayout = {
            showOnlyHeader: false,
            rowSpan: 20,
            iRowHeightPx: 16,
            iCardBorderPx: 8,
            noOfItems: 3
        };
        var cardSizeProperties = {
            dropDownHeight: 0,
            itemHeight: 111
        };
        var testContainer = jQuery('<div id="mainView--ovpLayout--card001" style="height:320px; width:1500px">').appendTo('body');
        jQuery('#container').append(testContainer);

        testResizeCard(oController, 2, "card001");
        var iNoOfItems = 2;
        oController.resizeCard(newCardLayout, cardSizeProperties);
        ok(oController.getCardItemBindingInfo().length === iNoOfItems, "No change in number of rows");

    }),

        test("Card Test - resize card, when showOnlyHeader is false, Show more less of rows", function () {

            var newCardLayout = {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111
            };
            var testContainer = jQuery('<div id="mainView--ovpLayout--card002" style="height:320px; width:1500px">').appendTo('body');
            jQuery('#container').append(testContainer);
            testResizeCard(oController, 4, "card002");
            var iNoOfItems = 2;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show less number of rows");
        }),

        test("Card Test - resize card, when showOnlyHeader is false, Show more number of rows", function () {

            var newCardLayout = {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111
            };
            var testContainer = jQuery('<div id="mainView--ovpLayout--card003" style="height:320px; width:1500px">').appendTo('body');
            jQuery('#container').append(testContainer);
            testResizeCard(oController, 2, "card003");
            var iNoOfItems = 4;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");

        }),
        test("Card Test - resize card, when showOnlyHeader is true", function () {

            var newCardLayout = {
                showOnlyHeader: true,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111
            };
            var testContainer = jQuery('<div id="mainView--ovpLayout--card004" style="height:320px; width:1500px">').appendTo('body');
            jQuery('#container').append(testContainer);
            testResizeCard(oController, 2, "card004");
            var iNoOfItems = 4;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");
        })
    /**
     *  ------------------------------------------------------------------------------
     *  End of Test Cases for resize cards
     *  ------------------------------------------------------------------------------
     */
    test("Card Test - Testing card item binding info", function () {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBindingInfo: function (val) {
                            return {}
                        }
                    }
                }
            }
        }
        var expectedResult = {};
        deepEqual(oController.getCardItemBindingInfo(), expectedResult);
    });

    test("Card Test - Testing card item binding", function () {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBinding: function (val) {
                            return {}
                        }
                    }
                }
            }
        }
        var expectedResult = {};
        deepEqual(oController.getCardItemsBinding(), expectedResult);
    });

    /**
     *  Start of test cases
     *  This function does some CSS changes after the card is rendered
     */
    function ImageStyle(oController, desc, icon) {
        oController.byId = function (ovpList) {
            return {
                getItems: function () {
                    return [{
                        getIcon: function () {
                            return icon
                        },
                        getDomRef: function () {
                            return {
                                children: [{
                                    id: "ovpIconImage",
                                    children: [{
                                        getAttribute: function (val1) {
                                            return "sapMImg sapMSLIImgThumb"
                                        },
                                        setAttribute: function (val1, val2) {
                                            oController.attributeClass = val2;
                                            return val2;
                                        }
                                    }]
                                }],
                                getAttribute: function (val) {
                                    return val;
                                },
                                insertBefore: function (val1, val2) {
                                    oController.placeHolderClass = val1.className;
                                    return "";
                                }
                            }
                        },
                        getDescription: function () {
                            return desc;
                        },
                        getTitle: function () {
                            return "Electronics Retail & Co.";
                        },
                        addStyleClass: function (val) {
                            oController.class = val;
                            return val;
                        }
                    }]
                },
                getDomRef: function () {
                    return {
                        getAttribute: function () {
                            return "sapMList sapMListBGSolid";
                        },
                        setAttribute: function (val1, val2) {
                            oController.densityClass = val2;
                            return val2;
                        }
                    }
                }
            }
        }

    }

    test("Card Test - onAfterRendering, when density style = compact and imageDensity = true", function () {
        var image = "https://www.w3schools.com/css/trolltunga.jpg"
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("compact");
        var expectedValue = "sapOvpListWithImageIconCompact";
        ok(oController.densityClass.indexOf("sapOvpListImageCompact") != -1, "Set the list image compact css")
        ok(oController.class === expectedValue, "Set the compact css when image is present");

    });

    test("Card Test - onAfterRendering, when density style = cozy and imageDensity = true", function () {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageIconCozy";
        ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css")
        ok(oController.class === expectedValue1, "Set the css when image is present");
        ok(oController.attributeClass.indexOf("sapOvpImageCozy") != -1, "Set the attribute css");
    });

    test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true, no description and icon is present", function () {
        var icon = "https://www.w3schools.com/css/trolltunga/icon.jpg"
        ImageStyle(oController, "", icon);
        oController._addImageCss("cozy");
        var expectedValue = "sapOvpListWithIconNoDescCozy";
        ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css")
        ok(oController.class === expectedValue, "Set the css when icon is present");
    });

    test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no description", function () {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageNoDescCozy";
        ok(oController.class === expectedValue1, "Set the css when image is present");
    });

    test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no image and icon is present", function () {
        var image = "";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        ok(oController.placeHolderClass.indexOf("sapOvpImageCozy") != -1, "There is no image and icon present");
    });
    /**
     *  End of test cases
     *  This function does some CSS changes after the card is rendered
     */

    /**
     *
     * Start of test cases of onAfterRendering
     */
    test("Card Test - onAfterRendering", function () {

        var onAfterRenderingStub = sinon.stub(CardController.__proto__, "onAfterRendering", function () {
            return undefined;
        });

        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (path) {
                    if (path == "/imageSupported") {
                        return true;
                    } else if (path == "/densityStyle") {
                        return "compact";
                    }
                }
            }
        }
        oController.byId = function () {
            return {
                sId: "card001Original--ovpList",
                attachUpdateFinished: function (fn) {
                    return true;
                }
            }
        }
        var actualValue = oController.onAfterRendering();
        ok(actualValue === undefined, "list updated");
        onAfterRenderingStub.restore();
    });

    test("Card Test - onAfterRendering, when OVP used as API and layout type is resizable", function () {
        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (path) {
                    if (path == "/imageSupported") {
                        return false;
                    } else if (path == "/densityStyle") {
                        return "compact";
                    } else if (path == "/layoutDetail") {
                        return "resizable";
                    }
                }
            }
        }
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
        var expectedValue1 = "78px";
        var expectedValue2 = "sapOvpMinHeightContainer";
        ok(actualValue1 === expectedValue1, "setting the height in SapOvpWrapper class");
        deepEqual(actualValue2[1], expectedValue2, "added height container class");
    });
    /**
     *
     * End of test cases of onAfterRendering method
     */

    /**
     *
     * Start of test cases onListItemPress
     */
    test("List Card Test - On Content click of OVP Cards used as an API in other Applications", function () {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return true;
        });
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked", function () {
            return undefined;
        });
        oController.checkAPINavigation = function () {
            return 1;
        }
        var actualValue = oController.onListItemPress();
        ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    });
    /**
     *
     * End of test cases onListItemPress
     */
});
