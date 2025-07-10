import {spawn} from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export class QMakeBuildSystem {
  private outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Qt5 Build');
  }

  async build() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const config = vscode.workspace.getConfiguration('qt5');
    const buildDir = path.join(
        workspaceFolder.uri.fsPath, config.get('buildDirectory', 'build'));

    this.outputChannel.show();
    this.outputChannel.appendLine('Building Qt5 project...');

    try {
      // Run qmake first
      await this.runCommand('qmake', ['..'], buildDir);

      // Then run make
      await this.runCommand('make', [], buildDir);

      this.outputChannel.appendLine('Build completed successfully!');
    } catch (error) {
      this.outputChannel.appendLine(`Build failed: ${error}`);
      vscode.window.showErrorMessage('Build failed. Check output for details.');
    }
  }

  async clean() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const config = vscode.workspace.getConfiguration('qt5');
    const buildDir = path.join(
        workspaceFolder.uri.fsPath, config.get('buildDirectory', 'build'));

    try {
      await this.runCommand('make', ['clean'], buildDir);
      this.outputChannel.appendLine('Clean completed successfully!');
    } catch (error) {
      this.outputChannel.appendLine(`Clean failed: ${error}`);
    }
  }

  async configure() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const config = vscode.workspace.getConfiguration('qt5');
    const buildDir = path.join(
        workspaceFolder.uri.fsPath, config.get('buildDirectory', 'build'));

    try {
      await this.runCommand('qmake', ['..'], buildDir);
      this.outputChannel.appendLine('Configure completed successfully!');
    } catch (error) {
      this.outputChannel.appendLine(`Configure failed: ${error}`);
    }
  }

  private runCommand(command: string, args: string[], cwd: string):
      Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {cwd, shell: true});

      process.stdout.on('data', (data) => {
        this.outputChannel.append(data.toString());
      });

      process.stderr.on('data', (data) => {
        this.outputChannel.append(data.toString());
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });
    });
  }
}