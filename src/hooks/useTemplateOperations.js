import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveTemplate as saveTemplateService,
  getTemplates,
  getTemplateById,
  updateTemplate as updateTemplateService,
  deleteTemplate as deleteTemplateService
} from "../services/TemplateServices";

const TEMPLATES_QUERY_KEY = ['templates'];

export function useTemplateOperations() {
  const queryClient = useQueryClient();

  // Query for fetching all templates
  const templatesQuery = useQuery({
    queryKey: TEMPLATES_QUERY_KEY,
    queryFn: getTemplates,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Query for fetching a specific template by ID
  const useTemplateById = (templateId) => {
    return useQuery({
      queryKey: [...TEMPLATES_QUERY_KEY, templateId],
      queryFn: () => getTemplateById(templateId),
      enabled: !!templateId,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  };

  // Mutation for saving a new template
  const saveTemplateMutation = useMutation({
    mutationFn: (templateData) => saveTemplateService(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
    },
  });

  // Mutation for updating an existing template
  const updateTemplateMutation = useMutation({
    mutationFn: ({ templateId, templateData }) => updateTemplateService(templateId, templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
    },
  });

  // Mutation for deleting a template
  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId) => deleteTemplateService(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
    },
  });

  return {
    // Templates list
    templates: templatesQuery.data,
    isLoadingTemplates: templatesQuery.isLoading,
    templatesError: templatesQuery.error,

    // Template by ID
    useTemplateById,

    // Save template
    saveTemplate: saveTemplateMutation.mutate,
    isSavingTemplate: saveTemplateMutation.isPending,
    saveTemplateError: saveTemplateMutation.error,

    // Update template
    updateTemplate: updateTemplateMutation.mutate,
    isUpdatingTemplate: updateTemplateMutation.isPending,
    updateTemplateError: updateTemplateMutation.error,

    // Delete template
    deleteTemplate: deleteTemplateMutation.mutate,
    isDeletingTemplate: deleteTemplateMutation.isPending,
    deleteTemplateError: deleteTemplateMutation.error,

    // Refetch functions
    refetchTemplates: templatesQuery.refetch,
  };
}
