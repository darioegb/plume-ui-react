'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  EmptyState,
  Field,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  Tree,
  TreeItem,
  TreeItemGroup,
  TreeItemLabel,
  useToast,
} from 'plume-ui-react'
import { SearchIcon, TeamIcon } from '@/components/icons'
import type { Department, Role, TeamMember } from '@/lib/data'
import { userFromEmail } from '@/lib/user'
import type { ValidationKey } from '@/lib/validation'

const departments: Department[] = ['product', 'engineering', 'design', 'support']

const inviteRoles: Role[] = [
  'productManager',
  'frontendEngineer',
  'backendEngineer',
  'productDesigner',
  'supportSpecialist',
]

export function TeamDirectory({ team: initial }: Readonly<{ team: TeamMember[] }>): ReactNode {
  const t = useTranslations('team')
  const tDepartment = useTranslations('department')
  const tPresence = useTranslations('presence')
  const tRole = useTranslations('role')
  const tSkill = useTranslations('skill')
  const tValidation = useTranslations('validation')
  const toast = useToast()
  const [team, setTeam] = useState(initial)
  const [query, setQuery] = useState('')
  const [inviting, setInviting] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>(inviteRoles[0])
  const [emailError, setEmailError] = useState<ValidationKey>()

  const normalized = query.trim().toLowerCase()
  const visible = team.filter((member) =>
    [member.name, tRole(member.role), tDepartment(member.department), ...member.skills.map((skill) => tSkill(skill))].some(
      (text) => text.toLowerCase().includes(normalized),
    ),
  )

  const invite = (): boolean => {
    const address = email.trim()
    if (!/^\S+@\S+\.\S+$/.test(address)) {
      setEmailError('emailInvalid')
      return false
    }
    if (team.some((member) => member.email === address)) {
      setEmailError('memberExists')
      return false
    }
    setTeam((current) => [
      ...current,
      {
        department: 'product',
        email: address,
        name: userFromEmail(address).name,
        pending: true,
        presence: 'offline',
        role,
        skills: [],
      },
    ])
    toast.success({ description: address, title: t('invitationSent') })
    return true
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          aria-label={t('search')}
          className="min-w-72 max-sm:w-full max-sm:min-w-0"
          elementBefore={<SearchIcon />}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          value={query}
        />
        <Button
          className="ms-auto max-sm:ms-0 max-sm:w-full max-sm:min-w-0"
          onClick={() => {
            setEmail('')
            setEmailError(undefined)
            setInviting(true)
          }}
        >
          {t('invite')}
        </Button>
      </div>

      <Tabs>
        <TabList>
          <Tab extraContentRight={<Badge size="sm">{visible.length}</Badge>} label={t('directory')} />
          <Tab label={t('byDepartment')} />
        </TabList>
        <TabPanels>
          <TabPanel>
            {visible.length === 0 ? (
              <EmptyState
                description={t('empty.description')}
                icon={
                  <Icon>
                    <TeamIcon />
                  </Icon>
                }
                title={t('empty.title')}
                variant="outline"
              />
            ) : (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4 pt-4">
                {visible.map((member) => (
                  <li key={member.email}>
                    <Card className="h-full" variant="outline">
                      <CardBody>
                        <div className="flex items-center gap-3">
                          <Tooltip content={tPresence(member.presence)}>
                            <span>
                              <Avatar name={member.name} size="lg" status={member.presence} />
                            </span>
                          </Tooltip>
                          <div>
                            <div className="font-semibold">{member.name}</div>
                            <div className="text-body-sm text-muted">{tRole(member.role)}</div>
                          </div>
                          {member.pending ? (
                            <Badge colorScheme="warning" size="sm" variant="subtle">
                              {t('invited')}
                            </Badge>
                          ) : null}
                        </div>
                        <div className="my-3 flex min-h-6 flex-wrap gap-1.5">
                          {member.skills.map((skill) => (
                            <Chip key={skill} size="sm">
                              {tSkill(skill)}
                            </Chip>
                          ))}
                        </div>
                        <Popover>
                          <PopoverTrigger>
                            <Button size="sm" variant="outline">
                              {t('contact')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent aria-label={t('contactPerson', { name: member.name })}>
                            <p className="mb-3">
                              <a className="text-primary-text underline" href={`mailto:${member.email}`}>{member.email}</a>
                            </p>
                            <PopoverClose>
                              <Button size="sm">{t('done')}</Button>
                            </PopoverClose>
                          </PopoverContent>
                        </Popover>
                      </CardBody>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </TabPanel>
          <TabPanel>
            <Tree aria-label={t('departments')} defaultExpanded={departments}>
              {departments.map((department) => (
                <TreeItem key={department} value={department}>
                  <TreeItemLabel>
                    {tDepartment(department)} ({team.filter((member) => member.department === department).length})
                  </TreeItemLabel>
                  <TreeItemGroup>
                    {team
                      .filter((member) => member.department === department)
                      .map((member) => (
                        <TreeItem key={member.email} value={member.email}>
                          <TreeItemLabel>
                            {member.name} · {tRole(member.role)}
                          </TreeItemLabel>
                        </TreeItem>
                      ))}
                  </TreeItemGroup>
                </TreeItem>
              ))}
            </Tree>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal onOpenChange={setInviting} open={inviting}>
        <ModalContent>
          <ModalHeader>{t('inviteModal.title')}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Field
                errorText={emailError && tValidation(emailError)}
                label={t('inviteModal.email')}
                required
              >
                <Input
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setEmailError(undefined)
                  }}
                  placeholder={t('inviteModal.emailPlaceholder')}
                  type="email"
                  value={email}
                />
              </Field>
              <Field label={t('inviteModal.role')}>
                <Select onValueChange={(value) => setRole(String(value) as Role)} value={role}>
                  <SelectTrigger placeholder={t('inviteModal.rolePlaceholder')} />
                  <SelectContent>
                    {inviteRoles.map((item) => (
                      <SelectOption key={item} value={item}>
                        {tRole(item)}
                      </SelectOption>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="ghost">{t('inviteModal.cancel')}</Button>
            </ModalClose>
            <Button onClick={() => invite() && setInviting(false)}>{t('inviteModal.send')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
