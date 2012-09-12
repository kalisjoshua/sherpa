/*jshint strict:false*/
/*globals module require*/
var assert = require("assert")
  , sherpa = require("../sherpa");

/*
  assert(value, message)
  assert.deepEqual(actual, expected, [message])
  assert.doesNotThrow(block, [error], [message])
  assert.equal(actual, expected, [message])
  assert.fail(actual, expected, message, operator)
  assert.ifError(value)
  assert.notDeepEqual(actual, expected, [message])
  assert.notEqual(actual, expected, [message])
  assert.notStrictEqual(actual, expected, [message])
  assert.ok(value, [message])
  assert.strictEqual(actual, expected, [message])
  assert.throws(block, [error], [message])
*/

var invalids = [
      null
    , 0
    , 1
    , {}
    , []
    , /abc/
    ];

module.exports = {
  "sherpa.valid.args() should be thorough": function () {

    assert(true !== sherpa.valid.args([]), "not enough arguments passed in");
    assert(false === sherpa.valid.args([]), "not enough arguments passed in");

    assert(sherpa.valid.args([".", function () {}]), "simplest minimal valid arguments");
    assert(sherpa.valid.args([".", 1, function () {}]), "simplest maximal valid arguments");

    assert(!sherpa.valid.args([".", ""]), "last argument needs to be a callback function");

    invalids
      // add in a unction as an invalid value for the first argument
      .concat([""])
      .forEach(function (val) {
        assert(!sherpa.valid.args(".", val), "invalid values for callback should produce an error");
      });
  }

  ,"sherpa.valid.root() should validate only strings": function () {
    invalids
      // add in a unction as an invalid value for the first argument
      .concat([function () {}])
      .forEach(function (val) {
        assert(!sherpa.valid.root(val), "invalid values for root should produce an error");
      });
  }

  ,"sherpa called with no args fails": function () {
    assert.throws(sherpa, "no arguments is going to be a problem");

    assert.throws(function () { sherpa(); }, "no arguments is going to be a problem");
  }

  ,"sherpa called with only valid first arg fails": function () {
    var err_msg = "sherpa must be passed a valid callback function";

    assert.throws(function () { sherpa("."); }, err_msg);

    assert.throws(function () { sherpa(".", null); }, err_msg);

    assert.throws(function () { sherpa(".", undefined); }, err_msg);
  }

  ,"sherpa must have a path to watch": function () {
    assert.throws(function () { sherpa("", function () {}); }, "root must not be empty");
  }
};
