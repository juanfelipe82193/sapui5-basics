define("zen.rt.components/resources/js/gridcell_handler", ["sap/zen/basehandler"], function(BaseHandler){
	var dispatcher = BaseHandler.dispatcher;
	
	// ////////////////////////////////////////////
	
	$.sap.require("sap.zen.commons.layout.MatrixLayout");

	var GridLayoutCellHandler = function () {
		"use strict";

		BaseHandler.apply(this, arguments);

		var that = this;

		this.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet,
				oArgForFunclet) {

			var oControl = createCellWithAbsolutePositionContainer();
			init(oControl, oControlProperties);
			fAppendToParentFunclet(oControl, oArgForFunclet);

			return oControl;
		};

		this.updateComponent = function (oControl, oControlProperties) {
			if (oControlProperties) {
				init(oControl, oControlProperties);
			}
			return oControl;
		};

		this.doD4LStuff0 = function(){
		};
		

		this.doD4LStuff1 = function(){
		};
		
		function init (oControl, oControlProperties) {
			if (oControlProperties) {
				var oAbsLayout = oControl.getContent()[0];
				var aChildren = oControlProperties.content;

				if (aChildren) {
					that.updateChildren(aChildren, oControl, function (oNewControl, iIndex) {
						that.doD4LStuff0(oAbsLayout, oNewControl);
						dispatcher.insertIntoAbsoluteLayoutContainer(oAbsLayout, oNewControl, iIndex);
					}, function(oControlToRemove) {
						oAbsLayout.removeContent(oControlToRemove);
					});
				}
			}
		}

		this.applyForChildren = function (oCell, funclet) {
			var result = {};
			var absLayout = oCell.getContent()[0];
			var children = absLayout.getContent();
			for ( var i = 0; i < children.length; i++) {
				var oControl = children[i];
				if (oControl) {
					funclet(oControl, i);
				}
			}
			return result;
		};


		var createCellWithAbsolutePositionContainer = function () {
			var oCell = new sap.zen.commons.layout.MatrixLayoutCell();
			that.doD4LStuff1(oCell);
			oCell.setVAlign("Top");
			oCell.setPadding(sap.zen.commons.layout.Padding.None);
			var oAbsLayout = that.createAbsoluteLayout();
			oAbsLayout.addStyleClass("zenborder");
			oCell.addContent(oAbsLayout);
			return oCell;
		};
		
		this.getType = function() {
			return "gridcell";
		};
		
		this.getDecorator = function() {
			return "GridCellDecorator";
		};

	};
	return new GridLayoutCellHandler();
});

