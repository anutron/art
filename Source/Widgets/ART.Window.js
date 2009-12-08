/*
Script: ART.Window.js

License:
	MIT-style license.
*/

// Window Widget. Work in progress.

ART.Sheet.defineStyle('window', {
	'height': 300,
	'width': 400,
	
	'max-height': 800,
	'max-width': 1000,
	
	'min-height': 110,
	'min-width': 300,
	
	'top': 100,
	'left': 100,
	
	'caption-font': 'moderna',
	'caption-font-size': 13,
	
	'button-spacing': 20,
	'header-padding-top': 4,
	
	'content-overflow': 'auto',
	
	'corner-radius': 4,
	'header-height': 24,
	'footer-height': 17,

	'caption-font-color': hsb(0, 0, 10),
	'header-background-color': {0: hsb(0, 0, 80), 1: hsb(0, 0, 60)},
	'footer-background-color': {0: hsb(0, 0, 80), 1: hsb(0, 0, 70)},
	'header-reflection-color': {0: hsb(0, 0, 100, 1), 1: hsb(0, 0, 0, 0)},
	'footer-reflection-color': {0: hsb(0, 0, 100, 1), 1: hsb(0, 0, 0, 0)},
	'border-color': hsb(0, 0, 0, 0.4),
	'content-border-top-color': hsb(0, 0, 30),
	'content-border-bottom-color': hsb(0, 0, 50),
	'content-background-color': hsb(0, 0, 100)

});

ART.Sheet.defineStyle('window:disabled', {
	'caption-font-color': hsb(0, 0, 30),
	'header-background-color': {0: hsb(0, 0, 95), 1: hsb(0, 0, 80)},
	'footer-background-color': {0: hsb(0, 0, 95), 1: hsb(0, 0, 90)},
	'header-reflection-color': {0: hsb(0, 0, 100, 1), 1: hsb(0, 0, 0, 0)},
	'footer-reflection-color': {0: hsb(0, 0, 100, 1), 1: hsb(0, 0, 0, 0)},
	'border-color': hsb(0, 0, 0, 0.2),
	'content-border-top-color': hsb(0, 0, 60),
	'content-border-bottom-color': hsb(0, 0, 70),
	'content-background-color': hsb(0, 0, 100),
	'content-color': hsb(0, 0, 0)
});

ART.Sheet.defineStyle('window footer-text', {
	'float': 'left',
	'margin': '3px 14px 0px 4px'
});

ART.Sheet.defineStyle('window button.wincontrol', {
	'pill': true,
	'height': 14,
	'width': 14,
	'cursor': 'pointer',
	'background-color': {0: hsb(0, 0, 75), 1: hsb(0, 0, 55)},
	'reflection-color': {0: hsb(0, 0, 95), 1: hsb(0, 0, 0, 0)},
	'shadow-color': hsb(0, 0, 100, 0.4),
	'border-color': hsb(0, 0, 45),
	'glyph-color': hsb(0, 0, 0, 0.6)
});

ART.Sheet.defineStyle('window button.wincontrol:disabled', {
	'background-color': {0: hsb(0, 0, 100, 0.6), 1: hsb(0, 0, 100, 0.6)},
	'reflection-color': {0: hsb(0, 0, 100), 1: hsb(0, 0, 0, 0)},
	'shadow-color': hsb(0, 0, 100, 0.2),
	'border-color': hsb(0, 0, 45, 0.5),
	'glyph-color': hsb(0, 0, 0, 0.4)
});

ART.Sheet.defineStyle('window button.wincontrol:active', {
	'background-color': hsb(0, 0, 65),
	'reflection-color': {0: hsb(0, 0, 65), 1: hsb(0, 0, 0, 0)},
	'border-color': hsb(0, 0, 45),
	'glyph-color': hsb(0, 0, 100)
});

ART.Sheet.defineStyle('window button.close', {
	'glyph': 'close-icon',
	
	'glyph-height': 4,
	'glyph-width': 4,
	'glyph-top': 5,
	'glyph-left': 5
});

ART.Sheet.defineStyle('window button.minimize', {
	'glyph': 'minus-icon',

	'glyph-height': 6,
	'glyph-width': 6,
	'glyph-top': 4,
	'glyph-left': 4
});

ART.Sheet.defineStyle('window button.maximize', {
	'glyph': 'plus-icon',

	'glyph-height': 6,
	'glyph-width': 6,
	'glyph-top': 4,
	'glyph-left': 4
});

ART.Sheet.defineStyle('window:dragging', {
	'content-visibility': 'hidden',
	'background-color': hsb(0, 0, 0, 0.1)
});

