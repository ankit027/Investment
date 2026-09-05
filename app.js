// ==========================================
// ANKIT INVESTMENT HUB
// FRONTEND APPLICATION
// ==========================================


// ==========================================
// GOOGLE APPS SCRIPT API
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbw3HjV_sDrY8KNmGge2ChFLyg3gicZlNFfw_4xTspr3ZodPpmbJBmZsdMiu26f51R_5/exec";


// ==========================================
// GLOBAL DATA
// ==========================================

let recommendations = [];
let sipBaskets = [];
let optionTrades = [];


// ==========================================
// DOM READY
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupNavigation();

    setupDarkMode();

    setupRecommendationForm();

    setupSIP();

    setupOptions();

    setupDashboard();

    setTodayDates();

    await loadData();

  }
);


// ==========================================
// SAFE ELEMENT HELPER
// ==========================================

function getElement(id) {

  return document.getElementById(id);

}


// ==========================================
// API GET
// ==========================================

async function apiGet(action) {

  const response =
    await fetch(
      `${API_URL}?action=${encodeURIComponent(action)}`
    );

  if (!response.ok) {

    throw new Error(
      `API request failed: ${response.status}`
    );

  }

  return await response.json();

}


// ==========================================
// API POST
// ==========================================

async function apiPost(
  action,
  data
) {

  const response =
    await fetch(
      API_URL,
      {

        method: "POST",

        body:
          JSON.stringify({

            action,
            data

          })

      }
    );


  if (!response.ok) {

    throw new Error(
      `API request failed: ${response.status}`
    );

  }


  return await response.json();

}


// ==========================================
// LOAD ALL DATA
// ==========================================

async function loadData() {

  try {

    showToast(
      "Loading latest data..."
    );


    const data =
      await apiGet(
        "dashboard"
      );


    if (
      data.success === false
    ) {

      throw new Error(
        data.error ||
        data.message ||
        "Unable to load data"
      );

    }


    recommendations =
      Array.isArray(
        data.recommendations
      )
        ? data.recommendations
        : [];


    sipBaskets =
      Array.isArray(
        data.sipBaskets
      )
        ? data.sipBaskets
        : [];


    optionTrades =
      Array.isArray(
        data.options
      )
        ? data.options
        : [];


    populateMonthFilters();

    renderDashboard();

    renderRecommendations();

    renderSIPBasket();

    renderOptions();


    showToast(
      "Data loaded successfully"
    );

  }

  catch (error) {

    console.error(
      "Load Data Error:",
      error
    );


    showToast(
      "Unable to load data"
    );

  }

}


// ==========================================
// NAVIGATION
// ==========================================

function setupNavigation() {

  const buttons =
    document.querySelectorAll(
      ".nav-btn"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const pageId =
            button.dataset.page;


          if (!pageId) {

            return;

          }


          buttons.forEach(
            item => {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          document
            .querySelectorAll(
              ".page"
            )
            .forEach(
              page => {

                page.classList.remove(
                  "active"
                );

              }
            );


          const page =
            getElement(
              pageId
            );


          if (page) {

            page.classList.add(
              "active"
            );

          }

        }
      );

    }
  );

}


// ==========================================
// DARK MODE
// ==========================================

function setupDarkMode() {

  const button =
    getElement(
      "darkModeBtn"
    );


  // If button does not exist,
  // do not stop entire application

  if (!button) {

    console.warn(
      "Dark mode button not found"
    );

    return;

  }


  const savedMode =
    localStorage.getItem(
      "investmentHubTheme"
    );


  if (
    savedMode === "dark"
  ) {

    document.body.classList.add(
      "dark"
    );

  }


  updateThemeButton();


  button.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "dark"
      );


      const isDark =
        document.body.classList.contains(
          "dark"
        );


      localStorage.setItem(
        "investmentHubTheme",
        isDark
          ? "dark"
          : "light"
      );


      updateThemeButton();

    }
  );

}


// ==========================================
// UPDATE DARK MODE BUTTON
// ==========================================

function updateThemeButton() {

  const button =
    getElement(
      "darkModeBtn"
    );


  if (!button) {

    return;

  }


  const isDark =
    document.body.classList.contains(
      "dark"
    );


  button.textContent =
    isDark
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";

}


