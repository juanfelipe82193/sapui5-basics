sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
],function (utils, mockservers, jquery) {
            "use strict";
            /* jQuery, sap */

            /**
             * This is a hack, as the namespace 'sap.ovp.demo' when run in the qunit results in wrong resource prefix
             * so i change now manually - to continue work. consult Aviad what causes this so we could remove this.
             */
            //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");

            var utils = utils;

            module("sap.ovp.cards.Generic", {
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

            test("Card Navigation Test - _checkIfCardFiltersAreValid function", function () {
                var mFilterPreference;
                var sPropertyName = "CurrencyCode";
                var oController = new sap.ui.controller("sap.ovp.cards.generic.Card");

                ok(oController._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === true, "If there is no filter preference");

                mFilterPreference = {
                    "filterAll": "global"
                };
                ok(oController._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === false, "Filter preference ---> Filter all global");

                mFilterPreference = {
                    "globalFilter": ["lol", "ro"]
                };
                ok(oController._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === true, "Filter preference ---> Global filter array ---> sPropertyName is no present");

                mFilterPreference = {
                    "globalFilter": ["lol", "ro", "CurrencyCode"]
                };
                ok(oController._checkIfCardFiltersAreValid(mFilterPreference, sPropertyName) === false, "Filter preference ---> Global filter array ---> sPropertyName is present");
            });

            test("Card Navigation Test - _getFilterPreference function", function () {
                var oComponent;
                var oController = new sap.ui.controller("sap.ovp.cards.generic.Card");
                var getOwnerComponentStub = sinon.stub(oController, "getOwnerComponent");
                getOwnerComponentStub.returns(oComponent);
                ok(!oController._getFilterPreference(), "If no owner component");

                var oComponentData;
                oComponent = {
                    "getComponentData": function () {
                        return oComponentData;
                    }
                };
                getOwnerComponentStub.returns(oComponent);
                ok(!oController._getFilterPreference(), "If no component data");

                oComponentData = {
                    "mainComponent": null
                };
                ok(!oController._getFilterPreference(), "If no main component");

                oComponentData = {
                    "mainComponent": {
                        "_getFilterPreference": function () {
                            return "Filter Preference";
                        }
                    }
                };
                ok(oController._getFilterPreference() === "Filter Preference", "If there is filter preference");

                getOwnerComponentStub.restore();
            });

            test("Card Navigation Test - _removeFilterFromGlobalFilters function", function () {
                var mFilterPreference;
                var oSelectionVariant = new sap.ui.generic.app.navigation.service.SelectionVariant();
                var oController = new sap.ui.controller("sap.ovp.cards.generic.Card");

                oSelectionVariant = oController._removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
                ok(oSelectionVariant.getPropertyNames().length === 0, "No filter preference ---> Without filters");

                var oResult = ["$.basicSearch"];
                oSelectionVariant.addSelectOption("$.basicSearch", "I", "EQ", "lol", null);
                oSelectionVariant = oController._removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
                ok(oSelectionVariant.getPropertyNames().length === 1, "No filter preference ---> With filters ---> check length");
                ok(JSON.stringify(oSelectionVariant.getPropertyNames()) === JSON.stringify(oResult), "No filter preference ---> With filters ---> check properties");

                oResult = ["$.basicSearch", "SalesOrderId"];
                oSelectionVariant.addSelectOption("SalesOrderId", "I", "BT", "5000001", "5000009");
                oSelectionVariant.addSelectOption("CurrencyCode", "I", "EQ", "INR", null);
                mFilterPreference = {
                    "cardFilter": ["CurrencyCode"]
                };
                oSelectionVariant = oController._removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
                ok(oSelectionVariant.getPropertyNames().length === 2, "Filter preference ---> Card filters array ---> check length");
                ok(JSON.stringify(oSelectionVariant.getPropertyNames()) === JSON.stringify(oResult), "Filter preference ---> Card filters array ---> check properties");

                oResult = ["$.basicSearch"];
                oSelectionVariant.addSelectOption("ProductId", "I", "EQ", "PC001", null);
                mFilterPreference = {
                    "filterAll": "card"
                };
                oSelectionVariant = oController._removeFilterFromGlobalFilters(mFilterPreference, oSelectionVariant);
                ok(oSelectionVariant.getPropertyNames().length === 1, "Filter preference ---> All Card filters ---> check length");
                ok(JSON.stringify(oSelectionVariant.getPropertyNames()) === JSON.stringify(oResult), "Filter preference ---> All Card filters ---> check properties");
            });

            test("Card Navigation Test- _getEntityNavigationParameters for static link list card with semantic object and action", function () {
                jQuery.sap.require("sap.ovp.cards.CommonUtils");
                var oController = new sap.ui.controller("sap.ovp.cards.generic.Card");
                var getNavigationHandlerStub = sinon.stub(sap.ovp.cards.CommonUtils, "getNavigationHandler", function () {
                    return {
                        mixAttributesAndSelectionVariant: function (oContextParameters, oSelectionVariant, iSuppressionBehavior) {
                            return {
                                toJSONString: function () {
                                    return {
                                        oContextParameters: oContextParameters,
                                        oSelectionVariant: oSelectionVariant,
                                        iSuppressionBehavior: iSuppressionBehavior
                                    }
                                }
                            }
                        }
                    }
                });
                oController.getOwnerComponent = function () {
                    return {
                        getComponentData: function () {
                            return {
                                globalFilter: {
                                    getUiState: function () {
                                        var oSelectionVariant = JSON.parse('{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}');
                                        return {
                                            selectionVariant: oSelectionVariant,
                                            getSelectionVariant: function () {
                                                return oSelectionVariant;
                                            }

                                        };
                                    }
                                }
                            }
                        }
                    }
                };
                oController.getCardPropertiesModel = function () {
                    var oCardProp = {
                        "title": "Recent Contacts",
                        "template": "sap.ovp.cards.linklist",
                        "targetUri": "https://en.wikipedia.org/wiki/Mangalyaan_2",
                        "subTitle": "By importance of interaction",
                        "listFlavor": "standard",
                        "sortOrder": "ascending",
                        "defaultSpan": {
                            "rows": 20,
                            "cols": 1
                        },
                        "/staticContent": [
                            {
                                "title": "Jim Smith",
                                "subTitle": "Buyer",
                                "imageUri": "img/JD.png",
                                "imageAltText": "Jim Smith",
                                "targetUri": "https://google.com",
                                "openInNewWindow": true
                            },
                            {
                                "title": "Jaden Lee",
                                "subTitle": "Sales Manager",
                                "imageUri": "img/YM.png",
                                "imageAltText": "Jim Smith",
                                "semanticObject": "Action",
                                "action": "toappnavsample",
                                "customParams": "getParameters",
                                "params": {
                                    "param1": "value1",
                                    "param2": "value2"
                                }
                            }
                        ]
                    };
                    return {
                        getProperty: function (param) {
                            return oCardProp[param];
                        }

                    }
                };
                oController.oMainComponent = {};
                oController.oMainComponent.templateBaseExtension = {
                    provideCustomParameter: function(){}
                }
                oController.oMainComponent.onCustomParams = function (sCustomParams) {
                    if (sCustomParams === "getParameters") {
                        return function (oNavigateParams, oSelectionVariantParams) {
                            var aCustomSelectionVariant = [];
                            var oSupplierName = {
                                path: "SupplierName",
                                operator: "EQ",
                                value1: "Sunny",
                                value2: null,
                                sign: "I"
                            };
                            var oCustomSelectionVariant = {
                                path: "TaxTarifCode",
                                operator: "BT",
                                value1: 5,
                                value2: 7,
                                sign: "I"
                            };
                            aCustomSelectionVariant.push(oCustomSelectionVariant);
                            aCustomSelectionVariant.push(oSupplierName);
                            return {
                                selectionVariant: aCustomSelectionVariant,
                                ignoreEmptyString: true
                            };
                        };
                    }
                };
                var oNavParams = oController._getEntityNavigationParameters(null, {
                    bStaticLinkListIndex: true,
                    iStaticLinkListIndex: 1
                });
                if (oNavParams) {
                    var aSelectOptions = JSON.parse(oNavParams.sNavSelectionVariant.oSelectionVariant).SelectOptions;
                    for (var i = 0; i <= aSelectOptions.length - 1; i++) {
                        if (aSelectOptions[i].PropertyName == "CurrencyCode") {
                            var oCurrencyCode = aSelectOptions[i];
                        } else if (aSelectOptions[i].PropertyName == "TaxTarifCode") {
                            var oTaxTarifCode = aSelectOptions[i];
                        } else if (aSelectOptions[i].PropertyName == "SupplierName") {
                            var oSupplierName = aSelectOptions[i];
                        }
                    }
                }
                ok(oNavParams.sNavSelectionVariant.iSuppressionBehavior === 1, "ignoreEmptyString is true in customParam so function _processCustomParameters returns 1");
                ok(oNavParams.sNavSelectionVariant.oContextParameters.hasOwnProperty("param1") && oNavParams.sNavSelectionVariant.oContextParameters.param1 === "value1" && oNavParams.sNavSelectionVariant.oContextParameters.hasOwnProperty("param2") && oNavParams.sNavSelectionVariant.oContextParameters.param1 === "value1", "staticParam for static link list card");
                ok(oCurrencyCode && oCurrencyCode.Ranges[0].Low == "EUR", "CurrencyCode from global filter");
                ok(oTaxTarifCode && oTaxTarifCode.Ranges[0].High == "7" && oTaxTarifCode.Ranges[0].Low == "5", "TaxTarifCode from customParam function");
                ok(oSupplierName && oSupplierName.Ranges[0].Low == "Sunny", "oSupplierName from customParam function");
                getNavigationHandlerStub.restore();
            });

            test("Card Test - Full annotations - With Entity Path - Header Config Only", function () {
                var cardTestData = {
                    card: {
                        "id": "card_1",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "category": "Static Category",
                            "title": "Static Title",
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
                            title: "Static Title",
                            subTitle: "Static Description"
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
                        ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                        ok(utils.isValidSub(cardTestData, cardXml), "Header's Description property Value");
                    });

                });
            });

            test("Card Test - Full annotations - With Entity Path - Header Config Only Description", function () {
                var cardTestData = {
                    card: {
                        "id": "card_2",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
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
                            subTitle: "Static Description"
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
                        ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                        ok(utils.isValidSub(cardTestData, cardXml), "Header's Description property Value");
                    });

                });
            });

            test("Card Test - Full annotations - With Entity Path - Header Config Only SubTitle", function () {
                var cardTestData = {
                    card: {
                        "id": "card_3",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "subTitle": "Static Subtitle"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        Header: {
                            subTitle: "Static Subtitle"
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
                        ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                        ok(utils.isValidSub(cardTestData, cardXml), "Header's Subtitle property Value");
                    });

                });
            });

            test("Card Test - Full annotations - With Entity Path - Header Config with SubTitle and Description", function () {
                var cardTestData = {
                    card: {
                        "id": "card_4",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "subTitle": "Static Subtitle",
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
                            subTitle: "Static Subtitle"
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
                        ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                        ok(utils.isValidSub(cardTestData, cardXml), "Header's Subtitle property Value");
                    });

                });
            });

            test("Card Test - Full annotations - With Entity Path - Header Config Only Title", function () {
                var cardTestData = {
                    card: {
                        "id": "card_5",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "title": "Static Title",
                            "subTitle": "Static Subtitle"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        Header: {
                            title: "Static Title",
                            "subTitle": "Static Subtitle"
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
                        ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
                        ok(utils.isValidSub(cardTestData, cardXml), "Header's Description property Value");
                    });

                });
            });

            test("Card Navigation Test- getEntityIntents without identificationAnnotationPath", function () {
                var oView, oController, aIntents,
                        cardTestData = {
                            card: {
                                "id": "card_6",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        aIntents = oController.getEntityNavigationEntries();
                        //start the async test
                        start();

                        ok(aIntents.length === 3, "identification annotation should contain 3 records of DataFieldForIntentBasedNavigation");
                        ok(aIntents[0].action === "toappnavsample2");
                        ok(aIntents[0].semanticObject === "Action2");
                        ok(aIntents[1].action === "toappnavsample1");
                        ok(aIntents[1].semanticObject === "Action1");
                        ok(aIntents[2].action === "toappnavsample3");
                        ok(aIntents[2].semanticObject === "Action3");

                        aIntents = oController.getEntityNavigationEntries(undefined, "com.sap.vocabularies.UI.v1.LineItem");
                        ok(aIntents.length === 2, "identification annotation should contain 2 records of DataFieldForIntentBasedNavigation");
                        ok(aIntents[0].action === "AC1");
                        ok(aIntents[0].semanticObject === "SO1");
                        ok(aIntents[1].action === "AC2");
                        ok(aIntents[1].semanticObject === "SO2");
                    });
                });
            });

            test("Card Navigation Test- getEntityIntents with identificationAnnotationPath", function () {
                var oView, oController, aIntents,
                        cardTestData = {
                            card: {
                                "id": "card_7",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.quickview",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "type": "sap.ovp.cards.quickview.Quickview",
                                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#ToTest"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        aIntents = oController.getEntityNavigationEntries();
                        //start the async test
                        start();

                        ok(aIntents.length === 3, "identification annotation should contain 3 records of DataFieldForIntentBasedNavigation");
                        ok(aIntents[0].action === "TestToappnavsample2", "Validate first action");
                        ok(aIntents[0].semanticObject === "TestAction2", "Validate first action");
                        ok(aIntents[1].action === "TestToappnavsample1", "Validate second action");
                        ok(aIntents[1].semanticObject === "TestAction1", "Validate second action");
                        ok(aIntents[2].action === "TestToappnavsample3", "Validate third action");
                        ok(aIntents[2].semanticObject === "TestAction3", "Validate third action");
                    });
                });
            });

            test("Check for getting correct selection and presentation path's with selectionPresentationAnnotationPath", function () {
                var oView, oController, oCardPropertiesModel, oData,
                        cardTestData = {
                            card: {
                                "id": "card_100",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.quickview",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "type": "sap.ovp.cards.quickview.Quickview",
                                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oCardPropertiesModel = oController.getCardPropertiesModel();
                        oData = oCardPropertiesModel.getData();
                        //start the async test
                        start();

                        ok(oData.selectionPresentationAnnotationPath === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation", "selectionPresentationAnnotationPath should be com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation");
                        ok(oData.selectionAnnotationPath === "com.sap.vocabularies.UI.v1.SelectionVariant#SP2", "selectionAnnotationPath should be com.sap.vocabularies.UI.v1.SelectionVariant#SP2");
                        ok(oData.presentationAnnotationPath === "com.sap.vocabularies.UI.v1.PresentationVariant#customer", "presentationAnnotationPath should be com.sap.vocabularies.UI.v1.PresentationVariant#customer");
                        ok(oData.annotationPath === "com.sap.vocabularies.UI.v1.LineItem#View2", "annotationPath should be com.sap.vocabularies.UI.v1.LineItem#View2");
                        ok(oData.chartAnnotationPath === "com.sap.vocabularies.UI.v1.Chart#line", "chartAnnotationPath should be com.sap.vocabularies.UI.v1.Chart#line");
                    });
                });
            });

            test("Card Navigation Test- doIntentBasedNavigation", function () {
                var oView, oController, aIntents,
                        cardTestData = {
                            card: {
                                "id": "card_8",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        oController = oView.getController();
                        oController.enableClick = true;
                        var doIntentBasedNavigationStub = sinon.stub(oController, "doNavigation");
                        var getBindingContextStub = sinon.stub(oView, "getBindingContext");
                        var oHeader = oView.byId("ovpCardHeader");
						
                        var oEvent = {};
                        oController.onHeaderClick(oEvent);
                        equals(doIntentBasedNavigationStub.callCount, 1, "doIntentBasedNavigation call count");
                        equals(getBindingContextStub.callCount, 1, "getBindingContext call count");
                        equals(doIntentBasedNavigationStub.args[0][0], undefined, "doIntentBasedNavigation was called with undefine context");

                        var context = {ctx: 1};
                        getBindingContextStub.returns(context)
                        oController.onHeaderClick(oEvent);
                        equals(doIntentBasedNavigationStub.callCount, 2, "doIntentBasedNavigation call count");
                        equals(getBindingContextStub.callCount, 2, "getBindingContext call count");
                        deepEqual(doIntentBasedNavigationStub.args[1][0], context, "doIntentBasedNavigation was called with the context");
                    });
                });
            });


            test("Card Navigation Test- do Url navigation - getEntity with identificationAnnotationPath", function () {
                var oView, oController, navigationEntities,
                        cardTestData = {
                            card: {
                                "id": "card_11",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations_for_url_navigation.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        navigationEntities = oController.getEntityNavigationEntries();
                        //start the async test
                        start();

                        ok(navigationEntities.length === 2, "identification annotation should contain 2 records of DataFieldForIntentBasedNavigationa and DataFieldWithUrl");
                        ok(navigationEntities[0].type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl", "Validate first datafield");
                        ok(navigationEntities[0].url === "https://www.google.com", "Validate first datafield");
                        ok(navigationEntities[1].type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation", "Validate second datafield");
                        ok(navigationEntities[1].action === "toappnavsample", "Validate second datafield");
                        ok(navigationEntities[1].semanticObject === "Action", "Validate second datafield");
                    });
                });
            });

            test("Card Navigation Test- do intent navigation", function () {
                var oView, oController, aIntents,
                        cardTestData = {
                            card: {
                                "id": "card_12",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "BusinessPartnerSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations_for_url_navigation.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        oController = oView.getController();
                        oController.enableClick = true;
                        oController.oMainComponent = {};
                        var doIntentBasedNavigationStub = sinon.stub(oController, "doIntentBasedNavigation");
                        var getBindingContextStub = sinon.stub(oView, "getBindingContext");
                        var oHeader = oView.byId("ovpCardHeader");
                        oController.onHeaderClick({});
                        equals(doIntentBasedNavigationStub.callCount, 1, "doNavigation call count");
                        equals(getBindingContextStub.callCount, 1, "getBindingContext call count");
                        equals(doIntentBasedNavigationStub.args[0][1].action, "toappnavsample", "doNavigation was called with intent");
                    });
                });
            });


            test("Card Navigation Test- do intent navigation - getEntity with identificationAnnotationPath", function () {
                var oView, oController, navigationEntities,
                        cardTestData = {
                            card: {
                                "id": "card_14",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "BusinessPartnerSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations_for_url_navigation.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        navigationEntities = oController.getEntityNavigationEntries();
                        //start the async test
                        start();

                        ok(navigationEntities.length === 2, "identification annotation should contain 2 records of DataFieldForIntentBasedNavigationa and DataFieldWithUrl");
                        ok(navigationEntities[0].type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation", "Validate second datafield");
                        ok(navigationEntities[0].action === "toappnavsample", "Validate first datafield");
                        ok(navigationEntities[0].semanticObject === "Action", "Validate first datafield");
                        ok(navigationEntities[1].type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl", "Validate second datafield");
                        ok(navigationEntities[1].url === "https://www.google.com", "Validate second datafield");
                    });
                });
            });

            test("Card Navigation Test- _getEntityNavigationParameters no global filter no card filter and no entity", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_15",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return new sap.ui.core.UIComponent()
                        };
                        start();
                        oNavParams = oController._getEntityNavigationParameters();
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                    });
                });
            });

            test("Card Navigation Test- _getEntityNavigationParameters with card filter and no entity and no global filter", function () {
                       // jQuery.sap.require("sap.ovp.test.mockservers");
                       // sap.ovp.test.mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);

                var oView, oController, oNavParams,
                cardTestData = {
                    card: {
                        "id": "card_16",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "title": "Static Title"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_for_formatItems.xml"
                    }
                };

                var getCardSelectionsStub = sinon.stub(sap.ovp.cards.AnnotationHelper, "getCardSelections", function(object){
                    return {
                        filters: [
                            {
                                path: "GrossAmount",
                                operator: "BT",
                                value1: 0,
                                value2: 800000,
                                sign: "I"
                            },
                            {
                                path: "SupplierName",
                                operator: "EQ",
                                value1: 0,
                                sign: "I"
                            }

                        ],
                       parameters: []
                    } ;
                });


                var oModel = utils.createCardModel(cardTestData);
                stop();
                //var oMetaModel = oModel.getMetaModel();
                oModel.getMetaModel().loaded().then(function () {

                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return new sap.ui.core.UIComponent()
                        };
                        start();
                        oNavParams = oController._getEntityNavigationParameters();
                        getCardSelectionsStub.restore();
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                    });
                });

            });

            test("Card Navigation Test- _getEntityNavigationParameters with global filter and no card filter and no entity", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_17",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                var oComp = new sap.ui.core.UIComponent();
                oComp.getComponentData = function () {
                    return {
                        globalFilter: {
                            getUiState: function () {
                                var oSelectionVariant = JSON.parse('{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"SupplierName","Ranges":[{"Sign":"I","Option":"CP","Low":"*BBB*","High":""},{"Sign":"I","Option":"CP","Low":"*AAA*","High":""}]},{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}');
                                return {
                                    selectionVariant: oSelectionVariant,
                                    getSelectionVariant: function () {
                                        return oSelectionVariant;
                                    }

                                };
                            }
                        }
                    }
                };
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return oComp;
                        };
                        start();
                        oNavParams = oController._getEntityNavigationParameters(null);
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                    });
                });
            });

            test("Card Navigation Test- _getEntityNavigationParameters with entity and with no gloabl filter and no card filter", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_18",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        },
                        expectedParameters = {
                            key1: "value1",
                            key2: "value2",
                            key3: "value3"
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return new sap.ui.core.UIComponent()
                        };
                        oController.getEntityType = function () {
                            return {
                                property: [{name: "key1"}, {name: "key2"}, {name: "key3"}]
                            };
                        };
                        start();
                        oNavParams = oController._getEntityNavigationParameters(expectedParameters);
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                    });
//                    oNavParamsPromise = oController._getEntityNavigationParameters(expectedParameters);
//                    oNavParamsPromise.done(function (oParameters) {
//                        //start the async test
//                        start();
//                        ok(typeof oParameters === "object" || oParameters === null || oParameters === undefined, "oParameters should be object");
////                        ok(oParameters.key1 === "value1");
////                        ok(oParameters.key2 === "value2");
////                        ok(oParameters.key3 === "value3");
////                        ok(typeof oParameters["sap-xapp-state"] == "string");
//                    });
                });
            });

            test("Card Navigation Test- _getEntityNavigationParameters with card filter and entity but no global filter", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_19",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        },
                        expectedParameters = {
                            key1: "value1",
                            key2: "value2",
                            key3: "value3"
                        };

                var getCardSelectionsStub = sinon.stub(sap.ovp.cards.AnnotationHelper, "getCardSelections", function (object) {
                    return {
                        filters: [
                            {
                                path: "GrossAmount",
                                operator: "BT",
                                value1: 0,
                                value2: 800000,
                                sign: "I"
                            },
                            {
                                path: "SupplierName",
                                operator: "EQ",
                                value1: 0,
                                sign: "I"
                            },
                            {
                                path: "key1",
                                operator: "EQ",
                                value1: "value1",
                                sign: "I"
                            }

                        ],
                        parameters: []
                    };
                });

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return new sap.ui.core.UIComponent()
                        };
                        oController.getEntityType = function () {
                            return {
                                property: [{name: "key1"}, {name: "key2"}, {name: "key3"}]
                            };
                        };
                        oNavParams = oController._getEntityNavigationParameters(null);
                        start();
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                        getCardSelectionsStub.restore();
                    });
