"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getImages(folderPath) {
    const files = [];
    const extensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
    function scanFolder(folder) {
        const items = fs.readdirSync(folder);
        for (const item of items) {
            const fullPath = path.join(folder, item);
            if (fs.statSync(fullPath).isDirectory()) {
                scanFolder(fullPath);
            }
            else if (extensions.includes(path.extname(item))) {
                files.push(fullPath);
            }
        }
    }
    scanFolder(folderPath);
    return files;
}
function isImageUsed(imagePath) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield vscode.workspace.findFiles("**/*.{js,ts,jsx,tsx,html,css,scss}", "**/node_modules/**");
        const workspaceFolder = ((_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0].uri.fsPath) || "";
        const relativePath = path.relative(workspaceFolder, imagePath);
        const imageName = path.basename(imagePath);
        const parentFolder = path.basename(path.dirname(imagePath));
        const regexPatterns = [
            new RegExp(`src=[\"\']/?${relativePath}[\"\']`, "i"),
            new RegExp(`src=[\"\']/?${parentFolder}/${imageName}[\"\']`, "i"),
            new RegExp(`src=[\"\']/?${imageName}[\"\']`, "i"),
        ];
        for (const file of files) {
            const content = (yield vscode.workspace.fs.readFile(file)).toString();
            for (const regex of regexPatterns) {
                if (regex.test(content)) {
                    return true;
                }
            }
        }
        return false;
    });
}
let currentDecorationProvider;
function highlightImages() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!vscode.workspace.workspaceFolders)
            return;
        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const images = getImages(workspaceFolder);
        const eventEmitter = new vscode.EventEmitter();
        const decorationProvider = {
            onDidChangeFileDecorations: eventEmitter.event,
            provideFileDecoration(uri) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!images.includes(uri.fsPath))
                        return undefined;
                    const used = yield isImageUsed(uri.fsPath);
                    return used
                        ? {
                            badge: "✔️",
                            tooltip: "Used asset",
                            color: new vscode.ThemeColor("gitDecoration.addedResourceForeground"),
                        }
                        : {
                            badge: "⚠️",
                            tooltip: "Unused asset",
                            color: new vscode.ThemeColor("gitDecoration.deletedResourceForeground"),
                        };
                });
            },
        };
        if (currentDecorationProvider)
            currentDecorationProvider.dispose();
        currentDecorationProvider =
            vscode.window.registerFileDecorationProvider(decorationProvider);
    });
}
function activate(context) {
    highlightImages();
    const watcher = vscode.workspace.createFileSystemWatcher("**/*");
    let debounceTimer;
    const handleChange = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => highlightImages(), 1000);
    };
    context.subscriptions.push(watcher.onDidChange(handleChange), watcher.onDidCreate(handleChange), watcher.onDidDelete(handleChange), watcher);
}
exports.activate = activate;
function deactivate() {
    if (currentDecorationProvider)
        currentDecorationProvider.dispose();
}
exports.deactivate = deactivate;
