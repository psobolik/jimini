# Scaffold
```terminal
⫸ pnpm create tauri-app  
✔ Project name · jimini
✔ Identifier · psobolik.jimini.app
✔ Choose which language to use for your frontend · TypeScript / JavaScript - (pnpm, yarn, npm, bun)
✔ Choose your package manager · pnpm
✔ Choose your UI template · React - (https://react.dev/)
✔ Choose your UI flavor · TypeScript

Template created! To get started run:
  cd jimini
  pnpm install
  pnpm tauri dev
```

# Development
```
pnpm tauri dev
```
Runs `pnpm dev` to run the front end with Vite,
builds the Tauri executable into `target/debug`, and then runs it.

# Release
```
pnpm tauri build
```
Runs `tsc` to compile the TypeScript,
`pnpm build` to build the front end with Vite, and builds the Tauri executable into `target/release`.
Tauri also creates installers for the app into subdirectories of `target/release/bundle`.

On Windows, the executable is `.\src-tauri\target\release\jimini.exe`, and the installers are
* `.\src-tauri\target\release\bundle\msi\Jimini_`*version*`_x64_en-US.msi`
* `.\src-tauri\target\release\bundle\nsis\Jimini_`*version*`_x64-setup.exe`

On Linux, the executable is `./src-tauri/target/release/jimini`, and the installers are in
* `./src-tauri/target/release/bundle/deb/jimini_`*version*`_amd64.deb`
* `./src-tauri/target/release/bundle/rpm/jimini-`*version*`-1.x86_64.rpm`
* `.src-tauri/target/release/bundle/appimage/jimini_`*version*`_amd64.AppImage`

**Note:** Run the following command to set `jimini` as the default URL handler for the `gemini://` scheme on Linux:
```shell
$ xdg-mime default Jimini.desktop "x-scheme-handler/gemini"
```
On macOS, the executable is `./src-tauri/target/release/bundle/macos/Jimini.app`, and the installer is `./src-tauri/target/release/bundle/dmg/Jimini_`*version*`_x64.dmg`

# Version
* `./src-tauri/Cargo.toml`
* `./src-tauri/tauri.conf.json`
* `./package.json`

# Files
The application stores its settings and bookmarks files in a folder named `psobolik.jimini` in standard directories, following the conventions of the operating system the library is running on.

|                 | Windows                   | Linux                                   | macOS                               |
|-----------------|---------------------------|-----------------------------------------|-------------------------------------|
| `settings.json` | `{FOLDERID_LocalAppData}` | `\$XDG_CONFIG_HOME or $HOME/.config`    | `$HOME/Library/Application Support` |
| `bookmarks`     | `{FOLDERID_LocalAppData}` | `\$XDG_DATA_HOME or $HOME/.local/share` | `$HOME/Library/Application Support` |
