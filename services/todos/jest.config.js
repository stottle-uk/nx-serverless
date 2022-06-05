module.exports = {
  displayName: 'todos',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  setupFiles: [`../../jest.setup.ts`],
  coverageDirectory: '../../coverage/services/todos',
};
