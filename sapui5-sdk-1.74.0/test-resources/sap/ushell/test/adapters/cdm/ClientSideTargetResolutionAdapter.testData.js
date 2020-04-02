(function() {
    "use strict";

    var oLpaData = jQuery.sap.getObject("sap.ushell.test.data.cdm.launchPageAdapter", 0),
        oCdmData = jQuery.sap.getObject("sap.ushell.test.data.cdm.cdmSiteService", 0),
        oCstrData = jQuery.sap.getObject("sap.ushell.test.data.cdm.ClientSideTargetResolution", 0);

    /*
     * CDM LaunchPageAdapter test data exposed by the CDM LPA
     */
    oLpaData.groups = [ {
        title : "HOME Apps",
        id : "HOME",
        isDefaultGroup : false,
        isPreset : true,
        isVisible : true,
        isGroupLocked : false,
        tiles : [ {
            "id" : "tile_0_HOME", // generated id
            "size" : "1x1",
            "tileType" : "sap.ushell.ui.tile.StaticTile",
            "properties" : {
                "title" : "title - Static App Launcher 1",
                "subTitle" : "subtitle - Static App Launcher 1",
                "chipId" : "tile_0_HOME", // generated id - TODO remove as
                // redundant
                "info" : "no info in CDM", // TODO remove!
                "icon" : "sap-icon://Fiori2/F0018",
                "targetURL" : "#App1-viaStatic",
                "tilePersonalization" : undefined
            }
        } ],
        links : []
    }, {
        title : "ONE Apps",
        id : "ONE",
        isDefaultGroup : false,
        isPreset : true,
        isVisible : true,
        isGroupLocked : false,
        "tiles" : [ {
            "id" : "tile_0_ONE",
            "properties" : {
                "chipId" : "tile_0_ONE",
                "icon" : "sap-icon://Fiori2/F0018",
                "info" : "no info in CDM",
                "subTitle" : "subtitle - Static App Launcher 1",
                "targetURL" : "#App1-viaStatic",
                "tilePersonalization" : undefined,
                "title" : "title - Static App Launcher 1"
            },
            "size" : "1x1",
            "tileType" : "sap.ushell.ui.tile.StaticTile"
        }, {
            "id" : "tile_1_ONE",
            "properties" : {
                "chipId" : "tile_1_ONE",
                "icon" : "sap-icon://Fiori2/F0022",
                "info" : "no info in CDM",
                "subTitle" : "subtitle - Static App Launcher over",
                "targetURL" : "#App1-overwritten",
                "tilePersonalization" : undefined,
                "title" : "Overwrite me in ONE"
            },
            "size" : "1x1",
            "tileType" : "sap.ushell.ui.tile.StaticTile"
        } ],
        links : []
    } ];

    /*
     * CdmSiteService test data exposed by the CDM CdmS Service
     */
    oCdmData.groupIds = [ "HOME", "ONE" ];
    oCdmData.groups = [{
        "identification": {
            "id": "HOME",
            "namespace": "",
            "title": "HOME Apps"
        },
        "payload": {
            "tiles": [
                {
                    "id": "static_tile_1",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic"
                    },
                    "vizId": "AppDesc1"
                }
            ],
            "groups": []
        }
    }, {
        "identification": {
            "id": "ONE",
            "namespace": "",
            "title": "ONE Apps"
        },
        "payload": {
            "tiles": [
                {
                    "id": "static_tile_1",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic"
                    },
                    "vizId": "AppDesc1"
                },
                {
                    "id": "dyna_tile_1",
                    "title": "Overwrite me in ONE",
                    "indicatorDataSource": {
                        "path": "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=10&srv=234132432"
                    },
                    "target": {
                        "semanticObject": "App1",
                        "action": "overwritten"
                    },
                    "vizId": "AppDesc1"
                }
            ],
            "groups": []
        }
    }];
    oCdmData.site = {
        "applications": {
            "AppDesc1": {
                "sap.app": {
                    "title": "translated title of application",
                    "description": "description of a WDA application",
                    "shortTitle": "short Title",
                    "ach": "FIN-XX",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "destination": {
                        "name": "U1YCLNT000"
                    },
                    "crossNavigation": {
                        "inbounds": {
                            "start": {
                                "semanticObject": "App1",
                                "action": "viaStatic",
                                "signature": {
                                    "additionalParameters": "allowed"
                                }
                            },
                            "sneaky": {
                                "semanticObject": "App1",
                                "action": "viaStatic",
                                "signature": {}
                            }
                        }
                    }
                },
                "sap.ui": {
                    "technology": "WDA",
                    "icons": {
                        "icon": "sap-icon://Fiori2/F0018"
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
            },
            "X-PAGE:SAP_SFIN_BC_APAR_OPER:0AAAAX3FZZ_COPY": {
                "sap.app": {
                    "id": "X-PAGE:SAP_SFIN_BC_APAR_OPER:0BJCE647QCIX3FZZ_COPY",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "Maintain users",
                    "shortTitle": "short Title",
                    "subTitle": "Maintain users",
                    "destination": {
                        "name": "U1YCLNT111"
                    },
                    "description": "to maintain users",
                    "ach": "FIN",
                    "crossNavigation": {
                        "inbounds": {
                            "tosu01": {
                                "semanticObject": "Action",
                                "action": "tosu01",
                                "additionalParameters": "ignored",
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
                                    "tablet": true,
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
            },
            "sap.ushell.demo.AppNavSample": {
                "sap.app": {
                    "title": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                    "shortTitle": "short Title",
                    "description": "description of a UI5 application",
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
                                "shortTitle": "short Title",
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
                                    "additionalParameters": "ignored"
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
                    "someThingElse_e.g._for_HCP": "soso",
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL"
                    }
                }
            },
            "sap.ushell.demo.startURL": {
                "sap.app": {
                    "title": "Demo starting foreign URI",
                    "description": "description of a URL application",
                    "shortTitle": "short Title",
                    "subTitle": "A uri",
                    "ach": "CA-UI2-INT-FE",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "crossNavigation": {
                        "inbounds": {
                            "inb1": {
                                "semanticObject": "Shell",
                                "action": "launchURL",
                                "deviceTypes": {
                                    "tablet": false
                                },
                                "signature": {
                                    "additionalParameters": "ignored",
                                    "parameters": {
                                        "sap-external-url": {
                                            "required": true,
                                            "filter": {
                                                "value": "http://www.nytimes.com"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "sap.flp": {
                    "type": "application"
                },
                "sap.ui": {
                    "technology": "URL",
                    "icons": {
                        "icon": "sap-icon://Fiori2/F0018"
                    },
                    "deviceTypes": {
                        "tablet": false,
                        "phone": false
                    }
                },
                "sap.platform.runtime": {
                    "uri": "http://nytimes.com"
                }
            },
            "shellPluginToBeIgnored": {
                "sap.app": {
                    "id": "X-PAGE:MANYDYNLAUNCHERS:00O2TO406Y43JAG757HT7PRQ0",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "Dynamic Nr..",
                    "subTitle": "An App with a dynamic tile",
                    "crossNavigation": {
                        "inbounds": {
                            "Shell-plugin": {
                                "semanticObject": "Shell",
                                "action": "plugin",
                                "signature": {}
                            }
                        }
                    }
                },
                "sap.ui": {
                    "technology": "UI5",
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": true
                    }
                },
                "sap.ui5": {
                    "componentName": "sap.ushell.demo.UserDefaultPluginSample"
                },
                "sap.flp": {
                    "type": "plugin"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demoapps/UserDefaultPluginSample"
                    }
                }
            }
        },
        "catalogs": {
            "cat1": {
                "identification": {
                    "id": "Cat1",
                    "title": "Cat1 title"
                },
                "payload": {
                    "viz": [
                        "AppDesc1",
                        "AppDesc2"
                    ]
                }
            },
            "cat2": {
                "identification": {
                    "id": "Cat2",
                    "title": "Accounts Payable - Checks"
                },
                "payload": {
                    "viz": [
                        "AppDesc1",
                        "AppDesc3"
                    ]
                }
            }
        },
        "visualizations": {
            "AppDesc1": {
                "vizType": "sap.ushell.StaticAppLauncher",
                "businessApp": "AppDesc1.BusinessApp",
                "target": {
                    "appId": "AppDesc1",
                    "inboundId": "start"
                }
            }
        },
        "vizTypes": {
            "sap.ushell.StaticAppLauncher": {
                "_version": "1.0",
                "sap.flp": {
                    "tileSize": "1x1"
                },
                "sap.app": {
                    "id": "sap.ushell.components.tiles.cdm.applauncher",
                    "_version": "1.0.0",
                    "type": "component",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "App Launcher - Static",
                    "keywords": "launcher",
                    "description": "",
                    "subTitle": "Launch Apps",
                    "tags": {
                        "keywords": []
                    },
                    "ach": "CA-FE-FLP-EU"
                },
                "sap.ui": {
                    "_version": "1.1.0",
                    "icons": {
                        "icon": ""
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": true
                    },
                    "supportedThemes": [
                        "sap_hcb",
                        "sap_belize",
                        "sap_belize_plus"
                    ]
                },
                "sap.ui5": {
                    "_version": "1.1.0",
                    "componentName": "sap.ushell.components.tiles.cdm.applauncher",
                    "dependencies": {
                        "minUI5Version": "1.42",
                        "libs": {
                            "sap.m": {}
                        }
                    },
                    "models": {
                        "i18n": {
                            "type": "sap.ui.model.resource.ResourceModel",
                            "uri": "i18n/i18n.properties"
                        }
                    },
                    "rootView": {
                        "viewName": "sap.ushell.components.tiles.cdm.applauncher.StaticTile",
                        "type": "JS"
                    },
                    "handleValidation": false
                }
            },
            "sap.ushell.DynamicAppLauncher": {
                "_version": "1.0",
                "sap.flp": {
                    "tileSize": "1x1"
                },
                "sap.app": {
                    "id": "sap.ushell.components.tiles.cdm.applauncherdynamic",
                    "_version": "1.0.0",
                    "type": "component",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "App Launcher - Dynamic",
                    "keywords": "launcher",
                    "description": "",
                    "subTitle": "Launch Apps",
                    "tags": {
                        "keywords": []
                    },
                    "ach": "CA-FE-FLP-EU"
                },
                "sap.ui": {
                    "_version": "1.1.0",
                    "icons": {
                        "icon": ""
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": true
                    },
                    "supportedThemes": [
                        "sap_hcb",
                        "sap_belize",
                        "sap_belize_plus"
                    ]
                },
                "sap.ui5": {
                    "_version": "1.1.0",
                    "componentName": "sap.ushell.components.tiles.cdm.applauncherdynamic",
                    "dependencies": {
                        "minUI5Version": "1.42",
                        "libs": {
                            "sap.m": {}
                        }
                    },
                    "models": {
                        "i18n": {
                            "type": "sap.ui.model.resource.ResourceModel",
                            "uri": "i18n/i18n.properties"
                        }
                    },
                    "rootView": {
                        "viewName": "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
                        "type": "JS"
                    },
                    "handleValidation": false
                }
            },
            "X-PAGE:/UI2/Custom:00O2TM3L43A5Q1U2JGG8K": {
                "sap.app": {
                    "id": "X-PAGE:/UI2/Custom:00O2TM3L43A5Q1U2JGG8K",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "Custom Dynamic App Launcher",
                    "shortTitle": "short Title",
                    "subTitle": "slow refresh (15 min)",
                    "ach": "CA-UI2-INT-FE"
                },
                "sap.flp": {
                    "type": "tile",
                    "tileSize": "1x1"
                },
                "sap.ui5": {
                    "componentName": "sap.ushell.demotiles.cdm.customtile"
                },
                "sap.ui": {
                    "technology": "URL",
                    "icons": {
                        "icon": "sap-icon://time-entry-request"
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": true
                    }
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                    }
                }
            }
        },
        groups : {
            "ONE" : oCdmData.groups[1],
            "HOME" : oCdmData.groups[0]
        }
    };
    /*
     * ClientSideTargetResolution test data exposed by the
     * ClientSideTargetResolution Service
     */
    oCstrData.resolvedTileHashes = {
        "#App1-viaStatic" : {
            "title" : "title - Static App Launcher 1",
            "subTitle" : "subtitle - Static App Launcher 1",
            "icon" : "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo" : "#App1-viaStatic",
            "isCustomTile" : false,
            "navigationMode": "embedded"
        },
        "#App1-overwritten" : {
            "title" : "title - Static App Launcher over",
            "subTitle" : "subtitle - Static App Launcher over",
            "icon" : "sap-icon://Fiori2/F0022",
            "tileComponentLoadInfo" : "#App1-overwritten",
            "isCustomTile" : false,
            "navigationMode": "newWindowThenEmbedded"
        }
    // / O_CUSTOM_1_RESOLVED = {"title":"Custom Dynamic App
    // Launcher","subtitle":"slow refresh (15
    // min)","icon":"sap-icon://time-entry-request","size":"1x1","tileComponentLoadInfo":{"componentProperties":{"url":"../../../../sap/ushell/demotiles/cdm/customtile"},"applicationType":"URL","text":"Custom
    // Dynamic App
    // Launcher","url":"../../../../sap/ushell/demotiles/cdm/customtile","componentName":"sap.ushell.demotiles.cdm.customtile"},"indicatorDataSource":{"path":"/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432","refresh":900},"isCustomTile":true,"targetOutbound":{"semanticObject":"Action","action":"toappnavsample","parameters":{"XXX":{"value":"yyy"}}}};
    };
})();