//                        ok(typeof oParameters === "object" || oParameters === null || oParameters === undefined, "oParameters should be object");
////                        ok(Object.keys(oParameters).length === 5);
////                        ok(oParameters.key1 === "value1");
////                        ok(oParameters.key2 === "value2");
////                        ok(oParameters.key3 === "value3");
////                        ok(oParameters.SupplierName === "0");
////                        ok(typeof oParameters["sap-xapp-state"] == "string");
//                    });
                });
            });

            test("Card Navigation Test- _getEntityNavigationParameters with entity and with global filter and card filter", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_20",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        },
                        expectedParameters = {
                            key1: "value1",
                            key2: "value2",
                            key3: "value3"
                        };

                var getCardSelectionsStub = sinon.stub(sap.ovp.cards.AnnotationHelper, "getCardSelections", function(object){
                    return {
                        filters: [
                            {
                                path: "GrossAmount",
                                operator: "BT",
                                value1: 0,
                                value2: 800000,
                                sign: "I"
                            },
                            {
                                path: "SupplierName",
                                operator: "CP",
                                value1: 0,
                                sign: "I"
                            },
                            {
                                path: "key1",
                                operator: "EQ",
                                value1: "value1",
                                sign: "I"
                            },
                            {
                                path: "key4",
                                operator: "EQ",
                                value1: "value4",
                                sign: "I"
                            },
                            {
                                path: "key5",
                                operator: "BT",
                                value1: 0,
                                value2: 1000,
                                sign: "I"
                            }

                        ],
                        parameters: []
                    };
                });


                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    var oComp = new sap.ui.core.UIComponent();
                    oComp.getComponentData = function () {
                        return {
                            globalFilter: {
                                getUiState: function () {
                                    var oSelectionVariant = JSON.parse('{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"SupplierName","Ranges":[{"Sign":"I","Option":"CP","Low":"*BBB*","High":""},{"Sign":"I","Option":"CP","Low":"*AAA*","High":""}]},{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}');
                                    return {
                                        selectionVariant: oSelectionVariant,
                                        getSelectionVariant: function () {
                                            return oSelectionVariant;
                                        }

                                    };
                                }
                            }
                        }
                    };
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return oComp;
                        };
                        oController.getEntityType = function () {
                            return {
                                property: [{name: "key1"}, {name: "key2"}, {name: "key3"}]
                            };
                        };
                        oNavParams = oController._getEntityNavigationParameters(expectedParameters);
                        start();
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                        getCardSelectionsStub.restore();
                        ok(typeof oParameters === "object" || oParameters === null || oParameters === undefined, "oParameters should be object");
                    });
