// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.define([
    'sap/ushell/ui/footerbar/ContactSupportButton',
    'sap/ushell/resources',
    'sap/ushell/services/Container'
], function (ContactSupportButton, Resources, Container) {
    "use strict";

    var oOriginalConfiguration = window["sap-ushell-config"];

    module("sap.ushell.ui.footerbar.ContactSupportButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
            // configure the user of the container adapter
            window["sap-ushell-config"] = {
                services: {
                    Container: {
                        adapter: {
                            config: {
                                id: "DEMO_USER",
                                firstName: "Demo",
                                lastName: "User",
                                fullName: "Demo User",
                                email: "demo.user@sap.com",
                                accessibility: false,
                                theme: "theme1",
                                bootTheme: {
                                    theme: "sap_bluecrystal",
                                    root: ""
                                },
                                language: "EN",
                                setAccessibilityPermitted: true,
                                setThemePermitted: true,
                                userProfile: [{id: "THEME", value: "sap_bluecrystal"}]
                            }
                        }
                    }
                }
            };
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").then(start);
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            // restore original configuration
            window["sap-ushell-config"] = oOriginalConfiguration;
            delete sap.ushell.Container;
        }
    });

    test("Constructor Test", function () {
        var ContactSupportDialog = new ContactSupportButton();
        ok(ContactSupportDialog.getIcon() === "sap-icon://email", "Check dialog icon");
        ok(ContactSupportDialog.getText("text") === Resources.i18n.getText("contactSupportBtn"), "Check dialog title");
    });

    asyncTest("showContactSupportDialog Test", function () {
        var contactSupportDialog = new ContactSupportButton();
        //Show the dialog
        contactSupportDialog.showContactSupportDialog();

        setTimeout(function () {
            start();

            // Get the contact support dialog content form
            var dialogForm = sap.ui.getCore().byId('ContactSupportDialog'),
                dialogFormContent = dialogForm.getContent(),
                ui5Version = (sap.ui.version || "") + (' (' + (sap.ui.buildinfo.buildtime || "") + ')') || '',
                userAgent = navigator.userAgent || '',
                simpleFormTopContent,
                simpleFormBottomContent,
                translationBundle = Resources.i18n;

            // check buttons
            ok(dialogForm.getLeftButton() === 'contactSupportSendBtn', "Check send button");
            ok(dialogForm.getRightButton() === 'contactSupportCancelBtn', "Check cancel button");

            // check content
            ok(dialogFormContent[0].getMetadata()._sClassName === 'sap.ui.layout.form.SimpleForm', "Check top simple form");
            ok(dialogFormContent[0].getId() === 'topForm', "Check top simple form id");
            ok(dialogFormContent[0].getEditable() === false, "Check top simple form is editable");
            // check top content
            simpleFormTopContent = dialogFormContent[0].getContent();
            ok(simpleFormTopContent !== undefined, "Check top simple form content");
            ok(simpleFormTopContent[0].getMetadata()._sClassName === "sap.m.TextArea", "Check top simple form content - TextArea");
            ok(simpleFormTopContent[0].getId() === "textArea", "Check top simple form content - TextArea id");
            ok(simpleFormTopContent[0].getPlaceholder() === translationBundle.getText("txtAreaPlaceHolderHeader"), "Check top simple form content - TextArea placeholder");

            ok(dialogFormContent[1].getMetadata()._sClassName === 'sap.ui.layout.form.SimpleForm', "Check bottom simple form");
            ok(dialogFormContent[1].getId() === 'bottomForm', "Check bottom simple form id");
            ok(dialogFormContent[1].getEditable() === false, "Check bottom simple form is editable");
            // check bottom content
            simpleFormBottomContent = dialogFormContent[1].getContent();
            ok(simpleFormBottomContent !== undefined, "Check bottom simple form content");
            ok(simpleFormBottomContent[0].getMetadata()._sClassName === "sap.m.Link", "Check bottom simple form content - link");
            ok(simpleFormBottomContent[0].getText() === translationBundle.getText("technicalDataLink"), "Check bottom simple form content - link text");

            //Destroy the contact support dialog
            sap.ui.getCore().byId('ContactSupportDialog').destroy();
        }, 150);
    });

    asyncTest("check bottom form content", function () {
        var contactSupportDialog = new ContactSupportButton(),
            simpleFormBottomContent,
            translationBundle = Resources.i18n;

        //Show the dialog
        contactSupportDialog.showContactSupportDialog();

        setTimeout(function () {
            start();

            // click on the link to open bottom form
            contactSupportDialog._embedLoginDetailsInBottomForm();

            var dialogFormContent = sap.ui.getCore().byId('ContactSupportDialog').getContent(),
                applicationInformation = contactSupportDialog.oClientContext.navigationData.applicationInformation;

            // get bottom content
            ok(dialogFormContent[1].getMetadata()._sClassName === 'sap.ui.layout.form.SimpleForm', "Check bottom simple form with technical info");
            ok(dialogFormContent[1].getId() === "technicalInfoBox", "Check bottom simple form id");
            ok(dialogFormContent[1].getEditable() === false, "Check bottom simple form is editable");
            simpleFormBottomContent = dialogFormContent[1].getContent();

            ok(simpleFormBottomContent[0].getMetadata()._sClassName === 'sap.m.Text', "Check form field loginDetails");
            ok(simpleFormBottomContent[0].getText() === translationBundle.getText("loginDetails"), "Check form field value loginDetails");
            ok(simpleFormBottomContent[1].getMetadata()._sClassName === 'sap.m.Label', "Check form field userFld");
            ok(simpleFormBottomContent[1].getText() === translationBundle.getText("userFld"), "Check form field value userFld");
            ok(simpleFormBottomContent[2].getMetadata()._sClassName === 'sap.m.Text', "Check form field userDetails.fullName");
            ok(simpleFormBottomContent[2].getText() === (contactSupportDialog.oClientContext.userDetails.fullName || ""), "Check form field value userDetails.fullName");
            ok(simpleFormBottomContent[3].getMetadata()._sClassName === 'sap.m.Label', "Check form field serverFld");
            ok(simpleFormBottomContent[3].getText() === translationBundle.getText("serverFld"), "Check form field value serverFld");
            ok(simpleFormBottomContent[4].getMetadata()._sClassName === 'sap.m.Text', "Check form field server");
            ok(simpleFormBottomContent[4].getText() === window.location.host, "Check form field value server");
            ok(simpleFormBottomContent[5].getMetadata()._sClassName === 'sap.m.Label', "Check form field eMailFld");
            ok(simpleFormBottomContent[5].getText() === translationBundle.getText("eMailFld"), "Check form field value eMailFld");
            ok(simpleFormBottomContent[6].getMetadata()._sClassName === 'sap.m.Text', "Check form field eMailFld");
            ok(simpleFormBottomContent[6].getText() === (contactSupportDialog.oClientContext.userDetails.eMail || ""), "Check form field value userDetails.eMail");
            ok(simpleFormBottomContent[7].getMetadata()._sClassName === 'sap.m.Label', "Check form field languageFld");
            ok(simpleFormBottomContent[7].getText() === translationBundle.getText("languageFld"), "Check form field value languageFld");
            ok(simpleFormBottomContent[8].getMetadata()._sClassName === 'sap.m.Text', "Check form field Language");
            ok(simpleFormBottomContent[8].getText() === (contactSupportDialog.oClientContext.userDetails.Language || ""), "Check form field value Language");

            //Destroy the about dialog
            sap.ui.getCore().byId('ContactSupportDialog').destroy();

        }, 150);
    });

    test("contact suppot button disabled", function () {
        sap.ushell.Container = undefined;
        var contactSupportDialog = new ContactSupportButton();
        ok(contactSupportDialog.getEnabled() === false, "the button is disabled");
    });

    asyncTest("Check bottom form content with email", function () {
        var translationBundle = Resources.i18n,
            oClientContext = sap.ushell.UserActivityLog.getMessageInfo(),
            messageInfoStub = sinon.stub(sap.ushell.UserActivityLog, "getMessageInfo", function () {
                oClientContext.userDetails.eMail = 'aaa@bbb.com';

                return oClientContext;
            }),
            contactSupportDialog = new ContactSupportButton(),
            dialogFormContent,
            simpleFormBottomContent;

        //Show the dialog
        contactSupportDialog.showContactSupportDialog();

        setTimeout(function () {
            start();

            // click on the link to open bottom form
            contactSupportDialog._embedLoginDetailsInBottomForm();

            dialogFormContent = sap.ui.getCore().byId('ContactSupportDialog').getContent();
            simpleFormBottomContent = dialogFormContent[1].getContent();
            ok(simpleFormBottomContent[5].getMetadata()._sClassName === 'sap.m.Label', "Check form field eMailFld");
            ok(simpleFormBottomContent[5].getText() === translationBundle.getText("eMailFld"), "Check form field value eMailFld");
            ok(simpleFormBottomContent[6].getMetadata()._sClassName === 'sap.m.Text', "Check form field mail");
            ok(simpleFormBottomContent[6].getText() === (oClientContext.userDetails.eMail), "Check form field value mail");
            messageInfoStub.restore();

            //Destroy the about dialog
            sap.ui.getCore().byId('ContactSupportDialog').destroy();
        }, 150);
    });
}, /* bExport= */ false);