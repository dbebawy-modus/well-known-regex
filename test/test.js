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
                jobTitle : WKR.name.jobTitle,
                userName : WKR.internet.userName,
                email : WKR.internet.email,
                fullAddress : WKR.address.fullThreeLineAddress,
                zipCode : WKR.address.zipCode,
                city : WKR.address.city,
                stateAbbr : WKR.address.stateAbbr,
                streetAddress : WKR.address.streetAddress,
            }, { locale: 'en_us', seed: 'some_seed' });
            should.exist(generated.userName);
            should.exist(generated.email);
            should.exist(generated.zipCode);
            should.exist(generated.city);
            should.exist(generated.stateAbbr);
            should.exist(generated.streetAddress);
            should.exist(generated.firstName);
            should.exist(generated.middleName);
            should.exist(generated.lastName);
            should.exist(generated.jobTitle);
            should.exist(generated.fullAddress);
            should.exist(generated.fullName);
            generated.userName.should.equal("Marie.Gislason98");
            generated.email.should.equal("Laurel.Bednar@yahoo.com");
            generated.zipCode.should.equal("40639-3273");
            generated.city.should.equal("Newton");
            generated.stateAbbr.should.equal("VT");
            generated.streetAddress.should.equal("69817 Victor Shore");
            generated.firstName.should.equal("Lucie");
            generated.middleName.should.equal("Charlie");
            generated.lastName.should.equal("Franey");
            generated.jobTitle.should.equal("Future Response Officer");
            generated.fullAddress.should.equal("69817 Victor Shore\nNewton, VT\n40639-3273");
            generated.fullName.startsWith("Lucie Charlie Franey").should.equal(true)
        });
    });
});
