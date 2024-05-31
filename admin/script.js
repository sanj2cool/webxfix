function timestampToHumanTime(timestamp) {
  const date = new Date(timestamp);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}

function displayLeadDataImproved(
  lead,
  cols = false,
  classs = "col-md-4",
  tablecount = 3
) {
  if (lead) {
    lead = Object.fromEntries(
      Object.entries(lead).filter(
        ([key, value]) =>
          key !== "call_history" &&
          value != null &&
          value !== "" &&
          value !== "0"
      )
    );

    const ColItem1 = [
      "company_name",
      "category",
      "revenue",
      "company_type",
      "company_size",
      "appeared_on",
      "address",
      "state",
      "founded",
      "years_in_business",
    ];
    const ColItem2 = ["first_name", "contact_job_title", "phone_number"];
    const ColItem3 = [
      "bbb_profile",
      "fb_url",
      "fb_rating",
      "is_facebook_ads",
      "is_adwords",
      "instagram_url",
      "twitter_url",
      "twitter_ads",
      "linkedin_url",
      "linkedin_ads",
      "youtube_url",
      "bing_ads",
    ];

    const container = document.createElement("div");
    container.className = "container";

    const row = document.createElement("div");
    row.className = "row";
    container.appendChild(row);

    const columns = [];
    for (let i = 0; i < tablecount; i++) {
      const col = document.createElement("div");
      col.className = classs;
      row.appendChild(col);

      if (tablecount === 3) {
        const head = document.createElement("div");
        head.className = "col text-center h4 mb-3";
        col.appendChild(head);
        if (i === 0) {
          head.textContent = "Company Information";
        } else if (i === 1) {
          head.textContent = "Contact Information";
        } else if (i === 2) {
          head.textContent = "Online Presence";
        }
      }

      const table = document.createElement("table");
      table.className = "table table-bordered";
      col.appendChild(table);

      columns.push(table);
    }

    const itemsPerTable = Math.ceil(Object.keys(lead).length / tablecount);
    let currentTableIndex = 0;
    let currentItemCount = 0;

    Object.entries(lead).forEach(([key, value]) => {
      key = cols ? cols[key] : key;
      const tr = document.createElement("tr");
      const th = document.createElement("th");

      let capitalize = handleCapitalize(key);
      th.textContent = capitalize ? capitalize : slugToText(key);

      const td = document.createElement("td");

      let cond = key.toLowerCase();

      if (cond.includes("address")) {
        const a = document.createElement("a");
        a.href = "https://www.google.com/maps/search/" + encodeURIComponent(value);
        a.textContent = value;
        a.target = "_blank";
        td.appendChild(a);
      } else if (cond.includes("time")) {
        td.textContent = timestampToHumanTime(parseInt(value) * 1000);
      } else if (cond.includes("email")) {
        const a = document.createElement("a");
        a.href = `mailto:${value}`;
        a.textContent = value;
        a.target = "_blank";
        td.appendChild(a);
      } else if (cond.includes("phone")) {
        const a = document.createElement("a");
        a.href = `tel:${value}`;
        a.textContent = value;
        a.target = "_blank";
        td.appendChild(a);
      } else if (cond === "website" || cond.endsWith("_url") || cond === "bbb_profile") {
        const a = document.createElement("a");
        a.href = value;
        a.textContent = value;
        a.target = "_blank";
        td.appendChild(a);
      } else if (cond === "is_facebook_ads") {
        td.textContent = value === "1" ? "Yes" : "No";
      } else {
        td.textContent = value;
      }

      tr.appendChild(th);
      tr.appendChild(td);

      if (tablecount <= 2) {
        columns[currentTableIndex].appendChild(tr);
        currentItemCount++;
        if (currentItemCount >= itemsPerTable) {
          currentTableIndex++;
          currentItemCount = 0;
        }
      } else {
        if (ColItem1.includes(cond)) {
          columns[0].appendChild(tr);
        } else if (ColItem2.includes(cond)) {
          if (cond === "first_name") {
            th.textContent = "Name";
            td.textContent = lead["first_name"] + " " + lead["last_name"];
          }
          columns[1].appendChild(tr);
        } else if (ColItem3.includes(cond)) {
          if (cond === "fb_rating") {
            th.textContent = "FB Stats";
            td.textContent = `${lead["fb_likes"]} Likes – ${lead["fb_rating"]} Rating (from ${lead["fb_reviews"]} Reviews)`;
          } else if (["is_facebook_ads", "bing_ads", "twitter_ads", "linkedin_ads"].includes(cond)) {
            td.textContent = value === "1" ? "Yes" : "No";
          } else if (cond === "is_adwords") {
            th.textContent = "Google Ads";
            td.textContent = value === "1" ? "Yes" : "No";
          }
          columns[2].appendChild(tr);
        }
      }
    });

    return container;
  } else {
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-warning";
    alertDiv.textContent = "No lead data available.";
    return alertDiv;
  }
}

function slugToText(slug) {
  let words = slug.replace(/[-_]/g, " ").split(" ");
  let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(" ");
}

function handleCapitalize(str) {
  if (str === "bbb_profile") {
    let parts = str.split('_');
    if (parts.length !== 2) {
      return false;
    }
    let firstPart = parts[0].toUpperCase();
    let secondPart = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
    return `${firstPart} ${secondPart}`;
  }
  return false;
}
