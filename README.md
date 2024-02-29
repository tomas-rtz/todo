# ToDo


## Run Application

The project includes pre-configured run configurations:

- `npm run dev` - launches the application in automatic reload mode and compiles scripts into the dist folder.

Once `npm run dev` is executed, the application runs at [http://localhost:3000](http://localhost:3000).

### Setup

1. Run mongodb and update DB_ADDRESS in .env

2. To install node modules, run the command in the root directory:

   `npm install`

## Dev Tools

### logs
Logs are stored in the file `./src/logs/app.log` Via winston package

### eslint

For automatic ESLint fix on save, add the following to the settings in VS Code:

```json
{
  "editor.codeActionsOnSave": {

    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
  "javascript",
  "typescript",
  ]
}
```
