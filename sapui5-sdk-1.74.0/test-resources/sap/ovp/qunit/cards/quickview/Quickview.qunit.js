sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (utils, mockservers, jquery) {
    "use strict";
    /* jQuery, sap */

    /**
     * This is a hack, as the namespace 'sap.ovp.demo' when run in the qunit results in wrong resource prefix
     * so i change now manually - to continue work. consult Aviad what causes this so we could remove this.
     */
    //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
    //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");

    var utils = utils;

    module("sap.ovp.cards.Quickview", {
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
            mockservers.close();
        }
    });

    test("Quickview Test - simple card", function () {
        var cardTestData = {
            card: {
                "id": "card_1",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "ContactSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
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
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Contacts",
                            title: /\{path: *'FirstName'.*\} *\{path: *'LastName'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Contact Info",
                                    props: [
                                        {
                                            label: "Phone",
                                            value: /\{path: *'PhoneNumber'.*\}/,
                                            type: "phone",
                                            url: ""
                                        },
                                        {
                                            label: "Email",
                                            value: /\{path: *'EmailAddress'.*\}/,
                                            type: "email",
                                            url: ""
                                        }]
                                }]
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        var oController = new sap.ui.controller("sap.ovp.cards.quickview.Quickview");
        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (val) {
                    return false;
                }
            }
        };

        //oController.onAfterRendering();

        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            //oView.onAfterRendering();

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                ok(utils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                ok(utils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
                ok(utils.quickviewGroupElementNodeExists(cardXml), "Basic XML check - see that there are GroupElement nodes");

                // specific XML property binding value test
                ok(utils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            });
        });
    });

    asyncTest("Quickview card - screen reader attribute tests", function () {
        var cardTestData = {
            card: {
                "id": "card_2",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "ContactSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
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
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Contacts",
                            title: /\{path: *'FirstName'.*\} *\{path: *'LastName'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Contact Info",
                                    props: [
                                        {
                                            label: "Phone",
                                            value: /\{path: *'PhoneNumber'.*\}/,
                                            type: "phone",
                                            url: ""
                                        },
                                        {
                                            label: "Email",
                                            value: /\{path: *'EmailAddress'.*\}/,
                                            type: "email",
                                            url: ""
                                        }]
                                }]
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
                    var cardListContent = testContainer.find(".sapMQuickViewCard");
                    ok(cardListContent.attr("aria-label") == sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("quickViewCard"), "Quick view Card type is accessble");
                    oView.destroy();
                };
            });
        });
    });

    test("Quickview Test - no groups", function () {
        var cardTestData = {
            card: {
                "id": "card_3",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "BusinessPartnerSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
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
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Business Partners",
                            title: /\{path: *'CompanyName'.*\} *\{path: *'LegalForm'.*\}/,
                            description: "",
                            icon: "",
                            groups: []
                        }
                    }
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);

            //oView.onAfterRendering();

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                ok(utils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                ok(!utils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");

                // specific XML property binding value test
                ok(utils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            });
        });
    });

    test("Quickview Test - empty group", function () {
        var cardTestData = {
            card: {
                "id": "card_4",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "SalesOrderSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
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
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Sales Orders",
                            title: /\{path: *'SalesOrderID'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Order Note",
                                    props: []
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

            //oView.onAfterRendering();
            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                ok(utils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                ok(utils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");

                // specific XML property binding value test
                ok(utils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            });
        });
    });

    test("Quickview Test - many properties", function () {
        var cardTestData = {
            card: {
                "id": "card_5",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "ProductSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_many_dataFields_in_groupFields.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Products",
                            title: /\{path: *'Name'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Dimensions",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Height",
                                            value: /\{path: *'Height'.*\}/,
                                            url: ""
                                        }]
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

            //oView.onAfterRendering();

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                ok(utils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                ok(utils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
                ok(utils.quickviewGroupElementNodeExists(cardXml), "Basic XML check - see that there are GroupElement nodes");

                // specific XML property binding value test
                ok(utils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            });
        });
    });

    test("Quickview Test - many groups", function () {
        var cardTestData = {
            card: {
                "id": "card_6",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "ProductSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_many_groups_in_facets.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Products",
                            title: /\{path: *'Name'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Dimensions1",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        }]
                                },
                                {
                                    header: "Dimensions2",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        }]
                                },
                                {
                                    header: "Dimensions3",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        }]
                                },
                                {
                                    header: "Dimensions4",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        }]
                                },
                                {
                                    header: "Dimensions5",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        }]
                                },
                                {
                                    header: "Dimensions6",
                                    props: [
                                        {
                                            label: "Width",
                                            value: /\{path: *'Width'.*\}/,
                                            url: ""
                                        },
                                        {
                                            label: "Depth",
                                            value: /\{path: *'Depth'.*\}/,
                                            url: ""
                                        }]
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

            //oView.onAfterRendering();

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                ok(utils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                ok(utils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
                ok(utils.quickviewGroupElementNodeExists(cardXml), "Basic XML check - see that there are GroupElement nodes");

                // specific XML property binding value test
                ok(utils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            });
        });
    });

    test("Quickview Test - use annotationPath with Qualifier", function () {
        var cardTestData = {
            card: {
                "id": "card_7",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "ContactSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                    "annotationPath": "com.sap.vocabularies.UI.v1.Facets#Contacts"
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
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Contacts",
                            title: /\{path: *'FirstName'.*\} *\{path: *'LastName'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Contact Info",
                                    props: [
                                        {
                                            label: "Phone",
                                            value: /\{path: *'PhoneNumber'.*\}/,
                                            type: "phone",
                                            url: ""
                                        },
                                        {
                                            label: "Email",
                                            value: /\{path: *'EmailAddress'.*\}/,
                                            type: "email",
                                            url: ""
                                        }]
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
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                ok(utils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                ok(utils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");
                ok(utils.quickviewGroupElementNodeExists(cardXml), "Basic XML check - see that there are GroupElement nodes");

                // specific XML property binding value test
                ok(utils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            });
        });
    });

    test("Quickview footer Test - use identificationAnnotationPath with Qualifier", function () {
        var cardTestData = {
            card: {
                "id": "card_8",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "SalesOrderSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#StackTest"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {},
                Footer: {
                    actions: [
                        {
                            type: /DataFieldForIntentBasedNavigation/,
                            action: /toappnavsample1/,
                            label: "SO Navigation (M) StackTest",
                            semanticObj: "Action1"
                        },
                        {
                            type: /DataFieldForAction/,
                            action: /SalesOrder_Confirm/,
                            label: "Confirm StackTest"
                        },
                        {
                            type: /DataFieldForAction/,
                            action: /SalesOrder_Cancel/,
                            label: "Cancel StackTest"
                        }
                    ]
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

                var expectedFooterRes = cardTestData.expectedResult.Footer;

                // basic list XML structure tests
                ok(utils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                var actions = utils.getActionsCount(cardXml);
                ok(actions > 0, "Basic XML check - see that there are action nodes");
                ok(actions == 3, "Basic XML check - validate buttons length");

                // specific XML property binding value test
                ok(utils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
            });
        });
    });


    test("Quickview Test - group with formatted currency field which contains UOM", function () {
        var cardTestData = {
            card: {
                "id": "card_9",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "SalesOrderSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "('0500000000')"
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations_forFormatField_in_isSummaryFacet.xml"
            },
            expectedResult: {
                Header: {},
                Body: {
                    QuickViewCard: {
                        QuickViewPage: {
                            header: "Sales Orders",
                            title: /\{path: *'SalesOrderID'.*\}/,
                            description: "",
                            icon: "",
                            groups: [
                                {
                                    header: "Order Note",
                                    props: [
                                        {
                                            label: "SalesOrderID",
                                            value: /\{path: *'SalesOrderID'.*\}/,
                                            type: null,
                                            url: ""
                                        },
                                        {
                                            label: "GrossAmount",
                                            value: /\{path: *'GrossAmount'.*\} *\{path: *'CurrencyCode'.*\}/,
                                            type: null,
                                            url: ""
                                        }]
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

            //oView.onAfterRendering();

            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var cardCfg = cardTestData.card;
                var expectedQuickViewRes = cardTestData.expectedResult.Body.QuickViewCard;

                // basic list XML structure tests
                ok(utils.quickviewNodeExists(cardXml), "Basic XML check - see that there is a Quickview node");
                ok(utils.quickviewGroupNodeExists(cardXml), "Basic XML check - see that there are group nodes");

                // specific XML property binding value test
                ok(utils.validateQuickviewXmlValues(cardXml, expectedQuickViewRes), "Quickview XML Values");
            });
        });
    });

    test("Quickview footer Test - check if showFirstActionInFooter is false then first button setvisible is false", function () {
        var cardTestData = {
            card: {
                "id": "card_10",
                "model": "salesOrder",
                "template": "sap.ovp.cards.quickview",
                "settings": {
                    "entitySet": "SalesOrderSet",
                    "type": "sap.ovp.cards.quickview.Quickview",
                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#StackTest",
                    "objectStreamCardsSettings": {
                        "showFirstActionInFooter": false
                    }
                }
            },
            dataSource: {
                baseUrl: utils.odataBaseUrl_salesOrder,
                rootUri: utils.odataRootUrl_salesOrder,
                annoUri: utils.testBaseUrl + "data/annotations.xml"
            },
            expectedResult: {
                Header: {},
                Body: {},
                Footer: {
                    actions: [
                        {
                            visible: false
                        }
                    ]
                }
            }
        };

        var oModel = utils.createCardModel(cardTestData);
        stop();
        oModel.getMetaModel().loaded().then(function () {

            var oView = utils.createCardView(cardTestData, oModel);
            oView.onBeforeRendering();
            oView.loaded().then(function (oView) {
                //start the async test
                start();

                var cardXml = oView._xContent;
                ok(cardXml !== undefined, "Existence check to XML parsing");

                var expectedFooterRes = cardTestData.expectedResult.Footer;

                // basic list XML structure tests
                ok(utils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                var actions = utils.getActionsCount(cardXml);
                ok(actions > 0, "Basic XML check - see that there are action nodes");
                ok(actions == 3, "Basic XML check - validate buttons length");

                // specific XML property binding value test
                ok(utils.validateActionFooterButtonVisibility(cardXml, oView, expectedFooterRes), "Action Footer first button visibility");
            });
        });
    });

});

