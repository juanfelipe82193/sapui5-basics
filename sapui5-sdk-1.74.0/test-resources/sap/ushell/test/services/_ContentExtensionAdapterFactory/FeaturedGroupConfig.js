// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Provide mock feature group data
 *
 * @version 1.74.0
 * @private
 */
sap.ui.define([
], function () {
    "use strict";

    var oFeaturedGroupConfig = {},
        oFeatureGroups = {
        groups: [{
            "id": "featuredGroup",
            "contentProvider": "featured",
            "isPersonalizationLocked": function () {
                return true;
            },
            "getTitle": function () {
                return "Featured";
            },
            "title": "Featured",
            "isFeatured": true,
            "isPreset": true,
            "isVisible": true,
            "isDefaultGroup": false,
            "isGroupLocked": true,
            "tiles": [{
                id: "FrequentsCard",
                contentProvider: "featured",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "FrequentsCard",
                tileType: "sap.ui.integration.widgets.Card",
                isCard: true,
                type: "frequent",
                manifest: {
                    "sap.flp": {
                        "columns": "4",
                        "rows": "3"
                    },
                    "sap.app": {
                        "type": "card"
                    },
                    "sap.ui5": {
                        "services": {
                            "CardNavigationService": {
                                "factoryName": "sap.ushell.ui5service.CardNavigation"
                            },
                            "CardUserFrequentsService": {
                                "factoryName": "sap.ushell.ui5service.CardUserFrequents"
                            }
                        }
                    },
                    "sap.card": {
                        "type": "List",
                        "header": {
                            "title": "Frequently Used",
                            "status": {
                                "text": "Top 3"
                            },
                            "actions": [{
                                "type": "Navigation",
                                "service": "CardNavigationService",
                                "parameters": {
                                    "openUI": "FrequentActivities"
                                }
                            }]
                        },
                        "content": {
                            "maxItems": 3,
                            "data": {
                                "service": {
                                    "name": "CardUserFrequentsService"
                                }
                            },
                            "item": {
                                "title": {
                                    "value": "{Name}"
                                },
                                "description": {
                                    "value": "{Description}"
                                },
                                "highlight": "{Highlight}",
                                "icon": {
                                    "src": "{= ${Icon} === undefined ? 'sap-icon://product' : ${Icon} }",
                                    "label": "icon"
                                },
                                "actions": [{
                                    "type": "Navigation",
                                    "service": "CardNavigationService",
                                    "parameters": {
                                        "title": "{Name}",
                                        "url": "{Url}",
                                        "intentSemanticObject": "{Intent/SemanticObject}",
                                        "intentAction": "{Intent/Action}",
                                        "intentAppRoute": "{Intent/AppSpecificRoute}",
                                        "intentParameters": "{Intent/Parameters}"
                                    }
                                }]
                            }
                        }
                    }
                }
            },
            {
                id: "RecentsCard",
                contentProvider: "featured",
                formFactor: "Desktop,Tablet,Phone",
                chipId: "RecentsCard",
                tileType: "sap.ui.integration.widgets.Card",
                isCard: true,
                type: "recent",
                manifest: {
                    "sap.flp": {
                        "columns": "4",
                        "rows": "3"
                    },
                    "sap.app": {
                        "type": "card"
                    },
                    "sap.ui5": {
                        "services": {
                            "CardNavigationService": {
                                "factoryName": "sap.ushell.ui5service.CardNavigation"
                            },
                            "CardUserRecentsService": {
                                "factoryName": "sap.ushell.ui5service.CardUserRecents"
                            }
                        }
                    },
                    "sap.card": {
                        "type": "List",
                        "header": {
                            "title": "Recent Activities",
                            "status": {
                                "text": "Top 3"
                            },
                            "actions": [{
                                "type": "Navigation",
                                "service": "CardNavigationService",
                                "parameters": {
                                    "openUI": "RecentActivities"
                                }
                            }]
                        },
                        "content": {
                            "maxItems": 3,
                            "data": {
                                "service": {
                                    "name": "CardUserRecentsService"
                                }
                            },
                            "item": {
                                "title": {
                                    "label": "{{title_label}}",
                                    "value": "{Name}"
                                },
                                "description": {
                                    "label": "{{description_label}}",
                                    "value": "{Description}"
                                },
                                "icon": {
                                    "src": "{= ${Icon} === undefined ? 'sap-icon://product' : ${Icon} }",
                                    "label": "icon"
                                },
                                "highlight": "{Highlight}",
                                "actions": [{
                                    "type": "Navigation",
                                    "service": "CardNavigationService",
                                    "parameters": {
                                        "title": "{Name}",
                                        "url": "{Url}",
                                        "intentSemanticObject": "{Intent/SemanticObject}",
                                        "intentAction": "{Intent/Action}",
                                        "intentAppRoute": "{Intent/AppSpecificRoute}",
                                        "intentParameters": "{Intent/Parameters}"
                                    }
                                }]
                            }
                        }
                    }
                }
            }]
        }]
    };

    oFeaturedGroupConfig.getMockAdapterConfig = function (bEnableFrequentCard, bEnableRecentCard) {
        var oConfig = {
            groups: []
        };

        oFeatureGroups.groups.forEach(function (group) {
            group.tiles = group.tiles.filter(function (oElement) {
                return bEnableFrequentCard && (oElement.type === "frequent") || (bEnableRecentCard && (oElement.type === "recent"));
            });
            oConfig.groups.push(group);
        });

        return oConfig;
    };

    return oFeaturedGroupConfig;

}, /* bExport = */ true);