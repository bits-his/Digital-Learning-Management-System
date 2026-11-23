import type { ReactNode } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type {
  CompetencyScore,
  ParticipantPerformance,
} from "@/shared/data/mock-assessment"

const tooltipStyle = {
  borderRadius: "0.5rem",
  border: "1px solid color-mix(in oklch, var(--foreground) 12%, transparent)",
  background: "var(--card)",
  color: "var(--card-foreground)",
  fontSize: "0.8125rem",
}

export function CompetencyRadarChart({
  competencies,
}: {
  competencies: CompetencyScore[]
}) {
  const data = competencies.map((item) => ({
    area: item.area.replace(" ", "\n"),
    fullArea: item.area,
    score: item.score,
    target: item.target,
  }))

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="color-mix(in oklch, var(--foreground) 15%, transparent)" />
          <PolarAngleAxis
            dataKey="area"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          />
          <Radar
            name="Your score"
            dataKey="score"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke="var(--attention)"
            fill="var(--attention)"
            fillOpacity={0.08}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [
              `${value}`,
              name === "score" ? "Your score" : "Target",
            ]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullArea ?? ""
            }
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CompetencyBarChart({
  competencies,
}: {
  competencies: CompetencyScore[]
}) {
  const data = competencies.map((item) => ({
    area:
      item.area.length > 14 ? `${item.area.slice(0, 12)}…` : item.area,
    fullArea: item.area,
    score: item.score,
    target: item.target,
  }))

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="color-mix(in oklch, var(--foreground) 12%, transparent)"
            vertical={false}
          />
          <XAxis
            dataKey="area"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullArea ?? ""
            }
          />
          <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
          <Bar
            dataKey="score"
            name="Score"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="target"
            name="Target"
            fill="var(--attention)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            fillOpacity={0.55}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CompletionStackedChart({
  assignmentsCompleted,
  assignmentsTotal,
  quizzesCompleted,
  quizzesTotal,
}: {
  assignmentsCompleted: number
  assignmentsTotal: number
  quizzesCompleted: number
  quizzesTotal: number
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={[
            {
              label: "Assignments",
              completed: assignmentsCompleted,
              remaining: Math.max(assignmentsTotal - assignmentsCompleted, 0),
              total: assignmentsTotal,
            },
            {
              label: "Quizzes",
              completed: quizzesCompleted,
              remaining: Math.max(quizzesTotal - quizzesCompleted, 0),
              total: quizzesTotal,
            },
          ]}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="color-mix(in oklch, var(--foreground) 12%, transparent)"
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={90}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
          <Bar
            dataKey="completed"
            name="Completed"
            stackId="a"
            fill="var(--primary)"
          />
          <Bar
            dataKey="remaining"
            name="Remaining"
            stackId="a"
            fill="color-mix(in oklch, var(--foreground) 12%, transparent)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CohortOverallBarChart({
  rows,
}: {
  rows: ParticipantPerformance[]
}) {
  const data = rows.map((row) => ({
    name: row.participantName.split(" ")[0],
    fullName: row.participantName,
    overall: row.overallScore,
    assignments: Math.round(
      (row.assignmentsCompleted / Math.max(row.assignmentsTotal, 1)) * 100
    ),
    quizzes: Math.round(
      (row.quizzesCompleted / Math.max(row.quizzesTotal, 1)) * 100
    ),
  }))

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="color-mix(in oklch, var(--foreground) 12%, transparent)"
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullName ?? ""
            }
          />
          <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
          <Bar
            dataKey="overall"
            name="Overall"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            dataKey="assignments"
            name="Assignments %"
            fill="var(--success)"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            dataKey="quizzes"
            name="Quizzes %"
            fill="var(--attention)"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ChartPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-card/70 p-4 backdrop-blur-sm md:p-5">
      <div className="mb-3 space-y-1">
        <h3 className="font-heading text-lg font-medium">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
