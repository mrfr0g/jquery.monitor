jQuery.monitor v0.2
==============

A jQuery plugin which allows you to monitor style changes on elements.

## Why

Often I have to work with applications which utilize multiple libraries and even frameworks, and it's difficult to respond to events without tightly coupling the frameworks; This is not ideal. Consider the following example;


    <div id="container" style="width: 500px; height: 500px;">
        <div id="panel" style="width: 400px;"></div>
    </div>


Library A controls #container, and Library B controls panel. Both need to respond to a window.resize event, #container can be equal to the viewports width, but #panel needs to be 100px smaller than #container. This is a classic race condition; Library B needs to wait for Library A to respond to the resize event first, so that it can appropriately size #panel. Typically you'll use a setInterval, or setTimeout and wait for Library A to resolve the event.

## How

jQuery.monitor attempts to attach a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to the selected elements if it's available. If not, the plugin will fallback to [DOMAttrModified](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events) and finally to [propertychanged](http://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged.propertychanged.aspx). Using these mutator events assures the best possible performance when responding to the style change. jQuery.monitor *DOES NOT* use any form of polling to detect style changes.

## Demo
    
    <div id="container">
        <div id="panel"></div>
    </div>

    <script>
        // Keep #panel the same dimensions as #container
        $('#container').monitor(['width', 'height'], function (changes) {
            /**
             * `changes` is an object with the styles that actually changed
             */

            $('#panel').css(changes);
        });

        // Trigger the style update with jQuery
        $('#container').css({
            width: '100px',
            height: '100px'
        });
        
        // You can trigger the update any way you want, here is an example updating the dimensions with Ext
        Ext.get('#container').setWidth(100);

        // Or just update the style property directly
        document.getElementById('container').style.height = '1000px';
    </script>

## API

    jQuery.monitor( {Array} stylesToMonitor, [{Function} callbackWhenStylesAreUpdated] )

## Browser Support

jQuery.monitor utilizes feature testing, so browser support is difficult to nail down. Generally if the browser supports MutationObservers, DOMAttrModified, or propertychanged events then jQuery.monitor will work. The plugin has been tested on IE8/9/10/11, Chrome (latest), and Firefox (latest). 

## Todo

1. Provide method to stop monitoring
2. Add additional style tests
3. Stop attaching a cache property to the element directly, as this triggers a property update

## License

The MIT License (MIT)

Copyright (c) 2014 Michael Camden

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.