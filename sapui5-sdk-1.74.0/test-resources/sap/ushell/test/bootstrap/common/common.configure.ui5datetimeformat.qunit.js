// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.configure.ui5datetimeformat.js
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.configure.ui5datetimeformat"
], function (testUtils, fnConfigureUI5DateTimeFormat) {
    "use strict";
    /*global jQuery, module, sap, sinon, window, QUnit */

    module("sap.ushell.bootstrap.common.common.configure.ui5datetimeformat", {
        setup: function () {
            this.oFormatSettings = sap.ui.getCore().getConfiguration()
                .getFormatSettings();

        },
        teardown: function () {
            testUtils.restoreSpies(
                this.oFormatSettings.setLegacyDateFormat,
                this.oFormatSettings.setLegacyTimeFormat,
                jQuery.sap.log.error
            );
        }

    });

    [
        {
            testDescription: "when the date and time format is correct",
            userProfile:
            {
                defaults:
                {
                    sapDateFormat: "1",
                    sapTimeFormat: "1"
                }
            }
        },
        {
            testDescription: "when the userProfile is undefined",
            userProfile: undefined
        },
        {
            testDescription: "when the date format is null and time format is undefined",
            userProfile:
            {
                defaults:
                {
                    sapDateFormat: null,
                    sapTimeFormat: undefined
                }
            }
        },
        {
            testDescription: "when the date format and time format is a number",
            userProfile:
            {
                defaults:
                {
                    sapDateFormat: 1,
                    sapTimeFormat: 1
                }
            }
        },
        {
            testDescription: "when the date and time format is not correct",
            userProfile:
            {
                defaults:
                {
                    sapDateFormat: "-1",
                    sapTimeFormat: "-1"
                }
            },
            sExpectedErrorMessageDate : "Date Format is incorrectly set for the User",
            sExpectedErrorMessageTime: "Time Format is incorrectly set for the User"
        },
        {
            testDescription: "when the date format is not correct",
            userProfile:
            {
                defaults:
                {
                    sapDateFormat: "-1",
                    sapTimeFormat: "0"
                }
            },
            sExpectedErrorMessageDate: "Date Format is incorrectly set for the User",
        },
        {
            testDescription: "when the time format is not correct",
            userProfile:
            {
                defaults:
                {
                    sapDateFormat: "1",
                    sapTimeFormat: "-1"
                }
            },
            sExpectedErrorMessageTime: "Time Format is incorrectly set for the User",
        }
    ].forEach(function (oFixture) {
        QUnit.test("configureUI5DateTimeFormat: calls UI5 correctly " + oFixture.testDescription, function (assert) {

            //Arrange
            var oUshellConfig = {
                services: {
                    Container: {
                        adapter: {
                            config: {
                                userProfile : oFixture.userProfile
                            }
                        }
                    }
                }
            }

            sinon.stub(jQuery.sap.log, "error");

            var spyDate = sinon.spy(this.oFormatSettings, "setLegacyDateFormat");

            var spyTime = sinon.spy(this.oFormatSettings, "setLegacyTimeFormat");

            //  regexp is used because the error messasge contains the given
            //errorstring and concatenated to it
            //  there is the ui5 error
            var rDate = new RegExp(oFixture.sExpectedErrorMessageDate);
            var rTime = new RegExp(oFixture.sExpectedErrorMessageTime);

            //Act
            fnConfigureUI5DateTimeFormat(oUshellConfig);

            //Assert
            if (oFixture.sExpectedErrorMessageDate && oFixture.sExpectedErrorMessageTime) {
                assert.equal(jQuery.sap.log.error.callCount, 2,
                    "jQuery.sap.log.error called twice as expected");

                assert.ok(rDate.test(jQuery.sap.log.error.getCall(0).args[0]),
                    "jQuery.sap.log.error was called with the expected error message for date");
                assert.ok(rTime.test(jQuery.sap.log.error.getCall(1).args[0]),
                    "jQuery.sap.log.error was called with the expected error message for time");

            } else if (oFixture.sExpectedErrorMessageDate) {
                assert.equal(jQuery.sap.log.error.callCount, 1,
                    "jQuery.sap.log.error called once as expected");
                assert.ok(rDate.test(jQuery.sap.log.error.getCall(0).args[0]),
                    "jQuery.sap.log.error was called with the expected error message for date");

            } else if (oFixture.sExpectedErrorMessageTime) {
                assert.equal(jQuery.sap.log.error.callCount, 1,
                    "jQuery.sap.log.error called once as expected");
                assert.ok(rTime.test(jQuery.sap.log.error.getCall(0).args[0]),
                    "jQuery.sap.log.error was called with the expected error message for time");
            }
            assert.ok(spyDate.calledWith(oFixture.userProfile && oFixture.userProfile.defaults.sapDateFormat), "Date format is set");
            assert.ok(spyTime.calledWith(oFixture.userProfile && oFixture.userProfile.defaults.sapTimeFormat), "Time format is set");
        });
    });

    [
        {
            testDescription: "when the date and time format is correct but old template is used",
            sDateFormat: "1",
            sTimeFormat: "1"
        }
    ].forEach(function (oFixture) {
        QUnit.test("configureUI5DateTimeFormat: calls UI5 correctly " + oFixture.testDescription, function (assert) {

            //Arrange
            var oUshellConfig = {
                services: {
                    Container: {
                        adapter: {
                            config: {
                                userProfile:
                                {
                                    defaults: {
                                        dateFormat: oFixture.sDateFormat,
                                        timeFormat: oFixture.sTimeFormat
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var bExceptionThrown  = false;
            //Act
            try {
                fnConfigureUI5DateTimeFormat(oUshellConfig);
            } catch (exc) {
                 //Assert
                bExceptionThrown = true;

            }
            //Assert
            assert.ok(!bExceptionThrown , "No exception was thrown");
        });
    });

});
