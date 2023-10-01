const exec = require('util').promisify(require('child_process').exec)


const getProcess = async (port) => {
    const { stdout } = await exec(`netstat -ano | findstr :${port}`)
    return stdout
}

const killProcess = async (pid) => {
    const { stdout } = await exec(`taskkill /F /PID ${pid}`)
    return stdout
}


const main = async () => {
    const port = 3000
    const process = await getProcess(port)
    const pid = process.split(' ').filter((item) => item)[4]
 
    await killProcess(pid)
    console.log(`Process ${pid} killed`)
}

main()