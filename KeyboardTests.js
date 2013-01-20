﻿describe("Keyboard.js", function () {
    'use strict';

    chai.should();

    var ctrlKeyCode = 17;

    when("'a' & 'b' bound", function () {
        var a = bind('a'),
            b = bind('b');

        when("triggering 'a'", function () {
            keyboard.trigger('a');

            then(function () { a.should.have.been.called; });
            then(function () { b.should.not.have.been.called; });
        });

        when("triggering 'b'", function () {
            keyboard.trigger('b');

            then(function () { b.should.have.been.called; });
            then(function () { a.should.not.have.been.called; });
        });

        when("then all unbound", function () {
            keyboard.off();

            when("triggering 'a'", function () {
                keyboard.trigger('a');

                then(function () { a.should.not.have.been.called; });
            });
        });
    });

    when("'a b' bound", function () {
        var ab = bind('a b');

        when("triggering 'a' then 'b'", function () {
            keyboard.trigger('a');
            keyboard.trigger('b');

            then(function () { ab.should.have.been.called; });
        });
    });

    when("'a b c' bound", function () {
        var abc = bind('a b c');

        when("'a' bound", function () {
            var a = bind('a');

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a' handler then 'a b c' handler", function () {
                    a.should.have.been.calledBefore(abc);
                    abc.should.have.been.called;
                });
            });
        });

        when("'b' bound", function () {
            var b = bind('b');

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a b c' handler only", function () {
                    abc.should.have.been.called;
                    b.should.not.have.been.called;
                });
            });
        });

        when("'d' bound", function () {
            var d = bind('d');

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                then(function () { d.should.have.been.called; });
            });
        });

        when("'b d' bound", function () {
            var bd = bind('b d');

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                then(function () { bd.should.have.been.called; });
            });
        });
    });

    when("'a' bound", function () {
        var a = bind('a');

        when("'a' is pressed", function () {
            var event = press('a');

            then(function () { a.should.have.been.calledWith(event); });
        });

        when("'a' handler returns false", function () {
            a.returns(false);

            when("'a' is pressed", function () {
                var event = press('a', { stopPropagation:sinon.spy(), preventDefault:sinon.spy() });

                then(function () { event.stopPropagation.should.have.been.called; });
                then(function () { event.preventDefault.should.have.been.called; });
            });
        });

        when("'ctrl+a' is pressed", function () {
            press('a', { ctrlKey:true });

            then(function () { a.should.not.have.been.called; });
        });
    });

    when("'ctrl+a' bound", function () {
        var ctrlA = bind('ctrl+a');

        when("'ctrl+a' is pressed", function () {
            press('a', { ctrlKey:true });

            then(function () { ctrlA.should.have.been.called; });
        });
    });

    when("'ctrl' bound", function () {
        var ctrl = bind('ctrl');

        when("'ctrl' is pressed", function () {
            press(ctrlKeyCode, { ctrlKey:true });

            then(function () { ctrl.should.have.been.called; });
        });

        when("'ctrl+a' bound", function () {
            var ctrlA = bind('ctrl+a');

            when("'ctrl' then 'ctrl+a' is pressed", function () {
                press(ctrlKeyCode, { ctrlKey:true });
                press('a', { ctrlKey:true });

                it("calls 'ctrl' handler then 'ctrl+a' handler", function () {
                    ctrl.should.have.been.calledBefore(ctrlA);
                    ctrlA.should.have.been.called;
                });
            });
        });
    });

    when("modifiers bound in wrong order", function () {
        var aCtrl = bind('a+ctrl');

        when("triggered in correct order", function () {
            keyboard.trigger('ctrl+a');

            then(function () { aCtrl.should.have.been.called; });
        });
    });

    keyboard.off();

    function bind(keys) {
        var handler = sinon.stub();
        keyboard.on(keys, handler);
        return handler;
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