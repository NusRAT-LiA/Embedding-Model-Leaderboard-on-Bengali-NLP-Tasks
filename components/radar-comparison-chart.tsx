"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import type { ModelResults } from "@/lib/load-results"

interface RadarComparisonChartProps {
  allResults: ModelResults
  selectedTask: string
  topN: number
  availableMetrics: string[]
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function RadarComparisonChart({ allResults, selectedTask, topN, availableMetrics }: RadarComparisonChartProps) {
  const topModels = Object.entries(allResults)
    .map(([modelId, data]) => {
      const taskData = data[selectedTask]
      const mainScore = taskData?.scores?.test?.[0]?.main_score
      return {
        modelId,
        modelName: modelId.replace(/__/g, "/").split("/").pop() || modelId,
        mainScore: typeof mainScore === "number" ? mainScore : 0,
        data: taskData?.scores?.test?.[0] || {},
      }
    })
    .filter((m) => m.mainScore > 0)
    .sort((a, b) => b.mainScore - a.mainScore)
    .slice(0, topN)

  const radarData = availableMetrics.slice(0, 6).map((metric) => {
    const dataPoint: any = { metric: metric.replace(/_/g, " ").slice(0, 15) }
    topModels.forEach((model) => {
      const score = model.data[metric]
      dataPoint[model.modelName] = typeof score === "number" ? score : 0
    })
    return dataPoint
  })

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={radarData}>
        <PolarGrid stroke="hsl(var(--border))" opacity={0.3} />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <PolarRadiusAxis angle={90} domain={[0, 1]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-sm mb-2">{payload[0].payload.metric}</p>
                  {payload.map((entry, index) => (
                    <p key={index} className="text-xs" style={{ color: entry.color }}>
                      {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(4) : entry.value}
                    </p>
                  ))}
                </div>
              )
            }
            return null
          }}
        />
        {topModels.map((model, index) => (
          <Radar
            key={model.modelId}
            name={model.modelName}
            dataKey={model.modelName}
            stroke={CHART_COLORS[index % CHART_COLORS.length]}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
        <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
      </RadarChart>
    </ResponsiveContainer>
  )
}
