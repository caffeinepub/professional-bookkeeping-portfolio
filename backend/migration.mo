import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
  // Old types
  type OldExperience = {
    company : Text;
    position : Text;
    duration : Text;
    description : Text;
    focusAreas : [OldFocusArea];
    keyExpertise : ?[Text];
  };

  type OldFocusArea = {
    title : Text;
    description : Text;
  };

  type OldService = {
    title : Text;
    description : Text;
    price : ?Text;
  };

  type OldAccountsPayable = {
    title : Text;
    description : Text;
    keyExpertise : [Text];
  };

  type OldAccountsReceivable = {
    title : Text;
    description : Text;
    keyExpertise : [Text];
  };

  type OldTool = {
    name : Text;
    icon : Text;
    expertiseLevel : Text;
    notes : Text;
  };

  type OldContactInquiry = {
    id : Nat;
    name : Text;
    email : Text;
    company : ?Text;
    message : Text;
    timestamp : Nat;
  };

  type OldPortfolioData = {
    about : Text;
    experience : [OldExperience];
    services : [OldService];
    tools : [OldTool];
    accountsPayable : OldAccountsPayable;
    accountsReceivable : ?OldAccountsReceivable;
  };

  type OldLogoReference = {
    id : Nat;
    blob : Storage.ExternalBlob;
    name : Text;
  };

  type OldActor = {
    experiences : List.List<OldExperience>;
    services : [OldService];
    accountsPayable : OldAccountsPayable;
    accountsReceivable : OldAccountsReceivable;
    tools : [OldTool];
    nextInquiryId : Nat;
    nextLogoId : Nat;
    contactInquiries : Map.Map<Nat, OldContactInquiry>;
    logoReferences : Map.Map<Nat, OldLogoReference>;
  };

  // New types
  type NewAboutContent = {
    title : Text;
    content : Text;
    missionStatement : Text;
    coreValues : [Text];
    uniqueSellingPoints : [Text];
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    aboutContent : NewAboutContent;
    homePage : {
      title : Text;
      subtitle : ?Text;
      content : Text;
    };
    experiences : List.List<OldExperience>;
    accountsPayableService : OldAccountsPayable;
    accountsReceivableService : OldAccountsReceivable;
    services : List.List<OldService>;
    tools : List.List<OldTool>;
    contactInquiries : Map.Map<Nat, OldContactInquiry>;
    logoReferences : Map.Map<Nat, OldLogoReference>;
    nextInquiryId : Nat;
    nextLogoId : Nat;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState(); // New field - initialized here
      aboutContent = {
        title = "About Me";
        content = old.accountsPayable.description;
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
      homePage = {
        title = "Professional Bookkeeping & Accounts Specialist";
        subtitle = ?"Expert in Accounts Payable & Receivable";
        content = "Dedicated to accuracy, reliability, and financial clarity. Over 8 years of experience in managing accounts payable, reconciliations, vendor relationships, and financial reporting. QuickBooks certified and passionate about maintaining the highest data integrity standards.";
      };
      experiences = old.experiences;
      accountsPayableService = old.accountsPayable;
      accountsReceivableService = old.accountsReceivable;
      services = List.fromArray(old.services);
      tools = List.fromArray(old.tools);
      contactInquiries = old.contactInquiries;
      logoReferences = old.logoReferences;
      nextInquiryId = old.nextInquiryId;
      nextLogoId = old.nextLogoId;
    };
  };
};
