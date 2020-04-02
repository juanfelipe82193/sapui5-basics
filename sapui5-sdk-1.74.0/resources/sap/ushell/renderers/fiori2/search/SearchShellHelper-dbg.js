// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
// iteration 0 ok test
/* global jQuery, sap, window, document */

// var SearchModelName = 'sap/ushell/renderers/fiori2/search/SearchModel';

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/controls/SearchFieldGroup',
    'sap/ushell/renderers/fiori2/search/SearchHelper',
    'sap/base/Log'
    //SearchModelName
    // 'sap/ushell/renderers/fiori2/search/SearchModel' /* circular dependency */
], function (SearchFieldGroup, SearchHelper, Log) {
    "use strict";

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.SearchShellHelper');
    var module = sap.ushell.renderers.fiori2.search.SearchShellHelper = {};

    var sSearchOverlayCSS = "sapUshellShellShowSearchOverlay";

    // Helper method for injecting SearchModel module from
    // SearchShellHelperAndModuleLoader
    var SearchModel;
    module.injectSearchModel = function (_SearchModel) {
        SearchModel = SearchModel || _SearchModel;
    };

    jQuery.extend(module, {

        init: function () {
            var that = this;

            // pre-fetch all app tiles
            sap.ushell.Container.getService("Search").prefetch();

            // get search model
            sap.ui.require('sap/ushell/renderers/fiori2/search/SearchModel');
            that.oModel = sap.ushell.renderers.fiori2.search.getModelSingleton();

            // get shell header
            that.oShellHeader = sap.ui.getCore().byId('shell-header');

            // create search field group control
            that.oSearchFieldGroup = new SearchFieldGroup("searchFieldInShell");
            that.oSearchFieldGroup.setModel(that.oModel);
            that.oShellHeader.setSearch(that.oSearchFieldGroup);
            that.setSearchState('COL');

            // delayed decorator for setSearchState method
            this.setSearchStateSync = this.setSearchState;
            this.setSearchState = SearchHelper.delayedExecution(this.setSearchState, 500);

            // initialize search input
            that.oSearchInput = that.oSearchFieldGroup.input;
            that.oSearchInput.setMaxSuggestionWidth("30rem");
            that.oSearchInput.setValue(that.oModel.getSearchBoxTerm());

            // initialize search select
            that.oSearchSelect = that.oSearchFieldGroup.select;

            var oLabel = new sap.ui.core.InvisibleText("selectLabel", {
                text: sap.ushell.resources.i18n.getText("searchIn")
            });
            if (oLabel) {
                // avoid grunt error: "oLabel" is defined but never used
                that.oSearchSelect.addAriaLabelledBy("selectLabel");
            }
            that.oSearchSelect.setTooltip(sap.ushell.resources.i18n.getText("searchInTooltip"));

            that.oSearchSelect.addEventDelegate({
                onAfterRendering: function (oEvent) {
                    jQuery('#searchFieldInShell-select-icon').attr('title', sap.ushell.resources.i18n.getText("searchIn"));
                }
            }, that.oSearchSelect);
            that.oSearchSelect.setTooltip(sap.ushell.resources.i18n.getText("searchIn"));
            that.oSearchSelect.attachChange(function (event) {
                that.focusInputField({
                    selectContent: true
                });
            });

            // initialize search button
            that.oSearchButton = that.oSearchFieldGroup.button;
            that.oSearchButton.bindProperty("type", {
                parts: [{
                    path: '/searchButtonStatus'
                }],
                formatter: function (searchButtonStatus) {
                    if (searchButtonStatus === 'search') {
                        return sap.m.ButtonType.Emphasized;
                    }
                    return sap.m.ButtonType.Default;

                }
            });
            that.oSearchButton.attachPress(function () {
                that.handleClickSearchButton();
            });
            that.oSearchButton.addEventDelegate({
                onAfterRendering: function () {
                    var searchIsOpen = jQuery("div.sapUshellShellSearchHidden").length === 0;
                    var buttonIsToggle = that.oModel.getProperty("/searchButtonStatus") === "close";
                    var $button = jQuery(that.oSearchButton.getDomRef());
                    if (searchIsOpen) {
                        if (buttonIsToggle) {
                            $button.attr("aria-pressed", true);
                        } else {
                            $button.removeAttr("aria-pressed");
                        }
                    } else {
                        $button.attr("aria-pressed", false);
                    }
                }
            });

            // initialize cancel button
            that.oSearchCancelButton = that.oSearchFieldGroup.cancelButton;
            that.oSearchCancelButton.attachPress(function () {
                that.setSearchState('COL');
                window.setTimeout(function () {
                    sap.ui.getCore().byId('sf').focus();
                }, 1000);
            });
            this.oSearchFieldGroup.setCancelButtonActive(false);
            //this.sizeChanged(sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD));

            // add focus listener to search field group
            that.registerFocusHandler();

            // esc key handle
            jQuery(document).on('keydown', function (oEvent) {
                if (oEvent.keyCode === 27) {
                    oEvent.preventDefault(); // browser would delete value
                    if (SearchHelper.isSearchAppActive()) {
                        return;
                    }
                    if (that.oSearchInput) {
                        if (that.oSearchInput.getValue() === "") {
                            that.setSearchState('COL');
                            window.setTimeout(function () {
                                sap.ui.getCore().byId('sf').focus();
                            }, 1000);
                        } else if (that.oSearchInput.getValue() === " ") {
                            that.oSearchInput.setValue("");
                        }
                    }
                }
            });

            // register for global events
            sap.ui.getCore().getEventBus().subscribe("shell", "searchCompLoaded", that.onSearchComponentLoaded, that);
            sap.ui.getCore().getEventBus().subscribe("allSearchFinished", that.onAllSearchFinished, that);
            sap.ui.getCore().byId('viewPortContainer').attachAfterNavigate(that.onAfterNavigate, that);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", function () {
                var oSearchView = sap.ui.getCore().byId('searchContainerResultsView');
                if (oSearchView && oSearchView.oFocusHandler) {
                    oSearchView.oFocusHandler.setFocus();
                }
            });
            //sap.ui.Device.media.attachHandler(this.sizeChanged, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
            //window.addEventListener('resize', this.sizeChanged.bind(this));
            that.oShellHeader.attachSearchSizeChanged(this.sizeSearchFieldChanged.bind(this));
        },

        sizeSearchFieldChanged: function (event) {
            var size = event.mParameters.remSize;
            // display mode of connector dropdown
            var limit = 24;
            if (size <= limit) {
                this.oSearchSelect.setDisplayMode('icon');
            } else {
                this.oSearchSelect.setDisplayMode('default');
            }
            // visibility of search button
            limit = 9;
            if (size < limit) {
                this.oSearchButton.setVisible(false);
            } else {
                this.oSearchButton.setVisible(true);
            }
            // cancel button
            if (event.getParameter('isFullWidth')) {
                this.oSearchFieldGroup.setCancelButtonActive(true);
                this.oSearchFieldGroup.addStyleClass('sapUshellSearchInputFullWidth');
            } else {
                this.oSearchFieldGroup.setCancelButtonActive(false);
                this.oSearchFieldGroup.removeStyleClass('sapUshellSearchInputFullWidth');
            }
        },

        sizeChanged: function (params) {
            switch (params.name) {
            case "Phone":
                this.oSearchFieldGroup.setCancelButtonActive(true);
                break;
            case "Tablet":
                this.oSearchFieldGroup.setCancelButtonActive(false);
                break;
            case "Desktop":
                this.oSearchFieldGroup.setCancelButtonActive(false);
                break;
            default:
                break;
            }
        },

        registerFocusHandler: function () {

            // debug
            var register = true;
            if (!register) {
                return;
            }

            var that = this;
            var model = that.oSearchInput.getModel();

            // be careful event handlers for controls are slightly different!

            that.oSearchInput.addEventDelegate({

                onAfterRendering: function () {
                    var input = jQuery(that.oSearchInput.getDomRef()).find('input')[0];
                    var $input = jQuery(input);
                    $input.on('focus', function (event) {
                        that.log('raw_in', document.activeElement);
                        if (!that.isFocusHandlerActive) {
                            return;
                        }
                        that.setSearchState('EXP');
                    });
                    $input.on('blur', function (event) {
                        that.log('raw_out', document.activeElement);
                        if (!that.isFocusHandlerActive) {
                            return;
                        }
                        var picker = that.oSearchSelect.getPicker();
                        if (picker && picker.oPopup && picker.oPopup.eOpenState === "OPENING") {
                            return;
                        }
                        if (!SearchHelper.isSearchAppActive() && that.oSearchInput.getValue().length === 0 && model.getDataSource() === model.getDefaultDataSource()) {
                            that.setSearchState('COL');
                        } else {
                            that.setSearchState('EXP_S');
                        }
                    });
                }
            });

            that.oSearchSelect.addEventDelegate({
                onAfterRendering: function () {
                    var domRef = that.oSearchSelect.getDomRef();
                    domRef.addEventListener('focus', function (event) {
                        that.log('raw_in_select', document.activeElement);
                        if (!that.isFocusHandlerActive) {
                            return;
                        }
                        if (that.oShellHeader.getSearchState() === 'EXP_S' && !that.isNoSearchResultsScreen()) {
                            that.setSearchState('EXP_S', true);
                            return;
                        }
                        that.setSearchState.abort();
                    });
                    domRef.addEventListener('blur', function (event) {
                        that.log('raw_out_select', document.activeElement);
                        if (!that.isFocusHandlerActive) {
                            return;
                        }
                        var picker = that.oSearchSelect.getPicker();
                        if (picker && picker.oPopup && picker.oPopup.eOpenState === "OPENING") {
                            return;
                        }
                        if (!SearchHelper.isSearchAppActive() && that.oSearchInput.getValue().length === 0 && model.getDataSource() === model.getDefaultDataSource()) {
                            that.setSearchState('COL');
                        } else {
                            that.setSearchState('EXP_S');
                        }
                    });
                }
            });

            that.oSearchButton.addEventDelegate({
                onAfterRendering: function () {
                    var domRef = that.oSearchButton.getDomRef();
                    domRef.addEventListener('focus', function (event) {
                        that.log('raw_in_button', document.activeElement);
                        if (!that.isFocusHandlerActive) {
                            return;
                        }
                        that.setSearchState.abort();
                    });
                    domRef.addEventListener('blur', function (event) {
                        that.log('raw_out_button', document.activeElement);
                        if (!that.isFocusHandlerActive) {
                            return;
                        }
                        if (!SearchHelper.isSearchAppActive() && that.oSearchInput.getValue().length === 0 && model.getDataSource() === model.getDefaultDataSource()) {
                            that.setSearchState('COL');
                        } else {
                            that.setSearchState('EXP_S');
                        }
                    });
                }
            });

            this.enableFocusHandler(true);

        },

        enableFocusHandler: function (active) {
            this.isFocusHandlerActive = active;
            if (!active && this.setSearchState.abort) {
                this.setSearchState.abort();
            }
        },

        isOverlayShown: function () {
            var shellLayout = this.oShellHeader.getShellLayoutControl();
            return shellLayout.hasStyleClass(sSearchOverlayCSS);
        },

        setSearchState: function (state, showOverlay) {
            var searchButton = sap.ui.getCore().byId('sf');
            if (!searchButton) {
                return; // setSearchState will be called again after the search button is created
            }

            if (typeof showOverlay === 'undefined') {
                switch (state) {
                case 'EXP':
                    showOverlay = true;
                    break;
                case 'EXP_S':
                    showOverlay = false;
                    break;
                case 'COL':
                    showOverlay = false;
                    break;
                }
                if (this.isNoSearchResultsScreen()) {
                    showOverlay = false;
                }
            }

            if (sap.ui.getCore().byId('searchFieldInShell') === undefined) {
                return;
            }
            if (this.oShellHeader.getSearchState() === state && showOverlay === this.isOverlayShown()) {
                return;
            }
            if (state === 'COL') {
                this.enableFocusHandler(false);
            } else {
                this.enableFocusHandler(true);
            }
            this.log('set search state', state, document.activeElement);

            switch (state) {
            case 'COL':
                this.oModel.abortSuggestions();
                this.oShellHeader.setSearchState(state, 35, showOverlay);
                this.oSearchCancelButton.setVisible(false);
                searchButton.setVisible(true);
                break;
            case 'EXP_S':
                //this.oModel.abortSuggestions(); // - leads to open empty suggestions in case
                //   focus moves out from browser window
                // - not necessary because suggestions have
                //   own focus out handler
                this.oShellHeader.setSearchState(state, 35, showOverlay);
                this.oSearchCancelButton.setVisible(true);
                searchButton.setVisible(false);
                break;
            case 'EXP':
                this.oShellHeader.setSearchState(state, 35, showOverlay);
                this.oSearchCancelButton.setVisible(true);
                searchButton.setVisible(false);
                this.focusInputField({
                    selectContent: false
                });
                break;
            default:
                break;
            }
        },

        isNoSearchResultsScreen: function () {
            return SearchHelper.isSearchAppActive() && this.oModel.getProperty("/boCount") === 0 && this.oModel.getProperty("/appCount") === 0;
        },

        onShellSearchButtonPressed: function (event) {
            if (sap.ui.getCore().byId('searchFieldInShell') === undefined) {
                this.init();
            } else if (!SearchHelper.isSearchAppActive() && this.oShellHeader.getSearchState() === 'COL') {
                this.resetModel();
            }
            this.setSearchState('EXP');
        },

        handleClickSearchButton: function () {

            if (this.oSearchInput.getValue() === "" &&
                this.oModel.getDataSource() === this.oModel.getDefaultDataSource()) {

                this.setSearchState('COL');
                window.setTimeout(function () {
                    sap.ui.getCore().byId('sf').focus();
                }, 1000);

            }
        },

        focusInputField: function (options) {
            options = options || {};
            var that = this;

            if (that.focusInputFieldTimeout) {
                window.clearTimeout(that.focusInputFieldTimeout);
                that.focusInputFieldTimeout = null;
            }

            var doFocus = function (retry) {
                if (!that.oSearchInput) {
                    return;
                }
                that.focusInputFieldTimeout = null;
                var domRef = that.oSearchInput.getDomRef();
                if (domRef && jQuery(domRef).is(':visible') && !sap.ui.getCore().getUIDirty()) {
                    if (that.oSearchInput.getEnabled()) {
                        that.oSearchInput.focus();
                        if (options.selectContent) {
                            that.oSearchInput.selectText(0, 9999);
                        }
                        return;
                    }
                }
                if (retry > 0) {
                    that.focusInputFieldTimeout = window.setTimeout(function () {
                        if (!that.oModel.getProperty('/initializingObjSearch')) {
                            retry--;
                        }
                        doFocus(retry);
                    }, 100);
                }
            };

            doFocus(10);

        },

        getDefaultOpen: function () {
            return this.defaultOpen;
        },

        setDefaultOpen: function (defaultOpen) {
            this.defaultOpen = defaultOpen;
        },

        getSearchInput: function () {
            return this.oSearchFieldGroup ? this.oSearchFieldGroup.input : null;
        },

        onAfterNavigate: function (oEvent) {
            // navigation tries to restore the focus -> but application knows better how to set the focus
            // -> after navigation call focus setter of search application
            if (oEvent.getParameter('toId') !== 'shellPage-Action-search' &&
                oEvent.getParameter('toId') !== 'applicationShellPage-Action-search' &&
                oEvent.getParameter('toId') !== 'application-Action-search') {
                return;
            }
            var oSearchView = sap.ui.getCore().byId('searchContainerResultsView');
            if (oSearchView && oSearchView.oFocusHandler) {
                oSearchView.oFocusHandler.setFocus();
            }
            sap.ui.getCore().getEventBus().publish("searchLayoutChanged");
        },

        onAllSearchFinished: function () {
            this.oSearchInput.setValue(this.oModel.getSearchBoxTerm());
            this.log('search finished');
            this.setSearchState('EXP_S');
        },

        onSearchComponentLoaded: function () {
            // triggered by shell after search component is loaded     
            // (search field is created in search component)
            if (!SearchHelper.isSearchAppActive()) {
                return;
            }
            this.setSearchState('EXP_S');
        },

        resetModel: function () {
            this.oSearchInput.setValue('');
            this.oModel.resetQuery();
        },

        logSwitch: true,

        log: function () {

            if (!this.logSwitch) {
                return;
            }

            var logId = function (element) {
                var id = element.getAttribute('id');
                if (id) {
                    return id;
                }
                return 'unknown_id';

            };

            var logClassList = function (element) {
                var result = [];
                for (var i = 0; i < element.classList.length; ++i) {
                    result.push(element.classList.item(i));
                }
                return result.join(',');
            };

            var parts = ['xx'];
            for (var i = 0; i < arguments.length; ++i) {
                var arg = arguments[i];
                if (arg && arg.getAttribute) {
                    parts.push(logId(arg) + ',' + logClassList(arg));
                    continue;
                }
                if (arg) {
                    parts.push(arg);
                    continue;
                }
                parts.push('undef');
            }

            Log.debug(parts.join(' | '), undefined, "sap.ushell.renderers.fiori2.search.SearchShellHelper");
        }

    });

    return module;
});
