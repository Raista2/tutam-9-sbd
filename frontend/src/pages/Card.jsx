import React from 'react';
import Kadok from "../assets/Kadok.webp";
import Ophelia from "../assets/Ophelia.webp";
import Hinako from "../assets/Hinako.webp";
import Pepe from "../assets/Pepe.webp";
import Kirschtaria from "../assets/Kirschtaria.webp";
import Beryl from "../assets/Beryl.webp";
import Daybit from "../assets/Daybit.webp";

const response = {
    page: 1,
    results: [
        {
            id: 1,
            title: "Kadoc Zemlupus",
            body: "Kadoc Zemlupus (カドック・ゼムルプス, Kadokku Zemurupusu) is one of the seven Crypters, Masters attempting to supplant the Proper Human History with that of the Lostbelt in Fate/Grand Order: Cosmos in the Lostbelt. He is the Master of Caster Anastasia. He was formerly one of forty-eight Chaldea Master Candidates and a member of Team A. As of the end of the Atlantic Lostbelt, he has rejoined Chaldea. He temporarily becomes the Master of Nitocris in the South American Lostbelt.",
            image: Kadok,
            link: "https://typemoon.fandom.com/wiki/Kadoc_Zemlupus",
        },
        {
            id: 2,
            title: "Ophelia Phamrsolone",
            body: "Ophelia Phamrsolone (オフィリア・ファムルソローネ, Ofiria Famurusorōne) is one of the seven Crypters, Masters attempting to supplant the Proper Human History with that of the Lostbelt in Fate/Grand Order: Cosmos in the Lostbelt. She is the Master of Saber Surtr (in the body of Sigurd) and was formerly one of forty eight Chaldea Master Candidates and a member of A-Team.",
            image: Ophelia,
            link: "https://typemoon.fandom.com/wiki/Ophelia_Phamrsolone",
        },
        {
            id: 3,
            title: "Hinako Akuta",
            body: "Hinako Akuta (芥ヒナコ, Akuta Hinako) is one of the seven Crypters, Masters attempting to supplant the Proper Human History with that of the Lostbelt in Fate/Grand Order: Cosmos in the Lostbelt. Despite her desired Servant class being Rider, she is the Master of Saber Prince of Lanling. She was formerly one of forty eight Chaldea Master Candidates and a member of A-Team. ",
            image: Hinako,
            link: "https://typemoon.fandom.com/wiki/Hinako_Akuta",
        },
        {
            id: 4,
            title: "Scandinavia Peperoncino",
            body: "Arou Myourenji (妙蓮寺鴉郎, Myōrenji Arō), using the pseudonym Scandinavia Peperoncino (スカンジナビア・ペペロンチーノ, Sukanjinabia Peperonchīno?), is one of the seven Crypters, Masters attempting to supplant the Proper Human History with that of the Lostbelt in Fate/Grand Order: Cosmos in the Lostbelt. He is the Master of Archer Ashwatthama. He was formerly one of forty eight Chaldea Master Candidates and a member of A-Team.",
            image: Pepe,
            link: "https://typemoon.fandom.com/wiki/Scandinavia_Peperoncino",
        },
        {
            id: 5,
            title: "Kirschtaria Wodime",
            body: "Kirschtaria Wodime (キリシュタリア・ヴォーダイム, Kirishutaria Vōdaimu) is one of the seven Crypters, Masters attempting to supplant the Proper Human History with that of the Lostbelt in Fate/Grand Order: Cosmos in the Lostbelt. He is the Master of Lancer Caenis, Saber Dioscuri, and unknown-class Atlas. He was formerly one of forty eight Chaldea Master Candidates and a member of Team A.",
            image: Kirschtaria,
            link: "https://typemoon.fandom.com/wiki/Kirschtaria_Wodime",
        },
        {
            id: 6,
            title: "Beryl Gut",
            body: "Beryl Gut (ベリル・ガット, Beriru Gatto) is one of the seven Crypters, Masters attempting to supplant the Proper Human History with that of the Lostbelt in Fate/Grand Order: Cosmos in the Lostbelt. He was formerly one of the forty eight Chaldea Master Candidates and a member of A team. He is the Master of Ruler Morgan le Fay. ",
            image: Beryl,
            link: "https://typemoon.fandom.com/wiki/Beryl_Gut",
        },
        {
            id: 7,
            title: "Daybit Sem Void",
            body: "Daybit Sem Void (デイビット・ゼム・ヴォイド, Deibitto Zemu Voido) is one of the seven Crypters, Masters attempting to supplant the Proper Human History with that of the Lostbelt in Fate/Grand Order: Cosmos in the Lostbelt. He is the Master of former Grand Berserker and Ruler Tezcatlipoca. He was formerly one of the forty eight Chaldea Master Candidates and a member of the A Team.",
            image: Daybit,
            link: "https://typemoon.fandom.com/wiki/Daybit_Sem_Void",
        },
    ],
};

const Card = ({ title, body, image, link }) => {
    const handleClick = () => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" onClick={handleClick}>
            <img
                src={image}
                alt={title}
                className="w-full h-90 object-cover"
                onError={(e) => {
                    e.target.src = `${image}?random=${Math.random()}`;
                }}
            />
            <div className="p-5">
                <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 text-left">{title}</h2>
                <p className="text-gray-600 overflow-auto max-h-40 text-justify">{body}</p>

                <div className="mt-4 text-right">
                    <span className="text-indigo-600 font-medium">Learn more &rarr;</span>
                </div>
            </div>
        </div>
    );
};

const CardGrid = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-5xl font-bold mb-8 text-center">Featured Crypter</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {response.results.map(item => (
                    <Card
                        key={item.id}
                        title={item.title}
                        body={item.body}
                        image={item.image}
                        link={item.link}
                    />
                ))}
            </div>
        </div>
    );
};

export default CardGrid;