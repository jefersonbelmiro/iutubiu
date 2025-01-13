const fs = require('fs')
const { execSync } = require('child_process');
const config = require("./config.json")
const download_directory = config.download_directory

if (!fs.existsSync(download_directory)) {
    fs.mkdirSync(download_directory, { recursive: true })
}

for (let index = 0; index < config.urls.length; index++) {
    const url = create_url(config.urls[index])
    console.log(`downloading ${(index + 1)}/${config.urls.length}`)
    execute(config, url)
}

console.log('done')

function execute(config, url) {
    const downlod_path = fs.realpathSync(config.download_directory)
    const binary = config?.binary || `docker run --rm -v "${downlod_path}:/downloads:rw" jauderho/yt-dlp:latest`
    const args = config?.binary_args || `--audio-quality 0 --extract-audio --audio-format "${config.audio_format}" -f "bestaudio" -o "%(title)s.%(ext)s"`
    const bin_with_args = `${binary} ${args} "${url}"`
    try {
        execSync(bin_with_args, { stdio: [] })
    } catch (err) {
        console.log(`ERROR on url: ${url}:\n ${err.stderr}`)
    }
}


function create_url(url) {
    if (!String(url).startsWith("http")) {
        url = `https://www.youtube.com/watch?v=${url}`
    }
    return url
}
