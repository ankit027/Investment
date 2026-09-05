// ==========================================
// ANKIT INVESTMENT HUB
// FRONTEND APPLICATION
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbw3HjV_sDrY8KNmGge2ChFLyg3gicZlNFfw_4xTspr3ZodPpmbJBmZsdMiu26f51R_5/exec";

let recommendations = [];
let sipBaskets = [];
let optionTrades = [];


// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupNavigation();

    setupDarkMode();

    setupRecommendationForm();

    setupSIP();

    setupOptions();

    setTodayDates();

    await loadData();

  }
);


// ==========================================
// API GET
// ==========================================

async function apiGet(action) {

  const response =
    await fetch(
      `${API_URL}?action=${action}`
    );

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

  return await response.json();

}


// ==========================================
// LOAD DATA
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


    recommendations =
      data.recommendations || [];


    sipBaskets =
      data.sipBaskets || [];


    optionTrades =
      data.options || [];


    populateMonthFilters();

    renderDashboard();

    renderRecommendations();

    renderOptions();


    showToast(
      "Data loaded successfully"
    );

  }

  catch (error) {

    console.error(
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

  document
    .querySelectorAll(
      ".nav-btn"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".nav-btn"
              )
              .forEach(
                b =>
                  b.classList.remove(
                    "active"
                  )
              );


            button.classList.add(
              "active"
            );


            document
              .querySelectorAll(
                ".page"
              )
              .forEach(
                page =>
                  page.classList.remove(
                    "active"
                  )
              );


            document
              .getElementById(
                button.dataset.page
              )
              .classList.add(
                "active"
              );

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
    document.getElementById(
      "darkModeBtn"
    );


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

    button.textContent =
      "☀️ Light Mode";

  }


  button.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "dark"
      );


      const dark =
        document.body.classList.contains(
          "dark"
        );


      localStorage.setItem(
        "investmentHubTheme",
        dark
          ? "dark"
          : "light"
      );


      button.textContent =
        dark
          ? "☀️ Light Mode"
          : "🌙 Dark Mode";

    }
  );

}


// ==========================================
// SET TODAY
// ==========================================

function setTodayDates() {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  document.getElementById(
    "recDate"
  ).value =
    today;


  document.getElementById(
    "optionDate"
  ).value =
    today;

}


// ==========================================
// MONTH FILTERS
// ==========================================

function populateMonthFilters() {

  const recMonths =
    getUniqueMonths(
      recommendations
    );


  const optionMonths =
    getUniqueMonths(
      optionTrades
    );


  populateSelect(
    "recommendationMonthFilter",
    recMonths
  );


  populateSelect(
    "dashboardMonthFilter",
    recMonths
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


function getUniqueMonths(data) {

  const months =
    new Set();


  data.forEach(
    item => {

      if (
        item.Date
      ) {

        months.add(
          String(
            item.Date
          ).substring(
            0,
            7
          )
        );

      }

    }
  );


  return [
    ...months
  ].sort()
   .reverse();

}


function populateSelect(
  id,
  months
) {

  const select =
    document.getElementById(
      id
    );


  if (!select) return;


  const current =
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


  select.value =
    current;

}


function formatMonth(
  value
) {

  if (!value) {
    return "";
  }


  const date =
    new Date(
      value +
      "-01"
    );


  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric"
    }
  );

}


// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {

  const month =
    document.getElementById(
      "dashboardMonthFilter"
    ).value;


  const type =
    document.getElementById(
      "dashboardTypeFilter"
    ).value;


  let data =
    [...recommendations];


  if (
    month
  ) {

    data =
      data.filter(
        item =>
          String(
            item.Date
          ).startsWith(
            month
          )
      );

  }


  if (
    type
  ) {

    data =
      data.filter(
        item =>
          item.Type ===
          type
      );

  }


  document.getElementById(
    "totalRecommendations"
  ).textContent =
    data.length;


  document.getElementById(
    "activeRecommendations"
  ).textContent =
    data.filter(
      item =>
        item.Status ===
        "Active"
    ).length;


  document.getElementById(
    "targetHit"
  ).textContent =
    data.filter(
      item =>
        item.Status ===
        "Target Hit"
    ).length;


  document.getElementById(
    "slHit"
  ).textContent =
    data.filter(
      item =>
        item.Status ===
        "SL Hit"
    ).length;


  const average =
    data.length

      ?

      data.reduce(
        (
          sum,
          item
        ) =>

          sum +
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


  document.getElementById(
    "averageReturn"
  ).textContent =
    average.toFixed(2) +
    "%";


  const tbody =
    document.getElementById(
      "dashboardRecommendationsTable"
    );


  tbody.innerHTML =
    "";


  data
    .slice(0, 10)
    .forEach(
      item => {

        tbody.innerHTML += `

          <tr>

            <td>
              ${item.Date || ""}
            </td>

            <td>
              ${item.Name || ""}
            </td>

            <td>
              ${item.Type || ""}
            </td>

            <td>
              ₹${formatNumber(item.Entry_CMP)}
            </td>

            <td>
              ₹${formatNumber(item.Current_CMP)}
            </td>

            <td
              class="${Number(item.Return_Percent) >= 0 ? "positive" : "negative"}"
            >

              ${formatNumber(item.Return_Percent)}%

            </td>

            <td>
              ${statusBadge(item.Status)}
            </td>

          </tr>

        `;

      }
    );


  renderOptionDashboard();

}


// ==========================================
// OPTION DASHBOARD
// ==========================================

function renderOptionDashboard() {

  const month =
    document.getElementById(
      "dashboardOptionMonthFilter"
    ).value;


  const status =
    document.getElementById(
      "dashboardOptionStatusFilter"
    ).value;


  let data =
    [...optionTrades];


  if (
    month
  ) {

    data =
      data.filter(
        item =>
          String(
            item.Date
          ).startsWith(
            month
          )
      );

  }


  if (
    status
  ) {

    data =
      data.filter(
        item =>
          item.Status ===
          status
      );

  }


  document.getElementById(
    "totalOptionTrades"
  ).textContent =
    data.length;


  document.getElementById(
    "openOptionTrades"
  ).textContent =
    data.filter(
      item =>
        item.Status ===
        "Open"
    ).length;


  document.getElementById(
    "optionTargetHit"
  ).textContent =
    data.filter(
      item =>
        item.Status ===
        "Target Hit"
    ).length;


  document.getElementById(
    "optionSLHit"
  ).textContent =
    data.filter(
      item =>
        item.Status ===
        "SL Hit"
    ).length;


  const netPL =
    data.reduce(
      (
        sum,
        item
      ) =>

        sum +
        Number(
          item.Net_PL ||
          0
        ),

      0
    );


  const netPLField =
    document.getElementById(
      "optionNetPL"
    );


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


// ==========================================
// RECOMMENDATION FORM
// ==========================================

function setupRecommendationForm() {

  const form =
    document.getElementById(
      "recommendationForm"
    );


  document
    .getElementById(
      "showRecommendationFormBtn"
    )
    .addEventListener(
      "click",
      () => {

        document
          .getElementById(
            "recommendationFormContainer"
          )
          .classList.remove(
            "hidden"
          );


        document
          .getElementById(
            "recommendationForm"
          )
          .reset();


        document
          .getElementById(
            "recommendationId"
          ).value =
          "";


        document
          .getElementById(
            "recommendationFormTitle"
          ).textContent =
          "Add Recommendation";


        document
          .getElementById(
            "recDate"
          ).value =
          new Date()
            .toISOString()
            .split("T")[0];

      }
    );


  document
    .getElementById(
      "cancelRecommendationBtn"
    )
    .addEventListener(
      "click",
      closeRecommendationForm
    );


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const id =
        document.getElementById(
          "recommendationId"
        ).value;


      const data = {

        id,

        date:
          document.getElementById(
            "recDate"
          ).value,

        name:
          document.getElementById(
            "recName"
          ).value,

        symbol:
          document.getElementById(
            "recSymbol"
          ).value
          .trim()
          .toUpperCase(),

        type:
          document.getElementById(
            "recType"
          ).value,

        entryCMP:
          Number(
            document.getElementById(
              "recEntry"
            ).value
          ),

        target:
          Number(
            document.getElementById(
              "recTarget"
            ).value
          ),

        stopLoss:
          Number(
            document.getElementById(
              "recStopLoss"
            ).value
          ),

        timeFrame:
          document.getElementById(
            "recTimeFrame"
          ).value,

        remarks:
          document.getElementById(
            "recRemarks"
          ).value

      };


      try {

        if (
          id
        ) {

          await apiPost(
            "updateRecommendation",
            data
          );

          showToast(
            "Recommendation updated"
          );

        }

        else {

          await apiPost(
            "addRecommendation",
            data
          );

          showToast(
            "Recommendation saved"
          );

        }


        closeRecommendationForm();

        await loadData();

      }

      catch (
        error
      ) {

        showToast(
          "Unable to save recommendation"
        );

      }

    }
  );


  [
    "recommendationSearch",
    "recommendationMonthFilter",
    "recommendationTypeFilter",
    "recommendationStatusFilter"
  ]
    .forEach(
      id => {

        document
          .getElementById(
            id
          )
          .addEventListener(
            "input",
            renderRecommendations
          );

        document
          .getElementById(
            id
          )
          .addEventListener(
            "change",
            renderRecommendations
          );

      }
    );


  document
    .getElementById(
      "dashboardMonthFilter"
    )
    .addEventListener(
      "change",
      renderDashboard
    );


  document
    .getElementById(
      "dashboardTypeFilter"
    )
    .addEventListener(
      "change",
      renderDashboard
    );


  document
    .getElementById(
      "dashboardOptionMonthFilter"
    )
    .addEventListener(
      "change",
      renderDashboard
    );


  document
    .getElementById(
      "dashboardOptionStatusFilter"
    )
    .addEventListener(
      "change",
      renderDashboard
    );


  document
    .getElementById(
      "refreshDashboardBtn"
    )
    .addEventListener(
      "click",
      loadData
    );

}


