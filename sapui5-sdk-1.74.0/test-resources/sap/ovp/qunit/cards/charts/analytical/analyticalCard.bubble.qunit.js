sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (cardUtils, oChartUtils, mockservers, jQuery) {
            "use strict";

            //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.charts.utils");


            // Preloading the VIZ library before executing the tests to prevent the time out issue during the execution of tests.
            //jQuery.sap.require("sap.viz.ui5.controls.VizFrame");
            //jQuery.sap.require("sap.viz.ui5.data.FlattenedDataset");
            //jQuery.sap.require("sap.m.Button");

            var cardUtils = cardUtils;
            var chartUtils = oChartUtils;

            var parameterTestCase = "Bubble chart - With Input Parameters";

            module("sap.ovp.cards.charts.Bubble", {
                /**
                 * This method is called before each test
                 */
                 beforeEach: function (test) {
               	  //jQuery.sap.require("sap.ovp.test.mockservers");
                    var baseURL = chartUtils.odataBaseUrl;
                    var rootURL = chartUtils.odataRootUrl;
                    if ( test.test.testName == parameterTestCase) {
                        baseURL = chartUtils.odataBaseUrl2;
                        rootURL = chartUtils.odataRootUrl_InputParameters;
                    }
                   mockservers.loadMockServer(baseURL, rootURL);
               },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                afterEach: function () {
                    mockservers.close();
                }
            });

            test("Bubble chart - Without Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_1",
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
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare" , "sorter": [{"path": "Sales","descending": true}]},
                                    dimensions: [
                                                 {
                                                     name: "Product ID",
                                                     value: "{ProductID}",
                                                     displayValue: "{Product}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "shape",
                                                              type : "Dimension",
                                                              values :"Product ID"
                                                          }
                                                      ]


                                }

                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Bubble chart - With Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_2",
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
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                                 {
                                                     name: "Product ID",
                                                     value: "{ProductID}",
                                                     displayValue: "{Product}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "shape",
                                                              type : "Dimension",
                                                              values :"Product ID"
                                                          }
                                                      ]
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Bubble chart - With Reference Value as Path",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_3",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_path.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                        {
                                            name: "Date",
                                            value: "{Date}",
                                            displayValue: "{Date}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }]
                                }
                            },
                            referenceValue : {

                            	path : "SalesShare"

                            }
                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;

                        // basic list XML structure tests
                        ok(chartUtils.referenceValuePathExists(cardXml, expectedListRes.referenceValue.path), "KPI Number Value - see that there is a path for reference value");
                    });
                });
            });

            test("Bubble chart - With Filters Without Sorter",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_4",
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
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nosorter.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                                 {
                                                     name: "Product ID",
                                                     value: "{ProductID}",
                                                     displayValue: "{Product}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "shape",
                                                              type : "Dimension",
                                                              values :"Product ID"
                                                          }
                                                      ]
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

			test("Bubble chart - With faulty filter configuration",function(){
                var cardTestData = {
                    card: {
                        "id": "chart_5",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare"},
                                    dimensions: [
                                                 {
                                                     name: "Product ID",
                                                     value: "{ProductID}",
                                                     displayValue: "{Product}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "shape",
                                                              type : "Dimension",
                                                              values :"Product ID"
                                                          }
                                                      ]
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

			test("Bubble chart - Without DataPoint Annotation",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_6",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_NoDataPoint.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                                 {
                                                     name: "Product ID",
                                                     value: "{ProductID}",
                                                     displayValue: "{Product}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "shape",
                                                              type : "Dimension",
                                                              values :"Product ID"
                                                          }
                                                      ]
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

			test("Bubble chart - With DataPoint, Without Title and Value",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_7",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_NoDataPoint.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                                 {
                                                     name: "Product ID",
                                                     value: "{ProductID}",
                                                     displayValue: "{Product}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "shape",
                                                              type : "Dimension",
                                                              values :"Product ID"
                                                          }
                                                      ]
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Bubble chart - With ObjectStream Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_8",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "filters": [{
                                "path" : "Region",
                                "operator" : "EQ",
                                "value1" : "APJ"
                            }],
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"},{"path" : "Region","operator" : "EQ","value1" : "APJ"}]},
                                    dimensions: [
                                                 {
                                                     name: "Product ID",
                                                     value: "{ProductID}",
                                                     displayValue: "{Product}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "shape",
                                                              type : "Dimension",
                                                              values :"Product ID"
                                                          }
                                                      ]
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });


            test("Bubble chart - With MeasureAttributes and DimensionAttributes missing",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_9",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "filters": [{
                                "path" : "Region",
                                "operator" : "EQ",
                                "value1" : "APJ"
                            }],
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_NoDimMeas.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"},{"path" : "Region","operator" : "EQ","value1" : "APJ"}]},
                                    dimensions: [],
                                    measures: []
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeNotExists(cardXml, "bubble"), "VIZ Frame - see that there is no VIZFrame rendered for bubble chart");
                    });
                });
            });


            test("Bubble chart - Axis title visibility when header exists.", function(){

            	var cardTestData = {
                        card: {
                            "id": "chart_10",
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "entitySet": "SalesShare",
                                "filters": [{
                                    "path" : "Region",
                                    "operator" : "EQ",
                                    "value1" : "APJ"
                                }],
                                "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                                "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr1",
                                "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                                "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                                "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                                "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                            }
                        },
                        dataSource: {
                            baseUrl: chartUtils.odataBaseUrl,
                            rootUri: chartUtils.odataRootUrl,
                            annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml"
                        }
                    };

                    var oModel = cardUtils.createCardModel(cardTestData);
                    stop();
                    oModel.getMetaModel().loaded().then(function () {
                        var oView = cardUtils.createCardView(cardTestData, oModel);

                        oView.loaded().then(function (oView) {
                            //start the async test
                            start();
                            var cardViz = oView.byId("analyticalChart");
                            var chartTitle = oView.byId("ovpCT");
                            var handler = cardViz.getParent();
                            sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                            ok(chartUtils.checkAxisTitleVisibility(cardViz, true), "Check if axis titles are hidden when header exists");
                        })
                });
            });


            test("Bubble chart - With Color Depth",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_11",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr_Color_Depth",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "bubble",
                                vizProperties : {
                            		plotArea : {
                            			colorDepth : 2
                            		}
                            	},
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                                 {
                                                     name: "Product",
                                                     value: "{Product}",
                                                     displayValue: "{Product}"
                                                 },

                                                 {
                                                     name: "Quarter",
                                                     value: "{Quarter}",
                                                     displayValue: "{Quarter}"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Sales Share",
                                                     value: "{SalesShare}"
                                                 },
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "valueAxis2",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "color",
                                                              type : "Dimension",
                                                              values :"Product,Quarter"
                                                          }
                                                      ]
                                }
                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();
                        var cardVizProperties = cardViz.getVizProperties();
                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "bubble"), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.checkVizProperties(cardVizProperties, expectedListRes.VizFrame.vizProperties), "VIZ Frame - see that the VIZ properties are configured.");
                    });
                });
            });

            test("Bubble chart - With Timeseries",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_12",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Bubble-Time",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country",
                            "type": "sap.ovp.cards.charts.bubble.BubbleChart"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "timeseries_bubble",
                                dataSet : {
                                	data: { "path": "/SalesShare" , "sorter": [{"path": "Sales","descending": true}], "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                                 {
                                                     name: "Date",
                                                     value: "{Date}",
                                                     datType: "date"
                                                 }
                                             ],
                                             measures: [
                                                 {
                                                     name: "Total Sales",
                                                     value: "{TotalSales}"
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "valueAxis",
                                                              type : "Measure",
                                                              values :"Sales"
                                                          },
                                                          {
                                                              uid : "bubbleWidth",
                                                              type : "Measure",
                                                              values :"Total Sales"
                                                          },
                                                          {
                                                              uid : "timeAxis",
                                                              type : "Dimension",
                                                              values :"Date"
                                                          }
                                                      ]


                                }

                            }

                        }
                    }
                };

                var oModel = cardUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions, false), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

        });