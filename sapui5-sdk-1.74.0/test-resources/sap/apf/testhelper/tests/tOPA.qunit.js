/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*globals sap, jQuery, sinon, opaTest, strictEqual, ok */
(function () {
    'use strict';
    jQuery.sap.require("sap.ui.test.Opa5");
    jQuery.sap.require("sap.ui.test.opaQunit");

    /**
     * Note: in Karma include
     *          { pattern: 'test/uilib/libs/QUnitUtils.js', watched: false, included: true, served: true },
     *     This file only resides temporarily in the local libs folder.
     *     in HTML include
     *          <script type="text/javascript"             src="../../../resources/sap/ui/qunit/QUnitUtils.js"></script>
     *     This file is part of the (locally) deployed UI5 version. Assumed to work on Build Server, too.
     */

     sap.ui.test.Opa.extendConfig({
        timeout : 3,  // min 2 seconds when rendering UI controls
        pollingInterval: 400, // default (milliseconds)
        arrangements : new sap.ui.test.Opa({
            iGiven : function () {
                return this;
            },
            iGivenExample : function () {
                var iNumberOfButtons = 1;
                function addButtonAfterSomeTime() {
                    window.setTimeout(function () {
                        var $button = jQuery('<button id="button' + iNumberOfButtons + '">' + iNumberOfButtons + '</button>').click(addButtonAfterSomeTime);
                        jQuery("body").append($button);
                        iNumberOfButtons++;
                    }, 500);
                }
                //add the first button
                addButtonAfterSomeTime();
                return this;
            }

        }),//GIVEN
        actions : new sap.ui.test.Opa({
            iWhen : function () {
                this.waitFor({
                    check : function () {
                        return true;            // precondition that guards the exec of the success function
                    },
                    success : function () {
                    }
                });
                return this;
            },
            iWhenExample : function (sButtonId) {
                this.waitFor({
                    check : function () {
                        return jQuery("#" + sButtonId).length;
                    },
                    success : function () {
                        jQuery("#" + sButtonId).click();
                    },
                    error: function() {
                        // called when timeout reached
                    }
                });
                return this;
            }
        }),//WHEN actions
        assertions : new sap.ui.test.Opa({
            iThen : function () {
                this.waitFor({
                    check : function () {
                        return true;                      // precondition that guards the exec of the success function
                    },
                    success : function () {
                        strictEqual(true, 0, "how to assert");  // Evaluation of QUnit assertion functions
                        ok(0);
                    }
                });
                return this;
            },
            iThenExample : function (sButtonId, sText) {
                this.waitFor({
                    check : function () {
                        return jQuery("#" + sButtonId).length;
                    },
                    success : function () {
                        strictEqual(jQuery("#" + sButtonId).text(), sText, "Found the button with the id " + sButtonId);
                    }
                });
                return this;
            }
        })//THEN assertions
    });

    opaTest("Template", function (Given, When, Then) {
        Given.iGiven();
        When.iWhen();
        Then.iThen();
    });

    opaTest("Should create two buttons", function (Given, When, Then) {
        // Arrangements
        Given.iGivenExample();

        //Actions
        When.iWhenExample("button1");

        // Assertions
        Then.iThenExample("button2", "2");
    });

}());