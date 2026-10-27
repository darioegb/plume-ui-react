'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
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

const regions = ['Europe', 'North America', 'Asia Pacific']

export function WorkspaceSettings(): ReactNode {
  const toast = useToast()
  const [name, setName] = useState('Acme Studio')
  const [region, setRegion] = useState('Europe')
  const [confirm, setConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  return (
    <div className={styles.section}>
      <Field label="Workspace name" required>
        <Input onChange={(event) => setName(event.target.value)} value={name} />
      </Field>
      <Field helperText="Where the data of the workspace is stored." label="Data region">
        <Select onValueChange={(value) => setRegion(String(value))} value={region}>
          <SelectTrigger placeholder="Pick a region" />
          <SelectContent>
            {regions.map((item) => (
              <SelectOption key={item} value={item}>
                {item}
              </SelectOption>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div>
        <Button disabled={name.trim() === ''} onClick={() => toast.success({ title: 'Workspace updated' })}>
          Save workspace
        </Button>
      </div>

      <Alert status="error" title="Danger zone">
        Deleting the workspace removes its projects for everyone.
      </Alert>
      <div>
        <Button colorScheme="error" onClick={() => setDeleting(true)} variant="outline">
          Delete workspace
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
          <ModalHeader>Delete {name || 'the workspace'}</ModalHeader>
          <ModalBody>
            <Field helperText={`Type "${name}" to confirm.`} label="Workspace name">
              <Input onChange={(event) => setConfirm(event.target.value)} value={confirm} />
            </Field>
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="ghost">Cancel</Button>
            </ModalClose>
            <ModalClose>
              <Button
                colorScheme="error"
                disabled={confirm !== name}
                onClick={() =>
                  toast.warning({ description: 'This is a demo: nothing was deleted.', title: 'Workspace kept' })
                }
              >
                Delete
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
