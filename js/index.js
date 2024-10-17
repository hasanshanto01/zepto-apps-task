// elements
const sidebarElement = document.querySelector(".sidebar");
const sidebarOpener = document.querySelector("#sidebar-opener");

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

// Close sidebar onclick outside
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
