const fs = require("fs");
const path = require("path");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var changesApexClass = JSON.parse(fs.readFileSync("changesApexClass.json", "utf8")).result.records.map(function(change) { change.type = "ApexClass"; });
var changesApexComponent = JSON.parse(fs.readFileSync("changesApexComponent.json", "utf8")).result.records.map(function(change) { change.type = "ApexComponent"; });
var changesApexPage = JSON.parse(fs.readFileSync("changesApexPage.json", "utf8")).result.records.map(function(change) { change.type = "ApexPage"; });
var changesApexTrigger = JSON.parse(fs.readFileSync("changesApexTrigger.json", "utf8")).result.records.map(function(change) { change.type = "ApexTrigger"; });
var changesAuraDefinitionBundle = JSON.parse(fs.readFileSync("changesAuraDefinitionBundle.json", "utf8")).result.records.map(function(change) { change.type = "AuraDefinitionBundle"; });
var changesStaticResource = JSON.parse(fs.readFileSync("changesStaticResource.json", "utf8")).result.records.map(function(change) { change.type = "StaticResource"; });

var allChanges = changesApexClass.concat(changesApexComponent)
                                 .concat(changesApexPage)
                                 .concat(changesApexTrigger)
                                 .concat(changesAuraDefinitionBundle)
                                 .concat(changesStaticResource);

allChanges.sort(function(a, b) {
    if (a.LastModifiedDate > b.LastModifiedDate) {
        return -1;
    } else if (a.LastModifiedDate < b.LastModifiedDate) {
        return 1;
    } else {
        return 0;
    }
});
console.log(JSON.stringify(allChanges));

function getPathFromType(type) {
    switch(type) {
        case "ApexClass":
            return "classes";
        case "ApexComponent":
            return "components";
        case "ApexPage":
            return "pages";
        case "ApexTrigger":
            return "triggers";
        case "AuraDefinitionBundle":
            return "aura"
        case "StaticResource":
            return "staticresourcs";
        default:
            throw new Error("unknown change type: " + type);
    }
}

function getExtensionFromType(type) {
    switch(type) {
        case "ApexClass":
            return ".cls";
        case "ApexComponent":
            return ".component";
        case "ApexPage":
            return ".page";
        case "ApexTrigger":
            return ".trigger";
        case "AuraDefinitionBundle":
            return "/*";
        case "StaticResource":
            return ".resource";
        default:
            throw new Error("unknown change type: " + type);
    }
}

async function addChange(change) {
    var currentFile = path.join("./metadata", getPathFromType(change.type), change.Name + getExtensionFromType(change.type));
    switch(type) {
        case "AuraDefinitionBundle":
            await exec('git add ' + currentFile);
            break;
        default:
            await exec('git add ' + currentFile);
            await exec('git add ' + currentFile + "-meta.xml");
            break;
    }
}

async function commitChanges() {
    for (var change of allChanges) {
        await exec('git config --local user.email "action@github.com" && git config --local user.name "' + change.LastModifiedBy.Name + '"');
        await addChange(change);
        await exec('git commit -m "Change from ' + change.LastModifiedBy.Name + ' on ' + change.LastModifiedDate + '"');
    }
    process.exit(0);
}

commitChanges();