import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface data {
    data: ""
}

function Footer() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data: data) => {
        const mail = `+ Новый подписчик \n Почта: ${data.email}`;

        axios.post(`https://api.telegram.org/bot7403629476:AAHFWErr6gveumC9BwS2B7kQlQv4vJWCYsU/sendMessage`, {
            chat_id: -1002239673610,
            text: mail,
            parse_mode: "HTML"
        });

        reset();
    };



    return (
        <div className='w-full h-[550px] rounded-[10px] mt-[100px] mb-[100px] bg-cover bg-no-repeat bg-center flex justify-center items-center'
            style={{
                backgroundImage: `url(/images/footerBG.png)`,
            }}
        >
            <div className='text-center flex flex-col justify-center items-center gap-[30px] max-w-[1200px] w-full h-full'>
                <h1 className='font-[900] text-[50px]'>Подпишитесь на E-mail рассылку</h1>
                <p className='text-[22px] font-[500] max-w-[700px]'>Если хотиет быть в курсе последних новостей и новинок кино - заполните форму ниже и оформите бесплатную E-mail рассылку!</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex gap-[8px] items-center justify-center'>
                        <Input className='w-[425px] h-[70px] bg-white' placeholder='Введите свой E-mail адрес' type='email' {...register("email", { required: "Email обязателен" })} />
                        <Button type='submit' className='w-[180px] h-[70px] bg-[rgba(242,246,15,1)] text-black text-[17px] font-[700] hover:bg-[]'>Подписаться</Button>
                    </div>
                    {errors.email && typeof errors.email.message === 'string' && (
                        <p className="text-red-500 mt-2">{errors.email.message}</p>
                    )}                    <div className='flex gap-[10px] items-center justify-center mt-[20px] w-full'>
                        <Input type='checkbox' id='accept' className='w-[17px] h-[17px]' {...register("checkbox", { required: "Надо согласиться" })} />
                        <Label htmlFor='accept' className='w-full'>Соглашаюсь на условия политики конфиденциальности</Label>
                    </div>
                    {errors.checkbox && typeof errors.checkbox.message === 'string' && (
                        <p className="text-red-500 mt-2">{errors.checkbox.message}</p>
                    )}
                </form>
            </div>

        </div>
    );
};

export default Footer;