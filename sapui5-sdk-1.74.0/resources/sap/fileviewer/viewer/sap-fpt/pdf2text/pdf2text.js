/* global module, console, window, require, Uint8Array, global */

(function () {

    'use strict';

    // ===========================================================================
    // set exports
    // ===========================================================================    
    var exports;
    var Promise;
    if (typeof module === 'undefined') {
        // 1) browser
        window.sap = window.sap || {};
        window.sap.es = window.sap.es || {};
        window.sap.es.pdf2text = window.sap.es.pdf2text || {};
        exports = window.sap.es.pdf2text;
        Promise = window.Promise;
    } else {
        // 2) nodejs
        Promise = require('bluebird');
        var fs = Promise.promisifyAll(require('fs'));
        var PDFJS = require('sap-pdfjs');
        exports = module.exports;
    }

    // ===========================================================================
    // text buffer
    // ===========================================================================    
    var TextBuffer = function () {
        this.init.apply(this, arguments);
    };

    TextBuffer.prototype = {
        init: function () {
            this.parts = [];
        },
        write: function (data) {
            this.parts.push(data);
        },
        saveToFile: function (filePath) {
            /* global require, module */
            var textStream = fs.createWriteStream(filePath);
            textStream.write(this.parts.join(''));
            return textStream.endAsync();
        },
        getData: function () {
            return this.parts.join('');
        }
    };


    // ===========================================================================
    // helper document statistic
    // ===========================================================================    
    var DocumentStatistic = function () {
        this.init.apply(this, arguments);
    };

    DocumentStatistic.prototype = {
        init: function () {
            this.pages = [];
        },
        newPage: function () {
            var page = {};
            this.pages.push(page);
            return page;
        },
        save: function () {

        }
    };

    // ===========================================================================
    // class text converter
    // ===========================================================================    
    var TextConverter = function () {
        this.init.apply(this, arguments);
    };

    TextConverter.prototype = {

        init: function (options) {
            if (!options.conversionOptions) {
                options.conversionOptions = exports.getDefaultConversionOptions();
            }
            if (!options.pdfDocument) {
                throw 'missing pdf document for TextConverter';
            }
            this.conversionOptions = options.conversionOptions;
            //console.log(this.conversionOptions);
            this.pdfDocument = options.pdfDocument;
            this.highlightIndex = 0;
            this.highlights = [];
            this.totalLength = 0;
            this.textStream = {
                write: function () { }
            };
            this.documentStatistic = new DocumentStatistic();
        },

        convertToText: function (textStream) {
            var that = this;
            this.textStream = textStream;
            return this.writePage(1).then(function () {
                // nothing todo
            });
        },

        convertHighlights: function (highlights, textStream) {
            var that = this;
            this.highlights = highlights;
            this.highlightIndex = 0;
            if (textStream) {
                this.textStream = textStream;
            }
            return this.writePage(1).then(function () {
                return that.highlights;
            });
        },

        writePage: function (pageNumber) {
            var that = this;

            var page = this.documentStatistic.newPage();

            page.startIndex = this.totalLength;

            if (pageNumber > this.pdfDocument.numPages) {
                return true;
            }
            return this.pdfDocument.getPage(pageNumber).then(function (page) {
                this.viewPort = page.getViewport(1);
                var options = {
                    normalizeWhitespace: true
                };
                return page.getTextContent(options);
            }.bind(this)).then(function (textContent) {
                that.processTextContent(pageNumber, textContent);
                return that.writePage(pageNumber + 1);
            });
        },

        calculateArtificalWhitespace: function (prevItem, item) {

            if (!prevItem || prevItem.str.length === 0 || !item || item.str.length === 0) {
                return null;
            }

            switch (this.conversionOptions.artificalWhitespace) {
                case 'hard':
                    return this.calculateHardWhitespace(prevItem, item);
                case 'smart':
                    return this.calculateSmartWhitespace(prevItem, item);
                default:
                    return null;
            }

        },

        calculateHardWhitespace: function (prevItem, item) {
            if (this.isWhitespace(prevItem.str[prevItem.length - 1]) || this.isWhitespace(item.str[0])) {
                return null;
            }
            return ' ';
        },

        utilTransform: function (m1, m2) {
            return [
                m1[0] * m2[0] + m1[2] * m2[1],
                m1[1] * m2[0] + m1[3] * m2[1],
                m1[0] * m2[2] + m1[2] * m2[3],
                m1[1] * m2[2] + m1[3] * m2[3],
                m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
                m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
            ];
        },

        calcXY: function (item) {
            var t = this.utilTransform(this.viewPort.transform, item.transform);
            var scale = Math.sqrt(t[0] * t[0] + t[1] * t[1]);
            return { x: t[4], y: t[5], angle: Math.atan2(t[1], t[0]) * 180 / Math.PI, ex: t[0] / scale, ey: t[1] / scale };
        },

        calculateSmartWhitespace: function (prevItem, item) {

            // calculate x,y coordinates of item and prev item
            var point = this.calcXY(item);
            var prevPoint = this.calcXY(prevItem);

            // for item with differen text direction: insert line break (except there is whitespace)
            if (Math.abs(point.angle - prevPoint.angle) > 5) {
                if (this.isWhitespace(prevItem.str[prevItem.str.length - 1]) || this.isWhitespace(item.str[0])) {
                    return null;
                }
                return '\n';
            }

            // character width
            var itemCharWidth = item.width / item.str.length;
            var prevItemCharwidth = prevItem.width / prevItem.str.length;
            var charWidth = Math.min(itemCharWidth, prevItemCharwidth);

            // space width 
            var spaceWidth = charWidth * this.conversionOptions.spaceWidth;

            // char height
            var charHeight = item.height;

            // check for newline
            if (Math.abs((prevPoint.x - point.x) * (point.ey) + (prevPoint.y - point.y) * (-point.ex)) >= charHeight) {
                if (this.isNewLine(prevItem.str[prevItem.str.length - 1]) || this.isNewLine(item.str[0])) {
                    return null;
                }
                return '\n';
            }

            // check for space
            if ((point.x - prevPoint.x) * point.ex + (point.y - prevPoint.y) * point.ey - prevItem.width >= spaceWidth) {
                if (this.isWhitespace(prevItem.str[prevItem.str.length - 1]) || this.isWhitespace(item.str[0])) {
                    return null;
                }
                return ' ';
            }

            return null;
        },

        isWhitespace: function (char) {
            return /\s/g.test(char)
        },

        isNewLine: function (char) {
            if (char === '\r' || char === '\n') {
                return true;
            }
            return false;
        },

        processSpecialChars: function (text) {
            return text.replace(new RegExp(String.fromCharCode(173), 'g'), '-');
            //return text.replace(String.fromCharCode(173),'-');
        },

        processTextContent: function (pageNumber, textContent) {

            var item, prevItem;
            for (var j = 0; j < textContent.items.length; ++j) {
                item = textContent.items[j];

                item.str = this.processSpecialChars(item.str);

                // add artifical space between items 
                var whiteSpace = this.calculateArtificalWhitespace(prevItem, item);
                if (whiteSpace) {
                    this.writeAndHighlight(pageNumber, undefined, whiteSpace, j - 1);
                }

                /*if (item.str.indexOf('challenge') >= 0) {
                    this.writeAndHighlight(pageNumber, undefined, 'add', j - 1);
                }*/

                // remove items starting with invalid utf8 character 0x00
                if (item.str.length > 0 && item.str.charCodeAt(0) === 0) {
                    this.writeAndHighlight(pageNumber, j, "");
                    continue;
                }

                this.writeAndHighlight(pageNumber, j, item.str);
                prevItem = item;

            }
        },

        writeAndHighlight: function (pageNumber, itemIndex, text, prevItemIndex) {
            var index1 = this.totalLength;
            this.textStream.write(text);
            this.totalLength += text.length;
            var index2 = this.totalLength - 1;
            this.processHighlight(pageNumber, itemIndex, index1, index2, prevItemIndex);
        },

        processHighlight: function (pageNumber, itemIndex, index1, index2, prevItemIndex) {

            if (this.highlightIndex >= this.highlights.length) {
                return;
            }
            var highlight = this.highlights[this.highlightIndex];

            if (!highlight.pdfFrom && highlight.from <= index2) {
                highlight.pdfFrom = {
                    page: pageNumber,
                    item: itemIndex,
                    prevItem: prevItemIndex,
                    offset: highlight.from - index1
                };
            }
            if (!highlight.pdfTo && highlight.to <= index2) {
                highlight.pdfTo = {
                    page: pageNumber,
                    item: itemIndex,
                    prevItem: prevItemIndex,
                    offset: highlight.to - index1
                };
                this.highlightIndex++;
                this.processHighlight(pageNumber, itemIndex, index1, index2);
            }

        }

    };

    // ===========================================================================
    // default pdf to text conversion options
    // ===========================================================================    
    exports.getDefaultConversionOptions = function () {
        return {
            artificalWhitespace: 'smart',
            spaceWidth: 0.01
        };
    };

    // ===========================================================================
    // convert pdf file to text
    // ===========================================================================    
    exports.convert2Text = function (options) {
        var helper = require('../util/helper.js');
        var textBuffer = new TextBuffer();
        return fs.readFileAsync(options.pdfFilePath).then(function (pdfBuffer) {
            return PDFJS.getDocument(new Uint8Array(pdfBuffer));
        }).then(function (pdfDocument) {
            var converter = new TextConverter({
                pdfDocument: pdfDocument,
                conversionOptions: options.conversionOptions
            });
            return converter.convertToText(textBuffer);
        }).then(function () {
            return textBuffer.saveToFile(helper.replaceFileExtension(options.pdfFilePath, '.txt'));
        }).then(function () {
            console.log('converted to text and saved to', helper.replaceFileExtension(options.pdfFilePath, '.txt'));
        });
    };

    // ===========================================================================
    // convert buffer with pdf to text
    // ===========================================================================    
    exports.convert2TextBuffer = function (options) {
        var textBuffer = new TextBuffer();
        if (!Promise) {
            Promise = window.Promise;//KLUDGE for IE 11
        }
        return Promise.resolve().then(function () {
            if (options.pdfDocument) {
                return options.pdfDocument;
            }
            return PDFJS.getDocument(new Uint8Array(options.pdfBuffer));
        }).then(function (pdfDocument) {
            var converter = new TextConverter({
                pdfDocument: pdfDocument,
                conversionOptions: options.conversionOptions
            });
            return converter.convertToText(textBuffer);
        }).then(function () {
            return textBuffer.getData();
        });
    };

    // ===========================================================================
    // convert highlights
    // ===========================================================================    
    exports.convertHighlights = function (options) {
        var textBuffer;
        if (options.assembleText) {
            textBuffer = new TextBuffer();
        }
        var converter = new TextConverter({
            pdfDocument: options.pdfDocument,
            conversionOptions: options.conversionOptions
        });
        return converter.convertHighlights(options.highlights, textBuffer).then(function (highlights) {
            var result = { highlights: highlights };
            if (textBuffer) {
                result.text = textBuffer.getData();
            }
            return result;
        });
    };

})();
