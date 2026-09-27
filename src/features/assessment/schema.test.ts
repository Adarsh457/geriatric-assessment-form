import { samplePatient } from './form-values';
import { assessmentSchema } from './schema';

// samplePatient.assessmentDate is 2026-08-07, so the 60th birthday falls on 1966-08-07.
describe('assessmentSchema age rule', () => {
  it('accepts a patient who turns 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-07' });

    expect(result.success).toBe(true);
  });

  it('rejects a patient one day short of 60, with the error on dateOfBirth', () => {
    const result = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-08' });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        path: ['dateOfBirth'],
        message: 'This pathway is for patients aged 60 and over',
      }),
    ]);
  });
});
