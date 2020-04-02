define("zen.rt.components.sdk/resources/js/databuffer", ["./component", "./datasource"], function(Component, DataSource) {

	/**
	 * Base class for all SDK data sources that want to use the that.buffer feature.
	 */
	var DataBuffer =  function(phxOwner, initialBuffer) {
		DataSource.call(this, phxOwner);
		
		var buffer_empty = {
			data: [],
			formattedData: [],
			tuples: [],
			axis_columns: [],
			axis_rows: [],
			dimensions: []
		};
	
		var that = this;
		if (initialBuffer) {
			this.buffer = initialBuffer;
			this.buffer.formattedData = this.buffer.formattedData || this.buffer.data; 
		} else {
			this.buffer = jQuery.extend({}, buffer_empty);			
		}
	
		this.projectData = function(sSelection, oOptions) {
			var selection, col, x, xTuple;
			if (Array.isArray(sSelection)) {
				selection = sSelection;			
			}
			else {
				selection = this.getIndexSelection(sSelection);			
			}
			
			var result = {};
			oOptions = oOptions || {};
			if (oOptions.allDataOnEmptySelection === false && isIndexSelectionEmpty(selection)) {
				return undefined;
			}
			if (oOptions.selectionShape !== undefined)  {
				var currentShape = getSelectionShape(selection);
				if (currentShape > oOptions.selectionShape) {
					return undefined;
				}
		    }
	
			if (oOptions.includeData || oOptions.includeFormattedData || oOptions.includeTuples || oOptions.includeAxesTuples || oOptions.includeConditionalFormats) {
				result.selection = getResultSelection(selection);
				
				if (oOptions.includeData) {
					result.data =  [];					
				}
				if (oOptions.includeFormattedData && this.buffer.formattedData) {
					result.formattedData = [];					
				}
				if (oOptions.includeTuples) {
					result.tuples = [];					
				}
				if (oOptions.includeAxesTuples) {
					result.axis_columns = [];
					result.axis_rows =  [];					
				}
				if (oOptions.includeConditionalFormats && this.buffer.conditionalFormatValues) {
					result.conditionalFormatValues = [];
				}
				var colIndex = this.fillIndex(this.buffer.axis_columns, selection, oOptions);
				var rowIndex = this.fillIndex(this.buffer.axis_rows, selection, oOptions); 			
	
				result.columnCount = colIndex.length;
				result.rowCount = rowIndex.length;
				
				for (var row=0; row<rowIndex.length; row++) {
					var y = rowIndex[row];
					var yTuple = this.buffer.axis_rows[y];
					if (result.axis_rows) {
						result.axis_rows.push(yTuple);						
					}
					
					for (col=0; col<colIndex.length; col++) {
						x = colIndex[col];
						xTuple = this.buffer.axis_columns[x];
						var index = this.buffer.axis_columns.length * y + x;
						var tuple=mergeAxisTuples(xTuple, yTuple);

						this.addResult(result, index, tuple);
					}			
				}	
				if (result.axis_columns) {
					for (col=0; col<colIndex.length; col++) {
						x = colIndex[col];
						xTuple = this.buffer.axis_columns[x];
						result.axis_columns.push(xTuple);
					}								
				}
			}
	
			
			result.dimensions = this.buffer.dimensions;
			if (this.buffer.externalDimensions) {
				result.externalDimensions = this.buffer.externalDimensions;
			}
			result.locale = "en"; // TODO
			return result;
		};
		
		
		this.addResult = function(result, index, tuple) {
			if (result.data) {
				result.data.push(this.buffer.data[index]);				
			}
			if (result.formattedData) {
				result.formattedData.push(this.buffer.formattedData[index]);				
			}
			if (result.tuples) {
				result.tuples.push(tuple);							
			}
			if (result.conditionalFormatValues) {
				result.conditionalFormatValues.push(this.buffer.conditionalFormatValues[index]);
			}
		};
	
		this.fillIndex = function(axis, oSelection, oOptions) {
			var result = [];
			 var aLastTuple = null;
			 var aIndexesForIndexAccess =  createArray(that.buffer.dimensions.length, 0);
	
			axis.forEach(function(axisTuple, i){
				aLastTuple = updateIndexesForIndexAccess(aIndexesForIndexAccess, aLastTuple, axisTuple);
				if (that.tupleMatches(axisTuple, oSelection, oOptions, aIndexesForIndexAccess)) {
					result.push(i);
				}
			});
			return result;
		};
		
		this.tupleMatches = function(aTuple, oSelection, oOptions, aIndexesForIndexAccess) {
			aIndexesForIndexAccess = aIndexesForIndexAccess || [];
			for (var i = 0; i < aTuple.length; i++) {
				var aCurrentSelection = oSelection[i];
				var iMember = aTuple[i];
				if (aCurrentSelection  && iMember !== -1) {
					if (!contains(aCurrentSelection, iMember, aIndexesForIndexAccess[i])) {
						return false;
					}
				}
				if ((iMember !== -1 && this.buffer.dimensions[i].members[iMember].type === "RESULT")&&
						((aCurrentSelection === false)  || // ? selection
						(oOptions && !oOptions.includeResults))) {
					return false;										
				}
			}
			return true;
		};
		
		function contains(aCurrentSelection, iMember, indexNow) {
			for (var j=0; j<aCurrentSelection.length; j++) {
				var member = aCurrentSelection[j];
				if (member <0) { // index based access
					if (indexNow === (member + 1) * -1)
						return true;
				} else { 
				   if (member === iMember) {
					return true;
				   }
				}
			}
			return false;
		}
		
		function updateIndexesForIndexAccess(aIndexes, aLastTuple, aCurrentTuple) {
			if (aLastTuple) {
				for (var i = 0; i < aCurrentTuple.length; i++) {
					if (aLastTuple[i] !== aCurrentTuple[i]) {
						fillArrayWith(aIndexes, 0, i+1);
						aIndexes[i] = aIndexes[i] + 1;
						break;
					}		
				}
			}
			return aCurrentTuple;
		} 
		
	
		function getSelectionShape(aIndexSelection) {
			var axesWithFixedDimensions = {};
			var axesWithVariableDimensions = {};
			that.buffer.dimensions.forEach(function(dim, index) {
				if (aIndexSelection[index] != null) {
					axesWithFixedDimensions[dim.axis] = dim.axis;
				} else {
					axesWithVariableDimensions[dim.axis] = dim.axis;
				}
			});
			return Object.keys(axesWithVariableDimensions).length;
		}
	
		// Returns the selection in normalized index form, e.g. [undefined, [0], [1,2]]
		this.getIndexSelection = function (sSelection) {
			var result = createArray(that.buffer.dimensions.length, undefined);
			getIndexSelectionCore(sSelection, result);
			getIndexSelectionCore(this.filters(), result);
			return result;
		};
		
		
		function isIndexSelectionEmpty(aIndexSelection) {
			for (var i=0; i<aIndexSelection.length; i++) {
				if (aIndexSelection[i] !== undefined)
					return false;				
			}
			return true;
		}
		
	
		function getIndexSelectionCore(sSelection, result) {
			for ( var dimName in sSelection) {
				if (sSelection.hasOwnProperty(dimName)) {
					var iDimIndex = getDimIndex(dimName);
					if (iDimIndex >= 0) {
						if (sSelection[dimName] === "*")
							result[iDimIndex] = null; // Null is a marker for a * in SDKModel, but usally as if it was undefined
						else if (sSelection[dimName] === "?")
							result[iDimIndex] = false; // false is a marker for a * in SDKModel, but usally as if it was undefined
						else {
							var aDimSelection = getDimSelection(that.buffer.dimensions[iDimIndex], sSelection[dimName]);
							if (aDimSelection.length > 0) {
								result[iDimIndex] = intersectArray(aDimSelection, result[iDimIndex]);
							}
						}
					}
				}
			}
		}
	
		function intersectArray(a, b) {
			if (b) {
				var result = [];
				while (a.length > 0 && b.length > 0) {
					if (a[0] < b[0]) {
						a.shift();
					} else if (a[0] > b[0]) {
						b.shift();
					} else { /* they're equal */
						result.push(a.shift());
						b.shift();
					}
				}
				return result;
			}
			return a;
		}
	
		// Create a an array as needed in ProjectionJSON.selection
		function getResultSelection(indexSelection) {
			var aResult = [];
			for (var i = 0; i < indexSelection.length; i++) {
				var entry = indexSelection[i];
				if (entry && entry.length === 1) {
					aResult.push(entry[0]);
				} else {
					aResult.push(-1);
				}
			}
			return aResult;
		}
	
		function createArray(iLen, content) {
			var aResult = [];
			for (var i = 0; i < iLen; i++) {
				aResult.push(content);
			}
			return aResult;
		}
		
		function fillArrayWith(aArray, value, iStartIndex) {
			for (var i = iStartIndex; i < aArray.length; i++) {
				aArray[i] = value;
			}
		}
		
	
	
		function getDimIndex(sDim) {
			var dims = that.buffer.dimensions;
			for (var i = 0; i < that.buffer.dimensions.length; i++) {
				if (sDim === dims[i].key) {
					return i;
				}
				if ((sDim === "(MEASURES_DIMENSION)") && dims[i].containsMeasures) {
					return i;
				}
			}
			return -1;
		}
	
		function getDimSelection(oDim, selectionStringOrArray) {
			var result = [];
			if (typeof (selectionStringOrArray) === "number") {
				return [0 - selectionStringOrArray -1];
			} else if (selectionStringOrArray instanceof Array) {
				for (var i = 0; i < selectionStringOrArray.length; i++) {
					result = result.concat(getDimSelection(oDim, selectionStringOrArray[i]));
				}
			} else if (typeof (selectionStringOrArray) === "string") {
				var iIndex = getMemberIndex(oDim, selectionStringOrArray);
				if (iIndex >= 0) {
					result.push(iIndex);
				}
			}
			return result;
		}
	
		function getMemberIndex(oDim, sMember) {
			var members = oDim.members;
			for (var i = 0; i < members.length; i++) {
				if (sMember === members[i].key) {
					return i;
				}
				if (sMember === "(RESULT_MEMBER)" && members[i].type === "RESULT" ) {
					return i;				
				}
			}
			return -1;
		}
	
		this.fetchData = function(sSelection, oOptions) {
			return this.projectData(sSelection, oOptions);
		};
	
		this.metadata = function(val) {
			if (val === undefined) {
				return JSON.stringify({
					dimensions: that.buffer.dimensions,
					externalDimensions: that.buffer.externalDimensions
				});
			}
			// Setter case not relevant
		};
	
		this.getBuffer = function() {
			return that.buffer;
		};
	
		/**
		 * Call this function to define the minimal metadata of your data source.
		 * You need to define at least the dimensions with there name.
		 * If none of the regular dimensions on rows and columns contains measures,
		 * specify a second argument with a measures dimension containing exactly one measure.
		 */
		this.defineDimensions = function(aDimensions, externalMeasuresDim) {
			aDimensions.forEach(function(dim) {
				if (dim.members === undefined) {
					dim.members = [];
				}
			});
			that.buffer.dimensions = aDimensions;
			if (externalMeasuresDim) {
				that.buffer.externalDimensions = [ externalMeasuresDim ];
			}
		};
	
		/**
		 * Clear the that.buffer.
		 * bClearMembers: If set to true, all members are also deleted. This is usefull if setDataCell is used with "String" member arguments that automatically create members.
		 * Note that externalDimension is never cleared, as it is only touched by setDataCell 
		 */
		this.clear = function(bClearMembers) {
			that.buffer.data = [];
			that.buffer.formattedData = [];
			that.buffer.tuples = [];
			that.buffer.axis_columns = [];
			that.buffer.axis_rows = [];
			if (bClearMembers) {
				that.buffer.dimensions.forEach(function(dim) {
					dim.members = [];
				});
			}
		};
	
		/**
		 * value can be null, a number or a string. coordinates can be integer (existing member) or String (key/text)
		 */
		this.setDataCell = function(aCoordinates, value) {
			if (aCoordinates.length !== that.buffer.dimensions.length) {
				throw "setDataCell call with " + aCoordinates.length + " coodinates, but expected " + that.buffer.dimensions.length;
			}
			
	
			var tuple = [];
			for (var i = 0; i < aCoordinates.length; i++) {
				var index = aCoordinates[i];
				if (typeof (index) !== "number") {
					index = getMember(i, index);				
				}
				tuple.push(index);
			}
			
			var axisTuples = createAxisTuples(tuple);
			var iColIndex = findAxisTuple(that.buffer.axis_columns, axisTuples.col_tuple);
			var iRowIndex = findAxisTuple(that.buffer.axis_rows, axisTuples.row_tuple);
		    var iIndex = iRowIndex * that.buffer.axis_columns.length  + iColIndex;
			
			if (iIndex > that.buffer.data.length) {
				throw "Can only change existing cells or append and the end of last line.";
			}
			// TODO: Also check that making the last line longer than the other lines is not valid!
	  	    that.buffer.axis_columns[iColIndex]= axisTuples.col_tuple;
	  	    that.buffer.axis_rows[iRowIndex]= axisTuples.row_tuple;
			
			var bIsNew = that.buffer.data[iIndex] === undefined;
			if (bIsNew){
				addMembersIfNeeded(aCoordinates, tuple);
				var numberVal = 0.0;
				var formattedVal = "";
				if (value === null) {
					formattedVal = null;
					numberVal = null;
				} else if (typeof (value) === "string") {
					formattedVal = htmlEscape(value);
					numberVal = parseFloat(value);
				} else if (typeof (value) === "number") {
					formattedVal = value + ""; 
					numberVal = value;
				}
				that.buffer.data[iIndex] = numberVal;
				that.buffer.formattedData[iIndex] = formattedVal;
			} else {
				if (typeof (value) === "number") {
					that.buffer.data[iIndex] = value;				
				} else {
					that.buffer.formattedData[iIndex] = value;				
				}
			}
					
	
		};
	
		
		function findAxisTuple(axis, atuple) {
			for(var i=0; i<axis.length; i++) {
				if (_.isEqual(axis[i], atuple)) {
					return i;				
				}
			}
			return i;				
		}
		
		function createAxisTuples(tuple) {
			var row_tuple = tuple.slice();
			var col_tuple = tuple.slice();
			for (var i = 0; i < that.buffer.dimensions.length; i++) {
				var dim = that.buffer.dimensions[i];
				if (dim.axis === "COLUMNS") {
					row_tuple[i] = -1;
				} else {
					col_tuple[i] = -1;
				}
			}
			return {
				row_tuple: row_tuple,
				col_tuple: col_tuple
			};
		}
		
		function mergeAxisTuples(colsTuple, rowsTuple) {
			var result = [];
			for(var i=0; i<colsTuple.length; i++) {
				if (colsTuple[i] > -1) {
					result.push(colsTuple[i]);
				} else {
					result.push(rowsTuple[i]);
				}
			}
			return result;
		}
	
		function htmlEscape(str) {
		    return String(str)
		            .replace(/&/g, '&amp;')
		            .replace(/"/g, '&quot;')
		            .replace(/'/g, '&#39;')
		            .replace(/</g, '&lt;')
		            .replace(/>/g, '&gt;');
		}
		
		function getMember(iDim, sMember) {
			var dim = that.buffer.dimensions[iDim];
			var aMembers = dim.members;
			for (var i = 0; i < aMembers.length; i++) {
				var m = aMembers[i];
				if (m.key === sMember) {
					return i;
				}
			}
			return aMembers.length;
		}
	
		function addMembersIfNeeded(aCoordinates, aTuple) {
			for (var i=0; i<aCoordinates.length; i++) {
				var members = that.buffer.dimensions[i].members;
				var iIndex = aTuple[i];
				if (members[iIndex] === undefined) {
					var sMember = aCoordinates[i] + "";
					members[iIndex] = {
							key: sMember,
							text: htmlEscape(sMember)
						};
					
				}
			}
		}
	
		/**
		 * Fills the buffer from a typical "Excel"-like grid in form of an array of arrays [[x0y0, x1y0], [x0y1, x1y1]]
		 * 
		 * @bHasHeaderRow: pass in true, if the first line contains column names, else defaults will be used.
		 * @bHasHeaderColumn: pass in true, if the first column contains row names, else defaults will be used..
		 */
		this.fillWithArray = function(aData, bHasHeaderRow, bHasHeaderColumn) {
			this.clear(true);
			
			var iMinX = 0;
			var iMinY = 0;
			var iColCount = aData[0].length;
			var iRowCount = aData.length;
			var colMembers;
			var rowMembers;
			
			if (bHasHeaderRow) {
				iMinY = 1;
			}
			if (bHasHeaderColumn) {
				iMinX = 1;
			}
			if (bHasHeaderRow) {
				colMembers = extractRow(aData, iMinX);
			} else {
				colMembers = makeAlphaMembers(iColCount);
			}
			if (bHasHeaderColumn) {
				rowMembers = extractColumn(aData, iMinY);
			} else {
				rowMembers = makeNumberMembers(iRowCount);
			}
	
			for (var y = iMinY; y < iRowCount; y++) {
				for (var x = iMinX; x < iColCount; x++) {
					this.setDataCell([colMembers[x], rowMembers[y]], aData[y][x]);
				}
			}
		};
	
		function makeNumberMembers(iLen) {
			var result = [];
			for (var i = 0; i < iLen; i++) {
				result.push("" + (i + 1));
			}
			return result;
		}
	
		function makeAlphaMembers(iLen) {
			var result = [];
			for (var i = 0; i < iLen; i++) {
				result.push(getAlphaMember(i));
			}
			return result;
		}
	
		// converts integers 0, 1, ... to "A", "B", ..., "Z", "AA", "AB", ..., "ZZ", "AAA", "AAB", ...
		function getAlphaMember(iValue) {
			var ascii0 = "0".charCodeAt(0);
			var asciiA = "A".charCodeAt(0);
			
			var strValue = iValue.toString(26).toUpperCase();
			var result = "";
			for (var i = 0; i < strValue.length; i++) {
				var asciiChar = strValue.charCodeAt(i);
				var minusOne = ((strValue.length > 1) && (i == 0)) ? -1 : 0;
				var asciiNewChar;
				if (asciiChar < asciiA) {
					asciiNewChar = asciiChar - ascii0 + asciiA + minusOne;
				} else {
					asciiNewChar = asciiChar - asciiA + asciiA + 10 + minusOne;
				}
				result += String.fromCharCode(asciiNewChar);			
			}
			return result;
		}
		
		function extractRow(aData, iMinX) {
			var result = [];
			for (var i = 0; i < aData[0].length; i++) {
				if (i < iMinX) {
					result.push("");
				} else {
					result.push(aData[0][i]);
				}
			}
			return result;
		}
	
		function extractColumn(aData, iMinY) {
			var result = [];
			for (var i = 0; i < aData.length; i++) {
				if (i < iMinY) {
					result.push("");
				} else {
					result.push(aData[i][0]);
				}
			}
			return result;
		}
	
		this.testaccess = {
			getDimIndex: getDimIndex,
			getSelectionShape: getSelectionShape,
			intersectArray: intersectArray,
			createAxisTuples: createAxisTuples,
			findAxisTuple: findAxisTuple,
			tupleMatches: this.tupleMatches.bind(this),
			fillIndex: this.fillIndex,
			mergeAxisTuples: mergeAxisTuples,
			isIndexSelectionEmpty: isIndexSelectionEmpty,
			updateIndexeForIndexAccess: updateIndexesForIndexAccess
		};
	
	};	
	
	DataBuffer.subclass = Component.makeSubClass(DataBuffer);

	return DataBuffer;
	
});

