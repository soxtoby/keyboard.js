///<reference path="~/Keyboard.js"/>
///<reference path="~/testing/sinon.js" />
///<reference path="~/testing/bqunit.js" />

when("single char bound", function () {
    var eventHandler = sinon.stub();
    keyboard.on('a', eventHandler);

    when("triggering matching char", function () {
        keyboard.trigger('a');

        it("calls the bound event handler", function () {
            sinon.assert.called(eventHandler);
        });
    });

    when("handlers have been reset", function () {
        keyboard.off();

        when("triggering matching char", function () {
            keyboard.trigger('a');

            it("doesn't call the previously bound event handler", function () {
                sinon.assert.notCalled(eventHandler);
            });
        });
    });

    keyboard.off();
});

when("two char sequence bound", function () {
    var ab = sinon.stub();
    keyboard.on('a b', ab);

    whenTriggeringCharsInSequence(function () {
        it("calls event handler", function () {
            sinon.assert.called(ab);
        });
    });

    when("first char bound separately", function () {
        var a = sinon.stub();
        keyboard.on('a', a);

        whenTriggeringCharsInSequence(function () {
            it("calls single-char event handler then two-char event handler", function () {
                sinon.assert.called(a);
                sinon.assert.called(ab);
                sinon.assert.callOrder(a, ab);
            });
        });

        when("first char handler returns false", function () {
            a.returns(false);

            whenTriggeringCharsInSequence(function () {
                it("doesn't call the two-char handler", function () {
                    sinon.assert.notCalled(ab);
                });
            });
        });
    });

    when("second char bound separately", function () {
        var b = sinon.stub();
        keyboard.on('b', b);

        whenTriggeringCharsInSequence(function () {
            it("doesn't call the second char handler", function () {
                sinon.assert.called(ab);
                sinon.assert.notCalled(b);
            });
        });
    });

    keyboard.off();

    function whenTriggeringCharsInSequence(whenFunction) {
        when("triggering chars in sequence", function () {
            keyboard.trigger('a');
            keyboard.trigger('b');

            whenFunction();
        });
    }
});