import zlib from 'zlib';

export const compress = async (data: string) => {
  const brotliOptions = {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length
  }
  const compressedBuff: Buffer = await new Promise((resolve, reject) => {
    zlib.brotliCompress(data, brotliOptions, (error: any, result: Buffer) => error
      ? reject(error)
      : resolve(result)
    )
  })
  return compressedBuff.toString('base64')
}

export const decompress = async (data: string) => {
  const compressedBuff = Buffer.from(data, 'base64')
  const decompressedBuff: Buffer = await new Promise((resolve, reject) => {
    zlib.brotliDecompress(compressedBuff, (error: any, result: Buffer) => error
      ? reject(error)
      : resolve(result)
    )
  })
  return decompressedBuff.toString()
}