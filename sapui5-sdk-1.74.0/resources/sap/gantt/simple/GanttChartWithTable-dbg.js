/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library",
	"jquery.sap.global",
	"sap/ui/core/Control",
	"sap/ui/model/ChangeReason",
	"sap/base/util/values",
	"sap/ui/layout/Splitter",
	"sap/ui/core/ResizeHandler",
	"./InnerGanttChart",
	"./GanttHeader",
	"./GanttSyncedControl",
	"../control/AssociateContainer",
	"../axistime/ProportionZoomStrategy",
	"./SelectionModel",
	"./ExpandModel",
	"./ShapeScheme",
	"./GanttExtension",
	"./GanttScrollExtension",
	"./GanttZoomExtension",
	"./GanttPointerExtension",
	"./GanttDragDropExtension",
	"./GanttPopoverExtension",
	"./GanttConnectExtension",
	"./GanttResizeExtension",
	"./RenderUtils",
	"../misc/Format",
	"../misc/Utility",
	"../config/TimeHorizon",
	"./GanttChartWithTableRenderer"
],
	function (
		library,
		jQuery,
		Control,
		ChangeReason,
		values,
		Splitter,
		ResizeHandler,
		InnerGanttChart,
		GanttHeader,
		GanttSyncedControl,
		AssociateContainer,
		ProportionZoomStrategy,
		SelectionModel,
		ExpandModel,
		ShapeScheme,
		GanttExtension,
		GanttScrollExtension,
		GanttZoomExtension,
		GanttPointerExtension,
		GanttDragDropExtension,
		GanttPopoverExtension,
		GanttConnectExtension,
		GanttResizeExtension,
		RenderUtils,
		Format,
		Utility,
		TimeHorizon
	) {
	"use strict";

	var GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType,
		VisibleHorizonUpdateType = library.simple.VisibleHorizonUpdateType;

	var VISIBLE_HORIZON_UPDATE_TYPE_MAP = Object.freeze({
		"totalHorizonUpdated": VisibleHorizonUpdateType.TotalHorizonUpdated,
		"mouseWheelZoom": VisibleHorizonUpdateType.MouseWheelZoom,
		"syncVisibleHorizon": VisibleHorizonUpdateType.SyncVisibleHorizon,
		"initialRender": VisibleHorizonUpdateType.InitialRender,
		"horizontalScroll": VisibleHorizonUpdateType.HorizontalScroll,
		"zoomLevelChanged": VisibleHorizonUpdateType.ZoomLevelChanged,
		"timePeriodZooming": VisibleHorizonUpdateType.TimePeriodZooming
	});

	var MARGIN_OF_ERROR = 10;
	var MIN_AREA_WIDTH = 60;

	function add(a, b) {
		return a + b;
	}

	function almostEqual(a, b) {
		return Math.abs(a - b) < MARGIN_OF_ERROR;
	}

	/**
	 * Creates and initializes a new Gantt Chart
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * The Gantt Chart control provides a comprehensive set of features to display hierarchical data and a visulized shapes together.
	 * It's designed to fully support OData binding, declaring hierarchical data and shapes bindings in XML view.
	 * It's the recommented control for new applications.
	 *
	 * @extend sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 * @since 1.60
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.GanttChartWithTable
	 */
	var GanttChartWithTable = Control.extend("sap.gantt.simple.GanttChartWithTable", /** @lends sap.ui.core.Control.prototype */ {
		metadata: {
			properties: {

				/**
				 * Width of the control.
				 */
				width: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Height of the control.
				 */
				height: {type: "sap.ui.core.CSSSize", defaultValue: "100%"},

				/**
				 * Shape selection mode of the Gantt Chart. This property controls whether single or multiple shapes can be selected.
				 * When the selection mode is changed, the current selection is removed.
				 *
				 * The shapeSelectionMode only works if <code>selectable</code> property on the defined Shape is set to true.
				 */
				shapeSelectionMode: {type : "sap.gantt.SelectionMode", defaultValue : library.SelectionMode.MultiWithKeyboard},

				/**
				 * A JSON object containing the shapeSelectionSettings which will be used to configure shape selection
				 * styles. If nothing is specified, then the default selection styles (2px dashed red border) is set.
				 *
				 * <i>Below you can find a brief example</i>
				 * <pre><code>
				 * {
				 *    color: "#808080",
				 *    strokeWidth: 2,
				 *    strokeDasharray: "5,1"
				 * }
				 * </code></pre>
				 */
				shapeSelectionSettings: {type: "object", defaultValue: null},

				/**
				 * Flag whether to show or hide the cursor line when moving your mouse cursor
				 */
				enableCursorLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag whether to show or hide the present time indicator.
				 */
				enableNowLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag whether to show the <code>nowLine</code> in UTC or in local time.
				 *
				 * @since 1.68
				 */
				nowLineInUTC: {type: "boolean", defaultValue: true},

				/**
				 * Flag to show or hide vertical lines representing intervals along the time axis
				 */
				enableVerticalLine: {type: "boolean", defaultValue: true},

				/**
				 * Flag to show or hide adhoc lines representing milestones and events along the time axis
				 */
				enableAdhocLine: {type: "boolean", defaultValue: true},

				/**
				 * Specifies on which layer adhoc lines reside. By default, adhoc lines are on top of all other shapes and patterns.
				 */
				adhocLineLayer: {type: "string", defaultValue: library.AdhocLineLayer.Top},

				/**
				 * Drag orientation of Gantt Chart.
				 *
				 * This property doesn't limit the mouse cursor position but the dragging ghost position when dragging it around. This property has 3 values:
				 * <ul>
				 *   <li>Free: The dragging ghost moves along with your mouse cursor.</li>
				 *   <li>Horizontal: The dragged ghost only moves horizontally, cross row dragging is restricted. You can use this mode if you only need to change the times of the dragging shape</li>
				 *   <li>Vertical: <em>Notice</em> Vertical works if only one shape is selected (regardless shapeSelectionMode), it's showing forbidden cursor style on multiple shape selections when you are dragging.
				 *       You can use this vertical mode if you only want to change the assignment without changing shape times.</li>
				 * </ul>
				 */
				dragOrientation: {type: "sap.gantt.DragOrientation", defaultValue: library.DragOrientation.Free},

				/**
				 * The dragging ghost alignment of Gantt Chart. This property define the visual effect of ghost position on dragging, it also effect the parameter value
				 * in event <code>shapeDragEnd<code>
				 *
				 * @see {sap.gantt.dragdrop.GhostAlignment}
				 */
				ghostAlignment: {type: "string", defaultValue: library.dragdrop.GhostAlignment.None},

				/**
				 * Flag to show or hide the start time and end time of a shape when you drag it along the time line
				 */
				showShapeTimeOnDrag: {type: "boolean", defaultValue: false},

				/**
				 * The width of selection panel.
				 *
				 * In <code>sap.gantt.simple.GanttChartWithTable</code>, the selectionPanelSize is the Table/TreeTable width in
				 * the embedded Splitter.
				 */
				selectionPanelSize: {type: "sap.ui.core.CSSSize", defaultValue: "30%"},

				/**
				 * Defines how the Gantt chart is displayed.
				 * <ul>
				 * <li>If set to <code>Both</code>, both the table and the chart are displayed.</li>
				 * <li>If set to <code>Chart</code>, only the chart is displayed.</li>
				 * <li>If set to <code>Table</code>, only the table is displayed.</li>
				 * </ul>
				 * When the parent element of the Gantt chart is the {@link sap.gantt.simple.GanttChartContainer}, this
				 * property overrides the <code>displayType</code> property of {@link sap.gantt.simple.GanttChartContainer}.
				 */
				displayType: {type: "sap.gantt.simple.GanttChartWithTableDisplayType", defaultValue: GanttChartWithTableDisplayType.Both},

				/**
				 * Disables or enables the <code>shapeDoubleClick</code> event.
				 * If set to <code>true</code>, the <code>shapeDoubleClick</code> event is disabled.
				 */
				disableShapeDoubleClickEvent: {type: "boolean", defaultValue: false}
			},
			aggregations: {

				/**
				 * Table of the Gantt Chart
				 *
				 * You can use {sap.ui.table.Table} if you have a flat list data or {sap.ui.table.TreeTable} if you have hierarchical data.
				 */
				table: {type: "sap.ui.table.Table", multiple: false},

				/**
				 * The aggregation is used to store configuration of adhoc lines, adhoc lines represent milestones and events in axis time.
				 */
				adhocLines: {type: "sap.gantt.AdhocLine", multiple: true, singularName: "adhocLine", bindable: "bindable", visibility: "public"},

				/**
				 * SVG reusable element definitions.
				 *
				 * If this property is provided, the paint server definition of the SVG is rendered. Method <code>getDefString()</code> should be
				 * implemented by all paint server classes that are passed in in this property.
				 * We recommend that you set the type of this argument to <code>sap.gantt.def.SvgDefs</code>. Otherwise some properties you set may not function properly.
				 */
				svgDefs: {type: "sap.gantt.def.SvgDefs", multiple: false, singularName: "svgDef"},

				/**
				 * Shape schemes of Gantt Chart.
				 *
				 * Defines all the possible shape schemes in the Gantt chart control.
				 * <b>Note:</b>If you don't use expand chart, you can omit this aggregations.
				 * If not set, a default <code>sap.gantt.simple.ShapeScheme</code> is provided automatically.
				 */
				shapeSchemes: {type: "sap.gantt.simple.ShapeScheme", multiple: true, singularName: "shapeScheme"},

				/**
				 * Paint servers consumed by special shape <code>sap.gantt.shape.cal.Calendar</code>.
				 *
				 * This aggregation is designed to improve performance of calendar shapes. Rows usually share a similar definition with calendar shapes.
				 * It is possible to define a Calendar paint server to draw only one rectangle for each row. Notes for classes extended from
				 * <code>sap.gantt.def.cal.CalendarDef</code>: Different from property <code>paintServerDefs</code>, paint servers defined here must
				 * implement method <code>getDefNode()</code> instead of method <code>getDefString()</code>.
				 */
				calendarDef: {type: "sap.gantt.def.cal.CalendarDefs", multiple: false, bindable: "bindable"},

				/**
				 * This aggregation controls the zoom strategies and zoom rate in Gantt Chart.
				 */
				axisTimeStrategy: {type: "sap.gantt.axistime.AxisTimeStrategyBase", multiple: false, bindable: "bindable"},

				/**
				 * Configuration of locale settings.
				 *
				 * Most locale settings can be configured in sap.ui.configuration objects. Only the time zone and day-light-saving time options
				 * are provided by locale settings.
				 * We recommend that you set the type of this argument to <code>sap.gantt.config.Locale</code>. Otherwise some properties you set may not function properly.
				 */
				locale: {type: "sap.gantt.config.Locale", multiple: false},

				/**
				 * private aggregation for resizing the selection panel
				 * @private
				 */
				_splitter: {type: "sap.ui.layout.Splitter", multiple: false, visibility:"hidden"},

				/**
				 * Header of the Gantt Chart
				 * @private
				 */
				_header: {type: "sap.gantt.simple.GanttHeader", multiple : false, defaultValue: null, visibility:"hidden"},

				/**
				 * Inner Gantt chart
				 * @private
				 */
				_innerGantt: {type: "sap.gantt.simple.InnerGanttChart", multiple: false, visibility:"hidden"}
			},
			events: {
				/**
				 * Fired when the shape selection of the gantt chart has been changed.
				 */
				shapeSelectionChange: {
					parameters: {
						/**
						 * all selected shape UID.
						 */
						shapeUids: {type: "string[]"}
					}
				},

				/**
				 * Fired when a shape is resized.
				 */
				shapeResize: {
					parameters: {
						/**
						 * UID of the resized shape.
						 */
						shapeUid: {type: "string"},

						/**
						 * Shape instance of the resized shape
						 */
						shape: {type: "sap.gantt.shape.BaseShape"},

						/**
						 * Row object of the resizing shape.
						 */
						rowObject: {type: "object"},

						/**
						 * Original shape time array, including the start time and end time.
						 */
						oldTime: {type: "string[]"},

						/**
						 * New shape time array, including the start time and end time.
						 */
						newTime: {type: "string[]"}
					}
				},

				/**
				 * Event fired when a shape is hovered over.
				 */
				shapeMouseEnter: {
					parameters: {
						/**
						 * The data of the shape which fires this event.
						 */
						shape: {type: "sap.gantt.shape.BaseShape"},

						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"}
					}
				},

				/**
				 * Fired when the mouse pointer leaves the shape.
				 */
				shapeMouseLeave: {
					parameters: {
						/**
						 * which shape element trigger the event.
						 */
						shape: {type: "sap.gantt.shape.BaseShape"},

						/**
						 * Original JQuery event object.
						 */
						originEvent: {type: "object"}

					}
				},

				/**
				 * This event is fired when a shape is clicked or tapped.
				 */
				shapePress: {
					parameters:{
						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the row that has been clicked or tapped.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the shape that has been clicked or tapped.
						 */
						shape: {type: "sap.gantt.shape.BaseShape"}
					},
					allowPreventDefault: true
				},

				/**
				 * This event is fired when a shape is double-clicked or double-tapped.
				 */
				shapeDoubleClick: {
					parameters:{
						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the double-clicked row.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the double-clicked shape.
						 */
						shape: {type: "sap.gantt.shape.BaseShape"}
					}
				},

				/**
				 * This event is fired when you right-click the shape.
				 */
				shapeContextMenu: {
					parameters:{
						/**
						 * The mouse position relative to the left edge of the document.
						 */
						pageX: {type: "int"},

						/**
						 * The mouse position relative to the top edge of the document.
						 */
						pageY: {type: "int"},

						/**
						 * Offset for an {@link sap.m.Popover} placement on the x axis, in pixels.
						 */
						popoverOffsetX: {type: "int"},

						/**
						 * Row settings of the right-clicked row.
						 */
						rowSettings: {type: "sap.gantt.simple.GanttRowSettings"},

						/**
						 * Instance of the right-clicked shape.
						 */
						shape: {type: "sap.gantt.shape.BaseShape"}
					}
				},

				/**
				 * Event fired when a drag-and-drop begins
				 */
				dragStart: {
					parameters: {
						/** The source Gantt chart */
						sourceGanttChart: {type: "sap.gantt.simple.GanttChartWithTable"},

						/**
						 * Object of dragged shapes dates, it's structured as follows:
						 * <pre>
						 * {
						 *     "shapeUid1": {
						 *          "time": date1,
						 *          "endTime": date2,
						 *     },
						 *     "shapeUid2": {
						 *          "time": date3,
						 *          "endTime": date4,
						 *     },
						 * }
						 * </pre>
						 *
						 * You can't get all selected shape instances because scrolling might destroy shapes on the invisible rows.
						 */
						draggedShapeDates: {type: "object"},

						/** The last shape out of those being dragged. */
						lastDraggedShapeUid: {type: "string"},

						/**
						 * Represents the mouse pointer's date & time when the <code>dragStart</code> event was fired.
						 */
						cursorDateTime: {type: "object"}
					}
				},

				/**
				 * Event fired when a drag-and-drop occurs on one or more selected shapes.
				 */
				shapeDrop: {
					parameters: {

						/** The source gantt chart */
						sourceGanttChart: { type: "sap.gantt.simple.GanttChartWithTable" },

						/** The target gantt chart */
						targetGanttChart: { type: "sap.gantt.simple.GanttChartWithTable" },

						/**
						 * Object of dragged shapes date, it's structure is:
						 * <pre>
						 * {
						 *     "shapeUid1": {
						 *          "time": date1,
						 *          "endTime": date2,
						 *     },
						 *     "shapeUid2": {
						 *          "time": date3,
						 *          "endTime": date4,
						 *     },
						 * }
						 * </pre>
						 *
						 * It's impossible to get all selected shape instances because of scrolling might destroy shapes on the invisible rows
						 */
						draggedShapeDates: { type: "object" },

						/** The last dragged shape */
						lastDraggedShapeUid: {type: "string"},

						/**
						 * The target row of gantt chart.
						 * No source row because of user might drag multiple shapes on different rows.
						 */
						targetRow: { type: "sap.ui.table.Row"},

						/**
						 * Represent the cursor date & time when drop event fired
						 */
						cursorDateTime: {type: "object"},

						/**
						 * The startTime or endTime of a dropped shape.
						 * In Free or Horizontal drag orientation, the value depends on the ghost alignment:
						 * <ul>
						 * <li>Start: newDateTime is the shape new start time, newDateTime is equal with cursorDateTime</li>
						 * <li>None: newDateTime is the shape new start time</li>
						 * <li>End: newDateTime is the shape new end time, newDateTime is equal with cursorDateTime</li>
						 * </ul>
						 *
						 * In Veritcal drag orientation, newDateTime is the shape new start time, and not equal with cursorDateTime in usual.
						 *
						 * @see sap.gantt.dragdrop.GhostAlignment
						 * @see sap.gantt.DragOrientation
						 */
						newDateTime: {type: "object"},

						/**
						 * Represents the shape which the dragged shape dropped on.
						 */
						targetShape: {type: "sap.gantt.shape.BaseShape"}
					}
				},

				/**
				 * Event fired when one shape dragged and connected to another shape.
				 */
				shapeConnect: {
					parameters: {
						/**
						 * The source shape's shapeUid
						 */
						fromShapeUid: {type: "string"},
						/**
						 * The target shape's shapeUid
						 */
						toShapeUid: {type: "string"},
						/**
						 * The value comes from <code>sap.gantt.simple.RelationshipType</code>, which represents type of relationship
						 */
						type: {type: "sap.gantt.simple.RelationshipType"}
					}
				},

				/**
				 * This event is fired when the visible horizon is changed.
				 *
				 * @since 1.68
				 */
				visibleHorizonUpdate: {
					parameters: {
						/**
						 * Specifies how the update was initiated.
						 */
						type: {type: "sap.gantt.simple.VisibleHorizonUpdateType"},

						/**
						 * Value of the visible horizon before the current update. Some types of this event don't have this value.
						 */
						lastVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"},

						/**
						 * Value of the visible horizon after the current update.
						 */
						currentVisibleHorizon: {type: "sap.gantt.config.TimeHorizon"}
					}
				}
			}
		}
	});

	GanttChartWithTable.prototype.init = function () {
		// this is the svg width with some buffer on both left and right sides.
		this.iGanttRenderedWidth = -1;
		this._bExtensionsInitialized = false;

		this._oExpandModel = new ExpandModel();

		this._oSplitter = new Splitter();
		this.setAggregation("_splitter", this._oSplitter);

		this._oSyncedControl = new GanttSyncedControl();
		this.setAggregation("_innerGantt", new InnerGanttChart());
		this.setAggregation("_header", new GanttHeader());

		// Indicates previous display type
		this._sPreviousDisplayType = this.getDisplayType();
	};

	/**
	 * sap.gantt library internal use only
	 *
	 * @private
	 * @returns {sap.gantt.simple.InnerGanttChart} Embedded Gantt instance
	 */
	GanttChartWithTable.prototype.getInnerGantt = function() {
		return this.getAggregation("_innerGantt");
	};

	GanttChartWithTable.prototype.onSplitterResize = function(oEvent){
		var aOldSizes = oEvent.getParameter("oldSizes"),
			aNewSizes = oEvent.getParameter("newSizes"),
			bResizedX = aOldSizes.length > 0 && aNewSizes.length > 0 && aOldSizes[0] !== aNewSizes[0],
			sDisplayType = this.getDisplayType(),
			bRefreshLastTableAreaSize = true,
			iNewSizeX = aNewSizes[0];

		if (bResizedX) {
			this._onResize();

			if (sDisplayType === GanttChartWithTableDisplayType.Both) {
				if (this._sPreviousDisplayType === GanttChartWithTableDisplayType.Chart) {
					bRefreshLastTableAreaSize = false;
					this._sPreviousDisplayType = sDisplayType;
				}
				if (bRefreshLastTableAreaSize && iNewSizeX) {
					this._iLastTableAreaSize = iNewSizeX;
				}
			}

			var fnIsValidZeroValue = function (aSizes) {
				// Sometimes during rerendering phase, splitter fires resize with first value being zero
				// even though selectionPanelSize is not set to zero. SelectionPanelSize is then set to wrong value
				// and this causes wrong overlap on the table (see BCP 1970349825).
				return this.getSelectionPanelSize().startsWith("0") || aSizes[0] !== 0;
			}.bind(this);

			// We need to determine if the resize happened by user resizing splitter or if the entire container changed size.
			// We cannot use exact equal, as sometimes rounding errors cause few pixels error
			if (almostEqual(aOldSizes.reduce(add), aNewSizes.reduce(add)) && aOldSizes[0] !== aNewSizes[0] && fnIsValidZeroValue(aOldSizes)) {
				this.setProperty("selectionPanelSize", iNewSizeX + "px", true);
				this.fireEvent("_selectionPanelResize", {
					newWidth: iNewSizeX,
					displayType: sDisplayType
				});
			}
			this._draw();
		}
	};

	/**
	 * Sets the {@link sap.ui.core.LayoutData} defining the layout constraints
	 * for this control when it is used inside a layout.
	 *
	 * @param {sap.ui.core.LayoutData} oLayoutData which should be set
	 * @return {sap.ui.core.Element} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	GanttChartWithTable.prototype.setLayoutData = function(oLayoutData) {
		this.setAggregation("layoutData", oLayoutData, true);
		this.fireEvent("_layoutDataChange");
		return this;
	};

	GanttChartWithTable.prototype.setDisplayType = function (sDisplayType) {
		this._sPreviousDisplayType = this.getDisplayType();
		delete this._bPreventInitialRender; // might need to jump to visible horizon before rendering
		this.setProperty("displayType", sDisplayType, false);
		return this;
	};

	GanttChartWithTable.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		this._applyMissingSettings(mSettings);
		Control.prototype.applySettings.call(this, mSettings, oScope);
		// initial the selection model with shape seleciton mode
		this._initSelectionModel(this.getProperty("shapeSelectionMode"));
	};

	/**
	 * Apply the missing settings.
	 *
	 * GanttChartWithTable requires axisTimeStrategy, locale and shapeScheme aggregations when initializing.
	 * If user didn't apply those settings, fallback to the default ones.
	 * @private
	 * @param {object} mSettings The constructor settings
	 */
	GanttChartWithTable.prototype._applyMissingSettings = function(mSettings) {
		if (!mSettings.axisTimeStrategy) {
			mSettings.axisTimeStrategy = new ProportionZoomStrategy();
		}

		if (!mSettings.locale) {
			// use cloned locale just in case it's destroyed by the framework
			mSettings.locale = library.config.DEFAULT_LOCALE_CET.clone();
		}

		if (!mSettings.shapeSchemes) {
			mSettings.shapeSchemes = [ new ShapeScheme({key : "default", primary: true}) ];
		} else {
			var bHasPrimaryScheme = mSettings.shapeSchemes.some(function(oScheme) {
				return oScheme.getPrimary();
			});
			if (!bHasPrimaryScheme) {
				jQuery.sap.log.warning("you need set a ShapeSheme with primary:true");
			}
		}
	};

	/**
	 * Return the first primary shape scheme
	 *
	 * @private
	 * @returns {sap.gantt.simple.ShapeScheme} the primary shape scheme
	 */
	GanttChartWithTable.prototype.getPrimaryShapeScheme = function() {
		return this.getShapeSchemes().filter(function(oScheme){
			return oScheme.getPrimary();
		})[0];
	};

	/**
	 * Return the internal control which used for table & gantt synchronization
	 * This method shall be used only inside the library
	 *
	 * @private
	 * @returns {sap.gantt.simple.GanttSyncedControl} the slave control for synchronization
	 */
	GanttChartWithTable.prototype.getSyncedControl = function() {
		return this._oSyncedControl;
	};

	/**
	 * return the table row heights
	 * This method shall be used only inside the library
	 * @private
	 * @returns {int[]} all visible row heights
	 */
	GanttChartWithTable.prototype.getTableRowHeights = function() {
		return this.getSyncedControl().getRowHeights();
	};

	GanttChartWithTable.prototype.setTable = function(oTable) {
		this.setAggregation("table", oTable);

		// Enable the variable row height feature (half row scrolling)
		oTable._bVariableRowHeightEnabled = true;

		// Try to remove the first content in splitter, just in case it's already there
		var oOldTableWrapper = this._oSplitter.removeContentArea(0);

		// add the wrapped table as the first splitter content
		this._oSplitter.insertContentArea(new AssociateContainer({
			content: oTable,
			enableRootDiv: true
		}), 0);

		if (oOldTableWrapper == null) {
			// first time the table is set as aggregation, the syncWith shall be called only once
			this._oSyncedControl.syncWith(oTable);

			// the GanttSyncControl as the second content
			this._oSplitter.addContentArea(this._oSyncedControl);
		} else if (oOldTableWrapper && oOldTableWrapper.getContent() != oTable.getId()) {
			// the table instance is replaced
			this._oSyncedControl.syncWith(oTable);
		}

		oTable.detachEvent("_rowsUpdated", this._onTableRowsUpdated, this);
		oTable.attachEvent("_rowsUpdated", this._onTableRowsUpdated, this);
	};

	/**
	 * Enable or disable table's variable row height feature
	 * @param {boolean} bEnabled The flag to control it
	 * @protected
	 */
	GanttChartWithTable.prototype.setEnableVariableRowHeight = function(bEnabled) {
		if (this.getTable()) {
			this.getTable()._bVariableRowHeightEnabled = bEnabled;
		} else {
			jQuery.sap.log.warning("you need to set table aggregation first");
		}
	};

	GanttChartWithTable.prototype.getRenderedTimeRange = function() {
		return this.getAxisTime().getTimeRangeSlice(0, this.iGanttRenderedWidth);
	};

	GanttChartWithTable.prototype._initSelectionModel = function(sSelectionMode) {
		if (this.oSelection) {
			this.oSelection.detachSelectionChanged(this._onSelectionChanged, this);
		}
		this.oSelection = new SelectionModel(sSelectionMode);
		this.oSelection.attachSelectionChanged(this._onSelectionChanged, this);
		return this;
	};

	GanttChartWithTable.prototype.setShapeSelectionMode = function(sSelectionMode) {
		this.setProperty("shapeSelectionMode", sSelectionMode);
		if (this.oSelection) {
			this.oSelection.setSelectionMode(sSelectionMode);
		}
		return this;
	};
	/**
	 * Get selected shapes in gantt chart.
	 *
	 * @public
	 *
	 * @return {Object[]} Array of shape object
	 */
	GanttChartWithTable.prototype.getSelectedShapeUid = function () {
		var aShapesId = this.oSelection.allUid();
		return aShapesId;
	};

	GanttChartWithTable.prototype._onSelectionChanged = function(oEvent) {
		var aShapeUid = oEvent.getParameter("shapeUid"),
			aDeselectedUid = oEvent.getParameter("deselectedUid"),
			bSilent = oEvent.getParameter("silent");
		this._updateShapeSelections(aShapeUid, aDeselectedUid);
		if (!bSilent) {
			this.fireShapeSelectionChange({
				shapeUids : aShapeUid
			});
		}
	};

	/**
	 * Update the shape selection `metadata` into the SelectionModel.
	 *
	 * @param {object} mParam shape selected parameters
	 * @private
	 */
	GanttChartWithTable.prototype.handleShapePress = function(mParam) {
		var oShape = mParam.shape,
			sShapeUid = oShape.getShapeUid(),
			bCtrl = mParam.ctrlOrMeta;

		var bNewSelected = !oShape.getSelected();
		this.oSelection.update(sShapeUid, {
			selected: bNewSelected,
			ctrl: bCtrl,
			draggable: oShape.getDraggable(),
			time: oShape.getTime(),
			endTime: oShape.getEndTime()
		});
	};

	GanttChartWithTable.prototype._updateShapeSelections = function(aShapeUid, aDeselectedUid) {
		var oSelMode = this.getShapeSelectionMode();
		if (oSelMode === library.SelectionMode.None) {
			// there is no selection which needs to be updated. With the switch of the
			// selection mode the selection was cleared (and updated within that step)
			return;
		}

		RenderUtils.updateShapeSelections(this, aShapeUid, aDeselectedUid);
	};

	/**
	 * Return the shape selection model.
	 *
	 * @private
	 * @returns {sap.gantt.simple.SelectionModel} the selection model
	 */
	GanttChartWithTable.prototype.getSelection = function() {
		return this.oSelection;
	};

	GanttChartWithTable.prototype.getExpandedBackgroundData = function () {
		if (this._oExpandModel.hasExpandedRows()) {
			var aRows = this.getTable().getRows();
			var iRowCount = aRows.length;

			var iFirstVisibleRow = this.getTable().getFirstVisibleRow();
			var aRowUid = [];

			for (var i = 0; i < iRowCount; i++){
				if (aRows[i].getIndex() >= iFirstVisibleRow){
					var oRowSettings = aRows[i].getAggregation("_settings");
					aRowUid.push(oRowSettings.getRowUid());
				}
			}
			return this._oExpandModel.collectExpandedBgData(aRowUid);
		}
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.setAxisTimeStrategy = function (oAxisTimeStrategy) {
		this.setAggregation("axisTimeStrategy", oAxisTimeStrategy, false);
		oAxisTimeStrategy.attachEvent("_redrawRequest", this._onRedrawRequest, this);
		return this;
	};

	GanttChartWithTable.prototype._onTableRowsUpdated = function (oEvent) {
		if (!this.getVisible()) {
			return;
		}

		var sReason = oEvent.getParameter("reason"),
			oInnerGantt = this.getInnerGantt();

		// whenever model changed, need invalidate gantt as well
		var aModelChangeReason = values(ChangeReason).slice();

		// All reasons that need to invalidate the control which allows render manager to rerender it
		// Each UI interaction shall only render once
		var aInvalidateReasons = aModelChangeReason.concat(["Render", "VerticalScroll", "FirstVisibleRowChange", "Resize"]);

		if (aInvalidateReasons.indexOf(sReason) !== -1) {

			// do not scrolling while invalidating control
			this.getSyncedControl().setAllowContentScroll(false);
			oInnerGantt.invalidate();
		} else {
			oInnerGantt.getRenderer().renderImmediately(this);
		}
	};

	/**
	 * @private
	 * this function is designed for all sync operation, in this function will remove the scroll event deadlock
	 * @private
	 */
	GanttChartWithTable.prototype.syncVisibleHorizon = function (oTimeHorizon, iVisibleWidth, bKeepStartTime, sReason){
		var oGanttAxisTimeStrategy = this.getAxisTimeStrategy();
		var oTotalHorizon = oGanttAxisTimeStrategy.getTotalHorizon();

		var oTargetVisibleHorizon;
		var iCurrentVisibleWidth = this.getVisibleWidth();
		if (iVisibleWidth !== undefined) {
			if (iCurrentVisibleWidth === undefined){
				return;
			}
			if (bKeepStartTime){
				var oCurrentVisibleHorizon = oGanttAxisTimeStrategy.getVisibleHorizon();
				var oCurrentStartTime = Format.abapTimestampToDate(oCurrentVisibleHorizon.getStartTime());
				oTargetVisibleHorizon = Utility.calculateHorizonByWidth(oTimeHorizon, iVisibleWidth, iCurrentVisibleWidth, oCurrentStartTime);
			} else {
				oTargetVisibleHorizon = Utility.calculateHorizonByWidth(oTimeHorizon, iVisibleWidth, iCurrentVisibleWidth);
			}

		} else {
			oTargetVisibleHorizon = oTimeHorizon;
		}

		if (oTotalHorizon.getEndTime() < oTargetVisibleHorizon.getEndTime()){
			var iTargetTimeSpan = Format.abapTimestampToDate(oTargetVisibleHorizon.getEndTime()).getTime() - Format.abapTimestampToDate(oTargetVisibleHorizon.getStartTime()).getTime();
			var oTotalHorizonEndTime = Format.abapTimestampToDate(oTotalHorizon.getEndTime());
			var oStartTime = new Date();
			oStartTime.setTime(oTotalHorizonEndTime.getTime() - iTargetTimeSpan);

			oTargetVisibleHorizon = new TimeHorizon({
				startTime: oStartTime,
				endTime: oTotalHorizonEndTime
			});
		}

		this._updateVisibleHorizon(oTargetVisibleHorizon, sReason || "syncVisibleHorizon", iCurrentVisibleWidth);
	};

	GanttChartWithTable.prototype._updateVisibleHorizon = function (oTimeHorizon, sReasonCode, nVisibleWidth) {
		var oAxisTimeStrategy = this.getAxisTimeStrategy();
		oAxisTimeStrategy.updateGanttVisibleWidth(nVisibleWidth);
		if (oTimeHorizon && oTimeHorizon.getStartTime()) {
			oAxisTimeStrategy.setVisibleHorizonWithReason(oTimeHorizon, sReasonCode);
		}
	};


	/**
	 * this function should only be triggered by sync mouse wheel zoom from ganttchart container, in this function will remove the scroll event deadlock
	 *
	 * @private
	 */
	GanttChartWithTable.prototype.syncMouseWheelZoom = function (oEvent){
		this._getZoomExtension().performMouseWheelZooming(oEvent.originEvent, true);
	};

	GanttChartWithTable.prototype.syncTimePeriodZoomOperation = function (oEvent, bTimeScrollSync, sOrientation){
		this._getZoomExtension().syncTimePeriodZoomOperation(oEvent, bTimeScrollSync, sOrientation);
	};

	GanttChartWithTable.prototype._onRedrawRequest = function (oEvent) {
		var oValueBeforeChange = oEvent.getParameter("valueBeforeChange");
		var sReasonCode = oEvent.getParameter("reasonCode");
		var oOriginEvent = oEvent.getParameter("originEvent");
		var oAxisTimeStrategy = this.getAxisTimeStrategy();

		if (oValueBeforeChange && sReasonCode !== "totalHorizonUpdated" &&
				sReasonCode !== "initialRender" && sReasonCode !== "syncVisibleHorizon") {
			this.fireEvent("_initialRenderGanttChartsSync", {
				reasonCode: sReasonCode, visibleHorizon: oAxisTimeStrategy.getVisibleHorizon(), visibleWidth: this.getVisibleWidth(), originEvent: oOriginEvent
			});
		}
		this.fireVisibleHorizonUpdate({
			type: VISIBLE_HORIZON_UPDATE_TYPE_MAP[sReasonCode],
			lastVisibleHorizon: oValueBeforeChange,
			currentVisibleHorizon: oAxisTimeStrategy.getVisibleHorizon()
		});

		this.redraw(sReasonCode);
		this._setupDisplayType();
	};

	/**
	 * Redraw the chart svg if the surrounding conditions change, e.g zoom strategy updated, row binding context changed
	 * or while scrolling out of the buffer etc.
	 * @param {string} sReasonCode Reason code for calling redraw.
	 * @private
	 */
	GanttChartWithTable.prototype.redraw = function (sReasonCode) {
		this._draw(sReasonCode);
	};

	GanttChartWithTable.prototype._draw = function (sReasonCode) {
		var iVisibleWidth = this.getVisibleWidth();
		if (!iVisibleWidth) {
			return;
		}
		var oSyncZoomStrategyResult = this.getAxisTimeStrategy().syncContext(iVisibleWidth);
		this.fireEvent("_zoomInfoUpdated", oSyncZoomStrategyResult);

		var oScrollExtension = this._getScrollExtension();
		if (oSyncZoomStrategyResult.axisTimeChanged) {
			// clear SVG offset to ensure rerender
			oScrollExtension.clearOffsetWidth();
		}

		oScrollExtension.needRerenderGantt(function () {
			// This is need render fast. otherwise UI has flicker
			this.getInnerGantt().getRenderer().renderImmediately(this);
		}.bind(this), sReasonCode);
	};

	/**
	 * Function is called before the control is rendered.
	 * @private
	 * @override
	 */
	GanttChartWithTable.prototype.onBeforeRendering = function(oEvent) {
		this._updateRowHeightInExpandModel(this.getTable());
		GanttExtension.detachEvents(this);

		this._oSplitter.detachResize(this.onSplitterResize, this);

		if (this._sResizeHandlerId) {
			ResizeHandler.deregister(this._sResizeHandlerId);
		}

		// make sure InnerGantt is invalidated because it's not in some cases like GanttChartWithTable's managed property update
		this.getInnerGantt().invalidate();
	};

	/**
	 * Function is called after the control is rendered.
	 * @private
	 * @override
	 */
	GanttChartWithTable.prototype.onAfterRendering = function(oEvent) {
		this._attachExtensions();
		GanttExtension.attachEvents(this);

		this._oSplitter.attachResize(this.onSplitterResize, this);

		this._sResizeHandlerId = ResizeHandler.register(this, this._onResize.bind(this));

		// at this point, there is no shape rendered at all, so this.jumpToVisibleHorizon("initialRender")
		// will change the zoomRate then trigger redraw, but this will be done in InnerGanttChart.prototype.onBeforeRendering
	};

	/**
	 * Keep both parts of the splitter always visible in case splitter or browser is resized
	 *
	 * @private
	 */
	GanttChartWithTable.prototype._onResize = function() {
		var oSplitter = this.getAggregation("_splitter"),
			iFullWidth = this.getDomRef().offsetWidth,
			oLeftPart, oLayoutData, iLeftWidth, iNewSize;

		if (oSplitter.getContentAreas()[0] && oSplitter.getContentAreas()[0].getLayoutData()) {
			oLeftPart = oSplitter.getContentAreas()[0];
			oLayoutData = oLeftPart.getLayoutData();

			if (iFullWidth < MIN_AREA_WIDTH * 2) {
				iNewSize = iFullWidth / 2;
			} else {
				iLeftWidth = oLeftPart.getDomRef().offsetWidth;
				iNewSize = Math.max(Math.min(iLeftWidth, iFullWidth - MIN_AREA_WIDTH), MIN_AREA_WIDTH);
			}

			oLayoutData.setSize(iNewSize + "px");
		}
	};

	GanttChartWithTable.prototype._setupDisplayType = function() {
		var sDisplayType = this.getDisplayType(),
			iVSbWidth, sTableSize;

		var fnSetSizesSettings = function (sTableSize, sChartSize) {
			var aSplitterContentAreas = this._oSplitter.getContentAreas(),
				oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
				oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData(),
				bResizable = sDisplayType === GanttChartWithTableDisplayType.Both;

			oTableAreaLayoutData.setSize(sTableSize).setResizable(bResizable);
			oChartAreaLayoutData.setSize(sChartSize).setResizable(bResizable);
		}.bind(this);

		if (sDisplayType === GanttChartWithTableDisplayType.Table) {
			iVSbWidth = this.getSyncedControl().$().find(".sapGanttBackgroundVScrollContentArea").width();

			if (iVSbWidth !== 0) {
				// add 2px for same width of scrollbar in all display types
				iVSbWidth += 2;
			}
			fnSetSizesSettings("auto", iVSbWidth + "px");
		} else if (sDisplayType === GanttChartWithTableDisplayType.Chart) {
			fnSetSizesSettings("1px", "auto");
		} else if (sDisplayType !== this._sPreviousDisplayType) {
			sTableSize = this._iLastTableAreaSize ? this._iLastTableAreaSize + "px" : this.getSelectionPanelSize();
			fnSetSizesSettings(sTableSize, "auto");
		}
	};

	GanttChartWithTable.prototype._updateRowHeightInExpandModel = function(oTable) {
		var iTableRowHeight = oTable.getRowHeight();
		if (iTableRowHeight === 0) {
			iTableRowHeight = oTable._getDefaultRowHeight();
		}
		this._oExpandModel.setBaseRowHeight(iTableRowHeight);
	};

	GanttChartWithTable.prototype.jumpToVisibleHorizon = function(sReason) {
		this._updateVisibleHorizon(this.getAxisTimeStrategy().getVisibleHorizon(), sReason, this.getVisibleWidth());
	};

	GanttChartWithTable.prototype.exit = function() {
		if (this._sResizeHandlerId) {
			ResizeHandler.deregister(this._sResizeHandlerId);
		}

		this._detachExtensions();
		delete this._bPreventInitialRender;
	};

	GanttChartWithTable.prototype._attachExtensions = function() {
		if (this._bExtensionsInitialized) {
			return;
		}
		GanttExtension.enrich(this, GanttScrollExtension);
		GanttExtension.enrich(this, GanttZoomExtension);
		GanttExtension.enrich(this, GanttPointerExtension);
		GanttExtension.enrich(this, GanttDragDropExtension);
		GanttExtension.enrich(this, GanttPopoverExtension);
		GanttExtension.enrich(this, GanttConnectExtension);
		GanttExtension.enrich(this, GanttResizeExtension);

		this._bExtensionsInitialized = true;
	};

	GanttChartWithTable.prototype._detachExtensions = function(){
		GanttExtension.cleanup(this);
	};

	/**
	 * This is a shortcut method for GanttChart instance to get the AxisTime.
	 *
	 * @protected
	 * @returns {sap.gantt.misc.AxisTime} the AxisTime instance
	 */
	GanttChartWithTable.prototype.getAxisTime = function () {
		var oAxisTime = this.getAxisTimeStrategy().getAxisTime();
		if (!oAxisTime) {
			this.getAxisTimeStrategy().createAxisTime(this.getLocale());
			oAxisTime = this.getAxisTimeStrategy().getAxisTime();
		}

		return oAxisTime;
	};

	/**
	 * Return the Chart Content width by calculating the Axistime zoom strategy
	 * timeline distances, the unit is in pixel.
	 *
	 * @private
	 * @returns {int} the cnt width in pixel
	 */
	GanttChartWithTable.prototype.getContentWidth = function() {
		var oAxisTime = this.getAxisTime(),
			oRange = oAxisTime.getViewRange();
		return Math.abs(Math.ceil(oRange[1]) - Math.ceil(oRange[0]));
	};

	/**
	 * Visible SVG width
	 * @private
	 * @returns {int} the visible width in chart area
	 */
	GanttChartWithTable.prototype.getVisibleWidth = function() {
		return this._getScrollExtension ? this._getScrollExtension().getVisibleWidth() : undefined;
	};

	/**
	 * expand one or more rows indices by the shape scheme key.
	 * This function takes effect only after the control is fully rendered, otherwise it's doing nothing.
	 *
	 * @param {string} sSchemeKey the key defined in <code>sap.gantt.simple.ShapeScheme</code>
	 * @param {int|int[]} vRowIndex A single index or an array of indices of the rows to be collapsed
	 * @public
	 */
	GanttChartWithTable.prototype.expand = function(sSchemeKey, vRowIndex) {
		this.toggleShapeScheme(true, sSchemeKey, vRowIndex);
	};

	/**
	 * Collapse the selected row indices by the shape scheme key.
	 * This function takes effect only after the control is fully rendered, otherwise it's doing nothing.
	 *
	 * @param {string} sSchemeKey the key defined in <code>sap.gantt.simple.ShapeScheme</code>
	 * @param {int|int[]} vRowIndex A single index or an array of indices of the rows to be collapsed
	 * @public
	 */
	GanttChartWithTable.prototype.collapse = function(sSchemeKey, vRowIndex) {
		this.toggleShapeScheme(false, sSchemeKey, vRowIndex);
	};

	/**
	 * @private
	 */
	GanttChartWithTable.prototype.toggleShapeScheme = function(bExpanded, sShapeScheme, vRowIndex) {
		var aIndices = [];
		if (typeof vRowIndex === "number") {
			aIndices = [vRowIndex];
		} else if (Array.isArray(vRowIndex)) {
			aIndices = vRowIndex;
		}

		if (aIndices.length === 0 || !sShapeScheme) { return; }

		var aExpandScheme = this.getShapeSchemes().filter(function(oScheme){
			return oScheme.getKey() === sShapeScheme;
		});

		if (aExpandScheme == null || aExpandScheme.length === 0 || aExpandScheme.length > 1) {
			jQuery.sap.assert(false, "shape scheme must not be null or not found in shapeSchemes");
			return;
		}

		var oPrimaryScheme = this.getPrimaryShapeScheme();

		var bExpandToggled = this._oExpandModel.isTableRowHeightNeedChange(bExpanded, this.getTable(), aIndices, oPrimaryScheme, aExpandScheme[0]);

		if (bExpandToggled) {
			this.getTable().invalidate();
		}
	};

	/**
	 * Determine whether the shape times fit into the visible horizon.
	 *
	 * @param {sap.gantt.shape.BaseShape} oShape any shape inherits from BaseShape
	 * @returns {boolean} return true if shape time range fit into visible area
	 */
	GanttChartWithTable.prototype.isShapeVisible = function(oShape) {
		if (oShape && oShape.isVisible()) {
			return true;
		}

		if (!oShape.getVisible()) {
			return false;
		}

		var mTimeRange = this.getRenderedTimeRange(),
			oMinTime = mTimeRange[0],
			oMaxTime = mTimeRange[1];

		var oStartTime = oShape.getTime(),
			oEndTime = oShape.getEndTime();

		var fnFallInRange = function(oTime) {
			return (oTime >= oMinTime && oTime <= oMaxTime);
		};
		if (oShape.getSelected() || !oStartTime || !oEndTime) {
			//time not set
			return true;
		} else if (oStartTime && oEndTime) {
			// both has value
			//     start time fall in range  OR end time fall in range  OR start time and end time cross the range
			return fnFallInRange(oStartTime) || fnFallInRange(oEndTime) || (oStartTime <= oMinTime && oEndTime >= oMaxTime);
		} else if (oStartTime && !oEndTime) {
			return fnFallInRange(oStartTime);
		} else if (!oStartTime && oEndTime) {
			return fnFallInRange(oEndTime);
		}
	};

	/**
	 * The Gantt Chart performs Bird Eye on all visible rows or on a specific row depending on the setting of iRowIndex.
	 * @param {int} iRowIndex zero-based index indicating which row to perform Bird Eye on. If you do not specify iRowIndex, the Gantt chart performs Bird Eye on all visible rows.
	 *
	 * @public
	 */
	GanttChartWithTable.prototype.doBirdEye = function(iRowIndex) {
		var oZoomExtension = this._getZoomExtension();
		oZoomExtension.doBirdEye(iRowIndex);
	};

	return GanttChartWithTable;

}, true);
