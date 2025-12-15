"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export function TaskInfo() {
  const tasks = [
    {
      name: "Bengali Document Classification",
      description:
        "A Bengali news classification benchmark consisting of articles categorized into 13 topical domains. The task evaluates document-level semantic understanding in Bengali news text, with accuracy as the main evaluation metric.",
      citation:
        "Akash, Abu Ubaida, Mir Tafseer Nayeem, Faisal Tareque Shohan, and Tanvir Islam. 2023. Shironaam: Bengali News Headline Generation using Auxiliary Information. In Proceedings of the 17th Conference of the European Chapter of the Association for Computational Linguistics (EACL).",
    },
    
    {
      name: "Bengali Hate Speech Detection",
      description:
        "A Bengali-language hate speech classification benchmark with expert-annotated news articles. The task measures a model’s ability to identify hate and toxic content in under-resourced Bengali text, evaluated using F1 score.",
      citation:
        "Karim, Md. Rezaul, Bharathi Raja Chakravarti, John P. McCrae, and Michael Cochez. 2020. Classification Benchmarks for Under-resourced Bengali Language. In Proceedings of the IEEE International Conference on Data Science and Advanced Analytics (DSAA).",
    },
    
    {
      name: "Bengali Sentiment Analysis",
      description:
        "A sentiment classification benchmark consisting of Bengali user-generated reviews annotated for sentiment polarity. The task evaluates sentiment understanding in low-resource Bengali text using F1 score.",
      citation:
        "Sazzed, Salim. 2020. Cross-lingual Sentiment Classification in Low-resource Bengali Language. In Proceedings of the Sixth Workshop on Noisy User-generated Text (W-NUT).",
    },
    
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Task Descriptions & Citations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tasks.map((task, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-semibold text-lg">{task.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
              <p className="text-xs text-muted-foreground italic">{task.citation}</p>
            </div>
          ))}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              All evaluations follow the MTEB (Massive Text Embedding Benchmark) framework. Scores represent performance
              on test splits. Higher scores indicate better performance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
