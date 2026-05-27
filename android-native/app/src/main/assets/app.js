const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const STORAGE_KEY = "personal-finance-mvp-v2";
const THEME_STORAGE_KEY = "personal-finance-theme";
const VALUES_HIDDEN_KEY = "personal-finance-values-hidden";

const categoryTypes = {
  income: "Receita",
  expense: "Despesa",
  both: "Receita e despesa",
};

const paymentMethods = {
  Dinheiro: "Dinheiro",
  Pix: "Pix",
  Debito: "Debito",
};

const categoryKeywords = [
  { words: ["ifood", "mercado", "restaurante", "extra", "padaria"], categoryId: "cat-food" },
  { words: ["uber", "99", "posto", "combustivel"], categoryId: "cat-transport" },
  { words: ["netflix", "spotify", "prime", "assinatura"], categoryId: "cat-bills" },
  { words: ["farmacia", "drogaria", "saude"], categoryId: "cat-health" },
  { words: ["curso", "faculdade", "livro"], categoryId: "cat-study" },
];

const bankOptions = [
  { id: "nubank", name: "Nubank", initials: "Nu", className: "bank-nubank", domain: "nubank.com.br" },
  { id: "inter", name: "Inter", initials: "In", className: "bank-inter", domain: "inter.co" },
  { id: "itau", name: "Itau", initials: "It", className: "bank-itau", domain: "itau.com.br" },
  { id: "bradesco", name: "Bradesco", initials: "Br", className: "bank-bradesco", domain: "bradesco.com.br" },
  { id: "santander", name: "Santander", initials: "St", className: "bank-santander", domain: "santander.com.br" },
  { id: "bb", name: "Banco do Brasil", initials: "BB", className: "bank-bb", domain: "bb.com.br" },
  { id: "caixa", name: "Caixa", initials: "Cx", className: "bank-caixa", domain: "caixa.gov.br" },
  { id: "c6", name: "C6 Bank", initials: "C6", className: "bank-c6", domain: "c6bank.com.br" },
  { id: "picpay", name: "PicPay", initials: "PP", className: "bank-picpay", domain: "picpay.com" },
  { id: "other", name: "Outro banco", initials: "BK", className: "bank-other", domain: "" },
];

const brandOptions = [
  { id: "mastercard", name: "Mastercard", initials: "MC", className: "brand-mastercard", domain: "mastercard.com" },
  { id: "visa", name: "Visa", initials: "VISA", className: "brand-visa", domain: "visa.com" },
  { id: "elo", name: "Elo", initials: "ELO", className: "brand-elo", domain: "elo.com.br" },
  { id: "amex", name: "American Express", initials: "AMEX", className: "brand-amex", domain: "americanexpress.com" },
  { id: "hipercard", name: "Hipercard", initials: "HC", className: "brand-hipercard", domain: "hipercard.com.br" },
  { id: "other", name: "Outra bandeira", initials: "CC", className: "brand-other", domain: "" },
];

const defaultCategories = [
  { id: "cat-salary", name: "Salario", type: "income", locked: true },
  { id: "cat-freela", name: "Freelas", type: "income", locked: true },
  { id: "cat-refund", name: "Reembolsos", type: "income", locked: true },
  { id: "cat-other-income", name: "Outras rendas", type: "income", locked: true },
  { id: "cat-food", name: "Alimentacao", type: "expense", locked: true },
  { id: "cat-transport", name: "Transporte", type: "expense", locked: true },
  { id: "cat-market", name: "Mercado", type: "expense", locked: true },
  { id: "cat-leisure", name: "Lazer", type: "expense", locked: true },
  { id: "cat-bills", name: "Contas fixas", type: "expense", locked: true },
  { id: "cat-health", name: "Saude", type: "expense", locked: true },
  { id: "cat-study", name: "Estudos", type: "expense", locked: true },
  { id: "cat-other-expense", name: "Outros", type: "expense", locked: true },
];

const els = {
  themeToggle: document.querySelector("#themeToggle"),
  themeToggleLabel: document.querySelector("#themeToggleLabel"),
  themeToggleProfile: document.querySelector("#themeToggleProfile"),
  themeProfileLabel: document.querySelector("#themeProfileLabel"),
  appTitle: document.querySelector("#appTitle"),
  screenSubtitle: document.querySelector("#screenSubtitle"),
  monthStrip: document.querySelector("#monthStrip"),
  monthPicker: document.querySelector("#monthPicker"),
  dashboardMonth: document.querySelector("#dashboardMonth"),
  metricIncome: document.querySelector("#metricIncome"),
  metricExpenses: document.querySelector("#metricExpenses"),
  metricCards: document.querySelector("#metricCards"),
  metricBalance: document.querySelector("#metricBalance"),
  metricAvailable: document.querySelector("#metricAvailable"),
  metricProjectedBalance: document.querySelector("#metricProjectedBalance"),
  metricDailyBudget: document.querySelector("#metricDailyBudget"),
  metricFutureCommitments: document.querySelector("#metricFutureCommitments"),
  decisionCard: document.querySelector("#decisionCard"),
  financialCalendar: document.querySelector("#financialCalendar"),
  invoiceOverview: document.querySelector("#invoiceOverview"),
  dueList: document.querySelector("#dueList"),
  categorySummary: document.querySelector("#categorySummary"),
  recentActivity: document.querySelector("#recentActivity"),
  smartAlerts: document.querySelector("#smartAlerts"),
  cashBreakdown: document.querySelector("#cashBreakdown"),
  monthChart: document.querySelector("#monthChart"),
  transactionKindFilter: document.querySelector("#transactionKindFilter"),
  transactionSearch: document.querySelector("#transactionSearch"),
  transactionCategoryFilter: document.querySelector("#transactionCategoryFilter"),
  transactionPaymentFilter: document.querySelector("#transactionPaymentFilter"),
  transactionOrderFilter: document.querySelector("#transactionOrderFilter"),
  transactionMobileList: document.querySelector("#transactionMobileList"),
  quickAdd: document.querySelector("#quickAdd"),
  smsList: document.querySelector("#smsList"),
  smsPendingCount: document.querySelector("#smsPendingCount"),
  smsPermissionToggle: document.querySelector("#smsPermissionToggle"),
  incomeForm: document.querySelector("#incomeForm"),
  expenseForm: document.querySelector("#expenseForm"),
  purchaseForm: document.querySelector("#purchaseForm"),
  categoryForm: document.querySelector("#categoryForm"),
  budgetForm: document.querySelector("#budgetForm"),
  recurringForm: document.querySelector("#recurringForm"),
  toggleCategoryForm: document.querySelector("#toggleCategoryForm"),
  newCardButton: document.querySelector("#newCardButton"),
  newIncomeButton: document.querySelector("#newIncomeButton"),
  newExpenseButton: document.querySelector("#newExpenseButton"),
  newPurchaseButton: document.querySelector("#newPurchaseButton"),
  toggleCanBuyForm: document.querySelector("#toggleCanBuyForm"),
  toggleBudgetForm: document.querySelector("#toggleBudgetForm"),
  toggleRecurringForm: document.querySelector("#toggleRecurringForm"),
  globalActionMenu: document.querySelector("#globalActionMenu"),
  globalMenuPanel: document.querySelector("#globalMenuPanel"),
  globalMenuToggle: document.querySelector("#globalMenuToggle"),
  incomeList: document.querySelector("#incomeList"),
  expenseList: document.querySelector("#expenseList"),
  cardList: document.querySelector("#cardList"),
  cardDetailPanel: document.querySelector("#cardDetailPanel"),
  cardDetailContent: document.querySelector("#cardDetailContent"),
  purchaseList: document.querySelector("#purchaseList"),
  categoryCatalogPanel: document.querySelector("#categoryCatalogPanel"),
  categoryCatalogBody: document.querySelector("#categoryCatalogBody"),
  categoryCatalogCount: document.querySelector("#categoryCatalogCount"),
  categoryList: document.querySelector("#categoryList"),
  budgetList: document.querySelector("#budgetList"),
  recurringList: document.querySelector("#recurringList"),
  recurringCatalogPanel: document.querySelector("#recurringCatalogPanel"),
  recurringCatalogBody: document.querySelector("#recurringCatalogBody"),
  recurringCatalogCount: document.querySelector("#recurringCatalogCount"),
  recurringControlMonth: document.querySelector("#recurringControlMonth"),
  recurringControlSummary: document.querySelector("#recurringControlSummary"),
  recurringControlList: document.querySelector("#recurringControlList"),
  purchaseCardFilter: document.querySelector("#purchaseCardFilter"),
  canBuyForm: document.querySelector("#canBuyForm"),
  canBuyResult: document.querySelector("#canBuyResult"),
  canBuyCardFields: document.querySelectorAll("[data-can-buy-card-field]"),
  analysisHeader: document.querySelector("#analysisHeader"),
  analysisKpis: document.querySelector("#analysisKpis"),
  analysisEvolutionChart: document.querySelector("#analysisEvolutionChart"),
  analysisScore: document.querySelector("#analysisScore"),
  analysisIncreasedCategories: document.querySelector("#analysisIncreasedCategories"),
  analysisReducedCategories: document.querySelector("#analysisReducedCategories"),
  analysisHighlights: document.querySelector("#analysisHighlights"),
  analysisComparison: document.querySelector("#analysisComparison"),
  incomeListTotal: document.querySelector("#incomeListTotal"),
  expenseListTotal: document.querySelector("#expenseListTotal"),
  purchaseListTotal: document.querySelector("#purchaseListTotal"),
  installmentPreview: document.querySelector("#installmentPreview"),
  exportDataProfile: document.querySelector("#exportDataProfile"),
  toast: document.querySelector("#toast"),
};

let state = loadState();
let selectedMonth = getMonthKey(new Date());
let editingCardId = null;
let isCreatingCard = false;
let selectedCardId = null;
let cardDetailHidden = false;
let editingBudgetId = null;
let editingRecurringId = null;
let recurringCatalogOpen = false;
let categoryCatalogOpen = false;
let toastTimer = null;
let valuesHidden = localStorage.getItem(VALUES_HIDDEN_KEY) === "true";
let canBuyAnalysis = null;
const optionalForms = {
  income: false,
  expense: false,
  purchase: false,
  canBuy: false,
  category: false,
  budget: false,
  recurring: false,
};
const transactionFilters = {
  kind: "all",
  search: "",
  categoryId: "",
  paymentMethod: "",
  order: "date-desc",
};
let purchaseFilter = "current";
let purchaseCardFilter = "";

init();
registerServiceWorker();
setupNativeBridge();

function init() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "light");
  document.body.classList.toggle("values-hidden", valuesHidden);
  document.body.dataset.view = "dashboard";
  updateScreenTitle("dashboard");
  els.monthPicker.value = selectedMonth;
  setDefaultDates();
  bindEvents();
  render();
}

function bindEvents() {
  bindMoneyInputs();

  document.querySelectorAll(".nav-tab, [data-view-target]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view || button.dataset.viewTarget));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGlobalMenu();
  });
  els.themeToggle?.addEventListener("click", toggleTheme);
  els.themeToggleProfile.addEventListener("click", toggleTheme);

  document.querySelector("#prevMonth").addEventListener("click", () => shiftMonth(-1));
  document.querySelector("#nextMonth").addEventListener("click", () => shiftMonth(1));
  els.monthPicker.addEventListener("change", () => {
    selectedMonth = els.monthPicker.value || getMonthKey(new Date());
    render();
  });
  els.transactionKindFilter.addEventListener("click", handleTransactionKindFilter);
  els.transactionSearch.addEventListener("input", () => {
    transactionFilters.search = els.transactionSearch.value;
    renderTransactionsMobile();
  });
  els.transactionCategoryFilter.addEventListener("change", () => {
    transactionFilters.categoryId = els.transactionCategoryFilter.value;
    renderTransactionsMobile();
  });
  els.transactionPaymentFilter.addEventListener("change", () => {
    transactionFilters.paymentMethod = els.transactionPaymentFilter.value;
    renderTransactionsMobile();
  });
  els.transactionOrderFilter.addEventListener("change", () => {
    transactionFilters.order = els.transactionOrderFilter.value || "date-desc";
    renderTransactionsMobile();
  });

  els.incomeForm.addEventListener("submit", addIncome);
  els.expenseForm.addEventListener("submit", addExpense);
  els.budgetForm.addEventListener("submit", saveBudget);
  els.recurringForm.addEventListener("submit", saveRecurringExpense);
  els.smsPermissionToggle.addEventListener("click", toggleSmsPermission);
  els.newCardButton.addEventListener("click", startCardCreate);
  els.newIncomeButton.addEventListener("click", () => toggleOptionalForm("income"));
  els.newExpenseButton.addEventListener("click", () => toggleOptionalForm("expense"));
  els.newPurchaseButton.addEventListener("click", openPurchaseForSelectedCard);
  els.purchaseCardFilter.addEventListener("change", () => {
    purchaseCardFilter = els.purchaseCardFilter.value;
    renderPurchases();
  });
  els.canBuyForm.addEventListener("submit", analyzeCanBuy);
  els.canBuyForm.elements.paymentMethod.addEventListener("change", syncCanBuyPaymentFields);
  els.toggleCanBuyForm.addEventListener("click", handleCanBuyFormToggle);
  els.toggleCategoryForm.addEventListener("click", handleCategoryFormToggle);
  els.toggleBudgetForm.addEventListener("click", handleBudgetFormToggle);
  els.toggleRecurringForm.addEventListener("click", handleRecurringFormToggle);
  els.globalMenuToggle.addEventListener("click", toggleGlobalMenu);
  els.globalMenuPanel.addEventListener("click", handleGlobalMenuClick);
  els.cardList.addEventListener("submit", saveCardForm);
  els.cardList.addEventListener("input", handleCardFormInput);
  els.cardList.addEventListener("change", handleCardFormInput);
  bindCardStackDrag();
  els.purchaseForm.addEventListener("submit", addPurchase);
  els.categoryForm.addEventListener("submit", addCategory);

  ["amount", "installments", "date", "cardId"].forEach((field) => {
    els.purchaseForm.elements[field].addEventListener("input", renderInstallmentPreview);
    els.purchaseForm.elements[field].addEventListener("change", renderInstallmentPreview);
  });

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("click", closeQuickAddOnOutsideClick);
  document.addEventListener("click", closeGlobalMenuOnOutsideClick);
  document.querySelector("#exportData")?.addEventListener("click", exportData);
  els.exportDataProfile.addEventListener("click", exportData);
  document.querySelector("#importData").addEventListener("change", importData);
}

function bindMoneyInputs() {
  document.addEventListener("input", (event) => {
    const input = event.target.closest?.("[data-money-input]");
    if (!input) return;
    formatMoneyInput(input);
  }, true);

  document.addEventListener("blur", (event) => {
    const input = event.target.closest?.("[data-money-input]");
    if (!input || !input.value) return;
    formatMoneyInput(input);
  }, true);
}

function formatMoneyInput(input) {
  const digits = String(input.value || "").replace(/\D/g, "");
  if (!digits) {
    input.value = "";
    return;
  }
  input.value = BRL.format(Number(digits) / 100);
}

function setMoneyInputValue(input, value) {
  if (!input) return;
  const amount = toMoney(value);
  input.value = amount > 0 ? BRL.format(amount) : "";
}

function switchView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewName);
  });
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
  document.body.dataset.view = viewName;
  updateScreenTitle(viewName);
  closeQuickAdd();
  closeSidebar();
  closeGlobalMenu();
  syncOptionalForms();
  if (typeof window !== "undefined" && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function toggleOptionalForm(name, forceOpen) {
  optionalForms[name] = typeof forceOpen === "boolean" ? forceOpen : !optionalForms[name];
  syncOptionalForms(name);
}

function handleCanBuyFormToggle() {
  if (!optionalForms.canBuy) {
    resetCanBuyAdvisor();
    toggleOptionalForm("canBuy", true);
    return;
  }
  toggleOptionalForm("canBuy", false);
}

function handleCategoryFormToggle() {
  categoryCatalogOpen = true;
  if (!optionalForms.category) {
    els.categoryForm.reset();
  }
  toggleOptionalForm("category");
  renderCategories();
}

function syncOptionalForms(focusName = "") {
  const configs = {
    income: { form: els.incomeForm, button: els.newIncomeButton, open: "Fechar", closed: "Nova receita" },
    expense: { form: els.expenseForm, button: els.newExpenseButton, open: "Fechar", closed: "Nova despesa" },
    purchase: { form: els.purchaseForm, button: els.newPurchaseButton, open: "Fechar", closed: "Nova compra" },
    canBuy: { form: els.canBuyForm, button: els.toggleCanBuyForm, open: "Fechar", closed: canBuyAnalysis ? "Nova analise" : "Analisar compra" },
    category: { form: els.categoryForm, button: els.toggleCategoryForm, open: "Fechar", closed: "Adicionar categoria" },
    budget: { form: els.budgetForm, button: els.toggleBudgetForm, open: "Fechar", closed: "Adicionar meta" },
    recurring: { form: els.recurringForm, button: els.toggleRecurringForm, open: "Fechar", closed: "Adicionar gasto" },
  };

  Object.entries(configs).forEach(([name, config]) => {
    const open = Boolean(optionalForms[name]);
    config.form.hidden = !open;
    config.button.textContent = open ? config.open : config.closed;
    config.button.setAttribute("aria-expanded", String(open));
    if (name === "budget") syncBudgetFormMode();
    if (name === "recurring") syncRecurringFormMode();
    if (open && name === focusName) {
      requestAnimationFrame(() => {
        config.form.scrollIntoView({ behavior: "smooth", block: "center" });
        focusFirstFormField(config.form);
      });
    }
  });
}

function syncBudgetFormMode() {
  const submit = els.budgetForm.querySelector("button[type='submit']");
  if (submit) submit.textContent = editingBudgetId ? "Salvar alteracoes" : "Salvar meta";
}

function syncRecurringFormMode() {
  const submit = els.recurringForm.querySelector("button[type='submit']");
  if (submit) submit.textContent = editingRecurringId ? "Salvar alteracoes" : "Salvar recorrente";
  if (els.toggleRecurringForm) {
    els.toggleRecurringForm.textContent = optionalForms.recurring ? "Fechar" : "Adicionar gasto";
  }
}

function handleBudgetFormToggle() {
  if (optionalForms.budget) {
    cancelBudgetEdit();
    return;
  }
  editingBudgetId = null;
  els.budgetForm.reset();
  toggleOptionalForm("budget", true);
}

function handleRecurringFormToggle() {
  if (optionalForms.recurring) {
    cancelRecurringEdit();
    return;
  }
  editingRecurringId = null;
  els.recurringForm.reset();
  recurringCatalogOpen = true;
  toggleOptionalForm("recurring", true);
}

function toggleGlobalMenu(event) {
  event?.stopPropagation();
  const open = !els.globalActionMenu.classList.contains("open");
  els.globalActionMenu.classList.toggle("open", open);
  els.globalMenuPanel.hidden = !open;
  els.globalMenuToggle.setAttribute("aria-expanded", String(open));
}

function closeGlobalMenu() {
  els.globalActionMenu.classList.remove("open");
  els.globalMenuPanel.hidden = true;
  els.globalMenuToggle.setAttribute("aria-expanded", "false");
}

function closeGlobalMenuOnOutsideClick(event) {
  if (event.target.closest("#globalActionMenu")) return;
  closeGlobalMenu();
}

function handleGlobalMenuClick(event) {
  const actionButton = event.target.closest("[data-quick-action]");
  if (!actionButton) {
    if (event.target.closest("[data-view-target]")) closeGlobalMenu();
    return;
  }
  event.preventDefault();
  closeGlobalMenu();
  openQuickAction(actionButton.dataset.quickAction);
}

function openQuickAction(action) {
  const routes = {
    income: "income",
    expense: "expenses",
    purchase: "cards",
    recurring: "recurringControl",
  };
  const forms = {
    income: "income",
    expense: "expense",
    purchase: "purchase",
    recurring: "recurring",
  };
  switchView(routes[action] || "dashboard");
  if (action === "recurring") recurringCatalogOpen = true;
  toggleOptionalForm(forms[action], true);
}

function openPurchaseForSelectedCard() {
  toggleOptionalForm("purchase", true);
  const cardId = selectedCardId && state.cards.some((card) => card.id === selectedCardId)
    ? selectedCardId
    : state.cards[0]?.id;
  if (cardId) {
    els.purchaseForm.elements.cardId.value = cardId;
    renderInstallmentPreview();
  }
}

function toggleValuesVisibility() {
  valuesHidden = !valuesHidden;
  localStorage.setItem(VALUES_HIDDEN_KEY, String(valuesHidden));
  applyValueVisibility();
}

function applyValueVisibility() {
  document.body.classList.toggle("values-hidden", valuesHidden);
  document.querySelectorAll("[data-action='toggle-values']").forEach((button) => {
    button.setAttribute("aria-pressed", String(valuesHidden));
    button.setAttribute("aria-label", valuesHidden ? "Mostrar valores" : "Ocultar valores");
  });

  document.querySelectorAll(dashboardSensitiveSelectors().join(",")).forEach((element) => {
    if (valuesHidden && element.dataset.masked !== "true") {
      element.dataset.valueText = element.textContent;
      element.dataset.masked = "true";
      element.textContent = maskDashboardText(element.dataset.valueText);
    } else if (element.dataset.masked === "true") {
      element.textContent = element.dataset.valueText || element.textContent;
      element.dataset.masked = "false";
    }
  });
}

function dashboardSensitiveSelectors() {
  return [
    "#metricAvailable",
    "#metricIncome",
    "#metricExpenses",
    "#metricCards",
    "#metricBalance",
    "#metricProjectedBalance",
    "#metricDailyBudget",
    "#metricFutureCommitments",
    "#cashBreakdown strong",
    "#categorySummary .category-meta strong:last-child",
    "#dueList .amount-card",
    "#dueList .due-purchase-row strong",
    "#smartAlerts .alert-row div span",
    "#decisionCard p",
    "#financialCalendar .calendar-agenda strong",
    "#cardDetailContent .amount-card",
    "#cardDetailContent .card-detail-kpis strong",
    "#cardList .card-detail-kpis strong",
    "#cardList .card-detail-row > strong",
  ];
}

function maskDashboardText(text) {
  const value = cleanText(text);
  if (!value) return "";
  if (value.includes("R$")) return "R$ ****";
  return "****";
}

function updateScreenTitle(viewName) {
  const titles = {
    dashboard: "Ol\u00e1, Matheus \u{1F44B}",
    transactions: "Lancamentos",
    cards: "Cartoes",
    sms: "Mensagens",
    profile: "Perfil",
    canBuy: "Posso comprar?",
    recurringControl: "Contas recorrentes",
    calendar: "Calendario financeiro",
    analysis: "Analise mensal",
    income: "Nova receita",
    expenses: "Nova despesa",
    categories: "Categorias",
  };
  els.appTitle.textContent = titles[viewName] || "Controle Financeiro";
  els.screenSubtitle.textContent = viewName === "dashboard" ? "Controle Financeiro" : "Financas Pessoais";
  els.monthStrip.classList.toggle("hidden", ["cards", "sms", "profile", "canBuy", "recurringControl", "categories", "analysis"].includes(viewName));
}

function openSidebar() {
  closeGlobalMenu();
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
}

function handleTransactionKindFilter(event) {
  const button = event.target.closest("[data-kind]");
  if (!button) return;
  transactionFilters.kind = button.dataset.kind || "all";
  renderTransactionFilterState();
  renderTransactionsMobile();
}

function toggleQuickAdd() {
  const isOpen = !els.quickAdd.classList.contains("open");
  els.quickAdd.classList.toggle("open", isOpen);
  els.quickAdd.querySelector(".fab-button")?.setAttribute("aria-expanded", String(isOpen));
}

function closeQuickAdd() {
  els.quickAdd.classList.remove("open");
  els.quickAdd.querySelector(".fab-button")?.setAttribute("aria-expanded", "false");
}

function closeQuickAddOnOutsideClick(event) {
  if (event.target.closest("#quickAdd")) return;
  closeQuickAdd();
}

function bindCardStackDrag() {
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;

  els.cardList.addEventListener("pointerdown", (event) => {
    if (!els.cardList.classList.contains("card-stack")) return;
    if (event.target.closest("button, input, select, textarea")) return;
    isDragging = true;
    startX = event.clientX;
    startScroll = els.cardList.scrollLeft;
    els.cardList.classList.add("dragging");
    els.cardList.setPointerCapture?.(event.pointerId);
  });

  els.cardList.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    els.cardList.scrollLeft = startScroll - (event.clientX - startX);
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    els.cardList.addEventListener(eventName, () => {
      isDragging = false;
      els.cardList.classList.remove("dragging");
    });
  });
}

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = safeTheme;
  localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
  els.themeToggle?.setAttribute("aria-pressed", String(safeTheme === "dark"));
  els.themeToggleProfile?.setAttribute("aria-pressed", String(safeTheme === "dark"));
  els.themeToggleProfile?.setAttribute("title", safeTheme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro");
  if (els.themeToggleLabel) els.themeToggleLabel.textContent = safeTheme === "dark" ? "Tema claro" : "Tema escuro";
  if (els.themeProfileLabel) els.themeProfileLabel.textContent = safeTheme === "dark" ? "Escuro" : "Claro";
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", safeTheme === "dark" ? "#190019" : "#FBE4D8");
}

