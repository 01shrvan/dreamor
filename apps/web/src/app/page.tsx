"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { ScrollArea } from "@repo/ui/components/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar"
import { ImagePlus, Send, Plus, Sparkles, Clock, Search, Scissors, Menu } from "lucide-react"
import Image from "next/image"
import type { Message, ChatHistory } from "./types/chat"

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileList | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

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

    // Simulated AI response for spring-related queries
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "hi",
        role: "assistant",
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const startNewChat = () => {
    setSelectedChat(null)
    setMessages([])
  }

  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev)

  return (
    <div className="flex h-screen bg-[#1E1E1E] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E1E1E] transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="p-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent hover:bg-neutral-800 border-neutral-700 text-neutral-300"
            onClick={startNewChat}
          >
            <Plus size={16} className="text-neutral-400" />
            <span className="font-light">New Design Chat</span>
          </Button>
        </div>
        <div className="px-3">
          <div className="h-px bg-neutral-800 w-full" />
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
              <h3 className="mb-2 text-xs font-medium text-neutral-500 px-2">{date}</h3>
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={`w-full justify-start gap-2 mb-1 h-9 px-2 font-light ${selectedChat === chat.id
                      ? "bg-neutral-800 text-neutral-200"
                      : "text-neutral-400 hover:bg-neutral-800"
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

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 md:hidden">
          <Button
            onClick={toggleMobileSidebar}
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800"
          >
            <Menu size={24} />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-6 max-w-3xl mx-auto ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-violet-500 text-white text-xs">AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm ${message.role === "user" ? "bg-violet-500 text-white" : "bg-neutral-800 text-neutral-200"
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
                    className="rounded-lg border border-neutral-700"
                  />
                ))}
              </div>
              {message.role === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-violet-500 text-white text-xs">YOU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>

        {/* Input area */}
        <div className="px-4 py-4 border-t border-neutral-800">
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
                className="text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={18} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fashion trends, designs, or upload an image..."
                className="flex-1 bg-transparent border-neutral-700 focus-visible:ring-violet-500 focus-visible:ring-2 text-sm text-neutral-200 placeholder:text-neutral-500 h-10 px-4"
              />
              <Button type="submit" size="icon" className="bg-violet-500 hover:bg-violet-600 text-white">
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      </div>
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar} />
      )}
    </div>
  )
}

export default Chat