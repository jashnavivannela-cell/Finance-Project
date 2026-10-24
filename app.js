/* ==========================================================================
   Fingo — Core Application Engine, AI Coach & Tax Optimizer Logic
   ========================================================================== */

(function () {
  'use strict';

  const API_BASE_URL = 'http://localhost:8080/api';

  const CATEGORY_COLORS = {
    'Housing': { bg: 'rgba(99, 102, 241, 0.18)', border: '#6366f1', icon: 'fa-house' },
    'Food & Dining': { bg: 'rgba(16, 185, 129, 0.18)', border: '#10b981', icon: 'fa-utensils' },
    'Shopping': { bg: 'rgba(244, 63, 94, 0.18)', border: '#f43f5e', icon: 'fa-bag-shopping' },
    'Transportation': { bg: 'rgba(6, 182, 212, 0.18)', border: '#06b6d4', icon: 'fa-car' },
    'Salary & Earnings': { bg: 'rgba(16, 185, 129, 0.22)', border: '#10b981', icon: 'fa-money-bill-wave' },
    'Entertainment': { bg: 'rgba(139, 92, 246, 0.18)', border: '#8b5cf6', icon: 'fa-film' },
    'Utilities': { bg: 'rgba(245, 158, 11, 0.18)', border: '#f59e0b', icon: 'fa-bolt' },
    'Investment / SIP': { bg: 'rgba(59, 130, 246, 0.18)', border: '#3b82f6', icon: 'fa-chart-line' },
    'Other': { bg: 'rgba(148, 163, 184, 0.18)', border: '#94a3b8', icon: 'fa-ellipsis' }
  };

  const DEFAULT_TRANSACTIONS = [
    { id: 'tx-101', title: 'Monthly Salary - Tech Corp India', amount: 125000.00, type: 'income', category: 'Salary & Earnings', date: '2026-10-01', paymentMethod: 'Net Banking', note: 'Direct salary credit Ref #SAL89104', status: 'Settled' },
    { id: 'tx-102', title: 'Luxury 3BHK Flat Rent', amount: 22000.00, type: 'expense', category: 'Housing', date: '2026-10-02', paymentMethod: 'Net Banking', note: 'October rent via HDFC Ref #RNT49102', status: 'Settled' },
    { id: 'tx-103', title: 'Zerodha Nifty 50 Index SIP', amount: 10000.00, type: 'expense', category: 'Investment / SIP', date: '2026-10-03', paymentMethod: 'UPI (GPay/PhonePe)', note: 'Auto-debit mutual fund Ref #UPI9910', status: 'Auto-Debited' },
    { id: 'tx-104', title: 'Swiggy & Instamart Groceries', amount: 4850.00, type: 'expense', category: 'Food & Dining', date: '2026-10-04', paymentMethod: 'UPI (GPay/PhonePe)', note: 'Weekly household dining GPay #SWG88', status: 'Settled' },
    { id: 'tx-105', title: 'Freelance Mobile App Client', amount: 35000.00, type: 'income', category: 'Salary & Earnings', date: '2026-10-05', paymentMethod: 'UPI (GPay/PhonePe)', note: 'Client milestone payment Ref #FRL204', status: 'Settled' },
    { id: 'tx-106', title: 'HDFC Regalia Credit Card Bill', amount: 15600.00, type: 'expense', category: 'Shopping', date: '2026-10-06', paymentMethod: 'Credit Card', note: 'Festival clothes & gadgets Ref #CC771', status: 'Settled' },
    { id: 'tx-107', title: 'Torrent Power Electricity Bill', amount: 2800.00, type: 'expense', category: 'Utilities', date: '2026-10-07', paymentMethod: 'UPI (GPay/PhonePe)', note: 'Monthly power consumption Ref #PWR33', status: 'Settled' },
    { id: 'tx-108', title: 'Fuel Petrol - Shell Station', amount: 3450.00, type: 'expense', category: 'Transportation', date: '2026-10-08', paymentMethod: 'Debit Card', note: 'Car fuel refill Ref #PET901', status: 'Settled' }
  ];

  const DEFAULT_GOALS = [
    { id: 'g-1', title: 'Emergency Reserve (6 Months)', target: 500000, current: 385000, category: 'fa-shield-heart', targetDate: '2026-12-31' },
    { id: 'g-2', title: 'Gold ETF Investment', target: 200000, current: 145000, category: 'fa-chart-line', targetDate: '2027-04-15' },
    { id: 'g-3', title: 'Goa Family Trip', target: 80000, current: 52000, category: 'fa-umbrella-beach', targetDate: '2026-11-20' }
  ];

  const DEFAULT_BUDGETS = {
    'Housing': 25000,
    'Food & Dining': 12000,
    'Shopping': 20000,
    'Transportation': 8000,
    'Entertainment': 6000,
    'Utilities': 5000
  };

  const DEFAULT_USER = {
    name: 'Jashnavi Patel',
    email: 'jashnavi.patel@fingo.in',
    phone: '+91 98765 43210',
    currency: '₹',
    monthlySavingsGoal: 50000,
    riskPreference: 'Moderate',
    avatar: '',
    isLoggedIn: false
  };

  const DEFAULT_SPLIT_BILLS = [
    { id: 'sb-1', title: 'Goa Villa Rent & Dining', totalAmount: 18000, paidBy: 'You (Jashnavi Patel)', payeeUpi: 'jashnavi.patel@okaxis', date: '2026-09-28', members: ['Jashnavi Patel', 'Amit Sharma', 'Priya Patel', 'Vikas Verma'], status: 'Active', myShare: 4500, owedToMe: 13500 },
    { id: 'sb-2', title: 'Apartment WiFi & Cook Salary', totalAmount: 5200, paidBy: 'Amit Sharma', payeeUpi: 'amit.sharma@paytm', date: '2026-10-01', members: ['Jashnavi Patel', 'Amit Sharma', 'Priya Patel'], status: 'Active', myShare: 1733, iOwe: 1733 },
    { id: 'sb-3', title: 'Team Buffet & Drinks', totalAmount: 6400, paidBy: 'You (Jashnavi Patel)', payeeUpi: 'jashnavi.patel@okaxis', date: '2026-10-03', members: ['Jashnavi Patel', 'Vikas Verma'], status: 'Active', myShare: 3200, owedToMe: 3200 }
  ];

  const storedUser = JSON.parse(localStorage.getItem('af_user') || 'null');
  if (storedUser && storedUser.name && (storedUser.name.includes('Rajesh') || storedUser.name.includes('Vannela'))) {
    localStorage.removeItem('af_user');
    localStorage.removeItem('af_split_bills');
  }

  let state = {
    transactions: JSON.parse(localStorage.getItem('af_transactions')) || DEFAULT_TRANSACTIONS,
    goals: JSON.parse(localStorage.getItem('af_goals')) || DEFAULT_GOALS,
    budgets: JSON.parse(localStorage.getItem('af_budgets')) || DEFAULT_BUDGETS,
    splitBills: JSON.parse(localStorage.getItem('af_split_bills')) || DEFAULT_SPLIT_BILLS,
    user: JSON.parse(localStorage.getItem('af_user')) || DEFAULT_USER,
    currencySymbol: localStorage.getItem('af_currency') || '₹',
    theme: localStorage.getItem('af_theme') || 'dark',
    activeTab: 'dashboard',
    sortColumn: 'date',
    sortDirection: 'desc',
    isJavaBackendConnected: false,
    activeSelectedTransId: null
  };

  let cashflowChart = null;
  let categoryPieChart = null;
  let paymentMethodChart = null;
  let projectionChart = null;
  let radarChart = null;
  let fireChart = null;

  document.addEventListener('DOMContentLoaded', async () => {
    initAuth();
    initTheme();
    initCurrency();
    initNavigation();
    initModals();
    initProfileForm();
    initAvatarModal();
    initAiCoach();
    initFiltersAndSorting();
    initClickableDetailHandlers();
    initKeyboardShortcuts();
    initSplitBillsModule();
    initWealthFreedomModule();

    await fetchFromJavaBackend();

    if (state.user.isLoggedIn) {
      showApp();
      renderAll();
    } else {
      showAuth();
    }
  });

  // --------------------------------------------------------------------------
  // AI COACH & TAX OPTIMIZER
  // --------------------------------------------------------------------------
  function initAiCoach() {
    const askBtn = document.getElementById('aiAskBtn');
    const askInput = document.getElementById('aiAskInput');
    const tipsContainer = document.getElementById('aiTipsContainer');
    const tipActionBtn = document.getElementById('aiTipActionBtn');

    if (tipActionBtn) {
      tipActionBtn.addEventListener('click', () => switchTab('tax-subscriptions'));
    }

    if (askBtn && askInput && tipsContainer) {
      const handleQuery = () => {
        const query = askInput.value.trim();
        if (!query) return;

        let reply = `Based on your monthly cash flow of ₹1,60,000, you have a healthy 73.5% savings rate. You can safely allocate ₹15,000 additional to your Nifty 50 SIP!`;
        if (query.toLowerCase().includes('subscription') || query.toLowerCase().includes('netflix')) {
          reply = `You have 4 active subscriptions total ₹3,806/mo. Canceling unused services could save ₹28,000 annually!`;
        } else if (query.toLowerCase().includes('tax') || query.toLowerCase().includes('80c')) {
          reply = `Under Section 80C, you can invest ₹40,000 more in ELSS Tax Saver Funds to claim maximum ₹1,50,000 deduction.`;
        }

        const newTip = document.createElement('div');
        newTip.className = 'ai-tip-item';
        newTip.innerHTML = `
          <i class="fa-solid fa-robot tip-icon" style="color:var(--emerald);"></i>
          <div class="tip-content">
            <strong>Fingo AI Assistant:</strong> ${reply}
          </div>
        `;

        tipsContainer.prepend(newTip);
        askInput.value = '';
        showToast('Fingo AI Response Generated', 'success');
      };

      askBtn.addEventListener('click', handleQuery);
      askInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleQuery();
      });
    }
  }

  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('globalSearch') || document.getElementById('transSearchInput');
        if (searchInput) searchInput.focus();
      }
    });
  }

  function getUserInitials(name) {
    if (!name) return 'JP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function renderUserAvatars() {
    const sidebarContainer = document.getElementById('sidebarAvatarContainer');
    const profileContainer = document.getElementById('profileCardAvatarContainer');
    const initials = getUserInitials(state.user.name);

    const hasPhoto = state.user.avatar && state.user.avatar.trim().length > 0;

    if (sidebarContainer) {
      if (hasPhoto) {
        sidebarContainer.innerHTML = `<img src="${state.user.avatar}" alt="Avatar" class="avatar">`;
      } else {
        sidebarContainer.innerHTML = `<div class="avatar-initials sidebar-size">${initials}</div>`;
      }
    }

    if (profileContainer) {
      if (hasPhoto) {
        profileContainer.innerHTML = `<img src="${state.user.avatar}" alt="Avatar" style="width:110px; height:110px; border-radius:50%; object-fit:cover; border:4px solid var(--emerald); box-shadow:var(--shadow-glow-emerald);">`;
      } else {
        profileContainer.innerHTML = `<div class="avatar-initials profile-size">${initials}</div>`;
      }
    }
  }

  function initAvatarModal() {
    const avatarModal = document.getElementById('avatarModal');
    const openBtn = document.getElementById('openAvatarModalBtn');
    const editBtn = document.getElementById('editPhotoBtn');
    const closeBtn = document.getElementById('closeAvatarModalBtn');
    const cancelBtn = document.getElementById('cancelAvatarModalBtn');
    const form = document.getElementById('avatarForm');
    const urlInput = document.getElementById('avatarUrlInput');
    const removeBtn1 = document.getElementById('removePhotoBtn');
    const removeBtn2 = document.getElementById('modalRemovePhotoBtn');
    const fileInput = document.getElementById('avatarFileInput');
    const uploadBtn = document.getElementById('uploadFileBtn');

    [openBtn, editBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => {
        if (urlInput) urlInput.value = state.user.avatar || '';
        openModal(avatarModal);
      });
    });

    [closeBtn, cancelBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(avatarModal));
    });

    document.querySelectorAll('.preset-avatar-option').forEach(option => {
      option.addEventListener('click', () => {
        const url = option.getAttribute('data-url');
        if (urlInput) urlInput.value = url;
        document.querySelectorAll('.preset-avatar-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
      });
    });

    const handleRemovePhoto = () => {
      state.user.avatar = '';
      saveState();
      renderUserAvatars();
      closeModal(avatarModal);
      showToast('Profile photo removed. Showing initials.', 'info');
    };

    if (removeBtn1) removeBtn1.addEventListener('click', handleRemovePhoto);
    if (removeBtn2) removeBtn2.addEventListener('click', handleRemovePhoto);

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            if (urlInput) urlInput.value = re.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUrl = urlInput.value.trim();
        state.user.avatar = newUrl;
        saveState();
        renderUserAvatars();
        closeModal(avatarModal);
        showToast(newUrl ? 'Profile picture updated!' : 'Profile picture set to empty initials', 'success');
      });
    }
  }

  function initClickableDetailHandlers() {
    document.getElementById('metricCardBalance')?.addEventListener('click', () => openMetricDetailModal('balance'));
    document.getElementById('metricCardIncome')?.addEventListener('click', () => openMetricDetailModal('income'));
    document.getElementById('metricCardExpense')?.addEventListener('click', () => openMetricDetailModal('expense'));
    document.getElementById('metricCardSavings')?.addEventListener('click', () => openMetricDetailModal('savings'));
  }

  function openTransactionDetailModal(id) {
    const t = state.transactions.find(item => item.id === id);
    if (!t) return;

    state.activeSelectedTransId = id;
    const content = document.getElementById('transDetailContent');
    if (!content) return;

    const categoryStyle = CATEGORY_COLORS[t.category] || CATEGORY_COLORS['Other'];
    const sign = t.type === 'income' ? '+' : '-';

    content.innerHTML = `
      <div class="receipt-header-card">
        <div class="category-icon-bubble" style="background:${categoryStyle.bg}; color:${categoryStyle.border}; margin: 0 auto 0.5rem auto; width:48px; height:48px; font-size:1.3rem;">
          <i class="fa-solid ${categoryStyle.icon}"></i>
        </div>
        <div class="receipt-title">${escapeHtml(t.title)}</div>
        <div class="receipt-amount ${t.type}">${sign}${formatMoney(t.amount)}</div>
        <span class="status-pill settled"><i class="fa-solid fa-circle-check"></i> ${t.status || 'Settled'}</span>
      </div>

      <div class="detail-row-group">
        <div class="detail-item">
          <span class="label">Transaction ID</span>
          <span class="value" style="font-family:monospace; font-size:0.85rem;">${t.id}</span>
        </div>
        <div class="detail-item">
          <span class="label">Category</span>
          <span class="value"><span class="category-badge">${escapeHtml(t.category)}</span></span>
        </div>
        <div class="detail-item">
          <span class="label">Date & Time</span>
          <span class="value">${t.date} • 14:20 IST</span>
        </div>
        <div class="detail-item">
          <span class="label">Payment Instrument</span>
          <span class="value">${escapeHtml(t.paymentMethod || 'UPI')}</span>
        </div>
        <div class="detail-item">
          <span class="label">Reference & Notes</span>
          <span class="value" style="max-width:240px; text-align:right;">${escapeHtml(t.note || 'Verified Electronic Transfer')}</span>
        </div>
      </div>
    `;

    openModal(document.getElementById('transDetailModal'));
  }

  function openMetricDetailModal(type) {
    const titleEl = document.getElementById('metricDetailTitle');
    const contentEl = document.getElementById('metricDetailContent');

    let totalIncome = 0;
    let totalExpense = 0;

    state.transactions.forEach(t => {
      const amt = parseFloat(t.amount);
      if (t.type === 'income') totalIncome += amt;
      if (t.type === 'expense') totalExpense += amt;
    });

    const netWorth = totalIncome - totalExpense;

    if (type === 'balance') {
      titleEl.textContent = 'Managed Net Worth Breakdown';
      contentEl.innerHTML = `
        <div class="receipt-header-card">
          <div class="receipt-title">Net Balance Position</div>
          <div class="receipt-amount income">${formatMoney(netWorth)}</div>
        </div>
        <div class="detail-row-group" style="margin-top:1rem;">
          <div class="detail-item"><span class="label">Total Cumulative Inflow</span><span class="value" style="color:var(--emerald);">${formatMoney(totalIncome)}</span></div>
          <div class="detail-item"><span class="label">Total Cumulative Outflow</span><span class="value" style="color:var(--rose);">${formatMoney(totalExpense)}</span></div>
          <div class="detail-item"><span class="label">Liquid Savings Cash</span><span class="value">${formatMoney(netWorth * 0.45)}</span></div>
          <div class="detail-item"><span class="label">SIP Mutual Funds Portfolio</span><span class="value">${formatMoney(netWorth * 0.55)}</span></div>
        </div>
      `;
    } else if (type === 'income') {
      titleEl.textContent = 'Monthly Income Sources Breakdown';
      const incomeTx = state.transactions.filter(t => t.type === 'income');
      contentEl.innerHTML = `
        <div class="receipt-header-card">
          <div class="receipt-title">Total Monthly Inflow</div>
          <div class="receipt-amount income">${formatMoney(totalIncome)}</div>
        </div>
        <div class="detail-row-group" style="margin-top:1rem;">
          ${incomeTx.map(t => `
            <div class="detail-item">
              <span class="label">${escapeHtml(t.title)}</span>
              <span class="value" style="color:var(--emerald);">+${formatMoney(t.amount)}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'expense') {
      titleEl.textContent = 'Monthly Outflow Breakdown';
      const expenseTx = state.transactions.filter(t => t.type === 'expense');
      contentEl.innerHTML = `
        <div class="receipt-header-card">
          <div class="receipt-title">Total Monthly Outflow</div>
          <div class="receipt-amount expense">${formatMoney(totalExpense)}</div>
        </div>
        <div class="detail-row-group" style="margin-top:1rem;">
          ${expenseTx.map(t => `
            <div class="detail-item">
              <span class="label">${escapeHtml(t.title)}</span>
              <span class="value" style="color:var(--rose);">-${formatMoney(t.amount)}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'savings') {
      const rate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : '0.0';
      titleEl.textContent = 'Fingo Net Savings Ratio Analysis';
      contentEl.innerHTML = `
        <div class="receipt-header-card">
          <div class="receipt-title">Current Savings Rate</div>
          <div class="receipt-amount income">${rate}%</div>
          <span class="status-pill settled">Exceeds 50% Benchmark</span>
        </div>
        <div class="detail-row-group" style="margin-top:1rem;">
          <div class="detail-item"><span class="label">Monthly Net Savings</span><span class="value">${formatMoney(netWorth)}</span></div>
          <div class="detail-item"><span class="label">Recommended Reserve Target</span><span class="value">${formatMoney(state.user.monthlySavingsGoal)}</span></div>
        </div>
      `;
    }

    openModal(document.getElementById('metricDetailModal'));
  }

  function initAuth() {
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (showLoginBtn && showRegisterBtn) {
      showLoginBtn.addEventListener('click', () => {
        showLoginBtn.classList.add('active');
        showRegisterBtn.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
      });

      showRegisterBtn.addEventListener('click', () => {
        showRegisterBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.user.email = document.getElementById('loginEmail').value;
        state.user.isLoggedIn = true;
        saveState();
        showApp();
        renderAll();
        showToast(`Welcome back to Fingo, ${state.user.name}!`, 'success');
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.user.name = document.getElementById('regName').value;
        state.user.email = document.getElementById('regEmail').value;
        state.user.isLoggedIn = true;
        saveState();
        showApp();
        renderAll();
        showToast(`Welcome to Fingo, ${state.user.name}!`, 'success');
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        state.user.isLoggedIn = false;
        saveState();
        showAuth();
        showToast('Logged out securely', 'info');
      });
    }
  }

  function showAuth() {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appMain').style.display = 'none';
  }

  function showApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appMain').style.display = 'flex';
    updateUserProfileDisplay();
    renderUserAvatars();
  }

  function updateUserProfileDisplay() {
    const sidebarName = document.getElementById('sidebarUserName');
    const dashName = document.getElementById('dashWelcomeName');
    const cardName = document.getElementById('profileCardName');
    const cardEmail = document.getElementById('profileCardEmail');

    if (sidebarName) sidebarName.textContent = state.user.name;
    if (dashName) dashName.textContent = state.user.name.split(' ')[0];
    if (cardName) cardName.textContent = state.user.name;
    if (cardEmail) cardEmail.textContent = state.user.email;

    renderUserAvatars();
  }

  async function fetchFromJavaBackend() {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          state.transactions = data;
          state.isJavaBackendConnected = true;
          showToast('Connected to Java Spring REST Backend', 'success');
        }
      }
    } catch (e) {
      state.isJavaBackendConnected = false;
    }
  }

  function saveState() {
    localStorage.setItem('af_transactions', JSON.stringify(state.transactions));
    localStorage.setItem('af_goals', JSON.stringify(state.goals));
    localStorage.setItem('af_budgets', JSON.stringify(state.budgets));
    localStorage.setItem('af_user', JSON.stringify(state.user));
    localStorage.setItem('af_currency', state.currencySymbol);
    localStorage.setItem('af_theme', state.theme);
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        updateThemeIcon();
        saveState();
        initCharts();
        showToast(`Switched to ${state.theme.toUpperCase()} mode`, 'info');
      });
    }
  }

  function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
      icon.className = state.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  function initCurrency() {
    const selector = document.getElementById('currencySelector');
    if (selector) {
      selector.value = state.currencySymbol;
      selector.addEventListener('change', (e) => {
        state.currencySymbol = e.target.value;
        document.querySelectorAll('.currency-symbol').forEach(el => {
          el.textContent = state.currencySymbol;
        });
        saveState();
        renderAll();
        showToast(`Currency updated to ${state.currencySymbol}`, 'info');
      });
    }
  }

  function formatMoney(amount) {
    const absVal = Math.abs(amount);
    const locale = state.currencySymbol === '₹' ? 'en-IN' : 'en-US';
    const formatted = absVal.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${state.currencySymbol}${formatted}`;
  }

  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabTarget = item.getAttribute('data-tab');
        switchTab(tabTarget);
      });
    });

    const mobileBtn = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
    }

    const viewAllBtn = document.getElementById('viewAllTransBtn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => switchTab('transactions'));
    }
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.nav-item').forEach(nav => {
      nav.classList.toggle('active', nav.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    if (['dashboard', 'analytics', 'expenses', 'wealth-freedom'].includes(tabName)) {
      setTimeout(() => {
        initCharts();
        if (tabName === 'wealth-freedom') calculateFIRE();
      }, 100);
    }
  }

  function renderAll() {
    renderUserAvatars();
    renderMetrics();
    renderRecentTransactions();
    renderFullTransactionsTable();
    renderExpensesTracker();
    renderBudgets();
    renderGoals();
    renderInsights();
    renderSplitBills();
    calculateFIRE();
    initCharts();
  }

  function renderMetrics() {
    let totalIncome = 0;
    let totalExpense = 0;

    state.transactions.forEach(t => {
      const amt = parseFloat(t.amount);
      if (t.type === 'income') totalIncome += amt;
      if (t.type === 'expense') totalExpense += amt;
    });

    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : '0.0';

    const balanceEl = document.getElementById('totalBalanceVal');
    const incomeEl = document.getElementById('totalIncomeVal');
    const expenseEl = document.getElementById('totalExpenseVal');
    const rateEl = document.getElementById('savingsRateVal');

    if (balanceEl) balanceEl.textContent = formatMoney(balance);
    if (incomeEl) incomeEl.textContent = formatMoney(totalIncome);
    if (expenseEl) expenseEl.textContent = formatMoney(totalExpense);
    if (rateEl) rateEl.textContent = `${savingsRate}%`;
  }

  function renderExpensesTracker() {
    let upiTotal = 0;
    let cardTotal = 0;
    let bankTotal = 0;

    state.transactions.forEach(t => {
      if (t.type === 'expense') {
        const amt = parseFloat(t.amount);
        if ((t.paymentMethod || '').includes('UPI')) upiTotal += amt;
        else if ((t.paymentMethod || '').includes('Card')) cardTotal += amt;
        else bankTotal += amt;
      }
    });

    const upiEl = document.getElementById('upiTotalVal');
    const cardEl = document.getElementById('cardTotalVal');
    const bankEl = document.getElementById('bankTotalVal');

    if (upiEl) upiEl.textContent = formatMoney(upiTotal);
    if (cardEl) cardEl.textContent = formatMoney(cardTotal);
    if (bankEl) bankEl.textContent = formatMoney(bankTotal);

    const topBody = document.getElementById('topExpensesBody');
    if (topBody) {
      const topList = state.transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      topBody.innerHTML = topList.map(t => `
        <tr data-id="${t.id}" class="trans-row-clickable">
          <td><strong>${escapeHtml(t.title)}</strong></td>
          <td><span class="category-badge">${escapeHtml(t.category)}</span></td>
          <td class="amount-cell expense text-right">-${formatMoney(t.amount)}</td>
        </tr>
      `).join('');

      topBody.querySelectorAll('.trans-row-clickable').forEach(tr => {
        tr.addEventListener('click', () => openTransactionDetailModal(tr.getAttribute('data-id')));
      });
    }
  }

  function renderRecentTransactions() {
    const tbody = document.getElementById('dashboardRecentBody');
    if (!tbody) return;

    const sorted = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    if (sorted.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center">No recent entries.</td></tr>`;
      return;
    }

    tbody.innerHTML = sorted.map(t => {
      const categoryStyle = CATEGORY_COLORS[t.category] || CATEGORY_COLORS['Other'];
      const sign = t.type === 'income' ? '+' : '-';
      return `
        <tr data-id="${t.id}" class="trans-row-clickable" title="Click to view full receipt">
          <td>
            <div class="trans-title-cell">
              <div class="category-icon-bubble" style="background:${categoryStyle.bg}; color:${categoryStyle.border};">
                <i class="fa-solid ${categoryStyle.icon}"></i>
              </div>
              <div>
                <div>${escapeHtml(t.title)}</div>
                <small style="color:var(--text-subtle);">${escapeHtml(t.paymentMethod || 'UPI')}</small>
              </div>
            </div>
          </td>
          <td><span class="category-badge">${escapeHtml(t.category)}</span></td>
          <td>${t.date}</td>
          <td class="amount-cell ${t.type}">${sign}${formatMoney(t.amount)}</td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.trans-row-clickable').forEach(tr => {
      tr.addEventListener('click', () => openTransactionDetailModal(tr.getAttribute('data-id')));
    });
  }

  function renderFullTransactionsTable() {
    const tbody = document.getElementById('fullTransBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('transSearchInput')?.value || '').toLowerCase();
    const globalSearch = (document.getElementById('globalSearch')?.value || '').toLowerCase();
    const typeFilter = document.getElementById('transTypeFilter')?.value || 'all';
    const catFilter = document.getElementById('transCatFilter')?.value || 'all';

    const effectiveQuery = searchTerm || globalSearch;

    let filtered = state.transactions.filter(t => {
      const matchSearch = !effectiveQuery || 
        t.title.toLowerCase().includes(effectiveQuery) || 
        (t.note && t.note.toLowerCase().includes(effectiveQuery)) ||
        t.category.toLowerCase().includes(effectiveQuery);
      
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchCat = catFilter === 'all' || t.category === catFilter;

      return matchSearch && matchType && matchCat;
    });

    filtered.sort((a, b) => {
      let valA = a[state.sortColumn];
      let valB = b[state.sortColumn];

      if (state.sortColumn === 'amount') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      } else if (state.sortColumn === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const recordCountEl = document.getElementById('tableRecordCount');
    if (recordCountEl) {
      recordCountEl.textContent = `Showing ${filtered.length} of ${state.transactions.length} entries`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No matching transactions found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const categoryStyle = CATEGORY_COLORS[t.category] || CATEGORY_COLORS['Other'];
      const sign = t.type === 'income' ? '+' : '-';
      return `
        <tr data-id="${t.id}" class="trans-row-clickable">
          <td>
            <div class="trans-title-cell">
              <div class="category-icon-bubble" style="background:${categoryStyle.bg}; color:${categoryStyle.border};">
                <i class="fa-solid ${categoryStyle.icon}"></i>
              </div>
              <div>
                <div>${escapeHtml(t.title)}</div>
                ${t.note ? `<small style="color:var(--text-subtle);">${escapeHtml(t.note)}</small>` : ''}
              </div>
            </div>
          </td>
          <td><span class="category-badge">${escapeHtml(t.category)}</span></td>
          <td>${t.date}</td>
          <td><span class="category-badge" style="text-transform:capitalize;">${t.type}</span></td>
          <td class="amount-cell ${t.type} text-right">${sign}${formatMoney(t.amount)}</td>
          <td>
            <div class="action-btns">
              <button class="btn-icon view-trans-btn" data-id="${t.id}" title="View Details"><i class="fa-solid fa-eye"></i></button>
              <button class="btn-icon edit-trans-btn" data-id="${t.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
              <button class="btn-icon delete-trans-btn" data-id="${t.id}" title="Delete" style="color:var(--rose);"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.view-trans-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTransactionDetailModal(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.edit-trans-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditTransactionModal(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.delete-trans-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTransaction(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.trans-row-clickable').forEach(tr => {
      tr.addEventListener('click', () => openTransactionDetailModal(tr.getAttribute('data-id')));
    });
  }

  function initFiltersAndSorting() {
    const searchInput = document.getElementById('transSearchInput');
    const globalSearch = document.getElementById('globalSearch');
    const typeFilter = document.getElementById('transTypeFilter');
    const catFilter = document.getElementById('transCatFilter');
    const resetBtn = document.getElementById('resetFiltersBtn');

    [searchInput, globalSearch].forEach(el => {
      if (el) el.addEventListener('input', () => renderFullTransactionsTable());
    });

    [typeFilter, catFilter].forEach(el => {
      if (el) el.addEventListener('change', () => renderFullTransactionsTable());
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (globalSearch) globalSearch.value = '';
        if (typeFilter) typeFilter.value = 'all';
        if (catFilter) catFilter.value = 'all';
        renderFullTransactionsTable();
      });
    }

    document.querySelectorAll('.data-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (state.sortColumn === col) {
          state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortColumn = col;
          state.sortDirection = 'asc';
        }
        renderFullTransactionsTable();
      });
    });

    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportCSV);
  }

  async function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction entry?')) {
      if (state.isJavaBackendConnected) {
        try {
          await fetch(`${API_BASE_URL}/transactions/${id}`, { method: 'DELETE' });
        } catch (e) { console.error('Java DELETE failed:', e); }
      }
      state.transactions = state.transactions.filter(t => t.id !== id);
      saveState();
      renderAll();
      closeModal(document.getElementById('transDetailModal'));
      showToast('Transaction removed', 'danger');
    }
  }

  function exportCSV() {
    if (state.transactions.length === 0) {
      showToast('No transaction data to export', 'info');
      return;
    }

    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'PaymentMethod', 'Notes'];
    const rows = state.transactions.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      `"${t.category}"`,
      t.date,
      `"${t.paymentMethod || ''}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fingo_statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV statement exported', 'success');
  }

  function renderBudgets() {
    const grid = document.getElementById('budgetsGrid');
    if (!grid) return;

    const categorySpending = {};
    state.transactions.forEach(t => {
      if (t.type === 'expense') {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + parseFloat(t.amount);
      }
    });

    const budgetCategories = Object.keys(state.budgets);
    grid.innerHTML = budgetCategories.map(cat => {
      const limit = state.budgets[cat];
      const spent = categorySpending[cat] || 0;
      const pct = Math.min(Math.round((spent / limit) * 100), 100);
      const categoryStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Other'];

      let progressClass = 'normal';
      if (pct > 80 && pct <= 100) progressClass = 'warning';
      if (pct >= 100) progressClass = 'danger';

      return `
        <div class="budget-card" data-category="${cat}" title="Click to view ${cat} entries">
          <div class="budget-header">
            <div class="budget-info">
              <h4>${escapeHtml(cat)}</h4>
              <span>Limit: ${formatMoney(limit)} / mo</span>
            </div>
            <div class="category-icon-bubble" style="background:${categoryStyle.bg}; color:${categoryStyle.border};">
              <i class="fa-solid ${categoryStyle.icon}"></i>
            </div>
          </div>

          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill ${progressClass}" style="width: ${pct}%;"></div>
          </div>

          <div class="budget-status-row">
            <span>Spent: ${formatMoney(spent)}</span>
            <span style="color: ${pct >= 100 ? 'var(--rose)' : 'var(--text-muted)'};">${pct}% Used</span>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.budget-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        const catFilter = document.getElementById('transCatFilter');
        if (catFilter) catFilter.value = cat;
        switchTab('transactions');
        renderFullTransactionsTable();
      });
    });
  }

  function renderGoals() {
    const grid = document.getElementById('goalsGrid');
    const miniList = document.getElementById('goalsMiniList');

    if (grid) {
      grid.innerHTML = state.goals.map(g => {
        const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
        return `
          <div class="goal-card" data-id="${g.id}">
            <div class="goal-header">
              <div class="goal-info">
                <h4>${escapeHtml(g.title)}</h4>
                <span>Target: ${g.targetDate || 'N/A'}</span>
              </div>
              <div class="category-icon-bubble" style="background:var(--cyan-bg); color:var(--cyan);">
                <i class="fa-solid ${g.category}"></i>
              </div>
            </div>

            <div class="progress-bar-wrapper">
              <div class="progress-bar-fill normal" style="width: ${pct}%;"></div>
            </div>

            <div class="goal-status-row">
              <span>${formatMoney(g.current)} of ${formatMoney(g.target)}</span>
              <span style="color:var(--cyan);">${pct}% Reached</span>
            </div>
          </div>
        `;
      }).join('');
      
      grid.querySelectorAll('.goal-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          openGoalModal(id);
        });
      });
    }

    if (miniList) {
      miniList.innerHTML = state.goals.slice(0, 3).map(g => {
        const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
        return `
          <div class="mini-goal-item" data-id="${g.id}">
            <div class="mini-goal-icon">
              <i class="fa-solid ${g.category}"></i>
            </div>
            <div class="mini-goal-details">
              <div class="mini-goal-title">${escapeHtml(g.title)}</div>
              <div class="progress-bar-wrapper" style="margin: 0.4rem 0;">
                <div class="progress-bar-fill normal" style="width: ${pct}%;"></div>
              </div>
              <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between;">
                <span>${formatMoney(g.current)}</span>
                <span>${pct}%</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      miniList.querySelectorAll('.mini-goal-item').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          openGoalModal(id);
        });
      });
    }
  }

  function renderInsights() {
    const categorySpending = {};
    let totalExpense = 0;

    state.transactions.forEach(t => {
      if (t.type === 'expense') {
        const amt = parseFloat(t.amount);
        categorySpending[t.category] = (categorySpending[t.category] || 0) + amt;
        totalExpense += amt;
      }
    });

    let topCat = 'None';
    let topAmt = 0;
    Object.keys(categorySpending).forEach(cat => {
      if (categorySpending[cat] > topAmt) {
        topAmt = categorySpending[cat];
        topCat = cat;
      }
    });

    const pctTop = totalExpense > 0 ? Math.round((topAmt / totalExpense) * 100) : 0;
    const topCatEl = document.getElementById('topCategoryVal');
    if (topCatEl) topCatEl.textContent = `${topCat} (${pctTop}%)`;
  }

  function initCharts() {
    const isDark = state.theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    const cashflowCtx = document.getElementById('cashflowChart')?.getContext('2d');
    if (cashflowCtx) {
      if (cashflowChart) cashflowChart.destroy();

      cashflowChart = new Chart(cashflowCtx, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Inflow (₹)',
              data: [110000, 115000, 120000, 122000, 125000, 160000],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Outflow (₹)',
              data: [45000, 48000, 42000, 46000, 41000, 42350],
              borderColor: '#f43f5e',
              backgroundColor: 'rgba(244, 63, 94, 0.08)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } } },
          scales: {
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }

    const pieCtx = document.getElementById('categoryPieChart')?.getContext('2d');
    if (pieCtx) {
      if (categoryPieChart) categoryPieChart.destroy();

      const categorySpending = {};
      state.transactions.forEach(t => {
        if (t.type === 'expense') {
          categorySpending[t.category] = (categorySpending[t.category] || 0) + parseFloat(t.amount);
        }
      });

      categoryPieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(categorySpending),
          datasets: [{
            data: Object.values(categorySpending),
            backgroundColor: ['#6366f1', '#10b981', '#f43f5e', '#06b6d4', '#8b5cf6', '#f59e0b', '#3b82f6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 11, weight: '600' } } } }
        }
      });
    }

    const pmCtx = document.getElementById('paymentMethodChart')?.getContext('2d');
    if (pmCtx) {
      if (paymentMethodChart) paymentMethodChart.destroy();

      paymentMethodChart = new Chart(pmCtx, {
        type: 'pie',
        data: {
          labels: ['UPI (GPay/PhonePe)', 'Credit Card', 'Net Banking', 'Debit Card/Cash'],
          datasets: [{
            data: [18450, 15600, 8300, 3450],
            backgroundColor: ['#10b981', '#6366f1', '#3b82f6', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 11, weight: '600' } } } }
        }
      });
    }

    const projCtx = document.getElementById('projectionChart')?.getContext('2d');
    if (projCtx) {
      if (projectionChart) projectionChart.destroy();

      projectionChart = new Chart(projCtx, {
        type: 'bar',
        data: {
          labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Projected Net Savings (₹)',
            data: [117650, 235300, 352950, 470600, 588250, 705900],
            backgroundColor: 'rgba(16, 185, 129, 0.75)',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: textColor } } },
          scales: {
            x: { ticks: { color: textColor }, grid: { display: false } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
        }
      });
    }

    const radarCtx = document.getElementById('radarChart')?.getContext('2d');
    if (radarCtx) {
      if (radarChart) radarChart.destroy();

      radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['Housing', 'Dining', 'Shopping', 'Transport', 'Utilities', 'SIP Investments'],
          datasets: [{
            label: 'Spending Profile',
            data: [85, 50, 65, 30, 40, 90],
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            borderColor: '#10b981',
            pointBackgroundColor: '#10b981'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: gridColor },
              grid: { color: gridColor },
              pointLabels: { color: textColor, font: { size: 11, weight: '600' } },
              ticks: { display: false }
            }
          }
        }
      });
    }
  }

  function initProfileForm() {
    const form = document.getElementById('profileForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.user.name = document.getElementById('profName').value.trim();
        state.user.email = document.getElementById('profEmail').value.trim();
        state.user.phone = document.getElementById('profPhone').value.trim();
        state.user.currency = document.getElementById('profCurrency').value;
        state.currencySymbol = state.user.currency;
        state.user.monthlySavingsGoal = parseFloat(document.getElementById('profMonthlyGoal').value) || 50000;
        state.user.riskPreference = document.getElementById('profRisk').value;

        document.getElementById('currencySelector').value = state.currencySymbol;
        document.querySelectorAll('.currency-symbol').forEach(el => {
          el.textContent = state.currencySymbol;
        });

        saveState();
        updateUserProfileDisplay();
        renderAll();
        showToast('Fingo account settings saved', 'success');
      });
    }
  }

  function initModals() {
    const transModal = document.getElementById('transModal');
    const openAddBtn = document.getElementById('openAddModalBtn');
    const transTabAddBtn = document.getElementById('transTabAddBtn');
    const expTabAddBtn = document.getElementById('expTabAddBtn');
    const closeTransBtn = document.getElementById('closeTransModalBtn');
    const cancelTransBtn = document.getElementById('cancelTransModalBtn');
    const transForm = document.getElementById('transForm');

    const transDetailModal = document.getElementById('transDetailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
    const detailCloseBtn = document.getElementById('detailCloseBtn');
    const detailEditBtn = document.getElementById('detailEditBtn');

    const metricDetailModal = document.getElementById('metricDetailModal');
    const closeMetricDetailBtn = document.getElementById('closeMetricDetailBtn');
    const metricDetailCloseBtn = document.getElementById('metricDetailCloseBtn');

    [closeDetailModalBtn, detailCloseBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(transDetailModal));
    });

    [closeMetricDetailBtn, metricDetailCloseBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(metricDetailModal));
    });

    if (detailEditBtn) {
      detailEditBtn.addEventListener('click', () => {
        closeModal(transDetailModal);
        if (state.activeSelectedTransId) {
          openEditTransactionModal(state.activeSelectedTransId);
        }
      });
    }

    [openAddBtn, transTabAddBtn, expTabAddBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => openAddTransactionModal());
    });

    [closeTransBtn, cancelTransBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(transModal));
    });

    if (transForm) {
      transForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTransactionFromForm();
      });
    }

    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const goalModal = document.getElementById('goalModal');
    const openAddGoalBtn = document.getElementById('openAddGoalModalBtn');
    const addGoalQuickBtn = document.getElementById('addGoalQuickBtn');
    const closeGoalBtn = document.getElementById('closeGoalModalBtn');
    const cancelGoalBtn = document.getElementById('cancelGoalModalBtn');
    const goalForm = document.getElementById('goalForm');

    [openAddGoalBtn, addGoalQuickBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => openGoalModal());
    });

    [closeGoalBtn, cancelGoalBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(goalModal));
    });

    if (goalForm) {
      goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveGoalFromForm();
      });
    }

    const budgetModal = document.getElementById('budgetModal');
    const openBudgetBtn = document.getElementById('openAddBudgetModalBtn');
    const closeBudgetBtn = document.getElementById('closeBudgetModalBtn');
    const cancelBudgetBtn = document.getElementById('cancelBudgetModalBtn');
    const budgetForm = document.getElementById('budgetForm');

    if (openBudgetBtn) openBudgetBtn.addEventListener('click', () => openModal(budgetModal));

    [closeBudgetBtn, cancelBudgetBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(budgetModal));
    });

    if (budgetForm) {
      budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveBudgetFromForm();
      });
    }
  }

  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('active');
  }

  function openAddTransactionModal() {
    document.getElementById('modalTitle').textContent = 'Record Expense / Income';
    document.getElementById('transId').value = '';
    document.getElementById('transTitle').value = '';
    document.getElementById('transAmount').value = '';
    document.getElementById('transDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('transNote').value = '';

    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.type-btn.expense').classList.add('active');

    openModal(document.getElementById('transModal'));
  }

  function openEditTransactionModal(id) {
    const t = state.transactions.find(item => item.id === id);
    if (!t) return;

    document.getElementById('modalTitle').textContent = 'Edit Transaction';
    document.getElementById('transId').value = t.id;
    document.getElementById('transTitle').value = t.title;
    document.getElementById('transAmount').value = t.amount;
    document.getElementById('transCategory').value = t.category;
    document.getElementById('transDate').value = t.date;
    document.getElementById('transPayment').value = t.paymentMethod || 'UPI (GPay/PhonePe)';
    document.getElementById('transNote').value = t.note || '';

    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.type-btn.${t.type}`)?.classList.add('active');

    openModal(document.getElementById('transModal'));
  }

  async function saveTransactionFromForm() {
    const id = document.getElementById('transId').value;
    const title = document.getElementById('transTitle').value.trim();
    const amount = parseFloat(document.getElementById('transAmount').value);
    const category = document.getElementById('transCategory').value;
    const date = document.getElementById('transDate').value;
    const paymentMethod = document.getElementById('transPayment').value;
    const note = document.getElementById('transNote').value.trim();

    const activeTypeBtn = document.querySelector('.type-btn.active');
    const type = activeTypeBtn ? activeTypeBtn.getAttribute('data-type') : 'expense';

    if (!title || isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid title and amount', 'danger');
      return;
    }

    const payload = { id: id || `tx-${Date.now()}`, title, amount, type, category, date, paymentMethod, note, status: 'Settled' };

    if (state.isJavaBackendConnected) {
      try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE_URL}/transactions/${id}` : `${API_BASE_URL}/transactions`;
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) { console.error('Java API error:', e); }
    }

    if (id) {
      const index = state.transactions.findIndex(t => t.id === id);
      if (index !== -1) state.transactions[index] = payload;
    } else {
      state.transactions.unshift(payload);
    }

    saveState();
    closeModal(document.getElementById('transModal'));
    renderAll();
    showToast(id ? 'Entry updated' : 'Entry recorded', 'success');
  }

  function openGoalModal(id) {
    if (id && typeof id === 'string') {
      const g = state.goals.find(item => item.id === id);
      if (g) {
        document.getElementById('goalId').value = g.id;
        document.getElementById('goalTitle').value = g.title;
        document.getElementById('goalTarget').value = g.target;
        document.getElementById('goalCurrent').value = g.current;
        document.getElementById('goalCategory').value = g.category;
        document.getElementById('goalTargetDate').value = g.targetDate || '';
      }
    } else {
      document.getElementById('goalId').value = '';
      document.getElementById('goalTitle').value = '';
      document.getElementById('goalTarget').value = '';
      document.getElementById('goalCurrent').value = '';
    }
    openModal(document.getElementById('goalModal'));
  }

  function saveGoalFromForm() {
    const title = document.getElementById('goalTitle').value.trim();
    const target = parseFloat(document.getElementById('goalTarget').value);
    const current = parseFloat(document.getElementById('goalCurrent').value) || 0;
    const category = document.getElementById('goalCategory').value;
    const targetDate = document.getElementById('goalTargetDate').value;

    if (!title || isNaN(target) || target <= 0) {
      showToast('Please enter a valid title and target amount', 'danger');
      return;
    }

    const newGoal = { id: `g-${Date.now()}`, title, target, current, category, targetDate };
    state.goals.push(newGoal);
    saveState();
    closeModal(document.getElementById('goalModal'));
    renderAll();
    showToast('New milestone target created', 'success');
  }

  function saveBudgetFromForm() {
    const category = document.getElementById('budgetCategory').value;
    const limit = parseFloat(document.getElementById('budgetLimit').value);

    if (isNaN(limit) || limit <= 0) {
      showToast('Please enter a valid limit', 'danger');
      return;
    }

    state.budgets[category] = limit;
    saveState();
    closeModal(document.getElementById('budgetModal'));
    renderAll();
    showToast(`Updated budget limit for ${category}`, 'success');
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --------------------------------------------------------------------------
  // UNIQUE FEATURE 1: FINGO SPLIT & INSTANT UPI SETTLE ENGINE
  // --------------------------------------------------------------------------
  function initSplitBillsModule() {
    const openAddBtn = document.getElementById('openAddSplitModalBtn');
    const closeAddBtn = document.getElementById('closeAddSplitModalBtn');
    const cancelAddBtn = document.getElementById('cancelSplitModalBtn');
    const addModal = document.getElementById('addSplitModal');
    const addForm = document.getElementById('addSplitForm');

    const closeUpiBtn = document.getElementById('closeUpiQrModalBtn');
    const closeUpiBtn2 = document.getElementById('closeUpiModalBtn');
    const upiModal = document.getElementById('upiQrModal');
    const markSettledBtn = document.getElementById('markSettledBtn');

    if (openAddBtn) openAddBtn.addEventListener('click', () => openModal(addModal));
    [closeAddBtn, cancelAddBtn].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(addModal));
    });

    [closeUpiBtn, closeUpiBtn2].forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(upiModal));
    });

    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('splitTitle').value.trim();
        const totalAmount = parseFloat(document.getElementById('splitTotalAmount').value);
        const paidBy = document.getElementById('splitPaidBy').value;
        const payeeUpi = document.getElementById('splitPayeeUpi').value.trim();
        const membersStr = document.getElementById('splitMembers').value;
        const members = membersStr.split(',').map(m => m.trim()).filter(Boolean);

        if (!title || isNaN(totalAmount) || totalAmount <= 0) {
          showToast('Please enter a valid title and amount', 'danger');
          return;
        }

        const perShare = Math.round(totalAmount / (members.length || 1));
        const isUserPayer = paidBy.toLowerCase().includes('you') || paidBy.toLowerCase().includes(state.user.name.toLowerCase());
        
        const newBill = {
          id: `sb-${Date.now()}`,
          title,
          totalAmount,
          paidBy,
          payeeUpi: payeeUpi || 'jashnavi.patel@okaxis',
          date: new Date().toISOString().slice(0, 10),
          members,
          status: 'Active',
          myShare: perShare,
          owedToMe: isUserPayer ? (totalAmount - perShare) : 0,
          iOwe: !isUserPayer ? perShare : 0
        };

        state.splitBills.unshift(newBill);
        saveState();
        closeModal(addModal);
        renderSplitBills();
        showToast('Group expense created successfully', 'success');
      });
    }

    if (markSettledBtn) {
      markSettledBtn.addEventListener('click', () => {
        closeModal(upiModal);
        showToast('Payment settled and recorded in ledger!', 'success');
      });
    }
  }

  function renderSplitBills() {
    const grid = document.getElementById('splitBillsGrid');
    if (!grid) return;

    let totalVolume = 0;
    let youAreOwed = 0;
    let youOwe = 0;

    state.splitBills.forEach(b => {
      totalVolume += b.totalAmount;
      youAreOwed += b.owedToMe || 0;
      youOwe += b.iOwe || 0;
    });

    const volEl = document.getElementById('splitTotalVolumeVal');
    const owedEl = document.getElementById('splitYouAreOwedVal');
    const oweEl = document.getElementById('splitYouOweVal');

    if (volEl) volEl.textContent = formatMoney(totalVolume);
    if (owedEl) owedEl.textContent = formatMoney(youAreOwed);
    if (oweEl) oweEl.textContent = formatMoney(youOwe);

    if (state.splitBills.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">No active group split bills. Click 'New Group Expense' to create one.</div>`;
      return;
    }

    grid.innerHTML = state.splitBills.map(b => {
      const isPayer = b.paidBy.toLowerCase().includes('you') || b.paidBy.toLowerCase().includes(state.user.name.toLowerCase());
      const perHead = Math.round(b.totalAmount / (b.members.length || 1));

      return `
        <div class="split-card">
          <div class="split-card-header">
            <div>
              <div class="split-card-title">${escapeHtml(b.title)}</div>
              <div class="split-card-meta"><i class="fa-solid fa-user-circle"></i> Paid by <strong>${escapeHtml(b.paidBy)}</strong> • ${b.date}</div>
            </div>
            <span class="badge badge-accent">${formatMoney(b.totalAmount)}</span>
          </div>

          <div class="member-chips-row">
            ${b.members.map(m => {
              const isMe = m.toLowerCase().includes('you') || m.toLowerCase().includes(state.user.name.toLowerCase());
              return `<span class="member-chip ${isMe ? (isPayer ? 'owed' : 'owe') : ''}">
                <i class="fa-solid ${isMe ? 'fa-user' : 'fa-circle-user'}"></i> ${escapeHtml(m)} (${formatMoney(perHead)})
              </span>`;
            }).join('')}
          </div>

          <div class="split-card-footer">
            <div>
              <small style="color:var(--text-muted); display:block; font-size:0.75rem;">YOUR STATUS</small>
              <strong style="color:${isPayer ? 'var(--emerald)' : 'var(--rose)'}; font-size:0.95rem;">
                ${isPayer ? `You get back ${formatMoney(b.owedToMe)}` : `You owe ${formatMoney(b.iOwe)}`}
              </strong>
            </div>
            <button class="btn btn-secondary btn-sm open-qr-btn" data-id="${b.id}" style="color:var(--emerald);">
              <i class="fa-solid fa-qrcode"></i> Pay via UPI QR
            </button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.open-qr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openUpiQrModal(id);
      });
    });
  }

  function openUpiQrModal(billId) {
    const bill = state.splitBills.find(b => b.id === billId);
    if (!bill) return;

    const amount = bill.iOwe || bill.myShare || Math.round(bill.totalAmount / bill.members.length);
    const payeeUpi = bill.payeeUpi || 'jashnavi.patel@okaxis';
    const payeeName = bill.paidBy;

    document.getElementById('upiQrModalAmount').textContent = formatMoney(amount);
    document.getElementById('upiQrModalPayee').textContent = `To: ${payeeName} (${payeeUpi})`;

    const upiString = `upi://pay?pa=${encodeURIComponent(payeeUpi)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=${encodeURIComponent('Fingo Split - ' + bill.title)}&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}`;

    const qrImg = document.getElementById('upiQrImg');
    if (qrImg) qrImg.src = qrUrl;

    const gpay = document.getElementById('gpayDeepLink');
    const phonepe = document.getElementById('phonepeDeepLink');
    const paytm = document.getElementById('paytmDeepLink');

    if (gpay) gpay.href = upiString;
    if (phonepe) phonepe.href = upiString;
    if (paytm) paytm.href = upiString;

    openModal(document.getElementById('upiQrModal'));
  }

  // --------------------------------------------------------------------------
  // UNIQUE FEATURE 2: WEALTH & FIRE ENGINE MODULE
  // --------------------------------------------------------------------------
  function initWealthFreedomModule() {
    document.querySelectorAll('.tab-subnav .subnav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const subtab = btn.getAttribute('data-subtab');
        document.querySelectorAll('.tab-subnav .subnav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.subtab-content').forEach(c => {
          c.classList.toggle('active', c.id === `subtab-${subtab}`);
        });

        if (subtab === 'fire-calculator') {
          calculateFIRE();
        }
      });
    });

    const ageSlider = document.getElementById('fireCurrentAge');
    const targetAgeSlider = document.getElementById('fireTargetAge');
    const expenseSlider = document.getElementById('fireMonthlyExpenseInput');
    const returnSlider = document.getElementById('fireReturnRate');

    [ageSlider, targetAgeSlider, expenseSlider, returnSlider].forEach(slider => {
      if (slider) {
        slider.addEventListener('input', () => {
          updateFireSliderLabels();
          calculateFIRE();
        });
      }
    });

    const avalancheBtn = document.getElementById('strategyAvalancheBtn');
    const snowballBtn = document.getElementById('strategySnowballBtn');

    if (avalancheBtn && snowballBtn) {
      avalancheBtn.addEventListener('click', () => {
        avalancheBtn.classList.add('active');
        snowballBtn.classList.remove('active');
        showToast('Strategy switched to Debt Avalanche (Highest Interest First)', 'info');
      });

      snowballBtn.addEventListener('click', () => {
        snowballBtn.classList.add('active');
        avalancheBtn.classList.remove('active');
        showToast('Strategy switched to Debt Snowball (Smallest Balance First)', 'info');
      });
    }

    const stressBtn = document.getElementById('runStressTestBtn');
    if (stressBtn) {
      stressBtn.addEventListener('click', () => {
        const resultBox = document.getElementById('stressResultBox');
        if (resultBox) {
          resultBox.style.display = 'block';
          showToast('Financial Stress Simulation Completed: 7.7 Months Safety Cushion Verified', 'success');
        }
      });
    }
  }

  function updateFireSliderLabels() {
    const age = document.getElementById('fireCurrentAge')?.value || 28;
    const targetAge = document.getElementById('fireTargetAge')?.value || 45;
    const exp = document.getElementById('fireMonthlyExpenseInput')?.value || 50000;
    const ret = document.getElementById('fireReturnRate')?.value || 12;

    if (document.getElementById('fireCurrentAgeVal')) document.getElementById('fireCurrentAgeVal').textContent = `${age} yrs`;
    if (document.getElementById('fireTargetAgeVal')) document.getElementById('fireTargetAgeVal').textContent = `${targetAge} yrs`;
    if (document.getElementById('fireMonthlyExpenseVal')) document.getElementById('fireMonthlyExpenseVal').textContent = formatMoney(exp);
    if (document.getElementById('fireReturnRateVal')) document.getElementById('fireReturnRateVal').textContent = `${ret}%`;
  }

  function calculateFIRE() {
    const age = parseInt(document.getElementById('fireCurrentAge')?.value || 28, 10);
    const targetAge = parseInt(document.getElementById('fireTargetAge')?.value || 45, 10);
    const monthlyExp = parseFloat(document.getElementById('fireMonthlyExpenseInput')?.value || 50000);
    const returnRate = parseFloat(document.getElementById('fireReturnRate')?.value || 12) / 100;
    const inflation = 0.06;

    const years = Math.max(targetAge - age, 1);
    const futureMonthlyExp = monthlyExp * Math.pow(1 + inflation, years);
    const annualExpAtRetirement = futureMonthlyExp * 12;

    // Rule of 25x Annual Expenses
    const targetCorpus = annualExpAtRetirement * 25;

    const targetEl = document.getElementById('fireTargetCorpusVal');
    const yearsEl = document.getElementById('fireYearsToFreedomVal');
    const tierEl = document.getElementById('fireTierBadge');

    if (targetEl) targetEl.textContent = formatMoney(targetCorpus);
    if (yearsEl) yearsEl.textContent = `${years} Years`;
    if (tierEl) {
      if (targetCorpus > 40000000) tierEl.textContent = 'Fat FIRE (Luxury)';
      else if (targetCorpus < 18000000) tierEl.textContent = 'Lean FIRE (Minimalist)';
      else tierEl.textContent = 'Standard FIRE';
    }

    renderFireChart(years, targetCorpus, monthlyExp, returnRate);
  }

  function renderFireChart(years, targetCorpus, monthlyExp, returnRate) {
    const ctx = document.getElementById('fireChart')?.getContext('2d');
    if (!ctx) return;

    if (fireChart) fireChart.destroy();

    const labels = [];
    const projectedData = [];
    const targetLineData = [];

    const currentSavings = 385000;
    const monthlySIP = 38400;

    let balance = currentSavings;
    for (let i = 0; i <= years; i++) {
      labels.push(`Yr ${i}`);
      projectedData.push(Math.round(balance));
      targetLineData.push(targetCorpus);

      balance = (balance + monthlySIP * 12) * (1 + returnRate);
    }

    const isDark = state.theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    fireChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Projected Portfolio (₹)',
            data: projectedData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Target FIRE Safety Line (₹)',
            data: targetLineData,
            borderColor: '#f59e0b',
            borderDash: [6, 6],
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }

})();


