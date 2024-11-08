import yup from 'yup';

export const cursoSchema = yup.object({
    nombre: yup.string().required().min(5, "El nombre del curso debe tener al menos 5 caracteres"),

    profesor: yup.object({
        id: yup.string()
            .required("El ID del profesor es obligatorio")
            .matches(/^[a-f\d]{24}$/i, "El ID del profesor debe ser una cadena de 24 caracteres hexadecimales"),
        
        user: yup.object({
            id: yup.string()
                .required("El ID de usuario es obligatorio")
                .matches(/^[a-f\d]{24}$/i, "El ID de usuario debe ser una cadena de 24 caracteres hexadecimales"),
            nombre: yup.string().required("El nombre del usuario es obligatorio"),
            apellido: yup.string().required("El apellido del usuario es obligatorio"),
            mail: yup.string().email("Debe ser un correo válido").required("El correo electrónico es obligatorio"),
            role: yup.string().oneOf(["profesor"], "El rol debe ser 'profesor'").required(),
        }).required("La información del usuario es obligatoria"),
        
        foto: yup.string()
            .required("La foto es obligatoria")
            .matches(/\.(jpg|jpeg|png)$/, "La foto debe tener un formato jpg, jpeg o png"),
        
        bio: yup.string()
            .required("La biografía es obligatoria")
            .min(10, "La biografía debe tener al menos 10 caracteres")
    }).required("La información del profesor es obligatoria"),

    categoriaId: yup.string()
        .required("La categoría es obligatoria")
        .matches(/^[a-f\d]{24}$/i, "El ID de la categoría debe ser una cadena de 24 caracteres hexadecimales"),

    descripcion: yup.string().required().min(20, "La descripción debe tener al menos 20 caracteres"),

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