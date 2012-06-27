/*
	Progressbar plugin.
	Gabe Rankin
	http://www.gaberankin.com
	jQuery 1.4+ required
*/

jQuery.fn.loading = function(options) {
  options = jQuery.extend({
		duration: 5000,
		width: 'css',			//target width of the loading bar.  set this and the following attributes to 'css' if you want to specify the appearance of the bar using the stylesheet
		height: 'css',			//height of the loading bar
		color: 'css',			//color of the loading bar.
		border: 'css',			//details of the container border
		borderWidth: 'css',		//width of the container border
		borderStyle: 'css',		//style of the container border
		borderColor: 'css',		//color of the container border
		padding: 'css',			//this is the padding between the border and the animated loading bar.
		onBegin: jQuery.noop,	//function to call when animation begins
		onComplete: jQuery.noop,//function to call when animation completes
		displayPercent: false,	//whether or not to display progress percentage
		clickTrigger: false,		//the selector or jquery object that when clicked will trigger the loading animation.  If false, animation will begin immediately
		specialPercents: false,	//an array of percentage values that will call function 'onSpecialPercent(specialPercent)'
		onSpecialPercent: jQuery.noop
	}, options);

	return this.each(function() {
		var $me = jQuery(this);
		var cssInfo = { 'ok': false };
		if(options.width != 'css')
		{
			cssInfo['width'] = options.width;
			cssInfo['ok'] = true;
		}
		if(options.height != 'css')
		{
			cssInfo['height'] = options.height;
			cssInfo['ok'] = true;
		}
		if(options.border != 'css')
		{
			cssInfo['border'] = options.border;
			cssInfo['ok'] = true;
		}
		else
		{
			if(options.borderWidth != 'css')
			{
				cssInfo['border-width'] = options.borderWidth;
				cssInfo['ok'] = true;
			}
			if(options.borderStyle != 'css')
			{
				cssInfo['border-width'] = options.borderStyle;
				cssInfo['ok'] = true;
			}
			if(options.borderColor != 'css')
			{
				cssInfo['border-color'] = options.borderColor;
				cssInfo['ok'] = true;
			}
		}
		if(options.padding != 'css')
		{
			cssInfo['padding'] = options.padding;
			cssInfo['ok'] = true;
		}
		if(cssInfo['ok'])
		{
			$me.css(cssInfo);
		}
		cssInfo = { 'ok': false };
		if(options.height != 'css')
		{
			cssInfo['height'] = options.height;
			cssInfo['ok'] = true;
		}
		if(options.color != 'css')
		{
			cssInfo['background-color'] = options.color;
			cssInfo['ok'] = true;
		}
		$me.html('<div class="loading-interior-div" style="width:0px;"></div>');
		var $loading = jQuery('.loading-interior-div', $me);
		if(cssInfo['ok']) $loading.css(cssInfo);
		var targetWidth = options.width == 'css' ? $me.css('width') : options.width;
		var animationOptions = { duration: options.duration, complete:options.onComplete };
		var specialPercents = {};

		if(options.displayPercent)
		{
			var $percent = $('<span class="loading-percent-text">0%</span>').insertAfter($me);
			animationOptions['step'] = function(curwidth, obj) {
									var cur = (obj.pos * 100).toFixed(0);
									$percent.text((obj.pos * 100).toFixed(0) + '%');
									if(jQuery.isArray(options.specialPercents) && specialPercents['percent'+cur])
									{
										options.onSpecialPercent(cur);
										specialPercents['percent'+cur] = false;	//make sure it doesn't get called a second time
									}
								}
		}
		else if(jQuery.isArray(options.specialPercents))
		{
			animationOptions['step'] = function(curwidth, obj) {
									var cur = (obj.pos * 100).toFixed(0);
									if(jQuery.isArray(options.specialPercents) && specialPercents['percent'+cur])
									{
										options.onSpecialPercent(cur);
										specialPercents['percent'+cur] = false;	//make sure it doesn't get called a second time
									}
								}
		}
		if(!options.clickTrigger)
		{
			if(jQuery.isArray(options.specialPercents))
			{
				for(i in options.specialPercents)
				{
					specialPercents['percent'+options.specialPercents[i]] = true;
				}
			}
			options.onBegin();
			$loading.animate({width:targetWidth}, animationOptions);
		}
		else
		{
			jQuery(options.clickTrigger).click(function(){
				if(jQuery.isArray(options.specialPercents))
				{
					for(i in options.specialPercents)
					{
						specialPercents['percent'+options.specialPercents[i]] = true;
					}
				}
				options.onBegin();
				var useOptions = {};	//when using a click handler, have to regenerate options otherwise we run into recursion issues with callback functions.
				for(key in animationOptions)
				{
					useOptions[key] = animationOptions[key];
				}
				$loading.stop().css('width','0').animate({width:targetWidth}, useOptions);
				return false;
			});
		}
		
	});
}