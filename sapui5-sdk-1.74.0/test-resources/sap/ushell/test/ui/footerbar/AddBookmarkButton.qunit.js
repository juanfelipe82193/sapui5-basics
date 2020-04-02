// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /*global module, ok, test, jQuery, sap, sinon, stop, start */
    jQuery.sap.require("sap.ushell.ui.footerbar.AddBookmarkButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    sap.ui.require([
        "sap/ushell/EventHub",
        "sap/ushell/Config"
    ], function (EventHub, Config) {


        var attachThemeChangedStub,
            addBookmarkSpy,
            oRenderer,
            historyBackStub,
            fGetConfiguration;

        module("sap.ushell.ui.footerbar.AddBookmarkButton", {
            setup: function () {
                historyBackStub = sinon.stub(window.history, 'back');
                stop();
                sap.ushell.bootstrap("local").then(function () {
                    attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");
                    oRenderer = sap.ushell.Container.createRenderer("fiori2");
                    addBookmarkSpy = sinon.stub(sap.ushell.Container.getService("LaunchPage"), "addBookmark");
                    addBookmarkSpy.returns(jQuery.Deferred().resolve().promise());
                    fGetConfiguration = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "getConfiguration").returns({});
                    start();
                });

                // Disable Recent Activity as the User Recent service is not available and this test is very integrated
                this.tempEnableRecentActivity = Config.last("/core/shell/enableRecentActivity");
                Config.emit("/core/shell/enableRecentActivity", false);
            },
            /**
             * This method is called after each test. Add every restoration code here.
             */
            teardown: function () {
                stop();

                // TODO proper test isolation missing; therefore wait until until Shell.controller
                // finished initialization before executing the teardown
                EventHub.once("ShellNavigationInitialized").do(function () {
                    start();

                    attachThemeChangedStub.restore();
                    oRenderer.destroy();
                    addBookmarkSpy.restore();
                    fGetConfiguration.restore();
                    historyBackStub.restore();
                    delete sap.ushell.Container;

                    Config.emit("/core/shell/enableRecentActivity", this.tempEnableRecentActivity);

                    // Ensure the next teardown call gets the current ShellNavigationInitialized event (not a previous one)
                    EventHub._reset();
                });
            }
        });


        test("Constructor Test", function () {
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();
            ok(bookmark.getIcon() == "sap-icon://add-favorite" , "Check dialog icon");
            ok(bookmark.getText("text") == sap.ushell.resources.i18n.getText("addToHomePageBtn") , "Check button title");
            ok(bookmark.getEnabled() == true, "Check if button is enabled");
        });

        test("Custom Url Test 1 - a simple string", function () {
            this.isCheckCustomUrlCalled = false;
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {customUrl : "TestUrl", title: 'TestTitle' }});
            bookmark._openDialog = function () {
                this.oDialog = {
                    close: function () {},
                    destroy: function () {}
                };
                this.cb = function () {};
            };
            bookmark.showAddBookmarkDialog();
            bookmark._handleOkButtonPress();


            ok(addBookmarkSpy.calledOnce, "addBookmark service called");
            ok(addBookmarkSpy.getCall(0).args[0].url === "TestUrl", "expected value for customUrl is: TestUrl");

            bookmark.oSimpleForm.destroy();
            bookmark.destroy();
        });

        test("Custom Url Test 2 - a function", function () {
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {customUrl : function() {return "TestUrl";}, title: 'TestTitle' }});
            bookmark._openDialog = function () {
                this.oDialog = {
                    close: function () {},
                    destroy: function () {}
                };
                this.cb = function () {};
            };
            bookmark.showAddBookmarkDialog();
            bookmark._handleOkButtonPress();

            ok(addBookmarkSpy.calledOnce, "event: addBookmarkTile wasn't published");
            ok(addBookmarkSpy.getCall(0).args[0].url === "TestUrl", "expected value for customUrl is: TestUrl");

            bookmark.oSimpleForm.destroy();
            bookmark.destroy();
        });


        test("appData serviceURL Test 1 - simple string", function () {
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {serviceUrl : 'testServiceUrl', title: 'TestTitle' }});
            bookmark._openDialog = function () {
                this.oDialog = {
                    close: function () {},
                    destroy: function () {}
                };
                this.cb = function () {};
            };

            bookmark.showAddBookmarkDialog();
            bookmark._handleOkButtonPress();

            ok(addBookmarkSpy.calledOnce, "event: addBookmarkTile wasn't published");
            ok(addBookmarkSpy.getCall(0).args[0].serviceUrl === "testServiceUrl", "service URL plain string came back ok");
            bookmark.oSimpleForm.destroy();
            bookmark.destroy();
        });

        test("appData serviceURL Test 2 - a function ", function () {
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {serviceUrl : function () { return 'functionServiceUrl'; }, title: 'TestTitle' }});

            bookmark._openDialog = function () {
                this.oDialog = {
                    close: function () {},
                    destroy: function () {}
                };
                this.cb = function () {};
            };

            bookmark.showAddBookmarkDialog();
            bookmark._handleOkButtonPress();

            ok(addBookmarkSpy.calledOnce, "event: addBookmarkTile wasn't published");
            ok(addBookmarkSpy.getCall(0).args[0].serviceUrl === "functionServiceUrl", "service URL plain string came back ok");
            bookmark.oSimpleForm.destroy();
            bookmark.destroy();
        });

        test("Bookmark button setEnabled in standalone application and renderer is undefined Test", function () {
            var renderer = sap.ushell.renderers,
                rendererFiori2 = sap.ushell.renderers.fiori2;
            sap.ushell.renderers.fiori2 = undefined;
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();
            ok(bookmark.getEnabled() == true, "Check if disabled - shell is in standalone state and renderers.fiori2 = undefined");

            sap.ushell.renderers = undefined;
            bookmark.setEnabled();
            ok(bookmark.getEnabled() == true, "Check if disabled - shell is in standalone state and renderers = undefined");

            sap.ushell.renderers = renderer;
            sap.ushell.renderers.fiori2 = rendererFiori2;
        });
        test("Bookmark button Disabled in standalone state", function () {
            //Check that the button is disabled and invisible if the state of the shell is "standalone"
            fGetConfiguration.returns({
                appState : "standalone"
            });
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

            ok(bookmark.getEnabled() == false, "Check if disabled - shell is in standalone state");
            ok(bookmark.getVisible() == true, "Check if visible - shell is in standalone state");
        });

        test("Bookmark button Disabled in headerless state", function () {
            //Check that the button is disabled and invisible if the state of the shell is "headerless"
            fGetConfiguration.returns({
                appState : "headerless"
            });
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

            ok(bookmark.getEnabled() == false, "Check if disabled - shell is in headerless state");
            ok(bookmark.getVisible() == true, "Check if visible - shell is in headerless state");
        });

        test("Bookmark button Disabled in embedded state", function () {
            //Check that the button is disabled and invisible if the state of the shell is "embedded"
            fGetConfiguration.returns({
                appState : "embedded"
            });
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

            ok(bookmark.getEnabled() == false, "Check if disabled - shell is in embedded state");
            ok(bookmark.getVisible() == true, "Check if visible - shell is in embedded state");
        });

        test("Disable bookmark button when personalization is switched off", function () {
            fGetConfiguration.returns({
                enablePersonalization : false
            });
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

            ok(bookmark.getEnabled() == false, "Check if disabled - personalization is off");
            ok(bookmark.getVisible() == true, "Check if visible - personalization is off");
        });

        test("showAddBookmarkDialog Test", function () {
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton(),
                oResourceBundle = sap.ushell.resources.i18n;
            ok(bookmark.getEnabled() == true, "Enabled");
            bookmark.showAddBookmarkDialog();
            var bookmarkDialogContent = sap.ui.getCore().byId('bookmarkFormId').getContent()[0].getContent();
            ok(bookmarkDialogContent[0].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #1");
            ok(bookmarkDialogContent[0].getText() === oResourceBundle.getText('previewFld') , "Check form field value #1");
            var tile = bookmarkDialogContent[1].getItems()[1];
            ok(tile.getMetadata()._sClassName === 'sap.ushell.ui.launchpad.Tile' , "Check tile exists");
            ok(bookmarkDialogContent[2].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #1");
            ok(bookmarkDialogContent[2].getText() === " " + oResourceBundle.getText('titleFld') , "Check form field value #1");
            ok(bookmarkDialogContent[3].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #2");
            ok(bookmarkDialogContent[3].getValue() === "" , "Check form field value #2");
            ok(bookmarkDialogContent[4].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #3");
            ok(bookmarkDialogContent[4].getText() === oResourceBundle.getText('subtitleFld') , "Check form field value #3");
            ok(bookmarkDialogContent[5].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #4");
            ok(bookmarkDialogContent[5].getValue() === "" , "Check form field value #4");
            ok(bookmarkDialogContent[6].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #5");
            ok(bookmarkDialogContent[6].getText() === oResourceBundle.getText('tileSettingsDialog_informationField') , "Check form field value #5");
            ok(bookmarkDialogContent[7].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #6");
            ok(bookmarkDialogContent[7].getValue() === '' , "Check form field value #6");

            sap.ui.getCore().byId('bookmarkDialog').destroy();
        });

        test("Mark title field as error when Title Field is empty and ok was pressed", function () {
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();
            bookmark.showAddBookmarkDialog();
            var bookmarkDialogContent = sap.ui.getCore().byId('bookmarkFormId').getContent()[0].getContent();
            var titleInput = bookmarkDialogContent[3];
            var bookmarkDialogOkButton = sap.ui.getCore().byId('bookmarkDialog').getBeginButton();

            ok(titleInput.getValue() === "" && bookmarkDialogOkButton.getProperty("enabled"), "Check the ok button is enabled");
            ok(titleInput.getValueState() === "None", "Check the value status of title input is NORMAL");

            bookmarkDialogOkButton.firePress();
            ok(titleInput.getValueState() === "Error", "Check the value status of title input is ERROR");

            titleInput.setValue("not empty");
            titleInput.fireLiveChange();
            ok(titleInput.getValueState() === "None", "Check the value status of title input is NORMAL");

            sap.ui.getCore().byId('bookmarkDialog').destroy();
        });

        test("Test bookmark button cancel method", function () {
            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();
            bookmark.showAddBookmarkDialog(function () {/*cb function*/});
            var bookmarkDialogContent = sap.ui.getCore().byId('bookmarkFormId').getContent()[0].getContent();
            var titleInput = bookmarkDialogContent[3];
            var bookmarkCancelBtn = sap.ui.getCore().byId('bookmarkDialog').getEndButton();
            titleInput.setValue("have title value");
            titleInput.fireLiveChange();
            ok(titleInput.getValue() === "have title value", "Check the value changed");
            bookmarkCancelBtn.firePress();
            ok(bookmark.oModel.oData.title === "", "Check the value is empty after cancel btn pressed");
            sap.ui.getCore().byId('bookmarkDialog').destroy();
            bookmark.destroy();
        });



        test("Test bookmark button exit method", function (assert) {

            var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton(),
                oModelDestroySpy = sinon.spy(bookmark.oModel, "destroy");
            bookmark.destroy();
            assert.ok(oModelDestroySpy.calledOnce, "The bookmark button model is destroyed");
            oModelDestroySpy.restore();
        });
    });
}());
