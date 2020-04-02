// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */
sap.ui.define([
    'sap/m/Select'
], function () {
    "use strict";

    return sap.m.Select.extend('sap.ushell.renderers.fiori2.search.controls.SearchSelect', {

        constructor: function (sId, options) {
            options = jQuery.extend({}, {
                visible: "{/businessObjSearchEnabled}",
                autoAdjustWidth: true,
                items: {
                    path: "/dataSources",
                    template: new sap.ui.core.Item({
                        key: "{id}",
                        text: "{labelPlural}"
                    })
                },
                selectedKey: {
                    path: '/uiFilter/dataSource/id',
                    mode: sap.ui.model.BindingMode.OneWay
                },
                tooltip: sap.ushell.resources.i18n.getText("searchIn") + " {/uiFilter/dataSource/labelPlural}",
                change: function (event) {
                    var item = this.getSelectedItem();
                    var context = item.getBindingContext();
                    var dataSource = context.getObject();
                    this.getModel().setDataSource(dataSource, false);
                    this.getModel().abortSuggestions();
                    this.getModel().eventLogger.logEvent({
                        type: this.getModel().eventLogger.DROPDOWN_SELECT_DS,
                        dataSourceId: dataSource.id
                    });
                },
                enabled: {
                    parts: [{
                        path: "/initializingObjSearch"
                    }],
                    formatter: function (initializingObjSearch) {
                        return !initializingObjSearch;
                    }
                }
            }, options);
            sap.m.Select.prototype.constructor.apply(this, [sId, options]);
            this.addStyleClass('searchSelect');
        },

        renderer: 'sap.m.SelectRenderer',

        setDisplayMode: function (mode) {
            switch (mode) {
            case 'icon':
                this.setType(sap.m.SelectType.IconOnly);
                this.setIcon('sap-icon://slim-arrow-down');
                break;
            case 'default':
                this.setType(sap.m.SelectType.Default);
                break;
            default:
                break;
            }
        }
    });
});
