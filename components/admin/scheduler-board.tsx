"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, AlertTriangle, Download } from "lucide-react"
import { toast } from "sonner"

interface Job {
  id: string
  customerName: string
  address: string
  services: string[]
  duration: number
  scheduledDate: string
  status: "unassigned" | "assigned"
  priority: "low" | "medium" | "high"
}

interface Cleaner {
  id: string
  name: string
  avatar?: string
  jobs: Job[]
  maxHours: number
  currentHours: number
}

export function SchedulerBoard() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [unassignedJobs, setUnassignedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScheduleData()
  }, [])

  const fetchScheduleData = async () => {
    try {
      const [cleanersRes, jobsRes] = await Promise.all([
        fetch("/api/admin/cleaners"),
        fetch("/api/admin/jobs/unassigned"),
      ])

      const cleanersData = await cleanersRes.json()
      const jobsData = await jobsRes.json()

      setCleaners(cleanersData)
      setUnassignedJobs(jobsData)
    } catch (error) {
      toast.error("Failed to load schedule data")
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (source.droppableId === "unassigned" && destination.droppableId.startsWith("cleaner-")) {
      const cleanerId = destination.droppableId.replace("cleaner-", "")
      const job = unassignedJobs.find((j) => j.id === draggableId)

      if (!job) return

      // Check for overbooking
      const cleaner = cleaners.find((c) => c.id === cleanerId)
      if (cleaner && cleaner.currentHours + job.duration > cleaner.maxHours) {
        toast.error("Warning: This assignment would exceed the cleaner's maximum hours!")
        return
      }

      try {
        setUnassignedJobs((prev) => prev.filter((j) => j.id !== draggableId))
        setCleaners((prev) =>
          prev.map((c) =>
            c.id === cleanerId
              ? {
                  ...c,
                  jobs: [...c.jobs, { ...job, status: "assigned" }],
                  currentHours: c.currentHours + job.duration,
                }
              : c,
          ),
        )

        const response = await fetch(`/api/admin/jobs/${draggableId}/assign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cleanerId }),
        })

        if (!response.ok) {
          fetchScheduleData()
          throw new Error("Failed to assign job")
        }

        await fetch("/api/admin/notifications/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "job_assigned",
            cleanerId,
            jobId: draggableId,
            message: `New job assigned: ${job.customerName} - ${job.services.join(", ")}`,
          }),
        })

        toast.success("Job assigned successfully and cleaner notified!")
      } catch (error) {
        toast.error("Failed to assign job")
      }
    }
  }

  const exportCalendar = async (cleanerId: string) => {
    try {
      const response = await fetch(`/api/admin/cleaners/${cleanerId}/calendar`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cleaner-${cleanerId}-calendar.ics`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error("Failed to export calendar")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading scheduler...</div>
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Unassigned Jobs ({unassignedJobs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="unassigned">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[200px]">
                      {unassignedJobs.map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 border rounded-lg bg-white cursor-move ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">{job.customerName}</span>
                                  <Badge
                                    variant={
                                      job.priority === "high"
                                        ? "destructive"
                                        : job.priority === "medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {job.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {job.address}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {job.duration}h - {new Date(job.scheduledDate).toLocaleDateString()}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {job.services.slice(0, 2).map((service, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {cleaners.map((cleaner) => (
                <Card key={cleaner.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={cleaner.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {cleaner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm">{cleaner.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {cleaner.currentHours}h / {cleaner.maxHours}h
                            {cleaner.currentHours > cleaner.maxHours && <span className="text-red-500 ml-1">⚠️</span>}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => exportCalendar(cleaner.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={`cleaner-${cleaner.id}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[150px]">
                          {cleaner.jobs.map((job, index) => (
                            <div key={job.id} className="p-2 border rounded bg-gray-50">
                              <div className="text-sm font-medium">{job.customerName}</div>
                              <div className="text-xs text-muted-foreground">
                                {job.duration}h - {new Date(job.scheduledDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}
