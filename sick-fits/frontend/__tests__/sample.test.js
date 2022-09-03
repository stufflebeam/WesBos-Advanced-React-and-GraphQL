function add(a, b) {
  return parseInt(a) + parseInt(b);
}

describe('Sample test 101', () => {
  it('works as expected', () => {
    // In here, we run our expect statements, to see if the test will pass or fail.
    expect(true).toBe(true);
    expect(1).toEqual(1);
    expect(2 * 2).toEqual(4);
  });
  it('runs the add() function properly', () => {
    const age = 100;
    expect(age).toBeGreaterThan(99);
    expect(add(age, 42)).toEqual(142);
  });
  it('can add strings of numbers together', () => {
    expect(add('1', '2')).toEqual(3);
  });
});
