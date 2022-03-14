const should = require('chai').should();
const {
    WKR,
    classifyRegex,
    generateData,
    isRegexType,
    wkrKeys,
    wkrAccessor
} = require('../well-known-regex');

describe('well-known-regex', ()=>{
    describe('identity', ()=>{
        wkrKeys.forEach((key)=>{
            it(`${key} recognizes itself`, ()=>{
                isRegexType(key, wkrAccessor.get(key)).should.equal(
                    true,
                    `Expected ${key} to be it's own type`
                );
            });
        });
    });

    describe('.classifyRegex()', ()=>{
        it('classifies a simple object', ()=>{
            let classified = classifyRegex({
                name : WKR.internet.userName ,
                email : WKR.internet.email ,
            }, 'en_us');
            should.exist(classified);
            Object.keys(classified).length.should.equal(2);
            classified.name.should.equal('internet.userName');
            classified.email.should.equal('internet.email');
        });
    });

    describe('.generate()', ()=>{
        it('generates a simple object', ()=>{
            let generated = generateData({
                fullName : WKR.name.fullName,
                firstName : WKR.name.firstName,
                middleName : WKR.name.middleName,
                lastName : WKR.name.lastName,
                name : WKR.internet.userName,
                email : WKR.internet.email,
                fullAddress : WKR.address.fullThreeLineAddress,
                zipCode : WKR.address.zipCode,
                cityName : WKR.address.cityName,
                stateAbbr : WKR.address.stateAbbr,
                streetAddress : WKR.address.streetAddress,
            }, { locale: 'en_us', seed: 'some_seed' });
            should.exist(generated.name);
            should.exist(generated.email);
            should.exist(generated.zipCode);
            should.exist(generated.cityName);
            should.exist(generated.stateAbbr);
            should.exist(generated.streetAddress);
            should.exist(generated.firstName);
            should.exist(generated.middleName);
            should.exist(generated.lastName);
            should.exist(generated.fullAddress);
            should.exist(generated.fullName);
            generated.name.should.equal("Dewitt67");
            generated.email.should.equal("Pauline_Goldner59@gmail.com");
            generated.zipCode.should.equal("31840");
            generated.cityName.should.equal("Plainfield");
            generated.stateAbbr.should.equal("MD");
            generated.streetAddress.should.equal("327 Leonard Grove");
            generated.firstName.should.equal("Shayne");
            generated.middleName.should.equal("a");
            generated.lastName.should.equal("Pouros");
            generated.fullAddress.should.equal("327 Leonard Grove\nPlainfield, MD\n31840");
            generated.fullName.should.equal("Shayne a Pouros");
        });
    });
});
