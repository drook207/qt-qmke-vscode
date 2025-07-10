import {spawn} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export class QMakeIntelliSense {
  async generateCompileCommands() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const config = vscode.workspace.getConfiguration('qt5');
    const buildDir = path.join(
        workspaceFolder.uri.fsPath, config.get('buildDirectory', 'build'));

    try {
      // Use bear to generate compile_commands.json
      await this.runBear(buildDir);

      // Copy to workspace root for C++ extension
      const sourcePath = path.join(buildDir, 'compile_commands.json');
      const targetPath =
          path.join(workspaceFolder.uri.fsPath, 'compile_commands.json');

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        vscode.window.showInformationMessage(
            'Compile commands generated successfully!');
      }
    } catch (error) {
      vscode.window.showErrorMessage(
          `Failed to generate compile commands: ${error}`);
    }
  }

  private runBear(buildDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const process =
          spawn('bear', ['--', 'make'], {cwd: buildDir, shell: true});

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Bear failed with code ${code}`));
        }
      });
    });
  }

  async setupCppProperties() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const cppProperties = {
      configurations: [{
        name: 'Qt5',
        includePath: ['${workspaceFolder}/**', '${env:QTDIR}/include/**'],
        defines: ['QT_CORE_LIB', 'QT_GUI_LIB', 'QT_WIDGETS_LIB'],
        compilerPath: '/usr/bin/g++',
        cStandard: 'c11',
        cppStandard: 'c++17',
        intelliSenseMode: 'linux-gcc-x64'
      }],
      version: 4
    };

    const vscodeDir = path.join(workspaceFolder.uri.fsPath, '.vscode');
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir);
    }

    const cppPropertiesPath = path.join(vscodeDir, 'c_cpp_properties.json');
    fs.writeFileSync(cppPropertiesPath, JSON.stringify(cppProperties, null, 2));
  }
}