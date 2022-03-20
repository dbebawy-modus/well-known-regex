const RandExp = require('randexp');

const name = {
    fullName : {
        pattern: '^(?<firstname>[A-Za-z][A-Za-z]+) (?<middlename>[A-Za-z][A-Za-z]+ )(?<lastname>[A-Za-z][A-Za-z]+)$',
        wants: ['name.firstName', 'name.lastName', 'name.middleName'],
        generate : (values)=>{
            let random = new RandExp(
                module.exports.fullName.pattern.replace(/\?<[A-Za-z]+>/g, '')
            ).gen();
            let parts = random.split(' ');
            if(values['name.firstName']) parts[0] = values['name.firstName'];
            if(values['name.middleName']) parts[1] = values['name.middleName'];
            if(values['name.lastName']) parts[2] = values['name.lastName'];
            return parts.join(' ');
        }
    },
    firstName : {
        pattern: '^(?<firstname>[A-Za-z][A-Za-z]+)$',
        wants: ['internet.locales'] //a set of locales
    },
    title : {
        pattern: '^(?<firstname>[A-Za-z][A-Za-z ]+)$',
    },
    lastName : {
        pattern: '^(?<middlename>[A-Za-z][A-Za-z ]+)$',
        wants: ['internet.locales']
    },
    middleName : {
        pattern: '^(?<lastname>[A-Za-z][A-Za-z ]+)$',
        wants: ['internet.locales']
    },
    gender : {
        pattern: '^(?<gender>[A-Za-z ]{3, 30})'
    }
}

module.exports = name;
