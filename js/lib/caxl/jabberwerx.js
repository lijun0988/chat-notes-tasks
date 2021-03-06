
/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/third_party/jquery/jquery-1.4.2.js*/
/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */
(function( window, undefined ) {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	indexOf = Array.prototype.indexOf;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					if ( elem ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && /^\w+$/.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
	
	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging object literal values or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || jQuery.isArray(copy) ) ) {
					var clone = src && ( jQuery.isPlainObject(src) || jQuery.isArray(src) ) ? src
						: jQuery.isArray(copy) ? [] : {};

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,
	
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 13 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn, i = 0;
				while ( (fn = readyList[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Reset the list of functions
				readyList = null;
			}

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			return jQuery.ready();
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor
			&& !hasOwnProperty.call(obj, "constructor")
			&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwnProperty.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	trim: function( text ) {
		return (text || "").replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length, j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			if ( !inv !== !callback( elems[ i ], i ) ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
		  	[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch( error ) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}

// Mutifunctional method to get and set values to a collection
// The value/s can be optionally by executed if its a function
function access( elems, key, value, exec, fn, pass ) {
	var length = elems.length;
	
	// Setting many attributes
	if ( typeof key === "object" ) {
		for ( var k in key ) {
			access( elems, k, key[k], exec, fn, value );
		}
		return elems;
	}
	
	// Setting one attribute
	if ( value !== undefined ) {
		// Optionally, function values get executed if exec is true
		exec = !pass && exec && jQuery.isFunction(value);
		
		for ( var i = 0; i < length; i++ ) {
			fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
		}
		
		return elems;
	}
	
	// Getting an attribute
	return length ? fn( elems[0], key ) : undefined;
}

function now() {
	return (new Date).getTime();
}
(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: document.createElement("select").appendChild( document.createElement("option") ).selected,

		parentNode: div.removeChild( div.appendChild( document.createElement("div") ) ).parentNode === null,

		// Will be defined later
		deleteExpando: true,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete script.test;
	
	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';

		div = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) { 
		var el = document.createElement("div"); 
		eventName = "on" + eventName; 

		var isSupported = (eventName in el); 
		if ( !isSupported ) { 
			el.setAttribute(eventName, "return;"); 
			isSupported = typeof el[eventName] === "function"; 
		} 
		el = null; 

		return isSupported; 
	};
	
	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},
	
	expando:expando,

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		"object": true,
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache;

		if ( !id && typeof name === "string" && data === undefined ) {
			return null;
		}

		// Compute a unique ID for the element
		if ( !id ) { 
			id = ++uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			elem[ expando ] = id;
			thisCache = cache[ id ] = jQuery.extend(true, {}, name);

		} else if ( !cache[ id ] ) {
			elem[ expando ] = id;
			cache[ id ] = {};
		}

		thisCache = cache[ id ];

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			}

			// Completely remove the data cache
			delete cache[ id ];
		}
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		if ( typeof key === "undefined" && this.length ) {
			return jQuery.data( this[0] );

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
			}
			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else {
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function() {
				jQuery.data( this, key, value );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});
jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i, elem ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});
var rclass = /[\n\t]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /href|src|style/,
	rtype = /(button|input)/i,
	rfocusable = /(button|input|object|select|textarea)/i,
	rclickable = /^(a|area)$/i,
	rradiocheck = /radio|checkbox/;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspace );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ", setClass = elem.className;
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split(rspace);

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value, isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className, i = 0, self = jQuery(this),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( value === undefined ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Typecast each time if the value is a Function and the appended
			// value is therefore different each time.
			if ( typeof val === "number" ) {
				val += "";
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style
		// Using attr for specific style information is now deprecated. Use style instead.
		return jQuery.style( elem, name, value );
	}
});
var rnamespaces = /\.(.*)$/,
	fcleanup = function( nm ) {
		return nm.replace(/[^\w\s\.\|`]/g, function( ch ) {
			return "\\" + ch;
		});
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events = elemData.events || {},
			eventHandle = elemData.handle, eventHandle;

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			handleObj.guid = handler.guid;

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		var ret, type, fn, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)")
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( var j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( var j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data( elem, "handle" );
		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (e) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var target = event.target, old,
				isClick = jQuery.nodeName(target, "a") && type === "click",
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ type ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + type ];

						if ( old ) {
							target[ "on" + type ] = null;
						}

						jQuery.event.triggered = true;
						target[ type ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (e) {}

				if ( old ) {
					target[ "on" + type ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace, events;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		var events = jQuery.data(this, "events"), handlers = events[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, arguments );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this, handleObj.origType, jQuery.extend({}, handleObj, {handler: liveHandler}) ); 
			},

			remove: function( handleObj ) {
				var remove = true,
					type = handleObj.origType.replace(rnamespaces, "");
				
				jQuery.each( jQuery.data(this, "events").live || [], function() {
					if ( type === this.origType.replace(rnamespaces, "") ) {
						remove = false;
						return false;
					}
				});

				if ( remove ) {
					jQuery.event.remove( this, handleObj.origType, liveHandler );
				}
			}

		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( this.setInterval ) {
					this.onbeforeunload = eventHandle;
				}

				return false;
			},
			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

var removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		elem.removeEventListener( type, handle, false );
	} : 
	function( elem, type, handle ) {
		elem.detachEvent( "on" + type, handle );
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = now();

	// Mark it as fixed
	this[ expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();
		}
		// otherwise set the returnValue property of the original event to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var formElems = /textarea|input|select/i,

	changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !formElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information/focus[in] is not needed anymore
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return formElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return formElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			}, 
			teardown: function() { 
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				context.each(function(){
					jQuery.event.add( this, liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				});

			} else {
				// unbind live handler
				context.unbind( liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	}
});

function liveHandler( event ) {
	var stop, elems = [], selectors = [], args = arguments,
		related, match, handleObj, elem, j, i, l, data,
		events = jQuery.data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861)
	if ( event.liveFired === this || !events || !events.live || event.button && event.type === "click" ) {
		return;
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( match[i].selector === handleObj.selector ) {
				elem = match[i].elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		if ( match.handleObj.origHandler.apply( match.elem, args ) === false ) {
			stop = false;
			break;
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return "live." + (type && type !== "*" ? type + "." : "") + selector.replace(/\./g, "`").replace(/ /g, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
if ( window.attachEvent && !window.addEventListener ) {
	window.attachEvent("onunload", function() {
		for ( var id in jQuery.cache ) {
			if ( jQuery.cache[ id ].handle ) {
				// Try/Catch is to handle iframes being unloaded, see #4280
				try {
					jQuery.event.remove( jQuery.cache[ id ].handle.elem );
				} catch(e) {}
			}
		}
	});
}
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];
		
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filter = Expr.filter[ type ], found, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				Sizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					if ( type === "first" ) { 
						return true; 
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, function(all, num){
		return "\\" + (num - 0 + 1);
	}));
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function(query, context, extra, seed){
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ? function(a, b){
	return !!(a.compareDocumentPosition(b) & 16);
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = getText;
jQuery.isXMLDoc = isXML;
jQuery.contains = contains;

return;

window.Sizzle = Sizzle;

})();
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	slice = Array.prototype.slice;

// Implement the identical functionality for filter and not
var winnow = function( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ), length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},
	
	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		if ( jQuery.isArray( selectors ) ) {
			var ret = [], cur = this[0], match, matches = {}, selector;

			if ( cur && selectors.length ) {
				for ( var i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ? 
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur });
							delete matches[selector];
						}
					}
					cur = cur.parentNode;
				}
			}

			return ret;
		}

		var pos = jQuery.expr.match.POS.test( selectors ) ? 
			jQuery( selectors, context || this.context ) : null;

		return this.map(function( i, cur ) {
			while ( cur && cur.ownerDocument && cur !== context ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selectors) ) {
					return cur;
				}
				cur = cur.parentNode;
			}
			return null;
		});
	},
	
	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context || this.context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );
		
		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call(arguments).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return jQuery.find.matches(expr, elems);
	},
	
	dir: function( elem, dir, until ) {
		var matched = [], cur = elem[dir];
		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});
var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /(<([\w:]+)[^>]*?)\/>/g,
	rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<script|<object|<embed|<option|<style/i,
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,  // checked="checked" or checked (html5)
	fcloseTag = function( all, front, tag ) {
		return rselfClosing.test( tag ) ?
			all :
			front + "></" + tag + ">";
	},
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ), contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},
	
	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					 elem.parentNode.removeChild( elem );
				}
			}
		}
		
		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}
		
		return this;
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function() {
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var html = this.outerHTML, ownerDocument = this.ownerDocument;
				if ( !html ) {
					var div = ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(rinlinejQuery, "")
					// Handle the case in IE 8 where action=/test/> self-closes a tag
					.replace(/=([^="'>\s]+\/)>/g, '="$1">')
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
			} else {
				return this.cloneNode(true);
			}
		});

		// Copy the events from the original to the clone
		if ( events === true ) {
			cloneCopyEvent( this, ret );
			cloneCopyEvent( this.find("*"), ret.find("*") );
		}

		// Return the cloned set
		return ret;
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, fcloseTag);

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery(this), old = self.html();
				self.empty().append(function(){
					return value.call( this, i, old );
				});
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery(value).detach();
			}

			return this.each(function() {
				var next = this.nextSibling, parent = this.parentNode;

				jQuery(this).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, value = args[0], scripts = [], fragment, parent;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = buildFragment( args, this, scripts );
			}
			
			fragment = results.fragment;
			
			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						i > 0 || results.cacheable || this.length > 1  ?
							fragment.cloneNode(true) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;

		function root( elem, cur ) {
			return jQuery.nodeName(elem, "table") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
});

function cloneCopyEvent(orig, ret) {
	var i = 0;

	ret.each(function() {
		if ( this.nodeName !== (orig[i] && orig[i].nodeName) ) {
			return;
		}

		var oldData = jQuery.data( orig[i++] ), curData = jQuery.data( this, oldData ), events = oldData && oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var handler in events[ type ] ) {
					jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
				}
			}
		}
	});
}

function buildFragment( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		!rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
}

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;
		
		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;
			
		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
				ret = ret.concat( elems );
			}
		
			return this.pushStack( ret, name, insert.selector );
		}
	};
});

jQuery.extend({
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, fcloseTag);

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				
				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},
	
	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;
		
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			id = elem[ jQuery.expando ];
			
			if ( id ) {
				data = cache[ id ];
				
				if ( data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						} else {
							removeEvent( elem, type, data.handle );
						}
					}
				}
				
				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}
				
				delete cache[ id ];
			}
		}
	}
});
// exclude the following css properties to add px
var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rfloat = /float/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display:"block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],

	// cache check for defaultView.getComputedStyle
	getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
	// normalize float css property
	styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	return access( this, name, value, true, function( elem, name, value ) {
		if ( value === undefined ) {
			return jQuery.curCSS( elem, name );
		}
		
		if ( typeof value === "number" && !rexclude.test(name) ) {
			value += "px";
		}

		jQuery.style( elem, name, value );
	});
};

jQuery.extend({
	style: function( elem, name, value ) {
		// don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		// ignore negative width and height values #1599
		if ( (name === "width" || name === "height") && parseFloat(value) < 0 ) {
			value = undefined;
		}

		var style = elem.style || elem, set = value !== undefined;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// Set the alpha filter to set the opacity
				var opacity = parseInt( value, 10 ) + "" === "NaN" ? "" : "alpha(opacity=" + value * 100 + ")";
				var filter = style.filter || jQuery.curCSS( elem, "filter" ) || "";
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
			}

			return style.filter && style.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( ropacity.exec(style.filter)[1] ) / 100) + "":
				"";
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		name = name.replace(rdashAlpha, fcamelCase);

		if ( set ) {
			style[ name ] = value;
		}

		return style[ name ];
	},

	css: function( elem, name, force, extra ) {
		if ( name === "width" || name === "height" ) {
			var val, props = cssShow, which = name === "width" ? cssWidth : cssHeight;

			function getWH() {
				val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" ) {
					return;
				}

				jQuery.each( which, function() {
					if ( !extra ) {
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					}

					if ( extra === "margin" ) {
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					} else {
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
					}
				});
			}

			if ( elem.offsetWidth !== 0 ) {
				getWH();
			} else {
				jQuery.swap( elem, props, getWH );
			}

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style, filter;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" && elem.currentStyle ) {
			ret = ropacity.test(elem.currentStyle.filter || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				"";

			return ret === "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];

		} else if ( getComputedStyle ) {

			// Only "float" is needed here
			if ( rfloat.test( name ) ) {
				name = "float";
			}

			name = name.replace( rupper, "-$1" ).toLowerCase();

			var defaultView = elem.ownerDocument.defaultView;

			if ( !defaultView ) {
				return null;
			}

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle ) {
				ret = computedStyle.getPropertyValue( name );
			}

			// We should always get a number back from opacity
			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(rdashAlpha, fcamelCase);

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth, height = elem.offsetHeight,
			skip = elem.nodeName.toLowerCase() === "tr";

		return width === 0 && height === 0 && !skip ?
			true :
			width > 0 && height > 0 && !skip ?
				false :
				jQuery.curCSS(elem, "display") === "none";
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}
var jsc = now(),
	rscript = /<script(.|\s)*?\/script>/gi,
	rselectTextarea = /select|textarea/i,
	rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
	jsre = /=\?(&|$)/,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,

	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" ) {
			return _load.call( this, url );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div />")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function() {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function() {
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function( i, elem ) {
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function( val, i ) {
						return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
	jQuery.fn[o] = function( f ) {
		return this.bind(o, f);
	};
});

jQuery.extend({

	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7 (can't request local files),
		// so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
			function() {
				return new window.XMLHttpRequest();
			} :
			function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {}
			},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajax: function( origSettings ) {
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);
		
		var jsonp, status, data,
			callbackContext = origSettings && origSettings.context || s,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = s.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = window[ jsonp ] || function( tmp ) {
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;

				try {
					delete window[ jsonp ];
				} catch(e) {}

				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && type === "GET" ) {
			var ts = now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts + "$2");

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type === "GET" ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			script.src = s.url;
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						success();
						complete();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data || origSettings && origSettings.contentType ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			trigger("ajaxSend", [xhr, s]);
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before this point
				// so we simulate the call
				if ( !requestDone ) {
					complete();
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = jQuery.noop;
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(err) {
						status = "parsererror";
						errMsg = err;
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
					if ( !jsonp ) {
						success();
					}
				} else {
					jQuery.handleError(s, xhr, status, errMsg);
				}

				// Fire the complete handlers
				complete();

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE doesn't allow it, but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					oldAbort.call( xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch(e) { }

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( type === "POST" || type === "PUT" || type === "DELETE" ? s.data : null );
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
			// Fire the complete handlers
			complete();
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		function success() {
			// If a local callback was specified, fire it and pass it the data
			if ( s.success ) {
				s.success.call( callbackContext, data, status, xhr );
			}

			// Fire the global callback
			if ( s.global ) {
				trigger( "ajaxSuccess", [xhr, s] );
			}
		}

		function complete() {
			// Process result
			if ( s.complete ) {
				s.complete.call( callbackContext, xhr, status);
			}

			// The request was completed
			if ( s.global ) {
				trigger( "ajaxComplete", [xhr, s] );
			}

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
		}
		
		function trigger(type, args) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context || s, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
		}
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				// Opera returns 0 when status is 304
				( xhr.status >= 200 && xhr.status < 300 ) ||
				xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		// Opera returns 0 when status is 304
		return xhr.status === 304 || xhr.status === 0;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [];
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix] );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");

		function buildParams( prefix, obj ) {
			if ( jQuery.isArray(obj) ) {
				// Serialize array item.
				jQuery.each( obj, function( i, v ) {
					if ( traditional || /\[\]$/.test( prefix ) ) {
						// Treat each array item as a scalar.
						add( prefix, v );
					} else {
						// If array item is non-scalar (array or object), encode its
						// numeric index to resolve deserialization ambiguity issues.
						// Note that rack (as of 1.0.0) can't currently deserialize
						// nested arrays properly, and attempting to do so may cause
						// a server error. Possible fixes are to modify rack's
						// deserialization algorithm or to provide an option or flag
						// to force array serialization to be shallow.
						buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v );
					}
				});
					
			} else if ( !traditional && obj != null && typeof obj === "object" ) {
				// Serialize object item.
				jQuery.each( obj, function( k, v ) {
					buildParams( prefix + "[" + k + "]", v );
				});
					
			} else {
				// Serialize scalar item.
				add( prefix, obj );
			}
		}

		function add( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		}
	}
});
var elemdisplay = {},
	rfxtypes = /toggle|show|hide/,
	rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, callback ) {
		if ( speed || speed === 0) {
			return this.animate( genFx("show", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");

				this[i].style.display = old || "";

				if ( jQuery.css(this[i], "display") === "none" ) {
					var nodeName = this[i].nodeName, display;

					if ( elemdisplay[ nodeName ] ) {
						display = elemdisplay[ nodeName ];

					} else {
						var elem = jQuery("<" + nodeName + " />").appendTo("body");

						display = elem.css("display");

						if ( display === "none" ) {
							display = "block";
						}

						elem.remove();

						elemdisplay[ nodeName ] = display;
					}

					jQuery.data(this[i], "olddisplay", display);
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = jQuery.data(this[j], "olddisplay") || "";
			}

			return this;
		}
	},

	hide: function( speed, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" ) {
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2);
		}

		return this;
	},

	fadeTo: function( speed, to, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType === 1 && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = p.replace(rdashAlpha, fcamelCase);

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( ( p === "height" || p === "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit !== "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, callback ) {
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop === "height" || this.prop === "width" ) && this.elem.style ) {
			this.elem.style.display = "block";
		}
	},

	// Get the current size
	cur: function( force ) {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(jQuery.fx.tick, 13);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					var old = jQuery.data(this.elem, "olddisplay");
					this.elem.style.display = old ? old : this.options.display;

					if ( jQuery.css(this.elem, "display") === "none" ) {
						this.elem.style.display = "block";
					}
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style(this.elem, p, this.options.orig[p]);
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},
		
	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},
	
	speeds: {
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style(fx.elem, "opacity", fx.now);
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}
if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.curCSS(body, "marginTop", true) ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop, left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.curCSS(body, "marginTop",  true) ) || 0;
			left += parseFloat( jQuery.curCSS(body, "marginLeft", true) ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options, i ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( jQuery.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = jQuery( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( jQuery.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( jQuery.curCSS( elem, "left", true ), 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		var props = {
			top:  (options.top  - curOffset.top)  + curTop,
			left: (options.left - curOffset.left) + curLeft
		};
		
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = /^body|html$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.curCSS(elem, "marginTop",  true) ) || 0;
		offset.left -= parseFloat( jQuery.curCSS(elem, "marginLeft", true) ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.curCSS(offsetParent[0], "borderTopWidth",  true) ) || 0;
		parentOffset.left += parseFloat( jQuery.curCSS(offsetParent[0], "borderLeftWidth", true) ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!/^body|html$/i.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return ("scrollTo" in elem && elem.document) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			jQuery.css( this[0], type, false, "padding" ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			jQuery.css( this[0], type, false, margin ? "margin" : "border" ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}
		
		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		return ("scrollTo" in elem && elem.document) ? // does it walk and quack like a window?
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
			elem.document.body[ "client" + name ] :

			// Get document width or height
			(elem.nodeType === 9) ? // is it a document
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max(
					elem.documentElement["client" + name],
					elem.body["scroll" + name], elem.documentElement["scroll" + name],
					elem.body["offset" + name], elem.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					jQuery.css( elem, type ) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

})(window);

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/third_party/jquery/jquery.jstore-all.js*/
/*!
 * jStore - Persistent Client-Side Storage
 *
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 * 
 * Dual licensed under:
 * 	MIT: http://www.opensource.org/licenses/mit-license.php
 *	GPLv3: http://www.opensource.org/licenses/gpl-3.0.html
 */
/*!
 * jQuery JSON Plugin
 * version: 1.0 (2008-04-17)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris technically wrote this plugin, but it is based somewhat
 * on the JSON.org website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.  I really just cleaned it up.
 *
 * It is also based heavily on MochiKit's serializeJSON, which is 
 * copywrited 2005 by Bob Ippolito.
 */
 
(function($) {   
    function toIntegersAtLease(n) 
    // Format integers to have at least two digits.
    {    
        return n < 10 ? '0' + n : n;
    }

    Date.prototype.toJSON = function(date)
    // Yes, it polutes the Date namespace, but we'll allow it here, as
    // it's damned usefull.
    {
        return this.getUTCFullYear()   + '-' +
             toIntegersAtLease(this.getUTCMonth()) + '-' +
             toIntegersAtLease(this.getUTCDate());
    };

    var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    var meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        
    $.quoteString = function(string)
    // Places quotes around a string, inteligently.
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    {
        if (escapeable.test(string))
        {
            return '"' + string.replace(escapeable, function (a) 
            {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    $.toJSON = function(o, compact)
    {
        var type = typeof(o);
        
        if (type == "undefined")
            return "undefined";
        else if (type == "number" || type == "boolean")
            return o + "";
        else if (o === null)
            return "null";
        
        // Is it a string?
        if (type == "string") 
        {
            return $.quoteString(o);
        }
        
        // Does it have a .toJSON function?
        if (type == "object" && typeof o.toJSON == "function") 
            return o.toJSON(compact);
        
        // Is it an array?
        if (type != "function" && typeof(o.length) == "number") 
        {
            var ret = [];
            for (var i = 0; i < o.length; i++) {
                ret.push( $.toJSON(o[i], compact) );
            }
            if (compact)
                return "[" + ret.join(",") + "]";
            else
                return "[" + ret.join(", ") + "]";
        }
        
        // If it's a function, we have to warn somebody!
        if (type == "function") {
            throw new TypeError("Unable to convert object of type 'function' to json.");
        }
        
        // It's probably an object, then.
        var ret = [];
        for (var k in o) {
            var name;
            type = typeof(k);
            
            if (type == "number")
                name = '"' + k + '"';
            else if (type == "string")
                name = $.quoteString(k);
            else
                continue;  //skip non-string or number keys
            
            var val = $.toJSON(o[k], compact);
            if (typeof(val) != "string") {
                // skip non-serializable values
                continue;
            }
            
            if (compact)
                ret.push(name + ":" + val);
            else
                ret.push(name + ": " + val);
        }
        return "{" + ret.join(", ") + "}";
    };
    
    $.compactJSON = function(o)
    {
        return $.toJSON(o, true);
    };
    
    $.evalJSON = function(src)
    // Evals JSON that we know to be safe.
    {
        return eval("(" + src + ")");
    };
    
    $.secureEvalJSON = function(src)
    // Evals JSON in a way that is *more* secure.
    {
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };
})(jQuery);
/**
 * Javascript Class Framework
 * 
 * Copyright (c) 2008 John Resig (http://ejohn.org/blog/simple-javascript-inheritance/)
 * Inspired by base2 and Prototype
 */
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();
/*!
 * jStore Delegate Framework
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 */
(function($){
	
	this.jStoreDelegate = Class.extend({
		init: function(parent){
			// The Object this delgate operates for
			this.parent = parent;
			// Container for callbacks to dispatch.
			// eventType => [ callback, callback, ... ]
			this.callbacks = {};
		},
		bind: function(event, callback){
			if ( !$.isFunction(callback) ) return this;
			if ( !this.callbacks[ event ] ) this.callbacks[ event ] = [];
			
			this.callbacks[ event ].push(callback);
			
			return this;
		},
		trigger: function(){
			var parent = this.parent,
				args = [].slice.call(arguments),
				event = args.shift(),
				handlers = this.callbacks[ event ];

			if ( !handlers ) return false;
			
			$.each(handlers, function(){ this.apply(parent, args) });
			return this;
		}
	});
	
})(jQuery);
/**
 * jStore-jQuery Interface
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 */
(function($){
	
	var rxJson;
	
	try {
		rxJson = new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')
	} catch (e) {
		rxJson = /^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/
	}
	
	// Setup the jStore namespace in jQuery for options storage
	$.jStore = {};
	
	// Seed the object
	$.extend($.jStore, {
		EngineOrder: [],
		// Engines should put their availability tests within jStore.Availability
		Availability: {},
		// Defined engines should enter themselves into the jStore.Engines
		Engines: {},
		// Instanciated engines should exist within jStore.Instances
		Instances: {},
		// The current engine to use for storage
		CurrentEngine: null,
		// Provide global settings for overwriting
		defaults: {
			project: null,
			engine: null,
			autoload: true,
			flash: 'jStore.Flash.html'
		},
		// Boolean for ready state handling
		isReady: false,
		// Boolean for flash ready state handling
		isFlashReady: false,
		// An event delegate
		delegate: new jStoreDelegate($.jStore)
			.bind('jStore-ready', function(engine){
				$.jStore.isReady = true;
				if ($.jStore.defaults.autoload) engine.connect();
			})
			.bind('flash-ready', function(){
				$.jStore.isFlashReady = true;
			}),
		// Enable ready callback for jStore
		ready: function(callback){
			if ($.jStore.isReady) callback.apply($.jStore, [$.jStore.CurrentEngine]);
			else $.jStore.delegate.bind('jStore-ready', callback);
		},
		// Enable failure callback registration for jStore
		fail: function(callback){
			$.jStore.delegate.bind('jStore-failure', callback);
		},
		// Enable ready callback for Flash
		flashReady: function(callback){
			if ($.jStore.isFlashReady) callback.apply($.jStore, [$.jStore.CurrentEngine]);
			else $.jStore.delegate.bind('flash-ready', callback);
		},
		// Enable and test an engine
		use: function(engine, project, identifier){
			project = project || $.jStore.defaults.project || location.hostname.replace(/\./g, '-') || 'unknown';
		
			var e = $.jStore.Engines[engine.toLowerCase()] || null,
				name = (identifier ? identifier + '.' : '') + project + '.' + engine;
		
			if ( !e ) throw 'JSTORE_ENGINE_UNDEFINED';

			// Instanciate the engine
			e = new e(project, name);
		
			// Prevent against naming conflicts
			if ($.jStore.Instances[name]) throw 'JSTORE_JRI_CONFLICT';
		
			// Test the engine
			if (e.isAvailable()){
				$.jStore.Instances[name] = e;	// The Easy Way
				if (!$.jStore.CurrentEngine){
					$.jStore.CurrentEngine = e;
				}
				$.jStore.delegate.trigger('jStore-ready', e);
			} else {
				if (!e.autoload)				// Not available
					throw 'JSTORE_ENGINE_UNAVILABLE';
				else { 							// The hard way
					e.included(function(){
						if (this.isAvailable()) { // Worked out
							$.jStore.Instances[name] = this;
							// If there is no current engine, use this one
							if (!$.jStore.CurrentEngine){
								$.jStore.CurrentEngine = this;
							} 
							$.jStore.delegate.trigger('jStore-ready', this);
						}
						else $.jStore.delegate.trigger('jStore-failure', this);
					}).include();
				}
			}
		},
		// Set the current storage engine
		setCurrentEngine: function(name){
			if (!$.jStore.Instances.length )				// If no instances exist, attempt to load one
				return $.jStore.FindEngine();
			
			if (!name && $.jStore.Instances.length >= 1) { // If no name is specified, use the first engine
				$.jStore.delegate.trigger('jStore-ready', $.jStore.Instances[0]);
				return $.jStore.CurrentEngine = $.jStore.Instances[0];
			}
			
			if (name && $.jStore.Instances[name]) { // If a name is specified and exists, use it
				$.jStore.delegate.trigger('jStore-ready', $.jStore.Instances[name]);
				return $.jStore.CurrentEngine = $.jStore.Instances[name];
			}
		
			throw 'JSTORE_JRI_NO_MATCH';
		},
		// Test all possible engines for straightforward useability
		FindEngine: function(){
			$.each($.jStore.EngineOrder, function(k){
				if ($.jStore.Availability[this]()){ // Find the first, easiest option and use it.
					$.jStore.use(this, $.jStore.defaults.project, 'default');
					return false;
				}
			})
		},
		// Provide a way for users to call for auto-loading
		load: function(){
			if ($.jStore.defaults.engine)
				return $.jStore.use($.jStore.defaults.engine, $.jStore.defaults.project, 'default');
			
			// Attempt to find a valid engine, and catch any exceptions if we can't
			try {
				$.jStore.FindEngine();
			} catch (e) {}
		},
		// Parse a value as JSON before its stored.
		safeStore: function(value){
			switch (typeof value){
				case 'object': case 'function': return $.jStore.compactJSON(value);
				case 'number': case 'boolean': case 'string': case 'xml': return value;
				case 'undefined': default: return '';
			}
		},
		// Restores JSON'd values before returning
		safeResurrect: function(value){
			return rxJson.test(value) ? $.evalJSON(value) : value;
		},
		// Provide a simple interface for storing/getting values
		store: function(key, value){
			if (!$.jStore.CurrentEngine) return false;
		
			if ( !value ) // Executing a get command
				return $.jStore.CurrentEngine.get(key);
			// Executing a set command
				return $.jStore.CurrentEngine.set(key, value);
		},
		// Provide a simple interface for removing values
		remove: function(key){
			if (!$.jStore.CurrentEngine) return false;
		
			return $.jStore.CurrentEngine.rem(key);
		},
		// Alias access for reading
		get: function(key){
			return $.jStore.store(key);
		},
		// Alias access for setting
		set: function(key, value){
			return $.jStore.store(key, value);
		}
	})
	
	// Extend the jQuery funcitonal object
	$.extend($.fn, {
		// Provide a chainable interface for storing values/getting a value at the end of a chain
		store: function(key, value){
			if (!$.jStore.CurrentEngine) return this;
		
			var result = $.jStore.store(key, value);
		
			return !value ? result : this;
		},
		// Provide a chainable interface for removing values
		removeStore: function(key){
			$.jStore.remove(key);
		
			return this;
		},
		// Alias access for reading at the end of a chain.
		getStore: function(key){
			return $.jStore.store(key);
		},
		// Alias access for setting on a chanin.
		setStore: function(key, value){
			$.jStore.store(key, value);
			return this;
		}
	})
	
})(jQuery);
/**
 * jStore Engine Core
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 */
(function($){
	
	this.StorageEngine = Class.extend({
		init: function(project, name){
			// Configure the project name
			this.project = project;
			// The JRI name given by the manager
			this.jri = name;
			// Cache the data so we can work synchronously
			this.data = {};
			// The maximum limit of the storage engine
			this.limit = -1;
			// Third party script includes
			this.includes = [];
			// Create an event delegate for users to subscribe to event triggers
			this.delegate = new jStoreDelegate(this)
				.bind('engine-ready', function(){
					this.isReady = true;
				})
				.bind('engine-included', function(){
					this.hasIncluded = true;
				});
			// If enabled, the manager will check availability, then run include(), then check again
			this.autoload = false; // This should be changed by the engines, if they have required includes
			// When set, we're ready to transact data
			this.isReady = false;
			// When the includer is finished, it will set this to true
			this.hasIncluded = false;
		},
		// Performs all necessary script includes
		include: function(){
			var self = this,
				total = this.includes.length,
				count = 0;
				
			$.each(this.includes, function(){
				$.ajax({type: 'get', url: this, dataType: 'script', cache: true, 
					success: function(){
						count++;
						if (count == total)	self.delegate.trigger('engine-included');
					}
				})
			});
		},
		// This should be overloaded with an actual functionality presence check
		isAvailable: function(){
			return false;
		},
		// All get/set/rem functions across the engines should add this to the
		// first line of those functions to prevent accessing the engine while unstable.
		interruptAccess: function(){
			if (!this.isReady) throw 'JSTORE_ENGINE_NOT_READY';
		},
		/** Event Subscription Shortcuts **/
		ready: function(callback){
			if (this.isReady) callback.apply(this);
			else this.delegate.bind('engine-ready', callback);
			return this;
		},
		included: function(callback){
			if (this.hasIncluded) callback.apply(this);
			else this.delegate.bind('engine-included', callback);
			return this;
		},
		/** Cache Data Access **/
		get: function(key){
			this.interruptAccess();
			return this.data[key] || null;
		},
		set: function(key, value){
			this.interruptAccess();
			this.data[key] = value;
			return value;
		},
		rem: function(key){
			this.interruptAccess();
			var beforeDelete = this.data[key];
			this.data[key] = null;
			return beforeDelete;			
		}
	});
	
})(jQuery);
/*!
 * jStore DOM Storage Engine
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 */
(function($){
	
	// Set up a static test function for this instance
	var sessionAvailability = $.jStore.Availability.session = function(){
			return !!window.sessionStorage;
		},
		localAvailability = $.jStore.Availability.local = function(){
			return !!(window.localStorage || window.globalStorage);
		};

	this.jStoreDom = StorageEngine.extend({
		init: function(project, name){			
			// Call the parental init object
			this._super(project, name);
			
			// The type of storage engine
			this.type = 'DOM';
			
			// Set the Database limit
			this.limit = 5 * 1024 * 1024;
		},
		connect: function(){
			// Fire our delegate to indicate we're ready for data transactions
			this.delegate.trigger('engine-ready');
		},
		get: function(key){
			this.interruptAccess();
			var out = this.db.getItem(key);
			// Gecko's getItem returns {value: 'the value'}, WebKit returns 'the value'
			return $.jStore.safeResurrect( (out && out.value ? out.value : out) );
		},
		set: function(key, value){
			this.interruptAccess();
			this.db.setItem(key,$.jStore.safeStore(value)); 
			return value;
		},
		rem: function(key){
			this.interruptAccess();
			var out = this.get(key); 
			this.db.removeItem(key); 
			return out
		}
	})
	
	this.jStoreLocal = jStoreDom.extend({
		connect: function(){
			// Gecko uses a non-standard globalStorage[ www.example.com ] DOM access object for persistant storage.
			this.db = !window.globalStorage ? window.localStorage : window.globalStorage[location.hostname];
			this._super();
		},
		isAvailable: localAvailability
	})
	
	this.jStoreSession = jStoreDom.extend({
		connect: function(){
			this.db = sessionStorage;
			this._super();
		},
		isAvailable: sessionAvailability
	})

	$.jStore.Engines.local = jStoreLocal;
	$.jStore.Engines.session = jStoreSession;

	// Store the ordering preference
	$.jStore.EngineOrder[ 1 ] = 'local';

})(jQuery);
/*!
 * jStore Flash Storage Engine
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 * jStore.swf Copyright (c) 2008 Daniel Bulli (http://www.nuff-respec.com)
 */
(function($){
	
	// Set up a static test function for this instance
	var avilability = $.jStore.Availability.flash = function(){
		return !!($.jStore.hasFlash('8.0.0'));
	}
	
	this.jStoreFlash = StorageEngine.extend({
		init: function(project, name){			
			// Call the parental init object
			this._super(project, name);
			
			// The type of storage engine
			this.type = 'Flash';
			
			// Bind our flashReady function to the jStore Delegate
			var self = this;
			$.jStore.flashReady(function(){ self.flashReady() });
		},
		connect: function(){
			var name = 'jstore-flash-embed-' + this.project;
			
			// To make Flash Storage work on IE, we have to load up an iFrame
			// which contains an HTML page that embeds the object using an
			// object tag wrapping an embed tag. Of course, this is unnecessary for
			// all browsers except for IE, which, to my knowledge, is the only browser
			// in existance where you need to complicate your code to fix bugs. Goddamnit. :(
			$(document.body)
				.append('<iframe style="height:1px;width:1px;position:absolute;left:0;top:0;margin-left:-100px;" ' + 
					'id="jStoreFlashFrame" src="' +$.jStore.defaults.flash + '"></iframe>');
		},
		flashReady: function(e){
			var iFrame = $('#jStoreFlashFrame')[0];
			
			// IE
			if (iFrame.Document && $.isFunction(iFrame.Document['jStoreFlash'].f_get_cookie)) this.db = iFrame.Document['jStoreFlash'];
			// Safari && Firefox
			else if (iFrame.contentWindow && iFrame.contentWindow.document){
				var doc = iFrame.contentWindow.document;
				// Safari
				if ($.isFunction($('object', $(doc))[0].f_get_cookie)) this.db = $('object', $(doc))[0];
				// Firefox
				else if ($.isFunction($('embed', $(doc))[0].f_get_cookie)) this.db = $('embed', $(doc))[0];
			}

			// We're ready to process data
			if (this.db) this.delegate.trigger('engine-ready');
		},
		isAvailable: avilability,
		get: function(key){
			this.interruptAccess();
			var out = this.db.f_get_cookie(key);
			return out == 'null' ? null : $.jStore.safeResurrect(out);
		},
		set: function(key, value){
			this.interruptAccess();
			this.db.f_set_cookie(key, $.jStore.safeStore(value));
			return value;
		},
		rem: function(key){
			this.interruptAccess();
			var beforeDelete = this.get(key);
			this.db.f_delete_cookie(key);
			return beforeDelete;
		}
	})

	$.jStore.Engines.flash = jStoreFlash;

	// Store the ordering preference
	$.jStore.EngineOrder[ 2 ] = 'flash';

	/**
 	 * Flash Detection functions copied from the jQuery Flash Plugin
 	 * Copyright (c) 2006 Luke Lutman (http://jquery.lukelutman.com/plugins/flash)
 	 * Dual licensed under the MIT and GPL licenses.
 	 * 	http://www.opensource.org/licenses/mit-license.php
 	 * 	http://www.opensource.org/licenses/gpl-license.php 
 	 */
	$.jStore.hasFlash = function(version){
		var pv = $.jStore.flashVersion().match(/\d+/g),
			rv = version.match(/\d+/g);

		for(var i = 0; i < 3; i++) {
			pv[i] = parseInt(pv[i] || 0);
			rv[i] = parseInt(rv[i] || 0);
			// player is less than required
			if(pv[i] < rv[i]) return false;
			// player is greater than required
			if(pv[i] > rv[i]) return true;
		}
		// major version, minor version and revision match exactly
		return true;
	}
	
	$.jStore.flashVersion = function(){
		// ie
		try {
			try {
				// avoid fp6 minor version lookup issues
				// see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
				var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
				try { axo.AllowScriptAccess = 'always';	} 
				catch(e) { return '6,0,0'; }				
			} catch(e) {}
				return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
		// other browsers
		} catch(e) {
			try {
				if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
					return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
				}
			} catch(e) {}		
		}
		return '0,0,0';
	}

    // Callback fired when ExternalInterface is established
    window.flash_ready = function(){
        $.jStore.delegate.trigger('flash-ready');
    }
})(jQuery);

/*!
 * jStore Google Gears Storage Engine
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 */
(function($){
	
	// Set up a static test function for this instance
	var avilability = $.jStore.Availability.gears = function(){
		return !!(window.google && window.google.gears)
	}
	
	this.jStoreGears = StorageEngine.extend({
		init: function(project, name){			
			// Call the parental init object
			this._super(project, name);
			
			// The type of storage engine
			this.type = 'Google Gears';
			
			// Add required third-party scripts
			this.includes.push('http://code.google.com/apis/gears/gears_init.js');
			
			// Allow Autoloading on fail
			this.autoload = true;
		},
		connect: function(){
			// Create our database connection
			var db = this.db = google.gears.factory.create('beta.database');
			db.open( 'jstore-' + this.project );
			db.execute( 'CREATE TABLE IF NOT EXISTS jstore (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)' );
			
			// Cache the data from the table
			this.updateCache();
		},
		updateCache: function(){
			// Read the database into our cache object
			var result = this.db.execute( 'SELECT k,v FROM jstore' );
			while (result.isValidRow()){
				this.data[result.field(0)] = $.jStore.safeResurrect( result.field(1) );
				result.next();
			} result.close();
			
			// Fire our delegate to indicate we're ready for data transactions
			this.delegate.trigger('engine-ready');
		},
		isAvailable: avilability,
		set: function(key, value){
			this.interruptAccess();
			// Update the database
			var db = this.db;
			db.execute( 'BEGIN' );
			db.execute( 'INSERT OR REPLACE INTO jstore(k, v) VALUES (?, ?)', [key,$.jStore.safeStore(value)] );
			db.execute( 'COMMIT' );
			return this._super(key, value);
		},
		rem: function(key){
			this.interruptAccess();
			// Update the database
			var db = this.db;
			db.execute( 'BEGIN' );
			db.execute( 'DELETE FROM jstore WHERE k = ?', [key] );
			db.execute( 'COMMIT' );
			return this._super(key);
		}
	})

	$.jStore.Engines.gears = jStoreGears;
	
	// Store the ordering preference
	$.jStore.EngineOrder[ 3 ] = 'gears';

})(jQuery);
/*!
 * jStore HTML5 Specification Storage Engine
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 */
(function($){
	
	// Set up a static test function for this instance
	var avilability = $.jStore.Availability.html5 = function(){
		return !!window.openDatabase
	}
	
	this.jStoreHtml5 = StorageEngine.extend({
		init: function(project, name){			
			// Call the parental init object
			this._super(project, name);
			
			// The type of storage engine
			this.type = 'HTML5';
			
			// Set the Database limit
			this.limit = 1024 * 200;
		},
		connect: function(){
			// Create our database connection
			var db = this.db = openDatabase('jstore-' + this.project, '1.0', this.project, this.limit);
			if (!db) throw 'JSTORE_ENGINE_HTML5_NODB';
			db.transaction(function(db){
				db.executeSql( 'CREATE TABLE IF NOT EXISTS jstore (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)' );
			});
			
			// Cache the data from the table
			this.updateCache();
		},
		updateCache: function(){
			var self = this;
			// Read the database into our cache object
			this.db.transaction(function(db){
				db.executeSql( 'SELECT k,v FROM jstore', [], function(db, result){
					var rows = result.rows, i = 0, row;
					for (; i < rows.length; ++i){
						row = rows.item(i);
						self.data[row.k] = $.jStore.safeResurrect( row.v );
					}
					
					// Fire our delegate to indicate we're ready for data transactions
					self.delegate.trigger('engine-ready');
				});
			});
		},
		isAvailable: avilability,
		set: function(key, value){
			this.interruptAccess();
			// Update the database
			this.db.transaction(function(db){
				db.executeSql( 'INSERT OR REPLACE INTO jstore(k, v) VALUES (?, ?)', [key,$.jStore.safeStore(value)]);
			});
			return this._super(key, value);
		},
		rem: function(key){
			this.interruptAccess();
			// Update the database
			this.db.transaction(function(db){
				db.executeSql( 'DELETE FROM jstore WHERE k = ?', [key] )
			})
			return this._super(key);
		}
	})

	$.jStore.Engines.html5 = jStoreHtml5;

	// Store the ordering preference
	$.jStore.EngineOrder[ 0 ] = 'html5';

})(jQuery);
/*!*
 * jStore IE Storage Engine
 * Copyright (c) 2009 Eric Garside (http://eric.garside.name)
 */
(function($){
	
	// Set up a static test function for this instance
	var avilability = $.jStore.Availability.ie = function(){
		return !!window.ActiveXObject;
	}
	
	this.jStoreIE = StorageEngine.extend({
		init: function(project, name){			
			// Call the parental init object
			this._super(project, name);
			
			// The type of storage engine
			this.type = 'IE';
			
			// Allow Autoloading on fail
			this.limit = 64 * 1024;
		},
		connect: function(){
			// Create a hidden div to store attributes in
			this.db = $('<div style="display:none;behavior:url(\'#default#userData\')" id="jstore-' + this.project + '"></div>')
						.appendTo(document.body).get(0);
			// Fire our delegate to indicate we're ready for data transactions
			this.delegate.trigger('engine-ready');
		},
		isAvailable: avilability,
		get: function(key){
			this.interruptAccess();
			this.db.load(this.project);
			return $.jStore.safeResurrect( this.db.getAttribute(key) );
		},
		set: function(key, value){
			this.interruptAccess();
			this.db.setAttribute(key, $.jStore.safeStore(value));
			this.db.save(this.project);
			return value;
		},
		rem: function(key){
			this.interruptAccess();
			var beforeDelete = this.get(key);
			this.db.removeAttribute(key);
			this.db.save(this.project);
			return beforeDelete;
		}
	})

	$.jStore.Engines.ie = jStoreIE;
	
	// Store the ordering preference
	$.jStore.EngineOrder[ 4 ] = 'ie';

})(jQuery);
/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/jabberwerx.js*/
/**
 * filename:        jabbwerwerx.js
 * created at:      2009/10/09T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
;(function() {
    if ('jabberwerx' in window) {
        return;
    }

    var jabberwerx;
    /**
     * @namespace
     * @description
     * Cisco AJAX XMPP Library is an easy to use, AJAX-based XMPP client. This namespace
     * contains the core, non-UI classes and methods.
     *
     * To use these features you must have an account on an XMPP server.
     *
     * ## Events
     * The Cisco AJAX XMPP Library eventing mechanism is implemented in
     * {@link jabberwerx.EventDispatcher} and {@link jabberwerx.EventNotifier}.
     * Any possible event that may be fired will trigger on
     * {@link jabberwerx.globalEvents}. See
     * <a href="../jabberwerxEvents.html">JabberWerx Events</a> for all
     * possible events.
     *
     * ## Configuration
     * The following configuration options are available:
     * <table>
     * <tr>
     *  <th>Name</th>
     *  <th>Default</th>
     *  <th>Description</th>
     * </tr>
     * <tr>
     *  <td>persistDuration</td>
     *  <td>30</td>
     *  <td>The number of seconds that persisted data is considered to still
     *  be valid.</td>
     * </tr>
     * <tr>
     *  <td>capabilityFeatures</td>
     *  <td>[]</td>
     *  <td>The base capabilities for clients, not including those defined
     *  by enabled controllers</td>
     * </tr>
     * <tr>
     *  <td>capabilityIdentity</td>
     *  <td><pre class="code">{
     *      category: "client",
     *      type: "pc",
     *      name: "JabberWerx AJAX",
     *      node: "http://jabber.cisco.com/jabberwerx"
     *}</pre></td>
     *  <td>The identity for clients' capabilities.</td>
     * </tr>
     * <tr>
     *  <td>unsecureAllowed</td>
     *  <td>false</td>
     *  <td><tt>true</tt> if plaintext authentication is allowed over
     *  unencrypted or unsecured HTTP channels</td>
     * </tr>
     * <tr>
     *  <td>baseReconnectCountdown</td>
     *  <td>30</td>
     *  <td>base number of seconds between a disconnect occurring and a
     * reconnect been initiated. The actual reconnect period will be the
     * {baseReconnectCountdown} +/- x%, where x is a random number between
     * 0 and 10. If {baseReconnectCountdown} is 0 then a reconnect will
     * never be attempted. {baseReconnectCountdown}  is also used as a persist
     * password flag. If 0 password is never persisted and is cleared from memory
     * as soon as possible (immediately after a connect ATTEMPT. IF > 0, password
     * is persisted obfuscated and the password remains in memory (accessable through
     * the client.connectParams object)
     </td>
     * </tr>
     * <tr>
     *  <td>bindRetryCountdown</td>
     *  <td>30</td>
     *  <td>Number of seconds timeout between sending a bind resource request
     * and receiving the response from server. If no response from server after this timeout period,
     * a reconnect operation will be processed.
     * If {bindRetryCountdown} is less than or equal 0, the default value 30 seconds will be used.
     * </td>
     * </tr>
     * <tr>
     *  <td>enabledMechanisms</td>
     *  <td>["DIGEST-MD5", "PLAIN"]</td>
     *  <td>The list of SASL mechanism to enable by default.</td>
     * </tr>
     * </table>
     *
     * To set any of these options, create an object called `jabberwerx_config`
     * in the global namespace, like this:
     *
     *      jabberwerx_config = {
     *          persistDuration: 30,
     *          unsecureAllowed: false,
     *          capabilityFeatures: ['http://jabber.org/protocol/caps',
     *                          'http://jabber.org/protocol/chatstates',
     *                          'http://jabber.org/protocol/disco#info',
     *                          'http://jabber.org/protocol/muc',
     *                          'http://jabber.org/protocol/muc#user'],
     *          capabilityIdentity: {
     *                  category: 'client',
     *                  type: 'pc',
     *                  name: 'JabberWerx AJAX',
     *                  node: 'http://jabber.cisco.com/jabberwerx'},
     *          baseReconnectCountdown: 30,
     *          bindRetryCountdown: 30,
     *          enabledMechanisms: ["DIGEST-MD5", "PLAIN"]
     *      };
     *
     * This code must be evaluated **before** including this file, jabberwerx.js.
     * @minimal
     */
    jabberwerx = {
        /**
         * JabberWerx Version
         * @property {String} version
         * @type String
         */
    version: '8.6.1.28927',

        /**
         * Internal config settings. These may be overwritten by the user at init time
         * by setting properties on a global object named jabberwerx_config.
         *
         * @property _config
         */
        _config: {
            /** The age past which a saved session is expired. */
            persistDuration: 30,
            /** Dictates if unsecure connections are allowed. A connection is considered unsecure if it
             * is SASL PLAIN or JEP-0078 password over http. */
            unsecureAllowed: false,
            /** Default feature list for entity capabilities (XEP-115) */
            capabilityFeatures: [],
            /** Default primary binding url */
            httpBindingURL: "/httpbinding",
            /** Default secondary binding url */
            httpBindingURL_secondary: "/httpbinding",
            /** Default base reconnect period */
            baseReconnectCountdown: 30,
            /** Default bind retry period */
            bindRetryCountdown: 30,
            /** Default SASL Mechanisms to enable */
            enabledMechanisms: ["DIGEST-MD5", "PLAIN"],
            /** Is service discovery enabled on client **/
            serviceDiscoveryEnabled: false
        },

        /**
         * @private
         * Returns the url for the currently configured install location.
         *
         * @type String
         * @returns The url for the currently configured install location.
         */
        _getInstallURL: function() {
            return this._getInstallPath();
        },

        /**
         * @private
         * Returns the url for the currently configured install location.
         *
         * @type String
         * @returns The url for the currently configured install location.
         */
        _getInstallPath: function() {
            var p = this._config.installPath;
            if (!p) {
                var target = String(arguments[0] || "jabberwerx") + ".js";

                p = jabberwerx.$("script[src$=" + target + "]").slice(0,1).attr("src");
                p = p.substring(0, p.indexOf(target));
            }

            return p.charAt(p.length - 1) == '/' ? p : p + '/';
        },

        /**
         * Converts an XMPP-formatted date/time string into a Javascript Date object.
         *
         * @param   {String} timestamp The timestamp string to parse from
         * @returns  {Date} The date object representing the timestamp
         * @throws  {TypeError} If {timestamp} cannot be parsed
         */
        parseTimestamp: function(timestamp) {
            var result = /^([0-9]{4})(?:-?)([0-9]{2})(?:-?)([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}(?:\.([0-9]+))?)(?:(Z|[-+]?[0-9]{2}:[0-9]{2})?)$/.exec(timestamp);
            if (!result) {
                throw new TypeError("timestamp string not recognized");
            }

            var ts, offset = 0;
            ts = Date.UTC(  Number(result[1]),
                            Number(result[2]) - 1,
                            Number(result[3]),
                            Number(result[4]),
                            Number(result[5]),
                            Number(result[6]),
                            Number(result[7] || "0"));

            if (result[8] && result[8] != "Z") {
                result = /^([-+]?[0-9]{2}):([0-9]{2})$/.exec(result[8]);
                if (result) {
                    offset += Number(result[1]) * 3600000;
                    offset += Number(result[2]) * 60000;
                }
            }

            return new Date(ts - offset);
        },
        /**
         * Converts a Date object into an XMPP-formatted date/time string.
         *
         * @param   {Date} ts The date object to generate from
         * @param   {Boolean} [legacy] <tt>true</tt> if the date/time string
         *          should conform to the legacy format in XEP-0091
         * @returns {String} The date/time string
         * @throws  {TypeError} If {ts} is not a Date object
         */
        generateTimestamp: function(ts, legacy) {
            var padFN = function(val, amt) {
                var result = "";
                if (amt > 1) {
                    result = arguments.callee(parseInt(val / 10), amt - 1);
                }
                return result + String(parseInt(val % 10));
            };

            if (!(ts && ts instanceof Date)) {
                throw new TypeError("Expected Date object");
            }
            var date = [
                    padFN(ts.getUTCFullYear(), 4),
                    padFN(ts.getUTCMonth() + 1, 2),
                    padFN(ts.getUTCDate(), 2)];
            var time = [
                    padFN(ts.getUTCHours(), 2),
                    padFN(ts.getUTCMinutes(), 2),
                    padFN(ts.getUTCSeconds(), 2)];

            if (legacy) {
                return date.join("") + "T" + time.join(":");
            } else {
                return date.join("-") + "T" + time.join(":") + "Z";
            }
        },


        /**
         * Internal JabberWerx init method. Clients do not need to call this.
         *
         * @private
         */
        _init: function() {
            this._inited = true;

            // copy user config into internal config
            if (typeof jabberwerx_config != 'undefined') {
                for (var name in jabberwerx_config) {
                    var val = jabberwerx_config[name];
                    if (jabberwerx.$.isArray(val) && val.concat) {
                        val = val.concat();
                    }
                    this._config[name] = val;
                }
            }
        },

        /**
         * Disconnects from the server and clears any stored chat sessions.
         */
        reset: function() {
            if (this.client) {
                this.client.disconnect();
            }
        },

        /**
         * Performs a "reduce" on the given object (array or otherwise). This
         * method iterates over the items in &lt;obj&gt;, calling &lt;fn&gt;
         * with the current item from &lt;obj&gt; and the current &lt;value&gt;.
         *
         * The signature for &lt;fn&gt; is expected to take two arguments: The
         * current item from &lt;obj&gt; to evaluate, and the current value of
         * the reduction. &lt;fn&gt; is expected to return the updated value.
         *
         * For example, the following sums all of the items in an array:
         * <pre class="code"
         * var value = jabberwerx.reduce([0,1,2],
         *                              function(item, value) {
         *                                     return item + value;
         *                              });
         * </pre>
         *
         * @param {Object|Array} obj The object to reduce
         * @param {Function} fn The callback to perform the reduction
         * @param [value] The initial value for reduction; may be undefined
         * @throws {TypeError} If {fn} is not a function object.
         * @returns The reduction value
         */
        reduce: function(obj, fn, value) {
            if (!jabberwerx.$.isFunction(fn)) {
                throw new TypeError("expected function object");
            }

            jabberwerx.$.each(obj, function(idx, item) {
                value = fn(item, value);
                return true;
            });

            return value;
        },
        /**
         * Removes duplicate items from the given array.
         *
         * @param {Array} arr The array to make unique
         * @returns {Array} The provided array {arr}
         */
        unique: function(arr) {
            if (!jabberwerx.$.isArray(arr)) {
                return arr;
            }

            var specified = {};
            for (var idx = arr.length - 1; idx >= 0; idx--) {
                var item = arr[idx];
                if (!specified[item]) {
                    specified[item] = true;
                } else {
                    arr.splice(idx, 1);
                }
            }

            return arr;
        },
        /**
         * Check whether the given node {o} is a TextNode
         *
         * @param {Node} o The object to check against
         * @returns {Boolean} <tt>true</tt> if {o} is a TextNode
         */
        isText: function(o) {
            return (
                //typeof TextNode === "object" ? o instanceof TextNode : //DOM2
                o && o.ownerDocument && o.nodeType == 3 && typeof o.nodeName == "string"
            );
        },

        /**
         * Check whether the given NODE {o} is an element node
         *
         * @param {Node} o The node to check against
         * @returns {Boolean} <tt>true</tt> if {o} is an element node
         */
        isElement: function(o) {
            return (
                //typeof Element === "object" ? o instanceof Element : //DOM2
                o &&
                (o.ownerDocument !== undefined) &&
                (o.nodeType == 1) &&
                (typeof o.nodeName == "string")
            );
        },

        /**
         * Check whether the given node {o} is a document node
         *
         * @param {Node} o The node to check against
         * @returns {Boolean} <tt>true</tt> if {o} is a document node
         */
        isDocument: function(o) {
            return (
                //typeof Document === "object" ? o instanceof Document : //DOM2
                o &&
                (o.documentElement !== undefined) &&
                (o.nodeType == 9) &&
                (typeof o.nodeName == "string")
            );
        },

        client: null,
        _inited: false
    };

    jabberwerx._config.debug = {
    /*DEBUG-BEGIN*/
        streams: {
            rawStanzaLogging: false,
            connectionStatus: false,
            clientStatus: false,
            entityLifeCycle: false,
            stanzaSelectors: false, // a LOT of info ...
            persistence: false,
            observers: false,
            collectionControllers: false
        },
    /*DEBUG-END*/
        on: true
    };

    /**
     * @class
     * Utility class to build DOMs programmatically. This class is used to
     * create most of the XMPP data.
     *
     * @property {jabberwerx.NodeBuilder} parent The parent node builder
     * @property {Element} data The current data
     * @property {Document} document The document (used for creating nodes)
     *
     * @description
     * <p>Creates a new jabberwerx.NodeBuilder</p>
     *
     * <p>The value of {data} may be an Element or a String. If it is a string,
     * it is expected to be an expanded name in one of the following forms:</p>
     *
     * <ol>
     *<li>{namespace-uri}prefix:local-name</li>
     * <li>{namespace-uri}local-name</li>
     * <li>prefix:local-name</li>
     * <li>local-name</li>
     * </ol>
     *
     * @param   {Element|String} [data] The context element, or the expanded-name
     *          of the root element.
     * @throws  {TypeError} If {data} is defined, not an element, not a
     *          Document, or not a valid expanded name
     * @minimal
     */
    jabberwerx.NodeBuilder = function(data) {
        var parent, doc, ns = null;

        if (data instanceof jabberwerx.NodeBuilder) {
            // NOT FOR EXTERNAL USE: support a hierarchy of
            // NodeBuilders.
            this.parent = parent = arguments[0];
            data = arguments[1];
            doc = parent.document;
            ns = parent.namespaceURI;
        }

        if (jabberwerx.isDocument(data)) {
            doc = data;
            data = doc.documentElement;
            ns = data.namespaceURI || data.getAttribute("xmlns") || ns;
        } else if (jabberwerx.isElement(data)) {
            if (!doc) {
                doc = data.ownerDocument;
            } else if (data.ownerDocument !== doc) {
                data = (doc.importNode) ?
                       doc.importNode(data, true) :
                       data.cloneNode(true);
            }

            if (parent && parent.data) {
                parent.data.appendChild(data);
            }
            if (!doc.documentElement) {
                doc.appendChild(data);
            }

            ns = data.namespaceURI || data.getAttribute("xmlns") || ns;
        } else if (data) {
            if (!doc) {
                doc = this._createDoc();
            }

            var ename, ln, pre;

            ename = this._parseName(data, ns);
            ns = ename.namespaceURI;
            data = this._createElem(doc, ns, ename.localName, ename.prefix);
        } else if (!parent) {
            doc = this._createDoc();
        }

        this.document = doc;
        this.data = data;
        this.namespaceURI = ns;
    };

    /* @extends jabberwerx.NodeBuilder.prototype */
    jabberwerx.NodeBuilder.prototype = {
        /**
         * Adds or updates an attribute to this NodeBuilder's data.
         *
         * <p><b>NOTE:</b> namespaced attributes are not supported</p>
         *
         * @param {String} name The name of the attribute
         * @param {String} val The attribute value
         * @returns {jabberwerx.NodeBuilder} This builder
         * @throws  {TypeError} if {name} is not valid
         */
        attribute: function(name, val) {
            var ename = this._parseName(name);

            if (ename.prefix && ename.prefix != "xml" && ename.prefix != "xmlns") {
                var xmlns = "xmlns:" + ename.prefix;

                this.attribute(xmlns, ename.namespaceURI || "");
            } else if (ename.prefix == "xml") {
                ename.namespaceURI = jabberwerx.$.browser.webkit ?
                                      "" :
                                     "http://www.w3.org/XML/1998/namespace";
            } else if (ename.prefix == "xmlns" || ename.localName == "xmlns") {
                ename.namespaceURI = "http://www.w3.org/2000/xmlns/";
            } else if (!ename.prefix && ename.namespaceURI !== null) {
                throw new TypeError("namespaced attributes not supported");
            }

            var doc = this.document;
            var elem = this.data;
            if (typeof(doc.createNode) != "undefined") {
                var attr = doc.createNode(2,
                                          ename.qualifiedName,
                                          ename.namespaceURI || "");
                attr.value = val || "";
                elem.setAttributeNode(attr);
            } else if (typeof(elem.setAttributeNS) != "undefined") {
                elem.setAttributeNS(ename.namespaceURI || "",
                                    ename.qualifiedName,
                                    val || "");
            } else {
                throw new TypeError("unsupported platform");
            }

            return this;
        },
        /**
         * Appends a new text node to this NodeBuilder's data.
         *
         * @param {String} val The text node value
         * @returns {jabberwerx.NodeBuilder} this builder
         */
        text: function(val) {
            if (!val) {
                return this;
            }

            var txt = this.document.createTextNode(val);
            this.data.appendChild(txt);

            return this;
        },
        /**
         * Appends a new element to this NodeBuilder's data, with the given
         * name and attributes. The created element is automatically appended
         * to this NodeBuilder's data.
         *
         * <p>If expanded-name uses form 2 (local-name, no namespace), then the
         * namespace for the parent is used.</p>
         *
         * @param {String} name The expanded name of the new element
         * @param {Object} [attrs] A hashtable of attribute names to
         *        attribute values
         * @returns {jabberwerx.NodeBuilder} The builder for the new element,
         *           with the current builder as its parent.
         * @throws  {TypeError} if {name} is not a valid expanded name
         */
        element: function(name, attrs) {
            if (!attrs) {
                attrs = {};
            }
            if (typeof(name) != "string") {
                throw new TypeError("name is not a valid expanded name");
            }
            var builder = new jabberwerx.NodeBuilder(this, name);
            for (var key in attrs) {
                if (key == 'xmlns') { continue; }
                builder.attribute(key, attrs[key]);
            }

            return builder;
        },

        /**
         * Appends the given node to this NodeBuilder's data:
         * <ul>
         * <li>If {n} is a document, its documentElement is appended to
         * this NodeBuilder's data and a NodeBuilder wrapping that element
         * is returned</li>
         * <li>If {n} is an element, it is cloned and appended to this
         * NodeBuilder's data and a NodeBuilder wrapping the cloned element
         * is returned</li>
         * <li>If {n} is a TextNode, its value is appended to this
         * NodeBuilder's data and this NodeBuilder is returned</li>
         * <li>Otherwise, a TypeError is thrown</li>
         * <ul>
         *
         * @param   {Node} n The node to append
         * @returns  {jabberwerx.NodeBuilder} The builder appropriate for {node}
         * @throws   {TypeError} If {node} is invalid
         */
        node: function(n) {
            if (!n) {
                throw new TypeError("node must exist");
            }

            if (jabberwerx.isDocument(n)) {
                n = n.documentElement;
            }

            if (jabberwerx.isElement(n)) {
                return new jabberwerx.NodeBuilder(this, n);
            } else if (jabberwerx.isText(n)) {
                return this.text(n.nodeValue);
            } else {
                throw new TypeError("Node must be an XML node");
            }

            return this;
        },

        /**
         * <p>Appends the given value as parsed XML to this NodeBuilder's
         * data.</p>
         *
         * @param {String} val The XML to parse and append
         * @returns {jabberwerx.NodeBuilder} This NodeBuilder
         */
        xml: function(val) {
            var wrapper = (this.namespaceURI) ?
                          "<wrapper xmlns='" + this.namespaceURI + "'>" :
                          "<wrapper>";
            wrapper += val + "</wrapper>";
            var parsed = this._parseXML(wrapper);
            var that = this;

            jabberwerx.$(parsed).contents().each(function() {
                if (jabberwerx.isElement(this)) {
                    new jabberwerx.NodeBuilder(that, this);
                } else if (jabberwerx.isText(this)) {
                    that.text(this.nodeValue);
                }
            });

            return this;
        },

        /**
         * @private
         * <ol>
         * <li>{namespace-uri}prefix:local-name</li>
         * <li>{namespace-uri}local-name</li>
         * <li>prefix:local-name</li>
         * <li>local-name</li>
         * </ol>
         */
        _parseName: function(name, ns) {
            var ptn = /^(?:\{(.*)\})?(?:([^\s{}:]+):)?([^\s{}:]+)$/;
            var m = name.match(ptn);

            if (!m) {
                throw new TypeError("name '" + name + "' is not a valid ename");
            }

            var retval = {
                namespaceURI: m[1],
                localName: m[3],
                prefix: m[2]
            };

            if (!retval.localName) {
                throw new TypeError("local-name not value");
            }

            retval.qualifiedName = (retval.prefix) ?
                    retval.prefix + ":" + retval.localName :
                    retval.localName;

            if (!retval.namespaceURI) {
                // IE work-around, since RegExp returns "" if:
                //  1) it evaluates to "" OR
                //  2) it is missing!
                if (name.indexOf("{}") == 0) {
                    retval.namespaceURI = "";
                } else {
                    retval.namespaceURI = ns || null;
                }
            }

            return retval;
        },
        /**
         * @private
         */
        _createDoc: function() {
            var doc;
            try {
                if (document.implementation && document.implementation.createDocument) {
                    doc = document.implementation.createDocument(null, null, null);
                } else {
                    doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
                    doc.async = false;
                }
            } catch (ex) {
                //DEBUG-BEGIN
                jabberwerx.util.debug.log("could not create XML Document: " + ex);
                //DEBUG-END
                throw ex;
            }

            return doc;
        },

        /**
         * @private
         */
        _parseXML: function(xmlstr) {
            var tmp;
            try { //safari throws DOMException for certain types of invalid xml
                tmp = this._createDoc();
                tmp.loadXML(xmlstr);
            } catch (ex) {
                try {
                    tmp = (new DOMParser()).parseFromString(xmlstr,"text/xml");
                }
                catch(ex) {
                    // whoops!
                    jabberwerx.util.debug.log("exception: " + ex + " trying to parse xml: '" + xmlstr + "'");
                    throw new TypeError("Exception trying to parse xml: '" + xmlstr + "'");
                }
            }
            var ret = tmp.documentElement;
             //check elem to see if a parse error occurred
            if (!ret || //ie
               (ret.nodeName == "parsererror") || //mozilla
               (jabberwerx.$("parsererror", ret).length > 0)) {// safari
                jabberwerx.util.debug.log("parse error trying to parse xml: '" + xmlstr + "'");
                throw new TypeError("Parse error trying to parse: " + xmlstr);
            }
            return ret;
        },


        /**
         * @private
         */
        _createElem: function(doc, ns, ln, pre) {
            var parent = this.parent;
            var elem;
            var qn = pre ? (pre + ":" + ln ) : ln;
            var declare = true;

            // determine if the namespace must be declared
            if (parent && parent.data) {
                if (    parent.namespaceURI == ns ||
                        ns == null ||
                        ns == undefined) {
                    declare = false;
                }
            } else {
                // declared if namespace is defined (even "")
                declare = (ns != null && ns != undefined);
            }

            if (typeof(doc.createNode) != "undefined") {
                elem = doc.createNode(1, qn, ns || "");
                if (declare) {
                    var decl = doc.createNode(2,
                                              (pre ? "xmlns:" + pre : "xmlns"),
                                              "http://www.w3.org/2000/xmlns/");
                    decl.value = ns || "";
                    elem.setAttributeNode(decl);
                }
            } else if (typeof(doc.createElementNS) != "undefined") {
                elem = doc.createElementNS(ns || "", qn);
                if (declare) {
                    elem.setAttributeNS("http://www.w3.org/2000/xmlns/",
                                        (pre ? "xmlns:" + pre : "xmlns"),
                                        ns || "");
                }
            } else {
                throw Error("unsupported platform");
            }

            if (!doc.documentElement) {
                doc.appendChild(elem);
            } else if (parent && parent.data) {

                parent.data.appendChild(elem);
            }

            return elem;
        }
    };

    /**
     * @namespace
     * @description
     * Namespace for XHTML-IM functions and constants.
     * @minimal
     */
    jabberwerx.xhtmlim = {};

    /**
     * An array of css style properties that may be included in xhtml-im.
     * Default values are from XEP-71 Recommended Profile but may be modified
     * at anytime. For example some clients may want to ignore font size
     * property would add the following to their initialization code:
     * <pre class='code'>
     *  delete jabberwerx.xhtmlim.allowedStyles[
     *      jabberwerx.xhtmlim.allowedStyles.indexOf("font-size")
     *  ];
     * </pre>
     *
     * @property {Array} jabbewerx.xhtmlim.allowedStyles
     * @minimal
     */
    jabberwerx.xhtmlim.allowedStyles = [
        "background-color",
        "color",
        "font-family",
        "font-size",
        "font-style",
        "font-weight",
        "margin-left",
        "margin-right",
        "text-align",
        "text-decoration"
    ];


    /**
     * A map of tags that may be included in xhtml-im. The defaults are defined
     * in XEP-71 Recommended Profile. The map is indexed by tag and provides an
     * array of allowed attributes for that tag. Clients may modify this map at
     * any time to change behavior. For example a client that wanted to include
     * table tags would add the following to their initialization code:
     * <pre class="code">
     *  jabberwerx.$.extend(jabberwerx.xhtmlim.allowedTags,{
     *      table: ["style",
     *              "border",
     *              "cellpadding",
     *              "cellspacing",
     *              "frame",
     *              "summary",
     *              "width"]
     *  })
     * </pre>
     *
     * @property {Map} jabbewerx.xhtmlim.allowedTags
     * @minimal
     */
    jabberwerx.xhtmlim.allowedTags = {
        br:         [],
        em:         [],
        strong:     [],
        a:          ["style","href","type"],
        blockquote: ["style"],
        cite:       ["style"],
        img:        ["style", "alt", "height", "src", "width"],
        li:         ["style"],
        ol:         ["style"],
        p:          ["style"],
        span:       ["style"],
        ul:         ["style"],
        body:       ["style", "xmlns", "xml:lang"]
    }


    /**
     * Sanitize xhtmlNode by applying XEP-71 recommended profile.
     *
     * Each node in the given DOM is checked to make sure it is an
     * {@link jabberwerx.xhtmlim.allowedTags}, with allowed attributes and
     * style values. If a node is not allowed it is removed from the DOM and
     * its children reparented to its own parent. If an attribute is not
     * allowed it is removed. If the attribute's name is "href" or "src" and
     * its value starts with 'javascript:', its element is removed and the
     * children reparented. Finally any css values not in the
     * {@link jabberwerx.xhtmlim.allowedStyles} array is removed from the style
     * attribute.
     *
     * xhtmlNode must be a &lt;body/&gt; or one of the other allowed tags.
     * Typical usage of this function would be to clean an html fragment (an
     * entire &lt;p/&gt; for instance) or in preperation for a message stanza
     * by passing a &lt;body/&gt; element.
     *
     * @param DOM xhtmlNode <body xmlns='http://www.w3.org/1999/xhtml'/>
     * @returns DOM A reference to xhtmlNode
     * @throws TYPE_ERROR if xhtmlNode is not a DOM or not an allowed tag
     * @minimal
     */
    jabberwerx.xhtmlim.sanitize = function(xhtmlNode) {
        //private filter function, expects a jq
        var filterNodes = function(fNode) {
            //keep element children to recurse later
            var myKids = fNode.children();
            var fDOM = fNode.get(0);
            if (jabberwerx.xhtmlim.allowedTags[fDOM.nodeName] === undefined) {
                fNode.replaceWith(fDOM.childNodes);
                fNode.remove();
            } else { //filter attributes
                var i = 0;
                while (i < fDOM.attributes.length) {
                    var aName = fDOM.attributes[i].nodeName;
                    if (jabberwerx.$.inArray(aName, jabberwerx.xhtmlim.allowedTags[fDOM.nodeName]) == -1) {
                        fNode.removeAttr(aName); //removes from attributes
                    } else {
                        if (aName == "href" || aName == "src") {
                            // filter bad href/src values
                            var aValue = fDOM.attributes[i].nodeValue;
                            if (aValue.indexOf("javascript:") == 0) {
                                fNode.replaceWith(fDOM.childNodes);
                                fNode.remove();
                            }
                        } else if (aName == "style") {
                            // filter unknown css  properties
                            var rProps = jabberwerx.$.map(
                                fDOM.attributes[i].value.split(';'),
                                function(oneStyle, idx) {
                                    return jabberwerx.$.inArray(oneStyle.split(':')[0], jabberwerx.xhtmlim.allowedStyles) != -1 ? oneStyle : null;
                                });
                            fNode.attr("style", rProps.join(';'));
                        }
                        ++i;
                    }
                }
            }

            for (var i = 0; i < myKids.length; ++i) {
                if (jabberwerx.isElement(myKids[i])) {
                    filterNodes(jabberwerx.$(myKids[i]));
                }
            }
        } //filterNodes

        if (!jabberwerx.isElement(xhtmlNode)) {
            throw new TypeError("xhtmlNode must be a DOM");
        }
        if (jabberwerx.xhtmlim.allowedTags[xhtmlNode.nodeName] === undefined) {
            throw new TypeError("xhtmlNode must be an allowed tag")
        }

        filterNodes(jabberwerx.$(xhtmlNode));
        return xhtmlNode;
    }

    // reset jQuery and $ if not present
    jabberwerx.$ = jQuery.noConflict(true);
    if (typeof(window.jQuery) == "undefined") {
        window.jQuery = jabberwerx.$;
    }
    if (typeof(window.$) == "undefined") {
        window.$ = jabberwerx.$;
    }

    jabberwerx._init();
    window.jabberwerx = jabberwerx;
})();

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/util/crypt.js*/
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 *
 * Modified for jabbwerwerx AJAX 
 *      moved functions under the jabberwerx.util.crypto namespace
 *      Eliminated functions not called directly by jwa
 *      made sha1 and md5 heklper functions inner to relevant global funcs
 *      replaced b64 encoding/decoding functions
 *      added jsdocs documentation, keeping private
 */
 
if (window.jabberwerx) {
    //ensure our namespaces exist
    window.jabberwerx.util = window.jabberwerx.util || {};
    window.jabberwerx.util.crypto = window.jabberwerx.util.crypto || {};    
    
    /**
     * @private
     * <p> Encodes the given string into base64.</p>
     *
     * <p><b>NOTE:</b> {input} is assumed to be UTF-8; only the first
     * 8 bits of each {input} element are significant.</p>
     *
     * @param   {String} input The string to convert to base64
     * @returns {String} The converted string
     */
    jabberwerx.util.crypto.b64Encode = function(input) {                
        var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        
        for (var idx = 0; idx < input.length; idx += 3) {
            var data =  input.charCodeAt(idx) << 16 |
                        input.charCodeAt(idx + 1) << 8 |
                        input.charCodeAt(idx + 2);
                        
            //assume the first 12 bits are valid
            output +=   table.charAt((data >>> 18) & 0x003f) +
                        table.charAt((data >>> 12) & 0x003f);
            output +=   ((idx + 1) < input.length) ?
                        table.charAt((data >>> 6) & 0x003f) :
                        "=";
            output +=   ((idx + 2) < input.length) ?
                        table.charAt(data & 0x003f) :
                        "=";
        }
        
        return output;
    };
    
    /**
     * @private
     * <p>Decodes the given base64 string.</p>
     *
     * <p><b>NOTE:</b> output is assumed to be UTF-8; only the first
     * 8 bits of each output element are significant.</p>
     *
     * @param   {String} input The base64 encoded string
     * @returns {String} Decoded string
     */
    jabberwerx.util.crypto.b64Decode = function(input) {
        var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        
        for (var idx = 0; idx < input.length; idx += 4) {
            var h = [
                table.indexOf(input.charAt(idx)),
                table.indexOf(input.charAt(idx + 1)),
                table.indexOf(input.charAt(idx + 2)),
                table.indexOf(input.charAt(idx + 3))
            ];
            
            var data = (h[0] << 18) | (h[1] << 12) | (h[2] << 6) | h[3];
            if          (input.charAt(idx + 2) == '=') {
                data = String.fromCharCode(
                    (data >>> 16) & 0x00ff
                );
            } else if   (input.charAt(idx + 3) == '=') {
                data = String.fromCharCode(
                    (data >>> 16) & 0x00ff,
                    (data >>> 8) & 0x00ff
                );
            } else {
                data = String.fromCharCode(
                    (data >>> 16) & 0x00ff,
                    (data >>> 8) & 0x00ff,
                    data & 0x00ff
                );
            }
            output += data;
        }
        
        return output;
    };
    
    /**
     * @private
     * <p>Encodes the given utf-16 string into utf-8.</p>
     *
     * @param   {String} input The utf-16 string to encode
     * @returns {String} The utf-8 encoding
     */    
    jabberwerx.util.crypto.utf8Encode = function (input) {
      var output = "";
      var i = -1;
      var x, y;

      while(++i < input.length) {
        /* Decode utf-16 surrogate pairs */
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
          x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
          i++;
        }

        /* Encode output as utf-8 */
        if(x <= 0x7F)
          output += String.fromCharCode(x);
        else if(x <= 0x7FF)
          output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                        0x80 | ( x         & 0x3F));
        else if(x <= 0xFFFF)
          output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                        0x80 | ((x >>> 6 ) & 0x3F),
                                        0x80 | ( x         & 0x3F));
        else if(x <= 0x1FFFFF)
          output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                        0x80 | ((x >>> 12) & 0x3F),
                                        0x80 | ((x >>> 6 ) & 0x3F),
                                        0x80 | ( x         & 0x3F));
      }
      return output;
    }
    /**
     * @private
     * <p>Decodes the given utf-8 string into utf-16.</p>
     *
     * @param   {String} input The utf-8 string to encode
     * @returns {String} The utf-16 encoding
     */
    jabberwerx.util.crypto.utf8Decode = function (input) {
        var output = "";
        
        for (idx = 0; idx < input.length; idx++) {
            var c = [
                input.charCodeAt(idx),
                input.charCodeAt(idx + 1),
                input.charCodeAt(idx + 2)
            ];
            var pt;
            
            if          (c[0] < 128) {
                pt = c[0];
            } else if   (c[0] > 191 && c[0] < 224) {
                pt = ((c[0] & 0x001f) << 6 ) |
                     (c[1] & 0x003f);
                idx += 1;
            } else {
                pt = ((c[0] & 0x000f) << 12) |
                     ((c[1] & 0x001f) << 6) |
                     (c[2] & 0x003f);
                idx += 2;
            }
            
            output += String.fromCharCode(pt);
        }
        
        return output;
    };

    /**
     * @private
     * <p>Convert a raw string to a hex string.</p>
     *
     * @param   {String} input The string to hexify
     * @params {Boolean} [useUpperCase] Use uppercase hex characters
     * @returns {String} The hex representation iof string's bytes
     */    
    jabberwerx.util.crypto.str2hex = function(input, useUpperCase) {
        var hex_tab = useUpperCase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for(var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                   +  hex_tab.charAt( x        & 0x0F);
        }
        return output;
    }
    
    /**
     * @private
     * <p>Applies sha1 to given strng and encodes as Base64</p>
     *
     * @param   {String} input The utf-8 string to encode
     * @returns {String} The base64 encoded sha1 hash of input
     */    
    jabberwerx.util.crypto.b64_sha1 = function(input) {
        return jabberwerx.util.crypto.b64Encode(jabberwerx.util.crypto.str_sha1(input));
    }
    
    /**
     * @private
     * <p>Applies sha1 to given utf-8 string and encodes as String</p>
     * <p><b>NOTE:</b> {input} is assumed to be UTF-8; only the first
     * 8 bits of each {input} element are significant. 
     * Make sure to call utf8Encode as needed before invoking this function.</p>
     * @param   {String} input The utf-8 String to encode
     * @returns {String} The base64 encoded sha1 hash of input
     */    
    jabberwerx.util.crypto.str_sha1 = function(input) {
        //Convert a raw string to an array of big-endian words
        //Characters >255 have their high-byte silently ignored.
        var rstr2binb = function (input) {
            var output = Array(input.length >> 2);
            for(var i = 0; i < output.length; i++)
                output[i] = 0;
            for(var i = 0; i < input.length * 8; i += 8)
                output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            return output;
        }
        //Convert an array of big-endian words to a string
        var binb2rstr = function(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8) {
                output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
            }
            return output;
        }

        //Add integers, wrapping at 2^32. This uses 16-bit operations internally
        //to work around bugs in some JS interpreters.
        var safe_add = function(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        //Bitwise rotate a 32-bit number to the left.
        var bit_rol = function(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
 
        var sha1_ft = function(t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        var sha1_kt = function(t) {
            return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
                    (t < 60) ? -1894007588 : -899497514;
        }
        
        //Calculate the SHA-1 of an array of big-endian words, and a bit length
        var binb_sha1 = function(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = Array(80);
            var a =  1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d =  271733878;
            var e = -1009589776;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for (var j = 0; j < 80; j++) {
                    if (j < 16) {
                        w[j] = x[i + j];
                    } else {
                        w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                    }
                    var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                                     safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = bit_rol(b, 30);
                    b = a;
                    a = t;
                }

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return Array(a, b, c, d, e);
        }
        return binb2rstr(binb_sha1(rstr2binb(input), input.length * 8));
    }
    
    /**
     * @private
     * <p>Applies sha1 to given strng and encodes as Base64</p>
     *
     * <p><b>NOTE:</b> {input} is assumed to be UTF-8; only the first
     * 8 bits of each {input} element are significant. 
     * Make sure to call utf8Encode as needed before invoking this function.</p>
     * @param   {String} input The utf-8 string to encode
     * @returns {String} The base64 encoded sha1 hash of input
     */    
    jabberwerx.util.crypto.hex_md5 = function(input) { 
        return jabberwerx.util.crypto.str2hex(jabberwerx.util.crypto.rstr_md5(input)); 
    }

    /**
     * @private
     * <p>Calculate the MD5 of a raw string/p>
     *
     * <p><b>NOTE:</b> {input} is assumed to be UTF-8; only the first
     * 8 bits of each {input} element are significant. 
     * Make sure to call utf8Encode as needed before invoking this function.</p>
     * @param   {String} input The utf-8 string to encode
     * @returns {String} The base64 encoded sha1 hash of input
     */    
    jabberwerx.util.crypto.rstr_md5 = function(input) {
        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
        }
        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
        //Add integers, wrapping at 2^32. This uses 16-bit operations internally
        //to work around bugs in some JS interpreters.
        var safe_add = function(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
        //Bitwise rotate a 32-bit number to the left.
        var bit_rol = function(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
        
        //Convert a raw string to an array of little-endian words
        //Characters >255 have their high-byte silently ignored.
        var rstr2binl = function(input) {
            var output = Array(input.length >> 2);
            for(var i = 0; i < output.length; i++) {
                output[i] = 0;
            }
            for(var i = 0; i < input.length * 8; i += 8) {
                output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
            }
            return output;
        }
        //Convert an array of little-endian words to a string
        var binl2rstr = function(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8) {
                output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
            }
            return output;
        }
        //Calculate the MD5 of an array of little-endian words, and a bit length.
        var binl_md5 = function(x, len) {
          //append padding
          x[len >> 5] |= 0x80 << ((len) % 32);
          x[(((len + 64) >>> 9) << 4) + 14] = len;

          var a =  1732584193;
          var b = -271733879;
          var c = -1732584194;
          var d =  271733878;

          for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
          }
          return Array(a, b, c, d);
        }
        
        return binl2rstr(binl_md5(rstr2binl(input), input.length * 8));
    }
    /**
     * @private
     * <p>Generates a random UUID as per rfc4122</p>
     *
     * @returns {String} A random UUID
     */
     jabberwerx.util.crypto.generateUUID = function() {
        // Based on RFC 4122
        // time_lo:  bytes 0-3   (bits 0-31)
        // time_mid: bytes 4-5   (bits 32-47)
        // time_hi:  bytes 6-7   (bits 48-63)
        // clock_hi: bytes 8     (bits 64-71)
        // clock_lo: bytes 9     (bits 72-79)
        // node:     bytes 10-15 (bits 80-127)
        
        // start with "random" data
        var parts = [];
        for (var idx = 0; idx < 16; idx++) {
            parts[idx] = Math.floor(Math.random() * 256);
        }
        
        // set version to 4 (bits 12-15 of clock_hi)
        parts[6] = (parts[6] & 0x0f) | 0x40;
        
        // set clock_seq_and_reserved bits 6,7 to 0,1
        parts[8] = (parts[8] & 0x3f) | 0x80;
        
        // Assemble UUID as printed string
        var result = "";
        for (var idx = 0; idx < parts.length; idx++) {
            var val = parts[idx];
            if (idx == 4 || idx == 6 || idx == 8 || idx == 10) {
                // separators after time_lo, time_mid, time_hi, clock_lo
                result += "-";
            }
            
            result += ((val >>> 4) & 0x0f).toString(16);
            result += (val & 0x0f).toString(16);
        }
        
        return result;
    }
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/util/validate.js*/
/**
 * filename:        validate.js
 * created at:      2010/08/10T13:50:00-07:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 * 
 * A utility class to validate Types of complex objects
 */
 
if (window.jabberwerx) {
    //ensure our namespaces exist
    window.jabberwerx.util = window.jabberwerx.util || {};
    window.jabberwerx.util.validate = window.jabberwerx.util.validate || {};    
    
    /**
     * @private
     * <p> Checks if the given input is a valid IP address.</p>
     *
     * @param {String} IP Address
     * @returns <tt>true</tt> If given input is a valid IP Address
     * @type Boolean
     */
    jabberwerx.util.validate.isIPAddress = function(input) {
        var regex = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
            if (regex.test(input))
                return true;
            else
                return false;

    };

}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/jwapp/JWCore.js*/
;
/**
 * filename:        JWCore.js
 * created at:      2008/10/31T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
/**
 * @namespace
 * @description
 * A namespace for the JWApp framework. The framework is a general Javascript
 * application framework, built for but not tied to JabberWerx.
 *
 * Note: The jabberwerx.JWBase class does not live in this namespace.
 * Note: The JW framework depends on jQuery; jQuery must be loaded before this code runs.
 */

if (jabberwerx) {
if (!jabberwerx.util) {
    /**
     * @namespace
     * @minimal
     */
    jabberwerx.util = {}
    }

if (jabberwerx) {
   (function(){
    var initializing = false;

    /**
     * @class jabberwerx.JWBase
     *
     * <p>The base class for objects in the JWApp framework.</p>
     *
     * <p>Objects derived from jabberwerx.JWBase get the following features:</p>
     *
     * <p><b>## Object Graph Client-Side Persistence ##</b></p>
     * <p>A graph of JWBase-derived objects can be serialized, stored, and re-loaded
     * via {@link jabberwerx.util.saveGraph} and {@link jabberwerx.util.loadGraph}. Cycles and uniqueing are handled via an
     * object registry and per-object guids. Note that cycles among non-JWBase objects
     * will result in infinite recursion, as per usual.</p>
     *
     * <p>FYI, there are two steps to loading a serialized graph: unserializing and
     * "rehydrating". We unserialize the object registry via eval(). Rehydrating
     * involves turning the resulting bare JS objects with keys and values into full JW objects,
     * with appropriate methods and prototype chain in place. For this to work, the
     * serialization must include the objects' class name. For now this is accomplished
     * in the class definition/declaration: {@link jabberwerx.JWBase.extend} takes a string parameter
     * that must be the fully-qualified name of the class being defined.</p>
     *
     * <p>Client-side storage is handled via dojo storage. By default any given JW object
     * in a graph will NOT be saved. Objects that want to be saved must implement
     * {@link jabberwerx.JWBase#shouldBeSavedWithGraph} and return true.</p>
     *
     * <p>Typically only model objects should be saved to a persistent store. See
     * {@link jabberwerx.JWModel}, which does return true for `shouldBeSavedWithGraph`.</p>
     *
     * <p><b>## Object-Method Invocation Objects ##</b></p>
     * <p>A jabberwerx.JWBase object can generate portable function objects that, when invoked, are
     * scoped automatically to their generating instance. The graph storage engine
     * treats these function objects specially, so the observer relationships among
     * stored objects can be serialized and restored automatically.</p>
     *
     * @description
     * Creates a new jabberwerx.JWBase object.
     *
     * @constructs jabberwerx.JWBase
     * @minimal
     */
    jabberwerx.JWBase = function(){};     // The base class constructor (does nothing; used to generate a prototype)

    /**
     * This method is called to initialize the JWBase-derived instance.
     */
    jabberwerx.JWBase.prototype.init = function() {
    };
    /**
     * This method is offered as a way to release resources that were acquired by an object
     * during its lifetime. However, as Javascript does not have any built-in way to trigger code
     * when an object is about to be garbage-collected, or when a temporary/stack-based object
     * goes out of scope, this method will have to be called by hand.
     */
    jabberwerx.JWBase.prototype.destroy = function() {
        // currently not tracking observees; subclasses must unregister by hand
        // ... not that there's any way to get destructors to run anyway ... :(

        return null;
    };

    /**
     * Get the class name of this object.
     *
     * @type String
     * @returns The fully-qualified name of the object's class.
     */
    jabberwerx.JWBase.prototype.getClassName = function() {
        return this._className || '';
    };

    /**
     * Returns the objects' classname, in brackets.
     * Override if desired.
     *
     * @type String
     * @returns A string representation of this object.
     */
    jabberwerx.JWBase.prototype.toString = function() {
        return '[' + this.getClassName() + ']';
    };

    /**
     * By default JW objects will not be saved with the object graph.
     * Subclasses can override this behavior by implementing this method
     * and having it return true.
     *
     * The jabberwerx.JWModel class does this for you; in general, model objects are
     * the only objects that should be saved in a persistent store.
     *
     * @type Boolean
     * @returns Whether this object should be saved with the object graph.
     */
    jabberwerx.JWBase.prototype.shouldBeSavedWithGraph = function() {
        return false;
    };

    /**
     * By default JW objects will not be serialized inline from their references.
     * Subclasses can override this behavior by implementing this method
     * and having it return true.
     *
     * @type Boolean
     * @returns Whether this object should be serialized inline with its references.
     */
    jabberwerx.JWBase.prototype.shouldBeSerializedInline = function() {
        return false;
    };

    /**
     * A hook for objects to prepare themselves for serialization. Subclasses
     * should use this to do any custom serialization work. Typically this will
     * involve serializing by hand any foreign (eg, non-JWModel-based) object
     * references that will be necessary for the object's functioning when restored
     * from serialization.
     *
     * It's important to note that there is no guarantee of the order in which
     * objects will have this method invoked, relative to other objects in the
     * graph. Basically, you can't depend on other object's `willBeSerialized`
     * having been called or not called when you're in this method.
     * @see {@link #wasUnserialized}
     */
    jabberwerx.JWBase.prototype.willBeSerialized = function() {
    };

    /**
     * A hook for objects to undo any custom serialization work done
     * in {@link #willBeSerialized}.
     *
     * As with that method, there's no guarantee of the order in which
     * objects will have this method invoked. When this method is invoked,
     * every object in the graph will have been rehydrated into a fully-fleshed-out
     * JW object, with data and prototype chain in place, but there is no
     * guarantee that any other object will have had its `wasUnserialized` invoked.
     */
    jabberwerx.JWBase.prototype.wasUnserialized = function() {
        // whack any observers that did not survive serialization
        jabberwerx.$.each(this._observerInfo, function(eventName, info) {
            info.observers = jabberwerx.$.grep(info.observers, function(observer, i) { return typeof observer.target != 'undefined'; });
        });
    };

    /**
     * A chance for recently-unserialized objects to do something and be assured that
     * every object in the graph has run its custom post-serialization code.
     */
    jabberwerx.JWBase.prototype.graphUnserialized = function() {
    }

    /**
     * Subclasses can call this with one of their method names to get back a storable, portable,
     * and invokable function object. The result can be passed to anything expecting a bare callback.
     *
     * @see jabberwerx.util.generateInvocation
     * @param {String} methodName The name of this object's method to wrap in an invocation object.
     * @param {Array} [boundArguments] Arguments can be bound to the eventual invocation of your object
     * method here at the invocation creation. These arguments will **preceed** in the argument list any
     * arguments that are passed to your method at the actual call site.
     * @type Function
     * @returns A bare callback
     */
    jabberwerx.JWBase.prototype.invocation = function(methodName, boundArguments) {
        return jabberwerx.util.generateInvocation(this, methodName, boundArguments);
    };

    /**
     * @private
     * Creates the override chain.  If {base} and {override} are both
     * functions, then this method generates a new function that:
     * <ol>
     * <li>Remembers any current superclass method (e.g. overriding an
     * override)</li>
     * <li>Sets this._super to {base}</li>
     * <li>Calls {override}, remembering its return value (if any)</li>
     * <li>Sets this._super back to its previous value (if any).</li>
     * <li>Returns the result from {override}</li>
     * </ol>
     *
     * If {override} is undefined and {base} is defined (regardless
     * of its type), {base} is returned as-is. If {override} and {base} are
     * not functions, or if {base} is not a function, {override} is returned
     * as-is.</p>
     *
     * @param   base The base method or property (may be undefined)
     * @param   override The overriding method or property (may be undefined)
     * @returns The function providing the override chain, or {base} or
     *          {override} as appropriate
     */
    var __jwa__createOverrideChain = function(base, override) {
        if (base !== undefined && override === undefined) {
            return base;
        }

        if (    !jabberwerx.$.isFunction(base) ||
                !jabberwerx.$.isFunction(override)) {
            return override;
        }

        return function() {
            var tmp = this._super;

            this._super = base;
            var retval = override.apply(this, arguments);
            this._super = tmp;

            return retval;
        };
    };

    /**
     * Provide mixin support to Javascript objects. This method applies all of
     * the properties and methods from {prop} to this type. A copy of {prop}
     * is made before it is applied, to ensure changes within this type do
     * not impact the mixin definition.</p>
     *
     * <p><b>NOTE:</b> This method should not be called for jabberwerx.JWBase directly.
     * Instead, specific subclasses of jabberwerx.JWBase may use it to include new
     * functionality.</p>
     *
     * <p>Mixin properties are shadowed by the jabberwerx.JWBase class in the same way
     * as super class properties are. In this case, the mixin is considered
     * the super class, and any properties defined in the class override
     * or shadow those with the same name in the mixin.</p>
     *
     * <p>Mixin methods may be overridden by the jabberwerx.JWBase class in the same
     * manner as super class methods are.  In this case, the mixin's method
     * is considered to be the "_super":</p>
     *
     * <p><pre class='code'>
        AMixin = {
            someProperty: "property value",
            doSomething: function() {
                jabberwerx.util.debug.log("something is done");
            }
        };
        MyClass = jabberwerx.JWBase.extend({
            init: function() {
                this._super();  //calls JWBase.prototype.init
            },
            doSomething: function() {
                jabberwerx.util.debug.log("preparing to do something");
                this._super();  //calls AMixin.doSomething
                jabberwerx.util.debug.log("finished doing something");
            }
        }, "MyClass");

        MyClass.mixin(AMixin);
     * </pre></p>
     *
     * @param   {Object} prop The mixin to include
     */
    jabberwerx.JWBase.mixin = function(prop) {
        // create a deep copy of the mixin, to prevent corruption of the Mixin
        prop = jabberwerx.$.extend(true, {}, prop);

        // Apply the mixin's properties and methods, treating the mixin methods
        // as if coming from a super-class (the opposite of extend!)
        for (var name in prop) {
            this.prototype[name] = __jwa__createOverrideChain(
                    prop[name],
                    this.prototype[name]);
        }
    };

    /**
     * Provide intercept support to Javascript objects. This method applies all of
     * the properties and methods from {prop} to this type. A copy of {prop}
     * is made before it is applied, to ensure changes within this type do
     * not impact the intercept definition.</p>
     *
     * <p><b>NOTE:</b> This method should not be called for jabberwerx.JWBase directly.
     * Instead intercept a specific subclasses of jabberwerx.JWBase by adding new
     * or overriding exisiting functions and properties.</p>
     *
     * <p>Intercept functions are inserted into the top of the super class call stack,
     * that is a intercept function's _super call will invoke the original, overridden
     * method. Other properties are "overridden" by changing the property directly.</p>
     *
     * <p><pre class='code'>
     * MyClass = jabberwerx.JWBase.extend({
     *        someProperty: "MyClass property"
     *        init: function() {
     *            this._super();  //calls JWBase.prototype.init
     *        },
     *        doSomething: function() {
     *            jabberwerx.util.debug.log("something is done");
     *        }
     *    }, "MyClass");
     *    AnIntercept = {
     *        someProperty: "AnIntercept property",
     *        doSomething: function() {
     *            jabberwerx.util.debug.log("preparing to do something");
     *            this._super(); //call MyClass.doSomething
     *            jabberwerx.util.debug.log("post something");
     *        }
     *    };
     *
     * MyClass.intercept(AnIntercept);
     * </pre></p>
     *
     * @param   {Object} prop The intercept to include
     */
    jabberwerx.JWBase.intercept = function(prop) {
        prop = jabberwerx.$.extend(true, {}, prop);
        for (var name in prop) {
            this.prototype[name] =
                __jwa__createOverrideChain(this.prototype[name], prop[name]);
        }
    };

    /**
     * Provide classical inheritance to Javascript objects.
     *
     * Following John Resig's Class,
     * <a href="http://ejohn.org/blog/simple-javascript-inheritance/">http://ejohn.org/blog/simple-javascript-inheritance/</a>
     * Inspired by base2 and Prototype
     *
     * One important addition to Resig's code: we provide a quasi-"copy constructor"
     * that will take a bare javascript object with the data and classname of a
     * JW object, and rehydrate it into a full object with prototype chain and object
     * methods in place. Clients/sub-classes probably won't need to use it; it's used
     * by {@link jabberwerx.util.loadGraph}.
     *
     * Within any object method, the superclass's version may be invoked via the variable
     * named `_super`.
     *
     * Ex:
     *
     * <p><pre class='code'>
        MyClass = jabberwerx.JWBase.extend({
            init: function() {
                this._super()
            },
            someMethod: function() {
                doSomething();
            }
        }, 'MyClass');

        AnotherClass = MyClass.extend({ ... })
     * </pre></p>
     *
     * @param {Object} prop The "subclass definition", an object with which to extend the parent class.
     * @param {String} className The fully-qualified name of the class.
     */
    //I haven't found a way to avoid passing the fully-qualified name of the classs.
    jabberwerx.JWBase.extend = function(prop, className) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = __jwa__createOverrideChain(_super[name], prop[name]);
        };

        var _superClass = jabberwerx.$.extend({}, this);

        // The dummy class constructor
        function JWBase() {
            if ( !initializing ) {
                // a JW object is "dehydrated" if its data has been unserialized but
                // it does not have the methods or prototype chain of a real object yet.
                // Rehydrating is done by invoking
                //
                //      new ClassName('__jw_rehydrate__', obj);
                //
                // Where obj is the unserialized raw data object. The returned instance
                // will be a shallow copy of the passed object (including its GUID),
                // but with methods and prototype chain in place. Sort of a "copy constructor".
                if (arguments.length == 2 && typeof arguments[0] == 'string' && arguments[0] == '__jw_rehydrate__') {
                    /*DEBUG-BEGIN*/
                    jabberwerx.util.debug.log('rehydrate constructor, ' + arguments[1]._className, 'persistence');
                    /*DEBUG-END*/
                    // make a SHALLOW copy of the passed argument.
                    // it's assumed that the passed object is dehydrated; ie, no methods or
                    // prototype chain.
                    var obj = arguments[1];
                    for (var p in obj) {
                        this[p] = obj[p];
                    }
                }
                else {
                    // regular construction of a new instance
                    this._guid = jabberwerx.util.newObjectGUID(className || "");
                    this._jwobj_ = true;    // cheap way to say "i'm a jw object!"
                    //this._serialized = false;
                    this._className = (typeof className == 'undefined' ? null : className); // REALLY wish there were a better way!
                    this._observerInfo = {};
                    //this._className = arguments.callee.name;
                    // give ourselves private copies of declared arrays and objects
                    for (var p in this) {
                        if (typeof this[p] != 'function') {
                            this[p] = jabberwerx.util.clone(this[p]);
                        }
                    }
                    //[this._guid] = this;
                    if (this.init) {
                        // All construction is actually done in the init method
                        //jabberwerx.util.debug.log('regular init, argument list is length ' + arguments.length, 'persistence');
                        this.init.apply(this, arguments);
                    }
                }
            }
        };

        // Include class-level methods and properties
        for (var name in _superClass) {
            JWBase[name] = _superClass[name];
        }

        // Populate our constructed prototype object
        JWBase.prototype = prototype;

        // Enforce the constructor to be what we expect
        prototype.constructor = JWBase;

        return JWBase;
    };
})();
}
/**
 * @class
 * JWApp's "native" error object. Just a wrapper/namespace so we can extend
 * Error objects pleasantly.
 *
 * @description
 * <p>Creates a new jabberwerx.util.Error with the given message.</p>
 *
 * @param {String} message The error message.
 * @extends Error
 * @minimal
 */
jabberwerx.util.Error = function(message) {
    this.message = message;
};
jabberwerx.util.Error.prototype = new jabberwerx.util.Error();


/**
 * Create a new Error type.
 *
 * You can define the message and extension at declaration time (ie, defining the error class)
 * and then override it at creation time (ie, at the throw site) if desired.
 *
 * @param {String} message Becomes the base Error object's message.
 * @param {Object} extension Properties in this object are copied into the new error type's prototype.
 * @type Function
 */
jabberwerx.util.Error.extend = function(message, extension) {
    var f = function(message, extension) {
        this.message = message || this.message;
        for (var p in extension) {
            this[p] = extension[p];
        }
    };

    f.prototype = new this(message);
    for (var p in extension) {
        f.prototype[p] = extension[p];
    }

    return f;
}

/**
 * @class
 * <p>Error thrown when an object has, but does not support,
 * a method or operation.</p>
 *
 * @extends jabberwerx.util.Error
 * @minimal
 */
jabberwerx.util.NotSupportedError = jabberwerx.util.Error.extend("This operation is not supported");


/**
 * @private
 * Internal cache of invocation objects; two calls to
 * {@link jabberwerx.util.generateInvocation} will return the same function object.
 */
jabberwerx.util._invocations = {};

/**
 * Invocations are function objects that do two nifty things.
 *
 * <p><ul>
 * <li>They wrap an (optional) JW object reference and method name, and
 *   an invocation of the bare invocation object reference is secretly
 *   an invocation of the named method on the JW object.</li>
 *
 * <li>We treat invocation objects specially during serialization and
 *   unserialization. They carry their object GUID and method name along with
 *   them into persistence-land, and we rehydrate that info into a real function
 *   when we load the graph.</li>
 * </ul></p>
 *
 * <p>The former nifty thing means you can pass an invocation object as a callback
 * to any service expecting a bare function reference, and, when invoked,
 * the callback will be applied within object scope, rather than global scope.</p>
 *
 * <p>We also cache invocation objects, so you will always get the same function object
 * back from each call to generateInvocation when passing the same object and
 * method name. This is useful for registering an invocation as a handler
 * for some service that registers/unregisters handlers by function reference,
 * (eg, dom or jQuery events) and then unregistering it later.</p>
 *
 * <p>The latter nifty thing means that callback handlers among JW objects will be
 * preserved across graph loading and storing and automatically re-connected when
 * the graph is rehydrated. That's assuming, of course, that the target object
 * was stored in the graph to begin with. Since models are generally stored,
 * callback networks among model objects can be expected to be stored, while
 * callbacks involving other kinds of objects will have to be re-created after
 * unserialization. {@link jabberwerx.JWBase.wasUnserialized} and
 * {@link jabberwerx.JWBase.graphUnserialized} are usually good places to do this.</p>
 *
 * @param {jabberwerx.JWBase} object Any JW object
 * @param {String} methodName The name of the method this invocation represents.
 * @param {Array} [boundArguments] An optional array of arguments to pass to the invocation. These will PRECEED any arguments passed to the invocation at the actual call site.
 * @returns {function} object An "invocation"-type function object.
 */
jabberwerx.util.generateInvocation = function(object, methodName, boundArguments) {
    var objectTag = '_global_';
    if (jabberwerx.util.isJWObjRef(object)) {
        objectTag = object._guid;
    }
    // we don't support any objects that aren't JW objects or global (window)

    var f = jabberwerx.util._invocations[objectTag + '.' + methodName]
    if (typeof f != 'undefined') {
        return f;
    }
    if (typeof boundArguments != 'undefined') {
        if (typeof boundArguments != 'object' || !(boundArguments instanceof Array)) {
            boundArguments = [boundArguments];
        }
    }
    else {
        boundArguments = [];
    }

    var f = function() {
        return jabberwerx.util.invoke.apply(arguments.callee, [arguments.callee].concat(boundArguments, Array.prototype.slice.call(arguments)));
    };
    f.object = object;
    f.methodName = methodName;
    f._jwinvocation_ = true;
    jabberwerx.util._invocations[objectTag + '.' + methodName] = f;
    return f;
};


/**
 * Invoke an invocation function object. Clients shouldn't need to call this.
 *
 * The first argument is the invocation object, remaining arguments are arguments
 * to pass through to the method.
 *
 * @param {Object} invocationObject The invocation object.
 * @param {Anything} [...] Remaining arguments are passed on to the invocation method.
 */
jabberwerx.util.invoke = function() {
    var invocation = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof invocation.object == 'undefined' || !invocation.object) {
        // assume a global method
        return window[invocation.methodName].apply(window, args);
    }
    else {
        return invocation.object[invocation.methodName].apply(invocation.object, args);
    }
};

/**
 * @private
 * This is an optional saftey measure to try to avoid observer event name
 * collisions. There's no requirement that you register custom event names;
 * just be careful.
 */
jabberwerx.util.eventNames = [
    'jw_valueChanged',
    'jw_collectionChanged',
];
/**
 * @private
 * Register an observer event name. There's no requirement
 * that you register events; it's like wearing a bike helmet.
 *
 * @param {String} name The name of the observable/event.
 * @throws jabberwerx.util.EventNameAlreadyRegisteredError
 */
jabberwerx.util.registerEventName = function(name) {
    if (jabberwerx.util.eventNames.indexOf(name) == -1) {
        jabberwerx.util.eventNames.push(name);
    }
    else {
        throw new jabberwerx.util.EventNameAlreadyRegisteredError('JW event name ' + name + ' already registered!');
    }
};

/**
 * @private
 */
jabberwerx.util.EventNameAlreadyRegisteredError = jabberwerx.util.Error.extend('That event name is already registered!');

/**
 * @private
 */
jabberwerx.util._objectUIDCounter = 0;

/**
 * Generate a quasi-guid for object tracking.
 *
 * @param {String} className Class name of object.
 * @returns {String} a new guid
 */
jabberwerx.util.newObjectGUID = function(className) {
    jabberwerx.util._objectUIDCounter = (jabberwerx.util._objectUIDCounter + 1 == Number.MAX_VALUE) ? 0 : jabberwerx.util._objectUIDCounter + 1;
    return '_jwobj_' + className.replace(/\./g, "_") + '_' + (new Date().valueOf() + jabberwerx.util._objectUIDCounter).toString();
};


/**
 * @private
 * Adapted from dojo._escapeString.
 * Adds escape sequences for non-visual characters, double quote and
 * backslash and surrounds with double quotes to form a valid string
 * literal.
 *
 * @param {String} str String to escape
 * @returns {String} escaped string
 */
jabberwerx.util._escapeString = function(str){
    return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').
        replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
        replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r"); // string
};

/**
 * Adapted from dojo.isString
 * <p>Checks if the parameter is a String.</p>
 *
 * @param {Object} it Object to check.
 * @returns {Boolean} <tt>true</tt> if object is a string, false otherwise.
 */
jabberwerx.util.isString = function(it){
    return !!arguments.length && it != null && (typeof it == "string" || it instanceof String); // Boolean
};

/**
 * Adapted from dojo.isArray
 * <p>Checks if the parameter is an Array.</p>
 *
 * @param {Object} it Object to check.
 * @returns {Boolean} <tt>true</tt> if object is an array, false otherwise.
 */
jabberwerx.util.isArray = function(it){
    return it && (it instanceof Array || typeof it == "array"); // Boolean
};

/**
 * @private
 * Dependency from dojo.map.
 *
 * @returns {Array} array of stuff used in dojo.map
 */
jabberwerx.util._getParts = function(arr, obj, cb){
    return [
        jabberwerx.util.isString(arr) ? arr.split("") : arr,
        obj || window,
        // FIXME: cache the anonymous functions we create here?
        jabberwerx.util.isString(cb) ? new Function("item", "index", "array", cb) : cb
    ];
};

/**
 * Adapted from dojo.map
 * <p>Applies callback to each element of arr and returns an Array with
 * the results. This function corresponds to the JavaScript 1.6 Array.map() method.
 * In environments that support JavaScript 1.6, this function is a
 * passthrough to the built-in method.</p>
 * <p>For more details, see:
 * <a href = "http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map">
 * http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
 * </a></P>
 *
 * @param {Array|String} arr The array to iterate on.  If a string, operates on individual characters.
 * @param {Function|String} callback The function is invoked with three arguments: item, index, and array and returns a value
 * @param {Object} [thisObject] May be used to scope the call to callback
 *
 * @returns {Array} passed in array after the callback has been applied to each item
 */
jabberwerx.util.map = function(arr, callback, thisObject){
    var _p = jabberwerx.util._getParts(arr, thisObject, callback); arr = _p[0];
    var outArr = (arguments[3] ? (new arguments[3]()) : []);
    for(var i=0;i<arr.length;++i){
        outArr.push(_p[2].call(_p[1], arr[i], i, arr));
    }
    return outArr; // Array
};

/**
 * Determines if the passed reference is a GUID for a JWBase-derived object.
 * @param {Object} ref Reference to check.
 * @returns {Boolean} <tt>true</tt> if passed reference is a GUID for a JWBase-derived object, otherwise false.
 */
jabberwerx.util.isJWObjGUID = function(ref) {
    return (typeof ref == 'string' && (ref.indexOf('_jwobj_') == 0 || ref.indexOf('"_jwobj_') == 0));
}

/**
 * Determines if the passed reference is a JWBase-derived object.
 * @param {Object} ref Reference to check.
 * @returns {Boolean} <tt>true</tt> if passed reference is a JWBase-derived object, otherwise false.
 */
jabberwerx.util.isJWObjRef = function(ref) {
    return (ref && typeof ref == 'object' && typeof ref._jwobj_ == 'boolean' && ref._jwobj_);
}

/**
 * Determines if the passed reference is one of our invocation objects.
 * @param {Object} ref Reference to check.
 * @returns {Boolean} <tt>true</tt> if passed reference is one of our invocation objects, otherwise false.
 */
jabberwerx.util.isJWInvocation = function(ref) {
    return (ref && (typeof ref._jwinvocation_ != 'undefined'));
};

/**
 * Depth-first recursively clone passed argument. Cyclical references will
 * result in infinite recursion. Will shallow-copy an argument's
 * prototype if it exists, and will shallow-copy functions.
 *
 * @param {arg} The object/array/whatever to clone.
 * @returns {Anything} The new cloned whatever.
*/
jabberwerx.util.clone = function(arg) {
    if (typeof arg == 'object' && arg != null) {
        if (arg instanceof Array) {
            var copy = [];
            for (var i = 0; i < arg.length; i++) {
                copy.push(jabberwerx.util.clone(arg[i]));
            }
        }
        if (typeof copy == 'undefined') {
            var copy = {};
        }
        for (var p in arg) {
            copy[p] = jabberwerx.util.clone(arg[p]);
        }
        if (typeof arg.prototype != 'undefined') {
            copy.prototype = arg.prototype;
        }
    }
    else {
        var copy = arg;
    }
    return copy;
};

/**
 * Almost, but not quite, like WordPress's sanitize_title_with_dashes.
 * <a href = "http://codex.wordpress.org/Function_Reference/sanitize_title_with_dashes">http://codex.wordpress.org/Function_Reference/sanitize_title_with_dashes</a>
 * <p>The difference with this implementation is that the seperator can be specified as an input parameter.</p>
 *
 * @param {String} string String which to slugify
 * @param {String} separator String value which to replace '-' with in string.
 * @returns {String} string but with all instances of '-' replaced with seperator.
 */
jabberwerx.util.slugify = function(string, separator) {
    return string.toLowerCase().replace('-', separator).replace(/[^%a-z0-9 _-]/g, '').replace(/\s+/g, (typeof separator != 'undefined' ? separator : '-'));
};

//utf8 safe encoding
/**
 * <p>Encodes a string into an obfuscated form.</p>
 *
 * @param   {String} s The string to encode
 * @returns {String} The obfuscated form of {s}
 */
jabberwerx.util.encodeSerialization = function(s) {
    if (s) {
        return jabberwerx.util.crypto.b64Encode(jabberwerx.util.crypto.utf8Encode(s));
    }
    return '';
}

/**
 * <p>Decodes a string from an obfuscated form.</p>
 *
 * @param   {String} s The string to decode
 * @returns {String} The un-obfuscated form of {s}
 */
jabberwerx.util.decodeSerialization = function(s) {
    if (s) {
        return jabberwerx.util.crypto.utf8Decode(jabberwerx.util.crypto.b64Decode(s));
    }
    return '';
}


/**#nocode+
 * IE awesomeness -- if indexOf is not defined, define it.
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}
/**#nocode- */

/**
 * Pass an xml string, get back an xml document. Optionally pass
 * the name of a tag in which to wrap the result.
 *
 * @param {String} s The XML to convert into DOM objects
 * @param {String} [wrap] The name of a tag in which you'd like your xml wrapped.
 * @returns {Document} An XML document.
 */
jabberwerx.util.unserializeXMLDoc = function(s, wrap) {
    if (!s && !wrap) {return null;}

    if(typeof wrap == 'string') {
        s = '<' + wrap + '>' + s + '</' + wrap + '>';
    }
    var builder = new jabberwerx.NodeBuilder("nbwrapper");
    builder.xml(s);
    var unwrapped = builder.data.childNodes[0];
    builder.data.removeChild(unwrapped);
    builder.document.removeChild(builder.data);
    builder.document.appendChild(unwrapped);
    return builder.document;
};

/**
 * Parses the passed XML and returns the document element.
 * <p>Similar to {@link jabberwerx.util.unserializeXMLDoc}</p>
 *
 * @param {String} s The XML to convert into DOM objects
 * @param {String} [wrap] The name of a tag in which you'd like your xml wrapped.
 * @returns {Element} An XML document element.
 */
jabberwerx.util.unserializeXML = function(s, wrap) {
    var d = jabberwerx.util.unserializeXMLDoc(s, wrap);
    return (d ? d.documentElement : d);
};
/**
 * Generates XML for the given Node.
 *
 * @param {XML DOM Node} n XML node
 * @returns {String} XML for given node n. null if n is undefined.
 */
jabberwerx.util.serializeXML = function(n) {
    if (typeof(XMLSerializer) != "undefined") {
        return new XMLSerializer().serializeToString(n);
    } else if (n.xml) {
        return n.xml;
    }

    return null;
};

//Overload to provide Node.xml
if (    typeof(XMLSerializer) != "undefined" &&
        typeof(Node) != "undefined" &&
        Node.prototype &&
        Node.prototype.__defineGetter__) {
    Node.prototype.__defineGetter__(
            "xml",
            function() {
                return jabberwerx.util.serializeXML(this);
            });
}

/**
 * <p>Jabberwerx debug console. Exposes a subset of Firebug methods
 * including log, warn, error, info, debug and dir. Jabberwerx console
 * methods may only be passed one log message (Firebug allows formatted
 * strings and values, ala printf) and a "stream". Streams are message types and allow
 * finer filtering of log messages.</p>
 *
 * <p>For example jabberwerx.util.debug.log("my foo", "bar") will log
 * "my foo" if the stream "bar" is enabled see {@link jabberwerx.util.setDebugStream}.</p>
 *
 * <p>If the built in console (window.console) does not support a particular method
 * the given message is not logged.</p>
 *
 */
jabberwerx.util.debug = {
    /** an external console implementing the same logging methods as jabbrwerx.util.debug **/
    consoleDelegate: null,
    /** The built in window console **/
    console: window.console || null
}

// jabberwerx.util.debug.log, jabberwerx.util.debug.dir, etc ...
// second argument is a stream name; will only log when that stream is turned on in jabberwerx.util.debug.streams
jabberwerx.$.each(['log', 'dir', 'warn', 'error', 'info', 'debug'], function(i, e) {
    jabberwerx.util.debug[e] = function(a, streamName) {
        //no logging if all logging disabled or the given stream is disabled
        if (!jabberwerx._config.debug.on ||
            (jabberwerx.util.isString(streamName) && !jabberwerx._config.debug[streamName])) {
            return;
        }

        if (jabberwerx.util.isString(streamName)) {
            a = '[' + streamName + '] '  + a;
        }

        //built in console may have been destroyed or may not support this method. Don't log.
        try {
            jabberwerx.util.debug.console[e](a);
        } catch (ex) {}

        //console delegates should support the same interface jabberwerx.util.debug implements.
        //throw exception if it does not
        if (jabberwerx.util.debug.consoleDelegate) {
            jabberwerx.util.debug.consoleDelegate[e](a);
        }
    }
});

/**
 * Add or overwrite the setting on a debug stream.
 *
 * @param {String} streamName Debug stream name
 * @param {String} value Debug stream value to set.
 */
jabberwerx.util.setDebugStream = function(streamName, value) {
    jabberwerx._config.debug[streamName] = (typeof value == 'undefined' ? true : value);
};

/*DEBUG-BEGIN*/
jabberwerx.util.debug.on = window.jabberwerx._config.debug.on;
for (var streamName in window.jabberwerx._config.debug.streams) {
    jabberwerx.util.setDebugStream(streamName, window.jabberwerx._config.debug.streams[streamName]);
}
/*DEBUG-END*/
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/jwapp/JWPersist.js*/
/**
 * filename:        JWPersist.js
 * created at:      2010/04/10
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx && jabberwerx.util) {

/**
 * @deprecated do not use
 */
jabberwerx.util.config = {
    maxGraphAge: 30
};

//function wrapper to keep convenience funcs out of global scope
(function(){

var __MULTI_KEY_STORE       = "_jw_store_.",
    __MULTI_KEY_TIMESTAMP   = "_jw_store_timestamp_.",
    __MULTI_KEY_INDEX       = "_jw_store_keys_.",
    //Use a new namespace to differenciate one key vs many
    __JW_STORE              = "_jw_store_",
    __JW_STORE_TIMESTAMP    = "_jw_store_timestamp_";

/**
 * @private
 * remove all instances of the given key from JW_STORE NS.
 * includes timestamp and index keys
 * tries all deprecated and current key prefixes
 *
 * @param key {string}
 * @throws jabberwerx.util.JWStorageRequiresjQueryjStoreError
 */
function __remove(key) {
    if (!jabberwerx.$.jStore || !jabberwerx.$.jStore.isReady || !jabberwerx.$.jStore.CurrentEngine.isReady) {
        throw new jabberwerx.util.JWStorageRequiresjQueryjStoreError();
    }

    try {
        //remove any possible keys, noop if they don't exist
        jabberwerx.$.jStore.remove(__MULTI_KEY_STORE + key);
        jabberwerx.$.jStore.remove(__MULTI_KEY_TIMESTAMP + key);
        jabberwerx.$.jStore.remove(__MULTI_KEY_INDEX + key);
        jabberwerx.$.jStore.remove(__JW_STORE + key);
        jabberwerx.$.jStore.remove(__JW_STORE_TIMESTAMP + key);
        /*DEBUG-BEGIN*/
            jabberwerx.util.debug.log('Removed ' + key, 'persistence');
        /*DEBUG-END*/
    } catch (e) {
        jabberwerx.util.debug.warn("jStore exception (" + e.message + ") trying to remove " + key);
    }
};

/**
 * @private
 * fetch or set a timestamp for the given key
 */
function __timestamp(key, value) {
    if (!jabberwerx.$.jStore || !jabberwerx.$.jStore.isReady || !jabberwerx.$.jStore.CurrentEngine.isReady) {
        throw new jabberwerx.util.JWStorageRequiresjQueryjStoreError();
    }
    if (value !== undefined) {
        value = __escapeJSON(value);
        jabberwerx.$.jStore.store(__JW_STORE_TIMESTAMP + key, value);
    } else {
        value = jabberwerx.$.jStore.store(__JW_STORE_TIMESTAMP + key);
        if (!value) {
            value = jabberwerx.$.jStore.store(__MULTI_KEY_TIMESTAMP + key);
        }
    }
    return value;
};

/**
 * @private
 * Fetch or store keys & values
 * Checks for many keys or one key (prior to v 2010.11) when retrieving.
 * Removes all associated keys when fetching.
 * Returns the object tree serialized in store. Legacy keys are eval-ed and
 * constructed before returning. Doing conversion work here to allow most
 * of the json serializing/reconstructing to be done by the storage engine.
 *
 * @param key {string} key to store in _jw_store_ NS
 * @param [value] {object|string} object or string to be stored,
 *                                objects may be json-ed before store
 * @returns {Object} {root:object, linked:map(guid:JWObject refs)}
 * @throws jabberwerx.util.JWStorageRequiresjQueryjStoreError
 */
function __store(key, value) {
    if (!jabberwerx.$.jStore || !jabberwerx.$.jStore.isReady || !jabberwerx.$.jStore.CurrentEngine.isReady) {
        throw new jabberwerx.util.JWStorageRequiresjQueryjStoreError();
    }
    var keystr = __JW_STORE + key;
    if (value !== undefined) {
        //serialize if needed
        value = jabberwerx.util.serialize(value);
        value = __escapeJSON(value);

        jabberwerx.$.jStore.store(keystr, value);
        /*DEBUG-BEGIN*/
            jabberwerx.util.debug.log("Stored " + keystr + ":\n" + value, 'persistence');
        /*DEBUG-END*/
        __timestamp(key, new Date().getTime());
    } else {
        value = jabberwerx.$.jStore.store(keystr);
        if (value) {
            value = __unescapeJSON(value);
            if (jabberwerx.util.isString(value)) {
                try {
                    value = eval("(" + value + ")");
                } catch (e) {
                    jabberwerx.util.debug.warn("Could not evaluate json string returned from storage:" + e);
                    value = null;
                }
            } else if (!jabberwerx.$.isPlainObject(value)) {
                //something wrong here, not simple json object, not string
                jabberwerx.util.debug.warn("Unknown object type returned from storage");
                value = null;
            }
        } else {
            keystr = __MULTI_KEY_INDEX + key;
            //check to see if this key is a key of keys and handle loading refs as needed
            value = jabberwerx.$.jStore.store(keystr);
            if (value) { //check for storage item object per Colin
                if (!jabberwerx.$.isPlainObject(value)) {
                    //something wrong here, not simple json object
                    jabberwerx.util.debug.warn("Unknown object type returned from storage");
                    return null;
                }
                for (var onekey in value) {
                    value[onekey] = jabberwerx.$.jStore.store(__MULTI_KEY_STORE + onekey);
                    __remove(onekey);
                    //objectify
                    value[onekey] = eval('(' + value[onekey] + ')');
                }
            } else {
                value = null;
            }
        }
        __remove(key);
    }
    return value;
};

/**
 * @private
 * walk given object tree and prepare JWObject refs for JSONification
 * 1 - add first object occurance to registry map
 * 2 - replace any JW object ref with its guid
 * 3 - replace JWInvocations with a serializable object
 * treeRoot is modified
 */
function __jsonPrep(treeRoot) {
    var registry = {}; //map of JWBase objects that have been encountered at least once
    //substitute or modify the given JW Object and JW Invocation references
    function fixupRef(ref) {
        if (jabberwerx.util.isJWObjRef(ref)) {
            //if this reference should not be persisted at all.
            if(ref.shouldBeSavedWithGraph && !ref.shouldBeSavedWithGraph()) {
                return undefined;
            }
            //JW objects without classnames should not be persisted
            if (!ref._className) {
                return undefined;
            }
            //if this ref should be serialized, add to registry and replace w/ guid
            if (!ref.shouldBeSerializedInline || !ref.shouldBeSerializedInline()) {
                if (registry[ref._guid] === undefined) {
                    registry[ref._guid] = ref;
                    ref.willBeSerialized && ref.willBeSerialized();
                    fixupTree(ref);//returning string, stopping recursion. recurse now
                }
                return ref._guid;
            } else {
                ref.willBeSerialized && ref.willBeSerialized();
                return ref; //will be recursed
            }
       }
        //replace invocations with an easily json-ed object.
        if (jabberwerx.util.isJWInvocation(ref)) {
            return {object: ref.object._guid, methodName: ref.methodName, _jwinvocation_: true};
        }
        return ref; //all other types
    };

    //recursively walk the object tree and "fixup" every object property and
    //array JW obj reference
    function fixupTree(root) {
        var recurse = arguments.callee;

        if (jabberwerx.util.isJWObjRef(root) || jabberwerx.$.isPlainObject(root)) {
            for (var p in root) {
                if (root.hasOwnProperty(p)) {
                    root[p] = fixupRef(root[p]);
                    recurse(root[p]);
                }
            }
        } else if (jabberwerx.$.isArray(root)) {
            for (var i = 0; i < root.length; ++i) {
                root[i] = fixupRef(root[i]);
                recurse(root[i]);
            }
        }
    };
    fixupTree(treeRoot);
    treeRoot = fixupRef(treeRoot);
    return registry;
};

/**
 * @private
 * prep JSON for write. re-defined for flash storage (see _handleStoreReady)
 */
var __escapeJSON = function(json) {
    return json;
}

var __unescapeJSON = function(json) {
    return json;
}
/**
 * The method invoked when the storage engine is ready to go.
 *
 * @private
 */
jabberwerx.util._handleStorageReady = function(engine) {
    //change json escaping to dbl escape if engine is flash
   if (engine.type.toLowerCase() == 'flash') {
        var _esc_pred = __escapeJSON;//predecessor json handler
        __escapeJSON = function(json) {
            if (!jabberwerx.util.isString(json)) {
                return json;
            }
            var tstr = _esc_pred(json);
            tstr = jabberwerx.util._escapeString(tstr);
            tstr = tstr.replace(/\\\"/g, '\\\\\"').replace(/\\f/g, "\\\\f").
                        replace(/\\b/g, "\\\\b").replace(/\\n/g, "\\\\n").
                        replace(/\\t/g, "\\\\t").replace(/\\r/g, "\\\\r");
            return tstr;
        };
        var _unesc_pred = __unescapeJSON;
        __unescapeJSON = function(json) {
            if (!jabberwerx.util.isString(json)) {
                return json;
            }
            var tstr = _unesc_pred(json);
            //strip leading and trailing " as needed
            if (tstr.charAt(0) == '"' && tstr.charAt(tstr.length - 1) == '"') {
                tstr = tstr.slice(1, tstr.length - 1);
            }
            return (tstr.replace(/\\"/g, '"'));
        };
   }
};

/**
 * @deprecated
 * The global graph registry.
 * @todo: make this associated with an app or "document" or something, so it's not global.
 */
jabberwerx.util._markGraph = function(tag, root) {
    if (jabberwerx.util._graphRegistry) {
        if (root && (!root.shouldBeSerializedInline || !root.shouldBeSerializedInline())) {
            /*DEBUG-BEGIN*/
                jabberwerx.util.debug.log('marking ' + tag + ' in registry');
            /*DEBUG-END*/

            jabberwerx.util._graphRegistry[tag] = {
                timestamp: new Date(),
                value: root,
                graph: jabberwerx.util.findReachableGUIDs(root)
            };
        } else {
            /*DEBUG-BEGIN*/
                jabberwerx.util.debug.log('unmarking ' + tag + ' from registry');
            /*DEBUG-END*/
            delete jabberwerx.util._graphRegistry[tag];
        }
    }
};

/**
 * Adapted from dojo.toJson
 * <p>Serialize an object; Object cycles will cause inifinite
 * recursion.</p>
 *
 * @param {Object} it Object at which to start traversing the graph.
 * @param {Boolean} prettyPrint Whether to include newlines and tabs in the output.
 * @param {String} _indentStr Private to the recursion; clients shouldn't pass anything.
 * @returns {String} the JSON-serialization of the object
 */
jabberwerx.util.serialize = function(it, prettyPrint, _indentStr) {
    var f = function(it, prettyPrint, _indentStr) {
        if(it === undefined) {
            return "undefined";
        }
        var objtype = typeof it;
        if(objtype == "number" || objtype == "boolean") {
            return it + "";
        }
        if(it === null){
            return "null";
        }
        if(jabberwerx.util.isString(it)) {
            return jabberwerx.util._escapeString(it);
        }
        if((typeof it.nodeType == 'number') && (typeof it.cloneNode == 'function')) { // isNode
            // the original code here from dojo (below) yielded invalid JSON.
            return '{}';
        }

        var recurse = arguments.callee;
        // short-circuit for objects that support "json" serialization
        // if they return "self" then just pass-through...
        var newObj;
        _indentStr = _indentStr || "";
        var nextIndent = prettyPrint ? _indentStr + "\t" : "";

        if(typeof it.__json__ == "function"){
            newObj = it.__json__();
            if(it !== newObj){
                return recurse(newObj, prettyPrint, nextIndent);
            }
        }
        if(typeof it.json == "function"){
            newObj = it.json();
            if(it !== newObj){
                return recurse(newObj, prettyPrint, nextIndent);
            }
        }

        var sep = prettyPrint ? " " : "";
        var newLine = prettyPrint ? "\n" : "";
        var val;

        // array
        if(jabberwerx.util.isArray(it)){
            var res = jabberwerx.util.map(it, function(obj){
                val = recurse(obj, prettyPrint, nextIndent);
                if(typeof val != "string"){
                    val = "undefined";
                }
                return newLine + nextIndent + val;
            });
            return "[" + res.join("," + sep) + newLine + _indentStr + "]";
        }

        if(objtype == "function"){
            return null;
        }

        // generic object code path
        var output = [];
        if (!('responseText' in it) && !('responseXML' in it)) {
            // don't do anything with xmlhttprequest objects
            try {
                // ie is doing something psychotic here.
                for (var key in it) { break; }
            }
            catch (e) {
                // suppressed so we can all get on with our lives.
                return "null";
            }
            for (var key in it) {
                //skip undefined properties, not valid JSON
                if (it[key] === undefined) {
                    continue;
                }
                var keyStr;
                if(typeof key == "number"){
                    keyStr = '"' + key + '"';
                }else if(typeof key == "string"){
                    keyStr = jabberwerx.util._escapeString(key);
                }else{
                    // skip non-string or number keys
                    continue;
                }

                val = recurse(it[key], prettyPrint, nextIndent);

                if(typeof val != "string"){
                    // skip non-serializable values
                    continue;
                }
                output.push(newLine + nextIndent + keyStr + ":" + sep + val);
            }
        }

        return "{" + output.join("," + sep) + newLine + _indentStr + "}"; // String
    };
    return f(it, prettyPrint, _indentStr);
}

/**
 * @deprecated
 * Traverses the object graph from the passed object and records
 * the guids of evey object reachable from the passed object.
 *
 * @param {CFBase} start The object at which to start traversing.
 * @returns {String[]} An array of guids.
 */
jabberwerx.util.findReachableGUIDs = function(start) {
    var traversedGUIDs = {};
    (function f(root, depth) {
        if (typeof root == 'object' && root != null) {
            var s = ''; for (var p = 0; p < depth; p++) { s += '   '; }
            if (jabberwerx.util.isArray(root)) {
                // array
                for(var i = 0; i < root.length; i++) {
                    if (root[i]) {
                        f(root[i], depth + 1);
                    }
                }
            }
            else if (jabberwerx.util.isJWObjRef(root)) {
                // jw object
                if (traversedGUIDs[root._guid] === undefined) {
                    traversedGUIDs[root._guid] = root;
                    for (var p in root) {
                        if (root[p]) {
                            f(root[p], depth + 1);
                        }
                    }
                }
            }
            else if (root.constructor == Object){
                // regular object
                for (var p in root) {
                    try{
                        if (root[p] && typeof root[p] == 'object') {
                            f(root[p], depth + 1);
                        }
                    } catch(e){
                        // Safari oddtity - XMLHttpRequest objects in the DOM can have the following properties set
                        // status - Error: INVALID_STATE_ERR: DOM Exception 11
                        // statusText - Error: INVALID_STATE_ERR: DOM Exception 11
                        // If the properties are set to these values it causes can exception to be thrown causing persistance to fail.
                        // Catching the exception at this point to avoid persistance failure.
                        jabberwerx.util.debug.log('Exception throw while searching for reachable GUIDs: '
                        + ' Property: ' + p
                        + ' Exception: ' + e.message);
                    }
                }
            }
        }
    })(start, 0);
    return traversedGUIDs;
};

/**
 * Save an object graph.
 *
 * <p>Pass an object to act as the "root" of the graph. Any objects you need to save should be
 * reachable from this root. This is the object you will get back when you call {@link jabberwerx.util.loadGraph}.</p>
 *
 * @param {CFBase} root A "root" JWBase or plain object for the graph.
 * @param {String} tag A name for the stored graph.
 * @param {Function} callback A callback to be invoked when the save is complete.
 * @throws {jabberwerx.util.JWStorageRequiresjQueryjStoreError} if `_jw_store_` does not exist, or if it is not ready.
 */
jabberwerx.util.saveGraph = function(root, tag, callback) {
    /*DEBUG-BEGIN*/
        jabberwerx.util.debug.log('Storing object tree: ' + tag, 'persistence');
    /*DEBUG-END*/
    try {
        //todo make sure root is shouldBeSavedWithGraph
        var objRefs = __jsonPrep(root);
        objRefs[tag] = root;
        //store returns serialized as a side effect
        var serializedRoot = __store(tag, objRefs);

        //make returned result, callback params backwards compatable
        var serialized = {};
        serialized[tag] = '{"reference":' + serializedRoot + ',"timestamp":' +  __timestamp(tag) + '}';
        if (callback) {
            callback(serialized);
        }
        return serialized;
    } catch (e) {
        jabberwerx.util.debug.warn("Could not store '" + tag + "'(" + e.message + ")");
        throw (e);
    }
};

/**
 * Returns a ref to the root object originally stored with this tag, connected
 * to its stored graph.
 *
 * @param {String} tag Tag name stored with root object.
 * @returns {CFBase} The root object originally stored with this tag.
 * @throws {jabberwerx.util.JWStorageRequiresjQueryjStoreError} if it is not ready.
 */
jabberwerx.util.loadGraph = function(tag) {
    //linked is a map of guid:JWobject refs. contains all objects
    //created by either __store or knitter.
    var tagStore = {};
    var knitter;

    //helper func to create JW objects
    var __creator = function(base) {
        return eval('new ' + base._className + '("__jw_rehydrate__", base)');
    }

    //knitter recursively walks the objects, and:
    //  1) changes GUID references to the JWObject it refers to
    //  2) regenerates JWInvocation instances
    //  3) reconstruct inline JWBase objects
    knitter = function(arg, registry) {
        if (!arg) {
            return arg;
        }

        switch(typeof arg) {
            case 'string':
                //is this string a jwobj guid? return the knitted jwobj
                if (jabberwerx.util.isJWObjGUID(arg)) {
                    if (registry[arg] === undefined) {
                        jabberwerx.util.debug.warn("Unrecognized GUID: " + arg, 'persistence');
                    }
                    return knitter(registry[arg], registry);
                }
               break;

            case 'object':
                if (jabberwerx.util.isJWInvocation(arg)) {
                   var typeObject = knitter(arg.object, registry);
                    //an invocation without an object reference, ignore
                    if (!typeObject) {
                        return null;
                    }
                    /*DEBUG-BEGIN*/
                        jabberwerx.util.debug.log("Reconstructing JWInvocation(" + typeObject._guid + ", " + arg.methodName + ")", "persistence");
                    /*DEBUG-END*/
                    return jabberwerx.util.generateInvocation(typeObject, arg.methodName);
                }

                if (jabberwerx.util.isJWObjRef(arg)) {
                    if (arg.__knitted) {
                        return arg; //stop circular references
                    }
                    if (registry[arg._guid] === undefined) {
                        /*DEBUG-BEGIN*/
                            jabberwerx.util.debug.log("Reconstructing inline " + arg._guid , "persistence");
                        /*DEBUG-END*/
                        arg = __creator(arg);
                    } else {
                        /*DEBUG-BEGIN*/
                            jabberwerx.util.debug.log("Linking " + arg._guid, "persistence");
                        /*DEBUG-END*/
                    }
                    arg.__knitted = true; //stop circular references
                }

                //un-knitted jw objs and regular objects
                for (var key in arg) {
                    //skip guid to avoid recursion
                    if (key != '_guid') {
                        arg[key] = knitter(arg[key], registry);
                    }
                }
                break;

            case 'array':
                for (var i in arg) {
                    arg[i] = knitter(arg[i], registry);
                }
                break;
        }

        return arg;
    };

    /*DEBUG-BEGIN*/
        jabberwerx.util.debug.log("Loading object tree: " + tag, "persistence");
    /*DEBUG-END*/
    tagStore = null;
    var ts = jabberwerx.util.getLoadedGraphAge(tag);
    //check timestamp for given graph, load only if store exists and
    //within allowed age or timestamp does not exist
    if (ts && (ts.getTime() < jabberwerx.util.getMaxGraphAge()*1000)) {
        tagStore = __store(tag);
    }
    if (!tagStore) {
        /*DEBUG-BEGIN*/
            jabberwerx.util.debug.log("A valid " + tag + " is not stored", "persistence");
        /*DEBUG-END*/
        __remove(tag);
        return null;
    }

    try {
        var root = null;
        //handle root not JWObject by removing from registry before creation
        if (!jabberwerx.util.isJWObjRef(tagStore[tag])) {
            root = tagStore[tag];
            delete tagStore[tag];
        }
        //tagStore is a map of guids to object serializations
        for (var p in tagStore) {
            if (tagStore.hasOwnProperty(p)) {
                tagStore[p] = __creator(tagStore[p]);
            }
        }
        if (!root) {
            root = tagStore[tag]; //root was a JW object
        }

        //map of guids JW Base objects. This allows backwards compatablility
        //with one key (root object) or many keys
        //start knitting from root
        /*DEBUG-BEGIN*/
            jabberwerx.util.debug.log("Reconstructing root: " +
                                      root._className ? root._className : "unknown",
                                      "persistence");
        /*DEBUG-END*/
        root = knitter(root, tagStore);

        for (var guid in tagStore) {
            //handy place to fire event
            tagStore[guid].wasUnserialized && tagStore[guid].wasUnserialized();
        }

        //linked now contains all JW base objects instanciated during reconstruction
        //__knitted flag added to track JW object linking, remove here as needed
        for (var guid in tagStore) {
            delete tagStore[guid].__knitted;
            //handy place to fire event
            tagStore[guid].graphUnserialized && tagStore[guid].graphUnserialized();
        }

        return root;
    } catch (e) {
        jabberwerx.util.debug.warn('Could not load ' + tag + " ( " + e + ")");
        throw (e);
    }
};

/**
 * Returns true if the storage engine reports that the passed tag has a value
 * stored in the namespace `_jw_store_`.
 *
 * @param {String} tag Tag name for the stored graph.
 * @returns {Boolean} <tt>true</tt> if the storage engine reports that the passed tag has a value
 * stored in the namespace `_jw_store_`, otherwise false.
 * @throws {jabberwerx.util.JWStorageRequiresjQueryjStoreError} if `_jw_store_` does not exist, or if it is not ready.
 */
jabberwerx.util.isGraphSaved = function(tag) {
    /*DEBUG-BEGIN*/
        jabberwerx.util.debug.log('checking for existence of store with tag ' + tag, 'persistence');
    /*DEBUG-END*/

    return __timestamp(tag) != null;
};

/**
 * Clears storage associated with the namespace `_jw_store_`.
 *
 * If no tag is passed, the entire namespace is cleared. Otherwise, only the store
 * marked by the passed tag is cleared.
 *
 * @param {String} [tag] Optionally specify a specific, tagged store to clear.
 */
jabberwerx.util.clearGraph = function(tag) {
    /*DEBUG-BEGIN*/
        jabberwerx.util.debug.log('clearing store: ' + tag, 'persistence');
    /*DEBUG-END*/
    __remove(tag);
};

/**
 * Return the date at which a graph was saved. A graph must have been loaded
 * via {@link jabberwerx.util.loadGraph}.
 *
 * @param {String} tag Tag name for the stored graph.
 * @returns {Date} Date at which a graph was saved. Returns null if no graph was found for passed in tag value.
 */
jabberwerx.util.getLoadedGraphTimestamp = function(tag) {
    //check timestamp for given graph, load only if within allowed age
    if (tag) {
        var ts = __timestamp(tag);
        if (ts) {
            var rd = new Date();
            rd.setTime(ts);
            return rd;
        }
    }
    return null;
};

/**
 * Return the delta in dates between when the graph was saved and now.
 *
 * @param {String} [tag] The tag of the saved graph (returns null if  null/undefined)
 * @returns {Date} The delta in dates between when the graph was saved and now. Returns null if tag is null/undefined, or if no store with stored tag could be found.
 */
jabberwerx.util.getLoadedGraphAge = function(tag) {
    var t = jabberwerx.util.getLoadedGraphTimestamp(tag);
    if (t) {
        return new Date(new Date().getTime() - t.getTime());
    }
    return null;
};

/**
 * Retrieve the maximum age a persisted graph can be before it is ignored and cleared on load
 *
 * @returns {Number} The maximum age
 */
 jabberwerx.util.getMaxGraphAge = function() {
    if (typeof(jabberwerx._config.persistDuration) != "number") {
        jabberwerx._config.persistDuration  = parseInt(jabberwerx._config.persistDuration);
    }
    return jabberwerx._config.persistDuration;
 }

/**
 * Set the maximum age a persisted graph can be before it is ignored and cleared on load
 *
 * @param {Number} [age] The maximum age in seconds, ignored if undefined or <= 0.
 * @returns {Number} The maximum age
 */
 jabberwerx.util.setMaxGraphAge = function(age) {
    if (age && typeof age == "number" && age > 0) {
        jabberwerx._config.persistDuration = age;
    }
    return jabberwerx.util.getMaxGraphAge();
 }

 /**
 * Thrown when persistence functions are invoked and Dojo storage is not loaded.
 * @class jabberwerx.util.JWStorageRequiresjQueryjStoreError
 */
jabberwerx.util.JWStorageRequiresjQueryjStoreError = jabberwerx.util.Error.extend('JW storage features require jQuery-jStore.');


/**
 * @private
 * @deprecated completely ignored after v 2010.10
 * _graphRegistry is an array of all jabberwerx.JWBase objects that have been serialized/rehydrated. Since 1.1 writes/reads object serializations
 * from the store (individually keyed). No need to write/read an entire graph at a time, making this data structure dubious at
 * best (JJF opinion).  Disable (default) by initializing to null, enable by initializing to an empty object {}
 *
 *@see  #_markGraph
*/
jabberwerx.util._graphRegistry = null;

})(); //scope function wrapper

jabberwerx.$(document).ready(function() {

    // Storage engine perference order, engine with lowest array index is the
    // most desirable engine.
    jabberwerx.$.jStore.EngineOrder = ['local', 'flash', 'html5', 'gears', 'ie'];

    var flashFilePath = "";
    try {
        // Generate file path using jabberwerx core library install path
        flashFilePath = jabberwerx._getInstallPath("jabberwerx");
    } catch(e) {
        // If jabberwerx core library is not loaded use jabberwerx ui
        // library to generate the file path
        flashFilePath = jabberwerx._getInstallPath("jabberwerx.ui");
    }

    jabberwerx.$.extend(jabberwerx.$.jStore.defaults,{
        flash: flashFilePath + "jStore.Flash.html"
    });

    //log jstore initialization progress
    jabberwerx.$.jStore.ready(function(engine) {
        jabberwerx.util.debug.log("jStore ready("+ engine.type+ ")", "persistence");
        engine.ready(function() {
            jabberwerx.util._handleStorageReady(engine);
            jabberwerx.util.debug.log("jStore engine ready", "persistence");
        });
    });

    if (!jabberwerx.$.jStore.isReady) {
        jabberwerx.$.jStore.load();
    }
    return true;
});

}
/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/jwapp/JWModel.js*/
/**
 * filename:        JWModel.js
 * created at:      2008/10/31T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx) {

    jabberwerx.JWModel = jabberwerx.JWBase.extend(/** @lends jabberwerx.JWModel.prototype */{
        /**
         * @class
         * <p>Base class for Model objects.</p>
         *
         * @description
         * Creates a new jabberwerx.JWModel object.
         * <p>A jabberwerx.JWModel object assumes it will be persisted in any saved object
         * graphs, and assumes it is a source of events.</p>
         *
         * @see jabberwerx.JWBase#shouldBeSavedWithGraph
         * @constructs jabberwerx.JWModel
         * @extends jabberwerx.JWBase
         * @minimal
         */
        init: function() {  },
        /**
         * Determines if this object should be persisted in object graphs.
         * This method always returns <tt>true</tt>.
         *
         * @return  {Boolean} Always <tt>true</tt>
         */
        shouldBeSavedWithGraph: function() { return true; }
    }, 'JWModel');
};

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Rendezvous.js*/
/**
 * filename:        Rendezvous.js
 * created at:      2011/04/04T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) Cisco Systems, Inc.  All Rights Reserved.
 */

(function() {
    if (jabberwerx) {
        /**
         * @class
         * <p>A mixin for participating in a {@link jabberwerx.Rendezvous}.</p>
         *
         * @see jabberwerx.JWBase.mixin
         */
        jabberwerx.Rendezvousable = {
            /**
             * <p>Starts this controller's rendezvous processing. This method
             * remembers the context Rendezvous object, then returns false</p>
             *
             * Mixins SHOULD override this method to perform the actual startup
             * logic, and MUST call "this._super(ctx)" or the behavior is
             * undefined.</p>
             *
             * @param {jabberwerx.Rendezvous} ctx The rendezvous context
             * @return {Boolean} <tt>true</tt> if this controller's rendezvous
             *                   work is in progress
             */
            startRendezvous: function(ctx) {
                this._rendezvousCtx = ctx;
                
                return false;
            },
            /**
             * <p>Ends this controller's rendezvous processing. This method
             * calls {@link jabberwerx.Rendezvous.finish} on the set context
             * (if any), then removes the context.</p>
             *
             * <p>Mixins MAY override this method to perform known completion
             * logic, but MUST call "this._super()" or the behavior is
             * undefined.</p>
             */
            finishRendezvous: function() {
                this._rendezvousCtx && this._rendezvousCtx.finish(this);
                delete this._rendezvousCtx;
            },
            
            /**
             * The current rendezvous context object.
             * @type jabberwerx.Rendezvous
             */
            rendezvousContext: null
        };
        
        jabberwerx.Rendezvous = jabberwerx.JWModel.extend(/** @lends jabberwerx.Rendezvous.prototype */{
            /**
             * @class
             * <p>Type for directing a Rendezvous pattern. The rendezvous
             * pattern allows for execution to continue once a number of
             * {@link jabberwerx.Rendezvousable} objects have finished.</p>
             *
             * <p>This is most notably used in {@link jabberwerx.Client} to
             * delay the "clientStatusChanged" event for connected until a
             * number of controllers have finished their startup logic.</p>
             *
             * @description
             *
             * <p>Creates a new rendezvous with the given finished
             * callback.</p>
             *
             * <p>The {cb} function is expected to implement the following
             * signature:</p>
             * <div><pre class='code'>
             *  cb = function(ctx) {
             *      ctx;        // This Rendezvous object
             *  }
             * </pre></div>
             *
             * @param cb {Function} The callback to execute when finished.
             * @throws TypeError If {cb} is not a Function
             * @constructs  jabberwerx.Rendezvous
             * @extends     jabberwerx.JWModel
             * @minimal
             */
            init: function(cb) {
                this._super();
                
                if (!(cb && jabberwerx.$.isFunction(cb))) {
                    throw new TypeError("cb must be a function");
                }
                
                this._callback = cb;
            },
            
            /**
             * <p>Starts the rendezvous for a specific rendezvousable. This method
             * calls {@link jabberwerx.Rendezvousable.startRendezvous} on
             * {rnz}, and adds it to the pending list it is starting (returns
             * <tt>true</tt>}.</p>
             *
             * <p><b>NOTE:</b> Mixins cannot be categorically verified as
             * instances (e.g. there is no "instanceof" check on an object for a
             * mixin).  Instead, this method checks that {rnz} implements
             * {@link jabberwerx.Rendezvousable.startRendezvous} and that the
             * method returns <tt>true</tt>.</p>
             *
             * @param rnz {jabberwerx.Rendezvousable} The rendezvousable to start
             * @returns {Boolean} <tt>true</tt> if {rnz} is started.
             */
            start: function(rnz) {
                this._ready = true;
                if (jabberwerx.$.inArray(rnz, this._rendezvousers) != -1) {
                    return true;
                }
                
                if (rnz.startRendezvous && rnz.startRendezvous(this)) {
                    this._rendezvousers.push(rnz);
                    return true;
                }
                
                return false;
            },
            /**
             * <p>Finishes the rendezvous for a specific rendezvousable. This
             * method removes calls
             * {@link jabberwerx.Rendezvousable.startRendezvous} on {rnz}, and
             * adds it to the pending list it is starting (returns
             * <tt>true</tt>}. If there are no pending compoents remaining, the
             * registered callback is executed.</p>
             *
             * @param rnz {jabberwerx.Rendezvousable} The rendezvousable to
             *        finish
             * @returns {Boolean} <tt>true</tt> if {rnz} is finished.
             */
            finish: function(rnz) {
                var pos = rnz ?
                          jabberwerx.$.inArray(rnz, this._rendezvousers) :
                          -1;
                if (pos != -1) {
                    this._rendezvousers.splice(pos, 1);
                }

                if (this._ready && !this._rendezvousers.length) {
                    this._callback(this);
                    this._ready = false;
                }
                
                return (pos != -1);
            },
            
            /**
             * Determines if this rendezvous has any pending rendezvousables.
             */
            isRunning: function() {
                return this._ready && (this._rendezvousers.length > 0);
            },
            
            /**
             * @private
             */
            _ready: false,
            /**
             * @private
             */
            _rendezvousers: []
        }, "jabberwerx.Rendezvous");
    }
})();

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/SASL.js*/
/**
 * filename:        SASL.js
 * created at:      2009/09/25T00:00:00-07:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx) {
    jabberwerx.SASLMechanism = jabberwerx.JWBase.extend(/** @lends jabberwerx.SASLMechanism.prototype */{
        /**
         * @class
         * <p>Base class for SASL support.</p>
         *
         * <p><b>NOTE:</b> When defining new SASL mechanisms, the call to
         * {@link #.extend} MUST include the mechanism name:</p>
         *
         * <pre class='code'>var namespace.SASLSomeClient = jabberwerx.SASLMechanism.extend(
         *      { ... },
         *      "namespace.SASLSomeClient",
         *      "SOME-MECH");
         * </pre>
         *
         * <p>The mechanism name then becomes a property of the class and its
         * instances.</p>
         *
         * @description
         * <p>Creates a new SASLMechanism with the given client. The name of
         * this SASLMechanism is established by its type definition via
         * {@link #.extend}.</p>
         *
         * <p>If {encoded} is <tt>true</tt>, then {@link #evaluateStart} and
         * {@link #evaluateChallenge} are expected to perform the base64
         * encoding and decoding; {@link #evaluate} will not automatically
         * perform this step.</p>
         *
         * @param       {jabberwerx.Client} client The client
         * @param       {Boolean} [encoded] <tt>true</tt> if the mechanism's
         *              {@link #evaluateStart} and {@link #evaluateChallenge}
         *              return data that is already base-64 encoded (default is
         *              <tt>false</tt>)
         * @throws      TypeError If {client} is not a jabberwerx.Client
         * @constructs  jabberwerx.SASLMechanism
         * @abstract
         * @extends     jabberwerx.JWBase
         * @minimal
         */
        init: function(client, encoded) {
            this._super();

            this.mechanismName = this.constructor.mechanismName;
            this._encoded = Boolean(encoded);

            if (!(client && client instanceof jabberwerx.Client)) {
                throw new TypeError("client must be a jabberwerx.Client");
            }

            this.client = client;
        },

        /**
         * <p>Evaluates a step in the SASL negotation. This method
         * processes the SASL "challenge", "failure" and "success" stanzas, and
         * returns "auth" and "response" stanzas.</p>
         *
         * <p>If called with no arguments, this method performs the initial
         * step:
         * <ol>
         * <li>{@link #evaluateStart} is called</li>
         * <li>The &lt;auth mechanism="{@link #mechanismName}"/&gt; is generated
         * and returned, including any initial data as base64-encoded text
         * content.</li>
         * </ol>
         * </p>
         *
         * <p>If called with a &lt;challenge/&gt; element, it performs the
         * subsequent steps:
         * <ol>
         * <li>The challenge data (if any) is decoded from base64</li>
         * <li>{@link #evaluateChallenge} is called, and the response
         * data noted</li>
         * <li>The &lt;response/&gt; stanza is generated and returned,
         * including any response data as base64-encoded text content</li>
         * </ol>
         * </p>
         *
         * <p>If called with a &lt;success/&gt; element, it performs the
         * finalization step:
         * <ol>
         * <li>The success data (if any) is decoded from base64</li>
         * <li>If there is success data, {@link #evaluateChallenge} is
         * called</li>
         * <li>{@link #complete} is checked to see that it is now equal
         * to <tt>true</tt></li>
         * </ol>
         * </p>
         *
         * <p>If called with a &lt;failure/&gt; element, it performs
         * error handling:
         * <ol>
         * <li>The condition from the failure is analyzed</li>
         * <li>A {@link jabberwrex.SASLMechanism.SASLAuthFailure} error is
         * thrown.</li>
         * </ol>
         * </p>
         *
         * @param   {Element} [input] The challenge to evaluate, or
         *          <tt>undefined</tt> for the initial step.
         * @returns {Element} The response, or <tt>null</tt> if no further
         *          responses are necessary.
         * @throws  {TypeError} If {input} is not an Element
         * @throws  {jabberwerx.SASLMechanism.SASLAuthFailure} If a problem
         *          is encountered
         */
        evaluate: function(input) {
            if (input && !jabberwerx.isElement(input)) {
                throw new TypeError("input must be undefined or an element");
            }

            var output = null;
            var failure = null;
            var data;
            if (!input) {
                if (this.started) {
                    jabberwerx.util.debug.log("SASL mechanism already started!");
                    throw this._handleFailure();
                }

                this.started = true;
                try {
                    data = this.evaluateStart();
                    data = this._encodeData(data);

                    output = new jabberwerx.NodeBuilder("{urn:ietf:params:xml:ns:xmpp-sasl}auth").
                            attribute("mechanism", this.mechanismName).
                            text(data).
                            data;
                } catch (ex) {
                    jabberwerx.util.debug.log("SASL failed to initialize: " + ex);
                    throw this._handleFailure(ex);
                }
            } else {
                if (!this.started) {
                    jabberwerx.util.debug.log("SASL mechanism not yet started!");
                    throw this._handleFailure();
                }

                switch (input.nodeName) {
                    case "success":
                        try {
                            if (!this.complete) {
                                data = jabberwerx.$(input).text();
                                data = this._decodeData(data);
                                data = this.evaluateChallenge(data);
                            }
                        } catch (ex) {
                            jabberwerx.util.debug.log("SASL failed to evaluate success data: " + ex);
                            throw this._handleFailure(ex);
                        }

                        if (data || !this.complete) {
                            jabberwerx.util.debug.log("SASL failed to complete upon <success/>");
                            throw this._handleFailure();
                        }

                        break;
                    case "failure":
                        // some specific problem
                        {
                            var failure = this._handleFailure(jabberwerx.$(input).children().get(0));
                            jabberwerx.util.debug.log("SASL failure from server: " + failure.message);
                            throw failure;
                        }
                        break;
                    case "challenge":
                        if (this.complete) {
                            jabberwerx.util.debug.log("SASL received challenge after completion!");
                            throw this._handleFailure();
                        }
                        try {
                            data = jabberwerx.$(input).text();
                            data = this._decodeData(data);
                            data = this.evaluateChallenge(data);
                            data = this._encodeData(data);

                            output = new jabberwerx.NodeBuilder(
                                            "{urn:ietf:params:xml:ns:xmpp-sasl}response").
                                    text(data).
                                    data;
                        } catch (ex) {
                            jabberwerx.util.debug.log("SASL failed to evaluate challenge data: " + ex);
                            throw this._handleFailure(ex);
                        }
                        break;
                    default:
                        // some random problem!
                        jabberwerx.util.debug.log("unexpected stanza received!");
                        throw this._handleFailure();
                        break;
                }
            }

            return output;
        },
        /**
         * @private
         */
        _decodeData: function(data) {
            if (!data) {
                return "";
            }
            if (!this._encoded) {
                return jabberwerx.util.crypto.utf8Decode(jabberwerx.util.crypto.b64Decode(data));
            }
            return data;
        },
        /**
         * @private
         */
        _encodeData: function(data) {
            if (!data) {
                return "";
            }
            if (!this._encoded) {
                return jabberwerx.util.crypto.b64Encode(jabberwerx.util.crypto.utf8Encode(data));
            }

            return data;
        },

        /**
         * <p>Called by {@link #evaluate} to start use of this SASLMechanism.
         * Subclasses MUST override this method to perform the initial
         * step.</p>
         *
         * <p>This implementation always throws an Error.</p>
         *
         * @returns The initial data to send, or <tt>null</tt> to send
         *          an empty &lt;auth/&gt;
         */
        evaluateStart: function() {
            throw new Error("not implemented!");
        },
        /**
         * <p>Called by {@link #evaluate} to process challenge data into a
         * response. Subclasses MUST override this method to perform
         * the steps of SASL negotation appropriate to the mechanism. If
         * this step completes the negotation (even if part of a
         * &lt;challenge/&gt; instead of a &lt;success/&gt;), this method MUST
         * set the {@link #complete} flag to <tt>true</tt>.</p>
         *
         * <p>The input is the text content of the &lt;challenge/&gt; or
         * &lt;success/&gt;, decoded from base64.</p>
         *
         * <p>This implementation always throws an Error.</p>
         *
         * @param   {String} inb The input data ("" if there is no challenge
         *          data)
         * @returns {String} The output data, or <tt>null</tt> if no response
         *          data is available
         * @throws  {jabberwerx.SASLMechanism.SASLAuthFailure} If there is a
         *          problem evaluating the challenge.
         */
        evaluateChallenge: function(inb) {
            throw new Error("not implemented!");
        },
        /**
         * @private
         */
        _handleFailure: function(cond) {
            this.complete = true;
            if (cond instanceof jabberwerx.SASLMechanism.SASLAuthFailure) {
                return cond;
            } else if (jabberwerx.isElement(cond)) {
                var msg = "{urn:ietf:params:xml:ns:xmpp-sasl}" + cond.nodeName;

                return new jabberwerx.SASLMechanism.SASLAuthFailure(msg);
            } else {
                return new jabberwerx.SASLMechanism.SASLAuthFailure();
            }
        },

        /**
         * <p>Retrieves the connection/authentication properties from the
         * client.</p>
         *
         * @returns  {Object} The properties object from {@link #client}
         */
        getProperties: function() {
            return (this.client && this.client._connectParams) || {};
        },

        /**
         * The client to operate against
         * @type    jabberwerx.Client
         */
        client: null,
        /**
         * The mechanism name. This is automatically set by the init method
         * for jabberwerx.SASLMechanism, based on the mechanism name given when
         * the type is defined.
         * @type    String
         */
        mechanismName: "",
        /**
         * Flag to check to check if this SASLMechanism has completed the
         * authentication negotation (successful or not).
         * @type    Boolean
         */
        complete: false,
        /**
         * Flag to indicate the mechanism has been started.
         * @type    Boolean
         */
        started: false
    }, "jabberwerx.SASLMechanism");
    jabberwerx.SASLMechanism.SASLAuthFailure = jabberwerx.util.Error.extend("{urn:ietf:params:xml:ns:xmpp-sasl}temporary-auth-failure");

    /**
     * @private
     */
    jabberwerx.SASLMechanism._baseExtend = jabberwerx.SASLMechanism.extend;
    /**
     * <p>Defines a new subclass of jabberwerx.SASLMechanism. This method
     * overrides {@link JWBase.extend} to also include the name of the
     * SASL mechanism. This method will also register the new mechanism
     * with the global SASLMechanismFactory {@link jabberwerx.sasl}.</p>
     *
     * @param   {Object} props The properties and methods for the subclass
     * @param   {String} type The fully-qualified name of the subclass
     * @param   {String} mechname The SASL mechanism name this subclass
     *          supports
     * @returns {Class} The subclass of jabberwerx.SASLMechanism
     * @throws  {TypeError} If {mechname} is not a non-empty string
     */
    jabberwerx.SASLMechanism.extend = function(props, type, mechname) {
        if (!(mechname && typeof(mechname) == "string")) {
            throw new TypeError("name must be a non-empty string");
        }

        var subtype = jabberwerx.SASLMechanism._baseExtend(props, type);
        subtype.mechanismName = mechname.toUpperCase();
        if (    jabberwerx.sasl &&
                jabberwerx.sasl instanceof jabberwerx.SASLMechanismFactory) {
            jabberwerx.sasl.addMechanism(subtype);
        }

        return subtype;
    };

    jabberwerx.SASLMechanismFactory = jabberwerx.JWBase.extend(/** @lends jabberwerx.SASLMechanismFactory.prototype */{
        /**
         * @class
         * <p>Factory class for managing and creating SASLMechanisms.</p>
         *
         * @description
         * <p>Creates a new SASLMechanismFactory.</p>
         *
         * @param       {String[]} [mechs] The list of enabled mechanisms
         * @constructs  jabberwerx.SASLMechanismFactory
         * @extends     jabberwerx.JWBase
         * @minimal
         */
        init: function(mechs) {
            this._super();

            if   (!mechs) {
                if (jabberwerx._config.enabledMechanisms) {
                    mechs = jabberwerx._config.enabledMechanisms;
                } else {
                    mechs = [];
                }
            }

            this.mechanisms = mechs.concat();
        },

        /**
         * <p>Creates a SASLMechanism appropriate for the given list of
         * possible mechanisms.</p>
         *
         * @param   {jabberwerx.Client} client The client to work against
         * @param   {String[]} mechs The list of possible mechanisms to use
         * @returns {jabberwerx.SASLMechanism} The SASLMechanism object to use, or
         *          <tt>null</tt> if an appropriate mechanism could not be
         *          found
         * @throws  {TypeError} If {client} is not valid; or if {mechs} is not
         *          an array
         */
        createMechanismFor: function(client, mechs) {
            if (!jabberwerx.$.isArray(mechs)) {
                throw new TypeError("mechs must be an array of mechanism names");
            }
            if (!(client && client instanceof jabberwerx.Client)) {
                throw new TypeError("client must be an isntance of jabberwerx.Client");
            }

            // normalize mechanism names (all upper case)
            mechs = mechs.concat();
            for (var idx = 0; idx < mechs.length; idx++) {
                mechs[idx] = String(mechs[idx]).toUpperCase();
            }

            // find the mech!
            var selected = null;
            for (var idx = 0; !selected && idx < this.mechanisms.length; idx++) {
                var candidate = this._mechsAvail[this.mechanisms[idx]];
                if (!candidate) {
                    // enabled mech doesn't have an available mech
                    continue;
                }

                for (var jdx = 0; !selected && jdx < mechs.length; jdx++) {
                    if (mechs[jdx] != candidate.mechanismName) {
                        continue;
                    }

                    // we have an available, enabled, AND supported mechanism!
                    try {
                        selected = new candidate(client);
                    } catch (ex) {
                        jabberwerx.util.debug.log("could not create SASLMechanism for " +
                                candidate.mechanismName + ": "+ ex);
                        // make sure we don't have a SASLMechanism
                        selected = null;
                    }
                }
            }
            return selected;
        },

        /**
         * <p>Adds the given mechanism to the map of available mechanisms.</p>
         *
         * @param   {Class} type The SASLMechanism to add
         * @throws  {TypeError} if {type} is not the class for a SASLMechanism
         */
        addMechanism: function(type) {
            if (!(jabberwerx.$.isFunction(type) && type.mechanismName)) {
                throw new TypeError("type must be the constructor for a SASLMechanism type");
            }

            this._mechsAvail[type.mechanismName] = type;
        },
        /**
         * <p>Removes the given mechanism from the map of available
         * mechanisms.</p>
         *
         * @param   {Class} type The SASLMechanism to remove
         * @throws  {TypeError} if {type} is not the class for a SASLMechanism
         */
        removeMechanism: function(type) {
            if (!(jabberwerx.$.isFunction(type) && type.mechanismName)) {
                throw new TypeError("type must be the constructor for a SASLMechanism type");
            }

            this._mechsAvail[type.mechanismName] = undefined;
            delete this._mechsAvail[type.mechanismName];
        },

        /**
         * @private
         * The map of mechanism to SASLMechanism types.
         */
        _mechsAvail: {},
        /**
         * <p>The list of SASL client mechanisms supported. Each element in
         * the array is expected to be the string name of the mechanism.</p>
         *
         * <p>The order of mechanisms in this array is significant. This factory
         * will create an instance of first SASLMechanism that matches, based on the
         * intersection of server-supplied and client-enabled mechanisms.</p>
         *
         * @type    String[]
         */
        mechanisms: []
    }, "jabberwerx.SASLMechanismFactory");

    if (!(jabberwerx.sasl && jabberwerx.sasl instanceof jabberwerx.SASLMechanismFactory)) {
        /**
         * The global SASL factory.
         *
         * @memberOf    jabberwerx
         * @see         jabberwerx.SASLMechanismFactory#mechanisms
         * @see         jabberwerx.SASLMechanismFactory#createMechanismFor
         * @see         jabberwerx.SASLMechanismFactory#addMechanism
         * @see         jabberwerx.SASLMechanismFactory#removeMechanism
         * @type        jabberwerx.SASLMechanismFactory
         */
        jabberwerx.sasl = new jabberwerx.SASLMechanismFactory(jabberwerx._config.enabledMechanisms);
    }
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/SASLMechs.js*/
/**
 * filename:        SASLMechs.js
 * created at:      2009/09/29T00:00:00-07:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx && jabberwerx.SASLMechanism) {
    jabberwerx.SASLPlainMechanism = jabberwerx.SASLMechanism.extend(
    /** @lends jabberwerx.SASLPlainMechanism.prototype */ {
        /**
         * @class
         * <p>Implements the PLAIN SASL mechanism.</p>
         *
         * @description
         * Creates a new SASLPlainMechanism with the given client.
         *
         * @param   {jabberwerx.Client} client The client
         * @throws  {TypeError} If {client} is not valid
         * @constructs  jabberwerx.SASLPlainMechanism
         * @extends     jabberwerx.SASLMechanism
         * @minimal
         */
        init: function(client) {
            this._super(client);
        },
        
        /**
         * Called by {@link jabberwerx.SASLMechanism#evaluate} to generate initial data. This method
         * creates the string "\\u0000username\\u0000password", using
         * the connection parameters specified in {@link jabberwerx.SASLMechanism#client}.</p>
         *
         * <p><b>NOTE:</b> If the BOSH connection is not made over a
         * secure connection, or if the jabberwerx_config.unsecureAllowed
         * flag is <tt>false</tt>, this method throws a SASLAuthFailure
         * ("{urn:ietf:params:xml:ns:xmpp-sasl}mechanism-too-weak").</p>
         *
         * @returns {String} The credential data
         * @throws  {jabberwerx.SASLMechanism.SASLAuthFailure} If PLAIN is not
         *          supported by current configuration
         */
        evaluateStart: function() {
            // TODO: Look for something better!
            var params = this.getProperties();
            if (!this.client.isSecure()) {
                throw new jabberwerx.SASLMechanism.SASLAuthFailure("{urn:ietf:params:xml:ns:xmpp-sasl}mechanism-too-weak");
            }
            var nilChar = String.fromCharCode(0);
            var usr = (params && params.jid && params.jid.getNode()) || "";
            var pwd = (params && params.password) || "";
            return nilChar + usr + nilChar + pwd;
        },
        /**
         * <p>Called by {@link jabberwerx.SASLMechanism#evaluate} to process a challenge. This
         * implementation throws a SASLAuthFailure if {inb} is a non-empty
         * string, or if this mechanism is already complete.
         *
         * @throws  {jabberwerx.SASLMechanism.SASLAuthFailure} If the
         *          challenge is invalid (non-empty)
         */
        evaluateChallenge: function(inb) {
            if (inb || this.complete) {
                throw new jabberwerx.SASLMechanism.SASLAuthFailure();
            }
            this.complete = true;
        }
    }, "jabberwerx.SASLPlainMechanism", "PLAIN");
    
    jabberwerx.SASLDigestMd5Mechanism = jabberwerx.SASLMechanism.extend(
    /** @lends jabberwerx.SASLDigestMd5Mechanism.prototype */ {
        /**
         * @class
         * <p>Implements the DIGEST-MD5 SASL mechanism.</p>
         *
         * @description
         * Creates a new SASLDigestMd5Mechanism with the given client.
         *
         * @param   {jabberwerx.Client} client The client
         * @throws  {TypeError} If {client} is not valid
         * @constructs  jabberwerx.SASLDigestMd5Mechanism
         * @extends     jabberwerx.SASLMechanism
         * @minimal
         */
        init: function(client) {
            this._super(client);
        },
        
        /**
         * Called by {@link jabberwerx.SASLMechanism#evaluate} to generate initial data. This method
         * sets up the staging methods for subsequenct steps.</p>
         *
         * @returns {String} <tt>null</tt>
         */
        evaluateStart: function() {
            this._stage = this._generateResponse;
            
            return null;
        },
        /**
         * <p>Called by {@link jabberwerx.SASLMechanism#evaluate} to process a challenge. This
         * implementation follows RFC 2831's flow, which is two steps:</p>
         *
         * <ol>
         *  <li>DIGEST: Performs the actual digest calculations</li>
         *  <li>VERIFY: Verifies the auth response from the server</li>
         * </ol>
         *
         * @param   {String} inb The challenge data, decoded from Base64
         * @returns {String} The response data
         */
        evaluateChallenge: function(inb) {
            var inprops, outprops;
            
            if (this.complete && !this._stage) {
                return;
            }
            
            if (!this._stage) {
                jabberwerx.util.debug.log("DIGEST-MD5 in bad stage");
                throw new jabberwerx.SASLMechanism.SASLAuthFailure();
            }
            inprops = this._decodeProperties(inb);
            outprops = this._stage(inprops);
            
            return this._encodeProperties(outprops);
        },
        /**
         * @private
         */
        _generateResponse: function(inprops) {
            var params = this.getProperties();
            var user, pass, domain;
            user = (params.jid && params.jid.getNode()) || "";
            domain = (params.jid && params.jid.getDomain()) || "";
            pass = params.password || "";
            
            var realm = inprops.realm || domain;
            var nonce = inprops.nonce;
            var nc = inprops.nc || "00000001";
            var cnonce = this._cnonce((user + "@" + realm).length);
            var uri = "xmpp/" + domain;
            var qop = "auth";   //no integrity or confidentiality
            
            // calculate A1
            var A1;
            A1 = jabberwerx.util.crypto.rstr_md5(jabberwerx.util.crypto.utf8Encode(user + ":" + realm + ":" + pass));
            A1 = A1 + jabberwerx.util.crypto.utf8Encode(":" + nonce + ":" + cnonce);
            
            // calcuate A2
            var A2;
            A2 = jabberwerx.util.crypto.utf8Encode("AUTHENTICATE:" + uri);
            
            // calculate response
            var rsp = [ jabberwerx.util.crypto.str2hex(jabberwerx.util.crypto.rstr_md5(A1)),
                        nonce,
                        nc,
                        cnonce,
                        qop,
                        jabberwerx.util.crypto.str2hex(jabberwerx.util.crypto.rstr_md5(A2))
                ].join(":");
            rsp = jabberwerx.util.crypto.hex_md5(jabberwerx.util.crypto.utf8Encode(rsp));
            
            var outprops = {
                "charset" : "utf-8",
                "digest-uri" : uri,
                "cnonce": cnonce,
                "nonce": nonce,
                "nc" : nc,
                "qop" : qop,
                "username": user,
                "realm": realm,
                "response": rsp
            };
            
            this._authProps = outprops;
            this._stage = this._verifyRspAuth;
            
            return outprops;
        },
        /**
         * @private
         */
        _verifyRspAuth: function(inprops) {
            if (inprops) {
                inprops = jabberwerx.$.extend({}, inprops, this._authProps || {});
                var params = this.getProperties();
                var user, pass, domain;
                user = (params.jid && params.jid.getNode()) || "";
                domain = (params.jid && params.jid.getDomain()) || "";
                pass = params.password || "";
                
                var realm = inprops.realm || domain;
                var nonce = inprops.nonce;
                var nc = inprops.nc || "00000001";
                var cnonce = inprops.cnonce;
                var uri = "xmpp/" + domain;
                var qop = "auth";   //no integrity or confidentiality
                
                // calculate A1
                var A1;
                A1 = jabberwerx.util.crypto.rstr_md5(jabberwerx.util.crypto.utf8Encode(user + ":" + realm + ":" + pass));
                A1 = A1 + jabberwerx.util.crypto.utf8Encode(":" + nonce + ":" + cnonce);
                
                // calcuate A2
                var A2;
                A2 = jabberwerx.util.crypto.utf8Encode(":" + uri);
                
                // calculate response
                var rsp = [ jabberwerx.util.crypto.str2hex(jabberwerx.util.crypto.rstr_md5(A1)),
                            nonce,
                            nc,
                            cnonce,
                            qop,
                            jabberwerx.util.crypto.str2hex(jabberwerx.util.crypto.rstr_md5(A2))
                    ].join(":");
                rsp = jabberwerx.util.crypto.hex_md5(jabberwerx.util.crypto.utf8Encode(rsp));
                
                if (rsp != inprops.rspauth) {
                    jabberwerx.util.debug.log("response auth values do not match");
                    throw new jabberwerx.SASLMechanism.SASLAuthFailure();
                }
            }
            
            this.complete = true;
            this._stage = null;
        },
        
        /**
         * @private
         */
        _decodeProperties: function(str) {
            var ptn = /([^"()<>\{\}\[\]@,;:\\\/?= \t]+)=(?:([^"()<>\{\}\[\]@,;:\\\/?= \t]+)|(?:"([^"]+)"))/g;
            var props = {};
            var field;
            
            if (!str) {
                str = "";
            }
            while (field = ptn.exec(str)) {
                props[field[1]] = field[2] || field[3] || "";
            }
            
            return props;
        },
        /**
         * @private
         */
        _encodeProperties: function(props) {
            var quoted = {
                "username": true,
                "realm": true,
                "nonce": true,
                "cnonce": true,
                "digest-uri": true,
                "response": true
            };
            var tmp = [];
            
            for (var name in props) {
                var val = quoted[name] ?
                        '"' + props[name] + '"' :
                        props[name];
                tmp.push(name + "=" + val);
            }
            
            return tmp.join(",");
        },
        
        /**
         * @private
         */
        _stage: null,
        /**
         * @private
         */
        _cnonce: function(size) {
            var data = "";
            for (var idx = 0; idx < size; idx++) {
                data += String.fromCharCode(Math.random() * 256);
            }
            
            return jabberwerx.util.crypto.b64Encode(data);
        }
    }, "jabberwerx.SASLDigestMd5Mechanism", "DIGEST-MD5");    
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Translator.js*/
/**
 * filename:        Translator.js
 * created at:      2010/04/28T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.Translator = jabberwerx.JWBase.extend( /** @lends jabberwerx.Translator.prototype */{
        /**
         * @class
         * <p>Performs localization of strings.</p>
         *
         * @description
         * <p>Creates a new Translator.</p>
         *
         * <p><b>NOTE:</b> This class should not be created directly. Instead,
         * use the global localizing method @{link jabberwerx._}.</p>
         *
         * @constructs jabberwerx.Translator
         * @extends jabberwerx.JWBase
         * @minimal
         */
        init: function() {
            this._super();
        },

        /**
         * <p>Localizes and formats the given input string.</p>
         *
         * <p>This method attempts to find a localized version of {istr} in
         * a table. If one is found, that localized form is used for the rest
         * of this; otherwise {istr} is used as-is. Then the string is searched
         * for substitutions, and the results are returned.</p>
         *
         * <p>Substitutions take the form "{&lt;number&gt;}", where &lt;number&gt;
         * is the index of the arugment passed into this method. For example:</p>
         *
         * <pre class='code'>
         *  var l10n = new jabberwerx.Translator()'
         *  var result = l10n.format("Connected to {0} as {1}",
         *                           client.connectedServer.jid,
         *                           client.connectedUser.jid);
         * </pre>
         *
         * <p>Returns a string where "{0}" is replaced with the string value of
         * "client.connectedServer.jid" and "{1}" is replaced with the string
         * of "client.connectedUser.jid". If a matching argument is not found,
         * the original pattern is returned (e.g. "{0}").</p>
         *
         * @param   {String} istr The input string
         * @returns {String} The formatted/localized string
         */
        format: function(istr /** params **/) {
            var ostr = this._updates[istr] || this._mappings[istr];
            if (!ostr) {
                ostr = istr;
            }

            var ptn = /\{([0-9]+)\}/g;
            var args = jabberwerx.$.makeArray(arguments).slice(1);
            var substFn = function(match, idx) {
                idx = parseInt(idx);
                if (isNaN(idx)) {
                    return match;
                }

                var found = args[idx];
                if (found === null || found === undefined) {
                    return match;
                }

                return found;
            };
            var ostr = ostr.replace(ptn, substFn);

            return ostr;
        },
        /**
         * <p>Loads a translation table for the given locale.</p>
         *
         * <p>The translation table is expected to be a JSON-formatted
         * map of keys to values</p>:
         *
         * <pre class='code'>
         *  {
         *      "first key" : "The First Key",
         *      "service {0} unavailable" : "The service {0} is not available at this time.  Please try again later"
         *  }
         * </pre>
         *
         * <p>Translation are declared via &lt;link/&gt; elements within the
         * HTML page, with the type 'text/javascript' and the rel 'translation',
         * and optionally an xml:lang to declare the locale it represents. For
         * example, a tranlsation table for American English (en-US) would be
         * declared in the HTML as follows:</p>
         *
         * <pre class='code'>
         *  &lt; link rel='translation' type='text/javascript' xml:lang='en-US' href='path/to/tranlsation.js'/&gt;
         * </pre>
         *
         * <p>The lookup attempts to find the best match for {locale} using
         * the following algorithm:</p>
         *
         * <ol>
         * <li>The specific value for {locale}, if specified (e.g. en-US)</li>
         * <li>The language-only value for {locale}, if specified (e.g. en)</li>
         * <li>A default (no xml:lang declared on &lt;link/&gt;)</li>
         * </ol>
         *
         * @param   {String} [locale] The locale to load, or "" to
         *          use the platform default.
         * @throws  {Error} If a translation table for {locale}
         *          cannot be found or loaded
         */
        load: function(locale) {
            if (!locale) {
                // make best attempt at determining the user's locale
                locale = (jabberwerx.$.browser.msie) ?
                         navigator.userLanguage :
                         navigator.language;
            }
            if (this.locale == locale) {
                // already loaded this translation, return
                return;
            }

            // Function to create a function that filters
            var filterFN = function(l) {
                return function() {
                    var lang = (jabberwerx.$(this).attr("xml:lang") || "").toLowerCase();
                    return (lang == l) ? this : null;
                };
            };

            // Find matches, grouped by specificity
            var localeFull = locale.toLowerCase();
            var localePart = locale.split("-")[0].toLowerCase();
            var tmpLinks = jabberwerx.$("link[rel='translation'][type='text/javascript']");
            var links = jabberwerx.$();
            links = jabberwerx.$.merge(links, tmpLinks.map(filterFN("")));
            links = jabberwerx.$.merge(links, tmpLinks.map(filterFN(localePart)));
            links = jabberwerx.$.merge(links, tmpLinks.map(filterFN(localeFull)));

            if (!links.length) {
                throw new TypeError("no translation links found");
            }

            var mappings = {};
            var processed = 0;
            links.each(function() {
                var url = jabberwerx.$(this).attr("href");
                if (!url) {
                    // TODO: loggit
                    return true;
                }
                var data = null;
                var completeFn = function(xhr, status) {
                    if (status != "success") { return; }
                    data = xhr.responseText;
                };
                var setup = {
                    async: false,
                    cache: true,
                    complete: completeFn,
                    dataType: "text",
                    processData: false,
                    timeout: 1000,
                    url: url
                };
                jabberwerx.$.ajax(setup);
                if (!data) {
                    jabberwerx.util.debug.log("no translation data returned from " + url);
                }
                try {
                    data = eval("(" + data + ")");
                } catch (ex) {
                    jabberwerx.util.debug.log("could not parse translation data from " + url);
                }
                mappings = jabberwerx.$.extend(mappings, data);
                processed++;
            });

            if (!processed) {
                throw new TypeError("no valid translations found");
            }
            this._mappings = mappings;
            this.locale = locale;
        },

        /**
         * <p>Adds or updates the translation for the given key.</p>
         *
         * @param   {String} key The key to translate on
         * @param   {String} value The new replacement translation
         * @throws  {TypeError} If {key} or {value} are not valid Strings
         */
        addTranslation: function(key, value) {
            if (!(key && typeof(key) == "string")) {
                throw new TypeError();
            }
            if (!(value && typeof(value) == "string")) {
                throw new TypeError();
            }
            this._updates[key] = value;
        },
        /**
         * <p>Removes the translation for the given key.</p>
         *
         * @param   {String} key The key to translate on
         * @throws  {TypeError} If {key} or is not a valid String
         */
        removeTranslation: function(key) {
            if (!(key && typeof(key) == "string")) {
                throw new TypeError();
            }
            delete this._updates[key];
        },

        /**
         * The current locale for this jabberwerx.Translator
         *
         * @type String
         * @see jabberwerx.Translator#format
         */
        locale: undefined,

        /**
         * @private
         */
        _mappings: {},
        /**
         * @private
         */
        _updates: {}
    }, "jabberwerx.Translator");

    /**
     * <p>The global translator instance. Use this instead of
     * creating new instances of Translator.</p>
     *
     * @type jabberwerx.Translator
     */
    jabberwerx.l10n = new jabberwerx.Translator();

    /**
     * @function
     * @description
     * <p>Localizes and formats the given input string. This method performs
     * the same operations as {@link jabberwerx.Translator#format}, but as a
     * singleton method.</p>
     *
     * @param   {String} istr The input string
     * @returns {String} The formatted/localized string
     */
    jabberwerx._ = (function(l10n) {
        var fn;
        fn = function() {
            return l10n.format.apply(l10n, arguments);
        };
        fn.instance = l10n;

        return fn;
    })(jabberwerx.l10n);

    try {
        jabberwerx.l10n.load(navigator.language);
        // DEBUG-BEGIN
        jabberwerx.util.debug.log("Loaded translation for " + navigator.language);
        // DEBUG-END
    } catch (e) {
        // log the failure to load a default
        jabberwerx.util.debug.log("Could not find a translation for " + navigator.language);
    }
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/JID.js*/
/**
 * filename:        JID.js
 * created at:      2008/10/31T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

(function(){
if (jabberwerx) {
    var _jidCache = {};
    var _lookupCache = function(val) {
        if (!val) {
            throw new jabberwerx.JID.InvalidJIDError();
        }
        
        val = val.toString();
        
        var jid = _jidCache[val];
        if (jid) {
            return jid;
        }
        
        // quick separation
        var resSep = val.lastIndexOf('/');
        val = (resSep != -1) ?
              val.substring(0, resSep).toLowerCase()
                    + "/" + val.substring(resSep + 1) :
              val.toLowerCase();
        jid = _jidCache[val];
        if (jid) {
            return jid;
        }
        
        return null;
    };
    
    jabberwerx.JID = jabberwerx.JWModel.extend(/** @lends jabberwerx.JID.prototype */{
        /**
         * @class
         * <p>Represents a JID identifier. A JID has the general string
         * form:</p>
         *
         * <pre class="code">node@domain/resource</pre>
         *
         * <p>Where {node} (and its trailing '@') and {resource} (and its
         * leading '/') are optional.</p>
         *
         * @description
         * <p>Creates a new JID.</p>
         *
         * <p>The value of {arg} must be one of the following:</p>
         * <ul>
         * <li>a string representation of a JID (e.g.
         * "username@hostname/resource")</li>
         * <li>An object with the following properties:
         * <pre class='code'>{
            // REQUIRED: domain portion of JID
            domain: "hostname",
            // OPTIONAL: node portion of JID
            node: "username",
            // OPTIONAL: resource portion of JID
            resource: "resource",
            // OPTIONAL: "true" if the node is unescaped, and should
            // be translated via {@link #.escapeNode}
            unescaped: true|false
         * }</pre></li>
         * </ul>
         *
         * <p><b>NOTE:</b> The preferred method of obtaining a JID is to use
         * {@link jabberwerx.JID.asJID}; it returns cached instances, which
         * can save considerable time.</p>
         *
         * @param   {String|Object} arg The string or parts for a JID
         * @throws  {jabberwerx.JID.InvalidJIDError} If a JID cannot be created from
         *          {arg}.
         * @constructs jabberwerx.JID
         * @extends jabberwerx.JWModel
         * @minimal
         */
        init: function(arg) {
            if (arg instanceof jabberwerx.JID) {
                arg = {
                    "node": arg.getNode() || null,
                    "domain": arg.getDomain() || null,
                    "resource": arg.getResource() || null
                };
            } else if (typeof(arg) == "string") {
                //We'll parse this ourselves...
                var result = /^(?:([^\/]+)@)?([^@\/]+)(?:\/(.+))?$/.exec(arg);
                if (!result) {
                    throw new jabberwerx.JID.InvalidJIDError("JID did not match the form 'node@domain/resource'");
                }
                full = arg.toString();
                arg = {
                    "node": (result[1] || undefined),
                    "domain": result[2],
                    "resource": (result[3] || undefined)
                };
            } else if (!arg) {
                throw new jabberwerx.JID.InvalidJIDError("argument must be defined and not null");
            } else {
                // Clone argument
                arg = jabberwerx.$.extend({}, arg);
            }

            var prepFN = function(test) {
                if (/[ \t\n\r@\:\<\>\&'"\/]/.test(test)) {
                    throw new jabberwerx.JID.InvalidJIDError("invalid characters found");
                }

                return test.toLowerCase();
            };

            // prep domain
            if (!arg.domain) {
                throw new jabberwerx.JID.InvalidJIDError("'' or null or undefined domain not allowed");
            } else {
                arg.domain = prepFN(arg.domain, true);
            }

            // prep node
            if (arg.node == "") {
                throw new jabberwerx.JID.InvalidJIDError("'' node with @ not allowed");
            } else if (arg.node) {
                if (arg.unescaped) {
                    arg.node = jabberwerx.JID.escapeNode(arg.node);
                }
                arg.node = prepFN(arg.node, true);
            }

            // prep resource
            if (arg.resouce == "") {
                throw new jabberwerx.JID.InvalidJIDError("'' resource with / not allowed");
            }

            this._domain = arg.domain;
            this._node = arg.node || "";
            this._resource = arg.resource || "";
            this._full = "" +
                    (arg.node ? arg.node + "@" : "") +
                    arg.domain +
                    (arg.resource ? "/" + arg.resource : "");
            
            // IE6 doesn't like how we override toString.
            if (jabberwerx.$.browser.msie) {
                this.toString = function () {
                    return this._full;
                }
            }

            // cache it!
            if (!_jidCache[this.toString()]) {
                _jidCache[this.toString()] = this;
            }
        },

        /**
         * <p>Returns the bare JID form of this JID. A bare JID consists of
         * the node and domain, but not the resource. If this JID is already
         * a bare JID, this method returns the current JID. Otherwise, a new
         * JID object is created that contains only the node and domains.</p>
         *
         * @returns {jabberwerx.JID} The "bare" JID from this JID
         */
        getBareJID: function() {
            if (!this.getResource()) {
                return this;
            } else {
                return new jabberwerx.JID({
                    "node": this.getNode(),
                    "domain": this.getDomain()
                });
            }
        },
        /**
         * <p>Returns the bare JID form of this JID as a string. This method
         * is a convenience over calling getBareJID().toString().</p>
         *
         * @returns {String} The "bare" JID, as a string
         * @see #getBareJID
         * @see #toString
         */
        getBareJIDString: function() {
            return this.getBareJID().toString();
        },

        /**
         * <p>Retrieves the domain value for this JID.</p>
         *
         * @returns  {String} The JID's domain
         */
        getDomain: function() {
            return this._domain;
        },
        /**
         * <p>Retrieves the node value for this JID. If this
         * JID does not have a node, this method returns "".</p>
         *
         * @returns  {String} The JID's node
         */
        getNode: function() {
            return this._node;
        },
        /**
         * <p>Retrieves the resource value for this JID. If this
         * JID does not have a resource, this method returns "".</p>
         *
         * @returns  {String} The JID's resource
         */
        getResource: function() {
            return this._resource;
        },

        /**
         * <p>Retrieves the string respesenting this JID.</p>
         *
         * @returns  {String} The string representation
         */
        toString: function() {
            return this._full;
        },
        /**
         * <p>Retrieves the display string representing this JID.
         * This method returns a JID with the node portion unescaped
         * via {@link jabberwerx.JID#.unescapeNode}. As such, the returned string may
         * not be a valid JID.</p>
         *
         * @returns  {String} The display string representation
         */
        toDisplayString: function() {
            var result = this.getDomain();
            var part;

            part = this.getNode();
            if (part) {
                result = jabberwerx.JID.unescapeNode(part) + "@" + result;
            }

            part = this.getResource();
            if (part) {
                result = result + "/" + part;
            }

            return result;
        },

        /**
         * <p>Determines if this JID is equal to the given JID.</p>
         *
         * @param   {String|jabberwerx.JID} jid The JID (or string representing
         *          a JID) to compare to
         * @returns {Boolean} <tt>true</tt> if this JID and {jid} represent
         *          the same JID value
         */
        equals: function(jid) {
            try {
                jid = jabberwerx.JID.asJID(jid);
                return this.toString() == jid.toString();
            } catch (ex) {
                return false;
            }
        },
        /**
         * <p>Compares this JID to the given JID for ordering. The order of
         * two JIDs is determined by their parts as follows:</p>
         *
         * <ol>
         *  <li>domain (returns -1 or 1 if not equal)</li>
         *  <li>node (returns -1 or 1 if not equal)</li>
         *  <li>resource (returns -1 or 1 if not equal)</li>
         * </ol>
         *
         * @param   {String|jabberwerx.JID} jid The JID (or string represting
         *          a JID) to compare to
         * @returns {Number} -1, 0, or 1 if this JID is before, equal to, or
         *          after {jid}
         * @throws  {jabberwerx.JID.InvalidJIDError} If {jid} is not a valid JID
         */
        compareTo: function(jid) {
            jid = jabberwerx.JID.asJID(jid);
            var cmp = function(v1, v2) {
                if          (v1 < v2) {
                    return -1;
                } else if   (v1 > v2) {
                    return 1;
                }

                return 0;
            };
            //var     val1 = this.toString(), val2 = test.toString();
            var result;
            if ((result = cmp(this.getDomain(), jid.getDomain())) != 0) {
                return result;
            }
            if ((result = cmp(this.getNode(), jid.getNode())) != 0) {
                return result;
            }
            if ((result = cmp(this.getResource(), jid.getResource())) != 0) {
                return result;
            }

            return 0;
        },

        /**
         * <p>Determines if this type should be serialized inline with other
         * primitive (boolean, number, string) or inlinable types.</p>
         *
         * @returns  {Boolean}   Always <tt>true</tt>
         */
        shouldBeSerializedInline: function() {
            return false;
        },
        /**
         * <p>Called just after this JID is unserialized. This method recreates
         * the internal structures from the string representation.</p>
         */
        wasUnserialized: function() {
            // IE6 doesn't like how we override toString.
            if (jabberwerx.$.browser.msie) {
                this.toString = function () {
                    return this._full;
                }
            }
            
            // put it back in the cache
            _jidCache[this.toString()] = this;
        },

        /**
         * @private
         */
        _node: "",
        /**
         * @private
         */
        _domain: "",
        /**
         * @private
         */
        _resource: "",
        /**
         * @private
         */
        _full: ""
    }, 'jabberwerx.JID');

    /**
     * @class jabberwerx.JID.InvalidJIDError
     * <p>Error thrown when invalid JID strings are encountered.</p>
     *
     * @extends jabberwerx.util.Error
     * @minimal
     */
    jabberwerx.JID.InvalidJIDError = jabberwerx.util.Error.extend.call(
            TypeError,
            "The JID is invalid");

    /**
     * <p>Converts an object into a jabberwerx.JID. This method
     * uses the following algorithm:</p>
     *
     * <ol>
     * <li>If {val} is an instance of jabberwerx.JID, return it</li>
     * <li>If a JID exists in the internal cache that matches the string value
     * of {val}, return it.</li>
     * <li>Create a new jabberwerx.JID from val, and cache it</li>
     * </ol>
     *
     * @param val The value to convert to a JID
     * @returns {jabberwerx.JID} The JID object from {val}
     * @throws {jabberwerx.JID.InvalidJIDError} If {val} could not be converted into a JID
     */
    jabberwerx.JID.asJID = function(val) {
        var jid = null;
        
        if (val instanceof jabberwerx.JID) {
            return val;
        }
        
        jid = _lookupCache(val);
        if (!jid) {
            // not found; create and (possibly) cache
            jid = new jabberwerx.JID(val);
            
            var lookup = jid.toString();
            if (_jidCache[lookup] && _jidCache[lookup] != jid) {
                // mixed-case input; return previously cached value
                jid = _jidCache[lookup];
            } else {
                _jidCache[lookup] = jid;
            }
            
            // always cache the original request
            _jidCache[val.toString()] = jid;
        }
        
        return jid;
    };
    /**
     * Clears the internal cache of JIDs.
     *
     * <b>NOTE:</b> This does not destroy existing JID instances.
     */
    jabberwerx.JID.clearCache = function() {
        _jidCache = {};
    },

    /**
     * <p>Translates the given input into a valid node for a JID. This method
     * performs the translation according to the escaping rules in XEP-0106:
     * JID Escaping.</p>
     *
     * @param   {String} input The string to translate
     * @returns {String} The translated string
     * @throws  {TypeError} if {input} is not a string; or if {input}
     *          starts or ends with ' '
     * @see     <a href='http://xmpp.org/extensions/xep-0106.html'>XEP-0106: JID Escaping</a>
     */
    jabberwerx.JID.escapeNode = function(input) {
        if (typeof(input) != "string") {
            throw new TypeError("input must be a string");
        }

        if (input.charAt(0) == ' ' || input.charAt(input.length - 1) == ' ') {
            throw new TypeError("input cannot start or end with ' '");
        }

        var ptn = /([ "&'\/:<>@])|(\\)(20|22|26|27|2f|3a|3c|3e|40|5c)/gi;
        var repFN = function(found, m1, m2, m3) {
            switch (m1 || m2) {
                case ' ':   return "\\20";
                case '"':   return "\\22";
                case '&':   return "\\26";
                case '\'':  return "\\27";
                case '/':   return "\\2f";
                case ':':   return "\\3a";
                case '<':   return "\\3c";
                case '>':   return "\\3e";
                case '@':   return "\\40";
                case '\\':  return "\\5c" + m3;
            }

            return found;
        };

        return input.replace(ptn, repFN);
    };
    /**
     * <p>Translates the given input from a valid node for a JID. This method
     * performs the translation according to the unescaping rules in XEP-0106:
     * JID Escaping.</p>
     *
     * @param   {String} input The string to translate
     * @returns {String} The translated string
     * @throws  {TypeError} if {input} is not a string
     * @see     <a href='http://xmpp.org/extensions/xep-0106.html'>XEP-0106: JID Escaping</a>
     */
    jabberwerx.JID.unescapeNode = function(input) {
        if (typeof(input) != "string") {
            throw new TypeError("input must be a string");
        }

        var ptn = /(\\20|\\22|\\26|\\27|\\2f|\\3a|\\3c|\\3e|\\40)|(\\5c)(20|22|26|27|2f|3a|3c|3e|40|5c)/gi;
        var repFN = function(found, m1, m2, m3) {
            switch (m1 || m2) {
                case "\\20":    return ' ';
                case "\\22":    return '"';
                case "\\26":    return '&';
                case "\\27":    return '\'';
                case "\\2f":    return '/';
                case "\\3a":    return ':';
                case "\\3c":    return '<';
                case "\\3e":    return '>';
                case "\\40":    return '@';
                case "\\5c":    return '\\' + m3;
            }

            return found;
        };

        return input.replace(ptn, repFN);
    };
}
})();

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Events.js*/
/**
 * filename:        Events.js
 * created at:      2009/05/11T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    //Adding function() to keep private methods out of global scope.
    (function(){
        /** @private */
        var _jwaNotifierBinding = function(dispatch, name, mode) {
            var key = 'on:' + name.toLowerCase();
            var notifier = dispatch[key];
            
            if (!notifier && (mode == 'create')) {
                notifier = new jabberwerx.EventNotifier(dispatch, name);
                dispatch[key] = notifier;
            } else if (notifier && (mode == 'destroy')) {
                delete dispatch[key];
            }
            
            return notifier;
        };
        /** @private */
        var _jwaDispatchBinding = function(src, name, mode) {
            var dispatch = (src instanceof jabberwerx.EventDispatcher) ?
                    src :
                    src._eventDispatch;
            if (!(dispatch && dispatch instanceof jabberwerx.EventDispatcher)) {
                if (mode != 'create') {
                    return;
                }
                dispatch = new jabberwerx.EventDispatcher(src);
                src._eventDispatch = dispatch;
            }
            
            return _jwaNotifierBinding(dispatch, name, mode);
        };
        
        /**
         * @class
         * The object representation for an event.
         *
         * @property {String} name The event name
         * @property {jabberwerx.EventNotifier} notifier The triggering notifier
         * @property {Object} source The source of the event
         * @property data Event-specific data
         * @property selected The results of a selection. This value is set if
         *           the callback was registered with a selector, and the selector
         *           matched.
         *
         * @description
         * Constructs a new jabberwerx.EventObject from the given notifier and
         * event data.
         *
         * @param {jabberwerx.EventNotifier} notifier The triggered notifier
         * @param [data] The event data
         * @constructs jabberwerx.EventObject
         * @see jabberwerx.EventNotifier#bindWhen
         * @minimal
         */
        jabberwerx.EventObject = function(notifier, data) {
            this.notifier = notifier;
            this.name = notifier.name;
            this.source = notifier.dispatcher.source;
            this.data = data;
            this.selected = undefined;
        };
        
        jabberwerx.EventNotifier = jabberwerx.JWBase.extend(/** @lends jabberwerx.EventNotifier.prototype */{
            /**
             * @class
             * Manages notifying listeners for a given event name.
             * 
             * @property {jabberwerx.EventDispatcher}  dispatcher The owning dispatcher
             * @property {String} name The event name
             *
             * @description
             * Constructs a new EventNotifier with the given dispatcher and
             * event name.
             *
             * This constructor should not be called directly.  Instead, it is
             * constructed by the {@link jabberwerx.EventDispatcher} as part of its
             * constructor, or internally as needed.
             *
             * @param {jabberwerx.EventDispatcher} dispatcher The owning dispatcher
             * @param {String} name The event name
             * @constructs jabberwerx.EventNotifier
             * @extends JWBase
             * @minimal
             */
            init: function(dispatcher, name) {
                this._super();
            
                this.dispatcher = dispatcher;
                this.name = name.toLowerCase();
                
                this._callbacks = [];
            },
            /**
             * Registers the given callback with this EventNotifier.
             *
             * <p>The callback is expected to have the following signature:</p>
             * <pre>
             *  cb = function(evt) {
             *      // evt is the jabberwerx.EventObject instance describing
             *      // the current triggering
             *
             *      // return true to indicate this event is "handled"
             *      // This return value may have special meaning for some
             *      // event notifiers
             *  }
             * </pre>
             *
             * <p>Callbacks are remember by their object reference, and are
             * considered to be unique. Registering the same function multiple
             * times removes any previous registration, and applies {cb} to the
             * current position and with the supplied additional arguments.</p>
             *
             * @param {Function} cb The callback to register or update
             * @throws {TypeError} If {cb} is not a function
             */
            bind: function(cb) {
                this.bindWhen(undefined, cb);
            },
            /**
             * Registers the given callback, filtering via the given selector. The
             * registered callback is only executed if the given selector indicates
             * the data passed to {@link #trigger} matches.
             *
             * <p>A selector may be either undefined, a jQuery selector string or a
             * function. If {selector} is undefined, then this method performs the
             * same registration as {@link #bind}.</p>
             *
             * <p>If {selector} is a string, it is used as the selector in
             * jabberwerx.$(), with data (coerced into a DOM Node) as the
             * context. If there are any results from the jQuery selection,
             * they are added to the event object's 'selected' property, and
             * {cb} is executed. Note that 'selected' is 'unwrapped' if the
             * selection is a single node; otherwise it is an array of the
             * selected nodes.</p>
             *
             * <p>If {selector} is a function, it is passed the event data, and is
             * expected to return a value (that does not evaluate as false) if the
             * data matches. For example, the following selector function would
             * match any events where the data is a Room:</p>
             *
             * <pre class="code">
             * var selector = function(data) {
             *     if (data instanceof jabberwerx.Room) {
             *         return data; //non-null object is "true"
             *     }
             *     return false; //prevents matching
             * }
             * </pre>
             *
             * <p>The result of {selector} is stored in the {@link
             * jabberwerx.EventObject#selected} property.</p>
             *
             * <pre>
             *  cb = function(evt) {
             *      // evt is the jabberwerx.EventObject instance describing
             *      // the current triggering
             *
             *      // return true to indicate this event is "handled"
             *      // This return value may have special meaning for some
             *      // event notifiers
             *  }
             * </pre>
             *
             * <p>Callbacks are remember by their object reference, and are
             * considered to be unique. Registering the same function multiple
             * times removes any previous registration, and applies {cb} to the
             * current position and with the supplied additional arguments.</p>
             *
             * @param {String|Function|undefined} selector The selector, as either a
             *        jQuery selector string or a function
             * @param {Function} cb The callback to register or update
             * @throws {TypeError} If {cb} is not a function, or if {selector} is
             *         not of the expected types
             */
            bindWhen: function(selector, cb) {
                if (!jabberwerx.$.isFunction(cb)) {
                    new TypeError("callback must be a function");
                }
                
                this.unbind(cb);
                switch (typeof selector) {
                    case 'undefined':
                        //nothing to do
                        break;
                    case 'function':
                        //nothing to do
                        break;
                    case 'string':
                        var filter = selector;
                        selector = function(data, evt) {
                            var node;
                            if (data instanceof jabberwerx.Stanza) {
                                node = data.getDoc();
                            } else {
                                //Hope for the best; although jQuery won't blow up
                                //if data isn't an acceptable context type
                                node = data;
                            }
                            
                            var selected = jabberwerx.$(filter, node);
                            
                            switch (selected.length) {
                                case 0:
                                    //No results: fail
                                    return false;
                                case 1:
                                    //single result: return unwrapped
                                    return selected[0];
                                default:
                                    //any results: return as-is
                                    return selected;
                            }
                            
                            //If we've made it this far, we failed
                            return false;
                        };
                        break;
                    default:
                        throw new TypeError("selector must be undefined or function or string");
                }
                
                this._callbacks.push({
                    'filter': filter,
                    'selector': selector,
                    'cb': cb
                });
            },
            /**
             * Unregisters the given callback from this EventNotifier.
             *
             * @param {Function} cb The callbck to unregister
             */
            unbind: function(cb) {
                this._callbacks = jabberwerx.$.grep(this._callbacks, function(value) {
                    return value['cb'] !== cb;
                });
            },
            /**
             * Fires an event on all registered callbacks, with the given data.
             * This method creates a {@link jabberwerx.EventObject}, then
             * calls all of the registered callbacks. Once all of this notifier's
             * callbacks have been notified, all callbacks registered on {@link
             * jabberwerx#.globalEvents} for this event are notified.
             *
             * If provided, the {cb} callback's signature is expected to be:
             *
             * <pre class='code'>
             *  cb = function(results) {
             *      // results is true if any event callback returned true,
             *      // false otherwise
             *  }
             * </pre>
             *
             * @param   [data] data specific to this event triggering
             * @param   {jabberwerx.EventNotifier} [delegated] the notifier to
             *          delegate event triggering to after calling this
             *          notifier's registered callbacks.
             * @param   {Function} [cb] function to execute when all of this
             *          event notifier's callbacks have been notified
             * @throws  {TypeError} If {delegated} is defined and is not an
             *          instance 
             */
            trigger: function(data, delegated, cb) {
                var evt;
                
                if (data instanceof jabberwerx.EventObject) {
                    //this is a delegation
                    evt = data;
                    //substitute notifier to the current one
                    evt.notifier = this;
                } else {
                    //this is an origination
                    evt = new jabberwerx.EventObject(this, data);
                }
                
                if (!delegated) {
                    delegated = _jwaNotifierBinding(jabberwerx.globalEvents, this.name);
                } else if (!(delegated instanceof jabberwerx.EventNotifier)) {
                    throw new TypeError("delegated must be a EventNotifier");
                }
                
                if (cb && !jabberwerx.$.isFunction(cb)) {
                    throw new TypeError("cb must be a function");
                }
                
                return this.dispatcher.process(this, evt, delegated, cb);
            },
            /**
             * @private
             */
            process: function(evt, delegated, cb) {
                var results = false;
                jabberwerx.reduce(this._callbacks, function(item) {
                    var     cb = item['cb'];
                    var     filter = item['selector'];
                    var     retval;
                    
                    if (!cb || !jabberwerx.$.isFunction(cb)) {
                        return;
                    }
                    
                    var selected = undefined;
                    if (filter) {
                        selected = filter(evt.data);
                        if (!selected) { return; }
                    }
        
                    try {
                        //updated on each call, regardless of filtering
                        evt.selected = selected;
                        retval = cb.call(cb, evt);
                    } catch (ex) {
                        /*DEBUG-BEGIN*/
                        jabberwerx.util.debug.error('callback on ' + evt.name + ' failed: ' + ex + " :: "  + (ex.toSource&& ex.toSource()) + " " + (ex.stack || ""));
                        /*DEBUG-END*/
                    }
        
                    if (retval !== undefined) {
                        results = results || Boolean(retval);
                    }
                });
                
                if (delegated && delegated !== this) {
                    var fn = function(delegatedResults) {
                        results = results || delegatedResults;
                        if (cb) {
                            cb(results);
                        }
                    };
                    delegated.trigger(evt, null, fn);
                } else if (cb) {
                    cb(results);
                }
            },
            
            /**
             * Marks this type for inline serialization.
             *
             * @returns {Boolean} always true
             */
            shouldBeSavedWithGraph: function() { return true; },
          
            /**
             * serialize the original string selectors passed to bindWhen.
             * 
             * While callbacks are invocations, the selector functions created in bindWhen are anonymous and
             * are not serialized. Serialize original string as needed, selecgor functions to be recreated after 
             * graph is restored.
             */
            wasUnserialized: function() {
                //rebuild anon selector functions as needed
                var callbacks = this._callbacks;
                callbacks = jabberwerx.$.map(callbacks, function(oneCB, oneKey) {
                    if (jabberwerx.util.isJWInvocation(oneCB.cb)) {
                        var method = oneCB.cb.methodName, target = oneCB.cb.object;
                        if (!(target && method && target[method])) {
                            jabberwerx.util.debug.log("throwing out bad callback: " + target + "[" + method + "]");
                            return null;
                        }
                    }
                    
                    if (oneCB.filter && !oneCB.selector && (typeof oneCB.filter == 'string')) {
                        var oneFilter = oneCB.filter;
                        oneCB.selector = function(data, evt) {
                            var node;
                            if (data instanceof jabberwerx.Stanza) {
                                node = data.getDoc();
                            } else {
                                //Hope for the best; although jQuery won't blow up
                                //if data isn't an acceptable context type
                                node = data;
                            }
                            
                            var selected = jabberwerx.$(oneFilter, node);
                            
                            switch (selected.length) {
                                case 0:
                                    //No results: fail
                                    return false;
                                case 1:
                                    //single result: return unwrapped
                                    return selected[0];
                                default:
                                    //any results: return as-is
                                    return selected;
                            }
                            
                            //If we've made it this far, we failed
                            return false;
                        };
                    }
                
                    return oneCB;
                });
                
                this._callbacks = callbacks;
            }
        }, "jabberwerx.EventNotifier");
        
        jabberwerx.EventDispatcher = jabberwerx.JWBase.extend(/** @lends jabberwerx.EventDispatcher.prototype */{
            /**
             * @class
             * Manages a collection of events for a given source.
             *
             * <p>Each event for this dispatcher is represented by a
             * {@link jabberwerx.EventNotifier}, as a property of this dispatcher.
             * To access a specific notifier, use the following notation:</p>
             *
             * <pre class="code">dispatcher['on:&lt;name&gt;']</pre>
             *
             * <p>Where &lt;name&gt; is the name of the event (lower case).</p>
             *
             * @property source The source of events
             *
             * @description
             * Constructs new EventDispatcher with the given source.
             *
             * @param {Object} src The source for events
             * @constructs jabberwerx.EventDispatcher
             * @see jabberwerx.JWModel#event
             * @see jabberwerx.JWModel#applyEvent
             * @minimal
             */
            init: function(src) {
                this._super();
            
                this.source = src;
                if (src !== jabberwerx && jabberwerx.globalEvents) {
                    this.globalEvents = jabberwerx.globalEvents;
                }
            },
            
            /**
             * @private
             */
            process: function(notifier, evt, delegated, cb) {
                var op = {
                    notifier: notifier,
                    event: evt,
                    delegated: delegated,
                    callback: cb
                };
                
                if (this._queue) {
                    // processing another event
                    // Defer this event until ready
                    this._queue.push(op);
                    return;
                }
                
                // setup a queue, to indicate we're processing events
                this._queue = [op];

                while (op = this._queue.shift()) {
                    // process the next event
                    op.notifier.process(op.event, op.delegated, op.callback);
                }
                
                // done with events; delete the queue
                delete this._queue;
            },
            
            /**
             * Marks this type for inline serialization.
             *
             * @returns {Boolean} always true
             */
            shouldBeSavedWithGraph: function() { return true; },
            /**
             * Called just after to unserializing. This method removes the global
             * dispatcher {@link jabberwerx.globalEvents} from being a property.
             * 
             */
            wasUnserialized: function() {
                jabberwerx.globalEvents = this.globalEvents;
            }
            
        }, "jabberwerx.EventDispatcher");
        
        jabberwerx.GlobalEventDispatcher = jabberwerx.EventDispatcher.extend(/** @lends jabberwerx.GlobalEventDispatcher.prototype */{
            /**
             * @class
             * The type for the global event dispatcher, {@link jabberwerx.globalEvents}.
             *
             * @extends jabberwerx.EventDispatcher
             * @description
             *
             * Creates a new GlobalEventsDispatcher
             *
             * @throws {Error} if called after {jabberwerx.globalEvents} is already
             * defined.
             * @constructs jabberwerx.GlobalEventDispatcher
             * @minimal
             */
            init: function() {
                this._super(jabberwerx);
                
                if (jabberwerx.globalEvents && jabberwerx.globalEvents !== this) {
                    throw new Error("only one global events dispatcher can exist!");
                }
            },
            
            /**
             * Registers a callback for the given event name. This method behaves
             * just as {@link jabberwerx.EventNotifier#bind}. This function also
             * ensures that a notifier exists for {name}.
             *
             * @param {String} name The event name to register on
             * @param {Function} cb The callback to register or update
             */
            bind: function(name, cb) {
                var notifier = _jwaNotifierBinding(this, name, 'create');
                notifier.bind(cb);
            },
            /**
             * Registers a callback for the given event name. This method behaves
             * just as {@link jabberwerx.EventNotifier#bindWhen}. This function
             * also ensures that a notifier exists for {name}.
             *
             * @param {String} name The event name to register on
             * @param {String|Function|undefined} selector The selector, as either
             *        a jQuery selector string or a function
             * @param {Function} cb The callback to register or update
             */
            bindWhen: function(name, selector, cb) {
                var notifier = _jwaNotifierBinding(this, name, 'create');
                notifier.bindWhen(selector, cb);
            },
            /**
             * Unregisters a callback for the given event name. This method behaves
             * just as {@link jabberwerx.EventNotifier#unbind}.
             *
             * @param {String} name The event name to unregister on
             * @param {Function} cb The callback to unregister
             */
            unbind: function(name, cb) {
                var notifier = _jwaNotifierBinding(this, name);
                
                if (notifier) {
                    notifier.unbind(cb);
                }
            },
            
            /**
             * Prevents this type from inline serialization.
             *
             * @returns {Boolean} always false
             */
            shouldBeSerializedInline: function() { return false; },
            /**
             * Marks this type for general graph saving.
             *
             * @returns {Boolean} always true
             */
            shouldBeSavedWithGraph: function() { return true; },
            /**
             * Called just prior to the object being serialized. This method
             * "forgets" the source, to prevent the global "jabberwerx" namespace
             * from being serialized.
             */
            willBeSerialized: function() {
                this.source = undefined;
            },
            /**
             * Called after the object is deserialized and rehydrated. This method
             * "remembers" the source as the global "jabberwerx" namespace.
             */
            wasUnserialized: function() {
                this.source = jabberwerx;
            }
        }, "jabberwerx.GlobalEventDispatcher");
        
        if (!(  jabberwerx.globalEvents &&
                jabberwerx.globalEvents instanceof jabberwerx.GlobalEventDispatcher)) {
            /**
             * The global event dispatcher. Callbacks registered on this
             * dispatcher are executed when any event of a given name is
             * triggered.
             *
             * <p>The list of all known events are found in
             * <a href="../jabberwerxEvents.html">JabberWerx AJAX Events</a>.</p>
             * 
             * @memberOf jabberwerx
             * @see jabberwerx.GlobalEventDispatcher#bind
             * @see jabberwerx.GlobalEventDispatcher#unbind
             * @type jabberwerx.GlobalEventDispatcher
             */
            jabberwerx.globalEvents = new jabberwerx.GlobalEventDispatcher();
        }
        
        /**
         * Locates the jabberwerx.EventNotifier for the given name.
         *
         * @returns {jabberwerx.EventNotifier} The notifier for {name}, or
         * {null} if not found
         */
        jabberwerx.JWModel.prototype.event = function(name) {
            return _jwaDispatchBinding(this, name);
        };
        /**
         * Establishes the event handling for a given event name. This
         * function ensures that a {@link jabberwerx.EventDispatcher} exists,
         * and that the dispatcher contains a {@link jabberwerx.EventNotifier}
         * for {name}.
         *
         * @param {String} name The event name
         * @returns {jabberwerx.EventNotifier} the notifier for {name}
         */
        jabberwerx.JWModel.prototype.applyEvent = function(name) {
            return _jwaDispatchBinding(this, name, 'create');
        };

    })();
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Entity.js*/
/**
 * filename:        Entity.js
 * created at:      2008/10/31T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    //Adding function() to keep private methods out of global scope.
    (function(){
        /**
         * @private
         */
        var __jwesAsKey = function(jid, node) {
            return "[" + (jid || "") + "]:[" + (node || "") + "]";
        };

        jabberwerx.Entity = jabberwerx.JWModel.extend(/** @lends jabberwerx.Entity.prototype */{
            /**
             * @class
             * <p>
             * Something addressable by JID and/or node: user, server, room, etc. For this release, clients
             * are not considered entities; there's a single global client.
             * </p>
             *
             * <p>
             * This class provides the following events:
             * <ul>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.Entity">jabberwerx.Entity</a></li>
             * </ul>
             *
             * To subscribe for a single entities primary presence updates use:<p><br>
             * <i>entity.event('primaryPresenceUpdated').bind......</i><br>
             * To subscribe for all entities primary presence updates use:<br>
             * <i>jabberwerx.globalEvents.bind('primaryPresenceChanged',......</p>
             *
             * @description
             * <p>Creates a new Entity with the given key and controller/cache.</p>
             *
             * <p>The value of key is expected to be an object with at least one of
             * the following properties:</p>
             *
             * <ul>
             * <li><b>jid:</b> The JID for this Entity (must either be undefined or
             * represent a valid JID)</li>
             * <li><b>node:</b> The sub node for this Entity (must either be
             * undefined or a non-empty string)</li>
             * </ul>
             *
             * <p>The value of {ctrl} may be undefined, a
             * {@link jabberwerx.Controller} or a
             * {@link jabberwerx.ClientEntityCache}. If it is a Controller,
             * its {@link jabberwerx.Controller#updateEntity} and
             * {@link jabberwerx.Controller#removeEntity} method will be called
             * as appropriate. If it is a ClientEntityCache, the event notifiers
             * for "entityCreated", "entityUpdated", and "entityDestroyed" are
             * retained and used as appropriate.</p>
             *
             * @param   {Object} key The JID and/or node identifying this entity
             * @param   {jabberwerx.Controller|jabberwerx.EntitySet} [ctrl] The
             *          controller or cache for this entity
             * @constructs jabberwerx.Entity
             * @extends jabberwerx.JWModel
             * @minimal
             */
            init: function(key, ctrl) {
                this._super();

                if (!key && !(key.jid || key.node)) {
                    throw new TypeError("key must contain a jid and/or a node");
                }

                // setup key
                if (key.jid) {
                    this.jid = jabberwerx.JID.asJID(key.jid);
                }
                if (key.node) {
                    this.node = key.node;
                }
                this._mapKey = __jwesAsKey(this.jid, this.node);

                var cache;
                if (ctrl instanceof jabberwerx.Controller) {
                    this.controller = ctrl;
                    cache = ctrl.client && ctrl.client.entitySet;
                } else if (ctrl && ctrl.register && ctrl.unregister && ctrl.entity) {
                    cache = ctrl;
                }

                if (cache) {
                    this.cache = cache;
                    this._eventing = {
                        "added"   : cache.event("entityCreated"),
                        "updated" : cache.event("entityUpdated"),
                        "deleted" : cache.event("entityDestroyed")
                    };
                } else {
                    this._eventing = {
                        "added"   : null,
                        "updated" : null,
                        "deleted" : null
                    };
                }

                // Set up event
                this.applyEvent('primaryPresenceChanged');
                this.applyEvent("resourcePresenceChanged");

                //IE6 workaround
                if (jabberwerx.$.browser.msie) {
                    this.toString = function () {
                        return this.__toStringValue();
                    }
                }
            },

            /**
             * <p>Destroys this entity. In most cases, this method should not
             * be called directly. Instead, call {@link #remove}.</p>
             */
            destroy: function() {
                if (this.cache) {
                    this.cache.unregister(this);
                }

                this._super();
            },

            /**
             * <p>Applies the values from the given entity to this one.
             * This method copies the groups, displayName, properties, features,
             * and identities from {entity} into this one. It then calls
             * {@link #update}, which may trigger an "entityUpdated" event.</p>
             *
             * @param   {jabberwerx.Entity} entity The entity to apply
             * @param   {Boolean} [noupdate] <tt>true</tt> to indicate that
             *          an update should NOT be triggered
             * @returns {jabberwerx.Entity} This entity
             * @throws  {TypeError} if {entity} is not an instance of Entity.
             */
            apply: function(entity, noupdate) {
                if (!(entity && entity instanceof jabberwerx.Entity)) {
                    throw new TypeError("entity is not valid");
                }

                jabberwerx.$.extend(this, {
                    _displayName: entity._displayName,
                    _groups: jabberwerx.$.extend([], entity._groups),
                    _presenceList: jabberwerx.$.extend([], entity._presenceList),
                    properties: jabberwerx.$.extend(true, {}, entity.properties),
                    features: jabberwerx.$.extend([], entity.features),
                    identities: jabberwerx.$.extend([], entity.identities)
                });

                if (!noupdate) {
                    this.update();
                }

                return this;
            },

            /**
             * @private
             */
            __toStringValue: function() {
                return "entity<" + this.getClassName() + ">[" +
                        this._mapKey + "]: " +
                        this.getDisplayName();
            },
            /**
             * <p>Determines if the given entity matches this Entity. This
             * method returns <tt>true</tt> if the jids and nodes of this Entity
             * are equal to {entity}'s.</p>
             *
             * @param {jabberwerx.Entity} entity The entity to match against
             * @returns {Boolean} <tt>true</tt> if {entity}'s identity matches
             *          this Entity.
             */
            matches: function(entity) {
                if (entity === this) {
                    return true;
                }

                if (!entity) {
                    return false;
                }

                return this._mapKey == entity._mapKey;
            },

            /**
             * <p>Determines if this entity is active. This method returns
             * <tt>true</tt> if the entity has at least one available presence
             * in its list.</p>
             *
             * <p>Subclasses may override this method to provide an alternative
             * means of determining its active state.</p>
             *
             * @returns {Boolean} <tt>true</tt> if the entity is active
             */
            isActive: function() {
                return (this._presenceList.length > 0 &&
                        this._presenceList[0].getType() != "unavailable");
            },

            /**
             * Gets the primary presence object of this entity. If the primary presence for this object
             * does not exist then null is returned.
             * @returns {jabberwerx.Presence} primary presence
             */
            getPrimaryPresence: function() {
                return this._presenceList[0] || null;
            },

            /**
             * Returns a sorted array of all presence objects for this entity
             * @returns {jabberwerx.Presence[]} an array of presence objects
             */
            getAllPresence: function() {
                return this._presenceList;
            },

            /**
             * Gets the presence object for a particular resource under this entity.
             * @param {String} resource The resource to get the presence object for
             * @returns {jabberwerx.Presence} The presence object for the resource. If the resource does not exist or does not have
             * a presence object associated with it then null is returned.
             */
            getResourcePresence: function(resource) {
                var fullJid = this.jid.getBareJIDString() + '/' + resource;
                var presence = null;
                jabberwerx.$.each(this._presenceList, function() {
                    if (this.getFrom() == fullJid) {
                        // Assign value to return value and exit jabberwerx.$.each loop
                        presence = this;
                        return false;
                    }
                    return true;
                });
                return presence;
            },

            /**
             * <p>Update presence for this Entity.</p>
             *
             * <p>If {presence} results in a change of the primary resource for
             * this entity, a "primaryPresenceChanged" event is triggered. A
             * "resourcePresenceChanged" event is always triggered by this method,
             * before "primaryPresenceChanged" (if applicable).</p>
             *
             * <p><b>NOTE:</b> The {quiet} flag is used to suppress the normal
             * eventing for certain cases, such as during entity creation. It
             * should not be needed in most cases.
             *
             * @param   {jabberwerx.Presence} [presence] The presence used to
             *          update. If this parameter is null or undefined the
             *          presence list for this entity is cleared.
             * @param   {Boolean} [quiet] <tt>true</tt> to suppress firing
             *          "primaryPresenceChagned" and "resourcePresenceChanged"
             *          events
             * @returns  {Boolean} <tt>true</tt> if primary presence changed.
             * @throws  {TypeError} If {presence} exists but is not a valid availability or
             *          unavailability presence for this entity
             */
            updatePresence: function(presence, quiet) {
                var retVal = false;

                if (!presence) {
                    if (this.getPrimaryPresence()) {
                        // Trigger a resourcePresenceChanged event and remove every presence object in
                        // the presence list
                        var len = this._presenceList.length;
                        for (var i=0; i<len; i++) {
                            var presence = this._presenceList.pop();
                            !quiet && this.event("resourcePresenceChanged").trigger({
                                fullJid: presence.getFromJID(),
                                presence: null,
                                nowAvailable: false
                            });
                        }

                        !quiet && this.event("primaryPresenceChanged").trigger({
                            presence: null,
                            fullJid: this.jid.getBareJID()
                        });

                        retVal = true;
                    }
                } else {
                    if (!(presence instanceof jabberwerx.Presence)) {
                        throw new TypeError("presence is not a valid type");
                    }

                    var jid = presence.getFromJID();
                    if (jid.getBareJIDString() != this.jid.getBareJIDString()) {
                        throw new jabberwerx.Entity.InvalidPresenceError("presence is not for this entity: " + this);
                    }

                    if (presence.getType() && presence.getType() != "unavailable") {
                        throw new jabberwerx.Entity.InvalidPresenceError("presence is not the correct type");
                    }
                    //If the user resource presence went from unavailable to available, set nowAvailable to true
                    var resPresence = this.getResourcePresence(jid.getResource());
                    var nowAvailable;
                    if (!resPresence || resPresence.getType() == "unavailable") {
                        nowAvailable = Boolean(!presence.getType());
                    } else {
                        nowAvailable = false;
                    }


                    // Keep reference to primary presence before insert is made
                    var primaryPresence = this._presenceList[0] || null;

                    // Remove old presence object and add new presence object
                    this._removePresenceFromList(jid.toString());
                    if (presence.getType() != "unavailable") {
                        if (!this.isActive()) {
                            this._clearPresenceList();
                        }
                        this._insertPresence(presence);
                    } else {
                        this._handleUnavailable(presence);
                    }

                    !quiet && this.event("resourcePresenceChanged").trigger({
                        fullJid: jid,
                        presence: presence,
                        nowAvailable: nowAvailable
                    });
                    if (primaryPresence !== this._presenceList[0]) {
                        var primaryJid;
                        primaryPresence = this._presenceList[0] || null;
                        primaryJid = primaryPresence ?
                            primaryPresence.getFromJID() :
                            jid.getBareJID();
                        !quiet && this.event("primaryPresenceChanged").trigger({
                            presence: primaryPresence,
                            fullJid: primaryJid
                        });
                        retVal = true;
                    }
                }

                return retVal;
            },

            /**
             * @private
             * This function gets called when an unavailable presence get sent to
             * {@link jabberwerx.Entity#updatePresence}.
             */
            _handleUnavailable: function(presence) {
            },

            /**
             * @private
             */
            _insertPresence: function(presence) {
                this._presenceList.push(presence);
                this._presenceList.sort(function (a, b) {
                    return b.compareTo(a);
                });
            },

            /**
             * @private
             */
            _clearPresenceList: function() {
                this._presenceList = [];
            },

            /**
             * @private
             * Removes the presence object specified by the jid parameter from the _presenceList
             * @param {String} jid
             * @returns {Boolean} true if presence object was found and removed, false if could not be found
             */
            _removePresenceFromList: function(jid) {
                for(var i=0; i<this._presenceList.length; i++) {
                    if (this._presenceList[i].getFrom() == jid) {
                        this._presenceList.splice(i,1);
                        return true;
                    }
                }
                return false;
            },

            /**
             * <p>Retrieves the display name for this Entity. This method
             * returns the explicitly set value (if one is present), or a
             * string using the following format:</p>
             *
             * <div class="code">{&lt;node&gt;}&lt;jid&gt;</div>
             *
             * <p>Where &lt;jid&gt; is {@link #jid} (or "" if not defined), and
             * &lt;node&gt; is {@link #node} (or "" if not defined).</p>
             *
             * <p>Subclasses overriding this method SHOULD also override
             * {@link #setDisplayName}.</p>
             *
             * @returns {String} The display name
             */
            getDisplayName: function() {
                var name = this._displayName;
                if (!name) {
                    var jid = (this.jid && this.jid.toDisplayString());
                    name = (this.node && "{" + this.node + "}") + (jid || "");
                }

                return name;
            },
            /**
             * <p>Changes or removes the expclit display name for this Entity.
             * If the value of {name} is non-empty String, it is set as the
             * explicit display name. Otherwise any previous value is cleared.</p>
             *
             * <p>If this entity has a controller associated with it, its
             * {@link jabberwerx.Controller#updateEntity} is called, passing
             * in this Entity. Otherwise this method attempts to trigger a
             * "entityUpdated" event on the associated event cache.</p>
             *
             * <p>Subclasses overriding this method SHOULD also override
             * {@link #getDisplayName}.</p>
             *
             * @param {String} name The new display name
             */
            setDisplayName: function(name) {
                var nval = (String(name) || "");
                var oval = this._displayName;

                if (oval != nval) {
                    this._displayName = nval;
                    this.update();
                }
            },
            /**
             * @private
             */
            _displayName: "",

            /**
             * <p>Retrieves the groups for this Entity. The returned
             * array is never {null} or {undefined}.</p>
             *
             * @returns {String[]} The array of groups (as strings)
             */
            getGroups: function() {
                return this._groups;
            },
            /**
             * <p>Changes or removes the groups for this Entity. This method
             * uses the following algorithm:</p>
             *
             * <ol>
             * <li>If {groups} is an array, it is cloned (with duplicate values
             * removed) and replaces any previous groups.</li>
             * <li>If {groups} is a single string, all previous groups are replaced
             * with an array containing this value.</li>
             * <li>Otherwise, the previous groups are replaced with an empty
             * array.</li>
             * </ol>
             * @param {String[]|String} [groups] The name of groups
             */
            setGroups: function(groups) {
                if (jabberwerx.$.isArray(groups)) {
                    groups = jabberwerx.unique(groups.concat([]));
                } else if (groups) {
                    groups = [ groups.toString() ];
                } else {
                    groups = [];
                }

                this._groups = groups;
                this.update();
            },
            /**
             *
             */
            _groups : [],

            /**
             * <p>Triggers an update of this entity. If the entity has a
             * controller, then {@link jabberwerx.Controller#updateEntity} is
             * called. Otherwise if this entity has an owning cache, an
             * "entityUpdated" event is fired on that cache for this
             * entity.</p>
             *
             */
            update: function() {
                if (this.controller && this.controller.updateEntity) {
                    this.controller.updateEntity(this);
                } else if (this._eventing["updated"]) {
                    this._eventing["updated"].trigger(this);
                }
            },
            /**
             * <p>Removes this entity. If the entity has a controller, then
             * {@link jabberwerx.Controller#removeEntity} is called. Otherwise
             * {@link #destroy} is called.</p>
             */
            remove: function() {
                if (this.controller && this.controller.removeEntity) {
                    this.controller.removeEntity(this);
                } else {
                    this.destroy();
                }
            },

            /**
             * <p>Determines if this Entity supports the given feature.</p>
             *
             * @param   {String} feat The feature to check for
             * @returns  {Boolean} <tt>true</tt> if {feat} is supported
             */
            hasFeature: function(feat) {
                if (!feat) {
                    return false;
                }

                var result = false;
                jabberwerx.$.each(this.features, function() {
                    result = String(this) == feat;
                    return !result; //return false to break the loop if we found it
                });

                return result;
            },
            /**
             * <p>Determines if this Entity supports the given identity (as a
             * single "category/type" string).</p>
             *
             * @param   {String} id The identity to check for as a "category/type"
             *          string
             * @return  {Boolean} <tt>true</tt> if {id} is supported
             */
            hasIdentity: function(id) {
                if (!id) {
                    return false;
                }

                var result = false;
                jabberwerx.$.each(this.identities, function() {
                    result = String(this) == id;
                    return !result; //return false to break the loop if we found it
                });

                return result;
            },

            /**
             * <p>Retrieves the string value of this Entity.</p>
             *
             * @return  {String} The string value
             */
            toString: function() {
                return this.__toStringValue();
            },

            /**
             * <p>The JID for this Entity. This property may be null if the entity
             * is not JID-addressable.</p>
             *
             * @type jabberwerx.JID
             */
            jid: null,
            /**
             * <p>The node ID for this Entity. This property may be "" if the entity
             * is not node-addressable.</p>
             *
             * @type String
             */
            node: "",

            /**
             * <p>The properties for this Entity. This is an open-ended hashtable,
             * with the specifics defined by subclasses.</p>
             *
             */
            properties: {},

            /**
             * <p>The set of features for this Entity. This is a unique array of
             * Service Discovery feature strings.</p>
             *
             * @type    {String[]}
             */
            features: [],
            /**
             * <p>The set of identities for this Entity. This is a unique array of
             * Service Discovery category/type strings.</p>
             *
             * @type    {String[]}
             */
            identities: [],

            /**
             * @private
             * Stores a list of jabberwerx.Presence objects for each resource of this entity. Do not directory modify this
             * but instead use the getPrimaryPresence, getAllPresence, getResourcePresence, addPresence and removePresence methods
             * @type [jabberwerx.Presence]
             */
            _presenceList: []
        }, 'jabberwerx.Entity');

        jabberwerx.Entity.InvalidPresenceError = jabberwerx.util.Error.extend("The provided presence is not valid for this entity");

        jabberwerx.EntitySet = jabberwerx.JWModel.extend(/** @lends jabberwerx.EntitySet */{
            /**
             * @class
             * <p>A repository for Entity objects, based on JID and/or node.</p>
             *
             * <p>
             * This class provides the following events:
             * <ul>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.EntitySet">jabberwerx.EntitySet</a></li>
             * </ul>
             *
             * @description Create a new EntitySet.
             *
             *
             * @constructs jabberwerx.EntitySet
             * @extends jabberwerx.JWModel
             * @minimal
             */
            init: function() {
                this._super();

                this.applyEvent("entityCreated");
                this.applyEvent("entityDestroyed");
                this.applyEvent("entityUpdated");
                this.applyEvent("entityRenamed");
                this.applyEvent("entityAdded");
                this.applyEvent("entityRemoved");
                this.applyEvent("batchUpdateStarted");
                this.applyEvent("batchUpdateEnded");
            },

            /**
             * Fetch method for any known-existing {@link jabberwerx.Entity} object.
             * If the object does not already exist, `undefined` is returned.
             *
             * @param {jabberwerx.JID|String} [jid] The JID of an entity to fetch.
             * @param {String} [node] The node of an entity to fetch.
             * @type jabberwerx.Entity
             */
            entity: function(jid, node) {
                return this._map[__jwesAsKey(jid, node)];
            },

            /**
             * Registers the given entity to this EntitySet.
             *
             * @param {jabberwerx.Entity} entity The entity to register.
             * @returns {Boolean} <tt>true</tt> if this EntitySet's data was
             *          changed by this call.
             * @throws  {TypeError} if {entity} is not a valid Entity.
             */
            register: function(entity) {
                if (!(entity && entity instanceof jabberwerx.Entity)) {
                    throw new TypeError("entity is not an Entity");
                }

                var prev = this.entity(entity.jid, entity.node);
                if (prev === entity) {
                    return false;
                }

                if (prev) {
                    this.unregister(prev);
                }
                this._updateToMap(entity);
                this.event("entityAdded").trigger(entity);

                return true;
            },
            /**
             * Unregister the given entity from this EntitySet.
             *
             * @param {jabberwerx.Entity} entity The entity to unregister.
             * @returns {Boolean} <tt>true</tt> if the EntitySet's data was
             *          changed by this call.
             */
            unregister: function(entity) {
                var present = (this.entity(entity.jid, entity.node) !== undefined);
                this._removeFromMap(entity);
                if (present) {
                    this.event("entityRemoved").trigger(entity);
                }

                return present;
            },

            /**
             * @private
             */
             _renameEntity: function(entity, njid, nnode) {
                var ojid = entity.jid;
                var onode = entity.node;
                this._removeFromMap(entity);

                if (njid) {
                    njid = jabberwerx.JID.asJID(njid);
                } else {
                    njid = undefined;
                }
                entity.jid = njid;
                if (nnode) {
                    nnode = String(nnode);
                } else {
                    nnode = undefined;
                }
                entity.node = nnode;
                this._updateToMap(entity);

                var data = {
                    entity: entity,
                    jid: ojid,
                    node: nnode
                };
                this.event("entityRenamed").trigger(data);
             },

            /**
             * Visits each entity in this EntitySet. The given function is executed
             * as op(entity). For each execution of &lt;op&gt;, the sole argument
             * is the current entity.
             *
             * @param {function} op The function called for each entity
             */
            each: function(op) {
                if (!jabberwerx.$.isFunction(op)) {
                    throw new TypeError('operator must be a function');
                }

                var     that = this;

                jabberwerx.$.each(this._map, function() {
                    var     retcode;

                    if (this instanceof jabberwerx.Entity) {
                        retcode = op(this);
                    }

                    return (retcode !== false);
                });
            },

            /**
             * Returns an array of the entities registered on this EntitySet.
             * @returns {jabberwerx.Entity[]} An array of the entities registered on this EntitySet
             */
            toArray: function() {
                var     arr = [];

                this.each(function(entity) {
                    arr.push(entity);
                });

                return arr;
            },

            /**
             * <p>Gets a set of all the groups to which the entities in this entity set belong. The
             * contents of the group are unique (i.e. no copies of group names within the array).</p>
             * @returns {String[]} A string array of the group names
             */
            getAllGroups: function() {
                var groups = [];
                this.each(function(entity) {
                    jabberwerx.$.merge(groups, entity.getGroups());
                });
                return jabberwerx.unique(groups);
            },

            /**
             * The map of keys (jid/node) to entities
             *
             * @private
             */
            _map: {},

            /**
             * Updates the map of entities to include the given entity.
             */
            _updateToMap: function (ent) {
                this._map[__jwesAsKey(ent.jid, ent.node)] = ent;
            },
            _removeFromMap: function(ent) {
                delete this._map[__jwesAsKey(ent.jid, ent.node)];
            },

            /**
             * @private # of batch starts this set has received. batch reference count, keep
             * batching until we receive expected batch end.
             */
            _batchCount: 0,
            /**
             * @private
             */
            _batchQueue: [],

            /**
             * Indicates that a batch process is starting. This method increments
             * an internal counter of batch processing requests. If there are no
             * other batch processing requests pending, this method triggers a
             * "batchUpdateStarted" event.
             *
             * @returns {Boolean} <tt>true</tt> if a batch is already in
             *          progress prior to this call
             */
            startBatch: function() {
                var count = this._batchCount;

                this._batchCount++;
                if (count == 0) {
                    this._enableBatchTriggers(true);
                    this._batchQueue = [];
                    this.event("batchUpdateStarted").trigger();
                }

                return (count != 0);
            },
            /**
             * Indicates that a batch process is ending. This method decrements
             * an internal counter of batch processing requests. If this call
             * ends all other batch processing requests, this method triggers a
             * "batchUpdatedEnded" event and passes it an array of
             * {event name, event data} pairs as its data.
             *
             * ClientEntityCache will batch the following events:
             * entityCreated, entityDestroyed, entityAdded, entityRemoved,
             * entityRenamed and entityUpdated.
             *
             * @returns {Boolean} <tt>true</tt> if a batch is still in
             *          progress after this call.
             */
            endBatch: function() {
                var running = true;

                switch (this._batchCount) {
                    case 0:
                        running = false;
                        break;
                     case 1:
                        running = false;
                        this._enableBatchTriggers(false);

                        var bq = this._batchQueue;
                        this._batchQueue = [];
                        this.event("batchUpdateEnded").trigger(bq);
                        //fall through
                    default:
                        this._batchCount--;
                        break;
                }

                return running;
            },

            /**
             * @private data manipulation before adding to the queue
             */
            _addBatchedEvent: function(notifier, edata) {
                this._batchQueue.push({name: notifier.name, data: edata});
            },
            /**
             * @private
             * override interesting entityset event
             *  notifier's trigger method so that every trigger call from
             *  anywhere will be caught.
             *
             *  This function overrides the trigger method of all
             *  EntitySet events except batch related ones. Also used
             *  to clear (disable) the override.
             *
             *  triggers are overriden when batches start and cleared
             *  when the batch stops.
             */
            _enableBatchTriggers: function(enable) {
                var that = this;
                //walk each EntitySet event and modify its trigger method
                jabberwerx.$.each(
                    ["entityCreated", "entityDestroyed", "entityRenamed",
                     "entityUpdated", "entityAdded", "entityRemoved"],
                    function() {
                        var notifier = that.event(this);
                        //disable as needed
                        if (!enable && notifier._superTrigger) {
                            notifier.trigger = notifier._superTrigger;
                            delete notifier._superTrigger;
                        //enable the override if it does not already exist.
                        } else if (enable && !notifier._superTrigger) {
                            notifier._superTrigger = notifier.trigger;
                            //Override of notifier.trigger, calls the original
                            //(super) trigger as needed. returns false if not
                            //firing original trigger, else returns the
                            //original trigger result.
                            notifier.trigger = function(data) {
                                that._addBatchedEvent(notifier, data);
                                return (!that.suppressBatchedEvents
                                        && notifier._superTrigger.apply(notifier, arguments));
                            }
                        }
                });
            },

            /**
             * Should EntitySet events not be fired when running a batch? The
             * default behavior (false) is to add the EntitySet event to the
             * list of events passed through the batchUpdateEnded event AND
             * fire the event normally as well.
             *
             * This should only be set to true (do not fire events normally) if
             * your application only has batch aware EntitySet listeners.
             */
            suppressBatchedEvents: false
        }, 'jabberwerx.EntitySet');

        /**
         * <p>Error when attempting to add an entity already contained by an EntitySet.</p>
         *
         * @constructs  jabberwerx.EntitySet.EntityAlreadyExistsError
         * @extends     jabberwerx.util.Error
         */
        jabberwerx.EntitySet.EntityAlreadyExistsError = jabberwerx.util.Error.extend('That JID is already taken!.');
    })();
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Stanza.js*/
/**
* filename:        Stanza.js
* created at:      2009/05/11T00:00:00-06:00
*
* Copyrights
*
* Portions created or assigned to Cisco Systems, Inc. are
* Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
*/

if (jabberwerx) {
    jabberwerx.Stanza = jabberwerx.JWModel.extend( /** @lends jabberwerx.Stanza.prototype */ {
        /**
         * @class
         * <p>A representation of an XMPP stanza.</p>
         *
         * @description
         * Creates a new Stanza with the given root element or root name.
         * 
         * @param   {Element|String} root The element name of the stanza
         * @throws  {TypeError} If {root} is not a valid Element or String
         * @constructs jabberwerx.Stanza
         * @extends JWModel
         * @minimal
         */                 
        init: function(root) {
            this._super();
            
            var builder = new jabberwerx.NodeBuilder();
            if (jabberwerx.isElement(root)) {
                builder = builder.node(root);
            } else if (typeof(root) == "string") {
                // If root does not contain a namespace, assume "{jabber:client}"
                if (!(/^\{[^\}]*\}/.test(root))) {
                    root = "{jabber:client}" + root;
                }
                builder = builder.element(root);
            } else {
                throw new TypeError("root must be an element or expanded-name");
            }
            this._DOM = builder.data;
            
            // Check for timestamp and populate date variable accordinaly if present
            var date = new Date();
            var dateString = jabberwerx.$(builder.data).
                    find("x[xmlns='jabber:x:delay'][stamp]").
                    attr("stamp");
            if (!dateString) {
                dateString = jabberwerx.$(builder.data).
                      find("delay[xmlns='urn:xmpp:delay'][stamp]").
                      attr("stamp");            
            }                          
            if (dateString) {
                try {
                    date = jabberwerx.parseTimestamp(dateString);
                } catch (ex) {
                    //DEBUG-BEGIN
                    jabberwerx.util.debug.log("could not parse delay: " + ex);
                    //DEBUG-END
                }
            }
            this.timestamp = date;
        },
        
        /**
         * <p>Retrieves the XML element representing this Stanza.</p>
         *
         * @returns  {Element} The Stanza's element
         */
        getNode: function() {
            return this._DOM;
        },
        /**
         * <p>Retrieves the document that owns this Stanza's XML element.</p>
         *
         * @returns  {Document} The owning document for the Stanza's element
         */
        getDoc: function() {
            return this.getNode().ownerDocument;
        },
        /**
         * <p>Generates the XML string representation of this Stanza.</p>
         *
         * @returns {String} The XML
         */
        xml: function() {
            return jabberwerx.util.serializeXML(this._DOM);
        },
        /**
         * <p>Retrieves the stanza-type for this Stanza. This is equivalent to
         * retrieving the node name from {@link #getNode}.</p>
         *
         * @returns  {String} The type of stanza (e.g. "message")
         */
        pType: function() {
            return this.getNode().nodeName;
        },
        
        /**
         * @private
         */
        _getAttrValue: function(name) {
            return this.getNode().getAttribute(name);
        },
        /**
         * @private
         */
        _setAttrValue: function(name, val) {
            if (val === undefined || val === null) {
                this.getNode().removeAttribute(name);
            } else {
                // allows for an empty attribute (defined with no value)
                this.getNode().setAttribute(name, val);
            }
        },
        
        /**
         * @private
         * get text from matching child nodes. name may be expanded name
         */
        _getChildText: function(name) {
            var nnode = new jabberwerx.NodeBuilder(name).data;
            var nodens = (nnode.namespaceURI) ?
                            nnode.namespaceURI : this.getNode().namespaceURI;
            var matches = jabberwerx.$(this.getNode()).children(nnode.nodeName).
                            map(function (idx, child) {
                                return child.namespaceURI==nodens ? child:null;
                            });
            return matches.length ? jabberwerx.$(matches[0]).text() : null;
        },
        /**
         * @private
         * <p>Changes or removes the child lement text for the given name.</p>
         *
         * @param   {String} name The name of the child element
         * @param   {String} [val] The new value for {name}
         */
        _setChildText: function(name, val) {
            var n = jabberwerx.$(this.getNode()).children(name);
            if (val === undefined || val === null) {
                n.remove();
            } else {
                if (!n.length) {
                    n = jabberwerx.$(new jabberwerx.NodeBuilder(this.getNode()).
                        element(name).
                        data);
                }
                n.text(val);
            }
        },
        
        /**
         * <p>Retrieves the type for this Stanza. This is equivalent to
         * retrieving the "type" attribute from {@link #getNode}.</p>
         *
         * @returns  {String} The type
         */
        getType: function() {
            return this._getAttrValue("type");
        },
        /**
         * <p>Changes or removes the type for this Stanza.</p>
         *
         * <p>If {type} is "", undefined, or null, any current value is
         * removed.</p>
         *
         * @param   {String} [type] The new type
         */
        setType: function(type) {
            this._setAttrValue("type", type || undefined);
        },
        
        /**
         * <p>Retrieves the ID for this Stanza.</p>
         *
         * @return  {String} The ID
         */
        getID: function() {
            return this._getAttrValue("id");
        },
        /**
         * <p>Changes or removes the ID for this Stanza.</p>
         *
         * <p>If {id} is "", undefined, or null, any current value is
         * removed.</p>
         *
         * @param   {String} [id] The new ID
         */
        setID: function(id) {
            this._setAttrValue("id", id || undefined);
        },
        
        /**
         * <p>Retrieves the "from" address for this Stanza.</p>
         *
         * @returns  {String} The address this Stanza is from
         */
        getFrom: function() {
            return this._getAttrValue("from") || null;
        },
        /**
         * <p>Retrieves the "from" address for this Stanza as a JID.
         * This method will attempt to convert the "from" address
         * string into a JID, or return <tt>null</tt> if unable to.</p>
         *
         * @returns  {jabberwerx.JID} The JID this Stanza is from
         */
        getFromJID: function() {
            var addr = this.getFrom();
            
            if (addr) {
                try {
                    addr = jabberwerx.JID.asJID(addr);
                } catch (ex) {
                    //DEBUG-BEGIN
                    jabberwerx.util.debug.log("could not parse 'from' address: " + ex);
                    //DEBUG-END
                    addr = null;
                }
            }
            
            return addr;
        },
        /**
         * <p>Changes or removes the "from" address for this Stanza.</p>
         * 
         * @param   {String|jabberwerx.JID} [addr] The new from address
         */
        setFrom: function(addr) {
            addr = (addr) ?
                   jabberwerx.JID.asJID(addr) :
                   undefined;
                   
            this._setAttrValue("from", addr);
        },
        
        /**
         * <p>Retrieves the "to" address for this Stanza.</p>
         *
         * @returns  {String} The address this Stanza is to
         */
        getTo: function() {
            return this._getAttrValue("to") || null;
        },
        /**
         * <p>Retrieves the "to" address for this Stanza as a JID.
         * This method will attempt to convert the "to" address
         * string into a JID, or return <tt>null</tt> if unable to.</p>
         *
         * @returns  {jabberwerx.JID} The JID this Stanza is to
         */
        getToJID: function() {
            var addr = this.getTo();
            
            if (addr) {
                try {
                    addr = jabberwerx.JID.asJID(addr);
                } catch (ex) {
                    //DEBUG-BEGIN
                    jabberwerx.util.debug.log("could not parse 'to' address: " + ex);
                    //DEBUG-END
                    addr = null;
                }
            }
            
            return addr;
        },
        /**
         * <p>Changes or removes the "to" address for this Stanza.</p>
         * 
         * @param   {String|jabberwerx.JID} [addr] The new to address
         */
        setTo: function(addr) {
            addr = (addr) ?
                   jabberwerx.JID.asJID(addr) :
                   undefined;
                   
            this._setAttrValue("to", addr);
        },
        
        /**
         * <p>Determines if this Stanza is reporting an error.</p>
         *
         * @returns  {Boolean} <tt>true</tt> if this is a Stanza of type error
         */
        isError: function() {
            return this.getType() == "error";
        },
        /**
         * <p>Returns an ErrorInfo object containing the error information
         * of this stanza if there is any. Otherwise it returns null.</p>
         * @returns {jabberwerx.Stanza.ErrorInfo} The ErrorInfo object
         */
        getErrorInfo: function() {
            var err = jabberwerx.$(this.getNode()).children("error");
            
            if (this.isError() && err.length) {
                err = jabberwerx.Stanza.ErrorInfo.createWithNode(err.get(0));
            } else {
                err = null;
            }
            
            return err;
        },
        
        /**
         * Creates a duplicate of this stanza. This method performs a deep
         * copy of the DOM.
         * 
         * @returns  {jabberwerx.Stanza} The cloned stanza
         */
        clone: function() {
            var cpy = jabberwerx.Stanza.createWithNode(this.getNode());
            cpy.timestamp = this.timestamp;
            
            return cpy;
        },
        /**
         * Creates a stanza with the addresses reversed. This method
         * clones this Stanza, sets the "to" address to be the original
         * "from" address, then (optionally) sets the "from" address to be
         * the original "to" address. 
         *
         * @param   {Boolean} [include_from] <tt>true</tt> if the new
         *          stanza should include a "from" address (default is
         *          <tt>false</tt>)
         * @returns  {jabberwerx.Stanza} The cloned stanza, with addresses
         *          swapped.
         */
        swap: function(include_from) {
            var cpy = this.clone();
            cpy.setTo(this.getFromJID());
            cpy.setFrom(include_from ? this.getToJID() : null);
            
            return cpy;
        },
        /**
         * <p>Creates an error stanza based on this Stanza. This method
         * calls {@link #swap}, sets the type to "error", and appends an
         * &lt;error/&gt; element with the data from {err}.</p>
         *
         * @param   {jabberwerx.Stanza.ErrorInfo} err The error information
         * @return  {jabberwerx.Stanza} The error stanza
         * @throws  {TypeError} If {err} is not a ErrorInfo
         */
        errorReply: function(err) {
            if (!(err && err instanceof jabberwerx.Stanza.ErrorInfo)) {
                throw new TypeError("err must be an ErrorInfo");
            }
            
            var retval = this.swap();
            retval.setType("error");
            
            // TODO: better namespace handling for node??
            var builder = new jabberwerx.NodeBuilder(retval.getNode()).
                    xml(err.getNode().xml);
            
            return retval;
        },
        
        /**
         * Called before this Stanza is serialized for persistence. This
         * method saves a string representation of the XMPP stanza and
         * converts the timestamp from a Date object into a number.
         */
        willBeSerialized: function() {
            this.timestamp = this.timestamp.getTime();
            this._serializedXML = this._DOM.xml;
            delete this._DOM;
        },
        /**
         * Called after this Stanza is deserialized from persistence. This
         * method rebuilds the DOM structure from the saved XML string and
         * converts the timestamp from a number into a Date object.
         */
        wasUnserialized: function() {
            if (this._serializedXML && this._serializedXML.length) {
                this._DOM = jabberwerx.util.unserializeXML(this._serializedXML);
                delete this._serializedXML;
            }
            
            this.timestamp = this.timestamp ? new Date(this.timestamp) : new Date();
        },

        /**
         * The timestamp of this Stanza. If this stanza contains a
         * "{urn:xmpp:time}delay" or "{jabber:x:delay}x" child element, this
         * value reflects the date specified by that element. Otherwise, it is
         * the timestamp at which this stanza was created.
         *
         * @type    Date
         */
        timestamp: null,
        
        /**
         * @private
         */
        _DOM: null
    }, "jabberwerx.Stanza");
    
    jabberwerx.Stanza.ErrorInfo = jabberwerx.JWModel.extend(/** @lends jabberwerx.Stanza.ErrorInfo.prototype */{
        /**
         * @class
         * <p>Representation of stanza error information.</p>
         *
         * @description
         * <p>Creates a new ErrorInfo with the given information.</p>
         *
         * @param   {String} [type] The error type ("cancel", "auth", etc)
         * @param   {String} [cond] The error condition
         * @param   {String} [text] The error text description
         * @constructs jabberwerx.Stanza.ErrorInfo
         * @extends JWModel
         * @minimal
         */
        init: function(type, cond, text) {
            this._super();
            
            this.type = type || "wait";
            this.condition = cond || "{urn:ietf:params:xml:ns:xmpp-stanzas}internal-server-error";
            this.text = text || "";
            
            // IE work-around
            this.toString = this._toErrString;
        },
        
        /**
         * <p>Retrieves the element for this ErrorInfo. The returned element
         * is as follows:</p>
         *
         * <pre class="code">
         *  &lt;error type="{type}"&gt;
         *      &lt;{condition-local-name} xmlns="urn:ietf:params>xml:ns:xmpp-stanzas"/&gt;
         *      &lt;text xmlns="urn:ietf:params>xml:ns:xmpp-stanzas"&gt;{text}&lt;/text&gt;
         *  &lt;/error&gt;
         * </pre>
         *
         * @returns  {Element} The DOM representation
         */
        getNode: function() {
            var builder = new jabberwerx.NodeBuilder("error");
            
            builder.attribute("type", this.type);
            builder.element(this.condition);
            if (this.text) {
                builder.element("{urn:ietf:params:xml:ns:xmpp-stanzas}text").
                        text(this.text);
            }
            
            return builder.data;
        },
        
        /**
         * <p>Called after this object is rehydrated. This method sets the toString
         * method as expected.</p>
         */
        wasUnserialized: function() {
            // IE work-around
            this.toString = this._toErrString;
        },
        
        /**
         * @private
         */
        _toErrString: function() {
            return this.condition;
        },
        
        /**
         * <p>The type of error info.</p>
         *
         * @type    String
         */
        type: "",
        /**
         * <p>The condition of the error info. This is the expanded-name of
         * the predefined condition for the ErrorInfo.</p>
         *
         * @type    String
         */
        condition: "",
        /**
         * <p>The optional text description for the error info.</p>
         *
         * @type    String
         */
        text: ""
    }, "jabberwerx.Stanza.ErrorInfo");
    /**
     * <p>Creates an ErrorInfo based on the given node.</p>
     *
     * @param   {Element} node The XML &lt;error/&gt;
     * @return  {jabberwerx.Stanza.ErrorInfo} The ErrorInfo
     * @throws  {TypeError} If {node} is not an element
     */
    jabberwerx.Stanza.ErrorInfo.createWithNode = function(node) {
        if (!jabberwerx.isElement(node)) {
            throw new TypeError("node must be an Element");
        }
        node = jabberwerx.$(node);
        var type = node.attr("type");
        var cond = node.
                children("[xmlns=urn:ietf:params:xml:ns:xmpp-stanzas]:not(text)").
                map(function() {
                    return "{urn:ietf:params:xml:ns:xmpp-stanzas}" + this.nodeName;
                }).get(0);
        var text = node.
                children("text[xmlns=urn:ietf:params:xml:ns:xmpp-stanzas]").
                text();

        // TODO: search for known errors first?
        return new jabberwerx.Stanza.ErrorInfo(type, cond, text);
    };
    
    /**
     * <p>ErrorInfo for a bad request error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_BAD_REQUEST = new jabberwerx.Stanza.ErrorInfo(
            "modify",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}bad-request");
    /**
     * <p>ErrorInfo for a conflict error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_CONFLICT = new jabberwerx.Stanza.ErrorInfo(
            "modify",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}conflict");
    /**
     * <p>ErrorInfo for a feature not implemented error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_FEATURE_NOT_IMPLEMENTED = new jabberwerx.Stanza.ErrorInfo(
            "cancel",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}feature-not-implemented");
    /**
     * <p>ErrorInfo for a forbidden error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_FORBIDDEN = new jabberwerx.Stanza.ErrorInfo(
            "auth",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}forbidden");
    /**
     * <p>ErrorInfo for an internal server error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_INTERNAL_SERVER_ERROR = new jabberwerx.Stanza.ErrorInfo(
            "wait",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}internal-server-error");
    /**
     * <p>ErrorInfo for a non-existent item.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_ITEM_NOT_FOUND = new jabberwerx.Stanza.ErrorInfo(
            "cancel",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}item-not-found");
    /**
     * <p>ErrorInfo for a malformed JID error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_JID_MALFORMED = new jabberwerx.Stanza.ErrorInfo(
            "modify",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}jid-malformed");
    /**
     * <p>ErrorInfo for a not acceptable error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_NOT_ACCEPTABLE = new jabberwerx.Stanza.ErrorInfo(
            "modify",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}not-acceptable");
    /**
     * <p>ErrorInfo for a not allowed error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_NOT_ALLOWED = new jabberwerx.Stanza.ErrorInfo(
            "cancel",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}not-allowed");
    /**
     * <p>ErrorInfo for a not authorized error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_NOT_AUTHORIZED = new jabberwerx.Stanza.ErrorInfo(
            "auth",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}not-authorized");
    /**
     * <p>ErrorInfo for a service unavailable error.</p>
     *
     * @type    jabberwerx.Stanza.ErrorInfo
     */
    jabberwerx.Stanza.ERR_SERVICE_UNAVAILABLE = new jabberwerx.Stanza.ErrorInfo(
            "wait",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}service-unavailable");

    /**
     * <p>ErrorInfo for a remote server timeout error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stanza.ERR_REMOTE_SERVER_TIMEOUT = new jabberwerx.Stanza.ErrorInfo(
            "wait",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}remote-server-timeout");
            
    /**
     * Factory method for creating a stanza from an XML node.
     * 
     * @static
     * @param   {Element} node An XML node.
     * @return  {jabberwerx.Stanza} The Stanza object wrapping the given
     *          node
     */
    jabberwerx.Stanza.createWithNode = function(node) {
        if (!jabberwerx.isElement(node)) {
            throw new TypeError("node must be an element");
        }
        
        var stanza;
        switch(node.nodeName) {
            case "iq":
                stanza = new jabberwerx.IQ(node);
                break;
            case "message":
                stanza = new jabberwerx.Message(node);
                break;
            case "presence":
                stanza = new jabberwerx.Presence(node);
                break;
            default:
                stanza = new jabberwerx.Stanza(node);
                break;
        }
        
        return stanza;
    };

    jabberwerx.IQ = jabberwerx.Stanza.extend(/** @lends jabberwerx.IQ.prototype */ {
        /**
         * @class
         * <p>Represents an &lt;iq/&gt; stanza.</p>
         *
         * @description
         * <p>Creates a new IQ object.</p>
         * 
         * @param   {Element} [packet] The &lt;iq/&gt; element, or <tt>null</tt>
         *          for an empty IQ
         * @throws  {TypeError} If {packet} is not an &lt;iq/&gt; element
         * @constructs jabberwerx.IQ
         * @extends jabberwerx.Stanza
         * @minimal
         */     
        init: function(packet) {
            if (packet) {
                if (!jabberwerx.isElement(packet)) {
                    throw new TypeError("packet must be an &lt;iq/&gt; Element");
                }
                if (packet.nodeName != "iq") {
                    throw new TypeError("packet must be an &lt;iq/&gt; Element");
                }
            }
            this._super(packet || "{jabber:client}iq");
        },
        
        /**
         * <p>Retrieves the payload for this IQ.</p>
         *
         * @returns  {Element} The payload for this IQ, or {null} if none
         */
        getQuery: function() {
            return jabberwerx.$(this.getNode()).children(":not(error)").get(0);
        },
        /**
         * <p>Changes or removes the payload for this IQ.</p>
         *
         * @returns  {Element} The payload for this IQ, or {null} if none
         * @throws {TypeError} If {payload} is not an Element
         */
        setQuery: function(payload) {
            if (payload && !jabberwerx.isElement(payload)) {
                throw new TypeError("Node must be an element");
            }
        
            var q = jabberwerx.$(this.getNode()).children(":not(error)");
            q.remove();
            
            if (payload) {
                new jabberwerx.NodeBuilder(this.getNode()).node(payload);
            }
        },
        /**
         * <p>Generates a reply IQ from this IQ. This method clones this
         * IQ and sets the type to "result". If {payload} is specified,
         * it is added, otherwise the IQ is empty.</p>
         *
         * @param   {Element|String} payload The payload for this IQ
         * @return  {jabberwerx.IQ} The reply for this IQ
         * @throws  {TypeError} If {payload} is not an XML Element
         */
        reply: function(payload) {
            var retval = this.swap();
            
            try {
                jabberwerx.$(retval.getNode()).empty();
            } catch (ex) {
                var n = retval.getNode();
                for (var idx = 0; idx < n.childNodes.length; idx++) {
                    n.removeChild(n.childNodes[idx]);
                }
            }
            if (payload) {
                var builder = new jabberwerx.NodeBuilder(retval.getNode());
                
                if (jabberwerx.isElement(payload)) {
                    builder.node(payload);
                } else if (typeof(payload) == "string") {
                    builder.xml(payload);
                } else {
                    throw new TypeError("payload must be an Element or XML representation of an Element");
                }
            }
            retval.setType("result");
            
            return retval;
        }
    }, "jabberwerx.IQ");

    jabberwerx.Message = jabberwerx.Stanza.extend(/** @lends jabberwerx.Message.prototype */ {
        /**
         * @class
         * <p>Represents a &lt;message/&gt; stanza.</p>
         * 
         * @description
         * <p>Creates a new Message object.</p>
         *
         * @param   {Element} [packet] The &lt;message/&gt; element, or
         *          <tt>null</tt> for an empty Message
         * @throws  {TypeError} If {packet} is not a &lt;message/&gt; element
         * @constructs jabberwerx.Message
         * @extends jabberwerx.Stanza
         * @minimal
         */     
        init: function(packet) {
            if (packet) {
                if (!jabberwerx.isElement(packet)) {
                    throw new TypeError("Must be a <message/> element");
                }
                if (packet.nodeName != "message") {
                    throw new TypeError("Must be a <message/> element");
                }
            }
            
            this._super(packet || "{jabber:client}message");
        },
        
        /**
         * <p>Retrieves the plaintext body for this Message.</p>
         *
         * @returns  {String} The body
         */
        getBody: function() {
            return this._getChildText("body");
        },
        /**
         * <p>Changes or removes the body for this Message.</p>
         * <p>Changes to the plaintext body will automatically clear the 
         *  XHTML-IM body (XEP-71 8#2). In practice <tt>setBody</tt> and 
         *  {@link #setHTML} are mutually exclusively, using both 
         *  within the same message is not recommended.</p>
         * @param   {String} [body] The new message body
         */
        setBody: function(body) {
            this.setHTML();
            this._setChildText("body", body || undefined);
        },

        /**
         * <p>Retrieves the XHTML-IM body element for this Message.
         *  The first body contained within an html element (xep-71 namespaces) or null
         *   if the element does not exist. Returned element will be cleaned using xep-71
         *   Recommended  Profile. See {@link jabberwerx.xhtmlim#.sanitize}.
         *  NOTE the entire body element is returned, not just its contents. </p>
         * @returns  {DOM} The XHTML body element or null
         */
        getHTML: function() {
            var ret = jabberwerx.$(this.getNode()).find("html[xmlns=http://jabber.org/protocol/xhtml-im]>body[xmlns=http://www.w3.org/1999/xhtml]:first");
            if (ret.length && !this._isSanitized) { //most likely a received message
                this.setHTML(ret.children().get()); //setHTML will sanitize and set state as needed. 
                return this.getHTML();
            }
            return ret.length ? ret.get(0) : null;
        },
        /**
         * <p>Changes or removes both the HTML and plaintext bodies for this Message.</p>
         * <p>XHTML-IM and plaintext must have the same text value (xep-71 8#2). See {@link #setBody}.
         *  HTML is cleaned using xep-71 Recommended Profile (See {@link jabberwerx.xhtmlim#.sanitize}). 
         *  <tt>html</tt> may be a string that will parse into a root tag, a single root HTML tag or an array of 
         *  HTML tags (must not be body elements). <tt>setHTML</tt> adds a body wrapper as needed.
         *  If <tt>html</tt> is <tt>null</tt> the XHTML-IM html element is removed and the plaintext body is cleared.</p>
         * @param   {DOM|Array|String} [html] The new message
         * @throws {TypeError} If html is defined and not a parsable string,  DOM or a non empty Array of DOM
         */
        setHTML: function(html) {          
            if (html && !jabberwerx.util.isString(html) && !jabberwerx.isElement(html) && 
               (!jabberwerx.$.isArray(html) || !html.length)) {
                throw new TypeError("html must be a string, DOM or an array");
            }
            this._isSanitized = false;
            var htmlNode = jabberwerx.$(this.getNode()).find("html[xmlns=http://jabber.org/protocol/xhtml-im]");
            if (htmlNode) {
                htmlNode.remove();
            }
            this._setChildText("body"); 
            if (html) {
                if (jabberwerx.util.isString(html)) {
                    html = jabberwerx.util.unserializeXML(html);
                }
                if (jabberwerx.$.isArray(html)) {      
                    var newBodyBuilder = new jabberwerx.NodeBuilder("{http://www.w3.org/1999/xhtml}body");                
                    jabberwerx.$.each(html, function (index, item) {
                        newBodyBuilder.node(item);
                    });
                    html = newBodyBuilder.data;                    
                } else if (html.nodeName != "body") {
                    html = jabberwerx.util.unserializeXML("<body xmlns='http://www.w3.org/1999/xhtml'>" + html.xml + "</body>");
                }
                jabberwerx.xhtmlim.sanitize(html);
                htmlNode = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/xhtml-im}html").node(html).parent.data;
                jabberwerx.$(this.getNode()).append(htmlNode.cloneNode(true));
                this._setChildText("body", jabberwerx.$(htmlNode).text());
                this._isSanitized = true;
            }           
        },
       
        /**
         * <p>Retrieves the subject for this Message.</p>
         *
         * @returns  {String} The subject
         */
        getSubject: function() {
            return this._getChildText("subject");
        },
        /**
         * <p>Changes or removes the subject for this Message.</p>
         *
         * @param   {String} [subject] The new message subject
         */
        setSubject: function(subject) {
            this._setChildText("subject", subject || undefined);
        },
        
        /**
         * <p>Retrieves the thread for this Message.</p>
         *
         * @returns  {String} The thread
         */
        getThread: function() {
            return this._getChildText("thread") || null;
        },
        /**
         * <p>Changes or removes the thread for this Message.</p>
         *
         * @param   {String} [thread] The new message thread
         */
        setThread: function(thread) {
            this._setChildText("thread", thread || undefined);
        },
        
        /**
         * @private
         * xhtml has been santized flag 
         * @type  {Boolean}
         */
        _isSanitized: false
    }, "jabberwerx.Message");

    /**
     * Takes a String or an Element and substitutes in the user name, nickname or handle of the sender, where the string begins with '/me '.<br>
     * Example: translate('/me laughs', 'foo') returns ['* foo laughs']
     * @param   {String|Element} content The message content.
     * @param   {String} displayName The displayName of the sender
     * @return {jQueryCollection|null} The translated Message if content contained a XEP-0245 '/me ' command, otherwise null
     * @throws {jabberwerx.Message.InvalidContentFormat} if content is not a string or a Element.
     */
    jabberwerx.Message.translate = function(content, displayName) {
        var xep0245Found = false;
        var textNodeFound = false;
        var translatedContent = null;

        var findTextNodes = function(element, displayName) {
            if (!xep0245Found && !textNodeFound) {
                if (jabberwerx.isText(element)) {
                    var replace = translateSlashMe(jabberwerx.$(element).text(), displayName);
                    if (xep0245Found) {
                        jabberwerx.$(element).replaceWith(replace);
                    } else {
                        textNodeFound = true;
                    }
                } else if (element.hasChildNodes()) {
                    for (var i = 0; i < element.childNodes.length; i++) {
                        findTextNodes(element.childNodes[i], displayName);
                    }
                }
            }
        };


        var translateSlashMe = function(rawText, displayName) {
			var slashMe = "/me ";
            if (rawText.substring(0,slashMe.length).toLowerCase() == slashMe) {
                xep0245Found = true;
                return ("* " + displayName + " " + rawText.substring(slashMe.length));
            }
            return rawText;
		};

        if (typeof content == "string") {
            content = translateSlashMe(content, displayName);
        } else if (jabberwerx.isElement(content)) {
            // traverse nodes looking for text nodes
            for (var i = 0; i < content.childNodes.length; i++) {
                if (!xep0245Found && !textNodeFound) {
                    findTextNodes(content.childNodes[i], displayName);
                } else {
                    break;
                }
            }
        } else {
           throw new jabberwerx.Message.InvalidContentFormat();
        }
        
        if (xep0245Found) {
            translatedContent = content;
        }
        return translatedContent;
    };
	/**
     * @class jabberwerx.Message.InvalidContentFormat
     * <p>Error to indicate the content is not type of string or a jQuery object.</p>
     * @description
     * <p>Creates a new InvalidContentFormat with the given message.</p>
     * @extends jabberwerx.util.Error
     * @minimal
     */
	jabberwerx.Message.InvalidContentFormat = jabberwerx.util.Error.extend('The content parameter must be of type string or a jQuery object.');

    jabberwerx.Presence = jabberwerx.Stanza.extend(/** @lends jabberwerx.Presence.prototype */ {
        /**
         * @class
         * <p>Represents a &lt;presence/&gt; stanza.</p>
         * 
         * @description
         * <p>Creates a new Presence object.</p>
         *
         * @param   {Element} [packet] The &lt;presence/&gt; element, or
         *          <tt>null</tt> for an empty Presence
         * @throws  {TypeError} If {packet} is not an &lt;presence/&gt; element
         * @constructs jabberwerx.Presence
         * @extends jabberwerx.Stanza
         * @minimal
         */     
        init: function(packet) {
            if (packet) {
                if (!jabberwerx.isElement(packet)) {
                    throw new TypeError("packet must be a &lt;presence/&gt; Element");
                }
                if (packet.nodeName != "presence") {
                    throw new TypeError("packet must be a &lt;presence/&gt; Element");
                }
            }
            this._super(packet || "{jabber:client}presence");
        },
        
        /**
         * <p>Retrieves the priority for this Presence. This method
         * returns the integer value for the &lt;priority/&gt; child
         * element's text content, or 0 if none is available.</p>
         *
         * @returns  {Number} The priority
         */
        getPriority: function() {
            var pri = this._getChildText("priority");
            pri = (pri) ? parseInt(pri) : 0;
            return !isNaN(pri) ? pri : 0;
        },
        /**
         * <p>Changes or removes the priority for this Presence.</p>
         *
         * @param   {Number} [pri] The new priority
         * @throws  {TypeError} If {pri} is defined and not a number.
         */
        setPriority: function(pri) {
            // NOTE: 0 evaluates to false, so need to check
            if (pri !== undefined && pri !== null && typeof(pri) != "number") {
                throw new TypeError("new priority must be a number or undefined");
            }
            this._setChildText("priority", pri);
        },
        
        /**
         * <p>Retrieves the show value for this Presence. This method
         * returns the text content of the &lt;show/&gt; child eleemnt,
         * or {@link #.SHOW_NORMAL} if none is available.</p>
         *
         * @returns  {String} The show value
         */
        getShow: function() {
            return this._getChildText("show") || jabberwerx.Presence.SHOW_NORMAL;
        },
        /**
         * <p>Changes or removes the show value for this Presence.</p>
         *
         * @param   {String} [show] The new show value
         * @throws  {TypeError} If {show} is defined and not one of
         *          "away", "chat", "dnd", or "xa".
         */
        setShow: function(show) {
            if (show && (show != jabberwerx.Presence.SHOW_AWAY &&
                        show != jabberwerx.Presence.SHOW_CHAT &&
                        show != jabberwerx.Presence.SHOW_DND  &&
                        show != jabberwerx.Presence.SHOW_XA)) {
                throw new TypeError("show must be undefined or one of 'away', 'chat', 'dnd', or 'xa'");
            }
            
            this._setChildText("show", show || undefined);
        },
        
        /**
         * <p>Retrieves the status value for this Presence. This method
         * returns the text content of the &lt;status/&gt; child element,
         * or <tt>null</tt> if none is available.</p>
         *
         * @returns  {String} The show value
         */
        getStatus: function() {
            return this._getChildText("status") || null;
        },
        /**
         * <p>Changes or removes the status value for this Presence.</p>
         *
         * @param   {String} [status] The new status value
         */
        setStatus: function(status) {
            this._setChildText("status", status || undefined);
        },
        
        /**
         * <p>Compares this Presence to the given presence object for
         * natural ordering. The order is determined via:</p>
         * <ol>
         * <li>The &lt;priority/&gt; values</li>
         * <li>The &lt;show/&gt; values</li>
         * <li>The timestamps</li>
         * </ol>
         *
         * <p>A missing &lt;priority/&gt; value is equal to "0".</p>
         *
         * <p>A missing &lt;show/&gt; value is equal to "" (normal).</p>
         *
         * @param   {jabberwerx.Presence} presence Object to compare against
         * @returns  {Integer} -1, 1, or 0 if this Presence is before, after,
         *          or in the same position as {presence}
         */
        compareTo: function(presence) {
            if (!(presence && presence instanceof jabberwerx.Presence)) {
                throw new TypeError("presence must be an instanceof jabberwerx.Presence");
            }
            
            var p1, p2;
            
            p1 = this.getPriority() || 0;
            p2 = presence.getPriority() || 0;
            if (p1 > p2) {
                return 1;
            } else if (p1 < p2) {
                return -1;
            }
            
            p1 = this._showStrToInt(this.getType() || this.getShow());
            p2 = this._showStrToInt(presence.getType() || presence.getShow());
            if (p1 > p2) {
                return 1;
            } else if (p1 < p2) {
                return -1;
            }
            
            p1 = this.timestamp;
            p2 = presence.timestamp;
            if (p1 > p2) {
                return 1;
            } else if (p1 < p2) {
                return -1;
            }
            
            return 0;
        },
        
        /**
         * @private
         * Assign an integer value depending on the string value passed through.
         * @param showStr String value to convert to an integer
         * @returns {Integer} Integer value as follows:
         *              'chat':         5
         *              '':             4
         *              'away':         3
         *              'xa':           2
         *              'dnd':          1
         *              'unavailable':  0
         *      return -1 in case of any other value
         */
        _showStrToInt: function(showStr) {
            showStr = (showStr ? showStr : "");
            switch (showStr) {
                case 'chat':
                    return 5;
                case '':
                    return 4;
                case 'dnd':
                    return 3;
                case 'away':
                    return 2;
                case 'xa':
                    return 1;
                case 'unavailable':
                    return 0;
                default:
                    return -1;
            }
        },
        
        /**
         * Sets show, status and priority via a single method call
         * @param {String} [show] A status message
         * @param {String} [status] A status indicator
         * @param {Integer} [priority] A priority for this resource
         * @returns {jabberwerx.Presence} This updated presence stanza
         */
        setPresence: function(show, status, priority) {
            if (show) {
                this.setShow(show);
            }
            if (status) {
                this.setStatus(status);
            }
            if (priority !== undefined && priority !== null) {
                this.setPriority(priority);
            }
            return this;
        }
    }, "jabberwerx.Presence");
    
    /**
     * The "away" status.
     * @constant 
     * @type String
     */
    jabberwerx.Presence.SHOW_AWAY = "away";
    /**
     * The "chat" status.
     * @constant 
     * @type String
     */
    jabberwerx.Presence.SHOW_CHAT = "chat";
    /**
     * The "dnd" status.
     * @constant 
     * @type String
     */    
    jabberwerx.Presence.SHOW_DND = "dnd";
    /**
     * The "normal" status.
     * @constant 
     * @type String
     */
    jabberwerx.Presence.SHOW_NORMAL = "";
    /**
     * The "xa" status.
     * @constant 
     * @type String
     */
    jabberwerx.Presence.SHOW_XA = "xa";
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/User.js*/
/**
 * filename:        User.js
 * created at:      2008/10/31T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx) {
    jabberwerx.User = jabberwerx.Entity.extend(/** @lends jabberwerx.User.prototype */ {
        /**
         * @class
         * <p>The general User representation. Do not construct users by hand
         * with the new operator. See {@link jabberwerx.ClientEntityCache#localUser}.<p>
         *
         * @description
         * Creates a new User with the given JID and cache location
         * 
         * @param   {String|jabberwerx.JID} jid The user's JID
         * @param   {jabberwerx.ClientEntityCache} [cache] The owning cache
         * @abstract
         * @constructs jabberwerx.User
         * @extends jabberwerx.Entity
         * @minimal
         */     
        init: function(jid, cache) {
            this._super({jid: jid}, cache);
        }
    }, 'jabberwerx.User');

           /**
         * @class
         * <p>The LocalUser representation.
         *
         * @description
         * Creates a new LocalUser with the given JID and cache location
         * <p><b>NOTE:</b> This type should not be created directly </p>
         * <p>Use {@link jabberwerx.ClientEntityCache#localUser} instead.</p></p>
         * @param   {String|jabberwerx.JID} jid The user's JID
         * @param   {jabberwerx.ClientEntityCache} [cache] The owning cache
         * @constructs jabberwerx.User
         * @extends jabberwerx.Entity
         * @minimal
         */   
    jabberwerx.LocalUser = jabberwerx.User.extend(/** @lends jabberwerx.LocalUser.prototype */ {            

        /**
         * Retrieves the user's display name. This method simply returns the
         * node portion of the user's JID.
         *
         * @return  {String} The display name
         */
        getDisplayName: function() {
            return this._displayName || jabberwerx.JID.unescapeNode(this.jid.getNode());
        }

    }, 'jabberwerx.LocalUser');
}
/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Stream.js*/
/**
 * filename:    Stream.js
 * created at:  2009/12/01T00:00:00-07:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
 if (jabberwerx) {
    jabberwerx.Stream = jabberwerx.JWModel.extend(/** @lends jabberwerx.Stream.prototype */{
        /**
         * @private
         * @class
         * <p>Manages a stream of elements into and out of a server. This
         * class provides the BOSH layer implementation.</p>
         *
         * @description
         * <p>Creates a new jabberwerx.Stream.</p>
         *
         * @extends JWModel
         * @constructs jabberwerx.Stream
         */
        init: function() {
            this.applyEvent("streamOpened");
            this.applyEvent("streamClosed");
            this.applyEvent("streamElementsReceived");
            this.applyEvent("streamElementsSent");

            // initialize the queues
            this._recvQ = new jabberwerx.Stream.Queue();
            this._sendQ = new jabberwerx.Stream.Queue();
            this._xhrs = new jabberwerx.Stream.Queue();

            // setup values for all XMLHttpRequests
            this._xhrSetup = {
                cache: false,
                xhr: this.invocation("_createXHR", jabberwerx.$.ajaxSettings.xhr),
                complete: this.invocation("_handleXHR"),
                contentType: "text/xml",
                dataType: "text",
                global: false,
                processData: false,
                type: "POST"
            };
        },

        /**
         * @private
         * <p>Retrieves the properties of this Stream. This method
         * returns a snapshot of the properties at the time it is called;
         * updates to the returned properties are not reflected into this
         * Stream, nor vice-versa.</p>
         *
         * <p>The specifics of the returned properties object are implemention
         * dependent.</p>
         *
         * @return  {Object} A hashtable of the current stream properties
         */
        getProperties: function() {
            return jabberwerx.$.extend(true, {}, this._boshProps);
        },

        /**
         * <p>Determines if this stream is already open.</p>
         *
         * @return  {Boolean} <tt>true</tt> if open.
         */
        isOpen: function() {
            return this._opened;
        },

        /**
         * <p>Determines if this stream is connected in a secure or trusted
         * manner.</p>
         *
         * @return  {Boolean} <tt>true</tt> If the stream is considered secure
         */
        isSecure: function() {
            return this._boshProps.secure || false;
        },

        /**
         * <p>Retrieves the domain for this stream.</p>
         *
         * @return  {String} The domain, or <tt>null</tt> if not known.
         */
        getDomain: function() {
            return this._boshProps.domain || null;
        },
        /**
         * <p>Retrieves the session ID for this stream. For BOSH,
         * this value is the "sid".</p>
         *
         * @return  {String} The current session ID, or <tt>null</tt> if not
         *          known
         */
        getSessionID: function() {
            return this._boshProps.sid || null;
        },
        /**
         * <p>Retrieves the timeout for this stream.</p>
         *
         * @return  {Number} The timeout in seconds
         */
        getTimeout: function() {
            return this._boshProps.timeout || 60;
        },

        /**
         * <p>Connects this stream to the remote endpoint. This method
         * prepares the BOSH request queue, and sends the initial
         * &lt;body/&gt;.</p>
         *
         * <p>The value of {params} is expected to be an object containing
         * the following properties:</p
         * <pre class="code">{
         *      // domain of remote service (REQUIRED)
         *      domain: "example.com",
         *      // URL to connect to remote service (OPTIONAL)
         *      httpBindingURL: "/httpbinding",
         *      // preferred connection/request timeout in seconds (OPTIONAL)
         *      timeout: 30
         * }</pre>
         *
         * @param   {Object} params The connection parameters
         * @throws  {TypeError} if {params} does not contain a valid domain
         * @throws  {jabberwerx.Stream.AlreadyOpenError} If this stream is already
         *          open
         */
        open: function(params) {
            if (this.isOpen()) {
                throw new jabberwerx.Stream.AlreadyOpenError();
            }

            // make sure we're cleared out...
            this._reset();

            // copy and validate/default
            this._boshProps = jabberwerx.$.extend({}, params || {});
            if (!this._boshProps.domain) {
                throw new TypeError("domain must be specified");
            }
            if (!this._boshProps.timeout) {
                this._boshProps.timeout = jabberwerx.Stream.DEFAULT_TIMEOUT;
            }
            if (!this._boshProps.wait) {
                this._boshProps.wait = jabberwerx.Stream.DEFAULT_WAIT;
            }

            // setup binding URL
            var url = /^(?:(?:([0-9a-zA-Z]+\:)\/\/)?(?:([0-9a-zA-Z\.\-]+)(?:\:([0-9]+))?))?(?:\/(.*))?$/.
            		  exec(this._boshProps.httpBindingURL || "");
            if (!url) {
                throw new TypeError("httpBindingURL not specified correctly");
            }

            // setup protocol
            if (!url[1]) {
                url[1] = document.location.protocol;
            }

			var domain = "";
            // setup host and port
            if (!url[2]) {
                url[2] = document.location.host;
            }else {
            	if (!jabberwerx.util.validate.isIPAddress(url[2])) {
            	    var index = url[2].indexOf('.');
            	    domain = (index != -1) ? url[2].substring(index):""; //e.g ".sample.com"
            	}
            	if (this._connectToNode) {
            		url[2] = (jabberwerx.util.validate.isIPAddress(this._connectToNode)||this._connectToNode.indexOf(domain)>0) ? this._connectToNode:(this._connectToNode + domain);
            	} else if (this._boshProps.homeNode) {
            		url[2] = (jabberwerx.util.validate.isIPAddress(this._boshProps.homeNode)||this._boshProps.homeNode.indexOf(domain)>0) ? this._boshProps.homeNode:(this._boshProps.homeNode + domain);
            	}
            }

            // setup path
            if (!url[3]) {
                url[3] = "";
            }

            // setup path
            if (!url[4]) {
                url[4] = "";
            }
            /*If the client is served from https://myproxyserver:1234/sampleclient.html
               and the bindingURL is "/httpbinding"
               the documnet.location.host will be "myproxyserver:1234"
               and the url[3] will be "".
               so it is true for (document.location.port != url[3])
               this is wrong. To fix this, we now do comparision between document.location.port 
               vs  url[2].split(":")[1]||url[3]
             */
            var port = url[2].split(":")[1]||url[3];
            this._boshProps.secure = this._boshProps.secure || (url[1] == "https:");
            this._boshProps.crossSite = (document.location.protocol != url[1]) ||
                                        (document.location.host != url[2]) ||
                                        (document.location.port != port); 
            //update _connectToNode
            if (this._boshProps.crossSite) {
            	this._connectToNode = url[2];
            	jabberwerx.util.debug.log("Cross site is true.");
             } else {
            	//when using proxy, the format of httpbindingURL is "/server"
            	url[4] = this._connectToNode ||this._boshProps.homeNode||url[4];
            	this._connectToNode = url[4];
            }
            
            jabberwerx.util.debug.log("Update _connectToNode = " + this._connectToNode);
            this._boshProps.httpBindingURL = url[1] + "//" +
                                             url[2] +
                                             (url[3] ? ":" + url[3] : "") + "/" +
                                             url[4];
            jabberwerx.util.debug.log("Bosh URL is: " + this._boshProps.httpBindingURL);
            
            this._boshProps.networkAttempts = 0;

            this._boshProps.operation = "open";
            this._sendRequest();

            this._boshProps.heartbeat = setInterval(
                    this.invocation("_heartbeat"),
                    jabberwerx.Stream.HEARTBEAT_INTERVAL);
        },

        /**
         * @private
         */
        _storeConnectionInfo: function(protocol, hostPort, resource) {
            this._boshProps.httpBindingURL = protocol + "//" +
                                             hostPort + "/" +
                                             resource;
            this._boshProps.secure = this._boshProps.secure || (protocol == "https:");
            this._boshProps.crossSite = (document.location.protocol != protocol) ||
                                        (document.location.host != hostPort);
        },

        /**
         * <p>Reopens this Stream. this method sends the stream restart request
         * to the server, and awaits a proper response.</p>
         *
         * <p>If the server does not immediately respond to the restart with a
         * new stream:features, his method generates a &lt;stream:features/&gt;
         * containing &lt;bind/&gt; and &lt;session/&gt;.</p>
         *
         * @throws  {jabberwerx.Stream.NotOpenError} If this Stream is not
         *          currently open.
         */
        reopen: function() {
            if (!this.isOpen()) {
                throw new jabberwerx.Stream.NotOpenError();
            }

            // do a timeout in case the server doesn't actually support
            // xmpp:restart=true
            this._boshProps.opening = setTimeout(
                    this.invocation("_handleOpen"),
                    2000);
            // hard-coded with a reasonably acceptable delay for now
            // This timeout will be removed when all supported server
            // platforms implement XEP-206 version 1.2
            this._boshProps.operation = "reopen";
            this._sendRequest({restart: true});
        },
        /**
         * <p>Disconnects this stream from the remote endpoint. This method
         * signals to the server to terminate the HTTP session.</p>
         */
        close: function() {
            if (this.isOpen()) {
                this._sendRequest({type: "terminate"});
            } else {
                this._reset();
            }
        },

        /**
         * <p>Sends the given element to the remote endpoint. This method
         * enques the element to send, which gets processed during the
         * heartbeat.</p>
         *
         * @param   {Element} elem The element to send
         * @throws  {TypeError} is {elem} is not a DOM element
         * @throws  {jabberwerx.Stream.NotOpenError} If this Stream is not open
         */
        send: function(elem) {
            if (!jabberwerx.isElement(elem)) {
                throw new TypeError("elem must be a DOM element");
            }

            if (!this.isOpen()) {
                throw new jabberwerx.Stream.NotOpenError();
            }

            this._sendQ.enque(elem);
        },

        /**
         * @private
         */
        _sendRequest: function(props, data) {
            props = jabberwerx.$.extend({}, this._boshProps, props);
            data = data || [];

            var rid = 0, body;
            var resend = false;
            if (props.resend) {
                rid = props.resend.id;
                body = jabberwerx.util.unserializeXML(props.resend.body);
                resend = true;

                data = jabberwerx.$(body).children();

                props.rid = rid + 1;
                delete props.resend;
            } else {
                if (this._xhrs.size() > 1 && data.length) {
                    this._sendQ.enque(data);
                    return;
                }

                if (!props.rid) {
                    // make sure initial RID is "large"
                    var initial;
                    initial = Math.floor(Math.random() * 4294967296);
                    initial = (initial <= 32768) ?
                              initial + 32768 :
                              initial;
                    props.rid = initial;
                } else if (this._boshProps.rid >= 9007199254740991) {
                    // make sure RID does not exceed limit!
                    var err = new jabberwerx.Stream.ErrorInfo(
                            "{urn:ietf:params:xml:ns:xmpp-streams}policy-violation",
                            "BOSH maximum rid exceeded");
                    this._handleClose(er.getNode());
                    return;
                }
                rid = props.rid++;

                body = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/httpbind}body");
                if (props.type) {
                    body.attribute("type", props.type);
                }

                if (!props.sid) {
                    if (data.length) {
                        // enque until session is established...
                        this._sendQ.enque(data);
                        data = [];
                    }

                    body.attribute("xmlns:xmpp", "urn:xmpp:xbosh").
                         attribute("hold", "1").
                         attribute("ver", "1.9").
                         attribute("from", props.jid).
                         attribute("to", props.domain).
                         attribute("secure", props.secure).
                         attribute("wait", props.wait || 30).
                         attribute("{urn:xmpp:xbosh}xmpp:version", "1.0");
                } else {
                    body.attribute("sid", props.sid);
                    if (props.restart) {
                        body.attribute("{urn:xmpp:xbosh}xmpp:restart", "true").
                             attribute("to", props.domain);
                        this._boshProps.restart = true;
                    }
                }
                body.attribute("rid", rid);

                if (data.length) {
                    for (var idx = 0; idx < data.length; idx++) {
                        body.node(data[idx]);
                    }
                }
                body = body.data;
            }

            if (!props.requests) {
                props.requests = new jabberwerx.Stream.Queue();
            }
            props.requests.enque({
                id: rid,
                body: body.xml
            });
            var setup = {
                async: true,
                data: props.requests.tail().body,
                timeout: props.wait * 1000 + 5000,
                url: props.httpBindingURL
            };

            setup = jabberwerx.$.extend(setup, this._xhrSetup);
            if (this._boshProps) {
                this._boshProps = props;
            }
            if (!resend && data.length) {
                this.event("streamElementsSent").trigger(jabberwerx.$(data));
            }
            var xhr = jabberwerx.$.ajax(setup);
            this._xhrs.enque(xhr);
        },
        /**
         * @private
         */
        _createXHR: function(xhrFn) {
            xhrFn = jabberwerx.$.ajaxSettings.xhr;
            var xhr = null;

            if (this._boshProps.crossSite && typeof(XDomainRequest) != "undefined") {
                var that = this;
                var done = this._boshProps.type == "terminate";
                var xdr = new XDomainRequest();

                // Enough of a XMLHttpRequest-like object for $.ajax
                // to function; proxy to XDomainRequest where we can,
                // no-op where we can't
                var xhr = {
                    readyState: 0,
                    abort: function() {
                        xdr.abort();
                        this.readyState = 0;
                    },
                    open: function() {
                        xdr.open.apply(xdr, arguments);
                        this.readyState = 1;
                        this.onreadystatechange && this.onreadystatechange.call(this);
                        this.async = arguments[2] || true;
                    },
                    send: function() {
                        this.readyState = 2;
                        this.onreadystatechange && this.onreadystatechange.call(this);
                        xdr.send.apply(xdr, arguments);
                    },
                    setRequestHeader: function() {
                        // NOOP
                    },
                    getResponseHeader: function() {
                        // NOOP
                    }
                };

                /**
                 * @private
                 */
                var onreadyCB = function(status) {
                    xhr.onreadystatechange && xhr.onreadystatechange.call(this, status);
                };

                // XDomainRequest callbacks - map back to onreadystatechange
                xdr.onload = function() {
                    xhr.responseText = xdr.responseText;
                    xhr.status = 200;
                    xhr.readyState = 4;
                    onreadyCB();
                };
                xdr.onprogress = function() {
                    xhr.readyState = 3;
                    onreadyCB();
                };
                xdr.onerror = function() {
                    xhr.readyState = 0;
                    xhr.status = 500;   // some sort of server error
                    onreadyCB("error");
                };
                xdr.ontimeout = function() {
                    xhr.readyState = 0;
                    xhr.status = 408;   // timeout
                    onreadyCB("timeout");
                };
            } else {
                xhr = xhrFn();
            }

            return xhr;
        },

        /**
         * @private
         */
        _heartbeat: function() {
            var elems = this._recvQ.empty();
            if (elems.length) {
                elems = jabberwerx.$(elems);
                this.event("streamElementsReceived").trigger(elems);
            }

            if (!this.isOpen() && !this._boshProps.operation) {
                return;
            }
            if (!this._sendQ.size() && this._xhrs.size()) {
                return;
            }
            if (this._boshProps.networkBackoff) {
                this._boshProps.networkBackoff--;
                return;
            }

            this._sendRequest({}, this._sendQ.empty());
        },
        /**
         * @private
         */
        _handleXHR: function(xhr, status) {
            // check for dehydration
            if (this._dehydrated) {
                return;
            }
            this._xhrs.deque(xhr);

            var failFn = function(err, resend) {
                var boshProps = this._boshProps;
                if (!boshProps) {
                    // no BOSH props, nothing to do
                    return;
                }
                if (boshProps.type == "terminate") {
                    // should be finished, nothing to do
                    this._handleClose();
                    return;
                }
                if (boshProps.networkAttempts++ < 3) {
                    jabberwerx.util.debug.log("network timeout retry " +
                            boshProps.networkAttempts);
                    if (resend) {
                        resend = boshProps.requests.deque();
                    }
                    if (resend) {
                        boshProps.resend = resend;
                    }

                    // wait for normal heartbeat, with delay
                    boshProps.networkBackoff = jabberwerx.Stream.NETWORK_BACKOFF_COUNT;
                    return;
                }

                // getting this far means we really did fail
                this._handleClose(err && err.getNode());
            };

            if (status != "success") {
                // network level error!
                var err;

                switch (status) {
                    case "timeout":
                        // server unresponsive...
                        err = jabberwerx.Stream.ERR_REMOTE_SERVER_TIMEOUT;
                        break;
                    case "error":
                        // http error...
                        err = jabberwerx.Stream.ERR_SERVICE_UNAVAILABLE;
                        break;
                    case "parseerror":
                        // not XML...
                        err = jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED;
                        break;
                    default:
                        // really bad...
                        err = jabberwerx.Stream.ERR_UNDEFINED_CONDITION;
                        break;
                }

                failFn.call(this, err, true);
                return;
            }

            // parse the response
            var dom = xhr.responseText;
            if (!dom) {
                // no data == malformed XML
                failFn.call(this, jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED);
                return;
            }
            try {
                dom = jabberwerx.util.unserializeXML(dom);
            } catch (ex) {
                //parse error
                failFn.call(this, jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED);
                return;
            }
            if (!dom) {
                // no data == malformed XML
                failFn.call(this, jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED);
                return;
            }
            dom = jabberwerx.$(dom);
            if (!dom.is("body[xmlns='http://jabber.org/protocol/httpbind']")) {
                failFn.call(this, jabberwerx.Stream.ERR_SERVICE_UNAVAILABLE);
                return;
            }
            this._boshProps.networkAttempts = 0;

            if (this._boshProps && this._boshProps.requests) {
                this._boshProps.requests.deque();
            }

            var content = dom.children();
            if (!this._boshProps.sid) {
                // expecting an initial BOSH body
                var attr;

                attr = dom.attr("sid");
                if (attr) {
                    this._boshProps.sid = attr;
                }

                attr = dom.attr("wait");
                if (attr) {
                    this._boshProps.wait = parseInt(attr);
                }

                attr = dom.attr("inactivity");
                if (attr) {
                    this._boshProps.timeout = parseInt(attr);
                }
            } else if (!this._boshProps.restart && dom.attr("ack")) {
                var rid = this._boshProps.rid - 1;      // adjust for auto increment
                var ack = parseInt(dom.attr("ack"));
                var resend = this._boshProps.requests.find(function(item) {
                    return (item.id == ack) ? item : null;
                });

                var err;
                // ignore ack for current or next rid
                if (rid != ack && (rid + 1) != ack) {
                    if (resend) {
                        jabberwerx.util.debug.log("resending unacknowledged rid " + ack);
                        this._boshProps.requests.deque(resend);
                        this._sendRequest({resend: resend});
                    } else {
                        jabberwerx.util.debug.log("acknowledged rid " + ack +
                                                  " outside accepted window (" +
                                                  rid + ".." + (rid + 1) + ")!");
                        this._handleClose(jabberwerx.Stream.ERR_REMOTE_CONNECTION_FAILED.getNode());
                        return;
                    }
                }
            }

            if (content.length) {
                var feats = null, err = null;

                // filter features and error
                content = content.map(function() {
                    switch (this.nodeName) {
                        case "stream:features":
                            feats = this;
                            break;
                        case "stream:error":
                            err = this;
                            break;
                        default:
                            // retain "sent"
                            return this;
                    }

                    return null;
                });

                if (feats) {
                    // report open, but continue...
                    this._handleOpen(feats);
                }

                if (content.length) {
                    this._recvQ.enque(content.get());
                }

                if (err) {
                    // close and report
                    this._handleClose(err);
                    return;
                }
            }

            var err;
            switch (dom.attr("type") || this._boshProps.type) {
                case "terminate":
                    // should be closed now...
                    if (!this._boshProps.type) {
                        // server-side terminate, probably has an error...
                        switch (dom.attr("condition") || "") {
                            case "":
                                //no error...
                                err = null;
                                break;
                            case "bad-request":
                                err = jabberwerx.Stream.ERR_BAD_REQUEST;
                                break;
                            case "host-gone":
                                err = jabberwerx.Stream.ERR_SERVICE_UNAVAILABLE;
                                break;
                            case "other-request":
                                err = jabberwerx.Stream.ERR_CONFLICT;
                                break;
                            case "policy-violation":
                                err = jabberwerx.Stream.ERR_POLICY_VIOLATION;
                                break;
                            case "system-shutdown":
                                err = jabberwerx.Stream.ERR_SYSTEM_SHUTDOWN;
                                break;
                            case "see-other-uri":
                                // Grab new URI.
                                var uri = dom.children("uri").text();

                                // Validate URI.
                                if (!uri || uri == "")
                                {
                                    err = jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED;
                                    break;
                                }

                                var uriParts = jabberwerx.Stream.URI_PATTERN.exec(uri);

                                var protocol = uriParts[1];
                                var hostPort = uriParts[2];
                                var resource = uriParts[3];

                                var origParts = jabberwerx.Stream.URI_PATTERN.
                                                 exec(this._boshProps.httpBindingURL);

                                var origProtocol = origParts[1];
                                var origHostPort = origParts[2];

                                if (origProtocol == "http:") {
                                    // if 'http', 'protocol' and 'port' must be the same and
                                    // the new host must be the same or a subdomain of the 
                                    // original.
                                    var tmpOrigHostPort = "." + origHostPort;
                                    var tmpHostPort = "." + hostPort;

                                    var diff = tmpHostPort.length - tmpOrigHostPort.length;
                                    var validDomain = diff >= 0 &&
                                        tmpHostPort.lastIndexOf(tmpOrigHostPort) === diff;

                                    if (!((protocol == origProtocol) &&
                                          (validDomain))) {
                                        err = jabberwerx.Stream.ERR_POLICY_VIOLATION;
                                        break;
                                    }
                                } else if (origProtocol == "https:") {
                                    // if 'https', ensure new 'protocol','host' and 'port' are valid.
                                    if ((!protocol || protocol == "") ||
                                        (!hostPort || hostPort == "")) {
                                        err = jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED;
                                        break;
                                    }
                                } else {
                                    err = jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED;
                                    break;
                                }

                                this._storeConnectionInfo(protocol, hostPort, resource);
                                return;
                            default:
                                // blanket error...
                                err = jabberwerx.Stream.ERR_UNDEFINED_CONDITION;
                                break;
                        }
                    }
                    this._handleClose(err && err.getNode());
                    return;
                case "error":
                    break;
            }
        },

        /**
         * @private
         */
        _handleOpen: function(feats) {
            if (this._boshProps.opening) {
                // cancel any pending timeout
                clearTimeout(this._boshProps.opening);
                delete this._boshProps.opening;
            }

            // assume we need to clear the restart flag
            delete this._boshProps.restart;
            // assume the operation completed
            delete this._boshProps.operation;

            if (!jabberwerx.isElement(feats)) {
                // called from timeout...
                // fake stream:features with bind & session-start
                feats = new jabberwerx.NodeBuilder("{http://etherx.jabber.org/streams}stream:features");
                feats.element("{urn:ietf:params:xml:ns:xmpp-bind}bind");
                feats.element("{urn:ietf:params:xml:ns:xmpp-session}session");
                feats = feats.data;
            }

            // flag and report open
            var that = this;
            setTimeout(function() {
                that._opened = true;
                that.event("streamOpened").trigger(feats);
            }, 1);
        },
        /**
         * @private
         * Called to handle the stream closing. This method may be called
         * multiple times, as each pending request completes.
         */
        _handleClose: function(err) {
            // Check to see if we were open before...
            var open = this.isOpen();
            var oper = this._boshProps.operation;

            // clean up (marking stream as !open)
            this._reset();
            if (open || oper) {

                // flag and report open
                var that = this;
                setTimeout(function() {
                    // trigger event if initially open
                    that.event("streamClosed").trigger(err);
                }, 10);
            }
        },

        /**
         * @private
         */
        _reset: function() {
            // cancel heartbeat
            clearInterval(this._boshProps.heartbeat);

            // reset state
            this._opened = false;
            this._boshProps = {};
            this._sendQ.empty();
            this._xhrs.empty();
        },

        /**
         * <p>Called just prior to this stream being serialized. This method
         * converts any pending elements into their XML equivalents, and aborts
         * all pending BOSH requests.</p>
         */
        willBeSerialized: function() {
            this._dehydrated = true;

            if (this.isOpen()) {
                //pause!
                clearInterval(this._boshProps.heartbeat);
            }

            if (this._boshProps) {
                if (this._boshProps.networkAttempts) {
                    // browsers occassionally kill a connection just before dehydration
                    this._boshProps.networkAttempts--;
                }
                //save a backoff to let things settle on rehydrate...
                this._boshProps.networkBackoff = jabberwerx.Stream.NETWORK_BACKOFF_COUNT;
            } 
            var elems;

            // convert all queued sent elements to XML
            elems = this._sendQ.empty();
            elems = jabberwerx.$.map(elems, function() {
                return this.xml;
            });
            this._sendQ.enque(elems);

            // convert all queued received elements to XML
            elems = this._recvQ.empty();
            elems = jabberwerx.$.map(elems, function() {
                return this.xml;
            });
            this._recvQ.empty();

            // forget all pending requests
            delete this._xhrs;
        },
        /**
         * <p>Called just after this stream is unserialized. This method
         * converts any pending XML into their DOM equivalents, and
         * resumes the BOSH request loop if the stream was previously
         * opened.</p>
         */
        wasUnserialized: function() {
            // re-initialize request queue
            this._xhrs = new jabberwerx.Stream.Queue();

            // convert all queued XML to elements
            var elems;
            elems = this._sendQ.empty();
            elems = jabberwerx.$.map(elems, function() {
                return jabberwerx.util.unserializeXML(String(this));
            });
            this._sendQ.enque(elems);

            delete this._dehydrated;

            // TODO: should be moved to "graphUnserialized"??
            if (this.isOpen()) {
                // resume!
                this._boshProps.resend = this._boshProps.requests.deque();
                this._boshProps.heartbeat = setInterval(
                        this.invocation("_heartbeat"),
                        jabberwerx.Stream.HEARTBEAT_INTERVAL);
            }
        },

        /**
         * @private
         */
        _opened: false,
        /**
         * @private
         */
        _boshProps: {},
        /**
         * @private
         */
        _xhrSetup: {},
        /**
         * @private
         */
        _xhrs: null,
        /**
         * @private
         */
        _sendQ: null,
        /**
         * @private
         */
        _recvQ: null,
        /**
         * @ private
         * The node we are connecting to
         * @type String
         */ 
        _connectToNode: null

    }, "jabberwerx.Stream");

    jabberwerx.Stream.Queue = jabberwerx.JWModel.extend(/** @lends jabberwerx.Stream.Queue.prototype */{
        /**
         * @private
         * @class
         * <p>Implementation of a data queue. This class provides convenience
         * methods around a JavaScript array object to better support enquing
         * and dequing items.</p>
         *
         * @description
         * <p>Creates a new Queue.</p>
         *
         * @constructs  jabberwerx.Stream.Queue
         * @extends     JWModel
         */
        init: function() {
            this._super();
        },

        /**
         * Retrieves the first item in this queue, if any.
         *
         * @returns  The first item, or <tt>null</tt> if empty
         */
        head: function() {
            return this._q || null;
        },
        /**
         * Retrieves the last item in this queue, if any.
         *
         * @returns  The last item, or <tt>null</tt> if empty
         */
        tail: function() {
            return this._q[this._q.length - 1] || null;
        },

        /**
         * <p>Adds one or more items to the end of this queue. This method
         * supports a variable number of arguments; each argument provided
         * is appended to the queue.</p>
         *
         * <p>If {item} (or subsequent arguments) is an Array, the elements
         * in that array are appended directly. If an actually array needs
         * to be appended, it must be wrapped with another array:</p>
         *
         * <pre class="code">queue.enque([ anotherArray ]);</pre>
         *
         * @parm    item The item to add to this Queue
         * @returns  {Number} The size of this Queue
         */
        enque: function(item) {
            // NOTE: item is treated as a placeholder
            for (var idx = 0; idx < arguments.length; idx++) {
                item = arguments[idx];
                var tmp = [this._q.length, 0].concat(item);
                this._q.splice.apply(this._q, tmp);
            }

            return this.size();
        },
        /**
         * <p>Removes an item from this queue. If {item} is provided,
         * this method attempts to find and remove it from this Queue.</p>
         *
         * @param   [item] The item to remove from this Queue
         * returns   The removed item, or <tt>null</tt> if this Queue is
         *          unchanged.
         */
        deque: function(item) {
            if (item !== undefined) {
                var idx = jabberwerx.$.inArray(item, this._q);
                if (idx != -1) {
                    this._q.splice(idx, 1);
                } else {
                    item = null;
                }
            } else {
                item = this._q.shift() || null;
            }

            return item;
        },
        /**
         * <p>Locates the first matching item within this Queue.</p>
         *
         * <p>The signature of {cmp} must be the following:</p>
         * <pre class='code'>
         * var cmp = function(item) {
         *      // the current item to determine matches
         *      item;
         *      // return the item that matches
         * }
         * </pre>
         *
         * @param   {Function} cmp The comparison function
         * @returns The matching item, or <tt>null</tt> if none
         */
        find: function(cmp) {
            if (!jabberwerx.$.isFunction(cmp)) {
                throw new TypeError("comparator must be a function");
            }
            var result = null;
            jabberwerx.$.each(this._q, function() {
                result = cmp(this);
                return (result !== undefined);
            });

            return result;
        },
        /**
         * <p>Removes all items from this Queue.</p>
         *
         * @return  {Array} The previous contents of this Queue
         */
        empty: function() {
            var q = this._q;
            this._q = [];

            return q;
        },

        /**
         * <p>Retrieves the current size of this Queue.</p>
         *
         * @return  {Number} The size
         */
        size: function() {
            return this._q.length;
        },

        /**
         * @private
         */
        _q: []
    }, "jabberwerx.Stream.Queue");

    /**
     * @private
     * Pattern to separate URI into protocol, host, port, and path
     *
     * @type RegExp
     */
    jabberwerx.Stream.URI_PATTERN = /^(?:(?:([0-9a-zA-Z]+\:)\/\/)?([0-9a-zA-Z\.\-]+(?:\:[0-9]+)?))?(?:\/(.*))?$/;
    /**
     * @private
     * The default session timeout in seconds (5 minutes).
     *
     * @type    Number
     */
    jabberwerx.Stream.DEFAULT_TIMEOUT = 300;
    /**
     * @private
     * The default polling wait in seconds (30 seconds).
     *
     * @type    Number
     */
    jabberwerx.Stream.DEFAULT_WAIT = 30;

    /**
     * @private
     * The heartbeat interval in milliseconds (10 milliseconds)
     */
    jabberwerx.Stream.HEARTBEAT_INTERVAL = 10;
    /**
     * @private
     * The number of intervals to delay in case of network trouble.
     * The total delay is HEARTBEAT_INTERVAL * NETWORK_BACKOFF_COUNT
     */
    jabberwerx.Stream.NETWORK_BACKOFF_COUNT = 50;

    /**
     * @class jabberwerx.Stream.NotOpenError
     * <p>Error thrown if the Stream must be open for the method to
     * complete.</p>
     * @description
     * <p>Creates a new NotOpenError with the given message.</p>
     * @constructs jabberwerx.Stream.NotOpenError
     * @extends jabberwerx.util.Error
     * @minimal
     */
    jabberwerx.Stream.NotOpenError = jabberwerx.util.Error.extend("Stream not open");
    /**
     * @class jabberwerx.Stream.AlreadyOpenError
     * <p>Error thrown if the Stream must NOT be open for the method to
     * complete.</p>
     * @description
     * <p>Creates a new AlreadyOpenError with the given message.</p>
     * @constructs jabberwerx.Stream.AlreadyOpenError
     * @extends jabberwerx.util.Error
     * @minimal
     */
    jabberwerx.Stream.AlreadyOpenError = jabberwerx.util.Error.extend("Stream is already open");

    jabberwerx.Stream.ErrorInfo = jabberwerx.JWModel.extend(/** @lends jabberwerx.Stream.ErrorInfo.prototype */{
        /**
         * @class
         * <p>Representation of stream error information.</p>
         *
         * @description
         * <p>Creates a new ErrorInfo with the given information.</p>
         * @extends JWModel
         * @constructs jabberwerx.Stream.ErrorInfo
         * @param   {String} [cond] The error condition
         * @param   {String} [text] The error text description
         * @minimal
         */
        init: function(cond, text) {
           this._super();

           this.condition = cond || "{urn:ietf:params:xml:ns:xmpp-streams}undefined-condition";
           this.text = text || "";

           this.toString = this._toErrString;
        },

        /**
         * <p>Retrieves the element for this ErrorInfo. The returned element
         * is as follows:</p>
         *
         * <pre class="code">
         *  &lt;stream:error xmlns:stream="http://etherx.jabber.org/streams"&gt;
         *      &lt;{condition-local-name} xmlns="urn:ietf:params:xml:ns:xmpp-streams"/&gt;
         *      &lt;text xmlns="urn:ietf:params:xml:ns:xmpp-streams"&gt;{text}&lt;/text&gt;
         *  &lt;/error&gt;
         * </pre>
         *
         * @returns  {Element} The DOM representation
         */
        getNode: function() {
            var builder = new jabberwerx.NodeBuilder("{http://etherx.jabber.org/streams}stream:error");
            builder.element(this.condition);
            if (this.text) {
                builder.element("{urn:ietf:params:xml:ns:xmpp-streams}text").
                        text(this.text);
            }

            return builder.data;
        },

        /**
         * <p>Called after this object is rehydrated. This method sets the toString
         * method as expected.</p>
         */
        wasUnserialized: function() {
            // IE work-around
            this.toString = this._toErrString;
        },

        /**
         * @private
         */
        _toErrString: function() {
            return this.condition;
        },

        /**
         * <p>The condition of this ErrorInfo.</p>
         * @type   String
         */
        condition: "",
        /**
         * <p>The descriptive text for this ErrorInfo.</p>
         * @type   String
         */
        text: ""
    }, "jabberwerx.Stream.ErrorInfo");

    /**
     * <p>Creates a ErrorInfo based on the given node.</p>
     *
     * @param   {Element} node The XML &lt;error/&gt;
     * @returns  {jabberwerx.Stream.ErrorInfo} The ErrorInfo
     * @throws  {TypeError} If {node} is not an element
     */
    jabberwerx.Stream.ErrorInfo.createWithNode = function(node) {
        if (!jabberwerx.isElement(node)) {
            throw new TypeError("node must be an Element");
        }
        node = jabberwerx.$(node);
        var cond = node.
                children("[xmlns=urn:ietf:params:xml:ns:xmpp-streams]:not(text)").
                map(function() {
                    return "{urn:ietf:params:xml:ns:xmpp-streams}" + this.nodeName;
                }).get(0);
        var text = node.
                children("text[xmlns=urn:ietf:params:xml:ns:xmpp-streams]").
                text();

        // TODO: search for known errors first?
        return new jabberwerx.Stream.ErrorInfo(cond, text);
    };
    
    /**
     * <p>ErrorInfo for a bad request error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_BAD_REQUEST = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}bad-request");
    /**
     * <p>ErrorInfo for a conflict error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_CONFLICT = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}conflict");
    /**
     * <p>ErrorInfo for a policy violation error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_POLICY_VIOLATION = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}policy-violation");
    /**
     * <p>ErrorInfo for a remote connection error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_REMOTE_CONNECTION_FAILED = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}remote-connection-failed");
    /**
     * <p>ErrorInfo for a remote server timeout error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_REMOTE_SERVER_TIMEOUT = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}remote-server-timeout");

    /**
     * <p>ErrorInfo for a service unavailable error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_SERVICE_UNAVAILABLE = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}service-unavailable");
    /**
     * <p>ErrorInfo for a system shutdown error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_SYSTEM_SHUTDOWN = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}system-shutdown");
    /**
     * <p>ErrorInfo for a service unavailable error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_UNDEFINED_CONDITION = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}undefined-condition");
    /**
     * <p>ErrorInfo for a malformed xml error.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_XML_NOT_WELL_FORMED = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}xml-not-well-formed");
    /**
     * <p>ErrorInfo for a policy violation.</p>
     *
     * @type    jabberwerx.Stream.ErrorInfo
     */
    jabberwerx.Stream.ERR_POLICY_VIOLATION = new jabberwerx.Stream.ErrorInfo(
            "{urn:ietf:params:xml:ns:xmpp-streams}policy-violation");
}


/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Client.js*/
/**
 * filename:        Client.js
 * created at:      2009/00/00T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

    if (jabberwerx) {
        jabberwerx.ClientEntityCache = jabberwerx.EntitySet.extend(/** @lends jabberwerx.ClientEntityCache.prototype */ {
            /**
             * @class
             * <p>The client's collection of entities. This is the central
             * repositories for entities within a client.</p>
             *
             * <p>
             * This class provides the following events:
             * <ul>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.EntitySet">jabberwerx.EntitySet</a></li>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.EntitySet_Cache">jabberwerx.EntitySet Cache</a></li>
             * </ul>
             *
             * @description
             *
             * @extends jabberwerx.EntitySet
             * @constructs jabberwerx.GlobalEntityCache
             * @minimal
             */
            init: function() {
                this._super();
            },

			/**
             * Registers the given entity to this cache. This method
             * overrides the base class to:</p>
             *
             * <ol>
             * <li>Validate that another entity matching {entity} is not
             * already registered (throwing a
             * {@link jabberwerx.EntitySet.EntityAlreadyExistsError}).</li>
             * <li>trigger the "entityCreated" event if this cache was changed
             * as a result of this call</li>
             * </ol>
             * @param {jabberwerx.Entity} entity The entity to register
             *
             */
            register: function(entity) {
                if (!(entity && entity instanceof jabberwerx.Entity)) {
                    throw new TypeError("entity is not an Entity");
                }

                var prev = this.entity(entity.jid, entity.node);
                if (prev && prev !== entity) {
                    throw new jabberwerx.EntitySet.EntityAlreadyExistsError();
                } else if (!prev) {
                    this.event("entityCreated").trigger(entity);
                }

                return this._super(entity);
            },
            /**
             * Unregisters the given entity from this cache. This method
             * overrides the base class to trigger the "entityDestroyed" event.
             *
             * @param {jabberwerx.Entity} entity The entity to unregister
             */
            unregister: function(entity) {
                var result = this._super(entity);
                if (result) {
                    this.event("entityDestroyed").trigger(entity);
                }

                return result;
            },
            
            
            /**
             * Factory method for {@link jabberwerx.LocalUser} objects. If a local object for
             * the passed JID already exists, that object is returned instead of a new object.
             *
             * @param {jabberwerx.JID|String} jid The JID for this user.
             * @returns {jabberwerx.LocalUser} A LocalUser for the given arguments
             * @throws  {TypeError} if {jid} is not a valid JID
             * @throws  {jabberwerx.EntitySet.EntityAlreadyExistsError} if an
             *          entity for {jid} already exists, but is not a LocalUser
             */
            localUser: function(jid) {
                var ent = this.entity(jid);
                if (!(ent && ent instanceof jabberwerx.LocalUser)) {
                    ent = new jabberwerx.LocalUser(jid, this);
                    this.register(ent);
                }

                return ent;
            },
            /**
             * Factory method for {@link jabberwerx.Server} objects. If a local object for
             * the passed JID already exists, that object is returned instead of a new object.
             *
             * @param {String} serverDomain The domain for this server, eg, "jabber.com".
             * @returns {jabberwerx.Server} A Server for the given arguments
             * @throws  {TypeError} if serverDomain is not a valid JID
             * @throws  {jabberwerx.EntitySet.EntityAlreadyExistsError} if an
             *          entity for {serverDomain} already exists, but is not a
             *          Server.
             */
            server: function(serverDomain) {
                var ent = this.entity(serverDomain);
                if (!ent || !(ent instanceof jabberwerx.Server)) {
                    ent = new jabberwerx.Server(serverDomain, this);
                    this.register(ent);
                }

                return ent;
            },
            /**
             * Factory method for {@link jabberwerx.TemporaryEntity} objects. If a local object for
             * the passed JID already exists, that object is returned instead of a new object.
             *
             * @param {jabberwerx.JID|String} jid The JID of the temporary entity object to get or create.
             * @returns {jabberwerx.TemporaryEntity} A TemporaryEntity for the
             *          given JID
             * @throws  {TypeError} if {jid} is not a valid JID
             * @throws  {jabberwerx.EntitySet.EntityAlreadyExistsError} if an
             *          entity for {jid} already exists, but is not a
             *          TemporaryEntity
             */
            temporaryEntity: function(jid) {
                var ent = this.entity(jid);
                if (!(ent && ent instanceof jabberwerx.TemporaryEntity)) {
                    ent = new jabberwerx.TemporaryEntity(jid, this);
                    this.register(ent);
                }

                return ent;
            }
        }, "jabberwerx.ClientEntityCache");

  		jabberwerx.Client = jabberwerx.JWModel.extend(/** @lends jabberwerx.Client.prototype */{
            /**
             * @class
             * <p>The role of the Client is to provide an interface to the XMPP protocol.
             * It sends and recieves communication over its connection on behalf of any
             * other model objects.</p>
             *
             * <p>
             * This class provides the following events:
             * <ul>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.Client">jabberwerx.Client</a></li>
             * </ul>
             *
             * @description
             * <p>Creates a new Client with the given (optional) resource. If
             * {resourceName} is omitted, the client will rely on the XMPP/BOSH
             * service to provide an appropriate value upon connection.</p>
             *
             * @param {String} [resourceName] the client resource name to use.
             *
             * @constructs jabberwerx.Client
             * @extends jabberwerx.JWModel
             * @minimal
             */
            init: function(resourceName) {
                this._super();

                //Events
                this.applyEvent('clientStatusChanged');

                this.applyEvent('beforeIqSent');
                this.applyEvent('iqSent');
                this.applyEvent('beforeIqReceived');
                this.applyEvent('iqReceived');
                this.applyEvent('afterIqReceived');

                this.applyEvent('beforeMessageSent');
                this.applyEvent('messageSent');
                this.applyEvent('beforeMessageReceived');
                this.applyEvent('messageReceived');
                this.applyEvent('afterMessageReceived');

                this.applyEvent('beforePresenceSent');
                this.applyEvent('presenceSent');
                this.applyEvent('beforePresenceReceived');
                this.applyEvent('presenceReceived');
                this.applyEvent('afterPresenceReceived');

                this.applyEvent('reconnectCountdownStarted');
                this.applyEvent('reconnectCancelled');

                this.entitySet = new jabberwerx.ClientEntityCache();
                
                  if (resourceName && typeof resourceName == 'string') {
                    this.resourceName = resourceName;
                }
                else{
                    this._autoResourceName = true;
                }

                this._stream = new jabberwerx.Stream();

                //handle iq:version, time
                with (this.event('afterIqReceived')) {
                    bindWhen('iq[type="get"] *[xmlns="urn:xmpp:time"]',
                             this.invocation('_handleEntityTime'));
                    bindWhen('iq[type="get"] *[xmlns="jabber:iq:time"]',
                             this.invocation('_handleIqTime'));
                }

                // _handlePresenceIn will be called for all presence stanzas with no type or type unavailable
                this.event('presenceReceived').bind(this.invocation('_handlePresenceIn'));
                //this.event("presenceSent").bind(this.invocation("_handlePresenceOut"));
            },
            /**
             * Destroys this client. This method walks through all of the controllers,
             * destroying them.
             */
             destroy: function() {
                jabberwerx.$.each(this.controllers, function() {
                    this.destroy();
                });
                this._super();
             },

            /**
             * @private
             */
            _setStreamHandler: function(evt, funcName) {
                this._clearStreamHandler(evt);
                this._streamHandlers[evt] = funcName;
                this._stream.event(evt).bind(this.invocation(this._streamHandlers[evt]));
            },

            /**
             * @private
             */
            _clearStreamHandler: function(evt) {
                if (this._streamHandlers[evt] !== undefined) {
                    this._stream.event(evt).unbind(this.invocation(this._streamHandlers[evt]));
                    delete this._streamHandlers[evt];
                }
            },

            /**
             * @private
             */
            _clearStreamHandlers: function() {
                this._clearStreamHandler('streamOpened');
                this._clearStreamHandler('streamClosed');
                this._clearStreamHandler('streamElementsReceived');
                this._clearStreamHandler('streamElementsSent');
                this._streamHandlers = {};
            },

			 /**
             * <p>Connect to the XMPP server. the value of {arg} is expected to
             * be an object with any of the following properties:</p>
             *
             * <table>
             * <tr><th>Name</th><th>Type</th><th>Description</th></tr>
             * <tr><td>httpBindingURL</td><td>String</td><td>URL for BOSH
             * connection</td></tr>
             *<tr><td>httpBindingURL_secondary</td><td>String</td><td>The secondary/backup URL for BOSH
             * connection</td></tr>
             *<tr><td>serviceDiscoveryEnabled</td><td>Boolean</td><td>The flag to indicate whether the 
             * service discovery is on or off on the client.</td></tr>
             * <tr><td>successCallback</td><td>Function</td><td>Called when
             * the client successfully connects. It is expected to have the
             * following signature:
             * <div><pre class="code">
             * function success() {
             *    this; //The client
             * }
             * </pre></div></td></tr>
             * <tr><td>errorCallback</td><td>Function</td><td>Called when
             * the client fails to connect. It is expected to have the
             * following signature:
             * <div><pre class="code">
             * function failed(err) {
             *    this; //The client
             *    err;  //An object describing the error
             * }
             * </pre></div></td></tr>
             * </table>
             *
             * @param {jabberwerx.JID|String} jid The JID to connect to the
             *        XMPP server. If anonymous login is required, only specify 
             *        the domain as the jid i.e. "example.com"
             * @param {String} [password] The password for the given JID. If using anonymous login
             *        (i.e. the domain is passed as the jid value) the password argument is optional.
             * @param {Object} arg Object containing the arguments to connect with.
             */
     			connect: function(jid, password, arg) {
                // notes the method is running
                // would not be necessary if we had real multi-threading
                var inProgress = arguments.callee.inProgress || {};
                if (inProgress[this]) {
                    // DEBUG-BEGIN
                    jabberwerx.util.debug.log("client.connect already in progress!");
                    // DEBUG-END
                    return;
                }
                inProgress[this] = true;
                arguments.callee.inProgress = inProgress;
                
                //helper function to create user/server entites as needed, maintains entitycache 
                //integrety by deleting invalid refs
                var __createEntities = function(client) {
                    var user;
                    jabberwerx.$.each(client.entitySet.toArray(), function() {
                        if (this instanceof jabberwerx.LocalUser) {
                            if (client._connectParams.jid.equals(this.jid)) {
                                user = this;
                            } else {
                                this.remove();
                            }
                        }
                    });
                    client.connectedUser = user ||
                                         client.entitySet.localUser(client._connectParams.jid);

                    // Locate server for {domain}, clearing all others
                    var server;
                    jabberwerx.$.each(client.entitySet.toArray(), function() {
                        if (this instanceof jabberwerx.Server) {
                            if (client._connectParams.jid.getDomain() == this.jid.getDomain()) {
                                server = this;
                            } else {
                                this.remove();
                            }
                        }
                    });
                    client.connectedServer = server || 
                        client.entitySet.server(client._connectParams.jid.getDomain());
                }
                
                //bind connect success and error callbacks to approriate events
                var __bindCallbacks = function(client) {
                    var successCB = client._connectParams.arg.successCallback;
                    var errorCB = client._connectParams.arg.errorCallback;
                    if (successCB || errorCB) {
                        var fn = function(evt) {
                            var evtCon = (evt.data.next == jabberwerx.Client.status_connected);
                            var evtDiscon = (evt.data.next == jabberwerx.Client.status_disconnected);
                            if (evtCon || evtDiscon) {
                                client.event('clientStatusChanged').unbind(fn);
                                if (successCB && evtCon) {
                                    successCB(client);
                                } else if (errorCB && evt.data.error && evtDiscon) {
                                    errorCB(evt.data.error);
                                }
                            }
                        };
                        client.event('clientStatusChanged').bind(fn);
                    }
                }
                
                //bail if not disconnected.
                if (this.clientStatus != jabberwerx.Client.status_disconnected) {
                    // DEBUG-BEGIN
                    jabberwerx.util.debug.log("client not disconnected!");
                    // DEBUG-END
                    delete inProgress[this];
                    return;
                }
                
                if (!arg) { arg = {}; }
                
                // Cancel a reconnect countdown if one was in progress
                this.cancelReconnect();
                this._clearStreamHandlers(); //there can be only one... set of handlers
                this._stream.close();        //make sure it's really really closed!

                // Store parameters for reconnect if required
                try {
                    var cjid = jabberwerx.JID.asJID(jid);
                    
                    // No jid nodename provided ... anonymous login required
                    if ( !cjid.getNode() ) {
                        
                        // set flag for in-band registration
                        arg.register = true;
                        
                        // create a new jid using a random node name
                        cjid = new jabberwerx.JID({
                                                    domain: cjid.getDomain(),
                                                    node: "CAXL_" + jabberwerx.util.crypto.generateUUID()
                        });
                        
                        // create a random password if required
                        if ( !password ) {
                            password = jabberwerx.util.crypto.b64_sha1(jabberwerx.util.crypto.generateUUID());
                        }
                    }
 				  this._connectParams = {
                        jid: cjid,
                        password: password,
                        username: cjid.getNode(),
                        domain: cjid.getDomain(),
                        resource: this.resourceName,
                        // be sure to remember the correct httpBindingURL
                        httpBindingURL: arg.httpBindingURL || jabberwerx._config.httpBindingURL,
                        httpBindingURL_secondary: arg.httpBindingURL_secondary || jabberwerx._config.httpBindingURL_secondary,
                        sdEnabled: arg.serviceDiscoveryEnabled || jabberwerx._config.serviceDiscoveryEnabled,
                        secure: arg.unsecureAllowed || jabberwerx._config.unsecureAllowed || false,
                        timeout: arg.timeout || null,
                        wait: arg.wait || null,                             
                        arg: arg
                    };
                      
                    var stringJID = cjid.getBareJIDString();
                    var cachedUserHomeNode = null;
                    var cachedUserBackupNode = null;
                    if (this._connectParams.sdEnabled) {
                        cachedUserHomeNode = this._getNodeInfo('_jw_store_.cup.sd.home.'+ stringJID);
                        cachedUserBackupNode = this._getNodeInfo('_jw_store_.cup.sd.backup.'+ stringJID);
                        //Adding logging
                        jabberwerx.util.debug.log("User home node is : " + this._userSDInfo.home);
                        jabberwerx.util.debug.log("_connectSecondaryBindingURL= " + this._connectSecondaryBindingURL);
                        jabberwerx.util.debug.log("Stored home node is : " + cachedUserHomeNode);
                        jabberwerx.util.debug.log("Stored backup node is : " + cachedUserBackupNode);
                        jabberwerx.util.debug.log("_connectToNode node is : " + this._stream._connectToNode);
                        if(!this._connectParams.arg.reconnecting ){
                           //first connect, initialize _candidateNodes
                           jabberwerx.util.debug.log("Initializing candidate nodes array.");
                           this._candidateNodes = [];
                           if(cachedUserHomeNode){
                       	      this._candidateNodes[0] = cachedUserHomeNode;
                       	      this._stream._connectToNode = this._candidateNodes[0];//always try the home node first
                       	      if(cachedUserBackupNode){
                       	         this._candidateNodes[1] = cachedUserBackupNode;
                       	      }
                           }
                       }
                   }else {
                	 jabberwerx.util.debug.log("Note: Service discovery is disabled on the client.");
                   }
                    
				  this._openStream();
                    //create entities, callback bindings after stream open request
                    //auth/unknown stream exceptions will be handled through status_disconnected from here
                    //ensure exactly one localuser and server are in entity cache
                    //create entities, callback bindings
                    __createEntities(this);
                    //bind any callbacks to appropriate client events 
                    __bindCallbacks(this);
                    //finally change staus to reconnecting/connecting
                    if (this._connectParams.arg.reconnecting) {
                        this.setClientStatus(jabberwerx.Client.status_reconnecting);
                        this._connectParams.arg.reconnecting = false;
                    } else {
                        this.setClientStatus(jabberwerx.Client.status_connecting);
                    }
                    
                    this._connectionAttempts++;
                } catch (ex) {
                    // configuration problem
                    this._connectParams = {}; //clear apparntly bad connect info
                    throw new jabberwerx.Client.ConnectionError(ex.message || 'invalid connection information');                    
                } finally {
                    delete inProgress[this];
                }
            },
            
			/**
             * @private
             */
            _openStream: function() {
                //if in-band registration is required, do that before authorization
                if (this._connectParams.arg.register) {
                    this._setStreamHandler('streamOpened','_handleRegistrationOpened');
                } else if(this._connectParams.sdEnabled) {
                    this._setStreamHandler('streamOpened','_serviceDiscoveryOpened');
                } else {
                	this._setStreamHandler('streamOpened','_handleAuthOpened');
                }
                this._setStreamHandler('streamClosed','_handleClosed');
                
                //pass only what stream needs to open, ie not password or anything else we want to obfuscate
                var streamOpts = {
                    jid: this._connectParams.jid.getBareJIDString(),
                    domain: this._connectParams.domain,
                    timeout: this._connectParams.timeout,
                    wait: this._connectParams.wait,
                    secure: this._connectParams.secure,
                    httpBindingURL: (this._connectSecondaryBindingURL) ? this._connectParams.httpBindingURL_secondary : this._connectParams.httpBindingURL,
                    homeNode:  this._userSDInfo.home || this._candidateNodes[0]
                }
                try {
                    this._stream.open(streamOpts);                
                } catch (ex) {
                    //need to cleanup here, nothing else will
                    this._clearStreamHandlers();
                    throw ex;
                }
            },
            
            /**
             * @private
             */
            _serviceDiscoveryOpened: function(feats)  {

               try {
                   //connected, so reset _connectSecondaryBindingURL
                   this._connectSecondaryBindingURL = false;
                   this._candidateNodes =[];//cleanup the candidate nodes array
                   this._clearStreamHandler('streamOpened');
                   this._connectParams.feats = jabberwerx.$(feats.data);
                        
                    //check for the home and backup node
                    var nodes = [];
                    var jidString =this._connectParams.jid.getBareJIDString();
                    jabberwerx.$(feats.data).find("mechanisms[xmlns='urn:ietf:params:xml:ns:xmpp-sasl']>hostname").each(
                        function() {
                            nodes.push(jabberwerx.$(this).text());
                        });
                    if(nodes.length==0){
                       //Server HA is disabled or User is unassigned or Server is running a pre CUP8.5 version & does not support HA
                       jabberwerx.util.debug.log("No user's home and backup node returned from server, this might be caused by \
                                                 1) CUP Server is running a pre CUP 8.5 version & does not support High Availability or \
                                                 2) High Availability may be disabled on the cluster or \
                                                 3) User is not assigned to a node within the subcluster.");
                       //no home/backup node returned, reset the home/backup node value to null.
                       this._userSDInfo = {home:null, backup:null};
                       this._removeNodeInfo('_jw_store_.cup.sd.home.'+jidString);
                       this._removeNodeInfo('_jw_store_.cup.sd.backup.'+jidString);
                       //Just carry on
                       this._handleAuthOpened(feats);
                    }
                    else {
                       this._userSDInfo.home = nodes[0];
                       this._storeNodeInfo('_jw_store_.cup.sd.home.'+jidString, this._userSDInfo.home);
                       if (nodes[1]){
                          this._userSDInfo.backup = nodes[1];
                          this._storeNodeInfo('_jw_store_.cup.sd.backup.'+jidString, this._userSDInfo.backup);
                       } else {
                       	  this._userSDInfo.backup = null;
                       	  this._removeNodeInfo('_jw_store_.cup.sd.backup.'+jidString);
                       }
                      
                       jabberwerx.util.debug.log("User [" + jidString + "]'s home node is " + this._userSDInfo.home +" and backup node is " + this._userSDInfo.backup);

                       if (this._connectedRightNode()){
                           jabberwerx.util.debug.log("Connected with the right node [" + this._stream._connectToNode + "].");
                           this._handleAuthOpened(feats);
                       }
                       else {
                           this._clearStreamHandlers();
                           //reset the stream
                           this._stream.close();
                           this._stream._connectToNode = this._userSDInfo.home;
                           //connect to user's home node
                           jabberwerx.util.debug.log("Now connecting to home node [" + this._stream._connectToNode + "].");
                           //just in case home node is down after service discovery
                           if (this.clientStatus == jabberwerx.Client.status_connecting && this._userSDInfo.backup){
                           	   //add home and backup node to the _canidateNodes array
                           	   this._candidateNodes[0] = this._userSDInfo.home;
                           	   this._candidateNodes[1] = this._userSDInfo.backup;
                           }
                           setTimeout(this.invocation('_openStream'),1000);
                       }
                    }
               }catch (ex) {
                   this._handleConnectionException(ex);
               }
            },
           
           /**
             * @private
             * True if the connectToNode is one of user's home node and backup node.
             */
            _connectedRightNode: function(){
              var home = this._switchHost(this._connectParams.httpBindingURL,this._userSDInfo.home);
              var backup = this._switchHost(this._connectParams.httpBindingURL,this._userSDInfo.backup);
              return this._stream._connectToNode && (this._stream._connectToNode == home || this._stream._connectToNode == backup);
            },
           /**
             * @private
             * Store user's home/backup node
             */
            _storeNodeInfo: function(key, value){
				if (!jabberwerx.$.jStore || !jabberwerx.$.jStore.isReady || !jabberwerx.$.jStore.CurrentEngine.isReady) {
					throw new jabberwerx.util.JWStorageRequiresjQueryjStoreError();
				}
				// Hack: When the data saved is of format IP Address, we get exceptions when reading its saved value. So adding a prefix here.
				jabberwerx.util.debug.log('Store: (key, value) = (' + key + ','+"caxl::"+value+')');
				jabberwerx.$.jStore.store(key,"caxl::"+value);
           },
           	              /**
             * @private
             * Remove user's home/backup node
             */
            _removeNodeInfo: function(key){
				if (!jabberwerx.$.jStore || !jabberwerx.$.jStore.isReady || !jabberwerx.$.jStore.CurrentEngine.isReady) {
					throw new jabberwerx.util.JWStorageRequiresjQueryjStoreError();
				}
				jabberwerx.util.debug.log('Remove: (key) = (' + key + ')');
				jabberwerx.$.jStore.remove(key);
           },
           /**
             * @private
             * Get stored user's home/backup node
             * @return {String|null} node info or null if no value was found in storage for the provided key. 
             */
            _getNodeInfo: function(key){
				if (!jabberwerx.$.jStore || !jabberwerx.$.jStore.isReady || !jabberwerx.$.jStore.CurrentEngine.isReady) {
					throw new jabberwerx.util.JWStorageRequiresjQueryjStoreError();
				}
				
				var nodeInfo = jabberwerx.$.jStore.store(key);
				
				if(typeof(nodeInfo) == "string")
					return nodeInfo.substring(6,nodeInfo.length);
				return null;
     	   },
           /**
             * @private
             * Get next connect to node 
             */
            _getNextConnectToNode: function(){
           	  var node = this._stream._connectToNode;
           	  if(node == this._switchHost(this._connectParams.httpBindingURL,this._userSDInfo.home)){
           	  	  if(this._userSDInfo.backup){
           	  	  	  node = this._userSDInfo.backup;
           	  	  }
           	  }else if (node == this._switchHost(this._connectParams.httpBindingURL,this._userSDInfo.backup)){
           	  	  node = this._userSDInfo.home;
           	  }
             return node;
     	   },            
            /**
             * @private
             */
            _handleRegistrationOpened: function()  {
                try {
                    //remove this handler one time stream open event handler
                    this._clearStreamHandler('streamOpened');

                    // build iq stanza to register
                    var registerIQ = new jabberwerx.IQ();
                    registerIQ.setType("set");
                    registerIQ.setID("register");
                        
                    var builder = new jabberwerx.NodeBuilder('{jabber:iq:register}query');
                    builder = builder.element("username").
                        text(this._connectParams.username).
                        parent;
                    builder = builder.element("password").
                        text(this._connectParams.password).
                        parent;
                    registerIQ.setQuery(builder .data);

                    //bind inband registration handler to stream element received event
                    this._setStreamHandler('streamElementsReceived', '_handleRegisterElements');
                    this._stream.send(registerIQ.getNode());                     
                } catch (ex) {
                    this._handleConnectionException(ex);                    
                }            
            },
			            
            /**
             * @private
             */
            _handleRegisterElements: function(elem) {
                try{
                    //remove this handler
                    this._clearStreamHandler('streamElementsReceived');
                    
                    //check for errors
                    var errNode = jabberwerx.$(elem.data).find("error");
                    if (errNode && errNode.length != 0) {
                        //clear the in-band registration flag
                        this._connectParams.arg.register = false;
                        //handle any errors found
                        this._handleConnectionException(errNode);
                    }
                    else{
                        //in-band registartion successful ... reset the stream
                        this._stream.close();
                    }
                
                } catch (ex) {
                    this._handleConnectionException(ex);
                }
            },
            
            /**
             * @private
             */
            _handleAuthOpened: function(feats) {
                try {
                    //remove this handler one time stream open event handler
                    this._clearStreamHandler('streamOpened');

                    //setup our sasl client
                    this._connectParams.feats = jabberwerx.$(feats.data);
                        
                    //check for sasl auth support
                    var supportedMechs = []
                    //""
                    jabberwerx.$(feats.data).find("mechanisms[xmlns='urn:ietf:params:xml:ns:xmpp-sasl']>mechanism").each(
                        function() {
                            supportedMechs.push(jabberwerx.$(this).text().toUpperCase());
                        });
                        
                    //match mech
                    this._authMech = jabberwerx.sasl.createMechanismFor(this, supportedMechs);
                    if (!this._authMech) {
                        throw new jabberwerx.Client.ConnectionError("{urn:ietf:params:xml:ns:xmpp-sasl}mechanism-too-weak");
                    }
                    //bind sasl auth handler stream element received event
                    this._setStreamHandler('streamElementsReceived', '_handleAuthElements');
                    this._handleAuthElements(); //start sasl
                } catch (ex) {
                    this._handleConnectionException(ex);                    
                }
            },
            
            /**
             * @private
             */
            _handleAuthElements: function(elem) {
                try {
                    elem = elem && jabberwerx.$(elem.data).get(0); //node as saslmech and stream expect a node
                    elem = this._authMech.evaluate(elem);
                    if (elem) {
                        this._stream.send(elem);
                    } else {
                        var authComplete = this._authMech.complete;
                        this._authMech = undefined;
                        delete this._authMech;
                        
                        if (!authComplete) {
                            throw new jabberwerx.SASLMechanism.SASLAuthFailure();
                        } else {
                            //reopen for binding
                            this._setStreamHandler('streamOpened', '_handleBindOpened');
                            this._stream.reopen();
                        } 
                    }
                } catch (ex) {
                    this._handleConnectionException(ex);
                }
                return true;
            },
            
            /**
             * @private
             */
            _handleBindOpened: function(feats) {
                try {
                    //remove this one time stream open event handler
                    this._clearStreamHandler('streamOpened');                
                    //setup for session  start
                    this._connectParams.bindJID = null;
                    feats = jabberwerx.$(feats.data);//cheesy copy
                    this._connectParams.feats = feats; //keep these around to check for session later
                    
                    if (feats.find("bind[xmlns='urn:ietf:params:xml:ns:xmpp-bind']").length > 0) {
                        var bindIQ = new jabberwerx.IQ();
                        bindIQ.setType("set");
                        bindIQ.setID("resource-bind");
                        
                        var builder = new jabberwerx.NodeBuilder('{urn:ietf:params:xml:ns:xmpp-bind}bind');
                        // resourceName exists ... use it for binding
                        if (this.resourceName) {
                            builder = builder.element("resource").
                                    text(this._connectParams.resource).
                                    parent;
                        }
                        bindIQ.setQuery(builder.data);
                        
                        this._setStreamHandler("streamElementsReceived", "_handleBindElements");
                        this._stream.send(bindIQ.getNode());
                        this._bindResourceTimer = setTimeout(this.invocation("_handleBindTimeout"), ((jabberwerx._config.bindRetryCountdown <= 0)? 30 : jabberwerx._config.bindRetryCountdown)* 1000);                    
                    } else {
                    	  this._handleConnected();
                    }
                } catch (ex) {
                    this._handleConnectionException(ex);
                }
            },
            
            /**
             * @private
             */
            _handleBindElements: function(elements) {
                try {
                    //clear bind timer
                    clearTimeout(this._bindResourceTimer);
                    var ele = jabberwerx.$(elements.data);
                    //setup for session set
                    var newjid = ele.find("bind>jid");
                    if (newjid.length > 0) {
                        this._connectParams.bindJID = jabberwerx.$(newjid).text();
                        // resourceName MUST always be whatever the server has specified
                        // extract the resource name of the new jid ... store resource name
                        var jid = jabberwerx.JID.asJID(this._connectParams.bindJID);
                        this.resourceName = jid.getResource();                             

                        if (this._connectParams.feats.find("session[xmlns='urn:ietf:params:xml:ns:xmpp-session']").length > 0) {
                            var sessIQ = new jabberwerx.IQ();
                            sessIQ.setType("set");
                            sessIQ.setID("session");
                            sessIQ.setQuery(
                                new jabberwerx.NodeBuilder('{urn:ietf:params:xml:ns:xmpp-session}session').data
                            );
                        
                            this._setStreamHandler('streamElementsReceived','_handleSessionElements');
                            this._stream.send(sessIQ.getNode());
                        } else {
                           this._handleConnected();
                        }
                    } else {
                        this._handleConnectionException(ele.children("error").get(0));
                    }
                } catch (ex) {
                    this._handleConnectionException(ex);
                }
            },
            
            /**
             * @private
             */
            _handleSessionElements: function(elements) {
                try {
                    var ele = jabberwerx.$(elements.data);
                    if (ele.attr("type") == "result") {
                        this._handleConnected();
                    } else {
                        this._handleConnectionException(ele.children("error").get(0));
                    }
                } catch (ex) {
                    this._handleConnectionException(ex);
                }
            },
            
            /**
             * @private
             * Reopen the stream if the bind resource timeout
             */
           _handleBindTimeout: function() {
           	   //time out reopen the stream
           	   jabberwerx.util.debug.log('No response from server for binding resourse request, reopen the stream....');
           	   try {
           	      this._clearStreamHandlers();
           	      this._stream.close();
           	   // re-open the stream, giving the server some cool down time
               setTimeout(this.invocation("_openStream"), 1000);
           	   } catch (ex) {
           	   	  jabberwerx.util.debug.log(ex); 
           	   }
           },
            /**
             * if fqdn is specified in the bindurl, this function builds fqdn for the host value sent.
             * if bindurl has just the hostname, this function returns the host value back without any changes.
             * if bindurl has IP address, this function returns the host value back without any changes.
             * if host value is IP address or null, this function returns the host value back without any changes.
             * if host value is FQDN, this function returns the host value back without any changes.
             * @private
             * @param {string} bindurl HttpBinding url 
             * @param {String|IPaddress} host Host name
             */
            _switchHost: function(bindurl,host){
            	//if host value is IP address, return the host back.
            	if(!host || jabberwerx.util.validate.isIPAddress(host))return host;
            	
            	var url = /^(?:(?:([0-9a-zA-Z]+\:)\/\/)?(?:([0-9a-zA-Z\.\-]+)(?:\:([0-9]+))?))?(?:\/(.*))?$/.
                      exec(bindurl); 
            	
            	if(!url)return host;
            	var txt = url[2];
            	
            	// if bindurl contains IP address, return the host back.
            	if(!txt || jabberwerx.util.validate.isIPAddress(txt))return host;
            	var alphanum1= txt.substring(0,txt.indexOf(".") == -1 ? txt.length : txt.indexOf("."));
            	
            	//if host already contain domain suffix (fqdn), return host back
            	if(host.indexOf(txt.substring(alphanum1.length,txt.length))>0)return host;
	        	//builds FQDN
		        txt = txt.replace(alphanum1,host);
		        return txt;
            },
            
            _hasDomain: function(bindurl, host){
            	if(this._switchHost(bindurl,host) === host)return true;
            	return false;
            },         

            
            /**
             * @private
             * close received while opening a stream
             */
            _handleClosed: function(err) {
                var msg = 'closed: ' + (err&&err.data?jabberwerx.util.serializeXML(err.data):'no error');
                jabberwerx.util.debug.log(msg);  
                
                // stream close is due to in-band registration ... do not do normal disconnect logic
                if (this._connectParams.arg.register) {
                    // clear the in-band registration flag
                    this._connectParams.arg.register = false;
                    
                    // re-open the stream, giving the server some cool down time
                    setTimeout(this.invocation("_openStream"), 500);
                } else if (this._connectParams.sdEnabled && !this._connectSecondaryBindingURL && this.clientStatus == jabberwerx.Client.status_connecting) {
                	switch (this._candidateNodes.length){
                		case 2: //connection failed to the home node
                			if(!this._hasDomain(this._connectParams.httpBindingURL,this._candidateNodes[0])) {
                				this._candidateNodes[0]=this._switchHost(this._connectParams.httpBindingURL,this._candidateNodes[0]);
                				jabberwerx.util.debug.log("Trying with domain [" + this._candidateNodes[0] + "]");
                				this._stream._connectToNode = this._candidateNodes[0];
                				break;
                			}						
                			jabberwerx.util.debug.log("Failed to connect to home node [" + this._candidateNodes[0] + "], and now try the backup node [" + this._candidateNodes[1] + "].");
                			this._candidateNodes.shift();//remove the home node from array
                			this._stream._connectToNode = this._candidateNodes[0];//try the backup node now
                			break;
                		case 1://connection failed to the backup node,or the home node if there is no backup node available
                			if(!this._hasDomain(this._connectParams.httpBindingURL,this._candidateNodes[0])) {
                				this._candidateNodes[0]=this._switchHost(this._connectParams.httpBindingURL,this._candidateNodes[0]);
                				jabberwerx.util.debug.log("Trying with domain [" + this._candidateNodes[0] + "]");
                				this._stream._connectToNode = this._candidateNodes[0];
                				break;
                			}
                			jabberwerx.util.debug.log("Both home and backup node are down, retrying the SD-Primary node, binding URL =" + this._connectParams.httpBindingURL);
                			this._candidateNodes.shift();//remove the backup node from array
                			//reset _connectToNode and home node, and use the httpBindingURL when build BOSH URL
                			this._stream._connectToNode = null;
                			this._userSDInfo.home = null;
                			break;
                		case 0://connection failed to the sd-primary node 
                			this._stream._connectToNode = null;// try the sd-secondary node now
                			this._connectSecondaryBindingURL = true;
                			jabberwerx.util.debug.log("Failed to connect to SD-Primary Node, binding URL =" + this._connectParams.httpBindingURL + ",  and now try the SD-Secondary Node binding URL=" + this._connectParams.httpBindingURL_secondary);
                			break;
                		default:
                			jabberwerx.util.debug.log("Error: the _candidateNodes.length is out of range!");
                	}
                    this._stream.close();
                    this._openStream();
                } else {
                    this._disconnected(err.data);  
                }
            },
            
          /**
             * @private
             */
            _handleConnectionException: function(ex) {
                this._clearStreamHandlers(); //ignore any streamClosed events, to us it's already closed
                try {
                    this._stream.close();
                } catch (e) {}; //ignore stream state exceptions, can't really handle them
                //make an error node and fire through disconnected
                var n = this._exceptionToErrorNode(ex);
                jabberwerx.util.debug.log("Exception during connection: " + jabberwerx.util.serializeXML(n));
                this._disconnected(n);
            },

            /**
             * @private
             */
            _exceptionToErrorNode: function(ex) {
                if (jabberwerx.isElement(ex)) {
                    return ex;
                }

                var err = new jabberwerx.NodeBuilder("error");
                if (ex instanceof jabberwerx.SASLMechanism.SASLAuthFailure) {
                    err.element(ex.message);
                } else if (ex instanceof TypeError) {
                    err.element("{urn:ietf:params:xml:ns:xmpp-stanzas}bad-request");
                    if (ex.message) {
                        err.element("text").text(ex.message);
                    }
                } else {
                    //If this is a conflict exception, add the namespace to err data
                    //This allows ErrorReporter to provide a useful message for the conflict exception
                    var errNode = jabberwerx.$(ex).find("conflict");
                    if (errNode && errNode.length != 0) {
                        //Get the namespace
                        var ns = jabberwerx.$(errNode).attr("xmlns");
                        //Appended message key to error node
                        err.element("{" + ns + "}conflict");
                    } else {
                        var emsg =( ex && ex.message) ? ex.message : "{urn:ietf:params:xml:ns:xmpp-stanzas}internal-server-error";
                        try {
                            err.element(emsg);
                        } catch (e) {
                            err.element("{urn:ietf:params:xml:ns:xmpp-stanzas}internal-server-error");
                            //add element message as text
                            err.element("text").text(emsg);
                        }
                    }
                }
                return err.data;
            },

            /**
             * Disconnect from the server.
             */
            disconnect: function() {
                if (this.isConnected()) {
                    // if the resourceName was server generated ... clear it on disconnect
                    if (this._autoResourceName) {
                        this.resourceName = null;
                    }
                    this.setClientStatus(jabberwerx.Client.status_disconnecting);
                    this._stream.close();
                    this._connectionAttempts = 0;
                    this._connectSecondaryBindingURL = false;
                }
            },

            /**
             * @type Boolean
             * @return Whether the client is currently connected
             */
            isConnected: function() {
                // check flag and client state, to allow "lifecycle" controllers
                // to do their work
                return this._connectedRendezvous ||
                       (this.clientStatus == jabberwerx.Client.status_connected);
            },

           /**
            * @private
            * Set client status
            * @param {Number} status A Client.status_... constant
            * @param {Error} [error] An error object
            * @param {Function} [cb] callback to be executed when the change
            *        (and event) is done
            */
            setClientStatus: function(status, error, cb) {
                var prev = this.clientStatus;
                this.clientStatus = status;

                if (prev && (prev != status)) {
                    var data = {
                        previous: prev,
                        next: status,
                        error: error
                    };
                    this.event('clientStatusChanged').trigger(data, null, cb);
                } else if (cb != null) {
                    cb();
                }

                /* DEBUG-BEGIN */
                jabberwerx.util.debug.log('client status: ' + this.getClientStatusString(status),
                        'clientStatus');
                /* DEBUG-END */
            },

            /**
             * @param {Number} status A Client.status_... constant
             * @returns A string version of the status.
             * @type String
             */
            getClientStatusString: function(status) {
                switch (status) {
                    case jabberwerx.Client.status_connected:
                        return jabberwerx._("Connected to {0} as {1}.",
                                (this.connectedServer ? this.connectedServer.jid : jabberwerx._("(unknown)")),
                                (this.connectedUser ? this.connectedUser.jid : jabberwerx._("(unknown)")));
                    case jabberwerx.Client.status_connecting:
                        return jabberwerx._("Attempting to connect");
                    case jabberwerx.Client.status_error:
                        return jabberwerx._("Connection error");
                    case jabberwerx.Client.status_disconnecting:
                        return jabberwerx._("Disconnecting");
                    case jabberwerx.Client.status_reconnecting:
                        return jabberwerx._("Reconnecting");
                    default:
                        return jabberwerx._("Disconnected");
                }
            },

            /**
             * <p>Retrieves the current presence for this client. If not
             * connected, this method returns <tt>null</tt>.</p>
             *
             * @param   {Boolean} [primary] Optional flag which, if true, this method will return
             *          the primary presence for this client. If false or not specified, the
             *          resource presence is retrieved.
             * @return  {jabberwerx.Presence} The current presence, or
             *          <tt>null</tt> if none
             */
            getCurrentPresence: function(primary) {
                var me = this.connectedUser;
                return (me &&
                    (primary ? me.getPrimaryPresence() : me.getResourcePresence(this.resourceName)))
                    || null;
            },

            /**
             * Send an XMPP stanza.
             *
             * <p>If {rootName} is an instance of {@link jabberwerx.Stanza}, this method ignores
             * all other properties and sends the stanza directly. Otherwise, it is
             * expected to be the name of the root node (e.g. presence, iq, message).</p>
             *
             * @param {jabberwerx.Stanza|Element|String} rootName The name of the root node (presence, iq, etc), or the object
             *                 representation of the stanza.
             * @param {String} type The type attribute to set on the root, if any. (Set to '' or null to not set a type).
             * @param {String} to The to attribute to set on the root, if any. (Set to '' or null to not set a type).
             * @param {String} content XML content of the stanza.
             */
            sendStanza: function(rootName, type, to, content) {
                var s;

                if (rootName instanceof jabberwerx.Stanza) {
                    s = rootName.clone();
                } else if (jabberwerx.isElement(rootName)) {
                    s = jabberwerx.Stanza.createWithNode(rootName);
                } else {
                    s = new jabberwerx.Stanza(rootName);
                    if (to) {
                        s.setTo(to.toString());
                    }
                    if (type) {
                        s.setType(type.toString());
                    }

                    if (content) {
                        if (typeof content == 'string') {
                            content = jabberwerx.util.unserializeXML(content);
                        }

                        new jabberwerx.NodeBuilder(s.getNode()).node(content);
                    }

                    s = jabberwerx.Stanza.createWithNode(s.getNode());
                }

                type = s.pType();
                this.event('before' + type + 'Sent').trigger(s);
                this._stream.send(s.getNode());

                // deal with presence special
                if (s instanceof jabberwerx.Presence) {
                    var presence = s;
                    type = presence.getType();
                    if ((!type || (type == "unavailable")) && !presence.getTo()) {
                        presence = presence.clone();
                        presence.setFrom(this.connectedUser.jid + "/" + this.resourceName);

                        this.connectedUser.updatePresence(presence);
                    }
                }
            },
            /**
             * Send an XMPP message. Assumes chat-type content with a body.
             *
             * @param {String} to The to attribute to set on the message.
             * @param {String} body The body of the message.
             * @param {String} [subject] The subject of the message
             * @param {String} [type] The type attribute to set on the message.
             * @param {String} [thread] A thread identifier, if any.
             */
            sendMessage: function(to, body, subject, type, thread) {
                this._assertConnected();
                var m = new jabberwerx.Message();
                if (to instanceof jabberwerx.Entity) {
                    to = to.jid;
                } else {
                    to = jabberwerx.JID.asJID(to);
                }
                m.setTo(to);
                m.setBody(body);
                if (subject) {
                    m.setSubject(subject);
                }
                if (thread) {
                    m.setThread(thread);
                }
                if (type) {
                    m.setType(type);
                }

                // a bit hackish: in chat messages, add an XHTML-IM body,
                // even if they don't have any special markup in them.
                if (type === 'undefined' || type == 'chat') {
                    with (new jabberwerx.NodeBuilder(m.getNode())) {
                        element('{http://jabber.org/protocol/xhtml-im}html').
                                element('{http://www.w3.org/1999/xhtml}body').text(body);
                    }
                }

                this.sendStanza(m);
            },
            _iqStamp: 0,
            /**
             * Alias for {@link jabberwerx.Client#sendIq}.
             */
            sendIQ: function(type, to, content, callback, timeout) {
                return this.sendIq.apply(this, arguments);
            },
            /**
             * Send an XMPP IQ stanza.
             *
             * @param {String} type The type attribute to set on the iq.
             * @param {String} to The to attribute to set on the iq.
             * @param {String} content XML content of the iq stanza.
             * @param {Function} [callback] A callback to be invoked when
             *                   an IQ is recieved with a matching id.
             *                   This includes error stanzas.
             *                   If {timeout} is reached, a remote-server-timeout
             *                   error is used.
             * @param {Number} [timeout] A timeout (in seconds) wait on
                               a result or error IQ with a matching id
             * @type String
             * @returns The id set on the outgoing stanza.
             * @throws TypeError If {callback} is defined and is not a
             *         function; or if {timeout} is defined and not a
             *         number
             */
            sendIq: function(type, to, content, callback, timeout) {
                if (callback !== undefined && !jabberwerx.$.isFunction(callback)) {
                    throw new TypeError("callback must be a function");
                }
                if (    timeout !== undefined &&
                        typeof(timeout) != "number" &&
                        !(timeout instanceof Number)) {
                    throw new TypeError("timeout must be a number");
                }

                var i = new jabberwerx.IQ();
                var id = "iq" + new Date().valueOf() + this._iqStamp++;
                if (type) {
                    i.setType(type);
                }
                if (to) {
                    i.setTo(to);
                }
                i.setID(id);
                if (content) {
                    if (typeof(content) == 'string') {
                        content = jabberwerx.util.unserializeXML(content);
                    }

                    new jabberwerx.NodeBuilder(i.getNode()).node(content);
                }

                if (callback) {
                    var that = this;
                    var tid = undefined;
                    var fn = function(evt) {
                        var elem = evt.data;

                        if (jabberwerx.isDocument(elem)) {
                            elem = elem.documentElement;
                        } else if (elem instanceof jabberwerx.Stanza) {
                            elem = elem.getNode();
                        }

                        elem = jabberwerx.$(elem);
                        if (elem.attr("id") != id) {
                            return;
                        }
                        if (elem.attr("type") != "result" && elem.attr("type") != "error") {
                            return;
                        }

                        callback(elem.get()[0]);
                        evt.notifier.unbind(arguments.callee);

                        if (tid) {
                            window.clearTimeout(tid);
                            tid = undefined;
                        }
                    };
                    timeout = Number(timeout || 0);
                    if (timeout > 0) {
                        var tfn = function() {
                            if (tid) {
                                that.event('beforeIqReceived').unbind(fn);

                                var iq = i.errorReply(jabberwerx.Stanza.ERR_REMOTE_SERVER_TIMEOUT);
                                iq.setFrom(to);
                                callback(iq.getNode());
                            }
                        }
                        tid = window.setTimeout(tfn, timeout * 1000);
                    }

                    var idSel = '[id="' + id + '"]';
                    this.event('beforeIqReceived').bind(fn);
                }
                this.sendStanza(i);

                return id;
            },
            /**
             * Send an XMPP presence stanza
             *
             * @param {String} [show] Optional show value: 'away', 'available', 'dnd', etc.
             * @param {String} [status] Optional status message.
             * @param {String} [to] Optional `to` attribute to set on the outgoing stanza.
             */
            sendPresence: function(show, status, to) {
                var p = new jabberwerx.Presence();
                if (typeof show == 'string') {
                    p.setShow(show);
                }
                if (typeof status == 'string') {
                    p.setStatus(status);
                }
                if (to !== 'undefined') {
                    p.setTo(to);
                }

                this.sendStanza(p);
            },

            /**
             * Runs the passed jQuery selector string against the passed stanza.
             * @param {String} stanzaDoc XML of stanza
             * @param {String} selector jQuery selector
             * @returns A bare array (not jQuery-enhanced) of matching nodes, or a single node if only one matches.
             * @type Array|Node
             */
            selectNodes: function(stanzaDoc, selector) {
                var filteredDoc = stanzaDoc;
                jabberwerx.util.debug.log('running jquery with selector: ' + selector + " on doc:\n\n" + filteredDoc.xml, 'stanzaSelectors');
                var result = jabberwerx.$(selector, filteredDoc);
                var nodes = [];
                result.each(function(){ nodes.push(this); });
                if (nodes.length == 1) {
                    return nodes[0];
                }
                if (nodes.length == 0) {
                    return null;
                }
                return nodes;
            },

            /**
             * Gets all presence objects for the jid specified. Usual usage would be for bare jids. If a full jid is passed through
             * then only one presence object will be returned in the array.
             * @param {String|jabberwerx.JID} jid The jid to get all presence for
             * @returns An array of {@link jabberwerx.Presence} objects. Note that this array may be empty if no presence objects
             * are attached to this jid's entity
             * @type jabberwerx.Presence[]
             */
            getAllPresenceForEntity: function(jid) {
                var retVal = [];

                jid = jabberwerx.JID.asJID(jid);
                var entity = this.entitySet.entity(jid.getBareJIDString());
                if (entity) {
                    if (!jid.getResource()) {
                        // This is a bare jid
                        retVal = entity.getAllPresence();
                    } else {
                        retVal = [entity.getResourcePresence(jid.getResource())];
                    }
                }
                return retVal;
            },

            /**
             * Gets the primary presence for the jid specified. If the jid is in bare jid format (ex. 'user@host') then the
             * highest priority presence for that entity will be returned. If the jid is in full jid format (ex. 'user@host/resource')
             * then the presence object for that resource only will be returned.
             * @param {String|jabberwerx.JID} jid The jid to get the primary presence of
             * @returns The primary presence or null if the entity / resource for this jid does not exist
             * @type jabberwerx.Presence
             */
            getPrimaryPresenceForEntity: function(jid) {
                jid = jabberwerx.JID.asJID(jid);

                var entity = this.entitySet.entity(jid.getBareJIDString());
                if (entity) {
                    if (jid.getResource()) {
                        return entity.getResourcePresence(jid.getResource());
                    } else {
                        return entity.getPrimaryPresence();
                    }
                }
                return null;
            },

            /**
             * Handles presence stanzas with either no type or a type value of unavailable. Is invoked when the presenceReceived
             * event is fired and the presence has no type or a type of unavailable.
             * @private
             * @param {jabberwerx.EventObject} eventObj The eventObj passed through on the event trigger
             */
            _handlePresenceIn: function(eventObj) {
                var entity;
                var presence = eventObj.data;
                var type = presence.getType();
                if (!type || type == 'unavailable') {
                    var bareJidStr = presence.getFromJID().getBareJIDString();
                    if (bareJidStr) {
                        if (presence.getType() == 'unavailable') {
                            // If the type of the presence stanza is unavailabe then we want
                            // to remove the corresponding entity presence property (if the
                            // entity for the bare jid exists)
                            entity = this.entitySet.entity(bareJidStr);
                            if (entity) {
                                entity.updatePresence(presence);
                            }
                        } else {
                            entity = this._findOrCreateEntity(bareJidStr);
                            entity.updatePresence(presence);
                        }
                    }
                }
            },

            /**
             * Checks for an entity corresponding to the jid in the entitySet. If none found then create a new one.
             * @private
             * @param {String} jid The jid for which the entity should be found or created.
             * @returns The found or created entity object.
             * @type jabberwerx.Entity
             */
            _findOrCreateEntity: function(jid) {
                var entity = this.entitySet.entity(jid);
                if (!entity) {
                    // Create new jabberwerx.TemporaryEntity
                    entity = this.entitySet.temporaryEntity(jid);
                }
                return entity;
            },

            /**
             * @private
             * clear the entity cache by destroying any temp entities client
             *  added, any entities added on behalf of the cache, or allow
             *  controllers to destroy their entities.
             */
            _cleanupEntityCache: function() {
                this.entitySet.startBatch();
                var that = this;
                this.entitySet.each(function(entity) {
                    if (entity.controller && entity.controller.cleanupEntity)
                    {
                        entity.controller.cleanupEntity(entity);
                    }
                    /* client added TempEnts so it should clean them as well */
                    else if ((entity.controller === that.entitySet) ||
                               (entity instanceof jabberwerx.TemporaryEntity))
                    {
                        entity.destroy();
                    }
                });
                this.entitySet.endBatch();
            },

            /**
             * @private
             */
            willBeSerialized: function () {
                //obfuscate our password for store
                if (this._connectParams && this._connectParams.password) {
                    //this persist may have come mid authentication (and unit testing)
                    //clearing password here may cause persisted authentication attempt to fail (mid SASL for instance) but chances are this code will never execute
                    if (jabberwerx._config.baseReconnectCountdown == 0) {
                        this._connectParams.password = "";
                    } else {
                        this._connectParams.password = jabberwerx.util.encodeSerialization(this._connectParams.password);
                    }
                }

                //stop processing received stanzas
                this._stopReceiveQueue(false);
                this._stanzaRecvQ = jabberwerx.$.map(
                        this._stanzaRecvQ,
                        function() {
                            return this.xml;
                        });
            },


            /**
             * @private
             */
            wasUnserialized: function () {
                //unobfuscate our password
                if (this._connectParams && this._connectParams.password) {
                    this._connectParams.password = jabberwerx.util.decodeSerialization(this._connectParams.password);
                }
            },
            /**
             * @private
             */
            graphUnserialized: function() {
                //start processing received stanzas...
                //...AFTER all other objects have rehydrated
                if (this._stanzaRecvQ.length) {
                    this._stanzaRecvQ = jabberwerx.$.map(
                            this._stanzaRecvQ,
                            function() {
                                return jabberwerx.util.unserializeXML(this);
                            });
                    this._startReceiveQueue(true);
                }
            },

            /**
             * @private
             * @throws {jabberwerx.Client.NotConnectedError}
             */
            _assertConnected: function() {
                if (!this.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }
            },

            /**
             * @private
             */
            _handleConnected: function() {
                //clear password from memory
                if (jabberwerx._config.baseReconnectCountdown == 0) {
                    this._connectParams.password = "";
                }
                //setup running element handlers
                this._clearStreamHandler("streamOpened");
                this._setStreamHandler("streamElementsReceived", "_handleElementsReceived");
                this._setStreamHandler("streamElementsSent", "_handleElementsSent");

                //set our new jid
                if (this._connectParams.bindJID) {
                    var jid = jabberwerx.JID.asJID(this._connectParams.bindJID);
                    if (!jid.getBareJID().equals(this.connectedUser.jid)) {
                        // username/domain changed...
                        this.entitySet._renameEntity(this.connectedUser, jid);
                    }
                    // assume resource changed...
                    this.resourceName = jid.getResource();
                }

                this._connectParams.bindJID = null;
                //reset _connectSecondaryBindingURL when connected
                this._connectSecondaryBindingURL = false;

                // start the connected batch, all connect rendezvous run under a batch
                this.entitySet.startBatch();
                // fake the status change
                var rnz = new jabberwerx.Rendezvous(this.invocation("_completeConnected"));
                this._connectedRendezvous = rnz;
                var that = this;
                var delayed = jabberwerx.reduce(this.controllers,
                                                function(ctrl, value) {
                                                    return rnz.start(ctrl) || value;
                                                });

                if (!delayed) {
                    this._completeConnected();
                }
            },

            /**
             * @private
             */
            _connected: function() {
                // in place for internal extensibility
            },

            /**
            * @private
            */
            _handleDisconnect: function() {
                if (this.connectedUser) {
                    var prs = new jabberwerx.Presence();
                    prs.setFrom(this.connectedUser.jid + "/" + this.resourceName);
                    prs.setType("unavailable");
                    this.connectedUser.updatePresence(prs);
                }
                this._disconnected();
            },

            /**
            * @private
            */
            _disconnected: function(err) {
                //clear password from memory, could be overkill
                if (jabberwerx._config.baseReconnectCountdown == 0) {
                    // _startREconnectCountdown will skip reconnection attempt (now invalid) if base == 0
                    this._connectParams.password = "";
                    delete this._connectParams.password;
                }

                // try reconnect if not an error while disconnecting or connecting and this not a system-shutdown or resource conflict
 				 if (err &&
                    (this.clientStatus != jabberwerx.Client.status_disconnecting) &&
                    (this.clientStatus != jabberwerx.Client.status_connecting) && 
                    (jabberwerx.$("conflict", err).length == 0) &&
                    (jabberwerx.$("system-shutdown", err).length == 0 ||
                      (this._userSDInfo.home && this._userSDInfo.backup))) {
                        //best effort to determine whether the user has been moved
                    	var isUserMoved = jabberwerx.$("see-other-host", err).length != 0;
                    	if (this._reconnectAttempts++ >= 1 || isUserMoved ){
                    		this._stream.close();
                    		this._reconnectAttempts = 1;
                    		if(isUserMoved && this._userSDInfo.backup){
                    			//just try the backup node
                    			this._stream._connectToNode = this._userSDInfo.backup;
                    		}else{
                    		    //try another node in the _userSDInfo
                    		    this._stream._connectToNode = this._getNextConnectToNode();
                    		}
                    		jabberwerx.util.debug.log("Connection failed, and now try : " + this._stream._connectToNode);
                    	} else if (jabberwerx._config.baseReconnectCountdown > 0){
                    		 //this only happen once when the first connection drops
                    		 //reconnect to previous connected node
                    		  jabberwerx.util.debug.log("Reconnect to the last connected node: " + this._stream._connectToNode);
                    	}

                        this._startReconnectCountdown();
                }else {
                      //clean up the user's home/backup node and last connect to node in the browser
                      this._userSDInfo = {};
                      this._stream._connectToNode = null;
                }

                //cleanup
                this._clearStreamHandlers();
                if (this.connectedUser) {
                    // clear presence!
                    this.connectedUser.updatePresence();
                }
                this.connectedUser = null;
                this.connectedServer = null;
                this._authMech = undefined;
                delete this._authMech;

                this._cleanupEntityCache();

                // if the resourceName was server generated and not a reconnection ... clear it
                if (this._autoResourceName && !this._countDownOn) {
                    this.resourceName = null;
                }
                
                //reset _connectSecondaryBindingURL 
                this._connectSecondaryBindingURL = false;
                
                // clear out received pendings
                this._stopReceiveQueue(true);

                //event to every one else
                this.setClientStatus(jabberwerx.Client.status_disconnected, err);
           },
           
            /**
             * @private
             */
            _handleElementsReceived: function(evt) {
                //for each element, pump through _handleStanzaIn
                var elements = jabberwerx.$(evt.data).get();

                // store the current batch away
                this._stanzaRecvQ = this._stanzaRecvQ.concat(elements);
                /* DEBUG-BEGIN */
                jabberwerx.util.debug.log("client RECEIVED elements to process: " +
                                          this._stanzaRecvQ.length,
                                          "rawStanzaLogging");
                /* DEBUG-END */
                this._startReceiveQueue(false);
            },
            _handleElementsSent: function(evt) {
                var elements = jabberwerx.$(evt.data);
                for (var i = 0; i < elements.length; ++i) {
                    this._handleElementOut(elements.get(i));
                }
            },

            /**
             * Cancels a reconnect if one is currently in the pipeline. Triggers the
             * reconnectCancelled event.
             */
            cancelReconnect: function() {
                if (this._reconnectTimerID !== null) {
                    clearTimeout(this._reconnectTimerID);
                    this._reconnectTimerID = null;
                    this._countDownOn = false;
                    this.event('reconnectCancelled').trigger();
                }
            },

            /**
             * <p>Determines if this client is connected in a secure or trusted
             * manner.</p>
             *
             * @returns <tt>true</tt> If the stream is considered secure
             * @type Boolean
             */
            isSecure: function() {
                return this._stream.isSecure();
            },

            /**
             * @private
             * Starts the countdown for the reconnect.
             */
            _startReconnectCountdown: function() {
                var base = jabberwerx._config.baseReconnectCountdown;

                // Only try to reconnect if base is greater than zero
                if (base > 0) {
                    var reconnectCountdown = base + Math.round( (Math.random() - 0.5) * base / 5);
                    this._reconnectTimerID = setTimeout(
                                               this.invocation('_reconnectTimeoutHandler'),
                                               reconnectCountdown * 1000);
                    this._countDownOn = true;
                    this.event('reconnectCountdownStarted').trigger(reconnectCountdown);
                }
            },

            /**
             * @private
             * Handles the reconnect timer timeout. Set the client state to reconnecting and attempt
             * a reconnect.
             */
            _reconnectTimeoutHandler: function() {
                this._countDownOn = false;
                this._reconnectTimerID = null;
                this._connectParams.arg.reconnecting = true;
                this.connect(this._connectParams.jid, this._connectParams.password,
                             this._connectParams.arg);
            },

            /**
             * @private
             */
            _handleElementOut: function(stanza) {
                stanza = jabberwerx.Stanza.createWithNode(stanza);

                var stanzaType = stanza.pType();
                //var msg = "triggering " +stanzaType + "Sent event with: " + stanza.xml();
                this.event(stanzaType + "Sent").trigger(stanza);
            },
            
            /**
             * @private
             */
            _handleElementIn: function(stanza) {
                stanza = jabberwerx.Stanza.createWithNode(stanza);
                
                stanza.setTo(stanza.getToJID());
                stanza.setFrom(stanza.getFromJID());

                var stanzaType = stanza.pType();
                var notifiers = [
                        this.event('before' + stanzaType + 'Received'),
                        this.event(stanzaType + 'Received'),
                        this.event('after' + stanzaType + 'Received')
                ];

                var results = jabberwerx.reduce(notifiers, function(notifier, handled) {
                    handled = Boolean(handled || false);
                    if (!handled) {
                        var results = notifier.trigger(stanza);
                        if (results) {
                            for (var idx = 0; idx < results.length; idx++) {
                                handled = handled || Boolean(results[idx]);
                            }
                        }
                    }

                    return handled;
                });

                if (    !results &&
                        stanzaType == 'iq' &&
                        (stanza.getType() == 'get' || stanza.getType() == 'set')) {
                    //automatically send feature-not-implemented
                    stanza = stanza.errorReply(jabberwerx.Stanza.ERR_FEATURE_NOT_IMPLEMENTED);
                    this.sendStanza(stanza);
                }
            },

            /**
             * @private
             */
            _startReceiveQueue: function() {
                if (this._stanzaRecvWorker || !this._stanzaRecvQ.length) {
                    return;
                }

                this._stanzaRecvWorker = window.setTimeout(
                        this.invocation("_processReceiveQueue"),
                        jabberwerx.Client.STANZA_PROCESS_INTERVAL);
            },
            /**
             * @private
             */
            _stopReceiveQueue: function(clear) {
                if (this._stanzaRecvWorker) {
                    window.clearTimeout(this._stanzaRecvWorker);
                    delete this._stanzaRecvWorker;
                }

                if (clear) {
                    this._stanzaRecvQ = [];
                }
            },
            /**
             * @private
             */
            _processReceiveQueue: function() {
                var idx = 0;
                var stanza;

                // clear the worker key now; re-added if we don't finish stanzas
                delete this._stanzaRecvWorker;
                for (idx = 0; idx < jabberwerx.Client.STANZA_PROCESS_COUNT; idx++) {
                    stanza = this._stanzaRecvQ.shift();

                    if (!stanza) {
                        return;
                    }
                    // stored as a DOM; convert to stanza
                    stanza = jabberwerx.Stanza.createWithNode(stanza);

                    var stanzaType = stanza.pType();
                    var notifiers = [
                            this.event('before' + stanzaType + 'Received'),
                            this.event(stanzaType + 'Received'),
                            this.event('after' + stanzaType + 'Received')
                    ];

                    var that = this;
                    var handled = false;
                    var fn = function(results) {
                        handled = handled || Boolean(results);

                        if (!handled) {
                            if (notifiers.length) {
                                notifiers.shift().trigger(stanza,
                                                          undefined,
                                                          arguments.callee);
                            } else {
                                if (    !results &&
                                        stanzaType == 'iq' &&
                                        (stanza.getType() == 'get' || stanza.getType() == 'set')) {
                                    //automatically send feature-not-implemented
                                    stanza = stanza.errorReply(jabberwerx.Stanza.ERR_FEATURE_NOT_IMPLEMENTED);
                                    that.sendStanza(stanza);
                                }
                            }
                        }
                    };
                    fn(false);
                }

                this._startReceiveQueue(true);
            },

            /**
             * @private
             */
            _startReceiveQueue: function() {
                if (this._stanzaRecvWorker || !this._stanzaRecvQ.length) {
                    return;
                }

                this._stanzaRecvWorker = window.setTimeout(
                        this.invocation("_processReceiveQueue"),
                        jabberwerx.Client.STANZA_PROCESS_INTERVAL);
            },
            /**
             * @private
             */
            _stopReceiveQueue: function(clear) {
                if (this._stanzaRecvWorker) {
                    window.clearTimeout(this._stanzaRecvWorker);
                    delete this._stanzaRecvWorker;
                }

                if (clear) {
                    this._stanzaRecvQ = [];
                }
            },
            /**
             * @private
             */
            _processReceiveQueue: function() {
                var idx = 0;
                var stanza;

                // clear the worker key now; re-added if we don't finish stanzas
                delete this._stanzaRecvWorker;
                for (idx = 0; idx < jabberwerx.Client.STANZA_PROCESS_COUNT; idx++) {
                    stanza = this._stanzaRecvQ.shift();

                    if (!stanza) {
                        return;
                    }
                    // stored as a DOM; convert to stanza
                    stanza = jabberwerx.Stanza.createWithNode(stanza);

                    var stanzaType = stanza.pType();
                    var notifiers = [
                            this.event('before' + stanzaType + 'Received'),
                            this.event(stanzaType + 'Received'),
                            this.event('after' + stanzaType + 'Received')
                    ];

                    var that = this;
                    var handled = false;
                    var fn = function(results) {
                        handled = handled || Boolean(results);

                        if (!handled) {
                            if (notifiers.length) {
                                notifiers.shift().trigger(stanza,
                                                          undefined,
                                                          arguments.callee);
                            } else {
                                if (    !results &&
                                        stanzaType == 'iq' &&
                                        (stanza.getType() == 'get' || stanza.getType() == 'set')) {
                                    //automatically send feature-not-implemented
                                    stanza = stanza.errorReply(jabberwerx.Stanza.ERR_FEATURE_NOT_IMPLEMENTED);
                                    that.sendStanza(stanza);
                                }
                            }
                        }
                    };
                    fn(false);
                }

                this._startReceiveQueue(true);
            },

            /**
             * @private
             */
            _handleIqTime: function(evt) {
                var now = new Date();
                var tz;
                tz = now.toString();
                tz = tz.substring(tz.lastIndexOf(' ') + 1);

                var iq = evt.data;
                iq = iq.reply();
                with (new jabberwerx.NodeBuilder(iq.getQuery())) {
                    element('display').text(now.toLocaleString());
                    element('utc').text(jabberwerx.generateTimestamp(now, true));
                    element('tz').text(tz);
                }
                this.sendStanza(iq);

                return true;
            },
            /**
             * @private
             */
            _handleEntityTime: function(evt) {
                var now = new Date();
                var tzo;
                with (now) {
                    var h, m;

                    tzo = getTimezoneOffset();
                    h = tzo / 60;
                    m = tzo % 60;

                    tzo =   (tzo > 0 ? '-' : '+') +
                            (h < 10 ? '0' + h : h) + ':' +
                            (m < 10 ? '0' + m : m);
                }

                var iq = evt.data;
                iq = iq.reply();
                with (new jabberwerx.NodeBuilder(iq.getChild())) {
                    element('tzo').text(tzo);
                    element('utc').text(jabberwerx.generateTimestamp(now, false));
                }
                this.sendStanza(iq);

                return true;
            },

            /**
             * @private
             */
            _generateUsername: function() {
                return /*DEBUG-BEGIN*/'_cf_' +/*DEBUG-END*/ hex_md5(this._guid + ((this._connectionAttempts) + (new Date().valueOf)));
            },
            /**
             * @private
             */
            _generatePassword: function(username) {
                return hex_md5(username + (window.innerHeight + window.innerWidth));
            },
            /**
             * @private
             */
            _completeConnected: function(rnz) {
                delete this._connectedRendezvous;
                // register for feature query callback
                //end connection batch before eventing connected
                this.entitySet.endBatch();

                this.setClientStatus(jabberwerx.Client.status_connected,
                                     null,
                                     this.invocation("_connected"));
            },

            /**
             * The collection of registered Controllers for this Client.
             * Controllers are responsible for registering themselves with
             * their owning client.
             */
            controllers: {},
            /**
             * The resource name for this client.
             * @type String
             */
            resourceName: null,
            /**
             * The user with whose JID we are currently logged in.
             * @type jabberwerx.User
             */
            connectedUser: null,
            /**
             * @private
             * The stream
             * @type jabberwerx.Stream
             */
            _stream: null,

            /**
             * @private
             *  currently assigned stream handlers
             */

            _streamHandlers: [],
            /**
             * The current client status.
             * @type Number
             */
            clientStatus: 3, //start off diconnected
            /**
             * The server to which we are currently connected.
             * @type jabberwerx.Server
             */
            connectedServer: null,
            /**
             * This entity set must be used to get references to any entity needed for the lifetime of this client/connection.
             * @type jabberwerx.EntitySet
             */
            entitySet: null,
            /**
             * Whether auto-registration is active.
             * @type Boolean
             */
            autoRegister: false,

            /**
             * @private
             */
            _stanzaRecvQ: [],
            /**
             * @private
             */
            _connectionAttempts: 0,
            /**
             * @private
             */
            _reconnectTimerID: null,
            /**
             * @private
             */
            _connectParams: {},
            /**
             * @private
             */
            _autoResourceName: false,
            /**
             * @private
             */
            _countDownOn: false,
            /**
             * @private
             * True if need to connect to secondary httpbinding URL
             */
            _connectSecondaryBindingURL: false,
            /**
             * @private
             * Object contains users' home/backup node
             */
            _userSDInfo: {},
            /**
             *@private
             * Candidate nodeS for the first connection
             */
            _candidateNodes: [],
            /**
             *@private
             * bind resource timer
             */
            _bindResourceTimer: null,
            /**
             *@private
             * reconnection attempts
             */
            _reconnectAttempts: 0
        }, 'jabberwerx.Client');


        /**
         * @constant
         * Indicates the client is connecting
         */
        jabberwerx.Client.status_connecting = 1;
        /**
         * @constant
         * Indicates the client is connected
         */
         jabberwerx.Client.status_connected = 2;
        /**
         * @constant
         * Indicates the client is disconnected
         */
         jabberwerx.Client.status_disconnected = 3;
        /**
         * @constant
         * Indicates the client is disconnecting
         */
         jabberwerx.Client.status_disconnecting = 4;
        /**
         * @constant
         * Indicates the client is starting a reconnect attempt
         */
         jabberwerx.Client.status_reconnecting = 5;

        /**
         * @class jabberwerx.Client.NotConnectedError
         * <p>Error to indicate the client is not connected, when the operation expects a
         * connection.</p>
         * @description
         * <p>Creates a new NotConnectedError with the given message.</p>
         * @extends jabberwerx.util.Error
         * @minimal
         */
        jabberwerx.Client.NotConnectedError = jabberwerx.util.Error.extend('The client is not connected.');
        /**
         * @class
         * <p>Error thrown when an error is encountered while trying to
         * establish the connection.</p>
         *
         * @description
         * <p>Creates a new ConnectionError with the given message.</p>
         *
         * @param {String} msg The error condition message
         * @extends jabberwerx.util.Error
         * @minimal
         */
        jabberwerx.Client.ConnectionError = jabberwerx.util.Error.extend();
        /**
         * @class
         * <p>Error thrown when an error is encountered after the connection
         * is established.</p>
         *
         * @description
         * <p>Creates a new DisconnectError with the given message.</p>
         *
         * @param {String} msg The error condition message
         * @extends jabberwerx.util.Error
         * @minimal
         */
        jabberwerx.Client.DisconnectError = jabberwerx.util.Error.extend();

    }

    /**
     * Interval between stanza processing loops
     * @private
     */
    jabberwerx.Client.STANZA_PROCESS_INTERVAL = 1;
    /**
     * Number of stanzas to process in a loop
     * @private
     */
    jabberwerx.Client.STANZA_PROCESS_COUNT = 5;

            














/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/MUCRoom.js*/
/**
 * filename:        MUCRoom.js
 * created at:      2009/06/05T10:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.MUCOccupant = jabberwerx.Entity.extend(/** @lends jabberwerx.MUCOccupant.prototype */ {
        /**
         * @class
         * <p>Represents an occupant in a Multi-User Chat (MUC) room.</p>
         *
         * @description
         * <p>Creates a new instance of MUCOccupant with the given room and
         * nickname. The created occupant is registered with the owning
         * room's {@link jabberwerx.MUCRoom#occupants} as part of this
         * call.</p>
         *
         * <p><b>NOTE:</b> This type should not be directly created. MUCRooms
         * create occupants as necessary.</p>
         *
         * @param {jabberwerx.MUCRoom} room The owning room
         * @param {String} nick The nickname
         * @throws {TypeError} If {room} is not a valid MUCRoom; or if {nick}
         *         is not a non-empty string
         * @constructs jabberwerx.MUCRoom
         * @extends jabberwerx.Entity
         */
        init: function(room, nick) {
            if (!(room && room instanceof jabberwerx.MUCRoom)) {
                throw new TypeError("room must be a non-null instance of jabberwerx.MUCRoom");
            }
            if (!nick) {
                throw new TypeError("nick must be a non-empty string");
            }

            var jid = new jabberwerx.JID({
                node: room.jid.getNode(),
                domain: room.jid.getDomain(),
                resource: nick
            });

            this._super({jid: jid}, room.occupants);

            this.room = room;
            room.occupants.register(this);
        },

        /**
         * <p>Retrieves the nickname for this MUCOccupant. This is a
         * convenience that always returns the resource portion of the
         * occupant's JID.</p>
         *
         * @returns {String} The nickname
         */
        getNickname: function() {
            return this.jid.getResource();
        },
        /**
         * <p>Retrieves the display name for this MUCOccupant. This method
         * overrides the base to only return {@link #getNickname}.</p>
         *
         * @returns {String} The display name (occupant nickname)
         */
        getDisplayName: function() {
            return this.getNickname();
        },
        /**
         * <p>Override of the base to prevent display name changes.</p>
         *
         * @param {String} [name] The new display name (ignored)
         */
        setDisplayName: function(name) {
            //do nothing
        },

        /**
         * <p>Update presence for this MUCOccupant.</p>
         *
         * <p>This method overrides the base to only retain at most one
         * presence instance. This method always results in both
         * "resourcePresenceChanged" and "primaryPresenceChanged" events
         * being triggered.</p>
         *
         * @param {jabberwerx.Presence} presence The presence to update from
         * @returns {Boolean} <tt>true</tt> if primary presence changed.
         * @throws {TypeError} If {presence} is not a valid availability or
         *         unavailability presence for this entity
         */
        updatePresence: function(presence) {
            if (!(presence && presence instanceof jabberwerx.Presence)) {
                throw new TypeError("must provide a valid non-subscription Presence");
            }

            if (presence.getFrom() != this.jid) {
                throw new TypeError("presence not appropriate to this occupant");
            }

            var type = presence.getType() || "";
            if (type && type != "unavailable") {
                throw new TypeError("must provide a valid non-subscription Presence");
            }

            if (type == "unavailable") {
                this._presenceList.splice(0,1);
            } else if (this._presenceList.length) {
                this._presenceList[0] = presence;
            } else {
                this._presenceList.push(presence);
            }

            this.event("resourcePresenceChanged").trigger({
                fullJid: this.jid,
                presence: presence,
                nowAvailable: false
            });
            this.event("primaryPresenceChanged").trigger({
                fullJid: this.jid,
                presence: (presence.getType() == "unavailable" ? null : presence)
            });

            return true;
        },

        /**
         * <p>Determines if this MUCOccupant represents the current user.</p>
         *
         * @returns {Boolean} <tt>true</tt> if this occupant is for the current
         *          logged-in user.
         */
        isMe: function() {
            return (this.room && this.room.me == this);
        },

        /**
         * <p>The owning MUC Room.</p>
         *
         * @type jabberwerx.MUCRoom
         */
        room: null
    }, "jabberwerx.MUCOccupant");

    jabberwerx.MUCOccupantCache = jabberwerx.EntitySet.extend(/** @lends jabberwerx.MUCOccupantCache.prototype */{
        /**
         * @class
         * <p>The entity cache for MUC room occupants.</p>
         *
         * <p>
         * This class provides the following events:
         * <ul>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.EntitySet">jabberwerx.EntitySet</a></li>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.EntitySet_Cache">jabberwerx.EntitySet Cache</a></li>
         * </ul>
         *
         * @description
         * <p>Creates a new MUCOccupantCache with the given room.</p>
         *
         * @param {jabberwerx.MUCRoom} room The owning room
         * @throws {TypeError} if {room} is not a valid MUCRoom
         * @constructs jabberwerx.MUCOccupantCache
         * @extends jabberwerx.EntitySet
         */
        init: function(room) {
            if (!(room && room instanceof jabberwerx.MUCRoom)) {
                throw new TypeError("must provide a valid MUCRoom");
            }

            this._super();
            this.room = room;
        },

        /**
         * <p>Registers the given occupant to this cache. This method
         * overrides the base to ensure {entity} is a MUCOccupant, then
         * to trigger the "entityCreated" event once added.</p>
         *
         * @param {jabberwerx.MUCOccupant} entity The occupant to register
         * @throws {TypeError} If {entity} is not a valid MUCOccupant
         */
        register: function(entity) {
            if (!(entity && entity instanceof jabberwerx.MUCOccupant)) {
                throw new TypeError("only MUCOccupants can be registered");
            }

            if (this._super(entity)) {
                this.event("entityCreated").trigger(entity);
            }
        },
        /**
         * <p>Unregisters the given occupant from this cache. This method
         * overrides the base to ensure {entity} is a MUCOccupant, then
         * to trigger the "entityDestroyed" event once removed.</p>
         *
         * @param {jabberwerx.MUCOccupant} entity The occupant to unregister
         * @throws {TypeError} If {entity} is not a valid MUCOccupant
         */
        unregister: function(entity) {
            if (!(entity && entity instanceof jabberwerx.MUCOccupant)) {
                throw new TypeError("only MUCOccupants can be registered");
            }

            if (this._super(entity)) {
                if (this.room.me === entity) {
                    this.room.me = null;
                }
                this.event("entityDestroyed").trigger(entity);
            }
        },

        /**
         * @private
         */
        _clear: function() {
            var that = this;
            jabberwerx.$.each(this.toArray(), function() {
                that.unregister(this);
            });
        },

        /**
         * <p>Renames an occupant to the new JID. This method reindexes the
         * given entity to the new JID, then triggers the "entityRenamed"
         * event.</p>
         *
         * <p><b>NOTE:</b> This method should not be called directly. Instead,
         * the owning room will call this method when a nickname change is
         * detected.</p>
         *
         * @param {jabberwerx.MUCOccupant} entity The occupant to rename
         * @param {jabberwerx.JID|String} njid The new JID for the occupant
         */
        rename: function(entity, njid) {
            this._renameEntity(entity, njid, "");
        },

        /**
         * <p>Retrieves the occupant with the given nickname.</p>
         *
         * @param {String} nick The nickname of the occupant to retrieve
         * @returns {jabberwerx.MUCOccupant} The occupant for {nick}, or
         *          undefined if not found.
         * @throws {TypeError} If {nick} is not a non-empty string.
         */
        occupant: function(nick) {
            if (!nick) {
                throw new TypeError("nickname must be a non-empty string");
            }

            var jid = this.room.jid;
            jid = new jabberwerx.JID({
                node: jid.getNode(),
                domain: jid.getDomain(),
                resource: nick
            });
            return this.entity(jid);
        },

        /**
         * <p>The owning MUCRoom.</p>
         *
         * @type jabberwerx.MUCRoom
         */
        room: null
    }, "jabberwerx.MUCOccupantCache");

    jabberwerx.MUCRoom = jabberwerx.Entity.extend(/** @lends jabberwerx.MUCRoom.prototype */{
        /**
         * @class
         * <p>Represents a Multi-User Chat (MUC) room.</p>
         *
         * <p>This entity has the following in its {@link #properties} map:</p>
         * <table>
         * <tr><th>Name</th><th>Type</th><th>Description</th></tr>
         * <tr><td>subject</td><td>String</td><td>The room's subject</td></tr>
         * </table>
         *
         * <p>
         * This class provides the following events:
         * <ul>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.MUCRoom">jabberwerx.MUCRoom</a></li>
         * </ul>
         *
         * @description
         * <p>Creates a new instance of MUCRoom with the given JID and
         * MUCController.</p>
         *
         * <p><b>NOTE:</b> This type should not be directly created. Instead,
         * users should call {@link jabberwerx.MUCController#room} to
         * obtain an instance.</p>
         *
         * @param {jabberwerx.JID|String} jid The JID of the room.
         * @param {jabberwerx.MUCController} ctrl The owning MUCController.
         * @throws {TypeError} If {ctrl} is not a valid MUCController
         * @throws {jabberwerx.JID.InvalidJIDError} if {jid} is not an instance of
         *         jabberwerx.JID, and cannot be converted to one
         *
         * @constructs jabberwerx.MUCRoom
         * @extends jabberwerx.Entity
         */
        init: function(jid, ctrl) {
            if (!(ctrl && ctrl instanceof jabberwerx.MUCController)) {
                throw new TypeError("MUCController must be provided");
            }

            this._super({jid: jabberwerx.JID.asJID(jid).getBareJID()}, ctrl);
            this._state = "offline";
            this.occupants = new jabberwerx.MUCOccupantCache(this);

            // setup events
            this.applyEvent("roomCreated");
            this.applyEvent("roomEntered");
            this.applyEvent("roomExited");
            this.applyEvent("errorEncountered");

            this.applyEvent("beforeRoomBroadcastSent");
            this.applyEvent("roomBroadcastSent");
            this.applyEvent("roomBroadcastReceived");

            this.applyEvent("beforeRoomSubjectChanging");
            this.applyEvent("roomSubjectChanging");
            this.applyEvent("roomSubjectChanged");

            // setup callbacks
            if (this.controller.client) {
                var client = this.controller.client;

                client.event("presenceReceived").bindWhen(
                        "presence[type=error][from^=" + this.jid + "]",
                         this.invocation("_handleRoomErrored"));
                client.event("messageReceived").bindWhen(
                        "message[from^=" + this.jid + "]",
                        this.invocation("_handleMessageReceived"));
                client.event("presenceSent").bindWhen(
                        "presence:not([to]):not([type])",
                        this.invocation("_handlePresenceSent"));
            }
        },
        /**
         * <p>Destroys this MUCRoom. This method overrides the base
         * to unbind callbacks.</p>
         */
        destroy: function() {
            this.exit();
            if (this.controller.client) {
                var client = this.controller.client;

                client.event("presenceReceived").unbind(
                        this.invocation("_handleRoomErrored"));
                client.event("messageReceived").unbind(
                        this.invocation("_handleMessageReceived"));
                client.event("presenceSent").unbind(
                        this.invocation("_handlePresenceSent"));
            }

            this._super();
        },

        /**
         * <p>Retrieves the display name of this MUCRoom. This method
         * overrides the base to always return the node portion of the
         * room's JID.</p>
         *
         * @returns {String} The display name of this Room
         */
        getDisplayName: function() {
            return jabberwerx.JID.unescapeNode(this.jid.getNode());
        },
        /**
         * <p>Override of the base to prevent display name changes.</p>
         *
         * @param {String} [name] The new display name (ignored)
         */
        setDisplayName: function(name) {
            //do nothing
        },

        /**
         * <p>Enters this MUC room. This method enters existing rooms or creates
         * new ones as needed. New rooms are configurable through this method's callbacks</p>
         * <p>{enterArgs} may be either a callback function or an object that may contain mapped functions
         *  and other room specific entry data like a password .
         *  If {enterArgs} is a function it is expected to match the following signature:</p>
         * <p><pre class="code">
         * function callback(err) {
         *     this;    //refers to this room
         *     err;     //if entering failed, this is the jabberwerx.Stanza.ErrorInfo
         *              //explaining the failure, undefined if
         *              //entering succeeded
         * }
         * </pre></p>
         * <p>If {enterArgs} is an object it may define any of the following:</p>
         * <p><pre class="code">
         *      successCallback: function() {
         *          this; //refers to this room
         *      }
         *      errorCallback: function(err, aborted) {
         *          this; //refers to this room
         *          err; //jabberwerx.Stanza.ErrorInfo
         *          aborted //Boolean Room creation was user aborted before configuration was complete
         *      }
         *      configureCallback: function() {
         *          this; //refers to this room
         *      }
         * </pre></p>
         * <p>{enterArgs} may also contain a String password property that contains a plaintext password.  for example:
         * <pre class="code">
         *  room.enter("foo@bar", {password: "foopass"})
         * </pre>
         * The password is sent in the clear. A not-authorized error wil be fired (through errorCallback) 
         * if the password is invalid or not provided) and required.</p>
         * <p> The <code>successCallback</code> callback is called and a "roomEntered" event fired once the room
         *  has been successfully entered or, if a new room, created and configured. If the <code>configureCallback</code> callback
         * is defined and invoked the callee <b>must</b> call {@link #applyConfig} to continue creating the room. A "roomCreated" 
         * event is fired when the room has been created but before configuration. Canceling a configuration during
         * room creation cancels the creation of the room. NOTE <code>successCallback</code> and <code>errorCallback</code> are
         * not called if the create is canceled.
         * If {enterArgs} is a function or <code>configureCallback</code> is not defined the default configuration is used to create the room.
         * </p>
         * <p>If a second enter (with the same nick) is attempted the the method calls successCallback immediately and returns.</p>
         * @param {String} nick The nickname to use in this room
         * @param {Function|Object} [enterArgs] The function (or map of functions)to callback on if
         *        entering succeeded, failed or an intermediate state like configuring.
         * @throws {TypeError} If {enterArgs} is defined and is not a valid function, or an object, or
         *         if {nick} is not a non-empty string.
         * @throws {jabberwerx.MUCRoom.RoomActiveError} If the room
         *         for {jid} is already active, and nickname different
         *         from {nick} was used to enter it or if room is currently trying to enter.
         * @throws {jabberwerx.Client.NotConnectedError} If the client
         *         is not connected
         */
        enter: function(nick, enterArgs) {
            var cbmap = enterArgs ? (jabberwerx.$.isFunction(enterArgs) ? {successCallback: enterArgs, errorCallback: enterArgs} : enterArgs) : {};

            //defined callbacks must be functions
            if (enterArgs &&
                ((cbmap.successCallback && !jabberwerx.$.isFunction(cbmap.successCallback)) ||
                 (cbmap.errorCallback && !jabberwerx.$.isFunction(cbmap.errorCallback)) ||
                 (cbmap.configureCallback && !jabberwerx.$.isFunction(cbmap.configureCallback)))) {
                    throw new TypeError("Defined callback must be a function");
            }
            if (!nick || !jabberwerx.util.isString(nick)) {
                throw new TypeError("Nick must be a non-empty string");
            }
            if (!this.controller.client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            //error if attempting an enter while attempting an enter
            if (this._state == "initializing") {
                throw new jabberwerx.MUCRoom.RoomActiveError();            
            } else if (this.isActive()) {
                //error if a second attempt at entry while already in room, success immediately if entering w/ same nick
                if (this.me && (this.me.getNickname() != nick)) {
                    throw new jabberwerx.MUCRoom.RoomActiveError();
                }
                if (cbmap.successCallback) {
                    cbmap.successCallback.call(this);
                }
                return;
            }

            var that = this;
            this._state = "initializing";

            var fn = function(evt) {
                if (evt.name == "roomcreated") {
                    //swap applyConfig to create-time wrapper
                    that._origApply = that.applyConfig;
                    that.applyConfig = that._creationApply;

                    if (cbmap.configureCallback) {
                        cbmap.configureCallback.call(that);
                    } else {
                        //submit empty form to accept defaults, fires roomEntered
                        that.applyConfig(new jabberwerx.XDataForm("submit"));
                    }
                } else {                    
                    if (evt.name == "errorencountered") {
                        that._state = "offline"; //prevent roomExited                     
                        that.exit();
                        if (cbmap.errorCallback) {
                            cbmap.errorCallback.call(that, 
                                jabberwerx.Stanza.ErrorInfo.createWithNode(evt.data.error), 
                                evt.data.aborted);
                        }
                    } else if (evt.name == "roomentered" && cbmap.successCallback) {
                        cbmap.successCallback.call(that);
                    }
                    //cleanup eventhandlers on error, entered or create cancel, all stop entering.
                    that.event("errorEncountered").unbind(arguments.callee);
                    that.event("roomEntered").unbind(arguments.callee);
                    that.event("roomCreated").unbind(arguments.callee);
                }
            };
            this.event("errorEncountered").bind(fn);
            this.event("roomEntered").bind(fn);
            this.event("roomCreated").bind(fn);

            //finally send initial presence
            this.me = new jabberwerx.MUCOccupant(this, nick);
            var stanza = this.controller.client.getCurrentPresence();
            if (stanza) {
                stanza = stanza.clone();
            } else {
                //no current presence, gen up an available for the room
                stanza = new jabberwerx.Presence();
                stanza.setPresence('', '');
            }
            stanza.setTo(this.me.jid);
            var builder = new jabberwerx.NodeBuilder(stanza.getNode());
            var xtag = builder.element("{http://jabber.org/protocol/muc}x");
            if (enterArgs && enterArgs.password) {
                xtag.element("password").text(enterArgs.password);
            }
            this.controller.client.sendStanza(stanza);
        },
        /**
         * <p>Exits this room. This method sends the unavailable presence
         * to the room, and eventually triggers a "roomExited" event.</p>
         */
        exit: function() {
            if (this.isActive() && this.controller.client.isConnected()) {
                var stanza = new jabberwerx.Presence();
                stanza.setTo(this.me.jid);
                stanza.setType("unavailable");
                this.controller.client.sendStanza(stanza);
            } else if (this.me) {
                if (this.isActive()) {
                    this._state = "offline";
                    this.event("roomExited").trigger();
                }
                this.me.remove();
            }
        },

        /**
         * <p>Changes the current user's nickname with the room. This
         * method sends the necessary protocol, that ultimately results
         * an "entityRenamed" event being triggered for the user's
         * occupant.</p>
         *
         * <p>The optional function {cb} is expected to match the
         * following signature:</p>
         * <p><pre class="code">
         * function callback(err) {
         *     this;    //refers to this room
         *     err;     //if entering failed, this is the error
         *              //explaining the failure, undefined if
         *              //entering succeeded
         * }
         * </pre></p>
         *
         * <p>If the user's nickname in the room is already {nick}, this
         * method does nothing.</p>
         *
         * @param {String} nick The new nickname
         * @param {Function} [cb] The function to callback on when
         *        the change nickname attempt succeeds or fails.
         * @throws {TypeError} if {cb} is not a valid function or undefined;
         *         or if {nick} is not a non-empty string
         * @throws {jabberwerx.MUCRoom.RoomNotActiveError} if the room is
         *         not currently active.
         */
        changeNickname: function(nick, cb) {
            if (this.me && this.me.getNickname() == nick) {
                //short circuit
                return;
            }

            if (!nick) {
                throw new TypeError("nickname must be a non-empty string");
            }
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be a function or undefined");
            }
            if (!this.isActive()) {
                throw new jabberwerx.MUCRoom.RoomNotActiveError();
            }

            var jid = new jabberwerx.JID({
                node: this.jid.getNode(),
                domain: this.jid.getDomain(),
                resource: nick
            });
            var stanza = this.controller.client.getCurrentPresence().clone();
            stanza.setTo(jid);

            if (cb) {
                var that = this;
                var fn = function(evt) {
                    var err = (evt.name == "errorencountered") ?
                        evt.data :
                        undefined;

                    if (err || (evt.name == "entityrenamed" && evt.data === that.me)) {
                        cb.call(that, err);
                        that.event("errorEncountered").unbind(arguments.callee);
                        that.occupants.event("entityRenamed").unbind(arguments.callee);
                    }
                };
                this.event("errorEncountered").bind(fn);
                this.occupants.event("entityRenamed").bind(fn);
            }
            this.controller.client.sendStanza(stanza);
        },
        /**
         * <p>Changes or clears the subject in the room. This method
         * sends the necessary protocol, that results in the following
         * events:</p>
         *
         * <ol>
         * <li>triggers a "beforeRoomSubjectChanging" event with the candidate
         * jabberwerx.Message, just prior to sending; This allows for the
         * subject changing protocol to be modified.</li>
         * <li>triggers a "roomSubjectChanging" event just after the subject
         * changing protocol is sent.</li>
         * <li>triggers a "roomSubjectChanged" event when the room broadcasts
         * the change to all occupants (including the current user).</li>
         * <li>triggers an "entityUpdated" event after the local subject
         * property is changed.</li>
         * </ol>
         *
         * <p>The optional function {cb} is expected to match the
         * following signature:</p>
         * <p><pre class="code">
         * function callback(err) {
         *     this;    //refers to this room
         *     err;     //if entering failed, this is the error
         *              //explaining the failure, undefined if
         *              //entering succeeded
         * }
         * </pre></p>
         *
         * @param {String} subject The new subject
         * @param {Function} [cb] The function to callback on when
         *        the change subject attempt succeeds or fails.
         * @throws {TypeError} if {cb} is not a valid function or undefined
         * @throws {jabberwerx.MUCRoom.RoomNotActiveError} if the room is
         *         not currently active.
         */
        changeSubject: function(subject, cb) {
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be a function or undefined");
            }
            if (!this.isActive()) {
                throw new jabberwerx.MUCRoom.RoomNotActiveError();
            }

            var stanza = new jabberwerx.Message();
            // TODO: attach ID for tracking?
            stanza.setTo(this.jid);
            stanza.setType("groupchat");
            stanza.setSubject(subject || "");

            // Changing a room's subject to nothing doesn't actually change it in XCP (oh well)

            if (cb) {
                var that = this;
                var fn = function(evt) {
                    var err = (evt.name == "errorencountered") ?
                            evt.data :
                            undefined;

                    cb.call(that, err);
                    that.event("errorEncountered").unbind(arguments.callee);
                    that.event("roomSubjectChanged").unbind(arguments.callee);
                };
                this.event("errorEncountered").bind(fn);
                this.event("roomSubjectChanged").bind(fn);
            }

            this.event("beforeRoomSubjectChanging").trigger(stanza);
            this.controller.client.sendStanza(stanza);
            this.event("roomSubjectChanging").trigger(stanza);
        },
        /**
         * <p>Sends a broadcast message to the room. This method sends the
         * necessary protocol, and results in the following events:</p>
         *
         * <ol>
         * <li>triggers a "beforeRoomBroadcastSent" event with the candidate
         * jabberwerx.Message, just prior to sending; This allows for the
         * broadcast protocol to be modified.</li>
         * <li>triggers a "roomBroadcastSent" event just after the broadcast
         * protocol is sent.</li>
         * <li>triggers a "roomBroadcastReceived" event when the room
         * broadcasts the message to all occupants (including the current
         * user).</li>
         * </ol>
         *
         * <tt>msg</tt> may be plaintext, a root HTML element, a body element 
         *  in the XHTML namespace (see xep-71) or an array of HTML tags.         
         *  see {@link jabberwerx.Message#setHTML} for additional information.
         *
         * @param {String|DOM|Array} msg The message to send
         * @throws {jabberwerx.MUCRoom.RoomNotActiveError} if the room is
         *         not currently active.
         */
        sendBroadcast: function(msg) {
            if (!msg) {
                //let's be silent on this one...
                return;
            }
            if (!this.isActive()) {
                throw new jabberwerx.MUCRoom.RoomNotActiveError();
            }

            var stanza = new jabberwerx.Message();
            stanza.setTo(this.jid);
            stanza.setType("groupchat");
            if (jabberwerx.isElement(msg) || jabberwerx.$.isArray(msg)) {
                stanza.setHTML(msg);
            } else {
                stanza.setBody(msg);
            }

            this.event("beforeRoomBroadcastSent").trigger(stanza);
            this.controller.client.sendStanza(stanza);
            this.event("roomBroadcastSent").trigger(stanza);
        },

        /**
         * <p>Retrieves the primary presence for this entity. This
         * implementation always returns the presence for the current
         * user in the room, or <tt>null</tt> if the room is not
         * active.</p>
         *
         * @returns {jabberwerx.Presence} The primary presence for the room
         */
        getPrimaryPresence: function() {
            if (this.me) {
                return this.getResourcePresence(this.me.getNickname());
            }

            return null;
        },
        /**
         * <p>Determines if this room is currently active. This implementation
         * returns <tt>true</tt> an occupant for the current user exists, and
         * has an available presence for that occupant.</p>
         *
         * @returns {Boolean} <tt>true</tt> if the room is active
         */
        isActive: function() {
            return Boolean(this._state == "active");
            return Boolean(this.getPrimaryPresence());
        },

        /**
         * <p>Updates for this Entity. This method overrides the base to update
         * presence for the room's occupants via
         * {@link jabberwerx.MUCOccupant#updatePresence}, with the following
         * additional actions:</p>
         *
         * <ul>
         * <li>If the presence is an available presence for a previously
         * non-existent occupant, a new MUCOccupant is added (resulting in
         * an "entityCreated" event).</li>
         * <li>If the presence is an unavailable presence for a previously
         * existent occupant (and is not part of a nickname change), that
         * MUCOccupant is removed (resulting in an "entityDestroyed"
         * event).</li>
         * <li>If the presence is for a nickname change, the associated
         * entity's JID is changed, and an "entityRenamed" event
         * triggered.</li>
         * <li>If the presence is an available presence for the current user
         * and indicates the room is pending configuration, teh "instant room"
         * (or "accept defaults") protocol from XEP-0045 is sent to unlock
         * the room.</li>
         * <li>If the presence is an unavailable presence for the current user,
         * a "roomExited" event is triggered.</li>
         * </ul>
         *
         * @param {jabberwerx.Presence} presence The presence to update from
         * @returns {Boolean} <tt>true</tt> if the presence updated the current
         *          user's occupant
         * @throws {TypeError} If {presence} is not appropriate for this
         *         MUCRoom
         */
        updatePresence: function(presence) {
            if (!(presence && presence instanceof jabberwerx.Presence)) {
                throw new TypeError("must provide a valid non-subscription Presence");
            }

            var jid = presence.getFromJID();
            if (jid.getBareJIDString() != this.jid) {
                throw new TypeError("presence not appropriate to this room");
            }

            var type = presence.getType() || "";
            if (type && type != "unavailable") {
                throw new TypeError("must provide a valid non-subscription Presence");
            }

            var node = jabberwerx.$(presence.getNode()).children("x[xmlns^=http://jabber.org/protocol/muc]");
            var item = node.children("item");
            var status = node.children("status");

            var occupant = this.occupants.entity(jid);
            var result = (occupant && occupant.isMe());
            this._removePresenceFromList(jid);
            switch (type) {
                case "":
                    this._presenceList.push(presence);
                    if (!occupant) {
                        occupant = new jabberwerx.MUCOccupant(this, jid.getResource());
                    }

                    var prsCount = occupant.getAllPresence().length;
                    occupant.updatePresence(presence);
                    if (occupant.isMe() && prsCount == 0) {
                        //This is "me" entering the room
                        //check each status for created code
                        if (node.children("status[code=201]").length == 1) {
                            //trigger created event to handle configuration
                            this.event("roomCreated").trigger();
                            return; //no presence eventing till creation is done
                        } else {
                            // Room already exists on server, finish enter
                            this._state = "active";
                            this.event("roomEntered").trigger();
                        }
                    }

                    break;
                case "unavailable":
                    if (occupant && occupant.getPrimaryPresence() !== null) {
                        // this is actually an occupant leaving the room...
                        if (status.attr("code") == "303") {
                            // Nickname change in progress
                            var nnick = item.attr("nick");
                            var onick = occupant.nick;
                            var njid = new jabberwerx.JID({
                                node: this.jid.getNode(),
                                domain: this.jid.getDomain(),
                                resource: nnick
                            });

                            // remember presence so room still appears active
                            var tmpprs = presence.clone();
                            //prs.setFrom(njid.toString());
                            //prs.setType();
                            //this._presenceList.push(presence);
                            this.occupants.rename(occupant, njid);
                            // not really unavailable, so suppress primary update
                            result = false;
                        } else {
                            var myself = occupant.isMe();
                            occupant.updatePresence(presence);
                            if (myself) {
                                this._state = "offline";
                                this.event("roomExited").trigger();
                                this.occupants._clear();
                                this._presenceList = [];
                            }
                            occupant.destroy();
                        }

                    }
                    break;
            }

            this.event("resourcePresenceChanged").trigger({
                fullJid: jid,
                presence: presence,
                nowAvailable: false
            });
            if (result) {
                this.event("primaryPresenceChanged").trigger({
                    fullJid: (type != "unavailable") ? jid : this.jid,
                    presence: (type != "unavailable") ? presence : null
                });
            }

            return result;
        },

        /**
         * <p>Send an invite from this room to specified jids.</p>
         *
         * <p>Send an invite to each specified jid using the given reason. Invite may
         *  be sent through the room (via XEP 0045 7.5.2) or directly to the given jids
         *  (via xep 0249).  Invalid jids are ignored. This method will return a list of all
         *  jids sent invites.
         *  {reason} defaults to {@link jabberwerx.MUCRoom.DefaultInviteReason} </p>
         *
         *  @todo once client caps are fully implemented caps will be checked for direct
         *              invite support before attempting direct invite.
         *  @todo once we support room configurations room will be checked before attempting
         *              mediated invite.
         *  @todo future implementation will use client caps, room configuration and
         *              mediated flag to pick the best send invite method.
         *
         * @param {JID | String | JID[] | String[]} toJids List or single (full or bare) jid(s)
         * @param {String} [reason] Message to send along with invite
         * @param {Boolean} [mediated] Send invite through conference server if possible
         * @returns {JID[]} List of bare jids we succesfully sent invites
         * @throws {jabberwerx.MUCRoom.RoomNotActiveError} if the room is
         *         not currently active.
         */
        invite: function(toJids, reason, mediated) {
            if (!this.isActive()) {
                throw new jabberwerx.MUCRoom.RoomNotActiveError();
            }
            var result = [];
            if (!reason) {
                reason = jabberwerx.MUCRoom.DefaultInviteReason;
            }
            if (!toJids) {
                toJids = [];
            } else if (!jabberwerx.$.isArray(toJids)) {
                toJids = [toJids];
            }

            //template message
            var iMsg = new jabberwerx.Message();
            var updateMessage = function(jid) {
                return iMsg;
            }
            //todo if mediated, check if room allows invites && we have enough privs, throw exception
            if (mediated) {
                //only "message/x/invite to"  changes with each jid, everything else static
                /*
                                     * mediated protocol
                                     * <message
                                     *       from='crone1@shakespeare.lit/desktop'
                                     *       to='darkcave@chat.shakespeare.lit'>
                                     *   <x xmlns='http://jabber.org/protocol/muc#user'>
                                     *       <invite to='hecate@shakespeare.lit'>
                                     *           <reason>
                                     *               Hey Hecate, this is the place for all good witches!
                                     *           </reason>
                                     *       </invite>
                                     *   </x>
                                     * </message>
                                    */

                iMsg.setTo(this.jid);
                var xe = new jabberwerx.NodeBuilder(iMsg.getNode()).
                        element('{http://jabber.org/protocol/muc#user}x').
                        element('invite');
                xe.element('reason').text(reason);
                updateMessage = function(jid) {
                    xe.attribute('to', jid.toString());
                    return iMsg;
                };
            } else {
                //only "/message to" changes with each jid, everything else static
                /*
                                     *
                                     * direct protocol
                                     * <message
                                     *       from='crone1@shakespeare.lit/desktop'
                                     *       to='hecate@shakespeare.lit'>
                                     *   <x xmlns='jabber:x:conference'
                                     *           jid='darkcave@macbeth.shakespeare.lit'
                                     *           reason='Hey Hecate, this is the place for all good witches!'/>
                                     * </message>
                                     */
                new jabberwerx.NodeBuilder(iMsg.getNode()).
                        element('{jabber:x:conference}x').
                        attribute("reason", reason).
                        attribute("jid", this.jid.getBareJID().toString());
                updateMessage = function(jid) {
                    iMsg.setTo(jid);
                    return iMsg;
                };
            }

            for (var i = 0; i < toJids.length; i++) {
                //todo determine best invite method on a per jid basis?
                try {
                    var tjid = jabberwerx.JID.asJID(toJids[i]).getBareJID();
                    this.controller.client.sendStanza(updateMessage(tjid));
                    result.push(tjid);
                }
                catch (ex)  {
                    if (!(ex instanceof jabberwerx.JID.InvalidJIDError)) {
                        throw ex;
                    }
                    //just eat jabberwerx.JID.InvalidJIDError
                }
            }

            return result;
        },


        /**
         * <p>Fetch the room's configuration.
         * Fetch the room's configuration {@link jabberwerx.XDataForm}  and fire callback on result.
         * The callback is passed either the fetched form or an error. </p>
         * <p>The optional function {configCallback} is expected to match the
         * following signature:</p>
         * <p><pre class="code">
         * function callback(form, err) {
         *     form;    //the fetched {@link jabberwerx.XDataForm}
         *                  //null if fetch failed
         *     err;       //Error explaining the failure,
         *                  //undefined if fetch succeeded
         * }
         * </pre>
         * Errors may be
         * {@link jabberwerx.Stanza.ERR_REMOTE_SERVER_TIMEOUT}  if the fetch times out,
         * or any error node found in the fetch result.</p>
         * @param {Function} configCallback Callback fired when fetch is completed.
         * @throws {TypeError} If callback is undefined or not a function.
         * @throws {jabberwerx.MUCRoom.RoomNotActiveError} If room has not entered (or attempted entry)
         */
         fetchConfig: function(configCallback) {
            if (!jabberwerx.$.isFunction(configCallback)) {
                throw new TypeError("fetchConfig requires a callback function");
            }
            //fetch may be called if initializing or active
            if (this._state == "offline") {
                throw new jabberwerx.MUCRoom.RoomNotActiveError();
            }
            var qb = new jabberwerx.NodeBuilder('{http://jabber.org/protocol/muc#owner}query').data;
            this.controller.client.sendIQ(
                "get",
                this.jid,
                qb,
                function (stanza) {
                    var iq = new jabberwerx.IQ(stanza);
                    if (iq.isError()) {
                        configCallback(null, iq.getErrorInfo());
                    } else {
                        var frm = jabberwerx.$("x",iq.getNode()).get(0);
                        if (!frm) {
                            configCallback(null, jabberwerx.Stanza.ERR_SERVICE_UNAVAILABLE);
                        } else {
                            configCallback(new jabberwerx.XDataForm(null, frm));
                        }
                    }
                });
         },

        /**
         * <p>Set the room's configuration.
         * Use the given {@link jabberwerx.XDataForm} (or a generated cancel form if null) to
         * update the room's configuration. Fires the optional callback on result. </p>
         * <p>The optional function {configCallback} is expected to match the
         * following signature:</p>
         * <p><pre class="code">
         * function callback(err) {
         *     err;       //Error explaining the failure,
         *                  //undefined if set succeeded
         * }
         * </pre>
         * Errors may be
         * {@link jabberwerx.Stanza.ERR_REMOTE_SERVER_TIMEOUT}  if the attempt times out,
         * or any error node found in the result.</p>
         * @param  {jabberwerx.XDataForm} configForm The xdata configuration to set, may be null.
         * @param {Function} [configCallback] Callback fired on attempt completion.
         * @throws {TypeError} If callback is defined but not a function or form is defined but not an XDataForm.
         * @throws {jabberwerx.MUCRoom.RoomNotActiveError} If room is not entered (or attempting entry)
         */
        applyConfig: function(configForm, configCallback) {
            if (configForm && !(configForm instanceof jabberwerx.XDataForm)) {
                throw new TypeError("configForm must be null or an XDataForm");
            }
            if (configCallback && !jabberwerx.$.isFunction(configCallback)) {
                throw new TypeError("A defined configCallback must be a function");
            }
            if (this._state == "offline") {
                throw new jabberwerx.MUCRoom.RoomNotActiveError();
            }
            
            var cancel = (!configForm || configForm.getType() == "cancel");
            if (cancel && configCallback) {
                    configCallback();
                }
            
            var that = this;
            var iqcb = cancel ? 
                function (stanza) {} : //ignore results if canceling
                function (stanza) {
                    if (configCallback) {
                        configCallback(new jabberwerx.IQ(stanza).getErrorInfo());
                    }
                };

            configForm = configForm ? configForm : new jabberwerx.XDataForm("cancel");
            var nb = new jabberwerx.NodeBuilder('{http://jabber.org/protocol/muc#owner}query');
            nb.node(configForm.getDOM().data);

            this.controller.client.sendIQ("set", this.jid, nb.data, iqcb);
        },

        /**
         * @private
         */
        _handlePresenceSent: function(evt) {
            if (this.isActive()) {
                var stanza = evt.data.clone();
                stanza.setTo(this.me.jid);

                this.controller.client.sendStanza(stanza);
            }
        },
        /**
         * @private
         */
        _handleRoomErrored: function(evt) {
            var data = evt.data;
            var err = jabberwerx.$(data.getNode()).children("error").get(0);
            var op = "";

            // try to guess the operation...
            switch(data.pType()) {
                case "message":
                    if (data.getSubject()) {
                        op = "changeSubject";
                    } else if (data.getBody()) {
                        op = "sendBroadcast";
                    }
                    break;
                case "presence":
                    if (this.isActive()) {
                        op = "changeNickname";
                    } else {
                        op = "enter";
                    }
                    break;
            }

            if (err) {
                this.event("errorEncountered").trigger({
                    operation: op,
                    error: err
                });
            }
            return true;
        },
        /**
         * @private
         */
        _handleMessageReceived: function(evt) {
            var stanza = evt.data;

            switch (stanza.getType()) {
                case "error":
                    this._handleRoomErrored(evt);
                    break;
                case "groupchat":
                    {
                        var subject = stanza.getSubject();
                        if (subject !== null) {
                            this.properties.subject = subject;
                            this.update();
                            this.event("roomSubjectChanged").trigger(stanza);
                        } else {
                            var body = jabberwerx.$.trim(stanza.getBody());
                            if (body) {
                                this.event("roomBroadcastReceived").trigger(stanza);
                            }
                        }
                    }
                    break;
                case "chat":
                    if (this.controller.client) {
                        var entity = this.occupants.entity(stanza.getFrom());
                        var chat = this.controller.client.controllers.chat;

                        if (chat) {
                            if (!chat.getSession(entity.jid)) {
                                var session = chat.openSession(entity.jid);
                                session.event('chatReceived').trigger(stanza);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }

            return true;
        },

        /**
         * @private
         * applyConfig used when creating a room. method maps applyConfig back to the original on
         * sucessfull configuration or cancel. This method remains mapped through entry errors
         */
        _creationApply: function (configForm, configCallback) {
            if (!configForm || (configForm.getType() == "cancel")) {
                //aborting create/enter
                this.applyConfig = this._origApply;
                delete this._origApply;
                
                //immediatly callback and then finish off exit
                if (configCallback) {
                    configCallback();
                }
                //submit canceled form, ignore results
                this.applyConfig(configForm);
                //send unavail to finish off room destruction
                var stanza = new jabberwerx.Presence();
                stanza.setTo(this.me.jid);
                stanza.setType("unavailable");
                this.controller.client.sendStanza(stanza);
                //cleanup occupants to prevent normal updatePresence(unavailable) behavior
                this.occupants._clear();
                this._presenceList = [];
                //fire errorEncountered aborted event, eventually fires enter error callback
                this.event("errorEncountered").trigger({
                    operation: "enter",
                    error: jabberwerx.Stanza.ERR_BAD_REQUEST.getNode(),
                    aborted: true                            
                });                    
            } else { //submit the form by calling chained apply
            var that = this;
            this._origApply.call(this, configForm, function (cerr) {
                    if (configCallback) {
                        configCallback(cerr);
                    }
                    //switch to entered applyConfig on successfull apply 
                    if (!cerr) {
                        that.applyConfig = that._origApply;
                        delete that._origApply;  
                        
                        that._state = "active";
                        that.event("roomEntered").trigger();
                        //fire delayed "me" presence events (see updatePresence)
                        that._presenceList[0]
                        that.event("resourcePresenceChanged").trigger({
                            fullJid: that.me.jid,
                            presence: that._presenceList[0],
                            nowAvailable: false
                        });
                        that.event("primaryPresenceChanged").trigger({
                            fullJid: that.me.jid,
                            presence: that._presenceList[0]
                        });
                    } //else state remains the same
                });
                    }
        },

        /**
         * @private
         * State of room
         *      offline - only enter and exit (nop) may be invoked
         *      initializing - Attempting to create/join. fetchConfig,applyConfig, exit may be invoked
         *      active - room is fully entered. all methods may be invoked
         * @type String
         */
        _state: "offline",

        /**
         * <p>The cache of MUCOccupants for this room. This is the source for
         * the "entityCreated", "entityUpdated", "entityRenamed", and
         * "entityDestroyed" events on MUCOccupants.</p>
         *
         * @type jabberwerx.MUCOccupantCache
         */
        occupants: null,
        /**
         * <p>The MUCOccupant representing the current user.</p>
         *
         * @type jabberwerx.MUCOccupant
         */
        me: null
    }, "jabberwerx.MUCRoom");

    /**
     * <p>Error thrown when attempting to enter a room that is already
     * active.</p>
     */
    jabberwerx.MUCRoom.RoomActiveError = jabberwerx.util.Error.extend("room already active");
    /**
     * <p>Error thrown when attempting operations on an inactive room.</p>
     */
    jabberwerx.MUCRoom.RoomNotActiveError = jabberwerx.util.Error.extend("room is not active");

    /**
     * @constant
     * Default reason to use with invites when one is not specified
     */
    jabberwerx.MUCRoom.DefaultInviteReason = "You have been invited to a conference room.";

    /**
     * @constant
     * Default phrase to send when changing the subject of a room
     */
    jabberwerx.MUCRoom.DefaultSubjectChange = "has changed the subject to: {0}";
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Server.js*/
/**
 * filename:        Server.js
 * created at:      2008/10/31T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx) {

    jabberwerx.Server = jabberwerx.Entity.extend(/** @lends jabberwerx.Server.prototype */{
        /**
         * @class
         * <p>Represents the server to connect a {@link jabberwerx.Client} to.</p>
         *
         * @description
         * Creates a new Server with the given domain and owning
         * cache.
         * 
         * @param   {String} serverDomain The domain to connect to
         * @param   {jabberwerx.ClientEntityCache} [cache] The owning cache
         * @constructs jabberwerx.Server
         * @extends jabberwerx.Entity
         * @minimal
         */
        init: function(serverDomain, cache) {
            this._super({jid: serverDomain}, cache);
        }
    }, 'jabberwerx.Server');
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/Contact.js*/
/**
 * filename:        Contact.js
 * created at:      2009/05/15T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.Contact = jabberwerx.User.extend(/** @lends jabberwerx.Contact.prototype */{
        /**
         * @class
         * <p>Contact object which represents a user known to the current
         * client. This object SHOULD NOT be created directly.</p>
         *
         * @description
         * <p>Creates a new Contact with the given JID and controller.</p>
         *
         * @param   {jabberwerx.JID} jid The contact JID
         * @param   {jabberwerx.Controller} ctrl The creating controller
         * @throws  {TypeError} If {jid} is invalid; or if {ctrl} is
         *          invalid.
         * @constructs  jabberwerx.Contact
         * @extends     jabberwerx.User
         */
        init: function(jid, ctrl) {
            this._super(jid, ctrl);
        }
    }, "jabberwerx.Contact");

    jabberwerx.RosterContact = jabberwerx.Contact.extend(/** @lends jabberwerx.RosterContact.prototype */ {
        /**
         * @class
         * <p>RosterContact object which is part of a user's roster. This object
         * SHOULD NOT be created directly. Instead, it should be created via
         * {@link jabberwerx.RosterController#addContact}.</p>
         * 
         * <p>This entity has the following in its {@link #properties} map:</p>
         * <table>
         * <tr><th>Name</th><th>Type</th><th>Description</th></tr>
         * <tr><td>name</td><td>String</td><td>The nickname from the server (may be "")</td></tr>
         * <tr><td>subscription</td><td>String</td><td>The subscription state (one of "none", "to", "from", or "both")</td></tr>
         * <tr><td>ask</td><td>String</td><td>The pending subscription state (one of "subscribe", "unsubscribe", or "")</td></tr>
         * </table>
         *
         * @description
         * <p>Creates a new Contact with the given item node and creating
         * RosterController</p>
         *
         * @param   {Element} item A DOM node which represents an
         *          &lt;item&gt; element
         * @param   {jabberwerx.RosterController} roster The creating
         *          RosterController
         * @throws  {TypeError} If {item} is not a valid DOM element; or if
         *          {roster} is not a valid RosterController
         * @constructs jabberwerx.RosterContact
         * @extends jabberwerx.Contact
         */
        init: function(item, roster) {
            if (!(roster && roster instanceof jabberwerx.RosterController)) {
                throw new TypeError("roster must be provided");
            }
            this._super(
                    jabberwerx.$(item).attr("jid"),
                    roster);
            
            this._initializing = true;
            this.setItemNode(item);
            delete this._initializing;
        },
        
        /**
         * <p>Sets the contact node object. Calling this method triggers an
         * "entityUpdated" event.</p>
         *
         * <p>This method SHOULD NOT be called directly.</p>
         * 
         * @param   {Node} node A DOM node which represents an &lt;item&gt;
         *          element
         * @throws {TypeError} if {node} is not valid
         */
        setItemNode: function(node) {
            if (!(node && jabberwerx.isElement(node))) {
                throw new TypeError("node cannot be null");
            }
            
            if (this._node !== node) {
                this._node = node;
                node = jabberwerx.$(node);
                
                // setup properties
                var oldSub = this.properties.subscription;
                this.properties.subscription = node.attr("subscription") || "";
                this.properties.ask = node.attr("ask") || "";
                this.properties.name = node.attr("name") || "";
                
                var newSub = this.properties.subscription;
                if (    !(!oldSub || oldSub == "from" || oldSub == "none") &&
                        (!newSub || newSub == "from" || newSub == "none")) {
                    this.updatePresence(null, true);
                } else if ( !(!newSub || newSub == "from" || newSub == "none") &&
                            !this.getPrimaryPresence()) {
                    var prs = new jabberwerx.Presence();
                    prs.setType("unavailable");
                
                    var jid = jabberwerx.JID.asJID(node.attr("jid")).getBareJID();
                    prs.setFrom(jid);
                    this.updatePresence(prs, true);
                }
                                
                // setup displayName manually
                this._displayName = this.properties.name;
                
                // setup groups manually
                this._groups = node.children("group").
                        map(function() { return jabberwerx.$(this).text(); }).
                        get() || [];
                
                // trigger event manually
                if (!this._initializing && this._eventing["updated"]) {
                    this._eventing["updated"].trigger(this);
                }
            }
        },
        /**
         * Get the contact node object
         * 
         * @returns {Node} A DOM node which represents an &lt;item&gt; element
         */
        getItemNode: function() {
            return this._node;
        },
        
        /**
         * <p>Retrieves the display name of this contact. This method overrides
         * the base to use the properties name, or the default implementation if
         * no server-side name is present.</p>
         *
         * @returns {String} The display name
         */
        getDisplayName: function() {
            return this.properties.name || this._super();
        },
        /**
         * <p>Changes or removes the display name for this Contact. This
         * method overrides the base class to instead change the display
         * name via {@link jabberwerx.RosterController#updateContact}.</p>
         * @param {String}name The display name to be set
         */
        setDisplayName: function(name) {
            if (name != this._displayName) {
                this.controller.updateContact(
                        this.jid,
                        name,
                        this.getGroups());
            }
        },
        /**
         * <p>Changes or removes the groups for this Contact. This
         * method overrides the base class to instead operate via
         * {@link jabberwerx.RosteControllerr#updateContact}.</p>
         * @param {String] The name of groups
         */
        setGroups: function(groups) {
            this.controller.updateContact(
                    this.jid,
                    this.properties.name,
                    groups);
        },
        
        /**
         * <p>Deletes this Contact. This method overrides the base class to
         * instead operate via {@link jabberwerx.RosterController#deleteContact}.</p>
         */
        remove: function() {
            this.controller.deleteContact(this.jid);
        },

        /**
         * @private
         */
        _handleUnavailable: function(presence) {
            if (this.properties.subscription == "both" ||
                this.properties.subscription == "to" ||
                this.properties.temp_sub) {
                var pres = this.getPrimaryPresence();
                if (!pres) {
                    this._insertPresence(presence);
                } else if (pres.getType() == "unavailable") {
                    this._clearPresenceList();
                    this._insertPresence(presence);
                }
            }
        },
        
        /**
         * @private
         */
        _node: null
    }, 'jabberwerx.RosterContact');
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/TemporaryEntity.js*/
;(function(){
	if (jabberwerx) {
        jabberwerx.TemporaryEntity = jabberwerx.Entity.extend(/** @lends jabberwerx.TemporaryEntity.prototype */ {
            /**
             * @class
             * <p>An empty extension of jabberwerx.Entity. Used when storing presence status for user's who
             * would otherwise not be in the entity set..</p>
             *
             *
             * @description
             * <p>An empty extension of jabberwerx.Entity</p>
             * @param   {String|jabberwerx.JID} [jid] The identifying JID
             * @param   {jabberwerx.Controller|jabberwerx.EntitySet} [cache] The
             *          controller or cache for this entity
             * @extends jabberwerx.Entity
             * @constructs jabberwerx.TemporaryEntity
             * @minimal
             */
            init: function(jid, cache) {
                this._super({jid: jid}, cache);
            }
        }, 'jabberwerx.TemporaryEntity');
    }
})();
/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/ErrorReporter.js*/
/**
 * filename:        ErrorReporter.js
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx) {
    jabberwerx.ErrorReporter = jabberwerx.JWBase.extend(/** @lends jabberwerx.ErrorReporter.prototype */{
        /**
         * @class
         * <p>This class manages user-friendly strings for error cases.</p>
         *
         * <p><b>NOTE:</b> This class should not be created directly. Use the
         * singleton {@link jabberwerx.errorReporter} instead.</p>
         *
         * @description
         * <p>Creates a new ErrorReporter.</p>
         *
         * <p><b>NOTE:</b> This class should not be created directly. Use the
         * singleton {@link jabberwerx.errorReporter} instead.</p>
         *
         * @constructs jabberwerx.ErrorReporter
         * @extends jabberwerx.JWBase
         */
         init: function() {
            this._super();
         },


        /**
         * <p>Returns a user-friendly string associated with
         * the error object passed in.</p>
         *
         * @param {string|Element} err Error object.
         * @returns {string} Error message associated with err.
         */
        getMessage: function(err) {
            if (err) {
                if (jabberwerx.isElement(err)) {
                    var msg;
                    var textMsg;
                    for (var i = 0; i < err.childNodes.length; i++) {
                        var node = err.childNodes[i];

                        if (node.nodeName == 'text') {
                            textMsg = jabberwerx.$(node).text();
                        } else {
                            var error = '{'+node.getAttribute('xmlns')+'}'+node.nodeName;
                            msg = this._errorMap[error];
                            if (msg) {
                                return msg;
                            }
                        }
                    }

                    if (textMsg) {
                        return textMsg;
                    }
                } else if (err.message) {
                    var msg = this._errorMap[err.message];
                    if (msg) {
                        return msg;
                    }
                }
            }
            return this._errorMap[""];
        },

        /**
         * <p>Adds an entry to the error map to associate an error
         * with user-friendly message.</p>
         *
         * @param {string} key The string representation of the error.
         * @param {string} value The user-friendly message to associate with the key.
         * @throws {TypeError} if {value} is not a string.
         */
        addMessage: function(key, value) {
            if (!value || typeof(value) != "string") {
                throw new TypeError("value must be a string.");
            }

            if (key) {
                this._errorMap[key] = value;
            }
        },

        /**
         * @private
         */
        _errorMap: {"" : "Operation failed",
            "{urn:ietf:params:xml:ns:xmpp-streams}conflict" :
                "This resource is logged in elsewhere.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}bad-request" :
                "The request was not valid.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}conflict" :
                "Conflicting names were encountered.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}feature-not-implemented" :
                "This feature is not yet implemented. Sorry for the inconvenience.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}forbidden" :
                "You are not authorized to perform this action.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}internal-server-error" :
                "An unknown server error occurred. Contact your administrator.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}item-not-found" :
                "The requested item could not be found.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}jid-malformed" :
                "The JID is not valid.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}not-acceptable" :
                "The given information was not acceptable.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}not-allowed" :
                "You are not allowed to perform this action.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}not-authorized" :
                "You are not authorized to perform this action.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}undefined-condition" :
                "An unknown error occurred. Contact your administrator.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}unexpected-request" :
                "Did not expect the request at this time.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}registration-required" :
                "You must register with the service before continuing.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}remote-server-not-found" :
                "Could not find the requested server.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}remote-server-timeout" :
                "Unable to contact the server.",
            "{urn:ietf:params:xml:ns:xmpp-stanzas}service-unavailable" :
                "This service is not available. Try again later.",
            "{urn:ietf:params:xml:ns:xmpp-sasl}temporary-auth-failure" :
                "Unable to login. Check username and password.",
            "{urn:ietf:params:xml:ns:xmpp-sasl}mechanism-too-weak" :
                "You are not authorized to perform this action.",
            "{urn:ietf:params:xml:ns:xmpp-sasl}not-authorized" :
                "Unable to login. Check username and password."
        }

    }, "jabberwerx.ErrorReporter");

    /**
     * <p>The singleton object of ErrorReporter. Use this instead of creating
     * a new ErrorReporter object.</p>
     */
    jabberwerx.errorReporter = new jabberwerx.ErrorReporter();
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/ChatSession.js*/
;(function(){
    if (jabberwerx) {
        jabberwerx.ChatSession = jabberwerx.JWModel.extend(/** @lends jabberwerx.ChatSession.prototype */ {
            /**
             * @class
             * <p>Represents a chat session with another user. There is only one ChatSession object
             * per bare jid. The locked resource (if the session is currently locked) is specified
             * by the jid property.</p>
             *
             * <p>
             * This class provides the following events:
             * <ul>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.ChatSession">jabberwerx.ChatSession</a></li>
             * </ul>
             *
             * @description
             * <p>Creates a new ChatSession with the given client, jid, and
             * optional thread</p>
             *
             * @param   {jabberwerx.Client} client The client object with which
             *          event observees are registered.
             * @param   {jabberwerx.JID|String} jid A JID object or JID string
             *          to use as a basis for a jid.
             * @param   {String} [thread] The thread value to use for this
             *          conversation.
             * @throws  {TypeError} if {client} is not valid
             * @throws  {jabberwerx.JID.InvalidJIDError} if {jid} does not represent
             *          a valid JID
             * @constructs jabberwerx.ChatSession
             * @extends jabberwerx.JWModel
             */
            init: function(client, jid, thread) {
                this._super();
                
                this._statesReady = false;
                if (client instanceof jabberwerx.Client) {
                    this.client = client;
                    this.controller = client.controllers.chat ||
                                      new jabberwerx.ChatController(client);
                } else {
                    throw new TypeError("client must be a jabberwerx.Client");
                }
                
                this.jid = jabberwerx.JID.asJID(jid);
                if (!thread) {
                    thread = this._generateRandomThreadValue();
                }
                this.thread = thread;
                
                // Set up events
                this.applyEvent('beforeChatSent');
                this.applyEvent('chatSent');
                this.applyEvent('chatReceived');
                this.applyEvent('threadUpdated');
                this.applyEvent('chatStateChanged');
                this.applyEvent('lockedResourceChanged');

                // Figure out if this is a private message.
                this.privateMessage = this.controller.isPrivateMessage(this.jid);
                if (this.privateMessage) {
                    this._MUCController = client.controllers.muc ||
                                          new jabberwerx.MUCController(client);

                } 

                this._bindHandlers();

                var handlerFunc = this.invocation("_entityChangedHandler");
                this._getEntitySet().event("entityCreated").bind(handlerFunc);
                this._getEntitySet().event("entityDestroyed").bind(handlerFunc);
                
                if (this.privateMessage) {
                    this._getEntitySet().event("entityRenamed").
                         bind(this.invocation("_entityRenamedHandler"));
                }
            },

            /**
             * @private
             */
            _bindHandlers: function() {
                var bindJid = (this.privateMessage) ?
                              this.jid.toString() :
                              this.jid.getBareJIDString();

                // Set up handlers
                var handlerFunc = this.invocation('_chatReceivedHandler');
                this.client.event('messageReceived').bindWhen("message[from^='"
                    + bindJid +"'][type!='groupchat']", handlerFunc);
                // Keep reference to handler for unbinding later
                this._handlerList.push({event: 'messageReceived', handler: handlerFunc});
                
                handlerFunc = this.invocation('_remoteStateChangedHandler');
                this.client.event('messageReceived').bindWhen("message[from^='"
                    + bindJid +"'][type='chat'] *[xmlns='http://jabber.org/protocol/chatstates']",
                    handlerFunc);
                this._handlerList.push({event: 'messageReceived', handler: handlerFunc});
                
                handlerFunc = this.invocation('_presenceChangeHandler');
                this.client.event('presenceReceived').bindWhen(this.invocation('_presenceReceivedFilter'), handlerFunc);
                this._handlerList.push({event: 'presenceReceived', handler: handlerFunc});
            },

            /**
             * @private
             */
            _getEntitySet: function() {
                if (this.privateMessage) {
                    return this._MUCController.room(this.jid).occupants;
                } else {
                    return this.client.entitySet;
                }
            },
            
            /**
             * <p>Retrieves the entity associated with this ChatSession.</p>
             *
             * @returns {jabberwerx.Entity} The entity for {@link jabberwerx.ChatSession#jid}
             */
            getEntity: function() {
                if (!this._entity) {
                    if (this.privateMessage) {
                        this._entity = this._getEntitySet().entity(this.jid);
                    } else {
                        var jid = this.jid.getBareJID();
                        this._entity = this._getEntitySet().entity(jid) ||
                                       new jabberwerx.TemporaryEntity(jid, this._getEntitySet());
                    }
                }
                
                return this._entity;
            },
            /**
             * @private
             */
            _entityChangedHandler: function(evt) {
                if (this.privateMessage && (this.jid.toString() != evt.data.jid.toString())) {
                    return;
                }
                if (this.jid.getBareJIDString() != evt.data.jid.getBareJIDString()) {
                    return;
                }
                
                switch (evt.name.substring("entity".length)) {
                    case "destroyed":
                        this._entity = undefined;
                        break;
                    case "created":
                        this._entity = evt.data;
                        break;
                }
            },

            /**
             * @private
             */
            _entityRenamedHandler: function(evt) {
                if (evt.data.jid && (evt.data.jid == this.jid)) {
                    this.jid = evt.data.entity.jid;

                    this._unbindHandlers();
                    this._bindHandlers();
                }
            },
            
            /**
             * Sends a message to the correspondent. Fires the
             * chatStateChanged, beforeChatSent and chatSent events.
             *
             * @param {String} body The body of the message to send
             */
            sendMessage: function(body) {
                if (!body) {
                    return;
                }
                this._statesReady = true;
                
                var msg = this._generateMessage('active', body);
                this.localState = 'active';
                this.event('chatStateChanged').trigger({jid: null,
                                                        state: this.localState});
                this.event('beforeChatSent').trigger(msg);
                this.client.sendStanza(msg);
                this.event('chatSent').trigger(msg);
            },
            
            /**
             * Set this clients chat state (XEP-0085). Can be one of 'active',
             * 'composing', 'paused', 'inactive' or 'gone'. Sends out message
             * specifying the new chat state provided the ChatControllers 
             * sendChatStates flag is set to true.
             *
             * @param   {String} state The state to set this client to.
             * @returns  {Boolean} true if successfully changed, otherwise false
             * @throws  {jabberwerx.ChatSession.StateNotSupportedError} thrown
             *          if an unsupported state is specified as the argument.
             */
            setChatState: function(state) {
                var retVal = false;
                if (this._setChatStateProperty(state)) {
                    retVal = true;
                    
                    var msg = this._generateMessage(state);
                    if (msg && this.client.isConnected()) {
                        this.client.sendStanza(msg);
                    }
                }
                return retVal;
            },
            
            /**
             * @private
             * Set the chat localState property. Only updates the localState
             * property if the argument differs from the current state.
             *
             * @param   {String} state The state to set this chat session to
             * @returns  {Boolean} true if successfully changed, otherwise false
             * @throws  {jabberwerx.ChatSession.StateNotSupportedError} thrown
             *          if an unsupported state is specified as the argument.
             */
            _setChatStateProperty: function(state) {
                var retVal = false;
                if (jabberwerx.$.inArray(state, ['active', 'composing', 'paused', 'inactive', 'gone']) >= 0) {
                    if (state != this.localState) {
                        this.localState = state;
                        this.event('chatStateChanged').trigger({jid: null,
                                                                state: this.localState});
                        retVal = true;
                    }
                } else {
                    var err = new jabberwerx.ChatSession.StateNotSupportedError("The chat state '"
                        + state + "' is not supported. Should be one of 'active', 'composing'," +
                        "'paused', 'inactive' or 'gone'");
                    throw err;
                }
                return retVal;
            },
            
            /**
             * Method called to clean up object. This method unbinds all
             * handlers for client events and sends 'gone' chat state.
             */
            destroy: function() {
                this._unbindHandlers();
                
                var handlerFunc = this.invocation("_entityChangedHandler");
                this._getEntitySet().event("entityCreated").unbind(handlerFunc);
                this._getEntitySet().event("entityDestroyed").unbind(handlerFunc);

                if (this.privateMessage) {
                    this._getEntitySet().event("entityRenamed").
                         unbind(this.invocation("_entityRenamedHandler"));
                }
                
                this.setChatState('gone');
                this.controller.closeSession(this);
                
                this._super();
            },

            /**
             * @private
             */
            _unbindHandlers: function() {
                var client = this.client;
                jabberwerx.$.each(this._handlerList, function() {
                    client.event(this.event).unbind(this.handler);
                });
            },
            
            /**
             * @private
             * Generates a Message object which can be sent to the correspondent.
             * Will only include the current chatstate when the ChatControllers
             * sendChatStates flag is set to true.
             *
             * <tt>body</tt> may be plaintext, a root HTML element, a <body/> element 
             *  in the XHTML namespace (see xep-71) or an array of HTML elements.         
             *  see {@link jabberwerx.Stanza.setHTML} for additional information.
             *
             * @param   {String} chatstate The chatstate to include in this
             *          message
             * @param   {String|DOM|Array} [body] The plaintext or HTML body to insert into the Message
             *          object.
             * @returns  {jabberwerx.Message} The resultant message object
             */
            _generateMessage: function(chatstate, body) {
                if (!this._statesReady) {
                    return null;
                }
                var msg = null;
                if (body) {
                    msg = new jabberwerx.Message();
                    msg.setThread(this.thread);
                    if (jabberwerx.isElement(body) || jabberwerx.$.isArray(body)) {
                        msg.setHTML(body);
                    } else {
                        msg.setBody(body);
                    }
                }
                if (this.controller.sendChatStates) {
                    msg = msg || new jabberwerx.Message();
                    var nodeBuilder = new jabberwerx.NodeBuilder(msg.getNode());
                    nodeBuilder.element('{http://jabber.org/protocol/chatstates}' + chatstate);
                }
                if (msg) {
                    msg.setType('chat');
                    msg.setTo(this.jid);
                }
                return msg;
            },
            
            /**
             * @private
             */
            _chatReceivedHandler: function(eventObj) {
                var msg = eventObj.data;
                this._updateLockedResource(msg.getFromJID());
                this._updateThread(msg.getThread());

                this._statesReady = !msg.isError();

                if (msg.getBody() || msg.isError()) {
                    this.event('chatReceived').trigger(msg);
                }
                return false;
            },
            
            /**
             * @private
             */
            _updateLockedResource: function(jid) {
                // private messages don't do this.
                if (this.privateMessage) {
                    return;
                }
                if (jid.getResource() != this.jid.getResource()) {
                    this.jid = jid;
                    this.event('lockedResourceChanged').trigger(this.jid);
                }
            },
            
            /**
             * @private
             */
            _updateThread: function(thread) {
                if (thread && thread != this.thread) {
                    this.thread = thread;
                    this.event('threadUpdated').trigger({jid: this.jid, thread: this.thread});
                }
            },
            
            /**
             * @private
             */
            _remoteStateChangedHandler: function(eventObj) {
                var stateNode = eventObj.selected;
                if (this.remoteState != stateNode.nodeName) {
                    // Set the remoteState property and fire the chatStateChanged event
                    this.remoteState = stateNode.nodeName;
                    this.event('chatStateChanged').trigger({jid: this.jid, state: this.remoteState});
                    // Unlock the resource and create a new thread id if the new state is "gone"
                    if (this.remoteState == "gone") {
                        this._updateLockedResource(eventObj.data.getFromJID().getBareJID());
                        this.thread = this._generateRandomThreadValue();
                    }
                }
                return false;
            },
            
            /**
             * @private
             */
            _presenceChangeHandler: function(eventObj) {
                this._updateLockedResource(eventObj.data.getFromJID().getBareJID());
                return false;
            },
            
            /**
             * @private
             */
            _generateRandomThreadValue :function() {
                var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
                var string_length = 10;
                var threadValue = '';
                for (var i=0; i<string_length; i++) {
                    var rnum = Math.floor(Math.random() * chars.length);
                    threadValue += chars.substring(rnum,rnum+1);
                }
                return 'JW_' + threadValue;
            },
            
            /**
             * @private
             */
            _presenceReceivedFilter: function(presence) {
                var type = presence.getType();
                var presJid = (this.privateMessage) ?
                              presence.getFromJID().toString() :
                              presence.getFromJID().getBareJIDString();
                var jid = (this.privateMessage) ?
                          this.jid.toString() :
                          this.jid.getBareJIDString();
                if (presJid == jid && (!type || type == 'unavailable') ) {
                    return presence;
                }
                return false;
            },
            
            /**
             * The jid with which this chat session is communicating.
             * If the chat session has locked onto a resource, the resource
             * value can be found by using {@link jabberwerx.JID#getResource}.
             * @type jabberwerx.JID
             */
            jid : null,
            
            /**
             * Thread element for this chat session. Included in all outgoing
             * messages. Mirrors the value of the thread element been received
             * in messages from the correspondent (if present).
             * @type String
             */
            thread : null,
            
            /**
             * Our current chat state (XEP-0085) in this chat session. It can
             * be one of 'active', 'composing', 'paused', 'inactive' or 'gone'.
             * State is set to active automatically when {@link #sendMessage}
             * is called and set to gone automatically when {@link #destroy} is
             * called.
             *
             * <p><b>Note: Do not set this property directly; Use
             * {@link #setChatState} instead.</b></p>
             * @type String
             */
            localState: null,
            
            /**
             * The state of the correspondent in this session.
             * @type String
             */
            remoteState: null,
            
            /**
             * Used to bind to events and send messages
             * @type jabberwerx.Client
             */
            client : null,
            
            /**
             * The Controller that created this ChatSession
             * @type jabberwerx.ChatController
             */
            controller : null,

            /**
             * Indicates if this session is for a private message.
             * @type Boolean
             */
            privateMessage : false,
            
            /**
             * @private
             * <p>Keeps a list of handlers registered for client events. This
             * list is then used to unbind from those events when the session
             * is to be closed. Objects place in this list should be of the
             * format:</p>
             * <p><pre class="code">{
             *      event: String,
             *      handler: function
             * }</pre></p>
             */
            _handlerList : []
        }, 'jabberwerx.ChatSession');
        
        /**
         * Thrown when a client tries to set this chat session's state to an
         * unsupported state.
         */
        jabberwerx.ChatSession.StateNotSupportedError = jabberwerx.util.Error.extend();
    }
})();

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/PrivacyList.js*/
/**
 * filename:        PrivacyList.js
 * created at:      2009/10/26T00:00:00-07:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx) {
    jabberwerx.PrivacyList = jabberwerx.JWModel.extend(/** @lends jabberwerx.PrivacyList.prototype */{
        /**
         * @class
         * <p>Representation of a XEP-0016 privacy list. This class manages
         * a privacy list to block (or removing blocking of) specific JIDs.
         * It does not provide for any other allow/deny logic from XEP-0016.</p>
         *
         * @description
         * <p>Creates a new PrivacyList with the given &lt;list/&gt; and
         * PrivacyListController.</p>
         *
         * <p><b>NOTE:</b> This type should not be created directly. Instead use
         * {@link jabberwerx.PrivacyListController#fetch}.</p>
         *
         * @param       {Element} listNode The element representing the list
         * @param       {jabberwerx.PrivacyListController} ctrl The owning
         *              controller
         * @throws      {TypeError} If {listNode} is not a &lt;list/&gt;
         *              element; or if {ctrl} is not a PrivacyListController
         * @constructs  jabberwerx.PrivacyList
         * @extends     jabberwerx.JWModel
         * @see         <a href='http://xmpp.org/extensions/xep-0016.html'>XEP-0016: Privacy Lists</a>
         */
        init: function(listNode, ctrl) {
            this._super();
            
            if (!jabberwerx.isElement(listNode)) {
                throw new TypeError("listNode must be an Element");
            }
            this._DOM = jabberwerx.$(listNode);
            
            if (!(ctrl && ctrl instanceof jabberwerx.PrivacyListController)) {
                throw new TypeError("controller must be a PrivacyListController");
            }
            this.controller = ctrl;
        },
        /**
         * <p>Destroys this privacy list. This method removes any event callbacks
         * it registered.</p>
         */
        destroy: function() {
            this.controller._remove(this.getName());
            this._super();
        },

        /**
         * <p>Retreives the name of this privacy list.</p>
         *
         * @returns  {String} The list name
         */
        getName: function() {
            return this._DOM.attr("name");
        },
        /**
         * <p>Retrieves the list of blocked JIDs. The returned list
         * is a snapshot of the JIDs marked as blocked at the time this
         * method is called.</p>
         *
         * @returns  {jabberwerx.JID[]} The list of blocked JIDs
         */
        getBlockedJids: function() {
            var fn = function() {
                var item = jabberwerx.$(this);
                if (item.attr("type") != "jid") {
                    return null;
                }
                if (item.attr("action") != "deny") {
                    return null;
                }
                
                return jabberwerx.JID.asJID(item.attr("value"));
            };
            
            return this._DOM.children().map(fn).get();
        },
        
        /**
         * <p>Block the given JID. This method adds an item to the
         * privacy list with type is "jid", action is "deny", and
         * value is {jid}.</p>
         *
         * <p><b>NOTE:</b> this method does not update the server.
         * Call {@link #update} to commit changes to this privacy list.</p>
         *
         * @param   {String|jabberwerx.JID} jid The JID to block
         * @throws  {jabberwerx.JID.InvalidJIDError} If {jid} is not valid
         */
        blockJid: function(jid) {
            jid = jabberwerx.JID.asJID(jid).getBareJIDString();
            
            var item = this._DOM.find("item[type=jid][value=" + jid + "]");
            if (!this._cleanDOM) {
                this._cleanDOM = jabberwerx.$(this._DOM.get(0).cloneNode(true));
            }
            if (!item.length) {
                item = new jabberwerx.NodeBuilder(this._DOM.get(0)).
                        element("item").
                        attribute("action", "deny").
                        attribute("type", "jid").
                        attribute("value", jid);
                item = jabberwerx.$(item.data);
            } else {
                item.attr("action", "deny");
                // make sure we block everything!!
                item.empty();
                item.remove();
            }

            this._DOM.prepend(item);
            
            // note we blocked
            this._updateDirty(jid, this._blocked, this._unblocked);
        },
        /**
         * <p>Unblock the given JID. This method removes an item from the
         * privacy list where the type is "jid", action is "deny", and value
         * is equal to {jid}.</p>
         *
         * <p><b>NOTE:</b> this method does not update the server.
         * Call {@link #update} to commit changes to this privacy list.</p>
         *
         * @param   {String|jabberwerx.JID} jid The JID to unblock
         * @throws  {jabberwerx.JID.InvalidJIDError} If {jid} is not valid
         */
        unblockJid: function(jid) {
            jid = jabberwerx.JID.asJID(jid).getBareJIDString();
            
            var item = this._DOM.find("item[type=jid][value=" + jid + "]");
            if (item.length) {
                if (!this._cleanDOM) {
                    this._cleanDOM = jabberwerx.$(this._DOM.get(0).cloneNode(true));
                }
                item.remove();
                // note we unblocked
                this._updateDirty(jid, this._unblocked, this._blocked);
            }
            
        },
         /**
         * @private
         */
        _update: function(listNode) {
            this._DOM = jabberwerx.$(listNode);
            this._blocked = [];
            this._unblocked = [];
        },        
        
        /**
         * @private
         */
        _updateDirty: function(jid, added, remed) {
            var idxOf = function(arr) {
                for (var idx = 0; idx < arr.length; idx++) {
                    if (arr[idx] == jid) {
                        return idx;
                    }
                }
                
                return -1;
            };
            var idx;
            idx = idxOf(remed);
            if (idx != -1) {
                remed.splice(idx, 0);
            }
            idx = idxOf(added);
            if (idx == -1) {
                added.push(jid);
            }
        },
        
        /**
         * <p>Updates the server with this privacy list's current state. This
         * method sends the current list to the server. It first sends
         * &lt;presence type='unavailable'/&gt; to each newly blocked JID, and
         * resends the last &lt;presence/&gt; update if any JIDs were
         * unblocked.</p>
         *
         * <p>This method will ultimately trigger the "privacyListUpdated" event
         * if successful, or "errorEncountered" event if the update failed.</p>
         *
         * <p>The value of {cb} is either "undefined" or a function matching the
         * following:</p>
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this jabberwerx.PrivacyList
         *      err;    // undefined if the update succeeded, or
         *              // the &lt;error/&gt; element if update failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback to execute when updated
         * @throws  {TypeError} If {cb} is not undefined and not a function
         */
        update: function(cb) {
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            // recalculate 'order' of list items
            var items = this._DOM.children();
            if (!items.length) {
                // all JIDs removed; add a "allow all" default
                new jabberwerx.NodeBuilder(this._DOM.get(0)).
                        element("item").
                        attribute("action", "allow");
                items = this._DOM.children();
            }
            items.each(function(idx) {
                //we are going to use the item's index as it's new order
                jabberwerx.$(this).attr("order", idx);
            });
            
            var ctrl = this.controller;
            var client = ctrl.client;
            
            // send presence[type=unavailable] to blocked JIDs
            var prs = new jabberwerx.Presence();
            prs.setType("unavailable");
            for (var idx = 0; idx < this._blocked.length; idx++) {
                var jid = this._blocked[idx];
                var ent = client.entitySet.entity(jid);
                if (!ent) {
                    continue;
                }
                if (!ent.getPrimaryPresence()) {
                    continue;
                }
                prs.setTo(jid);
                client.sendStanza(prs);
            }
            
            var blocked = this._blocked;
            var unblocked = this._unblocked;
            var that = this;
            var fn = function(evt) {
                // prepare current presence
                var prs = client.getCurrentPresence().clone();
                prs.setFrom();
                prs.setTo();
                
                switch (evt.name) {
                    case "errorencountered":
                        if (blocked.length) {
                            client.sendStanza(prs);
                        }
                        if (cb) {
                            cb.call(that, evt.data.error);
                        }
                        break;
                    case "privacylistupdated":
                        if (unblocked.length) {
                            client.sendStanza(prs);
                        }
                        if (cb) {
                            cb.call(that);
                        }
                        break;
                }
                
                ctrl.event("errorEncountered").unbind(arguments.callee);
                ctrl.event("privacyListUpdated").unbind(arguments.callee);
            };
            
            
            ctrl.event("errorEncountered").bindWhen(
                    function(data) {
                        return (data.target === that) ? that : null },
                    fn);
            ctrl.event("privacyListUpdated").bindWhen(
                    function(data) { return (data === that) ? that : null },
                    fn);
            var query = new jabberwerx.NodeBuilder("{jabber:iq:privacy}query");
            query = jabberwerx.$(query.data);
            query.append(this._DOM.get(0).cloneNode(true));
            
            client.sendIq("set", null, query.get(0), function(stanza) {
                var err = new jabberwerx.IQ(stanza).getErrorInfo();
                if (err && that._cleanDOM) {
                    // revert to original and trigger event
                    that._DOM = that._cleanDOM;
                    ctrl.event("errorEncountered").trigger({
                        operation: "update",
                        target: that,
                        error: err.getNode()
                    });
                }
                delete that._cleanDOM;
            });
        },
        /**
         * <p>Removes the list from the server. This method also calls
         * {@link #destroy} on this PrivacyList object.</p>
         *
         * <p>If a callback is provided, it's signature is expected to match
         * following:</p>
         * <pre class="code">
         *  function callback(err) {
         *      this;       // this PrivacyList object
         *      err;        // the &lt;error/&gt; element, or undefined if
         *                  // successful
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is not undefined and not a function
         */
        remove: function(cb) {
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            if (cb) {
                var ctrl = this.controller;
                var that = this;
                var fn = function(evt) {
                    var err = (evt.name == "errorencountered") ?
                            evt.data.error :
                            undefined;
                    cb.call(that, err);
                    
                    ctrl.event("errorEncountered").unbind(arguments.callee);
                    ctrl.event("privacyListRemoved").unbind(arguments.callee);
                };
                
                ctrl.event("errorEncountered").bindWhen(
                        function(data) { return (data.target === that) ? that : null; },
                        fn);
                ctrl.event("privacyListRemoved").bindWhen(
                        function(data) { return (data === that) ? that : null; },
                        fn);
            }
            
            var query = new jabberwerx.NodeBuilder("{jabber:iq:privacy}query").
                    element("list").
                    attribute("name", this.getName()).
                    parent;
            this.controller.client.sendIq("set", null, query.data);
        },

        /**
         * Called just prior to this object being serialized. This method
         * serializes the underlying &lt;list/&gt; element into its
         * XML representation.
         */
        willBeSerialized: function() {
            if (this._DOM) {
                this._serializedXML = this._DOM.get(0).xml;
                delete this._DOM;
            }
        },
        /**
         * Called just after this object is unserialized. This method
         * unserializes the underlying &lt;list/&gt; element into its
         * DOM representation.
         */
        wasUnserialized: function() {
            if (this._serializedXML) {
                this._DOM = jabberwerx.$(jabberwerx.util.unserializeXML(this._serializedXML));
                delete this._serializedXML;
            }
        },
        
        /**
         * @private
         */
        _blocked: [],
        /**
         * @private
         */
        _unblocked: [],
        /**
         * @private
         */
        _DOM: null
    }, "jabberwerx.PrivacyList");
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/PubSubNode.js*/
/**
 * filename:        PubSubNode.js
 * created at:      2009/11/09T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.PubSubItem = jabberwerx.JWModel.extend(/** @lends jabberwerx.PubSubItem.prototype */{
        /**
         * @class
         * <p>Represents a publish-subscribe item.</p>
         *
         * @description
         * <p>Creates a new PubSubItem with the given DOM element.</p>
         *
         * <p><b>NOTE:</b> This type should not be created directly. Instead,
         * the PubSubNode creates instances of PubSubItem as needed.</p>
         *
         * @param   {Element} dom The &lt;item/&gt; element
         * @constructs  jabberwerx.PubSubItem
         * @extends     jabberwerx.JWModel
         */
        init: function(dom) {
            this._super();
            
            this._update(dom);
        },
        /**
         * <p>Destroys this PubSubItem.</p>
         */
        destroy: function() {
            this._super();
        },
        
        /**
         * <p>Called when this object is about to be serialized. This method
         * converts the timestamp from a Date object to the number of seconds
         * since the Epoch.</p>
         */
        willBeSerialized: function() {
            this.timestamp = this.timestamp.getTime();
        },
        /**
         * <p>Called just after this object is unserialized. This method
         * converts the timestamp from the number of seconds since the Epoch
         * to a Date object.</p>
         */
        wasUnserialized: function() {
            this.timestamp = new Date(this.timestamp);
        },
        
        /**
         *
         */
        _update: function(dom) {
            dom = jabberwerx.$(dom);
            var val;
            
            val = dom.attr("publisher");
            this.publisher = (val) ? jabberwerx.JID.asJID(val) : null;
            
            val = dom.attr("timestamp");
            this.timestamp = (val) ? jabberwerx.parseTimestamp(val) : new Date();
            
            this.id = dom.attr("id");
            this.data = dom.children().get(0);
        },
        
        /**
         * <p>The identifier of this item.</p>
         *
         * @type String
         */
        id: null,
        
        /**
         * <p>The publisher of this item, or <tt>null</tt> if unknown.</p>
         *
         * @type jabberwerx.JID
         */
        publisher:  null,
        /**
         * <p>The timestamp for this item, or the current time at creation
         * if not otherwise known.</p>
         *
         * @type Date
         */
        timestamp: null,
        /**
         * <p>The payload of the item as a DOM element, or null if none.</p>
         *
         * @type Element
         */
        data: null
    }, "jabberwerx.PubSubItem");
    
    jabberwerx.PubSubNode = jabberwerx.Entity.extend(/** @lends jabberwerx.PubSubNode.prototype */ {
        /**
         * @class
         * <p>Represents a publish-subscribe node.</p>
         *
         * <p>
         * This class provides the following events:
         * <ul>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.PubSubNode">jabberwerx.PubSubNode</a></li>
         * </ul>
         *
         * @description
         * <p>Creates a new PubSubNode for the given JID, node, and
         * PubSubController (or delegate).</p>
         *
         * <p>If this PubSubNode is created with a delegate, the owning
         * controller is the delegate's controller. A delegated PubSubNode
         * (one that has a delegate) is mostly just a container of
         * published items, relying on the delegate to perform most
         * operations.</p>
         *
         * <p><b>NOTE:</b> This type should not be constructed directly.
         * Instead, use {@link jabberwerx.PubSubController#node} to obtain an
         * instance.</p>
         *
         * @param   {jabberwerx.JID} jid The JID
         * @param   {String} node The node
         * @param   {jabberwerx.PubSubController|jabberwerx.PubSubNode} ctrl The
                    owning controller or delegate
         * @throws  {TypeError} If {ctrl} is not valid; or if {node} is not
         *          valid
         * @extends jabberwerx.Entity
         * @constructs  jabberwerx.PubSubNode
         */
        init: function(jid, node, ctrl) {
            if (!node || typeof(node) != "string") {
                throw new TypeError("node must be a non-empty string");
            }
            
            if (ctrl instanceof jabberwerx.PubSubNode) {
                // store delegate and change to delegate's controller
                this.delegate = ctrl;
                ctrl = ctrl.controller;
            }
            if (!(ctrl instanceof jabberwerx.PubSubController)) {
                throw new TypeError("ctrl must be a jabberwerx.PubSubController or jabberwerx.PubSubNode");
            }
            
            this._super({jid: jid, node: node}, ctrl);
            
            // array of PubSubItems
            this.properties.items = [];
            // map of delegated JIDs (jid + node ==> PubSubNode)
            this.properties.delegated = {};
            
            this.applyEvent("pubsubNodeCreated");
            this.applyEvent("pubsubNodeDeleted");
            this.applyEvent("pubsubItemsChanged");
            this.applyEvent("errorEncountered");
            
            if (!this.delegate) {
                this.controller.client.event("beforeMessageReceived").bindWhen(
                        "event[xmlns=http://jabber.org/protocol/pubsub#event]>*[node=" + this.node + "]",
                        this.invocation("_handleNotify"));
            }
        },
        /**
         * <p>Destroys this PubSubNode. This method unbinds registered
         * callbacks, destroys any delegated PubSubNodes, and then calls
         * the superclass' implementation.</p>
         */
        destroy: function() {
            if (!this.delegate) {
                this.controller.client.event("beforeMessageReceived").unbind(
                        this.invocation("_handleNotify"));
            }
            if (this.properties.delegated) {
                // cleanup delegates
                var client = this.controller.client;
                
                for (var key in this.properties.delegated) {
                    var d = client.entitySet.entity(key, this.node);
                    if (d) {
                        d.destroy();
                    }
                }
            }
        
            this._super();
        },
        
        /**
         * <p>Retrieves the current items for this PubSubNode. The returned
         * array's items are indexed by both the natural array index (e.g.
         * items[0], items[1]) and by the "item:{item.id}" (e.g.
         * items["item:current"], items["item:some-random-id"]).</p>
         *
         * @returns  {jabberwerx.PubSubItem[]} The current items
         */
        getItems: function() {
            return jabberwerx.$.extend([], this.properties.items);
        },
        
        /**
         * <p>Retrieves the delegated PubSubNode for the given JID. If
         * such a delegated node does not exist, one is created.</p>
         *
         * @param   {String|jabberwerx.JID} jid The JID of the delegated node
         * @returns {jabberwerx.PubSubNode} The delegated node
         * @throws  {TypeError} if {jid} is not a valid JID
         * @throws  {jabberwerx.PubSubNode.DelegatedNodeError} If this
         *          PubSubNode is already delegated.
         */
        getDelegatedFor: function(jid) {
            if (this.delegate) {
                throw new jabberwerx.PubSubNode.DelegatedNodeError();
            }
            
            jid = jabberwerx.JID.asJID(jid).getBareJID();
            if (jid.equals(this.jid)) {
                return this;
            }
            
            var delegated = this.controller.node(this.node, jid);
            delegated.delegate = this;
            this.properties.delegated[jid.toString()] = true;
            
            return delegated;
        },
        
        /**
         * <p>Subscribes to this PubSubNode. This method sends the
         * explicit subscription request to the node, using the
         * connected user's bare JID.</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if subscribe failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is defined and not a function
         * @throws  {jabberwerx.Client.NotConnectedError} If the client is not
         *          connected
         * @see     #unsubscribe
         */
        subscribe: function(cb) {
            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            if (this.properties.subscription || this.delegate) {
                if (cb) {
                    cb.call(this);
                }
                
                return;
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}pubsub");
            query.element("subscribe").
                  attribute("node", this.node).
                  attribute("jid", client.connectedUser.jid);
                  
            var that = this;
            client.sendIq("set", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                if (err) {
                    that.event("errorEncountered").trigger({
                        operation: "subscribe",
                        error: err
                    });
                } else {
                    that.properties.subscription = "explicit";
                
                    if (that.autoRetrieve) {
                        that.retrieve();
                    }
                }
                
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        /**
         * <p>Unsubscribes from this PubSubNode. This method sends the
         * explicit unsubscription request to the node.</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if unsubscribe failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is defined and not a function
         * @throws  {jabberwerx.Client.NotConnectedError} If the client is not
         *          connected
         * @see     #subscribe
         */
        unsubscribe: function(cb) {
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            if (this.delegate) {
                if (cb) {
                    cb.call(this);
                }
                
                return;
            }
            
            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}pubsub");
            query.element("unsubscribe").
                  attribute("node", this.node).
                  attribute("jid", client.connectedUser.jid);
                  
            var that = this;
            client.sendIq("set", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                if (err) {
                    // ignore error if not subscribed
                    var notSub = jabberwerx.$(err).children(
                            "not-subscribed[xmlns=http://jabber.org/protocol/pubsub#errors]");
                    if (!notSub.length) {
                        that.event("errorEncountered").trigger({
                            operation: "unsubscribe",
                            error: err
                        });
                    }
                    
                    // clear out the error
                    err = undefined;
                }
                
                // assume we are no longer subscribed
                delete that.properties.subscription;
                
                // retract all existing items
                that._cleanItems();
                
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        
        /**
         * <p>Retrieves the items for this PubSubNode. This method updates
         * the list of items returned by {@link #getItems} with the current
         * remote state of the node.</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if retrieve failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is defined and not a function
         * @throws  {jabberwerx.Client.NotConnectedError} If the client is not
         *          connected
         * @see     #getItems
         */
        retrieve: function(cb) {
            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}pubsub");
            query.element("items").
                  attribute("node", this.node);
                  
            var that = this;
            client.sendIq("get", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                
                if (err) {
                    that.event("errorEncountered").trigger({
                        operation: "retrieve",
                        error: err
                    });
                } else {
                    var items = jabberwerx.$(stanza).find("pubsub[xmlns=http://jabber.org/protocol/pubsub]>items");
                    that._cleanItems();
                    that.properties.items = [];
                    that._updateItems(items);
                }
                
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        /**
         * <p>Publishes an item to this PubSubNode.</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if publish failed
         *  }
         * </pre>
         *
         * @param   {String} [id] The item id
         * @param   {Element} [payload] The item payload
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is not valid; If {paylaod} is defined
         *          and not an Element
         * @throws  {jabberwerx.Client.NotConnectedError} If the client is
         *          not connected
         */
        publish: function(id, payload, cb) {
            if (this.delegate) {
                throw new jabberwerx.PubSubNode.DelegatedError();
            }
            
            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            if (payload && !jabberwerx.isElement(payload)) {
                throw new TypeError("payload must be undefined or an element");
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}pubsub");
            var item = query.element("publish").
                             attribute("node", this.node).
                             element("item");
            if (id) {
                item.attribute("id", id);
            }
            if (payload) {
                item.node(payload);
            }
            
            var that = this;
            client.sendIq("set", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                if (err) {
                    that.event("errorEncountered").trigger({
                        operation: "publish",
                        error: err
                    });
                }
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        /**
         * <p>Retracts an item from this PubSubNode.</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if retract failed
         *  }
         * </pre>
         *
         * @param   {String} id The item id
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is not valid; if {id} is empty or
         *          not a string
         * @throws  {jabberwerx.Client.NotConnectedError} If the client is
         *          not connected
         */
        retract: function(id, cb) {
            if (this.delegate) {
                throw new jabberwerx.PubSubNode.DelegatedError();
            }
            
            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (!(id && typeof(id) == "string")) {
                throw new TypeError("id must be a non-empty string");
            }
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}pubsub");
            var item = query.element("retract").
                             attribute("node", this.node).
                             element("item");
            item.attribute("id", id);
            
            var that = this;
            client.sendIq("set", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                if (err) {
                    that.event("errorEncountered").trigger({
                        operation: "retract",
                        error: err
                    });
                }
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        
        /**
         * @private
         */
        _purge: function(cb) {
            if (this.delegate) {
                throw new jabberwerx.PubSubNode.DelegatedError();
            }

            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}pubsub");
            query.element("purge").
                  attribute("node", this.node);
                  
            var that = this;
            client.sendIq("set", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                if (err) {
                    that.event("errorEncountered").trigger({
                        operation: "purge",
                        error: err
                    });
                }
                
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        /**
         * <p>Creates the node on the pubsub service.</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if create failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is not valid.
         * @throws  {jabberwerx.Client.NotConnectedError} If the client is
         *          not connected
         * @throws  {jabberwerx.PubSubNode.DelegatedNodeError} If this
         *          is a delegated node
         */
        createNode: function(cb) {
            if (this.delegate) {
                throw new jabberwerx.PubSubNode.DelegatedNodeError();
            }
            
            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}pubsub");
            query.element("create").
                  attribute("node", this.node);
                  
            var that = this;
            client.sendIq("set", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                if (err) {
                    that.event("errorEncountered").trigger({
                        operation: "createNode",
                        error: err
                    });
                } else {
                    that.event("pubsubNodeCreated").trigger();
                }
                
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        /**
         * <p>Deletes the node on the pubsub service.</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if create failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is not valid.
         * @throws  {jabberwerx.Client.NotConnectedError} If the client is
         *          not connected
         * @throws  {jabberwerx.PubSubNode.DelegatedNodeError} If this
         *          is a delegated node
         */
        deleteNode: function(cb) {
            if (this.delegate) {
                throw new jabberwerx.PubSubNode.DelegatedNodeError();
            }
            
            var client = this.controller.client;
            if (!client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            var query = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub#owner}pubsub");
            query.element("delete").
                  attribute("node", this.node);

            // note "we" are trying to do the delete
            this._deletePending = true;
            var that = this;
            client.sendIq("set", this.jid, query.data, function(stanza) {
                var err = that._checkError(stanza);
                if (err) {
                    that.event("errorEncountered").trigger({
                        operation: "deleteNode",
                        error: err
                    });
                } else {
                    that._cleanItems();
                    that.event("pubsubNodeDeleted").trigger();
                }
                delete that._deletePending;
                
                if (cb) {
                    cb.call(that, err);
                }
            });
        },
        
        /**
         * @private
         */
        _cleanItems: function() {
            if (!this.properties.items.length) {
                // nothing to do
                return;
            }
            
            var items = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/pubsub}items");
            jabberwerx.$.each(this.properties.items, function() {
                items.element("retract").
                      attribute("id", this.id);
            });
            this._updateItems(jabberwerx.$(items.data));
        },
        /**
         * @private
         */
        _checkError: function(stanza) {
            return jabberwerx.$(stanza).children("error").get(0);
        },
        
        /**
         * @private
         */
        _handleNotify: function(evt) {
            var publisher = evt.data.getFromJID().getBareJID();
            if (this.jid && !this.jid.equals(publisher)) {
                // not really ours
                return false;
            }
            
            var delegated = (this.delegate) ?
                            this :                              // already delegated
                            this.getDelegatedFor(publisher);    // find the delegated
            
            if (delegated !== this) {
                // pass through to delegated
                return delegated._handleNotify(evt);
            }

            // notification intended for this instance!
            
            var selected = evt.selected;
            var items;
            var gone = false;
            
            // look for a publisher in ESA
            var addrs = jabberwerx.$(evt.data.getNode()).children("addresses[xmlns=http://jabber.org/protocol/address]");
            var publisher = addrs.find("address[type=replyto]").attr("jid");
            
            switch (selected.nodeName) {
                case "items":
                    // normal items push...
                    this._updateItems(jabberwerx.$(selected), publisher);
                    break;
                case "delete":
                    // node deleted!
                    gone = true;
                    // fall through
                case "purge":
                    // all items deleted...
                    this._cleanItems();
                    break;
            }
            
            if (gone && !this._deletePending) {
                this.event("pubsubNodeDeleted").trigger();
            }
            return true;
        },
        
        /**
         * @private
         */
        _updateItems: function(items, publisher) {
            var that = this;
            var added = [], upped = [], remed = [];
            jabberwerx.$.each(items.children(), function() {
                var id = jabberwerx.$(this).attr("id");
                var key = "item:" + id;
                var it;
                
                if (this.nodeName == "retract") {
                    it = that.properties.items[key];
                    if (it) {
                        remed.push(it);
                        
                        // remove it and de-index it
                        var idx = jabberwerx.$.inArray(it, that.properties.items);
                        delete that.properties.items[key];
                        that.properties.items.splice(idx, 1);
                    }
                } else if (this.nodeName == "item") {
                    if (publisher && !jabberwerx.$(this).attr("publisher")) {
                        jabberwerx.$(this).attr("publisher", publisher);
                    }
                    
                    it = that.properties.items[key];
                    if (it) {
                        // update the existing PubSubItem
                        it._update(this);
                        upped.push(it);
                    } else {
                        // push it and index it
                        it = new jabberwerx.PubSubItem(this);
                        that.properties.items.push(it);
                        that.properties.items[key] = it;
                        added.push(it);
                    }
                }
            });
            
            // fire pubsub item changes
            var delegate = (this.delegate) ?
                           this.delegate.event("pubsubItemsChanged") :
                           undefined;
            if (added.length) {
                this.event("pubsubItemsChanged").trigger({
                    operation: "added",
                    items: added
                }, delegate);
            }
            if (upped.length) {
                this.event("pubsubItemsChanged").trigger({
                    operation: "updated",
                    items: upped
                }, delegate);
            }
            if (remed.length) {
                this.event("pubsubItemsChanged").trigger({
                    operation: "removed",
                    items: remed
                }, delegate);
            }
            
            // indicate this entity is updated
            this.update();
        },
        
        /**
         * <p>Flag to determine if items are automatically
         * retrieved from the pubsub node upon subscription.</p>
         *
         * @type    Boolean
         */
        autoRetrieve: false
    }, "jabberwerx.PubSubNode");
    
    /**
     * @class
     * <p>Error thrown by PubSubNode to indicate a method is
     * not supported by delegated nodes.</p>
     * 
     * @extends jabberwerx.util.NotSupportedError
     */
    jabberwerx.PubSubNode.DelegatedNodeError = jabberwerx.util.Error.extend.call(
            jabberwerx.util.NotSupportedError,
            "this operation is not supported by delegated nodes");
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/PEPNode.js*/
/**
 * filename:        PEPNode.js
 * created at:      2010/04/08T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.PEPNode = jabberwerx.PubSubNode.extend(/** @lends jabberwerx.PEPNode.prototype */{
        /**
         * @class
         * <p>Represents a PEP node.</p>
         *
         * <p>
         * This class provides the following events:
         * <ul>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.PubSubNode">jabberwerx.PubSubNode</a></li>
         * </ul>
         *
         * @description
         * <p>Creates a new PEPNode for the given JID, node, and
         * PEPController.</p>
         *
         * <p><b>NOTE:</b> This type should not be constructed directly.
         * Instead, use {@link jabberwerx.PEPController#node} to obtain an
         * instance.</p>
         *
         * @param   {jabberwerx.JID} jid The JID
         * @param   {String} node The node
         * @param   {jabberwerx.PEPController|jabberwerx.PEPNode} ctrl The owning
         *          controller or delegate
         * @throws  {TypeError} If {ctrl} is not valid; or if {node} is not
         *          valid
         * @extends jabberwerx.PubSubNode
         * @constructs  jabberwerx.PEPNode
         */
        init: function(jid, node, ctrl) {
            this._super(jid, node, ctrl);
        },
        /**
         * <p>Destroys this PEPNode. This method first unsubscribes then
         * calls the superclass' implementation.</p>
         */
        destroy: function() {
            this.unsubscribe();
        
            this._super();
        },
        
        /**
         * <p>Subscribes to this PEPNode. This method performs an implicit
         * subscription by updating the capabilities to add the feature
         * "<PEPNode.node>+notify".</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if subscribe failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is defined and not a function
         * @see     #unsubscribe
         */
        subscribe: function(cb) {
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }

            if (!this.delegate) {
                var caps = this.controller.client.controllers.capabilities;
                if (this.jid) {
                    caps.addFeatureToJid(this.jid, this.node + "+notify");
                } else {
                    caps.addFeature(this.node + "+notify");
                }
                this.properties.subscription="implicit";
            }
            
            if (this.autoRetrieve) {
                this.retrieve();
            }
            
            if (cb) {
                cb.call(this);
            }
        },
        /**
         * <p>Unsubscribes from this PEPNode. This method performs an implicit
         * unsubscription by updating the capabilities to remove the feature
         * "<PEPNode.node>+notify".</p>
         *
         * <p>The callback, if defined, is expected to match the following:
         * <pre class="code">
         *  function callback(err) {
         *      this;   // this PubSubNode
         *      err;    // the stanza error if unsubscribe failed
         *  }
         * </pre>
         *
         * @param   {Function} [cb] The callback
         * @throws  {TypeError} If {cb} is defined and not a function
         * @see     #subscribe
         */
        unsubscribe: function(cb) {
            if (cb && !jabberwerx.$.isFunction(cb)) {
                throw new TypeError("callback must be undefined or a function");
            }
            
            if (this.delegate) {
                if (cb) {
                    cb.call(this);
                }
                
                return;
            }
            
            var caps = this.controller.client.controllers.capabilities;
            if (this.jid) {
                caps.removeFeatureFromJid(this.jid, this.node + "+notify");
            } else {
                caps.removeFeature(this.node + "+notify");
            }
            delete this.properties.subscription;
        },
        
        /**
         * Creates the node in the pub-sub service. This implementation always
         * throws a {@link jabberwerx.util.NotSupportedError}.
         *
         * @param   {Function} [cb] The callback
         * @throws  {jabberwerx.util.NotSupportedError} This method is not
         *          supported
         */
        createNode: function(cb) {
            throw new jabberwerx.util.NotSupportedError();
        },
        /**
         * Deletes the node in the pub-sub service. This implementation always
         * throws a {@link jabberwerx.util.NotSupportedError}.
         *
         * @param   {Function} [cb] The callback
         * @throws  {jabberwerx.util.NotSupportedError} This method is not
         *          supported
         */
        deleteNode: function(cb) {
            throw new jabberwerx.util.NotSupportedError();
        }
    }, "jabberwerx.PEPNode");
    /**
     * @constant
     * @description
     * An item ID used for simple single-item publishing.
     */
    jabberwerx.PEPNode.CURRENT_ITEM = "current";
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/XDataForm.js*/
/**
 * filename:        XDataForm.js
 * created at:      2009/11/10T11:20:00+01:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.XDataForm = jabberwerx.JWModel.extend(/** @lends jabberwerx.XDataForm.prototype */ {
        /**
         * @class
         * <p>Holds data form fields and properties.</p>
         *
         * @description
         * <p>Creates a new XDataForm with the given DOM element or empty form of the given type.</p>
         * 
         * @param   {String} [form] The form type
         * @param   {Element} [payload] The DOM representing XDataForm
         * @throws  {TypeError} If any of the parameters are not valid
         * @constructs jabberwerx.XDataForm
         * @extends JWModel
         */
        init: function(form, payload) {
            this._super();
            if (payload) {
                if (jabberwerx.isElement(payload)) {
                    payload = jabberwerx.$(payload);
                    
                    //Set title and istructions
                    this._type = payload.attr("type");
                    this._title = payload.children("title").text();
                    this._instructions = payload.children("instructions").text();
                    //If we are passed DOM element, search for all
                    //field nodes, create XDataFormField object for 
                    //each one and append it to the fields array
                    var that = this;
                    
                    var fields = payload.children("field");
                    var field;
                    jabberwerx.$.each(fields, function() {
                        field = new jabberwerx.XDataFormField(null, null, this);
                        that.addField(field);
                    }); 
                    var reported_fields = payload.find("reported:first  > field");
                    var reported_field; 
                    
                    jabberwerx.$.each(reported_fields, function() {
                        reported_field = new jabberwerx.XDataFormField(null, null, this);
                        that.reported.push(reported_field);
                    }); 
                    var items = payload.find("item");
                    var item;
                    jabberwerx.$.each(items, function() {
                        item = new jabberwerx.XDataFormItem(this);
                        //We need to copy corresponding field types, options and descriptions 
                        //from reported fields into item fields.
                        jabberwerx.$.each(that.reported, function() {
                            var field = item.getFieldByVar(this.getVar());
                            if (field) {
                                field.setType(this.getType());
                                field.setOptions(this.getOptions());
                                field.setDesc(this.getDesc());
                            }
                        });
                        that.items.push(item);
                    });                      
                    
                }  
                else {
                    throw new TypeError("payload needs to be an Element");    
                }         
            } else {  
                if (form) {
                    if (typeof form == 'string') {
                        this._type = form;                   
                    }
                    else {
                        throw new TypeError("string form type is required");    
                    }                 
                }     
                else {
                    this._type = 'form';
                }                    
            }
  

        },
        
        /**
         * <p>Destroys this data form.</p>
         */
        destroy: function() {
            this._super();
        },
        
        
        /**
         * <p>Returns form type.</p>
         * @returns {String} Form type
         */
        getType: function() {
           return this._type;   
        },
            
        /**
         * <p>Returns form title.</p>
         * @returns {String} Form title
         */
        getTitle: function() {
           return this._title;   
        },
        
        /**
         * <p>Sets form title.</p>
         * @param {String} [title] Form title
         */
        setTitle: function(title) {
            this._title = title;  
        },
        
        /**
         * <p>Returns form instructions.</p>
         * @returns {String} Form instructions
         */
        getInstructions: function() {
           return this._instructions;   
        },
        
        /**
         * <p>Sets form instructions.</p>
         * @param {String} [instructions] Form instructions
         */
        setInstructions: function(instructions) {
            this._instructions = instructions;   
        }, 
      
        /**
         * <p>Returns XDataForm DOM element.</p>
         * @returns {Element} DOM element representing XDataForm
         */
        getDOM: function () {
             var form = new jabberwerx.NodeBuilder("{jabber:x:data}x");
             if (this._type) {
                 form.attribute("type",this._type);
             }
             if (this._title) {               
                 form.element("title").text(this._title);
             }
             
             if (this._instructions) {               
                 form.element("instructions").text(this._instructions);
             }             
                           
             var that = this;
             
             jabberwerx.$.each(that.fields, function() {
                 this.getDOM(form);   
             });
             
             if (that.reported.length) {
                 var reported = form.element("reported");
                 jabberwerx.$.each(that.reported, function() {
                     this.getDOM(reported);   
                 });
             }
             
             if (that.items.length) {
                 var items = form.element("items");
                 jabberwerx.$.each(that.items, function() {
                     this.getDOM(items);   
                 });
             }
             
             
             return form;
         },      
         
        
        /**
         * <p>Adds field to the data form.</p>
         * @param {jabberwerx.XDataFormField} [field] Field to add to the form        
         * 
         */
        addField: function(field) {
            if (!field instanceof jabberwerx.XDataFormField) {
                throw new TypeError("field must be type jabberwerx.XDataFormField");
            } 
            
            //Remove if field already exists
            var idx = this._indexOf(this.fields, field.getVar());
            if (idx != -1) {
                this.fields.splice(idx,1);
            }              
            this.fields.push(field);               
                    
        },    
                      
        /**
         * <p>Returns field based on var name or null if not found or name is null.</p>
         * @param {String} [name] Var value for the field  
         * @returns {jabberwerx.XDataFormField}
         */
        getFieldByVar: function(name) {
            if (!name) {
                return null;
            }
            var idx = this._indexOf(this.fields, name);
            if (idx != -1) {
                return this.fields[idx];
            }          
            return null;          
        },

        /**
         * <p>Sets form type field value for the form.</p>
         * @param {String} [type] 'FORM_TYPE' value for the form
         */
        setFORM_TYPE: function(type) {
            this.getFieldByVar('FORM_TYPE').setValues(type);     
        },
        
        /**
         * <p>Returns field based on var name or null if not found or name is null.</p>
         * @returns {String} 'FORM_TYPE' value for the form
         */
        getFORM_TYPE: function() {
            return this.getFieldByVar('FORM_TYPE').getValues()[0];          
        },
                
        /**
         * <p>Creates new jabberwerx.XDataForm and sets values for the passed var(s).</p>
         * @param {Object} [fieldsAndValues] Object containing id/value pairs for data fields.
         * @returns {jabberwerx.XDataForm} Newly created form of type "submit".
         */
        submit: function(fieldsAndValues) {
            var submitForm = new jabberwerx.XDataForm("submit");
            
            var property, field;
            var values;
            var idx;
            //First populate values for the submitted fields.
            if (fieldsAndValues) {
                var that = this;
	  	        jabberwerx.$.each(fieldsAndValues, function(property) {
                    if (typeof property == "string") {
                        //Look up if field is already there
                        //values could be array
                        values = [].concat(fieldsAndValues[property]);
                        field = new jabberwerx.XDataFormField(property, values);
                        idx = that._indexOf(that.fields, field.getVar());
                        if (idx != -1) {
                            field.setType(that.fields[idx].getType());
                            field.setRequired(that.fields[idx].getRequired());
                        }                           
                        submitForm.addField(field);
                    }
                });
            }
           
            //If the value was not submitted, populate default
            for(var i=0; i<this.fields.length; i++) {
                //Check if submit has this field
                idx = this._indexOf(submitForm.fields, this.fields[i].getVar());
                if (idx == -1 && (this.fields[i].getValues().length || this.fields[i].getRequired())) {
                    if (this.fields[i].getType() == "fixed" ||
                        this.fields[i].getType() == "hidden") continue;
                    field = new jabberwerx.XDataFormField(this.fields[i].getVar(), this.fields[i].getValues());
                    field.setType(this.fields[i].getType());
                    field.setRequired(this.fields[i].getRequired());
                    submitForm.addField(field);
                }
            }             
            //Will throw exception here if validation issues have been encountered
            submitForm.validate();
            
            return submitForm;          
        },        

         /**
         * <p>Returns XDataForm type "cancel".</p>
         * @returns {jabberwerx.XDataForm} Newly created form of type "cancel".
         */
        cancel: function() {
            var cancelForm = new jabberwerx.XDataForm("cancel");
            return cancelForm;          
        }, 
        
       /**
         * <p>Returns index of the field for the given var name or -1 if not found or the var is null.</p>
         * @private
         * @param {jabberwerx.XDataFormField[]} [fields] Array of fields to search.
         * @param {String} [name] Array of fields to search.
         * @returns {Integer} Index of the field
         */        
        _indexOf: function(fields, name) {
            if (!name) {
                return -1;
            }
            for(var i=0; i<fields.length; i++) {
                if (fields[i].getVar() == name) {
                    return i;
                }
            }
            return -1;
        },                                 
      

       /**
         * <p>Iterates through all the form fields and performs the validation.</p>
         * @throws  {TypeError} If any of the rules for field's values have been violated
         */        
        validate: function() {
            for(var i=0; i<this.fields.length; i++) {
                var field = this.fields[i];
                field.validate();
            }
    
            //Validate result set
            this._validateReported();
                        
            for(var i=0; i<this.items.length; i++) {
                this._validateItem(this.items[i]);
            }            
        },
        
        /**
         * @private
         * Validates info for reported fields
         */        
        _validateReported: function() {
            for(var i=0; i<this.reported.length; i++) {
                if (!this.reported[i].getVar()) {
                     throw new TypeError("reported should have var");           
                }
                if (!this.reported[i].getType()) {
                    throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                        "reported field should have type",
                        {field:this.reported[i].getVar()});                
                }
                if (!this.reported[i].getLabel()) {
                    throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                        "reported field should have label",
                        {field:this.reported[i].getVar()});                
                }

                if (this.reported[i].getValues().length > 0) {
                    throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                        "reported field should not have values",
                        {field:this.reported[i].getVar()});                
                }                                               
                this.reported[i].validate();
            }           
        },  
        
       /**
         * @private
         * Validates item against reported fields
         */        
        _validateItem: function(item) {
            var found;
            var fields = item.fields;
            for(var i=0; i<this.reported.length; i++) {      
                found = false;
                for(var j=0; j<fields.length || found; j++) {
                    if (fields[j].getVar() == this.reported[i].getVar()) {
                        found = true;
                        fields[j].setType(this.reported[i].getType());
                        fields[j].validate();
                    }
                }
                if (!found) {
                    throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                    "reported field is not found in one of the items",
                    {field:this.reported[i].getVar()});                       
                }
            }
        },             
                
        /**
         * <p>Returns first value for the field based on var name or null if field is not found or no values exist for the field.</p>
         * @param {String} [name] Var value for the field  
         * @returns {String} First value for the field
         */
        getFieldValue: function(name) {
            if (!name) {
                return null;
            }
            var idx = this._indexOf(this.fields, name);
            if (idx == -1) {
                return null;
            }          
            if (this.fields[idx].getValues().length > 0) {
                return this.fields[idx].getValues()[0];
            }
            return null;          
        },
        
         /**
         * <p>Sets/clears value for the field based on var name.</p>
         * @param {String} [name] Var name for the field  
         * @param {String} [value] Value for the field  
         */
        setFieldValue: function(name, value) {
            if (!name) {
                return;
            }
            var idx = this._indexOf(this.fields, name);
            if (idx == -1) {
                return;
            }          
            this.fields[idx].setValues(value);
        },
                              
        /**
         * @private
         */
        _type: null,
        /**
         * @private
         */
        _title: null,
        /**
         * @private
         */
        _instructions: null,
        /**
         * Array of XDataFormFields objects for the forms of type "form" and "submit"
         */
        fields: [],
        /**
         * Array of XDataFormFields objects for the forms of type "result"
         */
        reported: [],
        /**
         * Array of XDataFormFields objects for the forms of type "result"
         */
        items: []                                
    }, "jabberwerx.XDataForm");
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/XDataFormField.js*/
/**
 * filename:        XDataFormField.js
 * created at:      2009/11/10T11:20:00+01:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.XDataFormField = jabberwerx.JWModel.extend(/** @lends jabberwerx.XDataFormField.prototype */ {
        /**
         * @class
         * <p>Holds collection of properties for data form field.</p>
         *
         * @description
         * <p>Creates a new XDataFormField with the given DOM element or given var name and values.</p> 
         * 
         * @param       {String} [varName] Represents field id. 
         * @param       {String} [values] Field value       
         * @param       {Element} [fieldNode] The DOM element representing the field node.
         * @throws      {TypeError} if any of the parameters are not valid
         * @constructs jabberwerx.XDataFormField 
         * @extends jabberwerx.JWModel
         */
        init: function(varName, values, fieldNode) {
            this._super();
            if (fieldNode) {           
                if (jabberwerx.isElement(fieldNode)) {
                    var that = this;
                    fieldNode = jabberwerx.$(fieldNode);
                    this._var = fieldNode.attr("var");
                    this._type = fieldNode.attr("type");
                    this._label = fieldNode.attr("label");
                    this._values = [];
                    var values = fieldNode.children("value");
                    jabberwerx.$.each(values, function() {
                        that._values.push(jabberwerx.$(this).text());
                    });                        
                    this._desc = fieldNode.children("desc").text();
                    this._required = fieldNode.children("required")[0] ? true : false;
                    this._options = [];
                    var options = fieldNode.children("option");                    
                    jabberwerx.$.each(options, function() {
                       that._options.push({label: jabberwerx.$(this).attr("label"),
                                           value: jabberwerx.$(this).children("value").text()});
                    });            
                 }
                 else {
                     throw new TypeError("fieldNode must be an Element");
                 }                 
             }
             else { 
                 if (!varName && !values) {
                     throw new TypeError("one of the constructor parameters for XDataFormField should be not null");
                 }
                 if (varName) {
                     this._var = varName;
                 }
                 this.setValues(values);
             }   
        },
        
        /**
         * <p>Destroys this data form.</p>
         */
        destroy: function() {
            this._super();
        },

        /**
         * <p>Gets the var name for the field element.</p>
         * @returns {String} Field var name
         */
        getVar: function() {
            return this._var;   
        },
        
        /**
         * <p>Sets the var name for the field element.</p>
         * @param {String} [var_name] Field var name
         */
        setVar: function(var_name) {
            this._var = var_name;   
        },        
        
        
        /**
         * <p>Gets the type for the field element.</p>
         * @returns {String} Field type
         */
        getType: function() {
            return this._type;   
        },
        
        /**
         * <p>Sets the type for the field element.</p>
         * @param {String} [type] Field type
         */
        setType: function(type) {
            this._type = type;
        },
        
        /**
         * <p>Gets the label for the field element.</p>
         * @returns {String} Field label
         */
        getLabel: function() {
            return this._label;   
        },
        
        /**
         * <p>Sets the label for the field element.</p>
         * @param {String} [label] Field label
         */
        setLabel: function(label) {
            this._label = label;   
        },                  
        
        /**
         * <p>Gets value(s) for the field element.</p>
         * @returns {Array} Array of field values 
         */
        getValues: function() {
            var values = [].concat(this._values);
            return values;   
        },
        
        /**
         * <p>Sets values for the field element.</p>
         * @param {Array|Object} [values] Array of field values or a single value
         * @throws {TypeError} if {values} is not String, number or Array
         */
        setValues: function(values) {
            this._values = [];
            if (values) {
                if (typeof values == 'string' || typeof values == 'boolean') {
                    this._values.push(values);
                } else if (values instanceof Array) {
                      for(var i=0; i<values.length; i++) {
                          this._values.push(values[i]);
                      }            
                } else {
                    throw new TypeError("values must be string, number or array");         
                }
            }           
        },        
        /**
         * <p>Gets the desciption for the field element.</p>
         * @returns {String} Field description
         */
        getDesc: function() {
            return this._desc;   
        },
        
        /**
         * <p>Sets the desciption for the field element.</p>
         * @param {String} [desc] Field description
         */
        setDesc: function(desc) {
           this._desc = desc;
        },
               
        /**
         * <p>Gets options for the field element.</p>
         * @returns {Array} Label/value list, e.g. {'label':'My label','value':'My Value'}
         */
        getOptions: function() {
            var options = [].concat(this._options);
            return options;              
        },
        
        /**
         * <p>Sets options for the field element.</p>
         * @param {Array} [options] Label/value list, e.g. {'label':'My label','value':'My Value'}
         */
        setOptions: function(options) {
            this._options = [];
            var that = this;
            jabberwerx.$.each(options, function() {
                if (this.label && this.value) {
                    that._options.push({label: this.label, value: this.value}); 
                }                               
            });
               
        }, 
        
        /**
         * <p>Gets the "required" flag for the field element.</p>
         * @returns {Boolean} Indicator for the required field
         */
        getRequired: function() {
            return this._required;   
        },
        
        /**
         * <p>Sets the "required" flag for the field element.</p>
         * @param {Boolean} [required] Indicator for the required field
         */
        setRequired: function(required) {
            this._required = required;

        },  
        
        /**
         * <p>Gets the DOM of the field element.</p> DOM:
         *   <pre class="code">&lt;field type='list-multi'
         *       label='What features will the bot support?'
         *       var='features'&gt;
         *       &lt;option label='Contests'&gt;&lt;value&gt;contests&lt;/value&gt;&lt;/option&gt;
         *       &lt;option label='News'&gt;&lt;value&gt;news&lt;/value&gt;&lt;/option&gt;
         *       &lt;option label='Polls'&gt;&lt;value&gt;polls&lt;/value&gt;&lt;/option&gt;
         *       &lt;option label='Reminders'&gt;&lt;value&gt;reminders&lt;/value&gt;&lt;/option&gt;
         *       &lt;option label='Search'&gt;&lt;value&gt;search&lt;/value&gt;&lt;/option&gt;
         *       &lt;value&gt;news&lt;/value&gt;
         *       &lt;value&gt;search&lt;/value&gt;
         *  &lt;/field&gt;
         *  </pre>
         *
         *
         * @param {jabberwerx.NodeBuilder} form DOM element of the field
         */
        getDOM: function(form) {
            var field = form.element("field");
            
            if (this._var) {
                field.attribute("var",this._var);
            }
            if (this._type) {
                 field.attribute("type",this._type);
            }
            if (this._label) {
                 field.attribute("label",this.label);
            }
            for(var i=0; i<this._values.length; i++) {
                field.element("value").text(this._values[i]);
            }              
            if (this._required) {
                 field.element("required");
            }
            if (this._desc) {
                 field.element("desc").text(this._desc);
            }
            var that = this;
            jabberwerx.$.each(this._options, function() {
                field.element("option").attribute("label", this.label).text(this.value);       
            });
                                                    
              
        },                   

        /**
         * <p>Determines if the given field matches this field. This
         * method returns <tt>true</tt> if all properties of this field
         * are equal to {fields}'s.</p>
         *
         * @param {jabberwerx.XDataFormField} field The field to match against
         * @returns {Boolean} <tt>true</tt> if {fields}'s properties matches
         *          this XDataFormField.
         */
        equals: function(field) {
            if (field === this) {
                return true;
            }
            if (!field) {
                return false;
            }
            if (this.getVar() != field.getVar()) {
                return false;
            }
            if (this.getType() != field.getType()) {
                return false;
            }
            if (this.getLabel() != field.getLabel()) {
                return false;
            }
            if (this.getDesc() != field.getDesc()) {
                return false;
            }
            
            var values = field.getValues();
            for(var idx=0; idx<this._values.length; idx++)  { 
                if (typeof this._values[idx] == 'function') {
                    continue; 
                }    
                if (this._values[idx] != values[idx]) {
                    return false;
                }        
            }
                
            var options = field.getOptions(); 
            for(var idx=0; idx<this._options.length; idx++) {
                if (typeof this._options[idx] == 'function') {
                    continue; 
                }         
                if (this._options[idx].label != options[idx].label ||
                    this._options[idx].value != options[idx].value) {
                    return false;
                }        
            }              
                                              
            return true;                                 
        },

       /**
         * <p>Performs validation for XDataField.</p>
         * @throws  {jabberwerx.XDataFormField.InvalidXDataFieldError} If any of the rules for field's values have been violated       
         */
        validate: function() {
            //Validate type first
            if (this._type) { 
                if (this._type != "boolean" &&
                    this._type != "fixed" &&
                    this._type != "hidden" && 
                    this._type != "jid-multi" &&
                    this._type != "jid-single" && 
                    this._type != "list-multi" &&
                    this._type != "list-single" &&
                    this._type != "text-multi" &&
                    this._type != "text-private" &&
                    this._type != "text-single") {
                    throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                        "field type should comply with XEP-0004",
                        {field:this._var});
                }
            }
            
            //Only "multi" fields should be allowed to have multiple values
            if (this._type != "list-multi" &&
                this._type != "text-multi" &&
                this._type != "jid-multi") {
                if (this._values.length > 1) {
                    throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                        "field is not allowed to have multiple values",
                        {field:this._var});
                    
                } 
             }  
             if (this._required && this._values.length == 0) {
                 throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                     "field is required to have a value",
                     {field:this._var});
                 
             }
             
             if (this._type == "boolean" && this._values.length > 0) {
                 if (this._values[0] == "true" || this._values[0] == true) {
                     this._values[0] = "1";
                 }
                 if (this._values[0] == "false" || this._values[0] == false) {
                     this._values[0] = "0";
                 }
                 if (this._values[0] != "0" && this._values[0] != "1") {
                     throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                         "field of type boolean contains invalid value",
                         {field:this._var});
                     
                 }               
             }
             
             if (this._type == "jid-multi" || this._type == "jid-single") {
                  var jid;
                  for(var i=0; i<this._values.length; i++) {
                      try {
                          jid = jabberwerx.JID.asJID(this._values[i]);
	                  }
	                  catch(e) {
                          throw new jabberwerx.XDataFormField.InvalidXDataFieldError(
                              "field of type jid contains invalid jid type",
                              {field:this._var});

	                  }                      
                  }
                  if (this._type == 'jid-multi') {
                      jabberwerx.unique(this._values)
                  }                                    
                  
             } 
                                                 
        },
                    
        /**
         * @private
         */
        _type: null, 
        /**
         * @private
         */
        _label: null,                                      
        /**
         * @private
         */
        _var: null,
        /**
         * @private
         */
        _values: [], 
        /**
         * @private
         */
        _desc: null,          
        /**
         * @private
         */
        _required: false,
        /**
         * @private
         */
        _options: []                       
    }, "jabberwerx.XDataFormField");
    
   /**
     * @class
     *
     * <p>The object representation of an error thrown when invalid XDataField is encountered.</p>
     *
     * @property {String} field The field var name for which error has been encountered
     *
     * @description   
     * Constructs a new jabberwerx.XDataField.InvalidXDataFieldError from the given error message
     * and field var name.       
     * 
     *
     * @param       {String} [error] Error message 
     * @param       {String} [field] Field var name for which error has been encountered     
     * @extends jabberwerx.util.Error
     * @constructs jabberwerx.XDataField.InvalidXDataFieldError
     */
    jabberwerx.XDataFormField.InvalidXDataFieldError = jabberwerx.util.Error.extend.call(TypeError);
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/XDataFormItem.js*/
/**
 * filename:        XDataFormItem.js
 * created at:      2010/02/23T11:20:00+01:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.XDataFormItem = jabberwerx.JWModel.extend(/** @lends jabberwerx.XDataFormItem.prototype */ {
        /**
         * @class
         * <p>Holds collection of jabberwerx.XDataFormField objects. This class is used in with XDataForm type "result".</p>
         *
         * @description
         * <p>Creates a new XDataFormItem based on the passed DOM element.</p> 
         * 
         * @param       {Element} [itemNode] The DOM element representing the item node.
         * @throws      {TypeError} If parameter is not valid
         * @constructs jabberwerx.XDataFormItem 
         * @extends JWModel
         */
        init: function(itemNode) {
            this._super();
            this._DOM = itemNode;
            if (itemNode) {           
                if (jabberwerx.isElement(itemNode)) {
                    var that = this;
                    var fieldNodes = jabberwerx.$(itemNode).children("field");
                    var field;
                    jabberwerx.$.each(fieldNodes, function() {
                        field = new jabberwerx.XDataFormField(null, null, this); 
                        that.fields.push(field);
                    });                        
                 }
                 else {
                     throw new TypeError("itemNode must be an Element");
                 }                 
             }
        },
        
        /**
         * <p>Destroys this item.</p>
         */
        destroy: function() {
            this._super();
        },
                     

        /**
         * <p>Gets the DOM of the item element.</p>
         *
         *
         * @returns {Element} DOM element of the item
         */
        getDOM: function() {
            return _DOM;            
        },                   

        /**
         * <p>Determines if the given item matches this item. This
         * method returns <tt>true</tt> if all fields are equal.</p>
         *
         * @param {jabberwerx.XDataFormItem} item The item to match against
         * @returns {Boolean} <tt>true</tt> if {item}'s fields matches
         *          this XDataFormItem.
         */
        equals: function(item) {
            if (item === this) {
                return true;
            }
            if (!item) {
                return false;
            }
            
            if (item.fields.length != this.fields.length) {
                return false;
            }
            
            for(var idx=0; idx<this.fields.length; idx++)  { 
                if (!this.fields[idx].equals(item.fields[idx])) {
                    return false;
                }        
            }             
                                              
            return true;                                 
        },

        /**
         * <p>Returns field based on var name or null if not found or name is null.</p>
         * @param {String} [name] Var name for the field  
         * @returns {jabberwerx.XDataFormField}
         */
        getFieldByVar: function(name) {
            if (!name) {
                return null;
            }
            var idx = this._indexOf(this.fields, name);
            if (idx != -1) {
                return this.fields[idx];
            }          
            return null;          
        },
        
        /**
         * <p>Returns field values based on var name or null if not found or name is null.</p>
         * @param {String} [name] Var name for the field 
         * @returns {String} 'FORM_TYPE' value for the form
         */
        getFieldValues: function(name) {
            var field = this.getFieldByVar(name);
            if (field) {
                return field.getValues();
            } 
            return null;        
        },
        
       /**
         * <p>Returns index of the field for the given var name or -1 if not found or the var is null.</p>
         * @private
         * @param {[jabberwerx.XDataFormField]} [fields] Array of fields to search.
         * @param {String} [name] Array of fields to search.
         * @returns {Number} Index of the field
         */        
        _indexOf: function(fields, name) {
            if (!name) {
                return -1;
            }
            for(var i=0; i<fields.length; i++) {
                if (fields[i].getVar() == name) {
                    return i;
                }
            }
            return -1;
        },
        
        /**
         * Array of jabbewerx.XDataFormField objects
         * @type  jabbewerx.XDataFormField[]
         */
        fields: []                       
    }, "jabberwerx.XDataFormItem");
     
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/model/MUCInvite.js*/
/**
 * filename:        MUCInvite.js
 * created at:      2009/11/10T11:20:00+01:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.MUCInvite = jabberwerx.JWModel.extend(/** @lends jabberwerx.MUCInvite.prototype */ {
        /**
         * @class
         * <p>Holds MUC Invite properties.</p>
         *
         * @description
         * Holds MUC Invite properties. MUC invites are described in XEP-0045 and XEP-0249. The room
         * property must be present; all other properties are optional.
         *
         * @param   {jabberwerx.Stanza} stanza The stanza containing the invite
         * @param   {jabberwerx.JID | String} room The room for which the invite is extended
         * @param   {jabberwerx.JID | String} [invitor] The user who extended the invitation
         * @param   {String} [reason] The reason for the invite
         * @param   {String} [password] The password for the room
         * @throws  {TypeError} if any of the parameters are not valid
         * @constructs jabberwerx.MUCInvite
         * @extends jabberwerx.JWModel
         */
        init: function(stanza, room, invitor, reason, password) {            
            if (!stanza || !room) {
                throw new TypeError("stanza and room parameters must be present");
            }
            
            this.setStanza(stanza);
            this.setRoom(room);
            this.setInvitor(invitor);
            this.setReason(reason);
            this.setPassword(password);
        },
      
        /**
         * Retries the stanza property.
         * @returns {jabberwerx.Stanza}
         */
        getStanza: function() {
            return this._stanza || null;
        },

        /**
         * Retrieves the room property.
         * @returns {jabberwerx.JID}
         */
        getRoom: function() {
            return this._room || null;
        },
        
		/**
         * Retrieves the invitor property.
         * @returns {jabberwerx.JID}
         */
        getInvitor: function() {
        	return this._invitor || null;
        },
        
		/**
         * Retrieves the reason property.
         * @returns {String}
         */
        getReason: function() {
            return this._reason || null;
        },
        
		/**
         * Retrieves the reason property.
         * @returns {String}
         */
        getPassword: function() {
            return this._password || null;
        },
        
        /**
         * Sets the stanza property.
         * @param   {jabberwerx.Stanza} stanza The stanza property is set to this
         *          value if not null or empty. 
         * @throws  {TypeError} If {stanza} is not valid
         */
        setStanza: function(stanza) {
            if (stanza) {
                if (stanza instanceof jabberwerx.Stanza) {    
                    this._stanza = stanza;
                } else {
                    throw new TypeError("stanza must be type jabberwerx.Stanza");
                }
            }
        },
        
        /**
         * Sets the room property.
         * @param   {jabberwerx.JID | String} room The room property is set to this
         *          value if not null or empty. 
         * @throws  {TypeError} If {room} is not valid
         */
        setRoom: function(room) {
            if (room) {
                try {
                    this._room = jabberwerx.JID.asJID(room);
                } catch(e) {
                    throw new TypeError(
                            "room must be type jabberwerx.JID or convertible to a jabberwerx.JID");
                }
            }
        },
        
        /**
         * Sets the invitor property.
         * @param   {jabberwerx.JID | String} invitor The invitor property is set to this
         *          value if not null or empty.
         * @throws  {TypeError} If {invitor} is not valid
         */
        setInvitor: function(invitor) {
            if (invitor) {
                try {
                    this._invitor = jabberwerx.JID.asJID(invitor);
                } catch(e) {
                    throw new TypeError(
                        "invitor must be type jabberwerx.JID or convertible to a jabberwerx.JID");
                }
            }
        },
        
        /**
         * Sets the reason property.
         * @param   {jabberwerx.JID | String} reason The reason property is set to this
         *          value if not null or empty.
         * @throws  {TypeError} If {reason} is not valid
         */
        setReason: function(reason) {
            if (reason) {
                if (typeof reason == "string" || reason instanceof String) {
                    this._reason = reason;
                } else {
                    throw new TypeError("reason must be a string");
                }
            }
        },

        /**
         * Sets the password property.
         * @param   {jabberwerx.JID | String} password The password property is set to this
         *          value if not null or empty.
         * @throws  {TypeError} If {password} is not valid
         */
        setPassword: function(password) {
            if (password) {
                if (typeof password == "string" || password instanceof String) {
                    this._password = password;
                } else {
                    throw new TypeError("password must be a string");
                }
            }
        }
    }, "jabberwerx.MUCInvite");
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/Controller.js*/
/**
 * filename:        Controller.js
 * created at:      2009/05/11T07:48:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.Controller = jabberwerx.JWModel.extend(/** @lends jabberwerx.Controller.prototype */ {
        /**
         * @class
         * <p>Abstract base class for all controller types.</p>
         *
         * <p>All controller types have a unique simple name (e.g. "roster" for
         * the RosterController, or "capabilities" for the
         * CapabilitiesController).</p>
         *
         * @description
         * Creates a new jabberwerx.Controller with the given owning client.
         * This method sets the name and client for this Controller, and
         * stores it in the {@link jabberwerx.Client#controllers} hashtable.
         *
         * @param {jabberwerx.Client} client The owning client
         * @param {String} name The common name for this controller
         * @throws {TypeError} if {client} is not the correct type, or if
         *                   {name} is not a non-empty string.
         * @constructs jabberwerx.Client
         * @extends jabberwerx.JWModel
         * @minimal
         */
        init: function(client, name) {
            this._super();

            if (!name || typeof name != 'string') {
                throw new TypeError("name must be a non-empty string");
            }
            if (!(client instanceof jabberwerx.Client)) {
                throw new TypeError("client must be a jabberwerx.Client");
            }

            this.client = client;
            this.name = name;

            // overwrites any other controller with this name
            var orig = client.controllers[name];
            if (orig) {
                orig.destroy();
            }
            client.controllers[name] = this;
        },
        /**
         * <p>Destroys this Controller. This method deletes this controller
         * from its owning client.</p>
         *
         * <p>Subclasses SHOULD override this method to perform any additional
         * cleanup (e.g. removing event callbacks), but MUST call the
         * superclass' implementation (this._super()).</p>
         */
        destroy: function() {
            if (    this.client &&
                    this.client.controllers &&
                    this.client.controllers[this.name]) {
                delete this.client.controllers[this.name];
                delete this.client;
            }

            this._super();
        },

        /**
         * <p>Users should not call this method directly. Instead, call
         * {@link jabberwerx.Entity#update}.</p>
         *
         * @param {jabberwerx.Entity} entity The entity to update
         * @throws {TypeError} if entity is not an instance of Jabberwerx.Entity
         * @returns {jabberwerx.Entity} updated entity
         */
        updateEntity: function(entity) {
            if (!(entity && entity instanceof jabberwerx.Entity && entity.controller === this)) {
                throw new TypeError("invalid entity to update");
            }
            this.client.entitySet.event("entityUpdated").trigger(entity);

            return entity;
        },

        /**
         * <p>Users should not call this method directly. Instead, call
         * {@link jabberwerx.Entity#remove}.</p>
         *
         * @param {jabberwerx.Entity} entity The entity to remove
         * @throws {TypeError} if entity is not an instance of Jabberwerx.Entity
         * @returns {jabberwerx.Entity} deleted entity
         */
        removeEntity: function(entity) {
            if (!(  entity &&
                    entity instanceof jabberwerx.Entity &&
                    entity.controller === this)) {
                throw new TypeError("invalid entity to delete");
            }
            entity.destroy();

            return entity;
        },

        /**
         * <p>Cleanup the given entity on behalf of the
         * client's entity cache {@link jabberwerx.EntitySet}.</p>
         *
         * <p>Users should not call this method directly.</p>
         *
         * <p>Subclasses SHOULD override this method and use it to destroy
         * the given entity. Controllers MAY choose to leave the entity in the
         * cache between sessions (pubsub nodes), this is the behavior
         * by default.
         *
         * This method is called just prior to the clientStatusChanged
         * status_disconnected event. It is called once for each entity
         * the controller owns (the controller used during the entity's
         * creation {@link jabberwerx.Entity#init).</p>
         *
         * <p>NOTE - This method is called within a batch update
         * {@link jabberwerx.Entity.EntitySet#startBatch}.</p>
         *
         * @param {jabberwerx.Entity} entity The entity to cleanup and destroy
         */
        cleanupEntity: function(entity) {
        },

        /**
         * The client object that is used to manage roster API calls
         *
         * @type jabberwerx.Client
         */
        client: null,
        /**
         * The name of this controller.
         *
         * @type String
         */
        name: ''
    }, 'jabberwerx.Controller');
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/RosterController.js*/
/**
 * filename:        RosterController.js
 * created at:      2009/05/15T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

;(function(){
    if (jabberwerx) {

        //TODO: test this in IE (6,7,8?)
        //TODO: DOM creation only for W3C DOM
        //TODO: remove group

        jabberwerx.RosterController = jabberwerx.Controller.extend(/** @lends jabberwerx.RosterController.prototype */{
            /**
             * @class
             * <p>Controller class for roster functionality.</p>
             *
             * <p>
             * This class provides the following events:
             * <ul>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.RosterController">jabberwerx.RosterController Events</a></li>
             * </ul>
             *
             * @extends jabberwerx.Controller
             *
             * @description
             * Creates a new RosterController with the given client.
             *
             * @param {jabberwerx.Client} client The client object to use for
             *        communicating to the server
             * @throws TypeError If {client} is not an instance of
             *         jabberwerx.Client
             * @constructs jabberwerx.RosterController
             */
            init: function(client) {
                this._super(client, "roster");

                // setup events
                this.applyEvent("errorEncountered");
                this.applyEvent("subscriptionReceived");
                this.applyEvent("unsubscriptionReceived");
                this.applyEvent("rosterFetched");

                // setup auto-accept/-remove policy from global config
                var that = this;
                var policyKeys = [  "autoaccept",
                                    "autoaccept_in_domain",
                                    "autoremove"];
                var policyDefaults = jabberwerx._config.subscriptions;
                jabberwerx.$.each(policyKeys, function() {
                    var key = this;

                    if (    policyDefaults !== undefined &&
                            policyDefaults[key] !== undefined) {
                        that[key] = policyDefaults[key];
                    }

                    return true;
                });

                // setup handlers
                client.event("iqReceived").bindWhen(
                        "[type='set'] query[xmlns='jabber:iq:roster']",
                        this.invocation("_handleRosterUpdate"));
                client.event("presenceReceived").bindWhen(
                        "[type='subscribe'], [type='subscribed'], [type='unsubscribe'], [type='unsubscribed']",
                        this.invocation("_handleSubscription"));
            },

            /**
             * <p>Destroys this RosterController and removes any event callbacks it registered.</p>
             */
            destroy: function() {
                // teardown handlers
                var client = this.client;

                client.event("iqReceived").unbind(
                        this.invocation("_handleRosterUpdate"));
                client.event("presenceReceived").unbind(
                        this.invocation("_handleSubscription"));

                this._super();
            },

            /**
             * Updates the given entity. This method calls
             * {@link #updateContact} with the displayName and groups from
             * the given entity.
             *
             * @param {jabberwerx.RosterContact} entity The entity to update
             * @throws {TypeError} if {entity} is not a Contact
             */
            updateEntity: function(entity) {
                if (!(entity && entity instanceof jabberwerx.RosterContact)) {
                    throw new TypeError("entity must be a contact");
                }

                var nick = entity.getDisplayName();
                if (nick == entity.jid.toString()) {
                    nick = "";
                }
                var groups = entity.getGroups();
                this.updateContact(entity.jid, nick, groups);
            },
            /**
             * Deletes the given entity. This method calls
             * {@link #deleteContact} with the displayName and groups from
             * the given entity.
             *
             * @param {jabberwerx.RosterContact} entity The entity to delete
             * @throws {TypeError} if {entity} is not a Contact
             */
            removeEntity: function(entity) {
                if (!(entity && entity instanceof jabberwerx.RosterContact)) {
                    throw new TypeError("entity must be a contact");
                }

                this.deleteContact(entity.jid);
            },

            /**
             * @private
             */
            startRendezvous: function(ctx) {
                this._super(ctx);
                this.fetch();

                return true;
            },
            finishRendezvous: function() {
                this.client.entitySet.endBatch();

                this.event("rosterfetched").trigger();
                return this._super();
            },

            /**
             * DEPRECATED.  This function is called on the users behalf.
             *
             * Fetch a user's roster and adds the contacts to the {@link jabberwerx.Client#entitySet}
             *
             * @param {function} [callback] The function called after the server response is processed. If a server error
             * occurs, the function will be passed the error stanza response.
             * <p>The signature of the function is <code>callback(errorStanza)</code>.</p>
             * <p>The callback will be invoked in the context of the RosterController
             * e.g. <code>callback.call(this, errorStanza)</code>. Therefore in the callback method <code>this</code> will
             * refer to the instance of RosterController and so <code>this.client</code> will retrieve the {@link jabberwerx.Client} object.</p>
             *
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
             *
             */
            fetch: function(callback) {
                if (!this.client.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }
                if (callback !== undefined && !jabberwerx.$.isFunction(callback)) {
                    throw new TypeError('The callback param must be a function');
                }
                //The variable 'that' will be visible to the senqIq callback
                var that = this;
                this.client.entitySet.startBatch();
                //Send roster query
                this.client.sendIq('get', null, "<query xmlns='jabber:iq:roster'/>",
                    function (stanza) {
                        var error = that._checkError(stanza);
                        if (error) {
                            that.event("errorEncountered").trigger({
                                operation: "fetch",
                                error: error
                            });
                            //finishRendezvous will be called from processfetch
                        }
                        var items = jabberwerx.$('item', stanza).map(function() {
                            return this.xml;
                        }).get();

                        // store the roster items and start processing
                        that._fetchedPendingItems = items;
                        that._processFetchedItem();
                        //since this is deprecated and callback is never set
                        //when we call it, just call it now. don't wait for finish
                        if (callback) {
                            callback.call(that, error);
                        }
                    },
                    20
                );
            },
            _processFetchedItem: function() {
                var cache = this.client.entitySet;
                var count = 0;
                do {
                    var contact = this._fetchedPendingItems.shift();
                    if (!contact) {
                        /*DEBUG-BEGIN*/
                        jabberwerx.util.debug.log('Roster fetch complete');
                        /*DEBUG-END*/
                        delete this._fetchPendingWorker;
                        this.finishRendezvous();
                        return;
                    }
                    contact = jabberwerx.util.unserializeXML(contact);
                    contact = new jabberwerx.RosterContact(contact, this);
                    var jid = contact.jid;
                    var ent = cache.entity(jid);
                    if (ent) {
                        contact.apply(ent, false);
                        ent.remove();
                    }
                    cache.register(contact);

                    /*DEBUG-BEGIN*/
                    jabberwerx.util.debug.log('Contact with JID ' + jid + ' is registered with the entity set');
                    /*DEBUG-END*/
                    count++;
                } while (count < jabberwerx.RosterController.FETCH_ITEM_PROCESS_COUNT);

                this._fetchPendingWorker = window.setTimeout(
                        this.invocation("_processFetchedItem"),
                        jabberwerx.RosterController.FETCH_ITEM_PROCESS_INTERVAL);
            },

            /**
             * Add a contact to a user's roster. Invoking this method is the same as invoking {@link jabberwerx.RosterController#updateContact}
             *
             * @param {jabberwerx.JID|String} jid The JID of the contact to be added
             * @param {String} [nickname] The nickname to associate with the contact
             * @param {String|String[]} [groups] The name of the group or array of groups names to associate with the contact
             * @param {function} [callback] The function called after the server response is processed. If a server error
             * occurs, the function will be passed the error stanza response.
             * <p>The signature of the function is <code>callback(errorStanza)</code>.</p>
             * <p>The callback will be invoked in the context of the RosterController
             * e.g. <code>callback.call(this, errorStanza)</code>. Therefore in the callback method <code>this</code> will
             * refer to the instance of RosterController and so <code>this.client</code> will retrieve the {@link jabberwerx.Client} object.</p>
             *
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
             * @throws {jabberwerx.JID.InvalidJIDError} If the JID argument is undefined, null or an empty string
             */
            addContact: function(jid, nickname, groups, callback) {
                this._updateContact(jid, nickname, groups, callback, true);
            },

            /**
             * Update a contact on a user's roster.
             *
             * @param {jabberwerx.JID|String} jid The JID of the contact to be updated
             * @param {String} [nickname] The nickname to associate with the contact
             * @param {String|String[]} [groups] The name of the group or array of groups names to associate with the contact
             * @param {function} [callback] The function called after server response is processed. If a server error
             * occurs, the function will be passed the error stanza response.
             * <p>The signature of the function is <code>callback(errorStanza)</code>.</p>
             * <p>The callback will be invoked in the context of the RosterController
             * e.g. <code>callback.call(this, errorStanza)</code>. Therefore in the callback method <code>this</code> will
             * refer to the instance of RosterController and so <code>this.client</code> will retrieve the {@link jabberwerx.Client} object.</p>
             *
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
             * @throws {jabberwerx.JID.InvalidJIDError} If the JID argument is undefined, null or on empty string
             */
            updateContact: function(jid, nickname, groups, callback) {
                // TODO: Cannot get server to produce any errors
                // TODO: After contact add, will roster in entity set be stale
                this._updateContact(jid, nickname, groups, callback, false);
            },

            /**
             * @private
             */
            _updateContact: function(jid, nickname, groups, callback, addContact) {
                if (callback !== undefined && !jabberwerx.$.isFunction(callback)) {
                    throw new TypeError('The callback param must be a function');
                }
                if (!this.client.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }

                var that = this;

                //Normalize JID to a bare JID object
                jid = jabberwerx.JID.asJID(jid).getBareJID();

                // remember existing contact (if any)
                var entity = this.client.entitySet.entity(jid);

                //Normalize groups array
                if (groups && (typeof groups == 'string' || groups instanceof String)) {
                    groups = [groups.toString()];
                } else if (!(groups instanceof Array) || !groups.length ||
                           (groups.length == 1 && groups[0] == "")) {
                    groups = (this.defaultGroup && [this.defaultGroup.toString()]) || [];
                }

                //Create query DOM
                var builder = new jabberwerx.NodeBuilder('{jabber:iq:roster}query');
                with (builder.element('item')) {
                    attribute('jid', jid.toString());
                    if (nickname) {
                        attribute('name', nickname);
                    }
                    for (var i = 0; i < groups.length; i++) {
                        element('group').text(groups[i]);
                    }
                }

                //Send roster set
                if (callback) {
                    this.client.sendIq("set", null, builder.data, function(stanza) {
                        if (stanza) {
                            var err = that._checkError(stanza);
                            callback.call(that, err);
                        }
                    });
                } else {
                    this.client.sendIq("set", null, builder.data);
                }

                if (addContact || this.autoSubscription) {
                    this.subscribe(jid);
                }
            },

            /**
             * <p>Sends out a subscribe request unless the current user is
             * already subscribed to the passed in JID.</p>
             *
             * @param {jabberwerx.JID|String} jid The JID of the contact to be updated
             *
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
             * @throws {jabberwerx.JID.InvalidJIDError} If {jid} is an invalid JID.
             */
            subscribe: function(jid) {
                if (!this.client.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }

                jid = jabberwerx.JID.asJID(jid).getBareJID();
                var entity = this.client.entitySet.entity(jid);

                if (entity && entity instanceof jabberwerx.RosterContact) {
                    if (entity.properties.subscription == "to" ||
                        entity.properties.subscription == "both") {
                        return;
                    }
                }
                this.client.sendStanza("presence", "subscribe", jid);
            },

            /**
             * <p>Sends out an unsubscribe request when the current user is
             * subscribed to the passed in JID.</p>
             *
             * @param {jabberwerx.JID|String} jid The JID of the contact to be updated
             *
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
             * @throws {jabberwerx.JID.InvalidJIDError} If {jid} is an invalid JID.
             */
            unsubscribe: function(jid) {
                if (!this.client.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }

                jid = jabberwerx.JID.asJID(jid).getBareJID();
                //remove previous subscription state as needed
                this._clearAckAck(jid);
                var entity = this.client.entitySet.entity(jid);

                if (entity && entity instanceof jabberwerx.RosterContact) {
                    if (entity.properties.subscription == "both") {
                        this.client.sendStanza("presence", "unsubscribe", jid);
                    } else if (entity.properties.subscription == "to" ||
                               entity.properties.subscription == "none") {
                        // We don't want a contact in a 'none' state.
                        // Delete the contact if that is what an unsubscribe would do.
                        this.deleteContact(jid);
                    }
                }
            },

            /**
             * Delete a contact from a user's roster
             *
             * @param {jabberwerx.JID|String} jid The JID of the contact to be deleted
             * @param {function} [callback] The function called after the server response is processed. If a server error
             * occurs, the function will be passed the error stanza response.
             * <p>The signature of the function is <code>callback(errorStanza)</code>.</p>
             * <p>The callback will be invoked in the context of the RosterController
             * e.g. <code>callback.call(this, errorStanza)</code>. Therefore in the callback method <code>this</code> will
             * refer to the instance of RosterController and so <code>this.client</code> will retrieve the {@link jabberwerx.Client} object.</p>
             *
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
             * @throws {jabberwerx.JID.InvalidJIDError} If {jid} is undefined, null or an empty string
             */
            deleteContact: function(jid, callback) {
                if (!this.client.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }
                if (callback !== undefined && !jabberwerx.$.isFunction(callback)) {
                    throw new TypeError('The callback param must be a function');
                }
                var that = this;

                //Normalize JID to a bare JID object
                var jid = new jabberwerx.JID.asJID(jid).getBareJID();

                //Create query DOM
                var builder = new jabberwerx.NodeBuilder('{jabber:iq:roster}query');
                builder = builder.element('item');
                builder = builder.attribute('jid', jid.toString());
                builder = builder.attribute('subscription', 'remove');

                //Send roster set
                this.client.sendIq('set', null, builder.document.xml,
                    function (stanza) {
                        var error = that._checkError(stanza);
                        if (callback) {
                            callback.call(that, error);
                        }
                    }
                );
            },

            /**
             * <p>Accepts a subscription request from a contact</p>
             * @param {String|JID} contact The contact to accept the subscription from
             * @param {String} [nickname] The nickname to apply to the contact in our roster
             * @param {String} [groups] The groups to apply to the contact in our roster
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not
             * connected
             */
            acceptSubscription: function(contact, nickname, groups) {
                if (!this.client.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }
                // Ensure contact is a jid and strip the resource
                contact = jabberwerx.JID.asJID(contact).getBareJID();
                //remove previous subscription state as needed
                this._clearAckAck(contact);
                // Send subscribed
                this.client.sendStanza("presence", "subscribed", contact);
                this.updateContact(contact, nickname, groups);
            },

            /**
             * <p>Denies (or cancels an existing) subscription from a contact.</p>
             * @param {String|jabberwerx.JID} contact The contact to deny the subscription from
             * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not
             * connected
             */
            denySubscription: function(contact) {
                if (!this.client.isConnected()) {
                    throw new jabberwerx.Client.NotConnectedError();
                }
                // Ensure contact is a jid and strip the resource
                contact = jabberwerx.JID.asJID(contact).getBareJID();
                //remove previous subscription state as needed
                this._clearAckAck(contact);
                // Send unsubscribed
                this.client.sendStanza("presence", "unsubscribed", contact);

                // Delete contact if present in entity set
                if (this.autoSubscription) {
                    var entity = this.client.entitySet.entity(contact);
                    if (entity && entity instanceof jabberwerx.RosterContact) {
                        this.deleteContact(contact);
                    }
                }
            },
            /**
             * @private
             */
            willBeSerialized: function() {
                if (this._fetchedPendingWorker) {
                    window.clearTimeout(this._fetchedPendingWorker);
                    delete this._fetchedPendingWorker;
                }
            },
            /**
             * @private
             */
            graphUnserialized: function() {
                if (this._fetchedPendingItems && this._fetchedPendingItems.length) {
                    this._processFetchedItem();
                }
            },
            /**
             * Remove the already acknowledged "subscribed" flag.
             * Called anytime presence state may change (before we send sub pres)
             *
             * @private
             */
            _clearAckAck: function(jid) {
                var entity = this.client.entitySet.entity(jabberwerx.JID.asJID(jid).getBareJID());
                if (entity) {
                    delete entity.properties.ackack;
                }
            },

            /**
             * <p>Cleanup RosterContact entity on behalf of an owning
             * {@link jabberwerx.EntitySet}.</p>
             *
             * @param {jabberwerx.Entity} entity The entity to destroy
             */
            cleanupEntity: function(entity) {
                //entity cache is cleaning up after a disconnect...
                if (this._fetchPendingWorker) {
                    //received disconnect while processing fetch. throw
                    //it all away, finishRendezvous will never be called
                    this._fetchedPendingItems = [];
                    window.clearInterval(this._fetchPendingWorker);
                    delete this._fetchPendingWorker;
                }
                if (entity instanceof jabberwerx.RosterContact) {
                    entity.destroy();
                }
            },

            /**
             * Check a response element to see if it contains an error.
             *
             * @private
             * @param {Element} parentElement The element to check to see if it contains a child &lt;error&gt;
             * @returns {Element|undefined} The error element if it exists or else undefined
             */
            _checkError: function(parentElement) {
                var error = undefined;
                var child = jabberwerx.$(parentElement).children("error")[0];
                if (child && child.nodeName == 'error') {
                    error = child;
                }
                return error;
            },

            /**
             * @private
             */
            _autoAccept: function(prs) {
                var from = prs.getFromJID();
                //remove last subscription state flag as needed
                this._clearAckAck(from);
                var entity = this.client.entitySet.entity(from);

                var handled =
                    this.autoaccept == jabberwerx.RosterController.AUTOACCEPT_ALWAYS;

                if (    !handled &&
                        this.autoaccept_in_domain &&
                        from.getDomain() == this.client.connectedUser.jid.getDomain()) {
                    handled = true;
                }
                if (    !handled &&
                        this.autoaccept == jabberwerx.RosterController.AUTOACCEPT_IN_ROSTER &&
                        entity) {
                    var props = entity.properties;
                    handled =   props["subscription"] == "to" ||
                                props["subscription"] == "none" ||
                                props["ask"] == "subscribe";
                }

                if (handled) {
                    if (entity) {
                        var nick = entity.getDisplayName();
                        if (nick == entity.jid.toString()) {
                            nick = "";
                        }
                        var groups = entity.getGroups();

                        this.acceptSubscription(from, nick, groups);
                    } else {
                        this.acceptSubscription(from);
                    }
                }

                return handled;
            },
            /**
             * @private
             */
            _autoRemove: function(prs) {
                var from = prs.getFromJID();
                //remove previous subscription state as needed
                this._clearAckAck(from);
                this.client.sendStanza("presence",
                                       "unsubscribed",
                                       from);

                var entity = this.client.entitySet.entity(from.getBareJID());
                var handled = (this.autoSubscription && this.autoremove) ||
                               entity.properties.subscription == "from" ||
                               entity.properties.subscription == "none";

                if (handled) {
                    this.deleteContact(from);
                }

                return handled;
            },

            /**
             * @private
             */
            _handleSubscription: function(evt) {
                var prs = evt.data;
                switch (prs.getType()) {
                    case "subscribe":
                        // handle auto-accept
                        var handled = this._autoAccept(prs);

                        // fire event
                        this.event("subscriptionReceived").trigger({
                            stanza: prs,
                            handled: handled
                        });
                        break;
                    case "subscribed":
                        // acknowledge the acknowledgement unless already acked
                        var e = this.client.entitySet.entity(prs.getFromJID().getBareJID());
                        if (!e || e.properties.ackack === undefined) {
                            this.client.sendStanza("presence",
                                                   "subscribe",
                                                   prs.getFrom());
                            if (e) {
                                e.properties.ackack = true;
                            }
                        }
                        break;
                    case "unsubscribe":
                        // handle auto-remove
                        var handled = this._autoRemove(prs);

                        // fire event
                        this.event("unsubscriptionReceived").trigger({
                            stanza: prs,
                            handled: handled
                        });
                        break;
                    case "unsubscribed":
                        //remove previous subscription state as needed
                        this._clearAckAck(prs.getFromJID());
                        // acknowledge the acknowledgement
                        this.client.sendStanza("presence",
                                               "unsubscribe",
                                               prs.getFrom());
                        break;
                }
                // Event handled
                return true;
            },
            /**
             * TODO: there is a timing issue here that can occur. In order to establish roster subscriptions
             * fetch() has to be called. However, at the moment there's no guarantee that the fetch() response
             * callback has updated the entity set prior to this event coming from the server. So this method and
             * the fetch roster response method might end up trying to add the same entity to the set.
             *
             * Perhaps the fetch should hold off clearing the entity cache until the iq result
             * callback is fired.
             * @private
             */
            _handleRosterUpdate: function(evt) {
                var node = jabberwerx.$(evt.selected);
                var item = node.children('item');
                var jid = item.attr('jid');
                var subscr = item.attr("subscription");

                var entity = this.client.entitySet.entity(jid);
                if (subscr != "remove") {
                    item = item.get()[0];
                    if (entity && entity instanceof jabberwerx.RosterContact) {
                        // update the existing contact
                        entity.setItemNode(item);
                    } else {
                        // add the new contact
                        var contact = new jabberwerx.RosterContact(item, this);
                        if (entity) {
                            contact.apply(entity, false);
                            entity.remove();
                        }
                        this.client.entitySet.register(contact);
                    }
                } else if (entity && entity instanceof jabberwerx.RosterContact) {
                    delete entity.properties.subscription;
                    delete entity.properties.ask;
                    entity.destroy();
                }
                // Event handled
                return true;
            },

            /**
             * @private
             * Pending fetched items to add
             */
            _fetchedPendingItems: [],

            /**
             * <p>Indicates the behavior when any subscription action is necessary.
             * When set to false, the RosterController will do nothing in the way of
             * automatically sending subscribes or unsubscribes</p>
             *
             * <p>The default value is {true} which allows
             * {@link jabberwerx.RosterController#autoaccept},
             * {@link jabberwerx.RosterController#autoaccept_in_domain}
             * and {@link jabberwerx.RosterController#autoremove} to determine
             * the behavior of the RosterController when dealing with subscriptions.</p>
             * @type Boolean
             */
            autoSubscription: true,
            /**
             * <p>Indicates the behavior when receving presence subscriptions.
             * The possible values are:</p>
             * <ol>
             * <li>{@link jabberwerx.RosterController.AUTOACCEPT_NEVER}: never
             * automatically accept subscription requests.</li>
             * <li>{@link jabberwerx.RosterController.AUTOACCEPT_IN_ROSTER}:
             * only automatically accept if the sender is in the roster, with
             * either [subscription=to] or [ask=subscribe]. <b>DEFAULT</b></li>
             * <li>{@link jabberwerx.RosterController.AUTOACCEPT_ALWAYS}:
             * always automatically accept subscription requests.</li>
             * </ol>
             *
             * <p>The default value is
             * {@link jabberwerx.RosterController.AUTOACCEPT_IN_ROSTER}.</p>
             *
             * @type String
             */
            autoaccept: 'in-roster', //using a string, since constants not yet defined
            /**
             * <p>Indicates if subscription requests will be automatically
             * accepted if the sender's domain exactly matches the client's
             * domain. This behavior supercedes that indicated by
             * {@link jabberwerx.RosterController#autoaccept}. In order to
             * disable all possible automatic subscription acceptance, both
             * this property and {autoaccept} must be set appropriately.</p>
             *
             * <p>The default value is {true}, which is to accept in-domain
             * subscription requests.</p>
             *
             * @type Boolean
             */
            autoaccept_in_domain: true,
            /**
             * <p>Indicates if unsubscription requests will be automatically
             * processed (removing the sending contact from this roster).</p>
             *
             * <p>The default value if {true}, which is to automatically remove
             * contacts when receiving unsubscribe requests.</p>
             *
             * @type Boolean
             */
            autoremove: true,
            /**
             * <p>Specifies the default group to which contacts are added or updated to. This
             * property is only used when a groups parameter is not specified (or empty) in the
             * add, update or accept subscription method call. It defaults to an empty string
             * (i.e. no group). Modify this variable directly to set the default group.</p>
             *
             * <p>This is not linked to
             * {@link jabberwerx.ui.RosterView#getDefaultGroupingName}.</p>
             *
             * @type    String
             */
            defaultGroup: ""
        }, 'jabberwerx.RosterController');

        /**
         * @private
         */
        jabberwerx.RosterController.FETCH_ITEM_PROCESS_INTERVAL = 5;
        /**
         * @private
         */
        jabberwerx.RosterController.FETCH_ITEM_PROCESS_COUNT = 1;
        /**
         * <p>One of the possible values which {@link jabberwerx.RosterController#autoaccept} may be set to.</p>
         * @constant
         * @type {String}
         */
        jabberwerx.RosterController.AUTOACCEPT_NEVER = "never";
        /**
         * <p>One of the possible values which {@link jabberwerx.RosterController#autoaccept} may be set to.</p>
         * @constant
         * @type {String}
         */
        jabberwerx.RosterController.AUTOACCEPT_IN_ROSTER = "in-roster";
        /**
         * <p>One of the possible values which {@link jabberwerx.RosterController#autoaccept} may be set to.</p>
         * @constant
         * @type {String}
         */
        jabberwerx.RosterController.AUTOACCEPT_ALWAYS = "always";
    }

    jabberwerx.RosterController.mixin(jabberwerx.Rendezvousable);
})();

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/CapabilitiesController.js*/
/**
 * filename:        CapabilitiesController.js
 * created at:      2010/02/25T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

;(function(){
    if (jabberwerx) {
        jabberwerx.CapabilitiesController = jabberwerx.Controller.extend(/** @lends jabberwerx.CapabilitiesController.prototype */{
            /**
             * @class
             * <p>Controller class for capability functionality. This class is responsible for attaching the capabilities element to all
             * outgoing presence stanzas. It also registers for disco info iq messages and responds with the identity and list of
             * supported capabilities of this client. The feature set for this client can be modified using the add and remove Feature
             * methods, or by modifying the jabberwerx_config option before loading the library. This is referred to as 
             * "Outgoing Caps."</p>
             * 
             * <p>Any incoming caps information from a presence packet will be stored in this controller. If the hash referred to in the
             * caps portion of the presence is not known, a disco#info iq will be sent out to the owner of the unknown hash. The caps
             * hash will have a list of associated JIDs and a list of the capabilities associated with the hash. This is referred to as
             * "Incoming Caps."</p>
             *
             * <p>All methods that are Incoming Caps will not wait for the
             * disco#info request before returning. They return the current
             * information for that particular JID at the time of the method
             * call. It is best to call the Incoming Caps methods in the
             * "entityUpdated" event callback.</p>
             *
             * @description
             * Creates a new CapabilitiesController with the given client.
             *
             * @param {jabberwerx.Client} client The owning client
             * @throws {TypeError} If {client} is not valid
             * @constructs jabberwerx.CapabilitiesController
             * @extends jabberwerx.Controller
             */
            init: function(client) {
                this._super(client, "capabilities");
                this.client.event('beforePresenceSent').bind(this.invocation('_beforePresenceHandler'));
                this.client.event('presenceSent').bind(this.invocation('_resendCaps'));
                this.client.event('iqReceived').bindWhen("*[type='get'] query[xmlns='http://jabber.org/protocol/disco#info']", this.invocation('_discoInfoHandler'));
                jabberwerx.globalEvents.bind("resourcePresenceChanged", this.invocation("_handleResourcePresenceUpdate"));
                this.addFeature('http://jabber.org/protocol/caps');
                this.addFeature('http://jabber.org/protocol/disco#info');
            },
            /**
             * Destroys this CapabilitiesController. This method unbinds all
             * registered callbacks.
             */
            destroy: function() {
                this.client.event('beforePresenceSent').unbind(this.invocation('_beforePresenceHandler'));
                this.client.event('presenceSent').unbind(this.invocation('_resendCaps'));
                this.client.event('iqReceived').unbind(this.invocation('_discoInfoHandler'));
                jabberwerx.globalEvents.unbind("resourcePresenceChanged", this.invocation("_handleResourcePresenceUpdate"));
                this._super();
            },
            
            /**
             * @private
             */
            _updatePresence: function(jid) {
                if ((this.client.isConnected())  && (this.client.getCurrentPresence() != null)) {
                    var p = this.client.getCurrentPresence().clone();
                    jabberwerx.$(p.getNode()).
                               find("c[xmlns=http://jabber.org/protocol/caps]").
                               remove();
                    if (jid) {
                        p.setTo(jid);
                    }
                    this.client.sendStanza(p);
                }
            },

            /**
             * <p>Add a feature to the feature set. If the feature already exists within the set then it will
             * not be added again and false will be returned.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String} feature Feature to add to feature set
             * @returns {Boolean} <tt>true</tt> if successfully added, false if unsuccessful
             */
            addFeature: function(feature) {
                var retVal = false;
                if (typeof feature == 'string') {
                    if (!this.containsFeature(feature)) {
                        // Insert item onto end of feature set and sort
                        this._featureSet.push(feature);
                        this._featureSet.sort();
                        retVal = true;
                    }
                }
                if (retVal) {
                    this._updatePresence();
                }
                
                return retVal;
            },

            /**
             * <p>Remove feature from the feature set.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String} feature The feature in the feature set to remove
             * @returns {Boolean} <tt>true</tt> if successfully removed feature, false if unsuccessful
             */
            removeFeature: function(feature) {
                var retVal = false;
                if (typeof feature == 'string' || feature instanceof String) {
                    var index = jabberwerx.$.inArray(feature, this._featureSet);
                    if (index >= 0) {
                        this._featureSet.splice(index, 1);
                        retVal = true;
                    }
                }
                if (retVal) {
                    this._updatePresence();
                }
                
                return retVal;
            },

             /**
             * <p>Add a feature to the feature set for the given jid.
             * If the feature already exists within the set then it will
             * not be added again and false will be returned.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String|jabberwerx.JID} jid The jid for which to add feature
             * @param {String} feature Feature to add to feature set
             * @throws {TypeError} If feature is not a non empty string.
             * @throws {jabberwerx.JID.InvalidJIDError} If {jid} could not be converted into a JID
             * @returns {Boolean} <tt>true</tt> if successfully added, <tt>false</tt> if unsuccessful
             */
            addFeatureToJid: function(jid, feature) {
                if (!(feature && typeof feature == 'string')) {
                    throw new TypeError("feature must be non empty string");
                }
                var validatedJid = jabberwerx.JID.asJID(jid).getBareJID();
                if (!this._featureSetPerJid[validatedJid]) {
                    this._featureSetPerJid[validatedJid] = new jabberwerx.CapabilitiesController.JidFeatureSet(this);
                }
                var retVal = this._featureSetPerJid[validatedJid].addFeature(feature);
                if (retVal) {
                    this._updatePresence(jid);
                }
                
                return retVal;
            },

            /**
             * <p>Checks to see if the given feature is in the list for the given jid.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String|jabberwerx.JID} jid The jid for which to lookup a feature
             * @param {String} feature Feature to look up
             * @throws {TypeError} If feature is not a non empty string.
             * @throws {jabberwerx.JID.InvalidJIDError} If {jid} could not be converted into a JID
             * @returns {Boolean} <tt>true</tt> if found, <tt>false</tt> otherwise
             */
            containsFeatureForJid: function(jid, feature) {
                if (!(feature && typeof feature == 'string')) {
                    throw new TypeError("feature must be non empty string");
                }
                var validatedJid = jabberwerx.JID.asJID(jid).getBareJID();
                if (this._featureSetPerJid[validatedJid]) {
                    return this._featureSetPerJid[validatedJid].containsFeature(feature);
                }
                else {
                    return false;
                }
            },


            /**
             * <p>Remove feature from the feature set for the given jid.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String|jabberwerx.JID} jid The jid for which to lookup a feature
             * @param {String} feature The feature in the feature set to remove
             * @throws {TypeError} If feature is not a non empty string.
             * @throws {jabberwerx.JID.InvalidJIDError} If {jid} could not be converted into a JID
             * @returns {Boolean} <tt>true</tt> if successfully removed feature, <tt>false</tt> otherwise
             */
            removeFeatureFromJid: function(jid, feature) {
                var retVal = false;
                if (!(feature && typeof feature == 'string')) {
                    throw new TypeError("feature must be non empty string");
                }
                var validatedJid = jabberwerx.JID.asJID(jid).getBareJID();
                if (this._featureSetPerJid[validatedJid]) {
                    retVal = this._featureSetPerJid[validatedJid].removeFeature(feature);
                    if (this._featureSetPerJid[validatedJid].extraFeatures.length == 0) {
                        delete this._featureSetPerJid[validatedJid];
                    }
                }
                if (retVal) {
                    this._updatePresence(jid);
                }
                return retVal;
            },

            /**
             * This function is invoked after normal presence stanza is sent.
             * It iterates through the set of jids and resends
             * corresponing stanzas to each one in the list.
             * @private
             */
            _resendCaps: function(eventObj) {

                var presence = eventObj.data;
                //Only resend presence stanzas if we are not sending typed presence or directed
                //presence or the user is still online.
                if (!(presence.getTo() || presence.getType() || presence.getShow() == 'unavailable')) {
                    for (var jid in this._featureSetPerJid) {
                        var entity = this.client.entitySet.entity(jid);
                        if (entity && entity instanceof(jabberwerx.RosterContact) &&
                            entity.properties.subscription != "both" &&
                            entity.properties.subscription != "to") {
                            var p = presence.clone();
                            jabberwerx.$(p.getNode()).find("c[xmlns=http://jabber.org/protocol/caps]").remove();
                            p.setTo(jid);
                            this.client.sendStanza(p);
                        }
                    }
                }
            },

            /**
             * <p>This function returns presence stanza with corresponding
             * caps node.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @private
             */
            attachCapabilitiesToPresence: function(presence) {
                if (!(presence && presence instanceof jabberwerx.Presence)) {
                    throw new TypeError("presence must be a jabberwerx.Presence");
                }

                // Check for the'c' node (capability node)
                var builder = jabberwerx.$(presence.getNode()).
                        find("c[xmlns=http://jabber.org/protocol/caps]").
                        map(function() { return new jabberwerx.NodeBuilder(this); })[0];
                // Check to see if ver attribute is set
                var ver_attr = jabberwerx.$(presence.getNode()).
                        find("c[ver]").
                        map(function() { return new jabberwerx.NodeBuilder(this); })[0];

                //If version is already attached no actions required.
                if (!ver_attr) {
                    var ver = null;
                    //If not found c node, create one
                    if (!builder) {
                        builder = new jabberwerx.NodeBuilder(presence.getNode()).
                        element("{http://jabber.org/protocol/caps}c");
                    }
                    //Check if it is direct presence
                    if (presence.getTo()) {
                        var jid = presence.getToJID();
                        ver = this.getVerificationStringForJid(jid);
                    }
                    if (!ver) {
                       //If not found extra features for the jid, set default ver.
                       ver = this.generateVerificationString();
                    }
                    builder.attribute("hash", "sha-1");
                    builder.attribute("node", this.node);
                    builder.attribute("ver", ver);
                }
            },

             /**
             * <p>Helper function used in unit tests which returns verification string for the given jid.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {jabberwerx.JID|String} jid The jid for which to return the verification string for.
             * @throws {jabberwerx.JID.InvalidJIDError} If {jid} could not be converted into a JID
             * @returns {String} Returns null if match is not found, otherwise returns verification string
             */
            getVerificationStringForJid: function(jid) {
                var ver = null;
                var validatedJid = jabberwerx.JID.asJID(jid).getBareJID();
                if (this._featureSetPerJid[validatedJid]) {
                    ver = this._featureSetPerJid[validatedJid].ver;
                }
                return ver;
            },

             /**
             * <p>This functions returns verification string based on node value passed.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String} nodeVal for which to return the verification string for
             * @returns {String} Returns null if match is not found, otherwise returns verification string
             */
            getVerificationString: function(nodeVal) {
                var ver = null;

                if (nodeVal == this.node + '#' + this.generateVerificationString()) {
                    ver = this.generateVerificationString();
                } else {
                    for (var jid in this._featureSetPerJid) {
                        if (nodeVal == this.node + '#' + this._featureSetPerJid[jid].ver) {
                            ver = this._featureSetPerJid[jid].ver;
                            break;
                        }
                    }

                }
                return ver;
            },

             /**
             * <p>This function returns set of features for the given verification string.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String} ver Verification string for which to return the set of features for.
             * @throws {TypeError} if ver is not a non empty String.
             * @returns {String[]} Alphabetically sorted set of features
             */
            getFeaturesForVerificationString: function(ver) {
                var features = [];
                if (!(ver && typeof ver == 'string')) {
                   throw new TypeError("version must be non empty string");
                }

                if (ver == this.generateVerificationString()) {
                    features = this.getFeatureSet();
                } else {
                     for (var jid in this._featureSetPerJid) {
                        if (ver == this._featureSetPerJid[jid].ver) {
                            features =  jabberwerx.unique(this.getFeatureSet().concat(this._featureSetPerJid[jid].extraFeatures));
                            features.sort();
                         }
                    }
                }

                return features;
            },

            /**
             * <p>Get the alphabetically sorted array of features in the feature set</p>
             * <p>This is an Outgoing Caps method.</p>
             * @returns {String[]} Alphabetically sorted set of features
             */
            getFeatureSet: function() {
                return this._featureSet;
            },

            /**
             * <p>Returns true if the feature is in the feature set, or false if not present.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {String} feature for which to check for
             * @returns {Boolean} <tt>true</tt> if present, otherwise false
             */
            containsFeature: function(feature) {
                var retVal = false;
                for (var i=0; i<this._featureSet.length; i++) {
                    if (this._featureSet[i] == feature) {
                        retVal = true;
                        break;
                    }
                }
                return retVal;
            },

            /**
             * <p>Generate the verification string according to XEP-0115 Section 5. Uses the SHA-1 algorithm.
             * Uses the feature set and identity to determine the verification string.</p>
             * <p>This is an Outgoing Caps method.</p>
             * @param {Array} [features] Array of features
             * @returns {String} the verification string
             */
            generateVerificationString: function(features) {
                var feats = (features ? 
                    jabberwerx.unique(this._featureSet.concat(features)) :
                    this._featureSet);
                    
                return jabberwerx.CapabilitiesController._generateVerificationString(
                    [this._getIdentity()],
                    feats,
                    []);
            },

            /**
             * Builds up the identity from the individual parts of the identity member variable
             * @private
             * @returns {String} full identity
             */
            _getIdentity: function() {
                return (this.identity.category ? this.identity.category : '') + '/' +
                       (this.identity.type ? this.identity.type : '') + '//' +
                       (this.identity.name ? this.identity.name : '');
            },

            /**
             * Triggered before a presence stanza is sent. Attaches capability node to presence object.
             * @private
             * @param {jabberwerx.EventObject} eventObj
             * @returns {Boolean} false This allows other observers (if binded) to deal with the event also
             */
            _beforePresenceHandler: function(eventObj) {
                var presence = eventObj.data;
                //Only attach caps to presence stanzas without type and if the user
                //is online (not unavailable).
                if (!(presence.getType() || presence.getShow() == 'unavailable')) {
                    this.attachCapabilitiesToPresence(presence);
                }
                return false;
            },

            /**
             * Triggered on receiving an IQ stanza where the query has an xmlns='http://jabber.org/protocol/disco#info' attribute.
             * Replies with an IQ result to the requesting jid which contains the identity and feature set.
             * @private
             * @param {jabberwerx.EventObj} eventObj
             */
            _discoInfoHandler: function(eventObj) {

                jabberwerx.util.debug.log("received disco#info request...");
                var iq = eventObj.data;
                var iqResult = this._createDiscoInfoResponse(iq);
                this.client.sendStanza(iqResult);
                return true;
            },

            /**
             * Creates the iq result or error stanza to a disco info request.
             * @private
             * @param {jabberwerx.IQ} iq The IQ stanza of type 'get' to create the response for
             */
            _createDiscoInfoResponse: function(iq) {
                var iqResult = null;
                var nodeValue = jabberwerx.$(iq.getQuery()).attr('node');
                var ver = null;

                if (nodeValue) {
                   ver = this.getVerificationString(nodeValue);
                }

                if (!nodeValue || ver) {
                    // Creates a iq stanza of type result to reply to the incoming iq
                    var builder = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/disco#info}query");
                    if (ver) {
                        builder.attribute('node', this.node + '#' + ver);
                    }

                    var identity = {
                        "category": this.identity.category,
                        "type": this.identity.type};
                    if (this.identity.name) {
                        identity.name = this.identity.name;
                    }

                    builder.element('identity', identity);
                    var features = null;
                    if (!nodeValue) {
                        features = this._featureSet;
                    } else {
                        features = this.getFeaturesForVerificationString(ver);
                    }

                    jabberwerx.$.each(features, function() {
                                builder.element('feature', {"var": this});
                                return true;
                    });

                    iqResult = iq.reply(builder.data);
                } else {
                    iqResult = iq.errorReply(jabberwerx.Stanza.ERR_ITEM_NOT_FOUND);
                }

                return iqResult;
            },
            
            
            /**
            * @private
            * return all capsinfo that have the given jid as a reference.
            * fulljid is matched exactly, bare jid matches every resource
            */
            _findCapsInfo: function(jid) {
                var result = [];
                //for each caps info, see if there is at least one reference from this jid
                for (var ver in this._capsCache) {
                    var ci = this._capsCache[ver];
                    if (ci.getReferences(jid).length > 0) {
                        result.push(ci);
                    }
                }                    
                return result;
            },


            /**
             * @private
             * check caps cache for the first occurance of this jid. may be bare or full
             * returns null if not found
             */
            _firstCapsInfo: function(jid) {
                var ret = this._findCapsInfo(jid);
                if (ret.length > 0) {
                    return ret[0];
                }
                return null;
            },
            
            /**
             * <p>Checks capablility information of given JID for requested feature.
             * All resources of a given bare jid are checked until one supports the feature.
             * A full jid selects at most one caps info.</p>
             * <p>This is an Incoming Caps method.</p>
             * @param {String|jabberwerx.JID} jid entity to check for features
             * @param {String} feature requested feature to search jid's capsinfo for
             * @throws {TypeError} if feature is not a non empty string.
             * @returns {Boolean} <tt>true</tt> if jid's capsinfo has the given feature
             */
            isSupportedFeature: function(jid, feature) {
                if (!jabberwerx.util.isString(feature)) {
                    throw new TypeError("Feature must be a non empty string");
                }
                jid = jabberwerx.JID.asJID(jid);
                
                var caps = _findCapsInfo(jid);
                //does feature exist in any matching caps?
                for (var ci in caps) {
                    if (jabberwerx.$.inArray(feature, ci.features) != -1) {
                        return true;
                    }
                }                    
                return false;
            },
            
            /**
             * <p>Fetch all resources of the given jid that support the requested feature.
             * Given JID is coerced to bare.</p>
             * <p>This is an Incoming Caps method.</p>
             * @param {String|jabberwerx.JID} jid base jid for resource search
             * @param {String} feature Supported feature
             * @returns {JID[]} of supporting resources. may be empty
             * @throws {TypeError} if given feature is not a non-empty string
             * @throws {TypeError} if given jid is not valid
             */
            getSupportedResources: function(jid, feature) {
                if (!jabberwerx.util.isString(feature) || feature == "") {
                    throw new TypeError("Feature must be a non empty string");
                }
                jid = jabberwerx.JID.asJID(jid).getBareJID(); 
                
                var caps = this._findCapsInfo(jid); //barejid will match all resources
                var resmap = {};
                //caps is list of  capinfo with at least one matching resource
                for (var j = 0; j < caps.length; ++j) {
                    var ci = caps[j];
                    if (jabberwerx.$.inArray(feature, ci.features) != -1) {
                        var refs = ci.getReferences(jid);
                        for (var i = 0; i < refs.length; ++i) {
                            resmap[refs[i].toString()] = refs[i]; //dedup by overwriting any existing
                        }
                    }
                }
                //return the map of actual jids
                var result = [];
                jabberwerx.$.each(resmap, function(idx, jidstr) {
                    result.push(resmap[idx]);
                });
                return result;
            },

            /**
             * Get Features for the given JID.
             *
             * Returns an array of feature Strings for the given JID.
             * A bare JID will return a union of features for all resources
             * while a full JID will return only features that match exactly.
             * <p>This is an Incomming Caps method.</p>
             * 
             * @param {jabberwerx.JID|String} jid the bare or full JID to query
             * @returns {Array} unique feature strings, may be empty if no matches or features were found.
             * @throws {TypeError} if jid is not a valid {@link jabberwerx.JID}
             * @see http://xmpp.org/extensions/xep-0030.html for complete discussion of entity features.
             */
            getFeatures: function(jid) {
                jid = jabberwerx.JID.asJID(jid); //throws TypeError as needed
                var result = [];
                var caps = this._findCapsInfo(jid);
                for (var i = 0; i < caps.length; ++i) {
                    result = result.concat(caps[i].features);
                }
                return jabberwerx.unique(result);
            },
            
            /**
             * Get Identities for the given JID.
             *
             * Returns an array of Identity objects for the given JID.
             * A bare JID will return a union of entity identities for all resources
             * while a full JID will return only identities that match exactly.
             * <p>The returned identity object is defined
             * <pre class="code">
             *  {
             *      category {String}   The identity category.
             *      type     {String}   The category's type
             *      name     {String}   The human readable name for this identity
             *      xmlLang  {String}   The language code for the name property.
             *  }
             *  </pre>
             *  All properties will exist but their value may be an empty String.</p>
             * <p>This is an Incomming Caps method.</p>
             * 
             * @param {jabberwerx.JID|String} jid the bare or full JID to query
             * @returns {Array} Identity array, may be empty if no matches were found.
             * @throws {TypeError} if jid is not a valid {@link jabberwerx.JID}
             * @see http://xmpp.org/extensions/xep-0030.html for complete discussion of entity identities.
             * @see http://xmpp.org/registrar/disco-categories.html for registered categories and
             *      corresponding types.
             */
            getIdentities: function(jid) {
                jid = jabberwerx.JID.asJID(jid); //throws TypeError as needed
                var ids = [];
                var caps = this._findCapsInfo(jid);
                for (var i = 0; i < caps.length; ++i) {
                    //ci.identities is an array of parsed identity strings
                    ids = ids.concat(caps[i].identities);                                            
                }
                //map into an array of identity objects
                return jabberwerx.$.map(
                    jabberwerx.unique(ids),
                    function (id, idx) {
                        var idParts = id.split("/");
                        return {
                            category: idParts[0],
                            type: idParts[1],
                            xmlLang: idParts[2],
                            name: idParts[3]
                        };
                    });       
            },
            
            /**
             * @private
             * create a CapsINfo and disco#info as needed
             */
            _newCapsInfo: function(jid, ver, node) {
                var ci = new jabberwerx.CapabilitiesController.CapsInfo(this, node, ver);
                ci.addReference(jid);
                this._capsCache[ver] = ci;
                //fetch disco#info for this entity
                this.client.controllers.disco.fetchInfo(
                    jid, 
                    ci.id, 
                    function (identities, features, forms, err) {
                        if (err) {
                            //invalidate capsinfo by validating an empty instance
                            ci.validate();
                        } else {
                            ci._populate(identities, features, forms);
                        }
                        //if we have a valid caps configuration (ids,feats and forms match hash)
                        //event that all referenced entities have been updated.
                        ci._capsController._updateRefs(ci.ver);
                    });
            },
            /**
            * @private
            * fire the entityupdated event for all referenced jids for one particular CapsInfo
            */
            _updateRefs: function(ver) {                
                var ujids = [];
                var ci = this._capsCache[ver];
                //dedup resources
                for (var i = 0; i < ci.items.length; ++i) {
                    //work with bare jids
                    var bstr = jabberwerx.JID.asJID(ci.items[i]).getBareJIDString();
                    if (jabberwerx.$.inArray(bstr, ujids) == -1) {
                        ujids.push(bstr);
                    }
                }
                for (var i = 0; i < ujids.length; ++i) {
                    var entity = this.client.entitySet.entity(ujids[i]);//, this._capsCache[ver]._node);
                    if (entity) {
                        this.client.entitySet.event("entityUpdated").trigger(entity); //fire and updated event
                    }
                }
            },


            /**
             * @private
             * clear the items array from all cached CapsInfo (clear info references)
             */            
            _clearRefs: function() {
                for (var ver in this._capsCache) {
                    this._capsCache[ver].clearReferences();
                }                
            },

            /**
             * @private
             * walk caps cache and remove any invalid capsinfo
             */            
           _removeInvalid: function() {
                for (var ver in this._capsCache) {
                    var ci = this._capsCache[ver];
                    if (ci.status != "valid") {
                        delete this._capsCache[ver];
                    }
                }
            },
            
            /**
             * @private
             */
            _handleResourcePresenceUpdate: function(evt) {
                if (!this._handle115Receiving) {
                    return false; //bail if debugging
                }
                if (!this.client.connectedUser) {
                    return false; //
                }
                var _myjid = jabberwerx.JID.asJID(this.client.connectedUser.jid + '/' + this.client.resourceName);

                var presence = evt.data.presence;
                //bail if no caps info
                var ce = presence ? jabberwerx.$(presence.getNode()).find("c[xmlns=http://jabber.org/protocol/caps]") : null;
                if (!ce || ce.length == 0) {
                    return false;
                }
                var jid =  evt.data.fullJid;
                var ver = ce.attr("ver");
                var node = ce.attr("node");
                //if already in cache, fulljid compare
                if (jid.equals(_myjid) && !this._capsCache[ver]) {
                    //create and populate a capsinfo for our config
                    var ci = new jabberwerx.CapabilitiesController.CapsInfo(this, node, ver);
                    ci._populate(this._getIdentity(), this._featureSet, []);
                    ci.addReference(_myjid);
                    this._capsCache[ver] = ci;
                    return false;
                }
                //if we have no entity yet bail and wait for entityset to add
                var entity = this.client.entitySet.entity(jid.getBareJID());//, this._capsCache[ver]._node);
                if (!entity) {
                    return false;
                }
                //full jid should match exactly one capsinfo. remove from existing
                var oldci = this._firstCapsInfo(jid);
                //done if resource is unavailable
                if (presence && presence.getType() != 'unavailable') {                        
                    //add reference to exisiting capsinfo, create new as needed
                    ci = this._capsCache[ver];
                    //remove ref from existing id changing caps info
                    if (oldci && (oldci === ci)) {
                        return false;
                    } else if (oldci) {
                        oldci.removeReference(jid);
                    }
                    if (ci) {
                       ci.addReference(jid);
                        //update the entity
                    } else {
                        this._newCapsInfo(jid, ver, node);
                        return false;
                    }
                //if unavailble cleanup any old references
                } else if (oldci) {
                
                    oldci.removeReference(jid);
                }
                this.client.entitySet.event("entityUpdated").trigger(entity); //fire and updated event
                return false;
            },
            
            /**
             * This simple object defines the identity to use in disco#info messages. It defaults to:
             * <i>&lt;identity category='client' type='pc' name='Cisco AJAX XMPP Library'/&gt;</i>
             * and can be changed using CapabilitiesController.identity.<i>property</i> = <i>value</i>
             * Do not replace this identity property directy. Example:
             * <i>CapabilitiesController.identity = {category: 'cat', name: 'name', type: 'type'};</i>
             * as this will cause undefined behaviour of this class.
             * Calling identity.toString() returns a string in the format:
             * <i>category/type/xmlLang/name</i>
             * <b>Note</b>: No support for the xml:lang attribute in this release
             * <p>This is an Outgoing Caps property.</p>
             */
            identity : {
                category: 'client',
                name: 'Cisco AJAX XMPP Library',
                type: 'pc',
                toString: function() {
                    return (this.category ? this.category : '') + '/' +
                           (this.type ? this.type : '') + '//' +
                           (this.name ? this.name : '');
                }
            },

            /**
             * <p>This is the node value sent out as part of the capabilities of this client. It defaults
             * to 'http://jabber.cisco.com/caxl'. Most clients will want to change this value.
             * It can be modified directly via jabberwerx.client.controller['capabilities'].node, or
             * through the jabberwerx_config object.</p>
             * <p>This is an Outgoing Caps property.</p>
             * @type String
             */
            node : 'http://jabber.cisco.com/caxl',

            /**
             * Holds a sorted list of features supported by this client. Do not modify directy but instead use the
             * CapabilitiesController.*Feature*() methods. 'http://jabber.org/protocol/disco#info' is included by
             * default as all entities must support this.
             * @private
             */
            _featureSet : ['http://jabber.org/protocol/disco#info'],
             /**
              * Holds a list of objects that track jid --> features mappings.
              * @private
              */
            _featureSetPerJid : {},

             /**
              * cache of CapsInfo objects
              * @private
              */
            _capsCache : {},

             /**
              * debugging flag used in demo to prevent 115 handling. See capsdemo.html for useage
              * @private
              */
            _handle115Receiving : true,
            
            /**
             * Flag indicating  that caps resend/resubscription is in progress,
             * set to true after normal presence packet is sent out, and set to false
             * after all direct presences/subscriptions have been resent.
             * @private
             */
            _updateCaps: false
        }, 'jabberwerx.CapabilitiesController');

        jabberwerx.CapabilitiesController.JidFeatureSet = jabberwerx.JWModel.extend ({
             /**
              * @class
              * This class is responsible for tracking jid/features mappings for
              * incoming caps packets and generating verification strings for
              * the feature sets. It is used to stored additional features for
              * the jids. The base set is stored in the CapabilitiesController
              * class.
              * @description
              * <p> This class is embedded into CapabilitiesController since it is only
              * used withing it's scope.
              *
              * @param {jabberwerx.CapabilitiesController} capsController owning this class
              * @constructs jabberwerx.CapabilitiesController.JidFeatureSet
              * @extends jabberwerx.JWModel
              */
             init: function(capsController) {
                 this._super();
                 this._capsController = capsController;
             },
             /**
              * CapabilitiesController reference.
              * @private
              */
             _capsController : {},
             /**
              * Additional features stored for this jid.
              * @type {Array}
              */
             extraFeatures : [],
             /**
              * Verification string based on the set of all features including the base set.
              * It gets recalculated every time the set is altered.
              */
             ver: null,
             /**
              * Add a feature to the feature set. If the feature already exists within the set
              * then it will not be added again and false will be returned.
              * @param {String} feature to add to feature set
              * @throws {TypeError} if feature is not a non empty string.
              * @returns {Boolean} <tt>true</tt> if successfully added, false if unsuccessful
              */
             addFeature: function(feature) {
                 var retVal = false;
                 if (!(feature && typeof feature == 'string')) {
                    throw new TypeError("feature must be non empty string");
                 }

                 if (!this.containsFeature(feature)) {
                     this.extraFeatures.push(feature);
                     this.extraFeatures.sort();
                     this.ver =  this._capsController.generateVerificationString(this.extraFeatures);
                     retVal = true;
                 }

                 return retVal;
             },

             /**
              * Checks to see if the given feature is in the list for the given jid.
              * @param {String} feature The feature to look up
              * @throws {TypeError} if feature is not a non empty string
              * @returns {Boolean} <tt>true</tt> if found, false otherwise
              */
             containsFeature: function(feature) {
                 var retVal = false;
                 if (!(feature && typeof feature == 'string')) {
                    throw new TypeError("feature must be non empty string");
                 }

                 var index = jabberwerx.$.inArray(feature, this.extraFeatures);
                 if (index >= 0) {
                       retVal = true;
                 }
                 return retVal;
             },
             /**
              * Remove feature from the feature set.
              * @param {String} feature The feature in the feature set to remove
              * @throws {TypeError} if feature is not a non empty string.
              * @returns {Boolean} <tt>true</tt> if successfully removed feature, false if unsuccessful
              */
             removeFeature: function(feature) {
                 var retVal = false;
                 if (!(feature && typeof feature == 'string')) {
                    throw new TypeError("feature must be non empty string");
                 }
                 var index = jabberwerx.$.inArray(feature, this.extraFeatures);
                 if (index >= 0) {
                     this.extraFeatures.splice(index, 1);
                     this.ver =  this._capsController.generateVerificationString(this.extraFeatures);
                     retVal = true;
                 }

                 return retVal;
             }


        }, "jabberwerx.CapabilitiesController.JidFeatureSet");
    }
    
    jabberwerx.CapabilitiesController.CapsInfo = jabberwerx.JWModel.extend(/** @lends jabberwerx.CapabilitiesController.CapsInfo.prototype */{
            /**
             * @private
             * @class
             * An encapsulation of one unique capabilities set. Private, used
             * only internally by capability controller for incoming caps
             * presence packets.
             *
             * @description
             * <p>Creates a new CapabilitiesController.CapsInfo with the given CapabilitiesController.
             *  If fetching JID is defined it will be disco#info queried and validated on result.
             * @param {jabberwerx.CapabilitiesController} capsController owning controller
             * @param {string} node identity of this client cap
             * @param {string} [ver] verification hash we will validate against
             *
             * @throws {TypeError} If {capsController} is not valid
             * @constructs jabberwerx.CapabilitiesController.CapsInfo
             * @extends jabberwerx.JWModel
             */
            init: function(capsController, node, ver) {
                this._super();

                if (!capsController || !(capsController instanceof jabberwerx.CapabilitiesController)) {
                    throw new TypeError("CapsInfo must be created with a valid CapabilitiesController");
                }

                this._capsController = capsController;
                this._node = node;
                this.ver = (ver ? ver : "");
                this._lockedVer = this.ver != "";
                this.id = this._node + "#" + this.ver;
            },

            /**
             * <p>Verify our "locked" ver is the same as a newly generated one,
             * validates the locked ver is valid for current idents/features/forms.
             * Also insures identities, features and forms are legal. Duplicate
             * identities are specifically called out in xep 115. Finally sets status
             * to "valid" or "invalid"
             * status = "valid"  ==> features et all match locked verify string
             * status = "invalid" ==> features do not match, bad data during a populate
             * @returns {Boolean} <tt>true</tt> if status=="valid"
             */
            validate: function() {
                this.status = "invalid";
                this.id = this._node + '#' + this.ver;
                //make sure all identities are unique, dups are expressly forbidden
                var uniqueIdentities = [].concat(this.identities); 
                if (jabberwerx.unique(uniqueIdentities).length != this.identities.length) {
                    jabberwerx.util.debug.log("Duplicate identifier found validating caps for " + this.id);
                    return false;
                }
                var uniqueFeatures = [].concat(this.features); 
                //dup features
                if (jabberwerx.unique(uniqueFeatures).length != this.features.length) {
                    jabberwerx.util.debug.log("Duplicate feature found validating caps for " + this.id);
                    return false;
                }
                //check for duplicate, malformed form types
                for (var i = 0; i < this._rawforms.length; ++i) {
                    var ftfld = this._rawforms[i].getFieldByVar("FORM_TYPE");
                    var ft = this._rawforms[i].getFORM_TYPE();
                    ftvals = ftfld.getValues();
                    for (var j = 0; j < ftvals.length; ++j) {
                        if (ftvals[j] != ft) {
                            return false; //multiple values with differnt cdata
                        }
                    }
                    if (this.forms[ft] != null) {
                        return false; //duplicate formtype
                    }
                    this.forms[ft] = this._rawforms[i];
                }
                var newVer = this._generateVerString();
                //floating ver, using this capinfo as a verify string generator
                if (!this._lockedVer) {
                    this.ver = newVer;
                }
                if (newVer == this.ver) {
                    this.status = "valid";
                    this.id = this.ver;
                }
                return this.status == "valid";
            },

            /**
             * @private
             * convenience method to call static generator
             */
            _generateVerString: function() {
                var frms = [];
                for (var onefrm in this.forms) {
                    frms.push(this.forms[onefrm]);
                }
                return jabberwerx.CapabilitiesController._generateVerificationString(this.identities, this.features, frms);
            },

            /**
             * <p>populate this caps from given disco info result packet or preparsed arrays
             * of identities, features and forms.
             * validates after populating and returns valid state. </p>
             *
             * <p>arguments may be
             *   an iq/query disco#info result node
             *   an object containing
             *       .identities {array of string}, optional may be empty, undefined, single string or array of string
             *       .features {array of string}, optional may be empty , undefined,single string or array of string
             *       .forms {map |DATA-FORM] map is [FORM_TYPE] ==> DATA-FORM}, optional may be empty/undefiend
             *   An error node (<element of type="error")
             *   This allows controller to populate as a pass through disco#info result or
             *   supply exact cap info when constructing our own</p>
             *
             * @param {String|String[]} identities list of identites to populate
             * @param {String|String[]} features list of features to populate
             * @param {XDataForm|XDataForm[]} forms list of xdata form strings to populate
             * @returns {Boolean} <tt>true</tt> if populated info matches our verification string
             * @throws {TypeError} If a  parameter is not valid (not an array of strings/xdataforms)
             */
            _populate: function(identities, features, forms) {
                //reset state
                this.identities = [];
                this.features = [];
                this.forms = {};
                this._rawforms = [];
                
                this.status = "invalid";
                this.id = this._node + '#' + this.ver;

                //preparsed lists provided
                if (identities) {
                    this.identities = this.identities.concat(identities);
                }
                if (features) {
                    this.features = this.features.concat(features);
                }
                if (forms) {
                    for (var i = 0; i < forms.length; ++i) {
                        //XEP 115 5.4.3.6, ignore forms with not hidden or missing FORM_TYPE fields
                        var ftvar = forms[i].getFieldByVar("FORM_TYPE");
                        if (ftvar && (ftvar.getType() == "hidden")) {
                            this._rawforms.push(forms[i]);
                        }
                    }
                }
                
                //may not validate if no initial verification string provided but lists should still be sorted
                this.identities.sort(); this.features.sort();
                
                return this.validate();
            },

            /**
             *@private
             *@param {String|JID} jid to add to this capsinfo
             *add a jid to item array.
             */
            addReference: function(jid) {
                if (this.indexOfReference(jid, true) == -1) {
                    this.items.push(jid.toString());
                }
            },
            
            /**
             *@private
             *@param {String|JID} jid to remove from this capsinfo
             */
            removeReference: function(jid) {
                var idx = this.indexOfReference(jid, true);
                if (idx != -1) {                
                    this.items.splice(idx, 1);
                }
            },

            /**
             *@private
             *true if given jid is in item array
             * if jid is bare any resource will count as a ref, exact match on full
             */
            hasReference: function(jid) {
                return this.indexOfReference(jid) != -1;
            },
            
            /**
             *@private
             *index of the given ref in the item array
             * if jid is bare first resource encountered is used, exact match on full
             * returns -1 if no match could be found
             *exact override bare/full behavior and forces an exact match
             */
            indexOfReference: function(jid, exact) {
                var tjid = jabberwerx.JID.asJID(jid); 
                exact = exact || (tjid.getResource() != '');
                if (!exact) {
                    tjid = tjid.getBareJID(); //save a few cycles I guess
                }
                for (var i = 0; i < this.items.length; ++i) {
                    var ijid = jabberwerx.JID.asJID(this.items[i]);
                    if ((exact && tjid.equals(ijid)) ||
                        (!exact && tjid.equals(ijid.getBareJID()))) {
                        return i;
                    }
                }
                return -1;
            },

            /**
             *@private
             * get a list of matching jids. If bare matches all resources, otherwise exact match only (one elelemnt array returned)
             */
            getReferences: function(jid) {
                var result = [];
                var tjid = jabberwerx.JID.asJID(jid);
                var exact = tjid.getResource() != '';
                for (var i = 0; i < this.items.length; ++i) {
                    var ijid = jabberwerx.JID.asJID(this.items[i]);
                    if (exact && ijid.equals(tjid)) {
                        return [ijid];
                    }
                    if (!exact && ijid.getBareJID().equals(tjid)) {
                        result.push(ijid);
                    }
                }
                return result;            
            },

            /**
             * @private
             * clear references
             */
            _clearReferences: function() {
                this.items = [];
            },
            
            /**
             * CapabilitiesController reference.
             * @private
             * todo - not sure this is needed
             */
            _capsController : {},

            /**
             *@private
             * uri of this client cap
             */
            _node: '',

            /**
             *@private
             * XDataform list before validation and copy to forms
             */
            _rawforms: [],
            
            /**
             *@private
             *  "locked" Verification string passed to constructor and used for
             *  validation.
             */
            ver: '',

            /**
             * status of this cc info, "pending" "valid" "invalid"
             * @type String
             */
            status: "invalid",

            /**
             * List of associated identity strings "catagory/type/lang/name"
             * @type Array
             */
            identities: [],

            /**
             * List of associated features
             * @type Array
             */
            features: [],

            /**
             * extra forms map of [FORM-TYPE] [data form]
             * @type FORM-TYPE
             */
            forms : {},

            /**
             * list of full jids that are currently tracked (sent presence) and support this client cap
             * @type {Array}
             */
            items: []
    }, "jabberwerx.CapabilitiesController.CapsInfo");

    /**
     * @private
     * Generate the verification string according to XEP-0115 Section 5. Uses the SHA-1 algorithm.
     * Uses the feature set, identity and attached forms to determine the verification string.
     * @param {String[]} identities  string array of catagory/type/lang/name, may be empty
     * @param {String[]} features string array of feature var values, may be empty
     * @param {XDataForm[]] optional array of XDataForms  may be empty
     * @param {boolean} [noEncode] optional flag to return raw verify string, used by unit-tests
     * @returns {String} the verification string
     */
    jabberwerx.CapabilitiesController._generateVerificationString = function(identities, features, forms, noEncode) {
        //helper func to walk fields and values, producing a xep115 compliant serialization
        //FORM_TYPE<field1<val1<...<valn<...<fieldn fields and values alpha sorted
        var __form115rep = function(form) {
            var result =  form.getFORM_TYPE() + "<";
            var ta = jabberwerx.$.map(form.fields,
                        function(field) {
                            var fstr = field.getVar();
                            if (fstr == "FORM_TYPE") {
                                return null;
                            }
                            fa = [].concat(field.getValues());
                            fa.sort();
                            return fstr + "<" + fa.join("<"); 
                        });            
            ta.sort();
            result += ta.join("<") + "<";
            return result;
        };

        var baseStr = ""
        if (identities && identities.length > 0) {
            identities.sort();
            baseStr += identities.join('<') + '<';
        }
        if (features && features.length > 0) {
            features.sort();
            baseStr += features.join('<') + '<';
        }
        //make an array of 115 ver comparitor strings for the forms, sort it and join
        if (forms && forms.length){
            var verArr = [];
            for (var i = 0; i < forms.length; ++i) {
                verArr.push(__form115rep(forms[i]));
            }
            verArr.sort();
            baseStr += verArr.join(''); //joining with an empty string, form reps already include final "< "
        }
        if (!noEncode) {
            return jabberwerx.util.crypto.b64_sha1(jabberwerx.util.crypto.utf8Encode(baseStr));
        }
        return baseStr;
    }
    
    jabberwerx.Client.intercept({
        //intercept client's init and add CapsController
        init: function() {
            this._super.apply(this, arguments); //pass all args onto base class        
            //capabilitiesController and add features and identity, if specified in jabberwerx._config
            var capController = new jabberwerx.CapabilitiesController(this);
            if (jabberwerx._config.capabilityFeatures) {
                for (var i=0; i<jabberwerx._config.capabilityFeatures.length; i++) {
                    capController.addFeature(jabberwerx._config.capabilityFeatures[i]);
                }
            }
            if (jabberwerx._config.capabilityIdentity) {
                capController.identity.category = jabberwerx._config.capabilityIdentity.category;
                capController.identity.type = jabberwerx._config.capabilityIdentity.type;
                capController.identity.name = jabberwerx._config.capabilityIdentity.name;
                capController.node = jabberwerx._config.capabilityIdentity.node;
            }
        },
        //override _connected to send out initial presence packet.
        //JJF I can't imagine this will stay here but wanted to move it out of client
        _connected: function() {
            this._super.apply(this, arguments);
            if (!this.getCurrentPresence()) {
                this.sendPresence();
            }
        }
    });
    
    

})();

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/ChatController.js*/
/**
 * filename:        ChatController.js
 * created at:      2009/01/01T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

;(function(){
    if (jabberwerx) {
        jabberwerx.ChatController = jabberwerx.Controller.extend(/** @lends jabberwerx.ChatController.prototype */{
            /**
             * @class
             * Controller class for chat functionality. Controls the creation and deletion of
             * ChatSession objects. Upon a message stanza been recieved, for which there is no
             * ChatSession object already created, a new ChatSession object is created and the
             * chatSessionOpened event fired. ChatSession's can be created directly using the
             * openChatSession method. The chatSessionClosed event is fired upon the closing of a
             * chat session.
             *
             * <p>
             * This class provides the following events:
             * <ul>
             * <li><a href="../jabberwerxEvents.html#jabberwerx.ChatController">jabberwerx.ChatController Events</a></li>
             * </ul>
             *
             * @extends jabberwerx.Controller
             *
             * @description
             * Creates a new ChatController with the given client.
             * 
             * @param {jabberwerx.Client} client The client object to use for
             *        communicating to the server
             * @throws {TypeError} If {client} is not an instance of
             *         jabberwerx.Client
             * @constructs jabberwerx.ChatController
             */
            init: function(client) {
                this._super(client, 'chat');
                
                var caps = client.controllers.capabilities ||
                           new jabberwerx.CapabilitiesController(client);
                caps.addFeature('http://jabber.org/protocol/chatstates');
                caps.addFeature('http://jabber.org/protocol/xhtml-im');
                
                // Setup events
                this.applyEvent('chatSessionOpened');
                this.applyEvent('chatSessionClosed');
                
                // Setup handler
                // Will filter on type != "groupchat" or "error" and "gone" chatstate not present
                this.client.event('afterMessageReceived').bindWhen('message[type!="groupchat"]'+
                    '[type!="error"] body'
                    , this.invocation('_messageHandler'));
            },
            
            /**
             * Creates a new ChatSession object, or returns an existing ChatSession object,
             * to be used to communicate with the jid specified.
             * @param {jabberwerx.JID|String} jid The jid of the user with whom the ChatSession
             *                                   should be set up with.
             * @param {String} [thread] The thread to use in the outgoing messages. A random 
             *                        thread value will be generated if one is not provided. Note:
             *                        the thread value can change during the duration of a chat
             *                        session.
             * @returns {jabberwerx.ChatSesison} A new ChatSession object if an object
             *                                  for this jid does not already exist,
             *                                  otherwise returns the existing ChatSession object
             *                                  for this jid.
             */
            openSession: function(jid, thread) {
                var chatSession = null;
                jid = jabberwerx.JID.asJID(jid);
                chatSession = this.getSession(jid);
                if (!chatSession) {
                    // Create a new session and trigger event
                    chatSession = new jabberwerx.ChatSession(this.client, jid, thread);
                    this._chatSessions.push(chatSession);
                    this.event('chatSessionOpened').trigger({chatSession: chatSession,
                                                              userCreated: true});
                }
                return chatSession;
            },
            
            /**
             * Removes the ChatSession object from the active list. Fire the chatSessionClosed
             * event.
             * @param {jabberwerx.JID|String|jabberwerx.ChatSession} session The session to close
             * @returns {Boolean} <tt>true</tt> if successfully removed session, false otherwise
             */
            closeSession: function(session) {
                var index = this._getChatSessionIndex(session);
                if (index >= 0) {
                    // Remove session from list and fire event.
                    var closedChatSession = this._chatSessions[index];
                    this._chatSessions.splice(index, 1);
                    this.event('chatSessionClosed').trigger(closedChatSession);
                    closedChatSession.destroy();
                    delete closedChatSession;
                    
                    return true;
                }
                return false;
            },
            
            /**
             * Get the ChatSession object for this jid if it exists.
             * @param {jabberwerx.JID|String} jid The resource component of the jid is ignored
             * @returns {jabberwerx.ChatSession} object or null if the ChatSession does not exist
             */
            getSession: function(jid) {
                var index = this._getChatSessionIndex(jid);
                return (index >= 0) ? this._chatSessions[index] : null;
            },
            
            /**
             * @private
             * Handles message stanza event firings where the type is neither groupchat or error.
             * This method should not be called by client code.
             * @param {jabberwerx.EventObject} eventObj
             */
            _messageHandler: function(eventObj) {
                var msg = eventObj.data;
                var from = msg.getFromJID();
                if (this._getChatSessionIndex(from) < 0) {
                    // Create a new session and trigger event
                    var chatSession = new jabberwerx.ChatSession(this.client, from,
                                                                 msg.getThread());
                    this._chatSessions.push(chatSession);
                    this.event('chatSessionOpened').trigger({chatSession: chatSession,
                                                              userCreated: false});
                    // Trigger chat received event on the newly created chat session
                    chatSession._chatReceivedHandler(eventObj);
                    return true;
                }
                return false;
            },
            
            /**
             * Gets the index in _chatSessions of the session param.
             * @private
             * @param (jabberwerx.JID|String|jabberwerx.ChatSession) session The session to find
             * @returns (Integer) The position in _chatSessions of the session param, or -1 if not
             * found.
             */
            _getChatSessionIndex: function(session) {
                var index = -1;
                var jid;
                if (session instanceof jabberwerx.ChatSession) {
                    jid = session.jid;
                } else{
                    try {
                        jid = jabberwerx.JID.asJID(session);
                    } catch(e) {
                        return index;
                    }
                }

                if (!jid) {
                    return index;
                }

                var privateMessage = this.isPrivateMessage(jid);
                var jidStr = (privateMessage) ?
                             jid.toString() :
                             jid.getBareJIDString();

                for (var i=0; i<this._chatSessions.length; i++) {
                    var chatJidStr = (privateMessage) ?
                                     this._chatSessions[i].jid.toString() :
                                     this._chatSessions[i].jid.getBareJIDString();
                    if (chatJidStr == jidStr) {
                        index = i;
                        break;
                    }
                }

                return index;
            },

            /**
             * <p>Checks to see if the bare version of the jid passed in
             * is a MUCRoom.</p>
             *
             * @param {jabberwerx.JID} jid The JID to check.
             * @returns {Boolean} <tt>true</tt> if the bare JID is a MUCRoom.
             * @throws {TypeError} if jid is not of type jabberwerx.JID
             */
            isPrivateMessage: function(jid) {
                if (!(jid instanceof jabberwerx.JID)) {
                    throw new TypeError("jid must be of type jabberwerx.JID");
                }

                var mucJid = jid.getBareJID();
                var entity = this.client.entitySet.entity(mucJid);
                return (entity && entity instanceof jabberwerx.MUCRoom);
            },
           
            /**
             * Used to determine if XEP-085 chat states will be sent upon chat state changes.
             * If <tt>true</tt>, then chat state changes are sent, if false, then they are not sent. Defaults
             * to <tt>true</tt>.
             * @type Boolean
             */
            sendChatStates: true,

            /**
             * A list of currently active sessions.
             * @private
             * @type jabberwerx.ChatSession[]
             */
            _chatSessions : []
        }, 'jabberwerx.ChatController');
    }
})();

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/MUCController.js*/
/**
 * filename:        MUCController.js
 * created at:      2009/06/04T10:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.MUCController = jabberwerx.Controller.extend(/** @lends jabberwerx.MUCController.prototype */ {
        /**
         * @class
         * Controller for working with Multi-User Chat (MUC).
         *
         * @description
         * <p>Creates a new instance of MUCController with the given client.
         * This method registers the newly created MUCController under the
         * client's controllers as "muc" (e.g. access via
         * client.controllers["muc"])</p>
         *
         * <p>
         * This class provides the following events:
         * <ul>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.MUCController">jabberwerx.MUCContoller Events</a></li>
         * </ul>
         *
         * @param {jabberwerx.Client} client The client object to use for communicating to the server
         * @throws {TypeError} If {client} is not an instance of jabberwerx.Client
         * @constructs jabberwerx.MUCController
         * @extends jabberwerx.Controller
         */
        init: function(client) {
            this._super(client, "muc");

            var caps = client.controllers.capabilities || jabberwerx.CapabilitiesController(client);
            caps.addFeature('http://jabber.org/protocol/muc');
            caps.addFeature('http://jabber.org/protocol/muc#user');
            caps.addFeature('jabber:x:conference');
            caps.addFeature('http://jabber.org/protocol/xhtml-im');

            // Apply mucInviteReceived event
            this.applyEvent('mucInviteReceived');

            // Bind for direct invite messages (XEP-0249)
            this.client.event("messageReceived").
                    bindWhen("message:not([type]) x[xmlns='jabber:x:conference']",
                             this.invocation("_handleDirectInvite"));
            // Bind for mediated invite messages (XEP-045 ~ Section 7.5.2)
            this.client.event("messageReceived").
                    bindWhen("message[type=normal] x[xmlns='http://jabber.org/protocol/muc#user']>invite, message:not([type]) x[xmlns='http://jabber.org/protocol/muc#user']>invite",
                             this.invocation("_handleMediatedInvite"));
        },

        /**
         * <p>Destroys this instance of MUCController.</p>
         */
        destroy: function() {
            this._super();
        },

        /**
         * <p>Updates the given entity. This method is not called directly;
         * instead call {@link jabberwerx.Entity#update}.</p>
         *
         * <p>This implementation simply triggers an "entityUpdated" event
         * with the given entity.</p>
         *
         * @param {jabberwerx.MUCRoom} entity The entity to update
         * @throws {TypeError} if {entity} is not an instance of jabberwerx.MUCRoom
         */
        updateEntity: function(entity) {
            if (!(entity && entity instanceof jabberwerx.MUCRoom)) {
                throw new TypeError("entity must be a MUCRoom");
            }

            this.client.entitySet.event("entityUpdated").trigger(entity);
        },
        /**
         * <p>Removes the given entity. This method is not called directly;
         * instead call {@link jabberwerx.Entity#remove}.</p>
         *
         * <p>This implementation uses the following algorithm:</p>
         * <ol>
         * <li>If the room is currently active and the client is currently
         * connected, exit the room (via {@link jabberwerx.MUCRoom#exit}.</li>
         * <li>Once the room is not active and/or the client is not connected,
         * it is destroyed (via {@link jabberwerx.Entity#destroy}); this will
         * ultimately trigger an "entityDestroyed" event for {entity}.</li>
         * </ol>
         *
         * @param {jabberwerx.MUCRoom} entity The entity to remove
         * @throws {TypeError} if {entity} is not an instance of jabberwerx.MUCRoom
         */
        removeEntity: function(entity) {
            if (!(entity && entity instanceof jabberwerx.MUCRoom)) {
                throw new TypeError("entity must be a MUCRoom");
            }

            if (entity.isActive() && this.client.isConnected()) {
                entity.event("roomExited").bind(function(evt) {
                    entity.event("roomExited").unbind(arguments.callee);
                    entity.destroy();
                });
                entity.exit();
            } else {
                entity.destroy();
            }
        },

        /**
         * <p>Retreives or creates a MUCRoom for the given JID. This method
         * implements the following algorithm:</p>
         * <ol>
         * <li>If a MUCRoom already exists in the owning client for {jid}, that
         * instance is returned.</li>
         * <li>A new MUCRoom is created for {jid}.</li>
         * <li>If there is an entity for {jid} but it is not a MUCRoom,
         * the data from the original entity is applied to the new MUCRoom
         * (via {@link jabberwerx.Entity#apply}), and the original entity is
         * removed from the owning client.</li>
         * <li>The new MUCRoom is registered with the owning client (triggering
         * an "entityCreated" event) and returned.</li>
         * </ol>
         *
         * @param {jabberwerx.JID|String} jid The room JID
         * @returns {jabberwerx.MUCRoom} The room for {jid}
         * @throws {jabberwerx.JID.InvalidJIDError} if {jid}
         *         is not an instanceof jabberwerx.JID, and cannot be
         *         converted to one.
         */
        room: function(jid) {
            jid = jabberwerx.JID.asJID(jid).getBareJID();

            var room = this.client.entitySet.entity(jid);
            if (!(room && room instanceof jabberwerx.MUCRoom)) {
                var ent = room;
                room = new jabberwerx.MUCRoom(jid, this);
                if (ent) {
                    room.apply(ent);
                    ent.remove();
                }
                this.client.entitySet.register(room);
            }

            return room;
        },
        /**
         * <p>Cleanup given room on behalf of the client entity cache
         * {@link jabberwerx.EntitySet}.</p>
         *
         * @param {jabberwerx.MUCRoom} entity The entity to destroy
         */
        cleanupEntity: function(entity) {
            if (entity instanceof jabberwerx.MUCRoom) {
                entity.remove();
            }
        },

        /**
         * @private
         *
         * Handles directed invite messages (XEP-0249). Extracts the invitor, room and reason
         * attributes from the message. Then passes these attributes on to the _handleInvite method.
         *
         * @param   {jabberwerx.EventObject} evtObj The event object containing the
         *          jabberwerx.Message object and the selected x element.
         */
        _handleDirectInvite: function(evtObj) {
            var msg = evtObj.data;
            // If the message also contains a mediated invite then ignore and let the mediated
            // invite handler handle it
            if (jabberwerx.$("message:not([type]) x[xmlns='http://jabber.org/protocol/muc#user']>invite",
                msg.getDoc()).length == 0) {
                var invitor = msg.getFromJID();
                var x = jabberwerx.$(evtObj.selected);
                var room = x.attr("jid");
                var reason = x.attr("reason");
                this._handleInvite(msg, room, invitor, reason);
                return true;
            }
            return false;
        },

        /**
         * @private
         *
         * Handles mediated invite messages (XEP-0045). Extracts the invitor, room, reason and
         * password attributes from the message. Then passes these attributes on to the
         * _handleInvite method.
         *
         * @param   {jabberwerx.EventObject} evtObj The event object containing the
         *          jabberwerx.Message object and the selected invite element.
         */
        _handleMediatedInvite: function(evtObj) {
            var msg = evtObj.data;
            var invite = evtObj.selected;
            var invitor = jabberwerx.$(invite).attr("from");
            var room = msg.getFromJID();
            var reason = jabberwerx.$("reason", invite).text() || null;
            var password = jabberwerx.$("password", evtObj.data.getDoc()).text() || null;
            this._handleInvite(msg, room, invitor, reason, password);
            return true;
        },

        /**
         * @private
         *
         * This method is invoked from one of the invite parsing methods. If the room parameter is
         * present, we convert the room and invitor parameteres to JID object and, provided a
         * MUCRoom for this jid is not already active, invoke the mucInivteReceived event.
         *
         * @param   {jabberwerx.Stanza} stanza The stanza containing the invite
         * @param   {jabberwerx.JID | String} room The room for which this client has received an
         *          invite to.
         * @param   {jabberwerx.JID | String} [invitor] The user that sent the invite
         * @param   {String} [reason] The reason attribute for this invite
         * @param   {String} [password] The password attribute for this invite
         */
        _handleInvite: function(stanza, room, invitor, reason, password) {
            var mucInvite = new jabberwerx.MUCInvite(stanza, room, invitor, reason, password);
            var ent = this.client.entitySet.entity(mucInvite.getRoom());
            if (!(ent && ent instanceof jabberwerx.MUCRoom && ent.isActive())) {
                this.event('mucInviteReceived').trigger(mucInvite);
            }
        },

        /**
         * @private
         */
        _sendSearchIq: function(muc, callback, form) {
            var queryString = "{jabber:iq:search}query";
            var query = new jabberwerx.NodeBuilder(queryString);

            var type = "get";
            if (form) {
                if(this.escapeSearch) {
                    try {
                        /**
                         * trim any preceeding/trailing whitespace so that escapeNode
                         * doesn't throw an "unnecessary" exception in this case.
                         */
                        var roomName = jabberwerx.$.trim(form.getFieldValue("room-name"));
                        form.setFieldValue("room-name", jabberwerx.JID.escapeNode(roomName));
                    } catch(e) {
                        callback(null, e);
                        return;
                    }
                }

                query.node(form.getDOM().data);
                type = "set";
            }

            this.client.sendIQ(type, muc, query.data,
                function (stanza) {
                    var iq = new jabberwerx.IQ(stanza);
                    if (iq.isError()) {
                        callback(null, iq.getErrorInfo());
                    } else {
                        var form = jabberwerx.$("x", iq.getNode()).get(0);
                        if (!form) {
                            callback(null, jabberwerx.Stanza.ERR_SERVICE_UNAVAILABLE);
                        } else {
                            callback(new jabberwerx.XDataForm(null, form));
                        }
                    }
                }
            );
        },

        /**
         * <p>Starts the process of searching for a room. This method will
         * return the search criteria from the MUC server through the
         * callback.</p>
         *
         * @param {jabberwerx.JID | String} muc The MUC server.
         * @param {Function} callback Callback fired when a response is received
         * or an error is encountered.
         *
         * <p>The callback has the following signature.
         * <pre class="code">
         * function callback(form, err) {
         *     form;    // The returned {@link jabberwerx.XDataForm}.
         *              // null if the method failed.
         *     err;     // Error explaining the failure,
         *              // undefined if the method succeeded.
         * }
         * </pre>
         * </p>
         *
         * @throws {jabberwerx.JID.InvalidJIDError} if {muc} is not an instance of
         *         jabberwerx.JID, and cannot be converted to one
         * @throws {TypeError} If callback is undefined or not a function.
         */
        startSearch: function(muc, callback) {
            muc = jabberwerx.JID.asJID(muc).getDomain();
            if (!jabberwerx.$.isFunction(callback)) {
                throw new TypeError("The variable 'callback' must be a function.");
            }

            this._sendSearchIq(muc, callback);
        },

        /**
         * <p>Submits the filled-out search criteria to the MUC server.
         * Returns the results through the callback.</p>
         *
         * @param {jabberwerx.JID | String} muc The MUC server.
         * @param {jabberwerx.XDataForm} form the filled-out search criteria.
         * @param {Function} callback Callback fired when a response is received
         * or an error is encountered.
         *
         * <p>The callback has the following signature.
         * <pre class="code">
         * function callback(form, err) {
         *     form;    // The returned {@link jabberwerx.XDataForm}.
         *              // null if the method failed.
         *     err;     // Error explaining the failure,
         *              // undefined if the method succeeded.
         * }
         * </pre>
         * </p>
         *
         * @throws {jabberwerx.JID.InvalidJIDError} if {muc} is not an instance of
         *         jabberwerx.JID, and cannot be converted to one
         * @throws {TypeError} If callback is undefined or not a function.
         * @throws {TypeError} If form is not a jabberwerx.XDataForm.
         */
        submitSearch: function(muc, form, callback) {
            muc = jabberwerx.JID.asJID(muc).getDomain();
            if (!jabberwerx.$.isFunction(callback)) {
                throw new TypeError("The variable 'callback' must be a function.");
            }
            if (!(form && form instanceof jabberwerx.XDataForm)) {
                throw new TypeError("form must be an XDataForm");
            }

            this._sendSearchIq(muc, callback, form);
        },

        /**
         * <p>Indicates if a muc room search value should be escaped before
         * passing it to the server as part of a muc room iq:search query.</p>
         * <p>The default value is {true}, which is to escape muc room search values</p>
         * @type Boolean
         */
        escapeSearch: true
    }, "jabberwerx.MUCController");
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/PrivacyListController.js*/
/**
 * filename:        PrivacyListController.js
 * created at:      2009/05/15T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */


if (jabberwerx) {    
    jabberwerx.PrivacyListController = jabberwerx.Controller.extend(/** @lends jabberwerx.PrivacyListController.prototype */{
        /**
         * @class
         * <p>Controller class for privacy lists functionality.</p>
         * 
         * <p>
         * This class provides the following events:
         * <ul>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.PrivacyListController">jabberwerx.PrivacyListController Events</a></li>
         * </ul>
         * </p>
         * @description
         * <p>Creates a new PrivacyListController with the given client.</p>
         * 
         * @param       {jabberwerx.Client} client The client object to use for communicating to the server
         * @throws      {TypeError} If {client} is not an instance of jabberwerx.Client
         * @constructs  jabberwerx.PrivacyListController
         * @extends     jabberwerx.Controller
         */        
        init: function(client) {
            this._super(client, "privacyList");

            // setup events
            this.applyEvent("errorEncountered");
            this.applyEvent("privacyListApplied");
            this.applyEvent("privacyListUpdated");
            this.applyEvent("privacyListRemoved");
           
            // setup handlers
            this.client.event('afterIqReceived').bindWhen("[type=set] query[xmlns=jabber:iq:privacy] list", this.invocation('_handlePrivacyListUpdate'));
 
        },
        
        /**
         * <p>Destroys privacy list controller and removes any event callbacks it registered.</p>
         */        
        destroy: function() {
            // teardown handlers
            this.client.event('afterIqReceived').unbind(this.invocation('_handlePrivacyListUpdate'));
            this._super();
        },
        
        /**
         * <p>Fetch a privacy list by name, creates {@link jabberwerx.PrivacyList} object and adds it to the map.</p>
         *
         * @param {String} list Name of the privacy list.
         * @param {function} [callback] The function called after the server response is processed. If a server error
         * occurs, the function will be passed the error stanza response.
         * <p>The signature of the function is <code>callback(errorStanza)</code>.</p>
         * e.g. <code>callback.call(this, errorStanza)</code>. Therefore in the callback method <code>this</code> will
         * refer to the instance of PrivacyListController and so <code>this.client</code> will retrieve the {@link jabberwerx.Client} object</p>
         * @throws {TypeError} If {list} is not a &lt;string/&gt;&lt;PrivacyList/&gt;          
         * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
         */
         fetch: function(list, callback) {
            if (!this.client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (callback !== undefined && !jabberwerx.$.isFunction(callback)) {
                throw new TypeError('The callback param must be a function');
            }
            
            if (!list || typeof list != 'string') {
                throw new TypeError('Privacy list name should be non empty string.'); 
            }  
            this._doFetch(list, true, callback);      
         },
         
        /**
         * 
         * Performs actual fetch, provides code reuse for refreshing after list update/remove.
         * @private
         */         
        _doFetch: function(list, create, callback) {   
            //The variable 'that' will be visible to the senqIq callback
            var that = this;
            var errorOccured = false;
            var removed = false;                               
            //Send privacy list fetch query
            this.client.sendIq('get', null, "<query xmlns='jabber:iq:privacy'><list name='" + list + "'/></query>", 
                function (stanza) {     
                    var error = that._checkError(stanza);
                    var prvListNode = jabberwerx.$(stanza).find("list").get(0);
                    var list_name = prvListNode.getAttribute("name");
                    var privListObj = that._privacyLists[list_name];
                    if (error) {
                        //If item-not-found error, we just create a list
                        var item_not_found = jabberwerx.$(error).find("item-not-found").get(0);
                        if (item_not_found) {
                            if (!create) {
                                if (that._privacyLists[list_name]) {
                                    // fire remove event
                                    that.event("privacyListRemoved").trigger(that._privacyLists[list_name]);
                                    that._privacyLists[list_name].destroy();
                                    removed = true;        
                                }                                
                            } else {
                                error = null;
                            }
                         } 
                         else {
                             errorOccured = true;
                         }    
                    }
                    if (errorOccured) {
                       that.event("errorEncountered").trigger({
                            operation: "fetch",
                            error: error,
                            target: that._privacyLists[list_name]
                        });                    
                    } else {
                          if (!removed) {
                              if (that._privacyLists[list_name]) {
                                  that._privacyLists[list_name]._update(prvListNode);
                              } else {                                
                                  //Add privacy list to the map
                                  privListObj = that._privacyLists[list_name] = new jabberwerx.PrivacyList(prvListNode, that);                                                        
                              }
                              // fire update event
                              that.event("privacyListUpdated").trigger(that._privacyLists[list_name]);                               
                          }                   
                    }
                    if (callback) {
                       callback.call(that, privListObj, error);
                    }
                }  
            );
            
        },

        /**
         * Removes privacy list from the map.
         * 
         * @private
         */   
         _remove: function(list) {
              if (this._privacyLists[list]) {
                  delete this._privacyLists[list];    
              }
             
         },        
        
        
        /**
         * Check a response element to see if it contains an error.
         * 
         * @private
         * @param {Element} parentElement The element to check to see if it contains a child &lt;error&gt; 
         * @returns {Element|undefined} The error element if it exists or else undefined 
         */
        _checkError: function(parentElement) {
            return jabberwerx.$(parentElement).children("error")[0];
        },

        /**
         * <p>Sets the active privacy list (or null/undefined to clear active).</p>
         * @param {String} list Name of the privacy list.
         * @param {function} [callback] The function called after the server response is processed. If a server error
         * occurs, the function will be passed the error stanza response.
         * <p>The signature of the function is <code>callback(errorStanza)</code>.</p>
         * <p>The callback will be invoked in the context of the PrivacyListController
         * e.g. <code>callback.call(this, errorStanza)</code>. Therefore in the callback method <code>this</code> will
         * refer to the instance of PrivacyListController and so <code>this.client</code> will retrieve the {@link jabberwerx.Client} object.</p>
         * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
         * @throws {TypeError} If {list} is not a &lt;string/&gt;&lt;PrivacyList/&gt;
         */
        
        apply: function(list, callback) {
            if (!this.client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }

            if (callback !== undefined && !jabberwerx.$.isFunction(callback)) {
                throw new TypeError('The callback param must be a function');
            }
            var list_name;
            if (list) {
                if (typeof list == 'string') {
                    list_name = list;
                }  else if (list instanceof jabberwerx.PrivacyList) {
                       list_name = list.getName();
                } else {
                    throw new TypeError('Privacy list name should be string or PrivacyList or empty.');
                }          
            }            
  
            
            var queryNode = new jabberwerx.NodeBuilder("{jabber:iq:privacy}query").
                                attribute("type", "set");
                               
            var activeNode = queryNode.element("active");
                                
            if (list) {
                activeNode.attribute("name", list_name);
            } 
                           
            //The variable 'that' will be visible to the senqIq callback
            var that = this;
                                             
            //Send privacy list fetch query
            this.client.sendIq('set', null, queryNode.data, 
                function (stanza) {     
                    var error = that._checkError(stanza);
                    if (error) {                  
                        that.event("errorEncountered").trigger({
                            operation: "apply",
                            error: error
                        });
                    } else {           
                          // fire fetch event
                          that.event("privacyListApplied").trigger({
                              list: list_name
                          });
                    }
                    if (callback) {
                        callback.call(that, error);                    
                    }
                }  
            );
            
       },
       
        /**
         * Watches for privacy list push from the server, 
         * each connected resource must return iq result.
         * @private
         */
        _handlePrivacyListUpdate: function(evt) {
            var list_name = jabberwerx.$(evt.selected).attr("name")
            // respond and note that we handled it
            var iq = new jabberwerx.IQ();
            iq.setTo(evt.data.getFrom());
            iq.setFrom();
            iq.setType("result");
            iq.setID(evt.data.getID());
            this.client.sendStanza(iq);
            
            this._doFetch(list_name);
            
            return true;             
          },
        /**
         * Holds a map of privacy lists objects and their names
         * @private
         */
        _privacyLists : {}
        
 
    }, 'jabberwerx.PrivacyListController');
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/PrivateStorageController.js*/
/**
 * filename:        PrivateStorageController.js
 * created at:      2009/11/04T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */


if (jabberwerx) {    
    jabberwerx.PrivateStorageController = jabberwerx.Controller.extend(/** @lends jabberwerx.PrivateStorageController.prototype */{
        /**
         * @class
         * <p>Controller class for dealing with private storage functionality.</p>
         * 
         * @description
         * <p>Creates a new PrivateStorageController with the given client.</p>
         * 
         * @param       {jabberwerx.Client} client The client object to use for communicating to the server
         * @throws      {TypeError} If {client} is not an instance of jabberwerx.Client
         * @constructs  jabberwerx.PrivateStorageController
         * @extends     jabberwerx.Controller
         */        
        init: function(client) {
            this._super(client, "privateStorage");
           
        },
        
        /**
         * <p>Destroys private storage controller.</p>
         */        
        destroy: function() {
            this._super();
        },
        
        /**
         * <p>Fetches a private storage data and invokes the callback function passing it received xml element or error encountered.</p>
         *
         * @param {String} ename Ename string for the privacy storage element.
         * @param {function} callback The function called after the server response is processed. If a server error
         * occurs, the function will be passed the error stanza response.
         * <p>The signature of the function is <code>callback(private_data, errorStanza)</code>.</p>
         * <p>The callback will be invoked in the context of the PrivateStorageController
         * e.g. <code>callback.call(this, private_data, errorStanza)</code>. Therefore in the callback method <code>this</code> will 
         * refer to the instance of PrivateStorageController and so <code>this.client</code> will retrieve the {@link jabberwerx.Client} object.</p>
         * @throws {TypeError} If {ename} is not a properly formatted ename element.          
         * @throws {jabberwerx.Client.NotConnectedError} If the {@link jabberwerx.Client} is not connected
         */
         fetch: function(ename, callback) {
            if (!this.client.isConnected()) {
                throw new jabberwerx.Client.NotConnectedError();
            }
            if (!jabberwerx.$.isFunction(callback)) {
                throw new TypeError('The callback param must be a function');
            }  
            
            if (!ename) {
                throw new TypeError('Private storage element name should not be empty.');
            }
                      
            var query = new jabberwerx.NodeBuilder("{jabber:iq:private}query");
            var prv_elem = query.element(ename);
  
            var that = this;
               
            this.client.sendIq("get", null, query.data,
                function (stanza) {
                    var error = that._checkError(stanza);
                    var private_data = jabberwerx.$(stanza).find(prv_elem.data.tagName + "[xmlns=" + prv_elem.data.getAttribute("xmlns") + "]").get(0);    
                    if (callback) {
                        callback.call(that, private_data, error);                    
                    }                                                         
  
                }            
            );   
            
         },

       /**
         * <p>Updates the server with new private storage data.</p>
         *
         * @param   {Element} private_elm Document element.
         * @throws  {TypeError} If {private_elm} is undefined or not a document element.
         */         
         update: function(private_elm) {
             if (!jabberwerx.isElement(private_elm)) {
                  throw new TypeError('Private storage should be an element.');
             }
             var query = new jabberwerx.NodeBuilder("{jabber:iq:private}query").
                         node(private_elm).parent; 
             this.client.sendIq("set", null, query.data);            
         },
         
       /**
         * <p>Clears private storage data.</p>
         *
         * @param {String} ename Ename string for the privacy storage element.
         * @throws {TypeError} If {ename} is not a properly formatted ename element.
         */         
         remove: function(ename) {
            if (!ename) {
                throw new TypeError('Private storage element name should not be empty.');
            }
                
            var query = new jabberwerx.NodeBuilder("{jabber:iq:private}query").
                            element(ename).parent; 
            this.client.sendIq("set", null, query.data);            
         },                 
           
        /**
         * Check a response element to see if it contains an error.
         * 
         * @private
         * @param {Element} parentElement The element to check to see if it contains a child &lt;error&gt; 
         * @returns {Element|undefined} The error element if it exists or else undefined 
         */
        _checkError: function(parentElement) {
            return jabberwerx.$(parentElement).children("error")[0];
        }

 
    }, 'jabberwerx.PrivateStorageController');
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/DiscoController.js*/
/**
 * filename:        DiscoController.js
 * created at:      2009/05/15T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */


if (jabberwerx) {
    jabberwerx.DiscoController = jabberwerx.Controller.extend(/** @lends jabberwerx.DiscoController.prototype */{
        /**
         * @class
         * <p>Controller class for collecting disco info on the nodes.</p>
         *
         * <p>
         * This class provides the following events:
         * <ul>
         * <li><a href="../jabberwerxEvents.html#jabberwerx.DiscoController">jabberwerx.DiscoController Events</a></li>
         * </ul>
         * </p>
         * @description
         * <p>Creates a new DiscoController with the given client.</p>
         *
         * @param       {jabberwerx.Client} client The client object to use for communicating to the server
         * @throws      {TypeError} If {client} is not an instance of jabberwerx.Client
         * @constructs  jabberwerx.DiscoController
         * @extends     jabberwerx.Controller
         */
        init: function(client) {
            this._super(client, "disco");

            // setup events
            this.applyEvent("discoInitialized");

            // setup handlers
            this.client.event("clientStatusChanged").bind(this.invocation("_handleStatusChange"));
        },

        /**
         * <p>Destroys disco controller and removes any event callbacks it registered.</p>
         */
        destroy: function() {
            // teardown handlers
            this.client.event('clientStatusChanged').unbind(this.invocation('_handleStatusChange'));
            this._super();
        },

        /**
         * Watches for client status events. Kicks off disco walk on connect,
         * cleans up created entities on disconnect.
         * @private
         * @param {jabberwerx.EventObject} evt The event object.
         */
        _handleStatusChange: function(evt) {
            switch (evt.data.next) {
                case jabberwerx.Client.status_connected:
                    break;
                case jabberwerx.Client.status_disconnected:
                    this._pendingJids = [];
                    this._initialized = false;
                    break;
            }
        },
        
        startRendezvous: function(ctx) {
            this._super(ctx);
            this._walkDisco();
            return true;
        },
        finishRendezvous: function() {
            this._initialized = true;
            this.event("discoInitialized").trigger();             
            return this._super();
        },
        /**
         * Sets up iqs for the server disco#info and disco#items.
         * @private
         */
        _walkDisco: function() {
            //Send disco info iq for the server
            var info = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/disco#info}query");
            this.client.sendIq("get", this.client.connectedServer.jid, info.data, this.invocation('_handleDiscoInfo'));
            //Send disco items iq for the server
            var items = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/disco#items}query");
            this.client.sendIq("get", this.client.connectedServer.jid, items.data, this.invocation('_handleDiscoItems'));
         },

        /**
         * Get's invoked when disco#info iq received.
         * @private
         */
        _handleDiscoInfo: function (stanza) {
            var jid = stanza.getAttribute("from");
            if (stanza.getAttribute("type") != "error") {
                //Check if entity is in the entity cache                      
                var server = this.client.entitySet.entity(jid);
                if (!server) {
                    server = new jabberwerx.Server(jid, this);  
                    this.client.entitySet.register(server);
                }           

                //Add identities from disco#info stanza
                var identities = jabberwerx.$(stanza).find("identity");

                server.identities = [];
                jabberwerx.$.each(identities, function() {
                      server.identities.push(this.getAttribute("category") + "/" + this.getAttribute("type"));
                });

                //Add features from disco#info stanza
                var features = jabberwerx.$(stanza).find("feature");
                server.features = [];
                jabberwerx.$.each(features, function() {
                      server.features.push(this.getAttribute("var"));
                });
                //We only update display name if we are the owner
                if (server.controller === this && identities.get(0).getAttribute("name")) {
                    //Display name will fire an update event
                    server.setDisplayName(identities.get(0).getAttribute("name"));
                }  else {            
                    //Fire an update event even if disco controller does not own this entity
                    server.update();
                }
            }

            if (jid != this.client.connectedServer.jid) {
                //Remove jid from the list if found
                var idx = -1;
                for (var i = 0; i < this._pendingJids.length; i++) {
                    if (this._pendingJids[i] == jid) {
                        idx = i;
                        break;
                    }
                }
                if (idx >=0) {
                    this._pendingJids.splice(idx, 1);
                }
                //Check to see if we are the last disco#info expected
                //to trigger "initilized" event.
                if (this._pendingJids.length == 0) {
                    this.finishRendezvous();
                }                 
            }            

        },

        /**
         * Get's invoked when disco#items iq received.
         * @private
         */
        _handleDiscoItems: function (stanza) {
            //Add identities from disco#items stanza
            var items = jabberwerx.$(stanza).find("item");
            if (items.length == 0 || jabberwerx.$(stanza).children("error")[0]) {
                this._initialized = true;
                this.event("discoInitialized").trigger();
                return;
            }

            var info = new jabberwerx.NodeBuilder("{http://jabber.org/protocol/disco#info}query");
            var that = this;

            jabberwerx.$.each(items, function() {
                  var item = that.client.entitySet.entity(this.getAttribute("jid"));
                  if (!item) {
                      item = new jabberwerx.Server(this.getAttribute("jid"), that);
                      that.client.entitySet.register(item);
                  }

                  that._pendingJids.push(this.getAttribute("jid"));
                  that.client.sendIq("get", this.getAttribute("jid"), info.data, that.invocation('_handleDiscoInfo'), that.timeout);   
            });
        },

        /**
         * <p>Cleanup given entity on behalf of the client entity cache
         * {@link jabberwerx.EntitySet}.</p>
         *
         * @param {jabberwerx.Server} entity The entity to destroy
         */
        cleanupEntity: function(entity) {
            entity.remove();
        },

        /**
         * <p>Finds all entities with given identity.</p>
         * @param {String} identity Identity for which to find entities.
         * @throws {TypeError} If DiscoController has not finished initializing.
         * @returns {jabberwerx.Entity[]} which contain the given identity.
         */
        findByIdentity: function(identity) {
            if (!this._initialized) {
                throw new TypeError("Disco controller has not been initialized.");
            }
            var entities = [];

            this.client.entitySet.each(function(entity) {
                if (entity.hasIdentity(identity)) {
                    entities.push(entity);
                }
            });
            return entities;
        },

        /**
         * <p>Sends out a disco#info request to the given jid/node combination
         * and returns the results to the provided callback.</p>
         *
         * @param {jabberwerx.JID|String} jid The target JID for the disco#info
         * request.
         * @param {String} [node] The optional node associated with the JID.
         * @param {Function} cb The callback executed when the disco#info
         * request returns or times out.
         * @throws {TypeError} if cb is not a function
         * @throws {TypeError} if node is not a String
         */
        fetchInfo: function(jid, node, cb) {
            jid = jabberwerx.JID.asJID(jid);

            if (!jabberwerx.$.isFunction(cb)) {
                throw new TypeError("cb must be a function.");
            }

            var info = new jabberwerx.NodeBuilder(this._DISCO_INFO);
            if (node) {
                if (typeof(node) == "string") {
                    info.attribute("node", node);
                } else {
                    throw new TypeError("If node is defined, it must be a string.");
                }
            }

            var callbacks = this._fetchInfoMap[this._jwesAsKey(jid, node)];
            if (!callbacks) {
                this._fetchInfoMap[this._jwesAsKey(jid, node)] = [cb];
            } else {
                callbacks.push(cb);
                return;
            }

            var that = this;
            this.client.sendIq("get", jid, info.data,
                function(stanza) {
                    var identities = [];
                    var features = [];
                    var extras = [];
                    var err = null;

                    if (stanza) {
                        var iq = new jabberwerx.IQ(stanza);

                        if (iq.isError()) {
                            err = iq.getErrorInfo();
                        } else {
                            var contents = jabberwerx.$(iq.getQuery()).contents();
                            for (index = 0; index < contents.length; index++) {
                                var content = contents[index];
                                switch (content.nodeName) {
                                    case ("identity"):
                                        content = jabberwerx.$(content);
                                        var identity = content.attr("category") + "/";
                                        identity = identity + (content.attr("type") ? content.attr("type") : "") + "/";
                                        identity = identity + (content.attr("xml:lang") ? content.attr("xml:lang") : "") + "/";
                                        identity = identity + (content.attr("name") ? content.attr("name") : "");
                                        identities.push(identity);
                                        break;
                                    case ("feature"):
                                        features.push(jabberwerx.$(content).attr("var"));
                                        break;
                                    case ("x"):
                                        if (content.getAttribute("xmlns") == "jabber:x:data") {
                                            extras.push(new jabberwerx.XDataForm(null, content));
                                        }
                                        break;
                                }
                            }
                        }
                    }

                    var callbacks = that._fetchInfoMap[that._jwesAsKey(jid, node)];
                    for (i = 0; i < callbacks.length; i++) {
                        callbacks[i](identities, features, extras, err);
                    }
                    delete that._fetchInfoMap[that._jwesAsKey(jid, node)];
                }, this.timeout);
        },

        /**
         * @private
         */
        _jwesAsKey: function(jid, node) {
            return "[" + (jid || "") + "]:[" + (node || "") + "]";
        },

        /**
         * @private
         */
        _fetchInfoMap: {},

        /**
         * @private
         */
        _DISCO_INFO: "{http://jabber.org/protocol/disco#info}query",

        /**
         * Number of seconds before iq requests time out.
         * @type Number
         */
        timeout: 30,

        /**
         * <p>Finds all entities with given feature.</p>
         * @param {String} feature Feature for which to find entities.
         * @throws {TypeError} If DiscoController has not finished initializing.
         * @returns {jabberwerx.Entity[]} which contain the given feature.
         */
        findByFeature: function(feature) {
            if (!this._initialized) {
                throw new TypeError("Disco controller has not been initialized.");
            }
            var entities = [];

            this.client.entitySet.each(function(entity) {
                if (entity.hasFeature(feature)) {
                    entities.push(entity);
                }
            });
            return entities;
        },

         /**
         * Flag indicating if disco walk has finished
         * @private
         */
        _initialized: false,

         /**
         * Array containing jids of all pending disco#info items.
         * @private
         */
        _pendingJids: []

    }, 'jabberwerx.DiscoController');

    jabberwerx.DiscoController.mixin(jabberwerx.Rendezvousable);
    
    //intercept client's init and add disco controller
    jabberwerx.Client.intercept({
        init: function() {
            this._super.apply(this, arguments); //pass all args onto base class
            //client owns disco controller
            var discoController = new jabberwerx.DiscoController(this);
        }
    });
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/PubSubController.js*/
/**
 * filename:        PubSubController.js
 * created at:      2009/11/09T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */
if (jabberwerx) {
    jabberwerx.PubSubController = jabberwerx.Controller.extend(/** @lends jabberwerx.PubSubController.prototype */{
        /**
         * @class
         * <p>Controller that provides support for XEP-0060 Publish-Subscribe</p>
         *
         * @description
         * <p>Creates a new PubSubController for the given client.</p>
         *
         * <p><b>NOTE:</b> Only subclasses should specify a value for {name}.
         * Otherwise, only {client} should be passed into this constructor.</p>
         *
         * @param   {jabberwerx.Client} client The client object to use for communicating to the server
         * @param   {String} [name] The name of this controller (default is "pubsub")
         * @throws  {TypeError} If {client} is not a jabberwerx.Client
         * @constructs  jabberwerx.PubSubController
         * @extends     jabberwerx.Controller
         */
        init: function(client, name) {
            this._super(client, name || "pubsub");

            this._cleanupMode = jabberwerx.PubSubController.CLEANUP_ALL;
        },
        /**
         * <p>Destroys this PubSubController and removes any event callbacks it registered.</p>
         */
        destroy: function() {
            // make sure all nodes are removed
            var that = this;
            this.client.entitySet.each(function(node) {
                if (node.controller === that) {
                    node.remove();
                }
            });
            this._super();
        },

        /**
         * <p>Return the specified PubSubNode. Creates the node
         * if one doesn't already exist.</p>
         *
         * @param {String} node the node
         * @param {jabberwerx.JID|String} jid The JID.
         * @returns {jabberwerx.PubSubNode} The requested PubSubNode.
         * @throws {TypeError} if {node} is not a string.
         * @throws {jabberwerx.JID.InvalidJIDError} if {jid} is an invalid JID.
         */
        node: function(node, jid) {
            if (!(node && typeof(node) == "string")) {
                throw new TypeError("node must be a non-empty string");
            }
            jid = this._prepareJid(jid);

            var pstype = this._getNodeClass();
            var pubsub = this.client.entitySet.entity(jid, node);
            if (!(pubsub && pubsub instanceof pstype)) {
                var tmp = pubsub;
                pubsub = new pstype(jid, node, this);
                if (tmp) {
                    pubsub.apply(tmp);
                    tmp.remove();
                }
                this.client.entitySet.register(pubsub);
            }

            return pubsub;
        },
        /**
         * @private
         * Prepares the JID by ensuring {jid} is a {@link jabberwerx.JID}
         * and getting the bare JID version of that.
         *
         * @throws  {jabberwerx.JID.InvalidJIDError} If {jid} is invalid
         */
        _prepareJid: function(jid) {
            return jabberwerx.JID.asJID(jid).getBareJID();
        },
        /**
         * @private
         */
        _getNodeClass: function() {
            return jabberwerx.PubSubNode;
        },

        /**
         * <p>Cleanup pubsub nodes on behalf of the client entity set.
         * {@link jabberwerx.EntitySet}.</p>
         * Fired on disconnect when cache is cleared.
         * @param {jabberwerx.Entity} entity The entity to destroy
         */
        cleanupEntity: function(entity) {
            if (this._cleanupMode == jabberwerx.PubSubController.CLEANUP_ALL) {
                entity.remove();
            } else if (this._cleanupMode == jabberwerx.PubSubController.CLEANUP_DELEGATES) {
                if (entity.delegate) {
                    entity.remove()
                } else {
                    // clear delegate list
                    entity.properties.delegates = {};
               }
            } else {
                //noop, leave node in list
            }
        },

       /**
         * @private, testing
         */
        _removeNodesFromEntitySet: function(mode) {
            if (mode) {
                var oldmode = this._cleanupMode;
                this._cleanupMode = mode;
            }
            var that = this;
            this.client.entitySet.each(function(node) {
                if (node.controller === that) {
                    that.cleanupEntity(node);
                }
            });
            if (oldmode !== undefined) {
                this._cleanupMode = oldmode;
            }
        },

        /**
         * @private
         * Property to indicate what clean up happens upon disconnect
         */
        _cleanupMode: null
    }, "jabberwerx.PubSubController");
    /**
     * @private
     * @constant
     * Indicates all nodes should be removed upon disconnect
     */
    jabberwerx.PubSubController.CLEANUP_ALL = "all";
    /**
     * @private
     * @constant
     * Indicates only nodes with a delegate should be removed upon disconnect
     */
    jabberwerx.PubSubController.CLEANUP_DELEGATES = "delegates";
}

/*build/dist/VTG-CAXL-debug-8.6.1.28927/src/controller/PEPController.js*/
/**
 * filename:        PEPController.js
 * created at:      2010/04/08T00:00:00-06:00
 *
 * Copyrights
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2011 Cisco Systems, Inc.  All Rights Reserved.
 */

if (jabberwerx) {
    jabberwerx.PEPController = jabberwerx.PubSubController.extend(/** @lends jabberwerx.PEPController.prototype */{
        /**
         * @class
         * <p>Controller to manage PEP nodes.</p>
         *
         * @description
         * <p>Creates a new PEPController with the given client.</p>
         *
         * @param   {jabberwerx.Client} client The client object to use for communicating to the server
         * @throws  {TypeError} If {client} is not a jabberwerx.Client
         * @constructs  jabberwerx.PEPController
         * @extends     jabberwerx.PubSubController
         */
        init: function(client) {
            this._super(client, "pep");
            this._cleanupMode = jabberwerx.PubSubController.CLEANUP_DELEGATES;
        },
        /**
         * <p>Destroys this PEPController. This method removes all PEPNodes
         * from the owning client.</p>
         */
        destroy: function() {
            this._super();
        },
        
        /**
         * <p>Return the specified PEPNode. Creates the node
         * if one doesn't already exist. This method overrides
         * the superclass to return PEPNode instances, and to
         * make {jid} an optional argument.</p>
         *
         * @param   {String} node the node
         * @param   {jabberwerx.JID|String} [jid] The JID.
         * @returns {jabberwerx.PEPNode} The requested PEPNode.
         * @throws  {TypeError} if {node} is not a string.
         * @throws  {jabberwerx.JID.InvalidJIDError} if {jid} defined and
         *          is invalid.
         */
        node: function(node, jid) {
            return this._super(node, jid);
        },
        
        /**
         * @private
         * Override to allow {jid} to be optional.
         */
        _prepareJid: function(jid) {
            return (jid) ? this._super(jid) : undefined;
        },
        /**
         * @private
         */
        _getNodeClass: function() {
            return jabberwerx.PEPNode;
        }
    }, "jabberwerx.PEPController");
}
