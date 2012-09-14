///<reference path="~/Keyboard.js"/>
///<reference path="~/testing/sinon.js" />
///<reference path="~/testing/bqunit.js" />

describe("Keyboard.js", function () {

    when("'a' & 'b' bound", function () {
        var a = sinon.spy(),
        b = sinon.spy();
        keyboard.on('a', a);
        keyboard.on('b', b);

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
        var ab = sinon.spy();
        keyboard.on('a b', ab);

        when("triggering 'a' then 'b'", function () {
            keyboard.trigger('a');
            keyboard.trigger('b');

            it("calls 'a b' handler", function () {
                sinon.assert.called(ab);
            });
        });
    });

    when("'a b c' bound", function () {
        var abc = sinon.spy();
        keyboard.on('a b c', abc);

        when("'a' bound", function () {
            var a = sinon.spy();
            keyboard.on('a', a);

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a' handler then 'a b c' handler", function () {
                    sinon.assert.called(abc);
                    sinon.assert.callOrder(a, abc);
                });
            });
        });

        when("'b' bound", function () {
            var b = sinon.spy();
            keyboard.on('b', b);

            when("triggering 'a', 'b', 'c'", function () {
                keyboard.trigger('a b c');

                it("calls 'a b c' handler only", function () {
                    sinon.assert.called(abc);
                    sinon.assert.notCalled(b);
                });
            });
        });

        when("'d' bound", function () {
            var d = sinon.spy();
            keyboard.on('d', d);

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                it("calls 'd' handler", function () {
                    sinon.assert.called(d);
                });
            });
        });

        when("'b d' bound", function () {
            var bd = sinon.spy();
            keyboard.on('b d', bd);

            when("triggering 'a', 'b', 'd'", function () {
                keyboard.trigger('a b d');

                it("calls 'b d' handler", function () {
                    sinon.assert.called(bd);
                });
            });
        });
    });

    keyboard.off();
});