// ==========================================
// CLOSE FORM
// ==========================================

function closeRecommendationForm() {

  document
    .getElementById(
      "recommendationFormContainer"
    )
    .classList.add(
      "hidden"
    );

}


// ==========================================
// RENDER RECOMMENDATIONS
// ==========================================

function renderRecommendations() {

  const search =
    document
      .getElementById(
        "recommendationSearch"
      )
      .value
      .toLowerCase();


  const month =
    document
      .getElementById(
        "recommendationMonthFilter"
      )
      .value;


  const type =
    document
      .getElementById(
        "recommendationTypeFilter"
      )
      .value;


  const status =
    document
      .getElementById(
        "recommendationStatusFilter"
      )
      .value;


  const tbody =
    document
      .getElementById(
        "recommendationsTable"
      );


  let data =
    [...recommendations];


  data =
    data.filter(
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


        return (

          (!search ||

            name.includes(
              search
            ) ||

            symbol.includes(
              search
            )
          )

          &&

          (!month ||

            String(
              item.Date
            ).startsWith(
              month
            )
          )

          &&

          (!type ||

            item.Type ===
            type
          )

          &&

          (!status ||

            item.Status ===
            status
          )

        );

      }
    );


  tbody.innerHTML =
    "";


  data.forEach(
    item => {

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `

        <td>${item.Date || ""}</td>

        <td>${item.Name || ""}</td>

        <td>${item.Symbol || ""}</td>

        <td>${item.Type || ""}</td>

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

        <td
          class="${Number(item.Return_Percent) >= 0 ? "positive" : "negative"}"
        >

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
            onclick="editRecommendation('${item.ID}')"
          >
            Edit
          </button>

          <button
            class="action-btn delete-btn"
            onclick="deleteRecommendation('${item.ID}')"
          >
            Delete
          </button>

        </td>

      `;


      tbody.appendChild(
        row
      );

    }
  );

}


// ==========================================
// EDIT RECOMMENDATION
// ==========================================

