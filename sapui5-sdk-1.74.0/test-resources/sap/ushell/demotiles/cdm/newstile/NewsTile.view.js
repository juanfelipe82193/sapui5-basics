(function() {
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