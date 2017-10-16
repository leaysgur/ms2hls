# ms2hls-server

Server implementation for ms2hls.

- Api server by `fastify`
- Receive `.webm` from ms2hls-client
- Transcode it into `.ts` w/ `ffmpeg`
- Finally, write HLS `.m3u8` manifests manually
