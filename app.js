// ==========================================
// ANKIT INVESTMENT HUB
// FRONTEND APPLICATION
// ==========================================


// ==========================================
// API URL
// IMPORTANT: Keep only the plain URL
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
    setupFilters();

    setTodayDates();

    await loadData();

  }
);



// ==========================================
// API GET
// ==========================================

async function apiGet(action) {

  const url =
    `${API_URL}?action=${encodeURIComponent(action)}&t=${Date.now()}`;

  const response =
    await fetch(url, {
      method: "GET",
      redirect: "follow"
    });


  if (!response.ok) {

    throw new Error(
      `Unable to connect to API. HTTP ${response.status}`
    );

  }


  const text =
    await response.text();


  try {

    return JSON.parse(text);

  }

  catch (error) {

    console.error(
      "Invalid API response:",
      text
    );

    throw new Error(
      "API returned an invalid response"
    );

  }

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

        redirect: "follow",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify({
            action,
            data
          })

      }
    );


  if (!response.ok) {

    throw new Error(
      `API request failed. HTTP ${response.status}`
    );

  }


  const text =
    await response.text();


  try {

    return JSON.parse(text);

  }

  catch (error) {

    console.error(
      "Invalid API response:",
      text
    );

    throw new Error(
      "API returned an invalid response"
    );

  }

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


    console.log(
      "Dashboard API Response:",
      data
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
      Array.isArray(data.recommendations)
        ? data.recommendations
        : [];


    sipBaskets =
      Array.isArray(data.sipBaskets)
        ? data.sipBaskets
        : [];


    optionTrades =
      Array.isArray(data.options)
        ? data.options
        : [];


    populateMonthFilters();

    renderDashboard();
    renderRecommendations();
    renderOptions();
    renderSIPBasket();


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
      error.message ||
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
                item =>
                  item.classList.remove(
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


            const target =
              document.getElementById(
                button.dataset.page
              );


            if (target) {

              target.classList.add(
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
    document.getElementById(
      "darkModeBtn"
    );


  if (!button) {
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

    button.textContent =
      "☀️ Light Mode";

  }


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


      button.textContent =
        isDark
          ? "☀️ Light Mode"
          : "🌙 Dark Mode";

    }
  );

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
    document.getElementById(
      "recDate"
    );


  const optionDate =
    document.getElementById(
      "optionDate"
    );


  if (
    recDate &&
    !recDate.value
  ) {

    recDate.value =
      today;

  }


  if (
    optionDate &&
    !optionDate.value
  ) {

    optionDate.value =
      today;

  }

}



// ==========================================
// FILTERS
// ==========================================

function setupFilters() {

  const filterIds = [

    "dashboardMonthFilter",
    "dashboardTypeFilter",
    "dashboardTimeStatusFilter"

  ];


  filterIds.forEach(
    id => {

      const element =
        document.getElementById(
          id
        );


      if (element) {

        element.addEventListener(
          "change",
          renderDashboard
        );

      }

    }
  );


  const recommendationFilters = [

    "recommendationSearch",
    "recommendationMonthFilter",
    "recommendationTypeFilter",
    "recommendationStatusFilter",
    "recommendationTimeStatusFilter"

  ];


  recommendationFilters.forEach(
    id => {

      const element =
        document.getElementById(
          id
        );


      if (element) {

        element.addEventListener(
          id === "recommendationSearch"
            ? "input"
            : "change",

          renderRecommendations
        );

      }

    }
  );


  const refreshButton =
    document.getElementById(
      "refreshDashboardBtn"
    );


  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      loadData
    );

  }


  const optionSearch =
    document.getElementById(
      "optionSearch"
    );


  if (optionSearch) {

    optionSearch.addEventListener(
      "input",
      renderOptions
    );

  }

}



// ==========================================
// MONTH FILTERS
// ==========================================

