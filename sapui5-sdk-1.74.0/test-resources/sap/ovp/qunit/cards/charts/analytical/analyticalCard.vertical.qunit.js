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
            //jQuery.sap.require("sap.m.Button");

            var cardUtils = cardUtils;
            var chartUtils = oChartUtils;

            var parameterTestCase = "Vertical Bullet chart - With Input Parameters";

            module("sap.ovp.cards.charts.Vertical", {
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

            test("Vertical Bullet chart - Without Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_1",
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
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_nofilter.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare" , "sorter": [{"path": "Sales","descending": true}]},
                                    dimensions: [
                                                 {
                                                     name: "Product",
                                                     value: "{Product}",
                                                     displayValue: "{Product}"
                                                 },
                                                 {
                                                     name: "Country",
                                                     value: "{Country}",
                                                     displayValue: "{Country}"
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
                                                 }],
                                                 feeds : [
                                                          {
                                                              uid : "actualValues",
                                                              type : "Measure",
                                                              values :"Sales Share"
                                                          },
                                                          {
                                                              uid : "categoryAxis",
                                                              type : "Dimension",
                                                              values :"Product,Country"
                                                          },
                                                          {
                                                              uid : "targetValues",
                                                              type : "Measure",
                                                              values :"Total Sales"
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
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });
           

            test("Vertical Bullet chart - With Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_2",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_Currency",
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
                                vizType : "vertical_bullet",
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
                                        },
                                        {
                                            name: "Total Sales",
                                            value: "{TotalSales}"
                                        }],
                                     feeds : [
                                                 {
                                                     uid : "actualValues",
                                                     type : "Measure",
                                                     values :"Sales Share"
                                                 },
                                                 {
                                                     uid : "categoryAxis",
                                                     type : "Dimension",
                                                     values :"Product"
                                                 },
                                                 {
                                                     uid : "targetValues",
                                                     type : "Measure",
                                                     values :"Total Sales"
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
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Vertical Bullet chart - With Filters Without Sorters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_3",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_CtryCurr",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare" , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue: "{Product}"
                                        },
                                        {
                                            name:"Country",
                                            value:"{Country}",
                                            displayValue: "{Country}"
                                        },
                                        {
                                            name: "Region",
                                            value: "{Region}",
                                            displayValue: "{Region}"
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
                                        }]
                                },
                                feeds : [
                                    {
                                        uid : "categoryAxis",
                                        type : "Dimension",
                                        values :"Product,Country,Region"
                                    },
                                    {
                                        uid : "actualValues",
                                        type : "Measure",
                                        values :"Sales Share"
                                    },
                                    {
                                        uid : "targetValues",
                                        type : "Measure",
                                        values :"Total Sales"
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
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test(parameterTestCase,function(){
                var cardTestData = {
                    card: {
                        "id": "chart_4",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                        "entitySet": "SalesOrder",
                        "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                        "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_Country",
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesOrderParameters(P_Currency=%27EUR%27,P_CountryCode=%27IN%27)/Results" , "filters": [],
                                            "sorter": [], "parameters": {"select":"Country,NetAmount"}, length: 4},
                                    dimensions: [
                                        {
                                            name:"Product",
                                            value:"{Product}",
                                            displayValue: "{Product}"
                                        }
                                    ],
                                    measures: [
                                        {
                                            name: "Net Amount",
                                            value: "{NetAmount}"
                                        }]
                                },
                                feeds : [
                                    {
                                        uid : "categoryAxis",
                                        type : "Dimension",
                                        values :"Product"
                                    },
                                    {
                                        uid : "actualValues",
                                        type : "Measure",
                                        values :"Net Amount"
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
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Vertical Bullet chart - With faulty filter configuration",function(){
                var cardTestData = {
                    card: {
                        "id": "chart_5",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#NON_EXISTENT",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#VerticalEval_by_Currency",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr"
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare"},
                                    dimensions: [
                                        {
                                            name: "Product",
                                            value: "{Product}",
                                            displayValue: "{Product}"
                                        },
                                        {
                                            name: "Country",
                                            value: "{Country}",
                                            displayValue: "{Country}"
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
                                        }]
                                },
                                feeds : [
                                    {
                                        uid : "categoryAxis",
                                        type : "Dimension",
                                        values :"Product,Country"
                                    },
                                    {
                                        uid : "actualValues",
                                        type : "Measure",
                                        values :"Sales Share"
                                    },
                                    {
                                        uid : "targetValues",
                                        type : "Measure",
                                        values :"Total Sales"
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
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
				});
            });
      
            test("Vertical Bullet chart - Without DataPoint Annotation",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_6",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
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
                                        }]
                                },
                                feeds : [
                                    {
                                        uid : "categoryAxis",
                                        type : "Dimension",
                                        values :"Product"
                                    },
                                    {
                                        uid : "actualValues",
                                        type : "Measure",
                                        values :"Sales Share"
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
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Vertical Bullet chart - With DataPoint, Without Title and Value",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_7",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"}]},
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
                                        }]
                                },
                                feeds : [
                                    {
                                        uid : "categoryAxis",
                                        type : "Dimension",
                                        values :"Product"
                                    },
                                    {
                                        uid : "actualValues",
                                        type : "Measure",
                                        values :"Sales Share"
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
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml, true, false), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Vertical Bullet chart - With ObjectStream Filters",function(){
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
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"},{"path" : "Region","operator" : "EQ","value1" : "APJ"}], length :3},
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
                                        },
                                        {
                                            name: "Total Sales",
                                            value: "{TotalSales}"
                                        }]
                                },
                                feeds : [
                                         {
                                             uid : "categoryAxis",
                                             type : "Dimension",
                                             values :"Product"
                                         },
                                         {
                                             uid : "actualValues",
                                             type : "Measure",
                                             values :"Sales Share"
                                         },
                                         {
                                             uid : "targetValues",
                                             type : "Measure",
                                             values :"Total Sales"
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
                        ok(cardXml !== undefined, "Existence check to XML parsing");
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz);
                        var feeds = cardViz.getFeeds();
                        var cardCfg = cardTestData.card.settings;
                        var expectedListRes = cardTestData.expectedResult.Body;
                        // basic list XML structure tests
                        ok(chartUtils.ovpNodeExists(cardXml), "OVP Card - see that there is a OVP Card Format");
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for Vertical Bullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Vertical Bullet chart - With MeasureAttributes and DimensionAttributes missing",function(){
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
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Vertical_Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Country","operator":"EQ","value1":"US"},{"path":"Currency","operator":"EQ","value1":"EUR"},{"path" : "Region","operator" : "EQ","value1" : "APJ"}]},
                                    dimensions: [],
                                    measures: []
                                },
                                feeds : []
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
                        ok(chartUtils.vizNodeNotExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is no VIZFrame rendered for Vertical Bullet chart");
                    });
                });
            });

            test("Vertical Bullet chart - Customizing with colorPalette - 4 colors",function(){
                var cardTestData = {
                    card: {
                        "id": "chart_10",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_VerticalBullet",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                            "colorPalette" : [{
										"color": "sapUiChartPaletteSemanticNeutral",
										"legendText" : "{{OTHERS}}"
										},
										{
										"color": "sapUiChartPaletteSemanticBadDark1",
										"legendText" : "{{BAD}}"
										},
										{
										"color": "sapUiChartPaletteSemanticCriticalDark2",
										"legendText" : "{{CRITICAL}}"
										},
										{
										"color": "sapUiChartPaletteSemanticCritical",
										"legendText" : "{{GOOD}}"
                            }],
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
                                vizType : "vertical_bullet",
                                dataSet : {
                                    data: { "path": "/SalesShare" , "sorter": [{"path": "Sales","descending": true}], length :3},
                                    dimensions: [
                                                    {
                                                        name: "Criticality",
                                                        value: "{StatusCriticality}",
                                                        displayValue: "{Criticality}"
                                                    },
                                                    {
                                                        name: "Region",
                                                        value: "{Region}",
                                                        displayValue: "{Region}"
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
                                                uid : "categoryAxis",
                                                type : "Dimension",
                                                values :"Region"
                                            },
                                            {
                                                uid : "actualValues",
                                                type : "Measure",
                                                values :"Sales"
                                            },
                                            {
                                                uid : "targetValues",
                                                type : "Measure",
                                                values :"Total Sales"
                                            },
                                            {
                                                uid : "color",
                                                type : "Dimension",
                                                values :"Criticality"
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
                        ok(chartUtils.vizNodeExists(cardXml, "vertical_bullet"), "VIZ Frame - see that there is a VIZFrame for VerticalBullet chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });

                });
            });
        });