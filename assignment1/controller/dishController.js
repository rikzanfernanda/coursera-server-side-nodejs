export const getById = (req, res) => {
    res.end(`Will send you details of the dish: ${req.params.dishId} to you!`)
}

export const update = (req, res) => {
    res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`)
}

export const deleteById = (req, res) => {
    res.end(`Deleting dish: ${req.params.dishId}`)
}