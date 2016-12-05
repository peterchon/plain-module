var testModule = testModule || function testModule() {
    'use strict';

    var _self = this;
    var _moduleContainer = document.getElementById('modules');

    if(!globFn) {
        alert('There was a problem loading the module.');
        return;
    }

    _self.makeDiv = function fn(elem) {
        var dom = globFn.helpers.makeDiv('module', elem);
        var child = _moduleContainer.querySelector('.module');
        if(child) {
            _moduleContainer.removeChild(child);
        }
        _moduleContainer.appendChild(dom);
    };

    _self.makeMoreDiv = function fn(elem) {
        var dom = globFn.helpers.makeDiv('module another', elem);
        var child = _moduleContainer.querySelector('.another');
        if(child) {
            _moduleContainer.removeChild(child);
        }
        _moduleContainer.appendChild(dom);
    };

    return _self;
};