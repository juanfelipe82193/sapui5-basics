sap.zen.DshWrapper = function() {
	"use strict";

	this.wrapper = {}
	this.origObjects = {};
	
	this.wrapper.FioriHelper = function(org, result, field) {
		result[field.fieldname] = function() {
			if ((field.fieldname == 'fetchJumpTargets') && arguments.length === 1) {
				return org[field.fieldname](arguments[0].getId());
			} else if (org[field.fieldname + arguments.length] !== undefined) {
				return org[field.fieldname + arguments.length].apply(org, arguments);
			} else {
				return org[field.fieldname].apply(org, arguments);
			}
		}
	};

	this.wrapper.DataSource = function(org, result, field) {
		var fieldname = field.fieldname;

		result[fieldname] = function() {
			if (fieldname == 'getDataAsString' || fieldname == 'getData') {
				return org[fieldname](arguments[0], JSON.stringify(arguments[1]))
			} else if (fieldname == 'getMemberList' && arguments.length == 4) {
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3], null)
			} else if (fieldname == 'copyFilters') {
				if(arguments.length == 1) {
					return org[fieldname](arguments[0].getId(), false)
				} else {
					return org[fieldname](arguments[0].getId(), arguments[1])
				}
		    } else if (fieldname == 'getDimensions' && arguments.length == 1) {
			      return org['getDimensionsOneArg'](arguments[0])
			} else if (fieldname == 'moveDimensionToRows' && arguments.length == 1) {
				return org['moveDimensionToRowsOneArg'](arguments[0])
			} else if (fieldname == 'moveDimensionToColumns' && arguments.length == 1) {
				return org['moveDimensionToColumnsOneArg'](arguments[0])
			} else if (fieldname == 'assignDataSource' && arguments.length == 3) {
				return org['assignDataSourceThreeArgs'](arguments[0], arguments[1], arguments[2])
			} else if (fieldname == 'expandNode' && arguments.length == 3) {
				return org['expandNodeThreeArgs'](arguments[0], arguments[1], arguments[2])
			} else if (fieldname == 'setFilter' && arguments.length == 2 && (arguments[1].low !== undefined || arguments[1].high !== undefined)) {
				var sTempLow = null;
				if (arguments[1].low !== undefined) {
					sTempLow = arguments[1].low;
				}
				var sTempHigh = null;
				if (arguments[1].high !== undefined) {
					sTempHigh = arguments[1].high;
				}
				return org['setFilterLowHigh'](arguments[0], sTempLow, sTempHigh);
			}
			if (arguments.length == 0)
				return org[fieldname]();
			if (arguments.length == 1)
				return org[fieldname](arguments[0]);
			if (arguments.length == 2)
				return org[fieldname](arguments[0], arguments[1]);
			if (arguments.length == 3)
				return org[fieldname](arguments[0], arguments[1], arguments[2]);
			if (arguments.length == 4)
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3]);
			if (arguments.length == 5)
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
			if (arguments.length == 6)
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
	};

	this.wrapper.PageObject = function(org, result, field) {
		if (field.fieldname == 'doExport') {
			result["export"] = function() {
				if (org[field.fieldname + arguments.length] !== undefined) {
					return org[field.fieldname + arguments.length].apply(org, arguments);
				} else {
					return org[field.fieldname].apply(org, arguments);
				}
			}
		}
		
		result[field.fieldname] = function() {
			if (org[field.fieldname + arguments.length] !== undefined) {
				return org[field.fieldname + arguments.length].apply(org, arguments);
			} else {
				return org[field.fieldname].apply(org, arguments);
			}
		}
	};

	this.wrapper.PlanningObject = function(org, result, field) {
		var fieldname = field.fieldname;
		
		result[fieldname] = function() {
			if (fieldname == 'getMemberList' && arguments.length == 4) {
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3], null)
			} 
			if (fieldname == 'copyFilters') {
				if(arguments.length == 1) {
					return org[fieldname](arguments[0].getId(), false)
				} else {
					return org[fieldname](arguments[0].getId(), arguments[1])
				}
		    }
			if (fieldname == 'copyVariableValue') {
				if(arguments.length == 2) {
					return org[fieldname](arguments[0].getId(), arguments[1], null)
				} else {
					return org[fieldname](arguments[0].getId(), arguments[1], arguments[2])
				}
		    }
			if (fieldname == 'getDimensions' && arguments.length == 1) {
			      return org['getDimensionsOneArg'](arguments[0])			
			}
			if (fieldname == 'setFilter' && arguments.length == 2 && (arguments[1].low !== undefined || arguments[1].high !== undefined)) {
				var sTempLow = null;
				if (arguments[1].low !== undefined) {
					sTempLow = arguments[1].low;
				}
				var sTempHigh = null;
				if (arguments[1].high !== undefined) {
					sTempHigh = arguments[1].high;
				}
				return org['setFilterLowHigh'](arguments[0], sTempLow, sTempHigh);
			}
			if (arguments.length == 0)
				return org[fieldname]();
			if (arguments.length == 1)
				return org[fieldname](arguments[0]);
			if (arguments.length == 2)
				return org[fieldname](arguments[0], arguments[1]);
			if (arguments.length == 3)
				return org[fieldname](arguments[0], arguments[1], arguments[2]);
			if (arguments.length == 4)
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3]);
			if (arguments.length == 5)
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
			if (arguments.length == 6)
				return org[fieldname](arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		}
	};

	this.wrapper.FilterBar = function(org, result, field) {
		result[field.fieldname] = function() {
			if ((field.fieldname == 'addDimFilter' || field.fieldname == 'removeDimFilter') && arguments.length == 2) {
				return org[field.fieldname](arguments[0].getId(), arguments[1])
			} else if (org[field.fieldname + arguments.length] !== undefined) {
				return org[field.fieldname + arguments.length].apply(org, arguments);
			} else {
				return org[field.fieldname].apply(org, arguments);
			}
		}
	};

	this.wrapper.TextPool = function(org, result, field) {
		var aFields = org.getFieldNames();
		aFields.forEach(function(sFieldName) {
			result[sFieldName] = org.getPropertyValue(sFieldName);
		});
	};
	
	this.wrapper.Convert = function(org, result, field) {
		if (field.fieldname == 'indexOf') {
			result["indexOf"] = function() {
				if (org[field.fieldname + arguments.length] !== undefined) {
					return org[field.fieldname + arguments.length].apply(org, arguments);
				} else {
					return org[field.fieldname].apply(org, arguments);
				}
			}
		}
		
		result[field.fieldname] = function() {
			if (org[field.fieldname + arguments.length] !== undefined) {
				return org[field.fieldname + arguments.length].apply(org, arguments);
			} else {
				return org[field.fieldname].apply(org, arguments);
			}
		}
	};

	this.wrapper.BookmarkManager = function(org, result, field) {
		var fieldname = field.fieldname;
		
		result[fieldname] = function() {
			if (fieldname == 'savesFinBookmark' && arguments.length == 2) {
				return org[fieldname](arguments[0], arguments[1], false);
			} else {
				return org[fieldname].apply(org, arguments);
			} 
		}
	};
	
	
	this.wrap = function(wrapperName, org) {
		if ((wrapperName == null) || (wrapperName.length == 0)) {
			return org;
		}

		if (!this.wrapper[wrapperName]) {
			if (org.getMessageWriter()) {
				org.getMessageWriter().createErrorMessage("sap.zen.DshWrapper: " + wrapperName + "not found!");
			} else {
				alert("sap.zen.DshWrapper: " + wrapperName + "not found!");
			}
			return org;
		}

		var result = {};
		for ( var fieldname in org) {
			try {
				if (typeof org[fieldname] == 'function') {
					this.wrapper[wrapperName](org, result, {
						'fieldname' : fieldname
					});
				}
			} catch (e) {

			}
		}
		return result;
	};

};

sap.zen.dshWrapper = new sap.zen.DshWrapper();