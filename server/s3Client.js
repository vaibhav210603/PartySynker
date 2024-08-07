const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

// Initialize the S3 client without credentials for public access
const s3 = new S3Client({
  region: "eu-north-1",
  // Do not include credentials if accessing a public bucket
});

const getObject = async (key) => {
  try {
    const command = new GetObjectCommand({ Bucket: "songlist", Key: key });
    const response = await s3.send(command);
    return response.Body;
  } catch (error) {
    console.error("Error fetching object:", error);
    throw error;
  }
};

module.exports = { getObject };
