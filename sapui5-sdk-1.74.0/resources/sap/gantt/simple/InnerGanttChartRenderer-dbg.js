/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/Core",
	 "./BaseLine",
	 "./RenderUtils",
	 "./GanttExtension"
],
	function (
		Device,
		Core,
		BaseLine,
		RenderUtils,
		GanttExtension
	) {
	"use strict";

	var InnerGanttChartRenderer = {};

	InnerGanttChartRenderer.render = function (oRm, oControl) {
		var oGantt = oControl.getParent();
		this.renderGanttChart(oRm, oGantt);

		oGantt.getSyncedControl().scrollContentIfNecessary();
	};

	InnerGanttChartRenderer.renderGanttChart = function(oRm, oGantt) {
		oRm.write("<div id='" + oGantt.getId() + "-cnt'");
		oRm.addClass("sapGanttChartCnt");
		oRm.writeClasses();
		oRm.addStyle("height", "100%");
		oRm.addStyle("width", "100%");
		oRm.write(">");
		this.rerenderAllShapes(oRm, oGantt);
		oRm.write("</div>");
	};

	InnerGanttChartRenderer.renderImmediately = function(oGantt) {
		var oRm = Core.createRenderManager();
		this.renderGanttChart(oRm, oGantt);

		var oGntCnt = window.document.getElementById(oGantt.getId() + "-cnt");
		oRm.flush(oGntCnt, true /**bDoNotPreserve*/, false/**vInsert*/);

		this.renderRelationships(oRm, oGantt);
		oGantt._updateShapeSelections(oGantt.getSelectedShapeUid(), []);
		GanttExtension.attachEvents(oGantt);
		oRm.destroy();
	};

	InnerGanttChartRenderer.rerenderAllShapes = function(oRm, oGantt) {
		var aRowStates = oGantt.getSyncedControl().getRowStates();
		if (aRowStates.length === 0) {
			// row state is not synchronized, skip rendering.
			return;
		}

		oGantt.getAggregation("_header").renderElement();
		var iAllRowHeight = aRowStates.reduce(function(height, rowState){
			return height + rowState.height;
		}, 0);

		// 0. render body svg
		oRm.write("<svg id='" + oGantt.getId() + "-svg'");
		oRm.addClass("sapGanttChartSvg");
		oRm.writeClasses();
		oRm.writeAttribute("height", iAllRowHeight + "px");
		var iRenderWidth = RenderUtils.getGanttRenderWidth(oGantt);

		oRm.writeAttribute("width", iRenderWidth + "px");
		oRm.write(">");


		this.renderHelperDefs(oRm, oGantt.getId());

		this.renderGanttBackgrounds(oRm, oGantt, aRowStates);

		// 1. render calendar pattern into <defs>
		this.renderCalendarPattern(oRm, oGantt);

		this.renderCalendarShapes(oRm, oGantt);

		// 1.1 render expanded background if has row expandnation
		this.renderExpandedRowBackground(oRm, oGantt);

		// 1.2 Render vertical lines
		this.renderVerticalLines(oRm, oGantt);

		// 1.3 Render Now line body
		this.renderNowLineBody(oRm, oGantt);

		// 2. render in-row shapes and adhoc lines by order
		var aFnRenderOrdered = [this.renderRlsContainer, this.renderAllShapesInRows, this.renderAssistedContainer];
		if (oGantt.getEnableAdhocLine()) {
			var sLayer = oGantt.getAdhocLineLayer();
			if (sLayer === sap.gantt.AdhocLineLayer.Bottom) {
				aFnRenderOrdered.splice(0, 0, this.renderAdhocLines);
			} else {
				aFnRenderOrdered.push(this.renderAdhocLines);
			}
		}
		aFnRenderOrdered.forEach(function(fnRenderer) {
			fnRenderer.apply(InnerGanttChartRenderer, [oRm, oGantt]);
		});

		oRm.write("</svg>");

		if (!oGantt._bPreventInitialRender) {
			oGantt._bPreventInitialRender = true;
		}
	};

	InnerGanttChartRenderer.renderHelperDefs = function (oRm, sIdPrefix) {
		oRm.write("<defs>");

		var sLinePatternId = sIdPrefix + "-helperDef-linePattern";

		oRm.write("<pattern id='" + sLinePatternId + "' width='2' height='2' x='0' y='0' patternUnits='userSpaceOnUse'>");
		oRm.write("<line x1='1' x2='1' y1='0' y2='2' stroke-width='1' stroke='white' shape-rendering='crispEdges' />");
		oRm.write("</pattern>");

		oRm.write("</defs>");
	};

	InnerGanttChartRenderer.renderGanttBackgrounds = function(oRm, oGantt, aRowStates) {
		oRm.write("<g");
		oRm.writeAttribute("id", oGantt.getId() + "-bg");
		oRm.write(">");

		this.renderRowBackgrounds(oRm, oGantt, aRowStates);
		this.renderRowBorders(oRm, oGantt, aRowStates);

		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderRowBackgrounds = function(oRm, oGantt, aRowStates) {
		var nHeightOfPreviousRows = 0;
		oRm.write("<g class='rowBackgrounds'");
		oRm.write(">");

		aRowStates.forEach(function(oRowState, iIndex){
			oRm.write("<rect");
			oRm.writeAttribute("y", nHeightOfPreviousRows);
			oRm.writeAttribute("width", "100%");
			oRm.writeAttribute("height", oRowState.height);
			oRm.writeAttribute("data-sap-ui-index", iIndex);
			oRm.addClass("sapGanttBackgroundSVGRow");
			if (oRowState.selected) {
				oRm.addClass("sapGanttBackgroundSVGRowSelected");
			}
			if (oRowState.hovered) {
				oRm.addClass("sapGanttBackgroundSVGRowHovered");
			}
			oRm.writeClasses();
			oRm.write("/>");
			nHeightOfPreviousRows += oRowState.height;
		});
		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderRowBorders = function(oRm, oGantt, aRowStates) {
		oRm.write("<g class='rowBorders'");
		oRm.write(">");

		var nHeightOfPreviousRows = 0;
		aRowStates.forEach(function(oRowState, iIndex) {
			var nBorderY = (nHeightOfPreviousRows + oRowState.height) - 0.5;

			oRm.write("<line");
			oRm.writeAttribute("x1", 0);
			oRm.writeAttribute("x2", "100%");
			oRm.writeAttribute("y1", nBorderY);
			oRm.writeAttribute("y2", nBorderY);
			oRm.writeAttribute("style", "pointer-events:none");
			oRm.addClass("sapGanttBackgroundSVGRowBorder");
			oRm.writeClasses();
			oRm.write("/>");

			nHeightOfPreviousRows += oRowState.height;
		});
		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderAdhocLines = function(oRm, oGantt) {
		var aAdhocLines = oGantt.getAdhocLines();
		var mTimeRange = oGantt.getRenderedTimeRange(),
			oMinTime = mTimeRange[0],
			oMaxTime = mTimeRange[1];

		aAdhocLines = aAdhocLines.filter(function(oValue) {
			var oDate = sap.gantt.misc.Format.abapTimestampToDate(oValue.getTimeStamp());
			return oDate >= oMinTime && oDate <= oMaxTime;
		});
		if (aAdhocLines.length === 0) { return; }

		oRm.write("<g");
		oRm.writeAttribute("class", "sapGanttChartAdhocLine");
		oRm.write(">");

		var oAxisTime = oGantt.getAxisTime();
		aAdhocLines.map(function(oAdhocLine) {
			var iX = oAxisTime.timeToView(sap.gantt.misc.Format.abapTimestampToDate(oAdhocLine.getTimeStamp()));
			return new BaseLine({
				x1: iX,
				y1: 0,
				x2: iX,
				y2: "100%",
				stroke: oAdhocLine.getStroke(),
				strokeWidth: oAdhocLine.getStrokeWidth(),
				strokeDasharray: oAdhocLine.getStrokeDasharray(),
				strokeOpacity: oAdhocLine.getStrokeOpacity(),
				tooltip: oAdhocLine.getDescription()
			}).setProperty("childElement", true);
		}).forEach(function(oLine){
			oLine.renderElement(oRm, oLine);
		});

		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderVerticalLines = function(oRm, oGantt) {
		if (oGantt.getEnableVerticalLine()) {
			// var iRenderedWidth = oGantt.iGanttRenderedWidth
			var iRenderedWidth = RenderUtils.getGanttRenderWidth(oGantt),
				iChartHeight = jQuery.sap.byId(oGantt.getId()).height(),
				oAxisTime = oGantt.getAxisTime();

			var oZoomStrategy = oAxisTime.getZoomStrategy();
			var aTickTimeIntervals = oAxisTime.getTickTimeIntervalLabel(oZoomStrategy.getTimeLineOption(), null, [0, iRenderedWidth]);

			// the second item have all the tick time info
			var aTicks = aTickTimeIntervals[1];

			var sPathContent = "";
			// By Default line width is 1, is need to minus the half width of line
			for (var i = 0; i < aTicks.length; i++) {
				sPathContent += " M" +
					" " + (aTicks[i].value - 1 / 2) +
					" 0" +
					" v " + iChartHeight;
			}
			if (sPathContent) {
				oRm.write("<path");
				oRm.addClass("sapGanttChartVerticalLine");
				oRm.writeClasses();
				oRm.writeAttribute("d", sPathContent);
				oRm.write("/>");
			}
		}
	};

	InnerGanttChartRenderer.renderAssistedContainer = function (oRm, oGantt) {
		// for selection
		oRm.write("<g");
		oRm.writeAttribute("class", "sapGanttChartSelection");
		oRm.write(">");
		oRm.write("</g>");
		// for shape connect
		oRm.write("<g");
		oRm.writeAttribute("class", "sapGanttChartShapeConnect");
		oRm.write(">");
		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderNowLineBody = function(oRm, oGantt) {
		var iNowLineAxisX = oGantt.getAxisTime().getNowLabel(oGantt.getNowLineInUTC())[0].value;
		if (oGantt.getEnableNowLine() === false || isNaN(iNowLineAxisX)) { return; }

		oRm.write("<g class='sapGanttNowLineBodySvgLine'");
		oRm.write(">");
		var oStraightLine = new BaseLine({
			x1: iNowLineAxisX, y1: 0,
			x2: iNowLineAxisX, y2: "100%",
			strokeWidth: 1
		}).setProperty("childElement", true);

		oStraightLine.renderElement(oRm, oStraightLine);
		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderRlsContainer = function (oRm, oGantt) {
		oRm.write("<g");
		oRm.writeAttribute("class", "sapGanttChartRls");
		oRm.write(">");
		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderAllShapesInRows = function(oRm, oGantt) {
		if (!jQuery.sap.byId(oGantt.getId() + "-gantt")) { return; }

		oRm.write("<g");
		oRm.writeAttribute("class", "sapGanttChartShapes");
		oRm.write(">");

		this._eachVisibleRowSettings(oGantt, function(oRowSettings) {
			oRowSettings.renderElement(oRm, oGantt);
		});
		oRm.write("</g>");
	};

	InnerGanttChartRenderer._eachVisibleRowSettings = function(oGantt, fnCallback) {
		var aAllRows = oGantt.getTable().getRows();
		var oBindingInfo = oGantt.getTable().getBindingInfo("rows"),
			sModelName = oBindingInfo && oBindingInfo.model;

		for (var iIndex = 0; iIndex < aAllRows.length; iIndex++) {
			var oRow = aAllRows[iIndex];
			var oRowContext = oRow.getBindingContext(sModelName);
			if (oRowContext && oRow.getIndex() !== -1) {
				var oRowSettings = oRow.getAggregation("_settings");
				if (fnCallback) {
					fnCallback(oRowSettings);
				}
			}
		}
	};

	InnerGanttChartRenderer.renderRelationships = function (oRm, oGantt) {
		var oGntSvg = jQuery.sap.domById(oGantt.getId() + "-svg");
		var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);

		if (oGntSvg == null || oRlsCnt == null) { return; }

		var oFilterMap = {};
		var fnCallRender = function (oRowSettings) {
			oRowSettings.getRelationships().forEach(function (oRlsInst) {
				var sShapeId = oRlsInst.getShapeId();
				var sShapeUid = oRowSettings.getShapeUid(oRlsInst);
				if (!oFilterMap.hasOwnProperty(sShapeId)) {
					oFilterMap[sShapeId] = true;
					oRlsInst.setProperty("shapeUid", sShapeUid, true);
					oRlsInst.renderElement(oRm, oRlsInst, oGantt.getId());
				}
			});
		};

		if (Device.browser.msie) {
			var oTmpCnt = jQuery("<div>").attr("id", oGantt.getId() + "-rls").get(0);
			var oTarget = jQuery.sap.domById("sap-ui-preserve").appendChild(oTmpCnt);
			oRm.write("<svg>");
			this._eachVisibleRowSettings(oGantt, fnCallRender);
			oRm.write("</svg>");
			oRm.flush(oTarget, true, false);
			jQuery(oRlsCnt).append(jQuery(oTarget).children());
			jQuery(oTarget).remove();
		} else {
			this._eachVisibleRowSettings(oGantt, fnCallRender);
			oRm.flush(oRlsCnt, true, false);
		}
	};

	InnerGanttChartRenderer.renderSvgDefs = function (oRm, oGantt) {
		var oSvgDefs = oGantt.getSvgDefs();
		if (oSvgDefs) {
			oRm.write("<svg");
			oRm.writeAttribute("id", oGantt.getId() + "-svg-psdef");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addStyle("float", "left");
			oRm.addStyle("width", "0px");
			oRm.addStyle("height", "0px");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write(oSvgDefs.getDefString());
			oRm.write("</svg>");
		}
	};

	InnerGanttChartRenderer.renderCalendarPattern = function(oRm, oGantt) {
		var oPatternDef = oGantt.getCalendarDef(),
			sGanttId = oGantt.getId(),
			iRenderedWidth = oGantt.iGanttRenderedWidth;
		if (oPatternDef && oPatternDef.getDefNode() && oPatternDef.getDefNode().defNodes && iRenderedWidth > 0) {
			var defNode = oPatternDef.getDefNode();
			var defId = sGanttId + "-calendardefs";

			oRm.write("<defs");
			oRm.writeAttribute("id", defId);
			oRm.write(">");

			for (var iIndex = 0; iIndex < defNode.defNodes.length; iIndex++) {
				var oNode = defNode.defNodes[iIndex];
				oRm.write("<pattern");
				oRm.writeAttribute("id", oNode.id);
				oRm.addClass("calendarPattern");
				oRm.writeClasses();
				oRm.writeAttribute("patternUnits", "userSpaceOnUse");
				oRm.writeAttribute("x", 0);
				oRm.writeAttribute("y", 0);
				oRm.writeAttribute("width", iRenderedWidth);
				oRm.writeAttribute("height", 32);
				oRm.write(">");

				for (var iIndex2 = 0; iIndex2 < oNode.timeIntervals.length; iIndex2++) {
					var ti = oNode.timeIntervals[iIndex2];
					oRm.write("<rect");
					oRm.writeAttribute("x", ti.x);
					oRm.writeAttribute("y", ti.y);
					oRm.writeAttribute("width", ti.width);
					oRm.writeAttribute("height", 32);
					oRm.writeAttribute("fill", ti.fill);
					oRm.write("/>");
				}

				oRm.write("</pattern>");
			}

			oRm.write("</defs>");
		}

	};

	InnerGanttChartRenderer.renderCalendarShapes = function(oRm, oGantt) {
		oRm.write("<g");
		oRm.addClass("sapGanttChartCalendar");
		oRm.writeClasses();
		oRm.write(">");

		var aRowStates = oGantt.getSyncedControl().getRowStates();
		this._eachVisibleRowSettings(oGantt, function(oRowSetting) {
			var mPosition = RenderUtils.calcRowDomPosition(oRowSetting, aRowStates);
			oRowSetting.getCalendars().forEach(function(oCalendar){
				oCalendar.setProperty("rowYCenter", mPosition.rowYCenter, true);
				oCalendar._iBaseRowHeight = mPosition.rowHeight;
				oCalendar.renderElement(oRm, oCalendar);
			});
		});

		oRm.write("</g>");
	};

	InnerGanttChartRenderer.renderExpandedRowBackground = function(oRm, oGantt) {
		var aData = oGantt.getExpandedBackgroundData();
		if (jQuery.isEmptyObject(aData)) { return; }

		oGantt._oExpandModel.refreshRowYAxis(oGantt.getTable());

		var aExpandedData = Array.prototype.concat.apply([], aData);

		var iWidth = oGantt.iGanttRenderedWidth;

		oRm.write("<g");
		oRm.addClass("sapGanttChartRowBackground");
		oRm.writeClasses();
		oRm.write(">");

		for (var iIndex = 0; iIndex < aExpandedData.length; iIndex++) {
			var d = aExpandedData[iIndex];
			oRm.write("<g");
			oRm.addClass("expandedRow");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<rect");
			oRm.writeAttribute("x", d.x);
			oRm.writeAttribute("y", d.y);
			oRm.writeAttribute("height", d.rowHeight - 1);
			oRm.writeAttribute("width", "100%");
			oRm.writeAttribute("class", "sapGanttExpandChartCntBG");
			oRm.write(">");
			oRm.write("</rect>");

			oRm.write("<path");
			oRm.addClass("sapGanttExpandChartLine");
			oRm.writeClasses();
			oRm.writeAttribute("d", "M0 " + (d.y - 1) + " H" + (iWidth - 1));
			oRm.write("/>");

			oRm.write("</g>");
		}

		oRm.write("</g>");
	};

	return InnerGanttChartRenderer;

}, /* bExport= */ true);
