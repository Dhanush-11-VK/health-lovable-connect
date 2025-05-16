
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Plus, Calendar as CalendarIcon, User, Video, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Appointments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  
  const appointments = [
    {
      id: 1,
      patientName: "John Doe",
      patientId: "P-10023",
      date: "2025-05-17",
      time: "09:00 AM",
      duration: "30 min",
      type: "Check-up",
      status: "confirmed",
      isVirtual: false,
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientId: "P-10045",
      date: "2025-05-17",
      time: "10:30 AM",
      duration: "45 min",
      type: "Follow-up",
      status: "confirmed",
      isVirtual: true,
    },
    {
      id: 3,
      patientName: "Robert Johnson",
      patientId: "P-10078",
      date: "2025-05-18",
      time: "02:00 PM",
      duration: "60 min",
      type: "Consultation",
      status: "pending",
      isVirtual: false,
    },
    {
      id: 4,
      patientName: "Lisa Brown",
      patientId: "P-10132",
      date: "2025-05-18",
      time: "03:30 PM",
      duration: "30 min",
      type: "Check-up",
      status: "confirmed",
      isVirtual: true,
    },
    {
      id: 5,
      patientName: "Michael Davis",
      patientId: "P-10087",
      date: "2025-05-19",
      time: "11:00 AM",
      duration: "45 min",
      type: "New Patient",
      status: "confirmed",
      isVirtual: false,
    },
  ];

  // Filter appointments based on search term and selected date
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          appt.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appt.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If date is selected, filter by date
    const matchesDate = date ? appt.date === format(date, "yyyy-MM-dd") : true;
    
    return matchesSearch && matchesDate;
  });

  const handleNewAppointment = () => {
    navigate("/appointments/new");
  };

  const handleViewAppointment = (id: number) => {
    navigate(`/appointments/${id}`);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const dateHasAppointment = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.some(appt => appt.date === dateStr);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-gray">Appointments</h1>
            <p className="text-gray-500">Schedule and manage your appointments</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={handleNewAppointment}
              className="bg-healthcare-purple hover:bg-healthcare-dark-purple flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
                modifiers={{
                  hasAppointment: (date) => dateHasAppointment(date),
                }}
                modifiersClassNames={{
                  hasAppointment: "bg-healthcare-light-blue text-healthcare-blue font-medium",
                }}
              />
            </CardContent>
          </Card>

          {/* Appointment List */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {date ? format(date, "MMMM d, yyyy") : "All Appointments"}
                </CardTitle>
                <CardDescription>
                  {filteredAppointments.length} appointments found
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search appointments..." 
                    className="pl-8 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewAppointment(appointment.id)}
                    >
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div className={`p-2 rounded-full ${appointment.isVirtual ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {appointment.isVirtual ? (
                            <Video className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.patientId} • {appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center mt-2 sm:mt-0">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{appointment.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{appointment.time} ({appointment.duration})</span>
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? "Try using different search terms."
                      : date
                        ? "There are no appointments scheduled for this date."
                        : "Start by scheduling your first appointment."
                    }
                  </p>
                </div>
              )}

              {filteredAppointments.length > 0 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page 1 of 1
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
