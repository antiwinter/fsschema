# Sidext Schema Viewer

A lightweight Lark Base extension to view the database schema of the current Base.

**Live Demo**: https://antiwinter.github.io/fsschema/

## Features

-   **Auto-Discovery**: Automatically fetches all tables in the Base.
-   **Schema View**: Displays field names, mapped SQL-like types, and original Lark types.
-   **Data Preview**: Shows the first 10 rows of data for each table.
-   **Clean UI**: Built with React and Ant Design.

## Development

1.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  Run dev server:
    ```bash
    npm run dev
    ```

    *Note: The Lark Base SDK (`@lark-base-open/js-sdk`) requires running inside a Lark Base extension container to function correctly. Local development will show a loading spinner or error unless mocked.*

## Build

To build for production (upload to Lark):

```bash
npm run build
```

The output will be in the `dist` directory.
