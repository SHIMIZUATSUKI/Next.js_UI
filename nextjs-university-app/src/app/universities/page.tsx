"use client";
import { useEffect, useState } from "react";
import UniversitySearchPanel from "@/components/UniversitySearchPanel";

type University = {
    地域: string;
    大学名: string;
};

export default function UniversityPage() {
    const [data, setData] = useState<University[]>([]);
    const [filtered, setFiltered] = useState<University[]>([]);

    useEffect(() => {
        fetch("/api/universities")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setFiltered(json); // 初期状態：全大学
            });
    }, []);

    return (
        <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">大学検索（全・エリア・個別対応）</h1>
            <UniversitySearchPanel data={data} onFilter={setFiltered} />
            <hr className="my-6 border-t border-gray-600" />


            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">検索結果（{filtered.length}校）</h2>
                <ul className="list-disc list-inside">
                    {filtered.map((u, i) => (
                        <li key={i}>
                            {u.大学名}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
