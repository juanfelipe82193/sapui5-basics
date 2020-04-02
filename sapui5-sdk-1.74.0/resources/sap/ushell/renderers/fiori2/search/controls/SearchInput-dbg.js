// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global $, jQuery, sap, window */
sap.ui.define([
    "sap/ushell/Config",
    'sap/ushell/renderers/fiori2/search/SearchHelper',
    'sap/ushell/renderers/fiori2/search/SearchConfiguration',
    'sap/m/Input',
    'sap/ushell/renderers/fiori2/search/suggestions/SuggestionType',
    'sap/ui/layout/HorizontalLayout',
    'sap/ui/layout/VerticalLayout',
    'sap/base/Log',
    'sap/ushell/renderers/fiori2/search/controls/SearchObjectSuggestionImage',
    "sap/ushell/services/AppType",
    'sap/ui/base/Event'
], function (Config, SearchHelper, SearchConfiguration, Input, SuggestionType, HorizontalLayout, VerticalLayout, Log, SearchObjectSuggestionImage, AppType, Event) {
    "use strict";

    sap.m.Input.extend('sap.ushell.renderers.fiori2.search.controls.SearchInput', {

        constructor: function (sId, oOptions) {
            var that = this;
            oOptions = jQuery.extend({}, {
                width: '100%',
                showValueStateMessage: false,
                showTableSuggestionValueHelp: false,
                enableSuggestionsHighlighting: false,
                showSuggestion: true,
                filterSuggests: false,
                suggestionColumns: [new sap.m.Column({})],
                autocomplete: false,
                tooltip: sap.ushell.resources.i18n.getText("search"),
                placeholder: {
                    path: '/searchTermPlaceholder',
                    mode: sap.ui.model.BindingMode.OneWay
                },
                liveChange: this.handleLiveChange.bind(this),
                suggestionItemSelected: this.handleSuggestionItemSelected.bind(this),
                enabled: {
                    parts: [{
                        path: "/initializingObjSearch"
                    }],
                    formatter: function (initializingObjSearch) {
                        return !initializingObjSearch;
                    }
                }
            }, oOptions);

            // ugly hack disable fullscreen input on phone - start
            var phone = sap.ui.Device.system.phone;
            sap.ui.Device.system.phone = false;
            sap.m.Input.prototype.constructor.apply(this, [sId, oOptions]);
            sap.ui.Device.system.phone = phone;
            // ugly hack - end

            this.bindAggregation("suggestionRows", "/suggestions", function (sId, oContext) {
                return that.suggestionItemFactory(sId, oContext);
            });

            //this.attachLiveChange(this.handleLiveChange.bind(this))
            this.addStyleClass('searchInput');

            //disable fullscreen input on phone
            this._bUseDialog = false;
            this._bFullScreen = false;

            this._ariaDescriptionIdNoResults = sId + "-No-Results-Description";

        },

        renderer: 'sap.m.InputRenderer',

        /*onkeydown: function (event) {
            if (event.ctrlKey && event.keyCode === 13) {
                var model = this.getModel();
                this.destroySuggestionRows();
                model.abortSuggestions();
                model.autoSelectAppSuggestion().then(function (suggestion) {
                    if (!suggestion) {
                        return;
                    }
                    var event = new Event('AutoSelectAppSuggestion', this, { suggestion: suggestion });
                    this.handleSuggestionItemSelected(event);
                }.bind(this));
            }
        },*/

        onsapenter: function (event) {
            if (!(this._oSuggestionPopup && this._oSuggestionPopup.isOpen() && this._oSuggPopover._iPopupListSelectedIndex >= 0)) {
                // check that enter happened in search input box and not on a suggestion item
                // enter on a suggestion is not handled in onsapenter but in handleSuggestionItemSelected
                this.getModel().invalidateQuery();
                this.triggerSearch(event);
            }
            sap.m.Input.prototype.onsapenter.apply(this, arguments);
        },

        triggerSearch: function (oEvent) {
            var that = this;

            // The footer is rerendered after each search in stand alone UI -> error popover losts parent and jumps to the screen top. 
            // solution: if the error popover shows, set footer invisible before next search.
            // popover.close() is not working. It is closed after footer invisible, so it still jumps
            var footer = sap.ui.getCore().byId(that.getModel().getProperty("/errorPopoverControlId"));
            if (that.getModel().getProperty("/errors").length > 0 && footer && footer.getVisible()) {
                footer.setVisible(false);
            }

            SearchHelper.subscribeOnlyOnce('triggerSearch', 'allSearchFinished', function () {
                that.getModel().autoStartApp();
            }, that);
            var searchBoxTerm = that.getValue();
            if (searchBoxTerm.trim() === '') {
                searchBoxTerm = '*';
            }
            that.getModel().setSearchBoxTerm(searchBoxTerm, false);
            that.navigateToSearchApp();
            that.destroySuggestionRows();
            that.getModel().abortSuggestions();
        },

        handleLiveChange: function (oEvent) {

            // ugly modifiaction: headers and busy indicator in suggestions shall not be selectable
            this._oSuggPopover._isSuggestionItemSelectable = function (item) {
                var suggestion = item.getBindingContext().getObject();
                if (suggestion.uiSuggestionType === SuggestionType.Header ||
                    suggestion.uiSuggestionType === SuggestionType.BusyIndicator) {
                    return false;
                }
                return true;
            };

            var suggestTerm = this.getValue();
            var oModel = this.getModel();
            oModel.setSearchBoxTerm(suggestTerm, false);
            if (oModel.getSearchBoxTerm().length > 0) {
                oModel.doSuggestion();
            } else {
                this.destroySuggestionRows();
                oModel.abortSuggestions();
            }
        },

        handleSuggestionItemSelected: function (oEvent) {

            var oModel = this.getModel();
            var searchBoxTerm = oModel.getSearchBoxTerm();
            var suggestion;
            if (oEvent.getId() === "AutoSelectAppSuggestion") {
                suggestion = oEvent.getParameter("suggestion");
            } else {
                suggestion = oEvent.getParameter("selectedRow").getBindingContext().getObject();
            }

            var suggestionTerm = suggestion.searchTerm || "";
            var dataSource = suggestion.dataSource || oModel.getDataSource();
            var targetURL = suggestion.url;
            var type = suggestion.uiSuggestionType;

            oModel.eventLogger.logEvent({
                type: oModel.eventLogger.SUGGESTION_SELECT,
                suggestionType: type,
                suggestionTerm: suggestionTerm,
                searchTerm: searchBoxTerm,
                targetUrl: targetURL,
                dataSourceKey: dataSource ? dataSource.id : ""
            });

            // remove any selection
            this.selectText(0, 0);

            switch (type) {
            case SuggestionType.App:
                // app suggestions -> start app

                // starting the app by hash change closes the suggestion popup
                // closing the suggestion popup again triggers the suggestion item selected event
                // in order to avoid to receive the event twice the suggestions are destroyed
                this.destroySuggestionRows();
                oModel.abortSuggestions();

                if (targetURL[0] === "#") {
                    if (targetURL.indexOf("#Action-search") === 0 && targetURL === decodeURIComponent(SearchHelper.getHashFromUrl())) {
                        // ugly workaround
                        // in case the app suggestion points to the search app with query identical to current query
                        // --> do noting except: restore query term + focus again the first item in the result list
                        oModel.setSearchBoxTerm(oModel.getLastSearchTerm(), false);
                        sap.ui.getCore().getEventBus().publish("allSearchFinished");
                        return;
                    }
                    if (window.hasher) {
                        window.hasher.setHash(targetURL);
                    } else {
                        window.location.href = targetURL;
                    }
                } else {
                    // special logging: only for urls started via suggestions
                    // (apps/urls started via click ontile have logger in tile click handler)
                    var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                    if (bLogRecentActivity) {
                        var oRecentEntry = {
                            title: suggestion.title,
                            appType: AppType.URL,
                            url: suggestion.url,
                            appId: suggestion.url
                        };
                        sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                    }

                    window.open(targetURL, "_blank");
                    oModel.setSearchBoxTerm("", false);
                    this.setValue("");
                }

                // close the search field if suggestion is not search app
                if (targetURL.indexOf('#Action-search') !== 0) {
                    sap.ui.require("sap/ushell/renderers/fiori2/search/SearchShellHelper").setSearchState('COL');
                } else {
                    this.focus();
                }
                break;
            case SuggestionType.DataSource:
                // data source suggestions
                // -> change datasource in dropdown
                // -> do not start search
                oModel.setDataSource(dataSource, false);
                oModel.setSearchBoxTerm('', false);
                this.setValue('');
                this.focus();
                break;
            case SuggestionType.SearchTermData:
                // object data suggestion
                // -> change search term + change datasource + start search
                oModel.setDataSource(dataSource, false);
                oModel.setSearchBoxTerm(suggestionTerm, false);
                this.getModel().invalidateQuery();
                this.navigateToSearchApp();
                this.setValue(suggestionTerm);
                break;
            case SuggestionType.SearchTermHistory:
                // history
                // -> change search term + change datasource + start search
                oModel.setDataSource(dataSource, false);
                oModel.setSearchBoxTerm(suggestionTerm, false);
                this.getModel().invalidateQuery();
                this.navigateToSearchApp();
                this.setValue(suggestionTerm);
                break;
            case SuggestionType.Object:
                // object
                if (suggestion.titleNavigation) {
                    suggestion.titleNavigation.performNavigation();
                }
                break;
            default:
                break;
            }
        },

        suggestionItemFactory: function (sId, oContext) {
            var suggestion = oContext.getObject();
            switch (suggestion.uiSuggestionType) {
            case SuggestionType.Object:
                return this.objectSuggestionItemFactory(sId, oContext);
            case SuggestionType.Header:
                return this.headerSuggestionItemFactory(sId, oContext);
            case SuggestionType.BusyIndicator:
                return this.busyIndicatorItemFactory(sId, oContext);
            default:
                return this.regularSuggestionItemFactory(sId, oContext);
            }
        },

        busyIndicatorItemFactory: function (sId, oContext) {

            var cell = new VerticalLayout({
                content: [new sap.m.BusyIndicator({
                    size: '0.6rem'
                })]
            });
            cell.getText = function () {
                return this.getValue();
            }.bind(this);

            var listItem = new sap.m.ColumnListItem({
                cells: [cell],
                type: "Active"
            });
            listItem.addStyleClass('searchSuggestion');
            listItem.addStyleClass('searchBusyIndicatorSuggestion');
            return listItem;
        },

        headerSuggestionItemFactory: function (sId, oContext) {

            var label = new sap.m.Label({
                text: '{label}'
            });

            var cell = new VerticalLayout({
                content: [label]
            });
            cell.getText = function () {
                return this.getValue();
            }.bind(this);


            var listItem = new sap.m.ColumnListItem({
                cells: [cell],
                type: "Active"
            });
            listItem.addStyleClass('searchSuggestion');
            listItem.addStyleClass('searchHeaderSuggestion');
            return listItem;

        },

        assembleObjectSuggestionLabels: function (suggestion) {

            // first line: label 1
            var labels = [];
            var label1 = new sap.m.Label({
                text: "{label1}"
            });
            label1.addEventDelegate({
                onAfterRendering: function () {
                    SearchHelper.boldTagUnescaper(this.getDomRef());
                }
            }, label1);
            label1.addStyleClass('sapUshellSearchObjectSuggestion-Label1');
            labels.push(label1);

            // second line: label 2
            if (suggestion.label2) {
                var label2 = new sap.m.Label({
                    text: "{label2}"
                });
                label2.addEventDelegate({
                    onAfterRendering: function () {
                        SearchHelper.boldTagUnescaper(this.getDomRef());
                    }
                }, label2);
                label2.addStyleClass('sapUshellSearchObjectSuggestion-Label2');
                labels.push(label2);
            }

            var vLayout = new VerticalLayout({
                content: labels
            });
            vLayout.addStyleClass('sapUshellSearchObjectSuggestion-Labels');
            return vLayout;
        },

        objectSuggestionItemFactory: function (sId, oContext) {

            var suggestion = oContext.getObject();
            var suggestionParts = [];

            // image
            if (suggestion.imageExists) {
                suggestionParts.push(new SearchObjectSuggestionImage({
                    src: "{imageUrl}",
                    isCircular: "{imageIsCircular}"
                }));
            }

            // labels
            suggestionParts.push(this.assembleObjectSuggestionLabels(suggestion));

            // combine image and labels
            var cell = new HorizontalLayout({
                content: suggestionParts
            });
            cell.addStyleClass('sapUshellSearchObjectSuggestion-Container');
            cell.getText = function () {
                return this.getValue();
            }.bind(this);

            // suggestion list item
            var listItem = new sap.m.ColumnListItem({
                cells: [cell],
                type: "Active"
            });
            listItem.addStyleClass('searchSuggestion');
            listItem.addStyleClass('searchObjectSuggestion');
            return listItem;
        },

        regularSuggestionItemFactory: function (sId, oContext) {

            var that = this;

            // for app suggestions: icon 
            var icon = new sap.ui.core.Icon({
                src: "{icon}"
            }).addStyleClass('suggestIcon').addStyleClass('sapUshellSearchSuggestAppIcon').addStyleClass('suggestListItemCell');

            // label
            var label = new sap.m.Text({
                text: "{label}",
                layoutData: new sap.m.FlexItemData({
                    shrinkFactor: 1,
                    minWidth: "4rem"
                }),
                wrapping: false
            }).addStyleClass('suggestText').addStyleClass('suggestNavItem').addStyleClass('suggestListItemCell');
            label.addEventDelegate({
                onAfterRendering: function () {
                    SearchHelper.boldTagUnescaper(this.getDomRef());
                }
            }, label);

            // combine app, icon and label into cell
            var cell = new sap.m.CustomListItem({
                type: sap.m.ListType.Active,
                content: new sap.m.FlexBox({
                    items: [icon, label]
                })
            });
            var suggestion = oContext.oModel.getProperty(oContext.sPath);
            cell.getText = function () {
                return (typeof suggestion.searchTerm) === 'string' ? suggestion.searchTerm : that.getValue();
            };
            var listItem = new sap.m.ColumnListItem({
                cells: [cell],
                type: "Active"
            });

            if (suggestion.uiSuggestionType === SuggestionType.App) {
                if (suggestion.title && suggestion.title.indexOf("combinedAppSuggestion") >= 0) {
                    listItem.addStyleClass('searchCombinedAppSuggestion');
                } else {
                    listItem.addStyleClass('searchAppSuggestion');
                }
            }
            if (suggestion.uiSuggestionType === SuggestionType.DataSource) {
                listItem.addStyleClass('searchDataSourceSuggestion');
            }
            if (suggestion.uiSuggestionType === SuggestionType.SearchTermData) {
                listItem.addStyleClass('searchBOSuggestion');
            }
            if (suggestion.uiSuggestionType === SuggestionType.SearchTermHistory) {
                listItem.addStyleClass('searchHistorySuggestion');
            }
            listItem.addStyleClass('searchSuggestion');

            listItem.addEventDelegate({
                onAfterRendering: function (e) {
                    var cells = listItem.$().find('.suggestListItemCell');
                    var totalWidth = 0;
                    cells.each(function (index) {
                        totalWidth += $(this).outerWidth(true);
                    });
                    if (totalWidth > listItem.$().find('li').get(0).scrollWidth) { // is truncated
                        listItem.setTooltip($(cells[0]).text() + " " + $(cells[2]).text());
                    }
                }
            });
            return listItem;
        },

        navigateToSearchApp: function () {

            if (SearchHelper.isSearchAppActive()) {
                // app running -> just fire query
                this.getModel()._firePerspectiveQuery();
            } else {
                // app not running -> start via hash
                // change hash:
                // -do not use Searchhelper.hasher here
                // -this is starting the search app from outside
                var sHash = this.getModel().renderSearchURL();
                window.location.hash = sHash;
            }

        },

        getAriaDescriptionIdForNoResults: function () {
            return this._ariaDescriptionIdNoResults;
        },

        onAfterRendering: function (oEvent) {
            var $input = $(this.getDomRef()).find("#searchFieldInShell-input-inner");
            $(this.getDomRef()).find('input').attr('autocomplete', 'off');
            $(this.getDomRef()).find('input').attr('autocorrect', 'off');
            // additional hacks to show the "search" button on ios keyboards:
            $(this.getDomRef()).find('input').attr('type', 'search');
            $(this.getDomRef()).find('input').attr('name', 'search');
            //var $form = jQuery('<form action="" onsubmit="return false;"></form>');
            var $form = jQuery('<form action=""></form>').on("submit", function () {
                return false;
            });
            $(this.getDomRef()).children('input').parent().append($form);
            $(this.getDomRef()).children('input').detach().appendTo($form);
            // end of iOS hacks
            $input.attr("aria-describedby", $input.attr("aria-describedby") + " " + this._ariaDescriptionIdNoResults);
        },

        onValueRevertedByEscape: function (sValue) {
            // this method is called if ESC was pressed and
            // the value in it was not empty
            if (SearchHelper.isSearchAppActive()) {
                // dont delete the value if search app is active
                return;
            }
            this.setValue(" "); // add space as a marker for following ESC handler
        }


    });

});
