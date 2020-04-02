// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.EndUserFeedback");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.AppConfiguration");

    var oOriginalConfiguration = window["sap-ushell-config"];

    module("sap.ushell.ui.footerbar.EndUserFeedback", {
        /**
         * This method is called before each test
         */
        setup: function () {
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").then(start);

            this.oEndUserFeedbackConfiguration = {
                showAnonymous: true,
                showLegalAgreement: true,
                showCustomUIContent: true,
                feedbackDialogTitle: true,
                textAreaPlaceholder: true,
                customUIContent: undefined
            };
            this.oModel = new sap.ui.model.json.JSONModel({
                currentState: {
                    stateName: "home"
                }
            });
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("Constructor Test", function () {
        var oEndUserFeedback = new sap.ushell.ui.footerbar.EndUserFeedback();
        ok(oEndUserFeedback.getIcon() === "sap-icon://marketing-campaign", "Check dialog icon");
        ok(oEndUserFeedback.getText() === sap.ushell.resources.i18n.getText("endUserFeedbackBtn"), "Check dialog title");

    });

    asyncTest("EndUserFeedback dialog test", function () {
        var endUserFeedbackDialog = new sap.ushell.ui.footerbar.EndUserFeedback(),
            endUserFeedbackDialogStub = sinon.stub(endUserFeedbackDialog, "getModel").returns(this.oModel);

        //Show the dialog
        endUserFeedbackDialog.ShowEndUserFeedbackDialog();

        setTimeout(function () {
            //Get the about dialog content form
            var dialogFormContent = sap.ui.getCore().byId('feedbackLayout').getContent(),
                translationBundle = sap.ushell.resources.i18n;

            ok(dialogFormContent[0].getContent()[0].getMetadata()._sClassName === 'sap.m.Image', "Check form logo type");
            ok(dialogFormContent[0].getContent()[0].getSrc().indexOf("launchpadDefaultIcon.jpg") > 0, "Check form logo value");
            ok(dialogFormContent[0].getContent()[1].getMetadata()._sClassName === 'sap.ui.core.Icon', "Check form app icon type");
            ok(dialogFormContent[0].getContent()[1].getSrc() === '', "Check form app icon value");
            ok(dialogFormContent[0].getContent()[2].getMetadata()._sClassName === 'sap.m.Text', "Check form text type");
            ok(dialogFormContent[0].getContent()[2].getText() === translationBundle.getText("feedbackHeaderText"), "Check form text value");
            ok(dialogFormContent[1].getContent()[0].getContent()[0].getMetadata()._sClassName === 'sap.m.Label', "Check form rating text type");
            ok(dialogFormContent[1].getContent()[0].getContent()[0].getText() === translationBundle.getText("ratingLabelText"), "Check form rating text value");
            ok(dialogFormContent[1].getContent()[0].getContent()[1].getMetadata()._sClassName === 'sap.m.Text', "Check form rating selection text type");
            ok(dialogFormContent[1].getContent()[0].getContent()[1].getText() === '', "Check form rating selection text value");
            ok(dialogFormContent[1].getContent()[1].getMetadata()._sClassName === 'sap.m.SegmentedButton', "Check form buttons type");
            ok(dialogFormContent[1].getContent()[1].getSelectedButton() === 'none', "Check no button is selected");
            ok(dialogFormContent[1].getContent()[1].getButtons().length === 5, "Check form all buttons exist");
            ok(dialogFormContent[2].getMetadata()._sClassName === 'sap.m.TextArea', "Check form textarea type");
            ok(dialogFormContent[2].getPlaceholder() === translationBundle.getText("feedbackPlaceHolderHeader"), "Check form textarea value");
            ok(dialogFormContent[3].getContent()[0].getMetadata()._sClassName === 'sap.m.Link', "Check form link type");
            ok(dialogFormContent[3].getContent()[0].getText() === translationBundle.getText("technicalDataLink"), "Check form link value");
            ok(dialogFormContent[5].getContent()[0].getMetadata()._sClassName === 'sap.m.CheckBox', "Check form checkbox type");
            ok(dialogFormContent[5].getContent()[0].getText() === translationBundle.getText("feedbackSendAnonymousText"), "Check form checkbox value");
            ok(dialogFormContent[5].getContent()[1].getMetadata()._sClassName === 'sap.m.CheckBox', "Check form checkbox type");
            ok(dialogFormContent[5].getContent()[1].getText() === translationBundle.getText("agreementAcceptanceText"), "Check form checkbox value");
            ok(dialogFormContent[5].getContent()[2].getMetadata()._sClassName === 'sap.m.Link', "Check form checkbox type");
            ok(dialogFormContent[5].getContent()[2].getText() === translationBundle.getText("legalAgreementLinkText"), "Check form checkbox value");

            //Destroy the about dialog
            sap.ui.getCore().byId('UserFeedbackDialog').destroy();
            endUserFeedbackDialogStub.restore();

            start();
        }, 150);
    });

    asyncTest("EndUserFeedback anonymous checkbox test", function () {
        var endUserFeedbackDialog = new sap.ushell.ui.footerbar.EndUserFeedback(this.oEndUserFeedbackConfiguration),
            endUserFeedbackDialogStub = sinon.stub(endUserFeedbackDialog, "getModel").returns(this.oModel);

        //Show the dialog
        endUserFeedbackDialog.ShowEndUserFeedbackDialog();

        setTimeout(function () {
            start();
            //Get the anonymous checkbox control.
            var dialogFormContent = sap.ui.getCore().byId('feedbackLayout').getContent(),
                oAnonyousCheckbox = dialogFormContent[5].getContent()[0];
            ok(oAnonyousCheckbox.getSelected() === false, 'Anonymous checkbox expected to be ' + false ? 'checked' : 'unchecked');

            //Destroy the EUF dialog
            sap.ui.getCore().byId('UserFeedbackDialog').destroy();
            endUserFeedbackDialogStub.restore();
        }, 150);
    });

    asyncTest("EndUserFeedback anonymous checkbox test", function () {
        this.oEndUserFeedbackConfiguration.anonymousByDefault = false;

        var endUserFeedbackDialog = new sap.ushell.ui.footerbar.EndUserFeedback(this.oEndUserFeedbackConfiguration),
            endUserFeedbackDialogStub = sinon.stub(endUserFeedbackDialog, "getModel").returns(this.oModel);

        //Show the dialog
        endUserFeedbackDialog.ShowEndUserFeedbackDialog();

        setTimeout(function () {
            start();
            //Get the anonymous checkbox control.
            var dialogFormContent = sap.ui.getCore().byId('feedbackLayout').getContent(),
                oAnonyousCheckbox = dialogFormContent[5].getContent()[0];
            ok(oAnonyousCheckbox.getSelected() === true, 'Anonymous checkbox expected to be ' + true ? 'checked' : 'unchecked');

            //Destroy the EUF dialog
            sap.ui.getCore().byId('UserFeedbackDialog').destroy();
            endUserFeedbackDialogStub.restore();
        }, 150);


    });
}());
