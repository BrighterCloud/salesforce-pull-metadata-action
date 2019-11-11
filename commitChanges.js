const fs = require("fs");
const path = require("path");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var changesApexClass = JSON.parse(fs.readFileSync("changesApexClass.json", "utf8")).result.records.map(function(change) { change.type = "ApexClass"; return change; });
var changesApexComponent = JSON.parse(fs.readFileSync("changesApexComponent.json", "utf8")).result.records.map(function(change) { change.type = "ApexComponent"; return change; });
var changesApexPage = JSON.parse(fs.readFileSync("changesApexPage.json", "utf8")).result.records.map(function(change) { change.type = "ApexPage"; return change; });
var changesApexTrigger = JSON.parse(fs.readFileSync("changesApexTrigger.json", "utf8")).result.records.map(function(change) { change.type = "ApexTrigger"; return change; });
var changesAuraDefinitionBundle = JSON.parse(fs.readFileSync("changesAuraDefinitionBundle.json", "utf8")).result.records.map(function(change) { change.type = "AuraDefinitionBundle"; return change; });
var changesStaticResource = JSON.parse(fs.readFileSync("changesStaticResource.json", "utf8")).result.records.map(function(change) { change.type = "StaticResource"; return change; });

var allChanges = changesApexClass.concat(changesApexComponent)
                                 .concat(changesApexPage)
                                 .concat(changesApexTrigger)
                                 .concat(changesAuraDefinitionBundle)
                                 .concat(changesStaticResource);

allChanges.sort(function(a, b) {
    if (a.LastModifiedDate > b.LastModifiedDate) {
        return 1;
    } else if (a.LastModifiedDate < b.LastModifiedDate) {
        return -1;
    } else {
        return 0;
    }
});

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
            return "staticresources";
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

async function addChange(change, currentFile) {
    switch(change.type) {
        case "AuraDefinitionBundle":
            console.log("git add " + currentFile);
            await exec('git add ' + currentFile);
            break;
        default:
            console.log("git add " + currentFile);
            await exec('git add ' + currentFile);
            console.log("git add " + currentFile + "-meta.xml");
            await exec('git add ' + currentFile + "-meta.xml");
            break;
    }
}

async function commitChanges() {
    for (var change of allChanges) {
        try {
            var currentFile = path.join("./metadata", getPathFromType(change.type), change.Name + getExtensionFromType(change.type));
            if (fs.existsSync(currentFile)) {
                await exec('git config --local user.email "action@github.com" && git config --local user.name "' + change.LastModifiedBy.Name + '"');
                await addChange(change, currentFile);
                console.log('git commit -m "Change from ' + change.LastModifiedBy.Name + ' on ' + change.LastModifiedDate + '"')
                await exec('git commit -m "Change from ' + change.LastModifiedBy.Name + ' on ' + change.LastModifiedDate + '"');
            }
        } catch (e) {
            console.error(e);
            process.exit(-1);
            break;
        }
    }
    process.exit(0);
}

commitChanges();