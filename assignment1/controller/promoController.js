export const getAll = (req, res) => {
    res.end(`Will send all the promotions to you!`)
}

export const getById = (req, res) => {
    res.send(`Will send details of the promotion: ${req.params.promoId} to you!`)
}

export const create = (req, res) => {
    res.end(`Will add the promotion: ${req.body.name} with details: ${req.body.description}`)
}

export const update = (req, res) => {
    res.end(`Will update the promotion: ${req.body.name} with details: ${req.body.description}`)
}

export const deleteById = (req, res) => {
    res.end(`Will delete the promotion: ${req.params.promoId}`)
}