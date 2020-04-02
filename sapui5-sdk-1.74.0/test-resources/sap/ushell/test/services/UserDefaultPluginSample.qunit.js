
// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * This unit test is only to test the correctness of the interface contracts and not to verify
 * the functional correctness of the implementation of the sample plugin.
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, module, ok, start, stop, jQuery, sap,
     strictEqual, sinon */

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.test.demoapps.UserDefaultPluginSample.Component");
    jQuery.sap.require("sap.ushell.test.demoapps.UserDefaultTestPlugin.Component");

    var oTestPlugin,
        oPlugin,

        oFooValue = {
            "value": "bar",
            "random": "parameter"
        },
        oFooFooValue = {
            "value": "barbar",
            "random": "parameter"
        },
        oComponentData = {
            "config": {
                "foo": JSON.stringify(oFooValue),
                "foofoo": JSON.stringify(oFooFooValue)
            }
        };

    module("sap.ushell.demo.UserDefaultPluginSample", {
    setup: function () {
        var oComponentData = {};
        sap.ushell.bootstrap("local");
        // prepare test plugin
        oPlugin = sap.ui.component({
            name: "sap.ushell.demo.UserDefaultPluginSample",
            componentData: oComponentData
        });
    },
    teardown: function () {
        sap.ushell.test.restoreSpies(
                sap.ushell.demo.__UserDefaultPluginSample__._retrieveUserDefaults
        );
        delete sap.ushell.Container;
    }
    });

    asyncTest("getUserDefault: read value UshellTest1 with undefined oCurrentParameter set", function () {

        oPlugin.getUserDefault("UshellTest1", { value : undefined })
        .done(function (oReturnedParameter) {
            start(1);
            deepEqual(oReturnedParameter, {
                "value": "InitialFromPlugin"
            }, "correct value returned");
        })
        .fail(function () {
            start(1);
            ok(false, "Promise was supposed to succeed!");
        });
    });

    asyncTest("getUserDefault: read value UshellTest1  with undefined oCurrentParameter set", function () {
        oPlugin.getUserDefault("UshellTest1", { value : "set"})
            .done(function (oReturnedParameter) {
                start(1);
                deepEqual(oReturnedParameter, {
                    "value": "set"
                }, "correct value returned");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("getUserDefault: read value UshellSamplePlant without oCurrentParameter set", function () {
        oPlugin.getUserDefault("UshellSamplePlant", { value : undefined})
            .done(function (oReturnedParameter) {
                start(1);
                deepEqual(oReturnedParameter, {
                    "value": "Plant1000",
                    "noStore": true,
                    "noEdit": true
                }, "correct value returned");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("getUserDefault: read value Plant with oCurrentParameter set", function () {
        oPlugin.getUserDefault("UshellSamplePlant", { value : "AAA" })
            .done(function (oReturnedParameter) {
                start(1);
                deepEqual(oReturnedParameter, {
                    "value": "AAA"
                }, "Object has been altered correctly!");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("getUserDefault: read value not_a_value", function () {
        oPlugin.getUserDefault("not_a_value")
            .done(function (sUserDefaultValue) {
                start();
                equal(sUserDefaultValue, undefined,"correct arg");
                ok(true, "Promise was supposed to be ok");
            })
            .fail(function (sMessage) {
                start();
                ok(false, "Promise failed!");
            });
    });

    asyncTest("getUserDefault: value multiple times without waiting - plugin mustn't retrieve data more than once", function () {
        var iPromiseCount = 2,
            oSpy = sinon.spy(sap.ushell.demo.__UserDefaultPluginSample__, "_retrieveUserDefaults");

        // we're expecting three starts - makes two stops here and one in asyncTest function call
        stop(2);

        function fnCheckTheSpy() {
            iPromiseCount -= 1;
            if (iPromiseCount <= 0) {
                start(1);
                strictEqual(oSpy.getCalls().length, 1, "The function retrieveUserDefault was called exactly once.");
            }
        }

        oPlugin.getUserDefault("UshellTest1")
            .done(function (oReturnedParameter) {
                start(1);
                deepEqual(oReturnedParameter, {
                    "value": "InitialFromPlugin"
                }, "correct value returned");
            })
            .done(fnCheckTheSpy)
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });

        oPlugin.getUserDefault("UshellSampleCompanyCode")
            .done(function (oReturnedParameter) {
                start(1);
                deepEqual(oReturnedParameter, {
                    "value": "0815"
                }, "correct value returned");
            })
            .done(fnCheckTheSpy)
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });


    asyncTest("getEditorMetadata: read value UshellTest1  with undefined oCurrentParameter set", function () {
        oPlugin.getEditorMetadata({ "UshellTest1" : {}, "UshellSamplePlant": { editorMetadata : { "lost": "inTranslation"}}, "NotKnownByPlugin" : {},
            "NotKnownFilled" : { editorMetaData : { "displayText" : "AAA"}}}).done(function (oReturnedParameter) {
                start();
                deepEqual(oReturnedParameter, {
                    "NotKnownFilled": {
                        "editorMetaData": {
                          "displayText": "AAA"
                        }
                      },
                      "NotKnownByPlugin": {},
                      "UshellSamplePlant": {
                          "editorMetadata": {
                              "description": "This is the plant code",
                              "displayText": "Plant",
                              "editorInfo": {
                                  "entityName": "Defaultparameter",
                                  "bindingPath": "/Defaultparameters('MM')",
                                  "odataURL": "/sap/opu/odata/sap/ZMM_USER_DEFAULTPARAMETER_SRV",
                                  "propertyName": "Plant"
                              },
                              "groupId": "SamplePlugin-GRP2",
                              "groupTitle": "UserDefaultSamplePlugin group2",
                              "parameterIndex": 1
                          }
                      },
                      "UshellTest1": {
                        "editorMetadata": {
                          "description": "Description of the test default 1",
                          "displayText": "Test Default 1",
                          "groupId": "EXAMPLE-FIN-GRP1",
                          "groupTitle": "FIN User Defaults (UShell examples)",
                          "parameterIndex" : 1
                        }
                      }
                    }, "correct value returned");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });



    module("sap.ushell.demo.UserDefaultTestPlugin", {
        setup: function () {
//            var oComponentData = {};
//            sap.ushell.bootstrap("local");
            // prepare test plugin
            oTestPlugin = sap.ui.component({
                name: "sap.ushell.demo.UserDefaultTestPlugin",
                componentData: oComponentData
            });
        },
        teardown: function () {
            sap.ushell.test.restoreSpies(
            );
            delete sap.ushell.Container;
        }
    });

    asyncTest("TestPlugin.getUserDefault: read value foo without oCurrentParameter set", function () {

        oTestPlugin.getUserDefault("foo")
            .done(function (oReturnedParameter) {
                start(1);
                deepEqual(oReturnedParameter, oFooValue, "Object has been retrieved correctly!");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("TestPlugin.getUserDefault: read value foo with oCurrentParameter set", function () {

        var oCurrentParameter = {
                "random": "overwrite_me",
                "param": "do_NOT_overwrite_me"
            },
            oExpectedParameter = jQuery.extend({}, oCurrentParameter);

        oExpectedParameter.value = oFooValue.value;
        oExpectedParameter.random = oFooValue.random;

        oTestPlugin.getUserDefault("foo", oCurrentParameter)

            .done(function (oReturnedParameter) {
                start(1);
                deepEqual(oReturnedParameter, oExpectedParameter, "Object has been altered correctly!");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("TestPlugin.getUserDefault: read value not_a_value", function () {

        oTestPlugin.getUserDefault("not_a_value")
            .done(function (oReturnedParameter) {
                start(1);
                ok(true, "Promise was supposed to succeed!");
            })
            .fail(function (sMessage) {
                start(1);
                ok(false, "Promise failed!");
            });
    });

    asyncTest("TestPlugin.persistNewDefaultValues: persist an exisiting user default value", function () {

        var oNewDefaultValue = {
                "foo": {
                    "value": "new_foo"
                }
            };

        oTestPlugin.persistNewDefaultValues(oNewDefaultValue)
            .done(function (oParameterList) {
                start(1);
                deepEqual(oParameterList, oNewDefaultValue, "The entry has been persisted successfully!");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("TestPlugin.persistNewDefaultValues: persist non-exisitng user default value", function () {

        var oNewDefaultValue = {
                "no_foo": {
                    "value": "new_foo"
                }
            },
            oExpectedValue = jQuery.extend({}, oNewDefaultValue);

        delete oExpectedValue.no_foo;

        oTestPlugin.persistNewDefaultValues(oNewDefaultValue)
            .done(function (oParameterList) {
                start(1);
                deepEqual(oParameterList, oExpectedValue, "Parameter list as expected!");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("TestPlugin.persistNewDefaultValues: persist one existing and one non-existing value", function () {

        var oNewDefaultValue = {
                "foo": {
                    "value": "new_foo"
                },
                "no_foo": {
                    "value": "new_foo"
                }
            };

        oTestPlugin.persistNewDefaultValues(oNewDefaultValue)
            .done(function (oParameterList) {
                start(1);
                delete oNewDefaultValue.no_foo;
                deepEqual(oParameterList, oNewDefaultValue, "The entry has been persisted successfully!");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });

    asyncTest("TestPlugin.persistNewDefaultValues: undefined as parameter", function () {
        oTestPlugin.persistNewDefaultValues(undefined)
            .done(function (oParameterList) {
                start(1);
                deepEqual(oParameterList, {}, "Empty parameter list, as expected!");
            })
            .fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
    });


    asyncTest("TestPlugin.persistNewDefaultValues: invalid data", function () {

        var oNewDefaultValue = {
                "foo": "bar_is_bad_here"
            };

        oTestPlugin.persistNewDefaultValues(oNewDefaultValue)
            .done(function (oParameterList) {
                start(1);
                ok(false, "Promise was supposed to fail!");
            })
            .fail(function (sMessage) {
                start(1);
                ok(true, "Promise failed!");
            });
    });


}());
