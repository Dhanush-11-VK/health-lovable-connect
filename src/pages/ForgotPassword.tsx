
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would add your password reset logic with Supabase
      // const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      
      // For now we'll just simulate a successful request
      setTimeout(() => {
        setIsLoading(false);
        setSubmitted(true);
        toast({
          title: "Email sent",
          description: "Check your email for password reset instructions.",
        });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-1">
              <span className="text-healthcare-purple font-bold text-3xl">Med</span>
              <span className="text-healthcare-blue font-bold text-3xl">Connect</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m.johnson@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset instructions"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">
                Password reset instructions have been sent to <strong>{email}</strong>. 
                Please check your email and follow the instructions to reset your password.
              </p>
              <p className="text-sm text-gray-500">
                Didn't receive an email? Check your spam folder or <button 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setSubmitted(false)}
                >
                  try again
                </button>.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="w-full text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm">
              Back to sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
