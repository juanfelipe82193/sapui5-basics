window.addEventListener("load", function () {
    var oTCO = new sap.m.IconTabBar({
        id: "OverflowContainer",
        items: [
            new sap.m.IconTabFilter({
                key: "key1",
                count: "1",
                text: "Business",
                icon: "sap-icon://task",
                content: new sap.ca.ui.OverflowContainer({
                    content: [
                        new sap.ui.layout.form.SimpleForm({
                            minWidth: 1024,
                            maxContainerCols: 2,
                            content: [
                                new sap.m.Label({ // this starts a new group
                                    text: "Company Address"
                                }),
                                new sap.m.Label({
                                    text: 'Name'
                                }),
                                new sap.m.Text({
                                    text: 'SAP Germany'
                                }),
                                new sap.m.Label({
                                    text: 'Street'
                                }),
                                new sap.m.Text({
                                    text: 'Dietmar-Hopp-Allee 16'
                                }),
                                new sap.m.Label({
                                    text: 'City'
                                }),
                                new sap.m.Text({
                                    text: '69190 Walldorf'
                                }),
                                new sap.m.Label({
                                    text: 'Country'
                                }),
                                new sap.m.Text({
                                    text: 'Germany'
                                })
                            ]
                        })
                    ]
                })
            }),
            new sap.m.IconTabFilter({
                key: "key2",
                text: "Q/A",
                icon: "sap-icon://task",
                content: new sap.ca.ui.OverflowContainer({
                    content: [
                        new sap.m.List({
                            items: [
                                new sap.m.FeedListItem({
                                    sender: "Giselle Ashante-Ramirez",
                                    info: "Request",
                                    timestamp: "March 03, 2013",
                                    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
                                }),
                                new sap.m.FeedListItem({
                                    sender: "Johannes Schaffensteiger",
                                    info: "Reply",
                                    timestamp: "March 04, 2013",
                                    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore"
                                }),
                                new sap.m.FeedListItem({
                                    sender: "Giselle Ashante-Ramirez",
                                    info: "Request",
                                    timestamp: "March 04, 2013",
                                    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat"
                                }),
                                new sap.m.FeedListItem({
                                    sender: "Johannes Schaffensteiger",
                                    info: "Rejection",
                                    timestamp: "March 07, 2013",
                                    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });

    oTCO.placeAt("contentArea");
});
