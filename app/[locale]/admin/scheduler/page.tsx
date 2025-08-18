import { SchedulerBoard } from "@/components/admin/scheduler-board"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function AdminSchedulerPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Scheduler Board</h1>
          <p className="text-muted-foreground">Assign jobs to cleaners and manage schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">Scheduler</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Assignment Board</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <SchedulerBoard />
        </CardContent>
      </Card>
    </div>
  )
}
