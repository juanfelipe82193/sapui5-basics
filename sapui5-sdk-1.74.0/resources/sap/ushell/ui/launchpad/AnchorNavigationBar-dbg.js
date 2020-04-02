// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.launchpad.AnchorNavigationBar.
sap.ui.define([
    "sap/m/Bar",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/isEmptyObject",
    "sap/m/Button",
    "sap/ushell/resources",
    "sap/ui/model/Filter",
    "sap/ushell/ui/launchpad/GroupListItem",
    "sap/m/List",
    "sap/m/library",
    "sap/ushell/library",
    "./AnchorNavigationBarRenderer"
], function (
    Bar,
    Device,
    jQuery,
    isEmptyObject,
    Button,
    resources,
    Filter,
    GroupListItem,
    List,
    mobileLibrary
    // library
    // AnchorNavigationBarRenderer
) {
    "use strict";

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    /**
     * Constructor for a new ui/launchpad/AnchorNavigationBar.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     * @class Add your documentation for the newui/launchpad/AnchorNavigationBar
     * @extends sap.m.Bar
     * @lends sap.ushell.ui.launchpad.AnchorNavigationBar.prototype
     * @constructor
     * @public
     * @name sap.ushell.ui.launchpad.AnchorNavigationBar
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var AnchorNavigationBar = Bar.extend("sap.ushell.ui.launchpad.AnchorNavigationBar", {
        metadata: {
            library: "sap.ushell",
            properties: {
                // a value for an optional accessibility label
                accessibilityLabel: { type: "string", defaultValue: null },
                selectedItemIndex: { type: "int", group: "Misc", defaultValue: 0 },
                overflowEnabled: { type: "boolean", group: "Misc", defaultValue: true }
            },
            aggregations: {
                groups: { type: "sap.ushell.ui.launchpad.AnchorItem", multiple: true, singularName: "group" }
            },
            events: {
                afterRendering: {},
                itemPress: {}
            }
        }
    });

    /**
     * @name sap.ushell.ui.launchpad.AnchorNavigationBar
     * @private
     */
    AnchorNavigationBar.prototype.init = function () {
        Device.resize.attachHandler(this.reArrangeNavigationBarElements, this);
        this.bGroupWasPressed = false;
        this.bIsRtl = sap.ui.getCore().getConfiguration().getRTL();
        this._bIsRenderedCompletely = false;
    };

    AnchorNavigationBar.prototype.handleExit = function () {
        if (this.oPopover) {
            this.oPopover.destroy();
        }
        if (this.oOverflowButton) {
            this.oOverflowButton.destroy();
        }
    };

    AnchorNavigationBar.prototype.onAfterRendering = function () {
        if (this._bIsRenderedCompletely) {
            this.reArrangeNavigationBarElements();

            if (this.bIsRtl) {
                jQuery(".sapUshellAnchorNavigationBarItemsScroll").addClass("sapUshellRtl");
            }
            jQuery(".sapUshellAnchorNavigationBarItemsScroll").scroll(this.setNavigationBarItemsVisibility.bind(this));
        }
    };

    AnchorNavigationBar.prototype.openOverflowPopup = function () {
        var overflowOpened = jQuery(".sapUshellAnchorItemOverFlow").hasClass("sapUshellAnchorItemOverFlowOpen");
        if (this.oOverflowButton && !overflowOpened) {
            this.oOverflowButton.firePress();
        }
    };

    AnchorNavigationBar.prototype.closeOverflowPopup = function () {
        if (this.oPopover) {
            this.oPopover.close();
        }
    };

    AnchorNavigationBar.prototype.reArrangeNavigationBarElements = function () {
        this.anchorItems = this.getVisibleGroups();
        var selectedItemIndex = this.getSelectedItemIndex() || 0;

        if (this.anchorItems.length) {
            // Make sure only one item is selected at a time
            this.adjustItemSelection(selectedItemIndex);
        }

        if (Device.system.phone && this.anchorItems.length) {
            this.anchorItems.forEach(function (oItem) {
                oItem.setIsGroupVisible(false);
            });
            this.anchorItems[this.getSelectedItemIndex()].setIsGroupVisible(true);
        } else {
            setTimeout(function () {
                this.setNavigationBarItemsVisibility();
            }.bind(this), 200);
        }
        this._adjustAnchorBarAriaProperties(this.anchorItems);
    };

    AnchorNavigationBar.prototype._scrollToGroupByGroupIndex = function (groupIndex, speed) {
        // The layout is different between touch and non-touch screens
        // See the CSS rule for .sap-tablet .sapUshellAnchorNavigationBarItemsScroll
        var sScrollArea = Device.system.tablet ? ".sapUshellAnchorNavigationBarItemsScroll" : ".sapUshellAnchorNavigationBarItems";
        var oContainer = document.documentElement.querySelector(sScrollArea);
        var oSelectedElement = this.anchorItems[groupIndex].getDomRef();
        if (oContainer && oSelectedElement) {
            var oContainerRect = oContainer.getBoundingClientRect();
            var oItemRect = oSelectedElement.getBoundingClientRect();
            var iX; // scroll increment
            // adjust the horizontal scroll position of the container, if needed
            if (oItemRect.left < oContainerRect.left) {
                iX = oItemRect.left - oContainerRect.left - 16; // add 1 rem padding
            } else if (oItemRect.right > oContainerRect.right) {
                iX = oItemRect.right - oContainerRect.right + 16; // add 1 rem padding
            }
            if (iX) {
                oContainer.scrollLeft += iX;
            }
            this.setNavigationBarItemsVisibility();
        }
    };

    AnchorNavigationBar.prototype.setNavigationBarItemsVisibility = function () {
        if (!Device.system.phone) {
            //check if to show or hide the popover overflow button
            if (this.anchorItems.length && (!this.isMostRightAnchorItemVisible() || !this.isMostLeftAnchorItemVisible())) {
                this.oOverflowButton.removeStyleClass("sapUshellShellHidden");
                jQuery(".sapUshellAnchorItemOverFlow").removeClass("sapUshellShellHidden");
            } else if (this.oOverflowButton) {
                this.oOverflowButton.addStyleClass("sapUshellShellHidden");
                jQuery(".sapUshellAnchorItemOverFlow").addClass("sapUshellShellHidden");
            }
            //add left / right overflow indication on anchor items with respect to locale direction
            if (this.bIsRtl) {
                if (this.anchorItems.length && !this.isMostLeftAnchorItemVisible()) {
                    this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden");
                } else if (this.oOverflowRightButton) {
                    this.oOverflowRightButton.addStyleClass("sapUshellShellHidden");
                }
                if (this.anchorItems.length && !this.isMostRightAnchorItemVisible()) {
                    this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden");
                } else if (this.oOverflowLeftButton) {
                    this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden");
                }
            } else {
                if (this.anchorItems.length && !this.isMostLeftAnchorItemVisible()) {
                    this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden");
                } else if (this.oOverflowLeftButton) {
                    this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden");
                }
                if (this.anchorItems.length && !this.isMostRightAnchorItemVisible()) {
                    this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden");
                } else if (this.oOverflowRightButton) {
                    this.oOverflowRightButton.addStyleClass("sapUshellShellHidden");
                }
            }

            //remove the left padding from the first visible item
            jQuery(".sapUshellAnchorItem.firstItem").removeClass("firstItem");
            var jqFirstVisibleItem = jQuery(".sapUshellAnchorItem").filter(":visible").eq(0);
            jqFirstVisibleItem.addClass("firstItem");
        } else if (this.anchorItems.length) {
            this.oOverflowButton.removeStyleClass("sapUshellShellHidden");
            var selectedItemIndex = this.getSelectedItemIndex() || 0;
            if (this.oPopover) {
                this.oPopover.setTitle(this.anchorItems[selectedItemIndex].getTitle());
            }
        }
    };

    AnchorNavigationBar.prototype.adjustItemSelection = function (iSelectedIndex) {
        // call adjustItemSelection with timeout since after deletion of group the dashboard scrolls and changes the selection wrongly
        // so wait a bit for the scroll and then adjust the selection
        setTimeout(function () {
            if (this.anchorItems && this.anchorItems.length) {
                this.anchorItems.forEach(function (oItem) {
                    oItem.setSelected(false);
                });
                if (iSelectedIndex < this.anchorItems.length) {
                    this.anchorItems[iSelectedIndex].setSelected(true);

                    //scroll to group
                    this._scrollToGroupByGroupIndex(iSelectedIndex);
                }
            }
        }.bind(this), 200);
    };

    AnchorNavigationBar.prototype.isMostRightAnchorItemVisible = function () {
        var jqNavigationBar = jQuery(".sapUshellAnchorNavigationBar"),
            navigationBarWidth = !isEmptyObject(jqNavigationBar) ? jqNavigationBar.width() : 0,
            navigationBarOffset = !isEmptyObject(jqNavigationBar) && jqNavigationBar.offset() ?
                jqNavigationBar.offset().left : 0,
            lastItem = this.bIsRtl ? this.anchorItems[0].getDomRef() : this.anchorItems[this.anchorItems.length - 1].getDomRef(),
            lastItemWidth = !isEmptyObject(lastItem) ? jQuery(lastItem).width() : 0,
            lastItemOffset;
        // when the anchor bar isn't visible, the items gets negative width
        // use the minimal width for items instead
        if (lastItemWidth < 0) {
            lastItemWidth = 80;
        }
        lastItemOffset = lastItem && jQuery(lastItem).offset() ? jQuery(lastItem).offset().left : 0;

        // last item is completely shown in the navigation bar
        if (lastItemOffset + lastItemWidth <= navigationBarOffset + navigationBarWidth) {
            return true;
        }
        return false;
    };

    AnchorNavigationBar.prototype.isMostLeftAnchorItemVisible = function () {
        var jqNavigationBar = jQuery(".sapUshellAnchorNavigationBar"),
            navigationBarOffsetLeft = !isEmptyObject(jqNavigationBar)
                && jqNavigationBar.offset() && jqNavigationBar.offset().left || 0,
            firstItem = this.bIsRtl ? this.anchorItems[this.anchorItems.length - 1].getDomRef() : this.anchorItems[0].getDomRef(),
            firstItemOffset = !isEmptyObject(firstItem) && jQuery(firstItem).offset() ? jQuery(firstItem).offset().left : 0;

        // last item is not completely shown in the navigation bar
        if (firstItemOffset >= navigationBarOffsetLeft) {
            return true;
        }
        return false;
    };

    AnchorNavigationBar.prototype.setSelectedItemIndex = function (iSelectedIndex) {
        if (iSelectedIndex !== undefined) {
            this.setProperty("selectedItemIndex", iSelectedIndex, true);
        }
    };

    AnchorNavigationBar.prototype.setOverflowEnabled = function (bEnabled) {
        this.setProperty("overflowEnabled", bEnabled);
        if (this.oOverflowButton) {
            this.oOverflowButton.setEnabled(bEnabled);
        }
    };

    AnchorNavigationBar.prototype._getOverflowLeftArrowButton = function () {
        this.oOverflowLeftButton = new Button({
            icon: "sap-icon://slim-arrow-left",
            tooltip: resources.i18n.getText("scrollToTop"),
            press: function () {
                this._scrollToGroupByGroupIndex(0);
            }.bind(this)
        }).addStyleClass("sapUshellShellHidden");

        return this.oOverflowLeftButton;
    };

    AnchorNavigationBar.prototype._getOverflowRightArrowButton = function () {
        this.oOverflowRightButton = new Button({
            icon: "sap-icon://slim-arrow-right",
            tooltip: resources.i18n.getText("scrollToEnd"),
            press: function () {
                this._scrollToGroupByGroupIndex(this.anchorItems.length - 1);
            }.bind(this)
        }).addStyleClass("sapUshellShellHidden");

        return this.oOverflowRightButton;
    };

    AnchorNavigationBar.prototype._getOverflowButton = function () {
        // if already created - no need to create new button (same applies for popover)
        if (this.oOverflowButton) {
            return this.oOverflowButton;
        }

        this.oOverflowButton = new Button("sapUshellAnchorBarOverflowButton", {
            icon: "sap-icon://slim-arrow-down",
            tooltip: resources.i18n.getText("more_groups"),
            enabled: this.getOverflowEnabled(),
            press: function () {
                sap.ui.require([
                    "sap/m/Popover"
                ], function (Popover) {
                    if (!this.oPopover) {
                        this._initPopover(Popover);
                    }

                    // if we need to close the popover
                    if (this.oPopover.isOpen()) {
                        this.oPopover.close();
                    } else {
                        var oList = this.oPopover.getContent()[0];
                        // if we need to open the popover
                        this.anchorItems = this.getVisibleGroups();
                        oList.setModel(this.getModel());
                        var bActionModeActive = this.getModel().getProperty("/tileActionModeActive");
                        var visibleGroupFilter = new Filter("", "EQ", "a");
                        visibleGroupFilter.fnTest = function (itemModel) {
                            // Empty groups should not be displayed when personalization is off or
                            // if they are locked or default group not in action mode
                            if (!itemModel.visibilityModes[bActionModeActive ? 1 : 0]) {
                                return false;
                            }
                            return itemModel.isGroupVisible || bActionModeActive;
                        };
                        oList.bindItems({
                            path: "/groups",
                            template: new GroupListItem({
                                title: "{title}",
                                groupId: "{groupId}",
                                index: "{index}"
                            }),
                            filters: [visibleGroupFilter]
                        });
                        var sSelectedGroupId = jQuery(".sapUshellAnchorItemSelected").attr("id");
                        var oSelectedGroup = sap.ui.getCore().byId(sSelectedGroupId);
                        jQuery.each(oList.getItems(), function (i, item) {
                            if (oSelectedGroup.mProperties.groupId === item.mProperties.groupId) {
                                item.addStyleClass("sapUshellAnchorPopoverItemSelected");
                            } else {
                                item.addStyleClass("sapUshellAnchorPopoverItemNonSelected");
                            }
                        });
                        jQuery(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed", true);
                        this.oPopover.openBy(this.oOverflowButton);
                    }
                }.bind(this));
            }.bind(this)
        }).addStyleClass("sapUshellShellHidden").addStyleClass("sapContrastPlus");

        return this.oOverflowButton;
    };

    AnchorNavigationBar.prototype._initPopover = function (Popover) {
        var that = this;
        var oList = new List({
            mode: ListMode.SingleSelectMaster,
            rememberSelections: false,
            selectionChange: function (oEvent) {
                that.fireItemPress({ group: oEvent.getParameter("listItem") });
                that.oPopover.close();
            }
        });

        // This parameter will be 'true' ONLY IF the click to close popover came from the overflow button
        // (see this.oPopover before close handler)
        this.bOverFlowBtnClick = false;

        this.oPopover = new Popover("sapUshellAnchorBarOverflowPopover", {
            showArrow: false,
            showHeader: false,
            placement: "Left",
            content: [oList],
            horizontalScrolling: false,
            beforeOpen: function () {
                jQuery(".sapUshellAnchorItemOverFlow").addClass("sapUshellAnchorItemOverFlowOpen");
                //place the popover under the overflow button
                var jqOverflowBtn = jQuery(".sapUshellAnchorItemOverFlow"),
                    bIsRtl = sap.ui.getCore().getConfiguration().getRTL(),
                    offset = bIsRtl ? -1 * jqOverflowBtn.outerWidth() : jqOverflowBtn.outerWidth();
                this.setOffsetX(offset);
            },
            beforeClose: function () {
                // using document.activeElement.id we can identify what is the element that the user clicked on in order to close the popover
                // if he clicked on the overflow button, the flag will turn to true
                if (document.activeElement.id === this.oOverflowButton.getId()) {
                    this.bOverFlowBtnClick = true;
                }
            }.bind(this),
            afterClose: function () {
                jQuery(".sapUshellAnchorItemOverFlow").removeClass("sapUshellAnchorItemOverFlowOpen");
                jQuery(".sapUshellAnchorItemOverFlow").toggleClass("sapUshellAnchorItemOverFlowPressed", false);
            }
        }).addStyleClass("sapUshellAnchorItemsPopover").addStyleClass("sapContrastPlus");
    };

    AnchorNavigationBar.prototype.getVisibleGroups = function () {
        return this.getGroups().filter(function (oGroup) {
            return oGroup.getVisible();
        });
    };

    AnchorNavigationBar.prototype._adjustAnchorBarAriaProperties = function (aGroups) {
        var i;

        for (i = 0; i < aGroups.length; i++) {
            var jsGroup = jQuery(aGroups[i].getDomRef());
            jsGroup.attr("aria-posinset", i + 1);
            jsGroup.attr("aria-setsize", aGroups.length);
        }
    };

    /**
     * Sets the value that indicates whether the control is rendered completely.
     *
     * @param {boolean} bRendered True, if the control is rendered completely. False otherwise.
     * @private
     */
    AnchorNavigationBar.prototype._setRenderedCompletely = function (bRendered) {
        this._bIsRenderedCompletely = bRendered;
    };

    AnchorNavigationBar.prototype.handleAnchorItemPress = function (oEvent) {
        this.bGroupWasPressed = true;
        this.fireItemPress({ group: oEvent.getSource(), manualPress: true });
    };

    AnchorNavigationBar.prototype.exit = function () {
        if (this.oOverflowLeftButton) {
            this.oOverflowLeftButton.destroy();
        }
        if (this.oOverflowRightButton) {
            this.oOverflowRightButton.destroy();
        }
        if (this.oOverflowButton) {
            this.oOverflowButton.destroy();
        }
        if (this.oPopover) {
            this.oPopover.destroy();
        }
    };

    return AnchorNavigationBar;
});
