import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {QMakeParser} from './qmakeParser';

export class QMakeProjectManager {
  private projects: Map<string, QMakeProject> = new Map();
  private parser = new QMakeParser();

  async detectProjects() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const proFiles =
        await vscode.workspace.findFiles('**/*.pro', '**/node_modules/**');

    for (const proFile of proFiles) {
      const project = await this.parseProject(proFile);
      if (project) {
        this.projects.set(proFile.fsPath, project);
      }
    }

    this.updateStatusBar();
  }

  private async parseProject(proFile: vscode.Uri): Promise<QMakeProject|null> {
    try {
      const content = await vscode.workspace.fs.readFile(proFile);
      const parsed = this.parser.parse(content.toString());

      return {
        path: proFile.fsPath,
        name: path.basename(proFile.fsPath, '.pro'),
        config: parsed,
        sources: parsed.SOURCES || [],
        headers: parsed.HEADERS || [],
        forms: parsed.FORMS || [],
        resources: parsed.RESOURCES || []
      };
    } catch (error) {
      vscode.window.showErrorMessage(
          `Failed to parse ${proFile.fsPath}: ${error}`);
      return null;
    }
  }

  private updateStatusBar() {
    const projectCount = this.projects.size;
    if (projectCount > 0) {
      vscode.window.setStatusBarMessage(
          `Qt5: ${projectCount} project(s) detected`);
    }
  }

  getProjects(): QMakeProject[] {
    return Array.from(this.projects.values());
  }
}

export interface QMakeProject {
  path: string;
  name: string;
  config: any;
  sources: string[];
  headers: string[];
  forms: string[];
  resources: string[];
}