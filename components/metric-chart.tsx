"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface LeaderboardModel {
  rank: number
  modelId: string
  modelName: string
  score: number | null
}

interface MetricChartProps {
  data: LeaderboardModel[]
  metric: string
  selectedModel: string | null
  onModelSelect: (modelId: string | null) => void
}

export function MetricChart({ data, metric, selectedModel, onModelSelect }: MetricChartProps) {
  const chartData = data.map((m) => ({
    name: m.modelName.split("/").pop() || m.modelName,
    fullName: m.modelName,
    modelId: m.modelId,
    value: m.score || 0,
  }))

  const handleBarClick = (data: any) => {
    if (selectedModel === data.modelId) {
      onModelSelect(null)
    } else {
      onModelSelect(data.modelId)
    }
  }

  const getBarColor = (index: number, modelId: string) => {
    if (selectedModel === modelId) {
      return "hsl(var(--primary))"
    }
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ]
    return colors[index % colors.length]
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} domain={[0, 1]} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-sm mb-1">{payload[0].payload.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.replace(/_/g, " ")}: 
                    {typeof payload[0].value === "number"
                      ? payload[0].value.toFixed(4)
                      : payload[0].value}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} onClick={handleBarClick} cursor="pointer">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getBarColor(index, entry.modelId)}
              opacity={selectedModel && selectedModel !== entry.modelId ? 0.3 : 0.9}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
