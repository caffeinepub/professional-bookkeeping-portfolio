import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Experience = {
    company : Text;
    position : Text;
    duration : Text;
    description : Text;
    focusAreas : [FocusArea];
    keyExpertise : ?[Text];
  };

  type FocusArea = {
    title : Text;
    description : Text;
  };

  type Service = {
    title : Text;
    description : Text;
    price : ?Text;
  };

  type AccountsPayable = {
    title : Text;
    description : Text;
    keyExpertise : [Text];
  };

  type AccountsReceivable = {
    title : Text;
    description : Text;
    keyExpertise : [Text];
  };

  type Tool = {
    name : Text;
    icon : Text;
    expertiseLevel : Text;
    notes : Text;
  };

  type ContactInquiry = {
    id : Nat;
    name : Text;
    email : Text;
    company : ?Text;
    message : Text;
    timestamp : Nat;
  };

  type ContactFormInput = {
    name : Text;
    email : Text;
    company : ?Text;
    message : Text;
  };

  type ContactConfirmation = {
    success : Bool;
    message : Text;
  };

  type PortfolioData = {
    about : Text;
    experience : [Experience];
    services : [Service];
    tools : [Tool];
    accountsPayable : AccountsPayable;
    accountsReceivable : ?AccountsReceivable;
  };

  type AboutContent = {
    title : Text;
    content : Text;
    missionStatement : Text;
    coreValues : [Text];
    uniqueSellingPoints : [Text];
  };

  type HomePage = {
    title : Text;
    subtitle : ?Text;
    content : Text;
  };

  type LogoReference = {
    id : Nat;
    blob : Storage.ExternalBlob;
    name : Text;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  let experiences = List.empty<Experience>();
  var services = List.empty<Service>();
  let tools = List.empty<Tool>();

  var homePage : HomePage = {
    title = "Professional Bookkeeping & Accounts Specialist";
    subtitle = ?"Expert in Accounts Payable & Receivable";
    content = "Dedicated to accuracy, reliability, and financial clarity. Over 8 years of experience in managing accounts payable, reconciliations, vendor relationships, and financial reporting. QuickBooks certified and passionate about maintaining the highest data integrity standards.";
  };

  var aboutContent : AboutContent = {
    title = "About Me";
    content = "Experienced accounts payable and financial professional with a commitment to accuracy and reliability. Proficient in managing financial processes, reconciliations, and vendor relationships. QuickBooks certified and dedicated to upholding the highest standards of financial integrity.";
    missionStatement = "My mission is to provide trustworthy, reliable, and accurate bookkeeping services that empower businesses to achieve financial success. I take pride in maintaining meticulous records, optimizing accounts payable processes, and building strong vendor relationships.";
    coreValues = [
      "Trustworthy",
      "Reliable",
      "Attention to Detail",
    ];
    uniqueSellingPoints = [
      "Over 8 years experience in accounts payable",
      "Expertise in reconciliations and financial reporting",
      "QuickBooks certified",
      "Proven record of vendor management and compliance",
      "Commitment to accuracy and data integrity",
    ];
  };

  let defaultServices : [Service] = [
    {
      title = "Bookkeeping";
      description = "Accurate financial record keeping and transaction management.";
      price = null;
    },
    {
      title = "Accounts Payable Management";
      description = "Efficient management of invoices, payments, and vendor relationships.";
      price = null;
    },
    {
      title = "Accounts Receivable Management";
      description = "Comprehensive management of customer invoices, payment tracking and receivables reconciliation.";
      price = null;
    },
    {
      title = "Financial Reporting";
      description = "Preparation of financial statements and reports for informed decision making.";
      price = null;
    },
    {
      title = "QuickBooks Setup & Management";
      description = "Expert QuickBooks configuration, training, and ongoing support.";
      price = null;
    },
  ];

  var accountsPayableService : AccountsPayable = {
    title = "Accounts Payable Management";
    description = "Efficient management of invoices, payments, and vendor relationships.";
    keyExpertise = [
      "Invoice Processing",
      "Record Keeping",
      "Payment Management",
      "Account Reconciliation",
      "Vendor Relations",
      "Reporting & Compliance",
      "Preparing 2307",
    ];
  };

  var accountsReceivableService : AccountsReceivable = {
    title = "Accounts Receivable Management";
    description = "Comprehensive management of customer invoices, payment tracking, and receivables reconciliation.";
    keyExpertise = [
      "Invoice Creation",
      "Payment Tracking",
      "Customer Statement Management",
      "Receivable Reconciliation",
    ];
  };

  var nextInquiryId = 1;
  var nextLogoId = 1;

  let contactInquiries = Map.empty<Nat, ContactInquiry>();
  let logoReferences = Map.empty<Nat, LogoReference>();

  func initializeData() {
    experiences.clear();
    services.clear();
    tools.clear();

    experiences.add({
      company = "Acme Corp";
      position = "Accounts Payable Specialist";
      duration = "2018 - 2022";
      description = "Managed accounts payable processes, vendor relationships, and financial reporting.";
      focusAreas = [
        {
          title = "Vendor Management";
          description = "Built strong vendor relationships and ensured timely payments.";
        },
        {
          title = "Reconciliations";
          description = "Expert in reconciling accounts and resolving discrepancies.";
        },
      ];
      keyExpertise = null;
    });

    experiences.add({
      company = "Bright Books LLC";
      position = "Bookkeeper";
      duration = "2015 - 2018";
      description = "Comprehensive bookkeeping services for small businesses.";
      focusAreas = [
        {
          title = "Financial Reporting";
          description = "Prepared detailed financial statements and reports.";
        },
        {
          title = "QuickBooks Expertise";
          description = "Setup and managed QuickBooks for multiple clients.";
        },
      ];
      keyExpertise = ?[
        "Maintained accuracy in recording financial transactions",
        "Reconciliation",
        "Accounts Payables",
        "Accounts Receivable",
        "Financial Reporting",
        "Compliance",
        "Journal Entries",
        "Maintaining General Ledger",
      ];
    });

    for (service in defaultServices.values()) {
      services.add(service);
    };

    tools.add({
      name = "QuickBooks";
      icon = "quickbooks-icon.svg";
      expertiseLevel = "Expert";
      notes = "Extensive experience in setup, management, and troubleshooting.";
    });

    tools.add({
      name = "Microsoft Excel";
      icon = "excel-icon.svg";
      expertiseLevel = "Advanced";
      notes = "Advanced spreadsheet skills for data analysis and reporting.";
    });

    tools.add({
      name = "Data Accuracy";
      icon = "accuracy-icon.svg";
      expertiseLevel = "Specialist";
      notes = "Meticulous attention to detail and commitment to error-free data.";
    });
  };

  func updateElementAtIndex<T>(array : [T], index : Nat, newValue : T) : [T] {
    array.enumerate().map(
      func((i, element)) {
        if (i == index) { newValue } else { element };
      }
    ).toArray();
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only: Initialize portfolio data
  public shared ({ caller }) func initializePortfolio() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize portfolio");
    };
    initializeData();
  };

  // Public: Anyone can view portfolio data
  public query func getPortfolioData() : async PortfolioData {
    {
      about = aboutContent.content;
      experience = experiences.toArray();
      services = services.toArray();
      tools = tools.toArray();
      accountsPayable = accountsPayableService;
      accountsReceivable = ?accountsReceivableService;
    };
  };

  // Admin-only: View contact inquiries
  public query ({ caller }) func getContactInquiries() : async [ContactInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact inquiries");
    };
    contactInquiries.values().toArray();
  };

  // Public: Anyone can submit contact form
  public shared func submitContactForm(input : ContactFormInput) : async ContactConfirmation {
    if (input.name.size() == 0) {
      Runtime.trap("Name is required. Inquiry not submitted.");
    };

    if (input.email.size() == 0) {
      Runtime.trap("Email is required. Inquiry not submitted.");
    };

    if (input.message.size() == 0) {
      Runtime.trap("Message is required. Inquiry not submitted.");
    };

    let inquiry : ContactInquiry = {
      id = nextInquiryId;
      name = input.name;
      email = input.email;
      company = input.company;
      message = input.message;
      timestamp = 0;
    };

    contactInquiries.add(nextInquiryId, inquiry);
    nextInquiryId += 1;

    {
      success = true;
      message = "Your inquiry has been received. Thank you for reaching out!";
    };
  };

  // Admin-only: View specific contact inquiry
  public query ({ caller }) func getContactInquiry(id : Nat) : async ?ContactInquiry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact inquiries");
    };
    contactInquiries.get(id);
  };

  // Admin-only: Delete contact inquiry
  public shared ({ caller }) func deleteContactInquiry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete contact inquiries");
    };

    if (not contactInquiries.containsKey(id)) {
      Runtime.trap("Contact inquiry not found. Deletion unsuccessful.");
    };

    contactInquiries.remove(id);
  };

  // Public: Anyone can view services
  public query func getServiceInfo() : async [Service] {
    services.toArray();
  };

  // Public: Anyone can view tools
  public query func getToolInfo() : async [Tool] {
    tools.toArray();
  };

  // Public: Anyone can view all experience
  public query func getAllExperience() : async [Experience] {
    experiences.toArray();
  };

  // Public: Anyone can view experience by company
  public query func getExperienceByCompany(company : Text) : async [Experience] {
    experiences.toArray().filter(
      func(exp) { Text.equal(exp.company, company) }
    );
  };

  // Admin-only: Upload logo
  public shared ({ caller }) func uploadLogo(blob : Storage.ExternalBlob, name : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload logos");
    };

    let id = nextLogoId;
    nextLogoId += 1;

    let logoRef : LogoReference = {
      id;
      blob;
      name;
    };

    logoReferences.add(id, logoRef);
    id;
  };

  // Public: Anyone can view logo reference
  public query func getLogoReference(id : Nat) : async ?LogoReference {
    logoReferences.get(id);
  };

  // Public: Anyone can view all logo references
  public query func getAllLogoReferences() : async [LogoReference] {
    logoReferences.values().toArray();
  };

  // Admin-only: Delete logo reference
  public shared ({ caller }) func deleteLogoReference(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete logos");
    };

    switch (logoReferences.get(id)) {
      case (null) {
        Runtime.trap("Logo not found for id " # id.toText());
      };
      case (?_) {
        logoReferences.remove(id);
        true;
      };
    };
  };

  // Internal query for logo blob
  public query func getLogoReferenceInternal(id : Nat) : async Storage.ExternalBlob {
    switch (logoReferences.get(id)) {
      case (null) {
        Runtime.trap("Logo not found for id " # id.toText());
      };
      case (?logoRef) {
        logoRef.blob;
      };
    };
  };

  // Admin-only: Add service
  public shared ({ caller }) func addService(service : Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };
    services.add(service);
  };

  // Admin-only: Update service
  public shared ({ caller }) func updateService(index : Nat, service : Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };

    if (index >= services.size()) {
      Runtime.trap("Service index out of range.");
    };
    let servicesArray = services.toArray();
    services.clear();
    for (i in Nat.range(0, index)) {
      services.add(servicesArray[i]);
    };
    services.add(service);
    for (i in Nat.range(index + 1, servicesArray.size())) {
      services.add(servicesArray[i]);
    };
  };

  // Admin-only: Remove service
  public shared ({ caller }) func removeService(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove services");
    };

    if (index >= services.size()) {
      Runtime.trap("Service index out of range.");
    };
    let servicesArray = services.toArray();
    services.clear();
    for (i in Nat.range(0, index)) {
      services.add(servicesArray[i]);
    };
    for (i in Nat.range(index + 1, servicesArray.size())) {
      services.add(servicesArray[i]);
    };
  };

  // Admin-only: Update about content
  public shared ({ caller }) func updateAbout(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update about content");
    };

    aboutContent := {
      aboutContent with content;
    };
  };

  // Admin-only: Update accounts payable
  public shared ({ caller }) func updateAccountsPayable(accountsPayable : AccountsPayable) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update accounts payable");
    };

    accountsPayableService := accountsPayable;
  };

  // Admin-only: Update accounts receivable
  public shared ({ caller }) func updateAccountsReceivable(accountsReceivable : AccountsReceivable) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update accounts receivable");
    };

    accountsReceivableService := accountsReceivable;
  };

  // Admin-only: Update experience
  public shared ({ caller }) func updateExperience(index : Nat, experience : Experience) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update experience");
    };

    let experiencesArray = experiences.toArray();
    if (index >= experiencesArray.size()) {
      Runtime.trap("Experience index out of range");
    };
    experiences.clear();
    let updatedArray : [Experience] = updateElementAtIndex(experiencesArray, index, experience);
    for (exp in updatedArray.values()) {
      experiences.add(exp);
    };
  };

  // Admin-only: Update tool
  public shared ({ caller }) func updateTool(index : Nat, tool : Tool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update tools");
    };

    let toolsArray = tools.toArray();
    if (index >= toolsArray.size()) {
      Runtime.trap("Tool index out of range");
    };
    tools.clear();
    let updatedArray : [Tool] = updateElementAtIndex<Tool>(toolsArray, index, tool);
    for (t in updatedArray.values()) {
      tools.add(t);
    };
  };
};

