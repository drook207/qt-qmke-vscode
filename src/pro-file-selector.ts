import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function registerProFileSelector(context: vscode.ExtensionContext) {
    let selectProFileDisposable = vscode.commands.registerCommand('qtQmakeTasks.selectProFile', async () => {
        // Get the current workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        // Find all .pro files in the workspace
        const proFiles = await vscode.workspace.findFiles('**/*.pro', '**/build/**');
        
        // If no .pro files found
        if (proFiles.length === 0) {
            vscode.window.showErrorMessage('No .pro files found in the workspace');
            return;
        }

        // Create a quick pick to select .pro file
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = proFiles.map(uri => ({
            label: path.basename(uri.fsPath),
            description: uri.fsPath,
            uri: uri
        }));
        
        quickPick.title = 'Select Root Qt Project File';
        quickPick.placeholder = 'Choose the main .pro file for your project';
        
        quickPick.onDidChangeSelection(selection => {
            if (selection[0]) {
                const selectedFile = (selection[0] as any).uri;
                
                // Save the selected .pro file path to workspace configuration
                vscode.workspace.getConfiguration('qtQmakeTasks').update(
                    'rootProFile', 
                    selectedFile.fsPath, 
                    vscode.ConfigurationTarget.Workspace
                );

                // Show a confirmation message
                vscode.window.showInformationMessage(
                    `Selected ${path.basename(selectedFile.fsPath)} as the root project file`
                );

                quickPick.hide();
            }
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    });

    context.subscriptions.push(selectProFileDisposable);
}

// Helper function to get the saved .pro file path
export function getRootProFile(): string | undefined {
    return vscode.workspace.getConfiguration('qtQmakeTasks').get('rootProFile');
}
