"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import { getModelUrl } from "@/lib/load-results"

interface LeaderboardModel {
  rank: number
  modelId: string
  modelName: string
  score: number | null
  taskData: any
}

interface LeaderboardTableProps {
  models: LeaderboardModel[]
  metric: string
  selectedModel: string | null
  onModelSelect: (modelId: string | null) => void
}

export function LeaderboardTable({ models, metric, selectedModel, onModelSelect }: LeaderboardTableProps) {
  const [sortMetric, setSortMetric] = useState<string>(metric)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const availableMetrics = useMemo(() => {
    if (models.length === 0) return []
    const firstModel = models[0]
    const scores = firstModel.taskData?.scores?.test?.[0]
    return scores ? Object.keys(scores) : []
  }, [models])

  const sortedModels = useMemo(() => {
    return [...models]
      .sort((a, b) => {
        const scoreA = a.taskData?.scores?.test?.[0]?.[sortMetric]
        const scoreB = b.taskData?.scores?.test?.[0]?.[sortMetric]

        const valA = typeof scoreA === "number" ? scoreA : Number.NEGATIVE_INFINITY
        const valB = typeof scoreB === "number" ? scoreB : Number.NEGATIVE_INFINITY

        if (sortOrder === "desc") {
          return valB - valA
        }
        return valA - valB
      })
      .map((m, idx) => ({ ...m, rank: idx + 1 }))
  }, [models, sortMetric, sortOrder])

  const handleMetricSort = (metricName: string) => {
    if (sortMetric === metricName) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
    } else {
      setSortMetric(metricName)
      setSortOrder("desc")
    }
  }

  const handleRowClick = (modelId: string) => {
    if (selectedModel === modelId) {
      onModelSelect(null)
    } else {
      onModelSelect(modelId)
    }
  }

  const handleModelClick = (e: React.MouseEvent, modelId: string) => {
    e.stopPropagation()
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead className="min-w-[250px]">Model</TableHead>
              {availableMetrics.map((metricName) => (
                <TableHead
                  key={metricName}
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors min-w-[120px]"
                  onClick={() => handleMetricSort(metricName)}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs">{metricName.replace(/_/g, " ")}</span>
                    {sortMetric === metricName ? (
                      sortOrder === "desc" ? (
                        <ArrowDown className="w-3 h-3 text-primary" />
                      ) : (
                        <ArrowUp className="w-3 h-3 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedModels.map((model) => {
              const isSelected = selectedModel === model.modelId
              const isTopThree = model.rank <= 3

              return (
                <TableRow
                  key={model.modelId}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isSelected && "bg-accent/50",
                    !isSelected && "hover:bg-muted/50",
                  )}
                  onClick={() => handleRowClick(model.modelId)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{model.rank}</span>
                      {isTopThree && (
                        <Badge variant={model.rank === 1 ? "default" : "secondary"} className="text-xs">
                          {model.rank === 1 ? "🥇" : model.rank === 2 ? "🥈" : "🥉"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={getModelUrl(model.modelId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleModelClick(e, model.modelId)}
                      className="inline-flex items-center gap-2 text-primary hover:underline hover:text-primary/80 transition-colors"
                    >
                      <span>{model.modelName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </TableCell>
                  {availableMetrics.map((metricName) => {
                    const metricScore = model.taskData?.scores?.test?.[0]?.[metricName]
                    const isCurrentSort = sortMetric === metricName
                    return (
                      <TableCell
                        key={metricName}
                        className={cn("text-right font-mono text-sm", isCurrentSort && "font-semibold text-foreground")}
                      >
                        {typeof metricScore === "number" ? metricScore.toFixed(4) : "—"}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