////                        ok(Object.keys(oParameters).length === 6);
////                        ok(oParameters.key1 === "value1");
////                        ok(oParameters.key2 === "value2");
////                        ok(oParameters.key3 === "value3");
////                        ok(oParameters.key4 === "value4");
////                        ok(oParameters.CurrencyCode === "EUR");
////                        ok(typeof oParameters["sap-xapp-state"] == "string");
//                    });
                });
            });

            test("Card Navigation Test- _getEntityNavigationParameters with no entity, with global filter and with card filter", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_21",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        };

                var getCardSelectionsStub = sinon.stub(sap.ovp.cards.AnnotationHelper, "getCardSelections", function (object) {
                    return {
                        filters: [
                            {
                                path: "GrossAmount",
                                operator: "BT",
                                value1: 0,
                                value2: 800000,
                                sign: "I"
                            },
                            {
                                path: "SupplierName",
                                operator: "CP",
                                value1: 0,
                                sign: "I"
                            },
                            {
                                path: "key1",
                                operator: "EQ",
                                value1: "value1",
                                sign: "I"
                            },
                            {
                                path: "key4",
                                operator: "EQ",
                                value1: "value4",
                                sign: "I"
                            },
                            {
                                path: "key5",
                                operator: "BT",
                                value1: 0,
                                value2: 1000,
                                sign: "I"
                            }

                        ],
                        parameters: []
                    };
                });


                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    var oComp = new sap.ui.core.UIComponent();
                    oComp.getComponentData = function () {
                        return {
                            globalFilter: {
                                getUiState: function () {
                                    var oSelectionVariant = JSON.parse('{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"SupplierName","Ranges":[{"Sign":"I","Option":"CP","Low":"*BBB*","High":""},{"Sign":"I","Option":"CP","Low":"*AAA*","High":""}]},{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}');
                                    return {
                                        selectionVariant: oSelectionVariant,
                                        getSelectionVariant: function () {
                                            return oSelectionVariant;
                                        }

                                    };
                                }
                            }
                        }
                    };
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return oComp;
                        };
                        oController.getEntityType = function () {
                            return {
                                property: [{name: "key1"}, {name: "key2"}, {name: "key3"}]
                            };
                        };
                        oNavParams = oController._getEntityNavigationParameters();
                        start();
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                        getCardSelectionsStub.restore();
                    });
