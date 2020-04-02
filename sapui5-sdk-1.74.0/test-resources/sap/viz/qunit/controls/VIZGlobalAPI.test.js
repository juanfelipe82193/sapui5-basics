/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
  "sap/viz/ui5/Bar",
  "sap/viz/ui5/controls/VizFrame",
  "sap/viz/ui5/data/FlattenedDataset",
  "sap/ui/Device",
  "sap/ui/model/json/JSONModel"
], function(Bar, VizFrame, FlattenedDataset, Device, JSONModel) {

var oChart, oVizFrame;
QUnit.module("Check Chart Language.");
QUnit.test("a1a2m1m1 VizFrame Bar", function(assert){
      var done = assert.async();
      assert.ok(true, "a1a2m1m1 VizFrame Bar chart.");
      var oDataset = new FlattenedDataset(a1a2m1m1Data);
      var oModel = new JSONModel(a1a2m1m1Model);
      oDataset.setModel(oModel);
      oChart = new Bar('vizChart', {
        width : "800px",
        height : "600px",
        plotArea : {
          animation : {
            dataLoading : false,
            dataUpdating : false,
            resizing : false
          }
        },
        title : {
          visible : true
        },
        legend : {
          title : {
            visible : true
          }
        },
        dataset: oDataset
      });
      oChart.placeAt("content");
      var oDataset = new FlattenedDataset(a1a2m1m1Data);
      var oModel = new JSONModel(a1a2m1m1Model);
      oDataset.setModel(oModel);
      oVizFrame = new VizFrame("vizframeChart", {
        'width': '800px',
        'height': '600px',
          'uiConfig' : {
            'applicationSet': 'fiori'
          },
          'vizType' : 'bar'
       });
      oVizFrame.setDataset(oDataset);
      var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
          'uid' : "primaryValues",
          'type' : "Measure",
          'values' : ["REVENUE1", "REVENUE2"]
        }), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
          'uid' : "axisLabels",
          'type' : "Dimension",
          'values' : [ "COUNTRY"]
        }), feedRegionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
          'uid' : "regionColor",
          'type' : "Dimension",
          'values' : [ "YEAR"]
        });
      oVizFrame.addFeed(feedPrimaryValues);
      oVizFrame.addFeed(feedAxisLabels);
      oVizFrame.addFeed(feedRegionColor);
      oVizFrame.placeAt('content');
      oVizFrame.setVizProperties({
          legend : {
              title : {
                visible : true
              }
            }
      });
      function checkDefaultLanguageText() {
            assert.equal($('#vizChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en in first loading.');
          //Legend title turn off in fiori template
          //equal($('#vizChart .v-m-legend .v-title').text(), "All Measures - YEAR", 'All Measures Default language is en.');
            assert.equal($('#vizframeChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en in first loading.');
            assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / All Measures", 'All measures Default language is en in first loading.');
            oVizFrame.detachEvent("renderComplete", checkDefaultLanguageText);
            oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_De);
            sap.ui.getCore().getConfiguration().setLanguage("de_DE");
      }

      function checkLanguage_De() {
          assert.equal($('#vizChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de in first setLocal.');
          assert.equal($('#vizChart .v-m-legend .v-title').text(), "Alle Kennzahlen - YEAR", 'All Measures Default language is de in first setLocal.');
            //TODO Chart's default title can't be customized. Vizframe needs to fix it.
            //SAP Jira BITSDC2-1603
            //equal($('#vizframeChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de.');
          assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / Alle Kennzahlen", 'All Measures Default language is de in first setLocal.');
          oVizFrame.detachEvent('renderComplete', checkLanguage_De);
          //disable on mar chrome due to fail in mac chrome 45 and viz chart is deprecated now.
          if (!(Device.os.macintosh && Device.browser.chrome)) {
              oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_En);
              sap.ui.getCore().getConfiguration().setLanguage("en_US");
          } else {
              done();
          }
      }

      function checkLanguage_En() {
          assert.equal($('#vizChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en.');
          // in case of too small screen size the text gets truncated and a
          // title sub tag with the full text has been created
          if ($('#vizChart .v-m-legend .v-title title').length > 0) {
              assert.equal($('#vizChart .v-m-legend .v-title title').text(), "All Measures - YEAR", 'All Measures Default language is en when setLocal as en.');
          } else {
              assert.equal($('#vizChart .v-m-legend .v-title').text(), "All Measures - YEAR", 'All Measures Default language is en when setLocal as en.');
          }
          
          assert.equal($('#vizframeChart .v-m-title text').text(), "Title of Chart", 'Title Default language is en when setLocal as en.');
          assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / All Measures", 'All measures Default language is en when setLocal as en.');
          oVizFrame.detachEvent('renderComplete', checkLanguage_En);
          oVizFrame.attachEventOnce("renderComplete", null, checkLanguage_De2);
          sap.ui.getCore().getConfiguration().setLanguage("de_DE");
      }

      function checkLanguage_De2() {
          assert.equal($('#vizChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de when setLocal as de.');
          assert.equal($('#vizChart .v-m-legend .v-title').text(), "Alle Kennzahlen - YEAR", 'All Measures Default language is de when setLocal as de.');
          
          //TODO Chart's default title can't be customized. Vizframe needs to fix it.
          //SAP Jira BITSDC2-1603
          //equal($('#vizframeChart .v-m-title text').text(), "Diagrammtitel", 'Title Default language is de.');
          assert.equal($('#vizframeChart .v-m-legend .v-title').text(), "YEAR / Alle Kennzahlen", 'All Measures Default language is de when setLocal as de.');
          oVizFrame.detachEvent('renderComplete', checkLanguage_De2);
          done();
      }
      oVizFrame.attachEventOnce('renderComplete', checkDefaultLanguageText);
});

QUnit.test("Set numericformatter", function(assert){
    var done = assert.async();
    sap.viz.api.env.Format.numericFormatter({
        format : function(value, pattern) {
            var result = value;
            switch(pattern){
                case 'u1' : 
                  result = result + "-" + pattern;
                  break;
            }
            return result;
        }
    });  
    oChart.getXAxis().getLabel().setFormatString('u1');
    oVizFrame.setVizProperties({"xAxis":{"label":{"formatString":"u1"}}});
    assert.ok(true, "Apply Customer Format.");
    oVizFrame.attachEventOnce('renderComplete', function() {
        assert.equal($('#vizChart .v-m-xAxis .v-label text')[0].textContent, "0-u1", 'viz format should work.');     
        assert.equal($('#vizframeChart .v-m-valueAxis .v-label text')[0].textContent, "0-u1", 'vizframe format should work.');
        cleanChart();
        done();
    });
});

var cleanChart = function() {
    if (oChart) {
      oChart.destroy();
    }
};

QUnit.start();

});
