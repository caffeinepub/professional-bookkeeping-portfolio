import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Briefcase,
  Calculator,
  CheckCircle2,
  DollarSign,
  Edit3,
  FileCheck,
  FileText,
  Heart,
  LogIn,
  LogOut,
  Mail,
  Plus,
  Receipt,
  Save,
  Sheet,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiQuickbooks } from "react-icons/si";
import { toast } from "sonner";
import type {
  AccountsPayable,
  AccountsReceivable,
  Experience,
  Service,
  Tool,
} from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetPortfolioData,
  useIsAdmin,
  useSubmitContactForm,
  useUpdateAbout,
  useUpdateAccountsPayable,
  useUpdateAccountsReceivable,
  useUpdateExperience,
  useUpdateService,
  useUpdateTool,
} from "../hooks/useQueries";

const NEW_ABOUT_TEXT =
  "I'm a virtual bookkeeper who enjoys helping business owners turn financial confusion into clarity and confident action. By optimizing processes, reconciling accounts, preparing financial reports, and maintaining clean financial records, I help businesses stay organized and financially informed. With experience handling accounts payable and receivable using QuickBooks, I bring a strong eye for detail and a commitment to accuracy so business owners can focus on growing their business. When you work with me, you gain more than just a bookkeeper—you gain a proactive financial partner dedicated to your success. I help business owners simplify the complexities of their finances so they can focus on growing their business with confidence. With accurate financial records and organized systems, your business can stay on top of its finances by accurately tracking its income and expenses, save valuable time, reduce costly errors, and make better, more informed decisions.";

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    company: "Plastic Consumer Corp",
    position: "Accounts Payable",
    duration: "",
    description:
      "Handled tasks such as recording expenses, bills, and bills payment, and preparing 2307 forms. Assisted with audit preparations and ensured financial records were complete and compliant with company policies.",
    focusAreas: [],
    keyExpertise: [
      "Recording expenses, bills, and bills payment",
      "Preparing 2307 forms",
      "Audit preparation",
      "Financial records compliance",
    ],
  },
  {
    company: "Motortrade Nationwide Corp",
    position: "Branch Secretary",
    duration: "",
    description:
      "Managed accounts receivable tasks including generating invoices, processing customer payments, and reconciling accounts. Assisted with audit preparations and ensured financial records were complete and compliant with company policies.",
    focusAreas: [],
    keyExpertise: [
      "Generating invoices",
      "Processing customer payments",
      "Account reconciliation",
      "Audit preparation",
      "Financial records compliance",
    ],
  },
  {
    company: "Sync2VA",
    position: "40-Hour Training — US GAAP",
    duration: "",
    description:
      "Recently completed a 40-hour training at Sync2VA focused on US GAAP, with deeper knowledge gained in key bookkeeping processes.",
    focusAreas: [],
    keyExpertise: [
      "Chart of Accounts setup",
      "Bank deposits",
      "Transaction recording",
      "Bank reconciliation",
      "Balance Sheet reporting",
      "Profit and Loss reporting",
      "QuickBooks Online",
    ],
  },
];

