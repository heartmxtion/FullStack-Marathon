mocha.setup('bdd');
let assert = chai.assert;

mocha.run();
describe('checkBrackets', function () {
  // Incorrect cases (5)
  it('should return -1 for non-string input (NaN)', function () {
    const result = checkBrackets(NaN);
    console.log(result); // Expected: -1
    assert.strictEqual(result, -1);
  });

  it('should return -1 for non-string input (123)', function () {
    const result = checkBrackets(123);
    console.log(result); // Expected: -1
    assert.strictEqual(result, -1);
  });

  it('should return -1 for non-string input (null)', function () {
    const result = checkBrackets(null);
    console.log(result); // Expected: -1
    assert.strictEqual(result, -1);
  });

  it('should return -1 for non-string input (undefined)', function () {
    const result = checkBrackets(undefined);
    console.log(result); // Expected: -1
    assert.strictEqual(result, -1);
  });

  it('should return -1 for non-string input ({})', function () {
    const result = checkBrackets({});
    console.log(result); // Expected: -1
    assert.strictEqual(result, -1);
  });

  // Correct cases (10)
  it('should return 0 for an empty string', function () {
    const result = checkBrackets('');
    console.log(result); // Expected: 0
    assert.strictEqual(result, 0);
  });

  it('should return 0 for a string without brackets', function () {
    const result = checkBrackets('Hello World');
    console.log(result); // Expected: 0
    assert.strictEqual(result, 0);
  });

  it('should return 0 for a string with balanced brackets "()"', function () {
    const result = checkBrackets('()');
    console.log(result); // Expected: 0
    assert.strictEqual(result, 0);
  });

  it('should return 0 for a string with balanced brackets "()()"', function () {
    const result = checkBrackets('()()');
    console.log(result); // Expected: 0
    assert.strictEqual(result, 0);
  });

  it('should return the correct count of additional brackets for a string with open brackets "((("', function () {
    const result = checkBrackets('(((');
    console.log(result); // Expected: 3
    assert.strictEqual(result, 3);
  });

  it('should return the correct count of additional brackets for a string with closing brackets ")))"', function () {
    const result = checkBrackets(')))');
    console.log(result); // Expected: 3
    assert.strictEqual(result, 3);
  });

  it('should return the correct count of additional brackets for a string with unbalanced brackets ")()("', function () {
    const result = checkBrackets(')()(');
    console.log(result); // Expected: 2
    assert.strictEqual(result, 2);
  });

  it('should return the correct count of additional brackets for a string with mixed brackets "1)()(())2(()"', function () {
    const result = checkBrackets('1)()(())2(()');
    console.log(result); // Expected: 2
    assert.strictEqual(result, 2);
  });

  it('should return 0 for a string with balanced brackets around text "(((Hello)))"', function () {
    const result = checkBrackets('(((Hello)))');
    console.log(result); // Expected: 0
    assert.strictEqual(result, 0);
  });

  it('should return the correct count of additional brackets for a string with unbalanced brackets "(()()("', function () {
    const result = checkBrackets('(()()(');
    console.log(result); // Expected: 1
    assert.strictEqual(result, 1);
  });
});
