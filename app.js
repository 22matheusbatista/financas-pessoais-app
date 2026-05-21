const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const STORAGE_KEY = "personal-finance-mvp-v2";
const THEME_STORAGE_KEY = "personal-finance-theme";

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
  sidebarToggle: document.querySelector("#sidebarToggle"),
  sidebarClose: document.querySelector("#sidebarClose"),
  sidebarBackdrop: document.querySelector("#sidebarBackdrop"),
  themeToggle: document.querySelector("#themeToggle"),
  themeToggleLabel: document.querySelector("#themeToggleLabel"),
  monthPicker: document.querySelector("#monthPicker"),
  dashboardMonth: document.querySelector("#dashboardMonth"),
  metricIncome: document.querySelector("#metricIncome"),
  metricExpenses: document.querySelector("#metricExpenses"),
  metricCards: document.querySelector("#metricCards"),
  metricBalance: document.querySelector("#metricBalance"),
  metricAvailable: document.querySelector("#metricAvailable"),
  invoiceOverview: document.querySelector("#invoiceOverview"),
  dueList: document.querySelector("#dueList"),
  categorySummary: document.querySelector("#categorySummary"),
  recentActivity: document.querySelector("#recentActivity"),
  incomeForm: document.querySelector("#incomeForm"),
  expenseForm: document.querySelector("#expenseForm"),
  purchaseForm: document.querySelector("#purchaseForm"),
  categoryForm: document.querySelector("#categoryForm"),
  newCardButton: document.querySelector("#newCardButton"),
  incomeList: document.querySelector("#incomeList"),
  expenseList: document.querySelector("#expenseList"),
  cardList: document.querySelector("#cardList"),
  purchaseList: document.querySelector("#purchaseList"),
  categoryList: document.querySelector("#categoryList"),
  incomeListTotal: document.querySelector("#incomeListTotal"),
  expenseListTotal: document.querySelector("#expenseListTotal"),
  purchaseListTotal: document.querySelector("#purchaseListTotal"),
  installmentPreview: document.querySelector("#installmentPreview"),
};

let state = loadState();
let selectedMonth = getMonthKey(new Date());
let editingCardId = null;
let isCreatingCard = false;

init();
registerServiceWorker();

function init() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "light");
  els.monthPicker.value = selectedMonth;
  setDefaultDates();
  bindEvents();
  render();
}

function bindEvents() {
  document.querySelectorAll(".nav-tab, [data-view-target]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view || button.dataset.viewTarget));
  });

  els.sidebarToggle.addEventListener("click", openSidebar);
  els.sidebarClose.addEventListener("click", closeSidebar);
  els.sidebarBackdrop.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });
  els.themeToggle.addEventListener("click", toggleTheme);

  document.querySelector("#prevMonth").addEventListener("click", () => shiftMonth(-1));
  document.querySelector("#nextMonth").addEventListener("click", () => shiftMonth(1));
  els.monthPicker.addEventListener("change", () => {
    selectedMonth = els.monthPicker.value || getMonthKey(new Date());
    render();
  });

  els.incomeForm.addEventListener("submit", addIncome);
  els.expenseForm.addEventListener("submit", addExpense);
  els.newCardButton.addEventListener("click", startCardCreate);
  els.cardList.addEventListener("submit", saveCardForm);
  els.cardList.addEventListener("input", handleCardFormInput);
  els.cardList.addEventListener("change", handleCardFormInput);
  els.purchaseForm.addEventListener("submit", addPurchase);
  els.categoryForm.addEventListener("submit", addCategory);

  ["amount", "installments", "date", "cardId"].forEach((field) => {
    els.purchaseForm.elements[field].addEventListener("input", renderInstallmentPreview);
    els.purchaseForm.elements[field].addEventListener("change", renderInstallmentPreview);
  });

  document.addEventListener("click", handleDocumentClick);
  document.querySelector("#exportData").addEventListener("click", exportData);
  document.querySelector("#importData").addEventListener("change", importData);
}

function switchView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewName);
  });
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === viewName);
  });
  closeSidebar();
}

function openSidebar() {
  document.body.classList.add("sidebar-open");
  els.sidebarToggle.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  els.sidebarToggle.setAttribute("aria-expanded", "false");
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
}

function applyTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = safeTheme;
  localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
  els.themeToggle.setAttribute("aria-pressed", String(safeTheme === "dark"));
  els.themeToggleLabel.textContent = safeTheme === "dark" ? "Tema claro" : "Tema escuro";
  document.querySelector("meta[name='theme-color']")?.setAttribute("content", safeTheme === "dark" ? "#191919" : "#20785f");
}

function shiftMonth(direction) {
  selectedMonth = addMonths(selectedMonth, direction);
  els.monthPicker.value = selectedMonth;
  render();
}

