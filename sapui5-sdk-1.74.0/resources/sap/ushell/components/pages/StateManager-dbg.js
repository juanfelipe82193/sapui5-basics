// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview StateManager for pages runtime
 */
sap.ui.define([
], function () {
    "use strict";

    /**
     * The StateManager manages states(visibile/invisible, active/inactive, refresh) of all the visualizations in pages
     * runtime.
     *
     * When leaving a runtime page, the page should be set to invisible which means all the visualizations in it
     * should be set to inactive. When entering a runtime page, the page should be set to visible which means all
     * the visualizations in it should be set to active.
     */
    var StateManager = {};

    /**
     * Initializes StateManager.
     *
     * Adds event listeners to the following events:
     * - sap.ushell.navigated: a navigation event that is handled by shell.controller.js. E.g. navigation between appFinder
     *   or an application and the pages runtime.
     * - launchpad/setConnectionToServer: an event that is trigged by SessionHandler which indicates whether requests that
     *   are sent to the server should be stopped or continued.
     * - oPagesRuntimeNavContainer.navigate: the navigate event of oPagesRuntimeNavContainer, which is navigation
     *   between the error page and oPagesNavContainer
     * - oPagesNavContainer.navigate: the navigate event of oPagesNavContainer, which is navigation between runtime pages.
     * - document.visibilitychange: the tab switching event of a browser.
     *
     * @param {sap.m.NavContainer} pagesRuntimeNavContainer The UI5 navContainer that handles navigation between runtime
     * pages and the error page
     * @param {sap.m.NavContainer} pagesNavContainer The UI5 navContainer that handles navigation between runtime pages
     *
     * @private
     * @since 1.74.0
     */
    StateManager.init = function (pagesRuntimeNavContainer, pagesNavContainer) {
        this.oPagesRuntimeNavContainer = pagesRuntimeNavContainer;
        this.oPagesNavContainer = pagesNavContainer;
        this._oURLParsingService = sap.ushell.Container.getServiceAsync("URLParsing");

        // Add event handlers
        this.oPagesRuntimeNavContainer.attachNavigate(this._onErrorPageNavigated, this);
        this.oPagesNavContainer.attachNavigate(this._onPageNavigated, this);
        this._onTabNavigatedBind = this._onTabNavigated.bind(this);
        document.addEventListener("visibilitychange", this._onTabNavigatedBind);
        this.oEventBus = sap.ui.getCore().getEventBus();
        this.oEventBus.subscribe("launchpad", "setConnectionToServer", this._onEnableRequests, this);
        this.oEventBus.subscribe("sap.ushell", "navigated", this._onShellNavigated, this);
    };

    /**
     * The event handler of the event "launchpad/setConnectionToServer".
     *
     * @param {string} channel The channel name of the event
     * @param {string} event The name of the event
     * @param {object} data The data of the event
     *
     * @private
     * @since 1.74.0
     */
    StateManager._onEnableRequests = function (channel, event, data) {
        if (!data || data.active === undefined) {
            return;
        }
        this._setCurrentPageVisibility(data.active);
    };

    /**
     * Sets the visibility of the page that is displayed in the inner navContainer.
     *
     * @param {boolean} visibility The visibility of the current page
     * @param {boolean} refresh Indicates whether all the visualizations of the current page should be refreshed
     * @param {boolean} navFromErrorPage The navigation source is the error page
     *
     * @private
     * @since 1.72.0
     */
    StateManager._setCurrentPageVisibility = function (visibility, refresh, navFromErrorPage) {
        if (this.oPagesRuntimeNavContainer.getCurrentPage().isA("sap.m.MessagePage") && !navFromErrorPage) {
            return;
        }
        var oCurrentPage = this.oPagesNavContainer.getCurrentPage();
        this._setPageVisibility(oCurrentPage, visibility, refresh);
    };

    /**
     * Sets the tiles in the page to active or inactive according to the visibility of the page.
     *
     * @param {object} page A page
     * @param {boolean} visibility The visibility of a page
     * @param {boolean} refresh Indicates whether all the visualizations of the current page should be refreshed
     *
     * @private
     * @since 1.72.0
     */
    StateManager._setPageVisibility = function (page, visibility, refresh) {
        if (!page) {
            return;
        }
        this._visitVisualizations(page, function (visualization) {
            visualization.setActive(visibility, refresh);
        });
    };

    /**
     * Visits all the visualizations in the given runtime page, and executes the passed function on each visualization.
     *
     * @param {page} page A page
     * @param {function} fnVisitor The visit function
     *
     * @private
     * @since 1.72.0
     */
    StateManager._visitVisualizations = function (page, fnVisitor) {
        if (!fnVisitor) {
            return;
        }
        page.getContent()[0].getAggregation("sections").forEach(function (oSection) {
            oSection.getAggregation("visualizations").forEach(fnVisitor);
        });
    };

    /**
     * Handles the visibility of the current page in the inner navContainer. When an application or the app finder
     * is opened, sets the visibility of the current page to false.
     *
     * @returns {Promise} Resolves to an empty value
     *
     * @private
     * @since 1.72.0
     */
    StateManager._onShellNavigated = function () {
        return this._oURLParsingService.then(function (urlParsingService) {
            var oHash = urlParsingService.parseShellHash(window.hasher.getHash());

            // nav to Shell-home or Launchpad-openFLPPage
            if ((oHash.semanticObject === "Shell" && oHash.action === "home") ||
                (oHash.semanticObject === "Launchpad" && oHash.action === "openFLPPage")) {
                this._setCurrentPageVisibility(true, true);
            } else {
                // open eg.app finder, application
                this._setCurrentPageVisibility(false, false);
            }
        }.bind(this));
    };

    /**
     * Handles the visibility of the current page in the inner navContainer. When the browser navigates to another
     * tab, sets its visibility to false.
     *
     * @returns {Promise} Resolves to an empty value
     *
     * @private
     * @since 1.72.0
     */
    StateManager._onTabNavigated = function () {
        return this._oURLParsingService.then(function (urlParsingService) {
            var oHash = urlParsingService.parseShellHash(window.hasher.getHash());
            // navigate to or leave  Shell-home or Launchpad-openFLPPage
            if ((oHash.semanticObject === "Shell" && oHash.action === "home") ||
                (oHash.semanticObject === "Launchpad" && oHash.action === "openFLPPage")) {
                this._setCurrentPageVisibility(!document.hidden);
            }
        }.bind(this));
    };

    /**
     * Handles the visibility of the current page in the inner navContainer. When navigation happens, sets the
     * visibility of the previous page to false and the current page to true.
     *
     * @param {sap.ui.base.Event} event The navigate event of navContainer
     *
     * @private
     * @since 1.72.0
     */
    StateManager._onPageNavigated = function (event) {
        var oParams = event.getParameters();
        this._setPageVisibility(oParams.from, false);
        this._setPageVisibility(oParams.to, true);
    };

    /**
     * Handles the visibility of the current page in the inner navContainer. When entering or leaving a page,
     * sets its visibility accordingly.
     *
     * @param {sap.ui.base.Event} event The navigate event of navContainer
     *
     * @private
     * @since 1.73.0
     */
    StateManager._onErrorPageNavigated = function (event) {
        var oTargetPage = event.getParameter("to");

        this._setCurrentPageVisibility(!oTargetPage.isA("sap.m.MessagePage"), undefined, true);
    };

    /**
     * Removes all the listeners.
     *
     * @private
     * @since 1.74.0
     */
    StateManager.exit = function () {
        this.oEventBus.unsubscribe("sap.ushell", "navigated", this._onPageNavigated, this);
        document.removeEventListener("visibilitychange", this._onTabNavigatedBind);
        this.oPagesNavContainer.detachNavigate(this._onPageNavigated, this);
        this.oPagesRuntimeNavContainer.detachNavigate(this._onErrorPageNavigated, this);
        this.oEventBus.unsubscribe("launchpad", "setConnectionToServer", this._onEnableRequests, this);
    };

    return StateManager;
});