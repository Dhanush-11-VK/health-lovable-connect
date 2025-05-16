
import { Calendar, Clock, MessageSquare, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const upcomingAppointments = [
    {
      id: 1,
      patientName: "John Doe",
      date: "2025-05-17",
      time: "09:00 AM",
      type: "Check-up",
      status: "confirmed",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      date: "2025-05-17",
      time: "10:30 AM",
      type: "Follow-up",
      status: "confirmed",
    },
    {
      id: 3,
      patientName: "Robert Johnson",
      date: "2025-05-18",
      time: "02:00 PM",
      type: "Consultation",
      status: "pending",
    },
  ];

  const recentMessages = [
    {
      id: 1,
      sender: "Sarah Wilson",
      message: "I've been feeling better since our last appointment.",
      time: "Today, 11:32 AM",
      read: false,
    },
    {
      id: 2,
      sender: "Mike Thompson",
      message: "Could you clarify the dosage for the new medication?",
      time: "Yesterday, 3:15 PM",
      read: true,
    },
  ];

  const handleNewAppointment = () => {
    navigate("/appointments/new");
  };

  const handleViewAllAppointments = () => {
    navigate("/appointments");
  };

  const handleViewAllMessages = () => {
    navigate("/messages");
  };

  const handleViewAllPatients = () => {
    navigate("/patients");
  };

  const handleMessageClick = (id: number) => {
    navigate(`/messages/${id}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-gray">Welcome, Dr. Smith</h1>
            <p className="text-gray-500">Here's what's happening today</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button 
              onClick={handleNewAppointment}
              className="bg-healthcare-purple hover:bg-healthcare-dark-purple"
            >
              New Appointment
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+5 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 pending confirmation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 require urgent attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12m</div>
              <p className="text-xs text-muted-foreground">-2m from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>You have {upcomingAppointments.length} appointments scheduled</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleViewAllAppointments}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-healthcare-light-blue rounded-full p-2">
                      <User className="h-5 w-5 text-healthcare-blue" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type} · {appointment.date} · {appointment.time}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      appointment.status === "confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages and Patient Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Messages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>You have {recentMessages.filter(m => !m.read).length} unread messages</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleViewAllMessages}>
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`cursor-pointer p-3 rounded-md ${message.read ? 'bg-white' : 'bg-healthcare-light-blue'}`}
                    onClick={() => handleMessageClick(message.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{message.sender}</p>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Frequently used functions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2">
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-1 border-2"
                onClick={() => navigate("/business-card")}
              >
                <User className="h-6 w-6 mb-1 text-healthcare-purple" />
                <span>Business Card</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-1 border-2"
                onClick={() => navigate("/patients/new")}
              >
                <User className="h-6 w-6 mb-1 text-healthcare-blue" />
                <span>New Patient</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-1 border-2"
                onClick={() => navigate("/prescriptions/new")}
              >
                <MessageSquare className="h-6 w-6 mb-1 text-healthcare-blue" />
                <span>Write Prescription</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-1 border-2"
                onClick={() => navigate("/messages/new")}
              >
                <MessageSquare className="h-6 w-6 mb-1 text-healthcare-purple" />
                <span>New Message</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
