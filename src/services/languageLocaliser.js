import realm from '../realm';
const EN = require('../i8L/en.json');

var User = realm.objects('User')[0];

const Lang = () => {
    return User
}

export default Lang;