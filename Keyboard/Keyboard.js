'use strict';
(function (window) {
    window.keyboard = {
        on: function (keys, eventHandler) {
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

    window.keyboard.off();
})(window);