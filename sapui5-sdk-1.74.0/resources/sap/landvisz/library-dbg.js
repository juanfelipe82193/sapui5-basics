/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.landvisz.
 */
sap.ui.define(["sap/ui/core/Core", "sap/ui/core/library"], function(Core, coreLibrary) {
	"use strict";

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.landvisz",
		dependencies : ["sap.ui.core"],
		types: [
			"sap.landvisz.ActionType",
			"sap.landvisz.ComponentType",
			"sap.landvisz.ConnectionLine",
			"sap.landvisz.ConnectionType",
			"sap.landvisz.DependencyType",
			"sap.landvisz.DependencyVisibility",
			"sap.landvisz.EntityCSSSize",
			"sap.landvisz.LandscapeObject",
			"sap.landvisz.ModelingStatus",
			"sap.landvisz.OptionType",
			"sap.landvisz.SelectionViewPosition",
			"sap.landvisz.SolutionType",
			"sap.landvisz.TechnicalSystemType",
			"sap.landvisz.ViewType",
			"sap.landvisz.internal.ContainerType"
		],
		interfaces: [],
		controls: [
			"sap.landvisz.ConnectionEntity",
			"sap.landvisz.Connector",
			"sap.landvisz.LandscapeEntity",
			"sap.landvisz.LandscapeViewer",
			"sap.landvisz.LongTextField",
			"sap.landvisz.Option",
			"sap.landvisz.OptionEntity",
			"sap.landvisz.OptionSource",
			"sap.landvisz.internal.ActionBar",
			"sap.landvisz.internal.DataContainer",
			"sap.landvisz.internal.DeploymentType",
			"sap.landvisz.internal.EntityAction",
			"sap.landvisz.internal.EntityCustomAction",
			"sap.landvisz.internal.HeaderList",
			"sap.landvisz.internal.IdentificationBar",
			"sap.landvisz.internal.LinearRowField",
			"sap.landvisz.internal.ModelingStatus",
			"sap.landvisz.internal.NestedRowField",
			"sap.landvisz.internal.SingleDataContainer",
			"sap.landvisz.internal.TreeField"
		],
		elements: [],
		version: "1.74.0"
	});

	/**
	 * sap.landvisz library for UI developments
	 *
	 * @namespace
	 * @alias sap.landvisz
	 * @public
	 */
	var thisLib = sap.landvisz;

	/**
	 * Action Type of a action
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ActionType = {

		/**
		 * Normal action type
		 * @public
		 */
		NORMAL : "NORMAL",

		/**
		 * Menu action type
		 * @public
		 */
		MENU : "MENU"

	};
	/**
	 * [Enter description for ComponentType]
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ComponentType = {

		/**
		 * on demand component type
		 * @public
		 */
		onDemand : "onDemand",

		/**
		 * on premise component type
		 * @public
		 */
		onPremise : "onPremise",

		/**
		 * component type in not defined
		 * @public
		 */
		notDefined : "notDefined"

	};
	/**
	 * type file for ps, ts and mob soln
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ConnectionLine = {

		/**
		 * Plain line
		 * @public
		 */
		Line : "Line",

		/**
		 * Line with arrow at end
		 * @public
		 */
		Arrow : "Arrow"

	};

	/**
	 * type file for ps, ts and mob soln
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ConnectionType = {

		/**
		 * ps type
		 * @public
		 */
		ProductSystem : "ProductSystem",

		/**
		 * ts type
		 * @public
		 */
		TechnicalSystem : "TechnicalSystem",

		/**
		 * mob type
		 * @public
		 */
		MobileSolution : "MobileSolution"

	};

	/**
	 * View type of landscape viewer
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.DependencyType = {

		/**
		 * dependency view
		 * @public
		 */
		NETWORK_VIEW : "NETWORK_VIEW",

		/**
		 * Landscape view for selected view
		 * @public
		 */
		BOX_VIEW : "BOX_VIEW"

	};

	/**
	 * View Visibility of landscape viewer
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.DependencyVisibility = {

		/**
		 * Network dependency view
		 * @public
		 */
		NETWORK : "NETWORK",

		/**
		 * Box Dependency View
		 * @public
		 */
		BOX : "BOX",

		/**
		 * make both view visible
		 * @public
		 */
		BOTH : "BOTH"

	};

	/**
	 * System Size supported
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.EntityCSSSize = {

		/**
		 * Regular size of system
		 * @public
		 */
		Regular : "Regular",

		/**
		 * Medium size of system
		 * @public
		 */
		Medium : "Medium",

		/**
		 * Large size of system
		 * @public
		 */
		Large : "Large",

		/**
		 * Small size of system
		 * @public
		 */
		Small : "Small",

		/**
		 * Smallest size of system
		 * @public
		 */
		Smallest : "Smallest",

		/**
		 * Smaller size of system
		 * @public
		 */
		Smaller : "Smaller",

		/**
		 * Largest size of system
		 * @public
		 */
		Largest : "Largest",

		/**
		 * new size regular size
		 * @public
		 */
		RegularSmall : "RegularSmall"

	};

	/**
	 * Type of object in the landscape
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.LandscapeObject = {

		/**
		 * Technical system type
		 * @public
		 */
		TechnicalSystem : "TechnicalSystem",

		/**
		 * Product systems type
		 * @public
		 */
		ProductSystem : "ProductSystem",

		/**
		 * Database type
		 * @public
		 */
		Database : "Database",

		/**
		 * Product type
		 * @public
		 */
		Product : "Product",

		/**
		 * Product version type
		 * @public
		 */
		ProductVersion : "ProductVersion",

		/**
		 * SAP Component Type
		 * @public
		 */
		SapComponent : "SapComponent",

		/**
		 * SAP Track Type
		 * @public
		 */
		Track : "Track"

	};

	/**
	 * sampl doc
	 *
	 * @author SAP AG
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ModelingStatus = {

		/**
		 * sample doc for types - ABAP
		 * @public
		 */
		ERROR : "ERROR",

		/**
		 * sample doc
		 * @public
		 */
		WARNING : "WARNING",

		/**
		 * sample doc
		 * @public
		 */
		NORMAL : "NORMAL"

	};

	/**
	 * Action Type of a action
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.OptionType = {

		/**
		 * Option applicable on entity
		 * @public
		 */
		ENTITY : "ENTITY",

		/**
		 * Option applicable on view
		 * @public
		 */
		VIEW : "VIEW"

	};

	/**
	 * position of selection view
	 *
	 * @author SAP AG
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.SelectionViewPosition = {

		/**
		 * selection entity at left position
		 * @public
		 */
		LEFT : "LEFT",

		/**
		 * selection entity at right position
		 * @public
		 */
		RIGHT : "RIGHT",

		/**
		 * Selection entity at center position
		 * @public
		 */
		CENTER : "CENTER"

	};

	/**
	 * View type of landscape viewer
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.SolutionType = {

		/**
		 * Component view of a solution
		 * @public
		 */
		COMPONENT_VIEW : "COMPONENT_VIEW",

		/**
		 * Deploy view of a solution
		 * @public
		 */
		DEPLOYMENT_VIEW : "DEPLOYMENT_VIEW"

	};

	/**
	 * sampl doc
	 *
	 * @author SAP AG
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.TechnicalSystemType = {

		/**
		 * types: ABAP
		 * @public
		 */
		ABAP : "ABAP",

		/**
		 * types: JAVA
		 * @public
		 */
		JAVA : "JAVA",

		/**
		 * Types: HANA DB
		 * @public
		 */
		HANADB : "HANADB",

		/**
		 * types - DUAL
		 * @public
		 */
		DUAL : "DUAL",

		/**
		 * types - DUAL
		 * @public
		 */
		SBOP : "SBOP",

		/**
		 * types: SUP
		 * @public
		 */
		SUP : "SUP",

		/**
		 * Types: GENERIC
		 * @public
		 */
		GENERIC : "GENERIC",

		/**
		 * types - INTROSCOPEMGR
		 * @public
		 */
		INTROSCOPEMGR : "INTROSCOPEMGR",

		/**
		 * Types: INTROSCOPESTD
		 * @public
		 */
		INTROSCOPESTD : "INTROSCOPESTD",

		/**
		 * types - LIVECACHESAP
		 * @public
		 */
		LIVECACHESAP : "LIVECACHESAP",

		/**
		 * types - MDM
		 * @public
		 */
		MDM : "MDM",

		/**
		 * types: TREX
		 * @public
		 */
		TREX : "TREX",

		/**
		 * types: UNSP3TIER
		 * @public
		 */
		UNSP3TIER : "UNSP3TIER",

		/**
		 * Types: UNSPCLUSTER
		 * @public
		 */
		UNSPCLUSTER : "UNSPCLUSTER",

		/**
		 * types - UNSPAPP
		 * @public
		 */
		UNSPAPP : "UNSPAPP",

		/**
		 * types - .NET
		 * @public
		 */
		MSNET : "MSNET",

		/**
		 * types: APACHESERVER
		 * @public
		 */
		APACHESERVER : "APACHESERVER",

		/**
		 * types: WEBSPHERE
		 * @public
		 */
		WEBSPHERE : "WEBSPHERE",

		/**
		 * Types: MSIISINST
		 * @public
		 */
		MSIISINST : "MSIISINST",

		/**
		 * types - WEBDISP
		 * @public
		 */
		WEBDISP : "WEBDISP"

	};

	/**
	 * View type of landscape viewer
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.ViewType = {

		/**
		 * dependency view
		 * @public
		 */
		DEPENDENCY_VIEW : "DEPENDENCY_VIEW",

		/**
		 * Landscape view for selected view
		 * @public
		 */
		SELECTION_VIEW : "SELECTION_VIEW",

		/**
		 * Solution View for a Landscape Objects
		 * @public
		 */
		SOLUTION_VIEW : "SOLUTION_VIEW"

	};

	/**
	 * ContainerType
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLib.internal.ContainerType = {

		/**
		 * Type Product
		 * @public
		 */
		Product : "Product",

		/**
		 * Type Product version
		 * @public
		 */
		ProductVersion : "ProductVersion",

		/**
		 * Product Instances in the system
		 * @public
		 */
		ProductInstances : "ProductInstances",

		/**
		 * Software Components in the system
		 * @public
		 */
		SoftwareComponents : "SoftwareComponents"

	};

	return thisLib;

});
