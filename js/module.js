/* globalFunctions shared throughout the app */
var globFn = (function myFn(doc) {

    /* private var to bind functions to */
    var _glob = {};

    /* initial options to declare */
    var initOpt = {
        jsUrl: "js/_partial/"
    };

    /* plain JS ajax - can pass resolve and reject for promise */
    _glob.http = function(url, res, rej) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onload = function() {
            if(this.readyState === this.DONE && this.status === 200) {
                res(this.responseText);
            } else {
                rej("There was a problem loading the data");
            }
        };
        xhr.onerror = function() {
            rej("There was a problem loading the data");
        };
    };

    /* use promise for http */
    _glob.promise = function(url) {
        return new Promise(function(resolve, reject) {
            _glob.http(url, resolve, reject);
        });
    };

    /* create and append script to html head */
    _glob.appendScriptToHead = function(s) {

        /* return if method from script already exists */
        if(_glob[s]) return;

        var script = doc.createElement('script');
        script.src =  initOpt.jsUrl + s + ".js";
        doc.head.appendChild(script);
    };

    return _glob;

})(document);

/* global helper functions */
globFn.helpers = {
    makeDiv: function(cl, child) {
        var div = document.createElement('div');
        div.className = cl || "";
        if(child) {
            if(typeof child === "string") {
                div.innerHTML = child;
            } else {
                div.appendChild(child);
            }
        }

        return div;
    }
};

/* bind click event handler to document */
document.body.onclick = function(Event) {

    /* get the target node of the click */
    var t = Event.target || Event.srcElement;

    /* get the necessary data attribute */
    var _module = getTargetOrParentNode(t, 'data-load-module');
    var _func = getTargetOrParentNode(t, 'data-load-fn');

    /* check parent node, if child node has been clicked - i.e. (<a data-...><span>blah</span></a> */
    function getTargetOrParentNode(el, attr) {
        return el.getAttribute(attr) || el.parentNode.getAttribute(attr);
    }

    /* if data-load-module */
    if(_module) {

        /* stop default action & event bubbling */
        Event.preventDefault();
        Event.stopPropagation();

        /* setup the url to get */
        var url = "_partial/" + _module + ".html";

        /* append the script to head */
        globFn.appendScriptToHead(_module);

        /* if string contains "-", replace hyphen and camel-case it */
        _module = _module.replace(/-(\w)/, function() {
            return arguments[1].toUpperCase();
        });

        /* call the http function to get the partial html */
        globFn.http(url, function(resp) {

            if(!globFn[_module]) {

                /* keep checking in case it function isn't available */
                var tIntv = setInterval(function() {

                    /* if async js function is available, add to globFn */
                    if(window[_module]) {

                        /* clear setInterval */
                        clearInterval(tIntv);

                        /* add to globFn */
                        globFn[_module] = window[_module]();

                        /* invoke the required function */
                        globFn[_module][_func](resp);
                    }
                }, 100);
            } else {

                /* if function was already available */
                globFn[_module][_func](resp);
            }

        });
    }
};
