sap.ui.require([
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/services/Container"
],
    function (Config) {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    module("sap.ushell.components.tiles.applauncher.StaticTile", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
            this.oController = new sap.ui.controller(
                "sap.ushell.components.tiles.applauncher.StaticTile"
            );
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test ("test sizeBehavior property of the Dynamic tile", function (assert) {
            var oView = sap.ui.view({
                viewName: 'sap.ushell.components.tiles.applauncherdynamic.DynamicTile',
                type: sap.ui.core.mvc.ViewType.JS,
                viewData: {
                    chip: {
                        configurationUi: {
                            isEnabled: function () {
                                return false;
                            }
                        },
                        configuration: {
                            getParameterValueAsString: function () {
                                return '';
                            }
                        },
                        bag: {
                            getBag: function () {
                                return {
                                    getPropertyNames: function () {
                                        return [];
                                    },
                                    getTextNames: function () {
                                        return [];
                                    }
                                }
                            }
                        },
                        url: {
                            getApplicationSystem: function () {
                                return '';
                            }
                        },
                    }
                },
            }),
            oModel = oView.getModel();
            var done = assert.async();

            if(Config.last("/core/home/sizeBehavior") === "Responsive") {
                var sSizeBehaviorStart = "Responsive";
                var sNewSizeBehavior = "Small";
            } else {
                var sSizeBehaviorStart = "Small";
                var sNewSizeBehavior = "Responsive";
            }
            // Check if default is set
            ok(oModel.getProperty("/sizeBehavior") === sSizeBehaviorStart, "Size correctly set at startup.");

            // emit new configuration
            Config.emit("/core/home/sizeBehavior", sNewSizeBehavior);

            // check if size property has changed
            Config.once("/core/home/sizeBehavior").do(function(){
                ok(oModel.getProperty("/sizeBehavior") === sNewSizeBehavior, "Size correctly set after change.");
                done();
            });

    });

});
