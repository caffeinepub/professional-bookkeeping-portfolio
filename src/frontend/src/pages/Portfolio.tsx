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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Calculator,
  CheckCircle2,
  DollarSign,
  Eye,
  FileCheck,
  FileText,
  Heart,
  Inbox,
  Linkedin,
  LogIn,
  LogOut,
  Mail,
  Phone,
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
  ContactInquiry,
  Experience,
  Service,
  Tool,
} from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteContactInquiry,
  useGetContactInquiries,
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
  const [showInbox, setShowInbox] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactInquiry | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiry | null>(null);

  const { data: contactInquiries, isLoading: isInboxLoading } =
    useGetContactInquiries();
  const deleteInquiry = useDeleteContactInquiry();

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
    value: string | string[],
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
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/assets/uploads/logo-1.png"
                alt="Iris Greziel Espanto Bookkeeper Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-semibold font-serif text-foreground">
                Professional Bookkeeping
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button
                type="button"
                onClick={() => {
                  setShowInbox(false);
                  scrollToSection("about");
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-ocid="nav.about.link"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInbox(false);
                  scrollToSection("experience");
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-ocid="nav.experience.link"
              >
                Experience
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInbox(false);
                  scrollToSection("services");
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-ocid="nav.services.link"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInbox(false);
                  scrollToSection("tools");
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-ocid="nav.tools.link"
              >
                Expertise
              </button>
              {isAdmin && (
                <button
                  type="button"
                  data-ocid="nav.inbox.button"
                  onClick={() => setShowInbox(true)}
                  className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Inbox className="h-4 w-4" />
                  Inbox
                  {contactInquiries && contactInquiries.length > 0 && (
                    <span className="absolute -top-1.5 -right-3.5 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {contactInquiries.length}
                    </span>
                  )}
                </button>
              )}
              <Button
                onClick={() => {
                  setShowInbox(false);
                  scrollToSection("contact");
                }}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="nav.contact.button"
              >
                Contact
              </Button>

              {/* Auth Button */}
              {isAuthenticated ? (
                <Button
                  onClick={clear}
                  variant="outline"
                  size="sm"
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={login}
                  variant="outline"
                  size="sm"
                  disabled={isLoggingIn}
                  data-ocid="nav.login.button"
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
      {showEditToggle && !showInbox && (
        <div className="sticky top-16 z-40 bg-secondary/50 border-b border-border backdrop-blur">
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
                    data-ocid="edit.save.button"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                  </Button>
                  <Button
                    onClick={toggleEditMode}
                    variant="outline"
                    size="sm"
                    data-ocid="edit.cancel.button"
                  >
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
        <AlertDialogContent data-ocid="edit.confirm.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to exit edit mode?
              All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="edit.confirm.cancel_button">
              Continue Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExitEditMode}
              data-ocid="edit.confirm.confirm_button"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Messages Inbox View */}
      {showInbox && isAdmin && (
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-10">
            <div className="max-w-4xl mx-auto">
              {/* Inbox Header */}
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="inbox.back.button"
                  onClick={() => setShowInbox(false)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Portfolio
                </Button>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Inbox className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold font-serif text-foreground">
                    Messages Inbox
                  </h1>
                </div>
                <p className="text-muted-foreground ml-[52px]">
                  Messages sent through your contact form
                </p>
              </div>

              <div className="w-16 h-0.5 bg-primary rounded-full mb-8" />

              {/* Loading State */}
              {isInboxLoading && (
                <div className="space-y-4" data-ocid="inbox.loading_state">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              )}

              {/* Empty State */}
              {!isInboxLoading &&
                (!contactInquiries || contactInquiries.length === 0) && (
                  <div
                    data-ocid="inbox.empty_state"
                    className="text-center py-20 px-4"
                  >
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No messages yet
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      When visitors send you a message through the contact form,
                      it will appear here.
                    </p>
                  </div>
                )}

              {/* Message List */}
              {!isInboxLoading &&
                contactInquiries &&
                contactInquiries.length > 0 && (
                  <div className="space-y-4">
                    {contactInquiries.map((inquiry, index) => {
                      const rawTs = Number(inquiry.timestamp);
                      const dateStr =
                        rawTs === 0
                          ? "Date not recorded"
                          : new Date(rawTs / 1_000_000).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            );
                      const truncatedMsg =
                        inquiry.message.length > 100
                          ? `${inquiry.message.slice(0, 100)}…`
                          : inquiry.message;

                      return (
                        <Card
                          key={String(inquiry.id)}
                          className="border border-border hover:border-primary/40 transition-colors shadow-card"
                          data-ocid={`inbox.message.item.${index + 1}`}
                        >
                          <CardContent className="pt-5 pb-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-foreground">
                                    {inquiry.name}
                                  </span>
                                  {inquiry.company && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {inquiry.company}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {inquiry.email}
                                </p>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                  {truncatedMsg}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {dateStr}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  data-ocid={`inbox.message.view.${index + 1}`}
                                  onClick={() => setSelectedMessage(inquiry)}
                                  className="flex items-center gap-1.5 hover:border-primary/50 hover:text-primary"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  data-ocid={`inbox.message.delete.${index + 1}`}
                                  onClick={() => setDeleteTarget(inquiry)}
                                  className="flex items-center gap-1.5 text-destructive hover:text-destructive hover:border-destructive/50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </main>
      )}

      {/* View Message Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={(open) => {
          if (!open) setSelectedMessage(null);
        }}
      >
        <DialogContent className="max-w-lg" data-ocid="inbox.dialog">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              Message Details
            </DialogTitle>
            <DialogDescription>
              Full message from {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage &&
            (() => {
              const rawTs = Number(selectedMessage.timestamp);
              const dateStr =
                rawTs === 0
                  ? "Date not recorded"
                  : new Date(rawTs / 1_000_000).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
              return (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedMessage.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-medium text-foreground break-all">
                        {selectedMessage.email}
                      </p>
                    </div>
                    {selectedMessage.company && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Company
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedMessage.company}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {dateStr}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Message
                    </p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      data-ocid="inbox.dialog.close_button"
                      onClick={() => setSelectedMessage(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="inbox.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the message from{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="inbox.delete.cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="inbox.delete.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!deleteTarget) return;
                try {
                  await deleteInquiry.mutateAsync(deleteTarget.id);
                  toast.success("Message deleted successfully.");
                  setDeleteTarget(null);
                } catch {
                  toast.error("Failed to delete message. Please try again.");
                }
              }}
            >
              {deleteInquiry.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Portfolio Content */}
      {!showInbox && (
        <>
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-background to-secondary/30 overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            {/* Large decorative background word */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="text-[8rem] md:text-[12rem] font-serif font-bold text-primary/5 leading-none whitespace-nowrap">
                BOOKKEEPER
              </span>
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  {/* Gold accent line */}
                  <div className="w-16 h-1 bg-primary rounded-full" />
                  <Badge
                    variant="outline"
                    className="w-fit border border-primary/40 bg-primary/10 text-primary"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Professional Bookkeeping Services
                  </Badge>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight text-foreground">
                    Virtual Bookkeeper
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Experienced bookkeeper and accounts payable/receivable
                    specialist dedicated to maintaining the highest standards of
                    accuracy, reliability, and financial clarity for your
                    business.
                  </p>
                  <p className="text-primary font-medium text-lg">
                    Your finances, handled with precision.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => scrollToSection("contact")}
                      data-ocid="hero.contact.primary_button"
                    >
                      Get in Touch
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => scrollToSection("services")}
                      data-ocid="hero.services.secondary_button"
                    >
                      View Services
                    </Button>
                  </div>
                </div>
                <div className="relative flex justify-center">
                  <img
                    src="/assets/uploads/irish_2x2-Pic-1.jpg"
                    alt="Professional headshot"
                    className="rounded-2xl w-full max-w-md mx-auto ring-4 ring-primary/30 ring-offset-4 ring-offset-background shadow-[0_0_60px_oklch(0.78_0.14_80/_0.25)]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section
            id="about"
            className="py-20 bg-background relative overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">
                    About Me
                  </h2>
                  <p className="text-3xl md:text-4xl font-bold font-serif text-primary mb-4 tracking-wide">
                    Iris Greziel Espanto
                  </p>
                  <div className="w-16 h-0.5 bg-primary rounded-full mx-auto mt-2 mb-8" />
                </div>

                {isLoading ? (
                  <div className="space-y-4" data-ocid="about.loading_state">
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
                          data-ocid="about.textarea"
                        />
                      </div>
                    ) : (
                      <p className="text-lg text-muted-foreground leading-relaxed text-center">
                        {NEW_ABOUT_TEXT}
                      </p>
                    )}

                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                      <Card className="text-center bg-secondary border border-border border-t-2 border-t-primary hover:border-primary/40 transition-colors shadow-card">
                        <CardContent className="pt-6">
                          <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
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

                      <Card className="text-center bg-secondary border border-border border-t-2 border-t-primary hover:border-primary/40 transition-colors shadow-card">
                        <CardContent className="pt-6">
                          <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
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

                      <Card className="text-center bg-secondary border border-border border-t-2 border-t-primary hover:border-primary/40 transition-colors shadow-card">
                        <CardContent className="pt-6">
                          <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
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
          <section id="experience" className="py-20 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
                    Experience
                  </h2>
                  <div className="w-16 h-0.5 bg-primary rounded-full mx-auto mt-2 mb-8" />
                </div>

                {isLoading ? (
                  <div
                    className="space-y-6"
                    data-ocid="experience.loading_state"
                  >
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {(isEditMode ? editedExperiences : displayExperiences).map(
                      (exp, index) => (
                        <Card
                          key={exp.company || `exp-${index}`}
                          className="border border-border bg-card hover:border-primary/30 shadow-card transition-all"
                          data-ocid={`experience.item.${index + 1}`}
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
                                    <CardTitle className="text-xl mb-1 font-serif">
                                      {exp.position}
                                    </CardTitle>
                                    <CardDescription className="text-base font-medium text-primary">
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
                                <Badge variant="secondary">
                                  {exp.duration}
                                </Badge>
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
                              <div className="space-y-3 pt-4 border-t border-border">
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
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
                    Services
                  </h2>
                  <div className="w-16 h-0.5 bg-primary rounded-full mx-auto mt-2 mb-4" />
                  <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Comprehensive bookkeeping and financial management services
                    tailored to your business needs
                  </p>
                </div>

                {isLoading ? (
                  <div
                    className="grid md:grid-cols-2 gap-6"
                    data-ocid="services.loading_state"
                  >
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Why Work With Me callout */}
                    <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/8 to-transparent border border-primary/25">
                      <p className="text-lg font-semibold text-primary font-serif mb-1">
                        Why Work With Me?
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        I bring precision, reliability, and QuickBooks expertise
                        to every engagement — so you can focus on growing your
                        business while I keep your finances spotless.
                      </p>
                    </div>

                    {/* General Services Grid */}
                    {generalServices.length > 0 && (
                      <div className="grid md:grid-cols-2 gap-6">
                        {generalServices.map((service) => (
                          <Card
                            key={service.title}
                            className="border border-border bg-card hover:border-primary/40 shadow-card transition-all"
                          >
                            <CardHeader>
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
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
                    <Card className="border border-primary/30 bg-gradient-to-br from-primary/8 to-card shadow-card">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                            <Calculator className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2 font-serif">
                              Bookkeeper
                            </CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                              Accurate and up-to-date financial record
                              management — from recording every transaction to
                              producing clear financial statements that keep
                              your business informed and compliant.
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Key Expertise
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {[
                              "Recording Transactions",
                              "Chart of Accounts",
                              "Reconciling Accounts",
                              "Account Payables",
                              "Accounts Receivable",
                              "Payroll Processing",
                              "Financial Reporting",
                              "Balance Sheet",
                              "Profit and Loss Statement",
                            ].map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-2 p-2 rounded-md bg-primary/10 w-full"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                <span className="text-sm text-foreground">
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
                      <Card className="border border-primary/25 bg-card shadow-card">
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
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
                                  <CardTitle className="text-xl mb-2 font-serif">
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
                                    <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 w-full">
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
                      <Card className="border border-accent/25 bg-card shadow-card">
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                              <DollarSign className="h-6 w-6 text-primary" />
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
                                  <CardTitle className="text-xl mb-2 font-serif">
                                    {portfolioData?.accountsReceivable?.title}
                                  </CardTitle>
                                  <CardDescription className="text-base leading-relaxed">
                                    {
                                      portfolioData?.accountsReceivable
                                        ?.description
                                    }
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
                                : portfolioData?.accountsReceivable
                                    ?.keyExpertise
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
                                    <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 w-full">
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
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Tools & Expertise Section */}
          <section id="tools" className="py-20 bg-secondary/15">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
                    Tools & Expertise
                  </h2>
                  <div className="w-16 h-0.5 bg-primary rounded-full mx-auto mt-2 mb-8" />
                </div>

                {isLoading ? (
                  <div
                    className="grid md:grid-cols-3 gap-6"
                    data-ocid="tools.loading_state"
                  >
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
                          className="border border-border bg-card hover:border-primary/40 shadow-card text-center transition-all"
                          data-ocid={`tools.item.${index + 1}`}
                        >
                          <CardContent className="pt-8 pb-6 space-y-4">
                            <div className="flex justify-center">
                              <div className="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center">
                                {getIcon()}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {isEditMode ? (
                                <>
                                  <Input
                                    value={tool.name}
                                    onChange={(e) =>
                                      updateToolField(
                                        index,
                                        "name",
                                        e.target.value,
                                      )
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
                                  <Badge
                                    variant="outline"
                                    className="mb-3 border border-primary/30 text-primary bg-primary/10"
                                  >
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
                  <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
                    Get in Touch
                  </h2>
                  <div className="w-16 h-0.5 bg-primary rounded-full mx-auto mt-2 mb-4" />
                  <p className="text-muted-foreground mt-4">
                    Ready to discuss your bookkeeping needs? Send me a message
                    and I'll get back to you promptly.
                  </p>
                </div>

                <p className="text-center text-primary font-medium mb-6">
                  Let's work together — reach out today.
                </p>

                <Card className="border border-border bg-card shadow-card">
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
                            data-ocid="contact.name.input"
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
                            data-ocid="contact.email.input"
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
                          data-ocid="contact.company.input"
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
                          data-ocid="contact.message.textarea"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={submitContactForm.isPending}
                        data-ocid="contact.submit.button"
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
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        If you are unable to reach me here, you may contact me
                        using the contact information provided below.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-secondary/30 border-t border-border backdrop-blur-sm py-10">
            <div className="container mx-auto px-4">
              {/* Gold gradient top line */}
              <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-8" />
              <div className="flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
                <p className="text-lg font-semibold font-serif text-primary">
                  Iris Greziel Espanto
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="tel:+639150528906"
                    data-ocid="footer.phone.link"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    +63 915 052 8906
                  </a>
                  <a
                    href="mailto:irisgrezielespanto@gmail.com"
                    data-ocid="footer.email.link"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    irisgrezielespanto@gmail.com
                  </a>
                  <a
                    href="https://www.linkedin.com/in/iris-greziel-espanto-426631261"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="footer.linkedin.link"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                  </a>
                </div>
                <Separator className="w-48" />
                <p className="flex items-center gap-1">
                  © {new Date().getFullYear()}. Built with{" "}
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{" "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
                  >
                    caffeine.ai
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