function shiftMonth(direction) {
  selectedMonth = addMonths(selectedMonth, direction);
  els.monthPicker.value = selectedMonth;
  render();
}

function addIncome(event) {
  event.preventDefault();
  const form = new FormData(els.incomeForm);
  const keep = {
    categoryId: form.get("categoryId"),
    status: form.get("status") || "received",
  };
  state.incomes.push({
    id: createId(),
    description: cleanText(form.get("description")),
    amount: toMoney(form.get("amount")),
    date: form.get("date"),
    categoryId: form.get("categoryId"),
    status: form.get("status") || "received",
  });
  persist();
  els.incomeForm.reset();
  setDefaultDates();
  render();
  restoreFormValues(els.incomeForm, keep);
  toggleOptionalForm("income", false);
  showToast("Receita adicionada.");
}

function addExpense(event) {
  event.preventDefault();
  const form = new FormData(els.expenseForm);
  const keep = {
    categoryId: form.get("categoryId"),
    paymentMethod: form.get("paymentMethod"),
  };
  state.expenses.push({
    id: createId(),
    description: cleanText(form.get("description")),
    amount: toMoney(form.get("amount")),
    date: form.get("date"),
    categoryId: form.get("categoryId"),
    paymentMethod: form.get("paymentMethod"),
  });
  persist();
  els.expenseForm.reset();
  setDefaultDates();
  render();
  restoreFormValues(els.expenseForm, keep);
  toggleOptionalForm("expense", false);
  showToast("Despesa adicionada.");
}

function saveCardForm(event) {
  event.preventDefault();
  const sourceForm = event.target.closest("[data-card-form]");
  if (!sourceForm) return;
  const form = new FormData(sourceForm);
  const cardId = form.get("id");
  const cardData = {
    id: cardId || createId(),
    bankId: form.get("bankId"),
    brandId: form.get("brandId"),
    name: cleanText(form.get("name")),
    lastDigits: cleanText(form.get("lastDigits")).slice(-4),
    limitTotal: toMoney(form.get("limitTotal")),
    closingDay: clampDayInput(form.get("closingDay")),
    dueDay: clampDayInput(form.get("dueDay")),
  };

  if (cardId) {
    state.cards = state.cards.map((card) => (card.id === cardId ? cardData : card));
  } else {
    state.cards.push(cardData);
  }

  persist();
  resetCardForm();
  render();
  showToast(cardId ? "Cartao atualizado." : "Cartao adicionado.");
}

function addPurchase(event) {
  event.preventDefault();
  const form = new FormData(els.purchaseForm);
  if (!state.cards.length) {
    alert("Cadastre um cartao antes de adicionar uma compra.");
    return;
  }
  const keep = {
    cardId: form.get("cardId"),
    categoryId: form.get("categoryId"),
    installments: "1",
  };
  const purchase = {
    id: createId(),
    description: cleanText(form.get("description")),
    amount: toMoney(form.get("amount")),
    date: form.get("date"),
    categoryId: form.get("categoryId"),
    cardId: form.get("cardId"),
    installments: Math.max(1, Number(form.get("installments")) || 1),
  };
  const card = state.cards.find((item) => item.id === purchase.cardId);
  const firstInvoiceMonth = card ? getFirstInvoiceMonth(purchase.date, card) : selectedMonth;
  state.purchases.push(purchase);
  persist();
  els.purchaseForm.reset();
  setDefaultDates();
  render();
  restoreFormValues(els.purchaseForm, keep);
  renderInstallmentPreview();
  toggleOptionalForm("purchase", false);
  showToast(`Compra adicionada na fatura de ${monthLabel(firstInvoiceMonth)}.`);
}

function analyzeCanBuy(event) {
  event.preventDefault();
  canBuyAnalysis = buildCanBuyAnalysis(new FormData(els.canBuyForm));
  renderCanBuyResult(canBuyAnalysis);
  toggleOptionalForm("canBuy", false);
}

function buildCanBuyAnalysis(form) {
  const input = {
    description: cleanText(form.get("description")) || "Nova compra",
    amount: toMoney(form.get("amount")),
    date: form.get("date") || todayInput(),
    categoryId: form.get("categoryId"),
    paymentMethod: form.get("paymentMethod") || "Cartao",
    cardId: form.get("cardId"),
    installments: Math.max(1, Number(form.get("installments")) || 1),
  };
  const isCard = input.paymentMethod === "Cartao";
  const referenceMonth = selectedMonth;
  const summary = getMonthlySummary(referenceMonth);
  const card = isCard ? state.cards.find((item) => item.id === input.cardId) : null;
  const schedule = isCard && card
    ? splitAmount(input.amount, input.installments).map((amount, index) => {
        const month = addMonths(getFirstInvoiceMonth(input.date, card), index);
        return { month, amount, number: index + 1, total: input.installments };
      })
    : [{ month: getMonthKey(input.date), amount: input.amount, number: 1, total: 1 }];
  const impactThisMonth = sumAmounts(schedule.filter((item) => item.month === referenceMonth).map((item) => item.amount));
  const invoiceImpact = isCard ? impactThisMonth : 0;
  const invoiceBefore = isCard && card ? getCardInvoiceTotal(card.id, referenceMonth) : 0;
  const invoiceAfter = invoiceBefore + invoiceImpact;
  const impactedInvoiceMonth = isCard ? (schedule[0]?.month || referenceMonth) : referenceMonth;
  const impactedInvoiceImpact = isCard ? sumAmounts(schedule.filter((item) => item.month === impactedInvoiceMonth).map((item) => item.amount)) : 0;
  const impactedInvoiceBefore = isCard && card ? getCardInvoiceTotal(card.id, impactedInvoiceMonth) : 0;
  const impactedInvoiceAfter = impactedInvoiceBefore + impactedInvoiceImpact;
  const cashImpact = isCard ? 0 : impactThisMonth;
  const availableAfter = summary.availableNow - (isCard ? invoiceImpact : cashImpact);
  const projectedAfter = summary.projectedBalance - impactThisMonth;
  const dailyAfter = projectedAfter > 0 ? projectedAfter / getRemainingDaysInMonth(referenceMonth) : 0;
  const budget = state.budgets.find((item) => item.categoryId === input.categoryId);
  const currentCategorySpend = summary.categoryTotals[input.categoryId] || 0;
  const categoryAfter = currentCategorySpend + impactThisMonth;
  const budgetPercentAfter = budget?.limit ? (categoryAfter / budget.limit) * 100 : 0;
  const openAmountAfter = isCard && card
    ? getCardOpenAmount(card.id, referenceMonth) + sumAmounts(schedule.filter((item) => item.month >= referenceMonth).map((item) => item.amount))
    : 0;
  const cardAvailableAfter = isCard && card ? card.limitTotal - openAmountAfter : null;
  const cardUsageAfter = isCard && card?.limitTotal ? (openAmountAfter / card.limitTotal) * 100 : 0;
  const reasons = [];
  let level = "safe";

  if (isCard && !card) {
    level = "danger";
    reasons.push("Cadastre um cartao antes de confirmar essa compra.");
  }
  if (projectedAfter < 0) {
    level = "danger";
    reasons.push(`Seu saldo previsto ficaria negativo em ${BRL.format(Math.abs(projectedAfter))}.`);
  }
  if (availableAfter < 0) {
    level = "danger";
    reasons.push(`Seu saldo disponivel ficaria negativo em ${BRL.format(Math.abs(availableAfter))}.`);
  }
  if (cardAvailableAfter !== null && cardAvailableAfter < 0) {
    level = "danger";
    reasons.push(`Essa compra passaria ${BRL.format(Math.abs(cardAvailableAfter))} do limite do cartao.`);
  }
  if (budget && budgetPercentAfter > 100) {
    level = "danger";
    reasons.push(`${getCategoryName(input.categoryId)} passaria de 100% da meta do mes.`);
  }

  if (level !== "danger") {
    if (budget && budgetPercentAfter >= 85) {
      level = "warning";
      reasons.push(`${getCategoryName(input.categoryId)} ficaria em ${Math.round(budgetPercentAfter)}% da meta.`);
    }
    if (cardUsageAfter >= 80) {
      level = "warning";
      reasons.push(`O cartao ficaria com ${Math.round(cardUsageAfter)}% do limite comprometido.`);
    }
    if (projectedAfter < Math.max(summary.incomeTotal * 0.08, input.amount * 1.5)) {
      level = "warning";
      reasons.push("A folga do mes ficaria pequena depois dessa compra.");
    }
    if (!reasons.length) {
      reasons.push("Mesmo com essa compra, seu saldo previsto continua positivo e o mes segue controlado.");
    }
  }

  const title = level === "safe"
    ? "Essa compra cabe no seu mes!"
    : level === "warning"
      ? "Essa compra cabe, mas pede cuidado."
      : "Melhor evitar essa compra agora.";

  return {
    level,
    risk: level === "safe" ? "Baixo" : level === "warning" ? "Medio" : "Alto",
    title,
    text: level === "safe"
      ? "Sua saude financeira esta preservada."
      : level === "warning"
        ? "Ela ainda pode caber, mas reduz sua margem de seguranca."
        : "O impacto deixa seu mes vulneravel.",
    reason: reasons[0],
    input,
    isCard,
    card,
    schedule,
    metrics: {
      referenceMonth,
      invoiceImpact,
      invoiceBefore,
      invoiceAfter,
      impactedInvoiceMonth,
      impactedInvoiceImpact,
      impactedInvoiceBefore,
      impactedInvoiceAfter,
      cashImpact,
      impactThisMonth,
      availableAfter,
      projectedAfter,
      dailyAfter,
      cardAvailableAfter,
      cardUsageAfter,
      currentCategorySpend,
      categoryAfter,
      budgetLimit: budget?.limit || 0,
      budgetPercentAfter,
    },
    canConfirm: !isCard || Boolean(card),
  };
}

