'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
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
import type { Department, Presence, TeamMember } from '@/lib/data'
import { userFromEmail } from '@/lib/user'
import styles from './team.module.css'

const departments: Department[] = ['Product', 'Engineering', 'Design', 'Support']

const presenceLabel: Record<Presence, string> = {
  away: 'Away',
  busy: 'In a meeting',
  offline: 'Offline',
  online: 'Online',
}

const roles = ['Product Manager', 'Frontend Engineer', 'Backend Engineer', 'Product Designer', 'Support Specialist']

export function TeamDirectory({ team: initial }: Readonly<{ team: TeamMember[] }>): ReactNode {
  const toast = useToast()
  const [team, setTeam] = useState(initial)
  const [query, setQuery] = useState('')
  const [inviting, setInviting] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(roles[0])
  const [emailError, setEmailError] = useState<string>()

  const normalized = query.trim().toLowerCase()
  const visible = team.filter((member) =>
    [member.name, member.role, member.department, ...member.skills].some((text) =>
      text.toLowerCase().includes(normalized),
    ),
  )

  const invite = (): boolean => {
    const address = email.trim()
    if (!/^\S+@\S+\.\S+$/.test(address)) {
      setEmailError('Enter a valid email address.')
      return false
    }
    if (team.some((member) => member.email === address)) {
      setEmailError('This person is already on the team.')
      return false
    }
    setTeam((current) => [
      ...current,
      {
        department: 'Product',
        email: address,
        name: userFromEmail(address).name,
        pending: true,
        presence: 'offline',
        role,
        skills: [],
      },
    ])
    toast.success({ description: address, title: 'Invitation sent' })
    return true
  }

  return (
    <>
      <div className={styles.toolbar}>
        <Input
          aria-label="Search the team"
          className={styles.search}
          elementBefore={<SearchIcon />}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, role or skill"
          value={query}
        />
        <Button
          className={styles.invite}
          onClick={() => {
            setEmail('')
            setEmailError(undefined)
            setInviting(true)
          }}
        >
          Invite member
        </Button>
      </div>

      <Tabs>
        <TabList>
          <Tab extraContentRight={<Badge size="sm">{visible.length}</Badge>} label="Directory" />
          <Tab label="By department" />
        </TabList>
        <TabPanels>
          <TabPanel>
            {visible.length === 0 ? (
              <EmptyState
                description="No one matches the search."
                icon={
                  <Icon>
                    <TeamIcon />
                  </Icon>
                }
                title="No people found"
                variant="outline"
              />
            ) : (
              <ul className={styles.grid}>
                {visible.map((member) => (
                  <li key={member.email}>
                    <Card className={styles.card} variant="outline">
                      <CardBody>
                        <div className={styles.header}>
                          <Tooltip content={presenceLabel[member.presence]}>
                            <span>
                              <Avatar name={member.name} size="lg" status={member.presence} />
                            </span>
                          </Tooltip>
                          <div>
                            <div className={styles.name}>{member.name}</div>
                            <div className={styles.role}>{member.role}</div>
                          </div>
                          {member.pending ? (
                            <Badge colorScheme="warning" size="sm" variant="subtle">
                              Invited
                            </Badge>
                          ) : null}
                        </div>
                        <div className={styles.skills}>
                          {member.skills.map((skill) => (
                            <Chip key={skill} size="sm">
                              {skill}
                            </Chip>
                          ))}
                        </div>
                        <Popover>
                          <PopoverTrigger>
                            <Button size="sm" variant="outline">
                              Contact
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent aria-label={`Contact ${member.name}`}>
                            <p className={styles.contact}>
                              <a href={`mailto:${member.email}`}>{member.email}</a>
                            </p>
                            <PopoverClose>
                              <Button size="sm">Done</Button>
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
            <Tree aria-label="Departments" defaultExpanded={departments}>
              {departments.map((department) => (
                <TreeItem key={department} value={department}>
                  <TreeItemLabel>
                    {department} ({team.filter((member) => member.department === department).length})
                  </TreeItemLabel>
                  <TreeItemGroup>
                    {team
                      .filter((member) => member.department === department)
                      .map((member) => (
                        <TreeItem key={member.email} value={member.email}>
                          <TreeItemLabel>
                            {member.name} · {member.role}
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
          <ModalHeader>Invite a member</ModalHeader>
          <ModalBody>
            <div className={styles.form}>
              <Field errorText={emailError} label="Email" required>
                <Input
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setEmailError(undefined)
                  }}
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                />
              </Field>
              <Field label="Role">
                <Select onValueChange={(value) => setRole(String(value))} value={role}>
                  <SelectTrigger placeholder="Pick a role" />
                  <SelectContent>
                    {roles.map((item) => (
                      <SelectOption key={item} value={item}>
                        {item}
                      </SelectOption>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="ghost">Cancel</Button>
            </ModalClose>
            <Button onClick={() => invite() && setInviting(false)}>Send invitation</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
