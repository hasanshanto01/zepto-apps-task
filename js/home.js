// base url
const baseUrl = "https://gutendex.com/books";

// elements
const genreSelect = document.querySelector("#genre");
const searchInput = document.querySelector("#search");
const contentContainer = document.querySelector(".content-container");
const spinnerContainer = document.querySelector(".spinner-container");
const booksContainer = document.querySelector(".books-container");
const btnContainer = document.querySelector(".btn-container");
const notFoundMsg = document.querySelector(".not-found");

// handle filter by genre
genreSelect.addEventListener("change", (e) => {
  const value = e.target.value.trim();
  console.log("value:", value);
  if (value !== "") {
    const encodedValue = encodeURIComponent(value);
    handleBooksFetch(`${baseUrl}?topic=${encodedValue}`);
  } else {
    handleBooksFetch(baseUrl);
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
    const value = e.target.value.trim();
    if (value) {
      const encodedValue = encodeURIComponent(value);
      handleBooksFetch(`${baseUrl}?search=${encodedValue}`);
    } else {
      handleBooksFetch(baseUrl);
    }
  }, 300)
);

// display content
const displayContent = (data) => {
  spinnerContainer.style.display = "none";

  if (data?.count > 0) {
    notFoundMsg.style.display = "none";
    booksContainer.style.display = "grid";
    btnContainer.style.display = "flex";

    booksContainer.innerHTML = "";
    btnContainer.innerHTML = "";

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

      const heartIcon = divElement.querySelector(".fa-heart");

      const likedItems = JSON.parse(localStorage.getItem("liked-items")) || [];
      const isLiked = likedItems?.some(
        (likedItem) => likedItem?.id === item?.id
      );
      if (isLiked) {
        heartIcon.classList.add("liked");
      }

      heartIcon.addEventListener("click", () => {
        heartIcon.classList.toggle("liked");
        handleWishlist(item);
      });
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

    previousBtnElement.addEventListener("click", () => {
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

    nextBtnElement.addEventListener("click", () => {
      handleBooksFetch(data?.next);
    });

    btnContainer.appendChild(nextBtnElement);
  } else {
    notFoundMsg.style.display = "block";
  }
};

// handle wishlist
const handleWishlist = (data) => {
  const likedItems = JSON.parse(localStorage.getItem("liked-items")) || [];
  const itemIndex = likedItems?.findIndex((item) => item?.id === data?.id);
  if (itemIndex === -1) {
    likedItems.push(data);
  } else {
    likedItems?.splice(itemIndex, 1);
  }
  localStorage.setItem("liked-items", JSON.stringify(likedItems));
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
      //   console.log("Books data:", data);
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
