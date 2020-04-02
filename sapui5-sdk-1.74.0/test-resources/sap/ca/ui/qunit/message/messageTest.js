window.addEventListener("load", function () {
    var MESSAGEBOX_ID = "CA_VIEW_MSG--DLG_MSGBOX";
    var MESSAGEBOX_MESSAGE = "CA_VIEW_MSG--TXT_MSG";
    var MESSAGEBOX_LNK_SHOWDETAILS = "CA_VIEW_MSG--LINK_DETAILS";
    var MESSAGEBOX_TXA_DETAILS = "CA_VIEW_MSG--TXA_DETAILS";
    var MESSAGEBOX_BTN_OK = "CA_VIEW_MSG--BTN_OK";
    var MESSAGEBOX_NAME = "Message Box";

// require dialog module
    jQuery.sap.require("sap.ca.ui.message.message");

    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for Messages</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oHorizontal.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - Message Test",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var oButton = new sap.m.Button({
        text: "Open Message Toast",
        press: function () {
            sap.ca.ui.message.showMessageToast("It's a great success!");
        }
    });

    var isMsgBoxClosed = false;
    var oButton1 = new sap.m.Button({
        text: "Open (Error) Message Box",
        press: function () {
            var fnClose = function () {
                isMsgBoxClosed = true;
            };
            sap.ca.ui.message.showMessageBox({
                type: sap.ca.ui.message.Type.ERROR,
                message: "No connection can be established to the backend system ABC",
                details: "Lorem ipsum dolor sit amet, eum an vidit porro ocurreret, has elit illud probatus ut. Ut est audire necessitatibus, case denique scribentur vel no. Ipsum suscipit te quo, eam ne justo insolens. His dico impedit offendit ea, decore eripuit volumus sea an, ut omnes cetero delectus eos.\n\nTota paulo graecis ei usu, mei te alii alia harum. Nulla singulis in nec, qui vide solum inani no. Lorem timeam posidonium nec te, decore noster ut eum, sit mazim delicata deterruisset cu. Id mea nemore delenit, eu ignota propriae eum.\n\nSolum atqui persecuti ut est, altera corrumpit te his. Nam justo epicurei mnesarchum ut, ne nam error ludus. Aeque utinam eum ad, homero audiam recteque nec ne, mazim constituam ne pri. Cum tollit dolorum interesset at. Pri partem tempor reprehendunt in, delectus vulputate sed ne. Etiam aeterno dolores eum ut.\n\nEx conceptam omittantur quo. Sit et petentium scripserit, te mea simul civibus scaevola. Mel solum ludus ea, ut sed cibo choro exerci. Eum discere quaestio ei, sed legendos platonem necessitatibus in. Eu duo populo mnesarchum vituperata."
            }, fnClose);
            isMsgBoxClosed = false;
        }
    });

    var oButton2 = new sap.m.Button({
        text: "Open (Info) Message Box",
        press: function () {
            sap.ca.ui.message.showMessageBox({
                type: sap.ca.ui.message.Type.INFO,
                message: "You got notifications...",
                details: "          message1:1\nmessage2:2\nmessage3:3\n"
            });
            isMsgBoxClosed = false;
        }
    });

    var oButton3 = new sap.m.Button({
        text: "Open (Warning) Message Box",
        press: function () {
            sap.ca.ui.message.showMessageBox({
                type: sap.ca.ui.message.Type.WARNING,
                message: "No Recipients found"
            });
            isMsgBoxClosed = false;
        }
    });

    var oButton4 = new sap.m.Button({
        text: "Open (Success) Message Box",
        press: function () {
            sap.ca.ui.message.showMessageBox({
                type: sap.ca.ui.message.Type.SUCCESS,
                message: "   You may need to use Message Toast\n",
                details: "You may need to use Message Toast\n"
            });
            isMsgBoxClosed = false;
        }
    });

    var oHorizontal = new sap.m.HBox({
        items: [oButton, oButton1, oButton2, oButton3, oButton4]
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");

    module("Initial Check");

    qunithelper.checkDialog_beforeInitialized(MESSAGEBOX_ID, MESSAGEBOX_NAME);

    module("Test Message Type");

    var _testMsgType = function (oTypeToCheck, sExpTitle, oExpValueState) {
        strictEqual(oTypeToCheck.title, sExpTitle, "MessageType " + sExpTitle + ": title is ok");
        strictEqual(oTypeToCheck.valueState, oExpValueState, "MessageType " + sExpTitle + ": value state is ok");
    };

    test("Test Message Type", function () {
        _testMsgType(sap.ca.ui.message.Type.ERROR, sap.ca.ui.utils.resourcebundle.getText("messagetype.error"), sap.ui.core.ValueState.Error);
        _testMsgType(sap.ca.ui.message.Type.WARNING, sap.ca.ui.utils.resourcebundle.getText("messagetype.warning"), sap.ui.core.ValueState.Warning);
        _testMsgType(sap.ca.ui.message.Type.SUCCESS, sap.ca.ui.utils.resourcebundle.getText("messagetype.success"), sap.ui.core.ValueState.Success);
        _testMsgType(sap.ca.ui.message.Type.INFO, sap.ca.ui.utils.resourcebundle.getText("messagetype.info"), sap.ui.core.ValueState.None);
    });

    module("Show Message Toast");

    asyncTest("Show Message Toast", function () {
        oButton.firePress();
        setTimeout(function () {
            //the message box is keeping showing 3 sec.
            var $MessageToast0 = jQuery(".sapMMessageToast").eq(0);
            ok($MessageToast0, "Got sapMMessageToast");
            if ($MessageToast0) {
                strictEqual($MessageToast0.text(), "It's a great success!", "It's a great success!");
            }
            start();
        }, 1000);
    });

    var msgBox, msgText, msgLink;
    var _init = function () {
        var msgBox = null;
        var msgText = null;
        var msgLink = null;
    };

    var _closeMsgBox_andCheck = function (bCallbackIsCalled) {
        qunithelper.closeDialog_andCheck(MESSAGEBOX_ID, MESSAGEBOX_BTN_OK);
        if (bCallbackIsCalled) {
            test("Test Callback", function () {
                equal(isMsgBoxClosed, true, "Callback function is called");
            });
        }
    };

    var _check_MsgBox_ShowElement = function (sElementID, bInDOM) {
        var oElement = sap.ui.getCore().byId(sElementID);
        ok(oElement, "Message Link exists in sap.ui.core");

        if (bInDOM) {
            ok(jQuery.sap.domById(sElementID), "Element '" + sElementID + "' exists in DOM");
        } else {
            ok(!jQuery.sap.domById(sElementID), "Element '" + sElementID + "' should NOT exist in DOM");
        }
    };

    var _check_MsgBox_ValueState = function (oExpValueState) {
        strictEqual(msgBox.getState(), oExpValueState, "MessageBox has the state " + oExpValueState);
    };

    var _check_MsgBox_isShown = function (oExpectedValue) {
        msgBox = qunithelper.checkDialog_isVisible(MESSAGEBOX_ID, oExpectedValue.title, "25em");

        qunithelper.check_Text_isVisible(MESSAGEBOX_MESSAGE, oExpectedValue.message);
        if (oExpectedValue.showDetailsText) {
            qunithelper.check_Text_isVisible(MESSAGEBOX_TXA_DETAILS, oExpectedValue.details);
        }

        _check_MsgBox_ShowElement(MESSAGEBOX_LNK_SHOWDETAILS, oExpectedValue.showDetailsLink);
        _check_MsgBox_ShowElement(MESSAGEBOX_TXA_DETAILS, oExpectedValue.showDetailsText);

        _check_MsgBox_ValueState(oExpectedValue.valueState);
    };

    module("Show Message Box - Type ERROR");

    _init();
    asyncTest("Show Message Box - Type ERROR", function () {
        oButton1.firePress();
        setTimeout(function () {
            _check_MsgBox_isShown({
                title: sap.ca.ui.utils.resourcebundle.getText("messagetype.error"),
                valueState: sap.ui.core.ValueState.Error,
                icon: "sap-icon://alert",
                showDetailsLink: true,
                showDetailsText: false
            });
            start();
        }, 2000);
    });

    asyncTest("Click on 'Show Details' Link", function () {
        sap.ui.getCore().byId(MESSAGEBOX_LNK_SHOWDETAILS).firePress();
        setTimeout(function () {
            _check_MsgBox_isShown({
                title: sap.ca.ui.utils.resourcebundle.getText("messagetype.error"),
                valueState: sap.ui.core.ValueState.Error,
                icon: "sap-icon://alert",
                showDetailsLink: false,
                showDetailsText: true
            });
            start();
        }, 2000);
    });

    _closeMsgBox_andCheck(true); //callback function is provided

    module("Show Message Box - Type INFO");

    _init();
    asyncTest("Show Message Box - Type INFO", function () {
        oButton2.firePress();
        setTimeout(function () {
            _check_MsgBox_isShown({
                title: sap.ca.ui.utils.resourcebundle.getText("messagetype.info"),
                valueState: sap.ui.core.ValueState.None,
                icon: "sap-icon://hint",
                showDetailsLink: true,
                showDetailsText: false
            });
            start();
        }, 2000);
    });

    asyncTest("Click on 'Show Details' Link", function () {
        sap.ui.getCore().byId(MESSAGEBOX_LNK_SHOWDETAILS).firePress();
        setTimeout(function () {
            _check_MsgBox_isShown({
                title: sap.ca.ui.utils.resourcebundle.getText("messagetype.info"),
                valueState: sap.ui.core.ValueState.None,
                icon: "sap-icon://hint",
                showDetailsLink: false,
                showDetailsText: true,
                details: "message1:1\nmessage2:2\nmessage3:3"
            });
            start();
        }, 2000);
    });

    _closeMsgBox_andCheck();

    module("Show Message Box - Type WARNING");

    _init();
    asyncTest("Show Message Box - Type WARNING", function () {
        oButton3.firePress();
        setTimeout(function () {
            _check_MsgBox_isShown({
                title: sap.ca.ui.utils.resourcebundle.getText("messagetype.warning"),
                valueState: sap.ui.core.ValueState.Warning,
                icon: "sap-icon://warning2",
                showDetailsLink: false,
                showDetailsText: false
            });
            start();
        }, 2000);
    });

    _closeMsgBox_andCheck();

    module("Show Message Box - Type SUCCESS");

    _init();
    asyncTest("Show Message Box - Type SUCCESS", function () {
        oButton4.firePress();
        setTimeout(function () {
            _check_MsgBox_isShown({
                title: sap.ca.ui.utils.resourcebundle.getText("messagetype.success"),
                valueState: sap.ui.core.ValueState.Success,
                icon: "sap-icon://accept",
                message: "You may need to use Message Toast",
                showDetailsLink: false,
                showDetailsText: false
            });
            start();
        }, 2000);
    });

    _closeMsgBox_andCheck();
});
