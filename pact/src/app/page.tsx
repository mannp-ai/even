"use client";

import React, { useState, useEffect, useRef } from "react";

export default function PactApp() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Toggles
  const [toggles, setToggles] = useState({ tog1: true, tog2: true, tog3: false });
  const [activeCat, setActiveCat] = useState("Food");
  const [activeSplit, setActiveSplit] = useState("Equal");
  
  // Expenses
  const [expAmount, setExpAmount] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [paidBy, setPaidBy] = useState("You");
  
  // Members
  const [members, setMembers] = useState([
    { name: "You", active: true },
    { name: "Rahul", active: true },
    { name: "Priya", active: true },
    { name: "Arjun", active: false },
    { name: "Neha", active: false },
  ]);

  // Chat
  const [chatInput, setChatInput] = useState("");
  const [chatsUsed, setChatsUsed] = useState(3);
  const maxChats = 8;
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hey! I can see your group has spent ₹4,820 this month. You owe a net ₹560. Want me to suggest the quickest way to settle up? 💡" }
  ]);

  const aiReplies = [
    "Based on your group's spending, the Goa trip was your biggest shared expense (₹12,000). Settling 3 specific payments would clear everything! 🎯",
    "Your group spends most on food (42%) and travel (35%). You could save by consolidating recurring subscriptions — currently ₹535/month on subs! 📊",
    "Smart move! If Arjun pays you ₹680 and you forward ₹595 to Rahul, the chain resolves most debts in just 2 transactions. ✨",
    "Your group health score dropped from 82 to 75 this week — 2 debts are pending over 3 days. Settling up soon will bring it back up! 💪",
    "Tip: You can mark Arjun's payment as 'received' once he pays, and the graph will update automatically. ⚡",
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const started = localStorage.getItem("pact_v1_started");
      if (started) setIsOnboarded(true);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "graph") {
      drawGraph();
    }
  }, [activeTab]);

  const startApp = () => {
    setIsOnboarded(true);
    localStorage.setItem("pact_v1_started", "1");
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  const toggleSwitch = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  };

  const toggleMember = (idx: number) => {
    const newMembers = [...members];
    newMembers[idx].active = !newMembers[idx].active;
    setMembers(newMembers);
  };

  const activeMemberCount = members.filter((m) => m.active).length || 1;
  const amt = parseFloat(expAmount) || 0;
  const eachSplit = amt / activeMemberCount;
  const aiSplitText = eachSplit > 0 ? `₹${Math.round(eachSplit)} each` : "enter amount above";

  const addExpense = () => {
    if (!expAmount || !expDesc) {
      showToast("⚠️ Please fill in amount and description");
      return;
    }
    const activeMembers = members.filter((m) => m.active).map((m) => m.name);
    
    // In a full implementation we would update state arrays here to render natively,
    // but the prompt asked to keep UI identical without structural changes. We will just mock it.
    showToast(`✅ Expense added & split across ${activeMembers.length} people!`);
    setExpAmount("");
    setExpDesc("");
    setTimeout(() => setActiveTab("home"), 1000);
  };

  const sendChat = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    if (chatsUsed >= maxChats) {
      showToast("💬 Monthly chat limit reached — resets next month");
      return;
    }

    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatInput("");
    
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev, 
        { role: "ai", text: aiReplies[(chatsUsed - 3) % aiReplies.length] }
      ]);
      setChatsUsed((prev) => prev + 1);
    }, 700);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.offsetWidth;
    const displayH = 220;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = displayW + "px";
    canvas.style.height = displayH + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const W = displayW, H = displayH;
    ctx.clearRect(0, 0, W, H);

    const nodes = [
      { x: W / 2, y: H / 2 - 5, label: "You", color: "#7c6dfa", bg: "rgba(124,109,250,0.18)" },
      { x: W * 0.18, y: H * 0.22, label: "Rahul", color: "#c084fc", bg: "rgba(192,132,252,0.15)" },
      { x: W * 0.84, y: H * 0.2, label: "Priya", color: "#2dd4a0", bg: "rgba(45,212,160,0.15)" },
      { x: W * 0.14, y: H * 0.8, label: "Arjun", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
      { x: W * 0.82, y: H * 0.8, label: "Neha", color: "#f6b44a", bg: "rgba(246,180,74,0.15)" },
    ];

    const edges = [
      { from: 0, to: 1, amount: "₹595", color: "#f87272" },
      { from: 0, to: 2, amount: "₹227", color: "#f87272" },
      { from: 3, to: 0, amount: "₹680", color: "#2dd4a0" },
      { from: 4, to: 0, amount: "₹460", color: "#2dd4a0" },
      { from: 1, to: 2, amount: "₹200", color: "#f87272" },
    ];

    const R = 22;

    edges.forEach((e) => {
      const a = nodes[e.from], b = nodes[e.to];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / len, uy = dy / len;
      const x1 = a.x + ux * R, y1 = a.y + uy * R;
      const x2 = b.x - ux * R, y2 = b.y - uy * R;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = e.color + "70";
      ctx.lineWidth = 2;
      ctx.stroke();

      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(angle - 0.4), y2 - 9 * Math.sin(angle - 0.4));
      ctx.lineTo(x2 - 9 * Math.cos(angle + 0.4), y2 - 9 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = e.color;
      ctx.fill();

      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      ctx.fillStyle = "rgba(10,10,15,0.88)";
      ctx.beginPath();
      ctx.roundRect(mx - 20, my - 9, 40, 18, 4);
      ctx.fill();
      ctx.fillStyle = e.color;
      ctx.font = "500 10px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(e.amount, mx, my);
    });

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.fillStyle = n.bg;
      ctx.fill();
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = n.color;
      ctx.font = "600 10px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.label, n.x, n.y);
    });
  };

  return (
    <>
      <div className={`toast ${toastVisible ? "show" : ""}`} id="toast">{toastMsg}</div>

      {!isOnboarded && (
        <div className="onboard" id="onboard">
          <div className="onboard-logo">p<span>a</span>ct</div>
          <div className="onboard-tagline">Split bills with friends.<br />No account needed. Stays on your device.</div>
          <div className="onboard-feature">
            <div className="onboard-feature-icon">🔒</div>
            <div>
              <div className="onboard-feature-title">Privacy-first, always</div>
              <div className="onboard-feature-text">Everything stays on your device. No servers, no sign-in, no data collection.</div>
            </div>
          </div>
          <div className="onboard-feature">
            <div className="onboard-feature-icon">🕸️</div>
            <div>
              <div className="onboard-feature-title">Debt graph visualization</div>
              <div className="onboard-feature-text">See who owes who in a live network. Optimize settlements with one tap.</div>
            </div>
          </div>
          <div className="onboard-feature">
            <div className="onboard-feature-icon">✨</div>
            <div>
              <div className="onboard-feature-title">AI-powered splits</div>
              <div className="onboard-feature-text">Smart suggestions based on your group's history and patterns.</div>
            </div>
          </div>
          <div className="onboard-feature">
            <div className="onboard-feature-icon">📅</div>
            <div>
              <div className="onboard-feature-title">Recurring expense tracker</div>
              <div className="onboard-feature-text">Netflix, Wi-Fi, Spotify — auto-track shared subscriptions with reminders.</div>
            </div>
          </div>
          <button className="onboard-cta" onClick={startApp}>Get started — no sign up</button>
          <div className="onboard-privacy">Your data never leaves your device</div>
        </div>
      )}

      {isOnboarded && (
        <div className="app" id="mainApp">
          <div className="nav">
            <div className="nav-logo">p<span>a</span>ct</div>
            <div className="nav-actions">
              <div className="icon-btn" title="Privacy mode active" onClick={() => showToast("🔒 Local-only mode — data never leaves your device")}>🔒</div>
              <div className="icon-btn" title="Settings" onClick={() => showToast("⚙️ Settings coming soon")}>⚙️</div>
            </div>
          </div>

          <div className={`screen ${activeTab === "home" ? "active" : ""}`} id="screen-home">
            <div className="privacy-row">🔒 All data stored locally on your device — never shared</div>

            <div className="health-card">
              <div className="health-row">
                <div className="score-ring">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(124,109,250,0.15)" strokeWidth="6" />
                    <circle cx="36" cy="36" r="30" fill="none" stroke="#7c6dfa" strokeWidth="6" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset="47" />
                  </svg>
                  <div className="score-value">75</div>
                </div>
                <div className="health-info">
                  <div className="health-title">Group Health</div>
                  <div className="health-sub">3 of 5 expenses settled<br /><span className="chip chip-amber" style={{ marginTop: "4px", display: "inline-flex" }}>2 pending debts</span></div>
                </div>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-val">₹4,820</div>
                <div className="stat-label">Total spent</div>
              </div>
              <div className="stat-card">
                <div className="stat-val" style={{ color: "var(--red)" }}>₹1,240</div>
                <div className="stat-label">You owe</div>
              </div>
              <div className="stat-card">
                <div className="stat-val" style={{ color: "var(--green)" }}>₹680</div>
                <div className="stat-label">Owed to you</div>
              </div>
            </div>

            <div className="balance-banner">
              <div style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Net balance</div>
              <div className="balance-amount owe">−₹560</div>
              <div style={{ fontSize: "13px", color: "var(--text2)" }}>You owe more than you're owed</div>
            </div>

            <div className="section-header">
              <div className="section-title">Recent expenses</div>
              <div className="see-all" onClick={() => setActiveTab("expenses")}>See all</div>
            </div>
            <div className="card" id="recentList">
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#1a1a30" }}>🍕</div>
                <div className="exp-info">
                  <div className="exp-title">Dinner at Social</div>
                  <div className="exp-meta">Rahul paid · 5 people · Yesterday</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹1,840</div>
                  <div className="exp-share" style={{ color: "var(--red)" }}>You owe ₹368</div>
                </div>
              </div>
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#0f1f1a" }}>🏠</div>
                <div className="exp-info">
                  <div className="exp-title">Airbnb — Goa trip</div>
                  <div className="exp-meta">You paid · 4 people · 2d ago</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹12,000</div>
                  <div className="exp-share" style={{ color: "var(--green)" }}>Owed ₹9,000</div>
                </div>
              </div>
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#1f150a" }}>🚕</div>
                <div className="exp-info">
                  <div className="exp-title">Cab to airport</div>
                  <div className="exp-meta">Priya paid · 3 people · 3d ago</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹680</div>
                  <div className="exp-share" style={{ color: "var(--red)" }}>You owe ₹227</div>
                </div>
              </div>
            </div>

            <div className="section-header">
              <div className="section-title">Settle up</div>
            </div>
            <div className="card-sm" style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="avatar" style={{ background: "#2a1a3a", color: "#c084fc" }}>RS</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>Rahul Singh</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)" }}>dinner + 1 more</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--red)" }}>₹595</div>
                  <button style={{ marginTop: "4px", padding: "4px 12px", background: "var(--redbg)", border: "1px solid rgba(248,114,114,0.3)", borderRadius: "20px", color: "var(--red)", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: "500" }} onClick={() => showToast("💸 UPI payment integration coming in v2!")}>Pay now</button>
                </div>
              </div>
            </div>
            <div className="card-sm">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="avatar" style={{ background: "#0f2a1e", color: "#2dd4a0" }}>PK</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>Priya Kumar</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)" }}>cab fare</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--red)" }}>₹227</div>
                  <button style={{ marginTop: "4px", padding: "4px 12px", background: "var(--redbg)", border: "1px solid rgba(248,114,114,0.3)", borderRadius: "20px", color: "var(--red)", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: "500" }} onClick={() => showToast("💸 UPI payment integration coming in v2!")}>Pay now</button>
                </div>
              </div>
            </div>
          </div>

          <div className={`screen ${activeTab === "expenses" ? "active" : ""}`} id="screen-expenses">
            <div className="section-header">
              <div className="section-title">All expenses</div>
              <div className="chip chip-purple" id="expCount">5 total</div>
            </div>
            <div className="card" id="allExpensesList">
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#1a1a30" }}>🍕</div>
                <div className="exp-info">
                  <div className="exp-title">Dinner at Social</div>
                  <div className="exp-meta">Rahul paid · 5 people</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹1,840</div>
                  <div className="exp-share" style={{ color: "var(--red)" }}>−₹368</div>
                </div>
              </div>
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#0f1f1a" }}>🏠</div>
                <div className="exp-info">
                  <div className="exp-title">Airbnb — Goa</div>
                  <div className="exp-meta">You paid · 4 people</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹12,000</div>
                  <div className="exp-share" style={{ color: "var(--green)" }}>+₹9,000</div>
                </div>
              </div>
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#1f150a" }}>🚕</div>
                <div className="exp-info">
                  <div className="exp-title">Cab to airport</div>
                  <div className="exp-meta">Priya paid · 3 people</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹680</div>
                  <div className="exp-share" style={{ color: "var(--red)" }}>−₹227</div>
                </div>
              </div>
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#1a100a" }}>🎉</div>
                <div className="exp-info">
                  <div className="exp-title">Birthday cake</div>
                  <div className="exp-meta">You paid · 5 people</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹800</div>
                  <div className="exp-share" style={{ color: "var(--green)" }}>+₹640</div>
                </div>
              </div>
              <div className="expense-item">
                <div className="exp-icon" style={{ background: "#0a1a2a" }}>🎬</div>
                <div className="exp-info">
                  <div className="exp-title">Movie — PVR IMAX</div>
                  <div className="exp-meta">Arjun paid · 4 people</div>
                </div>
                <div className="exp-amount">
                  <div className="exp-total">₹2,400</div>
                  <div className="exp-share" style={{ color: "var(--red)" }}>−₹600</div>
                </div>
              </div>
            </div>

            <div className="section-header" style={{ marginTop: "8px" }}>
              <div className="section-title">Recurring</div>
              <div className="chip chip-amber">Auto-tracked</div>
            </div>
            <div className="card">
              <div className="recurring-item">
                <div className="exp-icon" style={{ background: "#0a1a2a", fontSize: "16px" }}>📺</div>
                <div className="rec-info">
                  <div className="rec-name">Netflix split</div>
                  <div className="rec-meta">Monthly · Next: Jul 1</div>
                </div>
                <div className="rec-amount">₹200</div>
                <div className={`toggle-switch ${toggles.tog1 ? "on" : ""}`} onClick={() => toggleSwitch("tog1")}></div>
              </div>
              <div className="recurring-item">
                <div className="exp-icon" style={{ background: "#1a0a1a", fontSize: "16px" }}>🎵</div>
                <div className="rec-info">
                  <div className="rec-name">Spotify family</div>
                  <div className="rec-meta">Monthly · Next: Jul 3</div>
                </div>
                <div className="rec-amount">₹85</div>
                <div className={`toggle-switch ${toggles.tog2 ? "on" : ""}`} onClick={() => toggleSwitch("tog2")}></div>
              </div>
              <div className="recurring-item">
                <div className="exp-icon" style={{ background: "#0a1a0a", fontSize: "16px" }}>🌐</div>
                <div className="rec-info">
                  <div className="rec-name">Wi-Fi bill</div>
                  <div className="rec-meta">Monthly · Next: Jul 10</div>
                </div>
                <div className="rec-amount">₹250</div>
                <div className={`toggle-switch ${toggles.tog3 ? "on" : ""}`} onClick={() => toggleSwitch("tog3")}></div>
              </div>
            </div>
          </div>

          <div className={`screen ${activeTab === "graph" ? "active" : ""}`} id="screen-graph">
            <div className="section-header">
              <div className="section-title">Debt network</div>
              <div className="chip chip-purple">Live graph</div>
            </div>

            <div className="graph-container">
              <div className="graph-title">
                <span>Who owes who</span>
                <span style={{ fontSize: "11px", color: "var(--text3)" }}>Arrows show money flow</span>
              </div>
              <canvas ref={canvasRef} id="debtCanvas" width="380" height="220"></canvas>
            </div>

            <div className="section-header" style={{ marginTop: "4px" }}>
              <div className="section-title">Smart settlement</div>
            </div>
            <div className="card-sm" style={{ marginBottom: "8px", background: "var(--greenbg)", borderColor: "rgba(45,212,160,0.2)" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px" }}>✨</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--green)", marginBottom: "4px" }}>AI suggests: 3 transactions clear all debts</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)", lineHeight: "1.5" }}>Instead of 6 separate payments, these 3 moves settle everything optimally.</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="debt-row">
                <div className="avatar" style={{ background: "#2a1a3a", color: "#c084fc", width: "28px", height: "28px", fontSize: "10px" }}>You</div>
                <div className="debt-label"><strong>You</strong> → <strong>Rahul</strong></div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "var(--red)", fontWeight: "500", width: "56px", textAlign: "right" }}>₹595</div>
                <div className="debt-bar-wrap"><div className="debt-bar" style={{ width: "80%", background: "var(--red)" }}></div></div>
              </div>
              <div className="debt-row">
                <div className="avatar" style={{ background: "#0f2a1e", color: "#2dd4a0", width: "28px", height: "28px", fontSize: "10px" }}>PK</div>
                <div className="debt-label"><strong>You</strong> → <strong>Priya</strong></div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "var(--red)", fontWeight: "500", width: "56px", textAlign: "right" }}>₹227</div>
                <div className="debt-bar-wrap"><div className="debt-bar" style={{ width: "30%", background: "var(--red)" }}></div></div>
              </div>
              <div className="debt-row">
                <div className="avatar" style={{ background: "#0a1a2a", color: "#60a5fa", width: "28px", height: "28px", fontSize: "10px" }}>AV</div>
                <div className="debt-label"><strong>Arjun</strong> → <strong>You</strong></div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "var(--green)", fontWeight: "500", width: "56px", textAlign: "right" }}>₹680</div>
                <div className="debt-bar-wrap"><div className="debt-bar" style={{ width: "90%", background: "var(--green)" }}></div></div>
              </div>
              <div className="debt-row">
                <div className="avatar" style={{ background: "#2a1a0a", color: "#f6b44a", width: "28px", height: "28px", fontSize: "10px" }}>NK</div>
                <div className="debt-label"><strong>Neha</strong> → <strong>You</strong></div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "var(--green)", fontWeight: "500", width: "56px", textAlign: "right" }}>₹460</div>
                <div className="debt-bar-wrap"><div className="debt-bar" style={{ width: "60%", background: "var(--green)" }}></div></div>
              </div>
            </div>
          </div>

          <div className={`screen ${activeTab === "add" ? "active" : ""}`} id="screen-add">
            <div className="section-header">
              <div className="section-title">Add expense</div>
              <div className="chip chip-purple">AI-powered</div>
            </div>

            <div className="form-group">
              <label className="form-label">Amount</label>
              <div className="amount-input-wrap">
                <span className="currency">₹</span>
                <input className="form-input" type="number" placeholder="0" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" type="text" placeholder="What was this for?" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="category-grid">
                {[
                  { name: "Food", icon: "🍕" }, { name: "Travel", icon: "🚕" },
                  { name: "Stay", icon: "🏠" }, { name: "Fun", icon: "🎉" },
                  { name: "Movie", icon: "🎬" }, { name: "Shop", icon: "🛒" },
                  { name: "Sub", icon: "📺" }, { name: "Bills", icon: "⚡" },
                ].map((cat) => (
                  <button key={cat.name} className={`cat-btn ${activeCat === cat.name ? "active" : ""}`} onClick={() => setActiveCat(cat.name)}>
                    <span>{cat.icon}</span><span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Paid by</label>
              <select className="form-input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                {["You", "Rahul", "Priya", "Arjun", "Neha"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Split between</label>
              <div className="member-select">
                {members.map((m, idx) => (
                  <button key={m.name} className={`member-chip ${m.active ? "active" : ""}`} onClick={() => toggleMember(idx)}>{m.name}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Split type</label>
              <div className="split-toggle">
                {["Equal", "By %", "Exact amounts", "By shares"].map((s) => (
                  <button key={s} className={`split-btn ${activeSplit === s ? "active" : ""}`} onClick={() => setActiveSplit(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="card-sm" style={{ marginBottom: "20px", background: "var(--accentbg)", borderColor: "rgba(124,109,250,0.3)" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "18px" }}>✨</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: "500", color: "var(--accent)", marginBottom: "2px" }}>AI suggestion</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)" }}>
                    Based on your group's history, equal split is most common for {activeCat.toLowerCase()}. Each person: <strong style={{ color: "var(--text)" }}>{aiSplitText}</strong>
                  </div>
                </div>
              </div>
            </div>

            <button className="submit-btn" onClick={addExpense}>Add expense</button>
          </div>

          <div className={`screen ${activeTab === "chat" ? "active" : ""}`} id="screen-chat">
            <div className="section-header">
              <div className="section-title">Group AI</div>
              <div className="chip chip-amber">{maxChats - chatsUsed} chats left</div>
            </div>

            <div className="privacy-row">✨ AI processes your context locally — financial data stays private</div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--text2)" }}>Monthly chats used:</div>
              <div className="chat-limit">
                {Array.from({ length: maxChats }).map((_, i) => (
                  <div key={i} className={`limit-dot ${i < chatsUsed ? "used" : ""}`}></div>
                ))}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text2)" }}>{chatsUsed}/{maxChats}</div>
            </div>

            <div className="chat-messages" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role === "ai" ? "msg-ai" : "msg-user"}`}>
                  {msg.role === "ai" && <div className="msg-header">Pact AI</div>}
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                className="chat-input"
                type="text"
                placeholder="Ask about your expenses..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
              />
              <button className="send-btn" onClick={sendChat}>↑</button>
            </div>
          </div>

          {activeTab !== "add" && (
            <button className="fab" onClick={() => setActiveTab("add")}>+</button>
          )}

          <div className="bottom-nav">
            <div className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
              <div className="nav-icon">🏠</div>
              <div className="nav-label">Home</div>
            </div>
            <div className={`nav-item ${activeTab === "expenses" ? "active" : ""}`} onClick={() => setActiveTab("expenses")}>
              <div className="nav-icon">📋</div>
              <div className="nav-label">Expenses</div>
            </div>
            <div className={`nav-item ${activeTab === "graph" ? "active" : ""}`} onClick={() => setActiveTab("graph")}>
              <div className="nav-icon">🕸️</div>
              <div className="nav-label">Graph</div>
            </div>
            <div className={`nav-item ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
              <div className="nav-icon">✨</div>
              <div className="nav-label">AI Chat</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
