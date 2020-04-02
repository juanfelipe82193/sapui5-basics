
  var MyTooltip =  (function() {
      function isExist(o) {
      if ((typeof (o) === 'undefined') || (o === null)) {
        return false;
      }
      return true;
    }
 
  

    

    
    function tooltip(selection) {
        if (selection !== null && selection !== undefined) {
            //[10/9/2013 Joe]when render tooltip, we would not render the tooltip again if the svg exists
            vis = selection;
        }
        // In first view, we should make tooltip invisible.
        //tooltip.hideTooltip();
        return tooltip;
    }

  
        
   

    tooltip.showTooltip = function (eventData, bCustom) {
      
      if(!bCustom){
        return;
      }
      var hoverline = document.getElementById("hoverline");
      if(hoverline){
        hoverline.style.display = "block";
        hoverline.style.left = ""+ eventData.hoverline.startx + "px";
        hoverline.style.top = "" + eventData.hoverline.starty + "px";
        hoverline.style.width = (eventData.hoverline.endx - eventData.hoverline.startx > 1 ? eventData.hoverline.endx - eventData.hoverline.startx : 1)+"px";
        hoverline.style.height = (eventData.hoverline.endy - eventData.hoverline.starty > 1 ? eventData.hoverline.endy - eventData.hoverline.starty : 1)+"px";
        hoverline.style.background = "#888888";
      }
      if(vis){
        var myNode = document.getElementById("body");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
      }
       
      myNode = document.getElementById("footer");
      while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild);
      }
      vis.style.display = "block";
      vis.style.left = ""+(eventData.position.x + 10)+"px";
      vis.style.top = ""+eventData.position.y+"px";
      vis.setAttribute('visibility', 'hidden');

      data = eventData.data;
      var body = document.getElementById("body");
      var len = data.body.length;
      var i, j;
      for( i = 0; i < len; i++){
        var groupItem = document.createElement("div");
        groupItem.setAttribute("class", "group_" + i);
        var groupData = data.body[i];
        groupItem.innerText = groupData.name;
       // groupItem.appendChild(document.createTextNode(groupData.name+":"));
        var itemLength = groupData.val.length;
        var table = document.createElement("table");

        for(j = 0; j < itemLength; ++j){
          var tr = document.createElement("tr");
          
          var item = document.createElement("td");
          var circle = document.createElement("div");
          circle.setAttribute("class", "circle");
          circle.style.float = "left";  
          circle.style.background = groupData.val[j].color;
          item.appendChild(circle);
          tr.appendChild(item);
          
          item = document.createElement("td")

          item.innerText = ""+ groupData.val[j].value;
          tr.appendChild(item);
          table.appendChild(tr);
          
        }
        groupItem.appendChild(table);
        body.appendChild(groupItem);
      }
      
      var footer = document.getElementById("footer");
      var footerData = eventData.data.footer;
      if(footerData && footerData.length > 0){
        var table = document.createElement("table");
        var length = footerData.length;
        for(i = 0; i < length; i++){
          var tr = document.createElement("tr");
          item = document.createElement("td")

          item.innerText = ""+ footerData[i].label.val;
          tr.appendChild(item);
          
          item = document.createElement("td")

          item.innerText = ""+ footerData[i].value.val;
          tr.appendChild(item);
          table.appendChild(tr);

        }
        footer.appendChild(table);
      }
      
        
      
     
        vis.setAttribute('visibility', 'visible');
      
    };  
    
    tooltip.hideTooltip = function () {
     
      if(vis){
        var myNode = document.getElementById("body");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
      }
       
      myNode = document.getElementById("footer");
      while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild);
      }
      vis.style.display = "none";
      var hoverline = document.getElementById("hoverline");
      hoverline.style.display = "none";
    };
    
    function calculateSymbolSize(data) {
      if (data.labels) {
        _symbol.symbolSize = getTextBox(vis, data.labels[0].label, _display.multipleMeasure.label.font).height;
      }
    }
    

        
    tooltip.destroy = function() {
      if(vis){
        var myNode = document.getElementById("body");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
      }
       
      myNode = document.getElementById("footer");
      while (myNode.firstChild) {
          myNode.removeChild(myNode.firstChild);
      }
      //destroy ctx
 
    };
    

    return tooltip;
  })();

