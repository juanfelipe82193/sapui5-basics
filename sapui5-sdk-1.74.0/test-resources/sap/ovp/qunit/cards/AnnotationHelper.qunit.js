sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "/sap/ovp/cards/AnnotationHelper"
],function (utils, mockservers, AnnotationHelper) {
            "use strict";
            /* module, ok, test, jQuery, sap */

            //jQuery.sap.require("AnnotationHelper");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //var utils = utils;

            module("sap.ovp.app.Main", {
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

            test("AnnotationHelper - checkFilterPreference function test", function () {
                var oSettings = {};
                var oModel = {
                    "getData": function () {
                        return oSettings;
                    }
                };

                ok(!AnnotationHelper.checkFilterPreference(oModel), "If Filter Preference is not present");

                oSettings = {
                    "mFilterPreference": "Outside tab level"
                };
                ok(!!AnnotationHelper.checkFilterPreference(oModel), "If Filter Preference is Outside tab level");

                oSettings.tabs = [{
                    "mFilterPreference": "Inside tab level -> First tab"
                }];
                ok(!!AnnotationHelper.checkFilterPreference(oModel), "If Filter Preference is Inside tab level -> First tab");

                oSettings.tabs.push({
                    "mFilterPreference": "Inside tab level -> Second tab"
                });
                oSettings.selectedKey = 2;
                ok(!!AnnotationHelper.checkFilterPreference(oModel), "If Filter Preference is Inside tab level -> Second tab");
            });

            test("AnnotationHelper - formartItems expand, sorter, filters and select", function () {
                //jQuery.sap.require("sap.ovp.test.mockservers");
                mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
                var cardTestData = {
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_for_formatItems.xml"
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                var oMetaModel = oModel.getMetaModel();
                oMetaModel.loaded().then(function () {
                    //start the async test
                    start();

                    var oCardProperties = {
                        "/contentFragment": "sap.ovp.cards.list.List",
                        "/metaModel" : oMetaModel,
                        "/cardId": "card_1"
                    };
                    var ctx = new utils.ContextMock({
                        ovpCardProperties : oCardProperties
                    });

                    var oEntitySet = oMetaModel.getODataEntitySet("SalesOrderSet");

                    //check simple case of no special configuration
                    var result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
                    ok(result.indexOf("expand") === -1, "simple - check no expand")
                    ok(result.indexOf("filters") === -1, "simple - check no filters")
                    ok(result.indexOf("sorter") === -1, "simple - check no sorter")

                    //check one filter from annotation
                    oCardProperties["/selectionAnnotationPath"] = "com.sap.vocabularies.UI.v1.SelectionVariant#oneFilter"
                    var aFilters = [];
                    aFilters.push({
                        path: "GrossAmount",
                        operator: "BT",
                        value1: 0,
                        value2: 800000,
                        sign: "I"
                    });

                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    ok(result.indexOf("expand") === -1, "oneFilter - check no expand")
                    ok(result.indexOf("filters") > 0, "oneFilter - check filters existence")
                    ok(result.indexOf("filters:"+JSON.stringify(aFilters)) > 0, "oneFilter - check filters value")
                    ok(result.indexOf("sorter") === -1, "oneFilter - check no sorter")

                    //check two filters from annotation
                    oCardProperties["/selectionAnnotationPath"] = "com.sap.vocabularies.UI.v1.SelectionVariant#twoFilters"
                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    aFilters.push({
                        path: "LifecycleStatus",
                        operator: "EQ",
                        value1: "N",
                        sign: "I"
                    });

                    ok(result.indexOf("expand") === -1, "twoFilters - check no expand")
                    ok(result.indexOf("filters") > 0, "twoFilters - filters existence")
                    ok(result.indexOf("filters:"+JSON.stringify(aFilters)) > 0, "twoFilters - check filters value")
                    ok(result.indexOf("sorter") === -1, "twoFilters - check no sorter")

                    //check two filters from annotation + config filter
                    var oConfigFilter = {
                        path: "configFilter",
                        operator: "EQ",
                        value1: "configValue",
                        sign: "I"
                    };

                    oCardProperties["/filters"] = [oConfigFilter]
                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    aFilters.unshift(oConfigFilter);

                    ok(result.indexOf("expand") === -1, "twoFilters + config filter - check no expand")
                    ok(result.indexOf("filters") > 0, "twoFilters + config filter - check filters existence")
                    ok(result.indexOf("filters:"+JSON.stringify(aFilters)) > 0, "twoFilters + config filter - check filters value")
                    ok(result.indexOf("sorter") === -1, "twoFilters + config filter - check no sorter")

                    //check config filter
                    oCardProperties["/selectionAnnotationPath"] = undefined;
                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    aFilters = [oConfigFilter];

                    ok(result.indexOf("expand") === -1, "config filter - check no expand")
                    ok(result.indexOf("filters") > 0, "config filter - check filters existence")
                    ok(result.indexOf("filters:"+JSON.stringify(aFilters)) > 0, "config filter - check filters value")
                    ok(result.indexOf("sorter") === -1, "config filter - check no sorter")

                    //check no filters and one sorter from annotation
                    oCardProperties["/filters"] = undefined;
                    oCardProperties["/presentationAnnotationPath"] = "com.sap.vocabularies.UI.v1.PresentationVariant#oneSorter"

                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    var aSorters = [];
                    aSorters.push({
                        path: "GrossAmount",
                        descending: false
                    });

                    ok(result.indexOf("expand") === -1, "oneSorter - check no expand")
                    ok(result.indexOf("filters") === -1, "oneSorter - check no filters")
                    ok(result.indexOf("sorter") > 0, "oneSorter - check sorter existence")
                    ok(result.indexOf("sorter:"+JSON.stringify(aSorters)) > 0, "oneSorter - check sorter value")

                    //check no filters and three sorters from annotation
                    oCardProperties["/presentationAnnotationPath"] = "com.sap.vocabularies.UI.v1.PresentationVariant#threeSorters"
                    oCardProperties["mFilterPreference"] = {};

                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    aSorters.push({
                        path: "NetAmount",
                        descending: true
                    });
                    aSorters.push({
                        path: "TaxAmount",
                        descending: true
                    });

                    ok(result.indexOf("expand") === -1, "threeSorters - check no expand")
                    ok(result.indexOf("filters") === -1, "threeSorters - check no filters")
                    ok(result.indexOf("sorter") > 0, "threeSorters - check sorter existence")
                    ok(result.indexOf("sorter:"+JSON.stringify(aSorters)) > 0, "threeSorters - check sorter value")
                    ok(result.indexOf("parameters: {custom: {cardId: 'card_1'}}") > 0, "Parameters - custom parameter as card id")
                    delete oCardProperties.mFilterPreference;


                    //check no filters, three sorters from annotation and one from config
                    oCardProperties["/sortBy"] = "configSortBy";
                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    aSorters.unshift({
                        path: "configSortBy",
                        descending: true
                    });

                    ok(result.indexOf("expand") === -1, "threeSorters + config sorter - check no expand")
                    ok(result.indexOf("filters") === -1, "threeSorters + config sorter - check no filters")
                    ok(result.indexOf("sorter") > 0, "threeSorters + config sorter - check sorter existence")
                    ok(result.indexOf("sorter:"+JSON.stringify(aSorters)) > 0, "threeSorters + config sorter - check sorter value")

                    //check no filters and one sorter from config
                    oCardProperties["/presentationAnnotationPath"] = undefined
                    result = AnnotationHelper.formatItems(ctx, oEntitySet);
                    aSorters = [{
                        path: "configSortBy",
                        descending: true
                    }];

                    ok(result.indexOf("expand") === -1, "config sorter - check no expand")
                    ok(result.indexOf("filters") === -1, "config sorter - check no filters")
                    ok(result.indexOf("sorter") > 0, "config sorter - check sorter existence")
                    ok(result.indexOf("sorter:"+JSON.stringify(aSorters)) > 0, "config sorter - check sorter value")


                    //check expand
                    oCardProperties["/sortBy"] = undefined;
                    oCardProperties["mFilterPreference"] = {};
                    result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem#expand");
                    ok(result.indexOf("expand") > 0, "expand - check expand existence")
                    ok(result.indexOf("parameters: {expand: 'ToBusinessPartner'") > 0, "expand - check expand value")
                    ok(result.indexOf("filters") === -1, "expand - check no filters")
                    ok(result.indexOf("sorter") === -1, "expand - check no sorter")
                    ok(result.indexOf(", custom: {cardId: 'card_1'}") > 0, "Parameters - custom parameter as card id")
                    delete oCardProperties.mFilterPreference;

                    //check select flag is true
                    oCardProperties["/addODataSelect"] = true;
                    result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
                    ok(result.indexOf("expand") === -1, "select - check no expand")
                    ok(result.indexOf("select") > 0, "select - check select existence")
                    ok(result.indexOf("parameters: {select: 'SalesOrderID,CustomerName,GrossAmount,CurrencyCode,NetAmount,LifecycleStatus,CreatedAt,ChangedAt,LifecycleStatusDescription'}") > 0, "select - check select value")
                    ok(result.indexOf("filters") === -1, "select - check no filters")
                    ok(result.indexOf("sorter") === -1, "select - check no sorter")

                    //check select flag is false
                    oCardProperties["/addODataSelect"] = false;
                    result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
                    ok(result.indexOf("expand") === -1, "select - check no expand")
                    ok(result.indexOf("select") === -1, "select - check no select")
                    ok(result.indexOf("filters") === -1, "select - check no filters")
                    ok(result.indexOf("sorter") === -1, "select - check no sorter")

                    //check select flag is undefined
                    oCardProperties["/addODataSelect"] = undefined;
                    result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem");
                    ok(result.indexOf("expand") === -1, "select - check no expand")
                    ok(result.indexOf("select") === -1, "select - check no select")
                    ok(result.indexOf("filters") === -1, "select - check no filters")
                    ok(result.indexOf("sorter") === -1, "select - check no sorter")

                    //check filters and sorterds from annotation and config and select flag is true
                    oCardProperties["/sortBy"] = "configSortBy";
                    oCardProperties["/presentationAnnotationPath"] = "com.sap.vocabularies.UI.v1.PresentationVariant#threeSorters"
                    oCardProperties["/filters"] = [oConfigFilter]
                    oCardProperties["/selectionAnnotationPath"] = "com.sap.vocabularies.UI.v1.SelectionVariant#twoFilters"
                    oCardProperties["/addODataSelect"] = true;

                    aSorters = [];
                    aSorters.push({
                        path: "configSortBy",
                        descending: true
                    });
                    aSorters.push({
                        path: "GrossAmount",
                        descending: false
                    });
                    aSorters.push({
                        path: "NetAmount",
                        descending: true
                    });
                    aSorters.push({
                        path: "TaxAmount",
                        descending: true
                    });

                    aFilters = [];
                    aFilters.push(oConfigFilter);
                    aFilters.push({
                        path: "GrossAmount",
                        operator: "BT",
                        value1: 0,
                        value2: 800000,
                        sign: "I"
                    });
                    aFilters.push({
                        path: "LifecycleStatus",
                        operator: "EQ",
                        value1: "N",
                        sign: "I"
                    });

                    result = AnnotationHelper.formatItems(ctx, oEntitySet, "com.sap.vocabularies.UI.v1.LineItem#expand");
                    ok(result.indexOf("expand") > 0, "expand - check expand existence")
                    ok(result.indexOf("expand: 'ToBusinessPartner'") > 0, "expand - check expand value")
                    ok(result.indexOf("filters") > 0, "oneFilter - check filters existence")
                    ok(result.indexOf("filters:"+JSON.stringify(aFilters)) > 0, "oneFilter - check filters value")
                    ok(result.indexOf("sorter") > 0, "threeSorters + config sorter - check sorter existence")
                    ok(result.indexOf("sorter:"+JSON.stringify(aSorters)) > 0, "threeSorters + config sorter - check sorter value")
                    ok(result.indexOf("select") > 0, "select - check select existence")
                    ok(result.indexOf("select: 'SalesOrderID,ToBusinessPartner/CompanyName,ToBusinessPartner/EmailAddress,NetAmount,CurrencyCode,LifecycleStatus,CreatedAt,ChangedAt,LifecycleStatusDescription'") > 0, "select - check select value")


                    mockservers.close();

                });
            });

            test("Annotation Helper  _criticalityToValue", function () {
                var criticality = {};

                criticality.EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Negative";
                var result = AnnotationHelper._criticality2state(criticality, AnnotationHelper.criticalityConstants.StateValues);
                ok(result === "Error");

                criticality.EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Critical";
                var result = AnnotationHelper._criticality2state(criticality, AnnotationHelper.criticalityConstants.StateValues);
                ok(result === "Warning");

                criticality.EnumMember = "com.sap.vocabularies.UI.v1.CriticalityType/Positive";
                var result = AnnotationHelper._criticality2state(criticality, AnnotationHelper.criticalityConstants.StateValues);
                ok(result === "Success");

                criticality.EnumMember = "";
                var result = AnnotationHelper._criticality2state(criticality, AnnotationHelper.criticalityConstants.StateValues);
                ok(result === "None");

                criticality.EnumMember = null;
                var result = AnnotationHelper._criticality2state(criticality, AnnotationHelper.criticalityConstants.StateValues);
                ok(result === "None");

                criticality = null;
                var result = AnnotationHelper._criticality2state(criticality, AnnotationHelper.criticalityConstants.StateValues);
                ok(result === "None");
            });

            test("Annotation Helper  _calculateCriticalityState", function () {
                var sResult;

                sResult = AnnotationHelper._calculateCriticalityState(
                        501,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
                        500,
                        undefined,
                        5000,
                        undefined,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Warning");

                sResult = AnnotationHelper._calculateCriticalityState(
                        5001,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
                        500,
                        undefined,
                        5000,
                        undefined,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Success");

                sResult = AnnotationHelper._calculateCriticalityState(
                        4999,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
                        500,
                        undefined,
                        5000,
                        undefined,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Warning");

                sResult = AnnotationHelper._calculateCriticalityState(
                        19,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
                        30,
                        undefined,
                        50,
                        undefined,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Error");


                sResult = AnnotationHelper._calculateCriticalityState(
                        501,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
                        undefined,
                        "500",
                        undefined,
                        "5000",
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Success");

                sResult = AnnotationHelper._calculateCriticalityState(
                        4999,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
                        undefined,
                        "500",
                        undefined,
                        5000,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Success");

                sResult = AnnotationHelper._calculateCriticalityState(
                        49999,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
                        undefined,
                        "500",
                        undefined,
                        5000,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Error");

                sResult = AnnotationHelper._calculateCriticalityState(
                        31,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Minimize",
                        undefined,
                        50,
                        undefined,
                        30,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Warning");

                sResult = AnnotationHelper._calculateCriticalityState(
                        31,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
                        undefined,
                        "50",
                        undefined,
                        30,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "None");

                sResult = AnnotationHelper._calculateCriticalityState(
                        31,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
                        30,
                        50,
                        "30",
                        "45",
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Success");

                sResult = AnnotationHelper._calculateCriticalityState(
                        10,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
                        30,
                        50,
                        30,
                        "45",
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "Error");

                sResult = AnnotationHelper._calculateCriticalityState(
                        undefined,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Target",
                        30,
                        50,
                        30,
                        "45",
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "None");

                // empty arguments
                sResult = AnnotationHelper._calculateCriticalityState();
                ok(!sResult);

                // all arguments undefined/null - for state
                sResult = AnnotationHelper._calculateCriticalityState(
                        undefined,
                        undefined,
                        null,
                        null,
                        undefined,
                        undefined,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "None");

                // all arguments undefined/null - for color
                sResult = AnnotationHelper._calculateCriticalityState(
                        undefined,
                        undefined,
                        null,
                        null,
                        undefined,
                        undefined,
                        AnnotationHelper.criticalityConstants.ColorValues
                );
                ok(sResult === "Neutral");

                // value exist, all thresholds undefined
                sResult = AnnotationHelper._calculateCriticalityState(
                        19,
                        undefined,
                        null,
                        null,
                        undefined,
                        undefined,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "None");


                sResult = AnnotationHelper._calculateCriticalityState(
                        19,
                        "com.sap.vocabularies.UI.v1.CriticalityCalculationType/Maximize",
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        AnnotationHelper.criticalityConstants.StateValues
                );
                ok(sResult === "None");
            });

            test("Annotation Helper - calculateTrendDirection", function () {

                var aggregateValue;
                var referenceValue;
                var downDirection;
                var upDirection;

                aggregateValue = 200;
                referenceValue = 1000;
                downDirection = "10";
                upDirection = "100";
                ok(AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection) === "Down");

                aggregateValue = 200;
                referenceValue = 100;
                downDirection = "10";
                upDirection = "100";
                ok(AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection) === "Up");

                aggregateValue = 50;
                referenceValue = undefined;
                downDirection = "10";
                upDirection = "100";
                ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

                aggregateValue = 50;
                referenceValue = undefined;
                downDirection = "10";
                upDirection = "100";
                ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

                aggregateValue = 50;
                referenceValue = undefined;
                downDirection = "10";
                upDirection = "100";
                ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

                aggregateValue = 50;
                referenceValue = undefined;
                downDirection = undefined;
                upDirection = "100";
                ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

                aggregateValue = 50;
                referenceValue = undefined;
                downDirection = "10";
                upDirection = undefined;
                ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));

                aggregateValue = 50;
                referenceValue = undefined;
                downDirection = undefined;
                upDirection = undefined;
                ok(!AnnotationHelper._calculateTrendDirection(aggregateValue, referenceValue, downDirection, upDirection));
            });

            test("Annotation Helper - formatItems - one sort via card configuration", function () {

                // preparing the entity set
                var oEntitySet = {};
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/sortBy" :  "sortByConfiguration_1",
                        "/sortOrder" : "descending",
                        "/contentFragment": "sap.ovp.cards.table.Table",
                        "/metaModel" : utils.createMetaModel()
                    }
                });

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet);
                ok(result === "{path: '/entitySetName', length: 5, sorter:[{\"path\":\"sortByConfiguration_1\",\"descending\":true}]}");
            });

            test("Annotation Helper - formatItems - with expand parameter of annotationPath that do not exists", function () {

                var oEntitySet = [];
                oEntitySet.name = "entitySetName";

                // preparing the entity set
                var oEntitySet = [];
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/contentFragment": "sap.ovp.cards.table.Table",
                        "/annotationPath": "annotationThatDoNotExists",
                        "/metaModel" : utils.createMetaModel()
                    }
                });

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet, "annotationThatDoNotExists");
                ok(result === "{path: '/entitySetName', length: 5}");
            });

            test("Annotation Helper - formatItems - with filter", function () {
                var oEntitySet = [];
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/contentFragment": "sap.ovp.cards.table.Table",
                        "/annotationPath": "annotationThatDoNotExists",
                        "/metaModel" : utils.createMetaModel(),
                        "/filters": [{value1: "testVal", operator: "EQ", path: "CustomerID", sign: "I"}]
                    }
                });

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet, "annotationThatDoNotExists");
                ok(result === '{path: \'/entitySetName\', length: 5, filters:[{"value1":"testVal","operator":"EQ","path":"CustomerID","sign":"I"}]}');
            });

            test("Annotation Helper - getItemsLength - TableCard Desktop", function () {

                // preparing the entity set
                var oEntitySet = {};
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/contentFragment": "sap.ovp.cards.table.Table",
                        "/metaModel" : utils.createMetaModel()
                    }
                });

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet);
                ok(result === "{path: '/entitySetName', length: 5}");
            });

            test("Annotation Helper - getItemsLength - CondensedListCard Desktop", function () {

                // preparing the entity set
                var oEntitySet = {};
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/contentFragment": "sap.ovp.cards.list.List",
                        "/metaModel" : utils.createMetaModel()
                    }
                });

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet);
                ok(result === "{path: '/entitySetName', length: 5}");
            });

            test("Annotation Helper - getItemsLength - Extended Card Desktop", function () {

                // preparing the entity set
                var oEntitySet = {};
                oEntitySet.name = "entitySetName";


                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/contentFragment": "sap.ovp.cards.list.List",
                        "/listType": "extended",
                        "/metaModel" : utils.createMetaModel()
                    }
                });

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet);
                ok(result === "{path: '/entitySetName', length: 3}");
            });

            test("Annotation Helper - getItemsLength - Condensed BAR ListCard Desktop", function () {

                // preparing the entity set
                var oEntitySet = {};
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/contentFragment": "sap.ovp.cards.list.List",
                        "/listFlavor":"bar",
                        "/metaModel" : utils.createMetaModel()
                    }
                });
                var oModel = ctx.getSetting('ovpCardProperties');

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet);
                ok(result === "{path: '/entitySetName', length: 5}");
            });

            test("Annotation Helper - getItemsLength - Extended BAR Card Desktop", function () {

                // preparing the entity set
                var oEntitySet = {};
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/contentFragment": "sap.ovp.cards.list.List",
                        "/listType": "extended",
                        "/listFlavor":"bar",
                        "/metaModel" : utils.createMetaModel()
                    }
                });
                var oModel = ctx.getSetting('ovpCardProperties');

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet);
                ok(result === "{path: '/entitySetName', length: 3}");
            });

            test("Annotation Helper - getItemsLength - No Card Type Desktop", function () {

                // preparing the entity set
                var oEntitySet = {};
                oEntitySet.name = "entitySetName";

                // preparing the context
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/metaModel" : utils.createMetaModel()
                    }
                });
                var oModel = ctx.getSetting('ovpCardProperties');

                // format items
                var result = AnnotationHelper.formatItems(ctx, oEntitySet);
                ok(result === "{path: '/entitySetName', length: 5}");
            });


            test("Annotation Helper - formatUrl - relative to Host name URL", function () {
                var sUrl = "/relativeUrl";
                var result = AnnotationHelper.formatUrl(undefined, sUrl);
                ok(result === sUrl);
            });

            test("Annotation Helper - formatUrl - absolute URL", function () {
                var sUrl = "http://absoluteUrl";
                var result = AnnotationHelper.formatUrl(undefined, sUrl);
                ok(result === sUrl);
            });

            test("Annotation Helper - formatUrl - relative to current resource - Base URL in Model exist", function () {

                var sUrl = "relativeUrl";
                var sBaseUrl = "http://baseUrl";

                // preparing the context
                var ctx = new utils.ContextMock({
                    model : {
                        "/baseUrl" : sBaseUrl
                    }
                });

                var result = AnnotationHelper.formatUrl(ctx, sUrl);
                ok(result === sBaseUrl + "/" + sUrl);
            });

            test("Annotation Helper - getDataPointsCount - only relevant items exist", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_1";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[1].Target = {};
                aCollection[1].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_2";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[2].Target = {};
                aCollection[2].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_3";

                var result = AnnotationHelper.getDataPointsCount(ctx, aCollection);
                ok(result === 3);
            });

            test("Annotation Helper - getDataPointsCount - items contains some not-relevant annotation targets", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "someValue_1";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[1].Target = {};
                aCollection[1].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_2";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[2].Target = {};
                aCollection[2].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint#SomeValue_3";

                var result = AnnotationHelper.getDataPointsCount(ctx, aCollection);
                ok(result === 2);
            });


            test("Annotation Helper - getFirstDataFieldName - 4 items, no Importance", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";


                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.getFirstDataFieldName(ctx, aCollection);
                ok(result === "Property 0");
            });

            test("Annotation Helper - getFirstDataFieldName - 4 items, with Importance", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = [];
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = [];
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";


                aCollection[2] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.getFirstDataFieldName(ctx, aCollection);
                ok(result === "Property 2");
            });

            test("Annotation Helper - getSecondDataFieldName - 4 items, no Importance", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";


                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.getSecondDataFieldName(ctx, aCollection);
                ok(result === "Property 1");
            });

            test("Annotation Helper - getSecondDataFieldName - 4 items, with Importance", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = [];
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = [];
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";


                aCollection[2] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.getSecondDataFieldName(ctx, aCollection);
                ok(result === "Property 3");
            });


            test("Annotation Helper - getThirdDataFieldName - 4 items, no Importance", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";


                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.getThirdDataFieldName(ctx, aCollection);
                ok(result === "Property 2");
            });

            test("Annotation Helper - getThirdDataFieldName - 4 items, with Importance", function () {
                var ctx = new utils.ContextMock();
                var aCollection = [];
                aCollection[0] = [];
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = [];
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";


                aCollection[2] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.getThirdDataFieldName(ctx, aCollection);
                ok(result === "Property 3");
            });


            test("Annotation Helper - hasActions", function () {
                var ctx = new utils.ContextMock();

                var aCollection = [
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"}
                ];

                var result = AnnotationHelper.hasActions(ctx, aCollection);
                ok(result, "only DataFieldForAction exists");

                var aCollection = [
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"}
                ];

                var result = AnnotationHelper.hasActions(ctx, aCollection);
                ok(result, "only DataFieldForIntentBasedNavigation exists");

                var aCollection = [
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl"}
                ];

                var result = AnnotationHelper.hasActions(ctx, aCollection);
                ok(result, "only DataFieldWithUrl exists");

                var aCollection = [
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"}
                ];

                var result = AnnotationHelper.hasActions(ctx, aCollection);
                ok(result, "all actions types exists");

                var aCollection = [
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"},
                    {RecordType: "com.sap.vocabularies.UI.v1.DataField"}
                ];

                var result = AnnotationHelper.hasActions(ctx, aCollection);
                ok(!result, "no actions exists");
            });

            test("Annotation Helper - formatFirstDataFieldValue - 4 items, no Importance", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 0);
                ok(result === "{Property_0}");
            });


            test("Annotation Helper - formatFirstDataFieldValue - 4 items, with Importance", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 0);
                ok(result === "{Property_1}");
            });

            test("Annotation Helper - formatSecondDataFieldValue - 4 items, no Importance", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 1);
                ok(result === "{Property_1}");
            });


            test("Annotation Helper - formatSecondDataFieldValue - 4 items, with 2 Importance fields ", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 1);
                ok(result === "{Property_1}");
            });

            test("Annotation Helper - formatThirdDataFieldValue - 4 items, no Importance", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 2);
                ok(result === "{Property_2}");
            });


            test("Annotation Helper - formatThirdDataFieldValue - 4 items, with 2 Importance fields ", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 2);
                ok(result === "{Property_0}");
            });

            test("Annotation Helper - formatFourthDataFieldValue - 4 items, no Importance", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 3);
                ok(result === "{Property_3}");
            });


            test("Annotation Helper - formatFourthDataFieldValue - 4 items, with 2 Importance fields ", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 3);
                ok(result === "{Property_0}");
            });


            test("Annotation Helper - formatFifthDataFieldValue -7 items, no Importance", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                aCollection[4] = {};
                aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[4].Label = {}
                aCollection[4].Label.String = "Property 4";
                aCollection[4].Value = {}
                aCollection[4].Value.Path = "Property_4";

                aCollection[5] = {};
                aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[5].Label = {}
                aCollection[5].Label.String = "Property 5";
                aCollection[5].Value = {}
                aCollection[5].Value.Path = "Property_5";


                aCollection[6] = {};
                aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[6].Label = {}
                aCollection[6].Label.String = "Property 6";
                aCollection[6].Value = {}
                aCollection[6].Value.Path = "Property_6";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 4);
                ok(result === "{Property_4}");
            });


            test("Annotation Helper - formatFifthDataFieldValue - 7 items, with 2 Importance fields ", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                aCollection[4] = {};
                (aCollection[4])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[4])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[4].Label = {}
                aCollection[4].Label.String = "Property 4";
                aCollection[4].Value = {}
                aCollection[4].Value.Path = "Property_4";

                aCollection[5] = {};
                aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[5].Label = {}
                aCollection[5].Label.String = "Property 5";
                aCollection[5].Value = {}
                aCollection[5].Value.Path = "Property_5";


                aCollection[6] = {};
                (aCollection[6])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[6])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[6].Label = {}
                aCollection[6].Label.String = "Property 6";
                aCollection[6].Value = {}
                aCollection[6].Value.Path = "Property_6";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 4);
                ok(result === "{Property_6}");
            });

            test("Annotation Helper - formatSixthDataFieldValue - 7 items, no Importance", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                aCollection[4] = {};
                aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[4].Label = {}
                aCollection[4].Label.String = "Property 4";
                aCollection[4].Value = {}
                aCollection[4].Value.Path = "Property_4";

                aCollection[5] = {};
                aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[5].Label = {}
                aCollection[5].Label.String = "Property 5";
                aCollection[5].Value = {}
                aCollection[5].Value.Path = "Property_5";


                aCollection[6] = {};
                aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[6].Label = {}
                aCollection[6].Label.String = "Property 6";
                aCollection[6].Value = {}
                aCollection[6].Value.Path = "Property_6";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 5);
                ok(result === "{Property_5}");
            });


            test("Annotation Helper - formatSixthDataFieldValue - 7 items, with 2 Importance fields ", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    }
                });
                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[0].Label = {}
                aCollection[0].Label.String = "Property 0";
                aCollection[0].Value = {}
                aCollection[0].Value.Path = "Property_0";

                aCollection[1] = {};
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[1])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[1].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[1].Label = {}
                aCollection[1].Label.String = "Property 1";
                aCollection[1].Value = {}
                aCollection[1].Value.Path = "Property_1";

                aCollection[2] = {};
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[2])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[2].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[2].Label = {}
                aCollection[2].Label.String = "Property 2";
                aCollection[2].Value = {}
                aCollection[2].Value.Path = "Property_2";


                aCollection[3] = {};
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[3])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[3].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[3].Label = {}
                aCollection[3].Label.String = "Property 3";
                aCollection[3].Value = {}
                aCollection[3].Value.Path = "Property_3";

                aCollection[4] = {};
                (aCollection[4])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[4])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Medium";
                aCollection[4].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[4].Label = {}
                aCollection[4].Label.String = "Property 4";
                aCollection[4].Value = {}
                aCollection[4].Value.Path = "Property_4";

                aCollection[5] = {};
                aCollection[5].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[5].Label = {}
                aCollection[5].Label.String = "Property 5";
                aCollection[5].Value = {}
                aCollection[5].Value.Path = "Property_5";


                aCollection[6] = {};
                (aCollection[6])["com.sap.vocabularies.UI.v1.Importance"] = [];
                (aCollection[6])["com.sap.vocabularies.UI.v1.Importance"].EnumMember = "com.sap.vocabularies.UI.v1.ImportanceType/Low";
                aCollection[6].RecordType = "com.sap.vocabularies.UI.v1.DataField";
                aCollection[6].Label = {}
                aCollection[6].Label.String = "Property 6";
                aCollection[6].Value = {}
                aCollection[6].Value.Path = "Property_6";

                var result = AnnotationHelper.formatDataFieldValueOnIndex(ctx, aCollection, 5);
                ok(result === "{Property_0}");
            });

            test("Annotation Helper - formatDataPoint with valueFormat annotation", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    },
                    model : {
                        "com.sap.vocabularies.UI.v1.DataPoint" : {
                            Value : {
                                Path : "dataPoint"
                            },
                            ValueFormat : {
                                NumberOfFractionalDigits: {
                                    Int : 2
                                }
                            }
                        }
                    }

                });

                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

                var result = AnnotationHelper.formatDataPointValueOnIndex (ctx, aCollection, 0);
                ok(result.indexOf("formatNumberCalculation2") > -1);
            });

            test("Annotation Helper - formatDataPoint with valueFormat annotation and 'scale' attribute in the metadata", function () {
                var oOdataProperty = {scale: "3"};
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, oOdataProperty)
                    },
                    model : {
                        "com.sap.vocabularies.UI.v1.DataPoint" : {
                            Value : {
                                Path : "dataPoint"
                            },
                            ValueFormat : {
                                NumberOfFractionalDigits: {
                                    Int : 2
                                }
                            }
                        }
                    }

                });

                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

                var result = AnnotationHelper.formatDataPointValueOnIndex (ctx, aCollection, 0);
                ok(result.indexOf("formatNumberCalculation2") > -1, "The number format function was generated from the value format 'NumberOfFractionalDigits' property");
            });

            test("Annotation Helper - formatDataPoint with no valueFormat annotation and with 'scale' attribute in the metadata will have default value as Zero", function () {
                var oOdataProperty = {scale: "3"};
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, oOdataProperty)
                    },
                    model : {
                        "com.sap.vocabularies.UI.v1.DataPoint" : {
                            Value : {
                                Path : "dataPoint"
                            }
                        }
                    }

                });

                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

                var result = AnnotationHelper.formatDataPointValueOnIndex (ctx, aCollection, 0);
                ok(result.indexOf("formatNumberCalculation0") > -1, "The number format function is generated from the default value zero if no valueFormat annotation is provided");
            });

            test("Annotation Helper - formatDataPoint with no valueFormat annotation and no 'scale' attribute in the metadata", function () {
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, {})
                    },
                    model : {
                        "com.sap.vocabularies.UI.v1.DataPoint" : {
                            Value : {
                                Path : "dataPointPath"
                            }
                        }
                    }

                });

                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

                var result = AnnotationHelper.formatDataPointValueOnIndex (ctx, aCollection, 0);
                ok(result.indexOf("dataPointPath") > -1, "formatField formatted the field with the standard UI5 formatter");
                ok(result.indexOf("formatNumberCalculation") <= -1, "no numberFormat was generated")
            });

            test("Annotation Helper - formatDataPoint with 'Org.OData.Measures.V1.ISOCurrency' annotation", function () {
                var oOdataProperty = {"Org.OData.Measures.V1.ISOCurrency" : {Path : "currencyCode"}};
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, oOdataProperty)
                    },
                    model : {
                        "com.sap.vocabularies.UI.v1.DataPoint" : {
                            Value : {
                                Path : "dataPointPath"
                            }
                        }
                    }

                });

                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

                var result = AnnotationHelper.formatDataPointValueOnIndex (ctx, aCollection, 0);
                ok(result.indexOf("currencyCode") > -1, "formatField added the currency path to the formatted value");
            });

            test("Annotation Helper - formatDataPoint with 'Org.OData.Measures.V1.Unit' annotation", function () {
                var oOdataProperty = {"Org.OData.Measures.V1.ISOCurrency" : {Path : "unitCode"}};
                var ctx = new utils.ContextMock({
                    ovpCardProperties : {
                        "/entityType" : {},
                        "/metaModel" : utils.createMetaModel({}, oOdataProperty)
                    },
                    model : {
                        "com.sap.vocabularies.UI.v1.DataPoint" : {
                            Value : {
                                Path : "dataPoint"
                            }
                        }
                    }

                });

                var aCollection = [];
                aCollection[0] = {};
                aCollection[0].RecordType = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
                aCollection[0].Target = {};
                aCollection[0].Target.AnnotationPath = "@com.sap.vocabularies.UI.v1.DataPoint";

                var result = AnnotationHelper.formatDataPointValueOnIndex (ctx, aCollection, 0);
                ok(result.indexOf("unitCode") > -1, "formatField added the unit path to the formatted value");
            });


            test("Annotation Helper - getPropertiesFromBindingString", function () {

                var sBinding;
                var aResult;

                sBinding = "{P1} {P2}/{P3}";
                aResult = AnnotationHelper._getPropertiesFromBindingString(sBinding);
                ok(aResult.length == 3);
                ok(aResult[0] === "P1");
                ok(aResult[1] === "P2");
                ok(aResult[2] === "P3");


                sBinding = "{    path  :'P1'} / {path:   'P2'} / {path       :         'P3' }";
                aResult = AnnotationHelper._getPropertiesFromBindingString(sBinding);
                ok(aResult.length == 3);
                ok(aResult[0] === "P1");
                ok(aResult[1] === "P2");
                ok(aResult[2] === "P3");


                sBinding = "{=odata.fillUriTemplate('https://www.google.de/maps/place/{street},{city}',{'street':odata.uriEncode(${Address/Street},undefined),'city':odata.uriEncode(${Address/City},undefined)})}";
                aResult = AnnotationHelper._getPropertiesFromBindingString(sBinding);
                ok(aResult.length == 2);
                ok(aResult[0] === "Address/Street");
                ok(aResult[1] === "Address/City");
            });
            test("Annotation Helper - getRequestFields", function () {
                var oPresentationVariant = {
                    "RequestAtLeast": [
                        {
                            "PropertyPath": "CustomerName"
                        },
                        {
                            "PropertyPath": "Supplier_Name"
                        },
                        {
                            "PropertyPath": "CustomerID"
                        }
                    ]
                }
                var oExpected = ["CustomerName","Supplier_Name","CustomerID"];
                var nResult = AnnotationHelper.getRequestFields(oPresentationVariant);
                ok(JSON.stringify(oExpected) === JSON.stringify(nResult));
            });

            test("Annotation Helper - getRequestFields presentationVariant is undefined", function () {
                var oPresentationVariant = undefined;
                var oExpected = [];
                var nResult = AnnotationHelper.getRequestFields(oPresentationVariant);
                ok(JSON.stringify(oExpected) === JSON.stringify(nResult));
            });

            test("Annotation Helper - getRequestFields RequestAtleast is undefined", function () {
                var oPresentationVariant = {
                    GroupBy: {
                        PropertyPath: "BillingStatusDescription"
                    }
                };
                var oExpected = [];
                var nResult = AnnotationHelper.getRequestFields(oPresentationVariant);
                ok(JSON.stringify(oExpected) === JSON.stringify(nResult));
            });

            test("Annotation Helper - TargetValueFormatter", function () {
                var sKpiValue = "25867", sTargetValue = "85000";
                var oExpected = {
                    sValue: "85.0K"
                };
                var oContext = {
                    ovpCardProperties: {
                        oData: {
                            iNumberOfFractionalDigits: 1
                        },
                        getProperty: function (iKey) {
                            return this.oData[iKey.split("/")[1]];
                        }
                    },
                    getModel: function () {
                        return this.ovpCardProperties;
                    }

                };
                var nResult = AnnotationHelper.TargetValueFormatter.call(oContext, sKpiValue, sTargetValue);
                ok(nResult === oExpected.sValue);
            });

            test("Annotation Helper - returnPercentageChange", function () {
                var sKpiValue = "25867", sTargetValue = "85000";
                var oExpected = {
                    sValue: "-69.57%"
                };
                var oContext = {
                    ovpCardProperties: {
                        oData: {
                            iNumberOfFractionalDigits: 2
                        },
                        getProperty: function (iKey) {
                            return this.oData[iKey.split("/")[1]];
                        }
                    },
                    getModel: function () {
                        return this.ovpCardProperties;
                    }

                };
                var nResult = AnnotationHelper.returnPercentageChange.call(oContext, sKpiValue, sTargetValue);
                ok(nResult === oExpected.sValue);
            });

            test("Annotation Helper - checkNavTargetForContactAnno", function () {
                var item = {
                    "Label":{"String":"Supplier"},
                    "Value":{"Path":"CustomerName"},
                    "RecordType":"com.sap.vocabularies.UI.v1.DataField",
                    "EdmType":"Edm.String"
                };
                var oExpected = {
                    sValue: ""
                };
                var oContext = {
                    ovpCardProperties: {
                        oData: {
                            iNumberOfFractionalDigits: 2
                        },
                        getProperty: function (iKey) {
                            return this.oData[iKey.split("/")[1]];
                        }
                    },
                    getModel: function () {
                        return this.ovpCardProperties;
                    }

                };
                var nResult = AnnotationHelper.checkNavTargetForContactAnno(oContext, item);
                ok(nResult === oExpected.sValue);
            });

            test("Annotation Helper - checkForContactAnnotation", function () {
                //jQuery.sap.require("sap.ovp.test.mockservers");
                mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
                var cardTestData = {
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations_for_formatItems.xml"
                    }
                };

                var oModel = utils.createCardModel(cardTestData);
                stop();
                var oMetaModel = oModel.getMetaModel();
                oMetaModel.loaded().then(function(){
                start();
                
                var oEntitySet = oMetaModel.getODataEntitySet("SalesOrderSet");
                
                var oExpected = {
                    sValue: true
                };
                var oContext = {
                    ovpCardProperties: {
                        getProperty : function (sProperty) {
                            if (sProperty === "/metaModel"){
                                return oMetaModel;
                            }
                        }
                    },
                    getSetting : function () {
                        return this.ovpCardProperties;
                    }

                };
                var nResult = AnnotationHelper.checkForContactAnnotation(oContext, oEntitySet);
                ok(nResult === oExpected.sValue);

                mockservers.close();
                });
            });

        });

