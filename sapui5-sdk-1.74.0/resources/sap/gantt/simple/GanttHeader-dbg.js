/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/Core",
	"sap/ui/Device",
	"./RenderUtils",
	"../misc/Utility"
], function (Element, Core, Device, RenderUtils, Utility) {
	"use strict";

	/**
	 * Creates and initializes a new GanttHeader class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to adjust Gantt Chart header height
	 *
	 * @extend sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.GanttHeader
	 */
	var GanttHeader = Element.extend("sap.gantt.simple.GanttHeader");

	GanttHeader.prototype.renderElement = function() {
		var oRm = Core.createRenderManager();

		var oGantt = this.getParent();
		var sGanttId = oGantt.getId();
		var $HeaderPlaceHolder = jQuery(
			"div.sapGanttChartWithTableHeader[data-sap-ui-related=" +
			sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]" // escape CSS notation characters for jQuery
		);
		var iHeaderHeight = $HeaderPlaceHolder.height();
		var iHeaderWidth = RenderUtils.getGanttRenderWidth(oGantt);

		// Split the total SVG height as 3 parts for drawing
		// label0 (MM YYYY), label1 (DD) and vertical line (|)
		var nHalfHeaderHeight   = iHeaderHeight / 2,
			nFirstRowYOffset    = iHeaderHeight / 5 * 2,
			nSmallIntervalTextY = iHeaderHeight / 5 * 4;

		var oAxisTimeStrategy = oGantt.getAxisTimeStrategy(),
			oTimelineOption   = oAxisTimeStrategy.getTimeLineOption(),
			oAxisTime = oGantt.getAxisTime();

		var aLabelList = oAxisTime.getTickTimeIntervalLabel(oTimelineOption, null, [0, iHeaderWidth]);

		oRm.write("<svg id='" + sGanttId + "-header-svg' class='sapGanttChartHeaderSvg' height='" +
					iHeaderHeight + "px' width='" + iHeaderWidth + "'>");
		oRm.write("<g>");

		// append text for labels on first row for rendering larger interval texts
		this.renderHeaderLabel(oRm, aLabelList[0], {
			y: nFirstRowYOffset,
			className: "sapGanttTimeHeaderSvgText0",
			fontSize: 14
		});

		// append text for labels on second row for rendering small interval texts
		this.renderHeaderLabel(oRm, aLabelList[1],  {
			y: nSmallIntervalTextY,
			className: "sapGanttTimeHeaderSvgText1",
			fontSize: 14
		});

		// larger interval path
		this.renderIntervalLine(oRm, aLabelList[0], {
			start: 0,
			end: nHalfHeaderHeight,
			className: "sapGanttTimeHeaderLargeIntervalSvgPath"
		});

		// small interval path
		this.renderIntervalLine(oRm, aLabelList[1], {
			start: nSmallIntervalTextY,
			end: iHeaderHeight,
			className: "sapGanttTimeHeaderSvgPath"
		});

		oRm.write("</g>");

		var iNowLineAxisX = oAxisTime.getNowLabel(oGantt.getNowLineInUTC())[0].value;
		this.renderNowLineHeader(oRm, oGantt, {
			headerHeight: iHeaderHeight,
			nowLineX: iNowLineAxisX
		});

		oRm.write("</svg>");

		oRm.flush($HeaderPlaceHolder.get(0));
		oRm.destroy();
	};

	GanttHeader.prototype.renderHeaderLabel = function(oRm, aLabel, mAttr) {
		var bRTL = Core.getConfiguration().getRTL();
		var bIEinRTLMode = (Device.browser.msie || Device.browser.edge) && bRTL;

		aLabel.forEach(function(d) {
			oRm.write("<text");
			oRm.addClass(mAttr.className);
			oRm.writeClasses();
			oRm.writeAttribute("text-anchor", "start");
			oRm.writeAttribute("x", d.value + (bRTL ? -5 : 5));
			oRm.writeAttribute("y", mAttr.y);

			if (bIEinRTLMode) {
				var iOffset = Utility.calculateStringLength(d.label) * (mAttr.fontSize / 2);
				oRm.writeAttribute("transform", "translate(" + (-iOffset) + ")");
			}

			oRm.write(">");
			oRm.write(d.label);
			if (mAttr.className === "sapGanttTimeHeaderSvgText1" && d.largeLabel) {
				// tooltip
				oRm.write("<title>");
				oRm.write(d.largeLabel);
				oRm.write("</title>");
			}


			oRm.write("</text>");
		});
	};

	GanttHeader.prototype.renderIntervalLine = function(oRm, aLabel, mAttr) {
		// append path for scales on both rows
		var sPathD = "";
		for (var i = 0; i < aLabel.length; i++) {
			var oLabel = aLabel[i];
			if (oLabel) {
				sPathD +=
					" M" +
					" " + (oLabel.value - 1 / 2) +
					" " + mAttr.start +
					" L" +
					" " + (oLabel.value - 1 / 2 ) +
					" " + mAttr.end;
			}
		}

		oRm.write("<path");
		oRm.writeAttribute("d", sPathD);
		oRm.addClass(mAttr.className);
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</path>");
	};

	GanttHeader.prototype.renderNowLineHeader = function(oRm, oGantt, mAttr) {
		var iHeaderHeight = mAttr.headerHeight,
			iNowlineX = mAttr.nowLineX;

		if (oGantt.getEnableNowLine() === false || isNaN(iNowlineX) ) { return; }

		var mLengthOfSide = 8;
		var halfTriangleWidth = mLengthOfSide / 2,
			tringleHeight = Math.sqrt(mLengthOfSide * mLengthOfSide - halfTriangleWidth * halfTriangleWidth);
		var sPathD = [
			[iNowlineX, iHeaderHeight],
			[iNowlineX - halfTriangleWidth, iHeaderHeight - tringleHeight],
			[iNowlineX + halfTriangleWidth, iHeaderHeight - tringleHeight],
			[iNowlineX, iHeaderHeight]
		].reduce(function(sInit, point, i){
			var sPoint = point.join(",");
			return i === 0 ? "M" + sPoint : (sInit + "L" + sPoint);
		}, "");
		oRm.write("<g class='sapGanttNowLineHeaderSvgPath'>");
		oRm.write("<path");
		oRm.writeAttribute("d", sPathD);
		oRm.write("/>");

		oRm.write("</g>");
	};

	return GanttHeader;
}, true);