// ==========================================
// SET TODAY DATE
// ==========================================

function setTodayDates() {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  const recDate =
    getElement(
      "recDate"
    );


  if (
    recDate &&
    !recDate.value
  ) {

    recDate.value =
      today;

  }


  const optionDate =
    getElement(
      "optionDate"
    );


  if (
    optionDate &&
    !optionDate.value
  ) {

    optionDate.value =
      today;

  }

}


// ==========================================
// DASHBOARD EVENTS
// ==========================================

function setupDashboard() {

  const dashboardMonth =
    getElement(
      "dashboardMonthFilter"
    );


  if (dashboardMonth) {

    dashboardMonth.addEventListener(
      "change",
      renderDashboard
    );

  }


  const dashboardType =
    getElement(
      "dashboardTypeFilter"
    );


  if (dashboardType) {

    dashboardType.addEventListener(
      "change",
      renderDashboard
    );

  }


  const optionMonth =
    getElement(
      "dashboardOptionMonthFilter"
    );


  if (optionMonth) {

    optionMonth.addEventListener(
      "change",
      renderDashboard
    );

  }


  const optionStatus =
    getElement(
      "dashboardOptionStatusFilter"
    );


  if (optionStatus) {

    optionStatus.addEventListener(
      "change",
      renderDashboard
    );

  }


  const refreshButton =
    getElement(
      "refreshDashboardBtn"
    );


  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      async () => {

        refreshButton.disabled =
          true;


        refreshButton.textContent =
          "Loading...";


        await loadData();


        refreshButton.disabled =
          false;


        refreshButton.textContent =
          "↻ Refresh";

      }
    );

  }

}


// ==========================================
// MONTH FILTERS
// ==========================================

function populateMonthFilters() {

  const recommendationMonths =
    getUniqueMonths(
      recommendations
    );


  const optionMonths =
    getUniqueMonths(
      optionTrades
    );


  populateSelect(
    "recommendationMonthFilter",
    recommendationMonths
  );


  populateSelect(
    "dashboardMonthFilter",
    recommendationMonths
  );


  populateSelect(
    "optionMonthFilter",
    optionMonths
  );


  populateSelect(
    "dashboardOptionMonthFilter",
    optionMonths
  );

}


// ==========================================
// UNIQUE MONTHS
// ==========================================

function getUniqueMonths(data) {

  const months =
    new Set();


  data.forEach(
    item => {

      if (
        item.Date
      ) {

        const value =
          String(
            item.Date
          );


        const month =
          value.substring(
            0,
            7
          );


        if (
          month.length === 7
        ) {

          months.add(
            month
          );

        }

      }

    }
  );


  return [
    ...months
  ]
    .sort()
    .reverse();

}


// ==========================================
// POPULATE SELECT
// ==========================================

function populateSelect(
  id,
  months
) {

  const select =
    getElement(
      id
    );


  if (!select) {

    return;

  }


  const currentValue =
    select.value;


  select.innerHTML =
    '<option value="">All Months</option>';


  months.forEach(
    month => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        month;


      option.textContent =
        formatMonth(
          month
        );


      select.appendChild(
        option
      );

    }
  );


  if (
    months.includes(
      currentValue
    )
  ) {

    select.value =
      currentValue;

  }

}


// ==========================================
// FORMAT MONTH
// ==========================================

