# Plotweave

**Topic in. Finished video out.** Plotweave researches, writes, voices, shoots and
edits a complete narrated video on your own computer: free on your GPU, or with your
own keys for premium models.

**Website:** https://tanzir71.github.io/plotweave-site/

This repository holds the Plotweave website (published with GitHub Pages) and the free
app's downloads.

## Download

Get the latest build from [Releases](../../releases/latest):

| File | What it is |
|---|---|
| `PlotweaveSetup-3.0.0.exe` | Windows installer. Installs for your user only, no admin rights needed. |
| `Plotweave-3.0.0-windows-portable.zip` | The same app without installing: unzip and run `Plotweave.exe`. |
| `SHA256SUMS.txt` | Checksums to confirm your download is intact. |

**These builds are not code-signed yet.** Windows SmartScreen may say "Windows protected
your PC". Choose **More info**, then **Run anyway**. To check a download first:

```powershell
Get-FileHash .\PlotweaveSetup-3.0.0.exe -Algorithm SHA256
```

and compare the result with `SHA256SUMS.txt`.

### Before you start

- **Windows 10 or 11.** A macOS build isn't available yet.
- **FFmpeg** must be installed and on your PATH (it isn't bundled yet). Plotweave's setup
  checklist tells you if it's missing.
- **A writing model:** the Claude CLI (`claude login`), an Anthropic API key, or a local
  model through Ollama or LM Studio. Choose it in Settings › Models and keys.
- An NVIDIA GPU is optional. Without one, Plotweave uses stock footage and still images
  with camera moves.

Your projects, settings and keys stay on your computer, in `%LOCALAPPDATA%\Plotweave`.
Uninstalling the app keeps them.

## The website

`index.html`, `compare/`, `credits.html` and `assets/` are the static marketing site
(plain HTML, CSS and a little JavaScript; fonts and images are self-hosted). Photos are
from Unsplash; see `credits.html`.

## Source code

The Plotweave app is free. Its source code is a separate paid product and is not in this
repository.

## Support

Plotweave is free and made by one person. If it helps you, you can
[buy me a coffee](https://buymeacoffee.com/tanzir).
