// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Message
 */
sap.ui.require([
    "sap/ushell/services/Message",
    "sap/m/MessageBox",
    "sap/ushell/testUtils",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (Message, MessageBox, testUtils, Config, Resources) {
    "use strict";
    /* global QUnit sinon Promise */

    QUnit.module("sap.ushell.services.Message", function (hooks) {

        var oMessage;

        QUnit.module("Methods", {
            beforeEach: function () {
                oMessage = new Message();
            },
            afterEach: function () {
                testUtils.restoreSpies(
                    Config.last,
                    sap.ushell.Container,
                    jQuery.sap.log.error,
                    sap.m.Dialog.prototype.addContent,
                    sap.m.Dialog.prototype.addButton
                );
                oMessage = null;
            }
        });

        QUnit.test("init returns instance of MessageService", function (assert) {
            var oMessageInstance = oMessage.init();

            assert.ok(oMessageInstance instanceof Message, "instance returned");
        });

        QUnit.test("show throws an error when no message is provided", function (assert) {
            var oLogSpy = sinon.spy(jQuery.sap.log, "error"),
                oBuildMessageSpy = sinon.spy(oMessage, "buildMessage");

            oMessage.show();

            assert.ok(oLogSpy.called, "jQuery.sap.log.error called");
            assert.ok(!oBuildMessageSpy.called, "buildMessage not called");

            oLogSpy.restore();
            oBuildMessageSpy.restore();
        });

        QUnit.test("show uses callback function configured in init when available", function (assert) {
            var oCallback = sinon.spy(),
                oBuildMessageSpy = sinon.spy(oMessage, "buildMessage");

            oMessage.init(oCallback);
            oMessage.show(0, "Some foo message", null);

            assert.ok(oCallback.called, "Callback was used");
            assert.ok(!oBuildMessageSpy.called, "buildMessage was not used");

            oBuildMessageSpy.restore();
        });

        QUnit.test("show uses buildMessage method when no callback is configured", function (assert) {
            var oBuildMessageStub = sinon.stub(oMessage, "buildMessage");

            oMessage.show(0, "Some foo message", null);

            assert.ok(oBuildMessageStub.called, "buildMessage was not used");

            oBuildMessageStub.restore();
        });

        [
            {
                testDescription: "defaults to a generic message when no type is provided",
                oInput: {
                    iType: null,
                    sMessage: "TestMessage",
                    oParameters: null
                },
                oExpected: {
                    oConfiguration: {
                        duration: 3000
                    },
                    sType: "show",
                    sMessage: "TestMessage"
                }
            },
            {
                testDescription: "defaults to a generic message when no type is provided but Parameters are provided",
                oInput: {
                    iType: null,
                    sMessage: "TestMessage",
                    oParameters: {
                        duration: 1234,
                        details: "FooBar" // Should NOT be considered!
                    }
                },
                oExpected: {
                    oConfiguration: {
                        duration: 1234
                    },
                    sType: "show",
                    sMessage: "TestMessage"
                }
            },
            {
                testDescription: "confirm MessageBox is shown when no actions and MessageType CONFIRM are provided",
                oInput: {
                    iType: 2, // ERROR
                    sMessage: "TestMessage",
                    oParameters: {
                        details: "FooBar"
                    }
                },
                oExpected: {
                    oConfiguration: {
                        actions: undefined,
                        title: undefined,
                        onClose: undefined,
                        details: "FooBar"
                    },
                    sType: "confirm",
                    sMessage: "TestMessage"
                }
            },
            {
                testDescription: "confirm MessageBox is not shown when actions and MessageType CONFIRM are provided",
                oInput: {
                    iType: 2, // ERROR
                    sMessage: "TestMessage",
                    oParameters: {
                        details: "FooBar",
                        actions: ["Some", "FakeActions"]
                    }
                },
                oExpected: {
                    oConfiguration: {
                        actions: ["Some", "FakeActions"],
                        title: undefined,
                        onClose: undefined,
                        icon: "QUESTION",
                        details: "FooBar"
                    },
                    sType: "show",
                    sMessage: "TestMessage"
                }
            }
        ].forEach(function (oFixture) {
            QUnit.test("buildMessage " + oFixture.testDescription, function (assert) {
                var oExpected = oFixture.oExpected,
                    oInput = oFixture.oInput,
                    oExpectedMethodStub = sinon.stub(oMessage, "sendMessageBox");

                oMessage.buildMessage(oInput.iType, oInput.sMessage, oInput.oParameters || {});

                assert.ok(oExpectedMethodStub.called, "Expected method got called");
                assert.strictEqual(oExpectedMethodStub.lastCall.args[0], oExpected.sMessage, "Expected message provided");
                assert.strictEqual(oExpectedMethodStub.lastCall.args[1], oExpected.sType, "Expected type provided");
                assert.deepEqual(oExpectedMethodStub.lastCall.args[2], oExpected.oConfiguration, "Expected configuration provided");
            });
        });

        [
            {
                testDescription: "Contact Support is disabled and no details are given",
                oInput: {
                    sMessage: "TestMessage",
                    oParameters: {},
                    bSupportTicketEnabled: false
                },
                oExpected: {
                    buttons: [Resources.i18n.getText("okDialogBtn"), Resources.i18n.getText("CopyToClipboardBtn"), Resources.i18n.getText("cancelDialogBtn")],
                    contentInVBox: ["TestMessage"]
                }
            },
            {
                testDescription: "Contact Support is disabled and details are given",
                oInput: {
                    sMessage: "TestMessage",
                    oParameters: {
                        details: "TestDetails"
                    },
                    bSupportTicketEnabled: false
                },
                oExpected: {
                    buttons: [Resources.i18n.getText("okDialogBtn"), Resources.i18n.getText("CopyToClipboardBtn"), Resources.i18n.getText("cancelDialogBtn")],
                    contentInVBox: ["TestMessage", Resources.i18n.getText("ViewDetails")]
                }
            },
            {
                testDescription: "Contact Support is disabled and details are given",
                oInput: {
                    sMessage: "TestMessage",
                    oParameters: {},
                    bSupportTicketEnabled: true
                },
                oExpected: {
                    buttons: [Resources.i18n.getText("contactSupportBtn"), Resources.i18n.getText("CopyToClipboardBtn"), Resources.i18n.getText("cancelDialogBtn")],
                    contentInVBox: ["TestMessage"]
                }
            },
            {
                testDescription: "Contact Support is disabled and details are given",
                oInput: {
                    sMessage: "TestMessage",
                    oParameters: {
                        details: "TestDetails"
                    },
                    bSupportTicketEnabled: true
                },
                oExpected: {
                    buttons: [Resources.i18n.getText("contactSupportBtn"), Resources.i18n.getText("CopyToClipboardBtn"), Resources.i18n.getText("cancelDialogBtn")],
                    contentInVBox: ["TestMessage", Resources.i18n.getText("ViewDetails")]
                }
            }
        ].forEach(function (oFixture) {
            QUnit.test("createErrorDialog correctly enriches the Dialog when " + oFixture.testDescription, function (assert) {
                var oExpected = oFixture.oExpected,
                    oInput = oFixture.oInput,
                    oDialogAddContentStub = sinon.stub(sap.m.Dialog.prototype, "addContent"),
                    oDialogAddButtonStub = sinon.stub(sap.m.Dialog.prototype, "addButton"),
                    index;

                sinon.stub(Config, "last")
                    .withArgs("/core/extension/SupportTicket")
                    .returns(oInput.bSupportTicketEnabled);

                if (!sap.ushell.Container) {
                    sap.ushell.Container = {};
                }

                oMessage.createErrorDialog(oInput.sMessage, oInput.oParameters);

                assert.ok(oDialogAddContentStub.called, "sap.m.Dialog#addContent called");

                for (index = 0; index < oExpected.contentInVBox.length; index++) {
                    assert.strictEqual(oDialogAddContentStub.getCall(0).args[0].getItems()[index].getText(), oExpected.contentInVBox[index], "content: " + oExpected.contentInVBox[index] + " is correct");
                }

                assert.strictEqual(oDialogAddButtonStub.callCount,oExpected.buttons.length, "added exactly " + oExpected.buttons.length + " buttons");

                for (index = 0; index < oExpected.buttons.length; index++) {
                    assert.strictEqual(oDialogAddButtonStub.getCall(index).args[0].getText(), oExpected.buttons[index], "button: " + oExpected.buttons[index] + " is placed correctly");
                }
            });
        });

        [{
            testDescription: "show is needed",
            oInput: {
                sType: "show",
                sMessage: "TestMessage",
                oConfig: {
                    someProperty: "This is a Property"
                }
            },
            oExpected: {
                sMessage: "TestMessage",
                oConfig: {
                    someProperty: "This is a Property"
                }
            }
        },
        {
            testDescription: "confirm is needed",
            oInput: {
                sType: "confirm",
                sMessage: "TestMessage",
                oConfig: {
                    someProperty: "This is a Property"
                }
            },
            oExpected: {
                sMessage: "TestMessage",
                oConfig: {
                    someProperty: "This is a Property"
                }
            }
        }].forEach(function (oFixture) {
            QUnit.test("sendMessageBox calls the correct MessageBox type when " + oFixture.testDescription, function (assert) {
                var sExpectedFunctionCall = oFixture.oInput.sType,
                    oExpected = oFixture.oExpected,
                    oInput = oFixture.oInput,
                    oExpectedFunctionStub = sinon.stub(MessageBox, sExpectedFunctionCall);

                oMessage.sendMessageBox(oInput.sMessage, oInput.sType, oInput.oConfig);

                assert.ok(oExpectedFunctionStub.called, "Correct function called");
                assert.deepEqual(oExpectedFunctionStub.lastCall.args[0], oExpected.sMessage, "Correct message provided");
                assert.deepEqual(oExpectedFunctionStub.lastCall.args[1], oExpected.oConfig, "Correct config provided");
            });
        });

        [
            {
                testDescription: "duration is provided",
                oInput: {
                    sMessage: "TestMessage",
                    iDuration: 5000
                },
                oExpected: {
                    iType: 0,
                    sMessage: "TestMessage",
                    oConfiguration: {
                        duration: 5000
                    }
                }
            },
            {
                testDescription: "duration is not provided",
                oInput: {
                    sMessage: "TestMessage"
                },
                oExpected: {
                    iType: 0,
                    sMessage: "TestMessage",
                    oConfiguration: {
                        duration: 3000
                    }
                }
            }
        ].forEach(function (oFixture) {
            QUnit.test("info calls the correct function with correct arguments when " + oFixture.testDescription, function (assert) {
                var oInput = oFixture.oInput,
                    oExpected = oFixture.oExpected,
                    oShowStub = sinon.stub(oMessage, "show");

                oMessage.info(oInput.sMessage, oInput.iDuration);

                assert.ok(oShowStub.called, "show got called");
                assert.strictEqual(oShowStub.lastCall.args[0], oExpected.iType, "correct type provided");
                assert.strictEqual(oShowStub.lastCall.args[1], oExpected.sMessage, "correct message provided");
                assert.deepEqual(oShowStub.lastCall.args[2], oExpected.oConfiguration, "correct duration provided");
            });
        });

        [
            {
                testDescription: "title is provided",
                oInput: {
                    sMessage: "TestMessage",
                    sTitle: "FoobarTitle"
                },
                oExpected: {
                    iType: 1,
                    sMessage: "FoobarTitle , TestMessage",
                    oConfiguration: {
                        title: "FoobarTitle"
                    }
                }
            },
            {
                testDescription: "title is not provided",
                oInput: {
                    sMessage: "TestMessage"
                },
                oExpected: {
                    iType: 1,
                    sMessage: "TestMessage",
                    oConfiguration: {
                        title: undefined
                    }
                }
            }
        ].forEach(function (oFixture) {
            QUnit.test("error logs the error and calls the correct function with correct arguments when " + oFixture.testDescription, function (assert) {
                var oInput = oFixture.oInput,
                    oExpected = oFixture.oExpected,
                    oShowStub = sinon.stub(oMessage, "show"),
                    oJQueryErrorStub = sinon.stub(jQuery.sap.log, "error");

                oMessage.error(oInput.sMessage, oInput.sTitle);

                assert.ok(oShowStub.called, "show got called");
                assert.ok(oJQueryErrorStub.called, "jQuery.sap.log.error got called");
                assert.strictEqual(oShowStub.lastCall.args[0], oExpected.iType, "correct type provided");
                assert.strictEqual(oShowStub.lastCall.args[1], oExpected.sMessage, "correct message provided");
                assert.deepEqual(oShowStub.lastCall.args[2], oExpected.oConfiguration, "correct duration provided");
                assert.strictEqual(oJQueryErrorStub.lastCall.args[0], oExpected.sMessage, "correct error log thrown");
            });
        });

        QUnit.test("confirm calls the correct function with correct arguments", function (assert) {
            var oInput = {
                sMessage: "TestMessage",
                fnCallback: function () { },
                sTitle: "SomeTitle",
                vActions: ["Some", "Fake", "Action"]
            },
                oExpected = {
                    iType: 2,
                    sMessage: "TestMessage",
                    oConfiguration: {
                        callback: null, // Will be replaced later
                        title: "SomeTitle",
                        actions: ["Some", "Fake", "Action"]
                    }
                },
                oShowStub = sinon.stub(oMessage, "show");

            oMessage.confirm(oInput.sMessage, oInput.fnCallback, oInput.sTitle, oInput.vActions);

            assert.ok(oShowStub.called, "show got called");
            assert.ok(typeof oShowStub.lastCall.args[2].callback === "function", "callback function provided");
            oExpected.oConfiguration.callback = oShowStub.lastCall.args[2].callback;

            assert.strictEqual(oShowStub.lastCall.args[0], oExpected.iType, "correct type provided");
            assert.strictEqual(oShowStub.lastCall.args[1], oExpected.sMessage, "correct message provided");
            assert.deepEqual(oShowStub.lastCall.args[2], oExpected.oConfiguration, "correct duration provided");
        });
    });
});