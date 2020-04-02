jQuery.sap.declare("ssuite.smartbusiness.tiles.lib.TimeStampControl");
sap.ui.define(["sap/m/TileContent", "sap/m/TileContentRenderer", "sap/ui/core/Control"], function(TileContent,
		Renderer, Control) {
	"use strict";

	var timestamp = Control.extend("numeric.TileContent_Timestamp", {
		renderer : function(r, c) {
			r.write("<div");
			r.writeElementData(c);
			r.addClass("sapMTileCntFtrTxt");
			if (c.getParent().getRefreshOption())
				r.addClass("sapMLnk");
			r.addClass(c.getParent().getSize());
			r.writeClasses();
			r.addStyle("position", "absolute");
			r.addStyle(r.getConfiguration().getRTL() ? "left" : "right", "auto");
			r.writeStyles();
			r.write(">");
			var ts = c.getParent().getTimestamp();
			if (ts) {
				if (!c.getParent().getRefreshOption())
					r.writeEscaped("");
				else if (r.getConfiguration().getRTL()) {
					r.writeEscaped(ts + "\u2009");
					r.writeIcon("sap-icon://refresh", "sapMCmpTileUnitInner");
				} else {
					r.writeIcon("sap-icon://refresh", "sapMCmpTileUnitInner");
					r.writeEscaped("\u2009" + ts);
				}
			}
			r.write("</div>");
		}
	});

	timestamp.prototype.ontap = function(e) {
		if (this.getParent().getRefreshOption()) {
			e.preventDefault();
			e.cancelBubble = true;
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			this.getParent().fireRefresh();
		}
	};

	return TileContent.extend("ssuite.smartbusiness.tiles.lib.TimeStampControl", {
		metadata : {
			properties : {
				timestamp : {
					type : "string"
				},
				refreshOption : {
					type : "boolean"
				}
			},
			events : {
				refresh : {}
			}
		},
		init : function() {
			this.addDependent(this._oTimestamp = new timestamp());
		},
		// tooltip also has to be overridden
		getAltText : function() {
			var a = TileContent.prototype.getAltText.apply(this, arguments);
			if (this.getTimestamp())
				a += (a === "" ? "" : "\n") + this.getTimestamp();
			return a;
		},
		renderer : {
			// after moving to sap.m library this function is replaced with _renderFooter (checked in version
			// 1.35.0-SNAPSHOT – not sure if this is a permanent change)
			// sap.suite.ui.commons.TileContentRender is internally pointing to sap.m.TileContentRenderer
			_renderFooter : function(r, c) {
				Renderer._renderFooter.apply(this, arguments);
				r.renderControl(c._oTimestamp);

			}
		}
	});
}, true);
