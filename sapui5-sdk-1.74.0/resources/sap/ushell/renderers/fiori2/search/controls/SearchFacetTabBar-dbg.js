// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap */
/* global jQuery */
/* global $ */
/* global document */


sap.ui.define([
    'sap/base/Log',
    'sap/ushell/renderers/fiori2/search/SearchFacetDialogModel',
    'sap/ushell/renderers/fiori2/search/controls/SearchFacetDialog',
    'sap/m/GroupHeaderListItemRenderer',
    'sap/m/ButtonRenderer'
], function (Log) {
    "use strict";


    sap.m.Button.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDown', {
        renderer: 'sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDownRenderer'
    });

    sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDownRenderer = jQuery.extend(true, {}, sap.m.ButtonRenderer); // clone


    sap.m.GroupHeaderListItemRenderer.extend('sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer');
    sap.m.GroupHeaderListItem.extend('sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItem', {
        renderer: 'sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer',
        metadata: {
            properties: {
                upperCase: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false
                } // change default
            },
            aggregations: {
                button: {
                    type: 'sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDown',
                    multiple: false
                }
            }
        }
    });

    sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer.renderCounter = function (rm, oLI) {
        var btn = oLI.getButton();
        if (typeof btn === 'object') {
            this.renderCounterContent(rm, oLI, btn);
        }
    };
    sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItemRenderer.renderCounterContent = function (rm, oLI, btn) {
        rm.write('<div>');
        rm.renderControl(btn);
        rm.write('</div>');
    };


    sap.m.SegmentedButtonItem.extend('my.SegmentedButtonItem', {
        aggregations: {
            "content1": {
                type: "sap.ui.core.Control",
                multiple: false
            }
        }
    });

    sap.ui.core.Control.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacetTabBar', {
        metadata: { // the Control API
            properties: {
                "eshRole": "string", // setter and getter are created behind the scenes,
                "headerText": "string", // including data binding and type validation
                "selectedButtonParameters": {
                    type: "object",
                    defaultValue: null
                }
            },
            aggregations: {
                items: {
                    type: "sap.m.IconTabFilter",
                    multiple: true // default type is "sap.ui.core.Control", multiple is "true"
                }
            }
        },

        getSearchFacetTabBarAndDimensionById: function (buttonId) { //__button17
            var returnOBj = {};
            returnOBj.index = 0;
            var button = document.getElementById(buttonId);
            var view = button.dataset.facetView;
            var buttonIndex = button.dataset.facetViewIndex;
            var actionSheet = $("#" + buttonId).parent()[0];
            var dimension = actionSheet.dataset.facetDimension;
            var ar = $(".sapUshellSearchFacetTabBar");
            for (var i = 0; i < ar.length; i++) {
                var currentHeader = $(".sapUshellSearchFacetTabBar .sapUshellSearchFacetTabBarHeader")[i];
                var headerDimension = currentHeader.dataset.facetDimension;
                if (headerDimension === dimension) {
                    returnOBj.index = i;
                    returnOBj.control = sap.ui.getCore().byId(ar[i].id);
                    returnOBj.view = view;
                    returnOBj.buttonIndex = buttonIndex;
                    returnOBj.dimension = dimension;
                    break;
                }
            }
            return returnOBj;
        },

        storeClickedTabInformation: function (oEvent) {
            var searchFacetTabBarDimension, searchFacetTabBarControl, searchFacetTabBarView, dimension, buttonIndex;
            var tabId = oEvent.getSource().sId;
            var searchFacetTabBarInfo = this.getSearchFacetTabBarAndDimensionById(tabId);
            //            var previousClickedTabInformation = $.sap.storage.get("selectedButtonParameters");
            var previousClickedTabInformation = searchFacetTabBarInfo.control.getModel().getPersonalizationStorageInstance().getItem("search-facet-panel-chart-state");

            searchFacetTabBarDimension = searchFacetTabBarInfo.dimension;
            searchFacetTabBarControl = searchFacetTabBarInfo.control;
            searchFacetTabBarView = searchFacetTabBarInfo.view;
            buttonIndex = searchFacetTabBarInfo.buttonIndex;
            dimension = searchFacetTabBarControl.getBindingContext().getObject().dimension;

            var buttonId = oEvent.getParameters().id;

            var clickedTabInformation = [];
            var obj = {};
            obj.tabId = tabId;
            obj.searchFacetTabBarIndex = searchFacetTabBarInfo.searchFacetTabBarIndex;
            obj.buttonId = buttonId;
            obj.buttonIndex = buttonIndex;
            obj.dimension = dimension;
            obj.view = searchFacetTabBarView;
            clickedTabInformation.push(obj);
            if (previousClickedTabInformation &&
                Object.prototype.toString.call(previousClickedTabInformation) === '[object Array]') {
                for (var i = 0; i < previousClickedTabInformation.length; i++) {
                    var item = previousClickedTabInformation[i];
                    if (item.dimension !== searchFacetTabBarDimension) {
                        clickedTabInformation.push(item);
                    }
                }
            }

            searchFacetTabBarInfo.control.getModel().getPersonalizationStorageInstance().setItem("search-facet-panel-chart-state", clickedTabInformation);

            //also store information in model
            searchFacetTabBarControl.getBindingContext().getObject().chartIndex = buttonIndex;

        },


        renderer: function (oRm, oControl) {
            /* eslint no-loop-func:0 */
            var createOpenFacetDialogFn = function (iSelectedTabBarIndex, aTabBarItems) {

                return function (event) {
                    var dimension;
                    // since UI5 reuses the showMore link control, we have to traverse the DOM
                    // to find our facets dimension:

                    //sapUshellSearchFacetTabBar sapUshellSearchFacet
                    var node = $(this.getDomRef()).closest(".sapUshellSearchFacetTabBar")[0];
                    var facet = sap.ui.getCore().byId($(node).attr("id"));
                    var oFacetDialogModel = new sap.ushell.renderers.fiori2.search.SearchFacetDialogModel(oControl.getModel());
                    oFacetDialogModel.initBusinessObjSearch().then(function () {
                        oFacetDialogModel.setData(oControl.getModel().getData());
                        oFacetDialogModel.sinaNext = oControl.getModel().sinaNext;
                        oFacetDialogModel.prepareFacetList();
                        if (facet && facet.getBindingContext() && facet.getBindingContext().getObject() && facet.getBindingContext().getObject().dimension) {
                            dimension = facet.getBindingContext().getObject().dimension;
                        }
                        var oDialog = new sap.ushell.renderers.fiori2.search.controls.SearchFacetDialog({
                            selectedAttribute: dimension,
                            selectedTabBarIndex: iSelectedTabBarIndex,
                            tabBarItems: aTabBarItems
                        });
                        oDialog.setModel(oFacetDialogModel);
                        oDialog.setModel(oControl.getModel(), 'searchModel');
                        oDialog.open();
                        //referece to page, so that dialog can be destroy in onExit()
                        var oPage = oControl.getParent().getParent().getParent().getParent();
                        oPage.oFacetDialog = oDialog;
                        oControl.getModel().eventLogger.logEvent({
                            type: oControl.getModel().eventLogger.FACET_SHOW_MORE,
                            referencedAttribute: dimension
                        });
                    });
                };
            };


            // outer div
            oRm.write('<div tabindex="0"');
            oRm.writeControlData(oControl);
            oRm.addClass("sapUshellSearchFacetTabBar");
            oRm.writeClasses();
            oRm.write('>');


            //var currentTabFacetIndex = 0;
            var dimension = oControl.getBindingContext().getObject().dimension;
            var dataType = oControl.getBindingContext().getObject().dataType;
            var title = oControl.getBindingContext().getObject().title;
            var clickedTabInformation;
            var selectedButtonParameters;

            //            clickedTabInformation = $.sap.storage.get("selectedButtonParameters");
            clickedTabInformation = oControl.getModel().getPersonalizationStorageInstance().getItem("search-facet-panel-chart-state");
            if (clickedTabInformation && Object.prototype.toString.call(clickedTabInformation) === '[object Array]') {
                for (var k = 0; k < clickedTabInformation.length; k++) {
                    if (clickedTabInformation[k].dimension === dimension) {
                        selectedButtonParameters = clickedTabInformation[k];
                        break;
                    }
                }
            }

            var buttons2 = [];
            var contents = [];
            var oContent = null;
            var oButton = null;



            var selectedButtonIndex = 0;
            if (selectedButtonParameters && selectedButtonParameters.buttonIndex) {
                selectedButtonIndex = selectedButtonParameters.buttonIndex;
                selectedButtonIndex = parseInt(selectedButtonIndex, 10);
            }
            if (dataType != oControl.getModel().sinaNext.AttributeType.String) {
                selectedButtonIndex = 0;
            }

            //also store information in model
            oControl.getBindingContext().getObject().chartIndex = selectedButtonIndex;
            var tabBarItems = oControl.getItems();


            var oDropDownButton = new sap.ushell.renderers.fiori2.search.controls.SearchFacetDisplayModeDropDown({
                icon: tabBarItems[selectedButtonIndex].getIcon(), //now  "sap-icon://list" //was "sap-icon://overflow"
                type: 'Transparent'
            });


            /*eslint-disable no-loop-func*/
            for (var i = 0; i < tabBarItems.length; i++) {
                oContent = tabBarItems[i].getContent()[0];
                oButton = new sap.m.Button({
                    text: tabBarItems[i].getText(),
                    icon: tabBarItems[i].getIcon(),
                    press: function (oEvent) {
                        oControl.storeClickedTabInformation(oEvent);
                        oControl.setSelectedButtonParameters(oEvent.getParameters()); //needed to trigger rerender
                    }

                });
                oButton.data("facet-view", tabBarItems[i].getText(), true);
                oButton.data("facet-view-index", "" + i, true);
                oButton.data("dimension", dimension, true);

                buttons2.push(oButton);
                contents.push(oContent);
            }



            var oActionSheet = new sap.m.ActionSheet({
                showCancelButton: false,
                buttons: buttons2,
                placement: sap.m.PlacementType.Bottom,
                cancelButtonPress: function (oControlEvent) {
                    Log.info("sap.m.ActionSheet: cancelButton is pressed");
                },
                afterClose: function (oControlEvent) {
                    var that = this;

                    window.setTimeout(function () {
                        var dimension = that.getFocusDomRef().getAttribute('data-facet-dimension');
                        var tabBarButtons = $(".sapUshellSearchFacetTabBarButton");
                        for (var i = 0; i < tabBarButtons.length; i++) {

                            var tabBarButton = tabBarButtons[i];
                            var tabBarButtonDimension = tabBarButton.parentNode.parentNode.getAttribute('data-facet-dimension');
                            if (tabBarButtonDimension === dimension) {
                                tabBarButton.focus();
                                break;
                            }
                        }
                    }, 100);

                    Log.info("=====================");
                    Log.info("sap.m.ActionSheet: closed");
                }
            });


            oActionSheet.data("facet-dimension", dimension, true);

            oDropDownButton.addStyleClass("sapUshellSearchFacetTabBarButton");
            var asWhat = tabBarItems[selectedButtonIndex].getText();
            var displayAs = sap.ushell.resources.i18n.getText('displayAs', [asWhat]);
            oDropDownButton.setTooltip(displayAs);
            oDropDownButton.attachPress(function (oEvent) {
                oActionSheet.openBy(this);
            });

            oDropDownButton.onAfterRendering = function () {
                $(this.getDomRef()).attr("aria-label", sap.ushell.resources.i18n.getText('dropDown'));
            };

            //RENDERING

            //set 'filter by' header
            if (oControl.getHeaderText()) {


                //===============================================
                var oHeader = new sap.m.List({
                    //headerText: oControl.getHeaderText()
                });
                oHeader.setShowNoData(false);
                oHeader.setShowSeparators(sap.m.ListSeparators.None);

                oHeader.data("sap-ui-fastnavgroup", "false", true /* write into DOM */ );


                var bFiltersExist = false;
                var rootCondition = oControl.getModel().getProperty("/uiFilter/rootCondition");
                if (rootCondition.hasFilters()) {
                    bFiltersExist = true;
                } else {
                    bFiltersExist = false;
                }


                var oResetButton = new sap.m.Button({
                    icon: "sap-icon://clear-filter",
                    tooltip: sap.ushell.resources.i18n.getText("resetFilterButton_tooltip"),
                    type: 'Transparent',
                    enabled: bFiltersExist,
                    press: function (oEvent) {
                        var model = oControl.getModel();
                        model.eventLogger.logEvent({
                            type: model.eventLogger.CLEAR_ALL_FILTERS
                        });
                        model.resetFilterConditions(true);
                    }
                });
                oResetButton.addStyleClass("sapUshellSearchFilterByResetButton");


                oResetButton.onAfterRendering = function () {
                    $(this.getDomRef()).attr("aria-label", sap.ushell.resources.i18n.getText('resetFilterButton_tooltip'));
                };


                var oLabel = new sap.m.Title({
                    text: oControl.getHeaderText()
                });
                oLabel.addStyleClass("sapUshellSearchFilterByResetButtonLabel");


                var oSpacer = new sap.m.ToolbarSpacer();

                var oHeaderToolbar = new sap.m.Toolbar({
                    content: [oLabel, oSpacer, oResetButton]
                });

                oHeaderToolbar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */ );

                oHeader.setHeaderToolbar(oHeaderToolbar);


                oHeader.addStyleClass('sapUshellSearchFilterByHeaderList');
                oHeader.onAfterRendering = function () {
                    $(".sapUshellSearchFilterByHeaderList").find("ul").attr("tabindex", "-1");
                };

                oRm.renderControl(oHeader);


                //===============================================
            }


            var oListItem = new sap.m.CustomListItem({
                content: contents[selectedButtonIndex]
                //the above line sadly removes the control from the searchFacetTabBar and relocates it in the ListItem
            });
            oListItem.setModel(oControl.getModel(), 'facets');
            oListItem.addStyleClass("sapUshellSearchFacetList");

            var oGroupHeaderListItem;

            if (dataType === oControl.getModel().sinaNext.AttributeType.String) {
                oGroupHeaderListItem = new sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItem({
                    title: title,
                    button: oDropDownButton
                });
            } else {
                oGroupHeaderListItem = new sap.ushell.renderers.fiori2.search.controls.SearchGroupHeaderListItem({
                    title: title
                });
            }

            oGroupHeaderListItem.data("facet-dimension", dimension, true);
            oGroupHeaderListItem.addStyleClass("sapUshellSearchFacetTabBarHeader");


            //---------------------
            var oShowMore = new sap.m.Link({
                text: sap.ushell.resources.i18n.getText("showMore"),
                press: createOpenFacetDialogFn(selectedButtonIndex, tabBarItems)
            });
            oShowMore.setModel(oControl.getModel("i18n"));
            oShowMore.addStyleClass('sapUshellSearchFacetShowMoreLink');


            var oInfoZeile = new sap.m.Label({
                text: ""
            });
            oInfoZeile.addStyleClass('sapUshellSearchFacetInfoZeile');
            var oShowMoreSlot = new sap.m.VBox({
                items: [
                    oInfoZeile,
                    oShowMore
                ]
            });


            var oShowMoreItem = new sap.m.CustomListItem({
                content: oShowMoreSlot, //oShowMore,
                visible: {
                    parts: [{
                        path: '/uiFilter/dataSource'
                    }],
                    formatter: function (datasource) {
                        return datasource.type !== this.getModel().sinaNext.DataSourceType.Category;
                    }
                }
            });

            oShowMoreItem.addStyleClass('sapUshellSearchFacetShowMoreItem');

            //------------------------
            var oList = new sap.m.List({
                showSeparators: sap.m.ListSeparators.None,
                items: [
                    oGroupHeaderListItem,
                    oListItem,
                    oShowMoreItem
                ]
            });
            oList.data("sap-ui-fastnavgroup", "false", true /* write into DOM */ );
            oList.setModel(oControl.getModel());
            oRm.renderControl(oList);
            //oRm.renderControl(oShowMoreSlot);

            oControl.getItems()[selectedButtonIndex].addContent(contents[selectedButtonIndex]);
            //KLUDGE: the above line returns the control to the searchFacetTabBar - otherwise it is lost by being passed to another control


            oRm.write("</div>");


        },

        onAfterRendering: function () {
            jQuery(this.getDomRef()).removeAttr("tabindex");
        }

    });

});
