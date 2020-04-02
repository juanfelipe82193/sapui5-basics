sap.ui.require([
    "sap/ushell/components/tiles/cdm/applauncher/Component",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/services/Container",
    "sap/ushell/resources"
], function (
    AppLauncherComponent,
    AppLifeCycle,
    Config
) {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    var appIntStub;
    module("sap.ushell.components.tiles.cdm.applauncher.Component", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                appIntStub = sinon.stub(AppLifeCycle.getElementsModel(), "getModel").returns(
                    {
                      getProperty: function(property)
                      {
                          if(property == "/sizeBehavior")
                            return "Responsive";
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

    test("Create StaticTile Component Test", function () {

        var oComponent = new AppLauncherComponent({
            componentData: {
                isCreated: true,
                properties: {},
                startupParameters: {}
            }
        });
        ok(oComponent.getComponentData().isCreated, "Component should be created with component data as specified");
    });


    test("Component API tileSetVisualProperties : Static properties Test", function (assert) {

        var done = assert.async();

        var oComponentDataProperties = {
            title:      "static_tile_1_title",
            subtitle:   "static_tile_1_subtitle",
            icon:       "static_tile_1_icon",
            targetURL:  "#static_tile_1_URL",
            info:       "static_tile_1_info",
            tilePersonalization: {
            }
        };

        var oComponentDataStartupParams = {
            "sap-system" : ["static_tile_1_system"]
        };

        var oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: oComponentDataStartupParams
            }
        });



        // check properties on tile's model
        oComponent.createContent().loaded().then(function (oTileView) {
            var oProperties =  oTileView.getController()._getCurrentProperties();
            ok(oProperties.title    === oComponentDataProperties.title,     "component data title and tile view title");
            ok(oProperties.subtitle === oComponentDataProperties.subtitle,  "component data subtitle and tile view subtitle");
            ok(oProperties.icon     === oComponentDataProperties.icon,      "component data icon and tile view icon");
            ok(oProperties.info     === oComponentDataProperties.info,      "component data info and tile view info");

            // check URL contains sap-system
            // TODO: press handler tests are missing!
            ok(oTileView.getController()._createTargetUrl().indexOf(oComponentDataStartupParams["sap-system"][0]) !== -1, "tile targetURL should contain sap-system from component startup parameters");

            var oNewVisualProperties_1 = {
                title : 'title had changed',
                info: 'info had changed'
            };
            oComponent.tileSetVisualProperties(oNewVisualProperties_1);
            oProperties =  oTileView.getController()._getCurrentProperties();
            ok(oProperties.title    === oNewVisualProperties_1.title,         "component data title and tile view title must have been changed by new visual property");
            ok(oProperties.info     === oNewVisualProperties_1.info,         "component data info and tile view info must have been changed by new visual property");
            ok(oProperties.subtitle === oComponentDataProperties.subtitle,  "component data subtitle and tile view subtitle");
            ok(oProperties.icon     === oComponentDataProperties.icon,      "component data icon and tile view icon");

            var oNewVisualProperties_2 = {
                subtitle: 'i am also changed',
                icon: 'i am also changed',
                info:"'i am also changed"
            };
            oComponent.tileSetVisualProperties(oNewVisualProperties_2);
            oProperties =  oTileView.getController()._getCurrentProperties();
            ok(oProperties.title    === oNewVisualProperties_1.title,     "component data title and tile view title not changed by new visual property");
            ok(oProperties.info     === oNewVisualProperties_2.info,     "component data info and tile view info");
            ok(oProperties.subtitle === oNewVisualProperties_2.subtitle,  "component data subtitle and tile view subtitle");
            ok(oProperties.icon     === oNewVisualProperties_2.icon,      "component data icon and tile view icon");

            done();
        });
    });

    test("Tile property sizeBehavior test", function (assert) {

        var done = assert.async();
        var oComponent = new AppLauncherComponent({
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
});
