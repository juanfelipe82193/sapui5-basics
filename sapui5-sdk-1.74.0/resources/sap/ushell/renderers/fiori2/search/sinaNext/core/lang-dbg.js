// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['./core'], function (core) {
    "use strict";

    return {
        getLanguagePreferences: function () {
            var isFirefox = typeof InstallTrigger !== 'undefined';
            var isIE = false || !!document.documentMode;
            var isEdge = !isIE && !!window.StyleMedia;
            var isChrome = !!window.chrome && !!window.chrome.webstore;
            var languagePreferences = [];
            if (isIE || isEdge) {
                var ieLang = window.navigator.browserLanguage || window.navigator.language;
                languagePreferences.splice(0, 0, this._getLanguageCountryObject(ieLang));
            } else if (isFirefox || isChrome) {
                var language = window.navigator.language;
                var languages = window.navigator.languages.slice();
                var index = languages.indexOf(language);
                if (index > -1) {
                    languages.splice(index, 1);
                }
                languagePreferences.splice(0, 0, this._getLanguageCountryObject(language));
                for (var i = 0; i < languages.length; i++) {
                    var languagePreference = this._getLanguageCountryObject(languages[i]);
                    if (languagePreference) {
                        languagePreferences.splice(languagePreferences.length, 0, languagePreference);
                    }
                }
            } else {
                languagePreferences.splice(0, 0, this._getLanguageCountryObject(window.navigator.language));
            }
            return languagePreferences;
        },

        _getLanguageCountryObject: function (l) {
            var language, country;
            var languagePreference = {};
            if (l.length === 2) {
                language = l;
                country = '';
            } else if (l.length === 5 && l.indexOf('-') === 2) {
                language = l.substr(0, 2);
                country = l.substr(3);
            } else {
                return undefined;
            }
            languagePreference.Language = language;
            languagePreference.Country = country;
            return languagePreference;
        }
    };

});
