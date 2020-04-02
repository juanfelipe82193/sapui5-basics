// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global $, jQuery, sap, window, document */
sap.ui.define([], function () {
    "use strict";

    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.container.ComponentIndexScript');

    sap.ui.getCore().attachInit(function () {

        sap.ui.require([
            'sap/ushell/renderers/fiori2/search/container/ComponentService'
        ], function (ComponentService) {

            //init search services
            ComponentService.init();

            sap.ui.require([
                'sap/ushell/renderers/fiori2/search/personalization/PersonalizationStorage',
                'sap/ushell/renderers/fiori2/search/SearchModel',
                'sap/ushell/renderers/fiori2/search/container/ComponentControl'
            ], function (PersonalizationStorage, SearchModel, ComponentControl) {

                //init Personalization Storage Service
                PersonalizationStorage.getInstance();

                //init search model
                if (!this.oModel) {
                    this.oModel = sap.ushell.renderers.fiori2.search.getModelSingleton();
                }

                //init search controls
                ComponentControl.init();

                //to arrange the search controls
                this.oSearchFieldGroup = ComponentControl.oSearchFieldGroup;
                this.oSearchFieldGroup.setCancelButtonActive(false);
                this.oSearchFieldGroup.setModel(this.oModel);
                this.oSearchFieldGroup.addStyleClass('sapSearchFieldGroup');

                this.oSearchBar = new sap.ui.layout.HorizontalLayout();
                this.oSearchBar.addContent(this.oSearchFieldGroup);
                this.oSearchBar.addStyleClass('sapSearchBar');
                this.oSearchBar.placeAt("content", "first");
            });
        });
    });

    var redirectSearchPage = function () {
        if (window.location.hash.indexOf("#Action-search") === 0) {
            window.location.href = window.location.origin + window.location.pathname.slice(0, window.location.pathname.indexOf('/sap/ushell/renderers/fiori2/search/container/')) + "/sap/ushell/renderers/fiori2/search/container/Component.html" + window.location.search + window.location.hash;
        }
    };

    $(window).bind('hashchange', function () {
        redirectSearchPage();
    });

    $(document).ready(function () {
        redirectSearchPage();
    });
});
