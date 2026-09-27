import dayjs from 'dayjs';
import { Button, Checkbox, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { emptyAssessment, samplePatient, type AssessmentFormValues } from './form-values';
import { mobilityOptions } from './mobility-options';
import { assessmentSchema, type Assessment } from './schema';

interface AssessmentFormProps {
  onSave: (assessment: Assessment) => Promise<void>;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const form = useForm<AssessmentFormValues, Assessment>({
    initialValues: emptyAssessment,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
    // Runs only after validation passes, so the submit handler receives Zod's parsed output.
    transformValues: (values) => assessmentSchema.parse(values),
  });

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <form onSubmit={form.onSubmit(onSave)} noValidate>
      <Stack>
        <TextInput
          label="Medical record number"
          placeholder="MRN-004821"
          {...form.getInputProps('mrn')}
        />
        <TextInput label="Patient name" {...form.getInputProps('patientName')} />
        <DateInput label="Date of birth" {...form.getInputProps('dateOfBirth')} />
        <DateInput
          label="Assessment date"
          maxDate={today}
          {...form.getInputProps('assessmentDate')}
        />
        <Select label="Mobility" data={mobilityOptions} {...form.getInputProps('mobility')} />
        {/* clampBehavior="none": out-of-range scores reach the schema and are rejected, never silently changed. */}
        <NumberInput
          label="Barthel Index"
          step={5}
          min={0}
          max={100}
          clampBehavior="none"
          {...form.getInputProps('barthelIndex')}
        />
        <NumberInput
          label="Regular medications"
          min={0}
          max={30}
          clampBehavior="none"
          {...form.getInputProps('medicationCount')}
        />
        <Checkbox
          label="Pharmacist review requested"
          {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
        />
        <DateInput label="Next review date" {...form.getInputProps('followUpDate')} />
        <Checkbox
          label="Patient or representative has given consent"
          {...form.getInputProps('consentObtained', { type: 'checkbox' })}
        />

        <Group justify="space-between" mt="md">
          <Button
            variant="default"
            onClick={() => form.setValues(samplePatient)}
            disabled={form.submitting}
          >
            Load sample patient
          </Button>
          <Button type="submit" loading={form.submitting}>
            Save assessment
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
