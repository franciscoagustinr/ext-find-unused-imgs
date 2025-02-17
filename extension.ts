import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

function getImages(folderPath: string): string[] {
  const files: string[] = [];
  const extensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

  function scanFolder(folder: string) {
    const items = fs.readdirSync(folder);
    for (const item of items) {
      const fullPath = path.join(folder, item);
      if (fs.statSync(fullPath).isDirectory()) {
        scanFolder(fullPath);
      } else if (extensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }

  scanFolder(folderPath);
  return files;
}

async function isImageUsed(imagePath: string): Promise<boolean> {
  const files = await vscode.workspace.findFiles(
    "**/*.{js,ts,jsx,tsx,html,css,scss}",
    "**/node_modules/**"
  );
  const workspaceFolder =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
  const relativePath = path.relative(workspaceFolder, imagePath);
  const imageName = path.basename(imagePath);
  const parentFolder = path.basename(path.dirname(imagePath));

  const regexPatterns = [
    new RegExp(`src=[\"\']/?${relativePath}[\"\']`, "i"),
    new RegExp(`src=[\"\']/?${parentFolder}/${imageName}[\"\']`, "i"),
    new RegExp(`src=[\"\']/?${imageName}[\"\']`, "i"),
  ];

  for (const file of files) {
    const content = (await vscode.workspace.fs.readFile(file)).toString();
    for (const regex of regexPatterns) {
      if (regex.test(content)) {
        return true;
      }
    }
  }
  return false;
}

let currentDecorationProvider: vscode.Disposable | undefined;

async function highlightImages() {
  if (!vscode.workspace.workspaceFolders) return;
  const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const images = getImages(workspaceFolder);
  const eventEmitter = new vscode.EventEmitter<vscode.Uri | undefined>();

  const decorationProvider: vscode.FileDecorationProvider = {
    onDidChangeFileDecorations: eventEmitter.event,
    async provideFileDecoration(uri: vscode.Uri) {
      if (!images.includes(uri.fsPath)) return undefined;
      const used = await isImageUsed(uri.fsPath);
      return used
        ? {
            badge: "✔️",
            tooltip: "Used asset",
            color: new vscode.ThemeColor(
              "gitDecoration.addedResourceForeground"
            ),
          }
        : {
            badge: "⚠️",
            tooltip: "Unused asset",
            color: new vscode.ThemeColor(
              "gitDecoration.deletedResourceForeground"
            ),
          };
    },
  };

  if (currentDecorationProvider) currentDecorationProvider.dispose();
  currentDecorationProvider =
    vscode.window.registerFileDecorationProvider(decorationProvider);
}

export function activate(context: vscode.ExtensionContext) {
  highlightImages();
  const watcher = vscode.workspace.createFileSystemWatcher("**/*");
  let debounceTimer: NodeJS.Timeout;
  const handleChange = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => highlightImages(), 1000);
  };
  context.subscriptions.push(
    watcher.onDidChange(handleChange),
    watcher.onDidCreate(handleChange),
    watcher.onDidDelete(handleChange),
    watcher
  );
}

export function deactivate() {
  if (currentDecorationProvider) currentDecorationProvider.dispose();
}