function renderCanBuyResult(analysis) {
  if (!analysis) {
    els.canBuyResult.hidden = true;
    els.canBuyResult.innerHTML = "";
    return;
  }

  const invoicePreviewHtml = analysis.isCard
    ? `
      <article class="invoice-preview-card">
        <span>Fatura impactada${analysis.card ? ` - ${escapeHtml(analysis.card.name)}` : ""}</span>
        <strong>${BRL.format(analysis.metrics.impactedInvoiceBefore)}</strong>
        <div>
          <small>Com esta compra</small>
          <b>${BRL.format(analysis.metrics.impactedInvoiceAfter)}</b>
        </div>
        <div class="invoice-impact-footer">
          <em>${escapeHtml(monthLabel(analysis.metrics.impactedInvoiceMonth))}</em>
          <em>+ ${BRL.format(analysis.metrics.impactedInvoiceImpact)}</em>
        </div>
      </article>
    `
    : `<article><span>Impacto imediato</span><strong>+ ${BRL.format(analysis.metrics.cashImpact)}</strong></article>`;
  const scheduleRows = analysis.schedule
    .slice(0, 8)
    .map((item) => `
      <article>
        <span>${escapeHtml(monthLabel(item.month))}${analysis.isCard ? ` - ${item.number}/${item.total}` : ""}</span>
        <strong>+ ${BRL.format(item.amount)}</strong>
      </article>
    `)
    .join("");
  const moreSchedule = analysis.schedule.length > 8 ? `<small>Mais ${analysis.schedule.length - 8} parcelas futuras.</small>` : "";
  const budgetHtml = analysis.metrics.budgetLimit
    ? `
      <div class="can-buy-budget">
        <div>
          <span>Meta de ${escapeHtml(getCategoryName(analysis.input.categoryId))}</span>
          <strong>${Math.round(analysis.metrics.budgetPercentAfter)}%</strong>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width: ${Math.min(analysis.metrics.budgetPercentAfter, 100)}%"></div></div>
        <small>Depois da compra: ${BRL.format(analysis.metrics.categoryAfter)} de ${BRL.format(analysis.metrics.budgetLimit)}</small>
      </div>
    `
    : "";
  const cardLimitHtml = analysis.isCard && analysis.card
    ? `<article><span>Limite apos compra</span><strong>${BRL.format(analysis.metrics.cardAvailableAfter)}</strong></article>`
    : "";
  const summaryItems = [
    ["Compra", analysis.input.description],
    ["Valor", BRL.format(analysis.input.amount)],
    ["Data", formatDate(analysis.input.date)],
    ["Categoria", getCategoryName(analysis.input.categoryId)],
    ["Pagamento", analysis.isCard ? "Cartao de credito" : analysis.input.paymentMethod],
  ];
  if (analysis.isCard && analysis.card) {
    summaryItems.push(["Cartao", `${analysis.card.name} final ${analysis.card.lastDigits || "----"}`]);
    summaryItems.push(["Parcelas", `${analysis.input.installments}x de ${BRL.format(analysis.schedule[0]?.amount || 0)}`]);
  }
  const analyzedSummaryHtml = `
    <div class="can-buy-analysis-summary">
      <div>
        <strong>Resumo analisado</strong>
        <span>Dados fixos desta simulacao</span>
      </div>
      ${summaryItems.map(([label, value]) => `
        <article>
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </article>
      `).join("")}
    </div>
  `;

  els.canBuyResult.hidden = false;
  els.canBuyResult.className = `panel can-buy-result ${analysis.level}`;
  els.canBuyResult.innerHTML = `
    <div class="can-buy-verdict">
      <span>${escapeHtml(analysis.risk)}</span>
      <h2>${escapeHtml(analysis.title)}</h2>
      <p>${escapeHtml(analysis.text)}</p>
    </div>
    ${analyzedSummaryHtml}
    <div class="can-buy-reason">
      <strong>Motivo</strong>
      <span>${escapeHtml(analysis.reason)}</span>
    </div>
    <div class="can-buy-metrics">
      ${invoicePreviewHtml}
      <article><span>Saldo apos compra</span><strong>${BRL.format(analysis.metrics.availableAfter)}</strong></article>
      <article><span>Saldo previsto no fim do mes</span><strong>${BRL.format(analysis.metrics.projectedAfter)}</strong></article>
      <article><span>Disponivel por dia</span><strong>${BRL.format(analysis.metrics.dailyAfter)}</strong></article>
      ${cardLimitHtml}
    </div>
    ${budgetHtml}
    <div class="can-buy-schedule">
      <div>
        <strong>${analysis.isCard ? "Impacto por fatura" : "Impacto no mes"}</strong>
        <span>${escapeHtml(monthLabel(analysis.metrics.referenceMonth))}</span>
      </div>
      ${scheduleRows}
      ${moreSchedule}
    </div>
    <div class="can-buy-actions">
      <button class="primary-button" type="button" data-action="confirm-can-buy" ${analysis.canConfirm ? "" : "disabled"}>Sim, quero comprar</button>
      <button class="secondary-button" type="button" data-action="cancel-can-buy">Cancelar</button>
    </div>
  `;
  els.canBuyResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

function confirmCanBuyPurchase() {
  if (!canBuyAnalysis?.canConfirm) return;
  const { input, isCard } = canBuyAnalysis;
  if (isCard) {
    state.purchases.push({
      id: createId(),
      description: input.description,
      amount: input.amount,
      date: input.date,
      categoryId: input.categoryId,
      cardId: input.cardId,
      installments: input.installments,
    });
  } else {
    state.expenses.push({
      id: createId(),
      description: input.description,
      amount: input.amount,
      date: input.date,
      categoryId: input.categoryId,
      paymentMethod: input.paymentMethod,
    });
  }
  persist();
  resetCanBuyAdvisor();
  render();
  setDefaultDates();
  syncCanBuyPaymentFields();
  showToast(isCard ? "Compra salva no cartao." : "Despesa salva.");
}

function resetCanBuyAdvisor(resetForm = true) {
  canBuyAnalysis = null;
  if (resetForm) {
    els.canBuyForm.reset();
    setDefaultDates();
    syncCanBuyPaymentFields();
  }
  renderCanBuyResult(null);
}

function syncCanBuyPaymentFields() {
  const isCard = els.canBuyForm.elements.paymentMethod.value === "Cartao";
  els.canBuyCardFields.forEach((field) => {
    field.hidden = !isCard;
    field.querySelectorAll("select, input").forEach((input) => {
      input.required = isCard;
      input.disabled = !isCard;
    });
  });
  if (!isCard) els.canBuyForm.elements.installments.value = "1";
}

function addCategory(event) {
  event.preventDefault();
  const form = new FormData(els.categoryForm);
  const name = cleanText(form.get("name"));
  const alreadyExists = state.categories.some((category) => category.name.toLowerCase() === name.toLowerCase());
  if (alreadyExists) {
    alert("Essa categoria ja existe.");
    return;
  }
  state.categories.push({
    id: createId(),
    name,
    type: form.get("type"),
    locked: false,
  });
  persist();
  els.categoryForm.reset();
  optionalForms.category = false;
  categoryCatalogOpen = true;
  render();
  showToast("Categoria adicionada.");
}

function saveBudget(event) {
  event.preventDefault();
  const form = new FormData(els.budgetForm);
  const categoryId = form.get("categoryId");
  const limit = toMoney(form.get("limit"));
  const duplicate = state.budgets.find((budget) => budget.categoryId === categoryId && budget.id !== editingBudgetId);
  if (duplicate) {
    alert("Ja existe uma meta para essa categoria.");
    return;
  }
  if (editingBudgetId) {
    state.budgets = state.budgets.map((budget) => budget.id === editingBudgetId ? { ...budget, categoryId, limit } : budget);
  } else {
    state.budgets.push({ id: createId(), categoryId, limit });
  }
  persist();
  els.budgetForm.reset();
  editingBudgetId = null;
  render();
  toggleOptionalForm("budget", false);
  showToast("Meta salva.");
}

function saveRecurringExpense(event) {
  event.preventDefault();
  const form = new FormData(els.recurringForm);
  const payload = {
    description: cleanText(form.get("description")),
    amount: toMoney(form.get("amount")),
    dueDay: clampDayInput(form.get("dueDay")),
    categoryId: form.get("categoryId"),
    paymentMethod: form.get("paymentMethod"),
  };
  if (editingRecurringId) {
    state.recurringExpenses = state.recurringExpenses.map((item) => item.id === editingRecurringId ? { ...item, ...payload } : item);
  } else {
    state.recurringExpenses.push({
      id: createId(),
      ...payload,
      active: true,
    });
  }
  persist();
  els.recurringForm.reset();
  editingRecurringId = null;
  render();
  toggleOptionalForm("recurring", false);
  showToast("Gasto recorrente salvo.");
}

function toggleSmsPermission() {
  if (window.AndroidFinance?.openNotificationSettings) {
    window.AndroidFinance.openNotificationSettings();
    state.settings.smsEnabled = true;
    persist();
    renderSmsList();
    showToast("Ative o acesso as notificacoes do app.");
    return;
  }
  state.settings.smsEnabled = !state.settings.smsEnabled;
  persist();
  renderSmsList();
  showToast(state.settings.smsEnabled ? "Leitura ativada." : "Leitura desativada.");
}

function setupNativeBridge() {
  window.FinanceNativeBridge = {
    receiveFinancialEvent(payload) {
      try {
        const event = typeof payload === "string" ? JSON.parse(payload) : payload;
        addNativePendingEvent(event);
      } catch {
        showToast("Nao consegui ler a notificacao recebida.");
      }
    },
  };
}

function addNativePendingEvent(event) {
  const pending = normalizeNativeFinancialEvent(event);
  if (!pending.amount || !pending.rawMessage) return;
  const alreadyExists = state.pendingSms.some((item) => (
    item.rawMessage === pending.rawMessage
    && item.date === pending.date
    && Number(item.amount) === Number(pending.amount)
  ));
  if (alreadyExists) return;
  state.settings.smsEnabled = true;
  state.pendingSms.unshift(pending);
  persist();
  renderSmsList();
  showToast("Lancamento detectado. Revise antes de salvar.");
}

function normalizeNativeFinancialEvent(event = {}) {
  const bankId = event.bankId || "other";
  return {
    id: event.id || createId(),
    rawMessage: cleanText(event.rawMessage || event.message || ""),
    title: cleanText(event.title || getBankName(bankId)),
    bankId,
    amount: toMoney(event.amount),
    date: event.date || todayInput(),
    merchant: cleanText(event.merchant || event.establishment || "Lancamento detectado"),
    categoryId: event.categoryId || suggestCategory(event.merchant || event.rawMessage),
    type: event.type === "card" ? "card" : "cash",
    paymentMethod: event.paymentMethod || (event.type === "card" ? "Cartao" : "Pix"),
    cardLastDigits: cleanText(event.cardLastDigits || "").slice(-4),
    source: event.source || "android",
  };
}

function handleDocumentClick(event) {
  const viewTargetButton = event.target.closest("[data-view-target]");
  if (viewTargetButton) {
    switchView(viewTargetButton.dataset.viewTarget);
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.action === "toggle-quick-add") {
    toggleQuickAdd();
    return;
  }
  if (button.dataset.action === "toggle-global-menu") {
    toggleGlobalMenu(event);
    return;
  }
  if (button.dataset.action === "toggle-values") {
    toggleValuesVisibility();
    return;
  }
  if (button.dataset.action === "set-purchase-filter") {
    purchaseFilter = button.dataset.filter || "current";
    renderPurchases();
    return;
  }
  if (button.dataset.action === "confirm-can-buy") {
    confirmCanBuyPurchase();
    return;
  }
  if (button.dataset.action === "cancel-can-buy") {
    resetCanBuyAdvisor();
    showToast("Simulacao cancelada.");
    return;
  }
  if (button.dataset.action === "recurring-month-prev") {
    selectedMonth = addMonths(selectedMonth, -1);
    els.monthPicker.value = selectedMonth;
    render();
    return;
  }
  if (button.dataset.action === "recurring-month-next") {
    selectedMonth = addMonths(selectedMonth, 1);
    els.monthPicker.value = selectedMonth;
    render();
    return;
  }
  if (button.dataset.action === "toggle-recurring-catalog") {
    recurringCatalogOpen = !recurringCatalogOpen;
    if (!recurringCatalogOpen) cancelRecurringEdit();
    renderRecurringExpenses();
    return;
  }
  if (button.dataset.action === "toggle-category-catalog") {
    categoryCatalogOpen = !categoryCatalogOpen;
    renderCategories();
    return;
  }
  if (button.dataset.action === "analysis-month-prev") {
    shiftMonth(-1);
    return;
  }
  if (button.dataset.action === "analysis-month-next") {
    shiftMonth(1);
    return;
  }
  if (button.dataset.action === "mark-recurring-paid") {
    markRecurringPaid(id);
    showToast("Conta marcada como paga.");
    return;
  }
  if (button.dataset.action === "undo-recurring-paid") {
    undoRecurringPaid(id);
    showToast("Pagamento desfeito.");
    return;
  }
  if (button.dataset.action === "mark-invoice-paid") {
    markInvoicePaid(id);
    showToast("Fatura marcada como paga.");
    return;
  }
  if (button.dataset.action === "undo-invoice-paid") {
    undoInvoicePaid(id);
    showToast("Pagamento da fatura desfeito.");
    return;
  }
  if (button.dataset.action === "delete-income") {
    state.incomes = state.incomes.filter((item) => item.id !== id);
    showToast("Receita removida.");
  }
  if (button.dataset.action === "delete-expense") {
    state.expenses = state.expenses.filter((item) => item.id !== id);
    showToast("Despesa removida.");
  }
  if (button.dataset.action === "delete-purchase") {
    state.purchases = state.purchases.filter((item) => item.id !== id);
    showToast("Compra removida.");
  }
  if (button.dataset.action === "delete-card") {
    if (editingCardId === id) cancelCardEdit();
    if (selectedCardId === id) selectedCardId = null;
    if (state.purchases.some((purchase) => purchase.cardId === id)) {
      alert("Exclua as compras desse cartao antes de remover o cartao.");
      return;
    }
    state.cards = state.cards.filter((card) => card.id !== id);
    showToast("Cartao removido.");
  }
  if (button.dataset.action === "show-card-detail") {
    showCardDetail(id);
    return;
  }
  if (button.dataset.action === "close-card-detail") {
    cardDetailHidden = true;
    selectedCardId = null;
    renderCards();
    renderCardDetail();
    return;
  }
  if (button.dataset.action === "edit-card") {
    startCardEdit(id);
    return;
  }
  if (button.dataset.action === "new-card") {
    startCardCreate();
    return;
  }
  if (button.dataset.action === "cancel-card-form") {
    cancelCardEdit();
    return;
  }
  if (button.dataset.action === "delete-category") {
    const category = state.categories.find((item) => item.id === id);
    if (category?.locked) return;
    if (isCategoryInUse(id)) {
      alert("Essa categoria esta em uso e nao pode ser removida.");
      return;
    }
    state.categories = state.categories.filter((item) => item.id !== id);
    showToast("Categoria removida.");
  }
  if (button.dataset.action === "edit-budget") {
    startBudgetEdit(id);
    return;
  }
  if (button.dataset.action === "delete-budget") {
    if (editingBudgetId === id) cancelBudgetEdit();
    state.budgets = state.budgets.filter((budget) => budget.id !== id);
    showToast("Meta removida.");
  }
  if (button.dataset.action === "toggle-recurring") {
    state.recurringExpenses = state.recurringExpenses.map((item) => item.id === id ? { ...item, active: !item.active } : item);
    showToast("Recorrente atualizado.");
  }
  if (button.dataset.action === "edit-recurring") {
    startRecurringEdit(id);
    return;
  }
  if (button.dataset.action === "delete-recurring") {
    if (editingRecurringId === id) cancelRecurringEdit();
    state.recurringExpenses = state.recurringExpenses.filter((item) => item.id !== id);
    state.skippedRecurring = state.skippedRecurring.filter((key) => !key.startsWith(`${id}:`));
    state.recurringPayments = state.recurringPayments.filter((payment) => payment.recurringId !== id);
    showToast("Recorrente removido.");
  }
  if (button.dataset.action === "delete-recurring-occurrence") {
    skipRecurringOccurrence(id);
    showToast("Lancamento removido deste mes.");
  }
  if (button.dataset.action === "confirm-sms") {
    confirmPendingSms(id);
    showToast("Lancamento confirmado.");
  }
  if (button.dataset.action === "ignore-sms") {
    state.pendingSms = state.pendingSms.filter((item) => item.id !== id);
    showToast("SMS ignorado.");
  }
  if (button.dataset.action === "edit-sms") {
    const pending = state.pendingSms.find((item) => item.id === id);
    if (pending) {
      prefillFromPendingSms(pending);
      switchView(pending.type === "card" ? "cards" : "expenses");
      showToast("Dados preenchidos.");
    }
    return;
  }

  persist();
  render();
}

function startCardCreate() {
  isCreatingCard = true;
  editingCardId = null;
  switchView("cards");
  renderCards();
  scrollActiveCardForm();
}

function startCardEdit(id) {
  const card = state.cards.find((item) => item.id === id);
  if (!card) return;
  isCreatingCard = false;
  editingCardId = id;
  selectedCardId = id;
  cardDetailHidden = false;
  switchView("cards");
  renderCards();
  renderCardDetail();
  scrollActiveCardForm();
}

function cancelCardEdit() {
  resetCardForm();
  renderCards();
}

function resetCardForm() {
  editingCardId = null;
  isCreatingCard = false;
}

function startBudgetEdit(id) {
  const budget = state.budgets.find((item) => item.id === id);
  if (!budget) return;
  editingBudgetId = id;
  switchView("profile");
  els.budgetForm.elements.categoryId.value = budget.categoryId;
  setMoneyInputValue(els.budgetForm.elements.limit, budget.limit);
  toggleOptionalForm("budget", true);
}

function cancelBudgetEdit() {
  editingBudgetId = null;
  els.budgetForm.reset();
  toggleOptionalForm("budget", false);
}

function startRecurringEdit(id) {
  const recurring = state.recurringExpenses.find((item) => item.id === id);
  if (!recurring) return;
  editingRecurringId = id;
  recurringCatalogOpen = true;
  switchView("recurringControl");
  els.recurringForm.elements.description.value = recurring.description;
  setMoneyInputValue(els.recurringForm.elements.amount, recurring.amount);
  els.recurringForm.elements.dueDay.value = recurring.dueDay;
  els.recurringForm.elements.categoryId.value = recurring.categoryId;
  els.recurringForm.elements.paymentMethod.value = recurring.paymentMethod;
  toggleOptionalForm("recurring", true);
}

function cancelRecurringEdit() {
  editingRecurringId = null;
  els.recurringForm.reset();
  toggleOptionalForm("recurring", false);
}

function scrollActiveCardForm() {
  requestAnimationFrame(() => {
    document.querySelector("[data-card-form]")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function handleCardFormInput(event) {
  if (!["bankId", "brandId"].includes(event.target.name)) return;
  const form = event.target.closest("[data-card-form]");
  if (!form) return;
  updateInlineCardPreview(form);
}

function showCardDetail(id) {
  if (selectedCardId === id && !cardDetailHidden) {
    selectedCardId = null;
    cardDetailHidden = true;
  } else {
    selectedCardId = id;
    cardDetailHidden = false;
  }
  renderCards();
  renderCardDetail();
}

function confirmPendingSms(id) {
  const pending = state.pendingSms.find((item) => item.id === id);
  if (!pending) return;
  const card = pending.cardLastDigits ? state.cards.find((item) => item.lastDigits === pending.cardLastDigits) : null;

  if (pending.type === "card" && card) {
    state.purchases.push({
      id: createId(),
      description: pending.merchant,
      amount: pending.amount,
      date: pending.date,
      categoryId: pending.categoryId,
      cardId: card.id,
      installments: 1,
      source: "sms",
    });
  } else {
    state.expenses.push({
      id: createId(),
      description: pending.merchant,
      amount: pending.amount,
      date: pending.date,
      categoryId: pending.categoryId,
      paymentMethod: pending.paymentMethod || "Pix",
      source: "sms",
    });
  }

  state.pendingSms = state.pendingSms.filter((item) => item.id !== id);
}

function prefillFromPendingSms(pending) {
  if (pending.type === "card") {
    toggleOptionalForm("purchase", true);
    const card = pending.cardLastDigits ? state.cards.find((item) => item.lastDigits === pending.cardLastDigits) : state.cards[0];
    restoreFormValues(els.purchaseForm, {
      description: pending.merchant,
      amount: pending.amount,
      date: pending.date,
      categoryId: pending.categoryId,
      cardId: card?.id || "",
      installments: "1",
    });
    renderInstallmentPreview();
    return;
  }

  restoreFormValues(els.expenseForm, {
    description: pending.merchant,
    amount: pending.amount,
    date: pending.date,
    categoryId: pending.categoryId,
    paymentMethod: pending.paymentMethod || "Pix",
  });
}

function render() {
  state = normalizeState(state);
  syncOptionalForms();
  renderCategoryOptions();
  renderDashboard();
  renderMonthChart();
  renderTransactionsMobile();
  renderIncome();
  renderExpenses();
  renderCards();
  renderCardDetail();
  renderPurchases();
  renderCategories();
  renderBudgets();
  renderRecurringExpenses();
  renderRecurringControl();
  renderAnalysis();
  renderSmsList();
  renderInstallmentPreview();
}

function renderDashboard() {
  const summary = getMonthlySummary(selectedMonth);
  els.dashboardMonth.textContent = monthLabel(selectedMonth);
  els.metricIncome.textContent = BRL.format(summary.receivedIncomeTotal + summary.plannedIncomeTotal);
  els.metricExpenses.textContent = BRL.format(summary.expenseTotal);
  els.metricCards.textContent = BRL.format(summary.cardTotal);
  els.metricBalance.textContent = BRL.format(summary.projectedBalance);
  els.metricAvailable.textContent = BRL.format(summary.availableNow);
  els.metricProjectedBalance.textContent = BRL.format(summary.projectedBalance);
  els.metricDailyBudget.textContent = BRL.format(summary.dailyAvailable);
  els.metricFutureCommitments.textContent = BRL.format(summary.futureCommitments);
  els.metricBalance.classList.toggle("amount-expense", summary.projectedBalance < 0);
  els.metricAvailable.classList.toggle("amount-expense", summary.availableNow < 0);
  renderCashBreakdown(summary);
  renderSmartAlerts(summary);
  renderDecisionCard(summary);
  renderFinancialCalendar(summary);
  renderInvoiceOverview(summary);
  renderDueList(summary);
  renderCategorySummary(summary);
  renderRecentActivity(summary);
  applyValueVisibility();
}

function renderDecisionCard(summary) {
  const status = getFinancialStatus(summary);
  els.decisionCard.className = `decision-card ${status.level}`;
  els.decisionCard.innerHTML = `
    <div>
      <span>${escapeHtml(status.label)}</span>
      <strong>${escapeHtml(status.title)}</strong>
      <p>${highlightMoneyText(status.text)}</p>
    </div>
    <button class="text-button" type="button" data-view-target="${escapeHtml(status.target)}">${escapeHtml(status.action)}</button>
  `;
}

function highlightMoneyText(text) {
  return escapeHtml(text).replace(/R\$\s?[\d.]+,\d{2}/g, (match) => `<strong class="decision-money">${match}</strong>`);
}

function renderFinancialCalendar(summary) {
  const [year, monthNumber] = selectedMonth.split("-").map(Number);
  const days = new Date(year, monthNumber, 0).getDate();
  const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
  const today = todayInput();
  const todayParts = parseDateParts(today);
  const currentMonth = getMonthKey(today);
  const events = buildFinancialCalendarEvents(summary);
  const eventsByDay = events.reduce((groups, event) => {
    groups[event.day] = groups[event.day] || [];
    groups[event.day].push(event);
    return groups;
  }, {});

  const blanks = Array.from({ length: firstWeekday }, () => `<span class="calendar-day empty"></span>`).join("");
  const dayCells = Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const dayEvents = eventsByDay[day] || [];
    const isToday = selectedMonth === currentMonth && day === todayParts.day;
    const dots = dayEvents.slice(0, 3).map((event) => `<i class="${escapeHtml(event.type)}"></i>`).join("");
    return `
      <article class="calendar-day ${isToday ? "today" : ""} ${dayEvents.length ? "has-events" : ""}">
        <strong>${day}</strong>
        <span>${dots}</span>
      </article>
    `;
  }).join("");

  const agenda = events
    .filter((event) => selectedMonth !== currentMonth || event.date >= today)
    .slice(0, 5);

  els.financialCalendar.innerHTML = `
    <div class="calendar-legend">
      <span><i class="income"></i>Receitas</span>
      <span><i class="expense"></i>Vencimentos</span>
      <span><i class="card"></i>Faturas</span>
    </div>
    <div class="calendar-weekdays" aria-hidden="true">
      <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
    </div>
    <div class="calendar-grid">${blanks}${dayCells}</div>
    <div class="calendar-agenda">
      ${agenda.length ? agenda.map(calendarAgendaRow).join("") : emptyState("Sem vencimentos futuros neste mes.")}
    </div>
  `;
}

function buildFinancialCalendarEvents(summary) {
  const invoiceEvents = state.cards
    .map((card) => {
      const total = getCardInvoiceTotal(card.id, selectedMonth);
      const date = getInvoiceDueDate(selectedMonth, card.dueDay);
      return total > 0 ? {
        type: "card",
        date,
        day: parseDateParts(date).day,
        title: `Fatura ${card.name}`,
        meta: `Final ${card.lastDigits || "----"}`,
        amount: total,
      } : null;
    })
    .filter(Boolean);

  const incomeEvents = summary.incomes
    .filter((item) => !isReceivedIncome(item, selectedMonth) || !isPastOrToday(item.date))
    .map((item) => ({
      type: "income",
      date: item.date,
      day: parseDateParts(item.date).day,
      title: item.description,
      meta: isReceivedIncome(item, selectedMonth) ? "Receita" : "Receita prevista",
      amount: item.amount,
    }));

  const expenseEvents = [
    ...summary.futureCashExpenses,
    ...summary.futureRecurring,
  ]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index)
    .map((item) => ({
      type: "expense",
      date: item.date,
      day: parseDateParts(item.date).day,
      title: item.description,
      meta: `${getCategoryName(item.categoryId)} - ${item.paymentMethod}`,
      amount: item.amount,
    }));

  return [...incomeEvents, ...expenseEvents, ...invoiceEvents]
    .sort((a, b) => a.date.localeCompare(b.date) || typeOrder(a.type) - typeOrder(b.type));
}

function calendarAgendaRow(event) {
  return `
    <article class="calendar-agenda-row ${escapeHtml(event.type)}">
      <span>${String(event.day).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(event.title)}</strong>
        <small>${escapeHtml(event.meta)}</small>
      </div>
      <strong>${BRL.format(event.amount)}</strong>
    </article>
  `;
}

function typeOrder(type) {
  const order = { income: 1, expense: 2, card: 3 };
  return order[type] || 4;
}

function getFinancialStatus(summary) {
  const days = getRemainingDaysInMonth(selectedMonth);
  const cardWeight = summary.expenseTotal > 0 ? summary.cardTotal / summary.expenseTotal : 0;
  const futureWeight = summary.availableNow > 0 ? summary.futureCommitments / summary.availableNow : 0;

  if (summary.projectedBalance < 0) {
    return {
      level: "danger",
      label: "Risco no fechamento",
      title: "Segure os gastos variaveis",
      text: `Seu saldo previsto fica ${BRL.format(Math.abs(summary.projectedBalance))} negativo. Revise cartoes, recorrentes e despesas futuras.`,
      action: "Ver lancamentos",
      target: "transactions",
    };
  }

  if (summary.dailyAvailable > 0 && summary.dailyAvailable < 50) {
    return {
      level: "warning",
      label: "Atencao no ritmo",
      title: "Gaste com mais criterio",
      text: `Restam ${BRL.format(summary.dailyAvailable)} por dia por ${days} dias. Evite compras fora do plano ate virar o mes.`,
      action: "Ver categorias",
      target: "categories",
    };
  }

  if (futureWeight >= 0.65) {
    return {
      level: "warning",
      label: "Dinheiro comprometido",
      title: "Boa parte ainda vai vencer",
      text: `Voce tem ${BRL.format(summary.futureCommitments)} em compromissos futuros. Confira vencimentos antes de novas compras.`,
      action: "Ver vencimentos",
      target: "cards",
    };
  }

  if (cardWeight >= 0.55) {
    return {
      level: "warning",
      label: "Cartao em destaque",
      title: "A fatura pesa no mes",
      text: `Cartoes representam ${Math.round(cardWeight * 100)}% das despesas do mes. Acompanhe parcelas e limite disponivel.`,
      action: "Ver cartoes",
      target: "cards",
    };
  }

  return {
    level: "safe",
    label: "Ritmo saudavel",
    title: "Voce pode gastar com seguranca",
    text: `Mantendo esse ritmo, o saldo previsto fecha em ${BRL.format(summary.projectedBalance)} e o limite diario fica em ${BRL.format(summary.dailyAvailable)}.`,
    action: "Ver analise",
    target: "analysis",
  };
}

function renderInvoiceOverview(summary) {
  const rows = state.cards.map((card) => {
    const total = getCardInvoiceTotal(card.id, selectedMonth);
    const used = card.limitTotal > 0 ? Math.min((getCardOpenAmount(card.id, selectedMonth) / card.limitTotal) * 100, 100) : 0;
    return `
      <article class="invoice-row">
        <div class="invoice-top">
          <div class="card-title-block">
            <div class="card-identity">${cardIconPair(card, "small")}</div>
            <div>
              <strong>${escapeHtml(card.name)}</strong>
              <span>${escapeHtml(getBankName(card.bankId))} - final ${escapeHtml(card.lastDigits || "----")}</span>
              <span>Fecha dia ${card.closingDay} - vence dia ${card.dueDay}</span>
            </div>
          </div>
          <strong class="amount-card">${BRL.format(total)}</strong>
        </div>
        <div class="progress-track" aria-label="Uso do limite">
          <div class="progress-fill" style="width:${used}%"></div>
        </div>
        <span>Limite disponivel estimado: ${BRL.format(getCardAvailableLimit(card.id, selectedMonth))}</span>
      </article>
    `;
  });

  els.invoiceOverview.innerHTML = rows.length ? rows.join("") : emptyState("Nenhum cartao cadastrado.", "Novo cartao", "cards");
}

function renderCashBreakdown(summary) {
  const items = [
    ["Dinheiro disponivel", summary.availableNow],
    ["Pix", summary.paymentTotals.Pix || 0],
    ["Debito", summary.paymentTotals.Debito || 0],
    ["Dinheiro", summary.paymentTotals.Dinheiro || 0],
    ["Cartao comprometido", summary.cardTotal],
    ["Faturas futuras", summary.futureCardTotal],
    ["Recorrentes pendentes", summary.recurringPendingTotal],
    ["Recorrentes pagas", summary.recurringPaidTotal],
    ["Recorrentes atrasadas", summary.recurringLateTotal],
  ];

  els.cashBreakdown.innerHTML = items.map(([label, amount]) => `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${BRL.format(amount)}</strong>
    </article>
  `).join("");
}

function renderSmartAlerts(summary) {
  const alerts = buildSmartAlerts(summary);
  els.smartAlerts.innerHTML = alerts.length
    ? alerts.map((alert) => `
        <article class="alert-row ${alert.level}" data-view-target="${escapeHtml(alert.target || "dashboard")}">
          <span class="alert-icon ${alert.level}"></span>
          <div>
            <strong>${escapeHtml(alert.title)}</strong>
            <span>${escapeHtml(alert.text)}</span>
          </div>
          <i class="row-chevron"></i>
        </article>
      `).join("")
    : emptyState("Tudo sob controle por enquanto.");
}

function renderDueList(summary) {
  const cardDues = state.cards
    .map((card) => getNextOpenCardInvoice(card, selectedMonth))
    .filter(Boolean);
  const recurringDues = summary.recurringPendingExpenses.map((item) => ({
    type: "recurring",
    item,
    total: item.amount,
    dueDate: item.date,
  }));
  const dues = [...recurringDues, ...cardDues].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  els.dueList.innerHTML = dues.length
    ? dues.map((item) => item.type === "recurring" ? recurringDueRow(item) : cardDueRow(item)).join("")
    : emptyState("Sem vencimentos pendentes neste mes.", "Nova compra", "cards");
}

function recurringDueRow(item) {
  const days = daysBetween(todayInput(), item.dueDate);
  return `
    <article class="due-row recurring-due-row">
      <div class="due-top">
        <div class="card-title-block">
          <span class="recurring-due-icon">${iconSvg("calendar")}</span>
          <div>
            <strong>${escapeHtml(item.item.description)}</strong>
            <span>${escapeHtml(getCategoryName(item.item.categoryId))} - ${escapeHtml(item.item.paymentMethod)}</span>
          </div>
        </div>
        <div class="due-amount-block">
          <strong class="amount-expense">${BRL.format(item.total)}</strong>
          <span class="due-badge ${days < 0 ? "late" : days === 0 ? "today" : ""}">${escapeHtml(dueBadgeText(days))}</span>
        </div>
      </div>
      <span>Vencimento em ${formatDate(item.dueDate)}</span>
      <button class="small-action icon-action" type="button" data-action="mark-recurring-paid" data-id="${recurringOccurrenceKey(item.item)}">${iconSvg("check")}<span>Marcar pago</span></button>
    </article>
  `;
}

function cardDueRow(item) {
  const used = item.card.limitTotal > 0 ? Math.min((getCardOpenAmount(item.card.id, item.month) / item.card.limitTotal) * 100, 100) : 0;
  const days = daysBetween(todayInput(), item.dueDate);
  return `
    <article class="due-row">
      <div class="due-top">
        <div class="card-title-block">
          <div class="card-identity">${cardIconPair(item.card, "small")}</div>
          <div>
            <strong>${escapeHtml(item.card.name)}</strong>
            <span>Final ${escapeHtml(item.card.lastDigits || "----")}</span>
          </div>
        </div>
        <div class="due-amount-block">
          <strong class="amount-card">${BRL.format(item.total)}</strong>
          <span class="due-badge ${days < 0 ? "late" : days === 0 ? "today" : ""}">${escapeHtml(dueBadgeText(days))}</span>
        </div>
      </div>
      <span>${escapeHtml(monthLabel(item.month))} - vencimento em ${formatDate(item.dueDate)}</span>
      <div class="progress-track">
        <div class="progress-fill" style="width:${used}%"></div>
      </div>
      <div class="due-purchase-list">
        ${item.installments
          .map((installment) => `
            <div class="due-purchase-row">
              <span>${escapeHtml(installment.purchase.description)} ${installment.totalInstallments > 1 ? `(${installment.number}/${installment.totalInstallments})` : ""}</span>
              <strong>${BRL.format(installment.amount)}</strong>
            </div>
          `).join("")}
      </div>
    </article>
  `;
}

function renderCategorySummary(summary) {
  const entries = Object.entries(summary.categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .filter(([, amount]) => amount > 0);
  const max = entries.length ? entries[0][1] : 0;

  els.categorySummary.innerHTML = entries.length
    ? entries.map(([categoryId, amount]) => {
        const budget = state.budgets.find((item) => item.categoryId === categoryId)?.limit || 0;
        const percent = budget > 0 ? Math.min((amount / budget) * 100, 100) : max > 0 ? (amount / max) * 100 : 0;
        const caption = budget > 0 ? `${Math.round((amount / budget) * 100)}% de ${BRL.format(budget)}` : `${Math.round(percent)}% do maior gasto`;
        return `
          <article class="category-row">
            <div class="category-meta">
              <strong>${escapeHtml(getCategoryName(categoryId))}</strong>
              <strong>${BRL.format(amount)}</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${percent}%"></div>
            </div>
            <span>${escapeHtml(caption)}</span>
          </article>
        `;
      }).join("")
    : emptyState("Sem gastos registrados neste mes.", "Nova despesa", "expenses");
}

function renderMonthChart() {
  const [year, monthNumber] = selectedMonth.split("-").map(Number);
  const days = new Date(year, monthNumber, 0).getDate();
  const summary = getMonthlySummary(selectedMonth);
  const incomes = summary.incomes.map((item) => ({ date: item.date, amount: item.amount }));
  const expenses = [
    ...summary.cashExpenses.map((item) => ({ date: item.date, amount: item.amount })),
    ...summary.cardInstallments.map((item) => ({ date: item.dueDate, amount: item.amount })),
  ];
  const dailyTotals = Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    return {
      income: sumAmounts(incomes.filter((item) => parseDateParts(item.date).day === day).map((item) => item.amount)),
      expense: sumAmounts(expenses.filter((item) => parseDateParts(item.date).day === day).map((item) => item.amount)),
    };
  });
  const max = Math.max(1, ...dailyTotals.flatMap((item) => [item.income, item.expense]));
  els.monthChart.style.setProperty("--chart-days", String(days));
  const bars = Array.from({ length: days }, (_, index) => {
    const { income, expense } = dailyTotals[index];
    return `
      <div class="chart-day">
        <span class="bar income" style="height:${chartBarHeight(income, max)}%"></span>
        <span class="bar expense" style="height:${chartBarHeight(expense, max)}%"></span>
      </div>
    `;
  }).join("");
  els.monthChart.innerHTML = bars;
}