//                        ok(typeof oParameters === "object" || oParameters === null || oParameters === undefined, "oParameters should be object");
////                        ok(Object.keys(oParameters).length === 4);
////                        ok(oParameters.key1 === "value1");
////                        ok(oParameters.key4 === "value4");
////                        ok(oParameters.CurrencyCode === "EUR");
////                        ok(typeof oParameters["sap-xapp-state"] == "string");
//                    });
                });
            });


            test("Card Navigation Test- _getEntityNavigationParameters with entity and with global filter and with no card filter", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_22",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        },
                        expectedParameters = {
                            key1: "value1",
                            key2: "value2",
                            key3: "value3"
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    var oComp = new sap.ui.core.UIComponent();
                    oComp.getComponentData = function () {
                        return {
                            globalFilter: {
                                getUiState: function () {
                                    var oSelectionVariant = JSON.parse('{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"SupplierName","Ranges":[{"Sign":"I","Option":"CP","Low":"*BBB*","High":""},{"Sign":"I","Option":"CP","Low":"*AAA*","High":""}]},{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}');
                                    return {
                                        selectionVariant: oSelectionVariant,
                                        getSelectionVariant: function () {
                                            return oSelectionVariant;
                                        }

                                    };
                                }
                            }
                        }
                    };
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return oComp;
                        };
                        oController.getEntityType = function () {
                            return {
                                property: [{name: "key1"}, {name: "key2"}, {name: "key3"}]
                            };
                        };
                        oNavParams = oController._getEntityNavigationParameters(null);
                        start();
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                    });
//                    oNavParamsPromise = oController._getEntityNavigationParameters(expectedParameters);
//                    oNavParamsPromise.done(function (oParameters) {
//                        //start the async test
//                        start();
//                        ok(typeof oParameters === "object" || oParameters === null || oParameters === undefined, "oParameters should be object");
////                        ok(oParameters.key1 === "value1");
////                        ok(oParameters.key2 === "value2");
////                        ok(oParameters.key3 === "value3");
////                        ok(typeof oParameters["sap-xapp-state"] == "string");
//                    });
                });
            });

            test("Card Navigation Test- _buildSelectionVariant with entity global filter and card filter", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_23",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        },
                        expectedParameters = {
                            key1: "value1",
                            key2: "value2",
                            key3: "value3"
                        },

                        cardFilters = [
                            {
                                path: "GrossAmount",
                                operator: "BT",
                                value1: 0,
                                value2: 800000,
                                sign: "I"
                            },
                            {
                                path: "SupplierName",
                                operator: "CP",
                                value1: 0,
                                sign: "I"
                            },
                            {
                                path: "key1",
                                operator: "EQ",
                                value1: "value1",
                                sign: "I"
                            },
                            {
                                path: "key4",
                                operator: "EQ",
                                value1: "value4",
                                sign: "I"
                            },
                            {
                                path: "key5",
                                operator: "BT",
                                value1: 0,
                                value2: 1000,
                                sign: "I"
                            }
                        ],
                        oKey1 = {
                            High: null,
                            Low: "value1",
                            Option: "EQ",
                            Sign: "I"
                        },
                        oSupplierName =  [
                            {
                                High: null,
                                Low: "*BBB*",
                                Option: "CP",
                                Sign: "I"
                            },
                            {
                                High: null,
                                Low: "*AAA*",
                                Option: "CP",
                                Sign: "I"
                            },
                            {
                                High: null,
                                Low: "0",
                                Option: "CP",
                                Sign: "I"

                            }
                        ];




                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    var oComp = new sap.ui.core.UIComponent();
                    oComp.getComponentData = function () {
                        return {
                            globalFilter: {
                                getUiState: function () {
                                    var oSelectionVariant = JSON.parse('{"SelectionVariantID":"","SelectOptions":[{"PropertyName":"SupplierName","Ranges":[{"Sign":"I","Option":"CP","Low":"*BBB*","High":""},{"Sign":"I","Option":"CP","Low":"*AAA*","High":""}]},{"PropertyName":"CurrencyCode","Ranges":[{"Sign":"I","Option":"EQ","Low":"EUR","High":""}]}]}');
                                    return {
                                        selectionVariant: oSelectionVariant,
                                        getSelectionVariant: function () {
                                            return oSelectionVariant;
                                        }

                                    };
                                }
                            }
                        }
                    };

                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return oComp;
                        };
                        oController.getEntityType = function () {
                            return {
                                property: [{name: "key1"}, {name: "key2"}, {name: "key3"}]
                            };
                        };
                        var oCardSelections = {
                            filters: cardFilters,
                            parameters: []
                        };
                        var selectionVariant = oController._buildSelectionVariant(oComp.getComponentData().globalFilter, oCardSelections, expectedParameters);


                        //start the async test
                        start();

