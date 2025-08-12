"use client"

import { useEffect, useState } from 'react'
import { Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import ResultsCard from '@/components/results-card'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import Link from 'next/link'
import { useTheme } from 'next-themes'

export default function Home() {
  const [textInput, setTextInput] = useState('')
  const [url, setUrl] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelName, setmodelName] = useState('')
  const { theme } = useTheme()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // empty the result
    setResult('');
    setLoading(true);
    setUrl('');

    // trim the input
    const trimmedInput = textInput.trim();

    // check if the input is empty
    if (!trimmedInput) {
      toast.error('Model name is required')
      setLoading(false);
      return;
    }

    // convert input to url
    const inputSplit = textInput.trim().split(':');
    
    // check if input is valid
    if (inputSplit.length !== 2) {
      toast.error('Use the format "model:tag" or "model:latest" if unsure')
      setLoading(false);
      return;
    }

    // Get model name from input
    const model_name = inputSplit[0];
    setmodelName(model_name);

    // Get tag from input
    const tag = inputSplit[1];

    // Fix for user models that are not in the 'library/' dir
    const basePath = model_name.includes('/')
    ? model_name               // user-namespaced model
    : `library/${model_name}`; // public library model

    // Build the manifest url
    const url = `https://registry.ollama.ai/v2/${basePath}/manifests/${tag}`
    setUrl(url)

    setLoading(true)

    // Save the model name to upstash db
    try {
      await fetch('/api/save-query', {
        method: 'POST',
        body: JSON.stringify({ query: textInput }),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    catch{
      console.log("failed to save model name to db!")
    }


    // Get the download links from proxy api
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      // Model links returned from ollama
      const data = await response.text()
      setResult(data)

    } catch (error) {
      toast.error('Error fetching data: Wrong model name?')
    } finally {
      setLoading(false)
    }
  }

  // Increment views in upstash db
  useEffect(() => {
    fetch('/api/page-load', {
      method: 'POST',
      body: null,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className='flex items-center gap-4'>

            <Link href={'/'}>
              {/* {choose favicon or favicon_dark based on theme} */}
              {
                theme === 'dark'
                  ? <img src="/favicon_dark.png" alt="Ollama Logo" width="25" height="25" />
                  : <img src="/favicon.png" alt="Ollama Logo" width="25" height="25" />
              }
            </Link>

            <h1 className="text-2xl font-bold text-foreground">
              <Link href={'/'}>Ollama Direct Downloader</Link>
            </h1>

          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <a
              href="https://github.com/Gholamrezadar/ollama-direct-downloader"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a model tag e.g. gemma2:2b"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Fetching...' : 'Extract'}
              </Button>
            </div>
          </form>

          {!loading && !result &&
            <div className='text-slate-600 text-sm w-full flex justify-center items-center'>
              Enter the name of the model you want to download and press enter
            </div>
          }
          {/* Show spinner while loading */}
          {loading && (
            <div className='flex justify-center items-center'>
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
              </div>
            </div>

          )}

          {/* Show result after loading */}
          {!loading && result && (
            <>
              <div className='text-slate-600 text-sm w-full flex justify-center items-center'>
                Please give <a href='https://github.com/Gholamrezadar/ollama-direct-downloader' className='text-cyan-500 underline mx-1'> this repo </a> a star if it helped you &lt;3
              </div>

              <ResultsCard model_name={modelName} result={result} url={url} />


              <div className='text-slate-600 text-sm'>
                Help:
                <br />
                Download the Manifest file and place it in a folder like <code className='dark:bg-slate-900 dark:text-slate-600 bg-blue-200 text-slate-600'>$OLLAMA_MODELS\manifests\registry.ollama.ai\library\gemma2</code>
                <br />
                <br />
                Download the blobs and place them in a folder like <code className='dark:bg-slate-900 dark:text-slate-600 bg-blue-200'>$OLLAMA_MODELS\blobs</code>
                <br />
                <br />
                - The server might change the name of each file, copy the names from the box above and rename the files accordingly
                <br />
                <br />
                - To make sure about the manifest and blobs directories, download a small model using ollama cli directly as these directories can change and get weird!
                <br />
                <br />
                Made by <a href='https://github.com/Gholamrezadar/' className='text-cyan-500 underline mx-1'>Gholamreza Dar</a>
              </div>
            </>
          )}
        </div>
      </main>
      <Toaster richColors />
    </div>
  )
}
