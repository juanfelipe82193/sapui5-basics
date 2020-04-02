var com_sap_ip_bi_InfoChart = {
	getSelectedMember: function (dimension) {
		//This function can be passed either a dimension object or a string
		if (typeof(dimension) !== "string") {
			dimension = dimension.name;
		}
		var jsonChartSelection = {};

		if (this.dataSelected) {
			jsonChartSelection = JSON.parse(this.dataSelected);
		}
		var member;
		if (jsonChartSelection) {
			var membersArr = jsonChartSelection[dimension];
			if (membersArr && membersArr.length != 0) {
				member = membersArr[0];
			}
		}
		return this.createMember(dimension, member);
	},
	getSelectedMembers: function (dimension) {
		//This function can be passed either a dimension object or a string
		if (typeof(dimension) !== "string") {
			dimension = dimension.name;
		}

		var result = [];

		var jsonChartSelection = {};
		if (this.dataSelected) {
			jsonChartSelection = JSON.parse(this.dataSelected);
		}

		var membersArr = jsonChartSelection[dimension];
		if (membersArr) {
			for (var x = 0; x < membersArr.length; x++) {
				var memberVal = membersArr[x];
				var member = this.createMember(dimension, memberVal);
				result.push(member);
			}
		}

		return result;
	},
	showTotals: function (isVisible) {
		this.showTotals = isVisible;
	},
	showDataLabels: function (isVisible) {
		this.updateChartPropertyByPath("plotArea.dataLabel.visible", isVisible);
	},
	showScalingFactors: function (isVisible) {
		this.showScaling = isVisible;
	},
	getChartType: function () {
		var charttype = this.charttype;
		var externalChartType = charttype.__value__ || charttype;
		externalChartType = externalChartType.replace("info/", "INFO_").toUpperCase();
		return externalChartType;
	},
	setChartType: function (newType) {
		var oldType = undefined;
		var charttype = this.charttype;
		
		if (!charttype.__value__) {
			oldType = charttype;
			charttype = {};
		} else {
			oldType = charttype.__value__;
		}
		
		newType = newType.replace("INFO_", "info/").toLowerCase();
		
		charttype.__value__ = newType;
		/** There is a bug where empty object get removed*/
		charttype[newType] = charttype[oldType] || { "properties": {} };
		
		this.charttype = charttype;
	},
	setDataSelection: function (selection) {
		this.data = selection;
	},
	getLegendPosition: function () {
		return this.getChartPropertyByPath("legendGroup.layout.position", "right");
	},
	setLegendPosition: function (legendPosition) {
		this.updateChartPropertyByPath("legendGroup.layout.position", legendPosition.toLowerCase());
	},
	clearSelection: function () {
		this.chartSelection = "CLEAR";
		this.dataSelected = "{}";
	},
	getAxisScalingMin: function (axis) {
		return this.getChartPropertyByPath("plotArea." + this.getAxisFromEnum(axis) + ".minValue", 0.0);
	},
	getAxisScalingMax: function (axis) {
		return this.getChartPropertyByPath("plotArea." + this.getAxisFromEnum(axis) + ".maxValue", 0.0);
	},
	setAxisScaling: function (axis, minValue, maxValue) {
		var plotAreaAxisID = this.getAxisFromEnum(axis);
		this.updateChartPropertyByPath("plotArea." + plotAreaAxisID + ".fixedRange", true);
		this.updateChartPropertyByPath("plotArea." + plotAreaAxisID + ".minValue", minValue);
		this.updateChartPropertyByPath("plotArea." + plotAreaAxisID + ".maxValue", maxValue);
	},
	removeAxisScaling: function (axis) {
		var path = "plotArea." + this.getAxisFromEnum(axis);
		var axisScaling = this.getChartPropertyByPath(path);

		if (axisScaling) {
			this.updateChartPropertyByPath(path + ".fixedRange", false);
			this.updateChartPropertyByPath(path + ".minValue", "");
			this.updateChartPropertyByPath(path + ".maxValue", "");
		}
	},
	setCvomBinding: function (bindingValue) {
		return this.cvombinding = bindingValue;
	},
	getChartPropertyByPath: function (path, defaultValue) {
		var chart = this.charttype[this.charttype.__value__];
		return this.getPropertyByPath(chart, path) || defaultValue;
	},
	getPropertyByPath: function (obj, propPath) {
		propPath = "properties." + propPath;
		var propPathArray = propPath.split(".");
		var val = obj
			for (var i = 0; i < propPathArray.length; i++) {
				if (val) {
					val = val[propPathArray[i]];
				} else {
					break;
				}
			}
			return val;
	},
	updateChartPropertyByPath: function (path, value) {
		this.setChartType(this.getChartType());	
		var charttype = this.charttype;	
		var chartProperties = charttype[charttype.__value__];
		if (!chartProperties) {
			/** There is a bug where empty object get removed*/
			chartProperties = {
				"properties": {}
			};
			charttype[charttype.__value__] = chartProperties;
		}
		chartProperties = this.setPropertyByPath(chartProperties, path, value);
		this.charttype = charttype;
	},
	setPropertyByPath: function (obj, propPath, val) {
		var localObj = obj;
		propPath = "properties." + propPath;
		var propPathArray = propPath.split(".");
		var currentProp = localObj;
		for (var i = 0; i < propPathArray.length - 1; i++) {
			currentProp[propPathArray[i]] = currentProp[propPathArray[i]] || {};
			currentProp = currentProp[propPathArray[i]];
		}
		currentProp[propPathArray[propPathArray.length - 1]] = val;
		return localObj;
	},
	getAllPropertiesAsJSON: function () {
		return JSON.stringify(this.charttype);
	},
	getDataSelectionString: function () {
		return JSON.stringify(this.data);
	},
	getAxisFromEnum: function (axis) {
		var plotAreaAxisId = "primaryScale";
		if (axis == "AXIS_2") {
			plotAreaAxisId = "secondaryScale";
		}
		return plotAreaAxisId;
	}
};
var InfoChartAxisScalingEnumfield = {};
var InfoChartAxisScaling = {
	AXIS_1: "AXIS_1",
	AXIS_2: "AXIS_2"
};
var InfoChartTypeEnumfield = {};
var InfoChartType = {
	INFO_COLUMN: "INFO_COLUMN", // VERTICAL_BAR, MULTIPIE
	INFO_BAR: "INFO_BAR", // HORIZONTAL_BAR
	INFO_LINE: "INFO_LINE", // LINE
	INFO_PIE: "INFO_PIE", // PIE
	INFO_STACKED_COLUMN: "INFO_STACKED_COLUMN",	// VERTICAL_STACKED_BAR
	INFO_STACKED_BAR: "INFO_STACKED_BAR", // HORIZONTAL_STACKED_BAR	
	INFO_AREA: "INFO_AREA", // AREA
	INFO_HORIZONTAL_AREA: "INFO_HORIZONTAL_AREA", // HORIZONTAL_AREA
	
	INFO_HORIZONTAL_COMBINATION: "INFO_HORIZONTAL_COMBINATION",
	INFO_HORIZONTAL_LINE: "INFO_HORIZONTAL_LINE",
	INFO_TREEMAP: "INFO_TREEMAP",
	INFO_TRELLIS_AREA: "INFO_TRELLIS_AREA",
	INFO_TRELLIS_BAR: "INFO_TRELLIS_BAR",
	INFO_TRELLIS_COLUMN: "INFO_TRELLIS_COLUMN",
	INFO_TRELLIS_HORIZONTAL_AREA: "INFO_TRELLIS_HORIZONTAL_AREA",
	INFO_TRELLIS_HORIZONTAL_LINE: "INFO_TRELLIS_HORIZONTAL_LINE",
	INFO_TRELLIS_LINE: "INFO_TRELLIS_LINE",
	INFO_RADAR: "INFO_RADAR",

	INFO_100_STACKED_BAR: "INFO_100_STACKED_BAR",
	INFO_100_STACKED_COLUMN: "INFO_100_STACKED_COLUMN",
	INFO_COMBINATION: "INFO_COMBINATION",
	INFO_BUBBLE: "INFO_BUBBLE",	
	INFO_SCATTER: "INFO_SCATTER",
	INFO_DUAL_COLUMN: "INFO_DUAL_COLUMN",
	INFO_DUAL_STACKED_COLUMN: "INFO_DUAL_STACKED_COLUMN",
	INFO_100_DUAL_STACKED_COLUMN: "INFO_100_DUAL_STACKED_COLUMN",
	INFO_DUAL_BAR: "INFO_DUAL_BAR",
	INFO_DUAL_STACKED_BAR: "INFO_DUAL_STACKED_BAR",
	INFO_100_DUAL_STACKED_BAR: "INFO_100_DUAL_STACKED_BAR",
	INFO_DUAL_LINE: "INFO_DUAL_LINE",
	INFO_BULLET: "INFO_BULLET",
	INFO_VERTICAL_BULLET: "INFO_VERTICAL_BULLET",
	INFO_DONUT: "INFO_DONUT",
	INFO_HEATMAP: "INFO_HEATMAP",
	INFO_STACKED_COMBINATION: "INFO_STACKED_COMBINATION",
	INFO_HORIZONTAL_STACKED_COMBINATION: "INFO_HORIZONTAL_STACKED_COMBINATION",
	INFO_DUAL_STACKED_COMBINATION: "INFO_DUAL_STACKED_COMBINATION",
	INFO_DUAL_COMBINATION: "INFO_DUAL_COMBINATION",
	INFO_DUAL_HORIZONTAL_COMBINATION: "INFO_DUAL_HORIZONTAL_COMBINATION",
	INFO_TIMESERIES_LINE: "INFO_TIMESERIES_LINE"
	
	//INFO_DUAL_HORIZONTAL_STACKED_COMBINATION: "INFO_DUAL_HORIZONTAL_STACKED_COMBINATION", // Found
	//INFO_TIME_BUBBLE: "INFO_TIME_BUBBLE", // Found
	//INFO_TIMESERIES_COLUMN: "INFO_TIMESERIES_COLUMN", // Found
	//INFO_TIMESERIES_COLUMN: "INFO_TIMESERIES_COLUMN", // Found
	//INFO_TIMESERIES_BULLET: "INFO_TIMESERIES_BULLET", // Found
	//INFO_TIMESERIES_COMBINATION: "INFO_TIMESERIES_COMBINATION", // Found
	//INFO_DUAL_TIMESERIES_COMBINATION: "INFO_DUAL_TIMESERIES_COMBINATION", // Found
	//INFO_TIMESERIES_STACKED_COLUMN: "INFO_TIMESERIES_STACKED_COLUMN", // Found
	//INFO_TIMESERIES_100_STACKED_COLUMN: "INFO_TIMESERIES_100_STACKED_COLUMN", // Found
	//INFO_TIMESERIES_SCATTER: "INFO_TIMESERIES_SCATTER", // Found
	//INFO_TIMESERIES_BUBBLE: "INFO_TIMESERIES_BUBBLE", // Found
	//INFO_TIMESERIES_WATERFALL: "INFO_TIMESERIES_WATERFALL", // Found
	//INFO_WATERFALL: "INFO_WATERFALL", // Found
	//INFO_HORIZONTAL_WATERFALL: "INFO_HORIZONTAL_WATERFALL", // Found
};