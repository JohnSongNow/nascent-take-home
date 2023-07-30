import React from 'react';
import { Formik, Field } from 'formik';
import { object, string } from 'yup';
import { Container, Card, CardContent, Checkbox, FormControlLabel, Typography, Grid, Autocomplete, TextField, CircularProgress } from '@mui/material';
import { TextField as MaterialFormikTextField } from 'formik-material-ui';
import { FormStepper } from '../form-stepper/form-stepper';
import { FetchAllPokemon, FetchAllPokemonTypes, FetchByType } from '../../pokeapi/pokeapi';

const steps = ['Details', 'Pokemon Selection', 'Review'];
const validationSchema = [
  object({
    firstName: string().required('First Name is required'),
    lastName: string().required('Last Name is required'),
    phoneNumber: string().matches(/^[0-9]\d{9}$/, { message: 'Please enter valid number. 10 numbers for this test', excludeEmptyString: false }).required('Phone Number is required'),
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

  const handleTypeCheckboxChanged = (event) => {
    const name = event.target.name;
    const newPokemonTypesNames = { ...allPokemonTypesNames, [name]: { ...allPokemonTypesNames[name], checked: !allPokemonTypesNames[name].checked } };
    setAllPokemonTypesNames(newPokemonTypesNames);

    const fetchSelectedPokemonTypes = async () => {
      setIsLoadingPokemons(true);
      const types = await Promise.all(Object.values(newPokemonTypesNames).filter((type) => type.checked === true).map(type => {
        return FetchByType(type.name);
      })).then((results) => {
        const pokemonResults = results.map((typeArray) => typeArray.pokemon.map((pokemonArray) => pokemonArray.pokemon));
        return pokemonResults[0].filter((pokemon) => {
          return pokemonResults.every((pokemonArray) => {
            return !!pokemonArray.find((currPokemon) => currPokemon.name === pokemon.name);
          });
        });
      });

      setCurrentlyListedPokemonNames(types.map((option) => option.name[0].toUpperCase() + option.name.slice(1)));
      setIsLoadingPokemons(false);
    }

    if (Object.values(newPokemonTypesNames).filter((type) => type.checked === true).length > 0) {
      fetchSelectedPokemonTypes();
    }
    else {
      return setCurrentlyListedPokemonNames(allPokemonNames);
    }
  }

  return (
    <Container sx={{ bgcolor: '#87c1ff4d', paddingY: 3, marginTop: 5 }}>
      <Typography variant='h3' align='center' component='h2'>
        Nascent Pokemon Selector
      </Typography>
      <Card sx={{ marginTop: 2 }}>
        <CardContent sx={{ paddingY: 10, paddingX: 5 }}>
          <Formik
            initialValues={ localStorage.getItem('formData') !== null ? JSON.parse(localStorage.getItem('formData')) : {
              firstName: '',
              lastName: '',
              phoneNumber: '',
              address: '',
              favouritePokemonName: ''
            }}
            onSubmit={async (values, _) => {
              console.log(JSON.stringify(values, null, 2));
              localStorage.setItem('formData', JSON.stringify(values, null, 2));
              if (currentStep === steps.length - 1) {
                alert(`Thanks for using the application here's the JSON of the data needed \n ${ JSON.stringify(values, null, 2) }`);
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
              >
                <Grid container spacing={2}>
                  <Grid container item md={12}>
                    <Typography variant='h5' gutterBottom> Details </Typography>
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
                    <Typography variant='h4' gutterBottom> Pokemon Selector </Typography>
                  </Grid>
                  <Grid item md={6}>
                    {
                      console.log(values)
                    }
                    <Field
                      loading={isLoadingPokemons}
                      name='favouritePokemonName'
                      component={Autocomplete}
                      options={currentlyListedPokemonNames}
                      getOptionLabel={(option) => option}
                      value={values.favouritePokemonName}
                      style={{ width: 300 }}
                      onChange={(_e, value) => {
                        console.log(value);
                        setFieldValue('favouritePokemonName', value);
                      }}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched.favouritePokemonName && errors.favouritePokemonName}
                          helperText={touched.favouritePokemonName && errors.favouritePokemonName}
                          name='favouritePokemonName'
                          label='Favourite Pokemon'
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid container item md={6}>
                    {
                      isLoadingPokemonsTypes ?
                        <CircularProgress /> :
                        Object.values(allPokemonTypesNames).map((type) => {
                          return (
                            <FormControlLabel key={type.name} checked={type.checked} name={type.name} control={<Checkbox />} label={type.name} onChange={handleTypeCheckboxChanged} />
                          );
                        })
                    }
                  </Grid>
                </Grid>
                <Grid container justifyContent='center'>
                  <Grid container>
                    <Typography variant='h4' gutterBottom> Summary </Typography>
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
