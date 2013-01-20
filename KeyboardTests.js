describe("Keyboard.js", function () {
    'use strict';

    chai.should();

    var ctrlKeyCode = 17;

    when("'a' & 'b' bound", function () {
        var a = bind('a'),
            b = bind('b');

        when("triggering 'a'", function () {
            keyboard.trigger('a');

            then(function () { a.handler.should.be.called; });
            then(function () { b.handler.should.not.be.called; });
        });

        when("triggering 'b'", function () {
            keyboard.trigger('b');

            then(function () { b.handler.should.be.called; });
            then(function () { a.handler.should.not.be.called; });
        });

        when("then all unbound", function () {
            keyboard.off();

            when("triggering 'a'", function () {
                keyboard.trigger('a');

                then(function () { a.handler.should.not.be.called; });
            });
        });
    });

    when("'a b' bound", function () {
        var ab = bind('a b');

        when("triggering 'a' then 'b'", function () {
            keyboard.trigger('a');
            keyboard.trigger('b');

            then(function () { ab.handler.should.be.called; });
        });
    });

    when("'a b c' bound", function () {
        var abc = bind('a b c');

        when("'a' bound", function () {
            var a = bind('a');

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a' handler then 'a b c' handler", function () {
                    a.handler.should.be.calledBefore(abc.handler);
                    abc.handler.should.be.called;
                });
            });
        });

        when("'b' bound", function () {
            var b = bind('b');

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a b c' handler only", function () {
                    abc.handler.should.be.called;
                    b.handler.should.not.be.called;
                });
            });
        });

        when("'d' bound", function () {
            var d = bind('d');

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                then(function () { d.handler.should.be.called; });
            });
        });

        when("'b d' bound", function () {
            var bd = bind('b d');

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                then(function () { bd.handler.should.be.called; });
            });
        });
    });

    when("'a' bound", function () {
        var a = bind('a');

        when("'a' is pressed", function () {
            var event = press('a');

            then(function () { a.handler.should.be.calledWith(event); });
        });

        when("'a' handler returns false", function () {
            a.handler.returns(false);

            when("'a' is pressed", function () {
                var event = press('a', { stopPropagation:sinon.spy(), preventDefault:sinon.spy() });

                then(function () { event.stopPropagation.should.be.called; });
                then(function () { event.preventDefault.should.be.called; });
            });
        });

        when("'ctrl+a' is pressed", function () {
            press('a', { ctrlKey:true });

            then(function () { a.handler.should.not.be.called; });
        });
    });

    when("'ctrl+a' bound", function () {
        var ctrlA = bind('ctrl+a');

        when("'ctrl+a' is pressed", function () {
            press('a', { ctrlKey:true });

            then(function () { ctrlA.handler.should.be.called; });
        });
    });

    when("'ctrl' bound", function () {
        var ctrl = bind('ctrl');

        when("'ctrl' is pressed", function () {
            press(ctrlKeyCode, { ctrlKey:true });

            then(function () { ctrl.handler.should.be.called; });
        });

        when("'ctrl+a' bound", function () {
            var ctrlA = bind('ctrl+a');

            when("'ctrl' then 'ctrl+a' is pressed", function () {
                press(ctrlKeyCode, { ctrlKey:true });
                press('a', { ctrlKey:true });

                it("calls 'ctrl' handler then 'ctrl+a' handler", function () {
                    ctrl.handler.should.be.calledBefore(ctrlA);
                    ctrlA.handler.should.be.called;
                });
            });
        });
    });

    when("modifiers bound in wrong order", function () {
        var aCtrl = bind('a+ctrl');

        when("triggered in correct order", function () {
            keyboard.trigger('ctrl+a');

            then(function () { aCtrl.handler.should.be.called; });
        });
    });

    when("binding an array of shortcuts", function () {
        var handler = bind(['a', 'b']);

        when("first shortcut pressed", function() {
            press('a');

            then(function() { handler.handler.should.be.called; });
        })

        when("second shortcut pressed", function() {
            press('b');

            then(function() { handler.handler.should.be.called; });
        });
    });

    keyboard.off();

    function bind(keys) {
        var handler = sinon.stub();
        keyboard.on(keys, handler);
        return { handler: handler };
    }

    function press(which, opts) {
        if (typeof which == 'string')
            which = which.toUpperCase().charCodeAt(0);
        opts = opts || {};
        opts.which = which;
        return dispatch('keydown', opts);
    }

    function dispatch(type, opts) {
        var event = new CustomEvent(type);

        Object.keys(opts).forEach(function (key) {
            event[key] = opts[key];
        });

        document.dispatchEvent(event);

        return event;
    }
});
