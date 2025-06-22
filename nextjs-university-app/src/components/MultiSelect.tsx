"use client";
import { useEffect, useState } from "react";

type University = {
    地域: string;
    大学名: string;
};

type Props = {
    data: University[];
    onChange: (selected: string[]) => void;
};

export default function MultiSelect({ data, onChange }: Props) {
    const [selected, setSelected] = useState<string[]>([]);

    // 地域単位でグループ化
    const areaGroups = Array.from(
        data.reduce((map, uni) => {
            if (!map.has(uni.地域)) map.set(uni.地域, []);
            map.get(uni.地域)?.push(uni.大学名);
            return map;
        }, new Map<string, string[]>())
    );

    const toggleUniversity = (name: string) => {
        setSelected((prev) => {
            const updated = prev.includes(name)
                ? prev.filter((n) => n !== name)
                : [...prev, name];
            onChange(updated);
            return updated;
        });
    };

    const toggleAllInArea = (area: string, names: string[]) => {
        const allSelected = names.every((name) => selected.includes(name));
        const updated = allSelected
            ? selected.filter((s) => !names.includes(s)) // 全外し
            : [...new Set([...selected, ...names])];    // 全選択

        setSelected(updated);
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            {areaGroups.map(([area, universities]) => (
                <div key={area}>
                    <h3 className="font-semibold">{area}</h3>
                    <div className="ml-4">
                        <label className="block font-medium">
                            <input
                                type="checkbox"
                                checked={universities.every((u) => selected.includes(u))}
                                onChange={() => toggleAllInArea(area, universities)}
                            />
                            <span className="ml-2">{area}すべて選択</span>
                        </label>
                        {universities.map((name) => (
                            <label key={name} className="block ml-4">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(name)}
                                    onChange={() => toggleUniversity(name)}
                                />
                                <span className="ml-2">{name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
