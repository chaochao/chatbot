// Shared by the server's finding checks and the browser's evidence table.
// "Request more info" has no corresponding SOP step.
export const ACTIVITY_TO_STEP: Record<string, number> = {
  "Contract review": 5,
  "Create vendor in ERP": 6,
  "Notify requester": 7,
  "Procurement review": 2,
  "Security questionnaire sent": 3,
  "Security review": 4,
  "Submit vendor request": 1,
};
