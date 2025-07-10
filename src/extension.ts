import * as vscode from 'vscode';

import {QMakeBuildSystem} from './buildSystem';
import {QMakeIntelliSense} from './intellisense';
import {QMakeProjectManager} from './qmakeProject';

export function activate(context: vscode.ExtensionContext) {
  const projectManager = new QMakeProjectManager();
  const buildSystem = new QMakeBuildSystem();
  const intellisense = new QMakeIntelliSense();

  // Register commands
  const buildCommand = vscode.commands.registerCommand('qt5.build', () => {
    buildSystem.build();
  });

  const cleanCommand = vscode.commands.registerCommand('qt5.clean', () => {
    buildSystem.clean();
  });

  const configureCommand =
      vscode.commands.registerCommand('qt5.configure', () => {
        buildSystem.configure();
      });

  const generateCompileCommandsCommand =
      vscode.commands.registerCommand('qt5.generateCompileCommands', () => {
        intellisense.generateCompileCommands();
      });

  // Auto-detect Qt5 projects
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.pro');
  watcher.onDidCreate(() => projectManager.detectProjects());
  watcher.onDidChange(() => projectManager.detectProjects());

  // Initialize project detection
  projectManager.detectProjects();

  context.subscriptions.push(
      buildCommand, cleanCommand, configureCommand,
      generateCompileCommandsCommand, watcher);
}

export function deactivate() {}