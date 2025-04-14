
const connection = require('../data/db')

function index(req, res) {

    const sql = 'SELECT * FROM posts'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err })

        console.log(results);

        res.json(results)
    })
}

function show(req, res) {

    const id = req.params.id

    const sql = 'SELECT * FROM posts WHERE id = ?'

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Posts not found' });
        res.json(results[0]);
    })
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
    destroy
}