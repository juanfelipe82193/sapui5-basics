/* global window, Promise, XMLHttpRequest, Uint8Array, module, require, Buffer*/
(function () {
    'use strict';

    // ===========================================================================
    // set exports
    // ===========================================================================    
    var exports, Promise;
    if (typeof module === 'undefined') {
        // 1) browser
        window.sap = window.sap || {};
        window.sap.es = window.sap.es || {};
        window.sap.es.suv = window.sap.es.suv || {};
        exports = window.sap.es.suv;
        Promise = window.Promise;
    } else {
        // 2) nodejs
        Promise = require('bluebird');
        var PDFJS = require('sap-pdfjs');
        exports = module.exports;
    }

    // ===========================================================================
    // utf8 decoder
    // ===========================================================================        
    var decodeUtf8 = function (arrayBuffer) {
        var result = "";
        var i = 0;
        var c = 0;
        var c3 = 0;
        var c2 = 0;


        var data = new Uint8Array(arrayBuffer);

        // If we have a BOM skip it
        if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
            i = 3;
        }

        while (i < data.length) {
            c = data[i];

            if (c < 128) {
                result += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                if (i + 1 >= data.length) {
                    throw "UTF-8 Decode failed. Two byte character was truncated.";
                }
                c2 = data[i + 1];
                result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                if (i + 2 >= data.length) {
                    throw "UTF-8 Decode failed. Multi byte character was truncated.";
                }
                c2 = data[i + 1];
                c3 = data[i + 2];
                result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return result;
    };

    // ===========================================================================
    // ajax get url
    // ===========================================================================        
    var getUrl = function (url, mode) {
        if (Promise === undefined) { Promise = window.Promise; }
        return new Promise(function (resolve, reject) {
            var httpRequest = new XMLHttpRequest();
            if (!httpRequest) {
                reject('error getting ' + url);
                return;
            }
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        resolve(httpRequest.response);
                    } else {
                        reject('There was a problem with the request');
                    }
                }
            };
            //httpRequest.overrideMimeType('text\/plain; charset=x-user-defined');

            httpRequest.open('GET', url);

            if (mode == 'binary') {
                httpRequest.responseType = "arraybuffer";
            }
            httpRequest.send(null);
        });
    };

    // ===========================================================================
    // load suv
    // ===========================================================================    
    exports.getSuv = function (url) {
        var highlights;
        return getUrl(url, 'binary').then(function (data) {
            return exports.disAssembleSuv(data);
        });
    };

    // ===========================================================================
    // create empty default suv data
    // ===========================================================================    
    exports._createDefaultSuvData = function () {
        var suvData = {
            entities: [],
            version: {},
            title: ''
        };
        return suvData;
    };

    // ===========================================================================
    // disassemble suv byte buffer and return suv data
    // ===========================================================================    
    exports._disAssembleSuv = function (suvBuffer) {

        // get pdf-buffer-length from header
        var headerData = suvBuffer.slice(0, 80);
        var pdfByteLength = parseInt(String.fromCharCode.apply(null, new Uint8Array(headerData)));

        // split into pdf-buffer and suv data
        var pdfData = suvBuffer.slice(80, 80 + pdfByteLength);
        var suvData = JSON.parse(decodeUtf8(suvBuffer.slice(80 + pdfByteLength)));

        // support legacy file format
        if (Object.prototype.toString.call(suvData) === '[object Array]') {
            suvData = exports._createDefaultSuvData();
        }

        // fill suv data
        suvData.entities = suvData.entities || [];
        suvData.highlights = suvData.entities; // legacy
        suvData.pdfData = pdfData;
        return suvData;

    };

    // ===========================================================================
    // check if suv buffer is a suv file
    // ===========================================================================    
    exports.isSuv = function (suvBuffer) {
        var header = new Uint8Array(suvBuffer.slice(0, 80));
        if (header.length < 80) {
            return false;
        }

        // check that there is a 80 byte header beginning with digits followed by spaces
        var numberArea = true;
        for (var i = 0; i < 80; ++i) {
            var char = header[i];
            var isDigit = char >= 48 && char <= 57;
            if (numberArea) {
                if (isDigit) {
                    continue;
                }
                if (char !== 32) {
                    return false;
                }
                numberArea = false;
            } else {
                if (char === 32) {
                    continue;
                } else {
                    return false;
                }
            }
        }

        return true;
    };

    // ===========================================================================
    // disassemble suv byte buffer and return suvData
    // ===========================================================================    
    exports.disAssembleSuv = function (suvBuffer) {
        if (exports.isSuv(suvBuffer)) {
            // suv file
            return exports._disAssembleSuv(suvBuffer);
        } else {
            // pdf file
            var suvData = exports._createDefaultSuvData();
            suvData.highlights = suvData.entities; // legacy
            suvData.pdfData = suvBuffer;
            return suvData;
        }
    };

    // ===========================================================================
    // assemble suv byte buffer from suvData
    // ===========================================================================    
    exports.assembleSuv = function (suvData) {

        // 1) assemble header buffer
        var padString = new Array(81).join(' ');
        var headerBuffer = new Buffer(('' + suvData.pdfBuffer.length + padString).slice(0, 80));

        // 2) assemble pdf buffer
        var pdfBuffer = suvData.pdfBuffer;

        // 3) assemble suv data buffer 
        var suvDataFile = {
            version: exports.version(),
            title: suvData.title || '',
            conversionOptions: suvData.conversionOptions,
            entities: suvData.entities,
        };
        var suvDataBuffer = new Buffer(JSON.stringify(suvDataFile));

        // concatenate all buffers
        var suvBuffer = Buffer.concat([headerBuffer, pdfBuffer, suvDataBuffer]);
        return suvBuffer;
    };

    // ===========================================================================
    // version
    // ===========================================================================    
    exports.version = function () {
        return {
            'pdfjs': PDFJS.version,
            'sap-fpt': require('../package.json').version
        };
    };

    exports.Entity2CssClassMapSingleton = (function () {
        var instance;

        function init() {
            var _data = {};

            return {
                hashEntityName: function (originalEntity) {
                    var entityName = 0;
                    var char = '';
                    var len = originalEntity.length;
                    if (len === 0) {
                        return entityName;
                    }

                    for (var i = 0; i < len; i++) {
                        char = originalEntity.charCodeAt(i);
                        entityName = ((entityName << 5) - entityName) + char;
                        entityName |= 0;
                    }
                    entityName = 'entity' + '-' + originalEntity.replace(/\s/g, '').substring(0, 10).toLocaleLowerCase().replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '') + entityName;
                    return entityName;
                },

                // Map entity text to css class name
                // css name has no limitation of length, 
                // shall not begin with digit, --, -digit
                mapEntityToCssClass: function (entityText) {
                    if (_data[entityText]) {
                        return _data[entityText];
                    } else {
                        var className = this.hashEntityName(entityText);
                        _data[entityText] = className;
                        return className;
                    }
                },

                getValue: function (key) {
                    return _data[key];
                }
            };
        };

        return {
            getInstance: function () {
                if (!instance) {
                    instance = init();
                }

                return instance;
            }
        };
    })();

})();