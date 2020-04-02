// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.utils.utilsCdm
 */

sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/adapters/cdm/v3/utilsCdm"
], function(oTestUtils, oUtilsCdm) {
    "use strict";

    /* global QUnit sinon */

    var O_CDM_SITE_SERVICE_MOCK_DATA = sap.ushell.test.data.cdm.cdmSiteService,
        O_CDM_SITE = O_CDM_SITE_SERVICE_MOCK_DATA.site;

    QUnit.module("sap.ushell.test.utils.utilsCdm", {
        setup: function() {
        },
        teardown: function() {
            oTestUtils.restoreSpies(
                jQuery.sap.log.error,
                jQuery.sap.log.warning,
                oUtilsCdm._formatApplicationType
            );
        }
    });

    QUnit.test("#mapOne returns correct inbound for cards", function (assert) {
        // Arrange
        var oVisualization = {},
            oVisualizationType = {
                "sap.app": {
                    "type": "card"
                }
            };

        // Act
        var oResult = oUtilsCdm.mapOne(undefined, undefined, undefined, oVisualization, oVisualizationType).tileResolutionResult;

        // Assert
        assert.ok(oResult.isCard, "The isCard Property of the returned Inboud is true");
    });

    QUnit.test("#mapOne returns correct inbound for platform visualizations", function (assert) {
        // Arrange
        var oVisualization = {},
            oVisualizationType = {
                "sap.app": {
                    "type": "platformVisualization"
                }
            };

        // Act
        var oResult = oUtilsCdm.mapOne(undefined, undefined, undefined, oVisualization, oVisualizationType).tileResolutionResult;

        // Assert
        assert.ok(oResult.isPlatformVisualization, "The isPlatformVisualization property of the returned inboud is true");
    });

    QUnit.test("#mapOne can forward the correct templateContext to ClientSideTargetResolution", function (assert) {
        var sKey = "INBOUND_KEY";

        var oTemplatePayload = {
            urlTemplate: "SOME_TEMPLATE",
            parameters: {
                names: {
                    "SOME": "TEMPLATE PARAMETERS"
                }
            }
        };

        var oSite = {
            urlTemplates: {
                "url.template.fiori": {
                    identification: {
                        id: "url.template.fiori"
                    },
                    payload: oTemplatePayload
                }
            }
        };
        var oSrc = {
            semanticObject: "InvoiceList",
            action: "manage",
            signature: {
                parameters: {},
                additionalParameters: "allowed"
            }
        };
        var oApp = {
            "sap.app": {
                destination: "fiori_blue_box"
                // ...
            },
            "sap.integration": {
                urlTemplateId: "url.template.fiori",
                urlTemplateParams: {
                    appId: "cus.sd.billingdoclist.manages1",
                    platform: "CF"
                }
            },
            "sap.flp": {
                // ...
            },
            "sap.ui": {
                technology: "URL"
            }
        };

        // act
        var oMapped = oUtilsCdm.mapOne(sKey, oSrc, oApp, undefined, undefined, oSite); // don't care about return value.

        // assert
        assert.strictEqual(oMapped.hasOwnProperty("templateContext"), true, "templateContext was found in the mapped target");
        if (oMapped.templateContext) {
            assert.deepEqual(oMapped.templateContext, {
                payload: oTemplatePayload,
                site: oSite,
                siteAppSection: oApp
            }, "templateContext is as expected");
        }
    });

    QUnit.test("#mapOne does not modify input parameters", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            "semanticObject": "so",
            "action": "action",
            "signature": {} // used to get modified
        };
        var oApp = {
            "sap.app": {
                "id": "foo",
                "crossNavigation": {
                    "inbounds": {
                        "INBOUND_KEY": {
                            "semanticObject": "so",
                            "action": "action"
                        }
                    }
                }
            },
            "sap.url": {
                "uri": "http://path/to/resource"
            },
            "sap.ui": {
                "technology": "URL",
                "deviceTypes": {} // used to get modified
            }
        };
        var sKeyClone = sKey;
        var oSrcClone = JSON.parse(JSON.stringify(oSrc)); // clone without dependencies
        var oAppClone = JSON.parse(JSON.stringify(oApp)); // clone without dependencies

        // act
        oUtilsCdm.mapOne(sKey, oSrc, oApp); // don't care about return value.

        // assert
        assert.strictEqual(sKey, sKeyClone, "sKey was not modified");
        assert.deepEqual(oSrc, oSrcClone, "oSrc was not modified");
        assert.deepEqual(oApp, oAppClone, "oApp was not modified");
    });

    QUnit.test("#mapOne uses `sap.url` when 'getMember(oApp, \"sap|ui.technology\") === \"URL\"', and `oApp` has no `sap.platform.runtime`", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            "semanticObject": "so",
            "action": "action"
        };
        var oApp = {
            "sap.app": {
                "id": "foo",
                "crossNavigation": {
                    "inbounds": {
                        "INBOUND_KEY": {
                            "semanticObject": "so",
                            "action": "action"
                        }
                    }
                }
            },
            "sap.url": {
                "uri": "http://path/to/resource"
            },
            "sap.ui": {
                "technology": "URL"
            }
        };

        var oExpectedInbound = {
            "semanticObject": "so",
            "action": "action",
            "title": undefined,
            "info": undefined,
            "icon": undefined,
            "subTitle": undefined,
            "shortTitle": undefined,
            "resolutionResult": {
                "appId": "foo",
                "applicationType": "URL",
                "url": "http://path/to/resource",
                "sap.platform.runtime": {
                    "url": "http://path/to/resource"
                },
                "systemAlias": undefined,
                "systemAliasSemantics": "apply",
                "text": undefined,
                "sap.ui": {
                    "technology": "URL"
                }
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "tileResolutionResult": {
                "appId": "foo",
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "description": undefined,
                "icon": undefined,
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : undefined,
                "size": undefined,
                "subTitle": undefined,
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {},
                "title": undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp);

        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("mapOne returns indicatorDataSource and dataSources if defined", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            "semanticObject": "so",
            "action": "action"
        };
        var oApp = {
            "sap.app": {
                "id": "bar",
                "dataSources": {
                    "fooService": {
                        "uri": "/sap/opu/odata/foo/"
                    }
                },
                "crossNavigation": {
                    "inbounds": {
                        "INBOUND_KEY": {
                            "semanticObject": "so",
                            "action": "action"
                        }
                    }
                }
            },
            "sap.url": {
                "uri": "http://path/to/resource"
            },
            "sap.ui": {
                "technology": "URL"
            }
        };

        var oVisualization = {
            "vizType": "sap.ushell.StaticAppLauncher",
            "businessApp": "The.BusinessApp",
            "vizConfig": {
                "sap.flp": {
                    "target": {
                        "appId": "bar",
                        "inboundId": "INBOUND_KEY"
                    },
                    "indicatorDataSource": {
                        "dataSource": "fooService",
                        "path": "test/counts/count1.json"
                    }
                }
            }
        };

        var oExpectedInbound = {
            "semanticObject": "so",
            "action": "action",
            "title": undefined,
            "info": undefined,
            "icon": undefined,
            "subTitle": undefined,
            "shortTitle": undefined,
            "resolutionResult": {
                "appId": "bar",
                "applicationType": "URL",
                "url": "http://path/to/resource",
                "sap.platform.runtime": {
                    "url": "http://path/to/resource"
                },
                "systemAlias": undefined,
                "systemAliasSemantics": "apply",
                "text": undefined,
                "sap.ui": {
                    "technology": "URL"
                }
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "tileResolutionResult": {
                "appId": "bar",
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "description": undefined,
                "icon": undefined,
                "indicatorDataSource": {
                    "dataSource": "fooService",
                    "path": "test/counts/count1.json"
                },
                "dataSources": {
                    "fooService": {
                        "uri": "/sap/opu/odata/foo/"
                    }
                },
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : undefined,
                "size": undefined,
                "subTitle": undefined,
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {},
                "title": undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp, oVisualization);
        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("#mapOne uses `sap.platform.runtime` when `sap.url` is not available", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            "semanticObject": "so",
            "action": "action"
        };
        var oApp = {
            "sap.app": {
                "id": "fooBar",
                "crossNavigation": {
                    "inbounds": {
                        "INBOUND_KEY": {
                            "semanticObject": "so",
                            "action": "action"
                        }
                    }
                }
            },
            "sap.ui": {
                "technology": "URL"
            },
            "sap.platform.runtime": {
                "uri": "http://path/to/resource"
            }
        };

        var oExpectedInbound = {
            "semanticObject": "so",
            "action": "action",
            "title": undefined,
            "info": undefined,
            "icon": undefined,
            "subTitle": undefined,
            "shortTitle": undefined,
            "resolutionResult": {
                "appId": "fooBar",
                "applicationType": "URL",
                "url": "http://path/to/resource",
                "uri": "http://path/to/resource",
                "sap.platform.runtime": {
                    "uri": "http://path/to/resource",
                    "url": "http://path/to/resource"
                },
                "systemAlias": undefined,
                "systemAliasSemantics": "apply",
                "text": undefined,
                "sap.ui": {
                    "technology": "URL"
                }
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "tileResolutionResult": {
                "appId": "fooBar",
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "description": undefined,
                "icon": undefined,
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation": { "uri": "http://path/to/resource" },
                "size": undefined,
                "subTitle": undefined,
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {},
                "title": undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp);

        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    QUnit.test("#mapOne uses neither `sap.url` nor `sap.platform.runtime` when neither of them are defined", function (assert) {
        var sKey = "INBOUND_KEY";
        var oSrc = {
            "semanticObject": "so",
            "action": "action"
        };
        var oApp = {
            "sap.app": {
                "crossNavigation": {
                    "inbounds": {
                        "INBOUND_KEY": {
                            "semanticObject": "so",
                            "action": "action"
                        }
                    }
                }
            },
            "sap.ui": {
                "technology": "URL"
            }
        };

        var oExpectedInbound = {
            "semanticObject": "so",
            "action": "action",
            "title": undefined,
            "info": undefined,
            "icon": undefined,
            "subTitle": undefined,
            "shortTitle": undefined,
            "resolutionResult": {
                "appId": undefined,
                "applicationType": "URL",
                "systemAlias": undefined,
                "systemAliasSemantics": "apply",
                "text": undefined,
                "sap.ui": {
                    "technology": "URL"
                }
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "tileResolutionResult": {
                "appId": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "description": undefined,
                "icon": undefined,
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : undefined,
                "size": undefined,
                "subTitle": undefined,
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {},
                "title": undefined
            }
        };

        var oInbound = oUtilsCdm.mapOne(sKey, oSrc, oApp);

        assert.deepEqual(oInbound, oExpectedInbound, "Result inbound matches expected inbound");
    });

    [
        {
            testDescription: "tile with includeManifest is true with componentProperties",
            input: {
                sKey: "My-customTile2",
                oSrc: {
                    "semanticObject": "My",
                    "action": "customTile",
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {}
                    }
                },
                oVisualization: {
                    "vizType": "sap.ushell.demotiles.cdm.customtile",
                    "businessApp": "The.BusinessApp",
                    "vizConfig": {
                        "sap.flp": {
                            "target": {
                                "appId": "sap.ushell.demo.AppNavSample",
                                "inboundId": "Overloaded-start"
                            },
                            "indicatorDataSource": {
                                "path": "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432",
                                "refresh": 900
                            }
                        }
                    }
                },
                oApp: {
                    "sap.app": {
                        "id": "sap.ushell.demo.AppNavSample",
                        "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                        "subTitle": "AppNavSample",
                        "ach": "CA-UI2-INT-FE",
                        "applicationVersion": {
                            "version": "1.0.0"
                        },
                        "crossNavigation": {
                            "inbounds": {
                                "inb1": {
                                    "semanticObject": "Action",
                                    "action": "toappnavsample",
                                    "title": "This AppNavSample action has a special default value, but requires /ui2/par",
                                    "signature": {
                                        "parameters": {
                                            "/ui2/par": {
                                                "required": true
                                            },
                                            "aand": {
                                                "defaultValue": {
                                                    "value": "ddd=1234"
                                                }
                                            }
                                        },
                                        "additionalParameters": "allowed"
                                    }
                                },
                                "inb2": {
                                    "semanticObject": "Action",
                                    "action": "toappnavsample",
                                    "signature": {
                                        "parameters": {
                                            "P1": {
                                                "renameTo": "P1New"
                                            }
                                        },
                                        "additionalParameters": "allowed"
                                    }
                                }
                            }
                        }
                    },
                    "sap.flp": {
                        "type": "application"
                    },
                    "sap.ui": {
                        "technology": "UI5",
                        "icons": {
                            "icon": "sap-icon://Fiori2/F0018"
                        },
                        "deviceTypes": {
                            "desktop": true,
                            "tablet": false,
                            "phone": false
                        }
                    },
                    "sap.ui5": {
                        "componentName": "sap.ushell.demo.AppNavSample"
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {
                            "url": "../../demoapps/AppNavSample?A=URL"
                        }
                    }
                },
                oVisualizationType: {
                    "anyProperty": "must not be lost",
                    "sap.ui5": {
                        "componentName": "sap.ushell.demotiles.cdm.customtile"
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {
                            "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                        },
                        "includeManifest": true
                    }
                }
            },
            expectedResult: {
                oInbound:
                {
                    "action": "customTile",
                    "deviceTypes": {
                        "desktop": true,
                        "phone": false,
                        "tablet": false
                    },
                    "icon": "sap-icon://Fiori2/F0018",
                    "info": undefined,
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                        "appId": "sap.ushell.demo.AppNavSample",
                        "applicationDependencies": {
                            "url": "../../demoapps/AppNavSample?A=URL"
                        },
                        "applicationType": "SAPUI5",
                        "componentProperties": {
                            "url": "../../demoapps/AppNavSample?A=URL"
                        },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                "url": "../../demoapps/AppNavSample?A=URL"
                            }
                        },
                        "sap.ui": {
                            "technology": "UI5"
                        },
                        "systemAlias": undefined,
                        "systemAliasSemantics": "apply",
                        "text": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                        "url": "../../demoapps/AppNavSample?A=URL"
                    },
                    "semanticObject": "My",
                    "shortTitle": undefined,
                    "signature": {
                        "additionalParameters": "ignored",
                        "parameters": {}
                    },
                    "subTitle": "AppNavSample",
                    "tileResolutionResult": {
                        "appId": "sap.ushell.demo.AppNavSample",
                        "dataSources": undefined,
                        "description": undefined,
                        "deviceTypes": {
                            "desktop": true,
                            "phone": false,
                            "tablet": false
                        },
                        "icon": "sap-icon://Fiori2/F0018",
                        "indicatorDataSource": {
                            "path": "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432",
                            "refresh": 900
                        },
                        "info": undefined,
                        "isCard": false,
                        "isPlatformVisualization": false,
                        "runtimeInformation": {
                            "componentProperties": {
                                "url": "../../demoapps/AppNavSample?A=URL"
                            }
                        },
                        "size": undefined,
                        "subTitle": "AppNavSample",
                        "technicalInformation": undefined,
                        "tileComponentLoadInfo": {
                            "componentName": "sap.ushell.demotiles.cdm.customtile",
                            "componentProperties": {
                                "manifest": {
                                    "anyProperty": "must not be lost",
                                    "sap.ui5": {
                                        "componentName": "sap.ushell.demotiles.cdm.customtile"
                                    }
                                },
                                "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                            }
                        },
                        "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
                    },
                    "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#mapOne maps catalog tile as expected when " + oFixture.testDescription, function (assert) {
            var oInbound = oUtilsCdm.mapOne(oFixture.input.sKey, oFixture.input.oSrc, oFixture.input.oApp, oFixture.input.oVisualization, oFixture.input.oVisualizationType);
            assert.deepEqual(oInbound, oFixture.expectedResult.oInbound, "Inbound are formatted as expected");
        });
    });

    [
        {
            testDescription: "WDA Application",
            input: {
                sKey: "Desktop-display",
                oSrc: {
                    "semanticObject": "Desktop",
                    "action": "display"
                },
                oApp: {
                    "sap.app": {
                        "applicationVersion": {
                            "version": "1.0.0"
                        },
                        "title": "WDA application",
                        "subTitle": "",
                        "description": "this is a WDA application",
                        "destination": {
                            "name": "UI2_WDA"
                        },
                        "ach": "CA-UI2-INT-FE",
                        "crossNavigation": {
                            "inbounds": {
                                "Desktop-display": {
                                    "semanticObject": "Desktop",
                                    "action": "display"
                                }
                            }
                        }
                    },
                    "sap.ui": {
                        "technology": "WDA",
                        "icons": {
                            "icon": "sap-icon://Fiori2/F0032"
                        },
                        "deviceTypes": {
                            "desktop": true,
                            "tablet": false,
                            "phone": false
                        }
                    },
                    "sap.wda": {
                        "applicationId": "WDR_TEST_FLP_NAVIGATION"
                    }
                }
            },
            expectedResult: {
                oInbound: {
                    "semanticObject": "Desktop",
                    "action": "display",
                    "info": undefined,
                    "title": "WDA application",
                    "icon": "sap-icon://Fiori2/F0032",
                    "subTitle": "",
                    "shortTitle": undefined,
                    "resolutionResult": {
                        "appId": undefined,
                        "applicationType": "WDA",
                        "sap.wda": {
                            "applicationId": "WDR_TEST_FLP_NAVIGATION"
                        },
                        "systemAlias": "UI2_WDA",
                        "systemAliasSemantics": "apply",
                        "text": "WDA application",
                        "sap.ui": {
                            "technology": "WDA"
                        }
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": false,
                        "phone": false
                    },
                    "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {}
                    },
                    "tileResolutionResult": {
                        "appId": undefined,
                        "deviceTypes": {
                            "desktop": true,
                            "tablet": false,
                            "phone": false
                        },
                        "description": "this is a WDA application",
                        "icon": "sap-icon://Fiori2/F0032",
                        "indicatorDataSource": undefined,
                        "dataSources": undefined,
                        "info": undefined,
                        "isCard": false,
                        "isPlatformVisualization": false,
                        "size": undefined,
                        "runtimeInformation" : undefined,
                        "subTitle": "",
                        "technicalInformation": "WDR_TEST_FLP_NAVIGATION",
                        "tileComponentLoadInfo": {},
                        "title": "WDA application"
                    }

                }
            }
        },
        {
            testDescription: "GUI Application",
            input: {
                sKey: "X-PAGE:SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY",
                oSrc: {
                    "semanticObject": "X-PAGE",
                    "action": "SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY"
                },
                oApp: {
                    "sap.app": {
                        "id": "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                        "applicationVersion": {
                            "version": "1.0.0"
                        },
                        "title": "Maintain users",
                        "description": "to maintain users",
                        "subTitle": "Maintain users",
                        "destination": {
                            "name": "U1YCLNT111"
                        },
                        "ach": "FIN",
                        "crossNavigation": {
                            "inbounds": {
                                "tosu01": {
                                    "semanticObject": "Action",
                                    "action": "tosu01",
                                    "signature": {
                                        "parameters": {
                                            "sap-system": {
                                                "defaultValue": {
                                                    "value": "U1YCLNT111"
                                                }
                                            }
                                        }
                                    },
                                    "deviceTypes": {
                                        "desktop": true,
                                        "tablet": false,
                                        "phone": false
                                    }
                                }
                            }
                        }
                    },
                    "sap.ui": {
                        "technology": "GUI",
                        "icons": {
                            "icon": "sap-icon://Fiori2/F0018"
                        },
                        "deviceTypes": {
                            "desktop": true,
                            "tablet": false,
                            "phone": false
                        }
                    },
                    "sap.flp": {
                        "type": "application"
                    },
                    "sap.gui": {
                        "transaction": "SU01"
                    }
                }
            },
            expectedResult: {
                oInbound: {
                    "semanticObject": "X-PAGE",
                    "action": "SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY",
                    "info": undefined,
                    "title": "Maintain users",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "Maintain users",
                    "shortTitle": undefined,
                    "resolutionResult": {
                        "appId": "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                        "applicationType": "TR",
                        "sap.gui": {
                            "transaction": "SU01"
                        },
                        "systemAlias": "U1YCLNT111",
                        "systemAliasSemantics": "apply",
                        "text": "Maintain users",
                        "sap.ui": {
                            "technology": "GUI"
                        }
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": false,
                        "phone": false
                    },
                    "signature": {
                        "additionalParameters": "allowed",
                        "parameters": {}
                    },
                    "tileResolutionResult": {
                        "appId": "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                        "deviceTypes": {
                            "desktop": true,
                            "tablet": false,
                            "phone": false
                        },
                        "description": "to maintain users",
                        "icon": "sap-icon://Fiori2/F0018",
                        "indicatorDataSource": undefined,
                        "dataSources": undefined,
                        "info": undefined,
                        "isCard": false,
                        "isPlatformVisualization": false,
                        "runtimeInformation" : undefined,
                        "size": undefined,
                        "subTitle": "Maintain users",
                        "technicalInformation": "SU01",
                        "tileComponentLoadInfo": {},
                        "title": "Maintain users"
                    }

                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#mapOne maps WDA and GUI application as expected when " + oFixture.testDescription, function (assert) {
            var oInbound = oUtilsCdm.mapOne(oFixture.input.sKey, oFixture.input.oSrc, oFixture.input.oApp);
            assert.deepEqual(oInbound, oFixture.expectedResult.oInbound, "Inbound are formatted as expected");
        });
    });

    QUnit.test("#formatSite: returns an empty array when called with undefined", function(assert) {
        var oFormattedSite = oUtilsCdm.formatSite( /* undefined */ );
        assert.deepEqual(oFormattedSite, [], "got empty array");
    });

    QUnit.test("#formatSite", function(assert) {
        var res = oUtilsCdm.formatSite(O_CDM_SITE);
        var O_CDM_FORMATTED_AINBOUNDS = [{
            "action": "viaStatic",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "icon": "sap-icon://Fiori2/F0018",
            "subTitle": undefined,
            "info": undefined,
            "resolutionResult": {
                "appId": undefined,
                "applicationType": "WDA",
                "sap.wda": {
                    "applicationId": "WDR_TEST_FLP_NAVIGATION"
                },
                "systemAlias": "U1YCLNT000",
                "systemAliasSemantics": "apply",
                "text": "translated title of application",
                "sap.ui": {
                    "technology": "WDA"
                }
            },
            "semanticObject": "App1",
            "shortTitle": "short Title",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "tileResolutionResult": {
                "appId": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "description": "description of a WDA application",
                "technicalInformation": "WDR_TEST_FLP_NAVIGATION",
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : undefined,
                "size": undefined,
                "subTitle": undefined,
                "tileComponentLoadInfo": {},
                "title": "translated title of application"
            },
            "title": "translated title of application"
        },{
            "action": "viaStatic",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "icon": "sap-icon://Fiori2/F0018",
            "subTitle": undefined,
            "info": undefined,
            "resolutionResult": {
                "appId": undefined,
                "applicationType": "WDA",
                "sap.wda": {
                    "applicationId": "WDR_TEST_FLP_NAVIGATION"
                },
                "systemAlias": "U1YCLNT000",
                "systemAliasSemantics": "apply",
                "text": "translated title of application",
                "sap.ui": {
                    "technology": "WDA"
                }
            },
            "semanticObject": "App1",
            "shortTitle": "short Title",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "tileResolutionResult": {
                "appId": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "description": "description of a WDA application",
                "technicalInformation": "WDR_TEST_FLP_NAVIGATION",
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : undefined,
                "size": undefined,
                "subTitle": undefined,
                "tileComponentLoadInfo": {},
                "title": "translated title of application"
            },
            "title": "translated title of application"
        },{
            "action": "tosu01",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": true
            },
            "icon": "sap-icon://Fiori2/F0018",
            "subTitle": "Maintain users",
            "info": undefined,
            "resolutionResult": {
                "appId": "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                "sap.ui": { "technology": "GUI" },
                "applicationType": "TR",
                "sap.gui": {
                    "transaction": "SU01"
                },
                "systemAlias": "U1YCLNT111",
                "systemAliasSemantics": "apply",
                "text": "Maintain users"
            },
            "semanticObject": "Action",
            "shortTitle": "short Title",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "sap-system": {
                        "defaultValue": {
                            "value": "U1YCLNT111"
                        }
                    }
                }
            },
            "tileResolutionResult": {
                "appId": "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": true
                },
                "description": "to maintain users",
                "technicalInformation": "SU01",
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : undefined,
                "size": undefined,
                "subTitle": "Maintain users",
                "tileComponentLoadInfo": {},
                "title": "Maintain users"
            },
            "title": "Maintain users"
        },
        {
            "action": "toappnavsample",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "icon": "sap-icon://Fiori2/F0018",
            "subTitle": "AppNavSample",
            "info": undefined,
            "resolutionResult": {
                "appId": undefined,
                "sap.ui": { "technology": "UI5" },
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                "applicationDependencies": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "applicationType": "SAPUI5",
                "componentProperties": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                    },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "someThingElse_e.g._for_HCP": "soso",
                "systemAlias": undefined,
                "systemAliasSemantics": "apply",
                "text": "This AppNavSample action has a special default value, but requires /ui2/par",
                "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
            },
            "semanticObject": "Action",
            "shortTitle": "short Title",
            "signature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "/ui2/par": {
                        "required": true
                    },
                    "aand": {
                        "defaultValue": {
                            "value": "ddd=1234"
                        }
                    }
                }
            },
            "tileResolutionResult": {
                "appId": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "icon": "sap-icon://Fiori2/F0018",
                "description": "description of a UI5 application",
                "technicalInformation": undefined,
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                    },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "size": undefined,
                "subTitle": "AppNavSample",
                "tileComponentLoadInfo": {},
                "title": "This AppNavSample action has a special default value, but requires /ui2/par"
            },
            "title": "This AppNavSample action has a special default value, but requires /ui2/par"
        }, {
            "action": "toappnavsample",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "icon": "sap-icon://Fiori2/F0018",
            "subTitle": "AppNavSample",
            "info": undefined,
            "resolutionResult": {
                "appId": undefined,
                "sap.ui": { "technology": "UI5" },
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                "applicationDependencies": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "applicationType": "SAPUI5",
                "componentProperties": {
                    "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                    },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "someThingElse_e.g._for_HCP": "soso",
                "systemAlias": undefined,
                "systemAliasSemantics": "apply",
                "text": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
            },
            "semanticObject": "Action",
            "shortTitle": "short Title",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "P1": {
                        "renameTo": "P1New"
                    }
                }
            },
            "tileResolutionResult": {
                "appId": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "icon": "sap-icon://Fiori2/F0018",
                "description": "description of a UI5 application",
                "technicalInformation": undefined,
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                    },
                    "someThingElse_e.g._for_HCP": "soso"
                },
                "size": undefined,
                "subTitle": "AppNavSample",
                "tileComponentLoadInfo": {},
                "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
            },
            "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)"
        }, {
            "action": "launchURL",
            "deviceTypes": {
                "desktop": true,
                "phone": false,
                "tablet": false
            },
            "icon": "sap-icon://Fiori2/F0018",
            "subTitle": "A uri",
            "info": undefined,
            "resolutionResult": {
                "appId": undefined,
                "sap.ui": { "technology": "URL" },
                "applicationType": "URL",
                "sap.platform.runtime": {
                    "uri": "http://nytimes.com",
                    "url": "http://nytimes.com"
                },
                "systemAlias": undefined,
                "systemAliasSemantics": "apply",
                "text": "Demo starting foreign URI",
                "uri": "http://nytimes.com",
                "url": "http://nytimes.com"
            },
            "semanticObject": "Shell",
            "shortTitle": "short Title",
            "signature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "sap-external-url": {
                        "filter": {
                            "value": "http://www.nytimes.com"
                        },
                        "required": true
                    }
                }
            },
            "tileResolutionResult": {
                "appId": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "icon": "sap-icon://Fiori2/F0018",
                "description": "description of a URL application",
                "technicalInformation": undefined,
                "indicatorDataSource": undefined,
                "dataSources": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "runtimeInformation" : {
                    "uri": "http://nytimes.com"
                },
                "size": undefined,
                "subTitle": "A uri",
                "tileComponentLoadInfo": {},
                "title": "Demo starting foreign URI"
            },
            "title": "Demo starting foreign URI"
        }];
        QUnit.dump.maxDepth = 10;
        assert.deepEqual(res, O_CDM_FORMATTED_AINBOUNDS, "formatted site ok");
    });

    QUnit.test("#formatSite with exception", function(assert) {
        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(oUtilsCdm, "_formatApplicationType").throws("Deliberate Exception");

        var aInbounds = oUtilsCdm.formatSite(O_CDM_SITE);

        assert.deepEqual(aInbounds, [], "obtained the expected response in case of error");

        assert.strictEqual(jQuery.sap.log.error.callCount, 5, "jQuery.sap.log.error was called once");

        [
            "Error in application AppDesc1: Deliberate Exception",
            "Error in application X-PAGE:SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY: Deliberate Exception",
            "Error in application sap.ushell.demo.AppNavSample: Deliberate Exception",
            "Error in application sap.ushell.demo.startURL: Deliberate Exception",
            "Error in application shellPluginToBeIgnored: Deliberate Exception"
        ].forEach(function(sError, iIdx) {
            assert.strictEqual(jQuery.sap.log.error.getCall(iIdx).args[0], sError, "got expected first argument on call " + iIdx + " of jQuery.sap.log.error");
        });
    });

    [
        {
            testDescription: "applicationType is defined",
            oApp: {},
            oResolutionResult: {
                applicationType: "foo"
            },
            expectedApplicationType: "foo"
        },
        {
            testDescription: "applicationType cannot be detected",
            oApp: {},
            oResolutionResult: {},
            expectedApplicationType: "URL"
        },
        {
            testDescription: "application technology is UI5",
            oApp: {
                "sap.ui":{
                    "technology":"UI5"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "SAPUI5"
        },
        {
            testDescription: "application technology is WDA",
            oApp: {
                "sap.ui":{
                    "technology":"WDA"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "WDA"
        },
        {
            testDescription: "application technology is GUI",
            oApp: {
                "sap.ui":{
                    "technology":"GUI"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "TR"
        },
        {
            testDescription: "application technology is URL",
            oApp: {
                "sap.ui":{
                    "technology":"URL"
                }
            },
            oResolutionResult: {},
            expectedApplicationType: "URL"
        }
    ].forEach(function (oFixture) {
        QUnit.test("#_formatApplicationType: returns " + oFixture.expectedApplicationType + " when " + oFixture.testDescription, function (assert) {
            var sGotApplicationType;

            sinon.stub(jQuery.sap.log, "warning");
            sinon.stub(jQuery.sap.log, "error");

            sGotApplicationType = oUtilsCdm._formatApplicationType(oFixture.oResolutionResult, oFixture.oApp);

            assert.strictEqual(sGotApplicationType, oFixture.expectedApplicationType, "got expected application type");
            assert.strictEqual(jQuery.sap.log.warning.callCount, 0, "no calls to jQuery.sap.log.warning");
            assert.strictEqual(jQuery.sap.log.error.callCount, 0, "no calls to jQuery.sap.log.error");
        });
    });

});