function populateMonthFilters() {

  const months =
    [
      ...new Set(
        recommendations
          .map(
            item =>
              getMonthKey(
                item.Date
              )
          )
          .filter(
            Boolean
          )
      )
    ]
    .sort()
    .reverse();


  const filterIds = [

    "dashboardMonthFilter",
    "recommendationMonthFilter"

  ];


  filterIds.forEach(
    id => {

      const select =
        document.getElementById(
          id
        );


      if (!select) {
        return;
      }


      const previous =
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
        previous &&
        [...select.options]
          .some(
            option =>
              option.value ===
              previous
          )
      ) {

        select.value =
          previous;

      }

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
    )?.value || "";


  const type =
    document.getElementById(
      "dashboardTypeFilter"
    )?.value || "";


  const timeStatus =
    document.getElementById(
      "dashboardTimeStatusFilter"
    )?.value || "";


  const filtered =
    recommendations.filter(
      item => {

        const holding =
          getHoldingStatus(
            item
          );


        return (

          (
            !month ||
            getMonthKey(
              item.Date
            ) === month
          )

          &&

          (
            !type ||
            item.Type === type
          )

          &&

          (
            !timeStatus ||
            holding.status ===
            timeStatus
          )

        );

      }
    );


  const total =
    filtered.length;


  const targetCount =
    filtered.filter(
      item =>
        item.Status ===
        "Target Hit"
    ).length;


  const slCount =
    filtered.filter(
      item =>
        item.Status ===
        "SL Hit"
    ).length;


  const activeCount =
    filtered.filter(
      item =>
        ![
          "Target Hit",
          "SL Hit"
        ].includes(
          item.Status
        )
    ).length;


  const overdueCount =
    filtered.filter(
      item =>
        getHoldingStatus(
          item
        ).status ===
        "Overdue"
    ).length;


  const averageReturn =
    total
      ? filtered.reduce(
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
        ) / total
      : 0;


  setText(
    "totalRecommendations",
    total
  );


  setText(
    "activeRecommendations",
    activeCount
  );


  setText(
    "targetHit",
    targetCount
  );


  setText(
    "slHit",
    slCount
  );


  setText(
    "averageReturn",
    `${formatNumber(
      averageReturn
    )}%`
  );


  setText(
    "overdueRecommendations",
    overdueCount
  );


  setText(
    "targetHitPercent",
    total
      ? `${formatNumber(
          (
            targetCount /
            total
          ) * 100
        )}%`
      : "0%"
  );


  setText(
    "slHitPercent",
    total
      ? `${formatNumber(
          (
            slCount /
            total
          ) * 100
        )}%`
      : "0%"
  );


  // IMPORTANT:
  // This function was missing in your old file.
  renderDashboardTable(
    filtered
  );


  renderOptionsDashboard();

}



// ==========================================
// DASHBOARD RECENT TABLE
// ==========================================

