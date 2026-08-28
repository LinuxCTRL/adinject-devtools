import type React from "react";
import type { PolicyAuditResult } from "../types";

interface PolicyAuditorProps {
  audit: PolicyAuditResult;
}

export function PolicyAuditor({ audit }: PolicyAuditorProps) {
  const getStatusColor = (status: "pass" | "warning" | "fail") => {
    switch (status) {
      case "pass":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "fail":
        return "#ef4444";
    }
  };

  const getStatusBg = (status: "pass" | "warning" | "fail") => {
    switch (status) {
      case "pass":
        return "rgba(16, 185, 129, 0.12)";
      case "warning":
        return "rgba(245, 158, 11, 0.12)";
      case "fail":
        return "rgba(239, 68, 68, 0.12)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Overall Score Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--ad-border)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", color: "var(--ad-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Google Publisher & Better Ads Compliance
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
            {audit.overallScore >= 90
              ? "Excellent Policy Compliance"
              : audit.overallScore >= 70
              ? "Minor Warnings Detected"
              : "Policy Issues Need Attention"}
          </h3>
        </div>

        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: getStatusBg(audit.status),
            border: `2px solid ${getStatusColor(audit.status)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <span style={{ fontSize: "17px", fontWeight: 800, color: getStatusColor(audit.status) }}>
            {audit.overallScore}
          </span>
          <span style={{ fontSize: "8px", color: "var(--ad-text-muted)", textTransform: "uppercase" }}>
            / 100
          </span>
        </div>
      </div>

      {/* Checks List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {audit.checks.map((check) => (
          <div
            key={check.id}
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: `1px solid ${check.status === "pass" ? "var(--ad-border)" : getStatusColor(check.status) + "50"}`,
              borderRadius: "10px",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    color: getStatusColor(check.status),
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {check.status === "pass" ? "✓" : check.status === "warning" ? "⚠" : "✕"}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{check.name}</span>
              </div>

              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  background: getStatusBg(check.status),
                  color: getStatusColor(check.status),
                  textTransform: "uppercase",
                }}
              >
                {check.status}
              </span>
            </div>

            <p style={{ fontSize: "11px", color: "var(--ad-text-muted)", margin: 0, lineHeight: 1.4 }}>
              {check.details}
            </p>

            {check.remediation && (
              <div
                style={{
                  marginTop: "4px",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderLeft: `2px solid ${getStatusColor(check.status)}`,
                  padding: "6px 8px",
                  borderRadius: "0 4px 4px 0",
                  fontSize: "11px",
                  color: "#cbd5e1",
                }}
              >
                <strong>Fix: </strong> {check.remediation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
