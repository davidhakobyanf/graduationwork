"use client"
import Button from "@/components/ui/Button/Button";
import Title from "@/components/ui/Title/Title";
import { useRouter } from "next/navigation";
import styles from "./PortfolioFormation.module.scss";

const PortfolioFormation = () => {
    const arr = [
        { id: 1, text: "Մոդելավորում", link: "/modeling" },
        { id: 2, text: "Օպտիմալացում", link: "/optimization" },
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

export default PortfolioFormation;