function formatMonth(value) {

  if (!value) {

    return "";

  }


  const date =
    new Date(
      value +
      "-01"
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return date.toLocaleDateString(
    "en-IN",
    {

      month: "long",

      year: "numeric"

    }
  );

}


// ==========================================
// FILTER RECOMMENDATIONS
// ==========================================

function getFilteredDashboardRecommendations() {

  const month =
    getElement(
      "dashboardMonthFilter"
    )?.value ||
    "";


  const type =
    getElement(
      "dashboardTypeFilter"
    )?.value ||
    "";


  return recommendations.filter(
    item => {

      const monthMatch =
        !month ||
        String(
          item.Date ||
          ""
        ).startsWith(
          month
        );


      const typeMatch =
        !type ||
        item.Type ===
        type;


      return (
        monthMatch &&
        typeMatch
      );

    }
  );

}


// ==========================================
// RENDER DASHBOARD
// ==========================================

function renderDashboard() {

  const data =
    getFilteredDashboardRecommendations();


  setText(
    "totalRecommendations",
    data.length
  );


  setText(
    "activeRecommendations",
    data.filter(
      item =>
        item.Status ===
        "Active"
    ).length
  );


  setText(
    "targetHit",
    data.filter(
      item =>
        item.Status ===
        "Target Hit"
    ).length
  );


  setText(
    "slHit",
    data.filter(
      item =>
        item.Status ===
        "SL Hit"
    ).length
  );


  const averageReturn =
    data.length > 0

      ?

      data.reduce(
        (
          total,
          item
        ) =>

          total +
          Number(
            item.Return_Percent ||
            0
          ),

        0
      )

      /
      data.length

      :

      0;


  setText(
    "averageReturn",
    averageReturn.toFixed(2) +
    "%"
  );


  const tbody =
    getElement(
      "dashboardRecommendationsTable"
    );


  if (tbody) {

    tbody.innerHTML =
      "";


    data
      .slice(
        0,
        10
      )
      .forEach(
        item => {

          const row =
            document.createElement(
              "tr"
            );


          row.innerHTML =
            `
            <td>${escapeHtml(item.Date || "")}</td>

            <td>${escapeHtml(item.Name || "")}</td>

            <td>${escapeHtml(item.Type || "")}</td>

            <td>
              ₹${formatNumber(item.Entry_CMP)}
            </td>

            <td>
              ₹${formatNumber(item.Current_CMP)}
            </td>

            <td class="${
              Number(
                item.Return_Percent
              ) >= 0
                ? "positive"
                : "negative"
            }">
              ${formatNumber(
                item.Return_Percent
              )}%
            </td>

            <td>
              ${statusBadge(
                item.Status
              )}
            </td>
            `;


          tbody.appendChild(
            row
          );

        }
      );

  }


  renderOptionDashboard();

}


// ==========================================
// RENDER OPTION DASHBOARD
// ==========================================

function renderOptionDashboard() {

  const month =
    getElement(
      "dashboardOptionMonthFilter"
    )?.value ||
    "";


  const status =
    getElement(
      "dashboardOptionStatusFilter"
    )?.value ||
    "";


  const data =
    optionTrades.filter(
      item => {

        const monthMatch =
          !month ||
          String(
            item.Date ||
            ""
          ).startsWith(
            month
          );


        const statusMatch =
          !status ||
          item.Status ===
          status;


        return (
          monthMatch &&
          statusMatch
        );

      }
    );


  setText(
    "totalOptionTrades",
    data.length
  );


  setText(
    "openOptionTrades",
    data.filter(
      item =>
        item.Status ===
        "Open"
    ).length
  );


  setText(
    "optionTargetHit",
    data.filter(
      item =>
        item.Status ===
        "Target Hit"
    ).length
  );


  setText(
    "optionSLHit",
    data.filter(
      item =>
        item.Status ===
        "SL Hit"
    ).length
  );


  const netPL =
    data.reduce(
      (
        total,
        item
      ) =>

        total +
        Number(
          item.Net_PL ||
          0
        ),

      0
    );


  const netPLField =
    getElement(
      "optionNetPL"
    );


  if (netPLField) {

    netPLField.textContent =
      "₹" +
      formatNumber(
        netPL
      );


    netPLField.className =
      netPL >= 0
        ? "positive"
        : "negative";

  }

}


// ==========================================
// RECOMMENDATION FORM
// ==========================================

function setupRecommendationForm() {

  const form =
    getElement(
      "recommendationForm"
    );


  const showButton =
    getElement(
      "showRecommendationFormBtn"
    );


  if (showButton) {

    showButton.addEventListener(
      "click",
      openNewRecommendationForm
    );

  }


  const cancelButton =
    getElement(
      "cancelRecommendationBtn"
    );


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      closeRecommendationForm
    );

  }


  if (form) {

    form.addEventListener(
      "submit",
      saveRecommendation
    );

  }


  [
    "recommendationSearch",
    "recommendationMonthFilter",
    "recommendationTypeFilter",
    "recommendationStatusFilter"
  ]
    .forEach(
      id => {

        const element =
          getElement(
            id
          );


        if (!element) {

          return;

        }


        element.addEventListener(
          "input",
          renderRecommendations
        );


        element.addEventListener(
          "change",
          renderRecommendations
        );

      }
    );

}


