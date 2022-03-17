const RandExp = require('randexp');
const zips = require('./zips.json');
const countries = require('./countries.json');
const states = {
    "AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona",
    "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut",
    "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia",
    "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho",
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky",
    "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire",
    "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina",
    "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas",
    "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington",
    "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

const unJustify = (pattern)=>{
    if(
        pattern &&
        (pattern[0] === '^') &&
        (pattern[pattern.length-1] === '$')
    ){
        return pattern.substring(1, pattern.length-1);
    }
    return pattern
}

const caseInsensitiveRegexStrings = (list, sub)=>{
    return list.map(i => (sub?i[sub]:i).split('').map(c => '['+c.toUpperCase()+c.toLowerCase()+']').join('')).join('|')
}

const stateNames = Object.keys(states).map(state => states[state]);
const regexStates = caseInsensitiveRegexStrings(stateNames);
const regexCountries = caseInsensitiveRegexStrings(countries, 'country');
const regexCountryCodes = caseInsensitiveRegexStrings(countries, 'abbreviation');

const zipInfo = (code)=>{
    let result = null;
    let zipCode = typeof code === 'string'?parseInt(code):code;
    zips.forEach((zip)=>{
        if(result) return;
        if(zipCode >= parseInt(zip.from) && zipCode <= parseInt(zip.to)){
            result = zip;
        }
    });
    return result;
}
const directions = '([Nn][Oo][Rr][Tt][Hh]|[Ee][Aa][Ss][Tt]|[Ww][Ee][Ss][Tt]|[Ss][Oo][Uu][Tt][Hh])';

const address = {
    zipCode : {
        pattern: '^(?<zipcode>[1-9][0-9]{4}$)|(^[1-9][0-9]{8}$)|(^[1-9][0-9]{4}-[1-9][0-9]{3})$'
    },
    stateAbbr : {
        pattern: '^(?<state2character>[A-Z]{2})$'
    },
    streetAddress : {
        pattern: '^(?<streetaddress>([1-9][0-9]{1,4} ?([a-zA-Z]{1,30} ){1,4})('+
            '[Cc][Oo][Uu][Rr][Tt]|'+'[Cc][Tt]\\.?|'+
            '[Ss][Tt][Rr][Ee][Ee][Tt]|'+'[Ss][Tt]\\.?|'+
            '[Dd][Rr][Ii][Vv][Ee]|'+'[Dd][Rr]\\.?|'+
            '[Ll][Aa][Nn][Ee]|'+'[Ll][Nn]\\.?|'+
            '[Rr][Oo][Aa][Dd]|'+'[Rr][Dd]\\.?|'+
            '[Bb][Ll][Vv][Dd]))$'
    },
    city : {
        pattern: '^(?<city>[A-Za-z ]{1,85})$'
    },
    state : {
        pattern: '^(?<state>('+regexStates+'))$'
    },
    latitude: {
        pattern: '^(?<latitude>(\\-?|\\+?)?[0-9]+(\\.[0-9]+)?)$'
    },
    longitude: {
        pattern: '^(?<longitude>(\\-?|\\+?)?[0-9]+(\\.[0-9]+))?$'
    },
    direction : {
        pattern: '^(?<direction>^('+
            directions+'|'+
            directions+directions+'|'+
            directions+directions+directions+'|'+
            '))$'
    },
    cardinalDirection : {
        pattern: '^(?<direction>^('+
            directions+'|'+
            '))$'
    },
    ordinalDirection : {
        pattern: '^(?<direction>^('+
            directions+'|'+
            directions+directions+'|'+
            '))$'
    },
    county : {
        pattern: '^(?<county>^[A-Za-z ]{1,85})$'
    },
    country : {
        pattern: '^(?<country>^'+regexCountries+')$'
    },
    countryCode : {
        pattern: '^(?<countrycodes>^'+regexCountryCodes+')$'
    },
    timeZone : {
        pattern: '^(?<timezone>:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$'
    }
};
address.fullThreeLineAddress = {
    pattern: unJustify(address.streetAddress.pattern)+', +'+
        unJustify(address.city.pattern)+', ?'+
        unJustify(address.stateAbbr.pattern)+', ?'+
        unJustify(address.zipCode.pattern),
    wants: ['address.zipCode', 'address.streetAddress', 'address.city', 'address.stateAbbr'],
    generate : (values, generator)=>{
        let noNamedGroups = module.exports.fullThreeLineAddress.pattern.replace(/\?<[A-Za-z][A-Za-z0-9]*>/g, '');
        let random = new RandExp( noNamedGroups ).gen();
        let info = values.zipCode?(zipInfo(values.zipCode.substring(0, 5)) || {}):{};
        let lines = random.split("\n");
        let lineParts = lines.slice();
        lineParts[1] = (lineParts[1]||'').split(',');
        return `${values['address.streetAddress'] || lineParts[0]}
${(info.city) || values['address.city'] || lineParts[1][0]}, ${info.abbreviation || values['address.stateAbbr'] || lineParts[1][1] || ''}
${values['address.zipCode'] || lineParts[2] }`;
    }
};
address.nearbyGPSCoordinate = {
    pattern: address.latitude+', +'+address.longitude,
    wants: ['address.latitude', 'address.longitude'],
    generate : (values, generator)=>{
        return [
            (values['address.latitude'] || lineParts[0]),
            (values['address.longitude'] || lineParts[1])
        ];
    }
};
module.exports = address;
