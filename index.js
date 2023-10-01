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
   try {
      const { stdout, stderr } = await exec(`taskkill /F /PID ${pid}`)
      if (stderr) throw stderr

      return stdout
   } catch (error) {
      if (!error?.stdout && !error?.stderr) return null

      if (error?.stderr?.includes('Access is denied.')) throw `${error?.stderr}Try running this command as administrator`

      if (error?.stderr) throw error?.stderr

      throw error
   }
}

const main = async (port) => {
   try {
      const process = await getProcess(port)
      const pid = process?.split(' ')?.filter((item) => item)?.[4]

      if (!pid) return console.log(`Process not found on port ${port}`)

      await killProcess(pid)
      console.log(`Process ${pid} killed`)
   } catch (error) {
        console.log(error)
   }
}

main(process.argv[2] || null)