// ==========================================
// OPEN NEW RECOMMENDATION FORM
// ==========================================

function openNewRecommendationForm() {

  const container =
    getElement(
      "recommendationFormContainer"
    );


  const form =
    getElement(
      "recommendationForm"
    );


  if (container) {

    container.classList.remove(
      "hidden"
    );

  }


  if (form) {

    form.reset();

  }


  setText(
    "recommendationFormTitle",
    "Add Recommendation"
  );


  const idField =
    getElement(
      "recommendationId"
    );


  if (idField) {

    idField.value =
      "";

  }


  const dateField =
    getElement(
      "recDate"
    );


  if (dateField) {

    dateField.value =
      new Date()
        .toISOString()
        .split("T")[0];

  }

}


// ==========================================
// SAVE RECOMMENDATION
// ==========================================

async function saveRecommendation(
  event
) {

  event.preventDefault();


  const id =
    getElement(
      "recommendationId"
    )?.value ||
    "";


  const data = {

    id,

    date:
      getElement(
        "recDate"
      )?.value ||
      "",

    name:
      getElement(
        "recName"
      )?.value ||
      "",

    symbol:
      (
        getElement(
          "recSymbol"
        )?.value ||
        ""
      )
        .trim()
        .toUpperCase(),

    type:
      getElement(
        "recType"
      )?.value ||
      "Stock",

    entryCMP:
      Number(
        getElement(
          "recEntry"
        )?.value ||
        0
      ),

    target:
      Number(
        getElement(
          "recTarget"
        )?.value ||
        0
      ),

    stopLoss:
      Number(
        getElement(
          "recStopLoss"
        )?.value ||
        0
      ),

    timeFrame:
      getElement(
        "recTimeFrame"
      )?.value ||
      "",

    remarks:
      getElement(
        "recRemarks"
      )?.value ||
      ""

  };


  try {

    let result;


    if (id) {

      result =
        await apiPost(
          "updateRecommendation",
          data
        );

    }

    else {

      result =
        await apiPost(
          "addRecommendation",
          data
        );

    }


    if (
      result &&
      result.success === false
    ) {

      throw new Error(
        result.message ||
        "Unable to save"
      );

    }


    showToast(
      id
        ? "Recommendation updated"
        : "Recommendation saved"
    );


    closeRecommendationForm();


    await loadData();

  }

  catch (error) {

    console.error(
      "Save Recommendation Error:",
      error
    );


    showToast(
      "Unable to save recommendation"
    );

  }

}


// ==========================================
// CLOSE RECOMMENDATION FORM
// ==========================================

function closeRecommendationForm() {

  const container =
    getElement(
      "recommendationFormContainer"
    );


  if (container) {

    container.classList.add(
      "hidden"
    );

  }

}


// ==========================================
// FILTER RECOMMENDATIONS
// ==========================================

function getFilteredRecommendations() {

  const search =
    (
      getElement(
        "recommendationSearch"
      )?.value ||
      ""
    )
      .toLowerCase()
      .trim();


  const month =
    getElement(
      "recommendationMonthFilter"
    )?.value ||
    "";


  const type =
    getElement(
      "recommendationTypeFilter"
    )?.value ||
    "";


  const status =
    getElement(
      "recommendationStatusFilter"
    )?.value ||
    "";


  return recommendations.filter(
    item => {

      const name =
        String(
          item.Name ||
          ""
        )
          .toLowerCase();


      const symbol =
        String(
          item.Symbol ||
          ""
        )
          .toLowerCase();


      const searchMatch =
        !search ||
        name.includes(
          search
        ) ||
        symbol.includes(
          search
        );


      const monthMatch =
        !month ||
        String(
          item.Date ||
          ""
        ).startsWith(
          month
        );


      const typeMatch =
        !type ||
        item.Type ===
        type;


      const statusMatch =
        !status ||
        item.Status ===
        status;


      return (
        searchMatch &&
        monthMatch &&
        typeMatch &&
        statusMatch
      );

    }
  );

}


