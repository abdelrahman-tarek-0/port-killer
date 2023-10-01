const exec = require('util').promisify(require('child_process').exec)

const getProcess = async (port) => {
   try {
      const { stdout, stderr } = await exec(`netstat -ano | findstr :${port}`)
      if (stderr) throw stderr

      return stdout
   } catch (error) {
      if (!error?.stdout && !error?.stderr) return null
      throw error
   }
}

const killProcess = async (pid) => {
   const { stdout } = await exec(`taskkill /F /PID ${pid}`)
   return stdout
}

const main = async () => {
   const port = 3000
   const process = await getProcess(port)
   const pid = process.split(' ')?.filter((item) => item)?.[4]
   
   if (!pid) return console.log(`Process not found on port ${port}`)

   await killProcess(pid)
   console.log(`Process ${pid} killed`)
}

main()
