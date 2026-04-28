import { useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { OverviewPage }    from './OverviewPage'
import { EvaluationPage }  from './EvaluationPage'
import { ScholarshipPage } from './ScholarshipPage'
import { ProfilePage }     from './ProfilePage'
import { useHistory }      from '../hooks/useHistory'

export function DashboardPage({ user }) {
  const [page, setPage] = useState('overview')
  const { evals, schols, addEval, addSchol } = useHistory(user?.uid)

  const pageTitle = {
    overview:    'Dashboard Overview',
    evaluation:  'Bias Detection Engine',
    scholarship: 'Fair Scholarship Finder',
    profile:     'Profile & History',
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8F7F3' }}>
      <Sidebar user={user} page={page} onNavigate={setPage} />

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">UN SDG 10 · Reducing Educational Inequalities</div>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24 }}>{pageTitle[page]}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: '#E1F5EE', color: '#0F6E56' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#1D9E75' }} />
                AI Active
              </div>
              <div className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: '#F1EFE8', color: '#5F5E5A' }}>
                {evals.length + schols.length} saved
              </div>
            </div>
          </div>

          {/* Page content */}
          {page === 'overview'    && <OverviewPage    user={user} evals={evals} schols={schols} onNavigate={setPage} />}
          {page === 'evaluation'  && <EvaluationPage  user={user} onSave={addEval} />}
          {page === 'scholarship' && <ScholarshipPage user={user} onSave={addSchol} />}
          {page === 'profile'     && <ProfilePage     user={user} evals={evals} schols={schols} />}
        </div>
      </main>
    </div>
  )
}
