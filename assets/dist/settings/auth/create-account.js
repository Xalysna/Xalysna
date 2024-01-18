   // Variable global para rastrear el paso actual
   let pasoActual = 0;

   // Función para mostrar el siguiente paso
   function siguientePaso() {
       // Oculta el paso actual
       document.getElementById(`paso${pasoActual}`).style.display = 'none';

       // Incrementa el paso
       pasoActual++;

       // Muestra el siguiente paso
       document.getElementById(`paso${pasoActual}`).style.display = 'block';
   }

   // Función para mostrar el paso anterior
   function anteriorPaso() {
       // Oculta el paso actual
       document.getElementById(`paso${pasoActual}`).style.display = 'none';

       // Decrementa el paso
       pasoActual--;

       // Muestra el paso anterior
       document.getElementById(`paso${pasoActual}`).style.display = 'block';
   }

   // Función para mostrar el formulario específico según el tipo de cuenta seleccionado
   function mostrarFormulario(tipoCuenta) {
       // Oculta todos los formularios
       document.getElementById('formularioPersonaDatos').style.display = 'none';
       document.getElementById('formularioEmpresaDatos').style.display = 'none';
       document.getElementById('formularioMarcaDatos').style.display = 'none';

       // Muestra el formulario correspondiente al tipo de cuenta seleccionado
       document.getElementById(`formulario${tipoCuenta}Datos`).style.display = 'block';
   }

   // Lógica adicional para cargar opciones específicas (días, meses, años, género, industria, categoría, etc.) en los select según tus necesidades.

   // Inicialmente muestra el paso 0
   document.getElementById(`paso${pasoActual}`).style.display = 'block';