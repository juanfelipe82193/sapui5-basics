sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (cardUtils, oChartUtils, mockservers, jquery) {
            "use strict";

            //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.charts.utils");

            // Preloading the VIZ library before executing the tests to prevent the time out issue during the execution of tests.
            //jQuery.sap.require("sap.viz.ui5.controls.VizFrame");
            //jQuery.sap.require("sap.viz.ui5.data.FlattenedDataset");


            var cardUtils = cardUtils;
            var chartUtils = oChartUtils;

            var parameterTestCase = "Donut chart - With Input Parameters";

            module("sap.ovp.cards.charts.Donut", {
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

            test("Donut chart - Without Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_1",
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
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "donut",
                                dataSet : {	// make sure to check the blank spaces
                                    data: {"path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}]},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue: "{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }],
                                     feeds : [
                                                 {
                                                     uid : "size",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "color",
                                                     type : "Dimension",
                                                     values :"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Donut chart - With Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_2",
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
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "donut",
                                dataSet : {// make sure to check the blank spaces
                                    data: {"path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"}], "sorter": [{"path": "Sales","descending": true}]},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue: "{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }],
                                     feeds : [
                                                 {
                                                     uid : "size",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "color",
                                                     type : "Dimension",
                                                     values :"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Donut chart - With Filters Without Sorter",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_3",
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
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nosorter.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "donut",
                                dataSet : {
                                    data: {"path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"}]},
                                    dimensions: [
                                        {
                                            name: "Supplier Company",
                                            value: "{SupplierCompany}",
                                            displayValue: "{SupplierCompany}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }],
                                        feeds : [
                                                 {
                                                     uid : "size",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "color",
                                                     type : "Dimension",
                                                     values :"Supplier Company"
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test(parameterTestCase, function(){
                var cardTestData = {
                    card: {
                        "id": "chart_4",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                        "entitySet": "SalesOrder",
                        "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                        "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country2",
                        "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                        "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                        "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                      }
                    },
                    dataSource: {
                       baseUrl: chartUtils.odataBaseUrl2,
                       rootUri: chartUtils.odataRootUrl_InputParameters,
                       annoUri: chartUtils.odataBaseUrl2 + "annotations_InputParamets.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "donut",
                                dataSet : {
                                    data: { "path": "/SalesOrderParameters(P_Currency=%27EUR%27,P_CountryCode=%27IN%27)/Results" , "filters": [],
                                            "sorter": [], "parameters": {"select":"Country,NetAmount"}, length: 5},
                                    dimensions: [
                                        {
                                            name:"Product ID",
                                            value:"{ProductID}",
                                            displayValue:"{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Net Amount",
                                            value: "{NetAmount}"
                                        }],
                                
                                feeds : [
                                    {
                                        uid : "size",
                                        type : "Measure",
                                        values :"Net Amount"
                                    },
                                    {
                                        uid : "color",
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Donut chart - With faulty filter configuration",function(){
                var cardTestData = {
                    card: {
                        "id": "chart_5",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency"
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
                                vizType : "donut",
                                dataSet : {
                                    data: {"path": "/SalesShare"},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue:"{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }],
                                    feeds : [
                                                 {
                                                     uid : "size",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "color",
                                                     type : "Dimension",
                                                     values :"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Donut chart - Without DataPoint Annotation",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_6",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
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
                                vizType : "donut",
                                dataSet : {
                                    data: {"path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"}], "sorter": [{"path": "Sales","descending": true}]},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue:"{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }],
                                        feeds : [
                                                 {
                                                     uid : "size",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "color",
                                                     type : "Dimension",
                                                     values :"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Donut chart - With DataPoint, Without Title and Value",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_7",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency"
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
                                vizType : "donut",
                                dataSet : {
                                    data: {"path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"}], "sorter": [{"path": "Sales","descending": true}]},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue:"{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }],
                                        feeds : [
                                                 {
                                                     uid : "size",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "color",
                                                     type : "Dimension",
                                                     values :"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });


            test("Donut chart - With ObjectStream Filters",function(){
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
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
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
                                vizType : "donut",
                                dataSet : {
                                    data: {"path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path" : "Region","operator" : "EQ","value1" : "APJ"}], "sorter": [{"path": "Sales","descending": true}]},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue:"{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Sales Share",
                                            value: "{SalesShare}"
                                        }],
                                        feeds : [
                                                 {
                                                     uid : "size",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "color",
                                                     type : "Dimension",
                                                     values :"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for Donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });


            
            test("Donut chart - With MeasureAttributes and DimensionAttributes missing",function(){
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
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
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
                                vizType : "donut",
                                dataSet : {
                                    data: {"path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path" : "Region","operator" : "EQ","value1" : "APJ"}], "sorter": [{"path": "Sales","descending": true}]},
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
                        ok(chartUtils.vizNodeNotExists(cardXml, "donut"), "VIZ Frame - see that there is no VIZFrame rendered for Donut chart");
                    });
                });
            });
            
       
            test("Donut chart - With Zero MeasureAttributes and DimensionAttributes",function(){
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
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency2",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
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
                                vizType : "donut",
                                dataSet : {// make sure to check the blank spaces
                                    data: {"path": "/SalesShare", "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path" : "Region","operator" : "EQ","value1" : "APJ"}], "sorter": [{"path": "Sales","descending": true}]},
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
                        ok(chartUtils.vizNodeNotExists(cardXml, "donut"), "VIZ Frame - see that there is no VIZFrame rendered for Donut chart");
                    });
                });
            });

            function chartFunctions(oController, card, cardViz, oView){
                oController.getView = function() {
                    return {
                        byId : function(id) {
                            if (id === "analyticalChart"){
                                var vizCard= cardViz;
                                
                                var oModel = {
                                    "entityType" : {"com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr" : {
                                        "MaxItems": {
                                            "Int" : 5
                                        },
                                        "SortOrder" : [
                                            {
                                                "Descending" : {
                                                    "Boolean" : true
                                                }
                                            },
                                            {
                                                "Property" : {
                                                    "PropertyPath" : "Sales"
                                                }
                                            }
                                        ],
                                        "Visualizations" : [
                                            {
                                                "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut"
                                            }
                                        ]
                                    }},
                                    "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr" ,
                                    "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut" ,
                                    "dataStep" : 11
                                }
                                vizCard.setModel(oView.getModel("ovpCardProperties"), 'ovpCardProperties');
                                var binding = vizCard.getParent().getBinding("data");   
                                binding.mParameters = {"select": "ProductID,Sales"};

                                var newAggrBinding = {};
                                newAggrBinding.path = "/SalesShare";
                                newAggrBinding.parameters= {
                                    "select" : "Sales"
                                }
                                newAggrBinding.length = 1;
                                newAggrBinding.template = new sap.ui.core.Element();
                                vizCard.getParent().bindAggregation("aggregateData", newAggrBinding);
                                vizCard.getParent().setDependentDataReceived(true);

                                return vizCard;
                            }
                        }
                    }
                }
            }
            test("Donut chart - Customizing with stable Array colorPalette - 5 colors",function(){
                var cardTestData = {
                    card: {
                        "id": "chart_11",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "bEnableStableColors" : true,
                            "colorPalette" : [
                                {
                                "color": "sapUiChartPaletteSemanticNeutral",
                                "dimensionValue" : "HT-1210"
                                },
                                {
                                "color": "sapUiChartPaletteSemanticBadDark1",
                                "dimensionValue" : "HT-8002"
                                },
                                {
                                "color": "sapUiChartPaletteSemanticCriticalDark2",
                                "dimensionValue" : "HT-2002"
                                },
                                {
                                "color": "sapUiChartPaletteSemanticCritical",
                                "dimensionValue" : "HT-3001"
                                },
                                {
                                "color": "sapUiChartPaletteSemanticGoodLight2",
                                "dimensionValue" : "HT-1019"
                                }
                            ],
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
                                vizType : "donut",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}], 
                                    "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"}], length: 4},
                                    dimensions: [
                                                    {
                                                        name: "Product ID",
                                                        value: "{ProductID}",
                                                        displayValue: "{Product ID}"
                                                    }
                                                ],
                                    measures: [
                                                {
                                                    name: "Sales",
                                                    value: "{Sales}"
                                                }
                                            ]
                                },
                                feeds : [
                                            {
                                                uid : "size",
                                                type : "Measure",
                                                values :"Sales"
                                            },
                                            {
                                                uid : "color",
                                                type : "Dimension",
                                                values :"Product ID"
                                            }
                                ]
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
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        
                        var oController = new sap.ui.controller("sap.ovp.cards.charts.analytical.analyticalChart");
                        chartFunctions(oController, "chart_11", cardViz, oView);
                        var oItemsBinding = oController.getCardItemsBinding();

                        oItemsBinding.fireDataReceived({"data" : {
                                results : [
                                    {
                                        ProductID : 'HT-1210',
                                        Sales: '97680'
                                    },
                                    {
                                        ProductID : 'HT-8002',
                                        Sales: '79800'
                                    },
                                    {
                                        ProductID : 'HT-2002',
                                        Sales: '136800'
                                    },
                                    {
                                        ProductID : 'HT-3001',
                                        Sales: '126800'
                                    },
                                    {
                                        ProductID : 'HT-1019',
                                        Sales: '145800'
                                    }
                                ],
                                __count: 5
                            }   
                        });
                        
                        cardViz.getParent().getBinding("aggregateData").fireDataReceived({"data" : {
                                results : [
                                    {
                                        Sales: '97680'
                                    }
                                ],
                                __count: 1
                            }   
                        });

                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding after colors are set");

                    });

                });
            });

            test("Donut chart - Customizing with stable Map colorPalette - 5 colors",function(){
                var cardTestData = {
                    card: {
                        "id": "chart_12",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                            "type": "sap.ovp.cards.charts.donut.DonutChart",
                            "bEnableStableColors" : true,
                            "colorPalette" : {
                                            "HT-1210": "sapUiChartPaletteSemanticNeutral",
                                            "HT-8002": "sapUiChartPaletteSemanticBadDark1",
                                            "HT-2002": "sapUiChartPaletteSemanticCriticalDark2",
                                            "HT-3001": "sapUiChartPaletteSemanticCritical",
                                            "HT-1019": "sapUiChartPaletteSemanticGoodLight2",
                                        }
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
                                vizType : "donut",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}], 
                                    "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"}], length: 4},
                                    dimensions: [
                                                    {
                                                        name: "Product ID",
                                                        value: "{ProductID}",
                                                        displayValue: "{Product ID}"
                                                    }
                                                ],
                                    measures: [
                                                {
                                                    name: "Sales",
                                                    value: "{Sales}"
                                                }
                                            ]
                                },
                                feeds : [
                                            {
                                                uid : "size",
                                                type : "Measure",
                                                values :"Sales"
                                            },
                                            {
                                                uid : "color",
                                                type : "Dimension",
                                                values :"Product ID"
                                            }
                                ]
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
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                         var newAggrBinding = {};
                        newAggrBinding.path = "/SalesShare";
                        newAggrBinding.parameters= {
                            "select" : "Sales"
                        }
                        newAggrBinding.length = 1;
                        newAggrBinding.template = new sap.ui.core.Element();
                        cardViz.getParent().bindAggregation("aggregateData", newAggrBinding);
                        cardViz.getParent().setDependentDataReceived(true);
                        
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();

                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;

                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
                        //ok(chartUtils.vizNodeExists(cardXml, "donut"), "VIZ Frame - see that there is a VIZFrame for donut chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        
                        var oController = new sap.ui.controller("sap.ovp.cards.charts.analytical.analyticalChart");
                        chartFunctions(oController, "chart_12", cardViz, oView);
                        var oItemsBinding = oController.getCardItemsBinding();
                       

                        oItemsBinding.fireDataReceived({"data" : {
                                results : [
                                    {
                                        ProductID : 'HT-1210',
                                        Sales: '97680'
                                    },
                                    {
                                        ProductID : 'HT-8002',
                                        Sales: '79800'
                                    },
                                    {
                                        ProductID : 'HT-2002',
                                        Sales: '136800'
                                    },
                                    {
                                        ProductID : 'HT-3001',
                                        Sales: '126800'
                                    },
                                    {
                                        ProductID : 'HT-1019',
                                        Sales: '145800'
                                    }
                                ],
                                __count: 5
                            }   
                        });
                        
                        cardViz.getParent().getBinding("aggregateData").fireDataReceived({"data" : {
                                results : [
                                    {
                                        Sales: '97680'
                                    }
                                ],
                                __count: 1
                            }   
                        });

                        //ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding after colors are set");

                    });

                });
            });
            
        });