//                    ok(selectionVariant.getParameterNames().length === 2);
//                    ok(selectionVariant.getParameter("key2") === "value2", "Selection variant object was build as expacted");
                        ok(selectionVariant.getSelectOptionsPropertyNames().length === 6);
                        var grossAmount = selectionVariant.getSelectOption("GrossAmount")[0];
                        deepEqual(selectionVariant.getSelectOption("GrossAmount")[0], {
                            Sign: "I",
                            Option: "BT",
                            Low: "0",
                            High: "800000"
                        }, "Between was built as expexted");
                        deepEqual(selectionVariant.getSelectOption("SupplierName")[0], oSupplierName[0], "Selection variant object was build as expected");
                        deepEqual(selectionVariant.getSelectOption("SupplierName")[1], oSupplierName[1], "Selection variant object was build as expected");
                        deepEqual(selectionVariant.getSelectOption("SupplierName")[2], oSupplierName[2], "Selection variant object was build as expected");
                        deepEqual(selectionVariant.getSelectOption("key1")[0], oKey1, "Selection variant object was build as expected");
                    });
                });
            });


            test("Card Navigation Test- _getEntityNavigationParameters with different object types", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_24",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.list",
                                "settings": {
                                    "entitySet": "SalesOrderSet",
                                    "title": "Static Title"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Header: {
                                    title: "Static Title"
                                }
                            }
                        },
                        expectedParameters = {
                            key1: "value1",
                            key2: new Date("2016", "3", "2", "1", "1", "1", "1"),
                            key3: undefined,
                            key4: 400.1234,
                            key5: ["value5"]
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        oController = oView.getController();
                        oController.getOwnerComponent = function () {
                            return new sap.ui.core.UIComponent()
                        };
                        oController.getEntityType = function () {
                            return {
                                property: [{name: "key1"}, {name: "key2"}, {name: "key3"}, {name: "key4"}, {name: "key5"}]
                            };
                        };
                        oNavParams = oController._getEntityNavigationParameters(null);
                        start();
                        ok(typeof oNavParams === "object" || oNavParams === null || oNavParams === undefined);
                    });
