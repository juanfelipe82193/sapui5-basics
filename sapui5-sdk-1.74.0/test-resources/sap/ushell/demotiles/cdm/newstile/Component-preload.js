//@ui5-bundle sap/ushell/demotiles/cdm/newstile/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demotiles/cdm/newstile/Component.js":function(){// ${copyright}
(function() {
"use strict";
/* global jQuery, sap, window */

jQuery.sap.declare("sap.ushell.demotiles.cdm.newstile.Component");

sap.ui.define([
               "sap/ui/core/UIComponent"
    ], function(UIComponent) {
        return UIComponent.extend("sap.ushell.demotiles.cdm.newstile.Component", {
            metadata : {
                "manifest": "json"
            },

            // new API (optional)
            tileSetVisible : function(bNewVisibility) {
                // forward to controller
                // not implemented
                //this._controller.visibleHandler(bNewVisibility);
            },

            // new API (optional)
            tileRefresh : function() {
                // forward to controller
                this._controller.refresh(this._controller);
            },

            // new API (mandatory)
            tileSetVisualProperties : function(oNewVisualProperties) {
                // forward to controller
                // NOP: visual properties are not displayed on the tile
            },

            createContent : function() {
                var oTile = sap.ui.view({
                    viewName : "sap.ushell.demotiles.cdm.newstile.NewsTile",
                    type : sap.ui.core.mvc.ViewType.JS,
                    async: true
                });

                oTile.loaded().then(function (oView) {
                    this._controller = oTile.getController();
                }.bind(this));

                return oTile;
            }
        });
});
}());
},
	"sap/ushell/demotiles/cdm/newstile/NewsTile.controller.js":function(){(function() {
"use strict";

/* global newstile */

jQuery.sap.require("sap.ushell.demotiles.cdm.newstile.NewsTileUtils");

sap.ui.controller("sap.ushell.demotiles.cdm.newstile.NewsTile", {
    onInit : function() {

        var that = this,
            oConfig = this.getOwnerComponent().getManifestEntry("/sap.ui5/config"),
            oComponentData = this.getOwnerComponent().getComponentData(),
            oTileProperties = oComponentData.properties,
            iRefreshInterval = newstile.NewsTileUtils.getRefreshIntervalConfig(oConfig, oTileProperties);

        this._feedsRefreshComplete = true;
        this._oConfig = oConfig;

        if (iRefreshInterval) {
            this.intervalRefObj = setInterval(function () {

                that.refreshFeeds();
            }, iRefreshInterval);
        }
    },

    onBeforeRendering : function() {
        var newsTile = this.byId("feedTile");
        window.neema =newsTile;
        var binding = newsTile.getBinding("items");
        if (binding !== undefined) {
            var sorter = new sap.ui.model.Sorter("pubDate", true);
            binding.sort([ sorter ]);
        }
    },

    select : function(evt) {

        // Determine current news feed item
        var itemId = evt.getParameter("id"); // <- "itemId"
        var feedItem = sap.ui.getCore().byId(itemId);
        this.getView().selectedItem = feedItem;

        // Navigate to navigation sample app,
        // ... as news app (sap/ar_srvc_news) may not be available
        var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
        var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
        oCrossAppNavigator.toExternal({
            target : {
                semanticObject : "Action", //  <- "NewsFeed"
                action : "toappnavsample" // <- "displayNewsList"
            },
            params : {
                newsViewId : this.getView().getId()
            }
        });
    },

    refreshFeeds : function() {

        var that = this,
            oComponentData = this.getOwnerComponent().getComponentData(),
            oTileProperties = oComponentData.properties,
            oConfig = this._oConfig;

        // TODO: Serialize calls to the aggregator so that we
        // don't have more than one feed refresh executing at
        // the same time.
        var aInclusionFiltersConfiguration = newstile.NewsTileUtils.getInclusionFiltersConfiguration(oConfig, oTileProperties);
        var aExclusionFiltersConfiguration = newstile.NewsTileUtils.getExclusionFiltersConfiguration(oConfig, oTileProperties);
        if (this._feedsRefreshComplete) {
            this._feedsRefreshComplete = false;
            jQuery.sap.log.debug("NewsTile.controller: Calling aggregator to refresh feeds.");
            this.model = sap.suite.ui.commons.util.FeedAggregator.getFeeds(
                newstile.NewsTileUtils.getFeedConfiguration(oConfig, oTileProperties),
                aInclusionFiltersConfiguration,
                aExclusionFiltersConfiguration,
                function() {
                    that.feedsRefreshed();
                    that.getView()._newsTile.cycle();
                    // sort feed list
                    var newsTile = that.byId("feedTile");
                    var binding = newsTile.getBinding("items");
                    if (binding !== undefined) {
                        var sorter = new sap.ui.model.Sorter("pubDate", true);
                        binding.sort([ sorter ]);
                    }
                    that.getView().newsModel = that.getView()._newsTile.getModel();
                });
        } else {
            jQuery.sap.log.debug("NewsTile.controller: Skipping feeds refresh, previous refresh not completed.");
        }
    },

    feedsRefreshed : function() {

        this.byId("feedTile").stageModel(this.model);
        this._feedsRefreshComplete = true;
    },

    getNewsTileTooltip : function() {
        var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
        var oBundle = jQuery.sap.resources({
            url : "../../../../sap/ushell/demotiles/cdm/newstile/news_tile.properties",
            locale : sLocale
        });

        return oBundle.getText("NEWS_TILE_TOOLTIP");
    },

    onExit : function() {

        clearInterval(this.intervalRefObj);
    },

    refresh : function(oController) {

        oController.getView()._newsTile.rerender();
    },
    getPreviewData : function(oController){
        var items = [];
        var aItems = {};
        var obj = {};
        obj["image"]  = newstile.NewsTileUtils.getDefaultImage(this.getView().oDefaultImages, -1);
        obj["title"] = "No articles to display";
        items.push(obj);
        aItems["items"] = items;
        return aItems;
    }
});
}());
},
	"sap/ushell/demotiles/cdm/newstile/NewsTile.view.js":function(){(function() {
    "use strict";
jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("sap.ushell.demotiles.cdm.newstile.NewsTileUtils");
jQuery.sap.require("sap.suite.ui.commons.FeedTile");
jQuery.sap.require("sap.suite.ui.commons.FeedItem");
jQuery.sap.require("sap.suite.ui.commons.util.FeedAggregator");

sap.ui.jsview("sap.ushell.demotiles.cdm.newstile.NewsTile", {

    getControllerName : function() {

        return "sap.ushell.demotiles.cdm.newstile.NewsTile";
    },

    createContent : function(oController) {
        var that = this,
            oConfig = oController.getOwnerComponent().getManifestEntry("/sap.ui5/config"),
            oComponentData = oController.getOwnerComponent().getComponentData(),
            oTileProperties = oComponentData.properties;

        this.setHeight('100%');
        jQuery.sap.includeStyleSheet("../../../../sap/ushell/demotiles/cdm/newstile/news_tile.css");


        this.oDefaultImages = [];
        var sTooltip = "";
        var oDefaultImage = newstile.NewsTileUtils.getDefaultImageConfig(oConfig, oTileProperties);

        if (!oDefaultImage) {
            this.oDefaultImages = newstile.NewsTileUtils.getFinalDefaultImages(oConfig, oTileProperties);
        } else {
            this.oDefaultImages.push(oDefaultImage);
        }

        sTooltip = oController.getNewsTileTooltip();

        //-----------------------------------------------******------------------------------------------\\
          var oNewsTileContent = new sap.suite.ui.commons.TileContent({
              footer : {
                  path : "pubDate",
                  formatter: function (date) {
                      return  newstile.NewsTileUtils.calculateFeedItemAge(date);
                  }
              },
               content: new sap.suite.ui.commons.NewsContent({
                      contentText: "{title}",
                       subheader: "{source}"
              })
       });

      this.oNewsTile = new sap.suite.ui.commons.GenericTile({
               frameType: "TwoByOne",
               header: "{header}",
               size: "{size}",
              backgroundImage : "{image}",
              tileContent: [
                  oNewsTileContent
               ],
               press : function(evt) {

                   oController.select(evt);
               },
      });

      this._newsTile = new sap.suite.ui.commons.DynamicContainer(oController.createId("feedTile"), {
              displayTime:  newstile.NewsTileUtils.getCycleIntervalConfig(oConfig, oTileProperties), // parseInt
              transitionTime: 500,
               tiles: {
                      template: that.oNewsTile,
                      path: "/items"
              },

       });
      this.oNewsTile.attachPress(function(evt){
          oController.select(evt);
      });
        //------------------------------------------------*****---------------------------------------------\\
        var aFeedConfiguration = newstile.NewsTileUtils.getFeedConfiguration(oConfig, oTileProperties);
        var aInclusionFiltersConfiguration = newstile.NewsTileUtils.getInclusionFiltersConfiguration(oConfig, oTileProperties);
        var aExclusionFiltersConfiguration = newstile.NewsTileUtils.getExclusionFiltersConfiguration(oConfig, oTileProperties);

        var that = this;
        this.oFeeds = sap.suite.ui.commons.util.FeedAggregator.getFeeds(aFeedConfiguration, aInclusionFiltersConfiguration, aExclusionFiltersConfiguration, function() {
             that._newsTile.setModel(that.oFeeds);
             that.newsModel = that.oFeeds;
             if (!newstile.NewsTileUtils.getUseDefaultImageConfig(oConfig, oTileProperties)){
                 for ( var i = 0; i < that._newsTile.getModel().getData().items.length; i = i + 1){
                     that._newsTile.getModel().getData().items[i].image =  newstile.NewsTileUtils.getDefaultImage(that.oDefaultImages,i);
                 }
                 that._newsTile.getModel().updateBindings();
             }

            that._newsTile.rerender();
        });
            var data = this.oFeeds.getData();
             this._newsTile.setModel(this.oFeeds);
             this.newsModel = this.oFeeds;
             if (Object.getOwnPropertyNames(data).length == 0){
                 this._newsTile.getModel().setData( oController.getPreviewData());
                 this._newsTile.getModel().updateBindings();
               //  this._newsTile.rerender();
             }

        this._newsTile.addStyleClass("newsTileStyle");
        return this._newsTile;

    }
});
}());
},
	"sap/ushell/demotiles/cdm/newstile/NewsTileUtils.js":function(){(function() {
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
},
	"sap/ushell/demotiles/cdm/newstile/manifest.json":'{\n    "_version": "1.1.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x2"\n    },\n    "sap.app": {\n        "id": "sap.ushell.demotiles.cdm.newstile",\n        "_version": "1.0.0",\n        "i18n": "news_tile.properties",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "{{title}}",\n        "description": "{{description}}",\n        "tags": {\n            "keywords": [\n                "{{keyword.news}}", "{{keyword.feeds}}", "RSS"\n            ]\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "My-newsTile": {\n                    "semanticObject": "My",\n                    "action": "newsTile",\n                    "signature": {\n                        "parameters": {}\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ]\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap.ushell.demotiles.cdm.newstile",\n        "config": {\n            "defaultImage": "",\n            "useDefaultImage": false,\n            "cycleInterval": 7000,\n            "refreshInterval": 0,\n            "feed1": "../../../../sap/ushell/test/feeds/fakenews.rss",\n            "feed2": "",\n            "feed3": "",\n            "feed4": "",\n            "feed5": "",\n            "feed6": "",\n            "feed7": "",\n            "feed8": "",\n            "feed9": "",\n            "feed10": "",\n            "eFilter1": "",\n            "eFilter2": "",\n            "eFilter3": "",\n            "eFilter4": "",\n            "eFilter5": "",\n            "iFilter1": "",\n            "iFilter2": "",\n            "iFilter3": "",\n            "iFilter4": "",\n            "iFilter5": ""\n        },\n        "dependencies": {\n            "minUI5Version": "1.38",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "news_tile.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.demotiles.cdm.newstile.NewsTile",\n            "type": "JS"\n        },\n        "handleValidation": false\n    }\n}',
	"sap/ushell/demotiles/cdm/newstile/news_tile_configuration_en.properties":'# runtime generated properties file from SAPUI5 Text Repository\r\nCYCLE_INTERVAL_LABEL =Article Cycle Interval (secs)\r\nDEFAULT_IMAGE_LABEL =Tile Default Image\r\nEXCLUSION_FILTERS_HEADER =Exclusion Filters\r\nEXCLUSION_FILTER_FIVE_LABEL =Filter #5\r\nEXCLUSION_FILTER_FOUR_LABEL =Filter #4\r\nEXCLUSION_FILTER_ONE_LABEL =Filter #1\r\nEXCLUSION_FILTER_THREE_LABEL =Filter #3\r\nEXCLUSION_FILTER_TWO_LABEL =Filter #2\r\nFEEDS_HEADER =Article Feeds\r\nFEED_EIGHT_LABEL =Feed #8\r\nFEED_FIVE_LABEL =Feed #5\r\nFEED_FOUR_LABEL =Feed #4\r\nFEED_NINE_LABEL =Feed #9\r\nFEED_ONE_LABEL =Feed #1\r\nFEED_SEVEN_LABEL =Feed #7\r\nFEED_SIX_LABEL =Feed #6\r\nFEED_TEN_LABEL =Feed #10\r\nFEED_THREE_LABEL =Feed #3\r\nFEED_TWO_LABEL =Feed #2\r\nGENERAL_HEADER =General\r\nINCLUSION_FILTERS_HEADER =Inclusion Filters\r\nINCLUSION_FILTER_FIVE_LABEL =Filter #5\r\nINCLUSION_FILTER_FOUR_LABEL =Filter #4\r\nINCLUSION_FILTER_ONE_LABEL =Filter #1\r\nINCLUSION_FILTER_THREE_LABEL =Filter #3\r\nINCLUSION_FILTER_TWO_LABEL =Filter #2\r\nREFRESH_INTERVAL_FIVE_ITEM =12 hours\r\nREFRESH_INTERVAL_FOUR_ITEM =4 hours\r\nREFRESH_INTERVAL_LABEL =Article Refresh Interval\r\nREFRESH_INTERVAL_ONE_ITEM =15 Minutes\r\nREFRESH_INTERVAL_THREE_ITEM =1 hour\r\nREFRESH_INTERVAL_TWO_ITEM =30 Minutes\r\nSUBMIT_BUTTON_LABEL =Submit\r\nUSE_DEFAULT_IMAGE_LABEL =Always Use Default Image',
	"sap/ushell/demotiles/cdm/newstile/news_tile_en.properties":'# runtime generated properties file from SAPUI5 Text Repository\r\nNEWS_TILE_TOOLTIP =News Tile\r\n\r\n# XTIT: Dialog title\r\ntitle=News Tile\r\n\r\n# XTXT: description\r\ndescription=Tile which displays entries from one or more feeds\r\n\r\n# XTXT: keyword\r\nkeyword.news=News\r\n# XTXT: keyword\r\nkeyword.feeds=Feeds'
},"sap/ushell/demotiles/cdm/newstile/Component-preload"
);