function renderDashboardTable(
  items
) {

  const tbody =
    document.getElementById(
      "dashboardRecommendationsTable"
    )
    ||
    document.getElementById(
      "recentRecommendationsTable"
    );


  if (!tbody) {

    console.warn(
      "Dashboard recommendation table ID not found"
    );

    return;

  }


  tbody.innerHTML =
    "";


  const recentItems =
    [...items]
      .sort(
        (a, b) => {

          const dateA =
            new Date(
              formatInputDate(
                a.Date
              )
            );

          const dateB =
            new Date(
              formatInputDate(
                b.Date
              )
            );

          return dateB - dateA;

        }
      )
      .slice(
        0,
        10
      );


  if (
    recentItems.length === 0
  ) {

    tbody.innerHTML =
      `
      <tr>
        <td colspan="8">
          No recommendations found.
        </td>
      </tr>
      `;

    return;

  }


  recentItems.forEach(
    item => {

      const progress =
        getTargetProgress(
          item
        );


      const holding =
        getHoldingStatus(
          item
        );


      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML =
        `
        <td>
          ${formatDate(item.Date)}
        </td>

        <td>
          <strong>
            ${escapeHtml(item.Name)}
          </strong>
        </td>

        <td>
          ${escapeHtml(item.Type)}
        </td>

        <td>
          ₹${formatNumber(item.Entry_CMP)}
        </td>

        <td>
          ₹${formatNumber(item.Current_CMP)}
        </td>

        <td class="${
          Number(item.Return_Percent) >= 0
            ? "positive"
            : "negative"
        }">
          ${formatNumber(item.Return_Percent)}%
        </td>

        <td>
          ${progressBar(progress)}
        </td>

        <td>
          ${timeBadge(holding)}
        </td>

        <td>
          ${statusBadge(
            getDisplayStatus(item)
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
// RECOMMENDATION FORM
// ==========================================

function setupRecommendationForm() {

  const form =
    document.getElementById(
      "recommendationForm"
    );


  const showButton =
    document.getElementById(
      "showRecommendationFormBtn"
    );


  const cancelButton =
    document.getElementById(
      "cancelRecommendationBtn"
    );


  const container =
    document.getElementById(
      "recommendationFormContainer"
    );


  if (
    showButton &&
    container
  ) {

    showButton.addEventListener(
      "click",
      () => {

        resetRecommendationForm();

        container.classList.remove(
          "hidden"
        );

      }
    );

  }


  if (
    cancelButton &&
    container
  ) {

    cancelButton.addEventListener(
      "click",
      () => {

        container.classList.add(
          "hidden"
        );

        resetRecommendationForm();

      }
    );

  }


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const id =
        document.getElementById(
          "recommendationId"
        ).value;


      const holdingValue =
        Number(
          document.getElementById(
            "recHoldingValue"
          ).value
        );


      const holdingUnit =
        document.getElementById(
          "recHoldingUnit"
        ).value;


      const timeFrame =
        `${holdingValue} ${holdingUnit}`;


      const data = {

        id,

        date:
          document.getElementById(
            "recDate"
          ).value,

        name:
          document.getElementById(
            "recName"
          ).value.trim(),

        symbol:
          document.getElementById(
            "recSymbol"
          )
          .value
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

        timeFrame,

        remarks:
          document.getElementById(
            "recRemarks"
          ).value.trim()

      };


      try {

        const result =
          id
            ? await apiPost(
                "updateRecommendation",
                data
              )
            : await apiPost(
                "addRecommendation",
                data
              );


        if (
          !result.success
        ) {

          throw new Error(
            result.message ||
            result.error ||
            "Unable to save recommendation"
          );

        }


        showToast(
          id
            ? "Recommendation updated"
            : "Recommendation saved"
        );


        container?.classList.add(
          "hidden"
        );


        resetRecommendationForm();


        await loadData();

      }

      catch (error) {

        console.error(
          error
        );


        showToast(
          error.message ||
          "Unable to save recommendation"
        );

      }

    }
  );

}



// ==========================================
// RESET RECOMMENDATION FORM
// ==========================================

function resetRecommendationForm() {

  const form =
    document.getElementById(
      "recommendationForm"
    );


  if (form) {

    form.reset();

  }


  setTodayDates();


  const id =
    document.getElementById(
      "recommendationId"
    );


  if (id) {

    id.value =
      "";

  }


  const title =
    document.getElementById(
      "recommendationFormTitle"
    );


  if (title) {

    title.textContent =
      "Add Recommendation";

  }


  const holdingUnit =
    document.getElementById(
      "recHoldingUnit"
    );


  if (holdingUnit) {

    holdingUnit.value =
      "Months";

  }

}



// ==========================================
// RENDER RECOMMENDATIONS
// ==========================================

function renderRecommendations() {

  const tbody =
    document.getElementById(
      "recommendationsTable"
    );


  if (!tbody) {
    return;
  }


  const search =
    document.getElementById(
      "recommendationSearch"
    )?.value
      .trim()
      .toLowerCase() || "";


  const month =
    document.getElementById(
      "recommendationMonthFilter"
    )?.value || "";


  const type =
    document.getElementById(
      "recommendationTypeFilter"
    )?.value || "";


  const status =
    document.getElementById(
      "recommendationStatusFilter"
    )?.value || "";


  const timeStatus =
    document.getElementById(
      "recommendationTimeStatusFilter"
    )?.value || "";


  const filtered =
    recommendations.filter(
      item => {

        const holding =
          getHoldingStatus(
            item
          );


        const searchText =
          `${item.Name || ""} ${item.Symbol || ""}`
            .toLowerCase();


        return (

          (
            !search ||
            searchText.includes(search)
          )

          &&

          (
            !month ||
            getMonthKey(item.Date) === month
          )

          &&

          (
            !type ||
            item.Type === type
          )

          &&

          (
            !status ||
            item.Status === status
          )

          &&

          (
            !timeStatus ||
            holding.status === timeStatus
          )

        );

      }
    );


  tbody.innerHTML =
    "";


  if (
    filtered.length === 0
  ) {

    tbody.innerHTML =
      `
      <tr>
        <td colspan="14">
          No recommendations found.
        </td>
      </tr>
      `;

    return;

  }


  filtered.forEach(
    item => {

      const progress =
        getTargetProgress(
          item
        );


      const holding =
        getHoldingStatus(
          item
        );


      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML =
        `
        <td>${formatDate(item.Date)}</td>

        <td>
          <strong>
            ${escapeHtml(item.Name)}
          </strong>
        </td>

        <td>
          ${escapeHtml(item.Symbol)}
        </td>

        <td>
          ${escapeHtml(item.Type)}
        </td>

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
          Number(item.Return_Percent) >= 0
            ? "positive"
            : "negative"
        }">
          ${formatNumber(item.Return_Percent)}%
        </td>

        <td>
          ${progressBar(progress)}
        </td>

        <td>
          ${escapeHtml(
            item.Time_Frame ||
            "-"
          )}
        </td>

        <td>
          ${timeBadge(holding)}
        </td>

        <td>
          ${statusBadge(
            getDisplayStatus(item)
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

window.editRecommendation =
  function(id) {

    const item =
      recommendations.find(
        recommendation =>
          String(
            recommendation.ID
          ) ===
          String(id)
      );


    if (!item) {

      showToast(
        "Recommendation not found"
      );

      return;

    }


    const container =
      document.getElementById(
        "recommendationFormContainer"
      );


    container?.classList.remove(
      "hidden"
    );


    setText(
      "recommendationFormTitle",
      "Edit Recommendation"
    );


    document.getElementById(
      "recommendationId"
    ).value =
      item.ID;


    document.getElementById(
      "recDate"
    ).value =
      formatInputDate(
        item.Date
      );


    document.getElementById(
      "recName"
    ).value =
      item.Name ||
      "";


    document.getElementById(
      "recSymbol"
    ).value =
      item.Symbol ||
      "";


    document.getElementById(
      "recType"
    ).value =
      item.Type ||
      "Stock";


    document.getElementById(
      "recEntry"
    ).value =
      item.Entry_CMP ||
      "";


    document.getElementById(
      "recTarget"
    ).value =
      item.Target ||
      "";


    document.getElementById(
      "recStopLoss"
    ).value =
      item.Stop_Loss ||
      "";


    const parsed =
      parseHoldingPeriod(
        item.Time_Frame
      );


    document.getElementById(
      "recHoldingValue"
    ).value =
      parsed.value;


    document.getElementById(
      "recHoldingUnit"
    ).value =
      parsed.unit;


    document.getElementById(
      "recRemarks"
    ).value =
      item.Remarks ||
      "";


    window.scrollTo({

      top: 0,

      behavior:
        "smooth"

    });

  };



// ==========================================
// DELETE RECOMMENDATION
// ==========================================

window.deleteRecommendation =
  async function(id) {

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

        throw new Error(
          result.message ||
          "Unable to delete"
        );

      }

    }

    catch (error) {

      console.error(error);

      showToast(
        error.message ||
        "Unable to delete recommendation"
      );

    }

  };



// ==========================================
// TARGET PROGRESS
// ==========================================

function getTargetProgress(item) {

  const entry =
    Number(
      item.Entry_CMP || 0
    );


  const target =
    Number(
      item.Target || 0
    );


  const current =
    Number(
      item.Current_CMP ||
      entry
    );


  if (
    !entry ||
    !target ||
    target === entry
  ) {

    return 0;

  }


  const raw =
    (
      (
        current -
        entry
      )
      /
      (
        target -
        entry
      )
    )
    * 100;


  return Math.max(
    0,
    Math.min(
      raw,
      100
    )
  );

}



// ==========================================
// PROGRESS BAR
// ==========================================

function progressBar(progress) {

  const safeProgress =
    Math.max(
      0,
      Math.min(
        Number(progress || 0),
        100
      )
    );


  return `
    <div class="progress-wrapper">

      <div class="progress-track">
        <div
          class="progress-fill"
          style="width:${safeProgress}%"
        ></div>
      </div>

      <span>
        ${formatNumber(safeProgress)}%
      </span>

    </div>
  `;

}



// ==========================================
// HOLDING PERIOD PARSER
// ==========================================

function parseHoldingPeriod(value) {

  const text =
    String(value || "")
      .trim()
      .toLowerCase();


  const match =
    text.match(
      /(\d+(?:\.\d+)?)\s*(day|days|month|months)/
    );


  if (!match) {

    return {

      value: 1,

      unit:
        "Months"

    };

  }


  return {

    value:
      Number(match[1]),

    unit:
      match[2]
        .startsWith("day")
        ? "Days"
        : "Months"

  };

}



// ==========================================
// HOLDING STATUS
// ==========================================

function getHoldingStatus(item) {

  const finalStatus =
    String(
      item.Status || ""
    ).trim();


  const timingStatus =
    String(
      item.Timing_Status || ""
    ).trim();


  if (
    finalStatus ===
    "Target Hit"
  ) {

    if (
      timingStatus ===
      "After Due"
    ) {

      return {

        status:
          "Target After Due",

        label:
          "⚠️ Target After Due"

      };

    }


    return {

      status:
        "Target Hit",

      label:
        "🎯 Target Hit"

    };

  }


  if (
    finalStatus ===
    "SL Hit"
  ) {

    if (
      timingStatus ===
      "After Due"
    ) {

      return {

        status:
          "SL After Due",

        label:
          "⚠️ SL After Due"

      };

    }


    return {

      status:
        "SL Hit",

      label:
        "🛑 SL Hit"

    };

  }


  const inputDate =
    formatInputDate(
      item.Date
    );


  const startDate =
    new Date(
      `${inputDate}T00:00:00`
    );


  if (
    Number.isNaN(
      startDate.getTime()
    )
  ) {

    return {

      status:
        "Within Time",

      label:
        "Within Time"

    };

  }


  const holding =
    parseHoldingPeriod(
      item.Time_Frame
    );


  const dueDate =
    new Date(
      startDate
    );


  if (
    holding.unit ===
    "Days"
  ) {

    dueDate.setDate(
      dueDate.getDate() +
      holding.value
    );

  }

  else {

    dueDate.setMonth(
      dueDate.getMonth() +
      holding.value
    );

  }


  const today =
    new Date();


  today.setHours(
    0,
    0,
    0,
    0
  );


  const totalDuration =
    dueDate -
    startDate;


  const remaining =
    dueDate -
    today;


  if (
    remaining < 0
  ) {

    const daysLate =
      Math.floor(
        (
          today -
          dueDate
        )
        /
        (
          1000 *
          60 *
          60 *
          24
        )
      );


    return {

      status:
        "Overdue",

      label:
        `Overdue (${daysLate} Days)`

    };

  }


  const remainingPercent =
    totalDuration > 0
      ? (
          remaining /
          totalDuration
        ) * 100
      : 0;


  if (
    remainingPercent <= 25
  ) {

    return {

      status:
        "Near Due",

      label:
        "Near Due"

    };

  }


  return {

    status:
      "Within Time",

    label:
      "Within Time"

  };

}



// ==========================================
// TIME BADGE
// ==========================================

function timeBadge(holding) {

  let className =
    "within-time";


  if (
    holding.status ===
    "Near Due"
  ) {

    className =
      "near-due";

  }


  if (
    holding.status ===
    "Overdue"
  ) {

    className =
      "overdue";

  }


  if (
    holding.status ===
    "Target Hit"
  ) {

    className =
      "time-target";

  }


  if (
    holding.status ===
    "Target After Due"
  ) {

    className =
      "near-due";

  }


  if (
    holding.status ===
    "SL Hit"
  ) {

    className =
      "time-sl";

  }


  if (
    holding.status ===
    "SL After Due"
  ) {

    className =
      "overdue";

  }


  return `
    <span
      class="time-badge ${className}"
    >
      ${holding.label}
    </span>
  `;

}



// ==========================================
// SIP
// ==========================================

function setupSIP() {

  const amountFilter =
    document.getElementById(
      "sipAmountFilter"
    );


  if (amountFilter) {

    amountFilter.addEventListener(
      "change",
      renderSIPBasket
    );

  }


  const form =
    document.getElementById(
      "customSIPForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const data = {

        planName:
          document.getElementById(
            "sipPlanName"
          ).value,

        monthlyAmount:
          Number(
            document.getElementById(
              "sipMonthlyAmount"
            ).value
          ),

        investmentName:
          document.getElementById(
            "sipInvestmentName"
          ).value,

        investmentType:
          document.getElementById(
            "sipInvestmentType"
          ).value,

        allocationPercent:
          Number(
            document.getElementById(
              "sipAllocationPercent"
            ).value
          )

      };


      try {

        const result =
          await apiPost(
            "addCustomSIP",
            data
          );


        if (
          !result.success
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


        await loadData();

      }

      catch (error) {

        showToast(
          error.message ||
          "Unable to save SIP"
        );

      }

    }
  );

}



// ==========================================
// RENDER SIP BASKET
// ==========================================

function renderSIPBasket() {

  const select =
    document.getElementById(
      "sipAmountFilter"
    );


  const container =
    document.getElementById(
      "sipBasketContainer"
    );


  if (
    !select ||
    !container
  ) {

    return;

  }


  select.innerHTML =
    '<option value="">Select Monthly SIP</option>';


  const amounts =
    [
      ...new Set(
        sipBaskets.map(
          item =>
            String(
              item.Monthly_Amount
            )
        )
      )
    ];


  amounts
    .sort(
      (a, b) =>
        Number(a) -
        Number(b)
    )
    .forEach(
      amount => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          amount;


        option.textContent =
          `₹${Number(amount).toLocaleString("en-IN")} Monthly`;


        select.appendChild(
          option
        );

      }
    );


  if (
    !select.value &&
    amounts.length
  ) {

    select.value =
      amounts[0];

  }


  const items =
    sipBaskets.filter(
      item =>
        String(
          item.Monthly_Amount
        ) ===
        String(
          select.value
        )
    );


  container.innerHTML =
    "";


  if (
    items.length === 0
  ) {

    container.innerHTML =
      "<p>No SIP basket available.</p>";

    return;

  }


  items.forEach(
    item => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "sip-card";


      card.innerHTML =
        `
        <div>

          <strong>
            ${escapeHtml(
              item.Investment_Name
            )}
          </strong>

          <span>
            ${escapeHtml(
              item.Investment_Type
            )}
          </span>

        </div>

        <div class="sip-row">

          <span>
            Monthly Allocation
          </span>

          <strong>
            ₹${formatNumber(
              item.Allocation_Amount
            )}
          </strong>

        </div>

        <div class="sip-row">

          <span>
            Allocation
          </span>

          <strong>
            ${formatNumber(
              item.Allocation_Percent
            )}%
          </strong>

        </div>
        `;


      container.appendChild(
        card
      );

    }
  );

}



