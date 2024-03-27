const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 0) {
        chunk[i] = chunk[i] - 1;
      }
    }
    this.push(chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("encrypted-data.txt", "r");
  const writeFileHandle = await fs.open("decrypted-data.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const decrypt = new Decrypt();

  readStream.pipe(decrypt).pipe(writeStream);
})();
