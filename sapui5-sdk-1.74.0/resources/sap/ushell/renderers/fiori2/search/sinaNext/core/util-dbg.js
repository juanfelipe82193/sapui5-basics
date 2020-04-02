// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
/* eslint no-useless-escape:0 */
sinaDefine(['./core'], function (core) {
    "use strict";

    var module = {};

    module.sampleProviderInstanceCounter = 0;

    module.timeoutDecorator = function (originalFunction, timeout) {

        var decoratedFunction = function () {
            var that = this;
            var args = arguments;
            return new core.Promise(function (resolve, reject) {

                var outTimed = false;
                var timer = setTimeout(function () {
                    outTimed = true;
                    reject(new core.Exception('timeout'));
                }, timeout);

                return originalFunction.apply(that, args).then(function (response) {
                    // success
                    if (outTimed) {
                        return;
                    }
                    clearTimeout(timer);
                    resolve(response);
                }, function (error) {
                    // error
                    if (outTimed) {
                        return;
                    }
                    clearTimeout(timer);
                    reject(error);
                });

            });

        };
        return decoratedFunction;
    };

    module.refuseOutdatedResponsesDecorator = function (originalFunction) {
        var maxRequestId = 0;
        var decoratedFunction = function () {
            var requestId = ++maxRequestId;
            return originalFunction.apply(this, arguments).then(function (response) {
                // success
                return new core.Promise(function (resolve, reject) {
                    if (requestId !== maxRequestId) {
                        return; // --> ignore
                    }
                    resolve(response); // --> forward
                });
            }, function (error) {
                // error
                return new core.Promise(function (resolve, reject) {
                    if (requestId !== maxRequestId) {
                        return; // --> ignore
                    }
                    reject(error); // --> forward
                });
            });
        };
        decoratedFunction.abort = function () {
            ++maxRequestId;
        };
        return decoratedFunction;
    };

    module.getUrlParameter = function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    module.filterString = function (text, removeStrings) {
        for (var i = 0; i < removeStrings.length; ++i) {
            var removeString = removeStrings[i];
            var index = 0;
            while (index >= 0) {
                index = text.indexOf(removeString);
                if (index >= 0) {
                    text = text.slice(0, index) + text.slice(index + removeString.length);
                }
            }
        }
        return text;
    };

    module.generateTimestamp = function () {
        var pad = function (num, size) {
            var s = "000000000" + num;
            return s.substr(s.length - size);
        };
        var d = new Date();
        return '' +
            d.getUTCFullYear() +
            pad(d.getUTCMonth() + 1, 2) +
            pad(d.getUTCDate(), 2) +
            pad(d.getUTCHours(), 2) +
            pad(d.getUTCMinutes(), 2) +
            pad(d.getUTCSeconds(), 2) +
            pad(d.getUTCMilliseconds(), 3);
    };

    module.DelayedConsumer = core.defineClass({
        _init: function (properties) {
            properties = properties || {};
            this.timeDelay = properties.timeDelay || 1000;
            this.consumer = properties.consumer || function () {};
            this.consumerContext = properties.consumerContext || null;
            this.objects = [];
        },
        add: function (obj) {
            this.objects.push(obj);
            if (this.objects.length === 1) {
                setTimeout(this.consume.bind(this), this.timeDelay);
            }
        },
        consume: function () {
            this.consumer.apply(this.consumerContext, [this.objects]);
            this.objects = [];
        }
    });

    module.dateToJson = function (date) {
        return {
            type: 'Timestamp',
            value: date.toJSON()
        };
    };

    module.dateFromJson = function (jsonDate) {
        if (jsonDate.type !== 'Timestamp') {
            throw new core.Exception('Not a timestampe ' + jsonDate);
        }
        return new Date(jsonDate.value);
    };

    // module.getBaseUrl = function (url) {
    //     var baseUrl = '';
    //     if (url) {
    //         baseUrl = url;
    //     } else {
    //         url = '/sap/ushell/renderers/fiori2/search/container/';
    //         var indexOfStandalonePath = window.location.pathname.indexOf(url);
    //         if (indexOfStandalonePath > -1) {
    //             baseUrl = window.location.pathname.slice(0, indexOfStandalonePath);
    //         }
    //     }
    //     return baseUrl;
    // };

    module.addPotentialNavTargetsToAttribute = function (resultSet) {
        if (resultSet.items) { //not avilable with sample provider
            var items = resultSet.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                //the idea of nav targets extended to geo data preparation!
                item = this.addGeoDataIfAvailable(item);
                var attributes = item.detailAttributes;
                for (var j = 0; j < attributes.length; j++) {
                    var attribute = attributes[j];
                    var sina = attribute.sina;
                    var value = attribute.value;
                    var metadata = attribute.metadata;
                    if (typeof value === 'string' && attribute.metadata.type !== "ImageUrl") {
                        var emails = value.match(/^[^\0-\x20,:;<>@\[\\\]^_`]+@[^\0-,.-@\[\\\]^_`\{\|\}~]+\.[^\0-,.-@\[\\\]^_`\{\|\}~]+$/g);
                        var fonenrs = value.match(/^(?!\d*$)(?=(?:[()\[\]+\-\/ ]*\d[()\[\]+\-\/ ]*){9,15}$)\+?(?:\d+|\(\d+(?: \d+)*\)|\[\d+\]|[\/ ]|\d-\d)+$/g);
                        var url = value.match(/^https?:\/\/(?=[^\/])\S+$/gi);
                        if (metadata.semantics == sina.AttributeSemanticsType.EmailAddress) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: value,
                                targetUrl: 'mailto:' + value
                            });
                        } else if (metadata.semantics == sina.AttributeSemanticsType.PhoneNr) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: value,
                                targetUrl: 'tel:' + value
                            });
                        } else if (metadata.semantics == sina.AttributeSemanticsType.HTTPURL) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: value,
                                targetUrl: value,
                                target: "_blank"
                            });
                        } else if (emails !== null && emails.length === 1) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: emails[0],
                                targetUrl: 'mailto:' + emails[0]
                            });
                        } else if (fonenrs !== null && fonenrs[0].match(/\d\d\d/) !== null) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: fonenrs[0],
                                targetUrl: 'tel:' + fonenrs[0]
                            });
                        } else if (url !== null && url[0].match(/\w\w\w/) !== null) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: url[0],
                                targetUrl: url[0],
                                target: "_blank"
                            });
                        }
                    }
                }
            }
        }
        return resultSet;
    };

    module.removePureAdvancedSearchFacets = function (resultSet) {
        var dataSource = resultSet.sina.getDataSource(resultSet.query.filter.dataSource.id);

        for (var i = 0; i < resultSet.facets.length; i++) {
            var attributeId = resultSet.facets[i].query.dimension;
            var attributeMetaData = dataSource.attributeMetadataMap[attributeId];
            if (attributeMetaData && attributeMetaData.usage.AdvancedSearch && attributeMetaData.usage.Facet === undefined) {
                resultSet.facets.splice(i, 1);
                i = i - 1;
            }
        }
        return resultSet;
    };

    module.isMapsAttribute = function (attribute, returnOnlyBool, i) {
        var res = false;
        var lat, lon, name, val, latIndex, lonIndex, latAttribName, lonAttribName;
        name = attribute.id;
        val = attribute.value;
        if (name.match(/latitude/i) !== null) {
            if (!isNaN(val)) {
                latAttribName = name;
                lat = val;
                latIndex = i;
            }
            res = true;
        } else if (name.match(/longitude/i) !== null) {
            if (!isNaN(val)) {
                lonAttribName = name;
                lon = val;
                lonIndex = i;
            }
            res = true;
        } else if (name.match(/LOC_4326/)) {
            lonIndex = i;
            latIndex = i;
            var oLoc4326 = JSON.parse(val);
            var aCoordinates = oLoc4326.coordinates;
            if (aCoordinates && aCoordinates.length > 1) {
                lon = aCoordinates[0];
                lat = aCoordinates[1];
            }
            res = true;
        }

        if (returnOnlyBool === undefined || returnOnlyBool === true) {
            return res;
        }
        return {
            lat: lat,
            lon: lon,
            latAttribName: latAttribName,
            lonAttribName: lonAttribName,
            latIndex: latIndex,
            lonIndex: lonIndex
        };


    };

    module.addGeoDataIfAvailable = function (itemData) {
        //augment with new geodata attribute
        var res, attributes, lat, lon, dataSource, latIndex, lonIndex;
        attributes = itemData.detailAttributes;
        for (var i = 0; i < attributes.length; i++) {
            res = this.isMapsAttribute(attributes[i], false, i);
            lat = res.lat ? res.lat : lat;
            lon = res.lon ? res.lon : lon;
            latIndex = res.latIndex ? res.latIndex : latIndex;
            lonIndex = res.lonIndex ? res.lonIndex : lonIndex;

            if (lat && lon) {
                break;
            }
        }
        if (lat && lon) {

            //remove lat and long from searchRsultITems

            if (latIndex === lonIndex) {
                attributes.splice(latIndex, 1);
            } else if (latIndex > lonIndex) {
                attributes.splice(latIndex, 1);
                attributes.splice(lonIndex, 1);
            } else {
                attributes.splice(lonIndex, 1);
                attributes.splice(latIndex, 1);
            }


            var newMetadata = {
                sina: itemData.sina,
                type: "GeoJson",
                id: "LOC_4326",
                label: "LOC_4326",
                isCurrency: false,
                IsBoolean: false,
                IsKey: false,
                IsSortable: true,
                isUnitOfMeasure: false,
                semanticObjectType: [],
                isQuantity: "",
                usage: {
                    "Map": "coordinates"
                }
            };
            //creaate new attribute and check whtether geojson metadata exists
            var valStr = '{ "type": "Point", "coordinates": [' + lon + ', ' + lat + ', 0] }';
            var newAttribute = {
                id: "LOC_4326",
                label: "LOC_4326",
                isHighlighted: false,
                value: valStr,
                valueFormatted: valStr,
                valueHighlighted: itemData.sina,
                metadata: newMetadata,
                sina: itemData.sina
            };
            attributes.push(newAttribute);


            dataSource = itemData.sina.getDataSource(itemData.dataSource.id);
            if (!dataSource.attributeMetadataMap.LOC_4326) {
                dataSource.attributesMetadata.push(newMetadata);
                dataSource.attributeMetadataMap.LOC_4326 = newMetadata;
            } else {
                dataSource.attributeMetadataMap.LOC_4326.type = "GeoJson";
                dataSource.attributeMetadataMap.LOC_4326.usage = {
                    "Map": "coordinates"
                };
            }


        }
        return itemData;
    };

    module.cacheDecorator = function (originalFunction) {
        var map = {};
        return function (id) {
            if (map.hasOwnProperty(id)) {
                return map[id];
            }
            var value = originalFunction.apply(this, [id]);
            map[id] = value;
            return value;
        };
    };

    module.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    module.evaluateTemplate = function (template, obj) {

        var placeholderRegExp = new RegExp('{{(.*)}}');
        var getProperty = function (template) {
            var match = placeholderRegExp.exec(template);
            if (!match) {
                return null;
            }
            return match[1];
        };

        var replaceProperty = function (template, property, value) {
            var propertyRegExp = new RegExp('{{' + module.escapeRegExp(property) + '}}', 'g');
            template = template.replace(propertyRegExp, value);
            return template;
        };

        var execute = function (template) {
            var property = getProperty(template);
            if (!property) {
                return template;
            }
            template = replaceProperty(template, property, obj[property]);
            return execute(template);
        };

        return execute(template);
    };

    module.extractRegExp = new RegExp('<b>(.*?)<\\/b>', 'g');
    module.extractHighlightedTerms = function (text) {
        var match;
        var result = [];
        do {
            match = module.extractRegExp.exec(text);
            if (match) {
                result.push(match[1]);
            }
        } while (match);
        return result;
    };

    module.appendRemovingDuplicates = function (list1, list2) {
        for (var i = 0; i < list2.length; ++i) {
            var element = list2[i];
            if (list1.indexOf(element) < 0) {
                list1.push(element);
            }
        }
    };

    return module;

});
