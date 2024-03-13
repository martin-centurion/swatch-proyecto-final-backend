export const generatorUserError = (user) => {
  return `Todos lo campos son requeridos y deben ser valido.
  Lista de campos recibidos en la solicitud:
    - first_name  : ${user.first_name}
    - last_name   : ${user.last_name}
    - age         : ${user.age}
    - email       : ${user.email}
    - password    : ${user.password} 
    `;
};
  
export const validatorUserError = (data) => {
   return `El email o contraseña son incorrectos.
   - email       : ${data.email}
   - password    : ${data.password}`;
};

export const generatorUserUpdate = (doc) =>{
  return `Todos lo campos son requerios y deben ser valido 😱.
  Lista de campos recibidos en la solicitud:
    - identification  : ${doc.documents}
    - proofOfAddress  : ${doc.documents}
    - bankStatement   : ${doc.documents}
    
    `;
};