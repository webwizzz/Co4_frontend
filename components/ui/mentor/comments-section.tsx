"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send, Eye, EyeOff } from "lucide-react"
import type { Comment } from "@/types/mentor"

interface CommentsSectionProps {
  comments: Comment[]
  onAddComment: (text: string, isVisible: boolean) => void
}

export default function CommentsSection({ comments, onAddComment }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  const handleSubmit = () => {
    if (newComment.trim()) {
      console.log("Submitting comment from UI:", { text: newComment.trim(), isVisible });
      onAddComment(newComment.trim(), isVisible)
      setNewComment("")
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Comments & Feedback ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Comment */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="comment">Add Comment</Label>
            <Textarea
              id="comment"
              placeholder="Share your feedback with the student..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="visibility" checked={isVisible} onCheckedChange={setIsVisible} />
              <Label htmlFor="visibility" className="text-sm">
                {isVisible ? (
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Visible to student
                  </span>
                ) : (
                  <span className="flex items-center">
                    <EyeOff className="h-4 w-4 mr-1" />
                    Private note
                  </span>
                )}
              </Label>
            </div>

            <Button onClick={handleSubmit} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>

        {/* Existing Comments */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      {comment.author && (
                        <span className="text-xs font-medium mr-2">{comment.author}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
                    </div>
                    {comment.isVisible === false && (
                      <Badge variant="outline" className="flex items-center">
                        <EyeOff className="h-3 w-3 mr-1" />
                        <span className="text-xs">Private</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{comment.text}</p>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to provide feedback!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
