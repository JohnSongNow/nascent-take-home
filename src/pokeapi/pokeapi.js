export const FetchAllPokemon = async () => {
  return await fetch('https://pokeapi.co/api/v2/pokemon/?limit=9999')
    .then((response) => {
      return response.json();
    })
}

export const FetchAllPokemonTypes = async () => {
  return await fetch('https://pokeapi.co/api/v2/type')
    .then((response) => {
      return response.json();
    })
}


export const FetchPokemonByTypes = async (type) => {
  return await fetch(`https://pokeapi.co/api/v2/type/${type}`);
}

