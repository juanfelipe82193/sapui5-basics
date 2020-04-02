require([
  "allChartTypeProperties",
  "allChartTypeBindings",
  "allChartTypeScales"
  
], function (allChartTypeProperties, allChartTypeBindings, allChartTypeScales, allChartPropertiesWithHichert, allChartTypeBindingsWithHichert, allChartTypeScalesWithHichert) {
  var mergeObj = function(obj1, obj2){
    for (var attrname in obj2) { 
      obj1[attrname] = obj2[attrname]; 
    }
  };
  if(allChartPropertiesWithHichert){
    mergeObj(allChartTypeProperties, allChartPropertiesWithHichert);
  }
  if(allChartTypeBindingsWithHichert){
    mergeObj(allChartTypeBindings, allChartTypeBindingsWithHichert);
  }
  if(allChartTypeScalesWithHichert){
    mergeObj(allChartTypeScales, allChartTypeScalesWithHichert);
  }
  
  
  if (!window.sap) {
    window.sap = undefined;
  }
  var Manifest = sap && sap.viz && sap.viz.manifest || {};

  /******************utility************************************/
  var utility = {
    Constants: ['name', 'supportedValueType', 'supportedValues', 'defaultValue', 'description', 'isExported', 'example'],
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


    /**
     * Deep copy the options from common chart manifests
     * @param src
     * @returns {Object}
     * @author Nick
     */
    deepCopy: function(src) {
      var dest = new Object();
      if (typeof(src) == 'object') {
        if (src instanceof Array) {
          dest = new Array();
        }
        for (var iname in src) {
          if (src[iname] != null && typeof(src[iname]) == 'object') {
            dest[iname] = this.deepCopy(src[iname]);
          } else {
            dest[iname] = src[iname];
          }
        }
      }
      return dest;
    },

    initialPropertyValue: function(props, target) {
      for (var o in props) {
        if (props.hasOwnProperty(o) && target.hasOwnProperty(o)) {
          if (typeof props[o] !== 'object' || props[o] instanceof Array) {
            target[o]['defaultValue'] = props[o];
          } else if (typeof props[o] === 'object') {
            if (target[o]['supportedValues'] != undefined) {
              this.initialPropertyValue(props[o], target[o]['supportedValues']);
            } else {
              target[o]['defaultValue'] = props[o];
            }
          }
        }
      }
    },

    hasPropertyInConstants: function(obj) {
      if (this.Constants.indexOf(obj) !== -1) {
        return true;
      }
      return false;
    },


    //viz chart configure override  properties, include name,supportedValueType,supportedValues, defaultValue,description,isExported,example
    buildPropertiesOverride: function(props, target) {
      for (var o in props) {
        if (props.hasOwnProperty(o)) {
          if (this.hasPropertyInConstants(o)) {
            target[o] = props[o];
          } else if (typeof props[o] === 'object' && !(props[o] instanceof Array)) {
            if (target.hasOwnProperty(o) === false) {
              target[o] = {};
            }
            this.overrideProperties(props[o], target[o]);
          }
        }
      }
    },

    overrideProperties: function(props, target) {
      for (var o in props) {
        if (props.hasOwnProperty(o)) {
          if (this.hasPropertyInConstants(o)) {
            target[o] = props[o];
          } else if (typeof props[o] === 'object' && !(props[o] instanceof Array)) {
            if (target['supportedValues'].hasOwnProperty(o) === false) {
              target['supportedValues'][o] = {};
            }
            this.buildPropertiesOverride(props[o], target['supportedValues'][o]);
          }
        }
      }
    }
  };

  /********************end of utility *******************/


  var Generator = {
    getParameter: function(key) {
      var url = decodeURI(window.location.href);
      var strParameter = url.substring(url.indexOf("?") + 1);
      if (strParameter.indexOf(key) == -1) {
        return null;
      }
      var substr = strParameter.substring(strParameter.indexOf(key));
      var start = key.length + substr.indexOf(key + "=") + 1;
      var end = substr.indexOf("&");
      return end != -1 ? substr.substring(start, end) : substr.substring(start);
    },

    isIE: function(data) {
      if (data.indexOf("MSIE") != -1) {
        return true;
      } else {
        return false;
      }
    },

    handleTextWithCodeTag: function(txt) {
      var CODE_TAG_BEGIN = '<code>';
      if (txt.indexOf(CODE_TAG_BEGIN) >= 0) {
        var txtArray = txt.split(CODE_TAG_BEGIN);
        return txtArray[0] + '<br/> <br/> <span>' + gen.beautifyCodaPara(txtArray[1]) + "</span>";
      }
      return txt;
    },

    beautifyCodaPara: function(txt) {
      return gen.formatToHTML(js_beautify(txt));
    },

    formatToHTML: function(txt) {
      return txt.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\n/g, '<br/>').replace(/  /g, '&nbsp;&nbsp;');
    },

    ScrollingSpeed: 500,

    returnTop: function() {
      $('body, html').animate({
        'scrollTop': 0
      }, this.scrollingSpeed);
    },

    //relocate page when click at the new property
    locate: function(property) {
      $("dl.method-content-selected").removeClass("method-content-selected").addClass("method-content");
      var mao = $("dl#" + property);
      mao.removeClass("method-content").addClass("method-content-selected");
      if (mao.length > 0) {
        var pos = mao.offset().top;
        var scrollTop = pos - $('.fixedContainer').height() - $("dl#" + property + " dt").height();

        if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
          // Exp: 1
          // $("body").animate({
          //   scrollTop: scrollTop
          // });

          // Exp: 2
          window.scrollBy(0, scrollTop);
        } else {
          $("html,body").animate({
            scrollTop: scrollTop
          });
        }
      }
    },

    createPropertyObj: function(obj, ancestorName, holder, exportedEnable) {
      if (obj === undefined || utility.isEmptyObj(obj))
        return;
      if (!exportedEnable || obj.isExported !== false) {
        var propDd = this.createMethodContent(holder, ancestorName + obj.name, obj.name);
        propDd.className = "propDd";
        //isExperimental
        if (obj.isExperimental === true) {
          var params = this.createParamsContent(propDd, '*Experimental*: ', 'This property is under evaluation. It has potential to be removed in the future. Use it at your own risk.');
          params.style.cssText = 'color:red';
        }
        //supportedValue
        this.createParamsContent(propDd, 'Supported Value Type: ', obj.supportedValueType);
        if (obj.supportedValues) {
          //append supported values
          var params = document.createElement('div');
          params.className = "params";
          propDd.appendChild(params);
          this.createParamsName(params, 'Supported Values: ');
          var paramsValue = document.createElement('span');
          paramsValue.className = "paramsValue";
          params.appendChild(paramsValue);
          var supportedValues = obj.supportedValues;
          if (obj.supportedValues instanceof Array) {
            paramsValue.innerText = obj.supportedValues.join(', ');
            paramsValue.textContent = obj.supportedValues.join(', ');
          } else {
            for (var i in supportedValues) {
              //Not need to export, pass it
              if (supportedValues.hasOwnProperty(i)) {
                if (utility.isEmptyObj(supportedValues[i]))
                  continue;
                if (!exportedEnable || supportedValues[i].isExported !== false) {
                  this.createAnchor(paramsValue, ancestorName + obj.name + '_' + supportedValues[i].name, supportedValues[i].name)
                }
              }
            }
          }
        }
        //default value
        if (obj.hasOwnProperty('defaultValue')) {

          if (obj.supportedValueType === 'StringArray') {
            this.createParamsContent(propDd, 'Default value: ', this.arrayToString(obj.defaultValue));
          } else if (obj.defaultValue === Number.POSITIVE_INFINITY) {
            this.createParamsContent(propDd, 'Default value: ', 'Number.POSITIVE_INFINITY');
          } else {
            this.createParamsContent(propDd, 'Default value: ', JSON.stringify(obj.defaultValue));
          }
        }
        //description
        this.createParamsContent(propDd, 'Description: ', obj.description);
        //example
        if (obj.hasOwnProperty("example")) {
          if( this.chartType.indexOf('info/') === 0){
            return;
          }
          var params = document.createElement('div');
          params.className = "example";
          propDd.appendChild(params);
          this.createParamsName(params, 'Example: ');
          var demo = document.createElement('div');
          demo.className = "demo";
          params.appendChild(demo);
          this.createParamsName(demo, 'Live Demo: ');
          var paramsValue = document.createElement('span');
          paramsValue.className = "paramsValue";
          paramsValue.innerHTML = obj.example;
          demo.appendChild(paramsValue);
        }
        //updatable
        if (obj.updatable === false) {
          this.createParamsContent(propDd, 'Updatable: ', obj.updatable + ', means it cannot be updated after creation.');
        }
        if (!(obj.supportedValues instanceof Array) && obj.supportedValues != undefined) {
          if (ancestorName != '')
            ancestorName = ancestorName + obj.name + '_';
          else
            ancestorName = obj.name + '_';
          for (var t in obj.supportedValues) {
            this.createPropertyObj(obj.supportedValues[t], ancestorName, holder, exportedEnable);
          }
        }
      }
    },

    createChartDetail: function(chartType) {
      //set default chart
      if (chartType == undefined) {
        chartType = 'viz/donut';
      }
      this.chartType = chartType;
      var chartObj;
      if (Manifest && Manifest.viz) {
        Manifest.viz.each(function(obj) {
          if (!obj.abstract) {
            if (window.isForRelease) {
              if (obj.isExported !== false) {
                if (obj.id === chartType) {
                  chartObj = obj;
                }
              }
            } else {
              if (obj.id === chartType) {
                chartObj = obj;
              }
            }
          }
        });
      }
      if (chartObj === undefined) return;
      //get chart all properties
      var chart = this.getChartInfo(chartObj);
      var chartName = chart.name + "(ID " + chart.id + ")";
      var content = document.getElementById('main');
      content.innerHTML = "";
      var section = document.createElement("section");
      section.className = 'container-overall';
      content.appendChild(section);
      var header = document.createElement("header");
      var h2 = document.createElement("h2");
      h2.className = 'section-title';
      h2.innerText = chartName;
      h2.textContent = chartName;
      header.appendChild(h2);
      section.appendChild(header);
      var article = document.createElement("article");
      section.appendChild(article);
      var properties = chart.properties;
      window.properties = properties;
      var events = chart.events;
      window.events = events;
      var feeds = chart.feeds;
      window.feeds = feeds;

      var contentArticle = document.createElement("article");
      contentArticle.className = "newContent";
      contentArticle.id = "newContent";
      var properties = chart.properties;
      var events = chart.events;
      var bindings = chart.bindings;
      var scales = chart.scales;

      var fixedContainer = document.createElement("div");
      fixedContainer.className = "fixedContainer";
      fixedContainer.appendChild(header);
      fixedContainer.appendChild(article);
      section.appendChild(fixedContainer);
      section.appendChild(contentArticle);

      var modules = chart.modules
      var div = this.createContainer(article, 'summary-container');
      var detail = document.createElement('div');
      detail.className = 'method';
      div.appendChild(detail);
      var methodDl = document.createElement('dl');
      methodDl.className = 'method-content';
      detail.appendChild(methodDl);
      var moduleList = chart.moduleList;

      //create summary nav
      var nav = document.createElement('div');
      nav.className = 'nav-collapse';
      var ul = document.createElement('ul');
      nav.appendChild(ul);
      methodDl.appendChild(nav);
      nav = ul;
      var divv = document.createElement('div');
      divv.className = "descriptiondiv";
      methodDl.appendChild(divv);

      var i = 0;

      for (var o in chart) {
        if (chart.hasOwnProperty(o) && o != 'moduleList') {
          if ('css' === o) {
            continue;
          }
          if (o === "name") continue;

          //append content to nav
          var li = document.createElement('li');
          nav.appendChild(li);
          var linkA = document.createElement('a');
          li.className = "li_" + o;
          li.appendChild(linkA);
          if (o === "id") {
            linkA.textContent = "description";
            linkA.innerText = "description";
          }
          else{
            linkA.innerText = o;
            linkA.textContent = o;
          }
          linkA.id = "linktarget" + i;
          selections[i++] = linkA;
        }
      }

      this.createPropertiesDetail(properties, contentArticle, true);
    },

    createTitle: function(element, tag) {
      var h = document.createElement(tag);
      if (tag === 'h1') {
        var span = document.createElement("span");
        h.className = 'classTitle';
        span.innerText = element;
        span.textContent = element;
        h.appendChild(span);
      } else if (tag === 'h2') {
        h.innerText = element;
        h.textContent = element;
        h.className = 'subTitle';
      } else {
        h.innerText = element;
        h.textContent = element;
        //h.className = 'subTitle';
      }
      return h;
    },

    //put the attribute in the obj into array and order array
    orderObject: function(obj) {
      var array = [];
      for (var o in obj) {
        array.push({
          name: o,
          value: obj[o]
        })
      }
      array.sort(function(a, b) {
        if (typeof a.name !== 'string') {
          return 1;
        }
        if (typeof b.name !== 'string') {
          return -1;
        }
        return a.name.localeCompare(b.name);
      });
      return array;
    },

    getChartModuleList: function(modules, list) {
      if (typeof modules === 'object') {
        for (var m in modules) {
          if (modules.hasOwnProperty(m)) {
            if (!modules[m])
              continue;
            if (m !== 'dependencies' && m !== 'events') {
              if (!modules[m].hasOwnProperty('modules')) {
                var o = {};
                o.key = m;
                o.id = modules[m].id;
                o.dataFromFeeds = modules[m].feeds;
                o.configure = modules[m].configure;
                list.push(o);
              } else {
                var o = {};
                o.key = m;
                o.id = modules[m].id;
                o.configure = modules[m].configure;
                var childModuleList = [];
                this.getChartModuleList(modules[m].modules, childModuleList);
                o.modules = childModuleList;
                var childControllersList = [];
                this.getChartModuleList(modules[m].controllers, childControllersList);
                o.controllers = childControllersList;
                list.push(o);
              }
            }
          }
        }
      }
    },

    getChartInfo: function(chartObj) {
      var o = {};
      var list = [];
      o.id = chartObj.id;
      o.name = chartObj.name;
      this.getChartModuleList(chartObj.modules, list);
      o.moduleList = list;
      o.properties = {};
      this.getChartProperties(list, o.properties);
      this.filterProperties(o.properties);
      o.events = {};
      this.getChartEvents(list, o.events);
      o.feeds = [];
      o.feeds = Manifest && Manifest.viz.get(chartObj.id).allFeeds();
      o.css = {};
      this.getChartCss(list, o.css);

      return o;
    },

    filterProperties: function(properties) {
      for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
          var obj = properties[property];
          if (obj !== undefined && obj !== null) {
            if (obj.supportedValueType === 'Object') {
              this.filterProperties(obj.supportedValues);
              if (utility.isEmptyObj(obj.supportedValues)) {
                delete properties[property];
              }
            } else {
              if (obj.isExported === false && !obj.uncheck) {
                delete properties[property];
              }
            }
          }
        }
      }
    },

    //Build the Feed detail in the detail properties
    createFeedObj: function(feed, holder) {
      if (feed === undefined || utility.isEmptyObj(feed))
        return;
      var feedsDd = this.createMethodContent(holder, feed.id, feed.name);
      var feedArray = this.orderObject(feed);
      for (var i = 0; i < feedArray.length; i++) {
        var name = feedArray[i].name;
        var value = feedArray[i].value;
        if (name !== 'members') {
          this.createParamsContent(feedsDd, name + ': ', value);
        } else if (value.hasOwnProperty('length') && value.length > 0) {
          var params = document.createElement('div');
          params.className = "params";
          feedsDd.appendChild(params);
          this.createParamsName(params, name + ': ');
          var paramsValue = document.createElement('span');
          paramsValue.className = "paramsValue";
          params.appendChild(paramsValue);
          for (var i = 0, length = value.length; i < length; i++) {
            this.createAnchor(paramsValue, value[i].id, value[i].id);
            this.createFeedObj(value[i], holder);
          }
        }

      }

    },

    //Build the css hierarchy in the summary
    buildCSSHierarchy: function(moduleList, holder, chartClass) {
      if (moduleList === undefined)
        return;

      for (var i = 0, length = moduleList.length; i < length; i++) {
        // get css from modules
        var div = document.createElement('div');
        div.className = 'lv';
        var module = moduleList[i];
        if (module !== undefined) {
          var m = Manifest && Manifest.module.get(moduleList[i].id);
          if (module.key !== 'tooltip' && m.hasOwnProperty('css') || module.key == 'root') {
            var pModule = document.createElement('div');
            if (module.key == 'dataLabel') {
              pModule.innerText = 'v-m-' + 'datalabel';
              pModule.textContent = 'v-m-' + 'datalabel';
            } else {
              pModule.innerText = 'v-m-' + module.key;
              pModule.textContent = 'v-m-' + module.key;
            }
            div.appendChild(pModule);
            var props = m.css;
            for (var p in props) {
              if (props.hasOwnProperty(p) && !(module.key == 'sizeLegend' && p.indexOf('hovershadow') != -1)) {
                if (m.name == 'axis') {
                  if (module.configure.properties.type !== "category" && p.indexOf('hovershadow') != -1) {
                    continue;
                  }
                  if (chartClass.indexOf('mekko') != -1 && module.key.indexOf('Axis2') != -1 && p.indexOf('hovershadow') != -1) {
                    continue;
                  }
                }
                var div2 = document.createElement('div');
                div2.className = 'lv';
                var id = this.getCssName(p);
                if (p.indexOf('viz-plot-background') != -1 || p.indexOf('viz-pie') != -1 || p.indexOf('viz') == -1) {
                  p = p.split('.')[1];
                } else {
                  p = p.split('.')[2];
                }
                this.createAnchor(div2, id, p);
                div.appendChild(div2);
              }
            }
          }
        }
        if (moduleList[i].modules !== undefined) {
          this.buildCSSHierarchy(moduleList[i].modules, div, chartClass);
        }
        holder.appendChild(div);
      }
    },

    buildCSSHierarchyForTooltip: function(m, holder) {
      if (m === undefined)
        return;
      var div = document.createElement('div');
      div.className = 'lv';
      var pModule = document.createElement('div');
      pModule.innerText = 'v-m-' + m.name;
      pModule.textContent = 'v-m-' + m.name;
      div.appendChild(pModule);
      if (m.hasOwnProperty('css')) {
        var props = m.css;
        for (var p in props) {
          if (props.hasOwnProperty(p)) {
            var div2 = document.createElement('div');
            div2.className = 'lv';
            var id = this.getCssName(p);
            //Use the new class name
            if (p.indexOf('viz') == -1) {
              p = p.split('.')[1];
            } else {
              p = p.split('.')[2];
            }
            this.createAnchor(div2, id, p);
            div.appendChild(div2);
          }
        }
      }
      holder.appendChild(div);
    },

    //Build the Event detail in the detail properties
    createEventsDetail: function(events, holder) {
      if (events === undefined || utility.isEmptyObj(events))
        return;

      // var divEvents = this.createContainer(holder, 'events-container');
      for (var o in events) {
        if (events.hasOwnProperty(o)) {
          var eventsDd = this.createMethodContent(holder, o, o);
          var p = document.createElement("span");
          p.className = "code-caption";
          p.innerHTML = gen.handleTextWithCodeTag(events[o]);
          eventsDd.appendChild(p);
        }
      }
    },

    createPropertiesDetail: function(properties, holder, exportedEnable) {
      //create properties
      if (properties === undefined || utility.isEmptyObj(properties))
        return;
      var divAnchor = this.createContainer($('.fixedContainer')[0], 'anchor-container');
      var divProp = this.createContainer(holder, 'properties-container');
      for (var o in properties) {
        if (o === 'rotate') continue;
        this.createAnchor(divAnchor, o, o)
        var text = document.createElement('span');
        text.className = 'separate';
        text.innerText = ' | ';
        text.textContent = ' | ';
        divAnchor.appendChild(text);
        if (properties.hasOwnProperty(o)) {
          this.createPropertyObj(properties[o], '', divProp, exportedEnable);
        }
      }
    },

    createFeedsDetail: function(feeds, holder) {
      //create feeds
      if (feeds === undefined || utility.isEmptyObj(feeds))
        return;
      var divAnchor = this.createContainer($('.fixedContainer')[0], 'anchor-container');
      var divFeeds = this.createContainer(holder, 'feed-container');
      for (var o in feeds) {
        if (!feeds.hasOwnProperty(o))
          continue;
        this.createAnchor(divAnchor, feeds[o].id, feeds[o].id);
        var text = document.createElement('span');
        text.className = 'separate';
        text.innerText = ' | ';
        text.textContent = ' | ';
        divAnchor.appendChild(text);
        this.createFeedObj(feeds[o], divFeeds);
      }
    },

    //Build the css detail in the detail properties
    createCssObj: function(obj, name, holder) {
      if (obj === undefined || utility.isEmptyObj(obj))
        return;

      var id = this.getCssName(name);
      if (name.indexOf('viz-plot-background') != -1 || name.indexOf('viz-pie') != -1 || name.indexOf('viz') == -1) {
        name = name.split('.')[1];
      } else {
        name = name.split('.')[2];
      }
      var cssDd = this.createMethodContent(holder, id, name);
      //Use the new class name only
      for (var o in obj) {
        if (obj.hasOwnProperty(o)) {
          if (typeof obj[o] === 'object') {
            var params = document.createElement('div');
            params.className = "params";
            cssDd.appendChild(params);
            this.createParamsName(params, o + ': ');
            var values = document.createElement('div');
            values.className = "values";
            params.appendChild(values);
            var cssArray = this.orderObject(obj[o]);
            for (var i = 0; i < cssArray.length; i++) {
              this.createParamsContent(values, cssArray[i].name + ': ', cssArray[i].value);
            }
          } else if (o === 'example') {
            var params = document.createElement('div');
            params.className = "example";
            cssDd.appendChild(params);
            this.createParamsName(params, 'Example: ');
            var demo = document.createElement('div');
            demo.className = "demo";
            params.appendChild(demo);
            this.createParamsName(demo, 'Live Demo: ');
            var paramsValue = document.createElement('span');
            paramsValue.className = "paramsValue";
            demo.appendChild(paramsValue);
          } else {
            this.createParamsContent(cssDd, o + ': ', JSON.stringify(obj[o]));
          }

        }
      }
    },

    getCssName: function(name) {
      var array = name.split('.');
      var names = "";
      for (var i = 1; i < array.length; i++) {
        if (i != 1) {
          names = names + "_";
        }
        names = names + array[i];
      }
      return names;
    },

    createAnchor: function(holder, id, content) {
      var gen = this;
      var a = document.createElement('a');
      a.id = id;
      a.className = "navSecond-item";
      a.href = "";
      a.onclick = function() {
        gen.locate(this.id);
        return false;
      };
      a.innerText = content;
      a.textContent = content;
      holder.appendChild(a);
    },

    createContainer: function(holder, id, content) {
      var div = document.createElement('div');
      div.className = 'container';
      div.id = id;
      if (content) {
        var h3 = document.createElement('h3');
        h3.className = 'subsection-title';
        h3.innerText = content;
        h3.textContent = content;
        div.appendChild(h3);
      }
      holder.appendChild(div);
      return div;
    },

    createMethodContent: function(holder, id, content) {
      var idToDot = id.replace(/_/g, ".");
      var levels = document.createElement('div');
      levels.className = 'method';
      holder.appendChild(levels);
      var dl = document.createElement('dl');
      dl.className = 'method-content';
      dl.id = id;
      levels.appendChild(dl);
      var dt = document.createElement('dt');
      var h4 = document.createElement('h3');
      h4.className = 'name';
      h4.innerText = idToDot;
      h4.textContent = idToDot;
      dt.appendChild(h4);
      dl.appendChild(dt);
      var dd = document.createElement('dd');
      dl.appendChild(dd);
      return dd;
    },

    createParamsContent: function(holder, name, value) {
      var params = document.createElement('div');
      params.className = "params";
      var paramsName = document.createElement('span');
      paramsName.className = "paramsName";
      paramsName.innerText = name;
      paramsName.textContent = name;
      params.appendChild(paramsName);
      var paramsValue = document.createElement('span');
      paramsValue.className = "paramsValue";
      paramsValue.innerHTML = value;
      params.appendChild(paramsValue);
      holder.appendChild(params);
      return params;
    },

    createParamsName: function(holder, name) {
      var paramsName = document.createElement('span');
      paramsName.className = "paramsName";
      paramsName.innerText = name;
      paramsName.textContent = name;
      holder.appendChild(paramsName);
      return paramsName;
    },

    createParamsValue: function(holder, value) {
      var paramsValue = document.createElement('span');
      paramsValue.className = "paramsValue";
      paramsValue.innerText = value;
      paramsValue.textContent = value;
      holder.appendChild(paramsValue);
      return paramsValue;
    },

    arrayToString: function(array) {
      if (array === null) {
        return "null";
      }
      var string = "[";
      for (var i = 0; i < array.length; i++) {
        if (i != 0) {
          string = string + ", ";
        }
        string = string + "\"" + array[i] + "\"";
      }
      string = string + "]";
      return string;
    },

    getChartProperties: function(moduleList, prop) {
      if (moduleList === undefined)
        return;

      for (var i = 0, length = moduleList.length; i < length; i++) {
        if (moduleList[i].configure !== undefined) {
          var m = Manifest && Manifest.module.get(moduleList[i].id);
          var name = moduleList[i].configure && moduleList[i].configure.propertyCategory;
          var defaultValue = moduleList[i].configure && moduleList[i].configure.properties;
          var description;
          if (moduleList[i].configure && moduleList[i].configure.description) {
            description = moduleList[i].configure.description;
          } else {
            description = m.description ? m.description : '';
          }
          //get chart override properties
          var propertiesOverride = moduleList[i].configure && moduleList[i].configure.propertiesOverride;
          if (m !== undefined) {
            var props = m.properties;
            if (props !== undefined && !utility.isEmptyObj(props)) {
              prop[name] = {};
              prop[name].name = name;
              prop[name].description = description;
              prop[name].supportedValueType = 'Object';
              var copyProps = utility.deepCopy(props);
              utility.initialPropertyValue(defaultValue, copyProps);
              utility.buildPropertiesOverride(propertiesOverride, copyProps);
              prop[name].supportedValues = copyProps;
            }
          }
        }
        this.getChartProperties(moduleList[i].modules, prop);
        this.getChartProperties(moduleList[i].controllers, prop);
      }
    },

    getChartEvents: function(moduleList, evt) {
      if (moduleList === undefined)
        return;

      for (var i = 0, length = moduleList.length; i < length; i++) {
        if (moduleList[i].modules === undefined) {
          var m = Manifest && Manifest.module.get(moduleList[i].id);
          if (m !== undefined) {
            var props = m.events;
            for (var p in props) {
              if (props.hasOwnProperty(p)) {
                //o[m.name].supportedValues.push(props[p]);
                evt[p] = props[p];
              }
            }
          }
        } else {
          this.getChartEvents(moduleList[i].modules, evt);
        }

      }
    },

    getChartCss: function(moduleList, css) {
      if (moduleList === undefined)
        return;

      for (var i = 0, length = moduleList.length; i < length; i++) {
        // get css from modules
        var m = Manifest&&Manifest.module.get(moduleList[i].id);
        if (m !== undefined) {
          var props = m.css;
          for (var p in props) {
            if (props.hasOwnProperty(p)) {
              css[p] = props[p];
            }
          }
        }
        if (moduleList[i].modules !== undefined) {
          this.getChartCss(moduleList[i].modules, css);
        }

      }
    },

    //Build the Property detail in the detail properties
    createInfoChartPropertyObj: function(obj, ancestorName, holder, exportedEnable, propertyName) {
      if (obj === undefined || utility.isEmptyObj(obj))
        return;
      if (!exportedEnable || obj.isExported !== false) {
        var propDd = this.createMethodContent(holder, ancestorName + propertyName, propertyName);
        propDd.className = "propDd";
        //isExperimental
        if (obj.isExperimental === true) {
          var params = this.createParamsContent(propDd, '*Experimental*: ', 'This property is under evaluation. It has potential to be removed in the future. Use it at your own risk.');
          params.style.cssText = 'color:red';
        }
        //supportedValueType
        if (obj.supportedValueType !== undefined) {
          this.createParamsContent(propDd, 'Supported Value Type: ', obj.supportedValueType);
        }

        //supportedValues
        if (obj.supportedValues !== undefined) {
          this.createParamsContent(propDd, 'Supported Values: ', obj.supportedValues);
        }

        //readonly
        if (obj.hasOwnProperty('readonly')) {
          this.createParamsContent(propDd, 'Readonly: ', obj.readonly);
        } else {
          this.createParamsContent(propDd, 'Readonly: ', false);
        }

        //serializable
        if (obj.hasOwnProperty('serializable')) {
          this.createParamsContent(propDd, 'Serializable: ', obj.serializable);
        } else {
          this.createParamsContent(propDd, 'Serializable: ', true);
        }

        if (obj.children) {
          //append supported values
          var params = document.createElement('div');
          params.className = "params";
          propDd.appendChild(params);
          this.createParamsName(params, 'Supported Values: ');
          var paramsValue = document.createElement('span');
          paramsValue.className = "paramsValue";
          params.appendChild(paramsValue);
          var supportedValues = obj.children;
          if (obj.children instanceof Array) {
            paramsValue.innerText = obj.children.join(', ');
            paramsValue.textContent = obj.children.join(', ');
          } else {
            for (var i in supportedValues) {
              //Not need to export, pass it
              if (supportedValues.hasOwnProperty(i)) {
                if (utility.isEmptyObj(supportedValues[i]))
                  continue;
                if (!exportedEnable || supportedValues[i].isExported !== false) {
                  this.createAnchor(paramsValue, ancestorName + propertyName + '_' + i, i)
                }
              }
            }
          }
        }
        //default value
        if (obj.hasOwnProperty('defaultValue')) {

          if (obj.supportedValueType === 'StringArray') {
            this.createParamsContent(propDd, 'Default value: ', this.arrayToString(obj.defaultValue));
          } else if (obj.defaultValue === Number.POSITIVE_INFINITY) {
            this.createParamsContent(propDd, 'Default value: ', 'Number.POSITIVE_INFINITY');
          } else {
            this.createParamsContent(propDd, 'Default value: ', JSON.stringify(obj.defaultValue));
          }
        }
        //description
        //added by jinjin
        if (obj.description != undefined) {
          this.createParamsContent(propDd, 'Description: ', obj.description);
        }

        //example
        if (obj.hasOwnProperty("example") && obj.example != "") {
          var params = document.createElement('div');
          params.className = "example";
          propDd.appendChild(params);
          this.createParamsName(params, 'Example: ');
          var demo = document.createElement('div');
          demo.className = "demo";
          params.appendChild(demo);
          this.createParamsName(demo, 'Live Demo: ');
          var paramsValue = document.createElement('span');
          paramsValue.className = "paramsValue";
          paramsValue.innerHTML = obj.example;
          demo.appendChild(paramsValue);
        }
        //updatable
        if (obj.updatable === false) {
          this.createParamsContent(propDd, 'Updatable: ', obj.updatable + ', means it cannot be updated after creation.');
        }
        if (!(obj.children instanceof Array) && obj.children != undefined) {
          if (ancestorName != '')
            ancestorName = ancestorName + propertyName + '_';
          else
            ancestorName = propertyName + '_';
          for (var t in obj.children) {
            this.createInfoChartPropertyObj(obj.children[t], ancestorName, holder, exportedEnable, t);
          }
        }

      }
    },

    isPropObj: function(it) {
      return Object.prototype.toString.call(it) === '[object Object]' &&
        (it.hasOwnProperty('defaultValue') || it.hasOwnProperty('readonly') ||
          it.hasOwnProperty('serializable'));
    },

    setObject: function(name, value, root, isPropObject) {
      var parts = name.split('.');
      var p = root;
      for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];
        if (i < parts.length - 1 || !isPropObject) {
          p[part] = p[part] || {
            children: {}
          };
          p = p[part].children;
        } else {
          p[part] = value;
        }
      }
    },

    needHide: function(prop) {
      return prop.hasOwnProperty('access') && prop['access'] === 'internal';
    },

    buildPropertyTree: function(props) {
      var chartProps = {};
      for (var name in props) {
        var prop = props[name];
        if (this.needHide(prop)) {
          continue;
        }
        var isPropObject = this.isPropObj(prop);
        if (!isPropObject) {
          prop = {
            defaultValue: prop
          };
        }
        this.setObject(name, prop, chartProps, isPropObject);
      }
      return chartProps;
    },


    createInfoChartDetail: function(chartType, chartName) {
      //set default chart
      if (chartType == undefined) {
        chartType = 'info/donut';
      }
      this.chartType = chartType;
      var chart = {};
      var index = 0;
      chart.id = chartType;
      var getMetadata = sap && sap.viz && sap.viz.api && sap.viz.api.metadata &&
        sap.viz.api.metadata.Viz && sap.viz.api.metadata.Viz.get();
      for (index in getMetadata) {
        if (getMetadata.hasOwnProperty(index)) {
          //allChartTypeProperties[getMetadata[index].type] = getMetadata[index].properties;
          //allChartTypeBindings[getMetadata[index].type] = getMetadata[index].bindings;
          allChartTypeScales[getMetadata[index].type] = allChartTypeScales[getMetadata[index].type] || getMetadata[index].scales;
        }
      }
      chart.properties = this.buildPropertyTree(allChartTypeProperties[chartType]);
      chart.events = chartEvents[chartType] ? chartEvents[chartType] : chartEvents["all"];
      chart.bindings = allChartTypeBindings[chartType];
      chart.scales = allChartTypeScales[chartType.split('/')[1]];
      var parentIndex = parent._getIndexOfSelection();
      var keyString = "Charts/";
      parentIndex = parentIndex.substring(parentIndex.indexOf(keyString) + keyString.length);
      var parentEnd = parentIndex.indexOf(" ");
      parentIndex = parentIndex.substring(0, parentEnd);
      chart.name = parentIndex + " : " + chartType.charAt(5).toUpperCase() + chartType.substr(6) + " Chart";


      var chartName = chart.name + "(ID " + chart.id + ")";
      var content = document.getElementById('main');
      var section = document.createElement("section");
      section.className = 'container-overall';
      content.appendChild(section);
      var header = document.createElement("header");
      var h2 = document.createElement("h2");
      h2.className = 'section-title';
      h2.innerText = chartName;
      h2.textContent = chartName;
      header.appendChild(h2);
      var article = document.createElement("article");

      var contentArticle = document.createElement("article");
      contentArticle.className = "newContent";
      contentArticle.id = "newContent";
      var properties = chart.properties;
      var events = chart.events;
      var bindings = chart.bindings;
      var scales = chart.scales;

      var fixedContainer = document.createElement("div");
      fixedContainer.className = "fixedContainer";
      fixedContainer.appendChild(header);
      fixedContainer.appendChild(article);
      section.appendChild(fixedContainer);
      section.appendChild(contentArticle);


      var modules = chart.modules
      var div = this.createContainer(article, 'summary-container');
      var detail = document.createElement('div');
      detail.className = 'method';
      div.appendChild(detail);
      var methodDl = document.createElement('dl');
      methodDl.className = 'method-content';
      detail.appendChild(methodDl);
      var moduleList = chart.moduleList;
      //create summary nav
      var nav = document.createElement('nav');
      nav.className = 'nav-collapse';
      var ul = document.createElement('ul');
      nav.appendChild(ul);
      methodDl.appendChild(nav);
      nav = ul;
      var i = 0;

      for (var o in chart) {
        if (chart.hasOwnProperty(o) && o != 'moduleList') {
          if ('css' === o) {
            continue;
          }
          if (o === "name" || o==="id") continue;
          var li = document.createElement('li');
          li.className = "li_" + o;
          nav.appendChild(li);
          var linkA = document.createElement('a');
          li.appendChild(linkA);
          linkA.id = "linktarget" + i;
          if (o === "id") {
            linkA.textContent = "Description";
          } else {
            linkA.innerText = o.substring(0, 1).toUpperCase() +
              o.substring(1);
          }
          selections[i++] = linkA;


        }
      }

      this.createInfoChartPropertiesDetail(chart.properties, contentArticle, true);

    },

    createIdContentDetail: function(content) {
      // var content = document.getElementById('descriptiondiv');
      /* var p = document.createElement("p");
       var welcome = JSON.parse(overview);
       var welcome2 = JSON.parse(overviewContent);
       p.textContent = welcome.overview;
       content.appendChild(p);
       //read content from welcome2
       for(var i in welcome2){
          var littleTitle = document.createElement("h4");
          littleTitle.innerHTML = i + ":" + "<br/>";
          var paragraph = document.createElement("p");
          paragraph.innerHTML = welcome2[i] + "<br/>";
          content.appendChild(littleTitle);
          content.appendChild(paragraph);
       }*/
    },


    createEventsContentDetail: function(events, holder) {
      var divAnchor = this.createContainer($('.fixedContainer')[0], 'anchor-container');
      var divEvents = this.createContainer(holder, 'properties-container');
      for (var i in events) {
        if (events[i].isExported === false)
          continue;
        if (events[i].name === 'rotate')
          continue;
        this.createAnchor(divAnchor, i, i);

        var text = document.createElement('span');
        text.className = 'separate';
        text.innerText = ' | ';
        text.textContent = ' | ';
        divAnchor.appendChild(text);

      }
      this.createEventsDetail(events, divEvents);
    },


    createScaleObj: function(scale, holder) {
      if (scale === undefined || utility.isEmptyObj(scale))
        return;
      var scaleDd = this.createMethodContent(holder, "scales_" + scale.feed, scale.feed);
      //Use the new class name only
      var temp = scale;
      for (var o in temp) {
        if (temp.hasOwnProperty(o)) {
          if (typeof temp[o] === 'object') {
            if (o == "defaultValue") {
              this.createParamsContent(scaleDd, o + ': ', JSON.stringify(temp[o]));
              continue;
            }
            var scaleArray = this.orderObject(temp[o]);
            var params = document.createElement('div');
            params.className = "params";
            scaleDd.appendChild(params);
            this.createParamsName(params, o + ': ');
            var values = document.createElement('div');
            values.className = "values";
            params.appendChild(values);
            for (var i = 0; i < scaleArray.length; i++) {
              this.createParamsContent(values, scaleArray[i].name + ': ', JSON.stringify(scaleArray[i].value).replace(/\",/g, '", '));
            }
          } else {
            this.createParamsContent(scaleDd, o + ': ', JSON.stringify(temp[o]).replace(/\",/g, '", '));
          }

        }
      }

    },

    createInfoChartPropertiesDetail: function(properties, holder, exportedEnable) {
      //create properties
      if (properties === undefined || utility.isEmptyObj(properties))
        return;
      var divAnchor = this.createContainer($('.fixedContainer')[0], 'anchor-container');
      var divProp = this.createContainer(holder, 'properties-container');
      for (var o in properties) {
        if (o === 'rotate') continue;
        this.createAnchor(divAnchor, o, o)
        var text = document.createElement('span');
        text.className = 'separate';
        text.innerText = ' | ';
        text.textContent = ' | ';
        divAnchor.appendChild(text);
        if (properties.hasOwnProperty(o)) {
          this.createInfoChartPropertyObj(properties[o], '', divProp, exportedEnable, o);
        }
      }
    },

    createBindingsDetail: function(bindings, holder) {
      //create bindings
      if (bindings === undefined || utility.isEmptyObj(bindings))
        return;
      var divAnchor = this.createContainer($('.fixedContainer')[0], 'anchor-container');
      var divBindings = this.createContainer(holder, 'properties-container');
      for (var o in bindings) {
        if (o === 'rotate') continue;
        this.createAnchor(divAnchor, "bindings_" + bindings[o].id, bindings[o].id)
        var text = document.createElement('span');
        text.className = 'separate';
        text.innerText = ' | ';
        text.textContent = ' | ';
        divAnchor.appendChild(text);
        if (!bindings.hasOwnProperty(o))
          continue;
        this.createInfoChartFeedObj(bindings[o], divBindings);
      }
    },

    createScalesDetail: function(scales, holder) {
      //create scales
      if (scales === undefined || utility.isEmptyObj(scales))
        return;
      var divAnchor = this.createContainer($('.fixedContainer')[0], 'anchor-container');
      var divScales = this.createContainer(holder, 'properties-container');
      for (var o in scales) {
        if (o === 'rotate') continue;
        this.createAnchor(divAnchor, "scales_" + scales[o].feed, scales[o].feed)
        var text = document.createElement('span');
        text.className = 'separate';
        text.innerText = ' | ';
        text.textContent = ' | ';
        divAnchor.appendChild(text);
        if (!scales.hasOwnProperty(o))
          continue;
        this.createScaleObj(scales[o], divScales);
      }
    },

    createInfoChartFeedObj: function(feed, holder) {
      if (feed === undefined || utility.isEmptyObj(feed))
        return;
      var feedsDd = this.createMethodContent(holder, "bindings_" + feed.id, feed.id);
      var feedArray = this.orderObject(feed);
      for (var i = 0; i < feedArray.length; i++) {
        var name = feedArray[i].name;
        var value = feedArray[i].value;
        if (name !== 'members') {
          this.createParamsContent(feedsDd, name + ': ', value);
        } else if (value.hasOwnProperty('length') && value.length > 0) {
          var params = document.createElement('div');
          params.className = "params";
          feedsDd.appendChild(params);
          this.createParamsName(params, name + ': ');
          var paramsValue = document.createElement('span');
          paramsValue.className = "paramsValue";
          params.appendChild(paramsValue);
          for (var i = 0, length = value.length; i < length; i++) {
            this.createAnchor(paramsValue, value[i].id, value[i].id);
            this.createInfoChartFeedObj(value[i], holder);
          }
        }

      }

    },

    createToTopIcon: function(){
      var returntoTop = document.createElement("div");
      returntoTop.className = "returnICon";
      var returnICon = document.createElement("img");
      returnICon.src = "../../resources/img/to_top.svg";
      returntoTop.appendChild(returnICon);
      $('body').append(returntoTop);
      $('.returnICon').click(function(event) {
        gen.returnTop();
      });
    },

    tabPageSetting: function(){
      $('.li_properties a').addClass('link-clicked');
      $(".fixedContainer").addClass('fixedContainer-border-normal');

      //tab page selections
      for (var ii = 0; ii <= selections.length; ii++) {
        $("#linktarget" + ii).click(function(e) {
          /*for (var j = 0; j <= selections.length; j++) {
            $("#linktarget" + j).addClass('link-not-clicked');
          }*/
          var content = e.target.innerHTML;
          if (chartid.indexOf("info") >= 0) {
            if ($("#anchor-container")[0]) {
              if (gen.isIE(navigator.userAgent)) {
                $("#anchor-container")[0].removeNode(true);
              } else {
                $("#anchor-container").remove();
              }
            }
            if ($("#properties-container")[0]) {
              if (gen.isIE(navigator.userAgent)) {
                $("#properties-container")[0].removeNode(true);
              } else {
                $("#properties-container").remove();
              }

            }
            var article = $(".newContent")[0];
            article.innerHTML = '';
            var fixedContainer = $(".fixedContainer")[0];
            if (content == "Properties") {
              gen.createInfoChartPropertiesDetail(gen.buildPropertyTree(allChartTypeProperties[chartid]), article, true);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[0]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[0]).parent().siblings().children().addClass('link-not-clicked');
            // } else if (content == "Description") {
            //   gen.createIdContentDetail(article);
            //   $(".fixedContainer").addClass('fixedContainer-border-normal');
            //   $(selections[0]).removeClass('link-not-clicked').addClass('link-clicked');
            //   $(selections[0]).parent().siblings().children().addClass('link-not-clicked');
            } else if (content == "Scales") {
              gen.createScalesDetail(allChartTypeScales[chartid.split('/')[1]], article);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[3]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[3]).parent().siblings().children().addClass('link-not-clicked');
            } else if (content == "Events") {
              gen.createEventsContentDetail(chartEvents[chartid] ? chartEvents[chartid] : chartEvents["all"], article);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[1]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[1]).parent().siblings().children().addClass('link-not-clicked');
            } else if (content == "Bindings") {
              gen.createBindingsDetail(allChartTypeBindings[chartid], article);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[2]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[2]).parent().siblings().children().addClass('link-not-clicked');
            }

          } else {
            if ($("#anchor-container")[0]) {
              if (gen.isIE(navigator.userAgent)) {
                $("#anchor-container")[0].removeNode(true);
              } else {
                $("#anchor-container").remove();
              }
            }
            if ($("#properties-container")[0]) {
              if (gen.isIE(navigator.userAgent)) {
                $("#properties-container")[0].removeNode(true);
              } else {
                $("#properties-container").remove();
              }

            }
            var article = $(".newContent")[0];
            article.innerHTML = '';
            var fixedContainer = $(".fixedContainer")[0];
            if (content == "properties") {
              gen.createPropertiesDetail(window.properties, article, true);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[1]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[1]).parent().siblings().children().addClass('link-not-clicked');
            } else if (content == "description") {
              gen.createIdContentDetail(article);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[0]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[0]).parent().siblings().children().addClass('link-not-clicked');
            } else if (content == "feeds") {
              gen.createFeedsDetail(window.feeds, article);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[3]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[3]).parent().siblings().children().addClass('link-not-clicked');
            } else if (content == "events") {
              gen.createEventsContentDetail(window.events, article);
              $(".fixedContainer").addClass('fixedContainer-border-normal');
              $(selections[2]).removeClass('link-not-clicked').addClass('link-clicked');
              $(selections[2]).parent().siblings().children().addClass('link-not-clicked');
            }
          }
        });
      }

    }

  };


  //  var overview = '{"overview":"Welcome to Emprise CVOM Charts. Constructed entirely in JavaScript the days of annoying plugin downloads and browser security warnings are gone. With genuine ease of use and complete customization Emprise CVOM Charts provides you with the tools you need to publish your data quickly and in a variety of formats. With its wide range of interactive features, simple and straightforward implementation, and unparalleled functionality, Emprise CVOM Charts is the clear first choice for all your charting needs. Here\'s a quick sampling of just some of the features included:"}'
  //  var overviewContent = '{"Interactive":"Features such as Hints, Mouse Tracking, Mouse Events, Key Tracking and Events, Zooming, Scrolling, and Crosshairs raise interactivity and user experience in web charting to a new level.", "Axis Scaling":"There\'s no need to determine your data range before hand. CVOM Charts will calculate and scale automatically to fit whatever data it is presented with.", "Auto Zooming, Scrolling": "Too much data and not enough screen real estate? Show it all. Let your end users zoom in on the pieces they\'re most interested in. Axis locking for single axis zoom, scrolling and automatic axis scaling are all included.", "Stackable Series": "Multiple chart series can be stacked and combined to fit many charting needs.", "Multiple Series Types": "Line, Area, Scatter, Pie, Bar and Function series are just the beginning. New series are just a few lines of JavaScript code", "Compatible": "Built with compatibility in mind and tested on all major browsers, you can be assured your charts will function consistently for the broadest range of end users. See the full list of compatible browsers on our System Requirements page.", "Customizable": "Every aspect of the charting display can be configured and customized through well-documented properties and methods. Want to do more than just change the color of the background? Need a series type which doesn\'t already exist? CVOM Charts is fully customizable and extendable to provide the greatest flexibility and integration for existing site designs and needs."}'
  var gen = Generator;
  var chartid = gen.getParameter("chartid");
  // chartid = "info/donut";
  var selections = new Array();
  if (chartid.indexOf("info") >= 0) {
    gen.createInfoChartDetail(chartid);
  } else {
    gen.createChartDetail(chartid);
  }

  gen.tabPageSetting();
  gen.createToTopIcon();
});
