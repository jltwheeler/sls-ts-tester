# Project Setup

Guide to setup a simple **serverless** Node.js project with TypeScript.

This sample project consists of the following high-level architecture:

- API Gateway to serve 1 Lambda function via a REST HTTP endpoint
- SNS Topic to invoke 1 async Lambda function
- Scheduled CloudWatch Cron Event to invoke 1 async Lambda function
- DynamoDB for data store. `dynamodb-toolbox` and `aws-sdk` libs are used to
  interact with DynamoDB
- S3 to store long-term data that will be queried by Athena.

<!-- TABLE OF CONTENTS -->

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#initial-boiler-plate">Initial Boiler Plate</a>
    </li>
    <li>
      <a href="#architecture">Architecture</a>
    </li>
    <li>
      <a href="#typescript-config">TypeScript Config</a>
    </li>
    <li>
      <a href="#linting-formatting-and-pre-commit-hooks">Linting, Formatting and Pre-commit hooks</a>
    </li>
    <li>
      <a href="#testing">Testing</a>
    </li>
    <li>
      <a href="#ci">CI</a>
    </li>
    <li>
      <a href="#local-development">Local Development</a>
        <ul>
          <li><a href="#serverless-offline">Serverless Offline</a></li>
          <li><a href="#dynamodb-local">DynamoDB Local</a></li>
          <li><a href="#async-events">Async Events</a></li>
      </ul>
    </li>
  </ol>
</details>
<br/>

## Initial Boiler Plate

Run the `serverless` create command and specify `aws-nodejs-typescript` as the
inital starter template:

```bash
npx serverless create --template aws-nodejs-typescript --path sls-ts-tester
```

## Architecture

Describe project folder structure here...

## TypeScript Config

Add `"strict": true` to the `tsconfig.json` file.

```json
{
  "compilerOptions": {
    ...,
    "strict": true,
    ...
  }
}
```

## Linting, Formatting and Pre-commit hooks

1. Install required dependencies and plugins for `prettier` and `eslint`.

```bash
npm i -D eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

2. Create and set up `.eslintrc.js` and `.prettierrc` config files
   in the root directory.

> NB: These configurations are opinionated and can _change_ where required.

```js
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 80
}
```

3. Add `lint` and `format` scripts to the `package.json` file.

```json
"scripts": {
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
}
```

4. Create and setup `.huskyrc.json` and `.lintstagedrc` config files in the
   root directory.

```json
// .huskyrc.json
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

```json
// .lintstagedrc
{
  "*.{js,ts}": ["npm run lint"]
}
```

5. Install pre-commit dependencies and initialise the `.husky` pre-commit
   directory and hook to call `lint-staged`.

> NB: `husky` must be `v6.0.0` or `v4.X.X` as version 5 is not MIT licensed!

```bash
npm i -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

6. Pre-commits should now be setup and ready to go next time you commit
   🔥 !!!

## Testing

1. Install testing dependencies. Using `jest` and the `ts-jest` plugin for
   TypeScript support when running the `jest` test runner.

```sh
npm i -D jest ts-jest @types/jest
```

2. Setup `jest.config.js` file

```js
/* eslint-disable no-undef */
module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['.webpack'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

3. Add testing scripts to `package.json` file

```json
"scripts": {
    ...
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    ...
}
```

## CI

Create a `.github/workflows/push.yml` file. This `workflow` outlines the CI
steps that will be run when pushing to branches other than `main`:

```yaml
on:
  push:
    branches-ignore:
      - 'main'
      - 'master'
jobs:
  test:
    name: 🏎️ CI - lint and test
    runs-on: ubuntu-latest
    steps:
      - name: 📚 checkout
        uses: actions/checkout@v2
      - name: 💚 Use node
        uses: actions/setup-node@v2
        with:
          node-version: 'lts/fermium'
      - name: 📦 install deps
        run: npm ci
      - name: 🛂 lint
        run: npm run lint
      - name: 🧪 test
        run: npm run test
```

## Local Development

### Serverless Offline

To run a local development server use `serverless-offline`, a community-made plugin for the `serverless` framework that emulates `AWS Lambda` and
`AWS API Gateway` on your local machine by spinning up a local HTTP server.

1. Install the package:

```bash
npm i -D serverless-offline
```

2. Add `serverless-offline` as a plugin to the `./serverless.ts` config file:

```typescript
plugins: ['serverless-webpack', 'serverless-offline'],
```

3. Add a start script to the `package.json` file:

```json
"scripts": {
    ...
    "start:dev": "npx sls offline start",
    ...
},
```

4. Start the local HTTP sever:

```bash
npm run start:dev
```

5. Use tools like `postman` to test the server's endpoints

### DynamoDB Local

For local development, the `amazon/dynamodb-local` image is used to emulate
AWS DynamoDB. To spin up the local dynamo server, follow the steps below:

1. Run `docker-compose up -d` to start the container in a detatched state.
2. Run `npm run db:migrate && npm run db:seed` to set up a local dynamodb for
   development.

### Async Events