// ==========================================
// OPTIONS
// ==========================================

function setupOptions() {

  const addLegButton =
    document.getElementById(
      "addOptionLegBtn"
    );


  if (addLegButton) {

    addLegButton.addEventListener(
      "click",
      addOptionLeg
    );

  }


  const form =
    document.getElementById(
      "optionTradeForm"
    );


  if (form) {

    form.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const legs =
          getOptionLegs();


        if (
          legs.length === 0
        ) {

          showToast(
            "Add at least one option leg"
          );

          return;

        }


        const data = {

          date:
            document.getElementById(
              "optionDate"
            ).value,

          underlying:
            document.getElementById(
              "optionUnderlying"
            ).value,

          expiry:
            document.getElementById(
              "optionExpiry"
            ).value,

          strategy:
            document.getElementById(
              "optionStrategy"
            ).value,

          lotSize:
            Number(
              document.getElementById(
                "optionLotSize"
              ).value
            ),

          lots:
            Number(
              document.getElementById(
                "optionLots"
              ).value
            ),

          targetPercent:
            Number(
              document.getElementById(
                "optionTargetPercent"
              ).value
            ),

          slPercent:
            Number(
              document.getElementById(
                "optionSLPercent"
              ).value
            ),

          remarks:
            document.getElementById(
              "optionRemarks"
            ).value,

          legs

        };


        try {

          const result =
            await apiPost(
              "addOptionTrade",
              data
            );


          if (
            !result.success
          ) {

            throw new Error(
              result.message ||
              "Unable to save option trade"
            );

          }


          showToast(
            "Option trade saved"
          );


          form.reset();


          const legsContainer =
            document.getElementById(
              "optionLegsContainer"
            );


          if (legsContainer) {

            legsContainer.innerHTML =
              "";

          }


          addOptionLeg();

          setTodayDates();

          await loadData();

        }

        catch (error) {

          console.error(error);

          showToast(
            error.message ||
            "Unable to save option trade"
          );

        }

      }
    );

  }


  if (
    document.getElementById(
      "optionLegsContainer"
    ) &&
    document.querySelectorAll(
      ".option-leg"
    ).length === 0
  ) {

    addOptionLeg();

  }

}



