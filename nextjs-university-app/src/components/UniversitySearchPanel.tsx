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

    // 🔁 保存系
    const saveSession = (key: string, value: string[]) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    };

    const loadSession = (key: string): string[] => {
        if (typeof window === "undefined") return [];
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : [];
    };

    const toggleArea = (area: string) => {
        const updated = selectedAreas.includes(area)
            ? selectedAreas.filter(a => a !== area)
            : [...selectedAreas, area];
        setSelectedAreas(updated);
        saveSession("selectedAreas", updated);
    };

    const toggleUniversity = (name: string) => {
        const updated = selectedUniversities.includes(name)
            ? selectedUniversities.filter(n => n !== name)
            : [...selectedUniversities, name];
        setSelectedUniversities(updated);
        saveSession("selectedUniversities", updated);
    };

    // 🔁 セッション復元
    useEffect(() => {
        const areas = loadSession("selectedAreas");
        const universities = loadSession("selectedUniversities");
        setSelectedAreas(areas);
        setSelectedUniversities(universities);
    }, []);

    // 🔄 フィルター処理
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
            {/* モード切り替え */}
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

            {/* エリアチェック */}
            {mode === "area" && (
                <div>
                    <p className="font-semibold mb-2">エリア</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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

                    {/* 大学チェック */}
                    {selectedAreas.length > 0 && (
                        <div className="mt-4">
                            <p className="font-semibold mb-2">大学</p>
                            {selectedAreas.map((area) => (
                                <div key={area} className="mb-4">
                                    <p className="underline font-medium">{area}</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2 ml-2">
                                        {universitiesByArea(area).map((uni) => (
                                            <label key={uni} className="block whitespace-nowrap">
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
