const { SSMClient, GetParametersByPathCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");
const { writeFileSync } = require('fs');
require('dotenv').config()

// Define AWS credentials and region
const sourceawsConfig = {
  region: process.env.AWS_SSM_SOURCE_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SOURCE_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SOURCE_SECRET_KEY
  }
};


const targetawsConfig = {
  region: process.env.AWS_SSM_TARGET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_TARGET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_TARGET_SECRET_KEY
  }
};

// Initialize SSM client with AWS credentials and region
const sourcessmClient = new SSMClient(sourceawsConfig);
const targetssmClient = new SSMClient(targetawsConfig);

// Define function to retrieve all parameters by path
async function getParametersByPath(path) {
  let params = [];
  let nextToken = null;
  
  do {
    const command = new GetParametersByPathCommand({
      Path: path,
      WithDecryption: true,
      Recursive: true,
      NextToken: nextToken
    });
    
    const response = await sourcessmClient.send(command);
    params = params.concat(response.Parameters);
    nextToken = response.NextToken;
  } while (nextToken);

  return params;
}

// Define function to save parameters in JSON file
function saveParametersToFile(params) {
  const jsonParams = params.map(p => {
    return {
      Name: p.Name,
      Value: p.Value,
      Type: p.Type,
      KeyId: p.KeyId || null,
      Encrypted: p.Type === "SecureString"
    };
  });
  
  const jsonString = JSON.stringify(jsonParams, null, 2);
  writeFileSync("parameters.json", jsonString);
}

// Define function to upload parameters to a new AWS account
async function uploadParametersToNewAccount() {
  const params = require("./parameters.json");

  for (let param of params) {
    const command = new PutParameterCommand({
      Name: param.Name,
      Value: param.Value,
      Type: param.Encrypted ? "SecureString" : "String",
      KeyId: param.Encrypted ? undefined : null
    });

    await targetssmClient.send(command);
  }
}

// Run the script
(async () => {
  const params = await getParametersByPath(process.env.SOURCE_SSM_PARAMETER_PATH); 
  saveParametersToFile(params);
  await uploadParametersToNewAccount();
})();
