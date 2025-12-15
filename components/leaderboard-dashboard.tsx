"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, TrendingUp, Award, Database, X } from "lucide-react"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { MetricChart } from "@/components/metric-chart"
import { ModelDetailPanel } from "@/components/model-detail-panel"
import { TaskInfo } from "@/components/task-info"
import { DistributionChart } from "@/components/distribution-chart"
import { ModelPerformanceHeatmap } from "@/components/model-performance-heatmap"
import { loadAllResults, type ModelResults } from "@/lib/load-results"

export function LeaderboardDashboard() {
  const [allResults, setAllResults] = useState<ModelResults>({})
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<string>("BengaliDocumentClassification.v2")
  const [selectedMetric, setSelectedMetric] = useState<string>("main_score")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const tasks = [
    { id: "BengaliDocumentClassification.v2", name: "Document Classification" },
    { id: "BengaliHateSpeechClassification.v2", name: "Hate Speech Detection" },
    { id: "BengaliSentimentAnalysis.v2", name: "Sentiment Analysis" },
  ]

  const availableMetrics = useMemo(() => {
    const metrics = new Set<string>()
    Object.values(allResults).forEach((modelData) => {
      const taskData = modelData[selectedTask]
      if (taskData?.scores?.test?.[0]) {
        Object.keys(taskData.scores.test[0]).forEach((key) => metrics.add(key))
      }
    })
    return Array.from(metrics).sort()
  }, [allResults, selectedTask])

  useEffect(() => {
    loadAllResults().then((results) => {
      setAllResults(results)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (availableMetrics.length > 0 && !availableMetrics.includes(selectedMetric)) {
      setSelectedMetric(availableMetrics[0] || "main_score")
    }
  }, [availableMetrics, selectedMetric])

  const rankedModels = useMemo(() => {
    const models = Object.entries(allResults)
      .map(([modelId, data]) => {
        const taskData = data[selectedTask]
        const score = taskData?.scores?.test?.[0]?.[selectedMetric]
        return {
          modelId,
          modelName: modelId.replace(/__/g, "/"),
          score: typeof score === "number" ? score : null,
          taskData,
        }
      })
      .filter((m) => m.score !== null)
      .sort((a, b) => {
        if (sortOrder === "desc") {
          return (b.score || 0) - (a.score || 0)
        }
        return (a.score || 0) - (b.score || 0)
      })

    return models.map((m, idx) => ({ ...m, rank: idx + 1 }))
  }, [allResults, selectedTask, selectedMetric, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
  }

  const currentTask = tasks.find((t) => t.id === selectedTask)
  const selectedModelData = selectedModel ? allResults[selectedModel] : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Database className="w-12 h-12 mx-auto animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading evaluation results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-primary" />
            <h1 className="text-4xl font-semibold text-balance tracking-tight">Embedding Model Leaderboard on Bengali NLP Tasks</h1>
          </div>
          <p className="text-base text-muted-foreground text-pretty">
            Compare and analyze embedding model performance across Bengali NLP tasks
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task</label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Metric</label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMetrics.map((metric) => (
                      <SelectItem key={metric} value={metric}>
                        {metric.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sort Order</label>
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={toggleSortOrder}>
                  {sortOrder === "desc" ? (
                    <>
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Descending (Best First)
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Ascending (Worst First)
                    </>
                  )}
                </Button>
              </div>
            </div>

            {selectedModel && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtered:</span>
                <Badge variant="secondary" className="gap-1">
                  {selectedModel.replace(/__/g, "/")}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedModel(null)} />
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-foreground/70">Total Models</CardDescription>
              <CardTitle className="text-4xl font-semibold">{rankedModels.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-foreground/70">Best Score</CardDescription>
              <CardTitle className="text-4xl font-semibold">{rankedModels[0]?.score?.toFixed(4) || "N/A"}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-foreground/70">Average Score</CardDescription>
              <CardTitle className="text-4xl font-semibold">
                {(rankedModels.reduce((sum, m) => sum + (m.score || 0), 0) / rankedModels.length).toFixed(4)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Leaderboard</CardTitle>
            <CardDescription>
              {currentTask?.name} - Ranked by {selectedMetric.replace(/_/g, " ")}. Click on a Ranks to view details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeaderboardTable
              models={rankedModels}
              metric={selectedMetric}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </CardContent>
        </Card>

      

        {/* Model Detail Panel */}
        {selectedModel && selectedModelData && (
          <Card className="mb-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Model Details</CardTitle>
              <CardDescription>{selectedModel.replace(/__/g, "/")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ModelDetailPanel modelId={selectedModel} modelData={selectedModelData} tasks={tasks} />
            </CardContent>
          </Card>
        )}

        {/* Distribution Chart */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <TrendingUp className="w-5 h-5 text-primary" />
              Score Distribution
            </CardTitle>
            <CardDescription>
              The distribution of {selectedMetric.replace(/_/g, " ")} across all models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionChart data={rankedModels} metric={selectedMetric} />
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <TrendingUp className="w-5 h-5 text-secondary" />
              {selectedMetric.replace(/_/g, " ")} Comparison
            </CardTitle>
            <CardDescription>{currentTask?.name} - Compare all models</CardDescription>
          </CardHeader>
          <CardContent>
            <MetricChart
              data={rankedModels}
              metric={selectedMetric}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Performance Heatmap</CardTitle>
            <CardDescription>Model performance across all tasks and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ModelPerformanceHeatmap allResults={allResults} tasks={tasks} rankedModels={rankedModels} />
          </CardContent>
        </Card>

        
        

        {/* Task Information */}
        <TaskInfo />
      </div>
    </div>
  )
}
