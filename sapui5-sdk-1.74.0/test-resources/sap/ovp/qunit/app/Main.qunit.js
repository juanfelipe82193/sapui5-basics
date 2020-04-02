sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "jquery.sap.global"
], function (utils, jquery) {
    "use strict";
    /* module, ok, test, jQuery, sap */

    var oController;

    module("sap.ovp.app.Main", {
        /**
         * This method is called before each test
         */

        setup: function () {
            oController = new sap.ui.controller("sap.ovp.app.Main");
            oController.oLoadedComponents = {};
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () { }
    });

    test("view switch breakout test", function () {
        var aCard = {
            "id": "card008",
            "model": "purchaseOrder",
            "template": "sap.ovp.cards.list",
            "settings": {
                "title": "Overdue Purchase Orders",
                "annotationPath": undefined,
                "baseUrl": "../../../../../sap/ovp/demo",
                "dataPointAnnotationPath": undefined,
                "dynamicSubtitleAnnotationPath": undefined,
                "entitySet": "Zme_Overdue",
                "headerAnnotationPath": undefined,
                "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                "imageSupported": true,
                "kpiAnnotationPath": undefined,
                "listType": "condensed",
                "params": undefined,
                "presentationAnnotationPath": undefined,
                "selectedKey": 2,
                "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#iconD",
                "selectionPresentationAnnotationPath": undefined,
                "sortBy": "OverdueTime",
                "subTitle": "Condensed standard list card with view Switch",
                "tabs": [
                    {
                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#imageD",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#item2",
                        "value": "sap"
                    },
                    {
                        "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#blankD",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification",
                        "value": "ABC"
                    }
                ]
            }
        };
        oController._getCardFromManifest = function () {
            return aCard;
        };
        var aOrderedCards = [{
            id: "card008",
            selectedKey: 2,
            visibility: true
        }];
        this.uiModel = new sap.ui.model.json.JSONModel({});
        this.uiModel.setProperty('/aOrderedCards', aOrderedCards);
        var oViewStub = {
            getModel: this.stub().withArgs("ui").returns(this.uiModel)
        };
        oController.getView = this.stub().returns(oViewStub);
        oController.getGlobalFilter = function () {
            return {
                getUiState: function () {
                    return {
                        getSelectionVariant: function () {
                            return {
                                "SupplierName": "sap"
                            }
                        }
                    }
                }
            }
        };
        oController.onBeforeRebindPageExtension = function (oCards, oSelectionVariant) {
            var oFilterList = oSelectionVariant;
            var oTabIndexList = {};
            if (oCards && oCards.length > 0) {
                for (var i = 0; i < oCards.length; i++) {
                    if (oCards[i].id == "card008") {
                        if (oFilterList && oFilterList.hasOwnProperty("SupplierName")) {
                            if (oFilterList.SupplierName == "sap") {
                                oTabIndexList["card008"] = 1;
                            } else if (oFilterList.SupplierName == "ABC") {
                                oTabIndexList["card008"] = 2;
                            }
                        }
                    }
                }
            }
            this.setTabIndex(oTabIndexList);
        };
        oController.recreateCard = function () {

        };
        oController.changeViewSwitchForVisibleCard();
        ok(oController.getTabIndex().card008 == 1, "tabindex is updated as per filter in breakout");
        var aOrderedCards = oController.getView().getModel("ui").getProperty('/aOrderedCards');
        ok(aOrderedCards[0].selectedKey == 1, "aOrderedCards selectedKey is updated as per current view switch");
    });

    test("onRequestCompleted and getCustomMessage function test - without custom message in extension function", function () {
        var oVal = {
            "d": {
                "results": []
            }
        };
        var oResponse = {
            getParameters: function () {
                return {
                    success: true,
                    response: {
                        responseText: JSON.stringify(oVal)
                    }

                }
            }
        };
        oController.getView = function () {
            return {
                byId: function () {
                    return null;
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({
                        aOrderedCards: [{
                            id: "card008",
                            selectedKey: 2,
                            visibility: true
                        }]
                    });
                }
            }
        };
        oController.onRequestCompleted(oResponse);
        oController.getCustomMessage = function (oResponse) {
        },
            oController.verifyAndSetErrorCard = function () {

            }
        var sMessage = oController.getCustomMessage();
        ok(sMessage == undefined, "Custom message should be undefined");
    });

    test("onRequestCompleted and getCustomMessage function test - with custom no data message and icon in extension function", function () {
        var oVal = {
            "d": {
                "results": []
            }
        };
        var oResponse = {
            getParameters: function () {
                return {
                    success: true,
                    response: {
                        responseText: JSON.stringify(oVal)
                    }

                }
            }
        };
        oController.getView = function () {
            return {
                byId: function () {
                    return null;
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({
                        aOrderedCards: [{
                            id: "card008",
                            selectedKey: 2,
                            visibility: true
                        }]
                    });
                }
            }
        };
        oController.onRequestCompleted(oResponse);
        oController.getCustomMessage = function (oResponse) {
            return {
                sMessage: "My Custom Message for No Data",
                sIcon: "sap-icon://message-information"
            }
        },
            oController.verifyAndSetErrorCard = function () {

            }
        var oMessage = oController.getCustomMessage();
        ok(oMessage.sMessage == "My Custom Message for No Data", "Custom message for no data case");
        ok(oMessage.sIcon == "sap-icon://message-information", "Custom icon for no data and error case");
    });

    test("onRequestCompleted and getCustomMessage function test - with custom error message in extension function", function () {
        var oVal = {
            "d": {
                "results": []
            }
        };
        var oResponse = {
            getParameters: function () {
                return {
                    success: true,
                    response: {
                        responseText: JSON.stringify(oVal)
                    }

                }
            }
        };
        oController.getView = function () {
            return {
                byId: function () {
                    return null;
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({
                        aOrderedCards: [{
                            id: "card008",
                            selectedKey: 2,
                            visibility: true
                        }]
                    });
                }
            }
        };
        oController.onRequestCompleted(oResponse);
        oController.getCustomMessage = function (oResponse) {
            return {
                sMessage: "My Custom Message for Error"
            }
        },
            oController.verifyAndSetErrorCard = function () {

            }
        var oMessage = oController.getCustomMessage();
        ok(oMessage.sMessage == "My Custom Message for Error", "Custom message for error case");
    });

    test("Read with no filters", function () {
        var fnRead = sinon.spy();
        oController.oCardsModels = {
            "model1": {
                refresh: function () {
                    this.read();
                },
                read: fnRead

            }
        };

        oController.getView = function () {
            return {
                byId: function () {
                    return "ovpGlobalFilterID";
                }
            }
        };

        oController.getLayout = function () {
            return {
                setActive: function () {
                }
            };
        };

        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
        getGlobalFilterStub.returns({
            getFilters: function () {
                return [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }];
            },
            getAllFilterItems: function () {
                return [{
                    name: "filterField1",
                    getName: function () {
                        return name;
                    }
                }];
            },
            getConsiderAnalyticalParameters: function () {
                return false;
            },
            getAnalyticBindingPath: function () {
                return "entityPath1";
            },
            getEntityType: function () {
                return "GlobalFilters";
            },
            getModel: function () {
                return {};
            },
            validateMandatoryFields: function () {
                return true;
            },
            isDialogOpen: function () {
                return false;
            },
            getLiveMode: function () {
                return false;
            }
        });

        oController.oGlobalFilter = {
            _aFields: {},
            _aFilterBarViewMetadata: {}
        }

        oController.onGlobalFilterSearch();
        ok(fnRead.callCount === 0, "Read should not be called if no change in the filters");
        oController.onGlobalFilterChange();
        oController.onGlobalFilterSearch();
        ok(fnRead.calledOnce === true, "Read should be called when changing the filters");
    });

    test("Read is overridden", function () {
        var fnRead = sinon.spy();
        var readArgs = ["/somepath", { error: "", groupId: "", success: "", urlParameters: [], withCredentials: "" }];
        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");


        oController.getLayout = function () {
            return {
                setActive: function () {
                }
            };
        };

        getGlobalFilterStub.returns({
            getFilters: function () {
                return [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }];
            },
            getAllFilterItems: function () {
                return [{
                    name: "filterField1",
                    getName: function () {
                        return name;
                    }
                }];
            },
            getConsiderAnalyticalParameters: function () {
                return false;
            },
            getAnalyticBindingPath: function () {
                return "entityPath1";
            },
            getEntityType: function () {
                return "GlobalFilters";
            },
            getModel: function () {
                return {};
            },
            isDialogOpen: function () {
                return false;
            },
            getParameters: function () {
                return { custom: { search: "searchField1" } };
            },
            getLiveMode: function () {
                return false;
            }
        });
        oController._getEntityTypeFromPath = function () {
            return { property: [{ name: "filterField1" }, { name: "filterField2" }] };
        };
        oController.getView = function () {
            return {
                getModel: function (modelName) {
                    if (modelName === "ui") {
                        return new sap.ui.model.json.JSONModel({ refreshIntervalInMinutes: "1.2", cards: { card1: { model: "model1" } } });
                    } else {
                        return {
                            refresh: function () {
                                this.read.apply(this, readArgs);
                            },
                            read: fnRead,
                            setUseBatch: function () { },
                            getMetaModel: function () {
                                return {
                                    getODataEntityType: function () { }
                                };
                            }

                        };
                    }
                },
                byId: function (arg) {
                    if (arg) {
                        if (arg === "card00" || arg === "card01" || arg === "card02") {
                            return {
                                getComponentInstance: function () {
                                    return false;
                                },
                                setHeaderExpanded: function () {
                                    return true;
                                }
                            }
                        } else if (arg === "ovpMain" || arg === "ovpErrorPage") {
                            return {
                                setVisible: function (value) {
                                    return value;
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                }
            }
        };
        oController.oCardsModels = {};
        oController.oLoadedComponents = {};
        oController.errorHandlingObject = {
            atLeastOneRequestSuccess: false,
            errorLoadingTimeout: {}
        };

        sinon.stub(oController, "_checkMandatoryParams", function () {
            return true;
        });

        oController._initCardModel("model1");
        ok(fnRead != oController.oCardsModels["model1"].read, "Read should be overridden");
        oController.onGlobalFilterSearch();
        ok(fnRead.callCount === 0, "Read should not be called if no change in the filters");
        ok(oController._processSearch() === "search=searchField1", "Search is successful");

        sinon.stub(oController, "_getEntitySetFromEntityType", function () {
            return {
                entityType: "somepathType",
                name: "somepath",
                "sap:searchable": "true"
            }
        });

        oController.oGlobalFilter = {
            _aFields: {},
            _aFilterBarViewMetadata: {}
        };

        //first scenario - only global filter is defined
        oController.onGlobalFilterChange();
        oController.onGlobalFilterSearch();
        ok(fnRead.calledOnce === true, "Read should be called when changing the filters");
        var args = fnRead.getCall(0).args;
        assert.deepEqual(args[0], "/somepath", "read first arguments should be the path");
        assert.deepEqual(args[1].filters.length, 1, "read first arguments should be the path");

        //second scenario - global filter is defined in addition to card internal filter
        var createFilterParamsStub = sinon.stub(sap.ui.model.odata.ODataUtils, "createFilterParams");
        createFilterParamsStub.returns("$filter=someotherFilter")
        readArgs[1] = { urlParameters: ["$filter=somefilter"] };
        oController.onGlobalFilterChange();
        oController.onGlobalFilterSearch();
        sinon.assert.callCount(fnRead, 2);
        var args = fnRead.getCall(1).args;
        assert.deepEqual(args[0], "/somepath", "read first arguments should be the path");
        assert.deepEqual(args[1].filters, undefined, "read first arguments should be the path");
        assert.deepEqual(args[1].urlParameters[0], "$filter=(somefilter)%20and%20(someotherFilter)", "read first arguments should be the path");

        oController.nRefreshInterval = "72000";
        oController.oModelRefreshTimestamp = { "model1": new Date().getTime() };
        raises(function () {
            fnRead.args[0][1].success();
        }, Error, "Throws an exception that it cannot apply to undefined since the success is not real");
        ok(oController.oRefreshTimer, "refresh timer is set");

        createFilterParamsStub.restore();

    });

    test("Test _removeFilter function", function () {
        // All test for cardFilter
        var sFilterParams = "Supplier_Name%20eq%20%27sap%27";
        var sFilterName = "CurrencyCode";
        var sResult = "Supplier_Name%20eq%20%27sap%27";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is not found in sFilterParams");

        sFilterParams = "CurrencyCode%20eq%20%27INR%27";
        sResult = "";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is the only filter present in sFilterParams");

        sFilterParams = "CurrencyCode%20eq%20%27INR%27%20and%20Supplier_Name%20eq%20%27sap%27";
        sResult = "Supplier_Name%20eq%20%27sap%27";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is the first filter in sFilterParams");

        sFilterParams = "Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27INR%27";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is the last filter in sFilterParams");

        sFilterParams = "Supplier_Name%20eq%20%27sap%27%20and%20(CurrencyCode%20eq%20%27INR%27%20or%20CurrencyCode%20eq%20%27EUR%27)%20and%20NetAmount%20eq%20100000m";
        sResult = "Supplier_Name%20eq%20%27sap%27%20and%20NetAmount%20eq%20100000m";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "cardFilter ---> Case where sFilterName is present in between other filters in sFilterParams");

        // All test for globalFilter
        sFilterParams = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)";
        sResult = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is not found in sFilterParams");

        sFilterParams = "$filter=CurrencyCode%20eq%20%27AUR%27";
        sResult = "$filter=";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is the only filter present in sFilterParams");

        sFilterParams = "$filter=(CurrencyCode%20eq%20%27EUR%27%20or%20CurrencyCode%20eq%20%27INR%27%20or%20CurrencyCode%20eq%20%27AUR%27)%20and%20((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))";
        sResult = "$filter=((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is the first filter in sFilterParams");

        sFilterParams = "$filter=((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))%20and%20(CurrencyCode%20eq%20%27EUR%27%20or%20CurrencyCode%20eq%20%27INR%27%20or%20CurrencyCode%20eq%20%27AUR%27)";
        sResult = "$filter=((SalesOrderID%20ge%20%270500000005%27%20and%20SalesOrderID%20le%20%270500000009%27)%20or%20(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27))";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is the last filter in sFilterParams");

        sFilterParams = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)";
        sResult = "$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)";
        ok(oController._removeFilter(sFilterParams, sFilterName) === sResult, "globalFilter ---> Case where sFilterName is present in between other filters in sFilterParams");
    });

    test("Test _removeRelevantFilter function", function () {
        var oResult;
        var aRelevantFilters;
        var sCardFilter = "CurrencyCode";
        ok(!oController._removeRelevantFilter(aRelevantFilters, sCardFilter), "If aRelevantFilters is not defined");

        aRelevantFilters = [];
        oResult = [];
        ok(JSON.stringify(oController._removeRelevantFilter(aRelevantFilters, sCardFilter)) === JSON.stringify(oResult), "If aRelevantFilters is an empty array");

        aRelevantFilters = JSON.parse('[{"aFilters":[{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"INR","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}]');
        oResult = undefined;
        ok(JSON.stringify(oController._removeRelevantFilter(aRelevantFilters, sCardFilter)) === oResult, "If aRelevantFilters has only one filter named sCardFilter");

        aRelevantFilters = JSON.parse('[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true},{"aFilters":[{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"EUR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"INR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"USD","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]');
        oResult = '[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]';
        ok(JSON.stringify(oController._removeRelevantFilter(aRelevantFilters, sCardFilter)) === oResult, "If aRelevantFilters has combination of filters");
    });

    test("Test _getFilterPreference function", function () {
        var oCard = {
            "id": "card_1",
            "settings": {}
        };
        var getCardFromManifestStub = sinon.stub(oController, "_getCardFromManifest");
        getCardFromManifestStub.returns(oCard);

        ok(!oController._getFilterPreference("card_1"), "If Card has no Filter Preference");

        oCard.settings = {
            "mFilterPreference": "Outside tab level"
        };
        ok(oController._getFilterPreference("card_1") === "Outside tab level", "If Card has Filter Preference Outside tab level");

        oCard.settings["tabs"] = [{
            "mFilterPreference": "Inside tab level -> First tab"
        }];
        ok(oController._getFilterPreference("card_1") === "Inside tab level -> First tab", "If Card has Filter Preference Inside tab level -> First tab");

        oCard.settings.selectedKey = 2;
        oCard.settings.tabs.push({
            "mFilterPreference": "Inside tab level -> Second tab"
        });
        ok(oController._getFilterPreference("card_1") === "Inside tab level -> Second tab", "If Card has Filter Preference Inside tab level -> Second tab");

        getCardFromManifestStub.restore();
    });

    test("Test _getFilterPreferenceFromUrlParams function", function () {
        var oParameters = {};
        var getFilterPreferenceStub = sinon.stub(oController, "_getFilterPreference");
        getFilterPreferenceStub.returns({});

        ok(!oController._getFilterPreferenceFromUrlParams(oParameters), "If there are no url parameters");

        oParameters = {
            "urlParameters": []
        };
        ok(!oController._getFilterPreferenceFromUrlParams(oParameters), "If url parameters are empty");

        oParameters = {
            "urlParameters": ["cardId=card_1"]
        };
        oController._getFilterPreferenceFromUrlParams(oParameters);
        ok(JSON.stringify(oParameters.urlParameters) === JSON.stringify([]), "If url parameters has only one custom card id parameter");

        oParameters = {
            "urlParameters": ["$filter=lol", "$expand=lol,bol&cardId=card_1"]
        };
        oController._getFilterPreferenceFromUrlParams(oParameters);
        ok(JSON.stringify(oParameters.urlParameters) === JSON.stringify(["$filter=lol", "$expand=lol,bol"]), "If url parameters has many parameters");

        getFilterPreferenceStub.restore();
    });

    test("Test _addRelevantFilters function", function () {
        var oModel = {
            "oMetadata": null
        };
        var oParameters = {
            "urlParameters": ["$filter=someOtherFilter"]
        };
        var mFilterPreference = {
            "filterAll": "card"
        };
        var createFilterParamsStub = sinon.stub(sap.ui.model.odata.ODataUtils, "createFilterParams");
        var oResult = {
            "urlParameters": ["$filter=someOtherFilter"]
        };
        createFilterParamsStub.returns("$filter=someotherFilter");
        oController.aRelevantFilters = ["lol"];
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> All card level filters");

        mFilterPreference.filterAll = "global";
        createFilterParamsStub.returns("$filter=newFilter");
        oResult = {
            "urlParameters": ["$filter=newFilter"]
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> All global level filters");

        oParameters.urlParameters = ["$filter=CurrencyCode%20eq%20%27AUR%27"];
        delete mFilterPreference.filterAll;
        mFilterPreference.cardFilter = ["CurrencyCode"];
        mFilterPreference.globalFilter = ["CurrencyCode"];
        createFilterParamsStub.returns("$filter=CurrencyCode%20eq%20%27EUR%27");
        oResult = {
            "urlParameters": []
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there are no filters to apply");

        oParameters.urlParameters = ["$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)"];
        createFilterParamsStub.returns("$filter=CurrencyCode%20eq%20%27EUR%27");
        oResult = {
            "urlParameters": ["$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)"]
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there no global filters");

        oParameters.urlParameters = ["$filter=CurrencyCode%20eq%20%27EUR%27"];
        createFilterParamsStub.returns("$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m)");
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there are no card filters");

        oParameters.urlParameters = ["$filter=Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27EUR%27"];
        oResult = {
            "urlParameters": ["$filter=(Supplier_Name%20eq%20%27sap%27)%20and%20((SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m))"]
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> Both card or global level filters ---> Case where there are both card & global level filters");

        oParameters.urlParameters = ["$filter=Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27EUR%27"];
        delete mFilterPreference.cardFilter;
        delete mFilterPreference.globalFilter;
        oResult = {
            "urlParameters": ["$filter=(Supplier_Name%20eq%20%27sap%27%20and%20CurrencyCode%20eq%20%27EUR%27)%20and%20((SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27%20and%20(NetAmount%20ge%201m%20and%20NetAmount%20le%2010000m))"]
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> Filter preference ---> Default behavior");

        oParameters.urlParameters = [];
        mFilterPreference.filterAll = "card";
        oResult = {
            "filters": undefined,
            "urlParameters": []
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> No card filters ---> Filter preference ---> All card level filters");

        mFilterPreference.filterAll = "global";
        oResult = {
            "urlParameters": [],
            "filters": ["lol"]
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> No card filters ---> Filter preference ---> All global level filters");

        delete mFilterPreference.filterAll;
        mFilterPreference.cardFilter = ["CurrencyCode"];
        mFilterPreference.globalFilter = ["CurrencyCode"];
        oController.aRelevantFilters = JSON.parse('[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true},{"aFilters":[{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"EUR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"INR","_bMultiFilter":false},{"sPath":"CurrencyCode","sOperator":"EQ","oValue1":"USD","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]');
        oResult = {
            "urlParameters": [],
            "filters": JSON.parse('[{"aFilters":[{"aFilters":[{"sPath":"Supplier_Name","sOperator":"EQ","oValue1":"sap","_bMultiFilter":false}],"bAnd":false,"_bMultiFilter":true}],"bAnd":true,"_bMultiFilter":true}]')
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> No card filters ---> Filter preference ---> Both card or global level filters");

        delete mFilterPreference.cardFilter;
        delete mFilterPreference.globalFilter;
        oResult.filters = oController.aRelevantFilters;
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are relevant global filters ---> No card filters ---> Filter preference ---> Default behavior");

        delete oController.aRelevantFilters;
        delete oParameters.filters;
        mFilterPreference.filterAll = "card";
        oParameters.urlParameters = ["$filter=someOtherFilter"];
        oResult = {
            "urlParameters": ["$filter=someOtherFilter"]
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are no relevant global filters ---> Filter preference ---> All card level filters");

        mFilterPreference.filterAll = "global";
        oResult = {
            "urlParameters": []
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are no relevant global filters ---> Filter preference ---> All global level filters");

        delete mFilterPreference.filterAll;
        mFilterPreference.cardFilter = ["CurrencyCode"];
        mFilterPreference.globalFilter = ["CurrencyCode"];
        oParameters.urlParameters = ["$filter=CurrencyCode%20eq%20%27AUR%27"];
        oResult = {
            "urlParameters": []
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are no relevant global filters ---> Filter preference ---> Global level filters ---> Containing only one global filter matching with filter preference");

        oParameters.urlParameters = ["$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)%20and%20CurrencyCode%20eq%20%27AUR%27"];
        oResult = {
            "urlParameters": ["$filter=(SalesOrderID%20ge%20%270500000001%27%20and%20SalesOrderID%20le%20%270500000004%27)"]
        };
        oParameters = oController._addRelevantFilters(oParameters, oModel, null, mFilterPreference);
        ok(JSON.stringify(oParameters) === JSON.stringify(oResult), "There are no relevant global filters ---> Filter preference ---> Global level filters ---> Combination of filters");

        createFilterParamsStub.restore();
    });

    test("Read with different relevant filters", function () {

        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
        getGlobalFilterStub.returns({
            getFilters: function () {
                return [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }];
            },
            getAllFilterItems: function () {
                return [{
                    name: "filterField1",
                    getName: function () {
                        return name;
                    }
                }];
            },
            getConsiderAnalyticalParameters: function () {
                return false;
            },
            getAnalyticBindingPath: function () {
                return "entityPath1";
            },
            getEntityType: function () {
                return "GlobalFilters";
            },
            getModel: function () {
                return {};
            },
            validateMandatoryFields: function () {
                return true;
            },
            isDialogOpen: function () {
                return false;
            }
        });

        var relevantFilters = oController._getEntityRelevantFilters({ property: [{ name: "filterField1" }, { name: "filterField2" }] }, [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }] }]);
        ok(relevantFilters[0].aFilters.length === 1, "Relevant filters should be of length 1");
        relevantFilters = oController._getEntityRelevantFilters({ property: [{ name: "filterField1" }, { name: "filterField2" }] }, [{ _bMultiFilter: true, aFilters: [{ sPath: "filterField1" }, { sPath: "filterField2" }] }]);
        ok(relevantFilters[0].aFilters.length === 2, "Relevant filters should be of length 2");
    });

    test("Get Current AppState with no filters", function () {
        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
        getGlobalFilterStub.returns({
            getSmartVariant: function () {
                return {
                    currentVariantGetModified: function () {
                        return false;
                    }
                };
            },
            getUiState: function () {
                return {
                    getSelectionVariant: function () {
                        return {
                            "SelectionVariantID": "",
                            "SelectOptions": []
                        }
                    }
                }
            }
        });

        var selectionVariant = {
            "Version": {
                "Major": "1",
                "Minor": "0",
                "Patch": "0"
            },
            "SelectionVariantID": "",
            "Text": "Selection Variant with ID ",
            "ODataFilterExpression": "",
            "Parameters": [],
            "SelectOptions": []
        };

        var sSelectionVariant = JSON.stringify(selectionVariant);
        var val = oController._getCurrentAppState();

        ok(jQuery.isEmptyObject(val.customData._CUSTOM), "Custom Filters must be empty");
        ok(jQuery.isEmptyObject(val.customData._EXTENSION), "Extension Filters must be empty");
        ok(val.selectionVariant === sSelectionVariant, "Selection Variant Must be empty");

    });


    asyncTest("Store current app state and adjust URL success scenario", function () {


        var selectionVariant = {
            "Version": {
                "Major": "1",
                "Minor": "0",
                "Patch": "0"
            },
            "SelectionVariantID": "",
            "Text": "Selection Variant with ID ",
            "ODataFilterExpression": "",
            "Parameters": [],
            "SelectOptions": []
        };

        var sSelectionVariant = JSON.stringify(selectionVariant);

        var appStateReturn = {
            "selectionVariant": sSelectionVariant,
            customData: {}
        };

        this.dPromise = new Promise(function (resolve, reject) {
            resolve("dummyAppStateKey");
        });

        var oCurrentAppState = {
            "appStateKey": "dummyAppStateKey",
            promise: this.dPromise
        };

        var getCurrentAppStateStub = sinon.stub(oController, "_getCurrentAppState");

        getCurrentAppStateStub.returns(appStateReturn);

        var storeInnerAppStateWithImmediateReturnStub = function () {

            return oCurrentAppState;
        };

        var replaceHashStub = function () {
            return;
        };

        oController.oNavigationHandler = {

            storeInnerAppStateWithImmediateReturn: storeInnerAppStateWithImmediateReturnStub,
            replaceHash: replaceHashStub

        };

        var oEvent = {
            oSource: {
                _bDirtyViaDialog: false
            }
        };

        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        var oEvent = {
            oSource: {
                _bDirtyViaDialog: true
            }
        };

        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        oController.bSFBInitialized = true;

        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        setTimeout(function () {
            start();
            ok(true, "iAppState Should be updated");

        }.bind(this), 0);

    });

    asyncTest("Store current app state and adjust URL failure scenario with skip", function () {
        var selectionVariant = {
            "Version": {
                "Major": "1",
                "Minor": "0",
                "Patch": "0"
            },
            "SelectionVariantID": "",
            "Text": "Selection Variant with ID ",
            "ODataFilterExpression": "",
            "Parameters": [],
            "SelectOptions": []
        };

        var sSelectionVariant = JSON.stringify(selectionVariant);

        var appStateReturn = {
            "selectionVariant": sSelectionVariant,
            customData: {}
        };

        this.dPromise = new Promise(function (resolve, reject) {
            reject("skip");
        });

        var oCurrentAppState = {
            "appStateKey": "dummyAppStateKey",
            promise: this.dPromise
        };

        var getCurrentAppStateStub = sinon.stub(oController, "_getCurrentAppState");

        getCurrentAppStateStub.returns(appStateReturn);

        var storeInnerAppStateWithImmediateReturnStub = function () {

            return oCurrentAppState;
        };

        var replaceHashStub = function () {
            return;
        };

        oController.oNavigationHandler = {

            storeInnerAppStateWithImmediateReturn: storeInnerAppStateWithImmediateReturnStub,
            replaceHash: replaceHashStub

        };

        var oEvent = {
            oSource: {
                _bDirtyViaDialog: true
            }
        };

        oController.bSFBInitialized = true;

        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        setTimeout(function () {
            start();
            ok(true, "iAppState Should not be updated");

        }.bind(this), 0);

    });

    asyncTest("Store current app state and adjust URL failure scenario", function () {
        var selectionVariant = {
            "Version": {
                "Major": "1",
                "Minor": "0",
                "Patch": "0"
            },
            "SelectionVariantID": "",
            "Text": "Selection Variant with ID ",
            "ODataFilterExpression": "",
            "Parameters": [],
            "SelectOptions": []
        };

        var sSelectionVariant = JSON.stringify(selectionVariant);

        var appStateReturn = {
            "selectionVariant": sSelectionVariant,
            customData: {}
        };

        this.dPromise = new Promise(function (resolve, reject) {
            reject("TestReason");
        });

        var oCurrentAppState = {
            "appStateKey": "dummyAppStateKey",
            promise: this.dPromise
        };

        var getCurrentAppStateStub = sinon.stub(oController, "_getCurrentAppState");

        getCurrentAppStateStub.returns(appStateReturn);

        var storeInnerAppStateWithImmediateReturnStub = function () {

            return oCurrentAppState;
        };

        var replaceHashStub = function () {
            return;
        };

        oController.oNavigationHandler = {

            storeInnerAppStateWithImmediateReturn: storeInnerAppStateWithImmediateReturnStub,
            replaceHash: replaceHashStub

        };

        var oEvent = {
            oSource: {
                _bDirtyViaDialog: true
            }
        };

        oController.bSFBInitialized = true;

        oController._storeCurrentAppStateAndAdjustURL(oEvent);

        setTimeout(function () {
            start();
            ok(true, "iAppState Should not be updated");

        }.bind(this), 0);

    });


    test("Card Template Class is not valid", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), false, "wrong Card Template Class should not pass card validation");
    });

    test("Card template Class is not typeof sap.ovp.cards.generic.Component", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        sap.ui.core.UIComponent.extend("sap.ovp.test.card.Component", {});

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), false, "Card Template Class which is not typeof sap.ovp.cards.generic.Component should not pass card validation");
    });

    test("Card template Class is exactly sap.ovp.cards.generic.Component", function () {
        //jQuery.sap.declare("sap.ovp.cards.generic.Component");
        //sap.ui.core.UIComponent.extend("sap.ovp.cards.generic.Component",{});

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.cards.generic"), true, "Card template Class is exactly sap.ovp.cards.generic.Component");
    });

    test("Card template Class is typeof sap.ovp.cards.generic.Component", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        jQuery.sap.require("sap.ovp.cards.generic.Component");

        sap.ovp.cards.generic.Component.extend("sap.ovp.test.card.Component", {});

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), true, "Card template Class is typeof sap.ovp.cards.generic.Component");
    });

    test("Card is typeof sap.ovp.cards.generic.Component and contains viewReplacements for sap.ovp.cards.generic.Card", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        jQuery.sap.require("sap.ovp.cards.generic.Component");

        sap.ovp.cards.generic.Component.extend("sap.ovp.test.card.Component", {
            metadata: {
                customizing: {
                    "sap.ui.viewReplacements": {
                        "sap.ovp.cards.generic.Card": {}
                    }
                }
            }
        });

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), false,
            "Card is typeof sap.ovp.cards.generic.Component and contains viewReplacements for sap.ovp.cards.generic.Card should not pass card validation");
    });

    test("Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        jQuery.sap.require("sap.ovp.cards.generic.Component");

        sap.ovp.cards.generic.Component.extend("sap.ovp.test.card.Component", {
            metadata: {
                customizing: {
                    "sap.ui.viewReplacements": {
                        "sap.ovp.whatever.whatever2": {}
                    }
                }
            }
        });

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), true,
            "Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements should pass card validation");
    });

    test("Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        jQuery.sap.require("sap.ovp.cards.generic.Component");

        sap.ovp.cards.generic.Component.extend("sap.ovp.test.card.Component", {
            metadata: {
                customizing: {
                    "sap.ui.viewReplacements": {
                        "sap.ovp.whatever.whatever2": {}
                    }
                }
            }
        });

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), true,
            "Card is typeof sap.ovp.cards.generic.Component and contains valid viewReplacements should pass card validation");
    });

    test("Card is typeof sap.ovp.cards.generic.Component but override createContent function", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        jQuery.sap.require("sap.ovp.cards.generic.Component");

        sap.ovp.cards.generic.Component.extend("sap.ovp.test.card.Component", {
            createContent: function () { }
        });

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), false,
            "Card is typeof sap.ovp.cards.generic.Component but override createContent function should not pass card validation");
    });

    test("Card is typeof sap.ovp.cards.generic.Component but override getPreprocessors function", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        jQuery.sap.require("sap.ovp.cards.generic.Component");

        sap.ovp.cards.generic.Component.extend("sap.ovp.test.card.Component", {
            getPreprocessors: function () { }
        });

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), false,
            "Card is typeof sap.ovp.cards.generic.Component but override getPreprocessors function should not pass card validation");
    });

    test("Card implements getCustomPreprocessor method", function () {
        jQuery.sap.declare("sap.ovp.test.card.Component");
        jQuery.sap.require("sap.ovp.cards.generic.Component");

        sap.ovp.cards.generic.Component.extend("sap.ovp.test.card.Component", {
            metadata: {
                getCustomPreprocessor: function () { }
            }
        });

        assert.deepEqual(oController._checkIsCardValid("sap.ovp.test.card"), true,
            "Card implements getCustomPreprocessor method should pass card validation");
    });

    function _mockGlobalFilter() {
        var globalFilter = {
            isFilterLoaded: false,
            variantId: undefined,
            hasRequiredFields: false,
            attachInitialized: sinon.spy(),
            attachSearch: sinon.spy(),
            attachFilterChange: sinon.spy(),
            attachFiltersDialogClosed: sinon.spy(),
            setVisible: sinon.spy(),
            addFieldToAdvancedArea: sinon.spy(),
            clearVariantSelection: sinon.spy(),
            clear: sinon.spy(),
            setUiState: sinon.spy(),
            isDialogOpen: function () { return false; },
            getCurrentVariantId: function () { return this.variantId },
            search: function () { return !this.hasRequiredFields },
            getVariantManagement: function () { return null },
            validateMandatoryFields: function () { return !this.hasRequiredFields },
            determineMandatoryFilterItems: function () { return []; },
            _checkForValues: function () { return false; },
            getFilterData: function () { return {}; }
        };
        var getGlobalFilterStub = sinon.stub(oController, "getGlobalFilter");
        getGlobalFilterStub.returns(globalFilter);

        return globalFilter;
    }

    asyncTest("Init Global Filter - no variant no required fields", function () {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        oController.oNavigationHandler = { parseNavigation: function () { } };
        sap.ui.generic.app.navigation.service.NavType = { initial: undefined };

        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        //call the initialize callback
        globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
        oController.getView = function () {
            return {
                byId: function () {
                    return { setVisible: function () { } };
                }
            }
        };
        oController.oGlobalFilterLoadedPromise.then(function () {
            start();
            ok(true, "no variant and no required fields - filter should be marked as loaded after initialzed is called");
        });
    });

    asyncTest("Init Global Filter - with variant no required fields", function () {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        sap.ui.generic.app.navigation.service.NavType = { initial: undefined };
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return new jQuery.Deferred().resolve();
            }
        };

        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        oController.getView = function () {
            return {
                byId: function () {
                    return { setVisible: function () { } };
                }
            }
        };

        var variantLoaded = false;
        var fnfilterLoaded = function () {
            start();
            if (variantLoaded) {
                ok(true, "with variant and with no required fields - filter should be marked as loaded only after variant loaded is called");
            } else {
                ok(false, "with variant and with no required fields - filter should be marked as loaded only after variant loaded is called");
            }
        };
        oController.oGlobalFilterLoadedPromise.then(fnfilterLoaded);

        //call the initialize callback
        globalFilter.variantId = "someVariantId";
        setTimeout(function () {
            globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
            variantLoaded = true;
        }, 1);

    });

    asyncTest("Init Global Filter - with variant and with required fields", function () {
        var globalFilter = _mockGlobalFilter();
        oController._initGlobalFilter();
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return new jQuery.Deferred().resolve();
            }
        };

        sinon.assert.callCount(globalFilter.attachFilterChange, 1);
        sinon.assert.callCount(globalFilter.attachInitialized, 1);
        sinon.assert.callCount(globalFilter.attachSearch, 1);

        oController.getView = function () {
            return {
                byId: function () {
                    return { setVisible: function () { } };
                }
            }
        };

        var searchCalled = false;
        var fnfilterLoaded = function () {
            start();
            if (searchCalled) {
                ok(true, "with variant and with required fields - filter should be marked as loaded only after search called");
            } else {
                ok(false, "with variant and with required fields - filter should be marked as loaded only after search called");
            }
        };
        oController.oGlobalFilterLoadedPromise.then(fnfilterLoaded);

        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        setHeaderExpanded: function () {
                            return true;
                        },
                        setActive: function () {
                            return true;
                        },
                        setVisible: function() {

                        }
                    };
                }
            };
        };

        //call the initialize callback
        globalFilter.variantId = "someVariantId";
        globalFilter.hasRequiredFields = true;
        setTimeout(function () {
            globalFilter.attachInitialized.args[0][0].call(globalFilter.attachInitialized.args[0][1]);
        }, 1);
        setTimeout(function () {
            globalFilter.attachSearch.args[0][0].call(globalFilter.attachSearch.args[0][1]);
            searchCalled = true;
        }, 3);
    });

    test("validate _getCardId no viewId prefix", function () {
        var cardId = "card00";
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        var res = oController._getCardId(cardId);
        ok(res, cardId);
    });

    test("validate _getCardId with viewId prefix", function () {
        var cardId = "mainAppID--card00";
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        var res = oController._getCardId(cardId);
        ok(res, "card00");
    });

    test("validate _mergeLREPContent without delta changes", function () {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true }
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.deltaChanges = null;
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, null);

        deepEqual(oResult, oLayoutCardsArray, "should return the same cards from layout array");
    });

    test("validate _mergeLREPContent without delta changes and empty layout cards array", function () {
        var oLayoutCardsArray = [];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.deltaChanges = null;
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, null);

        deepEqual(oResult, oLayoutCardsArray, "should return empty cards array");
    });

    test("validate _mergeLREPContent without delta changes and without layout cards array", function () {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.deltaChanges = null;
        var oResult = oController._mergeLREPContent(null, null);

        deepEqual(oResult, [], "should return empty cards array");
    });

    test("validate _mergeLREPContent card exist in delta changes and not in oLayout", function () {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true }
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.deltaChanges = [{
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card00",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card01",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card02",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card03",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card04",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card10",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card11",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card12",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card13",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card14",
                    visibility: true
                };
            }
        }];
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, {
            cards: [
                { id: "card00", visibility: true },
                { id: "card01", visibility: false },
                { id: "card02", visibility: true },
                { id: "card03", visibility: false },
                { id: "card04", visibility: true },
                { id: "card10", visibility: true },
                { id: "card11", visibility: false },
                { id: "card12", visibility: true },
                { id: "card13", visibility: false },
                { id: "card14", visibility: true }
            ]
        });

        deepEqual(oResult, oLayoutCardsArray);
    });

    test("validate _mergeLREPContent card exist in oVariand and not in oLayout and visibility taken from oVariant", function () {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true }
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.deltaChanges = [{
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card00",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card01",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card02",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card03",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card04",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card10",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card11",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card12",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card13",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card14",
                    visibility: true
                };
            }
        }];
        var expectedResult = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: true },
            { id: "card02", visibility: true },
            { id: "card03", visibility: true },
            { id: "card04", visibility: true }
        ];
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, {
            cards: expectedResult.concat([
                { id: "card10", visibility: true },
                { id: "card11", visibility: false },
                { id: "card12", visibility: true },
                { id: "card13", visibility: false },
                { id: "card14", visibility: true }
            ])
        });

        deepEqual(oResult, expectedResult);
    });

    test("validate _mergeLREPContent oLayout contains additional cards which not exist in oVariant", function () {
        var oLayoutCardsArray = [
            { id: "card00", visibility: true },
            { id: "card01", visibility: false },
            { id: "card02", visibility: true },
            { id: "card03", visibility: false },
            { id: "card04", visibility: true }
        ];
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.deltaChanges = [{
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card00",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card01",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card02",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card03",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card04",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card10",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card11",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card12",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card13",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card14",
                    visibility: true
                };
            }
        }];
        var oResult = oController._mergeLREPContent(oLayoutCardsArray, {
            cards: [
                { id: "card04", visibility: false }
            ]
        });

        var expectedResult = [
            { id: "card00", visibility: false },
            { id: "card01", visibility: true },
            { id: "card02", visibility: false },
            { id: "card03", visibility: true },
            { id: "card04", visibility: false }
        ];
        deepEqual(oResult, expectedResult);
    });

    test("validate _mergeLREPContent with delta changes and without layout cards array", function () {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.getLayout = function () {
            return {
                getMetadata: function () {
                    return {
                        getName: function () {
                            return "sap.ovp.ui.EasyScanLayout";
                        }
                    };
                }
            };
        };
        oController.deltaChanges = [{
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card00",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card01",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card02",
                    visibility: true
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card03",
                    visibility: false
                };
            }
        }, {
            getChangeType: function () {
                return "visibility";
            },
            getContent: function () {
                return {
                    cardId: "card04",
                    visibility: true
                };
            }
        }];
        var oResult = oController._mergeLREPContent(null, null);

        deepEqual(oResult, [], "should return empty cards array");
    });

    test("validate _getCardArrayAsVariantFormat", function () {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                }
            }
        };

        var aInput = [
            {
                getId: function () { return "card00"; },
                getVisible: function () { return false; }
            },
            {
                getId: function () { return "card01"; },
                getVisible: function () { return true; }
            },
            {
                getId: function () { return "card02"; },
                getVisible: function () { return false; }
            },
            {
                getId: function () { return "card03"; },
                getVisible: function () { return true; }
            }
        ];
        var aExpexted = [
            { id: "card00", visibility: false },
            { id: "card01", visibility: true },
            { id: "card02", visibility: false },
            { id: "card03", visibility: true }
        ];

        var oResult = oController._getCardArrayAsVariantFormat(aInput);

        deepEqual(oResult, aExpexted);
    });

    test("validate _getCardFromManifest card is exist in the array", function () {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({ cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }] });
                }
            }
        };

        oController.getUIModel = function () {
            return new sap.ui.model.json.JSONModel({ cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }] });
        };

        var cardResult = oController._getCardFromManifest("card03");
        ok(cardResult.id == "card03");
    });

    test("validate recreateRTAClonedCard if card doesn't exist", function () {
        var spy = sinon.spy(oController, "performRecreationOfCard");
        oController._getCardFromManifest = function () {
            return undefined;
        };
        oController.recreateRTAClonedCard({ cardId: "card08" });
        ok(spy.notCalled, "performRecreationOfCard function is not called");
    });

    test("validate recreateRTAClonedCard if card exist", function () {
        var newCardProperties = {};
        oController._getCardFromManifest = function (cardId) {
            return {};
        };
        oController.performRecreationOfCard = function (oCard) {
            newCardProperties = oCard;
        };
        var spy = sinon.spy(oController, "performRecreationOfCard");
        oController.recreateRTAClonedCard({ cardId: "card08", settings: "lol" });
        ok(spy.called, "performRecreationOfCard function is called");
        ok(newCardProperties.settings === "lol", "Copied new properties to the card from manifest");
    });

    test("Function test --> recreateCard ---> Entity Set Change", function () {
        var createSavePersonalizationStub = sinon.stub(sap.ovp.cards.PersonalizationUtils, "savePersonalization");
        createSavePersonalizationStub.returns();
        var oCard = {
            settings: {
                entitySet: 'lol'
            }
        };
        oController._getCardFromManifest = function () {
            return oCard;
        };
        oController.performRecreationOfCard = function () {
            return null;
        };
        oController.savePersonalization = function () {
            return null;
        };
        oController.recreateCard({});
        ok(oCard.settings.entitySet === "lol", "Entity Set not in tab level");
        oController.recreateCard({
            entitySet: 'rofl'
        });
        ok(oCard.settings.entitySet === "rofl", "Entity Set Updated at tab level");
        createSavePersonalizationStub.restore();
    });

    test("Function test --> initializeTabbedCard ---> Entity Set Change", function () {
        var oCard = {
            settings: {
                tabs: [{
                    entitySet: 'lol'
                }],
                entitySet: ''
            }
        };
        oController.initializeTabbedCard(oCard, 0);
        ok(oCard.settings.entitySet === "lol", "Entity Set Updated at global level");
        oCard.settings.tabs = [{}];
        oController.initializeTabbedCard(oCard, 0);
        ok(oCard.settings.entitySet === "lol", "Entity Set not in tab level");
    });

    test("validate _getCardFromManifest card is exist in the array", function () {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({ cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }] });
                }
            }
        };

        oController.getUIModel = function () {
            return new sap.ui.model.json.JSONModel({ cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }] });
        };

        var cardResult = oController._getCardFromManifest("card03");
        ok(cardResult.id == "card03");
    });

    test("validate _getCardFromManifest card does not exist in the array", function () {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({ cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }] });
                }
            }
        };

        oController.getUIModel = function () {
            return new sap.ui.model.json.JSONModel({ cards: [{ id: "card00" }, { id: "card01" }, { id: "card02" }, { id: "card03" }] });
        };

        var cardResult = oController._getCardFromManifest("card07");
        ok(cardResult === null);
    });

    test("initialize cards containing tabs", function () {
        oController.getView = function () {
            return {
                getId: function () {
                    return "mainAppID";
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({
                        cards: [
                            {
                                id: "card00", "settings": {
                                    "tabs": [
                                        { "annotationPath": "lineitem" }
                                    ]
                                }
                            },
                            { id: "card01" },
                            { id: "card02" },
                            { id: "card03" }
                        ]
                    });
                }
            }
        };

        oController.getUIModel = function () {
            return new sap.ui.model.json.JSONModel({
                cards: [
                    {
                        id: "card00", "settings": {
                            "tabs": [
                                { "annotationPath": "lineitem" }
                            ]
                        }
                    },
                    { id: "card01" },
                    { id: "card02" },
                    { id: "card03" }
                ]
            });
        };

        var cardResult = oController._getCardFromManifest("card00");
        oController.initializeTabbedCard(cardResult, 0);
        ok(cardResult.settings.annotationPath === "lineitem");
    });

    test("validate _updateLayoutWithOrderedCards", function () {
        var fnRemoveAllContentFunc = new sinon.spy();
        var fnSetVisibleFunc = new sinon.spy();
        var fnAddContentFunc = new sinon.spy();

        oController.getLayout = function () {
            return {
                removeAllContent: fnRemoveAllContentFunc,
                addContent: fnAddContentFunc
            };
        };
        oController.getView = function () {
            return {
                byId: function (oCard) {
                    return {
                        setVisible: fnSetVisibleFunc
                    };
                },
                getModel: function () {
                    return new sap.ui.model.json.JSONModel({
                        aOrderedCards: [
                            { id: "card00", visibility: false },
                            { id: "card01", visibility: true },
                            { id: "card02", visibility: false },
                            { id: "card03", visibility: true }
                        ]
                    });
                }
            }
        };
        oController._updateLayoutWithOrderedCards();

        ok(fnRemoveAllContentFunc.calledOnce);
        sinon.assert.callCount(fnSetVisibleFunc, 4);
        ok(fnSetVisibleFunc.args[0][0] === false);
        ok(fnSetVisibleFunc.args[1][0] === true);
        ok(fnSetVisibleFunc.args[2][0] === false);
        ok(fnSetVisibleFunc.args[3][0] === true);
        sinon.assert.callCount(fnAddContentFunc, 4);
    });
    test("Action Button - Save As Tile", function () {
        var uiModel = new sap.ui.model.json.JSONModel({
            cards: [{
                id: "card00"
            }, {
                id: "card01"
            }, {
                id: "card02"
            }, {
                id: "card03"
            }]
        });
        var oDummyView = new sap.ui.core.mvc.View("mainView", {
            height: "100%",
            preprocessors: {
                xml: {
                    bindingContexts: {
                        ui: uiModel.createBindingContext("/")

                    },
                    models: {
                        ui: uiModel

                    }
                }
            },
            type: sap.ui.core.mvc.ViewType.XML,
            viewName: "sap.ovp.app.Main"
        });
        var oEvent = {
            oSource: oDummyView,
            getSource: function () {
                return this.oSource;
            }
        };
        oController.getView = function () {
            return oDummyView;
        };
        var oComponent = new sap.ui.core.Component("", {});
        oController.getOwnerComponent = function () {
            return oComponent;
        };
        var oDummyModel = oController.getOwnerComponent();
        oDummyModel.setModel(uiModel, "ui");
        var testContainer = jQuery('<div id="testContainer" style="height:600px; width:1500px">').appendTo('body');
        var btn = new sap.m.Button({
            id: "actionBtn",
            press: "onShareButtonPress"
        });
        oDummyView.addDependent(btn);
        oDummyView.placeAt(testContainer);
        oController.onShareButtonPress(oEvent);
        oController._createModelForTile();
        oDummyView.destroy();
        ok(!!uiModel.getProperty("/tileInfo"), "Model for Tile Created");
    });
    test("Action Button - Send Email", function () {
        var uiModel = new sap.ui.model.json.JSONModel({
            cards: [{
                id: "card00"
            }, {
                id: "card01"
            }, {
                id: "card02"
            }, {
                id: "card03"
            }]
        });
        var oDummyView = new sap.ui.core.mvc.View("", {
            height: "100%",
            preprocessors: {
                xml: {
                    bindingContexts: {
                        ui: uiModel.createBindingContext("/")

                    },
                    models: {
                        ui: uiModel

                    }
                }
            },
            type: sap.ui.core.mvc.ViewType.XML,
            viewName: "sap.ovp.app.Main"
        });
        var oEvent = {
            oSource: oDummyView,
            getSource: function () {
                return this.oSource;
            }
        };
        oController.getView = function () {
            return oDummyView;
        };
        var oComponent = new sap.ui.core.Component("", {});
        oController.getOwnerComponent = function () {
            return oComponent;
        };
        var oDummyModel = oController.getOwnerComponent();
        oDummyModel.setModel(uiModel, "ui");
        var testContainer = jQuery('<div id="testContainer" style="height:600px; width:1500px">').appendTo('body');
        var btn = new sap.m.Button({
            press: "onShareButtonPress"
        });
        var emailbtn = new sap.m.Button({
            press: "shareEmailPressed"
        });
        oDummyView.addDependent(btn);
        oDummyView.addDependent(emailbtn);
        oDummyView.placeAt(testContainer);
        oController.onShareButtonPress(oEvent);
        var oEmailListener = oController._oShareActionButton.getAggregation("buttons")[0].mEventRegistry.press[0].oListener;
        sinon.stub(oEmailListener, "shareEmailPressed", function () {
            return true;
        });
        ok(oEmailListener.shareEmailPressed(), "Send Email option handled");
        oEmailListener.shareEmailPressed.restore();
    });

    //            asyncTest("validate _initSmartVariantManagement with variant", function () {
    //                var oComponent, dummyControl;
    //                jQuery.sap.require("sap.ui.comp.smartvariants.PersonalizableInfo");
    //                oController._createPersistencyControlForSmartVariantManagement = function () {
    //                    sap.ui.core.Control.extend("testing.Control", {
    //                        metadata: {
    //                            properties: {
    //                                persistencyKey: {type: "string", group: "Misc", defaultValue: null}
    //                            }
    //                        },
    //                        fetchVariant: function () {
    //                            return {};
    //                        },
    //                        applyVariant: function (oVariant) {
    //                        }
    //                    });
    //
    //                    dummyControl = new testing.Control({persistencyKey: "ovpTestVariant"});
    //                    dummyControl._sOwnerId = "testId";
    //                    oComponent = new sap.ui.core.UIComponent("testId", {});
    //
    //                    return dummyControl;
    //                };
    //
    //                jQuery.sap.require("sap.ui.core.util.MockServer");
    //                var server = new sap.ui.core.util.MockServer({
    //                    requests: [{
    //                        method: "GET",
    //                        // have MockServer fixed and pass just the URL!
    //                        path: "/sap/bc/lrep/flex/data/sap.ui.core.UIComponent.Component",
    //                        response: function (oXHR) {
    //                            oXHR.respondJSON(200,
    //                                    {"Content-Type": "application/json"},
    //                                    {
    //                                        "changes": [
    //                                            {
    //                                                "fileName": "id_1445521504780_141",
    //                                                "fileType": "change",
    //                                                "changeType": "defaultVariant",
    //                                                "component": "sap.ovp.demo.Component",
    //                                                "packageName": "",
    //                                                "content": {
    //                                                    "defaultVariantName": "id_1446737648663_159"
    //                                                },
    //                                                "selector": {
    //                                                    "persistencyKey": "ovpTestVariant"
    //                                                },
    //                                                "layer": "USER",
    //                                                "texts": {},
    //                                                "namespace": "sap.ui.core.UIComponent/changes/default",
    //                                                "creation": "2015-10-22T13:45:06.4199760Z",
    //                                                "originalLanguage": "EN",
    //                                                "conditions": {},
    //                                                "support": {
    //                                                    "generator": "Change.createInitialFileContent",
    //                                                    "service": "",
    //                                                    "user": "DAYANN"
    //                                                }
    //                                            },
    //                                            {
    //                                                "fileName": "id_1446737648663_159",
    //                                                "fileType": "variant",
    //                                                "changeType": "OVPVariant",
    //                                                "component": "sap.ui.core.UIComponent",
    //                                                "packageName": "",
    //                                                "content": {
    //                                                    "cards": [
    //                                                        {
    //                                                            "id": "card00",
    //                                                            "visibility": false
    //                                                        },
    //                                                        {
    //                                                            "id": "card01",
    //                                                            "visibility": false
    //                                                        },
    //                                                        {
    //                                                            "id": "card02",
    //                                                            "visibility": false
    //                                                        },
    //                                                        {
    //                                                            "id": "card03",
    //                                                            "visibility": true
    //                                                        },
    //                                                        {
    //                                                            "id": "card04",
    //                                                            "visibility": true
    //                                                        }
    //                                                    ]
    //                                                },
    //                                                "selector": {
    //                                                    "persistencyKey": "ovpTestVariant"
    //                                                },
    //                                                "layer": "USER",
    //                                                "texts": {
    //                                                    "variantName": {
    //                                                        "value": "Personalisation",
    //                                                        "type": "XFLD"
    //                                                    }
    //                                                },
    //                                                "namespace": "sap.ui.core.UIComponent",
    //                                                "creation": "2015-11-05T15:34:09.1026960Z",
    //                                                "originalLanguage": "EN",
    //                                                "conditions": {},
    //                                                "support": {
    //                                                    "generator": "Change.createInitialFileContent",
    //                                                    "service": "TBD",
    //                                                    "user": "DAYANN"
    //                                                }
    //                                            }
    //                                        ],
    //                                        "settings": {
    //                                            "isKeyUser": true,
    //                                            "isAtoAvailable": true,
    //                                            "isAtoEnabled": false,
    //                                            "isProductiveSystem": false
    //                                        }
    //                                    });
    //                        }
    //                    }]
    //                });
    //
    //                server.start();
    //                oController._initSmartVariantManagement();
    //                setTimeout(function () {
    //                    start();
    //                    oController.oPersistencyVariantPromise.then(function (oVariant) {
    //                        deepEqual(oVariant, {
    //                            "cards": [
    //                                {"id": "card00", "visibility": false},
    //                                {"id": "card01", "visibility": false},
    //                                {"id": "card02", "visibility": false},
    //                                {"id": "card03", "visibility": true},
    //                                {"id": "card04", "visibility": true}
    //                            ]
    //                        });
    //                        sap.ui.getCore().getComponent("testId").destroy();
    //                        server.stop();
    //                    });
    //                }, 200);
    //            });

    // asyncTest("validate oPersistencyVariantPromise onAfterRendering flow", function () {
    //     var oComponent, dummyControl;
    //     jQuery.sap.require("sap.ui.comp.smartvariants.PersonalizableInfo");

    //     oController._initGlobalFilter = function () {};
    //     oController.getLayout = function () {
    //         return {
    //             getContent: function () { return [{getId: function () { return "card00"}, getVisible: function () { return false; }},
    //                 {getId: function () { return "card01"}, getVisible: function () { return false; }},
    //                 {getId: function () { return "card02"}, getVisible: function () { return false; }}
    //             ];},
    //             removeAllContent: function () {},
    //             addStyleClass: function () {},
    //             getMetadata: function () { return {getName: function() {"sap.ovp.ui.EasyScanLayout"} } }
    //         };
    //     };
    //     oController._getCardId = function (id) { return id; };
    //     oController._updateLayoutWithOrderedCards = function () {};
    //     oController._initShowHideCardsButton= function () {};
    //     oController.oGlobalFilterLoadedPromise = {then:function(){}};

    //     oController._initFlexibilityPersonalization = function() { this.oFlexibilityPersonalizationPromise = Promise.resolve(); };

    //     jQuery.sap.require("sap.ui.core.util.MockServer");
    //     var server = new sap.ui.core.util.MockServer({
    //         requests: [{
    //             method: "GET",
    //             // have MockServer fixed and pass just the URL!
    //             path: "/sap/bc/lrep/flex/data/sap.ovp.testControl.Component",
    //             response: function (oXHR) {
    //                 oXHR.respondJSON(200,
    //                         {"Content-Type": "application/json"},
    //                         {
    //                             "changes": [
    //                                 {
    //                                     "fileName": "id_1445521504780_141",
    //                                     "fileType": "change",
    //                                     "changeType": "defaultVariant",
    //                                     "component": "sap.ovp.demo.Component",
    //                                     "packageName": "",
    //                                     "content": {
    //                                         "defaultVariantName": "id_1446737648663_159"
    //                                     },
    //                                     "selector": {
    //                                         "persistencyKey": "ovpTestVariant"
    //                                     },
    //                                     "layer": "USER",
    //                                     "texts": {},
    //                                     "namespace": "sap.ovp.testControl/changes/default",
    //                                     "creation": "2015-10-22T13:45:06.4199760Z",
    //                                     "originalLanguage": "EN",
    //                                     "conditions": {},
    //                                     "support": {
    //                                         "generator": "Change.createInitialFileContent",
    //                                         "service": "",
    //                                         "user": "DAYANN"
    //                                     }
    //                                 },
    //                                 {
    //                                     "fileName": "id_1446737648663_159",
    //                                     "fileType": "variant",
    //                                     "changeType": "OVPVariant",
    //                                     "component": "sap.ovp.testControl",
    //                                     "packageName": "",
    //                                     "content": {
    //                                         "cards": [
    //                                             {
    //                                                 "id": "card00",
    //                                                 "visibility": false
    //                                             },
    //                                             {
    //                                                 "id": "card01",
    //                                                 "visibility": false
    //                                             },
    //                                             {
    //                                                 "id": "card02",
    //                                                 "visibility": false
    //                                             },
    //                                             {
    //                                                 "id": "card03",
    //                                                 "visibility": true
    //                                             },
    //                                             {
    //                                                 "id": "card04",
    //                                                 "visibility": true
    //                                             }
    //                                         ]
    //                                     },
    //                                     "selector": {
    //                                         "persistencyKey": "ovpTestVariant"
    //                                     },
    //                                     "layer": "USER",
    //                                     "texts": {
    //                                         "variantName": {
    //                                             "value": "Personalisation",
    //                                             "type": "XFLD"
    //                                         }
    //                                     },
    //                                     "namespace": "sap.ovp.testControl",
    //                                     "creation": "2015-11-05T15:34:09.1026960Z",
    //                                     "originalLanguage": "EN",
    //                                     "conditions": {},
    //                                     "support": {
    //                                         "generator": "Change.createInitialFileContent",
    //                                         "service": "TBD",
    //                                         "user": "DAYANN"
    //                                     }
    //                                 }
    //                             ],
    //                             "settings": {
    //                                 "isKeyUser": true,
    //                                 "isAtoAvailable": true,
    //                                 "isAtoEnabled": false,
    //                                 "isProductiveSystem": false
    //                             }
    //                         });
    //             }
    //         }]
    //     });

    //     oController.getView = function() {
    //         return {
    //             getModel : function(modelName){
    //                 if (modelName === "ui") {
    //                     return new sap.ui.model.json.JSONModel({refreshIntervalInMinutes: "1.2", cards: {card1: {model: "model1"}}});
    //                 }
    //             },
    //             byId : function(arg) {
    //                 if(arg && (arg === "card00" || arg === "card01" || arg === "card02")) {
    //                     return {
    //                         getComponentInstance : function() {return false;}
    //                     }
    //                 }
    //                 else
    //                     return false;
    //             }
    //         }
    //     };

    //     oController.oNavigationHandler = {};
    //     oController.oCards = [{"model":"card01Model"},{"model":"card01Model"}];;

    //     server.start();
    //     oController.onInit();
    //     oController.onAfterRendering();

    //     ok(oController.nRefreshInterval != 0, "value of the refresh interval is set in the controller");

    //     setTimeout(function () {
    //         start();
    //         ok(oController.persistencyVariantLoaded = true, "persistency variant loaded");
    //         deepEqual(oController.aManifestOrderedCards, [{"id": "card00", "visibility": false},
    //             {"id": "card01", "visibility": false},
    //             {"id": "card02", "visibility": false}
    //         ]);
    //         server.stop();
    //     }, 200);
    // });

    /* asyncTest("validate _saveVaraint without variant", function() {
         var oComponent, dummyControl;
         jQuery.sap.require("sap.ui.comp.smartvariants.PersonalizableInfo");
         oController._createPersistencyControlForSmartVariantManagement = function () {
             sap.ui.core.Control.extend("testing.Control", {
                 metadata : {
                     properties : {
                         persistencyKey : {type : "string", group : "Misc", defaultValue : null}
                     }
                 },
                 fetchVariant: function() { return {}; },
                 applyVariant: function(oVariant) {}
             });

             dummyControl = new testing.Control({persistencyKey:"ovpTestVariant"});
             dummyControl._sOwnerId = "testId";
             sap.ui.core.UIComponent.extend("ovp.test.Comp", {});
             oComponent = new ovp.test.Comp("testId",{});

             return dummyControl;
         };

         jQuery.sap.require("sap.ui.core.util.MockServer");
         var server = new sap.ui.core.util.MockServer({
             requests: [{
                 method: "GET",
                 // have MockServer fixed and pass just the URL!
                 path: "/sap/bc/lrep/flex/data/ovp.test.Comp.Component",
                 response: function (oXHR) {
                     oXHR.respondJSON(200,
                             {"Content-Type": "application/json"},
                             {});
                 }
             }]
         });

         server.start();
         oController._initSmartVariantManagement();
         oController.smartVariandManagement.fireSave = sinon.spy();
         oController.saveVariant();
         setTimeout(function () {
             start();
             ok(oController.smartVariandManagement.fireSave.calledOnce);
             oController.smartVariandManagement.fireSave.calledWith({
                 name: "Personalisation",
                 global: false,
                 overwrite: false,
                 key: null,
                 def: true
             });
             sap.ui.getCore().getComponent("testId").destroy();
             server.stop();
         }, 100);
     });*/

    test("validate _setNavigationVariantToGlobalFilter INITIAL scenario", function () {
        var globalFilter = _mockGlobalFilter();
        sap.ui.generic.app.navigation.service.NavType = { initial: "INITIAL" };
        oController._setNavigationVariantToGlobalFilter(null, null, "INITIAL");

        ok(globalFilter.addFieldToAdvancedArea.notCalled);
        ok(globalFilter.clearVariantSelection.notCalled);
        ok(globalFilter.clear.notCalled);
        ok(globalFilter.setUiState.notCalled);
    });


    asyncTest("validate _parseNavigationVariant", function () {
        var globalFilter = _mockGlobalFilter();
        oController.oNavigationHandler = {
            parseNavigation: function () {
                return new jQuery.Deferred().resolve("test");
            }
        };
        oController._parseNavigationVariant();
        start();
        oController.oParseNavigationPromise.done(function (result) {
            if (oController.oContainer) {
                ok(result == "test");
            } else {
                ok(result == null);
            }

        });
    });

    /*****------------------------------------------------
     *
     * Test Cases for _getApplicationId Function
     *
     * ***-----------------------------------------------**/

    test("validate _getApplicationId", function () {

        var uiModel = new sap.ui.model.json.JSONModel({
            applicationId: "applicationID_1"
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getApplicationId();
        var expected = "applicationID_1"
        ok(actual == expected, "Returns the Application Id")
    });

    test("validate _getApplicationId - when application Id is not present", function () {

        var uiModel = new sap.ui.model.json.JSONModel({
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getApplicationId();
        var expected = undefined;
        ok(actual == expected, "Returns null")
    });

    /*****------------------------------------------------
     *
     * Test Cases for _getBaseUrl Function
     *
     * ***-----------------------------------------------**/

    test("validate _getBaseUrl", function () {

        var uiModel = new sap.ui.model.json.JSONModel({
            baseUrl: "www.google.com"
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getBaseUrl();
        var expected = "www.google.com";
        ok(actual == expected, "Returns the Base Url")
    });

    test("validate _getBaseUrl - when baseUrl is null", function () {

        var uiModel = new sap.ui.model.json.JSONModel({
        });
        oController.getUIModel = function () {
            return uiModel;
        };
        var actual = oController._getBaseUrl();
        var expected = undefined;
        ok(actual == expected, "Returns null for BaseUrl")
    });

    /*****------------------------------------------------
     *
     * Test Cases for _CreateModelViewMap Function
     *
     * ***-----------------------------------------------**/

    test("validate _CreateModelViewMap - oCard is undefined", function () {

        var oCard = undefined;
        var actual = oController._createModelViewMap(oCard);
        var expected = undefined;
        ok(actual == expected, "Returns null when oCard is not defined")
    });

    test("validate _CreateModelViewMap - when entity Set is null", function () {

        var oCard = {
            "model": "salesShare",
            "template": "sap.ovp.cards.charts.analytical",
            "settings": {
                "dataStep": "11",
                "valueSelectionInfo": "value selection info",
                "navigation": "noHeaderNav"
            },
            "id": "Vcard16_cardchartscolumnstacked"
        };

        var actual = oController._createModelViewMap(oCard);
        var expected = undefined;
        ok(actual == expected, "Returns null when entity set is not defined")
    });

    test("validate _CreateModelViewMap - when Template is not sap.ovp", function () {

        var oCard = {
            "model": "salesShare",
            "template": "analytical",
            "settings": {
                "dataStep": "11",
                "entitySet": "SalesShareColumnStacked",
                "valueSelectionInfo": "value selection info",
                "navigation": "noHeaderNav"
            },
            "id": "Vcard16_cardchartscolumnstacked"
        };

        var actual = oController._createModelViewMap(oCard);
        var expected = undefined;
        ok(actual == expected, "Returns undefined for wrong template")
    });


    test("validate _CreateModelViewMap - oCard is defined", function () {
        var oCard = {
            "model": "salesShare",
            "template": "sap.ovp.cards.charts.analytical",
            "settings": {
                "dataStep": "11",
                "title": "Sales by Country and Region",
                "subTitle": "Sales by Country and Region",
                "valueSelectionInfo": "value selection info",
                "navigation": "noHeaderNav",
                "entitySet": "SalesShareColumnStacked",
                "selectionAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionVariant#Eval_by_Currency_ColumnStacked",
                "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency_ColumnStacked",
                "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency_ColumnStacked",
                "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Currency-Generic",
                "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency_Scatter"
            },
            "id": "Vcard16_cardchartscolumnstacked"
        };
        oController.oModelViewMap = {};
        oController._createModelViewMap(oCard);
        ok(oController.oModelViewMap["salesShare"]["Vcard16_cardchartscolumnstacked"] == true);
    });


    /*****------------------------------------------------
     *
     * Test Cases for _gettemplateForChartFromVisualization Function
     *
     * ***-----------------------------------------------**/

    test("validate _gettemplateForChartFromVisualization - When chart type is donut", function () {

        var sPresentationPath = "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
            oCard = {
                "model": "salesShare",
                "template": "sap.ovp.cards.charts.smart.chart",
                "settings": {
                    "dataStep": "11",
                    "title": "(Analytical) Donut Card",
                    "subTitle": "Sales by Product",
                    "valueSelectionInfo": "value selection info",
                    "entitySet": "SalesShareDonut",
                    "ChartProperties": {
                        "plotArea": {
                            "dataLabel": {
                                "type": "percentage"
                            }
                        }
                    },
                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency"
                },
                "id": "Acard6_cardchartsdonut"
            },
            oModel = new sap.ui.model.json.JSONModel({}),
            EntitySet = {
                name: "SalesShareDonut",
                entityType: "sap.smartbusinessdemo.services.SalesShareDonutType",
                "Org.OData.Capabilities.V1.FilterRestrictions": {

                    NonFilterableProperties: [
                        {
                            PropertyPath: "ID"
                        },
                        {
                            PropertyPath: "TotalSales"
                        },
                        {
                            PropertyPath: "TotalSalesForecast"
                        },
                        {
                            PropertyPath: "OverallSales"
                        }
                    ]
                }
            },
            oEntityType = {
                "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency": {
                    "Title": {
                        "String": "Sales by Product"
                    },
                    "ChartType": {
                        "EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
                    },
                    "Measures": [
                        {
                            "PropertyPath": "Sales"
                        }
                    ],
                    "Dimensions": [
                        {
                            "PropertyPath": "Product"
                        }
                    ],
                    "MeasureAttributes": [
                        {
                            "Measure": {
                                "PropertyPath": "Sales"
                            },
                            "Role": {
                                "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
                            },
                            "DataPoint": {
                                "AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic"
                            },
                            "RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
                        }
                    ],
                    "DimensionAttributes": [
                        {
                            "Dimension": {
                                "PropertyPath": "Product"
                            },
                            "Role": {
                                "EnumMember": "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
                            },
                            "RecordType": "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType"
                        }
                    ],
                    "RecordType": "com.sap.vocabularies.UI.v1.ChartDefinitionType"
                },
                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency": {
                    "MaxItems": {
                        "Int": "3"
                    },
                    "GroupBy": [
                        {
                            "PropertyPath": "Country"
                        },
                        {
                            "PropertyPath": "Currency"
                        }
                    ],
                    "SortOrder": [
                        {
                            "Property": {
                                "PropertyPath": "Sales"
                            },
                            "Descending": {
                                "Boolean": "true"
                            }
                        }
                    ],
                    "Visualizations": [
                        {
                            "AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency"
                        }
                    ]
                }
            };
        var actual = oController._getTemplateForChartFromVisualization(sPresentationPath, oCard, oModel, EntitySet, oEntityType);
        ok(actual.oCard.template == "sap.ovp.cards.charts.analytical");
        ok(actual.bTemplateUpdated == true);
    });

    test("validate _getTemplateForChartFromVisualization - When Visulaization is not defined", function () {
        var sPresentationPath = "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
            oCard = {
                "model": "salesShare",
                "template": "sap.ovp.cards.charts.smart.chart",
                "settings": {
                    "dataStep": "11",
                    "title": "(Analytical) Donut Card",
                    "subTitle": "Sales by Product",
                    "valueSelectionInfo": "value selection info",
                    "entitySet": "SalesShareDonut",
                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency"
                },
                "id": "Acard6_cardchartsdonut"
            },
            oModel = new sap.ui.model.json.JSONModel({
            }),
            EntitySet = {
                name: "SalesShareDonut",
                entityType: "sap.smartbusinessdemo.services.SalesShareDonutType"
            },
            oEntityType = {
                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency": {
                    "MaxItems": {
                        "Int": "3"
                    },
                    "GroupBy": [
                        {
                            "PropertyPath": "Country"
                        },
                        {
                            "PropertyPath": "Currency"
                        }
                    ],
                    "SortOrder": [
                        {
                            "Property": {
                                "PropertyPath": "Sales"
                            },
                            "Descending": {
                                "Boolean": "true"
                            }
                        }
                    ]
                }
            };
        var actual = oController._getTemplateForChartFromVisualization(sPresentationPath, oCard, oModel, EntitySet, oEntityType);
        ok(actual.oCard.template == "sap.ovp.cards.charts.smart.chart");
        ok(actual.bTemplateUpdated == false);
    });

    test("validate _getTemplateForChartFromVisualization - When Chart Type is not Donut", function () {
        var sPresentationPath = "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
            oCard = {
                "model": "salesShare",
                "template": "sap.ovp.cards.charts.analytical",
                "settings": {
                    "dataStep": "11",
                    "title": "Line Chart",
                    "subTitle": "Sales by Product",
                    "valueSelectionInfo": "value selection info",
                    "entitySet": "SalesShare",
                    "selectionPresentationAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#BothSelectionAndPresentation",
                    "dataPointAnnotationPath": "com.sap.vocabularies.UI.v1.DataPoint#Eval_by_Country-Generic",
                    "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#Eval_by_Currency",
                    "presentationAnnotationPath": "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency",
                    "chartAnnotationPath": "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency"
                },
                "id": "Acard6_cardchartsLine"
            },
            oModel = new sap.ui.model.json.JSONModel({}),
            EntitySet = {
                name: "SalesShareLine",
                entityType: "sap.smartbusinessdemo.services.SalesShareLine"
            },
            oEntityType = {
                "com.sap.vocabularies.UI.v1.PresentationVariant#Eval_by_Currency": {
                    "MaxItems": {
                        "Int": "3"
                    },
                    "GroupBy": [
                        {
                            "PropertyPath": "Country"
                        },
                        {
                            "PropertyPath": "Currency"
                        }
                    ],
                    "Visualizations": [
                        {
                            "AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency"
                        }
                    ]
                },
                "com.sap.vocabularies.UI.v1.Chart#Eval_by_Currency": {
                    "Title": {
                        "String": "Sales by Product"
                    },
                    "ChartType": {
                        "EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Line"
                    },
                    "Measures": [
                        {
                            "PropertyPath": "Sales"
                        }
                    ],
                    "RecordType": "com.sap.vocabularies.UI.v1.ChartDefinitionType"
                }
            };
        var actual = oController._getTemplateForChartFromVisualization(sPresentationPath, oCard, oModel, EntitySet, oEntityType);
        ok(actual.oCard.template == "sap.ovp.cards.charts.smart.chart");
        ok(actual.bTemplateUpdated == true);
    });
});
