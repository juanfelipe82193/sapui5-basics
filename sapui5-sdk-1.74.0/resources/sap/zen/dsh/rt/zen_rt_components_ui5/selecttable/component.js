sap.designstudio.sdk.Component.subclass("com.sap.ip.bi.SelectionTable", function() {

	var CSS_CLASS_DIV = "sapzencrosstab-TableDiv";
	var CSS_CLASS_TABLE = "sapzencrosstab-Crosstab";
	var CSS_CLASS_TR = "sapzencrosstab-HeaderRow sapzencrosstab-DimensionHeaderArea";
	var CSS_CLASS_TD_HEADER = "sapzencrosstab-HeaderCellDefault";
	var CSS_CLASS_TD_HEADER_BOLD = "sapzencrosstab-HeaderCellDefault sapzencrosstab-HeaderCellTotal";
	var CSS_CLASS_TD_DEFAULT_EVEN = "sapzencrosstab-DataCellDefault";
	var CSS_CLASS_TD_DEFAULT_ODD = "sapzencrosstab-DataCellDefault sapzencrosstab-DataCellAlternating";
	var CSS_CLASS_TD_DEFAULT_BOLD_EVEN = "sapzencrosstab-DataCellDefault sapzencrosstab-DataCellTotal";
	var CSS_CLASS_TD_DEFAULT_BOLD_ODD = "sapzencrosstab-DataCellDefault sapzencrosstab-DataCellTotal sapzencrosstab-DataCellAlternating";
	var CSS_CLASS_COLLAPSE_NODE = "sapzencrosstab-CollapseNode";
	var CSS_CLASS_EXPAND_NODE = "sapzencrosstab-ExpandNode";
	var CSS_CLASS_HIERARCHY = "sapzencrosstab-HeaderCellDivHierarchy";
	var CSS_CLASS_SELECT_DATA_CELL = "sapzencrosstab-DataCellSelectData";
	var CSS_CLASS_HOVER_ROW_HEADER_CELL = "sapzencrosstab-HoverDataCell";
	var CSS_CLASS_HEADER_CELL_DEFAULT = "sapzencrosstab-HeaderCellDefault";
	
	var DATA_DIM = "data-dim-";

	var that = this;
	
	var data = null;
	var visSelection = undefined;
	var _selectionShape = 2;


	var numCols = 0;
	var numRows = 0;
	var numColTuples = 0;
	var numRowTuples = 0;
	var numColsOfData = 0;
	var numRowsOfData = 0;

	var arrColspan = [];
	var arrRowspan = [];
	var arrText = [];
	var arrType = [];
	var arrDataAttributes = [];
	
	this.init = function() {
		this.$().addClass(CSS_CLASS_DIV);
		this.$().css("overflow-x", "scroll");
		this.$().css("overflow-y", "scroll");
	};

	this.afterUpdate = function() {
		if (this.jqTable == null && data && data.formattedData &&  data.formattedData.length > 0) {
			computeTableLayout();

			arrColspan = newArray(numCols, numRows);
			arrRowspan = newArray(numCols, numRows);
			arrText = newArray(numCols, numRows);
			arrType = newArray(numCols, numRows);
			arrDataAttributes = newArray(numCols, numRows);

			applyTopLeftCorner();
			applyColumnHeaders();
			applyRowHeaders();
			applyData();

			renderTable();
		}
	};

	function computeTableLayout() {
		var colAxis = data.axis_columns;
		numColsOfData = colAxis.length;

		var rowAxis = data.axis_rows;
		numRowsOfData = rowAxis.length;

		numColTuples = 0;
		var sampleColAxisTuple = colAxis[0];
		for (var i = 0; i < sampleColAxisTuple.length; i++) {
			if (sampleColAxisTuple[i] > -1) {
				numColTuples++;
			}
		}
		numRowTuples = sampleColAxisTuple.length - numColTuples;

		numCols = numRowTuples + numColsOfData;
		numRows = numColTuples + numRowsOfData;
	}

	function newArray(x, y) {
		var array = new Array(x);
		for (var i = 0; i < x; i++) {
			array[i] = new Array(y);
		}
		return array;
	}

	function applyTopLeftCorner() {
		markSpannedCellRectangle(0, 0, numRowTuples, numColTuples);

		arrColspan[0][0] = numRowTuples;
		arrRowspan[0][0] = numColTuples;
		arrText[0][0] = "";
		arrType[0][0] = "topleft";
	}

	function markSpannedCellRectangle(arrCol, arrRow, colspan, rowspan) {
		for (var i = arrRow; i < arrRow + rowspan; i++) {
			for (var j = arrCol; j < arrCol + colspan; j++) {
				arrColspan[j][i] = -1;
				arrRowspan[j][i] = -1;
			}
		}
	}

	function isCellHiddenBySpan(arrCol, arrRow) {
		var colspan = arrColspan[arrCol][arrRow];
		if (colspan === -1) {
			return true;
		}
		var rowspan = arrRowspan[arrCol][arrRow];
		if (rowspan === -1) {
			return true;
		}
		return false;
	}

	function getHeaderText(member) {
		var text = "";
		var level = member.level;
		if (level) {
			for (var i = 0; i < level; i++) {
				text += "&nbsp;&nbsp;";
			}
			var styleClass = "";
			var nodeState = member.nodeState;
			if (nodeState) {
				styleClass = (nodeState === "EXPANDED") ? CSS_CLASS_COLLAPSE_NODE : CSS_CLASS_EXPAND_NODE;
			}
			text += "<span style=\"display: inline-block; vertical-align: middle\" class=\"" + CSS_CLASS_HIERARCHY + " " + styleClass + "\"></span>";
			text += "&nbsp;" + member.text;
		} else {
			text = member.text;
		}
		return text;
	}

	function applyColumnHeaders() {
		var OFFSET_COLS = numRowTuples;
		for (var row = 0; row < numColTuples; row++) {
			for (var col = 0; col < numColsOfData; col++) {
				if (!isCellHiddenBySpan(OFFSET_COLS + col, row)) {
					var colspan = computeColHeaderColspan(col, row);
					var rowspan = computeColHeaderRowspan(col, row);
					markSpannedCellRectangle(OFFSET_COLS + col, row, colspan, rowspan);

					var memberIndex = data.axis_columns[col][row];
					var colMember = data.dimensions[row].members[memberIndex];
					var text = getHeaderText(colMember);
					var type = colMember.type;
					arrColspan[OFFSET_COLS + col][row] = colspan;
					arrRowspan[OFFSET_COLS + col][row] = rowspan;
					arrText[OFFSET_COLS + col][row] = text;
					arrType[OFFSET_COLS + col][row] = (type === "RESULT") ? "header-bold" : "header";
					arrDataAttributes[OFFSET_COLS + col][row] = DATA_DIM + row + "=" + memberIndex;

					col += colspan - 1;
				}
			}
		}
	}

	function computeColHeaderColspan(col, row) {
		var colspan = 1;
		var index = data.axis_columns[col][row];
		for (var i = col + 1; i < data.axis_columns.length; i++) {
			var nextIndex = data.axis_columns[i][row];
			if (index === nextIndex) {
				// end colspan if "parent" tuples of next column are not the same
				for (var j = 0; j < row; j++) {
					var parentIndex = data.axis_columns[col][j];
					var parentIndexToCompare = data.axis_columns[i][j];
					if (parentIndex !== parentIndexToCompare) {
						return colspan;
					}
				}
				colspan++;
			} else {
				break;
			}
		}
		return colspan;
	}

	function computeColHeaderRowspan(col, row) {
		var rowspan = 1;
		var colMember = data.dimensions[row].members[data.axis_columns[col][row]];
		if (colMember.type === "RESULT") {
			for (var i = row + 1; i < numColTuples; i++) {
				var colMemberToCompare = data.dimensions[i].members[data.axis_columns[col][i]];
				if (colMemberToCompare.type === "RESULT") {
					rowspan++;
				} else {
					break;
				}
			}
		}
		return rowspan;
	}

	function applyRowHeaders() {
		var DIM_OFFSET = numColTuples;
		var OFFSET_ROWS = numColTuples;
		for (var col = 0; col < numRowTuples; col++) {
			for (var row = 0; row < numRowsOfData; row++) {
				if (!isCellHiddenBySpan(col, OFFSET_ROWS + row)) {
					var colspan = computeRowHeaderColspan(col, row);
					var rowspan = computeRowHeaderRowspan(col, row);
					markSpannedCellRectangle(col, OFFSET_ROWS + row, colspan, rowspan);

					var dimIndex = DIM_OFFSET+ col;
					var memberIndex = data.axis_rows[row][dimIndex];
					var rowMember = data.dimensions[dimIndex].members[memberIndex];
					var text = getHeaderText(rowMember);
					var type = rowMember.type;

					arrColspan[col][OFFSET_ROWS + row] = colspan;
					arrRowspan[col][OFFSET_ROWS + row] = rowspan;
					arrText[col][OFFSET_ROWS + row] = text;
					arrType[col][OFFSET_ROWS + row] = (type === "RESULT") ? "header-bold" : "header";
					arrDataAttributes[col][OFFSET_ROWS + row] = DATA_DIM + dimIndex + "=" + memberIndex;

					row += rowspan - 1;
				}
			}
		}
	}

	function computeRowHeaderRowspan(col, row) {
		var DIM_OFFSET = numColTuples;
		var rowspan = 1;
		var index = data.axis_rows[row][DIM_OFFSET + col];
		for (var i = row + 1; i < data.axis_rows.length; i++) {
			var nextIndex = data.axis_rows[i][DIM_OFFSET + col];
			if (index === nextIndex) {
				// end rowspan if "parent" tuples of next row are not the same
				for (var j = 0; j < col; j++) {
					var parentIndex = data.axis_rows[row][DIM_OFFSET + j];
					var nextParentIndex = data.axis_rows[i][DIM_OFFSET + j];
					if (parentIndex !== nextParentIndex) {
						return rowspan;
					}
				}
				rowspan++;
			} else {
				break;
			}
		}
		return rowspan;
	}

	function computeRowHeaderColspan(col, row) {
		var DIM_OFFSET = numColTuples;
		var colspan = 1;
		var rowMember = data.dimensions[DIM_OFFSET + col].members[data.axis_rows[row][DIM_OFFSET + col]];
		if (rowMember.type === "RESULT") {
			for (var i = col + 1; i < numRowTuples; i++) {
				var rowMemberToCompare = data.dimensions[DIM_OFFSET + i].members[data.axis_rows[row][DIM_OFFSET + i]];
				if (rowMemberToCompare.type === "RESULT") {
					colspan++;
				} else {
					break;
				}
			}
		}
		return colspan;
	}

	function applyData() {
		var OFFSET_COLS = numRowTuples;
		var OFFSET_ROWS = numColTuples;
		var dataIndex = 0;
		for (var row = 0; row < numRowsOfData; row++) {
			for (var col = 0; col < numColsOfData; col++) {
				arrColspan[OFFSET_COLS + col][OFFSET_ROWS + row] = 1;
				arrRowspan[OFFSET_COLS + col][OFFSET_ROWS + row] = 1;
				arrText[OFFSET_COLS + col][OFFSET_ROWS + row] = data.formattedData[dataIndex];
				arrType[OFFSET_COLS + col][OFFSET_ROWS + row] = computeTypeOfData(col, row);
				arrDataAttributes[OFFSET_COLS + col][OFFSET_ROWS + row] = computeDataAttributes(data.tuples[dataIndex]);
				dataIndex++;
			}
		}
	}
	
	function computeDataAttributes(tuple) {
		var result = "";
		for (var i = 0; i < tuple.length; i++) {
			result += DATA_DIM + i + "=" + tuple[i] + " ";
		}
		return result;
	}
	
	function computeTypeOfData(col, row) {
		if (isResultData(col, row)) {
			return (row % 2 == 0) ? "data-bold-even" : "data-bold-odd";
		}
		return (row % 2 == 0) ? "data-even" : "data-odd";
	}

	function isResultData(col, row) {
		var colTuple = data.axis_columns[col], i;
		for (i = 0; i < numColTuples; i++) {
			var colMember = data.dimensions[i].members[colTuple[i]];
			if (colMember.type === "RESULT") {
				return true;
			}
		}
		var DIM_OFFSET = numColTuples;
		var rowTuple = data.axis_rows[row];
		for (i = 0; i < numRowTuples; i++) {
			var rowMember = data.dimensions[DIM_OFFSET + i].members[rowTuple[DIM_OFFSET + i]];
			if (rowMember.type === "RESULT") {
				return true;
			}
		}
		return false;
	}

	function renderTable() {
		that.$().empty();
		var html = "<table class=\"" + CSS_CLASS_TABLE + "\">";
		
		for (var row = 0; row < numRows; row++) {
			html += "<tr class=\"" + CSS_CLASS_TR + "\">";

			for (var col = 0; col < numCols; col++) {
				if (!isCellHiddenBySpan(col, row)) {
					var style = "";
					var type = arrType[col][row];
					switch (type) {
					case "topleft":
					case "header":
						style = CSS_CLASS_TD_HEADER;
						break;
					case "header-bold":
						style = CSS_CLASS_TD_HEADER_BOLD;
						break;
					case "data-odd":
						style = CSS_CLASS_TD_DEFAULT_ODD;
						break;
					case "data-bold-odd":
						style = CSS_CLASS_TD_DEFAULT_BOLD_ODD;
						break;
					case "data-even":
						style = CSS_CLASS_TD_DEFAULT_EVEN;
						break;
					case "data-bold-even":
						style = CSS_CLASS_TD_DEFAULT_BOLD_EVEN;
						break;
					}
					var colspan = arrColspan[col][row];
					var rowspan = arrRowspan[col][row];
					var text = arrText[col][row];
					var dataAttributes = arrDataAttributes[col][row];
					dataAttributes = (!dataAttributes) ? "" : " " + dataAttributes;
					
					if (colspan > 1) {
						dataAttributes += " colspan=" + colspan;
					}
					if (rowspan > 1) {
						dataAttributes += " rowspan=" + rowspan;
					}
					dataAttributes += " class='" + style + "'";
					html += "<td" + dataAttributes + ">" +  text + "</td>";
					col += colspan - 1; // modest peformance improvement
				}
			}
			html +="</tr>";
		}
		html +="</table>";
		that.jqTable = $(html);
		that.jqTable.click(onCellClick);

		that.$().append(that.jqTable);
		renderVisualSelection();
	}
	
	function onCellClick(e) {
		var dataCell=$(e.target).hasClass(CSS_CLASS_TD_DEFAULT_EVEN);
		if (!dataCell && _selectionShape === 0)
			return;
		getVisSelection(dataCell);
		jQuery.each(e.target.attributes, function(index, value) {
			if (value.name.indexOf(DATA_DIM) === 0) { 
				var dimIndex = parseInt(value.name.substring(DATA_DIM.length), 10);
				var memberIndex = parseInt(value.value);
				var currentSelection = visSelection[dimIndex];
				visSelection[dimIndex] = toggleInArray(currentSelection, memberIndex);									
			}
		});
		that.firePropertiesChangedAndEvent(["visSelection", "currrentSelectionShape"], "onSelect");	
	}
	
	function getVisSelection(bClear) {
		if (!visSelection || bClear) {
			visSelection = data.dimensions.map(function() {return [];});			
		}
		return visSelection;
	}
	
	function toggleInArray(aValues, val) {
		var result = [];
		var bFound = false;
		for (var i=0; i<aValues.length; i++) {
			var v = aValues[i];
			if (v < val) {
				result.push(v);
			} else if (v === val) {
				bFound = true;
			} else {
				if (!bFound) {
					result.push(val)
					bFound = true;
				}
				result.push(v);
			} 
		}
		if (!bFound) {
			result.push(val);
		}
		return result;
	}
	
	
	
	function increaseIndexesArray(indexesArray) {
		var overflow = 1;
		for (var i=0; i<indexesArray.length; i++) {
			var current = indexesArray[i];
			current = current + overflow;
			if (current <visSelection[i].length) {
				indexesArray[i] = current;
				return true;
			} else {
				indexesArray[i] = 0;
				overflow = 1;
			}
		}
		return overflow == 0;

	}
	function renderVisualSelection() {
		if (that.jqTable) {
			$("." + CSS_CLASS_SELECT_DATA_CELL, that.jqTable).removeClass(CSS_CLASS_SELECT_DATA_CELL);
			$("." + CSS_CLASS_HOVER_ROW_HEADER_CELL, that.jqTable).removeClass(CSS_CLASS_HOVER_ROW_HEADER_CELL);
			var indexesArray = getVisSelection().map(function() {return 0;});
			do {
				var sjQuerySelector = "";
				jQuery.each(visSelection, function(iIndex, values) {
						var value = values[indexesArray[iIndex]];
						if (value !== undefined) {
							var line = "[data-dim-" + iIndex + "=\"" + value + "\"]";
							sjQuerySelector += line;
							$("." + CSS_CLASS_HEADER_CELL_DEFAULT +line, that.jqTable).addClass(CSS_CLASS_HOVER_ROW_HEADER_CELL);
						}
				});
				var cellsToHighlight = $(sjQuerySelector, that.jqTable);
				cellsToHighlight.addClass(CSS_CLASS_SELECT_DATA_CELL);
			} while(increaseIndexesArray(indexesArray));
		}
	}

	// property setter/getter functions

	this.data = function(value) {
		if (value === undefined) {
			return data;
		} else {
			data = value;
			this.jqTable = null;
			return this;
		}
	};
	
	this.visSelection = function(value) {
		if (value === undefined) {
			var jsonResult = {};
			// map "visSelection", e.g. {0:0, 1:0} -> "jsonResult", e.g. {"0CALYEAR":"2003", "0CALQUART1":"1"}
			jQuery.each(getVisSelection(false), function(index, value) {
				var dim = data.dimensions[index];
				var dimName = dim.key;
				if (dim.containsMeasures) {
					dimName = "(MEASURES_DIMENSION)";
				}
				if (value.length === 1) {
					jsonResult[dimName] = stringfySinlgeMember(dim, value[0]);									
				} else if (value.length > 1) {
					jsonResult[dimName] = value.map(function(i) {return stringfySinlgeMember(dim, i)});
				}
			});
			return JSON.stringify(jsonResult);
		} else {
			if (value !== "" && data) {
			
			    getVisSelection(true);
				// map "value", e.g. {"0CALYEAR":"2003", "0CALQUART1":"1"} -> "visSelection", e.g. {0:0, 1:0}
				try {
					var jsonValue = JSON.parse(value);
					for (var dimName in jsonValue) {
						if (jsonValue.hasOwnProperty(dimName)) {					
							var dimIndex = findDimensionIndexByName(dimName);
							var members = jsonValue[dimName];
							if (Array.isArray(members)) {
								visSelection[dimIndex] = members.map(function(member) {
									return findMemberIndexByName(dimIndex, member)
								});
							} else {
								var memberIndex = findMemberIndexByName(dimIndex, members);
								visSelection[dimIndex] = [memberIndex];																
							}
							
						}
					}
					renderVisualSelection();					
				} catch (e) {
					// Ignore
				}
			}
			return this;
		}
	};
	
	function stringfySinlgeMember(dim, value) {
		var member = dim.members[value];
		var memberName = member.key;
		if (member.type === "RESULT") {
			memberName = "(RESULT_MEMBER)";
		}
		return memberName;		
	}

	// TODO: externalDimensions
	function findDimensionIndexByName(dimName) {
		var dimensions = data.dimensions;
		for (var i = 0; i < dimensions.length; i++) {
			if (dimName === "(MEASURES_DIMENSION)" && dimensions[i].containsMeasures) {
				return i;
			}
				
			var dimNameToCompare = dimensions[i].key;
			if (dimName === dimNameToCompare) {
				return i;
			}
		}
		throw "Dimension " + dimName + " not found";
	}
	
	function findMemberIndexByName(dimIndex, memberName) {
		var members = data.dimensions[dimIndex].members;
		for (var i = 0; i < members.length; i++) {
			if (memberName === "(RESULT_MEMBER)" && members[i].type === "RESULT") {
				return i;
			}
			var memberNameToCompare = members[i].key;
			if (memberName === memberNameToCompare) {
				return i;
			}
		}
		throw "Member " + memberName + " not found";
   }
	
	this.currrentSelectionShape = function(value) {
		if (value !== undefined)
			return this;
		
		var bCOLShasNoSelection = false;
		var bROWSHasNoSelection = false;
		for (var i=0; i<data.dimensions.length; i++) {
			var dim=data.dimensions[i];
			if (getVisSelection(false)[i].length === 0) {
				if (dim.axis === "ROWS")
					bROWSHasNoSelection = true;
				else
					bCOLShasNoSelection = true;
			}			
		}
		if (bCOLShasNoSelection && bROWSHasNoSelection)
			return 2;
		if (bCOLShasNoSelection || bROWSHasNoSelection)
			return 1;
		return 0;
	};
	
	this.selectionShape = function(value) {
		if (value === undefined) {
			return _selectionShape;
		}
		_selectionShape = value;
		return this;		
	};
});