ART.Window = new Class({
	
	Extends: ART.StickyWin,
	
	name: 'window',
	
	options: { 
		/*
		caption: null,
		autosize: false,
		*/
		min: {/* height: null, width: null */},
		max: {/* height: null, width: null */},
		close: true,
		minimize: true,
		maximize: true,
		resizable: true,
		draggable: true,
		shadow: Browser.Engine.webkit,
		cascaded: true
	},

	initialize: function(options){
		this.requireToRender('window:navButtons', 'window:paint');
		this.parent(options);
		if (this.options.resizable) this.makeResizeable();
	},

	build: function(){
		this.parent();
		var self = this;
		var relative = {
			position: 'relative', 
			top: 0, 
			left: 0
		};
		var absolute = {
			position: 'absolute', 
			top: 0, 
			left: 0
		};
		
		this.paint = new ART.Paint();
		$(this.paint).setStyles(absolute).inject(this.element);
		this.readyToRender('window:paint');
		
		this.contents = new Element('div').inject(this.element);
		
		this.header = new Element('div', {
			'class': 'art-window-header',
			styles: $merge(relative, {
				top: 1,
				left: 1,
				overflow: 'hidden'
			})
		});
		this.content = new Element('div', {
			'class': 'art-window-content',
			styles: $merge(relative, {
				overflow: 'auto',
				position: 'relative'
			})
		});
		this.footer = new Element('div', {
			'class': 'art-window-footer',
			styles: $merge(relative, {
				top: 1,
				left: 1,
				overflow: 'hidden',
				clear: 'both'
			})
		});
		this.footerText = new Element('div', {
			'class': 'footer-text'
		}).inject(this.footer);
		this.makeButtons();
		this.readyToRender('window:navButtons');
		this.contents.adopt(this.header, this.content, this.footer);
	},

	makeButtons: function() {
		this.buttons = {};
		var style = ART.Sheet.lookupStyle(this.getSelector());
		var actions = {
			close: this.hide.bind(this),
			maximize: this.maximize.bind(this),
			minimize: this.minimize.bind(this)
		};
		var baseLeft = 6;
		['close', 'minimize', 'maximize'].each(function(button){
			if (this.options[button]) {
				this.buttons[button] = new ART.Button({
					className: button + ' wincontrol',
					parentWidget: this,
					tabIndex: -1
				});
				$(this.buttons[button]).setStyles({
					'position': 'absolute',
					'top': style.headerPaddingTop, 
					'left': baseLeft
				}).inject(this.header);
				baseLeft = baseLeft + style.buttonSpacing;
				this.buttons[button].addEvent('press', actions[button]);
			}
		}, this);
	},

	maximize: function(){
		this.minMax('maximize');
	},

	minimize: function(){
		this.minMax('minimize');
	},

	minMax: function(operation){
		if ($type(this.options[operation]) == "function") {
			this.options[operation].call(this);
		} else {
			this.enable();
			var style = this.getSizeRange();
			var prefix = operation == 'maximize' ? 'max' : 'min';
			var w = style[prefix + 'Width'], h = style[prefix + 'Height'];
			var beforeStr = 'before'+ operation.capitalize();
			if (this[beforeStr]) {
				w = this[beforeStr].width;
				h = this[beforeStr].height;
				this[beforeStr] = null;
			} else {
				this[beforeStr] = this.getSize();
			}
			this.resize(w, h);
		}
		this.fireEvent(operation, [w, h]);
	},

	makeResizeable: function(){
		this.resizeHandle = new Element('div', {'class': 'art-window-resize-handle'});
		this.resizeHandle.setStyles({
			position: 'absolute',
			height: 17,
			width: 17,
			right: 0,
			bottom: 0
		});
		this.resizeHandle.inject(this.footer);
		
		this.touchResize = new Touch(this.resizeHandle);
		
		this.touchResize.addEvent('start', function(){
			this.startHeight = this.contents.offsetHeight;
			this.startWidth = this.contents.offsetWidth;
			this.fireEvent('resize:start');
		}.bind(this));

		var dragging;
		this.touchResize.addEvent('move', function(dx, dy){
			this.fireEvent('resize:move', [dx, dy]);
			if (!dragging) {
				this.displayForDrag(true, false);
				dragging = true;
			}
			this.resize(this.startWidth + dx, this.startHeight + dy);
		}.bind(this));
		
		this.touchResize.addEvent('end', function(){
			if (dragging) {
				dragging = false;
				this.displayForDrag(false);
			}
			this.fireEvent('resize:end');
		}.bind(this));
	},

	makeDraggable: function(){
		this.parent(this.header);
	},

	setContent: function(content){
		if (document.id(content) || $type(content) == "array") this.content.adopt(content);
		else if ($type(content) == "string") this.content.set('html', content);
		if (this.options.autosize) this.autosize();
		return this;
	},
	
	autosize: function(){
		if (!this.boundAutoSize) this.boundAutoSize = this.autosize.bind(this);
		if (this.hidden) {
			this.addEvent('display', this.boundAutoSize);
		} else {
			this.removeEvent('display', this.boundAutoSize);
			var style = ART.Sheet.lookupStyle(this.getSelector());
			this.content.setStyles({
				'float': 'left',
				'width': 'auto'
			});
			var h = this.content.getScrollSize().y + style.headerHeight + style.footerHeight + 2;
			var w = this.content.getScrollSize().x;
			if (h > style.maxHeight) h = style.maxHeight;
			if (w > style.maxWidth) w = style.maxWidth;
			this.setOptions({
				height: h,
				width: w
			});
			this.redraw({
				width: w, 
				height: h
			});
		}
	},
	
	setCaption: function(text){
		this.options.caption = text;
		this.render();
		return this;
	},

	setFooter: function(text) {
		this.footerText.set('html', text);
	},

	makeIframeShim: function(){
		return this.parent(this.contents);
	},

	getSize: function(){
		return {
			width: this.currentWidth,
			height: this.currentHeight
		};
	},

	getSizeRange: function(override){
		var style = ART.Sheet.lookupStyle(this.getSelector());
		var ret = {};
		['min', 'max'].each(function(extreme){
			['width', 'height'].each(function(axis){
				var str = extreme + axis.capitalize();
				var opt = this.options[extreme][axis];
				if ((override && !$defined(override[extreme + axis.capitalize()]) && $defined(opt)) || (!override && $defined(opt))) 
					ret[str] = opt;
				else
					ret[str] = style[str];
			}, this);
		}, this);
		return ret;
	},

	redraw: function(override){
		this.parent.apply(this, arguments);
		var style = ART.Sheet.lookupStyle(this.getSelector());
		var h = style.height, w = style.width;
		// height / width management
		
		delete style.height;
		delete style.width;

		$mixin(style, override);
		if (style.height == null) style.height = this.currentHeight || this.options.height || h;
		if (style.width == null) style.width = this.currentWidth || this.options.width || w;

		var ranges = this.getSizeRange(override);
		style.height = style.height.limit(ranges.minHeight, ranges.maxHeight);
		style.width = style.width.limit(ranges.minWidth, ranges.maxWidth);
		
		this.currentHeight = style.height;
		this.currentWidth = style.width;

		var padding = 0;
		if (this.options.shadow) padding = 20;
		this.paint.resize({x: style.width + padding, y: style.height + padding});
		
		this.contents.setStyles({
			'height': style.height,
			'width': style.width,
			'visibility': style.contentVisibility || 'visible'
		});
		this.renderContent(style);
		this.renderHeaderText(style);
		this.renderResize(style);
		this.paint.restore();
		$(this.paint).setStyles({
			top: this.options.shadow ? -6 : -1,
			left: this.options.shadow ? -11 : -1
		});
		if (this.shim) this.shim.position();
		this.fireEvent('resize', [this.contentSize.w, this.contentSize.h]);
	},
	
	renderContent: function(style){
		var contentHeight = style.height - style.footerHeight - style.headerHeight - 2;
		var contentWidth = style.width -2;
		this.contentSize = {
			w: contentWidth, 
			h: contentHeight
		};
		if (style.contentVisibility == "hidden") {
			this.content.setStyle('display', 'none');
		} else {
			this.content.setStyles({
				'top': 1,
				'left': 0,
				'height': contentHeight < 0 ? 0 : contentHeight,
				'width': contentWidth < 0 ? 0 : contentWidth,
				'background-color': style.contentBackgroundColor,
				'color': style.contentColor,
				'overflow': style.contentOverflow,
				'display': 'block'
			});
		}
		
		// border layer
		this.paint.save();
		
		if (this.options.shadow) this.paint.shift({x: 10, y: 5});
		
		this.paint.start();
		this.paint.shape('rounded-rectangle', {x: style.width, y: style.height}, style.cornerRadius + 1);
		
		var border = {'fill': true, 'fill-color': style.borderColor};
		
		if (this.options.shadow) $mixin(border, {
			'shadow-color': hsb(0, 0, 0),
			'shadow-blur': 8,
			'shadow-offset-x': 0,
			'shadow-offset-y': 5
		});
		
		this.paint.end(border);

		this.header.setStyles({'width': style.width - 2, height: style.headerHeight - 2});
		this.footer.setStyles({'width': style.width - 2, 'height': style.footerHeight});
		
		// header layers
		if (style.contentVisibility == 'hidden') {
			this.paint.start({x: 1, y: 1});
			this.paint.shape('rounded-rectangle', {x: style.width - 2, y: style.height - 2}, style.cornerRadius);
			this.paint.end({'fill': true, 'fill-color': style.backgroundColor});
		} else {
		
			this.paint.start({x: 1, y: 1});
			this.paint.shape('rounded-rectangle', {x: style.width - 2, y: style.headerHeight - 2}, [style.cornerRadius, style.cornerRadius, 0, 0]);
			this.paint.end({'fill': true, 'fill-color': style.headerReflectionColor});

			this.paint.start({x: 1, y: 2});
			this.paint.shape('rounded-rectangle', {x: style.width - 2, y: style.headerHeight - 3}, [style.cornerRadius, style.cornerRadius, 0, 0]);
			this.paint.end({'fill': true, 'fill-color': style.headerBackgroundColor});
		
			// first content separator border
		
			this.paint.start({x: 1.5, y: style.headerHeight - 0.5});
			this.paint.lineTo({x: style.width - 3, y: 0});
			this.paint.end({'stroke': true, 'stroke-color': style.contentBorderTopColor});
		
			// second content separator border
		
			this.paint.start({x: 1.5, y: style.height - style.footerHeight - 1.5});
			this.paint.lineTo({x: style.width - 3, y: 0});
			this.paint.end({'stroke': true, 'stroke-color': style.contentBorderBottomColor});
		
			//footer layers
				
			this.paint.start({x: 1, y: style.height - style.footerHeight - 1});
			this.paint.shape('rounded-rectangle', {x: style.width - 2, y: style.footerHeight}, [0, 0, style.cornerRadius, style.cornerRadius]);
			this.paint.end({'fill': true, 'fill-color': style.footerReflectionColor});
		
			this.paint.start({x: 1, y: style.height - style.footerHeight});
			this.paint.shape('rounded-rectangle', {x: style.width - 2, y: style.footerHeight - 1}, [0, 0, style.cornerRadius, style.cornerRadius]);
			this.paint.end({'fill': true, 'fill-color': style.footerBackgroundColor});
			
			this.footerText.setStyles(ART.Sheet.lookupStyle(this.getSelector() + ' footer-text'));
		}
	},
	
	renderResize: function(style){
		if (!this.options.resizable) return;

		var drawLines = function(){
			this.paint.lineBy({x: -10, y: 10}).moveBy({x: 4, y: 0}).lineBy({x: 6, y: -6}).moveBy({x: 0, y: 4}).lineBy({x: -2, y: 2});
		};
		
		this.paint.start({x: style.width - 2, y: style.height - 13});
		drawLines.call(this);
		this.paint.end({'stroke': true, 'stroke-color': hsb(0, 0, 100, 0.5)});
		
		this.paint.start({x: style.width - 3, y: style.height - 13});
		drawLines.call(this);
		this.paint.end({'stroke': true, 'stroke-color': hsb(0, 0, 0, 0.4)});
	},
	
	renderHeaderText: function(style){
		// font
		if (style.contentVisibility != 'hidden') {
			var font = ART.Paint.lookupFont(style.captionFont);
			var fontBounds = font.measure(style.captionFontSize, this.options.caption || '');
		
			// header text
		
			var spare = (style.width - fontBounds.x) / 2;
		
			this.paint.start({x: spare, y: style.headerPaddingTop + 3});
			this.paint.text(font, style.captionFontSize, this.options.caption || "");
			this.paint.end({'fill': true, 'fill-color': style.captionFontColor});
		}
	},

	initialSize: $empty,

	displayForDrag: function(dragging, render){
		render = $pick(render, true);
		this.element[dragging ? 'addClass' : 'removeClass'](this.prefix + '-dragging');
		this[dragging ? 'addPseudo' : 'removePseudo']('dragging');
		if (render) this.render();
		this.fireEvent('shade', dragging);
	}

});

ART.WindowTools = new Class({

	getWindow: function(){
		return this.getWindowElement().retrieve('art-window');
	},

	getWindowElement: function(){
		return $(this).hasClass('art-window') ? $(this) : $(this).getParent('.art-window');
	}

});

/* 
TODO
 * header can overlap buttons
 * drag options, resize options; touch doesn't have the same features...
*/