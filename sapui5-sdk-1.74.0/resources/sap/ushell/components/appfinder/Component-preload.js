//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/appfinder/AppFinder.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/ui5service/ShellUIService",
    "sap/ushell/EventHub",
    "sap/ushell/components/CatalogsManager",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/library",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources"
], function (
    Controller,
    AccessibilityCustomData,
    ShellUIService,
    EventHub,
    CatalogsManager,
    HashChanger,
    jQuery,
    coreLibrary,
    Device,
    JSONModel,
    resources
) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    return Controller.extend("sap.ushell.components.appfinder.AppFinder", {
        onInit: function () {
            sap.ushell.Container.getRenderer("fiori2").createExtendedShellState("appFinderExtendedShellState", function () {
                sap.ushell.Container.getRenderer("fiori2").showHeaderItem("backBtn", true);
                sap.ushell.Container.getRenderer("fiori2").showHeaderItem("homeBtn", true);
            });
            var oView = this.getView(),
                oModel = oView.getModel(),
                showEasyAccessMenu = oView.showEasyAccessMenu;

            // Initialise the CatalogManager
            // After that, sap.ushell.components.getCatalogsManager() is used to get CatalogManager
            var oCatalogMgrData = {
                model: oModel
            };
            this.oCatalogsManager = new CatalogsManager("catalogsMgr", oCatalogMgrData);

            // model
            this.getView().setModel(this._getSubHeaderModel(), "subHeaderModel");
            this.oConfig = oView.parentComponent.getComponentData().config;
            this.catalogView = sap.ui.view("catalogView", {
                type: ViewType.JS,
                viewName: "sap.ushell.components.appfinder.Catalog",
                height: "100%",
                viewData: {
                    parentComponent: oView.parentComponent,
                    subHeaderModel: this._getSubHeaderModel()
                }
            });
            this.catalogView.addStyleClass("sapUiGlobalBackgroundColor sapUiGlobalBackgroundColorForce");
            this._addViewCustomData(this.catalogView, "appFinderCatalogTitle");


            // routing for both 'catalog' and 'appFinder' is supported and added below
            this.oRouter = this.getView().parentComponent.getRouter();
            this.oRouter.attachRouteMatched(this._handleAppFinderNavigation.bind(this));

            oView.createSubHeader();

            // setting first focus
            if (!showEasyAccessMenu) {
                oView.oPage.addContent(this.catalogView);
                setTimeout(function () {
                    jQuery("#catalogSelect").focus();
                }, 0);
            }

            // attaching a resize handler to determine is hamburger button should be visible or not in the App Finder sub header.
            Device.resize.attachHandler(this._resizeHandler.bind(this));

            // This router instance needs the ShellNavigationHashChanger instance in order to get the intent prefixed to the new hash automatically.
            // This router doesn't need to be initialized because it doesn't react to any hashChanged event.
            // The new hash will be consumed when the router in Renderer.js component calls its parse method.
            this.oRouter.oHashChanger = HashChanger.getInstance();
        },

        _resizeHandler: function () {
            // update the visibiilty of the hamburger button upon resizing
            var bShowOpenCloseSplitAppButton = this._showOpenCloseSplitAppButton();

            var bCurrentShowOpenCloseSplitAppButton = this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonVisible");
            if (bShowOpenCloseSplitAppButton !== bCurrentShowOpenCloseSplitAppButton) {
                this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", bShowOpenCloseSplitAppButton);

                // in case we now show the button, then it must be foced untoggled, as the left panel closes automatically
                if (bShowOpenCloseSplitAppButton) {
                    this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", false);
                }
            }
            // toggle class on app finder page
            this._toggleViewWithToggleButtonClass(bShowOpenCloseSplitAppButton);
        },

        _handleAppFinderNavigation: function (oEvent) {
            var oView = this.getView();

            this._preloadAppHandler();
            this._getPathAndHandleGroupContext(oEvent);

            // toggle class on app finder page
            this._toggleViewWithToggleButtonClass(this._showOpenCloseSplitAppButton());
            if (oView.showEasyAccessMenu) {
                // in case we need to show the easy access menu buttons, update sub header accordingly (within the onShow)
                this.onShow(oEvent);
            } else if (oView._showSearch("catalog")) {
                // else no easy access menu buttons, update sub header accordingly
                oView.updateSubHeader("catalog", false);
                // we still have to adjust the view in case we do show the tags in subheader
                this._toggleViewWithSearchAndTagsClasses("catalog");
            }
            sap.ui.getCore().getEventBus().publish("showCatalog");
            EventHub.emit("CenterViewPointContentRendered", "appFinder");

            // Date is included as data to force a call to the subscribers
            // Id is included for UserActivityLog
            EventHub.emit("showCatalog", { sId: "showCatalog", oData: Date.now() });
            sap.ui.getCore().getEventBus().publish("launchpad", "contentRendered");
        },

        _showOpenCloseSplitAppButton: function () {
            return !Device.orientation.landscape || Device.system.phone;
        },

        _resetSubHeaderModel: function () {
            this.oSubHeaderModel.setProperty("/activeMenu", null);

            this.oSubHeaderModel.setProperty("/search", {
                searchMode: false,
                searchTerm: null
            });

            this.oSubHeaderModel.setProperty("/tag", {
                tagMode: false,
                selectedTags: []
            });

            this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", this._showOpenCloseSplitAppButton());
            this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", false);
        },

        _getSubHeaderModel: function () {
            if (this.oSubHeaderModel) {
                return this.oSubHeaderModel;
            }
            this.oSubHeaderModel = new JSONModel();
            this._resetSubHeaderModel();
            return this.oSubHeaderModel;
        },

        onTagsFilter: function (oEvent) {
            var oTagsFilter = oEvent.getSource(),
                oSubHeaderModel = oTagsFilter.getModel("subHeaderModel"),
                aSelectedTags = oEvent.getSource().getSelectedItems(),
                bTagsMode = aSelectedTags.length > 0,
                oTagsData = {
                    tagMode: bTagsMode,
                    selectedTags: []
                };

            aSelectedTags.forEach(function (oTag) {
                oTagsData.selectedTags.push(oTag.getText());
            });
            oSubHeaderModel.setProperty("/activeMenu", this.getCurrentMenuName());
            oSubHeaderModel.setProperty("/tag", oTagsData);

            sap.ui.getCore().byId("catalogView").getController().onTag(oTagsData);
        },

        searchHandler: function (oEvent) {
            // get all custom tile keywords
            var oCatalogsManager = sap.ushell.components.getCatalogsManager();
            oCatalogsManager.loadCustomTilesKeyWords();

            var sSearchTerm = oEvent.getSource().getValue(),
                searchChanged = false;
            if (sSearchTerm === null) {
                return;
            }

            // take the data from the model
            var oSearchData = this.oSubHeaderModel.getProperty("/search");
            var sActiveMenu = this.oSubHeaderModel.getProperty("/activeMenu");

            // update active menu to current
            if (this.getCurrentMenuName() !== sActiveMenu) {
                sActiveMenu = this.getCurrentMenuName();
            }
            // update search mode to true - ONLY in case the handler is not invoked by the 'X' button.
            // In case it does we do not update the search mode, it stays as it is
            if (!oSearchData.searchMode && !oEvent.getParameter("clearButtonPressed")) {
                oSearchData.searchMode = true;
            }

            // we are in search mode and on Phone
            if (oSearchData.searchMode && Device.system.phone) {
                // in case we are in phone we untoggle the toggle button when search is invoked as
                // the detailed page of the search results is nevigated to and opened.
                // therefore we untoggle the button of the master page
                this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", false);
            }

            // check and update the search term
            if (sSearchTerm !== oSearchData.searchTerm) {
                if (this.containsOnlyWhiteSpac(sSearchTerm)) {
                    sSearchTerm = "*";
                }
                oSearchData.searchTerm = sSearchTerm;

                searchChanged = true;
            }
            // setting property once so no redundant binding updates will occur
            this.oSubHeaderModel.setProperty("/search", oSearchData);
            this.oSubHeaderModel.setProperty("/activeMenu", sActiveMenu);
            this.oSubHeaderModel.refresh(true);

            if (searchChanged) {
                sap.ui.getCore().byId("catalogView").getController().onSearch(oSearchData);
            }
        },

        /**
         * This method comes to prepare relevant modifications before loading the app.
         * This includes;
         *   - applying custom shell states
         *   - setting the shell-header-title accordingly
         */
        _preloadAppHandler: function () {
            setTimeout(function () {
                if (sap.ushell.Container) {
                    sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState("appFinderExtendedShellState");
                }
                this._updateShellHeader(this.oView.oPage.getTitle());
            }.bind(this), 0);
        },

        getCurrentMenuName: function () {
            return this.currentMenu;
        },

        _navigateTo: function (sName/*, sMenu*/) {
            var sGroupContext = this.oView.getModel().getProperty("/groupContext");
            var sGroupContextPath = sGroupContext ? sGroupContext.path : null;
            if (sGroupContextPath) {
                this.oRouter.navTo(sName, {
                    filters: JSON.stringify({ targetGroup: encodeURIComponent(sGroupContextPath) })
                }, true);
            } else {
                this.oRouter.navTo(sName, {}, true);

            }
        },

        getSystemsModels: function () {
            var that = this;
            if (this.getSystemsPromise) {
                return this.getSystemsPromise;
            }

            var getSystemsDeferred = new jQuery.Deferred();
            this.getSystemsPromise = getSystemsDeferred.promise();

            var aModelPromises = ["userMenu", "sapMenu"].map(function (menuType) {
                var systemsModel = new JSONModel();
                systemsModel.setProperty("/systemSelected", null);
                systemsModel.setProperty("/systemsList", []);

                return that.getSystems(menuType).then(function (aReturnSystems) {
                    systemsModel.setProperty("/systemsList", aReturnSystems);
                    return systemsModel;
                });
            });
            jQuery.when.apply(jQuery, aModelPromises).then(function (userMenuModel, sapMenuModel) {
                getSystemsDeferred.resolve(userMenuModel, sapMenuModel);
            });

            return this.getSystemsPromise;
        },

        onSegmentButtonClick: function (oEvent) {

            this.oSubHeaderModel.setProperty("/search/searchMode", false);
            this.oSubHeaderModel.setProperty("/search/searchTerm", "");

            switch (oEvent.getParameters().id) {
                case "catalog":
                    this._navigateTo("catalog");
                    break;
                case "userMenu":
                    this._navigateTo("userMenu");
                    break;
                case "sapMenu":
                    this._navigateTo("sapMenu");
                    break;
            }
        },

        onShow: function (oEvent) {
            var sParameter = oEvent.getParameter("name");
            if (sParameter === this.getCurrentMenuName()) {
                return;
            }

            // update place holder string on the search input according to the showed menu
            var oView = this.getView();
            oView._updateSearchWithPlaceHolder(sParameter);

            this._updateCurrentMenuName(sParameter);
            this.getSystemsModels().then(function (userMenuSystemsModel, sapMenuSystemsModel) {
                var sapMenuSystemsList = sapMenuSystemsModel.getProperty("/systemsList");
                var userMenuSystemsList = userMenuSystemsModel.getProperty("/systemsList");

                // call view to remove content from page
                oView.oPage.removeAllContent();

                // in case we have systems we do want the sub header to be rendered accordingly
                // (no systems ==> no easy access menu buttons in sub header)
                var systemsList = (this.currentMenu === "sapMenu" ? sapMenuSystemsList : userMenuSystemsList);
                if (systemsList && systemsList.length) {
                    // call view to render the sub header with easy access menus
                    oView.updateSubHeader(this.currentMenu, true);
                } else if (oView._showSearch(this.currentMenu)) {
                    // call view to render the sub header without easy access menus
                    oView.updateSubHeader(this.currentMenu, false);
                }

                if (this.currentMenu === "catalog") {
                    // add catalog view
                    oView.oPage.addContent(this.catalogView);
                } else if (this.currentMenu === "userMenu") {
                    // add user menu view, create if first time
                    if (!this.userMenuView) {
                        this.userMenuView = new sap.ui.view("userMenuView", {
                            type: ViewType.JS,
                            viewName: "sap.ushell.components.appfinder.EasyAccess",
                            height: "100%",
                            viewData: {
                                menuName: "USER_MENU",
                                easyAccessSystemsModel: userMenuSystemsModel,
                                parentComponent: oView.parentComponent,
                                subHeaderModel: this._getSubHeaderModel(),
                                enableSearch: this.getView()._showSearch("userMenu")
                            }
                        });
                        this._addViewCustomData(this.userMenuView, "appFinderUserMenuTitle");
                    }
                    oView.oPage.addContent(this.userMenuView);
                } else if (this.currentMenu === "sapMenu") {
                    // add sap menu view, create if first time
                    if (!this.sapMenuView) {
                        this.sapMenuView = new sap.ui.view("sapMenuView", {
                            type: ViewType.JS,
                            viewName: "sap.ushell.components.appfinder.EasyAccess",
                            height: "100%",
                            viewData: {
                                menuName: "SAP_MENU",
                                easyAccessSystemsModel: sapMenuSystemsModel,
                                parentComponent: oView.parentComponent,
                                subHeaderModel: this._getSubHeaderModel(),
                                enableSearch: this.getView()._showSearch("sapMenu")
                            }
                        });
                        this._addViewCustomData(this.sapMenuView, "appFinderSapMenuTitle");
                    }
                    oView.oPage.addContent(this.sapMenuView);
                }

                // focus is set on segmented button
                this._setFocusToSegmentedButton(systemsList);

                // SubHeader Model active-menu is updated with current menu
                this.oSubHeaderModel.setProperty("/activeMenu", this.currentMenu);

                // In case toggle button is visible (SubHeader Model toggle button toggled), then it is set to false as we switch the menu
                if (this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonVisible")) {
                    this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", false);
                }

                this.oSubHeaderModel.refresh(true);
            }.bind(this));
        },

        _updateCurrentMenuName: function (sMenu) {
            /**
             * Verify that the menu exist!
             * in case one of the easy access menu is disabled and the user is navigating to the desabled menu,
             * (using some existing link) we need to make sure we will not show the disabled menu!
             */
            var oView = this.getView();

            if (!oView.showEasyAccessMenu ||
                (sMenu === "sapMenu" && !oView.enableEasyAccessSAPMenu) ||
                (sMenu === "userMenu" && !oView.enableEasyAccessUserMenu)) {
                this.currentMenu = "catalog";
            } else {
                this.currentMenu = sMenu;
            }

            // toggle relevant classes on the App Finder page according to wether it displays search or tags in its subheader or not
            this._toggleViewWithSearchAndTagsClasses(sMenu);
        },

        /*
         * This method sets a class on the AppFinder page to state if tags are shown or not currently in the subheader.
         * The reason for it is that if tags do appear than we have a whole set of different styling to the header and its behavior,
         * so we use different css selectors
         */
        _toggleViewWithSearchAndTagsClasses: function (sMenu) {
            var oView = this.getView();

            if (oView._showSearch(sMenu)) {
                oView.oPage.addStyleClass("sapUshellAppFinderSearch");
            } else {
                oView.oPage.removeStyleClass("sapUshellAppFinderSearch");
            }

            if (oView._showSearchTag(sMenu)) {
                oView.oPage.addStyleClass("sapUshellAppFinderTags");
            } else {
                oView.oPage.removeStyleClass("sapUshellAppFinderTags");
            }
        },

        _toggleViewWithToggleButtonClass: function (bButtonVisible) {
            var oView = this.getView();
            if (bButtonVisible) {
                oView.oPage.addStyleClass("sapUshellAppFinderToggleButton");
            } else {
                oView.oPage.removeStyleClass("sapUshellAppFinderToggleButton");
            }
        },

        _setFocusToSegmentedButton: function (systemsList) {
            var oView = this.getView();

            if (systemsList && systemsList.length) {
                var sButtonId = oView.segmentedButton.getSelectedButton();
                setTimeout(function () {
                    jQuery("#" + sButtonId).focus();
                }, 0);

            } else {
                setTimeout(function () {
                    jQuery("#catalogSelect").focus();
                }, 0);
            }
        },

        /**
         * get the group path (if exists) and update the model with the group context
         * @param {Object} oEvent oEvent
         * @private
         */
        _getPathAndHandleGroupContext: function (oEvent) {
            var oParameters = oEvent.getParameter("arguments");
            var sDataParam = oParameters.filters;
            var oDataParam;
            try {
                oDataParam = JSON.parse(sDataParam);
            } catch (e) {
                oDataParam = sDataParam;
            }
            var sPath = (oDataParam && decodeURIComponent(oDataParam.targetGroup)) || "";

            sPath = sPath === "undefined" ? undefined : sPath;
            this._updateModelWithGroupContext(sPath);
        },

        /**
         * Update the groupContext part of the model with the path and ID of the context group, if exists
         *
         * @param {string} sPath - the path in the model of the context group, or empty string if no context exists
         */
        _updateModelWithGroupContext: function (sPath) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                oModel = this.oView.getModel(),
                oGroupModel,
                oGroupContext = {
                    path: sPath,
                    id: "",
                    title: ""
                };

            // If sPath is defined and is different than empty string - set the group context id.
            // The recursive call is needed in order to wait until groups data is inserted to the model
            if (sPath && sPath !== "") {
                var timeoutGetGroupDataFromModel = function () {
                    var aModelGroups = oModel.getProperty("/groups");
                    if (aModelGroups.length) {
                        oGroupModel = oModel.getProperty(sPath);
                        oGroupContext.id = oLaunchPageService.getGroupId(oGroupModel.object);
                        oGroupContext.title = oGroupModel.title || oLaunchPageService.getGroupTitle(oGroupModel.object);
                        return;
                    }
                    setTimeout(timeoutGetGroupDataFromModel, 100);
                };
                timeoutGetGroupDataFromModel();
            }
            oModel.setProperty("/groupContext", oGroupContext);
        },

        /**
         * @param {string} sMenuType - the menu type. One of sapMenu, userMenu.
         * @returns {*} - a list of systems to show in the system selector dialog
         */
        getSystems: function (sMenuType) {
            var oDeferred = new jQuery.Deferred();
            var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
            if (!clientService) {
                oDeferred.reject("cannot get ClientSideTargetResolution service");
            } else {
                clientService.getEasyAccessSystems(sMenuType).done(function (oSystems) {
                    var systemsModel = [];
                    var aSystemsID = Object.keys(oSystems);
                    for (var i = 0; i < aSystemsID.length; i++) {
                        var sCurrentsystemID = aSystemsID[i];
                        systemsModel[i] = {
                            "systemName": oSystems[sCurrentsystemID].text,
                            "systemId": sCurrentsystemID
                        };
                    }

                    oDeferred.resolve(systemsModel);
                }).fail(function (sErrorMsg) {
                    oDeferred.reject("An error occurred while retrieving the systems: " + sErrorMsg);
                });
            }
            return oDeferred.promise();
        },

        _addViewCustomData: function (oView, sTitleName) {
            var oResourceBundle = resources.i18n;

            oView.addCustomData(new AccessibilityCustomData({
                key: "role",
                value: "region",
                writeToDom: true
            }));
            oView.addCustomData(new AccessibilityCustomData({
                key: "aria-label",
                value: oResourceBundle.getText(sTitleName),
                writeToDom: true
            }));
        },

        _initializeShellUIService: function () {
            this.oShellUIService = new ShellUIService({
                scopeObject: this.getOwnerComponent(),
                scopeType: "component"
            });
        },

        _updateShellHeader: function (sTitle) {
            if (!this.oShellUIService) {
                this._initializeShellUIService();
            }
            this.oShellUIService.setTitle(sTitle);
            this.oShellUIService.setHierarchy();
        },

        /**
         * @param {string} sTerm The input fields
         * @returns {boolean} - the function return true if the input field is ' ' (space) or '    ' (a few spaces)
         * if the input field contains a not only spaces (for example 'a b') or if it is an empty string the function should return false
         */
        containsOnlyWhiteSpac: function (sTerm) {
            if (!sTerm || sTerm === "") {
                return false;
            }

            var sTemp = sTerm;
            return (!sTemp.replace(/\s/g, "").length);
        }
    });
});
},
	"sap/ushell/components/appfinder/AppFinder.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/ListItem",
    "sap/ui/model/Sorter",
    "sap/m/MultiComboBox",
    "sap/ui/model/BindingMode",
    "sap/m/SearchField",
    "sap/m/FlexBox",
    "sap/m/SegmentedButton",
    "sap/m/SegmentedButtonItem",
    "sap/m/ToggleButton",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/Toolbar",
    "sap/m/Page",
    "sap/ushell/resources",
    "sap/ui/Device",
    "sap/ui/core/Component"
], function (
    jQuery,
    ListItem,
    Sorter,
    MultiComboBox,
    BindingMode,
    SearchField,
    FlexBox,
    SegmentedButton,
    SegmentedButtonItem,
    ToggleButton,
    AccessibilityCustomData,
    Toolbar,
    Page,
    resources,
    Device,
    Component
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.appfinder.AppFinder", {
        createContent: function () {
            this.oController = this.getController();
            this.parentComponent = Component.getOwnerComponentFor(this);
            this.setModel(this.parentComponent.getModel());
            this.enableEasyAccessSAPMenu = this.getModel().getProperty("/enableEasyAccessSAPMenu");
            this.enableEasyAccessUserMenu = this.getModel().getProperty("/enableEasyAccessUserMenu");

            if ((!this.enableEasyAccessSAPMenu && !this.enableEasyAccessUserMenu) || //show only catalog in case both menus are not enabled
                (Device.system.phone || Device.system.tablet && (!Device.system.combi))) {
                this.showEasyAccessMenu = false;
            } else {
                this.showEasyAccessMenu = true;
            }
            var oResourceBundle = resources.i18n;

            this.oPage = new Page("appFinderPage", {
                showHeader: false,
                showSubHeader: false,
                showFooter: false,
                showNavButton: false,
                enableScrolling: false,
                title: {
                    parts: ["/groupContext/title"],
                    formatter: function (title) {
                        return !title ? oResourceBundle.getText("appFinderTitle") : oResourceBundle.getText("appFinder_group_context_title", title);
                    }
                }
            });
            return this.oPage;
        },

        /*
         * This method checks according to the menu id if search is enabled according to the configuration.
         * Empty menu id is treated as 'catalog' as when loading the appFinder if no menu
         * identified as a routing parameter then we load catalog by default
         */
        _showSearch: function (sMenu) {
            var sModelProperty = "enableCatalogSearch";
            if (sMenu === "userMenu") {
                sModelProperty = "enableEasyAccessUserMenuSearch";
            } else if (sMenu === "sapMenu") {
                sModelProperty = "enableEasyAccessSAPMenuSearch";
            }

            return this.getModel().getProperty("/" + sModelProperty);
        },

        /*
         * This method checks according to the menu id if tags is enabled according to the configuration.
         * Empty menu id is treated as 'catalog' as when loading the appFinder if no menu
         * identified as a routing parameter then we load catalog by default
         */
        _showSearchTag: function (sMenu) {
            if (sMenu === "userMenu" || sMenu === "sapMenu") {
                return false;
            }
            return this.getModel().getProperty("/enableCatalogTagFilter");
        },

        createSubHeader: function () {
            this.oToolbar = new Toolbar("appFinderSubHeader", {
            });

            if (Device.system.desktop) {
                this.oToolbar.addEventDelegate({
                    onsapskipback: function (oEvent) {
                        oEvent.preventDefault();
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    },
                    onsapskipforward: function (oEvent) {
                        var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                        if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed()) {
                            oEvent.preventDefault();
                            sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                        }
                    },
                    onAfterRendering: function () {
                        jQuery("#catalog-button").attr("accesskey", "a");
                    }
                });
            }

            this.oToolbar.addCustomData(new AccessibilityCustomData({
                key: "role",
                value: "heading",
                writeToDom: true
            }));

            this.oToolbar.addCustomData(new AccessibilityCustomData({
                key: "aria-level",
                value: "2",
                writeToDom: true
            }));

            this.oToolbar.addStyleClass("sapUshellAppFinderHeader");
            this.oPage.setSubHeader(this.oToolbar);
            this.oPage.setShowSubHeader(true);

            if (!this.openCloseSplitAppButton) {
                // create toggle button for open/close the master part of the splitApp control
                this.openCloseSplitAppButton = new ToggleButton("openCloseButtonAppFinderSubheader", {
                    icon: "sap-icon://menu2",
                    visible: "{/openCloseSplitAppButtonVisible}",
                    pressed: "{/openCloseSplitAppButtonToggled}",
                    press: function (oEvent) {
                        this.getController().oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", oEvent.getSource().getPressed());
                        this.openCloseSplitAppButton.setTooltip(oEvent.getParameter("pressed") ?
                            resources.i18n.getText("ToggleButtonHide") :
                            resources.i18n.getText("ToggleButtonShow"));
                    }.bind(this),
                    tooltip: resources.i18n.getText("ToggleButtonShow")
                });

                if (Device.system.desktop) {
                    this.openCloseSplitAppButton.addEventDelegate({
                        onsaptabprevious: function (oEvent) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    });
                }

                this.openCloseSplitAppButton.setModel(this.getController().oSubHeaderModel);
                this.oToolbar.addContent(this.openCloseSplitAppButton);
            }
        },

        updateSubHeader: function (sMenu, bEasyAccess) {
            var segmentedButtons,
                searchControl;

            // clear content from toolbar
            this.oToolbar.removeAllContent();
            this.oToolbar.addContent(this.openCloseSplitAppButton);

            // bEasyAccess means that we need the segmented button easy access menu entries
            if (bEasyAccess) {
                segmentedButtons = this.createSegmentedButtons(sMenu);
                this.oPage.addStyleClass("sapUshellAppFinderWithEasyAccess");
                this.oToolbar.addContent(segmentedButtons);
            }

            // render the search control in the sub-header
            if (this._showSearch(sMenu)) {
                searchControl = this.createSearchControl(sMenu);
                this.oToolbar.addContent(searchControl);
            }
            // make sure we always update the current menu when updating the sub header
            this.getController()._updateCurrentMenuName(sMenu);
        },

        createSegmentedButtons: function (sMenu) {
            var oController,
                oResourceBundle,
                segmentedButtonsArray,
                aButtons,
                button,
                i;

            if (this.segmentedButton) {
                this.segmentedButton.setSelectedButton(sMenu);
                return this.segmentedButton;
            }

            oController = this.getController();
            oResourceBundle = resources.i18n;
            segmentedButtonsArray = [];
            segmentedButtonsArray.push(new SegmentedButtonItem("catalog", {
                text: oResourceBundle.getText("appFinderCatalogTitle"),
                press: function (oEvent) {
                    oController.onSegmentButtonClick(oEvent);
                }
            }));
            if (this.enableEasyAccessUserMenu) {
                segmentedButtonsArray.push(new SegmentedButtonItem("userMenu", {
                    text: oResourceBundle.getText("appFinderUserMenuTitle"),
                    press: function (oEvent) {
                        oController.onSegmentButtonClick(oEvent);
                    }
                }));
            }
            if (this.enableEasyAccessSAPMenu) {
                segmentedButtonsArray.push(new SegmentedButtonItem("sapMenu", {
                    text: oResourceBundle.getText("appFinderSapMenuTitle"),
                    press: function (oEvent) {
                        oController.onSegmentButtonClick(oEvent);
                    }
                }));
            }
            this.segmentedButton = new SegmentedButton("appFinderSegmentedButtons", {
                items: segmentedButtonsArray
            });

            if (Device.system.desktop) {
                this.segmentedButton.addEventDelegate({
                    onsaptabprevious: function (oEvent) {
                        var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                        if (!openCloseSplitAppButton.getVisible()) {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                    }
                });
            }

            this.segmentedButton.setSelectedButton(sMenu);
            aButtons = this.segmentedButton.getItems();
            for (i = 0; i < aButtons.length; i++) {
                button = aButtons[i];
                button.addCustomData(new AccessibilityCustomData({
                    key: "aria-controls",
                    value: button.getId() + "View",
                    writeToDom: true
                }));
            }

            return this.segmentedButton;
        },

        _handleSearch: function () {
            // invoke the search handler on the controller
            this.getController().searchHandler.apply(this.getController(), arguments);
            // select text right after search executed
            jQuery("#appFinderSearch input").select();
        },

        createSearchControl: function (sMenu) {
            if (!this.oAppFinderSearchContainer) {
                this.oAppFinderSearchContainer = new FlexBox("appFinderSearchContainer");
            }

            this.oAppFinderSearchContainer.removeAllItems();

            if (sMenu === "catalog" && this._showSearchTag("catalog")) {
                this.createTagControl();
                this.oAppFinderSearchContainer.addItem(this.oAppFinderTagFilter);
            }

            if (!this.oAppFinderSearchControl) {
                this.oAppFinderSearchControl = new SearchField("appFinderSearch", {
                    search: this._handleSearch.bind(this),
                    value: {
                        path: "subHeaderModel>/search/searchTerm",
                        mode: BindingMode.OneWay
                    }
                }).addStyleClass("help-id-catalogSearch"); // xRay help ID;

                this.oAppFinderSearchControl.addCustomData(new AccessibilityCustomData({
                    key: "aria-controls",
                    value: "",
                    writeToDom: true
                }));

                if (Device.system.desktop) {
                    this.oAppFinderSearchControl.addEventDelegate({
                        onsaptabnext: function (oEvent) {
                            var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                            if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed()) {
                                oEvent.preventDefault();
                                sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                                sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                            }
                        }
                    });
                }
            }
            this.oAppFinderSearchContainer.addItem(this.oAppFinderSearchControl);

            this._updateSearchWithPlaceHolder(sMenu);
            return this.oAppFinderSearchContainer;
        },

        _updateSearchWithPlaceHolder: function (sMenu) {
            var sSearchPlaceHolderKey = "";
            if (sMenu === "catalog") {
                sSearchPlaceHolderKey = "EasyAccessMenu_SearchPlaceHolder_Catalog";
            } else if (sMenu === "userMenu") {
                sSearchPlaceHolderKey = "EasyAccessMenu_SearchPlaceHolder_UserMenu";
            } else if (sMenu === "sapMenu") {
                sSearchPlaceHolderKey = "EasyAccessMenu_SearchPlaceHolder_SAPMenu";
            }

            if (sSearchPlaceHolderKey && this.oAppFinderSearchControl) {
                this.oAppFinderSearchControl.setPlaceholder(resources.i18n.getText(sSearchPlaceHolderKey));
                this.oAppFinderSearchControl.setTooltip(resources.i18n.getText(sSearchPlaceHolderKey));
            }
        },

        createTagControl: function () {
            if (this.oAppFinderTagFilter) {
                return this.oAppFinderTagFilter;
            }
            this.oAppFinderTagFilter = new MultiComboBox("appFinderTagFilter", {
                selectedKeys: {
                    path: "subHeaderModel>/tag/selectedTags"
                },
                tooltip: "{i18n>catalogTilesTagfilter_tooltip}",
                placeholder: "{i18n>catalogTilesTagfilter_HintText}",
                visible: {
                    path: "/tagList",
                    formatter: function (aTagList) {
                        return aTagList.length > 0;
                    }
                },
                // Use catalogs model as a demo content until the real model is implemented
                items: {
                    path: "/tagList",
                    sorter: new Sorter("tag", false, false),
                    template: new ListItem({
                        text: "{tag}",
                        key: "{tag}"
                    })
                },
                selectionChange: [this.oController.onTagsFilter, this.oController]
            }).addStyleClass("help-id-catalogTagFilter"); // xRay help ID;

            return this.oAppFinderTagFilter;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.AppFinder";
        }
    });
});
},
	"sap/ushell/components/appfinder/Catalog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/components/_HomepageManager/PagingManager",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/library",
    "sap/ui/Device",
    "sap/ui/core/library",
    "sap/ui/model/Context",
    "sap/m/MessageToast",
    "sap/ushell/Config",
    "sap/ushell/services/AppType"
], function (
    PagingManager,
    jQuery,
    resources,
    Filter,
    FilterOperator,
    mobileLibrary,
    Device,
    coreLibrary,
    Context,
    MessageToast,
    Config,
    AppType
) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    // shortcut for sap.m.SplitAppMode
    var SplitAppMode = mobileLibrary.SplitAppMode;

    /* global hasher */

    sap.ui.controller("sap.ushell.components.appfinder.Catalog", {
        oPopover: null,
        onInit: function () {
            // take the sub-header model
            this.categoryFilter = "";
            this.preCategoryFilter = "";
            this.oMainModel = this.oView.getModel();
            this.oSubHeaderModel = this.oView.getModel("subHeaderModel");
            this.resetPage = false;
            this.bIsInProcess = false;

            var that = this;
            sap.ui.getCore().byId("catalogSelect").addEventDelegate({
                onBeforeRendering: this.onBeforeSelectRendering
            }, this);
            var oRouter = this.getView().parentComponent.getRouter();
            oRouter.attachRouteMatched(function (oEvent) {
                that.onShow(oEvent);
            });
            this.timeoutId = 0;

            document.subHeaderModel = this.oSubHeaderModel;
            document.mainModel = this.oMainModel;

            // init listener for the toggle button bindig context
            var oToggleButtonModelBinding = this.oSubHeaderModel.bindProperty("/openCloseSplitAppButtonToggled");
            oToggleButtonModelBinding.attachChange(that.handleToggleButtonModelChanged.bind(this));

            this.oView.oCatalogsContainer.setHandleSearchCallback(that.handleSearchModelChanged.bind(this));
        },

        onBeforeRendering: function () {
            // Invoking loading of all catalogs here instead of 'onBeforeShow' as it improves the perceived performance.
            // Fix of incident#:1570469901
            sap.ui.getCore().getEventBus().publish("renderCatalog");
        },

        onAfterRendering: function () {
            this.wasRendered = true;
            // disable swipe gestures -> never show master in Portait mode
            if (!this.PagingManager) {
                this._setPagingManager();
            }

            // just the first time
            if (this.PagingManager.currentPageIndex === 0) {
                this.allocateNextPage();
            }

            jQuery(window).resize(function () {
                var windowWidth = jQuery(window).width(),
                    windowHeight = jQuery(window).height();

                this.PagingManager.setContainerSize(windowWidth, windowHeight);
            }.bind(this));
            this._handleAppFinderWithDocking();
            sap.ui.getCore().getEventBus().subscribe("launchpad", "appFinderWithDocking", this._handleAppFinderWithDocking, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appFinderAfterNavigate", this._handleAppFinderAfterNavigate, this);
        },

        _setPagingManager: function () {
            this.lastCatalogId = 0;
            this.PagingManager = new PagingManager("catalogPaging", {
                supportedElements: {
                    tile: { className: "sapUshellTile" }
                },
                containerHeight: window.innerHeight,
                containerWidth: window.innerWidth
            });

            // we need PagingManager in CatalogContainer in order to allocate page if catalog is selected.
            this.getView().getCatalogContainer().setPagingManager(this.PagingManager);
        },

        _decodeUrlFilteringParameters: function (sUrlParameters) {
            var oUrlParameters;
            try {
                oUrlParameters = JSON.parse(sUrlParameters);
            } catch (e) {
                oUrlParameters = sUrlParameters;
            }
            var hashTag = (oUrlParameters && oUrlParameters.tagFilter && oUrlParameters.tagFilter) || [];

            if (hashTag) {
                try {
                    this.tagFilter = JSON.parse(hashTag);
                } catch (e) {
                    this.tagFilter = [];
                }
            } else {
                this.tagFilter = [];
            }

            this.categoryFilter = (oUrlParameters && oUrlParameters.catalogSelector && oUrlParameters.catalogSelector) || this.categoryFilter;
            if (this.categoryFilter) {
                this.categoryFilter = window.decodeURIComponent(this.categoryFilter);
            }
            this.searchFilter = (oUrlParameters && oUrlParameters.tileFilter && oUrlParameters.tileFilter) || null;
            if (this.searchFilter) {
                this.searchFilter = window.decodeURIComponent(this.searchFilter);
            }
        },

        _applyFilters: function (wasRendered) {
            var shouldFocusOnCategory = false;

            if (this.categoryFilter) {
                // If all is selected pass an empty string.
                this.categoryFilter = resources.i18n.getText("all") === this.categoryFilter ? "" : this.categoryFilter;
                if (this.categoryFilter !== this.preCategoryFilter) {
                    shouldFocusOnCategory = true;
                }
                this.oView.setCategoryFilterSelection(this.categoryFilter, shouldFocusOnCategory);
            } else {
                shouldFocusOnCategory = true;
                this.oView.setCategoryFilterSelection("", shouldFocusOnCategory);
            }
            this.preCategoryFilter = this.categoryFilter;

            if (this.searchFilter && this.searchFilter.length) {
                // Remove all asterisks from search query before applying the filter
                this.searchFilter = this.searchFilter.replace(/\*/g, "");
                this.searchFilter = this.searchFilter.trim();
                this.oSubHeaderModel.setProperty("/search", {
                    searchMode: true,
                    searchTerm: this.searchFilter
                });
            } else if (wasRendered) {
                this.oSubHeaderModel.setProperty("/search", {
                    searchMode: false,
                    searchTerm: ""
                });
                this.resetPage = true;
            }

            if (this.tagFilter && this.tagFilter.length) {
                this.oSubHeaderModel.setProperty("/tag", {
                    tagMode: true,
                    selectedTags: this.tagFilter
                });
            } else if (wasRendered) {
                this.oSubHeaderModel.setProperty("/tag", {
                    tagMode: false,
                    selectedTags: []
                });
                this.resetPage = true;
            }

            this.handleSearchModelChanged();
        },

        _handleAppFinderAfterNavigate: function () {
            this.clearFilters();
        },

        clearFilters: function () {
            var shouldFocusOnCategory = false;
            if (this.categoryFilter !== this.preCategoryFilter) {
                shouldFocusOnCategory = true;
            }
            var bSearchMode = this.oSubHeaderModel.getProperty("/search/searchMode"),
                bTagMode = this.oSubHeaderModel.getProperty("/tag/tagMode");

            // if a search was made before
            if (bSearchMode) {
                this.oSubHeaderModel.setProperty("/search", {
                    searchMode: true,
                    searchTerm: ""
                });
            }

            if (bTagMode) {
                this.oSubHeaderModel.setProperty("/tag", {
                    tagMode: true,
                    selectedTags: []
                });
            }

            if (this.categoryFilter && this.categoryFilter !== "") {
                this.selectedCategoryId = undefined;
                this.categoryFilter = undefined;
                this.getView().getModel().setProperty("/categoryFilter", "");
                this.oView.setCategoryFilterSelection("", shouldFocusOnCategory);
            }

            this.preCategoryFilter = this.categoryFilter;
            this.handleSearchModelChanged();
        },

        onShow: function (oEvent) {
            // if the user goes to the catalog directly (not via the homepage) we must close the loading dialog
            var sUrlParameters = oEvent.getParameter("arguments").filters;

            jQuery.extend(this.getView().getViewData(), oEvent);
            this._decodeUrlFilteringParameters(sUrlParameters);

            // If onAfterRendering was called before and we got here from Home (and not via appfinder inner navigation),
            // then this means we need to reset all filters and present the page as if it's opened for the first time.
            if (this.wasRendered && !sUrlParameters) {
                this.clearFilters();
            } else { // This means we are navigating within the appFinder, or this is the first time the appFinder is opened.
                this._applyFilters(this.wasRendered);
            }
        },

        allocateNextPage: function () {
            var oCatalogContainer = this.getView().getCatalogContainer();
            if (!oCatalogContainer.nAllocatedUnits || oCatalogContainer.nAllocatedUnits === 0) {
                // calculate the number of tiles in the page.
                this.PagingManager.moveToNextPage();
                this.allocateTiles = this.PagingManager._calcElementsPerPage();
                oCatalogContainer.applyPagingCategoryFilters(this.allocateTiles, this.categoryFilter);
            }
        },

        onBeforeSelectRendering: function () {
            var oSelect = sap.ui.getCore().byId("catalogSelect"),
                aItems = jQuery.grep(oSelect.getItems(), jQuery.proxy(function (oItem) {
                    return oItem.getBindingContext().getObject().title === this.categoryFilter;
                }, this));

            if (!aItems.length && oSelect.getItems()[0]) {
                aItems.push(oSelect.getItems()[0]);
            }
        },

        setTagsFilter: function (aFilter) {
            var oParameterObject = {
                catalogSelector: this.categoryFilter ? this.categoryFilter : "All",
                tileFilter: (this.searchFilter && this.searchFilter.length) ? encodeURIComponent(this.searchFilter) : "",
                tagFilter: aFilter.length ? JSON.stringify(aFilter) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oParameterObject)
            });
        },

        setCategoryFilter: function (aFilter) {
            var oParameterObject = {
                catalogSelector: aFilter,
                tileFilter: this.searchFilter ? encodeURIComponent(this.searchFilter) : "",
                tagFilter: this.tagFilter.length ? JSON.stringify(this.tagFilter) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oParameterObject)
            });
        },

        setSearchFilter: function (aFilter) {
            var oParameterObject = {
                catalogSelector: this.categoryFilter ? this.categoryFilter : "All",
                tileFilter: aFilter ? encodeURIComponent(aFilter) : "",
                tagFilter: this.tagFilter.length ? JSON.stringify(this.tagFilter) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };
            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oParameterObject)
            });
        },

        onSearch: function (searchExp) {
            var sActiveMenu = this.oSubHeaderModel.getProperty("/activeMenu");
            if (this.oView.getId().indexOf(sActiveMenu) !== -1) {
                var searchTerm = searchExp.searchTerm ? searchExp.searchTerm : "";
                this.setSearchFilter(searchTerm);
            } else {
                // For the edge case in which we return to the catalog after exsiting search mode in the EAM.
                this._restoreSelectedMasterItem();
            }
        },

        onTag: function (tagExp) {
            var sActiveMenu = this.oSubHeaderModel.getProperty("/activeMenu");
            if (this.oView.getId().indexOf(sActiveMenu) !== -1) {
                var tags = tagExp.selectedTags ? tagExp.selectedTags : [];
                this.setTagsFilter(tags);
            } else {
                // For the edge case in which we return to the catalog after exsiting search mode in the EAM.
                this._restoreSelectedMasterItem();
            }

        },

        /**
         * Returns the group context path string as kept in the model
         *
         * @returns {string} Group context
         */
        getGroupContext: function () {
            var oModel = this.getView().getModel(),
                sGroupContext = oModel.getProperty("/groupContext/path");

            return sGroupContext || "";
        },

        _isTagFilteringChanged: function (aSelectedTags) {
            var bSameLength = aSelectedTags.length === this.tagFilter.length,
                bIntersect = bSameLength;

            // Checks whether there's a symmetric difference between the currently selected tags and those persisted in the URL.
            if (!bIntersect) {
                return true;
            }
            aSelectedTags.some(function (sTag) {
                bIntersect = this.tagFilter && Array.prototype.indexOf.call(this.tagFilter, sTag) !== -1;

                return !bIntersect;
            }.bind(this));

            return bIntersect;
        },

        _setUrlWithTagsAndSearchTerm: function (sSearchTerm, aSelectedTags) {
            var oUrlParameterObject = {
                tileFilter: sSearchTerm && sSearchTerm.length ? encodeURIComponent(sSearchTerm) : "",
                tagFilter: aSelectedTags.length ? JSON.stringify(aSelectedTags) : [],
                targetGroup: encodeURIComponent(this.getGroupContext())
            };

            this.getView().parentComponent.getRouter().navTo("catalog", {
                filters: JSON.stringify(oUrlParameterObject)
            });
        },

        handleSearchModelChanged: function () {
            var bSearchMode = this.oSubHeaderModel.getProperty("/search/searchMode"),
                bTagMode = this.oSubHeaderModel.getProperty("/tag/tagMode"),
                sPageName,
                sSearchTerm = this.oSubHeaderModel.getProperty("/search/searchTerm"),
                aSelectedTags = this.oSubHeaderModel.getProperty("/tag/selectedTags"),
                otagFilter,
                otagFilterWrapper,
                oSearchFilterWrapper,
                aFilters = [],
                oFilters;

            if (!this.PagingManager) {
                this._setPagingManager();
            }
            this.PagingManager.resetCurrentPageIndex();
            this.nAllocatedTiles = 0;
            this.PagingManager.moveToNextPage();
            this.allocateTiles = this.PagingManager._calcElementsPerPage();
            this.oView.oCatalogsContainer.updateAllocatedUnits(this.allocateTiles);
            this.oView.oCatalogsContainer.resetCatalogPagination();

            var oPage = sap.ui.getCore().byId("catalogTilesDetailedPage");
            if (oPage) {
                oPage.scrollTo(0, 0);
            }

            // if view ID does not contain the active menu then return

            if (bSearchMode || bTagMode || this.resetPage) {
                if (aSelectedTags && aSelectedTags.length > 0) {
                    otagFilter = new Filter("tags", "EQ", "v");
                    otagFilter.fnTest = function (oTags) {
                        var ind, filterByTag;
                        if (aSelectedTags.length === 0) {
                            return true;
                        }

                        for (ind = 0; ind < aSelectedTags.length; ind++) {
                            filterByTag = aSelectedTags[ind];
                            if (oTags.indexOf(filterByTag) === -1) {
                                return false;
                            }
                        }
                        return true;
                    };

                    otagFilterWrapper = new Filter([otagFilter], true);
                }

                // Remove all asterisks from search query before applying the filter
                sSearchTerm = sSearchTerm ? sSearchTerm.replace(/\*/g, "") : sSearchTerm;

                if (sSearchTerm) {
                    var aSearchTermParts = sSearchTerm.split(/[\s,]+/);
                    // create search filter with all the parts for keywords and apply AND operator ('true' indicates that)
                    var keywordsSearchFilter = new Filter(jQuery.map(aSearchTermParts, function (value) {
                        return (value && new Filter("keywords", FilterOperator.Contains, value));
                    }), true);

                    // create search filter with all the parts for title and apply AND operator ('true' indicates that)
                    var titleSearchFilter = new Filter(jQuery.map(aSearchTermParts, function (value) {
                        return (value && new Filter("title", FilterOperator.Contains, value));
                    }), true);

                    // create search filter with all the parts for subtitle and apply AND operator ('true' indicates that)
                    var subtitleSearchFilter = new Filter(jQuery.map(aSearchTermParts, function (value) {
                        return (value && new Filter("subtitle", FilterOperator.Contains, value));
                    }), true);

                    aFilters.push(keywordsSearchFilter);
                    aFilters.push(titleSearchFilter);
                    aFilters.push(subtitleSearchFilter);
                    oSearchFilterWrapper = new Filter(aFilters, false); // false mean OR between the search filters
                }

                var catalogs = this.oView.oCatalogsContainer.getCatalogs();
                this.oSearchResultsTotal = [];
                var that = this;

                // construct group filter for tag & search
                if (otagFilterWrapper && otagFilterWrapper.aFilters.length > 0 && oSearchFilterWrapper) {
                    oFilters = new Filter([oSearchFilterWrapper].concat([otagFilterWrapper]), true);
                } else if (otagFilterWrapper && otagFilterWrapper.aFilters.length > 0) {
                    oFilters = new Filter([otagFilterWrapper], true);
                } else if (oSearchFilterWrapper && oSearchFilterWrapper.aFilters.length > 0) {
                    oFilters = new Filter([oSearchFilterWrapper], true);
                }

                catalogs.forEach(function (myCatalog) {
                    myCatalog.getBinding("customTilesContainer").filter(oFilters);
                    myCatalog.getBinding("appBoxesContainer").filter(oFilters);

                });
                this.oView.oCatalogsContainer.bSearchResults = false;

                // Before the filtering - there was a paging mechanism that turned bottom catalogs to invisible
                // Now after filtering - there are new AllocatedUnits, so we send them to
                this.oView.oCatalogsContainer.applyPagingCategoryFilters(this.oView.oCatalogsContainer.nAllocatedUnits, this.categoryFilter);
                this.bSearchResults = this.oView.oCatalogsContainer.bSearchResults;

                this.oView.splitApp.toDetail(that.getView()._calculateDetailPageId());

                this.resetPage = false;
            } else {
                this.oView.oCatalogsContainer.applyPagingCategoryFilters(this.oView.oCatalogsContainer.nAllocatedUnits, this.categoryFilter);
            }
            sPageName = this.getView()._calculateDetailPageId();
            this.oView.splitApp.toDetail(sPageName);
        },

        _handleAppFinderWithDocking: function () {
            // check if docking
            if (jQuery(".sapUshellContainerDocked").length > 0) {
                // 710 is the size of sap.ui.Device.system.phone
                // 1024 docking supported only in L size.
                if (jQuery("#mainShell").width() < 710) {
                    if (window.innerWidth < 1024) {
                        this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", false);
                        this.oView.splitApp.setMode(SplitAppMode.ShowHideMode);
                    } else {
                        this.oView.splitApp.setMode(SplitAppMode.HideMode);
                        this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", true);
                    }
                } else {
                    this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible", false);
                    this.oView.splitApp.setMode(SplitAppMode.ShowHideMode);
                }
            }
        },

        _restoreSelectedMasterItem: function () {
            var oCatalogsList = this.oView.splitApp.getMasterPage("catalogSelect"),
                oOrigSelectedListItem = sap.ui.getCore().byId(this.selectedCategoryId);

            if (oOrigSelectedListItem) {
                this.categoryFilter = oOrigSelectedListItem.getTitle();
            }
            oCatalogsList.setSelectedItem(oOrigSelectedListItem);
        },

        handleToggleButtonModelChanged: function () {
            var bButtonVisible = this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonVisible"),
                bButtonToggled = this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonToggled");

            // if there was a change in the boolean toogled flag
            // (this can be called via upadte to subheader model from AppFinder, in such a case we do not need to switch the views)
            if ((bButtonToggled !== this.bCurrentButtonToggled) && bButtonVisible) {
                // for device which is not a Phone
                if (!Device.system.phone) {
                    if (bButtonToggled && !this.oView.splitApp.isMasterShown()) {
                        this.oView.splitApp.showMaster();
                    } else if (this.oView.splitApp.isMasterShown()) {
                        this.oView.splitApp.hideMaster();
                    }
                    // for Phone the split app is behaving differently
                } else if (this.oView.splitApp.isMasterShown()) {
                    // calculate the relevant detailed page to nav to
                    var oDetail = sap.ui.getCore().byId(this.getView()._calculateDetailPageId());
                    this.oView.splitApp.toDetail(oDetail);
                } else if (bButtonToggled) {
                    // go to master
                    var oCatalogSelectMaster = sap.ui.getCore().byId("catalogSelect");
                    this.oView.splitApp.toMaster(oCatalogSelectMaster, "show");
                }
            }

            this.bCurrentButtonToggled = bButtonToggled;
        },

        _handleCatalogListItemPress: function (oEvent) {
            this.onCategoryFilter(oEvent);
            // eliminate the Search and Tag mode.
            if (this.oSubHeaderModel.getProperty("/search/searchTerm") !== "") {
                this.oSubHeaderModel.setProperty("/search/searchMode", true);
            }

            // on phone, we must make sure the toggle button gets untoggled on every navigation in the master page
            if (Device.system.phone || Device.system.tablet) {
                this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled", !this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled"));
            }
        },

        onCategoryFilter: function (oEvent) {
            var oMasterList = oEvent.getSource(),
                oSelectedCatalog = oMasterList.getSelectedItem(),
                oSelectedCatalogBindingCtx = oSelectedCatalog.getBindingContext(),
                oModel = oSelectedCatalogBindingCtx.getModel();
            if (oModel.getProperty("static", oSelectedCatalogBindingCtx)) { // show all categories
                oModel.setProperty("/showCatalogHeaders", true);
                this.setCategoryFilter();
                this.selectedCategoryId = undefined;
                this.categoryFilter = undefined;
            } else { // filter to category
                oModel.setProperty("/showCatalogHeaders", false);
                this.setCategoryFilter(window.encodeURIComponent(oSelectedCatalog.getBindingContext().getObject().title));
                this.categoryFilter = oSelectedCatalog.getTitle();
                this.selectedCategoryId = oSelectedCatalog.getId();
            }
        },

        onTileAfterRendering: function (oEvent) {
            var jqTile = jQuery(oEvent.oSource.getDomRef()),
                jqTileInnerTile = jqTile.find(".sapMGT");

            jqTileInnerTile.attr("tabindex", "-1");
        },

        catalogTilePress: function (/*oController*/) {
            sap.ui.getCore().getEventBus().publish("launchpad", "catalogTileClick");
        },

        onAppBoxPressed: function (oEvent) {
            var oAppBox = oEvent.getSource(),
                oTile = oAppBox.getBindingContext().getObject(),
                fnPressHandler;
            if (oEvent.mParameters.srcControl.$().closest(".sapUshellPinButton").length) {
                return;
            }

            fnPressHandler = sap.ushell.Container.getService("LaunchPage").getAppBoxPressHandler(oTile);

            if (fnPressHandler) {
                fnPressHandler(oTile);
            } else {
                var sUrl = oAppBox.getProperty("url");

                if (sUrl && sUrl.indexOf("#") === 0) {
                    hasher.setHash(sUrl);
                } else {
                    // add the URL to recent activity log
                    var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                        if (bLogRecentActivity) {
                            var oRecentEntry = {
                                title: oAppBox.getProperty("title"),
                                appType: AppType.URL,
                                url: sUrl,
                                appId: sUrl
                            };
                            sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                        }

                    window.open(sUrl, "_blank");
                }
            }
        },

        /**
         * Event handler triggered if tile should be added to the default group.
         *
         * @param {sap.ui.base.Event} oEvent the event object.
         *   It is expected that the binding context of the event source points to the tile to add.
         */
        onTilePinButtonClick: function (oEvent) {
            var launchPageService = sap.ushell.Container.getService("LaunchPage");
            var oDefaultGroupPromise = launchPageService.getDefaultGroup();

            oDefaultGroupPromise.done(function (oDefaultGroup) {
                var clickedObject = oEvent.getSource(),
                    oSourceContext = clickedObject.getBindingContext(),
                    oModel = this.getView().getModel(),
                    sGroupModelPath = oModel.getProperty("/groupContext/path");

                // Check if the catalog was opened in the context of a group, according to the groupContext ("/groupContext/path") in the model
                if (sGroupModelPath) {
                    this._handleTileFooterClickInGroupContext(oSourceContext, sGroupModelPath);

                    // If the catalog wasn't opened in the context of a group - the action of clicking a catalog tile should open the groups popover
                } else {
                    var groupList = oModel.getProperty("/groups");
                    var launchPageService = sap.ushell.Container.getService("LaunchPage");
                    var catalogTile = this.getCatalogTileDataFromModel(oSourceContext);
                    var tileGroups = catalogTile.tileData.associatedGroups;
                    var aGroupsInitialState = [];
                    var groupsData = groupList.map(function (group) {
                        var realGroupID,
                            selected,
                            oTemp;

                        // Get the group's real ID
                        realGroupID = launchPageService.getGroupId(group.object);
                        // Check if the group (i.e. real group ID) exists in the array of groups that contain the relevant Tile
                        // if so - the check box that represents this group should be initially selected
                        selected = !((tileGroups && Array.prototype.indexOf.call(tileGroups, realGroupID) === -1));
                        oTemp = {
                            id: realGroupID,
                            title: this._getGroupTitle(oDefaultGroup, group.object),
                            selected: selected
                        };
                        // Add the group to the array that keeps the groups initial state mainly whether or not the group included the relevant tile
                        aGroupsInitialState.push(oTemp);

                        return {
                            selected: selected,
                            initiallySelected: selected,
                            oGroup: group
                        };
                    }.bind(this));

                    // @TODO: Instead of the jQuery, we should maintain the state of the popover (i.e. opened/closed)
                    // using the afterOpen and afterClose events of sap.m.ResponsivePopover
                    var oPopoverView = sap.ui.getCore().byId("sapUshellGroupsPopover");
                    var tileTitle;
                    if (!oPopoverView) {
                        tileTitle = launchPageService.getCatalogTilePreviewTitle(oModel.getProperty(oSourceContext.sPath).src);
                        if (!tileTitle) {
                            tileTitle = launchPageService.getCatalogTileTitle(oModel.getProperty(oSourceContext.sPath).src);
                        }
                        var popoverView = new sap.ui.view("sapUshellGroupsPopover", {
                            type: ViewType.JS,
                            viewName: "sap.ushell.components.appfinder.GroupListPopover",
                            viewData: {
                                groupData: groupsData,
                                title: tileTitle,
                                enableHideGroups: oModel.getProperty("/enableHideGroups"),
                                enableHelp: oModel.getProperty("/enableHelp"),
                                sourceContext: oSourceContext,
                                catalogModel: this.getView().getModel(),
                                catalogController: this
                            }
                        });
                        popoverView.getController().setSelectedStart(aGroupsInitialState);
                        popoverView.open(clickedObject).then(this._handlePopoverResponse.bind(this, oSourceContext, catalogTile));
                    }
                }
            }.bind(this));
        },

        _getGroupTitle: function (oDefaultGroup, oGroupObject) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                title;
            // check if is it a default group- change title to "my home".
            if (oDefaultGroup && (oLaunchPageService.getGroupId(oDefaultGroup) === oLaunchPageService.getGroupId(oGroupObject))) {
                title = resources.i18n.getText("my_group");
            } else {
                title = oLaunchPageService.getGroupTitle(oGroupObject);
            }
            return title;
        },

        _handlePopoverResponse: function (oSourceContext, catalogTile, responseData) {
            if (!responseData.addToGroups.length && !responseData.newGroups.length && !responseData.removeFromGroups.length) {
                return;
            }

            var oModel = this.getView().getModel();
            var groupList = oModel.getProperty("/groups");
            var promiseList = [];

            responseData.addToGroups.forEach(function (group) {
                var index = groupList.indexOf(group);
                var oGroupContext = new Context(oModel, "/groups/" + index);
                var promise = this._addTile(oSourceContext, oGroupContext);
                promiseList.push(promise);
            }.bind(this));
            responseData.removeFromGroups.forEach(function (group) {
                var tileCatalogId = oSourceContext.getModel().getProperty(oSourceContext.getPath()).id;
                var index = groupList.indexOf(group);
                var promise = this._removeTile(tileCatalogId, index);
                promiseList.push(promise);
            }.bind(this));
            responseData.newGroups.forEach(function (group) {
                var sNewGroupName = (group.length > 0) ? group : resources.i18n.getText("new_group_name");
                var promise = this._createGroupAndSaveTile(oSourceContext, sNewGroupName);
                promiseList.push(promise);
            }.bind(this));

            jQuery.when.apply(jQuery, promiseList).then(function () {
                var resultList = Array.prototype.slice.call(arguments);
                this._handlePopoverGroupsActionPromises(catalogTile, responseData, resultList);
            }.bind(this));
        },

        _handlePopoverGroupsActionPromises: function (catalogTile, popoverResponse, resultList) {
            var errorList = resultList.filter(function (result) {
                return !result.status;
            });
            if (errorList.length) {
                var oErrorMessageObj = this.prepareErrorMessage(errorList, catalogTile.tileData.title);
                var catalogsMgr = sap.ushell.components.getCatalogsManager();
                catalogsMgr.resetAssociationOnFailure(oErrorMessageObj.messageId, oErrorMessageObj.parameters);
                return;
            }

            var tileGroupsIdList = [];
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
            popoverResponse.allGroups.forEach(function (group) {
                if (group.selected) {
                    var realGroupID = oLaunchPageService.getGroupId(group.oGroup.object);
                    tileGroupsIdList.push(realGroupID);
                }
            });
            var oModel = this.getView().getModel();
            if (popoverResponse.newGroups.length) {
                var dashboardGroups = oModel.getProperty("/groups");
                var newDashboardGroups = dashboardGroups.slice(dashboardGroups.length - popoverResponse.newGroups.length);
                newDashboardGroups.forEach(function (newGroup) {
                    var realGroupID = oLaunchPageService.getGroupId(newGroup.object);
                    tileGroupsIdList.push(realGroupID);
                });
            }

            oModel.setProperty(catalogTile.bindingContextPath + "/associatedGroups", tileGroupsIdList);
            var firstAddedGroupTitle = (popoverResponse.addToGroups[0]) ? popoverResponse.addToGroups[0].title : "";
            if (!firstAddedGroupTitle.length && popoverResponse.newGroups.length) {
                firstAddedGroupTitle = popoverResponse.newGroups[0];
            }
            var firstRemovedGroupTitle = (popoverResponse.removeFromGroups[0]) ? popoverResponse.removeFromGroups[0].title : "";
            var sDetailedMessage = this.prepareDetailedMessage(catalogTile.tileData.title, popoverResponse.addToGroups.length + popoverResponse.newGroups.length,
                popoverResponse.removeFromGroups.length, firstAddedGroupTitle, firstRemovedGroupTitle);
            MessageToast.show(sDetailedMessage, {
                duration: 3000, // default
                width: "15em",
                my: "center bottom",
                at: "center bottom",
                of: window,
                offset: "0 -50",
                collision: "fit fit"
            });
        },

        _getCatalogTileIndexInModel: function (oSourceContext) {
            var tilePath = oSourceContext.sPath,
                tilePathPartsArray = tilePath.split("/"),
                tileIndex = tilePathPartsArray[tilePathPartsArray.length - 1];

            return tileIndex;
        },

        _handleTileFooterClickInGroupContext: function (oSourceContext, sGroupModelPath) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                oModel = this.getView().getModel(),
                catalogTile = this.getCatalogTileDataFromModel(oSourceContext),
                aAssociatedGroups = catalogTile.tileData.associatedGroups,
                oGroupModel = oModel.getProperty(sGroupModelPath), // Get the model of the group according to the group's model path (e.g. "groups/4")
                sGroupId = oLaunchPageService.getGroupId(oGroupModel.object),
                iCatalogTileInGroup = aAssociatedGroups ? Array.prototype.indexOf.call(aAssociatedGroups, sGroupId) : -1,
                tilePath = catalogTile.bindingContextPath,
                oGroupContext,
                oAddTilePromise,
                oRemoveTilePromise,
                sTileCataogId,
                groupIndex,
                that = this;

            if (catalogTile.isBeingProcessed) {
                return;
            }
            oModel.setProperty(tilePath + "/isBeingProcessed", true);
            // Check if this catalog tile already exist in the relevant group
            if (iCatalogTileInGroup === -1) {
                oGroupContext = new Context(oSourceContext.getModel(), sGroupModelPath);
                oAddTilePromise = this._addTile(oSourceContext, oGroupContext);

                // Function createTile of Dashboard manager always calls defferred.resolve,
                // and the success/failure indicator is the returned data.status
                oAddTilePromise.done(function (data) {
                    if (data.status == 1) {
                        that._groupContextOperationSucceeded(oSourceContext, catalogTile, oGroupModel, true);
                    } else {
                        that._groupContextOperationFailed(catalogTile, oGroupModel, true);
                    }
                });
                oAddTilePromise.always(function () {
                    oModel.setProperty(tilePath + "/isBeingProcessed", false);
                });
            } else {
                sTileCataogId = oSourceContext.getModel().getProperty(oSourceContext.getPath()).id;
                groupIndex = sGroupModelPath.split("/")[2];
                oRemoveTilePromise = this._removeTile(sTileCataogId, groupIndex);

                // Function deleteCatalogTileFromGroup of Catalogs manager always calls defferred.resolve,
                // and the success/failure indicator is the returned data.status
                oRemoveTilePromise.done(function (data) {
                    if (data.status == 1) {
                        that._groupContextOperationSucceeded(oSourceContext, catalogTile, oGroupModel, false);
                    } else {
                        that._groupContextOperationFailed(catalogTile, oGroupModel, false);
                    }
                });
                oRemoveTilePromise.always(function () {
                    oModel.setProperty(tilePath + "/isBeingProcessed", false);
                });
            }
        },

        /**
         * Handles success of add/remove tile action in group context.
         * Updates the model and shows an appropriate message to the user.
         *
         * @param {object} oSourceContext oSourceContext
         * @param {object} oCatalogTileModel - The catalog tile model from /catalogTiles array
         * @param {object} oGroupModel - The model of the relevant group
         * @param {boolean} bTileAdded - Whether the performed action is adding or removing the tile to/from the group
         */
        _groupContextOperationSucceeded: function (oSourceContext, oCatalogTileModel, oGroupModel, bTileAdded) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                sGroupId = oLaunchPageService.getGroupId(oGroupModel.object),
                aAssociatedGroups = oCatalogTileModel.tileData.associatedGroups,
                detailedMessage,
                i;

            // Check if this is an "add tile to group" action
            if (bTileAdded) {
                // Update the associatedGroups array of the catalog tile
                aAssociatedGroups.push(sGroupId);

                // Update the model of the catalog tile with the updated associatedGroups
                oSourceContext.getModel().setProperty(oCatalogTileModel.bindingContextPath + "/associatedGroups", aAssociatedGroups);

                detailedMessage = this.prepareDetailedMessage(oCatalogTileModel.tileData.title, 1, 0, oGroupModel.title, "");
            } else {
                // If this is a "remove tile from group" action

                // Update the associatedGroups array of the catalog tile
                for (i in aAssociatedGroups) {
                    if (aAssociatedGroups[i] === sGroupId) {
                        aAssociatedGroups.splice(i, 1);
                        break;
                    }
                }

                // Update the model of the catalog tile with the updated associatedGroups
                oSourceContext.getModel().setProperty(oCatalogTileModel.bindingContextPath + "/associatedGroups", aAssociatedGroups);
                detailedMessage = this.prepareDetailedMessage(oCatalogTileModel.tileData.title, 0, 1, "", oGroupModel.title);
            }

            MessageToast.show(detailedMessage, {
                duration: 3000, // default
                width: "15em",
                my: "center bottom",
                at: "center bottom",
                of: window,
                offset: "0 -50",
                collision: "fit fit"
            });
        },

        /**
         * Handles failure of add/remove tile action in group context.
         * Shows an appropriate message to the user.
         * Don't need to reload the groups model, because groups update only after success API call.
         *
         * @param {object} oCatalogTileModel - The catalog tile model from /catalogTiles array
         * @param {object} oGroupModel - The model of the relevant group
         * @param {boolean} bTileAdded - Whether the performed action is adding or removing the tile to/from the group
         */
        _groupContextOperationFailed: function (oCatalogTileModel, oGroupModel, bTileAdded) {
            var catalogsMgr = sap.ushell.components.getCatalogsManager(),
                oErrorMessage;

            if (bTileAdded) {
                oErrorMessage = resources.i18n.getText({ messageId: "fail_tile_operation_add_to_group", parameters: [oCatalogTileModel.tileData.title, oGroupModel.title] });
            } else {
                oErrorMessage = resources.i18n.getText({ messageId: "fail_tile_operation_remove_from_group", parameters: [oCatalogTileModel.tileData.title, oGroupModel.title] });
            }

            catalogsMgr.notifyOnActionFailure(oErrorMessage.messageId, oErrorMessage.parameters);
        },

        prepareErrorMessage: function (aErroneousActions, sTileTitle) {
            var oGroup,
                sAction,
                sFirstErroneousAddGroup,
                sFirstErroneousRemoveGroup,
                iNumberOfFailAddActions = 0,
                iNumberOfFailDeleteActions = 0,
                bCreateNewGroupFailed = false,
                message;

            for (var index in aErroneousActions) {
                // Get the data of the error (i.e. action name and group object)

                oGroup = aErroneousActions[index].group;
                sAction = aErroneousActions[index].action;

                if (sAction === "add") {
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions === 1) {
                        sFirstErroneousAddGroup = oGroup.title;
                    }
                } else if (sAction === "remove") {
                    iNumberOfFailDeleteActions++;
                    if (iNumberOfFailDeleteActions === 1) {
                        sFirstErroneousRemoveGroup = oGroup.title;
                    }
                } else if (sAction === "addTileToNewGroup") {
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions === 1) {
                        sFirstErroneousAddGroup = oGroup.title;
                    }
                } else {
                    bCreateNewGroupFailed = true;
                }
            }
            // First - Handle bCreateNewGroupFailed
            if (bCreateNewGroupFailed) {
                if (aErroneousActions.length === 1) {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_create_new_group" });
                } else {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_some_actions" });
                }
                // Single error - it can be either one add action or one remove action
            } else if (aErroneousActions.length === 1) {
                if (iNumberOfFailAddActions) {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_add_to_group", parameters: [sTileTitle, sFirstErroneousAddGroup] });
                } else {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_remove_from_group", parameters: [sTileTitle, sFirstErroneousRemoveGroup] });
                }
                // Many errors (iErrorCount > 1) - it can be several remove actions, or several add actions, or a mix of both
            } else if (iNumberOfFailDeleteActions === 0) {
                message = resources.i18n.getText({ messageId: "fail_tile_operation_add_to_several_groups", parameters: [sTileTitle] });
            } else if (iNumberOfFailAddActions === 0) {
                message = resources.i18n.getText({ messageId: "fail_tile_operation_remove_from_several_groups", parameters: [sTileTitle] });
            } else {
                message = resources.i18n.getText({ messageId: "fail_tile_operation_some_actions" });
            }
            return message;
        },

        prepareDetailedMessage: function (tileTitle, numberOfAddedGroups, numberOfRemovedGroups, firstAddedGroupTitle, firstRemovedGroupTitle) {
            var message;

            if (numberOfAddedGroups === 0) {
                if (numberOfRemovedGroups === 1) {
                    message = resources.i18n.getText("tileRemovedFromSingleGroup", [tileTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = resources.i18n.getText("tileRemovedFromSeveralGroups", [tileTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups === 1) {
                if (numberOfRemovedGroups === 0) {
                    message = resources.i18n.getText("tileAddedToSingleGroup", [tileTitle, firstAddedGroupTitle]);
                } else if (numberOfRemovedGroups === 1) {
                    message = resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSingleGroup", [tileTitle, firstAddedGroupTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSeveralGroups", [tileTitle, firstAddedGroupTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups > 1) {
                if (numberOfRemovedGroups === 0) {
                    message = resources.i18n.getText("tileAddedToSeveralGroups", [tileTitle, numberOfAddedGroups]);
                } else if (numberOfRemovedGroups === 1) {
                    message = resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSingleGroup", [tileTitle, numberOfAddedGroups, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSeveralGroups", [tileTitle, numberOfAddedGroups, numberOfRemovedGroups]);
                }
            }
            return message;
        },

        /**
         * @param {Object} oSourceContext model context
         * @returns {Object} Returns the part of the model that contains the IDs of the groups that contain the relevant Tile
         */
        getCatalogTileDataFromModel: function (oSourceContext) {
            var sBindingCtxPath = oSourceContext.getPath(),
                oModel = oSourceContext.getModel(),
                oTileData = oModel.getProperty(sBindingCtxPath);

            // Return an object containing the Tile in the CatalogTiles Array (in the model) ,its index and whether it's in the middle of add/removal proccess.
            return {
                tileData: oTileData,
                bindingContextPath: sBindingCtxPath,
                isBeingProcessed: oTileData.isBeingProcessed
            };
        },

        /**
         * Send request to add a tile to a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext the catalog tile to add
         * @param {sap.ui.model.Context} oGroupContext the group where the tile should be added
         * @returns {Object} deferred
         * @private
         */
        _addTile: function (oTileContext, oGroupContext) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager(),
                deferred = jQuery.Deferred(),
                promise = oCatalogsManager.createTile({
                    catalogTileContext: oTileContext,
                    groupContext: oGroupContext
                });

            promise.done(function (data) {
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to delete a tile from a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {Number} tileCatalogId the id of the tile
         * @param {Number} index the index of the group in the model
         * @returns {Object} deferred
         * @private
         */
        _removeTile: function (tileCatalogId, index) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager(),
                deferred = jQuery.Deferred(),
                promise = oCatalogsManager.deleteCatalogTileFromGroup({
                    tileId: tileCatalogId,
                    groupIndex: index
                });

            // The function deleteCatalogTileFromGroup always results in deferred.resolve
            // and the actual result of the action (success/failure) is contained in the data object
            promise.done(function (data) {
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to create a new group and add a tile to this group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext the catalog tile to add
         * @param {String} newGroupName the name of the new group where the tile should be added
         * @returns {Object} deferred
         * @private
         */
        _createGroupAndSaveTile: function (oTileContext, newGroupName) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager(),
                deferred = jQuery.Deferred(),
                promise = oCatalogsManager.createGroupAndSaveTile({
                    catalogTileContext: oTileContext,
                    newGroupName: newGroupName
                });

            promise.done(function (data) {
                deferred.resolve(data);
            });

            return deferred;
        },

        onExit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "appFinderWithDocking", this._handleAppFinderWithDocking, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "appFinderAfterNavigate", this._handleAppFinderAfterNavigate, this);
        }
    });
});
},
	"sap/ushell/components/appfinder/Catalog.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/HTML",
    "sap/ushell/ui/appfinder/AppBox",
    "sap/ushell/ui/appfinder/PinButton",
    "sap/ushell/ui/launchpad/CatalogEntryContainer",
    "sap/ushell/ui/launchpad/CatalogsContainer",
    "sap/ushell/ui/launchpad/Panel",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ui/thirdparty/jquery",
    "sap/ui/performance/Measurement",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/ui/Device",
    "sap/m/MessagePage",
    "sap/m/Page",
    "sap/m/BusyIndicator",
    "sap/m/SplitApp",
    "sap/ushell/Config"
], function (
    HTML,
    AppBox,
    PinButton,
    CatalogEntryContainer,
    CatalogsContainer,
    Panel,
    Tile,
    jQuery,
    Measurement,
    resources,
    AccessibilityCustomData,
    List,
    StandardListItem,
    Device,
    MessagePage,
    Page,
    BusyIndicator,
    SplitApp,
    Config
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.appfinder.Catalog", {
        oController: null,

        createContent: function (oController) {
            var that = this;

            this.oViewData = this.getViewData();
            this.parentComponent = this.oViewData.parentComponent;

            var oModel = this.parentComponent.getModel();
            this.setModel(oModel);
            this.setModel(this.oViewData.subHeaderModel, "subHeaderModel");
            this.oController = oController;

            function iflong (sLong) {
                return ((sLong !== null) && (sLong === "1x2" || sLong === "2x2")) || false;
            }

            function to_int (v) {
                return parseInt(v, 10) || 0;
            }

            function get_tooltip (sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                var sTooltip;

                if (sGroupContextModelPath) {
                    var oResourceBundle = resources.i18n,
                        iCatalogTileInGroup = aGroupsIDs ? Array.prototype.indexOf.call(aGroupsIDs, sGroupContextId) : -1;

                    sTooltip = oResourceBundle.getText(iCatalogTileInGroup !== -1 ? "removeAssociatedTileFromContextGroup" : "addAssociatedTileToContextGroup", sGroupContextTitle);
                } else {
                    sTooltip = aGroupsIDs && aGroupsIDs.length ? sAddTileToMoreGroups : sAddTileGroups;
                }
                return sTooltip;
            }

            var oTilePinButton = new PinButton({
                icon: "sap-icon://pushpin-off",
                selected: {
                    parts: ["associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id"],
                    formatter: function (aAssociatedGroups, associatedGroupsLength, sGroupContextModelPath, sGroupContextId) {
                        if (sGroupContextModelPath) {
                            // If in group context - the icon is determined according to whether this catalog tile exists in the group or not
                            var iCatalogTileInGroup = aAssociatedGroups ? Array.prototype.indexOf.call(aAssociatedGroups, sGroupContextId) : -1;
                            return iCatalogTileInGroup !== -1;
                        }
                        return !!associatedGroupsLength;

                    }
                },
                tooltip: {
                    parts: ["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip", "i18n>EasyAccessMenu_PinButton_Toggled_Tooltip", "associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id", "/groupContext/title"],
                    formatter: function (sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, associatedGroupsLength, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                        return get_tooltip(sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, sGroupContextModelPath, sGroupContextId, sGroupContextTitle);
                    }
                },
                press: [oController.onTilePinButtonClick, oController]
            });

            var oAppBoxPinButton = new PinButton({
                icon: "sap-icon://pushpin-off",
                selected: {
                    parts: ["associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id"],
                    formatter: function (aAssociatedGroups, associatedGroupsLength, sGroupContextModelPath, sGroupContextId) {
                        if (sGroupContextModelPath) {
                            // If in group context - the icon is determined according to whether this catalog tile exists in the group or not
                            var iCatalogTileInGroup = aAssociatedGroups ? Array.prototype.indexOf.call(aAssociatedGroups, sGroupContextId) : -1;
                            return iCatalogTileInGroup !== -1;
                        }
                        return !!associatedGroupsLength;
                    }
                },
                tooltip: {
                    parts: ["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip", "i18n>EasyAccessMenu_PinButton_Toggled_Tooltip", "associatedGroups", "associatedGroups/length", "/groupContext/path", "/groupContext/id", "/groupContext/title"],
                    formatter: function (sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, associatedGroupsLength, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                        return get_tooltip(sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs, sGroupContextModelPath, sGroupContextId, sGroupContextTitle);
                    }
                },
                press: [oController.onTilePinButtonClick, oController]
            });

            this.oAppBoxesTemplate = new AppBox({
                title: "{title}",
                icon: "{icon}",
                subtitle: "{subtitle}",
                url: "{url}",
                navigationMode: "{navigationMode}",
                pinButton: oAppBoxPinButton,
                press: [oController.onAppBoxPressed, oController]
            });

            // When personalization is disabled, one should not see any option to click the pin button to personalize one's homepage.
            var bEnabledPersonalization = Config.last("/core/shell/enablePersonalization");
            oAppBoxPinButton.setVisible(bEnabledPersonalization);

            oAppBoxPinButton.addCustomData(new AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));
            oAppBoxPinButton.addStyleClass("sapUshellPinButton");

            oTilePinButton.setVisible(bEnabledPersonalization);
            oTilePinButton.addCustomData(new AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));
            oTilePinButton.addStyleClass("sapUshellPinButton");

            this.oTileTemplate = new Tile({
                tileViews: {
                    path: "content",
                    factory: function (sId, oContext) {
                        return oContext.getObject();
                    }
                },
                "long": {
                    path: "size",
                    formatter: iflong
                },
                index: {
                    path: "id",
                    formatter: to_int
                },
                tileCatalogId: "{id}",
                pinButton: oTilePinButton,
                press: [oController.catalogTilePress, oController],
                afterRendering: oController.onTileAfterRendering
            });

            this.oCatalogSelect = new List("catalogSelect", {
                visible: "{/enableCatalogSelection}",
                name: "Browse",
                rememberSelections: true,
                mode: "SingleSelectMaster",
                items: {
                    path: "/masterCatalogs",
                    template: new StandardListItem({
                        type: "Active",
                        title: "{title}",
                        tooltip: "{title}"
                    })
                },
                showNoData: false,
                itemPress: [oController._handleCatalogListItemPress, oController],
                selectionChange: [oController._handleCatalogListItemPress, oController]
            });

            this.getCatalogSelect = function () {
                return this.oCatalogSelect;
            };

            /*
             * override original onAfterRendering as currently sap.m.Select does not support afterRendering handler in the constructor
             * this is done to support tab order accessibility
             */
            var origCatalogSelectOnAfterRendering = this.oCatalogSelect.onAfterRendering;
            if (Device.system.desktop) {
                this.oCatalogSelect.addEventDelegate({
                    onsaptabnext: function (oEvent) {
                        try {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                        } catch (e) {
                            // continue regardless of error
                        }
                    },
                    onsapskipforward: function (oEvent) {
                        try {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            sap.ushell.components.ComponentKeysHandler.setFocusOnCatalogTile();
                        } catch (e) {
                            // continue regardless of error
                        }
                    },
                    onsapskipback: function (oEvent) {
                        try {
                            oEvent.preventDefault();
                            sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                            var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                            if (openCloseSplitAppButton.getVisible()) {
                                openCloseSplitAppButton.focus();
                            } else {
                                sap.ushell.components.ComponentKeysHandler.appFinderFocusMenuButtons(oEvent);
                            }
                        } catch (e) {
                            // continue regardless of error
                        }
                    }
                });
            }
            // if xRay is enabled
            if (oModel.getProperty("/enableHelp")) {
                this.oCatalogSelect.addStyleClass("help-id-catalogCategorySelect");// xRay help ID
            }

            this.setCategoryFilterSelection = function (sSelection, shouldFocusOnCategory) {
                var oCatalogSelection = that.getCatalogSelect(),
                    aCatalogListItems = oCatalogSelection.getItems(),
                    sSelected = sSelection,
                    selectedIndex = 0;

                if (!sSelected || sSelected === "") {
                    sSelected = resources.i18n.getText("all");
                }

                aCatalogListItems.forEach(function (oListItem, nIndex) {
                    if (oListItem.getTitle() === sSelected) {
                        selectedIndex = nIndex;
                        oCatalogSelection.setSelectedItem(oListItem);
                    }
                });

                if (aCatalogListItems.length !== 0 && shouldFocusOnCategory) {
                    aCatalogListItems[selectedIndex].focus();
                }
            };

            this.oCatalogSelect.onAfterRendering = function () {
                //set the selected item.
                var sSelected = that.oController.categoryFilter || resources.i18n.getText("all");

                that.setCategoryFilterSelection(sSelected);

                if (origCatalogSelectOnAfterRendering) {
                    origCatalogSelectOnAfterRendering.apply(this, arguments);
                }

                if (!this.getSelectedItem()) {
                    this.setSelectedItem(this.getItems()[0]);
                }

                //set focus on first segmented button
                setTimeout(function () {
                    var buttons = jQuery("#catalog-button, #userMenu-button, #sapMenu-button").filter("[tabindex=0]");
                    if (buttons.length) {
                        buttons.eq(0).focus();
                    } else {
                        jQuery("#catalog-button").focus();
                    }
                }, 0);
            };

            /*
             * setting followOf to false, so the popover won't close on IE.
             */
            var origOnAfterRenderingPopover = this.oCatalogSelect._onAfterRenderingPopover;
            this.oCatalogSelect._onAfterRenderingPopover = function () {
                if (this._oPopover) {
                    this._oPopover.setFollowOf(false);
                }
                if (origOnAfterRenderingPopover) {
                    origOnAfterRenderingPopover.apply(this, arguments);
                }
            };

            var oEventBus = sap.ui.getCore().getEventBus(),
                sDeatailPageId,
                fnUpdateMasterDetail = function () {
                    this.splitApp.toMaster("catalogSelect", "show");
                    if (!Device.system.phone) {
                        sDeatailPageId = this._calculateDetailPageId();
                        if (sDeatailPageId !== this.splitApp.getCurrentDetailPage().getId()) {
                            this.splitApp.toDetail(sDeatailPageId);
                        }
                    }
                };

            oEventBus.subscribe("launchpad", "catalogContentLoaded", function () {
                setTimeout(fnUpdateMasterDetail.bind(this), 500);
            }, this);
            oEventBus.subscribe("launchpad", "afterCatalogSegment", fnUpdateMasterDetail, this);

            var oAccessibilityTileText = new HTML("sapUshellCatalogAccessibilityTileText", {
                content: "<div style='height: 0px; width: 0px; overflow: hidden; float: left;'>" + resources.i18n.getText("tile") + "</div>"
            });

            // This renderes the catalogs.
            var oCatalogTemplate = new CatalogEntryContainer({
                header: "{title}",
                customTilesContainer: {
                    path: "customTiles",
                    template: this.oTileTemplate,
                    templateShareable: true
                },
                appBoxesContainer: {
                    path: "appBoxes",
                    template: this.oAppBoxesTemplate,
                    templateShareable: true
                }
            });

            // create message-page as invisible by default
            this.oMessagePage = new MessagePage({
                visible: true,
                showHeader: false,
                text: resources.i18n.getText("EasyAccessMenu_NoAppsToDisplayMessagePage_Text"),
                description: ""
            });

            // This renderes the catalogs.
            this.oCatalogsContainer = new CatalogsContainer("catalogTiles", {
                categoryFilter: "{/categoryFilter}",
                catalogs: {
                    path: "/catalogs",
                    templateShareable: true,
                    template: oCatalogTemplate
                    // here add the filter for the catalog.
                },
                busy: true
            });

            this.oCatalogsContainer.addStyleClass("sapUshellCatalogTileContainer");

            this.oCatalogsContainer.addEventDelegate({
                onsaptabprevious: function (oEvent) {
                    var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader"),
                        jqCurrentElement = jQuery(oEvent.srcControl.getDomRef());
                    if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed() &&
                        !jqCurrentElement.hasClass("sapUshellPinButton")) {
                        oEvent.preventDefault();
                        var appFinderSearch = sap.ui.getCore().byId("appFinderSearch");
                        appFinderSearch.focus();
                    }
                },
                onsapskipback: function (oEvent) {
                    var openCloseSplitAppButton = sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");
                    if (openCloseSplitAppButton.getVisible() && !openCloseSplitAppButton.getPressed()) {
                        oEvent.preventDefault();
                        openCloseSplitAppButton.focus();
                    }
                }
            });

            this.oCatalogsContainer.onAfterRendering = function () {
                var oCatalogTilesDetailedPage = sap.ui.getCore().byId("catalogTilesDetailedPage");
                if (!this.getBusy()) {
                    oCatalogTilesDetailedPage.setBusy(false);
                    Measurement.end("FLP:AppFinderLoadingStartToEnd");
                } else {
                    oCatalogTilesDetailedPage.setBusy(true);
                }

                jQuery("#catalogTilesDetailedPage-cont").scroll(function () {
                    var oPage = sap.ui.getCore().byId("catalogTilesDetailedPage"),
                        scroll = oPage.getScrollDelegate(),
                        currentPos = scroll.getScrollTop(),
                        max = scroll.getMaxScrollTop();

                    if (max - currentPos <= 30 + 3 * that.oController.PagingManager.getTileHeight() && that.oController.bIsInProcess === false) {
                        that.oController.bIsInProcess = true;
                        that.oController.allocateNextPage();
                        setTimeout(
                            function () {
                                that.oController.bIsInProcess = false;
                            }, 0);
                    }
                });
            };

            this.wrapCatalogsContainerInDetailPage = function (aCatalogsContainerContnet, sId) {
                var oDetailPage1 = new Page(sId, {
                    showHeader: false,
                    showFooter: false,
                    showNavButton: false,
                    content: [new Panel({
                        translucent: true,
                        content: aCatalogsContainerContnet
                    }).addStyleClass("sapUshellCatalogPage")]
                });

                return oDetailPage1;
            };

            this.getCatalogContainer = function () {
                return this.oCatalogsContainer;
            };

            new Page({
                showHeader: false,
                showFooter: false,
                showNavButton: false,
                content: [new Panel({
                    translucent: true,
                    content: [oAccessibilityTileText, this.getCatalogContainer()]
                }).addStyleClass("sapUshellCatalogPage")]
            });
            var oCatalogDetailedPage = this.wrapCatalogsContainerInDetailPage([oAccessibilityTileText, this.getCatalogContainer()], "catalogTilesDetailedPage"),
                oCatalogMessage = new Page("catalogMessagePage", {
                    showHeader: false,
                    showFooter: false,
                    showNavButton: false,
                    content: [this.oMessagePage]
                });

            var oSelectBusyIndicator = new BusyIndicator("catalogSelectBusyIndicator", { size: "1rem" });
            this.splitApp = new SplitApp("catalogViewMasterDetail", {
                masterPages: [oSelectBusyIndicator, this.oCatalogSelect],
                detailPages: [oCatalogDetailedPage, oCatalogMessage]
            });

            // Remove this: intended for testing porpuses.
            document.toSearch = function () {
                this.splitApp.toDetail("catalogTilesSearchPage");
            }.bind(this);
            document.toDetail = function () {
                this.splitApp.toDetail("catalogTilesDetailedPage");
            }.bind(this);
            document.toMessage = function () {
                this.splitApp.toDetail("catalogMessagePage");
            }.bind(this);

            return this.splitApp;
        },

        // calculate what is the relevant current detail page according to configuration and state of the view
        _calculateDetailPageId: function () {
            var oSubHeaderModel = this.getModel("subHeaderModel");
            var bSearchMode = oSubHeaderModel.getProperty("/search/searchMode");
            var bTagMode = oSubHeaderModel.getProperty("/tag/tagMode");
            var bNoCatalogs = !!this.getModel().getProperty("/catalogsNoDataText");
            var sId;
            if (bSearchMode || bTagMode) {
                sId = this.getController().bSearchResults ? "catalogTilesDetailedPage" : "catalogMessagePage";
            } else if (bNoCatalogs) {
                sId = "catalogMessagePage";
            } else {
                sId = "catalogTilesDetailedPage";
            }
            return sId;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.Catalog";
        }
    });
});
},
	"sap/ushell/components/appfinder/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(
    [
        "sap/ushell/components/CatalogsManager",
        "sap/ushell/resources",
        "sap/ui/core/UIComponent",
        "sap/m/routing/Router",
        "sap/ushell/Config",
        "sap/ushell/bootstrap/common/common.load.model",
        "sap/ushell/components/SharedComponentUtils",
        "sap/base/util/UriParameters"
    ], function (
        CatalogsManager,
        resources,
        UIComponent,
        Router,
        Config,
        oModelWrapper,
        oSharedComponentUtils,
        UriParameters
    ) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.appfinder.Component", {

        metadata: {
            manifest: "json"
        },

        parseOldCatalogParams: function (sUrl) {
            var mParameters = new UriParameters(sUrl).mParams,
                sValue,
                sKey;

            for (sKey in mParameters) {
                if (mParameters.hasOwnProperty(sKey)) {
                    sValue = mParameters[sKey][0];
                    mParameters[sKey] = sValue.indexOf("/") !== -1 ? encodeURIComponent(sValue) : sValue;
                }
            }
            return mParameters;
        },

        handleNavigationFilter: function (sNewHash) {
            var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sNewHash),
                mParameters;

            if (oShellHash && oShellHash.semanticObject === "shell" && oShellHash.action === "catalog") {
                mParameters = this.parseOldCatalogParams(sNewHash);
                setTimeout(function () {
                    this.getRouter().navTo("catalog", {filters: JSON.stringify(mParameters)});
                }.bind(this), 0);
                return this.oShellNavigation.NavigationFilterStatus.Abandon;
            }
            return this.oShellNavigation.NavigationFilterStatus.Continue;
        },

        createContent: function () {
            this.oRouter = this.getRouter();

            // model instantiated by the model wrapper
            this.oModel = oModelWrapper.getModel();
            this.setModel(this.oModel);

            // Model defaults are set now --- let`s continue.

            var sHash,
                oShellHash,
                mParameters,
                oComponentConfig,
                bPersonalizationActive = Config.last("/core/shell/enablePersonalization"),
                bSpacesEnabled = Config.last("/core/spaces/enabled");

            // The catalog route should be added only if personalization or spaces is active.
            // We did not use the XOR operand on purpose for a better code readability.
            if (bPersonalizationActive && !bSpacesEnabled || bSpacesEnabled && !bPersonalizationActive) {
                this.oRouter.addRoute({
                    name: "userMenu",
                    pattern: "userMenu/:filters:"
                });
                this.oRouter.addRoute({
                    name: "sapMenu",
                    pattern: "sapMenu/:filters:"
                });
                this.oRouter.addRoute({
                    name: "catalog",
                    pattern: ["catalog/:filters:", "", ":filters:"]
                });

                // trigger the reading of the homepage group display personalization
                // this is also needed when the app finder starts directly as the tab mode disables
                // the blind loading which is already prepared in the homepage manager
                oSharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");
            }

            var oCatalogsMgrData = {
                model: this.oModel,
                router: this.oRouter
            };
            this.oCatalogsManager = new CatalogsManager("dashboardMgr", oCatalogsMgrData);
            this.setModel(resources.i18nModel, "i18n");

            oSharedComponentUtils.toggleUserActivityLog();

            this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

            //handle direct navigation with the old catalog intent format
            /*global hasher*/
            sHash = hasher.getHash();
            oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sHash);
            if (oShellHash && oShellHash.semanticObject === "shell" && oShellHash.action === "catalog") {
                mParameters = this.parseOldCatalogParams(sHash);
                oComponentConfig = this.getMetadata().getConfig();
                this.oShellNavigation.toExternal({
                    target: {
                        semanticObject: oComponentConfig.semanticObject,
                        action: oComponentConfig.action
                    }
                });
                this.getRouter().navTo("catalog", {filters: JSON.stringify(mParameters)});
            }

            var oAppFinderView = sap.ui.view({
                id: "appFinderView",
                viewName: "sap.ushell.components.appfinder.AppFinder",
                type: "JS",
                async: true
            });

            return oAppFinderView;
        },

        exit: function () {
            this.oCatalogsManager.destroy();
        }
    });

});
},
	"sap/ushell/components/appfinder/EasyAccess.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/odata/ODataUtils",
    "sap/ui/thirdparty/datajs",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/library",
    "sap/ushell/ui/launchpad/AccessibilityCustomData"
], function (
    ODataUtils,
    OData,
    jQuery,
    resources,
    JSONModel,
    coreLibrary,
    AccessibilityCustomData
) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    sap.ui.controller("sap.ushell.components.appfinder.EasyAccess", {
        DEFAULT_URL: "/sap/opu/odata/UI2",
        DEFAULT_NUMBER_OF_LEVELS: 3,
        SEARCH_RESULTS_PER_REQUEST: 100,

        onInit: function () {
            var that = this;
            this.translationBundle = resources.i18n;
            this.oView = this.getView();
            var oEasyAccessSystemsModel = this.oView.getModel("easyAccessSystemsModel");
            var systemSelectedBinding = oEasyAccessSystemsModel.bindProperty("/systemSelected");
            systemSelectedBinding.attachChange(that.adjustUiOnSystemChange.bind(this));

            this.menuName = this.oView.getViewData().menuName;
            this.systemId = null;
            this.easyAccessCache = {};

            this.easyAccessModel = new JSONModel();
            this.oView.hierarchyFolders.setModel(this.easyAccessModel, "easyAccess");
            this.oView.hierarchyApps.setModel(this.easyAccessModel, "easyAccess");

            // take the sub-header model
            var oSubHeaderModel = this.oView.getModel("subHeaderModel");

            // init listener for the toggle button bindig context
            var oToggleButtonModelBinding = oSubHeaderModel.bindProperty("/openCloseSplitAppButtonToggled");
            oToggleButtonModelBinding.attachChange(that.handleToggleButtonModelChanged.bind(this));

            // only in case search is enabled for this View, we init the listener on the search binding context
            if (this.oView.getViewData().enableSearch) {
                var oSearchModelBinding = oSubHeaderModel.bindProperty("/search");
                oSearchModelBinding.attachChange(that.handleSearchModelChanged.bind(this));
            }

            this.checkIfSystemSelectedAndLoadData();
        },

        onAfterRendering: function () {
            setTimeout(function () {
                this.oView.hierarchyApps.getController()._updateAppBoxedWithPinStatuses();
            }.bind(this), 0);
        },

        checkIfSystemSelectedAndLoadData: function () {
            var oSystemSelected = this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");
            if (oSystemSelected) {
                this.systemId = oSystemSelected.systemId;
                this.loadMenuItemsFirstTime(this.oView.getViewData().menuName, oSystemSelected);
            }
        },

        navigateHierarchy: function (path, forward) {
            this.oView.hierarchyFolders.setBusy(false);
            var entity = this.easyAccessModel.getProperty(path || "/");
            if (typeof entity.folders !== "undefined") {
                this.oView.hierarchyFolders.updatePageBindings(path, forward);
                this.oView.hierarchyApps.getController().updatePageBindings(path);
                return;
            }
            this.oView.hierarchyFolders.setBusy(true);
            this.getMenuItems(this.menuName, this.systemId, entity.id, entity.level).then(function (path, response) {
                this.easyAccessModel.setProperty(path + "/folders", response.folders);
                this.easyAccessModel.setProperty(path + "/apps", response.apps);
                this.oView.hierarchyFolders.updatePageBindings(path, forward);
                this.oView.hierarchyApps.getController().updatePageBindings(path);
                this.oView.hierarchyFolders.setBusy(false);
            }.bind(this, path), function (error) {
                this.handleGetMenuItemsError(error);
            }.bind(this));
        },

        handleSearch: function (searchTerm) {
            var isFirstTime = !this.hierarchyAppsSearchResults;

            if (isFirstTime) {
                // create the Hierarchy-Apps view for search-result
                this.hierarchyAppsSearchResults = new sap.ui.view(this.getView().getId() + "hierarchyAppsSearchResults", {
                    type: ViewType.JS,
                    viewName: "sap.ushell.components.appfinder.HierarchyApps",
                    height: "100%",
                    viewData: {
                        easyAccessSystemsModel: this.oView.getModel("easyAccessSystemsModel"),
                        getMoreSearchResults: this.getMoreSearchResults.bind(this)
                    }
                });

                // set the model
                this.easyAccessSearchResultsModel = new JSONModel();
                // change the default value of the maximum number of entries which are used for list bindings
                this.easyAccessSearchResultsModel.setSizeLimit(10000);
                this.hierarchyAppsSearchResults.setModel(this.easyAccessSearchResultsModel, "easyAccess");
                this.hierarchyAppsSearchResults.setBusyIndicatorDelay(this.getView().BUSY_INDICATOR_DELAY);
                this.hierarchyAppsSearchResults.addStyleClass(" sapUshellAppsView sapMShellGlobalInnerBackground");
                this.hierarchyAppsSearchResults.addCustomData(new AccessibilityCustomData({
                    key: "role",
                    value: "region",
                    writeToDom: true
                }));
                this.hierarchyAppsSearchResults.addCustomData(new AccessibilityCustomData({
                    key: "aria-label",
                    value: this.oView.oResourceBundle.getText("easyAccessTileContainer"),
                    writeToDom: true
                }));
            }

            // reset for the paging mechanism
            this.searchResultFrom = 0;
            this.oView.splitApp.getCurrentDetailPage().setBusy(true);
            this.easyAccessSearchResultsModel.setProperty("/apps", []);
            this.easyAccessSearchResultsModel.setProperty("/total", 0);
            this._getSearchResults(searchTerm, this.searchResultFrom).then(function (response) {
                // Solution for Internal incident #1770582955: After doing 'search' the results are comming from
                // the backend and the 'bookmarkCount' property is not part of the properties there.
                // Hence, we need to copy its previous content to the new results
                response.results.forEach(function (element) {
                    var bookmarkService = sap.ushell.Container.getService("Bookmark");
                    bookmarkService.countBookmarks(element.url).then(function (count) {
                        element.bookmarkCount = count;
                    });
                });

                this.easyAccessSearchResultsModel.setProperty("/apps", response.results);
                this.easyAccessSearchResultsModel.setProperty("/total", response.count);

                this.searchResultFrom = response.results.length; //for the pagin mechanism -> update the next search results
                if (isFirstTime) {
                    this.oView.splitApp.addDetailPage(this.hierarchyAppsSearchResults);
                }
                // we must initiate an update to the result text / messagePage to rerun its formatter function
                // which resides on the Hierarchy-Apps View
                this.hierarchyAppsSearchResults.updateResultSetMessage(parseInt(response.count, 10), true);

                this.oView.splitApp.getCurrentDetailPage().setBusy(false);
                if (this.oView.splitApp.getCurrentDetailPage() !== this.hierarchyAppsSearchResults) {
                    this.oView.splitApp.toDetail(this.getView().getId() + "hierarchyAppsSearchResults");
                }
            }.bind(this), function (error) {
                this.handleGetMenuItemsError(error);
                this.oView.splitApp.getCurrentDetailPage().setBusy(false);
            }.bind(this));
        },

        getMoreSearchResults: function () {
            if (this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy) {
                this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy(true);
            }
            var oSubHeaderModel = this.oView.getModel("subHeaderModel");
            var sSearchTerm = oSubHeaderModel.getProperty("/search/searchTerm");
            this._getSearchResults(sSearchTerm, this.searchResultFrom).then(function (response) {
                var aCurrentResults = this.easyAccessSearchResultsModel.getProperty("/apps");
                // Due to a bug -> need to copy the array by reference in order for the binding to the model will behave as expected
                var aNewResults = aCurrentResults.slice();
                Array.prototype.push.apply(aNewResults, response.results);
                this.easyAccessSearchResultsModel.setProperty("/apps", aNewResults);
                if (this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy) {
                    this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy(false);
                }
                this.searchResultFrom = aNewResults.length; //for the pagin mechanism -> update the next search results
            }.bind(this), function (error) {
                this.handleGetMenuItemsError(error);
                if (this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy) {
                    this.oView.splitApp.getCurrentDetailPage().setShowMoreResultsBusy(true);
                }
            }.bind(this));
        },

        _getSearchResults: function (searchTerm, from) {
            var oDeferred = new jQuery.Deferred();
            var sServiceUrl = this._getODataRequestForSearchUrl(this.menuName, this.systemId, searchTerm, from);

            var oRequest = {
                requestUri: sServiceUrl
            };

            var oCallOdataServicePromise = this._callODataService(oRequest, this.handleSuccessOnReadFilterResults);
            oCallOdataServicePromise.done(function (data) {
                oDeferred.resolve(data);
            });
            oCallOdataServicePromise.fail(function (error) {
                oDeferred.reject(error);
            });

            return oDeferred.promise();
        },

        getSystemNameOrId: function () {
            var oSystemSelected = this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");
            if (oSystemSelected) {
                return oSystemSelected.name || oSystemSelected.id;
            }
        },

        adjustUiOnSystemChange: function () {
            var oCurrentData = this.easyAccessModel.getData();
            // we do not put in cache empty objects
            // if there is no data for system then we do not cache this, this causes inconsistencies when looking at the data
            if (this.systemId && oCurrentData && oCurrentData.id) {
                this.easyAccessCache[this.systemId] = oCurrentData;
            }

            var oSystemSelected = this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");
            if (oSystemSelected) {
                this.systemId = oSystemSelected.systemId;
                var newData = this.easyAccessCache[this.systemId];

                if (newData) {
                    this.easyAccessModel.setData(newData);
                    this.navigateHierarchy("", false);
                } else {
                    this.oView.hierarchyFolders.setBusy(true);
                    this.oView.hierarchyApps.setBusy(true);
                    this.loadMenuItemsFirstTime(this.menuName, oSystemSelected);
                }
            }
        },

        handleToggleButtonModelChanged: function () {
            var oSubHeaderModel = this.oView.getModel("subHeaderModel");
            var bButtonVisible = oSubHeaderModel.getProperty("/openCloseSplitAppButtonVisible");
            var bButtonToggled = oSubHeaderModel.getProperty("/openCloseSplitAppButtonToggled");

            var oSplitApp = this.getView().splitApp;

            if (bButtonVisible) {
                if (bButtonToggled && !oSplitApp.isMasterShown()) {
                    oSplitApp.showMaster();
                } else if (oSplitApp.isMasterShown()) {
                    oSplitApp.hideMaster();
                }
            }
        },

        handleSearchModelChanged: function () {
            var oSubHeaderModel = this.oView.getModel("subHeaderModel");
            var sActiveMenu = oSubHeaderModel.getProperty("/activeMenu");

            // if view ID does not contain the active menu then return
            if (this.getView().getId().indexOf(sActiveMenu) === -1) {
                return;
            }

            var sSearchTerm = oSubHeaderModel.getProperty("/search/searchTerm");
            var bSearchMode = oSubHeaderModel.getProperty("/search/searchMode");

            // make sure search mode is true && the search term is not null or undefined
            if (bSearchMode) {

                // update 'aria-controls' property of the App Finder's Search Field
                // (This property is the first custom data of the search-field control)
                sap.ui.getCore().byId("appFinderSearch").getCustomData()[0].setValue(this.getView().getId() + "hierarchyAppsSearchResults");

                // of search term is a real value (not empty) then we perform search
                if (sSearchTerm) {
                    this.handleSearch(sSearchTerm);
                }
                // otherwise it is null/undefined/"", in such a case we will do nothing, as search mode is true
                // so this is a search click on 'X' scenario OR empty search scenario
            } else {
                // clear the 'aria-controls' property of the App Finder's Search Field
                sap.ui.getCore().byId("appFinderSearch").getCustomData()[0].setValue("");

                // else - search mode is false, so we go back to the hierarchy apps regular view
                this.oView.splitApp.toDetail(this.getView().getId() + "hierarchyApps");
            }
        },

        loadMenuItemsFirstTime: function (menuName, oSystem) {
            return this.getMenuItems(menuName, oSystem.systemId, "", 0).then(function (response) {
                response.text = oSystem.systemName || oSystem.systemId;
                this.easyAccessModel.setData(response);
                this.oView.hierarchyFolders.setBusy(false);
                this.oView.hierarchyApps.setBusy(false);
                this.navigateHierarchy("", false);
            }.bind(this), function (error) {
                this.handleGetMenuItemsError(error);
                this.oView.hierarchyFolders.updatePageBindings("/", false);
                this.oView.hierarchyApps.getController().updatePageBindings("/");
            }.bind(this));
        },

        handleGetMenuItemsError: function (error) {
            var sErrorMessage = this.getErrorMessage(error);
            sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                MessageBox.error(sErrorMessage);
            });
            this.easyAccessModel.setData("");
            this.oView.hierarchyFolders.setBusy(false);
            this.oView.hierarchyApps.setBusy(false);
        },

        getErrorMessage: function (error) {
            var sMenuNameString = "";
            if (this.menuName === "SAP_MENU") {
                sMenuNameString = this.translationBundle.getText("easyAccessSapMenuNameParameter");
            } else if (this.menuName === "USER_MENU") {
                sMenuNameString = this.translationBundle.getText("easyAccessUserMenuNameParameter");
            }

            if (error) {
                if (error.message) {
                    return this.translationBundle.getText("easyAccessErrorGetDataErrorMsg", [sMenuNameString, error.message]);
                }
                return this.translationBundle.getText("easyAccessErrorGetDataErrorMsg", [sMenuNameString, error]);
            }
            return this.translationBundle.getText("easyAccessErrorGetDataErrorMsgNoReason", sMenuNameString);
        },

        /**
         * @param {string} menuType - the service that need to be called (can be USER_MENU or SAP_MENU)
         * @param {string} systemId - the system that the user choose in the system selector
         * @param {string} entityId - the "root" entity. Can be a specific id or "" in case it is the first call
         * @param {number} entityLevel - the entity level (if it is the root entity the level should be 0)
         * @param {string} numberOfNextLevels - how much levels would like to retrieve. id no value is passed the default value is 3
         * @returns {*} - an object to add to the system easy access model
         */
        getMenuItems: function (menuType, systemId, entityId, entityLevel, numberOfNextLevels) {
            var oDeferred = new jQuery.Deferred();

            if (menuType !== "SAP_MENU" && menuType !== "USER_MENU") {
                oDeferred.reject("Invalid menuType parameter");
                return oDeferred.promise();
            }

            if (typeof systemId !== "string" || systemId === "") {
                oDeferred.reject("Invalid systemId parameter");
                return oDeferred.promise();
            }

            if (typeof entityId !== "string") {
                oDeferred.reject("Invalid entityId parameter");
                return oDeferred.promise();
            }

            if (typeof entityLevel !== "number") {
                oDeferred.reject("Invalid entityLevel parameter");
                return oDeferred.promise();
            }

            if (numberOfNextLevels && typeof numberOfNextLevels !== "number") {
                oDeferred.reject("Invalid numberOfNextLevels parameter");
                return oDeferred.promise();
            }

            if (entityId === "") {
                entityLevel = 0;
            }
            var iNumberOfNextLevelsValue;
            var oModel = this.getView().getModel();
            var iConfiguredNumbersOfLevels = oModel.getProperty("/easyAccessNumbersOfLevels");
            if (iConfiguredNumbersOfLevels) {
                iNumberOfNextLevelsValue = iConfiguredNumbersOfLevels;
            } else if (numberOfNextLevels) {
                iNumberOfNextLevelsValue = numberOfNextLevels;
            } else {
                iNumberOfNextLevelsValue = this.DEFAULT_NUMBER_OF_LEVELS;
            }
            var iLevelFilter = entityLevel + iNumberOfNextLevelsValue + 1;

            var sServiceUrl = this._getODataRequestUrl(menuType, systemId, entityId, iLevelFilter);

            var oRequest = { requestUri: sServiceUrl };

            var oCallOdataServicePromise = this._callODataService(oRequest, this.handleSuccessOnReadMenuItems, { systemId: systemId, entityId: entityId, iLevelFilter: iLevelFilter });
            oCallOdataServicePromise.done(function (data) {
                oDeferred.resolve(data);
            });
            oCallOdataServicePromise.fail(function (error) {
                oDeferred.reject(error);
            });

            return oDeferred.promise();
        },

        _callODataService: function (oRequest, fSuccessHandler, oSucceessHandlerParameters) {
            var sLanguage, iSapClient;
            var that = this;
            var oDeferred = new jQuery.Deferred();

            if (!oSucceessHandlerParameters) {
                oSucceessHandlerParameters = {};
            }

            if (sap.ushell.Container) {
                sLanguage = sap.ushell.Container && sap.ushell.Container.getUser().getLanguage();
                if ((sLanguage) && (oRequest.requestUri.indexOf("sap-language=") === -1)) {
                    oRequest.requestUri = oRequest.requestUri + (oRequest.requestUri.indexOf("?") >= 0 ? "&" : "?") + "sap-language=" + sLanguage;
                }
                iSapClient = sap.ushell.Container.getLogonSystem() ? sap.ushell.Container.getLogonSystem().getClient() : "";
            }

            sap.ui.require(["sap/ui/thirdparty/datajs"], function () {
                OData.read({
                    requestUri: oRequest.requestUri,
                    headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        "Pragma": "no-cache",
                        "Expires": "0",
                        "Accept-Language": (sap.ui && sap.ui.getCore().getConfiguration().getLanguage()) || "",
                        "sap-client": (iSapClient || ""),
                        "sap-language": (sLanguage || "")
                    }
                },
                    // Success handler
                    function (oResult, oResponseData) {
                        if (oResult && oResult.results && oResponseData && oResponseData.statusCode === 200) {
                            var oReturnedModel = fSuccessHandler.bind(that, oResult, oSucceessHandlerParameters)();
                            oDeferred.resolve(oReturnedModel);
                        }
                    },

                    // Fail handler
                    function (oMessage) {
                        oDeferred.reject(oMessage);
                    }
                );
            });

            return oDeferred.promise();
        },

        handleSuccessOnReadMenuItems: function (oResult, oParameters) {
            var oReturnedModel = this._oDataResultFormatter(oResult.results, oParameters.systemId, oParameters.entityId, oParameters.iLevelFilter);
            return oReturnedModel;
        },

        handleSuccessOnReadFilterResults: function (oResult) {
            var sUpdatedUrl;

            oResult.results.forEach(function (oResultItem, iIndex) {
                sUpdatedUrl = this._appendSystemToUrl(oResultItem, this.systemId);
                oResultItem.url = sUpdatedUrl;
            }.bind(this));

            return {
                results: oResult.results,
                count: oResult.__count
            };
        },

        _appendSystemToUrl: function (oData, sSystemId) {
            if (oData.url) {
                return oData.url + (oData.url.indexOf("?") > 0 ? "&" : "?") + "sap-system=" + sSystemId;
            }
        },

        _oDataResultFormatter: function (aResults, systemId, entityId, iLevelFilter) {
            var oFoldersMap = {};
            var oReturnedData = {};

            if (entityId === "") {
                oReturnedData = {
                    id: "root",
                    text: "root",
                    level: 0,
                    folders: [],
                    apps: []
                };
                oFoldersMap.root = oReturnedData;
            } else {
                oReturnedData = {
                    id: entityId,
                    folders: [],
                    apps: []
                };
                oFoldersMap[entityId] = oReturnedData;
            }

            var odataResult;
            for (var i = 0; i < aResults.length; i++) {
                odataResult = aResults[i];

                var oParent;
                if (odataResult.level === "01") {
                    oParent = oFoldersMap.root;
                } else {
                    oParent = oFoldersMap[odataResult.parentId];
                }

                var oMenuItem = {
                    id: odataResult.Id,
                    text: odataResult.text,
                    subtitle: odataResult.subtitle,
                    icon: odataResult.icon,
                    level: parseInt(odataResult.level, 10)
                };
                if (odataResult.type === "FL") {
                    oMenuItem.folders = [];
                    oMenuItem.apps = [];
                    if (odataResult.level == iLevelFilter - 1) {
                        oMenuItem.folders = undefined;
                        oMenuItem.apps = undefined;
                    }
                    if (oParent && oParent.folders) {
                        oParent.folders.push(oMenuItem);
                    }
                    oFoldersMap[odataResult.Id] = oMenuItem;
                } else {
                    oMenuItem.url = this._appendSystemToUrl(odataResult, systemId);
                    if (oParent && oParent.apps) {
                        oParent.apps.push(oMenuItem);
                    }
                }
            }
            return oReturnedData;
        },

        _getODataRequestUrl: function (menuType, systemId, entityId, iLevelFilter) {
            var sServiceUrl = this._getServiceUrl(menuType);

            var sLevelFilter;
            if (iLevelFilter < 10) {
                sLevelFilter = "0" + iLevelFilter;
            } else {
                sLevelFilter = iLevelFilter.toString();
            }

            var entityIdFilter = "";
            if (entityId) {
                // we check if the entityId is already encoded
                // in case not (e.g. decoding it equals to the value itself) - we encode it
                if (decodeURIComponent(entityId) === entityId) {
                    entityId = encodeURIComponent(entityId);
                }

                entityIdFilter = "('" + entityId + "')/AllChildren";
            }

            sServiceUrl = sServiceUrl + ";o=" + systemId + "/MenuItems" + entityIdFilter + "?$filter=level lt '" + sLevelFilter + "'&$orderby=level,text";
            return sServiceUrl;
        },

        _getODataRequestForSearchUrl: function (menuType, systemId, sTerm, iFrom) {
            var sServiceUrl = this._getServiceUrl(menuType);
            var iNumOfRecords = this.SEARCH_RESULTS_PER_REQUEST;
            sTerm = this._removeWildCards(sTerm);
            iFrom = !iFrom ? 0 : iFrom;

            // format the given term using the ODataUtils
            sTerm = ODataUtils.formatValue(sTerm, "Edm.String");
            sServiceUrl = sServiceUrl + ";o=" + systemId + "/MenuItems?$filter=type ne 'FL' and substringof(" + sTerm + ", text) or substringof(" + sTerm + ", subtitle) or substringof(" + sTerm + ", url)&$orderby=text,subtitle,url&$inlinecount=allpages&$skip=" + iFrom + "&$top=" + iNumOfRecords;
            return sServiceUrl;
        },

        _getServiceUrl: function (menuType) {
            var sServiceUrl;
            var oModel = this.getView().getModel();
            if (menuType === "SAP_MENU") {
                var oSapMenuServiceUrlConfig = oModel.getProperty("/sapMenuServiceUrl");
                if (oSapMenuServiceUrlConfig) {
                    sServiceUrl = oSapMenuServiceUrlConfig;
                } else {
                    sServiceUrl = this.DEFAULT_URL + "/EASY_ACCESS_MENU";
                }

            } else if (menuType === "USER_MENU") {
                var oUserMenuServiceUrlConfig = oModel.getProperty("/userMenuServiceUrl");
                if (oUserMenuServiceUrlConfig) {
                    sServiceUrl = oUserMenuServiceUrlConfig;
                } else {
                    sServiceUrl = this.DEFAULT_URL + "/USER_MENU";
                }
            }
            return sServiceUrl;
        },

        _removeWildCards: function (sTerm) {
            return sTerm.replace(/\*/g, "");
        }
    });
});
},
	"sap/ushell/components/appfinder/EasyAccess.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/SplitApp",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ui/core/library",
    "sap/ushell/resources"
], function (SplitApp, AccessibilityCustomData, coreLibrary, resources) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    sap.ui.jsview("sap.ushell.components.appfinder.EasyAccess", {
        BUSY_INDICATOR_DELAY: 1000,

        createContent: function (oController) {
            this.oResourceBundle = resources.i18n;

            this.setModel(this.getViewData().easyAccessSystemsModel, "easyAccessSystemsModel");
            this.setModel(this.getViewData().subHeaderModel, "subHeaderModel");
            this.setModel(this.getViewData().parentComponent.getModel());

            /*
             * Initialize split app master view.
             */
            this.hierarchyFolders = sap.ui.view({
                type: ViewType.JS,
                viewName: "sap.ushell.components.appfinder.HierarchyFolders",
                height: "100%",
                viewData: {
                    navigateHierarchy: this.oController.navigateHierarchy.bind(oController),
                    easyAccessSystemsModel: this.getModel("easyAccessSystemsModel"),
                    subHeaderModel: this.getModel("subHeaderModel")
                }
            });

            this.hierarchyFolders.setBusyIndicatorDelay(this.BUSY_INDICATOR_DELAY);
            this.hierarchyFolders.addStyleClass("sapUshellHierarchyFolders");
            this.hierarchyFolders.addCustomData(new AccessibilityCustomData({
                key: "role",
                value: "navigation",
                writeToDom: true
            }));
            this.hierarchyFolders.addCustomData(new AccessibilityCustomData({
                key: "aria-label",
                value: this.oResourceBundle.getText("easyAccessListNavigationContainer"),
                writeToDom: true
            }));

            /*
             * Initialize split app details view.
             */
            this.hierarchyApps = new sap.ui.view(this.getId() + "hierarchyApps", {
                type: ViewType.JS,
                viewName: "sap.ushell.components.appfinder.HierarchyApps",
                height: "100%",
                viewData: {
                    navigateHierarchy: this.oController.navigateHierarchy.bind(oController)
                }
            });
            this.hierarchyApps.setBusyIndicatorDelay(this.BUSY_INDICATOR_DELAY);
            this.hierarchyApps.addStyleClass(" sapUshellAppsView sapMShellGlobalInnerBackground");
            this.hierarchyApps.addCustomData(new AccessibilityCustomData({
                key: "role",
                value: "region",
                writeToDom: true
            }));
            this.hierarchyApps.addCustomData(new AccessibilityCustomData({
                key: "aria-label",
                value: this.oResourceBundle.getText("easyAccessTileContainer"),
                writeToDom: true
            }));

            /*
             * Setup split app
             */
            this.splitApp = new SplitApp({
                masterPages: this.hierarchyFolders,
                detailPages: this.hierarchyApps
            });
            this.splitApp.setInitialMaster(this.hierarchyFolders);
            this.splitApp.setInitialDetail(this.hierarchyApps);

            return this.splitApp;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.EasyAccess";
        }
    });
});
},
	"sap/ushell/components/appfinder/GroupListPopover.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/m/MessageToast",
    "sap/ushell/resources",
    "sap/ui/Device",
    "sap/ui/model/Context",
    "sap/ui/model/json/JSONModel"
], function (
    jQuery,
    MessageToast,
    resources,
    Device,
    Context,
    JSONModel
) {
    "use strict";

    sap.ui.controller("sap.ushell.components.appfinder.GroupListPopover", {
        onInit: function () {
            var oView = this.getView(),
                groupData = oView.getViewData().groupData;
            this.oPopoverModel = new JSONModel({ userGroupList: groupData });
            this.oPopoverModel.setSizeLimit(9999);
            oView.oPopover.setModel(this.oPopoverModel);
        },

        okButtonHandler: function (oEvent) {
            oEvent.preventDefault();
            oEvent._bIsStopHandlers = true;
            var oView = this.getView(),
                userGroupList = this.oPopoverModel.getProperty("/userGroupList"),
                returnChanges = {
                    addToGroups: [],
                    removeFromGroups: [],
                    newGroups: [],
                    allGroups: userGroupList
                };
            userGroupList.forEach(function (group) {
                if (group.selected === group.initiallySelected) {
                    return;
                }
                if (group.selected) {
                    returnChanges.addToGroups.push(group.oGroup);
                } else {
                    returnChanges.removeFromGroups.push(group.oGroup);
                }
            });
            if (oView.newGroupInput && oView.newGroupInput.getValue().length) {
                returnChanges.newGroups.push(oView.newGroupInput.getValue());
            }
            oView.oPopover.close();
            oView.deferred.resolve(returnChanges);
        },

        _closeButtonHandler: function (oEvent) {
            oEvent._bIsStopHandlers = true;
            var oView = this.getView();
            oView.oPopover.close();
            oView.deferred.reject();
        },

        _createGroupAndSaveTile: function (oTileContext, newGroupName) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager(),
                deferred = jQuery.Deferred(),
                promise = oCatalogsManager.createGroupAndSaveTile({
                    catalogTileContext: oTileContext,
                    newGroupName: newGroupName
                });

            promise.done(function (data) {
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * On clicking an item in the group list (displayListItem):
         *   1. Check if the relevant tile was added or removed to/from the associated group
         *   2. Call the actual add/remove functionality
         */
        groupListItemClickHandler: function (obj) {
            obj.oSource.setSelected(!obj.oSource.getSelected());
            var sItemModelPath = obj.oSource.getBindingContextPath(),
                oPopoverModel = obj.oSource.getModel(),
                bSelected = !!obj.oSource.getSelected();
            this.addRemoveTileFromGroup(sItemModelPath, oPopoverModel, bSelected);
        },

        getGroupsBeforeChanges: function (sPath) {
            var oModel = this.getView().getViewData().sourceContext.oModel;
            return oModel.getProperty(sPath + "/associatedGroups");
        },

        getGroupsAfterChanges: function (/*sPath*/) {
            var oGroupsPopover = sap.ui.getCore().byId("groupsPopover");
            return oGroupsPopover.getModel().getProperty("/userGroupList");
        },

        /**
         * Handler for checking/unchecking group item in the tile groups popover.
         *   - If the group is locked - ignore it
         */
        checkboxClickHandler: function (oObjData) {
            var oView = this.getView(),
                sPath = oView.getViewData().sourceContext.sPath,
                aGroupsBeforeChanges = this.getGroupsBeforeChanges(sPath),
                aGroupsAfterChanges = this.getGroupsAfterChanges(),
                oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                oPopoverModel = oObjData.oSource.getModel(),
                bSelected = oObjData.getParameter("selected"),
                indexBefore = 0,
                i = 0,
                done = false,
                sGroupModelPath;

            while (oLaunchPageService.isGroupLocked(aGroupsAfterChanges[i].oGroup.object) === true) {
                i++;
            }
            for (i; i < aGroupsAfterChanges.length; i++) {
                var existsBefore = false;
                if (done === true) {
                    break;
                }
                for (indexBefore = 0; indexBefore < aGroupsBeforeChanges.length; indexBefore++) {
                    if (oLaunchPageService.getGroupId(aGroupsAfterChanges[i].oGroup.object) === aGroupsBeforeChanges[indexBefore]) {
                        existsBefore = true;
                        // check if there is a need to remove tile
                        if (aGroupsAfterChanges[i].selected === false) {
                            done = true;
                            sGroupModelPath = ("/userGroupList/" + i);
                            this.addRemoveTileFromGroup(sGroupModelPath, oPopoverModel, bSelected);
                            break;
                        }
                    }
                }
                // Uncheck
                if (aGroupsAfterChanges[i].selected === true && existsBefore === false) {
                    sGroupModelPath = ("/userGroupList/" + i);
                    this.addRemoveTileFromGroup(sGroupModelPath, oPopoverModel, bSelected);
                    break;
                }
            }
        },

        /**
         * Add/remove a tile to/from a group
         * The adding/removing action is done by calls to catalogController.
         * The array associatedGroups in the tile's model is updated accordingly
         */
        addRemoveTileFromGroup: function (sItemModelPath, oPopoverModel, bToAdd) {

            var oView = this.getView(),
                catalogController = this.getView().getViewData().catalogController,
                catalogModel = this.getView().getViewData().catalogModel,
                oTileContext = this.getView().getViewData().sourceContext,
                groupList = catalogModel.getProperty("/groups"),
                index = groupList.indexOf(oPopoverModel.getProperty(sItemModelPath).oGroup),
                oGroupContext = new Context(catalogModel, "/groups/" + index),
                launchPageService = sap.ushell.Container.getService("LaunchPage"),
                sGroupId = launchPageService.getGroupId(catalogModel.getProperty("/groups/" + index).object);

            // The tile is added to the group
            if (bToAdd) {
                var oAddPromise = catalogController._addTile(oTileContext, oGroupContext);

                oAddPromise.done(function (data) {
                    var catalogTilePath = oView.getViewData().sourceContext,
                        aCurrentTileGroups = catalogModel.getProperty(catalogTilePath + "/associatedGroups");

                    aCurrentTileGroups.push(sGroupId);
                    catalogModel.setProperty(catalogTilePath + "/associatedGroups", aCurrentTileGroups);
                });
            } else { // The tile is removed from the group
                var sTileCatalogId = oTileContext.getModel().getProperty(oTileContext.getPath()).id,
                    oRemovePromise = catalogController._removeTile(sTileCatalogId, index);

                oRemovePromise.done(function (data) {
                    var catalogTilePath = oView.getViewData().sourceContext,
                        aCurrentTileGroups = catalogModel.getProperty(catalogTilePath + "/associatedGroups"),
                        indexToRemove = aCurrentTileGroups ? Array.prototype.indexOf.call(aCurrentTileGroups, sGroupId) : -1;

                    if (indexToRemove >= 0) {
                        aCurrentTileGroups.splice(indexToRemove, 1);
                    }
                    catalogModel.setProperty(catalogTilePath + "/associatedGroups", aCurrentTileGroups);
                });
            }
        },

        _switchGroupsPopoverButtonPress: function () {
            var groupsPopoverId = "groupsPopover-popover";
            if (Device.system.phone) {
                // a different popover is used for phones
                groupsPopoverId = "groupsPopover-dialog";
            }
            if (sap.ui.getCore().byId(groupsPopoverId).getContent()[0].getId() === "newGroupNameInput") {
                var userGroupList = this.oPopoverModel.getProperty("/userGroupList"),
                    returnChanges = {
                        addToGroups: [],
                        removeFromGroups: [],
                        newGroups: [],
                        allGroups: userGroupList
                    };
                if (this.getView().newGroupInput.getValue().length) {
                    returnChanges.newGroups.push(this.getView().newGroupInput.getValue());
                }
                this.getView().oPopover.close();
                this.getView().deferred.resolve(returnChanges);
            } else {
                this._closeButtonHandler(this);
            }
        },

        _navigateToCreateNewGroupPane: function () {
            var oView = this.getView();
            if (!oView.headBarForNewGroup) {
                oView.headBarForNewGroup = oView._createHeadBarForNewGroup();
            }
            if (!oView.newGroupInput) {
                oView.newGroupInput = oView._createNewGroupInput();
            }
            oView.oPopover.removeAllContent();
            oView.oPopover.addContent(oView.newGroupInput);
            oView.oPopover.setCustomHeader(oView.headBarForNewGroup);
            oView.oPopover.setContentHeight("");
            setTimeout(function () {
                oView.oPopover.getBeginButton().setText(resources.i18n.getText("okDialogBtn"));
            }, 0);
            if (oView.oPopover.getEndButton()) {
                oView.oPopover.getEndButton().setVisible(true);
            }

            if (sap.ui.getCore().byId("groupsPopover-popover")
                && (sap.ui.getCore().byId("groupsPopover-popover").getContent()[0].getId() === "newGroupNameInput")
                && !oView.oPopover.getEndButton()) {
                oView.oPopover.setEndButton(oView._createCancelButton());
            }
            setTimeout(function () {
                oView.oPopover.getEndButton().setText(resources.i18n.getText("cancelBtn"));
            }, 0);
            if (oView.getViewData().singleGroupSelection) {
                this._setFooterVisibility(true);
            }
            setTimeout(function () {
                oView.newGroupInput.focus();
            }, 0);
        },

        setSelectedStart: function (start) {
            this.start = start;
        },

        _afterCloseHandler: function () {
            var oView = this.getView(),
                catalogModel = this.getView().getViewData().catalogModel;
            // catalog view is active. Not needed in user menu and SAP menu
            if (catalogModel) {
                var selectedEnd = catalogModel.getProperty(this.getView().getViewData().sourceContext + "/associatedGroups");
                this.showToastMessage(selectedEnd, this.start);
            }
            oView.oGroupsContainer.destroy();
            if (oView.headBarForNewGroup) {
                oView.headBarForNewGroup.destroy();
            }
            if (oView.newGroupInput) {
                oView.newGroupInput.destroy();
            }
            oView.oPopover.destroy();
            oView.destroy();
        },

        showToastMessage: function (end, start) {
            var added = 0,
                removed = 0,
                firstAddedGroupTitle,
                firstRemovedGroupTitle,
                endSelected = {};

            end.forEach(function (eGroup) {
                endSelected[eGroup] = eGroup; // performance improve
            });
            start.forEach(function (sGroup) {
                if (endSelected[sGroup.id]) {
                    if (sGroup.selected === false) {
                        added++;
                        firstAddedGroupTitle = sGroup.title;
                    }
                } else if (sGroup.selected === true) {
                    removed++;
                    firstRemovedGroupTitle = sGroup.title;
                }
            });

            var message = this.getView().getViewData().catalogController.prepareDetailedMessage(this.getView().getViewData().title, added, removed, firstAddedGroupTitle, firstRemovedGroupTitle);
            if (message) {
                MessageToast.show(message, {
                    duration: 6000, // default
                    width: "15em",
                    my: "center bottom",
                    at: "center bottom",
                    of: window,
                    offset: "0 -50",
                    collision: "fit fit"
                });
            }
        },

        _backButtonHandler: function () {
            var oView = this.getView();
            oView.oPopover.removeAllContent();
            if (oView.getViewData().singleGroupSelection) {
                this._setFooterVisibility(false);
            }

            if (!Device.system.phone) {
                oView.oPopover.setContentHeight(oView.iPopoverDataSectionHeight + "px");
            } else {
                oView.oPopover.setContentHeight("100%");
            }

            oView.oPopover.setVerticalScrolling(true);
            oView.oPopover.setHorizontalScrolling(false);
            oView.oPopover.addContent(oView.oGroupsContainer);
            oView.oPopover.setTitle(resources.i18n.getText("addTileToGroups_popoverTitle"));
            oView.oPopover.setCustomHeader();
            oView.newGroupInput.setValue("");
            if (sap.ui.getCore().byId("groupsPopover-popover") && (sap.ui.getCore().byId("groupsPopover-popover").getContent()[0].getId() != "newGroupNameInput")) {
                oView.oPopover.getEndButton().setVisible(false);
            }
            setTimeout(function () {
                oView.oPopover.getBeginButton().setText(resources.i18n.getText("close"));
            }, 0);
        },

        _setFooterVisibility: function (bVisible) {
            // as there is not public API to control the footer we get the control by its id and set its visibility
            var oFooter = sap.ui.getCore().byId("groupsPopover-footer");
            if (oFooter) {
                oFooter.setVisible(bVisible);
            }
        }
    });
});
},
	"sap/ushell/components/appfinder/GroupListPopover.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/m/ResponsivePopover",
    "sap/ushell/resources",
    "sap/m/ScrollContainer",
    "sap/ui/Device",
    "sap/m/StandardListItem",
    "sap/m/List",
    "sap/m/Input",
    "sap/ui/core/library",
    "sap/m/Button",
    "sap/ui/core/IconPool",
    "sap/m/Bar",
    "sap/m/Label",
    "sap/m/DisplayListItem",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Config,
    jQuery,
    Log,
    ResponsivePopover,
    resources,
    ScrollContainer,
    Device,
    StandardListItem,
    List,
    Input,
    coreLibrary,
    Button,
    IconPool,
    Bar,
    Label,
    DisplayListItem,
    mobileLibrary,
    Filter,
    FilterOperator
) {
    "use strict";

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    // shortcut for sap.m.ListType
    var ListType = mobileLibrary.ListType;

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    sap.ui.jsview("sap.ushell.components.appfinder.GroupListPopover", {
        createContent: function (/*oController*/) {
            this.oPopover = sap.ui.getCore().byId("groupsPopover");
            if (this.oPopover) {
                return;
            }

            this.iPopoverDataSectionHeight = 192;
            this.oGroupsContainer = this._createPopoverContainer(this.iPopoverDataSectionHeight);
            this.oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

            this.oPopover = new ResponsivePopover({
                id: "groupsPopover",
                placement: "Auto",
                title: resources.i18n.getText("addTileToGroups_popoverTitle"),
                contentWidth: "20rem",
                beginButton: this._createCloseButton(),
                content: this.oGroupsContainer,
                afterClose: this.getController()._afterCloseHandler.bind(this.getController())
            });

            this.oPopover.setInitialFocus("newGroupItem");
        },

        open: function (openByControl) {
            if (document.body.clientHeight - openByControl.getDomRef().getBoundingClientRect().bottom >= 310) {
                this.oPopover.setPlacement("Bottom");
            }
            this.oPopover.openBy(openByControl);
            if (this.getViewData().singleGroupSelection) {
                this.getController()._setFooterVisibility(false);
            }
            this.deferred = jQuery.Deferred();
            return this.deferred.promise();
        },

        _createPopoverContainer: function (iPopoverDataSectionHeight) {
            var popoverContainer = sap.ui.getCore().byId("popoverContainer");
            if (popoverContainer) {
                return popoverContainer;
            }

            var oNewGroupItemList = this._createNewGroupUiElements(),
                oGroupList = this._createPopoverGroupList();

            popoverContainer = new ScrollContainer({
                id: "popoverContainer",
                horizontal: false,
                vertical: true,
                content: [oNewGroupItemList, oGroupList]
            });

            if (!Device.system.phone) {
                popoverContainer.setHeight((iPopoverDataSectionHeight - 2) + "px");
            } else {
                popoverContainer.setHeight("100%");
            }

            return popoverContainer;
        },

        _createNewGroupUiElements: function () {
            var oNewGroupItemList = sap.ui.getCore().byId("newGroupItemList");
            if (oNewGroupItemList) {
                return oNewGroupItemList;
            }

            var oNewGroupItem = new StandardListItem({
                id: "newGroupItem",
                title: resources.i18n.getText("newGroup_listItemText"),
                type: "Navigation",
                press: this.getController()._navigateToCreateNewGroupPane.bind(this.getController())
            });
            oNewGroupItemList = new List("newGroupItemList", {});
            // if xRay is enabled
            if (Config.last("/core/extension/enableHelp")) {
                oNewGroupItem.addStyleClass("help-id-newGroupItem");// xRay help ID
            }
            oNewGroupItemList.addItem(oNewGroupItem);

            oNewGroupItemList.addEventDelegate({
                onsapdown: function (oEvent) {
                    try {
                        oEvent.preventDefault();
                        oEvent._bIsStopHandlers = true;
                        var jqFirstGroupListItem = jQuery("#popoverContainer .sapMListModeMultiSelect li, #popoverContainer .sapMListModeSingleSelectMaster li").eq(0);
                        jqFirstGroupListItem.focus();
                    } catch (e) {
                        // continue regardless of error
                    }
                },
                onsaptabnext: function (oEvent) {
                    try {
                        oEvent.preventDefault();
                        oEvent._bIsStopHandlers = true;
                        var jqCloseButton = jQuery("#closeButton");
                        jqCloseButton.focus();
                    } catch (e) {
                        // continue regardless of error
                    }
                }
            });

            return oNewGroupItemList;
        },

        _createNewGroupInput: function () {
            var oNewGroupNameInput = sap.ui.getCore().byId("newGroupNameInput");
            if (oNewGroupNameInput) {
                return oNewGroupNameInput;
            }

            oNewGroupNameInput = new Input({
                id: "newGroupNameInput",
                type: "Text",
                placeholder: resources.i18n.getText("new_group_name")
            });
            oNewGroupNameInput.setValueState(ValueState.None);
            oNewGroupNameInput.setPlaceholder(resources.i18n.getText("new_group_name"));
            oNewGroupNameInput.enabled = true;
            oNewGroupNameInput.addStyleClass("sapUshellCatalogNewGroupInput");
            return oNewGroupNameInput;
        },

        _createHeadBarForNewGroup: function () {
            var oHeadBar = sap.ui.getCore().byId("oHeadBar");
            if (oHeadBar) {
                return oHeadBar;
            }

            var oBackButton = new Button({
                icon: IconPool.getIconURI("nav-back"),
                press: this.getController()._backButtonHandler.bind(this.getController()),
                tooltip: resources.i18n.getText("newGroupGoBackBtn_tooltip")
            });
            oBackButton.addStyleClass("sapUshellCatalogNewGroupBackButton");

            // new group panel's header
            oHeadBar = new Bar("oHeadBar", {
                contentLeft: [oBackButton],
                contentMiddle: [
                    new Label({
                        text: resources.i18n.getText("newGroup_popoverTitle")
                    })
                ]
            });
            return oHeadBar;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.GroupListPopover";
        },

        _createPopoverGroupList: function () {
            var oListItemTemplate = new DisplayListItem({
                label: "{oGroup/title}",
                selected: "{selected}",
                tooltip: "{oGroup/title}",
                type: ListType.Active,
                press: this.getController().groupListItemClickHandler.bind(this.getController())
            });
            var aUserGroupsFilters = [];
            aUserGroupsFilters.push(new Filter("oGroup/isGroupLocked", FilterOperator.EQ, false));
            if (this.getViewData().enableHideGroups) {
                aUserGroupsFilters.push(new Filter("oGroup/isGroupVisible", FilterOperator.EQ, true));
            }
            var bSingleSelection = this.getViewData().singleGroupSelection,
                oList = new List({
                    mode: bSingleSelection ? ListMode.SingleSelectMaster : ListMode.MultiSelect,
                    items: {
                        path: "/userGroupList",
                        template: oListItemTemplate,
                        filters: aUserGroupsFilters
                    }
                });

            if (bSingleSelection) {
                oList.attachSelect(this.getController().okButtonHandler.bind(this.getController()));
            } else {
                // While clicking on the checkbox - Check if a group was added or removed
                oList.attachSelectionChange(this.getController().checkboxClickHandler.bind(this.getController()));
            }

            oList.addEventDelegate({
                //used for accessibility, so "new group" element will be a part of it
                onsapup: function (oEvent) {
                    try {
                        oEvent.preventDefault();

                        var jqNewGroupItem,
                            currentFocusGroup = jQuery(":focus");
                        if (currentFocusGroup.index() === 0) { //first group in the list
                            jqNewGroupItem = jQuery("#newGroupItem");
                            jqNewGroupItem.focus();
                            oEvent._bIsStopHandlers = true;
                        }
                    } catch (e) {
                        // continue regardless of error
                        Log.error("Groups popup Accessibility `up` key failed");
                    }
                }
            });
            return oList;
        },

        _createOkButton: function () {
            var oOkBtn = new Button({
                id: "okButton",
                press: this.getController().okButtonHandler.bind(this.getController()),
                text: resources.i18n.getText("okBtn")
            });

            oOkBtn.addEventDelegate({
                onsaptabprevious: function (oEvent) {
                    try {
                        oEvent.preventDefault();
                        oEvent._bIsStopHandlers = true;
                        var jqNewGroupItem = jQuery("#newGroupItem");
                        if (!jqNewGroupItem.length) {
                            jqNewGroupItem = jQuery("#newGroupNameInput input");
                        }
                        jqNewGroupItem.focus();
                    } catch (e) {
                        // continue regardless of error
                        Log.error("Groups popup Accessibility `shift-tab` key failed");
                    }
                }
            });
            return oOkBtn;
        },

        _createCancelButton: function () {
            return new Button({
                id: "cancelButton",
                press: this.getController()._closeButtonHandler.bind(this.getController()),
                text: resources.i18n.getText("cancelBtn")
            });
        },

        _createCloseButton: function () {
            return sap.ui.getCore().byId("closeButton") || new Button({
                id: "closeButton",
                press: this.getController()._switchGroupsPopoverButtonPress.bind(this.getController()),
                text: resources.i18n.getText(resources.i18n.getText("close"))
            });
        }
    });
});
},
	"sap/ushell/components/appfinder/HierarchyApps.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/library",
    "sap/m/MessageToast",
    "sap/ushell/resources"
], function (jQuery, coreLibrary, MessageToast, resources) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    /* global hasher */

    sap.ui.controller("sap.ushell.components.appfinder.HierarchyApps", {
        onInit: function () {
            var easyAccessSystemsModel = this.getView().getViewData().easyAccessSystemsModel;
            if (easyAccessSystemsModel) {
                this.getView().setModel(easyAccessSystemsModel, "easyAccessSystems");
            }
        },

        getCrumbsData: function (path, mainModel) {
            var pathChunks = path.split("/");
            pathChunks.splice(pathChunks.length - 2, 2);
            var newCrumbs = [];
            while (pathChunks.length) {
                var sPath = pathChunks.join("/");
                var text = mainModel.getProperty(sPath + "/text");
                newCrumbs.unshift({ text: text, path: sPath });
                pathChunks.splice(pathChunks.length - 2, 2);
            }
            return newCrumbs;
        },

        _updateAppBoxedWithPinStatuses: function (path) {
            var oView = this.getView();
            if (!path) {
                path = oView.layout.getBinding("items").getPath();
            }
            var easyAccessModel = oView.getModel("easyAccess");
            var appsData = easyAccessModel.getProperty(path) ? easyAccessModel.getProperty(path) : [];
            var bookmarkService = sap.ushell.Container.getService("Bookmark");
            var countPromiseList = appsData.map(function (appData) {
                return bookmarkService.countBookmarks(appData.url).then(function (count) {
                    appData.bookmarkCount = count;
                    return appData;
                });
            });
            jQuery.when.apply(jQuery, countPromiseList).then(function () {
                var appsData = Array.prototype.slice.call(arguments);
                easyAccessModel.setProperty(path, appsData);
            });
        },

        updatePageBindings: function (path) {
            this.getView().layout.bindAggregation("items", "easyAccess>" + path + "/apps", this.getView().oItemTemplate);
            this._updateAppBoxedWithPinStatuses(path + "/apps");
            this.getView().breadcrumbs.bindProperty("currentLocationText", "easyAccess>" + path + "/text");
            var crumbsData = this.getCrumbsData(path, this.getView().getModel("easyAccess"));
            this.getView().crumbsModel.setProperty("/crumbs", crumbsData);

            // when navigation in hierarchy folders had occureed and model had been updated
            // in case no results found we hide the app-boxes layout and display a message page with relevant message
            var aNewItems = this.getView().getModel("easyAccess").getProperty(path + "/apps");

            // call to update message with length of the items, and false indicating this is not searcg results
            this.getView().updateResultSetMessage(aNewItems.length, false);
        },

        onAppBoxPressed: function (oEvent) {
            if (oEvent.mParameters.srcControl.$().closest(".sapUshellPinButton").length) {
                return;
            }
            var sUrl = oEvent.getSource().getProperty("url");
            if (sUrl && sUrl.indexOf("#") === 0) {
                hasher.setHash(sUrl);
            }
        },

        _handleSuccessMessage: function (app, popoverResponse) {
            var message;
            var numberOfExistingGroups = popoverResponse.addToGroups ? popoverResponse.addToGroups.length : 0;
            var numberOfNewGroups = popoverResponse.newGroups ? popoverResponse.newGroups.length : 0;
            var totalNumberOfGroups = numberOfExistingGroups + numberOfNewGroups;

            if (totalNumberOfGroups === 1) {
                // determine the group's title
                var groupName;
                if (numberOfExistingGroups === 1) {
                    // for an existing group we have an object in the array items
                    groupName = popoverResponse.addToGroups[0].title;
                } else {
                    // for a new group, we have the title in the array items
                    groupName = popoverResponse.newGroups[0];
                }
                message = resources.i18n.getText("appAddedToSingleGroup", [app.text, groupName]);
            } else {
                message = resources.i18n.getText("appAddedToSeveralGroups", [app.text, totalNumberOfGroups]);
            }

            if (totalNumberOfGroups > 0) {
                MessageToast.show(message, {
                    duration: 3000, // default
                    width: "15em",
                    my: "center bottom",
                    at: "center bottom",
                    of: window,
                    offset: "0 -50",
                    collision: "fit fit"
                });
            }
            return message;
        },

        _prepareErrorMessage: function (aErroneousActions, sAppTitle) {
            var group,
                sAction,
                sFirstErroneousAddGroup,
                iNumberOfFailAddActions = 0,
                bCreateNewGroupFailed = false,
                message;

            for (var index in aErroneousActions) {
                // Get the data of the error (i.e. action name and group object).
                // the group's value:
                //   in case the group is an existing group we will have an object
                //   in case the group is a new group we will have a title instead of an object
                group = aErroneousActions[index].group;
                sAction = aErroneousActions[index].action;

                if (sAction === "addBookmark_ToExistingGroup") {
                    // add bookmark to EXISTING group failed
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions === 1) {
                        sFirstErroneousAddGroup = group.title;
                    }
                } else if (sAction === "addBookmark_ToNewGroup") {
                    // add bookmark to a NEW group failed
                    iNumberOfFailAddActions++;
                    if (iNumberOfFailAddActions === 1) {

                        //in case of a new group we have the title and not an object
                        sFirstErroneousAddGroup = group;
                    }
                } else {
                    // sAction is "addBookmark_NewGroupCreation"
                    // e.g. new group creation failed
                    bCreateNewGroupFailed = true;
                }
            }

            // First - Handle bCreateNewGroupFailed
            if (bCreateNewGroupFailed) {
                if (aErroneousActions.length === 1) {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_create_new_group" });
                } else {
                    message = resources.i18n.getText({ messageId: "fail_tile_operation_some_actions" });
                }
                // Single error - it can be either one add action or one remove action
            } else if (aErroneousActions.length === 1) {
                message = resources.i18n.getText({ messageId: "fail_app_operation_add_to_group", parameters: [sAppTitle, sFirstErroneousAddGroup] });
            } else {
                message = resources.i18n.getText({ messageId: "fail_app_operation_add_to_several_groups", parameters: [sAppTitle] });
            }
            return message;
        },

        _handleBookmarkAppPopoverResponse: function (app, popoverResponse) {
            var addBookmarksPromiseList = [];

            popoverResponse.newGroups.forEach(function (group) {
                addBookmarksPromiseList.push(this._createGroupAndAddBookmark(group, app));
            }.bind(this));

            popoverResponse.addToGroups.forEach(function (group) {
                addBookmarksPromiseList.push(this._addBookmark(group, app));
            }.bind(this));

            jQuery.when.apply(jQuery, addBookmarksPromiseList).then(function () {
                var resultList = Array.prototype.slice.call(arguments);
                this._handlePopoverGroupsActionPromises(app, popoverResponse, resultList);
            }.bind(this));
        },

        _handlePopoverGroupsActionPromises: function (app, popoverResponse, resultList) {
            var errorList = resultList.filter(function (result, index, resultList) {
                return !result.status;
            });
            if (errorList.length) {
                var oErrorMessageObj = this._prepareErrorMessage(errorList, app.text);
                var catalogsMgr = sap.ushell.components.getCatalogsManager();
                catalogsMgr.notifyOnActionFailure(oErrorMessageObj.messageId, oErrorMessageObj.parameters);
                return;
            }

            this._updateAppBoxedWithPinStatuses();

            this._handleSuccessMessage(app, popoverResponse);
        },

        _createGroupAndAddBookmark: function (newGroup, app) {
            var catalogsdMgr = sap.ushell.components.getCatalogsManager();
            var deferred = jQuery.Deferred(), oResponseData = {};

            var newGroupPromise = catalogsdMgr.createGroup(newGroup);
            newGroupPromise.done(function (newGroupContext) {

                var addBookmarkPromise = this._addBookmark(newGroupContext.getObject(), app, true);
                addBookmarkPromise.done(function (data) {
                    deferred.resolve(data);
                }).fail(function () {
                    oResponseData = { group: newGroup, status: 0, action: "addBookmark_ToNewGroup" }; // 0 - failure
                    deferred.resolve(oResponseData);
                });

            }.bind(this)).fail(function () {
                oResponseData = { group: newGroup, status: 0, action: "addBookmark_NewGroupCreation" }; // 0 - failure
                deferred.resolve(oResponseData);
            });

            return deferred.promise();
        },

        _addBookmark: function (group, app, isNewGroup) {
            var bookmarkService = sap.ushell.Container.getService("Bookmark");
            var deferred = jQuery.Deferred(), oResponseData = {};
            var addBookmarkPromise = bookmarkService.addBookmark({
                url: app.url,
                title: app.text,
                subtitle: app.subtitle,
                icon: app.icon
            }, group.object);

            var action = isNewGroup ? "addBookmark_ToNewGroup" : "addBookmark_ToExistingGroup";

            addBookmarkPromise.done(function () {
                oResponseData = { group: group, status: 1, action: action }; // 1 - success
                deferred.resolve(oResponseData);
            }).fail(function () {
                oResponseData = { group: group, status: 0, action: action }; // 0 - failure
                deferred.resolve(oResponseData);
            });

            return deferred.promise();
        },

        showSaveAppPopover: function (event) {
            var oModel = this.getView().getModel();
            var app = event.oSource.getParent().getBinding("title").getContext().getObject();

            // if we in context of some dashboard group, no need to open popup
            if (oModel.getProperty("/groupContext").path) {
                var groupPath = oModel.getProperty("/groupContext").path;
                var oGroup = oModel.getProperty(groupPath);
                var customResponse = {
                    newGroups: [],
                    addToGroups: [oGroup]
                };
                this._handleBookmarkAppPopoverResponse(app, customResponse);
                return;
            }

            var groupData = oModel.getProperty("/groups").map(function (group) {
                return {
                    selected: false,
                    initiallySelected: false,
                    oGroup: group
                };
            });

            var popoverView = new sap.ui.view({
                type: ViewType.JS,
                viewName: "sap.ushell.components.appfinder.GroupListPopover",
                viewData: {
                    groupData: groupData,
                    enableHideGroups: oModel.getProperty("/enableHideGroups"),
                    enableHelp: oModel.getProperty("/enableHelp"),
                    singleGroupSelection: true
                }
            });

            var popoverPromise = popoverView.open(event.oSource);
            popoverPromise.then(this._handleBookmarkAppPopoverResponse.bind(this, app));
        },

        resultTextFormatter: function (oSystemSelected, iTotal) {
            var oResourceBundle = resources.i18n;
            if (oSystemSelected) {
                var sSystem = oSystemSelected.systemName ? oSystemSelected.systemName : oSystemSelected.systemId;
                var sResultText = "";
                if (iTotal) {
                    sResultText = oResourceBundle.getText("search_easy_access_results", [iTotal, sSystem]);
                }

                return sResultText;
            }
            return "";
        },

        showMoreResultsVisibilityFormatter: function (apps, total) {
            if (apps && apps.length < total) {
                return true;
            }
            return false;
        },

        showMoreResultsTextFormatter: function (apps, total) {
            if (!apps || !total) {
                return "";
            }
            var currentlyNumOfApps = apps.length;
            return resources.i18n.getText("EasyAccessSearchResults_ShowMoreResults", [currentlyNumOfApps, total]);
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/appfinder/HierarchyApps.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/ui/appfinder/AppBox",
    "sap/ushell/ui/appfinder/PinButton",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/m/FlexBox",
    "sap/m/library",
    "sap/m/MessagePage",
    "sap/ui/model/json/JSONModel",
    "sap/m/Link",
    "sap/m/Breadcrumbs",
    "sap/m/Text",
    "sap/m/Button"
], function (
    AppBox,
    PinButton,
    resources,
    AccessibilityCustomData,
    FlexBox,
    mobileLibrary,
    MessagePage,
    JSONModel,
    Link,
    Breadcrumbs,
    Text,
    Button
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.FlexWrap
    var FlexWrap = mobileLibrary.FlexWrap;

    sap.ui.jsview("sap.ushell.components.appfinder.HierarchyApps", {
        createContent: function (oController) {
            this.oController = oController;

            function getTooltip (aGroupsIDs, bookmarkCount, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                var oResourceBundle = resources.i18n,
                    sTooltip;

                if (sGroupContextModelPath) {
                    var iCatalogTileInGroup = aGroupsIDs ? Array.prototype.indexOf.call(aGroupsIDs, sGroupContextId) : -1;

                    var sTooltipKey = iCatalogTileInGroup !== -1
                        ? "removeAssociatedTileFromContextGroup"
                        : "addAssociatedTileToContextGroup";

                    sTooltip = oResourceBundle.getText(sTooltipKey, sGroupContextTitle);
                } else {
                    sTooltip = bookmarkCount
                        ? oResourceBundle.getText("EasyAccessMenu_PinButton_Toggled_Tooltip")
                        : oResourceBundle.getText("EasyAccessMenu_PinButton_UnToggled_Tooltip");
                }
                return sTooltip;
            }

            var oPinButton = new PinButton({
                icon: "sap-icon://pushpin-off",
                selected: {
                    path: "easyAccess>bookmarkCount",
                    formatter: function (bookmarkCount) {
                        return (!!bookmarkCount);
                    }
                },
                tooltip: {
                    parts: ["associatedGroups", "easyAccess>bookmarkCount", "/groupContext/path", "/groupContext/id", "/groupContext/title"],
                    formatter: function (aGroupsIDs, bookmarkCount, sGroupContextModelPath, sGroupContextId, sGroupContextTitle) {
                        return getTooltip(aGroupsIDs, bookmarkCount, sGroupContextModelPath, sGroupContextId, sGroupContextTitle);
                    }
                },
                press: oController.showSaveAppPopover.bind(oController)
            });
            oPinButton.addCustomData(new AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));
            oPinButton.addStyleClass("sapUshellPinButton");

            this.oItemTemplate = new AppBox({
                title: "{easyAccess>text}",
                subtitle: "{easyAccess>subtitle}",
                url: "{easyAccess>url}",
                icon: "{easyAccess>icon}",
                pinButton: oPinButton,
                tabindex: {
                    path: "easyAccess>text"
                },
                press: [oController.onAppBoxPressed, oController]
            });
            this.oItemTemplate.addCustomData(new AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));


            this.layout = new FlexBox(this.getId() + "_hierarchyAppsLayout", {
                items: {
                    path: "easyAccess>/apps",
                    template: this.oItemTemplate
                },
                wrap: FlexWrap.Wrap
            });

            this.layout.addDelegate({
                onAfterRendering: function () {
                    var items = this.getItems();
                    var updateTabindex = function (customData) {
                        if (customData.getKey() === "tabindex") {
                            customData.setValue("0");
                        }
                    };
                    if (items.length) {
                        items[0].getCustomData().forEach(updateTabindex);
                        items[0].getPinButton().getCustomData().forEach(updateTabindex);
                    }
                }.bind(this.layout)
            });

            // create message-page as invisible by default
            this.oMessagePage = new MessagePage({
                visible: false,
                showHeader: false,
                text: resources.i18n.getText("EasyAccessMenu_NoAppsToDisplayMessagePage_Text"),
                description: ""
            });

            var aContent = [];

            // if it is not a search result view - e.g. this is a regular hierarchy Apps content view
            if (this.getViewData() && this.getViewData().navigateHierarchy) {
                this.crumbsModel = new JSONModel({ crumbs: [] });

                this.linkTemplate = new Link({
                    text: "{crumbs>text}",
                    press: function (e) {
                        var crumbData = e.oSource.getBinding("text").getContext().getObject();
                        this.getViewData().navigateHierarchy(crumbData.path, false);

                    }.bind(this)
                });

                this.breadcrumbs = new Breadcrumbs({
                    links: {
                        path: "crumbs>/crumbs",
                        template: this.linkTemplate
                    },
                    currentLocationText: "{/text}"
                });

                this.breadcrumbs.setModel(this.crumbsModel, "crumbs");
                aContent.push(this.breadcrumbs);
            } else {
                // else we are in search results content view
                this.resultText = new Text({
                    text: {
                        parts: [
                            { path: "easyAccessSystemsModel>/systemSelected" },
                            { path: "easyAccess>/total" }
                        ],
                        formatter: oController.resultTextFormatter.bind(oController)
                    }
                }).addStyleClass("sapUshellEasyAccessSearchResultText");

                this.resultText.addCustomData(new AccessibilityCustomData({
                    key: "role",
                    value: "heading",
                    writeToDom: true
                }));
                this.resultText.addCustomData(new AccessibilityCustomData({
                    key: "aria-level",
                    value: "3",
                    writeToDom: true
                }));

                aContent.push(this.resultText);

                this.showMoreResultsLink = new Button({
                    text: {
                        parts: [
                            { path: "easyAccess>/apps" },
                            { path: "easyAccess>/total" }
                        ],
                        formatter: oController.showMoreResultsTextFormatter.bind(oController)
                    },
                    press: this.getViewData().getMoreSearchResults,
                    visible: {
                        parts: [
                            { path: "easyAccess>/apps" },
                            { path: "easyAccess>/total" }
                        ],
                        formatter: oController.showMoreResultsVisibilityFormatter.bind(oController)
                    },
                    type: ButtonType.Transparent
                });
            }

            // adding the message-page
            aContent.push(this.oMessagePage);
            aContent.push(this.layout);
            if (this.showMoreResultsLink) {
                aContent.push(this.showMoreResultsLink);
            }
            return aContent;
        },

        /*
         * updates the text-field OR the messagePage according to
         *   - if items exist we update the text-field, otherwise show message page
         *   - if bIsSearchResults we use different text then if is not (e.g. standard empty folder navigation)
         */
        updateResultSetMessage: function (bItemsExist, bIsSearchResults) {

            var sEmptyContentMessageKey;
            if (bIsSearchResults) {
                sEmptyContentMessageKey = "noFilteredItems";
            } else {
                sEmptyContentMessageKey = "EasyAccessMenu_NoAppsToDisplayMessagePage_Text";
            }

            // if there are items in the results
            if (bItemsExist) {

                // if this is search results --> update the result-text which we display at the top of page when there are results
                if (bIsSearchResults) {
                    this.resultText.updateProperty("text");
                    this.resultText.setVisible(true);
                }

                // set layout visible, hide the message page
                this.layout.setVisible(true);
                this.oMessagePage.setVisible(false);
            } else {
                // in case this is search results --> hide the result-text which we display at the top of page as there are no results.
                // we will display the message page instaed
                if (bIsSearchResults) {
                    this.resultText.setVisible(false);
                }

                this.layout.setVisible(false);
                this.oMessagePage.setVisible(true);

                var sEmptyContentMessageText = resources.i18n.getText(sEmptyContentMessageKey);
                this.oMessagePage.setText(sEmptyContentMessageText);
            }
        },

        setShowMoreResultsBusy: function (bBusy) {
            if (this.showMoreResultsLink) {
                this.showMoreResultsLink.setBusy(bBusy);
            }
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.HierarchyApps";
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/appfinder/HierarchyFolders.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/m/StandardListItem",
    "sap/m/SelectDialog",
    "sap/ui/core/Component"
], function (
    Log,
    jQuery,
    FilterOperator,
    Filter,
    StandardListItem,
    SelectDialog,
    Component
) {
    "use strict";

    sap.ui.controller("sap.ushell.components.appfinder.HierarchyFolders", {
        onInit: function () {
            this.oDialog = null;
            this.getView().setModel(this.getView().getViewData().easyAccessSystemsModel, "easyAccessSystems");
            this.getView().setModel(this.getView().getViewData().subHeaderModel, "subHeaderModel");
            this.getSelectedSystem().then(function (oSystem) {
                if (oSystem) {
                    this.setSystemSelected(oSystem);
                } else {
                    this.setSystemSelected(undefined);
                    // if no system selected -> 'select system' dialog will automatically appear
                    this.onSystemSelectionPress();
                }
            }.bind(this), function () {
                this.setSystemSelected(undefined);
                this.onSystemSelectionPress();
            });
        },

        onExit: function () {
            if (this.oDialog) {
                this.destroyDialog();
            }
        },

        onAfterRendering: function () {
            /*
             * making sure that on every click anywhere on the left panel which is basically
             * the hierarchy-folders view (this view), we invoke exit search mode (if necessary)
             */
            var jqThis = jQuery("#" + this.getView().getId());
            jqThis.on("click", function (/*event*/) {
                this.exitSearchMode();
            }.bind(this));
        },

        getPersonalizer: function () {
            if (this.oPersonalizer) {
                return this.oPersonalizer;
            }
            var oPersonalizationService = sap.ushell.Container.getService("Personalization"),
                oComponent = Component.getOwnerComponentFor(this),
                oScope = {
                    keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                    clientStorageAllowed: true
                },
                oPersId = {
                    container: "appfinder.HierarchyFolders",
                    item: "lastSelectedSystem"
                };

            this.oPersonalizer = oPersonalizationService.getPersonalizer(oPersId, oScope, oComponent);
            return this.oPersonalizer;
        },

        /**
         * get the selected system
         * if only one system available - it be automatically selected
         * if user has defined a system, and it in the list of available systems it will be selected
         * Note: this function does not set anything in the persistence layer.
         * @See {this.setSystemSelected}
         * @return {Promise} with the selected system object
         */
        getSelectedSystem: function () {
            var oDeferred = new jQuery.Deferred(),
                aSystemsList = this.getView().getModel("easyAccessSystems").getProperty("/systemsList");

            //if there is only one system -> this system is selected
            if (aSystemsList && aSystemsList.length && aSystemsList.length === 1) {
                var oEasyAccessSystemSelected = aSystemsList[0];
                this.setSystemSelectedInPersonalization(oEasyAccessSystemSelected);
                oDeferred.resolve(oEasyAccessSystemSelected);
            } else {
                this.getSelectedSystemInPersonalization().then(function (persSystemSelected) {
                    if (persSystemSelected) {
                        //if there is a system in the personalization-> need to check if the system exists in the system list
                        var bSystemInList = false;
                        for (var i = 0; i < aSystemsList.length; i++) {
                            if ((aSystemsList[i].systemName && aSystemsList[i].systemName === persSystemSelected.systemName) ||
                                (aSystemsList[i].systemId === persSystemSelected.systemId)) {
                                bSystemInList = true;
                                oDeferred.resolve(persSystemSelected);
                            }
                        }
                        // if personalized system not part of the system list
                        if (!bSystemInList) {
                            oDeferred.resolve();
                            // remove this system from the personalization
                            this.setSystemSelectedInPersonalization();
                        }
                    } else {
                        oDeferred.resolve();
                    }
                }.bind(this));
            }
            return oDeferred.promise();
        },

        setSystemSelected: function (oSystem) {
            this.getView().getModel("easyAccessSystems").setProperty("/systemSelected", oSystem);
            this.setSystemSelectedInPersonalization(oSystem);
        },

        getSelectedSystemInPersonalization: function () {
            var oDeferred = new jQuery.Deferred();

            this.getPersonalizer().getPersData().then(function (persSystemSelected) {
                if (persSystemSelected) {
                    oDeferred.resolve(persSystemSelected);
                } else {
                    oDeferred.resolve();
                }
            }, function (error) {
                Log.error(
                    "Failed to get selected system from the personalization",
                    error,
                    "sap.ushell.components.appfinder.HierarchyFolders"
                );
                oDeferred.reject();
            });

            return oDeferred.promise();
        },

        setSystemSelectedInPersonalization: function (oSystem) {
            this.getPersonalizer().setPersData(oSystem).fail(function (error) {
                Log.error(
                    "Failed to save selected system in the personalization",
                    error,
                    "sap.ushell.components.appfinder.HierarchyFolders"
                );
            });
        },

        onSystemSelectionPress: function () {
            var systemsList = this.getView().getModel("easyAccessSystems").getProperty("/systemsList");
            if (systemsList && systemsList.length && systemsList.length <= 1) {
                return;
            }

            var oDialog = this.createDialog();
            oDialog.open();
        },

        createDialog: function () {
            var that = this;

            if (!this.oDialog) {
                this.oDialog = new SelectDialog({
                    id: "systemSelectionDialog",
                    title: that.getView().translationBundle.getText("easyAccessSelectSystemDialogTitle"),
                    multiSelect: false,
                    contentHeight: "20rem",
                    items: {
                        path: "/systemsList",
                        template: new StandardListItem({
                            adaptTitleSize: false,
                            title: {
                                parts: ["systemName", "systemId"],
                                formatter: that.titleFormatter
                            },
                            description: {
                                parts: ["systemName", "systemId"],
                                formatter: that.descriptionFormatter
                            },
                            selected: {
                                parts: ["systemName", "systemId"],
                                formatter: that.selectedFormatter.bind(this)
                            }
                        })
                    },
                    confirm: that.systemConfirmHandler.bind(that),
                    search: that.systemSearchHandler.bind(that),
                    cancel: that.destroyDialog.bind(that)
                });
                this.oDialog.setModel(this.getView().getModel("easyAccessSystems"));
            }

            return this.oDialog;
        },

        destroyDialog: function () {
            this.oDialog.destroyItems();
            this.oDialog.destroy();
            this.oDialog = null;
        },

        systemConfirmHandler: function (oEvent) {
            var oItem = oEvent.getParameters().selectedItem,
                oSystem = oItem.getBindingContext().getObject();
            this.setSystemSelected(oSystem);
            this.destroyDialog();
        },

        //implement the search functionality in the system selector dialog
        systemSearchHandler: function (oEvent) {
            var sValue = oEvent.getParameter("value"),
                oFilterName = new sap.ui.model.Filter("systemName", FilterOperator.Contains, sValue), // TODO: pending dependency migration
                oFilterId = new sap.ui.model.Filter("systemId", FilterOperator.Contains, sValue), // TODO: pending dependency migration
                oSystemSelectorDialogFilter = new Filter({
                    filters: [oFilterId, oFilterName],
                    and: false
                }),
                oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(oSystemSelectorDialogFilter);
        },

        titleFormatter: function (systemName, systemId) {
            return systemName || systemId;
        },

        descriptionFormatter: function (systemName, systemId) {
            if (systemName) {
                return systemId;
            }
            return null;
        },

        selectedFormatter: function (systemName, systemId) {
            var userSystemSelected = this.getView().getModel("easyAccessSystems").getProperty("/systemSelected");
            if (!userSystemSelected) {
                return false;
            }
            if (systemName) {
                return (userSystemSelected.systemName === systemName && userSystemSelected.systemId === systemId);
            }
            return (userSystemSelected.systemId === systemId);
        },

        systemSelectorTextFormatter: function (systemSelected) {
            if (systemSelected) {
                if (systemSelected.systemName) {
                    return systemSelected.systemName;
                }
                return systemSelected.systemId;

            }
            return this.getView().translationBundle.getText("easyAccessSelectSystemTextWithoutSystem");
        },

        exitSearchMode: function () {
            var oSubHeaderModel = this.getView().getModel("subHeaderModel");
            oSubHeaderModel.setProperty("/search/searchMode", false);
            oSubHeaderModel.refresh(true);
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/appfinder/HierarchyFolders.view.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Bar",
    "sap/m/Page",
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/ushell/resources"
], function (
    Button,
    Label,
    Bar,
    Page,
    mobileLibrary,
    List,
    StandardListItem,
    Text,
    resources
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.ListSeparators
    var ListSeparators = mobileLibrary.ListSeparators;

    sap.ui.jsview("sap.ushell.components.appfinder.HierarchyFolders", {
        createContent: function (oController) {
            var that = this;
            this.translationBundle = resources.i18n;

            this.treePath = "";

            // Used to find the element to be focused on when moving between pages.
            this.lastFocusID = document.URL.substring(document.URL.lastIndexOf("&/") + 2) + "-button";

            this.systemSelectorText = new Text({
                text: {
                    path: "easyAccessSystemsModel>/systemSelected",
                    formatter: oController.systemSelectorTextFormatter.bind(oController)
                }
            });

            this.oItemTemplate = new StandardListItem({
                title: "{easyAccess>text}",
                type: "Navigation",
                press: function () {
                    var backButton = that.pageMenu.$().find(".sapMBarLeft button");
                    // If the back button is not displayed change the lastFocus element.
                    if (!backButton.length) {
                        that.lastFocusID = document.activeElement.getAttribute("id");
                    }
                    var path = this.getBindingContextPath();
                    that.getViewData().navigateHierarchy(path, true);
                }
            });

            this.oList = new List({
                showSeparators: ListSeparators.None,
                items: {
                    path: "easyAccess>" + this.treePath + "/folders",
                    template: this.oItemTemplate
                },
                updateFinished: function () {
                    var aListItems = this.getItems();

                    that.finishEasyAccessAnimation(true);
                    aListItems.forEach(function (oListItem) {
                        //UI5 Doesn't support 'space' and 'enter' press behavior alignment while it is required by UX defentions.
                        oListItem.onsapspace = oListItem.onsapenter;
                    });
                },
                noDataText: {
                    path: "easyAccessSystemsModel>/systemSelected",
                    formatter: function (oSystemSelected) {
                        if (oSystemSelected) {
                            return that.translationBundle.getText("easyAccessFolderWithNoItems");
                        }
                    }
                }
            });

            this.pageMenu = new Page({
                showNavButton: false,
                enableScrolling: true,
                headerContent: new Bar({
                    contentLeft: [
                        new Label({
                            text: {
                                parts: ["easyAccessSystemsModel>/systemSelected"],
                                formatter: oController.systemSelectorTextFormatter.bind(oController)
                            }
                        })
                    ],
                    contentRight: [new Button({
                        text: this.translationBundle.getText("easyAccessSelectSystemDialogTitle"),
                        type: ButtonType.Transparent,
                        visible: {
                            path: "easyAccessSystemsModel>/systemsList",
                            formatter: function (systemsList) {
                                return systemsList.length > 1;
                            }
                        },
                        press: [oController.onSystemSelectionPress, oController]
                    })]
                }).addStyleClass("sapUshellEasyAccessMasterPageHeader"),
                content: this.oList
            });

            this.pageMenu.attachNavButtonPress(function () {
                var pathChunks = this.treePath.split("/");
                var newPathChunks = pathChunks.slice(0, pathChunks.length - 2);
                this.getViewData().navigateHierarchy(newPathChunks.join("/"), false);
            }.bind(this));

            return this.pageMenu;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.HierarchyFolders";
        },

        finishEasyAccessAnimation: function () {
            if (!this.jqFolderClone) {
                return;
            }

            if (this.forwardAnimation) {
                this.pageMenu.$().addClass("forwardToViewAnimation");
                this.jqFolderClone.addClass("forwardOutOfViewAnimation");
            } else {
                this.pageMenu.$().addClass("backToViewAnimation");
                this.jqFolderClone.addClass("backOutOfViewAnimation");
            }
            this.jqFolderClone.on("animationend", function () {
                this.pageMenu.$().removeClass("forwardToViewAnimation backToViewAnimation");
                var backButton = this.pageMenu.$().find(".sapMBarLeft button");
                // If back button is displayed set the focus on it.
                if (backButton.length) {
                    backButton.focus();
                } else {
                    // If the back button is not displayed set focus on lastFocus element.
                    // timeout needed because firefox hides menu without it
                    setTimeout(function () {
                        document.querySelector("#" + this.lastFocusID).focus();
                    }.bind(this));
                }
                if (this.jqFolderClone) {
                    this.jqFolderClone.remove();
                }
            }.bind(this));
        },

        prepareEasyAccessAnimation: function (forward) {
            this.forwardAnimation = forward;
            this.jqFolderClone = this.pageMenu.$().clone().removeAttr("data-sap-ui").css("z-index", "1");
            this.jqFolderClone.find("*").removeAttr("id");
            this.pageMenu.$().parent().append(this.jqFolderClone);
        },

        updatePageBindings: function (path, forwardAnimation) {
            var bShowBack = path.split("/").length > 2;
            this.treePath = path;
            this.pageMenu.setShowNavButton(bShowBack);
            this.pageMenu.setShowSubHeader(!bShowBack);
            this.prepareEasyAccessAnimation(forwardAnimation);
            this.oList.bindItems("easyAccess>" + path + "/folders", this.oItemTemplate);
        }
    });
}, /* bExport= */ true);
},
	"sap/ushell/components/appfinder/manifest.json":'{\n    "_version": "1.12.0",\n    "sap.app": {\n        "id": "sap.ushell.components.appfinder",\n        "applicationVersion": {\n            "version": "1.74.0"\n        },\n        "i18n": "../../renderers/fiori2/resources/resources.properties",\n        "ach": "CA-FLP-FE-COR",\n        "type": "component",\n        "title": "{{Component.AppFinder.Title}}"\n    },\n    "sap.ui": {\n        "fullWidth": true,\n        "hideLightBackground": true,\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "dependencies": {\n            "minUI5Version": "1.30",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "routing": {\n            "config": {\n                "routerClass": "sap.m.routing.Router",\n                "viewType": "JS",\n                "controlId": "catalogViewMasterDetail",\n                "controlAggregation": "detailPages",\n                "clearAggregation": false,\n                "async": true\n            },\n            "routes": []\n        },\n        "contentDensities": {\n            "compact": true,\n            "cozy": true\n        }\n    }\n}'
},"Component-preload"
);
