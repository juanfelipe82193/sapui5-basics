// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './Formatter'], function (core, Formatter) {
    "use strict";

    return Formatter.derive({

        initAsync: function () {},
        format: function (resultSet) {
            return this._formatDataInUI5Form(resultSet);
        },
        formatAsync: function (resultSet) {
            resultSet = this._formatDataInUI5Form(resultSet);
            return core.Promise.resolve(resultSet);
        },

        _formatDataInUI5Form: function (resultSet) {
            if (!sap && !sap.ui && !sap.ui.core && !sap.ui.core.format) {
                return resultSet;
            }

            var that = this;
            that.sina = resultSet.sina;

            resultSet.items.forEach(function (item) {

                if (that.sina.getDataSource(item.dataSource.id) === undefined) {
                    return;
                }

                if (jQuery.isEmptyObject(that.sina.getDataSource(item.dataSource.id).attributeMetadataMap)) {
                    return;
                }

                that.attributeMap = that.sina.getDataSource(item.dataSource.id).attributeMetadataMap;

                item.titleAttributes.forEach(function (attribute) {
                    that._formatHybridAttribute(attribute);
                });

                item.titleDescriptionAttributes.forEach(function (attribute) {
                    that._formatHybridAttribute(attribute);
                });

                item.detailAttributes.forEach(function (attribute) {
                    that._formatHybridAttribute(attribute);
                });
            });
            return resultSet;
        },

        _formatHybridAttribute: function (attribute) {
            var that = this;

            if (attribute.metadata.type && attribute.metadata.type === that.sina.AttributeType.Group) {
                // group attributes
                for (var i = 0; i < attribute.attributes.length; i++) {
                    // recursive formatting
                    that._formatHybridAttribute(attribute.attributes[i].attribute);
                }
            } else {
                // single attribute
                that._formatSingleAttribute(attribute);
            }
        },

        _formatSingleAttribute: function (attribute) {
            var that = this;
            attribute.valueFormatted = that._getFormattedValue(attribute);

            if (attribute.valueHighlighted === undefined || attribute.valueHighlighted.length === 0) {
                attribute.valueHighlighted = attribute.valueFormatted;
                if (attribute.isHighlighted) {
                    // add client-side highlighted value
                    attribute.valueHighlighted = '<b>' + attribute.valueHighlighted + '</b>';
                }
            }
        },

        _getFormattedValue: function (attribute) {
            if (this.attributeMap[attribute.id] === undefined) {
                // return server-side valueFormatted
                return attribute.valueFormatted;
            }

            var type = this.sina.AttributeType;
            var ui5Format = undefined;
            var valueTempo = attribute.value;

            switch (this.attributeMap[attribute.id].type) {

            case type.Integer:
                ui5Format = sap.ui.core.format.NumberFormat.getIntegerInstance();
                break;

            case type.Double:
                ui5Format = sap.ui.core.format.NumberFormat.getFloatInstance({
                    //"decimals": 2 // not to restrict 
                });
                break;

            case type.Timestamp:
                // Date Object: Wed Jan 17 2018 11:48:59 GMT+0100 (Central European Standard Time)
                if (isNaN(Date.parse(attribute.value)) === false) {
                    ui5Format = sap.ui.core.format.DateFormat.getDateTimeInstance();
                }
                break;

            case type.Date:
                // "2019/01/16" -> Date Object: Wed Jan 16 2018 00:00:00 GMT+0100 (Central European Standard Time)         
                if (isNaN(Date.parse(attribute.value)) === false) {
                    ui5Format = sap.ui.core.format.DateFormat.getDateInstance();
                    valueTempo = new Date(attribute.value);
                }
                break;

            case type.Time:
                // "00:40:32" -> Date Object: Wed Jan 01 1970 00:40:32 GMT+0100 (Central European Standard Time)
                if (isNaN(Date.parse("1970/01/01 " + attribute.value)) === false) {
                    ui5Format = sap.ui.core.format.DateFormat.getTimeInstance();
                    valueTempo = new Date("1970/01/01 " + attribute.value);
                }
                break;
            }

            if (ui5Format && ui5Format.format(valueTempo) !== undefined) {
                // return client-side UI5 formatted value
                return ui5Format.format(valueTempo);
            }

            // return server-side valueFormatted
            return attribute.valueFormatted;
        }
    });

});
