sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/thirdparty/jquery"
], function (utils, mockservers, jQuery) {
            "use strict";
            /* jQuery, sap */
            //jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //jQuery.sap.require("sap.ovp.cards.stack.Component");
            var utils = utils;

            module("sap.ovp.app.Component", {
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

            test("Test Stack Card -  stack card Size indicator and ObjectStream open Check", function(){
                var cardTestData = {
                    card: {
                        "id": "card_1",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "entitySet": "ContactSet"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    //Get controller with read stub and call render
                    var modelReadStub = sinon.stub(oModel, "read");
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        var oController = oView.getController()
                        oController.onAfterRendering();

                        // create test stub
                        var oObjectStream = oController.oObjectStream;
                        var binding = oController.oObjectStream.getBinding("content");
                        var getCurrentContextsStub = sinon.stub(binding, "getCurrentContexts");
                        var getContextsStub = sinon.stub(binding, "getContexts").returns([]);
                        getCurrentContextsStub.returns([1, 2, 3]);

                        //CreateData Change event
                        binding.fireDataReceived();

                        //check stack card Size indicator
                        ok(oView.byId("stackSize").getText() === "3", "Stack card size indicator number same as card count");

                        //Create card Stub and check object stream open
                        sinon.spy(oObjectStream, "open");
                        oController.openStack();
                        ok(oObjectStream.open.callCount == 1, "object stream opened when there are cards");

                        //Create No card Stub and check object stream won't open
                        getCurrentContextsStub.returns([]);
                        //sinon.spy(oObjectStream, "open");
                        oController.openStack();
                        ok(oObjectStream.open.callCount == 1, "object stream not opened when there no cards");

                        //restore sinons
                        getCurrentContextsStub.restore();
                        getContextsStub.restore();
                        modelReadStub.restore();
                    });
                });

            });

            test("Test Stack Card - No intent then no placeHolder", function(){
                var cardTestData = {
                    card: {
                        "id": "card_2",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "entitySet": "ContactSet"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    //create all data with sinons and render card
                    var modelReadStub = sinon.stub(oModel, "read");
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        var oController = oView.getController()
                        var getEntityIntentsStub = sinon.stub(oController, "getEntityNavigationEntries").returns([]);
                        oController.onAfterRendering();

                        var oObjectStream = oController.oObjectStream;
                        var binding = oObjectStream.getBinding("content");

                        ok(!oObjectStream.getPlaceHolder(), "A place Holder has been created even there is no intents");

                        getEntityIntentsStub.restore();
                        modelReadStub.restore();
                    });
                });

            });

            test("Test Stack Card - there is intent then there is placeHolder", function(){
                var cardTestData = {
                    card: {
                        "id": "card_3",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "entitySet": "ContactSet"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    //create all data with sinons and render card
                    var modelReadStub = sinon.stub(oModel, "read");
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        var oController = oView.getController()
                        var getEntityIntentsStub = sinon.stub(oController, "getEntityNavigationEntries").returns([1, 2]);
                        oController.onAfterRendering();

                        var oObjectStream = oController.oObjectStream;
                        var binding = oObjectStream.getBinding("content");

                        ok(oObjectStream.getPlaceHolder(), "There is no place holder although there is intent");

                        getEntityIntentsStub.restore();
                        modelReadStub.restore();
                    });
                });
            });

            test("Test Stack Card - there is intent but stack is complex then no placeHolder", function(){
                var cardTestData = {
                    card: {
                        "id": "card_4",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "entitySet": "BusinessPartnerSet",
                            "objectStreamCardsTemplate": "sap.ovp.cards.list",
                            "objectStreamCardsNavigationProperty": "ToSalesOrders"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    //create all data with sinons and render card
                    var modelReadStub = sinon.stub(oModel, "read");
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        var oController = oView.getController()
                        var getEntityIntentsSpy = sinon.spy(oController, "getEntityNavigationEntries");
                        oController.onAfterRendering();

                        var oObjectStream = oController.oObjectStream;
                        var binding = oObjectStream.getBinding("content");

                        ok(!oObjectStream.getPlaceHolder(), "There is a place holder although stack is complex");
                        ok(getEntityIntentsSpy.callCount === 0, "getEntityNavigationEntries was called although stack is complex");

                        getEntityIntentsSpy.restore();
                        modelReadStub.restore();
                    });
                });
            });

            test("Test Stack Card - entitySet with input parameters", function(){
                var cardTestData = {
                    card: {
                        "id": "card_5",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "entitySet": "SalesShare",
                            "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesShare,
                        rootUri: utils.odataRootUrl_salesShare,
                        annoUri: utils.testBaseUrl + "data/salesshare/annotations_parameterized_ES_Valid.xml"
                    }
                };

                mockservers.loadMockServer(utils.odataBaseUrl_salesShare, utils.odataRootUrl_salesShare);
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {
                    //create all data with sinons and render card
                    var modelReadStub = sinon.stub(oModel, "read");
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        var oController = oView.getController()
                        oController.onAfterRendering();

                        var oObjectStream = oController.oObjectStream;
                        var binding = oObjectStream.getBinding("content");

                        equal(binding.getPath(), "/SalesShareParameters(P_Currency=%27EUR%27,P_Country=%27IN%27)/Results", "path is with parametets");

                        modelReadStub.restore();
                    });
                });
            });



            asyncTest("Stack Card - Screen Reader attribute test", function(){
                var cardTestData = {
                    card: {
                        "id": "card_6",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "entitySet": "ContactSet",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                oModel.getMetaModel().loaded().then(function () {

                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        var testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
                        oView.placeAt('testContainer');
                        oView.rerender();
                        oView.onAfterRendering = function () {
                            //start the async test
                            start();

                            var oController = oView.getController()
                            oController.onAfterRendering();

                            // create test stub
                            var oObjectStream = oController.oObjectStream;
                            var binding = oController.oObjectStream.getBinding("content");
                            var getCurrentContextsStub = sinon.stub(binding, "getCurrentContexts");
                            var getLengthStub = sinon.stub(binding, "getLength");
                            var getContextsStub = sinon.stub(binding, "getContexts").returns([1, 2, 3, 4, 5, 6, 7, 8]);
                            getCurrentContextsStub.returns([1, 2, 3]);
                            getLengthStub.returns(8);

                            //CreateData Change event
                            binding.fireDataReceived();

                            var cardHtml = oView.getDomRef();
                            var numberLabelObject = testContainer.find(".sapMLabel");
                            var stackCardSize = getCurrentContextsStub().length;
                            var totalCards = getContextsStub().length;

                            //Check list
                            ok((numberLabelObject.attr("aria-label") == sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("stackCard", stackCardSize)), "Stack Card type is accessble");
                            ok(numberLabelObject.attr("role") == "", "card role is define");

                            //Check footer
                            var StackCardContent = testContainer.find(".sapOvpStackCardContent");
                            ok(StackCardContent.attr("aria-label") == sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("stackCardContent", [stackCardSize, totalCards]), "aria-label is define on right content");
                            ok(StackCardContent.attr("role") == "button", "button role is define on right content");
                            oView.destroy();
                        };
                    });
                });
            });

            test("Test Stack Card - 'objectStreamCardsSettings' affects objectStream cards", function(){
                var cardTestData = {
                    card: {
                        "id": "card_7",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "category": "Contacts",
                            "title" : "My Team",
                            "description" : "Stack Card",
                            "entitySet": "SalesOrderSet",
                            "objectStreamCardsSettings": {
                                "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#StackTest",
                                "category": "Category from manifest for QuickView cards"
                            }
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        Header: {
                        },
                        Body: {
                        },
                        Footer:{
                            actions:[
                                {
                                    type:/DataFieldForIntentBasedNavigation/,
                                    action:/toappnavsample1/,
                                    label:"SO Navigation (M) StackTest",
                                    semanticObj:"Action1"
                                },
                                {
                                    type:/DataFieldForAction/,
                                    action:/SalesOrder_Confirm/,
                                    label:"Confirm StackTest"
                                },
                                {
                                    type:/DataFieldForAction/,
                                    action:/SalesOrder_Cancel/,
                                    label:"Cancel StackTest"
                                }
                            ]
                        }
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    //Get controller and call render
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        var oController = oView.getController()
                        oController.onAfterRendering();

                        //Get first quickview card XML
                        var oObjectStream = oController.oObjectStream;
                        var bindingInfo = oObjectStream.getBindingInfo("content");
                        var componentContainer = bindingInfo.factory();

                        var quickViewCardPromiseArray = [];
                    	for(var i=0;i<oController.quickViewCardContextArray.length;i++){
                    		quickViewCardPromiseArray.push(oController._renderQuickViewCards(oController.quickViewCardContextArray[i].sId,oController.quickViewCardContextArray[i].oContext,oController.quickViewCardContextArray[i].oComponentContainer));
                    	}
                    	Promise.all(quickViewCardPromiseArray).then(function(){
                    		//start the async test
                            start();

                            var componentInstance = componentContainer.getComponentInstance();
                            var quickviewCardView = componentInstance.getAggregation("rootControl");
                            var quickviewCardXML = quickviewCardView._xContent;
                            var expectedFooterRes = cardTestData.expectedResult.Footer;
                            // specific XML property binding value test
                            ok(utils.validateActionFooterXmlValues(quickviewCardXML, expectedFooterRes), "Action Footer XML Values");
                    	}.bind(this));

//                        setTimeout(function () {
//
//                            //start the async test
//                            start();
//
//                            var componentInstance = componentContainer.getComponentInstance();
//                            var quickviewCardView = componentInstance.getAggregation("rootControl");
//                            var quickviewCardXML = quickviewCardView._xContent;
//                            var expectedFooterRes = cardTestData.expectedResult.Footer;
//                            // specific XML property binding value test
//                            ok(utils.validateActionFooterXmlValues(quickviewCardXML, expectedFooterRes), "Action Footer XML Values");
//                        }.bind(this), 2000);
                    });
                });
            });

            test("Test Stack Card - 'objectStreamCardsSettings' affects objectStream cards", function(){
                var cardTestData = {
                    card: {
                        "id": "card_8",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "category": "Contacts",
                            "title" : "My Team",
                            "description" : "Stack Card",
                            "entitySet": "BusinessPartnerSet",
                            "objectStreamCardsNavigationProperty": "ToSalesOrders",
                            "objectStreamCardsTemplate": "sap.ovp.cards.list",
                            "objectStreamCardsSettings": {
                            }
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        Header: {
                        },
                        Body: {
                        },
                        Footer:{
                        }
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {

                    //Get controller and call render
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        var oController = oView.getController()
                        oController.onAfterRendering();

                        //Get first quickview card XML
                        var oObjectStream = oController.oObjectStream;
                        var bindingInfo = oObjectStream.getBindingInfo("content");
                        var oContext = new sap.ui.model.Context(oModel, "/BusinessPartnerSet('0100000000')");
                        oContext.getProperty = function () {
                            return "FilterValue";
                        };
                        var componentContainer = bindingInfo.factory("id", oContext);

                        var quickViewCardPromiseArray = [];
                    	for(var i=0;i<oController.quickViewCardContextArray.length;i++){
                    		quickViewCardPromiseArray.push(oController._renderQuickViewCards(oController.quickViewCardContextArray[i].sId,oController.quickViewCardContextArray[i].oContext,oController.quickViewCardContextArray[i].oComponentContainer));
                    	}
                    	Promise.all(quickViewCardPromiseArray).then(function(){
                    		//start the async test
                    		start();

                            var componentInstance = componentContainer.getComponentInstance();
                            var quickviewCardView = componentInstance.getAggregation("rootControl");
                            var quickviewCardXML = quickviewCardView._xContent;
                            ok(componentInstance instanceof sap.ovp.cards.list.Component)
                            var filter = {path: "CustomerID", operator: "EQ", value1: "FilterValue"};
                            deepEqual(componentInstance.getComponentData().settings.filters[0], filter, "filter for inline card is nor as expected");
                    	}.bind(this));

//                        setTimeout(function () {
//
//                            //start the async test
//                            start();
//
//                            var componentInstance = componentContainer.getComponentInstance();
//                            var quickviewCardView = componentInstance.getAggregation("rootControl");
//                            var quickviewCardXML = quickviewCardView._xContent;
//                            ok(componentInstance instanceof sap.ovp.cards.list.Component)
//                            var filter = {path: "CustomerID", operator: "EQ", value1: "FilterValue"};
//                            deepEqual(componentInstance.getComponentData().settings.filters[0], filter, "filter for inline card is nor as expected");
//                        }.bind(this), 2000);
                    });
                });
            });

            // Below two tests are not valid anymore because OVP only supports quickview in objectstream
