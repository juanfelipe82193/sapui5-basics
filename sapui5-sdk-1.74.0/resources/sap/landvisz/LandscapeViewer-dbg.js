/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

// Provides control sap.landvisz.LandscapeViewer.
sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/ConnectionEntity",
	"sap/landvisz/Connector",
	"sap/landvisz/internal/Connection",
	"sap/landvisz/internal/NestedRowField",
	"sap/landvisz/internal/SingleDataContainer",
	"sap/landvisz/libs/lvsvg",
	"sap/landvisz/Option",
	"sap/ui/commons/Button",
	"sap/ui/commons/Label",
	"sap/ui/commons/layout/HorizontalLayout",
	"sap/ui/commons/Image",
	"./LandscapeViewerRenderer",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/jqueryui/jquery-ui-core",
	"sap/ui/thirdparty/jqueryui/jquery-ui-widget",
	"sap/ui/thirdparty/jqueryui/jquery-ui-mouse",
	"sap/ui/thirdparty/jqueryui/jquery-ui-draggable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-droppable",
], function(
	landviszLibrary,
	ConnectionEntity,
	Connector,
	Connection,
	NestedRowField,
	SingleDataContainer,
	lvsvg,
	Option,
	Button,
	Label,
	HorizontalLayout,
	Image,
	LandscapeViewerRenderer,
	jQuery
) {
	"use strict";


	// shortcut for sap.landvisz.ConnectionLine
	var ConnectionLine = landviszLibrary.ConnectionLine;

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	// shortcut for sap.landvisz.DependencyType
	var DependencyType = landviszLibrary.DependencyType;

	// shortcut for sap.landvisz.DependencyVisibility
	var DependencyVisibility = landviszLibrary.DependencyVisibility;

	// shortcut for sap.landvisz.OptionType
	var OptionType = landviszLibrary.OptionType;

	// shortcut for sap.landvisz.SelectionViewPosition
	var SelectionViewPosition = landviszLibrary.SelectionViewPosition;

	// shortcut for sap.landvisz.SolutionType
	var SolutionType = landviszLibrary.SolutionType;

	// shortcut for sap.landvisz.ViewType
	var ViewType = landviszLibrary.ViewType;

	/**
	* Constructor for a new LandscapeViewer.
	*
	* @param {string} [sId] id for the new control, generated automatically if no id is given
	* @param {object} [mSettings] initial settings for the new control
	*
	* @class
	* Visualize the landscape objects in a new user experience
	* @extends sap.landvisz.Option
	*
	* @constructor
	* @public
	* @alias sap.landvisz.LandscapeViewer
	* @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	*/
	var LandscapeViewer = sap.landvisz.Option.extend("sap.landvisz.LandscapeViewer", /** @lends sap.landvisz.LandscapeViewer.prototype */ { metadata : {

		library : "sap.landvisz",
		properties : {

			/**
			 * View type of landscape view
			 */
			defaultDependencyView : {type : "sap.landvisz.DependencyType", group : "Identification", defaultValue : DependencyType.NETWORK_VIEW},

			/**
			 * Height of Viewer container
			 */
			height : {type : "int", group : "Dimension", defaultValue : null},

			/**
			 * width of the Viewer container
			 */
			width : {type : "int", group : "Dimension", defaultValue : null},

			/**
			 * Header of the rendered view
			 */
			title : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Label of the network view
			*/
			networkDependencyLabel : {type : "string", group : "Data", defaultValue : 'Network View'},

			/**
			 * Label of box view
			 */
			boxDependencyLabel : {type : "string", group : "Data", defaultValue : 'Box View'},

			/**
			 * Levels information in Box dependency view
			 */
			boxDependencyLevels : {type : "string[]", group : "Data", defaultValue : null},

			/**
			 * Navigator for dependency views
			 */
			showDependencyNavigator : {type : "boolean", group : "Identification", defaultValue : true},

			/**
			 * Dependency View Visibility
			 */
			visibleDependency : {type : "sap.landvisz.DependencyVisibility", group : "Identification", defaultValue : DependencyVisibility.BOTH},

			/**
			 * View type of landscape view
			 */
			viewType : {type : "sap.landvisz.ViewType", group : "Identification", defaultValue : null},

			/**
			 * Text displayed in the dependency view
			 */
			navigationPath : {type : "string", group : "Data", defaultValue : null},

			/**
			 * control has to be added in the container or directly in the window.
			 */
			hasParent : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * positions for selection view entity
			 */
			selectionViewPosition : {type : "sap.landvisz.SelectionViewPosition", group : "Identification", defaultValue : SelectionViewPosition.CENTER},

			/**
			 * close button visibility
			 */
			showClose : {type : "boolean", group : "Identification", defaultValue : true},

			/**
			 * Label for the component view
			 */
			componentViewLabel : {type : "string", group : "Data", defaultValue : 'Component View'},

			/**
			 * Label for deployment view.
			 */
			deploymentViewLabel : {type : "string", group : "Data", defaultValue : 'Deployment View'},

			/**
			 * determines whether the option is rendered on view or entity
			 */
			solutionOptionType : {type : "sap.landvisz.OptionType", group : "Identification", defaultValue : null},

			/**
			 * Type of solution rendered
			 */
			solutionType : {type : "sap.landvisz.SolutionType", group : "Identification", defaultValue : null},

			/**
			 * Deployment type section
			 */
			showDeploymentTypeSection : {type : "boolean", group : "Identification", defaultValue : false},

			/**
			 * Label for the options
			 */
			deploymentOptionsLabel : {type : "string", group : "Data", defaultValue : 'Deployment Options :'},

			/**
			 * tooltip of label for the options
			 */
			deploymentOptionsTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip for component view button
			 */
			componentViewTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip for deployment view button
			 */
			deploymentViewTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * tooltip for close button
			 */
			closeButtonTooltip : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Specify the height of plugged content
			 */
			plugContentHeight : {type : "int", group : "Misc", defaultValue : 0},

			/**
			 * Type of line to be drawn
			 */
			connectionLine : {type : "sap.landvisz.ConnectionLine", group : "Misc", defaultValue : ConnectionLine.Line}
		},
		aggregations : {

			/**
			 * Systems to be rendered in the landscape viewer
			 */
			systems : {type : "sap.landvisz.LandscapeEntity", multiple : true, singularName : "system"},

			/**
			 * Optional: connection Entity between two systems.
			 */
			connectionEntities : {type : "sap.landvisz.ConnectionEntity", multiple : true, singularName : "connectionEntity"},

			/**
			 * connector contains from and to information
			 */
			connectors : {type : "sap.landvisz.Connector", multiple : true, singularName : "connector"},

			/**
			 * Options for the solution
			 */
			solutionOptions : {type : "sap.landvisz.Option", multiple : true, singularName : "solutionOption"},

			/**
			 * a control which can be plugged into this control and can be only plugged in top section.
			 */
			plugContent : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {

			/**
			 * closes the view
			 */
			close : {},

			/**
			 * load the solution view either deployment or component
			 */
			loadSolutionView : {}
		}
	}});







	LandscapeViewer.prototype.init = function() {

			this.initializationDone = false;
			this.windowHeight = 0;
			this.windowWidth = 0;
			this.connection = Connection;
			this.boxModeHeight = 90;
			this.currentView = "";
			this.firstTime = true;

			this.boxLeftMargine = 0;
			this.boxTopMargine = 0;
			this.hasBoxThirdLevel = false;
			this.firstTime = true;
			this.lindkedEntities = [];
			var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");
			this.SHOW_ALL_TEXT = oBundle.getText("SHOW_ALL");
			this.COLLAPSE_TEXT = oBundle.getText("COLLAPSE_EXPLODE_VIEW");
			this.MAXIMIZE_TEXT = oBundle.getText("MAXIMIZE");
			this.RESTORE_TEXT = oBundle.getText("RESTORE");
	//       this.SHOW_NAV_TEXT = oBundle.getText("SHOW_NAVIGATION_PANEL");
	//       this.HIDE_NAV_TEXT = oBundle.getText("HIDE_NAVIGATION_PANEL");
			this.CLOSE = oBundle.getText("CLOSE");
			this.srcEntity = "";
			this.currentViewOptionId = "";
			this.currentSolutionView = "";
			this.selectedOptionEntity = null;

						var win = jQuery(window);
						if (this.getHeight() && "" != this.getHeight()) {
								this.windowHeight = this.getHeight();
						}else{
								this.windowHeight = win.height();
						}
						if (this.getWidth()) {
								this.windowWidth = this.getWidth();
						} else {
								this.windowWidth = win.width();
						}

	};

	LandscapeViewer.prototype.onwindowresize = function(oEvent) {

			var viewer = this.$();
			if (this.getHasParent() == false) {
					var win = jQuery(window);
					var resizeWidth = win.width();
					var resizeHeight = win.height();
					this.windowHeight = resizeHeight;
					this.windowWidth = resizeWidth;
					this.invalidate();

			} else if(viewer && viewer[0] && viewer[0].parentElement ) {
					this.windowWidth = viewer[0].parentElement.clientWidth;
					this.windowHeight = viewer[0].parentElement.clientHeight;
					this.invalidate();
			}
	};

	LandscapeViewer.prototype.onclick = function(oEvent) {

			var systems = this.getSystems();
			var selectedSystem = systems[0];
			var container = this.$("container");
			var selectionView = selectedSystem.$();

			if (this.getViewType() == ViewType.SELECTION_VIEW && oEvent.srcControl.getTooltip() == this.MAXIMIZE_TEXT) {


					if (oEvent.srcControl.getTooltip() == this.SHOW_ALL_TEXT)
						selectedSystem.expVisible = true;

					container.css({
						height : this.entityHeight,
						width : this.entityWidth
					});


					selectedSystem.$("CLVEntityVLayoutContainer")
								.css({
										"display" : "none"
								});
					this._animateMaximizeView(selectedSystem, container);

					setTimeout(function() {
						selectedSystem.$("CLVEntityVLayoutContainer").css(
										{
											"display" : "block"
										});
						selectedSystem.$("CLVEntityVLayoutProperties")
										.css({
											"display" : "block"
										});

					}, 1000);
			}

			if (this.getViewType() == ViewType.SELECTION_VIEW && oEvent.srcControl.getTooltip() == this.RESTORE_TEXT) {
					var expWidth = this.windowWidth - 40;
					var expHeight = this.windowHeight;
					selectedSystem.sViewWidth = expWidth;
					selectedSystem.sViewHeight = expHeight;

					selectedSystem.$("CLVEntityVLayoutContainer")
								.css({
										"display" : "none"
								});
					this._animateRestoreView(selectedSystem, container);

					setTimeout(function() {
						selectedSystem.$("CLVEntityVLayoutContainer").css(
										{
											"display" : "block"
										});
					}, 1000);
			}

			if (oEvent.srcControl.getTooltip() == this.SHOW_ALL_TEXT && selectedSystem.entityMaximized != true)
					this._animateShowAllView(selectedSystem, container,selectionView);

			if (oEvent.srcControl.getTooltip() == this.SHOW_ALL_TEXT && selectedSystem.entityMaximized == true) {
					selectedSystem.sViewWidth = expWidth;
					selectedSystem.sViewHeight = expHeight;
					this._animateSelectionView(container);
			}

			else if (oEvent.srcControl.getTooltip() == this.COLLAPSE_TEXT && this.entityMaximized != true)
					this._animateCollapseView(container);

			else if (oEvent.srcControl instanceof SingleDataContainer && selectedSystem.explodeViewClosed == true)
					this._animateCollapseView(container);
	};

	LandscapeViewer.prototype._animateCollapseView = function(container) {

					var position = this.getSelectionViewPosition();
					if (position == SelectionViewPosition.CENTER) {
						var left = (this.windowWidth - this.entityWidth) / 2;
						var top = (this.windowHeight - this.entityHeight) / 2;
					} else if (position == SelectionViewPosition.LEFT) {
						var left = 20;
						var top = 20;
					} else if (position == SelectionViewPosition.RIGHT) {
						var left = this.windowHeight - this.entityHeight - 20;
						var top = 20;
					}
					container.animate({
						width : this.entityWidth,
						height : this.entityHeight,
						left : left,
						top : top,
					}, 1000);

	};


	LandscapeViewer.prototype._animateSelectionView = function(container) {

						var left;
						var top;
						var position = this.getSelectionViewPosition();
						if (position == SelectionViewPosition.CENTER) {
								left = (this.windowWidth - this.entityWidth) / 2;
								top = (this.windowHeight - this.entityHeight) / 2;
						} else if (position == SelectionViewPosition.LEFT) {
								left = 20;
								top = 20;
						} else if (position == SelectionViewPosition.RIGHT) {
								left = this.windowWidth - this.entityWidth -20;
								top = 20;
						}

						container.animate({
								left : left,
								top : top,
						}, 1000);

	};


	LandscapeViewer.prototype._animateShowAllView = function(selectedSystem, container,selectionView ) {

					var expWidth = this.windowWidth - 12;
					var expHeight = this.windowHeight;
					selectedSystem.sViewWidth = expWidth - this.entityWidth;
					selectedSystem.sViewHeight = expHeight;
					selectedSystem.left = 0;
					selectedSystem.top = 0;
					selectionView.css({
						"position" : "relative"
					});
					container.animate({
						left : 10,
						top : 0,
						width : expWidth,
						height : "100%",
					}, 1000);
					var smv = jQuery(document.getElementById("SMV"));
					setTimeout(function() {
						smv.animate({
								"display" : "block"
						}, 1000);
					}, 1000);

	};


	LandscapeViewer.prototype._animateMaximizeView = function(selectedSystem, container) {

			var expWidth = this.windowWidth - 40;
			var expHeight = this.windowHeight - 66;
			selectedSystem.sViewWidth = expWidth;
			selectedSystem.sViewHeight = expHeight;
			container.animate({
					left : 20,
					top : 20,
					width : expWidth,
					height : expHeight
			},1000);

	};

	LandscapeViewer.prototype._animateRestoreView = function(selectedSystem, container) {

					var expWidth = this.windowWidth - 40;
					var expHeight = this.windowHeight;
					selectedSystem.sViewWidth = expWidth;
					selectedSystem.sViewHeight = expHeight;
					var position = this.getSelectionViewPosition();
					var left;
					var top;
					if (position == SelectionViewPosition.CENTER) {
						left = (this.windowWidth - this.entityWidth) / 2;
						top = (this.windowHeight - this.entityHeight) / 2;
					} else if (position == SelectionViewPosition.LEFT) {
						left = 20;
						top = 20;
					} else if (position == SelectionViewPosition.RIGHT) {
						left = this.windowHeight - this.entityHeight -20;
						top = 20;
					}

					container.animate({
						left : left,
						top : top,
						width : this.entityWidth,
						height : this.entityHeight
					}, 1000);


	};

	LandscapeViewer.prototype.resetView = function(system, action) {

			var container = this.$("container");
			if (system.entityMaximized == true) {

					system.entityMaximized = false;
					setTimeout(function() {
						system.invalidate();
					}, 1000);

					var expWidth = this.windowWidth - 40;
					var expHeight = this.windowHeight;
					system.sViewWidth = expWidth;
					system.sViewHeight = expHeight;
					var position = this.getSelectionViewPosition();
					var left;
					var top;
					if (position == SelectionViewPosition.CENTER) {
						left = (this.windowWidth - this.entityWidth) / 2;
						top = (this.windowHeight - this.entityHeight) / 2;
					} else if (position == SelectionViewPosition.LEFT) {
						left = 20;
						top = 20;
					} else if (position == SelectionViewPosition.RIGHT) {
						left = this.windowHeight - this.entityHeight - 20;
						top = 20;
					}

					system.$("CLVEntityVLayoutProperties").css({
						"display" : "none"
					});
					container.animate({
						left : left,
						top : top,
						width : this.entityWidth,
						height : this.entityHeight
					}, 1000);

					setTimeout(function() {
						system.$("CLVEntityVLayoutProperties")
										.css({
											"display" : "block"
										});
					}, 1000);

					setTimeout(function() {
						action.$().click();

					}, 1000);

			} else if (system.expVisible == true) {

					system.entityMaximized = false;
					system.expVisible = false;
					system.oHLayoutMiniNavigation.$().css("display", "block");
					system.showMiniNavigation = true;

					var header;
					var headers = system.getDataContainers();
					var backup;
					for ( var i = 0; i < system.dialogArray.length; i++) {
						header = system.dialogArray[i];
						backup = header.getProperties();
						if (backup && backup.length && backup.length > 0) {
								for ( var j = 0; j < backup.length; j++) {
										headers[i].addAggregation("properties", backup[j], false);
								}
						}
					}

					for ( var i = 0; i < headers.length; i++) {
						if (i != system.selectedIndex) {
								headers[i].visible = true;
						}
					}
					system.nextIcon.setVisible(true);
					system.previousIcon.setVisible(true);
					jQuery(document.getElementById("SMV")).hide(700);
					system.invalidate();

					var left;
					var top;
					var position = this.getSelectionViewPosition();
					if (position == SelectionViewPosition.CENTER) {
						left = (this.windowWidth - this.entityWidth) / 2;
						top = (this.windowHeight - this.entityHeight) / 2;
					} else if (position == SelectionViewPosition.LEFT) {
						left = 20;
						top = 20;
					} else if (position == SelectionViewPosition.RIGHT) {
						left = this.windowHeight - this.entityHeight - 20;
						top = 20;
					}

					container.animate({
						left : left,
						top : top,
					}, 1000);

					setTimeout(function() {
						action.$().click();
					}, 1000);

			} else
					action.$().click();

	};

	LandscapeViewer.prototype.initControls = function() {

			var id = this.getId();
			if (!this.oHLayoutConnectionEntity)
					this.oHLayoutConnectionEntity = new HorizontalLayout(
								id + "viewerConnectionEntityHLayout");

			if (!this.oHLayoutOptions)
					this.oHLayoutOptions = new HorizontalLayout(id
								+ "viewerHLayoutOptions");
			this.entityWidth;
			this.entityHeight;

			this.networkViewVisible = false;
			this.boxViewVisible = false;
			if (!this.boxViewLabel)
					this.boxViewLabel = new Label(id + "-viewBoxLabel");
			if (!this.boxViewImg)
					this.boxViewImg = new Image(id + "-viewBoxImg");
			if (!this.networkViewLabel)
					this.networkViewLabel = new Label(id
								+ "-viewNetworkLabel");
			if (!this.closeImg)
					this.closeImg = new Image(id + "-closeImg");

			if (!this.networkViewBtn)
					this.networkViewBtn = new Button(id + "-viewNetworkBtn")
								.addStyleClass("sapLandviszImg");
			if (!this.boxViewBtn)
					this.boxViewBtn = new Button(id + "-viewBoxBtn")
								.addStyleClass("sapLandviszImg");

			if (!this.compViewBtn)
					this.compViewBtn = new Button(id + "-viewComponentBtn")
								.addStyleClass("sapLandviszImg");
			if (!this.depViewBtn)
					this.depViewBtn = new Button(id + "-viewDeployBtn")
								.addStyleClass("sapLandviszImg");

			if (!this.navigationPathLabel)
					this.navigationPathLabel = new Label(id
								+ "navigationPathLabel");
			if (!this.deploymentOptionLabel)
					this.deploymentOptionLabel = new Label(id
								+ "deploymentOptionLabel");

			var size = this.getSystems()[0].getRenderingSize();

			if (size == EntityCSSSize.Small) {
				this.entityWidth = Math.round(22.7 * 12);
				this.entityHeight = Math.round(15.8 * 12);
			}
			if (size == EntityCSSSize.RegularSmall) {
				this.entityWidth = Math.round(33.7 * 12);
				this.entityHeight = Math.round(22.3 * 12);
			}
			if (size == EntityCSSSize.Regular) {
				this.entityWidth = Math.round(38.7 * 12);
				this.entityHeight = Math.round(24.5 * 12);
			}
			if (size == EntityCSSSize.Medium) {
				this.entityWidth = Math.round(43.5 * 12);
				this.entityHeight = Math.round(28 * 12);
			}
			if (size == EntityCSSSize.Large) {

				this.entityWidth = Math.round(64.5 * 12);
				this.entityHeight = Math.round(41.5 * 12);

			}

			this.visibleEntities = [];
			this.depTypeOptions = new Object();

	};

	/**
	 * Append the text in the navigation path
	 *
	 * @param {string} navigationText
	 *         text to be appended in the navigation path
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	LandscapeViewer.prototype.appendNavigationPath = function(
					navigationText) {

			var fullText = this.navigationPathLabel.getText() + "-->" + navigationText;
			this.setNavigationPath(fullText);
			this.navigationPathLabel.setText(fullText);

	};

	LandscapeViewer.prototype.onAfterRendering = function() {

			jQuery(window).unbind("resize", jQuery.proxy(this.onwindowresize, this));
			// Register for window resize event during the viewer is rendered.
			jQuery(window).bind("resize", jQuery.proxy(this.onwindowresize, this));

	if (this.getViewType() == ViewType.SOLUTION_VIEW) {

					var innerContainer = this.$("solutionInnerContainer");
					var entity;
					var entityID;
					var leftPos;
					var topPos;
					var margin = 5;

					this.innerLeftMargine = innerContainer[0].offsetLeft;
					this.innerTopMargine = innerContainer[0].offsetTop;

					var systems = this.getSystems();
					var entity;
					var entityLeft;
					var entityTop;
					var totalLeft;
					var totalTop;
					for (var i = 0; i < systems.length; i++) {
						entity = systems[i].$();
						entityLeft = systems[i].left;
						entityTop = systems[i].top;
						totalLeft = entityLeft + this.innerLeftMargine;
						totalTop = entityTop + this.innerTopMargine;
						systems[i].left = totalLeft;
						systems[i].top = totalTop;
						entity.css({
								left : totalLeft,
								top : totalTop
						});
					}

					var connectionEntities = this.getConnectionEntities();
					var deploymentOptionsTop = 0;
					for ( var i = 0; i < connectionEntities.length; i++) {
						entity = connectionEntities[i].$();
						entityLeft = connectionEntities[i].left;
						entityTop = connectionEntities[i].top;
						totalLeft = entityLeft + this.innerLeftMargine;
						totalTop = entityTop + this.innerTopMargine;
						deploymentOptionsTop = connectionEntities[i].top ;
						connectionEntities[i].left = totalLeft;
						connectionEntities[i].top = totalTop;

						entity.css({
								left : totalLeft,
								top : totalTop
						});

						var conLbl =  connectionEntities[i].$("connectionLabel");
						var conLblWidth = connectionEntities[i].width - 68;
						conLbl.css({
								"max-width" : conLblWidth,
						});
					}
				if (this.getSolutionType() == SolutionType.DEPLOYMENT_VIEW) {

				var depContainer = this.$("deploymentTypeContainer");
				var boxWidth = innerContainer[0].offsetWidth;
				var depContainerTop = this.entityHeight + 90 + 10;

				depContainer.css({
					left : this.innerLeftMargine,
					top : depContainerTop,
					width : boxWidth
				});

				if (null != this.selectedOptionEntity) {
					var selectedDepTypes = this.depTypeOptions[this.selectedOptionEntity
							.getId()];
						if (this.getShowDeploymentTypeSection() == true
							&& selectedDepTypes.length <= 0) {

							var changedHeight = innerContainer[0].offsetHeight - 40;

							innerContainer.css({
							height : changedHeight
							});
						}
					}
				}
					if (this.getSolutionOptionType() == OptionType.ENTITY) {

						var optionContainer = this.$("optionContainer");
						var boxWidth = innerContainer[0].offsetWidth - 10;
						var optionContainerTop = this.entityHeight + 90 + 10 + 5;
						if (this.getSolutionType() == SolutionType.DEPLOYMENT_VIEW) {
								optionContainerTop = deploymentOptionsTop;
						}
						if (this.getShowDeploymentTypeSection() == true)
								optionContainerTop = optionContainerTop + 40;

						optionContainer.css({
								left : this.innerLeftMargine + 5,
								top : optionContainerTop,
								width : boxWidth
						});
					}

					if (this.getSolutionType() == SolutionType.COMPONENT_VIEW) {

						this.compViewBtn.addStyleClass("selectedView");

						this.depViewBtn.removeStyleClass("selectedView");

					}else if (this.getSolutionType() == SolutionType.DEPLOYMENT_VIEW) {

						this.depViewBtn.addStyleClass("selectedView");

						this.compViewBtn.removeStyleClass("selectedView");
					}
			}

			else if (this.getViewType() == ViewType.SELECTION_VIEW) {

					var enitityContainer = this.$("container");
					var systems = this.getSystems();
					var selectedSystem = systems[0];
					var selectionView = systems[0].$();

					if (systems[0].entityMaximized == true)

						this._animateMaximizeView(selectedSystem,enitityContainer);
					else if (systems[0].expVisible == true) {

						var expWidth = this.windowWidth - 12;
						var expHeight = this.windowHeight;
						selectedSystem.sViewWidth = expWidth - this.entityWidth;
						selectedSystem.sViewHeight = expHeight;
						selectionView.css({
								"position" : "relative"
						});
						enitityContainer.css({
								left : 10,
								top : 0,
								width : expWidth,
								height : "100%",
						});
						var smv = jQuery(document.getElementById("SMV"));
						setTimeout(function() {
								smv.css({
									"display" : "block"
								}, 1000);
						}, 1000);
			//this._animateShowAllView(selectedSystem, enitityContainer,selectionView );
					}

					else
					this._animateSelectionView(enitityContainer);

			}
			else if (this.getViewType() == ViewType.DEPENDENCY_VIEW && this.currentView == DependencyType.NETWORK_VIEW) {
					var boxContainer = this.$("boxViewContainer");

					this.boxLeftMargine = boxContainer[0].offsetLeft;
					this.boxTopMargine = boxContainer[0].offsetTop;
					boxContainer.css("display", "none");

					var boxLevels = this.getBoxDependencyLevels();
					if (boxLevels) {
						for ( var i = 0; i < boxLevels.length; i++) {
								var boxLabel = this.$("boxViewLabel" + i);
								boxLabel.css("display", "none");
						}
					}
					var viewer = this.$("viewContainer");
					var svgWidth = viewer[0].scrollWidth - 10;
					var svgHeight = viewer[0].scrollHeight - 10;

					this.svgForConnections = lvsvg.getSVG(svgWidth,
								svgHeight, this.getId() + "-viewContainer");
					this.connection = Connection;
					this.connection.svgForConnections = this.svgForConnections;
					this.connection.renderConnections(this.getSystems(), this
								.getConnectionEntities(), this.getConnectionLine());

			} else if (this.getViewType() == ViewType.DEPENDENCY_VIEW && this.currentView == DependencyType.BOX_VIEW) {

					var boxContainer = this.$("boxViewContainer");
					var entity;
					var entityID;
					var leftPos;
					var topPos;
					var margin = 5;

					this.boxLeftMargine = boxContainer[0].offsetLeft;
					this.boxTopMargine = boxContainer[0].offsetTop;

					var levelHeaderWidth = 30;
					var levelHeaderHeight = this.entityHeight;

					var systems = this.getSystems();
					var entity;
					var entityLeft;
					var entityTop;
					var totalLeft;
					var totalTop;
					for ( var i = 0; i < systems.length; i++) {
						entity = systems[i].$();
						entityLeft = systems[i].left;
						entityTop = systems[i].top;
						totalLeft = entityLeft + this.boxLeftMargine;
						totalTop = entityTop + this.boxTopMargine;
						systems[i].left = totalLeft;
						systems[i].top = totalTop;
						entity.css({
								left : totalLeft,
								top : totalTop
						});
					}

					var connectionEntities = this.getConnectionEntities();

					for ( var i = 0; i < connectionEntities.length; i++) {
						entity = connectionEntities[i].$();
						entityLeft = connectionEntities[i].left;
						entityTop = connectionEntities[i].top;
						totalLeft = entityLeft + this.boxLeftMargine;
						totalTop = entityTop + this.boxTopMargine;
						connectionEntities[i].left = totalLeft;
						connectionEntities[i].top = totalTop;
						entity.css({
								left : totalLeft,
								top : totalTop
						});
					}

					var levelHeaderLeft = this.boxLeftMargine + margin;
					var levelHeaderTop = this.boxModeHeight + (margin * 2)
								+ this.boxTopMargine;
					var boxLevels = this.getBoxDependencyLevels();
					var boxViewFirstLabel = "Systems";
					var boxViewFirstLabelTooltip = "Systems";
					var that = this;
					if (boxLevels) {
						setTimeout(function() {
								for ( var i = 0; i < boxLevels.length; i++) {

										if (that.hasBoxThirdLevel == true) {

											var boxLabel = that.$("boxViewLabel" + i);
											levelHeaderTop += ((that.entityHeight + margin) * i);

											boxLabel.css({
													left : levelHeaderLeft,
													top : levelHeaderTop,
													width : levelHeaderWidth,
													height : levelHeaderHeight,
													display : "block"
											});

											var boxLavelLabel = that.$("boxViewLabel" + i + "Level");
											boxLavelLabel.css({
													width : levelHeaderHeight,
													height : levelHeaderHeight,
											});
										}
								}
						}, 1000);
					}
			}

			if (this.getViewType() == ViewType.DEPENDENCY_VIEW
						&& this.currentView == DependencyType.NETWORK_VIEW) {

					this.networkViewBtn.addStyleClass("selectedView");

					this.boxViewBtn.removeStyleClass("selectedView");
			}

			if (this.getViewType() == ViewType.DEPENDENCY_VIEW
						&& this.currentView == DependencyType.BOX_VIEW) {

				this.boxViewBtn.addStyleClass("selectedView");

				this.networkViewBtn.removeStyleClass("selectedView");
			}

			if (this.getViewType() == ViewType.DEPENDENCY_VIEW) {
			var version = jQuery.ui ? jQuery.ui.version || "pre 1.6"
								: 'jQuery-UI not detected';

					// }

					var enitityContainer = this.$("viewContainer");
					var navigationContainer = this.$("navigation");
					var that = this;

					var enitityContainer = this.$("viewContainer");
					var frameScrollHeight = Number(enitityContainer[0].scrollHeight);
					var frameScrollWidth = Number(enitityContainer[0].scrollWidth);
					var frameHeight = Number(enitityContainer.height());
					var frameWidth = Number(enitityContainer.width());

					if ((frameScrollWidth > frameWidth)
								|| (frameScrollHeight > frameHeight)) {
							if (navigationContainer.css('display') == 'none') {
								navigationContainer.show(0);
								that.getVisibleRegion(0);
								navigationContainer.hide(0);
							} else {
								that.getVisibleRegion(0);
							}
					} else
							navigationContainer.hide(0);

					var navigator = this.$("navigation_navigator");
					var that = this;
					navigator.bind('drag', function(event) {
							that.calculateNavigationMovement(enitityContainer, navigator);
					});
					navigator.draggable({
							containment : navigationContainer
					});

					var navigatorArrowdown = this.$("navigation_header_arrowdown");
					var navigatorArrowup = this.$("navigation_header_arrowup");
					navigatorArrowdown.show();

					navigatorArrowdown.click(function(e) {
							navigationContainer.animate({
								height : '0px'
							}, 1000, "swing", function(e) {
								navigator.hide();
							});
							navigatorArrowdown.hide();
							navigatorArrowup.show();
							e.stopPropagation();
					});

					navigatorArrowup.click(function(e) {
							navigationContainer.animate({
								height : '29%'
							}, 1000, "swing");
							navigatorArrowup.hide();
							navigatorArrowdown.show();
							navigator.show();
							e.stopPropagation();
					});

					navigationContainer.bind('drag');
					navigationContainer.draggable({
							cancel : "div.navigationHeader",
							containment : enitityContainer
					});
			}

	};

	LandscapeViewer.prototype.calculateNavigationMovement = function(
					mainContainer, navigator) {
			var heightRatio = mainContainer.height() / navigator.height();
			var widthRatio = mainContainer.width() / navigator.width();

			mainContainer
						.scrollTop((navigator.css('top').split('px')[0]) * heightRatio);
			mainContainer.scrollLeft((navigator.css('left').split('px')[0])
						* widthRatio);
			var connectionEntities = this.getConnectionEntities();
			for ( var i = 0; i < connectionEntities.length; i++) {
					if (this.getVisibleDependency() == DependencyVisibility.BOTH
								&& this.currentView == DependencyType.NETWORK_VIEW) {
						if (connectionEntities[i].toolPopup.isOpen())
								connectionEntities[i].toolPopup.close();
					}
			}
	}

	LandscapeViewer.prototype.getVisibleRegion = function() {

			var entityContainer = this.$("viewContainer");
			var navigationContainer = this.$("navigation");
			var navigator = this.$("navigation_navigator");
			navigationContainer.css({
					height : '29%'
			});
			setTimeout(function() {
					lvsvg.convertHtmltoCanvas(entityContainer,
								navigationContainer);
			}, 1000);
			navigationContainer.hide();

			setTimeout(function() {
					navigationContainer.show("slow");
					navigationContainer.animate({
						height : '29%'
					}, 100, "swing", function(e) {
						navigator.show("slow");
					});

					var frameScrollHeight = Number(entityContainer[0].scrollHeight);
					var frameScrollWidth = Number(entityContainer[0].scrollWidth);
					var frameHeight = Number(entityContainer.height());
					var frameWidth = Number(entityContainer.width());
					var heightRatio = frameHeight / frameScrollHeight;
					var widthRatio = frameWidth / frameScrollWidth;

					setTimeout(function() {

						var navHeight = Number(navigationContainer[0].scrollHeight);
						var navWidth = Number(navigationContainer[0].scrollWidth);
						navigator.height(navHeight * heightRatio);
						navigator.width(navWidth * widthRatio);

						navigator.show();
						navigator.css({
								left : 0,
								top : 0
						});

					}, 1500);

			}, 1000);
	};

	LandscapeViewer.prototype.onmouseenter = function(oEvent) {
			var srcCntrl = oEvent.oSource;
			var srcElement = oEvent.target;
			var connectors;
			var systems;
			var hasMatchingHeader = false;
			var holdDisplayTrue = false;
			var holdCount = 0;
			for(var i = 0 ; i < this.getConnectionEntities().length ; i++){
					if(this.getConnectionEntities()[i].holdDisplay == true){
						holdDisplayTrue = true;
						holdCount++;
					}
			}
			if((!holdDisplayTrue) || (holdCount > 1)){
			if (srcCntrl instanceof ConnectionEntity) {

					this.lindkedEntities = [];
					var connectionEntities = this.getConnectionEntities();
					for ( var i = 0; i < connectionEntities.length; i++) {

								if (srcCntrl.getId() != connectionEntities[i].getId()) {
								jQuery(document.getElementById(connectionEntities[i].getId() + "connectionRow"))
											.css({
													"box-shadow" : "none"
											});
								connectionEntities[i].holdDisplay = false;
								connectionEntities[i].toolPopup.close();
						} else {
								jQuery(document.getElementById(connectionEntities[i].getId() + "connectionRow"))
											.css({
													"box-shadow" : "rgb(0, 0, 0) 0px 0px 20px"
											});
						}
					}
					connectors = this.getConnectors();
					for ( var i = 0; i < connectors.length; i++) {
						if (connectors[i].getSource() == srcCntrl.getConnectionId())
								this.lindkedEntities.push(connectors[i].getTarget());
						if (connectors[i].getTarget() == srcCntrl.getConnectionId())
								this.lindkedEntities.push(connectors[i].getSource());
					}

					systems = this.getSystems();
					var isLinkedSystem;
					var header;
					for ( var i = 0; i < systems.length; i++) {
						isLinkedSystem = false;

						for ( var j = 0; j < this.lindkedEntities.length; j++) {

								if (systems[i].getSystemId() == this.lindkedEntities[j]) {
										isLinkedSystem = true;
										if (srcCntrl.getLinkedHeader()
													&& "" != srcCntrl.getLinkedHeader()) {
											hasMatchingHeader = false;
											for ( var k = 0; k < systems[i].propertyHeaders.length; k++) {
													header = systems[i].propertyHeaders[k];
													if (srcCntrl.getLinkedHeader() == header
																.getHeader()) {
															if (header.getSelected() != true) {
																header.setSelected(true);
																systems[i].selectedIndex = k;
																hasMatchingHeader = true;
															} else {
																systems[i].selectedIndex = k;

																this.filterOverlay(systems[i], srcCntrl
																				.getLinkId())

																systems[i].$("innerOverlay").css({
																		"display" : "block"
																});
																systems[i].$("overlay")
																				.css({
																					"display" : "block"
																				});

															}
													} else
															systems[i].propertyHeaders[k]
																		.setSelected(false);

													// innerOverlay
													// systems[i].invalidate();
													systems[i].showOverlay = false;
													systems[i].overlayFilter = "";

											}

											if (hasMatchingHeader == true
															&& systems[i].showOverlay == false) {
													systems[i].showOverlay = true;
													systems[i].overlayFilter = srcCntrl.getLinkId();
													systems[i].invalidate();

											}
										}
								}

						}

						if (isLinkedSystem == false) {
								if (systems[i].showOverlay == true)
										systems[i].invalidate();
								else {
										systems[i].$("innerOverlay").css({
											"display" : "none"
										});
										systems[i].$("overlay").css({
											"display" : "none"
										});
								}
								systems[i].showOverlay = false;
								systems[i].overlayFilter = "";

						}

					}
			}
	}
	};

	LandscapeViewer.prototype.filterOverlay = function(system, filter) {

			var headerContent = system.oVLayoutOverlay.getContent();
			var row;
			var linearRows;
			for ( var j = 0; j < headerContent.length; j++) {
					row = headerContent[j];
					if (row instanceof NestedRowField) {

						linearRows = row.getLinearRows();
						for ( var k = 0; k < linearRows.length; k++) {

								if (filter == linearRows[k].getLinkSource()) {
										row.$().css({
											display : "block",
										});
										linearRows[k].$().css({
											display : "block",
										});
								} else {

										row.$().css({
											display : "none",
										});
										linearRows[k].$().css({
											display : "none",
										});
								}

						}
					} else {
						if (filter == row.getLinkSource()) {
								row.$().css({
										display : "block",
								});
						} else {
								row.$().css({
										display : "none",
								});
						}
					}
			}
	};

	LandscapeViewer.prototype.showAllOverlay = function(system, filter) {

			var headerContent = system.oVLayoutOverlay.getContent();
			var row;
			for ( var j = 0; j < headerContent.length; j++) {
					row = headerContent[j];
					row.$().css({
						display : "block",
					});
			}
	};

	LandscapeViewer.prototype.showOverlay = function(id,
					overlayDisplay) {

			jQuery(document.getElementById(id + "-overlay")).css({
					display : overlayDisplay,
			});

			jQuery(document.getElementById(id + "-innerOverlay")).css({
					display : overlayDisplay,
			});

	};

	LandscapeViewer.prototype.onmouseleave = function(oEvent) {
			var srcCntrl = oEvent.oSource;
			var srcElement = oEvent.target;
			this.lindkedEntities = [];
			var connectors;
			var systems;
			var hasMatchingHeader = false;
			var holdDisplayTrue = false;
			var holdCount = 0;
			for(var i = 0 ; i < this.getConnectionEntities().length ; i++){
					if(this.getConnectionEntities()[i].holdDisplay == true){
						holdDisplayTrue = true;
						holdCount++;
					}
			}
			if(!(holdDisplayTrue && holdCount < 2)){
					if (srcCntrl instanceof ConnectionEntity) {

						if (srcCntrl.holdDisplay != true) {

								jQuery(document.getElementById(srcCntrl.getId() + "connectionRow")).css({
										"box-shadow" : "none"
								});

								connectors = this.getConnectors();

								for ( var i = 0; i < connectors.length; i++) {
										if (connectors[i].getSource() == srcCntrl.getConnectionId())
											this.lindkedEntities.push(connectors[i].getTarget());
										if (connectors[i].getTarget() == srcCntrl.getConnectionId())
											this.lindkedEntities.push(connectors[i].getSource());
								}

								systems = this.getSystems();
								for ( var i = 0; i < systems.length; i++) {

										for ( var j = 0; j < this.lindkedEntities.length; j++) {

											if (systems[i].getSystemId() == this.lindkedEntities[j]) {
													systems[i].$("innerOverlay")
																.css({
																		"display" : "none"
																});
													systems[i].$("overlay").css({
															"display" : "none"
													});

													// innerOverlay
													// systems[i].invalidate();
													systems[i].showOverlay = false;
													systems[i].overlayFilter = "";
											}
										}

								}
						}
					}
	}
	};

	/**
	 * return the current solution loaded.
	 *
	 * @type string
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	LandscapeViewer.prototype.getCurrentSolutionView = function() {
			return this.currentSolutionView;
	};

	LandscapeViewer.prototype.getCurrentDependencyView = function() {
			return this.currentView;
	};

	LandscapeViewer.prototype.setEnableLoadSolution = function(enabled) {

			if (enabled == false) {
					this.compViewBtn.addStyleClass("sapLandviszBtnDisable");
					this.depViewBtn.addStyleClass("sapLandviszBtnDisable");

			} else if (enabled == true) {
					this.compViewBtn.removeStyleClass("sapLandviszBtnDisable");
					this.depViewBtn.removeStyleClass("sapLandviszBtnDisable");
			}
			this.compViewBtn.setEnabled(enabled);
			this.depViewBtn.setEnabled(enabled);
	};

	/**
	 * returns an object of the internal connection entity
	 *
	 * @type object
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	LandscapeViewer.prototype.getSelectedOption = function() {
			return this.selectedOptionEntity;
	};

	LandscapeViewer.prototype.onfocusout = function(oEvent) {
			this.compViewBtn
	};

	LandscapeViewer.prototype.fetchSelectedOption = function() {
			return this.selectedOptionEntity;
	};
	LandscapeViewer.prototype.exit = function() {
			jQuery(window).unbind("resize", jQuery.proxy(this.onwindowresize, this));
	};

	LandscapeViewer.prototype.getViewConnectedLayout = function() {

			var connectedLayout;
			var sources;
			var optionsEntities;
			var sources;
			var connectors = this.getConnectors();
			optionsEntities = this.oHLayoutOptions.getContent();
			for ( var y = 1; y < optionsEntities.length; y++) {
				if (optionsEntities[y].getSelected() == true) {
					sources = optionsEntities[y].getOptionSources();
					break;

				}
			}
			// we are taking a tradeoff that there is only one connection entity for
			// the
			// Solution view & the same is declared as source for the connector

			var connectionEntityId = connectors[0].getSource();
			var connectorArray = [];
			var connector;
			var entityTobePlaced;
			for ( var i = 0; i < sources.length; i++) {
					connector = new Connector();
					entityTobePlaced = sources[i].getSource();
					connector.setSource(connectionEntityId);
					connector.setTarget(entityTobePlaced);
					connectorArray.push(connector);
			}

			connectedLayout = this.connection
						.getBoxViewConnectedNodesLayout(connectorArray);

			return connectedLayout;
	};


	LandscapeViewer.prototype.getEntityConnectedLayout = function() {


		var connectedLayout;
		var optionsEntities;
		var connectors = this.getConnectors();
		var option;
		var connectorArray = [];
		for ( var i = 0; i < connectors.length; i++) {

			option = this.getOptionConnector(connectors[i]);
			if ("" !== option)
				connectorArray.push(option);
			else
				connectorArray.push(connectors[i]);
		}


			connectedLayout = this.connection
						.getBoxViewConnectedNodesLayout(connectorArray);

			return connectedLayout;

	};


	LandscapeViewer.prototype.getOptionConnector = function(connector) {

		var options = this.getSolutionOptions();
		var optionsEntities;
		var sources;
		var entityConnector;
		var optionSrcEntity;
		for ( var x = 0; x < options.length; x++) {

			if (options[x].getCurrentEntity() == connector.getTarget()) {

				optionsEntities = options[x].getOptionEntities();

				for ( var y = 0; y < optionsEntities.length; y++) {

					optionSrcEntity = optionsEntities[y].getOptionSources()[0].getSource();

					if (optionsEntities[y].getSelected() == true && optionSrcEntity != connector.getTarget()) {
						entityConnector = new Connector();
						entityConnector.setSource(connector.getSource());
						optionsEntities[y].getOptionSources()[0].getSource()
						entityConnector.setTarget(optionsEntities[y].getOptionSources()[0].getSource());
						this.srcEntity = optionSrcEntity;
						return entityConnector;

					}
				}

			}
		}

		return "";
	};

	LandscapeViewer.prototype.setHeight = function(height) {

				var win = jQuery(window);
						if (height && "" != height)
								this.windowHeight = height;
						else
								this.windowHeight = win.height();
	};
	LandscapeViewer.prototype.setWidth = function(width) {
					var win = jQuery(window);
					if (width && "" != width) {
								this.windowWidth = width;
						} else {
								this.windowWidth = win.width();
						}
	};

	return LandscapeViewer;

});
