const blogForm = document.querySelector("form");
let titleError = document.querySelector(".title.error");
let categoryError = document.querySelector(".category.error");
let moreError = document.querySelector(".more.error");
let stst = document.querySelector(".stts");
async function imageRender(params) {
  try {
    const re = fetch("https://picsum.photos/500", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await re;
    return res.url;
  } catch (error) {
    console.log(error);
  }
}
blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  stst.style.color = "green";
  stst.style.display = "block";
  stst.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
  // Capturing values
  const title = blogForm.title.value;
  const category = blogForm.category.value;
  const content = blogForm.more.value;
  let postImage = await imageRender();
  titleError.textContent =
    categoryError.textContent =
    moreError.textContent =
      "";
  try {
    const request = await fetch("/savePost", {
      method: "POST",
      body: JSON.stringify({
        title,
        category,
        content,
        postImage,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    if (response.message) {
      document.querySelector("#logsms").style.color = "green";
      document.querySelector(
        "#logsms"
      ).innerHTML = `${response.message} close the modal`;
      stst.innerHTML = `<i class="fa-solid fa-check"></i>`;
      setTimeout(() => {
        blogForm.title.value = "";
        blogForm.category.value = "";
        blogForm.more.value = "";
        postImage = imageRender();
        document.querySelector("#logsms").innerHTML = ``;
      }, 5000);
    }
    if (response.errors) {
      stst.style.display = "none";
      titleError.textContent = response.errors.title;
      categoryError.textContent = response.errors.category;
      moreError.textContent = response.errors.content;
    }
  } catch (err) {
    console.log(err);
  }
});
