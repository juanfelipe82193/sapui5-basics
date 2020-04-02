sap.ui.controller("dsb.datasourcebrowser", {

	getControl: function(id) {
		var view = this.getView();
		return view.byId(id);
	},

	onInit: function() {
		this.imageBaseUrl = "zen.res/zen.rt.components.ui5/datasourcebrowser/images/";
		
		// add missing control
		var view = this.getView();

		this.oResourceModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: "zen.res/zen.rt.components.ui5/datasourcebrowser/i18n/localization.properties"
		});
		view.setModel(this.oResourceModel, "i18n"); // attach the resource model with the symbolic name "i18n"

		var oModel = new sap.ui.model.json.JSONModel();

		var configJson = {};
		var dialogTitle = "";

		if (view.controlProperties.config) {
			configJson = JSON.parse(view.controlProperties.config);
			dialogTitle = configJson.title;
		}

		if (!dialogTitle) {
			configJson.title = this.oResourceModel.getResourceBundle().getText("DLGTITLE");
		}
		var loadingI18n = this.oResourceModel.getResourceBundle().getText("LOADING");
		configJson.loadingText = loadingI18n;
		oModel.setData(configJson);
		view.setModel(oModel);

		var searchTab = this.getControl("searchTab");
		var rolesTab = this.getControl("rolesTab");
		rolesTab.isInitial = true;
		var workspacesTab = this.getControl("workspacesTab");
		workspacesTab.isInitial = true;
		var foldersTab = this.getControl("foldersTab");
		foldersTab.isInitial = true;

		if (configJson.hiddenTabs) {
			var hiddenTabs = configJson.hiddenTabs;
			hiddenTabs.forEach(function(entry) {
				if (entry === "searchTab") {
					searchTab.setVisible(false);
				} else if (entry === "rolesTab") {
					rolesTab.setVisible(false);
				} else if (entry === "workspacesTab") {
					workspacesTab.setVisible(false);
				} else if (entry === "foldersTab") {
					foldersTab.setVisible(false);
				}
			});
		}

		// HANA case: hide roles tab and workspaces tab, and set the tab text to "Folders" instead of "Info Areas"
		if (view.controlProperties.connectionType === "BAE" || view.controlProperties.connectionType === "HTTP") {
			rolesTab.setVisible(false);
			workspacesTab.setVisible(false);
			foldersTab.setText(this.oResourceModel.getResourceBundle().getText("FOLDERS"));
		}

		this.defaultIndex = -1;
		if (configJson.defaultTab) {
			var tabStrip = this.getControl("tabStrip");
			if (!sap.zen.Dispatcher.instance.isMainMode()) { //UI5 CLASSIC
				if (configJson.defaultTab === "searchTab" && searchTab.getVisible()) {
					tabStrip.setSelectedIndex(0);
					this.defaultIndex = 0;
				} else if (configJson.defaultTab === "rolesTab" && rolesTab.getVisible()) {
					tabStrip.setSelectedIndex(1);
					this.defaultIndex = 1;
				} else if (configJson.defaultTab === "workspacesTab" && workspacesTab.getVisible()) {
					tabStrip.setSelectedIndex(2);
					this.defaultIndex = 2;
				} else if (configJson.defaultTab === "foldersTab" && foldersTab.getVisible()) {
					tabStrip.setSelectedIndex(3);
					this.defaultIndex = 3;
				}
			} else { //UI5 M
				if (configJson.defaultTab === "searchTab" && searchTab.getVisible()) {
					this.defaultIndex = 0;
					tabStrip.setSelectedKey(this.createId("searchTab"));
				} else if (configJson.defaultTab === "rolesTab" && rolesTab.getVisible()) {
					this.defaultIndex = 1;
					tabStrip.setSelectedKey(this.createId("rolesTab"));
				} else if (configJson.defaultTab === "workspacesTab" && workspacesTab.getVisible()) {
					this.defaultIndex = 2;
					tabStrip.setSelectedKey(this.createId("workspacesTab"));
				} else if (configJson.defaultTab === "foldersTab" && foldersTab.getVisible()) {
					this.defaultIndex = 3;
					tabStrip.setSelectedKey(this.createId("foldersTab"));
				}

			}
		}

		if (this.defaultIndex === -1) { // invalid config options, fallback to first visible tab
			if (searchTab.getVisible()) {
				this.defaultIndex = 0;
			} else if (rolesTab.getVisible()) {
				this.defaultIndex = 1;
			} else if (workspacesTab.getVisible()) {
				this.defaultIndex = 2;
			} else if (foldersTab.getVisible()) {
				this.defaultIndex = 3;
			}
		}

		var dialog = this.getControl("dialog");

		if (configJson.width) {
			dialog.setWidth(configJson.width);
		}
		if (configJson.height) {
			dialog.setHeight(configJson.height);
		}

		if (searchTab.getVisible()) {
			dialog.setInitialFocus(this.getControl("searchPattern"));
		}

		dialog.open();
	},

	iconFormatter: function(sType) {
		if (sType === null) {
			return "";
		}
		if (sType === "QUERY") {
			return this.imageBaseUrl + "query.png";
		} else if (sType === "VIEW") {
			return this.imageBaseUrl + "queryview.png";
		} else if (sType === "INFOPROVIDER") {
			return this.imageBaseUrl + "cube.png";
		} else if (sType === "FOLDER") {
			return this.imageBaseUrl + "folder.png";
		}
		return "";
	},

	tooltipFormatter: function(sType) {
		if (sType === null) {
			return "";
		}
		if (sType === "QUERY") {
			return "Query";
		} else if (sType === "VIEW") {
			return "QueryView";
		} else if (sType === "INFOPROVIDER") {
			return "InfoProvider";
		}
		return "";
	},
	
	onAfterRendering: function() {
		// not working in init(), so we are doing this here
		if (this.defaultIndex > 0) {
			this.populateTab(this.defaultIndex);
		}
	},

	getSelectedNode: function() {
		var control, selectedIndex;

		if (this.getSelectedIndex() === 0) {
			control = this.getControl("resultTable");
		}
		if (this.getSelectedIndex() === 1) {
			control = this.getControl("rolesTree");
		}
		if (this.getSelectedIndex() === 2) {
			control = this.getControl("workspacesTree");
		}
		if (this.getSelectedIndex() === 3) {
			control = this.getControl("foldersTree");
		}

		if (control) {
			selectedIndex = control.getSelectedIndex();
			if (selectedIndex > -1) {
				var context = control.getContextByIndex(selectedIndex);
				return context.getObject();
			}
		}
		
		return undefined;
	},

	textFieldChanged: function() {
		this.searchClicked();
	},

	textFieldLiveChanged: function(evt) {
		var value = evt.getParameters().liveValue;
		this.getControl("searchButton").setEnabled(value !== "");
	},

	fetchRootNodes: function(sRootNodeType, tree) {
		tree.setModel(this.oResourceModel, "i18n");
		var resourceBundle = tree.getModel("i18n").getResourceBundle();
		var loadingText = resourceBundle.getText("LOADING");
		tree.setNoData(loadingText);

		var that = this;
		this.callZtlNoUndo("getRootFolders", sRootNodeType, function(aResult) {
			var oTreeModel = new sap.ui.model.json.JSONModel();
			var data = {};
						
			for (var i = 0, n = aResult.length; i < n; i++) {
				var node = aResult[i];
				var imageUrl = that.iconFormatter(node.type)				
				var entry = {
					name: node.name,
					description: node.description,
					type: node.type,
					icon: imageUrl,
					hasChildren: node.hasChildren,
					id: node.id
				};
				data["" + i] = entry;
				if (node.hasChildren) {
					entry["0"] = {
						name: "",
						description: loadingText,
						type: "LOADING",
						hasChildren: false
					};
				}
			}
			oTreeModel.setSizeLimit(Number.MAX_VALUE);
			oTreeModel.setData({
				root: data
			});
			tree.setModel(oTreeModel);

			tree.bindRows("/root");

			// replace "No Data" with "Not found" (only shown when there are no records)

			var typeStr = "";
			if (sRootNodeType === "ROLES") {
				typeStr = resourceBundle.getText("ROLES");
			}
			if (sRootNodeType === "WORKSPACES") {
				typeStr = resourceBundle.getText("WORKSPACES");
			}
			if (sRootNodeType === "FOLDERS") {
				typeStr = resourceBundle.getText("WORKSPACES");
			}
			var i18nText = resourceBundle.getText("NO_X_FOUND");
			var notFoundStr = i18nText.replace('{0}', typeStr);
			tree.setNoData(notFoundStr);
		});
	},

	populateTab: function(selectedTab) {
		if (selectedTab === 0) {
			this.getControl("searchPattern").focus();
		} else if (selectedTab === 1) { // roles tab
			var rolesTab = this.getControl("rolesTab");
			if (rolesTab.isInitial) {
				this.fetchRootNodes("ROLES", this.getControl("rolesTree"));
				rolesTab.isInitial = false;
			}
		} else if (selectedTab === 2) { // workspaces
			var workspacesTab = this.getControl("workspacesTab");
			if (workspacesTab.isInitial) {
				this.fetchRootNodes("WORKSPACES", this.getControl("workspacesTree")); // in HANA case, fetch folders initially
				workspacesTab.isInitial = false;
			}
		} else if (selectedTab === 3) { // folders tab
			var foldersTab = this.getControl("foldersTab");
			if (foldersTab.isInitial) {
				this.fetchRootNodes("INFO_AREA_OR_FOLDER", this.getControl("foldersTree")); // in HANA case, fetch folders initially
				foldersTab.isInitial = false;
			}
		}

		if (this.getSelectedNode() === undefined) {
			this.getControl("okButton").setEnabled(false);
		} else {
			this.getControl("okButton").setEnabled(true);
		}
	},

	getSelectedIndex: function() {
		var selectedIndex;
		var tabStrip = this.getControl("tabStrip");
		if (!sap.zen.Dispatcher.instance.isMainMode()) { //UI5 CLASSIC
			selectedIndex = tabStrip.getSelectedIndex();
		} else { //UI5 M
			var selectedKey = tabStrip.getSelectedKey();
			if (selectedKey.indexOf("searchTab") > -1) {
				selectedIndex = 0;
			} else if (selectedKey.indexOf("rolesTab") > -1) {
				selectedIndex = 1;
			} else if (selectedKey.indexOf("workspacesTab") > -1) {
				selectedIndex = 2;
			} else if (selectedKey.indexOf("foldersTab") > -1) {
				selectedIndex = 3;
			}
		}
		return selectedIndex;
	},

	tabSelected: function() {
		this.populateTab(this.getSelectedIndex());
	},

	toggleExpandedState: function(evt) {
		if (evt.getParameters().expanded) {
			var context = evt.getParameters().rowContext;
			var tree = evt.getSource();
			var model = tree.getModel();
			var resourceBundle = tree.getModel("i18n").getResourceBundle();
			var loadingText = resourceBundle.getText("LOADING");
			var node = context.getObject();
			var firstChild = node["0"];
			if (firstChild.type === "LOADING") {
				
				var that = this;
				this.callZtlNoUndo("getChildren", node.id, function(children) {
					if (children.length === 0) {
						// we found an empty folder => remove the "Loading..." node
						delete node["0"];
					} else {
						for (var i = 0, n = children.length; i < n; i++) {
							var child = children[i];
							var imageUrl = that.iconFormatter(child.type);
							var entry = {
								name: child.name,
								description: child.description,
								type: child.type,
								icon: imageUrl,
								hasChildren: child.hasChildren,
								id: child.id
							};
							node["" + i] = entry;
							if (child.hasChildren) {
								entry["0"] = {
									name: "",
									description: loadingText,
									type: "LOADING",
									hasChildren: false
								};
							}
						}
					}
					model.refresh();
				});
			}
		}
	},

	searchClicked: function(evt) {		
		var searchField = evt.getSource();
		searchField.setBusy(true);
		var searchResultsTitle = this.getControl("searchResultsLabel");		
		var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
		var table = this.getControl("resultTable");
		table.setModel(new sap.ui.model.json.JSONModel({}));
		table.setNoDataText(resourceBundle.getText("SEARCHING"));
		
		var that = this;
		this.callZtlNoUndo("searchDataSources", searchField.getValue(), function(aResult) {
			//add icon URL
			for (var i = 0, n = aResult.length; i < n; i++) {
				//TODO: INLINE
				var tooltipText = that.tooltipFormatter(aResult[i].type)
				var imageUrl = that.iconFormatter(aResult[i].type);				
				aResult[i].icon = imageUrl;
				aResult[i].tooltip = tooltipText;
			}
			
			//create model
			var oSearchModel = new sap.ui.model.json.JSONModel();
			oSearchModel.setSizeLimit(Number.MAX_VALUE);
			oSearchModel.setData({
				data: aResult
			});
			table.setModel(oSearchModel);
			table.bindRows("/data");

			var i18nText = resourceBundle.getText("RESULTS_COUNT");
			var resultsText = i18nText.replace('{0}', aResult.length + "");
			searchResultsTitle.setText(resultsText);

			if (aResult.length === 0) {
				table.setNoDataText(resourceBundle.getText("NO_SEARCH_RESULTS"));
			}
			
			searchField.setBusy(false);
		});
	},

	tableRowSelected: function() {
		var selectedIndex = this.getControl("resultTable").getSelectedIndex();
		this.getControl("okButton").setEnabled((selectedIndex !== -1));
	},

	treeNodeSelected: function(evt) {
		var tree = evt.getSource();
		var selectedIndex = tree.getSelectedIndex();
		if (selectedIndex === -1) {
			this.getControl("okButton").setEnabled(false);
		} else {
			var context = evt.getParameters().rowContext;
			if (context !== null) {
				var node = context.getObject();
				var type = node.type;
				this.getControl("okButton").setEnabled(type === "QUERY" || type === "VIEW" || type === "INFOPROVIDER");
				if (type === "FOLDER") {
					tree.setSelectedIndex(-1);
				}
			}
		}
	},

	okClicked: function() {
		this.getControl("dialog").close();
		this.selectedNodeId = this.getSelectedNode().id;
		this.getControl("dialog").close();
	},

	dialogClosed: function() {
		this.callZtl("close", this.selectedNodeId);
	},

	cancelClicked: function() {
		this.selectedNodeId = undefined;
		this.getControl("dialog").close();
	},

	// //////////////////////////////////////////////////////////////////////////////////


	callZtl: function(name, arg, resultCallback) {
		var view = this.getView();
		view.callZTLFunction(name, resultCallback, arg);
	},
	
	callZtlNoUndo: function(name, arg, resultCallback) {
		var view = this.getView();
		view.callZTLFunctionNoUndo(name, resultCallback, arg);
	}

}); // controller end
