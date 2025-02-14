# Unused Images Finder

![Unused Images Finder](https://img.shields.io/badge/VS%20Code-Extension-blue?style=flat&logo=visualstudiocode)

<!-- [![Version](https://img.shields.io/github/v/tag/@franciscoagustinr/ext-find-unused-imgs?label=version&style=flat)](https://github.com/@franciscoagustinr/ext-find-unused-imgs/releases)
[![License](https://img.shields.io/github/license/@franciscoagustinr/ext-find-unused-imgs?style=flat)](https://github.com/@franciscoagustinr/ext-find-unused-imgs/blob/main/LICENSE) -->

## Find and Manage Unused Images in Your VS Code Projects 🖼️🔍

This VS Code extension helps you find images that are **unused** in your project. With a quick and easy scan, it will highlight images that are not referenced anywhere in your codebase. This makes it easy to clean up and optimize your project by removing unnecessary image files.

---

### Features 🚀

- **Automatic Scan:** Scan your project files for unused image assets (.png, .jpg, .jpeg, .gif, .svg, .webp).
- **File Decoration:** Easily identify unused images in the **Explorer** with visual cues (✔️ for used images, ⚠️ for unused ones).
- **Cross-File Search:** It checks references in all your project files (`.js`, `.ts`, `.html`, `.css`, etc.).
- **Optimize Project:** Clean up unused images and reduce your project's size.

---

### Installation 🔧

1. **Install via VS Code Marketplace:**
   - Go to the [VS Code Marketplace](https://marketplace.visualstudio.com/) and search for **Unused Images Finder** or use the `@franciscoagustinr` publisher.
2. **Install from VSIX File:**
   - Download the `.vsix` file from the latest release.
   - Open VS Code, go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`).
   - Click on the three dots in the top right corner and select **Install from VSIX**.
   - Choose the downloaded `.vsix` file.

---

### Usage 🛠️

1. Once installed, open your project folder in **VS Code**.
2. Use the command **Find Unused Images** via the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`).
3. Your unused images will be highlighted in the Explorer panel:
   - **✔️** for images in use.
   - **⚠️** for images that are not referenced in any of your code files.
4. You can now review, remove, or refactor your image assets as needed!

---

### Supported File Types 📄

The extension scans for unused images in the following formats:

- **PNG** (.png)
- **JPG/JPEG** (.jpg, .jpeg)
- **GIF** (.gif)
- **SVG** (.svg)
- **WebP** (.webp)

It searches for image references in:

- **JavaScript/TypeScript** (`.js`, `.ts`, `.jsx`, `.tsx`)
- **HTML/CSS/SCSS** (`.html`, `.css`, `.scss`)

---

### Customization ⚙️

You can configure the extension to search specific file types or adjust how files are scanned. Check the settings in VS Code for any available options related to this extension.

---

### Contributing 🤝

Feel free to contribute! Open a pull request or file an issue on [GitHub](https://github.com/@franciscoagustinr/ext-find-unused-imgs).

---

### License 📜

This extension is licensed under the [MIT License](https://github.com/@franciscoagustinr/ext-find-unused-imgs/blob/main/LICENSE).

---

### Support 💬

If you have any questions or encounter issues, feel free to open an issue or contact me directly.

---

### About the Author 👨‍💻

Hi, I'm **Francisco Agustin**! I'm a software developer focused on building tools that improve productivity and code quality. You can find more of my projects on [GitHub](https://github.com/franciscoagustin).

---

Thank you for using **Unused Images Finder**! Enjoy a cleaner, more efficient codebase! ✨

---

### Screenshots 📸

#### Before (Unused Image):

<img src="https://github.com/franciscoagustinr/ext-find-unused-imgs/blob/main/images/unused-image.png" alt="Unused Image Example" style="max-width: 100%;">

#### After (Image Marked as Unused):

<img src="https://github.com/franciscoagustinr/ext-find-unused-imgs/blob/main/images/used-image.png" alt="Used Image Example" style="max-width: 100%;">
