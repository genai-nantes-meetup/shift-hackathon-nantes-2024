import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import { Button } from "@/components/ui/button.tsx";
import {getFeaturesData} from "@/api/response.tsx";

interface Features {
    feature: string;
}

interface BubbleProps {
    feature: string;
    onRemove: () => void;
}

interface SelectFeaturesProps {
    onValidated: (selectedFeatures: Features[]) => void;
}

const Bubble: React.FC<BubbleProps> = ({ feature, onRemove }) => {
    return (
        <div className="bg-black text-white rounded-full px-4 py-2 flex items-center gap-2">
            <span>{feature}</span>
            <button onClick={onRemove} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                &times;
            </button>
        </div>
    );
};

const SelectFeatures: React.FC<SelectFeaturesProps> = ({ onValidated }) => {
    const [features, setFeatures] = useState<Features[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getFeaturesData();
            setFeatures(data);
        })();
    }, []);

    const handleRemoveFeature = (featureToRemove: string) => {
        setFeatures(features.filter(({ feature }) => feature !== featureToRemove));
    };

    const handleValidate = () => {
        onValidated(features);
    };

    return (
        <div className="container mx-auto py-10 w-2/3 flex flex-col justify-center items-center gap-10">
            <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="item-1" className="bg-gray rounded-lg">
                    <AccordionTrigger>Core feature / Additional features</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                            {features.map(({ feature }, index) => (
                                <Bubble key={index} feature={feature} onRemove={() => handleRemoveFeature(feature)} />
                            ))}
                            <Button className="rounded-full bg-black hover"> +</Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-gray rounded-lg">
                    <AccordionTrigger>Competitor selection</AccordionTrigger>
                    <AccordionContent>
                        Yes. It comes with default styles that matches the other components&apos; aesthetic.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Button onClick={handleValidate}>Let's Go</Button>
        </div>
    );
};

export default SelectFeatures;
