export interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    attachments?: Array<{
      url: string
      name?: string
    }>
  }
  
  export interface ChatHistory {
    id: string
    title: string
    date: string
    icon: any
  }
  
  