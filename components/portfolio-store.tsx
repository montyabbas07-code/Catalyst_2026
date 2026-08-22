'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Readiness = 'ready' | 'needs-review' | 'incomplete'

export type PeerComment = {
  author: string
  text: string
}

export type RecipeField = {
  key: string
  label: string
  value: string | null
  complete: boolean
  /** severity when incomplete */
  severity?: 'warning' | 'danger'
  /** Sous Chef comment on this field */
  peerComment?: PeerComment | null
}

export type Faq = {
  id: string
  question: string
  answer: string
  askedBy?: string
}

export type Project = {
  id: string
  name: string
  owner: string
  ownerEmail: string
  codebaseUrl: string
  sousChef: string | null
  status: string
  readiness: Readiness
  hypothesis: string
  elevatorPitch?: string
  faqs?: Faq[]
  fields: RecipeField[]
  handedOver?: boolean
}

export type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  initials: string
  availability: 'active' | 'transferred' | 'available'
  active: string[]
  backups: string[]
}

function missingCount(p: Project) {
  return p.fields.filter((f) => !f.complete).length
}

const seedProjects: Project[] = [
  {
    id: 'momentum-alpha',
    name: 'Momentum Alpha',
    owner: 'Alex Chen',
    ownerEmail: 'alex.chen@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/momentum-alpha',
    sousChef: 'Sarah Patel',
    status: 'Active',
    readiness: 'needs-review',
    hypothesis:
      'Cross-sectional price momentum persists over 1–3 month horizons in liquid ASX 200 names; a dual moving-average crossover captures the trend while filtering short-term noise.',
    elevatorPitch:
      'Momentum Alpha is a cross-sectional momentum strategy on liquid ASX 200 names that captures medium-term trends via a dual moving-average crossover, packaged here with its full research context so the next owner can reproduce, extend, or retire it without starting from scratch.',
    faqs: [
      {
        id: 'ma-1',
        question: 'What market does this run on?',
        answer: 'Liquid ASX 200 constituents using daily price data.',
      },
      {
        id: 'ma-2',
        question: 'What is the biggest open risk?',
        answer:
          'The 100-day window is highly sensitive during earnings season; a volatility filter is recommended before deployment.',
      },
      {
        id: 'ma-3',
        question: 'Who is the Sous Chef?',
        answer: 'Sarah Patel, who has left tips on the dataset and parameters.',
      },
    ],
    fields: [
      {
        key: 'code',
        label: 'Code version',
        value: 'commit a8c4f2',
        complete: true,
        peerComment: null,
      },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 daily prices — snapshot 12 Aug 2026',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'Confirmed I can access this snapshot. Worth noting the data excludes dividends — make sure the backtest accounts for this.',
        },
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: '20-day / 100-day moving average',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'We tested a 50/200 window on the US side and saw a better Sharpe. Worth a sensitivity run before locking this in.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Rebalance weekly, 10 bps transaction cost',
        complete: true,
        peerComment: null,
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Hypothesis and signal construction documented.\n\nAdditional findings from Jan-May 2026 testing:\n- The crossover signal is highly sensitive to the 100-day window during earnings seasons.\n- Tested using 50-day window, but transaction costs negated the alpha.\n- During periods of high VIX (>25), the strategy experiences excessive whipsawing. A volatility filter should be added before deploying to production.\n\nNext steps: Explore adding a volume confirmation filter.',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'The VIX issue is real — I saw the same in my volatility work. Suggest applying the Volatility Filter module directly to this strategy before any paper trading.',
        },
      },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Partial — underperforms in volatile sideways markets; edge cases undocumented.',
        complete: false,
        severity: 'warning',
        peerComment: {
          author: 'Sarah Patel',
          text: 'Also fails during ASX trading halts — I caught a 3% drawdown due to this in April. Needs to be added here.',
        },
      },
    ],
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion Strategy',
    owner: 'Alex Chen',
    ownerEmail: 'alex.chen@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/mean-reversion',
    sousChef: 'Daniel Kim',
    status: 'Active',
    readiness: 'needs-review',
    hypothesis:
      'Short-horizon deviations from a rolling mean revert within days for high-liquidity pairs; entries are scaled by z-score bands.',
    elevatorPitch:
      'A short-horizon mean-reversion strategy on high-liquidity pairs that scales entries by z-score bands, with its assumptions, known limitations, and reviewer tips captured so the next owner inherits the full picture.',
    faqs: [
      {
        id: 'mr-1',
        question: 'What data does it use?',
        answer:
          'ASX 200 intraday snapshot from 09 Aug 2026 — note a known feed gap between 12:00–12:05 AEST.',
      },
      {
        id: 'mr-2',
        question: 'Is it production-ready?',
        answer:
          'Not yet — regime dependence is undocumented and it fails completely during momentum-driven breakouts.',
      },
      {
        id: 'mr-3',
        question: 'Who reviewed it?',
        answer: 'Daniel Kim left tips on the parameters and the zero-market-impact assumption.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 3f91be', complete: true, peerComment: null },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 intraday — snapshot 09 Aug 2026',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'The intraday data has a known gap between 12:00–12:05 AEST due to a feed issue on 09 Aug. This could skew the lunchtime signal.',
        },
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: 'z-score ±2.0, 15-day window',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'In my liquidity work, I found that ±2.0 is too aggressive in low-volume periods. Consider ±1.5 with a volume filter gate.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Transaction cost 5bps, zero market impact assumed.',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'Zero market impact is a strong assumption at this position size. Happy to share my order book depth estimates if useful.',
        },
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Initial backtest (Jan 2025 - Dec 2025) shows robust alpha but high turnover.\n\nRequires strict latency constraints to capture the mean reversion before HFTs.\n\nNext steps: Implement slippage model based on historical order book depth to ensure backtest accuracy.',
        complete: true,
        peerComment: null,
      },
      { key: 'limitations', label: 'Known limitations', value: 'Regime dependence not documented. Highly susceptible to momentum-driven breakouts where mean reversion fails completely.', complete: true, peerComment: null },
    ],
  },
  {
    id: 'overnight-gap',
    name: 'Overnight Gap Reversal',
    owner: 'Alex Chen',
    ownerEmail: 'alex.chen@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/overnight-gap',
    sousChef: null,
    status: 'Active',
    readiness: 'incomplete',
    hypothesis:
      'Large overnight gaps partially reverse in the first hour of trade; sizing is capped to manage tail risk.',
    elevatorPitch:
      'An overnight-gap reversal strategy on S&P 500 futures that fades large gaps in the first 30 minutes, with tail-risk controls and a documented need for a macro filter before live trading.',
    faqs: [
      {
        id: 'og-1',
        question: 'Which instrument does it trade?',
        answer: 'S&P 500 futures tick data from 2020–2025.',
      },
      {
        id: 'og-2',
        question: 'What is the main risk?',
        answer:
          'Drawdown exceeds 15% during black swan events; a macro filter is needed before production.',
      },
      {
        id: 'og-3',
        question: 'Why is readiness marked incomplete?',
        answer: 'Some fields were never completed by the previous owner.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 7d20aa', complete: true, peerComment: null },
      { key: 'dataset', label: 'Dataset', value: 'S&P 500 futures tick data (2020-2025)', complete: true, peerComment: null },
      { key: 'parameters', label: 'Parameters', value: 'Gap > 1%, first 30 mins, trailing stop 0.5%', complete: true, peerComment: null },
      { key: 'assumptions', label: 'Assumptions', value: 'Liquidity is sufficient at market open. Assumed instant fills on limit orders.', complete: true, peerComment: null },
      { key: 'notes', label: 'Research notes', value: 'Strategy heavily relies on non-farm payroll days and CPI releases.\n\nWarning: Drawdown exceeds 15% during black swan events. Needs a macro filter before going to production.\n\nTested capping gap sizes at 3% to avoid unfillable limits, which improved Sharpe from 1.2 to 1.8.', complete: true, peerComment: null },
      { key: 'limitations', label: 'Known limitations', value: 'Not robust across different interest rate regimes. Specifically struggles when fed funds rate > 4%.', complete: true, peerComment: null },
    ],
  },
  {
    id: 'volatility-filter',
    name: 'Volatility Filter',
    owner: 'Sarah Patel',
    ownerEmail: 'sarah.patel@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/volatility-filter',
    sousChef: 'Daniel Kim',
    status: 'Active',
    readiness: 'ready',
    hypothesis:
      'A realized-volatility overlay scales strategy exposure down during turbulent regimes, improving risk-adjusted returns.',
    elevatorPitch:
      'A realized-volatility overlay that scales exposure down in turbulent regimes, approved as a universal risk module across the equities desks and ready to be dropped onto other strategies.',
    faqs: [
      {
        id: 'vf-1',
        question: 'How is it used?',
        answer: 'As a plug-in filter module on top of other strategies.',
      },
      {
        id: 'vf-2',
        question: 'What are the bands?',
        answer:
          '30-day realized vol with 2 regime bands — a 3rd “extreme” band (VIX > 40) has been suggested.',
      },
      {
        id: 'vf-3',
        question: 'What is the known limitation?',
        answer:
          'It lags on abrupt single-day shocks and does not protect against overnight exogenous gaps.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit c11e09', complete: true, peerComment: null },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 daily prices — snapshot 12 Aug 2026',
        complete: true,
        peerComment: null,
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: '30-day realized vol, 2 regime bands',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'Reviewed. The 2-band structure is clean and easy to reason about. I would consider adding a third "extreme" band for VIX > 40 scenarios.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Daily rebalance, 8 bps cost. VIX index acts as a suitable proxy for broad market turbulence.',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'VIX as a proxy is reasonable but worth documenting that it reflects US market fear — not always correlated to ASX. Suggest adding a local vol measure as a secondary check.',
        },
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Full methodology and validation logged.\n\nWe explored using an exponentially weighted moving average for volatility calculation which reacted 2 days faster than simple MA during the March 2026 sell-off.\n\nApproved for use as a universal filter module across all equities desks.',
        complete: true,
        peerComment: null,
      },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Lags on abrupt single-day shocks; documented with mitigations. Will not protect against overnight exogenous gaps.',
        complete: true,
        peerComment: null,
      },
    ],
  },
  {
    id: 'liquidity-signal',
    name: 'Liquidity Signal',
    owner: 'Daniel Kim',
    ownerEmail: 'daniel.kim@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/liquidity-signal',
    sousChef: 'Sarah Patel',
    status: 'Active',
    readiness: 'incomplete',
    hypothesis:
      'Order-book depth changes lead short-term price moves in mid-cap names; early prototype signal.',
    elevatorPitch:
      'An early-stage order-book depth signal that aims to predict short-term moves in mid-cap names; currently a prototype that needs a matching-engine simulator and a spoofing pre-filter before paper trading.',
    faqs: [
      {
        id: 'ls-1',
        question: 'What is the data source?',
        answer:
          'Level 2 order book snapshots (NASDAQ 2025–2026) — clarify whether NBBO or exchange-specific.',
      },
      {
        id: 'ls-2',
        question: 'What is the current status?',
        answer:
          'Prototype — needs a spoofing-detection pre-filter and a proper execution model.',
      },
      {
        id: 'ls-3',
        question: 'Who reviewed it?',
        answer: 'Sarah Patel flagged the random-cancellation assumption as a known weakness.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 5a7c30', complete: true, peerComment: null },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'Level 2 Order Book snapshots (NASDAQ 2025-2026)',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'Make sure to clarify whether these are NBBO or exchange-specific snapshots. This matters a lot for reproducibility.',
        },
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: 'Depth imbalance threshold > 60%, 5-tick lookahead',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'The 5-tick lookahead might be too aggressive in practice. I would test a 3-tick version to see if it survives realistic execution latency.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Queue position can be estimated reliably. Cancellations happen randomly across the book.',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'The random cancellation assumption is a known oversimplification. High-frequency participants cancel strategically — this is worth flagging as a known model weakness.',
        },
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Prototype relies on historical data where we assumed top-of-queue priority. This is a known flaw in the current backtest.\n\nWe need to build a proper matching engine simulator before pushing this to paper trading. Early signs show strong predictive power in the 10-second window.',
        complete: true,
        peerComment: null,
      },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Highly sensitive to spoofing behavior. Needs a spoofing-detection pre-filter.',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'Agreed. I can share the spoofing detection logic from a previous project — it only adds one preprocessing step and should integrate cleanly.',
        },
      },
    ],
  },
]

