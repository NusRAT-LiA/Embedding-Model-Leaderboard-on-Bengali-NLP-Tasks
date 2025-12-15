"use client"

import type { ModelResults } from "@/lib/load-results"

interface Task {
  id: string
  name: string
}

interface LeaderboardModel {
  rank: number
  modelId: string
  modelName: string
  score: number | null
}

interface ModelPerformanceHeatmapProps {
  allResults: ModelResults
  tasks: Task[]
  rankedModels: LeaderboardModel[]
}

export function ModelPerformanceHeatmap({ allResults, tasks, rankedModels }: ModelPerformanceHeatmapProps) {
  const topModels = rankedModels.slice(0, 10)

  const getColorForScore = (score: number | null) => {
    if (score === null) return "bg-muted"
    if (score >= 0.8) return "bg-primary/60"
    if (score >= 0.7) return "bg-secondary/60"
    if (score >= 0.6) return "bg-accent/60"
    if (score >= 0.5) return "bg-chart-4/40"
    return "bg-chart-5/30"
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid gap-2">
          {/* Header */}
          <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-2 mb-2">
            <div className="text-sm font-medium text-muted-foreground">Model</div>
            {tasks.map((task) => (
              <div key={task.id} className="text-xs font-medium text-muted-foreground text-center">
                {task.name}
              </div>
            ))}
          </div>

          {/* Rows */}
          {topModels.map((model) => (
            <div key={model.modelId} className="grid grid-cols-[200px_repeat(3,1fr)] gap-2 items-center">
              <div className="text-sm truncate font-medium" title={model.modelName}>
                {model.modelName.split("/").pop()}
              </div>
              {tasks.map((task) => {
                const score = allResults[model.modelId]?.[task.id]?.scores?.test?.[0]?.main_score
                return (
                  <div
                    key={task.id}
                    className={`h-12 rounded-lg flex items-center justify-center text-xs font-medium ${getColorForScore(score || 0)} transition-colors`}
                    title={`${model.modelName} - ${task.name}: ${score?.toFixed(4) || "N/A"}`}
                  >
                    {score?.toFixed(3) || "—"}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">Score Range:</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/60"></div>
            <span>≥0.8</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-secondary/60"></div>
            <span>≥0.7</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/60"></div>
            <span>≥0.6</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-chart-4/40"></div>
            <span>≥0.5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-chart-5/30"></div>
            <span>&lt;0.5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