export function Portfolio() {
  const { data: portfolioData, isLoading } = useGetPortfolioData();
  const submitContactForm = useSubmitContactForm();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const updateExperience = useUpdateExperience();
  const updateService = useUpdateService();
  const updateAccountsPayable = useUpdateAccountsPayable();
  const updateAccountsReceivable = useUpdateAccountsReceivable();
  const updateTool = useUpdateTool();
  const updateAbout = useUpdateAbout();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  // Local state for editing
  const [editedAbout, setEditedAbout] = useState(NEW_ABOUT_TEXT);
  const [editedExperiences, setEditedExperiences] = useState<Experience[]>([]);
  const [editedServices, setEditedServices] = useState<Service[]>([]);
  const [editedAccountsPayable, setEditedAccountsPayable] =
    useState<AccountsPayable | null>(null);
  const [editedAccountsReceivable, setEditedAccountsReceivable] =
    useState<AccountsReceivable | null>(null);
  const [editedTools, setEditedTools] = useState<Tool[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  // Initialize edit state when data loads
  useEffect(() => {
    if (portfolioData && isEditMode) {
      setEditedAbout(portfolioData.about || NEW_ABOUT_TEXT);
      const PLACEHOLDER_COMPANIES = ["Acme Corp", "Bright Books LLC"];
      const rawExp = portfolioData.experience;
      const useDefault =
        rawExp.length === 0 ||
        rawExp.every((e) => PLACEHOLDER_COMPANIES.includes(e.company));
      setEditedExperiences(useDefault ? DEFAULT_EXPERIENCES : rawExp);
      setEditedServices(portfolioData.services);
      setEditedAccountsPayable(portfolioData.accountsPayable);
      setEditedAccountsReceivable(portfolioData.accountsReceivable || null);
      setEditedTools(portfolioData.tools);
    }
  }, [portfolioData, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await submitContactForm.mutateAsync({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        message: formData.message,
      });

      if (result.success) {
        toast.success(result.message);
        setFormData({ name: "", email: "", company: "", message: "" });
      }
    } catch (_error) {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleEditMode = () => {
    if (isEditMode && pendingChanges) {
      setShowConfirmDialog(true);
    } else {
      setIsEditMode(!isEditMode);
      setPendingChanges(false);
    }
  };

  const confirmExitEditMode = () => {
    setIsEditMode(false);
    setPendingChanges(false);
    setShowConfirmDialog(false);
  };

  const handleSaveAll = async () => {
    try {
      const promises: Promise<void>[] = [];

      // Update about
      if (editedAbout !== portfolioData?.about) {
        promises.push(updateAbout.mutateAsync(editedAbout));
      }

      // Update experiences
      editedExperiences.forEach((exp, index) => {
        if (
          JSON.stringify(exp) !==
          JSON.stringify(portfolioData?.experience[index])
        ) {
          promises.push(
            updateExperience.mutateAsync({ index, experience: exp }),
          );
        }
      });

      // Update services
      editedServices.forEach((service, index) => {
        if (
          JSON.stringify(service) !==
          JSON.stringify(portfolioData?.services[index])
        ) {
          promises.push(updateService.mutateAsync({ index, service }));
        }
      });

      // Update accounts payable
      if (
        editedAccountsPayable &&
        JSON.stringify(editedAccountsPayable) !==
          JSON.stringify(portfolioData?.accountsPayable)
      ) {
        promises.push(updateAccountsPayable.mutateAsync(editedAccountsPayable));
      }

      // Update accounts receivable
      if (
        editedAccountsReceivable &&
        JSON.stringify(editedAccountsReceivable) !==
          JSON.stringify(portfolioData?.accountsReceivable)
      ) {
        promises.push(
          updateAccountsReceivable.mutateAsync(editedAccountsReceivable),
        );
      }

      // Update tools
      editedTools.forEach((tool, index) => {
        if (
          JSON.stringify(tool) !== JSON.stringify(portfolioData?.tools[index])
        ) {
          promises.push(updateTool.mutateAsync({ index, tool }));
        }
      });

      await Promise.all(promises);
      toast.success("All changes saved successfully!");
      setPendingChanges(false);
      setIsEditMode(false);
    } catch (_error) {
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const updateExperienceField = (
    index: number,
    field: keyof Experience,
    value: any,
  ) => {
    const updated = [...editedExperiences];
    updated[index] = { ...updated[index], [field]: value };
    setEditedExperiences(updated);
    setPendingChanges(true);
  };

  const updateAPExpertise = (index: number, value: string) => {
    if (!editedAccountsPayable) return;
    const expertise = [...editedAccountsPayable.keyExpertise];
    expertise[index] = value;
    setEditedAccountsPayable({
      ...editedAccountsPayable,
      keyExpertise: expertise,
    });
    setPendingChanges(true);
  };

  const addAPExpertise = () => {
    if (!editedAccountsPayable) return;
    setEditedAccountsPayable({
      ...editedAccountsPayable,
      keyExpertise: [...editedAccountsPayable.keyExpertise, ""],
    });
    setPendingChanges(true);
  };

  const removeAPExpertise = (index: number) => {
    if (!editedAccountsPayable) return;
    const expertise = [...editedAccountsPayable.keyExpertise];
    expertise.splice(index, 1);
    setEditedAccountsPayable({
      ...editedAccountsPayable,
      keyExpertise: expertise,
    });
    setPendingChanges(true);
  };

  const updateARExpertise = (index: number, value: string) => {
    if (!editedAccountsReceivable) return;
    const expertise = [...editedAccountsReceivable.keyExpertise];
    expertise[index] = value;
    setEditedAccountsReceivable({
      ...editedAccountsReceivable,
      keyExpertise: expertise,
    });
    setPendingChanges(true);
  };

  const addARExpertise = () => {
    if (!editedAccountsReceivable) return;
    setEditedAccountsReceivable({
      ...editedAccountsReceivable,
      keyExpertise: [...editedAccountsReceivable.keyExpertise, ""],
    });
    setPendingChanges(true);
  };

  const removeARExpertise = (index: number) => {
    if (!editedAccountsReceivable) return;
    const expertise = [...editedAccountsReceivable.keyExpertise];
    expertise.splice(index, 1);
    setEditedAccountsReceivable({
      ...editedAccountsReceivable,
      keyExpertise: expertise,
    });
    setPendingChanges(true);
  };

  const updateToolField = (index: number, field: keyof Tool, value: string) => {
    const updated = [...editedTools];
    updated[index] = { ...updated[index], [field]: value };
    setEditedTools(updated);
    setPendingChanges(true);
  };

  const isAuthenticated = !!identity;
  const showEditToggle = isAuthenticated && isAdmin && !isAdminLoading;

  // Use default experiences if the backend still has placeholder data
  const PLACEHOLDER_COMPANIES = ["Acme Corp", "Bright Books LLC"];
  const backendExperiences = portfolioData?.experience || [];
  const displayExperiences =
    backendExperiences.length > 0 &&
    !backendExperiences.every((e) => PLACEHOLDER_COMPANIES.includes(e.company))
      ? backendExperiences
      : DEFAULT_EXPERIENCES;

  // Filter out services that have detailed cards
  const generalServices =
    (isEditMode ? editedServices : portfolioData?.services)?.filter(
      (service) =>
        service.title !== "Accounts Payable Management" &&
        service.title !== "Accounts Receivable Management",
    ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                Professional Bookkeeping
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("experience")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Experience
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("tools")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Expertise
              </button>
              <Button onClick={() => scrollToSection("contact")} size="sm">
                Contact
              </Button>

              {/* Auth Button */}
              {isAuthenticated ? (
                <Button onClick={clear} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={login}
                  variant="outline"
                  size="sm"
                  disabled={isLoggingIn}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Edit Mode Toggle */}
      {showEditToggle && (
        <div className="sticky top-16 z-40 border-b bg-accent/10 backdrop-blur">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={isEditMode}
                  onCheckedChange={toggleEditMode}
                  id="edit-mode"
                />
                <Label
                  htmlFor="edit-mode"
                  className="cursor-pointer font-medium"
                >
                  {isEditMode ? "Edit Mode Active" : "Enable Edit Mode"}
                </Label>
              </div>
              {isEditMode && (
                <div className="flex items-center gap-2">
                  {pendingChanges && (
                    <Badge variant="secondary" className="animate-pulse">
                      Unsaved Changes
                    </Badge>
                  )}
                  <Button
                    onClick={handleSaveAll}
                    size="sm"
                    disabled={!pendingChanges}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                  </Button>
                  <Button onClick={toggleEditMode} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to exit edit mode?
              All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExitEditMode}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Award className="h-3 w-3 mr-1" />
                Professional Bookkeeping Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Virtual Bookkeeper
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experienced bookkeeper and accounts payable/receivable
                specialist dedicated to maintaining the highest standards of
                accuracy, reliability, and financial clarity for your business.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => scrollToSection("contact")}>
                  Get in Touch
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("services")}
                >
                  View Services
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/uploads/irish_2x2-Pic-1.jpg"
                alt="Professional headshot"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                About Me
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-primary mb-4 tracking-wide">
                Iris Greziel Espanto
              </p>
              <Separator className="w-24 mx-auto" />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : (
              <div className="space-y-6">
                {isEditMode ? (
                  <div className="space-y-2">
                    <Label>About Content</Label>
                    <Textarea
                      value={editedAbout}
                      onChange={(e) => {
                        setEditedAbout(e.target.value);
                        setPendingChanges(true);
                      }}
                      className="min-h-[120px]"
                    />
                  </div>
                ) : (
                  <p className="text-lg text-muted-foreground leading-relaxed text-center">
                    {NEW_ABOUT_TEXT}
                  </p>
                )}

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Accuracy
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Meticulous attention to detail ensuring error-free
                        financial records
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Reliability
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Consistent, dependable service you can count on
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileCheck className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Expertise
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Years account payables, accounts receivable,
                        bookkeeping, and financial management
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="py-20 bg-gradient-to-br from-accent/5 to-background"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Experience
              </h2>
              <Separator className="w-24 mx-auto" />
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <div className="space-y-8">
                {(isEditMode ? editedExperiences : displayExperiences).map(
                  (exp, index) => (
                    <Card
                      key={exp.company || `exp-${index}`}
                      className="border-2"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {isEditMode ? (
                              <>
                                <Input
                                  value={exp.position}
                                  onChange={(e) =>
                                    updateExperienceField(
                                      index,
                                      "position",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Position"
                                  className="font-semibold"
                                />
                                <Input
                                  value={exp.company}
                                  onChange={(e) =>
                                    updateExperienceField(
                                      index,
                                      "company",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Company"
                                />
                              </>
                            ) : (
                              <>
                                <CardTitle className="text-xl mb-1">
                                  {exp.position}
                                </CardTitle>
                                <CardDescription className="text-base font-medium text-foreground">
                                  {exp.company}
                                </CardDescription>
                              </>
                            )}
                          </div>
                          {isEditMode ? (
                            <Input
                              value={exp.duration}
                              onChange={(e) =>
                                updateExperienceField(
                                  index,
                                  "duration",
                                  e.target.value,
                                )
                              }
                              placeholder="Duration"
                              className="w-32"
                            />
                          ) : exp.duration ? (
                            <Badge variant="secondary">{exp.duration}</Badge>
                          ) : null}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {isEditMode ? (
                          <Textarea
                            value={exp.description}
                            onChange={(e) =>
                              updateExperienceField(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Description"
                            className="min-h-[80px]"
                          />
                        ) : (
                          <p className="text-muted-foreground">
                            {exp.description}
                          </p>
                        )}

                        {exp.focusAreas.length > 0 && (
                          <div className="space-y-3 pt-4 border-t">
                            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-primary" />
                              Key Focus Areas
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {exp.focusAreas.map((area) => (
                                <div
                                  key={area.title}
                                  className="flex gap-3 p-3 rounded-lg bg-secondary/50"
                                >
                                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                  <div>
                                    <h5 className="font-medium text-sm text-foreground mb-1">
                                      {area.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground">
                                      {area.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Services
              </h2>
              <Separator className="w-24 mx-auto" />
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Comprehensive bookkeeping and financial management services
                tailored to your business needs
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            ) : (
              <div className="space-y-8">
                {/* General Services Grid */}
                {generalServices.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {generalServices.map((service) => (
                      <Card
                        key={service.title}
                        className="border-2 hover:border-primary/50 transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">
                                {service.title}
                              </CardTitle>
                              <CardDescription className="text-sm leading-relaxed">
                                {service.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Bookkeeper Service Card */}
                <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/40 to-background dark:from-emerald-950/20">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                        <Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          Bookkeeper
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Accurate and up-to-date financial record management —
                          from recording every transaction to producing clear
                          financial statements that keep your business informed
                          and compliant.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Key Expertise
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "Recording Transactions",
                          "Chart of Accounts",
                          "Reconciling Accounts",
                          "Account Payables",
                          "Account Receivable",
                          "Payroll Processing",
                          "Financial Reporting",
                          "Balance Sheet",
                          "Profit and Loss Statement",
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2 p-2 rounded-md bg-emerald-50/60 dark:bg-emerald-950/30 w-full"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Accounts Payable Section */}
                {(isEditMode
                  ? editedAccountsPayable
                  : portfolioData?.accountsPayable) && (
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Receipt className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          {isEditMode && editedAccountsPayable ? (
                            <>
                              <Input
                                value={editedAccountsPayable.title}
                                onChange={(e) => {
                                  setEditedAccountsPayable({
                                    ...editedAccountsPayable,
                                    title: e.target.value,
                                  });
                                  setPendingChanges(true);
                                }}
                                className="font-semibold"
                              />
                              <Textarea
                                value={editedAccountsPayable.description}
                                onChange={(e) => {
                                  setEditedAccountsPayable({
                                    ...editedAccountsPayable,
                                    description: e.target.value,
                                  });
                                  setPendingChanges(true);
                                }}
                                className="min-h-[60px]"
                              />
                            </>
                          ) : (
                            <>
                              <CardTitle className="text-xl mb-2">
                                {portfolioData?.accountsPayable.title}
                              </CardTitle>
                              <CardDescription className="text-base leading-relaxed">
                                {portfolioData?.accountsPayable.description}
                              </CardDescription>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Key Expertise
                          </h4>
                          {isEditMode && (
                            <Button
                              onClick={addAPExpertise}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {(isEditMode
                            ? editedAccountsPayable?.keyExpertise
                            : portfolioData?.accountsPayable.keyExpertise
                          )?.map((expertise, idx) => (
                            <div
                              key={`ap-expertise-item-${expertise}`}
                              className="flex items-center gap-2"
                            >
                              {isEditMode ? (
                                <>
                                  <Input
                                    value={expertise}
                                    onChange={(e) =>
                                      updateAPExpertise(idx, e.target.value)
                                    }
                                    className="flex-1"
                                  />
                                  <Button
                                    onClick={() => removeAPExpertise(idx)}
                                    size="sm"
                                    variant="ghost"
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              ) : (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-background/50 w-full">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">
                                    {expertise}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Detailed Accounts Receivable Section */}
                {(isEditMode
                  ? editedAccountsReceivable
                  : portfolioData?.accountsReceivable) && (
                  <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div className="flex-1 space-y-2">
                          {isEditMode && editedAccountsReceivable ? (
                            <>
                              <Input
                                value={editedAccountsReceivable.title}
                                onChange={(e) => {
                                  setEditedAccountsReceivable({
                                    ...editedAccountsReceivable,
                                    title: e.target.value,
                                  });
                                  setPendingChanges(true);
                                }}
                                className="font-semibold"
                              />
                              <Textarea
                                value={editedAccountsReceivable.description}
                                onChange={(e) => {
                                  setEditedAccountsReceivable({
                                    ...editedAccountsReceivable,
                                    description: e.target.value,
                                  });
                                  setPendingChanges(true);
                                }}
                                className="min-h-[60px]"
                              />
                            </>
                          ) : (
                            <>
                              <CardTitle className="text-xl mb-2">
                                {portfolioData?.accountsReceivable?.title}
                              </CardTitle>
                              <CardDescription className="text-base leading-relaxed">
                                {portfolioData?.accountsReceivable?.description}
                              </CardDescription>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                            Key Expertise
                          </h4>
                          {isEditMode && (
                            <Button
                              onClick={addARExpertise}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {(isEditMode
                            ? editedAccountsReceivable?.keyExpertise
                            : portfolioData?.accountsReceivable?.keyExpertise
                          )?.map((expertise, idx) => (
                            <div
                              key={`ar-expertise-item-${expertise}`}
                              className="flex items-center gap-2"
                            >
                              {isEditMode ? (
                                <>
                                  <Input
                                    value={expertise}
                                    onChange={(e) =>
                                      updateARExpertise(idx, e.target.value)
                                    }
                                    className="flex-1"
                                  />
                                  <Button
                                    onClick={() => removeARExpertise(idx)}
                                    size="sm"
                                    variant="ghost"
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              ) : (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-background/50 w-full">
                                  <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">
                                    {expertise}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tools & Expertise Section */}
      <section
        id="tools"
        className="py-20 bg-gradient-to-br from-primary/5 to-background"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tools & Expertise
              </h2>
              <Separator className="w-24 mx-auto" />
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {(isEditMode
                  ? editedTools
                  : (() => {
                      const base = portfolioData?.tools || [];
                      const names = base.map((t) => t.name);
                      const fallbacks: Tool[] = [];
                      if (!names.includes("SAP"))
                        fallbacks.push({
                          name: "SAP",
                          icon: "sap-icon.svg",
                          expertiseLevel: "Proficient",
                          notes:
                            "Experience using SAP for financial transactions and record keeping.",
                        } as Tool);
                      if (!names.includes("QuickBooks"))
                        fallbacks.push({
                          name: "QuickBooks",
                          icon: "quickbooks-icon.svg",
                          expertiseLevel: "Advanced",
                          notes:
                            "Proficient in QuickBooks Online: Chart of Accounts setup, bank deposits, transaction recording, bank reconciliation, and financial reports.",
                        } as Tool);
                      if (!names.includes("Google Workspace"))
                        fallbacks.push({
                          name: "Google Workspace",
                          icon: "google-icon.svg",
                          expertiseLevel: "Proficient",
                          notes:
                            "Uses Google Sheets, Docs, Drive, and Gmail to manage financial data, collaborate with clients, and organize records efficiently.",
                        } as Tool);
                      if (!names.includes("Microsoft Office"))
                        fallbacks.push({
                          name: "Microsoft Office",
                          icon: "msoffice-icon.svg",
                          expertiseLevel: "Proficient",
                          notes:
                            "Skilled in Microsoft Excel, Word, and Outlook for spreadsheets, financial reports, document preparation, and professional communication.",
                        } as Tool);
                      return [...base, ...fallbacks];
                    })()
                ).map((tool, index) => {
                  const getIcon = () => {
                    if (tool.name === "QuickBooks")
                      return (
                        <SiQuickbooks className="h-12 w-12 text-primary" />
                      );
                    if (
                      tool.name === "Microsoft Office" ||
                      tool.name === "Microsoft Excel"
                    )
                      return <Sheet className="h-12 w-12 text-primary" />;
                    if (tool.name === "Google Workspace")
                      return (
                        <svg
                          className="h-12 w-12 text-primary"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          role="img"
                          aria-label="Google Workspace"
                        >
                          <title>Google Workspace</title>
                          <path d="M12 11.245l-8.75 5.054V7.7L12 2.646 20.75 7.7v8.599L12 11.245zm0 1.51l8.75 5.054-8.75 5.054L3.25 17.81 12 12.755z" />
                        </svg>
                      );
                    return <Award className="h-12 w-12 text-primary" />;
                  };

                  return (
                    <Card
                      key={tool.name || `tool-${index}`}
                      className="border-2 text-center"
                    >
                      <CardContent className="pt-8 pb-6 space-y-4">
                        <div className="flex justify-center">
                          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            {getIcon()}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {isEditMode ? (
                            <>
                              <Input
                                value={tool.name}
                                onChange={(e) =>
                                  updateToolField(index, "name", e.target.value)
                                }
                                className="text-center font-bold"
                              />
                              <Input
                                value={tool.expertiseLevel}
                                onChange={(e) =>
                                  updateToolField(
                                    index,
                                    "expertiseLevel",
                                    e.target.value,
                                  )
                                }
                                className="text-center"
                              />
                              <Textarea
                                value={tool.notes}
                                onChange={(e) =>
                                  updateToolField(
                                    index,
                                    "notes",
                                    e.target.value,
                                  )
                                }
                                className="min-h-[80px] text-sm"
                              />
                            </>
                          ) : (
                            <>
                              <h3 className="font-bold text-lg text-foreground mb-1">
                                {tool.name}
                              </h3>
                              <Badge variant="secondary" className="mb-3">
                                {tool.expertiseLevel}
                              </Badge>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {tool.notes}
                              </p>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="mt-12">
              <img
                src="/assets/generated/quickbooks-expertise.dim_400x200.png"
                alt="QuickBooks expertise"
                className="rounded-xl shadow-lg w-full max-w-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <Separator className="w-24 mx-auto" />
              <p className="text-muted-foreground mt-4">
                Ready to discuss your bookkeeping needs? Send me a message and
                I'll get back to you promptly.
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your bookkeeping needs..."
                      className="min-h-[150px] resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitContactForm.isPending}
                  >
                    {submitContactForm.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              © 2025. Built with{" "}
              <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{" "}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
