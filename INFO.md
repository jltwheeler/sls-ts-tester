Steps to create the example repo:

-   run `npx serverless create --template aws-nodejs-typescript --path sls-ts-tester`
-   create a `.github/workflows/push.yml` GA workflow
-   ```
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
            run : npm run lint
          - name: 🧪 test
            run: npm run test
    ```
-   Install additional packages:
    - `npm i -D serverless-offline`
