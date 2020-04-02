// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's Formatter
 *
 * This test checks that there is a way to convert from input inbound objects
 * to strings and back.
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/Formatter",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (oFormatter, testUtils, utils) {
    "use strict";

    /* global QUnit */

    var Q = QUnit;

    Q.module("Formatter", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    [
        {
            oSignature: {
                parameters: {
                    p1: {
                    }
                },
                additionalParameters: "blahblah"
            },
            sSignature: "[p1:]<?>",
            testParse: false,
            testFormat: true // oSignature -> sSignature
        },
        {
            oSignature: {
                parameters: {},
                additionalParameters: "blahblah"
            },
            sSignature: "<no params><?>",
            testParse: false,
            testFormat: true // oSignature -> sSignature
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "val"
                        }
                    }
                }
            },
            sSignature: "[name:[val]]<?>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        filter: {
                            value: "val"
                        }
                    }
                }
            },
            sSignature: "[name:val]<?>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: true,
                        filter: {
                            value: "val1"
                        },
                        defaultValue: {
                            value: "val2"
                        }
                    }
                }
            },
            sSignature: "name:val1[val2]<?>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        filter: {
                            value: "(100|1000)",
                            format: "regexp"
                        }
                    }
                }
            },
            sSignature: "[name:/(100|1000)/]<?>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        filter: {
                            value: "UserDefault.currency",
                            format: "reference"
                        }
                    }
                }
            },
            sSignature: "[name:@UserDefault.currency@]<?>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: true,
                        filter: {
                            value: "UserDefault.currency",
                            format: "reference"
                        },
                        defaultValue: {
                            value: "UserDefault.type",
                            format: "reference"
                        }
                    }
                }
            },
            sSignature: "name:@UserDefault.currency@[@UserDefault.type@]<?>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "???"
                        }
                    }
                }
            },
            sSignature: "[name:[?Hi?]]<?>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "???"
                        }
                    }
                },
                additionalParameters: "allowed"
            },
            sSignature: "[name:[?Hi?]]<+>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "???"
                        }
                    }
                },
                additionalParameters: "ignored"
            },
            sSignature: "[name:[?Hi?]]<o>"
        },
        {
            oSignature: {
                parameters: {
                    name: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "???"
                        }
                    }
                },
                additionalParameters: "notallowed"
            },
            sSignature: "[name:[?Hi?]]<->"
        },
        {
            oSignature: {
                parameters: {},
                additionalParameters: "ignored"
            },
            sSignature: "<no params><o>"
        },
        {
            oSignature: {
                parameters: {
                    p1: {
                        required: false,
                        defaultValue: {
                            value: "Hi",
                            format: "reference"
                        }
                    },
                    p2: {
                        required: true,
                        filter: {
                            value: "Hello",
                            format: "regexp"
                        }
                    }
                },
                additionalParameters: "ignored"
            },
            sSignature: "[p1:[@Hi@]],p2:/Hello/<o>"
        },
        {
            oSignature: {
                parameters: {
                    ">>" : {
                        required: true,
                        filter: {
                            value: ">p1@:"
                        },
                        defaultValue: {
                            value: "H[i]",
                            format: "reference"
                        }
                    }
                },
                additionalParameters: "ignored"
            },
            sSignature: ">>:>p1@:[@H[i]@]<o>"
        },
        {
            oSignature: {
                parameters: {
                    p1: {
                        required: true,
                        filter: {
                            value: "v1"
                        }
                    },
                    p2: {
                        required: true,
                        filter: {
                            value: "v2"
                        }
                    }
                },
                additionalParameters: "ignored"
            },
            sSignature: "p1:v1,p2:v2<o>"
        },
        {
            oSignature: null,
            sSignature: "<no params><?>",
            testParse: false,
            testFormat: true // oSignature -> sSignature
        },
        {
            // oSignature: ... test undefined signature
            sSignature: "<no params><?>",
            testParse: false,
            testFormat: true // oSignature -> sSignature
        },
        {
            sSignature: "p1:[v1,v2]<o>",
            oSignature: {
                parameters: {
                    p1: {
                        required: true,
                        defaultValue: {
                            value:"v1,v2"
                        }
                    }
                },
                additionalParameters: "ignored"
            }
        }
    ].forEach(function (oFixture) {
        var bTestFormat = typeof oFixture.testFormat === "boolean"
            ? oFixture.testFormat
            : true;

        var bTestParse = typeof oFixture.testParse === "boolean"
            ? oFixture.testParse
            : true;

        // inbound -> string
        if (bTestFormat) {
            Q.test("formatInbound: can format #SO-action{" + oFixture.sSignature + "}", function (assert) {

                assert.strictEqual(oFormatter.formatInbound({
                    semanticObject: "SO",
                    action: "action",
                    signature: oFixture.oSignature
                }), "#SO-action{" + oFixture.sSignature + "}");
            });
        }

        // string -> inbound
        if (bTestParse) {
            Q.test("parseInbound: can format #SO-action{" + oFixture.sSignature + "}", function (assert) {

                assert.deepEqual(
                    oFormatter.parseInbound("#SO-action{" + oFixture.sSignature + "}"), {
                        semanticObject: "SO",
                        action: "action",
                        signature: oFixture.oSignature
                    }, "inbound was parsed"
                );
            });
        }
    });

    Q.test("parseInbound: can parse #SO-action with no parameters", function(assert) {

        // the following forms are equal
        assert.deepEqual(
            oFormatter.parseInbound("#SO-action{<no params><?>}"), {
                "action": "action",
                "semanticObject": "SO",
                "signature": {
                    "parameters": {}
                }
            },
            "inbound was parsed"
        );
        assert.deepEqual(
            oFormatter.parseInbound("#SO-action"), {
                "action": "action",
                "semanticObject": "SO",
                "signature": {
                    "parameters": {}
                }
            },
            "inbound was parsed"
        );
    });

    Q.test("formatInbound: can format #SO-action (no parameters)", function(assert) {

        assert.deepEqual(
            oFormatter.formatInbound({
                "action": "action",
                "semanticObject": "SO",
                "signature": {
                    "parameters": {}
                }
            }),
            // we want to be explicit in this case
            // with a console output
            "#SO-action{<no params><?>}",
            "inbound was formatted"
        );
    });

});
