import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from "./js/fetchCountries";
import markupList from './js/templates/markup_list.hbs'
import markupBox from './js/templates/markup_box.hbs'

const DEBOUNCE_DELAY = 300;
const refs = {
    inputEl: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch (e) {
    let inputName = '';
    inputName = e.target.value.trim();
    if (!inputName) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    }
    fetchCountries(inputName).then(data => {
        if (!data) return;
        if (data.length > 10) Notify.info('Too many matches found. Please enter a more specific name.');
        if (data.length > 1 && data.length <= 10) renderList(data);
        if (data.length === 1) renderBox(data);
    })
}

function renderBox (data) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = markupBox(data);
    const lastLanguages = refs.countryInfo.querySelector('div').lastElementChild.lastElementChild;
    lastLanguages.textContent = lastLanguages.textContent.slice(0, lastLanguages.textContent.length - 2);
}

function renderList (data) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = markupList(data);

    refs.countryList.addEventListener('click', {handleEvent: onCountryClick, data: data});
}

function onCountryClick (e) {
    let countryName = '';
    if (e.target.localName === 'li') return;
    if (e.target.localName === 'p') {
        countryName = e.target.textContent;
    }
    if (e.target.localName === 'img') {
        countryName = e.target.nextElementSibling.textContent
    }
    const wantedObject = this.data.filter(country => country.name === countryName);
    renderBox([...wantedObject]);
    refs.countryList.removeEventListener('click', onCountryClick);
}