define("zen.rt.components.popup/resources/js/transitionhandler", [], function(){
	
	var Base = function() {
		"use strict";
	
		this.positioner = arguments[0];
		this.baseDuration = 600;
		
		this.preOperations = function(oContext) {
			var
				oAbsLayout = oContext.oAbsLayout,
				oComponentProperties = oContext.oComponentProperties,
				position = this.positioner.calculatePosition(oComponentProperties);

			oAbsLayout.oPopup.setPosition(position.my, position.at, position.of, position.offset, position.collision);
		};
	
		this.open = function() {
		};
	
		this.close = function() {
		};
	
		this.postOperations = function() {
		};
		
		this.addStyle = function(ref) {
			ref.addClass("sapzenpopup");
		};
		
		this.reDocking = function(ref) {
			var 
				dockingPosition = this.positioner.calculateRedocking(ref)
			;
			
			ref.css({
				'top'    : dockingPosition.top,
				'bottom' : dockingPosition.bottom,
				'left'   : dockingPosition.left,
				'right'  : dockingPosition.right
			});
	
			if(dockingPosition.top !== "auto" && dockingPosition.bottom !== "auto") {
				ref.height("auto");
			}
			if(dockingPosition.left !== "auto" && dockingPosition.right !== "auto") {
				ref.width("auto");
			}
		};
		
		this.getBaseDuration = function() {
			return this.baseDuration;
		};
	};
	
	
	///////////////// None //////////////////
	var None = function() {
		"use strict";
		var 
			that = this
		;
	
		Base.apply(this, arguments);
		
		this.open = function($Ref, iDuration, fnCallback) {
			that.addStyle($Ref);
			fnCallback();
			that.reDocking($Ref);
			
			setTimeout(function() {
				$Ref.attr("tabindex", 0)
				    .focus();
			}, 10);
			
		};
		this.close = function($Ref, iDuration, fnCallback) {
			fnCallback();
		};
		this.getDuration = function() {
			return 0;
		};
		
		this.getType = function(){
			return "none";
		};
	
	};
	
	///////////////// Fade //////////////////
	var Fade = function() {
		"use strict";
		var 
			that = this
		;
	
		Base.apply(this, arguments);
		
		this.open = function($Ref, iDuration, fnCallback) {
			that.addStyle($Ref);
			
			$Ref.hide().fadeIn(iDuration, function() {
				fnCallback();
				that.reDocking($Ref);
			});
			
			setTimeout(function() {
				$Ref.attr("tabindex", 0)
				    .focus();
			}, iDuration);
			
		};
		this.close = function($Ref, iDuration, fnCallback) {
			iDuration = that.getDuration();
			$Ref.fadeOut(iDuration, function() {
				fnCallback && fnCallback();
			});
		};
		this.getDuration = function() {
			return this.getBaseDuration();
		};
	
		this.getType = function(){
			return "fade";
		};

	};
	
	///////////////// SlideHorizontal //////////////////
	var SlideHorizontal = function() {
		"use strict";
		
		var 
			that = this,
			slideFrom = "left",
			position,
			toHandle = null
		;
	
		Base.apply(this, arguments);
		
		this.preOperations = function(oContext) {
			var
				oAbsLayout = oContext.oAbsLayout,
				oComponentProperties = oContext.oComponentProperties,
				offset = this.positioner.getHorizontalOffset(oComponentProperties);
			
			position = this.positioner.calculatePosition(oComponentProperties), 
			slideFrom = oComponentProperties.leftmargin !== "auto" ? "left" : "right";
			oAbsLayout.oPopup.setPosition(position.my, position.at, position.of, offset, position.collision);
		};
	
		this.open = function($Ref, iDuration, fnCallback) {
			that.addStyle($Ref);
			
			document.getElementById("ROOT_absolutelayout").style.width = window.getComputedStyle(document.getElementById("ROOT_absolutelayout")).width;
			document.body.style.overflow = "hidden";
			document.body.style.position = "relative";
			document.getElementsByTagName("html")[0].style.overflow = "hidden";
			document.getElementsByTagName("html")[0].style.position = "relative";
			
			$Ref.css({
				'transition'        : slideFrom + ' ' +  iDuration + 'ms',
				'-moz-transition'   : slideFrom + ' ' +  iDuration + 'ms',
				'-webkit-transition': slideFrom + ' ' +  iDuration + 'ms'
			});
	
			toHandle = setTimeout(function(){
				fnCallback();
				that.reDocking($Ref);
				$Ref.attr("tabindex", 0).focus();
				
				document.getElementById("ROOT_absolutelayout").style.width = "100%";
				document.body.style.overflow = "visible";
				document.body.style.position = "static";
				document.getElementsByTagName("html")[0].style.overflow = "visible";
				document.getElementsByTagName("html")[0].style.position = "static";
				
				toHandle = null;
			}, iDuration);
			
			this.getType = function(){
				return "slidehorizontal";
			};
	};
	
		this.close = function($Ref, iDuration, fnCallback) {
			var jqBody = $("body");
			
			var cssObj = (slideFrom === "left" 
							? {"left"  : (-$Ref.width() - 30)+"px"}
						    : {"right" : (-$Ref.width() - 30)+"px"}
						),
				viewportWidth = jqBody.width(),
				deltaWidth = $Ref.outerWidth()-$Ref.width(),
				width,
				dockingPosition;
	
			if(toHandle) {
				clearTimeout(toHandle);
			}
			else {
					document.getElementById("ROOT_absolutelayout").style.width = window.getComputedStyle(document.getElementById("ROOT_absolutelayout")).width;
					document.body.style.overflow = "hidden";
					document.body.style.position = "relative";
					document.getElementsByTagName("html")[0].style.overflow = "hidden";
					document.getElementsByTagName("html")[0].style.position = "relative";
			}
			iDuration = that.getDuration();
			dockingPosition = that.positioner.getDockingPosition();
			
			if(dockingPosition && dockingPosition.left !== "auto" && dockingPosition.right !== "auto") {
				width = Math.round(viewportWidth - parseInt($Ref.css("left")) - parseInt($Ref.css("right")) - deltaWidth);
				$Ref.css({
					"width": width + "px",
					"right": "auto"
				});
			}
			
			setTimeout(function() {
				$Ref.css(cssObj);
			}, 10);
	
			setTimeout(function(){
				fnCallback();
					document.getElementById("ROOT_absolutelayout").style.width = "100%";
					document.body.style.overflow = "visible";
					document.body.style.position = "static";
					document.getElementsByTagName("html")[0].style.overflow = "visible";
					document.getElementsByTagName("html")[0].style.position = "static";
			}, iDuration);
		};
	
		this.postOperations = function(oContext) {
			oContext.oAbsLayout.oPopup.setPosition(position.my, position.at, position.of, position.offset, position.collision);
		};
		this.getDuration = function() {
			return this.getBaseDuration() * 2;
		};
		
		this.getType = function(){
			return "slidehorizontal";
		};

	};
	
	///////////////// SlideVertical //////////////////
	var SlideVertical = function() {
		"use strict";
		
		var 
			that = this,
			slideFrom = "top",
			position,
			toHandle = null
		;
	
		Base.apply(this, arguments);
	
		this.preOperations = function(oContext) {
			var
				oComponentProperties = oContext.oComponentProperties,
				offset = this.positioner.getVerticalOffset(oComponentProperties);
			
			position = this.positioner.calculatePosition(oComponentProperties),
			slideFrom = oComponentProperties.topmargin !== "auto" ? "top" : "bottom";
			oContext.oAbsLayout.oPopup.setPosition(position.my, position.at, position.of, offset, position.collision);
		};
	
		this.open = function($Ref, iDuration, fnCallback) {
			var 
				magic = slideFrom
			;
			
			if(magic === "bottom") {
				magic = "top";	// workaround strange sapui5 popup positioning (docking for bottom => top)
			}
			
			that.addStyle($Ref);
	
			document.getElementById("ROOT_absolutelayout").style.height = window.getComputedStyle(document.getElementById("ROOT_absolutelayout")).height;
			document.body.style.overflow = "hidden";
			document.body.style.position = "relative";
			document.getElementsByTagName("html")[0].style.overflow = "hidden";
			document.getElementsByTagName("html")[0].style.position = "relative";
			
			$Ref.css({
				'transition'        : magic + ' ' +  iDuration + 'ms',
				'-moz-transition'   : magic + ' ' +  iDuration + 'ms',
				'-webkit-transition': magic + ' ' +  iDuration + 'ms'
			});
	
			toHandle = setTimeout(function(){
				fnCallback();
				$Ref.css({
					'transition'        : 'none',
					'-moz-transition'   : 'none',
					'-webkit-transition': 'none'
				});
				that.reDocking($Ref);
				$Ref.attr("tabindex", 0)
			        .focus();
	
					document.getElementById("ROOT_absolutelayout").style.height = "100%";
					document.body.style.overflow = "visible";
					document.body.style.position = "static";
					document.getElementsByTagName("html")[0].style.overflow = "visible";
					document.getElementsByTagName("html")[0].style.position = "static";
	
				toHandle = null;
			}, iDuration);
		};
	
		this.close = function($Ref, iDuration, fnCallback) {
			var 
				cssObj = (slideFrom === "top" 
							? {"top"  : (-$Ref.height() - 30)+"px"}
						    : {"bottom" : (-$Ref.height() - 30)+"px"}
						),
				viewportHeight = $("body").height(),
				deltaHeight = $Ref.outerHeight()-$Ref.height(),
				height,
				dockingPosition
			;
			
			if(toHandle) {
				clearTimeout(toHandle);
			}
			else {
	
					document.getElementById("ROOT_absolutelayout").style.height = window.getComputedStyle(document.getElementById("ROOT_absolutelayout")).height;
					document.body.style.overflow = "hidden";
					document.body.style.position = "relative";
					document.getElementsByTagName("html")[0].style.overflow = "hidden";
					document.getElementsByTagName("html")[0].style.position = "relative";
	
			}
			iDuration = that.getDuration();
			dockingPosition = that.positioner.getDockingPosition();
			if(dockingPosition && dockingPosition.top !== "auto" && dockingPosition.bottom !== "auto") {
				height = Math.round(viewportHeight - parseInt($Ref.css("top")) - parseInt($Ref.css("bottom")) - deltaHeight);
				$Ref.css({
					"height": height + "px",
					"bottom": "auto"
				});
			}
			
			$Ref.css({
				'transition'        : slideFrom + ' ' +  iDuration + 'ms',
				'-moz-transition'   : slideFrom + ' ' +  iDuration + 'ms',
				'-webkit-transition': slideFrom + ' ' +  iDuration + 'ms'
			});
			
			setTimeout(function(){
				$Ref.css(cssObj);
			}, 10);
	
			setTimeout(function(){
				fnCallback && fnCallback();
	
				document.getElementById("ROOT_absolutelayout").style.height = "100%";
				document.body.style.overflow = "visible";
				document.body.style.position = "static";
				document.getElementsByTagName("html")[0].style.overflow = "visible";
				document.getElementsByTagName("html")[0].style.position = "static";
	
			}, iDuration);
		};
	
		this.postOperations = function(oContext) {
			oContext.oAbsLayout.oPopup.setPosition(position.my, position.at, position.of, position.offset, position.collision);
		};
		this.getDuration = function() {
			return this.getBaseDuration() * 2;
		};
		
		this.getType = function(){
			return "slidevertical";
		};

	};
	
	///////////////// Pop //////////////////
	var Pop = function() {
		"use strict";
	
		var
			that = this,
			toHandle
		;
	
		Base.apply(this, arguments);
	
		this.open = function($Ref, iDuration, fnCallback) {
			that.addStyle($Ref);
			
			$Ref.css({
				'display':'block',
				
				'-webkit-animation-duration' : iDuration + 'ms',
				'-webkit-animation-name' : 'popin',
					
				'-moz-animation-duration' : iDuration + 'ms',
				'-moz-animation-name' : 'popin',
					
				'-ms-animation-duration' : iDuration + 'ms',
				'-ms-animation-name' : 'popin',
					
				'animation-duration' : iDuration + 'ms',
				'animation-name' : 'popin'
			});		
			
			toHandle = setTimeout(function(){
				fnCallback();
				that.reDocking($Ref);
				$Ref.attr("tabindex", 0)
				    .focus();
			}, iDuration);
			
		};
	
		this.close = function($Ref, iDuration, fnCallback) {
			clearTimeout(toHandle);
			iDuration = that.getDuration();
			$Ref.css({
				'-webkit-animation-duration' : iDuration+'ms',
				'-webkit-animation-name' : 'popout',
				
				'-moz-animation-duration' : iDuration+'ms',			
				'-moz-animation-name' : 'popout',
				
				'-ms-animation-duration' : iDuration+'ms',
				'-ms-animation-name' : 'popout',
				
				'animation-duration' : iDuration+'ms',
				'animation-name' : 'popout'
			});
		
			setTimeout(function(){
				fnCallback();
			}, iDuration);
		};
		this.getDuration = function() {
			return this.getBaseDuration() * 1.5;
		};
		
		this.getType = function(){
			return "pop";
		};
		
	};
	
	///////////////// Flip //////////////////
	var Flip = function() {
		"use strict";
	
		var
			that = this
		;
		Base.apply(this, arguments);
	
		this.open = function($Ref, iDuration, fnCallback) {
			that.addStyle($Ref);
			
			$Ref.css({
				'display':'block',
				
				'-webkit-animation-duration' : iDuration + 'ms',
				'-webkit-backface-visibility': 'visible !important',
				'-webkit-animation-name': 'flipInY',
				
				'-moz-animation-duration' : iDuration + 'ms',
				'-moz-backface-visibility': 'visible !important',
				'-moz-animation-name': 'flipInY',
				
				'-ms-animation-duration' : iDuration + 'ms',
				'-ms-backface-visibility': 'visible !important',
				'-ms-animation-name': 'flipInY',
				
				'-o-animation-duration' : iDuration + 'ms',
				'-o-backface-visibility': 'visible !important',
				'-o-animation-name': 'flipInY',
				
				'animation-duration' : iDuration + 'ms',
				'backface-visibility': 'visible !important',
				'animation-name': 'flipInY'
			});		
			
			setTimeout(function(){
				fnCallback();
				that.reDocking($Ref);
				$Ref.attr("tabindex", 0)
				    .focus();
			}, iDuration);
		};
	
		this.close = function($Ref, iDuration, fnCallback) {
			iDuration = that.getDuration();
			$Ref.css({
				'-webkit-animation-duration' : iDuration + 'ms',
				'-webkit-backface-visibility': 'visible !important',
				'-webkit-animation-name': 'flipOutY',
		
				'-moz-animation-duration' : iDuration+'ms',
				'-moz-backface-visibility': 'visible !important',
				'-moz-animation-name': 'flipOutY',
		
				'-ms-animation-duration' : iDuration+'ms',
				'-ms-backface-visibility': 'visible !important',
				'-ms-animation-name': 'flipOutY',
		
				'-o-animation-duration' : iDuration+'ms',
				'-o-backface-visibility': 'visible !important',
				'-o-animation-name': 'flipOutY',
		
				'animation-duration' : iDuration+'ms',
				'backface-visibility': 'visible !important',
				'animation-name': 'flipOutY'
			});
		
			setTimeout(function(){
				fnCallback();
			}, iDuration);
		};
		this.getDuration = function() {
			return this.getBaseDuration() * 2;
		};
		
		this.getType = function(){
			return "flip";
		};
		
	};
	
	return [None, Fade, SlideHorizontal, SlideVertical, Pop, Flip];

});
