# 02 — Install the tools and run the site

## Learning goal

You will learn what the local tools do and how to get from a fresh checkout to a working browser preview.

## The tools in plain language

| Tool | Plain-language meaning | Why this repository uses it |
| --- | --- | --- |
| VS Code | A text editor with a file tree, terminal and helpful diagnostics | Edit files without needing a large IDE |
| Git | A local history and collaboration tool | Record changes and prepare pull requests |
| GitHub | The hosted collaboration service around Git | Review, merge, automate and publish the repository |
| Node.js | A program that can run JavaScript tools outside a browser | Runs the build and validation tools |
| npm | Node’s package manager and script runner | Installs dependencies and runs project commands |
| TypeScript | JavaScript with extra checks about data and code | Catches several mistakes before the browser runs the site |
| Vite | The development server and build tool | Serves files locally and creates `dist/` |
| Browser | The program that displays the site | Lets you inspect the real result |

The optional evidence-refresh workflow also uses Python 3.10 or newer, `uv`, the GitHub CLI and a separately reviewed analyzer checkout. You do not need those tools for ordinary site or content work.

You do not need to understand the internal implementation of each tool to start. You do need to know which tool is responsible when something fails.

## Required versions

The site asks for Node.js **20.19 or newer**, or a current LTS release, and npm. Use the current version approved by your IT environment if your organisation manages Node centrally.

Check what is already installed:

```text
node --version
npm --version
git --version
```

If `node` or `npm` is not recognised, install Node.js through the approved corporate route. If `git` is not recognised, install Git through the approved corporate route. Do not bypass corporate software or security policies.

## Open the repository

If you have a repository URL and need a local copy:

```text
git clone <repository-url>
cd <repository-folder>
```

If the folder already exists, open it in VS Code and use **Terminal → New Terminal**. The terminal prompt should be inside the repository folder. You can check the location with:

```text
pwd
```

On Windows PowerShell, the equivalent is usually:

```text
Get-Location
```

The rest of the commands are the same in most shells. Paths may look slightly different.

## Install dependencies

Run this once after cloning, and again when `package-lock.json` changes:

```text
npm ci
```

`npm ci` means “install exactly what the lock file records.” It is preferred for CI and for a clean local setup.

`npm install` means “resolve dependencies and possibly update the lock file.” It is useful when deliberately adding or updating a package, but it can change more files than expected. Do not use it casually for a content-only change.

The installed packages are placed in `node_modules/`, which is ignored by Git.

## Run the development site

Start the Vite development server:

```text
npm run dev
```

Vite prints a local address, normally similar to `http://localhost:5173/`. Open that address in a browser.

The development server provides **hot module replacement**: after you save a source file, the browser may update without a full restart. If the page appears stale, refresh the browser. If it still looks wrong, stop the server with `Ctrl+C` and start it again.

Keep the terminal running while you use the development site. The command is a long-running process, unlike validation commands.

## Build and preview the production result

A development server is not the same as the published site. To create and inspect the production output:

```text
npm run build
npm run preview
```

`npm run build` first runs TypeScript checking and then Vite. It creates `dist/`.

`npm run preview` serves the already-created `dist/` directory. Run `npm run build` again after source changes before relying on the preview.

## Run the repository checks

The short check is:

```text
npm test
```

It validates the Markdown post files and repository skill package.

The standard full check is:

```text
npm run validate
```

It runs content validation, the production build and a high-severity npm audit.

Run the full check before opening a pull request, even when you only changed text. Text is part of the build because posts are imported into the application.

## What a successful first session looks like

You should be able to do this:

1. Open the repository folder in VS Code.
2. Run `npm ci`.
3. Run `npm run validate` and see a successful build.
4. Run `npm run dev`.
5. Open the local URL.
6. Click Home, Our story, Start here and Library.
7. Open a post from the Library.
8. Resize the browser or use device emulation to check a narrow layout.
9. Stop the server with `Ctrl+C`.

If this sequence works, your environment is ready for normal maintenance.

## A word about the terminal

A terminal is a text-based way to give the computer instructions. A command normally has:

- a program name, such as `npm` or `git`;
- a subcommand, such as `run` or `status`; and
- optional arguments, such as a script name or file path.

For example, `npm run validate` means:

- start the `npm` program;
- ask it to run a script;
- choose the script named `validate` from `package.json`.

The terminal prints messages and an exit status. Exit status `0` means success. A non-zero status means that the command stopped with a problem. Read the first meaningful error rather than only the final line.

## Keep your environment clean

Do not create `.env` files with real credentials for this static site. The repository does not need runtime secrets. If another tool asks for credentials, follow the corporate secret-management process and never paste a secret into a source file, issue, pull request or chat.

Do not commit `node_modules/`, `dist/`, `.tmp/`, `.memories/` or local editor files. `.gitignore` is configured to exclude them, but confirm with `git status` before committing.
