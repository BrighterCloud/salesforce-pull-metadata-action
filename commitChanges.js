const fs = require("fs");
const path = require("path");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var changesApexClass = JSON.parse(fs.readFileSync("changesApexClass.json", "utf8")).result.records.map(function(change) { change.type = "ApexClass"; return change; });
var changesApexComponent = JSON.parse(fs.readFileSync("changesApexComponent.json", "utf8")).result.records.map(function(change) { change.type = "ApexComponent"; return change; });
var changesApexPage = JSON.parse(fs.readFileSync("changesApexPage.json", "utf8")).result.records.map(function(change) { change.type = "ApexPage"; return change; });
var changesApexTrigger = JSON.parse(fs.readFileSync("changesApexTrigger.json", "utf8")).result.records.map(function(change) { change.type = "ApexTrigger"; return change; });
var changesAuraDefinitionBundle = JSON.parse(fs.readFileSync("changesAuraDefinitionBundle.json", "utf8")).result.records.map(function(change) { change.Name = change.DeveloperName; change.type = "AuraDefinitionBundle"; return change; });
var changesStaticResource = JSON.parse(fs.readFileSync("changesStaticResource.json", "utf8")).result.records.map(function(change) { change.type = "StaticResource"; return change; });
var changesFlowDefinitions = JSON.parse(fs.readFileSync("changesFlowDefinitions.json", "utf8")).result.records.map(function(change) { change.Name = change.ApiName; change.type = "FlowDefinition"; return change; });


var changesFlexiPages = JSON.parse(fs.readFileSync("changesFlexiPages.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "FlexiPage"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
var changesLWC = JSON.parse(fs.readFileSync("changesLWC.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "LWC"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
var changesProfile = JSON.parse(fs.readFileSync("changesProfile.json", "utf8")).result.records.map(function(change) { change.type = "Profile"; return change; });
var changesPermissionSet = JSON.parse(fs.readFileSync("changesPermissionSet.json", "utf8")).result.records.map(function(change) { change.type = "PermissionSet"; return change; });
var changesValidationRules = JSON.parse(fs.readFileSync("changesValidationRules.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "ValidationRule"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
var changesCustomObject = JSON.parse(fs.readFileSync("changesCustomObject.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "CustomObject"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
var changesCustomField = JSON.parse(fs.readFileSync("changesCustomField.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "CustomField"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
var changesLayout = JSON.parse(fs.readFileSync("changesLayout.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "Layout"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });

var changesTerritory2 = JSON.parse(fs.readFileSync("changesTerritory2.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "Territory2"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
var changesTerritory2Model = JSON.parse(fs.readFileSync("changesTerritory2Model.json", "utf8"));
if (changesTerritory2Model.length > 1) {
    changesTerritory2Model = changesTerritory2Model.result.map(function(change) { change.Name = change.fullName; change.type = "Territory2Model"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
} else {
    changesTerritory2Model.Name = changesTerritory2Model.fullName; changesTerritory2Model.type = "Territory2Model"; changesTerritory2Model.LastModifiedBy = changesTerritory2Model.lastModifiedByName; changesTerritory2Model.LastModifiedDate = changesTerritory2Model.lastModifiedDate;
    changesTerritory2Model = [changesTerritory2Model];
}
var changesTerritory2Type = JSON.parse(fs.readFileSync("changesTerritory2Type.json", "utf8"));
if (changesTerritory2Type.length > 1) {
    changesTerritory2Type = changesTerritory2Type.result.map(function(change) { change.Name = change.fullName; change.type = "Territory2Type"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });
} else {
    changesTerritory2Type.Name = changesTerritory2Type.fullName; changesTerritory2Type.type = "Territory2Type"; changesTerritory2Type.LastModifiedBy = changesTerritory2Type.lastModifiedByName; changesTerritory2Type.LastModifiedDate = changesTerritory2Type.lastModifiedDate;
    changesTerritory2Type = [changesTerritory2Type];
}
var changesTerritory2Rule = JSON.parse(fs.readFileSync("changesTerritory2Rule.json", "utf8")).result.map(function(change) { change.Name = change.fullName; change.type = "Territory2Rule"; change.LastModifiedBy = change.lastModifiedByName; change.LastModifiedDate = change.lastModifiedDate; return change; });

var allChanges = changesApexClass.concat(changesApexComponent)
                                 .concat(changesApexPage)
                                 .concat(changesApexTrigger)
                                 .concat(changesAuraDefinitionBundle)
                                 .concat(changesStaticResource)
                                 .concat(changesFlowDefinitions)
                                 .concat(changesFlexiPages)
                                 .concat(changesLWC)
                                 .concat(changesProfile)
                                 .concat(changesPermissionSet)
                                 .concat(changesValidationRules)
                                 .concat(changesCustomObject)
                                 .concat(changesCustomField)
                                 .concat(changesLayout)
                                 .concat(changesTerritory2)
                                 .concat(changesTerritory2Model)
                                 .concat(changesTerritory2Type)
                                 .concat(changesTerritory2Rule);

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
        case "FlexiPage":
            return "flexipages";
        case "LWC":
            return "lwc";
        case "Profile":
            return "profiles";
        case "PermissionSet":
            return "permissionsets";
        case "Territory2":
        case "Territory2Model":
        case "Territory2Rule":
            return "territory2Models";
        case "Territory2Type":
            return "territory2Types";
        case "ValidationRule":
            return "validationrules";
        case "Layout":
            return "layouts";
        case "CustomObject":
        case "CustomField":
            return "objects";
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
        case "FlexiPage":
            return ".flexipage";
        case "LWC":
            return "/*";
        case "Layout":
            return ".layout";
        case "Profile":
            return ".profile";
        case "PermissionSet":
            return ".permissionset";
        case "ValidationRule":
            return ".validationrule";
        case "CustomObject":
        case "CustomField":
            return ".object";
        case "Territory2":
        case "Territory2Model":
        case "Territory2Type":
        case "Territory2Rule":
            return "NotUsed";
        default:
            throw new Error("unknown change type: " + type);
    }
}

async function addChange(change, currentFile) {
    switch(change.type) {
        case "AuraDefinitionBundle":
        case "FlowDefinition":
        case "FlexiPage":
        case "PermissionSet":
        case "Profile":
        case "Layout":
        case "LWC":
            console.log("git add " + currentFile);
            await exec("git add '" + currentFile + "'");
            break;
        case "CustomObject":
        case "CustomField":
        case "Territory2":
        case "Territory2Model":
        case "Territory2Type":
        case "Territory2Rule":
            console.log("git add " + path.join("/github/workspace/metadata", change.fileName));
            await exec("git add '" + path.join("/github/workspace/metadata", change.fileName) + "'");
            break;
        default:
            console.log("git add " + currentFile);
            await exec("git add " + currentFile);
            console.log("git add " + currentFile + "-meta.xml");
            await exec("git add " + currentFile + "-meta.xml");
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
            var currentFile = path.join("/github/workspace/metadata", getPathFromType(change.type), change.Name + getExtensionFromType(change.type));
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
    try {
        await exec('git config --local user.email "action@github.com" && git config --local user.name "Github Action"');
        console.log("git add untracked files");
        await exec('git add /github/workspace/metadata/*');
        console.log('git commit -m "Committing untracked/deleted files"');
        await exec('git commit -m "Committing untracked/deleted files"');
    } catch (e) {
        console.log("Failed to commit untracked/deleted files");
    }
    process.exit(0);
}

commitChanges();