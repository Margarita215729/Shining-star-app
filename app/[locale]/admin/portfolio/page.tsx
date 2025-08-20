"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2, Eye, Upload } from "lucide-react"
import { motion } from "framer-motion"

interface PortfolioItem {
  id: string
  title: string
  description?: string
  category?: string
  beforeImages: string[]
  afterImages: string[]
  tags: string[]
  projectDate?: string
  isPublished: boolean
  displayOrder: number
  createdAt: string
}

export default function AdminPortfolioPage() {
  const t = useTranslations()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    beforeImages: [] as string[],
    afterImages: [] as string[],
    tags: "",
    projectDate: "",
    isPublished: true,
    displayOrder: 0
  })

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      // In a real app, this would be an admin-specific endpoint that shows all items
      const response = await fetch("/api/portfolio")
      const data = await response.json()
      setPortfolio(data.portfolio || [])
    } catch (error) {
      console.error("Failed to fetch portfolio:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        projectDate: formData.projectDate || null
      }

      const url = editingItem ? `/api/portfolio/${editingItem.id}` : "/api/portfolio"
      const method = editingItem ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingItem(null)
        setFormData({
          title: "",
          description: "",
          category: "",
          beforeImages: [],
          afterImages: [],
          tags: "",
          projectDate: "",
          isPublished: true,
          displayOrder: 0
        })
        fetchPortfolio()
      }
    } catch (error) {
      console.error("Failed to save portfolio item:", error)
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category || "",
      beforeImages: item.beforeImages,
      afterImages: item.afterImages,
      tags: item.tags.join(", "),
      projectDate: item.projectDate ? item.projectDate.split("T")[0] : "",
      isPublished: item.isPublished,
      displayOrder: item.displayOrder
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return
    
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        fetchPortfolio()
      }
    } catch (error) {
      console.error("Failed to delete portfolio item:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">Manage your portfolio showcase</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Portfolio Item
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? "Edit" : "Add"} Portfolio Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Kitchen, Bathroom, Office"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="deep clean, kitchen, residential"
                  />
                </div>

                <div>
                  <Label htmlFor="projectDate">Project Date</Label>
                  <Input
                    id="projectDate"
                    type="date"
                    value={formData.projectDate}
                    onChange={(e) => setFormData({...formData, projectDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Before Images</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload before images (feature to be implemented)
                  </p>
                </div>
              </div>

              <div>
                <Label>After Images</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload after images (feature to be implemented)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      beforeImages: [] as string[],
                      afterImages: [] as string[],
                      tags: "",
                      projectDate: "",
                      isPublished: true,
                      displayOrder: 0
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="relative aspect-video bg-muted">
                {item.afterImages.length > 0 ? (
                  <img
                    src={item.afterImages[0]}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                {!item.isPublished && (
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    Draft
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.category && (
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                  {item.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Order: {item.displayOrder}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {portfolio.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No portfolio items found.</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Add your first portfolio item
          </Button>
        </div>
      )}
    </div>
  )
}