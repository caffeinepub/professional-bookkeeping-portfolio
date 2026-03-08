import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PortfolioData {
    tools: Array<Tool>;
    about: string;
    accountsReceivable?: AccountsReceivable;
    experience: Array<Experience>;
    accountsPayable: AccountsPayable;
    services: Array<Service>;
}
export interface LogoReference {
    id: bigint;
    blob: ExternalBlob;
    name: string;
}
export interface FocusArea {
    title: string;
    description: string;
}
export interface Service {
    title: string;
    description: string;
    price?: string;
}
export interface AccountsPayable {
    title: string;
    description: string;
    keyExpertise: Array<string>;
}
export interface ContactConfirmation {
    message: string;
    success: boolean;
}
export interface AccountsReceivable {
    title: string;
    description: string;
    keyExpertise: Array<string>;
}
export interface Experience {
    duration: string;
    description: string;
    keyExpertise?: Array<string>;
    company: string;
    position: string;
    focusAreas: Array<FocusArea>;
}
export interface Tool {
    icon: string;
    name: string;
    notes: string;
    expertiseLevel: string;
}
export interface ContactInquiry {
    id: bigint;
    name: string;
    email: string;
    company?: string;
    message: string;
    timestamp: bigint;
}
export interface ContactFormInput {
    name: string;
    email: string;
    company?: string;
    message: string;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addService(service: Service): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteContactInquiry(id: bigint): Promise<void>;
    deleteLogoReference(id: bigint): Promise<boolean>;
    getAllExperience(): Promise<Array<Experience>>;
    getAllLogoReferences(): Promise<Array<LogoReference>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInquiries(): Promise<Array<ContactInquiry>>;
    getContactInquiry(id: bigint): Promise<ContactInquiry | null>;
    getExperienceByCompany(company: string): Promise<Array<Experience>>;
    getLogoReference(id: bigint): Promise<LogoReference | null>;
    getLogoReferenceInternal(id: bigint): Promise<ExternalBlob>;
    getPortfolioData(): Promise<PortfolioData>;
    getServiceInfo(): Promise<Array<Service>>;
    getToolInfo(): Promise<Array<Tool>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializePortfolio(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    removeService(index: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(input: ContactFormInput): Promise<ContactConfirmation>;
    updateAbout(content: string): Promise<void>;
    updateAccountsPayable(accountsPayable: AccountsPayable): Promise<void>;
    updateAccountsReceivable(accountsReceivable: AccountsReceivable): Promise<void>;
    updateExperience(index: bigint, experience: Experience): Promise<void>;
    updateService(index: bigint, service: Service): Promise<void>;
    updateTool(index: bigint, tool: Tool): Promise<void>;
    uploadLogo(blob: ExternalBlob, name: string): Promise<bigint>;
}
