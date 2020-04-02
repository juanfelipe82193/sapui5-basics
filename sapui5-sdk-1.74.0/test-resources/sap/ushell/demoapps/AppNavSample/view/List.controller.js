// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global sap, jQuery*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.List", {

    oApplication : null,
    oDialog: null,
    oPopover: null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.List
*/
    onInit: function () {
        "use strict";
        var that = this,
            bFallback = this._detectFallback(),
            srvc,
            page,
            myComponent,
            oAppSettingsButton;

        if (bFallback) {
            this.getView().byId("FallbackSwitch").setState(true);
        }


        myComponent = this.getMyComponent();
        if (myComponent.getComponentData().startupParameters) {
            jQuery.sap.log.debug("startup parameters of appnavsample are " + JSON.stringify(myComponent.getComponentData().startupParameters));
        }
        page = this.oView.getContent()[0];
        srvc = sap.ushell.services.AppConfiguration;
        if (srvc) {
            page.setShowFooter(true);
            oAppSettingsButton = new sap.m.Button({
                text: "App Settings",
                press: function () {
                    sap.ushell.Container.getService("Message").info("app settings button clicked");
                }
            });
            that = this;
            srvc.addApplicationSettingsButtons([oAppSettingsButton]);
            this.oActionSheet = new sap.m.ActionSheet({ id: this.getView().getId() + "actionSheet", placement: sap.m.PlacementType.Top });
            if (sap.ushell && sap.ushell.ui && sap.ushell.ui.footerbar) {
                this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
                this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
                this.oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton({id: this.getView().getId() + "saveAsTile"}));
            }
            this.oActionsButton = new sap.m.Button({
                id: this.getView().getId() + "actionSheetButton",
                press : function () {
                    that.oActionSheet.openBy(this);
                },
                icon : "sap-icon://action"
            });
            if (srvc && typeof srvc.getSettingsControl === "function") {
                page.setFooter(new sap.m.Bar({
//                    contentLeft: srvc.getSettingsControl(),
                    contentRight: this.oActionsButton
                }));
            }

            this.getView().byId("idJamShareButton").setJamData({
                object: {
                    id: window.location.href,
                    share: "static text to share in JAM together with the URL"
                }
            });
        }

        // Store initial navigation in the model
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            var bIsInitialNavigation = oCrossAppNavigator.isInitialNavigation();

            that.oModel = new sap.ui.model.json.JSONModel({
                isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
                isInitialNavigationColor: bIsInitialNavigation ? "green" : "red"
            });
            that.getView().setModel(that.oModel, "listModel");
        });
    },
    trackDataEvent : function () {
        "use strict";
        var inputFieldValue = this.getView().byId("dataInput").getValue(),
            srv = sap.ushell.Container.getService("UsageAnalytics");
        srv.logCustomEvent("Test", "Track Data Event", [inputFieldValue]);
    },
    getMyComponent: function () {
        "use strict";
        return this.getOwnerComponent();
    },

	handleHomePress : function () {
		"use strict";
		this.oApplication.navigate("toView", "Detail");
	},

	handleHomeWithParams : function () {
		"use strict";
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.toExternal({
                target: { semanticObject : "Action", action: "toappnavsample" },
                params : { zval : "some data", date : new Date().toString()}
            });
        });
	},
	handleHomeWithLongUrl : function () {
		"use strict";
        var that = this,
            s =  new Date().toString(),
			i,
			params = { zval : "some data", date : Number(new Date()), "zzzdate" : Number(new Date())};

        for (i = 0; i < 20; i = i + 1) {
			s = s + "123456789" + "ABCDEFGHIJKLMNOPQRSTUVWXY"[i];
		}
		for (i = 0; i < 20; i = i + 1) {
			params["zz" + i] = "zz" + i + s;
		}

        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.toExternal({
				target: { semanticObject : "Action", action: "toappnavsample" },
				params : params
			},
			that.getOwnerComponent());
        });
	},

	handleBtnBackPress : function () {
		"use strict";
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.backToPreviousApp();
        });
	},

	handleBtnHomePress : function () {
		"use strict";
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.toExternal({
			    target: { shellHash : "#" }
		    });
        });
	},

    /*
        Inner app navigation handlers
     */
	handleView4Nav : function () {
		"use strict";
		this.oApplication.navigate("toView", "View4");
	},
	handleView1Nav : function () {
		"use strict";
		this.oApplication.navigate("toView", "View1");
	},
	handleSmartNavSampleBtnPress: function () {
		"use strict";
		this.oApplication.navigate("toView", "SmartNavSample");
	},

    handleSapTagPageNav: function () {
	    "use strict";
        this.oApplication.navigate("toView", "SapTagSample");
    },

	/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.List
