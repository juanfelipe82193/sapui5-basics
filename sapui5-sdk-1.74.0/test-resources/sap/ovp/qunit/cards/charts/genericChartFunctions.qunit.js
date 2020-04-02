sap.ui.define([
    "sap/ovp/cards/charts/Utils",
    "sap/ovp/cards/charts/VizAnnotationManager",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global",
    "sap/base/Log"
], function (Utils, VizAnnotationManager, utils, oChartUtils, mockservers, jQuery, Log) {
           "use strict";

           //jQuery.sap.require("sap.ovp.cards.charts.Utils");
           //jQuery.sap.require("sap.ovp.cards.charts.VizAnnotationManager");
           //jQuery.sap.require("sap.ovp.cards.AnnotationHelper");
           //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
           //jQuery.sap.require("sap.ovp.test.qunit.cards.charts.utils");
           var chartUtils = Utils;
           var VizAnnotationManager = VizAnnotationManager;
           var chartTestUtils = oChartUtils;
           var cardTestUtils = utils;

           module("sap.ovp.cards.charts", {
               /**
                * This method is called before each test
                */
               beforeEach: function (test) {
            	   //jQuery.sap.require("sap.ovp.test.mockservers");
                   var baseURL = chartTestUtils.odataBaseUrl;
                   var rootURL = chartTestUtils.odataRootUrl;
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



           test("Test Generic Chart Functions",function(){
               var testData1 = [
                   {
                       "Measure": {
                           "PropertyPath": "SalesShare"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   },
                   {
                       "Measure": {
                           "PropertyPath": "TotalSales"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   },
                   {
                       "Measure": {
                           "PropertyPath": "Sales"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   }
               ];
               var testData2 = [
                   {
                       "Measure": {
                           "PropertyPath": "SalesShare"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   },
                   {
                       "Measure": {
                           "PropertyPath": "TotalSales"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   },
                   {
                       "Measure": {
                           "PropertyPath": "Sales"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   }
               ];
               var testData3 = [
                   {
                       "Measure": {
                           "PropertyPath": "SalesShare"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   },
                   {
                       "Measure": {
                           "PropertyPath": "TotalSales"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   },
                   {
                       "Measure": {
                           "PropertyPath": "Sales"
                       },
                       "Role": {
                           "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"
                       },
                       "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                   }
               ];

               var simulatedEntityTypeData = {
                    "name": "SalesShareType",
                    "namespace": "sap.smartbusinessdemo.services",
                    "$path": "/dataServices/schema/0/entityType/0",
                    "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country": [{
                        "Label": {
                            "String": ""
                        },
                        "Criticality": {
                            "EnumMember": "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
                        },
                        "SemanticObject": {
                            "String": "OVP"
                        },
                        "Action": {
                            "String": "Procurement"
                        },
                        "RecordType": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
                    }, {
                        "Label": {
                            "String": "Evaluation"
                        },
                        "Value": {
                            "String": "evaluation2"
                        },
                        "RecordType": "com.sap.vocabularies.UI.v1.DataField"
                    }],
                    "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country": {
                        "Title": {
                            "String": "Sales India"
                        },
                        "Value": {
                            "Path": "Sales",
                            "EdmType": "Edm.Decimal"
                        },
                        "NumberFormat": {
                            "ScaleFactor": {
                                "Int": "0"
                            },
                            "NumberOfFractionalDigits": {
                                "Int": "3"
                            }
                        },
                        "CriticalityCalculation": {
                            "ImprovementDirection": {
                                "EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimizing"
                            },
                            "DeviationRangeHighValue": {
                                "String": "7300"
                            },
                            "ToleranceRangeHighValue": {
                                "String": "7200"
                            }
                        },
                        "TargetValue": {
                            "String": "2.000 "
                        },
                        "TrendCalculation": {
                            "ReferenceValue": {
                                "String": "5201680"
                            },
                            "DownDifference": {
                                "Int": "10000000.0"
                            }
                        },
                        "RecordType": "com.sap.vocabularies.UI.v1.DataPointType"
                    },
                    "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country": {
                        "SelectOptions": [{
                            "PropertyName": {
                                "PropertyPath": "Country"
                            },
                            "Ranges": [{
                                "Sign": {
                                    "EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
                                },
                                "Option": {
                                    "EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
                                },
                                "Low": {
                                    "String": "IN"
                                }
                            }]
                        }, {
                            "PropertyName": {
                                "PropertyPath": "Currency"
                            },
                            "Ranges": [{
                                "Sign": {
                                    "EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"
                                },
                                "Option": {
                                    "EnumMember": "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
                                },
                                "Low": {
                                    "String": "EUR"
                                }
                            }]
                        }]
                    },
                    "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country": {
                        "GroupBy": [{
                            "PropertyPath": "Country"
                        }],
                        "SortOrder": [{
                            "Property": {
                                "PropertyPath": "Year"
                            },
                            "Descending": {
                                "Boolean": "true"
                            }
                        }],
                        "Visualizations": [{
                            "AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Country"
                        }]
                    },
                    "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country": {
                        "Title": {
                            "String": "View1"
                        },
                        "MeasureAttributes": [{
                            "Measure": {
                                "PropertyPath": "SalesShare"
                            },
                            "Role": {
                                "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                            },
                            "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                        }],
                        "DimensionAttributes": [{
                            "Dimension": {
                                "PropertyPath": "ProductID"
                            },
                            "Role": {
                                "EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                            },
                            "RecordType": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType"
                        }, {
                            "Dimension": {
                                "PropertyPath": "Region"
                            },
                            "Role": {
                                "EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
                            },
                            "RecordType": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType"
                        }],
                        "RecordType": "com.sap.vocabularies.UI.v1.ChartDefinitionType"
                    },
                    "property": [{
                        "name": "Country",
                        "type": "Edm.String",
                        "maxLength": "3",
                        "extensions": [{
                            "name": "label",
                            "value": "Country",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "aggregation-role",
                            "value": "dimension",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }],
                        "sap:label": "Country",
                        "com.sap.vocabularies.Common.v1.Label": {
                            "String": "Country"
                        },
                        "sap:aggregation-role": "dimension"
                    }, {
                        "name": "Region",
                        "type": "Edm.String",
                        "maxLength": "4",
                        "extensions": [{
                            "name": "label",
                            "value": "Region",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "aggregation-role",
                            "value": "dimension",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }],
                        "sap:label": "Region",
                        "com.sap.vocabularies.Common.v1.Label": {
                            "String": "Region"
                        },
                        "sap:aggregation-role": "dimension"
                    }, {
                      "name": "Date",
                      "type": "Edm.DateTime",
                      "extensions": [{
                        "name": "display-format",
                        "value": "Date",
                        "namespace": "http://www.sap.com/Protocols/SAPData"
                      }, {
                        "name": "label",
                        "value": "Date",
                        "namespace": "http://www.sap.com/Protocols/SAPData"
                      }, {
                        "name": "aggregation-role",
                        "value": "dimension",
                        "namespace": "http://www.sap.com/Protocols/SAPData"
                      }],
                      "sap:display-format": "Date",
                      "sap:label": "Date",
                      "com.sap.vocabularies.Common.v1.Label": {
                        "String": "Date"
                      },
                      "sap:aggregation-role": "dimension"
                    }, {
                        "name": "ProductID",
                        "type": "Edm.String",
                        "maxLength": "10",
                        "extensions": [{
                            "name": "label",
                            "value": "Product ID",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "aggregation-role",
                            "value": "dimension",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "text",
                            "value": "Product",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }],
                        "sap:label": "Product ID",
                        "com.sap.vocabularies.Common.v1.Label": {
                            "String": "Product ID"
                        },
                        "sap:aggregation-role": "dimension",
                        "sap:text": "Product",
                        "com.sap.vocabularies.Common.v1.Text": {
                            "Path": "Product"
                        }
                    }, {
                        "name": "Currency",
                        "type": "Edm.String",
                        "maxLength": "5",
                        "extensions": [{
                            "name": "label",
                            "value": "Currency",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "aggregation-role",
                            "value": "dimension",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }],
                        "sap:label": "Currency",
                        "com.sap.vocabularies.Common.v1.Label": {
                            "String": "Currency"
                        },
                        "sap:aggregation-role": "dimension"
                    }, {
                        "name": "Sales",
                        "type": "Edm.Decimal",
                        "precision": "15",
                        "scale": "2",
                        "extensions": [{
                            "name": "filterable",
                            "value": "false",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "label",
                            "value": "Sales",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "aggregation-role",
                            "value": "measure",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "unit",
                            "value": "Sales_CURRENCY",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }],
                        "sap:filterable": "false",
                        "sap:label": "Sales",
                        "com.sap.vocabularies.Common.v1.Label": {
                            "String": "Sales"
                        },
                        "sap:aggregation-role": "measure",
                        "sap:unit": "Sales_CURRENCY",
                        "Org.OData.Measures.V1.ISOCurrency": {
                            "Path": "Sales_CURRENCY"
                        }
                    }, {
                        "name": "TotalSales",
                        "type": "Edm.Decimal",
                        "precision": "15",
                        "scale": "2",
                        "extensions": [{
                            "name": "filterable",
                            "value": "false",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "label",
                            "value": "Total Sales",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "aggregation-role",
                            "value": "measure",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "unit",
                            "value": "TotalSales_CURRENCY",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }],
                        "sap:filterable": "false",
                        "sap:label": "Total Sales",
                        "com.sap.vocabularies.Common.v1.Label": {
                            "String": "Total Sales"
                        },
                        "sap:aggregation-role": "measure",
                        "sap:unit": "TotalSales_CURRENCY",
                        "Org.OData.Measures.V1.ISOCurrency": {
                            "Path": "TotalSales_CURRENCY"
                        }
                    },{
                        "name": "SalesShare",
                        "type": "Edm.Decimal",
                        "precision": "12",
                        "scale": "5",
                        "extensions": [{
                            "name": "filterable",
                            "value": "false",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "label",
                            "value": "Sales Share",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }, {
                            "name": "aggregation-role",
                            "value": "measure",
                            "namespace": "http://www.sap.com/Protocols/SAPData"
                        }],
                        "sap:filterable": "false",
                        "sap:label": "Sales Share",
                        "com.sap.vocabularies.Common.v1.Label": {
                            "String": "Sales Share"
                        },
                        "sap:aggregation-role": "measure"
                    }]
                };

               var simulatedOvpModel = {
                   getProperty: function (path) {
                       if (path == "/entityType") {
                           return simulatedEntityTypeData;
                       }
                   }
               };

               var entityTypeDataContext = {
                   getModel: function (model) {
                       if (model == "ovpCardProperties") {
                           return simulatedOvpModel;
                       }
                   }
               };

               var simulatedIContext = {
                   getSetting: function (model) {
                       if (model == "ovpCardProperties") {
                           return simulatedOvpModel;
                       }
                   }
               };

               var bubbleCheck = {"EnumMember":"com.sap.vocabularies.UI.v1.ChartType/Bubble"}
               assert.equal(VizAnnotationManager.getChartType(simulatedIContext, bubbleCheck), "bubble", "Bubble Check done");

               var lineCheck = {"EnumMember":"com.sap.vocabularies.UI.v1.ChartType/Line"}
               assert.equal(VizAnnotationManager.getChartType(simulatedIContext, lineCheck), "line", "Line Check done");

               var donutCheck = {"EnumMember":"com.sap.vocabularies.UI.v1.ChartType/Donut"}
               assert.equal(VizAnnotationManager.getChartType(simulatedIContext, donutCheck), "donut", "Donut Check done");

               var checkConfig = VizAnnotationManager.getConfig();
               ok(checkConfig && (typeof checkConfig === 'object'),"presence of config");
               jQuery.each(checkConfig, function(i, checkConfigType) {
                    var flag=true;
            	    jQuery.each(checkConfigType, function(j, propt) {
            	    	    if((j== "type" && typeof j!== 'string')||
            	    	    		(j=="dimensions" && typeof j !== 'object')||
            	    	    			(j=="measures" && typeof j !== 'object')){
            	    	    	flag=false;
            	    	    	return false;
            	    	    }
            	            if ((j == "feeds") && (j instanceof Array) && (j.length > 0)) {
            	                jQuery.each(propt, function(k, f){
            	                  if(!f.uid || typeof f.uid !== 'string' || !f.type || typeof f.type !== 'string')
            	                	  {
            	                	  flag=false;
            	                      return false;
            	                	  }
            	                })

            	            }
            	            ok(flag,i+" config check");
            	    })
            	})

               var selVar = "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country";
               var chartAnno = "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country";
               var preVar =  "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country";
               var idAnno = "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country";
               var dPAnno = "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country";

               assert.deepEqual(chartUtils.BubbleChart.getMeasurePriorityList(simulatedIContext, testData1),
                       ["Sales Share", "Total Sales", "Sales"], "Axis 1 Test");
               assert.deepEqual(chartUtils.BubbleChart.getMeasurePriorityList(simulatedIContext, testData2),
                       ["Sales Share", "Total Sales", "Sales"], "Axis 2 Test");
               assert.deepEqual(chartUtils.BubbleChart.getMeasurePriorityList(simulatedIContext, testData3),
                       ["Sales Share", "Total Sales", "Sales"], "Axis 3 Test");

               var fCheckExists = VizAnnotationManager.checkExists;
               ok(chartTestUtils.isValidBoolean(
                       fCheckExists(selVar, simulatedEntityTypeData, "Selection Variant")),
                       "Annotation checker Test - Selection Variant");
               ok(chartTestUtils.isValidBoolean(
                       fCheckExists(chartAnno, simulatedEntityTypeData, "Chart Annotation")),
                       "Annotation checker Test - Chart Annotation", true);
               ok(chartTestUtils.isValidBoolean(
                       fCheckExists(preVar, simulatedEntityTypeData, "Presentation Variant")),
                       "Annotation checker Test - Presentation Variant");
               ok(chartTestUtils.isValidBoolean(
                       fCheckExists(idAnno, simulatedEntityTypeData, "Identification Annotation")),
                       "Annotation checker Test - Identification Annotation");
               ok(chartTestUtils.isValidBoolean(
                       fCheckExists(dPAnno, simulatedEntityTypeData, "Data Point")),
                       "Annotation checker Test - Data Point");
               ok(chartTestUtils.isValidDate(
                       VizAnnotationManager.returnDateFormat(new Date())),
                       "Date Formatter test");
               ok(chartTestUtils.isValidString(
                        VizAnnotationManager.returnDateFormat(undefined)),
                       "Date Formatter test");
               ok(jQuery.proxy(chartUtils.formDimensionPath, entityTypeDataContext)("ProductID") === "{Product}",
                       "Test if DimensionDefinition names consider sap:text");
               ok(jQuery.proxy(chartUtils.formDimensionPath, entityTypeDataContext)("Region") === "{Region}",
                       "Test if DimensionDefinition names fall back to dimension name when no sap:text available");
               ok(jQuery.proxy(chartUtils.formDimensionPath, entityTypeDataContext)("Date") === "{path:'Date', formatter: 'sap.ovp.cards.charts.VizAnnotationManager.returnDateFormat'}",
                        "Test if DimensionDefinition names check for DateTime type and pass on to the Date formatter.");
               //ok(chartTestUtils.testNoDataSection(), "Test 'No Data available' section");
           });

			test("Analytical Chart - With less Dimensions",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_1",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_LessDim.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {
                   var errorSpy = sinon.spy(Log, "error");
                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardXml = oView._xContent;
                       ok(cardXml !== undefined,"Existence check to XML parsing");
                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CHART_ANNO_ERROR + "in " + VizAnnotationManager.errorMessages.CHART_ANNO + " " +
                       VizAnnotationManager.errorMessages.DIMENSIONS_MANDATORY), "Check if less/no dimensions given in the annotations");
                       errorSpy.restore();
                   });

               });
           });

           test("Analytical Chart - With less Measures",function(){
               var cardTestData = {
                   card: {
                       "id": "chart_2",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_LessMeas.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {
                   var errorSpy = sinon.spy(Log, "error");
                   var oView = cardTestUtils.createCardView(cardTestData, oModel);
                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardXml = oView._xContent;
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CHART_ANNO_ERROR + "in " + VizAnnotationManager.errorMessages.CHART_ANNO + " " +
                       VizAnnotationManager.errorMessages.MEASURES_MANDATORY), "Check if less/no measures given in the annotations");
                       errorSpy.restore();
                   });
               });
           });

           test("Axis Scaling new Vocabulary - ZeroAlwaysVisible",function(){
               var cardTestData = {
                   card: {
                       "id": "chart_5_ZeroAlwaysVisible",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#ZeroAlwaysVisible",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_DefaultRole(No Roles Defined).xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                   {
                                       uid : "valueAxis",
                                       type : "Measure",
                                       values : "Sales Share"
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
                                   }
                               ]
                           }
                       }
                   }
               };


               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       var expectedListRes = cardTestData.expectedResult.Body;

                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that if the role given in config is not present in the annotations, default role is considered");
                   });

               });
           });

           test("Axis Scaling new Vocabulary - DataScope",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_5_DataScope",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#DataScope",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_DefaultRole(No Roles Defined).xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                   {
                                       uid : "valueAxis",
                                       type : "Measure",
                                       values : "Sales Share"
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
                                   }
                               ]
                           }
                       }
                   }
               };


               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       var expectedListRes = cardTestData.expectedResult.Body;

                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that if the role given in config is not present in the annotations, default role is considered");
                   });

               });
           });

           test("Axis Scaling new Vocabulary - MinMax",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_5_MinMax",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#MinMax",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_DefaultRole(No Roles Defined).xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                   {
                                       uid : "valueAxis",
                                       type : "Measure",
                                       values : "Sales Share"
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
                                   }
                               ]
                           }
                       }
                   }
               };


               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       var expectedListRes = cardTestData.expectedResult.Body;

                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that if the role given in config is not present in the annotations, default role is considered");
                   });

               });
           });

           test("Analytical Chart - With Less Dimensions(Considering the role)",function(){

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
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_LessDimConsideringRole.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "error");
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);


                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_ERROR + VizAnnotationManager.errorMessages.MIN_FEEDS + "line" +
                       " " + VizAnnotationManager.errorMessages.FEEDS_OBTAINED + "0" + " " + VizAnnotationManager.errorMessages.FEEDS_REQUIRED + "1" +
                       " " + VizAnnotationManager.errorMessages.FEEDS), "Check if less/no dimensions given in the annotations, considering the role");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Default Role to be considered(Mix Case)",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_4",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                           "mFilterPreference": {}
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_DefaultRole.xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                   {
                                       uid : "valueAxis",
                                       type : "Measure",
                                       values : "Sales Share"
                                   },
                                   {
                                       uid : "valueAxis2",
                                       type : "Measure",
                                       values : "Total Sales"
                                   },
                                   {
                                       uid : "bubbleWidth",
                                       type : "Measure",
                                       values :"Sales"
                                   },
                                   {
                                       uid : "color",
                                       type : "Dimension",
                                       values :"Region"
                                   }
                               ]
                           }

                       }
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();

                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       var expectedListRes = cardTestData.expectedResult.Body;
                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that if the role given in config is not present in the annotations, default role is considered");
                   });
               });
           });

           test("Analytical Chart - Default Role to be considered(No roles defined)",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_5",
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
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_DefaultRole(No Roles Defined).xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                        {
                                            uid : "valueAxis",
                                            type : "Measure",
                                            values : "Sales Share"
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
                                        }
                                    ]
                           }
                       }
                   }
               };


               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       var expectedListRes = cardTestData.expectedResult.Body;

                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that if the role given in config is not present in the annotations, default role is considered");
                   });

               });
           });

           test("Analytical Chart - Exceeding Max Dimensions",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_6",
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
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_ExceedMaxDim.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "error");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_ERROR + "in " + "bubble" + VizAnnotationManager.errorMessages.CARD_MOST + "4" + " " + "dimension(s)"),
                               "Check if number of dimensions configured exceed max limit");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - With More Dimensions(Considering the role)",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_7",
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
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_ExceedMaxDimConsideringRole.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "error");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);


                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_ERROR + VizAnnotationManager.errorMessages.INVALID_REDUNDANT +
                               "dimension(s) Region. " + VizAnnotationManager.errorMessages.ALLOWED_ROLES + "bubble" + VizAnnotationManager.errorMessages.CHART_IS + "Category, Series"),
                               "Check if the number of dimensions configured exceed the max limit(considering the role) ");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Exceeding Max Measures",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_8",
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
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_ExceedMaxMeas.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "error");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);


                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_ERROR + "in " + "bubble" +
                       VizAnnotationManager.errorMessages.CARD_MOST + "3" + " " + "measure(s)"), "Check if number of measures exceed max limit");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Role to Feed Mapping",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_9",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_RoleToFeedMapping.xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                   {
                                       uid : "categoryAxis",
                                       type : "Dimension",
                                       values : "Product"
                                   },
                                   {
                                       uid : "color",
                                       type : "Dimension",
                                       values : "Region"
                                   },
                                   {
                                       uid : "valueAxis",
                                       type : "Measure",
                                       values :"Sales Share"
                                   }
                               ]
                           }

                       }
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                       var feeds = cardViz.getFeeds();

                       var cardCfg = cardTestData.card.settings;
                       var expectedListRes = cardTestData.expectedResult.Body;

                       // basic list XML structure tests
                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that the role to feed mapping is being done in the right way");
                   });

               });
           });


           test("Analytical Chart - Feeds Without Roles",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_10",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_FeedsWithNoRoles.xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                   {
                                       uid : "color",
                                       type : "Dimension",
                                       values : "Product"
                                   },
                                   {
                                       uid : "size",
                                       type : "Measure",
                                       values :"Sales Share"
                                   }
                               ]
                           }

                       }
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                       var feeds = cardViz.getFeeds();

                       var cardCfg = cardTestData.card.settings;
                       var expectedListRes = cardTestData.expectedResult.Body;

                       // basic list XML structure tests
                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that feeds without roles are being assigned correctly");
                   });
               });
           });

           test("Analytical Chart - For a feed with undefined role, all Dim/Meas must be considered",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_11",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_UndefinedRoles.xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                   {
                                       uid : "color",
                                       type : "Dimension",
                                       values : "Product,Region"
                                   },
                                   {
                                       uid : "size",
                                       type : "Measure",
                                       values :"Sales Share"
                                   }
                               ]
                           }

                       }
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                       var feeds = cardViz.getFeeds();

                       var cardCfg = cardTestData.card.settings;
                       var expectedListRes = cardTestData.expectedResult.Body;

                       // basic list XML structure tests
                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "If feed does not require a role, all dimensions are being considered for that feed.");
                   });
               });
           });

           test("Analytical Chart - Check for '|' operator functionality",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_12",
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
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_PipeOperator.xml"
                   },
                   expectedResult: {
                       Body: {
                           VizFrame: {
                               feeds : [
                                        {
                                            uid : "valueAxis",
                                            type : "Measure",
                                            values : "Sales Share"
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
                                            values :"Product"
                                        }
                                    ]
                           }
                       }
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                       var feeds = cardViz.getFeeds();

                       var cardCfg = cardTestData.card.settings;
                       var expectedListRes = cardTestData.expectedResult.Body;

                       // basic list XML structure tests
                       ok(chartTestUtils.genericFeedBinding(cardXml, cardViz, expectedListRes.VizFrame.feeds), "See that the '|' operator works right.");
                   });
               });
           });

           test("Analytical Chart - Test for MaxItems=0", function(){
               var cardTestData = {
                   card: {
                       "id": "chart_13",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Zero_MaxItems",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {
                   var errorSpy = sinon.spy(Log, "error");
                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       ok(cardViz.getParent() &&
                               cardViz.getParent().getBinding("data") &&
                               cardViz.getParent().getBinding("data").getPath() === "",
                               "Check correct data binding");
                       var expectedLog = "OVP-AC: Analytic card Error: maxItems is configured as 0";
                       ok(errorSpy.calledWith(expectedLog), "Check correct error message is logged.");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Test for MaxItems=abcd", function(){
               var cardTestData = {
                   card: {
                       "id": "chart_14",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_CtryCurr",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#abcd_MaxItems",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {
                   var errorSpy = sinon.spy(Log, "error");
                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");
                       ok(cardViz.getParent() &&
                               cardViz.getParent().getBinding("data") &&
                               cardViz.getParent().getBinding("data").getPath() === "",
                               "Check correct data binding");
                       var expectedLog = "OVP-AC: Analytic card Error: maxItems is Invalid. Please enter an Integer.";
                       ok(errorSpy.calledWith(expectedLog), "Check correct error message is logged.");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Test for Hiding Axis Title on header", function(){
        	   var cardTestData = {
                       card: {
                           "id": "chart_15",
                           "model": "salesShare",
                           "template": "sap.ovp.cards.charts.analytical",
                           "settings": {
                               "entitySet": "SalesShare",
                               "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country",
                               "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Country",
                               "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Country",
                               "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country",
                               "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Country"
                           }
                       },
                       dataSource: {
                           baseUrl: chartTestUtils.odataBaseUrl,
                           rootUri: chartTestUtils.odataRootUrl,
                           annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_RoleToFeedMapping.xml"
                       },
                       expectedResult: {
                           Body: {
                               VizFrame: {
                                   feeds : [
                                       {
                                           uid : "categoryAxis",
                                           type : "Dimension",
                                           values : "Product"
                                       },
                                       {
                                           uid : "color",
                                           type : "Dimension",
                                           values : "Region"
                                       },
                                       {
                                           uid : "valueAxis",
                                           type : "Measure",
                                           values :"Sales Share"
                                       }
                                   ]
                               }

                           }
                       }
                   };

                   var oModel = cardTestUtils.createCardModel(cardTestData);
                   stop();
                   oModel.getMetaModel().loaded().then(function () {

                       var oView = cardTestUtils.createCardView(cardTestData, oModel);

                       oView.loaded().then(function (oView) {
                           //start the async test
                           start();
                           var cardViz = oView.byId("analyticalChart");
                           var cardXml = oView._xContent;
                           ok(cardViz !== undefined, "Existence check to VizFrame");
                           ok(cardXml !== undefined, "Existence check to XML parsing");
                           var chartTitle = oView.byId("ovpCT");
                           var handler = cardViz.getParent();
                           sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                           var vizProperties = cardViz.getVizProperties();
                           ok(vizProperties.categoryAxis.title.visible == false &&
                           vizProperties.valueAxis.title.visible == false, "Test Axis title visibility");
                       });
                   });
               });

           test("Analytical Chart - Semantic color with two measures",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_16",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Column_sem_twodatapoints",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "warning");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.INVALID_SEMANTIC_MEASURES),
                               "Check if more than one measure is being semantically coloured");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Semantic color with two measures and one datapoint",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_17",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Column_sem_twomeasuresonedatapoint",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "warning");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.INVALID_SEMANTIC_MEASURES),
                               "Check if more than one measure is being semantically coloured");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Semantic color without improvement direction",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_18",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Column_sem_onemeasure",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "warning");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.INVALID_IMPROVEMENT_DIR),
                               "Check if improvement directon is present/valid");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Semantic color without criticality values",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_19",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Column_sem_onedatapoint",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "warning");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.INVALID_CRITICALITY),
                               "Check if criticality values are present/valid");
                       errorSpy.restore();
                   });
               });
           });

           test("Analytical Chart - Semantic pattern with more than 1 dimension",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_20",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Column",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_ExceedMaxDim.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "warning");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.INVALID_DIMMEAS),
                               "Check if more than one dimension is given for semantic patterns");
                       errorSpy.restore();
                   });
               });
           });

            test("Analytical Chart - Semantic pattern with more than 1 measure (Line and Column chart)",function(){

               var cardTestData = {
                   card: {
                       "id": "chart_21",
                       "model": "salesShare",
                       "template": "sap.ovp.cards.charts.analytical",
                       "settings": {
                           "entitySet": "SalesShare",
                           "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                           "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_semanticpattern",
                           "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                           "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                           "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                       }
                   },
                   dataSource: {
                       baseUrl: chartTestUtils.odataBaseUrl,
                       rootUri: chartTestUtils.odataRootUrl,
                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations_ExceedMaxMeas.xml"
                   }
               };

               var oModel = cardTestUtils.createCardModel(cardTestData);
               stop();
               oModel.getMetaModel().loaded().then(function () {

                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

                   oView.loaded().then(function (oView) {
                       //start the async test
                       start();
                       var cardViz = oView.byId("analyticalChart");
                       var cardXml = oView._xContent;
                       ok(cardViz !== undefined, "Existence check to VizFrame");
                       ok(cardXml !== undefined, "Existence check to XML parsing");

                       var errorSpy = sinon.spy(Log, "warning");
                       var chartTitle = oView.byId("ovpCT");
                       var handler = cardViz.getParent();
                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                       ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.INVALID_DIMMEAS),
                               "Check if more than one measure is given for semantic patterns");
                       errorSpy.restore();
                   });
               });
           });

            test("Analytical Chart - Forecast measure check",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_22",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_SemanticPattern",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var errorSpy = sinon.spy(Log, "warning");
                        var chartTitle = oView.byId("ovpCT");
                        var handler = cardViz.getParent();
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                        ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.INVALID_FORECAST),
                                "Check if forecast measure is given for semantic patterns");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Empty Sort Order in Presentation Variant",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_23",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_SemanticPattern",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr_Empty_Sort_Order",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(Log, "warning");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        ok(errorSpy.calledWith(VizAnnotationManager.errorMessages.CARD_WARNING + VizAnnotationManager.errorMessages.SORTORDER_WARNING), "Check if sort order warning is thrown");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Sort Order Property Check",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_24",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_SemanticPattern",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr_SortOrder_Descending_Undefined",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr",
                            "mFilterPreference": {}
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(VizAnnotationManager, "formatItems");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var expectedReturnValue = "{path: '/SalesShare', filters: [{\"path\":\"Country\",\"operator\":\"EQ\",\"value1\":\"IN\",\"sign\":\"I\"},{\"path\":\"Country\",\"operator\":\"EQ\",\"value1\":\"US\",\"sign\":\"I\"},{\"path\":\"Currency\",\"operator\":\"EQ\",\"value1\":\"EUR\",\"sign\":\"I\"}], sorter: [{path: 'Sales',descending: true}], parameters: {select:'SupplierCompany,SalesShare,TotalSales,TotalSales_CURRENCY,Sales', custom: {cardId: 'chart_24'}}}";
                        ok(errorSpy.returned(expectedReturnValue), "Check if default sorting is descending if not provided");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Check if 'com.sap.vocabularies.Common.v1.Text' annotation is being considered for dimensions",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_25",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_v4TestDimension",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(VizAnnotationManager, "formatItems");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var expectedReturnValue = "{path: '/SalesShare', parameters: {select:'DimensionOnlyForTest,ProductId,SalesShare,TotalSales,TotalSales_CURRENCY'}}";
                        ok(errorSpy.returned(expectedReturnValue), "Check text annotation is being considered for dimensions");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Check if 'com.sap.vocabularies.Common.v1.Text' annotation is being considered for measures",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_26",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_v4TestMeasure",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(VizAnnotationManager, "formatItems");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var expectedReturnValue = "{path: '/SalesShare', parameters: {select:'Product,SalesShare,MeasureOnlyForTest,TotalSales,TotalSales_CURRENCY'}}";
                        ok(errorSpy.returned(expectedReturnValue), "Check text annotation is being considered for measures");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Check if 'Org.OData.Measures.V1.Unit' annotation is being considered for measures",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_27",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_v4TestUnit",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(VizAnnotationManager, "formatItems");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var expectedReturnValue = "{path: '/SalesShare', parameters: {select:'Product,SalesShare,WeightMeasure,WeightUnit'}}";
                        ok(errorSpy.returned(expectedReturnValue), "Check unit annotation is being considered for measures");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Forecast measure check",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_28",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Test_Forecast",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var errorSpy = sinon.spy(Log, "warning");
                        var chartTitle = oView.byId("ovpCT");
                        var handler = cardViz.getParent();
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);

                        ok(cardViz.getDataset().getMeasures()[2].getName() == "Sales", "Check if forecast measure is being considered");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Hide DateTimeAxis",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_29",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Test_DateTimeAxis",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var chartTitle = oView.byId("ovpCT");
                        var handler = cardViz.getParent();
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                        sap.ovp.cards.charts.VizAnnotationManager.hideDateTimeAxis(cardViz);

                        ok(cardViz.getVizProperties()["categoryAxis"].title.visible == false, "Check hideDateTime Functionality ");

                    });
                });
            });


            test("Analytical Chart - Hide DateTimeAxis with chartType = donut",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_29a",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_CtryCurr",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency",
                            "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_CtryCurr",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr",
                            "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var chartTitle = oView.byId("ovpCT");
                        var handler = cardViz.getParent();
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                        var actualReturn = sap.ovp.cards.charts.VizAnnotationManager.hideDateTimeAxis(cardViz);
                        var expectedReturn = undefined;

                        ok((actualReturn === expectedReturn && cardViz.getVizProperties()["categoryAxis"].title === undefined), "Check hideDateTime Functionality ");

                    });
                });
            });

            test("Analytical Chart - Hide DateTimeAxis with entitySet = undefined",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_29b",
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
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var chartTitle = oView.byId("ovpCT");
                        var handler = cardViz.getParent();
                        sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                        cardViz.getModel('ovpCardProperties').getData().entitySet = undefined;
                        var actualReturn = sap.ovp.cards.charts.VizAnnotationManager.hideDateTimeAxis(cardViz);
                        var expectedReturn = undefined;

                        ok((actualReturn === expectedReturn), "Check hideDateTime Functionality ");

                    });
                });
            });

            test("Analytical Chart - SelectOptions Between Operator",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_30",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#DateBetween",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_SemanticPattern",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(VizAnnotationManager, "formatItems");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        /* var expectedResult = { expectedReturn : {
                                ret : /\{.*"value2":*"Jan 31, 2010".*\}/
                            }
                        }; */
                        var expectedResult = "{path: '/SalesShare', filters: [{\"path\":\"Date\",\"operator\":\"BT\",\"value1\":\"Jan 1, 2010\",\"value2\":\"Jan 31, 2010\",\"sign\":\"I\"}], parameters: {select:'SupplierCompany,SalesShare,TotalSales,TotalSales_CURRENCY'}}";
                        ok(errorSpy.returned(expectedResult), "Check if selectOptions  value high is present");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Check if 'com.sap.vocabularies.Common.v1.Text' annotation with string is being considered for dimensions",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_31",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_v4TestDimensionString",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(VizAnnotationManager, "formatItems");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var expectedReturnValue = "{path: '/SalesShare', parameters: {select:'DimensionOnlyForTestString,ProductId,SalesShare,TotalSales,TotalSales_CURRENCY'}}";
                        ok(errorSpy.returned(expectedReturnValue), "Check text annotation with string is being considered for dimensions");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - Check if 'com.sap.vocabularies.Common.v1.Text' annotation with string is being considered for measures",function(){

                var cardTestData = {
                    card: {
                        "id": "chart_33",
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "entitySet": "SalesShare",
                            "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_v4TestMeasureString",
                            "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_CtryCurr"
                        }
                    },
                    dataSource: {
                        baseUrl: chartTestUtils.odataBaseUrl,
                        rootUri: chartTestUtils.odataRootUrl,
                        annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                    }
                };

                var oModel = cardTestUtils.createCardModel(cardTestData);
                var errorSpy = sinon.spy(VizAnnotationManager, "formatItems");
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = cardTestUtils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();
                        var cardViz = oView.byId("analyticalChart");
                        var cardXml = oView._xContent;
                        ok(cardViz !== undefined, "Existence check to VizFrame");
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var expectedReturnValue = "{path: '/SalesShare', parameters: {select:'Product,SalesShare,MeasureOnlyForTestString,TotalSales,TotalSales_CURRENCY'}}";
                        ok(errorSpy.returned(expectedReturnValue), "Check text annotation with string is being considered for measures");
                        errorSpy.restore();
                    });
                });
            });

            test("Analytical Chart - FormatByType() functionality when oMetadata is undefined",function(){

                var oMetadata = undefined;
                var sProp = "Sales";
                var sVal = "100000";

                var expectedReturnValue = "100000";
                var actualReturnValue = VizAnnotationManager.formatByType(oMetadata, sProp, sVal);

                ok((expectedReturnValue === actualReturnValue), "FormatByType returns sVal when oMetadata is undefined");
            });

            test("Analytical Chart - FormatByType() functionality for Numeric Values",function(){

				var oMetadata = {
						Sales : {
							"name" : "Sales",
							"type" : "Edm.Decimal",
							"precision" : "34",
							"extensions" : [
									{
										"name" : "filterable",
										"value" : "false",
										"namespace" : "http://www.sap.com/Protocols/SAPData"
									},
									{
										"name" : "label",
										"value" : "Sales",
										"namespace" : "http://www.sap.com/Protocols/SAPData"
									},
									{
										"name" : "aggregation-role",
										"value" : "measure",
										"namespace" : "http://www.sap.com/Protocols/SAPData"
									},
									{
										"name" : "unit",
										"value" : "Sales_CURRENCY",
										"namespace" : "http://www.sap.com/Protocols/SAPData"
									} ],
							"sap:filterable" : "false",
							"sap:label" : "Sales",
							"com.sap.vocabularies.Common.v1.Label" : {
								"String" : "Sales"
							},
							"sap:aggregation-role" : "measure",
							"com.sap.vocabularies.Analytics.v1.Measure" : {
								"Bool" : "true"
							},
							"sap:unit" : "Sales_CURRENCY",
							"Org.OData.Measures.V1.ISOCurrency" : {
								"Path" : "Sales_CURRENCY"
							}
						}
				};
				var sProp = "Sales";
				var sVal = "100000";

				var expectedReturnValue = Number("100000");
				var actualReturnValue = VizAnnotationManager.formatByType(oMetadata, sProp, sVal);

				ok((expectedReturnValue === actualReturnValue),
						"FormatByType returns sVal when oMetadata is undefined");
			});

			test("Analytical Chart - formatItems() functionality",function(){

				var oEntitySet = {
									"name" : "SalesShareDonut",
									"entityType" : "sap.smartbusinessdemo.services.SalesShareDonutType",
									"Org.OData.Capabilities.V1.FilterRestrictions" : {
										"NonFilterableProperties" : [
												{
													"PropertyPath" : "ID"
												},
												{
													"PropertyPath" : "TotalSales"
												},
												{
													"PropertyPath" : "TotalSalesForecast"
												},
												{
													"PropertyPath" : "OverallSales"
												} ]
									}
								};


				var oPresentationVariant = {
									"MaxItems" : {
										"Int" : "5"
									},
									"GroupBy" : [ {
										"PropertyPath" : "Country"
									}, {
										"PropertyPath" : "Currency"
									} ],
									"SortOrder" : [

									],
									"Visualizations" : [ {
										"AnnotationPath" : "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency"
									} ]
								};
				var chartType = {"EnumMember":"com.sap.vocabularies.UI.v1.ChartType/Donut"};
				var actualReturn = VizAnnotationManager.formatItems(undefined, oEntitySet, undefined, oPresentationVariant, undefined, undefined, chartType);
				var expectedReturn = "{}";
				//VizAnnotationManager.formatChartAxes.customFormatter.format(4150, "CURR/-1/");
				ok((expectedReturn === actualReturn), "formatItems function returns {} when there's no iContext");

			});

			test("Analytical Chart - Chart Axes formatting - Currency (minFractionDigits = -1)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "4.2K";

				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(4150, "CURR/-1/");
				ok((expectedResult === actualResult), "Check for currency formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Currency (minFractionDigits = 3)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "10.000M";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(10000000, "CURR/3/");
				ok((expectedResult === actualResult), "Check for Currency formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Date (MMM d)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "Jan 5";
				var oDate = new Date("January 05, 2010 05:30:00");
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(oDate, "MMM d");
				ok((expectedResult === actualResult), "Check for date formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Date (d)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "5";
				var oDate = new Date("January 05, 2010 05:30:00");
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(oDate, "d");
				ok((expectedResult === actualResult), "Check for date formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Date (YearMonthDay)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "Jan 15, 2010";
				var oDate = new Date("January 15, 2010 05:30:00");
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(oDate, "YearMonthDay");
				ok((expectedResult === actualResult), "Check for date formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Date (MMM)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "Jan";
				var oDate = new Date("January 15, 2010 05:30:00");
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(oDate, "MMM");
				ok((expectedResult === actualResult), "Check for date formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Axis (minFractionDigits = -1)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "100K";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(100000, "axisFormatter/-1/");
				ok((expectedResult === actualResult), "Check for number formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Axis (minFractionDigits = 4)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "0.0010";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(0.001, "axisFormatter/4/");
				ok((expectedResult === actualResult), "Check for number formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Axis (minFractionDigits = 4)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "0.0010";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(0.001, "ShortFloat/4/");
				ok((expectedResult === actualResult), "Check for number formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Percentage",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "35.9%";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(0.3593478363012733, "0.0%/1/");
				ok((expectedResult === actualResult), "Check for percentage formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Percentage (minFractionDigits = -1)",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "28.0%";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(0.2795658506789456, "0.0%/-1/");
				ok((expectedResult === actualResult), "Check for percentage formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Tooltip",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "7,685.00";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(7685, "tooltipNoScaleFormatter");
				ok((expectedResult === actualResult), "Check for percentage formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Tooltip ( minFractionDigits = -1 )",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "7,685";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(7685, "tooltipNoScaleFormatter/-1/");
				ok((expectedResult === actualResult), "Check for percentage formatting");

			});

			test("Analytical Chart - Chart Axes formatting - Tooltip ( minFractionDigits = -1, ShortRef = 0 )",function(){

				//jQuery.sap.require("NumberFormat");
				//jQuery.sap.require("library");
				VizAnnotationManager.formatChartAxes();
				var expectedResult = "7,685";
				var vizFormatter = sap.viz.api.env.Format.numericFormatter();
				var actualResult = vizFormatter.format(7685, "tooltipNoScaleFormatter/-1/a");
				ok((expectedResult === actualResult), "Check for percentage formatting");

			});

			test("Analytical Chart - checkExists() functionality - bMandatory = true",function(){

				var errorSpy = sinon.spy(Log, "error");
				var term = undefined;
				var annotation = {};
				var type = "Selection Variant";
				var bMandatory = true;
				var logViewId = "[card004Original]";
				var contentFragment = undefined;
				VizAnnotationManager.checkExists(term, annotation, type, bMandatory, logViewId, contentFragment);

				ok(errorSpy.calledWith("[card004Original]OVP-AC: Analytic card Error: Selection Variantis mandatory."), "checkExists() throws error if bMandatory = true");
				errorSpy.restore();

			});

			test("Analytical Chart - checkExists() functionality",function(){

				var term = undefined;
				var annotation = {};
				var type = "Selection Variant";
				var bMandatory = false;
				var logViewId = "[card004Original]";
				var contentFragment = undefined;
				var expectedReturn = true;
				var actualReturn = VizAnnotationManager.checkExists(term, annotation, type, bMandatory, logViewId, contentFragment);

				ok(expectedReturn === actualReturn, "checkExists() throws error if !term");

			});


			test("Analytical Chart - checkExists() functionality - No annoTerm",function(){

				var errorSpy = sinon.spy(Log, "error");
				var term = "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_1";
				var annotation = {};
				var type = "Selection Variant";
				var bMandatory = true;
				var logViewId = "[card004Original]";
				var contentFragment = undefined;
				VizAnnotationManager.checkExists(term, annotation, type, bMandatory, logViewId, contentFragment);

				ok(errorSpy.calledWith("[card004Original]OVP-AC: Analytic card Error: in Selection Variant. (com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_1 is not found or not well formed)"), "checkExists() throws error if bMandatory = true");
				errorSpy.restore();

			});

			test("Analytical Chart - validateCardConfiguration() functionality - oController is undefined",function(){

				var errorSpy = sinon.spy(Log, "error");
				var oController = undefined;
				var actualReturn = VizAnnotationManager.validateCardConfiguration(oController);
				var expectedReturn = false;

				ok(expectedReturn === actualReturn, "validateCardConfiguration() returns false if oController is undefined");
				errorSpy.restore();

			});

			test("Analytical Chart - validateCardConfiguration() functionality - No card properties",function(){

				var errorSpy = sinon.spy(Log, "error");
				var oController = {getView : function() {}, getCardPropertiesModel: function(){}};
				VizAnnotationManager.validateCardConfiguration(oController);

				ok(errorSpy.calledWith("OVP-AC: Analytic card Error: in card configuration.Could not obtain Cards model."), "validateCardConfiguration() throws error if no card properties");
				errorSpy.restore();

			});

			test("Analytical Chart - validateCardConfiguration() functionality - No entityType",function(){

				var errorSpy = sinon.spy(Log, "error");
				var oController = {getView : function() {}, getCardPropertiesModel: function(){return {getProperty: function(x){return undefined;}};}};
				VizAnnotationManager.validateCardConfiguration(oController);

				ok(errorSpy.calledWith("OVP-AC: Analytic card Error: in card annotation."), "validateCardConfiguration() throws error if there's no entityType");
				errorSpy.restore();

			});

			test("Analytical Chart - getConfig() functionality - No enum in chart type",function(){

				var errorSpy = sinon.spy(Log, "error");

				var actualReturn = VizAnnotationManager.getConfig("Dummy");

				ok(errorSpy.calledWith("OVP-AC: Analytic card Error: Invalid ChartType given for com.sap.vocabularies.UI.v1 annotation."), "getConfig() throws error if there's no enum in chart type");
				errorSpy.restore();

			});

			test("Analytical Chart - getConfig() functionality - Wrong chart type",function(){

				var errorSpy = sinon.spy(Log, "error");
				var oChartType = {EnumMember : "com.sap.vocabularies.UI.v1.ChartType/Dummy"};
				VizAnnotationManager.getConfig(oChartType);

				ok(errorSpy.calledWith("No valid configuration given for Dummy in config.json"), "getConfig() throws error if wrong chart type is provided");
				errorSpy.restore();

			});

			 test("Analytical Chart - getConfig() functionality - Return Reference chart config",function(){

				var oChartType = {EnumMember : "com.sap.vocabularies.UI.v1.ChartType/vertical_bullet"};
				var actualResultObject = VizAnnotationManager.getConfig(oChartType);

				var expectedResult = {
                                        "default": {
                                            "type": "vertical_bullet",
                                            "properties": {
                                                "semanticPattern": true
                                            },
                                            "dimensions": {
                                                "min": 1,
                                                "defaultRole": "Category"
                                            },
                                            "measures": {
                                                "min": 1,
                                                "defaultRole": "Axis1"
                                            },
                                            "resize":{
                                                "dataStep": 10
                                            },
                                            "feeds": [{
                                                "uid": "actualValues",
                                                "min": 1,
                                                "type": "measure",
                                                "role": "Axis1"
                                            }, {
                                                "uid": "targetValues",
                                                "type": "measure",
                                                "role": "Axis2"
                                            }, {
                                                "min": 1,
                                                "uid": "categoryAxis",
                                                "type": "dimension",
                                            }]
                                        },
                                        "time": {
                                            "type": "timeseries_bullet",
                                            "dimensions": {
                                                "min": 1,
                                                "defaultRole": "Category"
                                            },
                                            "measures": {
                                                "min": 1,
                                                "defaultRole": "Axis1"
                                            },
                                            "resize":{
                                                "dataStep": 10
                                            },
                                            "feeds":  [
                                            {
                                                "uid": "actualValues",
                                                "min": 1,
                                                "type": "measure",
                                                "role": "Axis1",
                                                "vizProperties":[{"path":"valueAxis.layout.maxWidth", "value" : 0.4}]
                                            }, {
                                                "uid": "targetValues",
                                                "type": "measure",
                                                "role": "Axis2"
                                            }, {
                                                "uid": "timeAxis",
                                                "min": 1,
                                                "max": 1,
                                                "type": "dimension",
                                                "role": "Category"
                                            }, {
                                                "uid": "color",
                                                "min" : 0,
                                                "type": "dimension",
                                                "role": "Series"
                                            }]
                                        }
                };

                // Remove unwanted properties from the actual result
                actualResultObject['default'].feeds.forEach(function(e) {
                    delete e['entityTypeObject'];
                });

                propEqual(actualResultObject, expectedResult);

			});

			test("Analytical Chart - hasTimeSemantics() returns false if no propertyPath",function(){

				var aDimensions = [{
									"Dimension" : {

									},
									"Role" : {
										"EnumMember" : "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
									},
									"RecordType" : "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType"
								}];
				var config = {time : {type: "timeseries_line"}};
				var actualReturn = VizAnnotationManager.hasTimeSemantics(aDimensions, config);
				var expectedReturn = false;

				ok(actualReturn === expectedReturn, "Check if hasTimeSemantics() returns false if no propertyPath");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Decimal",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Decimal:"80000.00"});
				var expectedReturn = 80000;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - String",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({String:"80000"});
				var expectedReturn = "80000";
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Int",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Int:"80000"});
				var expectedReturn = 80000;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Int for Legend",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Int:"80000"}, true);
				var expectedReturn = "80.00K";
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Double",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Double:"80000.00"});
				var expectedReturn = 80000;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Single",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Single:"80000"});
				var expectedReturn = 80000;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Boolean True",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Boolean:"True"});
				var expectedReturn = true;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Boolean False",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Boolean:"False"});
				var expectedReturn = false;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Bool True",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Bool:"True"});
				var expectedReturn = true;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - getPrimitiveValue() functionality - Bool False",function(){

				var actualReturn = VizAnnotationManager.getPrimitiveValue({Bool:"False"});
				var expectedReturn = false;
				ok(actualReturn === expectedReturn, "Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - formThePathForCriticalityStateCalculation() functionality",function(){

				var iContext = {
									"measureNames" : "Sales",
									"_context_row_number" : 0,
									"Country" : "ZA",
									"Country.d" : "ZA",
									"Sales" : 81035.16
								};
				var oDataPoint = {
						"Value":{
							"Path":"Sales",
							"EdmType":"Edm.Decimal"
							},
							"CriticalityCalculation":{
								"ImprovementDirection":{
									"EnumMember":"com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
							},
								"ToleranceRangeHighValue":{
									"Decimal":"70000.000"
								},
								"DeviationRangeHighValue":{
									"Decimal":"80000.000"
								}
							},
							"RecordType":"com.sap.vocabularies.UI.v1.DataPointType"
							};
				var actualReturn = VizAnnotationManager.formThePathForCriticalityStateCalculation(iContext, oDataPoint);
				var expectedReturn = "Error";
				ok(actualReturn === expectedReturn,"Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - formThePathForCriticalityStateCalculation() functionality - Path",function(){

				var iContext = {
									"measureNames" : "Sales",
									"_context_row_number" : 0,
									"Country" : "ZA",
									"Country.d" : "ZA",
									"Sales" : 81035.16
								};
				var oDataPoint = {
						"Value":{
							"Path":"Sales",
							"EdmType":"Edm.Decimal"
							},
							"CriticalityCalculation":{
								"ImprovementDirection":{
									"EnumMember":"com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
							},
								"ToleranceRangeHighValue":{
									"Path":"Sales"
								},
								"DeviationRangeHighValue":{
									"Decimal":"80000.000"
								}
							},
							"RecordType":"com.sap.vocabularies.UI.v1.DataPointType"
							};
				var actualReturn = VizAnnotationManager.formThePathForCriticalityStateCalculation(iContext, oDataPoint);
				var expectedReturn = "Error";
				ok(actualReturn === expectedReturn,"Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - formThePathForCriticalityStateCalculation() functionality - Criticality",function(){

				var iContext = {
									"measureNames" : "Sales",
									"_context_row_number" : 0,
									"Country" : "ZA",
									"Country.d" : "ZA",
									"Sales" : 81035.16
								};
				var oDataPoint = {
						"Value":{
							"Path":"Sales",
							"EdmType":"Edm.Decimal"
							},
							"Criticality":{
									"EnumMember":"com.sap.vocabularies.UI.v1.CriticalityType/Positive"
							},
							"RecordType":"com.sap.vocabularies.UI.v1.DataPointType"
							};
				var actualReturn = VizAnnotationManager.formThePathForCriticalityStateCalculation(iContext, oDataPoint);
				var expectedReturn = "Positive";
				ok(actualReturn === expectedReturn,"Check if getPrimitiveValue() returns expected value");

			});

			test("Analytical Chart - checkFlag() functionality - Minimize",function(){

				var aMeasures = [{"Measure":{"PropertyPath":"Sales"},"DataPoint":{"AnnotationPath":"@com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin"},"Role":{"EnumMember":"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"},"RecordType":"com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"}];
				var entityTypeObject = { "name":"SalesShareColumnSemanticType", "key":{ "propertyRef":[ { "name":"ID" } ] }, "property":[ { "name":"ID", "type":"Edm.String", "nullable":"false", "maxLength":"2147483647", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false" }, { "name":"Country", "type":"Edm.String", "maxLength":"3", "extensions":[ { "name":"label", "value":"Country", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Country", "com.sap.vocabularies.Common.v1.Label":{ "String":"Country" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Region", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Region", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Region", "com.sap.vocabularies.Common.v1.Label":{ "String":"Region" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"ProductID", "type":"Edm.String", "maxLength":"10", "extensions":[ { "name":"label", "value":"Product ID", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"text", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product ID", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product ID" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" }, "sap:text":"Product", "com.sap.vocabularies.Common.v1.Text":{ "Path":"Product" } }, { "name":"Currency", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"label", "value":"Currency", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Currency", "com.sap.vocabularies.Common.v1.Label":{ "String":"Currency" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Product", "type":"Edm.String", "maxLength":"1024", "extensions":[ { "name":"label", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"SupplierCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Supplier Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Supplier Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Supplier Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"BuyerCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Buyer Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Buyer Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Buyer Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Date", "type":"Edm.DateTime", "extensions":[ { "name":"display-format", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:display-format":"Date", "sap:label":"Date", "com.sap.vocabularies.Common.v1.Label":{ "String":"Date" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Month", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Month", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Month", "com.sap.vocabularies.Common.v1.Label":{ "String":"Month" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Quarter", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Quarter", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Quarter", "com.sap.vocabularies.Common.v1.Label":{ "String":"Quarter" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Year", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Year", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Year", "com.sap.vocabularies.Common.v1.Label":{ "String":"Year" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"TotalSales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"Sales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"TotalSales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Total Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"TotalSales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Total Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Total Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"TotalSales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"TotalSales_CURRENCY" } }, { "name":"Sales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"Sales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"Sales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"Sales_CURRENCY" } }, { "name":"SalesShare", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales Share", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales Share", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales Share" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" } } ], "extensions":[ { "name":"semantics", "value":"aggregate", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"aggregate", "namespace":"sap.smartbusinessdemo.services", "$path":"/dataServices/schema/0/entityType/13", "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country":{ "SelectOptions":[ ] }, "com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin":{ "Value":{ "Path":"Sales", "EdmType":"Edm.Decimal" }, "CriticalityCalculation":{ "ImprovementDirection":{ "EnumMember":"com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" }, "ToleranceRangeHighValue":{ "Decimal":"70000.000" }, "DeviationRangeHighValue":{ "Decimal":"80000.000" } }, "RecordType":"com.sap.vocabularies.UI.v1.DataPointType" } };
				var actualReturn = VizAnnotationManager.checkFlag(aMeasures, entityTypeObject);
				var expectedReturn = true;
				ok(actualReturn === expectedReturn, "Check if checkFlag() returns expected value");

			});

			test("Analytical Chart - checkFlag() functionality - Maximize Error",function(){

				var aMeasures = [{"Measure":{"PropertyPath":"Sales"},"DataPoint":{"AnnotationPath":"@com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin"},"Role":{"EnumMember":"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"},"RecordType":"com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"}];
				var entityTypeObject = { "name":"SalesShareColumnSemanticType", "key":{ "propertyRef":[ { "name":"ID" } ] }, "property":[ { "name":"ID", "type":"Edm.String", "nullable":"false", "maxLength":"2147483647", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false" }, { "name":"Country", "type":"Edm.String", "maxLength":"3", "extensions":[ { "name":"label", "value":"Country", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Country", "com.sap.vocabularies.Common.v1.Label":{ "String":"Country" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Region", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Region", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Region", "com.sap.vocabularies.Common.v1.Label":{ "String":"Region" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"ProductID", "type":"Edm.String", "maxLength":"10", "extensions":[ { "name":"label", "value":"Product ID", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"text", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product ID", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product ID" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" }, "sap:text":"Product", "com.sap.vocabularies.Common.v1.Text":{ "Path":"Product" } }, { "name":"Currency", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"label", "value":"Currency", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Currency", "com.sap.vocabularies.Common.v1.Label":{ "String":"Currency" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Product", "type":"Edm.String", "maxLength":"1024", "extensions":[ { "name":"label", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"SupplierCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Supplier Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Supplier Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Supplier Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"BuyerCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Buyer Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Buyer Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Buyer Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Date", "type":"Edm.DateTime", "extensions":[ { "name":"display-format", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:display-format":"Date", "sap:label":"Date", "com.sap.vocabularies.Common.v1.Label":{ "String":"Date" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Month", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Month", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Month", "com.sap.vocabularies.Common.v1.Label":{ "String":"Month" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Quarter", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Quarter", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Quarter", "com.sap.vocabularies.Common.v1.Label":{ "String":"Quarter" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Year", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Year", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Year", "com.sap.vocabularies.Common.v1.Label":{ "String":"Year" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"TotalSales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"Sales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"TotalSales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Total Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"TotalSales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Total Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Total Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"TotalSales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"TotalSales_CURRENCY" } }, { "name":"Sales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"Sales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"Sales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"Sales_CURRENCY" } }, { "name":"SalesShare", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales Share", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales Share", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales Share" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" } } ], "extensions":[ { "name":"semantics", "value":"aggregate", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"aggregate", "namespace":"sap.smartbusinessdemo.services", "$path":"/dataServices/schema/0/entityType/13", "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country":{ "SelectOptions":[ ] }, "com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin":{ "Value":{ "Path":"Sales", "EdmType":"Edm.Decimal" }, "CriticalityCalculation":{ "ImprovementDirection":{ "EnumMember":"com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" }, "ToleranceRangeHighValue":{ "Decimal":"70000.000" }, "DeviationRangeHighValue":{ "Decimal":"80000.000" } }, "RecordType":"com.sap.vocabularies.UI.v1.DataPointType" } };
				var actualReturn = VizAnnotationManager.checkFlag(aMeasures, entityTypeObject);
				var expectedReturn = false;
				ok(actualReturn === expectedReturn, "Check if checkFlag() returns expected value");

			});

			test("Analytical Chart - checkFlag() functionality - Maximize",function(){

				var aMeasures = [{"Measure":{"PropertyPath":"Sales"},"DataPoint":{"AnnotationPath":"@com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin"},"Role":{"EnumMember":"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"},"RecordType":"com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"}];
				var entityTypeObject = { "name":"SalesShareColumnSemanticType", "key":{ "propertyRef":[ { "name":"ID" } ] }, "property":[ { "name":"ID", "type":"Edm.String", "nullable":"false", "maxLength":"2147483647", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false" }, { "name":"Country", "type":"Edm.String", "maxLength":"3", "extensions":[ { "name":"label", "value":"Country", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Country", "com.sap.vocabularies.Common.v1.Label":{ "String":"Country" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Region", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Region", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Region", "com.sap.vocabularies.Common.v1.Label":{ "String":"Region" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"ProductID", "type":"Edm.String", "maxLength":"10", "extensions":[ { "name":"label", "value":"Product ID", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"text", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product ID", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product ID" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" }, "sap:text":"Product", "com.sap.vocabularies.Common.v1.Text":{ "Path":"Product" } }, { "name":"Currency", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"label", "value":"Currency", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Currency", "com.sap.vocabularies.Common.v1.Label":{ "String":"Currency" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Product", "type":"Edm.String", "maxLength":"1024", "extensions":[ { "name":"label", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"SupplierCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Supplier Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Supplier Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Supplier Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"BuyerCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Buyer Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Buyer Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Buyer Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Date", "type":"Edm.DateTime", "extensions":[ { "name":"display-format", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:display-format":"Date", "sap:label":"Date", "com.sap.vocabularies.Common.v1.Label":{ "String":"Date" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Month", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Month", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Month", "com.sap.vocabularies.Common.v1.Label":{ "String":"Month" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Quarter", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Quarter", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Quarter", "com.sap.vocabularies.Common.v1.Label":{ "String":"Quarter" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Year", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Year", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Year", "com.sap.vocabularies.Common.v1.Label":{ "String":"Year" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"TotalSales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"Sales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"TotalSales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Total Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"TotalSales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Total Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Total Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"TotalSales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"TotalSales_CURRENCY" } }, { "name":"Sales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"Sales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"Sales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"Sales_CURRENCY" } }, { "name":"SalesShare", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales Share", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales Share", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales Share" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" } } ], "extensions":[ { "name":"semantics", "value":"aggregate", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"aggregate", "namespace":"sap.smartbusinessdemo.services", "$path":"/dataServices/schema/0/entityType/13", "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country":{ "SelectOptions":[ ] }, "com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin":{ "Value":{ "Path":"Sales", "EdmType":"Edm.Decimal" }, "CriticalityCalculation":{ "ImprovementDirection":{ "EnumMember":"com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" }, "ToleranceRangeLowValue":{ "Decimal":"70000.000" }, "DeviationRangeLowValue":{ "Decimal":"80000.000" } }, "RecordType":"com.sap.vocabularies.UI.v1.DataPointType" } };
				var actualReturn = VizAnnotationManager.checkFlag(aMeasures, entityTypeObject);
				var expectedReturn = true;
				ok(actualReturn === expectedReturn, "Check if checkFlag() returns expected value");

			});

			test("Analytical Chart - checkFlag() functionality - Minimize Error",function(){

				var aMeasures = [{"Measure":{"PropertyPath":"Sales"},"DataPoint":{"AnnotationPath":"@com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin"},"Role":{"EnumMember":"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"},"RecordType":"com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"}];
				var entityTypeObject = { "name":"SalesShareColumnSemanticType", "key":{ "propertyRef":[ { "name":"ID" } ] }, "property":[ { "name":"ID", "type":"Edm.String", "nullable":"false", "maxLength":"2147483647", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false" }, { "name":"Country", "type":"Edm.String", "maxLength":"3", "extensions":[ { "name":"label", "value":"Country", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Country", "com.sap.vocabularies.Common.v1.Label":{ "String":"Country" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Region", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Region", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Region", "com.sap.vocabularies.Common.v1.Label":{ "String":"Region" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"ProductID", "type":"Edm.String", "maxLength":"10", "extensions":[ { "name":"label", "value":"Product ID", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"text", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product ID", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product ID" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" }, "sap:text":"Product", "com.sap.vocabularies.Common.v1.Text":{ "Path":"Product" } }, { "name":"Currency", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"label", "value":"Currency", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Currency", "com.sap.vocabularies.Common.v1.Label":{ "String":"Currency" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Product", "type":"Edm.String", "maxLength":"1024", "extensions":[ { "name":"label", "value":"Product", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Product", "com.sap.vocabularies.Common.v1.Label":{ "String":"Product" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"SupplierCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Supplier Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Supplier Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Supplier Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"BuyerCompany", "type":"Edm.String", "maxLength":"80", "extensions":[ { "name":"label", "value":"Buyer Company", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Buyer Company", "com.sap.vocabularies.Common.v1.Label":{ "String":"Buyer Company" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Date", "type":"Edm.DateTime", "extensions":[ { "name":"display-format", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Date", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:display-format":"Date", "sap:label":"Date", "com.sap.vocabularies.Common.v1.Label":{ "String":"Date" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Month", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Month", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Month", "com.sap.vocabularies.Common.v1.Label":{ "String":"Month" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Quarter", "type":"Edm.String", "maxLength":"2", "extensions":[ { "name":"label", "value":"Quarter", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Quarter", "com.sap.vocabularies.Common.v1.Label":{ "String":"Quarter" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"Year", "type":"Edm.String", "maxLength":"4", "extensions":[ { "name":"label", "value":"Year", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"dimension", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:label":"Year", "com.sap.vocabularies.Common.v1.Label":{ "String":"Year" }, "sap:aggregation-role":"dimension", "com.sap.vocabularies.Analytics.v1.Dimension":{ "Bool":"true" } }, { "name":"TotalSales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"Sales_CURRENCY", "type":"Edm.String", "maxLength":"5", "extensions":[ { "name":"semantics", "value":"currency-code", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"currency-code" }, { "name":"TotalSales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Total Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"TotalSales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Total Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Total Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"TotalSales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"TotalSales_CURRENCY" } }, { "name":"Sales", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"unit", "value":"Sales_CURRENCY", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" }, "sap:unit":"Sales_CURRENCY", "Org.OData.Measures.V1.ISOCurrency":{ "Path":"Sales_CURRENCY" } }, { "name":"SalesShare", "type":"Edm.Decimal", "precision":"34", "extensions":[ { "name":"filterable", "value":"false", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"label", "value":"Sales Share", "namespace":"http://www.sap.com/Protocols/SAPData" }, { "name":"aggregation-role", "value":"measure", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:filterable":"false", "sap:label":"Sales Share", "com.sap.vocabularies.Common.v1.Label":{ "String":"Sales Share" }, "sap:aggregation-role":"measure", "com.sap.vocabularies.Analytics.v1.Measure":{ "Bool":"true" } } ], "extensions":[ { "name":"semantics", "value":"aggregate", "namespace":"http://www.sap.com/Protocols/SAPData" } ], "sap:semantics":"aggregate", "namespace":"sap.smartbusinessdemo.services", "$path":"/dataServices/schema/0/entityType/13", "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Country":{ "SelectOptions":[ ] }, "com.sap.vocabularies.UI.v1.DataPoint#Column_Eval_by_Country_DynamicSemanticColorMin":{ "Value":{ "Path":"Sales", "EdmType":"Edm.Decimal" }, "CriticalityCalculation":{ "ImprovementDirection":{ "EnumMember":"com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" }, "ToleranceRangeLowValue":{ "Decimal":"70000.000" }, "DeviationRangeLowValue":{ "Decimal":"80000.000" } }, "RecordType":"com.sap.vocabularies.UI.v1.DataPointType" } };
				var actualReturn = VizAnnotationManager.checkFlag(aMeasures, entityTypeObject);
				var expectedReturn = false;
				ok(actualReturn === expectedReturn, "Check if checkFlag() returns expected value");

			});

			test("Analytical Chart - UoM in Chart Title",function(){

	               var cardTestData = {
	                   card: {
	                	   "id": "chart_custom_stack_0",
	                	   "model": "salesShare",
	       				"template": "sap.ovp.cards.charts.analytical",
	       				"settings": {
	       					"dataStep": "11",
	       					"title": "Sales by Country and Region",
	       					"subTitle": "Sales by Country and Region",
	       					"valueSelectionInfo": "value selection info",
	       					"entitySet": "SalesShare",
	       					"selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
	       					"chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
	       					"presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
	       					"dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
	       					"identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
	       				}
	                   },
	                   dataSource: {
	                       baseUrl: chartTestUtils.odataBaseUrl,
	                       rootUri: chartTestUtils.odataRootUrl,
	                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
	                   },
	                   expectedResult: {

	                   }
	               };

	               var oModel = cardTestUtils.createCardModel(cardTestData);
	               stop();
	               oModel.getMetaModel().loaded().then(function () {

	                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

	                   oView.loaded().then(function (oView) {
	                       //start the async test
	                       start();
	                       var expectedResult = " | EUR";
	                       var cardViz = oView.byId("analyticalChart");
	                       var cardXml = oView._xContent;
	                       ok(cardViz !== undefined, "Existence check to VizFrame");
	                       ok(cardXml !== undefined, "Existence check to XML parsing");
	                       var chartTitle = oView.byId("ovpCT");
	                       var vizData = {"results":[{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('6')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('6')"},"StatusCriticality":"3","Region":"AMER","Sales":"94841.31","Sales_CURRENCY":"EUR"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('17')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('17')"},"StatusCriticality":"1","Region":"APJ","Sales":"8832.6","Sales_CURRENCY":"EUR"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('18')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('18')"},"StatusCriticality":"1","Region":"EMEA","Sales":"8528.25","Sales_CURRENCY":"EUR"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('7')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('7')"},"StatusCriticality":"2","Region":"AMER","Sales":"75787.74","Sales_CURRENCY":"EUR"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('8')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('8')"},"StatusCriticality":"1","Region":"AMER","Sales":"74922.67","Sales_CURRENCY":"EUR"}]};
	                       var handler = cardViz.getParent();
	                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
	                       chartTitle = oView.byId("ovpUoMTitle");
	                       sap.ovp.cards.charts.VizAnnotationManager.setChartUoMTitle(cardViz, vizData, chartTitle);

	                       // basic list XML structure tests
	                       ok(expectedResult == chartTitle.getText(), "UoM is displayed in the chart title");
	                   });

	               });
	           });


			test("Analytical Chart - UoM in Chart Title",function(){

	               var cardTestData = {
	                   card: {
	                	   "id": "chart_custom_stack_1",
	                	   "model": "salesShare",
	       				"template": "sap.ovp.cards.charts.analytical",
	       				"settings": {
	       					"dataStep": "11",
	       					"title": "Sales by Country and Region",
	       					"subTitle": "Sales by Country and Region",
	       					"valueSelectionInfo": "value selection info",
	       					"entitySet": "SalesShare",
	       					"selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
	       					"chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
	       					"presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
	       					"dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
	       					"identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
	       				}
	                   },
	                   dataSource: {
	                       baseUrl: chartTestUtils.odataBaseUrl,
	                       rootUri: chartTestUtils.odataRootUrl,
	                       annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
	                   },
	                   expectedResult: {

	                   }
	               };

	               var oModel = cardTestUtils.createCardModel(cardTestData);
	               stop();
	               oModel.getMetaModel().loaded().then(function () {

	                   var oView = cardTestUtils.createCardView(cardTestData, oModel);

	                   oView.loaded().then(function (oView) {
	                       //start the async test
	                       start();
	                       var expectedResult = "";
	                       var cardViz = oView.byId("analyticalChart");
	                       var cardXml = oView._xContent;
	                       ok(cardViz !== undefined, "Existence check to VizFrame");
	                       ok(cardXml !== undefined, "Existence check to XML parsing");
	                       var chartTitle = oView.byId("ovpCT");
	                       var vizData = {"results":[{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('6')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('6')"},"StatusCriticality":"3","Region":"AMER","Sales":"94841.31","Sales_CURRENCY":"EUR"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('17')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('17')"},"StatusCriticality":"1","Region":"APJ","Sales":"8832.6","Sales_CURRENCY":"EUR"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('18')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('18')"},"StatusCriticality":"1","Region":"EMEA","Sales":"8528.25","Sales_CURRENCY":"EUR"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('7')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('7')"},"StatusCriticality":"2","Region":"AMER","Sales":"75787.74","Sales_CURRENCY":"USD"},{"__metadata":{"id":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('8')","type":"sap.smartbusinessdemo.services.SalesShareColumnStackedType","uri":"/sap/smartbusinessdemo/services/SalesShare.xsodata/SalesShareColumnStacked('8')"},"StatusCriticality":"1","Region":"AMER","Sales":"74922.67","Sales_CURRENCY":"USD"}]};
	                       var handler = cardViz.getParent();
	                       sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
	                       chartTitle = oView.byId("ovpUoMTitle");
	                       sap.ovp.cards.charts.VizAnnotationManager.setChartUoMTitle(cardViz, vizData, chartTitle);

	                       // basic list XML structure tests
	                       ok(expectedResult == chartTitle.getText(), "UoM is not displayed in the chart title");
	                   });

	               });
               });

               function resizingFunctions(oController, lengthVal, card, cardViz){
                oController.isVizPropSet = false;
                oController.cardId = card;
                oController.oDataSet = {
                    bindData : function(){
                        return null
                    }
                };
                oController.vizFrame = {
                    setDataset : function(){
                        return null
                    }
                };
                oController.oDashboardLayoutUtil = {
                    ROW_HEIGHT_PX : 16,
                    CARD_BORDER_PX : 8,
                    dashboardLayoutModel : {
                        getCardById : function(sCardId){
                            return {
                                dashboardLayout : {
                                    rowSpan : 47,
                                    colSpan : 1
                                }
                            }
                        }
                    },
                    getCardDomId : function() {
                        return "mainView--ovpLayout--" + oController.cardId;
                    },
                    isCardAutoSpan : function(cardId){
                        return null;
                    }
                }
                oController.getHeaderHeight = function() {
                    return 82;
                }
                oController.getItemHeight = function() {
                    return 0;
                }
                oController.getView = function() {
                    return {
                        getId: function(){
                            return null;
                        },
                        getDomRef: function() {
                            return {
                                getElementsByClassName : function(){
                                    return null;
                                }
                            }
                        },
                        getController : function(){
                            return oController;
                        },
                        byId : function(id) {
                            if (id === "analyticalChart"){
                                // var vizCard = new sap.viz.ui5.controls.VizFrame();
                                // vizCard.setParent(oVizParent);
                                var vizCard= cardViz;

                                var oModel = {
                                    "entityType" : {"com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked" : {
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
                                                "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked"
                                            }
                                        ]
                                    }},
                                    "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked" ,
                                    "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked" ,
                                    "dataStep" : 11
                                }
                                vizCard.setModel(new sap.ui.model.json.JSONModel(oModel), 'ovpCardProperties')
                                return vizCard;
                            }else if(id === "bubbleText"){
                                return {
                                    setVisible : function(visibility){
                                        return null;
                                    },
                                    setText : function(text){
                                        return null;
                                    }
                                }
                            }else if(id === "ovpCT"){
                                var oText = new sap.m.Text();
                                return oText;
                            }else if(id === "ovpCardContentContainer"){
                                return {
                                    getDomRef : function(){
                                        return {
                                            classList: {
                                                add : function(className){
                                                    return null;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if(id === "vbLayout"){
                                return new sap.m.VBox();
                            }
                        },
                        $: function() {
                            return jQuery("#testContainer");
                        }
                    }
                }
                oController.getCardPropertiesModel = function() {
                    return {
                        cardLayout:{
                            rowSpan : "",
                            colSpan : "",
                            iCardBorderPx : 8,
                            iRowHeightPx : 16
                        },
                        getProperty : function(sPath) {
                            if (sPath == "/cardLayout") {
                                return this.cardLayout;
                            } else if (sPath === "/layoutDetail") {
                                return "resizable";
                            }
                        },
                        getData : function(){
                            return {
                                colorPalette: {}
                            }
                        },
                        setProperty : function(sPath, value){
                            if (sPath === "/cardLayout/colSpan") {
                                this.cardLayout.colSpan = value;
                            } else if (sPath === "/cardLayout/rowSpan") {
                                this.cardLayout.rowSpan = value;
                            }
                        }
                    }
                }
                oController.getOwnerComponent = function () {
                    return new sap.ui.core.UIComponent()
                };
            }

            test("Analytical Chart - Resizing",function(){

                 var cardTestData = {
                     card: {
                         "id": "chart_custom_stack_2",
                         "model": "salesShare",
                         "template": "sap.ovp.cards.charts.analytical",
                         "settings": {
                             "dataStep": "11",
                             "title": "Sales by Country and Region",
                             "subTitle": "Sales by Country and Region",
                             "valueSelectionInfo": "value selection info",
                             "entitySet": "SalesShare",
                             "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
                             "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
                             "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
                             "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
                             "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                         }
                     },
                     dataSource: {
                         baseUrl: chartTestUtils.odataBaseUrl,
                         rootUri: chartTestUtils.odataRootUrl,
                         annoUri: chartTestUtils.testBaseUrl + "data/salesshare/annotations.xml"
                     },
                     expectedResult: {

                     }
                 };

                 var oModel = cardTestUtils.createCardModel(cardTestData);
                 stop();
                 oModel.getMetaModel().loaded().then(function () {

                     var oView = cardTestUtils.createCardView(cardTestData, oModel);

                     oView.loaded().then(function (oView) {
                         start();
                         var newCardLayout = {
                            showOnlyHeader: true,
                            rowSpan: 32,
                            colSpan: 4,
                            iRowHeightPx: 16,
                            iCardBorderPx: 8
                        };

                         var cardViz = oView.byId("analyticalChart");
                         var originalHeight = cardViz.getHeight();
                         var cardXml = oView._xContent;
                         ok(cardViz !== undefined, "Existence check to VizFrame");
                         ok(cardXml !== undefined, "Existence check to XML parsing");
                         var chartTitle = oView.byId("ovpCT");
                         var handler = cardViz.getParent();
                         sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(cardViz, handler, chartTitle);
                         var oController = new sap.ui.controller("sap.ovp.cards.charts.analytical.analyticalChart");

                         resizingFunctions(oController, 2, "chart_custom_stack_2", cardViz);

                         oController.onBeforeRendering();
                         var oItemsBinding = oController.getCardItemsBinding();
                         oController.onAfterRendering();
                         oItemsBinding.fireDataReceived();

                         oController.resizeCard(newCardLayout);
                         ok((cardViz.getHeight() != originalHeight) , "Vizframe height changed");
                     });

                 });
             });
           test("Analytical Chart - Resizing", function () {

               var oMeasure = [{
                   "Measure": {"PropertyPath": "TotalSales"},
                   "Role": {"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"},
                   "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
               }];
               var oDimensions = [{
                   "Dimension": {"PropertyPath": "StatusCriticality"},
                   "Role": {"EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"},
                   "RecordType": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType"
               }, {
                   "Dimension": {"PropertyPath": "Region"},
                   "Role": {"EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"},
                   "RecordType": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType"
               }];
               var entityType = {
                   "name": "SalesShareColumnStacked",
                   "entityType": "sap.smartbusinessdemo.services.SalesShareColumnStackedType",
                   "Org.OData.Capabilities.V1.FilterRestrictions": {"NonFilterableProperties": [{"PropertyPath": "ID"}, {"PropertyPath": "TotalSales"}, {"PropertyPath": "Sales"}, {"PropertyPath": "SalesShare"}]}
               };
               var oPresentationVariant = {
                   "MaxItems": {"Int": "20"},
                   "RequestAtLeast": [{"PropertyPath": "ID"}, {"PropertyPath": "Country"}],
                   "Text": {"String": "Sales in Descending order"},
                   "SortOrder": [{"Property": {"PropertyPath": "Region"}, "Descending": {"Boolean": "false"}}],
                   "Visualizations": [{"AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked"}]
               };

               var chartType = {
                   "EnumMember": "com.sap.vocabularies.UI.v1.ChartType/ColumnStacked"
               };
               var Properties = [{
                   "name": "Country",
                   "type": "Edm.String",
                   "maxLength": "3",
                   "extensions": [{
                       "name": "label",
                       "value": "Country",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }, {
                       "name": "aggregation-role",
                       "value": "dimension",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }],
                   "sap:label": "Country",
                   "com.sap.vocabularies.Common.v1.Label": {
                       "String": "Country"
                   },
                   "sap:aggregation-role": "dimension"
               }, {
                   "name": "ProductID",
                   "type": "Edm.String",
                   "maxLength": "10",
                   "extensions": [{
                       "name": "label",
                       "value": "Product ID",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }, {
                       "name": "aggregation-role",
                       "value": "dimension",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }, {
                       "name": "text",
                       "value": "Product",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }],
                   "sap:label": "Product ID",
                   "com.sap.vocabularies.Common.v1.Label": {
                       "String": "Product ID"
                   },
                   "sap:aggregation-role": "dimension",
                   "sap:text": "Product",
                   "com.sap.vocabularies.Common.v1.Text": {
                       "Path": "Product"
                   }
               },{
                   "name": "SalesShare",
                   "type": "Edm.Decimal",
                   "precision": "12",
                   "scale": "5",
                   "extensions": [{
                       "name": "filterable",
                       "value": "false",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }, {
                       "name": "label",
                       "value": "Sales Share",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }, {
                       "name": "aggregation-role",
                       "value": "measure",
                       "namespace": "http://www.sap.com/Protocols/SAPData"
                   }],
                   "sap:filterable": "false",
                   "sap:label": "Sales Share",
                   "com.sap.vocabularies.Common.v1.Label": {
                       "String": "Sales Share"
                   },
                   "sap:aggregation-role": "measure"
               }];
               var simulatedEntityTypeData = {
                   "name": "SalesShareType",
                   "$path": "/dataServices/schema/0/entityType/0",
                   "property": Properties
               };

               var OvpModel = {
                   getProperty: function (path) {
                       if (path == "/entityType") {
                           return simulatedEntityTypeData;
                       }
                       if (path == "/metaModel") {
                           return {getODataEntityType: function()
                           {
                               return simulatedEntityTypeData;
                           }}
                       }
                       else if (path == "/entitySet"){
                           return "SalesShare";
                       }
                   }
               };

               var entityTypeData = {
                   getModel: function (model) {
                       if (model == "ovpCardProperties") {
                           return OvpModel;
                       }
                   }
               };

               var IContext = {
                   getSetting: function (model) {
                       if (model == "dataModel") {
                           return OvpModel;
                       }
                       else if (model == "ovpCardProperties") {
                           return OvpModel;
                       }
                   }
               };
               var Stub = sinon.stub(chartUtils, "cacheODataMetadata",
                       function (model, entitySet) {
                           return Properties });

               var expectedResult = "{path: '/SalesShareColumnStacked', sorter: [{path: 'Region',descending: false}], parameters: {select:'StatusCriticality,Region,TotalSales,ID,Country'}, length: 20}"
               var Select = VizAnnotationManager.formatItems(IContext, entityType, null, oPresentationVariant, oDimensions, oMeasure, chartType);
               ok(expectedResult == Select);
           });
       });