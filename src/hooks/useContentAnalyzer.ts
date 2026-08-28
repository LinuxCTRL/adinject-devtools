import { useEffect, useState } from "react";
import type { ContentAnalysis, DevToolsSlotInfo, PolicyAuditResult } from "../types";
import { analyzeContent, runPolicyAudit } from "../utils/ad-density";

export function useContentAnalyzer(
  articleSelector = "article, .adinject-article-body, .prose, main",
  slots: DevToolsSlotInfo[] = []
) {
  const [analysis, setAnalysis] = useState<ContentAnalysis>(() =>
    analyzeContent(articleSelector, slots)
  );

  const [policyAudit, setPolicyAudit] = useState<PolicyAuditResult>(() =>
    runPolicyAudit(analysis, slots)
  );

  useEffect(() => {
    const updatedAnalysis = analyzeContent(articleSelector, slots);
    setAnalysis(updatedAnalysis);
    setPolicyAudit(runPolicyAudit(updatedAnalysis, slots));
  }, [articleSelector, slots]);

  return { analysis, policyAudit };
}
