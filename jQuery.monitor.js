(function ($) {
	// Find the supported observer, hopefully not namespaced but you never know
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	/**
	 * Detects if DOMAttrModified is supported 
	 * @return {Boolean}
	 */
	var isDOMAttrModifiedSupported = function () {
		var el = document.createElement('p'),
			supported = false;

		var respondToModified = function () {
			supported = true;
		};

		if(el.addEventListener) {
			el.addEventListener('DOMAttrModified', respondToModified);
		}
		else if(el.attachEvent) {
			el.attachEvent('onDOMAttrModified', respondToModified);
		}

		el.setAttribute('id', 'test-id');

		return supported;
	};

	/**
	 * Detects if the monitored styles are different than the cached, and updates the cache if they are
	 * @param {Element} node
	 * @return {Boolean}
	 */
	var changeDetected = function (node) {
		var $node = $(node),
			monitor = node.__monitor,
			cache = monitor.cache;

		var currentStyles = $node.css(monitor.styles),
			hasUpdates;

		$.each(cache, function (style, cachedValue) {
			if(cachedValue !== currentStyles[style]) {
				hasUpdates = true;
			}
		});

		if(hasUpdates) {
			cacheStyles(node, monitor.styles);
			return true;
		}
	}

	/**
	 * Attaches the best available observer to the node, when a change is detected the `callback` is called
	 * @param {Element} node
	 * @param {Function} callback
	 */
	var attachObserver = function (node, callback) {

		var eventIsStyleChange = function (e) {
			var originalEvent = e.originalEvent,
				attributeName = e.attributeName || originalEvent && originalEvent.attrName || originalEvent && originalEvent.propertyName;
				
			return attributeName && attributeName.indexOf('style') != -1;
		}

		var respondToStyleChange = function (e) {
			if(eventIsStyleChange(e) && changeDetected(node)) {
				callback.call(node, node.__monitor.cache);
			}
		}

		if (MutationObserver) {
			var options = {
				subtree: false,
				attributes: true
			};

			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(respondToStyleChange);
			});

			observer.observe(node, options);

		}
		// DOMAttrModified fallback
		else if (isDOMAttrModifiedSupported()) {
			$(node).on('DOMAttrModified', respondToStyleChange);
		}
		// propertychange fallback for older IEs
		else if ('onpropertychange' in document.body) {
			$(node).on('propertychange', respondToStyleChange);
		}
	}

	/**
	 * Caches the passed styles array on the node
	 * @param {Element} node
	 * @param {Array} styles
	 */
	var cacheStyles = function (node, styles) {
		var $node = $(node);

		node.__monitor = {
			cache : $node.css(styles),
			styles: styles
		};
	}

	/**
	 * The jQuery hook, loops over the selected elements, attaches the best possible observer, and caches the current styles for later comparison
	 * @param {Array} styles
	 * @param {Function} callback
	 */
	$.fn.monitor = function (styles, callback) {
		if(!styles) {
			throw new Error("styles to be monitored are missing");
			return;
		}

		this.each(function (i, node) {
			cacheStyles(node, styles);
			attachObserver(node, callback);
		});

		return this;
	};

})(jQuery);