/*global test ok start module */
/* Sample qunit test script */
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

    module('test2', {
        setup: function() {
            console.log('module setup');
        }
    });

    test( "hello test2", function() {
        console.log('Test 2: '+$.fn.jquery);
        ok(1 === 1, "Passed!");
    });


}(jQuery));
