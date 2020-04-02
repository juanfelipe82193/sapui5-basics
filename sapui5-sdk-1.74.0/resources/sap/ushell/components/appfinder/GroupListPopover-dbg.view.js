// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
