const { Router } = require("express");
const routesController = require("../controllers/routesController");
const { authUser, allowUser } = require("../middleware/userStatus");

const router = Router();

// Schemas
/** 
 * @swagger 
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *          - username
 *          - email
 *          - password
 *      properties:
 *          username:
 *              type: string
 *              description: Your preferred username
 *          email:
 *              type: string
 *              description: Your valid email
 *          password:
 *              type: string
 *              description: Your strong desired password  
 *    LogUser:
 *      type: object
 *      required:
 *          - email
 *          - password
 *      properties:
 *          email:
 *              type: string
 *              description: Email used while signing up
 *          password:
 *              type: string
 *              description: Password used while signing up
 *    Blog:
 *      type: object
 *      required:
 *          - title
 *          - category
 *          - content
 *      properties:
 *          title: 
 *              type: string
 *              description: The post title
 *          category: 
 *              type: string
 *              description: The post category
 *          content: 
 *              type: string
 *              description: Full text for the post           
 *    Likes:
 *      type: object
 *      required:
 *          - post
 *      properties:
 *          post: 
 *              type: string
 *              description: The post id to assign like
 *    Comments:
 *      type: object
 *      required:
 *          - post
 *          - desc
 *      properties:
 *          post: 
 *              type: string
 *              description: The post id to assign your opinion
 *          desc: 
 *              type: string
 *              description: Your opinion
 *    Messages:
 *      type: object
 *      required:
 *          - names
 *          - email
 *          - message
 *      properties:
 *          names: 
 *              type: string
 *              description: Personal Names
 *          email: 
 *              type: string
 *              description: Your email address
 *          message: 
 *              type: string
 *              description: Full message 
 *    Admin Profile:
 *      type: object
 *      required:
 *          - names
 *          - profession
 *          - profAddress
 *          - skills
 *          - experience
 *          - socialMedia
 *          - profileImg
 *      properties:
 *          names:
 *              type: string
 *              description: Your full names
 *          profession:
 *              type: string
 *              description: Your profession
 *          profAddress:
 *              type: string
 *              description: Your phyisical address 
 *          skills:
 *              type: string
 *              description: Your skills set
 *          experience:
 *              type: string
 *              description: Your description about experience
 *          socialMedia:
 *              type: string
 *              description: Your social media handles
 *          profileImg:
 *              type: string
 *              description: Your profile image url
 *      examples: 
 *          names: John doe
 *          profession: Software developer
 *          profAddress: LA Downtown
 *          skills: HTML5 CSS3 JS
 *          experience: 3 Years 
 *          socialMedia: FaceBook Intagram

*/

// Tag Users
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Endpoint that deals with users
 */

// Tag blogs
/**
 * @swagger
 * tags:
 *  name: Blogs
 *  description: All blog endpoints
 */

// Queries tag
/**
 * @swagger
 * tags:
 *  name: Queries
 *  description: Endpoints for sending messages and view them
 */
// Tag user action
/**
 * @swagger
 * tags:
 *  name: User Actions
 *  description: Liking, commenting and profile
 */

/* User management */

// Sign up
/**
 * @swagger
 * /signup:
 *  post:
 *      tags: [Users]
 *      summary: Sign up endpoint
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: You have successfully created account
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: Invalid data
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *
 */

// Sign in
/**
 * @swagger
 * /login:
 *  post:
 *      tags: [Users]
 *      summary: Sign in endpoint
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LogUser'
 *      responses:
 *          200:
 *              description: You have logged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LogUser'
 *          400:
 *              description: Invalid data
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LogUser'
 */

// Logout
/**
 * @swagger
 * /logout:
 *  get:
 *      tags: [Users]
 *      description: Endpoint for logging user out
 *      summary: Logging user out
 */

/* Blog endpoints */
// Saving posts
/**
 * @swagger
 * /savePost:
 *  post:
 *      tags: [Blogs]
 *      summary: Adding New Post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Blog'
 *      responses:
 *          201:
 *              description: Your blog is saved!
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Blog'
 *          400:
 *              description: Please review your inputs
 *          403:
 *              description: You do not have permissions
 */

// Getting all Posts
/**
 * @swagger
 * /getAllPosts:
 *  get:
 *      tags: [Blogs]
 *      summary: This endpoint returns all saved posts
 *      responses:
 *          200:
 *              description: the list of saved posts
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Blog'
 *          404:
 *              description: No post found
 */