function renderRecentActivity(summary) {
  const recent = [
    ...summary.incomes.map((item) => ({
      id: item.id,
      kind: "income",
      title: item.description,
      meta: `${formatDate(item.date)} - ${getCategoryName(item.categoryId)}`,
      amount: item.amount,
      date: item.date,
    })),
    ...summary.cashExpenses.map((item) => ({
      id: item.id,
      kind: "expense",
      title: item.description,
      meta: `${formatDate(item.date)} - ${item.paymentMethod}`,
      amount: item.amount,
      date: item.date,
    })),
    ...summary.cardInstallments.map((item) => ({
      id: item.purchase.id,
      kind: "card",
      title: item.purchase.description,
      meta: `${item.number}/${item.totalInstallments} - ${getCardName(item.purchase.cardId)}`,
      amount: item.amount,
      date: item.purchase.date,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  els.recentActivity.innerHTML = recent.length
    ? recent.map((item) => compactActivityRow(item)).join("")
    : emptyState("Sem lancamentos neste mes.", "Adicionar", "transactions");
}

function renderTransactionsMobile() {
  renderTransactionFilterState();
  const items = applyTransactionFilters(getTransactionItems());

  els.transactionMobileList.innerHTML = items.length
    ? transactionListHtml(items)
    : emptyState("Nenhum lancamento encontrado com esses filtros.", "Nova despesa", "expenses");
}

function transactionListHtml(items) {
  if (!transactionFilters.order.startsWith("date")) return items.map((item) => transactionRowHtml(item)).join("");
  const groups = items.reduce((map, item) => {
    const date = item.date || todayInput();
    if (!map.has(date)) map.set(date, []);
    map.get(date).push(item);
    return map;
  }, new Map());

  return Array.from(groups.entries()).map(([date, groupItems]) => {
    const total = transactionGroupTotal(groupItems);
    return `
      <section class="transaction-day-group">
        <div class="transaction-day-heading">
          <span>${escapeHtml(transactionDayLabel(date))}</span>
          <strong class="${transactionGroupAmountClass(total)}">${signedCurrency(total)}</strong>
        </div>
        <div class="transaction-day-items">
          ${groupItems.map((item) => transactionRowHtml(item)).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function transactionRowHtml(item) {
  return `
    <article class="mobile-transaction-row" data-kind="${item.kind}">
      <span class="transaction-icon ${item.kind}">${transactionIconHtml(item)}</span>
      <div class="transaction-main">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.meta)}</span>
        ${item.badge ? `<em>${escapeHtml(item.badge)}</em>` : ""}
      </div>
      <div class="transaction-side">
        <strong class="${transactionAmountClass(item)}">${item.kind === "income" ? "+" : "-"} ${BRL.format(item.amount)}</strong>
        ${item.action ? `<button class="delete-button mobile-delete" type="button" data-action="${item.action}" data-id="${item.deleteId || item.id}" aria-label="Excluir lancamento" title="Remover">${iconSvg("trash")}</button>` : ""}
      </div>
    </article>
  `;
}

function transactionGroupTotal(items) {
  return sumAmounts(items.map((item) => item.kind === "income" ? item.amount : -item.amount));
}

function transactionGroupAmountClass(total) {
  if (total > 0) return "amount-income";
  if (total < 0) return "amount-expense";
  return "amount-card";
}

function signedCurrency(value) {
  const sign = value >= 0 ? "+" : "-";
  return `${sign} ${BRL.format(Math.abs(value))}`;
}

function transactionDayLabel(dateString) {
  const today = todayInput();
  if (dateString === today) return "Hoje";
  if (dateString === offsetDateInput(today, -1)) return "Ontem";
  return formatDate(dateString);
}

function offsetDateInput(dateString, offset) {
  const { year, month, day } = parseDateParts(dateString);
  const date = new Date(year, month - 1, day + offset);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getTransactionItems() {
  const summary = getMonthlySummary(selectedMonth);
  const cardInstallments = getCardTransactionInstallmentsForMonth(selectedMonth);
  return [
    ...summary.incomes.map((item) => ({
      id: item.id,
      deleteId: item.id,
      action: "delete-income",
      title: item.description,
      meta: `${formatDate(item.date)} - Receita - ${getCategoryName(item.categoryId)}`,
      amount: item.amount,
      kind: "income",
      icon: "up",
      date: item.date,
      categoryId: item.categoryId,
      paymentMethod: "Receita",
    })),
    ...summary.cashExpenses.map((item) => {
      const isRecurringOccurrence = Boolean(item.recurringId);
      return {
        id: item.id,
        deleteId: isRecurringOccurrence ? recurringOccurrenceKey(item) : item.id,
        action: isRecurringOccurrence ? "delete-recurring-occurrence" : "delete-expense",
        title: item.description,
        meta: `${formatDate(item.date)} - ${getCategoryName(item.categoryId)} - ${item.paymentMethod}${isRecurringOccurrence ? ` recorrente - ${recurringPaymentStatus(item).label}` : ""}`,
        amount: item.amount,
        kind: "expense",
        icon: item.paymentMethod,
        date: item.date,
        categoryId: item.categoryId,
        paymentMethod: item.paymentMethod,
      };
    }),
    ...cardInstallments.map(cardTransactionItem),
  ];
}

function cardTransactionItem(item) {
  const launchMode = item.displayMode === "launch";
  return {
    id: `${item.purchase.id}-${item.number}-${item.displayMode}`,
    deleteId: item.purchase.id,
    action: "delete-purchase",
    title: item.purchase.description,
    meta: launchMode
      ? `${formatDate(item.purchase.date)} - entra na fatura ${monthLabel(item.month)} - vence ${formatDate(item.dueDate)} - Cartao ${getCardName(item.purchase.cardId)} - ${getCategoryName(item.purchase.categoryId)}`
      : `Compra em ${formatDate(item.purchase.date)} - Fatura ${monthLabel(item.month)} - vence ${formatDate(item.dueDate)} - Cartao ${getCardName(item.purchase.cardId)} - ${getCategoryName(item.purchase.categoryId)}`,
    amount: item.amount,
    kind: "card",
    icon: "card",
    date: launchMode ? item.purchase.date : item.dueDate,
    categoryId: item.purchase.categoryId,
    paymentMethod: "Cartao",
    badge: item.totalInstallments > 1 ? `${item.number}/${item.totalInstallments}` : "",
  };
}

function applyTransactionFilters(items) {
  const search = normalizeForSearch(transactionFilters.search);
  const filtered = items.filter((item) => {
    const matchesKind = transactionFilters.kind === "all" || item.kind === transactionFilters.kind;
    const matchesSearch = !search || normalizeForSearch(`${item.title} ${item.meta} ${item.amount}`).includes(search);
    const matchesCategory = !transactionFilters.categoryId || item.categoryId === transactionFilters.categoryId;
    const matchesPayment = !transactionFilters.paymentMethod || item.paymentMethod === transactionFilters.paymentMethod;
    return matchesKind && matchesSearch && matchesCategory && matchesPayment;
  });

  return filtered.sort((a, b) => {
    if (transactionFilters.order === "date-asc") return a.date.localeCompare(b.date);
    if (transactionFilters.order === "amount-desc") return b.amount - a.amount;
    if (transactionFilters.order === "amount-asc") return a.amount - b.amount;
    return b.date.localeCompare(a.date);
  });
}

function renderTransactionFilterState() {
  els.transactionKindFilter.querySelectorAll("[data-kind]").forEach((button) => {
    button.classList.toggle("active", button.dataset.kind === transactionFilters.kind);
  });
  if (els.transactionSearch.value !== transactionFilters.search) els.transactionSearch.value = transactionFilters.search;
  if (els.transactionCategoryFilter.value !== transactionFilters.categoryId) els.transactionCategoryFilter.value = transactionFilters.categoryId;
  if (els.transactionPaymentFilter.value !== transactionFilters.paymentMethod) els.transactionPaymentFilter.value = transactionFilters.paymentMethod;
  if (els.transactionOrderFilter.value !== transactionFilters.order) els.transactionOrderFilter.value = transactionFilters.order;
}

function transactionAmountClass(item) {
  if (item.kind === "income") return "amount-income";
  if (item.kind === "card") return "amount-card";
  return "amount-expense";
}

function renderIncome() {
  const items = getIncomesForMonth(selectedMonth).sort((a, b) => b.date.localeCompare(a.date));
  els.incomeListTotal.textContent = BRL.format(sum(items));
  els.incomeList.innerHTML = items.length
    ? items.map((item) => moneyEntryRow(item, "income", "delete-income", `${formatDate(item.date)} - ${getCategoryName(item.categoryId)} - ${isReceivedIncome(item, selectedMonth) ? "Recebida" : "Prevista"}`)).join("")
    : emptyState("Nenhuma receita cadastrada para este mes.", "Nova receita", "income");
}

function renderExpenses() {
  const summary = getMonthlySummary(selectedMonth);
  const items = summary.cashExpenses.sort((a, b) => b.date.localeCompare(a.date));
  els.expenseListTotal.textContent = BRL.format(summary.cashExpenseTotal);
  els.expenseList.innerHTML = items.length
    ? items.map((item) => {
        const isRecurringOccurrence = Boolean(item.recurringId);
        return moneyEntryRow(
          item,
          "expense",
          isRecurringOccurrence ? "delete-recurring-occurrence" : "delete-expense",
          `${formatDate(item.date)} - ${getCategoryName(item.categoryId)} - ${item.paymentMethod}${isRecurringOccurrence ? ` recorrente - ${recurringPaymentStatus(item).label}` : ""}`,
          isRecurringOccurrence ? recurringOccurrenceKey(item) : item.id,
        );
      }).join("")
    : emptyState("Nenhuma despesa a vista cadastrada para este mes.", "Nova despesa", "expenses");
}

function renderCards() {
  const rows = [];
  ensureSelectedCard();
  els.cardList.classList.remove("card-stack");
  if (isCreatingCard) rows.push(cardFormRow());

  state.cards.forEach((card, index) => {
    if (editingCardId === card.id) {
      rows.push(cardFormRow(card));
      return;
    }

    const invoice = getCardInvoiceTotal(card.id, selectedMonth);
    const openAmount = getCardOpenAmount(card.id, selectedMonth);
    const available = getCardAvailableLimit(card.id, selectedMonth);
    const usedPercent = card.limitTotal > 0 ? Math.min((openAmount / card.limitTotal) * 100, 100) : 0;
    const dueDate = getInvoiceDueDate(selectedMonth, card.dueDay);
    rows.push(`
      <article class="card-row card-display card-summary card-tone-${(index % 6) + 1} bank-card-${escapeHtml(card.bankId || "other")} ${selectedCardId === card.id && !cardDetailHidden ? "selected-card" : ""}">
        <div class="card-summary-head">
          <div class="card-title-block">
            <div class="card-identity">${cardIconPair(card)}</div>
            <div>
              <strong>${escapeHtml(card.name)}</strong>
              <span>${escapeHtml(getBankName(card.bankId))} - final ${escapeHtml(card.lastDigits || "----")}</span>
            </div>
          </div>
          <div class="card-summary-invoice">
            <span>Fatura atual</span>
            <strong>${BRL.format(invoice)}</strong>
            <em>${invoice > 0 ? `Vence em ${formatShortDate(dueDate)}` : "Fechada"}</em>
          </div>
        </div>
        <div class="card-summary-limits">
          <div>
            <span>Limite disponivel</span>
            <strong>${BRL.format(available)}</strong>
          </div>
          <div>
            <span>Limite total</span>
            <strong>${BRL.format(card.limitTotal)}</strong>
          </div>
        </div>
        <div class="card-summary-progress">
          <div class="progress-track">
            <div class="progress-fill" style="width:${usedPercent}%"></div>
          </div>
          <div>
            <span>${Math.round(usedPercent)}% utilizado</span>
            <span>${BRL.format(openAmount)} utilizados</span>
          </div>
        </div>
        <div class="card-summary-actions">
          <button class="card-icon-action detail" type="button" data-action="show-card-detail" data-id="${card.id}" aria-label="${selectedCardId === card.id && !cardDetailHidden ? "Ocultar detalhes" : "Ver detalhes"}" title="${selectedCardId === card.id && !cardDetailHidden ? "Ocultar detalhes" : "Detalhes"}">${iconSvg("eye")}</button>
          <button class="card-icon-action edit" type="button" data-action="edit-card" data-id="${card.id}" aria-label="Editar cartao" title="Editar">${iconSvg("edit")}</button>
          <button class="card-icon-action danger" type="button" data-action="delete-card" data-id="${card.id}" aria-label="Excluir cartao" title="Excluir">${iconSvg("trash")}</button>
        </div>
        ${selectedCardId === card.id && !cardDetailHidden ? cardInlineDetailHtml(card) : ""}
      </article>
    `);
  });

  els.newCardButton.disabled = isCreatingCard;
  if (!isCreatingCard) {
    rows.push(`<button class="add-card-row" type="button" data-action="new-card">Adicionar cartao</button>`);
  }
  els.cardList.innerHTML = rows.length ? rows.join("") : emptyState("Nenhum cartao cadastrado.", "Novo cartao", "cards");
}

function ensureSelectedCard() {
  if (!state.cards.length) {
    selectedCardId = null;
    return;
  }
  if (!state.cards.some((card) => card.id === selectedCardId)) {
    selectedCardId = null;
    cardDetailHidden = true;
  }
}

function renderCardDetail() {
  els.cardDetailPanel.hidden = true;
  els.cardDetailContent.innerHTML = "";
}

function cardInlineDetailHtml(card) {
  const currentInstallments = getInstallmentsForMonth(selectedMonth)
    .filter((item) => item.purchase.cardId === card.id)
    .sort((a, b) => b.purchase.date.localeCompare(a.purchase.date));
  const recentPurchases = state.purchases
    .filter((purchase) => purchase.cardId === card.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  const invoice = sumAmounts(currentInstallments.map((item) => item.amount));
  const nextInvoice = getCardInvoiceTotal(card.id, addMonths(selectedMonth, 1));
  const openAmount = getCardOpenAmount(card.id, selectedMonth);
  const available = getCardAvailableLimit(card.id, selectedMonth);
  const usedPercent = card.limitTotal > 0 ? Math.min((openAmount / card.limitTotal) * 100, 100) : 0;
  const futureTotal = sumAmounts(getAllInstallments()
    .filter((item) => item.purchase.cardId === card.id && item.month > selectedMonth)
    .map((item) => item.amount));

  return `
    <div class="inline-card-detail">
      <div class="inline-card-meter">
        <div>
          <span>Limite usado</span>
          <strong>${Math.round(usedPercent)}%</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${usedPercent}%"></div>
        </div>
      </div>
      <section class="card-detail-kpis">
        <article><span>Fatura atual</span><strong>${BRL.format(invoice)}</strong></article>
        <article><span>Disponivel</span><strong>${BRL.format(available)}</strong></article>
        <article><span>Proxima fatura</span><strong>${BRL.format(nextInvoice)}</strong></article>
        <article><span>Parcelas futuras</span><strong>${BRL.format(futureTotal)}</strong></article>
      </section>
      <section class="card-detail-section">
        <h3>Compras recentes</h3>
        <div class="card-detail-list">
          ${recentPurchases.length ? recentPurchases.map(cardPurchaseRow).join("") : emptyState("Nenhuma compra registrada.")}
        </div>
      </section>
    </div>
  `;
}

function cardPurchaseRow(purchase) {
  return `
    <article class="card-detail-row">
      <div>
        <strong>${escapeHtml(purchase.description)}</strong>
        <span>${formatDate(purchase.date)} - ${escapeHtml(getCategoryName(purchase.categoryId))} - ${Math.max(1, Number(purchase.installments) || 1)}x</span>
      </div>
      <strong>${BRL.format(purchase.amount)}</strong>
    </article>
  `;
}

function renderPurchases() {
  renderPurchaseFilterState();
  const installments = getFilteredPurchaseInstallments();
  els.purchaseListTotal.textContent = BRL.format(sumAmounts(installments.map((item) => item.amount)));
  els.purchaseList.innerHTML = installments.length
    ? installments.map(purchaseInstallmentRow).join("")
    : emptyState(purchaseFilter === "future" ? "Sem parcelas futuras." : "Nenhuma parcela encontrada.", "Nova compra", "cards");
}

function renderPurchaseFilterState() {
  document.querySelectorAll("#purchaseFilter [data-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === purchaseFilter);
  });
}

function getFilteredPurchaseInstallments() {
  const installments = getAllInstallments();
  if (purchaseFilter === "future") {
    return installments
      .filter((item) => item.month > selectedMonth)
      .filter(matchesPurchaseCardFilter)
      .sort((a, b) => a.month.localeCompare(b.month) || a.dueDate.localeCompare(b.dueDate));
  }
  if (purchaseFilter === "all") {
    return installments
      .filter(matchesPurchaseCardFilter)
      .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  }
  return installments
    .filter((item) => item.month === selectedMonth || isFirstCardInstallmentLaunchedInMonth(item, selectedMonth))
    .filter(matchesPurchaseCardFilter)
    .sort((a, b) => b.purchase.date.localeCompare(a.purchase.date) || a.month.localeCompare(b.month));
}

function matchesPurchaseCardFilter(item) {
  return !purchaseCardFilter || item.purchase.cardId === purchaseCardFilter;
}

function purchaseInstallmentRow(item) {
  const purchase = item.purchase;
  const card = state.cards.find((card) => card.id === purchase.cardId);
  return `
    <article class="purchase-entry-row">
      <div class="purchase-entry-icon">${card ? bankIcon(card.bankId, "small") : `<span class="transaction-icon card">C</span>`}</div>
      <div class="purchase-entry-main">
        <strong>${escapeHtml(purchase.description)}</strong>
        <span>Compra ${escapeHtml(formatDate(purchase.date))} - fatura ${escapeHtml(monthLabel(item.month))} - vence ${escapeHtml(formatShortDate(item.dueDate))}</span>
        <small>${escapeHtml(getCardName(purchase.cardId))} - ${escapeHtml(getCategoryName(purchase.categoryId))}</small>
        ${item.totalInstallments > 1 ? `<em>${item.number}/${item.totalInstallments}</em>` : ""}
      </div>
      <div class="purchase-entry-side">
        <strong class="amount-card">- ${BRL.format(item.amount)}</strong>
        <button class="delete-button mobile-delete" type="button" data-action="delete-purchase" data-id="${purchase.id}" aria-label="Excluir compra" title="Remover">${iconSvg("trash")}</button>
      </div>
    </article>
  `;
}

function renderSmsList() {
  const nativeAndroid = Boolean(window.AndroidFinance?.openNotificationSettings);
  const permissionLabel = nativeAndroid
    ? "Configurar no Android"
    : (state.settings.smsEnabled ? "Desativar leitura" : "Ativar leitura");
  els.smsPermissionToggle.setAttribute("aria-label", permissionLabel);
  els.smsPermissionToggle.setAttribute("title", permissionLabel);
  els.smsPermissionToggle.classList.toggle("active", state.settings.smsEnabled);
  els.smsPendingCount.textContent = String(state.pendingSms.length);
  syncNotificationIndicator();
  if (!state.settings.smsEnabled) {
    els.smsList.innerHTML = emptyState("A leitura automatica esta desativada.");
    return;
  }

  els.smsList.innerHTML = state.pendingSms.length ? state.pendingSms.map((item) => `
    <article class="sms-row">
      <div class="sms-row-head">
        ${bankIcon(item.bankId)}
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.rawMessage)}</p>
        </div>
      </div>
      <div class="sms-detected">
        <div>
          <span>Valor identificado</span>
          <strong>${BRL.format(item.amount)}</strong>
        </div>
        <div>
          <span>Tipo</span>
          <strong>${escapeHtml(item.type === "card" ? `Cartao final ${item.cardLastDigits || "----"}` : item.paymentMethod || "Pix")}</strong>
        </div>
        <div>
          <span>Categoria sugerida</span>
          <strong>${escapeHtml(getCategoryName(item.categoryId))}</strong>
        </div>
      </div>
      <div class="sms-actions">
        <button type="button" data-action="confirm-sms" data-id="${item.id}">Confirmar</button>
        <button type="button" data-action="edit-sms" data-id="${item.id}">Editar</button>
        <button type="button" data-action="ignore-sms" data-id="${item.id}">Ignorar</button>
      </div>
    </article>
  `).join("") : emptyState("Nenhum lancamento pendente por SMS.");
}

function syncNotificationIndicator() {
  const count = state.pendingSms.length;
  document.querySelectorAll(".bell-action").forEach((button) => {
    button.classList.toggle("has-pending", count > 0);
    button.setAttribute("aria-label", count > 0 ? `Ver ${count} notificacoes pendentes` : "Ver mensagens");
  });
}

function cardFormRow(card = null) {
  const bankId = card?.bankId || "nubank";
  const brandId = card?.brandId || "mastercard";
  const isEdit = Boolean(card);
  return `
    <form class="card-row card-inline-form" data-card-form="${isEdit ? "edit" : "new"}">
      <input name="id" type="hidden" value="${card ? escapeHtml(card.id) : ""}" />
      <div class="form-title-row">
        <h2>${isEdit ? "Editar cartao" : "Novo cartao"}</h2>
        <button class="text-button" type="button" data-action="cancel-card-form">Cancelar</button>
      </div>
      <div class="two-columns">
        <label>
          Banco
          <select name="bankId" required>${optionsForBanks(bankId)}</select>
        </label>
        <label>
          Bandeira
          <select name="brandId" required>${optionsForBrands(brandId)}</select>
        </label>
      </div>
      <div class="card-identity-preview" data-card-preview>
        ${cardIdentityPreviewHtml(bankId, brandId)}
      </div>
      <label>
        Apelido do cartao
        <input name="name" type="text" placeholder="Ex.: Principal, compras online" value="${escapeHtml(card?.name || "")}" required />
      </label>
      <label>
        Final do cartao
        <input name="lastDigits" type="text" inputmode="numeric" maxlength="4" placeholder="1234" value="${escapeHtml(card?.lastDigits || "")}" required />
      </label>
      <label>
        Limite total
        <input name="limitTotal" type="text" inputmode="numeric" data-money-input placeholder="R$ 0,00" value="${escapeHtml(card ? BRL.format(card.limitTotal) : "")}" required />
      </label>
      <div class="two-columns">
        <label>
          Fechamento
          <input name="closingDay" type="number" min="1" max="31" step="1" value="${card?.closingDay || 10}" required />
        </label>
        <label>
          Vencimento
          <input name="dueDay" type="number" min="1" max="31" step="1" value="${card?.dueDay || 20}" required />
        </label>
      </div>
      <div class="form-actions">
        <button class="secondary-form-button" type="button" data-action="cancel-card-form">Cancelar</button>
        <button class="primary-button" type="submit">${isEdit ? "Salvar alteracoes" : "Salvar cartao"}</button>
      </div>
    </form>
  `;
}

function renderCategories() {
  if (els.categoryCatalogBody) els.categoryCatalogBody.hidden = !categoryCatalogOpen;
  if (els.categoryCatalogPanel) els.categoryCatalogPanel.classList.toggle("open", categoryCatalogOpen);
  document.querySelectorAll("[data-action='toggle-category-catalog']").forEach((button) => {
    button.setAttribute("aria-expanded", String(categoryCatalogOpen));
  });
  if (els.categoryCatalogCount) {
    const total = state.categories.length;
    els.categoryCatalogCount.textContent = total === 1 ? "1 categoria" : `${total} categorias`;
  }
  els.categoryList.innerHTML = state.categories
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => {
      const canDelete = !category.locked;
      return `
      <article class="category-list-row">
        <span class="category-list-icon ${escapeHtml(category.type)}">${escapeHtml(categoryInitial(category.name))}</span>
        <div>
          <strong>${escapeHtml(category.name)}</strong>
          <small>${escapeHtml(categoryTypes[category.type])}</small>
        </div>
        <span class="pill ${category.type}">${category.locked ? "Padrao" : "Personalizada"}</span>
        ${canDelete ? `<button class="delete-button icon-only" type="button" data-action="delete-category" data-id="${category.id}" aria-label="Excluir categoria" title="Remover">${iconSvg("trash")}</button>` : ""}
      </article>
    `;
    }).join("");
}

function renderBudgets() {
  const expenseOptions = optionsForCategories("expense");
  els.budgetForm.elements.categoryId.innerHTML = expenseOptions;
  const summary = getMonthlySummary(selectedMonth);
  els.budgetList.innerHTML = state.budgets.length
    ? state.budgets.map((budget) => {
        const spent = summary.categoryTotals[budget.categoryId] || 0;
        const remaining = budget.limit - spent;
        const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
        return `
          <article class="budget-row">
            <div class="budget-main">
              <div class="category-meta">
                <strong>${escapeHtml(getCategoryName(budget.categoryId))}</strong>
                <strong>${Math.round(percent)}%</strong>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
              <span>Gasto ${BRL.format(spent)} de ${BRL.format(budget.limit)} - restante ${BRL.format(remaining)}</span>
            </div>
            <div class="card-actions">
              <button class="small-action icon-action" type="button" data-action="edit-budget" data-id="${budget.id}">${iconSvg("edit")}<span>Editar</span></button>
              <button class="delete-button icon-only" type="button" data-action="delete-budget" data-id="${budget.id}" aria-label="Excluir meta" title="Remover">${iconSvg("trash")}</button>
            </div>
          </article>
        `;
      }).join("")
    : emptyState("Nenhuma meta cadastrada.");
}

function renderRecurringExpenses() {
  els.recurringForm.elements.categoryId.innerHTML = optionsForCategories("expense");
  if (els.recurringCatalogBody) els.recurringCatalogBody.hidden = !recurringCatalogOpen;
  if (els.recurringCatalogPanel) els.recurringCatalogPanel.classList.toggle("open", recurringCatalogOpen);
  document.querySelectorAll("[data-action='toggle-recurring-catalog']").forEach((button) => {
    button.setAttribute("aria-expanded", String(recurringCatalogOpen));
  });
  if (els.recurringCatalogCount) {
    const total = state.recurringExpenses.length;
    els.recurringCatalogCount.textContent = total === 1 ? "1 cadastrado" : `${total} cadastrados`;
  }
  els.recurringList.innerHTML = state.recurringExpenses.length
    ? state.recurringExpenses.map((item) => `
        <article class="recurring-row">
          <div>
            <strong>${escapeHtml(item.description)}</strong>
            <span>${escapeHtml(getCategoryName(item.categoryId))} - vence dia ${item.dueDay} - ${escapeHtml(item.paymentMethod)}</span>
          </div>
          <strong>${BRL.format(item.amount)}</strong>
          <div class="card-actions">
            <button class="small-action icon-action" type="button" data-action="edit-recurring" data-id="${item.id}">${iconSvg("edit")}<span>Editar</span></button>
            <button class="small-action icon-action" type="button" data-action="toggle-recurring" data-id="${item.id}">${iconSvg(item.active ? "check" : "pause")}<span>${item.active ? "Ativo" : "Pausado"}</span></button>
            <button class="delete-button icon-only" type="button" data-action="delete-recurring" data-id="${item.id}" aria-label="Excluir recorrente" title="Remover">${iconSvg("trash")}</button>
          </div>
        </article>
      `).join("")
    : emptyState("Nenhum recorrente cadastrado.");
}

function renderRecurringControl() {
  const summary = getMonthlySummary(selectedMonth);
  const invoiceOccurrences = getCardInvoiceOccurrencesForMonth(selectedMonth);
  const items = [...summary.recurringOccurrences, ...invoiceOccurrences]
    .sort((a, b) => statusOrder(a.paymentStatus) - statusOrder(b.paymentStatus) || a.date.localeCompare(b.date));
  const invoicePending = invoiceOccurrences.filter((item) => item.paymentStatus !== "paid");
  const invoicePaid = invoiceOccurrences.filter((item) => item.paymentStatus === "paid");
  const invoiceLate = invoiceOccurrences.filter((item) => item.paymentStatus === "late");
  const invoiceFuture = invoiceOccurrences.filter((item) => item.paymentStatus === "pending");
  els.recurringControlMonth.textContent = monthLabel(selectedMonth);
  els.recurringControlSummary.innerHTML = [
    ["Pendentes", sum(summary.recurringPendingExpenses) + sumAmounts(invoicePending.map((item) => item.total)), "pending"],
    ["Pagas", summary.recurringPaidTotal + sumAmounts(invoicePaid.map((item) => item.total)), "paid"],
    ["Atrasadas", summary.recurringLateTotal + sumAmounts(invoiceLate.map((item) => item.total)), "late"],
    ["Ainda vai vencer", summary.recurringPendingTotal + sumAmounts(invoiceFuture.map((item) => item.total)), "future"],
  ].map(([label, amount, tone]) => `
    <article class="${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${BRL.format(amount)}</strong>
    </article>
  `).join("");
  els.recurringControlList.innerHTML = items.length
    ? items.map((item) => item.type === "card-invoice" ? invoiceControlRow(item) : recurringControlRow(item)).join("")
    : emptyState("Nenhuma conta ou fatura ativa neste mes.");
}

function invoiceControlRow(item) {
  const key = invoicePaymentKey(item.cardId, item.month);
  const status = recurringPaymentStatus(item);
  const action = item.paymentStatus === "paid"
    ? `<button class="small-action icon-action" type="button" data-action="undo-invoice-paid" data-id="${key}">${iconSvg("pause")}<span>Desfazer</span></button>`
    : `<button class="small-action icon-action" type="button" data-action="mark-invoice-paid" data-id="${key}">${iconSvg("check")}<span>Marcar pago</span></button>`;
  const paidText = item.paymentStatus === "paid" && item.paidAt ? `<small>Pago em ${formatDate(item.paidAt)}</small>` : "";
  const installmentText = item.installments.length === 1 ? "1 compra na fatura" : `${item.installments.length} compras na fatura`;
  return `
    <article class="recurring-control-row invoice-control-row ${escapeHtml(item.paymentStatus)}">
      <div class="recurring-control-date">
        <strong>${pad(parseDateParts(item.dueDate).day)}</strong>
        <span>${escapeHtml(monthLabel(item.month).slice(0, 3))}</span>
      </div>
      <div class="recurring-control-main">
        <div>
          <strong>Fatura ${escapeHtml(item.card.name)}</strong>
          <span>Final ${escapeHtml(item.card.lastDigits || "----")} - ${escapeHtml(installmentText)}</span>
          ${paidText}
        </div>
        <span class="status-pill ${escapeHtml(item.paymentStatus)}">${escapeHtml(status.label)}</span>
      </div>
      <strong>${BRL.format(item.total)}</strong>
      <div class="card-actions">
        ${action}
      </div>
    </article>
  `;
}

function recurringControlRow(item) {
  const key = recurringOccurrenceKey(item);
  const status = recurringPaymentStatus(item);
  const action = item.paymentStatus === "paid"
    ? `<button class="small-action icon-action" type="button" data-action="undo-recurring-paid" data-id="${key}">${iconSvg("pause")}<span>Desfazer</span></button>`
    : `<button class="small-action icon-action" type="button" data-action="mark-recurring-paid" data-id="${key}">${iconSvg("check")}<span>Marcar pago</span></button>`;
  const paidText = item.paymentStatus === "paid" && item.paidAt ? `<small>Pago em ${formatDate(item.paidAt)}</small>` : "";
  return `
    <article class="recurring-control-row ${escapeHtml(item.paymentStatus)}">
      <div class="recurring-control-date">
        <strong>${pad(parseDateParts(item.date).day)}</strong>
        <span>${escapeHtml(monthLabel(selectedMonth).slice(0, 3))}</span>
      </div>
      <div class="recurring-control-main">
        <div>
          <strong>${escapeHtml(item.description)}</strong>
          <span>${escapeHtml(getCategoryName(item.categoryId))} - ${escapeHtml(item.paymentMethod)}</span>
          ${paidText}
        </div>
        <span class="status-pill ${escapeHtml(item.paymentStatus)}">${escapeHtml(status.label)}</span>
      </div>
      <strong>${BRL.format(item.amount)}</strong>
      <div class="card-actions">
        ${action}
        <button class="small-action icon-action" type="button" data-action="edit-recurring" data-id="${item.recurringId}">${iconSvg("edit")}<span>Editar</span></button>
        <button class="delete-button icon-only" type="button" data-action="delete-recurring-occurrence" data-id="${key}" aria-label="Remover deste mes" title="Remover deste mes">${iconSvg("trash")}</button>
      </div>
    </article>
  `;
}

function recurringPaymentStatus(item) {
  if (item.paymentStatus === "paid") return { label: "Pago" };
  if (item.paymentStatus === "late") return { label: "Atrasado" };
  return { label: "Pendente" };
}

function statusOrder(status) {
  const order = { late: 1, pending: 2, paid: 3 };
  return order[status] || 4;
}

function renderAnalysis() {
  const current = getMonthlySummary(selectedMonth);
  const previousMonth = addMonths(selectedMonth, -1);
  const previous = getMonthlySummary(previousMonth);
  const currentTotals = getAnalysisTotals(current);
  const previousTotals = getAnalysisTotals(previous);
  const hasPrevious = hasAnalysisData(previous);
  const series = buildAnalysisDailySeries(selectedMonth, current);
  const categoryChanges = getAnalysisCategoryChanges(current, previous);
  const increased = categoryChanges.filter((item) => item.diff > 0).slice(0, 4);
  const reduced = categoryChanges.filter((item) => item.diff < 0).slice(0, 4);
  const score = getAnalysisScore(current, previous);
  const bestPoint = getAnalysisBestPoint(current, previous, reduced, score);
  const attentionPoint = getAnalysisAttentionPoint(current, previous, increased);

  els.analysisHeader.innerHTML = `
    <div>
      <span>Analise mensal</span>
      <div class="analysis-month-line">
        <button class="icon-button" type="button" data-action="analysis-month-prev" aria-label="Mes anterior">&lsaquo;</button>
        <strong class="month-label-inline">
          <span class="calendar-glyph" aria-hidden="true"></span>
          <span>${escapeHtml(monthLabel(selectedMonth))}</span>
          <span class="month-caret" aria-hidden="true"></span>
        </strong>
        <button class="icon-button" type="button" data-action="analysis-month-next" aria-label="Proximo mes">&rsaquo;</button>
      </div>
      <p>${hasPrevious ? `Comparado a ${escapeHtml(monthLabel(previousMonth))}` : "Ainda sem mes anterior suficiente para comparar."}</p>
    </div>
    <div class="analysis-header-actions">
      <button class="analysis-info-button" type="button" aria-label="Sobre a analise" title="A analise compara receitas, despesas, cartoes, metas e contas recorrentes do mes selecionado.">${iconSvg("info")}</button>
    </div>
  `;

  els.analysisKpis.innerHTML = [
    analysisKpiCard({
      kind: "income",
      icon: "trend-up",
      title: "Receitas",
      value: currentTotals.income,
      previous: previousTotals.income,
      higherIsGood: true,
      points: series.income,
    }),
    analysisKpiCard({
      kind: "expense",
      icon: "trend-down",
      title: "Despesas",
      value: currentTotals.cash,
      previous: previousTotals.cash,
      higherIsGood: false,
      points: series.cash,
    }),
    analysisKpiCard({
      kind: "card",
      icon: "card",
      title: "Gastos no cartao",
      value: currentTotals.card,
      previous: previousTotals.card,
      higherIsGood: false,
      points: series.card,
    }),
    analysisKpiCard({
      kind: "saving",
      icon: "pig",
      title: "Economia",
      value: currentTotals.savings,
      previous: previousTotals.savings,
      higherIsGood: true,
      points: series.balance,
    }),
  ].join("");

  els.analysisEvolutionChart.innerHTML = renderAnalysisEvolutionChart(series);
  els.analysisScore.innerHTML = renderAnalysisScore(score, current, previous);
  els.analysisIncreasedCategories.innerHTML = hasPrevious
    ? renderAnalysisCategoryList(increased, "up")
    : emptyState("Ainda nao ha dados suficientes para comparar aumentos.");
  els.analysisReducedCategories.innerHTML = hasPrevious
    ? renderAnalysisCategoryList(reduced, "down")
    : emptyState("Ainda nao ha dados suficientes para comparar reducoes.");
  els.analysisHighlights.innerHTML = `
    ${renderAnalysisHighlight("good", "Melhor ponto do mes", bestPoint.title, bestPoint.text, "trophy")}
    ${renderAnalysisHighlight("warning", "Ponto de atencao", attentionPoint.title, attentionPoint.text, "warning")}
  `;
  els.analysisComparison.innerHTML = hasPrevious
    ? renderAnalysisComparison(currentTotals, previousTotals)
    : emptyState("Continue lancando suas movimentacoes para gerar uma comparacao mais completa.");
}

function getAnalysisTotals(summary) {
  const cash = summary.cashExpenseTotal || 0;
  const card = summary.cardTotal || 0;
  const income = summary.incomeTotal || 0;
  return {
    income,
    cash,
    card,
    savings: income - cash - card,
  };
}

function hasAnalysisData(summary) {
  return Boolean(summary && (summary.incomeTotal || summary.cashExpenseTotal || summary.cardTotal));
}

function analysisKpiCard({ kind, icon, title, value, previous, higherIsGood, points }) {
  const change = getAnalysisChange(value, previous, higherIsGood);
  return `
    <article class="analysis-kpi-card ${escapeHtml(kind)}">
      <div class="analysis-kpi-title">
        <span class="analysis-kpi-icon">${iconSvg(icon)}</span>
        <span>${escapeHtml(title)}</span>
      </div>
      <strong>${BRL.format(value)}</strong>
      <small class="${escapeHtml(change.tone)}">${escapeHtml(change.label)}</small>
      ${renderSparkline(points, kind)}
    </article>
  `;
}

function getAnalysisChange(current, previous, higherIsGood = true) {
  const diff = current - previous;
  if (!previous && !current) return { label: "0%", tone: "neutral" };
  if (!previous) return { label: "Novo", tone: higherIsGood ? "positive" : "warning" };
  const percent = Math.round((diff / previous) * 100);
  const good = diff === 0 ? null : higherIsGood ? diff > 0 : diff < 0;
  const signal = percent > 0 ? "+" : "";
  return {
    label: `${signal}${percent}%`,
    tone: good === null ? "neutral" : good ? "positive" : "warning",
  };
}

function buildAnalysisDailySeries(month, summary) {
  const totalDays = getDaysInMonth(month);
  const incomeDaily = Array.from({ length: totalDays }, () => 0);
  const cashDaily = Array.from({ length: totalDays }, () => 0);
  const cardDaily = Array.from({ length: totalDays }, () => 0);

  summary.incomes.forEach((item) => {
    const day = parseDateParts(item.date).day;
    if (day >= 1 && day <= totalDays) incomeDaily[day - 1] += item.amount;
  });
  summary.cashExpenses.forEach((item) => {
    const day = parseDateParts(item.date).day;
    if (day >= 1 && day <= totalDays) cashDaily[day - 1] += item.amount;
  });
  summary.cardInstallments.forEach((item) => {
    const day = parseDateParts(item.dueDate).day;
    if (day >= 1 && day <= totalDays) cardDaily[day - 1] += item.amount;
  });

  const income = cumulativeValues(incomeDaily);
  const cash = cumulativeValues(cashDaily);
  const card = cumulativeValues(cardDaily);
  const balance = income.map((value, index) => value - cash[index] - card[index]);
  return {
    days: Array.from({ length: totalDays }, (_, index) => index + 1),
    income,
    cash,
    card,
    balance,
  };
}

function cumulativeValues(values) {
  let total = 0;
  return values.map((value) => {
    total += value;
    return total;
  });
}

function renderSparkline(points, tone) {
  const end = sparklineEndPoint(points, 140, 44, 7);
  return `
    <svg class="analysis-sparkline ${escapeHtml(tone)}" viewBox="0 0 140 44" role="img" aria-label="Tendencia">
      <polyline points="${escapeHtml(svgPolylinePoints(points, 140, 44, 7))}"></polyline>
      <circle cx="${end.x}" cy="${end.y}" r="3.6"></circle>
    </svg>
  `;
}

function renderAnalysisEvolutionChart(series) {
  const lines = [
    { key: "income", label: "Receitas", values: series.income },
    { key: "cash", label: "Despesas", values: series.cash },
    { key: "card", label: "Cartao", values: series.card },
    { key: "balance", label: "Saldo", values: series.balance },
  ];
  const allValues = lines.flatMap((line) => line.values);
  const max = Math.max(1, ...allValues);
  const min = Math.min(0, ...allValues);
  const range = max - min || 1;
  const viewWidth = 320;
  const viewHeight = 168;
  const padX = 18;
  const padY = 18;
  const pointsFor = (values) => values.map((value, index) => {
    const x = padX + (index / Math.max(1, values.length - 1)) * (viewWidth - padX * 2);
    const y = viewHeight - padY - ((value - min) / range) * (viewHeight - padY * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return `
    <div class="analysis-chart-shell">
      <svg viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="Evolucao de receitas, despesas, cartao e saldo">
        <path class="analysis-chart-grid" d="M18 36H302M18 84H302M18 132H302"></path>
        ${lines.map((line) => `<polyline class="analysis-chart-line ${line.key}" points="${escapeHtml(pointsFor(line.values))}"></polyline>`).join("")}
      </svg>
      <div class="analysis-chart-legend">
        ${lines.map((line) => `<span class="${line.key}"><i></i>${escapeHtml(line.label)}</span>`).join("")}
      </div>
    </div>
  `;
}

function svgPolylinePoints(values, width, height, padding) {
  const safeValues = values && values.length ? values : [0, 0];
  const max = Math.max(1, ...safeValues);
  const min = Math.min(0, ...safeValues);
  const range = max - min || 1;
  return safeValues.map((value, index) => {
    const x = padding + (index / Math.max(1, safeValues.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function sparklineEndPoint(values, width, height, padding) {
  const safeValues = values && values.length ? values : [0, 0];
  const max = Math.max(1, ...safeValues);
  const min = Math.min(0, ...safeValues);
  const range = max - min || 1;
  const lastIndex = safeValues.length - 1;
  return {
    x: padding + (lastIndex / Math.max(1, lastIndex)) * (width - padding * 2),
    y: height - padding - ((safeValues[lastIndex] - min) / range) * (height - padding * 2),
  };
}

function getAnalysisCategoryChanges(current, previous) {
  const categoryIds = [...new Set([...Object.keys(current.categoryTotals), ...Object.keys(previous.categoryTotals)])];
  return categoryIds
    .map((categoryId) => {
      const now = current.categoryTotals[categoryId] || 0;
      const before = previous.categoryTotals[categoryId] || 0;
      return {
        categoryId,
        now,
        before,
        diff: now - before,
        percent: before > 0 ? ((now - before) / before) * 100 : null,
      };
    })
    .filter((item) => item.diff !== 0)
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
}

function renderAnalysisCategoryList(items, direction) {
  if (!items.length) {
    return emptyState(direction === "up" ? "Nenhuma categoria aumentou neste mes." : "Nenhuma categoria reduziu neste mes.");
  }
  return items.map((item) => {
    const name = getCategoryName(item.categoryId);
    const amount = `${item.diff > 0 ? "+" : "-"}${BRL.format(Math.abs(item.diff))}`;
    const percent = item.percent === null ? "Novo" : `${item.diff > 0 ? "+" : ""}${Math.round(item.percent)}%`;
    return `
      <article class="analysis-category-row ${escapeHtml(direction)}">
        <span class="analysis-category-icon">${categoryInitial(name)}</span>
        <div>
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(categoryInsightDescription(item.categoryId))}</small>
        </div>
        <aside>
          <strong>${escapeHtml(amount)}</strong>
          <small>${escapeHtml(percent)}</small>
        </aside>
      </article>
    `;
  }).join("");
}

function renderAnalysisScore(score, current, previous) {
  const trend = getAnalysisTotals(current).savings - getAnalysisTotals(previous).savings;
  return `
    <div class="analysis-score-main">
      <div class="analysis-score-ring" style="--score:${score.value}">
        <strong>${score.value}</strong>
        <span>/100</span>
      </div>
      <div>
        <span>Saude financeira do mes</span>
        <h2>${escapeHtml(score.status)}</h2>
        <p>${escapeHtml(score.text)}</p>
      </div>
    </div>
    <div class="analysis-score-details">
      <span>${current.projectedBalance >= 0 ? "Saldo final positivo" : "Saldo final em risco"}</span>
      <span>${current.recurringLateTotal > 0 ? `${BRL.format(current.recurringLateTotal)} atrasado` : "Sem contas atrasadas"}</span>
      <span>${trend >= 0 ? "Economia melhorou" : "Economia caiu"}</span>
    </div>
  `;
}

function getAnalysisScore(current, previous) {
  if (!hasAnalysisData(current)) {
    return {
      value: 0,
      status: "Sem dados",
      text: "Cadastre receitas e despesas para gerar uma leitura real do mes.",
    };
  }
  const currentTotals = getAnalysisTotals(current);
  const previousTotals = getAnalysisTotals(previous);
  const incomeBase = Math.max(current.incomeTotal || 0, 1);
  let value = 62;

  value += current.projectedBalance >= 0 ? 16 : -24;
  value += currentTotals.savings >= previousTotals.savings ? 8 : -6;
  value += current.cardTotal <= incomeBase * 0.3 ? 8 : -10;
  value += current.cashExpenseTotal + current.cardTotal <= incomeBase * 0.8 ? 8 : -8;
  value += current.recurringLateTotal > 0 ? -14 : 6;

  const overBudget = state.budgets.filter((budget) => {
    const spent = current.categoryTotals[budget.categoryId] || 0;
    return budget.limit > 0 && spent > budget.limit;
  });
  if (state.budgets.length && !overBudget.length) value += 6;
  value -= overBudget.length * 6;

  value = Math.max(0, Math.min(100, Math.round(value)));
  const status = value <= 40 ? "Critico" : value <= 60 ? "Atencao" : value <= 80 ? "Controlado" : "Muito bom";
  const text = value <= 40
    ? "O mes precisa de cortes ou reforco de receita."
    : value <= 60
      ? "Ha pontos importantes para acompanhar de perto."
      : value <= 80
        ? "O mes esta controlado, com alguns cuidados."
        : "Seu mes esta saudavel e com boa margem.";

  return { value, status, text };
}

function getAnalysisBestPoint(current, previous, reduced, score) {
  if (!hasAnalysisData(current)) {
    return {
      title: "Sua analise esta pronta para receber dados.",
      text: "Assim que voce lancar movimentacoes, o app destaca o melhor ponto do mes.",
    };
  }
  const currentSavings = getAnalysisTotals(current).savings;
  const previousSavings = getAnalysisTotals(previous).savings;
  if (currentSavings > previousSavings && hasAnalysisData(previous)) {
    return {
      title: "Voce economizou mais que no mes anterior.",
      text: `A economia subiu ${BRL.format(currentSavings - previousSavings)} e fortaleceu seu fechamento.`,
    };
  }
  if (reduced.length) {
    return {
      title: `${getCategoryName(reduced[0].categoryId)} caiu neste mes.`,
      text: `Voce reduziu ${BRL.format(Math.abs(reduced[0].diff))} nessa categoria.`,
    };
  }
  if (score.value >= 81) {
    return {
      title: "Gastos dentro do orcamento!",
      text: "Parabens. Seu mes esta com boa margem de seguranca.",
    };
  }
  return {
    title: current.projectedBalance >= 0 ? "Saldo previsto positivo." : "Voce esta acompanhando o risco.",
    text: current.projectedBalance >= 0
      ? `A previsao fecha em ${BRL.format(current.projectedBalance)}.`
      : "Identificar o risco agora ajuda a corrigir o rumo antes do fechamento.",
  };
}

function getAnalysisAttentionPoint(current, previous, increased) {
  if (!hasAnalysisData(current)) {
    return {
      title: "Ainda nao ha dados suficientes.",
      text: "Inclua receitas, despesas ou compras para revelar pontos de atencao.",
    };
  }
  if (current.projectedBalance < 0) {
    return {
      title: "Risco de saldo negativo.",
      text: `Faltam ${BRL.format(Math.abs(current.projectedBalance))} para fechar o mes no azul.`,
    };
  }
  if (current.recurringLateTotal > 0) {
    return {
      title: "Existem contas atrasadas.",
      text: `${BRL.format(current.recurringLateTotal)} em recorrentes atrasados ainda precisam de atencao.`,
    };
  }

  const overBudget = state.budgets
    .map((budget) => {
      const spent = current.categoryTotals[budget.categoryId] || 0;
      return { budget, spent, percent: budget.limit > 0 ? (spent / budget.limit) * 100 : 0 };
    })
    .filter((item) => item.percent >= 85)
    .sort((a, b) => b.percent - a.percent)[0];
  if (overBudget) {
    return {
      title: `${getCategoryName(overBudget.budget.categoryId)} perto do limite.`,
      text: `Voce ja usou ${Math.round(overBudget.percent)}% da meta da categoria.`,
    };
  }

  if (increased.length) {
    return {
      title: `${getCategoryName(increased[0].categoryId)} aumentou.`,
      text: `Alta de ${BRL.format(increased[0].diff)} em relacao ao mes anterior.`,
    };
  }

  if (previous.cardTotal > 0 && current.cardTotal > previous.cardTotal) {
    return {
      title: "Cartao subiu neste mes.",
      text: `A fatura aumentou ${BRL.format(current.cardTotal - previous.cardTotal)} frente ao mes anterior.`,
    };
  }

  return {
    title: "Nada critico por enquanto.",
    text: "Continue acompanhando os pequenos gastos para manter o controle.",
  };
}

function renderAnalysisHighlight(tone, label, title, text, icon) {
  return `
    <article class="analysis-highlight-card ${escapeHtml(tone)}">
      <span>${iconSvg(icon)}</span>
      <div>
        <small>${escapeHtml(label)}</small>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(text)}</p>
      </div>
    </article>
  `;
}

function renderAnalysisComparison(current, previous) {
  return [
    comparisonRow("Receitas", current.income, previous.income, true),
    comparisonRow("Despesas", current.cash, previous.cash, false),
    comparisonRow("Cartao", current.card, previous.card, false),
    comparisonRow("Economia", current.savings, previous.savings, true),
  ].join("");
}

function comparisonRow(label, current, previous, higherIsGood) {
  const change = getAnalysisChange(current, previous, higherIsGood);
  return `
    <article class="analysis-comparison-row">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(monthLabel(selectedMonth))}: ${BRL.format(current)}</span>
        <span>Mes anterior: ${BRL.format(previous)}</span>
      </div>
      <small class="${escapeHtml(change.tone)}">${escapeHtml(change.label)}</small>
    </article>
  `;
}

function categoryInsightDescription(categoryId) {
  const normalized = normalizeForSearch(getCategoryName(categoryId));
  if (normalized.includes("lazer")) return "Cinema, streaming, jogos";
  if (normalized.includes("aliment")) return "Restaurantes e delivery";
  if (normalized.includes("transporte")) return "Combustivel e aplicativos";
  if (normalized.includes("mercado")) return "Compras de mercado";
  if (normalized.includes("contas")) return "Moradia, assinaturas e fixos";
  if (normalized.includes("saude")) return "Farmacia e consultas";
  if (normalized.includes("estudo")) return "Cursos, livros e aprendizado";
  return "Movimentacoes da categoria";
}

function categoryInitial(name) {
  return normalizeForSearch(name).slice(0, 1).toUpperCase() || "C";
}

function getDaysInMonth(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber, 0).getDate();
}

function renderCategoryOptions() {
  const incomeOptions = optionsForCategories("income");
  const expenseOptions = optionsForCategories("expense");
  els.incomeForm.elements.categoryId.innerHTML = incomeOptions;
  els.expenseForm.elements.categoryId.innerHTML = expenseOptions;
  els.purchaseForm.elements.categoryId.innerHTML = expenseOptions;
  els.purchaseForm.elements.cardId.innerHTML = state.cards.length
    ? state.cards.map((card) => `<option value="${card.id}">${escapeHtml(cardOptionLabel(card))}</option>`).join("")
    : `<option value="">Cadastre um cartao</option>`;
  els.canBuyForm.elements.categoryId.innerHTML = expenseOptions;
  els.canBuyForm.elements.cardId.innerHTML = state.cards.length
    ? state.cards.map((card) => `<option value="${card.id}">${escapeHtml(cardOptionLabel(card))}</option>`).join("")
    : `<option value="">Cadastre um cartao</option>`;
  els.purchaseForm.querySelector("button[type='submit']").disabled = !state.cards.length;
  syncCanBuyPaymentFields();
  renderPurchaseCardFilterOptions();
  els.transactionCategoryFilter.innerHTML = transactionCategoryOptions();
  els.transactionCategoryFilter.value = transactionFilters.categoryId;
}

function renderPurchaseCardFilterOptions() {
  if (!els.purchaseCardFilter) return;
  const options = [
    `<option value="">Todos os cartoes</option>`,
    ...state.cards.map((card) => `<option value="${card.id}">${escapeHtml(card.name)} final ${escapeHtml(card.lastDigits || "----")}</option>`),
  ].join("");
  els.purchaseCardFilter.innerHTML = options;
  if (purchaseCardFilter && !state.cards.some((card) => card.id === purchaseCardFilter)) purchaseCardFilter = "";
  els.purchaseCardFilter.value = purchaseCardFilter;
}

function updateInlineCardPreview(form) {
  const bankId = form.elements.bankId.value || "nubank";
  const brandId = form.elements.brandId.value || "mastercard";
  const preview = form.querySelector("[data-card-preview]");
  if (!preview) return;
  preview.innerHTML = cardIdentityPreviewHtml(bankId, brandId);
}

function cardIdentityPreviewHtml(bankId, brandId) {
  return `
    <div class="card-identity">${cardIconPair({ bankId, brandId })}</div>
    <span>${escapeHtml(getBankName(bankId))} - ${escapeHtml(getBrandName(brandId))}</span>
  `;
}

function renderInstallmentPreview() {
  if (!state.cards.length) {
    els.installmentPreview.textContent = "Cadastre um cartao para simular as parcelas.";
    return;
  }

  const form = els.purchaseForm.elements;
  const card = state.cards.find((item) => item.id === form.cardId.value) || state.cards[0];
  const amount = toMoney(form.amount.value);
  const installments = Math.max(1, Number(form.installments.value) || 1);
  const date = form.date.value || todayInput();

  if (!amount || !card) {
    els.installmentPreview.textContent = "Informe valor e parcelas para ver a fatura inicial.";
    return;
  }

  const firstMonth = getFirstInvoiceMonth(date, card);
  const split = splitAmount(amount, installments);
  const closingDate = getInvoiceClosingDate(firstMonth, card);
  const dueDate = getInvoiceDueDate(firstMonth, card.dueDay);
  els.installmentPreview.textContent = `${installments}x de ${BRL.format(split[0])} - entra na fatura de ${monthLabel(firstMonth)} (fecha ${formatShortDate(closingDate)}, vence ${formatShortDate(dueDate)})`;
}

function moneyEntryRow(item, kind, action, meta, deleteId = item.id) {
  const amountClass = kind === "income" ? "amount-income" : kind === "card" ? "amount-card" : "amount-expense";
  const sign = kind === "income" ? "+" : "-";
  return `
    <article class="entry-row">
      <div class="entry-title">
        <strong>${escapeHtml(item.description)}</strong>
        <span>${escapeHtml(meta)}</span>
      </div>
      <strong class="${amountClass}">${sign} ${BRL.format(item.amount)}</strong>
      <button class="delete-button icon-only" type="button" data-action="${action}" data-id="${deleteId}" aria-label="Excluir lancamento" title="Remover">${iconSvg("trash")}</button>
    </article>
  `;
}

function compactActivityRow(item) {
  const amountClass = item.kind === "income" ? "amount-income" : item.kind === "card" ? "amount-card" : "amount-expense";
  const sign = item.kind === "income" ? "+" : "-";
  return `
    <article class="due-row">
      <div class="due-top">
        <strong>${escapeHtml(item.title)}</strong>
        <strong class="${amountClass}">${sign} ${BRL.format(item.amount)}</strong>
      </div>
      <span>${escapeHtml(item.meta)}</span>
    </article>
  `;
}

function transactionIconText(item) {
  if (item.kind === "income") return "A";
  if (item.kind === "card") return "C";
  const label = String(item.icon || "").slice(0, 1).toUpperCase();
  return label || "D";
}

function transactionIconHtml(item) {
  const iconName = item.kind === "income"
    ? "income"
    : item.kind === "card"
      ? "card"
      : paymentIconName(item.paymentMethod || item.icon);
  return iconSvg(iconName) || transactionIconText(item);
}

function paymentIconName(value) {
  const normalized = normalizeForSearch(value || "");
  if (normalized.includes("pix")) return "pix";
  if (normalized.includes("debito")) return "debit";
  if (normalized.includes("dinheiro")) return "cash";
  return "expense";
}

function getMonthlySummary(month) {
  const incomes = getIncomesForMonth(month);
  const baseCashExpenses = getCashExpensesForMonth(month).filter((item) => !item.recurringId);
  const cardInstallments = getInstallmentsForMonth(month);
  const recurringOccurrences = getRecurringOccurrencesForMonth(month).filter((item) => !isRecurringSkipped(item));
  const recurringPaidExpenses = recurringOccurrences.filter((item) => item.paymentStatus === "paid");
  const recurringPendingExpenses = recurringOccurrences.filter((item) => item.paymentStatus !== "paid");
  const cashExpenses = [...baseCashExpenses, ...recurringOccurrences];
  const receivedIncomes = incomes.filter((item) => isReceivedIncome(item, month));
  const plannedIncomes = incomes.filter((item) => !isReceivedIncome(item, month));
  const paidCashExpenses = [
    ...baseCashExpenses.filter((item) => isPastOrToday(item.date)),
    ...recurringPaidExpenses,
  ];
  const futureCashExpenses = baseCashExpenses.filter((item) => !isPastOrToday(item.date));
  const futureRecurring = recurringPendingExpenses;
  const paidCardInstallments = cardInstallments.filter((item) => isInvoicePaid(item.purchase.cardId, item.month));
  const pendingCardInstallments = cardInstallments.filter((item) => !isInvoicePaid(item.purchase.cardId, item.month));
  const receivedIncomeTotal = sum(receivedIncomes);
  const plannedIncomeTotal = sum(plannedIncomes);
  const incomeTotal = sum(incomes);
  const cashExpenseTotal = sum(cashExpenses);
  const cardTotal = sumAmounts(cardInstallments.map((item) => item.amount));
  const expenseTotal = cashExpenseTotal + cardTotal;
  const paidCashTotal = sum(paidCashExpenses);
  const paidCardTotal = sumAmounts(paidCardInstallments.map((item) => item.amount));
  const futureCashTotal = sum(futureCashExpenses);
  const futureRecurringTotal = sum(futureRecurring);
  const futureCardTotal = sumAmounts(pendingCardInstallments.map((item) => item.amount));
  const recurringPaidTotal = sum(recurringPaidExpenses);
  const recurringPendingTotal = sum(recurringPendingExpenses.filter((item) => item.paymentStatus === "pending"));
  const recurringLateTotal = sum(recurringPendingExpenses.filter((item) => item.paymentStatus === "late"));
  const availableNow = receivedIncomeTotal - paidCashTotal - paidCardTotal;
  const futureCommitments = futureCashTotal + futureRecurringTotal + futureCardTotal;
  const projectedBalance = incomeTotal - expenseTotal;
  const dailyAvailable = projectedBalance > 0 ? projectedBalance / getRemainingDaysInMonth(month) : 0;
  const paymentTotals = groupBy(cashExpenses, "paymentMethod");
  const categoryTotals = {};

  cashExpenses.forEach((expense) => {
    categoryTotals[expense.categoryId] = (categoryTotals[expense.categoryId] || 0) + expense.amount;
  });
  cardInstallments.forEach((item) => {
    categoryTotals[item.purchase.categoryId] = (categoryTotals[item.purchase.categoryId] || 0) + item.amount;
  });

  return {
    incomes,
    cashExpenses,
    cardInstallments,
    recurringOccurrences,
    recurringPaidExpenses,
    recurringPendingExpenses,
    receivedIncomes,
    plannedIncomes,
    paidCashExpenses,
    paidCardInstallments,
    futureCashExpenses,
    futureRecurring,
    pendingCardInstallments,
    incomeTotal,
    receivedIncomeTotal,
    plannedIncomeTotal,
    cashExpenseTotal,
    cardTotal,
    expenseTotal,
    paidCashTotal,
    paidCardTotal,
    futureCashTotal,
    futureRecurringTotal,
    futureCardTotal,
    recurringPaidTotal,
    recurringPendingTotal,
    recurringLateTotal,
    availableNow,
    futureCommitments,
    projectedBalance,
    dailyAvailable,
    balance: projectedBalance,
    available: availableNow,
    paymentTotals,
    categoryTotals,
  };
}

function getIncomesForMonth(month) {
  return state.incomes.filter((item) => getMonthKey(item.date) === month);
}

function getCashExpensesForMonth(month) {
  return state.expenses.filter((item) => getMonthKey(item.date) === month);
}

function getInstallmentsForMonth(month) {
  return getAllInstallments().filter((item) => item.month === month);
}

function getCardTransactionInstallmentsForMonth(month) {
  const items = new Map();
  getAllInstallments().forEach((item) => {
    const billedInMonth = item.month === month;
    const launchedInMonth = isFirstCardInstallmentLaunchedInMonth(item, month);
    if (!billedInMonth && !launchedInMonth) return;
    const displayMode = billedInMonth ? "invoice" : "launch";
    items.set(`${item.purchase.id}:${item.number}`, { ...item, displayMode });
  });
  return Array.from(items.values());
}

function isFirstCardInstallmentLaunchedInMonth(item, month) {
  return item.number === 1 && getMonthKey(item.purchase.date) === month && item.month !== month;
}

function getAllInstallments() {
  return state.purchases.flatMap((purchase) => getInstallmentsForPurchase(purchase));
}

function getInstallmentsForPurchase(purchase) {
  const card = state.cards.find((item) => item.id === purchase.cardId);
  if (!card) return [];
  const count = Math.max(1, Number(purchase.installments) || 1);
  const values = splitAmount(purchase.amount, count);
  const firstMonth = getFirstInvoiceMonth(purchase.date, card);
  return values.map((amount, index) => {
    const month = addMonths(firstMonth, index);
    return {
      purchase,
      amount,
      month,
      dueDate: getInvoiceDueDate(month, card.dueDay),
      number: index + 1,
      totalInstallments: count,
    };
  });
}

function getFirstInvoiceMonth(dateString, card) {
  const purchaseMonth = getMonthKey(dateString);
  const closingDay = clampDayInput(card.closingDay);
  const dueDay = clampDayInput(card.dueDay);
  const closingInDueMonth = closingDay <= dueDay;
  const invoiceMonthClosingInPurchaseMonth = closingInDueMonth ? purchaseMonth : addMonths(purchaseMonth, 1);
  const closingDate = getInvoiceClosingDate(invoiceMonthClosingInPurchaseMonth, { closingDay, dueDay });
  return dateString <= closingDate ? invoiceMonthClosingInPurchaseMonth : addMonths(invoiceMonthClosingInPurchaseMonth, 1);
}

function getInvoiceClosingDate(invoiceMonth, card) {
  const closingDay = clampDayInput(card.closingDay);
  const dueDay = clampDayInput(card.dueDay);
  const closingMonth = closingDay <= dueDay ? invoiceMonth : addMonths(invoiceMonth, -1);
  return dateInMonth(closingMonth, closingDay);
}

function getInvoiceDueDate(month, dueDay) {
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  const day = Math.min(Number(dueDay) || 1, lastDay);
  return `${year}-${pad(monthNumber)}-${pad(day)}`;
}

function getCardInvoiceTotal(cardId, month) {
  return sumAmounts(getInstallmentsForMonth(month).filter((item) => item.purchase.cardId === cardId).map((item) => item.amount));
}

function getCardInvoiceInstallments(cardId, month) {
  return getInstallmentsForMonth(month).filter((item) => item.purchase.cardId === cardId);
}

function getNextOpenCardInvoice(card, fromMonth) {
  for (let offset = 0; offset < 13; offset += 1) {
    const month = addMonths(fromMonth, offset);
    const installments = getCardInvoiceInstallments(card.id, month);
    const total = sumAmounts(installments.map((item) => item.amount));
    if (total > 0 && !isInvoicePaid(card.id, month)) {
      return {
        type: "card",
        month,
        card,
        installments,
        total,
        dueDate: getInvoiceDueDate(month, card.dueDay),
      };
    }
  }
  return null;
}

function getCardInvoiceOccurrencesForMonth(month) {
  return state.cards
    .map((card) => buildCardInvoiceOccurrence(card, month))
    .filter((item) => item.total > 0);
}

function buildCardInvoiceOccurrence(card, month) {
  const installments = getCardInvoiceInstallments(card.id, month);
  const total = sumAmounts(installments.map((item) => item.amount));
  const dueDate = getInvoiceDueDate(month, card.dueDay);
  const payment = getInvoicePayment(card.id, month);
  const paymentStatus = payment ? "paid" : dueDate < todayInput() ? "late" : "pending";
  return {
    type: "card-invoice",
    id: `invoice-${card.id}-${month}`,
    card,
    cardId: card.id,
    month,
    date: dueDate,
    dueDate,
    installments,
    amount: total,
    total,
    paymentStatus,
    paidAt: payment?.paidAt || "",
  };
}

function getCardOpenAmount(cardId, fromMonth) {
  return sumAmounts(
    state.purchases
      .filter((purchase) => purchase.cardId === cardId)
      .flatMap((purchase) => getInstallmentsForPurchase(purchase))
      .filter((item) => item.month >= fromMonth)
      .map((item) => item.amount),
  );
}

function getCardAvailableLimit(cardId, fromMonth) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return 0;
  return card.limitTotal - getCardOpenAmount(cardId, fromMonth);
}

function splitAmount(amount, installments) {
  const cents = Math.round(Number(amount) * 100);
  const count = Math.max(1, Number(installments) || 1);
  const base = Math.floor(cents / count);
  const remainder = cents % count;
  return Array.from({ length: count }, (_, index) => (base + (index < remainder ? 1 : 0)) / 100);
}

function optionsForCategories(type) {
  return state.categories
    .filter((category) => category.type === type || category.type === "both")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
}

function transactionCategoryOptions() {
  const options = state.categories
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join("");
  return `<option value="">Categoria</option>${options}`;
}

function optionsForBanks(selectedId = "") {
  return bankOptions
    .map((bank) => `<option value="${bank.id}" ${bank.id === selectedId ? "selected" : ""}>${escapeHtml(bank.name)}</option>`)
    .join("");
}

function optionsForBrands(selectedId = "") {
  return brandOptions
    .map((brand) => `<option value="${brand.id}" ${brand.id === selectedId ? "selected" : ""}>${escapeHtml(brand.name)}</option>`)
    .join("");
}

function cardIconPair(card, size = "") {
  return `${bankIcon(card.bankId, size)}${brandIcon(card.brandId, size)}`;
}

function bankIcon(id, size = "") {
  const bank = getBankOption(id);
  return logoIcon(bank, size);
}

function brandIcon(id, size = "") {
  const brand = getBrandOption(id);
  return logoIcon(brand, size);
}

function logoIcon(item, size = "") {
  const src = item.domain ? faviconUrl(item.domain) : "";
  const image = src
    ? `<img src="${src}" alt="${escapeHtml(item.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.dataset.fallback='1';" />`
    : "";
  return `
    <span class="entity-icon logo-tile ${size} ${item.className}" title="${escapeHtml(item.name)}" data-initials="${escapeHtml(item.initials)}" ${src ? "" : "data-fallback=\"1\""}>
      ${image}
    </span>
  `;
}

function faviconUrl(domain) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`;
}

