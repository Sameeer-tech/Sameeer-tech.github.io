export type DemoLogin = { user: string; password: string; hint?: string }

export function ProjectDemoAccess({ demo }: { demo: DemoLogin }) {
  return (
    <div className="demo-access" role="note" aria-label="Demo login credentials">
      <p className="mono demo-access-label">Try the live demo</p>
      <p className="demo-access-creds">
        <span>
          Username <strong>{demo.user}</strong>
        </span>
        <span>
          Password <strong>{demo.password}</strong>
        </span>
      </p>
      <p className="demo-access-note">{demo.hint ?? 'Demo account for reviewers — change credentials in production.'}</p>
    </div>
  )
}
