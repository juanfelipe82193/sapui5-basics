// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
// iteration 0 : Holger
/* global $ */

sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchModel'], function (SearchModel) {
    "use strict";

    var module = sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar", {
        metadata: {
            properties: {
                itemId: "string",
                navigationObjects: {
                    type: "object",
                    multiple: true
                },
                positionInList: "int"
            },
            aggregations: {
                _relatedObjectActionsToolbar: {
                    type: "sap.m.Toolbar",
                    multiple: false,
                    visibility: "hidden"
                },
                _ariaDescriptionForLinks: {
                    type: "sap.ui.core.InvisibleText",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },

        init: function () {
            var that = this;

            if (sap.ui.core.Control.prototype.init) { // check whether superclass implements the method
                sap.ui.core.Control.prototype.init.apply(that, arguments); // call the method with the original arguments
            }

            sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar._allOfMyCurrentInstances.push(that);

            that.setAggregation("_relatedObjectActionsToolbar", new sap.m.Toolbar({
                    design: sap.m.ToolbarDesign.Solid
                })
                .data("sap-ui-fastnavgroup", "false", true /* write into DOM */ )
                .addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Toolbar")
            );

            that.setAggregation("_ariaDescriptionForLinks", new sap.ui.core.InvisibleText({
                text: sap.ushell.resources.i18n.getText("result_list_item_aria_has_more_links")
            }));

            if (typeof sap !== 'undefined' && sap.ui && sap.ui.getCore) {
                sap.ui.getCore().getEventBus().subscribe("searchLayoutChanged", that._layoutToolbarElements, that);
            }
        },

        exit: function () {
            var that = this;

            if (sap.ui.core.Control.prototype.exit) { // check whether superclass implements the method
                sap.ui.core.Control.prototype.exit.apply(that, arguments); // call the method with the original arguments
            }

            var allOfMyCurrentInstances = sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar._allOfMyCurrentInstances;
            for (var i = 0; i < allOfMyCurrentInstances.length; i++) {
                if (allOfMyCurrentInstances[i] === that) {
                    allOfMyCurrentInstances.splice(i, 1);
                    break;
                }
            }

            if (typeof sap !== 'undefined' && sap.ui && sap.ui.getCore) {
                sap.ui.getCore().getEventBus().unsubscribe("searchLayoutChanged", that._layoutToolbarElements, that);
            }
        },

        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl); // writes the Control ID
            oRm.addClass("sapUshellSearchResultListItem-RelatedObjectsToolbar");
            oRm.writeClasses();
            oRm.write(">");

            oRm.renderControl(oControl.getAggregation("_ariaDescriptionForLinks"));
            oControl._renderToolbar(oRm);

            oRm.write("</div>");
        },

        _renderToolbar: function (oRm) {
            var that = this;
            var i;

            var _relatedObjectActionsToolbar = that.getAggregation("_relatedObjectActionsToolbar");
            _relatedObjectActionsToolbar.destroyContent();

            var createPressHandler = function (navigationObject) {
                return function () {
                    that._performNavigation(navigationObject, {
                        trackingOnly: true
                    });
                };
            };

            var navigationObjects = that.getNavigationObjects();

            if (navigationObjects.length > 0) {

                var navigationObjectsLinks = [];
                for (i = 0; i < navigationObjects.length; i++) {
                    var navigationObject = navigationObjects[i];
                    var link = new sap.m.Link({
                        text: navigationObject.getText(),
                        href: navigationObject.getHref(),
                        layoutData: new sap.m.ToolbarLayoutData({
                            shrinkable: false
                        }),
                        press: createPressHandler(navigationObject)
                    });
                    var target = navigationObject.getTarget();
                    if (target) {
                        link.setTarget(target);
                    }
                    link.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");
                    navigationObjectsLinks.push(link);
                }

                var toolbarSpacer = new sap.m.ToolbarSpacer();
                toolbarSpacer.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Spacer");
                _relatedObjectActionsToolbar.addContent(toolbarSpacer);

                for (i = 0; i < navigationObjectsLinks.length; i++) {
                    _relatedObjectActionsToolbar.addContent(navigationObjectsLinks[i]);
                }

                that._overFlowButton = new sap.m.Button({
                    icon: sap.ui.core.IconPool.getIconURI("overflow")
                });
                that._overFlowButton.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-OverFlowButton");
                _relatedObjectActionsToolbar.addContent(that._overFlowButton);

                that._overFlowSheet = new sap.m.ActionSheet({
                    placement: sap.m.PlacementType.Top
                });

                that._overFlowButton.attachPress(function () {
                    that._overFlowSheet.openBy(that._overFlowButton);
                });

                oRm.renderControl(_relatedObjectActionsToolbar);
            }
        },


        // after rendering
        // ===================================================================
        onAfterRendering: function () {
            var that = this;

            // if (that._overFlowButton) {
            //     var $overFlowButton = $(that._overFlowButton.getDomRef());
            //     $overFlowButton.css("display", "none");
            // }

            that._layoutToolbarElements();
            that._addAriaInformation();
        },

        _layoutToolbarElements: function () {
            var that = this;

            var _relatedObjectActionsToolbar = that.getAggregation("_relatedObjectActionsToolbar");
            if (!(that.getDomRef() && _relatedObjectActionsToolbar.getDomRef())) {
                return;
            }

            var $toolbar = $(_relatedObjectActionsToolbar.getDomRef());
            var toolbarWidth = $toolbar.width();

            // following return can cause issues in case of control being rendered more than once immediately after the first render
            // if (toolbarWidth === 0 || (that.toolbarWidth && that.toolbarWidth === toolbarWidth)) {
            //     return;
            // }

            if ($(that.getDomRef()).css("display") === "none" || $toolbar.css("display") === "none") {
                return;
            }

            that.toolbarWidth = toolbarWidth;

            var $overFlowButton = $(that._overFlowButton.getDomRef());
            $overFlowButton.css("display", "none");

            var toolbarElementsWidth = 0;

            var pressButton = function (event, _navigationObject) {
                that._performNavigation(_navigationObject);
            };

            var $toolbarElements = $toolbar.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");
            for (var i = 0; i < $toolbarElements.length; i++) {
                var $element = $($toolbarElements[i]);
                $element.css("display", "");
                var _toolbarElementsWidth = toolbarElementsWidth + $element.outerWidth(true);

                if (_toolbarElementsWidth > toolbarWidth) {
                    if (i < $toolbarElements.length) {
                        $overFlowButton.css("display", "");
                        var overFlowButtonWidth = $overFlowButton.outerWidth(true);

                        for (; i >= 0; i--) {
                            $element = $($toolbarElements[i]);
                            _toolbarElementsWidth -= $element.outerWidth(true);
                            if (_toolbarElementsWidth + overFlowButtonWidth <= toolbarWidth) {
                                break;
                            }
                        }
                    }

                    var navigationObjects = that.getNavigationObjects();
                    that._overFlowSheet.destroyButtons();

                    i = (i >= 0) ? i : 0;
                    for (; i < $toolbarElements.length; i++) {
                        $element = $($toolbarElements[i]);
                        $element.css("display", "none");

                        var navigationObject = navigationObjects[i];

                        var button = new sap.m.Button({
                            text: navigationObject.getText()
                        });
                        button.attachPress(navigationObject, pressButton);
                        that._overFlowSheet.addButton(button);
                    }
                    break;
                }
                toolbarElementsWidth = _toolbarElementsWidth;
            }

            that._setupItemNavigation();
        },

        _setupItemNavigation: function () {
            var that = this;

            if (!that.theItemNavigation) {
                that.theItemNavigation = new sap.ui.core.delegate.ItemNavigation();
                that.addDelegate(that.theItemNavigation);
            }
            that.theItemNavigation.setCycling(false);
            that.theItemNavigation.setRootDomRef(that.getDomRef());
            var itemDomRefs = [];
            var _relatedObjectActionsToolbar = that.getAggregation("_relatedObjectActionsToolbar");
            var content = _relatedObjectActionsToolbar.getContent();
            for (var i = 0; i < content.length; i++) {
                if (!content[i].hasStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Element")) {
                    continue;
                }
                if (!$(content[i].getDomRef()).attr("tabindex")) {
                    var tabindex = "-1";
                    if (content[i].getPressed && content[i].getPressed()) {
                        tabindex = "0";
                    }
                    $(content[i].getDomRef()).attr("tabindex", tabindex);
                }
                itemDomRefs.push(content[i].getDomRef());
            }

            var _overflowButton = that._overFlowButton.getDomRef();
            itemDomRefs.push(_overflowButton);
            $(_overflowButton).attr("tabindex", "-1");

            that.theItemNavigation.setItemDomRefs(itemDomRefs);
        },

        _addAriaInformation: function () {
            var that = this;
            var $toolbar = $(this.getAggregation("_relatedObjectActionsToolbar").getDomRef());

            var $navigationLinks = $toolbar.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");
            var $overFlowButton = $(that._overFlowButton.getDomRef());

            // $toolbar.attr("role", "list");

            if ($navigationLinks.length > 0 || $overFlowButton.is(":visible")) {
                var ariaDescriptionId = that.getAggregation("_ariaDescriptionForLinks").getId();
                $navigationLinks.each(function () {
                    var $this = $(this);
                    // $this.attr("role", "listitem");
                    var ariaDescription = $this.attr("aria-describedby") || "";
                    ariaDescription += " " + ariaDescriptionId;
                    $this.attr("aria-describedby", ariaDescription);
                });

                if ($overFlowButton.is(":visible")) {
                    // $overFlowButton.attr("role", "listitem");
                    var ariaDescription = $overFlowButton.attr("aria-describedby") || "";
                    ariaDescription += " " + ariaDescriptionId;
                    $overFlowButton.attr("aria-describedby", ariaDescription);
                }
            }
        },

        _performNavigation: function (navigationTarget, params) {
            var trackingOnly = params && params.trackingOnly || false;
            navigationTarget.performNavigation({
                trackingOnly: trackingOnly
            });
        }
    });

    module._allOfMyCurrentInstances = [];

    $(window).on("resize", function () {
        for (var i = 0; i < this._allOfMyCurrentInstances.length; i++) {
            this._allOfMyCurrentInstances[i]._layoutToolbarElements();
        }
    }.bind(module));

    return module;
});
