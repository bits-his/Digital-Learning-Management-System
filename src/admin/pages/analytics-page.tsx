import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const metrics = [
  { label: "Enrollment", value: "128", detail: "Across 3 cohorts" },
  { label: "Attendance rate", value: "86%", detail: "Live sessions" },
  { label: "Assessment avg", value: "74", detail: "All graded work" },
  { label: "Countries", value: "9", detail: "Participant representation" },
]

export function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Programme monitoring for leadership and funders.
        </p>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="font-heading text-3xl">
                    {metric.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {metric.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="outcomes">
          <Card>
            <CardHeader>
              <CardTitle>Outcome tracking</CardTitle>
              <CardDescription>
                Mock impact indicators for post-Bootcamp reporting.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b pb-3">
                <span>Export-ready businesses</span>
                <span className="font-medium">19</span>
              </div>
              <div className="flex justify-between gap-4 border-b pb-3">
                <span>Investment-ready proposals</span>
                <span className="font-medium">14</span>
              </div>
              <div className="flex justify-between gap-4 border-b pb-3">
                <span>Mentor / buyer connections</span>
                <span className="font-medium">37</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Reported financing outcomes</span>
                <span className="font-medium">6</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
