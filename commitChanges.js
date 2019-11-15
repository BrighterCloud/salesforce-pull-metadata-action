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
var changesFlowDefinitions = JSON.parse(fs.readFileSync("changesFlowDefinitions.json", "utf8")).result.records.map(function(change) { change.type = "FlowDefinition"; return change; });

console.log("Flow Changes: " + JSON.stringify(changesFlowDefinitions));

var allChanges = changesApexClass.concat(changesApexComponent)
                                 .concat(changesApexPage)
                                 .concat(changesApexTrigger)
                                 .concat(changesAuraDefinitionBundle)
                                 .concat(changesStaticResource)
                                 .concat(changesFlowDefinitions);

allChanges.sort(function(a, b) {
    if (a.LastModifiedDate > b.LastModifiedDate) {
        return 1;
    } else if (a.LastModifiedDate < b.LastModifiedDate) {
        return -1;
    } else {
        return 0;
    }
});

function removeDuplicates(originalArray, prop1, prop2) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop1] + "-" + originalArray[i][prop2]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

allChanges = removeDuplicates(allChanges, "type", "Name");

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
        case "FlowDefinition":
            return "flows";
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
        case "FlowDefinition":
            return ".flow";
        default:
            throw new Error("unknown change type: " + type);
    }
}

async function addChange(change, currentFile) {
    switch(change.type) {
        case "AuraDefinitionBundle":
        case "FlowDefinition":
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

function exists(currentPath) {
    if (currentPath[currentPath.length - 1] === "*") {
        currentPath = currentPath.substr(0, currentPath.length - 1);
    }
    return fs.existsSync(currentPath);
}

function getLastModifiedName(lastModifiedBy) {
    if (lastModifiedBy.Name) {
        return lastModifiedBy.Name;
    } else {
        return lastModifiedBy;
    }
}

async function commitChanges() {
    console.log("Found " + allChanges.length + " changes since ever");
    for (var change of allChanges) {
        try {
            var currentFile = path.join("/github/workspace/metadata", getPathFromType(change.type), (change.Name || change.ApiName) + getExtensionFromType(change.type));
            if (exists(currentFile)) {
                await exec('git config --local user.email "action@github.com" && git config --local user.name "' + getLastModifiedName(change.LastModifiedBy) + '"');
                await addChange(change, currentFile);
                await exec('git commit -m "Change from ' + getLastModifiedName(change.LastModifiedBy) + ' on ' + change.LastModifiedDate + '"');
                console.log('git commit -m "Change from ' + getLastModifiedName(change.LastModifiedBy) + ' on ' + change.LastModifiedDate + '"')
            } else {
                console.log("File was already deleted: " + currentFile);
            }
        } catch (e) {
            if (e.stdout && (e.stdout.indexOf("no changes added to commit") >= 0 ||
                e.stdout.indexOf("nothing added to commit but untracked files present") >= 0)) {
                continue;
            } else {
                console.error(e);
                process.exit(-1);
                break;
            }
        }
    }
    process.exit(0);
}

commitChanges();