function addIncome(event) {
  event.preventDefault();
  const form = new FormData(els.incomeForm);
  state.incomes.push({
    id: createId(),
    description: cleanText(form.get("description")),
    amount: toMoney(form.get("amount")),
    date: form.get("date"),
    categoryId: form.get("categoryId"),
  });
  persist();
  els.incomeForm.reset();
  setDefaultDates();
  render();
}

function addExpense(event) {
  event.preventDefault();
  const form = new FormData(els.expenseForm);
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
}

function addPurchase(event) {
  event.preventDefault();
  const form = new FormData(els.purchaseForm);
  if (!state.cards.length) {
    alert("Cadastre um cartao antes de adicionar uma compra.");
    return;
  }
  state.purchases.push({
    id: createId(),
    description: cleanText(form.get("description")),
    amount: toMoney(form.get("amount")),
    date: form.get("date"),
    categoryId: form.get("categoryId"),
    cardId: form.get("cardId"),
    installments: Math.max(1, Number(form.get("installments")) || 1),
  });
  persist();
  els.purchaseForm.reset();
  setDefaultDates();
  render();
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
  render();
}

function handleDocumentClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.action === "delete-income") {
    state.incomes = state.incomes.filter((item) => item.id !== id);
  }
  if (button.dataset.action === "delete-expense") {
    state.expenses = state.expenses.filter((item) => item.id !== id);
  }
  if (button.dataset.action === "delete-purchase") {
    state.purchases = state.purchases.filter((item) => item.id !== id);
  }
  if (button.dataset.action === "delete-card") {
    if (editingCardId === id) cancelCardEdit();
    if (state.purchases.some((purchase) => purchase.cardId === id)) {
      alert("Exclua as compras desse cartao antes de remover o cartao.");
      return;
    }
    state.cards = state.cards.filter((card) => card.id !== id);
  }
  if (button.dataset.action === "edit-card") {
    startCardEdit(id);
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
  switchView("cards");
  renderCards();
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

function render() {
  state = normalizeState(state);
  renderCategoryOptions();
  renderDashboard();
  renderIncome();
  renderExpenses();
  renderCards();
  renderPurchases();
  renderCategories();
  renderInstallmentPreview();
}

function renderDashboard() {
  const summary = getMonthlySummary(selectedMonth);
  els.dashboardMonth.textContent = monthLabel(selectedMonth);
  els.metricIncome.textContent = BRL.format(summary.incomeTotal);
  els.metricExpenses.textContent = BRL.format(summary.cashExpenseTotal);
  els.metricCards.textContent = BRL.format(summary.cardTotal);
  els.metricBalance.textContent = BRL.format(summary.balance);
  els.metricAvailable.textContent = BRL.format(summary.available);
  els.metricBalance.classList.toggle("amount-expense", summary.balance < 0);
  els.metricAvailable.classList.toggle("amount-expense", summary.available < 0);
  renderInvoiceOverview(summary);
  renderDueList(summary);
  renderCategorySummary(summary);
  renderRecentActivity(summary);
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
              <span>${escapeHtml(getBankName(card.bankId))} - ${escapeHtml(getBrandName(card.brandId))}</span>
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

  els.invoiceOverview.innerHTML = rows.length ? rows.join("") : emptyState("Cadastre um cartao para acompanhar faturas.");
}

function renderDueList(summary) {
  const dues = state.cards
    .map((card) => ({
      card,
      total: getCardInvoiceTotal(card.id, selectedMonth),
      dueDate: getInvoiceDueDate(selectedMonth, card.dueDay),
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  els.dueList.innerHTML = dues.length
    ? dues.map((item) => `
        <article class="due-row">
          <div class="due-top">
            <div class="card-title-block">
              <div class="card-identity">${cardIconPair(item.card, "small")}</div>
              <div>
                <strong>${escapeHtml(item.card.name)}</strong>
                <span>${escapeHtml(getBankName(item.card.bankId))} - ${escapeHtml(getBrandName(item.card.brandId))}</span>
              </div>
            </div>
            <strong class="amount-card">${BRL.format(item.total)}</strong>
          </div>
          <span>Vencimento em ${formatDate(item.dueDate)}</span>
        </article>
      `).join("")
    : emptyState(summary.cardTotal > 0 ? "Sem vencimentos cadastrados." : "Sem faturas neste mes.");
}

function renderCategorySummary(summary) {
  const entries = Object.entries(summary.categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .filter(([, amount]) => amount > 0);
  const max = entries.length ? entries[0][1] : 0;

  els.categorySummary.innerHTML = entries.length
    ? entries.map(([categoryId, amount]) => {
        const percent = max > 0 ? (amount / max) * 100 : 0;
        return `
          <article class="category-row">
            <div class="category-meta">
              <strong>${escapeHtml(getCategoryName(categoryId))}</strong>
              <strong>${BRL.format(amount)}</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${percent}%"></div>
            </div>
          </article>
        `;
      }).join("")
    : emptyState("Sem gastos registrados neste mes.");
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
    : emptyState("Sem lancamentos neste mes.");
}

function renderIncome() {
  const items = getIncomesForMonth(selectedMonth).sort((a, b) => b.date.localeCompare(a.date));
  els.incomeListTotal.textContent = BRL.format(sum(items));
  els.incomeList.innerHTML = items.length
    ? items.map((item) => moneyEntryRow(item, "income", "delete-income", `${formatDate(item.date)} - ${getCategoryName(item.categoryId)}`)).join("")
    : emptyState("Nenhuma receita cadastrada para este mes.");
}

function renderExpenses() {
  const items = getCashExpensesForMonth(selectedMonth).sort((a, b) => b.date.localeCompare(a.date));
  els.expenseListTotal.textContent = BRL.format(sum(items));
  els.expenseList.innerHTML = items.length
    ? items.map((item) => moneyEntryRow(item, "expense", "delete-expense", `${formatDate(item.date)} - ${getCategoryName(item.categoryId)} - ${item.paymentMethod}`)).join("")
    : emptyState("Nenhuma despesa a vista cadastrada para este mes.");
}

function renderCards() {
  const rows = [];
  if (isCreatingCard) rows.push(cardFormRow());

  state.cards.forEach((card) => {
    if (editingCardId === card.id) {
      rows.push(cardFormRow(card));
      return;
    }

    const invoice = getCardInvoiceTotal(card.id, selectedMonth);
    const openAmount = getCardOpenAmount(card.id, selectedMonth);
    const available = getCardAvailableLimit(card.id, selectedMonth);
    rows.push(`
      <article class="card-row">
        <div class="card-top">
          <div class="card-title-block">
            <div class="card-identity">${cardIconPair(card)}</div>
            <div>
              <strong>${escapeHtml(card.name)}</strong>
              <span>${escapeHtml(getBankName(card.bankId))} - ${escapeHtml(getBrandName(card.brandId))}</span>
              <span>Fecha dia ${card.closingDay} - vence dia ${card.dueDay}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="small-action" type="button" data-action="edit-card" data-id="${card.id}">Editar</button>
            <button class="delete-button" type="button" data-action="delete-card" data-id="${card.id}" aria-label="Excluir cartao">&times;</button>
          </div>
        </div>
        <div class="card-kpis">
          <div>
            <span>Fatura atual</span>
            <strong>${BRL.format(invoice)}</strong>
          </div>
          <div>
            <span>Limite total</span>
            <strong>${BRL.format(card.limitTotal)}</strong>
          </div>
          <div>
            <span>Comprometido</span>
            <strong>${BRL.format(openAmount)}</strong>
          </div>
          <div>
            <span>Disponivel</span>
            <strong>${BRL.format(available)}</strong>
          </div>
        </div>
      </article>
    `);
  });

  els.newCardButton.disabled = isCreatingCard;
  els.cardList.innerHTML = rows.length ? rows.join("") : emptyState("Cadastre seu primeiro cartao.");
}

function renderPurchases() {
  const installments = getInstallmentsForMonth(selectedMonth).sort((a, b) => b.purchase.date.localeCompare(a.purchase.date));
  els.purchaseListTotal.textContent = BRL.format(sumAmounts(installments.map((item) => item.amount)));
  els.purchaseList.innerHTML = installments.length
    ? installments.map((item) => {
        const purchase = item.purchase;
        const meta = `${formatDate(purchase.date)} - ${getCardName(purchase.cardId)} - ${item.number}/${item.totalInstallments}`;
        return moneyEntryRow(
          { id: purchase.id, description: purchase.description, amount: item.amount },
          "card",
          "delete-purchase",
          meta,
        );
      }).join("")
    : emptyState("Nenhuma parcela cai neste mes.");
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
        Limite total
        <input name="limitTotal" type="number" min="1" step="0.01" placeholder="0,00" value="${card?.limitTotal || ""}" required />
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
  els.categoryList.innerHTML = state.categories
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => `
      <article class="entry-row">
        <div class="entry-title">
          <strong>${escapeHtml(category.name)}</strong>
          <span>${categoryTypes[category.type]}</span>
        </div>
        <span class="pill ${category.type}">${category.locked ? "Padrao" : "Personalizada"}</span>
        <button class="delete-button" type="button" data-action="delete-category" data-id="${category.id}" aria-label="Excluir categoria" ${category.locked ? "disabled" : ""}>&times;</button>
      </article>
    `).join("");
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
  els.purchaseForm.querySelector("button[type='submit']").disabled = !state.cards.length;
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
  els.installmentPreview.textContent = `${installments}x de ${BRL.format(split[0])} - primeira fatura em ${monthLabel(firstMonth)}`;
}

function moneyEntryRow(item, kind, action, meta) {
  const amountClass = kind === "income" ? "amount-income" : kind === "card" ? "amount-card" : "amount-expense";
  const sign = kind === "income" ? "+" : "-";
  return `
    <article class="entry-row">
      <div class="entry-title">
        <strong>${escapeHtml(item.description)}</strong>
        <span>${escapeHtml(meta)}</span>
      </div>
      <strong class="${amountClass}">${sign} ${BRL.format(item.amount)}</strong>
      <button class="delete-button" type="button" data-action="${action}" data-id="${item.id}" aria-label="Excluir lancamento">&times;</button>
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

function getMonthlySummary(month) {
  const incomes = getIncomesForMonth(month);
  const cashExpenses = getCashExpensesForMonth(month);
  const cardInstallments = getInstallmentsForMonth(month);
  const incomeTotal = sum(incomes);
  const cashExpenseTotal = sum(cashExpenses);
  const cardTotal = sumAmounts(cardInstallments.map((item) => item.amount));
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
    incomeTotal,
    cashExpenseTotal,
    cardTotal,
    balance: incomeTotal - cashExpenseTotal - cardTotal,
    available: incomeTotal - cashExpenseTotal - cardTotal,
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
  return state.purchases.flatMap((purchase) => getInstallmentsForPurchase(purchase)).filter((item) => item.month === month);
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
  const parts = parseDateParts(dateString);
  const purchaseMonth = getMonthKey(dateString);
  return parts.day > card.closingDay ? addMonths(purchaseMonth, 1) : purchaseMonth;
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
  return `${card.name} - ${getBankName(card.bankId)} - ${getBrandName(card.brandId)}`;
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

function setDefaultDates() {
  const today = todayInput();
  els.incomeForm.elements.date.value = today;
  els.expenseForm.elements.date.value = today;
  els.purchaseForm.elements.date.value = today;
  els.purchaseForm.elements.installments.value = "1";
}

function sum(items) {
  return sumAmounts(items.map((item) => item.amount));
}

function sumAmounts(amounts) {
  return amounts.reduce((total, amount) => total + Number(amount || 0), 0);
}

function toMoney(value) {
  return Math.max(0, Math.round(Number(value || 0) * 100) / 100);
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

function emptyState(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
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
  };

  defaultCategories.forEach((category) => {
    if (!normalized.categories.some((item) => item.id === category.id)) normalized.categories.push(category);
  });

  normalized.cards = normalized.cards.map((card) => ({
    ...card,
    bankId: card.bankId || inferBankId(card.name),
    brandId: card.brandId || "mastercard",
  }));

  return normalized;
}

function createSeedData() {
  const month = getMonthKey(new Date());
  const cardOne = createId();
  const cardTwo = createId();
  return normalizeState({
    categories: structuredClone(defaultCategories),
    incomes: [
      { id: createId(), description: "Salario", amount: 6200, date: dateInMonth(month, 5), categoryId: "cat-salary" },
      { id: createId(), description: "Freela landing page", amount: 850, date: dateInMonth(month, 12), categoryId: "cat-freela" },
    ],
    expenses: [
      { id: createId(), description: "Aluguel", amount: 1650, date: dateInMonth(month, 6), categoryId: "cat-bills", paymentMethod: "Pix" },
      { id: createId(), description: "Mercado do mes", amount: 438.9, date: dateInMonth(month, 9), categoryId: "cat-market", paymentMethod: "Debito" },
      { id: createId(), description: "Transporte", amount: 142.4, date: dateInMonth(month, 15), categoryId: "cat-transport", paymentMethod: "Pix" },
    ],
    cards: [
      { id: cardOne, bankId: "nubank", brandId: "mastercard", name: "Nubank principal", limitTotal: 4200, closingDay: 10, dueDay: 18 },
      { id: cardTwo, bankId: "inter", brandId: "visa", name: "Inter compras", limitTotal: 2800, closingDay: 25, dueDay: 5 },
    ],
    purchases: [
      { id: createId(), description: "Curso online", amount: 900, date: dateInMonth(month, 4), categoryId: "cat-study", cardId: cardOne, installments: 3 },
      { id: createId(), description: "Farmacia", amount: 126.7, date: dateInMonth(month, 8), categoryId: "cat-health", cardId: cardOne, installments: 1 },
      { id: createId(), description: "Jantar", amount: 184.5, date: dateInMonth(month, 16), categoryId: "cat-leisure", cardId: cardTwo, installments: 1 },
    ],
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
