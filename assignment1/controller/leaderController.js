export const getAll = (req, res) => {
    res.end(`Will send all the leaderships to you!`)
}

export const getById = (req, res) => {
    res.send(`Will send details of the leadership: ${req.params.leaderId} to you!`)
}

export const create = (req, res) => {
    res.end(`Will add the leadership: ${req.body.name} with details: ${req.body.description}`)
}

export const update = (req, res) => {
    res.end(`Will update the leadership: ${req.body.name} with details: ${req.body.description}`)
}

export const deleteById = (req, res) => {
    res.end(`Will delete the leadership: ${req.params.leaderId}`)
}