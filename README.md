# Project Description
This mini-project will help to quickly migrate a numerous AWS SSM parameters  from an AWS account to another AWS account.<br>
This is designed to retrieve parameters from the AWS SSM Parameter Store and save them to a JSON file. <br>
Then, it uploads those parameters to a new AWS account using AWS SDK for Node.js.<br>
The script defines two sets of AWS credentials and region - one for the source account and another for the target account.<br>
<br>

# How to Use
Ensure that you have Node.js installed on your local machine.<br>
Install NPM  dependecies: <br>
```
 npm install 
```
 <br>

Update the ***AWS_SSM_SOURCE_REGION*** , ***AWS_SOURCE_ACCESS_KEY*** , ***AWS_SOURCE_SECRET_KEY*** and  values in the `.env` file,copy file out of `.env.example`  with the credentials of AWS account that SSM parameters lives in.<br>
And Update the ***AWS_SSM_TARGET_REGION*** , ***AWS_TARGET_ACCESS_KEY*** and  ***AWS_TARGET_SECRET_KEY*** values in the `.env` file,copy file out of `.env.example`  with valid AWS credentials for your destination account.<br>
Modify the ***SOURCE_SSM_PARAMETER_PATH*** under `.env` to specify the parameter path you want to retrieve parameters from.<br>
Run the script using :

```
node script.js
```
or

```
npm run start
```

<br>
The script will retrieve parameters from the source account, save them to a JSON file, and upload the parameters to the destination account.<br>
 The JSON file will be saved in the current working directory with the name parameters.json.
<br>
 Example: A parameter under path `/api/dev` saved in parameters.json file will look as below: <br>

 ```

  {
    "Name": "/api/dev/token",
    "Value": "uQg5Y7vZ9?R9buU3blBxHR",
    "Type": "SecureString",
    "KeyId": null,
    "Encrypted": true
  }

  ```


  ### ***Please keep in mind to use least privilege approach on creating AWS keys for this project usage***
  ### ***The only AWS IAM permissions you need is AWS SSM  limited to the actions:(GetParametersByPath,PutParameter,Encrypt,Decrypt)***