// ==========================================
// ADD OPTION LEG
// ==========================================

function addOptionLeg() {

  const container =
    document.getElementById(
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
      type="number"
      class="leg-strike"
      placeholder="Strike"
    >

    <select class="leg-type">
      <option value="CE">
        CE
      </option>

      <option value="PE">
        PE
      </option>
    </select>

    <select class="leg-position">
      <option value="BUY">
        BUY
      </option>

      <option value="SELL">
        SELL
      </option>
    </select>

    <input
      type="number"
      step="0.01"
      class="leg-entry"
      placeholder="Entry Premium"
    >

    <input
      type="number"
      step="0.01"
      class="leg-current"
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

        leg.remove();

      }
    );


  container.appendChild(
    leg
  );

}



// ==========================================
// GET OPTION LEGS
// ==========================================

function getOptionLegs() {

  return [
    ...document.querySelectorAll(
      ".option-leg"
    )
  ]
  .map(
    leg => ({

      strikePrice:
        Number(
          leg.querySelector(
            ".leg-strike"
          ).value
        ),

      optionType:
        leg.querySelector(
          ".leg-type"
        ).value,

      position:
        leg.querySelector(
          ".leg-position"
        ).value,

      entryPremium:
        Number(
          leg.querySelector(
            ".leg-entry"
          ).value
        ),

      currentPremium:
        Number(
          leg.querySelector(
            ".leg-current"
          ).value
        )

    })
  )
  .filter(
    leg =>
      leg.strikePrice > 0 &&
      leg.entryPremium > 0
  );

}



