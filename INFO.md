# Project Setup

## Create Initial Boiler Plate

Run the `serverless` create command and specify `aws-nodejs-typescript` as the
inital starter template:

```bash
npx serverless create --template aws-nodejs-typescript --path sls-ts-tester
```

## TypeScript Config

Add `"strict": true` to the `tsconfig.json` file's `compilerOptions` object.

## Setup Linting, Formatting and Pre-commit Hooks

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

4. Install pre-commit dependencies

```bash
npm i -D husky lint-staged
```

> NB: `husky` must be `v6.0.0` or `v4.X.X` as version 5 is not MIT licensed!

5. Create and setup `.huskyrc.json` and `.lintstagedrc` file configs
   in the root directory.

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

6. Pre-commits should now be setup and ready to go 🔥

## Setup tests

## Setup CI

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

## Setup serverless-offline

`serverless-offline` is a community-made plugin for `serverless` framework that
emulates `AWS Lambda` and `AWS API Gateway` on your local machine by spinning
up a local HTTP server.

### Steps

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
    "start:dev": "npx sls offline start",
},
```

Now just run `npm run start:dev` to spin up the local HTTP server.

You can now hit the HTTP server using tools like `postman`.
