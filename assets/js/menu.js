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
const links = document.querySelectorAll("#main-menu a");
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function (e) {
    document.querySelector("#main-window").setAttribute("open", "true");
  });
}
