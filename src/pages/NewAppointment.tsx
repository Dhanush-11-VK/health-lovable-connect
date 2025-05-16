
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Clock, Search, ArrowLeft, Video, User } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const patients = [
  { id: "P-10023", name: "John Doe", age: 45, gender: "Male", lastVisit: "2025-03-10" },
  { id: "P-10045", name: "Jane Smith", age: 38, gender: "Female", lastVisit: "2025-04-15" },
  { id: "P-10078", name: "Robert Johnson", age: 62, gender: "Male", lastVisit: "2025-04-22" },
  { id: "P-10132", name: "Lisa Brown", age: 29, gender: "Female", lastVisit: null },
  { id: "P-10087", name: "Michael Davis", age: 56, gender: "Male", lastVisit: "2025-02-03" },
];

const NewAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isVirtual, setIsVirtual] = useState(false);
  const [appointmentType, setAppointmentType] = useState("");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setSearchTerm("");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast({
        variant: "destructive",
        title: "Patient required",
        description: "Please select a patient for this appointment.",
      });
      return;
    }
    
    if (!date) {
      toast({
        variant: "destructive",
        title: "Date required",
        description: "Please select a date for this appointment.",
      });
      return;
    }
    
    if (!time) {
      toast({
        variant: "destructive",
        title: "Time required",
        description: "Please select a time for this appointment.",
      });
      return;
    }
    
    if (!appointmentType) {
      toast({
        variant: "destructive",
        title: "Type required",
        description: "Please select an appointment type.",
      });
      return;
    }
    
    // In a real app, this would send data to the server
    toast({
      title: "Appointment scheduled",
      description: `Appointment for ${selectedPatient.name} on ${format(date, "MMMM d, yyyy")} at ${time} has been scheduled.`,
    });
    
    // Navigate back to appointments list
    navigate("/appointments");
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/appointments")}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-gray">New Appointment</h1>
            <p className="text-gray-500">Schedule a new appointment</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Select a patient for this appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPatient ? (
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedPatient.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedPatient.id}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedPatient(null)}
                      >
                        Change
                      </Button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Age</p>
                        <p>{selectedPatient.age} years</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gender</p>
                        <p>{selectedPatient.gender}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Last Visit</p>
                        <p>{selectedPatient.lastVisit || 'New Patient'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="relative mb-4">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input 
                        type="search" 
                        placeholder="Search for a patient..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="border rounded-md">
                      {searchTerm !== "" && (
                        <div className="max-h-52 overflow-y-auto">
                          {filteredPatients.length > 0 ? (
                            filteredPatients.map(patient => (
                              <div 
                                key={patient.id}
                                className="flex justify-between items-center p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50"
                                onClick={() => handlePatientSelect(patient)}
                              >
                                <div>
                                  <p className="font-medium">{patient.name}</p>
                                  <p className="text-sm text-muted-foreground">{patient.id} • {patient.age} yrs • {patient.gender}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-healthcare-purple"
                                >
                                  Select
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-muted-foreground">No patients found</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {searchTerm === "" && (
                        <div className="p-4 text-center">
                          <p className="text-muted-foreground">Search for a patient to continue</p>
                          <Button
                            variant="link"
                            className="mt-2 text-healthcare-purple hover:text-healthcare-dark-purple" 
                            onClick={() => navigate("/patients/new")}
                          >
                            Add a new patient
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Select date, time and type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => {
                            // Disable dates in the past
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger id="time" className="w-full">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                        <SelectItem value="08:30 AM">08:30 AM</SelectItem>
                        <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                        <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                        <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                        <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                        <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                        <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                        <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                        <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                        <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                        <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                        <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                        <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                        <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                        <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Appointment Type</Label>
                    <Select value={appointmentType} onValueChange={setAppointmentType}>
                      <SelectTrigger id="type" className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="check-up">General Check-up</SelectItem>
                        <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="new-patient">New Patient Visit</SelectItem>
                        <SelectItem value="emergency">Emergency Visit</SelectItem>
                        <SelectItem value="procedure">Medical Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="duration" className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="virtual">Virtual Appointment</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable for telemedicine consultations
                      </p>
                    </div>
                    <Switch 
                      id="virtual" 
                      checked={isVirtual} 
                      onCheckedChange={setIsVirtual} 
                    />
                  </div>

                  {isVirtual && (
                    <div className="rounded-md bg-blue-50 p-3 flex gap-3">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-700">Virtual appointment enabled</p>
                        <p className="text-sm text-blue-600">
                          Patient will receive a secure video link 15 minutes before the appointment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Notes */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Add notes or special instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Add any notes or special instructions for this appointment"
                  className="min-h-32"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/appointments")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-healthcare-purple hover:bg-healthcare-dark-purple"
                >
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewAppointment;
