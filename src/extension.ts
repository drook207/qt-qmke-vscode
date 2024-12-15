import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { registerProFileSelector, getRootProFile } from './pro-file-selector';

export async function activate(context: vscode.ExtensionContext) {





    // Register the new Pro File Selector command
    registerProFileSelector(context);

    const proFile = getRootProFile();

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }

    let targetName;
    if (proFile !== undefined) {
        //Get target name from .pro file 
        targetName = getProjectTargetName(proFile);
        if (!targetName) {
            vscode.window.showErrorMessage('No target found');
            return;
        }
    }

    let execPath: string;
    if (targetName !== undefined && targetName !== null) {
        execPath = path.join(workspaceFolder.uri.fsPath, 'build', targetName);
    }

    // Modify existing commands to use the saved .pro file path
    let buildDisposable = vscode.commands.registerCommand('qtQmakeTasks.build', () => {
        const rootProFile = getRootProFile();
        if (!rootProFile) {
            vscode.window.showErrorMessage('Please select a root .pro file first using "Qt Qmake: Select Root Project File"');
            return;
        }

        const terminal = vscode.window.createTerminal('Qt Qmake Build');
        // Use the directory of the .pro file as the working directory
        terminal.sendText(`cd "${path.dirname(rootProFile)}" && qmake && make`);
        terminal.show();
    });

    // Build Project Command

    // Clean Project Command
    let cleanDisposable = vscode.commands.registerCommand('qtQmakeTasks.clean', () => {
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const terminal = vscode.window.createTerminal('Qt Qmake Clean');
        terminal.sendText('make clean');
        terminal.show();
    });

    // Run Project Command
    let runDisposable = vscode.commands.registerCommand('qtQmakeTasks.run', () => {
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const terminal = vscode.window.createTerminal('Qt Qmake Run');
        terminal.sendText(execPath);
        terminal.show();
    });

    // Debug Project Command
    let debugDisposable = vscode.commands.registerCommand('qtQmakeTasks.debug', () => {
        vscode.debug.startDebugging(
            vscode.workspace.workspaceFolders?.[0],
            {
                type: 'cppdbg',
                request: 'launch',
                name: 'Qt Qmake Debug',
                program: execPath,
                cwd: '${workspaceFolder}'
            }
        );
    });

    // Install Project Command
    let installDisposable = vscode.commands.registerCommand('qtQmakeTasks.install', () => {
        const terminal = vscode.window.createTerminal('Qt Qmake Install');
        terminal.sendText('make install');
        terminal.show();
    });

    // Generate Compile Commands for Clangd
    let compileCommandsDisposable = vscode.commands.registerCommand('qtQmakeTasks.generateCompileCommands', () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const terminal = vscode.window.createTerminal('Qt Qmake Compile Commands');
        const rootProFile = getRootProFile();
        if (!rootProFile) {
            vscode.window.showErrorMessage('Please select a root .pro file first using "Qt Qmake: Select Root Project File"');
            return;
        }
        terminal.sendText(`cd "${path.dirname(rootProFile)}" && qmake`);
        terminal.sendText('make clean');
        terminal.sendText('compiledb make');
        terminal.show();

        // Copy compile_commands.json to workspace root if it exists in build directory
        const buildPath = path.join(workspaceFolder.uri.fsPath, 'build');
        const compileCommandsPath = path.join(buildPath, 'compile_commands.json');
        const destPath = path.join(workspaceFolder.uri.fsPath, 'compile_commands.json');

        setTimeout(() => {
            if (fs.existsSync(compileCommandsPath)) {
                fs.copyFileSync(compileCommandsPath, destPath);
                vscode.window.showInformationMessage('Compile commands generated successfully');
            } else {
                vscode.window.showWarningMessage('Could not generate compile commands');
            }
        }, 0xFFFFFF); // Wait a bit for compilation to complete
    });

    // Add disposables to context
    context.subscriptions.push(
        buildDisposable,
        cleanDisposable,
        runDisposable,
        debugDisposable,
        installDisposable,
        compileCommandsDisposable
    );
}

export function deactivate() { }

export function parseProFileTargetName(proFilePath: string): string | null {
    try {
        // Read the .pro file contents
        const fileContents = fs.readFileSync(proFilePath, 'utf-8');

        // Regular expressions to match different target declarations
        const targetPatterns = [
            // Match TARGET = something
            /TARGET\s*=\s*(\w+)/,

            // Match TEMPLATE = app and look for the first non-empty, non-comment line after
            /TEMPLATE\s*=\s*app[\s\S]*?(\w+)/,

            // Extract first non-empty, non-comment filename without extension
            /[^#\n]*?([a-zA-Z_]\w*)\.[a-zA-Z]+\s*$/m
        ];

        // Try each pattern
        for (const pattern of targetPatterns) {
            const match = fileContents.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        // Fallback: use .pro filename without extension
        return path.basename(proFilePath, '.pro');
    } catch (error) {
        console.error('Error parsing .pro file:', error);
        return null;
    }
}

// Example usage in extension context
function getProjectTargetName(proFile: string): string | null {



    return parseProFileTargetName(proFile);



}