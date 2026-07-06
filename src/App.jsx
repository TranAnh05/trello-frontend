import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function SelectModel () {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    setMode(event.target.value)
  }

  return (
    <FormControl size='small' sx={{ minWidth: 120 }}>
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value='light'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <LightModeIcon fontSize="small" /> Light
          </div>
        </MenuItem>
        <MenuItem value='dark'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DarkModeOutlinedIcon fontSize="small" /> Dark
          </div>
        </MenuItem>
        <MenuItem value='system'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <SettingsBrightnessIcon fontSize="small" /> System
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}

function App() {
  return (
    <>
      <SelectModel />
      <hr />
      <ModeToggle />
      <hr />
      <h1>Hello world</h1>
      <Typography variant='body2' color='text.secondary'>This is a simple paragraph</Typography>
    </>
  )
}

export default App
