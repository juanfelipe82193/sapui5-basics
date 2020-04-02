sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.35.controller.App", {

		onInit: function() {

			this.oInsertCmd = {};
			this.aCmd = ['spot', 'area', 'geocircle', 'circle', 'route', 'box', 'piechart', 'clear', 'unsubscribeevents', 'subscribeevents'];


			$.getJSON("media/vbdesign/create_template.json", function(dat) {
				this.createtemplate = JSON.stringify(dat, null, '  ');
			}.bind(this));


			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/vbdesign/design.json", function(data) {
				var userStoredData = GLOBAL_MAP_CONFIG;
				data.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				data.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}
				vbi.load(data);


				function getInsertCommand(name, oInsertCmd) {
					$.ajax({
						url: "media/vbdesign/new_" + name + ".json",
						dataType: "json",
						success: function(data, textStatus, jqXHR) {
							oInsertCmd[name] = JSON.stringify(data, null, '  ');
						}
					});
				};

				// collect the insert commands......................................//
				for (var nJ = 0; nJ < this.aCmd.length; ++nJ) {
					getInsertCommand(this.aCmd[nJ], this.oInsertCmd);
				}



			}.bind(this));
		},


		onSelectStart: function(e) {
			if (e.target.dragDrop)
				e.target.dragDrop();
			e.preventDefault();
			return true;
		},

		onDragStart: function(e) {
			// try to load the json that is requested for this action........//
			var id = e.target.id.split("--").pop();

			// get the insertcommand from the ajax loaded object.............//
			// replace the key attribute.....................................//
			if (this.oInsertCmd[id])
				e.originalEvent.dataTransfer.setData("text", this.oInsertCmd[id].replace(/{KEY}/g, VBI.MathLib.CreateGUID()));
			else
				e.originalEvent.dataTransfer.setData('text', "unknown");

			e.originalEvent.dataTransfer.effectAllowed = 'move';
			return true;
		},

		// design item click handling.......................................//
		onClickItem: function(e) {
			// try to load the json that is requested for this action........//
			var id = e.target.id.split("--").pop();

			// get the insertcommand for creating the object.................//
			// push the insert command into the placeholder..................//
			if (this.createtemplate && this.oInsertCmd[id]) {
				var tmp = this.createtemplate.replace("\"PLACEHOLDER\"", this.oInsertCmd[id].replace(/{KEY}/g, VBI.MathLib.CreateGUID()));
				this.byId("vbi").load(tmp);
			}
		},

		onAfterRendering: function() {
			var allIcons = this.byId("bar").getContentMiddle().forEach(function(button) {
				button.ondragstart = this.onDragStart.bind(this);
				button.onselectstart = this.onSelectStart.bind(this);
				button.onclick = this.onClickItem.bind(this);
			}, this);
		},
		
		onSubmit: function(e) {
			var data = JSON.parse(e.getParameter("data"));
			if (data.Action.name === "CREATECOMPLETE" || data.Action.name === "DATADROP") {
				MessageToast.show("You have just created a new object");
			}
			
		}
	});
});
