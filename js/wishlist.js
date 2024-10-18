// elements
const contentContainer = document.querySelector(".content-container");
const spinnerContainer = document.querySelector(".spinner-container");
const booksContainer = document.querySelector(".books-container");
const notFoundMsg = document.querySelector(".not-found");

// display content
const displayContent = (data) => {
  spinnerContainer.style.display = "none";

  if (data?.length > 0) {
    notFoundMsg.style.display = "none";
    booksContainer.style.display = "grid";

    booksContainer.innerHTML = "";

    // books
    data?.forEach((item) => {
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
              <i class="fa-solid fa-heart liked"></i>
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
      heartIcon.addEventListener("click", () => {
        heartIcon.classList.remove("liked");
        handleRemoveFromWishlist(item);
      });
    });
  } else {
    notFoundMsg.style.display = "block";
  }
};

// handle remove books from wishlist
const handleRemoveFromWishlist = (data) => {
  const likedItems = JSON.parse(localStorage.getItem("liked-items")) || [];
  const itemIndex = likedItems?.findIndex((item) => item?.id === data?.id);

  if (itemIndex !== -1) {
    likedItems?.splice(itemIndex, 1);
    console.log("likedItems:", likedItems);
    localStorage.setItem("liked-items", JSON.stringify(likedItems));
    handleWishlistBooksFetch();
  }
};

// handle wishlist books fetching
const handleWishlistBooksFetch = () => {
  window.scrollTo(0, 0);

  spinnerContainer.style.display = "block";
  booksContainer.style.display = "none";

  const likedItems = JSON.parse(localStorage.getItem("liked-items")) || [];
  displayContent(likedItems);
};

// initial books load
window.onload = () => {
  handleWishlistBooksFetch();
};
