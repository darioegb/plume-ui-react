'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Alert,
  Button,
  Field,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  useToast,
} from 'plume-ui-react'
import styles from './settings.module.css'

const regions = ['europe', 'northAmerica', 'asiaPacific'] as const

export function WorkspaceSettings(): ReactNode {
  const t = useTranslations('settings.workspace')
  const toast = useToast()
  const [name, setName] = useState('Acme Studio')
  const [region, setRegion] = useState<string>('europe')
  const [confirm, setConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  return (
    <div className={styles.section}>
      <Field label={t('name')} required>
        <Input onChange={(event) => setName(event.target.value)} value={name} />
      </Field>
      <Field helperText={t('regionHelper')} label={t('region')}>
        <Select onValueChange={(value) => setRegion(String(value))} value={region}>
          <SelectTrigger placeholder={t('regionPlaceholder')} />
          <SelectContent>
            {regions.map((item) => (
              <SelectOption key={item} value={item}>
                {t(`regions.${item}`)}
              </SelectOption>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div>
        <Button disabled={name.trim() === ''} onClick={() => toast.success({ title: t('updated') })}>
          {t('save')}
        </Button>
      </div>

      <Alert status="error" title={t('dangerTitle')}>
        {t('dangerBody')}
      </Alert>
      <div>
        <Button colorScheme="error" onClick={() => setDeleting(true)} variant="outline">
          {t('delete')}
        </Button>
      </div>

      <Modal
        onOpenChange={(open) => {
          setDeleting(open)
          if (!open) setConfirm('')
        }}
        open={deleting}
      >
        <ModalContent>
          <ModalHeader>{t('deleteTitle', { name: name || t('theWorkspace') })}</ModalHeader>
          <ModalBody>
            <Field helperText={t('confirmHelper', { name })} label={t('name')}>
              <Input onChange={(event) => setConfirm(event.target.value)} value={confirm} />
            </Field>
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="ghost">{t('cancel')}</Button>
            </ModalClose>
            <ModalClose>
              <Button
                colorScheme="error"
                disabled={confirm !== name}
                onClick={() => toast.warning({ description: t('keptBody'), title: t('kept') })}
              >
                {t('confirm')}
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
