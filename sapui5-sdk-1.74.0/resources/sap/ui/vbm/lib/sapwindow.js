
VBI.Windows=function(){"use strict";var w={};w.vbiclass="Windows";w.m_WindowArray=[];w.find=function(n){for(var a=0,l=w.m_WindowArray.length;a<l;++a){if(w.m_WindowArray[a].m_ID==n){return w.m_WindowArray[a];}}return null;};w.clear=function(){for(var n=0;n<w.m_WindowArray.length;++n){w.m_WindowArray[n].clear();}w.m_WindowArray=[];};w.create=function(d,c){var a=null;switch(d.type){case'callout':a=new VBI.CalloutWindow();break;case'legend':a=new VBI.LegendWindow();break;default:a=new VBI.Window();break;}if(a){a.load(d,c);}return a;};w.load=function(d,c){var a,n,l;if(d.Remove){if(jQuery.type(d.Remove)=='object'){if(d.Remove.name){w.Remove(d.Remove.name);}}else if(jQuery.type(d.Remove)=='array'){for(n=0,l=d.Remove.length;n<l;++n){if(d.Remove[n].name){w.Remove(d.Remove[n].name);}}}}if(d.Set){var b;if(jQuery.type(d.Set)=='object'){if(d.Set.name){b=w.find(d.Set.name);if(b){b.load(d.Set.Window,c);return;}else{b=w.create(d.Set.Window,c);w.Add(b);return;}}w.clear();if(d.Set.Window){if(jQuery.type(d.Set.Window)=='object'){b=w.create(d.Set.Window,c);w.Add(b);}else if(jQuery.type(d.Set.Window)=='array'){a=d.Set.Window;for(n=0;n<a.length;++n){b=w.create(a[n],c);w.Add(b);}return;}}}else if(jQuery.type(d.Set)=='array'){a=d.Set;for(n=0;n<a.length;++n){var i=a[n];if(i.name){b=w.find(i.name);if(b){b.load(i.Window,c);}else{b=w.create(i.Window,c);w.Add(b);}}}}}};w.Add=function(a){w.m_WindowArray.push(a);};w.Remove=function(n){var a=null;for(var b=0,l=w.m_WindowArray.length;b<l;++b){if((a=w.m_WindowArray[b]).m_ID==n){a.clear();w.m_WindowArray.splice(b,1);break;}}};w.Awake=function(t){for(var n=0;n<w.m_WindowArray.length;++n){w.m_WindowArray[n].Awake(t);}};w.GetMainWindow=function(){for(var n=0;n<w.m_WindowArray.length;++n){if(w.m_WindowArray[n].m_refParent==null){return w.m_WindowArray[n];}}return null;};w.NotifyDataChange=function(){var a=w.m_WindowArray;for(var n=0;n<a.length;++n){a[n].NotifyDataChange();}return null;};w.NotifyResize=function(){var a=w.m_WindowArray;for(var n=0;n<a.length;++n){a[n].NotifyResize();}return null;};w.NotifySceneMove=function(s){var a=w.m_WindowArray;for(var n=0,l=a.length;n<l;++n){a[n].NotifySceneMove(s);}return null;};w.NotifySceneZoom=function(s){var a=w.m_WindowArray;for(var n=0,l=a.length;n<l;++n){a[n].NotifySceneZoom(s);}return null;};w.Render=function(){var a=w.m_WindowArray;for(var n=0;n<a.length;++n){a[n].Render();}return null;};w.RenderAsync=function(){var a=w.m_WindowArray;for(var n=0;n<a.length;++n){a[n].RenderAsync(true);}return null;};return w;};
VBI.Window=function(){"use strict";this.vbiclass="Window";this.m_ID="";this.m_Caption="";this.m_Type="";this.m_bModal=true;this.m_refScene=null;this.m_refSceneInstance=null;this.m_refParent=null;this.m_Width=null;this.m_Height=null;this.m_Div=null;this.m_Ctx=null;this.BaseLoad=function(i,d,c){if(d.id){i.m_ID=d.id;}if(d.caption){i.m_Caption=d.caption;}if(d.refParent){i.m_refParent=d.refParent;}if(d.modal){i.m_bModal=(d.ref=="true")?true:false;}if(d.width){i.m_Width=parseInt(d.width,10);}if(d.height){i.m_Height=parseInt(d.height,10);}i.m_Ctx=c;if(d.refScene){i.m_refScene=d.refScene;}else if(VBI.m_bTrace){VBI.Trace("Error: no scene assigned to window");}};this.BaseClear=function(){var s=this.GetScene();if(s){s.m_Parent=null;}this.m_refParent=null;this.m_refScene=null;this.m_refSceneInstance=null;this.m_Ctx=null;this.m_Div=null;};this.clear=function(){this.BaseClear();};this.load=function(d,c){this.BaseLoad(this,d,c);};this.GetScene=function(){if(this.m_refSceneInstance){return this.m_refSceneInstance;}this.m_refSceneInstance=(this.m_Ctx&&this.m_Ctx.m_SceneManager)?this.m_Ctx.m_SceneManager.GetSceneByName(this.m_refScene):null;if(this.m_refSceneInstance){this.m_refSceneInstance.m_Parent=this;}return this.m_refSceneInstance;};this.GetHostingScene=function(){if(!this.m_refParent){return null;}var w=this.m_Ctx.m_Windows.find(this.m_refParent);if(w){return w.GetScene();}return null;};this.NotifyDataChange=function(){var s=this.GetScene();if(s){s.NotifyDataChange();}};this.NotifyResize=function(){return;};this.NotifySceneMove=function(s){return;};this.NotifySceneZoom=function(s){return;};this.Render=function(){var s=this.GetScene();if(s){s.Render();}};this.RenderAsync=function(){var s=this.GetScene();if(s){if(s.RenderAsync){s.RenderAsync(true);}else{s.Render();}}};this.Awake=function(t){var s=this.GetScene();if(s){s.Awake(t);}else if(VBI.m_bTrace){VBI.Trace("Error: Awake no scene assigned to window");}};this.Create=function(t){};this.Destroy=function(){};};
VBI.CalloutWindow=function(){"use strict";var c=new VBI.Window();c.m_oCallout=null;c.load=function(d,a){c.BaseLoad(c,d,a);c.m_Pos=new VBI.AttributeProperty(d,'pos',null,a);c.m_OffsetX=new VBI.AttributeProperty(d,'offsetX',null,a,0);c.m_OffsetY=new VBI.AttributeProperty(d,'offsetY',null,a,0);};c.clear=function(){c.UnRegisterEvents();c.Remove();c.BaseClear();c.m_oCallout=null;};c.processclosebuttonclick=function(e){c.m_Ctx.onCloseWindow(c.m_ID,c.m_oCallout.m_Content);c.clear();e.preventDefault();e.stopPropagation();};c.IsValid=function(){return(c.m_oCallout&&c.m_oCallout.m_Div)?true:false;};c.NotifySceneMove=function(s){c.UpdatePosition();};c.NotifySceneZoom=function(s){c.UpdatePosition();};c.CalcDivPosition=function(){if(!c.IsValid()){return undefined;}var p=VBI.m_bIsPhone;if(p){return undefined;}var o=c.m_OffsetX.GetValueLong();var a=c.m_OffsetY.GetValueLong();var b=c.m_Pos.GetValueVector(c.m_Ctx);var h=c.GetHostingScene();var d=h.m_Canvas[h.m_nOverlayIndex];var e=d.getPixelLeft();var f=d.getPixelTop();var E=h.m_Canvas[0].m_nExactLOD;var w=parseInt(Math.pow(2,E)*h.m_nWidthCanvas/h.m_nTilesX*h.m_Proj.m_nXYRatio,10);var n=(h.m_nDivWidth-w)/2;var g=h.m_nDivWidth-n;var t=[];var i,l;var O;if(b.length>5){var j=d.getPixelWidth();var k=d.getPixelHeight();d.setPixelWidth(h.m_nWidthCanvas);d.setPixelHeight(h.m_nHeightCanvas);h.m_ZoomFactors[0]=j/h.m_nWidthCanvas;h.m_ZoomFactors[1]=k/h.m_nHeightCanvas;var m=h.GetNearestPosArray(b);var q=h.GetPointFromPos([m.m_MinX,m.m_MaxY,0.0],false);var r=h.GetPointFromPos([m.m_MaxX,m.m_MinY,0.0],false);O=h.GetInstanceOffsets([q[0],q[1],r[0],r[1]]);var s=O.length?h.GetPointArrayFromPosArray(m,false):null;var u;var v=h.GetInternalDivClientRect();var x=v.width/h.m_ZoomFactors[0];var y=v.height/h.m_ZoomFactors[1];var P=e/h.m_ZoomFactors[0];var z=f/h.m_ZoomFactors[1];var A=[-P,-z,-P+x,-z+y];for(i=0,l=O.length;i<l;++i){u=VBI.Utilities.GetMidpointsForLine(s,O[i],A);if(u.aPos.length>u.max){t=u.aPos[u.max];t[0]*=h.m_ZoomFactors[0];t[1]*=h.m_ZoomFactors[1];break;}}d.setPixelWidth(j);d.setPixelHeight(k);}else{t=h.GetPointFromPos(b,true);if(t[0]+e<n){while(t[0]+e<n){t[0]+=w;}}else if(t[0]+e>g){while(t[0]+e>g){t[0]-=w;}}}if(t.length>1){t[0]+=e;t[1]+=f;t[0]+=o;t[1]+=a;var B=c.m_oCallout.GetAnchorPoint();t[0]-=B[0];t[1]-=B[1];}else{t.push(-1000,-1000);}return t;};c.UpdatePosition=function(){if(!c.IsValid()){return;}var p=c.CalcDivPosition();if(p){c.m_oCallout.m_Div.style.left=Math.round(p[0])+"px";c.m_oCallout.m_Div.style.top=Math.round(p[1])+"px";}else{c.m_oCallout.m_Div.style.top="";c.m_oCallout.m_Div.style.left="0px";c.m_oCallout.m_Div.style.bottom="0px";}c.m_oCallout.m_Div.style.visibility='visible';};c.Create=function(t){if(c.m_refParent&&!c.m_oCallout){var h=c.GetHostingScene();if(h){c.m_oCallout=VBI.Utilities.CreateDetail(t+"-"+c.m_ID,0,0,c.m_Width,c.m_Height,c.m_Caption,5);c.m_oCallout.m_Div.style.visibility='hidden';c.RegisterEvents();h.m_WindowLayerDiv.appendChild(c.m_oCallout.m_Div);c.m_Ctx.onOpenWindow(c.m_ID,c.m_oCallout.m_Content);c.UpdatePosition();}}};c.RegisterEvents=function(){var f=c.processclosebuttonclick.bind(c);c.m_oCallout.m_CloseButton.onclick=f;c.m_oCallout.m_CloseButton.ontouchend=f;};c.UnRegisterEvents=function(){if(!c.m_oCallout||!c.m_oCallout.m_CloseButton){return;}c.m_oCallout.m_CloseButton.onclick=null;c.m_oCallout.m_CloseButton.ontouchend=null;};c.Remove=function(){var a=c.m_oCallout;if(!a||!a.m_Div){return;}var b=a.m_Div;while(b.firstChild){b.removeChild(b.firstChild);}if(b.parentElement){b.parentElement.removeChild(b);}c.m_oCallout=null;};c.Awake=function(t){if(this.m_refParent){this.Create(t);}var s=this.GetScene();if(s){s.m_Div=c.m_oCallout.m_Content;s.Awake(t);}else if(VBI.m_bTrace){VBI.Trace("Error: Awake no scene assigned to window");}};return c;};
VBI.LegendWindow=function(){"use strict";var c=new VBI.Window();c.m_oLegend=null;c.m_Props=[];c.m_Data=[];c.m_bRenew=false;c.m_Position=[];c.m_bCreated=false;c.load=function(d,a){c.BaseLoad(c,d,a);c.m_Props.push(c.m_DataSource=new VBI.NodeProperty(d,'datasource',null,a));c.m_Props.push(c.m_Colors=new VBI.AttributeProperty(d,'colors',c.m_DataSource,a));c.m_Props.push(c.m_Images=new VBI.AttributeProperty(d,'images',c.m_DataSource,a));c.m_Props.push(c.m_Texts=new VBI.AttributeProperty(d,'texts',c.m_DataSource,a));c.m_Props.push(c.m_Tooltips=new VBI.AttributeProperty(d,'tooltips',c.m_DataSource,a));c.m_Position=[];if(d.top&&d.right){c.m_Position.push(parseInt(d.right,10));c.m_Position.push(parseInt(d.top,10));}};c.clear=function(){c.UnRegisterEvents();c.Remove();c.BaseClear();c.m_oLegend=null;if(c.m_Props){for(var n=0;n<c.m_Props.length;++n){c.m_Props[n].clear();}c.m_Props=[];}c.m_Data=[];};c.invalidate=function(){c.m_bRenew=true;};c.IsValid=function(){return(c.m_oLegend&&c.m_oLegend.m_Div)?true:false;};c.NotifySceneMove=function(s){};c.NotifySceneZoom=function(s){};c.LegendChanged=function(){var n=c.m_DataSource.GetCurrentNode(c.m_Ctx);if(n){var l=n.m_dataelements.length;if(l!=c.m_Data.length){return true;}for(var a=0;a<l;++a){c.m_DataSource.Select(a);var t=c.m_Texts.GetValueString(c.m_Ctx);if(t!=c.m_Data[a].text){return true;}if(c.m_Data[a].type==1){if(c.m_Data[a].value!=c.m_Images.GetValueString(c.m_Ctx)){return true;}}else if(c.m_Data[a].type==2){if(c.m_Data[a].value!=c.m_Colors.GetValueColor(c.m_Ctx)){return true;}}}}else{return true;}return false;};c.ApplyData=function(){var n=c.m_DataSource.GetCurrentNode(c.m_Ctx);if(n){var l=n.m_dataelements.length;for(var a=0;a<l;++a){var b;var i;var o={};c.m_DataSource.Select(a);o.text=c.m_Texts.GetValueString(c.m_Ctx);if(o.text){o.type=0;i=c.m_Images.GetValueString(c.m_Ctx);if(i){o.type=1;o.value=i;}else{b=c.m_Colors.GetValueColor(c.m_Ctx);if(b){o.type=2;o.value=b;}}c.m_Data.push(o);}}}};c.NotifyResize=function(){if(c.m_bCreated){c.calcMaxHeight();}};c.NotifyDataChange=function(){if(c.m_Props){for(var n=0,l=c.m_Props.length;n<l;++n){c.m_Props[n].NotifyDataChange(c.m_Ctx);}}if(c.LegendChanged()){c.m_Data=[];if(c.m_oLegend&&c.m_oLegend.m_Table){while(c.m_oLegend.m_Table.rows.length>0){c.m_oLegend.m_Table.deleteRow(-1);}c.ApplyData();c.FillContent();c.calcMaxHeight();}}};c.Create=function(t){var u=(c.m_oLegend&&!c.m_oLegend.m_Div.parentNode);if(c.m_bRenew){c.m_Data=[];if(c.m_oLegend&&c.m_oLegend.m_Table){while(c.m_oLegend.m_Table.rows.length>0){c.m_oLegend.m_Table.deleteRow(-1);}c.ApplyData();c.FillContent();}c.m_bRenew=false;}else if(c.m_refParent&&!c.m_oLegend||u){var h=c.GetHostingScene();if(h){var C=(this.m_Ctx.m_Actions.findAction("Click",h,c.m_ID))?true:false;c.m_oLegend=VBI.Utilities.CreateLegend(t+"-"+c.m_ID,0,c.m_Caption,5,C);if(!u){c.ApplyData();}c.FillContent();c.m_Expanded=true;c.RegisterEvents();c.m_oLegend.m_Div=h.m_LegendLayerDiv.appendChild(c.m_oLegend.m_Div);if(c.m_Position.length==2){if(!isNaN(c.m_Position[0])){c.m_oLegend.m_Div.style.right=c.m_Position[0]+"px";c.m_oLegend.m_Div.style.left='';}if(!isNaN(c.m_Position[1])){c.m_oLegend.m_Div.style.top=c.m_Position[1]+"px";}}c.calcMaxHeight();}}c.m_bCreated=true;};c.getId=function(a,b){return c.m_oLegend.m_Table.id+'-'+b+'-'+a;};c.FillContent=function(){if(!c.m_Data.length){return;}for(var n=0;n<c.m_Data.length;++n){var r=c.m_oLegend.m_Table.insertRow(-1);r.id=c.getId(n,'content-tablerow');var a=r.insertCell(0);var o=c.m_Data[n];if(o.type==2){var b=VBI.Utilities.CreateGeoSceneDivCSS(c.getId(n,'content-celldiv'),'vbi-legend-content-celldiv-square');b.style.backgroundColor=o.value;a.appendChild(b);}else if(o.type==1){var i=c.m_Ctx.GetResources().GetImage(o.value,null,null,c.invalidate.bind());if(i){var d=i.cloneNode(true);d.className='vbi-legend-content-celldiv';d.id=c.getId(n,'content-celldiv');a.appendChild(d);}}else{a.className="vbi-legend-content-celltext-group";a.colSpan=2;a.innerHTML=jQuery.sap.encodeHTML(o.text);}if(o.type>0){var e=r.insertCell(1);e.className="vbi-legend-content-celltext";e.id=c.getId(n,'content-celltext');e.innerHTML=jQuery.sap.encodeHTML(o.text);}}};c.processtouchend=function(e){document.removeEventListener('touchend',c.processtouchend,true);document.removeEventListener('touchmove',c.processtouchmove,true);};c.processmouseup=function(e){document.removeEventListener('mouseup',c.processmouseup,true);document.removeEventListener('mousemove',c.processmousemove,true);};c.movelegend=function(p){var n=p.slice(0);var h=c.GetHostingScene();if(n[0]<h.m_Div.clientLeft){n[0]=h.m_Div.clientLeft;}if(n[0]+c.m_oLegend.m_Div.clientWidth>h.m_Div.clientLeft+h.m_Div.clientWidth){n[0]=h.m_Div.clientLeft+h.m_Div.clientWidth-c.m_oLegend.m_Div.clientWidth;}if(n[1]<h.m_Div.clientTop){n[1]=h.m_Div.clientTop;}if(n[1]+c.m_oLegend.m_Header.clientHeight>h.m_Div.clientTop+h.m_Div.clientHeight){n[1]=h.m_Div.clientTop+h.m_Div.clientHeight-c.m_oLegend.m_Header.clientHeight;}jQuery(c.m_oLegend.m_Div).css('top',n[1]+'px');jQuery(c.m_oLegend.m_Div).css('right',h.m_Div.clientWidth-c.m_oLegend.m_Div.clientWidth-n[0]+'px');jQuery(c.m_oLegend.m_Div).css('left','');c.calcMaxHeight();};c.processtouchmove=function(e){var t=e.changedTouches[0];var x=parseInt(t.pageX,10);var y=parseInt(t.pageY,10);var n=[x-c.m_offset[0],y-c.m_offset[1]];c.movelegend(n);};c.processmousemove=function(e){if(e.which==1){var n=[e.pageX-c.m_offset[0],e.pageY-c.m_offset[1]];c.movelegend(n);}};c.processmousedragstart=function(e){if(e.which==1){c.m_offset=[e.pageX-c.m_oLegend.m_Div.offsetLeft,e.pageY-c.m_oLegend.m_Div.offsetTop];document.addEventListener('mouseup',c.processmouseup,true);document.addEventListener('mousemove',c.processmousemove,true);e.preventDefault();e.stopPropagation();}};c.processtouchdragstart=function(e){var t=e.changedTouches[0];var s=parseInt(t.pageX,10);var a=parseInt(t.pageY,10);c.m_offset=[s-c.m_oLegend.m_Div.offsetLeft,a-c.m_oLegend.m_Div.offsetTop];document.addEventListener('touchend',c.processtouchend,true);document.addEventListener('touchmove',c.processtouchmove,true);e.preventDefault();e.stopPropagation();};c.collapse=function(e){if(c.m_Expanded){c.m_oLegend.m_ButtonCol.style.visibility='hidden';c.m_oLegend.m_ButtonExp.style.visibility='';c.m_oLegend.m_Content.style.display='none';c.m_Expanded=false;}};c.calcMaxHeight=function(){var s=c.GetHostingScene().m_Div.clientHeight;if(s){var l=c.m_oLegend.m_Header.clientHeight;var a=parseInt(c.m_oLegend.m_Div.style.top,10);var y=a+l;var d=s-y;c.m_oLegend.m_Content.style.maxHeight=d+"px";}};c.expand=function(e){if(!c.m_Expanded){c.m_oLegend.m_ButtonCol.style.visibility='';c.m_oLegend.m_ButtonExp.style.visibility='hidden';c.m_oLegend.m_Content.style.display='';c.m_Expanded=true;}};c.clickTable=function(e){var s=e.target||e.srcElement;var r;var m=s.id.match(/\d+/g);if(m&&m.length){r=m[m.length-1];}else{m=s.parentNode.id.match(/\d+/g);if(m&&m.length){r=m[m.length-1];}}if(r){var h=c.GetHostingScene();var p={row:r,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,metaKey:e.metaKey,altKey:e.altKey};var a=null,b=this.m_Ctx.m_Actions;if(h&&b){a=this.m_Ctx.m_Actions.findAction("Click",h,c.m_ID);}if(a){this.m_Ctx.FireAction(a,h.m_ID,a.m_refVO,null,p);}}};c.RegisterEvents=function(){var f=c.processmousedragstart.bind(c);c.m_oLegend.m_Header.onmousedown=f;var a=c.processtouchdragstart.bind(c);c.m_oLegend.m_Header.ontouchstart=a;var b=c.collapse.bind(c);c.m_oLegend.m_ButtonCol.onclick=b;var d=c.expand.bind(c);c.m_oLegend.m_ButtonExp.onclick=d;var e=c.clickTable.bind(c);c.m_oLegend.m_Table.onclick=e;c.m_oLegend.m_Header.style.cursor=c.m_oLegend.m_Table.style.cursor='pointer';};c.UnRegisterEvents=function(){if(!c.m_oLegend){return;}if(c.m_oLegend.m_Header){c.m_oLegend.m_Header.onmousedown=null;c.m_oLegend.m_Header.ontouchstart=null;}if(c.m_oLegend.m_ButtonCol){c.m_oLegend.m_ButtonCol.onclick=null;}if(c.m_oLegend.m_ButtonExp){c.m_oLegend.m_ButtonExp.onclick=null;}if(c.m_oLegend.m_Table){c.m_oLegend.m_Table.onclick=null;}};c.Remove=function(){var a=c.m_oLegend;if(!a||!a.m_Div){return;}var b=a.m_Div;while(b.firstChild){b.removeChild(b.firstChild);}if(b.parentElement){b.parentElement.removeChild(b);}c.m_oLegend=null;};c.Awake=function(t){if(c.m_refParent){c.Create(t);}var s=this.GetScene();if(s){s.Awake(t);}else if(VBI.m_bTrace){VBI.Trace("Error: Awake no scene assigned to window");}};return c;};
