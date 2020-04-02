sap.ui.define(function() {
	"use strict";

	var oWorkaround = {
		initMapWithBezier: function(oMap) {	
			this.oMap = oMap;
			return this;
		},
	 onResolveTheLines : function(oRoute){
		 var oBackForth = null;
		 var aRoute = oRoute.position.split(";");
		 var length = aRoute.length;
		 if ( length >= 6) {
			 var oPosStart = {"coords":[]};
			 var oPosEnd = {"coords":[]};
			 
			 oPosStart.name = 'Start';
			 oPosEnd.name = 'End';
			 
			 oPosStart.coord = [aRoute[0],aRoute[1],aRoute[2]];
			 oPosEnd.coord = [aRoute[length-3],aRoute[length-2],aRoute[length-1]];
			 
			 oBackForth = this.onDrawTheLines(oPosStart, oPosEnd);
			 return oBackForth;
		 } else {
			 return {"error": "not working because too less coords"};
		 }
	},

	 onDrawTheLines : function(oPosStart, oPosEnd) {
		// Still calc in Geo coords
		 var scene = this.oMap.mVBIContext.GetMainScene();
	
		var vDiff = {};
		vDiff.Geo = [];
		vDiff.Geo[0] = oPosEnd.coord[0] - oPosStart.coord[0];
		vDiff.Geo[1] = oPosEnd.coord[1] - oPosStart.coord[1];

		var vDiffOrth = {};
		vDiffOrth.Geo = [];
		vDiffOrth.Geo[0] = -vDiff.Geo[1];
		vDiffOrth.Geo[1] = vDiff.Geo[0];

		var vMiddle = {};
		vMiddle.Geo = [];
		vMiddle.Geo[0] = (parseFloat(oPosStart.coord[0]) + parseFloat(oPosEnd.coord[0])) / 2;
		vMiddle.Geo[1] = (parseFloat(oPosStart.coord[1]) + parseFloat(oPosEnd.coord[1])) / 2;

		oPosStart.GeoRad = [];
		oPosStart.GeoRad[0] = Math.PI * oPosStart.coord[0] / 180;
		oPosStart.GeoRad[1] = Math.PI * oPosStart.coord[1] / 180;

		oPosEnd.GeoRad = [];
		oPosEnd.GeoRad[0] = Math.PI * oPosEnd.coord[0] / 180;
		oPosEnd.GeoRad[1] = Math.PI * oPosEnd.coord[1] / 180;

		vDiffOrth.GeoRad = [];
		vDiffOrth.GeoRad[0] = Math.PI * vDiffOrth.Geo[0] / 180;
		vDiffOrth.GeoRad[1] = Math.PI * vDiffOrth.Geo[1] / 180;
		// Now we have to move to radians 

		vMiddle.GeoRad = [];
		vMiddle.GeoRad[0] = Math.PI * vMiddle.Geo[0] / 180;
		vMiddle.GeoRad[1] = Math.PI * vMiddle.Geo[1] / 180;
		//
		var vStartPix = [];
		var vEndPix = [];
		var vMiddlePix = [];

		vDiff.Pix = [];
		vStartPix = scene.GetPointFromGeo(oPosStart.GeoRad);
		vEndPix = scene.GetPointFromGeo(oPosEnd.GeoRad);
		vDiff.Pix[0] = vEndPix[0] - vStartPix[0];
		vDiff.Pix[1] = vEndPix[1] - vStartPix[1];

		vMiddlePix = scene.GetPointFromGeo(vMiddle.GeoRad);

		var vDiffOrthPix = [];
		vDiffOrthPix[0] = -vDiff.Pix[1];
		vDiffOrthPix[1] = vDiff.Pix[0];
		var length = Math.sqrt(vDiffOrthPix[0] * vDiffOrthPix[0] + vDiffOrthPix[1] * vDiffOrthPix[1]);
		var vDiffOrthPixTen = [];
		vDiffOrthPixTen[0] = (vDiffOrthPix[0] * 200) / length;
		vDiffOrthPixTen[1] = (vDiffOrthPix[1] * 200) / length;

		var vMiddleBz = {}; // Achtung ist nur ein Speicher für Zwischenergebnisse

		var vPos = new Array(2);
		vPos[0] = vMiddlePix[0] + vDiffOrthPixTen[0];
		vPos[1] = vMiddlePix[1] + vDiffOrthPixTen[1];
         
	    var nLines;    
        nLines = 2; //document.getElementById("NumberofLines").value;
		
        var vOuterPos =  {};
        vOuterPos.Pix = new Array(2);
        vOuterPos.Pix[0] = vMiddlePix[0] + vDiffOrthPixTen[0]*(nLines-1)/2;
        vOuterPos.Pix[1] = vMiddlePix[1] + vDiffOrthPixTen[1]*(nLines-1)/2;

		var GeoRad = [];
		GeoRad = scene.GetGeoFromPoint(vOuterPos.Pix)
		vOuterPos.Geo = new Array(2);
		vOuterPos.Geo[0] = GeoRad[0] * 180 / Math.PI;
		vOuterPos.Geo[1] = GeoRad[1] * 180 / Math.PI;

		var aMiddleBz = [];
		aMiddleBz[0] = jQuery.extend(true, {}, vOuterPos);
		
        var nLine;
        var vMiddleBz = {};
        vMiddleBz.Pix = new Array(2); 
        vMiddleBz.Geo = new Array(2); 
		for (var nLine = 1; nLine < nLines; nLine++) {
		   vMiddleBz.Pix[0] = vOuterPos.Pix[0] - vDiffOrthPixTen[0]*nLine;
	       vMiddleBz.Pix[1] = vOuterPos.Pix[1] - vDiffOrthPixTen[1]*nLine;
	       GeoRad = scene.GetGeoFromPoint(vMiddleBz.Pix)
	       vMiddleBz.Geo = [];
	       vMiddleBz.Geo[0] = GeoRad[0] * 180 / Math.PI;
	       vMiddleBz.Geo[1] = GeoRad[1] * 180 / Math.PI;
	       aMiddleBz[nLine] = jQuery.extend(true, {}, vMiddleBz);
        }
		

		var oBackForth = this.DrawBezier(oPosStart, aMiddleBz, oPosEnd);
		return oBackForth;

	},


	 DrawBezier: function (oPosStart, aMiddleBz, oPosEnd) {
		 var oData = {"back":"","forth":""};
		var vPos = new Array(2);
		var sRoute;
		var sTooltip = 'Route ';
		var toggle1 = 0; 
		var toggle2 = 0;
		for (var i = 0; i < aMiddleBz.length; i++) {
			sRoute = '';
	        var separator = ';'
			for (var j = 0; j <= 50; j++) {
				var t = j / 50;
		        if (j == 50) {
		          separator = ''
		        };
				vPos[0] = (1 - t) * (1 - t) * oPosStart.coord[0] + 2 * t * (1 - t) * aMiddleBz[i].Geo[0] + t * t * oPosEnd.coord[0];
				vPos[1] = (1 - t) * (1 - t) * oPosStart.coord[1] + 2 * t * (1 - t) * aMiddleBz[i].Geo[1] + t * t * oPosEnd.coord[1];
				sRoute += vPos[0] + ';' + vPos[1] + '; 0' + separator;
			}
	       sTooltip += i;
	      
	       toggle1 = i%2;
	       toggle2 = (i+1)%2;
			if (oData.back == "") {
				oData.back = sRoute;
			} else{
				oData.forth = sRoute;
			}
			
		}
		return oData;

	}
	};
	return oWorkaround;
});
