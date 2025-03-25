"use client"
import styles from "./Home.module.scss";
import Button from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import Title from "@/components/ui/Title/Title";

const Home = () => {
    const arr = [
        { id: 1, text: "Վարկային պորտֆելի ձևավորում", link: "/creditportfolioformation" },
        { id: 2, text: "Վարկունակության վերլուծություն", link: "/creditworthinessanalysis" },
    ];

    const router = useRouter();

    const handleClick = (link) => {
        router.push(link);
    };

    return (
        <div className={styles.container}>
            <Title as="h2">
                Բանկի վարկային պորտֆելի ձևավորման և փոխառուի վարկունակության վերլուծության ավտոմացատացումը
            </Title>
            <div className={styles.containerButton}>
                {arr.map(({ id, text, link }) => (
                    <Button key={id} onClick={() => handleClick(link)}>
                        {text}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default Home;
