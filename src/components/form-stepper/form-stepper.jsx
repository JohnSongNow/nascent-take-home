import React from 'react';
import { Form } from 'formik';
import { Button, Stack, Step, StepLabel, Stepper } from '@mui/material';

export const FormStepper = ({ children, steps, currentStep, setStep }) => {
  const stepsArray = React.Children.toArray(children);
  const totalSteps = steps.length;
  const currentChild = stepsArray[currentStep];

  return (
    <Form>
      <Stepper alternativeLabel activeStep={currentStep} sx={{ marginBottom: 5 }}>
        { steps.map((stepLabel, index) => (
          <Step key={stepLabel + index} completed={currentStep > index}>
            <StepLabel>{stepLabel}</StepLabel>
          </Step>
        ))}
      </Stepper>
      { currentChild }
      <Stack direction='row' spacing={2} sx={{ marginTop: 5 }}>
        {
          currentStep > 0 && (
            <Button
              variant='outlined'
              onClick={() => { setStep(currentStep - 1); }}
            >
              Back
            </Button>
          )
        }
        {
          currentStep < totalSteps - 1 && (
            <Button
              variant='outlined'
              type='submit'
            >
              Next
            </Button>
          )
        }
        { currentStep === totalSteps - 1 && (
          <Button variant='contained' type='submit'>
            Submit
          </Button>
        )}
      </Stack>
    </Form>
  );
};