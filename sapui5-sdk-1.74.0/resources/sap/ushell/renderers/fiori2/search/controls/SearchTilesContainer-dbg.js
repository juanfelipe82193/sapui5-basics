// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */
sap.ui.define([
    'sap/ushell/renderers/fiori2/search/controls/SearchTilesContainerKeyHandler',
    'sap/ushell/renderers/fiori2/search/controls/SearchTileHighlighter',
    'sap/ushell/renderers/fiori2/search/controls/SearchResultList',
    'sap/m/Button',
    'sap/ushell/Config'
], function (KeyHandler, TileHighlighter, SearchResultList, Button, Config) {
    "use strict";

    // =======================================================================
    // Tiles Container
    // =======================================================================
    sap.ui.core.Control.extend('sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer', {

        // metadata
        // ===================================================================
        metadata: {
            properties: {
                'totalLength': {
                    type: 'int',
                    defaultValue: 0
                },
                'maxRows': {
                    type: 'int',
                    defaultValue: 1
                },
                'highlightTerms': {
                    type: 'string',
                    defaultValue: ''
                },
                'enableKeyHandler': {
                    type: 'boolean',
                    defaultValue: true
                },
                'resultList': {
                    type: 'sap.ushell.renderers.fiori2.search.controls.SearchResultList'
                },
                'addAccInformation': {
                    type: 'boolean',
                    defaultValue: false
                }
            },
            aggregations: {
                'tiles': {
                    type: 'sap.ui.core.Control',
                    multiple: true
                }
            },
            events: {
                showMore: {}
            }
        },

        PHONE_SIZE_STYLE: 'sapMTileSmallPhone',

        // constructor
        // ===================================================================
        constructor: function () {
            sap.ui.core.Control.prototype.constructor.apply(this, arguments);
            if (this.getEnableKeyHandler()) {
                this.addEventDelegate(new KeyHandler(this));
            }
            this.tileHighlighter = new TileHighlighter();
            this._previousTabHandler = {
                onsaptabprevious: function (oEvent) {
                    // Properly handle shift-tab events.
                    // See sap.m.ListItemBase.onsaptabprevious for further info.
                    var thisControl;
                    if (jQuery(this.control.getDomRef()).prop("tagName").toLowerCase() === "button") {
                        thisControl = this.control.getDomRef();
                    } else {
                        var buttonChildren = jQuery(this.control.getDomRef()).find("[role='option']");
                        if (buttonChildren.length > 0) {
                            thisControl = buttonChildren[0];
                        }
                    }
                    if (oEvent.isMarked() || !thisControl || oEvent.target !== thisControl) {
                        return;
                    }
                    this.resultList.forwardTab(false);
                    oEvent.setMarked();
                }
            };
        },

        // init
        // ===================================================================
        init: function () {
            sap.ui.core.Control.prototype.init.apply(this, arguments);
            sap.ui.getCore().getEventBus().subscribe('searchLayoutChanged', this.delayedRerender, this);
            this.sizeBehaviorDoable = Config.on("/core/home/sizeBehavior").do(function () {
                this.delayedRerender();
            }.bind(this));
        },

        // exit
        // ===================================================================
        exit: function () {
            sap.ui.getCore().getEventBus().unsubscribe('searchLayoutChanged', this.delayedRerender, this);
            this.sizeBehaviorDoable.off();
            sap.ui.core.Control.prototype.exit.apply(this, arguments);
        },

        // setter for highlight terms
        // ===================================================================
        setHighlightTerms: function (sTermsToHighlight) {
            // suppress rerendering since highlighting will be done
            // during _onAfterRendering()
            this.setProperty('highlightTerms', sTermsToHighlight, true);
        },

        // delayed rerender
        // ===================================================================
        delayedRerender: function () {
            var that = this;
            setTimeout(function () {
                that.rerender();
            }, 0);
        },

        // renderer
        // ===================================================================
        renderer: function (oRm, oControl) {

            // do we have tiles?
            var apps = oControl.getModel().getProperty("/appResults");
            if (!apps || apps.length === 0) {
                return;
            }

            // render start of tile container
            oRm.write('<div');
            oRm.writeControlData(oControl);
            oRm.addClass('sapUshellSearchTileContainer');
            oRm.writeClasses();
            //oRm.writeAttribute('role', 'listbox');
            oRm.write('>');

            // render tiles
            oControl.renderTiles(oRm, oControl);

            // render end of tile container
            oRm.write('</div>');
        },

        // process usage analytics
        // ===================================================================
        logUsageAnalytics: function (tile) {
            var innerTile,
                model,
                content;

            if (tile.attachPress) {
                tile.attachPress(function () {
                    model = sap.ushell.renderers.fiori2.search.getModelSingleton();
                    model.eventLogger.logEvent({
                        type: model.eventLogger.TILE_NAVIGATE,
                        tileTitle: tile.eventLoggingData.title,
                        targetUrl: tile.eventLoggingData.targetUrl
                    });
                });
                return;
            }
            if (tile && tile.getContent) {
                content = tile.getContent();
                if (content.length !== 1) {
                    return;
                }
                innerTile = content[0];
                if (!innerTile.attachPress) {
                    return;
                }
                innerTile.attachPress(function () {
                    model = sap.ushell.renderers.fiori2.search.getModelSingleton();
                    model.eventLogger.logEvent({
                        type: model.eventLogger.TILE_NAVIGATE,
                        tileTitle: tile.eventLoggingData.title,
                        targetUrl: tile.eventLoggingData.targetUrl
                    });
                });
            }
        },

        // render tiles
        // It is not possible to call async function getTileViewsAsync in bindAggregation.
        // Thus control doesn't have aggregation property.
        // It gets apps data from searchModel and then getTileViewsAsync every time it renders.
        // ===================================================================
        renderTiles: function (oRm, oControl) {

            var tiles = oControl.getTiles();

            // render tileViews
            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];

                oControl.logUsageAnalytics(tile);
                oControl.registerAfterRenderingForTile(tile);
                oRm.write('<div');
                oRm.addClass('sapUshellSearchTileWrapper');

                oRm.writeClasses();
                //oRm.writeAttribute("title", sap.ushell.resources.i18n.getText("launchTile_tooltip"));
                //oRm.writeAttribute("tabindex", 0);
                //oRm.writeAttribute('aria-label', 'tile'); // invisible
                oRm.write('>');
                oRm.renderControl(tile);
                oRm.write('</div>');

                tile.addEventDelegate(this._previousTabHandler, {
                    resultList: oControl.getResultList(),
                    control: tile
                });
            }

            oControl.renderPlusTile(oRm, oControl);
            oControl.tileHighlighter.setHighlightTerms(oControl.getHighlightTerms());
        },


        // render plus tile
        // ===================================================================
        renderPlusTile: function (oRm, oControl) {

            oRm.write('<div');
            oRm.addClass('sapUshellSearchTileWrapper');
            oRm.addClass('sapUshellSearchShowMoreTile');
            oRm.writeClasses();
            oRm.writeAttribute('style', 'display:none'); // invisible
            oRm.write('>');
            var button = new sap.m.Button({
                text: sap.ushell.resources.i18n.getText('showMoreApps'),
                //  styled: false,
                //  lite: true,
                tooltip: sap.ushell.resources.i18n.getText('showMoreApps'),
                press: function () {
                    oControl.fireShowMore();
                }
            });
            button.addEventDelegate(this._previousTabHandler, {
                resultList: oControl.getResultList(),
                control: button
            });
            button.addStyleClass('sapUshellSearchShowMoreTileButton');
            button.addStyleClass('sapMGT');
            button.addStyleClass('OneByOne');
            oRm.renderControl(button);
            oRm.write('</div>');

        },

        // after rendering
        // ===================================================================
        onAfterRendering: function (oEvent) {

            // limit size of tiles
            this.limitTileSize();

            // limit rows
            while (this.getNumberRows() > this.getMaxRows()) {
                this.removeLastTile();
            }

            // check whether plus tile is needed
            var container = this.getDomRef();
            var numberTiles = container.children.length - 1;
            if (this.getTotalLength() > numberTiles) {
                this.makePlusTileVisible();
                this.cutAtRow();
            } else {
                container.removeChild(container.children.item(container.children.length - 1));
            }

            // refresh tiles to update the content
            this.getModel().getProperty("/appResults").forEach(function (app) {
                // transaction doesn't have tile as property
                // refresh only catalog tiles
                if (app.tile && typeof app.tile.refresh === 'function') {
                    app.tile.refresh();
                }
            });

            // accessibility
            this.addAccessibilityInformation();
        },

        // add accessibility information
        // ===================================================================
        addAccessibilityInformation: function () {

            if (!this.getAddAccInformation()) {
                return;
            }

            var container = this.getDomRef();
            var children = container.children;
            for (var i = 0; i < children.length; ++i) {
                var child = children[i];
                var focusableChild = child.querySelector('[tabindex]');
                if (!focusableChild) {
                    focusableChild = child.querySelector('button');
                }
                if (!focusableChild) {
                    continue;
                }

                var ariaLabel = focusableChild.getAttribute('aria-label');
                if ((typeof ariaLabel) === 'string') {
                    focusableChild.setAttribute('aria-label', sap.ushell.resources.i18n.getText('tile') + ' ' + ariaLabel);
                }

                focusableChild.setAttribute('role', 'option');
                focusableChild.setAttribute('aria-posinset', i + 1);
                focusableChild.setAttribute('aria-setsize', children.length);
            }

        },

        // limit size of tiles
        // ===================================================================
        limitTileSize: function () {
            var isPhoneSize = this.isPhoneSize();
            var container = this.getDomRef();
            for (var i = 0; i < container.children.length; ++i) {
                var tile = container.children.item(i);

                // ensure that tile style classes are assigned
                if (!this.findElementByStyleClass(tile, 'sapMGT') || !this.findElementByStyleClass(tile, 'OneByOne')) {
                    tile.classList.add('sapMGT');
                    tile.classList.add('OneByOne');
                }

                // add phone size style if necessary
                if (isPhoneSize) {
                    var tileElement = this.findElementByStyleClass(tile, 'sapMGT');
                    if (tileElement) {
                        tileElement.classList.add(this.PHONE_SIZE_STYLE);
                    }
                }
            }
        },

        // check whether there is at least a single tile with phone size
        // ===================================================================
        isPhoneSize: function () {
            var container = this.getDomRef();
            for (var i = 0; i < container.children.length; ++i) {
                var tile = container.children.item(i);
                if (this.findElementByStyleClass(tile, this.PHONE_SIZE_STYLE)) {
                    return true;
                }
            }
            return false;
        },

        // check recursively for a style class
        // ===================================================================
        findElementByStyleClass: function (domElement, cls) {
            if (domElement.classList.contains(cls)) {
                return domElement;
            }
            // if we have a single child we assume that current domElement is a container
            // -> recurse into container
            if (domElement.children.length === 1) {
                return this.findElementByStyleClass(domElement.children.item(0), cls);
            }
            return false;
        },

        // return number of visible tiles (including show more)
        // ===================================================================
        getNumberDisplayedTiles: function () {
            var container = this.getDomRef();
            return container.children.length;
        },

        // after rendering for tiles
        // ===================================================================
        registerAfterRenderingForTile: function (tileView) {
            var that = this;
            if (tileView.searchTilesContainerAfterRenderingRegistered) {
                return;
            }
            tileView.addEventDelegate({
                onAfterRendering: function () {
                    // Change tiles in style twobyone or twothirds to onebyone(1x1)
                    // Note these are styles of sap.m.genericTile which is basis of ushell.ui.staticTile, it's the precondition
                    var oElemTwoByOne = tileView.getDomRef().querySelector(".TwoByOne", "TwoThirds");
                    if (oElemTwoByOne) {
                        oElemTwoByOne.classList.remove("TwoByOne", "TwoThirds");
                        oElemTwoByOne.classList.add("OneByOne");
                    }
                    that.tileHighlighter.highlight(tileView);
                }
            });
            tileView.searchTilesContainerAfterRenderingRegistered = true;
        },

        // make plus tile visible
        // ===================================================================
        makePlusTileVisible: function () {
            var container = this.getDomRef();
            var plusTile = container.children.item(container.children.length - 1);
            plusTile.style.display = 'inline-block';
        },

        // remove last tile
        // ===================================================================
        removeLastTile: function () {
            // last tile in container is always plus tile which may be visible or not:
            // index of last tile -> container.children.length - 2
            var container = this.getDomRef();
            var lastTile = container.children.item(container.children.length - 2);
            lastTile.parentNode.removeChild(lastTile);
        },

        // cut at row
        // ===================================================================
        cutAtRow: function () {
            var container = this.getDomRef();
            while (!this.isLastRowCompletelyFilled() || this.getNumberRows() > this.getMaxRows()) {
                if (container.children.length <= 2) {
                    break;
                }
                this.removeLastTile();
            }
        },

        // check whether last row is completely filled
        // ===================================================================
        isLastRowCompletelyFilled: function () {
            var container = this.getDomRef();
            var tpr = this.getTilesPerRow();
            var tileXPosition = -1;
            for (var i = 0; i < tpr; ++i) {
                var tileWrapper = container.children.item(container.children.length - 1 - i);
                if (tileWrapper.style.display === 'none') {
                    tpr++;
                    continue;
                }
                if (tileXPosition < 0) {
                    tileXPosition = tileWrapper.offsetLeft;
                    continue;
                }
                if (tileWrapper.offsetLeft > tileXPosition) {
                    return false;
                }
            }
            return true;
        },

        // get number of lines
        // ===================================================================
        getNumberRows: function () {
            var container = this.getDomRef();
            var tileXPosition = -1;
            var counter = 0;
            for (var i = 0; i < container.children.length - 1; ++i) {
                var tileWrapper = container.children.item(i);
                if (tileWrapper.style.display === 'none') {
                    continue;
                }
                if (tileXPosition < 0 || tileWrapper.offsetLeft <= tileXPosition) {
                    counter++;
                }
                tileXPosition = tileWrapper.offsetLeft;
            }
            return counter;
        },

        // get number tiles per lines
        // ===================================================================
        getTilesPerRow: function () {
            var container = this.getDomRef();
            var tileXPosition = -1;
            var counter = 0;
            for (var i = 0; i < container.children.length; ++i) {
                var tileWrapper = container.children.item(i);
                if (tileWrapper.style.display === 'none') {
                    continue;
                }
                if (tileWrapper.offsetLeft <= tileXPosition) {
                    return counter;
                }
                counter++;
                tileXPosition = tileWrapper.offsetLeft;
            }
            return counter;
        }

    });
});
