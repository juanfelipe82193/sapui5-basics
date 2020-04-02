 
    var deleteDefaultJSData=['sap-ui-bootstrap','beautify', 'mode','codemirror','codeView','json2'];
    var deleteDefaultCSSData=['codemirror.css','vibrant-ink.css','no-highlight.css','codeView.css'];
    var deleteDefaultElement=['HTML view','JS view'];
    function getHtmlCode(fileName,textArea,code,delJSData,delCssData,delElement)
    {
        var jscode="<script type=\"text/javascript\">"+"\n"+addSpace(js_beautify(code));
        jscode=jscode+"\n"+"</script>\n";
        $.get(fileName, function(data) {
        $("#code-content").empty();
        $('#code').empty();
        var replaceData=deleteCode(data,delJSData,delCssData,delElement);
        replaceData=replaceData.replace("<script type=\"text/javascript\"></script>",jscode);
        var codeEditor = CodeMirror(textArea, {
            value: replaceData,
            lineNumbers: true,
            lineWrapping:true,
            fixedGutter:true,
            width: "100%",
            height: "100%",
            readOnly: true
        });
        }, "text");
    }
    function deleteCode(data,delJSData,delCssData,delElement){
       var deleteJSData=[];
       var deleteCSSData=[];
       var delElements=[];
       if(delJSData!=undefined)
       {
          deleteJSData=deleteDefaultJSData.concat(delJSData);
       }
       else{
        deleteJSData=deleteDefaultJSData;
       }
       if(delCssData!=undefined)
       {
          deleteCSSData=deleteDefaultCSSData.concat(delCssData);
       }else
       {
        deleteCSSData=deleteDefaultCSSData;
       }
       if(delElement!=undefined)
       {
         delElements=deleteDefaultElement.concat(delElement);
       }
       else
       {
         delElements=deleteDefaultElement;
       }
       var dataArray=data.split(">");
       var replaceData="";
       for(var i=0;i<dataArray.length;)
       {
            var tempStr=dataArray[i];
            if(tempStr.indexOf("<script")!=-1)
            {
              var found=true;
              for(var j=0;j<deleteJSData.length&&found;j++)
              {
                    if(tempStr.indexOf(deleteJSData[j])!=-1)
                     {
                        i=i+2;
                        found=false;
                     }
              }
              if(found)
              {
                replaceData=replaceData+tempStr+">";
                i++;
              }
            } else if(tempStr.indexOf("<link")!=-1)
                {
                  var found=true;
                  for(var j=0;j<deleteCSSData.length&&found;j++)
                  {
                        if(tempStr.indexOf(deleteCSSData[j])!=-1)
                         {
                            i++;
                            found=false;
                         }
                  }
                  if(found)
                  {
                    replaceData=replaceData+tempStr+">";
                    i++;
                  }
                } 
              else if(tempStr.indexOf("</html")!=-1)
              {
                replaceData=replaceData+tempStr;
                i++;
              }
              else 
              {
                   var found=true;
                    for(var j=0;j<delElements.length&&found;j++)
                    {
                          if(tempStr.indexOf(delElements[j])!=-1)
                           {
                              i=i+2;
                              found=false;
                           }
                    }
                    if(found)
                    {
                      replaceData=replaceData+tempStr+">";
                      i++;
                    }
              }
       }
       return replaceData;
    }
    function addSpace(codes){
      var lines =[];
      var newcode="        ";
      lines= codes.split("\n");
      for( var i=0;i<lines.length;i++){
         var tempStr=lines[i];
         if(tempStr.indexOf("sap.viz.api.env.Template.loadPaths")!=-1)
         {
           var tempArry=tempStr.split(",");
           for(var j=0;j<tempArry.length;j++)
           {
              if(j==0)
              {
                newcode=newcode+tempArry[j]+","+"\n" + "        ";
              }
              else
              {
                newcode=newcode+tempArry[j]+"\n" + "        ";
              }
           }
         }
         else
         {
          newcode=newcode+tempStr+"\n" + "        ";
         }
      }
      return newcode;

    }
    function addExtensionSpace(codes)
    {
      var lines =[];
      var newcode="        ";
      lines= codes.split("\n");
      for( var i=0;i<lines.length;i++){
         var tempStr=lines[i];
         newcode=newcode+tempStr+"\n" + "        ";
      }
      return newcode;
    }
    function getJsCode(textArea,jsCode)
    {
        $("#code-content").empty();
        $('#code').empty();
        var lines=js_beautify(jsCode).split("\n");
        var replaceData="";
        for(var i=0;i<lines.length;i++)
        {
           var tempStr=lines[i];
           if(tempStr.indexOf("sap.viz.api.env.Template.loadPaths")!=-1)
           {
             var tempArry=tempStr.split(",");
             for(var j=0;j<tempArry.length;j++)
             {
                if(j==0)
                {
                  replaceData=replaceData+tempArry[j]+","+"\n" ;
                }
                else
                {
                  replaceData=replaceData+tempArry[j]+"\n";
                }
             }
           }
           else
           {
             replaceData=replaceData+tempStr+"\n";
           }
        }
       var codeEditor = CodeMirror(textArea, {
            value: replaceData,
            lineNumbers: true,
             lineWrapping:true,
            fixedGutter:true,
            width: "100%",
            lineWrapping:true,
            height: "100%",
            readOnly: true
        });
    }
    function getJsCodeByUrl(fileName,textArea)
    {
       $.get(fileName, function(data) {
        var codeEditor = CodeMirror(textArea, {
            value: data,
            lineNumbers: true,
            lineWrapping:true,
            fixedGutter:true,
            width: "100%",
            height: "100%",
            readOnly: true
        });
        }, "text");
    }
     function toggleView(fileName,textArea,code,delJSData,delCssData,delElement){
       $('#htmlView').addClass("active");
       $('#jsView').removeClass("active");
      $("#code-content").empty();
       getHtmlCode(fileName,textArea,code,delJSData,delCssData,delElement);
       $('#htmlView').click(function(){
             $("#code-content").empty();
            $(this).addClass("active");
            $('#jsView').removeClass("active");
            getHtmlCode("index.html",textArea,code,delJSData,delCssData,delElement);
       });
      $('#jsView').click(function(){
           $("#code-content").empty();
          $(this).addClass("active");
          $("#htmlView").removeClass("active");
          getJsCode(textArea,code);
      });
   }
  function getExtensionHtmlCode(jsFileName,htmlFileName,textArea,delJSData,delCssData,delElement)
    {
       var jsData="<script type=\"text/javascript\">"+"\n";
       $("#code-content").empty();

       if($("#code")!=null){
          $("#code").empty();
       }
       else if($("#code-content")!=null){
          $("#code-content").empty();
       }
       
       $(document).load(jsFileName,function(res){
           jsData=jsData+addExtensionSpace(res);
           jsData=jsData+"\n</script>\n";

           $.get(htmlFileName, function(data) {
              var replaceData=deleteCode(data,delJSData,delCssData,delElement); 
              replaceData=replaceData.replace("<script type=\"text/javascript\"></script>",jsData);
              var codeEditor = CodeMirror(textArea, {
                  value: replaceData,
                  lineNumbers: true,
                  lineWrapping:true,
                  fixedGutter:true,
                  width: "100%",
                  height: "100%",
                  readOnly: true
              });
            }, "text");
        });
    }

    function getExtensionJSCode(jsFileName,textArea)
    {
        $("#code-content").empty();
        $.get(jsFileName, function(data) {
        var codeEditor = CodeMirror(textArea, {
            value: data,
            lineNumbers: true,
            lineWrapping:true,
            fixedGutter:true,
            width: "100%",
            height: "100%",
            readOnly: true
        });
        }, "text");
    }
   function toggleViewExtension(htmlFileName,jsFileName,textArea,delJSData,delCssData,delElement)
   {
      $('#htmlView').addClass("active");
       $('#jsView').removeClass("active");
      getExtensionHtmlCode(jsFileName,htmlFileName,textArea,delJSData,delCssData,delElement);
       $('#htmlView').click(function(){
            $(this).addClass("active");
            $('#jsView').removeClass("active");
            $("#code-content").empty();
            getExtensionHtmlCode(jsFileName,htmlFileName,textArea,delJSData,delCssData,delElement);
       });
      $('#jsView').click(function(){
          $(this).addClass("active");
          $("#htmlView").removeClass("active");
          $("#code-content").empty();
          getExtensionJSCode(jsFileName,textArea);
      });
   }
    