// import yup from 'yup'


// export const cursoSchema = yup.object({
//     _id: yup.string().required().matches(/^[a-f\d]{24}$/i, "El ID debe ser una cadena de 24 caracteres hexadecimales"),
//     nombre: yup.string().required().min(5, "El nombre del curso debe tener al menos 5 caracteres"),
//     categoria: yup.string().required(),
//     descripcion: yup.string().required().min(20, "La descripción debe tener al menos 20 caracteres"),
//     tecnologias: yup.array().of(yup.string().required()).min(1, "Debe incluir al menos una tecnología"),
//     horas: yup.number().required().positive().integer().min(1, "Debe ser al menos 1 hora"),
//     img: yup.string().required().matches(/\.(jpg|jpeg|png)$/, "La imagen debe tener un formato jpg, jpeg o png"),
//     link: yup.string().url("Debe ser una URL válida").required()
// });

import yup from 'yup';

export const cursoSchema = yup.object({
    _id: yup.string().required().matches(/^[a-f\d]{24}$/i, "El ID debe ser una cadena de 24 caracteres hexadecimales"),
    nombre: yup.string().required().min(5, "El nombre del curso debe tener al menos 5 caracteres"),
    
    // ID del profesor que creó el curso
    profesorId: yup.string()
        .required("El ID del profesor es obligatorio")
        .matches(/^[a-f\d]{24}$/i, "El ID del profesor debe ser una cadena de 24 caracteres hexadecimales"),

    // ID de la categoría
    categoriaId: yup.string()
        .required("La categoría es obligatoria")
        .matches(/^[a-f\d]{24}$/i, "El ID de la categoría debe ser una cadena de 24 caracteres hexadecimales"),
    
    descripcion: yup.string().required().min(20, "La descripción debe tener al menos 20 caracteres"),
    
    // Array de IDs de tecnologías
    tecnologiasId: yup.array()
        .of(
            yup.string()
                .required("El ID de la tecnología es obligatorio")
                .matches(/^[a-f\d]{24}$/i, "Cada ID de tecnología debe ser una cadena de 24 caracteres hexadecimales")
        )
        .min(1, "Debe incluir al menos una tecnología"),
    
    horas: yup.number().required().positive().integer().min(1, "Debe ser al menos 1 hora"),
    img: yup.string().required().matches(/\.(jpg|jpeg|png)$/, "La imagen debe tener un formato jpg, jpeg o png"),
    link: yup.string().url("Debe ser una URL válida").required()
});