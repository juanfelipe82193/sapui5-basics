(function() {
    "use strict";
jQuery.sap.declare("sap.ushell.demotiles.cdm.newstile.NewsTileUtils");

window.newstile = window.newstile || {};
newstile.NewsTileUtils = {

    _getSafeTileConfiguration : function (oConfig, oTileProperties) {
        var oMergedConfig;

        if (typeof oConfig !== "object" && typeof oTileProperties !== "object") {
            // clone oTileProperties as it will be modified
            return {};
        }

        // personalization overwrites configuration
        oMergedConfig = jQuery.extend(
            oConfig || {},
            oTileProperties && oTileProperties.tilePersonalization || {}
        );

        return oMergedConfig;
    },

    getDefaultImageConfig : function(oConfig, oTileProperties) {
        this._getSafeTileConfiguration(oConfig, oTileProperties).defaultImage;
    },

    getFinalDefaultImageForDrillDown : function(oChipApi) {
        return "../../../../sap/ushell/demotiles/cdm/newstile/NewsImage1.png";
    },

    getFinalDefaultImages : function() {
        var sBasePath = "../../../../sap/ushell/demotiles/cdm/newstile/";
        var oNamesOfImagesList = [ "NewsImage1.png", "NewsImage2.png", "NewsImage3.png", "NewsImage4.png" ];
        var oImagesList = [];

        for (var i = 0; i < oNamesOfImagesList.length; i++) {
            var oImage = sBasePath + oNamesOfImagesList[i];
            oImagesList.push(oImage);
        }

        return oImagesList;
    },

    getUseDefaultImageConfig : function(oConfig, oTileProperties) {
        return !!this._getSafeTileConfiguration(oConfig, oTileProperties).useDefaultImage;
    },

    getCycleIntervalConfig : function(oConfig, oTileProperties) {
        return this._getSafeTileConfiguration(oConfig, oTileProperties).cycleInterval || 10;
    },

    getRefreshIntervalConfig : function(oConfig, oTileProperties) {
        return this._getSafeTileConfiguration(oConfig, oTileProperties).refreshInterval;
    },

    getFeedConfiguration : function(oConfig, oTileProperties) {

        var i,
            x,
            oSafeConfig = this._getSafeTileConfiguration(oConfig, oTileProperties),
            aFeeds = [],
            oCurrentFeed = "";

        for(i = 1; i <= 10; i += 1) {
            oCurrentFeed = oSafeConfig["feed" + i];
            if (typeof oCurrentFeed === "string" && oCurrentFeed !== "") {
                aFeeds.push(oCurrentFeed);
            }
        }

        for(x in aFeeds){
          if(XMLHttpRequest.channelFactory){
            XMLHttpRequest.channelFactory.ignore.add(aFeeds[x]+"");
          }
        }

        return aFeeds;
    },

    getExclusionFiltersConfiguration : function(oConfig, oTileProperties) {
        var i,
            oSafeConfig = this._getSafeTileConfiguration(oConfig, oTileProperties),
            aExclusionFilters = [],
            sFilter = "";

        for(i = 1; i <= 5; i += 1) {
            sFilter = oSafeConfig["eFilter" + i];
            if (typeof sFilter === "string" && sFilter !== "") {
                aExclusionFilters.push(sFilter);
            }
        }

        return aExclusionFilters;
    },

    getInclusionFiltersConfiguration : function(oConfig, oTileProperties) {
        var i,
            oSafeConfig = this._getSafeTileConfiguration(oConfig, oTileProperties),
            aInclusionFilters = [],
            sFilter = "";

        for(i = 1; i <= 5; i += 1) {
            sFilter = oSafeConfig["iFilter" + i];
            if (typeof sFilter === "string" && sFilter !== "") {
                aInclusionFilters.push(sFilter);
            }
        }

        return aInclusionFilters;
    },
    calculateFeedItemAge : function(dPublicationDate) {

        var sAgo = "";
        if (typeof dPublicationDate == "undefined")
          return sAgo;
        else if (!sap.suite.ui.commons.util.DateUtils.isValidDate(dPublicationDate)) {
            return sAgo;
        }

        var dNow = new Date();

        // ignore milliseconds
        dPublicationDate.setMilliseconds(0);
        dNow.setMilliseconds(0);

        var oLocale = sap.ui.getCore().getConfiguration().getLanguage();
        var oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons", oLocale);

        var nMillisInOneMinute = 60000;
        var nMillisInOneHour = nMillisInOneMinute * 60;
        var nMillisInOneDay = nMillisInOneHour * 24;

        if ((dNow.getTime() - dPublicationDate.getTime()) >= nMillisInOneDay) {

            var nNumberOfDays = parseInt((dNow.getTime() - dPublicationDate.getTime()) / nMillisInOneDay, 10);
            if (nNumberOfDays === 1) {

                sAgo = oResBundle.getText("FEEDTILE_DAY_AGO", [ nNumberOfDays ]);
            } else {

                sAgo = oResBundle.getText("FEEDTILE_DAYS_AGO", [ nNumberOfDays ]);
            }
        } else if ((dNow.getTime() - dPublicationDate.getTime()) >= nMillisInOneHour) {

            var nNumberOfHours = parseInt((dNow.getTime() - dPublicationDate.getTime()) / nMillisInOneHour, 10);

            if (nNumberOfHours === 1) {

                sAgo = oResBundle.getText("FEEDTILE_HOUR_AGO", [ nNumberOfHours ]);
            } else {

                sAgo = oResBundle.getText("FEEDTILE_HOURS_AGO", [ nNumberOfHours ]);
            }
        } else {

            var nNumberOfMins = parseInt((dNow.getTime() - dPublicationDate.getTime()) / nMillisInOneMinute, 10);

            if (nNumberOfMins === 1) {

                sAgo = oResBundle.getText("FEEDTILE_MINUTE_AGO", [ nNumberOfMins ]);
            } else {

                sAgo = oResBundle.getText("FEEDTILE_MINUTES_AGO", [ nNumberOfMins ]);
            }
        }

        return sAgo;
    },
    getDefaultImage : function(oDefaultImages,_defaultImageIndex) {
        var oDefaultImage;

        if (oDefaultImages && oDefaultImages.length > 0) {
            var iLength = oDefaultImages.length;
            if(_defaultImageIndex == -1){
                var iRandom = Math.floor(Math.random() * iLength);
                oDefaultImage = oDefaultImages[iRandom];
            }
            else{

            //this is not the first time, get the next image from list
                var iIndex = (_defaultImageIndex) > iLength ? 0+(_defaultImageIndex-iLength) : _defaultImageIndex;
                _defaultImageIndex = iIndex;
                oDefaultImage = oDefaultImages[iIndex];
            }
        }

        return oDefaultImage;
    }
};
}());
