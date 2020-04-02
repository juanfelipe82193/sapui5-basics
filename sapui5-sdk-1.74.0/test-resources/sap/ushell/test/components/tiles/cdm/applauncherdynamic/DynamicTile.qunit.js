sap.ui.require([
    "sap/ushell/components/tiles/cdm/applauncherdynamic/Component",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ui/thirdparty/datajs",
    "sap/ushell/resources",
    "sap/ushell/services/Container"
], function (Component, AppLifeCycle, Config, OData) {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */



    var appIntStub;

    module("Component", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                appIntStub = sinon.stub(AppLifeCycle.getElementsModel(), "getModel").returns(
                    {
                        getProperty: function()
                        {
                        return {sizeBehavior : "Responsive"}
                        }
                    }
                    );
                    start();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            appIntStub.restore();
        }
    });

    test("Create DynamicTile Component Test", function () {



      var sComponentName = "DynamicTile";
        var oComponent = new Component({
          name: sComponentName,
            componentData: {
                properties: {},
                startupParameters: {}
            }
        });
        ok(true);
    });


    test("Create DynamicTile Component Test with no componentData", function () {

        var oComponent = new Component({
            componentData: {
            }
        });
        ok(true);
    });

    test("Component API tileSetVisualProperties : Static properties Test", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            title:      "dynamic_tile_1_title",
            subtitle:   "dynamic_tile_1_subtitle",
            icon:       "dynamic_tile_1_icon",
            targetURL:  "dynamic_tile_1_URL",
            info:       "dynamic_tile_1_Info",
            tilePersonalization: {
            }
        };

        var oComponentDataStartupParams = {
            "sap-system" : ["dynamic_tile_1_system"]
        };

        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: oComponentDataStartupParams
            }
        });

        // check properties on tile's model
        oComponent.createContent().loaded().then(function (oTileView) {
            var oProperties =  oTileView.getModel().getProperty('/properties');
            ok(oProperties.title    === oComponentDataProperties.title,     "component data title and tile view title");
            ok(oProperties.subtitle === oComponentDataProperties.subtitle,  "component data subtitle and tile view subtitle");
            ok(oProperties.icon     === oComponentDataProperties.icon,      "component data icon and tile view icon");
            ok(oProperties.info     === oComponentDataProperties.info,      "component data info and tile view info");
            ok(oProperties.targetURL.indexOf(oComponentDataStartupParams["sap-system"][0]) !== -1, "tile targetURL should contain sap-system from component startup parameters");

            var oNewVisualProperties_1 = {
                title : 'only i had changed'
            };
            oComponent.tileSetVisualProperties(oNewVisualProperties_1);
            oProperties =  oTileView.getModel().getProperty('/properties');
            ok(oProperties.title    === oNewVisualProperties_1.title,       "component data title and tile view title must have been changed by new visual property");
            ok(oProperties.subtitle === oComponentDataProperties.subtitle,  "component data subtitle and tile view subtitle");
            ok(oProperties.icon     === oComponentDataProperties.icon,      "component data icon and tile view icon");

            var oNewVisualProperties_2 = {
                subtitle: 'i am also changed',
                icon: 'i am also changed',
                info: 'i am also changed',
            };
            oComponent.tileSetVisualProperties(oNewVisualProperties_2);
            oProperties =  oTileView.getModel().getProperty('/properties');
            ok(oProperties.title    === oNewVisualProperties_1.title,     "component data title and tile view title not changed by new visual property");
            ok(oProperties.subtitle === oNewVisualProperties_2.subtitle,  "component data subtitle and tile view subtitle");
            ok(oProperties.icon     === oNewVisualProperties_2.icon,      "component data icon and tile view icon");
            ok(oProperties.info     === oNewVisualProperties_2.info,      "component data info and tile view info");

            done();
        });
    });


    test("DynamicTile handleInlineCountRequest Test", function () {

        var done = assert.async();

        var elemOData = sinon.stub(OData, "read").returns({
            "xxxx": {
            }
        });
        OData.read = function (request, success, fail) {
            var oResult = {
                "__count": '444'
            };
            success(oResult);
        };


        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            indicatorDataSource: {
                path: "https://example.corp.com:44335/sap/opu/odata/sap/ZFAR_CUSTOMER_LINE_ITEMS2_SRV/Items?sap-server=er3&sap-client=200&$select=Customer,CustomerName,CompanyCode,CompanyName,ClearingStatus,AssignmentReference,DocumentDate,AccountingDocument,AccountingDocumentItem,AccountingDocumentType,SpecialGeneralLedgerCode,DueNetSymbol,ClearingAccountingDocument,CompanyCodeCurrency,AmountInCompanyCodeCurrency&$filter=(CompanyCode%20eq%20%27F002%27)%20and%20(Customer%20eq%20%27C0001%27)&$orderby=DocumentDate%20desc,AccountingDocument%20desc&$top=123&$top=0&$inlinecount=allpages"
            }
        };

        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            // get controller and call to load-data
            oTileView.getController().loadData(0);

            // look at tile's model
            var oProperties = oTileView.getModel().getProperty('/properties');
            ok(oProperties.number_value         === '444'       ,'dynamic number updated');
            ok(oProperties.number_unit          === ''          ,'dynamic data not updated');
            ok(oProperties.number_state_arrow   === 'None'      ,'dynamic data not updated');
            ok(oProperties.number_value_state   === 'Neutral'   ,'dynamic data not updated');

            elemOData.restore();

            done();
        });
    });


    test("DynamicTile No URL Test", function () {

        var done = assert.async();

        var elemOData = sinon.stub(OData, "read").returns({
            "xxxx": {
            }
        });
        OData.read = function (request, success, fail) {
            var oResult = {
                "__count": '444'
            };
            success(oResult);
        };


        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            indicatorDataSource: {
            }
        };

        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            // get controller and call to load-data
            oTileView.getController().loadData(0);

            // look at tile's model
            var oProperties = oTileView.getModel().getProperty('/properties');
            ok(oProperties.number_value         === '...'       ,'dynamic number not updated');
            ok(oProperties.number_unit          === ''          ,'dynamic data not updated');
            ok(oProperties.number_state_arrow   === 'None'      ,'dynamic data not updated');
            ok(oProperties.number_value_state   === 'Neutral'   ,'dynamic data not updated');
            elemOData.restore();
            done();
        });
    });


    test("Component API DynamicTile visible handler test", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            indicatorDataSource: {
                refresh: '40'
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {

            var oController = oTileView.getController(),
                fnStopRequestsSpy = sinon.spy(oController, 'stopRequests'),
                fnRefreshHandlerStub = sinon.stub(oController, 'refreshHandler');

            // actual component API test
            oComponent.tileSetVisible(false);
            ok(fnStopRequestsSpy.called,"When the tile is invisible, 'stopRequests' should be called");

            // actual component API test
            oComponent.tileSetVisible(true);
            ok(fnRefreshHandlerStub.called,"When the tile is invisible, 'stopRequests' should be called");
            ok(fnStopRequestsSpy.calledOnce,"When the tile is invisible, 'stopRequests' should be called");


            fnStopRequestsSpy.restore();
            fnRefreshHandlerStub.restore();
            done();
        });
    });


    test("Component API  DynamicTile refresh handler test - new request should be sent after tile refresh", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL"
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            var oController = oTileView.getController(),
                fnLoadDataSpy = sinon.stub(oController, 'loadData').returns({});

            // actual component API test
            oComponent.tileRefresh();
            ok(fnLoadDataSpy.called,"function loadData should be called");

            fnLoadDataSpy.restore();
            done();
        });
    });


    test ("DynamicTile test onUpdateDynamicData with different intervals values", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            indicatorDataSource: {
                refresh: 0,
                path: 'somePath'
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            },
        });

        oComponent.createContent().loaded().then(function (oTileView) {

            var oController = oTileView.getController(),
                fnLoadDataStub = sinon.stub(oController, 'loadData').returns({});

            oController.initUpdateDynamicData(oController);
            ok(fnLoadDataStub.called,"function loadData should be called");
            ok(fnLoadDataStub.args[0][0] == 0,"interval 0 should be sent");


            // changing the refresh interval
            oController.getView().getModel().setProperty("/configuration/serviceRefreshInterval", '5');
            oController.initUpdateDynamicData(oController);
            ok(fnLoadDataStub.called,"function loadData should be called");
            ok(fnLoadDataStub.args[1][0] == 10,"minimum positive interval is 10");

            // changing the refresh interval
            oController.getView().getModel().setProperty("/configuration/serviceRefreshInterval", '50');
            oController.initUpdateDynamicData(oController);
            ok(fnLoadDataStub.called,"function loadData should be called");
            ok(fnLoadDataStub.args[2][0] == 50,"the interval is 50");

            fnLoadDataStub.restore();
            done();
        });
    });

    test("DynamicTile test serviceUrl legacy", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            indicatorDataSource: {
                refresh: 0,
                path: '/sap/opu/Service1/somePath'
            }
        };
        var oComponent = new Component({
                componentData: {
                    properties: oComponentDataProperties
                }
            });

        oComponent.createContent().loaded().then(function (oTileView) {
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            equal(sServiceUrl, "/sap/opu/Service1/somePath");

            done();
        });
    });

    test("DynamicTile test serviceUrl including dataSource", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            dataSource: {
                uri: "/sap/opu/Service1/"
            },
            indicatorDataSource: {
                refresh: 0,
                path: "somePath"
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            equal(sServiceUrl, "/sap/opu/Service1/somePath");

            done();
        });
    });

    test("DynamicTile test serviceUrl including dataSource and sap-system", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            dataSource: {
                uri: "/sap/opu/Service1/"
            },
            indicatorDataSource: {
                refresh: 0,
                path: "somePath"
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: {
                    "sap-system": ["SYS1", "SYS2"]
                }
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            equal(sServiceUrl, "/sap/opu/Service1;o=SYS1/somePath");

            done();
        });
    });

    test("DynamicTile test serviceUrl including dataSource and sap-system and missing '/'", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            dataSource: {
                uri: "/sap/opu/Service1"
            },
            indicatorDataSource: {
                refresh: 0,
                path: "somePath"
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: {
                    "sap-system": ["SYS1", "SYS2"]
                }
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            equal(sServiceUrl, "/sap/opu/Service1;o=SYS1/somePath");

            done();
        });
    });

    test("DynamicTile test serviceUrl including dataSource and empty array of sap-system", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            dataSource: {
                uri: "/sap/opu/Service1/"
            },
            indicatorDataSource: {
                refresh: 0,
                path: "somePath"
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: {
                    "sap-system": []
                }
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            equal(sServiceUrl, "/sap/opu/Service1/somePath");

            done();
        });
    });

    test("DynamicTile test serviceUrl including dataSource and sap-system but no indicatorDataSource", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            dataSource: {
                uri: "/sap/opu/Service1/"
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: {
                    "sap-system": ["SYS1"]
                }
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            equal(sServiceUrl, undefined);

            done();
        });
    });

    test("DynamicTile test serviceUrl including dataSource and sap-system but absolut path of indicatorDataSource", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            dataSource: {
                uri: "/sap/opu/Service1/"
            },
            indicatorDataSource: {
                refresh: 0,
                path: "/sap/opu/Service2/somePath"
            }
        };
        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: {
                    "sap-system": ["SYS1"]
                }
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            equal(sServiceUrl, "/sap/opu/Service2/somePath");

            done();
        });
    });

    test ("DynamicTile updatePropertiesHandler test", function () {

        var done = assert.async();

        var oComponentDataProperties = {
            number: "12345"
        },
            oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: {
                }
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {

            var oController = oTileView.getController(),
                fnNormalizeNumberSpy = sinon.spy(oController, '_normalizeNumber'),
                fnShouldProcessDigitsSpy = sinon.spy(oController, '_shouldProcessDigits');
            oController.updatePropertiesHandler(oComponentDataProperties);
            ok(fnNormalizeNumberSpy.calledOnce, "normalizedNumber called");
            ok(fnShouldProcessDigitsSpy.calledOnce, "shouldProcessDigits called");
            oController._normalizeNumber.restore();
            oController._shouldProcessDigits.restore();

            done();
        });
    });
    test("check normalizing number", function () {

        var done = assert.async();

        var oComponent = new Component({
                componentData: {
                    properties: {},
                    startupParameters: {
                    }
                }
            });

        oComponent.createContent().loaded().then(function (oTileView) {

            var oController = oTileView.getController(),
                oNormalizedNum;

            oNormalizedNum = oController._normalizeNumber("Not_a_Number", 5);
            ok(oNormalizedNum.displayNumber === "Not_a", "Test normalizing number when the string value is NaN and the allowed number of digit is 5");
            oNormalizedNum = oController._normalizeNumber("123456", 5);
            ok(oNormalizedNum.displayNumber === "123.4", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
            ok(oNormalizedNum.numberFactor === "K", "Test normalizing number when number is: '1000000 > number > 999'");
            oNormalizedNum = oController._normalizeNumber("1234567", 5);
            ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
            ok(oNormalizedNum.numberFactor === "M", "Test normalizing number when number is: '1000000000 > number > 999999'");
            oNormalizedNum = oController._normalizeNumber("1234567890", 5);
            ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
            ok(oNormalizedNum.numberFactor === "B", "Test normalizing number when number is: '10000000000 > number > 999999999'");
            oNormalizedNum = oController._normalizeNumber("123", 5, 'TEST');
            ok(oNormalizedNum.numberFactor === "TEST", "Test normalizing number when the Number Factor is predifined");
            oNormalizedNum = oController._normalizeNumber("12345.5", 3);
            ok(oNormalizedNum.displayNumber === "12", "Test normalizing number - Assure that if the last carachter after formatting is '.' , it's being truncated");

            done();
        });
    });
    test("Tile property sizeBehavior test", function (assert) {

        var done = assert.async();
        var oComponent = new Component({
            componentData: {
                isCreated: true,
                properties: {},
                startupParameters: {}
            }
        });
        // check properties on tile's model
        oComponent.createContent().loaded().then(function (oTileView) {
            var oTileModel = oTileView.getModel();
            if(Config.last("/core/home/sizeBehavior") === "Responsive") {
                var sSizeBehaviorStart = "Responsive";
                var sNewSizeBehavior = "Small";
            } else {
                var sSizeBehaviorStart = "Small";
                var sNewSizeBehavior = "Responsive";
            }
            // Check if default is set
            ok(oTileModel.getProperty("/properties/sizeBehavior") === sSizeBehaviorStart, "Size correctly set at startup.");
            // emit new configuration
            Config.emit("/core/home/sizeBehavior", sNewSizeBehavior);
            // check if size property has changed
            Config.once("/core/home/sizeBehavior").do(function(){
                ok(oTileModel.getProperty("/properties/sizeBehavior") === sNewSizeBehavior, "Size correctly set after change.");
                done();
            });
        });
    });

    test("Don't add the sap-client to the header for loadData request if url is absolute", function (assert) {

        var done = assert.async();

        var ODataStub = sinon.stub(OData, "read");


        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            indicatorDataSource: {
                path: "https://example.corp.com:44335/sap/opu/odata/sap/ZFAR_CUSTOMER_LINE_ITEMS2_SRV/Item"
            }
        };

        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            // get controller and call to load-data
            oTileView.getController().loadData(0);

            assert.equal(ODataStub.getCall(0).args[0].headers["sap-client"], undefined, "sap-client is not added to the request with absolute url");

            ODataStub.restore();

            done();
        });
    });

    test("Add the sap-client to the header for loadData request if url is relative", function (assert) {

        var done = assert.async();
        var ODataStub = sinon.stub(OData, "read"),
            oGetClientStub = sinon.stub(sap.ushell.Container.getLogonSystem(), "getClient").returns("120");


        var oComponentDataProperties = {
            targetURL:  "dynamic_tile_1_URL",
            indicatorDataSource: {
                path: "/sap/opu/odata/sap/ZFAR_CUSTOMER_LINE_ITEMS2_SRV/Item"
            }
        };

        var oComponent = new Component({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        oComponent.createContent().loaded().then(function (oTileView) {
            // get controller and call to load-data
            oTileView.getController().loadData(0);

            assert.equal(ODataStub.getCall(0).args[0].headers["sap-client"], "120", "sap-client is not added to the request with absolute url");

            ODataStub.restore();
            oGetClientStub.restore();
            done();
        });
    });
});
