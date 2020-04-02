sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/suite/ui/microchart/RadialMicroChart"
], function (Controller, JSONModel, Node, RadialMicroChart) {
	var oCustomNode = Node.extend("sap.suite.ui.commons.sample.NetworkGraphCustomRendering.NetworkGraphCustomNode", {
		oCustomTitleSize: null,
		oCustomTrimmedTextSize: null,
		sBigFont: "BIG FONT TRIMMED TEXT",
		calculateSizes: function () {
			this.oCustomTitleSize = this.computeTextDimensions({
				text: this.getTitle(),
				width: this.getWidth() - 10,
				maxLines: this.getTitleLineSize()
			});

			this.oCustomTrimmedTextSize = this.computeTextDimensions({
				text: this.sBigFont,
				width: this.getWidth() - 10,
				attributes: {
					"font-size": "20px"
				},
				maxLines: 1
			});

			// as we use height property for basic height and add title height we don't want to change heigh directly
			// it would grow with every invalidation... meanwhile we call setSize which change internal values and is reset every cycle
			if (this.getShape() === "Box") {
				var iTitleHeight = this.oCustomTitleSize.lineHeight * this.oCustomTitleSize.text.length;
				this.setSize({
					titleHeight: iTitleHeight,
					height: Math.floor(iTitleHeight + this.oCustomTrimmedTextSize.lineHeight + 25 + 50 /*icon*/)
				});
			}
			if (this.getShape() === "Custom") {
				if (this.oCustomTitleSize.lineHeight > 0) {
					this.setCoreNodeSize(this.getHeight());
					this.setSize({
						height: Math.floor(this.getHeight() + this.oCustomTitleSize.lineHeight * this.oCustomTitleSize.text.length)
					});
				}
			}
		},
		renderItemContent: function (mArguments) {
			if (this.getShape() === "Custom") {
				return Node.prototype.renderContent.call(this);
			}

			var bUseHtml = this.getParent().getRenderType() === "Html";
			return bUseHtml ? this.renderHtmlItemContent(mArguments) : this.renderSvgItemContent(mArguments);
		},
		renderer: "sap.suite.ui.commons.networkgraph.NodeRenderer",
		_renderRadial: function (oRm) {
			if (!this._oRadial) {
				this._oRadial = new RadialMicroChart({
					size: "M",
					percentage: Math.floor(Math.random() * 100)
				});
			}
			oRm.renderControl(this._oRadial);
		},
		_convert: function ($el) {
			$el.removeAttr("data-sap-ui");
			$el.attr("id", $el.attr("id") + this.getId());

			var aChildren = $el.children();
			if (aChildren.length === 0) {
				return;
			}

			aChildren.each(function (i, oChild) {
				this._convert(jQuery(oChild));
			}.bind(this));
		},
		renderHtmlItemContent: function (mArguments) {
			if (this.getShape() === "Box" || this.getShape() === "Circle") {
				mArguments.renderManager.write("<div id=\"" + this.getId() + "-graphwrapper\" style=\"display:flex;justify-content: center;padding: 5px 0 5px 0\">");
				if (!mArguments.mapRender) {
					this._renderRadial(mArguments.renderManager);
				} else {
					// control can be rendered only once using ranger manager
					// so we just clone HTML and change IDs

					var $clone = this.$("graphwrapper").clone();
					this._convert($clone);
					mArguments.renderManager.write($clone[0].innerHTML);
				}
				mArguments.renderManager.write("</div>");
			}
		},
		renderSvgItemContent: function (mArguments) {
			var sHtml = "",
				bIsRtl = sap.ui.getCore().getConfiguration().getRTL();

			if (this.getShape() === "Box") {
				var y = 20;
				if (this.oCustomTitleSize) {
					sHtml += this.renderText({
						x: bIsRtl ? this.getWidth() - 5 : 5,
						y: y,
						lineSize: this.oCustomTitleSize.lineHeight,
						lines: this.oCustomTitleSize.text
					});

					y += this.oCustomTitleSize.lineHeight * this.oCustomTitleSize.text.length + 20;

					if (this.oCustomTrimmedTextSize) {
						// solo lane text
						sHtml += this.renderText({
							x: bIsRtl ? this.getWidth() - 5 : 5,
							y: y,
							lines: this.oCustomTrimmedTextSize.text,
							attributes: {
								"class": "sapSuiteUiCommonsNetworkSvgText",
								"font-size": "20px"
							}
						});

						y += this.oCustomTrimmedTextSize.lineHeight;
					}

					sHtml += this.renderIcon({
						icon: this.getIcon(),
						y: y + 30,
						x: this.getWidth() / 2,
						attributes: {
							"class": "sapSuiteUiCommonsNetworkSvgText",
							"text-anchor": "middle",
							"font-size": "50px"
						}
					});
				}
			} else {
				if (this.oCustomTitleSize) {
					sHtml += this.renderText({
						x: bIsRtl ? this.getWidth() + 10 : 30,
						y: 35,
						lineSize: this.oCustomTitleSize.lineHeight,
						lines: this.oCustomTitleSize.text,
						attributes: {
							"class": "sapSuiteUiCommonsNetworkSvgText"
						}
					});
				}
			}

			return sHtml;
		},
		renderContent: function (mArguments) {
			// size determination rendering is for default nodes using max-width or multiline titles
			// there is no need to waste time rendering in this cycle as its destroyed anyway
			if (mArguments.sizeDetermination) {
				return;
			}

			if (this.getShape() !== "Custom") {
				return Node.prototype.renderContent.call(this, mArguments);
			}

			var bUseHtml = this.getParent().getRenderType() === "Html";
			return bUseHtml ? this.renderHtmlContent() : this.renderSvgContent();
		},
		renderSvgContent: function (mArguments) {
			var FOCUS_OFFSET = 3;
			var sHtml = "",
				x = this.getX(),
				y = this.getY(),
				iHeight = 80,
				iWidth = this.getWidth();

			// set default classes if you want to have focus, hover and selected state handled by default
			// otherwise you need to handle it yourself
			sHtml += this.renderElement("path", {
				stroke: "red",
				"class": "sapSuiteUiCommonsNetworkInnerRect",
				d: "M" + (x + iWidth / 2) + " " + y + " L " + (x + iWidth) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y + iHeight) +
					" L " + (x) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y) + "Z"
			});

			sHtml += this.renderElement("path", {
				stroke: "red",
				"class": "sapSuiteUiCommonsNetworkBoxFocus",
				d: "M" + (x + iWidth / 2) + " " + (y + FOCUS_OFFSET) + " L " + (x + iWidth - FOCUS_OFFSET) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y + iHeight - FOCUS_OFFSET) +
					" L " + (x + FOCUS_OFFSET) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y + FOCUS_OFFSET) + "Z"
			});

			sHtml += this.renderIcon({
				icon: this.getIcon(),
				y: 65,
				x: this.getWidth() / 2,
				attributes: {
					"text-anchor": "middle",
					"class": "sapSuiteUiCommonsNetworkSvgText",
					"font-size": "50px"
				}
			});

			if (this.getTitle()) {
				sHtml += this.renderText({
					x: this.getWidth() / 2,
					attributes: {
						"text-anchor": "middle",
						"pointer-events": "none",
						"class": "sapSuiteUiCommonsNetworkSvgText"
					},
					y: iHeight + 20,
					lineSize: this.oCustomTitleSize.lineHeight,
					lines: this.oCustomTitleSize.text
				});
			}

			// render info box
			sHtml += this.renderStatusIcon({
				x: this.getWidth() / 2,
				y: 0,
				size: 15,
				iconSize: 25
			});

			return sHtml;
		},
		renderHtmlContent: function (mArguments) {
			var sHtml = "<div id=\"" + this.getId() + "-wrapper\" style=\"pointer-events:all;background-color: white;height: " + this.getHeight() + "px;width: " + this.getHeight() + "px;transform: rotate(45deg);\">",
				sId = this.getId();

			sHtml += "<div  style=\"border-radius:0\" id=\"" + sId + "-wrapper\" class=\"sapSuiteUiCommonsNetworkGraphDivInner\">";
			sHtml += "<div class=\"sapSuiteUiCommonsNetworkDivCircleWrapper\">";

			sHtml += this.renderHtmlInfoIcon({
				top: "-10px",
				left: "-10px",
				transform: "rotate(-45deg)"
			});

			sHtml += "<div style=\"border-radius:0\"  id=\"" + sId + "-focus\" class=\"sapSuiteUiCommonsNetworkDivFocus\">";
			sHtml += "<div style=\"font-size: 30px;transform: rotate(-45deg);\" id=\"" + sId + "-status\" class=\"sapSuiteUiCommonsNetworkDivCircleStatus\">";

			sHtml += this.renderHtmlIcon(this.getIcon());

			sHtml += "</div>";
			sHtml += "</div>";
			sHtml += "</div>";
			sHtml += "</div>";
			sHtml += "</div>";

			sHtml += this.renderHtmlActionButtons();

			this.setCoreNodeSize(this.getHeight());

			return sHtml;
		},
		exit: function () {
			Node.prototype.exit.call(this);
			if (this._oRadial) {
				this._oRadial.destroy();
			}
		}
	});

	return oCustomNode;
});
