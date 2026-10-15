import { useState } from 'react'
import { useTheme } from '@plume-ui-react/core'
import {
  Button,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  DatePicker,
  type DatePickerProps,
} from '@plume-ui-react/lib'

// DateRange isn't exported by @plume-ui-react/lib@0.1.0, so derive it from the public prop.
type DateRange = Parameters<DatePickerProps['onChange']>[0]

const card: React.CSSProperties = {
  border: '1px solid var(--plume-border)',
  borderRadius: 'var(--plume-radius-lg, 12px)',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}

export function App(): React.ReactElement {
  const { colorMode, setColorMode } = useTheme()
  const [date, setDate] = useState<DateRange>({ startDate: null, endDate: null })

  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <header
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Plume UI React — Playground</h1>
        <Button
          colorScheme="secondary"
          variant="outline"
          onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
        >
          {colorMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Buttons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Button colorScheme="primary">Primary</Button>
          <Button colorScheme="secondary">Secondary</Button>
          <Button colorScheme="success">Success</Button>
          <Button colorScheme="error" variant="outline">
            Danger
          </Button>
          <Button colorScheme="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Input</h2>
        <Input placeholder="Type something…" colorScheme="primary" />
        <Input placeholder="Phone (masked)" mask="(###) ###-####" colorScheme="primary" />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>Tabs</h2>
        <Tabs colorScheme="primary">
          <TabList>
            <Tab label="Overview" />
            <Tab label="Features" />
            <Tab label="Pricing" />
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>A themeable, SSR-safe React component library.</p>
            </TabPanel>
            <TabPanel>
              <p>Design tokens, dark mode, Tailwind preset and an unstyled escape hatch.</p>
            </TabPanel>
            <TabPanel>
              <p>Free and open source.</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: '1rem' }}>DatePicker</h2>
        <DatePicker colorScheme="primary" value={date} onChange={setDate} />
        <small style={{ color: 'var(--plume-muted-foreground, #71717a)' }}>
          Selected: {date.startDate ? date.startDate.toLocaleDateString() : '—'}
        </small>
      </section>
    </main>
  )
}
