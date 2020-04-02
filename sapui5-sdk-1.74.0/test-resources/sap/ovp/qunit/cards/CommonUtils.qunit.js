sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global",
    "/sap/ovp/cards/CommonUtils",
    "/sap/ui/core/ComponentContainer",
    "/sap/m/VBox",
    "sap/base/Log"
], function (utils, oChartUtils, mockservers, jquery, CommonUtils, ComponentContainer, VBox, Log) {
            "use strict";
            /* module, ok, test, jQuery, sap */

            //jQuery.sap.require("CommonUtils");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //jQuery.sap.require("ComponentContainer");
            //jQuery.sap.require("VBox");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.charts.utils");

            var utils = utils;
            var chartUtils = oChartUtils;
            var errorSpy, testContainer;


            module("CommonUtils", {
                /**
                 * This method is called before each test
                 */
                setup: function () {
                    //jQuery.sap.require("sap.ovp.test.mockservers");
                    mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
                    var baseURL = chartUtils.odataBaseUrl;
                    var rootURL = chartUtils.odataRootUrl;
                    mockservers.loadMockServer(baseURL, rootURL);
                    errorSpy = sinon.spy(Log, 'error');
                    testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
                },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                teardown: function () {
                    mockservers.close();
                    errorSpy.restore();
                    jQuery(testContainer).remove();
                }
            });

            test("Null Checks for API", function () {
                CommonUtils.createCardComponent(null, null, null);
                ok(errorSpy.calledWith("Second argument oManifest is null"), "Second argument oManifest is not present");

                var oManifest = {
                    cards: {}
                };
                CommonUtils.createCardComponent(null, oManifest, null);
                ok(errorSpy.calledWith("Cards manifest entry or cardId is null"), "Cards manifest entry or cardId is not present");

                oManifest = {
                    cards: {
                        "card_name": {
                            template: "sap.ovp.cards.stack",
                            settings: {}
                        }
                    }
                };
                CommonUtils.createCardComponent(null, oManifest, null);
                ok(errorSpy.calledWith("Cards template or model or settings are not defined"), "Cards model is not present");

                oManifest = {
                    cards: {
                        "card_name": {
                            model: "salesOrder",
                            template: "sap.ovp.cards.stack"
                        }
                    }
                };
                CommonUtils.createCardComponent(null, oManifest, null);
                ok(errorSpy.calledWith("Cards template or model or settings are not defined"), "Cards settings are not present");

                oManifest = {
                    cards: {
                        "card_name": {
                            model: "salesOrder",
                            settings: {}
                        }
                    }
                };
                CommonUtils.createCardComponent(null, oManifest, null);
                ok(errorSpy.calledWith("Cards template or model or settings are not defined"), "Cards template is not present");

                oManifest = {
                    cards: {
                        "card_name": {
                            model: "salesOrder",
                            template: "sap.ovp.cards.map",
                            settings: {}
                        }
                    }
                };
                CommonUtils.createCardComponent(null, oManifest, null);
                var oTemplate = oManifest.cards['card_name'].template;
                ok(errorSpy.calledWith(oTemplate + " card type is not supported in the API"), "card type is not supported in the API");

                oManifest = {
                    cards: {
                        "card006_NewSalesOrders": {
                            model: "salesOrder",
                            template: "sap.ovp.cards.table",
                            settings: {}
                        }
                    }
                };
                CommonUtils.createCardComponent(null, oManifest, null);
                ok(errorSpy.calledWith("ContainerId should be of type string and not null"), "ContainerId is null");

                oManifest = {
                    cards: {
                        "card006_NewSalesOrders": {
                            model: "salesOrder",
                            template: "sap.ovp.cards.table",
                            settings: {}
                        }
                    }
                };
                CommonUtils.createCardComponent(null, oManifest, {});
                ok(errorSpy.calledWith("ContainerId should be of type string and not null"), "ContainerId is not of type string");

                oManifest = {
                    cards: {
                        "card006_NewSalesOrders": {
                            model: "salesOrder",
                            template: "sap.ovp.cards.table",
                            settings: {}
                        }
                    }
                };
                CommonUtils.createCardComponent(null, oManifest, "card002_ReorderSoon");
                ok(errorSpy.calledWith("First argument oView is null"), "First argument oView is not present");

                /*var cardTestData = {
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml"
                    }
                };
                oManifest = {
                    cards: {
                        "card006_NewSalesOrders": {
                            model: "salesOrder",
                            template: "sap.ovp.cards.table",
                            settings: {
                                "entitySet": "ProductSet"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function() {
                    //start the async test
                    var oView = new VBox("TestVBox");
                    oView.setModel(oModel, "salesOrder");
                    var oComponentContainer = new ComponentContainer("card002_ReorderSoon");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    CommonUtils.createCardComponent(oView, oManifest, "card002_ReorderSoons");
                    setTimeout(function () {
                        start();
                        ok(errorSpy.calledWith("Component Container 'card002_ReorderSoons' is not present in the current View"), "Component Container is not present");
                    }, 500);
                });*/
            });

            test("Card Test - For API - Table Card", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotationsKPI.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "card_14": {
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
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox2");
                    oView.setModel(oModel, "salesOrder");
                    var oComponentContainer = new ComponentContainer("card_14");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "card_14");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - List Card", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "card002_ReorderSoon": {
                            "model": "salesOrder",
                            "template": "sap.ovp.cards.list",
                            "settings": {
                                "category": "Sales Orders - listType = Condensed Bar List",
                                "title" : "Bar List Card",
                                "description" : "",
                                "listType" : "condensed",
                                "listFlavor": "bar",
                                "entitySet": "ProductSet"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox1");
                    oView.setModel(oModel, "salesOrder");
                    var oComponentContainer = new ComponentContainer("card002_ReorderSoon1");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "card002_ReorderSoon1");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Bubble Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_15": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                                "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox3");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_15");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_15");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Column Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_16": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Column_Eval_by_Currency",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox4");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_16");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_16");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Combination Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_17": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Combination",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Combination",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Combination",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Combination",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Combination"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox5");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_17");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_17");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Donut Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_18": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "type": "sap.ovp.cards.charts.donut.DonutChart",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox6");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_18");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_18");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Line Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_19": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox7");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_19");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_19");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Scatter Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_20": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Scatter",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Scatter",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Scatter",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Scatter",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox8");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_20");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_20");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Stacked Column Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_21": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#StackedColumn_Eval_by_Currency",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox9");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_21");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_21");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Analytical Card - Vertical Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_22": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#VerticalEval_by_Currency",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox10");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_22");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_22");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Bubble Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_23": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.bubble",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                                "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox11");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_23");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_23");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Donut Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_24": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.donut",
                            "settings": {
                                "entitySet": "SalesShare",
                                "type": "sap.ovp.cards.charts.donut.DonutChart",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox12");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_24");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_24");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Line Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_25": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.line",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr",
                                "type": "sap.ovp.cards.charts.line.LineChart",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox13");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_25");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_25");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Card Test - For API - Smart Chart Card - Semantic Line Chart", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_mock.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_27": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.smart.chart",
                            "settings": {
                                "dataStep": "11",
                                "title": "(SC) Semantic Line Chart - Static",
                                "subTitle": "Sales and Total Sales by Country",
                                "valueSelectionInfo": "value selection info",
                                "cardLayout" : {
                                    "colSpan": 1
                                },
                                "entitySet": "SalesShareSemanticSmartChart",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Empty",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#SemanticLineChart",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#SemanticLineChart",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#SalesKPI",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#ToProcurement"
                            }
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox16");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_27");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_27");
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("OVP Card API called with selectionVariant Object as Fourth argument for filtering", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "chart_100": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_Scatter",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Scatter",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_Scatter",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency_Scatter",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                            }
                        }
                    }
                };

                var oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant();
                oSelectionVariant.addSelectOption('TotalSalesForecast', "I", "BT", '3000', '3500');
                oSelectionVariant.addSelectOption('TotalSalesForecast', "I", "BT", '3500', '4000');
                oSelectionVariant.addParameter('Product', 'Silverberry');

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function(){
                    //start the async test
                    start();
                    var oView = new VBox("TestVBox14");
                    oView.setModel(oModel, "salesShare");
                    var oComponentContainer = new ComponentContainer("chart_100");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    CommonUtils.createCardComponent(oView, oManifest, "chart_100", oSelectionVariant);
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Shows the error messages from the body of an HTTP response", function () {
                var oCommonUtils = CommonUtils;
                ok(oCommonUtils.showODataErrorMessages(null) === "", "Null Error Scenario");
                var oError = {
                    responseText: "Just Text"
                };
                ok(oCommonUtils.showODataErrorMessages(oError) === "", "With Some Response Text Scenario");
                oError = {
                    responseText: '{"error": {"innererror": {"errordetails": [{"message": "Some Error.", "severity": "error"}]}, "message": {"value": "ABAP Error:"}}}'
                };
                ok(oCommonUtils.showODataErrorMessages(oError) === "ABAP Error: Some Error ", "Correct BackEnd error Scenario");
            });

            /*
             unhandled methods

             CommonUtils.getActionInfo
             */

        });
