# Ollama Direct Downloader

<p align="center">
  <img src="public/favicon_dark.png" alt="Ollama Logo" width="100" />
</p>

Downloading ollama models using `ollama pull model_name:tag` can be very slow and unreliable sometimes and in some regions. With this tool, you can get the direct download links for ollama models.

## How to use

1. Go to the [Ollama Direct Downloader](https://ollama-direct-downloader.vercel.app/) website.
2. Enter the model name and tag in the search bar. (e.g. `gemma2:2b`)
3. Click the "Extract" button.
4. Download the manifest file and place it in a folder like `$OLLAMA_MODELS\manifests\registry.ollama.ai\library\gemma2`
5. Download the blobs and place them in a folder like `$OLLAMA_MODELS\blobs`

NOTE: The server might change the name of each file, copy the names from the box above and rename the files accordingly.

## Screenshots

![Screenshot 1](images/demo_dark.png)

![Screenshot 2](images/demo_light.png)

## Stack

- React
- Next.js
- Tailwind CSS
- Vercel (CORS proxy api)

## License

This project is licensed under the MIT License.

By Gholamreza Dar 2025
