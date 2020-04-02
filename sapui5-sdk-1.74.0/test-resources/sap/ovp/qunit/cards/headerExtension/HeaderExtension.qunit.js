sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
],function (utils, mockservers, jquery) {
            "use strict";
            /* jQuery, sap */

            //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");

            var utils = utils;

            module("sap.ovp.cards.HeaderExtension", {
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

            asyncTest("Header - Screen reader accessability test", function () {
                var cardTestData = {
                    card: {
                        "id": "card_1",
                        "model": "salesOrder",
                        "template": "sap.ovp.test.qunit.cards.headerExtension",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        Header: {
                            subTitle: "Static Description",
                            headerExtension: "OVP Extension Header Feature Simplest example ever"
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
                            var headerRole = testContainer.find('.sapOvpCardHeader').attr('role');
                            ok(headerRole == "button", "header role is set for accessability");
                            oView.destroy();

                        };
                    });
                });
            });

            test("Card Test - Header Extension test - Load header extension fragment according to custom Component", function () {
                var cardTestData = {
                    card: {
                        "id": "card_2",
                        "model": "salesOrder",
                        "template": "sap.ovp.test.qunit.cards.headerExtension",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        Header: {
                            subTitle: "Static Description",
                            headerExtension: "OVP Extension Header Feature Simplest example ever"
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

                        // validate the card's header XML
                        ok(utils.isValidCategory(cardTestData, cardXml), "Header's Category property Value");
                        ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                        ok(utils.isValidSub(cardTestData, cardXml), "Header's Description property Value");

                        ok(utils.isValidHeaderExtension(cardTestData, cardXml), "Header Extension Custom Fragment - validate text injected");
                    });
                });
            });
        });