function editRecommendation(
  id
) {

  const item =
    recommendations.find(
      r =>
        String(
          r.ID
        ) ===
        String(
          id
        )
    );


  if (!item) {
    return;
  }


  document
    .getElementById(
      "recommendationFormContainer"
    )
    .classList.remove(
      "hidden"
    );


  document
    .getElementById(
      "recommendationFormTitle"
    )
    .textContent =
    "Edit Recommendation";


  document
    .getElementById(
      "recommendationId"
    )
    .value =
    item.ID;


  document
    .getElementById(
      "recDate"
    )
    .value =
    String(
      item.Date
    )
    .substring(
      0,
      10
    );


  document
    .getElementById(
      "recName"
    )
    .value =
    item.Name ||
    "";


  document
    .getElementById(
      "recSymbol"
    )
    .value =
    item.Symbol ||
    "";


  document
    .getElementById(
      "recType"
    )
    .value =
    item.Type ||
    "Stock";


  document
    .getElementById(
      "recEntry"
    )
    .value =
    item.Entry_CMP ||
    "";


  document
    .getElementById(
      "recTarget"
    )
    .value =
    item.Target ||
    "";


  document
    .getElementById(
      "recStopLoss"
    )
    .value =
    item.Stop_Loss ||
    "";


  document
    .getElementById(
      "recTimeFrame"
    )
    .value =
    item.Time_Frame ||
    "";


  document
    .getElementById(
      "recRemarks"
    )
    .value =
    item.Remarks ||
    "";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

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


  if (
    !confirmed
  ) {
    return;
  }


  try {

    const result =
      await apiPost(
        "deleteRecommendation",
        { id }
      );


    if (
      result.success
    ) {

      showToast(
        "Recommendation deleted"
      );

      await loadData();

    }

    else {

      showToast(
        result.message ||
        "Unable to delete"
      );

    }

  }

  catch (
    error
  ) {

    showToast(
      "Unable to delete"
    );

  }

}


// ==========================================
// SIP
// ==========================================

function setupSIP() {

  document
    .getElementById(
      "sipAmountFilter"
    )
    .addEventListener(
      "change",
      renderSIPBasket
    );


  document
    .getElementById(
      "customSIPForm"
    )
    .addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const data = {

          planName:
            document
              .getElementById(
                "sipPlanName"
              ).value,

          monthlyAmount:
            Number(
              document
                .getElementById(
                  "sipMonthlyAmount"
                ).value
            ),

          investmentName:
            document
              .getElementById(
                "sipInvestmentName"
              ).value,

          investmentType:
            document
              .getElementById(
                "sipInvestmentType"
              ).value,

          allocationPercent:
            Number(
              document
                .getElementById(
                  "sipAllocationPercent"
                ).value
            )

        };


        try {

          await apiPost(
            "addCustomSIP",
            data
          );


          showToast(
            "Custom SIP added"
          );


          event.target.reset();

        }

        catch (
          error
        ) {

          showToast(
            "Unable to save SIP"
          );

        }

      }
    );

}


// ==========================================
// RENDER SIP
// ==========================================

