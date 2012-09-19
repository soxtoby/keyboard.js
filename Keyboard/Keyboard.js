'use strict';
(function (window) {
    var keyboard = window.keyboard = {
        modifiers: {
            16: 'shift',
            17: 'ctrl',
            18: 'alt'
        },

        on: function (keys, eventHandler) {
            if (!eventHandler)
                throw new Error('eventHandler not specified');

            var node = this.bindings;
            keys.split(' ').forEach(function (key) {
                node = node[key] || (node[key] = {});
            });
            node.handler = eventHandler;
        },

        off: function () {
            this.bindings = {};
            this.currentSequences = [];
        },

        trigger: function (keys) {
            keys.split(' ').forEach(function(key) {
                this.currentSequences = this.currentSequences
                    .concat(this.bindings)
                    .filter(function(sequence) { return key in sequence; })
                    .map(function(sequence) { return sequence[key]; });

                if (this.currentSequences[0] && this.currentSequences[0].handler)
                    this.currentSequences[0].handler();
            }, this);
        }
    };

    window.document.addEventListener('keydown', function(event) {
        var keys = [];
        if (event.ctrlKey)
            keys.push('ctrl');
        if (event.altKey)
            keys.push('alt');
        if (event.shiftKey)
            keys.push('shift');
        if (event.metaKey)
            keys.push('meta');
        keys.push(String.fromCharCode(event.which));
        keyboard.trigger(keys.join('+'));
    }, false);

    window.document.addEventListener('keyup', function(event) {
        if (keyboard.lastPressedModifier = event.which)
            keyboard.trigger(keyboard.modifiers[event.which]);
    });
    
    keyboard.off();
})(window);

/*
Cross-browser KeyboardEvent properties

Chrome:
keypress: keyCode, which
keydown: keyCode, keyIdentifier, which

FireFox:
keypress: charCode, which
keydown: keyCode, which

Opera:
keypress: keyCode, which
keydown: keyCode, which

IE9:
keypress: char, charCode, key, keyCode, location, which
keydown: key, keyCode, which
*/