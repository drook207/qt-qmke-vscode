# Qt5 QMake Support for VS Code

A comprehensive Visual Studio Code extension that provides complete Qt5 development support for QMake-based projects, bringing the same seamless experience as modern Qt6 extensions to Qt5 development.

## Features

### 🔧 **QMake Project Management**

- Automatic detection and parsing of `.pro` and `.pri` files
- Intelligent project structure analysis
- Multi-project workspace support
- Real-time project file validation

### 🏗️ **Build System Integration**

- One-click build, clean, and configure commands
- Integrated output panel with build progress
- Automatic build directory management
- Cross-platform build support (Linux, macOS, Windows)

### 🧠 **IntelliSense & Code Completion**

- Automatic `compile_commands.json` generation
- Full C++ IntelliSense support with Qt5 headers
- Qt-specific include path detection
- Seamless integration with C/C++ extension

### 📝 **Syntax Highlighting**

- Complete QMake syntax highlighting for `.pro` files
- Keyword recognition and variable highlighting
- Comment and string literal support
- Error detection and validation

### 🎨 **Qt5-Specific Features**

- Qt5 module detection and configuration
- MOC (Meta-Object Compiler) integration
- Resource file (`.qrc`) support
- UI file (`.ui`) recognition

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Qt5 QMake Support"
4. Click Install

### From VSIX Package

1. Download the `.vsix` file from releases
2. Open VS Code
3. Run `Extensions: Install from VSIX...` command
4. Select the downloaded file

## Prerequisites

### Required Software

- **Qt5 SDK** - Qt5 development environment
- **QMake** - Qt5 build system (usually included with Qt5)
- **Build Tools** - Make (Linux/macOS) or MSBuild/MinGW (Windows)
- **Bear** - For compile database generation (recommended)

### Installation Commands

#### Ubuntu/Debian

```bash
sudo apt install qt5-default qttools5-dev-tools build-essential bear
```

#### macOS

```bash
brew install qt5 bear
```

#### Windows

