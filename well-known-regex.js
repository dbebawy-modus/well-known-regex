const access = require('object-access');
const {faker} = require('@faker-js/faker');
const RandExp = require('randexp');

const WKR = {};
const group = (name)=>{
    let group = require('./src/'+name);
    Object.keys(group).forEach((key)=>{
        group[key].id = name + '.'+key;
    });
    WKR[name] = group;
};

['internet', 'name', 'address'].forEach((key)=> group(key) );

var accessor = {
    get: (path)=>{ return access.get(WKR, path) },
    set: (path, value)=>{ return access.set(WKR, path, value) }
}

var fakerAccessor = {
    get: (path)=>{ return access.get(faker, path) },
    set: (path, value)=>{ throw new Error('cannot set faker values'); }
}

const isRegexType = function(varPath, value){ //value is a schema node or a JSON value
    let field = accessor.get(varPath);
    if(!field) return false;
    try{
        if(!value) return false;
        if(value.pattern && (new RegExp(value.pattern))){
            return field.pattern.toString() === value.pattern.toString();
        }
    }catch(ex){
        console.log(ex);
    }
    return false;
    //assume primitive type
}


const flatList = Object.keys(WKR).reduce((agg, key)=>{
    let entries = Object.keys(WKR[key]).map((subkey)=> `${key}.${subkey}`);
    return agg.concat(entries);
}, []);

const classifyRegex = (ob, locale = 'en_us')=>{
    let classified = {};
    Object.keys(ob).forEach((key)=>{
        let found = false;
        flatList.forEach((candidate)=>{
            if(found) return;
            if(isRegexType(candidate, ob[key])){
                classified[key] = candidate;
                found = true;
            }
        });
    });
    return classified;
}

const keepIt = true;
const sublist = (list, contains, allItems)=>{
    return list.filter((item)=>{
        if(allItems){ //item must have all deps in contains
            if(!item.type.wants) return keepIt;
            let missedOne = false;
            item.type.wants.forEach((dep)=>{
                missedOne = missedOne && contains.indexOf(dep) !== -1;
            });
            if(missedOne) return !keepIt;
        }else{ //must have one item in contains
            if(!item.type.wants) return !keepIt;
            let foundOne = false;
            item.type.wants.forEach((dep)=>{
                if(foundOne) return;
                if(contains.indexOf(dep) !== -1){
                    foundOne = true;
                }
            });
            if(foundOne) return keepIt;
        }
    })
}
const thisNotInThat = (ths, tht)=>{
    return ths.filter((i)=> tht.indexOf(i) === -1)
}

const allDeps = (list)=>{
    return list.reduce((agg, item)=>{
        if(item.type.wants){
            return agg.concat(item.type.wants)
        }
        return agg;
    }, [])
}

const allPresent = (list)=>{
    return list.reduce((agg, item)=>{
        return agg.concat([item.type.id]);
    }, [])
}

const swap = (set, origin, destination)=>{
    set.forEach((item)=>{
        let pos = origin.indexOf(item);
        origin.splice(pos, 1);
        destination.push(item);
    });
}

const generateData = (ob, options = {locale:'en_us'})=>{
    let classified = classifyRegex(ob, options.locale);
    //todo: set faker random
    let result = {};
    let fields = Object.keys(classified).map((key)=>{
        return {
            name: key,
            type: accessor.get(classified[key])
        }
    });
    let orderedFields = [];
    //stage1: everything with no deps
    let indices = [];
    fields.slice().forEach((field, index)=>{
        if(!field.type.wants){
            swap([field], fields, orderedFields);
        }
    });
    let iterateAndClearDeps = (inn, out)=>{
        //stage2: everything with all deps in list
        let todo = sublist(out, allDeps(inn), true);
        todo.slice().forEach((field, index)=>{
            swap([field], out, inn);
        });
        //stage3: repeat until you iterate with no adds
        if(!todo.length) return;
        return iterateAndClearDeps(inn, out);
    };
    //trigger stage2/3
    iterateAndClearDeps(orderedFields, fields);
    //stage4: get all deps left in remain that exist within remaining
    let waitingForDeps = sublist(fields, allDeps(orderedFields.concat(fields)), true);
    let missingStuff = thisNotInThat(fields, waitingForDeps);
    let missingAndWaiting = sublist(fields, allDeps(fields));
    let justMissing = thisNotInThat(missingStuff, missingAndWaiting);
    justMissing.forEach((field, index)=>{
        swap([field], out, orderedFields);
    });
    let dependents = [];
    let iterateAndClearLeastBrokenDep = (inn, out)=>{
        //stage 5: add all the fields with missing deps
        let todo = sublist(out, allPresent(out));
        if(!todo.length) return out;
        todo.forEach((field, index)=>{
            swap([field], out, []);
            dependents.push(field);
        });
        let stillMissingStuff = thisNotInThat(out, todo);
        return iterateAndClearLeastBrokenDep(inn, stillMissingStuff);
    }
    let orphans = iterateAndClearLeastBrokenDep(orderedFields, missingAndWaiting);
    // orphans get added in order... we give up
    orderedFields = orderedFields.concat(orphans);
    // hope to pick up some deps w/orphans, deps should be in correct load order
    orderedFields = orderedFields.concat(dependents);
    let results = {};
    let resultsByType = {};
    if(options.seed){
        faker.seed(
            typeof options.seed === 'string'?
            options.seed.split('').map(a=>a.charCodeAt(0)).reduce((a,b)=>a + b):
            options.seed
        )
    }
    orderedFields.forEach((field)=>{
        if(field.type.generate){
            let result = field.type.generate(resultsByType);
            results[field.name] = result;
            resultsByType[field.type.id] = result;
        }else{
            let fake = fakerAccessor.get(field.type.id);
            if(fake){
                results[field.name] = fake();
                resultsByType[field.type.id] = results[field.name];
            }else{
                let noNamedGroups = field.type.pattern.replace(/\?<[A-Za-z][A-Za-z0-9]*>/g, '');
                results[field.name] = new RandExp(noNamedGroups).gen();
                resultsByType[field.type.id] = results[field.name];
            }
        }
    });
    return results;
}

module.exports = {
    WKR,
    classifyRegex,
    generateData,
    isRegexType,
    wkrKeys: flatList,
    wkrAccessor: accessor
};
