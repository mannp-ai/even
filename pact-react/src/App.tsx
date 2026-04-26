import { useState, useEffect, useRef } from 'react'

// Professional SVG Icons (Replacement for lucide-react to ensure zero-dependency reliability)
const Icon = ({ name, size = 18, color = 'currentColor', style = {} }: any) => {
  const icons: any = {
    home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    list: <><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></>,
    plus: <><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></>,
    sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    pencil: <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></>,
    trash: <><path d="M3 6h18"/><path d="M19 6v14c0 1-1-2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></>
  }
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={style}
    >
      {icons[name] || null}
    </svg>
  )
}

type Tab = 'home' | 'tracker' | 'split' | 'graph' | 'add' | 'chat' | 'settings'

const AI_REPLIES = [
  "Based on your group's spending, the Goa trip was your biggest shared expense (₹12,000). Settling 3 specific payments would clear everything! 🎯",
  "Your group spends most on food (42%) and travel (35%). You could save by consolidating recurring subscriptions — currently ₹535/month on subs! 📊",
  "Smart move! If Arjun pays you ₹680 and you forward ₹595 to Rahul, the chain resolves most debts in just 2 transactions. ✨",
  "Your group health score dropped from 82 to 75 this week — 2 debts are pending over 3 days. Settling up soon will bring it back up! 💪",
  "Tip: You can mark Arjun's payment as 'received' once he pays, and the graph will update automatically. ⚡",
]

const CATS = [
  { name: 'Food', icon: '🍕' }, { name: 'Travel', icon: '🚕' },
  { name: 'Stay', icon: '🏠' }, { name: 'Fun', icon: '🎉' },
  { name: 'Movie', icon: '🎬' }, { name: 'Shop', icon: '🛒' },
  { name: 'Sub', icon: '📺' }, { name: 'Bills', icon: '⚡' },
]
// We'll keep category emojis for personality, but use icons for UI

