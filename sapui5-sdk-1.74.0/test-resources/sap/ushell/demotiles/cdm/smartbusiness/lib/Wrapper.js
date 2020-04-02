sap.ui.define(["sap/suite/ui/commons/TileContent"], function(Control) {
	"use strict";
	return Control.extend("ssuite.smartbusiness.tiles.lib.Wrapper", {
		metadata : {
			aggregations : {
				singleton : {
					type : "sap.ui.core.Element"
				}
			}
		},
		renderer : {},
		updateBindingContext : function() {
			var b = this.getBinding("singleton");
			if (b) {
				var that = this;
				b.attachEvent("dataReceived", function(oEvent) {
					that.setBindingContext(this.getContexts()[0]);
					// determine data is loaded for left or right tile
					var tilePosition = 0;
					if (that && that.data && that.data instanceof Function && that.data("tilePosition")) {
						var currentTilePos = that.data("tilePosition");
						if (currentTilePos == "1")
							tilePosition = 1;
					}
					var oData = oEvent && oEvent.getParameter("data");
					var oTile = that.getParent();
					ssuite.smartbusiness.tiles.lib.Util.prototype.onDataLoaded(oData, oTile, tilePosition);
					ssuite.smartbusiness.tiles.lib.Util.prototype.checkAndStoreCacheForDualTile(oEvent, that);
				});
			}
			Control.prototype.updateBindingContext.apply(this, arguments);
		}
	});
}, true);