// Single post
/**
 * @swagger
 * /singlePost:
 *  get:
 *      tags: [Blogs]
 *      summary: Return a single post by id
 *      parameters:
 *          - in: query
 *            name: post
 *            schema:
 *                  type: string
 *            description: Post ID
 *            required: true
 *      responses:
 *          200:
 *              description: Single post by ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Blog'
 *          404:
 *              description: No post matching with supplied ID
 */

// Updating
/**
 * @swagger
 * /update:
 *  patch:
 *      tags: [Blogs]
 *      summary: Updating post by it ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Blog'
 *      parameters:
 *          - in: query
 *            name: post
 *            schema:
 *                  type: string
 *            description: Post ID
 *            required: true
 *      responses:
 *          202:
 *              description: Resource updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Blog'
 *          400:
 *              description: Resource Not found or invalid inputs
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Blog'
 *          403:
 *              description: Access denied
 */

// Deleting
/**
 * @swagger
 * /delete:
 *  delete:
 *      tags: [Blogs]
 *      summary: Delete post by ID
 *      requestBody:
 *          required: true,
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Blog'
 *      responses:
 *          202:
 *              description: Post deleted
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Blog'
 */

/* USER ACTIONS */
// Liking
/**
 * @swagger
 * /like:
 *  post:
 *      tags: [User Actions]
 *      summary: Endpoint for liking a post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Likes'
 *      responses:
 *          200:
 *              description: You disliked the post
 *          201:
 *              description: Your like added successfully
 *          400:
 *              description: Invalid sent data
 */

// Commenting
/**
 * @swagger
 * /comment:
 *  post:
 *      tags: [User Actions]
 *      summary: Endpoint for commenting on a post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Comments'
 *      responses:
 *          201:
 *              description: You comment is saved
 *          400:
 *              description: Invalid sent data
 */

/* Message endpoints */
// Saving message
/**
 * @swagger
 * /inquiry:
 *  post:
 *      tags: [Queries]
 *      summary: Sending a message
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Messages'
 *      responses:
 *          200:
 *              description: Your message is sent!
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Messages'
 *          400:
 *              description: Please review your inputs
 */

// Viewing messages
/**
 * @swagger
 * /viewMessages:
 *  get:
 *      tags: [Queries]
 *      summary: Admin endpoint for checking messages
 *      responses:
 *          200:
 *              description: All the messages
 *          400:
 *              description: Invalid request
 */

/* Profile */
// Get Profile
/**
 * @swagger
 * /profile:
 *  get:
 *      tags: [Users]
 *      summary: This endpoint allows a user to view admin profile
 *      responses:
 *          200:
 *              description: Saved admin profile
 *          400:
 *              description: Invalid request
 *
 */

// Saving profile
/**
 * @swagger
 * /profile:
 *  post:
 *      tags: [Users]
 *      summary: Endpoint for admin to save profile
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Admin Profile'
 *      responses:
 *          201:
 *              description: Admin Profile
 *          400:
 *              description: Invalid request or errors
 *          403:
 *              description: Insufficient permissions
 *
 */

router.get("/signup", routesController.signup_get);
router.post("/signup", routesController.signup_post);
router.post("/login", routesController.login_post);
router.post("/savePost", authUser, routesController.postBlog);
router.get("/getAllPosts", routesController.renderPosts);
router.get("/single", routesController.singleView);
router.get("/singlePost", routesController.single);

// Profile
router.get("/profile", routesController.profile);
router.post("/profile", authUser, routesController.saveProfile);

// liking and commenting
router.post("/like", allowUser, routesController.like_post);
router.post("/dislike", allowUser, routesController.dislike_post);
router.post("/comment", allowUser, routesController.comment_post);
router.get("/getAllPostsLikes", routesController.getLikes);
router.get("/getAllPostsdisLikes", routesController.getdisLikes);
router.get("/getAllComments", routesController.getComments);
router.delete("/comment", routesController.deleteComment);
router.patch("/comment", routesController.editComment);
/* Modification on posts */
// Deleting
router.delete("/delete", authUser, routesController.deletePost);
router.patch("/update", authUser, routesController.updatePost);

/**
 * Endpoints for sending and viewing all queries
 */
// Sending
router.post("/inquiry", routesController.sendQuery);
router.get("/viewMessages", authUser, routesController.viewMessages);

module.exports = router;
