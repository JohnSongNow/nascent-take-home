import React from 'react';
import { Formik, Field } from 'formik';
import { object, string } from 'yup';
import { Container, Card, CardContent, Typography, Grid, Autocomplete, TextField } from '@mui/material';
import { TextField as MaterialFormikTextField } from 'formik-material-ui';
import { FormStepper } from '../form-stepper/form-stepper';

const steps = ['Details', 'Pokemon Selection', 'Review'];
const validationSchema = [
  object({
    firstName: string().required('First Name is required'),
    lastName: string().required('Last Name is required'),
    phoneNumber: string().required('Phone Number is required'),
    address: string().required('Address is required')
  }),
  object({
    favouritePokemonName: string().required('Pokemon is required'),
  }),
  object({})
];

const App = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const setStep = (currentStep) => {
    setCurrentStep(currentStep);
  }

  const currentValidationSchema = React.useMemo(() => {
    return validationSchema[currentStep];
  }, [currentStep]);

  return (
    <Container sx={{ bgcolor: '#87c1ff4d', paddingY: 3, marginTop: 5 }}>
      <Typography variant='h3' align='center' component='h2'>
        Nascent Pokemon Selector
      </Typography>
      <Card sx={{ marginTop: 2 }}>
        <CardContent sx={{ paddingY: 10, paddingX: 5 }}>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              phoneNumber: '',
              address: '',
              favouritePokemonName: ''
            }}
            onSubmit={async (values, actions) => {
              if (currentStep === steps.length - 1) {
                alert(JSON.stringify(values, null, 2));
              }
              else {
                setCurrentStep(currentStep + 1);
              }
            }}
            validationSchema={currentValidationSchema}
          >
            {({ touched, errors, values, setFieldValue, handleBlur }) => (
              <FormStepper
                steps={steps}
                currentStep={currentStep}
                setStep={setStep}
                validateOnChange={false}
                validateOnBlur={false}
              >
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <Field fullWidth name='firstName' component={MaterialFormikTextField} label='First Name' />
                  </Grid>
                  <Grid item md={6}>
                    <Field fullWidth name='lastName' component={MaterialFormikTextField} label='Last Name' />
                  </Grid>
                  <Grid item md={6}>
                    <Field fullWidth name='phoneNumber' component={MaterialFormikTextField} label='Phone Number' />
                  </Grid>         
                  <Grid item md={6}>
                    <Field fullWidth name='address' component={MaterialFormikTextField} label='Address' />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>          
                  <Field
                    name="autocomplete"
                    component={Autocomplete}
                    options={['a', 'b', 'c']}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Autocomplete" variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid container spacing={2}>
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Typography gutterBottom>Your Name: {`${values.firstName} ${values.lastName}`}</Typography>
                  <Typography gutterBottom>Your Address: {`${values.address}`}</Typography>
                  <Typography gutterBottom>Your Favoruite Pokemon: {`${values.favouritePokemonName}`}</Typography>
                </Grid>
              </FormStepper>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default App;