// ==========================================
// RENDER RECOMMENDATIONS
// ==========================================

function renderRecommendations() {

  const tbody =
    getElement(
      "recommendationsTable"
    );


  if (!tbody) {

    return;

  }


  const data =
    getFilteredRecommendations();


  tbody.innerHTML =
    "";


  if (
    data.length === 0
  ) {

    tbody.innerHTML =
      `
      <tr>
        <td colspan="11">
          No recommendations found.
        </td>
      </tr>
      `;

    return;

  }


  data.forEach(
    item => {

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML =
        `
        <td>${escapeHtml(item.Date || "")}</td>

        <td>${escapeHtml(item.Name || "")}</td>

        <td>${escapeHtml(item.Symbol || "")}</td>

        <td>${escapeHtml(item.Type || "")}</td>

        <td>
          ₹${formatNumber(item.Entry_CMP)}
        </td>

        <td>
          ₹${formatNumber(item.Current_CMP)}
        </td>

        <td>
          ₹${formatNumber(item.Target)}
        </td>

        <td>
          ₹${formatNumber(item.Stop_Loss)}
        </td>

        <td class="${
          Number(
            item.Return_Percent
          ) >= 0
            ? "positive"
            : "negative"
        }">

          ${formatNumber(
            item.Return_Percent
          )}%

        </td>

        <td>
          ${statusBadge(
            item.Status
          )}
        </td>

        <td>
          <button
            class="action-btn edit-btn"
            data-action="edit"
            data-id="${escapeAttribute(item.ID)}"
          >
            Edit
          </button>

          <button
            class="action-btn delete-btn"
            data-action="delete"
            data-id="${escapeAttribute(item.ID)}"
          >
            Delete
          </button>
        </td>
        `;


      const editButton =
        row.querySelector(
          '[data-action="edit"]'
        );


      const deleteButton =
        row.querySelector(
          '[data-action="delete"]'
        );


      if (editButton) {

        editButton.addEventListener(
          "click",
          () => {

            editRecommendation(
              item.ID
            );

          }
        );

      }


      if (deleteButton) {

        deleteButton.addEventListener(
          "click",
          () => {

            deleteRecommendation(
              item.ID
            );

          }
        );

      }


      tbody.appendChild(
        row
      );

    }
  );

}


// ==========================================
// EDIT RECOMMENDATION
// ==========================================

function editRecommendation(id) {

  const item =
    recommendations.find(
      recommendation =>

        String(
          recommendation.ID
        ) ===
        String(
          id
        )
    );


  if (!item) {

    showToast(
      "Recommendation not found"
    );

    return;

  }


  const container =
    getElement(
      "recommendationFormContainer"
    );


  if (container) {

    container.classList.remove(
      "hidden"
    );

  }


  setText(
    "recommendationFormTitle",
    "Edit Recommendation"
  );


  setValue(
    "recommendationId",
    item.ID
  );


  setValue(
    "recDate",
    String(
      item.Date ||
      ""
    ).substring(
      0,
      10
    )
  );


  setValue(
    "recName",
    item.Name ||
    ""
  );


  setValue(
    "recSymbol",
    item.Symbol ||
    ""
  );


  setValue(
    "recType",
    item.Type ||
    "Stock"
  );


  setValue(
    "recEntry",
    item.Entry_CMP ||
    ""
  );


  setValue(
    "recTarget",
    item.Target ||
    ""
  );


  setValue(
    "recStopLoss",
    item.Stop_Loss ||
    ""
  );


  setValue(
    "recTimeFrame",
    item.Time_Frame ||
    ""
  );


  setValue(
    "recRemarks",
    item.Remarks ||
    ""
  );


  const page =
    getElement(
      "recommendations"
    );


  if (page) {

    page.scrollIntoView(
      {

        behavior: "smooth",

        block: "start"

      }
    );

  }

}


