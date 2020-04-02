/*global opaTest QUnit */
var Common = sap.ui.test.Opa5.extend("sap.ushell.test.opaTests.basicIsolationAppLoad.Common", {

    startFLPAppIsolated : function () {
        "use strict";
        this.iStartMyAppInAFrame("../../shells/demo/ui5appruntime.html?sap-ui-app-id=sap.ushell.demo.letterBoxing#Action-toLetterBoxing");
        return this.waitFor({
            timeout: 10,
            pollingInterval: 5000,
            errorMessage: "Could not load application"
        });
    }
});

sap.ui.test.Opa5.createPageObjects({
    onTheMainPage: {
        actions: {
        },

        assertions: {

            checkIfAppOpenedCorrectly: function () {
                "use strict";
                return this.waitFor({
                    controlType: "sap.m.Button",
                    success: function (buttons) {
                        QUnit.ok(buttons && buttons.length === 1, "a single button should be in the app");
                        QUnit.ok(buttons[0].getText() === "Change letterBoxing", "button label should be 'Change letterBoxing'");
                    },
                    errorMessage: "CheckHeaderItems test failed"
                });
            }
        }
    }
});

sap.ui.test.Opa5.extendConfig({
    arrangements: new Common(),
    autoWait: true
});

QUnit.config.testTimeout = 99999;

sap.ui.require([], function () {

    "use strict";

    QUnit.module("FLPRT - isolated app load test");

    opaTest("Test 1: Launch application isolated by direct URL", function (Given, When, Then) {
        Given.startFLPAppIsolated();
        Then.onTheMainPage.checkIfAppOpenedCorrectly();
    });

    opaTest("Close application", function (Given, When, Then) {
        Given.iTeardownMyApp();
        QUnit.expect(0);
    });
});
