///<reference path="~/Keyboard.js"/>
///<reference path="~/testing/sinon.js" />
///<reference path="~/testing/bqunit.js" />

describe("Keyboard.js", function () {
    var keyCode = {
        shift: 16,
        ctrl: 17,
        alt: 18
    };

    when("'a' & 'b' bound", function () {
        var a = bind('a'),
            b = bind('b');

        when("triggering 'a'", function () {
            keyboard.trigger('a');

            it("calls 'a' handler", function () {
                sinon.assert.called(a);
            });

            it("doesn't call 'b' handler", function () {
                sinon.assert.notCalled(b);
            });
        });

        when("triggering 'b'", function () {
            keyboard.trigger('b');

            it("calls 'b' handler", function () {
                sinon.assert.called(b);
            });

            it("doesn't call 'a' handler", function () {
                sinon.assert.notCalled(a);
            });
        });

        when("then all unbound", function () {
            keyboard.off();

            when("triggering 'a'", function () {
                keyboard.trigger('a');

                it("doesn't call 'a' handler", function () {
                    sinon.assert.notCalled(a);
                });
            });
        });
    });

    when("'a b' bound", function () {
        var ab = bind('a b');

        when("triggering 'a' then 'b'", function () {
            keyboard.trigger('a');
            keyboard.trigger('b');

            it("calls 'a b' handler", function () {
                sinon.assert.called(ab);
            });
        });
    });

    when("'a b c' bound", function () {
        var abc = bind('a b c');

        when("'a' bound", function () {
            var a = bind('a');

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a' handler then 'a b c' handler", function () {
                    sinon.assert.called(abc);
                    sinon.assert.callOrder(a, abc);
                });
            });
        });

        when("'b' bound", function () {
            var b = bind('b');

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a b c' handler only", function () {
                    sinon.assert.called(abc);
                    sinon.assert.notCalled(b);
                });
            });
        });

        when("'d' bound", function () {
            var d = bind('d');

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                it("calls 'd' handler", function () {
                    sinon.assert.called(d);
                });
            });
        });

        when("'b d' bound", function () {
            var bd = bind('b d');

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                it("calls 'b d' handler", function () {
                    sinon.assert.called(bd);
                });
            });
        });
    });

    when("'a' bound", function () {
        var a = bind('a');

        when("'a' is pressed", function () {
            press('a');

            it("calls 'a' handler", function () {
                sinon.assert.called(a);
            });
        });

        when("'ctrl+a' is pressed", function () {
            press('a', { ctrl: true });

            it("doesn't call 'a' handler", function () {
                sinon.assert.notCalled(a);
            });
        });
    });

    when("'ctrl+a' bound", function () {
        var ctrlA = bind('ctrl+a');

        when("'ctrl+a' is pressed", function () {
            press('a', { ctrl: true });

            it("calls 'ctrl+a' handler", function () {
                sinon.assert.called(ctrlA);
            });
        });
    });

    when("'ctrl' bound", function () {
        var ctrl = bind('ctrl');

        when("'ctrl' is pressed", function () {
            press(keyCode.ctrl, { ctrl: true });

            it("calls 'ctrl' handler", function () {
                sinon.assert.called(ctrl);
            });
        });

        when("'ctrl+a' bound", function () {
            var ctrlA = bind('ctrl+a');

            when("'ctrl' then 'ctrl+a' is pressed", function () {
                press(keyCode.ctrl, { ctrl: true });
                press('a', { ctrl: true });

                it("calls 'ctrl' handler then 'ctrl+a' handler", function () {
                    sinon.assert.called(ctrl);
                    sinon.assert.called(ctrlA);
                    sinon.assert.callOrder(ctrl, ctrlA);
                });
            });
        });
    });

    when("modifiers bound in wrong order", function () {
        var aCtrl = bind('a+ctrl');

        when("triggered in correct order", function () {
            keyboard.trigger('ctrl+a');

            it("calls the handler", function () {
                sinon.assert.called(aCtrl);
            });
        });
    });

    keyboard.off();

    function bind(keys) {
        var handler = sinon.spy();
        keyboard.on(keys, handler);
        return handler;
    }

    function press(which, opts) {
        if (typeof which == 'string')
            which = which.toUpperCase().charCodeAt(0);
        opts = opts || { };
        opts.which = which;
        dispatch('keydown', opts);
    }

    function dispatch(type, opts) {
        if (typeof opts == 'string')
            opts = { 'char': opts };

        var event = new CustomEvent(type, opts);

        event.which = opts.char ? opts.char.charCodeAt(0) : opts.which || 0;
        event.ctrlKey = opts.ctrl;
        event.altKey = opts.alt;
        event.shiftKey = opts.shift;
        event.metaKey = opts.meta;

        return document.dispatchEvent(event);
    }
});
