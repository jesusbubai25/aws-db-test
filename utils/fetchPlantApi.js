const crypto = require("crypto");
const axios = require("axios");

function hmacSHA1Encrypt(encryptText, keySecret) {
  const hmac = crypto.createHmac("sha1", keySecret);
  hmac.update(encryptText);
  return hmac.digest("base64");
}

function getGMTTime() {
  const date = new Date().toUTCString();
  return date;
}

function getDigest(text) {
  return crypto.createHash("md5").update(text).digest("base64");
}

const bodyData = {
  pageNo: 1,
  pageSize: 10,
  // nmiCode:""
};

exports.fetchApi = async (apiDetails) => {
  const key = process.env.API_KEY_ID;
  const keySecret = process.env.API_KEY_SECREAT;

  const body = JSON.stringify(apiDetails?.body || {});
  const contentMd5 = getDigest(body);
  const date = getGMTTime();
  const param = `POST\n${contentMd5}\napplication/json\n${date}\n${apiDetails?.api}`;
  const sign = hmacSHA1Encrypt(param, keySecret);
  try {
    const { data } = await axios({
      method: "post",
      url: `https://www.soliscloud.com:13333${apiDetails?.api}`,
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `API ${key}:${sign}`,
        "Content-MD5": contentMd5,
        Date: date,
      },
      data: body,
    });

    return await data?.data;
  } catch (error) {
    throw error;
  }
};
