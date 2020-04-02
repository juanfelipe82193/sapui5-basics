/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the ViewStateManagerBase class.
sap.ui.define([
	"sap/ui/core/Element"
], function(
	Element
) {
	"use strict";

	/**
	 * Constructor for a new ViewStateManagerBase.
	 *
	 * @class
	 * Manages the visibility and selection states of nodes in the scene.
	 *
	 * @param {string} [sId] ID for the new ViewStateManagerBase object. Generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new ViewStateManagerBase object.
	 * @public
	 * @abstract
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.core.Element
	 * @alias sap.ui.vk.ViewStateManagerBase
	 * @since 1.32.0
	 */
	var ViewStateManagerBase = Element.extend("sap.ui.vk.ViewStateManagerBase", /** @lends sap.ui.vk.ViewStateManagerBase.prototype */ {
		metadata: {
			"abstract": true,

			properties: {
				shouldTrackVisibilityChanges: {
					type: "boolean",
					defaultValue: false
				},
				recursiveSelection: {
					type: "boolean",
					defaultValue: false
				},
				recursiveOutlining: {
					type: "boolean",
					defaultValue: false
				}
			},

			associations: {
				contentConnector: {
					type: "sap.ui.vk.ContentConnector"
				},
				viewManager: {
					type: "sap.ui.vk.ViewManager"
				}
			},

			events: {
				/**
				 * This event is fired when the visibility of the node changes.
				 */
				visibilityChanged: {
					parameters: {
						/**
						 * References of newly shown nodes.
						 */
						visible: {
							type: "any[]"
						},
						/**
						 * IDs of newly hidden nodes.
						 */
						hidden: {
							type: "any[]"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when the nodes are selected/unselected.
				 */
				selectionChanged: {
					parameters: {
						/**
						 * References of newly selected nodes.
						 */
						selected: {
							type: "any[]"
						},
						/**
						 * References of newly unselected nodes.
						 */
						unselected: {
							type: "any[]"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when the nodes are outlined/unoutlined.
				 */
				outliningChanged: {
					parameters: {
						/**
						 * References of newly outlined nodes.
						 */
						outlined: {
							type: "any[]"
						},
						/**
						 * References of newly unoutlined nodes.
						 */
						unoutlined: {
							type: "any[]"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when opacity of the nodes is changed.
				 */
				opacityChanged: {
					parameters: {
						/**
						 * References of nodes whose opacity changed.
						 */
						changed: {
							type: "any[]"
						},
						/**
						 * Opacity assigned to the nodes. Could be either <code>float</code> or <code>float[]</code> if event was fired from a bulk operation.
						 */
						opacity: {
							type: "any"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when tint color of the nodes is changed.
				 */
				tintColorChanged: {
					parameters: {
						/**
						 * References of nodes whose tint color changed.
						 */
						changed: {
							type: "any[]"
						},
						/**
						 * Tint color assigned to the nodes. Could be either <code>sap.ui.core.CSSColor</code> or <code>sap.ui.core.CSSColor[]</code> if event was fired from a bulk operation.
						 */
						tintColor: {
							type: "any"
						},
						/**
						 * Tint color in the ABGR format assigned to the nodes.  Could be either <code>int</code> or <code>int[]</code> if event was fired from a bulk operation.
						 */
						tintColorABGR: {
							type: "any"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when the node hierarchy is replaced.
				 */
				nodeHierarchyReplaced: {
					parameters: {
						/**
						 * Old node hierarchy
						 */
						oldNodeHierarchy: {
							type: "sap.ui.vk.NodeHierarchy"
						},

						/**
						 * New node hierarchy
						 */
						newNodeHierarchy: {
							type: "sap.ui.vk.NodeHierarchy"
						}
					}
				},

				/**
				 * This event is fired when highlighting color  is changed.
				 */
				highlightColorChanged: {
					parameters: {
						/**
						 * Highlighting color
						 */
						highlightColor: {
							type: "sap.ui.core.CSSColor"
						},
						/**
						 * Highlighting color in the ABGR format.
						 */
						highlightColorABGR: {
							type: "int"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when node's transformation changed.
				 */
				transformationChanged: {
					parameters: {

						/**
						 * Reference to a changed node or array of node references.
						 */
						changed: {
							type: "any"
						},

						/**
						 * Node's transformation or array of nodes' transforms
						 * Transformation object will contain the following fields of type <code>float[]</code>:
						 * translation
						 * scale
						 * angleAxis | euler | quaternion
						 */
						transformation: {
							 type: "any"
						}
					}
				},

				/**
				 * This event is fired when View is about to be activated.
				 */
				viewStateApplying: {
					parameters: {
						view: {
							type: "sap.ui.vk.View"
						}
					}
				},

				/**
				 * This event is fired when View activated.
				 */
				viewStateApplied: {
					parameters: {
						view: {
							type: "sap.ui.vk.View"
						}
					}
				},

				/**
				 * This event is fired when viewport is ready for playing animation (e.g, camera is ready).
				 */
				readyForAnimation: {
					parameters: {
						view: {
							type: "sap.ui.vk.View"
						}
					}
				},

				/**
				 * This event is fired when outlining color  is changed.
				 */
				outlineColorChanged: {
					parameters: {
						/**
						 * Outlining color
						 */
						outlineColor: {
							type: "sap.ui.core.CSSColor"
						},
						/**
						 * Outlining color in the ABGR format.
						 */
						outlineColorABGR: {
							type: "int"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when outline width is changed.
				 */
				outlineWidthChanged: {
					parameters: {
						/**
						 * Outline width
						 */
						width: {
							type: "float"
						}
					},
					enableEventBubbling: true
				}
			}
		}
	});

	/**
	 * Gets the NodeHierarchy object associated with this ViewStateManagerBase object.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getNodeHierarchy
	 * @returns {sap.ui.vk.NodeHierarchy} The node hierarchy associated with this ViewStateManagerBase object.
	 * @public
	 */

	/**
	 * Gets the visibility changes in the current ViewStateManagerBase object.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getVisibilityChanges
	 * @returns {string[]} The visibility changes are in the form of an array. The array is a list of node VE ids which suffered a visibility changed relative to the default state.
	 * @public
	 */

	/**
	 * Gets the visibility state of all nodes.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getVisibilityComplete
	 * @returns {object} An object with following structure.
	 * <pre>
	 * {
	 *     visible: [string, ...] - an array of VE IDs of visible nodes
	 *     hidden:  [string, ...] - an array of VE IDs of hidden nodes
	 * }
	 * </pre>
	 */

	/**
	 * Gets the visibility state of nodes.
	 *
	 * If a single node reference is passed to the method then a single visibility state is returned.<br/>
	 * If an array of node references is passed to the method then an array of visibility states is returned.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getVisibilityState
	 * @param {any|any[]} nodeRefs The node reference or the array of node references.
	 * @returns {boolean|boolean[]} A single value or an array of values where the value is <code>true</code> if the node is visible, <code>false</code> otherwise.
	 * @public
	 */

	/**
	 * Sets the visibility state of the nodes.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setVisibilityState
	 * @param {any|any[]} nodeRefs The node reference or the array of node references.
	 * @param {boolean} visible The new visibility state of the nodes.
	 * @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	/**
	 * Resets the visibility states of all nodes to the initial states.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#resetVisibility
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	/**
	 * Enumerates IDs of the selected nodes.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#enumerateSelection
	 * @param {function} callback A function to call when the selected nodes are enumerated. The function takes one parameter of type <code>string</code>.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	/**
	 * Gets the selection state of the node.
	 *
	 * If a single node reference is passed to the method then a single selection state is returned.<br/>
	 * If an array of node references is passed to the method then an array of selection states is returned.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getSelectionState
	 * @param {any|any[]} nodeRefs The node reference or the array of node references.
	 * @returns {boolean|boolean[]} A single value or an array of values where the value is <code>true</code> if the node is selected, <code>false</code> otherwise.
	 * @public
	 */

	/**
	 * Sets the selection state of the nodes.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setSelectionState
	 * @param {any|any[]} nodeRefs The node reference or the array of node references.
	 * @param {boolean} selected The new selection state of the nodes.
	 * @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	 * @param {boolean} blockNotification The flag to suppres selectionChanged event.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @deprecated Since version 1.56.3.
	 * @public
	 */

	/**
	 * Sets or resets the selection state of the nodes.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setSelectionStates
	 * @param {any|any[]} selectedNodeRefs The node reference or the array of node references of selected nodes.
	 * @param {any|any[]} unselectedNodeRefs The node reference or the array of node references of unselected nodes.
	 * @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	 * @param {boolean} blockNotification The flag to suppres selectionChanged event.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	 /**
	 * Gets the outlining state of the node.
	 *
	 * If a single node reference is passed to the method then a single outlining state is returned.<br/>
	 * If an array of node references is passed to the method then an array of outlining states is returned.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getOutliningState
	 * @param {any|any[]} nodeRefs The node reference or the array of node references.
	 * @returns {boolean|boolean[]} A single value or an array of values where the value is <code>true</code> if the node is outlined, <code>false</code> otherwise.
	 * @public
	 */


	 /**
	 * Sets or resets the outlining state of the nodes.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setOutliningStates
	 * @param {any|any[]} outlinedNodeRefs The node reference or the array of node references of outlined nodes.
	 * @param {any|any[]} unoutlinedNodeRefs The node reference or the array of node references of unoutlined nodes.
	 * @param {boolean} recursive The flags indicates if the change needs to propagate recursively to child nodes.
	 * @param {boolean} blockNotification The flag to suppres outlineChanged event.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	/**
	 * Gets the opacity of the node.
	 *
	 * If a single node reference is passed to the method then a single value is returned.<br/>
	 * If an array of node references is passed to the method then an array of values is returned.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getOpacity
	 * @param {any|any[]} nodeRefs The node reference or the array of node references.
	 * @returns {float|float[]} A single value or an array of values. Value <code>null</code> means that the node's own opacity should be used.
	 * @public
	 */

	/**
	 * Sets the opacity of the nodes.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setOpacity
	 * @param {any|any[]}       nodeRefs          The node reference or the array of node references.
	 * @param {float|null}      opacity           The new opacity of the nodes. If <code>null</code> is passed then the opacity is reset
	 *                                            and the node's own opacity should be used.
	 * @param {boolean}         [recursive=false] The flags indicates if the change needs to propagate recursively to child nodes.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	/**
	 * Gets the tint color of the node.
	 *
	 * If a single node reference is passed to the method then a single value is returned.<br/>
	 * If an array of node references is passed to the method then an array of values is returned.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getTintColor
	 * @param {any|any[]}       nodeRefs             The node reference or the array of node references.
	 * @param {boolean}         [inABGRFormat=false] This flag indicates to return the tint color in the ABGR format,
	 *                                               if it equals <code>false</code> then the color is returned in the CSS color format.
	 * @returns {sap.ui.core.CSSColor|sap.ui.core.CSSColor[]|int|int[]}
	 *                                               A single value or an array of values. Value <code>null</code> means that
	 *                                               the node's own tint color should be used.
	 * @public
	 */

	/**
	 * Sets the tint color of the nodes.
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setTintColor
	 * @param {any|any[]}                   nodeRefs          The node reference or the array of node references.
	 * @param {sap.ui.vk.CSSColor|int|null} tintColor         The new tint color of the nodes. The value can be defined as a string
	 *                                                        in the CSS color format or as an integer in the ABGR format. If <code>null</code>
	 *                                                        is passed then the tint color is reset and the node's own tint color should be used.
	 * @param {boolean}                     [recursive=false] This flag indicates if the change needs to propagate recursively to child nodes.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	/**
	 * Gets the decomposed node local transformation matrix.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getTransformation
	 * @param {any|any[]} nodeRef The node reference.
	 * @returns {any|any[]} object that contains <code>translation</code>, <code>scale</code> and <code>quaternion</code> components.
	 * @public
	 */

	/**
	 * Gets the node transformation translation component.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getTranslation
	 * @param {any} nodeRef The node reference.
	 * @returns {float[]|Array<Array<float>>} vector A translation component of node's transformation matrix.
	 * @public
	 */

	/**
	 * Gets the node transformaton scale component.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getScale
	 * @param {any|any[]} nodeRef The node reference.
	 * @returns {float[]|Array<Array<float>>} vector A scale component of node's transformation matrix.
	 * @public
	 */

	/**
	 * Gets the node transformation rotation component in specified format.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getRotation
	 * @param {any|any[]} nodeRef The node reference or the array of node references.
	 * @param {sap.ui.vk.RotationType} rotationType Rotation representation type.
	 * @returns {float[]|Array<Array<float>>} vector A rotation component of node(s) transformation matrix.
	 * @public
	 */

	/**
	 * Sets the node transformation components.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setTransformation
	 * @param {any|any[]} nodeRef The node reference.
	 * @param {any} transformation Node's transformation matrix components.
	 * @param {float[]} transformation.translation translation component.
	 * @param {float[]} transformation.scale scale component.
	 * @param {float[]} transformation.angleAxis rotation component as angle-axis, or
	 * @param {float[]} transformation.euler rotation component as Euler angles, or
	 * @param {float[]} transformation.quaternion rotation component as quaternion.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	 /**
	 * Sets node joint(s)
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setJoint
	 *
	 * Method will add new joint into {sap.ui.vk.ViewStateManagerBase}. If child node is already specified as a child of another parent node
	 * that joint will be removed.
	 *
	 * @param {any|any[]} jointData                   joint data
	 * @param {any}      jointData.parent             parent node
	 * @param {any}      jointData.node               child node
	 * @param {float[]}  jointData.translation        child's translation relative to parent
	 * @param {float[]}  jointData.quaternion         child's rotation relative to parent
	 * @param {float[]}  jointData.scale              child's scale relative to parent
	 *                                                During rendering, translation rotation and scale components are combined into
	 *                                                a matrix in the RTS order.
	 *
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 *
	 * @experimental Since 1.71.0 This class is experimental and might be modified or removed in future versions.
	 * @public
	 */

	/**
	 * Gets node joint(s)
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getJoint
	 *
	 * @param {any?}     jointData                    node joint data. If omited, all node joints will be returned.
	 * @param {any?}     jointData.parent             parent node.
	 * @param {any?}     jointData.node               child node. If omited, all children for the specified parent node will be returned.
	 *
	 * @returns {any|any[]} Object(s) containing joint and positioning data or <code>undefined</code> if no such joint present.
	 *
	 * @experimental Since 1.71.0 This class is experimental and might be modified or removed in future versions.
	 * @public
	 */

	 /**
	 * Sets the outline color
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setOutlineColor
	 * @param {sap.ui.vk.CSSColor|string|int} color           The new outline color. The value can be defined as a string
	 *                                                        in the CSS color format or as an integer in the ABGR format. If <code>null</code>
	 *                                                        is passed then the tint color is reset and the node's own tint color should be used.
	 * @returns {sap.ui.vk.ViewStateManager} <code>this</code> to allow method chaining.
	 * @public
	 */


	/**
	 * Gets the outline color
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getOutlineColor
	 * @param {boolean}         [inABGRFormat=false] This flag indicates to return the outline color in the ABGR format,
	 *                                               if it equals <code>false</code> then the color is returned in the CSS color format.
	 * @returns {sap.ui.core.CSSColor|string|int}
	 *                                               A single value or an array of values. Value <code>null</code> means that
	 *                                               the node's own tint color should be used.
	 * @public
	 */

	 /**
	 * Sets the outline width
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setOutlineWidth
	 * @param {float} width           			width of outline
	 * @returns {sap.ui.vk.ViewStateManager} 	<code>this</code> to allow method chaining.
	 * @public
	 */


	/**
	 * Gets the outline width
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#getOutlineWidth
	 * @returns {float} width of outline
	 * @public
	 */

	 /**
	 * Enumerates IDs of the outlined nodes.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#enumerateOutlinedNodes
	 * @param {function} callback A function to call when the outlined nodes are enumerated. The function takes one parameter of type <code>string</code>.
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	 /**
	 * Set highlight display state.
	 *
	 * @function
	 * @name sap.ui.vk.ViewStateManagerBase#setHighlightDisplayState
	 * @param {sap.ui.vk.HighlightDisplayState} state for playing highlight - playing, pausing, and stopped
	 * @returns {sap.ui.vk.ViewStateManagerBase} <code>this</code> to allow method chaining.
	 * @public
	 */

	return ViewStateManagerBase;
});
