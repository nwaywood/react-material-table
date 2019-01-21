module.exports = {
    'roots': [
      '<rootDir>/src',
    ],
    'transform': {
      '^.+\\.tsx?$': 'ts-jest',
    },
    'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    'moduleNameMapper': {
        '.+\\.(svg|png|jpg)$': 'identity-obj-proxy',
      },
    'moduleFileExtensions': [
      'ts',
      'tsx',
      'js',
      'jsx',
      'json',
      'node',
    ],
  };
