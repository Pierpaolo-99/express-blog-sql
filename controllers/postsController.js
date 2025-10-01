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

            const tagLabels = tagResults.map(tag => tag.label);

            post.tags = tagLabels

            res.json(post)
        })


    })
}

function create(req, res) {
    const { title, content, image, tags } = req.body;

    if (!title || !content || !image) {
        return res.status(400).json({ error: 'title, content, and image are required!' });
    }

    const sqlInsertPost = 'INSERT INTO posts (title, content, image) VALUES (?, ?, ?)';

    connection.query(sqlInsertPost, [title, content, image], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });

        const postId = result.insertId;

        if (Array.isArray(tags) && tags.length > 0) {
            // Verificare quali tag esistono già
            const sqlFindTags = 'SELECT id, label FROM tags WHERE label IN (?)';

            connection.query(sqlFindTags, [tags], (err, existingTags) => {
                if (err) return res.status(500).json({ error: 'Failed to check existing tags' });

                // Estrarre i tag esistenti e i loro ID
                const existingTagIds = existingTags.map(tag => tag.id);
                const existingTagLabels = existingTags.map(tag => tag.label);

                // Determinare i nuovi tag da inserire
                const newTags = tags.filter(tag => !existingTagLabels.includes(tag));

                if (newTags.length > 0) {
                    // Inserire i nuovi tag
                    const sqlInsertTags = 'INSERT INTO tags (label) VALUES ?';
                    const newTagValues = newTags.map(tag => [tag]);

                    connection.query(sqlInsertTags, [newTagValues], (err, result) => {
                        if (err) return res.status(500).json({ error: 'Failed to insert new tags' });

                        // Recuperare gli ID dei nuovi tag
                        const newTagIds = Array.from({ length: result.affectedRows }, (_, i) => result.insertId + i);

                        // Unire gli ID dei tag esistenti e nuovi
                        const allTagIds = [...existingTagIds, ...newTagIds];

                        // Associare i tag al post
                        associateTagsToPost(postId, allTagIds, res, { title, content, image, tags });
                    });
                } else {
                    // Se non ci sono nuovi tag, associare solo i tag esistenti
                    associateTagsToPost(postId, existingTagIds, res, { title, content, image, tags });
                }
            });
        } else {
            // Se non ci sono tag, restituire il post creato
            res.status(201).json({
                id: postId,
                title,
                content,
                image,
                tags: []
            });
        }
    });
}

// Funzione per associare i tag al post
function associateTagsToPost(postId, tagIds, res, postData) {
    const sqlInsertPostTags = 'INSERT INTO post_tag (post_id, tag_id) VALUES ?';
    const tagValues = tagIds.map(tagId => [postId, tagId]);

    connection.query(sqlInsertPostTags, [tagValues], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to associate tags with the post' });

        res.status(201).json({
            id: postId,
            ...postData
        });
    });
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
    create,
    destroy
}