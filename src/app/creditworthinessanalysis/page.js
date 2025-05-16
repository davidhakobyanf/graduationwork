"use client"
import Button from "@/components/ui/Button/Button";
import Title from "@/components/ui/Title/Title";
import { useRouter } from "next/navigation";
import styles from "./CreditworthinessAnalysis.module.scss";

const CreditworthinessAnalysis = () => {
    const arr = [
        { id: 1, text: "Սքորինգ", link: "/scoring" },
        { id: 2, text: "Ռեյթինգային մեթոդ", link: "/ratingmethod" },
        { id: 3, text: "Վարկարժանությամբ վճարունակությամբ", link: "/creditworthinesssolvency" },
    ];

    const router = useRouter();

    const handleClick = (link) => {
        router.push(link);
    };

    return (
        <div className={styles.container}>
            <Title as="h2">
                Վարկային պորտֆելի ձևավորում
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

export default CreditworthinessAnalysis;
