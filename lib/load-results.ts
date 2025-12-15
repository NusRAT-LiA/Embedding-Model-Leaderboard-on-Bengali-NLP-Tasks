export interface TaskData {
  scores?: {
    test?: Array<{
      [metric: string]: number | null
    }>
  }
}

export interface ModelData {
  [taskId: string]: TaskData
}

export interface ModelResults {
  [modelId: string]: ModelData
}

const MODEL_FOLDERS = [
  "cohere__embed-multilingual-v3.0",
  "intfloat__multilingual-e5-base",
  "intfloat__multilingual-e5-large-instruct",
  "Lajavaness__bilingual-embedding-base",
  "Lajavaness__bilingual-embedding-large",
  "omarelshehy__arabic-english-sts-matryoshka",
  "OrdalieTech__Solon-embeddings-large-0.1",
  "Qwen__Qwen3-Embedding-0.6B",
  "Qwen__Qwen3-Embedding-4B",
  "Qwen__Qwen3-Embedding-8B",
  "sentence-transformers__LaBSE",
  "Snowflake__snowflake-arctic-embed-l-v2.0",
]

const TASK_FILES = [
  "BengaliDocumentClassification.v2.json",
  "BengaliHateSpeechClassification.v2.json",
  "BengaliSentimentAnalysis.v2.json",
]

export function getModelUrl(modelId: string): string {
  // Special-case Cohere multilingual embedding model to use its canonical Hugging Face URL
  // https://huggingface.co/Cohere/Cohere-embed-multilingual-v3.0
  if (modelId === "cohere__embed-multilingual-v3.0") {
    return "https://huggingface.co/Cohere/Cohere-embed-multilingual-v3.0"
  }

  // Default: convert "org__model-name" → "org/model-name"
  const modelPath = modelId.replace(/__/g, "/")
  return `https://huggingface.co/${modelPath}`
}

async function loadTaskData(modelId: string, taskFile: string): Promise<TaskData | null> {
  try {
    // Use a relative URL so it works both on localhost (/) and GitHub Pages subpaths (/repo-name/)
    const response = await fetch(`results_bengali/${modelId}/${taskFile}`)
    if (!response.ok) return null

    let text = await response.text()

    // Sanitize JSON:
    // - Replace NaN (not valid JSON) with null
    // - Remove trailing commas before } or ] which can appear in some result files
    text = text
      .replace(/\bNaN\b/g, "null")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")

    const data = JSON.parse(text)
    return data
  } catch (error) {
    console.warn(`Failed to load ${modelId}/${taskFile}:`, error)
    return null
  }
}

export async function loadAllResults(): Promise<ModelResults> {
  const results: ModelResults = {}

  for (const modelId of MODEL_FOLDERS) {
    results[modelId] = {}

    for (const taskFile of TASK_FILES) {
      const taskId = taskFile.replace(".json", "")
      const data = await loadTaskData(modelId, taskFile)

      if (data) {
        results[modelId][taskId] = data
      }
    }
  }

  return results
}
