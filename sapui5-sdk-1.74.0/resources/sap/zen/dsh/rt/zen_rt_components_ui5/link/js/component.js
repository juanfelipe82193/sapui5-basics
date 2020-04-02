define("zen.rt.components.ui5/link/js/component",[], function() {
	sap.m.Link.extend("com.sap.ip.bi.Link", {
		metadata : {
			properties : {
				"height" : "sap.ui.core.CSSSize",
				"cssStyle" : "string",
			}
		},
		
		initDesignStudio: function() {
			var me = this;
			me.attachPress(function() {
				me.fireDesignStudioEvent("onclick");
			});
		},
		renderer: {},
		init: function() {
			var me = this;
			if (sap.m.Link.prototype.init)
				sap.m.Link.prototype.init.apply(me, arguments);
			
			// We want the link to always launch in a new window and it
			// should not be configurable. 
			me.setTarget('_blank');
		},
		onAfterRendering:function(evt) {
			var me = this;
			if (sap.m.Link.prototype.onAfterRendering) {
				sap.m.Link.prototype.onAfterRendering.apply(me, [ evt ]);
			}

			var height = me.getHeight();
			var jqThis = me.$();
			if (height !== "auto") {
				jqThis.height(height);			
			}
			
			var newStyle = jqThis.attr("style");
			if (newStyle && newStyle.charAt(newStyle.length-1) !== ';')
				newStyle += ';';
			newStyle += 'white-space:pre-line;word-wrap:break-word;text-overflow:clip;';
			jqThis.attr("style", newStyle);
		},
		getUrl: function() {
			return this.getHref();
		},
		setUrl: function(url) {
			this.setHref(url);
		},
		getStyle: function() {
			return this._style;
		},
		setStyle: function(style) {
			var me = this;
			if (style==='Normal') {
				me.setSubtle(false);
				me.setEmphasized(false);
			}
			else if (style==='Subtle') {
				me.setSubtle(true);
				me.setEmphasized(false);
			}
			else if (style==='Emphasized')	 {
				me.setEmphasized(true);
				me.setSubtle(false);
			}			
			me._style = style;
		}
	});
		
});
