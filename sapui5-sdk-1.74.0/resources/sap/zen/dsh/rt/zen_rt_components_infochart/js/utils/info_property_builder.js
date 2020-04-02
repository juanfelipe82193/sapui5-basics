/* global define, sap */

define("zen.rt.components.infochart/js/utils/info_property_builder", ["underscore"], function (_) {

    "use strict";

    function InfoPropertyBuilder(cvomProperties, chartType) {
        this._properties = $.extend(true, {}, cvomProperties);
        this._chartType = chartType;
    }


    InfoPropertyBuilder.prototype.getPropertyValue = function (propertyPath) {
        var parts = propertyPath.split(".");
        return _.reduce(parts, function (property, part) {
            return property && property[part];
        }, this._properties);
    };


    InfoPropertyBuilder.prototype.getPropertyDefaultValue = function (propertyPath) {
        var parts = propertyPath.split(".");
        var defaultProperty;
        try {
            var defaultProperties = sap.viz.api.metadata.Viz.get(this._chartType).properties;
            var firstPart = parts.shift();
            defaultProperty = _.reduce(parts, function (property, part) {
                return property.children[part];
            }, defaultProperties[firstPart]).defaultValue;
        } catch (e) {
            //do nothing
        }

        return defaultProperty;
    };

    InfoPropertyBuilder.prototype.setPropertyValue = function (propertyPath, value) {
        var parts = propertyPath.split(".");
        var lastPart = parts.pop();
        var property = _.reduce(parts, function (property, part) {
            property[part] = property[part] || {};
            return property[part] || {};
        }, this._properties);
        property[lastPart] = value;
    };

    InfoPropertyBuilder.prototype._handleNoneAndDefaultFormatStringProperties = function (propertiesNode) {
        //for any property with the key "formatString", properties set as "Default"
        // are deleted and properties set as "None" are replaced with empty string.

        propertiesNode = propertiesNode || this._properties;
        for (var key in propertiesNode) {
            if (!propertiesNode.hasOwnProperty(key)) {
                continue;
            }
            if (key === "formatString") {
                if (propertiesNode[key] === "Default") {
                    delete propertiesNode[key];
                } else if (propertiesNode[key] === "None") {
                    propertiesNode[key] = "";
                }
            } else if (_.isObject(propertiesNode[key])) {
                this._handleNoneAndDefaultFormatStringProperties(propertiesNode[key]);
            }
        }
    };

    InfoPropertyBuilder.prototype.mapFormatStrings = function (defaultFormatString) {
    	defaultFormatString = fixFormatStringToMatchFormatLocale(defaultFormatString);
        defaultFormatString = fixNegativeValues(defaultFormatString);

        this._handleNoneAndDefaultFormatStringProperties();
        var tooltipFormatString = this.getPropertyValue("tooltip.formatString");
        if (_.isUndefined(tooltipFormatString) && defaultFormatString) {
            var cvomDefault = this.getPropertyDefaultValue("tooltip.formatString");
            if (!(cvomDefault && cvomDefault.charAt(cvomDefault.length - 1) === "%")) {
                this.setPropertyValue("tooltip.formatString", defaultFormatString);
            }
        }

        var dataLabelFormatString = this.getPropertyValue("plotArea.dataLabel.formatString");

        if (_.isUndefined(dataLabelFormatString)) {
            var dataLabelType = this.getPropertyValue("plotArea.dataLabel.type") ||
                this.getPropertyDefaultValue("plotArea.dataLabel.type");

            if (dataLabelType && dataLabelType.indexOf("value") !== -1) {

                var defaultDataLabelFormatString = stripUnitsAndCurrencies(_.clone(defaultFormatString));
                this.setPropertyValue("plotArea.dataLabel.formatString", defaultDataLabelFormatString);
            }
        }
        
        /**
         * Workaround:
         * Chart only accepts format strings matching locale
         * Data retrieved from backend can however have a different number format not conform to language
         */
        function fixFormatStringToMatchFormatLocale(fs) {
            if (_.isString(fs)) {
            	var regString, regex;
            	
            	// fix thousand separator
            	regString = "#(?![#|" + sap.common.globalization.NumericFormatManager.getThousandSeparator() + "]).(?=#)";
            	regex = new RegExp(regString, "g");
                fs = fs.replace(regex, "#" + sap.common.globalization.NumericFormatManager.getThousandSeparator());
            	
                // fix decimal separator
            	regString = "0(?![0|" + sap.common.globalization.NumericFormatManager.getDecimalSeparator() + "]).(?=0)";
            	regex = new RegExp(regString, "g");
                fs = fs.replace(regex, "0" + sap.common.globalization.NumericFormatManager.getDecimalSeparator());
            } else if (_.isObject(fs)) {
                _.each(_.keys(fs), function (fsKey) {
                    fs[fsKey] = fixFormatStringToMatchFormatLocale(fs[fsKey]);
                })
            }

            return fs;
        }

        function fixNegativeValues(fs) {
            if (_.isString(fs)) {
                fs = fs.replace("'-'", "-");
            } else if (_.isObject(fs)) {
                _.each(_.keys(fs), function (fsKey) {
                    fs[fsKey] = fixNegativeValues(fs[fsKey]);
                })
            }

            return fs;
        }

        function stripUnitsAndCurrencies(fs) {
            var regString = "[^#\\" + sap.common.globalization.NumericFormatManager.getThousandSeparator() + "0\\"
                + sap.common.globalization.NumericFormatManager.getDecimalSeparator() + ";-]";
            var regex = new RegExp(regString, "g");

            if (_.isString(fs)) {
                fs = fs.replace(regex, "");
            } else if (_.isObject(fs)) {
                _.each(_.keys(fs), function (fsKey) {
                    fs[fsKey] = stripUnitsAndCurrencies(fs[fsKey]);
                })
            }
            return fs;
        }

        return this;
    };

    InfoPropertyBuilder.prototype.setDefaultColorPalette = function() {
        var defaultColorPalette = this.getPropertyDefaultValue("plotArea.colorPalette");
        if (defaultColorPalette && defaultColorPalette.length) {
            this._properties.plotArea = this._properties.plotArea || {};
            this._properties.plotArea.colorPalette = this._properties.plotArea.colorPalette ||
                InfoPropertyBuilder.DEFAULT_COLOR_PALETTE;
        }
        return this;
    };

    InfoPropertyBuilder.prototype.getProperties = function () {
        return this._properties;
    };
    
    InfoPropertyBuilder.prototype.applyScalingFactor = function (sdkData, flatData) {
    	var measureData = sdkData._measureMembers;
    	var metaDataFields = flatData.metadata.fields;
    	for(var i = 0; i< measureData.length; i++) {
    		if(measureData[i].scalingFactor > 0) {
    			
    			
    			var scalingString = this.getScalingDisplayString(measureData[i].scalingFactor);

    			for(var j = 0; j < metaDataFields.length; j++) {
    				if(metaDataFields[j].id === measureData[i].key) {
    					metaDataFields[j].name = metaDataFields[j].name + scalingString;
    				}
    			}
    			
    			
    		}
    	}
    };
    
    InfoPropertyBuilder.prototype.getScalingDisplayString = function (scalingAmt) {
        var initialString = '1';
        for (var i = 0; i < scalingAmt; i++) {
            initialString += ('0');
        }
        var replaceVal = "$1" + sap.common.globalization.NumericFormatManager.getThousandSeparator() + "";
        var finalString = initialString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, replaceVal);
        //There is a bug in cvom where when isHierachical is set to true the legend name gets put into a regular expressions without being escaped.
        //putting a zero width whitespace in before the asterisk works around this bug for us.
        finalString = " (\u200b*" + finalString + ")";
        return finalString;
    };

    InfoPropertyBuilder.DEFAULT_COLOR_PALETTE = [
        "#748CB2", "#9CC677", "#EACF5E", "#F9AD79", "#D16A7C",
        "#8873A2", "#3A95B3", "#B6D949", "#FDD36C", "#F47958",
        "#A65084", "#0063B1", "#0DA841", "#FCB71D", "#F05620"
        // "#B22D6E", "#3C368E", "#8FB2CF", "#95D4AB", "#EAE98F",
        // "#F9BE92", "#EC9A99", "#BC98BD", "#1EB7B2", "#73C03C",
        // "#F48323", "#EB271B", "#D9B5CA", "#AED1DA", "#DFECB2",
        // "#FCDAB0", "#F5BCB4"
    ];

    return InfoPropertyBuilder;
});