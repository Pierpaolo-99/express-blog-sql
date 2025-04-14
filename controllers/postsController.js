
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

    const postId = Number(req.params.id)

    const sql = 'SELECT * FROM posts WHERE id = ?'

    const sqlJoin = `
    SELECT tags.label
    FROM post_tag
    JOIN tags ON post_tag.tag_id = tags.id
    WHERE post_tag.post_id = ?
    `

    connection.query(sql, [postId], (err, postResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (postResults.length === 0) return res.status(404).json({ error: 'Posts not found' });

        const post = postResults[0]

        connection.query(sqlJoin, [postId], (err, tagResults) => {
            if (err) return res.status(500).json({ message: 'Query failer' });

            post.tags = tagResults

            res.json(post)
        })


    })
}

function destroy(req, res) {

    const postId = Number(req.params.id)

    const sql = 'DELETE FROM posts WHERE id = ?'

    connection.query(sql, [postId], (err) => {
        if (err) return res.status(500).json({ message: 'query failed' });
        res.sendStatus(204)
    })
}

module.exports = {
    index,
    show,
    destroy
}