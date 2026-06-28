import { getUniversity } from "./index";
import type { CreditTransferInput, CreditTransferResult } from "./types";

export function checkCreditTransfer(input: CreditTransferInput): CreditTransferResult {
  const from = getUniversity(input.fromUniversitySlug);
  const to = getUniversity(input.toUniversitySlug);

  if (!from || !to) {
    return {
      eligible: false,
      acceptedCredits: null,
      remainingCredits: null,
      policy: "University not found",
      documents: [],
      notes: ["Select valid source and target universities"],
    };
  }

  const targetProgram = to.programs.find(
    (p) => p.department.toLowerCase() === input.toDepartment.toLowerCase()
  );
  const totalRequired = targetProgram?.creditHours ?? to.tuition.creditHours ?? 140;

  const creditTransferSupported = from.admission.creditTransfer || to.admission.creditTransfer;
  const sameType = from.type === to.type;
  const relatedDept = input.fromDepartment.toLowerCase() === input.toDepartment.toLowerCase()
    || (input.fromDepartment.toLowerCase().includes("cse") && input.toDepartment.toLowerCase().includes("cse"));

  let acceptanceRate = 0;
  if (creditTransferSupported) acceptanceRate += 0.3;
  if (sameType) acceptanceRate += 0.2;
  if (relatedDept) acceptanceRate += 0.35;
  if (input.completedCredits >= 30) acceptanceRate += 0.1;

  const acceptedCredits = acceptanceRate >= 0.4
    ? Math.min(input.completedCredits, Math.round(totalRequired * 0.6))
    : null;

  const remainingCredits = acceptedCredits != null ? totalRequired - acceptedCredits : null;

  const notes: string[] = [];
  if (!creditTransferSupported) notes.push("Credit transfer policy not confirmed — contact both universities");
  if (!relatedDept) notes.push("Cross-department transfers may require additional courses");
  notes.push("Final credit acceptance is determined by the target university academic board");

  return {
    eligible: acceptedCredits != null && acceptedCredits > 0,
    acceptedCredits,
    remainingCredits,
    policy: to.admission.creditTransfer
      ? `${to.shortName} accepts credit transfer subject to academic board approval`
      : `Contact ${to.shortName} admission office for transfer policy`,
    documents: [
      "Official transcripts",
      "Course syllabi / outlines",
      "NOC from current university",
      "SSC/HSC certificates",
      "Application form",
    ],
    notes,
  };
}
