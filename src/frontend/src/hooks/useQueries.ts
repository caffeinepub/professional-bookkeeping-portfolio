import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AccountsPayable,
  AccountsReceivable,
  ContactConfirmation,
  ContactFormInput,
  ContactInquiry,
  Experience,
  PortfolioData,
  Service,
  Tool,
} from "../backend";
import { useActor } from "./useActor";

export function useGetPortfolioData() {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioData>({
    queryKey: ["portfolioData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getPortfolioData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<ContactConfirmation, Error, ContactFormInput>({
    mutationFn: async (input: ContactFormInput) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.submitContactForm(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactInquiries"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateExperience() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { index: number; experience: Experience }>({
    mutationFn: async ({ index, experience }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateExperience(BigInt(index), experience);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioData"] });
    },
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { index: number; service: Service }>({
    mutationFn: async ({ index, service }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateService(BigInt(index), service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioData"] });
    },
  });
}

export function useUpdateAccountsPayable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, AccountsPayable>({
    mutationFn: async (accountsPayable) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateAccountsPayable(accountsPayable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioData"] });
    },
  });
}

export function useUpdateAccountsReceivable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, AccountsReceivable>({
    mutationFn: async (accountsReceivable) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateAccountsReceivable(accountsReceivable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioData"] });
    },
  });
}

export function useUpdateTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { index: number; tool: Tool }>({
    mutationFn: async ({ index, tool }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateTool(BigInt(index), tool);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioData"] });
    },
  });
}

export function useUpdateAbout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (content) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateAbout(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioData"] });
    },
  });
}

export function useGetContactInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInquiry[]>({
    queryKey: ["contactInquiries"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getContactInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteContactInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteContactInquiry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactInquiries"] });
    },
  });
}
