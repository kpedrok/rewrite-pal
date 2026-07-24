export class JsonRequestError extends Error {
  constructor(
    readonly status: 400 | 413,
    message: string,
  ) {
    super(message)
  }
}

export async function readJsonRequest(
  request: Request,
  maximumBytes: number,
): Promise<unknown> {
  const contentLength = Number(request.headers.get('content-length'))

  if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
    throw new JsonRequestError(413, 'Request body is too large.')
  }

  const reader = request.body?.getReader()

  if (!reader) {
    throw new JsonRequestError(400, 'Expected a valid JSON request.')
  }

  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytesRead = 0
  let text = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      bytesRead += value.byteLength

      if (bytesRead > maximumBytes) {
        await reader.cancel()
        throw new JsonRequestError(413, 'Request body is too large.')
      }

      text += decoder.decode(value, { stream: true })
    }

    text += decoder.decode()
  } catch (error) {
    if (error instanceof JsonRequestError) {
      throw error
    }

    throw new JsonRequestError(400, 'Expected a valid JSON request.')
  } finally {
    reader.releaseLock()
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new JsonRequestError(400, 'Expected a valid JSON request.')
  }
}