// ==========================================
// DELETE RECOMMENDATION
// ==========================================

async function deleteRecommendation(
  id
) {

  const confirmed =
    confirm(
      "Delete this recommendation?"
    );


  if (!confirmed) {

    return;

  }


  try {

    const result =
      await apiPost(
        "deleteRecommendation",
        {
          id
        }
      );


    if (
      result &&
      result.success
    ) {

      showToast(
        "Recommendation deleted"
      );


      await loadData();

    }

    else {

      showToast(
        result?.message ||
        "Unable to delete recommendation"
      );

    }

  }

  catch (error) {

    console.error(
      "Delete Error:",
      error
    );


    showToast(
      "Unable to delete recommendation"
    );

  }

}


// ==========================================
// SIP SETUP
// ==========================================

function setupSIP() {

  const filter =
    getElement(
      "sipAmountFilter"
    );


  if (filter) {

    filter.addEventListener(
      "change",
      renderSIPBasket
    );

  }


  const form =
    getElement(
      "customSIPForm"
    );


  if (form) {

    form.addEventListener(
      "submit",
      saveCustomSIP
    );

  }

}


// ==========================================
// RENDER SIP BASKET
// ==========================================

function renderSIPBasket() {

  const amount =
    getElement(
      "sipAmountFilter"
    )?.value ||
    "";


  const container =
    getElement(
      "sipBasketContainer"
    );


  if (!container) {

    return;

  }


  if (!amount) {

    container.innerHTML =
      `
      <div class="empty-state">
        Select a monthly SIP amount to view the allocation.
      </div>
      `;

    return;

  }


  const basket =
    sipBaskets.filter(
      item =>

        String(
          item.Monthly_Amount
        ) ===
        String(
          amount
        )
    );


  if (
    basket.length === 0
  ) {

    container.innerHTML =
      `
      <div class="empty-state">
        No SIP basket found.
      </div>
      `;

    return;

  }


  let html =
    `
    <div class="sip-card">

      <h2>
        SIP Breakup for ₹${formatNumber(amount)}
      </h2>
    `;


  basket.forEach(
    item => {

      html +=
        `
        <div class="sip-row">

          <div>

            <strong>
              ${escapeHtml(
                item.Investment_Name
              )}
            </strong>

            <div>
              ${escapeHtml(
                item.Investment_Type
              )}
            </div>

          </div>

          <div>

            ₹${formatNumber(
              item.Allocation_Amount
            )}

          </div>

        </div>
        `;

    }
  );


  html +=
    `</div>`;


  container.innerHTML =
    html;

}


// ==========================================
// SAVE CUSTOM SIP
// ==========================================

async function saveCustomSIP(
  event
) {

  event.preventDefault();


  const data = {

    planName:
      getElement(
        "sipPlanName"
      )?.value ||
      "",

    monthlyAmount:
      Number(
        getElement(
          "sipMonthlyAmount"
        )?.value ||
        0
      ),

    investmentName:
      getElement(
        "sipInvestmentName"
      )?.value ||
      "",

    investmentType:
      getElement(
        "sipInvestmentType"
      )?.value ||
      "",

    allocationPercent:
      Number(
        getElement(
          "sipAllocationPercent"
        )?.value ||
        0
      )

  };


  try {

    const result =
      await apiPost(
        "addCustomSIP",
        data
      );


    if (
      result &&
      result.success === false
    ) {

      throw new Error(
        result.message ||
        "Unable to save SIP"
      );

    }


    showToast(
      "Custom SIP added"
    );


    event.target.reset();

  }

  catch (error) {

    console.error(
      "SIP Error:",
      error
    );


    showToast(
      "Unable to save SIP"
    );

  }

}


// ==========================================
// OPTIONS SETUP
// ==========================================