Install Qt5 from [Qt Official Website](https://www.qt.io/download-qt-installer) and ensure QMake is in your PATH.

## Quick Start

1. **Open a Qt5 Project**
   - Open a folder containing `.pro` files
   - The extension will automatically detect Qt5 projects

2. **Configure Your Project**
   - Press `Ctrl+Shift+P` and run `Qt5: Configure Qt5 Project`
   - Or use the status bar Qt5 button

3. **Build Your Project**
   - Press `Ctrl+Shift+P` and run `Qt5: Build Qt5 Project`
   - Or use `Ctrl+Shift+B` for the default build task

4. **Enable IntelliSense**
   - Run `Qt5: Generate Compile Commands` to create `compile_commands.json`
   - IntelliSense will automatically activate with Qt5 headers

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `Qt5: Build Qt5 Project` | Build the current Qt5 project | `Ctrl+Shift+B` |
| `Qt5: Clean Qt5 Project` | Clean build artifacts | - |
| `Qt5: Configure Qt5 Project` | Run qmake to configure project | - |
| `Qt5: Generate Compile Commands` | Generate compile_commands.json for IntelliSense | - |

## Configuration

### Extension Settings

Access settings via `File > Preferences > Settings` and search for "Qt5":

```json
{
  // Path to qmake executable
  "qt5.qmakePath": "qmake",
  
  // Build directory relative to workspace
  "qt5.buildDirectory": "build",
  
  // Automatically generate compile_commands.json
  "qt5.autoGenerateCompileCommands": true,
  
  // Qt5 installation directory
  "qt5.qtInstallPath": "/usr/lib/qt5",
  
  // Additional qmake arguments
  "qt5.qmakeArgs": [],
  
  // Make command for building
  "qt5.makeCommand": "make",
  
  // Number of parallel build jobs
  "qt5.buildJobs": 4
}
```

### Workspace Configuration

The extension automatically creates `.vscode/` configuration files:

#### `.vscode/c_cpp_properties.json`

```json
{
  "configurations": [
    {
      "name": "Qt5",
      "includePath": [
        "${workspaceFolder}/**",
        "${env:QTDIR}/include/**"
      ],
      "defines": [
        "QT_CORE_LIB",
        "QT_GUI_LIB",
        "QT_WIDGETS_LIB"
      ],
      "compilerPath": "/usr/bin/g++",
      "cStandard": "c11",
      "cppStandard": "c++17"
    }
  ]
}
```

#### `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Qt5: Build",
      "type": "shell",
      "command": "make",
      "options": {
        "cwd": "${workspaceFolder}/build"
      },
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

## Project Structure Support

The extension recognizes and supports Qt5 project files:

### Supported Files

- **`.pro`** - QMake project files
- **`.pri`** - QMake include files
- **`.cpp/.cxx/.cc`** - C++ source files
- **`.h/.hpp`** - C++ header files
- **`.ui`** - Qt Designer UI files
- **`.qrc`** - Qt Resource files
- **`.ts`** - Qt Translation files

### Sample Project Structure

```
my-qt5-app/
├── src/
│   ├── main.cpp
│   ├── mainwindow.cpp
│   └── mainwindow.h
├── ui/
│   └── mainwindow.ui
├── resources/
│   ├── icons.qrc
│   └── images/
├── translations/
│   └── app_en.ts
├── my-qt5-app.pro
└── README.md
```

## Troubleshooting

### QMake Not Found

```bash
# Check if qmake is in PATH
which qmake

# Add Qt5 to PATH (Linux/macOS)
export PATH=/usr/lib/qt5/bin:$PATH

# Set QTDIR environment variable
export QTDIR=/usr/lib/qt5
```

### Build Errors

1. **Check Qt5 Installation**

   ```bash
   qmake --version
   ```

2. **Verify Build Tools**

   ```bash
   make --version  # Linux/macOS
   ```

3. **Check Extension Output**
   - Open `View > Output`
   - Select "Qt5 Build" from dropdown

### IntelliSense Not Working

1. **Generate Compile Commands**
   - Run `Qt5: Generate Compile Commands`
   - Ensure `compile_commands.json` is created

2. **Install Bear (if not present)**

   ```bash
   # Ubuntu/Debian
   sudo apt install bear
   
   # macOS
   brew install bear
   ```

3. **Check C++ Extension**
   - Ensure C/C++ extension is installed and enabled
   - Verify `c_cpp_properties.json` is configured

### Common Issues

#### "Bear command not found"

Install Bear or use alternative:

```bash
pip install compiledb
```

#### "Project not detected"

Ensure your `.pro` file is valid:

```qmake
QT += core widgets
CONFIG += c++17
TARGET = MyApp
TEMPLATE = app
SOURCES += main.cpp
```

#### "Build directory not found"

The extension creates a `build/` directory automatically. If issues persist:

1. Check workspace permissions
2. Verify `qt5.buildDirectory` setting
3. Manually create the build directory

## Advanced Usage

### Custom Build Configurations

```qmake
# .pro file with custom configurations
CONFIG += debug_and_release
CONFIG(debug, debug|release) {
    TARGET = myapp_debug
    DEFINES += DEBUG_BUILD
}
CONFIG(release, debug|release) {
    TARGET = myapp_release
    DEFINES += RELEASE_BUILD
}
```

### Multiple Projects

For workspaces with multiple Qt5 projects:

1. Each `.pro` file is detected automatically
2. Use `Qt5: Select Active Project` to switch between projects
3. Build commands apply to the currently active project

### Integration with Other Extensions

- **CMake Tools** - For hybrid CMake/QMake projects
- **Qt Designer** - For UI file editing
- **Debugger** - Automatic debug configuration generation

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-username/qt5-qmake-vscode.git
cd qt5-qmake-vscode
npm install
npm run compile
```

### Testing

```bash
npm test
```

### Building VSIX

```bash
npm install -g vsce
vsce package
```

## License

This extension is licensed under the [MIT License](LICENSE).

## Support

### Documentation

- [Qt5 Documentation](https://doc.qt.io/qt-5/)
- [QMake Manual](https://doc.qt.io/qt-5/qmake-manual.html)
- [VS Code Extension API](https://code.visualstudio.com/api)

### Community

- [GitHub Issues](https://github.com/your-username/qt5-qmake-vscode/issues)
- [Discussions](https://github.com/your-username/qt5-qmake-vscode/discussions)

### Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Enjoy productive Qt5 development with VS Code! 🚀**
