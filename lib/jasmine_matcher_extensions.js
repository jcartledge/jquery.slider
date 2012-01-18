/**
 * Matcher that mimics toHaveBeenCalledWith, except it ignores the first argument (and isn't robust enough to handle more than one call)
 *
 * @example
 *
 * https://raw.github.com/gist/1384835/6334db86a3fec7b0819609e8e311c31b1742eec7/jasmine_matcher_extensions.js
 *
 */

jasmine.Matchers.prototype.toHaveBeenTriggeredWith = function() {
  var expectedArgs = jasmine.util.argsToArray(arguments);
  if (!jasmine.isSpy(this.actual)) {
    throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
  }
  this.message = function() {
    if (this.actual.callCount === 0) {
      return [
        "Expected spy " + this.actual.identity + " to have been called with " + jasmine.pp(expectedArgs) + " but it was never called.",
        "Expected spy " + this.actual.identity + " not to have been called with " + jasmine.pp(expectedArgs) + " but it was."
      ];
    } else {
      return [
        "Expected spy " + this.actual.identity + " to have been called with " + jasmine.pp(expectedArgs) + " but was called with " + jasmine.pp(this.actual.argsForCall[0].slice(1)),
        "Expected spy " + this.actual.identity + " not to have been called with " + jasmine.pp(expectedArgs) + " but was called with " + jasmine.pp(this.actual.argsForCall[0].slice(1))
      ];
    }
  };

  return this.actual.callCount > 0 && this.env.equals_(this.actual.argsForCall[0].slice(1), expectedArgs);
};