function getBankOption(id) {
  return bankOptions.find((bank) => bank.id === id) || bankOptions.find((bank) => bank.id === "other");
}

function getBrandOption(id) {
  return brandOptions.find((brand) => brand.id === id) || brandOptions.find((brand) => brand.id === "other");
}

function getBankName(id) {
  return getBankOption(id).name;
}

function getBrandName(id) {
  return getBrandOption(id).name;
}

function cardOptionLabel(card) {
  return `${card.name} - final ${card.lastDigits || "----"} - ${getBrandName(card.brandId)}`;
}

function isCategoryInUse(id) {
  return [
    ...state.incomes.map((item) => item.categoryId),
    ...state.expenses.map((item) => item.categoryId),
    ...state.purchases.map((item) => item.categoryId),
  ].includes(id);
}

function getCategoryName(id) {
  return state.categories.find((category) => category.id === id)?.name || "Sem categoria";
}

function getCardName(id) {
  return state.cards.find((card) => card.id === id)?.name || "Cartao removido";
}

function isReceivedIncome(item, month) {
  if (item.status === "planned") return false;
  if (item.status === "received") return true;
  return getMonthKey(item.date) < getMonthKey(new Date()) || isPastOrToday(item.date);
}

function isPastOrToday(dateString) {
  return dateString <= todayInput();
}

