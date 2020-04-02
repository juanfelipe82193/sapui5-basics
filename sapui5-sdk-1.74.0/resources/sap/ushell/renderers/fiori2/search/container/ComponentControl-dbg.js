// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */
sap.ui.define([
    'sap/ushell/renderers/fiori2/search/controls/SearchFieldGroup',
    'sap/ushell/renderers/fiori2/search/controls/SearchFilterBar'
], function (SearchFieldGroup, SearchFilterBar) {
    "use strict";

    var module = sap.ushell.renderers.fiori2.search.container.ComponentControl = {};
    jQuery.extend(module, {

        init: function () {

            this.oSearchFieldGroup = new SearchFieldGroup("searchFieldInShell");

            this.oSearchResults = sap.ui.view({
                id: "searchContainerResultsView",
                viewName: "sap.ushell.renderers.fiori2.search.container.Search",
                type: sap.ui.core.mvc.ViewType.JS
            });

            this.oSearchBar = new sap.m.Bar({
                visible: {
                    parts: [{
                        path: '/count'
                    }, {
                        path: '/facetVisibility'
                    }],
                    formatter: function (count, facetVisibility) {
                        if (facetVisibility) {
                            return count !== 0;
                        }
                        return count !== 0;

                    }
                },
                contentLeft: [
                    this.oSearchResults.assembleFilterButton(),
                    this.oSearchResults.assembleDataSourceTapStrips()
                ],
                contentRight: this.oSearchResults.assembleSearchToolbar(true)
            });
            this.oSearchBar.addStyleClass('sapUshellSearchBar');

            this.oFilterBar = new sap.ushell.renderers.fiori2.search.controls.SearchFilterBar({
                visible: {
                    parts: [{
                        path: '/facetVisibility'
                    }, {
                        path: '/uiFilter/rootCondition'
                    }],
                    formatter: function (facetVisibility, rootCondition) {
                        if (!facetVisibility && rootCondition && rootCondition.hasFilters()) {
                            return true;
                        }
                        return false;

                    }
                }
            });

            this.oSearchPage = new sap.m.Page({
                id: 'searchPage',
                customHeader: this.oSearchBar,
                subHeader: this.oFilterBar,
                content: [this.oSearchResults],
                enableScrolling: true,
                showFooter: {
                    parts: ['/errors/length'],
                    formatter: function (numberErrors) {
                        return numberErrors > 0;
                    }
                },
                showHeader: true,
                showSubHeader: {
                    parts: [{
                        path: '/facetVisibility'
                    }, {
                        path: '/uiFilter/rootCondition'
                    }],
                    formatter: function (facetVisibility, rootCondition) {
                        if (!facetVisibility && rootCondition && rootCondition.hasFilters()) {
                            return true;
                        }
                        return false;

                    }
                }
            });

        },

        createFooter: function (oPage) {

            var that = this;

            that.oModel = oPage.getModel();

            // no footer on phone
            if (jQuery.device.is.phone) {
                return;
            }

            // create error message popover
            var oErrorPopover = new sap.m.MessagePopover({
                placement: "Top"
            });
            oErrorPopover.setModel(that.oModel);
            that.oModel.setProperty("/errorPopoverControlId", oErrorPopover.getId());


            oErrorPopover.bindAggregation("items", "/errors", function (sId, oContext) {
                var item = new sap.m.MessagePopoverItem({
                    title: "{title}",
                    description: "{description}"
                });
                switch (oContext.oModel.getProperty(oContext.sPath).type.toLowerCase()) {
                case "error":
                    item.setType(sap.ui.core.MessageType.Error);
                    break;
                case "warning":
                    item.setType(sap.ui.core.MessageType.Warning);
                    break;
                default:
                    item.setType(sap.ui.core.MessageType.Information);
                }
                return item;
            });

            // create error message popover button
            var oErrorButton = new sap.m.Button("searchErrorButton", {
                //icon: 'sap-icon://action',
                icon: sap.ui.core.IconPool.getIconURI("alert"),
                text: {
                    parts: [{
                        path: '/errors/length'
                    }],
                    formatter: function (length) {
                        return length;
                    }
                },
                visible: {
                    parts: [{
                        path: '/errors/length'
                    }],
                    formatter: function (length) {
                        return length > 0;
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                },
                type: sap.m.ButtonType.Emphasized,
                tooltip: sap.ushell.resources.i18n.getText('errorBtn'),
                press: function () {
                    oErrorPopover.setVisible(true);
                    oErrorPopover.openBy(oErrorButton);
                }
            });

            oErrorButton.addDelegate({
                onAfterRendering: function () {
                    if (!that.oModel.getProperty('/isErrorPopovered')) {
                        oErrorButton.firePress();
                        that.oModel.setProperty('/isErrorPopovered', true);
                    }
                }
            });

            oErrorButton.setLayoutData(new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.NeverOverflow
            }));

            var content = [
                oErrorButton
            ];

            // create footer bar
            that.oBar = new sap.m.OverflowToolbar({
                content: content
            }).addStyleClass("MyBar");

            oPage.setFooter(that.oBar);
        }

    });

    return module;
});
