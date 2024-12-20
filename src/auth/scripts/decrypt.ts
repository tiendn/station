import CryptoJS from "crypto-js"

const keySize = 256
const iterations = 100

const decrypt = (transitmessage: string, pass: string, algo: "sha1" | "sha256" = "sha256") => {
	try {
		const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
		const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
		const encrypted = transitmessage.substring(64);

		const key = CryptoJS.PBKDF2(pass, salt, {
			keySize: keySize / 32,
			iterations: iterations,
			hasher: algo === "sha1" ? CryptoJS.algo.SHA1 : CryptoJS.algo.SHA256,
		});

		const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
			iv: iv,
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC,
		}).toString(CryptoJS.enc.Utf8);
		return decrypted;
	} catch (error) {
		return "";
	}
};

export default decrypt
