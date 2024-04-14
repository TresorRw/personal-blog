const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const { app } = require("../app");
chai.use(chaiHttp);
let token, post_id;

describe("User sign up and sign in and logout", () => {
  it("Signup Form display", (done) => {
    chai
      .request(app)
      .get("/signup")
      .end((err, res) => {
        expect(res.type).equal("text/html");
        done();
      });
  });
  it("Sign up: Check for errors and display them else save user and return user", (done) => {
    chai
      .request(app)
      .post("/signup")
      .send({
        name: "t-man",
        email: "trt",
        password: "123456",
      })
      .end((err, res) => {
        if (res.body.errors) {
          assert.isNotEmpty(res.body.errors.username);
          assert.isNotEmpty(res.body.errors.email);
          assert.isDefined(res.body.errors.password);
        } else {
          assert.isDefined(res.body.user);
          token = res.body.token;
        }
        done();
      });
  });
  it("Sign in: If errors display them else return token", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({
        email: "alaintresorcyusa683@gmail.com",
        password: "12345678",
      })
      .end((err, res) => {
        if (res.status == 200) {
          token = res.body.authToken;
          assert.isDefined(res.body.user);
          assert.isDefined(res.body.userRole);
        }
        done();
      });
  });
  it("Logout: Redirect user to homepage", (done) => {
    chai
      .request(app)
      .get("/logout")
      .redirects(0)
      .end((err, res) => {
        res.request.cookie = {
          pbtkn: { maxAge: 20 },
        };
        done();
      });
  });
});

describe("Blog Activities", () => {
  it("New Post: Checking permissions and saving a post", (done) => {
    chai
      .request(app)
      .post("/savePost")
      .set("Cookie", `pbtkn=${token}`)
      .send({
        title: "d",
        category: "testing-superagent",
        content: "hii",
        postImage: "image",
      })
      .end((err, res) => {
        if (res.body.status == 403) {
          assert.isDefined(res.body.message);
        } else if (res.body.status == 201) {
          post_id = res.body.data._id;
          assert.isDefined(res.body.data);
        } else {
          assert.isDefined(res.body.message);
          expect(res.body.status).to.be.equal(400);
        }
        done();
      });
  });
  it("Rendering blogs: Fetch all posts or display that no stored posts", (done) => {
    chai
      .request(app)
      .get("/getAllPosts")
      .end((err, res) => {
        if (res.body.status == 200) {
          assert.isArray(res.body.results);
        } else {
          assert.isDefined(res.body.message);
        }
        done();
      });
  });
  it("Updating: Check permissions [Granted] check availability and modify [Denied] Stop", (done) => {
    chai
      .request(app)
      .patch("/update")
      .set("Cookie", `pbtkn=${token}`)
      .query(`post=${post_id}`)
      .send({
        title: "d",
        category: "testing-superagent-update",
        content: "hii updated",
      })
      .end((err, res) => {
        if (res.body.status == 202) {
          assert.isDefined(res.body.message);
        } else if (res.body.status == 403 || res.body.status == 400) {
          assert.isDefined(res.body.message);
          assert.isNotNull(res.body.message);
        }
        done();
      });
  });
  it("Delete: Check permissions [Granted] continue to find post to delete [Denied] Stop", (done) => {
    chai
      .request(app)
      .delete("/delete")
      .send({
        post: post_id,
      })
      .set("Cookie", `pbtkn=${token}`)
      .end((err, res) => {
        if (res.body.status == 202) {
          assert.isDefined(res.body.deletedCount);
        } else if (res.body.status == 403) {
          assert.isDefined(res.body.message);
          assert.isNotNull(res.body.message);
        } else {
          expect(res.body.message).to.be.equal(
            "Can not delete due to unknown post id.",
          );
        }
        done();
      });
  });
  // Commeting and liking
});

describe("Messages", () => {
  it("Sending messages", (done) => {
    chai
      .request(app)
      .post("/inquiry")
      .send({
        names: "testUser NodeJS",
        email: "node@superagent.com",
        message: "Hello user! am node super agent.",
      })
      .end((err, res) => {
        if (res.body.errors) {
          assert.isDefined(res.body.errors.names);
          assert.isDefined(res.body.errors.email);
          assert.isDefined(res.body.errors.messageContent);
        } else {
          assert.isDefined(res.body.request);
          assert.isNotEmpty(res.body.request);
        }
        done();
      });
  });
  it("Displaying messages", (done) => {
    chai
      .request(app)
      .get("/viewMessages")
      .set("Cookie", `pbtkn=${token}`)
      .end((err, res) => {
        if (res.body.status == 403 || res.body.status == 400) {
          assert.isDefined(res.body.message);
        } else if (res.body.status == 200) {
          assert.isArray(res.body.messages);
        }
        done();
      });
  });
});

