import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// Función que busca imágenes en el proyecto
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

// Función que busca referencias a una imagen en archivos del proyecto
async function isImageUsed(imagePath: string): Promise<boolean> {
  const files = await vscode.workspace.findFiles(
    "**/*.{js,ts,jsx,tsx,html,css,scss}",
    "**/node_modules/**"
  );
  const imageName = path.basename(imagePath);

  for (const file of files) {
    const content = (await vscode.workspace.fs.readFile(file)).toString();
    if (content.includes(imageName)) {
      return true;
    }
  }
  return false;
}

// Resaltar imágenes en el Explorador de Archivos
async function highlightImages() {
  if (!vscode.workspace.workspaceFolders) return;

  const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const images = getImages(workspaceFolder);

  const decorations: vscode.FileDecorationProvider = {
    provideFileDecoration: async (uri) => {
      if (!images.includes(uri.fsPath)) return undefined;

      const used = await isImageUsed(uri.fsPath);
      return used
        ? {
            badge: "✔️",
            tooltip: "En uso",
            color: new vscode.ThemeColor(
              "gitDecoration.addedResourceForeground"
            ),
          }
        : {
            badge: "⚠️",
            tooltip: "No utilizada",
            color: new vscode.ThemeColor(
              "gitDecoration.deletedResourceForeground"
            ),
          };
    },
  };

  vscode.window.registerFileDecorationProvider(decorations);
  console.log("File decoration provider registered.");
  console.log("/images/unused-image.png.");
}

// Activar la extensión
export function activate(context: vscode.ExtensionContext) {
  console.log("Activating extension...");

  highlightImages();

  console.log("Extension activated.");
}

// Desactivar la extensión
export function deactivate() {}
