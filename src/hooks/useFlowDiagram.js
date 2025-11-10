import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFlowDiagram } from "../services/FlowServices";

export function useFlowDiagram(){
    const queryClient = useQueryClient();
    const FLOW_DIAGRAM_QUERY_KEY = 'flow-diagram';
    const saveMutation = useMutation({
        mutationFn:(flowData) => addFlowDiagram({
            nodeJson: flowData.nodeJson,
            edgeJson: flowData.edgeJson,
            saved: flowData.saved,
            createdAt: flowData.createdAt,
            modifiedOn: flowData.modifiedOn
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FLOW_DIAGRAM_QUERY_KEY });
        },
    });
    return saveMutation;
}