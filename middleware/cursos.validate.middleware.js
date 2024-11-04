import { cursoSchema } from '../schemas/cursos.validate.js';

export const validateCurso = (req, res, next) => {
    cursoSchema.validate(req.body)
        .then(() => next())
        .catch((err) => res.status(400).json({ error: err.errors.join(", ") }))
}

