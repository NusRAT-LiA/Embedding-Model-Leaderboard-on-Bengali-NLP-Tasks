"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface LeaderboardModel {
  rank: number
  modelId: string
  modelName: string
  score: number | null
}

interface DistributionChartProps {
  data: LeaderboardModel[]
  metric: string
}

export function DistributionChart({ data, metric }: DistributionChartProps) {
  // Higher scores should have better (smaller) ranks on the x-axis,
  // so sort models by score in descending order.
  const sortedData = [...data].sort((a, b) => (b.score || 0) - (a.score || 0))

  const chartData = sortedData.map((m, index) => ({
    index: index + 1,
    score: m.score || 0,
    name: m.modelName.split("/").pop() || m.modelName,
  }))

  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="index"
          label={{ value: "Model Rank", position: "insideBottom", offset: -10, fill: "hsl(var(--muted-foreground))" }}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          domain={[0, 1]}
          label={{ value: "Score", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-sm mb-1">{payload[0].payload.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Score: {typeof payload[0].value === "number" ? payload[0].value.toFixed(4) : payload[0].value}
                  </p>
                  <p className="text-xs text-muted-foreground">Rank: #{payload[0].payload.index}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorScore)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
