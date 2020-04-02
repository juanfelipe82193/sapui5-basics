// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel, setTimeout*/

(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.demo.AllMyApps.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    sap.ui.core.UIComponent.extend("sap.ushell.demo.AllMyApps.Component", {

        // use inline declaration instead of component.json to save 1 round trip
        metadata : {
            "manifest": "json"
        },

        createContent : function () {
            var oAllMyAppsService = sap.ushell.Container.getService("AllMyApps");
            if (oAllMyAppsService.isEnabled() === true) {
                var oProvider1 = {
                    getTitle : function () {
                        return "ProviderTitle1";
                    },
                    getData : function () {
                        var oDeferred = new jQuery.Deferred();
                        oDeferred.resolve([
                            { // Group 1
                                title: "Provider1 Group1",
                                apps: [
                                    {
                                        title: "P1_G1_Title111 1111",
                                        subTitle: "P1_G1_SubTitle1 subtitle",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G1_Title2",
                                        subTitle: "P1_G1_SubTitle222222222222",
                                        url: "https://www.youtube.com/"
                                    }
                                ]
                            }, { // Group 2
                                title: "Provider1 Group2",
                                apps: [
                                    {
                                        title: "P1_G2_Title1",
                                        subTitle: "",
                                        url: "http://www.ynet.co.il"
                                    }, {
                                        title: "P1_G2_Title2 Title2 P1_G2_Title2",
                                        subTitle: "P1_G2_SubTitle2 P1_G2_",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title3",
                                        subTitle: "P1_G2_",
                                        url: "#Action-todefaultapp"
                                    },{
                                        title: "P1_G2_Title3_",
                                        subTitle: "P1_G2__",
                                        url: "#Action-todefaultapp"
                                    },{
                                        title: "P1_G2_Title3___",
                                        subTitle: "P1_G2____",
                                        url: "#Action-todefaultapp"
                                    },{
                                        title: "P1_G2_Title3_________",
                                        subTitle: "P1_G2___________________",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "",
                                        subTitle: "P1_G2_SubTitle - missing title",
                                        url: "http://www.google.com"
                                    }, {
                                        title: "P1_G2_Title5 title 5 title 5 title 5",
                                        subTitle: "",
                                        url: "http://www.ynet.co.il"
                                    }, {
                                        title: "P1_G2_Title6",
                                        subTitle: "P1",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title7777777 P1_G2_Title777777777777777777777777777",
                                        subTitle: "P1_G2_SubTitle7 subtitle 7777777777777777777777777",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title8",
                                        subTitle: "P1_G2_SubTitle8",
                                        url: "http://www.google.com"
                                    }, {
                                        title: "P1_G2_Title9",
                                        subTitle: "P1_G2_SubTitle9",
                                        url: "http://www.ynet.co.il"
                                    }, {
                                        title: "P1_G2 222222222222222222222222222222222222222222",
                                        subTitle: "222222222222222222222222222222222222222222",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title11111111111111111111111111111111111",
                                        subTitle: "P1_G2_SubTitle1111111111111111111111111111111111111",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title12 2121212121212121212121212",
                                        subTitle: "P1_G2_SubTitle12 2121212121212121212121212",
                                        url: "http://www.google.com"
                                    }, {
                                        title: "P1_G2_Title13",
                                        subTitle: "P1_G2_SubTitle13",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title14",
                                        subTitle: "P1_G2_SubTitle14",
                                        url: "http://www.google.com"
                                    }, {
                                        title: "P1_G2_Title15",
                                        subTitle: "P1_G2_SubTitle15",
                                        url: "http://www.ynet.co.il"
                                    }, {
                                        title: "P1_G2_Title16",
                                        subTitle: "P1_G2_SubTitle16",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title17",
                                        subTitle: "P1_G2_SubTitle17",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title18",
                                        subTitle: "P1_G2_SubTitle18",
                                        url: "http://www.google.com"
                                    }, {
                                        title: "P1_G2_Title19",
                                        subTitle: "P1_G2_SubTitle19",
                                        url: "#Action-todefaultapp"
                                    }, {
                                        title: "P1_G2_Title120",
                                        subTitle: "P1_G2_SubTitle20",
                                        url: "http://www.google.com"
                                    }
                                ]
                            }
                        ]);
                        return oDeferred.promise();
                    }
                };

                var oProvider2 = {
                        getTitle : function () {
                            return "ProviderTitle2";
                        },
                        getData : function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve([
                                { // Group 1
                                    title: "Provider2 Group1",
                                    apps: [
                                        {
                                            title: "P2_G1_Title1 title title",
                                            subTitle: "P2_G1_SubTitle1",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P2_G1_Title2",
                                            subTitle: "P2_G1_SubTitle2 P2_G1_SubTitle2 P2_G1_SubTitle2 ",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P2_G1_Title3",
                                            subTitle: "P2_G1_SubTitle3",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P2_G1_Title34",
                                            subTitle: "P2_G1_SubTitle4 subtitle subtitle subtitle",
                                            url: "http://www.google.com"
                                        }, {
                                            title: "P2_G1_Title5",
                                            subTitle: "P2_G1_SubTitle5",
                                            url: "http://www.ynet.co.il"
                                        }, {
                                            title: "P2_G1_Title6 7890 7890 7890 7890",
                                            subTitle: "P2_G1_SubTitle6",
                                            url: "#Action-todefaultapp"
                                        }
                                    ]
                                }, { // Group 2
                                    title: "Provider2 Group2",
                                    apps: [
                                        {
                                            title: "P2_G2_Title1111111111111111111111111",
                                            subTitle: "P2_G2_SubTitle1",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P2_G2_Title2",
                                            subTitle: "P2_G2_SubTitle222222",
                                            url: "http://www.google.com"
                                        }
                                    ]
                                }
                            ]);
                            return oDeferred.promise();
                        }
                    };

                var oProvider3 = {
                        getTitle : function () {
                            return "ProviderTitle3";
                        },
                        getData : function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve([
                                { // Group 1
                                    title: "Provider3 Group1",
                                    apps: [
                                        {
                                            title: "P3_G1_Title1",
                                            subTitle: "P3_G1_SubTitle1 long string long string long string ",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P3_G1_Title2 long title long title long title",
                                            subTitle: "P3_G1_SubTitle2",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P3_G1_Title3",
                                            subTitle: "P3_G1_SubTitle3",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P3_G1_Title4",
                                            subTitle: "P3_G1_SubTitle4 long string long string long string ",
                                            url: "http://www.ynet.co.il"
                                        }, {
                                            title: "P3_G1_Title5",
                                            subTitle: "P3_G1_SubTitle5",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P3_G1_Title6 long string long string long string",
                                            subTitle: "P3_G2_SubTitle6",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P33_G2_Title7",
                                            subTitle: "P3_G1_SubTitle7 long string long string long string ",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P3_G1_Title8",
                                            subTitle: "P3_G1_SubTitle8",
                                            url: "#Action-todefaultapp"
                                        }
                                    ]
                                }, { // Group 2
                                    title: "Provider3 Group2",
                                    apps: [
                                        {
                                            title: "P3_G2_Title1 long string long string long string",
                                            subTitle: "P3_G2_SubTitle1",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P3_G2_Title2",
                                            subTitle: "P3_G2_SubTitle2",
                                            url: "https://www.youtube.com/"
                                        }
                                    ]
                                }
                            ]);
                            return oDeferred.promise();
                        }
                    };

                var oProvider4 = {
                        getTitle : function () {
                            return "ProviderTitle4";
                        },
                        getData : function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve([
                                { // Group 1
                                    title: "Provider2 Group1",
                                    apps: [
                                        {
                                            title: "P4_G1_Title1",
                                            subTitle: "P4_G1_SubTitle1",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P4_G1_Title2 long string long string long string",
                                            subTitle: "P4_G1_SubTitle2 subtitle with many chars subtitle with many chars",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P4_G1_Title3",
                                            subTitle: "P4_G1_SubTitle3",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P4_G1_Title34",
                                            subTitle: "P4_G1_SubTitle4",
                                            url: "http://www.google.com"
                                        }, {
                                            title: "P4_G1_Title5",
                                            subTitle: "P4_G1_SubTitle5 subtitle with many chars subtitle with many chars",
                                            url: "http://www.ynet.co.il"
                                        }, {
                                            title: "P4_G1_Title6",
                                            subTitle: "P4_G1_SubTitle6",
                                            url: "#Action-todefaultapp"
                                        }
                                    ]
                                }
                            ]);
                            return oDeferred.promise();
                        }
                    };
                var oProvider5 = {
                        getTitle : function () {
                            return "ProviderTitle5";
                        },
                        getData : function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve([
                                {
                                    title: "Provider5 Group1",
                                    apps: [
                                        {
                                            title: "P5_G1_Title1 long string long string long string",
                                            subTitle: "P5_G1_SubTitle1",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P5_G1_Title2",
                                            subTitle: "P5_G1_SubTitle2 subtitle with many chars subtitle with many chars",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P5_G1_Title3",
                                            subTitle: "P5_G1_SubTitle3",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P5_G1_Title4",
                                            subTitle: "P5_G1_SubTitle4 subtitle with many chars subtitle with many chars",
                                            url: "https://www.sap.com/"
                                        }, {
                                            title: "P5_G1_Title5 long string long string long string",
                                            subTitle: "P5_G1_SubTitle5",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P5_G1_Title6 long string long string long string",
                                            subTitle: "P5_G1_SubTitle6subtitle with many chars subtitle with many chars",
                                            url: "https://www.youtube.com/"
                                        }, {
                                            title: "P5_G1_Title7",
                                            subTitle: "P5_G1_SubTitle7",
                                            url: "https://www.sap.com/"
                                        }
                                    ]
                                }, {
                                    title: "Provider5 Group2",
                                    apps: [
                                        {
                                            title: "P5_G2_Title1",
                                            subTitle: "P5_G2_SubTitle1",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P5_G2_Title2",
                                            subTitle: "P5_G2_SubTitle2",
                                            url: "https://www.youtube.com/"
                                        }
                                    ]
                                }, {
                                    title: "Provider5 Group2",
                                    apps: [
                                        {
                                            title: "P5_G3_Title1",
                                            subTitle: "P5_G3_SubTitle1",
                                            url: "#Action-todefaultapp"
                                        }, {
                                            title: "P5_G3_Title2",
                                            subTitle: "P5_G3_SubTitle2",
                                            url: "https://www.youtube.com/"
                                        }
                                    ]
                                }
                            ]);
                            return oDeferred.promise();
                        }
                    };
                var oProvider6 = {
                        getTitle : function () {
                            return "ProviderTitle6";
                        },
                        getData : function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve([
                                {
                                    title: "P6_G1_Title1",
                                    subTitle: "P6_G1_SubTitle1",
                                    url: "#Action-todefaultapp"
                                }, {
                                    title: "P6_G1_Title2",
                                    subTitle: "P6_G1_SubTitle2",
                                    url: "https://www.youtube.com/"
                                }, {
                                    title: "P6_G1_Title3",
                                    subTitle: "P6_G1_SubTitle3",
                                    url: "#Action-todefaultapp"
                                }, {
                                    title: "P6_G1_Title34",
                                    subTitle: "P6_G1_SubTitle4",
                                    url: "http://www.google.com"
                                }, {
                                    title: "P6_G1_Title5",
                                    subTitle: "P6_G1_SubTitle5",
                                    url: "http://www.ynet.co.il"
                                }, {
                                    title: "P6_G1_Title6",
                                    subTitle: "P6_G1_SubTitle6",
                                    url: "#Action-todefaultapp"
                                }
                            ]);
                            return oDeferred.promise();
                        }
                    };
                var oProvider7 = {
                        getTitle : function () {
                            return "ProviderTitle7";
                        },
                        getData : function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve();
                            return oDeferred.promise();
                        }
                    };
                var oProvider8 = {
                        getTitle : function () {
                            return "ProviderTitle5";
                        },
                        getData : function () {
                            var oDeferred = new jQuery.Deferred();
                            oDeferred.resolve();
                            return oDeferred.promise();
                        }
                    };

                oAllMyAppsService.registerExternalProvider("ExternalProvider1", oProvider1);
                oAllMyAppsService.registerExternalProvider("ExternalProvider2", oProvider2);
                oAllMyAppsService.registerExternalProvider("ExternalProvider3", oProvider3);
                oAllMyAppsService.registerExternalProvider("ExternalProvider4", oProvider4);
                oAllMyAppsService.registerExternalProvider("ExternalProvider5", oProvider5);
                oAllMyAppsService.registerExternalProvider("ExternalProvider6", oProvider6);
                oAllMyAppsService.registerExternalProvider("ExternalProvider7", oProvider7);
                oAllMyAppsService.registerExternalProvider("ExternalProvider8", oProvider8);

            }
        }
    });
}());
