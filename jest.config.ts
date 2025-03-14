export default {
 preset: 'ts-jest',
 testEnvironment: 'jest-environment-jsdom',
 transform: {
  '^.+\\.tsx?$': 'ts-jest',
  // process `*.tsx` files with `ts-jest`
 },
 moduleNameMapper: {
  '\\.(gif|ttf|eot|svg|png)$': 'identity-obj-proxy',
  '\\.(css|less)$': 'identity-obj-proxy',
  '^@/(.*)$': '<rootDir>/src/$1',
 },
}