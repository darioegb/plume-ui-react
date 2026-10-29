import type { ReactNode } from 'react'
import { Markdown } from '@storybook/addon-docs/blocks'
import api from './api.generated.json'

interface ApiProp {
  default: string | null
  description: string
  name: string
  required: boolean
  since?: string
  type: string
}

interface ApiComponent {
  description: string
  name: string
  native: string[]
  nativeAll: boolean
  props: ApiProp[]
  since?: string
}

function Since({ version }: Readonly<{ version?: string }>): ReactNode {
  if (!version) return null
  return <span className="api-since">Since {version}</span>
}

const folders = api as Record<string, ApiComponent[]>

function orderComponents(
  components: ApiComponent[],
  componentName: string,
  importNames: string[] | undefined,
): ApiComponent[] {
  const wanted = importNames ?? [componentName]
  const byName = new Map(components.map((component) => [component.name, component]))
  const first = wanted.flatMap((name) => byName.get(name) ?? [])
  const rest = components.filter((component) => !first.includes(component))
  const main = first.length > 0 ? first : rest.filter((c) => c.name === componentName)
  const others = rest.filter((component) => !main.includes(component))
  return [...main, ...others.sort((a, b) => a.name.localeCompare(b.name))]
}

function NativeNote({ component }: Readonly<{ component: ApiComponent }>): ReactNode {
  if (component.nativeAll) {
    return <p className="api-native">It also takes the attributes of the element it renders.</p>
  }
  if (component.native.length === 0) return null
  return (
    <p className="api-native">
      It also takes{' '}
      {component.native.map((name, index) => (
        <span key={name}>
          {index > 0 ? ', ' : ''}
          <code>{name}</code>
        </span>
      ))}
      .
    </p>
  )
}

function PropsTable({ component }: Readonly<{ component: ApiComponent }>): ReactNode {
  if (component.props.length === 0) {
    return <p className="api-native">No props of its own.</p>
  }
  return (
    <div className="api-table-wrapper">
      <table className="api-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {component.props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
                {prop.required ? (
                  <span aria-label="required" className="api-required" title="Required">
                    *
                  </span>
                ) : null}
                <Since version={prop.since} />
              </td>
              <td>
                <code className="api-type">{prop.type}</code>
              </td>
              <td>{prop.default ? <code>{prop.default}</code> : <span aria-label="none">-</span>}</td>
              <td>{prop.description ? <Markdown>{prop.description}</Markdown> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export interface ApiNote {
  body: string
  title: string
}

interface ApiReferenceProps {
  componentName: string
  folder: string
  importNames?: string[]
  notes?: ApiNote[]
}

const slug = (title: string): string => title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function ApiReference({
  componentName,
  folder,
  importNames,
  notes = [],
}: Readonly<ApiReferenceProps>): ReactNode {
  const components = orderComponents(folders[folder] ?? [], componentName, importNames)
  if (components.length === 0) return null
  const ownNotes = new Map(
    notes.filter((note) => components.some((c) => c.name === note.title)).map((n) => [n.title, n]),
  )
  const otherNotes = notes.filter((note) => !ownNotes.has(note.title))
  return (
    <>
      <h3 id="api-reference">API reference</h3>
      <p>
        Every component and part takes <code>className</code>, <code>style</code> and{' '}
        <code>ref</code>. A <code>*</code> marks a required prop.
      </p>
      {components.map((component, index) => (
        <section key={component.name}>
          <h4 id={`api-${component.name}`}>
            {component.name}
            <Since version={component.since} />
          </h4>
          {index > 0 && component.description ? <Markdown>{component.description}</Markdown> : null}
          {ownNotes.has(component.name) ? <Markdown>{ownNotes.get(component.name)?.body ?? ''}</Markdown> : null}
          <PropsTable component={component} />
          <NativeNote component={component} />
        </section>
      ))}
      {otherNotes.map((note) => (
        <section key={note.title}>
          <h4 id={`api-${slug(note.title)}`}>{note.title}</h4>
          <Markdown>{note.body}</Markdown>
        </section>
      ))}
    </>
  )
}
