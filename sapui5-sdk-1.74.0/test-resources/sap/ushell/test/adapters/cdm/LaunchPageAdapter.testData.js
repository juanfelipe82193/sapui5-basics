// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";

    var oLpaData = jQuery.sap.getObject("sap.ushell.test.data.cdm.launchPageAdapter", 0),
        oCdmData = jQuery.sap.getObject("sap.ushell.test.data.cdm.commonDataModelService", 0),
        oCstrData = jQuery.sap.getObject("sap.ushell.test.data.cdm.ClientSideTargetResolution", 0);

    /*
     * CDM LaunchPageAdapter test data exposed by the CommonDataModel service
     */
    oCdmData.site =
    {
        "site": {
            "payload": {
                "groupsOrder": [
                    "HOME",
                    "GroupWithOneTile",
                    "ONE",
                    "TWO",
                    "EMPTY",
                    "BOOKMARK_COUNT",
                    "DRAG_AND_DROP",
                    "URL_TILES"
                ]
            }
        },
        "applications": {
            "AppDesc1": {
                "sap.app": {
                    "title": "title - Static App Launcher 1",
                    "subTitle": "subtitle - Static App Launcher 1",
                    "id": "AppDesc1",
                    "info": "info - Static App Launcher 1",
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
                                "signature": {}
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
                }
            },
            "AppDesc2": {
                "sap.app": {
                    "title": "App desc 2 title",
                    "subTitle": "subtitle - App2",
                    "id": "AppDesc2",
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
                                "semanticObject": "App2",
                                "action": "viaStatic",
                                "signature": {}
                            },
                            "sneaky": {
                                "semanticObject": "App2",
                                "action": "withFilter",
                                "signature": {
                                    "parameters": {
                                        "abc": {
                                            "filter": {
                                                "value": "ABC"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    "technology": "WDA",
                    "icons": {
                        "icon": "sap-icon://Fiori2/F0023"
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": false,
                        "phone": false
                    }
                }
            },
            "CustomTileApplication1": {
                "sap.app": {
                    "title": "Custom tile application 1 title",
                    "subTitle": "Custom tile application 1 subtitle",
                    "id": "CustomTileApplication1",
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
                                "semanticObject": "CustomTileApplication1",
                                "action": "viaStatic",
                                "signature": {}
                            },
                            "sneaky": {
                                "semanticObject": "CustomTileApplication1",
                                "action": "withFilter",
                                "signature": {
                                    "parameters": {
                                        "abc": {
                                            "filter": {
                                                "value": "ABC"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    "technology": "WDA",
                    "icons": {
                        "icon": "sap-icon://Fiori2/F0023"
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": false,
                        "phone": false
                    }
                }
            },
            "SomePlugin": {
                "_version": "1.4.0",
                "sap.app": {
                    "_version": "1.1.0",
                    "i18n": "messagebundle.properties",
                    "id": "SomePlugin",
                    "type": "component",
                    "title": "Some Plugin",
                    "subTitle": "FLP Plugin",
                    "description": "Some Plugin for FLP",
                    "applicationVersion": {
                        "version": "1.1.0"
                    },
                    "ach": "CA-UI2-INT-FE",
                    "crossNavigation": {
                        "inbounds": {
                            "Shell-plugin": {
                                "semanticObject": "Shell",
                                "action": "plugin",
                                "signature": {
                                    "parameters": {},
                                    "additionalParameters": "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    "_version": "1.1.0",
                    "technology": "UI5",
                    "icons": {
                        "icon": "sap-icon://Fiori2/F0100"
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": true
                    }
                },
                "sap.ui5": {
                    "componentName": "sap.ushell.demo.UIPluginSampleAddHeaderItems",
                    "dependencies": {
                        "minUI5Version": "1.28",
                        "libs": {
                            "sap.m": {
                                "minVersion": "1.28"
                            }
                        }
                    },
                    "contentDensities": {
                        "compact": true,
                        "cozy": true
                    }
                },
                "sap.flp": {
                    "type": "plugin"
                },
                "sap.platform.runtime": {
                    "componentProperties": {
                        "name": "sap.ushell.demo.UIPluginSampleAddHeaderItems",
                        "url": "/sap/bc/ui5_ui5/ui2/uiplugin/~87D23B2A9BBD93A317B080B46F970828~5",
                        "self": {
                            "name": "sap.ushell.demo.UIPluginSampleAddHeaderItems",
                            "url": "/sap/bc/ui5_ui5/ui2/uiplugin/~87D23B2A9BBD93A317B080B46F970828~5"
                        },
                        "asyncHints": {
                            "libs": [
                                {
                                    "name": "sap.m"
                                },
                                {
                                    "name": "sap.ui.core"
                                },
                                {
                                    "name": "sap.ui.unified",
                                    "lazy": true
                                }
                            ],
                            "requests": [
                                {
                                    "name": "sap.ui.fl.changes",
                                    "reference": "sap.ushell.demo.UIPluginSampleAddHeaderItems.Component"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "catalogs": {
            "cat1": {
                "identification": {
                    "id": "cat1",
                    "title": "Cat1 title"
                },
                "payload": {
                    "viz": [
                        "Unresolvable",
                        "AppDesc1",
                        "AppDesc2"
                    ]
                }
            },
            "cat2": {
                "identification": {
                    "id": "cat2",
                    "title": "Accounts Payable - Checks"
                },
                "payload": {
                    "viz": [
                        "AppDesc1",
                        "AppDesc3"
                    ]
                }
            },
            "customTileCatalog": {
                "identification": {
                    "id": "customTileCatalog",
                    "title": "Catalog with custom tile application"
                },
                "payload": {
                    "viz": [
                        "CustomTileApplication"
                    ]
                }
            },
            "urlTileCatalog": {
                "identification": {
                    "id": "urlTileCatalog",
                    "title": "Catalog with URL tiles"
                },
                "payload": {
                    "viz": [
                        "urlTile"
                    ]
                }
            },
            "pluginCatalog": {
                "identification": {
                    "id": "pluginCatalog",
                    "title": "Catalog with plugin"
                },
                "payload": {
                    "viz": [
                        "AppDesc1",
                        "SomePlugin",
                        "AppDesc2"
                    ]
                }
            }
        },
        "groups": {
            "HOME": {
                "identification": {
                    "id": "HOME",
                    "namespace": "",
                    "title": "HOME Apps"
                },
                "payload": {
                    "isDefaultGroup": true,
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
                    "links": [],
                    "groups": []
                }
            },
            "GroupWithOneTile": {
                "identification": {
                    "id": "GroupWithOneTile",
                    "namespace": "",
                    "title": "Group with one Tile"
                },
                "payload": {
                    "tiles": [
                        {
                            "id": "tile2",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        }
                    ],
                    "links": [],
                    "groups": []
                }
            },
            "ONE": {
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
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        }
                    ],
                    "links": [
                        {
                            "id": "static_link_1",
                            "title": "Link: title - Static App Launcher 1",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        },
                        {
                            "id": "dyna_link_1",
                            "title": "Link - Overwrite me in ONE",
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
            },
            "BOOKMARK_COUNT": {
                "identification": {
                    "id": "BOOKMARK_COUNT",
                    "title": "BOOKMARK_COUNT Group",
                    "namespace": ""
                },
                "payload": {
                    "tiles": [
                        {
                            "id": "00",
                            "title": "Bookmark title 00",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "01A",
                            "title": "Bookmark title 01A",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action",
                                "parameters": [
                                    {
                                        "name": "foo",
                                        "value": "bar"
                                    },
                                    {
                                        "name": "boo",
                                        "value": "far"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "01B",
                            "title": "Bookmark title 01B",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action",
                                "parameters": [
                                    {
                                        "name": "boo",
                                        "value": "far"
                                    },
                                    {
                                        "name": "foo",
                                        "value": "bar"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "01C",
                            "title": "Bookmark title 01C",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action",
                                "parameters": [
                                    {
                                        "name": "boo",
                                        "value": "far"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "02",
                            "title": "Bookmark title 02",
                            "subTitle": "Bookmark subtitle",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action",
                                "parameters": [
                                    {
                                        "name": "boo",
                                        "value": "ya!"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "03",
                            "icon": "sap-icon://favorite",
                            "title": "Bookmark title 03",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "04",
                            "icon": "sap-icon://family-care",
                            "title": "Bookmark title 04",
                            "subTitle": "Bookmark subtitle 04",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "05",
                            "title": "Bookmark title 05",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action",
                                "parameters": [
                                    {
                                        "name": "one",
                                        "value": "1"
                                    },
                                    {
                                        "name": "two",
                                        "value": "2"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "06",
                            "title": "Bookmark title 06",
                            "target": {
                                "semanticObject": "SO",
                                "action": "action",
                                "parameters": [
                                    {
                                        "name": "two",
                                        "value": "2"
                                    },
                                    {
                                        "name": "one",
                                        "value": "1"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "07",
                            "title": "URL Bookmark title 07",
                            "target": {
                                "url": "http://www.sap.com?a=1"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "08",
                            "title": "URL Bookmark title 08",
                            "target": {
                                "url": "http://www.sap.com"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "09",
                            "title": "URL Bookmark title 09",
                            "target": {
                                "url": "http://www.sap.com?a=1"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "10",
                            "target": {
                                "url": "http://www.sap.com?a=10"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "11",
                            "target": {
                                "url": "http://www.sap.com?a=10"
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "12",
                            "target": {
                                "url": "http://www.sap.com?a=12"
                            },
                            "isBookmark": true
                        }
                    ],
                    "links": [],
                    "groups": []
                }
            },
            "BOOKMARK_DYNAMIC_UPDATE": {
                "identification": {
                    "id": "BOOKMARK_DYNAMIC_UPDATE",
                    "title": "BOOKMARK_DYNAMIC_UPDATE Group",
                    "namespace": ""
                },
                "payload": {
                    "tiles": [
                        {
                            "id": "BOOKMARK_DYNAMIC_UPDATE_00",
                            "title": "Dynamic bookmark 00.",
                            "icon": "sap-icon://favorite",
                            "dataSource": {
                                "uri": "/sap/opu/odata/snce/PO_S_SRV;v=2/",
                                "type": "OData",
                                "settings": {
                                    "odataVersion": "2.0",
                                    "annotations": [
                                        "equipmentanno"
                                    ],
                                    "localUri": "model/metadata.xml",
                                    "maxAge": 360
                                }
                            },
                            "indicatorDataSource": {
                                "path": "ApprovedContacts/$count?$fitler=startswith(lastName, 'A') eq true",
                                "refresh": 10
                            },
                            "target": {
                                "semanticObject": "Soso",
                                "action": "dynamic00",
                                "parameters": [
                                    {
                                        "name": "param1",
                                        "value": "foo"
                                    },
                                    {
                                        "name": "param2",
                                        "value": "bar"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "BOOKMARK_DYNAMIC_UPDATE_01",
                            "title": "Dynamic bookmark 01.",
                            "icon": "sap-icon://favorite",
                            "indicatorDataSource": {
                                "path": "/sap/opu/odata/snce/PO_S_SRV/ApprovedContacts/$count?$fitler=startswith(lastName, 'A') eq true",
                                "refresh": 10
                            },
                            "target": {
                                "semanticObject": "Soso",
                                "action": "dynamic01",
                                "parameters": [
                                    {
                                        "name": "param1",
                                        "value": "foo"
                                    },
                                    {
                                        "name": "param2",
                                        "value": "bar"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "BOOKMARK_DYNAMIC_UPDATE_02",
                            "title": "Dynamic bookmark 02.",
                            "target": {
                                "semanticObject": "Soso",
                                "action": "static02",
                                "parameters": [
                                    {
                                        "name": "two",
                                        "value": "2"
                                    },
                                    {
                                        "name": "one",
                                        "value": "1"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "BOOKMARK_DYNAMIC_UPDATE_03",
                            "title": "Dynamic bookmark 03.",
                            "icon": "sap-icon://favorite",
                            "indicatorDataSource": {
                                "path": "/sap/opu/odata/snce/PO_S_SRV/ApprovedContacts/$count?$fitler=startswith(lastName, 'A') eq true",
                                "refresh": 10
                            },
                            "target": {
                                "semanticObject": "Soso",
                                "action": "dynamic03",
                                "parameters": [
                                    {
                                        "name": "param1",
                                        "value": "foo"
                                    },
                                    {
                                        "name": "param2",
                                        "value": "bar"
                                    }
                                ]
                            },
                            "isBookmark": true
                        },
                        {
                            "id": "BOOKMARK_DYNAMIC_UPDATE_04",
                            "title": "Dynamic bookmark 04.",
                            "target": {
                                "semanticObject": "Soso",
                                "action": "static04",
                                "parameters": [
                                    {
                                        "name": "two",
                                        "value": "2"
                                    },
                                    {
                                        "name": "one",
                                        "value": "1"
                                    }
                                ]
                            },
                            "isBookmark": true
                        }
                    ]
                }
            },
            "KEYWORDS": {
                "identification": {
                    "id": "KEYWORDS",
                    "namespace": "",
                    "title": "KEYWORDS Group"
                },
                "payload": {
                    "tiles": [
                        {
                            "id": "app3id",
                            "icon": "sap-icon://favorite",
                            "title": "App3 Title Keywords",
                            "target": {
                                "semanticObject": "App3",
                                "action": "viaStatic"
                            },
                            "isBookmark": false
                        }
                    ],
                    "links": [],
                    "groups": []
                }
            },
            "EMPTY": {
                "identification": {
                    "id": "EMPTY",
                    "namespace": "",
                    "title": "EMPTY Group"
                },
                "payload": {
                    "tiles": [],
                    "links": [],
                    "groups": []
                }
            },
            "TWO": {
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
                            }
                        }
                    ],
                    "links": [],
                    "groups": []
                }
            },
            "REDUNDANT_TILES": {
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
                            "id": "static_tile_2",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        }
                    ],
                    "links": [],
                    "groups": []
                }
            },
            "DIFFERENT_TILE_TYPES": {
                "identification": {
                    "id": "DIFFERENT_TILE_TYPES",
                    "namespace": "",
                    "title": "Different tile types"
                },
                "payload": {
                    "tiles": [
                        {
                            "id": "static_tile_5",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        },
                        {
                            "id": "dyna_tile_3",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaDynamic"
                            },
                            "vizId": "AppDesc1"
                        }
                    ],
                    "links": [],
                    "groups": []
                }
            },
            "DRAG_AND_DROP": {
                "identification": {
                    "id": "DRAG_AND_DROP",
                    "namespace": "",
                    "title": "DRAG_AND_DROP Apps"
                },
                "payload": {
                    "tiles": [
                        {
                            "id": "static_tile_0",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        },
                        {
                            "id": "static_tile_1",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        },
                        {
                            "id": "static_tile_2",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        },
                        {
                            "id": "static_tile_3",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        },
                        {
                            "id": "static_tile_4",
                            "target": {
                                "semanticObject": "App1",
                                "action": "viaStatic"
                            },
                            "vizId": "AppDesc1"
                        }
                    ],
                    "links": [],
                    "groups": []
                }
            },
            "URL_TILES": {
                "identification": {
                    "id": "URL_TILES",
                    "namespace": "",
                    "title": "URL Tiles"
                },
                "payload":  {
                    "tiles": [
                        {
                            "id": "urlTile",
                            "vizId": "urlTile"
                        }
                    ]
                }
            }
        },
        "visualizations": {
            "AppDesc1": {
                "vizType": "sap.ushell.StaticAppLauncher",
                "businessApp": "AppDesc1.BusinessApp",
                "vizConfig": {
                    "sap.flp": {
                        "target": {
                            "appId": "AppDesc1",
                            "inboundId": "start"
                        }
                    }
                }
            },
            "AppDesc2": {
                "vizType": "sap.ushell.StaticAppLauncher",
                "businessApp": "AppDesc2.BusinessApp",
                "vizConfig": {
                    "sap.flp": {
                        "target": {
                            "appId": "AppDesc2",
                            "inboundId": "start"
                        }
                    }
                }
            },
            "CustomTileApplication": {
                "vizType": "CustomTileApplication",
                "businessApp": "CustomTileApplication1.BusinessApp",
                "vizConfig": {
                    "sap.flp": {
                        "target": {
                            "appId": "CustomTileApplication1",
                            "inboundId": "start"
                        }
                    }
                }
            },
            "urlTile": {
                "vizType": "sap.ushell.StaticAppLauncher",
                "businessApp": "urlTile.BusinessApp",
                "vizConfig": {
                    "sap.app": {
                        "title": "SAP Website"
                    },
                    "sap.flp": {
                        "target": {
                            "type": "URL",
                            "url": "http://www.sap.com"
                        }
                    }
                }
            },
            "SomePlugin": {
                "vizType": "sap.ushell.StaticAppLauncher",
                "businessApp": "SomePlugin.BusinessApp",
                "vizConfig": {
                    "sap.flp": {
                        "target": {
                            "appId": "SomePlugin",
                            "inboundId": "Shell-plugin"
                        }
                    }
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
            "CustomTileApplication": {
                "sap.app": {
                    "id": "CustomTileApplication",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "title - Custom Tile",
                    "subTitle": "subtitle - Custom Tile",
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
        "_version": "3.0.0"
    };

    /*
     * CDM LaunchPageAdapter test data exposed by the CDM LPA
     */
    oLpaData.catalogs = oCdmData.site.catalogs;
    oLpaData.catalogTiles = {
        "AppDesc1": {
            "id": "AppDesc1",
            "tileIntent": "#App1-viaStatic?sap-ui-app-id-hint=AppDesc1",
            "tileResolutionResult": {
                "appId": "AppDesc1",
                "dataSources": undefined,
                "description": "",
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "icon": "sap-icon://Fiori2/F0018",
                "indicatorDataSource": undefined,
                "info": "info - Static App Launcher 1",
                "isCard": false,
                "isPlatformVisualization": false,
                "navigationMode": "newWindowThenEmbedded",
                "runtimeInformation": undefined,
                "size": "1x1",
                "subTitle": "subtitle - Static App Launcher 1",
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {
                    "componentName": "sap.ushell.components.tiles.cdm.applauncher"
                },
                "title": "title - Static App Launcher 1"
            },
            "vizId": "AppDesc1",
            "isCatalogTile": true
        },
        "AppDesc2": {
            "id": "AppDesc2",
            "tileIntent": "#App2-viaStatic?sap-ui-app-id-hint=AppDesc2",
            "tileResolutionResult": {
                "appId": "AppDesc2",
                "dataSources": undefined,
                "description": "",
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "icon": "sap-icon://Fiori2/F0023",
                "indicatorDataSource": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "navigationMode": "newWindowThenEmbedded",
                "runtimeInformation": undefined,
                "size": "1x1",
                "subTitle": "subtitle - App2",
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {
                    "componentName": "sap.ushell.components.tiles.cdm.applauncher"
                },
                "title": "App desc 2 title"
            },
            "vizId": "AppDesc2",
            "isCatalogTile": true
        },
        "CustomTileApplication1": {
            "id": "CustomTileApplication",
            "tileIntent": "#CustomTileApplication1-viaStatic?sap-ui-app-id-hint=CustomTileApplication1",
            "tileResolutionResult": {
                "appId": "CustomTileApplication1",
                "dataSources": undefined,
                "description": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": false,
                    "tablet": false
                },
                "icon": "sap-icon://Fiori2/F0023",
                "indicatorDataSource": undefined,
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "navigationMode": "newWindowThenEmbedded",
                "runtimeInformation": undefined,
                "size": "1x1",
                "subTitle": "Custom tile application 1 subtitle",
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {
                    "componentName": "sap.ushell.demotiles.cdm.customtile",
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                    }
                },
                "title": "Custom tile application 1 title"
            },
            "vizId": "CustomTileApplication",
            "isCatalogTile": true
        },
        "CustomTileApplication": {
            "id": "CustomTileApplication",
            "tileIntent": "#Shell-customTileWithTargetOutbound",
            "tileResolutionResult": {
                "appId": "CustomTileApplication",
                "dataSources": undefined,
                "description": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "icon": "sap-icon://time-entry-request",
                "indicatorDataSource": {
                    "path": "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
                    "refresh": 900
                },
                "info": undefined,
                "isCard": false,
                "isPlatformVisualization": false,
                "navigationMode": "newWindow",
                "runtimeInformation": {
                    "componentProperties": {
                      "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                    }
                },
                "size": "1x1",
                "subTitle": "subtitle - Custom Tile",
                "targetOutbound": {
                    "action": "toappnavsample",
                    "parameters": {
                        "XXX": {"value":{"value":"YYY"}}
                    },
                    "semanticObject": "Action"
                },
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {
                    "appId": "CustomTileApplication",
                    "applicationType": "URL",
                    "componentName": "sap.ushell.demotiles.cdm.customtile",
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {"url":"../../../../sap/ushell/demotiles/cdm/customtile"}
                    },
                    "systemAlias": undefined,
                    "systemAliasSemantics": "apply",
                    "text": "title - Custom Tile",
                    "url": "../../../../sap/ushell/demotiles/cdm/customtile",
                    "sap.ui": {
                        "technology": "URL"
                    }
                },
                "title": "title - Custom Tile"
            },
            "vizId": "CustomTileApplication",
            "isCatalogTile": true
        },
        "CustomTileApplicationWithoutTarget": {
            "id": "CustomTileApplicationWithoutTarget",
            "tileIntent": "#Shell-customTileWithOutTargetOutbound",
            "tileResolutionResult": {
                "appId": "CustomTileApplicationWithoutTarget",
                "dataSources": undefined,
                "description": undefined,
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "icon": "sap-icon://time-entry-request",
                "info": "info - Custom Tile w/o Target",
                "isCard": false,
                "isPlatformVisualization": false,
                "navigationMode": "newWindow",
                "size": "1x1",
                "subTitle": "subtitle - Custom Tile w/o Target",
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {
                    "applicationType": "URL",
                    "componentName": "sap.ushell.demotiles.cdm.customtile",
                    "componentProperties": {
                        "url": "../../../../sap/ushell/demotiles/cdm/customtile"
                    },
                    "sap.platform.runtime": {
                        "componentProperties": {"url":"../../../../sap/ushell/demotiles/cdm/customtile"}
                    },
                    "systemAlias": undefined,
                    "systemAliasSemantics": "apply",
                    "text": "title - Custom Tile",
                    "url": "../../../../sap/ushell/demotiles/cdm/customtile",
                    "sap.ui": {
                        "technology": "URL"
                    }
                },
                "title": "title - Custom Tile w/o Target"
            },
            "vizId": "CustomTileApplicationWithoutTarget",
            "isCatalogTile": true
        },
        "urlTile": {
            "id": "urlTile",
            "isCatalogTile": true,
            "tileIntent": "http://www.sap.com",
            "tileResolutionResult": {
              "appId": undefined,
              "dataSources": undefined,
              "description": "",
              "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
              },
              "icon": undefined,
              "indicatorDataSource": undefined,
              "info": undefined,
              "isCard": false,
              "isPlatformVisualization": false,
              "navigationMode": undefined,
              "runtimeInformation": undefined,
              "size": "1x1",
              "subTitle": undefined,
              "technicalInformation": undefined,
              "tileComponentLoadInfo": {
                "componentName": "sap.ushell.components.tiles.cdm.applauncher"
              },
              "title": "SAP Website"
            },
            "vizId": "urlTile"
        }
    };
    oLpaData.extensionCatalogTiles = {
        "3rdPartyApp1": {
            "contentProviderId": "Provider",
            "externalUrl": "https://www.example.com",
            "id": "3rdPartyApp1",
            "tileIntent": "https://www.example.com",
            "tileResolutionResult": {
                "appId": "3rdPartyApp1",
                "dataSources": undefined,
                "description": "",
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "icon": "sap-icon://sap-ui5",
                "indicatorDataSource": undefined,
                "info": "fake JAM",
                "isCard": false,
                "isPlatformVisualization": false,
                "navigationMode": "newWindow",
                "runtimeInformation": {
                    "uri": "https://www.example.com"
                  },
                "size": "1x1",
                "subTitle": "SAP JAM",
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {
                    "componentName": "sap.ushell.components.tiles.cdm.applauncher"
                },
                "title": "SAPUI5"
            },
            "vizId": "3rdPartyApp1",
            "isCatalogTile": true
        },
        "3rdPartyApp2": {
            "contentProviderId": "Provider",
            "externalUrl": "https://www.example.com?p1=v1",
            "id": "3rdPartyApp2",
            "tileIntent": "https://www.example.com?p1=v1",
            "tileResolutionResult": {
                "appId": "3rdPartyApp2",
                "dataSources": undefined,
                "description": "",
                "deviceTypes": {
                    "desktop": true,
                    "phone": true,
                    "tablet": true
                },
                "icon": "sap-icon://world",
                "indicatorDataSource": {
                    "path": "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
                    "refresh": 900
                },
                "info": "fake JAM",
                "isCard": false,
                "isPlatformVisualization": false,
                "navigationMode": "newWindow",
                "runtimeInformation": {
                    "uri": "https://www.example.com"
                },
                "size": "1x1",
                "subTitle": "SAP JAM",
                "technicalInformation": undefined,
                "tileComponentLoadInfo": {
                    "componentName": "sap.ushell.components.tiles.cdm.applauncherdynamic"
                },
                "title": "P&I - Products & Innovation"
            },
            "vizId": "3rdPartyApp2",
            "isCatalogTile": true
        }
    };

    /*
     * ClientSideTargetResolution test data exposed by the
     * ClientSideTargetResolution Service
     */
    oCstrData.resolvedTileHashes = {
        "#App1-viaStatic": {
            "appId": "AppDesc1",
            "icon": "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo": {
                "componentName": "sap.ushell.components.tiles.cdm.applauncher"
            },
            "title": "title - Static App Launcher 1",
            "subTitle": "subtitle - Static App Launcher 1",
            "info": "info - Static App Launcher 1",
            "isCard": false,
            "isPlatformVisualization": false,
            "navigationMode": "embedded"
        },
        "#App1-viaStatic-card": {
            "appId": "AppDesc1",
            "icon": "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo": {
                "componentName": "sap.ushell.components.tiles.cdm.applauncher"
            },
            "title": "title - Static App Launcher 1",
            "subTitle": "subtitle - Static App Launcher 1",
            "info": "info - Static App Launcher 1",
            "isCard": true,
            "navigationMode": "embedded"
        },
        "#App1-viaDynamic": {
            "appId": "AppDesc1",
            "title": "title - Dynamic App Launcher 1",
            "subTitle": "subtitle - Dynamic App Launcher 1",
            "icon": "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo": {
                "componentName": "sap.ushell.components.tiles.cdm.applauncherdynamic"
            },
            "isCard": false,
            "isPlatformVisualization": false,
            "navigationMode": "newWindow",
            "indicatorDataSource": {
                "path": "/sap/bc/service/$count",
                "refresh": 1000
            }
        },
        "#Dynamic-dataSourceFromManifest": {
            "title": "title - Dynamic App Launcher 1",
            "subTitle": "subtitle - dataSourceFromManifest",
            "icon": "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo": "#Dynamic-dataSourceFromManifest",
            "isCard": false,
            "isPlatformVisualization": false,
            "navigationMode": "newWindow",
            "indicatorDataSource": {
                "dataSource": "fooService",
                "path": "/foo/bar/$count",
                "refresh": 1000
            },
            "dataSources": {
                "fooService": {
                    "uri": "sap/opu/fooData/"
                }
            }
        },
        "#Dynamic-dataSourceAdjustToComponentUri": {
            "title": "title - Dynamic App Launcher 1",
            "subTitle": "subtitle - dataSourceFromManifest",
            "icon": "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo": "#Dynamic-dataSourceFromManifest",
            "isCard": false,
            "isPlatformVisualization": false,
            "navigationMode": "newWindow",
            "indicatorDataSource": {
                "dataSource": "odata",
                "path": "TestTileDetails('TEST_TILE_DETAILS')"
            },
            "dataSources": {
                "odata": {
                    "uri": "test/test.odata.svc/"
                }
            },
            "runtimeInformation": {
                "componentProperties": {
                    "url": "/component.relative.uri/~12345678910~/"
                }
            }
        },
        "#Dynamic-noDataSourceFromManifest": {
            "title": "title - Dynamic App Launcher 1",
            "subTitle": "subtitle - dataSourceFromManifest",
            "icon": "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo": "#Dynamic-dataSourceFromManifest",
            "isCard": false,
            "isPlatformVisualization": false,
            "navigationMode": "newWindow",
            "indicatorDataSource": {
                "path": "/foo/bar/$count",
                "refresh": 1000
            },
            "dataSources": undefined
        },
        "#Shell-customTile": {
            "title" : "title - Custom Tile",
            "subTitle" : "subtitle - Custom Tile",
            "icon" : "sap-icon://time-entry-request",
            "size" : "1x2",
            "tileComponentLoadInfo" : {
                "componentProperties" : {
                    "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
                },
                "sap.platform.runtime" : {
                    "componentProperties" : {
                        "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
                    }
                },
                "applicationType" : "URL",
                "text" : "News",
                "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                "componentName" : "sap.ushell.demotiles.cdm.newstile"
            }
        },
        "#Shell-customTileWithExcludeManifest": {
            "title" : "title - Custom Tile",
            "subTitle" : "subtitle - Custom Tile",
            "icon" : "sap-icon://time-entry-request",
            "size" : "1x2",
            "tileComponentLoadInfo" : {
                "componentProperties" : {
                    "name": "cus.demo.newstile",
                    "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                    "manifest": "/url/to/manifest",
                    "asyncHints": {}
                },
                "sap.platform.runtime" : {
                    "componentProperties" : {
                        "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                        "name": "cus.demo.newstile",
                        "manifest": "/url/to/manifest",
                        "asyncHints": {}
                    }
                },
                "applicationType" : "URL",
                "text" : "News",
                "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                "componentName" : "sap.ushell.demotiles.cdm.newstile"
            }
        },
        "#Shell-customTileWithIncludeManifest": {
            "title" : "title - Custom Tile",
            "subTitle" : "subtitle - Custom Tile",
            "icon" : "sap-icon://time-entry-request",
            "size" : "1x2",
            "tileComponentLoadInfo" : {
                "componentProperties" : {
                    "name": "cus.demo.newstile",
                    "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                    "manifest": {
                        // putting a real manifest here was not
                        // needed yet for the tests
                        "feel.free.to.extend": {}
                    },
                    "asyncHints": {}
                },
                "sap.platform.runtime" : {
                    "componentProperties" : {
                        "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                        "name": "cus.demo.newstile",
                        "asyncHints": {}
                    }
                },
                "applicationType" : "URL",
                "text" : "News",
                "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                "componentName" : "sap.ushell.demotiles.cdm.newstile"
            }
        },
        "#Shell-customTileWithTargetOutbound": {
            "title" : "title - Custom Tile",
            "subTitle" : "subtitle - Custom Tile",
            "icon" : "sap-icon://time-entry-request",
            "size" : "1x2",
            "isCard": false,
            "isPlatformVisualization": false,
            "navigationMode": "replace",
            "targetOutbound": {
                "semanticObject": "Action",
                "action": "toappnavsample",
                "parameters": {
                    "param1": {
                        "value": {
                            "value": "value1"
                        }
                    }
                }
            },
            "tileComponentLoadInfo" : {
                "componentProperties" : {
                    "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
                },
                "sap.platform.runtime" : {
                    "componentProperties" : {
                        "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
                    }
                },
                "applicationType" : "URL",
                "text" : "News",
                "url" : "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile",
                "componentName" : "sap.ushell.demotiles.cdm.newstile"
            }
        },
        "#App1-overwritten": {
            "appId": "AppDesc1",
            "title": "title - Static App Launcher over",
            "subTitle": "subtitle - Static App Launcher over",
            "icon": "sap-icon://Fiori2/F0022",
            "tileComponentLoadInfo": "#App1-overwritten"
        },
        "#App2-viaStatic": {
            "icon": "sap-icon://Fiori2/F0023",
            "appId": "AppDesc2",
            "subTitle": "subtitle - App2",
            "tileComponentLoadInfo": "#App2-viaStatic",
            "title": "App desc 2 title"
        },
        "#App3-viaStatic": {
            "title": "resolved title - App3",
            "subTitle": "resolved subtitle - App3",
            "icon": "sap-icon://Fiori2/F0023",
            "tileComponentLoadInfo": "#App3-viaStatic"
        },
        "#Stub-tileId" : {
            "title" : "title - Stub",
            "subTitle" : "subtitle - Stub",
            "icon" : "sap-icon://Fiori2/F0026",
            "tileComponentLoadInfo" : "#Stub-tileId"
        },
        "#Stub-tileAId" : {
            "title" : "title - Stub",
            "subTitle" : "subtitle - Stub",
            "icon" : "sap-icon://Fiori2/F0026",
            "tileComponentLoadInfo" : "#Stub-tileId"
        },
        "#Stub-tileBId" : {
            "title" : "title - Stub",
            "subTitle" : "subtitle - Stub",
            "icon" : "sap-icon://Fiori2/F0026",
            "tileComponentLoadInfo" : "#Stub-tileId"
        }
    };

    /*
     * CDM LaunchPageAdapter test data returned by the CommonDataModel getExternalSites method
     */
    oCdmData.contentProviderSiteWithOneCatalog = {
        "_version": "1.0.0",
        "site": {
            "identification": {
                "id": "0000-111-2222",
                "namespace": "",
                "title": "3rd Party Site",
                "description": "foo"
            },
            "payload": {
                "homeApp": {},
                "config": {},
                "groupsOrder": []
            }
        },
        "catalogs": {
            "3rdPartyCatalog1": {
                "identification": {
                    "id": "3rdPartyCatalog1",
                    "title": "3rd Party Catalog from Plugin"
                },
                "payload": {
                    "viz": [
                        "3rdPartyApp1",
                        "3rdPartyApp2"
                    ]
                }
            }
        },
        "visualizations": {
            "3rdPartyApp1": {
                "vizType": "sap.ushell.StaticAppLauncher",
                "vizConfig": {
                    "sap.flp": {
                        "target": {
                            "appId": "3rdPartyApp1",
                            "inboundId": "Shell-launchURL"
                        }
                    }
                }
            },
            "3rdPartyApp2": {
                "vizType": "sap.ushell.DynamicAppLauncher",
                "vizConfig": {
                    "sap.flp": {
                        "target": {
                            "appId": "3rdPartyApp2",
                            "inboundId": "Shell-launchURL"
                        },
                        "indicatorDataSource": {
                            "path": "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
                            "refresh": 900
                        }
                    }
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
            }
        },
        "applications": {
            "3rdPartyApp1": {
                "sap.app": {
                    "id": "3rdPartyApp1",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "SAPUI5",
                    "subTitle": "SAP JAM",
                    "info": "fake JAM",
                    "crossNavigation": {
                        "inbounds": {
                            "Shell-launchURL": {
                                "semanticObject": "Shell",
                                "action": "launchURL",
                                "signature": {
                                    "parameters": {
                                        "sap-external-url": {
                                            "required": true,
                                            "launcherValue": {
                                                "value": "https://www.example.com"
                                            },
                                            "filter": {
                                                "value": "https://www.example.com",
                                                "format": "plain"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    "_version": "1.3.0",
                    "technology": "URL",
                    "icons": {
                        "icon": "sap-icon://sap-ui5"
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": true
                    }
                },
                "sap.platform.runtime": {
                    "uri": "https://www.example.com"
                }
            },
            "3rdPartyApp2": {
                "sap.app": {
                    "id": "3rdPartyApp2",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "P&I - Products & Innovation",
                    "subTitle": "SAP JAM",
                    "info": "fake JAM",
                    "crossNavigation": {
                        "inbounds": {
                            "Shell-launchURL": {
                                "semanticObject": "Shell",
                                "action": "launchURL",
                                "signature": {
                                    "parameters": {
                                        "sap-external-url": {
                                            "required": true,
                                            "launcherValue": {
                                                "value": "https://www.example.com?p1=v1"
                                            },
                                            "filter": {
                                                "value": "https://www.example.com?p1=v1",
                                                "format": "plain"
                                            }
                                        }
                                    }
                                },
                                "indicatorDataSource": {
                                    "path": "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
                                    "refresh": 900
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    "_version": "1.3.0",
                    "technology": "URL",
                    "icons": {
                        "icon": "sap-icon://world"
                    },
                    "deviceTypes": {
                        "desktop": true,
                        "tablet": true,
                        "phone": true
                    }
                },
                "sap.platform.runtime": {
                    "uri": "https://www.example.com"
                }
            }
        },
        "groups": {},
        "systemAliases": {}
    };

    oCdmData.contentProviderSiteWithMultipleCatalogs = {
        "_version": "1.0.0",
        "site": {
            "identification": {
                "id": "3333-444-5555",
                "namespace": "",
                "title": "3rd Party Multi-catalog Site",
                "description": "fie"
            },
            "payload": {
                "homeApp": {},
                "config": {},
                "groupsOrder": []
            }
        },
        "catalogs": {
            "3rdPartyCatalogA": {
                "identification": {
                    "id": "3rdPartyCatalogA",
                    "title": "3rd Party Catalog from Plugin A"
                },
                "payload": {
                    "appDescriptors": [{
                        "id": "3rdPartyAppA"
                    }]
                }
            },
            "3rdPartyCatalogB": {
                "identification": {
                    "id": "3rdPartyCatalogB",
                    "title": "3rd Party Catalog from Plugin B"
                },
                "payload": {
                    "appDescriptors": [{
                        "id": "3rdPartyAppB"
                    }]
                }
            }
        },
        "applications": {
            "3rdPartyAppA": {
                "sap.app": {
                    "id": "3rdPartyAppA",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "SAPUI5",
                    "subTitle": "SAP JAM",
                    "info": "fake JAM",
                    "crossNavigation": {
                        "inbounds": {
                            "Shell-launchURL": {
                                "semanticObject": "Shell",
                                "action": "launchURL",
                                "signature": {
                                    "parameters": {
                                        "sap-external-url": {
                                            "required": true,
                                            "launcherValue": {
                                                "value": "https://jam4.sapjam.com/groups/about_page/7MFgdXHJVVv2BWC8g0Ubep"
                                            },
                                            "filter": {
                                                "value": "https://jam4.sapjam.com/groups/about_page/7MFgdXHJVVv2BWC8g0Ubep",
                                                "format": "plain"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    "_version": "1.3.0",
                    "technology": "URL",
                    "icons": {
                        "icon": "sap-icon://sap-ui5"
                    },
                    "deviceTypes": { "desktop": true, "tablet": true, "phone": true }
                },
                "sap.platform.runtime": {
                    "uri": "https://jam4.sapjam.com/groups/about_page/7MFgdXHJVVv2BWC8g0Ubep"
                }
            },
            "3rdPartyAppB": {
                "sap.app": {
                    "id": "3rdPartyAppB",
                    "applicationVersion": {
                        "version": "1.0.0"
                    },
                    "title": "P&I - Products & Innovation",
                    "subTitle": "SAP JAM",
                    "info": "fake JAM",
                    "crossNavigation": {
                        "inbounds": {
                            "Shell-launchURL": {
                                "semanticObject": "Shell",
                                "action": "launchURL",
                                "signature": {
                                    "parameters": {
                                        "sap-external-url": {
                                            "required": true,
                                            "launcherValue": {
                                                "value": "https://jam4.sapjam.com/groups/about_page/XVL4EFif3DZFfW0PQNf0Tt"
                                            },
                                            "filter": {
                                                "value": "https://jam4.sapjam.com/groups/about_page/XVL4EFif3DZFfW0PQNf0Tt",
                                                "format": "plain"
                                            }
                                        }
                                    }
                                },
                                "indicatorDataSource": {
                                    "path": "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
                                    "refresh": 900
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    "_version": "1.3.0",
                    "technology": "URL",
                    "icons": {
                        "icon": "sap-icon://world"
                    },
                    "deviceTypes": { "desktop": true, "tablet": true, "phone": true }
                },
                "sap.platform.runtime": {
                    "uri": "https://jam4.sapjam.com/groups/about_page/XVL4EFif3DZFfW0PQNf0Tt"
                }
            }
        },
        "groups": {},
        "systemAliases": {}
    };

})();