function getRemainingDaysInMonth(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  const today = new Date();
  const currentMonth = getMonthKey(today);
  if (month < currentMonth) return 1;
  if (month > currentMonth) return lastDay;
  return Math.max(1, lastDay - today.getDate() + 1);
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const groupKey = item[key] || "Outros";
    groups[groupKey] = (groups[groupKey] || 0) + Number(item.amount || 0);
    return groups;
  }, {});
}

function getRecurringOccurrencesForMonth(month) {
  return state.recurringExpenses
    .filter((item) => item.active)
    .map((item) => buildRecurringOccurrence(item, month));
}

function buildRecurringOccurrence(item, month) {
  const date = dateInMonth(month, item.dueDay);
  const recurring = {
    ...item,
    id: `recurring-${item.id}-${month}`,
    date,
    recurringId: item.id,
    month,
    source: "recurring",
  };
  const payment = getRecurringPayment(item.id, month);
  const legacyPayment = getLegacyRecurringExpense(item.id, month);
  const paidAt = payment?.paidAt || legacyPayment?.paidAt || legacyPayment?.date || "";
  const paymentStatus = paidAt ? "paid" : date < todayInput() ? "late" : "pending";
  return {
    ...recurring,
    paymentStatus,
    paidAt,
    status: paymentStatus === "paid" ? "paid" : "pending",
  };
}

