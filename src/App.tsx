import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { AssessmentPage } from './features/assessment/AssessmentPage';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AssessmentPage />
    </MantineProvider>
  );
}
