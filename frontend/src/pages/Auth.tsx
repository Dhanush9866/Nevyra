import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForgotPassword from "@/components/ForgotPassword";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
<<<<<<< HEAD
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";
=======
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
>>>>>>> 14861496 (otp)

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  // Form errors
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});
  const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    navigate(from);
    return null;
  }

  // Validation functions
  const validateLoginForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!loginForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!loginForm.password) {
      errors.password = "Password is required";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!registerForm.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (registerForm.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }
    
    if (!registerForm.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (registerForm.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }
    
    if (!registerForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (registerForm.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(registerForm.phone.replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!registerForm.password) {
      errors.password = "Password is required";
    } else if (registerForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(registerForm.password)) {
      errors.password = "Password must contain uppercase, lowercase, number, and special character";
    }
    
    if (!registerForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    
    if (!validateLoginForm()) {
=======
    console.log("handleLogin called - this should only happen when login form is submitted");
    
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
>>>>>>> 14861496 (otp)
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Redirect to profile page after successful login
        navigate("/profile");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim() || undefined,
        password: registerForm.password,
        address: registerForm.address.trim() || undefined,
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Registration successful! Please login with your new account.",
        });
        // Redirect to login tab after successful registration
        setActiveTab("login");
        // Clear the registration form
        setRegisterForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          address: "",
        });
        // Pre-fill email in login form
        setLoginForm({
          email: registerForm.email.trim(),
          password: "",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const clearErrors = (formType: 'login' | 'register') => {
    if (formType === 'login') {
      setLoginErrors({});
    } else {
      setRegisterErrors({});
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        </div>
        <Footer />
      </div>
    );
  }
=======
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleForgotPassword called");
    
    if (!forgotPasswordEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsForgotPasswordLoading(true);
    try {
      const result = await apiService.forgotPassword(forgotPasswordEmail);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Password reset instructions have been sent to your email",
        });
        setIsForgotPasswordOpen(false);
        setIsOTPDialogOpen(true);
        // Don't clear the email here - we need it for OTP verification
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Handle specific error messages from the backend
      let errorMessage = "Failed to send reset instructions. Please try again.";
      
      if (error.message) {
        // Map backend error messages to user-friendly messages
        switch (error.message) {
          case "Email not found":
            errorMessage = "This email address is not registered with us. Please check your email or create a new account.";
            break;
          case "Email is required":
            errorMessage = "Please enter your email address.";
            break;
          case "Invalid email":
            errorMessage = "Please enter a valid email address.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleVerifyOTP called");
    
    console.log("handleVerifyOTP called with:", { otp, forgotPasswordEmail });
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (!forgotPasswordEmail) {
      toast({
        title: "Error",
        description: "Email not found. Please start the process again.",
        variant: "destructive",
      });
      return;
    }

    setIsOTPLoading(true);
    try {
      console.log("Making API call - Verifying OTP for email:", forgotPasswordEmail, "OTP:", otp);
      const result = await apiService.verifyOTP(forgotPasswordEmail, otp);
      if (result.success) {
        toast({
          title: "Success",
          description: "OTP verified successfully",
        });
        setIsOTPDialogOpen(false);
        setIsResetPasswordDialogOpen(true);
        // Don't clear the OTP here - we need it for password reset
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      let errorMessage = "Failed to verify OTP. Please try again.";
      
      if (error.message) {
        switch (error.message) {
          case "Email and OTP are required":
            errorMessage = "Please ensure both email and OTP are provided.";
            break;
          case "Invalid OTP":
            errorMessage = "The OTP you entered is incorrect. Please try again.";
            break;
          case "OTP expired":
            errorMessage = "The OTP has expired. Please request a new one.";
            break;
          case "Invalid request":
            errorMessage = "Invalid request. The OTP may have expired or the email is not valid. Please start the process again.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsOTPLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleResetPassword called");
    
    console.log("handleResetPassword called with:", { 
      newPassword: newPassword ? "***" : "empty", 
      confirmNewPassword: confirmNewPassword ? "***" : "empty",
      forgotPasswordEmail, 
      otp 
    });
    
    if (!newPassword || !confirmNewPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!forgotPasswordEmail || !otp) {
      toast({
        title: "Error",
        description: "Missing email or OTP. Please start the process again.",
        variant: "destructive",
      });
      return;
    }

    setIsResetPasswordLoading(true);
    try {
      console.log("Making API call - Resetting password for email:", forgotPasswordEmail, "OTP:", otp);
      const result = await apiService.resetPassword(forgotPasswordEmail, otp, newPassword);
      if (result.success) {
        toast({
          title: "Success",
          description: "Password reset successfully! You can now login with your new password.",
        });
        setIsResetPasswordDialogOpen(false);
        setNewPassword("");
        setConfirmNewPassword("");
        setForgotPasswordEmail("");
        setOtp("");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      let errorMessage = "Failed to reset password. Please try again.";
      
      if (error.message) {
        switch (error.message) {
          case "Invalid OTP":
            errorMessage = "The OTP is invalid. Please verify again.";
            break;
          case "OTP expired":
            errorMessage = "The OTP has expired. Please start the process again.";
            break;
          case "Password too weak":
            errorMessage = "Password is too weak. Please choose a stronger password.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResetPasswordLoading(false);
    }
  };
>>>>>>> 14861496 (otp)

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Nevyra</h1>
                <p className="text-muted-foreground">Your trusted shopping destination</p>
              </div>

              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                clearErrors(value === 'login' ? 'login' : 'register');
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${loginErrors.email ? 'border-red-500' : ''}`}
                          value={loginForm.email}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, email: e.target.value });
                            if (loginErrors.email) clearErrors('login');
                          }}
                          required
                        />
                      </div>
                      {loginErrors.email && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {loginErrors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className={`pl-10 pr-10 ${loginErrors.password ? 'border-red-500' : ''}`}
                          value={loginForm.password}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, password: e.target.value });
                            if (loginErrors.password) clearErrors('login');
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {loginErrors.password && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {loginErrors.password}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
<<<<<<< HEAD
                      <Button 
                        type="button"
                        variant="link" 
                        className="p-0 h-auto text-primary"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </Button>
=======
                      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            type="button"
                            variant="link" 
                            className="p-0 h-auto text-primary"
                          >
                            Forgot Password?
                          </Button>
                        </DialogTrigger>
                      </Dialog>
>>>>>>> 14861496 (otp)
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>

                  <div className="relative">
                

                  </div>

<<<<<<< HEAD
                  <Button variant="outline" className="w-full">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
=======
 
>>>>>>> 14861496 (otp)
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="register-firstName">First Name *</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-firstName"
                            type="text"
                            placeholder="First name"
                            className={`pl-10 ${registerErrors.firstName ? 'border-red-500' : ''}`}
                            value={registerForm.firstName}
                            onChange={(e) => {
                              setRegisterForm({ ...registerForm, firstName: e.target.value });
                              if (registerErrors.firstName) clearErrors('register');
                            }}
                            required
                          />
                        </div>
                        {registerErrors.firstName && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            {registerErrors.firstName}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="register-lastName">Last Name *</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-lastName"
                            type="text"
                            placeholder="Last name"
                            className={`pl-10 ${registerErrors.lastName ? 'border-red-500' : ''}`}
                            value={registerForm.lastName}
                            onChange={(e) => {
                              setRegisterForm({ ...registerForm, lastName: e.target.value });
                              if (registerErrors.lastName) clearErrors('register');
                            }}
                            required
                          />
                        </div>
                        {registerErrors.lastName && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            {registerErrors.lastName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email *</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${registerErrors.email ? 'border-red-500' : ''}`}
                          value={registerForm.email}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, email: e.target.value });
                            if (registerErrors.email) clearErrors('register');
                          }}
                          required
                        />
                      </div>
                      {registerErrors.email && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.email}
                        </div>
                      )}
                    </div>

                    {/* <div>
                      <Label htmlFor="register-phone">Phone Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className={`pl-10 ${registerErrors.phone ? 'border-red-500' : ''}`}
                          value={registerForm.phone}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, phone: e.target.value });
                            if (registerErrors.phone) clearErrors('register');
                          }}
                        />
                      </div>
<<<<<<< HEAD
                      {registerErrors.phone && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.phone}
                        </div>
                      )}
                    </div>
=======
                    </div> */}
>>>>>>> 14861496 (otp)

                    {/* <div>
                      <Label htmlFor="register-address">Address</Label>
                      <div className="relative mt-1">
                        <Input
                          id="register-address"
                          type="text"
                          placeholder="Enter your address"
                          value={registerForm.address}
                          onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                        />
                      </div>
                    </div> */}

                    <div>
                      <Label htmlFor="register-password">Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          className={`pl-10 pr-10 ${registerErrors.password ? 'border-red-500' : ''}`}
                          value={registerForm.password}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, password: e.target.value });
                            if (registerErrors.password) clearErrors('register');
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {registerErrors.password && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.password}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className={`pl-10 pr-10 ${registerErrors.confirmPassword ? 'border-red-500' : ''}`}
                          value={registerForm.confirmPassword}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                            if (registerErrors.confirmPassword) clearErrors('register');
                          }}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {registerErrors.confirmPassword && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {registerErrors.confirmPassword}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Button variant="link" className="p-0 h-auto text-primary">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-primary">
                        Privacy Policy
                      </Button>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>

                 
                </TabsContent>
              </Tabs>

              {/* Forgot Password Dialog */}
              <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your email address"
                          className="pl-10"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      We'll send you instructions to reset your password.
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsForgotPasswordOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1"
                        disabled={isForgotPasswordLoading}
                      >
                        {isForgotPasswordLoading ? "Sending..." : "Send Instructions"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* OTP Verification Dialog */}
              <Dialog open={isOTPDialogOpen} onOpenChange={setIsOTPDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Verify OTP</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Enter 6-digit OTP</Label>
                      <div className="relative mt-1">
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter OTP"
                          className="text-center text-lg tracking-widest"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          required
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        We've sent a 6-digit code to {forgotPasswordEmail}
                      </div>
                      <div className="text-center mt-2">
                        <Button 
                          type="button"
                          variant="link" 
                          className="p-0 h-auto text-primary text-sm"
                          onClick={async () => {
                            try {
                              const result = await apiService.forgotPassword(forgotPasswordEmail);
                              if (result.success) {
                                toast({
                                  title: "Success",
                                  description: "New OTP sent to your email",
                                });
                              }
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to resend OTP. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Didn't receive the code? Resend OTP
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setIsOTPDialogOpen(false);
                          setIsForgotPasswordOpen(true);
                        }}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1"
                        disabled={isOTPLoading}
                      >
                        {isOTPLoading ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Reset Password Dialog */}
              <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="pl-10 pr-10"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-new-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="pl-10 pr-10"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setIsResetPasswordDialogOpen(false);
                          setIsOTPDialogOpen(true);
                        }}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1"
                        disabled={isResetPasswordLoading}
                      >
                        {isResetPasswordLoading ? "Resetting..." : "Reset Password"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {activeTab === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setActiveTab("register")}
                    >
                      Sign up here
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setActiveTab("login")}
                    >
                      Login here
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;