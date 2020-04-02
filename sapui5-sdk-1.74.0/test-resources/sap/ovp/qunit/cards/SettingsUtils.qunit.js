sap.ui.define([
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/SettingsUtils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (OVPCardAsAPIUtils, SettingsUtils, mockservers, jquery) {
            "use strict";
            /* module, ok, test, jQuery, sap */

            //jQuery.sap.require("sap.ovp.cards.SettingsUtils");
            //jQuery.sap.require("sap/ovp/cards/OVPCardAsAPIUtils");

            var oSettingsUtils = SettingsUtils;
            var OVPCardAsAPIUtils = OVPCardAsAPIUtils;

            module("sap.ovp.cards.SettingsUtils", {
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
             *  Creating mock object to test dialog creation functionality
             *  ------------------------------------------------------------------------------
             */
            function fnComponentContainer(data1, layout) {
                var oComponentContainer = {
                    getComponentInstance: function () {
                        return {
                            getRootControl: function () {
                                return {
                                    getModel: function (model) {
                                        return {
                                            getData: function () {
                                                return {
                                                    entityType: data1,
                                                    template: "sap.ovp.cards.list",
                                                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem",
                                                    sortOrder: "Descending",
                                                    listType: "extended",
                                                    layoutDetail: layout
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            getComponentData: function () {
                                return {
                                    i18n: "i18n",
                                    mainComponent:
                                    {
                                        _getCardFromManifest: function (cardId) {
                                            return {
                                                id: "card001",
                                                model: "purchaseOrder",
                                                settings: {},
                                                template: "sap.ovp.cards.list"
                                            }
                                        },
                                        _getApplicationId: function () {
                                            return "sap.ovp.demo"
                                        },
                                        _getTemplateForChart: function (oManifest) {
                                            return oManifest
                                        }
                                    },

                                    appComponent: {
                                        _getOvpCardOriginalConfig: function (cardId) {
                                            return {
                                                model: "purchaseOrder",
                                                settings: {},
                                                template: "sap.ovp.cards.list"
                                            }
                                        },
                                        getModel: function (modelName) {
                                            return { id: "model1" }
                                        }
                                    },
                                    cardId: "card001",
                                    modelName: "purchaseOrder"
                                };
                            }
                        }
                    },
                    getDomRef: function () {
                        return { offsetHeight: 419 }
                    }
                }
                return oComponentContainer;
            }
            /**
             *  ------------------------------------------------------------------------------
             *  Start of test cases to test if all generic annotations are set properly
             *  ------------------------------------------------------------------------------
             */
            test("getDialogBox(), All generic annotation are set properly to model ", function () {
                var oAnnotations = {
                    property: [{
                        name: "DeliveryDate"
                    }],
                    "com.sap.vocabularies.UI.v1.LineItem#Purchase_Order": [{
                        "com.sap.vocabularies.UI.v1.Importance": {
                            EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
                        }
                    }],
                    "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD":
                    {
                        "Text": {
                            String: "Filter with Image Type blanknD"
                        }
                    },
                    "com.sap.vocabularies.UI.v1.Identification#New": [
                        {
                            "Label": {
                                String: "To Procurement Page"
                            },
                            "com.sap.vocabularies.UI.v1.Importance": {
                                EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
                            },
                            RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
                        }
                    ],
                    "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate":
                    {
                        "Title": {
                            String: "Delivery Date"
                        }
                    },
                    "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts":
                    {
                        "Description": {
                            Label: {
                                String: "Delivery Date"
                            }
                        }
                    },
                    "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                        "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                            String: "All Actual Costs"
                        }
                    },
                    "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut": {
                        "Description": {
                            Label: {
                                String: "Delivery Date"
                            }
                        }
                    }
                }
                var oComponentContainer = fnComponentContainer(oAnnotations, "fixed");
                oSettingsUtils.getDialogBox(oComponentContainer);
                var createCardComponentStub = sinon.stub(OVPCardAsAPIUtils, "createCardComponent", function () { return true });
                var dialogBoxOpenStub = sinon.stub(oSettingsUtils.dialogBox, "open", function () { return false });
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    var actualModel = oSettingsUtils.dialogBox.getContent()[0];
                    ok(actualResult.layoutDetail === "fixed", "added properties for fixed layout");
                    ok(actualResult.listFlavorName === "Bar Chart");
                    ok(actualResult.selectionVariant.length !== 0, "selection variant added properly in model");
                    ok(actualResult.KPI.length !== 0, "KPI added properly in model");
                    ok(actualResult.dataPoint.length !== 0, "dataPoint added properly in model");
                    ok(actualResult.dynamicSubTitle.length !== 0, "HeaderInfo added properly in model");
                    ok(actualResult.identification.length !== 0, "identification added properly in model");
                    ok(actualResult.lineItem.length !== 0, "dataPoint added properly in model");
                    ok(actualResult.chart.length !== 0, "chart added properly in model");
                    ok(actualModel.getModel("deviceMediaProperties") !== undefined, "device model is set");
                    ok(actualModel.getModel("@i18n") !== undefined, "i18n model is set");
                    ok(actualModel.getModel() !== undefined, "cardProperties model is set as default model");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });

            });
            /**
             *  ------------------------------------------------------------------------------
             *  End of test cases to test if all generic annotations are set properly
             *  ------------------------------------------------------------------------------
             */

            /**
            *  ------------------------------------------------------------------------------
            *  Start of test cases to test if all the annotations names and values are set properly
            *  ------------------------------------------------------------------------------
            */
            test("getDialogBox(), label and value of identification annotation are set properly to model, recordType is intentBasedNavigation  ", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.Identification#New": [
                        {
                            "Label": {
                                String: "To Procurement Page"
                            },
                            RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
                        }
                    ]
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.identification[0].name === "To Procurement Page", "identification label set properly");
                    ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New", "identification value set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });

            test("getDialogBox(), label and value of identification are not set in this case label would be the combination of semantic object and action, recordType is intentBasedNavigation  ", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.Identification#New1": [
                        {
                            "SemanticObject": {
                                String: "Action"
                            },
                            "Action": {
                                String: "toappnavsample"
                            },
                            RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
                        }
                    ]
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.identification[0].name === "Action-toappnavsample", "identification label set properly");
                    ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New1", "identification value set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), label and value of identification set properly, recordType is DataFieldWithUrl  ", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.Identification#New": [
                        {
                            "Label": {
                                String: "To Procurement Page"
                            },
                            RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl"
                        }
                    ]
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.identification[0].name === "To Procurement Page", "identification label is set properly");
                    ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New", "identification value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });

            test("getDialogBox(), in case of identification when there is no label annotation then set Url string as label, recordType is DataFieldWithUrl  ", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.Identification#New": [
                        {
                            "Url": {
                                String: "Url Type"
                            },
                            RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl"
                        }
                    ]
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.identification[0].name === "Url Type", "identification label is set properly");
                    ok(actualResult.identification[0].value === "com.sap.vocabularies.UI.v1.Identification#New", "identification value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), HeaderInfo when description is present", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts":
                    {
                        "Description": {
                            Label: {
                                String: "Delivery Date"
                            }
                        }
                    }
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.dynamicSubTitle[0].name === "Delivery Date", "HeaderInfo description is set properly");
                    ok(actualResult.dynamicSubTitle[0].value === "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts", "HeaderInfo value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), HeaderInfo when description is not present then set default label", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts": {},
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.dynamicSubTitle[0].name === "No label defined - \"AllActualCosts\"", "default HeaderInfo label is set properly");
                    ok(actualResult.dynamicSubTitle[0].value === "com.sap.vocabularies.UI.v1.HeaderInfo#AllActualCosts", "HeaderInfo value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), set label for SelectionVariant,PresentationVariant and SelectionPresentationVariant", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD":
                    {
                        "Text": {
                            String: "Filter with Image Type blanknD"
                        }
                    }
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.selectionVariant[0].name === "Filter with Image Type blanknD", "label is set properly");
                    ok(actualResult.selectionVariant[0].value === "com.sap.vocabularies.UI.v1.SelectionVariant#blanknD", "HeaderInfo value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), set label for DataPoint", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate":
                    {
                        "Title": {
                            String: "Delivery Date"
                        }
                    }
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.dataPoint[0].name === "Delivery Date", "label is set properly");
                    ok(actualResult.dataPoint[0].value === "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate", "DataPoint value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), set label for Chart", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut": {
                        "Description": {
                            String: "Delivery Date"
                        }
                    }
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.chart[0].name === "Delivery Date", "label is set properly");
                    ok(actualResult.chart[0].value === "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut", "Chart value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), set default label for Chart when description is not present", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut": {}
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.chart[0].name === "No label defined - \"Eval_by_Currency_Donut\"", "label is set properly");
                    ok(actualResult.chart[0].value === "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_Donut", "Chart value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), set label for LineItem", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.LineItem#Purchase_Order": [{
                        "com.sap.vocabularies.UI.v1.Importance": {
                            EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
                        }
                    }]
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.lineItem[0].name === "Option 1", "label is set properly");
                    ok(actualResult.lineItem[0].value === "com.sap.vocabularies.UI.v1.LineItem#Purchase_Order", "LineItem value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            test("getDialogBox(), set label for KPI", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                        "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                            String: "All Actual Costs"
                        }
                    }
                };
                var oContainerData = fnComponentContainer(oEntityType);
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.KPI[0].name === "All Actual Costs", "label is set properly");
                    ok(actualResult.KPI[0].value === "com.sap.vocabularies.UI.v1.KPI#AllActualCosts", "KPI value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });
            /**
             *  ------------------------------------------------------------------------------
             *  End of test cases to test if all the annotations names and values are set properly
             *  ------------------------------------------------------------------------------
             */
            test("Function test -> addSupportingObjects -> adding supporting object of all Entity Set label's -> Null check's are also done", function () {
                var oData = {
                    entityType: {},
                    addNewCard: false,
                    metaModel: {
                        getODataEntityContainer: function () {
                            return {
                                entitySet: [{
                                    entityType: "A",
                                    name: "A"
                                }, {
                                    entityType: "B",
                                    name: "B"
                                }, {
                                    entityType: "C",
                                    name: "C"
                                }]
                            };
                        },
                        getODataEntityType: function (sEntityType) {
                            if (sEntityType === "A") {
                                return {
                                    "sap:label": "My name is A"
                                };
                            } else if (sEntityType === "B") {
                                return {};
                            } else if (sEntityType === "C") {
                                return {
                                    "sap:label": "My name is C"
                                }
                            }
                            return {};
                        }
                    },
                    template: "sap.ovp.cards.list"
                };
                var result = [{
                    "name": "My name is A",
                    "value": "A"
                }, {
                    "name": "No label defined - \"B\"",
                    "value": "B"
                }, {
                    "name": "My name is C",
                    "value": "C"
                }];
                var actualResult = oSettingsUtils.addSupportingObjects(oData);
                ok(actualResult["allEntitySet"].length === 3, "There are three Entity Set");
                deepEqual(actualResult["allEntitySet"], result, "Check if label's are correctly coming for these Entity Set");

                delete oData.metaModel;
                delete oData["allEntitySet"];
                actualResult = oSettingsUtils.addSupportingObjects(oData);
                ok(!actualResult["allEntitySet"], "Check if there is no metaModel");
            });
            test("Function test -> getVisibilityOfElement -> Checking the visibility of Entity property in the dialog's form", function () {
                var oCardProperties = {
                    mainViewSelected: true
                };
                ok(!oSettingsUtils.getVisibilityOfElement(oCardProperties, "showEntitySet", false), "If view switch is not there then it return false");
                ok(!oSettingsUtils.getVisibilityOfElement(oCardProperties, "showEntitySet", true), "If main view is selected then it return false");

                oCardProperties = {
                    mainViewSelected: false,
                    selectedKey: 2,
                    tabs: [{
                        "entitySet": "A"
                    }, {
                        "entitySet": "B"
                    }]
                };
                ok(oSettingsUtils.getVisibilityOfElement(oCardProperties, "showEntitySet", true), "This will return true because we have Entity Set property at tab level");
            });
            test("getTrimmedDataURIName() - To trim the data Url", function () {
                var sDataUri = "/sap/opu/odata/sap/ZEM_C_TOTACCTRECV_CDS";
                var actualResult = oSettingsUtils.getTrimmedDataURIName(sDataUri);
                var expectedResult = "ZEM_C_TOTACCTRECV_CDS";
                ok(actualResult === expectedResult, "Data Uri is trimmed");
            });

            test("getQualifier()- To get specific qualifier", function () {
                var sAnnotation = "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked";
                var actualResult = oSettingsUtils.getQualifier(sAnnotation);
                var expectedResult = "Eval_by_Currency_ColumnStacked";
                ok(actualResult === expectedResult, "Qualifier is seperated");
            });

            test("getQualifier()- Get Default Value", function () {
                var sAnnotation = "com.sap.vocabularies.UI.v1.SelectionVariant";
                var actualResult = oSettingsUtils.getQualifier(sAnnotation);
                var expectedResult = "Default";
                ok(actualResult === expectedResult, "Default annotation is taken");
            });

            test("addmanifestSettings()- add the manifest property", function () {
                var oData = {
                    sortOrder: "ascending",
                    listType: "extended",
                    listFlavour: "bar",
                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint"
                };
                var expectedResult = {
                    "sortOrder": "ascending",
                    "listType": "extended",
                    "listFlavour": "bar",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint",
                    "isExtendedList": true,
                    "isBarList": false,
                    "hasKPIHeader": true
                };
                ok(JSON.stringify(oSettingsUtils.addManifestSettings(oData)) == JSON.stringify(expectedResult), "To add the settings to the manifest");
            });

            test("setVisibllity()- Properties for List Card", function () {
                var oCardProperties = {
                    "dataPoint": [
                        {
                            "name": "Delivery Date",
                            "value": "com.sap.vocabularies.UI.v1.DataPoint#Purchase_Order_DeliveryDate"
                        },
                        {
                            "name": "Purchase Order",
                            "value": "com.sap.vocabularies.UI.v1.DataPoint#PurchaseOrder"
                        }
                    ],
                    "dynamicSubTitle": {
                        "name": "No label defined - Default",
                        "value": "com.sap.vocabularies.UI.v1.HeaderInfo"
                    },
                    "lineItem": [
                        {
                            "field": [
                                {
                                    "Label": {
                                        "String": "Order ID (Company)"
                                    },
                                    "Value": {
                                        "Path": "SalesOrderID"
                                    }
                                },
                                {
                                    "Label": {
                                        "String": "Contract"
                                    },
                                    "Value": {
                                        "Path": "CustomerName"
                                    }
                                }
                            ],
                            "name": "No label defined - Default",
                            "value": "com.sap.vocabularies.UI.v1.LineItem"
                        },
                        {
                            "field": [
                                {
                                    "Label": {
                                        "String": "Order ID (Company)"
                                    },
                                    "Value": {
                                        "Path": "SalesOrderID"
                                    }
                                },
                                {
                                    "Label": {
                                        "String": "Contract"
                                    },
                                    "Value": {
                                        "Path": "CustomerName"
                                    }
                                }
                            ],
                            "name": "No label defined - Default",
                            "value": "com.sap.vocabularies.UI.v1.LineItem"
                        }
                    ],
                    "lineItemQualifier": "No label defined - Default",
                    "listFlavorName": "Bar Chart",
                    "listType": "extended",
                    "sortBy": "DeliveryDate",
                    "sortOrder": "descending",
                    "subTitle": "By delivery date and value",
                    "template": "sap.ovp.cards.list",
                    "title": "Extended List Card"
                }
                oSettingsUtils.setVisibilityForFormElements(oCardProperties);
                ok(oSettingsUtils.oVisibility.dynamicSwitchSubTitle == true);
                ok(oSettingsUtils.oVisibility.subTitle == true);
                ok(oSettingsUtils.oVisibility.title == true);
                ok(oSettingsUtils.oVisibility.lineItem == true);
                ok(oSettingsUtils.oVisibility.viewSwitchEnabled == true);
            });

            test("setVisibllity()- Properties for Link Card", function () {
                var oCardProperties = {
                    "lineItemQualifier": "No label defined - Default",
                    "listFlavorName": "Bar Chart",
                    "listType": "extended",
                    "sortBy": "DeliveryDate",
                    "sortOrder": "descending",
                    "subTitle": "New Dynamic Sub Title",
                    "template": "sap.ovp.cards.list",
                    "title": "New Title",
                    "staticContent": []
                }
                oSettingsUtils.setVisibilityForFormElements(oCardProperties);
                ok(oSettingsUtils.oVisibility.listType == true);
                ok(oSettingsUtils.oVisibility.listFlavor == true);
                ok(oSettingsUtils.oVisibility.subTitle == true);
                ok(oSettingsUtils.oVisibility.showMore == true);
            });

            test("checkClonedCard()- Check the clonedCard", function () {
                var cardId = "NewKPI_C";
                var expectedResult = oSettingsUtils.checkClonedCard(cardId);
                ok(expectedResult == true);
            });
            test("setVisibllity()- Properties for static Link list Card", function () {
                var oCardProperties = {
                    "template": "sap.ovp.cards.linklist",
                    "title": "New Title",
                    "staticContent": [{
                        id: "linkListItem--1",
                        index: "Index--1",
                        subTitle: "Default SubTitle",
                        targetUri: "www.google.com",
                        title: "test"
                    }
                    ]
                };
                var expected = {"Index--1":true}
                oSettingsUtils.setVisibilityForFormElements(oCardProperties);
                ok(JSON.stringify(oSettingsUtils.oVisibility.staticLink) == JSON.stringify(expected));
                ok(JSON.stringify(oSettingsUtils.oVisibility.removeVisual) == JSON.stringify(expected));
                ok(JSON.stringify(oSettingsUtils.oVisibility.showMore) == JSON.stringify(expected));
            });

            test("getDialogBox(), Resizable Layout", function () {
                var oEntityType = {
                    "com.sap.vocabularies.UI.v1.KPI#AllActualCosts": {
                        "com.sap.vocabularies.Common.v1.Label#AllActualCosts": {
                            String: "All Actual Costs"
                        }
                    }
                };
                var oContainerData = fnComponentContainer(oEntityType, "resizable");
                oSettingsUtils.getDialogBox(oContainerData);
                stop();
                oSettingsUtils.dialogBox.getContent()[0].loaded().then(function (oView) {
                    start();
                    var actualResult = oSettingsUtils.dialogBox.getContent()[0].getModel().oData;
                    ok(actualResult.KPI[0].name === "All Actual Costs", "label is set properly");
                    ok(actualResult.KPI[0].value === "com.sap.vocabularies.UI.v1.KPI#AllActualCosts", "KPI value is set properly");
                    oSettingsUtils.dialogBox.fireAfterClose();
                });
            });



        });
