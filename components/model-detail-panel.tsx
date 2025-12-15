"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ModelData } from "@/lib/load-results"

interface ModelDetailPanelProps {
  modelId: string
  modelData: ModelData
  tasks: { id: string; name: string }[]
}

export function ModelDetailPanel({ modelId, modelData, tasks }: ModelDetailPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Model ID</h3>
        <p className="font-mono text-sm">{modelId.replace(/__/g, "/")}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Performance Across Tasks</h3>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Main Score</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
                <TableHead className="text-right">F1</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const taskData = modelData[task.id]
                const scores = taskData?.scores?.test?.[0]

                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>
                      {scores ? (
                        <Badge variant="default" className="bg-green-600">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No Data</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {scores?.main_score?.toFixed(4) || "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {scores?.accuracy?.toFixed(4) || "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{scores?.f1?.toFixed(4) || "—"}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">All Available Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(modelData).map(([taskId, taskData]) => {
            const task = tasks.find((t) => t.id === taskId)
            const scores = taskData?.scores?.test?.[0]
            if (!scores) return null

            return (
              <div key={taskId} className="space-y-2 p-3 rounded-lg border bg-card">
                <h4 className="text-xs font-medium text-muted-foreground">{task?.name}</h4>
                <div className="space-y-1">
                  {Object.entries(scores).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{metric}:</span>
                      <span className="font-mono font-medium">
                        {typeof value === "number" ? value.toFixed(4) : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