//            test("Test Stack Card - list card without NavigationProperty", function(){
//                var cardTestData = {
//                    card: {
//                        "id": "card_1",
//                        "model": "salesOrder",
//                        "template": "sap.ovp.cards.stack",
//                        "settings": {
//                            "category": "Contacts",
//                            "title" : "My Team",
//                            "description" : "Stack Card",
//                            "entitySet": "BusinessPartnerSet",
//                            "objectStreamCardsTemplate": "sap.ovp.cards.list",
//                            "objectStreamCardsSettings": {
//                            }
//                        }
//                    },
//                    dataSource: {
//                        baseUrl: utils.odataBaseUrl_salesOrder,
//                        rootUri: utils.odataRootUrl_salesOrder,
//                        annoUri: utils.testBaseUrl + "data/annotations.xml"
//                    },
//                    expectedResult: {
//                        Header: {
//                        },
//                        Body: {
//                        },
//                        Footer:{
//                        }
//                    }
//                };
//
//                var oModel = utils.createCardModel(cardTestData);
//                stop();
//                oModel.getMetaModel().loaded().then(function () {
//
//                    //start the async test
//                    start();
//
//                    //Get controller and call render
//                    var oView = utils.createCardView(cardTestData, oModel);
//                    var oController = oView.getController()
//                    var determineFilterPropertyIdSpy = sinon.spy(oController, "_determineFilterPropertyId");
//                    var setErrorStateStub = sinon.stub(oController, "setErrorState");
//                    oController.onAfterRendering();
//                    ok(determineFilterPropertyIdSpy.callCount === 0, "Navigation property is not set so filter property don't need to be found");
//                    ok(setErrorStateStub.callCount === 1, "setErrorState should be called");
//
//                    //check stack card Size indicator
//                    ok(typeof oController.oObjectStream !== "object", "Object Stream should not be created, there is no Navigation Property");
//
//                    determineFilterPropertyIdSpy.restore();
//                    setErrorStateStub.restore();
//
//
//                });
//
//            });

