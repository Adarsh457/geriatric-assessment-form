import { render, screen, userEvent, waitFor } from '@test-utils';
import { AssessmentForm } from './AssessmentForm';
import { samplePatient } from './form-values';

describe('AssessmentForm', () => {
  it('submits the sample patient as Zod-parsed values', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<AssessmentForm onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
    // A trailing space proves the handler gets Zod's parsed (trimmed) output, not raw form state.
    await user.type(screen.getByLabelText('Patient name'), '  ');
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0][0]).toEqual(samplePatient);
  });
});
