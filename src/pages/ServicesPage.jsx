import ServiceForm from "../components/ServiceForm"


function ServicesPage(){
    return(
        <>
            <div className="relative w-full h-auto">
                <div
                    className="w-full h-1/3 lg:h-1/2 bg-no-repeat bg-cover"
                    style={{ backgroundImage: "url('https://orlando1464.hocoos.com/_ipx/f_webp,q_90/https://img2.hocoos.com/cache/img-pack/1324/w-1900/h-720/ww-1900/wh-720/img-pack/1324/clay-banks-xvs-ukuouao-unsplash.jpg')" }}
                >
                    <div className="w-full h-96 bg-none text-center flex items-center justify-center"></div>
                </div>
            </div>
            <div className="bg-scndCreamColor h-auto px-10 py-10">
                <div className="min-h-96 text-center flex flex-col lg:flex-row justify-around items-center gap-y-5 mx-auto font-Oswald">
                    <div className="w-full lg:w-3/4 gap-3 flex flex-col">
                        <h3 className="text-xl text-scndryTextColor">Цены на услуги</h3>
                        <h1 className="text-2xl text-primaryNavy pb-7">Доступные сервисы</h1>
                        <div className="flex items-center flex-col w-full lg:space-x-10 md:flex-row md:text-start">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-primaryNavy text-xl lg:text-3xl">Доставка <span className="text-scndryTextColor">100 $</span></h2>
                                <p className="text-sm lg:text-lg ">Мы предлагаем профессиональные услуги по доставке, чтобы помочь создать эффективное, современное и привлекательное решение для доставки внутри Алматы.</p>
                            </div>
                            <div className="flex flex-col gap-4 my-3">
                                <h2 className="text-primaryNavy text-xl lg:text-3xl">Хранение <span className="text-scndryTextColor">100 $</span></h2>
                                <p className="text-sm lg:text-lg">Мы предлагаем профессиональные услуги по хранению, чтобы помочь вам создать эффективное, современное и надежное решение для хранения в Алматы.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-auto md:flex md:flex-row flex flex-col-reverse">
                <div className="bg-formBg w-full py-10" >
                    <h1 className="text-center text-primaryNavy font-bold text-2xl md:text-4xl">Заказать Услугу</h1>
                    <ServiceForm/>
                </div>
                <iframe className='w-full' src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae33941f6c9165b5294fecd9c8581b4c186a6e133a07a1e7e47acfaeee858658c&amp;source=constructor" width="850" height="650"></iframe> 
            </div>
        </>
    )
}

export default ServicesPage