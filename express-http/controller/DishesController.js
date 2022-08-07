export const getAll = (req, res) => {
    res.end('Will send all the dishes to you!')
}

export const getById = (req, res) => {
    res.end(`Will send details of the dish: ${req.params.dishId} to you!`)
}

export const create = (req, res) => {
    console.log(req.body)
    res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description} to the menu!`)
}

export const update = (req, res) => {
    res.end(`Will update the dish: ${req.params.dishId} with details: ${req.body.description}`)
}

export const deleteAll = (req, res) => {
    res.end(`Will delete all the dishes`)
}

export const deleteById = (req, res) => {
    res.end(`Will delete dish: ${req.params.dishId}`)
}
