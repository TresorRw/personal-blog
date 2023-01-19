let header = document.getElementById("top");
let mn = document.getElementById("mn");
let links = document.getElementsByTagName("li");
let loggedUser = document.cookie.slice(5);
let menus = document.getElementById("menus");
let sms = document.getElementById("sms");

let defaultLoad = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};
