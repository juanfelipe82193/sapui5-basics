sap.ui.define( [
    "sap/ui/core/Component"
], function ( Component ) {

    "use strict";

    var sComponentName = "sap.ushell.demo.UIPluginMadeWithLove.Component";
    var oShellContainer;
    var fnOnRendererCreated;

    var svg;
    var svgDisplayCyclicStateQueue;

    return Component.extend( sComponentName, {

        init: function () {
            getRenderer().then( fnRender.bind( null, this ), fnLogRenderError );
        },

        exit: function () {
            if ( oShellContainer && fnOnRendererCreated ) {
                oShellContainer.detachRendererCreatedEvent( fnOnRendererCreated );
            }
        },

        metadata: {
            manifest: "json"
        }
    } );

    function getRenderer() {
        return jQuery.Deferred( function ( oDeferred ) {

            var oRenderer;

            oShellContainer = jQuery.sap.getObject( "sap.ushell.Container" );

            if ( !oShellContainer ) {
                return oDeferred.reject( "Cannot render outside unified shell" );
            }

            oRenderer = oShellContainer.getRenderer();

            if ( oRenderer ) {
                return oDeferred.resolve( oRenderer );
            }

            fnOnRendererCreated = function ( oEvent ) {
                var oRenderer = oEvent.getParameter( "renderer" );

                if ( oRenderer ) {
                    return oDeferred.resolve( oRenderer );
                }

                oDeferred.reject( "Cannot render outside unified shell" );
            };

            oShellContainer.attachRendererCreatedEvent( fnOnRendererCreated );
        } ).promise();
    }

    function addHeart( heartContent ) {
        var g = document.createElementNS( "http://www.w3.org/2000/svg", "g" );
        var style = document.createElement( "style" );
        var path, text;

        svgDisplayCyclicStateQueue = [ "block", "none" ];

        style.type = "text/css";
        style.innerHTML = ".heart-flp{display:none;}.heart-beat{display:block;position:fixed;animation:pulse 1.5s ease-in-out infinite;top:calc(50% - 25px);left:calc(50% - 25px);width:75px;fill:#457288;color:#fff;font-size:3em;text-align:center;font-weight:700;font-family:Monaco,Courier,'Lucida Console','Courier New',monospace}@keyframes pulse{0.000%{transform:scale(1)}5.000%{transform:scale(1.1)}10.00%{transform:scale(1.2)}15.00%{transform:scale(1.3)}20.00%{transform:scale(1.4)}25.00%{transform:scale(1.5)}30.00%{transform:scale(1.6)}35.00%{transform:scale(1.7)}40.00%{transform:scale(1.8)}45.00%{transform:scale(1.9)}50.00%{transform:scale(2)}55.00%{transform:scale(1.9)}60.00%{transform:scale(1.8)}65.00%{transform:scale(1.7)}70.00%{transform:scale(1.6)}75.00%{transform:scale(1.5)}80.00%{transform:scale(1.4)}85.00%{transform:scale(1.3)}90.00%{transform:scale(1.2)}95.00%{transform:scale(1.1)}100.0%{transform:scale(1)}}";

        svg = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
        svg.setAttribute( "viewBox", "0 0 32 29.6" );
        svg.setAttribute( "class", "heart-flp" );

        path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
        path.setAttribute( "d", "M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" );

        text = document.createElementNS( "http://www.w3.org/2000/svg", "text" );
        text.setAttribute( "x", "7" );
        text.setAttribute( "y", "17" );
        text.setAttribute( "fill", "white" );
        text.setAttribute( "font-size", "10" );
        text.textContent = heartContent;

        g.appendChild( path );
        g.appendChild( text );
        svg.appendChild( g );

        document.head.appendChild( style );
        document.body.appendChild( svg );
    }

    function fnRender( oContext, oRenderer ) {

        var oPluginParameters, sRendererExtMethod;

        oPluginParameters = oContext.getComponentData().config;

        switch ( oPluginParameters.position ) {
            case "end":
                sRendererExtMethod = "addHeaderEndItem";
                break;

            case "begin":
                sRendererExtMethod = "addHeaderItem";
                break;

            default:
                jQuery.sap.log.error( "Invalid 'position' parameter, must be one of <begin, end>", undefined, sComponentName );
                return;
        }

        if ( typeof oRenderer[sRendererExtMethod] !== "function" ) {
            jQuery.sap.log.error( "Extension method '" + sRendererExtMethod + "' not supported by shell renderer", undefined, sComponentName );
            return;
        }

        addHeart( oPluginParameters.heartContent || "flp" );

        oRenderer[sRendererExtMethod](
            "sap.ushell.ui.shell.ShellHeadItem",
            {
                tooltip: oPluginParameters.tooltip || "",
                icon: sap.ui.core.IconPool.getIconURI( oPluginParameters.icon || "question-mark" ),
                press: fnOnPluginButtonPressed
            },
            true,
            false
        );

        return;
    }

    function fnLogRenderError( sErrorMessage ) {
        jQuery.sap.log.error( sErrorMessage, undefined, sComponentName );
    }

    function fnOnPluginButtonPressed() {
        svg.classList.toggle( "heart-beat" );
    }
} );
