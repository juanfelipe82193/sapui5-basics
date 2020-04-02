// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's InboundList
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/ParameterMapping"
], function (oParameterMapping) {
    "use strict";

    /* global QUnit sinon */

    [{
        testDescription: " no parameters in mapping",
        oMatchingTarget: {
            "intentParamsPlusAllDefaults": {},
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo": "P3ren",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget: {
            "intentParamsPlusAllDefaults": {},
            "mappedIntentParamsPlusSimpleDefaults": {},
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo": "P3ren",
                            "required": true
                        }
                    }
                }
            }
        }
    }, {
        testDescription: " rename rule but no value, object removed",
        oMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P4": {},
                "P2": ["1000"],
                "sap-system": ["AX1"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo": "P1ren",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P4": {},
                "P2": ["1000"],
                "sap-system": ["AX1"]
            },
            "mappedIntentParamsPlusSimpleDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": ["1000"],
                "sap-system": ["AX1"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "required": true
                        },
                        "P3": {
                            "renameTo": "P1ren",
                            "required": true
                        }
                    }
                }
            }
        }
    }, {
        testDescription: " rename rule but complex value thus no rename, sap-system renamed",
        oMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": {
                    "extended": 1
                },
                "P2": ["1000"],
                "sap-system": ["AX1"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "ParamName2": {
                            "required": true
                        },
                        "sap-system": {
                            "renameTo": "MyCorpSystem"
                        },
                        "P1": {
                            "renameTo": "P1ren",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": {
                    "extended": 1
                },
                "P2": ["1000"],
                "sap-system": ["AX1"]
            },
            "mappedIntentParamsPlusSimpleDefaults": {
                "P2": ["1000"],
                "MyCorpSystem": ["AX1"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "ParamName2": {
                            "required": true
                        },
                        "sap-system": {
                            "renameTo": "MyCorpSystem"
                        },
                        "P1": {
                            "renameTo": "P1ren",
                            "required": true
                        }
                    }
                }
            }
        }
    }, {
        testDescription: " rename rule with collision of parameters in target",
        oMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["1000"],
                "P2": ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults": {
                "Ptarget": ["2000"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo": "Ptarget",
                            "required": true
                        },
                        "P2": {
                            "renameTo": "Ptarget",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["1000"],
                "P2": ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults": {
                "Ptarget": ["1000"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo": "Ptarget",
                            "required": true
                        },
                        "P2": {
                            "renameTo": "Ptarget",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedErrorLog: "collision of values during parameter mapping : \"P2\" -> \"Ptarget\""
    }, {
        testDescription: " rename rule with clobbering P1 -> P2",
        oMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["1000"],
                "P2": ["2000"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo": "P2",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["1000"],
                "P2": ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults": {
                "P2": ["1000"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": {
                            "renameTo": "P2",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedErrorLog: "collision of values during parameter mapping : \"P2\" -> \"P2\""
    }, {
        testDescription: " rename rule with clobbering P2 -> P1",
        oMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["1000"],
                "P2": ["2000"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "renameTo": "P1",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedMatchingTarget: {
            "intentParamsPlusAllDefaults": {
                "P1": ["1000"],
                "P2": ["2000"]
            },
            "mappedIntentParamsPlusSimpleDefaults": {
                "P1": ["1000"]
            },
            "inbound": {
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P2": {
                            "renameTo": "P1",
                            "required": true
                        }
                    }
                }
            }
        },
        expectedErrorLog: "collision of values during parameter mapping : \"P2\" -> \"P1\""
    }].forEach(function (oFixture) {
        QUnit.test("mapParameterNamesAndRemoveObjects when " + oFixture.testDescription, function (assert) {
            var oErrorLog = sinon.stub(jQuery.sap.log, "error");
            oParameterMapping.mapParameterNamesAndRemoveObjects(oFixture.oMatchingTarget);
            assert.deepEqual(oFixture.oMatchingTarget, oFixture.expectedMatchingTarget, "renamed paramter ok");
            if (oFixture.expectedErrorLog) {
                assert.ok(oErrorLog.calledWith(oFixture.expectedErrorLog), " error log was called");
            } else {
                assert.equal(oErrorLog.callCount, 0, "error log not called");
            }
            jQuery.sap.log.error.restore();
        });
    });

    [{
        testDescription: " trivial no rename",
        sParamName: "P1",
        oValue: ["P1V"],
        "intentParamsPlusAllDefaults": {
            "P1": ["PV1", "PV2"],
            "P2": ["1000"],
            "sap-system": ["AX1"]
        },
        "oSignature": {
            "additionalParameters": "ignored",
            "parameters": {
                "ParamName2": {
                    "required": true
                }
            }
        },
        expectedResult: "P1"
    }, {
        testDescription: " normal rename",
        sParamName: "P1",
        oValue: ["Pv1"],
        "oSignature": {
            "additionalParameters": "ignored",
            "parameters": {
                "ParamName2": {
                    "required": true
                },
                "P1": {
                    "renameTo": "P1ren",
                    "required": true
                }
            }
        },
        expectedResult: "P1ren"
    }, {
        testDescription: " no rename because complex value",
        sParamName: "P1",
        oValue: {},
        "oSignature": {
            "additionalParameters": "ignored",
            "parameters": {
                "ParamName2": {
                    "required": true
                },
                "P1": {
                    "renameTo": "P1ren",
                    "required": true
                }
            }
        },
        expectedResult: "P1"
    }].forEach(function (oFixture) {
        QUnit.test("getRenameParameterName when " + oFixture.testDescription, function (assert) {
            var sExpectedResult = oParameterMapping.getRenameParameterName(oFixture.sParamName, oFixture.oSignature, oFixture.oValue);
            assert.equal(sExpectedResult, oFixture.expectedResult, "parameter was renamed");
        });
    });
});
