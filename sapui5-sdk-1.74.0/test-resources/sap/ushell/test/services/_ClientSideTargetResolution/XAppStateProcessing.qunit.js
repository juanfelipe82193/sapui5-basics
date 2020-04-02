// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._ClientSideTargetResolution.XAppStateProcessing
 */

sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/XAppStateProcessing",
    "sap/ui/generic/app/navigation/service/SelectionVariant",
    "sap/ushell/utils/clone"
],
function (oXAppStateProcessing, SelectionVariant, fnClone) {
    "use strict";

    /* global module test ok equal deepEqual strictEqual sinon asyncTest start */

    /*
     * Creates a fake app state service that returns the provided initial app
     * state data. These data can be modified based on what the consumer
     * of the service calls.
     */
    function createFakeAppStateService (oInitialAppStateData) {
        var oStoredAppStateData = oInitialAppStateData;
        var oNewFakeAppState = {
            _data: undefined, // simplyfies the test
            setData: function (oData) {
                oStoredAppStateData = oData;
            },
            getData: function () {
                return oStoredAppStateData;
            },
            save: function () {
                var oDeferred = new jQuery.Deferred();
                // resolve appstate object async
                setTimeout(function () {
                    oDeferred.resolve();
                }, 0);

                return oDeferred.promise();
            },
            getKey: function () {
                return "NEWKEY";
            }
        };

        function getFakeAppState (sKey) {
            var oDeferred = new jQuery.Deferred();

            // resolve appstate object async
            setTimeout(function () {
                // TODO test reject
                oDeferred.resolve({
                    getData: function () {
                        return oStoredAppStateData;
                    }
                });
            }, 0);

            return oDeferred.promise();
        }

        var oAppStateSrvc = {
            getAppState: getFakeAppState,
            createEmptyAppState: sinon.stub().returns(oNewFakeAppState)
        };

        return oAppStateSrvc;
    }

    module("sap.ushell.services.ClientSideTargetResolution.XAppStateProcessing", {
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        }
    });


    [ //mixAppStateIntoResolutionResultAndRename
        {
            description: "extendedDefaultParam in app state (parameters)",
            initialTarget: {
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "otherProperty": "foo", // keep unknown properties
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam": {
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"]
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam": {
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "A",
                                    "High": "Z"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "ABC",
                                    "High": null
                                }
                            ]
                        }
                    }
                }
            },
            initialAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "extendedDefaultParam",
                        "PropertyValue": "value1"
                    }]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                selectionVariant: {
                    Parameters: [{
                        "PropertyName": "extendedDefaultParam",
                        "PropertyValue": "value1"
                    }]
                }
            },
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        },
        {
            description: "no extendedDefaultParam in app state (root members do not count!)",
            initialTarget: {
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "otherProperty": "foo", // keep unknown properties
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam": {
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"]
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam": {
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "A",
                                    "High": "Z"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "ABC",
                                    "High": null
                                }
                            ]
                        }
                    }
                }
            },
            initialAppStateData: {
                "extendedDefaultParam": "value1"
            },
            newAppStateCreated: true,
            expectedAppStateData: {
                "extendedDefaultParam": "value1",
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [],
                    "SelectOptions": [{
                        "PropertyName": "extendedDefaultParam",
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            expectedDefaultedParamNames: ["extendedDefaultParam"],
            expectedMappedDefaultedParamNames: ["extendedDefaultParam"]
        },
        {
            description: "extendedDefaultParam in app state (selectionVariant.Parameters)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam": {
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"]
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam": {
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "A",
                                    "High": "Z"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "ABC",
                                    "High": null
                                }
                            ]
                        }
                    }
                }
            },
            initialAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "Parameters": [{
                        "PropertyName": "extendedDefaultParam",
                        "PropertyValue": "appStateValue"
                    }]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "Parameters": [{
                        "PropertyName": "extendedDefaultParam",
                        "PropertyValue": "appStateValue"
                    }]
                }
            },
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        },
        {
            description: "extendedDefaultParam in app state 1 (selectionVariant.SelectOptions)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam": {
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam": {
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "A",
                                    "High": "Z"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "ABC",
                                    "High": null
                                }
                            ]
                        }
                    }
                }
            },
            initialAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "SelectOptions": [{
                        "PropertyName": "extendedDefaultParam",
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "1",
                                "High": "9"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "123",
                                "High": null
                            }
                        ]
                    }]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "SelectOptions": [{
                        "PropertyName": "extendedDefaultParam",
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "1",
                                "High": "9"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "123",
                                "High": null
                            }
                        ]
                    }]
                }
            },
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        },
        {
            description: "extendedDefaultParam in app state 2  (selectionVariant.SelectOptions)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam": {
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam": {
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "A",
                                    "High": "Z"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "ABC",
                                    "High": null
                                }
                            ]
                        }
                    }
                }
            },
            initialAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "SelectOptions": [{
                        "PropertyName": "extendedDefaultParam",
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "1",
                                "High": "9"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "123",
                                "High": null
                            }
                        ]
                    }]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "SelectOptions": [{
                        "PropertyName": "extendedDefaultParam",
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "1",
                                "High": "9"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "123",
                                "High": null
                            }
                        ]
                    }]
                }
            },
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        },
        {
            description: "app state present, but no user default values maintained",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": [], // if no value is found, this array is empty!
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"]
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {}
                }
            },
            initialAppStateData: {
                "param1": "value1"
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1"
            },
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        },
        {
            description: "existing app state (combined) not overwritten",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam1": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            },
                            "extendedDefaultParam2": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            },
                            "extendedDefaultParam3": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam1", "extendedDefaultParam2", "extendedDefaultParam3"],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam1": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    },
                    "extendedDefaultParam2": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    },
                    "extendedDefaultParam3": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    }
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam1": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        },
                        "extendedDefaultParam2": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        },
                        "extendedDefaultParam3": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        }
                    }
                }
            },
            initialAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "Parameters": [{
                            "PropertyName": "extendedDefaultParam2",
                            "PropertyValue": "appStateValue2"
                        },
                        {
                            "PropertyName": "param2",
                            "PropertyValue": "value2"
                        }
                    ],
                    "SelectOptions": [{
                            "PropertyName": "extendedDefaultParam1",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "1",
                                    "High": "9"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "123",
                                    "High": null
                                }
                            ]
                        },
                        {
                            "PropertyName": "extendedDefaultParam3",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "1",
                                    "High": "9"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "123",
                                    "High": null
                                }
                            ]
                        },
                        {
                            "PropertyName": "value3",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "100",
                                    "High": "900"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "1234",
                                    "High": null
                                }
                            ]
                        }
                    ]
                }
            },
            newAppStateCreated: false,
            expectedAppStateData: {
                "param1": "value1",
                "extendedDefaultParam1": "appStateValue1",
                "selectionVariant": {
                    "Parameters": [{
                            "PropertyName": "extendedDefaultParam2",
                            "PropertyValue": "appStateValue2"
                        },
                        {
                            "PropertyName": "param2",
                            "PropertyValue": "value2"
                        }
                    ],
                    "SelectOptions": [{
                            "PropertyName": "extendedDefaultParam1",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "1",
                                    "High": "9"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "123",
                                    "High": null
                                }
                            ]
                        },
                        {
                            "PropertyName": "extendedDefaultParam3",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "1",
                                    "High": "9"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "123",
                                    "High": null
                                }
                            ]
                        },
                        {
                            "PropertyName": "value3",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "100",
                                    "High": "900"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "1234",
                                    "High": null
                                }
                            ]
                        }
                    ]
                }
            },
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        },
        {
            description: "existing app state with undefined content (e.g. expired or could not be retrieved)",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam1": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam1"],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam1": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"]
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam1": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        }
                    }
                }
            },
            initialAppStateData: undefined,
            newAppStateCreated: true,
            expectedAppStateData: {
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [],
                    "SelectOptions": [{
                        "PropertyName": "extendedDefaultParam1",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    }],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            expectedDefaultedParamNames: ["extendedDefaultParam1"],
            expectedMappedDefaultedParamNames: ["extendedDefaultParam1"]
        },
        {
            description: "existing app state (combined) merged with defaults",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam1": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            },
                            "extendedDefaultParam2": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            },
                            "extendedDefaultParam3": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam1", "extendedDefaultParam2", "extendedDefaultParam3"],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam1": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    },
                    "extendedDefaultParam2": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    },
                    "extendedDefaultParam3": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"]
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam1": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        },
                        "extendedDefaultParam2": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        },
                        "extendedDefaultParam3": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        }
                    }
                }
            },
            initialAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "Parameters": [{
                        "PropertyName": "param2",
                        "PropertyValue": "value2"
                    }],
                    "SelectOptions": [{
                            "PropertyName": "extendedDefaultParam1",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "1",
                                    "High": "9"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "123",
                                    "High": null
                                }
                            ]
                        },
                        {
                            "PropertyName": "value3",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "100",
                                    "High": "900"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "1234",
                                    "High": null
                                }
                            ]
                        }
                    ]
                }
            },
            newAppStateCreated: true,
            expectedAppStateData: {
                "param1": "value1",
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [{
                        "PropertyName": "param2",
                        "PropertyValue": "value2"
                    }],
                    "SelectOptions": [{
                            "PropertyName": "extendedDefaultParam1",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "1",
                                    "High": "9"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "123",
                                    "High": null
                                }
                            ]
                        },
                        {
                            "PropertyName": "value3",
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "100",
                                    "High": "900"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "1234",
                                    "High": null
                                }
                            ]
                        },
                        {
                            "PropertyName": "extendedDefaultParam2",
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        },
                        {
                            "PropertyName": "extendedDefaultParam3",
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        }
                    ],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            expectedDefaultedParamNames: ["extendedDefaultParam2", "extendedDefaultParam3"],
            expectedMappedDefaultedParamNames: ["extendedDefaultParam2", "extendedDefaultParam3"]
        },
        {
            description: "no app state present",
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam"],
                "intentParamsPlusAllDefaults": {
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam": {
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "simpleDefaultParam": ["simpleValue"]
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam": {
                            "Ranges": [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "A",
                                    "High": "Z"
                                },
                                {
                                    "Sign": "I",
                                    "Option": "EQ",
                                    "Low": "ABC",
                                    "High": null
                                }
                            ]
                        }
                    }
                }
            },
            initialAppStateData: undefined,
            newAppStateCreated: true,
            expectedAppStateData: {
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [],
                    "SelectOptions": [{
                        "PropertyName": "extendedDefaultParam",
                        "Ranges": [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "A",
                                "High": "Z"
                            },
                            {
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }
                        ]
                    }],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            expectedDefaultedParamNames: ["extendedDefaultParam"],
            expectedMappedDefaultedParamNames: ["extendedDefaultParam"]
        },
        {
            description: "no app state and no user defaults present",
            defaultedParamNames: undefined, // not relevant
            initialTarget: {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": [], // if value is undefined, this is empty
                "intentParamsPlusAllDefaults": {},
                "mappedIntentParamsPlusSimpleDefaults": {},
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {}
                }
            },
            initialAppStateData: undefined,
            newAppStateCreated: false,
            expectedAppStateData: undefined,
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        }
    ].forEach(function (oFixture) {
        asyncTest("mixAppStateIntoResolutionResultAndRename with " + oFixture.description, function () {
            var oExpectedTarget = jQuery.extend(true, {}, oFixture.initialTarget);

            var oAppStateSrvc = createFakeAppStateService(oFixture.initialAppStateData);

            // initial and expected target do not differ very much
            if (oFixture.newAppStateCreated) {
                oExpectedTarget.intentParamsPlusAllDefaults["sap-xapp-state"] = ["NEWKEY"];
                oExpectedTarget.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"] = ["NEWKEY"];
            }
            oExpectedTarget.defaultedParamNames = oFixture.expectedDefaultedParamNames;
            oExpectedTarget.mappedDefaultedParamNames = oFixture.expectedMappedDefaultedParamNames;

            // mixAppStateIntoResolutionResultAndRename shall remove oNewAppStateMembers as it is not
            // needed afterwards anymore
            delete oExpectedTarget.resolutionResult.oNewAppStateMembers;
            oExpectedTarget.mappedDefaultedParamNames = oExpectedTarget.defaultedParamNames;

            oXAppStateProcessing.mixAppStateIntoResolutionResultAndRename(oFixture.initialTarget, oAppStateSrvc)
                .done(function (oMatchingTarget) {
                    start();
                    if (oAppStateSrvc.createEmptyAppState.called) {
                        oAppStateSrvc.createEmptyAppState.args.forEach(function (a, index) {
                            equal(a[1], true, "createEmptyAppState invoked as transient true");
                        });
                    }
                    deepEqual(oMatchingTarget, oExpectedTarget, "modified target");
                    if (oFixture.newAppStateCreated) {
                        oAppStateSrvc.getAppState().done(function (oNewAppState) {
                            var oNewAppStateData = oNewAppState.getData();
                            deepEqual(oNewAppStateData, oFixture.expectedAppStateData,
                                "new app state data as expected");
                            deepEqual(oNewAppStateData.selectionVariant.SelectOptions,
                                oFixture.expectedAppStateData.selectionVariant.SelectOptions,
                                "For better debugging: compare SelectOptions again");
                        });
                    } else {
                        ok(oAppStateSrvc.createEmptyAppState.notCalled, "No app state created");
                    }
                })
                .fail(function (sMsg) {
                    start();
                    ok(false, sMsg);
                });
        });
    });

    // unmergable app-state content leads to non-tampering with it.
    [{
            "content": [],
            "description": "content is array"
        },
        {
            "content": 1234,
            "description": "content is integer"
        },
        {
            "content": "astring",
            "description": "content is string"
        }
    ].forEach(function (oFixture1) {
        [{
            "description": "app state merged with " + oFixture1.description,
            "initialTarget": {
                "otherProperty": "foo", // keep unknown properties
                "inbound": {
                    "signature": {
                        "parameters": {
                            "extendedDefaultParam1": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            },
                            "extendedDefaultParam2": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            },
                            "extendedDefaultParam3": {
                                "defaultValue": {
                                    "value": "UserDefault.extended.extendedDefaultParam",
                                    "format": "reference"
                                }
                            }
                        }
                    }
                },
                "defaultedParamNames": ["extendedDefaultParam1", "extendedDefaultParam2", "extendedDefaultParam3"],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"],
                    "extendedDefaultParam1": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    },
                    "extendedDefaultParam2": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    },
                    "extendedDefaultParam3": {
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "ABC",
                            "High": null
                        }]
                    }
                },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["EXSISTINGKEY"],
                    "simpleDefaultParam": ["simpleValue"]
                },
                "resolutionResult": {
                    "otherProperty": "foo", // keep unknown properties
                    "oNewAppStateMembers": {
                        "extendedDefaultParam1": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        },
                        "extendedDefaultParam2": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        },
                        "extendedDefaultParam3": {
                            "Ranges": [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "ABC",
                                "High": null
                            }]
                        }
                    }
                }
            },
            initialAppStateData: oFixture1.content,
            newAppStateCreated: false,
            expectedAppStateData: oFixture1.content,
            expectedDefaultedParamNames: [],
            expectedMappedDefaultedParamNames: []
        }].forEach(function (oFixture) {
            asyncTest("mixAppStateIntoResolutionResultAndRename with corrupt appstate (resuse old appstate)" + oFixture.description, function () {
                var oExpectedTarget = jQuery.extend(true, {}, oFixture.initialTarget);

                var oAppStateSrvc = createFakeAppStateService(oFixture.initialAppStateData);

                // initial and expected target do not differ very much
                if (oFixture.newAppStateCreated) {
                    oExpectedTarget.intentParamsPlusAllDefaults["sap-xapp-state"] = ["NEWKEY"];
                    oExpectedTarget.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"] = ["NEWKEY"];
                }
                oExpectedTarget.defaultedParamNames = oFixture.expectedDefaultedParamNames;
                oExpectedTarget.mappedDefaultedParamNames = oFixture.expectedMappedDefaultedParamNames;

                // mixAppStateIntoResolutionResultAndRename shall remove oNewAppStateMembers as it is not
                // needed afterwards anymore
                delete oExpectedTarget.resolutionResult.oNewAppStateMembers;
                oExpectedTarget.mappedDefaultedParamNames = oExpectedTarget.defaultedParamNames;

                oXAppStateProcessing.mixAppStateIntoResolutionResultAndRename(oFixture.initialTarget, oAppStateSrvc)
                    .done(function (oMatchingTarget) {
                        start();
                        ok(true, "expected rejection");
                        deepEqual(oMatchingTarget, oExpectedTarget, "modified target");
                        if (oFixture.newAppStateCreated) {
                            oAppStateSrvc.getAppState().done(function (oNewAppState) {
                                var oNewAppStateData = oNewAppState.getData();
                                deepEqual(oNewAppStateData, oFixture.expectedAppStateData,
                                    "new app state data as expected");
                                deepEqual(oNewAppStateData.selectionVariant.SelectOptions,
                                    oFixture.expectedAppStateData.selectionVariant.SelectOptions,
                                    "For better debugging: compare SelectOptions again");
                            });
                        } else {
                            ok(oAppStateSrvc.createEmptyAppState.notCalled, "No app state created");
                        }
                    })
                    .fail(function (sMsg) {
                        start();
                        ok(false, sMsg);
                        deepEqual(sMsg, "bad application state content", "x");
                    });
            });
        });
    });

    [{
            "description": "renameTo present",
            oMatchingTarget: {
                "inbound": {
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": {
                                "required": true
                            },
                            "P2": {
                                "renameTo": "P3",
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedResult: true
        },
        {
            "description": "renameTo not present",
            oMatchingTarget: {
                "inbound": {
                    "signature": {
                        "parameters": {
                            "P2": {
                                "required": true
                            }
                        }
                    }
                }
            },
            expectedResult: false
        }
    ].forEach(function (oFixture) {
        test("_hasRenameTo when " + oFixture.testDescription, function () {
            var bRes = oXAppStateProcessing._hasRenameTo(oFixture.oMatchingTarget);
            strictEqual(bRes, oFixture.expectedResult, " determination ok");
        });
    });

    [
        {
            testDescription: " no renaming, no appstate or complex parameters",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": { },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {},
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "P2": ["1000"],
                    "sap-system": ["AX1"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { },
                            "P2": { }
                        }
                    }
                }
            },
            expectedAppStateKey: undefined,
            expectedIntentParamsPlusAllDefaults: {
                "P1": ["PV1", "PV2"],
                "P2": ["1000"],
                "sap-system": ["AX1"]
            },
            expectedMappedDefaultedParamNames: ["P2"]
        },
        {
            testDescription: " new appstate creation",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {},
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "PX" },
                            "P2": { "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "Parameters": [],
                    "SelectOptions": [
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "4000",
                                            "High": null
                                        }
                                        ]
                         }
                    ],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    }
                }
            },
            expectedMappedDefaultedParamNames: ["P2"]
        },
        {
            testDescription: " modifying and merging into an existing appstate",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored", // NOTE: ignored...
                        "parameters": {
                            "P1": { "renameTo": "PX" },
                            "P2": { "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P3", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "POLD",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                         ]}
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ /* no P3 -> ignored additional parameters */ ],
                    SelectOptions:
                        [
                         // no POLD -> ignored additional parameters
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "4000",
                                            "High": null
                                        }
                                        ]
                         }
                    ]}
            },
            expectedMappedDefaultedParamNames: ["P2"]
        },
        {
            testDescription: " no merging because of presence in appstate in select option",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P4": { },
                            "P2": { "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [{
                        "PropertyName": "P3",
                        "PropertyValue": "P3Value"
                    }],
                    SelectOptions: [{
                        "PropertyName": "P2",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "OLD",
                            "High": null
                        }]
                    }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [],
                    SelectOptions: [{
                        "PropertyName": "P2",
                        "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "OLD",
                            "High": null
                        }]
                    }]
                }
            }
        },
        {
            testDescription: " no merging because of presence in appstate in select option via domination!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "PX" },
                            "P2": { "renameTo": "PX", "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P3", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P1",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                         ]}
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ /* no P3 -> ignored additional parameters! */ ],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "PX",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                    ]}
            }
        },
        {
            testDescription: " partially no merging because of presence in appstate in select option!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P1": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "1111",
                            "High": null
                        }] },
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P1", "P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }]
                    },
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }]
                    }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { },
                            "P2": { "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }]
                },
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }]
                },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P3", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [ {
                            "PropertyName": "P2",
                            "Ranges": [
                                       {
                                           "Sign": "I",
                                           "Option": "LT",
                                           "Low": "2222",
                                           "High": null
                                       }
                                       ]
                        }
                         ]}
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ /* no P3 -> ignored additional parameters */ ],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "2222",
                                            "High": null
                                        }
                                        ]
                         },
                         {
                             "PropertyName": "P1",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "LT",
                                            "Low": "1111",
                                            "High": null
                                        }
                                        ]
                         }
                    ]}
            },
            expectedMappedDefaultedParamNames: ["P1"]
        },
        {
            testDescription: " no merging because of presence in appstate in parameter!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { },
                            "P2": { "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASOLD" ]
            },
            expectedAppStateKey: "ASOLD",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P2", "PropertyValue": "P2Value" }]
                }
            },
            expectedAppStateData: undefined // No app state was generated
        },
        {
            testDescription: " no merging because of presence in appstate in parameter, but renaming",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "PX" },
                            "P2": { "renameTo": "P2New", "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} },
                            "P3": { "renameTo": "P3New" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "PU", "PropertyValue": "PUValue" },
                                   { "PropertyName": "P3", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ /* no PU -> ignored additional parameters! */
                                   { "PropertyName": "P3New", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2New",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedMappedDefaultedParamNames: []
        },
        {
            testDescription: " but plain renaming!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "PX" },
                            "P2": { "renameTo": "P2New", "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} },
                            "P3": { "renameTo": "P3New" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "PU", "PropertyValue": "PUValue" },
                                   { "PropertyName": "P3", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ /* no PU -> additional parameters ignored! */
                                   { "PropertyName": "P3New", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2New",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            }
        },
        {
            testDescription: "  plain renaming if irrelevant does not trigger new AppState!",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {
                            "P6": { "renameTo": "P7" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASOLD" ]
            },
            expectedAppStateKey: "ASOLD",
            oOldAppStateData: {
                selectionVariant: {"ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "PU", "PropertyValue": "PUValue" },
                                   { "PropertyName": "P3", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "PU", "PropertyValue": "PUValue" },
                                   { "PropertyName": "P3", "PropertyValue": "P3Value" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedMappedDefaultedParamNames: []
        },
        {
            testDescription: " no merging because of presence in appstate in parameter, but renaming with collisions",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {
                            "P1": { "renameTo": "PU" },
                            "P2": { "renameTo": "PU", "defaultValue": { "value": "UserDefault.extended.PX", format: "reference"} },
                            "P3": { "renameTo": "PU" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": ["ASOLD"]
            },
            expectedAppStateKey: "ASOLD",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "PU", "PropertyValue": "1" },
                                   { "PropertyName": "P3", "PropertyValue": "2" }],
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P2",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "OLD",
                                            "High": null
                                        }
                                        ]
                         }
                     ]
                }
            },
            expectedAppStateData: undefined, // No app state was generated
//                selectionVariant: {
//                    "ODataFilterExpression" : "",
//                    "SelectionVariantID" : "",
//                    "Text" : "Selection Variant with ID ",
//                    "Version" : {
//                        "Major" : "1",
//                        "Minor" : "0",
//                        "Patch" : "0"
//                    },
//                    Parameters : [ { "PropertyName" : "PU", "PropertyValue" : "1" }]
//                    SelectOptions :
//                        [
//                         {
//                             "PropertyName" : "PU",
//                             "Ranges": [
//                                        {
//                                            "Sign": "I",
//                                            "Option": "EQ",
//                                            "Low": "OLD",
//                                            "High": null
//                                        }
//                                        ]
//                         }
//                     ]
//                }
//            },
            expectedMappedDefaultedParamNames: []
        },
        {
            testDescription: "new app state returned when deleting parameters from old app state",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": { },
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "defaultedParamNames": [],
                "intentParamsPlusAllDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "PU" }
                        }
                    }
                }
            },
            expectedIntentParamsPlusAllDefaults: {
                "sap-xapp-state": ["ASNEW"]
            },
            expectedAppStateKey: "ASNEW", // because it changed
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "PU", "PropertyValue": "1" } ],
                    SelectOptions: [
                    ]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [],
                    SelectOptions: []
                }
            },
            expectedMappedDefaultedParamNames: []
        },
        {
            // TODO CHECK WHETHER we shoud sort !
            testDescription: " but renaming changes effective order",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames": ["P2", "P7"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"],
                    "P7New": ["1000"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] },
                    "P7": ["1000"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "P2" },
                            "P2": { "renameTo": "P1" },
                            "P7": { "renameTo": "P7New"}
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ],
                "P7": ["1000"] // renaming is elsewhere!
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P1", "PropertyValue": "1" },
                                   { "PropertyName": "P2", "PropertyValue": "2" }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "SelectOptions": [],
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P2", "PropertyValue": "1" },
                                   { "PropertyName": "P1", "PropertyValue": "2" }]
                }
            },
            expectedMappedDefaultedParamNames: ["P7New"]
        },
        {
            // TODO CHECK WHETHER we shoud sort !
            testDescription: "added and renamend one ",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "EQ",
                            "Low": "I2222T",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2", "P7"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"],
                    "P7New": ["1000"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "I2222T",
                        "High": null
                    }] },
                    "P7": ["1000"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "P2" },
                            "P2": { "renameTo": "P1" },
                            "P7": { "renameTo": "P7New"}
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "I2222T",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ],
                "P7": ["1000"] // renaming is elsewhere!
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P1", "PropertyValue": "1" },
                                   { "PropertyName": "P5", "PropertyValue": "2" }]
                }
            },
            expectedAppStateData: {
                selectionVariant: {
                    "ODataFilterExpression": "",
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                    Parameters: [ { "PropertyName": "P2", "PropertyValue": "1" } ], // no P5 because not in signature + ignored
                    SelectOptions:
                        [
                         {
                             "PropertyName": "P1",
                             "Ranges": [
                                        {
                                            "Sign": "I",
                                            "Option": "EQ",
                                            "Low": "I2222T",
                                            "High": null
                                        }
                                        ]
                         }
                         ]
                }
            },
            expectedMappedDefaultedParamNames: ["P1", "P7New"]
        },
        {
            testDescription: "  does not break non compliant appstates when inserting",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                    "oNewAppStateMembers": {
                        "P2": { "Ranges": [{
                            "Sign": "I",
                            "Option": "LT",
                            "Low": "4000",
                            "High": null
                        }] }
                    }
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"],
                    "P2": { "Ranges": [{
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": "INT",
                        "High": null
                    }] }
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "P2" },
                            "P2": { "renameTo": "P1" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": { "Ranges": [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "INT",
                    "High": null
                }] },
                "sap-xapp-state": [ "ASNEW" ]
            },
            expectedAppStateKey: "ASNEW",
            oOldAppStateData: {
                "here": {}
            },
            expectedAppStateData: {
                "here": {},
                "selectionVariant": {
                    "ODataFilterExpression": "",
                    "Parameters": [],
                    "SelectionVariantID": "",
                    "Text": "Selection Variant with ID ",
                    "Version": {
                        "Major": "1",
                        "Minor": "0",
                        "Patch": "0"
                    },
                  "SelectOptions": [
                    {
                      "PropertyName": "P1",
                      "Ranges": [{
                          "Sign": "I",
                          "Option": "LT",
                          "Low": "4000",
                          "High": null
                      }]
                    }
                  ]
                }
            }
        },
        {
            testDescription: "  does not break non compliant appstates when not changing",
            oMatchingTarget: {
                // ignore certain fields not needed for the test
                "matches": true,
                "resolutionResult": {
                },
                "defaultedParamNames": ["P2"],
                "mappedIntentParamsPlusSimpleDefaults": {
                    "sap-xapp-state": ["ASOLD"]
                },
                "intentParamsPlusAllDefaults": {
                    "P1": ["PV1", "PV2"],
                    "sap-xapp-state": ["ASOLD"]
                },
                "inbound": {
                    "title": "Currency manager (this one)",
                    "semanticObject": "Action",
"action": "action1",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager (ignored )", // ignored
                        "ui5ComponentName": "Currency.Component",
                        "url": "/url/to/currency"
                    },
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {
                            "P1": { "renameTo": "P2" },
                            "P2": { "renameTo": "P1" }
                        }
                    }
                }
            },
            "expectedIntentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "sap-xapp-state": [ "ASOLD" ]
            },
            expectedAppStateKey: "ASOLD",
            oOldAppStateData: {
                "here": {}
            },
            expectedAppStateData: {
                "here": {}
            }
        }
 ].forEach(function (oFixture) {
     asyncTest("mixAppStateIntoResolutionResultAndRename when " + oFixture.testDescription, function () {
         function FakeAppState (sKey, oData) {
             this.oData = oData;
             this.getKey = function () { return sKey; };
             this.getData = function () { return this.oData; };
             this.setData = function (oData) { this.oData = oData; };
             this.save = function () { return new jQuery.Deferred().resolve().promise(); };
         }
         function sortParametersByName (o1) {
             var p1 = jQuery.sap.getObject("selectionVariant.Parameters", undefined, o1);
             if (jQuery.isArray(p1)) {
                 o1.selectionVariant.Parameters = p1.sort(function (e1, e2) {
                     if (e1.PropertyName === e2.PropertyName) {
                         return 0;
                     }
                     if (e1.PropertyName < e2.PropertyName) {
                         return -1;
                     }
                     return 1;
                 });
             }
             return o1;
         }

         var oNewAppState = new FakeAppState("ASNEW", {});
         var oAppStateMock = {
                 getAppState: sinon.stub().returns(
                     new jQuery.Deferred().resolve(new FakeAppState("ASOLD", oFixture.oOldAppStateData)).promise()
                 ),
                 createEmptyAppState: sinon.stub().returns(
                     oNewAppState
                 )
//                 resolveHashFragmentFallback: function(oIntent, oMatchingTarget, oParameters) {
//                     return new jQuery.Deferred().resolve({ url : "fallback :-("  + JSON.stringify(oParameters).replace(/[\"]/g,"").replace(/\\/g,"") }).promise();
//                 }
             };

         // Act
         oXAppStateProcessing.mixAppStateIntoResolutionResultAndRename(oFixture.oMatchingTarget, oAppStateMock)
             .done(function (oMatchingTargetResult) {
                 // test the xapp-state key !
                 deepEqual(oMatchingTargetResult.intentParamsPlusAllDefaults["sap-xapp-state"], (oFixture.expectedAppStateKey ? [oFixture.expectedAppStateKey] : undefined), "new appstate key");
                 deepEqual(oMatchingTargetResult.mappedIntentParamsPlusSimpleDefaults["sap-xapp-state"], (oFixture.expectedAppStateKey ? [oFixture.expectedAppStateKey] : undefined), "new appstate key in simple defaults!");
                 deepEqual(oMatchingTargetResult.intentParamsPlusAllDefaults, oFixture.expectedIntentParamsPlusAllDefaults, "cleansed parameters ok");
                 if (oFixture.expectedAppStateData) {
                     deepEqual(sortParametersByName(oNewAppState.getData()), sortParametersByName(oFixture.expectedAppStateData), " appstate data correct");
                 }
                 if (oFixture.expectedMappedDefaultedParamNames) {
                     deepEqual(oMatchingTargetResult.mappedDefaultedParamNames, oFixture.expectedMappedDefaultedParamNames, "defaulted param names ok");
                 }
             })
             .fail(function () {
                 // Assert
                 ok(false, "promise was resolved");
             })
             .always(function () {
                 start();
             });
     });
 });
});