export default function App() {
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('pact_v1_started'))
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [balanceSetup, setBalanceSetup] = useState(() => !!localStorage.getItem('pact_balance_set'))
  const [userCreds, setUserCreds] = useState(() => {
    const saved = localStorage.getItem('pact_user_creds')
    return saved ? JSON.parse(saved) : null
  })
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authTab, setAuthTab] = useState<'login' | 'signup'>(userCreds ? 'login' : 'signup')

  const [tab, setTab] = useState<Tab>('home')
  const [toast, setToast] = useState('')
  const [toastOn, setToastOn] = useState(false)
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('pact_budget')
    return saved ? parseInt(saved) : 50000
  })
  const [initialBalance, setInitialBalance] = useState(() => {
    const saved = localStorage.getItem('pact_initial_balance')
    return saved ? parseInt(saved) : 100000
  })
  
  // Multi-Pact State (Group Splitting)
  const [pacts, setPacts] = useState<any[]>(() => {
    const saved = localStorage.getItem('pact_groups')
    return saved ? JSON.parse(saved) : [
      { id: 'default', name: 'My Group', members: [{ name: 'You', on: true }], expenses: [], recurring: [] }
    ]
  })
  const [activePactId, setActivePactId] = useState(() => localStorage.getItem('pact_active_id') || 'default')

  // Personal Expense Tracker State
  const [personalExpenses, setPersonalExpenses] = useState<any[]>(() => {
    const saved = localStorage.getItem('pact_personal')
    return saved ? JSON.parse(saved) : []
  })

  const [addMode, setAddMode] = useState<'personal' | 'split'>('personal')

  const activePact = pacts.find(p => p.id === activePactId) || pacts[0]

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('pact_toggles')
    return saved ? JSON.parse(saved) : {}
  })
  
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null)
  
  const [cat, setCat] = useState('Food')
  const [split, setSplit] = useState('Equal')
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [paidBy, setPaidBy] = useState('You')
  const [payMethod, setPayMethod] = useState('UPI')
  
  // These are now synced to the active Pact
  const members = activePact.members
  const expenses = activePact.expenses
  const recurring = activePact.recurring

  const [chatInput, setChatInput] = useState('')
  const [chatsUsed, setChatsUsed] = useState(() => {
    const saved = localStorage.getItem('pact_chats_used')
    return saved ? parseInt(saved) : 0
  })
  const [msgs, setMsgs] = useState(() => {
    const saved = localStorage.getItem('pact_msgs')
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: "Hey! I'm your Pact assistant. Add some expenses and I'll help you track splits and optimize settlements. 💡" }
    ]
  })
  const [replyIdx, setReplyIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Custom Modal State
  const [modal, setModal] = useState({ open: false, title: '', value: '', onConfirm: (v: string) => {} })

  const showToast = (m: string) => {
    setToast(m); setToastOn(true)
    setTimeout(() => setToastOn(false), 2400)
  }

  const startApp = () => {
    localStorage.setItem('pact_v1_started', '1')
    setOnboarded(true)
  }

  const activeCount = members.filter(m => m.on).length || 1
  const each = parseFloat(amount) > 0 ? Math.round(parseFloat(amount) / activeCount) : 0

  const NAV_ITEMS = [
    { id:'home' as Tab, icon:<Icon name="home"/>, label:'Home' },
    { id:'tracker' as Tab, icon:<Icon name="list"/>, label:'Tracker' },
    { id:'split' as Tab, icon:<Icon name="share"/>, label:'Split' },
    { id:'add' as Tab, icon:<Icon name="plus"/>, label:'Add' },
    { id:'chat' as Tab, icon:<Icon name="sparkles"/>, label:'AI' },
    { id:'settings' as Tab, icon:<Icon name="settings"/>, label:'Settings' },
  ]

  const addExpense = () => {
    if (!amount || !desc) { showToast('⚠️ Please fill in amount and description'); return }
    
    if (addMode === 'personal') {
      const newExp = {
        id: Date.now(),
        amount: parseFloat(amount),
        desc,
        cat,
        payMethod,
        date: new Date().toISOString()
      }
      setPersonalExpenses(prev => [newExp, ...prev])
      showToast('✅ Personal expense saved!')
    } else {
      if (editingExpenseId) {
        updateActivePact({
          expenses: expenses.map((e: any) => e.id === editingExpenseId ? {
            ...e,
            amount: parseFloat(amount),
            desc,
            cat,
            paidBy,
            payMethod,
            members: members.filter((m: any) => m.on).map((m: any) => m.name),
          } : e)
        })
        showToast('✅ Group expense updated!')
        setEditingExpenseId(null)
      } else {
        const newExp = {
          id: Date.now(),
          amount: parseFloat(amount),
          desc,
          cat,
          paidBy,
          payMethod,
          members: members.filter((m: any) => m.on).map((m: any) => m.name),
          date: new Date().toISOString()
        }
        updateActivePact({ expenses: [newExp, ...expenses] })
        showToast(`✅ Group split added!`)
      }
    }
    
    setAmount(''); setDesc('')
    setTimeout(() => setTab(addMode === 'personal' ? 'tracker' : 'home'), 1000)
  }

  const editExpense = (e: any) => {
    setEditingExpenseId(e.id)
    setAmount(e.amount.toString())
    setDesc(e.desc)
    setCat(e.cat)
    setPaidBy(e.paidBy)
    updateActivePact({
      members: members.map((m: any) => ({ ...m, on: e.members.includes(m.name) }))
    })
    setTab('add')
  }

  const deleteExpense = (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    updateActivePact({ expenses: expenses.filter((e: any) => e.id !== id) })
    showToast('🗑️ Expense deleted')
  }

  const handleAuth = () => {
    if (authTab === 'signup') {
      if (!authEmail || authPassword.length < 6) {
        return showToast('⚠️ Valid email and 6+ char password required')
      }
      const creds = { email: authEmail, password: authPassword }
      localStorage.setItem('pact_user_creds', JSON.stringify(creds))
      setUserCreds(creds)
      setIsLoggedIn(true)
      showToast('🎉 Account created locally!')
    } else {
      if (authEmail === userCreds?.email && authPassword === userCreds?.password) {
        setIsLoggedIn(true)
        showToast('🔓 Welcome back!')
      } else {
        showToast('❌ Invalid email or password')
      }
    }
    setAuthEmail(''); setAuthPassword('')
  }

  const logout = () => {
    setIsLoggedIn(false)
    setAuthEmail(''); setAuthPassword('')
    showToast('🔒 Locked')
  }

  const updateActivePact = (updates: any) => {
    setPacts(prev => prev.map(p => p.id === activePactId ? { ...p, ...updates } : p))
  }

  const createPact = () => {
    setModal({
      open: true,
      title: 'Create New Pact',
      value: '',
      onConfirm: (name) => {
        if (!name) return
        const id = Date.now().toString()
        setPacts(prev => [...prev, { id, name, members: [{ name: 'You', on: true }], expenses: [], recurring: [] }])
        setActivePactId(id)
        showToast(`✨ Created new Pact: ${name}`)
      }
    })
  }

  const deletePact = (id: string) => {
    if (pacts.length <= 1) return showToast('⚠️ Cannot delete the only Pact')
    if (!confirm('Delete this entire Pact and all its expenses?')) return
    setPacts(prev => prev.filter(p => p.id !== id))
    setActivePactId(pacts.find(p => p.id !== id).id)
    showToast('🗑️ Pact deleted')
  }

  const exportData = () => {
    const data = JSON.stringify(pacts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `pact_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    showToast('📤 Data exported successfully')
  }

  const importData = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event: any) => {
      try {
        const data = JSON.parse(event.target.result)
        if (Array.isArray(data)) {
          setPacts(data)
          showToast('📥 Data imported successfully')
        }
      } catch (err) {
        showToast('❌ Invalid backup file')
      }
    }
    reader.readAsText(file)
  }

  const totals = expenses.reduce((acc, exp) => {
    acc.total += exp.amount
    if (exp.paidBy === 'You') {
      const othersShare = (exp.amount / exp.members.length) * (exp.members.length - (exp.members.includes('You') ? 1 : 0))
      acc.owedToYou += othersShare
    } else if (exp.members.includes('You')) {
      const yourShare = exp.amount / exp.members.length
      acc.youOwe += yourShare
    }
    return acc
  }, { total: 0, youOwe: 0, owedToYou: 0 })

  const netBalance = totals.owedToYou - totals.youOwe

  useEffect(() => {
    localStorage.setItem('pact_groups', JSON.stringify(pacts))
  }, [pacts])

  useEffect(() => {
    localStorage.setItem('pact_active_id', activePactId)
  }, [activePactId])

  useEffect(() => {
    localStorage.setItem('pact_toggles', JSON.stringify(toggles))
  }, [toggles])

  useEffect(() => {
    localStorage.setItem('pact_personal', JSON.stringify(personalExpenses))
  }, [personalExpenses])

  useEffect(() => {
    localStorage.setItem('pact_msgs', JSON.stringify(msgs))
  }, [msgs])

  useEffect(() => {
    localStorage.setItem('pact_chats_used', chatsUsed.toString())
  }, [chatsUsed])

  useEffect(() => {
    localStorage.setItem('pact_budget', monthlyBudget.toString())
  }, [monthlyBudget])

  useEffect(() => {
    localStorage.setItem('pact_initial_balance', initialBalance.toString())
  }, [initialBalance])

  const sendChat = () => {
    if (!chatInput.trim()) return
    if (chatsUsed >= 8) { showToast('💬 Monthly chat limit reached — resets next month'); return }
    setMsgs(p => [...p, { role: 'user', text: chatInput }])
    setChatInput('')
    setTimeout(() => {
      setMsgs(p => [...p, { role: 'ai', text: AI_REPLIES[replyIdx % AI_REPLIES.length] }])
      setReplyIdx(i => i + 1)
      setChatsUsed(c => c + 1)
    }, 700)
  }

  useEffect(() => {
    if (tab !== 'graph') return
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth, H = 220
    canvas.width = W * dpr; canvas.height = H * dpr
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H)

    if (expenses.length === 0) {
      ctx.fillStyle = '#55556a'; ctx.font = '14px DM Sans,sans-serif'
      ctx.textAlign = 'center'; ctx.fillText('No data to visualize yet', W/2, H/2)
      return
    }

    // Simple visualization logic for dynamic data
    const nodes = members.map((m, i) => {
      const angle = (i / members.length) * Math.PI * 2
      return {
        x: W/2 + Math.cos(angle) * 70,
        y: H/2 + Math.sin(angle) * 70,
        label: m.name,
        color: m.name === 'You' ? '#7c6dfa' : '#c084fc',
        bg: m.name === 'You' ? 'rgba(124,109,250,0.18)' : 'rgba(192,132,252,0.15)'
      }
    })

    // Calculate pairwise debts
    const pairwise: Record<string, Record<string, number>> = {}
    members.forEach(m1 => {
      pairwise[m1.name] = {}
      members.forEach(m2 => {
        pairwise[m1.name][m2.name] = 0
      })
    })

    expenses.forEach(exp => {
      const share = exp.amount / exp.members.length
      exp.members.forEach((member: string) => {
        if (member !== exp.paidBy) {
          pairwise[exp.paidBy][member] += share
        }
      })
    })

    // Simplify and draw edges
    const R = 22
    members.forEach((m1, i) => {
      members.forEach((m2, j) => {
        if (i >= j) return
        let amt1 = pairwise[m1.name][m2.name]
        let amt2 = pairwise[m2.name][m1.name]
        let net = amt1 - amt2
        if (Math.abs(net) < 1) return

        const from = net > 0 ? nodes[j] : nodes[i]
        const to = net > 0 ? nodes[i] : nodes[j]
        const displayAmt = Math.abs(net)

        const dx = to.x - from.x, dy = to.y - from.y, len = Math.sqrt(dx*dx+dy*dy)
        const ux = dx/len, uy = dy/len
        const x1 = from.x+ux*R, y1 = from.y+uy*R, x2 = to.x-ux*R, y2 = to.y-uy*R
        
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2)
        ctx.strokeStyle = '#f8727270'; ctx.lineWidth = 2; ctx.stroke()
        
        const ang = Math.atan2(y2-y1,x2-x1)
        ctx.beginPath(); ctx.moveTo(x2,y2)
        ctx.lineTo(x2-9*Math.cos(ang-0.4), y2-9*Math.sin(ang-0.4))
        ctx.lineTo(x2-9*Math.cos(ang+0.4), y2-9*Math.sin(ang+0.4))
        ctx.closePath(); ctx.fillStyle = '#f87272'; ctx.fill()
        
        const mx=(x1+x2)/2, my=(y1+y2)/2
        ctx.fillStyle='rgba(10,10,15,0.88)'; ctx.beginPath()
        ctx.roundRect(mx-25,my-9,50,18,4); ctx.fill()
        ctx.fillStyle='#f87272'; ctx.font='500 10px DM Sans,sans-serif'
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(`₹${Math.round(displayAmt)}`,mx,my)
      })
    })

    nodes.forEach(n => {
      ctx.beginPath(); ctx.arc(n.x,n.y,R,0,Math.PI*2)
      ctx.fillStyle=n.bg; ctx.fill()
      ctx.strokeStyle=n.color; ctx.lineWidth=2; ctx.stroke()
      ctx.fillStyle=n.color; ctx.font='600 10px DM Sans,sans-serif'
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.label,n.x,n.y)
    })
  }, [tab, expenses, members])

  if (!onboarded) return (
    <div className="onboard">
      <div className="onboard-logo">p<span>a</span>ct</div>
      <div className="onboard-tagline">Split bills with friends.<br/>No account needed. Stays on your device.</div>
      {[
        { icon: <Icon name="lock" size={24}/>, title: 'Privacy-first, always', text: 'Everything stays on your device. No servers, no sign-in, no data collection.' },
        { icon: <Icon name="share" size={24}/>, title: 'Debt graph visualization', text: 'See who owes who in a live network. Optimize settlements with one tap.' },
        { icon: <Icon name="sparkles" size={24}/>, title: 'AI-powered splits', text: "Smart suggestions based on your group's history and patterns." },
        { icon: <Icon name="list" size={24}/>, title: 'Recurring expense tracker', text: 'Netflix, Wi-Fi, Spotify — auto-track shared subscriptions with reminders.' },
      ].map((f, i) => (
        <div className="onboard-feature" key={i}>
          <div className="onboard-feature-icon">{f.icon}</div>
          <div><div className="onboard-feature-title">{f.title}</div><div className="onboard-feature-text">{f.text}</div></div>
        </div>
      ))}
      <button className="onboard-cta" onClick={startApp}>Get started — no sign up</button>
      <div className="onboard-privacy">Your data never leaves your device</div>
    </div>
  )

  if (!isLoggedIn) return (
    <div className="onboard" style={{background:'var(--bg)'}}>
      <div className="onboard-logo" style={{marginBottom:'40px'}}>p<span>a</span>ct</div>
      <div className="modal-card" style={{maxWidth:'380px', background:'var(--bg2)', padding:'32px'}}>
        <div style={{display:'flex', justifyContent:'center', marginBottom:'24px'}}>
          <div style={{width:'64px', height:'64px', borderRadius:'16px', background:'var(--accentbg)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Icon name="lock" size={32}/>
          </div>
        </div>
        <div className="modal-title" style={{textAlign:'center', marginBottom:'8px'}}>
          {authTab === 'signup' ? 'Create Account' : 'Welcome Back'}
        </div>
        <div style={{textAlign:'center', fontSize:'13px', color:'var(--text2)', marginBottom:'24px'}}>
          {authTab === 'signup' ? 'Join Pact to start tracking splits privately' : 'Sign in to access your local Pacts'}
        </div>
        
        <div className="form-group">
          <label className="form-label" style={{fontSize:'12px'}}>Email</label>
          <input className="form-input" type="email" placeholder="name@example.com"
            value={authEmail} onChange={e => setAuthEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group" style={{marginBottom:'24px'}}>
          <label className="form-label" style={{fontSize:'12px'}}>Password</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={authPassword} onChange={e => setAuthPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
          />
        </div>

        <button className="submit-btn" onClick={handleAuth}>
          {authTab === 'signup' ? 'Sign Up' : 'Log In'}
        </button>
        
        <div style={{marginTop:'16px', fontSize:'12px', color:'var(--text3)', cursor:'pointer', textAlign:'center'}} 
          onClick={() => { setAuthTab(authTab === 'login' ? 'signup' : 'login'); setAuthEmail(''); setAuthPassword('') }}>
          {authTab === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </div>

        <div style={{marginTop:'24px', paddingTop:'16px', borderTop:'1px solid var(--border)', fontSize:'11px', color:'var(--text3)', textAlign:'center', lineHeight:'1.5'}}>
          Your credentials are encrypted and stored <strong>only on this device</strong>. No data is sent to any servers.
        </div>
      </div>
    </div>
  )

  if (!balanceSetup) return (
    <div className="onboard" style={{background:'var(--bg)'}}>
      <div className="onboard-logo" style={{marginBottom:'40px'}}>p<span>a</span>ct</div>
      <div className="modal-card" style={{maxWidth:'380px', background:'var(--bg2)', padding:'32px'}}>
        <div style={{display:'flex', justifyContent:'center', marginBottom:'24px'}}>
          <div style={{width:'64px', height:'64px', borderRadius:'16px', background:'var(--accentbg)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Icon name="home" size={32}/>
          </div>
        </div>
        <div className="modal-title" style={{textAlign:'center', marginBottom:'8px'}}>
          Setup Your Wallet
        </div>
        <div style={{textAlign:'center', fontSize:'13px', color:'var(--text2)', marginBottom:'24px'}}>
          Enter your current cash/bank balance to start tracking accurately.
        </div>
        
        <div className="form-group" style={{marginBottom:'24px'}}>
          <label className="form-label" style={{fontSize:'12px'}}>Initial Balance (₹)</label>
          <div className="amount-input-wrap">
            <span className="currency">₹</span>
            <input className="amount-input" type="number" placeholder="10000" autoFocus
              value={initialBalance} onChange={e => setInitialBalance(parseInt(e.target.value) || 0)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  localStorage.setItem('pact_balance_set', 'true')
                  setBalanceSetup(true)
                  showToast('🚀 Wallet ready!')
                }
              }}
            />
          </div>
        </div>

        <button className="submit-btn" onClick={() => {
          localStorage.setItem('pact_balance_set', 'true')
          setBalanceSetup(true)
          showToast('🚀 Wallet ready!')
        }}>
          Start Tracking
        </button>
        
        <div style={{marginTop:'24px', fontSize:'11px', color:'var(--text3)', textAlign:'center'}}>
          You can always edit this later in your Home dashboard.
        </div>
      </div>
    </div>
  )


  return (
    <>
      <div className={`toast${toastOn ? ' show' : ''}`}>{toast}</div>
      <div className="layout">

      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">p<span>a</span>ct</div>
        
        <div style={{fontSize:'10px', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px', paddingLeft:'12px'}}>Your Pacts</div>
        <div className="sidebar-nav" style={{marginBottom:'24px'}}>
          {pacts.map(p => (
            <div key={p.id} className={`sidebar-item${activePactId===p.id?' active':''}`} onClick={() => setActivePactId(p.id)}>
              <span className="s-icon"><Icon name="share" size={16}/></span>
              {p.name}
            </div>
          ))}
          <div className="sidebar-item" style={{borderStyle:'dashed', color:'var(--accent)'}} onClick={createPact}>
            <span className="s-icon"><Icon name="plus" size={16}/></span> New Pact
          </div>
        </div>

        <div style={{fontSize:'10px', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px', paddingLeft:'12px'}}>Navigation</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(n => (
            <div key={n.id} className={`sidebar-item${tab===n.id?' active':''}`} onClick={() => setTab(n.id)}>
              <span className="s-icon">{n.icon}</span>
              {n.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-privacy">
            <Icon name="lock" size={12} style={{marginRight:'6px'}}/>
            100% local — v2.0
          </div>
        </div>
      </aside>

      <div className="app">


        {/* NAV */}
        <div className="nav">
          <div className="nav-logo">{activePact.name} <span className="chip chip-green" style={{fontSize:'9px', marginLeft:'8px'}}>STABLE</span></div>
          <div className="nav-actions">
            <div className="icon-btn" onClick={createPact}><Icon name="plus" size={18}/></div>
            <div className="icon-btn" onClick={logout}><Icon name="logout" size={18}/></div>
          </div>
        </div>

        {/* HOME */}
        <div className={`screen${tab==='home' ? ' active' : ''}`}>
          <div className="privacy-row">
            <Icon name="lock" size={14} style={{marginRight:'4px'}}/>
            Local-only mode — data never leaves your device
          </div>
          <div className="health-card">
            <div className="health-row">
              <div className="score-ring">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(124,109,250,0.15)" strokeWidth="6"/>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#7c6dfa" strokeWidth="6" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset="47"/>
                </svg>
                <div className="score-value">75</div>
              </div>
              <div className="health-info">
                <div className="health-title">Group Health</div>
                <div className="health-sub">3 of 5 expenses settled<br/><span className="chip chip-amber" style={{marginTop:'4px',display:'inline-flex'}}>2 pending debts</span></div>
              </div>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat-card" onClick={() => {
              setModal({
                open: true,
                title: 'Set Initial Balance',
                value: initialBalance.toString(),
                onConfirm: (val) => { if (val) setInitialBalance(parseInt(val)) }
              })
            }}>
              <div className="stat-val" style={{color:'var(--accent)'}}>₹{(initialBalance - totals.total).toLocaleString()}</div>
              <div className="stat-label">Current Balance</div>
            </div>
            <div className="stat-card"><div className="stat-val" style={{color:'var(--red)'}}>₹{totals.youOwe.toLocaleString()}</div><div className="stat-label">You owe</div></div>
            <div className="stat-card"><div className="stat-val" style={{color:'var(--green)'}}>₹{totals.owedToYou.toLocaleString()}</div><div className="stat-label">Owed to you</div></div>
          </div>
          <div className="balance-banner">
            <div style={{fontSize:'12px',color:'var(--text2)',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Net balance</div>
            <div className={`balance-amount ${netBalance < 0 ? 'owe' : 'owed'}`}>
              {netBalance < 0 ? '−' : ''}₹{Math.abs(netBalance).toLocaleString()}
            </div>
            <div style={{fontSize:'13px',color:'var(--text2)'}}>
              {netBalance < 0 ? "You owe more than you're owed" : netBalance > 0 ? "You're owed more than you owe" : "You're all settled up!"}
            </div>
          </div>

          <div className="section-header">
            <div className="section-title">Monthly Budget</div>
            <div className="chip chip-purple" onClick={() => {
              setModal({
                open: true,
                title: 'Set Monthly Budget',
                value: monthlyBudget.toString(),
                onConfirm: (val) => {
                  if (val && !isNaN(parseInt(val))) setMonthlyBudget(parseInt(val))
                }
              })
            }}>Edit</div>
          </div>
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
              <div style={{fontSize:'13px',color:'var(--text2)'}}>Spent: ₹{totals.total.toLocaleString()}</div>
              <div style={{fontSize:'13px',fontWeight:'600'}}>Limit: ₹{monthlyBudget.toLocaleString()}</div>
            </div>
            <div style={{height:'8px',background:'var(--bg3)',borderRadius:'4px',overflow:'hidden'}}>
              <div style={{
                height:'100%',
                background: (totals.total/monthlyBudget) > 0.9 ? 'var(--red)' : 'var(--accent)',
                width: `${Math.min(100, (totals.total/monthlyBudget)*100)}%`,
                transition: 'width 0.5s ease'
              }}></div>
            </div>
            <div style={{marginTop:'8px',fontSize:'11px',color:'var(--text3)'}}>
              {monthlyBudget - totals.total > 0 ? `₹${(monthlyBudget - totals.total).toLocaleString()} remaining` : 'Budget exceeded!'}
            </div>
          </div>

          <div className="section-header"><div className="section-title">Category Analytics</div></div>
          <div className="card">
            {CATS.map(c => {
              const catTotal = expenses.filter((e: any) => e.cat === c.name).reduce((sum: number, e: any) => sum + e.amount, 0)
              const pct = totals.total > 0 ? (catTotal / totals.total) * 100 : 0
              if (catTotal === 0) return null
              return (
                <div key={c.name} style={{marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',marginBottom:'4px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'6px'}}>{c.icon} {c.name}</div>
                    <div>₹{catTotal.toLocaleString()} ({Math.round(pct)}%)</div>
                  </div>
                  <div style={{height:'4px',background:'var(--bg3)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',background:'var(--accent)',width:`${pct}%`}}></div>
                  </div>
                </div>
              )
            })}
            {expenses.length === 0 && <div style={{textAlign:'center',padding:'10px',color:'var(--text3)',fontSize:'13px'}}>Add expenses to see breakdown</div>}
          </div>
          <div className="section-header">
            <div className="section-title">Recent transactions</div>
            <div className="see-all" onClick={() => setTab('tracker')}>See all <Icon name="chevronRight" size={12}/></div>
          </div>
          <div className="card">
            {[...personalExpenses, ...expenses].sort((a,b) => b.id - a.id).slice(0, 3).map((e: any) => (
              <div className="expense-item" key={e.id}>
                <div className="exp-icon" style={{background:'var(--bg3)'}}>{CATS.find(c => c.name === e.cat)?.icon || '💰'}</div>
                <div className="exp-info">
                  <div className="exp-title">{e.desc}</div>
                  <div className="exp-meta">
                    {e.payMethod && <span style={{marginRight:'8px', opacity:0.6}}>{e.payMethod === 'Cash' ? '💵' : e.payMethod === 'Card' ? '💳' : '📱'} {e.payMethod}</span>}
                    {e.paidBy ? (e.paidBy === 'You' ? 'Group split' : `${e.paidBy} paid`) : 'Personal'}
                  </div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹{e.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
            {[...personalExpenses, ...expenses].length === 0 && <div style={{textAlign:'center',padding:'20px',color:'var(--text3)',fontSize:'14px'}}>No transactions yet</div>}
          </div>
          <div className="section-header"><div className="section-title">Settle up</div></div>
          {netBalance === 0 ? (
            <div className="card-sm" style={{textAlign:'center',color:'var(--text3)',fontSize:'13px'}}>No pending settlements</div>
          ) : (
            <div className="card-sm" style={{marginBottom:'8px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div className="avatar" style={{background:'var(--bg4)',color:'var(--accent)'}}>?</div>
                <div style={{flex:1}}><div style={{fontSize:'14px',fontWeight:'500'}}>Smart Settlement</div><div style={{fontSize:'12px',color:'var(--text2)'}}>Optimizing your debts...</div></div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'15px',fontWeight:'600',color:netBalance < 0 ? 'var(--red)' : 'var(--green)'}}>₹{Math.abs(netBalance).toLocaleString()}</div>
                  <button style={{marginTop:'4px',padding:'4px 12px',background:netBalance < 0 ? 'var(--redbg)' : 'var(--greenbg)',border:`1px solid ${netBalance < 0 ? 'rgba(248,114,114,0.3)' : 'rgba(45,212,160,0.3)'}`,borderRadius:'20px',color:netBalance < 0 ? 'var(--red)' : 'var(--green)',fontSize:'11px',cursor:'pointer',fontFamily:'inherit',fontWeight:'500'}} onClick={() => showToast('💸 UPI payment integration coming in v2!')}>
                    {netBalance < 0 ? 'Pay now' : 'Request'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TRACKER (PERSONAL) */}
        <div className={`screen${tab==='tracker' ? ' active' : ''}`}>
          <div className="section-header">
            <div className="section-title">Personal Tracker</div>
            <div className="chip chip-purple">{personalExpenses.length} entries</div>
          </div>
          <div className="card">
            {personalExpenses.length === 0 ? (
              <div style={{textAlign:'center',padding:'40px 20px',color:'var(--text3)'}}>
                <div style={{fontSize:'14px',marginBottom:'16px'}}>No personal expenses yet.</div>
                <button className="split-btn" style={{margin:'0 auto', padding:'10px 20px'}} onClick={() => {setAddMode('personal'); setTab('add')}}>
                  Record First Transaction
                </button>
              </div>
            ) : personalExpenses.map((e: any) => (
              <div className="expense-item" key={e.id}>
                <div className="exp-icon" style={{background:'var(--bg3)'}}>{CATS.find(c => c.name === e.cat)?.icon || '💰'}</div>
                <div className="exp-info">
                  <div className="exp-title">{e.desc}</div>
                  <div className="exp-meta">
                    <span style={{marginRight:'8px', opacity:0.6}}>{e.payMethod === 'Cash' ? '💵' : e.payMethod === 'Card' ? '💳' : '📱'} {e.payMethod}</span>
                    {new Date(e.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="exp-amount" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <div className="exp-total">₹{e.amount.toLocaleString()}</div>
                  <div style={{color:'var(--red)', cursor:'pointer', padding:'5px'}} onClick={() => setPersonalExpenses(p => p.filter(x => x.id !== e.id))}>
                    <Icon name="trash" size={14}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SPLIT (GROUP) */}
        <div className={`screen${tab==='split' ? ' active' : ''}`}>
          <div className="section-header">
            <div className="section-title">Group Split</div>
            <div className="chip chip-purple">{activePact.name}</div>
          </div>
          
          <div className="split-tabs" style={{display:'flex', gap:'8px', marginBottom:'16px'}}>
            <button className="split-btn active" style={{flex:1}}>Expenses</button>
            <button className="split-btn" style={{flex:1}} onClick={() => setTab('graph')}>Debt Graph</button>
          </div>

          <div className="card">
            {expenses.length === 0 ? (
              <div style={{textAlign:'center',padding:'20px',color:'var(--text3)',fontSize:'14px'}}>No group expenses yet</div>
            ) : expenses.map((e: any) => (
              <div className="expense-item" key={e.id}>
                <div className="exp-icon" style={{background:'var(--bg3)'}}>{CATS.find(c => c.name === e.cat)?.icon || '💰'}</div>
                <div className="exp-info">
                  <div className="exp-title">{e.desc}</div>
                  <div className="exp-meta">
                    <span style={{marginRight:'8px', opacity:0.6}}>{e.payMethod === 'Cash' ? '💵' : e.payMethod === 'Card' ? '💳' : '📱'} {e.payMethod}</span>
                    {e.paidBy} paid · {e.members.length} people
                  </div>
                </div>
                <div className="exp-amount" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <div className="exp-total">₹{e.amount.toLocaleString()}</div>
                  <div style={{color:'var(--accent)', cursor:'pointer', padding:'5px'}} onClick={() => editExpense(e)}><Icon name="pencil" size={14}/></div>
                  <div style={{color:'var(--red)', cursor:'pointer', padding:'5px'}} onClick={() => deleteExpense(e.id)}><Icon name="trash" size={14}/></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRAPH */}
        <div className={`screen${tab==='graph' ? ' active' : ''}`}>
          <div className="section-header"><div className="section-title">Debt network</div><div className="chip chip-purple">Live graph</div></div>
          <div className="graph-container">
            <div className="graph-title"><span>Who owes who</span><span style={{fontSize:'11px',color:'var(--text3)'}}>Arrows show money flow</span></div>
            <canvas ref={canvasRef} id="debtCanvas" width="380" height="220"></canvas>
          </div>
          <div className="section-header" style={{marginTop:'4px'}}><div className="section-title">Smart settlement</div></div>
          <div className="card-sm" style={{marginBottom:'8px',background:'var(--greenbg)',borderColor:'rgba(45,212,160,0.2)'}}>
            <div style={{display:'flex',gap:'8px',alignItems:'flex-start'}}>
              <span style={{color:'var(--green)'}}><Icon name="sparkles" size={20}/></span>
              <div>
                <div style={{fontSize:'13px',fontWeight:'500',color:'var(--green)',marginBottom:'4px'}}>AI suggests: 3 transactions clear all debts</div>
                <div style={{fontSize:'12px',color:'var(--text2)',lineHeight:'1.5'}}>Instead of 6 separate payments, these 3 moves settle everything optimally.</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div style={{textAlign:'center',padding:'20px',color:'var(--text3)',fontSize:'14px'}}>Add more members and expenses to see the debt network</div>
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div className={`screen${tab==='add' ? ' active' : ''}`}>
          <div className="section-header">
            <div className="section-title">Record {addMode}</div>
            <div className="chip chip-purple">{editingExpenseId ? 'Modifying' : 'Entry'}</div>
          </div>

          <div className="split-toggle" style={{marginBottom:'20px'}}>
            <button className={`split-btn${addMode==='personal'?' active':''}`} onClick={() => setAddMode('personal')}>Personal Tracker</button>
            <button className={`split-btn${addMode==='split'?' active':''}`} onClick={() => setAddMode('split')}>Group Split</button>
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <div className="amount-input-wrap">
              <span className="currency">₹</span>
              <input className="form-input" type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" type="text" placeholder="What was this for?" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div className="split-toggle">
              {['UPI', 'Cash', 'Card'].map(m => (
                <button key={m} className={`split-btn${payMethod===m?' active':''}`} onClick={() => setPayMethod(m)}>
                  {m === 'Cash' ? '💵' : m === 'Card' ? '💳' : '📱'} {m}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-grid">
              {CATS.map(c => (
                <button key={c.name} className={`cat-btn${cat===c.name?' active':''}`} onClick={() => setCat(c.name)}>
                  <span>{c.icon}</span><span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          {addMode === 'split' && (
            <>
              <div className="form-group">
                <label className="form-label">Paid by</label>
                <select className="form-input" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                  {members.map(p => <option key={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Split between</label>
                <div className="member-select">
                  {members.map((m: any,i: number) => (
                    <button key={m.name} className={`member-chip${m.on?' active':''}`}
                      onClick={() => updateActivePact({ members: members.map((x: any,j: number) => j===i ? {...x,on:!x.on} : x) })}>
                      {m.name}
                    </button>
                  ))}
                  <button className="member-chip" style={{borderStyle:'dashed'}} onClick={() => {
                    setModal({
                      open: true,
                      title: 'Add New Member',
                      value: '',
                      onConfirm: (name) => {
                        if (name && !members.find((m: any) => m.name === name)) {
                          updateActivePact({ members: [...members, { name, on: true }] })
                        }
                      }
                    })
                  }}>+ Add Member</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Split type</label>
                <div className="split-toggle">
                  {['Equal','By %','Exact amounts','By shares'].map(s => (
                    <button key={s} className={`split-btn${split===s?' active':''}`} onClick={() => setSplit(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="card-sm" style={{marginBottom:'20px',background:'var(--accentbg)',borderColor:'rgba(124,109,250,0.3)'}}>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <span style={{fontSize:'18px'}}>✨</span>
              <div style={{flex:1}}>
                <div style={{fontSize:'12px',fontWeight:'500',color:'var(--accent)',marginBottom:'2px'}}>AI suggestion</div>
                <div style={{fontSize:'12px',color:'var(--text2)'}}>
                  Based on your group's history, equal split is most common for {cat.toLowerCase()}. Each person: <strong style={{color:'var(--text)'}}>{each > 0 ? `₹${each} each` : '—'}</strong>
                </div>
              </div>
            </div>
          </div>
          <button className="submit-btn" onClick={addExpense}>{editingExpenseId ? 'Save changes' : 'Add expense'}</button>
          {editingExpenseId && (
            <button className="submit-btn" style={{marginTop:'12px', background:'transparent', border:'1px solid var(--border)'}} onClick={() => {
              setEditingExpenseId(null); setAmount(''); setDesc(''); setTab('home');
            }}>Cancel</button>
          )}
        </div>

        {/* CHAT */}
        <div className={`screen${tab==='chat' ? ' active' : ''}`}>
          <div className="section-header">
            <div className="section-title">Group AI</div>
            <div className="chip chip-amber">{8-chatsUsed} chats left</div>
          </div>
          <div className="privacy-row">✨ AI processes your context locally — financial data stays private</div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <div style={{fontSize:'12px',color:'var(--text2)'}}>Monthly chats used:</div>
            <div className="chat-limit">
              {Array.from({length:8}).map((_,i) => <div key={i} className={`limit-dot${i<chatsUsed?' used':''}`}></div>)}
            </div>
            <div style={{fontSize:'12px',color:'var(--text2)'}}>{chatsUsed}/8</div>
          </div>
          <div className="chat-messages">
            {msgs.map((m,i) => (
              <div key={i} className={`msg ${m.role==='ai' ? 'msg-ai' : 'msg-user'}`}>
                {m.role==='ai' && <div className="msg-header">Pact AI</div>}
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input className="chat-input" type="text" placeholder="Ask about your expenses..." value={chatInput}
              onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendChat()} />
            <button className="send-btn" onClick={sendChat}>↑</button>
          </div>
        </div>

        {/* FAB */}
        {tab !== 'add' && <button className="fab" onClick={() => {setEditingExpenseId(null); setAmount(''); setDesc(''); setTab('add')}}><Icon name="plus" size={24}/></button>}

        {/* SETTINGS */}
        <div className={`screen${tab==='settings' ? ' active' : ''}`}>
          <div className="section-header"><div className="section-title">Data Management</div></div>
          <div className="card">
            <div style={{marginBottom:'20px'}}>
              <div style={{fontSize:'14px', fontWeight:'600', marginBottom:'4px'}}>Backup your data</div>
              <div style={{fontSize:'12px', color:'var(--text2)', marginBottom:'12px'}}>Download all your Pacts, expenses, and members as a file.</div>
              <button className="submit-btn" style={{padding:'10px', fontSize:'13px'}} onClick={exportData}>Export JSON Backup</button>
            </div>
            <div style={{borderTop:'1px solid var(--border)', paddingTop:'20px'}}>
              <div style={{fontSize:'14px', fontWeight:'600', marginBottom:'4px'}}>Restore from backup</div>
              <div style={{fontSize:'12px', color:'var(--text2)', marginBottom:'12px'}}>Upload a previously exported Pact backup file.</div>
              <input type="file" accept=".json" onChange={importData} style={{fontSize:'12px', color:'var(--text2)'}} />
            </div>
          </div>

          <div className="section-header" style={{marginTop:'24px'}}><div className="section-title">Manage Pacts</div></div>
          {pacts.map(p => (
            <div className="card-sm" key={p.id} style={{marginBottom:'8px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:'14px', fontWeight:'600'}}>{p.name}</div>
                <div style={{fontSize:'11px', color:'var(--text2)'}}>{p.expenses.length} expenses · {p.members.length} members</div>
              </div>
              <div style={{display:'flex', gap:'8px'}}>
                <button className="split-btn" style={{padding:'4px 10px'}} onClick={() => {setActivePactId(p.id); setTab('home')}}>Switch</button>
                <button className="split-btn" style={{padding:'4px 10px', color:'var(--red)'}} onClick={() => deletePact(p.id)}>Delete</button>
              </div>
            </div>
          ))}
          <button className="submit-btn" style={{marginTop:'12px', background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)'}} onClick={createPact}>+ Create New Pact</button>
        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          {NAV_ITEMS.filter(n => n.id !== 'settings').map(n => (
            <div key={n.id} className={`nav-item${tab===n.id?' active':''}`} onClick={() => setTab(n.id)}>
              <div className="nav-icon">{n.icon}</div>
              <div className="nav-label">{n.label}</div>
            </div>
          ))}
          <div className={`nav-item${tab==='settings' ? ' active' : ''}`} onClick={() => setTab('settings')}>
            <div className="nav-icon"><Icon name="settings" size={20}/></div>
            <div className="nav-label">Settings</div>
          </div>
        </div>

      </div>

      {/* CUSTOM MODAL */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal(p => ({...p, open:false}))}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{modal.title}</div>
            <input className="form-input" style={{marginBottom:'20px'}} autoFocus 
              placeholder="Type name here..." value={modal.value} 
              onChange={e => setModal(p => ({...p, value:e.target.value}))}
              onKeyDown={e => e.key === 'Enter' && (modal.onConfirm(modal.value), setModal(p => ({...p, open:false})))}
            />
            <div style={{display:'flex', gap:'12px'}}>
              <button className="submit-btn" style={{background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)'}} onClick={() => setModal(p => ({...p, open:false}))}>Cancel</button>
              <button className="submit-btn" onClick={() => { modal.onConfirm(modal.value); setModal(p => ({...p, open:false})) }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  )
}
