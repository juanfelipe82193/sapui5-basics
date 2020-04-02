  define([], function() {
    var PropertyTree = {
      infoNum: 0,

      isEmptyObj: function(obj) {
        if (!obj)
          return true;
        for (var o in obj) {
          if (obj.hasOwnProperty(o)) {
            return false;
          }
        }
        return true;
      },

      initialPropertyTree: function() {
        
        //var chartTree = [];
        var galleryTree = [];
        var vizTree = [];
        this.infoNum = 0,
        this.vizNum = 0;
        var vizChart = [], infoChart = [], chartCategory, chartType, type;
        for (var i = allCharts.length -1 ; i >= 0; i--) {
          chartType = allCharts[i].title;
          if(chartType.indexOf('Charts') === 0){
            type = 'info';
          } else {
            type = 'viz';
          }
          chartCategory = allCharts[i].pages;
          vizChart = [];
          gallery = [];
          for (var j = 0; j < chartCategory.length; j++) {
            vizChart.push(this.showOutput(chartCategory[j], type));
            gallery.push(this.showGallery(chartCategory[j]));
          }
          vizTree.push({
              "headline": chartType,
              "count": (type === 'viz')? this.vizNum: this.infoNum,
              "chart_category": chartType,
              "pages": vizChart
            });
          if( type === 'viz' ){
            galleryTree.push({
              "headline": chartType,
              "count": this.vizNum,
              "chart_category": chartType,
              "pages": gallery
            });
          }      
        }
        window._CHARTSET = vizTree;
      },

      showOutput: function(node, type) {
        var result = [];
        var child = [];
        var url;
        var message = "";
        //var allChartTypeScales = window.allChartTypeScales || {};
        if (node.has_property === true) {
          var name = node.chart_name;
          var id = node.chart_id;
          if(type === 'info'){
            this.infoNum++;
          }else{
            // this.vizNum++;
          }
          url = "docs/chartproperty/chartproperty.html?chartid=" + type+"/"+id + "&chartname=" + name.replace("%", "%25");
          if (type === 'info') {
            // if(!allChartTypeScales[id]){
            //   return false;
            // }
            child = this.createInfoChartProperty(type + '/' + id, url);
          }else{
            child = this.createAllChartProperty(type + '/' + id, url);
          }
          if (child.length != 0) {
            result = {
              "title": name,
              "chart_category": name,
              "chart_id": id,
              "url": url,
              "pages": child
            };
          } else {
            result = {
              "title": name,
              "url": url,
              "chart_id": id
            };
          }
        } else {
          var pages = node.pages;
          if (pages === undefined) {
            return;
          }
          for (var i = 0; i < pages.length; i++) {
            var res = this.showOutput(pages[i], type);
            if(res !== false){
              child.push(res);
            }
            
          }
          message = "  (" + child.length + ")";
          if (child.length !== 0) {
            result = {
              "title": node.title + message,
              "chart_category": node.title,
              "pages": child
            };
          } else {
            return;
          }
        }
        return result;
      },

      showGallery: function(node) {
        var result = [];
        var child = [];
        var url;
        var message = "";
        if (node.has_property === true) {
          url = "docs/chartGallery/chartGallery.html?chartid=" + node.chart_id;
          result = {
            "title": node.chart_name,
            "url": url,
            "chart_id": node.chart_id
          };
        } else {
          var value = node.pages;
          if (value === undefined) {
            return;
          }
          for (var i = 0; i < value.length; i++) {
            child.push(this.showGallery(value[i]));
          }
          message = "  (" + child.length + ")";
          if (child.length != 0) {
            result = {
              "title": node.title + message,
              "chart_category": node.title,
              "pages": child
            };
          } else {
            return;
          }
        }
        return result;
      },

      createInfoChartProperty: function(id, url) {
        var allProperties = [];
        var getMetadata = sap&&sap.viz&&sap.viz.api&&sap.viz.api.metadata&&
                       sap.viz.api.metadata.Viz&&sap.viz.api.metadata.Viz.get();

        for(var index in getMetadata){
          if(getMetadata.hasOwnProperty(index)){
            //allChartTypeProperties[getMetadata[index].type] = getMetadata[index].properties;
            if(getMetadata[index].type == id){
              var property = getMetadata[index].properties;
              break;
            }
          }
        }

        //var property = Manifest.viz.get(id).allProperties();
        for (var o in property) {
          if (o === "rotate" || property[o] === undefined || this.isEmptyObj(property[o])) continue;
          var c = this.writeInfoChartProperty(property[o].children, o, url);
          if (c.length != 0) {
            allProperties.push({
              "title": o + "  {...}",
              "chart_category": o,
              "url": url + "&property=" + o,
              "pages": c
            });
          } else {
            allProperties.push({
              "title": o,
              "url": url + "&property=" + o
            });
          }
        }
        return allProperties;
      },

      createAllChartProperty: function(id, url) {
        var allProperties = [];
        var Manifest = sap&&sap.viz&&sap.viz.manifest;
        var property = Manifest&&Manifest.viz&&Manifest.viz.get(id).allProperties()||{};
        for (var o in property) {
          if (o === "rotate" || property[o] === undefined || this.isEmptyObj(property[o])) continue;
          var c = this.writeProperty(property[o], o, url);
          if (c.length != 0) {
            allProperties.push({
              "title": o + "  {...}",
              "chart_category": o,
              "url": url + "&property=" + o,
              "pages": c
            });
          } else {
            allProperties.push({
              "title": o,
              "url": url + "&property=" + o
            });
          }
        }
        return allProperties;
      },

      writeInfoChartProperty: function(obj, rootName, url) {
        if (obj === undefined || this.isEmptyObj(obj)) return [];
        var property = [];
        for (var o in obj) {
          if (obj[o] === undefined || obj[o] === null){
            continue;
          }
          //if (obj[o].supportedValueType === 'Object') {
          if ( typeof(obj[o].children) === 'object' && obj[o].children) {
            var rootName2 = rootName + "_" + o;
            var c = this.writeInfoChartProperty(obj[o].children, rootName2, url);
            property.push({
              "title": o + "  {...}",
              "chart_category": o,
              "url": url + "&property=" + rootName2,
              "pages": c
            });
          } else {
            var rootName2 = rootName + "_" + o;
            property.push({
              "title": o,
              "url": url + "&property=" + rootName2
            });
          }
        }
        return property;
      },

      writeProperty: function(obj, rootName, url) {
        if (obj === undefined || this.isEmptyObj(obj)) return [];
        var property = [];
        for (var o in obj) {
          if (obj[o].supportedValueType === 'Object') {
            var rootName2 = rootName + "_" + obj[o].name;
            var c = this.writeProperty(obj[o].supportedValues, rootName2, url);
            property.push({
              "title": obj[o].name + "  {...}",
              "chart_category": obj[o].name,
              "url": url + "&property=" + rootName2,
              "pages": c
            });
          } else {
            var rootName2 = rootName + "_" + obj[o].name;
            property.push({
              "title": obj[o].name,
              "url": url + "&property=" + rootName2
            });
          }
        }
        return property;
      }
    };

    var tree = PropertyTree;

    tree.initialPropertyTree();

  });