//            test("Test Stack Card - list cards with NavigationProperty", function(){
//                var cardTestData = {
//                    card: {
//                        "id": "card_1",
//                        "model": "salesOrder",
//                        "template": "sap.ovp.cards.stack",
//                        "settings": {
//                            "category": "Contacts",
//                            "title" : "My Team",
//                            "description" : "Stack Card",
//                            "entitySet": "BusinessPartnerSet",
//                            "objectStreamCardsNavigationProperty": "ToSalesOrders",
//                            "objectStreamCardsTemplate": "sap.ovp.cards.list",
//                            "objectStreamCardsSettings": {
//                            }
//                        }
//                    },
//                    dataSource: {
//                        baseUrl: utils.odataBaseUrl_salesOrder,
//                        rootUri: utils.odataRootUrl_salesOrder,
//                        annoUri: utils.testBaseUrl + "data/annotations.xml"
//                    },
//                    expectedResult: {
//                        Header: {
//                        },
//                        Body: {
//                        },
//                        Footer:{
//                        }
//                    }
//                };
//
//                var oModel = utils.createCardModel(cardTestData);
//                stop();
//                oModel.getMetaModel().loaded().then(function () {
//
//                    //start the async test
//                    start();
//
//                    //Get controller and call render
//                    var oView = utils.createCardView(cardTestData, oModel);
//                    var oController = oView.getController()
//                    var determineFilterPropertyIdSpy = sinon.spy(oController, "_determineFilterPropertyId");
//                    oController.onAfterRendering();
//                    ok(determineFilterPropertyIdSpy.callCount === 1, "Navigation property is set so filter property need to be found");
//                    ok(oController.oObjectStream.getBindingInfo("content").length == 5, "Object Stream should not be created, there is no Navigation Property");
//
//                    determineFilterPropertyIdSpy.restore();
//
//                });
//
//            });

            test("Test Stack Card - quick view cards with navigation property", function(){
                var cardTestData = {
                    card: {
                        "id": "card_9",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.stack",
                        "settings": {
                            "category": "Contacts",
                            "title" : "My Team",
                            "description" : "Stack Card",
                            "entitySet": "BusinessPartnerSet",
                            "objectStreamCardsNavigationProperty": "ToSalesOrders",
                            "objectStreamCardsSettings": {
                            }
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        Header: {
                        },
                        Body: {
                        },
                        Footer:{
                        }
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {
                    //Get controller and call render
                    var oView = utils.createCardView(cardTestData, oModel);
                    oView.loaded().then(function (oView) {
                        start();
                        var oController = oView.getController()
                        var determineFilterPropertyIdSpy = sinon.spy(oController, "_determineFilterPropertyId");
                        var setErrorStateStub = sinon.stub(oController, "setErrorState");

                        oController.onAfterRendering();
                        ok(typeof oController.oObjectStream !== "object", "Object Stream should not be created, there is Navigation Property with quickView card");
                        ok(determineFilterPropertyIdSpy.callCount === 0, "Navigation property is not set so filter property don't need to be found");
                        ok(setErrorStateStub.callCount === 1, "setErrorState should be called");

                        determineFilterPropertyIdSpy.restore();
                        setErrorStateStub.restore();
                    });
                });

            });

        });
