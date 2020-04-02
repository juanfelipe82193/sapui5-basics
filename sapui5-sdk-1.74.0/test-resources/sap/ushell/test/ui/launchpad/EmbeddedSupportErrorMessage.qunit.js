// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage");
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage", {
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

    test("Constructor Test", function () {
        var embeddedSupportErrorMessage = new sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage("EmbeddedSupportErrorMessage", {
                title: "title",
                content: new sap.m.Text({
                    text: "message"
                })
            }),
            buttons;

        this.translationBundle = sap.ushell.resources.i18n;
        embeddedSupportErrorMessage.open();
        ok(embeddedSupportErrorMessage.getIcon() == "sap-icon://alert" , "Check message icon");
        ok(embeddedSupportErrorMessage.getType() == "Message" , "Check message type");

        buttons = embeddedSupportErrorMessage.getButtons();
        ok(embeddedSupportErrorMessage.getLeftButton() == buttons[0].getId() , "Check support button on the left");
        ok(buttons[0].getText() == this.translationBundle.getText("contactSupportBtn") , "Check support button text");
        ok(embeddedSupportErrorMessage.getRightButton() == buttons[1].getId() , "Check close button on the right");
        ok(buttons[1].getText() == this.translationBundle.getText("close") , "Check close button text");
        embeddedSupportErrorMessage.destroy();
    });
}());
