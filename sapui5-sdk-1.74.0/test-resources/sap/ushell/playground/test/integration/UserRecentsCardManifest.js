// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(function () {
    "use strict";

    return {
        "sap.app": {
            type: "card"
        },
        "sap.ui5": {
            services: {
                UserRecents: {
                    factoryName: "sap.ushell.ui5service.UserRecents"
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
                title: "Top Recent Activities",
                subtitle: "",
                icon: {
                    src: "sap-icon://time-entry-request"
                },
                status: {
                    text: "100 of 200"
                }
            },
            content: {
                data: {
                    service: {
                        name: "UserRecents"
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
                            target: "_blank",
                            url: "https://www.sap.com/corporate/en.html"
                        }
                    ]
                }
            }
        }
    };
});