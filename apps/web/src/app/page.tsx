"use client"

import { useState, useRef } from "react"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { ScrollArea } from "@repo/ui/components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar"
import { ImagePlus, Send, Plus, Sparkles, Clock, Search, Scissors } from "lucide-react"
import Image from "next/image"
import type { Message, ChatHistory } from "./types/chat"

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileList | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fashion-specific chat history
  const chatHistory: ChatHistory[] = [
    { id: "1", title: "Summer Collection Analysis", date: "Today", icon: Sparkles },
    { id: "2", title: "Sustainable Fashion Ideas", date: "Today", icon: Scissors },
    { id: "3", title: "Color Trends 2025", date: "Yesterday", icon: Search },
    { id: "4", title: "Fabric Recommendations", date: "Yesterday", icon: Clock },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() && !files) return

    setIsLoading(true)

    // Create a new message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      attachments: files
        ? Array.from(files).map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
        }))
        : undefined,
    }

    // Add user message to chat
    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setFiles(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    try {
      // Here you would integrate with your backend
      // const response = await fetch('/api/your-backend', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: input, attachments: files }),
      // })
      // const data = await response.json()

      // Simulated assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "This is where your backend response would go.",
          role: "assistant",
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    setSelectedChat(null)
    setMessages([])
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-gray-800">
      {/* Sidebar */}
      <div className="hidden md:flex w-[280px] flex-col border-r border-gray-200 bg-white">
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-white hover:bg-gray-50 border-gray-200"
            onClick={startNewChat}
          >
            <Plus size={16} className="text-gray-500" />
            <span className="font-light">New Design Chat</span>
          </Button>
        </div>
        <div className="px-3">
          <div className="h-px bg-gray-100 w-full" />
        </div>
        <ScrollArea className="flex-1 px-3 py-2">
          {Object.entries(
            chatHistory.reduce((acc: { [key: string]: typeof chatHistory }, chat) => {
              if (!acc[chat.date]) acc[chat.date] = []
              acc[chat.date].push(chat)
              return acc
            }, {}),
          ).map(([date, chats]) => (
            <div key={date} className="mb-4">
              <h3 className="mb-2 text-xs font-medium text-gray-400 px-2">{date}</h3>
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={`w-full justify-start gap-2 mb-1 h-9 px-2 font-light ${selectedChat === chat.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <chat.icon size={14} />
                  <span className="truncate text-sm">{chat.title}</span>
                </Button>
              ))}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white">
        <ScrollArea className="flex-1 px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-6 max-w-3xl mx-auto ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm ${message.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {message.content}
                </div>
                {message.attachments?.map((attachment, index) => (
                  <Image
                    key={index}
                    src={attachment.url || "/placeholder.svg"}
                    alt={`Fashion reference ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg border border-gray-200"
                  />
                ))}
              </div>
              {message.role === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-black text-white text-xs">YOU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-gray-100 bg-white">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFiles(e.target.files || undefined)}
                className="hidden"
                multiple
                accept="image/*"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={18} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fashion trends, designs, or upload an image..."
                className="flex-1 border-gray-200 focus-visible:ring-gray-400 text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-black hover:bg-gray-800 text-white"
                disabled={isLoading}
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
