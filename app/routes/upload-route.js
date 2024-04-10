const express = require("express");
const router = express.Router();
const { get } = require("mongoose");
const verifyJWT = require("../middleware/verify-jwt-token.js");
const fs = require('fs');
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const { ClientSecretCredential } = require('@azure/identity');
const { fileURLToPath } = require("url");
const AZURE_TENANT_ID = process.env.MS_EXPERIENCE_AZURE_TENANT_ID
const AZURE_CLIENT_ID = process.env.MS_EXPERIENCE_AZURE_CLIENT_ID
const AZURE_CLIENT_SECRET = process.env.MS_EXPERIENCE_AZURE_CLIENT_SECRET
const AZURE_CONTAINER_NAME = process.env.MS_EXPERIENCE_AZURE_CONTAINER_NAME
const containerName = AZURE_CONTAINER_NAME;
const account = process.env.MS_EXPERIENCE_ACCOUNT_NAME || "";

const upload = multer({ dest: "./uploads/" });
async function uploadToAzure(blobName, localFilePath) {

  // Azure AD Credential information is required to run this sample:
  if (
    !AZURE_TENANT_ID ||
    !AZURE_CLIENT_ID ||
    !AZURE_CLIENT_SECRET ||
    !AZURE_CONTAINER_NAME
  ) {
    console.warn(
      "Azure AD authentication information not provided, but it is required to run this sample. Exiting."
    );
    return;
  }

  // Will be used as a fallback authentication source.
  const clientCredential = new ClientSecretCredential(
    AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    clientCredential
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const result = await blockBlobClient.uploadFile(localFilePath);
}


router.get("/", verifyJWT, async (req, res) => {

  let arr = [];
  let i = 1;
  let blobs = containerClient.listBlobsFlat();
  for await (const blob of blobs) {
    arr.push({
      name: blob.name
    });
  }

  res.status(200).send(arr);
});

router.get("/:id", verifyJWT, (req, res) => {
  res.status(200).send({ resp: targetData });
});


router.post("/", upload.array("files"), async (req, res) => {
  var arr = [];
  await req.files.forEach(async (file) => {
    var localFilePath = file.destination + "/" + file.filename;
    var blobName = file.originalname;
    var link = `https://${account}.blob.core.windows.net` + `/${containerName}/${blobName}`
    arr.push(link);

    try {
      await uploadToAzure(blobName, localFilePath).catch((err) => {
        console.log(err)
      });
      fs.rmSync(localFilePath);
    } catch (e) {
      console.error(e);
      res.status(400).send({ resp: err })
    }

  })

  res.status(200).send(arr);
});

module.exports = router;
