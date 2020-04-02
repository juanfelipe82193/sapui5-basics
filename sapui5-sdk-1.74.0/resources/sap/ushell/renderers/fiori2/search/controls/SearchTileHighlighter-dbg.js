// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap, window, document */
sap.ui.define([
    'sap/ushell/renderers/fiori2/search/SearchHelper'
], function (Helper) {
    "use strict";

    var Tester = Helper.Tester;

    // =======================================================================
    // tile highlighter
    // =======================================================================
    var Highlighter = sap.ushell.renderers.fiori2.search.controls.SearchTileHighlighter = function () {
        this.init.apply(this, arguments);
    };

    Highlighter.prototype = {

        init: function () {

        },

        setHighlightTerms: function (highlightTerms) {
            this.tester = new Tester(highlightTerms, 'sapUshellSearchHighlight', true, 'or');
        },

        highlight: function (tileView) {
            var node = tileView.getDomRef();
            if (!node) {
                return;
            }

            // bcp ticket 1970162338 + bcp 0000369369 
            var oHyphenation = sap.ui.core.hyphenation.Hyphenation.getInstance();
            if (!oHyphenation.isLanguageInitialized()) {
                oHyphenation.initialize().then(function () {
                    this.doHighlight(node);
                }.bind(this));
            } else {
                this.doHighlight(node);
            }

        },

        doHighlight: function (node) {
            if (node.nodeType === window.Node.TEXT_NODE) {
                this.highlightTextNode(node);
                return;
            }
            for (var i = 0; i < node.childNodes.length; ++i) {
                var child = node.childNodes[i];
                this.doHighlight(child);
            }
        },

        _softHyphenRegExp: new RegExp('[\u00ad]', 'g'),

        removeSoftHyphens: function (text) {
            return text.replace(this._softHyphenRegExp, '');
        },

        highlightTextNode: function (node) {

            // check for match
            var testResult = this.tester.test(this.removeSoftHyphens(node.textContent));
            if (!testResult.bMatch) {
                return;
            }

            // match -> replace dom node
            var spanNode = document.createElement('span');
            spanNode.innerHTML = jQuery.sap.encodeHTML(testResult.sHighlightedText);
            Helper.boldTagUnescaper(spanNode, 'sapUshellSearchHighlight');
            node.parentNode.insertBefore(spanNode, node);
            node.parentNode.removeChild(node);
        }
    };

    return Highlighter;
});
