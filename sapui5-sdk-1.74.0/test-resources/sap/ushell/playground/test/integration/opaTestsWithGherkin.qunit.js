/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
    "use strict";

    sap.ui.require([
        "jquery.sap.global",
        "sap/ui/test/gherkin/opa5TestHarness",
        "ControlPlaygrounds/test/integration/arrangement/Common",
        "ControlPlaygrounds/test/integration/pages/NavContainer",
        "ControlPlaygrounds/test/integration/pages/ShellHeader",
        "ControlPlaygrounds/test/integration/pages/ShellAppTitle",
        "ControlPlaygrounds/test/integration/pages/NavigationMenu",
        "ControlPlaygrounds/test/integration/pages/NavigationMiniTile",
        "ControlPlaygrounds/test/integration/pages/ToolArea",
        "ControlPlaygrounds/test/integration/pages/RightFloatingContainer",
        "ControlPlaygrounds/test/integration/pages/ToolAreaItem",
        "ControlPlaygrounds/test/integration/pages/Tile",
        "ControlPlaygrounds/test/integration/pages/TileBase"
    ], function ($, testHarness, Common) {

        sap.ui.test.Opa5.extendConfig({
            arrangements: new Common()
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/ShellHeader",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/ShellAppTitle",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/NavigationMenu",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/NavigationMiniTile",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/ToolArea",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/RightFloatingContainer",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/ToolAreaItem",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/Tile",
            generateMissingSteps: true
        });

        testHarness.test({
            featurePath: "ControlPlaygrounds/test/integration/TileBase",
            generateMissingSteps: true
        });

        QUnit.start();
    });
});
