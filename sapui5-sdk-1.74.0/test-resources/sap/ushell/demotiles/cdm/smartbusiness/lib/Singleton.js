sap.ui.define(["sap/ui/core/Control"], function(Control) {
	"use strict";
	return Control.extend("ssuite.smartbusiness.tiles.lib.Singleton", {
		metadata : {
			aggregations : {
				singleton : {
					type : "sap.ui.core.Element"
				},
				content : {
					multiple : false
				}
			}
		},

		renderer : function(r, c) {
			r.write("<div");
			r.writeElementData(c);
			r.write(">");
			if (c.getContent())
				r.renderControl(c.getContent());
			r.write("</div>");
		},

		updateBindingContext : function() {
			var b = this.getBinding("singleton");
			if (b) {
				var that = this;
				b.attachEvent("dataReceived", function(oEvent) {
					that.getContent().setBindingContext(this.getContexts()[0]);
					var oData = oEvent && oEvent.getParameter("data");
					var oTile = that.getContent();
					ssuite.smartbusiness.tiles.lib.Util.prototype.onDataLoaded(oData, oTile);
					ssuite.smartbusiness.tiles.lib.Util.prototype.checkAndStoreCache(oEvent, that);
				});
			}
			Control.prototype.updateBindingContext.apply(this, arguments);
		}

	});
}, true);
