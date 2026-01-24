import {
  getPath
} from '../RoutineInterpreter.js';

describe('getPath', () => {
  test('returns first CLI argument', () => {
    const argv = ['node', 'cli.js', 'test.json'];
    expect(getPath(argv)).toBe('test.json');
  });

  test('throws when missing argument', () => {
    const argv = ['node', 'cli.js'];
    expect(() => getPath(argv)).toThrow(
      'No routine argument provided.'
    );
  });
});