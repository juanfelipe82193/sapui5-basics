// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', '../../sina/util', '../../sina/AttributeType', '../../sina/ComparisonOperator'], function (core, sinaUtil, AttributeType, ComparisonOperator) {
    "use strict";

    return {

        sina2Ina: function (attributeType, value, context) {
            context = context || {};
            switch (attributeType) {
            case AttributeType.Double:
                return value.toString();
            case AttributeType.Integer:
                return value.toString();
            case AttributeType.String:
                return this.sina2InaString(value, context);
            case AttributeType.ImageUrl:
                return value;
            case AttributeType.ImageBlob:
                throw new core.Exception('not implemented');
            case AttributeType.GeoJson:
                return value;
            case AttributeType.Date:
                return this.sina2InaDate(value, context);
            case AttributeType.Time:
                return this.sina2InaTime(value);
            case AttributeType.Timestamp:
                return this.sina2InaTimestamp(value);
            default:
                throw new core.Exception('unknown attribute type ' + attributeType);
            }
        },

        ina2Sina: function (attributeType, value) {
            switch (attributeType) {
            case AttributeType.Double:
                return parseFloat(value);
            case AttributeType.Integer:
                return parseInt(value, 10);
            case AttributeType.String:
                return value;
            case AttributeType.ImageUrl:
                return value;
            case AttributeType.ImageBlob:
                throw new core.Exception('not implemented');
            case AttributeType.GeoJson:
                return value;
            case AttributeType.Date:
                return this.ina2SinaDate(value);
            case AttributeType.Time:
                return this.ina2SinaTime(value);
            case AttributeType.Timestamp:
                return this.ina2SinaTimestamp(value);
            default:
                throw new core.Exception('unknown attribute type ' + attributeType);
            }
        },

        ina2SinaTimestamp: function (value) {

            value = value.trim();

            var year, month, day, hour, minute, seconds, microseconds;
            if (value.indexOf('-') >= 0) {
                // ina:2017-01-01 00:00:00.0000000
                // sina: Date object
                year = parseInt(value.slice(0, 4), 10);
                month = parseInt(value.slice(5, 7), 10);
                day = parseInt(value.slice(8, 10), 10);
                hour = parseInt(value.slice(11, 13), 10);
                minute = parseInt(value.slice(14, 16), 10);
                seconds = parseInt(value.slice(17, 19), 10);
                microseconds = parseInt(value.slice(20, 20 + 6), 10);
            } else {
                // ina:20170201105936.0000000
                // sina: Date object
                year = parseInt(value.slice(0, 4), 10);
                month = parseInt(value.slice(4, 6), 10);
                day = parseInt(value.slice(6, 8), 10);
                hour = parseInt(value.slice(8, 10), 10);
                minute = parseInt(value.slice(10, 12), 10);
                seconds = parseInt(value.slice(12, 14), 10);
                microseconds = parseInt(value.slice(15, 15 + 6), 10);
            }

            var d = new Date(Date.UTC(year, month - 1, day, hour, minute, seconds, microseconds / 1000));
            return d;
        },


        sina2InaTimestamp: function (value) {
            // ina:2017-01-01 00:00:00.0000000
            // sina: Date object
            var year = value.getUTCFullYear();
            var month = value.getUTCMonth() + 1;
            var day = value.getUTCDate();
            var hour = value.getUTCHours();
            var minute = value.getUTCMinutes();
            var seconds = value.getUTCSeconds();
            var microseconds = value.getUTCMilliseconds() * 1000;

            var result =
                this.addLeadingZeros(year.toString(), 4) + '-' +
                this.addLeadingZeros(month.toString(), 2) + '-' +
                this.addLeadingZeros(day.toString(), 2) + ' ' +
                this.addLeadingZeros(hour.toString(), 2) + ':' +
                this.addLeadingZeros(minute.toString(), 2) + ':' +
                this.addLeadingZeros(seconds.toString(), 2) + '.' +
                this.addLeadingZeros(microseconds.toString(), 6);

            return result;
        },

        ina2SinaTime: function (value) {
            value = value.trim();
            if (value.length === 6) {
                // conversion for result list
                // ina: hhmmss
                // sina: hh:mm:ss
                return value.slice(0, 2) + ':' + value.slice(2, 4) + ':' + value.slice(4, 6);
            }
            if (value.length === 8) {
                // conversion for facet item
                // ina: hh:mm:ss
                // sina: hh:mm:ss
                return value.slice(0, 2) + ':' + value.slice(3, 5) + ':' + value.slice(6, 8);
            }
            throw new core.Exception('time conversion error ' + value);
        },

        sina2InaTime: function (value) {
            // conversion for filter condition
            // ina: hhmmss
            // sina: hh:mm:ss
            return value.slice(0, 2) + ':' + value.slice(3, 5) + ':' + value.slice(6, 8);
        },

        ina2SinaDate: function (value) {
            value = value.trim();
            if (value.length === 8) {
                // conversion for result list
                // ina: YYYYMMDD
                // sina: YYYY/MM/DD
                return value.slice(0, 4) + '/' + value.slice(4, 6) + '/' + value.slice(6, 8);
            }
            if (value.length === 27) {
                // conversion for facet item
                // ina: YYYY-MM-DD HH:MM:SS.SSSSSSS
                // sina: YYYY/MM/DD
                return value.slice(0, 4) + '/' + value.slice(5, 7) + '/' + value.slice(8, 10);
            }
            throw new core.Exception('date conversion error ' + value);
        },

        sina2InaDate: function (value, context) {
            // conversion for filter condition
            // ina: YYYY-MM-DD HH:MM:SS.SSSSSSS
            // sina: YYYY/MM/DD
            var result = value.slice(0, 4) + '-' + value.slice(5, 7) + '-' + value.slice(8, 10);
            if (context.operator === ComparisonOperator.Lt || context.operator === ComparisonOperator.Le) {
                result += ' 23:59:59.0000000';
            } else {
                result += ' 00:00:00.0000000';
            }
            return result;
        },

        sina2InaString: function (value, context) {
            return sinaUtil.convertOperator2Wildcards(value, context.operator);
        },

        addLeadingZeros: function (value, length) {
            return '00000000000000'.slice(0, length - value.length) + value;
        }

    };

});
