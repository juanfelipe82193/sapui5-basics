// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(function () {
    "use strict";

    return {
        "sap.app": {
            type: "card"
        },
        "sap.ui5": {
            services: {
                UserFrequents: {
                    factoryName: "sap.ushell.ui5service.UserFrequents"
                }
            }
        },
        "sap.flp": {
            rows: 3,
            columns: 4
        },
        "sap.card": {
            type: "List",
            header: {
                title: "Top Frequently Used",
                subtitle: "",
                icon: {
                    src: "sap-icon://add"
                },
                status: {
                    text: "2 frequently used ones"
                }
            },
            content: {
                data: {
                    service: {
                        name: "UserFrequents"
                    }
                },
                item: {
                    icon: {
                        label: "{{icon_label}}",
                        value: "{icon}"
                    },
                    title: {
                        label: "{{title_label}}",
                        value: "{Name}"
                    },
                    description: {
                        label: "{{description_label}}",
                        value: "{Description}"
                    },
                    interactionType: "{interactionType}",
                    actions: [
                        {
                            type: "Navigation",
                            enabled: true,
                            url: "#Action-tohiddenlink"
                        }
                    ]
                }
            }
        }
    };
});
