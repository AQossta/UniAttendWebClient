import { userId } from "../variables";



function AboutUsPage() {
    console.log(userId)
    return (
        <>
            <div className="relative w-full h-auto">
                <div
                    className="w-full h-1/3 lg:h-1/2 bg-no-repeat bg-cover"
                    style={{ backgroundImage: "url('https://orlando1464.hocoos.com/_ipx/f_webp,q_90/https://img2.hocoos.com/cache/img-pack/1324/w-1900/h-720/ww-1900/wh-720/img-pack/1324/clay-banks-xvs-ukuouao-unsplash.jpg')" }}
                >
                    <div className="w-full h-96 bg-whiteTint text-center flex items-center justify-center">
                        <h1 className="text-primaryNavy text-3xl font-normal font-Oswald lg:text-6xl">
                            Наслаждайтесь вашим новым опытом.
                        </h1>
                    </div>
                </div>
            </div>
            <div className="bg-scndCreamColor h-auto px-5 py-10">
                <div className="max-w-8xl minh min-h-96 text-center flex flex-col lg:flex-row justify-around items-center gap-y-5 mx-auto font-Oswald">
                    <div className="w-full lg:w-1/4 gap-10 flex flex-col">
                        <h3 className="text-2xl text-scndryTextColor">Про нас</h3>
                        <h1 className="text-4xl text-primaryNavy border-b-2 pb-7 border-b-black">Добро Пожаловать</h1>
                        <p className="lg:text-xl font-thin">Добро пожаловать в Almaty Logistics, где доступность, дружелюбие и гибкость идут рука об руку. Наши услуги разработаны с учетом ваших потребностей: доступные цены, дружелюбное обслуживание и гибкий график работы. Ощутите удобство и надежность с Almaty Logistics.</p>
                    </div>
                    <img className="w-full md:w-1/2" src="https://img2.hocoos.com/cache/img-pack/1324/w-1920/h-1178/x-0/y-228/ww-874/wh-536/img-pack/1324/pexels-jep-gambardella-7690078(1).jpg" alt=""/>
                </div>
            </div>

            <div className="h-auto">
                <img src="https://img2.hocoos.com/cache/img-pack/1324/w-1920/h-366/ww-1920/wh-366/img-pack/1324/luca-bravo-als7ewq41m8-unsplash.jpg" alt="" className="w-full"/>
                <div className="flex flex-col gap-y-10 py-10 px-10">
                    <h1 className="text-primaryNavy text-5xl font-semibold">Наши Результаты</h1>
                    <p className="text-2xl">Мы гордимся тем, чего мы достигли, но на этом мы не останавливаемся.</p>
                    <div className="flex text-primaryNavy flex-col lg:flex-row font-semibold items-center gap-y-5 gap-x-10">
                        <div className="text-center bg-expCardBg w-full px-10 py-8">
                            <h1 className="text-4xl">5</h1>
                            <p className="text-2xl">лет опыта</p>
                        </div>
                        <div className="text-center bg-expCardBg w-full px-10 py-8">
                            <h1 className="text-4xl">100%</h1>
                            <p className="text-2xl">Счастливые Клиенты</p>
                        </div>
                        <div className="text-center bg-expCardBg w-full px-10 py-8">
                            <h1 className="text-4xl">230+</h1>
                            <p className="text-2xl">Сделок успешно закрыты</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-scndCreamColor h-auto px-5 py-10">
                <div className="max-w-7xl minh min-h-96 text-start flex flex-col justify-center items-start gap-y-5 mx-auto">
                    <h2 className="text-scndryTextColor lg:text-xl">Повышение производительности и удовлетворенности клиентов</h2>
                    <h1 className="text-primaryNavy text-3xl lg:text-5xl font-semibold">Преимущества наших логистических услуг</h1>
                    <div className="text-sm flex flex-col lg:flex-row gap-y-5 gap-x-20 lg:text-xl">
                        <p > Наши логистические услуги в городе Алматы разработаны для предоставления комплексных решений, которые оптимизируют ваши бизнес-процессы. Используя современные технологии, мы предлагаем разнообразные функции, которые помогут вам повысить производительность и удовлетворенность клиентов. Благодаря нашей удобной платформе управление вашими логистическими проектами становится проще и быстрее, чем когда-либо прежде. А благодаря неограниченной масштабируемости вы можете развернуть одно и то же решение в нескольких местах, не беспокоясь о совместимости или проблемах с производительностью. Готовьтесь ощутить новый уровень эффективности с нашими первоклассными логистическими услугами в Алматы!</p>
                        <p > Наши логистические услуги в городе Алматы разработаны для предоставления комплексных решений, которые оптимизируют ваши бизнес-процессы. Используя современные технологии, мы предлагаем разнообразные функции, которые помогут вам повысить производительность и удовлетворенность клиентов. Благодаря нашей удобной платформе управление вашими логистическими проектами становится проще и быстрее, чем когда-либо прежде. А благодаря неограниченной масштабируемости вы можете развернуть одно и то же решение в нескольких местах, не беспокоясь о совместимости или проблемах с производительностью. Готовьтесь ощутить новый уровень эффективности с нашими первоклассными логистическими услугами в Алматы!</p>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AboutUsPage;
