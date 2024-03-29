let cliente ={
    mesa:'',
    hora:'',
    pedido:[]
};
const categorias = {
    1:'Comida',
    2:'Bebidas',
    3:'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click',guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some(campo => campo ==='');

    if(camposVacios){
        //Verif que ya haya una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback','d-block','text-center');
            alerta.textContent= 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove()
            }, 2500);
        }
        return
    }
  //asignamos datos del formulario a una copia del objeto cliente.
   cliente = {...cliente,mesa,hora}

   //ocultar modal
   const modalFormulario = document.querySelector('#formulario');
   const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
   modalBootstrap.hide();  

   //Mostrar secciones
   mostrarSecciones();

   //Obtener platillos de la API Json-server
   obtenerPlatillos();

}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'))
}
function obtenerPlatillos(){
    const url = "http://localhost:4000/platillos";

    fetch(url)
       .then(respuesta=> respuesta.json())
       .then(resultado => mostrarPlatillos(resultado))
       .catch( error => console.log(error));
}
function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo =>{
        const row = document.createElement('div');
        row.classList.add('row','py-3','border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio =document.createElement('div');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type= 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id= `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //Funcion que detecta cantidad y platillo que se agrega
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);

            agregarPlatillo({...platillo, cantidad});
        }

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar)
        
        contenido.append(row);
    })

}
function agregarPlatillo(producto){
    //Extraer pedido
    let {pedido} = cliente;
    
    // Revisar cantidad mayor a 0
    if(producto.cantidad>0){

        //Comprobar si el elemento existe en el array
        if(pedido.some(articulo => articulo.id === producto.id)){
            //YA existe articulo, actualziar cantidad
            const pedidoActualizado = pedido.map(articulo => {
                if(articulo.id===producto.id){
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            // Se asigna el nuevo array al cliente.pedido
            cliente.pedido= [...pedidoActualizado];

        }else {
            //El articulo no existe, lo agregamos al array de pedido
            cliente.pedido= [...pedido, producto];
        }
        
    }else{
        // eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido= [...resultado];

    }

    limpiarHTML();

    if(cliente.pedido.length) {
        // Mostrar resumen de los platillos
       actualizarResumen();
    }else{
        mensajePedidoVacio();
    }
    
}
function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6','card','py-2','px-3','shadow');

    //Informacion de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
   
    //Informacion de la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');
    
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos consumidos ';
    heading.classList.add('my-4','text-center');

    //Iterar sobre el array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');
        
        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Precio del articulo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: '

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        //Subtotal del articulo
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: '
 
        const subtotalValor = document.createElement('span')
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad) ;

        //Agregar boton de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent = 'Eliminar el pedido'

        // Funcion eliminar pedido
        btnEliminar.onclick = function (){
            eliminarProducto(id);
        }
        //Agregar valores a sus contenederoes 
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        //Agregar Elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    resumen.appendChild(heading); 
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);
    
    contenido.appendChild(resumen);

    //Mostrar formulario propinas
    formularioPropinas();

}
function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while( contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}
function calcularSubtotal(precio, cantidad){
    return `$${precio * cantidad}`
}
function eliminarProducto(id){
    const {pedido} = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    limpiarHTML();

    if(cliente.pedido.length) {
        // Mostrar resumen de los platillos
       actualizarResumen();
    }else{
        mensajePedidoVacio();
    }
    //El producto se elimino, regresamos cantidad a 0 en el formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}
function mensajePedidoVacio (){
    const contenido = document.querySelector('#resumen .contenido')
    
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade elementos al pedido';

    contenido.appendChild(texto);

}
function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6','formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-2','px-3','shadow')

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Propina ';

    //Radio button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //Radio button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //Radio button 35%
    const radio35 = document.createElement('input');
    radio35.type = 'radio';
    radio35.name = 'propina';
    radio35.value = '35';
    radio35.classList.add('form-check-input');
    radio35.onclick = calcularPropina;

    const radio35Label = document.createElement('label');
    radio35Label.textContent = '35%';
    radio35Label.classList.add('form-check-label');

    const radio35Div = document.createElement('div');
    radio35Div.classList.add('form-check');

    radio35Div.appendChild(radio35);
    radio35Div.appendChild(radio35Label);

    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div); 
    divFormulario.appendChild(radio25Div); 
    divFormulario.appendChild(radio35Div); 
    formulario.appendChild(divFormulario);
    
    contenido.appendChild(formulario);
}
function calcularPropina(){
    const {pedido} = cliente;
    let subtotal = 0;

    //Calcular subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Seleccionar el radiobutton con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
    
    //Calcular Propina
    const propina = ((subtotal * parseInt(propinaSeleccionada))/100);

    //Calcular el total a pagar
    const total  = subtotal + propina;

    mostrarTotalHTML(subtotal,total,propina);
}
function mostrarTotalHTML(subtotal, total, propina){

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar','my-5');

    //Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4','fw-bold','mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4','fw-bold','mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4','fw-bold','mt-2');
    totalParrafo.textContent = 'Total: ';
 
    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;
 
    totalParrafo.appendChild(totalSpan);

    //Eliminar Ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }


    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div ');
    formulario.appendChild(divTotales);

}