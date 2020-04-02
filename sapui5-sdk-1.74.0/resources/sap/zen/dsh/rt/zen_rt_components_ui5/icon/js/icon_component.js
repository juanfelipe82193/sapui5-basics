define("zen.rt.components.ui5/icon/js/icon_component", ["css!../css/icon_component.css"], function() {
	sap.ui.core.Icon.extend("com.sap.ip.bi.Icon", {

		initDesignStudio: function() {
			sap.zen.Dispatcher.instance.registerResizeHandler(this, this);
			this.attachPress(function() {
				this.fireDesignStudioEvent("onclick");
			});
		},
		
		renderer : {},
		
		endResize : function() { 
			var _width = this.getWidth();
			var _height = this.getHeight();
			
			if (_width === "auto") {
				_width = this.$().width();
			} else {
				_width = parseInt(_width);
			}
			
			if (_height === "auto") {
				_height  = this.$().height();
			} else {
				_height = parseInt(_height);
			}
			
			if (isNaN(_width) || isNaN(_height)) {
				return;
			}

			var newLineHeight =  _height + "px";
			this.$().css({
				"line-height": newLineHeight
			});
			
			var _size;
			if (_width < _height) {
				_size = _width;
			} else {
				_size = _height;
			}
			
			if (this.getBackgroundShape() === "ELLIPSIS") {
				_size = Math.floor(Math.sqrt(Math.pow(0.5*_size, 2) * 2));
			}
			_size *= this.getSizeFactor();
			this.setSize(_size + "px");
		}, 

		onAfterRendering : function() {
			if (sap.ui.core.Icon.prototype.onAfterRendering) {
				sap.ui.core.Icon.prototype.onAfterRendering.apply(this, arguments);
			}

			this.endResize();

			this.$().addClass("icon_"+this.getBackgroundShape());
			
			if (this._enabled) {
				this.$().addClass("enabled");
				this.$().css("cursor", "pointer");
			} else {
				this.$().removeClass("enabled");
				this.$().css("cursor", "default");
			}

		},
		
		setHeight: function(value) {
			sap.ui.core.Icon.prototype.setHeight.call(this, value);
			this.onAfterRendering();
		},
		
		setWidth: function(value) {
			sap.ui.core.Icon.prototype.setWidth.call(this, value);
			this.onAfterRendering();
		},
		
		getIconUri: function() {
			return this.getSrc();
		},
		
		setIconUri: function (value) {
			//isIconUri only checks if the uri follows the syntax, not if the icon exists
			if (sap.ui.core.IconPool.isIconURI(value)) {
				var path = value.substring(11, value.length);
				var collection = "undefined";
				var name;
				
				if (path.indexOf('/') > -1) {
					var index = path.indexOf('/');
					collection = path.substring(0, index);
					name = path.substring(index + 1, path.length);
				} else {
					name = path;
				}

				//check if Icon exists
				var info = sap.ui.core.IconPool.getIconInfo(name, collection);
				if (info !== undefined){
					value = info.uri;
				}
				else return this;
			}
			else return this;
			
			this.setSrc(value);
			this.rerender();
		},
		
		getSizeFactor: function() {
			return this._sizeFactor;
		},
		
		setSizeFactor: function(value) {
			if (value < 0) value *= -1;
			if (value > 1) value = 1;
			this._sizeFactor = value;
			this.endResize();
			var that = this;
			setTimeout(function() {
				that.endResize();
			}, 100);
		},

		getCustomFont: function() {
			return this._customFont;
		},
		
		setCustomFont: function(value) {
			var name = value.substring(0, value.lastIndexOf('.'));
			name = name.substring(name.lastIndexOf('/')+1);

			if (value.length > 0) {
				//include Font Face
				var styleNode         = document.createElement("style");
				styleNode.type        = "text/css";
				styleNode.innerHTML   = "@font-face { font-family: '" + name + "';" +
													 "src: url('" + value + "'); }";
				document.head.appendChild(styleNode);
			}
			
			this._customFont = value;
		},

		getParsedFont: function() {
			return JSON.stringify(this._parsedFont);
		},
		
		setParsedFont: function(value) {
			this._parsedFont = JSON.parse(value);

			//load Icons in IconPool
			var names = Object.keys(this._parsedFont.icons);
			
			for (var i = 0; i < names.length; i++) {
				if (this._parsedFont.icons[names[i]] !== undefined) {
					sap.ui.core.IconPool.addIcon(
							names[i],
							this._parsedFont.name,
							{ fontFamily: this._parsedFont.name,
								content: this._parsedFont.icons[names[i]] }
					);
				}
			}

		},

		getBackgroundShape: function() {
			return this._backgroundShape;
		},
		
		setBackgroundShape: function(value) {
			this.$().removeClass("icon_"+this.getBackgroundShape());
			this._backgroundShape = value;
			this.onAfterRendering();
		},
		
		setOnclick: function(value) {
			if (value !== "") {
				this._enabled = true;
			} else {
				this._enabled = false;
			}
		}
	});	
});
