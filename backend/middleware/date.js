// Gestion de la date
const date1 = new Date();

// Date format français
const dateLocale = date1.toLocaleString('fr-FR',{
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

// Heure format français
const hourLocale = date1.toLocaleString('fr-FR', {
    hour: 'numeric',
    minute: 'numeric',
});

const localeDate = `le ${dateLocale} à ${hourLocale}.`;

return localeDate;

