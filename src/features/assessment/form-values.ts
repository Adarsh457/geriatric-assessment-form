import type { z } from 'zod';
import type { Assessment, assessmentSchema } from './schema';

type AssessmentInput = z.input<typeof assessmentSchema>;

/**
 * What the inputs can actually hold while the nurse is typing, derived from the
 * schema's input type so the keys can never drift from it:
 * - NumberInput reports '' when empty, so numbers widen to number | string.
 * - Checkboxes start unticked, so `consentObtained: true` widens to boolean.
 * - DateInput and Select report null when empty.
 * The resolver checks these values; only Zod's parsed output (Assessment) is saved.
 */
export type AssessmentFormValues = {
  [K in keyof AssessmentInput]: AssessmentInput[K] extends number
    ? number | string
    : AssessmentInput[K] extends boolean
      ? boolean
      : AssessmentInput[K] | null;
};

export const emptyAssessment: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: null,
  assessmentDate: null,
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: null,
  consentObtained: false,
};

// Invented patient from the assignment brief. Typed as Assessment, so it must stay valid.
export const samplePatient: Assessment = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1949-03-12',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};
