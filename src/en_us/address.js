const RandExp = require('randexp');
const zips = require('./zips.json');

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

module.exports = {
    fullThreeLineAddress : {
        pattern: '[1-9][0-9]{0,5} (?:[A-Za-z0-9#]+ ){0,7}(?:[A-Za-z0-9#]+)'+"\n"+'(?:[A-Za-z]+ ){0,3}(?:[A-Za-z]+) [A-Z]{2}'+"\n"+'[1-9][0-9]{4}',
        wants: ['address.zipCode', 'address.streetAddress', 'address.cityName', 'address.stateAbbr'],
        generate : (values, generator)=>{
            let random = new RandExp(
                module.exports.fullThreeLineAddress.pattern.replace(/\?<[A-Za-z]+>/g, '')
            ).gen();
            let info = values.zipCode?(zipInfo(values.zipCode.substring(0, 5)) || {}):{};
            let lines = random.split("\n");
            let lineParts = lines.slice();
            lineParts[1] = (lineParts[1]).split(',');
            return `${values['address.streetAddress'] || lineParts[0]}
${(info.city) || values['address.cityName'] || lineParts[1][0]}, ${info.abbreviation || values['address.stateAbbr'] || lineParts[1][1] || ''}
${values['address.zipCode'] || lineParts[2] }`;
        }
    },
    zipCode : {
        pattern: '(?<zipcode>^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)'
    },
    stateAbbr : {
        pattern: '(?<stateabbreviation>^[A-Z]{2})'
    },
    streetAddress : {
        pattern: '^\s+(\d{2,5}\s+)(?![a|p]m\b)(([a-zA-Z|\s+]{1,5}){1,2})?([\s|\,|.]+)?(([a-zA-Z|\s+]{1,30}){1,4})(court|ct|street|st|drive|dr|lane|ln|road|rd|blvd)$'
    },
    cityName : {
        pattern: '^([a-zA-Z|\s+]{1,30}){1,2}([\s|\,|.]+)$'
    },
}
