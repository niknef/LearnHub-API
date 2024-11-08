import yup from 'yup';

export const profesorSchema = yup.object({
    id: yup.string()
        .required("El ID del profesor es obligatorio")
        .matches(/^[a-f\d]{24}$/i, "El ID del profesor debe ser una cadena de 24 caracteres hexadecimales"),

    user: yup.object({
        id: yup.string()
            .required("El ID del usuario es obligatorio")
            .matches(/^[a-f\d]{24}$/i, "El ID del usuario debe ser una cadena de 24 caracteres hexadecimales"),
        nombre: yup.string().required("El nombre del usuario es obligatorio"),
        apellido: yup.string().required("El apellido del usuario es obligatorio"),
        mail: yup.string().email("Debe ser un correo válido").required("El correo electrónico es obligatorio"),
        role: yup.string().oneOf(["profesor"], "El rol debe ser 'profesor'").required("El rol es obligatorio")
    }).required("La información del usuario es obligatoria"),
    
    foto: yup.string()
        .required("La foto es obligatoria")
        .matches(/\.(jpg|jpeg|png)$/, "La foto debe tener un formato jpg, jpeg o png"),
    
    bio: yup.string()
        .required("La biografía es obligatoria")
        .min(10, "La biografía debe tener al menos 10 caracteres")
});