import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Filter = ({filter, setFilter}) =>
<div>
  find countries <input value={filter} onChange={e => setFilter(e.target.value)}/>
</div>

const CountryDetails = ({ country, weather }) =>
<div>
  <h1>{country.name}</h1>
  <div>Capital {country.capital}</div>
  <div>Population {country.population}</div>
  <h2>Spoken Languages</h2>
  <ul>
    {country.languages.map(l => <li key={l.name}>{l.name}</li>)}
  </ul>
  <img src={country.flag} alt={`Flag of ${country.name}`} width="200"/>

  <h2>Weather in {country.capital}</h2>
  <div><b>Temperature:</b> {weather.current?.temperature} Celsius</div>
  <img src={weather.current?.weather_icons[0]} alt={weather.current?.weather_descriptions[0]} />
  <div><b>Wind:</b> {weather.current?.wind_speed} mph direction {weather.current?.wind_dir}</div>
</div>

const Countries = ({ countries, filter, setFilter, weather }) => {
  const filtered = countries.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
  if (filtered.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (filtered.length === 1) {
    return (<CountryDetails country={filtered[0]} weather={weather} />)
  } else { //Also handles 0 matches
    return (
      <div>
        {filtered.map(c => <div key={c.name}>{c.name}<button type="button" onClick={() => setFilter(c.name)}>Show</button></div>)}
      </div>
    )
  }
}

const App = () => {

  const [filter, setFilter] = useState('')

  const [countries, setCountries] = useState([])

  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => setCountries(response.data))
  }, [])

  useEffect(() => {
    const filtered = countries.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    if (filtered.length === 1) {
      axios
        .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${filtered[0].capital}`)
        .then(response => setWeather(response.data))
    }
  }, [filter, countries])

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <Countries countries={countries} filter={filter} setFilter={setFilter} weather={weather} />
    </div>
  );
}

export default App;
