import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cantidad: '',
    bebida: '',
    telefono: ''
  });

  useEffect(() => {
    const newSocket = new WebSocket('ws://18.205.225.198:4000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('Conexión WebSocket establecida correctamente');
    };

    newSocket.onmessage = handleWebSocketMessage;

    window.addEventListener('beforeunload', handleCloseWebSocket);

    return () => {
      handleCloseWebSocket();
      window.removeEventListener('beforeunload', handleCloseWebSocket);
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEnviarPagos = async () => {
    try {
      const response = await axios.post('http://54.84.1.3:3001/pagos', formData);
      console.log('Pago enviado correctamente:', response.data);
      setNotification({
        message: `Hola ${formData.nombre}, tu pago por la bebida ${formData.bebida} se ha realizado exitosamente`
      });
      setTimeout(() => {
        setNotification(null);
      }, 10000);
    } catch (error) {
      console.error('Error al enviar el pago:', error);
    }
  };

  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    setNotification(data);

    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleCloseWebSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <div className='container-fluid d-flex justify-content-center align-items-center min-vh-100'>
      <div className='col-xl-4'>
        {notification && (
          <h6 className='text-center text-success'>
            {notification.message}
          </h6>
        )}
        <form onSubmit={handleEnviarPagos} className='p-5 rounded-4 login'>
          <h3 className='text-center mb-3'>Comprar bebida</h3>
          <div className='mb-2'>
            <label htmlFor='nombre' className='form-label'>Nombre</label>
            <input type='text' name='nombre' value={formData.nombre} onChange={handleInputChange}
              className='form-control' id='nombre' placeholder='Nombre' />
          </div>
          <div className='mb-2'>
            <label htmlFor='apellido' className='form-label'>Apellido</label>
            <input type='text' name='apellido' value={formData.apellido} onChange={handleInputChange}
              className='form-control' id='apellido' placeholder='Apellido' />
          </div>
          <div className='mb-2'>
            <label htmlFor='cantidad' className='form-label'>Cantidad</label>
            <input type='number' name='cantidad' value={formData.cantidad} onChange={handleInputChange}
              className='form-control' id='cantidad' placeholder='Cantidad' />
          </div>
          <div className='mb-2'>
            <label htmlFor='telefono' className='form-label'>Teléfono</label>
            <input type='text' name='telefono' value={formData.telefono} onChange={handleInputChange}
              className='form-control' id='telefono' placeholder='Telefono' />
          </div>
          <p className='mb-2'>Bebida</p>
          <select className='form-select' name='bebida' onChange={handleInputChange}>
            <option value=''>--- Bebida ---</option>
            <option value='limonada'>Limonada</option>
            <option value='naranjada'>Naranjada</option>
            <option value='horchata'>Horchata</option>
            <option value='jamaica'>Jamaica</option>
          </select>
          <button type='submit' className='btn btn-primary border-0 p-2 w-100 mt-3'>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default App;