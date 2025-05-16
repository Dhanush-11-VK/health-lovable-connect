
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search, FileText, Calendar, MessageSquare, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock patient data
const mockPatients = [
  {
    id: 1,
    name: "John Smith",
    dob: "05/12/1980",
    contactNumber: "(555) 123-4567",
    lastVisit: "04/28/2025",
    nextAppointment: "05/20/2025",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    dob: "11/23/1975",
    contactNumber: "(555) 987-6543",
    lastVisit: "05/01/2025",
    nextAppointment: "05/22/2025",
  },
  {
    id: 3,
    name: "Michael Brown",
    dob: "07/09/1992",
    contactNumber: "(555) 456-7890",
    lastVisit: "04/15/2025",
    nextAppointment: "05/30/2025",
  },
  {
    id: 4,
    name: "Emily Davis",
    dob: "03/17/1988",
    contactNumber: "(555) 789-0123",
    lastVisit: "05/05/2025",
    nextAppointment: "06/05/2025",
  },
  {
    id: 5,
    name: "Robert Wilson",
    dob: "09/29/1965",
    contactNumber: "(555) 234-5678",
    lastVisit: "05/10/2025",
    nextAppointment: "06/10/2025",
  },
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-healthcare-purple hover:bg-healthcare-purple/90">
              <UserPlus className="mr-2 h-4 w-4" />
              New Patient
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPatients.length}</div>
              <p className="text-xs text-muted-foreground">+2 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 remaining</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 unread</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.dob}</TableCell>
                    <TableCell>{patient.contactNumber}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>{patient.nextAppointment}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/patients/${patient.id}`}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/appointments/new?patient=${patient.id}`}>
                            <Calendar className="h-4 w-4" />
                            <span className="sr-only">Schedule Appointment</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/messages?patient=${patient.id}`}>
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Send Message</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
