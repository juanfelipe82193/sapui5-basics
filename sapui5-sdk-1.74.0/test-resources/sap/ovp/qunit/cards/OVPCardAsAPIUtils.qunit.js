sap.ui.define([
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/qunit/cards/charts/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global",
    "/sap/ui/core/ComponentContainer",
    "/sap/m/VBox",
    "sap/base/Log"
], function (OVPCardAsAPIUtils, utils, oChartUtils, mockservers, jquery, ComponentContainer, VBox, Log) {
    "use strict";
            "use strict";
            /* module, ok, test, jQuery, sap */

            //jQuery.sap.require("sap.ovp.cards.OVPCardAsAPIUtils");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //jQuery.sap.require("ComponentContainer");
            //jQuery.sap.require("VBox");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.charts.utils");

            var utils = utils;
            var chartUtils = oChartUtils;
            var OVPCardAsAPIUtils = OVPCardAsAPIUtils;
            var errorSpy, testContainer, oCreateCardComponentStub;


            module("sap.ovp.cards.OVPCardAsAPIUtils", {
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
                    if (oCreateCardComponentStub) {
                        oCreateCardComponentStub.restore();
                    }
                    jQuery(testContainer).remove();
                }
            });

            test("Card Test - For API - Dynamic Link List Card", function () {
                var cardTestData = {
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_barListCard.xml"
                    }
                };
                var oManifest = {
                    cards: {
                        "card017": {
                            "model": "salesOrder",
                            "template": "sap.ovp.cards.linklist",
                            "settings": {
                                "title": "Standard Dynamic Linklist Card",
                                "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                                "subTitle": "Smartlink Feature Test",
                                "listFlavor": "standard",
                                "entitySet": "ProductSet",
                                "sortBy": "Name",
                                "sortOrder": "ascending",
                                "headerAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#header1",
                                "defaultSpan": {
                                    "rows": 20,
                                    "cols": 2
                                }
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
                    var oComponentContainer = new ComponentContainer("card017");
                    oView.addItem(oComponentContainer);
                    oView.byId = function (id) {
                        return sap.ui.getCore().byId(id);
                    };
                    oView.placeAt("testContainer");
                    var oPromise = OVPCardAsAPIUtils.createCardComponent(oView, oManifest, "card017");
                    stop();
                    oPromise.then(function () {
                        start();
                        ok(true, "createCardComponent function was executed");
                    });
                });
            });

            test("Card Test - For API - Static Link List Card", function () {
                var oManifest = {
                    cards: {
                        "card014": {
                            "template": "sap.ovp.cards.linklist",
                            "settings": {
                                "title": "Quick Links",
                                "subTitle": "Most commonly used actions",
                                "listFlavor": "standard",
                                "defaultSpan": {
                                    "rows": 15,
                                    "cols": 1
                                },
                                "staticContent": [
                                    {
                                        "title": "Create Supplier",
                                        "imageUri": "sap-icon://add-contact",
                                        "imageAltText": "{{card30_icon_so_man}}",
                                        "targetUri": "https://sap.com",
                                        "openInNewWindow": true
                                    },
                                    {
                                        "title": "Create Purchase Order",
                                        "imageUri": "sap-icon://sales-document",
                                        "imageAltText": "{{card30_icon_prod_man}}",
                                        "targetUri": "https://sap.com",
                                        "openInNewWindow": true
                                    },
                                    {
                                        "title": "Manage Purchase Orders",
                                        "imageUri": "sap-icon://sales-order-item",
                                        "imageAltText": "{{card30_icon_so_man}}",
                                        "targetUri": "https://sap.com",
                                        "openInNewWindow": true
                                    },
                                    {
                                        "title": "Manage Purchase Requisitions",
                                        "imageUri": "sap-icon://list",
                                        "imageAltText": "{{card30_icon_so_man}}",
                                        "targetUri": "https://sap.com",
                                        "openInNewWindow": true
                                    },
                                    {
                                        "title": "Create Contract",
                                        "imageUri": "sap-icon://credit-card",
                                        "imageAltText": "{{card30_icon_so_man}}",
                                        "targetUri": "https://sap.com",
                                        "openInNewWindow": true
                                    },
                                    {
                                        "title": "Create Purchase Requisition",
                                        "imageUri": "sap-icon://create-form",
                                        "imageAltText": "{{card30_icon_so_man}}",
                                        "targetUri": "https://sap.com",
                                        "openInNewWindow": true
                                    }
                                ]
                            }
                        }
                    }
                };
                var oView = new VBox("TestVBox2");
                var oComponentContainer = new ComponentContainer("card014");
                oView.addItem(oComponentContainer);
                oView.byId = function (id) {
                    return sap.ui.getCore().byId(id);
                };
                oView.placeAt("testContainer");
                var oPromise = OVPCardAsAPIUtils.createCardComponent(oView, oManifest, "card014");
                stop();
                oPromise.then(function () {
                    start();
                    ok(true, "createCardComponent function was executed");
                });
            });

            test("Recreate Card functionality Test - For API - Normal View Switch Card", function () {
                var oManifest = {
                    cards: {
                        "card018": {
                            "model": "purchaseOrder",
                            "template": "sap.ovp.cards.list",
                            "settings": {
                                "title": "{{card3_title}}",
                                "subTitle": "Condensed standard list card with view Switch",
                                "listType": "condensed",
                                "entitySet": "Zme_Overdue",
                                "imageSupported": true,
                                "sortBy": "OverdueTime",
                                "tabs": [
                                    {
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#imageD",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#item2",
                                        "value": "By Overdue days descending"
                                    },
                                    {
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                        "value": "No images Description"
                                    },
                                    {
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#iconD",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                        "value": "Icons Description"
                                    },
                                    {
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                        "value": "No images/icons no Description"
                                    },
                                    {
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#imagenD",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#item2",
                                        "value": "Images No Description"
                                    },
                                    {
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#iconnD",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                        "value": "Icons No Description"
                                    }
                                ]
                            }
                        }
                    }
                };
                var oComponentData = {
                    manifest: oManifest
                };
                var oCardProperties = {
                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                    "selectedKey": 2
                };
                var result = {
                    "cards": {
                        "card018": {
                            "model": "purchaseOrder",
                            "template": "sap.ovp.cards.list",
                            "settings": {
                                "title": "{{card3_title}}",
                                "subTitle": "Condensed standard list card with view Switch",
                                "listType": "condensed",
                                "entitySet": "Zme_Overdue",
                                "imageSupported": true,
                                "sortBy": "OverdueTime",
                                "tabs": [{
                                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#imageD",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#item2",
                                    "value": "By Overdue days descending"
                                }, {
                                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                    "value": "No images Description"
                                }, {
                                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#iconD",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                    "value": "Icons Description"
                                }, {
                                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                    "value": "No images/icons no Description"
                                }, {
                                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#imagenD",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#item2",
                                    "value": "Images No Description"
                                }, {
                                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#iconnD",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                    "value": "Icons No Description"
                                }],
                                "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                                "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                "selectedKey": 2
                            }
                        }
                    }
                };
                oCreateCardComponentStub = sinon.stub(OVPCardAsAPIUtils, "createCardComponent", function (oView, oManifest) {
                    ok(JSON.stringify(result) === JSON.stringify(oManifest), "recreateCard function was executed correctly");
                });
                OVPCardAsAPIUtils.recreateCard(oCardProperties, oComponentData);
            });

            test("Recreate Card functionality Test - For API - View Switch for Analytical Card", function () {
                var oManifest = {
                    cards: {
                        "card004": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "title": "Total Purchase Order Value",
                                "subTitle": "Year-to-date",
                                "entitySet": "SalesShareDonut",
                                "valueSelectionInfo": "Categorized by products",
                                "customParams": "getParameters",
                                "tabs": [
                                    {
                                        "kpiAnnotationPath":"com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                        "value": "KPI Annotation",
                                        "navigation": "noHeaderNav"

                                    },
                                    {
                                        "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                                        "value": "SelectionPresentation",
                                        "navigation": "headerNav"
                                    }
                                ]
                            }
                        }
                    }
                };
                var oComponentData = {
                    manifest: oManifest
                };
                var oCardProperties = {
                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    "navigation": "headerNav",
                    "selectedKey": 2
                };
                var result = {
                    "cards": {
                        "card004": {
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "title": "Total Purchase Order Value",
                                "subTitle": "Year-to-date",
                                "entitySet": "SalesShareDonut",
                                "valueSelectionInfo": "Categorized by products",
                                "customParams": "getParameters",
                                "tabs": [{
                                    "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                    "value": "KPI Annotation",
                                    "navigation": "noHeaderNav"
                                }, {
                                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                                    "value": "SelectionPresentation",
                                    "navigation": "headerNav"
                                }],
                                "navigation": "headerNav",
                                "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                                "selectedKey": 2
                            }
                        }
                    }
                };
                oCreateCardComponentStub = sinon.stub(OVPCardAsAPIUtils, "createCardComponent", function (oView, oManifest) {
                    ok(JSON.stringify(result) === JSON.stringify(oManifest), "recreateCard function was executed correctly");
                });
                OVPCardAsAPIUtils.recreateCard(oCardProperties, oComponentData);
            });

            test("Recreate Card functionality Test - For API - View Switch for Complex Cards with entitySet inside tabs", function () {
                var oManifest = {
                    cards: {
                        "card009": {
                            "model": "salesOrder",
                            "template": "sap.ovp.cards.list",
                            "settings": {
                                "title": "Contract Monitoring",
                                "subTitle": "Per Supplier",
                                "valueSelectionInfo": "Total contract volume",
                                "listFlavor": "bar",
                                "listType": "extended",
                                "showLineItemDetail":true,
                                "tabs": [
                                    {
                                        "entitySet": "SalesOrderSet",
                                        "dynamicSubtitleAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#View1",
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line1",
                                        "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                        "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line",
                                        "value": "{{dropdown_value2}}"
                                    },
                                    {
                                        "entitySet": "SalesOrderSet",
                                        "dynamicSubtitleAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#View3",
                                        "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#SP3",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                        "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line",
                                        "value": "{{dropdown_value3}}"
                                    },
                                    {
                                        "entitySet": "ProductSet",
                                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                                        "value": "{{dropdown_value1}}"
                                    }
                                ]
                            }
                        }
                    }
                };
                var oComponentData = {
                    manifest: oManifest
                };
                var oCardProperties = {
                    "entitySet": "SalesOrderSet",
                    "dynamicSubtitleAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#View3",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#SP3",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line",
                    "selectedKey": 2
                };
                var result = {
                    "cards": {
                        "card009": {
                            "model": "salesOrder",
                            "template": "sap.ovp.cards.list",
                            "settings": {
                                "title": "Contract Monitoring",
                                "subTitle": "Per Supplier",
                                "valueSelectionInfo": "Total contract volume",
                                "listFlavor": "bar",
                                "listType": "extended",
                                "showLineItemDetail": true,
                                "tabs": [{
                                    "entitySet": "SalesOrderSet",
                                    "dynamicSubtitleAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#View1",
                                    "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#line1",
                                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line",
                                    "value": "{{dropdown_value2}}"
                                }, {
                                    "entitySet": "SalesOrderSet",
                                    "dynamicSubtitleAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#View3",
                                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#SP3",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line",
                                    "value": "{{dropdown_value3}}"
                                }, {
                                    "entitySet": "ProductSet",
                                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                                    "value": "{{dropdown_value1}}"
                                }],
                                "entitySet": "SalesOrderSet",
                                "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#View3",
                                "dynamicSubtitleAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                                "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#SP3",
                                "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#line",
                                "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                                "selectedKey": 2
                            }
                        }
                    }
                };
                oCreateCardComponentStub = sinon.stub(OVPCardAsAPIUtils, "createCardComponent", function (oView, oManifest) {
                    ok(JSON.stringify(result) === JSON.stringify(oManifest), "recreateCard function was executed correctly");
                });
                OVPCardAsAPIUtils.recreateCard(oCardProperties, oComponentData);
            });

        });