function setupOptions() {

  const legsContainer =
    getElement(
      "optionLegsContainer"
    );


  if (
    legsContainer &&
    legsContainer.children.length === 0
  ) {

    addOptionLeg();

  }


  const addButton =
    getElement(
      "addOptionLegBtn"
    );


  if (addButton) {

    addButton.addEventListener(
      "click",
      addOptionLeg
    );

  }


  const form =
    getElement(
      "optionTradeForm"
    );


  if (form) {

    form.addEventListener(
      "submit",
      saveOptionTrade
    );

  }


  [
    "optionSearch",
    "optionMonthFilter",
    "optionStatusFilter"
  ]
    .forEach(
      id => {

        const element =
          getElement(
            id
          );


        if (!element) {

          return;

        }


        element.addEventListener(
          "input",
          renderOptions
        );


        element.addEventListener(
          "change",
          renderOptions
        );

      }
    );

}


// ==========================================
// ADD OPTION LEG
// ==========================================

function addOptionLeg() {

  const container =
    getElement(
      "optionLegsContainer"
    );


  if (!container) {

    return;

  }


  const leg =
    document.createElement(
      "div"
    );


  leg.className =
    "option-leg";


  leg.innerHTML =
    `
    <input
      class="strike-price"
      type="number"
      placeholder="Strike"
      required
    >

    <select class="option-type">

      <option value="CE">
        CE
      </option>

      <option value="PE">
        PE
      </option>

    </select>


    <select class="position">

      <option value="BUY">
        BUY
      </option>

      <option value="SELL">
        SELL
      </option>

    </select>


    <input
      class="entry-premium"
      type="number"
      step="0.01"
      placeholder="Entry Premium"
      required
    >


    <input
      class="current-premium"
      type="number"
      step="0.01"
      placeholder="Current Premium"
    >


    <button
      type="button"
      class="remove-leg"
    >
      ×
    </button>
    `;


  const removeButton =
    leg.querySelector(
      ".remove-leg"
    );


  if (removeButton) {

    removeButton.addEventListener(
      "click",
      () => {

        const legs =
          document.querySelectorAll(
            ".option-leg"
          );


        if (
          legs.length > 1
        ) {

          leg.remove();

        }

      }
    );

  }


  container.appendChild(
    leg
  );

}


// ==========================================
// SAVE OPTION TRADE
// ==========================================

async function saveOptionTrade(
  event
) {

  event.preventDefault();


  const legs =
    [];


  document
    .querySelectorAll(
      ".option-leg"
    )
    .forEach(
      leg => {

        const entry =
          Number(
            leg
              .querySelector(
                ".entry-premium"
              )
              ?.value ||
            0
          );


        const currentField =
          leg.querySelector(
            ".current-premium"
          );


        const current =
          Number(
            currentField?.value ||
            entry
          );


        legs.push({

          strikePrice:
            Number(
              leg
                .querySelector(
                  ".strike-price"
                )
                ?.value ||
              0
            ),

          optionType:
            leg
              .querySelector(
                ".option-type"
              )
              ?.value ||
            "",

          position:
            leg
              .querySelector(
                ".position"
              )
              ?.value ||
            "",

          entryPremium:
            entry,

          currentPremium:
            current

        });

      }
    );


  const data = {

    date:
      getElement(
        "optionDate"
      )?.value ||
      "",

    underlying:
      getElement(
        "optionUnderlying"
      )?.value ||
      "",

    expiry:
      getElement(
        "optionExpiry"
      )?.value ||
      "",

    strategy:
      getElement(
        "optionStrategy"
      )?.value ||
      "",

    lotSize:
      Number(
        getElement(
          "optionLotSize"
        )?.value ||
        1
      ),

    lots:
      Number(
        getElement(
          "optionLots"
        )?.value ||
        1
      ),

    targetPercent:
      Number(
        getElement(
          "optionTargetPercent"
        )?.value ||
        0
      ),

    slPercent:
      Number(
        getElement(
          "optionSLPercent"
        )?.value ||
        0
      ),

    remarks:
      getElement(
        "optionRemarks"
      )?.value ||
      "",

    legs

  };


  try {

    const result =
      await apiPost(
        "addOptionTrade",
        data
      );


    if (
      result &&
      result.success === false
    ) {

      throw new Error(
        result.message ||
        "Unable to save option trade"
      );

    }


    showToast(
      "Option trade saved"
    );


    event.target.reset();


    const legsContainer =
      getElement(
        "optionLegsContainer"
      );


    if (legsContainer) {

      legsContainer.innerHTML =
        "";

      addOptionLeg();

    }


    setTodayDates();


    await loadData();

  }

  catch (error) {

    console.error(
      "Option Save Error:",
      error
    );


    showToast(
      "Unable to save option trade"
    );

  }

}