describe("Profile information", () => {
  it("Showing profile data", (done) => {
    chai
      .request(app)
      .get("/profile")
      .end((err, res) => {
        if (res.body.status == 200) {
          assert.isDefined(res.body.profileInformation);
          assert.isArray(res.body.profileInformation);
        } else {
          assert.isDefined(res.body.error);
        }
        done();
      });
  });
  it("Saving new profile information", (done) => {
    chai
      .request(app)
      .post("/profile")
      .set("Cookie", `pbtkn=${token}`)
      .send({
        names: "cat",
        profession: "Software killer",
        profAddress: "Rda",
        skills: "Web2.0",
        experience: "5 Years",
        socialMedia: "@Trw",
      })
      .end((err, res) => {
        if (res.status == 403) {
          assert.isDefined(res.body.message);
        } else if (res.body.status == 201) {
          assert.isDefined(res.body.data);
          assert.isNotEmpty(res.body.data);
        } else if (res.body.status == 400) {
          assert.isDefined(res.body.errors);
          assert.isNotEmpty(res.body.errors);
        }
        done();
      });
  });
});

describe("Like and comments", () => {
  it("Like a post", (done) => {
    chai
      .request(app)
      .post("/like")
      .send({
        post_id: post_id,
      })
      .set("Cookie", `pbtkn=${token}`)
      .end((err, res) => {
        if (
          res.body.status == 403 ||
          res.body.status == 400 ||
          res.body.status == 200
        ) {
          assert.isDefined(res.body.message);
          assert.isNotEmpty(res.body.message);
        } else if (res.body.status == 201) {
          assert.isDefined(res.body.info);
          assert.isArray(res.body.info);
        } else {
          expect(res.body.message).to.be.equal("You disliked the post.");
        }
        done();
      });
  });

  it("Comment on a post", (done) => {
    chai
      .request(app)
      .post("/comment")
      .send({
        post_id: post_id,
        commentText: "This node superagent comment!",
      })
      .set("Cookie", `pbtkn=${token}`)
      .end((err, res) => {
        if (
          res.body.status == 403 ||
          res.body.status == 400 ||
          res.body.status == 200
        ) {
          assert.isDefined(res.body.message);
          assert.isNotEmpty(res.body.message);
        } else if (res.body.status == 201) {
          assert.isDefined(res.body.data);
          assert.isArray(res.body.data);
        }
        done();
      });
  });
});

describe("Getting likes and comments for custom post", () => {
  it("Getting Likes", (done) => {
    chai
      .request(app)
      .get("/getAllPostsLikes")
      .set("Cookie", `pbtkn=${token}`)
      .query(`post=${post_id}`)
      .end((err, res) => {
        if (res.status == 200) {
          assert.isDefined(res.body.results);
          assert.isArray(res.body.results);
        } else {
          expect(res.body.status).to.be.equal(404);
          assert.isNotEmpty(res.body.message);
        }
        done();
      });
  });
  it("Getting comments", (done) => {
    chai
      .request(app)
      .get("/getAllComments")
      .set("Cookie", `pbtkn=${token}`)
      .query(`post=${post_id}`)
      .end((err, res) => {
        if (res.status == 200) {
          assert.isDefined(res.body.comments);
          assert.isArray(res.body.comments);
        } else {
          expect(res.body.status).to.be.equal(404);
          assert.isNotEmpty(res.body.message);
        }
        done();
      });
  });
});

describe("Rendering post per condition", () => {
  it("Render post by ID on interface", (done) => {
    chai
      .request(app)
      .get("/single")
      .query(`post=${post_id}`)
      .end((err, res) => {
        expect(res.type).to.be.equal("text/html");
        done();
      });
  });
  it("Render post", (done) => {
    chai
      .request(app)
      .get("/singlePost")
      .query(`post=${post_id}`)
      .end((err, res) => {
        if (res.body.status == 200) {
          assert.isDefined(res.body.request);
        } else {
          assert.isNotEmpty(res.body.error);
        }
        done();
      });
  });
});

describe("Page redirection and rendering", () => {
  it('"/" Render the homepage', (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res.type).to.be.equal("text/html");
        done();
      });
  });
  it("Rendering articles page for admin", (done) => {
    chai
      .request(app)
      .get("/allArticles")
      .set("Cookie", `pbtkn=${token}`)
      .end((err, res) => {
        if (res.status == 200) {
          expect(res.type).to.be.equal("text/html");
        } else {
          assert.isDefined(res.body.message);
        }
        done();
      });
  });
  it("Rendering messages for admin", (done) => {
    chai
      .request(app)
      .get("/dashboard")
      .set("Cookie", `pbtkn=${token}`)
      .end((err, res) => {
        if (res.status == 200) {
          expect(res.type).to.be.equal("text/html");
        } else {
          assert.isDefined(res.body.message);
        }
        done();
      });
  });
  it("Rendering blog page for user", (done) => {
    chai
      .request(app)
      .get("/blog")
      .end((err, res) => {
        expect(res.type).to.be.equal("text/html");
        done();
      });
  });
});

// End
