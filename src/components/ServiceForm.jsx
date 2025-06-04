import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../services/AuthContext';


const ServiceForm = () => {
    const { userId } = useAuth();
    const [serviceType, setServiceType] = useState('delivery');
    const [formData, setFormData] = useState({
        startLocation: '',
        endLocation: '',
        orderDate: '',
        orderStatus: 'Pending',
        quantity: '',
        productName: '',
        startDate: '',
        expirationDate: '',
        warehouseId: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("Пожалуйста, войдите в аккаунт, чтобы продолжить.");
            return;
        }

        try {
            if (serviceType === 'delivery') {
                const response = await axios.post('https://logisticback.onrender.com/api/v1/orders/add', {
                    customerId: userId,
                    startLocation: formData.startLocation,
                    endLocation: formData.endLocation,
                    orderDate: formData.orderDate,
                    orderStatus: formData.orderStatus,
                    quantity: formData.quantity
                });
                console.log('Доставка:', response.data);
                alert('Успешно')
            } else if (serviceType === 'storage') {
                const response = await axios.post('https://logisticback.onrender.com/api/v1/products/add', {
                    product: {
                        productName: formData.productName,
                        startDate: formData.startDate,
                        expirationDate: formData.expirationDate,
                        quantity: formData.quantity,
                        customer: {
                            id: userId
                        },
                        warehouse: {
                            id: 1,
                        }
                    }
                });
                alert('Успешно')
                console.log('Хранение на складе:', response.data);
            }
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    return (
        <div className="h-auto py-5 flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center lg:max-w-7xl gap-3 w-full lg:p-10">
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="text-formText placeholder-formText font-bold border-b-2 border-black px-1 py-3 bg-transparent">
                    <option value="delivery" className=''>Доставка</option>
                    <option value="storage">Хранение товара на складе</option>
                </select>

                {serviceType === 'delivery' && (
                    <div className='flex flex-col items-center gap-y-4 '>
                            <input placeholder='Начальное место:' type="text" name="startLocation" value={formData.startLocation} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 border-black px-1 py-3 w-full bg-transparent " required />
                            <input placeholder='Конечное место:' type="text" name="endLocation" value={formData.endLocation} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required />
                            <input placeholder='Дата заказа:' type="date" name="orderDate" value={formData.orderDate} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required />
                            <input placeholder='Количество:' type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required />
                    </div>
                )}
                {serviceType === 'storage' && (
                    <>                         
                        <input placeholder='Название продукта' type="text" name="productName" value={formData.productName} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required />
                        <div className='flex flex-col gap-2'>
                            <div className='flex justify-between items-end'>
                                Дата Начала
                                <input placeholder='Дата Начала' type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required />
                            </div>
                        <div className='flex justify-between items-end'>    
                            Дата окончания:                        
                            <input placeholder='Дата окончания:' type="date" name="expirationDate" value={formData.expirationDate} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required />
                        </div>
                        </div>
                        <label>
                            <select name="warehouseId" onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required>
                                <option value="1">Almaty Logistics Warehouse №1</option>
                                <option value="1">Almaty Logistics Warehouse №2</option>
                                <option value="1">Almaty Logistics Warehouse №3</option>
                            </select>
                        </label> 
                        <input placeholder='Количество:' type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="text-formText placeholder-formText font-bold border-b-2 text- border-black px-1 py-3 bg-transparent" required />
                    </>
                )}
                <button type="submit" className="button">Отправить</button>
            </form>
        </div>
    );
};

export default ServiceForm;
