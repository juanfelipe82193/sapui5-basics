sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.54.controller.App", {

		onInit: function () {
			sap.ui.getCore().loadLibrary("sap.ui.vbm");
			var oGeoMap = this.getView().byId("vbi");
			oGeoMap.setMapConfiguration(GLOBAL_MAP_CONFIG);

			oGeoMap.addVo(new sap.ui.vbm.Spots("Spots", {
				minSel: "0",
				maxSel: "0",
				items: {
					path: "/Spots",
					template: new sap.ui.vbm.Spot({
						key: '{key}',
						position: '{pos}',
						labelText: '{labeltext}',
						type: '{type}'
					})
				}
			}));

			oGeoMap.addVo(new sap.ui.vbm.Spots("otherSpots", {
				minSel: "0",
				maxSel: "0",
				items: [
						new sap.ui.vbm.Spot("otherSpot", {
						position: '-0.127697;51.509331;0',
						labelText: 'London',
						type: sap.ui.vbm.SemanticType.Default
					})
					]
			}));

			oGeoMap.addVo(new sap.ui.vbm.Routes("routes", {
				items: {
					path: "/Routes",
					template: new sap.ui.vbm.Route({
						position: '{pos}',
						end: '{end}',
						color: '{color}'
					})
				}
			}));

			var oOriginalData = {
				Spots: [
					{
						"key": "1",
						"labeltext": "Berlin",
						"pos": "13.407965;52.517906;0",
						"type": sap.ui.vbm.SemanticType.Success
					}, {
						"key": "2",
						"labeltext": "Madrid",
						"pos": "-3.704257;40.418071;0",
						"type": sap.ui.vbm.SemanticType.Success
					}, {
						"key": "3",
						"labeltext": "Paris",
						"pos": "2.347899;48.855675;0",
						"type": sap.ui.vbm.SemanticType.Success
					}, {
						"key": "4",
						"labeltext": "Munich",
						"pos": "11.546641;48.133355;0",
						"type": sap.ui.vbm.SemanticType.Success
					}
				],
				Routes: [
					{
						"key": "1",
						"end": "1",
						"pos": "-108.521059;49.506408;0;-95.815190;55.967717;0",
						"color": "RGB(255,0,0)"
					}, {
						"key": "2",
						"end": "1",
						"pos": "-106.713626;40.036118;0;-95.639409;42.285526;0",
						"color": "RGB(0,0,255)"
					}
				]

			};

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oOriginalData);

			oGeoMap.setModel(oModel);

		},

		onRemoveBerlinMadrid: function () {
			var oVBI = this.getView().byId("vbi");

			var oData = oVBI.getModel().getData();
			oData.Spots.splice(0, 2);
			oVBI.getModel().setData(oData);

		},

		onReplaceModel: function () {
			var oOtherData = {
				Spots: [
					{
						"key": "1",
						"labeltext": "New Data Model:Berlin",
						"pos": "13.407965;52.517906;0",
						"type": sap.ui.vbm.SemanticType.Success
					}, {
						"key": "2",
						"labeltext": "New Data Model:Madrid",
						"pos": "-3.704257;40.418071;0",
						"type": sap.ui.vbm.SemanticType.Success
					}
				],
				Routes: [
					{
						"key": "1",
						"end": "1",
						"pos": "-108.521059;49.506408;0;-95.815190;55.967717;0",
						"color": "RGB(255,0,0)"
					}
				]

			};


			var oOtherModel = new sap.ui.model.json.JSONModel();
			oOtherModel.setData(oOtherData);

			this.getView().byId("vbi").setModel(oOtherModel);

		},

		onSetWarningState: function () {
			var oVBI = this.getView().byId("vbi");
			var myOData = oVBI.getModel().getData();
			for (var nI = 0; nI < myOData.Spots.length; ++nI) {
				myOData.Spots[nI].type = sap.ui.vbm.SemanticType.Warning;
			}
			oVBI.getModel().setData(myOData);

			var a = oVBI.getVos();
			var otherSpots = a[1].getItems();
			for (var nJ = 0; nJ < otherSpots.length; ++nJ) {
				otherSpots[nJ].setType(sap.ui.vbm.SemanticType.Warning);
			}
		},

		onRemoveAllSpots: function () {
			var oVBI = this.getView().byId("vbi");
			var aVO = oVBI.getVos();
			var oData = oVBI.getModel().getData();
			oData.Spots.splice(0, oData.Spots.length);
			oVBI.getModel().setData(oData);

			aVO[1].removeAllItems();
		},

		onAddMoscowVienna: function () {
			var moscow = {
				"key": "5",
				"labeltext": "Moscow",
				"pos": "37.617370;55.751792;0",
				"type": sap.ui.vbm.SemanticType.Success
			};
			var wien = {
				"key": "6",
				"labeltext": "Vienna",
				"pos": "16.371812;48.211449;0",
				"type": sap.ui.vbm.SemanticType.Success
			};

			var oVBI = this.getView().byId("vbi");
			var myOData = oVBI.getModel().getData();
			myOData.Spots.push(moscow);
			myOData.Spots.push(wien);
			oVBI.getModel().setData(myOData);
		},

		onRemoveSpotTypes: function () {
			var oVBI = this.getView().byId("vbi");
			var aVO = oVBI.getVos();
			oVBI.removeVo(aVO[0]);
			oVBI.removeVo(aVO[1]);
		},

		onRemoveDefaultType: function () {
			var oVBI = this.getView().byId("vbi");
			var a = oVBI.getVos();
			a[1].removeAllItems();
		},

		onAddDefaultType: function () {
			var oVBI = this.getView().byId("vbi");
			var a = oVBI.getVos();
			a[1].addItem(
				new sap.ui.vbm.Spot({
					position: '31.235461;30.048340;0',
					labelText: 'Cairo',
					type: sap.ui.vbm.SemanticType.Default
				}));
		}

	});
});
