// base url
const baseUrl = "https://gutendex.com/books";

// elements
const sidebarElement = document.querySelector(".sidebar");
const sidebarOpener = document.querySelector("#sidebar-opener");
const searchInput = document.querySelector("#search");
const contentContainer = document.querySelector(".content-container");
const spinnerContainer = document.querySelector(".spinner-container");
const booksContainer = document.querySelector(".books-container");
const btnContainer = document.querySelector(".btn-container");
const notFoundMsg = document.querySelector(".not-found");

let isSidebarOpen = false; // state of sidebar

// toggle sidebar
const handleSidebar = () => {
  if (isSidebarOpen) {
    sidebarElement.style.right = "-100%";
  } else {
    sidebarElement.style.right = "0";
  }

  isSidebarOpen = !isSidebarOpen;
};

// close sidebar onclick outside
document.addEventListener("click", (e) => {
  if (
    isSidebarOpen &&
    !sidebarElement?.contains(e.target) &&
    !sidebarOpener?.contains(e.target)
  ) {
    sidebarElement.style.right = "-100%";
    isSidebarOpen = false;
  }
});

// debouncer for search
const debouncer = (func, delay) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// handle search by title
searchInput.addEventListener(
  "keyup",
  debouncer((e) => {
    console.log("value:", e.target.value);
    const value = e.target.value.trim();
    if (value) {
      const encodedValue = encodeURIComponent(value);
      console.log("encodedValue:", encodedValue);
      handleBooksFetch(`${baseUrl}?search=${encodedValue}`);
    } else {
      handleBooksFetch(baseUrl);
    }
  }, 300)
);

// display content
const displayContent = (data) => {
  booksContainer.innerHTML = "";
  btnContainer.innerHTML = "";

  if (data?.count > 0) {
    // books
    data?.results?.forEach((item) => {
      const divElement = document.createElement("div");
      divElement.setAttribute("data-id", item?.id);
      divElement.setAttribute("data-aos", "fade-up");
      divElement.setAttribute("data-aos-duration", "1000");
      divElement.classList.add("book-card-outer");

      const content = `
      <div class="book-card-inner">
        <img
          src=${item?.formats?.["image/jpeg"]}
          alt="Book Cover"
          class="book-img"
        />
        <div class="overlay">
          <div class="overlay-content">
            <div class="content-top">
              <p>ID: ${item?.id || "N/A"}</p>
              <i class="fa-solid fa-heart"></i>
            </div>
            <h4 class="book-title">
               ${item?.title || "Title Unknown"}
            </h4>
            <div class="book-info">
              <p>Genre: ${item?.subjects?.[0] || "Unknown"}</p>
              <p>Author: ${item?.authors?.[0]?.name || "Unknown"}</p>
            </div>
            <div class="details-btn-container">
              <a href="${
                item?.formats?.["text/html"]
              }" target="_blank" class="btn-details">Details</a>
            </div>
          </div>
        </div>
      </div>
    `;

      divElement.innerHTML = content;
      booksContainer.appendChild(divElement);
    });

    // previous btn
    const previousBtnElement = document.createElement("button");
    previousBtnElement.innerText = "Previous";
    previousBtnElement.classList.add("btn-prev");

    if (data?.previous) {
      previousBtnElement.disabled = false;
      previousBtnElement.classList.remove("btn-disabled");
    } else {
      previousBtnElement.disabled = true;
      previousBtnElement.classList.add("btn-disabled");
    }

    previousBtnElement.addEventListener("click", (e) => {
      handleBooksFetch(data?.previous);
    });

    btnContainer.appendChild(previousBtnElement);

    // next btn
    const nextBtnElement = document.createElement("button");
    nextBtnElement.innerText = "Next";
    nextBtnElement.classList.add("btn-next");

    if (data?.next) {
      nextBtnElement.disabled = false;
      nextBtnElement.classList.remove("btn-disabled");
    } else {
      nextBtnElement.disabled = true;
      nextBtnElement.classList.add("btn-disabled");
    }

    nextBtnElement.addEventListener("click", (e) => {
      handleBooksFetch(data?.next);
    });

    btnContainer.appendChild(nextBtnElement);

    notFoundMsg.style.display = "none";
    booksContainer.style.display = "grid";
    btnContainer.style.display = "flex";
  } else {
    notFoundMsg.style.display = "block";
  }

  spinnerContainer.style.display = "none";
};

// handle books fetching
const handleBooksFetch = (url) => {
  window.scrollTo(0, 0);

  spinnerContainer.style.display = "block";
  booksContainer.style.display = "none";
  btnContainer.style.display = "none";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // console.log("Books data:", data);
      if (data) {
        displayContent(data);
      }
    })
    .catch((err) => console.log("Books data fetching error:", err));
};

// initial books load
window.onload = () => {
  handleBooksFetch(baseUrl);
};