define("zen.rt.components/resources/js/gridcellsimple_handler", ["sap/zen/basehandler"], function(BaseHandler){

	//////////////////////////////////////////////

	var GridLayoutCellSimpleHandler = function () {
		"use strict";

		BaseHandler.apply(this, arguments);

		var that = this;

		this.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet,
				oArgForFunclet) {

			var oControl = new sap.zen.commons.layout.MatrixLayoutCell();
			init(oControl, oControlProperties);
			fAppendToParentFunclet(oControl, oArgForFunclet);

			return oControl;
		};

		this.updateComponent = function (oControl, oControlProperties) {
			if (oControlProperties) {
				init(oControl, oControlProperties);
			}
			return oControl;
		};

		this.doD4LStuff = function(){
		};
		

		this.doD4LStuff1 = function(){
		};
		
		function init (oControl, oControlProperties) {
			if (oControlProperties) {
				var aChildren = oControlProperties.content;

				if (aChildren) {
					that.updateChildren(aChildren, oControl, function (oNewControl) {
						that.doD4LStuff(oNewControl);
						oControl.addContent(oNewControl);
					}, function(oControlToRemove) {
						oControl.removeContent(oControlToRemove);
					});
				}
			}
		}

		this.applyForChildren = function (oCell, funclet) {
			var result = {};
			var children = oCell.getContent();
			for ( var i = 0; i < children.length; i++) {
				var oControl = children[i];
				if (oControl) {
					funclet(oControl, i);
				}
			}
			return result;
		};
		
		this.getType = function() {
			return "gridcellsimple";
		};
		
		this.getDecorator = function() {
			return "GridCellDecorator";
		};

	};
	
	return new GridLayoutCellSimpleHandler();
});

	
define("zen.rt.components/resources/js/gridlayout_handler", 
		["sap/zen/basehandler", "./gridcell_handler", "./gridcellsimple_handler"], function(BaseHandler, cellHandler, cellSimpleHandler){
	var dispatcher = BaseHandler.dispatcher;
	sapbi_registerHandlers([cellHandler, cellSimpleHandler]);


	var GridLayoutHandler = function () {
		"use strict";
		
		BaseHandler.apply(this, arguments);

		
		var that = this;
	
		var removeFromParent = function(oCellToDelete) {
			oCellToDelete.getParent().removeCell(oCellToDelete);
		};
		
		
		this.doD4LStuff0 = function(){
			return false;
		}
		
		this.doD4LStuff1 = function(){
			
		}
		
		function init (oGrid, oControlProperties, oComponentProperties, iColCount) {
	
			that.updateChildren(oControlProperties.content, oGrid, function (oNewCell, iIndex) {
				var iRowIndex = Math.floor(iIndex / iColCount);
				var oRow = oGrid.getRows()[iRowIndex];
				if(!that.doD4LStuff0(oNewCell,oGrid,oRow,iIndex)){
					oRow.addCell(oNewCell);
				}
			}, removeFromParent);
			that.doD4LStuff1(oGrid);
		}
		
		
		this.addD4LStyleClassToRow = function(){
			
		};
		
		this.addD4LStyleClassToTable = function(){
			
		};
	
		this.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, iIndex) {
			var rowDefinitions = oControlProperties.rows;
			var colDefinitions = oControlProperties.cols;
			var rowCnt = -1;
			var colCnt = -1;
			var rowHeightsPercent = getRowHeightsInPercent(rowDefinitions);
			var colWidthsPercent = getColumnWidthsInPercent(colDefinitions);
			var i;
	
			if (rowDefinitions != null) {
				rowCnt = rowDefinitions.length;
			}
	
			if (colDefinitions != null) {
				colCnt = colDefinitions.length;
			}
	
			var id = oControlProperties["id"];
			var oTable = new sap.zen.commons.layout.MatrixLayout({
				id: id,
				layoutFixed: false,
				width: "100%",
				height: "100%"
			});
			this.addD4LStyleClassToTable(oTable);
			
			oTable.newGrid = true;
	
			fAppendToParentFunclet(oTable, iIndex);
			sap.zen.Dispatcher.instance.updateComponentProperties(oTable, oComponentProperties);
	
			for (i = 0; i < rowCnt; i++) {
				var oRow = new sap.zen.commons.layout.MatrixLayoutRow();
				this.addD4LStyleClassToRow(oRow);
				setRowHeight(oRow, rowHeightsPercent[i]);
				oTable.addRow(oRow);
	
			}
	
			if (colCnt !== -1) {
				oTable.setColumns(colCnt);
				var colWidthArray = [];
				for (i = 0; i < colCnt; i++) {
					colWidthArray[i] = colWidthsPercent[i] + "%";
				}
				oTable.setWidths(colWidthArray);
			}
	
			init(oTable, oControlProperties, oComponentProperties, colCnt);
	
			return oTable;
		};
	
		this.update = function (oControl, oControlProperties, oComponentProperties) {
			if (!oControl) {
				return;
			}
			if (!oControlProperties) {
				return;
			}
	
			var oTable = oControl;
			var oRow;
	
			var rowDefinitions = oControlProperties.rows;
			var colDefinitions = oControlProperties.cols;
	
			if (rowDefinitions || colDefinitions) {
				var oldRowsCnt = oTable.getRows().length;
	
				var newRowsCnt = rowDefinitions.length;
				var newColsCnt = colDefinitions.length;
	
				// rows
				var rowHeightsPercent = getRowHeightsInPercent(rowDefinitions);
				for ( var iRow = 0; iRow < oldRowsCnt; iRow++) {
					oRow = oTable.getRows()[iRow];
					setRowHeight(oRow, rowHeightsPercent[iRow]);
				}
	
				for (iRow = oldRowsCnt; iRow < newRowsCnt; iRow++) {
					oRow = new sap.zen.commons.layout.MatrixLayoutRow();
					this.addD4LStyleClassToRow(oRow);
					oTable.addRow(oRow);
					setRowHeight(oRow, rowHeightsPercent[iRow]);
				}
	
				
				// Remove rows back to front because of how UI5 works
					for (iRow = oldRowsCnt-1; iRow >= newRowsCnt; iRow--) {
						var allCellsToRemove = oTable.getRows()[iRow].getCells();
						//We have to do this here because the dispatcher wont take care of it otherwise, leaving decorators hanging
						//Was fone for D4l, but seems viable in all situations...
						for (var colIndex = 0; colIndex < allCellsToRemove.length; colIndex++) {
							dispatcher.addTransferControl(allCellsToRemove[colIndex],removeFromParent);
						}
						oTable.removeRow(iRow);
					}
	
				// columns
				var colWidthsPercent = getColumnWidthsInPercent(colDefinitions);
	
				var colWidthArray = [];
				for ( var iCol = 0; iCol < colDefinitions.length; iCol++) {
					colWidthArray[iCol] = colWidthsPercent[iCol] + "%";
				}
				oTable.setWidths(colWidthArray);
				
				oTable.setColumns(colDefinitions.length);
				init(oControl, oControlProperties, oComponentProperties, newColsCnt);
	
			}
	
	
		};
	
	
		// helper methods
	
		this.applyForChildren = function (oGrid, funclet) {
			var rows = oGrid.getRows();
			var rowIndex;
			var colIndex;
			for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
				var cells = rows[rowIndex].getCells();
				for (colIndex = 0; colIndex < cells.length; colIndex++) {
					var cell = cells[colIndex];
					funclet(cell);
				}
			}
		};
	
		var getRowHeightsInPercent = function (rowDefinitions) {
			var rowHeightsPercent = null;
			if (rowDefinitions != null) {
				var rowCnt = rowDefinitions.length;
				var rowHeights = [];
				for ( var i = 0; i < rowCnt; i++) {
					rowHeights[i] = parseInt(rowDefinitions[i].row.height, 10);
				}
				rowHeightsPercent = convertRelativeGridSizesToPercentages(rowHeights);
			}
			return rowHeightsPercent;
		};
	
		var getColumnWidthsInPercent = function (colDefinitions) {
			var colWidthsPercent = null;
			if (colDefinitions != null) {
				var colCnt = colDefinitions.length;
				var colWidths = [];
				for ( var i = 0; i < colCnt; i++) {
					colWidths[i] = parseInt(colDefinitions[i].col.width, 10);
				}
				colWidthsPercent = convertRelativeGridSizesToPercentages(colWidths);
			}
			return colWidthsPercent;
		};
	
		var setRowHeight = function (oRow, rowHeightPercent) {
			if (rowHeightPercent) {
				oRow.setHeight(rowHeightPercent + "%");
			} else {
				oRow.setHeight("100%");
			}
		};
	
		function roundToZero(number) {
			if (number >= 0) {
				return Math.floor(number);
			} else {
				return -1 * Math.floor(-1 * number);
			}
		}
		
		var convertRelativeGridSizesToPercentages = function (sizes) {
			var percentages = [];
	
			var sum = 0.;
			var i;
			var roundVariance = 0.;
			for (i = 0; i < sizes.length; i++) {
				sum += sizes[i];
			}
			var factor = 100. / sum;
			sum = 0;
			// WebKit browsers only allow integers percentages (decimals lead to strange behaviours). Therefore we distribute the percentage values best using the original numbers:
			// We take the exact number, round it and aggregate the rounding error. If it becomes higher than 1/lower than -1, we correct the current percentage by 1%.
			// The last cell gets the rest to have exactly 100% in sum.
			for (i = 0; i < sizes.length - 1; i++) {
				var size = sizes[i] * factor;
				var sizeRounded = Math.round(size) ;
				roundVariance += (size - sizeRounded);
				var roundVarianceFloor = roundToZero(roundVariance);			
				percentages[i] = sizeRounded + roundVarianceFloor;
				sum += percentages[i];
				roundVariance = roundVariance - roundVarianceFloor;
			}
			percentages[sizes.length - 1] = 100 - sum;
	
			return percentages;
		};
	
		this.testAccessor = {
			getRowHeightsInPercent: getRowHeightsInPercent,
			getColumnWidthsInPercent: getColumnWidthsInPercent,
			convertRelativeGridSizesToPercentages: convertRelativeGridSizesToPercentages
		};
		
		
		this.getDecorator = function() {
			return "GridDecorator";
		};
		
		this.getType = function() {
			return "gridlayout";
		};

	
	};
	return new GridLayoutHandler();

});