function isRecurringAlreadyLaunched(recurring) {
  return state.expenses.some((expense) => expense.recurringId === recurring.recurringId && getMonthKey(expense.date) === getMonthKey(recurring.date));
}

function recurringOccurrenceKey(recurring) {
  if (typeof recurring === "string") return recurring;
  return recurring.month ? `${recurring.recurringId}:${recurring.month}` : `${recurring.recurringId}:${getMonthKey(recurring.date)}`;
}

function isRecurringSkipped(recurring) {
  return state.skippedRecurring.includes(recurringOccurrenceKey(recurring));
}

function skipRecurringOccurrence(key) {
  if (!state.skippedRecurring.includes(key)) state.skippedRecurring.push(key);
  const [recurringId, month] = key.split(":");
  state.expenses = state.expenses.filter((expense) => !(expense.recurringId === recurringId && getMonthKey(expense.date) === month));
  state.recurringPayments = state.recurringPayments.filter((payment) => !(payment.recurringId === recurringId && payment.month === month));
}

function getRecurringPayment(recurringId, month) {
  return state.recurringPayments.find((payment) => payment.recurringId === recurringId && payment.month === month);
}

function getLegacyRecurringExpense(recurringId, month) {
  return state.expenses.find((expense) => expense.recurringId === recurringId && getMonthKey(expense.date) === month);
}

function markRecurringPaid(key) {
  const [recurringId, month] = key.split(":");
  if (!recurringId || !month) return;
  state.skippedRecurring = state.skippedRecurring.filter((item) => item !== key);
  const payment = {
    recurringId,
    month,
    status: "paid",
    paidAt: todayInput(),
  };
  const index = state.recurringPayments.findIndex((item) => item.recurringId === recurringId && item.month === month);
  if (index >= 0) state.recurringPayments[index] = payment;
  else state.recurringPayments.push(payment);
  persist();
  render();
}

function undoRecurringPaid(key) {
  const [recurringId, month] = key.split(":");
  if (!recurringId || !month) return;
  state.recurringPayments = state.recurringPayments.filter((payment) => !(payment.recurringId === recurringId && payment.month === month));
  state.expenses = state.expenses.filter((expense) => !(expense.recurringId === recurringId && getMonthKey(expense.date) === month));
  persist();
  render();
}

function invoicePaymentKey(cardId, month) {
  return `${cardId}:${month}`;
}

function getInvoicePayment(cardId, month) {
  return state.invoicePayments.find((payment) => payment.cardId === cardId && payment.month === month);
}

function isInvoicePaid(cardId, month) {
  return Boolean(getInvoicePayment(cardId, month));
}

function markInvoicePaid(key) {
  const [cardId, month] = key.split(":");
  if (!cardId || !month) return;
  const payment = {
    cardId,
    month,
    status: "paid",
    paidAt: todayInput(),
  };
  const index = state.invoicePayments.findIndex((item) => item.cardId === cardId && item.month === month);
  if (index >= 0) state.invoicePayments[index] = payment;
  else state.invoicePayments.push(payment);
  persist();
  render();
}

