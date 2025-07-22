import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetOTP, setResetOTP] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [otpLoading, setOTPLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const resendInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showOTPDialog) {
      setResendTimer(30);
      if (resendInterval.current) clearInterval(resendInterval.current);
      resendInterval.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (resendInterval.current) clearInterval(resendInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (resendInterval.current) clearInterval(resendInterval.current);
    }
    return () => {
      if (resendInterval.current) clearInterval(resendInterval.current);
    };
  }, [showOTPDialog]);

  const handleResendOTP = async () => {
    setForgotLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to resend OTP.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email.",
        });
        setResendTimer(30);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to resend OTP.",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Login failed",
          description: data.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      // Save token and email to localStorage
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userEmail", email);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google login",
      description: "Google login functionality would be implemented here.",
    });
  };

  const handleFacebookLogin = () => {
    toast({
      title: "Facebook login",
      description: "Facebook login functionality would be implemented here.",
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your email.",
        });
        setForgotOpen(false);
        setShowOTPDialog(true);
        setResetOTP("");
        setResetPassword("");
        setResetConfirmPassword("");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send OTP.",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOTPLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: resetOTP }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Invalid or expired OTP.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Verified",
          description: "You can now reset your password.",
        });
        setShowOTPDialog(false);
        setShowResetDialog(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to verify OTP.",
        variant: "destructive",
      });
    } finally {
      setOTPLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPassword !== resetConfirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setResetLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: resetOTP, newPassword: resetPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to reset password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Reset",
          description: "Your password has been reset. Please log in.",
        });
        setShowResetDialog(false);
        setForgotEmail("");
        setResetOTP("");
        setResetPassword("");
        setResetConfirmPassword("");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reset password.",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-background/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-xl">N</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="#"
                  className="text-sm text-primary hover:underline"
                  onClick={e => { e.preventDefault(); setForgotOpen(true); }}
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address to receive an OTP for password reset.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={forgotLoading}>
                {forgotLoading ? "Sending..." : "Send OTP"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to your email to verify your identity.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={resetOTP}
                onChange={e => setResetOTP(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || forgotLoading}
              >
                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
              </Button>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={otpLoading}>
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset My Password</DialogTitle>
            <DialogDescription>
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={resetConfirmPassword}
                onChange={e => setResetConfirmPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={resetLoading}>
                {resetLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login; 