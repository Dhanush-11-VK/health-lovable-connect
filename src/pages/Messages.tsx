
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, Users } from "lucide-react";
import { useState } from "react";

// Mock conversations
const mockConversations = [
  {
    id: 1,
    name: "John Smith",
    lastMessage: "I've been feeling much better since our last appointment.",
    timestamp: "10:30 AM",
    unread: true,
    avatar: "JS",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    lastMessage: "Thanks for sending my prescription refill.",
    timestamp: "Yesterday",
    unread: false,
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Michael Brown",
    lastMessage: "When should I schedule my next checkup?",
    timestamp: "Yesterday",
    unread: true,
    avatar: "MB",
  },
  {
    id: 4,
    name: "Emily Davis",
    lastMessage: "I have a question about the medication you prescribed.",
    timestamp: "May 12",
    unread: false,
    avatar: "ED",
  },
  {
    id: 5,
    name: "Robert Wilson",
    lastMessage: "I'll see you at my appointment next week.",
    timestamp: "May 10",
    unread: false,
    avatar: "RW",
  },
];

// Mock messages for the selected conversation
const mockMessages = [
  {
    id: 1,
    senderId: "doctor",
    text: "Hello John, how are you feeling today?",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    senderId: "patient",
    text: "I've been feeling much better since our last appointment.",
    timestamp: "10:30 AM",
  },
];

export default function Messages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = mockConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    console.log("Message sent:", newMessage);
    // In a real application, this would send the message to the backend
    setNewMessage("");
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-240px)]">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {/* Conversations List */}
          <Card className="col-span-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Button variant="outline" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <li
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      selectedConversation.id === conversation.id
                        ? "bg-healthcare-purple/10 border border-healthcare-purple/30"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-healthcare-purple text-white flex items-center justify-center font-semibold">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.name}
                          </p>
                          <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                        </div>
                        <p className={`text-sm truncate ${conversation.unread ? "font-semibold" : "text-gray-500"}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread && (
                        <span className="inline-block h-2 w-2 rounded-full bg-healthcare-purple"></span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-healthcare-purple text-white flex items-center justify-center font-semibold">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <CardTitle>{selectedConversation.name}</CardTitle>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "doctor" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.senderId === "doctor"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-healthcare-purple text-white"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  className="resize-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  className="bg-healthcare-purple hover:bg-healthcare-purple/90 self-end"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
