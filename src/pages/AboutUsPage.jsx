/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { userId } from "../variables";

const slides = [
    {
        title: "Қатысуды басқарудың жаңа деңгейі",
        text: "UniAttend платформасы оқытушылар мен студенттерге қатысуды тиімді басқаруға мүмкіндік береді. QR-кодтар арқылы қатысу белгілеу процесі жылдам әрі сенімді.",
        img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1900&h=720&q=90",
        slideDate: "2025 жылдың 3 маусымы"
    },
    {
        title: "Оқу процесін автоматтандыру",
        text: "UniAttend сабақ кестесін құруды және қатысу журналын жүргізуді автоматтандырады, оқытушылардың уақытын үнемдейді және студенттерге ашықтық береді.",
        img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1900&h=720&q=90",
        slideDate: "2025 жылдың 1 маусымы"
    },
    {
        title: "Мобильді қолжетімділік",
        text: "UniAttend мобильді қосымшасы арқылы студенттер кез келген уақытта және кез келген жерде қатысуларын бақылай алады.",
        img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1900&h=720&q=90",
        slideDate: "2025 жылдың 30 мамыры"
    },
];

function AboutUsPage() {
    console.log(userId); // Логирование userId
    const [currentSlide, setCurrentSlide] = useState(0);
    const [startTouch, setStartTouch] = useState(0);
    const [endTouch, setEndTouch] = useState(0);
    const form = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    const handleTouchStart = (e) => {
        setStartTouch(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setEndTouch(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (startTouch - endTouch > 50) {
            nextSlide();
        } else if (startTouch - endTouch < -50) {
            prevSlide();
        }
    };

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs
            .sendForm('service_wwkh8un', 'template_38z8wfq', form.current, {
                publicKey: 'ButAhbfR6s_QD-aJL',
            })
            .then(
                () => {
                    console.log('ЖЕТКІЗІЛДІ!');
                },
                (error) => {
                    console.log('СӘТСІЗ...', error.text);
                }
            );
    };

    return (
        <div className="w-full">
            {/* Заголовок и баннер */}
            <div className="flex flex-col items-center justify-center mt-20 lg:h-screen">
                <div
                    className="absolute top-16 left-0 w-full h-screen bg-no-repeat bg-cover my-4"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1900&h=720&q=90')" }}
                >
                    <div className="relative w-full h-full bg-whiteTint"></div>
                </div>
                <div className="flex flex-col items-center z-0 w-full justify-center my-14 space-y-10">
                    <h1 className="text-primaryNavy text-3xl font-normal font-Oswald lg:text-6xl text-center">
                        UniAttend: Оқу процесін жеңілдетеміз
                    </h1>
                    <p className="font-Quicksand text-sm lg:text-lg text-center">
                        UniAttend – бұл оқытушылар мен студенттерге арналған инновациялық платформа, қатысуды басқаруды және оқу процесін автоматтандыруды жеңілдетеді.
                    </p>
                    <div className="flex w-2/3 flex-col items-center lg:flex-row lg:w-1/3 text-center gap-3">
                        <NavLink to="/login" className="bg-primaryNavy w-full lg:w-1/2 rounded py-2 my-1 font-bold font-Quicksand text-white border border-primaryNavy">
                            ҚАЗІР КІРУ
                        </NavLink>
                        <NavLink to="/contact" className="border-solid rounded border-primaryNavy w-full lg:w-1/2 py-2 border my-1 text-primaryNavy font-semibold">
                            БАЙЛАНЫСУ
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Слайдер */}
            <div className="relative w-full overflow-hidden flex flex-col">
                <div
                    className="flex transition-transform duration-1000"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {slides.map((slide, i) => (
                        <div key={i} className="flex-shrink-0 w-full h-screen relative">
                            <img src={slide.img} alt="slide img" className="object-cover w-full h-full" />
                            <div className="absolute bottom-0 left-0 p-10 bg-white bg-opacity-75 w-full text-start min-h-min">
                                <div className="lg:w-1/2">
                                    <h2 className="text-2xl font-bold">{slide.title}</h2>
                                    <p className="mt-2">{slide.text}</p>
                                    <p className="mt-2 text-sm text-gray-500">{slide.slideDate}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden lg:flex absolute justify-center items-center w-full h-3/4 px-5">
                    <div className="flex w-full justify-between">
                        <button onClick={prevSlide} className="rounded-full bg-primaryNavy p-2">
                            <FaAngleLeft size={30} color="white" />
                        </button>
                        <button onClick={nextSlide} className="rounded-full bg-primaryNavy p-2">
                            <FaAngleRight size={30} color="white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Описание платформы */}
            <div className="bg-white w-full px-4">
                <p className="font-Quicksand text-xs text-start mx-auto py-24 md:text-2xl md:w-2/3">
                    UniAttend – бұл оқу процесін басқаруды жеңілдетуге арналған платформа. Біз QR-код арқылы қатысуды белгілеу, сабақ кестесін құру және журналды нақты уақытта жүргізу сияқты құралдарды ұсынамыз. UniAttend оқытушыларға уақытты үнемдеуге, ал студенттерге өз қатысуларын бақылауға мүмкіндік береді.
                </p>
            </div>

            {/* Статистика */}
            <div className="h-auto">
                <div className="flex flex-col gap-y-10 py-10 px-10">
                    <h1 className="text-primaryNavy text-5xl font-semibold">Біздің жетістіктеріміз</h1>
                    <p className="text-2xl">Біз қол жеткізген нәтижелерімізбен мақтанамыз және одан әрі дамуды жалғастырамыз.</p>
                    <div className="flex text-primaryNavy flex-col lg:flex-row font-semibold items-center gap-y-5 gap-x-10">
                        <div className="text-center bg-scndCreamColor w-full px-10 py-8">
                            <h1 className="text-4xl">2+</h1>
                            <p className="text-2xl">Жылдық тәжірибе</p>
                        </div>
                        <div className="text-center bg-scndCreamColor w-full px-10 py-8">
                            <h1 className="text-4xl">1000+</h1>
                            <p className="text-2xl">Белсенді пайдаланушылар</p>
                        </div>
                        <div className="text-center bg-scndCreamColor w-full px-10 py-8">
                            <h1 className="text-4xl">5000+</h1>
                            <p className="text-2xl">Сканерленген QR-кодтар</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Преимущества */}
            <div className="bg-scndCreamColor h-auto px-5 py-10">
                <div className="max-w-7xl min-h-96 text-start flex flex-col justify-center items-start gap-y-5 mx-auto">
                    <h2 className="text-scndryTextColor lg:text-xl">Оқу процесін тиімді басқару</h2>
                    <h1 className="text-primaryNavy text-3xl lg:text-5xl font-semibold">UniAttend-тің артықшылықтары</h1>
                    <div className="text-sm flex flex-col lg:flex-row gap-y-5 gap-x-20 lg:text-xl">
                        <p>
                            UniAttend оқу процесін басқаруды жеңілдету үшін әзірленген. QR-код арқылы қатысуды белгілеу, сабақ кестесін басқару және нақты уақыттағы журналға қол жеткізу сияқты функциялар оқытушылардың уақытын үнемдейді. Платформа мобильді қолдан бастап веб-нұсқаға дейін барлық құрылғыларда қолжетімді.
                        </p>
                        <p>
                            Біздің платформа оқытушыларға да, студенттерге де ашықтық пен ыңғайлылықты қамтамасыз етеді. UniAttend-тің масштабталатын шешімі бірнеше оқу орнында қолданылуы мүмкін, бұл оны заманауи білім беру мекемелері үшін тамаша таңдау етеді.
                        </p>
                    </div>
                </div>
            </div>

            {/* Форма обратной связи и карта */}
            <div className="flex flex-col md:flex-row justify-center items-center">
                <div className="w-full md:w-1/2 py-5 pl-10 text-start">
                    <div className="h-auto">
                        <h3 className="text-3xl font-bold">Бізбен байланысыңыз</h3>
                        <h1 className="text-6xl mt-2 mb-4 text-primaryNavy font-semibold">UniAttend туралы сұрақтарыңыз бар ма?</h1>
                        <p className="mb-2">
                            Бізге жазыңыз, платформаны қолдану туралы кез келген сұрақ бойынша көмектесеміз!
                        </p>
                        <form ref={form} onSubmit={sendEmail} className="w-5/6 xl:w-full max-w-lg text-start">
                            <div className="flex flex-col md:flex-row md:space-x-4 mb-3">
                                <div className="w-full">
                                    <label htmlFor="fname" className="block text-sm font-medium">Аты</label>
                                    <input type="text" name="user_name" value={userId || ""} readOnly className="mt-1 p-2 border border-gray-300 w-full" />
                                </div>
                                <div className="w-full">
                                    <label htmlFor="lname" className="block text-sm font-medium">Тегі</label>
                                    <input type="text" name="user_lname" className="mt-1 p-2 border border-gray-300 w-full" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="block text-sm font-medium">Электрондық пошта</label>
                                <input type="email" name="user_email" className="mt-1 p-2 border border-gray-300 w-full" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="block text-sm font-medium">Телефон</label>
                                <input type="tel" name="user_phone_number" className="mt-1 p-2 border border-gray-300 w-full" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="block text-sm font-medium">Хабарлама</label>
                                <textarea name="message" id="message" cols="30" rows="5" className="mt-1 p-2 border border-gray-300 w-full"></textarea>
                            </div>
                            <button type="submit" className="bg-primaryNavy text-white py-2 px-4 rounded">
                                Жіберу
                            </button>
                        </form>
                    </div>
                </div>
                <div className="w-full md:w-3/5">
                    <iframe
                        className="w-full"
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A7e1b4c186a6e133a07a1e7e47acfaeee858658c&source=constructor"
                        width="850"
                        height="650"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default AboutUsPage;