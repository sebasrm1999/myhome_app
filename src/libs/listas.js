export const personales = [
    {
        id_aviso : 1,
        asunto: 'Bienvenida',
        descripcion: 'Le damos la bienvenida a myhome. Deseamos que su permanencia en este fraccionamiento sea placentero.',
        fecha: '24/09/2020',
        status: 1
    },
    {
        id_aviso : 2,
        asunto: 'Pago atrasado',
        descripcion: 'Le informamos que ha transcurrido más del tiempo establecido para el pago del mantenimiento del mes de Agosto del 2020, por lo tanto se le cobrará un monto extra.',
        fecha: '24/09/2020',
        status: 1
    },
    {
        id_aviso : 3,
        asunto: 'Descuento',
        descripcion: 'Le informamos que, debido a su constancia en pagos a pronto plazo, se le otorgará un descuento en el pago del mantenimiento del próximo mes.',
        fecha: '24/09/2020',
        status: 2
    }
];

export const quejas = [
    {
        id_queja: 1,
        asunto: 'Demoro en jardinería',
        usuario: 'Sebas Ramos',
        area: 'Jardinería',
        status: 1,
        fecha: '25/09/2020',
        descripcion: 'Hace una semana que había encargado al jardinero que podara mi jardín delantero y quedó de hacerlo el viernes pasado, sin embargo no se ha presentado.',
        comentarios : [
            {
                id_comentario : 1,
                texto: 'Una sincera disculpa, en seguida nos comunicaremos con el responsable de jardinería',
                usuario: 'Antonio Medina',
                fecha: '25/09/2020'
            },
            {
                id_comentario : 2,
                texto: 'Gracias por atender mi queja',
                usuario: 'Sebas Ramos',
                fecha: '25/09/2020'
            }
        ]
    }
];

export const pagos = [
    {
        folio_pago: 1,
        mes: 'Abril',
        usuario: 'Sebas Ramos',
        anio: '2020',
        status: 1,
        pronto: 1,
        fecha: '2020-04-25',
        tipo: 'tarjeta',
        hora : '12:35'
    },
    {
        folio_pago: 2,
        mes: 'Mayo',
        usuario: 'Sebas Ramos',
        anio: '2020',
        status: 1,
        pronto: 0,
        fecha: '2020-05-30',
        tipo: 'paypal',
        hora : '16:40'
    },
    {
        folio_pago: 3,
        mes: 'Junio',
        usuario: 'Sebas Ramos',
        anio: '2020',
        status: 1,
        pronto: 1,
        fecha: '2020-06-15',
        tipo: 'oxxo',
        hora : '10:09'
    }
];

export const preguntas = [
    {
        id_pregunta: 1,
        titulo: '¿Dónde puedo meter una queja?',
        descripcion: 'Ingrese a la sección de Quejas que se encuentra en el menú del lado izquierdo de la aplicación. Ahí oprima el botón con el signo de +, llena el formulario y oprima Confirmar.'
    }
];

export const baseUrl = 'http://dtai.uteq.edu.mx/~ramseb188/myhome_ci/';

