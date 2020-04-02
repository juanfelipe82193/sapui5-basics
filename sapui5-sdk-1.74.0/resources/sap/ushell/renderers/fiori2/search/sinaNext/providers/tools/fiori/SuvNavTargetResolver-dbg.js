// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine $*/

sinaDefine([
    '../../../sina/SinaObject'
], function (SinaObject) {
    "use strict";
    /*
    var curTheme = "";
    var getCurrentTheme = function () {
        if (!curTheme) {
            curTheme = getTheme();
        }
        return curTheme;
    };
    */
    var getTheme = function () {
        var themes = [];
        $.each(document.styleSheets, function (index, cssFile) {
            if (cssFile.href) {
                var fname = cssFile.href.toString();
                var regex = /themes\/(.+)\/library.css/;
                var matches = regex.exec(fname);
                if (matches !== null) {
                    themes.push(matches[1]);
                    return false; //jquery syntax for 'break'
                }
            }
            return true;
        });
        return themes[0];
    };
    var addThemeToURL = function (url) {
        var res = url;
        var theme = getTheme();
        if (!theme) {
            return res;
        }
        theme = "sap-theme=" + theme + "&";
        if (url.indexOf("sap-theme=") === -1) {
            if (url.indexOf("?") !== -1) {
                res = url.replace("?", "?" + theme);
            }
        }
        return res;
    };

    return SinaObject.derive({

        _init: function () {
            this.suvMimeType = "application/vnd.sap.universal-viewer+suv";
            this.suvViewerBasePath = "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/fileviewer/viewer/web/viewer.html?file=";
        },

        addHighlightTermsToUrl: function (url, highlightTerms) {
            if (!highlightTerms) {
                return url;
            }
            url += '&searchTerms=' + encodeURIComponent(JSON.stringify({
                'terms': highlightTerms
            }));
            return url;
        },

        resolveSuvNavTargets: function (dataSource, suvAttributes, suvHighlightTerms) {

            for (var suvAttributeName in suvAttributes) {
                var openSuvInFileViewerUrl;
                var suvAttribute = suvAttributes[suvAttributeName];
                var thumbnailAttribute = suvAttribute.suvThumbnailAttribute;
                if (suvAttribute.suvTargetMimeTypeAttribute.value === this.suvMimeType) {
                    openSuvInFileViewerUrl = this.suvViewerBasePath + encodeURIComponent(suvAttribute.suvTargetUrlAttribute.value);
                    openSuvInFileViewerUrl = this.addHighlightTermsToUrl(openSuvInFileViewerUrl, suvHighlightTerms);
                    openSuvInFileViewerUrl = addThemeToURL(openSuvInFileViewerUrl);
                    thumbnailAttribute.defaultNavigationTarget = this.sina._createNavigationTarget({
                        label: suvAttribute.suvTargetUrlAttribute.value,
                        targetUrl: openSuvInFileViewerUrl,
                        target: '_blank'
                    });
                } else {
                    openSuvInFileViewerUrl = suvAttribute.suvTargetUrlAttribute.value;
                    thumbnailAttribute.defaultNavigationTarget = this.sina._createNavigationTarget({
                        label: suvAttribute.suvTargetUrlAttribute.value,
                        targetUrl: openSuvInFileViewerUrl,
                        target: '_blank'
                    });
                }
            }
        }
    });
});
