(function ($) {

	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	var isDOMAttrModifiedSupported = function () {
        var p = document.createElement('p');
        var flag = false;

        if (p.addEventListener) p.addEventListener('DOMAttrModified', function() {
            flag = true
        }, false);
        else if (p.attachEvent) p.attachEvent('onDOMAttrModified', function() {
            flag = true
        });
        else return false;

        p.setAttribute('id', 'target');

        return flag;
    };

    var changeDetected = function (node) {
    	var $node = $(node),
    		size = node.__dimensions__,
    		width = $node.width(),
    		height = $node.height();

    	if(size.width != width || size.height != height) {
    		storeDimensions(node);
    		return true;
    	}
    }

    var attachListener = function (node, callback) {
        if (MutationObserver) {
            var options = {
                subtree: false,
                attributes: true
            };

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(e) {
                	if(e.attributeName == 'style' && changeDetected(node)) {
                		callback.call(node, node.__dimensions__);
                	}
                });
            });

            observer.observe(node, options);

        } else if (isDOMAttrModifiedSupported()) {
            node.on('DOMAttrModified', function(e) {
            	if(e.attrName == 'style') {
            		callback.call(node, node.__dimensions__);
            	}
            });
        } else if ('onpropertychange' in document.body) {
            node.on('propertychange', function(e) {
            	if(window.event.propertyName == 'style') {
            		callback.call(node, node.__dimensions__);
            	}
            });
        }
    }

    var storeDimensions = function (node) {
		var $node = $(node);

		node.__dimensions__ = {
			width: $node.width(),
			height: $node.height()
		};
    }

	$.fn.monitor = function (callback) {
		this.each(function (i, node) {
			storeDimensions(node);			
			attachListener(node, callback);
		});
	};

})(jQuery);