//                    oNavParamsPromise = oController._getEntityNavigationParameters(expectedParameters);
//                    oNavParamsPromise.done(function (oParameters) {
//                        //start the async test
//                        start();
//                        ok(typeof oParameters === "object" || oParameters === null || oParameters === undefined, "oParameters should be object");
////                        ok(oParameters.key1 === "value1");
////                        ok(oParameters.key2.indexOf("Sat Apr 02 2016 01:01:01") > -1);
////                        ok(!oParameters.hasOwnProperty("key3"))
////                        ok(oParameters.key4 === "400.1234");
////                        ok(oParameters.key5 === "value5");
////                        ok(typeof oParameters["sap-xapp-state"] == "string");
//                    });
                });
            });




            test("Card Footer Action Test", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_25",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.quickview",
                                "settings": {
                                    "category": "Contact",
                                    "entitySet": "SalesOrderSet",
                                    "entityPath": "('0500000008')"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations.xml"
                            },
                            expectedResult: {
                                Footer:{
                                    actions:[
                                        {
                                            type:/DataFieldForIntentBasedNavigation/,
                                            semanticObj:"Action2",
                                            action:"toappnavsample2",
                                            label:"SO Navigation (M)"
                                        },
                                        {
                                            type:/DataFieldForAction/,
                                            action:/SalesOrder_Confirm/,
                                            label:"Confirm H"
                                        },
                                        {
                                            type:/DataFieldForAction/,
                                            action:/SalesOrder_Cancel/,
                                            label:"Cancel H"
                                        },
                                        {
                                            type:/DataFieldForIntentBasedNavigation/,
                                            semanticObj:"Action1",
                                            action:"toappnavsample1",
                                            label:"SO Navigation (M)"
                                        },
                                        {
                                            type:/DataFieldForIntentBasedNavigation/,
                                            semanticObj:"Action3",
                                            action:"toappnavsample3",
                                            label:"SO Navigation (M)"
                                        },
                                        {
                                            type:/DataFieldForAction/,
                                            action:/SalesOrder_Confirm/,
                                            label:"Confirm"
                                        },
                                        {
                                            type:/DataFieldForAction/,
                                            action:/SalesOrder_Cancel/,
                                            label:"Cancel"
                                        }
                                    ]
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = utils.createCardView(cardTestData, oModel);

                    //oView.onAfterRendering();

                    oView.loaded().then(function (oView) {
                        //start the async test
                        start();

                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var cardCfg = cardTestData.card;
                        var expectedFooterRes = cardTestData.expectedResult.Footer;

                        // basic list XML structure tests
                        ok(utils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                        var actions = utils.getActionsCount(cardXml);
                        ok(actions > 0, "Basic XML check - see that there are action nodes");
                        ok(actions == expectedFooterRes.actions.length, "Basic XML check - validate buttons length");

                        // specific XML property binding value test
                        ok(utils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
                    });
                });
            });
            test("Card Footer Action Test - validate one action", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_26",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.quickview",
                                "settings": {
                                    "category": "Contact",
                                    "entitySet": "SalesOrderSet",
                                    "entityPath": "('0500000008')"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations_one_action_in_identification.xml"
                            },
                            expectedResult: {
                                Footer:{
                                    actions:[
                                        {
                                            type:/DataFieldForAction/,
                                            action:/SalesOrder_Confirm/,
                                            label:"Confirm"
                                }
                                    ]
                            }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = utils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        start();

                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var cardCfg = cardTestData.card;
                        var expectedFooterRes = cardTestData.expectedResult.Footer;

                        // basic list XML structure tests
                        ok(utils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                        var actions = utils.getActionsCount(cardXml);
                        ok(actions > 0, "Basic XML check - see that there are action nodes");
                        ok(actions == 1, "Basic XML check - validate buttons length");

                        // specific XML property binding value test
                        ok(utils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
                    });
                });
            });
            test("Card Footer Action Test - validate two actions", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_27",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.quickview",
                                "settings": {
                                    "category": "Contact",
                                    "entitySet": "SalesOrderSet",
                                    "entityPath": "('0500000008')"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations_two_actions_in_identification.xml"
                            },
                            expectedResult: {
                                Footer:{
                                    actions:[
                                        {
                                            type:/DataFieldForAction/,
                                            action:/SalesOrder_Confirm/,
                                            label:"Confirm H"
                                        },
                                        {
                                            type:/DataFieldForAction/,
                                            action:/SalesOrder_Confirm/,
                                            label:"Confirm"
                                        }
                                    ]
                                }
                            }
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = utils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        start();

                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var cardCfg = cardTestData.card;
                        var expectedFooterRes = cardTestData.expectedResult.Footer;

                        // basic list XML structure tests
                        ok(utils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is a Footer node");
                        var actions = utils.getActionsCount(cardXml);
                        ok(actions > 0, "Basic XML check - see that there are action nodes");
                        ok(actions == 2, "Basic XML check - validate buttons length");

                        // specific XML property binding value test
                        ok(utils.validateActionFooterXmlValues(cardXml, expectedFooterRes), "Action Footer XML Values");
                        var metaModel = oModel.getMetaModel();
                        var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                        var entityType = metaModel.getODataEntityType(entitySet.entityType);
                    });
                });
            });
            test("Card Footer Action Test - validate no actions", function () {
                var oView, oController, oNavParams,
                        cardTestData = {
                            card: {
                                "id": "card_28",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.quickview",
                                "settings": {
                                    "entitySet": "ContactSet",
                                    "type": "sap.ovp.cards.quickview.Quickview",
                                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations_one_action_in_identification.xml"
                            },
                            expectedResult: {}
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    var oView = utils.createCardView(cardTestData, oModel);

                    oView.loaded().then(function (oView) {
                        start();

                        var cardXml = oView._xContent;
                        ok(cardXml !== undefined, "Existence check to XML parsing");

                        var cardCfg = cardTestData.card;

                        // basic list XML structure tests
                        ok(!utils.actionFooterNodeExists(cardXml), "Basic XML check - see that there is no Footer node");
                        ok(utils.validateActionFooterXmlValues(cardXml), "Action Footer XML Values");
                    });
                });
            });

            test("Card Footer Actions test", function () {
                var oController = new sap.ui.controller("sap.ovp.cards.generic.Card");
                var doIntentBasedNavigationStub = sinon.stub(oController, "doNavigation");
                var doActionStub = sinon.stub(oController, "doAction");
                var oBindingContext = {id: "bindingContext"};
                function CustomData(key, value){
                    return {
                        getKey: function(){return key},
                        getValue: function(){return value}
                    }
                };
                var oCustomData = {
                    type: "DataFieldForIntentBasedNavigation",
                    label: "label1",
                    action: "action1",
                    semanticObject: "semanticObject1"
                }
                var aCustomData = [
                    new CustomData("type", oCustomData.type),
                    new CustomData("label", oCustomData.label),
                    new CustomData("action", oCustomData.action),
                    new CustomData("semanticObject", oCustomData.semanticObject)
                ]
                var oEvent = {
                    getSource: function(){
                        return {
                            getBindingContext: function(){return oBindingContext},
                            getCustomData: function(){return aCustomData}
                        };
                    }
                };
                oController.onActionPress(oEvent);
                equals(doIntentBasedNavigationStub.callCount, 1, "doNavigation.callCount");
                equals(doActionStub.callCount, 0, "doAction.callCount");
                deepEqual(doIntentBasedNavigationStub.args[0][0], oBindingContext, "doIntentBasedNavigation first arg is the binding context");
                deepEqual(doIntentBasedNavigationStub.args[0][1], oCustomData, "doIntentBasedNavigation first arg is the custom data");

                oCustomData = {
                    type: "DataFieldForAction",
                    label: "label2",
                    action: "action2"
                }
                var aCustomData = [
                    new CustomData("type", oCustomData.type),
                    new CustomData("label", oCustomData.label),
                    new CustomData("action", oCustomData.action)
                ]
                oController.onActionPress(oEvent);
                equals(doIntentBasedNavigationStub.callCount, 1, "doNavigation.callCount");
                equals(doActionStub.callCount, 1, "doAction.callCount");
                deepEqual(doActionStub.args[0][0], oBindingContext, "doIntentBasedNavigation first arg is the binding context");
                deepEqual(doActionStub.args[0][1], oCustomData, "doIntentBasedNavigation first arg is the custom data");

            });

            test("check doIntentBaseNavigation oContext and oIntent are null ", function () {
                var cardTestData = {
                            card: {
                                "id": "card_29",
                                "model": "salesOrder",
                                "template": "sap.ovp.cards.quickview",
                                "settings": {
                                    "entitySet": "ContactSet",
                                    "type": "sap.ovp.cards.quickview.Quickview",
                                    "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
                                }
                            },
                            dataSource: {
                                baseUrl: utils.odataBaseUrl_salesOrder,
                                rootUri: utils.odataRootUrl_salesOrder,
                                annoUri: utils.testBaseUrl + "data/annotations_one_action_in_identification.xml"
                            },
                            expectedResult: {}
                        };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {
                    try {
                        var oView = utils.createCardView(cardTestData, oModel);
                        oView.loaded().then(function (oView) {
                            start();

                            var oController = oView.getController();
                            oController.doNavigation(null, null);
                            ok(true);
                        });
                    } catch (err) {
                        ok(false, "expected not to throw");
                    }
                });
            });

            asyncTest("check doIntentBaseNavigation with oIntent and null oContext", function () {
                var cardTestData = {
                    card: {
                        "id": "card_30",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.quickview",
                        "settings": {
                            "entitySet": "ContactSet",
                            "type": "sap.ovp.cards.quickview.Quickview",
                            "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_one_action_in_identification.xml"
                    },
                    expectedResult: {}
                };

                var oModel = utils.createCardModel(cardTestData);

                oModel.getMetaModel().loaded().then(function () {
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        var oController = oView.getController();
                        oController.enableClick = true;
                        oController.oMainComponent = {};
                        var fnToTest = sinon.spy(oController, "doIntentBasedNavigation");

                        oController.doNavigation(null, {
                            type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                            semanticObject: "sem",
                            action: "action"
                        });
                        setTimeout(function () {
                            start();
                            var oToExternalArgs = fnToTest.args[0];
                            ok(oToExternalArgs[0] === null, "params argument should be null");
                            deepEqual(oToExternalArgs[1], {
                                type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                                semanticObject: "sem",
                                action: "action"
                            });
                        }, 100);
                    });
                });
            });

            /**
             * We do not need the following test anymore as the error cards do not have a title or a subtitle.
             */

