import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Alert } from '../../components/presentation/alert'
import { DatePicker } from '../../components/form/datepicker'
import { Paginator } from '../../components/interaction/paginator'
import { Spinner } from '../../components/presentation/spinner'
import { Toggle } from '../../components/form/toggle'
import { Modal, ModalClose, ModalContent } from '../../components/overlay/modal'
import { LocaleProvider, useLocale } from '..'
import type { PlumeMessages } from '..'

const es: PlumeMessages = {
  alert: { dismiss: 'Cerrar alerta' },
  paginator: { next: 'Siguiente', page: (page) => `Página ${page}` },
  spinner: { label: 'Cargando' },
}

describe('LocaleProvider', () => {
  it('keeps the defaults without a provider', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('gives the texts to every component below it', () => {
    render(
      <LocaleProvider messages={es}>
        <Spinner />
        <Alert dismissible>Saved</Alert>
        <Paginator count={3} page={1} />
      </LocaleProvider>,
    )
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar alerta' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
  })

  it('lets the labels of the component win over the provider', () => {
    render(
      <LocaleProvider messages={es}>
        <Spinner label="Espere" />
        <Paginator count={3} labels={{ next: 'Avanzar' }} page={1} />
      </LocaleProvider>,
    )
    expect(screen.getByRole('status', { name: 'Espere' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avanzar' })).toBeInTheDocument()
  })

  it('changes the texts when the messages change at runtime', () => {
    const en: PlumeMessages = { spinner: { label: 'Loading data' } }
    const Switch = (): ReactElement => {
      const [lang, setLang] = useState<'en' | 'es'>('en')
      return (
        <LocaleProvider locale={lang} messages={lang === 'en' ? en : es}>
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} type="button">
            switch
          </button>
          <Spinner />
          <Alert dismissible>Saved</Alert>
        </LocaleProvider>
      )
    }
    render(<Switch />)
    expect(screen.getByRole('status', { name: 'Loading data' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'switch' }))
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar alerta' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'switch' }))
    expect(screen.getByRole('status', { name: 'Loading data' })).toBeInTheDocument()
  })

  it('translates the close button of the overlays and the toggles', () => {
    render(
      <LocaleProvider messages={{ overlayClose: { label: 'Cerrar' } }}>
        <Modal defaultOpen>
          <ModalContent>
            <ModalClose />
          </ModalContent>
        </Modal>
      </LocaleProvider>,
    )
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
  })

  it('shares the locale with the components that format dates', () => {
    const Probe = (): ReactElement => <span>{useLocale() ?? 'none'}</span>
    const { rerender } = render(<Probe />)
    expect(screen.getByText('none')).toBeInTheDocument()
    rerender(
      <LocaleProvider locale="es-AR">
        <Probe />
        <DatePicker onChange={() => undefined} />
      </LocaleProvider>,
    )
    expect(screen.getByText('es-AR')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('dd/mm/yyyy')).toBeInTheDocument()
  })

  it('lets config.language win over the locale', () => {
    render(
      <LocaleProvider locale="es-AR">
        <DatePicker config={{ language: 'en-US' }} onChange={() => undefined} />
      </LocaleProvider>,
    )
    expect(screen.getByPlaceholderText('mm/dd/yyyy')).toBeInTheDocument()
  })

  it('does not break a component that has no texts', () => {
    render(
      <LocaleProvider messages={es}>
        <Toggle>Dark</Toggle>
      </LocaleProvider>,
    )
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })
})
