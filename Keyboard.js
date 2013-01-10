(function(global) {
    'use strict';
    
    var nonChars = {
        8: 'backspace',
        9: 'tab',
        13: 'return',
        19: 'pause',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'insert',
        46: 'del',
        // numpad
        96: '0',
        97: '1',
        98: '2',
        99: '3',
        100: '4',
        101: '5',
        102: '6',
        103: '7',
        104: '8',
        105: '9',
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111: '/',
        112: 'f1',
        113: 'f2',
        114: 'f3',
        115: 'f4',
        116: 'f5',
        117: 'f6',
        118: 'f7',
        119: 'f8',
        120: 'f9',
        121: 'f10',
        122: 'f11',
        123: 'f12',
        144: 'numlock',
        145: 'scroll',
        191: '/'
    };

    var modifiers = {
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        224: 'meta'
    };

    var keyboard = global.keyboard = {
        on: function(keys, eventHandler) {
            if (!eventHandler)
                throw new Error('eventHandler not specified');

            var node = this.bindings;
            keys.split(' ').forEach(function(key) {
                key = key.split('+').sort().join('+');
                node = node[key] || (node[key] = { });
            });
            node.handler = eventHandler;
        },

        off: function() {
            this.bindings = { };
            this.currentSequences = [];
        },

        trigger: function(keys, event) {
            keys = keys.split('+').sort().join('+');

            var ret;
            keys.split(' ').forEach(function(key) {
                this.currentSequences = this.currentSequences
                    .concat(this.bindings)
                    .filter(function(sequence) { return key in sequence; })
                    .map(function(sequence) { return sequence[key]; });

                if (this.currentSequences[0] && this.currentSequences[0].handler)
                    ret = this.currentSequences[0].handler(event);
            }, this);
            return ret;
        }
    };

    global.document.addEventListener('keydown', function(event) {
        var key = modifiers[event.which] 
            || nonChars[event.which]
            || String.fromCharCode(event.which).toLowerCase();
        
        if (!(event.which in modifiers)) {
            var keys = [];
            for (var keyCode in modifiers) {
                var modifier = modifiers[keyCode];
                if (event[modifier + 'Key'])
                    keys.push(modifier);
            }
            key = keys.concat(key).join('+');
        }
        
        if (keyboard.trigger(key, event) === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, false);

    keyboard.off();
})(window);
