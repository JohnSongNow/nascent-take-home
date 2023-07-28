import React from 'react';
import { Formik, Field } from 'formik';
import { object, string } from 'yup';
import { Container, Card, CardContent, Checkbox, FormControlLabel, Typography, Grid, Autocomplete, TextField } from '@mui/material';
import { TextField as MaterialFormikTextField } from 'formik-material-ui';
import { FormStepper } from '../form-stepper/form-stepper';
import { FetchAllPokemon, FetchAllPokemonTypes } from '../../pokeapi/pokeapi';

const steps = ['Details', 'Pokemon Selection', 'Review'];
const validationSchema = [
  object({
    firstName: string().required('First Name is required'),
    lastName: string().required('Last Name is required'),
    phoneNumber: string().matches(/^[0-9]\d{0}$/, {message: "Please enter valid number. 10 numbers for this test", excludeEmptyString: false}).required('Phone Number is required'),
    address: string().required('Address is required')
  }),
  object({
    favouritePokemonName: string().required('Pokemon is required'),
  }),
  object({})
];

const App = () => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const [isLoadingPokemons, setIsLoadingPokemons] = React.useState(true);
  const [allPokemonNames, setAllPokemonNames] = React.useState([]);
  const [currentlyListedPokemonNames, setCurrentlyListedPokemonNames] = React.useState([]);

  const [isLoadingPokemonsTypes, setIsLoadingPokemonsTypes] = React.useState(true);
  const [allPokemonTypesNames, setAllPokemonTypesNames] = React.useState({});

  React.useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoadingPokemons(true);
      const pokemons = await FetchAllPokemon();
      const pokemonNames = pokemons.results.map((option) => option.name[0].toUpperCase() + option.name.slice(1));

      setAllPokemonNames(pokemonNames);
      setCurrentlyListedPokemonNames(pokemonNames);
      setIsLoadingPokemons(false);
    }
    fetchPokemon();
    
    const fetchPokemonTypes = async () => {
      setIsLoadingPokemonsTypes(true);
      const pokemonTypes = await FetchAllPokemonTypes();
      const pokemonTypesNames = pokemonTypes.results.reduce((acc, curr) => { const name = curr.name[0].toUpperCase() + curr.name.slice(1); acc[name] = { name, checked: false }; return acc; }, {});
      console.log(pokemonTypesNames);

      setAllPokemonTypesNames(pokemonTypesNames);
      setIsLoadingPokemonsTypes(false);
    }
    fetchPokemonTypes();
  }, []);

  const setStep = (currentStep) => {
    setCurrentStep(currentStep);
  }

  const currentValidationSchema = React.useMemo(() => {
    return validationSchema[currentStep];
  }, [currentStep]);
  
  const handleTypeCheckboxChanged = (_) => {

  }

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
            onSubmit={async (values, _) => {
              if (currentStep === steps.length - 1) {
                alert(`Thanks for using the application here's the JSON of the data needed \n ${JSON.stringify(values, null, 2)}`);
              }
              else {
                setCurrentStep(currentStep + 1);
              }
            }}
            validationSchema={currentValidationSchema}
          >
            {({ touched, errors, setFieldValue, values }) => (
              <FormStepper
                steps={steps}
                currentStep={currentStep}
                setStep={setStep}
                validateOnChange={false}
                validateOnBlur={false}
              >
                <Grid container spacing={2}>
                  <Grid container item md={12}>
                    <Typography variant="h5" gutterBottom> Details </Typography>
                  </Grid>
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
                  <Grid container item md={12}>
                    <Typography variant="h4" gutterBottom> Pokemon Selector </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Field
                      name="favouritePokemonName"
                      component={Autocomplete}
                      options={currentlyListedPokemonNames}
                      getOptionLabel={(option) => option}
                      value={values.favouritePokemonName}
                      style={{ width: 300 }}
                      onChange={(_e, value) => {
                          setFieldValue("favouritePokemonName", value);
                      }}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                          error={touched.favouritePokemonName && errors.favouritePokemonName}
                          helperText={touched.favouritePokemonName && errors.favouritePokemonName}
                          name="favouritePokemonName"
                          label="Favourite Pokemon"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid container item md={6}>
                    {
                      Object.values(allPokemonTypesNames).map((type) => {
                        return (
                          <FormControlLabel control={<Checkbox />} label={type.name} onChange={handleTypeCheckboxChanged}/>
                        );
                      })
                    }
                  </Grid>
                </Grid>
                <Grid container justifyContent='center'>
                  <Grid container>
                    <Typography variant="h4" gutterBottom> Summary </Typography>
                  </Grid>
                  <Grid container justifyContent='center' alignItems='center' direction='row'>
                    <Grid item md={6}>
                      <Typography gutterBottom>Your Name: {`${values.firstName} ${values.lastName}`}</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography gutterBottom>Your Address: {`${values.address}`}</Typography>
                    </Grid> 
                    <Grid item md={6}>
                      <Typography gutterBottom>Your Phone Number: {`${values.phoneNumber}`}</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography gutterBottom>Your Favoruite Pokemon: {`${values.favouritePokemonName}`}</Typography>
                    </Grid>
                  </Grid>
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