// ==========================================
// RENDER OPTIONS
// ==========================================

function renderOptions() {

  const tbody =
    document.getElementById(
      "optionTradesTable"
    );


  if (!tbody) {
    return;
  }


  const search =
    document.getElementById(
      "optionSearch"
    )?.value
      .trim()
      .toLowerCase() || "";


  const filtered =
    optionTrades.filter(
      item =>
        String(
          item.Underlying ||
          ""
        )
        .toLowerCase()
        .includes(search)
    );


  tbody.innerHTML =
    "";


  if (
    filtered.length === 0
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


  filtered.forEach(
    item => {

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML =
        `
        <td>${formatDate(item.Date)}</td>

        <td>
          ${escapeHtml(item.Underlying)}
        </td>

        <td>
          ${formatDate(item.Expiry)}
        </td>

        <td>
          ${escapeHtml(item.Strategy)}
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
          Number(item.Net_PL) >= 0
            ? "positive"
            : "negative"
        }">
          ₹${formatNumber(
            item.Net_PL
          )}
        </td>

        <td>
          ${statusBadge(
            getDisplayStatus(item)
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
// OPTIONS DASHBOARD
// ==========================================

function renderOptionsDashboard() {

  const total =
    optionTrades.length;


  const open =
    optionTrades.filter(
      item =>
        item.Status ===
        "Open"
    ).length;


  const target =
    optionTrades.filter(
      item =>
        item.Status ===
        "Target Hit"
    ).length;


  const sl =
    optionTrades.filter(
      item =>
        item.Status ===
        "SL Hit"
    ).length;


  const netPL =
    optionTrades.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.Net_PL || 0
        ),
      0
    );


  setText(
    "totalOptionTrades",
    total
  );


  setText(
    "openOptionTrades",
    open
  );


  setText(
    "optionTargetHit",
    target
  );


  setText(
    "optionSLHit",
    sl
  );


  setText(
    "optionNetPL",
    `₹${formatNumber(netPL)}`
  );

}



// ==========================================
// STATUS BADGE
// ==========================================

function statusBadge(status) {

  let className =
    "active";


  let label =
    status ||
    "Active";


  if (
    status ===
    "Target Hit"
  ) {

    className =
      "target";

    label =
      "🎯 Target Hit";

  }

  else if (
    status ===
    "Target After Due"
  ) {

    className =
      "target";

    label =
      "⚠️ Target After Due";

  }

  else if (
    status ===
    "SL Hit"
  ) {

    className =
      "sl";

    label =
      "🛑 SL Hit";

  }

  else if (
    status ===
    "SL After Due"
  ) {

    className =
      "sl";

    label =
      "⚠️ SL After Due";

  }


  return `
    <span
      class="badge ${className}"
    >
      ${escapeHtml(label)}
    </span>
  `;

}



// ==========================================
// DISPLAY STATUS
// ==========================================

function getDisplayStatus(item) {

  const status =
    String(
      item.Status || ""
    ).trim();


  const timingStatus =
    String(
      item.Timing_Status || ""
    ).trim();


  if (
    status ===
    "Target Hit"
    &&
    timingStatus ===
    "After Due"
  ) {

    return "Target After Due";

  }


  if (
    status ===
    "SL Hit"
    &&
    timingStatus ===
    "After Due"
  ) {

    return "SL After Due";

  }


  return status;

}



// ==========================================
// HELPERS
// ==========================================

function getMonthKey(value) {

  const date =
    formatInputDate(value);


  return date
    ? date.substring(0, 7)
    : "";

}



function formatMonth(value) {

  const parts =
    String(value).split("-");


  if (
    parts.length !== 2
  ) {

    return value;

  }


  const date =
    new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      1
    );


  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric"
    }
  );

}



function formatDate(value) {

  if (!value) {
    return "-";
  }


  const text =
    String(value);


  const match =
    text.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );


  if (match) {

    return `${match[3]}-${match[2]}-${match[1]}`;

  }


  return text;

}



function formatInputDate(value) {

  if (!value) {
    return "";
  }


  const text =
    String(value);


  const match =
    text.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );


  if (match) {

    return `${match[1]}-${match[2]}-${match[3]}`;

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return date
    .toISOString()
    .split("T")[0];

}



function formatNumber(value) {

  const number =
    Number(value || 0);


  return number.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );

}



function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (element) {

    element.textContent =
      value;

  }

}



function escapeHtml(value) {

  const text =
    String(value || "");


  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}



// ==========================================
// TOAST
// ==========================================

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );


  if (!toast) {
    return;
  }


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
