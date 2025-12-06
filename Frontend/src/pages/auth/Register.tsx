// src/pages/auth/Register.tsx
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, User, Building2, Sprout } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";

type UserType = 'farmer' | 'company';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as UserType) || 'farmer';
  
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(initialType);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1 && !userType) {
      toast({
        title: "Please select account type",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2) {
      if (!formData.email || !formData.password || !formData.name) {
        toast({
          title: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          variant: "destructive"
        });
        return;
      }
      if (formData.password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms) {
      toast({
        title: "Please accept the terms",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType
      });

      if (result.success) {
        toast({
          title: "Account created!",
          description: "Welcome to Karbo. Let's get started!"
        });

        // Auto login after registration
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userRole', userType);
          localStorage.setItem('userId', result.user?._id || '');
        }

        navigate(userType === 'farmer' ? '/farmer/dashboard' : '/company/dashboard');
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Something went wrong",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">Karbo</span>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Select Type */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create your account</h1>
                  <p className="text-muted-foreground">Choose your account type to get started</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('farmer')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      userType === 'farmer' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Sprout className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">I'm a Farmer</h3>
                    <p className="text-sm text-muted-foreground">Earn money from sustainable practices</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType('company')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      userType === 'company' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Building2 className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">I'm a Company</h3>
                    <p className="text-sm text-muted-foreground">Purchase credits for sustainability</p>
                  </button>
                </div>

                <Button variant="hero" className="w-full" size="lg" onClick={handleNext}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Account Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">Account details</h1>
                  <p className="text-muted-foreground">Set up your login credentials</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" size="lg" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="hero" className="flex-1" size="lg" onClick={handleNext}>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Terms & Submit */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                    Almost there!
                  </h1>
                  <p className="text-muted-foreground">Review and accept our terms to complete registration</p>
                </div>

                <div className="p-6 bg-muted/50 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium text-foreground">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-foreground">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span className="font-medium text-foreground capitalize">{userType}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" size="lg" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="hero" className="flex-1" size="lg" type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary items-center justify-center p-16">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8">
            {userType === 'farmer' ? (
              <Sprout className="w-10 h-10 text-primary-foreground" />
            ) : (
              <Building2 className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            {userType === 'farmer' 
              ? 'Start Earning from Sustainability' 
              : 'Meet Your Green Goals'
            }
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            {userType === 'farmer'
              ? 'Turn your eco-friendly farming practices into real income. Join thousands of farmers already earning.'
              : 'Access verified carbon credits from sustainable farms worldwide. Achieve compliance with confidence.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;