# Geriatric Care Assessment Form

A one-page form a visiting nurse fills in when checking on an elderly patient at home. Built with React 19, TypeScript, Mantine 9, `@mantine/form` and Zod 4. All data in this repo is invented.

**Live demo:** https://geriatric-assessment-form-ten.vercel.app/

## Run it

If `yarn` isn't available, the repo ships its own Yarn, so any command also works as `node .yarn/releases/yarn-4.18.0.cjs <command>`, for example `node .yarn/releases/yarn-4.18.0.cjs install`.

```bash
yarn install
yarn dev      # http://localhost:5173
yarn test     # typecheck, format check, lint, tests, build
yarn vitest   # tests only
```

## How it's put together

```
src/features/assessment/
  schema.ts             the Zod schema from the brief, unchanged
  form-values.ts        form value type derived from the schema, empty values, sample patient
  mobility-options.ts   Select options generated from MOBILITY
  AssessmentForm.tsx    the 10 fields, wired with schemaResolver
  AssessmentPage.tsx    Container + Paper + heading, fake save, success Alert
  schema.test.ts        age boundary via safeParse
  AssessmentForm.test.tsx  load sample patient, submit, assert parsed values
```

### The input/output type gap

`Assessment` (the schema's output) can't describe an empty form: an empty `NumberInput` holds `''`, an empty `DateInput` or `Select` holds `null`, and consent starts unticked. So `AssessmentFormValues` is a mapped type over `z.input<typeof assessmentSchema>` that widens each field to what its input can actually hold. The keys come from the schema, so adding a field to the schema makes TypeScript demand it in the form's initial values. There is no hand-written interface and no `any`.

`useForm<AssessmentFormValues, Assessment>` then uses `transformValues: (values) => assessmentSchema.parse(values)`. Mantine only calls `transformValues` after validation has passed, so the submit handler receives Zod's parsed output (for example, trimmed strings) rather than raw form state. That is what gets saved and printed in the success alert.

### Validation

All rules live in `schema.ts`. The form uses `schemaResolver(assessmentSchema, { sync: true })` with `validateInputOnBlur: true`, so untouched fields stay quiet and every field is checked on submit. Errors render through Mantine's normal `error` prop. An empty submit produces exactly 9 errors, one per required field.

## Decisions on unclear points

- **No silent clamping.** Mantine's `NumberInput` clamps out-of-range values on blur by default, which would quietly turn a typed 105 into 100. Both number inputs use `clampBehavior="none"`, so 105 reaches the schema and is rejected with its message.
- **Removed the template's demo page and router.** Routing is out of scope, and keeping unused components would be dead code. This left the repo with no CSS files, so the `stylelint` script now passes `--allow-empty-input`. Stylelint and its config are otherwise unchanged and will still lint any CSS added later.
- **Cross-field errors update on blur.** Errors from the three `.refine()` rules appear when the field they're attached to is blurred or on submit. For example, changing the assessment date after entering a follow-up date re-checks the follow-up date on submit, not instantly.
- **Form test adds a trailing space** to the patient name after loading the sample. Without it, raw form state and parsed output would be identical and the test couldn't tell them apart.

## What I'd do next

- Re-validate dependent fields (`followUpDate`, `dateOfBirth`) when `assessmentDate` changes.
- Accept typed dates in DD/MM/YYYY, which is what nurses in India would type, using dayjs's `customParseFormat`.
- Reset the form or clear the success alert after a save.

## Time spent

## Time spent

About 2 hours in total, including setup and deployment. I used an AI assistant while building this and reviewed every line, so I can explain any choice in the code.