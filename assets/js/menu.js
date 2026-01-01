const menuBtnToggler = function (e) {
  const menu = document.querySelector("#menu");
  if (menu.classList.contains("hidden-menu")) {
    menu.classList.remove("hidden-menu");
    menu.classList.add("showing-menu");
  } else {
    menu.classList.remove("showing-menu");
    menu.classList.add("hidden-menu");
  }
};

document.querySelector("#menu-btn").addEventListener("click", menuBtnToggler);