*/
//  onBeforeRendering: function() {
//
//  },

    /*
        Testing Features Links
     */

	onDirtyStateChange : function (oEvt) {
        "use strict";
        var bState = oEvt.getParameter("state");
		sap.ushell.Container.setDirtyFlag(bState);
    },

    _detectFallback : function () {
        "use strict";
        var sURL = window.location.href;
	    return sURL.indexOf("?bFallbackToShellHome=true") > -1;
    },

    onFallbackChanged : function (oEvt) {
        "use strict";
	    var bState = oEvt.getParameter("state");
	    var sURL = window.location.href;
	    var sSplitter = this._detectFallback() ? "FioriLaunchpad.html?bFallbackToShellHome=true&" : "FioriLaunchpad.html";
	    var aURLParts = sURL.split(sSplitter);
	    sURL = aURLParts[0] + (bState ? "FioriLaunchpad.html?bFallbackToShellHome=true&" : "FioriLaunchpad.html") + aURLParts[1];
	    window.location.href = sURL;
    },

    handleBtn2Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View2");
    },
    handleBtn3Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View3");
    },


    handleBtnBackDetailPress : function () {
        "use strict";
        this.oApplication.navigate("backDetail", "");
    },
    handleBtnFwdPress : function () {
        "use strict";
        this.oApplication.navigate("Fwd", "");
    },
    handleSetDirtyFlagOn : function () {
        "use strict";
        sap.ushell.Container.setDirtyFlag(true);
    },
    handleSetDirtyFlagOff : function () {
        "use strict";
        sap.ushell.Container.setDirtyFlag(false);
    },
    handleSetFallBackToShellHomeOn : function () {
        "use strict";
        window.location.href = 'http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?bFallbackToShellHome=true#Action-toappnavsample';
    },
    handleSetFallBackToShellHomeOff : function () {
        "use strict";
        window.location.href = 'http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html#Action-toappnavsample';
    },
    handleOpenDialogPress: function () {
        "use strict";
        if (!this.oDialog) {
            var that = this;
            this.oDialog = new sap.m.Dialog({
                id: this.getView().createId("dialog"),
                title : "Sample Dialog",
                type : sap.m.DialogType.Message,
                leftButton : new sap.m.Button({
                    text : "Cancel",
                    press : function () {
                        that.oDialog.close();
                    }
                }),
                content : [
                    new sap.m.Link({
                        id: "DialogCrossAppLinkID",
                        href: "{/DefaultApp_display_href}",
                        text: "Cross app link (Default App)",
                        tooltip: "Dialog should be closed automatically when navigating to another app"
                    })
                ]
            });
            this.oDialog.setModel(this.oApplication.oView.getModel());

        }
        this.oDialog.open();
    },
    handleOpenPopoverPress: function () {
        "use strict";
        var oModel, sHref;
        if (!this.oPopover) {
            oModel = this.oApplication.oView.getModel();
            sHref = oModel.getProperty("/DefaultApp_display_href");
            this.oPopover = new sap.m.Popover({
                id: this.getView().createId("popover"),
                title: "Sample Popover",
                content: [
                    new sap.m.Link({
                        href: sHref,
                        text: "Cross app link (Default App)",
                        tooltip: "Popover should be closed automatically when navigating to another app"
                    })
                ]
            });
        }
        if (!this.oPopover.isOpen()) {
            this.oPopover.openBy(this.getView().byId("openPopover"));
        } else {
            this.oPopover.close();
        }
    },

	handleSetHierarchy : function () {
		"use strict";

		var aHierarchyLevels = [{
			icon: "sap-icon://undefined/lead",
			title: "View X",
			link: "#Action-toappnavsample2" //app calls hrefForExternal, external format, direct link
		}, {
			icon: "sap-icon://FioriInAppIcons/Gift",
			title: "View Y",
			link: "#Action-toappstateformsample&/editForm/"
		}];

		this.getOwnerComponent().getService("ShellUIService").then(
			function (oShellUIService) {
				oShellUIService.setHierarchy(aHierarchyLevels);
			},
			function (sError) {
				jQuery.sap.log.error(sError, "perhaps manifest.json does not declare the service correctly",
					"sap.ushell.demo.AppNavSample.view.List");
			}
		);
	},

	handleSetRelatedApps : function () {
        "use strict";
		var aRelatedApps = [
			{
				title: "Related App X",
				icon: "sap-icon://documents",
				intent: "#Action-todefaultapp"
			},
			{
				title: "no icon or sub",
				intent: "#Action-todefaultapp"
			},
			{
				title: "Related App Z",
				subtitle: "Application view number 3",
				intent: "#Action-todefaultapp"
			}
		];
		this.getOwnerComponent().getService("ShellUIService").then(
			function (oShellUIService) {
				oShellUIService.setRelatedApps(aRelatedApps);
			},
			function (sError) {
				jQuery.sap.log.error(sError, "perhaps manifest.json does not declare the service correctly",
					"sap.ushell.demo.AppNavSample.view.List");
			}
		);


    },
    getThemeList: function () {
        sap.ui.define([
            "sap/ushell/appRuntime/ui5/AppRuntimeService",
        ], function (
            AppRuntimeService
        ) {
            AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getThemeList", { })
                .then(function (aList) {
                    console.log(aList);
                }, function (sError) {
                    console.log(sError);
                });
        });
    },

    handleSetTitle : function () {
        "use strict";
		this.getOwnerComponent().getService("ShellUIService").then(
			function (oShellUIService) {
				oShellUIService.setTitle("Custom title is set!");
			},
			function (sError) {
				jQuery.sap.log.error(sError, "perhaps manifest.json does not declare the service correctly",
					"sap.ushell.demo.AppNavSample.view.List");
			}
		);
	},

    handleSetTitleFromTargetMapping: function () {
        "use strict";
        var oShellUIServicePromise = this.getOwnerComponent().getService("ShellUIService"),
            oIntentPromise = sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().getIntent();

        Promise.all([oShellUIServicePromise, oIntentPromise]).then( function (aPromises) {
            var oShellUIService = aPromises[0],
                oIntent = aPromises[1];
            sap.ushell.Container.getService("CrossApplicationNavigation").getLinks(oIntent).then(function (aRes) {
                oShellUIService.setTitle(aRes[0].text);
            });
        });
    },

    handleOpenMessageToastPress: function () {
        "use strict";
        sap.m.MessageToast.show("Sample message toast", { duration: 5000});
    },

    sendAsEmailS4: function () {
        "use strict";
        sap.m.URLHelper.triggerEmail(
            null,
            "This is the email of FLP",
            document.URL
        );
    },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.List
*/
//  onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.List
*/
    onExit: function () {
        "use strict";
        // dialogs and popovers are not part of the UI composition tree and must
        // therefore be
        // destroyed explicitly in the exit handler
        if (this.oDialog) {
            this.oDialog.destroy();
        }
        if (this.oPopover) {
            this.oPopover.destroy();
        }
        if (this.oActionSheet) {
            this.oActionSheet.destroy();
        }
        if (this.oActionsButton) {
            this.oActionsButton.destroy();
        }
    }

});
