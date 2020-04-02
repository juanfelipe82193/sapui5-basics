sap.ui.define([
    "sap/ovp/cards/PayLoadUtils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (PayLoadUtils, mockservers, jquery) {
            "use strict";
            /* module, ok, test, jQuery, sap */

            //jQuery.sap.require("sap.ovp.cards.PayLoadUtils");
            var PayLoadUtils = PayLoadUtils;

            module("sap.ovp.cards.PayLoadUtils", {
                /**
                 * This method is called before each test
                 */
                setup: function () {

                },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                teardown: function () {

                }
            });

            /**
             *  ------------------------------------------------------------------------------
             *  Start of Generic Artifacts for PayLoadUtils
             *  ------------------------------------------------------------------------------
             */

            var aCards = [{
                "id": "card001",
                "model": "purchaseOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "title": "Extended List Card",
                    "subTitle": "By delivery date and value",
                    "sortBy": "DeliveryDate",
                    "sortOrder": "Descending",
                    "listType": "extended",
                    "entitySet": "Zme_Overdue",
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                    "customParams": "getParameters",
                    "defaultSpan": {
                        "minimumTitleRow": 2,
                        "showOnlyHeader": false
                    }
                }
            }, {
                "id": "Vcard16_cardchartscolumnstacked",
                "model": "salesShare",
                "template": "sap.ovp.cards.charts.analytical",
                "settings": {
                    "dataStep": "11",
                    "title": "Sales by Country and Region",
                    "subTitle": "Sales by Country and Region",
                    "valueSelectionInfo": "value selection info",
                    "navigation":"noHeaderNav",
                    "entitySet": "SalesShareColumnStacked",
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
                    "selectionAnnotationPath" : "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
                    "chartAnnotationPath" : "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
                    "presentationAnnotationPath" : "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
                    "dataPointAnnotationPath" : "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
                    "identificationAnnotationPath" : "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                }
            }, {
                "id": "card004",
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
            }, {
                "id": "card015",
                "model": "salesOrder",
                "template": "sap.ovp.cards.stack",
                "settings": {
                    "itemText": "items awaiting approval",
                    "title": "Awaiting Purchase Order Approval",
                    "subTitle": "Sorted by delivery date",
                    "entitySet": "SalesOrderLineItemSet",
                    "annotationPath": "com.sap.vocabularies.UI.v1.FieldGroup#Note/Data,com.sap.vocabularies.UI.v1.FieldGroup#Note1/Data",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification,com.sap.vocabularies.UI.v1.Identification#Awaiting_Approval"
                }
            }, {
                "id": "card016",
                "model": "purchaseOrder",
                "template": "sap.ovp.cards.linklist",
                "settings": {
                    "title": "Products",
                    "subTitle": "Members displayed by role",
                    "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                    "listFlavor": "carousel",
                    "sortOrder": "ascending",
                    "defaultSpan": {
                        "rows": 37,
                        "cols": 1
                    },
                    "staticContent": [
                        {
                            "title": "HT-6100",
                            "subTitle": "Doana Moore",
                            "imageUri": "img/carousel/HT-6100-large.jpg",
                            "imageAltText": "Doana Moore",
                            "targetUri": "https://google.com",
                            "openInNewWindow": true
                        },
                        {
                            "title": "HT-6120",
                            "subTitle": "",
                            "imageUri": "img/carousel/HT-6120-large.jpg",
                            "imageAltText": "Michael Adams",
                            "targetUri": "https://google.com",
                            "openInNewWindow": true
                        }
                    ]
                }
            }, {
                "id": "card017",
                "model": "salesOrder",
                "template": "sap.ovp.cards.linklist",
                "settings": {
                    "title": "Standard Dynamic Linklist Card",
                    "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                    "subTitle": "",
                    "listFlavor": "standard",
                    "entitySet": "ProductSet",
                    "sortBy": "Name",
                    "sortOrder": "ascending",
                    "headerAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#header1",
                    "defaultSpan": {
                        "showOnlyHeader": true
                    }
                }
            }, {
                "id": "customer.card017_C1",
                "model": "salesOrder",
                "template": "sap.ovp.cards.linklist",
                "settings": {
                    "title": "Standard Dynamic Linklist Card 1",
                    "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                    "subTitle": "",
                    "listFlavor": "standard",
                    "entitySet": "ProductSet",
                    "sortBy": "Name",
                    "sortOrder": "ascending",
                    "headerAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#header1",
                    "defaultSpan": {
                        "showOnlyHeader": true,
                        "rows": 12
                    }
                }
            }];

            var aOriginalCards = [{
                "id": "card001",
                "model": "purchaseOrder",
                "template": "sap.ovp.cards.list",
                "settings": {
                    "title": "Extended List Card",
                    "subTitle": "By delivery date and value",
                    "sortBy": "DeliveryDate",
                    "sortOrder": "Descending",
                    "listType": "extended",
                    "entitySet": "Zme_Overdue",
                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                    "customParams": "getParameters",
                    "defaultSpan": {
                        "minimumTitleRow": 2,
                        "showOnlyHeader": false
                    }
                }
            }, {
                "id": "card004",
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
            }, {
                "id": "card016",
                "model": "purchaseOrder",
                "template": "sap.ovp.cards.linklist",
                "settings": {
                    "title": "Products",
                    "subTitle": "Members displayed by role",
                    "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                    "listFlavor": "carousel",
                    "sortOrder": "ascending",
                    "defaultSpan": {
                        "rows": 37,
                        "cols": 1
                    },
                    "staticContent": [
                        {
                            "title": "HT-6100",
                            "subTitle": "Doana Moore",
                            "imageUri": "img/carousel/HT-6100-large.jpg",
                            "imageAltText": "Doana Moore",
                            "targetUri": "https://google.com",
                            "openInNewWindow": true
                        },
                        {
                            "title": "HT-6120",
                            "subTitle": "",
                            "imageUri": "img/carousel/HT-6120-large.jpg",
                            "imageAltText": "Michael Adams",
                            "targetUri": "https://google.com",
                            "openInNewWindow": true
                        }
                    ]
                }
            }];

            var sApplicationId = "sap.ovp.demo";

            var oMainComponent = {
                _getApplicationId: function() {
                    return sApplicationId;
                },
                _getCardFromManifest: function (sCardId) {
                    var aCards = this._getCardsModel();
                    for (var i = 0; i < aCards.length; i++) {
                        if (aCards[i].id === sCardId) {
                            return aCards[i];
                        }
                    }

                    return null;
                },
                _getCardsModel: function() {
                    return aCards;
                }
            };

            var oAppComponent = {
                _getOvpCardOriginalConfig: function(sCardId) {
                    for (var i = 0; i < aOriginalCards.length; i++) {
                        if (aOriginalCards[i].id === sCardId) {
                            return aOriginalCards[i];
                        }
                    }

                    return null;
                }
            };

            /**
             *  ------------------------------------------------------------------------------
             *  End of Generic Artifacts for PayLoadUtils
             *  ------------------------------------------------------------------------------
             */

            /**
             *  ------------------------------------------------------------------------------
             *  Start of Test Cases for Creating PayLoad for Clone Card
             *  ------------------------------------------------------------------------------
             */

            function createComponentContainer(sCardId) {
                return {
                    getComponentInstance: function() {
                        return {
                            getComponentData: function() {
                                return {
                                    mainComponent: oMainComponent,
                                    cardId: sCardId
                                }
                            }
                        };
                    },
                    getId: function() {
                        return "mainView--" + sCardId;
                    }
                };
            }

            test("Function Test ---> getPayLoadForCloneCard ---> Clone of SAP Delivered List card", function() {
                var result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "card": {
                                "customer.card001_C1": {
                                    "model": "purchaseOrder",
                                    "template": "sap.ovp.cards.list",
                                    "settings": {
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.customer.card001_C1.settings.title}}",
                                        "subTitle": "{{sap.ovp.demo_sap.ovp.cards.customer.card001_C1.settings.subTitle}}",
                                        "sortBy": "DeliveryDate",
                                        "sortOrder": "Descending",
                                        "listType": "extended",
                                        "entitySet": "Zme_Overdue",
                                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                                        "customParams": "getParameters",
                                        "defaultSpan": {
                                            "minimumTitleRow": 2,
                                            "showOnlyHeader": false
                                        }
                                    }
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.customer.card001_C1.settings.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Extended List Card 1"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card001_C1.settings.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "By delivery date and value"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "model": "purchaseOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "title": "Extended List Card 1",
                            "subTitle": "By delivery date and value",
                            "sortBy": "DeliveryDate",
                            "sortOrder": "Descending",
                            "listType": "extended",
                            "entitySet": "Zme_Overdue",
                            "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                            "customParams": "getParameters",
                            "defaultSpan": {
                                "minimumTitleRow": 2,
                                "showOnlyHeader": false
                            }
                        },
                        "id": "customer.card001_C1"
                    }
                };
                var oComponentContainer = createComponentContainer("card001");
                stop();
                PayLoadUtils.getPayLoadForCloneCard(oComponentContainer).then(function(mChangeContent) {
                    start();
                    var sCardId = mChangeContent.flexibilityChange.id,
                        oAppDesChange = mChangeContent.appDescriptorChange,
                        oSettings = oAppDesChange.parameters.card[sCardId].settings,
                        sTitle = oSettings.title,
                        sSubTitle = oSettings.subTitle,
                        oTexts = oAppDesChange.texts;
                    ok(!!oTexts[sTitle.substr(2, sTitle.length - 4)], "Title binding done properly in PayLoad");
                    ok(!!oTexts[sSubTitle.substr(2, sSubTitle.length - 4)], "SubTitle binding done properly in PayLoad");
                    ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created for Clone of SAP Delivered List card");
                });
            });

            test("Function Test ---> getPayLoadForCloneCard ---> Clone of SAP Delivered Analytical card", function() {
                var result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "card": {
                                "customer.Vcard16_cardchartscolumnstacked_C1": {
                                    "model": "salesShare",
                                    "template": "sap.ovp.cards.charts.analytical",
                                    "settings": {
                                        "dataStep": "11",
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.customer.Vcard16_cardchartscolumnstacked_C1.settings.title}}",
                                        "subTitle": "{{sap.ovp.demo_sap.ovp.cards.customer.Vcard16_cardchartscolumnstacked_C1.settings.subTitle}}",
                                        "valueSelectionInfo": "{{sap.ovp.demo_sap.ovp.cards.customer.Vcard16_cardchartscolumnstacked_C1.settings.valueSelectionInfo}}",
                                        "navigation": "noHeaderNav",
                                        "entitySet": "SalesShareColumnStacked",
                                        "colorPalette": [{
                                            "color": "sapUiChartPaletteSemanticNeutral",
                                            "legendText": "{{OTHERS}}"
                                        }, {
                                            "color": "sapUiChartPaletteSemanticBadDark1",
                                            "legendText": "{{BAD}}"
                                        }, {
                                            "color": "sapUiChartPaletteSemanticCriticalDark2",
                                            "legendText": "{{CRITICAL}}"
                                        }, {
                                            "color": "sapUiChartPaletteSemanticCritical",
                                            "legendText": "{{GOOD}}"
                                        }],
                                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
                                        "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
                                        "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
                                        "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                                    }
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.customer.Vcard16_cardchartscolumnstacked_C1.settings.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Sales by Country and Region 1"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.Vcard16_cardchartscolumnstacked_C1.settings.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Sales by Country and Region"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.Vcard16_cardchartscolumnstacked_C1.settings.valueSelectionInfo": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "value selection info"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "dataStep": "11",
                            "title": "Sales by Country and Region 1",
                            "subTitle": "Sales by Country and Region",
                            "valueSelectionInfo": "value selection info",
                            "navigation": "noHeaderNav",
                            "entitySet": "SalesShareColumnStacked",
                            "colorPalette": [{
                                "color": "sapUiChartPaletteSemanticNeutral",
                                "legendText": "{{OTHERS}}"
                            }, {
                                "color": "sapUiChartPaletteSemanticBadDark1",
                                "legendText": "{{BAD}}"
                            }, {
                                "color": "sapUiChartPaletteSemanticCriticalDark2",
                                "legendText": "{{CRITICAL}}"
                            }, {
                                "color": "sapUiChartPaletteSemanticCritical",
                                "legendText": "{{GOOD}}"
                            }],
                            "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
                            "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
                            "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
                            "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
                            "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
                        },
                        "id": "customer.Vcard16_cardchartscolumnstacked_C1"
                    }
                };
                var oComponentContainer = createComponentContainer("Vcard16_cardchartscolumnstacked");
                stop();
                PayLoadUtils.getPayLoadForCloneCard(oComponentContainer).then(function(mChangeContent) {
                    start();
                    var sCardId = mChangeContent.flexibilityChange.id,
                        oAppDesChange = mChangeContent.appDescriptorChange,
                        oSettings = oAppDesChange.parameters.card[sCardId].settings,
                        sTitle = oSettings.title,
                        sSubTitle = oSettings.subTitle,
                        sValueSelectionInfo = oSettings.valueSelectionInfo,
                        oTexts = oAppDesChange.texts;
                    ok(!!oTexts[sTitle.substr(2, sTitle.length - 4)], "Title binding done properly in PayLoad");
                    ok(!!oTexts[sSubTitle.substr(2, sSubTitle.length - 4)], "SubTitle binding done properly in PayLoad");
                    ok(!!oTexts[sValueSelectionInfo.substr(2, sValueSelectionInfo.length - 4)], "ValueSelectionInfo binding done properly in PayLoad");
                    ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created for Clone of SAP Delivered Analytical card");
                });
            });

            test("Function Test ---> getPayLoadForCloneCard ---> Clone of SAP Delivered Analytical card with view switch", function() {
                var result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "card": {
                                "customer.card004_C1": {
                                    "model": "salesShare",
                                    "template": "sap.ovp.cards.charts.analytical",
                                    "settings": {
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.title}}",
                                        "subTitle": "{{sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.subTitle}}",
                                        "entitySet": "SalesShareDonut",
                                        "valueSelectionInfo": "{{sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.valueSelectionInfo}}",
                                        "customParams": "getParameters",
                                        "tabs": [{
                                            "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                            "value": "{{sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.tabs.0.value}}",
                                            "navigation": "noHeaderNav"
                                        }, {
                                            "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                                            "value": "{{sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.tabs.1.value}}",
                                            "navigation": "headerNav"
                                        }]
                                    }
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Total Purchase Order Value 1"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Year-to-date"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.valueSelectionInfo": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Categorized by products"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.tabs.0.value": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "KPI Annotation"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card004_C1.settings.tabs.1.value": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "SelectionPresentation"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "model": "salesShare",
                        "template": "sap.ovp.cards.charts.analytical",
                        "settings": {
                            "title": "Total Purchase Order Value 1",
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
                            }]
                        },
                        "id": "customer.card004_C1"
                    }
                };
                var oComponentContainer = createComponentContainer("card004");
                stop();
                PayLoadUtils.getPayLoadForCloneCard(oComponentContainer).then(function(mChangeContent) {
                    start();
                    var sCardId = mChangeContent.flexibilityChange.id,
                        oAppDesChange = mChangeContent.appDescriptorChange,
                        oSettings = oAppDesChange.parameters.card[sCardId].settings,
                        sTitle = oSettings.title,
                        sSubTitle = oSettings.subTitle,
                        sValueSelectionInfo = oSettings.valueSelectionInfo,
                        sTabValue1 = oSettings.tabs[0].value,
                        sTabValue2 = oSettings.tabs[1].value,
                        oTexts = oAppDesChange.texts;
                    ok(!!oTexts[sTitle.substr(2, sTitle.length - 4)], "Title binding done properly in PayLoad");
                    ok(!!oTexts[sSubTitle.substr(2, sSubTitle.length - 4)], "SubTitle binding done properly in PayLoad");
                    ok(!!oTexts[sValueSelectionInfo.substr(2, sValueSelectionInfo.length - 4)], "ValueSelectionInfo binding done properly in PayLoad");
                    ok(!!oTexts[sTabValue1.substr(2, sTabValue1.length - 4)], "Tab level property value's binding done properly in PayLoad");
                    ok(!!oTexts[sTabValue2.substr(2, sTabValue2.length - 4)], "Tab level property value's binding done properly in PayLoad");
                    ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created for Clone of SAP Delivered Analytical card with view switch");
                });
            });

            test("Function Test ---> getPayLoadForCloneCard ---> Clone of SAP Delivered Stack card", function() {
                var result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "card": {
                                "customer.card015_C1": {
                                    "model": "salesOrder",
                                    "template": "sap.ovp.cards.stack",
                                    "settings": {
                                        "itemText": "{{sap.ovp.demo_sap.ovp.cards.customer.card015_C1.settings.itemText}}",
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.customer.card015_C1.settings.title}}",
                                        "subTitle": "{{sap.ovp.demo_sap.ovp.cards.customer.card015_C1.settings.subTitle}}",
                                        "entitySet": "SalesOrderLineItemSet",
                                        "annotationPath": "com.sap.vocabularies.UI.v1.FieldGroup#Note/Data,com.sap.vocabularies.UI.v1.FieldGroup#Note1/Data",
                                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification,com.sap.vocabularies.UI.v1.Identification#Awaiting_Approval"
                                    }
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.customer.card015_C1.settings.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Awaiting Purchase Order Approval 1"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card015_C1.settings.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Sorted by delivery date"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card015_C1.settings.itemText": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "items awaiting approval"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "itemText": "items awaiting approval",
                            "title": "Awaiting Purchase Order Approval 1",
                            "subTitle": "Sorted by delivery date",
                            "entitySet": "SalesOrderLineItemSet",
                            "annotationPath": "com.sap.vocabularies.UI.v1.FieldGroup#Note/Data,com.sap.vocabularies.UI.v1.FieldGroup#Note1/Data",
                            "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification,com.sap.vocabularies.UI.v1.Identification#Awaiting_Approval"
                        },
                        "id": "customer.card015_C1"
                    }
                };
                var oComponentContainer = createComponentContainer("card015");
                stop();
                PayLoadUtils.getPayLoadForCloneCard(oComponentContainer).then(function(mChangeContent) {
                    start();
                    var sCardId = mChangeContent.flexibilityChange.id,
                            oAppDesChange = mChangeContent.appDescriptorChange,
                            oSettings = oAppDesChange.parameters.card[sCardId].settings,
                            sTitle = oSettings.title,
                            sSubTitle = oSettings.subTitle,
                            sItemText = oSettings.itemText,
                            oTexts = oAppDesChange.texts;
                    ok(!!oTexts[sTitle.substr(2, sTitle.length - 4)], "Title binding done properly in PayLoad");
                    ok(!!oTexts[sSubTitle.substr(2, sSubTitle.length - 4)], "SubTitle binding done properly in PayLoad");
                    ok(!!oTexts[sItemText.substr(2, sItemText.length - 4)], "ItemText binding done properly in PayLoad");
                    ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created for Clone of SAP Delivered Stack card");
                });
            });

            test("Function Test ---> getPayLoadForCloneCard ---> Clone of SAP Delivered Static Link List card", function() {
                var result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "card": {
                                "customer.card016_C1": {
                                    "model": "purchaseOrder",
                                    "template": "sap.ovp.cards.linklist",
                                    "settings": {
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.title}}",
                                        "subTitle": "{{sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.subTitle}}",
                                        "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                                        "listFlavor": "carousel",
                                        "sortOrder": "ascending",
                                        "defaultSpan": {
                                            "rows": 37,
                                            "cols": 1
                                        },
                                        "staticContent": [{
                                            "title": "{{sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.0.title}}",
                                            "subTitle": "{{sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.0.subTitle}}",
                                            "imageUri": "img/carousel/HT-6100-large.jpg",
                                            "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.0.imageAltText}}",
                                            "targetUri": "https://google.com",
                                            "openInNewWindow": true
                                        }, {
                                            "title": "{{sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.1.title}}",
                                            "subTitle": "",
                                            "imageUri": "img/carousel/HT-6120-large.jpg",
                                            "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.1.imageAltText}}",
                                            "targetUri": "https://google.com",
                                            "openInNewWindow": true
                                        }]
                                    }
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Products 1"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Members displayed by role"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.0.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "HT-6100"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.0.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Doana Moore"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.0.imageAltText": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Doana Moore"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.1.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "HT-6120"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.customer.card016_C1.settings.staticContent.1.imageAltText": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Michael Adams"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "model": "purchaseOrder",
                        "template": "sap.ovp.cards.linklist",
                        "settings": {
                            "title": "Products 1",
                            "subTitle": "Members displayed by role",
                            "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                            "listFlavor": "carousel",
                            "sortOrder": "ascending",
                            "defaultSpan": {
                                "rows": 37,
                                "cols": 1
                            },
                            "staticContent": [{
                                "title": "HT-6100",
                                "subTitle": "Doana Moore",
                                "imageUri": "img/carousel/HT-6100-large.jpg",
                                "imageAltText": "Doana Moore",
                                "targetUri": "https://google.com",
                                "openInNewWindow": true
                            }, {
                                "title": "HT-6120",
                                "subTitle": "",
                                "imageUri": "img/carousel/HT-6120-large.jpg",
                                "imageAltText": "Michael Adams",
                                "targetUri": "https://google.com",
                                "openInNewWindow": true
                            }]
                        },
                        "id": "customer.card016_C1"
                    }
                };
                var oComponentContainer = createComponentContainer("card016");
                stop();
                PayLoadUtils.getPayLoadForCloneCard(oComponentContainer).then(function(mChangeContent) {
                    start();
                    var sCardId = mChangeContent.flexibilityChange.id,
                        oAppDesChange = mChangeContent.appDescriptorChange,
                        oSettings = oAppDesChange.parameters.card[sCardId].settings,
                        sTitle = oSettings.title,
                        sSubTitle = oSettings.subTitle,
                        sTabTitle1 = oSettings.staticContent[0].title,
                        sTabTitle2 = oSettings.staticContent[1].title,
                        sTabSubTitle1 = oSettings.staticContent[0].subTitle,
                        sTabSubTitle2 = oSettings.staticContent[1].subTitle,
                        sTabImageAltText1 = oSettings.staticContent[0].imageAltText,
                        sTabImageAltText2 = oSettings.staticContent[1].imageAltText,
                        oTexts = oAppDesChange.texts;
                    ok(!!oTexts[sTitle.substr(2, sTitle.length - 4)], "Title binding done properly in PayLoad");
                    ok(!!oTexts[sSubTitle.substr(2, sSubTitle.length - 4)], "SubTitle binding done properly in PayLoad");
                    ok(!!oTexts[sTabTitle1.substr(2, sTabTitle1.length - 4)], "Tab level property title's binding done properly in PayLoad");
                    ok(!!oTexts[sTabTitle2.substr(2, sTabTitle2.length - 4)], "Tab level property title's binding done properly in PayLoad");
                    ok(!!oTexts[sTabSubTitle1.substr(2, sTabSubTitle1.length - 4)], "Tab level property subTitle's binding done properly in PayLoad");
                    ok(sTabSubTitle2 === "", "Tab level property subTitle is empty, Hence it is not translated in PayLoad");
                    ok(!!oTexts[sTabImageAltText1.substr(2, sTabImageAltText1.length - 4)], "Tab level property imageAltText's binding done properly in PayLoad");
                    ok(!!oTexts[sTabImageAltText2.substr(2, sTabImageAltText2.length - 4)], "Tab level property imageAltText's binding done properly in PayLoad");
                    ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created for Clone of SAP Delivered Static Link List card");
                });
            });

            test("Function Test ---> getPayLoadForCloneCard ---> Multiple clone's from the same card", function() {
                var result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "card": {
                                "customer.card017_C2": {
                                    "model": "salesOrder",
                                    "template": "sap.ovp.cards.linklist",
                                    "settings": {
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.customer.card017_C2.settings.title}}",
                                        "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                                        "subTitle": "",
                                        "listFlavor": "standard",
                                        "entitySet": "ProductSet",
                                        "sortBy": "Name",
                                        "sortOrder": "ascending",
                                        "headerAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#header1",
                                        "defaultSpan": {
                                            "showOnlyHeader": true,
                                            "rows": 12
                                        }
                                    }
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.customer.card017_C2.settings.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Standard Dynamic Linklist Card 2"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.linklist",
                        "settings": {
                            "title": "Standard Dynamic Linklist Card 2",
                            "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                            "subTitle": "",
                            "listFlavor": "standard",
                            "entitySet": "ProductSet",
                            "sortBy": "Name",
                            "sortOrder": "ascending",
                            "headerAnnotationPath": "com.sap.vocabularies.UI.v1.HeaderInfo#header1",
                            "defaultSpan": {
                                "showOnlyHeader": true
                            }
                        },
                        "id": "customer.card017_C2"
                    }
                };
                var oComponentContainer = createComponentContainer("card017");
                stop();
                PayLoadUtils.getPayLoadForCloneCard(oComponentContainer).then(function(mChangeContent) {
                    start();
                    var sCardId = mChangeContent.flexibilityChange.id,
                        oAppDesChange = mChangeContent.appDescriptorChange,
                        oSettings = oAppDesChange.parameters.card[sCardId].settings,
                        sTitle = oSettings.title,
                        sSubTitle = oSettings.subTitle,
                        oTexts = oAppDesChange.texts;
                    ok(!!oTexts[sTitle.substr(2, sTitle.length - 4)], "Title binding done properly in PayLoad");
                    ok(sSubTitle === "", "SubTitle is empty, Hence it is not translated in PayLoad");
                    ok(sCardId === "customer.card017_C2", "Newly copied card Id should be customer.card017_2");
                    ok(oTexts[sTitle.substr(2, sTitle.length - 4)].value[""] === "Standard Dynamic Linklist Card 2", "Check card title is changed");
                    ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created for Clone of SAP Delivered Stack card");
                });
            });

            /**
             *  ------------------------------------------------------------------------------
             *  End of Test Cases for Creating PayLoad for Clone Card
             *  ------------------------------------------------------------------------------
             */

            /**
             *  ------------------------------------------------------------------------------
             *  Start of Test Cases for Creating PayLoad for Edit Card
             *  ------------------------------------------------------------------------------
             */

            test("Function Test ---> getPayLoadForEditCard ---> Edit of SAP Delivered card ---> Basic Card Settings", function() {
                var result = {
                        "appDescriptorChange": {
                            "parameters": {
                                "cardId": "card001",
                                "entityPropertyChange": {
                                    "propertyPath": "customer.settings",
                                    "operation": "UPSERT",
                                    "propertyValue": {
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.card001.customer.settings.title}}",
                                        "subTitle": {
                                            "operation": "DELETE"
                                        },
                                        "listType": "condensed",
                                        "listFlavor": "bar",
                                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#MoreItems"
                                    }
                                }
                            },
                            "texts": {
                                "sap.ovp.demo_sap.ovp.cards.card001.customer.settings.title": {
                                    "type": "XTIT",
                                    "maxLength": 40,
                                    "value": {
                                        "": "Product List"
                                    }
                                }
                            }
                        },
                        "flexibilityChange": {
                            "newAppDescriptor": {
                                "id": "card001",
                                "model": "purchaseOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "title": "Product List",
                                    "sortBy": "DeliveryDate",
                                    "sortOrder": "Descending",
                                    "listType": "condensed",
                                    "entitySet": "Zme_Overdue",
                                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#MoreItems",
                                    "customParams": "getParameters",
                                    "defaultSpan": {
                                        "minimumTitleRow": 2,
                                        "showOnlyHeader": false
                                    },
                                    "listFlavor": "bar"
                                },
                                "customer.settings": {
                                    "title": "{{sap.ovp.demo_sap.ovp.cards.card001.customer.settings.title}}",
                                    "subTitle": {
                                        "operation": "DELETE"
                                    },
                                    "listType": "condensed",
                                    "listFlavor": "bar",
                                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#MoreItems"
                                }
                            },
                            "oldAppDescriptor": {
                                "id": "card001",
                                "model": "purchaseOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "title": "Extended List Card",
                                    "subTitle": "By delivery date and value",
                                    "sortBy": "DeliveryDate",
                                    "sortOrder": "Descending",
                                    "listType": "extended",
                                    "entitySet": "Zme_Overdue",
                                    "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                                    "customParams": "getParameters",
                                    "defaultSpan": {
                                        "minimumTitleRow": 2,
                                        "showOnlyHeader": false
                                    }
                                }
                            }
                        }
                    },
                    sCardId = "card001",
                    oContext = {
                        _oCardManifestSettings: {
                            "title": "Product List",
                            "subTitle": "",
                            "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#MoreItems",
                            "listType": "condensed",
                            "listFlavor": "bar"
                        },
                        _oOriginalCardManifestSettings: {
                            "title": "Extended List Card",
                            "subTitle": "By delivery date and value",
                            "annotationPath": "com.sap.vocabularies.UI.v1.LineItem",
                            "listType": "extended"
                        }
                    },
                    settingsUtils = {
                        oAppDescriptor: oMainComponent._getCardFromManifest(sCardId),
                        sApplicationId: sApplicationId,
                        oOriginalAppDescriptor: oAppComponent._getOvpCardOriginalConfig(sCardId)
                    };
                var mChangeContent = PayLoadUtils.getPayLoadForEditCard.bind(oContext)(settingsUtils);
                ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created correctly on Edit of SAP Delivered card ---> Add, Update & Delete of Basic Card Settings");
            });

            test("Function Test ---> getPayLoadForEditCard ---> Edit of SAP Delivered card ---> Tab Level settings change", function() {
                var result = {
                        "appDescriptorChange": {
                            "parameters": {
                                "cardId": "card004",
                                "entityPropertyChange": {
                                    "propertyPath": "customer.settings",
                                    "operation": "UPSERT",
                                    "propertyValue": {
                                        "tabs": [{
                                            "value": "{{sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.0.value}}",
                                            "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                            "navigation": ""
                                        }, {
                                            "value": "{{sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.1.value}}",
                                            "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant",
                                            "navigation": "headerNav"
                                        }, {
                                            "value": "{{sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.2.value}}",
                                            "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#OtherSPV",
                                            "navigation": "headerNav"
                                        }]
                                    }
                                }
                            },
                            "texts": {
                                "sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.0.value": {
                                    "type": "XTIT",
                                    "maxLength": 40,
                                    "value": {
                                        "": "Actual Cost KPI"
                                    }
                                },
                                "sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.1.value": {
                                    "type": "XTIT",
                                    "maxLength": 40,
                                    "value": {
                                        "": "Actual Value KPI"
                                    }
                                },
                                "sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.2.value": {
                                    "type": "XTIT",
                                    "maxLength": 40,
                                    "value": {
                                        "": "Actual Value KPI 1"
                                    }
                                }
                            }
                        },
                        "flexibilityChange": {
                            "newAppDescriptor": {
                                "id": "card004",
                                "model": "salesShare",
                                "template": "sap.ovp.cards.charts.analytical",
                                "settings": {
                                    "title": "Total Purchase Order Value",
                                    "subTitle": "Year-to-date",
                                    "entitySet": "SalesShareDonut",
                                    "valueSelectionInfo": "Categorized by products",
                                    "customParams": "getParameters",
                                    "tabs": [{
                                        "value": "Actual Cost KPI",
                                        "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                        "navigation": ""
                                    }, {
                                        "value": "Actual Value KPI",
                                        "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant",
                                        "navigation": "headerNav"
                                    }, {
                                        "value": "Actual Value KPI 1",
                                        "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#OtherSPV",
                                        "navigation": "headerNav"
                                    }]
                                },
                                "customer.settings": {
                                    "tabs": [{
                                        "value": "{{sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.0.value}}",
                                        "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                        "navigation": ""
                                    }, {
                                        "value": "{{sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.1.value}}",
                                        "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant",
                                        "navigation": "headerNav"
                                    }, {
                                        "value": "{{sap.ovp.demo_sap.ovp.cards.card004.customer.settings.tabs.2.value}}",
                                        "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#OtherSPV",
                                        "navigation": "headerNav"
                                    }]
                                }
                            },
                            "oldAppDescriptor": {
                                "id": "card004",
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
                                    }]
                                }
                            }
                        }
                    },
                    sCardId = "card004",
                    oContext = {
                        _oCardManifestSettings: {
                            "tabs": [
                                {
                                    "kpiAnnotationPath":"com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                    "value": "Actual Cost KPI",
                                    "navigation": ""

                                },
                                {
                                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant",
                                    "value": "Actual Value KPI",
                                    "navigation": "headerNav"
                                },
                                {
                                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#OtherSPV",
                                    "value": "Actual Value KPI 1",
                                    "navigation": "headerNav"
                                }
                            ]
                        },
                        _oOriginalCardManifestSettings: {
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
                    },
                    settingsUtils = {
                        oAppDescriptor: oMainComponent._getCardFromManifest(sCardId),
                        sApplicationId: sApplicationId,
                        oOriginalAppDescriptor: oAppComponent._getOvpCardOriginalConfig(sCardId)
                    };
                var mChangeContent = PayLoadUtils.getPayLoadForEditCard.bind(oContext)(settingsUtils);
                ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created correctly on Edit of SAP Delivered card ---> Add, Update & Delete of Tab Level Settings | Also Adding of new Tab in the card");

                result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "cardId": "card004",
                            "entityPropertyChange": {
                                "propertyPath": "customer.settings",
                                "operation": "UPSERT",
                                "propertyValue": {
                                    "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                    "navigation": "noHeaderNav",
                                    "tabs": {
                                        "operation": "DELETE"
                                    }
                                }
                            }
                        },
                        "texts": {}
                    },
                    "flexibilityChange": {
                        "newAppDescriptor": {
                            "id": "card004",
                            "model": "salesShare",
                            "template": "sap.ovp.cards.charts.analytical",
                            "settings": {
                                "title": "Total Purchase Order Value",
                                "subTitle": "Year-to-date",
                                "entitySet": "SalesShareDonut",
                                "valueSelectionInfo": "Categorized by products",
                                "customParams": "getParameters",
                                "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                "navigation": "noHeaderNav"
                            },
                            "customer.settings": {
                                "kpiAnnotationPath": "com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                                "navigation": "noHeaderNav",
                                "tabs": {
                                    "operation": "DELETE"
                                }
                            }
                        },
                        "oldAppDescriptor": {
                            "id": "card004",
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
                                }]
                            }
                        }
                    }
                };

                oContext._oCardManifestSettings = {
                    "kpiAnnotationPath":"com.sap.vocabularies.UI.v1.KPI#AllActualCosts",
                    "value": "KPI Annotation",
                    "navigation": "noHeaderNav"
                };

                mChangeContent = PayLoadUtils.getPayLoadForEditCard.bind(oContext)(settingsUtils);
                ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created correctly on Edit of SAP Delivered card ---> Delete one Tab ---> Properties come out to the settings level");

                result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "cardId": "card016",
                            "entityPropertyChange": {
                                "propertyPath": "customer.settings",
                                "operation": "UPSERT",
                                "propertyValue": {
                                    "staticContent": [{
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.title}}",
                                        "subTitle": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.subTitle}}",
                                        "imageUri": "img/carousel/HT-6100-large.jpg",
                                        "semanticObject": "OVP",
                                        "action": "App"
                                    }, {
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.1.title}}",
                                        "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.1.imageAltText}}",
                                        "imageUri": "img/carousel/HT-6120-large.jpg",
                                        "targetUri": "https://google.com",
                                        "openInNewWindow": true
                                    }, {
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.title}}",
                                        "subTitle": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.subTitle}}",
                                        "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.imageAltText}}",
                                        "imageUri": "img/carousel/HT-6120-large.jpg",
                                        "targetUri": "https://google.com",
                                        "openInNewWindow": true
                                    }]
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "HT-6100"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Doana Moore"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.1.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "HT-6120"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.1.imageAltText": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Michael Adams"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "HP-6000"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.subTitle": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Michael William"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.imageAltText": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Michael William"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "newAppDescriptor": {
                            "id": "card016",
                            "model": "purchaseOrder",
                            "template": "sap.ovp.cards.linklist",
                            "settings": {
                                "title": "Products",
                                "subTitle": "Members displayed by role",
                                "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                                "listFlavor": "carousel",
                                "sortOrder": "ascending",
                                "defaultSpan": {
                                    "rows": 37,
                                    "cols": 1
                                },
                                "staticContent": [{
                                    "title": "HT-6100",
                                    "subTitle": "Doana Moore",
                                    "imageUri": "img/carousel/HT-6100-large.jpg",
                                    "semanticObject": "OVP",
                                    "action": "App"
                                }, {
                                    "title": "HT-6120",
                                    "imageAltText": "Michael Adams",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }, {
                                    "title": "HP-6000",
                                    "subTitle": "Michael William",
                                    "imageAltText": "Michael William",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }]
                            },
                            "customer.settings": {
                                "staticContent": [{
                                    "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.title}}",
                                    "subTitle": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.subTitle}}",
                                    "imageUri": "img/carousel/HT-6100-large.jpg",
                                    "semanticObject": "OVP",
                                    "action": "App"
                                }, {
                                    "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.1.title}}",
                                    "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.1.imageAltText}}",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }, {
                                    "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.title}}",
                                    "subTitle": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.subTitle}}",
                                    "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.2.imageAltText}}",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }]
                            }
                        },
                        "oldAppDescriptor": {
                            "id": "card016",
                            "model": "purchaseOrder",
                            "template": "sap.ovp.cards.linklist",
                            "settings": {
                                "title": "Products",
                                "subTitle": "Members displayed by role",
                                "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                                "listFlavor": "carousel",
                                "sortOrder": "ascending",
                                "defaultSpan": {
                                    "rows": 37,
                                    "cols": 1
                                },
                                "staticContent": [{
                                    "title": "HT-6100",
                                    "subTitle": "Doana Moore",
                                    "imageUri": "img/carousel/HT-6100-large.jpg",
                                    "imageAltText": "Doana Moore",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }, {
                                    "title": "HT-6120",
                                    "subTitle": "",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "imageAltText": "Michael Adams",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }]
                            }
                        }
                    }
                };

                sCardId = "card016";

                oContext = {
                    _oCardManifestSettings: {
                        "staticContent": [
                            {
                                "title": "HT-6100",
                                "subTitle": "Doana Moore",
                                "imageUri": "img/carousel/HT-6100-large.jpg",
                                "imageAltText": "",
                                "semanticObject": "OVP",
                                "action": "App"
                            },
                            {
                                "title": "HT-6120",
                                "subTitle": "",
                                "imageUri": "img/carousel/HT-6120-large.jpg",
                                "imageAltText": "Michael Adams",
                                "targetUri": "https://google.com",
                                "openInNewWindow": true
                            },
                            {
                                "title": "HP-6000",
                                "subTitle": "Michael William",
                                "imageUri": "img/carousel/HT-6120-large.jpg",
                                "imageAltText": "Michael William",
                                "targetUri": "https://google.com",
                                "openInNewWindow": true
                            }
                        ]
                    },
                    _oOriginalCardManifestSettings: {
                        "staticContent": [
                            {
                                "title": "HT-6100",
                                "subTitle": "Doana Moore",
                                "imageUri": "img/carousel/HT-6100-large.jpg",
                                "imageAltText": "Doana Moore",
                                "targetUri": "https://google.com",
                                "openInNewWindow": true
                            },
                            {
                                "title": "HT-6120",
                                "subTitle": "",
                                "imageUri": "img/carousel/HT-6120-large.jpg",
                                "imageAltText": "Michael Adams",
                                "targetUri": "https://google.com",
                                "openInNewWindow": true
                            }
                        ]
                    }
                };

                settingsUtils = {
                    oAppDescriptor: oMainComponent._getCardFromManifest(sCardId),
                    sApplicationId: sApplicationId,
                    oOriginalAppDescriptor: oAppComponent._getOvpCardOriginalConfig(sCardId)
                };

                mChangeContent = PayLoadUtils.getPayLoadForEditCard.bind(oContext)(settingsUtils);
                ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created correctly on Edit of SAP Delivered card ---> Add, Update & Delete of Tab Level Settings | Also Adding of new Tab in Static Link List card");

                result = {
                    "appDescriptorChange": {
                        "parameters": {
                            "cardId": "card016",
                            "entityPropertyChange": {
                                "propertyPath": "customer.settings",
                                "operation": "UPSERT",
                                "propertyValue": {
                                    "staticContent": [{
                                        "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.title}}",
                                        "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.imageAltText}}",
                                        "imageUri": "img/carousel/HT-6120-large.jpg",
                                        "targetUri": "https://google.com",
                                        "openInNewWindow": true
                                    }]
                                }
                            }
                        },
                        "texts": {
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.title": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "HT-6120"
                                }
                            },
                            "sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.imageAltText": {
                                "type": "XTIT",
                                "maxLength": 40,
                                "value": {
                                    "": "Michael Adams"
                                }
                            }
                        }
                    },
                    "flexibilityChange": {
                        "newAppDescriptor": {
                            "id": "card016",
                            "model": "purchaseOrder",
                            "template": "sap.ovp.cards.linklist",
                            "settings": {
                                "title": "Products",
                                "subTitle": "Members displayed by role",
                                "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                                "listFlavor": "carousel",
                                "sortOrder": "ascending",
                                "defaultSpan": {
                                    "rows": 37,
                                    "cols": 1
                                },
                                "staticContent": [{
                                    "title": "HT-6120",
                                    "imageAltText": "Michael Adams",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }]
                            },
                            "customer.settings": {
                                "staticContent": [{
                                    "title": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.title}}",
                                    "imageAltText": "{{sap.ovp.demo_sap.ovp.cards.card016.customer.settings.staticContent.0.imageAltText}}",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }]
                            }
                        },
                        "oldAppDescriptor": {
                            "id": "card016",
                            "model": "purchaseOrder",
                            "template": "sap.ovp.cards.linklist",
                            "settings": {
                                "title": "Products",
                                "subTitle": "Members displayed by role",
                                "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                                "listFlavor": "carousel",
                                "sortOrder": "ascending",
                                "defaultSpan": {
                                    "rows": 37,
                                    "cols": 1
                                },
                                "staticContent": [{
                                    "title": "HT-6100",
                                    "subTitle": "Doana Moore",
                                    "imageUri": "img/carousel/HT-6100-large.jpg",
                                    "imageAltText": "Doana Moore",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }, {
                                    "title": "HT-6120",
                                    "subTitle": "",
                                    "imageUri": "img/carousel/HT-6120-large.jpg",
                                    "imageAltText": "Michael Adams",
                                    "targetUri": "https://google.com",
                                    "openInNewWindow": true
                                }]
                            }
                        }
                    }
                };

                oContext._oCardManifestSettings = {
                    "staticContent": [
                        {
                            "title": "HT-6120",
                            "subTitle": "",
                            "imageUri": "img/carousel/HT-6120-large.jpg",
                            "imageAltText": "Michael Adams",
                            "targetUri": "https://google.com",
                            "openInNewWindow": true
                        }
                    ]
                };

                mChangeContent = PayLoadUtils.getPayLoadForEditCard.bind(oContext)(settingsUtils);
                ok(JSON.stringify(mChangeContent) == JSON.stringify(result), "PayLoad created correctly on Edit of SAP Delivered card ---> Delete one Tab from Static Link List Card");

            });

            /**
             *  ------------------------------------------------------------------------------
             *  End of Test Cases for Creating PayLoad for Edit Card
             *  ------------------------------------------------------------------------------
             */

        });
