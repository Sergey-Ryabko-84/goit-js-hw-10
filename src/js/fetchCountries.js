import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://restcountries.com/v2/';
const endpoint = 'name/';
const options = '?fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
    return fetch(`${BASE_URL}${endpoint}${name}${options}`)
        .then(response => {
            if(!response.ok) {
                if (response.status === 404) Notify.failure('Oops, there is no country with that name', {timeout: 5000,});                
                throw new Error(response.status)
            };            
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(console.log)
}
