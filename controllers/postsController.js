
const connection = require('../data/db')
// import the data
const posts = require('../data/posts')

function index(req, res) {

    const sql = 'SELECT * FROM posts'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err })

        console.log(results);

        res.json(results)
    })
}

function show(req, res) {
    const postSlug = req.params.slug

    // find the pizza with the slug
    const post = posts.find(post => post.slug === postSlug)

    // handle 404 error
    if (!post) {
        return res.status(404).json({
            error: '404 not found',
            message: 'post not found'
        })
    }

    // return the post
    res.json(post)
}

function create(req, res) {

    // create a new slug
    const newSlug = req.body.title.toLowerCase().replace(/ /g, '-')

    // create a new post object
    const newPost = {
        title: req.body.title,
        slug: newSlug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }

    // add the new post to the posts array
    posts.push(newPost)

    console.log(req.body);
    console.log(posts);

    // return the new post
    res.status(201)
    res.json(newPost)

    //res.send('create a new post')
}

function update(req, res) {

    const postSlug = req.params.slug

    // find the post with the slug
    const post = posts.find(post => post.slug === postSlug)

    // handle 404 error
    if (!post) {

        res.status(404)

        return res.json({
            error: "Not Found",
            message: "Pizza non trovata"
        })
    }

    // update the post
    post.title = req.body.title
    post.slug = req.body.title.toLowerCase().replace(/ /g, '-')
    post.content = req.body.content
    post.image = req.body.image
    post.tags = req.body.tags

    console.log(posts);

    // return the updated post
    res.json(post)

    //res.send(`update the post with slug: ${postSlug}`)
}

function modify(req, res) {

    const postSlug = req.params.slug

    // find the post with the slug
    const post = posts.find(post => post.slug === postSlug)

    // handle 404 error
    if (!post) {

        res.status(404)

        return res.json({
            error: "Not Found",
            message: "Pizza non trovata"
        })
    }

    // modify the post
    if (req.body.title) {
        post.title = req.body.title
        post.slug = req.body.title.toLowerCase().replace(/ /g, '-')
    }
    if (req.body.content) {
        post.content = req.body.content
    }
    if (req.body.image) {
        post.image = req.body.image
    }
    if (req.body.tags) {
        post.tags = req.body.tags
    }

    console.log(posts);

    // return the modified post
    res.json(post)

    //res.send(`modify the post with slug: ${postSlug}`)
}

function destroy(req, res) {

    const postSlug = req.params.slug

    // find the pizza with the slug
    const post = posts.find(post => post.slug === postSlug);

    // handle 404 error
    if (!post) {
        return res.status(404).json({
            error: '404 not found',
            message: 'post not found'
        })
    };

    // remove the post
    posts.splice(posts.indexOf(post), 1);
    res.sendStatus(204);

    console.log(posts);
}

module.exports = {
    index,
    show,
    create,
    update,
    modify,
    destroy
}