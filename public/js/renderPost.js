async function fetchAllArticles() {
  try {
    const request = await fetch("/getAllPosts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return response.results;
  } catch (error) {
    console.log(error);
  }
}
async function fetchAllMessages() {
  try {
    const request = await fetch("/viewMessages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
async function fetchAllArticlesLikes(post) {
  try {
    const request = await fetch(`/getAllPostsLikes?post=${post}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return await response;
  } catch (error) {
    console.log(error);
  }
}
async function fetchAllArticlesDisLikes(post) {
  try {
    const request = await fetch(`/getAllPostsdisLikes?post=${post}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return await response;
  } catch (error) {
    console.log(error);
  }
}
async function fetchAllArticlesComment(post) {
  try {
    const request = await fetch(`/getAllComments?post=${post}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return await response;
  } catch (error) {
    console.log(error);
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}