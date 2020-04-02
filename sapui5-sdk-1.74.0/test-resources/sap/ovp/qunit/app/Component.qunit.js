sap.ui.define([
    "sap/ovp/app/Component",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (appComponent, utils, mockservers, jquery) {
            "use strict";
            /* module, ok, test, jQuery, sap */

            //jQuery.sap.require("sap.ovp.app.Component");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");

            //var utils = sap.ovp.test.qunit.cards.utils;

        var oModel, oComponent;


    module("sap.ovp.app.Component", {
        /**
         * This method is called before each test
         */
        setup: function () {

            oComponent = new appComponent;
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            oComponent.destroy();
        }
    });


    test("Quickview Test - empty group", function () {
        ok(true == true, "Quickview XML Values");
    });


    function _stubGetOvpConfig() {
        sinon.stub(oComponent, "getOvpConfig", function () {
            return {
                "globalFilterModel": "salesOrder",
                "globalFilterEntityType": "GlobalFilters",
                "showDateInRelativeFormat": false,
                "considerAnalyticalParameters": true,
                "useDateRangeType": false,
                "refreshIntervalInMinutes": 12,
                "disableTableCardFlexibility": false,
                "cards": {
                    "card010_QuickLinks": {
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.linklist",
                        "settings": {
                            "title": "Quick Links",
                            "subTitle": "Standard Link List With Static Data",
                            "listFlavor": "standard",
                            "defaultSpan": {
                                "rows": 15,
                                "cols": 1
                            },
                            "staticContent": [
                                {
                                    "title": "Create Purchase Order",
                                    "imageUri": "sap-icon://Fiori6/F0865",
                                    "imageAltText": "{{card30_icon_prod_man}}",
                                    "semanticObject": "Abhishek",
                                    "action": "Waghela"
                                },
                                {
                                    "title": "Create Supplier",
                                    "imageUri": "sap-icon://Fiori2/F0246",
                                    "imageAltText": "{{card30_icon_so_man}}",
                                    "semanticObject": "Action",
                                    "action": "toappnavsample"
                                },
                                {
                                    "title": "Create Contact",
                                    "imageUri": "sap-icon://Fiori6/F0866",
                                    "imageAltText": "{{card30_icon_so_man}}",
                                    "semanticObject": "Action",
                                    "action": "toappnavsample"
                                }
                            ]
                        }
                    }
                }
            };
        });
    }

    asyncTest("Test setContainer function", function () {

        //TODO: Improve this test case to check different types of manifest inputted to setContainer function
        //jQuery.sap.require("sap.ovp.test.mockservers");
        mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
        oComponent = new appComponent;
        oModel = new sap.ui.model.odata.v2.ODataModel(
            utils.odataRootUrl_salesOrder,
            {
                annotationURI: utils.testBaseUrl + "data/annotations.xml",
                json: true,
                loadMetadataAsync: false
            }
        );
        sinon.stub(oModel.getMetaModel(), "getODataEntityContainer", function () {
            return {
                namespace: "GWSAMPLE_BASIC"
            };
        });
        sinon.stub(oComponent, "getModel", function (sModelName) {
            return oModel;
        });
        sinon.stub(oComponent, "getOvpConfig", function () {
            return {
                "globalFilterModel": "salesOrder",
                "globalFilterEntityType": "GlobalFilters",
                "showDateInRelativeFormat": false,
                "considerAnalyticalParameters": true,
                "useDateRangeType": false,
                "refreshIntervalInMinutes": 12,
                "disableTableCardFlexibility": false,
                "cards": {
                    "card010_QuickLinks": {
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.linklist",
                        "settings": {
                            "title": "Quick Links",
                            "subTitle": "Standard Link List With Static Data",
                            "listFlavor": "standard",
                            "defaultSpan": {
                                "rows": 15,
                                "cols": 1
                            },
                            "staticContent": [
                                {
                                    "title": "Create Purchase Order",
                                    "imageUri": "sap-icon://Fiori6/F0865",
                                    "imageAltText": "{{card30_icon_prod_man}}",
                                    "semanticObject": "Abhishek",
                                    "action": "Waghela"
                                },
                                {
                                    "title": "Create Supplier",
                                    "imageUri": "sap-icon://Fiori2/F0246",
                                    "imageAltText": "{{card30_icon_so_man}}",
                                    "semanticObject": "Action",
                                    "action": "toappnavsample"
                                },
                                {
                                    "title": "Create Contact",
                                    "imageUri": "sap-icon://Fiori6/F0866",
                                    "imageAltText": "{{card30_icon_so_man}}",
                                    "semanticObject": "Action",
                                    "action": "toappnavsample"
                                }
                            ]
                        }
                    }
                }
            };
        });

        var testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
        var oView = new sap.m.VBox("TestVBox1");
        oView.setModel(oModel, "salesOrder");
        var oComponentContainer = new sap.ui.core.ComponentContainer("ovpLayout1");
        oView.addItem(oComponentContainer);
        oView.byId = function (id) {
            return sap.ui.getCore().byId(id);
        };
        oView.placeAt("testContainer");
        oComponentContainer.setComponent(oComponent);
        setTimeout(function () {
            ok(true, "Checking if setContainer function for app/component.js is working or not");
            var oUIModel = oComponent.oModels.ui;
            ok(oUIModel.getProperty("/bHeaderExpanded") === false, "Checking bHeaderExpanded is false");
            start();
        }.bind(this), 500);
    });

    asyncTest("Authorization for Static Link List card on Line Items --> 1", function () {
        _stubGetOvpConfig();

        sap.ushell = {
            Container: {
                getService: function () {
                    return {
                        isIntentSupported: function (aList) {
                            var o = {};
                            aList.forEach(function (s) {
                                if (s !== "#Abhishek-Waghela") {
                                    o[s] = {supported: true};
                                } else {
                                    o[s] = {supported: false};
                                }
                            });
                            return jquery.Deferred().resolve(o).promise();
                        }
                    };
                }
            }
        };

       /* var CrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
        var oNavigationStub = sinon.stub(CrossApplicationNavigation, "isIntentSupported", function (aList) {
            var o = {};
            aList.forEach(function (s) {
                if (s !== "#Abhishek-Waghela") {
                    o[s] = {supported: true};
                } else {
                    o[s] = {supported: false};
                }
            });
            return $.Deferred().resolve(o).promise();
        });
*/
        var oPromise = oComponent._checkForAuthorizationForLineItems();
        oPromise.then(function (oOvpConfig) {
            var aStaticContent = oOvpConfig.cards["card010_QuickLinks"].settings.staticContent;
            ok(aStaticContent.length === 2, "One of the line item is not authorized and hence being removed from OVP Configuration");
            //oNavigationStub.restore();
            start();
        }, function (oError) {
            ok(false, oError);
            //oNavigationStub.restore();
            start();
        });
    });

    asyncTest("Authorization for Static Link List card on Line Items --> 2", function () {
        _stubGetOvpConfig();

        sap.ushell = {
            Container: {
                getService: function () {
                    return {
                        isIntentSupported: function (aList) {
                            var o = {};
                            aList.forEach(function (s) {
                                o[s] = {supported: true};
                            });
                            return jquery.Deferred().resolve(o).promise();
                        }
                    };
                }
            }
        };

        /*var CrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
        var oNavigationStub = sinon.stub(CrossApplicationNavigation, "isIntentSupported", function (aList) {
            var o = {};
            aList.forEach(function (s) {
                o[s] = {supported: true};
            });
            return $.Deferred().resolve(o).promise();
        });*/

        var oPromise = oComponent._checkForAuthorizationForLineItems();
        oPromise.then(function (oOvpConfig) {
            var aStaticContent = oOvpConfig.cards["card010_QuickLinks"].settings.staticContent;
            ok(aStaticContent.length === 3, "Every Line Item is Authorized");
            //oNavigationStub.restore();
            start();
        }, function (oError) {
            ok(false, oError);
            //oNavigationStub.restore();
            start();
        });
    });

    asyncTest("Authorization for Static Link List card on Line Items --> 3", function () {
        _stubGetOvpConfig();

        sap.ushell = {
            Container: {
                getService: function () {
                    return {
                        isIntentSupported: function (aList) {
                            var o = {};
                            aList.forEach(function (s) {
                                o[s] = {supported: false};
                            });
                            return jquery.Deferred().resolve(o).promise();
                        }
                    };
                }
            }
        };

        /*var CrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
        var oNavigationStub = sinon.stub(CrossApplicationNavigation, "isIntentSupported", function (aList) {
            var o = {};
            aList.forEach(function (s) {
                o[s] = {supported: false};
            });
            return $.Deferred().resolve(o).promise();
        });*/

        var oPromise = oComponent._checkForAuthorizationForLineItems();
        oPromise.then(function (oOvpConfig) {
            var aStaticContent = oOvpConfig.cards["card010_QuickLinks"].settings.staticContent;
            ok(aStaticContent.length === 0, "No Line Item is Authorized and hence removed from the OVP Configuration");
            //oNavigationStub.restore();
            start();
        }, function (oError) {
            ok(false, oError);
            //oNavigationStub.restore();
            start();
        });
    });

});



