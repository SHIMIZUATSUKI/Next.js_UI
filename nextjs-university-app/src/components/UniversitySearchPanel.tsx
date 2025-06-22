"use client";
import { useEffect, useState } from "react";

type University = {
    地域: string;
    大学名: string;
};

type Props = {
    data: University[];
    onFilter: (filtered: University[]) => void;
};

export default function UniversitySearchPanel({ data, onFilter }: Props) {
    const [mode, setMode] = useState<"all" | "area">("all");
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);

    const areas = Array.from(new Set(data.map(d => d.地域)));

    const universitiesByArea = (area: string) =>
        data.filter(d => d.地域 === area).map(d => d.大学名);

    const toggleArea = (area: string) => {
        const updated = selectedAreas.includes(area)
            ? selectedAreas.filter(a => a !== area)
            : [...selectedAreas, area];
        setSelectedAreas(updated);
        setSelectedUniversities([]); // 大学リセット
    };

    const toggleUniversity = (name: string) => {
        setSelectedUniversities(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    useEffect(() => {
        if (mode === "all") {
            onFilter(data);
        } else {
            const areaFiltered = data.filter(d => selectedAreas.includes(d.地域));
            if (selectedUniversities.length === 0) {
                onFilter(areaFiltered);
            } else {
                onFilter(areaFiltered.filter(d => selectedUniversities.includes(d.大学名)));
            }
        }
    }, [mode, selectedAreas, selectedUniversities, data, onFilter]);

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <label>
                    <input type="radio" value="all" checked={mode === "all"} onChange={() => setMode("all")} />
                    <span className="ml-1">全大学</span>
                </label>
                <label>
                    <input type="radio" value="area" checked={mode === "area"} onChange={() => setMode("area")} />
                    <span className="ml-1">エリアを選ぶ</span>
                </label>
            </div>

            {mode === "area" && (
                <div>
                    <p className="font-semibold mb-2">エリア</p>
                    <div className="grid grid-cols-2 gap-2">
                        {areas.map((area) => (
                            <label key={area}>
                                <input
                                    type="checkbox"
                                    checked={selectedAreas.includes(area)}
                                    onChange={() => toggleArea(area)}
                                />
                                <span className="ml-1">{area}</span>
                            </label>
                        ))}
                    </div>


                    {selectedAreas.length > 0 && (
                        <div className="mt-4">
                            <p className="font-semibold mb-2">大学</p>
                            {selectedAreas.map((area) => (
                                <div key={area}>
                                    <p className="underline font-medium">{area}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 ml-4 mt-2">

                                        {universitiesByArea(area).map((uni) => (
                                            <label key={uni} className="block">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUniversities.includes(uni)}
                                                    onChange={() => toggleUniversity(uni)}
                                                />
                                                <span className="ml-1">{uni}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