type Ctx = {
  projects: Project[]
  getProject: (id: string) => Project | undefined
  missingCount: (p: Project) => number
  takeOwnership: (id: string, newOwner: string) => void
  addPeerComment: (projectId: string, fieldKey: string, comment: PeerComment) => void
  updateElevatorPitch: (projectId: string, text: string) => void
  updateFaqs: (projectId: string, faqs: Faq[]) => void
  team: TeamMember[]
}

const PortfolioContext = createContext<Ctx | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects)

  const takeOwnership = (id: string, newOwner: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, owner: newOwner, handedOver: true } : p,
      ),
    )
  }

  const addPeerComment = (projectId: string, fieldKey: string, comment: PeerComment) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            fields: p.fields.map((f) =>
              f.key === fieldKey ? { ...f, peerComment: comment } : f,
            ),
          }
          : p,
      ),
    )
  }

  const updateElevatorPitch = (projectId: string, text: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, elevatorPitch: text } : p)),
    )
  }

  const updateFaqs = (projectId: string, faqs: Faq[]) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, faqs } : p)),
    )
  }

  const team: TeamMember[] = useMemo(
    () => [
      {
        id: 'alex',
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        role: 'Quant Researcher',
        initials: 'AC',
        availability: 'transferred',
        active: projects.filter((p) => p.owner === 'Alex Chen').map((p) => p.name),
        backups: projects.filter((p) => p.sousChef === 'Alex Chen').map((p) => p.name),
      },
      {
        id: 'sarah',
        name: 'Sarah Patel',
        email: 'sarah.patel@example.com',
        role: 'Senior Quant Researcher',
        initials: 'SP',
        availability: 'available',
        active: projects.filter((p) => p.owner === 'Sarah Patel').map((p) => p.name),
        backups: projects.filter((p) => p.sousChef === 'Sarah Patel').map((p) => p.name),
      },
      {
        id: 'daniel',
        name: 'Daniel Kim',
        email: 'daniel.kim@example.com',
        role: 'Quant Researcher',
        initials: 'DK',
        availability: 'active',
        active: projects.filter((p) => p.owner === 'Daniel Kim').map((p) => p.name),
        backups: projects.filter((p) => p.sousChef === 'Daniel Kim').map((p) => p.name),
      },
    ],
    [projects],
  )

  const value = useMemo<Ctx>(
    () => ({
      projects,
      getProject: (id) => projects.find((p) => p.id === id),
      missingCount,
      takeOwnership,
      addPeerComment,
      updateElevatorPitch,
      updateFaqs,
      team,
    }),
    [projects, team],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
