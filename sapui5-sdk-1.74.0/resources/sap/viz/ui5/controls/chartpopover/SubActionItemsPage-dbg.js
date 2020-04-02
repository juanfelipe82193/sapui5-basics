/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define([
    'sap/ui/core/Control'

], function(Control) {
    "use strict";

    var SubActionItemsPage = Control.extend('sap.viz.ui5.controls.chartpopover.SubActionItemsPage', {
        metadata : {
            properties : {
                items : {
                    type : 'sap.m.ListBase[]'
                }
            }
        },
        renderer : {
            render : function(oRm, oControl) {
                oRm.write('<div');
                oRm.addClass("viz-controls-chartPopover-subActionItemsPage");
                oRm.writeClasses();
                oRm.write('>');
                oRm.renderControl(oControl._oList);
                oRm.write('</div>');
            }
        }
    });

    SubActionItemsPage.prototype.init = function() {
        this._oList = new sap.m.List({
        });
    };

    SubActionItemsPage.prototype.onAfterRendering = function() {
        setTimeout(function(){
            this._oList.focus();
        }.bind(this), 10);
    };

    SubActionItemsPage.prototype.exit = function() {
        if (this._oList) {
            this._oList.destroy();
            this._oList = null;
        }
    };

    SubActionItemsPage.prototype.setItems = function(items) {
        this._oList.removeAllItems();
        var item;
        for (var i = 0; i < items.length; i++) {
            item = new sap.m.ActionListItem({
                text : items[i].text,
                press : items[i].press ? items[i].press : function() {
                },
                tooltip: items[i].text
            });
            this._oList.addItem(item);
        }
    };

    SubActionItemsPage.prototype._createId = function(sId) {
        return this.getId() + "-" + sId;
    };

    return SubActionItemsPage;
});