// ==========================================
// RENDER OPTIONS
// ==========================================

function renderOptions() {

  const tbody =
    getElement(
      "optionTradesTable"
    );


  if (!tbody) {

    return;

  }


  const search =
    (
      getElement(
        "optionSearch"
      )?.value ||
      ""
    )
      .toLowerCase()
      .trim();


  const month =
    getElement(
      "optionMonthFilter"
    )?.value ||
    "";


  const status =
    getElement(
      "optionStatusFilter"
    )?.value ||
    "";


  const data =
    optionTrades.filter(
      item => {

        const underlying =
          String(
            item.Underlying ||
            ""
          )
            .toLowerCase();


        const searchMatch =
          !search ||
          underlying.includes(
            search
          );


        const monthMatch =
          !month ||
          String(
            item.Date ||
            ""
          ).startsWith(
            month
          );


        const statusMatch =
          !status ||
          item.Status ===
          status;


        return (
          searchMatch &&
          monthMatch &&
          statusMatch
        );

      }
    );


  tbody.innerHTML =
    "";


  if (
    data.length === 0
  ) {

    tbody.innerHTML =
      `
      <tr>
        <td colspan="8">
          No option trades found.
        </td>
      </tr>
      `;

    return;

  }


  data.forEach(
    item => {

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML =
        `
        <td>${escapeHtml(item.Date || "")}</td>

        <td>
          ${escapeHtml(
            item.Underlying || ""
          )}
        </td>

        <td>
          ${escapeHtml(
            item.Expiry || ""
          )}
        </td>

        <td>
          ${escapeHtml(
            item.Strategy || ""
          )}
        </td>

        <td>
          ₹${formatNumber(
            item.Combined_Entry_Premium
          )}
        </td>

        <td>
          ₹${formatNumber(
            item.Combined_Current_Premium
          )}
        </td>

        <td class="${
          Number(
            item.Net_PL
          ) >= 0
            ? "positive"
            : "negative"
        }">

          ₹${formatNumber(
            item.Net_PL
          )}

        </td>

        <td>
          ${statusBadge(
            item.Status
          )}
        </td>
        `;


      tbody.appendChild(
        row
      );

    }
  );

}


// ==========================================
// STATUS BADGE
// ==========================================

function statusBadge(
  status
) {

  let className =
    "active";


  if (
    status ===
    "Target Hit"
  ) {

    className =
      "target";

  }


  else if (
    status ===
    "SL Hit"
  ) {

    className =
      "sl";

  }


  else if (
    status ===
    "Open"
  ) {

    className =
      "active";

  }


  return `
    <span class="badge ${className}">
      ${escapeHtml(
        status ||
        "Active"
      )}
    </span>
  `;

}


// ==========================================
// FORMAT NUMBER
// ==========================================

function formatNumber(
  value
) {

  const number =
    Number(
      value ||
      0
    );


  if (
    Number.isNaN(
      number
    )
  ) {

    return "0";

  }


  return number.toLocaleString(
    "en-IN",
    {

      maximumFractionDigits:
        2

    }
  );

}


// ==========================================
// SET TEXT
// ==========================================

function setText(
  id,
  value
) {

  const element =
    getElement(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


// ==========================================
// SET VALUE
// ==========================================

function setValue(
  id,
  value
) {

  const element =
    getElement(
      id
    );


  if (element) {

    element.value =
      value;

  }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

  return String(
    value ??
    ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ==========================================
// ESCAPE ATTRIBUTE
// ==========================================

function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );

}


// ==========================================
// TOAST MESSAGE
// ==========================================

function showToast(
  message
) {

  const toast =
    getElement(
      "toast"
    );


  if (!toast) {

    console.log(
      message
    );

    return;

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },

      2500
    );

}
