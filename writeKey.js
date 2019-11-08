var fs = require("fs");

fs.writeFileSync("./server.key", process.env.SF_PRIVATE_KEY);