function renderSIPBasket() {

  const amount =
    document
      .getElementById(
        "sipAmountFilter"
      )
      .value;


  const container =
    document
      .getElementById(
        "sipBasketContainer"
      );


  if (
    !amount
  ) {

    container.innerHTML =
      `
      <div class="empty-state">
        Select a monthly SIP amount.
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
              ${item.Investment_Name}
            </strong>

            <div>
              ${item.Investment_Type}
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
// OPTIONS SETUP
// ==========================================

function setupOptions() {

  addOptionLeg();


  document
    .getElementById(
      "addOptionLegBtn"
    )
    .addEventListener(
      "click",
      addOptionLeg
    );


  document
    .getElementById(
      "optionTradeForm"
    )
    .addEventListener(
      "submit",
      saveOptionTrade
    );


  [
    "optionSearch",
    "optionMonthFilter",
    "optionStatusFilter"
  ]
    .forEach(
      id => {

        document
          .getElementById(
            id
          )
          .addEventListener(
            "input",
            renderOptions
          );


        document
          .getElementById(
            id
          )
          .addEventListener(
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
    document
      .getElementById(
        "optionLegsContainer"
      );


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


    <select
      class="option-type"
    >

      <option value="CE">
        CE
      </option>

      <option value="PE">
        PE
      </option>

    </select>


    <select
      class="position"
    >

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


  leg
    .querySelector(
      ".remove-leg"
    )
    .addEventListener(
      "click",
      () => {

        if (

          document
            .querySelectorAll(
              ".option-leg"
            )
            .length > 1

        ) {

          leg.remove();

        }

      }
    );


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

        legs.push({

          strikePrice:
            Number(
              leg
                .querySelector(
                  ".strike-price"
                )
                .value
            ),

          optionType:
            leg
              .querySelector(
                ".option-type"
              )
              .value,

          position:
            leg
              .querySelector(
                ".position"
              )
              .value,

          entryPremium:
            Number(
              leg
                .querySelector(
                  ".entry-premium"
                )
                .value
            ),

          currentPremium:
            Number(
              leg
                .querySelector(
                  ".current-premium"
                )
                .value
            )

        });

      }
    );


  const data = {

    date:
      document
        .getElementById(
          "optionDate"
        ).value,

    underlying:
      document
        .getElementById(
          "optionUnderlying"
        ).value,

    expiry:
      document
        .getElementById(
          "optionExpiry"
        ).value,

    strategy:
      document
        .getElementById(
          "optionStrategy"
        ).value,

    lotSize:
      Number(
        document
          .getElementById(
            "optionLotSize"
          ).value
      ),

    lots:
      Number(
        document
          .getElementById(
            "optionLots"
          ).value
      ),

    targetPercent:
      Number(
        document
          .getElementById(
            "optionTargetPercent"
          ).value
      ),

    slPercent:
      Number(
        document
          .getElementById(
            "optionSLPercent"
          ).value
      ),

    remarks:
      document
        .getElementById(
          "optionRemarks"
        ).value,

    legs

  };


  try {

    await apiPost(
      "addOptionTrade",
      data
    );


    showToast(
      "Option trade saved"
    );


    event.target.reset();


    document
      .getElementById(
        "optionLegsContainer"
      )
      .innerHTML =
      "";


    addOptionLeg();


    setTodayDates();


    await loadData();

  }

  catch (
    error
  ) {

    showToast(
      "Unable to save option trade"
    );

  }

}


// ==========================================
// RENDER OPTIONS
// ==========================================

function renderOptions() {

  const search =
    document
      .getElementById(
        "optionSearch"
      )
      .value
      .toLowerCase();


  const month =
    document
      .getElementById(
        "optionMonthFilter"
      )
      .value;


  const status =
    document
      .getElementById(
        "optionStatusFilter"
      )
      .value;


  let data =
    [...optionTrades];


  data =
    data.filter(
      item =>

        (

          !search ||

          String(
            item.Underlying ||
            ""
          )
          .toLowerCase()
          .includes(
            search
          )

        )

        &&

        (

          !month ||

          String(
            item.Date
          )
          .startsWith(
            month
          )

        )

        &&

        (

          !status ||

          item.Status ===
          status

        )
    );


  const tbody =
    document
      .getElementById(
        "optionTradesTable"
      );


  tbody.innerHTML =
    "";


  data.forEach(
    item => {

      tbody.innerHTML +=

        `

        <tr>

          <td>
            ${item.Date || ""}
          </td>

          <td>
            ${item.Underlying || ""}
          </td>

          <td>
            ${item.Expiry || ""}
          </td>

          <td>
            ${item.Strategy || ""}
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

          <td
            class="${Number(item.Net_PL) >= 0 ? "positive" : "negative"}"
          >

            ₹${formatNumber(
              item.Net_PL
            )}

          </td>

          <td>
            ${statusBadge(
              item.Status
            )}
          </td>

        </tr>

        `;

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


  if (
    status ===
    "SL Hit"
  ) {

    className =
      "sl";

  }


  return `

    <span
      class="badge ${className}"
    >

      ${status || "Active"}

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
      value || 0
    );


  return number.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );

}


// ==========================================
// TOAST
// ==========================================

function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2500
  );

}
