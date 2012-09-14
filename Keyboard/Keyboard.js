'use strict';
(function (window) {
    window.keyboard = {
        bindings: {},
        status: [],

        on: function (keys, eventHandler) {
            var node = this.bindings;
            keys.split(' ').forEach(function (key) {
                node = node[key] || (node[key] = {});
            }, this);
            node.handler = eventHandler;
        },

        off: function () {
            this.bindings = {};
            this.status = [];
        },

        trigger: function (key) {
            this.status = this.status
                .concat(this.bindings)
                .filter(function (sequence) { return key in sequence; });

            for (var i = 0; i < this.status.length; i++) {
                if (this.status[i].handler && this.status.handler() === false) {
                    this.status = [];
                    break;
                }
            }

            if (key in this.status) {
                this.status = this.status[key];
                if (this.status.handler) {
                    if (this.status.handler() === false)
                        this.status = this.bindings;
                }
            } else {
                this.status = this.bindings;
            }
        }
    };

    window.keyboard.off();
})(window);