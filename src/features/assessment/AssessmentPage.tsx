import { useState } from 'react';
import { Alert, Code, Container, Paper, Stack, Title } from '@mantine/core';
import { AssessmentForm } from './AssessmentForm';
import type { Assessment } from './schema';

const FAKE_SAVE_DELAY_MS = 800;

export function AssessmentPage() {
  const [saved, setSaved] = useState<Assessment | null>(null);

  const fakeSave = async (assessment: Assessment) => {
    setSaved(null);
    await new Promise((resolve) => setTimeout(resolve, FAKE_SAVE_DELAY_MS));
    setSaved(assessment);
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="xl">
        <Stack>
          <Title order={1}>Geriatric Care Assessment</Title>
          <AssessmentForm onSave={fakeSave} />
          {saved && (
            <Alert color="green" title="Assessment saved">
              <Code block>{JSON.stringify(saved, null, 2)}</Code>
            </Alert>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
