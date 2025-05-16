
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { QrCode, Share2, Download, Copy, Pencil, X, Check } from "lucide-react";

const BusinessCard = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [cardData, setCardData] = useState({
    name: "Dr. Emily Smith",
    title: "Cardiologist",
    hospital: "MedConnect Medical Center",
    address: "123 Healthcare Ave, Medical District",
    phone: "+1 (555) 123-4567",
    email: "dr.smith@medconnect.com",
    website: "www.medconnect.com/dr-smith",
    hours: "Mon-Fri: 9AM-5PM",
    about: "Specialized in cardiovascular health with over 10 years of experience in diagnosing and treating heart conditions.",
    education: "MD, Harvard Medical School",
    certifications: "Board Certified in Cardiology, American Heart Association"
  });

  const [editFormData, setEditFormData] = useState({ ...cardData });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setCardData({ ...editFormData });
      toast({
        title: "Changes saved",
        description: "Your business card information has been updated.",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditFormData({ ...cardData });
    setIsEditing(false);
  };

  const handleShare = () => {
    // In a real app, this would generate a shareable link or open sharing options
    toast({
      title: "Share link generated",
      description: "A unique link to your business card has been copied to clipboard.",
    });
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image of the business card
    toast({
      title: "Download started",
      description: "Your business card is being downloaded as a PDF.",
    });
  };

  const handleCopyToClipboard = () => {
    // In a real app, this would copy a vCard or contact info to clipboard
    toast({
      title: "Copied to clipboard",
      description: "Your contact information has been copied to clipboard.",
    });
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-gray">Digital Business Card</h1>
            <p className="text-gray-500">Manage and share your professional contact information</p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEditToggle} className="flex items-center gap-2 bg-healthcare-purple hover:bg-healthcare-dark-purple">
              <Pencil className="h-4 w-4" />
              Edit Information
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancelEdit} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleEditToggle} className="flex items-center gap-2 bg-healthcare-purple hover:bg-healthcare-dark-purple">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <Card className="shadow-lg overflow-hidden">
              <div className="bg-healthcare-purple text-white p-6">
                <h3 className="text-2xl font-bold">{cardData.name}</h3>
                <p className="opacity-90">{cardData.title}</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">{cardData.hospital}</p>
                  <p className="text-sm text-gray-500">{cardData.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm"><strong>Phone:</strong> {cardData.phone}</p>
                  <p className="text-sm"><strong>Email:</strong> {cardData.email}</p>
                  <p className="text-sm"><strong>Web:</strong> {cardData.website}</p>
                  <p className="text-sm"><strong>Hours:</strong> {cardData.hours}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm">{cardData.about}</p>
                </div>
                <div className="pt-2 border-t text-sm space-y-1">
                  <p><strong>Education:</strong> {cardData.education}</p>
                  <p><strong>Certifications:</strong> {cardData.certifications}</p>
                </div>
                <div className="flex justify-center mt-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <QrCode className="h-32 w-32 text-healthcare-purple" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleCopyToClipboard}
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Information' : 'Information'}</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                {isEditing ? (
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={editFormData.name} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title/Specialization</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={editFormData.title} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hospital">Hospital/Practice</Label>
                      <Input 
                        id="hospital" 
                        name="hospital" 
                        value={editFormData.hospital} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={editFormData.address} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={editFormData.phone} 
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          value={editFormData.email} 
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          name="website" 
                          value={editFormData.website} 
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hours">Office Hours</Label>
                        <Input 
                          id="hours" 
                          name="hours" 
                          value={editFormData.hours} 
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="about">About</Label>
                      <Textarea 
                        id="about" 
                        name="about" 
                        value={editFormData.about} 
                        onChange={handleInputChange}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="education">Education</Label>
                      <Input 
                        id="education" 
                        name="education" 
                        value={editFormData.education} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certifications">Certifications</Label>
                      <Input 
                        id="certifications" 
                        name="certifications" 
                        value={editFormData.certifications} 
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p>{cardData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Title/Specialization</p>
                        <p>{cardData.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hospital/Practice</p>
                        <p>{cardData.hospital}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p>{cardData.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p>{cardData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{cardData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <p>{cardData.website}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Office Hours</p>
                        <p>{cardData.hours}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">About</p>
                      <p>{cardData.about}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Education</p>
                      <p>{cardData.education}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Certifications</p>
                      <p>{cardData.certifications}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessCard;
