
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, FilePlus, Search, Printer, Download, Eye, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock prescription data
const mockPrescriptions = [
  {
    id: 1,
    patient: "John Smith",
    medication: "Amoxicillin 500mg",
    dosage: "1 tablet every 8 hours",
    quantity: "30 tablets",
    refills: 2,
    issueDate: "05/10/2025",
    expiryDate: "05/10/2026",
    status: "Active",
    doctor: "Dr. Elizabeth Taylor",
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    medication: "Lisinopril 20mg",
    dosage: "1 tablet daily",
    quantity: "30 tablets",
    refills: 5,
    issueDate: "05/05/2025",
    expiryDate: "05/05/2026",
    status: "Active",
    doctor: "Dr. Elizabeth Taylor",
  },
  {
    id: 3,
    patient: "Michael Brown",
    medication: "Sertraline 50mg",
    dosage: "1 tablet daily in the morning",
    quantity: "30 tablets",
    refills: 3,
    issueDate: "04/28/2025",
    expiryDate: "04/28/2026",
    status: "Active",
    doctor: "Dr. Elizabeth Taylor",
  },
  {
    id: 4,
    patient: "Emily Davis",
    medication: "Metformin 1000mg",
    dosage: "1 tablet twice daily with meals",
    quantity: "60 tablets",
    refills: 2,
    issueDate: "04/15/2025",
    expiryDate: "04/15/2026",
    status: "Active",
    doctor: "Dr. Elizabeth Taylor",
  },
  {
    id: 5,
    patient: "Robert Wilson",
    medication: "Atorvastatin 40mg",
    dosage: "1 tablet daily at bedtime",
    quantity: "30 tablets",
    refills: 6,
    issueDate: "05/01/2025",
    expiryDate: "05/01/2026",
    status: "Active",
    doctor: "Dr. Elizabeth Taylor",
  },
  {
    id: 6,
    patient: "Linda Martinez",
    medication: "Prednisone 5mg",
    dosage: "2 tablets daily for 5 days, then 1 tablet daily for 5 days",
    quantity: "15 tablets",
    refills: 0,
    issueDate: "05/08/2025",
    expiryDate: "05/22/2025",
    status: "Expired",
    doctor: "Dr. Elizabeth Taylor",
  },
];

export default function Prescriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<typeof mockPrescriptions[0] | null>(null);
  const { toast } = useToast();

  const filteredPrescriptions = mockPrescriptions.filter(prescription =>
    prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    toast({
      title: "Printing Prescription",
      description: "The prescription has been sent to the printer.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Prescription Downloaded",
      description: "The prescription PDF has been downloaded.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-healthcare-purple hover:bg-healthcare-purple/90">
              <FilePlus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPrescriptions.length}</div>
              <p className="text-xs text-muted-foreground">3 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPrescriptions.filter(p => p.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">Updated today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patients with Prescriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockPrescriptions.map(p => p.patient)).size}
              </div>
              <p className="text-xs text-muted-foreground">From total patient base</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prescription List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">{prescription.patient}</TableCell>
                    <TableCell>{prescription.medication}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.issueDate}</TableCell>
                    <TableCell>{prescription.expiryDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          prescription.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedPrescription(prescription)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Prescription Details</DialogTitle>
                              <DialogDescription>
                                View complete prescription information.
                              </DialogDescription>
                            </DialogHeader>
                            {selectedPrescription && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Patient:</p>
                                  <p className="col-span-3">{selectedPrescription.patient}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Medication:</p>
                                  <p className="col-span-3">{selectedPrescription.medication}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Dosage:</p>
                                  <p className="col-span-3">{selectedPrescription.dosage}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Quantity:</p>
                                  <p className="col-span-3">{selectedPrescription.quantity}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Refills:</p>
                                  <p className="col-span-3">{selectedPrescription.refills}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Issued:</p>
                                  <p className="col-span-3">{selectedPrescription.issueDate}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Expires:</p>
                                  <p className="col-span-3">{selectedPrescription.expiryDate}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Status:</p>
                                  <p className="col-span-3">
                                    <Badge
                                      variant="outline"
                                      className={
                                        selectedPrescription.status === "Active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }
                                    >
                                      {selectedPrescription.status}
                                    </Badge>
                                  </p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium col-span-1">Physician:</p>
                                  <p className="col-span-3">{selectedPrescription.doctor}</p>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                              </Button>
                              <Button onClick={handleDownload}>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="icon" onClick={handlePrint}>
                          <Printer className="h-4 w-4" />
                          <span className="sr-only">Print</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
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
