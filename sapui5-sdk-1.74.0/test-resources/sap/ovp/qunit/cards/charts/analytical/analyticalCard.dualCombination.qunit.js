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

            var parameterTestCase = "Dual Combination chart - With Input Parameters";

            module("sap.ovp.cards.charts.DualCombination", {
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

            test("Dual Combination chart - Without Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_dualcombo",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr_Dual_Combo",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr_Dual_Combo",
                            // "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr_Dual_Combo",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr-Generic",
					        "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_DualCombo.xml"
                    },
                
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "dual_combination",
                                dataSet : {
                                    data: { "path": "/SalesShare" , "sorter": [{"path": "Sales","descending": true}], "length": 3 },
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
                                        },
                                        {
                                            name: "Sales",
                                            value: "{Sales}"
                                        }
                                    ],
                                    feeds : [
                                        {                                                          
                                            "uid": "valueAxis",
                                            "min": 1,
                                            "type": "Measure",
                                            "role": "Axis1",
                                            "vizProperties": [{
                                                "path": "valueAxis.layout.maxWidth",
                                                "value": 0.5
                                            }],
                                            "values":"Sales,Total Sales"
                                        }, 
                                        {
                                            "uid": "valueAxis2",
                                            "min": 1,
                                            "type": "Measure",
                                            "role": "Axis2",
                                            "vizProperties": [{
                                                "path": "valueAxis2.layout.maxWidth",
                                                "value": 0.5
                                            }],
                                            "values":"Sales Share"
                                        }, 
                                        {
                                            "uid": "categoryAxis",
                                            "min": 1,
                                            "type": "Dimension",
                                            "role": "Category",
                                            "values":"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for DualCombination chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });

            test("Dual Combination chart - With Filters",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_dualcombo2",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr_Dual_Combo",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr_Dual_Combo",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr_Dual_Combo",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr-Generic",
					        "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartUtils.odataBaseUrl,
                        rootUri: chartUtils.odataRootUrl,
                        annoUri: chartUtils.testBaseUrl + "data/salesshare/annotations_DualCombo.xml"
                    },
                    expectedResult: {
                        Body: {
                            VizFrame: {
                                vizType : "dual_combination",
                                dataSet : {
                                    data: { "path": "/SalesShare", "sorter": [{"path": "Sales","descending": true}] , "filters": [{"path":"Country","operator":"EQ","value1":"IN"},{"path":"Currency","operator":"EQ","value1":"EUR"}], "length": 3},
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
                                                 },
                                                 {
                                                     name: "Sales",
                                                     value: "{Sales}"
                                                 }],
                                                 feeds : [
                                                            {                                                          
                                                            "uid": "valueAxis",
                                                            "min": 1,
                                                            "type": "Measure",
                                                            "role": "Axis1",
                                                            "vizProperties": [{
                                                                "path": "valueAxis.layout.maxWidth",
                                                                "value": 0.5
                                                            }],
                                                            "values":"Sales,Total Sales"
                                                            }, 
                                                            {
                                                                "uid": "valueAxis2",
                                                                "min": 1,
                                                                "type": "Measure",
                                                                "role": "Axis2",
                                                                "vizProperties": [{
                                                                    "path": "valueAxis2.layout.maxWidth",
                                                                    "value": 0.5
                                                                }],
                                                                "values":"Sales Share"
                                                            }, 
                                                            {
                                                                "uid": "categoryAxis",
                                                                "min": 1,
                                                                "type": "Dimension",
                                                                "role": "Category",
                                                                "values":"Product"
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
                        ok(chartUtils.vizNodeExists(cardXml, expectedListRes.VizFrame.vizType), "VIZ Frame - see that there is a VIZFrame for bubble chart");
                        ok(chartUtils.genericDimensionItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.dimensions), "VIZ Frame - see that there is dimensions binding");
                        ok(chartUtils.genericMeasureItemsNodeExists(cardViz, expectedListRes.VizFrame.dataSet.measures), "VIZ Frame - see that there is measures binding");
                        ok(chartUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.dataSet.feeds), "VIZ Frame - see that there is feed binding");
                        ok(chartUtils.dataBinding(cardXml, expectedListRes.VizFrame.dataSet.data), "VIZ Frame - see that there is data binding");
                    });
                });
            });            
        });