function undoInvoicePaid(key) {
  const [cardId, month] = key.split(":");
  if (!cardId || !month) return;
  state.invoicePayments = state.invoicePayments.filter((payment) => !(payment.cardId === cardId && payment.month === month));
  persist();
  render();
}

function buildSmartAlerts(summary) {
  const alerts = [];
  const previous = getMonthlySummary(addMonths(selectedMonth, -1));
  const remainingDays = getRemainingDaysInMonth(selectedMonth);
  if (summary.projectedBalance < 0) {
    addSmartAlert(
      alerts,
      "danger",
      100,
      "Risco de saldo negativo",
      `Faltam ${BRL.format(Math.abs(summary.projectedBalance))} para fechar no azul. Revise faturas, recorrentes ou receitas previstas.`,
      "transactions",
    );
  }
  if (summary.recurringLateTotal > 0) {
    addSmartAlert(
      alerts,
      "danger",
      94,
      "Conta recorrente atrasada",
      `Ha ${BRL.format(summary.recurringLateTotal)} em contas fixas vencidas e ainda pendentes.`,
      "recurringControl",
    );
  } else if (summary.recurringPendingTotal > 0) {
    addSmartAlert(
      alerts,
      "warning",
      62,
      "Contas fixas pendentes",
      `Ainda falta pagar ${BRL.format(summary.recurringPendingTotal)} em recorrentes deste mes.`,
      "recurringControl",
    );
  }
  addSmartAlert(
    alerts,
    summary.dailyAvailable < 50 ? "warning" : "info",
    summary.dailyAvailable < 50 ? 78 : 44,
    "Disponivel por dia",
    `Voce ainda tem ${BRL.format(summary.dailyAvailable)} por dia por ${remainingDays} dias ate o fim do mes.`,
    "dashboard",
  );

  state.budgets.forEach((budget) => {
    const spent = summary.categoryTotals[budget.categoryId] || 0;
    const percent = budget.limit > 0 ? spent / budget.limit : 0;
    if (percent >= 0.8) {
      addSmartAlert(
        alerts,
        percent >= 1 ? "danger" : "warning",
        percent >= 1 ? 96 : 86,
        `${getCategoryName(budget.categoryId)} perto do limite`,
        `Voce ja usou ${Math.round(percent * 100)}% da meta. Restam ${BRL.format(Math.max(0, budget.limit - spent))}.`,
        "categories",
      );
    }
  });

  Object.entries(summary.categoryTotals).forEach(([categoryId, current]) => {
    const previousAmount = previous.categoryTotals[categoryId] || 0;
    const diff = current - previousAmount;
    if (previousAmount >= 50 && diff >= 50 && current > previousAmount * 1.25) {
      addSmartAlert(
        alerts,
        "warning",
        68,
        `${getCategoryName(categoryId)} acima da media`,
        `Voce gastou ${BRL.format(diff)} a mais que no mes passado. Veja se ainda cabe no plano.`,
        "categories",
      );
    }
  });

  const deliveryKeywords = ["ifood", "delivery", "rappi", "ubereats", "uber eats", "aiqfome", "restaurante", "lanche", "pizza", "hamburguer"];
  const delivery = getKeywordSpend(summary, deliveryKeywords);
  const previousDelivery = getKeywordSpend(previous, deliveryKeywords);
  if (delivery >= 100 && !previousDelivery) {
    addSmartAlert(alerts, "warning", 66, "Delivery entrou forte", `Ja foram ${BRL.format(delivery)} em delivery/restaurantes neste mes.`, "transactions");
  } else if (previousDelivery >= 30 && delivery - previousDelivery >= 40 && delivery > previousDelivery * 1.25) {
    addSmartAlert(
      alerts,
      "warning",
      72,
      "Delivery subiu neste mes",
      `Voce gastou ${BRL.format(delivery - previousDelivery)} a mais que no mes anterior.`,
      "transactions",
    );
  }

  state.cards
    .map((card) => ({ card, total: getCardInvoiceTotal(card.id, selectedMonth), dueDate: getInvoiceDueDate(selectedMonth, card.dueDay) }))
    .filter((item) => item.total > 0 && !isInvoicePaid(item.card.id, selectedMonth))
    .forEach((item) => {
      const days = daysBetween(todayInput(), item.dueDate);
      if (days >= 0 && days <= 3) {
        addSmartAlert(
          alerts,
          "warning",
          88,
          `${item.card.name} vence ${days === 0 ? "hoje" : `em ${days} dias`}`,
          `Separe ${BRL.format(item.total)} para pagar a fatura sem apertar o saldo.`,
          "recurringControl",
        );
      }
    });

  state.cards.forEach((card) => {
    const current = getCardInvoiceTotal(card.id, selectedMonth);
    const previous = getCardInvoiceTotal(card.id, addMonths(selectedMonth, -1));
    const diff = current - previous;
    if (previous > 0 && diff >= 50 && current > previous * 1.3) {
      addSmartAlert(
        alerts,
        "warning",
        62,
        `Fatura do ${card.name} subiu`,
        `Ela esta ${Math.round(((current / previous) - 1) * 100)}% maior que no mes anterior. Confira compras recentes.`,
        "cards",
      );
    }
  });

  return dedupeAlerts(alerts)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4)
    .map(({ priority, ...alert }) => alert);
}

function addSmartAlert(alerts, level, priority, title, text, target = "dashboard") {
  alerts.push({ level, priority, title, text, target });
}

function getKeywordSpend(summary, keywords) {
  const normalizedKeywords = keywords.map(normalizeForSearch);
  const cash = summary.cashExpenses.map((item) => ({
    description: item.description,
    amount: item.amount,
    categoryId: item.categoryId,
  }));
  const card = summary.cardInstallments.map((item) => ({
    description: item.purchase.description,
    amount: item.amount,
    categoryId: item.purchase.categoryId,
  }));

  return sumAmounts([...cash, ...card]
    .filter((item) => {
      const haystack = normalizeForSearch(`${item.description} ${getCategoryName(item.categoryId)}`);
      return normalizedKeywords.some((keyword) => haystack.includes(keyword));
    })
    .map((item) => item.amount));
}

function dedupeAlerts(alerts) {
  const seen = new Set();
  return alerts.filter((alert) => {
    const key = normalizeForSearch(`${alert.title}:${alert.text}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function daysBetween(start, end) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  return Math.round((endDate - startDate) / 86400000);
}

function dueBadgeText(days) {
  if (days < 0) return `Venceu ha ${Math.abs(days)} dias`;
  if (days === 0) return "Vence hoje";
  if (days === 1) return "Em 1 dia";
  return `Em ${days} dias`;
}

function setDefaultDates() {
  const today = todayInput();
  els.incomeForm.elements.date.value = today;
  els.expenseForm.elements.date.value = today;
  els.purchaseForm.elements.date.value = today;
  els.purchaseForm.elements.installments.value = "1";
  els.canBuyForm.elements.date.value = today;
  els.canBuyForm.elements.installments.value = "1";
}

function restoreFormValues(form, values) {
  Object.entries(values).forEach(([name, value]) => {
    if (form.elements[name] && value !== undefined && value !== null) {
      if (form.elements[name].matches?.("[data-money-input]")) setMoneyInputValue(form.elements[name], value);
      else form.elements[name].value = value;
    }
  });
}

function focusFirstFormField(form) {
  const focusAction = () => {
    const field = form.querySelector("input:not([type='hidden']), select, textarea");
    field?.focus?.({ preventScroll: true });
  };
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(focusAction);
  else focusAction();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2200);
}

function sum(items) {
  return sumAmounts(items.map((item) => item.amount));
}

function sumAmounts(amounts) {
  return amounts.reduce((total, amount) => total + Number(amount || 0), 0);
}

function chartBarHeight(amount, max) {
  if (!amount || !max) return 0;
  return Math.min(92, Math.max(6, (amount / max) * 92));
}

function toMoney(value) {
  return Math.max(0, Math.round(parseMoneyValue(value) * 100) / 100);
}

function parseMoneyValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const text = String(value || "").trim();
  if (!text) return 0;
  const hasCurrencyFormat = /R\$|,|\./.test(text);
  if (hasCurrencyFormat) {
    const cents = text.replace(/\D/g, "");
    return cents ? Number(cents) / 100 : 0;
  }
  const parsed = Number(text.replace(/[^\d-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampDayInput(value) {
  return Math.max(1, Math.min(31, Number(value) || 1));
}

function cleanText(value) {
  return String(value || "").trim();
}

function getMonthKey(date) {
  if (date instanceof Date) return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
  return String(date).slice(0, 7);
}

function addMonths(month, amount) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + amount, 1);
  return getMonthKey(date);
}

function parseDateParts(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  return { year, month, day };
}

function todayInput() {
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(dateString) {
  const { year, month, day } = parseDateParts(dateString);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

function formatShortDate(dateString) {
  const { month, day } = parseDateParts(dateString);
  return `${pad(day)}/${pad(month)}`;
}

function monthLabel(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const label = new Date(year, monthNumber - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyState(message, actionLabel = "", viewTarget = "") {
  const action = actionLabel && viewTarget
    ? `<button class="empty-action" type="button" data-view-target="${escapeHtml(viewTarget)}">${escapeHtml(actionLabel)}</button>`
    : "";
  const detail = action
    ? "Comece com um registro simples e ajuste os detalhes depois."
    : "Quando houver dados, eles aparecem aqui organizados.";
  return `
    <div class="empty-state">
      <span class="empty-icon">${iconSvg("spark")}</span>
      <strong>${escapeHtml(message)}</strong>
      <p>${escapeHtml(detail)}</p>
      ${action}
    </div>
  `;
}

function iconSvg(name) {
  const icons = {
    spark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v5"></path><path d="M12 16v5"></path><path d="M3 12h5"></path><path d="M16 12h5"></path><path d="m6.5 6.5 2.5 2.5"></path><path d="m15 15 2.5 2.5"></path><path d="m17.5 6.5-2.5 2.5"></path><path d="m9 15-2.5 2.5"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>`,
    eye: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    info: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 10.5v6"></path><path d="M12 7.5h.01"></path></svg>`,
    "trend-up": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16 5-5 4 4 7-8"></path><path d="M15 7h5v5"></path></svg>`,
    "trend-down": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 8 5 5 4-4 7 8"></path><path d="M15 17h5v-5"></path></svg>`,
    pig: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15.5 5.8 19h3.5"></path><path d="M16.8 15.5 18 19h-3.5"></path><path d="M5 11.8H3.5"></path><path d="M19.5 10.5 21 9v5l-1.5-1.2"></path><path d="M5.5 12.2c0-3.2 2.9-5.7 6.5-5.7s6.5 2.5 6.5 5.7S15.6 18 12 18s-6.5-2.6-6.5-5.8Z"></path><path d="M9 6.8 7.5 4.5H11"></path><circle cx="15.5" cy="10.8" r=".4"></circle></svg>`,
    trophy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h8v5a4 4 0 0 1-8 0V5Z"></path><path d="M8 7H4v2a4 4 0 0 0 4 4"></path><path d="M16 7h4v2a4 4 0 0 1-4 4"></path><path d="M12 14v4"></path><path d="M8.5 20h7"></path></svg>`,
    warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 21 20H3L12 4Z"></path><path d="M12 9v5"></path><path d="M12 17h.01"></path></svg>`,
    edit: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.2L19 9.2a2.5 2.5 0 0 0-3.5-3.5L4.7 16.5 4 20Z"></path><path d="m14.5 6.5 3 3"></path></svg>`,
    trash: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M9 7V5h6v2"></path><path d="M7 7l1 13h8l1-13"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>`,
    income: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"></path><path d="m6 11 6-6 6 6"></path></svg>`,
    expense: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="m18 13-6 6-6-6"></path></svg>`,
    card: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="2.5"></rect><path d="M3.5 10h17"></path><path d="M7 15h4"></path></svg>`,
    pix: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 9-9 9-9-9 9-9Z"></path><path d="m8.5 12 3 3 4-6"></path></svg>`,
    debit: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="13" rx="2.5"></rect><path d="M7.5 10h9"></path><path d="M7.5 14.5h4"></path></svg>`,
    cash: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6.5" width="17" height="11" rx="2"></rect><circle cx="12" cy="12" r="2.4"></circle><path d="M6.5 9.5v5"></path><path d="M17.5 9.5v5"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7"></path></svg>`,
    pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.5v11"></path><path d="M15.5 6.5v11"></path></svg>`,
    calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2.5"></rect><path d="M8 3.5v4"></path><path d="M16 3.5v4"></path><path d="M4 10h16"></path></svg>`,
    category: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5h6v6h-6z"></path><path d="M13.5 6.5h6v6h-6z"></path><path d="M4.5 15h6v3.5h-6z"></path><path d="M13.5 15h6v3.5h-6z"></path></svg>`,
  };
  return icons[name] || "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return createSeedData();
  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return createSeedData();
  }
}

function normalizeState(input) {
  const normalized = {
    categories: Array.isArray(input.categories) ? input.categories : [],
    incomes: Array.isArray(input.incomes) ? input.incomes : [],
    expenses: Array.isArray(input.expenses) ? input.expenses : [],
    cards: Array.isArray(input.cards) ? input.cards : [],
    purchases: Array.isArray(input.purchases) ? input.purchases : [],
    budgets: Array.isArray(input.budgets) ? input.budgets : [],
    recurringExpenses: Array.isArray(input.recurringExpenses) ? input.recurringExpenses : [],
    recurringPayments: Array.isArray(input.recurringPayments) ? input.recurringPayments : [],
    invoicePayments: Array.isArray(input.invoicePayments) ? input.invoicePayments : [],
    skippedRecurring: Array.isArray(input.skippedRecurring) ? input.skippedRecurring : [],
    pendingSms: Array.isArray(input.pendingSms) ? input.pendingSms : [],
    settings: input.settings && typeof input.settings === "object" ? input.settings : {},
  };

  defaultCategories.forEach((category) => {
    if (!normalized.categories.some((item) => item.id === category.id)) normalized.categories.push(category);
  });

  normalized.cards = normalized.cards.map((card) => ({
    ...card,
    bankId: card.bankId || inferBankId(card.name),
    brandId: card.brandId || "mastercard",
    lastDigits: card.lastDigits || inferLastDigits(card.name),
  }));

  normalized.incomes = normalized.incomes.map((income) => ({ ...income, status: income.status || "received" }));
  normalized.expenses = normalized.expenses.map((expense) => ({ ...expense, status: expense.status || "paid" }));
  normalized.budgets = normalized.budgets.map((budget) => ({ ...budget, id: budget.id || createId(), limit: Number(budget.limit) || 0 }));
  normalized.recurringPayments = normalized.recurringPayments
    .filter((payment) => payment.recurringId && payment.month)
    .map((payment) => ({ recurringId: payment.recurringId, month: payment.month, status: "paid", paidAt: payment.paidAt || todayInput() }));
  normalized.invoicePayments = normalized.invoicePayments
    .filter((payment) => payment.cardId && payment.month)
    .map((payment) => ({ cardId: payment.cardId, month: payment.month, status: "paid", paidAt: payment.paidAt || todayInput() }));
  normalized.settings = { smsEnabled: true, ...normalized.settings };

  return normalized;
}

function createSeedData() {
  const month = getMonthKey(new Date());
  const cardOne = createId();
  const cardTwo = createId();
  return normalizeState({
    categories: structuredClone(defaultCategories),
    incomes: [
      { id: createId(), description: "Salario", amount: 6200, date: dateInMonth(month, 5), categoryId: "cat-salary", status: "received" },
      { id: createId(), description: "Freela landing page", amount: 850, date: dateInMonth(month, 24), categoryId: "cat-freela", status: "planned" },
    ],
    expenses: [
      { id: createId(), description: "Aluguel", amount: 1650, date: dateInMonth(month, 6), categoryId: "cat-bills", paymentMethod: "Pix" },
      { id: createId(), description: "Mercado do mes", amount: 438.9, date: dateInMonth(month, 9), categoryId: "cat-market", paymentMethod: "Debito" },
      { id: createId(), description: "Transporte", amount: 142.4, date: dateInMonth(month, 15), categoryId: "cat-transport", paymentMethod: "Pix" },
    ],
    cards: [
      { id: cardOne, bankId: "nubank", brandId: "mastercard", name: "Nubank principal", lastDigits: "1234", limitTotal: 4200, closingDay: 10, dueDay: 18 },
      { id: cardTwo, bankId: "inter", brandId: "visa", name: "Inter compras", lastDigits: "5678", limitTotal: 2800, closingDay: 25, dueDay: 5 },
    ],
    purchases: [
      { id: createId(), description: "Curso online", amount: 900, date: dateInMonth(month, 4), categoryId: "cat-study", cardId: cardOne, installments: 3 },
      { id: createId(), description: "Farmacia", amount: 126.7, date: dateInMonth(month, 8), categoryId: "cat-health", cardId: cardOne, installments: 1 },
      { id: createId(), description: "Jantar", amount: 184.5, date: dateInMonth(month, 16), categoryId: "cat-leisure", cardId: cardTwo, installments: 1 },
    ],
    budgets: [
      { id: createId(), categoryId: "cat-food", limit: 700 },
      { id: createId(), categoryId: "cat-transport", limit: 300 },
      { id: createId(), categoryId: "cat-market", limit: 600 },
      { id: createId(), categoryId: "cat-leisure", limit: 250 },
    ],
    recurringExpenses: [
      { id: createId(), description: "Internet", amount: 119.9, dueDay: 20, categoryId: "cat-bills", paymentMethod: "Pix", active: true },
      { id: createId(), description: "Netflix", amount: 39.9, dueDay: 10, categoryId: "cat-bills", paymentMethod: "Debito", active: true },
      { id: createId(), description: "Academia", amount: 99.9, dueDay: 12, categoryId: "cat-health", paymentMethod: "Debito", active: true },
    ],
    recurringPayments: [],
    invoicePayments: [],
    skippedRecurring: [],
    pendingSms: [
      parseFinancialSms("Compra aprovada no cartao final 1234 no valor de R$ 187,40 em MERCADO EXTRA.", dateInMonth(month, 7), "nubank"),
      parseFinancialSms("Pix enviado para JOAO SILVA no valor de R$ 80,00.", dateInMonth(month, 8), "inter"),
      parseFinancialSms("Compra aprovada no cartao final 5678 no valor de R$ 28,50 em UBER.", dateInMonth(month, 8), "bb"),
      parseFinancialSms("Compra aprovada no cartao final 1234 no valor de R$ 39,90 em NETFLIX.COM.", dateInMonth(month, 10), "nubank"),
    ],
    settings: { smsEnabled: true },
  });
}

function inferBankId(name) {
  const value = String(name || "").toLowerCase();
  if (value.includes("nubank")) return "nubank";
  if (value.includes("inter")) return "inter";
  if (value.includes("itau")) return "itau";
  if (value.includes("bradesco")) return "bradesco";
  if (value.includes("santander")) return "santander";
  if (value.includes("caixa")) return "caixa";
  if (value.includes("c6")) return "c6";
  if (value.includes("picpay")) return "picpay";
  if (value.includes("brasil")) return "bb";
  return "other";
}

function inferLastDigits(name) {
  const match = String(name || "").match(/\d{4}/);
  return match ? match[0] : "";
}

function parseFinancialSms(message, date = todayInput(), bankId = "other") {
  const normalized = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const amountMatch = normalized.match(/R\$\s?([\d.]+,\d{2})/i);
  const finalMatch = normalized.match(/final\s?(\d{4})/i);
  const merchantMatch = normalized.match(/em\s+([A-Z0-9 .-]+)\.?$/i);
  const amount = amountMatch ? Number(amountMatch[1].replaceAll(".", "").replace(",", ".")) : 0;
  const merchant = cleanText(merchantMatch?.[1] || normalized.split(" no valor")[0] || "Lancamento SMS");
  const categoryId = suggestCategory(merchant);
  const isCard = /cartao|compra aprovada/i.test(normalized);
  return {
    id: createId(),
    rawMessage: message,
    title: getBankName(bankId),
    bankId,
    amount,
    date,
    merchant,
    categoryId,
    type: isCard ? "card" : "cash",
    paymentMethod: isCard ? "Cartao" : "Pix",
    cardLastDigits: finalMatch?.[1] || "",
  };
}

function suggestCategory(text) {
  const value = normalizeForSearch(text);
  const match = categoryKeywords.find((item) => item.words.some((word) => value.includes(word)));
  return match?.categoryId || "cat-other-expense";
}

function normalizeForSearch(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function dateInMonth(month, day) {
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  return `${year}-${pad(monthNumber)}-${pad(Math.min(day, lastDay))}`;
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `financas-${selectedMonth}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = normalizeState(JSON.parse(reader.result));
      state = imported;
      persist();
      render();
    } catch {
      alert("Nao foi possivel importar esse arquivo.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