//            test("set card error state", function () {
//                var cardTestData = {
//                    card: {
//                        "id": "card_1",
//                        "model": "salesOrder",
//                        "template": "sap.ovp.cards.list",
//                        "settings": {
//                            "entitySet": "ContactSet",
//                            "category": "category1",
//                            "title": "title1",
//                            "description": "description1"
//                        }
//                    },
//                    dataSource: {
//                        baseUrl: utils.odataBaseUrl_salesOrder,
//                        rootUri: utils.odataRootUrl_salesOrder,
//                        annoUri: utils.testBaseUrl + "data/annotations.xml"
//                    },
//                    expectedResult: {
//                        Header: {
//                            "title": "title1",
//                            "subTitle": "description1"
//                        }
//                    }
//                };
//
//                var oModel = utils.createCardModel(cardTestData);
//                stop();
//                oModel.getMetaModel().loaded().then(function () {
//                    try {
//                        var oView = utils.createCardView(cardTestData, oModel);
//                        start();
//                        jQuery.sap.require("sap.ovp.cards.loading.Component");
//                        var oController = oView.getController()
//                        var oComponent = oController.getOwnerComponent();
//                        var oLoadingCard;
//                        oComponent.oContainer = {
//                            setComponent: function(oComponent){
//                                oLoadingCard = oComponent;
//                            }
//                        }
//                        oController.setErrorState();
//                        ok(oLoadingCard instanceof sap.ovp.cards.loading.Component);
//
//                        var oLoadingCardView = oLoadingCard.getAggregation("rootControl");
//
//                        var cardXml = oLoadingCardView._xContent;
//                        ok(cardXml !== undefined, "Existence check to XML parsing");
//
//                        // validate the card's header XML
//                        ok(utils.isValidTitle(cardTestData, cardXml), "Header's Title property Value");
//                        ok(utils.isValidSub(cardTestData, cardXml), "Header's Description property Value");
//
//                        //oLoadingCardView.onAfterRendering();
//                        //var footerString = oLoadingCardView.byId("ovpLoadingFooter").getText();
//                        //equal(footerString, sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("cannotLoadCard"), "Loading card footer error string");
//
//                    } catch (err) {
//                        ok(false, "expected not to throw");
//                    }
//                });
//            });

            test("check drop down in the card - Present", function () {
                var cardTestData = {
                    card: {
                        "id": "card_31",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "ContactSet",
                            "tabs": [
                                {}
                            ]
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_one_action_in_identification.xml"
                    },
                    expectedResult: true
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {
                    try {
                        var oView = utils.createCardView(cardTestData, oModel);
                        oView.loaded().then(function (oView) {
                            start();
                            ok(utils.validateDropDown(oView._xContent, cardTestData.expectedResult));
                        });
                    } catch (err) {
                        ok(false, "expected not to throw");
                    }
                });
            });

            test("check drop down in the card - Absent", function () {
                var cardTestData = {
                    card: {
                        "id": "card_32",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "ContactSet"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_one_action_in_identification.xml"
                    },
                    expectedResult: false
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {
                    try {
                        var oView = utils.createCardView(cardTestData, oModel);
                        oView.loaded().then(function (oView) {
                            start();
                            ok(utils.validateDropDown(oView._xContent, cardTestData.expectedResult));
                        });
                    } catch (err) {
                        ok(false, "expected not to throw");
                    }
                });
            });

        });